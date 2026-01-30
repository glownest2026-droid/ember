# Phase A UI Cutover: Use Gateway Views Instead of Legacy Tables

## Summary

Updated `/new` and `/new/[months]` routes to read from Phase A curated public views (`v_gateway_*_public`) instead of legacy gateway tables (`pl_age_moment_sets`, `pl_reco_cards`).

## Problem

The gateway was using legacy tables (`pl_age_moment_sets`, `pl_reco_cards`) which are being replaced by Phase A curated views. The views are now populated and returning data, so we can cut over the UI.

## Solution

### Data Sources (New)

All data is now read from Phase A curated public views:

1. **`v_gateway_age_bands_public`** - Age bands for the age slider
2. **`v_gateway_wrappers_public`** - UX wrapper cards (replaces "moments")
3. **`v_gateway_wrapper_detail_public`** - Wrapper detail with development need and stage metadata
4. **`v_gateway_category_types_public`** - Category types for a development need
5. **`v_gateway_products_public`** - Products for a category type

### Changes

1. **New Gateway Functions** (`web/src/lib/pl/public.ts`):
   - `getGatewayAgeBands()` - Get all gateway age bands
   - `getGatewayAgeBandForAge(ageMonths)` - Get age band for a specific age
   - `getGatewayWrappersForAgeBand(ageBandId)` - Get wrappers for an age band
   - `getGatewayWrapperDetail(ageBandId, uxWrapperId)` - Get wrapper detail
   - `getGatewayCategoryTypes(ageBandId, developmentNeedId)` - Get category types
   - `getGatewayProducts(ageBandId, categoryTypeId)` - Get products

2. **Updated Routes**:
   - `/new/[months]/page.tsx` - Now uses gateway functions instead of legacy functions
   - `/new/[months]/NewLandingPageClient.tsx` - Updated to display wrappers and products

3. **Query Parameter Change**:
   - Changed from `?moment=<moment_id>` to `?wrapper=<ux_wrapper_id>`

4. **Legacy Code**:
   - Legacy functions marked as `@deprecated` (kept for reference, will be removed later)
   - Legacy tables (`pl_age_moment_sets`, `pl_reco_cards`) no longer used

### UI Flow

1. User selects age (24-30 months) → Maps to gateway age band
2. System fetches wrappers for that age band → Shows wrapper cards
3. User selects wrapper → Fetches wrapper detail, categories, and products
4. System displays:
   - Wrapper detail header (development need info)
   - Top 3 products (1 per top 3 categories)

## Verification

### Supabase Views (Confirmed)

- `v_gateway_age_bands_public` = 2
- `v_gateway_wrappers_public` = 24 (12 per age band)
- `v_gateway_wrapper_detail_public` = 24
- `v_gateway_category_types_public` = 222
- `v_gateway_products_public` = 163

### QA Checklist

1. **Age Slider**
   - Navigate to `/new/26`
   - Age slider shows 24-30 months
   - Selecting different ages updates the URL

2. **Wrapper Selection**
   - Select age 25-27m (should show 12 wrappers)
   - Click "Drawing & making" wrapper (`ux_slug: creative-expression-and-mark-making`)
   - Confirm wrapper detail header appears with development need info

3. **Products**
   - After selecting a wrapper, confirm products load
   - Products should show:
     - Image (if available)
     - Name and brand
     - Category badge
     - Rationale (if available)
   - "Save to shortlist" button works

4. **URL Deep Linking**
   - Navigate to `/new/26?wrapper=<ux_wrapper_id>`
   - Page should load with that wrapper selected
   - Products should load automatically

### Build Status

- ✅ Build passes: `pnpm run build` succeeds
- ✅ No linter errors
- ✅ TypeScript compilation successful

## Files Changed

- `web/src/lib/pl/public.ts` - Added gateway functions, marked legacy as deprecated
- `web/src/app/new/[months]/page.tsx` - Updated to use gateway functions
- `web/src/app/new/[months]/NewLandingPageClient.tsx` - Updated to display wrappers and products
- `web/docs/PHASE_A_UI_CUTOVER.md` - Added documentation
- `PROGRESS.md` - Updated with cutover details

## Next Steps

- Remove legacy functions after confirming Phase A is stable
- Add more sophisticated product ranking/selection logic
- Add category-level filtering/selection
- Add product detail pages

