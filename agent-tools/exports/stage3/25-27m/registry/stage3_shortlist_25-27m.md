# Stage 3 research shortlist — 25-27m

Source: `02_Ember_Bible_25_27m_Conor_Thea_Depth_v2.xlsx` · sheet `discover_projection`

## 1. Summary

| Metric | Value |
|--------|-------|
| age_band_id | age_25_27m |
| total Stage 1 clusters | 8 |
| clusters with a Stage 3 candidate | 8 |
| clusters without a Stage 3 candidate | 0 |
| total eligible product-action rows considered | 40 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | I’m telling you more | Books that start little chats | `cat_picture_story_books` | `cat_picture_story_books` | 44.6 | Good gift | both | true | high | 4 | 3 | high | `ember_picks_25-27m_cat_picture_story_books.json` | Top eligible in cluster; 4 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |
| 2 | I’m copying the everyday | A play kitchen for everyday copying | `cat_play_kitchen_household_props` | `cat_play_kitchen_household_props` | 50.7 | Good gift | both | true | high | 5 | 5 | medium | `ember_picks_25-27m_cat_play_kitchen_household_props.json` | Top eligible in cluster; 5 evidence id(s); 5 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 3 | My hands are getting busy | Chunky puzzles and shape sorters | `cat_shape_sorters_puzzles` | `cat_shape_sorters_puzzles` | 46.55 | Good gift | both | true | high | 3 | 3 | medium | `ember_picks_25-27m_cat_shape_sorters_puzzles.json` | Top eligible in cluster; 3 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 4 | I’m moving with more confidence | Soft balls to kick and chase | `cat_soft_graspable_balls` | `cat_soft_graspable_balls` | 46.9 | Good gift | both | true | high | 4 | 4 | medium | `ember_picks_25-27m_cat_soft_graspable_balls.json` | Top eligible in cluster; 4 evidence id(s); 4 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 5 | I’m learning to play with others | Books about faces and feelings | `cat_feelings_faces_books` | `cat_feelings_faces_books` | 44.25 | Good gift | both | true | high | 3 | 3 | medium | `ember_picks_25-27m_cat_feelings_faces_books.json` | Top eligible in cluster; 3 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 6 | I want to do it myself | A steady step for helping | `cat_step_stool` | `cat_step_stool` | 45.1 | Parent buy | conor | true | high | 3 | 3 | medium | `ember_picks_25-27m_cat_step_stool.json` | Top eligible in cluster; 3 evidence id(s); 3 source id(s); Conor parent buy; gift bonus 3.5; Parent buy; has product family; medium ownership risk (−) |
| 7 | I’m noticing potty signs | A potty to practise sitting | `cat_potty` | `cat_potty` | 43.7 | Parent buy | conor | false |  | 4 | 3 | low | `ember_picks_25-27m_cat_potty.json` | Top eligible in cluster; 4 evidence id(s); 3 source id(s); Conor parent buy; Parent buy; has product family |
| 8 | Keep curious days safer | Bedtime books with familiar steps | `cat_bedtime_board_books` | `cat_bedtime_board_books` | 36.55 | Parent buy | conor | false |  | 3 | 3 | high | `ember_picks_25-27m_cat_bedtime_board_books.json` | Top eligible in cluster; 3 evidence id(s); 3 source id(s); Conor parent buy; Parent buy; has product family; high ownership risk (−) |

## 3. Clusters with no Stage 3 product pick

_None — every Stage 1 cluster has an eligible product candidate._

## 4. Excluded rows audit

### not product_category (12)
- [I’m telling you more] Little conversation games (`cat_conversation_games`)
- [I’m telling you more] Songs, rhymes and action games (`cat_songs_action_games`)
- [I’m telling you more] Library stories and rhyme sessions (`cat_library_storytime`)
- [I’m moving with more confidence] Playground climbs and running space (`cat_climbing_frame_play`)
- [I’m moving with more confidence] Follow-the-leader movement games (`cat_follow_the_leader_games`)
- [I’m learning to play with others] Tiny turn-taking games (`cat_turn_taking_games`)
- [I’m learning to play with others] Playgroups, parks and little meetups (`cat_playdate_library_groups`)
- [I want to do it myself] Handwashing songs and sink routine (`cat_handwashing_routine`)
- [Keep curious days safer] Small portions and family meals (`cat_family_mealtime_setup`)
- [Keep curious days safer] A button battery sweep (`cat_button_battery_check`)
- [Keep curious days safer] Furniture, stair and window checks (`cat_furniture_window_checks`)
- [Keep curious days safer] Small-object and choking sweep (`cat_choking_hazard_sweep`)

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