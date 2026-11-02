import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    const path = resolve(
      root,
      "." + decodeURIComponent(url.pathname).replace(/^\/preview\//, "/"),
    );
    if (path !== root && !path.startsWith(root + sep)) throw new Error("path");
    const file = (await stat(path)).isDirectory()
      ? resolve(path, "index.html")
      : path;
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
server.listen(3000, "127.0.0.1", () =>
  console.log("SQUEEK PENALTY preview: http://127.0.0.1:3000"),
);
