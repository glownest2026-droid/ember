-- Mirror of supabase/migrations/20260615120400_gateway_age_bands_wrapper_fallback.sql

DROP VIEW IF EXISTS public.v_gateway_age_bands_public;
CREATE VIEW public.v_gateway_age_bands_public AS
SELECT DISTINCT
  abuw.age_band_id AS id,
  COALESCE(
    ab.label,
    replace(replace(abuw.age_band_id, '-', '–'), 'm', ' months')
  ) AS label,
  COALESCE(ab.min_months, substring(abuw.age_band_id FROM '^(\d+)')::integer) AS min_months,
  COALESCE(ab.max_months, substring(abuw.age_band_id FROM '(\d+)m$')::integer) AS max_months
FROM public.pl_age_band_ux_wrappers abuw
LEFT JOIN public.pl_age_bands ab
  ON ab.id = abuw.age_band_id
  AND ab.is_active = true
WHERE abuw.is_active = true
  AND (
    ab.id IS NOT NULL
    OR abuw.age_band_id ~ '^\d+-\d+m$'
  );

GRANT SELECT ON public.v_gateway_age_bands_public TO anon, authenticated;
