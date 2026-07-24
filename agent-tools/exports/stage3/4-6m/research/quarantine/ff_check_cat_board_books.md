# FF Stage 3 check — cat_board_books

- **Overall:** FAIL
- **Band:** 4-6m
- **URL smoke:** 15/15 ok
- **Availability:** 10/10 buyable

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Dear Zoo Lift the Flap 40th Anniversary Edition | fail | banned_copy:em_dash |
| 2 | Where's Spot? (Board Book) | pass | — |
| 3 | Brown Bear, Brown Bear, What Do You See? | pass | — |
| 4 | Peekaboo Bear | pass | — |
| 5 | That's Not My Puppy... | pass | — |
| 6 | That's Not My Cat... | pass | — |
| 7 | Baby Touch: Faces | pass | — |
| 8 | Baby Touch: Animals | pass | — |
| 9 | Hairy Maclary and Zachary Quack | fail | banned_copy:em_dash |
| 10 | Head, Shoulders, Knees and Toes | pass | — |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_board_books` (4-6m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
