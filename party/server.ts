/**
 * The minimal room and connection shapes the game rules rely on. PartyServer
 * (see worker.ts) satisfies them, and the tests supply plain objects, so this
 * file holds the game rules only and never touches the hosting platform.
 */
namespace Party {
  export interface Connection {
    id: string;
    state: unknown;
    setState(state: unknown): unknown;
    send(message: string): void;
    close(code?: number, reason?: string): void;
  }
  export interface ConnectionContext {
    request: { headers: { get(name: string): string | null } };
  }
  export interface Room {
    id: string;
    env: Record<string, unknown>;
    storage: {
      setAlarm(time: number): Promise<void>;
      deleteAlarm(): Promise<void>;
    };
    getConnection(id: string): Connection | undefined;
    getConnections(): Iterable<Connection>;
    /** Settled-round feed kept by the Worker. Used only when /v1/core is down. */
    feed?: () => Promise<unknown>;
  }
  export interface Server {
    onConnect(connection: Connection, ctx: ConnectionContext): void | Promise<void>;
    onMessage(message: string | ArrayBuffer, sender: Connection): void | Promise<void>;
    onClose(connection: Connection): void | Promise<void>;
    onAlarm(): void | Promise<void>;
  }
}

import {
  directions,
  isDirection,
  newMatch,
  randomDirection,
  type Direction,
  type Match,
} from "../lib/game";
import type { Activity } from "../lib/activity";
import {
  FEED_STALE_MS,
  parseFeed,
  resolveHamsterKick,
  type HamsterFeed,
} from "../rules/hamster";
import { snapshotToFeed } from "../lib/feed";
import { verifyIdentity, type Identity } from "./identity";

const CORE_URL = "https://api.squeekchain.com/v1/core";
const FEED_REFRESH_MS = 30000;
const FEED_WAIT_MS = 1200;

type ConnectionState = {
  identity?: Identity;
  authenticated?: boolean;
  rateAt: number;
  rateCount: number;
  authenticating?: boolean;
};
type Player = Identity & { connectionId: string };

/** ALLOWED_ORIGIN is a comma-separated list. `https://*.example.com` matches subdomains. */
export function originAllowed(allowed: unknown, origin: string | null) {
  if (typeof allowed !== "string" || !origin) return false;
  return allowed
    .split(",")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .some((rule) => {
      if (rule === origin) return true;
      const wildcard = /^(https?:\/\/)\*(\.[^/]+)$/.exec(rule);
      if (!wildcard) return false;
      const [, scheme, suffix] = wildcard;
      if (!origin.startsWith(scheme) || !origin.endsWith(suffix)) return false;
      const host = origin.slice(scheme.length, -suffix.length);
      return /^[a-z0-9.-]+$/i.test(host);
    });
}

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}
  players: Player[] = [];
  match: Match = newMatch();
  choices = new Map<string, Direction>();
  queue = new Map<string, string>();
  stage: "waiting" | "starting" | "choosing" | "revealing" | "finished" | "abandoned" =
    "waiting";
  deadline = 0;
  rematches = new Set<string>();
  authTimers = new Map<string, ReturnType<typeof setTimeout>>();
  /** How long a dropped player can rejoin before the other player wins by walkover. */
  graceMs = 30000;
  graceTimers = new Map<string, ReturnType<typeof setTimeout>>();
  feed: HamsterFeed | null = null;
  feedCheckedAt = 0;
  turnHamster: Activity | null = null;
  verifyToken(token: string, appId: string) {
    return verifyIdentity(token, appId);
  }
  async fetchCore(): Promise<Record<string, any>> {
    const response = await fetch(CORE_URL, {
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error("Feed unavailable");
    return (await response.json()) as Record<string, any>;
  }
  /** Undefined draws a secure random roll. Tests override this to pin a result. */
  nextRoll(): number | undefined {
    return undefined;
  }
  async refreshFeed() {
    if (Date.now() - this.feedCheckedAt < FEED_REFRESH_MS) return;
    this.feedCheckedAt = Date.now();
    try {
      this.feed = parseFeed(null, await this.fetchCore());
      return;
    } catch {}
    // /v1/core is down or unusable: fall back to the settled rounds the feed keeper tracks.
    try {
      if (this.room.feed) this.feed = snapshotToFeed(await this.room.feed());
      else throw new Error("No feed service");
    } catch {
      if (this.feed && Date.now() - this.feed.receivedAt > FEED_STALE_MS)
        this.feed = null;
    }
  }
  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    if (
      !originAllowed(
        this.room.env.ALLOWED_ORIGIN,
        ctx.request.headers.get("origin"),
      )
    ) {
      connection.close(4003, "This origin is not enabled.");
      return;
    }
    if ([...this.room.getConnections()].length > 64) {
      connection.close(4008, "The room is busy.");
      return;
    }
    connection.setState({ rateAt: Date.now(), rateCount: 0 });
    this.authTimers.set(
      connection.id,
      setTimeout(() => {
        this.authTimers.delete(connection.id);
        if (!(connection.state as ConnectionState)?.authenticated)
          connection.close(4001, "Connect with X.");
      }, 8000),
    );
  }
  sendError(connection: Party.Connection, message: string, fatal = false) {
    connection.send(JSON.stringify({ type: "error", message, fatal }));
    if (fatal) connection.close(4001, message);
  }
  sendOthers(playerId: string, message: Record<string, unknown>) {
    for (const p of this.players)
      if (p.id !== playerId)
        this.room.getConnection(p.connectionId)?.send(JSON.stringify(message));
  }
  async authenticate(
    connection: Party.Connection,
    token: string,
    action: string,
  ) {
    const state = connection.state as ConnectionState;
    if (state?.authenticated || state?.authenticating) return;
    connection.setState({ ...state, authenticating: true });
    try {
      const appId = this.room.env.PRIVY_APP_ID;
      if (typeof appId !== "string")
        throw new Error("The match service is not configured yet.");
      const identity = await this.verifyToken(token, appId);
      if (!this.room.getConnection(connection.id)) return;
      connection.setState({
        ...state,
        identity,
        authenticated: true,
        authenticating: false,
      });
      clearTimeout(this.authTimers.get(connection.id));
      this.authTimers.delete(connection.id);
      if (this.room.id === "matchmaking") {
        if (action !== "quick") {
          this.sendError(
            connection,
            "Choose quick match to enter the queue.",
            true,
          );
          return;
        }
        const previous = this.queue.get(identity.id);
        if (previous && previous !== connection.id)
          this.room
            .getConnection(previous)
            ?.close(4002, "A newer queue session replaced this one.");
        this.queue.set(identity.id, connection.id);
        const pair = [...this.queue.entries()]
          .filter(([, id]) => !!this.room.getConnection(id))
          .slice(0, 2);
        if (pair.length === 2) {
          const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
          const data = new Uint8Array(10);
          crypto.getRandomValues(data);
          const code = "Q" + Array.from(data, (n) => alphabet[n % 32]).join("");
          for (const [user, id] of pair) {
            this.queue.delete(user);
            this.room
              .getConnection(id)
              ?.send(JSON.stringify({ type: "matched", room: code }));
          }
        } else connection.send(JSON.stringify({ type: "waiting" }));
        return;
      }
      if (
        !/^[A-HJ-NP-Z2-9]{6}$/.test(this.room.id) &&
        !/^Q[A-HJ-NP-Z2-9]{10}$/.test(this.room.id)
      )
        throw new Error("That room code is not valid.");
      if (action === "rejoin") {
        this.rejoin(connection, identity);
        return;
      }
      if (this.stage === "abandoned" || this.players.length >= 2)
        throw new Error("This room is full or has ended. Create a new room.");
      if (this.players.some((p) => p.id === identity.id))
        throw new Error("Use a different X account to join your own room.");
      if (
        this.players.length === 0 &&
        action === "join" &&
        !/^Q[A-HJ-NP-Z2-9]{10}$/.test(this.room.id)
      )
        throw new Error("No match has that code. Check it with your friend.");
      if (this.players.length > 0 && action === "create")
        throw new Error(
          "That room code is already in use. Create another room.",
        );
      this.players.push({ ...identity, connectionId: connection.id });
      if (this.players.length === 1)
        connection.send(JSON.stringify({ type: "waiting" }));
      else {
        await this.startTurn();
      }
    } catch (e) {
      this.sendError(
        connection,
        e instanceof Error
          ? e.message
          : "Unable to verify X login. Connect again.",
        true,
      );
    }
  }
  rejoin(connection: Party.Connection, identity: Identity) {
    const seat = this.players.find((p) => p.id === identity.id);
    if (!seat || this.stage === "waiting" || this.stage === "abandoned")
      throw new Error("That match has ended. Head back to the arena.");
    const previous = seat.connectionId;
    seat.connectionId = connection.id;
    seat.expiresAt = identity.expiresAt;
    clearTimeout(this.graceTimers.get(seat.id));
    this.graceTimers.delete(seat.id);
    if (previous && previous !== connection.id)
      this.room
        .getConnection(previous)
        ?.close(4002, "A newer connection replaced this one.");
    this.sendOthers(seat.id, { type: "opponent-back" });
    this.publish();
  }
  async startTurn() {
    if (this.players.length !== 2 || this.stage === "abandoned") return;
    // Reserve both seats before yielding to feed I/O. Publish now so a client
    // dropping during startup knows it has a match and can rejoin that seat.
    this.stage = "starting";
    this.deadline = 0;
    this.choices.clear();
    this.publish();
    // The API can be slow or down. The turn opens on time either way, on the last good data.
    let timer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      this.refreshFeed(),
      new Promise((accept) => {
        timer = setTimeout(accept, FEED_WAIT_MS);
      }),
    ]);
    clearTimeout(timer);
    if ((this.stage as string) !== "starting" || this.players.length !== 2) return;
    const usable =
      this.feed && Date.now() - this.feed.receivedAt <= FEED_STALE_MS;
    // Fixed for the whole turn, so both players read the same rule before choosing.
    this.turnHamster = usable ? this.feed!.outcome : null;
    this.stage = "choosing";
    this.choices.clear();
    this.deadline = Date.now() + 10000;
    await this.room.storage.setAlarm(this.deadline);
    this.publish();
  }
  publish() {
    const players = this.players.map(({ id, handle, avatar }) => ({
      id,
      handle,
      avatar,
    }));
    const usable =
      this.feed && Date.now() - this.feed.receivedAt <= FEED_STALE_MS;
    this.players.forEach((p, index) => {
      this.room.getConnection(p.connectionId)?.send(
        JSON.stringify({
          type: "state",
          match: this.match,
          players,
          playerIndex: index,
          deadline: this.deadline,
          remainingMs: Math.max(0, this.deadline - Date.now()),
          turnReady: this.stage === "choosing",
          youLocked: this.choices.has(p.id),
          rematchWaiting: this.rematches.has(p.id),
          hamster: this.turnHamster,
          hamsterRound: usable ? this.feed!.outcomeRound : null,
        }),
      );
    });
  }
  async settle() {
    if (this.stage !== "choosing" || this.players.length !== 2) return;
    const kicker = this.players[this.match.kicker];
    const keeper = this.players[this.match.kicker === 0 ? 1 : 0];
    const shot = this.choices.get(kicker.id) || randomDirection();
    const dive =
      this.choices.get(keeper.id) ||
      directions[(directions.indexOf(shot) + 1) % 3];
    // The roll is drawn here, after both choices are held, and only the result is sent.
    this.match = resolveHamsterKick(this.match, shot, dive, {
      timedOut: !this.choices.has(kicker.id),
      keeperTimedOut: !this.choices.has(keeper.id),
      hamster: this.turnHamster,
      roll: this.nextRoll(),
    });
    this.stage = this.match.winner === null ? "revealing" : "finished";
    this.deadline = Date.now() + 14000;
    if (this.stage === "revealing")
      await this.room.storage.setAlarm(Date.now() + 4000);
    else await this.room.storage.deleteAlarm();
    this.publish();
  }
  async onMessage(message: string | ArrayBuffer, connection: Party.Connection) {
    if (typeof message !== "string" || message.length > 16000) {
      this.sendError(connection, "The message is too large.", true);
      return;
    }
    const state = connection.state as ConnectionState | undefined;
    if (!state) return;
    const now = Date.now();
    const count = now - state.rateAt > 1000 ? 1 : state.rateCount + 1;
    connection.setState({
      ...state,
      rateAt: now - state.rateAt > 1000 ? now : state.rateAt,
      rateCount: count,
    });
    if (count > 20) {
      this.sendError(connection, "Too many requests. Rejoin the arena.", true);
      return;
    }
    let data: any;
    try {
      data = JSON.parse(message);
    } catch {
      this.sendError(connection, "Send a valid game message.");
      return;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      this.sendError(connection, "Send a valid game message.");
      return;
    }
    if (
      data.type === "authenticate" &&
      !["create", "join", "quick", "rejoin"].includes(data.action)
    ) {
      this.sendError(connection, "Choose a valid match mode.", true);
      return;
    }
    if (
      data.type === "authenticate" &&
      typeof data.token === "string" &&
      typeof data.action === "string"
    ) {
      await this.authenticate(connection, data.token, data.action);
      return;
    }
    if (!state.authenticated || !state.identity) {
      this.sendError(connection, "Connect with X before playing.", true);
      return;
    }
    if (now >= state.identity.expiresAt) {
      this.sendError(
        connection,
        "Your X session expired. Connect again.",
        true,
      );
      return;
    }
    if (!this.players.some((p) => p.connectionId === connection.id)) {
      this.sendError(connection, "Join a match first.");
      return;
    }
    if (data.type === "choose") {
      if (this.stage !== "choosing" || !isDirection(data.direction)) return;
      if (now >= this.deadline) {
        await this.settle();
        return;
      }
      if (this.choices.has(state.identity.id)) return;
      this.choices.set(state.identity.id, data.direction);
      if (this.choices.size === 2) await this.settle();
    } else if (data.type === "rematch" && this.stage === "finished") {
      this.rematches.add(state.identity.id);
      if (this.rematches.size === 2) {
        this.match = newMatch();
        this.rematches.clear();
        await this.startTurn();
      } else this.publish();
    }
  }
  async onAlarm() {
    if (this.stage === "revealing") await this.startTurn();
    else if (this.stage === "choosing") await this.settle();
  }
  async endRoom(leaverId: string, walkover: boolean) {
    this.stage = "abandoned";
    await this.room.storage.deleteAlarm();
    for (const timer of this.graceTimers.values()) clearTimeout(timer);
    this.graceTimers.clear();
    this.sendOthers(leaverId, { type: "opponent-left", walkover });
  }
  async onClose(connection: Party.Connection) {
    clearTimeout(this.authTimers.get(connection.id));
    this.authTimers.delete(connection.id);
    const state = connection.state as ConnectionState | undefined;
    if (this.room.id === "matchmaking") {
      if (
        state?.identity &&
        this.queue.get(state.identity.id) === connection.id
      )
        this.queue.delete(state.identity.id);
      return;
    }
    const seat = this.players.find((p) => p.connectionId === connection.id);
    if (!seat || this.stage === "abandoned") return;
    if (this.stage === "waiting") {
      // Nobody has joined yet, so the room simply closes with its host.
      this.players = this.players.filter((p) => p !== seat);
      return;
    }
    if (this.stage === "finished") {
      await this.endRoom(seat.id, false);
      return;
    }
    // Mid-match: the shot clock keeps running and the seat is held for the grace period.
    seat.connectionId = "";
    this.sendOthers(seat.id, {
      type: "opponent-disconnected",
      graceMs: this.graceMs,
    });
    this.graceTimers.set(
      seat.id,
      setTimeout(() => {
        this.graceTimers.delete(seat.id);
        if (seat.connectionId === "" && this.stage !== "abandoned")
          void this.endRoom(seat.id, this.match.winner === null);
      }, this.graceMs),
    );
  }
}