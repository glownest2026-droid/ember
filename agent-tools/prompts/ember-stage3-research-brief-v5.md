# Ember Stage 3 research brief — v5 (external / Manus / human)

**Canon:** follow `web/docs/STAGE3_RESEARCH_METHODOLOGY.md`, `web/docs/STAGE3_TRUST_GATES.md`, and **`web/docs/brand/WRITING_GUIDELINES.md`**.  
**Schema:** `ember_picks_research_v3`  
**Output folder:** `agent-tools/exports/stage3/{AGE_BAND}/research/inbox/`  
**Max status from research:** `pending-ff-check` (never self-green / production-ready)

## Pilot success (must all be true)

1. Results will pass FF Checker (ratings ≥4.4 / ≥15 when count present, age overlap, working primary URL, availability, HOW fields, Writing Guidelines ban strings).
2. Every Top Pick primary link opens the real product and is buyable today.
3. Parent-facing fields are **already Writing-Guidelines-clean** for founder HTML and `/discover`: title, short description, Why Pip picked this (`ember_verdict`).
4. Ranking is documented: `buying_factor_memo`, per-rank `rank_rationale`, longlist 6–10 `missed_top5_reason`.

## Required workflow

1. **Read voice first** — open `web/docs/brand/WRITING_GUIDELINES.md`. Public copy is written to that bar **in this research step**, not later at FF or ingest.
2. **Bench** — 15-equal longlist with live URLs (brand/publisher primary preferred).
3. **Age** — capture `age_signals[]` from each Top Pick listing (strictest wins).
4. **Rank** — apply factor order; write category `buying_factor_memo` and each `rank_rationale`.
5. **Public copy (research-owned root cause)** — complete the research ship checklist in `$ember-stage3-research` before inbox:
   - Description **20–40 words**, product clear without CTA
   - Why Pip = need at this age + earns Best for (not a Description echo)
   - Best for lands in Description and/or Why Pip
   - No low-stakes / quick wins / tight budgets / worth buying / calm-as-praise / em dashes / Stage X
   - Unique Top 5; max one lookalike modular line (e.g. one Step-A-style title)
6. **URL + availability verify** — fill `url_verification`; run availability check; do not guess.
7. **Self-check** — Writing Guidelines ship checklist + research ship checklist on every Top Pick.
8. Write JSON/CSV/summary to **inbox/** only.
9. Stop. Founder/agent runs `$ember-stage3-ff-checker` as a **second-pass validator** (evidence + re-check). FF does not invent voice. Copy fails → full Mode A re-research.

## Banned

- Light repair / “fix the 404s” without re-ranking and re-documenting HOW.
- Inventing URLs, ratings, age marks, or editorial mentions.
- Self-marking production-ready.
- Leaving weak voice for ingest or founder HTML to “fix later.”
- Specialist exemption used to excuse a SKU with fewer than 15 reviews when `rating_count` is present.

## Section 0 — fill per category

| Field | Value |
|---|---|
| age_band_id | |
| min_months / max_months | |
| category_entity_id | |
| category_label | |
| cluster_entity_id / cluster_label | |
| educational_objective | |
| age_stage_nuance / §0.5 cross-band | |
| what_to_look_for / what_to_avoid | |
| content_type / gift_friendly | |

Full JSON field list: `$ember-stage3-research` Skill (`agent-tools/skills/ember-stage3-research/SKILL.md`).
