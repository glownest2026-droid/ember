---
name: ember-stage2-pilot-converter
description: Convert a set of Ember Stage 2 cards into a prioritised pilot queue for deeper Stage 3 Ember Pick research from a populated Spine 3.0 / Ember Bible age-band workbook. Use when asked to choose which Stage 2 cards to pilot first, create a Stage 3 research shortlist, choose the strongest product-category card per Stage 1 cluster, run prioritisation across discover_projection, or prepare inputs that will later feed $ember-stage3-research. This is not for product shopping or live Pip's Picks research.
---

# Ember Stage 2 Pilot Converter

## Purpose

Use this skill to convert Stage 2 catalogue cards into a prioritised pilot queue for Stage 3 Ember Pick research.

This is the prioritisation step before `$ember-stage3-research`. It selects the single strongest eligible Stage 2 product-category card under each Stage 1 parent card, where such a product-action row exists. It must not force product picks for safety, check, setup, activity, or otherwise non-shopping-led clusters.

## Source of Truth

Use one populated Ember Spine 3.0 / Ember Bible workbook for the target age band:

`02_Ember_Bible_[AGE_BAND]_v*.xlsx`

Treat Spine 3.0 as the latest offline source of truth for all live Ember catalogue data, the offline equivalent of `/discover`.

Primary sheet: `discover_projection`.

Do not use external research. Do not hardcode category names, age-band-specific logic, or product assumptions. Do not mutate the workbook unless explicitly asked.

## Preferred Repo Runner

When working inside the Ember repo and a workbook path is available, prefer the deterministic runner:

```bash
node web/scripts/export-stage3-research-shortlist.mjs --out=agent-tools/exports "path/to/02_Ember_Bible_[AGE_BAND]_v*.xlsx"
```

Expected converter outputs:

- `stage3_shortlist_[AGE_BAND].md`
- `stage3_shortlist_[AGE_BAND].csv`

Where `[AGE_BAND]` is normalised from `age_band_id` by stripping `age_` and replacing underscores with hyphens.

If the runner cannot be used, reproduce the rules below exactly.

## Required Columns

Stop with a clear missing-column error if any of these are absent:

- `age_band_id`
- `cluster_entity_id`
- `cluster_label`
- `cluster_rank`
- `category_entity_id`
- `category_label`
- `category_rank`
- `content_type`
- `show_ember_picks`
- `render_rule`
- `is_physical_product`
- `evidence_ids`
- `buyer_mode_label`
- `primary_persona`
- `gift_friendly`
- `show_gift_action`
- `gift_display_eligible`
- `gift_confidence`
- `common_ownership_risk`
- `ownership_note`
- `needs_research`

Require one source-ID column:

- Prefer `source_ids`.
- Fall back to `community_source_ids`.
- If neither exists, stop with a clear error.

Use optional columns when present: `lane_rank`, `product_family_label`, `cluster_label_parent_friendly`.

## Parsing Rules

Read columns dynamically by header name.

Treat booleans case-insensitively:

- Truthy: `TRUE`, `true`, `1`, `yes`, `y`
- Falsey: `FALSE`, `false`, `0`, `no`, `n`, blank

Treat blank cells as empty. Treat semicolon- or pipe-separated `evidence_ids`, `source_ids`, and `community_source_ids` as lists. Preserve IDs exactly as written.

## Eligibility Gate

A Stage 2 row is eligible for Stage 3 research only if all are true:

- `content_type` equals `product_category`
- `show_ember_picks` is truthy
- `render_rule` equals `product_actions`
- `is_physical_product` is truthy
- `category_entity_id` is present
- `category_label` is present
- `needs_research` is not truthy

Exclude activity rows, setup rows, safety-check rows, rows without product actions, non-physical products, rows hidden from Ember Picks, rows needing research, and rows missing category identity.

## Scoring

Score only eligible rows. Use these fixed weights and round `priority_score` to 2 decimal places.

Editorial priority:

- Add `max(0, 20 - category_rank)`.
- Add `max(0, 10 - lane_rank) * 0.5`; if `lane_rank` is blank, treat it as `50`.
- Add `max(0, 15 - cluster_rank) * 0.15`.

Evidence strength:

- `evidence_count` is the count of IDs in `evidence_ids`.
- `source_count` is the count of IDs in `source_ids`, or fallback `community_source_ids`.
- Add `min(evidence_count, 5) * 1.5`.
- Add `min(source_count, 4) * 1.0`.

Persona value:

- `primary_persona = both`: add `6`.
- `primary_persona = conor` and `buyer_mode_label = Parent buy`: add `5`.
- `primary_persona = thea` and `gift_friendly` truthy: start gift bonus at `3`.
- `gift_display_eligible` truthy: add `1.5` to gift bonus.
- `gift_confidence = high`: add `2` to gift bonus.
- `gift_confidence = medium`: add `1` to gift bonus.
- Cap total gift bonus at `5`, then add it to score.

Stage 3 readiness:

- `buyer_mode_label = Parent buy`: add `4`.
- `buyer_mode_label = Good gift`: add `3`.
- `show_gift_action` truthy: add `1`.
- Non-empty `product_family_label`: add `1`.

Ownership risk:

- `common_ownership_risk = high`: subtract `1.5`.
- `common_ownership_risk = medium`: subtract `0.75`.

Do not exclude rows solely for ownership risk.

## Selection

For each unique `cluster_entity_id`:

1. Group all rows in the cluster.
2. Apply the eligibility gate.
3. If eligible rows exist, select the row with the highest `priority_score`.
4. If none exist, mark the cluster as `No Stage 3 product pick recommended` and explain why.

Prefer `cluster_label_parent_friendly` for the Stage 1 card title when present; otherwise use `cluster_label`.

Tie-break equal scores in this order:

1. Lower `category_rank`
2. Higher `evidence_count`
3. Higher `source_count`
4. `primary_persona = both`
5. `gift_confidence = high`
6. If still tied, flag for manual review instead of guessing

## No-Pick Recommendations

For clusters without an eligible product-action row, choose one recommendation:

- `Keep as Quick Check` for safety/check-led clusters.
- `Keep as Useful Idea` for activity-led clusters or product-ish rows hidden from Ember Picks.
- `Keep as Setup` for setup-led clusters.
- `Needs manual review` when the reason is mixed or unclear.

## Output

Produce a Markdown report and CSV file.

Markdown sections:

1. Summary
2. Stage 3 shortlist
3. Clusters with no Stage 3 product pick
4. Excluded rows audit
5. Manual review flags

Summary must include:

- `age_band_id`
- total Stage 1 clusters
- clusters with a Stage 3 candidate
- clusters without a Stage 3 candidate
- total eligible product-action rows considered
- the MVP principle: one Stage 2 card with Stage 3 recommendations under every Stage 1 parent card where eligible

Shortlist columns:

- Stage 1 rank
- Stage 1 card
- Selected Stage 2 card
- `category_entity_id`
- `category_type_slug` (same value as `category_entity_id` unless the repo mapping proves otherwise)
- `priority_score`
- `buyer_mode_label`
- `primary_persona`
- `gift_friendly`
- `gift_confidence`
- `evidence_count`
- `source_count`
- `common_ownership_risk`
- `reason_selected`

CSV columns:

```text
age_band_id,cluster_rank,cluster_entity_id,cluster_label,selected_for_stage3,category_rank,category_entity_id,category_type_slug,category_label,priority_score,buyer_mode_label,primary_persona,gift_friendly,show_gift_action,gift_display_eligible,gift_confidence,common_ownership_risk,evidence_count,source_count,stage3_research_input_filename,stage3_ingestion_bundle_hint,reason_selected,manual_review_flag
```

## Manual Review Flags

Flag:

- tied rows
- rows with strong evidence but excluded by `render_rule`
- rows with `gift_friendly = TRUE` but `show_gift_action = FALSE`
- rows with `buyer_mode_label = Parent buy` but `primary_persona = thea`
- rows where `product_category` is eligible but evidence/source IDs are sparse

## Handoff to Stage 3 Research And Ingestion

Use this skill to produce the shortlist only. For each selected Stage 2 card that the founder chooses to pilot, use `$ember-stage3-research` to run or prepare the deeper product research.

After the founder chooses researched cards to publish, use `$ember-stage3-card-ingestion` to convert approved Stage 3 research outputs into live `/discover` Pip's Picks cards.

For a faster downstream workflow, include these handoff hints wherever possible:

- `category_type_slug`: the slug the app/Supabase should map to, normally `category_entity_id`.
- `stage3_research_input_filename`: expected output such as `ember_picks_34-36m_cat_picture_story_books.json`.
- `stage3_ingestion_bundle_hint`: expected bundle such as `stage3_ingestion_bundle_34-36m.json`.
- `discover_route_hint`: `/discover/{representative_month}` when a month can be inferred from the age band.

These hints do not change prioritisation. They reduce rediscovery work in `$ember-stage3-research` and `$ember-stage3-card-ingestion`.

Do not turn this shortlist step into live product shopping or card ingestion. The output is a prioritised queue of Stage 2 cards, not Pip's Picks.

## Acceptance Checks

Before final delivery, verify:

- Exactly one selected Stage 2 card per Stage 1 cluster where eligible product-action rows exist.
- Zero selected rows from activity, setup, or safety-check content types.
- No product pick is forced for safety-led clusters.
- Every Stage 1 cluster with no Stage 3 recommendation has an explanation.
- Boolean parsing accepts `1`/`0` as well as `TRUE`/`FALSE`.
- Source IDs use `source_ids` or fallback `community_source_ids`.
- The Markdown and CSV filenames match the target age band.
