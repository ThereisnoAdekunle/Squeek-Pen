import { test } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, SignJWT, type JWTVerifyGetKey } from "jose";
import Server, { originAllowed } from "../party/server";
import { identityFromClaims, verifySignedIdentity } from "../party/identity";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Exercise the actual hook's message handlers with isolated state and socket I/O.
// No service credentials or fake-login paths are included in the application.
test("private Q room codes stay visible while reserved quick-match codes stay hidden", async () => {
  const source = readFileSync(new URL("../components/useOnlineMatch.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const slots: any[] = [];
  let cursor = 0;
  const react = {
    useState(initial: any) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], (value: any) => {
        slots[i] = typeof value === "function" ? value(slots[i]) : value;
      }];
    },
    useRef(initial: any) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: initial };
      return slots[i];
    },
    useCallback: (fn: any) => fn,
    useEffect: () => {},
  };
  let socket: any;
  class Socket {
    onmessage: any;
    constructor(readonly url: URL) { socket = this; }
    close() {}
    send() {}
  }
  const exports: any = {};
  runInNewContext(outputText, {
    exports,
    require(name: string) { assert.equal(name, "react"); return react; },
    URL, WebSocket: Socket,
    setTimeout: () => 1, clearTimeout: () => {},
    crypto: { getRandomValues(values: Uint8Array) { values.fill(0); values[0] = 14; return values; } },
  });
  function render() {
    cursor = 0;
    return exports.useOnlineMatch({ host: "https://rooms.test", token: "unit-test-token" });
  }
  await render().connect("create");
  assert.equal(socket.url.pathname, "/parties/main/QAAAAA");
  socket.onmessage({ data: JSON.stringify({ type: "waiting" }) });
  assert.equal(render().state, "waiting");
  assert.equal(render().roomCode, "QAAAAA");
  await render().connect("quick");
  socket.onmessage({ data: JSON.stringify({ type: "waiting" }) });
  assert.equal(render().roomCode, null);
  socket.onmessage({ data: JSON.stringify({ type: "matched", room: "QAAAAAAAAAA" }) });
  assert.equal(socket.url.pathname, "/parties/main/QAAAAAAAAAA");
  socket.onmessage({ data: JSON.stringify({ type: "waiting" }) });
  assert.equal(render().roomCode, null);
});

const keys = generateKeyPair("ES256");
const getKey: JWTVerifyGetKey = async () => (await keys).publicKey;
const origin = "https://game.test";
const appId = "room-test-app";
async function token(
  id: string,
  options: { twitter?: boolean; expired?: boolean; audience?: string } = {},
) {
  return new SignJWT({
    linked_accounts: JSON.stringify(
      options.twitter === false
        ? []
        : [
            {
              type: "twitter_oauth",
              username: id,
              profile_picture_url: `https://pbs.twimg.com/${id}.jpg`,
            },
          ],
    ),
  })
    .setProtectedHeader({ alg: "ES256", kid: "room-test" })
    .setIssuer("privy.io")
    .setAudience(options.audience || appId)
    .setSubject(`did:privy:${id}`)
    .setIssuedAt()
    .setExpirationTime(
      options.expired ? Math.floor(Date.now() / 1000) - 60 : "1h",
    )
    .sign((await keys).privateKey);
}
class TestServer extends Server {
  core: Record<string, any> | null = null;
  roll: number | undefined = undefined;
  graceMs = 1000;
  verifyToken(value: string, id: string) {
    return verifySignedIdentity(value, id, getKey);
  }
  async fetchCore() {
    if (!this.core) throw new Error("Feed unavailable");
    return this.core;
  }
  nextRoll() {
    return this.roll;
  }
}
const settled = (work: string) => ({
  schemaVersion: 1,
  status: "available",
  configuration: { genesisTimestamp: "1793022600", roundDuration: "600" },
  events: [
    ["1037", "1036", work],
    ["1036", "1035", "100"],
  ].map(([round, previous, cumulative]) => ({
    eventName: "BatchSettled",
    arguments: [
      { name: "settledThroughRound", value: round },
      { name: "previousSettledThroughRound", value: previous },
      { name: "cumulativeWork", value: cumulative },
      { name: "activeRoundCount", value: "1" },
    ],
  })),
});
function fixture(id = "ABC234") {
  const connections = new Map<string, any>();
  let alarm: number | null = null;
  const room: any = {
    id,
    env: { PRIVY_APP_ID: appId, ALLOWED_ORIGIN: origin },
    storage: {
      setAlarm: async (n: number) => {
        alarm = n;
      },
      deleteAlarm: async () => {
        alarm = null;
      },
    },
    getConnections: () => connections.values(),
    getConnection: (id: string) => connections.get(id),
  };
  const server = new TestServer(room);
  async function connect(id: string, connectionOrigin = origin) {
    const conn: any = {
      id,
      state: null,
      messages: [] as any[],
      closed: false,
      setState(s: any) {
        this.state = s;
      },
      send(s: string) {
        this.messages.push(JSON.parse(s));
      },
      close() {
        this.closed = true;
        connections.delete(id);
        void server.onClose(conn);
      },
    };
    connections.set(id, conn);
    await server.onConnect(conn, {
      request: new Request("https://rooms.test/parties/main/" + id, {
        headers: { origin: connectionOrigin },
      }),
    } as any);
    return conn;
  }
  async function auth(
    conn: any,
    user: string,
    action = "create",
    options: Parameters<typeof token>[1] = {},
  ) {
    await server.onMessage(
      JSON.stringify({
        type: "authenticate",
        action,
        token: await token(user, options),
      }),
      conn,
    );
  }
  async function choose(conn: any, direction: string) {
    await server.onMessage(JSON.stringify({ type: "choose", direction }), conn);
  }
  return { server, connections, connect, auth, choose, alarm: () => alarm };
}
async function ready() {
  const f = fixture();
  const a = await f.connect("a");
  const b = await f.connect("b");
  await f.auth(a, "alice");
  await f.auth(b, "bob", "join");
  return { ...f, a, b };
}
test("valid signed X identities are accepted; wrong app, expired, and unsigned identities fail", async () => {
  assert.equal(
    (await verifySignedIdentity(await token("alice"), appId, getKey)).handle,
    "@alice",
  );
  await assert.rejects(async () =>
    verifySignedIdentity(
      await token("alice", { audience: "another-app" }),
      appId,
      getKey,
    ),
  );
  await assert.rejects(async () =>
    verifySignedIdentity(
      await token("alice", { expired: true }),
      appId,
      getKey,
    ),
  );
  await assert.rejects(() =>
    verifySignedIdentity("not.a.token", appId, getKey),
  );
  assert.throws(() =>
    identityFromClaims({ sub: "a", exp: 9999999999, linked_accounts: "[]" }),
  );
});
test("foreign origins and unauthenticated play are rejected", async () => {
  const f = fixture();
  const foreign = await f.connect("foreign", "https://other.test");
  assert.ok(foreign.closed);
  const conn = await f.connect("a");
  await f.choose(conn, "left");
  assert.ok(conn.closed);
  assert.equal(f.server.players.length, 0);
});
test("a signed identity without X cannot join", async () => {
  const f = fixture();
  const a = await f.connect("a");
  await f.auth(a, "alice", "create", { twitter: false });
  assert.ok(a.closed);
  assert.equal(f.server.players.length, 0);
});
test("joining an unknown private room fails without inventing a room", async () => {
  const f = fixture();
  const a = await f.connect("a");
  await f.auth(a, "alice", "join");
  assert.ok(a.closed);
  assert.equal(f.server.players.length, 0);
});
test("same X account and a third player cannot enter a match", async () => {
  const f = await ready();
  const c = await f.connect("c");
  await f.auth(c, "chris", "join");
  assert.ok(c.closed);
  assert.equal(f.server.players.length, 2);
  const other = fixture("DEF567");
  const a = await other.connect("a");
  const b = await other.connect("b");
  await other.auth(a, "alice");
  await other.auth(b, "alice", "join");
  assert.ok(b.closed);
  assert.equal(other.server.players.length, 1);
});
test("first selection stays secret and cannot be changed before the reveal", async () => {
  const f = await ready();
  const before = f.b.messages.length;
  await f.choose(f.a, "left");
  assert.equal(f.b.messages.length, before);
  await f.choose(f.a, "right");
  assert.equal(f.server.choices.get("did:privy:alice"), "left");
  assert.equal(f.server.match.kicks.length, 0);
  await f.choose(f.b, "right");
  assert.equal(f.server.match.kicks.length, 1);
  assert.equal(f.server.match.score[0], 1);
  assert.equal(f.b.messages.at(-1).match.kicks[0].shot, "left");
  await f.choose(f.a, "center");
  assert.equal(f.server.match.kicks.length, 1);
});
test("the reveal window rejects new choices and an alarm opens the next turn", async () => {
  const f = await ready();
  await f.choose(f.a, "left");
  await f.choose(f.b, "right");
  assert.equal(f.server.stage, "revealing");
  assert.equal(f.a.messages.at(-1).turnReady, false);
  await f.server.onAlarm();
  assert.equal(f.server.stage, "choosing");
  assert.equal(f.server.choices.size, 0);
  assert.ok(f.alarm()! > Date.now());
});
test("kicker timeout is a miss; keeper timeout concedes; simultaneous timeout is a miss", async () => {
  const f = await ready();
  await f.choose(f.b, "left");
  await f.server.onAlarm();
  assert.deepEqual(f.server.match.score, [0, 0]);
  assert.ok(f.server.match.kicks[0].timedOut);
  const g = await ready();
  await g.choose(g.a, "left");
  await g.server.onAlarm();
  assert.deepEqual(g.server.match.score, [1, 0]);
  const h = await ready();
  await h.server.onAlarm();
  assert.deepEqual(h.server.match.score, [0, 0]);
});
test("late choices cannot be submitted after the deadline", async () => {
  const f = await ready();
  f.server.deadline = Date.now() - 1;
  await f.choose(f.a, "left");
  assert.equal(f.server.match.kicks.length, 1);
  assert.deepEqual(f.server.match.score, [0, 0]);
});
test("rematch requires both players and resets the score and locked choices", async () => {
  const f = await ready();
  for (let i = 0; i < 6; i++) {
    if (i > 0) await f.server.onAlarm();
    await f.choose(f.a, "left");
    await f.choose(f.b, i % 2 === 0 ? "right" : "left");
  }
  assert.equal(f.server.match.winner, 0);
  assert.equal(f.server.stage, "finished");
  await f.server.onMessage(JSON.stringify({ type: "rematch" }), f.a);
  assert.equal(f.server.match.winner, 0);
  await f.server.onMessage(JSON.stringify({ type: "rematch" }), f.b);
  assert.deepEqual(f.server.match.score, [0, 0]);
  assert.equal(f.server.stage, "choosing");
  assert.equal(f.server.choices.size, 0);
});
test("a dropped player holds their seat, then the other player wins by walkover", async () => {
  const f = await ready();
  f.server.graceMs = 20;
  await f.server.onClose(f.a);
  assert.equal(f.server.stage, "choosing");
  assert.equal(f.b.messages.at(-1).type, "opponent-disconnected");
  await new Promise((accept) => setTimeout(accept, 60));
  assert.equal(f.server.stage, "abandoned");
  assert.equal(f.b.messages.at(-1).type, "opponent-left");
  assert.equal(f.b.messages.at(-1).walkover, true);
  assert.equal(f.alarm(), null);
});
test("a dropped player can rejoin the same seat with their match intact", async () => {
  const f = await ready();
  await f.choose(f.a, "left");
  await f.server.onClose(f.a);
  const again = await f.connect("a2");
  await f.auth(again, "alice", "rejoin");
  assert.equal(f.b.messages.at(-1).type, "state");
  assert.equal(f.b.messages.at(-2).type, "opponent-back");
  const restored = again.messages.at(-1);
  assert.equal(restored.playerIndex, 0);
  assert.equal(restored.youLocked, true);
  assert.equal(f.b.messages.at(-1).youLocked, false);
  assert.equal(f.server.graceTimers.size, 0);
  await f.choose(f.b, "right");
  assert.deepEqual(f.server.match.score, [1, 0]);
});
test("nobody can rejoin a match they were not part of", async () => {
  const f = await ready();
  const stranger = await f.connect("c");
  await f.auth(stranger, "chris", "rejoin");
  assert.ok(stranger.closed);
  assert.equal(f.server.players.length, 2);
});
test("a host leaving before anyone joins closes the room", async () => {
  const f = fixture();
  const a = await f.connect("a");
  await f.auth(a, "alice");
  await f.server.onClose(a);
  assert.equal(f.server.players.length, 0);
  const b = await f.connect("b");
  await f.auth(b, "bob", "join");
  assert.ok(b.closed);
});
test("a disconnect while the first feed loads holds both seats and allows rejoining", async () => {
  const f = fixture();
  const a = await f.connect("a");
  const b = await f.connect("b");
  await f.auth(a, "alice");
  let release!: (value: Record<string, any>) => void;
  let started!: () => void;
  const fetching = new Promise<void>((resolve) => { started = resolve; });
  f.server.fetchCore = () => {
    started();
    return new Promise((resolve) => { release = resolve; });
  };
  const joining = f.auth(b, "bob", "join");
  await fetching;
  f.connections.delete(a.id);
  await f.server.onClose(a);
  release(settled("500"));
  await joining;
  assert.equal(f.server.players.length, 2, "both authenticated seats survive the pending start");
  assert.equal(f.server.stage, "choosing");
  const again = await f.connect("a2");
  await f.auth(again, "alice", "rejoin");
  assert.equal(again.messages.at(-1).playerIndex, 0);
  assert.equal(f.server.graceTimers.size, 0);
  await f.server.onAlarm();
  assert.equal(f.server.match.kicks.length, 1);
});
test("an unknown Q-prefixed private room still rejects a join", async () => {
  const f = fixture("QAAAAA");
  const a = await f.connect("a");
  await f.auth(a, "alice", "join");
  assert.ok(a.closed);
  assert.equal(f.server.players.length, 0);
});
test("a grace period expiring during startup cannot resurrect the match", async () => {
  const f = fixture();
  f.server.graceMs = 10;
  const a = await f.connect("a");
  const b = await f.connect("b");
  await f.auth(a, "alice");
  let release!: (value: Record<string, any>) => void;
  let started!: () => void;
  const fetching = new Promise<void>((resolve) => { started = resolve; });
  f.server.fetchCore = () => {
    started();
    return new Promise((resolve) => { release = resolve; });
  };
  const joining = f.auth(b, "bob", "join");
  await fetching;
  assert.equal(f.server.stage, "starting");
  assert.equal(a.messages.at(-1).turnReady, false);
  await f.choose(b, "left");
  assert.equal(f.server.choices.size, 0);
  f.connections.delete(a.id);
  await f.server.onClose(a);
  await new Promise((resolve) => setTimeout(resolve, 30));
  release(settled("500"));
  await joining;
  assert.equal(f.server.stage, "abandoned");
  assert.equal(f.alarm(), null);
  assert.equal(b.messages.at(-1).walkover, true);
  await f.server.onAlarm();
  assert.equal(f.server.match.kicks.length, 0);
});
test("leaving after the final whistle ends the room without a walkover", async () => {
  const f = await ready();
  for (let i = 0; i < 6; i++) {
    if (i > 0) await f.server.onAlarm();
    await f.choose(f.a, "left");
    await f.choose(f.b, i % 2 === 0 ? "right" : "left");
  }
  assert.equal(f.server.stage, "finished");
  await f.server.onClose(f.a);
  assert.equal(f.b.messages.at(-1).type, "opponent-left");
  assert.equal(f.b.messages.at(-1).walkover, false);
});
test("the server applies the settled round, not anything a client sends", async () => {
  const f = fixture();
  (f.server as TestServer).core = settled("500");
  (f.server as TestServer).roll = 0;
  const a = await f.connect("a");
  const b = await f.connect("b");
  await f.auth(a, "alice");
  await f.auth(b, "bob", "join");
  assert.equal(a.messages.at(-1).hamster, "Zoomies");
  assert.equal(b.messages.at(-1).hamster, "Zoomies");
  await f.server.onMessage(
    JSON.stringify({ type: "choose", direction: "left", hamster: "Nap" }),
    a,
  );
  await f.choose(b, "left");
  assert.deepEqual(f.server.match.score, [1, 0]);
  const kick = b.messages.at(-1).match.kicks[0];
  assert.equal(kick.twist, "too-fast");
  assert.equal(kick.hamster, "Zoomies");
});
test("Nap gives the keeper the extra reach in a real room", async () => {
  const f = fixture();
  (f.server as TestServer).core = settled("100");
  (f.server as TestServer).roll = 0;
  const a = await f.connect("a");
  const b = await f.connect("b");
  await f.auth(a, "alice");
  await f.auth(b, "bob", "join");
  assert.equal(a.messages.at(-1).hamster, "Nap");
  await f.choose(a, "center");
  await f.choose(b, "left");
  assert.deepEqual(f.server.match.score, [0, 0]);
  assert.equal(a.messages.at(-1).match.kicks[0].twist, "long-reach");
});
test("an unavailable API leaves the match on normal rules", async () => {
  const f = await ready();
  assert.equal(f.a.messages.at(-1).hamster, null);
  await f.choose(f.a, "left");
  await f.choose(f.b, "left");
  assert.deepEqual(f.server.match.score, [0, 0]);
  assert.equal(f.a.messages.at(-1).match.kicks[0].twist, null);
});
test("the rule is fixed for the turn and picked up on the next one", async () => {
  const f = await ready();
  const server = f.server as TestServer;
  assert.equal(f.a.messages.at(-1).hamster, null);
  server.core = settled("500");
  server.feedCheckedAt = 0;
  await f.choose(f.a, "left");
  await f.choose(f.b, "right");
  assert.equal(f.a.messages.at(-1).hamster, null);
  await server.onAlarm();
  assert.equal(f.a.messages.at(-1).hamster, "Zoomies");
});
test("origin rules accept listed origins and subdomain wildcards only", () => {
  const rules = "https://*.imd.site, https://squeek.example";
  assert.ok(originAllowed(rules, "https://squeek.imd.site"));
  assert.ok(originAllowed(rules, "https://squeek.example"));
  assert.ok(!originAllowed(rules, "http://squeek.imd.site"));
  assert.ok(!originAllowed(rules, "https://imd.site"));
  assert.ok(!originAllowed(rules, "https://evil.test/.imd.site"));
  assert.ok(!originAllowed(rules, "https://imd.site.evil.test"));
  assert.ok(!originAllowed(rules, null));
  assert.ok(!originAllowed(undefined, "https://squeek.imd.site"));
});
test("matchmaking pairs two different authenticated users with the same new room", async () => {
  const f = fixture("matchmaking");
  const a = await f.connect("a");
  const b = await f.connect("b");
  await f.auth(a, "alice", "quick");
  assert.equal(a.messages.at(-1).type, "waiting");
  await f.auth(b, "bob", "quick");
  assert.equal(a.messages.at(-1).type, "matched");
  assert.equal(a.messages.at(-1).room, b.messages.at(-1).room);
  assert.match(a.messages.at(-1).room, /^Q[A-HJ-NP-Z2-9]{10}$/);
  assert.equal(f.server.queue.size, 0);
});
test("a disconnected player is removed from the matchmaking queue", async () => {
  const f = fixture("matchmaking");
  const a = await f.connect("a");
  await f.auth(a, "alice", "quick");
  await f.server.onClose(a);
  assert.equal(f.server.queue.size, 0);
});
test("excessive messages close the connection", async () => {
  const f = await ready();
  for (let i = 0; i < 21; i++)
    await f.server.onMessage(JSON.stringify({ type: "unknown" }), f.a);
  assert.ok(f.a.closed);
});
test("malformed message objects are rejected without corrupting the match", async () => {
  const f = await ready();
  for (const raw of ["null", "[]", "42", '"hello"', "{"])
    await f.server.onMessage(raw, f.a);
  assert.equal(f.server.match.kicks.length, 0);
  assert.equal(f.server.stage, "choosing");
  assert.ok(f.a.messages.at(-1).type === "error");
});
test("unknown authentication actions cannot create a room", async () => {
  const f = fixture();
  const a = await f.connect("a");
  await f.auth(a, "alice", "unknown");
  assert.ok(a.closed);
  assert.equal(f.server.players.length, 0);
});
