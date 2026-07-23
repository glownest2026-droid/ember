# Ember Stage 3 research brief — v5 (external / Manus / human)

**Canon:** follow `web/docs/STAGE3_RESEARCH_METHODOLOGY.md` and `web/docs/STAGE3_TRUST_GATES.md`.  
**Schema:** `ember_picks_research_v3`  
**Output folder:** `agent-tools/exports/stage3/{AGE_BAND}/research/inbox/`  
**Max status from research:** `pending-ff-check` (never self-green / production-ready)

## Pilot success (must all be true)

1. Results will pass FF Checker (ratings ≥4.4 / ≥15, age overlap, working primary URL, HOW fields).
2. Every Top Pick primary link opens the real product.
3. Parent-facing fields ready for founder HTML: title, short description, Why Pip picked this (`ember_verdict`).
4. Ranking is documented: `buying_factor_memo`, per-rank `rank_rationale`, longlist 6–10 `missed_top5_reason`.

## Required workflow

1. **Bench** — 15-equal longlist with live URLs (brand/publisher primary preferred).
2. **Age** — capture `age_signals[]` from each Top Pick listing (strictest wins).
3. **Rank** — apply factor order; write category `buying_factor_memo` and each `rank_rationale`.
4. **Public copy** — description + Ember Verdict (Conor five tests).
5. **URL verify** — fill `url_verification`; do not guess.
6. Write JSON/CSV/summary to **inbox/** only.
7. Stop. Founder/agent runs `$ember-stage3-ff-checker`.

## Banned

- Light repair / “fix the 404s” without re-ranking and re-documenting HOW.
- Inventing URLs, ratings, age marks, or editorial mentions.
- Self-marking production-ready.

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
