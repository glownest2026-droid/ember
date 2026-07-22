# Stage 3 research shortlist - 1-3m

Source: `02_Ember_Bible_1_3m_Conor_Thea_Depth_v2_more_purchase_depth.xlsx` - sheet `discover_projection`

## 1. Summary

| Metric | Value |
|---|---|
| age_band_id | age_1_3m |
| total Stage 1 clusters | 10 |
| clusters with a Stage 3 candidate | 10 |
| clusters without a Stage 3 candidate | 0 |
| total eligible product-action rows considered | 37 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card where an eligible product row exists.

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence IDs | source IDs | common_ownership_risk | reason_selected |
|---|---|---|---|---|---:|---|---|---|---|---|---|---|---|
| 1 | I’m finding your face | A baby-safe mirror for faces | `cat_baby_safe_mirror` | `cat_baby_safe_mirror` | 43.85 | Good gift | both | true | medium | ev_0002;ev_0015;ev_0017;ev_0019;ev_0030;ev_0034;ev_0029;ev_0092 | src_reddit_newparents_2m_activity | medium | Top eligible in cluster; 8 evidence id(s); 1 source id(s); both persona; Good gift; has product family; medium ownership risk |
| 2 | I’m listening to your voice | Board books and face books | `cat_board_books` | `cat_board_books` | 44.95 | Good gift | both | true | high | ev_0003;ev_0016;ev_0022;ev_0039;ev_0093;ev_0083;ev_0097;ev_0091 | src_reddit_newparents_2m_activity;src_netmums_3m | high | Top eligible in cluster; 8 evidence id(s); 2 source id(s); both persona; Good gift; has product family; high ownership risk |
| 3 | I’m watching the world | High-contrast cards and simple patterns | `cat_high_contrast_cards` | `cat_high_contrast_cards` | 46.05 | Good gift | both | true | high | ev_0004;ev_0035;ev_0018;ev_0091 | src_reddit_newparents_2m_activity | medium | Top eligible in cluster; 4 evidence id(s); 1 source id(s); both persona; Good gift; has product family; medium ownership risk |
| 4 | I’m getting stronger on my tummy | A simple tummy-time mat | `cat_tummy_time_mat` | `cat_tummy_time_mat` | 48.4 | Good gift | both | true | high | ev_0027;ev_0040;ev_0095;ev_0100;ev_0005;ev_0008;ev_0023;ev_0026 | src_netmums_3m;src_mumsnet_tummy_time | medium | Top eligible in cluster; 8 evidence id(s); 2 source id(s); both persona; Good gift; has product family; medium ownership risk |
| 5 | I’m starting to wriggle | A washable floor-play mat | `cat_washable_floor_play_mat` | `cat_washable_floor_play_mat` | 46.75 | Good gift | both | true | high | ev_0027;ev_0040;ev_0095;ev_0100;ev_0006;ev_0021 | src_netmums_3m;src_mumsnet_tummy_time | medium | Top eligible in cluster; 6 evidence id(s); 2 source id(s); both persona; Good gift; has product family; medium ownership risk |
| 6 | My hands are waking up | Reach-and-grab toys | `cat_reach_grab_toys` | `cat_reach_grab_toys` | 46.85 | Good gift | both | true | medium | ev_0009;ev_0037;ev_0087;ev_0094;ev_0006;ev_0014;ev_0021;ev_0029 | src_netmums_3m | low | Top eligible in cluster; 8 evidence id(s); 1 source id(s); both persona; Good gift; has product family; low ownership risk |
| 7 | Help me settle and reconnect | A safe sling or carrier cuddle | `cat_soft_carrier_sling` | `cat_soft_carrier_sling` | 40.2 | Parent buy | both | false |  | ev_0073;ev_0002;ev_0015;ev_0017;ev_0019;ev_0030;ev_0034;ev_0042 |  |  | Top eligible in cluster; 8 evidence id(s); 0 source id(s); both persona; Parent buy; has product family |
| 8 | Make feeds feel easier | Muslins and burp cloths | `cat_burp_cloths_muslins` | `cat_burp_cloths_muslins` | 41.55 | Parent buy | both | false |  | ev_0066;ev_0067;ev_0068;ev_0070;ev_0073;ev_0049;ev_0053 |  |  | Top eligible in cluster; 7 evidence id(s); 0 source id(s); both persona; Parent buy; has product family |
| 9 | Help sleep stay safe | A firm, flat, waterproof mattress | `cat_firm_flat_mattress` | `cat_firm_flat_mattress` | 39.9 | Parent buy | both | false |  | ev_0048;ev_0052;ev_0046;ev_0051 |  |  | Top eligible in cluster; 4 evidence id(s); 0 source id(s); both persona; Parent buy; has product family |
| 10 | Keep first trips simpler | Rear-facing infant car seat | `cat_rear_facing_car_seat` | `cat_rear_facing_car_seat` | 38.25 | Parent buy | both | false |  | ev_0080;ev_0081;ev_0082 |  |  | Top eligible in cluster; 3 evidence id(s); 0 source id(s); both persona; Parent buy; has product family |

## 3. Clusters with no Stage 3 product pick

| Stage 1 rank | Stage 1 card | reason_no_pick | dominant_content_types | relevant render_rule values | recommendation |
|---|---|---|---|---|---|

## 4. Excluded rows audit

### not product_category (18)
- [I’m finding your face] Face-to-face talking and smiling (`cat_face_to_face_play`)
- [I’m finding your face] Copying faces and little expressions (`cat_copying_faces_expressions`)
- [I’m listening to your voice] Familiar voices and little pauses (`cat_familiar_voice_pauses`)
- [I’m listening to your voice] Songs, rhymes and tiny games (`cat_songs_action_games`)
- [I’m getting stronger on my tummy] Rolled-towel tummy support (`cat_rolled_towel_tummy_support`)
- [I’m starting to wriggle] Kicky floor time (`cat_kicky_floor_play`)
- [I’m starting to wriggle] A clear low floor space (`cat_safe_floor_space`)
- [I’m starting to wriggle] Side-lying pauses and turns (`cat_supported_side_lying_play`)
- [Help me settle and reconnect] Gentle white noise or sound reset (`cat_white_noise_soother`)
- [Help me settle and reconnect] A pram walk reset (`cat_pram_walk_reset`)
- [Help me settle and reconnect] A simple settling notes routine (`cat_settling_routine_notes`)
- [Make feeds feel easier] Responsive feeding cues (`cat_responsive_feeding_support`)
- [Help sleep stay safe] Safe sleep check-in (`cat_safe_sleep_continuity`)
- [Help sleep stay safe] Clear cot checks (`cat_clear_cot_check`)
- [Keep first trips simpler] Red Book and vaccine planning (`cat_red_book_vaccine_planning`)
- [Keep first trips simpler] Nappy change station (`cat_nappy_change_station`)
- [Keep first trips simpler] Small-object safety sweep (`cat_small_object_sweep`)
- [Keep first trips simpler] Button battery checks (`cat_button_battery_check`)

## 5. Manual review flags

- My hands are waking up: tie_at_top