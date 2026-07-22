# Stage 3 ingestion bundle QA - 31-33m

Generated: 2026-07-20T18:44:46.836Z
Migration: `supabase/migrations/20260720193100_ingest_stage3_pips_picks_31_33m.sql`

## Summary

| Category | Top picks | Backups | Skips | Ingestion | Notes |
|---|---:|---:|---:|---|---|
| Big soft ball for turn-taking | 10 | 4 | 10 | pass | WARN: Expected at least 5 dormant backups after visible 10, got 4 |
| Chunky crayons and big paper | 10 | 5 | 5 | pass | OK |
| Feeling faces and story books | 10 | 5 | 19 | pass | OK |
| Hoops, beanbags and jump markers | 10 | 5 | 11 | pass | WARN: Expected 15 longlist entries for classic depth, got 10<br>WARN: Top pick not matched to longlist_rank 1: Jump-In Hoops & Bean Bags (part of The Researcher Play Kit)<br>WARN: Top pick not matched to longlist_rank 2: Plastic Hula Hoop Set (45.7cm)<br>WARN: Top pick not matched to longlist_rank 3: Play Bean Bags Pack Of 4<br>WARN: Top pick not matched to longlist_rank 4: Sequencing Floor Marker Spots (Pack of 6)<br>WARN: Top pick not matched to longlist_rank 5: Deluxe Hoop (60cm) |
| Picture books with little stories | 10 | 5 | 5 | pass | OK |
| Pouring cups and water lab | 10 | 5 | 5 | pass | OK |
| Safe step-up stool or learning tower | 10 | 4 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 10, got 4 |
| Soft doll or teddy care play | 10 | 4 | 5 | pass | WARN: Expected at least 5 dormant backups after visible 10, got 4 |

## Signed-Out API Smoke Template

After the migration is applied and deployed, call:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result: rank 1 real product with URL; ranks 2-10 locked placeholders with no URLs.
