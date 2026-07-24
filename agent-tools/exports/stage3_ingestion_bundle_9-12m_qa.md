# Stage 3 ingestion bundle QA - 9-12m

Generated: 2026-07-24T11:05:59.281Z
Migration: `supabase/migrations/20260724120003_ingest_stage3_pips_picks_9_12m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Books with pauses | 10 | 14 | 5 | pass | OK |
| Bubbles for watching and reaching | 5 | 10 | 5 | pass | OK |
| Faces and feelings books | 10 | 15 | 5 | pass | OK |
| Highchair or upright feeding seat | 5 | 10 | 5 | pass | OK |
| Peekaboo cloths and scarves | 5 | 10 | 5 | pass | OK |
| Pincer puzzles and peg drops | 5 | 10 | 5 | pass | OK |
| Stable push and pull toys | 5 | 10 | 5 | pass | OK |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-mixed locked placeholders with no URLs.
