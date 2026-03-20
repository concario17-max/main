# research.md

## 1. Executive Summary
This repository is a Vite-based static portal for the Simsang Archive family of external sites. It is not a multi-page app and it has no backend. The shipped experience is one branded HTML document enhanced by a small set of JavaScript modules.

Its runtime responsibilities are:

- render a curated set of archive cards from local data
- show a premium visual shell with motion and themed styling
- gate initial interaction behind a lightweight browser-side passcode flow
- persist theme and gate state through a shared storage helper
- open external archive destinations in new tabs
- expose share/install metadata
- verify structure and core behavior through smoke scripts

## 2. Repository Boundaries
Active application files:

- [index.html](/C:/Users/roadsea/Desktop/main/index.html)
- [src/main.js](/C:/Users/roadsea/Desktop/main/src/main.js)
- [src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js)
- [src/data/cardIcons.js](/C:/Users/roadsea/Desktop/main/src/data/cardIcons.js)
- [src/modules/renderCards.js](/C:/Users/roadsea/Desktop/main/src/modules/renderCards.js)
- [src/modules/entryGate.js](/C:/Users/roadsea/Desktop/main/src/modules/entryGate.js)
- [src/modules/theme.js](/C:/Users/roadsea/Desktop/main/src/modules/theme.js)
- [src/modules/storage.js](/C:/Users/roadsea/Desktop/main/src/modules/storage.js)
- [src/modules/cardEffects.js](/C:/Users/roadsea/Desktop/main/src/modules/cardEffects.js)
- [src/modules/stardust.js](/C:/Users/roadsea/Desktop/main/src/modules/stardust.js)
- [src/style.css](/C:/Users/roadsea/Desktop/main/src/style.css)
- [src/styles/base.css](/C:/Users/roadsea/Desktop/main/src/styles/base.css)
- [src/styles/components.css](/C:/Users/roadsea/Desktop/main/src/styles/components.css)
- [src/styles/effects.css](/C:/Users/roadsea/Desktop/main/src/styles/effects.css)
- [src/styles/animations.css](/C:/Users/roadsea/Desktop/main/src/styles/animations.css)
- [public/manifest.json](/C:/Users/roadsea/Desktop/main/public/manifest.json)
- [scripts/smoke-check.mjs](/C:/Users/roadsea/Desktop/main/scripts/smoke-check.mjs)
- [scripts/browser-smoke.mjs](/C:/Users/roadsea/Desktop/main/scripts/browser-smoke.mjs)
- [tailwind.config.js](/C:/Users/roadsea/Desktop/main/tailwind.config.js)
- [postcss.config.js](/C:/Users/roadsea/Desktop/main/postcss.config.js)
- [vite.config.js](/C:/Users/roadsea/Desktop/main/vite.config.js)
- [package.json](/C:/Users/roadsea/Desktop/main/package.json)

Supporting or non-runtime material:

- [dist](/C:/Users/roadsea/Desktop/main/dist): production output
- [design](/C:/Users/roadsea/Desktop/main/design): reference prototype and image
- [.compare/before](/C:/Users/roadsea/Desktop/main/.compare/before): preserved earlier state for comparison
- [.agent](/C:/Users/roadsea/Desktop/main/.agent) and [.agents](/C:/Users/roadsea/Desktop/main/.agents): agent tooling metadata
- [plan.md](/C:/Users/roadsea/Desktop/main/plan.md): work checklist and TODO tracking

## 3. Toolchain
From [package.json](/C:/Users/roadsea/Desktop/main/package.json), the stack is deliberately small:

- Vite 5
- Tailwind CSS 3
- PostCSS + Autoprefixer
- Playwright
- plain ES modules

Available commands:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check:smoke`
- `npm run check:browser`

There is no framework runtime, no TypeScript, and no lint/typecheck layer.

## 4. HTML Shell
[index.html](/C:/Users/roadsea/Desktop/main/index.html) contains almost all page structure.

Static sections include:

- metadata and social tags
- install metadata links
- Google Font links
- `#entry-gate`
- ambient background layers
- `#particles-container`
- `#theme-toggle`
- `#archive-shell`
- page header
- empty `#cards-grid` mount node

The page mixes English branding and Korean supporting copy.

Normalized Korean strings currently in active source include:

- header pills:
  - `오컬트 천체 아카이브`
  - `요가 수트라`
  - `바가바드 기타`
  - `티베트 사자의 서`
  - `밀교의 성불 원리`
- meta/share description:
  - `오컬트 주역 천체 관측소, 파탄잘리 요가 수트라, 바가바드 기타, 티베트 사자의 서, 밀교의 성불 원리를 아우르는 프리미엄 지식 아카이브.`
- share title:
  - `SIMSANG ARCHIVE | 깊이 읽는 지혜의 서고`
- gate copy:
  - `비밀번호를 입력해야 포털에 입장할 수 있습니다.`

## 5. Boot Sequence
[src/main.js](/C:/Users/roadsea/Desktop/main/src/main.js) is the only runtime entrypoint.

On `DOMContentLoaded`, it runs:

1. `renderCards(cards)`
2. `initEntryGate()`
3. `initThemeToggle()`
4. `initCardEffects()`
5. `initStardust()`

This order is meaningful:

- cards must exist before interaction code binds
- gate should initialize before the rest of the app is used
- theme initializes early enough to affect the main shell
- decorative effects are last because they are non-critical

## 6. Data Layer
[src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js) is the content source of truth.

Each card object includes:

- `slug`
- `href`
- `delayClass`
- optional `featured`
- `tone`
- `icon`
- `index`
- `portal`
- `heading.main`
- `heading.accent`
- `copy.label`
- optional `copy.compactLabel`
- `copy.description`
- `copy.cta`

Current cards:

- `celestial-ephemeris`
- `sutra-exegesis`
- `divine-song`
- `eternal-liberation`
- `threefold-luminaries`

Current normalized Korean subtitle labels:

- `오컬트 주역 천체 관측소`
- `파탄잘리 요가 수트라`
- `바가바드 기타`
- `티베트 사자의 서`
- `밀교의 성불 원리`

## 7. Icon System
[src/data/cardIcons.js](/C:/Users/roadsea/Desktop/main/src/data/cardIcons.js) exports inline SVG factory functions.

Characteristics:

- icons use `currentColor`
- icons are decorative and `aria-hidden`
- each icon stays within a `100 x 100` viewBox
- the renderer can inject them directly into HTML strings without framework components

## 8. Card Rendering
[src/modules/renderCards.js](/C:/Users/roadsea/Desktop/main/src/modules/renderCards.js) converts card data into HTML strings and mounts them into `#cards-grid`.

Main responsibilities:

- map `tone` values to explicit tone-class bundles
- render featured and non-featured card variants
- generate portal/index topline markup
- apply card-level accessibility labels
- add external-link safety attributes
- emit dedicated behavior hooks such as `.premium-card__cta-target`

Important renderer contracts:

- `premium-card__meta`, `premium-card__rule`, `premium-card__cta`, and related classes are styling hooks
- `.premium-card__cta-target` is the dedicated motion hook for CTA interaction
- card order no longer drives styling through `nth-child`

## 9. Shared Persistence Layer
[src/modules/storage.js](/C:/Users/roadsea/Desktop/main/src/modules/storage.js) centralizes resilient persistence behavior.

Current behavior:

- reads from `localStorage` first
- falls back to cookies if storage is unavailable
- writes to both when possible
- uses `SameSite=Lax`
- supports configurable `Max-Age`

This module exists to make theme persistence and gate persistence consistent and more defensive across browser/storage edge cases.

## 10. Entry Gate
[src/modules/entryGate.js](/C:/Users/roadsea/Desktop/main/src/modules/entryGate.js) manages the client-side passcode overlay.

Current behavior:

- unlock code is hardcoded as `0228`
- unlock state is persisted via the shared storage helper under `simsang-entry-unlocked-code`
- unlock now survives refresh even when `localStorage` is unavailable but cookies still work
- successful unlock:
  - stores the unlock code
  - clears error state
  - unlocks managed elements
  - hides and removes the gate
- failed unlock:
  - shows `비밀번호가 올바르지 않습니다.`
  - re-focuses and selects the input

Managed elements:

- `#archive-shell`
- `#theme-toggle`

Accessibility behavior:

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby`
- `aria-describedby`
- focus trap while locked
- `inert` when supported, `aria-hidden` fallback otherwise

Important limitation:

- this is still not real security
- the unlock code remains client-side
- for genuine protection, enforcement must move to hosting, edge, or backend infrastructure

## 11. Theme System
[src/modules/theme.js](/C:/Users/roadsea/Desktop/main/src/modules/theme.js)

Current behavior:

- storage key: `simsang-theme`
- default theme: `light`
- valid persisted values: `light` and `dark`
- applies the `dark` class on `document.documentElement`
- now uses the same shared persistence helper as the entry gate

This removes the previous asymmetry where theme storage was less defensive than gate storage.

## 12. Motion Systems

### 12.1 Card Effects
[src/modules/cardEffects.js](/C:/Users/roadsea/Desktop/main/src/modules/cardEffects.js)

Provides:

- spotlight tracking through CSS custom properties
- 3D tilt
- magnetic CTA motion
- rAF-based interpolation

Key implementation details:

- caches card rects in a `Map`
- updates rects on resize and mouseenter
- stores current and target state separately for smoothing
- uses `.premium-card__cta-target` rather than utility classes as a behavior selector

Reduced motion:

- disables transforms and exits early when `prefers-reduced-motion: reduce` matches at init time

### 12.2 Stardust
[src/modules/stardust.js](/C:/Users/roadsea/Desktop/main/src/modules/stardust.js)

Behavior:

- creates 50 particles with randomized size, x-position, duration, and delay
- appends through `DocumentFragment`
- hides itself entirely when reduced motion is requested
- uses `IntersectionObserver` to toggle display

## 13. Styling Architecture
[src/style.css](/C:/Users/roadsea/Desktop/main/src/style.css) is only the import entrypoint.

Actual layers:

- [base.css](/C:/Users/roadsea/Desktop/main/src/styles/base.css)
- [components.css](/C:/Users/roadsea/Desktop/main/src/styles/components.css)
- [effects.css](/C:/Users/roadsea/Desktop/main/src/styles/effects.css)
- [animations.css](/C:/Users/roadsea/Desktop/main/src/styles/animations.css)

### Base
Contains selection styling, font-feature settings, text-rendering, and desktop scrollbar styling.

### Components
Contains nearly all structural styling:

- archive grid
- premium cards
- featured styling
- gate panel and backdrop
- portal/index chips
- tone classes
- compact label behavior
- focus-visible treatment

Current layout behavior:

- adaptive `.archive-grid`
- `>=1024px`: 3 columns
- `>=1280px`: 5 columns
- featured card is visually featured but no longer spans extra columns at desktop
- badge is hidden on larger desktop layouts
- cards were recently compacted to fit more cleanly within one page

### Effects
Contains card spotlight glow, global glow, and grain overlays, plus reduced-motion fallbacks.

### Animations
Contains keyframes for:

- `fadeUpPremium`
- `auraFloat`
- `drift`

Also defines `delay-*` classes and global reduced-motion neutralization.

## 14. Tailwind and Build Config
[tailwind.config.js](/C:/Users/roadsea/Desktop/main/tailwind.config.js) extends:

- color tokens
- display/body font families
- premium shadow variants

[vite.config.js](/C:/Users/roadsea/Desktop/main/vite.config.js):

- dev server port `3000`
- `open: true`
- output directory `dist`
- `esbuild` minification

[postcss.config.js](/C:/Users/roadsea/Desktop/main/postcss.config.js) is standard Tailwind + Autoprefixer wiring.

## 15. Manifest and Install Metadata
[public/manifest.json](/C:/Users/roadsea/Desktop/main/public/manifest.json) defines:

- name and short name
- normalized Korean description
- standalone display mode
- colors
- touch/install icons

This supports install-like browser shortcuts but does not make the site an offline-capable PWA.

## 16. Verification Strategy

### 16.1 Structural Smoke
[scripts/smoke-check.mjs](/C:/Users/roadsea/Desktop/main/scripts/smoke-check.mjs)

This statically verifies:

- card data completeness and uniqueness
- normalized Korean strings
- gate and theme markup presence
- manifest/meta consistency
- reduced-motion support hooks
- adaptive grid presence
- shared storage helper usage
- dedicated CTA behavior hook usage
- absence of styling-order coupling

### 16.2 Browser Smoke
[scripts/browser-smoke.mjs](/C:/Users/roadsea/Desktop/main/scripts/browser-smoke.mjs)

This script now:

- serves the built `dist` folder with a minimal Node static server
- opens Chromium through Playwright when the environment allows it
- verifies:
  - gate visibility
  - wrong-passcode error copy
  - successful unlock with `0228`
  - persistence across reload
  - theme toggle behavior
  - rendered card count
  - correct popup destination when clicking the first card

Restricted-environment behavior:

- if Chromium launch is blocked with `spawn EPERM`, the script exits with a clear `SKIP` message instead of failing opaquely

## 17. Historical Evolution
The snapshot in [.compare/before](/C:/Users/roadsea/Desktop/main/.compare/before) shows the app evolved from a simpler premium landing page into a more modular portal.

Notable changes since the earlier snapshot:

- entry gate was added
- theme and interaction responsibilities were expanded
- cards became more data-driven and tone-specific
- the archive grew from four cards to five
- structural smoke coverage became much richer
- browser smoke coverage was introduced
- layout was iteratively tuned for clipping, width balance, and single-page density

## 18. Current Risks and Remaining Constraints

### 18.1 Real access control still does not exist
The gate is persistent and more resilient now, but it is still not secure in a static frontend-only architecture.

### 18.2 Browser smoke may skip in sandboxed environments
The script is clearer and more graceful now, but it cannot force Playwright to launch where process permissions forbid it.

### 18.3 Large parts of the UI still depend on string-based templates
This is fine for a small app, but it remains more fragile than typed or component-driven rendering.

### 18.4 Windows terminal encoding can still confuse debugging
Source files were normalized, but shell display can still misrepresent UTF-8 text depending on console settings.

## 19. Verified State in This Pass
During this analysis/update pass, the following commands succeeded:

- `cmd /c npm run build`
- `cmd /c node scripts/smoke-check.mjs`

And the browser smoke script produced:

- `SKIP: Browser smoke requires permission to launch Chromium in this environment.`

That result is expected in this sandbox and is now handled intentionally.

## 20. Final Assessment
This codebase is still small, but it is now significantly cleaner and more coherent than a one-off static mock.

Strengths:

- clear module boundaries
- centralized card data
- explicit styling layers
- shared persistence helper
- dedicated behavior hooks
- strong structural smoke coverage for a small app

Weaknesses:

- gate remains UX-only rather than secure
- browser verification depends on environment permissions
- string-template rendering remains easy to drift if contracts change without tests

The highest-value future improvement, if security matters, is to move gate enforcement out of the client entirely.
