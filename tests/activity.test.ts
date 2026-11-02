import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyWork, parseActivity } from "../lib/activity";
test("zero round work is Nap", () => assert.equal(classifyWork("0"), "Nap"));
const now = Date.parse("2026-11-02T18:43:53.000Z");
const status = {
  schemaVersion: 1,
  measurement: {
    freshness: "online",
    observedAt: new Date(now).toISOString(),
    speedMmPerSecond: 0,
  },
};
const event = (round: string, previous: string, work: string) => ({
  eventName: "BatchSettled",
  arguments: [
    { name: "settledThroughRound", value: round },
    { name: "previousSettledThroughRound", value: previous },
    { name: "cumulativeWork", value: work },
    { name: "activeRoundCount", value: "0" },
  ],
});
const core = {
  schemaVersion: 1,
  status: "available",
  configuration: { genesisTimestamp: "1793022600", roundDuration: "600" },
  events: [event("1037", "1036", "76007"), event("1036", "1035", "76007")],
};
test("uses actual round configuration and a single settled round", () => {
  const a = parseActivity(status, core, now);
  assert.equal(a.round, "1038");
  assert.equal(a.outcome, "Nap");
  assert.equal(a.outcomeRound, "1037");
  assert.equal(a.current, "Nap");
});
test("current speed and settled work get independent cosmetic labels", () => {
  const a = parseActivity(
    {
      ...status,
      measurement: { ...status.measurement, speedMmPerSecond: 900 },
    },
    {
      ...core,
      events: [event("1037", "1036", "76350"), event("1036", "1035", "76007")],
    },
    now,
  );
  assert.equal(a.current, "Zoomies");
  assert.equal(a.outcome, "Zoomies");
  assert.equal(classifyWork("1"), "Jog");
});
test("does not invent an outcome for multi-round settlements or missing history", () => {
  assert.equal(
    parseActivity(
      status,
      { ...core, events: [event("1037", "1034", "76007")] },
      now,
    ).outcome,
    null,
  );
  assert.equal(
    parseActivity(status, { ...core, events: [] }, now).outcome,
    null,
  );
});
test("stale, unavailable, unknown schemas, and invalid speed are rejected", () => {
  assert.throws(() => parseActivity(status, core, now + 120001));
  assert.throws(() =>
    parseActivity({ ...status, schemaVersion: 2 }, core, now),
  );
  assert.throws(() =>
    parseActivity(status, { ...core, status: "unavailable" }, now),
  );
  assert.throws(() =>
    parseActivity(
      {
        ...status,
        measurement: { ...status.measurement, speedMmPerSecond: -1 },
      },
      core,
      now,
    ),
  );
});
test("large work values stay precise and malformed values fail", () => {
  assert.equal(classifyWork("999999999999999999999999999999"), "Zoomies");
  assert.throws(() => classifyWork("-1"));
  assert.throws(() => classifyWork("1.5"));
});
