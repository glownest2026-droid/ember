# Stage 3 ingestion bundle QA - 25-27m

Generated: 2026-07-24T11:06:00.799Z
Migration: `supabase/migrations/20260724120008_ingest_stage3_pips_picks_25_27m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Bedtime books with familiar steps | 10 | 15 | 5 | pass | OK |
| Books about faces and feelings | 10 | 15 | 5 | pass | OK |
| Books that start little chats | 10 | 15 | 5 | pass | OK |
| A potty to practise sitting | 5 | 10 | 5 | pass | OK |
| Chunky puzzles and shape sorters | 5 | 10 | 5 | pass | OK |
| Soft balls to kick and chase | 5 | 10 | 5 | pass | OK |
| A steady step for helping | 5 | 10 | 5 | pass | OK |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-mixed locked placeholders with no URLs.
