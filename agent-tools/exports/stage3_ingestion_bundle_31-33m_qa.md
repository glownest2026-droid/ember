# Stage 3 ingestion bundle QA - 31-33m

Generated: 2026-07-23T19:56:06.521Z
Migration: `supabase/migrations/20260723240200_ingest_stage3_pips_picks_31_33m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Big soft ball for turn-taking | 5 | 7 | 10 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 7 |
| Chunky crayons and big paper | 5 | 10 | 5 | pass | OK |
| Feeling faces and story books | 5 | 10 | 19 | pass | OK |
| Hoops, beanbags and jump markers | 5 | 10 | 11 | fail | ERROR: Expected at least 15 longlist entries, got 10<br>WARN: Top pick not matched to longlist_rank 1: Jump-In Hoops & Bean Bags (part of The Researcher Play Kit)<br>WARN: Top pick not matched to longlist_rank 2: Plastic Hula Hoop Set (45.7cm)<br>WARN: Top pick not matched to longlist_rank 3: Play Bean Bags Pack Of 4<br>WARN: Top pick not matched to longlist_rank 4: Sequencing Floor Marker Spots (Pack of 6)<br>WARN: Top pick not matched to longlist_rank 5: Deluxe Hoop (60cm) |
| Picture books with little stories | 5 | 10 | 5 | pass | OK |
| Pouring cups and water lab | 5 | 10 | 5 | pass | OK |
| Safe step-up stool or learning tower | 5 | 6 | 5 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 6 |
| Soft doll or teddy care play | 5 | 9 | 5 | pass | WARN: Expected at least 10 dormant backups after visible 5, got 9 |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-5 locked placeholders with no URLs.
