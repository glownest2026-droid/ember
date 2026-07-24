# Stage 3 research shortlist — 22-24m

Source: `02_Ember_Bible_22_24m_v1.xlsx` · sheet `discover_projection`

## 1. Summary

| Metric | Value |
|--------|-------|
| age_band_id | age_22_24m |
| total Stage 1 clusters | 8 |
| clusters with a Stage 3 candidate | 7 |
| clusters without a Stage 3 candidate | 1 |
| total eligible product-action rows considered | 36 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Pretend play gets richer | Play kitchen and household props | `cat_play_kitchen_household_props` | `cat_play_kitchen_household_props` | 50.85 | Good gift | both | true | high | 5 | 4 | medium | `ember_picks_22-24m_cat_play_kitchen_household_props.json` | Top eligible in cluster; 5 evidence id(s); 4 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 2 | Words are joining up | Picture books with a little story | `cat_picture_story_books` | `cat_picture_story_books` | 48.2 | Good gift | both | true | high | 4 | 3 | medium | `ember_picks_22-24m_cat_picture_story_books.json` | Top eligible in cluster; 4 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 3 | Sorting, matching and building | Colour sorting and matching games | `cat_colour_sorting_matching` | `cat_colour_sorting_matching` | 45.55 | Good gift | both | true | high | 3 | 2 | medium | `ember_picks_22-24m_cat_colour_sorting_matching.json` | Top eligible in cluster; 3 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 4 | Running, kicking and climbing | Large balls for kicking and chasing | `cat_large_balls` | `cat_large_balls` | 45.4 | Good gift | both | true | high | 3 | 2 | medium | `ember_picks_22-24m_cat_large_balls.json` | Top eligible in cluster; 3 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 5 | Little independence at home | Learning tower or safe step stool | `cat_learning_tower_step_stool` | `cat_learning_tower_step_stool` | 42.5 | Parent buy | conor | false |  | 3 | 3 |  | `ember_picks_22-24m_cat_learning_tower_step_stool.json` | Top eligible in cluster; 3 evidence id(s); 3 source id(s); Conor parent buy; Parent buy; has product family |
| 6 | Meals, potty and body signals | Potty chair for practice sitting | `cat_potty_chair` | `cat_potty_chair` | 42.85 | Parent buy | conor | false |  | 4 | 2 |  | `ember_picks_22-24m_cat_potty_chair.json` | Top eligible in cluster; 4 evidence id(s); 2 source id(s); Conor parent buy; Parent buy; has product family |
| 7 | Feelings, choices and turn-taking | Feeling stories and face books | `cat_feelings_faces_books` | `cat_feelings_faces_books` | 44.95 | Good gift | both | true | high | 3 | 2 | medium | `ember_picks_22-24m_cat_feelings_faces_books.json` | Top eligible in cluster; 3 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |

## 3. Clusters with no Stage 3 product pick

| Stage 1 rank | Stage 1 card | reason_no_pick | dominant_content_types | relevant render_rule values | recommendation |
|---|---|---|---|---|---|
| 8 | Safety checks for a taller toddler | No product-category rows (safety_check (9)) | safety_check (9) | safety_no_shop_actions | Keep as Quick Check |

## 4. Excluded rows audit

### not product_category (23)
- [Words are joining up] Naming walks and little hunts (`cat_naming_walks`)
- [Sorting, matching and building] Tongs, scoops and transfer play (`cat_tongs_scoops`)
- [Running, kicking and climbing] Park climbs and low obstacles (`cat_park_climbing_play`)
- [Running, kicking and climbing] A walk with a job (`cat_walk_with_job`)
- [Little independence at home] Easy clothes and dressing games (`cat_dressing_practice_clothes`)
- [Little independence at home] Clean-up basket and little jobs (`cat_cleanup_basket`)
- [Little independence at home] Handwashing songs and sink routine (`cat_handwashing_routine`)
- [Meals, potty and body signals] Open-cup and pouring practice (`cat_open_cup`)
- [Meals, potty and body signals] Food and choking-safety prep (`cat_food_choking_safety_prep`)
- [Feelings, choices and turn-taking] Teddy care and repair play (`cat_teddy_care_play`)
- [Feelings, choices and turn-taking] Tiny turn-taking games (`cat_first_turn_taking_games`)
- [Feelings, choices and turn-taking] Roll-the-ball turns (`cat_roll_ball_turns`)
- [Feelings, choices and turn-taking] Quiet basket for big feelings (`cat_calm_corner_tools`)
- [Feelings, choices and turn-taking] Tiny choice moments (`cat_tiny_choice_moments`)
- [Safety checks for a taller toddler] Furniture, stair and window checks (`cat_furniture_window_checks`)
- [Safety checks for a taller toddler] Stair gate and doorway review (`cat_stair_gates`)
- [Safety checks for a taller toddler] Cupboard locks and safer storage (`cat_cupboard_locks`)
- [Safety checks for a taller toddler] Button battery and magnet check (`cat_button_battery_check`)
- [Safety checks for a taller toddler] Small-object and choking sweep (`cat_choking_hazard_sweep`)
- [Safety checks for a taller toddler] Car-seat fit and stage check (`cat_rear_facing_car_seat`)
- [Safety checks for a taller toddler] Safe sleep space check-in (`cat_safe_sleep_continuity`)
- [Safety checks for a taller toddler] Blind cords and trailing wires (`cat_blind_cord_cleats`)
- [Safety checks for a taller toddler] Bath and water supervision (`cat_bath_supervision`)

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