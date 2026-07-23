# FF Stage 3 check — cat_fixture_good

- **Overall:** FAIL
- **Band:** 34-36m
- **URL smoke:** 1/5 ok

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Fixture Product 1 | pass | — |
| 2 | Fixture Product 2 | fail | url_not_ok:http_404 |
| 3 | Fixture Product 3 | fail | url_not_ok:http_403 |
| 4 | Fixture Product 4 | fail | url_not_ok:http_404 |
| 5 | Fixture Product 5 | fail | url_not_ok:http_404 |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_fixture_good` (34-36m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
