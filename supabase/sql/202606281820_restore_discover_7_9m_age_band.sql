-- Restore 7–9 months on Discover (pl_age_bands id 6-9m).
-- Spine v2 deprecate (20260628180000) deactivated 6-9m with no 7-9M workbook replacement,
-- leaving months 7–9 with no active band between 4–6m and 10–12m (9-12m).
-- Idempotent: safe to re-run.

BEGIN;

UPDATE public.pl_age_bands
SET
  label = '7–9 months',
  min_months = 7,
  max_months = 9,
  is_active = true,
  updated_at = now()
WHERE id = '6-9m';

UPDATE public.pl_age_band_ux_wrappers
SET is_active = true, updated_at = now()
WHERE age_band_id = '6-9m';

UPDATE public.pl_age_band_development_need_category_types
SET is_active = true, updated_at = now()
WHERE age_band_id = '6-9m';

UPDATE public.pl_age_band_category_type_products
SET is_active = true, updated_at = now()
WHERE age_band_id = '6-9m';

COMMIT;
