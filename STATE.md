# Current Task
- Replace the Tibetan Book of the Dead link with `thodol.simsang.org`.

# Route
- Route A

# Writer Slot
- main: direct implementation on a single-file hotfix.

# Contract Freeze
- Scope:
  - Update the Tibetan Book of the Dead card link to `https://thodol.simsang.org/`.
- Verification:
  - `rg -n "thodol.simsang.org|tibet.simsang.org" src/data/cards.js`
- Assumption:
  - Keep the existing card content and only change the destination URL.

# Write Sets
- main: `src/data/cards.js`

# Reviewer
- not required for this single-file hotfix

# Last Update
- 2026-05-28 KST

# Reason
- The request is a one-line link swap in a single file, so Route A is sufficient.
