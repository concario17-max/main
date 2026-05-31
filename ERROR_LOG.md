# Error Log

- time: 2026-05-30 KST
- location: `scripts/smoke-check.mjs`, `src/data/cards.js`
- summary: Temporary syntax failure after an encoding-sensitive edit
- details: A PowerShell rewrite briefly corrupted non-ASCII strings while removing the Item Archive checks. I restored both files from `HEAD`, reapplied the deletion with UTF-8-safe edits, and verified the smoke check passes.
- status: resolved
