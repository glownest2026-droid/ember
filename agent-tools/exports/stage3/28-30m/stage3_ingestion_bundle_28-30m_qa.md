# Stage 3 ingestion bundle QA - 28-30m

Generated: 2026-07-20T18:44:46.667Z
Migration: `supabase/migrations/20260720193000_ingest_stage3_pips_picks_28_30m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Feeling stories and face books | 10 | 5 | 5 | pass | OK |
| Picture books with questions | 10 | 5 | 5 | pass | OK |
| Play kitchen and household props | 10 | 5 | 5 | pass | OK |
| A potty to practise sitting | 10 | 5 | 5 | pass | OK |
| Chunky puzzles and shape sorters | 10 | 5 | 10 | pass | OK |
| Soft balls to kick and chase | 10 | 5 | 5 | pass | OK |
| A steady step for helping | 10 | 2 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 10, got 2 |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-10 locked placeholders with no URLs.
