# FF Stage 3 check — cat_play_kitchen_household_props

- **Overall:** FAIL
- **Band:** 25-27m
- **URL smoke:** 14/16 ok
- **Availability:** 5/6 buyable

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Bigjigs Toys Wooden Breakfast Set | pass | — |
| 2 | Bigjigs Toys Wooden Pots and Pans Set | pass | — |
| 3 | Tidlo Wooden Cutting Fruits Set | pass | — |
| 4 | Tender Leaf Toys Breakfast Toaster Set | fail | min_age_36_excludes_band_months_under_36; safety_exclusion_under_36_overlaps_band_min_25; min_age_36_excludes_band_months_under_36 |
| 5 | Hape Pop-up Toaster Set | fail | min_age_36_excludes_band_months_under_36; safety_exclusion_under_36_overlaps_band_min_25; min_age_36_excludes_band_months_under_36 |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_play_kitchen_household_props` (25-27m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
