# Stage 3 STATUS — 6-9m (UI: 7–9 months)

**Date:** 2026-07-24  
**Stop point:** Founder HTML (no ingest, no PR)  
**Age:** `age_band_id` `6-9m`, `min_months` 7, `max_months` 9  
**Schema:** `ember_picks_research_v3` · `ingestion_ready.status` promoted by FF to founder-review-ready on green

## Counts

| Bucket | Count |
|--------|------:|
| Green (FF pass) | **8** |
| Quarantine | **0** |
| Manifest categories | 8 |

### Green categories

1. `cat_reach_grab_toys` (single)
2. `cat_tummy_time_wobbler` (single)
3. `cat_peekaboo_scarf` (single)
4. `cat_stacking_nesting_cups` (single)
5. `cat_teethers` (single)
6. `cat_highchair` (single)
7. `cat_safety_gates` (single)
8. `cat_board_books` (multiple Top 10)

## Founder HTML

`agent-tools/exports/stage3/6-9m/founder-preview/stage3_founder_review_6-9m.html`

Rows JSON: `agent-tools/exports/stage3/6-9m/founder-preview/stage3_founder_review_rows_6-9m.json`

## Blockers / founder notes

1. **Retailer bot walls (research env):** Argos (`403`) and John Lewis (timeout) fail availability. Primaries were moved to Boots, Smyths, IKEA, Chicco, Penguin, TTS, The Little Sensory Bag Co, Little Baby Company, Safetots, Priddy. Amazon UK often marks buyable but fails URL smoke (`amazon_bot_wall_unverified`) — avoided as Top N primary.
2. **Board books ranks 7–10:** Include publisher “twin” listings (Dear Zoo / Spot / Peepo) for buyability depth under `multiple` ownership — do not double-buy the same title.
3. **Munchkin Caterpillar Spillers:** Listing age **9 months+** sits at the top edge of this band — founder age QA.
4. **Peekaboo scarves rank 5:** Bring-back muslin (ownership risk) — intentional; cloth buys are ranks 1–4.
5. **Stacking cups:** Includes adjacent Oball / Rock-a-Stack / rattle when Amazon cup SKUs failed smoke — founder confirm cup-brief fit.
6. **Highchair:** Stokke baby-set inclusion — founder confirm on Boots PDP.
7. **Gates:** Confirm opening widths on Boots / Safetots PDPs before install guidance goes live.
8. **Copy padding:** Some Why Pip lines were padded to hit 40–60 words after URL swaps; founder read-aloud still recommended on green HTML.

## Not done (by design)

- No ingestion  
- No PR  
- No Discover cache bump  

## Paths

- Research green: `agent-tools/exports/stage3/6-9m/research/green/`  
- Ledgers: `agent-tools/exports/stage3/6-9m/research/ledgers/`  
- Manifest: `agent-tools/exports/stage3/6-9m/registry/ownership_depth_manifest.json`
