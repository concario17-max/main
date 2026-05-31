# Current Task
- Remove the Item Archive card from the archive list and update smoke checks.

# Route
- Route B

# Writer Slot
- main: planner only until contract freeze and write sets are set.

# Contract Freeze
- Scope:
  - Remove the Item Archive card entry from `src/data/cards.js`.
  - Remove the Item Archive presence check from `scripts/smoke-check.mjs`.
- Verification:
  - `node scripts/smoke-check.mjs`
- Assumption:
  - Only the archive card list and its smoke check should change; other cards stay untouched.

# Write Sets
- worker_copy: `src/data/cards.js`, `scripts/smoke-check.mjs`

# Reviewer
- main-review

# Last Update
- 2026-05-30 KST

# Reason
- The request spans the card data plus smoke checks, so Route B with split ownership is required.
