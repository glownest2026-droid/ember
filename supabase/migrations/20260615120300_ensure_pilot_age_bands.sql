-- Ensure pilot age-band rows exist for wrapper mappings already loaded.
-- Derives band metadata from the imported discover_projection age_band_id values.

INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT
  band.id,
  band.label,
  band.min_months,
  band.max_months,
  true
FROM (
  VALUES
    ('6-9m', '6–9 months', 6, 9),
    ('9-12m', '9–12 months', 9, 12)
) AS band(id, label, min_months, max_months)
WHERE EXISTS (
  SELECT 1
  FROM public.pl_age_band_ux_wrappers abuw
  WHERE abuw.age_band_id = band.id
    AND abuw.is_active = true
)
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = true,
  updated_at = now();
