# SQUEEK PENALTY
squeekchain-project: 4a43879b-dbde-43c9-a08a-971df70faa3b

A mobile-first hamster penalty shootout built with Next.js App Router, TypeScript, Tailwind CSS, custom SVG characters, and synthesized Web Audio. The production site is in `dist/`; it runs from a plain static host, including a gateway subpath.

**Playable in the committed `dist/`:** guest practice against Nibbles, alternating kicker/keeper turns, secret AI choices, a 10-second shot clock, first-to-three scoring with equal turns, sudden death, animated reveals, sound, celebration, rematches, and X sharing. Practice records stay on the current device and are labeled accordingly.

## Current status

**The production export has been rebuilt from the current source and checked.** Build and typecheck passed, along with 60 unit tests, 18 Chromium interaction checks, and all 16 design-probe checks. See [VALIDATION.md](VALIDATION.md) for evidence and limits, including unavailable WebKit and real-account checks.

| Feature | State |
| --- | --- |
| Squeekchain advantage (Zoomies, Nap, Jog) | Active in `dist/`; Nap/Zoomies scoring and Unknown fallback verified in Chromium |
| Reconnect, 30-second seat hold, walkover win | Included in `dist/`; server regressions pass, including disconnect during startup |
| X login through Privy | Off until the owner sets a Privy app ID |
| 1v1 rooms and quick match through PartyKit | Off until the owner deploys the server |
| Public GitHub repository under `Thereisnodekunle` | Not created; this job has no access to that account |

While login and multiplayer are off, their controls say so and offer practice. They never invent a signed-in player, room, opponent, queue, or leaderboard. The site needs no external wallet.

## After launch

Only the owner can do these steps, because each needs the owner's own account. Nothing here moves money.

1. **Set the Privy app ID.** It goes in `privyAppId` in `public/game-config.json`, or `NEXT_PUBLIC_PRIVY_APP_ID` on Vercel, as described in [Enable X login and shared matches](#enable-x-login-and-shared-matches).
2. **Deploy the PartyKit server and set its address.** The address goes in `partyHost`, or `NEXT_PUBLIC_PARTYKIT_HOST` on Vercel.
3. **Publish the repository.** Run these from a clean copy with your own GitHub login:

   ```sh
   gh repo create Thereisnodekunle/squeek-penalty --public --source=. --push
   ```

### Decisions made without the requester

| What was open | Choice | Why |
| --- | --- | --- |
| Privy app ID and PartyKit address were not supplied | Left `null` in `public/game-config.json`, with those features off | A made-up value would ship a login and lobby that fail. Both are one-line settings for the owner. |
| Deploying PartyKit and pushing to GitHub | Not done; exact commands provided | Both need the owner's accounts, and this job has neither. |
| How strong the advantage is | A 35% chance on eligible kicks | Strong enough to feel, without replacing the guessing game. A guaranteed effect would make diving center always correct on Nap. |
| Which round sets the rules | The final settled round, read at the start of each turn | Both players see the rule before choosing, and it cannot change mid-turn. |
| A batch that settles several rounds at once | Use its final `RoundRecorded` work, or a provable zero-work tail; otherwise Unknown | A batch average cannot establish the last round. Unknown uses normal rules. |
| Who may connect to the server | `https://*.imd.site` by default | The final site address is assigned after this job. A valid Privy identity is still required to play. |

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

### Deploy to Vercel

Import the repository into Vercel. `vercel.json` sets the install and build commands, including the `--legacy-peer-deps` flag the Privy SDK needs. Add `NEXT_PUBLIC_PRIVY_APP_ID` and `NEXT_PUBLIC_PARTYKIT_HOST` under the project's environment variables, then add your custom domain. Add that domain to the Privy app's allowed origins and to `ALLOWED_ORIGIN` in `partykit.json`, then redeploy PartyKit. This configuration has not been tried on Vercel yet.

## Rules and controls

Choose left, center, or right. As the kicker, a different direction from the keeper scores. As the keeper, matching the shot makes the save. The AI selects its direction before the player chooses. Online, the server holds both choices privately and reveals only after both lock or the deadline expires.

The brief combines “first to 3” with five kicks each and sudden death. This implementation resolves that by always allowing equal turns: after each pair, a higher score wins if either player has reached three. If neither has reached three, finish five kicks each; the higher score then wins. A tie continues in sudden death, one complete pair at a time. A player never loses their reply because the first kicker reached three.

Direction buttons support touch, mouse, A/S/D, and arrow keys. A kicker timeout is a missed shot; a keeper timeout concedes. Both timing out means a missed shot. Help and exit dialogs pause the practice clock. Online deadlines keep running for both players. Sound starts only after an interaction and can be muted. Reduced motion removes shakes, confetti, and decorative animation while preserving text feedback.

### Hamster advantage

The last settled Squeekchain round sets the rules for each turn. The rule is fixed when the turn opens, shown under the pitch, and marked by a colored ring around the pitch while an advantage is active.

| Last settled round | Who it helps | Effect |
| --- | --- | --- |
| Zoomies | Kicker | Faster ball. A correct dive still concedes 35% of the time. |
| Nap | Keeper | Slower ball. A shot one lane from the dive is saved 35% of the time. Left and right are two lanes apart, so they are never reached. |
| Jog | Nobody | Normal rules. |
| Unknown or feed down | Nobody | Normal rules. |

If both players pick lanes at random, the goal rate is about 78% on Zoomies, 67% on normal rules and 51% on Nap. A player who misses the shot clock never benefits. Online, the server reads the feed, draws the roll and sends only the result, so a client cannot choose its own advantage.

## Enable X login and shared matches

1. Create or select the owner's Privy app in the [Privy dashboard](https://dashboard.privy.io/). Enable Twitter/X as its login method, configure the actual published site's allowed origin and OAuth redirect URL, and enable **Return user data in an identity token**. The frontend intentionally lists only Twitter. No email or wallet login is offered.
2. Put that app's **public app ID** into `public/game-config.json` as `privyAppId`, or set `NEXT_PUBLIC_PRIVY_APP_ID` at build time. Leave it `null` until a real value is available. `components/PrivyAuth.tsx` configures an Ethereum embedded wallet with `createOnLogin: 'users-without-wallets'` and `showWalletUIs: false`. The player does not need to connect an external wallet or manage a seed phrase. SDK loading does not hide or remount the game.
3. Deploy `party/server.ts` to the owner's PartyKit service. In `partykit.json`, add the app ID as `vars.PRIVY_APP_ID`. `vars.ALLOWED_ORIGIN` is a comma-separated list of allowed site origins, without trailing slashes; `https://*.example.com` matches subdomains. It defaults to `https://*.imd.site`, so add any custom domain, plus `http://localhost:3000` for local play. Both values are public configuration, not private keys. The service rejects other origins. Log in and deploy with `npx --yes partykit@0.0.115 login`, then `npx --yes partykit@0.0.115 deploy`. Deployment was not run here.
4. Set `public/game-config.json`'s `partyHost`, or `NEXT_PUBLIC_PARTYKIT_HOST`, to the deployed service's HTTPS origin and rebuild. No endpoint or account is guessed. Never put a Privy app secret, OAuth secret, provider key, or wallet key into this file or the static site.
5. Verify with two distinct real X accounts: private room creation/join, quick match, hidden choices, alternating roles, disconnect and rejoin, both-player rematch, avatar/handle, and embedded wallet creation. These real-account checks remain unperformed here.

The client sends a Privy identity token in the WebSocket's first message, not its URL. The room server verifies ES256, issuer, audience, expiry, and a signed Twitter linked account using Privy's app JWKS. It never trusts a client-provided handle or avatar. It rejects duplicate identities, a third player, late/repeated choices, oversized messages, invalid payloads, and excessive messages. Matchmaking pairs authenticated users; rematches require both players.

Both authenticated seats are reserved before the first feed request, so a disconnect while the match starts also gets the reconnect grace period. If a player drops mid-match, the client retries for about 20 seconds and the server holds the seat for 30. The shot clock keeps running, a locked choice stays locked, and the other player sees a notice. A player who does not return loses by walkover. Match resumption across service restarts and a ranked leaderboard are not implemented.

References: [Privy OAuth](https://docs.privy.io/authentication/user-authentication/login-methods/oauth), [identity tokens](https://docs.privy.io/user-management/users/identity-tokens), [PartyKit server API](https://docs.partykit.io/reference/partyserver-api/).

## Squeekchain data

The browser polls the official [Squeekchain API](https://docs.squeekchain.com/developers/api/) at `https://api.squeekchain.com/v1/status` and `/v1/core` every 15 seconds while visible. Requests have a seven-second timeout and never block play. Online, the room server reads `/v1/core` itself, at most every 30 seconds, and waits no more than 1.2 seconds before opening a turn.

The API can fail without stopping a match:

- **`/v1/status` down or stale:** only the wheel-speed label is lost.
- **`/v1/core` down for up to 10 minutes:** the last good round stays in effect.
- **`/v1/core` down for longer:** the pitch shows "Live feed unavailable" and play uses normal rules.

Rounds start at **1**, using the API's genesis timestamp, round duration, and observation timestamp, following the [official round definition](https://docs.squeekchain.com/system/rounds-and-blocks/). The newest `BatchSettled` sets the settled boundary. The parser uses that final round's `RoundRecorded.work` when present. For a single-round batch, the change from the preceding cumulative total is also exact. A zero-work settlement, or records accounting for all batch work or active rounds before the boundary, proves a Nap tail. Duplicated logs are counted once and newer unsettled records are ignored. Unexplained multi-round work displays `Unknown` and uses normal rules; no batch is averaged.

Nap/Jog/Zoomies are **this game's own labels**, not additional official oracle attestations. Last settled-round work is Nap at zero, Jog from 1–299 work units, and Zoomies from 300; these set the [hamster advantage](#hamster-advantage). Current wheel speed is Nap at zero, Jog below 833 mm/s, and Zoomies at or above 833 mm/s; it only changes the sidebar and never affects scoring. Telemetry is a confirmation-delayed Sepolia view, not a settlement promise. The stream link under the pitch and in the sidebar opens Squeekchain's official site. This is a fan-made ecosystem game.

The work thresholds are game rules. The live API fetch was unavailable during this revision's browser check; deterministic API fixtures verified settled-round parsing, scoring, and outage behavior. Live outcome frequency remains unconfirmed.

## Checks and delivery

Build, typecheck, test, browser and design review results are recorded in [VALIDATION.md](VALIDATION.md). The current revision's results cover the delivered source and rebuilt `dist/`. Design tokens and component behavior are documented in [DESIGN.md](DESIGN.md).

```sh
npm run check:budget
IMD_PLAYWRIGHT=/path/to/playwright/index.mjs npm run check:browser
```

The browser check manages and closes its own bounded preview server. On another workstation, set `IMD_PLAYWRIGHT` to an existing Playwright module and use that installation's browsers. No browser or dependency archive is included in the submission.

The current build and typecheck passed. The build reported transitive viem/x402 dynamic-import warnings inside Privy and a workspace-root warning from the isolated scratch build; the exported practice game had no observed runtime errors. The unneeded optional Farcaster Solana adapter is disabled in the webpack resolver. Privy is loaded only when a real app ID is configured; its complete required runtime chunks remain in the export.

The review revision preserves shared dialog centring and pitch telemetry. `npm run check:browser` checks dialog layouts at 320×568, 390×844 and 1440×900, live/unknown/offline pitch captions, and actual Nap/Zoomies scoring in the production export. Controlled feeds and random rolls exist only in tests. All four review responses are in [.imd-responses.json](.imd-responses.json).

The entire submission is checked against 8,388,608 bytes by `scripts/bundle-budget.mjs`. Source, lockfile, static export, local font, share image, and licenses are retained. No ignore file was changed, and no dependency/cache directory, registry mirror, archive, submodule, or source map is required.

Outfit is bundled under its [SIL Open Font License](public/fonts/OFL.txt). Interface guidance is adapted from Jakub Krehel's Better Interface (MIT); documentation guidance is adapted from Paul Bakaus's Impeccable (Apache-2.0). Their notices and license texts are preserved in [docs/DESIGN-GUIDE-LICENSE.txt](docs/DESIGN-GUIDE-LICENSE.txt).
