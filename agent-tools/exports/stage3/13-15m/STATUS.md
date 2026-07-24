# Stage 3 — 13–15m STATUS

**Date:** 2026-07-24  
**Scope:** Mode A research → FF → founder HTML for all 10 manifest categories  
**Stop:** before ingestion · **No PR** · **No ingest**

## Ownership depth

| Category | Class | Top N / Longlist |
|---|---|---|
| `cat_two_block_towers` | single | 5 / 15 |
| `cat_books_with_pauses` | **multiple** | 10 / 25 |
| `cat_teddy_care_play` | single | 5 / 15 |
| `cat_push_pull_play` | single | 5 / 15 |
| `cat_open_cup` | single | 5 / 15 |
| `cat_big_paper_floor` | single | 5 / 15 |
| `cat_tiny_music_basket` | single | 5 / 15 |
| `cat_cupboard_locks_cable_tidy` | single | 5 / 15 |
| `cat_transition_basket` | single | 5 / 15 |
| `cat_out_and_about_kit` | single | 5 / 15 |

## Green (10 / 10)

All categories passed `$ember-stage3-ff-checker` into `research/green/`:

1. `cat_two_block_towers`
2. `cat_books_with_pauses`
3. `cat_teddy_care_play`
4. `cat_push_pull_play`
5. `cat_open_cup`
6. `cat_big_paper_floor`
7. `cat_tiny_music_basket`
8. `cat_cupboard_locks_cable_tidy`
9. `cat_transition_basket`
10. `cat_out_and_about_kit`

**Quarantine:** empty (research JSON)

## Founder HTML

- Rows: `agent-tools/exports/stage3/13-15m/founder-preview/stage3_founder_review_rows_13-15m.json` (60 pick rows / 10 categories)
- HTML: `agent-tools/exports/stage3/13-15m/founder-preview/stage3_founder_review_13-15m.html`

## Blockers / founder QA notes

1. **John Lewis availability timeouts** — several JL primaries were swapped for Boots / Bebeco / IKEA / Lovevery / specialist UK hosts during Mode A re-research after FF `availability_fetch_failed:timeout`.
2. **Brand concentration** — FF max-2 brand gate forced swaps (esp. IKEA baskets, Dreambaby locks, ezpz cups). Locks card uses Dreambaby strap + cord shortener plus IKEA lead-parking baskets + a Hape rainmaker as third-brand distraction while latching — founder should read HOW trail.
3. **Specialist ratings** — many Top Picks use specialist exemption (`rating_count` null) with written notes; no invented review volume.
4. **Boots bot-interruption pages** — Lamaze / Toomies / Nuby URLs often return smoke 200 with interruption title; availability still buyable in this run — founder should click-check.
5. **Copy bar** — Writing Guidelines bans applied via shared module; Best for tags normalised to `Best for …` (≤6 words after prefix).
6. **Generator filter fix** — `generate-stage3-founder-rows.mjs` now excludes `*.availability.json` so founder HTML is not double-counted.

## Not done (by design)

- Ingestion / Discover publish
- PR / Vercel preview
- Paid-member gating verification on live `/discover`

## How to verify

1. Open `agent-tools/exports/stage3/13-15m/founder-preview/stage3_founder_review_13-15m.html`
2. Confirm 10 category HOW panels and green badges
3. Spot-check primary links in browser (esp. Boots + IKEA)
4. Diff green JSON vs shortlist entity IDs in `registry/ownership_depth_manifest.json`
