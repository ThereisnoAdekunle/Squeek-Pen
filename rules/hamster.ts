// How the last settled Squeekchain round changes a kick. Shared by practice and the room server.
import { classifyWork, type Activity } from "../lib/activity";
import {
  directions,
  resolveKick,
  type Direction,
  type Kick,
  type Match,
} from "../lib/game";

/** Chance that an active hamster advantage changes an eligible kick. */
export const TWIST_CHANCE = 0.35;
/** A feed older than this no longer sets the rules. */
export const FEED_STALE_MS = 10 * 60 * 1000;

export type Twist = "too-fast" | "long-reach";
export type HamsterKick = Kick & {
  hamster?: Activity | null;
  twist?: Twist | null;
};
export type HamsterFeed = {
  round: string;
  outcome: Activity | null;
  outcomeRound: string | null;
  /** Wheel speed right now. Null when /status is unavailable. Never affects scoring. */
  current: Activity | null;
  receivedAt: number;
};
type Json = Record<string, any>;

function eligibleTwist(
  shot: Direction,
  dive: Direction,
  hamster: Activity | null,
): Twist | null {
  if (hamster === "Zoomies" && shot === dive) return "too-fast";
  if (
    hamster === "Nap" &&
    Math.abs(directions.indexOf(shot) - directions.indexOf(dive)) === 1
  )
    return "long-reach";
  return null;
}
function secureRoll() {
  const data = new Uint32Array(1);
  crypto.getRandomValues(data);
  return data[0] / 2 ** 32;
}
/**
 * Resolves a kick under the turn's hamster rule. Zoomies lets a correctly read shot
 * beat the keeper; Nap lets the keeper reach one lane further. A timed-out player
 * never benefits. resolveKick keeps sole ownership of scoring and match end.
 */
export function resolveHamsterKick(
  match: Match,
  shot: Direction,
  dive: Direction,
  options: {
    timedOut?: boolean;
    keeperTimedOut?: boolean;
    hamster?: Activity | null;
    roll?: number;
  } = {},
): Match {
  const { timedOut = false, keeperTimedOut = false, hamster = null } = options;
  const eligible =
    timedOut || keeperTimedOut ? null : eligibleTwist(shot, dive, hamster);
  // Randomness is drawn only when an advantage can change this kick.
  const twist =
    eligible && (options.roll ?? secureRoll()) < TWIST_CHANCE ? eligible : null;
  const scoredDive =
    twist === "too-fast"
      ? directions[(directions.indexOf(shot) + 1) % directions.length]
      : twist === "long-reach"
        ? shot
        : dive;
  const next = resolveKick(match, shot, scoredDive, timedOut);
  const last: HamsterKick = {
    ...next.kicks[next.kicks.length - 1],
    dive,
    hamster,
    twist,
  };
  return { ...next, kicks: [...next.kicks.slice(0, -1), last] };
}

/** Ball flight in milliseconds. Every value fits inside the room's 4s reveal window. */
export function flightMs(hamster: Activity | null, dramatic: boolean) {
  if (hamster === "Zoomies") return dramatic ? 900 : 650;
  if (hamster === "Nap") return dramatic ? 1300 : 1050;
  return dramatic ? 1300 : 850;
}

export function hamsterRule(hamster: Activity | null) {
  if (hamster === "Zoomies")
    return {
      active: true,
      title: "Zoomies: kicker advantage",
      detail: "Faster ball. It can beat a correct dive 35% of the time.",
    };
  if (hamster === "Nap")
    return {
      active: true,
      title: "Nap: keeper advantage",
      detail: "Slower ball. The keeper can reach one lane further 35% of the time.",
    };
  if (hamster === "Jog")
    return {
      active: false,
      title: "Jog: normal rules",
      detail: "No advantage this round. Match the shot to save it.",
    };
  return {
    active: false,
    title: "Normal rules",
    detail: "No settled round to read, so no advantage applies.",
  };
}

function isDigits(value: unknown): value is string {
  return typeof value === "string" && /^\d+$/.test(value);
}
function settledOutcome(core: Json) {
  const events = (Array.isArray(core.events) ? core.events : []).map((e: Json) => ({
    name: e?.eventName,
    args: Object.fromEntries(
      (Array.isArray(e?.arguments) ? e.arguments : [])
        .filter((a: Json) => typeof a?.name === "string")
        .map((a: Json) => [a.name, a.value]),
    ),
  }));
  const batches = events
    .filter((e: Json) => e.name === "BatchSettled")
    .map((e: Json) => e.args)
    .filter((b: Json) => isDigits(b.settledThroughRound));
  const latest = batches.reduce(
    (best: Json | null, b: Json) =>
      !best || BigInt(b.settledThroughRound) > BigInt(best.settledThroughRound)
        ? b
        : best,
    null,
  );
  const none = { outcome: null, outcomeRound: null };
  if (!latest || !isDigits(latest.previousSettledThroughRound)) return none;
  const rounds =
    BigInt(latest.settledThroughRound) -
    BigInt(latest.previousSettledThroughRound);
  if (rounds <= 0n) return none;
  const outcomeRound: string = latest.settledThroughRound;
  const through = BigInt(outcomeRound);
  const after = BigInt(latest.previousSettledThroughRound);
  // Keep only records in this settled span. An unsettled newer round or a
  // duplicated log must never stand in for the final round's work.
  const records = new Map<bigint, bigint>();
  for (const event of events) {
    if (event.name !== "RoundRecorded" || !isDigits(event.args.roundId)) continue;
    const round = BigInt(event.args.roundId);
    if (round <= after || round > through) continue;
    if (!isDigits(event.args.work)) return none;
    const work = BigInt(event.args.work);
    if (records.has(round) && records.get(round) !== work) return none;
    records.set(round, work);
  }
  if (records.has(through))
    return { outcome: classifyWork(records.get(through)!.toString()), outcomeRound };

  const previous = batches.find(
    (b: Json) => b.settledThroughRound === latest.previousSettledThroughRound,
  );
  let batchWork: bigint | null = null;
  if (previous && isDigits(latest.cumulativeWork) && isDigits(previous.cumulativeWork)) {
    batchWork = BigInt(latest.cumulativeWork) - BigInt(previous.cumulativeWork);
    if (batchWork < 0n) return none;
  }
  const workRecorded = [...records.values()].reduce((sum, work) => sum + work, 0n);
  const activeRecorded = BigInt([...records.values()].filter((work) => work > 0n).length);
  const active = isDigits(latest.activeRoundCount) ? BigInt(latest.activeRoundCount) : null;
  if (batchWork !== null && workRecorded > batchWork) return none;
  if (active !== null && (active > rounds || activeRecorded > active)) return none;
  // A one-round delta is exact. A multi-round delta is never averaged.
  if (rounds === 1n && batchWork !== null)
    return { outcome: classifyWork(batchWork.toString()), outcomeRound };
  // No final log is necessary if the settlement certifies zero work, or all
  // work / active rounds have been accounted for before the final round.
  if (
    active === 0n || batchWork === 0n ||
    (batchWork !== null && batchWork === workRecorded) ||
    (active !== null && active === activeRecorded)
  ) return { outcome: "Nap" as Activity, outcomeRound };
  return none;
}
/**
 * Reads the feed from /core, the only response scoring depends on. /status is optional:
 * if it is missing, stale, or malformed, only the wheel-speed label is lost.
 */
export function parseFeed(
  status: Json | null,
  core: Json,
  now = Date.now(),
): HamsterFeed {
  if (core?.schemaVersion !== 1 || core.status !== "available")
    throw new Error("Feed unavailable");
  const genesis = core.configuration?.genesisTimestamp;
  const duration = core.configuration?.roundDuration;
  if (!isDigits(genesis) || !isDigits(duration) || BigInt(duration) === 0n)
    throw new Error("Round configuration unavailable");
  const measurement = status?.schemaVersion === 1 ? status.measurement : null;
  const observedAt =
    typeof measurement?.observedAt === "string"
      ? Date.parse(measurement.observedAt)
      : NaN;
  const fresh =
    measurement?.freshness === "online" &&
    Number.isFinite(observedAt) &&
    Math.abs(now - observedAt) <= 120000;
  const elapsed =
    BigInt(Math.floor((fresh ? observedAt : now) / 1000)) - BigInt(genesis);
  if (elapsed < 0n) throw new Error("Round not started");
  const speed = measurement?.speedMmPerSecond;
  const current: Activity | null =
    fresh && Number.isFinite(speed) && speed >= 0
      ? speed === 0
        ? "Nap"
        : speed >= 833
          ? "Zoomies"
          : "Jog"
      : null;
  return {
    round: (elapsed / BigInt(duration) + 1n).toString(),
    ...settledOutcome(core),
    current,
    receivedAt: now,
  };
}
