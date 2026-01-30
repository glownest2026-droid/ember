# Phase A: Ground Truth + Gateway Schema (no migrations)

## Summary

This PR establishes the ground truth documentation and schema design for Phase A rebuild of the age-first gateway experience. **No migrations in this PR by design** — this is a write-only plan for PR #2.

## What Changed

### Documentation Added

1. **`web/docs/PHASE_A_GROUND_TRUTH.md`** — Current state audit:
   - Gateway routes (`/new` and `/new/[months]`)
   - Supabase read paths and data dependencies
   - Legacy freeze declaration (`pl_age_moment_sets`, `pl_reco_cards`, `pl_evidence`, `pl_pool_items` — no new writes for Phase A)
   - DB reality summary (canonical tables, seed tables, delimiter formats)
   - Discovered surprises (no mock HTML, legacy tables still in use, seed table delimiters)

2. **`web/docs/PHASE_A_GATEWAY_SCHEMA.md`** — Schema design:
   - ERD in text (age band → UX wrapper → development need → category types → products)
   - New tables to be created in PR #2 (7 tables + optional `pl_product_sources`)
   - Curated public views (`v_gateway_*_public`) for anonymous access
   - Updated_at triggers plan (shared function)
   - Immutability plan for `pl_age_bands.id` (trigger prevents updates)
   - RLS stance (canonical tables protected, public reads via curated views only)

3. **`PROGRESS.md`** — Updated with Phase A section

## Build Verification

✅ **Build passes**: `pnpm run build` succeeds

```bash
cd web
pnpm install
pnpm run build
```

**Output**: Build completed successfully in 32.8s, all routes generated.

## Key Findings

### Gateway Routes
- `/new` — Redirects to `/new/26` (default age)
- `/new/[months]` — Main gateway landing page with age slider (24–30 months), moment selection, and top 3 picks display

### Current Data Flow (Legacy)
- Uses `pl_age_moment_sets` / `pl_reco_cards` pattern (to be replaced in Phase A)
- Reads from: `pl_age_bands`, `pl_moments`, `pl_age_moment_sets`, `pl_reco_cards`, `pl_category_types`, `products`

### Legacy Freeze
- **FROZEN** (no new writes for Phase A): `pl_age_moment_sets`, `pl_reco_cards`, `pl_evidence` (legacy), `pl_pool_items`
- Phase A will use new tables: `pl_ux_wrappers`, `pl_age_band_ux_wrappers`, mapping tables

### Discovered Surprises
1. No mock HTML files — current implementation appears production-ready
2. Legacy tables still in use — current `/new` route uses legacy pattern
3. Public read policies exist — but CTO Alex requires curated views instead
4. Seed table delimiters — different formats (comma for `mapped_developmental_needs`, pipe for `evidence_urls`/`evidence_notes`)
5. Stage metadata in seed tables — will be moved to age-specific mapping tables in Phase A

## Schema Design Highlights

### New Tables (PR #2)
1. `pl_ux_wrappers` — UX wrapper vocabulary
2. `pl_ux_wrapper_needs` — Wrapper → need mapping (1:1 via UNIQUE)
3. `pl_age_band_ux_wrappers` — Age-band-specific wrapper ranking
4. `pl_age_band_development_need_meta` — Age-band-specific stage metadata
5. `pl_age_band_development_need_category_types` — Age-band-specific need → category mapping
6. `pl_age_band_category_type_products` — Age-band-specific category → product mapping
7. `pl_product_sources` — Optional (product provenance tracking)

### Curated Public Views
- `v_gateway_age_bands_public` — Safe age band columns
- `v_gateway_wrappers_public` — UX wrappers with rank per age band
- `v_gateway_development_needs_public` — Safe development need columns
- `v_gateway_category_types_public` — Safe category type columns
- `v_gateway_products_public` — Safe product columns (affiliate/deeplink fields only)

### Security
- Canonical tables remain protected by default (admin CRUD, authenticated read)
- Anonymous users read from curated public views only
- RLS policies enforce security boundary

## Next Steps

- **PR #2**: Create migrations for new Phase A tables + curated views + triggers + RLS policies
- **PR #3**: Wire new Phase A data flow into `/new/[months]` route
- **PR #4**: Remove legacy table dependencies from gateway route (optional cleanup)

## Stop-Sign Gate Met

✅ **No migrations in this PR by design** — stop-sign gate met.

## Links

- [`web/docs/PHASE_A_GROUND_TRUTH.md`](web/docs/PHASE_A_GROUND_TRUTH.md)
- [`web/docs/PHASE_A_GATEWAY_SCHEMA.md`](web/docs/PHASE_A_GATEWAY_SCHEMA.md)


