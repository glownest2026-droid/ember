# Stage 3 research shortlist — 19-21m

Source: `02_Ember_Bible_19_21m_Conor_Thea_Depth_v2.xlsx` · sheet `discover_projection`

## 1. Summary

| Metric | Value |
|--------|-------|
| age_band_id | age_19_21m |
| total Stage 1 clusters | 8 |
| clusters with a Stage 3 candidate | 8 |
| clusters without a Stage 3 candidate | 0 |
| total eligible product-action rows considered | 37 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | I’m finding my words | First-word books to point at | `cat_first_word_picture_books` | `cat_first_word_picture_books` | 49.1 | Good gift | both | true | medium | 6 | 5 | high | `ember_picks_19-21m_cat_first_word_picture_books.json` | Top eligible in cluster; 6 evidence id(s); 5 source id(s); persona both; gift bonus 2.5; Good gift; has product family; high ownership risk (−) |
| 2 | I’m copying everyday life | A doll or teddy to care for | `cat_doll_soft_toy_care` | `cat_doll_soft_toy_care` | 48.95 | Good gift | both | true | medium | 6 | 4 | high | `ember_picks_19-21m_cat_doll_soft_toy_care.json` | Top eligible in cluster; 6 evidence id(s); 4 source id(s); persona both; gift bonus 2.5; Good gift; has product family; high ownership risk (−) |
| 3 | My hands are busy now | Shape sorters and first puzzles | `cat_shape_sorters_puzzles` | `cat_shape_sorters_puzzles` | 48.8 | Good gift | both | true | medium | 6 | 6 | high | `ember_picks_19-21m_cat_shape_sorters_puzzles.json` | Top eligible in cluster; 6 evidence id(s); 6 source id(s); persona both; gift bonus 2.5; Good gift; has product family; high ownership risk (−) |
| 4 | I’m moving with purpose | Soft balls to kick and chase | `cat_soft_graspable_balls` | `cat_soft_graspable_balls` | 47.15 | Good gift | both | true | medium | 4 | 4 | high | `ember_picks_19-21m_cat_soft_graspable_balls.json` | Top eligible in cluster; 4 evidence id(s); 4 source id(s); persona both; gift bonus 2.5; Good gift; has product family; high ownership risk (−) |
| 5 | I’m learning to feed myself | Pouring jugs and water cups | `cat_pouring_jug_cups` | `cat_pouring_jug_cups` | 44.75 | Parent buy | conor | false |  | 5 | 3 | medium | `ember_picks_19-21m_cat_pouring_jug_cups.json` | Top eligible in cluster; 5 evidence id(s); 3 source id(s); Conor parent buy; Parent buy; has product family; medium ownership risk (−) |
| 6 | I’m having big feelings | Feelings and faces books | `cat_feelings_faces_books` | `cat_feelings_faces_books` | 49.1 | Good gift | both | true | medium | 5 | 4 | medium | `ember_picks_19-21m_cat_feelings_faces_books.json` | Top eligible in cluster; 5 evidence id(s); 4 source id(s); persona both; gift bonus 2.5; Good gift; has product family; medium ownership risk (−) |
| 7 | I’m noticing bathroom routines | Potty and bathroom books | `cat_potty_books` | `cat_potty_books` | 43.2 | Parent buy | conor | false |  | 6 | 4 | high | `ember_picks_19-21m_cat_potty_books.json` | Top eligible in cluster; 6 evidence id(s); 4 source id(s); Conor parent buy; Parent buy; has product family; high ownership risk (−) |
| 8 | Make exploring safer | Safety gates for stairs | `cat_safety_gates` | `cat_safety_gates` | 42.8 | Parent buy | conor | false |  | 4 | 3 | medium | `ember_picks_19-21m_cat_safety_gates.json` | Top eligible in cluster; 4 evidence id(s); 3 source id(s); Conor parent buy; Parent buy; has product family; medium ownership risk (−) |

## 3. Clusters with no Stage 3 product pick

_None — every Stage 1 cluster has an eligible product candidate._

## 4. Excluded rows audit

### not product_category (12)
- [I’m finding my words] Words on walks and little hunts (`cat_naming_walks`)
- [I’m finding my words] Songs with actions to copy (`cat_songs_action_games`)
- [I’m moving with purpose] Dancing games and music (`cat_music_dance`)
- [I’m moving with purpose] Park walks and toddler swings (`cat_park_swing_walks`)
- [I’m learning to feed myself] Finger-food and snack prep (`cat_finger_food_snack_prep`)
- [I’m learning to feed myself] A calmer mealtime setup (`cat_mealtime_routine_setup`)
- [I’m having big feelings] Songs for tricky transitions (`cat_routine_songs`)
- [I’m noticing bathroom routines] Handwashing games and little steps (`cat_handwashing_routine`)
- [Make exploring safer] Furniture, stair and window checks (`cat_furniture_window_checks`)
- [Make exploring safer] Button battery and magnet sweep (`cat_button_battery_check`)
- [Make exploring safer] Bath and water supervision (`cat_bath_water_supervision`)
- [Make exploring safer] Food and choking-safety prep (`cat_food_choking_safety_prep`)

### show_ember_picks is FALSE (0)
_None_

### render_rule is not product_actions (0)
_None_

### is_physical_product is not TRUE (0)
_None_

### needs_research is TRUE (0)
_None_

### missing category_entity_id (0)
_None_

### missing category_label (0)
_None_

## 5. Manual review flags

_None_