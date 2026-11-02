import { test } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, SignJWT, type JWTVerifyGetKey } from "jose";
import Server from "../party/server";
import { identityFromClaims, verifySignedIdentity } from "../party/identity";

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
  verifyToken(value: string, id: string) {
    return verifySignedIdentity(value, id, getKey);
  }
}
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
test("disconnect ends the room and informs the remaining player", async () => {
  const f = await ready();
  await f.server.onClose(f.a);
  assert.equal(f.server.stage, "abandoned");
  assert.equal(f.b.messages.at(-1).type, "opponent-left");
  assert.equal(f.alarm(), null);
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
