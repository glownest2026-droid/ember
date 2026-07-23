# FF Stage 3 check — cat_small_world_figures

- **Overall:** FAIL
- **Band:** 34-36m
- **URL smoke:** 7/11 ok
- **Availability:** 4/8 buyable

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Happyland London Bus Playset | pass | — |
| 2 | LEGO DUPLO The Bus Ride (10988) | fail | url_not_ok:fetch failed; availability_fetch_failed:fetch failed |
| 3 | PLAYMOBIL Junior Everyday Heroes (71692) | pass | — |
| 4 | PLAYMOBIL Junior Dump Truck (71685) | pass | — |
| 5 | LEGO DUPLO 3-in-1 Construction Vehicles (10475) | fail | url_not_ok:fetch failed; availability_fetch_failed:fetch failed |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_small_world_figures` (34-36m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
