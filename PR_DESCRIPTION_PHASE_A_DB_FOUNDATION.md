# Phase A: DB Foundation (Gateway Spine + Curated Public Views)

**PR URL**: _[Will be added after PR creation]_  
**Vercel Preview URL**: _[Will be added after Vercel deployment]_

## Summary

This PR creates the Phase A database foundation: gateway spine tables, curated public views, triggers, RLS policies, and data population from seed tables for MVP age bands (23-25m and 25-27m).

**Security-first**: Canonical tables remain protected; anonymous users read from curated views only.

## What Changed

### SQL Migration

**File**: `supabase/sql/202601150000_phase_a_db_foundation.sql` (862 lines)

**Components**:
1. **Helper Functions**: `set_updated_at()`, `slugify_ux_label()`, `prevent_age_band_id_update()`
2. **New Tables** (6 tables):
   - `pl_ux_wrappers` — UX wrapper vocabulary
   - `pl_ux_wrapper_needs` — Wrapper → need mapping (1:1 via UNIQUE)
   - `pl_age_band_ux_wrappers` — Age-band-specific wrapper ranking
   - `pl_age_band_development_need_meta` — Age-band-specific stage metadata
   - `pl_age_band_development_need_category_types` — Age-band-specific need → category mapping
   - `pl_age_band_category_type_products` — Age-band-specific category → product mapping
3. **Indexes**: Performance indexes on all foreign keys and common query patterns
4. **Triggers**: Updated_at triggers on all new tables, immutability trigger for `pl_age_bands.id`
5. **RLS Policies**: Admin CRUD on base tables, public SELECT on curated views only
6. **Curated Public Views** (5 views):
   - `v_gateway_age_bands_public`
   - `v_gateway_wrappers_public`
   - `v_gateway_development_needs_public`
   - `v_gateway_category_types_public`
   - `v_gateway_products_public`
7. **Data Population**: Idempotent population from seed tables for 23-25m and 25-27m
8. **Proof Bundle**: Embedded verification output with counts and sample data

### Key Features

- **Idempotent**: Safe to re-run (uses IF NOT EXISTS, ON CONFLICT, etc.)
- **Security-first**: Canonical tables remain protected; anonymous users read from curated views only
- **Operational toggles**: `is_active` on mapping tables for soft delete pattern
- **Stage metadata**: Stored per age band per need (not on base tables)
- **Immutability**: Trigger prevents updates to `pl_age_bands.id`

## Build Verification

✅ **Build passes**: `pnpm run build` succeeds

```bash
cd web
pnpm install
pnpm run build
```

**Output**: Build completed successfully in 32.2s, all routes generated.

## Migration Application

**Option B** (Supabase Dashboard):
1. Open Supabase Dashboard → SQL Editor
2. Paste entire contents of `supabase/sql/202601150000_phase_a_db_foundation.sql`
3. Execute
4. Check NOTICE messages in output (proof bundle runs automatically)

**Verification**:
- Age bands "23-25m" and "25-27m" exist
- UX wrappers created (if `pl_need_ux_labels` exists)
- Mappings populated from seed tables
- Views accessible to anon/authenticated roles

## Data Population Details

- **Age Bands**: Ensures "23-25m" and "25-27m" exist (idempotent insert)
- **Development Needs**: Populates from `pl_seed_development_needs` (only fills missing descriptions)
- **UX Wrappers**: Creates from `pl_need_ux_labels` (if exists) for 25-27m
- **Stage Metadata**: Populates from seed tables for both age bands
- **Need-Category Mappings**: Parses `mapped_developmental_needs` (comma-separated) from `pl_seed_category_types`
- **Category-Product Mappings**: Matches products by name + brand from `pl_seed_products`

## Security

- **Canonical Tables**: Protected by default (admin CRUD only, no public read)
- **Curated Views**: Public SELECT granted to anon and authenticated roles
- **RLS**: All new tables have RLS enabled with admin-only policies
- **Views**: Read-only (no INSERT/UPDATE/DELETE)

## Known Limitations

- Data population is best-effort (matches by name/slug, may miss some products if names don't match exactly)
- UX wrapper creation depends on `pl_need_ux_labels` table existing (gracefully handles if missing)
- Product matching uses name + brand (may need refinement for exact matching)

## Next Steps

- **PR #3**: Wire new Phase A data flow into `/new/[months]` route (read from curated views instead of legacy tables)

## Links

- Migration file: `supabase/sql/202601150000_phase_a_db_foundation.sql`
- Schema design: `web/docs/PHASE_A_GATEWAY_SCHEMA.md`
- Ground truth: `web/docs/PHASE_A_GROUND_TRUTH.md`

