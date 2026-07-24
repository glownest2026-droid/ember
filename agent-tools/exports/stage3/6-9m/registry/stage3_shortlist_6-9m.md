# Stage 3 research shortlist — 6-9m

Source: `02_Ember_Bible_6_9m_Conor_Thea_Depth_v2.xlsx` · sheet `discover_projection`

## 1. Summary

| Metric | Value |
|--------|-------|
| age_band_id | age_6_9m |
| total Stage 1 clusters | 8 |
| clusters with a Stage 3 candidate | 8 |
| clusters without a Stage 3 candidate | 0 |
| total eligible product-action rows considered | 34 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | I’m sitting and reaching | Reach-and-grab toys | `cat_reach_grab_toys` | `cat_reach_grab_toys` | 42.35 | Good gift | both | true | high | 3 | 0 | medium | `ember_picks_6-9m_cat_reach_grab_toys.json` | Top eligible in cluster; 3 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 2 | I’m getting ready to move | Wobbly tummy-time toys | `cat_tummy_time_wobbler` | `cat_tummy_time_wobbler` | 43.45 | Good gift | both | true | medium | 3 | 0 | low | `ember_picks_6-9m_cat_tummy_time_wobbler.json` | Top eligible in cluster; 3 evidence id(s); persona both; gift bonus 2.5; Good gift; has product family |
| 3 | I’m finding hidden things | Peekaboo scarves | `cat_peekaboo_scarf` | `cat_peekaboo_scarf` | 45.8 | Good gift | both | true | medium | 4 | 1 | low | `ember_picks_6-9m_cat_peekaboo_scarf.json` | Top eligible in cluster; 4 evidence id(s); 1 source id(s); persona both; gift bonus 2.5; Good gift; has product family |
| 4 | I’m putting things in and out | Stacking and nesting cups | `cat_stacking_nesting_cups` | `cat_stacking_nesting_cups` | 43.4 | Good gift | both | true | high | 3 | 0 | medium | `ember_picks_6-9m_cat_stacking_nesting_cups.json` | Top eligible in cluster; 3 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 5 | I’m exploring with my mouth | Teethers and chew-safe toys | `cat_teethers` | `cat_teethers` | 43.25 | Good gift | both | true | high | 3 | 0 | medium | `ember_picks_6-9m_cat_teethers.json` | Top eligible in cluster; 3 evidence id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 6 | I’m trying first tastes | A supportive highchair | `cat_highchair` | `cat_highchair` | 38.6 | Parent buy | conor | false |  | 3 | 0 | medium | `ember_picks_6-9m_cat_highchair.json` | Top eligible in cluster; 3 evidence id(s); Conor parent buy; Parent buy; has product family; medium ownership risk (−) |
| 7 | Keep little hands safer | Safety gates | `cat_safety_gates` | `cat_safety_gates` | 37.7 | Parent buy | conor | false |  | 2 | 0 | low | `ember_picks_6-9m_cat_safety_gates.json` | Top eligible in cluster; 2 evidence id(s); Conor parent buy; Parent buy; has product family |
| 8 | I’m listening and joining in | Board books and face books | `cat_board_books` | `cat_board_books` | 45.55 | Good gift | both | true | high | 4 | 2 | high | `ember_picks_6-9m_cat_board_books.json` | Top eligible in cluster; 4 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; Good gift; has product family; high ownership risk (−) |

## 3. Clusters with no Stage 3 product pick

_None — every Stage 1 cluster has an eligible product candidate._

## 4. Excluded rows audit

### not product_category (8)
- [I’m getting ready to move] A clear floor space (`cat_safe_floor_space`)
- [I’m getting ready to move] Just-out-of-reach play (`cat_reach_out_of_range`)
- [I’m exploring with my mouth] Safe everyday-object play (`cat_safe_household_objects`)
- [I’m trying first tastes] Food notes or allergen tracker (`cat_allergen_tracking`)
- [Keep little hands safer] Small-object safety sweep (`cat_small_object_sweep`)
- [Keep little hands safer] Button battery checks (`cat_button_battery_check`)
- [Keep little hands safer] Safe sleep check-in (`cat_safe_sleep_continuity`)
- [I’m listening and joining in] Songs and action games (`cat_songs_action_games`)

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