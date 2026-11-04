// The repo type-checks with browser typings, so Cloudflare's runtime module is
// declared minimally here. wrangler bundles the real runtime when deploying.
declare module "cloudflare:workers" {
  export class DurableObject<Env = unknown> {
    ctx: {
      id: { name?: string };
      storage: {
        setAlarm(time: number): Promise<void>;
        deleteAlarm(): Promise<void>;
      };
    };
    env: Env;
    constructor(ctx: unknown, env: Env);
  }
}