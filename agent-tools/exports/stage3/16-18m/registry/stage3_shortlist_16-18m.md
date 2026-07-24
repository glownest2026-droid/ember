# Stage 3 research shortlist — 16-18m

Source: `02_Ember_Bible_16_18m_v1_1_QA_patch.xlsx` · sheet `discover_projection`

## 1. Summary

| Metric | Value |
|--------|-------|
| age_band_id | age_16_18m |
| total Stage 1 clusters | 8 |
| clusters with a Stage 3 candidate | 7 |
| clusters without a Stage 3 candidate | 1 |
| total eligible product-action rows considered | 20 |

**MVP launch principle:** at least one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card (where an eligible product row exists).

## 2. Stage 3 shortlist

| Stage 1 rank | Stage 1 card | Selected Stage 2 card | category_entity_id | category_type_slug | priority_score | buyer_mode_label | primary_persona | gift_friendly | gift_confidence | evidence_count | source_count | common_ownership_risk | stage3_research_input_filename | reason_selected |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | I’m off on little adventures | Soft balls to roll and chase | `cat_soft_graspable_balls` | `cat_soft_graspable_balls` | 50.85 | Good gift | both | true | high | 5 | 4 | medium | `ember_picks_16-18m_cat_soft_graspable_balls.json` | Top eligible in cluster; 5 evidence id(s); 4 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 2 | My hands are busy now | Stacking pegboards and block towers | `cat_stacking_pegboard` | `cat_stacking_pegboard` | 47.45 | Good gift | both | true | medium | 5 | 4 | high | `ember_picks_16-18m_cat_stacking_pegboard.json` | Top eligible in cluster; 5 evidence id(s); 4 source id(s); persona both; gift bonus 2.5; Good gift; has product family; high ownership risk (−) |
| 3 | I’m testing what happens | Ramp and rolling toys | `cat_ramp_rolling_toys` | `cat_ramp_rolling_toys` | 49.8 | Good gift | both | true | high | 4 | 4 | low | `ember_picks_16-18m_cat_ramp_rolling_toys.json` | Top eligible in cluster; 4 evidence id(s); 4 source id(s); persona both; gift bonus 3.5; Good gift; has product family |
| 4 | I’m finding my words | First-word picture books | `cat_first_word_picture_books` | `cat_first_word_picture_books` | 44.4 | Good gift | thea | true | high | 4 | 4 | medium | `ember_picks_16-18m_cat_first_word_picture_books.json` | Top eligible in cluster; 4 evidence id(s); 4 source id(s); Thea gift lane; gift bonus 5; Good gift; has product family; medium ownership risk (−) |
| 5 | I’m copying real life | Soft toy and doll care play | `cat_doll_soft_toy_care` | `cat_doll_soft_toy_care` | 50.25 | Good gift | both | true | high | 5 | 4 | medium | `ember_picks_16-18m_cat_doll_soft_toy_care.json` | Top eligible in cluster; 5 evidence id(s); 4 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 6 | I’m making my mark | Chunky crayons and first scribbles | `cat_chunky_crayons` | `cat_chunky_crayons` | 50.1 | Good gift | both | true | high | 6 | 5 | medium | `ember_picks_16-18m_cat_chunky_crayons.json` | Top eligible in cluster; 6 evidence id(s); 5 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−) |
| 7 | I’m taking charge at meals | Open or free-flow cup | `cat_open_cup` | `cat_open_cup` | 40.45 | Parent buy | conor | false |  | 3 | 2 | medium | `ember_picks_16-18m_cat_open_cup.json` | Top eligible in cluster; 3 evidence id(s); 2 source id(s); Conor parent buy; Parent buy; has product family; medium ownership risk (−) |

## 3. Clusters with no Stage 3 product pick

| Stage 1 rank | Stage 1 card | reason_no_pick | dominant_content_types | relevant render_rule values | recommendation |
|---|---|---|---|---|---|
| 8 | Keep a faster toddler safer | No product-category rows (safety_check (5)) | safety_check (5) | safety_no_shop_actions | Keep as Quick Check |

## 4. Excluded rows audit

### not product_category (13)
- [I’m off on little adventures] Low climbing and crawl-through play (`cat_low_climb_tunnel`)
- [I’m off on little adventures] Music and dancing games (`cat_music_dance`)
- [I’m testing what happens] Posting and drop boxes (`cat_posting_drop_boxes`)
- [I’m finding my words] Songs and action games (`cat_songs_action_games`)
- [I’m finding my words] Naming walks and object hunts (`cat_naming_walks`)
- [I’m copying real life] Carry bags and little errands (`cat_toddler_bag_carry`)
- [I’m making my mark] Texture tubs and safe sensory baskets (`cat_texture_tubs`)
- [I’m taking charge at meals] Finger-food and snack prep (`cat_finger_food_snack_prep`)
- [Keep a faster toddler safer] Stair gate fit check (`cat_stair_gates`)
- [Keep a faster toddler safer] Cupboard locks and safer storage (`cat_cupboard_locks`)
- [Keep a faster toddler safer] Furniture, window and cord checks (`cat_furniture_window_checks`)
- [Keep a faster toddler safer] Button battery checks (`cat_button_battery_check`)
- [Keep a faster toddler safer] Bath and water supervision (`cat_bath_water_supervision`)

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