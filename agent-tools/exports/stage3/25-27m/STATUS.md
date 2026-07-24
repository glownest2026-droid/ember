# Stage 3 — 25-27m STATUS

**Date:** 2026-07-24  
**Stop point:** founder HTML (no ingest, no PR)  
**Manifest:** `registry/ownership_depth_manifest.json` (8 categories)

## Counts

| Bucket | Count | Categories |
|---|---|---|
| **Green** | **7** | bedtime_board_books, feelings_faces_books, picture_story_books, potty, shape_sorters_puzzles, soft_graspable_balls, step_stool |
| **Quarantine** | **1** | play_kitchen_household_props |
| Inbox | 0 | — |

## Founder HTML

- Rows: `agent-tools/exports/stage3/25-27m/founder-preview/stage3_founder_review_rows_25-27m.json` (55 rows / 7 categories)
- Preview: `agent-tools/exports/stage3/25-27m/founder-preview/stage3_founder_review_25-27m.html`

## Ownership depth shipped

| Category | Class | Top / longlist | FF |
|---|---|---|---|
| cat_picture_story_books | multiple | 10 / 25 | green |
| cat_feelings_faces_books | multiple | 10 / 25 | green |
| cat_bedtime_board_books | multiple | 10 / 25 | green |
| cat_step_stool | single | 5 / 15 | green |
| cat_potty | single | 5 / 15 | green |
| cat_soft_graspable_balls | single | 5 / 15 | green |
| cat_shape_sorters_puzzles | single | 5 / 15 | green |
| cat_play_kitchen_household_props | single | 5 / 15 | **quarantine** |

All green packs: `schema_version = ember_picks_research_v3`, `ownership_class` set, UK primaries, Writing Guidelines-clean public copy (FF banned-copy gate).

## Quarantine blocker — kitchen props

**Category:** `cat_play_kitchen_household_props`  
**Mode A re-research done** (see `research/_gen/write-07-kitchen.mjs` + quarantine JSON).

### What cleared (ranks 1–3)

1. **Bigjigs Wooden Breakfast Set** — Jarrolds, 18 months and over, buyable  
2. **Bigjigs Wooden Pots and Pans** — Wooden Toy Shop, 18 months and over, buyable  
3. **Tidlo Cutting Fruits** — Wooden Toy Shop, 18 months and over, buyable  

### What still fails FF (ranks 4–5)

4. **Tender Leaf Breakfast Toaster** — Jarrolds buyable, **Age 3+**  
5. **Hape Pop-up Toaster** — Adventure Toys buyable, **Age 3+**

These are the next UK-buyable toaster alternatives after the 18m+ Bigjigs breakfast set; both fail the under-36 age gate.

### Why a fifth age-safe brand is missing

- Freestanding kitchens + IKEA DUKTIG soft food/utensils: **from 3 years**  
- Little Dutch Mini Kitchen: **2+** but UK hosts OOS / 429 / non-UK  
- Amazon / Argos / Smyths: bot-walled in-agent  
- Extra 18m+ Bigjigs props exist (cookie baking, casserole, dinner service) but **brand cap two** already used by breakfast + pots  
- Only one non-Bigjigs 18m+ chopping set cleared (Tidlo). PlanToys Cupcake (Age 2+) is a candidate for a later Mode A swap into rank 4; still need a **fifth** age-safe brand for a full green Top 5  

### Founder options before green

1. Approve a fifth UK age-safe brand/host (or waive brand cap for this category once)  
2. Accept Top 3 only temporarily (schema still expects 5 — not FF-green)  
3. Hold kitchen until 34-36m when 3+ toaster sets become eligible  

## How to verify

1. Open founder HTML path above (7 HOW panels)  
2. Spot-check green JSON under `research/green/`  
3. Read `research/quarantine/ff_check_cat_play_kitchen_household_props.md` for kitchen fail reasons  

## Not done (by design)

- Ingest / Discover publish  
- PR / Vercel preview  
