# Manus prompt: Ember Stage 3 research for age 1-3m

You are running Ember Stage 3 product research for the 1-3 month age band.

Use this prompt as a self-contained brief. You do not need access to the original workbook. The selected pilot queue is embedded below and follows the pilot-launch rule: exactly one Stage 2 card receives underlying Pip's Picks, per Stage 1 card.

## Mission

Research the 10 selected Stage 2 product categories below and produce Ember-ready Stage 3 outputs for each category:

- Exactly 15 longlist candidates per category.
- Exactly 5 Top Picks per category.
- At least 5 skipped/rejected candidates per category with reasons.
- At least 1 founder/research guidance note per category.
- UK market first, currency GBP.
- For every Top Pick, provide a clickable URL that is either a verified working product/retailer URL or a Google Shopping fallback URL.
- Prioritise currently available, baby-safe, age-appropriate, parent-useful products.
- Do not add extra Stage 2 categories. Research only the 10 rows in the shortlist.

## Quality bar

Use web research. For claims, prefer primary or strong sources:

- Retailer product pages for availability, price, variants, and review counts.
- Brand/manufacturer pages for specs, age guidance, safety warnings, materials, and dimensions.
- Official/safety sources where relevant, especially sleep, car seats, babywearing, choking, and supervised play.
- Editorial roundups only as supporting evidence, not as the only proof.
- Community evidence can help identify practical parent preferences, but do not over-weight anecdote.

Strong retail proof means at least one of:

- Rating >= 4.4 with >= 50 reviews.
- Multi-retailer availability with consistent positive signals.
- Specialist/official proof for categories where mass reviews are less appropriate.

Avoid:

- Products that are unsafe, recalled, age-misaligned, counterfeit-prone, or unavailable in the UK.
- Sleep products that contradict safe-sleep guidance.
- Unknown-history second-hand car seats.
- Any product that relies on unsupervised infant use unless the category and safety guidance clearly allow it.

## Ember UI content requirements

For each Top Pick, write founder-review-ready UI copy:

- `title`: short product/card title.
- `description`: concise parent-facing description of what it is and when it helps.
- `why_pip_picked_this`: concrete reason Pip selected it, grounded in the Stage 1 need and product evidence.
- `best_for`: short differentiator such as "best for travel", "best budget", "best for small spaces".
- `founder_lens`: direct note for founder review, including any risk, duplication, or QA concern.

Keep the tone practical, calm, warm, and non-medical. Do not imply the product is required for development. Use safety notes where needed.

## Required output files

Return a bundle containing these files:

For each row:

- `ember_picks_1-3m_{category_entity_id}.json`
- `ember_picks_1-3m_{category_entity_id}.csv`
- `ember_picks_1-3m_{category_entity_id}_summary.md`

Also return:

- `stage3_research_manifest_1-3m.json`
- `stage3_research_manifest_1-3m.md`

The local ingestion target, when these are handed back to Codex, will be:

`agent-tools/exports/stage3/1-3m/research/`

## JSON schema

Each per-category JSON file must follow this shape:

```json
{
  "schema_version": "ember_picks_research_v2",
  "researcher": "manus",
  "age_band": "1-3m",
  "age_band_id": "age_1_3m",
  "generated_at": "YYYY-MM-DD",
  "market": "UK",
  "currency": "GBP",
  "stage1": {
    "cluster_rank": 1,
    "cluster_entity_id": "ent_cluster_example",
    "cluster_label": "Stage 1 card label",
    "why_it_matters_short": "Short context",
    "why_it_matters_long": "Long context"
  },
  "stage2": {
    "category_rank": 1,
    "category_entity_id": "cat_example",
    "category_type_slug": "cat_example",
    "category_label": "Selected Stage 2 card",
    "buyer_mode_label": "Good gift",
    "primary_persona": "both",
    "gift_friendly": true,
    "gift_confidence": "high",
    "common_ownership_risk": "medium",
    "product_family_label": "Product family",
    "mapping_rationale": "Workbook rationale",
    "safety_note_public": "Safety note if present",
    "evidence_ids": ["ev_0001"],
    "source_ids": ["src_example"]
  },
  "top_picks": [
    {
      "rank": 1,
      "product_name": "Product name",
      "brand": "Brand",
      "retailer": "Retailer",
      "url": "https://...",
      "url_status": "verified_direct | google_shopping_fallback",
      "price_gbp": 0,
      "availability": "in_stock | limited | unknown",
      "rating": 4.7,
      "review_count": 123,
      "best_for": "Best for...",
      "title": "Ember UI title",
      "description": "Ember UI description",
      "why_pip_picked_this": "Evidence-backed reason",
      "founder_lens": "Founder-review note",
      "safety_notes": ["Safety note"],
      "evidence": [
        {
          "source_type": "retailer | brand | official | editorial | community",
          "url": "https://...",
          "claim": "Short paraphrased evidence claim"
        }
      ]
    }
  ],
  "longlist": [
    {
      "product_name": "Product name",
      "brand": "Brand",
      "url": "https://...",
      "include_status": "top_pick | longlist_only | skipped",
      "reason": "Why included or excluded"
    }
  ],
  "skips": [
    {
      "product_name": "Product name",
      "brand": "Brand",
      "url": "https://...",
      "reason": "Why skipped"
    }
  ],
  "guidance_notes": [
    "Founder/research note"
  ]
}
```

## CSV header

Each per-category CSV must use this exact header:

```csv
age_band,stage1_card,stage2_card,rank,product_name,brand,retailer,url,url_status,price_gbp,availability,rating,review_count,best_for,title,description,why_pip_picked_this,founder_lens,safety_notes,evidence_urls
```

## Selected Stage 2 pilot queue

Use these rows as the exact research queue:

```csv
age_band_id,cluster_rank,cluster_entity_id,cluster_label,cluster_why_it_matters_short,cluster_why_it_matters_long,selected_for_stage3,need_entity_ids,category_rank,category_entity_id,category_type_slug,category_label,mapping_rationale,safety_note_public,priority_score,buyer_mode_label,primary_persona,gift_friendly,show_gift_action,gift_display_eligible,gift_confidence,common_ownership_risk,ownership_note,gift_note,gift_buyer_note,product_family_label,evidence_ids,source_ids,community_signal_note,evidence_count,source_count,stage3_research_input_filename,stage3_ingestion_bundle_hint,reason_selected,manual_review_flag
age_1_3m,1,ent_cluster_faces_smiles_chats,I’m finding your face,"Turns faces, smiles and little sounds into shared moments.","Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.",true,ent_need_face_smile_chat,3,cat_baby_safe_mirror,cat_baby_safe_mirror,A baby-safe mirror for faces,Mapped from current age-band evidence into the things that can help lane.,Use only during supervised awake play; do not place loose mirrors or toys in the sleep space.,43.85,Good gift,both,true,true,true,medium,medium,,A thoughtful gift if it fills a real gap at home.,A fresher gift for this age because it gives faces and floor moments a reason to last a little longer.,Baby-safe floor mirror,ev_0002;ev_0015;ev_0017;ev_0019;ev_0030;ev_0034;ev_0029;ev_0092,src_reddit_newparents_2m_activity,Forum signal supports mirrors as a tummy-time and face-watching helper; safety wording follows trusted guidance.,8,1,ember_picks_1-3m_cat_baby_safe_mirror.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 8 evidence id(s); 1 source id(s); both persona; Good gift; has product family; medium ownership risk,
age_1_3m,2,ent_cluster_listen_and_coo,I’m listening to your voice,"Helps familiar voices, songs and pauses feel meaningful.","Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.",true,ent_need_face_smile_chat,3,cat_board_books,cat_board_books,Board books and face books,Mapped from current age-band evidence into the things that can help lane.,,44.95,Good gift,both,true,true,true,high,high,"If they already have books, choose something with faces, contrast or rhythm that gives them a new way to share attention.",A thoughtful gift if it fills a real gap at home.,"A classic gift. Choose sturdy face, contrast or simple picture books rather than a big story collection.",Board books and face books,ev_0003;ev_0016;ev_0022;ev_0039;ev_0093;ev_0083;ev_0097;ev_0091,src_reddit_newparents_2m_activity;src_netmums_3m,Community sources mention reading and board books as practical early play ideas; age-fit is supported by trusted sources.,8,2,ember_picks_1-3m_cat_board_books.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 8 evidence id(s); 2 source id(s); both persona; Good gift; has product family; high ownership risk,
age_1_3m,3,ent_cluster_watching_tracking,I’m watching the world,Gives eyes something simple to notice and follow.,"Your baby may fix on a face, bold pattern or slow-moving object for a few seconds. Simple things to watch can help them practise focus, tracking and turning their head, without too much going on at once. Keep it slow, close and easy to follow.",true,ent_need_visual_tracking,1,cat_high_contrast_cards,cat_high_contrast_cards,High-contrast cards and simple patterns,Mapped from current age-band evidence into the things that can help lane.,,46.05,Good gift,both,true,true,true,high,medium,,A thoughtful gift if it fills a real gap at home.,A route-one early baby gift that is useful for short awake windows and easy to pass on later.,High-contrast card set,ev_0004;ev_0035;ev_0018;ev_0091,src_reddit_newparents_2m_activity,"Parent discussion supports simple looking and play ideas, with trusted evidence supporting early visual attention.",4,1,ember_picks_1-3m_cat_high_contrast_cards.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 4 evidence id(s); 1 source id(s); both persona; Good gift; has product family; medium ownership risk,
age_1_3m,4,ent_cluster_tummy_head_control,I’m getting stronger on my tummy,Makes short awake floor moments easier to try.,"Your baby may only manage a minute or two on their tummy at first. That still counts. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.",true,ent_need_tummy_head_control,1,cat_tummy_time_mat,cat_tummy_time_mat,A simple tummy-time mat,Mapped from current age-band evidence into the things that can help lane.,"Use only during awake, supervised floor play. Put baby on their back for sleep.",48.4,Good gift,both,true,true,true,high,medium,,A thoughtful gift if it fills a real gap at home.,"A useful gift if the family does not already have a clean, comfortable floor space for awake play.",Simple tummy-time mat,ev_0027;ev_0040;ev_0095;ev_0100;ev_0005;ev_0008;ev_0023;ev_0026,src_netmums_3m;src_mumsnet_tummy_time,Parent forums repeatedly mention play mats for tummy time; official guidance sets the supervised-floor rule.,8,2,ember_picks_1-3m_cat_tummy_time_mat.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 8 evidence id(s); 2 source id(s); both persona; Good gift; has product family; medium ownership risk,
age_1_3m,5,ent_cluster_kicks_wriggles,I’m starting to wriggle,"Gives early kicks, stretches and turns room to happen.","Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.",true,ent_need_early_play,2,cat_washable_floor_play_mat,cat_washable_floor_play_mat,A washable floor-play mat,Added in the purchasing-depth pass because the source capture already contains a distinct product-family signal.,"Use only during awake, supervised play.",46.75,Good gift,both,true,true,true,high,medium,"If they already have a good mat, skip this and choose a smaller toy for the mat instead.","A practical gift if the family needs a cleaner, easier floor space.","This is less exciting than a toy but often more useful. Look for washable, easy-to-store and big enough for kicking, tummy time and a parent sitting nearby.",Washable floor-play mat,ev_0027;ev_0040;ev_0095;ev_0100;ev_0006;ev_0021,src_netmums_3m;src_mumsnet_tummy_time,Community sources mention play mats; official and trusted sources support floor tummy time and low movement practice.,6,2,ember_picks_1-3m_cat_washable_floor_play_mat.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 6 evidence id(s); 2 source id(s); both persona; Good gift; has product family; medium ownership risk,
age_1_3m,6,ent_cluster_first_grasps,My hands are waking up,"Helps opening hands, brushing and early grabs feel playful.","Your baby’s hands may be opening more often, brushing objects, watching fingers and starting the first accidental grabs. Soft textures, easy holds and clean objects give them something simple to notice with their hands, eyes and mouth.",true,ent_need_first_grasps,1,cat_reach_grab_toys,cat_reach_grab_toys,Reach-and-grab toys,Mapped from current age-band evidence into the things that can help lane.,,46.85,Good gift,both,true,true,true,medium,low,,A thoughtful gift if it fills a real gap at home.,"A fresh early-hand gift for the upper edge of this band, especially if it is light and easy to clean.",Reach-and-grab toy,ev_0009;ev_0037;ev_0087;ev_0094;ev_0006;ev_0014;ev_0021;ev_0029,src_netmums_3m,Community evidence mentions tactile toys; trusted and competitor evidence support early reaching and grasping objects.,8,1,ember_picks_1-3m_cat_reach_grab_toys.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 8 evidence id(s); 1 source id(s); both persona; Good gift; has product family; low ownership risk,tie_at_top
age_1_3m,7,ent_cluster_calm_crying_settling,Help me settle and reconnect,Gives hard patches a few simple reset options.,"Some days, your baby may cry, fuss or need help switching gears. Tiny resets, a close cuddle, a walk, or one repeatable note about what helped can make hard patches easier to read over time.",true,ent_need_crying_settling,3,cat_soft_carrier_sling,cat_soft_carrier_sling,A safe sling or carrier cuddle,Mapped from current age-band evidence into the things that can help lane.,Follow recognised safe babywearing guidance and fit checks.,40.2,Parent buy,both,false,false,false,,,High ownership risk: frame as useful only if the buyer knows there is a real gap.,,,Baby carrier or sling,ev_0073;ev_0002;ev_0015;ev_0017;ev_0019;ev_0030;ev_0034;ev_0042,,,8,0,ember_picks_1-3m_cat_soft_carrier_sling.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 8 evidence id(s); 0 source id(s); both persona; Parent buy; has product family,
age_1_3m,8,ent_cluster_feeding_clean_kit,Make feeds feel easier,"Keeps feeding cues, leaks and kit easier to manage.","Feeds can feel constant at this age, with cues, winding, leaking, bottles or breast comfort all happening at once. Small bits of setup can reduce faff around feeds, so you can notice your baby’s signals and keep the practical jobs manageable.",true,ent_need_feeding_rhythm,2,cat_burp_cloths_muslins,cat_burp_cloths_muslins,Muslins and burp cloths,Mapped from current age-band evidence into the things that can help lane.,,41.55,Parent buy,both,false,false,false,,,"Most families need more than they expect, but check fabric preferences if buying for someone else.",,,Muslins and burp cloths,ev_0066;ev_0067;ev_0068;ev_0070;ev_0073;ev_0049;ev_0053,,,7,0,ember_picks_1-3m_cat_burp_cloths_muslins.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 7 evidence id(s); 0 source id(s); both persona; Parent buy; has product family,
age_1_3m,9,ent_cluster_safe_sleep_setup,Help sleep stay safe,"Keeps the sleep space simple, clear and easier to check.","Safer sleep is one place where simple rules really help. A clear cot, firm flat mattress, room sharing and sensible layers make the sleep space easier to check, especially when you are tired and doing the same routine many times.",true,ent_need_safe_sleep_setup,2,cat_firm_flat_mattress,cat_firm_flat_mattress,"A firm, flat, waterproof mattress",Mapped from current age-band evidence into the things that can help lane.,"A new mattress is preferred where possible. Avoid soft, uneven or poorly fitting surfaces.",39.9,Parent buy,both,false,false,false,,,,,,Firm flat baby mattress,ev_0048;ev_0052;ev_0046;ev_0051,,,4,0,ember_picks_1-3m_cat_firm_flat_mattress.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 4 evidence id(s); 0 source id(s); both persona; Parent buy; has product family,
age_1_3m,10,ent_cluster_health_first_trips,Keep first trips simpler,"Helps check-ups, changes and early outings feel more prepared.","By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.",true,ent_need_health_first_trips,2,cat_rear_facing_car_seat,cat_rear_facing_car_seat,Rear-facing infant car seat,Mapped from current age-band evidence into the things that can help lane.,"Use an approved, correctly fitted seat. Avoid unknown-history second-hand car seats.",38.25,Parent buy,both,false,false,false,,,"This should be chosen by the parent or caregiver because fit, approval and history matter.",,,Rear-facing infant car seat,ev_0080;ev_0081;ev_0082,,,3,0,ember_picks_1-3m_cat_rear_facing_car_seat.json,stage3_ingestion_bundle_1-3m.json,Top eligible in cluster; 3 evidence id(s); 0 source id(s); both persona; Parent buy; has product family,
```

## Final response format

When finished, return:

1. A compact summary of any categories where you could not meet the exact quality bar.
2. The manifest files.
3. All per-category JSON, CSV, and summary MD files.
4. A note listing any product URLs that are Google Shopping fallbacks rather than verified direct links.
