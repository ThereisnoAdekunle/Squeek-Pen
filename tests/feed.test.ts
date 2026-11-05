import { test } from "node:test";
import assert from "node:assert/strict";
import {
  advanceFeed,
  deriveSettled,
  emptyKeeperState,
  feedFromStatus,
  loadFeed,
  readAnchor,
  readCurrent,
  readOpenRound,
  snapshotToFeed,
} from "../lib/feed";
import Server from "../party/server";

const now = Date.parse("2026-11-05T00:11:01.000Z");
// Shaped like the real /v1/status response.
const status = (
  over: { round?: string; work?: string; block?: string; closed?: string; speed?: number } = {},
) => ({
  schemaVersion: 1,
  measurement: {
    freshness: "online",
    observedAt: "2026-11-05T00:11:00.344Z",
    speedMmPerSecond: over.speed ?? 0,
  },
  builder: {
    status: "available",
    anchor: {
      cumulativeWork: over.work ?? "0",
      blockHeight: over.block ?? "0",
      settledThroughRound: over.round ?? "0",
    },
    projected: { cumulativeWork: "99999", blockHeight: "99999" },
  },
  oracle: { latestClosure: { firstRound: "170", lastRound: over.closed ?? "170" } },
});
const anchor = (round: string, work: string, block = "1") => ({
  settledRound: round,
  cumulativeWork: work,
  blockHeight: block,
});

test("the settled anchor is read, never the optimistic projection", () => {
  assert.deepEqual(readAnchor(status({ round: "206", work: "3488", block: "332" })), {
    settledRound: "206",
    cumulativeWork: "3488",
    blockHeight: "332",
  });
  assert.equal(readAnchor({ ...status(), schemaVersion: 2 }), null);
  assert.equal(readAnchor({ schemaVersion: 1, builder: {} }), null);
  const bad = status();
  (bad.builder.anchor as any).blockHeight = "12x";
  assert.equal(readAnchor(bad), null);
  assert.equal(readOpenRound(status({ closed: "170" })), "171");
  assert.equal(readOpenRound({ schemaVersion: 1 }), null);
});
test("wheel speed only counts while the measurement is fresh", () => {
  assert.equal(readCurrent(status({ speed: 0 }), now), "Nap");
  assert.equal(readCurrent(status({ speed: 400 }), now), "Jog");
  assert.equal(readCurrent(status({ speed: 833 }), now), "Zoomies");
  assert.equal(readCurrent(status({ speed: 400 }), now + 200000), null);
  const offline = status();
  offline.measurement.freshness = "offline";
  assert.equal(readCurrent(offline, now), null);
});
test("one settled round gives an exact outcome using 0, 1-299 and 300+", () => {
  const prev = anchor("205", "1000");
  assert.deepEqual(deriveSettled(prev, anchor("206", "1000")), { moved: true, outcome: "Nap", outcomeRound: "206" });
  assert.equal(deriveSettled(prev, anchor("206", "1001")).outcome, "Jog");
  assert.equal(deriveSettled(prev, anchor("206", "1299")).outcome, "Jog");
  assert.equal(deriveSettled(prev, anchor("206", "1300")).outcome, "Zoomies");
});
test("a first reading, an unchanged round and a reset never invent an outcome", () => {
  assert.deepEqual(deriveSettled(null, anchor("206", "5")), { moved: false, outcome: null, outcomeRound: null });
  assert.equal(deriveSettled(anchor("206", "5"), anchor("206", "9")).moved, false);
  assert.deepEqual(deriveSettled(anchor("206", "500"), anchor("3", "0")), { moved: true, outcome: null, outcomeRound: null });
  assert.equal(deriveSettled(anchor("205", "500"), anchor("206", "100")).outcome, null);
});
test("a multi-round jump is never averaged, and only zero work proves a Nap", () => {
  assert.deepEqual(deriveSettled(anchor("200", "10"), anchor("206", "900")), { moved: true, outcome: null, outcomeRound: null });
  assert.deepEqual(deriveSettled(anchor("200", "10"), anchor("206", "10")), { moved: true, outcome: "Nap", outcomeRound: "206" });
});
test("the keeper tracks settlements across readings and keeps a history", () => {
  let state = emptyKeeperState();
  let step = advanceFeed(state, status({ round: "205", work: "1000", block: "300" }), now);
  assert.equal(step.snapshot.outcome, null);
  assert.equal(step.snapshot.settledBlock, "300");
  assert.equal(step.snapshot.round, "171");
  state = step.state;
  step = advanceFeed(state, status({ round: "206", work: "1450", block: "301" }), now + 60000);
  assert.equal(step.snapshot.outcome, "Zoomies");
  assert.equal(step.snapshot.outcomeRound, "206");
  assert.equal(step.snapshot.settledBlock, "301");
  state = step.state;
  // Same settled round on the next poll: the outcome is remembered, not recomputed.
  step = advanceFeed(state, status({ round: "206", work: "1450", block: "301" }), now + 120000);
  assert.equal(step.snapshot.outcome, "Zoomies");
  assert.equal(step.state.history.length, 1);
  state = step.state;
  step = advanceFeed(state, status({ round: "207", work: "1450", block: "301" }), now + 180000);
  assert.equal(step.snapshot.outcome, "Nap");
  assert.deepEqual(step.state.history.map((h) => [h.round, h.outcome]), [["206", "Zoomies"], ["207", "Nap"]]);
  assert.throws(() => advanceFeed(step.state, { schemaVersion: 1 }, now));
});
test("a snapshot is validated and goes stale", () => {
  const snap = advanceFeed(emptyKeeperState(), status({ round: "5", work: "9", block: "2" }), now).snapshot;
  const feed = snapshotToFeed(snap, now + 1000);
  assert.equal(feed.settledBlock, "2");
  assert.equal(feed.source, "service");
  assert.equal(feed.outcome, null);
  assert.throws(() => snapshotToFeed(snap, now + 11 * 60 * 1000));
  assert.throws(() => snapshotToFeed({ ...snap, outcome: "Sprint" }, now));
  assert.throws(() => snapshotToFeed({ ...snap, outcome: "Nap", outcomeRound: null }, now));
  assert.throws(() => snapshotToFeed({ ...snap, schemaVersion: 2 }, now));
  assert.throws(() => snapshotToFeed(null, now));
});
test("status alone gives block height and round but never a settled outcome", () => {
  const feed = feedFromStatus(status({ round: "206", work: "3488", block: "332", speed: 900 }), now);
  assert.equal(feed.settledBlock, "332");
  assert.equal(feed.outcome, null);
  assert.equal(feed.current, "Zoomies");
  assert.equal(feed.source, "status");
  assert.throws(() => feedFromStatus({ schemaVersion: 1 }, now));
});

// loadFeed: each source can fail without taking play down.
type Routes = Record<string, unknown | Error>;
async function withFetch<T>(routes: Routes, run: () => Promise<T>) {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: any) => {
    const hit = routes[String(input)];
    if (hit === undefined || hit instanceof Error) throw hit ?? new Error("offline");
    return { ok: true, json: async () => hit } as Response;
  }) as typeof fetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}
const STATUS = "https://api.squeekchain.com/v1/status";
const CORE = "https://api.squeekchain.com/v1/core";
const HOST = "https://rooms.example.workers.dev";
const coreOk = {
  schemaVersion: 1,
  status: "available",
  configuration: { genesisTimestamp: "1793000000", roundDuration: "60" },
  events: [],
};
test("loadFeed prefers /core and adds the settled block from /status", async () => {
  const feed = await withFetch(
    { [STATUS]: status({ round: "206", work: "3488", block: "332" }), [CORE]: coreOk },
    () => loadFeed({ partyHost: HOST, now }),
  );
  assert.equal(feed.source, "core");
  assert.equal(feed.settledBlock, "332");
});
test("loadFeed falls back to the feed keeper when /core is unavailable", async () => {
  const snap = advanceFeed(emptyKeeperState(), status({ round: "206", work: "3488", block: "332" }), now).snapshot;
  const feed = await withFetch(
    {
      [STATUS]: status({ round: "206", work: "3488", block: "332" }),
      [CORE]: { schemaVersion: 1, status: "unavailable", reason: "indexer_unavailable" },
      [`${HOST}/feed`]: { ...snap, outcome: "Jog", outcomeRound: "206" },
    },
    () => loadFeed({ partyHost: HOST, now }),
  );
  assert.equal(feed.source, "service");
  assert.equal(feed.outcome, "Jog");
  assert.equal(feed.settledBlock, "332");
});
test("loadFeed uses /status alone when no other source works", async () => {
  const feed = await withFetch(
    { [STATUS]: status({ round: "206", work: "3488", block: "332" }), [CORE]: new Error("down") },
    () => loadFeed({ partyHost: null, now }),
  );
  assert.equal(feed.source, "status");
  assert.equal(feed.outcome, null);
  assert.equal(feed.settledBlock, "332");
});
test("loadFeed reports unavailable only when every source fails", async () => {
  await assert.rejects(withFetch({}, () => loadFeed({ partyHost: HOST, now })));
});

// The room falls back to the feed keeper when /core is down, and keeps the core when it is up.
class RoomFeedServer extends Server {
  core: Record<string, any> | null = null;
  async fetchCore() {
    if (!this.core) throw new Error("Feed unavailable");
    return this.core;
  }
}
const roomWith = (feed?: () => Promise<unknown>) =>
  new RoomFeedServer({ id: "ABC234", env: {}, storage: {}, getConnections: () => [], getConnection: () => undefined, feed } as any);
test("a room uses the feed keeper's settled outcome while /core is down", async () => {
  const snap = {
    ...advanceFeed(emptyKeeperState(), status({ round: "206", work: "3488", block: "332" })).snapshot,
    outcome: "Zoomies",
    outcomeRound: "206",
  };
  const room = roomWith(async () => snap);
  await room.refreshFeed();
  assert.equal(room.feed?.outcome, "Zoomies");
});
test("a room without a feed keeper, or with a failing one, stays on normal rules", async () => {
  const bare = roomWith();
  await bare.refreshFeed();
  assert.equal(bare.feed, null);
  const failing = roomWith(async () => {
    throw new Error("down");
  });
  await failing.refreshFeed();
  assert.equal(failing.feed, null);
});