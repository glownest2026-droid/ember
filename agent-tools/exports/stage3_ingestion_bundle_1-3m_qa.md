# Stage 3 ingestion bundle QA - 1-3m

Generated: 2026-07-23T20:20:00.562Z
Migration: `supabase/migrations/20260723250000_ingest_stage3_pips_picks_1_3m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Baby-safe mirror for faces | 5 | 10 | 5 | pass | OK |
| Board books and face books | 5 | 10 | 6 | pass | OK |
| Muslins and burp cloths | 5 | 10 | 5 | pass | OK |
| Firm, flat, waterproof mattress | 5 | 8 | 6 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 8 |
| High-contrast cards and simple patterns | 5 | 10 | 6 | pass | OK |
| Reach-and-grab toys | 5 | 8 | 6 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 8 |
| Rear-facing infant car seat | 5 | 10 | 5 | pass | OK |
| Soft Carrier Sling | 5 | 10 | 5 | pass | OK |
| Washable Floor Play Mat | 5 | 10 | 6 | pass | OK |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-5 locked placeholders with no URLs.
