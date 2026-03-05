# Marketplace listings backend (schema + storage + pg_trgm suggestions)

## Goal
One PR: enable (a) pre-launch marketplace listings schema, (b) photo upload storage, (c) fuzzy item-type suggestions using pg_trgm.

## Summary
- **Branch:** `feat/marketplace-listings-backend`
- **Migrations:** Apply in Supabase SQL Editor in filename order (see below).
- **RLS:** All new tables have RLS; storage bucket has path-based policies. Supabase auth only.

## Migrations (run in order)
1. `supabase/sql/202603051200_marketplace_pg_trgm_item_types.sql` — pg_trgm extension, `marketplace_item_types` table (search_text, GIN index), seed data
2. `supabase/sql/202603051201_marketplace_listings_tables.sql` — `marketplace_listings`, `marketplace_listing_photos`, `marketplace_preferences`
3. `supabase/sql/202603051202_marketplace_rls.sql` — RLS on all new tables
4. `supabase/sql/202603051203_marketplace_storage.sql` — bucket `marketplace-listing-photos`, storage.objects policies
5. `supabase/sql/202603051204_marketplace_suggest_rpc.sql` — `suggest_marketplace_item_types(query_text, limit)` RPC

## How to test in Supabase

### 1. Apply migrations
In **Supabase Dashboard → SQL Editor**, run each migration file above in order. Fix any schema/extension issues (e.g. if `pg_trgm` is in `extensions` schema, the RPC `search_path` already includes it).

### 2. RLS
- As **User A**: insert a row into `marketplace_listings` (user_id = your auth.uid()).
- As **User B** (or anon): confirm you cannot SELECT that row.
- Confirm `marketplace_listing_photos` and `marketplace_preferences` are similarly restricted (own rows / own listing only).

### 3. Storage bucket
- In **Storage**: confirm bucket `marketplace-listing-photos` exists and is **private**.
- Upload a file to path `{your_user_id}/{any_listing_id}/test.jpg` as an authenticated user — should succeed.
- Upload to another user’s path or as anon — should fail. SELECT/DELETE only for paths under your `user_id` folder.

### 4. RPC suggestions
In SQL Editor (as authenticated or via service role):

```sql
SELECT * FROM public.suggest_marketplace_item_types('chair', 5);
-- Expect: high chair, bath chair, booster seat, car seat, etc. with similarity_score

SELECT * FROM public.suggest_marketplace_item_types('hi chair', 5);
-- Expect: high chair as strong candidate

SELECT * FROM public.suggest_marketplace_item_types('bath', 5);
-- Expect: bath chair / bath seat as candidate
```

Or run the smoke test file: `docs/marketplace_smoke_tests.sql`.

## App usage (for later)
- **Listings:** Use `marketplace_listings` (and optional `child_id`) with status draft/submitted/archived; link photos via `marketplace_listing_photos.storage_path` under bucket `marketplace-listing-photos` with path `{user_id}/{listing_id}/{filename}`.
- **Preferences:** One row per user in `marketplace_preferences` (postcode, radius_miles, optional lat/lng).
- **Suggestions:** Call `suggest_marketplace_item_types(raw_item_text, 5)` and use returned `item_type_id`, `canonical_name`, `slug`, `similarity_score` for type-ahead or normalization.

## Definition of done
- [x] Migrations apply cleanly on Supabase
- [x] RLS: user cannot read other users’ listings or photos
- [x] Bucket exists and policies enforce per-user access
- [x] RPC returns sensible suggestions for "chair" and "hi chair"
- [ ] PR opened (this), description includes how to test in Supabase UI + app
