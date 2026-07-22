---
name: ember-stage3-card-ingestion
description: Turn Ember Stage 3 research outputs into live /discover Pip's Picks cards, mapped to the correct Stage 2 cards, with brand/Conor QA, access-control handling, integration tests, GitHub PR creation, and a green Vercel preview link. Use when asked to ingest Stage 3 research, publish Pip's Picks, convert Ember Picks research JSON/CSV into Discover cards, wire Top 5 picks into the app, verify founder/paid-member visibility, or create the PR for Stage 3 card delivery.
---

# Ember Stage 3 Card Ingestion

## Purpose

Use this skill to convert approved or near-approved `$ember-stage3-research` outputs into real parent-facing Pip's Picks cards in `/discover`.

This is the fourth step in the workflow:

1. `$ember-stage2-pilot-converter` chooses which Stage 2 cards should be piloted first.
2. `$ember-stage3-research` produces evidence-backed Top Picks into `research/inbox/` (`pending-ff-check`).
3. `$ember-stage3-ff-checker` smoke-checks URLs, ratings, and age gates → `green/` or `quarantine/`.
4. `$ember-stage3-card-ingestion` turns **`green/`** research into live Discover cards.

**Refuse inputs outside `…/research/green/`.** Run `node agent-tools/scripts/stage3-ff-check.mjs --age-band={AGE_BAND}` first if needed. Gates: `web/docs/STAGE3_TRUST_GATES.md`.

## Core Product Rules

- Parent-facing name: `Pip's Picks`.
- Stage/internal name: `Stage 3 cards`.
- Show exactly the Top 5 picks in the Stage 3 card experience.
- Keep longlist ranks 6-15 as dormant backups in the underlying data/database.
- Pick 1 is visible to all users.
- Picks 2-5 are blurred/locked for signed-out users and signed-in users who are not paid Ember members.
- Until a paid model exists, treat founder email `timwd23@gmail.com` as the only paid-member proxy.
- When logged in as `timwd23@gmail.com`, the founder must see all five picks without blurring.
- When logged out, the founder must be able to test the locked state: pick 1 clear, picks 2-5 blurred.
- Stage 3 cards should be branded as Pip's Picks and use the current Ember/Pip visual system, including the robin logo where the app has an established asset or component for it. Do not invent new brand assets without founder approval.

## Source Inputs

Accept any of:

- `ember_picks_{age_band_id}_{category_entity_id}.json`
- `ember_picks_{age_band_id}_{category_entity_id}.csv`
- `ember_picks_{age_band_id}_{category_entity_id}_summary.md`
- a Stage 3 research folder/export from Manus, ChatGPT, Cursor, or a human researcher
- a Stage 2 shortlist row plus permission to rerun `$ember-stage3-research`

Prefer JSON as the source of truth. Use CSV/Markdown only to cross-check or recover missing context.

For repeatable ingestion, prefer the standard bundle:

- `stage3_ingestion_bundle_[AGE_BAND].json`
- See `references/stage3-ingestion-bundle-v1.md` when creating, validating, or consuming a bundle.

Also inspect the current repo implementation before editing:

- Discover routes/pages/components under `web/src/app/discover`, `web/src/components/discover`, and adjacent data loaders.
- Existing database migrations and seed/import patterns under `supabase/`, `web/scripts/`, and any Stage 2/Discover scripts.
- Brand rules in `web/docs/EMBER_BRAND_BOOK.md`.
- Product marketing names in `web/docs/PRODUCT_MARKETING_LIBRARY.md`.
- Persona bar in `web/docs/CONSCIENTIOUS_CONOR.md` and `.cursor/rules/conscientious-conor.mdc`.

## Workflow

### 0. Use The Fast Ingestion Lane First

When working inside the Ember repo, prefer the deterministic generator before hand-writing migrations:

```bash
node web/scripts/ingest-stage3-pips-picks.mjs \
  --age-band={AGE_BAND} \
  --inputs=agent-tools/exports/stage3/{AGE_BAND}/research/green/ember_picks_{AGE_BAND}_*.json
```

Use `--dry-run` first. If validation passes, rerun without `--dry-run` to create:

- a standard ingestion bundle
- a QA Markdown report
- a Supabase migration using the known `pl_stage3_picks` + RLS pattern

Only hand-edit generated SQL when the current ingestion case cannot be represented by the bundle. If hand-editing, preserve the same access-control pattern and run the same smoke tests.

### 1. Resolve The Target Stage 2 Card

Identify:

- `age_band_id`
- `cluster_entity_id`
- `cluster_label`
- `category_entity_id`
- `category_label`
- current Stage 2 route/card identity in `/discover`
- current content type and render rule

If the Stage 3 output cannot be confidently mapped to one Stage 2 card, stop and report the ambiguity.

Do not create orphan Stage 3 content.

### 2. Validate The Research Input

For product-category Pip's Picks, require:

- schema version `ember_picks_research_v2`, or a clearly compatible output
- exactly 5 Top Picks
- 15 longlist entries where possible
- at least 5 skips, or an explanation
- Top Picks included in longlist
- live product URLs or explicit QA flags
- price/stock/source checked dates
- evidence tiers
- `best_for_tag`
- `product_description_under_30_words`
- `ember_verdict`
- safety notes where relevant
- buy/borrow/bring-back/hold-off judgement

If this fails because the research is weak, stale, incomplete, generic, unsafe, or not Conor-grade, automatically rerun `$ember-stage3-research` and tell the founder what triggered the rerun.

If the missing input is not research-fixable, ask one concise clarification question.

### 3. Convert Research To Card-Ready Content

Create parent-facing card content from the research. The card should feel like Ember, not like raw research.

Each visible pick should have:

- rank
- `best_for_tag`
- product name
- brand
- retailer/source
- price text when verified
- product image URL or existing image strategy
- one short factual product description
- one Ember verdict
- buy/borrow/hold-off/pre-loved/new-only judgement
- gift suitability where relevant
- ownership/duplication note where relevant
- safety note where relevant
- evidence/QA flags for internal display or admin review, not noisy parent copy

Use the research JSON for product facts. Rewrite only the parent-facing copy. Do not invent facts, ratings, awards, prices, age marks, or safety warnings.

### 4. Apply Brand And Conor QA

Read `web/docs/EMBER_BRAND_BOOK.md` before writing or editing parent-facing copy.

Every parent-facing card must pass:

1. **Respect:** assumes the parent lived the previous stage.
2. **Well Duh:** avoids obvious advice.
3. **Stage shift:** explains why this pick fits now.
4. **Buying judgement:** helps decide buy, borrow, bring back out, hold off, pre-loved, or new-only.
5. **Human parent:** sounds like a smart UK parent friend.

Reject or rewrite any card that contains:

- `magic`
- `unlock`
- `optimise`
- `essential`
- `must-have`
- `research-backed`
- `developmental domain`
- `stage-based`
- `proactive parenting`
- `accelerate development`
- `another spiral`
- `endless tabs`
- `40 tabs`
- `six months behind`
- guilt, shame, or lag framing
- toy-ad hype
- generic AI tone

If the content cannot be made fantastic without better evidence, rerun `$ember-stage3-research`.

### 5. Integrate Into Discover

Follow the repo's existing architecture. Do not invent a parallel content system if one already exists.

Typical implementation tasks may include:

- adding or updating data schema/types for Stage 3/Pip's Picks
- creating database migrations with `web/scripts/ingest-stage3-pips-picks.mjs`
- mapping Stage 3 records to the exact Stage 2 `category_entity_id`
- storing Top 5 picks as visible card content
- storing longlist backups as dormant records
- wiring Discover UI to show Pip's Picks under the correct Stage 2 card
- adding locked/blurred rendering for picks 2-5
- adding founder override logic for `timwd23@gmail.com`
- preserving signed-out behaviour
- adding tests or fixtures for logged-out, non-paid signed-in, and founder states

Access-control behaviour must be server-backed or otherwise consistent with the app's existing auth model. Do not rely only on CSS blur if the full gated content is exposed in client data to users who should not receive it, unless the existing app pattern already accepts that trade-off and the founder is told clearly.

Current standard access pattern:

- `pl_stage3_picks` stores both Top 5 visible rows and longlist backup rows.
- Pick 1 is `is_locked = false`.
- Picks 2-5 are `is_locked = true`.
- RLS lets everyone read unlocked visible rows.
- RLS lets founder proxy `timwd23@gmail.com` read locked visible rows.
- Public views must not expose locked product details.
- The `/api/discover/picks` route returns placeholders for locked ranks to non-founder viewers.

### 6. Verify Locally

Run the smallest meaningful checks first, then broader checks as needed:

- typecheck/lint/build commands used by the repo
- relevant unit/integration tests
- migration or seed validation if database files changed
- generated bundle QA report
- local Discover page smoke test where feasible
- logged-out view: pick 1 visible, picks 2-5 blurred
- founder proxy view: `timwd23@gmail.com` sees all five picks
- non-founder signed-in view, if practical: picks 2-5 blurred unless paid membership exists

For API smoke testing, use the command from `references/stage3-ingestion-bundle-v1.md`: signed-out responses must include one real product and locked placeholders for ranks 2-5, with no hidden retailer URLs.

If a check cannot be run locally, say why in the PR/final response.

### 7. Raise PR And Vercel Preview

Done means founder-testable, not merely committed.

Use a `codex/` branch unless the founder asks otherwise.

Required completion flow:

1. Create or switch to a focused branch.
2. Commit only the relevant changes.
3. Push the branch.
4. Open a GitHub PR with a founder-readable summary and test notes.
5. Wait for Vercel checks/deployment.
6. Provide the green Vercel preview link for founder testing.

If Vercel is not green, keep investigating until fixed or blocked by missing external access. Do not hand over a red preview as complete.

## PR Description Template

Use a concise founder-readable PR body:

```markdown
## What changed
- Added Pip's Picks for `{category_label}` in `{age_band_id}`.
- Mapped Stage 3 cards to Stage 2 `{category_entity_id}`.
- Pick 1 is visible to all users; picks 2-5 are gated.
- Founder override: `timwd23@gmail.com` sees all five picks.

## Founder test plan
- Logged out: open the Vercel preview and check pick 1 is clear, picks 2-5 are blurred.
- Logged in as `timwd23@gmail.com`: check all five picks are visible.
- Check copy feels like Ember: specific, useful, no guilt, no toy-ad hype.

## QA
- Brand book / Conor tests: pass
- Research input: pass / rerun completed
- Tests run: ...
- Known caveats: ...
```

## Final Response Pattern

When finished, tell the founder:

- the Stage 2 card(s) ingested
- whether research was reused or rerun
- where the code/content changed
- the Vercel preview link
- exactly how to test logged-out and founder-logged-in states
- any remaining caveats

Keep it non-technical unless the founder asks for details.

## Hard Stops

Stop and ask for help if:

- the Stage 3 output cannot be mapped to a Stage 2 card
- the app has no discover data path that can be modified safely
- paid/founder auth state cannot be determined after inspecting the repo
- product/safety claims cannot be verified even after rerunning research
- GitHub or Vercel access is unavailable and no workaround exists

## Acceptance Checks

Before final delivery:

- Stage 3 research is valid or rerun.
- Parent-facing copy follows `web/docs/EMBER_BRAND_BOOK.md`.
- Every card passes the five Conor tests.
- Top 5 picks are represented.
- Longlist backups are stored or intentionally preserved in an import artifact.
- Stage 3 content maps to the correct Stage 2 card.
- Pick 1 is public.
- Picks 2-5 are locked/blurred for signed-out users.
- Founder email `timwd23@gmail.com` can see all five picks.
- Relevant tests/build checks pass.
- GitHub PR is open.
- Vercel preview is green and linked for founder review.
