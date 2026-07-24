# Stage 3 status — 9–12m (UI: 10–12 months)

**Date:** 2026-07-24  
**Mode:** A research → FF → founder HTML  
**Stop:** before ingestion (no ingest, no PR)

## Band

- `age_band_id`: `9-12m`
- Preferred months overlap: **min 10 / max 12**
- Market: UK only · schema `ember_picks_research_v3`
- Ownership depth: single → 5/15; multiple → 10/25

## Green (7/7)

| Category | Ownership | Depth | Path |
|---|---|---|---|
| `cat_push_pull_toys` | single | 5/15 | `research/green/ember_picks_9-12m_cat_push_pull_toys.json` |
| `cat_pincer_puzzle` | single | 5/15 | `research/green/ember_picks_9-12m_cat_pincer_puzzle.json` |
| `cat_peekaboo_scarf` | single | 5/15 | `research/green/ember_picks_9-12m_cat_peekaboo_scarf.json` |
| `cat_board_books` | multiple | 10/25 | `research/green/ember_picks_9-12m_cat_board_books.json` |
| `cat_highchair` | single | 5/15 | `research/green/ember_picks_9-12m_cat_highchair.json` |
| `cat_feelings_faces_books` | multiple | 10/25 | `research/green/ember_picks_9-12m_cat_feelings_faces_books.json` |
| `cat_bubbles` | single | 5/15 | `research/green/ember_picks_9-12m_cat_bubbles.json` |

Quarantine: **empty of failing research** (sidecar history may remain from earlier FF rounds).

## Founder HTML

- Rows: `founder-preview/stage3_founder_review_rows_9-12m.json` (45 Top Pick rows + 5 script safety stubs)
- HTML: **`founder-preview/stage3_founder_review_9-12m.html`**

## FF loop notes

First FF: green `feelings_faces_books`, `highchair`; quarantine the other five.  
Re-research fixed: specialist evidence notes ≥40 chars; methodology `bench`/`age`/`rank`/`url`; board Bookshop 403 URLs swapped to Penguin / LoveReading4Kids / buyable Bookshop; bubbles under-3 machines replaced with adult-blown + hold-off; Pustefix capped at 2 brands.

## Blockers / founder click-checks (not ingest blockers)

1. **Bubbles** — almost all machines are 3+; green set is intentionally parent-blown / hold-off. Confirm that framing is what you want live.
2. **Highchair** — Boots / brand pages: click-check buyability and age fit on preview before ingest.
3. **Peekaboo** — limited UKCA scarf SKUs; rank 4 is a Hape mirror puzzle as adjacent peek; muslin is bring-back-out.
4. **Board vs feelings books** — intentional shelf overlap (faces / Looking books).
5. **Founder HTML safety stubs** — `generate-stage3-founder-rows.mjs` still injects near-3 safety quick checks; ignore for 9–12m or strip before sharing externally.
6. **Research env** — Amazon soft-404, Argos/Bookshop intermittent 403, Smyths bot stubs; many Top Picks use specialist exemption with written notes.

## Next (not done)

- Founder review of HTML
- Then `$ember-stage3-card-ingestion` only after approval
