# Stage 3 research shortlist — 4-6m

Source: `02_Ember_Bible_4_6m_Conor_Thea_Depth_v2.xlsx` · sheet `discover_projection`

## 1. Summary

| Metric | Value |
|--------|-------|
| age_band_id | age_4_6m |
| total Stage 1 clusters | 8 |
| clusters with a Stage 3 candidate | 7 |
| clusters without a Stage 3 candidate | 1 |
| total eligible product-action rows considered | 28 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | The floor is my little gym | A clean floor-play mat | `cat_tummy_time_mat` | `cat_tummy_time_mat` | 45.1 | Good gift | both | true | high | 3 | 2 | high | `ember_picks_4-6m_cat_tummy_time_mat.json` | Top eligible in cluster; 3 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |
| 2 | My hands can do more now | Reach-and-grab toys | `cat_reach_grab_toys` | `cat_reach_grab_toys` | 42.95 | Good gift | both | true | high | 3 | 0 | high | `ember_picks_4-6m_cat_reach_grab_toys.json` | Top eligible in cluster; 3 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |
| 3 | Everything goes in my mouth | Teethers and chew-safe toys | `cat_teethers` | `cat_teethers` | 46.3 | Good gift | both | true | high | 4 | 2 | high | `ember_picks_4-6m_cat_teethers.json` | Top eligible in cluster; 4 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |
| 4 | Talk to me | Chunky board books | `cat_board_books` | `cat_board_books` | 43.65 | Good gift | both | true | high | 3 | 1 | high | `ember_picks_4-6m_cat_board_books.json` | Top eligible in cluster; 3 evidence id(s); 1 source id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |
| 5 | I can make things happen | Kick-and-discover socks | `cat_kick_play_socks` | `cat_kick_play_socks` | 43.25 | Good gift | both | true | high | 4 | 0 | medium | `ember_picks_4-6m_cat_kick_play_socks.json` | Top eligible in cluster; 4 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 6 | I’m finding my body | Body-part board books | `cat_parts_of_me_books` | `cat_parts_of_me_books` | 41.6 | Good gift | both | true | high | 2 | 0 | medium | `ember_picks_4-6m_cat_parts_of_me_books.json` | Top eligible in cluster; 2 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 7 | First tastes are getting close | A supportive highchair | `cat_highchair` | `cat_highchair` | 39.95 | Parent buy | conor | false |  | 4 | 0 | medium | `ember_picks_4-6m_cat_highchair.json` | Top eligible in cluster; 4 evidence id(s); Conor parent buy; Parent buy; has product family; medium ownership risk (−) |

## 3. Clusters with no Stage 3 product pick

| Stage 1 rank | Stage 1 card | reason_no_pick | dominant_content_types | relevant render_rule values | recommendation |
|---|---|---|---|---|---|
| 8 | Keep this next stage safe | No product-category rows (safety_check (6)) | safety_check (6) | safety_no_shop_actions | Keep as Quick Check |

## 4. Excluded rows audit

### not product_category (17)
- [The floor is my little gym] Very short tummy-time tries (`cat_short_tummy_time_tries`)
- [The floor is my little gym] Rolled towel support (`cat_tummy_time_support_setup`)
- [My hands can do more now] One-toy reach loop (`cat_one_small_toy_reach_loop`)
- [Everything goes in my mouth] Safe everyday-object play (`cat_safe_household_objects`)
- [Talk to me] Songs, pauses and silly sounds (`cat_songs_action_games`)
- [Talk to me] Books with pauses (`cat_books_with_pauses`)
- [I’m finding my body] Foot-finding floor games (`cat_feet_discovery_games`)
- [I’m finding my body] Mirror-and-body play (`cat_mirror_body_play`)
- [First tastes are getting close] Food notes or allergen tracker (`cat_allergen_tracking`)
- [First tastes are getting close] Ready-for-first-tastes signs (`cat_feeding_readiness_check`)
- [First tastes are getting close] Choking-aware meal setup (`cat_choking_aware_meal_setup`)
- [Keep this next stage safe] Safe sleep check-in (`cat_safe_sleep_continuity`)
- [Keep this next stage safe] Rear-facing car-seat check (`cat_rear_facing_car_seat`)
- [Keep this next stage safe] Small-object safety sweep (`cat_small_object_sweep`)
- [Keep this next stage safe] Button battery check (`cat_button_battery_check`)
- [Keep this next stage safe] Clear cot check (`cat_clear_cot_check`)
- [Keep this next stage safe] Room thermometer (`cat_room_thermometer`)

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