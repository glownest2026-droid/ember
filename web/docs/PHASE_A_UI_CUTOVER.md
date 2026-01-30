# Phase A UI Cutover

## Overview

The `/new` and `/new/[months]` routes have been updated to use Phase A curated public views instead of legacy gateway tables (`pl_age_moment_sets`, `pl_reco_cards`).

## Data Sources

### Phase A Views (New)

All data is now read from curated public views:

1. **`v_gateway_age_bands_public`**
   - Age bands for the age slider
   - Fields: `id`, `label`, `min_months`, `max_months`

2. **`v_gateway_wrappers_public`**
   - UX wrapper cards (replaces "moments")
   - Fields: `ux_wrapper_id`, `ux_label`, `ux_slug`, `ux_description`, `age_band_id`, `rank`
   - Filtered by `age_band_id`, ordered by `rank`

3. **`v_gateway_wrapper_detail_public`**
   - Wrapper detail with development need and stage metadata
   - Fields: `age_band_id`, `rank`, `ux_wrapper_id`, `ux_label`, `ux_slug`, `ux_description`, `development_need_id`, `development_need_name`, `development_need_slug`, `plain_english_description`, `why_it_matters`, `stage_anchor_month`, `stage_phase`, `stage_reason`
   - Filtered by `age_band_id` + `ux_wrapper_id`

4. **`v_gateway_category_types_public`**
   - Category types for a development need
   - Fields: `age_band_id`, `development_need_id`, `rank`, `rationale`, `id`, `slug`, `label`, `name`, `description`, `image_url`, `safety_notes`
   - Filtered by `age_band_id` + `development_need_id`, ordered by `rank`

5. **`v_gateway_products_public`**
   - Products for a category type
   - Fields: `age_band_id`, `category_type_id`, `rank`, `rationale`, `id`, `name`, `brand`, `image_url`, `canonical_url`, `amazon_uk_url`, `affiliate_url`, `affiliate_deeplink`
   - Filtered by `age_band_id` + `category_type_id`, ordered by `rank`

### Legacy Tables (Deprecated)

- `pl_age_moment_sets` - No longer used
- `pl_reco_cards` - No longer used
- `pl_moments` - No longer used

**Note**: Legacy code is kept in `web/src/lib/pl/public.ts` but marked as `@deprecated`. It will be removed in a future cleanup.

## Implementation

### Functions (`web/src/lib/pl/public.ts`)

New gateway functions:
- `getGatewayAgeBands()` - Get all gateway age bands
- `getGatewayAgeBandForAge(ageMonths)` - Get age band for a specific age
- `getGatewayWrappersForAgeBand(ageBandId)` - Get wrappers for an age band
- `getGatewayWrapperDetail(ageBandId, uxWrapperId)` - Get wrapper detail
- `getGatewayCategoryTypes(ageBandId, developmentNeedId)` - Get category types
- `getGatewayProducts(ageBandId, categoryTypeId)` - Get products

### Routes

- `/new` - Redirects to `/new/26` (default age)
- `/new/[months]` - Main gateway page with age slider and wrapper selection

### Query Parameters

- `?wrapper=<ux_wrapper_id>` - Selects a specific wrapper (replaces `?moment=<moment_id>`)

### Data Flow

1. User selects age (24-30 months) → Maps to gateway age band
2. System fetches wrappers for that age band → Shows wrapper cards
3. User selects wrapper → Fetches wrapper detail, categories, and products
4. System displays:
   - Wrapper detail header (development need info)
   - Top 3 products (1 per top 3 categories)

## Verification

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

### Supabase Verification

Run these queries to verify data:

```sql
-- Check age bands
SELECT COUNT(*) FROM v_gateway_age_bands_public;  -- Should be 2

-- Check wrappers for 25-27m
SELECT COUNT(*) FROM v_gateway_wrappers_public WHERE age_band_id = '25-27m';  -- Should be 12

-- Check wrapper detail
SELECT * FROM v_gateway_wrapper_detail_public 
WHERE age_band_id = '25-27m' 
  AND ux_slug = 'creative-expression-and-mark-making'
LIMIT 1;

-- Check categories for a development need
SELECT COUNT(*) FROM v_gateway_category_types_public 
WHERE age_band_id = '25-27m' 
  AND development_need_id = (SELECT development_need_id FROM v_gateway_wrapper_detail_public WHERE age_band_id = '25-27m' AND ux_slug = 'creative-expression-and-mark-making' LIMIT 1);

-- Check products
SELECT COUNT(*) FROM v_gateway_products_public 
WHERE age_band_id = '25-27m';  -- Should be 163
```

## Migration Notes

- Legacy functions are marked `@deprecated` but not removed
- All new code uses Phase A views
- Query parameter changed from `?moment=` to `?wrapper=`
- UI structure remains similar but data source is different

## Next Steps

- Remove legacy functions after confirming Phase A is stable
- Add more sophisticated product ranking/selection logic
- Add category-level filtering/selection
- Add product detail pages

