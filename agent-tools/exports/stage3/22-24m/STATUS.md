# Stage 3 STATUS — 22–24m

**Date:** 2026-07-24  
**Stop point:** Founder HTML (no ingest, no PR)  
**Manifest:** `agent-tools/exports/stage3/22-24m/registry/ownership_depth_manifest.json`

## Result

| State | Count | Categories |
|---|---|---|
| **Green** | **7 / 7** | All manifest categories |
| Quarantine (live fails) | **0** | — |
| Inbox | Empty (ready) | — |

### Green (FF pass)

1. `cat_play_kitchen_household_props` — single (5/15)
2. `cat_picture_story_books` — multiple (10/25)
3. `cat_colour_sorting_matching` — single (5/15)
4. `cat_large_balls` — single (5/15)
5. `cat_learning_tower_step_stool` — single (5/15)
6. `cat_potty_chair` — single (5/15)
7. `cat_feelings_faces_books` — multiple (10/25)

Green path: `agent-tools/exports/stage3/22-24m/research/green/`

## Founder HTML

`agent-tools/exports/stage3/22-24m/founder-preview/stage3_founder_review_22-24m.html`

Rows JSON: `…/founder-preview/stage3_founder_review_rows_22-24m.json` (50 rows = 45 Top picks + safety quick checks)

## Blockers / founder flags

Not blocking FF, but confirm before ingest:

- **Learning towers:** LTC brand site and Maxi-Cosi John Lewis timed out / 429 to bots — Top 5 uses Tutti Bambini + hauck (Dunelm) + IKEA TROGEN/FORSIKTIG + BabyBjörn step (Boots). Enclosed-tower depth is thinner than ideal.
- **Play kitchen:** Bigjigs primaries moved to Smyths (brand site 429). Confirm Smyths product titles match breakfast set / butchers crate.
- **Large balls:** Argos/Decathlon foam blocked — #3 is IKEA SPARKA soft football.
- **Picture / feelings books:** uk.bookshop.org intermittent 403 — many Top picks use Hachette / Penguin / LoveReading primaries. Confirm stock and edition (board vs paperback).
- **Potty:** Mamas & Papas 429 — #5 is Pourty toilet seat (Boots) instead of anti-slip floor potty.
- **Ownership:** Colour Monster / Bear Hunt / Dear Zoo / Caterpillar — high shelf duplication; borrow-first notes in research.

## Process notes

- Ownership depth applied: `single` → 5/15; `multiple` → 10/25; `ownership_class` set on each pack.
- Mode A → FF → quarantine re-research (Best for prefix, Why Pip word counts, URL/availability swaps) → green → founder HTML.
- Stale prior-fail JSON may still sit under `research/quarantine/` for audit; **do not treat as current**. Live fail count is 0.

## Next (not done)

- Founder review of HTML  
- Then `$ember-stage3-card-ingestion` only after approval  
- **No ingest / no PR in this run**
