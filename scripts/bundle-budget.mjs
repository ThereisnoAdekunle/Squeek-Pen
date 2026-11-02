import { readdir, stat, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
const limit = 8388608;
const files = [];
const omitted = new Set([".git", ".github", ".imd", "node_modules"]);
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (
      omitted.has(entry.name) ||
      entry.name === ".env" ||
      entry.name.startsWith(".env.") ||
      join(dir, entry.name) === "test/scratch"
    )
      continue;
    const file = join(dir, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`A submission path is a symlink: ${file}`);
    if (entry.isDirectory()) await walk(file);
    else files.push({ file, bytes: (await stat(file)).size });
  }
}
await walk(".");
const total = files.reduce((n, f) => n + f.bytes, 0);
const exported = files
  .filter((f) => f.file.startsWith("dist/"))
  .reduce((n, f) => n + f.bytes, 0);
const html = await readFile("dist/index.html", "utf8");
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g))
  await stat(resolve("dist", match[1]));
if (!html.includes('content="./og-image.png"'))
  throw new Error("The share image must be relative to the export.");
console.log(
  JSON.stringify(
    {
      files: files.length,
      totalBytes: total,
      exportBytes: exported,
      limitBytes: limit,
      remainingBytes: limit - total,
      withinBudget: total <= limit,
    },
    null,
    2,
  ),
);
if (total > limit) process.exitCode = 1;
