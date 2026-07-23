# Stage 3 ingestion bundle QA - 34-36m

Generated: 2026-07-23T13:52:56.953Z
Migration: `supabase/migrations/20260723145256_ingest_stage3_pips_picks_34_36m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Balance paths and stepping stones | 5 | 10 | 6 | pass | OK |
| Feelings and friendship books | 5 | 10 | 7 | pass | OK |
| First jigsaw puzzles | 5 | 9 | 5 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 9 |
| Picture story books with questions | 5 | 10 | 7 | pass | OK |
| Small-world people and vehicles | 5 | 8 | 6 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 8 |
| Threading beads and chunky lacing | 5 | 10 | 6 | pass | OK |
| Visual routine cards and timers | 5 | 9 | 11 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 9 |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-5 locked placeholders with no URLs.
