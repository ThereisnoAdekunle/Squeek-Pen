export type Activity = "Nap" | "Jog" | "Zoomies";
export type LiveActivity = {
  round: string;
  outcome: Activity | null;
  outcomeRound: string | null;
  current: Activity;
  observedAt: string;
  receivedAt: number;
};
type Json = Record<string, any>;
export function classifyWork(work: string): Activity {
  if (!/^\d+$/.test(work)) throw new Error("Unknown round work");
  const n = BigInt(work);
  return n === 0n ? "Nap" : n >= 300n ? "Zoomies" : "Jog";
}
export function parseActivity(
  status: Json,
  core: Json,
  now = Date.now(),
): LiveActivity {
  if (status.schemaVersion !== 1 || core.schemaVersion !== 1)
    throw new Error("Unsupported API version");
  if (core.status !== "available" || status.measurement?.freshness !== "online")
    throw new Error("Feed unavailable");
  const observedAt = status.measurement?.observedAt;
  if (
    typeof observedAt !== "string" ||
    !Number.isFinite(Date.parse(observedAt)) ||
    Math.abs(now - Date.parse(observedAt)) > 120000
  )
    throw new Error("Feed is stale");
  const genesis = core.configuration?.genesisTimestamp;
  const duration = core.configuration?.roundDuration;
  if (
    !/^\d+$/.test(genesis) ||
    !/^\d+$/.test(duration) ||
    BigInt(duration) === 0n
  )
    throw new Error("Round configuration unavailable");
  const elapsed =
    BigInt(Math.floor(Date.parse(observedAt) / 1000)) - BigInt(genesis);
  if (elapsed < 0n) throw new Error("Round not started");
  const currentRound = elapsed / BigInt(duration) + 1n;
  if (currentRound < 0n) throw new Error("Round not started");
  const events = Array.isArray(core.events)
    ? core.events
        .filter((e: Json) => e.eventName === "BatchSettled")
        .map((e: Json) =>
          Object.fromEntries(e.arguments.map((a: Json) => [a.name, a.value])),
        )
    : [];
  let outcome: Activity | null = null;
  let outcomeRound: string | null = null;
  const latest = events[0];
  // A multi-round batch cannot tell us the last individual round's outcome.
  if (
    latest &&
    /^\d+$/.test(latest.settledThroughRound) &&
    /^\d+$/.test(latest.previousSettledThroughRound) &&
    BigInt(latest.settledThroughRound) -
      BigInt(latest.previousSettledThroughRound) ===
      1n
  ) {
    const previous = events.find(
      (e: Json) => e.settledThroughRound === latest.previousSettledThroughRound,
    );
    if (
      previous &&
      /^\d+$/.test(latest.cumulativeWork) &&
      /^\d+$/.test(previous.cumulativeWork)
    ) {
      const work =
        BigInt(latest.cumulativeWork) - BigInt(previous.cumulativeWork);
      if (work >= 0n) {
        outcome = classifyWork(work.toString());
        outcomeRound = latest.settledThroughRound;
      }
    } else if (latest.activeRoundCount === "0") {
      outcome = "Nap";
      outcomeRound = latest.settledThroughRound;
    }
  }
  const speed = status.measurement.speedMmPerSecond;
  if (!Number.isFinite(speed) || speed < 0)
    throw new Error("Speed unavailable");
  return {
    round: currentRound.toString(),
    outcome,
    outcomeRound,
    current: speed === 0 ? "Nap" : speed >= 833 ? "Zoomies" : "Jog",
    observedAt,
    receivedAt: now,
  };
}
