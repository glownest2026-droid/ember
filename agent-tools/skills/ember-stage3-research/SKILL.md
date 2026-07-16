---
name: ember-stage3-research
description: Run or prepare Ember Stage 3 product research for any Stage 2 card, producing evidence-backed Top 5 picks, longlist, skips, and structured JSON/CSV outputs.
---

# Ember Stage 3 Research Skill

## Purpose

Use this Skill to run or prepare Ember Stage 3 research for any Stage 2 card, in any age band.

Stage 3 research turns an Ember educational/category brief into a ranked, evidence-backed recommendation set. It is designed for Ember’s product model: stage-aware guidance, useful shortlists, buying judgement, safety awareness, gift suitability, and circularity.

The Skill is tool-agnostic. It can be executed by ChatGPT with browsing, Manus, Cursor, a human researcher, or any other research agent. The tool is less important than the workflow, evidence standards, output schema, and QA gates.

---

## Use this Skill when

The founder says something like:

- “Run the Stage 3 research for product category XXX, based on this educational brief: XX.”
- “Create Pip’s Picks for this Stage 2 card.”
- “Find the best products for this Ember category.”
- “Turn this Stage 2 card into a ranked product shortlist.”
- “Research the underlying product picks for this category.”
- “Prepare a Stage 3 research brief for another tool.”

Do not use this Skill for broad Stage 1/Stage 2 content generation. Use it only once the Stage 2 card or educational brief exists.

---

## Modes

### Mode A — Run research now

Use when live web/research tools are available and the user wants the research completed.

Output a founder-readable assessment plus files where possible:

1. `ember_picks_{age_band_id}_{category_entity_id}.json`
2. `ember_picks_{age_band_id}_{category_entity_id}.csv`
3. `ember_picks_{age_band_id}_{category_entity_id}_summary.md`

### Mode B — Generate a research brief

Use when the user wants to hand off the work to Manus, Cursor, another agent, or a human researcher.

Output a ready-to-run Markdown research brief using the same inputs, workflow, evidence rules and schema.

### Mode C — QA an existing Stage 3 output

Use when the user uploads or pastes an existing Stage 3 output and asks whether it is good enough.

Assess against: source mix, educational fit, ranking quality, top-5 distinctness, review evidence, safety accuracy, URL validity, schema compliance, and MLP value.

---

## Core principle

Do not produce “five popular products”. Produce a small, stage-aware decision layer that a tired UK parent could not get from a generic retailer page.

A strong Ember Pick explains:

- why this item or option fits this age moment;
- what is different from earlier age bands;
- who it is best for;
- who should skip it;
- whether to buy, borrow, bring back out, buy pre-loved, buy new only, or hold off;
- what safety, size, frustration, ownership, availability, and quality caveats matter.

---

## Required inputs

If the user gives a complete educational brief in the message, use it directly. If the user references an Ember Bible workbook or discover projection row, extract the variables from there.

If a value is missing but can be inferred safely from the brief, infer it and mark it as inferred in the founder summary. If the age band, Stage 2 card, or educational objective is missing and cannot be inferred, ask one concise clarification question.

| Variable | Meaning | Preferred source |
|---|---|---|
| `research_date` | Date research is completed | Today’s date, in `YYYY-MM-DD` |
| `researcher` | Research executor | `chatgpt`, `manus`, `cursor`, `human`, or relevant tool name |
| `market` | Target market | Usually `UK` |
| `currency` | Currency | Usually `GBP` |
| `brief_id` | Unique research brief ID | `{age_band_id}_{category_entity_id}` |
| `age_band_id` | Repo/app age-band ID | Workbook filename or repo convention, e.g. `34-36m` |
| `age_band_id_spine` | Spine age-band ID | `age_band_id` in Ember Bible `discover_projection` |
| `age_band_label` | Parent-facing age label | `age_band_meta` or inferred from age band |
| `min_months` | Start month | `age_band_meta` or inferred from age band |
| `max_months` | End month | `age_band_meta` or inferred from age band |
| `child_stage_plain_english` | Human shorthand for the stage | Founder brief, e.g. `nearly three` |
| `stage_1_card_label` | Parent-facing Stage 1 card | `cluster_label_parent_friendly` or `cluster_label` from `discover_projection` |
| `stage_1_cluster_entity_id` | Stage 1 entity ID | `cluster_entity_id` from `discover_projection` |
| `stage_1_why_short` | Short Stage 1 rationale | `cluster_why_it_matters_short` or equivalent |
| `stage_1_why_long` | Long Stage 1 rationale | `cluster_why_it_matters_long` or equivalent |
| `stage_2_card_label` | Stage 2 category label | `category_label` from `discover_projection` |
| `category_entity_id` | Stage 2 category ID | `category_entity_id` from `discover_projection` |
| `category_rank` | Stage 2 rank/order | `category_rank` from `discover_projection` |
| `educational_objective` | What this Stage 2 card is trying to help | `mapping_rationale`, `why_it_matters_long`, founder brief, or Stage 3 brief |
| `age_stage_nuance` | What is different at this age | `lifecycle_timing`, prior age band comparison, founder brief, or research notes |
| `what_to_look_for` | Positive selection criteria | Derived from objective, product family, buyer mode, safety notes |
| `what_to_avoid` | Exclusion criteria | Derived from safety notes, age fit, ownership note, known pitfalls |
| `audience_lens` | `for_them`, `for_you`, or `both` | `audience_lens` from `discover_projection` |
| `content_type` | Product/activity/setup/safety category | `content_type` from `discover_projection` |
| `ui_lane` | Where the card appears in UI | `ui_lane` from `discover_projection` |
| `buyer_mode_label` | Buying role | `buyer_mode_label` from `discover_projection` |
| `buy_borrow_bring_back_out` | Commerce judgement | `buy_borrow_bring_back_out` from `discover_projection` |
| `gift_friendly` | Gift suitability | `gift_friendly` from `discover_projection` |
| `gift_note` | Gift guidance | `gift_note` from `discover_projection` |
| `ownership_note` | Duplication / already-own risk | `ownership_note` from `discover_projection` |
| `safety_note_public` | Public safety note | `safety_note_public` from `discover_projection` |
| `marketplace_policy_class` | Pre-loved/new-only/restricted class | `commerce_marketplace_rules` if available |
| `safe_use_note_required` | Whether safe-use copy is required | `commerce_marketplace_rules` or `discover_projection` |
| `show_ember_picks` | Whether product picks should be shown | `show_ember_picks` from `discover_projection` |
| `show_gift_action` | Whether gift action should appear | `show_gift_action` from `discover_projection` |
| `source_evidence_ids` | Existing source IDs behind the card | `evidence_ids` from `discover_projection`, linked evidence from Bible sheets |
| `known_good_examples` | Optional positive examples | Founder supplied |
| `known_bad_examples` | Optional exclusions | Founder supplied |
| `preferred_retailers` | Retailer preference set | Founder supplied or category default |
| `excluded_retailers_or_sources` | Sources to avoid | Founder supplied plus default exclusions |

---

## Default source strategy

Use a 360-degree source set. Do not rely only on retailer search results.

### Retailer availability and pricing

Use retailer pages to verify product URLs, price, stock, age marks, warnings, dimensions, included items, ratings and review counts.

Relevant UK sources may include Amazon UK, Argos, John Lewis, Smyths, Boots, The Entertainer, Mamas & Papas, Natural Baby Shower, Scandiborn, Kidly, JoJo Maman Bébé, Very, Waterstones, Decathlon, Halfords, IKEA, Dunelm, specialist category retailers, and brand-direct stores.

### Brand or manufacturer sources

Use brand pages for exact product name, model/version, age mark, materials, size, compatibility, warnings, parts/refills, and discontinued status.

### Parenting editorial and review sources

Use credible editorial/review sources to discover candidates and understand trade-offs. Examples: MadeForMums, Mumsnet roundups, Which?, Good Housekeeping UK, The Independent, The Telegraph, Expert Reviews, and specialist blogs with clear hands-on judgement.

Editorial mentions are discovery signals, not proof by themselves.

### Community signal

Use Mumsnet, Netmums, Reddit UKParenting, public forums, and retailer review themes for parent reality: common frustrations, durability, gift suitability, boredom, storage, cleaning, duplication risk, and “actually worth it” sentiment.

Community signal is weak evidence until verified against product facts, retailer evidence, ratings, brand credibility, and safety guidance.

### Safety and policy sources

For safety-sensitive categories, check official or specialist sources such as NHS, GOV.UK, RoSPA, Child Accident Prevention Trust, ERIC, Lullaby Trust, Product Safety Alerts, manufacturer warnings, and retailer age marks.

Never invent safety guidance. If safety evidence is unclear, downgrade confidence and flag founder QA.

### Pre-loved and circularity signal

Where relevant, check whether the category is suitable and available pre-loved via Vinted, eBay UK, Facebook Marketplace if publicly accessible, Gumtree, local resale patterns, or marketplace data.

Do not recommend pre-loved for categories marked `new_only` or `restricted`.

---

## Evidence quality thresholds

A Top 5 Ember Pick should normally meet at least one of these standards:

1. Strong retail proof: average rating `>= 4.4` with `>= 50` customer reviews on at least one reputable UK retailer.
2. Multi-source proof: credible support from at least two source types, for example retailer + brand, retailer + editorial, or retailer + community.
3. Specialist proof: a respected specialist retailer or reputable brand, clear product specs, and strong fit to the educational objective.

Hidden gems can be included, but must be labelled honestly. A hidden gem can enter Top 5 only if it has rating `>= 4.5` with at least `20` reviews, or strong specialist/editorial support, a reputable seller, and a specific reason it beats mainstream options for the Stage 2 objective.

Use these evidence tiers:

- `strong`: multiple credible sources, good review count, clear availability, clean age/safety fit.
- `good`: credible retailer/manufacturer evidence and decent reviews, with minor caveats.
- `emerging`: promising but low review count or limited source mix.
- `weak`: not enough evidence for live recommendation.
- `reject`: considered and rejected.

---

## Content-type handling

Do not force shopping picks onto every Stage 2 card.

| Content type | Output behaviour |
|---|---|
| `product_category` | Produce Top 5 product picks, 15-item longlist, skips, guidance notes |
| `activity` | Produce Top 5 activity variants, suggested supplies if useful, and “don’t buy if…” guidance |
| `setup` | Produce setup approaches and optional product categories, with space/storage/friction caveats |
| `safety_check` | Produce safety guidance, official source checks, do/avoid steps, and no shopping-first CTAs |
| `parent_buy` | Product picks allowed, but gift suitability is usually false unless explicitly marked true |
| `community` | Produce community/local options or search patterns, not fixed product picks unless requested |
| `bring_back_out` | Prioritise existing-home prompts and reuse before new purchases |

If `show_ember_picks = false`, do not create product picks unless the founder explicitly asks for them. Produce Stage 3 guidance instead.

---

## Ranking rules

Rank candidates by this order:

1. Fit to educational objective and age-stage nuance.
2. Age and safety fit.
3. Low-friction usefulness for a real UK parent.
4. Evidence quality: reviews, brand reputation, editorial support, community signal.
5. Availability and price sanity in the UK.
6. Gift suitability, if relevant.
7. Circularity, borrowability, and pre-loved suitability.
8. Distinctness from other picks.

Avoid five near-duplicates. A good Top 5 should help different parent situations.

---

## Required candidate set

For a product-category Stage 3 run, produce:

- exactly 15 ranked longlist candidates;
- exactly 5 Top Picks selected from the longlist;
- at least 5 skips, unless fewer credible rejects exist;
- at least 1 guidance note covering buy, borrow, bring back out, pre-loved, or hold off;
- substitute recommendations from longlist ranks 6-15 for any Top Pick at risk of stock/price volatility.

If the category is non-product, preserve the same spirit but adapt the unit of recommendation.

---

## “Best for” tags

Every Top Pick needs one specific parent-facing `best_for_tag`.

Examples:

- `Best low-frustration starter`
- `Best proper first step-up`
- `Best value pick`
- `Best small-space option`
- `Best premium pick`
- `Best travel option`
- `Best borrow-first option`
- `Best gift`
- `Best for cautious starters`
- `Best for confident toddlers`
- `Best if they already love characters`
- `Best pre-loved buy`
- `Best parent sanity saver`
- `Best setup upgrade`
- `Best quick check`

Do not reuse generic tags across all picks. Tags must help a parent choose.

---

## Copy rules

Each Top Pick must include two descriptions.

### `product_description_under_30_words`

A factual description of what the product is. Maximum 30 words. No developmental claims unless the product page itself makes them.

Example: `Four progressive cardboard jigsaws featuring Bluey, with 12, 16, 20 and 24 pieces.`

### `ember_verdict`

A parent-facing judgement explaining why the pick fits the exact Stage 1 card, Stage 2 card and age band.

It should explain:

- why this works now;
- what makes it different from earlier-stage options;
- who it is best for;
- any reason to borrow, skip, bring back out, or hold off.

Tone: smart UK friend. Warm, calm, specific, not salesy.

Avoid: essential, must-have, unlock, “research shows,” domain jargon, pressure language, guilt language, toy-ad hype, and broad unsupported claims.

---

## Default exclusions

Reject or downgrade candidates that are:

- wrong age band;
- too babyish for this Stage 2 card;
- too advanced or likely to frustrate;
- a different category using similar keywords;
- unsafe or unclear on age warnings;
- out of stock with no useful substitute;
- sold only by unknown marketplace sellers;
- counterfeit-risk or brand-confusing;
- suspiciously reviewed;
- thin affiliate picks with no evidence;
- duplicates of the same product;
- not meaningfully different from earlier age-band recommendations;
- irrelevant to the educational objective.

Default excluded sources: Temu, AliExpress, unverified marketplace-only brands, unsafe dropship listings, and any source where product identity or UK availability cannot be verified.

---

## Canonical JSON output

Use this schema unless the founder asks for a different one.

```json
{
  "schema_version": "ember_picks_research_v2",
  "research_date": "YYYY-MM-DD",
  "researcher": "chatgpt | manus | cursor | human | other",
  "currency": "GBP",
  "market": "UK",
  "brief_id": "{age_band_id}_{category_entity_id}",
  "age_band_id": "",
  "age_band_id_spine": "",
  "age_band_label": "",
  "min_months": 0,
  "max_months": 0,
  "child_stage_plain_english": "",
  "category_entity_id": "",
  "category_label": "",
  "cluster_entity_id": "",
  "cluster_label": "",
  "audience_lens": "",
  "content_type": "",
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

For each object in `top_picks`, include:

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
  "key_specs": {
    "piece_count": "",
    "dimensions": "",
    "materials": "",
    "included_items": "",
    "other": ""
  },
  "product_description_under_30_words": "",
  "ember_verdict": "",
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

For each object in `longlist`, include at minimum:

```json
{
  "longlist_rank": 1,
  "status": "pick | backup | skip",
  "top_pick_rank": 1,
  "product_name": "",
  "brand": "",
  "retailer": "",
  "product_url": "https://...",
  "url_checked_date": "YYYY-MM-DD",
  "stock_status": "in_stock | low_stock | out_of_stock | preorder | unknown",
  "price_text": "",
  "age_mark_on_listing": "",
  "summary_reason": "",
  "best_for_tag": "",
  "evidence_tier": "strong | good | emerging | weak | reject",
  "rating_value": 0.0,
  "rating_count": 0,
  "buy_borrow_hold_off": "buy | borrow | bring_back_out | hold_off | buy_pre_loved | buy_new_only",
  "gift_suitable": true,
  "caveat_short": "",
  "included_in_top_5": true,
  "display_status": "visible | backup",
  "public_rank": 1,
  "locked_for_non_members": false
}
```

For each object in `skips`, include at minimum:

```json
{
  "status": "skip",
  "product_name": "",
  "brand": "",
  "retailer": "",
  "product_url": "https://...",
  "alternate_urls": [],
  "url_checked_date": "YYYY-MM-DD",
  "price_amount": null,
  "price_text": "",
  "currency": "GBP",
  "price_checked_date": "YYYY-MM-DD",
  "age_mark_on_listing": "",
  "key_specs": {},
  "buy_borrow_hold_off": "hold_off",
  "gift_suitable": false,
  "safety_notes": "",
  "rating_value": null,
  "rating_count": null,
  "rating_source": "",
  "evidence_tier": "reject",
  "skip_reason": "Why rejected versus Ember brief.",
  "evidence_notes": ""
}
```

---

## CSV mirror

If producing a CSV, use this exact header row:

```text
schema_version,research_date,researcher,age_band_id,age_band_id_spine,category_entity_id,category_label,cluster_label,content_type,status,rank,longlist_rank,top_pick_rank,best_for_tag,product_name,brand,retailer,product_url,alternate_urls,image_url,url_checked_date,stock_status,price_amount,price_text,currency,price_checked_date,age_mark_on_listing,key_specs,product_description_under_30_words,ember_verdict,why_it_fits,caveats,buy_borrow_hold_off,gift_suitable,gift_note,ownership_note,safety_notes,rating_value,rating_count,rating_source,review_quality_note,evidence_tier,evidence_sources,preloved_suitability,preloved_signal_note,substitute_if_unavailable,founder_qa_flag,skip_reason,evidence_notes
```

Rules:

- `schema_version` = `ember_picks_research_v2` on every row.
- `alternate_urls`: join with ` | `.
- `evidence_sources`: join source names/URLs compactly with ` | `.
- `gift_suitable`: `true` or `false`.
- For guidance rows, use `status = note` and leave product fields blank.
- Use UTF-8 CSV and quote fields that contain commas.

---

## Founder summary format

Create a concise Markdown summary with:

1. `# Pip’s Picks: {stage_2_card_label} ({age_band_label})`
2. `## Educational shift`
3. `## Top 5 Ember Picks`
4. `## Ranked longlist summary`
5. `## Best substitutes if unavailable`
6. `## What we skipped and why`
7. `## Borrow / bring back out / hold off guidance`
8. `## QA concerns before import`

The JSON is the source of truth. The summary is for founder review.

## Handoff to Stage 3 Card Ingestion

When the founder wants to publish researched picks into `/discover`, pass the JSON output to `$ember-stage3-card-ingestion`.

For fast ingestion, make the JSON compatible with `web/scripts/ingest-stage3-pips-picks.mjs`:

- `top_picks` must contain exactly 5 card-ready rows.
- `longlist` must contain ranks 1-15.
- Longlist ranks 6-15 must be usable as dormant backups.
- `category_entity_id` must equal the Stage 2 category slug used in `pl_category_types.slug`.
- `founder_qa_flag` must be explicit on every Top Pick.
- `ingestion_ready.expected_stage2_mapping` must name the target Stage 2 card.
- Use `ingestion_ready.status = not-ready` when the generator should fail rather than publish.

Before handoff, be explicit about whether the research is:

- `production-ready`: clean enough for immediate card ingestion;
- `founder-review-ready`: strong but has caveats the founder should understand;
- `not-ready`: needs more research before ingestion.

Do not hide weak URLs, stale prices, uncertain stock, safety uncertainty, generic copy, or low evidence behind polished wording. `$ember-stage3-card-ingestion` should rerun this skill automatically when these issues prevent excellent parent-facing Pip's Picks cards.

---

## QA checklist

Before final delivery, self-check:

- JSON parses.
- `schema_version` is `ember_picks_research_v2`.
- Top 5 count is exactly 5 for product categories.
- Longlist count is exactly 15 for product categories.
- Top 5 are present in the longlist.
- Longlist ranks have no gaps.
- At least 5 skips are included, or a clear explanation is given.
- Every product pick, backup and skip has a live `https://` URL.
- Every URL, price and source has a checked date.
- All dates use `YYYY-MM-DD`.
- Every Top Pick has a specific `best_for_tag`.
- Every Top Pick has a product description under 30 words.
- Every Top Pick has an Ember Verdict.
- Evidence tiers are honest.
- Safety-sensitive claims are supported by retailer, manufacturer or official sources.
- Hidden gems meet the hidden-gem threshold or are marked `emerging`.
- No invented products, URLs, ratings, prices, warnings, awards or editorial mentions.
- CSV headers match exactly when CSV is produced.
- Founder summary is consistent with JSON.

---

## Response pattern for ChatGPT execution

When using this Skill inside ChatGPT:

1. State the resolved research card briefly.
2. Run the research using available tools.
3. Create the JSON, CSV and summary files if file output is requested or useful.
4. In the final answer, give the founder verdict in 3-6 bullets and link the files.
5. Be explicit about any uncertainty, failed checks, unavailable prices, broken URLs, weak evidence, or skipped safety-sensitive claims.

Do not say work will be done later. Either run it now, generate a handoff brief, or explain what could not be verified with the available tools.

---

## Response pattern for QA mode

When reviewing an existing Stage 3 output, use this structure:

- Verdict: production-ready / founder-review-ready / promising but not ready / reject.
- Quantity: Top 5, longlist, skips, guidance notes.
- Quality: educational fit, source mix, evidence tiers, ranking logic.
- MLP value: whether it justifies Ember Plus-style value when repeated across Stage 2 cards.
- Fit to brief: does it solve the exact Stage 1 / Stage 2 objective?
- Required fixes before import.
- Optional improvements.

Be direct. Do not overpraise generic product lists.
