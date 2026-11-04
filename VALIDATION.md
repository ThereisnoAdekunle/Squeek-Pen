# SQUEEK PENALTY validation

## Review revision, 2026-11-04

The four reported defects reproduced and are fixed. The production export was rebuilt from the corrected source. These are worker-side observations, not independent certification. The account-dependent public launch remains incomplete: no Privy app ID, PartyKit host/deploy access, or GitHub account access was supplied. Those values remain unset; no credentials or endpoints were invented.

| Check on this revision | Actual result |
| --- | --- |
| `npm run build` | Passed; Next static export copied to `dist/` |
| `npm run typecheck` | Passed (`tsc --noEmit --incremental false`) |
| `npm test` | 60 passed, 0 failed |
| `npm run check:browser` | 18 Chromium checks passed, 0 failed; WebKit not performed |
| Pinned `taste.mjs --out test/scratch/taste --offline` | 16/16 passed at 320, 390 and 1440px, including reduced motion |
| `node scripts/preview.mjs` inspected through Chromium | HTTP 200 at `/preview/`; current app chunk, advantage bar and relative assets verified |
| First screen at 390×844 | Product visible; primary action bottom measured at 594.65625px |
| Live Squeekchain fetch | Browser reported `Failed to fetch`; unavailable-state practice passed; API success cases tested with explicit fixtures |
| Privy OAuth, embedded wallet, real two-account matches | Not performed: owner service configuration required |
| Public site / GitHub push | IMD publication after review; owner GitHub/PartyKit operations not performed |

Commands ran from the repository root. Build, typecheck and tests used `TMPDIR="$PWD/test/scratch"` to keep all installation and build output in disposable scratch space. The existing lockfile and dependency versions were retained. Browser commands set `IMD_PLAYWRIGHT` to the available Playwright module and `PLAYWRIGHT_BROWSERS_PATH` to its installed browsers. Scratch logs/screenshots are verification scaffolding and are not submitted.

The build reported the existing Privy transitive viem/x402 dynamic-import warnings and a workspace-root warning caused by the nested scratch build. It completed successfully. The supplied browser tool could not launch because its temporary socket path was too long; direct Playwright with Chromium's headless shell worked. WebKit was initially absent. Downloading it succeeded, but host validation reported missing GTK/GStreamer/ICU and other shared libraries, so no WebKit, Safari, or physical-device success is claimed.

### Reproductions, fixes and regression coverage

| Finding | Evidence before the fix | Fix and recheck |
| --- | --- | --- |
| `1440fcd1…` stale playable export | `dist/index.html` had no hamster bar. Referenced `app/page-a9868b2700f90bea.js` contained “A sleepy keeper with the same fair odds.” and lacked advantage/reconnect strings. README explicitly said the export was old. | Rebuilt `dist/`. Preview-served HTML now has the bar; referenced runtime contains kicker advantage, reconnect and login-resume code and lacks the obsolete copy. Browser tests play an eligible Zoomies kick (correct dive, goal, 1–0, “Too fast!”), an eligible Nap kick (adjacent dive, save, 0–0, “Long reach!”), and Unknown (normal save). Flight times are 650/1050/850ms respectively. See `scripts/browser-check.mjs:162`. |
| `3d11db1b…` average mistaken for final round | The exact 101/102 fixture returned Zoomies instead of Nap. Added regressions failed before the parser change. | `rules/hamster.ts:123` reads the final `RoundRecorded`, exact one-round deltas, or evidence of a zero-work tail. Unexplained multi-round work is Unknown; duplicate logs do not inflate evidence. The reported fixture now returns Nap for round 102. Positive, low-work, zero, missing, duplicate and unsettled records are tested in `tests/hamster.test.ts:144`. |
| `66a49238…` disconnect while starting | With `fetchCore` pending, closing Alice reduced the seats from two to one; the new regression failed with `1 !== 2`. | `party/server.ts:233` enters `starting` and publishes both seats before awaiting the feed. Disconnects use the existing grace period; turn opening and settlement both require two seats. Tests cover rejoining the held seat, rejecting choices during startup, and grace expiry without resurrecting a cancelled match (`tests/rooms.test.ts:374`). |
| `e0dc5924…` hidden Q private code | The actual hook with isolated state/socket I/O generated QAAAAA, received `waiting`, and returned a null room code. The new assertion failed. The server also allowed joining a nonexistent six-character Q room. | `components/useOnlineMatch.ts:186` identifies quick rooms by the reserved eleven-character pattern. Server join rules use the same pattern. Hook regressions confirm QAAAAA is visible and quick-queue/assigned quick-room codes remain hidden; server rejects nonexistent Q private rooms (`tests/rooms.test.ts:12`). |

The baseline suite passed 51 tests. Adding parser/startup regressions first produced eight failures. Fixing those passed 58 tests; the added hook regression then failed on the old prefix rule. The final suite passes all 60 tests. The original deterministic tests for secret choices, signed identities, timeouts, alternating turns, equal-turn match completion, sudden death, rematch, matchmaking, origin validation, disconnect/rejoin and walkover remain passing.

The browser runner serves the actual production export under `/preview/`. It covers tutorial and keyboard focus return, unavailable login/online states, sound persistence, 320/390/730/900/1440px reflow, local assets/font, reduced motion, a full practice match, X intent score/link, rematch, timeout, leave confirmation, dialog centring, offline practice, pitch captions, and the new advantage scoring cases. Feed and random-number overrides exist only in test contexts, never the production site. Hook tests isolate React state and socket I/O; server tests use generated test signing keys, not real Privy accounts or a deployed PartyKit service.

### Better Interface review

Applied the pinned Better Interface workflow and all six core domains to the changed surfaces, preserving the existing stadium art, tokens, six-size type scale and controls. Reviewed the production screenshots at 390 and 1440px, plus 390px Nap/Zoomies choosing and result states. No additional layout/style defect reproduced, so CSS and unrelated UI behavior were left alone.

| Domain | Coverage and result | Limits |
| --- | --- | --- |
| Accessibility | Checked native buttons, labels, keyboard selection, dialog Escape/focus return, status words alongside advantage color, reduced motion and touch-target spacing. Probe: all 13 controls meet the 24px/spacing rule at 390px. | Eight utilities remain below the 44px comfort target, including the 32px stream link (`app/globals.css:586`); direction buttons are about 50px. No screen-reader, forced-colors or physical-device test. |
| Layout | Checked 320/390/730/900/1440px overflow, shared dialogs, pitch captions, and action visibility with the new bar. 390px screenshots show the game and primary action in the first viewport. | Native 200% zoom and RTL not tested. |
| Writing | Advantage and percentage copy match scoring. Unknown explicitly means normal rules. Q-prefixed private codes remain shareable. Replaced obsolete export/batch-average statements in README and DESIGN. | Real authenticated X display names and production errors require owner services. |
| Typography | Reused Outfit and existing source scale (12/14/16/20/28/48px), weights 400/600/800. Probe saw five sizes per viewport; labels and percentages wrap without clipping. | No localization or native text-scaling audit. |
| Colors | Preserved role tokens and explicit advantage wording/icons. Probe passed all resolved solid-background text pairs at 4.5:1, or 3:1 for large text. | Probe did not measure 39 text boxes over images/gradients; no exhaustive pitch-art contrast claim. |
| UI | Inspected real exported Nap/Zoomies flight times, rings, result feedback and button lock/release. Sound toggle, recovery logic and shared native dialogs covered by interaction/unit tests. | Audio quality not listened to; live OAuth/reconnect over public services and slowed animation-panel inspection not performed. |

Probe findings: zero failed checks. Five measured font sizes per viewport; first-screen prose is 24 words at 390px. The existing brand wordmark and illustrated stadium are preserved. `DESIGN.md` describes the final source/export rather than the preceding artifact.

Evidence produced in scratch: `old-export.json`, `regressions-before.log`, `hook-before.log`, `build.log`, `typecheck.log`, `tests-final.log`, `served-export.json`, `interactions/results.json`, `interactions/advantage-nap-390.png`, `interactions/scoring-zoomies-390.png`, and `taste/taste.json` with mobile/desktop screenshots. The scratch directory is removed before submission.

### Delivery and limitations

Final bundle measurement: 8,254,728 bytes of 8,388,608; export: 7,253,330 bytes. The conservative total includes source, lockfile, runtime assets and review documentation.

The repository fixes and matching static export are complete for the four review findings. Required Privy runtime chunks, local font, share image, source and lockfile are retained. The final full-tree budget check is recorded below. Its counter excludes the managed runtime’s already-ignored `.cache/` directory; a separate read-only Git file listing confirmed no dependency/cache directories or archives are in the submission. No ignore rule was changed. No existing dependency/build configuration, `lib/`, ignore file, secret file, submodule, or GitHub workflow was modified. `.imd-responses.json` answers each finding.

The owner must supply/configure the Privy app with X login and allowed origins, deploy PartyKit with matching app ID/origin settings, and set the two public values in `public/game-config.json` before real online play can be validated. README contains setup, local preview/rebuild, Vercel and owner GitHub instructions. No public deployment or GitHub push is claimed.

## Earlier revision (historical, superseded)

All sections below retain the previous validation record. They describe the older cosmetic-only export, not the current implementation. The results and limitations above supersede them.

Worker-side checks on the static export, 2026-11-02. These observations are not independent certification.

The summary includes the review revision. The original implementation records below are retained for context; the final section records the revision's reproductions, fixes and rerun results.

| Area | Result |
| --- | --- |
| Production build | Pass; `dist/index.html` and local assets exported |
| Standalone TypeScript | Pass |
| Game/API/room unit tests | 30 passed, 0 failed |
| Chromium primary interactions and layout regressions | 17 passed, 0 failed |
| taste@1 | 16/16 passed at 320, 390, and 1440px |
| Product and action on first screen at 390 | Yes; arena and practice action visible |
| Fabricated live identities/rooms/metrics | None; unavailable states are explicit |
| Share card | Local 1200×630 PNG, relative metadata, title, description, favicon |
| X and live shared rooms | Needs owner service configuration; not live-tested |
| Public `*.imd.site` publication | After IMD review |

## Scope and important assumptions

Reviewed the one-page arena, first-play tutorial, help and exit dialogs, practice match, shot/saving/timeout states, winner/rematch/share, mode selection, service availability, sound, telemetry, and responsive export. The default config deliberately has `null` for missing public service values. It does not impersonate an X account or simulate a multiplayer opponent.

The first-to-three/five-kick wording is resolved through equal paired turns, as explained in README. Nap/Jog/Zoomies are documented cosmetic classifications of actual official API data. The last outcome is unknown when adjacent events cannot establish a single round. Practice statistics are explicitly local to the device.

## Commands and results

- `npm run build`: exited 0 on the final application source. Next's production webpack build, TypeScript phase, prerendering, and export all completed. The exported entry is `dist/index.html`. A non-fatal viem/x402 dynamic-import warning remains inside the Privy dependency. The optional, unused Farcaster Solana adapter is disabled in the resolver. This is not a claim that real Privy OAuth was tested.
- `npm run typecheck`: exited 0, using `tsc --noEmit --incremental false` in the staged workspace.
- `node scripts/run.mjs test`: exited 0; **30 tests passed**. Tests cover all nine direction pairs, score conservation and equal-turn invariants across 1,000 seeded matches, early wins, the reply at match point, five-turn results, repeated sudden-death ties, invalid inputs, timeouts, API schema/freshness/precision, real local ES256 signatures, wrong-audience/expired/missing-X identities, origin restrictions, secret choices, duplicate submissions, deadlines, room capacity, matchmaking, disconnect, mutual rematch, malformed messages, and rate bounds. Test signing keys are generated inside the test process and never shipped as configuration.
- `IMD_PLAYWRIGHT=/opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node scripts/browser-check.mjs`: Chromium exercises a production export served under `/preview/`. Its current result is in `test/scratch/interactions/results.json`; the final count is recorded at the end of this document. The harness waits for the local font instead of racing font loading after viewport changes.
- `IMD_PLAYWRIGHT=/opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste`: exited 0; **all 16 checks passed**. No missing local resources, script errors, horizontal overflow, text overlaps, clipped text, repeated lines, extra tracked labels, excess type sizes/families/weights, border-plus-shadow surfaces, or reduced-motion animation failures were measured.
- `npm run check:budget`: checks the entire deliverable, including source, lockfile, public assets, docs, and export, against 8,388,608 bytes. It also checks local entry assets and the relative share image. The final byte count is recorded below.

The pinned browser connector returned `Transport closed`, so browser inspection used the supplied Playwright/Chromium module directly through bounded scripts that start and close their own local preview. WebKit launch was attempted and could not find an available executable; no Safari pass is claimed.

## Interaction and screenshot coverage

Chromium checks cover the first phone screen; honest X/friend/quick-match availability; Escape and opener-focus restoration; mute persistence; overflow at 320, 390, 730, 900, and 1440px; reduced motion; assets under a hosting subpath; tutorial and timed locked choices; alternating goalkeeping; a complete 3–0 match and local record; an encoded X intent containing the score and current page link; rematch reset and keyboard selection; automatic timeout and continued play; exit confirmation; and practice with telemetry unavailable while help pauses its clock.

The browser's deterministic practice RNG is installed only in an isolated test context. The production game uses Web Crypto. Share validation intercepts `window.open` to inspect the intended X URL; no post was sent.

Screenshots were generated and viewed, including:

- `test/scratch/taste/shots/390.png` and `1440.png`: phone-first product/action and desktop composition.
- `test/scratch/interactions/layout-320.png`, `layout-730.png`, `layout-900.png`, `layout-1440.png`: breakpoint captures generated by the browser harness. The primary 390 and desktop screenshots were directly inspected; overflow at every listed width was measured.
- `test/scratch/interactions/choose-390.png`, `goal-390.png`, `winner-390.png`: direction controls, score feedback, full follow-through/dive, and win actions.
- `public/og-image.png`: generated from the local SVG as a real PNG with no external runtime font or image dependency.

Scratch screenshots and machine-readable results are intentionally temporary and are not included in the submitted source bundle. The scripts regenerate them. The share image and all required runtime assets remain in `public/` and `dist/`.

## Better Interface: six-domain review

| Domain | Coverage and evidence | Limits |
| --- | --- | --- |
| Accessibility | Checked native buttons/links/dialog, control names, visible focus CSS, room labels/errors, Escape and focus restoration, keyboard shot selection, live announcements, redundant status/score icons, and reduced motion. taste@1 passes target spacing. | No screen-reader session, physical touch device, native 200% zoom, or exhaustive focus-indicator contrast audit. Six utilities are below the recommended 44px comfort target but pass the probe's 24px/spacing rule. |
| Layout | Checked first action at 390×844, all five listed widths, arena/sidebar stacking, static subpath, overflow, result/winner states, and the clipped-character fix in screenshots. No overlap or cut-off text in the final probe. | RTL, pseudolocalization, unusually long real X profiles, and native browser text enlargement were not tested. |
| Writing | Checked verbs, consistent shot/dive language, local-record labels, direct service errors, empty/offline states, short headline with a plain explanation, and reduced slogan density. No fake online state. | Real provider-specific OAuth error screens await configuration. |
| Typography | Checked local Outfit loading, weights 400/600/800, six source sizes, five rendered sizes per probe viewport, tabular scores, wrapping, and 16px form input text. | Non-Latin font fallback and browser-native text enlargement untested. |
| Colors | Checked the probe's resolved solid pairs and four explicit rendered foreground/background pairs below. Status has text plus color. | The probe skips 39 text boxes over artwork or gradient backgrounds. No all-pixel contrast or full accessibility conformance claim. |
| UI details | Checked finite intro/shot/result/celebration states, native dialog behavior, press/hover/disabled states, neutral/selected/primary surfaces, overflow-safe character animation, and reduced motion. No `transition: all`; no endless entry motion. | No physical-device frame-rate profiling, hardware sound listening, Safari animation test, or 10%-speed DevTools animation session. |

Rendered styles collected at 390px in the default dark UI gave these WCAG contrast ratios:

| Element | Foreground / actual solid background | Ratio |
| --- | --- | --- |
| Practice action | `#1e1c22` / `#ffad5c` | 9.15:1 |
| Practice description | `#a8b6ca` / `#142135` | 7.86:1 |
| Mode heading | `#fff5e7` / `#0f1a2b` | 16.18:1 |
| Mode description | `#a8b6ca` / `#0f1a2b` | 8.49:1 |

## Findings, corrections, and rechecks

| Severity | Source | Observed problem, correction, and recheck |
| --- | --- | --- |
| High | `app/layout.tsx:20` | A CSS-bundled relative font became an incorrectly nested `_next` URL under the static subpath. Moved its font-face to document-relative inline CSS. The browser validates an actual loaded Outfit face and no missing local resources; taste render passes. |
| High | `components/Pitch.tsx:233` | Goal screenshots exposed clipped character follow-through and an almost invisible keeper dive inside SVG foreignObject bounds. Both character wrappers now allow visible overflow. Rebuilt, captured, and viewed the goal again: the keeper and complete kicker render beyond their original boxes. |
| Medium | `components/Pitch.tsx:334`, `app/globals.css:2464` | A decorative pitch caption crowded the footer labels and formed a redundant label above the main action. Removed the caption and raised active role/lock labels. Final 390 screenshots and probe show no text overlap or extra eyebrow. |
| Medium | `components/Modal.tsx:18` | A cleanup registered while the dialog was closed could restore stale body focus during opening. Closed dialogs now register no restoration callback; cancel is handled before native dismissal. Escape returns to the opener in Chromium. |
| Medium | `components/Game.tsx:631` | Several short two-part slogans competed with the game. Kept the headline and replaced the rest with clear actions/descriptions. The probe now measures two such lines, within its bar. |
| Medium | `lib/activity.ts:40` | A zero-based round calculation disagreed with Squeekchain's round-one genesis definition. Added the one-based offset and tests; a fixed API fixture gives the correct current round. Missing or multi-round outcomes stay unknown. |
| Medium | `components/Game.tsx:150` | Updating score state during a reveal advanced the rendered role too early. Result frames now retain the last kick's kicker until the next turn. Viewed shot/goal frames preserve the correct jerseys and controls. |
| Low | `public/og-image.svg:1` | The original button label exceeded its share-card shape. Replaced it with “Play practice” and regenerated the PNG. The image is locally bundled at 1200×630. |

No unresolved reproducible blocker remains in guest practice or the measured initial layouts. The service gaps below remain visible rather than simulated.

## Remaining activation and verification limits

Real Privy X OAuth, real X avatars/handles, background embedded-wallet creation, and two-device multiplayer need the owner's public Privy app ID, allowed domain, enabled identity tokens, and deployed room service. The server is implemented and locally tested with signed identities; it was not deployed or exercised against real Privy accounts. Cross-device network resilience and room resumption after service restart were not certified. No on-chain transaction, token economy, wager, or ranked leaderboard is implemented or represented as available.

The static website, guest game, source, lockfile, export, design documentation, and build tooling are delivered. Completion of the full live multiplayer brief depends on the explicitly documented service handoff. Publication and final hostname are handled after review by IMD.

## Original accepted run record

Final application build and standalone typecheck passed. Unit tests: **30/30**. Chromium interactions: **15/15**. taste@1: **16/16**. WebKit was unavailable and is not counted as a pass. The final goal screenshot was viewed after the character overflow fix; both characters now remain intact during the reveal.

Final submission budget: **8157422 bytes** across **242 files**; production export: **7252695 bytes**. Limit: **8388608 bytes**. Required source, runtime chunks, font, share image, documentation, and lockfile remain complete. No ignore file was changed.

## Review revision: reproduced findings and final verification

Complete for the two reported findings. Runtime changes are limited to the shared dialog margin and the existing pitch caption/dot. Authentication, multiplayer, game rules, illustrations, dependencies and layout breakpoints retain the accepted implementation. `DESIGN.md` describes the updated components, and `.imd-responses.json` answers both finding IDs.

| Finding | Reproduction on original export | Fix and recheck |
| --- | --- | --- |
| High: dialogs pinned to the corner | Chromium at 390px: tutorial rectangle `(0, 0, 358, 691.16)`; at 1440px: X dialog `(0, 0, 440, 517.78)`. Computed margin was `0px`. Screenshots confirmed the top-left placement. | `app/globals.css:1139` explicitly restores `margin: auto`. Browser checks measure both centres within 1px for tutorial, help, exit, login, friend-room and quick-match dialogs at 320×568, 390×844 and 1440×900. The short-screen tutorial start action scrolls into view and starts play. |
| Medium: live round only in the lower sidebar | At 390×844, with the official API responding, `.hamster-live` began at y=1026.66 and the pitch only displayed “Squeek Stadium”. | `components/Game.tsx:691` now renders round/outcome from the existing feed state in the pitch corner. Loading/offline says “Live feed unavailable”; missing outcome says “Unknown”. `app/globals.css:459` uses the existing subtle/success tokens for the indicator. Test-only API responses cover Nap, Jog, Zoomies, Unknown and offline at 320, 390 and 1440px, including first-screen visibility, no corner-label overlap and visibility during a practice turn. The detailed sidebar remains. |

Final commands and results:

- `npm run build`: exit 0; production compilation, TypeScript, prerender and static export completed on the final application source. The initial invocation reported exit 143 while its child continued; an immediate retry encountered its active build lock. After that export completed, a fresh complete build exited 0. Transitive Privy/viem dynamic-import warnings remain non-fatal. No source or dependency changes were needed for those warnings.
- `npm run typecheck`: exit 0.
- `npm test`: exit 0; 30 passed, 0 failed.
- `node scripts/browser-check.mjs`, using an external Playwright installation: final exit 0; **17 Chromium checks passed**, 0 failed. The original 15 interactions and the two added layout/feed regressions all passed. One earlier rerun caught an immediate reduced-motion assertion racing the existing 0.01ms CSS transitions. The harness now allows one settling frame, bounded to one second, before requiring zero running animations; runtime motion behavior was not changed.
- `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste`, with the same external browser installation: exit 0; **16/16 passed** on the rebuilt export at 320, 390 and 1440px. Entry metadata, local resources, first-screen product/action, typography and overflow remain intact.
- `npm run check:budget`: final totals are recorded below. No ignore file was created or changed. Dependencies and caches remain outside the repository, and scratch browser output is excluded from delivery.

Browser checks serve the export under `/preview/`. Final machine-readable interaction results are in `test/scratch/interactions/results.json`; final probe results are in `test/scratch/taste/taste.json`. These scratch files are regenerated by the delivered scripts and are not submitted.

Rendered screenshots generated and directly inspected include `test/scratch/interactions/chromium-tutorial-320.png`, `chromium-tutorial-390.png`, `chromium-help-390.png`, `chromium-exit-390.png`, `chromium-login-1440.png`, and `live-feed-choose-390.png`, plus `test/scratch/taste/shots/390.png` and `1440.png`. The probe's phone screenshot also showed the actual API-backed round/outcome on the first screen. Fixtures used to cover every outcome exist only in the browser harness.

The revision applies the pinned Better Interface guide across all six domains:

| Domain | Revision coverage | Remaining limits |
| --- | --- | --- |
| Accessibility | Retained native dialog semantics/names. Rechecked Escape, opener-focus restoration, keyboard gameplay, reduced motion and the scroll-reachable tutorial action. | No screen-reader session, physical touch device or native browser zoom. |
| Layout | Measured tutorial/help/exit/login and both online dialogs at three viewport sizes, checked first-screen pitch status and both corner labels, and inspected corrected phone/desktop screenshots. | Authenticated profile dialog, WebKit, RTL and pseudolocalization unverified. |
| Writing | Reused established round/outcome vocabulary and explicit Unknown/unavailable copy. No new service or identity claims. | Real account/provider errors still need owner configuration. |
| Typography | Retained the six-size Outfit system. Local font loading and type/overflow probe pass; all added caption cases fit the tested widths. | Non-Latin fallback and native text enlargement unverified. |
| Colors | Reused existing subtle/success tokens with redundant status text. Resolved solid-background probe pairs pass. | No new pixel-level contrast measurement over the illustrated pitch; no full conformance claim. |
| UI details | Inspected native top-layer centring/backdrop and short-screen scrolling; rechecked practice/rematch/share/exit and reduced motion. | No slowed animation-panel session or physical-device profiling. |

The browser connector could not launch its configured Chrome, so inspection used local Playwright/Chromium. WebKit launch reported missing host dependencies; an additional bounded launch attempt did not produce a usable page. No WebKit pass is claimed. Owner activation requirements for real Privy X login and public multiplayer remain as documented above; this revision does not certify those external services or publication.

Final revision submission budget: **8166020 bytes** across **243 files**; production export: **7245611 bytes**. Limit: **8388608 bytes**. Required source and runtime assets remain complete.
