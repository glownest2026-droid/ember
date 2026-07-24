# Stage 3 status — 16-18m

**Date:** 2026-07-24  
**Stop:** founder HTML (no ingest, no PR)

## Outcome

| Bucket | Count | Categories |
|--------|------:|------------|
| Green | 7 | all manifest categories |
| Quarantine | 0 live fails | Prior FF fail snapshots remain under `research/quarantine/` for audit; all categories now green |

### Green

1. `cat_soft_graspable_balls` — Soft balls to roll and chase (single 5/15)
2. `cat_stacking_pegboard` — Stacking pegboards and block towers (single 5/15)
3. `cat_ramp_rolling_toys` — Ramp and rolling toys (single 5/15)
4. `cat_first_word_picture_books` — First-word picture books (multiple 10/25)
5. `cat_doll_soft_toy_care` — Soft toy and doll care play (single 5/15)
6. `cat_chunky_crayons` — Chunky crayons and first scribbles (single 5/15)
7. `cat_open_cup` — Open or free-flow cup (single 5/15)

## Founder HTML

`agent-tools/exports/stage3/16-18m/founder-preview/stage3_founder_review_16-18m.html`  
Rows JSON: `…/stage3_founder_review_rows_16-18m.json` (45 product rows, 7 HOW panels)

## Blockers / founder QA notes

- **Amazon UK** avoided as primary (bot wall). Specialists: Toytastic, Adventure Toys, Priddy, Barefoot, Penguin, Bookshop.org, Boots, Vital Baby, Smyths.
- **Bookshop.org** intermittently 403/unknown during research; final Top 10 re-verified buyable before green.
- **Barefoot / Priddy** PDPs intermittently 404 mid-run; re-probed and locked before FF pass.
- **Age flags:** FlipCar / Migoga Sound / Hape musical stacker use `founder_qa_flag: check_age_fit` where listing min is 18m (band overlap at upper end only). Cerda Bing crayons soft age mark → `check_age_fit`.
- **Open cups:** True open rim = Doidy; free-flow = Vital Baby + Tommee Tippee; Philips Avent is soft-spout trainer spare (not open). Miracle 360 / Nuby no-spill kept out of Top 5.
- **UK host allowlist:** added `superdrug.com`, `vitalbaby.com`, `growingsmiles.co.uk` in `stage3-uk-market.mjs` for this band’s buyable UK PDPs.

## Next (not done)

- Founder review of HTML  
- `$ember-stage3-card-ingestion` only after founder GO  
