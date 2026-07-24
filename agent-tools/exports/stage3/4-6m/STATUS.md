# Stage 3 status — 4–6m

**Date:** 2026-07-24  
**Stop at:** founder HTML (no ingest, no PR)  
**Manifest:** `agent-tools/exports/stage3/4-6m/registry/ownership_depth_manifest.json`

## Counts

| Bucket | Count | Categories |
|---|---|---|
| **Green** | **7 / 7** | tummy_time_mat, reach_grab_toys, teethers, board_books, kick_play_socks, parts_of_me_books, highchair |
| Quarantine (live research) | **0** | — |
| Inbox | **0** | — |

Older failed drafts may still sit under `research/quarantine/` as archaeology; live FF-passed JSON is only in `research/green/`.

## Ownership depth

| Category | Class | Top N | Longlist N | Status |
|---|---|---|---|---|
| cat_tummy_time_mat | single | 5 | 15 | green |
| cat_reach_grab_toys | single | 5 | 15 | green |
| cat_teethers | single | 5 | 15 | green |
| cat_board_books | multiple | 10 | 25 | green |
| cat_kick_play_socks | single | 5 | 15 | green |
| cat_parts_of_me_books | multiple | 10 | 25 | green |
| cat_highchair | single | 5 | 15 | green |

## Founder HTML

- Rows: `agent-tools/exports/stage3/4-6m/founder-preview/stage3_founder_review_rows_4-6m.json` (50 product rows, 7 HOW panels)
- HTML: `agent-tools/exports/stage3/4-6m/founder-preview/stage3_founder_review_4-6m.html`

## What was done

1. Mode A re-research from quarantine name/evidence hints into inbox (Writing Guidelines copy, schema v3, ownership_class).
2. FF checker loops: banned-copy scrub (esp. en/em dashes in `rank_rationale`), URL/availability swaps away from Hamleys timeouts, Amazon bot walls, Argos 403.
3. All 7 passed FF → `green/`.
4. Founder preview built from green only.

## Notable product notes (founder QA)

- **Teethers #2:** Matchstick Monkey primary is Ocado mint green Original (`…/619524011`); Argos/brand as alts (brand 429 / Argos availability 403 under bot checks).
- **Reach #1–2:** Freddie + Captain Calamari primaries on Ocado (John Lewis smoke OK but availability timed out).
- **Kick socks #4:** Sophie kept as mouthing companion after kicks; #5 Jacques Peacock as hanging kick target (keeps Lamaze brand concentration ≤2).
- **Teethers / reach #3–4:** Sophie So Pure Soft on Coolshop substituted for Hamleys multi-textured (timeouts).

## Blockers

None for founder review. Ready for founder HTML read + ingest approval.

## Next (not done here)

- Founder approve green HTML
- `$ember-stage3-card-ingestion` when ready
- Do **not** ingest until founder GO
