# Old-image audit — 2026-07-19 (bug bash item 3)

Method: for every active Stage 2 card (all age bands), resolve the image the app actually serves (band-specific mapping first, then global fallback) and look up the file's creation date in Supabase storage (`category_images` bucket). Current image generations in use range from 2026-04-22 to 2026-07-12. Anything before 2026-06-26 is visibly old-style.

## Summary

| Generation | Distinct files | Card placements | Verdict |
|---|---|---|---|
| 2026-04-22 | 9 | 26 | Oldest style — replace first |
| 2026-06-16 | 5 | 15 | Old style (includes founder-reported reach-and-grab) |
| 2026-06-26 → 2026-07-12 | — | ~579 | Current style, no action |

## 2026-04-22 files (oldest, 26 placements — mostly 19–36m bands)

| File | Used by (band: category) |
|---|---|
| ember_calm_down_sensory_bottle.png | 22-24m, 25-27m, 28-30m, 34-36m: calm corner tools |
| ember_visual_routine_cards_category.png | 22-24m, 34-36m: visual routine cards; 25-27m, 28-30m: routine cards |
| ember_potty_chair_low_category.png | 19-21m, 25-27m, 28-30m: potty; 22-24m, 34-36m: potty chair |
| ember_toilet_training_seat_adapter_category.png | 19-21m, 22-24m, 25-27m: toilet training seat variants |
| ember_child_step_stool_dual_category.png | 19-21m, 22-24m, 25-27m, 28-30m: step stool |
| ember_memory_match_cards_category.png | 22-24m, 34-36m: memory matching games |
| ember_question_prompt_cards_category.png | 28-30m, 34-36m: conversation prompt cards |
| ember_emotion_matching_tiles_category.png | 34-36m: emotion dolls/cards |
| ember_child_safe_scissors_category.png | 34-36m: child-safe scissors |

## 2026-06-16 files (old, 15 placements)

| File | Used by (band: category) |
|---|---|
| ember_cat_soft_graspable_balls_category.png | 10 bands (1-3m rolling bell ball → 34-36m large balls) — highest-impact single replacement |
| ember_cat_reach_grab_toys_category.png | 1-3m, 6-9m: reach-and-grab toys (founder-reported) |
| ember_cat_sitting_play_mat_category.png | 6-9m: sitting play mat |
| ember_cat_hand_transfer_toys_category.png | 6-9m: hand transfer toys |
| ember_cat_first_puzzle_category.png | 6-9m: first puzzle |

## Suggested replacement order

1. `ember_cat_soft_graspable_balls_category.png` — one new image fixes 10 bands.
2. `ember_cat_reach_grab_toys_category.png` — founder-reported, fixes 1-3m + 6-9m.
3. The nine 2026-04-22 files — batch-generate in current style, then remap via the standard image-mapping migration (`.cursor/rules/ember-image-mapping.mdc`).

Replacement images are founder-managed brand assets; once new files are uploaded to the `category_images` bucket, mapping follows the existing migration pattern (e.g. `20260712120000_map_quality_replacement_category_images.sql`).
