# Fix: Populate Phase A gateway wrappers (fallback)

## Problem

The Phase A migration ran "successfully" but wrappers are empty:
- `pl_ux_wrappers` = 0
- `pl_ux_wrapper_needs` = 0
- `pl_age_band_ux_wrappers` (23-25m/25-27m) = 0
- Views: `v_gateway_age_bands_public` = 0, `v_gateway_wrappers_public` = 0, `v_gateway_wrapper_detail_public` = 0

However, other data populated correctly:
- `pl_age_band_development_need_meta` (23-25m/25-27m) = 24
- `pl_age_band_development_need_category_types` (23-25m/25-27m) = 222
- `pl_age_band_category_type_products` (23-25m/25-27m) = 163

## Root Cause

Wrapper population (Part 10.2) depends on `pl_need_ux_labels` table existing and having data. When this table is missing or empty, no wrappers are created, leaving the gateway views empty even though the underlying data (needs, categories, products) exists.

## Solution

Added **Part 10.6: Ensure wrappers + wrapper mappings + rankings exist (fallback)** that uses canonical/meta tables instead of seed tables.

### 10.6.1: Create wrappers from gateway development needs (idempotent)

- **Source**: Distinct `development_need_id` from `pl_age_band_development_need_meta` where `age_band_id IN ('23-25m','25-27m')` and `is_active = true`
- **Wrapper creation**:
  - `ux_slug = dn.slug` (stable, tied to development need slug)
  - `ux_label = CASE` mapping for known needs:
    - 'Color and shape recognition' → 'Shapes & colours'
    - 'Creative expression and mark-making' → 'Drawing & making'
    - 'Emotional regulation and self-awareness' → 'Big feelings'
    - 'Fine motor control and hand coordination' → 'Little hands'
    - 'Gross motor skills and physical confidence' → 'Burn energy'
    - 'Independence and practical%' (ILIKE) → 'Do it myself'
    - Everything else: `dn.name`
  - `ux_description = NULLIF(dn.plain_english_description, '')`
  - `is_active = true`
- **ON CONFLICT**: Updates `is_active = true`, preserves existing labels/descriptions if not NULL/empty

### 10.6.2: Map wrappers to development needs (idempotent)

- **Source**: Same gateway need set (from meta table)
- **Mapping**: `pl_ux_wrapper_needs(ux_wrapper_id, development_need_id)` where `ux_wrapper_id` comes from `pl_ux_wrappers` joined by `ux_slug = dn.slug`
- **ON CONFLICT**: Updates `development_need_id` and `updated_at`

### 10.6.3: Create age-band wrapper rankings (idempotent)

- **Ranking logic**: Deterministic ranking using `ROW_NUMBER() OVER (PARTITION BY age_band_id ORDER BY ...)`:
  - Primary sort: `ABS(COALESCE(meta.stage_anchor_month, band_mid) - band_mid)` (proximity to band midpoint)
  - Secondary sort: `dn.name` (alphabetical)
  - Where `band_mid = (pl_age_bands.min_months + pl_age_bands.max_months) / 2.0`
- **ON CONFLICT**: Updates `rank`, `is_active = true`, `updated_at`

### Updated Proof Bundle

Added counts and sample data:
- `pl_ux_wrappers` count
- `pl_ux_wrapper_needs` count
- `pl_age_band_ux_wrappers` count for ('23-25m','25-27m')
- `v_gateway_age_bands_public` count
- `v_gateway_wrappers_public` count
- `v_gateway_wrapper_detail_public` count
- Sample of `v_gateway_wrapper_detail_public` (first 5 for 25-27m)

## Expected Results (After Migration)

**Before:**
- `pl_ux_wrappers` = 0
- `pl_ux_wrapper_needs` = 0
- `pl_age_band_ux_wrappers` (23-25m/25-27m) = 0
- `v_gateway_wrappers_public` = 0

**After:**
- `pl_ux_wrappers` = ~12-24 (one per distinct development need in gateway)
- `pl_ux_wrapper_needs` = ~12-24 (1:1 mapping)
- `pl_age_band_ux_wrappers` (23-25m/25-27m) = ~12-24 per age band
- `v_gateway_wrappers_public` = ~24-48 (wrappers × age bands)

## Key Features

- **Idempotent**: Safe to re-run (uses `ON CONFLICT`)
- **Set-based**: No PL/pgSQL loops, all operations use SQL INSERT ... SELECT
- **Deterministic**: Wrapper slugs tied to `dn.slug` for stability
- **Fallback**: Works even when `pl_need_ux_labels` is missing or empty
- **Preserves manual edits**: Only updates NULL/empty labels and descriptions

## Files Changed

- `supabase/sql/202601150000_phase_a_db_foundation.sql` — Added Part 10.6 (lines ~892-970)

## Migration Application

1. Open Supabase Dashboard → SQL Editor
2. Paste entire contents of `supabase/sql/202601150000_phase_a_db_foundation.sql`
3. Execute
4. Check NOTICE messages in output (proof bundle runs automatically)
5. Verify wrapper population:
   ```sql
   SELECT COUNT(*) FROM pl_ux_wrappers;  -- Should be > 0
   SELECT COUNT(*) FROM pl_age_band_ux_wrappers WHERE age_band_id IN ('23-25m','25-27m');  -- Should be > 0
   SELECT COUNT(*) FROM v_gateway_wrappers_public;  -- Should be > 0
   ```

## Verification Queries

Run these in Supabase SQL Editor after migration:

1. **Wrapper count**: `SELECT COUNT(*) FROM pl_ux_wrappers;`
2. **Age-band wrapper rankings**: `SELECT COUNT(*) FROM pl_age_band_ux_wrappers WHERE age_band_id IN ('23-25m','25-27m');`
3. **Gateway view**: `SELECT COUNT(*) FROM v_gateway_wrappers_public;`

## Next Step

- **UI cutover**: Wire `/new/[months]` route to use gateway views (`v_gateway_*_public`) instead of legacy tables

