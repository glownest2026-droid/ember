# Stage 3 ingestion bundle QA - 16-18m

Generated: 2026-07-24T11:05:59.832Z
Migration: `supabase/migrations/20260724120005_ingest_stage3_pips_picks_16_18m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Chunky crayons and first scribbles | 5 | 10 | 5 | pass | OK |
| Soft toy and doll care play | 5 | 10 | 5 | pass | OK |
| First-word picture books | 10 | 12 | 5 | pass | OK |
| Open or free flow cup | 5 | 10 | 5 | pass | OK |
| Ramp and rolling toys | 5 | 10 | 5 | pass | OK |
| Soft balls to roll and chase | 5 | 10 | 5 | pass | OK |
| Stacking pegboards and block towers | 5 | 10 | 5 | pass | OK |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-mixed locked placeholders with no URLs.
