// Build in a temporary workspace so dependencies and caches never enter the submission.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const lock = await readFile(join(root, "package-lock.json"));
const hash = createHash("sha256").update(lock).digest("hex").slice(0, 12);
const stage = join(tmpdir(), `squeek-penalty-${hash}`);
await mkdir(stage, { recursive: true });
const inputs = [
  "app",
  "components",
  "lib",
  "public",
  "party",
  "rules",
  "tests",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next-env.d.ts",
  "next.config.ts",
  "postcss.config.mjs",
  "wrangler.jsonc",
];
for (const file of inputs) {
  await rm(join(stage, file), { recursive: true, force: true });
  await cp(join(root, file), join(stage, file), { recursive: true });
}
function run(command, args) {
  return new Promise((accept, reject) => {
    const child = spawn(command, args, {
      cwd: stage,
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
        npm_config_cache: join(tmpdir(), "squeek-npm-cache"),
      },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? accept() : reject(new Error(`${command} exited ${code}`)),
    );
  });
}
let ready = false;
try {
  ready = (await readFile(join(stage, ".installed"), "utf8")) === hash;
} catch {}
if (!ready) {
  await run("npm", ["ci", "--legacy-peer-deps", "--no-audit", "--no-fund"]);
  await writeFile(join(stage, ".installed"), hash);
}
const action = process.argv[2];
if (action === "build") {
  await run("node", ["node_modules/next/dist/bin/next", "build", "--webpack"]);
  await rm(join(root, "dist"), { recursive: true, force: true });
  await cp(join(stage, "out"), join(root, "dist"), { recursive: true });
  console.log("Static export written to dist/");
} else if (action === "typecheck") {
  await run("node", [
    "node_modules/typescript/bin/tsc",
    "--noEmit",
    "--incremental",
    "false",
  ]);
} else if (action === "test") {
  await run("node", [
    "--import",
    "tsx",
    "--test",
    "tests/game.test.ts",
    "tests/rooms.test.ts",
    "tests/activity.test.ts",
    "tests/hamster.test.ts",
    "tests/feed.test.ts",
  ]);
} else if (action === "dev") {
  await run("node", ["node_modules/next/dist/bin/next", "dev", "--webpack"]);
} else throw new Error("Use build, typecheck, test, or dev.");
