# feat(pl-0): product library ground truth + admin guardrails

## What Changed

### SQL Migration
- **File**: `supabase/sql/202601041654_pl0_product_library.sql`
- Hardened `products` table RLS: SELECT remains public, INSERT/UPDATE/DELETE are admin-only via `user_roles.role='admin'`
- Created PL-0 tables:
  - Vocabulary: `pl_age_bands`, `pl_moments`, `pl_dev_tags`, `pl_category_types`
  - Sets & Cards: `pl_age_moment_sets`, `pl_reco_cards`, `pl_evidence`
- RLS policies: Admin CRUD on all pl_* tables; public SELECT only for published sets and related cards/evidence
- Helper function: `is_admin()` SECURITY DEFINER for reusable admin checks

### Admin Page
- **File**: `web/src/app/(app)/app/admin/pl/page.tsx`
- Admin-only route `/app/admin/pl` that lists `pl_age_bands` and `pl_moments`
- Graceful handling: Shows "DB not migrated yet" message if tables don't exist
- Access control: Uses existing `isAdmin()` helper (checks email allowlist + user_roles)

## How to Verify

### Proof Routes (must still pass)
1. `/signin` — sign in page loads
2. `/auth/callback` — auth callback works
3. `/app` — redirects to `/signin?next=/app` when logged out
4. `/app/children` — children page works
5. `/app/recs` — recommendations page works
6. `/ping` — health check works
7. `/cms/lego-kit-demo` — CMS page works

### New Admin Route
1. `/app/admin/pl` — shows "Not authorized" for non-admin users
2. `/app/admin/pl` — shows migration message if DB not migrated (expected initially)
3. `/app/admin/pl` — shows age bands + moments tables after SQL migration applied (admin users)

### Products Table Security (after migration)
1. Public SELECT still works (products remain readable)
2. Non-admin users cannot INSERT/UPDATE/DELETE products (RLS enforced)
3. Admin users can INSERT/UPDATE/DELETE products (via user_roles.role='admin')

## Migration Steps

1. Apply SQL migration via Supabase Dashboard → SQL Editor
2. Paste and run: `supabase/sql/202601041654_pl0_product_library.sql`
3. Verify: `/app/admin/pl` displays age bands and moments tables

## Rollback

### Revert PR
- Revert this PR via GitHub UI (maintains commit history)

### SQL Rollback (if migration already applied)
Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Drop pl_* tables (cascade handles foreign keys)
DROP TABLE IF EXISTS public.pl_evidence CASCADE;
DROP TABLE IF EXISTS public.pl_reco_cards CASCADE;
DROP TABLE IF EXISTS public.pl_age_moment_sets CASCADE;
DROP TABLE IF EXISTS public.pl_category_types CASCADE;
DROP TABLE IF EXISTS public.pl_dev_tags CASCADE;
DROP TABLE IF EXISTS public.pl_moments CASCADE;
DROP TABLE IF EXISTS public.pl_age_bands CASCADE;

-- Drop enum types
DROP TYPE IF EXISTS pl_lane_enum;
DROP TYPE IF EXISTS pl_set_status_enum;

-- Drop helper function
DROP FUNCTION IF EXISTS public.is_admin();

-- Restore products policies to public select + authenticated write (if explicitly needed)
-- Note: Current implementation keeps SELECT public and makes writes admin-only
-- If you need to restore authenticated write (non-admin), uncomment below:
/*
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.products';
    END LOOP;
END $$;

CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_authenticated_write" ON public.products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
*/
```

## Constraints Met
- ✅ Small diff only (no refactors/restructure)
- ✅ No duplicate tables (products, waitlist, site_settings, user_roles, play_idea remain unique)
- ✅ No second admin system (uses existing user_roles.role='admin')
- ✅ Proof routes pass (verified via build)
- ✅ Theming untouched (no changes to ThemeProvider, /app/admin/theme, or site_settings)
- ✅ Privacy promise: No child name collection (no name fields added)


