export const directions = ["left", "center", "right"] as const;
export type Direction = (typeof directions)[number];
export type PlayerIndex = 0 | 1;
export type Kick = {
  kicker: PlayerIndex;
  shot: Direction;
  dive: Direction;
  goal: boolean;
  timedOut?: boolean;
};
export type Match = {
  score: [number, number];
  kicks: Kick[];
  winner: PlayerIndex | null;
  kicker: PlayerIndex;
};

export function newMatch(): Match {
  return { score: [0, 0], kicks: [], winner: null, kicker: 0 };
}
export function isDirection(value: unknown): value is Direction {
  return directions.includes(value as Direction);
}
export function resolveKick(
  match: Match,
  shot: Direction,
  dive: Direction,
  timedOut = false,
): Match {
  if (match.winner !== null) throw new Error("This match has finished.");
  if (!isDirection(shot) || !isDirection(dive))
    throw new Error("Choose left, center, or right.");
  const goal = !timedOut && shot !== dive;
  const score: [number, number] = [...match.score];
  if (goal) score[match.kicker]++;
  const kicks = [
    ...match.kicks,
    { kicker: match.kicker, shot, dive, goal, timedOut },
  ];
  let winner: PlayerIndex | null = null;
  // Equal turns: the second player always gets a reply, including at match point.
  if (
    kicks.length % 2 === 0 &&
    score[0] !== score[1] &&
    (Math.max(...score) >= 3 || kicks.length >= 10)
  ) {
    winner = score[0] > score[1] ? 0 : 1;
  }
  return { score, kicks, winner, kicker: match.kicker === 0 ? 1 : 0 };
}
export function randomDirection(): Direction {
  const data = new Uint32Array(1);
  // Rejection sampling avoids modulo bias, including in server-side AI and deadlines.
  do {
    crypto.getRandomValues(data);
  } while (data[0] === 4294967295);
  return directions[data[0] % 3];
}
export function shootoutRound(match: Match) {
  return Math.floor(match.kicks.length / 2) + 1;
}
export function isSuddenDeath(match: Match) {
  return match.kicks.length >= 10 && match.winner === null;
}
export function isMatchPoint(match: Match) {
  return Math.max(...match.score) >= 2 || match.kicks.length >= 8;
}
