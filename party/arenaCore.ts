import {
  PREDICTION_POINTS,
  newPlayer,
  rank,
  resolvePick,
  type ArenaPlayer,
  type Leaderboard,
  type MyPrediction,
  type Pick,
  type PickChoice,
  type PickResult,
  type ZoomiesGoalEvent,
} from "../lib/arena";
import type { FeedSnapshot, SettledEntry } from "../lib/feed";
import type { Identity } from "./identity";
import { originAllowed } from "./server";

export type ArenaStorage = {
  get<T = unknown>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<unknown>;
  list<T = unknown>(options: { prefix: string; limit?: number }): Promise<Map<string, T>>;
};
export type ArenaDeps = {
  storage: ArenaStorage;
  appId: string;
  allowedOrigin: string;
  verify(token: string, appId: string): Promise<Identity>;
  /** The feed keeper's current snapshot and its settled-outcome history. */
  feed(): Promise<{ snapshot: FeedSnapshot | null; history: SettledEntry[] }>;
  now?: () => number;
};

const BOARD_TTL_MS = 15_000;
const LIST_LIMIT = 2000;
const choices: readonly string[] = ["Zoomies", "Other"];

const json = (body: unknown, status = 200, headers: HeadersInit = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/**
 * Leaderboard and prediction game. Every change is serialized, so two requests
 * can never award the same prediction twice. Identity always comes from a
 * verified Privy token, never from the request body.
 */
export class ArenaCore {
  private queue: Promise<unknown> = Promise.resolve();
  private board: { at: number; value: Leaderboard } | null = null;
  constructor(private readonly deps: ArenaDeps) {}

  private now() {
    return this.deps.now?.() ?? Date.now();
  }
  private serial<T>(task: () => Promise<T>): Promise<T> {
    const run = this.queue.then(task, task);
    this.queue = run.catch(() => undefined);
    return run;
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const isPublic = request.method === "GET" && url.pathname === "/leaderboard";
    const isInternal = url.pathname === "/record" || url.pathname === "/resolve";

    // Browser calls: the leaderboard is public, everything else needs an allowed origin.
    let cors: Record<string, string> = {};
    if (!isInternal) {
      if (isPublic) cors = { "Access-Control-Allow-Origin": "*" };
      else if (originAllowed(this.deps.allowedOrigin, origin))
        cors = {
          "Access-Control-Allow-Origin": origin!,
          Vary: "Origin",
        };
      else return json({ error: "This origin is not enabled." }, 403);
      cors["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
      cors["Access-Control-Allow-Headers"] = "Authorization, Content-Type";
      if (request.method === "OPTIONS")
        return new Response(null, { status: 204, headers: cors });
    }
    const reply = (body: unknown, status = 200) => json(body, status, cors);

    try {
      if (url.pathname === "/leaderboard" && request.method === "GET")
        return reply(await this.leaderboard());
      if (url.pathname === "/prediction" && request.method === "GET") {
        const who = await this.who(request);
        return reply(await this.serial(() => this.mine(who)));
      }
      if (url.pathname === "/predict" && request.method === "POST") {
        const who = await this.who(request);
        const body = (await request.json().catch(() => null)) as { choice?: unknown } | null;
        if (!body || typeof body.choice !== "string" || !choices.includes(body.choice))
          return reply({ error: "Choose Zoomies or Other." }, 400);
        return this.predict(who, body.choice as PickChoice, reply);
      }
      if (isInternal && request.method === "POST") {
        if (url.pathname === "/resolve") {
          await this.serial(() => this.resolveAll());
          return reply({ ok: true });
        }
        const event = (await request.json().catch(() => null)) as ZoomiesGoalEvent | null;
        const done = await this.serial(() => this.record(event));
        return reply({ ok: done }, done ? 200 : 400);
      }
    } catch (error) {
      if (error instanceof AuthError) return reply({ error: error.message }, 401);
      return reply({ error: "Something went wrong. Try again." }, 500);
    }
    return reply({ error: "Not found." }, 404);
  }

  private async who(request: Request): Promise<Identity> {
    const header = request.headers.get("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token || token.length > 6000) throw new AuthError("Sign in with X first.");
    try {
      return await this.deps.verify(token, this.deps.appId);
    } catch {
      throw new AuthError("Unable to confirm your X login.");
    }
  }

  private async player(who: Pick2): Promise<ArenaPlayer> {
    const { storage } = this.deps;
    const current = await storage.get<ArenaPlayer>(`p:${who.id}`);
    // The handle and avatar follow the verified account, so renamed accounts stay current.
    return {
      ...(current ?? newPlayer(who.id, who.handle, who.avatar, this.now())),
      handle: who.handle,
      avatar: who.avatar,
    };
  }

  /** Goals scored in Zoomies turns come only from the room servers, never from browsers. */
  private async record(event: ZoomiesGoalEvent | null): Promise<boolean> {
    if (
      !event ||
      typeof event.userId !== "string" ||
      !event.userId ||
      typeof event.handle !== "string" ||
      !/^@\w{1,50}$/.test(event.handle) ||
      !Number.isInteger(event.zoomiesGoals) ||
      event.zoomiesGoals < 1 ||
      event.zoomiesGoals > 5
    )
      return false;
    const avatar = typeof event.avatar === "string" ? event.avatar : null;
    const player = await this.player({ id: event.userId, handle: event.handle, avatar });
    await this.deps.storage.put(`p:${event.userId}`, {
      ...player,
      zoomiesGoals: player.zoomiesGoals + event.zoomiesGoals,
      updatedAt: this.now(),
    });
    this.board = null;
    return true;
  }

  private async predict(
    who: Identity,
    choice: PickChoice,
    reply: (body: unknown, status?: number) => Response,
  ): Promise<Response> {
    const feed = await this.deps.feed().catch(() => null);
    if (!feed?.snapshot) return reply({ error: "The wheel feed is unavailable. Try again soon." }, 503);
    const settled = feed.snapshot.settledRound;
    return this.serial(async () => {
      await this.resolveFor(who.id, feed.history);
      const { storage } = this.deps;
      if (await storage.get<Pick>(`pick:${who.id}`))
        return reply({ error: "You already have a guess waiting for the wheel." }, 409);
      await storage.put(`pick:${who.id}`, { choice, afterRound: settled, at: this.now() } satisfies Pick);
      await storage.put(`p:${who.id}`, { ...(await this.player(who)), updatedAt: this.now() });
      return reply(await this.mine(who, settled));
    });
  }

  private async mine(who: Identity, settledRound?: string | null): Promise<MyPrediction> {
    const { storage } = this.deps;
    const feed = await this.deps.feed().catch(() => null);
    if (feed) await this.resolveFor(who.id, feed.history);
    const player = await storage.get<ArenaPlayer>(`p:${who.id}`);
    return {
      pending: (await storage.get<Pick>(`pick:${who.id}`)) ?? null,
      last: (await storage.get<PickResult>(`last:${who.id}`)) ?? null,
      points: player?.points ?? 0,
      correct: player?.correct ?? 0,
      missed: player?.missed ?? 0,
      settledRound: settledRound ?? feed?.snapshot?.settledRound ?? null,
    };
  }

  /** Settles one player's open guess against the first settled round after it. */
  private async resolveFor(id: string, history: SettledEntry[]): Promise<void> {
    const { storage } = this.deps;
    const pick = await storage.get<Pick>(`pick:${id}`);
    if (!pick) return;
    const result = resolvePick(pick, history);
    if (!result) return;
    const player = await storage.get<ArenaPlayer>(`p:${id}`);
    if (!player) {
      await storage.delete(`pick:${id}`);
      return;
    }
    const points = result.correct ? PREDICTION_POINTS : 0;
    await storage.put(`p:${id}`, {
      ...player,
      points: player.points + points,
      correct: player.correct + (result.correct ? 1 : 0),
      missed: player.missed + (result.correct ? 0 : 1),
      updatedAt: this.now(),
    });
    await storage.put(`last:${id}`, {
      choice: pick.choice,
      round: result.round,
      outcome: result.outcome,
      correct: result.correct,
      points,
      at: this.now(),
    } satisfies PickResult);
    await storage.delete(`pick:${id}`);
    this.board = null;
  }

  /** Called by the cron so guesses settle even when nobody has the site open. */
  private async resolveAll(): Promise<void> {
    const feed = await this.deps.feed().catch(() => null);
    if (!feed) return;
    const picks = await this.deps.storage.list<Pick>({ prefix: "pick:", limit: LIST_LIMIT });
    for (const key of picks.keys()) await this.resolveFor(key.slice(5), feed.history);
  }

  private async leaderboard(): Promise<Leaderboard> {
    const now = this.now();
    if (this.board && now - this.board.at < BOARD_TTL_MS) return this.board.value;
    const rows = await this.deps.storage.list<ArenaPlayer>({ prefix: "p:", limit: LIST_LIMIT });
    const players = [...rows.values()];
    const value: Leaderboard = {
      zoomies: rank(players, "zoomiesGoals"),
      oracles: rank(players, "points"),
      generatedAt: now,
    };
    this.board = { at: now, value };
    return value;
  }
}

type Pick2 = { id: string; handle: string; avatar: string | null };
class AuthError extends Error {}