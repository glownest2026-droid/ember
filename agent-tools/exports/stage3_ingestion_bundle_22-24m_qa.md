# Stage 3 ingestion bundle QA - 22-24m

Generated: 2026-07-24T11:06:00.517Z
Migration: `supabase/migrations/20260724120007_ingest_stage3_pips_picks_22_24m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Colour sorting and matching games | 5 | 5 | 5 | pass | OK |
| Feeling stories and face books | 10 | 8 | 5 | pass | OK |
| Large balls for kicking and chasing | 5 | 2 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 2 |
| Learning tower or safe step stool | 5 | 1 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 1 |
| Picture books with a little story | 10 | 3 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 10, got 3 |
| Play kitchen and household props | 5 | 10 | 5 | pass | OK |
| Potty chair for practice sitting | 5 | 0 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 5, got 0 |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-mixed locked placeholders with no URLs.
