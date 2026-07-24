# FF Stage 3 check — cat_first_word_picture_books

- **Overall:** FAIL
- **Band:** 16-18m
- **URL smoke:** 24/27 ok
- **Availability:** 11/11 buyable

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | First 100 Words | pass | — |
| 2 | Baby Touch: Words | pass | — |
| 3 | Dear Zoo | pass | — |
| 4 | Where's Spot? | pass | — |
| 5 | Baby's First Words | pass | — |
| 6 | Baby Touch: Faces | pass | — |
| 7 | That's Not My Dinosaur | fail | why_pip_word_count_37_not_40_to_60 |
| 8 | Global Babies | pass | — |
| 9 | See, Touch, Feel: First Words | fail | why_pip_word_count_38_not_40_to_60 |
| 10 | That's Not My Puppy | pass | — |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_first_word_picture_books` (16-18m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
