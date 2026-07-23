# FF Stage 3 check — cat_visual_routine_cards

- **Overall:** FAIL
- **Band:** 34-36m
- **URL smoke:** 0/0 ok
- **Availability:** 0/0 buyable
- **Category fails:** schema_version_not_ember_picks_research_v3, buying_factor_memo_missing, methodology_missing_steps:bench|age|rank|url, longlist_6_missed_top5_reason_missing, longlist_6_rank_rationale_missing, longlist_7_missed_top5_reason_missing, longlist_7_rank_rationale_missing, longlist_8_missed_top5_reason_missing, longlist_8_rank_rationale_missing, longlist_9_missed_top5_reason_missing, longlist_9_rank_rationale_missing, longlist_10_missed_top5_reason_missing, longlist_10_rank_rationale_missing

| Rank | Product | Pass | Reasons |
|---:|---|---|---|
| 1 | Kids Daily Routine Chart: Morning & Evening Visual Aid | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; why_pip_word_count_23_not_40_to_60; age_signal_unparsed |
| 2 | Digital Visual Timer | fail | review_count_below_15; rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_14_not_20_to_40; why_pip_word_count_23_not_40_to_60; best_for_not_reflected_in_description_or_why_pip; age_signal_unparsed |
| 3 | Daily Routine Cards, Visual Schedule, Routine Chart for Kids, Morning, Evening, Toddlers, Preschool, Chore Chart, Daily Rhythm, Editable | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; why_pip_word_count_23_not_40_to_60; age_signal_unparsed |
| 4 | 60-Minute Visual Timer (Blue Rainbow) | fail | rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_16_not_20_to_40; why_pip_word_count_23_not_40_to_60; best_for_not_reflected_in_description_or_why_pip; age_signal_unparsed |
| 5 | Night Time Routine Tags for children | fail | rating_below_4.4; best_for_duplicate; rank_rationale_missing; age_signals_missing; url_verification_missing; description_word_count_17_not_20_to_40; why_pip_word_count_23_not_40_to_60; age_signal_unparsed |

## Re-research brief (for founder approval)

Re-run Stage 3 research for `cat_visual_routine_cards` (34-36m).
Fix every FAIL reason above. Use schema `ember_picks_research_v3`. Trusted URL first (brand/publisher). Capture `age_signals` from the live listing.
Fill `buying_factor_memo`, per-pick `rank_rationale`, and longlist 6–10 `missed_top5_reason`.
Do not light-repair quarantine JSON. Full Mode A `$ember-stage3-research` → write to `inbox/` for another FF check.
