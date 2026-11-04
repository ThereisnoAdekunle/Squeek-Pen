import { test } from "node:test";
import assert from "node:assert/strict";
import { directions, newMatch, resolveKick } from "../lib/game";
import {
  flightMs,
  hamsterRule,
  parseFeed,
  resolveHamsterKick,
  type HamsterKick,
} from "../rules/hamster";

const last = (m: ReturnType<typeof newMatch>) =>
  m.kicks[m.kicks.length - 1] as HamsterKick;

test("Jog and missing feed data follow the base penalty rules for all nine pairs", () => {
  for (const hamster of ["Jog", null] as const)
    for (const shot of directions)
      for (const dive of directions)
        assert.deepEqual(
          resolveHamsterKick(newMatch(), shot, dive, { hamster, roll: 0 }).score,
          resolveKick(newMatch(), shot, dive).score,
        );
});
test("Zoomies can beat a correct dive and only when the roll lands", () => {
  const beaten = resolveHamsterKick(newMatch(), "left", "left", {
    hamster: "Zoomies",
    roll: 0.1,
  });
  assert.deepEqual(beaten.score, [1, 0]);
  assert.equal(last(beaten).twist, "too-fast");
  assert.equal(last(beaten).dive, "left");
  const held = resolveHamsterKick(newMatch(), "left", "left", {
    hamster: "Zoomies",
    roll: 0.35,
  });
  assert.deepEqual(held.score, [0, 0]);
  assert.equal(last(held).twist, null);
});
test("Nap extends the dive by one lane, never across two", () => {
  const reached = resolveHamsterKick(newMatch(), "center", "left", {
    hamster: "Nap",
    roll: 0.1,
  });
  assert.deepEqual(reached.score, [0, 0]);
  assert.equal(last(reached).twist, "long-reach");
  assert.equal(last(reached).goal, false);
  assert.equal(last(reached).dive, "left");
  const far = resolveHamsterKick(newMatch(), "right", "left", {
    hamster: "Nap",
    roll: 0,
  });
  assert.deepEqual(far.score, [1, 0]);
  assert.equal(last(far).twist, null);
});
test("a timed-out player never gets the advantage", () => {
  const kickerLate = resolveHamsterKick(newMatch(), "left", "left", {
    timedOut: true,
    hamster: "Zoomies",
    roll: 0,
  });
  assert.deepEqual(kickerLate.score, [0, 0]);
  const keeperLate = resolveHamsterKick(newMatch(), "center", "left", {
    keeperTimedOut: true,
    hamster: "Nap",
    roll: 0,
  });
  assert.deepEqual(keeperLate.score, [1, 0]);
});
test("equal turns and match end still come from the base rules", () => {
  let m = newMatch();
  for (let i = 0; i < 3; i++) {
    m = resolveHamsterKick(m, "left", "left", { hamster: "Zoomies", roll: 0 });
    assert.equal(m.winner, null);
    m = resolveHamsterKick(m, "left", "right", { hamster: "Nap", roll: 1 });
    if (i < 2) assert.equal(m.winner, null);
  }
  // Tied 3-3 with equal turns: a tie cannot end the match.
  assert.deepEqual(m.score, [3, 3]);
  assert.equal(m.winner, null);
});
test("the advantage moves goal rates the right way under random play", () => {
  const rate = (hamster: "Zoomies" | "Nap" | "Jog") => {
    let goals = 0;
    const steps = 200;
    for (const shot of directions)
      for (const dive of directions)
        for (let i = 0; i < steps; i++)
          goals += resolveHamsterKick(newMatch(), shot, dive, {
            hamster,
            roll: (i + 0.5) / steps,
          }).score[0];
    return goals / (9 * steps);
  };
  assert.ok(rate("Zoomies") > rate("Jog"));
  assert.ok(rate("Nap") < rate("Jog"));
});
test("every flight fits the room's reveal window and rules name the advantage", () => {
  for (const hamster of ["Nap", "Jog", "Zoomies", null] as const)
    for (const dramatic of [true, false])
      assert.ok(500 + flightMs(hamster, dramatic) + 1300 < 4000);
  assert.ok(flightMs("Zoomies", false) < flightMs("Jog", false));
  assert.ok(flightMs("Nap", false) > flightMs("Jog", false));
  assert.equal(hamsterRule("Zoomies").active, true);
  assert.equal(hamsterRule("Nap").active, true);
  assert.equal(hamsterRule("Jog").active, false);
  assert.equal(hamsterRule(null).active, false);
});

const now = Date.parse("2026-11-02T18:43:53.000Z");
const status = {
  schemaVersion: 1,
  measurement: {
    freshness: "online",
    observedAt: new Date(now).toISOString(),
    speedMmPerSecond: 900,
  },
};
const event = (round: string, previous: string, work: string, active = "1") => ({
  eventName: "BatchSettled",
  arguments: [
    { name: "settledThroughRound", value: round },
    { name: "previousSettledThroughRound", value: previous },
    { name: "cumulativeWork", value: work },
    { name: "activeRoundCount", value: active },
  ],
});
const core = (events: unknown[]) => ({
  schemaVersion: 1,
  status: "available",
  configuration: { genesisTimestamp: "1793022600", roundDuration: "600" },
  events,
});
test("the outcome comes from the last settled round", () => {
  const feed = parseFeed(
    status,
    core([event("1037", "1036", "500"), event("1036", "1035", "100")]),
    now,
  );
  assert.equal(feed.round, "1038");
  assert.equal(feed.outcome, "Zoomies");
  assert.equal(feed.outcomeRound, "1037");
  assert.equal(feed.current, "Zoomies");
});
test("unexplained multi-round work is Unknown, never a batch average", () => {
  const rated = (work: string) =>
    parseFeed(
      status,
      core([event("1037", "1034", work), event("1034", "1033", "0")]),
      now,
    ).outcome;
  assert.equal(rated("0"), "Nap");
  assert.equal(rated("600"), null);
  assert.equal(rated("900"), null);
});
const recorded = (round: string, work: string) => ({
  eventName: "RoundRecorded",
  arguments: [
    { name: "roundId", value: round },
    { name: "work", value: work },
  ],
});
test("a zero-work tail after a busy round is Nap, never Zoomies", () => {
  const feed = parseFeed(null, core([
    event("102", "100", "600", "1"),
    recorded("101", "600"),
    event("100", "99", "0", "0"),
  ]), now);
  assert.equal(feed.outcome, "Nap");
  assert.equal(feed.outcomeRound, "102");
});
test("the final RoundRecorded overrides a batch's average", () => {
  for (const [work, outcome] of [["0", "Nap"], ["1", "Jog"], ["300", "Zoomies"]]) {
    const feed = parseFeed(null, core([
      recorded("102", work),
      event("102", "100", "1000", "2"),
      event("100", "99", "0", "0"),
    ]), now);
    assert.equal(feed.outcome, outcome);
    assert.equal(feed.outcomeRound, "102");
  }
});
test("a final record works without the preceding batch; newer unsettled records do not count", () => {
  const feed = parseFeed(null, core([
    recorded("103", "900"),
    recorded("102", "120"),
    event("102", "100", "600", "2"),
  ]), now);
  assert.equal(feed.outcome, "Jog");
  assert.equal(feed.outcomeRound, "102");
});
test("a certified all-zero batch and accounted active rounds prove a Nap tail", () => {
  assert.equal(parseFeed(null, core([event("102", "100", "600", "0")]), now).outcome, "Nap");
  assert.equal(parseFeed(null, core([
    event("102", "100", "600", "1"), recorded("101", "600"),
  ]), now).outcome, "Nap");
});
test("incomplete, duplicate or unrelated records cannot invent a final outcome", () => {
  const batch = [event("103", "100", "600", "2"), event("100", "99", "0", "0")];
  for (const records of [
    [recorded("101", "300")],
    [recorded("101", "300"), recorded("101", "300")],
    [recorded("99", "600"), recorded("104", "600")],
    [recorded("103", "invalid")],
  ]) assert.equal(parseFeed(null, core([...batch, ...records]), now).outcome, null);
});
test("a settled outcome survives a missing or stale /status", () => {
  const events = [event("1037", "1036", "100"), event("1036", "1035", "100")];
  const missing = parseFeed(null, core(events), now);
  assert.equal(missing.outcome, "Nap");
  assert.equal(missing.current, null);
  assert.equal(missing.round, "1038");
  const stale = parseFeed(status, core(events), now + 600000);
  assert.equal(stale.outcome, "Nap");
  assert.equal(stale.current, null);
  assert.equal(stale.round, "1039");
});
test("no usable history gives no outcome instead of a guess", () => {
  assert.equal(parseFeed(status, core([]), now).outcome, null);
  assert.equal(
    parseFeed(status, core([event("1037", "1036", "100")]), now).outcome,
    null,
  );
  assert.equal(
    parseFeed(status, core([event("1037", "1036", "100", "0")]), now).outcome,
    "Nap",
  );
  assert.equal(
    parseFeed(
      status,
      core([event("1037", "1036", "5"), event("1036", "1035", "100")]),
      now,
    ).outcome,
    null,
  );
});
test("unavailable or unknown core responses are rejected", () => {
  assert.throws(() => parseFeed(status, { ...core([]), schemaVersion: 2 }, now));
  assert.throws(() => parseFeed(status, { ...core([]), status: "down" }, now));
  assert.throws(() =>
    parseFeed(status, { ...core([]), configuration: {} }, now),
  );
});
