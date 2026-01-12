## What Changed

### Dropdown Data Sources
1. **Category Type Dropdown**: Now queries `pl_category_type_fits` filtered by the set's `age_band_id`, joined to `pl_category_types` for label/name/slug. Displays labels sorted ascending.

2. **Product Dropdown**: Now queries `v_pl_product_fits_ready_for_recs` filtered by `age_band_id` and `is_ready_for_recs = true`. Displays products in format "{product_name} — {brand}" with metadata:
   - Confidence score (0-10)
   - Quality score (0-10)
   - Evidence count
   - Publish readiness badge ("Ready to Publish" or "Needs 2nd source")

### Publish Gating
- Added validation in `publishSet()` action that checks product publish readiness before publishing
- For cards with `product_id`, validates that `is_ready_for_publish = true` (requires >=2 evidence AND >=2 domains)
- Blocks publish with clear error messages listing offending product names
- Category-only cards can publish without product evidence gating

### Files Modified
- `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx` - Updated queries for category types and products
- `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MomentSetEditor.tsx` - Updated UI to display metadata and badges
- `web/src/app/(app)/app/admin/pl/_actions.ts` - Added publish validation logic

## How to Verify

1. Navigate to `/app/admin/pl/[ageBandId]` (e.g., for age band '25-27m')
2. **Category Type dropdown**: Should show category types that have fits for that age band (not just "None")
3. **Product dropdown**: Should show products eligible for internal selection with format "{name} — {brand}"
4. **Product metadata**: Selecting a product should display:
   - Confidence and quality scores
   - Evidence count
   - Publish readiness badge
5. **Publish validation**:
   - Try to publish a set with products that are publish-ready (>=2 evidence AND >=2 domains) - should succeed
   - Try to publish a set with products that are NOT publish-ready - should be blocked with error listing product names
   - Category-only cards (no product) should be able to publish without product gating

## Checks
- ✅ TypeScript typecheck passed (`npx tsc --noEmit`)
- ⚠️ Lint command had configuration issues but code follows existing patterns

