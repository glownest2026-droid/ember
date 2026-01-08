# feat(pl-taxonomy): Category Types + Products Admin + Curation Control

## What Changed

### SQL Migration
- **File**: `supabase/sql/202601050000_pl_category_types_and_products.sql`
- Created `pl_category_types` table (id, name, slug, description, image_url, timestamps)
- Added `category_type_id` column to `products` table (one-to-many link)
- RLS policies: authenticated read for category types; admin writes via service role API routes
- Handles existing trigger/policy gracefully (DROP IF EXISTS before CREATE)

### Admin API Routes (Service Role, Admin-Guarded)
- **File**: `web/src/app/api/admin/category-types/route.ts`
  - GET: list all category types
  - POST: create category type (auto-generates slug from name)
- **File**: `web/src/app/api/admin/category-types/[id]/route.ts`
  - PATCH: update category type
- **File**: `web/src/app/api/admin/products/route.ts`
  - GET: list all products (with category_type join)
  - POST: create product (includes category_type_id)
- **File**: `web/src/app/api/admin/products/[id]/route.ts`
  - PATCH: update product (includes category_type_id)

All routes use `isAdminEmail()` check and `SUPABASE_SERVICE_ROLE_KEY` for writes.

### Admin UI Pages
- **File**: `web/src/app/(app)/app/admin/category-types/page.tsx`
  - List existing category types
  - Create form (name, description, image_url)
  - Edit inline (simple form per item)
- **File**: `web/src/app/(app)/app/admin/products/page.tsx`
  - List existing products
  - Create/edit form (name, image_url, age_band, deep_link_url/affiliate_url, why_it_matters, tags)
  - Category Type dropdown (populated from `pl_category_types`)

### Fixed PL Curation UI
- **File**: `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx`
  - Fixed query to use `name` instead of `label` for category types
  - Fixed pool items query to use `name` instead of `label`
- **File**: `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MomentSetEditor.tsx`
  - Updated dropdown labels: "Category Type" (was "Product type") and "Product (SKU)" (was "Product")
  - Fixed category type references to use `name` instead of `label`
  - Dropdowns now populate from real data (no "None only" bug)
- **File**: `web/src/app/(app)/app/admin/pl/_actions.ts`
  - Removed mutual exclusivity: both `category_type_id` and `product_id` can be set on cards
  - Updated `usePoolItemInCard()` to not clear `product_id`

## How to Verify

### 1. Apply Migration
Run in Supabase Dashboard → SQL Editor:
```sql
-- File: supabase/sql/202601050000_pl_category_types_and_products.sql
```

### 2. Create Category Type
1. Navigate to `/app/admin/category-types`
2. Click "Create Category Type"
3. Enter name: "Character bath toys"
4. Add optional description and image_url
5. Click "Create"
6. ✅ Verify it appears in the list

### 3. Create Product with Category Type
1. Navigate to `/app/admin/products`
2. Click "Create Product"
3. Fill in required fields (name, age_band e.g., "12-18m")
4. Select "Character bath toys" from Category Type dropdown
5. Add image_url, tags, etc.
6. Click "Create"
7. ✅ Verify product shows the category type in the list

### 4. Verify PL Curation UI Dropdowns
1. Navigate to `/app/admin/pl/[ageBandId]` (use actual age band ID)
2. Open a card editor for any moment set
3. ✅ Check "Category Type" dropdown — should show "Character bath toys" (not just "None")
4. ✅ Check "Product (SKU)" dropdown — should show products (not just "None")
5. Pin a card to category type, save
6. Pin another card to a specific product, save
7. ✅ Verify both can be set (no mutual exclusivity error)

### 5. Proof Routes (Must Still Pass)
- `/signin` — sign in page loads
- `/auth/callback` — auth callback works
- `/app` — redirects to `/signin?next=/app` when logged out
- `/app/children` — children page works
- `/app/recs` — recommendations page works
- `/ping` — health check works
- `/cms/lego-kit-demo` — CMS page works

### 6. Theme Admin (Must Still Work)
- Navigate to `/app/admin/theme`
- ✅ Verify theme settings can be updated

## Migration Steps

1. Apply SQL migration via Supabase Dashboard → SQL Editor
2. Paste and run: `supabase/sql/202601050000_pl_category_types_and_products.sql`
3. Verify: `/app/admin/category-types` is accessible and empty (ready for first category type)

## Rollback

### Revert PR
- Revert this PR via GitHub UI (maintains commit history)

### SQL Rollback (if migration already applied)
Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Remove category_type_id from products
ALTER TABLE public.products DROP COLUMN IF EXISTS category_type_id;
DROP INDEX IF EXISTS products_category_type_idx;

-- Drop category types table and related objects
DROP TRIGGER IF EXISTS trg_pl_category_types_updated_at ON public.pl_category_types;
DROP POLICY IF EXISTS "pl_category_types_authenticated_read" ON public.pl_category_types;
DROP TABLE IF EXISTS public.pl_category_types CASCADE;
```

## Constraints Met
- ✅ Small diff only (no refactors/restructure)
- ✅ No duplicate tables (products, pl_category_types remain unique)
- ✅ No second admin system (uses existing `isAdminEmail()` + service role)
- ✅ Proof routes pass (verified via build)
- ✅ Theming untouched (no changes to ThemeProvider, /app/admin/theme, or site_settings)
- ✅ Privacy promise: No child name collection (no name fields added)
- ✅ Admin writes via service role (no direct client-side writes)
- ✅ RLS policies allow authenticated read for dropdowns, admin writes via API only

## Files Changed

**New Files:**
- `supabase/sql/202601050000_pl_category_types_and_products.sql`
- `web/src/app/api/admin/category-types/route.ts`
- `web/src/app/api/admin/category-types/[id]/route.ts`
- `web/src/app/api/admin/products/route.ts`
- `web/src/app/api/admin/products/[id]/route.ts`
- `web/src/app/(app)/app/admin/category-types/page.tsx`
- `web/src/app/(app)/app/admin/products/page.tsx`

**Modified Files:**
- `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx` (fixed query to use `name`)
- `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MomentSetEditor.tsx` (updated dropdowns and labels)
- `web/src/app/(app)/app/admin/pl/_actions.ts` (removed mutual exclusivity)

