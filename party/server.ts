import type * as Party from "partykit/server";
import {
  directions,
  isDirection,
  newMatch,
  randomDirection,
  resolveKick,
  type Direction,
  type Match,
} from "../lib/game";
import { verifyIdentity, type Identity } from "./identity";

type ConnectionState = {
  identity?: Identity;
  authenticated?: boolean;
  rateAt: number;
  rateCount: number;
  authenticating?: boolean;
};
type Player = Identity & { connectionId: string };
export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}
  players: Player[] = [];
  match: Match = newMatch();
  choices = new Map<string, Direction>();
  queue = new Map<string, string>();
  stage: "waiting" | "choosing" | "revealing" | "finished" | "abandoned" =
    "waiting";
  deadline = 0;
  rematches = new Set<string>();
  authTimers = new Map<string, ReturnType<typeof setTimeout>>();
  verifyToken(token: string, appId: string) {
    return verifyIdentity(token, appId);
  }
  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    const origin = this.room.env.ALLOWED_ORIGIN;
    if (
      typeof origin !== "string" ||
      ctx.request.headers.get("origin") !== origin
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
      if (this.stage === "abandoned" || this.players.length >= 2)
        throw new Error("This room is full or has ended. Create a new room.");
      if (this.players.some((p) => p.id === identity.id))
        throw new Error("Use a different X account to join your own room.");
      if (
        this.players.length === 0 &&
        action === "join" &&
        !this.room.id.startsWith("Q")
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
  async startTurn() {
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
    this.players.forEach((p, index) => {
      this.room
        .getConnection(p.connectionId)
        ?.send(
          JSON.stringify({
            type: "state",
            match: this.match,
            players,
            playerIndex: index,
            deadline: this.deadline,
            turnReady: this.stage === "choosing",
            rematchWaiting: this.rematches.has(p.id),
          }),
        );
    });
  }
  async settle() {
    if (this.stage !== "choosing") return;
    const kicker = this.players[this.match.kicker];
    const keeper = this.players[this.match.kicker === 0 ? 1 : 0];
    const shot = this.choices.get(kicker.id) || randomDirection();
    const dive =
      this.choices.get(keeper.id) ||
      directions[(directions.indexOf(shot) + 1) % 3];
    this.match = resolveKick(
      this.match,
      shot,
      dive,
      !this.choices.has(kicker.id),
    );
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
      !["create", "join", "quick"].includes(data.action)
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
    if (this.players.some((p) => p.connectionId === connection.id)) {
      this.stage = "abandoned";
      await this.room.storage.deleteAlarm();
      for (const p of this.players) {
        if (p.connectionId !== connection.id)
          this.room
            .getConnection(p.connectionId)
            ?.send(JSON.stringify({ type: "opponent-left" }));
      }
    }
  }
}
