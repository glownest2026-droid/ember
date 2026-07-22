# Stage 3 ingestion bundle QA - 34-36m

Generated: 2026-07-20T18:44:47.236Z
Migration: `supabase/migrations/20260720193200_ingest_stage3_pips_picks_34_36m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Balance paths and stepping stones | 10 | 5 | 5 | pass | OK |
| Feelings and friendship books | 10 | 5 | 10 | pass | OK |
| Threading beads and chunky lacing | 10 | 5 | 7 | pass | OK |
| Visual routine cards and timers | 10 | 5 | 13 | pass | OK |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-10 locked placeholders with no URLs.
