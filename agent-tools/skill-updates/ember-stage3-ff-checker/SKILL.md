---
name: ember-stage3-ff-checker
description: Validate Ember Stage 3 research JSON against Fastidious Founder trust gates (schema v3, URL smoke, ratings, age signals, HOW trail). Move inbox→green/quarantine, write evidence ledgers, and draft re-research briefs for founder approval. Use when Stage 3 research lands, after Manus/Cursor research, or before founder HTML / ingest.
---

# Ember Stage 3 FF Checker

## Purpose

Gate Stage 3 research before founder review or ingest. **Never guess** that a URL works or that a product fits the age band. Enforce the must-be-true criteria in `web/docs/STAGE3_RESEARCH_METHODOLOGY.md`.

This is a **second pass**, not the copywriter. Research must already write parent-facing fields to `web/docs/brand/WRITING_GUIDELINES.md`. FF fails banned tells (em dash, calm, worth buying, Fresh 20XX, Stage X, etc.), links, age, ratings, availability, and HOW completeness. Weak voice that still “passes” string bans should be sent back to `$ember-stage3-research` Mode A — do not light-polish into green.

Canonical rules: `web/docs/STAGE3_TRUST_GATES.md` · `web/docs/brand/WRITING_GUIDELINES.md`

## When to use

- New `ember_picks_*.json` appears in `research/inbox/`
- Founder says “run the FF checker”, “check Stage 3”, or drops Manus/Cursor outputs
- Before `$ember-stage3-founder-review` or `$ember-stage3-card-ingestion`

## Folder contract

```
agent-tools/exports/stage3/{AGE_BAND}/research/
  inbox/              ← untrusted new research (schema v3 only)
  quarantine/         ← failed check + ff_check_*.md + re-research brief
  green/              ← passed only
  ledgers/            ← stage3_evidence_ledger_{band}_{category}.csv
  untrusted_drafts/   ← frozen pre-v3 / light-repair archaeology (do not treat as inbox standard)
```

## Commands

```bash
# Availability (retired / out-of-stock / notify-me)
node agent-tools/scripts/stage3-availability-check.mjs https://…

# Check all inbox files for a band (smoke + availability + gates + move)
node agent-tools/scripts/stage3-ff-check.mjs --age-band=34-36m

# Smoke only
node agent-tools/scripts/stage3-url-smoke.mjs --dir=agent-tools/exports/stage3/34-36m/research/inbox

# Fixture / schema-only (skip HTTP)
node agent-tools/scripts/stage3-ff-check.mjs path/to/file.json --skip-smoke --no-move
```

## Hard gates (Top Picks)

1. `schema_version` = `ember_picks_research_v3`
2. Non-empty `buying_factor_memo`; `methodology` names bench → age → rank → URL
3. Every Top Pick: `rank_rationale`, `age_signals[]`, `url_verification.primary_opens_product=true`, Description (`product_description_under_30_words` **20–40 words**), `ember_verdict`
4. Longlist ranks 6–10: `missed_top5_reason`
5. Primary URL `url_ok` (HTTP 2xx/3xx) — fail closed (unless `--skip-smoke`)
6. Primary **buyable today** — not retired/discontinued/notify-when-in-stock (`stage3-availability-check.mjs`); manufacturer alt showing retired fails cross-check
7. `rating_value >= 4.4` and `rating_count >= 15` when count is present (specialist cannot excuse a SKU with fewer than 15 reviews)
8. Age signals overlap band; “not suitable under 3 years” fails if `band.min < 36`
9. Schema: 5 / 15 / ≥5 skips
10. Unique short `Best for …` tags
11. Parent fields pass Writing Guidelines bans (`web/docs/brand/WRITING_GUIDELINES.md`) — em dash, calm, worth buying, Fresh 20XX, Stage X, low-stakes, quick wins, tight budget(s), etc.
12. Description word count **20–40** (legacy field name `product_description_under_30_words`; one Description only — no “What this is”)
13. Best for tag must be reflected in Description and/or Why Pip
14. Description and Why Pip must not be near-paraphrases of each other
15. Unique Top 5 product names; no near-duplicate product lines (e.g. two Edx Step-A-* SKUs)

## Outcomes

| Result | Action |
|---|---|
| Pass | Move JSON (+ csv/summary) to `green/`; ledger written; status founder-review-ready |
| Fail | Move to `quarantine/`; write `ff_check_{category}.md` with re-research brief |

**Do not** re-run research without founder approval. **Do not** light-repair into green. Show the fail summary and wait for GO for full Mode A.

## After pass

- `$ember-stage3-founder-review` — build HTML from `green/` only  
- `$ember-stage3-card-ingestion` — ingest from `green/` only  

## How to verify

1. Put the bad fixture in `agent-tools/exports/stage3/_fixtures/` through the checker with `--skip-smoke --no-move` → expect FAIL (schema/HOW).
2. Put the good fixture through with smoke → expect PASS fields (or use `--skip-smoke` for HOW-only).
3. Confirm ledger includes `rank_rationale` / `missed_top5_reason` columns.
