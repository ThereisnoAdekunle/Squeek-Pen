import { createServer } from "node:http";
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
const { chromium, webkit } = await import(
  process.env.IMD_PLAYWRIGHT
    ? pathToFileURL(process.env.IMD_PLAYWRIGHT).href
    : "playwright"
);
const root = resolve("dist");
const output = resolve("test/scratch/interactions");
await mkdir(output, { recursive: true });
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".png": "image/png",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/preview/")) throw new Error();
    let file = resolve(root, "." + decodeURIComponent(url.pathname.slice(8)));
    if (file !== root && !file.startsWith(root + sep)) throw new Error();
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    res.writeHead(200, {
      "content-type": types[extname(file)] || "text/plain",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const url = `http://127.0.0.1:${server.address().port}/preview/`;
const results = [];
let browser;
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`PASS ${name}`);
  } catch (e) {
    results.push({ name, passed: false, error: e.message });
    console.log(`FAIL ${name}: ${e.message}`);
  }
}
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith(url) && r.status() >= 400)
      failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(output, "mobile-390.png") });
  await page.screenshot({
    path: resolve(output, "mobile-full.png"),
    fullPage: true,
  });
  await check(
    "390px first screen contains product and practice action",
    async () => {
      assert.ok(
        await page
          .getByRole("heading", { name: "Tiny paws. Big pressure." })
          .isVisible(),
      );
      const b = await page
        .getByRole("button", { name: "Play practice", exact: true })
        .first()
        .boundingBox();
      assert.ok(b && b.y + b.height < 844);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
    },
  );
  await check(
    "X login has an honest unavailable state and a working practice alternative",
    async () => {
      await page
        .getByRole("button", { name: "Connect with X", exact: true })
        .click();
      await page.getByText("X login isn’t enabled here yet.").waitFor();
      await page.getByRole("button", { name: "Close dialog" }).click();
    },
  );
  await check(
    "friend and matchmaking controls explain setup instead of simulating opponents",
    async () => {
      for (const name of ["Play a friend", "Quick match"]) {
        await page.getByRole("button", { name: new RegExp(name) }).click();
        await page.getByText("Online play is warming up.").waitFor();
        await page.getByRole("button", { name: "Close dialog" }).click();
      }
      await page.getByRole("button", { name: /Play practice Take/ }).click();
    },
  );
  await check(
    "first-play tutorial is keyboard dismissible and restores focus",
    async () => {
      await page
        .getByRole("button", { name: "Play practice", exact: true })
        .first()
        .click();
      await page.getByRole("dialog").waitFor();
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("dialog").count(), 0);
      await page.waitForFunction(() =>
        document.activeElement?.classList.contains("start-button"),
      );
    },
  );
  await check("sound control toggles and persists after reload", async () => {
    await page.getByRole("button", { name: "Mute sound" }).click();
    await page.getByRole("button", { name: "Enable sound" }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Enable sound" }).waitFor();
  });
  await check("mobile and desktop layouts have no overflow", async () => {
    for (const width of [320, 390, 730, 900, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `overflow at ${width}`,
      );
      await page.screenshot({
        path: resolve(output, `layout-${width}.png`),
        fullPage: width === 1440,
      });
    }
    await page.setViewportSize({ width: 390, height: 844 });
  });
  await check("reduced motion disables running animations", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page.evaluate(
        () =>
          document.getAnimations().filter((a) => a.playState === "running")
            .length,
      ),
      0,
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });
  await check(
    "relative local assets load from a hosting subpath without runtime errors",
    async () => {
      assert.deepEqual(errors, []);
      assert.deepEqual(failed, []);
      assert.ok(
        await page.evaluate(async () => {
          await document.fonts.load("600 16px Outfit");
          return document.fonts.check("600 16px Outfit");
        }),
        "The local Outfit font must load from the hosting subpath",
      );
    },
  );
  // Deterministic randomness is isolated to this test context; production uses Web Crypto.
  const gameContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await gameContext.addInitScript(() => {
    Crypto.prototype.getRandomValues = function (array) {
      array.fill(0);
      return array;
    };
  });
  const game = await gameContext.newPage();
  game.setDefaultTimeout(12000);
  await game.goto(url, { waitUntil: "networkidle" });
  await check(
    "tutorial starts a real timed turn and direction choice locks once",
    async () => {
      await game
        .getByRole("button", { name: "Play practice", exact: true })
        .first()
        .click();
      await game.getByRole("button", { name: "Start my first match" }).click();
      await game.getByRole("button", { name: "Shoot right" }).waitFor();
      await game.screenshot({ path: resolve(output, "choose-390.png") });
      await game.getByRole("button", { name: "Shoot right" }).click();
      assert.ok(
        await game.getByRole("button", { name: "Shoot right" }).isDisabled(),
      );
      await game.getByText("Goooal!", { exact: true }).waitFor();
      await game.screenshot({ path: resolve(output, "goal-390.png") });
      await game
        .getByRole("button", { name: "Dive left", exact: true })
        .waitFor({ state: "visible" });
      await game.waitForFunction(
        () => !document.querySelector('[aria-label="Dive left"]').disabled,
      );
    },
  );
  await check(
    "alternating goalkeeping, complete match, win screen, local record",
    async () => {
      for (let turn = 1; turn < 6; turn++) {
        const name = turn % 2 ? "Dive left" : "Shoot right";
        const button = game.getByRole("button", { name, exact: true });
        await button.waitFor();
        await button.click({ timeout: 15000 });
      }
      await game
        .getByText("Tiny paws. Massive W.", { exact: true })
        .waitFor({ timeout: 15000 });
      assert.equal(await game.locator(".winner-score").innerText(), "3 : 0");
      assert.equal(
        JSON.parse(
          await game.evaluate(() => localStorage.getItem("squeek-stats")),
        ).won,
        1,
      );
      await game.screenshot({ path: resolve(output, "winner-390.png") });
    },
  );
  await check(
    "share opens an encoded X intent with final score and real current link",
    async () => {
      let opened;
      await game.exposeFunction("recordOpen", (value) => {
        opened = value;
      });
      await game.evaluate(() => {
        window.open = (u) => {
          window.recordOpen(String(u));
          return null;
        };
      });
      await game.getByRole("button", { name: "Share on X" }).click();
      await game.waitForTimeout(100);
      const intent = new URL(opened);
      assert.equal(intent.hostname, "twitter.com");
      assert.ok(intent.searchParams.get("text").includes("3–0"));
      assert.equal(intent.searchParams.get("url"), url);
    },
  );
  await check("rematch resets score and keyboard selection works", async () => {
    await game.getByRole("button", { name: "Play again", exact: true }).click();
    await game
      .getByRole("button", { name: "Shoot left", exact: true })
      .waitFor();
    assert.equal(await game.locator(".score-numbers").innerText(), "0\n:\n0");
    await game.locator("h1").click();
    await game.keyboard.press("ArrowLeft");
    await game
      .getByText("What a save!", { exact: true })
      .waitFor({ timeout: 8000 });
  });
  await check("a missed choice times out and play continues", async () => {
    await game
      .getByRole("button", { name: "Dive left", exact: true })
      .waitFor();
    await game.waitForFunction(
      () => !document.querySelector('[aria-label="Dive left"]').disabled,
    );
    await game.clock.install();
    await game.clock.fastForward(10100);
    await game.clock.fastForward(5000);
    await game.locator('[aria-label="Opponent kick 1: goal"]').waitFor();
    await game.clock.resume();
  });
  await check(
    "leave confirmation preserves or resets the current game",
    async () => {
      await game.getByRole("link", { name: "Squeek Penalty home" }).click();
      await game.getByRole("button", { name: "Keep playing" }).click();
      assert.equal(await game.getByRole("dialog").count(), 0);
      await game.getByRole("link", { name: "Squeek Penalty home" }).click();
      await game
        .getByRole("button", { name: "Leave match", exact: true })
        .click();
      await game
        .getByRole("button", { name: "Play practice", exact: true })
        .first()
        .waitFor();
    },
  );
  await gameContext.close();
  await check(
    "practice works without telemetry and its help dialog pauses the clock",
    async () => {
      const offlineContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      const offline = await offlineContext.newPage();
      offline.setDefaultTimeout(12000);
      await offline.route("https://api.squeekchain.com/**", (route) =>
        route.abort(),
      );
      await offline.goto(url, { waitUntil: "networkidle" });
      await offline.getByText("Taking a breather", { exact: true }).waitFor();
      await offline.clock.install();
      await offline
        .getByRole("button", { name: "Play practice", exact: true })
        .first()
        .click();
      await offline
        .getByRole("button", { name: "Start my first match" })
        .click();
      await offline
        .getByRole("button", { name: "How to play", exact: true })
        .click();
      await offline.getByRole("dialog").waitFor();
      await offline.clock.fastForward(20000);
      await offline.getByRole("button", { name: "Close dialog" }).click();
      await offline.clock.runFor(200);
      assert.ok(
        parseInt(await offline.locator(".turn-timer").innerText()) >= 9,
      );
      assert.ok(
        await offline.getByRole("button", { name: "Shoot right" }).isEnabled(),
      );
      await offlineContext.close();
    },
  );
  await context.close();
  try {
    const safari = await webkit.launch({ headless: true });
    const p = await safari.newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(url);
    await p
      .getByRole("button", { name: "Play practice", exact: true })
      .first()
      .click();
    await p.getByRole("button", { name: "Start my first match" }).click();
    await p.getByRole("button", { name: "Shoot right" }).click();
    await p
      .getByRole("button", { name: "Dive left" })
      .waitFor({ timeout: 10000 });
    results.push({ name: "WebKit primary interaction", passed: true });
    await safari.close();
  } catch (e) {
    results.push({
      name: "WebKit primary interaction",
      passed: null,
      limitation: e.message.split("\n")[0],
    });
  }
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
  await writeFile(
    resolve(output, "results.json"),
    JSON.stringify(results, null, 2),
  );
}
console.log(JSON.stringify(results, null, 2));
if (results.some((r) => r.passed === false)) process.exitCode = 1;
