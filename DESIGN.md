# SQUEEK PENALTY design system

## Overview

A compact, illustrated penalty arena for casual mobile play. A midnight stadium carries the composition; cream type, hamster blue, and warm orange make the choices readable. The game is visible immediately. The short headline introduces it without delaying the first playable action. Decorative hamster energy lives in the pitch; account and service states use plain language.

This document describes the current source. The committed `dist/` predates the hamster bar, advantage ring and connection notices until it is rebuilt; see `VALIDATION.md`. The implementation uses a single light-on-dark theme. `app/globals.css` owns the tokens and responsive rules. `components/Game.tsx` owns the screen and its game states; custom illustrations are in `Hamster.tsx` and `Pitch.tsx`.

## Colors

The root declarations in `app/globals.css` expose hue primitives through role tokens. Components use role tokens; illustrated fur, turf, netting, and floodlights have local SVG palettes.

| Role token | Value | Use |
| --- | --- | --- |
| `--color-page` | `#0a1220` | Page and deep stadium surround |
| `--color-surface` | `#0f1a2b` | Arena base and sidebar sections |
| `--color-elevated` | `#142135` | Controls and dialogs |
| `--color-hover` | `#1a2a40` | Neutral control fills |
| `--color-border` | `#293b52` | Control structure |
| `--color-text` | `#fff5e7` | Primary cream text |
| `--color-muted` | `#a8b6ca` | Secondary copy |
| `--color-subtle` | `#8397af` | Lower-emphasis utilities |
| `--color-action` | `#ffad5c` | Primary actions and kicking cue |
| `--color-action-hover` | `#f69a47` | Primary hover |
| `--color-player` | `#74b5ff` | Player identity and defending cue |
| `--color-success` | `#91dbb0` | Connected feed and scored kick marker |
| `--color-danger` | `#ffa4a4` | Urgent timer and validation text |
| `--color-focus` | `#fff5e7` | Two-pixel focus perimeter |

Primary action text is `#1e1c22` on orange. Mode selection uses a warmer dark fill and orange border, alongside a check mark. Score markers include a check or cross; status also has words. Solid rendered text pairs pass the supplied contrast probe. Text over pitch artwork and the page's subtle radial background has not been exhaustively contrast-measured; see validation.

## Typography

Outfit is the single UI family, followed by `ui-sans-serif, system-ui, sans-serif`. Its local variable WOFF2 lives at `public/fonts/outfit-latin.woff2`, with OFL attribution beside it. The font-face declaration in `app/layout.tsx` uses a document-relative URL so fonts work under a hosting subpath.

The six source sizes are 12, 14, 16, 20, 28, and 48px, mapped to `--text-xs` through `--text-display`. The interface uses weights 400, 600, and 800. Body line height is 1.5; short headings are 1.1–1.15. Headings balance wrapping. Descriptions use `text-wrap: pretty`. Changing scores and timers use tabular numerals.

The desktop headline uses 48px and −2px tracking. At 1120px and below it uses 28px; at the narrowest layout the two phrases intentionally occupy separate lines. Brand lettering is uppercase as a logo; content uses normal casing. Form inputs remain 16px on mobile. Handles wrap instead of being ellipsized.

## Layout

The content and header have a 1280px maximum width, centered with 32px inline padding at desktop. The main grid uses `minmax(0, 1fr) 306px` with a 24px gap. The stadium occupies the flexible column, while match modes and telemetry sit in the sidebar. Shared gaps generally use 8/12/16/20/24/32px steps.

Breakpoints are 1120, 900, 730, 500, and 360px. At 730px the arena becomes a full-width first row and sidebar sections share the next row. At 500px the sidebar becomes a vertical stack, page padding becomes 16px, and the practice button spans its inset control area. At 360px padding becomes 12px and the headline wraps deliberately. The rules strip changes from four columns to two, then one. Navigation collapses to a help utility, while sound and X remain available.

The scene uses an SVG coordinate system with a responsive aspect ratio. Physical left and right remain physical game directions. The score, player handles, role, clock, and direction controls remain HTML. Art may be clipped to the rounded stadium; critical text is not ellipsized. The final export was observed without horizontal overflow at 320, 390, 730, 900, and 1440px. Native browser zoom, RTL, and physical phone behavior remain unverified.

## Elevation & Depth

Standard surfaces use tonal separation and no shadows. Borders identify controls and selected states. The stadium obtains depth from perspective lines, netting, floodlight cones, gradient fur, and contact shadows drawn within SVG.

The native dialog alone uses elevation: `0 24px 100px #0008`, a dark backdrop, and an 8px backdrop blur. The connection recovery banner uses its own fixed overlay shadow. Scene overlays stay inside the scene; the native dialog enters the browser top layer.

## Shapes

The arena has a 20px outer radius, reduced to 16px on phones. Sidebar sections use 16px, controls 10–12px, and the dialog 22px. Avatar and status markers are circles. Buttons have clear shapes and generous interior padding. Direction buttons have a minimum 50–51px height. Utility controls are smaller on narrow phones, meet the probe's spacing rule, and are reported as below the 44px comfort target.

## Components

- `Hamster` (`components/Hamster.tsx`): decorative SVG with blue/orange jerseys, front/back views, sleepy eyes, and per-instance gradient IDs. It is reused in player placeholders, the pitch, onboarding, telemetry, and celebration. Runtime X images cover the fallback hamster and can fail back to it.
- `Pitch` (`components/Pitch.tsx`): stadium, hamster crowd, goalie and run-up animation, ball flight, rippling net, dust, result text, and activity effects. Character `foreignObject` wrappers permit visible overflow, keeping the dive and follow-through intact. Inputs carry phase, shot, dive, goal, role, match-point state, activity, and timeout feedback. The HTML control group supplies the actual choices.
- Button patterns (`app/globals.css`): `.primary-button` is orange, `.secondary-button` is neutral, `.icon-button` provides labeled utilities, and `.direction-button` distinguishes kicking from defending through both words/icons and color. Disabled choices remain visibly locked. Pointer press scales to 0.96; hover is limited to hover-capable devices.
- Match modes (`components/Game.tsx`): full-width native buttons with title, short description, icon, and selected check mark. Online choices reveal honest setup, login, connection, waiting, code-entry, error, and recovery states as appropriate.
- `Modal` (`components/Modal.tsx`): native `dialog`, automatic focus containment, Escape/backdrop dismissal, and focus restoration to the opener. The shared `.modal` rule explicitly sets `margin: auto` to centre the dialog horizontally and vertically despite Tailwind's margin reset. Width is the viewport minus 32px, capped at 440px; maximum height is `100dvh - 40px`, with native scrolling for short screens. It has no stale closed-state focus callback. Practice clocks pause during help/exit dialogs; online deadlines continue.
- `PrivyAuth` (`components/PrivyAuth.tsx`): conditional, dynamically imported X-only auth bridge with embedded-wallet UI explicitly hidden. It renders separately from the game so SDK initialization does not replace the arena. Until configured, the login action explains availability and offers practice.
- Live status (`components/Game.tsx`, `rules/hamster.ts`): the pitch's lower-left corner shows the current Squeekchain round and last outcome from the same state as the sidebar, so it remains visible during phone play. Missing outcomes say “Unknown”; loading and offline states say “Live feed unavailable”. The decorative dot uses `--color-success` only when live, otherwise `--color-subtle`. The sidebar retains its detailed status, round row, and official stream link.
- Hamster bar (`.hamster-bar`, `components/Game.tsx`): an in-flow row between the pitch and the controls, on `--color-surface`. It holds the active rule with an icon, in 12px weight 600, and a “Watch live” link, each with a 32px minimum height. Zoomies uses `--color-action` with a bolt, Nap uses `--color-player` with a moon, and Jog or no data uses `--color-muted` with a radio icon. The row wraps on narrow phones.
- Advantage ring (`.advantage-kicker`, `.advantage-keeper`, `components/Pitch.tsx`): a static 3px inset ring and soft inner glow on the pitch in the same color as the bar, shown only while an advantage is active. It ignores pointer input.
- Advantage motion (`components/Pitch.tsx`): Zoomies shortens the ball flight, delays the keeper by 130ms and adds sparkles. Nap lengthens the flight, speeds the keeper's dive and shows a sleepy keeper. A long-reach save stretches the keeper most of the way to the ball. Result text names the twist: “Too fast!” or “Long reach!”.
- Connection notices (`.connection-banner`, `components/Game.tsx`): the fixed recovery banner offers a way back to the arena when a match has ended. The `.is-info` variant shows a spinner, with no action, while the player reconnects or the other player's seat is held.

The 550ms intro is nonblocking. Shot animation uses a 500ms run-up, then a 1300ms result pause. Ball flight comes from `flightMs` in `rules/hamster.ts`: 650ms on Zoomies, 850ms on normal rules and 1050ms on Nap. At match point these become 900ms, 1300ms and 1300ms. Crowd, shake, confetti, and celebration are finite. All decorative motion is disabled under `prefers-reduced-motion: reduce`; choices, scores, and announcements remain available. The common transition curve is `cubic-bezier(.2,0,0,1)` and control transitions last 150ms.

## Do's and Don'ts

Start new interface work with the existing page width, role tokens, and six-size type scale. Keep one orange primary action in the active surface and use neutral buttons for alternatives. Put directions beside their controls. Preserve the game and its main action on the first phone screen.

Keep service configuration in the public runtime config and operator documentation. Do not show synthetic players, queues, rankings, or telemetry as live data. Add game feedback through the existing phase state, result text, and live region rather than through motion alone. Keep any new illustration decorative and locally bundled. Re-run the subpath browser check and the design probe after layout changes.
