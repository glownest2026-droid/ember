# FF Stage 3 check — cat_jigsaw_puzzles

- **Overall:** FAIL
- **Band:** 34-36m
- **URL smoke:** 17/24 ok
- **Availability:** 7/9 buyable

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | First Farm Friends Jigsaw Puzzles | pass | — |
| 2 | First Jungle Friends Jigsaw Puzzles | pass | — |
| 3 | On The Farm — My First Jigsaw Puzzles | pass | — |
| 4 | Safari — 6 Piece Puzzles (3 puzzles) | fail | url_not_ok:http_429; availability_fetch_failed:http_429 |
| 5 | Rescue Squad Jigsaw Puzzle | pass | — |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_jigsaw_puzzles` (34-36m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
