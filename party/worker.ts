import {
  Server as PartyServerBase,
  routePartykitRequest,
  type Connection,
  type ConnectionContext,
  type WSMessage,
} from "partyserver";
import GameRoom from "./server";
import { FeedKeeper } from "./feed";

type Stub = { fetch(input: string, init?: RequestInit): Promise<Response> };
type Namespace = { idFromName(name: string): unknown; get(id: unknown): Stub };
type Env = {
  Main: unknown;
  Feed: Namespace;
  ALLOWED_ORIGIN: string;
  PRIVY_APP_ID: string;
};

export { FeedKeeper };

const feedStub = (env: Env) => env.Feed.get(env.Feed.idFromName("main"));

/**
 * One Durable Object per room. All game rules live in ./server.ts; this class
 * only connects them to PartyServer on the owner's Cloudflare account.
 * The binding is named "Main", so clients keep using /parties/main/<room>.
 */
export class SqueekRoom extends PartyServerBase<Env> {
  game!: GameRoom;

  onStart() {
    const server = this;
    this.game = new GameRoom({
      get id() {
        return server.name;
      },
      env: server.env as unknown as Record<string, unknown>,
      storage: server.ctx.storage,
      getConnection: (id: string) => server.getConnection(id) as any,
      getConnections: () => server.getConnections() as Iterable<any>,
      // Settled-round feed kept by FeedKeeper, used when /v1/core is down.
      feed: async () => {
        const response = await feedStub(server.env).fetch("https://feed.internal/feed");
        if (!response.ok) throw new Error("Feed unavailable");
        return response.json();
      },
    });
  }
  async onConnect(connection: Connection, ctx: ConnectionContext) {
    await this.game.onConnect(connection as any, ctx);
  }
  async onMessage(connection: Connection, message: WSMessage) {
    await this.game.onMessage(message as string | ArrayBuffer, connection as any);
  }
  async onClose(connection: Connection) {
    await this.game.onClose(connection as any);
  }
  async onAlarm() {
    await this.game.onAlarm();
  }
}

// The feed is public read-only data, so any site may read it.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === "/feed") {
      if (request.method === "OPTIONS")
        return new Response(null, { status: 204, headers: cors });
      if (request.method !== "GET")
        return new Response("Method Not Allowed", { status: 405 });
      const upstream = await feedStub(env).fetch("https://feed.internal/feed");
      const response = new Response(upstream.body, upstream);
      for (const [key, value] of Object.entries(cors))
        response.headers.set(key, value);
      return response;
    }
    return (
      (await routePartykitRequest(request, env as any)) ||
      new Response("Not Found", { status: 404 })
    );
  },
  // Cron: read /v1/status every minute so no settled round is missed.
  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }) {
    ctx.waitUntil(feedStub(env).fetch("https://feed.internal/refresh"));
  },
};