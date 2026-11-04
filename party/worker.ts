import {
  Server as PartyServerBase,
  routePartykitRequest,
  type Connection,
  type ConnectionContext,
  type WSMessage,
} from "partyserver";
import GameRoom from "./server";

type Env = {
  Main: unknown;
  ALLOWED_ORIGIN: string;
  PRIVY_APP_ID: string;
};

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

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routePartykitRequest(request, env as any)) ||
      new Response("Not Found", { status: 404 })
    );
  },
};