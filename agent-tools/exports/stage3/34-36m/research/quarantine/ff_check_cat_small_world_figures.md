# FF Stage 3 check — cat_small_world_figures

- **Overall:** FAIL
- **Band:** 34-36m
- **URL smoke:** 0/0 ok
- **Availability:** 5/9 buyable

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Happyland London Bus Playset | pass | — |
| 2 | PLAYMOBIL Junior Airport Shuttle Bus (71689) | fail | description_why_pip_overlap_0.82 |
| 3 | PLAYMOBIL Junior Everyday Heroes (71692) | fail | description_why_pip_overlap_0.82 |
| 4 | LEGO DUPLO Town Ambulance and Driver (10447) | fail | availability_fetch_failed:http_403 |
| 5 | LEGO DUPLO 3-in-1 Construction Vehicles (10475) | pass | — |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_small_world_figures` (34-36m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
