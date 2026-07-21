# Manus prompt: Ember Stage 3 research — 28-30m + 31-33m + 34-36m (remaining pilots)

You are running Ember Stage 3 product research for **three adjacent toddler age bands in one task**:

- **28-30 months** (nearly two and a half) — Discover route hint `/discover/29`
- **31-33 months** (just past two and a half) — `/discover/32`
- **34-36 months** (nearly three) — `/discover/35`

Use this prompt as a self-contained brief. You do not need access to the original Ember Bible workbooks. The selected pilot queue is embedded below.

## Mission

Research **exactly 19** Stage 2 product categories (the remaining pilots) and produce Ember-ready Stage 3 outputs for each:

| Band | Categories to research |
|---|---:|
| 28-30m | 7 |
| 31-33m | 8 |
| 34-36m | 4 (remaining only) |
| **Total** | **19** |

For each category:

- Exactly **15** longlist candidates
- Default **5** Top Picks (books/story/feelings-book categories may go up to **10** only if picks 6–10 still serve a meaningfully different parent situation; do not pad)
- At least **5** skipped/rejected candidates with reasons
- At least **1** guidance note covering buy / borrow / bring back out / pre-loved / hold off
- Market **UK**, currency **GBP**
- Every Top Pick needs a clickable URL that is either a verified working product/retailer URL or a Google Shopping fallback URL
- Do **not** add extra Stage 2 categories. Research only the 19 rows in the shortlist CSV below.

## Why these three bands together (differentiation is the point)

These bands sit next to each other. Generic “best toddler toys” lists will fail Ember’s bar.

For every pick, make the **stage shift** obvious:

1. Why this product fits **this** Stage 1 card and age band now
2. What would have been too babyish / too advanced one band earlier or later
3. How the pick set differs from the neighbouring band when the category family overlaps

### Known overlap families to differentiate deliberately

| Theme | 28-30m pilot | 31-33m pilot | 34-36m pilot (remaining) | Differentiation demand |
|---|---|---|---|---|
| Books / talk | Picture books with questions | Picture books with little stories | *(already done: picture story books with questions — do not re-research)* | Question-led naming vs short story arcs vs later friendship/feelings depth |
| Feelings books | Feeling stories and face books | Feeling faces and story books | Feelings and friendship books | Face naming → “my version” stories → friends / turn-taking / bigger feelings |
| Balls / social motor | Soft balls to kick and chase | Big soft ball for turn-taking | *(balance paths instead for big moves)* | Solo chase confidence vs shared turn-taking games |
| Helper / step-up | A steady step for helping | Safe step-up stool or learning tower | Visual routine cards and timers | Simple steady step vs taller supervised tower vs non-furniture routine tools |
| Hands / making | Chunky puzzles and shape sorters | Chunky crayons and big paper | Threading beads and chunky lacing | Fitting/matching → mark-making → fine threading (3y safety) |
| Pretend | Play kitchen and household props | Soft doll or teddy care play | *(already done: small-world figures — do not re-research)* | Household role play vs care/comfort pretend |
| Big movement | Soft balls… | Hoops, beanbags and jump markers | Balance paths and stepping stones | Chase → deliberate jump/aim games → balance path challenge |

### Already researched for 34-36m — do not re-research

- Picture story books with questions (`cat_picture_story_books`)
- Small-world people and vehicles (`cat_small_world_figures`)
- First jigsaw puzzles (`cat_jigsaw_puzzles`)

If you notice a strong product that belongs in one of those completed categories, leave it out of this queue (or mention it only as a cross-band substitute note). Do not produce duplicate JSON files for those three.

## Quality bar

Use web research. Prefer primary or strong sources:

- Retailer product pages for availability, price, variants, ratings, and review counts
- Brand/manufacturer pages for specs, age guidance, safety warnings, materials, and dimensions
- Official/safety sources where relevant (NHS, GOV.UK, RoSPA, CAPT, ERIC, Lullaby Trust, product safety alerts)
- Editorial roundups only as supporting evidence, not as the only proof
- Community evidence (Mumsnet, Netmums, Reddit UKParenting, retailer review themes) for parent reality — do not over-weight anecdote

Strong retail proof means at least one of:

- Rating >= 4.4 with >= 50 reviews on a reputable UK retailer
- Multi-source proof (retailer + brand, retailer + editorial, retailer + community)
- Specialist/official proof where mass reviews are less appropriate

Hidden gems can enter Top Picks only if rating >= 4.5 with >= 20 reviews, **or** strong specialist/editorial support plus a clear reason they beat mainstream options for this Stage 2 objective.

Avoid:

- Wrong age band, too babyish, or likely-to-frustrate advanced products
- Unsafe / recalled / unclear age warnings
- Unknown-history second-hand car seats or other `new_only` categories sold as pre-loved
- Temu, AliExpress, unverified marketplace-only brands, counterfeit-risk listings
- Near-duplicates across the Top Picks set
- Products that are not meaningfully different from what you would recommend one band earlier

## Ember copy requirements (Conor bar)

Tone: smart UK parent friend. Warm, calm, specific, not salesy. No textbook jargon. No toy-ad hype.

Banned in public copy: magic, win, unlock, optimise, essential, must-have, developmental domain, “research shows”, vague leap language.

For every Top Pick include:

- `best_for_tag`: **must** start with `Best for` and name a parent/child situation in 6 words or fewer after the prefix (e.g. `Best for small spaces`, `Best for borrowing first`). Not a feature list. Not ALL CAPS.
- `product_description_under_30_words`: factual description of what it is
- `ember_verdict`: why it fits this Stage 1 + Stage 2 + age band now; who should skip / borrow / hold off
- `personalization_hint`: short child-pattern hint without a real child name (e.g. `likely to be asking what happens next in familiar stories`)
- `buy_borrow_hold_off`: one of `buy | borrow | bring_back_out | hold_off | buy_pre_loved | buy_new_only`
- Honest `evidence_tier`: `strong | good | emerging | weak | reject`
- `founder_qa_flag` when needed: `none | check_url | check_price | check_safety | check_age_fit | check_stock | check_claim`

Safety-sensitive categories in this queue (extra care):

- Potty / toilet practice
- Step stools / learning towers
- Threading beads / small parts (34-36m)
- Balance paths / stepping stones
- Water play pouring cups

Never invent safety guidance. If unclear, downgrade confidence and flag founder QA.

## Required output files

Return a bundle containing:

### Per category (19 × 3 files)

- `ember_picks_{age_band_token}_{category_entity_id}.json`
- `ember_picks_{age_band_token}_{category_entity_id}.csv`
- `ember_picks_{age_band_token}_{category_entity_id}_summary.md`

Use the exact `stage3_research_input_filename` values from the queue CSV (JSON basename). Age band tokens are `28-30m`, `31-33m`, `34-36m`.

### Bundle manifests

- `stage3_research_manifest_28-36m.json`
- `stage3_research_manifest_28-36m.md`

Also include per-band rollups if useful:

- `stage3_research_manifest_28-30m.json` / `.md`
- `stage3_research_manifest_31-33m.json` / `.md`
- `stage3_research_manifest_34-36m.json` / `.md`

Local ingestion targets when handed back:

- `agent-tools/exports/stage3/28-30m/research/`
- `agent-tools/exports/stage3/31-33m/research/`
- `agent-tools/exports/stage3/34-36m/research/`

## Canonical JSON schema (`ember_picks_research_v2`)

Each per-category JSON file must follow this shape:

```json
{
  "schema_version": "ember_picks_research_v2",
  "research_date": "YYYY-MM-DD",
  "researcher": "manus",
  "currency": "GBP",
  "market": "UK",
  "brief_id": "{age_band_token}_{category_entity_id}",
  "age_band_id": "28-30m | 31-33m | 34-36m",
  "age_band_id_spine": "age_28_30m | age_31_33m | age_34_36m",
  "age_band_label": "",
  "min_months": 0,
  "max_months": 0,
  "child_stage_plain_english": "",
  "category_entity_id": "",
  "category_label": "",
  "cluster_entity_id": "",
  "cluster_label": "",
  "audience_lens": "",
  "content_type": "product_category",
  "buyer_mode_label": "",
  "gift_friendly": true,
  "show_gift_action": true,
  "marketplace_policy_class": "",
  "safe_use_note_required": false,
  "educational_objective": "",
  "age_stage_nuance": "",
  "what_to_look_for": "",
  "what_to_avoid": "",
  "methodology": "2-6 sentences explaining search, filter, verification and ranking method.",
  "source_mix_summary": {
    "retailers_checked": [],
    "brand_sites_checked": [],
    "editorial_sources_checked": [],
    "community_sources_checked": [],
    "safety_sources_checked": [],
    "preloved_sources_checked": []
  },
  "top_picks": [],
  "longlist": [],
  "skips": [],
  "guidance_notes": [],
  "qa_summary": {
    "json_parse_check": "pass | fail",
    "top_5_count_check": "pass | fail | not_applicable",
    "longlist_15_count_check": "pass | fail | not_applicable",
    "url_check": "pass | partial | fail | not_applicable",
    "date_format_check": "pass | fail",
    "stage_fit_check": "pass | partial | fail",
    "safety_check": "pass | partial | fail | not_applicable",
    "rating_threshold_check": "pass | partial | fail | not_applicable",
    "source_mix_check": "pass | partial | fail",
    "notes": ""
  },
  "ingestion_ready": {
    "status": "production-ready | founder-review-ready | not-ready",
    "expected_stage2_mapping": {
      "age_band_id": "",
      "category_entity_id": "",
      "category_type_slug": "",
      "stage_2_card_label": ""
    },
    "locked_from_rank": 2,
    "top_picks_card_ready": true,
    "backups_card_ready": false,
    "required_fix_before_ingestion": [],
    "founder_review_notes": ""
  }
}
```

Each Top Pick object must include at least:

```json
{
  "rank": 1,
  "status": "pick",
  "longlist_rank": 1,
  "best_for_tag": "Best for...",
  "product_name": "",
  "brand": "",
  "retailer": "",
  "product_url": "https://...",
  "alternate_urls": [],
  "image_url": "",
  "url_checked_date": "YYYY-MM-DD",
  "stock_status": "in_stock | low_stock | out_of_stock | preorder | unknown",
  "price_amount": 0.0,
  "price_text": "£0.00",
  "currency": "GBP",
  "price_checked_date": "YYYY-MM-DD",
  "age_mark_on_listing": "",
  "key_specs": {},
  "product_description_under_30_words": "",
  "ember_verdict": "",
  "personalization_hint": "",
  "why_it_fits": "",
  "caveats": "",
  "buy_borrow_hold_off": "buy | borrow | bring_back_out | hold_off | buy_pre_loved | buy_new_only",
  "gift_suitable": true,
  "gift_note": "",
  "ownership_note": "",
  "safety_notes": "",
  "rating_value": 0.0,
  "rating_count": 0,
  "rating_source": "",
  "review_quality_note": "",
  "evidence_tier": "strong | good | emerging | weak | reject",
  "evidence_sources": [],
  "preloved_suitability": "good | possible | avoid | new_only | unknown",
  "preloved_signal_note": "",
  "substitute_if_unavailable": "",
  "founder_qa_flag": "none | check_url | check_price | check_safety | check_age_fit | check_stock | check_claim",
  "display_status": "visible",
  "public_rank": 1,
  "locked_for_non_members": false,
  "evidence_notes": ""
}
```

## CSV header (per category)

```text
schema_version,research_date,researcher,age_band_id,age_band_id_spine,category_entity_id,category_label,cluster_label,content_type,status,rank,longlist_rank,top_pick_rank,best_for_tag,product_name,brand,retailer,product_url,alternate_urls,image_url,url_checked_date,stock_status,price_amount,price_text,currency,price_checked_date,age_mark_on_listing,key_specs,product_description_under_30_words,ember_verdict,personalization_hint,why_it_fits,caveats,buy_borrow_hold_off,gift_suitable,gift_note,ownership_note,safety_notes,rating_value,rating_count,rating_source,review_quality_note,evidence_tier,evidence_sources,preloved_suitability,preloved_signal_note,substitute_if_unavailable,founder_qa_flag,skip_reason,evidence_notes
```

## Per-category summary Markdown

For each category, write:

1. `# Pip’s Picks: {stage_2_card_label} ({age_band_label})`
2. `## Educational shift`
3. `## Top Ember Picks`
4. `## Ranked longlist summary`
5. `## Best substitutes if unavailable`
6. `## What we skipped and why`
7. `## Borrow / bring back out / hold off guidance`
8. `## Cross-band differentiation note` (what would change one band earlier/later)
9. `## QA concerns before import`

## Compact research queue (founder view)

### 28-30m

1. I’m telling little stories → **Picture books with questions** (`cat_picture_story_books`)
2. I’m making pretend worlds → **Play kitchen and household props** (`cat_play_kitchen_household_props`)
3. My hands can solve more now → **Chunky puzzles and shape sorters** (`cat_shape_sorters_puzzles`)
4. I’m getting braver with my body → **Soft balls to kick and chase** (`cat_soft_graspable_balls`)
5. I’m learning feelings and turn-taking → **Feeling stories and face books** (`cat_feelings_faces_books`)
6. I want to do it myself → **A steady step for helping** (`cat_step_stool`) — Parent buy
7. I’m noticing bathroom routines → **A potty to practise sitting** (`cat_potty`) — Parent buy

### 31-33m

1. I’m asking what happens next → **Picture books with little stories** (`cat_picture_books_with_little_stories`)
2. I’m telling you my version → **Feeling faces and story books** (`cat_feeling_faces_and_story_books`)
3. I’m making pretend worlds bigger → **Soft doll or teddy care play** (`cat_soft_doll_or_teddy_care_play`)
4. I’m learning how other people play → **Big soft ball for turn-taking** (`cat_big_soft_ball_for_turn_taking`)
5. I want a real job to do → **Safe step-up stool or learning tower** (`cat_safe_step_up_stool_or_learning_tower`)
6. My hands can make more now → **Chunky crayons and big paper** (`cat_chunky_crayons_and_big_paper`)
7. I’m testing balance and bravery → **Hoops, beanbags and jump markers** (`cat_hoops_beanbags_and_jump_markers`)
8. I’m experimenting with water and colour → **Pouring cups and water lab** (`cat_pouring_cups_and_water_lab`)

### 34-36m remaining

1. Feelings, friends and turn-taking → **Feelings and friendship books** (`cat_feelings_faces_books`)
2. Threading, snipping, drawing and dressing hands → **Threading beads and chunky lacing** (`cat_threading_beads`) — small-parts QA
3. Pedalling, jumping, balancing and ball play → **Balance paths and stepping stones** (`cat_balance_stepping_stones`)
4. Real jobs, routines and self-care → **Visual routine cards and timers** (`cat_visual_routine_cards`) — Parent buy utility, not gift

## Full research queue CSV (source of truth)

Use these rows as the exact research queue. Fill `educational_objective`, ownership/gift/safety notes, and Stage 1 why-text from this CSV into each JSON.

```csv
age_band_token,age_band_id_spine,age_band_label,min_months,max_months,child_stage_plain_english,cluster_rank,cluster_entity_id,cluster_label,cluster_why_it_matters_short,cluster_why_it_matters_long,category_rank,category_entity_id,category_type_slug,category_label,mapping_rationale,educational_objective,age_stage_nuance,audience_lens,ui_lane,buyer_mode_label,buy_borrow_bring_back_out,primary_persona,gift_friendly,show_gift_action,gift_confidence,gift_note,ownership_note,safety_note_public,product_family_label,common_ownership_risk,priority_score,evidence_ids,source_ids,evidence_count,source_count,stage3_research_input_filename,stage3_ingestion_bundle_hint,discover_route_hint,reason_selected
28-30m,age_28_30m,28-30 months,28,30,nearly two and a half,1,ent_cluster_talk_stories_questions,I’m telling little stories,"For questions, book naming, action words and early explanations.","Around 28-30 months, your toddler may use more two-word phrases, name things in books and ask or answer simple questions. Picture books, everyday choices and small stories give them a reason to link words together without turning talk into a test.",1,cat_picture_story_books,cat_picture_story_books,Picture books with questions,"Mapped to I’m telling little stories because the evidence supports talk, stories and little questions at 28-30m.","Mapped to I’m telling little stories because the evidence supports talk, stories and little questions at 28-30m.",What is different at 28-30 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,"Buy, borrow or reuse if age-fit and in safe condition.",both,true,true,high,A strong gift if the family enjoys books. Look for sturdy pages and familiar scenes.,"If you already have lots of board books, choose ones with clearer stories or more to talk about.",,First picture and story books,medium,48.35,ev_0005;ev_0014;ev_0026;ev_0054,src_001;src_003;src_014,4,3,ember_picks_28-30m_cat_picture_story_books.json,stage3_ingestion_bundle_28-30m.json,/discover/29,Top eligible in cluster; 4 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−)
28-30m,age_28_30m,28-30 months,28,30,nearly two and a half,2,ent_cluster_pretend_helper_play,I’m making pretend worlds,"For tea parties, helper jobs, little figures and role play.","Pretend play can shift from copying one action to running a tiny scene: teddy is tired, the train goes to the shop, or everyone gets tea. Simple props give language, memory and feelings somewhere to go.",1,cat_play_kitchen_household_props,cat_play_kitchen_household_props,Play kitchen and household props,Mapped to I’m making pretend worlds because the evidence supports pretend worlds and helper play at 28-30m.,Mapped to I’m making pretend worlds because the evidence supports pretend worlds and helper play at 28-30m.,What is different at 28-30 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,"Buy, borrow or reuse if age-fit and in safe condition.",both,true,true,high,A strong gift if there is space and the family does not already have one.,"If space is tight, a small tea set or pan-and-spoon basket can do the same job.",,Play kitchens and household props,medium,50.7,ev_0007;ev_0022;ev_0051;ev_0055;ev_0056,src_001;src_003;src_014;src_015,5,4,ember_picks_28-30m_cat_play_kitchen_household_props.json,stage3_ingestion_bundle_28-30m.json,/discover/29,Top eligible in cluster; 5 evidence id(s); 4 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−)
28-30m,age_28_30m,28-30 months,28,30,nearly two and a half,3,ent_cluster_busy_hands_puzzles,My hands can solve more now,"For twists, pegs, colours, first puzzles and careful fingers.","Small-hand play is getting more purposeful: twisting, fitting, matching, stacking, peeling and trying again. The useful challenge is not perfection, but giving hands and eyes a clear problem that can be repeated.",1,cat_shape_sorters_puzzles,cat_shape_sorters_puzzles,Chunky puzzles and shape sorters,"Mapped to My hands can solve more now because the evidence supports busy hands, colours and little puzzles at 28-30m.","Mapped to My hands can solve more now because the evidence supports busy hands, colours and little puzzles at 28-30m.",What is different at 28-30 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,"Buy, borrow or reuse if age-fit and in safe condition.",both,true,true,high,"A safe, classic gift when pieces are large and age-fit.","If they already have easy puzzles, look for one extra step: pegs, colour sorting or animals.",,Chunky puzzles and shape sorters,medium,50.55,ev_0018;ev_0020;ev_0050;ev_0056;ev_0058,src_001;src_002;src_014;src_015;src_016,5,5,ember_picks_28-30m_cat_shape_sorters_puzzles.json,stage3_ingestion_bundle_28-30m.json,/discover/29,Top eligible in cluster; 5 evidence id(s); 5 source id(s); persona both; gift bonus 3.5; Good gift; has product family; medium ownership risk (−)
28-30m,age_28_30m,28-30 months,28,30,nearly two and a half,4,ent_cluster_big_movement,I’m getting braver with my body,"For jumping, climbing, scooting, kicking and carrying.","This is an age for bigger body experiments: jumping with two feet, climbing, pushing, kicking, carrying and testing speed. Good ideas give movement a job while keeping the safety setup visible.",2,cat_soft_graspable_balls,cat_soft_graspable_balls,Soft balls to kick and chase,"Mapped to I’m getting braver with my body because the evidence supports running, jumping and outdoor confidence at 28-30m.","Mapped to I’m getting braver with my body because the evidence supports running, jumping and outdoor confidence at 28-30m.",What is different at 28-30 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,"Buy, borrow or reuse if age-fit and in safe condition.",thea,true,true,high,A simple gift that works indoors or outdoors.,"If the family has balls already, this is about giving movement a job, not adding duplicates.",,Soft balls for kicking and chasing,low,41.15,ev_0019;ev_0028;ev_0036,src_002;src_003;src_008,3,3,ember_picks_28-30m_cat_soft_graspable_balls.json,stage3_ingestion_bundle_28-30m.json,/discover/29,Top eligible in cluster; 3 evidence id(s); 3 source id(s); Thea gift lane; gift bonus 5; Good gift; has product family
28-30m,age_28_30m,28-30 months,28,30,nearly two and a half,5,ent_cluster_feelings_turn_taking,I’m learning feelings and turn-taking,"For big feelings, tiny turns, waiting and playing near others.","Your toddler may want to be with other children but still find sharing hard. Feelings books, puppets, simple turns and gentle scripts help them practise social skills without expecting preschool-level patience.",1,cat_feelings_faces_books,cat_feelings_faces_books,Feeling stories and face books,"Mapped to I’m learning feelings and turn-taking because the evidence supports feelings, limits and playing with others at 28-30m.","Mapped to I’m learning feelings and turn-taking because the evidence supports feelings, limits and playing with others at 28-30m.",What is different at 28-30 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,"Buy, borrow or reuse if age-fit and in safe condition.",thea,true,true,high,A thoughtful gift for a child with big feelings or a new sibling.,Pick gentle stories rather than moral lessons.,,Feelings and face books,low,41.5,ev_0032;ev_0053;ev_0054,src_006;src_014,3,2,ember_picks_28-30m_cat_feelings_faces_books.json,stage3_ingestion_bundle_28-30m.json,/discover/29,Top eligible in cluster; 3 evidence id(s); 2 source id(s); Thea gift lane; gift bonus 5; Good gift; has product family
28-30m,age_28_30m,28-30 months,28,30,nearly two and a half,6,ent_cluster_independence_practice,I want to do it myself,"For helping, choosing, dressing, handwashing and little jobs.","Independence can become louder at this stage. Small, safe jobs at the sink, table, coat peg or tidy-up basket let your toddler practise doing things for themselves while the adult keeps the boundaries.",1,cat_step_stool,cat_step_stool,A steady step for helping,Mapped to I want to do it myself because the evidence supports i want to do it myself at 28-30m.,Mapped to I want to do it myself because the evidence supports i want to do it myself at 28-30m.,What is different at 28-30 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Parent buy,"Buy, borrow or reuse if age-fit and in safe condition.",conor,false,false,,,"Supervise step use and keep away from hot, sharp or unstable surfaces.",Use a stable stool with supervision.,Toddler step stools,,42.35,ev_0008;ev_0022;ev_0045,src_001;src_003;src_012,3,3,ember_picks_28-30m_cat_step_stool.json,stage3_ingestion_bundle_28-30m.json,/discover/29,Top eligible in cluster; 3 evidence id(s); 3 source id(s); Conor parent buy; Parent buy; has product family
28-30m,age_28_30m,28-30 months,28,30,nearly two and a half,7,ent_cluster_potty_toilet_practice,I’m noticing bathroom routines,"For potty signs, easy clothes, handwashing and calm practice.","Some children around 28-30 months are ready for more potty independence; others are still watching, naming and practising the steps. The useful angle is readiness, relaxed repetition and clothing that makes small wins possible.",1,cat_potty,cat_potty,A potty to practise sitting,Mapped to I’m noticing bathroom routines because the evidence supports potty signs and toilet practice at 28-30m.,Mapped to I’m noticing bathroom routines because the evidence supports potty signs and toilet practice at 28-30m.,What is different at 28-30 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Parent buy,"Buy, borrow or reuse if age-fit and in safe condition.",conor,false,false,,,"This is a parent buy, not a default gift.",,Simple potties,,41.2,ev_0037;ev_0038;ev_0026,src_009;src_003,3,2,ember_picks_28-30m_cat_potty.json,stage3_ingestion_bundle_28-30m.json,/discover/29,Top eligible in cluster; 3 evidence id(s); 2 source id(s); Conor parent buy; Parent buy; has product family
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,1,ent_cluster_asking_what_happens_next,I’m asking what happens next,"For questions, little sequences and early problem-solving.","Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.",4,cat_picture_books_with_little_stories,cat_picture_books_with_little_stories,Picture books with little stories,Maps 'Picture books with little stories' to the 'I’m asking what happens next' doorway using current 31–33m evidence.,Maps 'Picture books with little stories' to the 'I’m asking what happens next' doorway using current 31–33m evidence.,What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,high,Thoughtful if age-fit and not already owned.,"High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.",,Picture books with little stories,high,41.6,ev_0005;ev_0014;ev_0016;ev_0031;ev_0038,src_cdc_30m;src_nhs_best_start_2_3;src_cambs_3y_milestones,5,3,ember_picks_31-33m_cat_picture_books_with_little_stories.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 5 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; has product family; high ownership risk (−)
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,2,ent_cluster_telling_my_version,I’m telling you my version,"For longer little sentences, retelling and feelings words.","Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.",4,cat_feeling_faces_and_story_books,cat_feeling_faces_and_story_books,Feeling faces and story books,Maps 'Feeling faces and story books' to the 'I’m telling you my version' doorway using current 31–33m evidence.,Maps 'Feeling faces and story books' to the 'I’m telling you my version' doorway using current 31–33m evidence.,What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,high,Thoughtful if age-fit and not already owned.,"High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.",,Feeling faces and story books,high,40.95,ev_0006;ev_0031;ev_0035;ev_0039,src_cdc_30m;src_nhs_best_start_2_3;src_zero_to_three_24_36;src_cambs_3y_milestones,4,4,ember_picks_31-33m_cat_feeling_faces_and_story_books.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 4 evidence id(s); 4 source id(s); persona both; gift bonus 3.5; has product family; high ownership risk (−)
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,3,ent_cluster_pretend_worlds_bigger,I’m making pretend worlds bigger,"For richer role play, dolls, food, vehicles and stories.","Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.",4,cat_soft_doll_or_teddy_care_play,cat_soft_doll_or_teddy_care_play,Soft doll or teddy care play,Maps 'Soft doll or teddy care play' to the 'I’m making pretend worlds bigger' doorway using current 31–33m evidence.,Maps 'Soft doll or teddy care play' to the 'I’m making pretend worlds bigger' doorway using current 31–33m evidence.,What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,medium,Thoughtful if age-fit and not already owned.,"High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.",,Soft doll or teddy care play,high,41.3,ev_0007;ev_0029;ev_0033;ev_0034;ev_0035;ev_0059,src_cdc_30m;src_nhs_best_start_2_3;src_zero_to_three_24_36;src_mumsnet_2_3_toys_potty,6,4,ember_picks_31-33m_cat_soft_doll_or_teddy_care_play.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 6 evidence id(s); 4 source id(s); persona both; gift bonus 2.5; has product family; high ownership risk (−)
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,4,ent_cluster_playing_with_people,I’m learning how other people play,"For turn-taking, waiting, sharing and peer play.","Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.",4,cat_big_soft_ball_for_turn_taking,cat_big_soft_ball_for_turn_taking,Big soft ball for turn-taking,Maps 'Big soft ball for turn-taking' to the 'I’m learning how other people play' doorway using current 31–33m evidence.,Maps 'Big soft ball for turn-taking' to the 'I’m learning how other people play' doorway using current 31–33m evidence.,What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,high,Thoughtful if age-fit and not already owned.,"High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.",,Big soft ball for turn-taking,high,37.15,ev_0024;ev_0037;ev_0039,src_cdc_30m;src_cambs_3y_milestones,3,2,ember_picks_31-33m_cat_big_soft_ball_for_turn_taking.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 3 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; has product family; high ownership risk (−)
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,5,ent_cluster_real_job_to_do,I want a real job to do,"For helping, routines, dressing and practical independence.","The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.",4,cat_safe_step_up_stool_or_learning_tower,cat_safe_step_up_stool_or_learning_tower,Safe step-up stool or learning tower,Maps 'Safe step-up stool or learning tower' to the 'I want a real job to do' doorway using current 31–33m evidence.,Maps 'Safe step-up stool or learning tower' to the 'I want a real job to do' doorway using current 31–33m evidence.,What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,high,Thoughtful if age-fit and not already owned.,Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.,,Safe step-up stool or learning tower,medium,40.25,ev_0008;ev_0026;ev_0028;ev_0054,src_cdc_30m;src_nhs_best_start_2_3;src_eric_potty_training,4,3,ember_picks_31-33m_cat_safe_step_up_stool_or_learning_tower.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 4 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; has product family; medium ownership risk (−)
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,6,ent_cluster_hands_make_more,My hands can make more now,"For drawing, twisting, threading, puzzles and making.","Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.",4,cat_chunky_crayons_and_big_paper,cat_chunky_crayons_and_big_paper,Chunky crayons and big paper,Maps 'Chunky crayons and big paper' to the 'My hands can make more now' doorway using current 31–33m evidence.,Maps 'Chunky crayons and big paper' to the 'My hands can make more now' doorway using current 31–33m evidence.,What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,medium,Thoughtful if age-fit and not already owned.,"High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.",,Chunky crayons and big paper,high,38.35,ev_0010;ev_0018;ev_0039;ev_0060,src_cdc_30m;src_cambs_3y_milestones;src_mumsnet_2_3_toys_potty,4,3,ember_picks_31-33m_cat_chunky_crayons_and_big_paper.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 4 evidence id(s); 3 source id(s); persona both; gift bonus 2.5; has product family; high ownership risk (−)
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,7,ent_cluster_balance_bravery,I’m testing balance and bravery,"For jumping, climbing, kicking, aiming and bigger movement.","Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.",4,cat_hoops_beanbags_and_jump_markers,cat_hoops_beanbags_and_jump_markers,"Hoops, beanbags and jump markers","Maps 'Hoops, beanbags and jump markers' to the 'I’m testing balance and bravery' doorway using current 31–33m evidence.","Maps 'Hoops, beanbags and jump markers' to the 'I’m testing balance and bravery' doorway using current 31–33m evidence.",What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,high,Thoughtful if age-fit and not already owned.,Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.,,"Hoops, beanbags and jump markers",medium,37.45,ev_0013;ev_0025;ev_0046,src_cdc_30m;src_lovevery_researcher_31_33,3,2,ember_picks_31-33m_cat_hoops_beanbags_and_jump_markers.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 3 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; has product family; medium ownership risk (−)
31-33m,age_31_33m,31-33 months,31,33,just past two and a half,8,ent_cluster_water_colour_mess,I’m experimenting with water and colour,"For pouring, painting, dough, sand, water and messy control.","Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.",4,cat_pouring_cups_and_water_lab,cat_pouring_cups_and_water_lab,Pouring cups and water lab,Maps 'Pouring cups and water lab' to the 'I’m experimenting with water and colour' doorway using current 31–33m evidence.,Maps 'Pouring cups and water lab' to the 'I’m experimenting with water and colour' doorway using current 31–33m evidence.,What is different at 31-33 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Gift idea,,both,true,true,high,Thoughtful if age-fit and not already owned.,Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.,Use only with close adult supervision around water.,Pouring cups and water lab,medium,37.3,ev_0039;ev_0043;ev_0048,src_cambs_3y_milestones;src_lovevery_researcher_31_33,3,2,ember_picks_31-33m_cat_pouring_cups_and_water_lab.json,stage3_ingestion_bundle_31-33m.json,/discover/32,Top eligible in cluster; 3 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; has product family; medium ownership risk (−)
34-36m,age_34_36m,34-36 months,34,36,nearly three,4,ent_cluster_feelings_turn_taking,"Feelings, friends and turn-taking","Friend play is still messy, but words can help.","Friend play may still be messy, but your child can start using words, waiting a little longer and noticing feelings. Small games and stories make rules feel concrete before real play gets heated.",2,cat_feelings_faces_books,cat_feelings_faces_books,Feelings and friendship books,"Fits feelings, friends and turn-taking because the evidence points to this stage-specific behaviour.","Fits feelings, friends and turn-taking because the evidence points to this stage-specific behaviour.",What is different at 34-36 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,Buy or borrow,both,true,true,high,A thoughtful gift that feels useful without becoming a lecture.,"Choose warm, specific stories rather than abstract emotion labels.",,Feelings and friendship books,low,45.65,ev_0031;ev_0041;ev_0073,src_cdc_preschool_tips;src_rcn_3_4;src_lovevery_book_bundle,3,3,ember_picks_34-36m_cat_feelings_faces_books.json,stage3_ingestion_bundle_34-36m.json,/discover/35,Top eligible in cluster; 3 evidence id(s); 3 source id(s); persona both; gift bonus 3.5; Good gift; has product family
34-36m,age_34_36m,34-36 months,34,36,nearly three,5,ent_cluster_busy_hands_making_marks,"Threading, snipping, drawing and dressing hands","Small hands may want smaller, neater challenges.","Hands that once grabbed and scribbled may now thread, snip, press, button, zip and copy simple shapes. The useful toys are still simple, but the challenge can be smaller, neater and more controlled.",1,cat_threading_beads,cat_threading_beads,Threading beads and chunky lacing,"Fits threading, snipping, drawing and dressing hands because the evidence points to this stage-specific behaviour.","Fits threading, snipping, drawing and dressing hands because the evidence points to this stage-specific behaviour.",What is different at 34-36 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,Buy or borrow,both,true,true,high,A useful small gift if the pieces are large and age-marked.,Avoid tiny beads; start with chunky lacing or pasta threading.,"Use large pieces and supervise, especially around younger siblings.",Threading and lacing sets,low,44.5,ev_0006;ev_0054,src_cdc_3y;src_zero_to_three_imagination,2,2,ember_picks_34-36m_cat_threading_beads.json,stage3_ingestion_bundle_34-36m.json,/discover/35,Top eligible in cluster; 2 evidence id(s); 2 source id(s); persona both; gift bonus 3.5; Good gift; has product family
34-36m,age_34_36m,34-36 months,34,36,nearly three,6,ent_cluster_jumping_balance_big_moves,"Pedalling, jumping, balancing and ball play",Movement can become more planned and rule-based.,"Movement can become more planned now: pedalling, balancing, kicking, catching, jumping, stopping and starting. The goal is not daredevil play; it is safe practice with rule-based movement.",2,cat_balance_stepping_stones,cat_balance_stepping_stones,Balance paths and stepping stones,"Fits pedalling, jumping, balancing and ball play because the evidence points to this stage-specific behaviour.","Fits pedalling, jumping, balancing and ball play because the evidence points to this stage-specific behaviour.",What is different at 34-36 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Good gift,Buy or borrow,both,true,true,medium_high,Good if the family has space and wants active indoor play.,Try cushions or tape first; buy if a sturdier setup would help.,,Balance paths and stepping stones,low,40.85,ev_0048;ev_0033,src_rcn_3_4;src_cdc_preschool_tips,2,2,ember_picks_34-36m_cat_balance_stepping_stones.json,stage3_ingestion_bundle_34-36m.json,/discover/35,Top eligible in cluster; 2 evidence id(s); 2 source id(s); persona both; gift bonus 1.5; Good gift; has product family
34-36m,age_34_36m,34-36 months,34,36,nearly three,7,ent_cluster_little_helper_independence,"Real jobs, routines and self-care",Little jobs can feel genuinely important now.,"Your nearly-three-year-old may want the job to be real: choose the clothes, help with snack, pour water, find shoes, wash hands, carry the bag. A small setup can make independence easier to live with.",1,cat_visual_routine_cards,cat_visual_routine_cards,Visual routine cards and timers,"Fits real jobs, routines and self-care because the evidence points to this stage-specific behaviour.","Fits real jobs, routines and self-care because the evidence points to this stage-specific behaviour.",What is different at 34-36 months versus the neighbouring toddler bands.,for_your_child,things_that_can_help,Parent buy,Parent setup,conor,false,false,not_applicable,,Try photos of your real routine first; buy cards only if they make life easier.,,Visual routine cards and timers,low,42.2,ev_0016;ev_0062;ev_0074,src_cdc_3y;src_eyfs_parent_guide;src_lovevery_book_bundle,3,3,ember_picks_34-36m_cat_visual_routine_cards.json,stage3_ingestion_bundle_34-36m.json,/discover/35,Top eligible in cluster; 3 evidence id(s); 3 source id(s); Conor parent buy; Parent buy; has product family
```

## Final response format

When finished, return:

1. A compact summary of any categories where you could not meet the exact quality bar
2. A short **cross-band differentiation memo** (what deliberately changed across 28-30 / 31-33 / 34-36 for overlapping families)
3. The manifest files
4. All per-category JSON, CSV, and summary MD files
5. A note listing any product URLs that are Google Shopping fallbacks rather than verified direct links
