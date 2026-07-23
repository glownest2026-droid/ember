---
name: ember-stage3-founder-review
description: Create founder-review HTML for Ember Stage 3 from green-folder research only. Shows proposed public content (links, titles, descriptions, Why Pip picked this) plus HOW ranking trail. Use after FF Checker pass.
---

# Ember Stage 3 Founder Review

## Trust gate

Build previews **only** from:

`agent-tools/exports/stage3/{AGE_BAND}/research/green/`

If empty, run `$ember-stage3-ff-checker` first. Rules:

- `web/docs/STAGE3_TRUST_GATES.md`
- `web/docs/STAGE3_RESEARCH_METHODOLOGY.md`
- `web/docs/brand/WRITING_GUIDELINES.md` (public copy should already be clean in green)

Never build “proposed public” HTML from `inbox/`, `quarantine/`, or `untrusted_drafts/`.

If Why Pip / descriptions fail the Writing Guidelines read-aloud test, **do not rewrite in the HTML builder**. Flag for `$ember-stage3-research` re-run.

## What the HTML must show

**Per product row (proposed public content)**

- Working primary link (+ optional alt links)
- Title / name + Best-for tag
- **Description** (`product_description_under_30_words`, **20–40 words** — one field only)
- **Why Pip picked this** (`ember_verdict`)
- FF green badge

**Per category (HOW / scrutiny)**

- `buying_factor_memo`
- `methodology`
- Ranks 1–10 with `rank_rationale` / `missed_top5_reason`

## Commands

```bash
node agent-tools/scripts/generate-stage3-founder-rows.mjs {AGE_BAND}
node agent-tools/scripts/build_founder_preview.mjs \
  agent-tools/exports/stage3/{AGE_BAND}/founder-preview/stage3_founder_review_rows_{AGE_BAND}.json \
  agent-tools/exports/stage3/{AGE_BAND}/founder-preview/stage3_founder_review_{AGE_BAND}.html
```

## Scrutiny contract

If the founder asks “why is this #1?”, quote `rank_rationale` / `buying_factor_memo` from green JSON or the HOW panel — do not invent.
