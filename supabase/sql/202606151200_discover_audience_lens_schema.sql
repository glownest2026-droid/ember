-- Mirror of supabase/migrations/20260615120000_discover_audience_lens_schema.sql

ALTER TABLE public.pl_ux_wrappers
  ADD COLUMN IF NOT EXISTS audience_lens TEXT;

ALTER TABLE public.pl_age_band_development_need_category_types
  ADD COLUMN IF NOT EXISTS audience_lens TEXT;

DROP VIEW IF EXISTS public.v_gateway_wrappers_public;
CREATE VIEW public.v_gateway_wrappers_public AS
SELECT
  uw.id AS ux_wrapper_id,
  uw.ux_label,
  uw.ux_slug,
  uw.ux_description,
  uw.audience_lens,
  abuw.age_band_id,
  abuw.rank
FROM public.pl_ux_wrappers uw
JOIN public.pl_age_band_ux_wrappers abuw ON uw.id = abuw.ux_wrapper_id
WHERE uw.is_active = true
  AND abuw.is_active = true
ORDER BY abuw.age_band_id, abuw.rank;

DROP VIEW IF EXISTS public.v_gateway_wrapper_detail_public;
CREATE VIEW public.v_gateway_wrapper_detail_public AS
SELECT
  abuw.age_band_id,
  abuw.rank,
  uw.id AS ux_wrapper_id,
  uw.ux_label,
  uw.ux_slug,
  uw.ux_description,
  uw.audience_lens,
  dn.id AS development_need_id,
  dn.name AS development_need_name,
  dn.slug AS development_need_slug,
  dn.plain_english_description,
  dn.why_it_matters,
  meta.stage_anchor_month,
  meta.stage_phase,
  meta.stage_reason
FROM public.pl_ux_wrappers uw
INNER JOIN public.pl_age_band_ux_wrappers abuw ON uw.id = abuw.ux_wrapper_id
INNER JOIN public.pl_ux_wrapper_needs uwn ON uw.id = uwn.ux_wrapper_id
INNER JOIN public.pl_development_needs dn ON uwn.development_need_id = dn.id
LEFT JOIN public.pl_age_band_development_need_meta meta
  ON dn.id = meta.development_need_id
  AND meta.age_band_id = abuw.age_band_id
  AND meta.is_active = true
WHERE uw.is_active = true
  AND abuw.is_active = true
ORDER BY abuw.age_band_id, abuw.rank;

DROP VIEW IF EXISTS public.v_gateway_category_types_public;
CREATE VIEW public.v_gateway_category_types_public AS
SELECT
  abdnct.age_band_id,
  abdnct.development_need_id,
  abdnct.rank,
  abdnct.rationale,
  abdnct.audience_lens,
  ct.id,
  ct.slug,
  ct.label,
  ct.name,
  ct.description,
  ct.image_url,
  ct.safety_notes
FROM public.pl_category_types ct
INNER JOIN public.pl_age_band_development_need_category_types abdnct ON ct.id = abdnct.category_type_id
WHERE abdnct.is_active = true
ORDER BY abdnct.age_band_id, abdnct.development_need_id, abdnct.rank;

GRANT SELECT ON public.v_gateway_wrappers_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_wrapper_detail_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_category_types_public TO anon, authenticated;
