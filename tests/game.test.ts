import { test } from "node:test";
import assert from "node:assert/strict";
import {
  directions,
  isDirection,
  isSuddenDeath,
  newMatch,
  randomDirection,
  resolveKick,
  type Match,
} from "../lib/game";
test("all nine shot/dive combinations follow the penalty rules", () => {
  for (const shot of directions)
    for (const dive of directions) {
      const before = newMatch();
      const after = resolveKick(before, shot, dive);
      assert.equal(after.score[0], shot === dive ? 0 : 1);
      assert.equal(after.kicker, 1);
      assert.deepEqual(before, newMatch());
    }
});
test("a third goal does not steal the second player’s reply", () => {
  let m = newMatch();
  for (let i = 0; i < 4; i++) m = resolveKick(m, "left", "right");
  m = resolveKick(m, "left", "right");
  assert.equal(m.winner, null);
  assert.deepEqual(m.score, [3, 2]);
  m = resolveKick(m, "left", "right");
  assert.deepEqual(m.score, [3, 3]);
  assert.equal(m.winner, null);
  m = resolveKick(m, "left", "right");
  m = resolveKick(m, "left", "left");
  assert.equal(m.winner, 0);
});
test("first to three with equal turns wins and finished games reject extra kicks", () => {
  let m = newMatch();
  for (let i = 0; i < 3; i++) {
    m = resolveKick(m, "left", "right");
    m = resolveKick(m, "left", "left");
  }
  assert.deepEqual(m.score, [3, 0]);
  assert.equal(m.winner, 0);
  assert.equal(m.kicks.length, 6);
  assert.throws(() => resolveKick(m, "left", "right"));
});
test("after five turns each a lower non-tied score wins", () => {
  let m = newMatch();
  for (let i = 0; i < 10; i++)
    m = resolveKick(m, "left", i === 0 ? "right" : "left");
  assert.deepEqual(m.score, [1, 0]);
  assert.equal(m.winner, 0);
});
test("nil-nil enters sudden death; equal successful kicks continue it", () => {
  let m = newMatch();
  for (let i = 0; i < 10; i++) m = resolveKick(m, "center", "center");
  assert.ok(isSuddenDeath(m));
  m = resolveKick(m, "center", "left");
  assert.equal(m.winner, null);
  m = resolveKick(m, "right", "left");
  assert.equal(m.winner, null);
  assert.ok(isSuddenDeath(m));
  m = resolveKick(m, "left", "left");
  m = resolveKick(m, "center", "right");
  assert.equal(m.winner, 1);
});
test("a kicker timeout never scores even when directions differ", () => {
  const m = resolveKick(newMatch(), "left", "right", true);
  assert.equal(m.score[0], 0);
  assert.equal(m.kicks[0].timedOut, true);
});
test("invalid inputs fail and random choices remain in the direction domain", () => {
  assert.equal(isDirection("up"), false);
  assert.throws(() => resolveKick(newMatch(), "bad" as any, "left"));
  for (let i = 0; i < 1000; i++) assert.ok(isDirection(randomDirection()));
});
test("seeded state invariants across 1,000 independent matches", () => {
  let seed = 43167;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed;
  };
  for (let game = 0; game < 1000; game++) {
    let m: Match = newMatch();
    for (let turn = 0; turn < 100 && m.winner === null; turn++) {
      m = resolveKick(m, directions[random() % 3], directions[random() % 3]);
      assert.equal(m.kicks.length, turn + 1);
      for (const p of [0, 1])
        assert.equal(
          m.score[p],
          m.kicks.filter((k) => k.kicker === p && k.goal).length,
        );
      assert.ok(
        Math.abs(
          m.kicks.filter((k) => k.kicker === 0).length -
            m.kicks.filter((k) => k.kicker === 1).length,
        ) <= 1,
      );
      if (m.winner !== null) {
        assert.equal(m.kicks.length % 2, 0);
        assert.ok(m.score[m.winner] > m.score[m.winner === 0 ? 1 : 0]);
      }
    }
  }
});
