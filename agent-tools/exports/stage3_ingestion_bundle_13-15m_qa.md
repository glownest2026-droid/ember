# Stage 3 ingestion bundle QA - 13-15m

Generated: 2026-07-24T11:05:59.540Z
Migration: `supabase/migrations/20260724120004_ingest_stage3_pips_picks_13_15m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Large paper pads | 5 | 10 | 5 | pass | OK |
| Lift-the-flap books | 10 | 15 | 5 | pass | OK |
| Cupboard locks and cable tidies | 5 | 10 | 5 | pass | OK |
| Small open cups | 5 | 10 | 5 | pass | OK |
| Out-and-about toy pouch | 5 | 9 | 5 | pass | OK |
| Push and pull toys | 5 | 10 | 5 | pass | OK |
| Teddies and soft dolls for caring play | 5 | 10 | 5 | pass | OK |
| Simple shakers and first instruments | 5 | 10 | 5 | pass | OK |
| Small transition basket | 5 | 10 | 5 | pass | OK |
| Blocks for stacking and crashing | 5 | 10 | 5 | pass | OK |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-mixed locked placeholders with no URLs.
