# SQUEEK PENALTY

A mobile-first hamster penalty shootout built with Next.js App Router, TypeScript, Tailwind CSS, custom SVG characters, and synthesized Web Audio. The production site is in `dist/`; it runs from a plain static host, including a gateway subpath.

**Playable now:** guest practice against Nibbles, alternating kicker/keeper turns, secret AI choices, a 10-second shot clock, first-to-three scoring with equal turns, sudden death, animated reveals, sound, celebration, rematches, and X sharing. Practice records stay on the current device and are labeled accordingly.

**Service handoff:** no Privy app ID or hosted multiplayer endpoint was supplied. X authentication and multiplayer are implemented but not activated in this export. Their controls explain this and offer practice; they never invent a signed-in player, room, opponent, queue, or leaderboard. See the setup below. The site uses no mandatory external wallet connection.

## Install, preview, rebuild

Use Node.js 22 or newer and npm. From the repository root:

```sh
npm run build
npm run typecheck
npm test
npm run preview
```

The first build, typecheck, or test automatically installs the exact lockfile into an isolated temporary build directory. No separate root `npm install` is needed. Dependency installation uses `npm ci --legacy-peer-deps`; the flag is necessary for the Privy SDK's peer dependency graph. Builds and package caches stay outside the source tree. Later commands reuse that installation when the lockfile is unchanged.

Preview serves `dist/` at `http://127.0.0.1:3000`. `npm run dev` starts Next's development server from the temporary workspace. Re-run it after changing source; it is a staged copy, not a live filesystem mirror. `scripts/run.mjs` performs the copy, lockfile install, production build, and static export. It keeps all required source and runtime assets in this repository and leaves the dependency directory outside it.

The production command is `next build --webpack` with `output: 'export'` and `assetPrefix: '.'`. The build copies Next's export to `dist/`. Fonts use a document-relative URL, and the app has one route with hash anchors. No server rewrites, API routes, or Next image service are required.

IMD handles publication and the `*.imd.site` address after review. Publish the contents of `dist/`; this assignment does not assign or invent a public hostname.

## Rules and controls

Choose left, center, or right. As the kicker, a different direction from the keeper scores. As the keeper, matching the shot makes the save. The AI selects its direction before the player chooses. Online, the server holds both choices privately and reveals only after both lock or the deadline expires.

The brief combines “first to 3” with five kicks each and sudden death. This implementation resolves that by always allowing equal turns: after each pair, a higher score wins if either player has reached three. If neither has reached three, finish five kicks each; the higher score then wins. A tie continues in sudden death, one complete pair at a time. A player never loses their reply because the first kicker reached three.

Direction buttons support touch, mouse, A/S/D, and arrow keys. A kicker timeout is a missed shot; a keeper timeout concedes. Both timing out means a missed shot. Help and exit dialogs pause the practice clock. Online deadlines keep running for both players. Sound starts only after an interaction and can be muted. Reduced motion removes shakes, confetti, and decorative animation while preserving text feedback.

## Enable X login and shared matches

1. Create or select the owner's Privy app in the [Privy dashboard](https://dashboard.privy.io/). Enable Twitter/X as its login method, configure the actual published site's allowed origin and OAuth redirect URL, and enable **Return user data in an identity token**. The frontend intentionally lists only Twitter. No email or wallet login is offered.
2. Put that app's **public app ID** into `public/game-config.json` as `privyAppId`. Leave it `null` until a real value is available. `components/PrivyAuth.tsx` configures an Ethereum embedded wallet with `createOnLogin: 'users-without-wallets'` and `showWalletUIs: false`. The player does not need to connect an external wallet or manage a seed phrase. SDK loading does not hide or remount the game.
3. Deploy `party/server.ts` to the owner's PartyKit service. In `partykit.json`, supply the service's `vars.PRIVY_APP_ID` and `vars.ALLOWED_ORIGIN`, where the latter is the exact published site origin, without a trailing slash. Both values are public configuration, not private keys. The service rejects unconfigured origins. An operator with the appropriate service account can run `npx --yes partykit@0.0.115 deploy` after configuring those values. Deployment was not run here.
4. Set `public/game-config.json`'s `partyHost` to the actual deployed service's HTTPS origin and rebuild. No endpoint or account is guessed. Never put a Privy app secret, OAuth secret, provider key, or wallet key into this file or the static site.
5. Verify with two distinct real X accounts: private room creation/join, quick match, hidden choices, alternating roles, disconnect, both-player rematch, avatar/handle, and embedded wallet creation. These real-account checks remain unperformed here.

The client sends a Privy identity token in the WebSocket's first message, not its URL. The room server verifies ES256, issuer, audience, expiry, and a signed Twitter linked account using Privy's app JWKS. It never trusts a client-provided handle or avatar. It rejects duplicate identities, a third player, late/repeated choices, oversized messages, invalid payloads, and excessive messages. Matchmaking pairs authenticated users; rematches require both players. An interrupted connection ends the room with a visible recovery action. Match resumption across service restarts and a ranked leaderboard are not implemented.

References: [Privy OAuth](https://docs.privy.io/authentication/user-authentication/login-methods/oauth), [identity tokens](https://docs.privy.io/user-management/users/identity-tokens), [PartyKit server API](https://docs.partykit.io/reference/partyserver-api/).

## Squeekchain data

The browser polls the official [Squeekchain API](https://docs.squeekchain.com/developers/api/) at `https://api.squeekchain.com/v1/status` and `/v1/core` every 15 seconds while visible. Requests have a seven-second timeout. Schema changes, unavailable responses, stale measurements, and request failures display an unavailable state; practice continues.

Rounds start at **1**, using the API's genesis timestamp, round duration, and observation timestamp, following the [official round definition](https://docs.squeekchain.com/system/rounds-and-blocks/). Last outcome uses adjacent `BatchSettled` events only when they identify a single round. Multi-round or missing history displays `Unknown`, not a fabricated last outcome.

Nap/Jog/Zoomies are **this game's cosmetic labels**, not additional official oracle attestations. Current wheel speed is Nap at zero, Jog below 833 mm/s, and Zoomies at or above 833 mm/s. Last settled-round work is Nap at zero, Jog from 1–299 work units, and Zoomies from 300. These thresholds affect visual timing and sparkles only. The secret-choice scoring odds never change. Telemetry is a confirmation-delayed Sepolia view, not a settlement promise. The visible stream link opens Squeekchain's official site. This is a fan-made ecosystem game.

## Checks and delivery

Actual production build, standalone typecheck, unit tests, browser interactions, screenshots, and the six-domain design review are recorded in [VALIDATION.md](VALIDATION.md). Design tokens and component behavior are documented in [DESIGN.md](DESIGN.md).

```sh
npm run check:budget
IMD_PLAYWRIGHT=/opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs \
PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright npm run check:browser
```

The browser check manages and closes its own bounded preview server. On another workstation, set `IMD_PLAYWRIGHT` to an existing Playwright module and use that installation's browsers. No browser or dependency archive is included in the submission.

The build and typecheck pass. The build reports a transitive viem/x402 dynamic-import warning inside Privy; practice has no observed runtime errors. The unneeded optional Farcaster Solana adapter is disabled in the webpack resolver. Privy is loaded only when a real app ID is configured; its complete required runtime chunks remain in the export.

The review revision restores shared dialog centring and shows the live Squeekchain round and last outcome directly on the pitch during phone play. `npm run check:browser` now also checks all shared dialog layouts at 320×568, 390×844 and 1440×900, plus live/unknown/offline pitch captions without overlap. Feed fixtures exist only in the browser test. See the revision record in [VALIDATION.md](VALIDATION.md) and the two finding responses in [.imd-responses.json](.imd-responses.json).

The entire submission is checked against 8,388,608 bytes by `scripts/bundle-budget.mjs`. Source, lockfile, static export, local font, share image, and licenses are retained. No ignore file was changed, and no dependency/cache directory, registry mirror, archive, submodule, or source map is required.

Outfit is bundled under its [SIL Open Font License](public/fonts/OFL.txt). Interface guidance is adapted from Jakub Krehel's Better Interface (MIT); documentation guidance is adapted from Paul Bakaus's Impeccable (Apache-2.0). Their notices and license texts are preserved in [docs/DESIGN-GUIDE-LICENSE.txt](docs/DESIGN-GUIDE-LICENSE.txt).
