// The repo type-checks with browser typings, so Cloudflare's runtime module is
// declared minimally here. wrangler bundles the real runtime when deploying.
declare module "cloudflare:workers" {
  export class DurableObject<Env = unknown> {
    ctx: {
      id: { name?: string };
      storage: {
        setAlarm(time: number): Promise<void>;
        deleteAlarm(): Promise<void>;
        get<T = unknown>(key: string): Promise<T | undefined>;
        put(key: string, value: unknown): Promise<void>;
        delete(key: string): Promise<boolean>;
        list<T = unknown>(options?: { prefix?: string; limit?: number }): Promise<Map<string, T>>;
      };
    };
    env: Env;
    constructor(ctx: unknown, env: Env);
    fetch(request: Request): Response | Promise<Response>;
  }
}