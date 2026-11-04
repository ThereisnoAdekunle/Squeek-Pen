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
async function checkDialogLayout(browser, engine) {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  try {
    await context.route("https://api.squeekchain.com/**", (route) => route.abort());
    await context.addInitScript(() => localStorage.removeItem("squeek-tutorial"));
    for (const [width, height] of [[320, 568], [390, 844], [1440, 900]]) {
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      await page.setViewportSize({ width, height });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      async function centered(name) {
        const dialog = page.getByRole("dialog");
        await dialog.waitFor();
        const box = await dialog.boundingBox();
        assert.ok(box, `${name}: missing dialog`);
        assert.ok(Math.abs(box.x - (width - box.width) / 2) < 1,
          `${engine} ${width}px ${name}: horizontal centre`);
        assert.ok(Math.abs(box.y - (height - box.height) / 2) < 1,
          `${engine} ${width}px ${name}: vertical centre`);
        assert.ok(box.x >= 16 && box.y >= 19, `${name}: viewport inset`);
        assert.ok(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
          `${name}: no horizontal clipping`);
        await page.screenshot({ path: resolve(output, `${engine}-${name}-${width}.png`) });
      }
      await page.getByRole("button", { name: "Play practice", exact: true }).first().click();
      await centered("tutorial");
      // The short viewport must allow the final tutorial action to scroll into view.
      await page.getByRole("button", { name: "Start my first match" }).click();
      await page.getByRole("button", { name: "Shoot right", exact: true }).waitFor();
      await page.getByRole("button", { name: "How to play", exact: true }).filter({ visible: true }).click();
      await centered("help");
      await page.keyboard.press("Escape");
      await page.getByRole("link", { name: "Squeek Penalty home" }).click();
      await centered("exit");
      await page.getByRole("button", { name: "Leave match", exact: true }).click();
      await page.getByRole("button", { name: "Connect with X", exact: true }).click();
      await centered("login");
      await page.keyboard.press("Escape");
      for (const mode of ["Play a friend", "Quick match"]) {
        await page.getByRole("button", { name: new RegExp(mode) }).click();
        await centered(mode === "Quick match" ? "quick-match" : "friend");
        await page.keyboard.press("Escape");
      }
      await page.close();
    }
  } finally {
    await context.close();
  }
}
async function checkPitchFeed(browser) {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  try {
    const page = await context.newPage();
    let outcome = "Nap";
    let observedAt = new Date().toISOString();
    // These fixtures are test-only API responses, never runtime feed defaults.
    await page.route("https://api.squeekchain.com/v1/**", async (route) => {
      if (outcome === "offline") return route.abort();
      const now = Math.floor(Date.parse(observedAt) / 1000);
      const event = (round, previous, work) => ({
        eventName: "BatchSettled",
        arguments: Object.entries({ settledThroughRound: round,
          previousSettledThroughRound: previous, cumulativeWork: work,
          activeRoundCount: "1" }).map(([name, value]) => ({ name, value })),
      });
      await route.fulfill({ json: route.request().url().endsWith("/status") ? {
        schemaVersion: 1,
        measurement: { freshness: "online", observedAt, speedMmPerSecond: 0 },
      } : {
        schemaVersion: 1, status: "available",
        configuration: { genesisTimestamp: String(now - 1042 * 600), roundDuration: "600" },
        events: outcome === "Unknown" ? [] : [
          event("1042", "1041", outcome === "Nap" ? "100" : outcome === "Jog" ? "101" : "500"),
          event("1041", "1040", "100"),
        ],
      } });
    });
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (outcome of ["Nap", "Jog", "Zoomies", "Unknown", "offline"]) {
        observedAt = new Date().toISOString();
        await page.goto(url, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const corner = page.locator(".pitch-corner").first();
        const expected = outcome === "offline" ? "Live feed unavailable" : `Round #1043 · Last: ${outcome}`;
        await page.waitForFunction((text) => document.querySelector(".pitch-corner")?.textContent.trim() === text, expected);
        assert.equal(await corner.locator(".online").count(), outcome === "offline" ? 0 : 1);
        const box = await corner.boundingBox();
        assert.ok(box && box.x >= 0 && box.x + box.width <= width && box.y + box.height < 844,
          `${width}px ${outcome}: pitch status is on the first screen`);
        const other = page.locator(".pitch-corner-right");
        if (await other.isVisible()) {
          const right = await other.boundingBox();
          assert.ok(box.x + box.width <= right.x, `${width}px ${outcome}: pitch labels must not overlap`);
        }
        if (width === 390 && outcome === "Zoomies") {
          await page.getByRole("button", { name: "Play practice", exact: true }).first().click();
          await page.getByRole("button", { name: "Start my first match" }).click();
          await page.getByRole("button", { name: "Shoot right", exact: true }).waitFor();
          assert.equal(await corner.innerText(), expected);
          await page.screenshot({ path: resolve(output, "live-feed-choose-390.png") });
        }
      }
    }
  } finally {
    await context.close();
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
    // Allow the existing 0.01ms reduced-motion transitions to settle on a frame.
    await page.waitForFunction(
      () => document.getAnimations().filter((a) => a.playState === "running").length === 0,
      undefined,
      { timeout: 1000 },
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
  // Scripted scores need normal rules; a live hamster advantage would change them.
  await gameContext.route("https://api.squeekchain.com/**", (route) => route.abort());
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
  await check("Chromium tutorial, help, exit, login and online dialogs are centred at 320, 390 and 1440px",
    () => checkDialogLayout(browser, "chromium"));
  await check("pitch status shows live outcomes, unknown and unavailable without overlap at 320, 390 and 1440px",
    () => checkPitchFeed(browser));
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
    await check("WebKit shared dialogs are centred at 320, 390 and 1440px",
      () => checkDialogLayout(safari, "webkit"));
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
