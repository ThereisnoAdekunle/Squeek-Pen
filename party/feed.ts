import { DurableObject } from "cloudflare:workers";
import {
  STATUS_URL,
  advanceFeed,
  emptyKeeperState,
  type FeedSnapshot,
  type KeeperState,
} from "../lib/feed";

const FRESH_MS = 10_000;

type FeedEnv = { STATUS_URL?: string };

/**
 * One instance for the whole game. It reads /v1/status, remembers the last settled
 * reading, and turns each settled-round change into Nap, Jog or Zoomies.
 * The cron in worker.ts keeps it reading once a minute, so single-round changes
 * are caught even when nobody is on the site.
 */
export class FeedKeeper extends DurableObject<FeedEnv> {
  snapshot: FeedSnapshot | null = null;
  inflight: Promise<FeedSnapshot> | null = null;

  async refresh(force = false): Promise<FeedSnapshot> {
    const store = this.ctx.storage;
    this.snapshot ??= (await store.get<FeedSnapshot>("snapshot")) ?? null;
    if (!force && this.snapshot && Date.now() - this.snapshot.refreshedAt < FRESH_MS)
      return this.snapshot;
    // Concurrent callers share one upstream read.
    this.inflight ??= this.read().finally(() => {
      this.inflight = null;
    });
    return this.inflight;
  }

  async read(): Promise<FeedSnapshot> {
    const store = this.ctx.storage;
    const response = await fetch(this.env.STATUS_URL || STATUS_URL, {
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error("Status unavailable");
    const state = (await store.get<KeeperState>("state")) ?? emptyKeeperState();
    const next = advanceFeed(state, await response.json());
    await store.put("state", next.state);
    await store.put("snapshot", next.snapshot);
    this.snapshot = next.snapshot;
    return next.snapshot;
  }

  async fetch(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === "/refresh") {
      await this.refresh(true).catch(() => null);
      return new Response("ok");
    }
    if (path === "/history") {
      // Internal: the Arena resolves predictions against every settled outcome, not just the latest.
      const snapshot = await this.refresh().catch(() => this.snapshot);
      const state = await this.ctx.storage.get<KeeperState>("state");
      return Response.json(
        { snapshot: snapshot ?? null, history: state?.history ?? [] },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    // A short upstream outage serves the last good reading, which the client
    // stops trusting once it is older than ten minutes.
    const snapshot = await this.refresh().catch(() => this.snapshot);
    return Response.json(snapshot ?? { error: "unavailable" }, {
      status: snapshot ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}