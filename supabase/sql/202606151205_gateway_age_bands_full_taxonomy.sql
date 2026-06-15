-- Mirror of supabase/migrations/20260615120500_gateway_age_bands_full_taxonomy.sql

DROP VIEW IF EXISTS public.v_gateway_age_bands_public;
CREATE VIEW public.v_gateway_age_bands_public AS
SELECT
  ab.id,
  ab.label,
  ab.min_months,
  ab.max_months
FROM public.pl_age_bands ab
WHERE ab.is_active = true

UNION

SELECT DISTINCT
  abuw.age_band_id AS id,
  replace(replace(abuw.age_band_id, '-', '–'), 'm', ' months') AS label,
  substring(abuw.age_band_id FROM '^(\d+)')::integer AS min_months,
  substring(abuw.age_band_id FROM '(\d+)m$')::integer AS max_months
FROM public.pl_age_band_ux_wrappers abuw
LEFT JOIN public.pl_age_bands ab ON ab.id = abuw.age_band_id
WHERE abuw.is_active = true
  AND ab.id IS NULL
  AND abuw.age_band_id ~ '^\d+-\d+m$';

GRANT SELECT ON public.v_gateway_age_bands_public TO anon, authenticated;
