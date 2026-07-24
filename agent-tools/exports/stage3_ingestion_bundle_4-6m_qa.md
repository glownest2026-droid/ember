# Stage 3 ingestion bundle QA - 4-6m

Generated: 2026-07-24T11:05:58.403Z
Migration: `supabase/migrations/20260724120001_ingest_stage3_pips_picks_4_6m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Chunky board books | 10 | 15 | 5 | pass | OK |
| A supportive highchair | 5 | 10 | 5 | pass | OK |
| Kick-and-discover socks | 5 | 10 | 5 | pass | OK |
| Body-part board books | 10 | 15 | 5 | pass | OK |
| Reach-and-grab toys | 5 | 10 | 5 | pass | OK |
| Teethers and chew-safe toys | 5 | 10 | 5 | pass | OK |
| A clean floor-play mat | 5 | 10 | 5 | pass | OK |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-mixed locked placeholders with no URLs.
