# Stage 3 research shortlist — 9-12m

Source: `02_Ember_Bible_9_12m_Conor_Thea_Depth_v2.xlsx` · sheet `discover_projection`

## 1. Summary

| Metric | Value |
|--------|-------|
| age_band_id | age_9_12m |
| total Stage 1 clusters | 8 |
| clusters with a Stage 3 candidate | 7 |
| clusters without a Stage 3 candidate | 1 |
| total eligible product-action rows considered | 31 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | I’m getting ready to move | Stable push and pull toys | `cat_push_pull_toys` | `cat_push_pull_toys` | 41.35 | Good gift | both | true | high | 2 | 1 | medium | `ember_picks_9-12m_cat_push_pull_toys.json` | Top eligible in cluster; 2 evidence id(s); 1 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 2 | I’m busy with both hands | Pincer puzzles and peg drops | `cat_pincer_puzzle` | `cat_pincer_puzzle` | 45.2 | Good gift | both | true | high | 4 | 0 | medium | `ember_picks_9-12m_cat_pincer_puzzle.json` | Top eligible in cluster; 4 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 3 | I’m finding hidden things | Peekaboo cloths and scarves | `cat_peekaboo_scarf` | `cat_peekaboo_scarf` | 44.3 | Good gift | both | true | high | 4 | 0 | high | `ember_picks_9-12m_cat_peekaboo_scarf.json` | Top eligible in cluster; 4 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |
| 4 | I’m chatting, clapping and waving | Books with pauses | `cat_board_books` | `cat_board_books` | 44.15 | Good gift | both | true | high | 4 | 0 | high | `ember_picks_9-12m_cat_board_books.json` | Top eligible in cluster; 4 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |
| 5 | Mealtimes are changing | Highchair or upright feeding seat | `cat_highchair` | `cat_highchair` | 37.25 | Parent buy | conor | false |  | 2 | 0 | medium | `ember_picks_9-12m_cat_highchair.json` | Top eligible in cluster; 2 evidence id(s); Conor parent buy; Parent buy; has product family; medium ownership risk (−) |
| 7 | I’m noticing faces and feelings | Faces and feelings books | `cat_feelings_faces_books` | `cat_feelings_faces_books` | 42.95 | Good gift | both | true | high | 3 | 0 | medium | `ember_picks_9-12m_cat_feelings_faces_books.json` | Top eligible in cluster; 3 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 8 | Make the day feel easier | Bubbles for watching and reaching | `cat_bubbles` | `cat_bubbles` | 34.3 | Parent buy | conor | false |  | 1 | 1 | medium | `ember_picks_9-12m_cat_bubbles.json` | Top eligible in cluster; 1 evidence id(s); 1 source id(s); Conor parent buy; Parent buy; has product family; medium ownership risk (−) |

## 3. Clusters with no Stage 3 product pick

| Stage 1 rank | Stage 1 card | reason_no_pick | dominant_content_types | relevant render_rule values | recommendation |
|---|---|---|---|---|---|
| 6 | Keep little hands safer | No product-category rows (safety_check (8)) | safety_check (8) | safety_no_shop_actions | Keep as Quick Check |

## 4. Excluded rows audit

### not product_category (29)
- [I’m getting ready to move] A clear floor for moving (`cat_floor_zone`)
- [I’m getting ready to move] A safer pulling-up spot (`cat_cruising_furniture`)
- [I’m getting ready to move] Park trips and baby swings (`cat_park_swings`)
- [I’m getting ready to move] Low cushions to crawl over (`cat_low_obstacle`)
- [I’m busy with both hands] Treasure basket and container play (`cat_container_basket`)
- [I’m busy with both hands] Baby-safe household object basket (`cat_safe_household_objects`)
- [I’m finding hidden things] Hide-and-find favourite toy games (`cat_hide_favourite_toy`)
- [I’m chatting, clapping and waving] Rhymes, clapping and pat-a-cake (`cat_rhyme_games`)
- [I’m chatting, clapping and waving] Waving and simple signs (`cat_waving_signs`)
- [I’m chatting, clapping and waving] Babble-copying sound games (`cat_sound_copy`)
- [I’m chatting, clapping and waving] Point-and-name outings (`cat_point_name_outings`)
- [Mealtimes are changing] Finger-food prep tools (`cat_finger_food_prep`)
- [Mealtimes are changing] A simple family meal rhythm (`cat_family_meal_plan`)
- [Mealtimes are changing] Pouch and jar balance (`cat_pouches_caution`)
- [Mealtimes are changing] Highchair harness check (`cat_highchair_harness_check`)
- [Keep little hands safer] Stair gate placement (`cat_stair_gates`)
- [Keep little hands safer] Furniture anchors (`cat_furniture_anchors`)
- [Keep little hands safer] Cupboard locks and poison storage (`cat_cupboard_locks`)
- [Keep little hands safer] Blind cord cleats (`cat_blind_cord_cleats`)
- [Keep little hands safer] Bath supervision and water-play rules (`cat_bath_supervision`)
- [Keep little hands safer] Skip seated baby walkers (`cat_exclude_baby_walker`)
- [Keep little hands safer] Plastic and nappy bag sweep (`cat_bag_sweep`)
- [Keep little hands safer] Sling TICKS check (`cat_sling_ticks_check`)
- [I’m noticing faces and feelings] Family photos and familiar people (`cat_family_photos`)
- [Make the day feel easier] Pram walks and naming trips (`cat_pram_walks`)
- [Make the day feel easier] Library or baby group floor time (`cat_library_baby_group`)
- [Make the day feel easier] Tiny toy rotation or activity basket (`cat_toy_rotation`)
- [Make the day feel easier] Safe laundry basket play (`cat_safe_laundry_play`)
- [Make the day feel easier] A tiny daily play loop (`cat_tiny_daily_play_loop`)

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