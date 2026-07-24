# Stage 3 ingestion bundle QA - 19-21m

Generated: 2026-07-24T11:06:00.201Z
Migration: `supabase/migrations/20260724120006_ingest_stage3_pips_picks_19_21m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| A doll or teddy to care for | 5 | 3 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 3 |
| Feelings and faces books | 10 | 0 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 10, got 0 |
| first word books to point at | 10 | 5 | 5 | pass | OK |
| Potty and bathroom books | 10 | 0 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 10, got 0 |
| Pouring jugs and water cups | 5 | 0 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 0 |
| Safety gates for stairs | 5 | 3 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 3 |
| Shape sorters and first puzzles | 5 | 0 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 0 |
| Soft balls to kick and chase | 5 | 0 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 0 |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-mixed locked placeholders with no URLs.
