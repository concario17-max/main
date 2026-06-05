# Current Task
- Rename the Milgyo card to `인위삼신행상명등론`.

# Route
- Route B

# Writer Slot
- main: planner only until contract freeze and write sets are set.

# Contract Freeze
- Scope:
  - Rename the Milgyo card label in `src/data/cards.js` to `인위삼신행상명등론`.
  - Update matching copy in `index.html`, `public/manifest.json`, and `scripts/smoke-check.mjs`.
- Verification:
  - `node scripts/smoke-check.mjs`
- Assumption:
  - Keep the existing card content and only change the label plus matching site copy.

# Write Sets
- worker_copy: `src/data/cards.js`, `scripts/smoke-check.mjs`, `index.html`, `public/manifest.json`

# Reviewer
- main-review

# Last Update
- 2026-06-05 KST

# Reason
- The request changes the card label plus related site copy and smoke checks, so Route B with split ownership is required.
