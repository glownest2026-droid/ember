# FF Stage 3 check — cat_balance_stepping_stones

- **Overall:** FAIL
- **Band:** 34-36m
- **URL smoke:** 0/0 ok
- **Availability:** 0/0 buyable
- **Category fails:** schema_version_not_ember_picks_research_v3, buying_factor_memo_missing, methodology_missing_steps:bench|rank|url, brand_concentration_3_gonge, longlist_6_missed_top5_reason_missing, longlist_6_rank_rationale_missing, longlist_7_missed_top5_reason_missing, longlist_7_rank_rationale_missing, longlist_8_missed_top5_reason_missing, longlist_8_rank_rationale_missing, longlist_9_missed_top5_reason_missing, longlist_9_rank_rationale_missing, longlist_10_missed_top5_reason_missing, longlist_10_rank_rationale_missing

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Gonge River Stones | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_15_not_20_to_40; age_signal_unparsed |
| 2 | Stapelstein Stepping Stones 6+1 Set - Rainbow | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_15_not_20_to_40; why_pip_word_count_37_not_40_to_60; age_signal_unparsed |
| 3 | Gonge Hilltops - Pk 5 | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_16_not_20_to_40; age_signal_unparsed |
| 4 | Playzone-Fit Stepping Stones | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_15_not_20_to_40; age_signal_unparsed |
| 5 | Gonge Tactile River Stones - Pk 5 | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_15_not_20_to_40; age_signal_unparsed |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_balance_stepping_stones` (34-36m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
