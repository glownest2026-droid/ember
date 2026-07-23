# Stage 3 ingestion bundle QA - 28-30m

Generated: 2026-07-23T20:57:38.347Z
Migration: `supabase/migrations/20260723261001_ingest_stage3_pips_picks_28_30m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Feeling stories and face books | 5 | 10 | 5 | pass | OK |
| Picture books with questions | 5 | 10 | 5 | pass | OK |
| Play kitchen and household props | 5 | 10 | 5 | pass | OK |
| A potty to practise sitting | 5 | 7 | 5 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 7 |
| Chunky puzzles and shape sorters | 5 | 10 | 10 | pass | OK |
| Soft balls to kick and chase | 5 | 10 | 5 | pass | OK |
| A steady step for helping | 5 | 7 | 5 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 7 |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-5 locked placeholders with no URLs.
