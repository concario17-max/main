# research.md

## 1. Project Summary
This repository is a Vite-based static landing page for `simsang.org`. It is a single-document portal, not a multi-page application, and it does not include a backend. The site acts as a premium gateway that routes users out to a family of external archive domains.

Its current responsibilities are:
- present the Simsang Archive brand
- stage archive cards with premium motion and typography
- gate access behind a lightweight client-side password prompt
- open external archive destinations in new tabs
- expose share/install metadata for social cards and app-like shortcuts

## 2. Repository Layout
Important directories:

- [src](/C:/Users/roadsea/Desktop/main/src): application code
- [public](/C:/Users/roadsea/Desktop/main/public): favicon, manifest, OG image
- [scripts](/C:/Users/roadsea/Desktop/main/scripts): smoke and browser verification scripts
- [dist](/C:/Users/roadsea/Desktop/main/dist): Vite production output
- [design](/C:/Users/roadsea/Desktop/main/design): reference design artifacts
- [.compare](/C:/Users/roadsea/Desktop/main/.compare): ignored archive of an older project snapshot
- [.agent](/C:/Users/roadsea/Desktop/main/.agent): agent/workflow metadata, not runtime code

Important files:

- [index.html](/C:/Users/roadsea/Desktop/main/index.html): complete page shell and meta layer
- [src/main.js](/C:/Users/roadsea/Desktop/main/src/main.js): runtime bootstrap
- [src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js): source of truth for card content
- [src/data/cardIcons.js](/C:/Users/roadsea/Desktop/main/src/data/cardIcons.js): inline SVG icon factories
- [package.json](/C:/Users/roadsea/Desktop/main/package.json): commands and dependencies
- [plan.md](/C:/Users/roadsea/Desktop/main/plan.md): implementation and QA checklist
- [research.md](/C:/Users/roadsea/Desktop/main/research.md): this report

## 3. Build and Tooling
The project uses a very small frontend toolchain:

- Vite 5 for dev/build/preview
- Tailwind CSS 3 for utility classes and theme tokens
- PostCSS + Autoprefixer
- Playwright runtime for browser smoke verification
- no framework runtime
- no TypeScript compiler

Current commands from [package.json](/C:/Users/roadsea/Desktop/main/package.json):

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check:smoke`
- `npm run check:browser`

Important implication:
- there is no dedicated `typecheck` script because the app is plain JavaScript
- `npm run build` is currently the strongest compile-time safety check

## 4. Runtime Boot Sequence
The runtime starts in [src/main.js](/C:/Users/roadsea/Desktop/main/src/main.js).

Boot order:
1. `renderCards(cards)`
2. `initEntryGate()`
3. `initThemeToggle()`
4. `initCardEffects()`
5. `initStardust()`

This order is intentional:
- cards must exist before hover effects can bind
- the password gate must initialize before the page becomes interactive
- theme must initialize before the user meaningfully reads the screen
- decorative effects are progressive enhancement

State is handled with:
- DOM state
- `localStorage` for theme
- `sessionStorage` for entry-gate unlock state

## 5. HTML and Content Policy
[index.html](/C:/Users/roadsea/Desktop/main/index.html) is the full page shell.

Major body sections:
- `#entry-gate`
- ambient glow/aura background layers
- `#particles-container`
- `#theme-toggle`
- `#archive-shell`
- header block
- `#cards-grid`

Current language policy:
- brand headline and main archive headings remain English
- card subtitle labels and header pills are Korean
- gate copy is Korean
- share/meta/manifest descriptions are Korean

Normalized user-facing source strings now include:
- header pills:
  - `점성 아카이브`
  - `요가 수트라`
  - `바가바드 기타`
  - `사자의 서`
  - `삼신 명등론`
- meta/share description:
  - `점성, 요가 수트라, 바가바드 기타, 사자의 서, 삼신 명등론을 잇는 프리미엄 지혜 아카이브.`
- share title:
  - `SIMSANG ARCHIVE | 살아 있는 지혜의 포털`

## 6. Card Data Model
[src/data/cards.js](/C:/Users/roadsea/Desktop/main/src/data/cards.js) is the content source of truth.

Each card includes:
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

Normalized Korean subtitle labels:
- `오컬트 주역 천체 관측소`
- `파탄잘리 요가 수트라`
- `바가바드 기타`
- `티베트 사자의 서`
- `밀교의 성불 원리(因位三身行相明燈論)`

Compact-label policy:
- long Korean labels can explicitly opt into compact handling with `copy.compactLabel`
- this is preferred over relying only on length heuristics

## 7. Card Rendering
[src/modules/renderCards.js](/C:/Users/roadsea/Desktop/main/src/modules/renderCards.js) converts card data into HTML strings and mounts them into `#cards-grid`.

Key responsibilities:
- maps each `tone` to explicit CSS classes
- renders the featured card variant
- renders topline portal/index metadata
- injects SVG icons from shared icon factories
- adds `data-card` and `aria-label`
- ensures external-link safety with `target="_blank"` and `rel="noopener noreferrer"`

The renderer no longer depends on DOM order for styling. This makes the grid safer to extend.

## 8. Interaction Modules

### 8.1 Entry Gate
[src/modules/entryGate.js](/C:/Users/roadsea/Desktop/main/src/modules/entryGate.js) controls the client-side password prompt.

Current behavior:
- unlock code is hardcoded as `0228`
- the gate appears on first load
- correct input removes the gate from the DOM
- incorrect input shows a Korean error message
- input is numeric-only and limited to four digits
- Enter and button click both submit
- the underlying app shell is locked using `inert`
- focus is trapped inside the dialog while locked
- unlock state is persisted in `sessionStorage`
- unlock still succeeds even if storage access fails

Accessibility shape:
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby`
- `aria-describedby`

Important limitation:
- this is still not real security
- the code ships to the browser
- meaningful protection must move to server or edge infrastructure

### 8.2 Theme
[src/modules/theme.js](/C:/Users/roadsea/Desktop/main/src/modules/theme.js)

Behavior:
- default is light mode
- stored under `simsang-theme`
- toggles the `dark` class on `document.documentElement`

### 8.3 Card Effects
[src/modules/cardEffects.js](/C:/Users/roadsea/Desktop/main/src/modules/cardEffects.js)

Effects:
- spotlight via CSS custom properties
- 3D tilt
- magnetic CTA drift
- rAF-based smoothing

Safety:
- skips motion when `prefers-reduced-motion: reduce` matches

### 8.4 Stardust
[src/modules/stardust.js](/C:/Users/roadsea/Desktop/main/src/modules/stardust.js)

Behavior:
- creates 50 decorative particles
- uses `DocumentFragment`
- hides entirely under reduced motion
- uses `IntersectionObserver` to toggle visibility

## 9. Styling Architecture
[src/style.css](/C:/Users/roadsea/Desktop/main/src/style.css) is only the import entry.

### [base.css](/C:/Users/roadsea/Desktop/main/src/styles/base.css)
- selection colors
- typography baseline
- desktop scrollbar treatment

### [components.css](/C:/Users/roadsea/Desktop/main/src/styles/components.css)
- card shells
- featured card look
- header pills
- card topline metadata
- tone-specific color mapping
- compact subtitle behavior
- entry gate styling
- focus-visible treatment

### [effects.css](/C:/Users/roadsea/Desktop/main/src/styles/effects.css)
- card spotlight
- global glow
- grain overlay
- mobile reductions
- reduced-motion fallback

### [animations.css](/C:/Users/roadsea/Desktop/main/src/styles/animations.css)
- `fadeUpPremium`
- `auraFloat`
- `drift`
- stagger delay classes
- global reduced-motion neutralization

## 10. Static Assets and Artifact Policy
[public](/C:/Users/roadsea/Desktop/main/public) contains:
- favicon
- Apple touch icon
- manifest
- OG image

[manifest.json](/C:/Users/roadsea/Desktop/main/public/manifest.json) now follows the same Korean description policy as the share meta.

Artifact decisions:
- [dist](/C:/Users/roadsea/Desktop/main/dist) is treated only as a build artifact
- [design](/C:/Users/roadsea/Desktop/main/design) is retained as design/reference material
- [.compare](/C:/Users/roadsea/Desktop/main/.compare) is retained for now as an ignored before-state archive, not as active source

## 11. Verification Strategy
The project now has two automated checks:

### 11.1 Structural Smoke
[scripts/smoke-check.mjs](/C:/Users/roadsea/Desktop/main/scripts/smoke-check.mjs)

This verifies:
- card structure and uniqueness
- tone coverage
- normalized strings
- gate markup presence
- meta/manifest consistency
- reduced-motion contracts
- renderer contracts
- style import contracts
- absence of deprecated inline patterns

This is string- and structure-oriented, not behavioral.

### 11.2 Browser Smoke
[scripts/browser-smoke.mjs](/C:/Users/roadsea/Desktop/main/scripts/browser-smoke.mjs)

This runs a real browser against `vite preview` and verifies:
- gate appears
- wrong password shows an error
- `0228` unlocks the page
- theme toggle still works after unlock
- rendered card count matches card data
- clicking the first card opens the expected external URL in a popup

This is the first true browser-level regression layer in the repo.

## 12. Current Risks and Technical Debt

### 12.1 Access control is still client-side only
The password gate is a UX lock, not a secure barrier.

### 12.2 Terminal output can still misrepresent UTF-8 content
Repository files were normalized and rewritten, but Windows shell output can still display mojibake depending on console encoding. Browser display and source-file encoding must be treated as separate concerns.

### 12.3 Browser smoke is still minimal
The project now verifies the main unlock/click flow, but it still lacks:
- mobile emulation coverage
- visual regression snapshots
- cross-browser matrix coverage

### 12.4 External destination behavior is out of scope
The destination apps live on other domains. This repository cannot validate or change their internal logic.

## 13. Practical Conclusion
The codebase is now a modular static portal with:
- normalized content strings
- a more accessible and stable entry gate
- explicit artifact/documentation policy
- structural regression coverage
- browser-level smoke coverage for the highest-risk user path

The next genuinely high-value step would be to replace the client-side password gate with real infrastructure protection if restricted access matters.
