# Current Task
- Make the Nag Hammadi and Bori cards use the Threefold card color.

# Route
- Route A

# Writer Slot
- main: direct implementation on a single-file hotfix.

# Contract Freeze
- Scope:
  - Change the `tone` for the Nag Hammadi and Bori cards in `src/data/cards.js` to `trinity`.
- Verification:
  - `rg -n "nag-hammadi-library|bori-dodeunglon|tone: 'trinity'|tone: 'sutra'" src/data/cards.js`
- Assumption:
  - Keep the existing text and icon content, and only change the shared card color tone.

# Write Sets
- main: `src/data/cards.js`

# Reviewer
- not required for this single-file hotfix

# Last Update
- 2026-06-05 KST

# Reason
- The request only changes card tone values in one file, so Route A is sufficient.
