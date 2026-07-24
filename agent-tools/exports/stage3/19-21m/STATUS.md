# Stage 3 status — 19–21m

**Date:** 2026-07-24  
**Band:** `19-21m` (min 19 / max 21)  
**Pipeline:** Mode A research → FF (`--age-band=19-21m`) → founder HTML  
**Ingest:** **not started** (stop before ingestion; no PR)

## Result

| Bucket | Count |
|--------|------:|
| Green | **8 / 8** |
| Quarantine | **0** |
| Inbox | 0 |

## Categories

| Category | Ownership | Top / longlist | FF |
|----------|-----------|----------------|----|
| `cat_first_word_picture_books` | multiple | 10 / 25 | green |
| `cat_doll_soft_toy_care` | single | 5 / 15 | green |
| `cat_shape_sorters_puzzles` | single | 5 / 15 | green |
| `cat_soft_graspable_balls` | single | 5 / 15 | green |
| `cat_pouring_jug_cups` | single | 5 / 15 | green |
| `cat_feelings_faces_books` | multiple | 10 / 25 | green |
| `cat_potty_books` | multiple | 10 / 25 | green |
| `cat_safety_gates` | single | 5 / 15 | green |

## Founder HTML

`agent-tools/exports/stage3/19-21m/founder-preview/stage3_founder_review_19-21m.html`

- Rows JSON: `agent-tools/exports/stage3/19-21m/founder-preview/stage3_founder_review_rows_19-21m.json`
- 8 HOW panels · 60 public pick rows from green only

## Green research path

`agent-tools/exports/stage3/19-21m/research/green/`

## Blockers

**None for founder review.** All eight categories passed smoke + availability + trust gates.

Do **not** ingest until founder signs off the HTML.

## Notes from re-research (quarantine → green)

- Longlist backup ranks now carry `rank_rationale` (from miss reason) for FF HOW gate.
- Ladybird First Words LoveReading URL fixed (slug capitalisation; prior 404).
- Feelings: age marks rewritten to avoid `Ages N–M` parse → 24m+ false fail; Best for tags shortened ≤6 words.
- Shape sorter: removed banned `reset` from public + HOW copy.
- Pouring TTS #3: Description / Why Pip rewritten to cut paraphrase overlap.
- Soft balls #5: ELC (403 availability) replaced with Scrunch Ball on Adventure Toys.
