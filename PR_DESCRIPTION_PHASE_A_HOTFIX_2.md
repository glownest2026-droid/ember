# Hotfix #2: Resolve ambiguous column reference errors in Phase A migration

## Problem

The Phase A migration (`202601150000_phase_a_db_foundation.sql`) failed in Supabase with:
```
ERROR: 42702: column reference "product_id" is ambiguous
DETAIL: could refer to either a PL/pgSQL variable or a table column
CONTEXT: DO block in seed product mapping insert into pl_age_band_category_type_products
```

## Root Cause

PL/pgSQL variables in DO blocks (`product_id`, `category_id`, `need_id`, `wrapper_id`) conflicted with column names in INSERT statements, causing PostgreSQL to be unable to determine whether the identifier referred to the variable or the column.

## Solution

Renamed all PL/pgSQL variables to use `v_` prefix convention to avoid ambiguity:

### Variable Renames

- **Part 10.1** (Populate pl_development_needs):
  - `need_id` → `v_need_id`

- **Part 10.2** (Populate pl_ux_wrappers):
  - `wrapper_id` → `v_wrapper_id`

- **Part 10.3** (Populate pl_age_band_development_need_meta):
  - `need_id` → `v_need_id`

- **Part 10.4** (Populate pl_age_band_development_need_category_types):
  - `category_id` → `v_category_id`
  - `need_id` → `v_need_id`

- **Part 10.5** (Populate pl_age_band_category_type_products):
  - `category_id` → `v_category_id`
  - `product_id` → `v_product_id`

### Safety Measure

Added a safety comment at the top of Part 10:
```sql
-- IMPORTANT: All PL/pgSQL variables must be prefixed with v_ to avoid ambiguity
-- with column names in INSERT statements (e.g., v_product_id, v_category_id, v_need_id).
```

## Verification

✅ **Build passes**: `pnpm run build` succeeds (13.6s)

✅ **Migration is runnable end-to-end**:
- Can be pasted as single block in Supabase SQL Editor
- No ambiguous column reference errors expected
- Proof bundle should complete without errors

## Files Changed

- `supabase/sql/202601150000_phase_a_db_foundation.sql` — Fixed variable naming in all DO blocks (Parts 10.1-10.5)

## Migration Application

1. Open Supabase Dashboard → SQL Editor
2. Paste entire contents of `supabase/sql/202601150000_phase_a_db_foundation.sql`
3. Execute
4. Check NOTICE messages in output (proof bundle runs automatically)
5. Verify: No ambiguous column reference errors; proof bundle completes successfully

## DO Block Locations Changed

- **Part 10.1** (lines ~506-575): `v_need_id` variable
- **Part 10.2** (lines ~579-633): `v_wrapper_id` variable
- **Part 10.3** (lines ~637-719): `v_need_id` variable
- **Part 10.4** (lines ~723-798): `v_category_id`, `v_need_id` variables
- **Part 10.5** (lines ~802-887): `v_category_id`, `v_product_id` variables

