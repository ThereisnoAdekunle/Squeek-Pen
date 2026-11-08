import { test } from "node:test";
import assert from "node:assert/strict";
import { ArenaCore, type ArenaStorage } from "../party/arenaCore";
import { PREDICTION_POINTS, rank, resolvePick, type ArenaPlayer } from "../lib/arena";
import type { FeedSnapshot, SettledEntry } from "../lib/feed";

const ORIGIN = "https://squeekpen.xyz";
const ALLOWED = "https://squeekpen.xyz,http://localhost:3000";
const entry = (round: string, outcome: SettledEntry["outcome"]): SettledEntry => ({
  round,
  outcome,
  blockHeight: "1",
  at: 0,
});

function memory(): ArenaStorage {
  const map = new Map<string, unknown>();
  return {
    async get(key) {
      return map.get(key) as any;
    },
    async put(key, value) {
      map.set(key, structuredClone(value));
    },
    async delete(key) {
      return map.delete(key);
    },
    async list({ prefix, limit = 1000 }) {
      const out = new Map<string, any>();
      for (const [key, value] of [...map].sort(([a], [b]) => a.localeCompare(b)))
        if (key.startsWith(prefix) && out.size < limit) out.set(key, structuredClone(value));
      return out;
    },
  };
}
function arena() {
  const feed = {
    snapshot: { settledRound: "100" } as FeedSnapshot | null,
    history: [] as SettledEntry[],
    down: false,
  };
  let clock = 1000;
  const core = new ArenaCore({
    storage: memory(),
    appId: "app",
    allowedOrigin: ALLOWED,
    now: () => ++clock,
    verify: async (token) => {
      const name = /^tok-(\w+)$/.exec(token)?.[1];
      if (!name) throw new Error("bad token");
      return { id: `did:${name}`, handle: `@${name}`, avatar: null, expiresAt: 9e9 };
    },
    feed: async () => {
      if (feed.down) throw new Error("down");
      return { snapshot: feed.snapshot, history: feed.history };
    },
  });
  const call = (
    path: string,
    init: { method?: string; token?: string; origin?: string | null; body?: unknown } = {},
  ) =>
    core.handle(
      new Request(`https://arena.example${path}`, {
        method: init.method ?? "GET",
        headers: {
          ...(init.origin === null ? {} : { Origin: init.origin ?? ORIGIN }),
          ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
          "content-type": "application/json",
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
      }),
    );
  const goal = (userId: string, handle: string, n = 1) =>
    call("/record", { method: "POST", origin: null, body: { userId, handle, avatar: null, zoomiesGoals: n } });
  const predict = (name: string, choice: unknown) =>
    call("/predict", { method: "POST", token: `tok-${name}`, body: { choice } });
  const mine = async (name: string) => (await call("/prediction", { token: `tok-${name}` })).json() as Promise<any>;
  const resolve = () => call("/resolve", { method: "POST", origin: null });
  return { feed, call, goal, predict, mine, resolve };
}

test("a pick resolves on the first settled round after it, never an earlier or a later one", () => {
  const pick = { choice: "Zoomies" as const, afterRound: "100", at: 0 };
  assert.equal(resolvePick(pick, []), null);
  assert.equal(resolvePick(pick, [entry("99", "Zoomies"), entry("100", "Zoomies")]), null);
  const hit = resolvePick(pick, [entry("103", "Nap"), entry("101", "Zoomies"), entry("102", "Zoomies")]);
  assert.deepEqual(hit, { round: "101", outcome: "Zoomies", correct: true });
  assert.equal(resolvePick({ ...pick, choice: "Other" }, [entry("101", "Zoomies")])?.correct, false);
  assert.equal(resolvePick({ ...pick, choice: "Other" }, [entry("101", "Jog")])?.correct, true);
});
test("rankings ignore zeros, sort by value, and break ties by who got there first", () => {
  const p = (handle: string, zoomiesGoals: number, points: number, updatedAt: number): ArenaPlayer => ({
    id: handle, handle, avatar: null, zoomiesGoals, points, correct: points / 10, missed: 0, updatedAt,
  });
  const players = [p("@a", 2, 0, 5), p("@b", 5, 10, 9), p("@c", 5, 20, 1), p("@d", 0, 0, 0)];
  assert.deepEqual(rank(players, "zoomiesGoals").map((r) => r.handle), ["@c", "@b", "@a"]);
  assert.deepEqual(rank(players, "points").map((r) => [r.handle, r.value, r.extra]), [["@c", 20, 2], ["@b", 10, 1]]);
  assert.equal(rank(players, "zoomiesGoals", 1).length, 1);
});
test("Zoomies goals from the rooms build a public leaderboard", async () => {
  const a = arena();
  assert.deepEqual((await (await a.call("/leaderboard")).json()).zoomies, []);
  await a.goal("did:ana", "@ana");
  await a.goal("did:bo", "@bo", 1);
  await a.goal("did:ana", "@ana");
  const board = await (await a.call("/leaderboard", { origin: "https://anywhere.example" })).json();
  assert.deepEqual(board.zoomies.map((r: any) => [r.handle, r.value]), [["@ana", 2], ["@bo", 1]]);
});
test("only well-formed goal reports are accepted", async () => {
  const a = arena();
  for (const body of [
    null,
    { userId: "", handle: "@x", zoomiesGoals: 1 },
    { userId: "u", handle: "x", zoomiesGoals: 1 },
    { userId: "u", handle: "@x", zoomiesGoals: 0 },
    { userId: "u", handle: "@x", zoomiesGoals: 99 },
    { userId: "u", handle: "@x", zoomiesGoals: 1.5 },
  ])
    assert.equal((await a.call("/record", { method: "POST", origin: null, body })).status, 400);
});
test("predictions need a verified X login and an allowed origin", async () => {
  const a = arena();
  assert.equal((await a.call("/prediction")).status, 401);
  assert.equal((await a.call("/prediction", { token: "nope" })).status, 401);
  assert.equal((await a.call("/prediction", { token: "tok-ana", origin: "https://evil.example" })).status, 403);
  assert.equal((await a.call("/prediction", { token: "tok-ana", origin: null })).status, 403);
  const ok = await a.call("/prediction", { token: "tok-ana" });
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get("Access-Control-Allow-Origin"), ORIGIN);
  const preflight = await a.call("/predict", { method: "OPTIONS" });
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get("Access-Control-Allow-Headers") || "", /Authorization/);
});
test("a guess is placed after the settled round and cannot be changed or doubled", async () => {
  const a = arena();
  assert.equal((await a.predict("ana", "Sprint")).status, 400);
  const placed = await (await a.predict("ana", "Zoomies")).json();
  assert.equal(placed.pending.choice, "Zoomies");
  assert.equal(placed.pending.afterRound, "100");
  assert.equal((await a.predict("ana", "Other")).status, 409);
  assert.equal((await a.mine("ana")).pending.choice, "Zoomies");
  a.feed.down = true;
  assert.equal((await a.predict("bo", "Other")).status, 503);
  a.feed.snapshot = null;
  a.feed.down = false;
  assert.equal((await a.predict("bo", "Other")).status, 503);
});
test("a correct guess earns points and shows on both boards; a wrong one costs nothing", async () => {
  const a = arena();
  await a.predict("ana", "Zoomies");
  await a.predict("bo", "Other");
  assert.equal((await a.mine("ana")).pending.choice, "Zoomies");
  // Outcomes at or before the pick's round never count.
  a.feed.history = [entry("100", "Zoomies")];
  await a.resolve();
  assert.equal((await a.mine("ana")).pending.choice, "Zoomies");
  a.feed.history = [entry("100", "Zoomies"), entry("101", "Zoomies"), entry("102", "Nap")];
  await a.resolve();
  const ana = await a.mine("ana");
  assert.equal(ana.pending, null);
  assert.equal(ana.points, PREDICTION_POINTS);
  assert.deepEqual([ana.last.round, ana.last.outcome, ana.last.correct, ana.last.points], ["101", "Zoomies", true, PREDICTION_POINTS]);
  const bo = await a.mine("bo");
  assert.equal(bo.points, 0);
  assert.equal(bo.missed, 1);
  assert.equal(bo.last.correct, false);
  // Resolving again never pays twice, and a fresh guess is allowed again.
  await a.resolve();
  assert.equal((await a.mine("ana")).points, PREDICTION_POINTS);
  assert.equal((await a.predict("ana", "Other")).status, 200);
  const board = await (await a.call("/leaderboard")).json();
  assert.deepEqual(board.oracles.map((r: any) => [r.handle, r.value, r.extra]), [["@ana", 10, 1]]);
});
test("guesses also settle when the player simply checks back, and never twice at once", async () => {
  const a = arena();
  await a.predict("ana", "Zoomies");
  a.feed.history = [entry("105", "Zoomies")];
  const [one, two, three] = await Promise.all([a.resolve(), a.mine("ana"), a.mine("ana")]);
  assert.equal(one.status, 200);
  assert.equal(two.points, PREDICTION_POINTS);
  assert.equal((await a.mine("ana")).points, PREDICTION_POINTS);
  assert.equal(three.correct, 1);
});
test("an unknown route is a 404 and a bad body never crashes", async () => {
  const a = arena();
  assert.equal((await a.call("/nope", { token: "tok-ana" })).status, 404);
  const response = await a.call("/predict", { method: "POST", token: "tok-ana" });
  assert.equal(response.status, 400);
});