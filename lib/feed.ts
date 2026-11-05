// Settled-round feed built from /v1/status alone, so play survives when /v1/core is down.
// Pure functions only: the Worker (party/feed.ts) and the browser both use them.
import { classifyWork, type Activity } from "./activity";
import { parseFeed, type HamsterFeed } from "../rules/hamster";

type Json = Record<string, any>;

export const STATUS_URL = "https://api.squeekchain.com/v1/status";
export const CORE_URL = "https://api.squeekchain.com/v1/core";
/** A feed older than this no longer sets the rules (matches rules/hamster FEED_STALE_MS). */
export const SERVICE_STALE_MS = 10 * 60 * 1000;
const HISTORY_MAX = 200;
const activities: readonly string[] = ["Nap", "Jog", "Zoomies"];

/** The feed plus the settled block, which only /v1/status carries. */
export type LiveFeed = HamsterFeed & {
  settledBlock?: string | null;
  settledRound?: string | null;
  source?: "core" | "service" | "status";
};

/** What /v1/status says is settled on-chain right now. Never the optimistic projection. */
export type StatusAnchor = {
  settledRound: string;
  cumulativeWork: string;
  blockHeight: string;
};
export type SettledOutcome = {
  outcome: Activity | null;
  outcomeRound: string | null;
};
export type SettledEntry = {
  round: string;
  outcome: Activity;
  blockHeight: string;
  at: number;
};
/** Everything the feed keeper remembers between readings. */
export type KeeperState = {
  anchor: StatusAnchor | null;
  last: SettledOutcome;
  history: SettledEntry[];
};
export type FeedSnapshot = {
  schemaVersion: 1;
  source: "status";
  round: string;
  outcome: Activity | null;
  outcomeRound: string | null;
  current: Activity | null;
  settledRound: string;
  settledBlock: string;
  refreshedAt: number;
};

export const emptyKeeperState = (): KeeperState => ({
  anchor: null,
  last: { outcome: null, outcomeRound: null },
  history: [],
});

const isDigits = (value: unknown): value is string =>
  typeof value === "string" && /^\d+$/.test(value);

export function readAnchor(status: Json | null | undefined): StatusAnchor | null {
  const anchor = status?.schemaVersion === 1 ? status.builder?.anchor : null;
  if (
    !anchor ||
    !isDigits(anchor.settledThroughRound) ||
    !isDigits(anchor.cumulativeWork) ||
    !isDigits(anchor.blockHeight)
  )
    return null;
  return {
    settledRound: anchor.settledThroughRound,
    cumulativeWork: anchor.cumulativeWork,
    blockHeight: anchor.blockHeight,
  };
}

/** Wheel speed right now, only while the measurement is fresh. Never affects scoring. */
export function readCurrent(
  status: Json | null | undefined,
  now = Date.now(),
): Activity | null {
  const measurement = status?.schemaVersion === 1 ? status.measurement : null;
  const observedAt =
    typeof measurement?.observedAt === "string"
      ? Date.parse(measurement.observedAt)
      : NaN;
  const speed = measurement?.speedMmPerSecond;
  if (
    measurement?.freshness !== "online" ||
    !Number.isFinite(observedAt) ||
    Math.abs(now - observedAt) > 120000 ||
    !Number.isFinite(speed) ||
    speed < 0
  )
    return null;
  return speed === 0 ? "Nap" : speed >= 833 ? "Zoomies" : "Jog";
}

/** The round that is open now: the one after the latest closed round. */
export function readOpenRound(status: Json | null | undefined): string | null {
  const last = status?.oracle?.latestClosure?.lastRound;
  return isDigits(last) ? (BigInt(last) + 1n).toString() : null;
}

/**
 * Compares two settled readings. A one-round move is exact. A multi-round move is
 * never averaged: only zero work proves the last round was a Nap.
 */
export function deriveSettled(
  prev: StatusAnchor | null,
  next: StatusAnchor,
): { moved: boolean } & SettledOutcome {
  const none = { outcome: null, outcomeRound: null };
  if (!prev || prev.settledRound === next.settledRound)
    return { moved: false, ...none };
  const rounds = BigInt(next.settledRound) - BigInt(prev.settledRound);
  const work = BigInt(next.cumulativeWork) - BigInt(prev.cumulativeWork);
  if (rounds <= 0n || work < 0n) return { moved: true, ...none };
  if (rounds === 1n)
    return {
      moved: true,
      outcome: classifyWork(work.toString()),
      outcomeRound: next.settledRound,
    };
  if (work === 0n)
    return { moved: true, outcome: "Nap", outcomeRound: next.settledRound };
  return { moved: true, ...none };
}

/** One keeper step: fold a /v1/status reading into the remembered state. */
export function advanceFeed(
  state: KeeperState,
  status: Json,
  now = Date.now(),
): { state: KeeperState; snapshot: FeedSnapshot } {
  const anchor = readAnchor(status);
  if (!anchor) throw new Error("Status unavailable");
  const step = deriveSettled(state.anchor, anchor);
  let last = state.last;
  let history = state.history;
  if (step.moved) {
    last = { outcome: step.outcome, outcomeRound: step.outcomeRound };
    if (step.outcome && step.outcomeRound)
      history = [
        ...history,
        {
          round: step.outcomeRound,
          outcome: step.outcome,
          blockHeight: anchor.blockHeight,
          at: now,
        },
      ].slice(-HISTORY_MAX);
  }
  return {
    state: { anchor, last, history },
    snapshot: {
      schemaVersion: 1,
      source: "status",
      round:
        readOpenRound(status) ?? (BigInt(anchor.settledRound) + 1n).toString(),
      outcome: last.outcome,
      outcomeRound: last.outcomeRound,
      current: readCurrent(status, now),
      settledRound: anchor.settledRound,
      settledBlock: anchor.blockHeight,
      refreshedAt: now,
    },
  };
}

/** Validates a keeper snapshot received over the network and turns it into a feed. */
export function snapshotToFeed(value: unknown, now = Date.now()): LiveFeed {
  const s = value as Json;
  if (
    s?.schemaVersion !== 1 ||
    !isDigits(s.round) ||
    !isDigits(s.settledRound) ||
    !isDigits(s.settledBlock) ||
    !Number.isFinite(s.refreshedAt) ||
    now - s.refreshedAt > SERVICE_STALE_MS ||
    (s.outcome !== null && !activities.includes(s.outcome)) ||
    (s.current !== null && !activities.includes(s.current)) ||
    (s.outcome !== null && !isDigits(s.outcomeRound))
  )
    throw new Error("Feed unavailable");
  return {
    round: s.round,
    outcome: s.outcome,
    outcomeRound: s.outcome === null ? null : s.outcomeRound,
    current: s.current,
    receivedAt: s.refreshedAt,
    settledBlock: s.settledBlock,
    settledRound: s.settledRound,
    source: "service",
  };
}

/** Last resort in the browser: /v1/status alone, so no settled outcome and normal rules. */
export function feedFromStatus(status: Json, now = Date.now()): LiveFeed {
  const anchor = readAnchor(status);
  if (!anchor) throw new Error("Feed unavailable");
  return {
    round:
      readOpenRound(status) ?? (BigInt(anchor.settledRound) + 1n).toString(),
    outcome: null,
    outcomeRound: null,
    current: readCurrent(status, now),
    receivedAt: now,
    settledBlock: anchor.blockHeight,
    settledRound: anchor.settledRound,
    source: "status",
  };
}

/**
 * Browser loader. Order: on-chain events from /v1/core, then the feed keeper
 * on the game server, then /v1/status alone. Any source can fail without breaking play.
 */
export async function loadFeed(options: {
  partyHost?: string | null;
  signal?: AbortSignal;
  now?: number;
}): Promise<LiveFeed> {
  const { partyHost = null, signal } = options;
  const now = options.now ?? Date.now();
  const get = async (url: string): Promise<Json> => {
    const response = await fetch(url, { signal, cache: "no-cache" });
    if (!response.ok) throw new Error("Feed unavailable");
    return response.json();
  };
  const [statusResult, coreResult] = await Promise.allSettled([
    get(STATUS_URL),
    get(CORE_URL),
  ]);
  const status = statusResult.status === "fulfilled" ? statusResult.value : null;
  const anchor = readAnchor(status);
  if (coreResult.status === "fulfilled") {
    try {
      return {
        ...parseFeed(status, coreResult.value, now),
        settledBlock: anchor?.blockHeight ?? null,
        settledRound: anchor?.settledRound ?? null,
        source: "core",
      };
    } catch {}
  }
  if (partyHost) {
    try {
      return snapshotToFeed(await get(new URL("/feed", partyHost).toString()), now);
    } catch {}
  }
  if (status) return feedFromStatus(status, now);
  throw new Error("Feed unavailable");
}