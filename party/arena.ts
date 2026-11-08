import { DurableObject } from "cloudflare:workers";
import type { FeedSnapshot, SettledEntry } from "../lib/feed";
import { ArenaCore, type ArenaStorage } from "./arenaCore";
import { verifyIdentity } from "./identity";

type Stub = { fetch(input: string, init?: RequestInit): Promise<Response> };
type ArenaEnv = {
  Feed: { idFromName(name: string): unknown; get(id: unknown): Stub };
  ALLOWED_ORIGIN: string;
  PRIVY_APP_ID: string;
};

/** One instance for the whole game: the Zoomies leaderboard and the prediction game. */
export class Arena extends DurableObject<ArenaEnv> {
  core: ArenaCore | null = null;

  async fetch(request: Request): Promise<Response> {
    this.core ??= new ArenaCore({
      storage: this.ctx.storage as unknown as ArenaStorage,
      appId: this.env.PRIVY_APP_ID,
      allowedOrigin: this.env.ALLOWED_ORIGIN,
      verify: verifyIdentity,
      feed: async () => {
        const keeper = this.env.Feed.get(this.env.Feed.idFromName("main"));
        const response = await keeper.fetch("https://feed.internal/history");
        if (!response.ok) throw new Error("Feed unavailable");
        return (await response.json()) as {
          snapshot: FeedSnapshot | null;
          history: SettledEntry[];
        };
      },
    });
    return this.core.handle(request);
  }
}