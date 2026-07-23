# FF Stage 3 check — cat_fixture_bad

- **Overall:** FAIL
- **Band:** 34-36m
- **URL smoke:** 0/0 ok
- **Category fails:** schema_version_not_ember_picks_research_v3, buying_factor_memo_missing, methodology_missing_steps:bench|age|rank|url, longlist_6_missed_top5_reason_missing, longlist_6_rank_rationale_missing, longlist_7_missed_top5_reason_missing, longlist_7_rank_rationale_missing, longlist_8_missed_top5_reason_missing, longlist_8_rank_rationale_missing, longlist_9_missed_top5_reason_missing, longlist_9_rank_rationale_missing, longlist_10_missed_top5_reason_missing, longlist_10_rank_rationale_missing

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Bad Fixture Product 1 | fail | rank_rationale_missing; age_signals_missing; url_verification_missing |
| 2 | Bad Fixture Product 2 | fail | rank_rationale_missing; age_signals_missing; url_verification_missing |
| 3 | Bad Fixture Product 3 | fail | rank_rationale_missing; age_signals_missing; url_verification_missing |
| 4 | Bad Fixture Product 4 | fail | rank_rationale_missing; age_signals_missing; url_verification_missing |
| 5 | Bad Fixture Product 5 | fail | rank_rationale_missing; age_signals_missing; url_verification_missing |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_fixture_bad` (34-36m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
