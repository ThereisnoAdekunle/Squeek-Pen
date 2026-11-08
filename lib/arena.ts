// Shared by the Worker (party/arenaCore.ts) and the browser: types and pure rules
// for the Zoomies leaderboard and the "next settled round" prediction game.
import type { Activity } from "./activity";
import type { SettledEntry } from "./feed";

export const PREDICTION_POINTS = 10;
export const BOARD_SIZE = 10;
export type PickChoice = "Zoomies" | "Other";

/** One player's record, keyed by their verified X account. */
export type ArenaPlayer = {
  id: string;
  handle: string;
  avatar: string | null;
  /** Goals scored in online matches while the settled rule was Zoomies. */
  zoomiesGoals: number;
  points: number;
  correct: number;
  missed: number;
  updatedAt: number;
};
/** An open guess. It resolves on the first settled round after `afterRound`. */
export type Pick = { choice: PickChoice; afterRound: string; at: number };
export type PickResult = {
  choice: PickChoice;
  round: string;
  outcome: Activity;
  correct: boolean;
  points: number;
  at: number;
};
export type LeaderRow = {
  handle: string;
  avatar: string | null;
  value: number;
  /** Secondary stat shown beside the value (correct guesses for the oracle board). */
  extra?: number;
};
export type Leaderboard = {
  zoomies: LeaderRow[];
  oracles: LeaderRow[];
  generatedAt: number;
};
export type MyPrediction = {
  pending: Pick | null;
  last: PickResult | null;
  points: number;
  correct: number;
  missed: number;
  /** The settled round a new guess would be placed after, when the feed is known. */
  settledRound: string | null;
};
export type ZoomiesGoalEvent = {
  userId: string;
  handle: string;
  avatar: string | null;
  zoomiesGoals: number;
};

export const newPlayer = (
  id: string,
  handle: string,
  avatar: string | null,
  now: number,
): ArenaPlayer => ({
  id,
  handle,
  avatar,
  zoomiesGoals: 0,
  points: 0,
  correct: 0,
  missed: 0,
  updatedAt: now,
});

/** The first settled outcome strictly after the pick's round, or null while it is pending. */
export function resolvePick(
  pick: Pick,
  history: readonly SettledEntry[],
): { round: string; outcome: Activity; correct: boolean } | null {
  const after = BigInt(pick.afterRound);
  const next = history
    .filter((entry) => BigInt(entry.round) > after)
    .sort((a, b) => (BigInt(a.round) < BigInt(b.round) ? -1 : 1))[0];
  if (!next) return null;
  return {
    round: next.round,
    outcome: next.outcome,
    correct: (pick.choice === "Zoomies") === (next.outcome === "Zoomies"),
  };
}

/** Top rows by `value`, ignoring zeros. Ties go to whoever reached it first. */
export function rank(
  players: readonly ArenaPlayer[],
  key: "zoomiesGoals" | "points",
  size = BOARD_SIZE,
): LeaderRow[] {
  return players
    .filter((p) => p[key] > 0)
    .sort(
      (a, b) =>
        b[key] - a[key] ||
        a.updatedAt - b.updatedAt ||
        a.handle.localeCompare(b.handle),
    )
    .slice(0, size)
    .map((p) => ({
      handle: p.handle,
      avatar: p.avatar,
      value: p[key],
      ...(key === "points" ? { extra: p.correct } : {}),
    }));
}