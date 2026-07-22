-- Add Stage 1 wrapper (cluster) context to the Stage 2 mapping junction.
--
-- Root cause (founder bug bash 2026-07-19, item 1): the Bible workbook
-- (discover_projection tab) maps each Stage 1 cluster to its own curated list
-- of Stage 2 categories, but ingestion keyed rows only by development need.
-- Clusters that share a need (e.g. 1-3m "I'm finding your face" and
-- "I'm listening to your voice" both use ent_need_face_smile_chat) rendered
-- the UNION of each other's cards, and per-cluster copy variants collapsed
-- to a single arbitrary winner.
--
-- Fix: carry cluster context on each junction row (ux_wrapper_id). Rows with
-- a wrapper belong to exactly that Stage 1 cluster; legacy rows (NULL) keep
-- today's need-based behaviour until their band is re-ingested from its Bible.
--
-- Idempotent. Safe to re-run.

BEGIN;

ALTER TABLE public.pl_age_band_development_need_category_types
  ADD COLUMN IF NOT EXISTS ux_wrapper_id UUID REFERENCES public.pl_ux_wrappers(id) ON DELETE CASCADE;

-- Replace the unique key so the same (band, need, category) can exist once per
-- cluster. NULLS NOT DISTINCT keeps legacy NULL-wrapper rows deduplicated.
ALTER TABLE public.pl_age_band_development_need_category_types
  DROP CONSTRAINT IF EXISTS pl_age_band_development_need_category_types_unique;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pl_age_band_dev_need_category_types_wrapper_unique'
  ) THEN
    ALTER TABLE public.pl_age_band_development_need_category_types
      ADD CONSTRAINT pl_age_band_dev_need_category_types_wrapper_unique
      UNIQUE NULLS NOT DISTINCT (age_band_id, development_need_id, category_type_id, ux_wrapper_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_abdnct_age_band_wrapper
  ON public.pl_age_band_development_need_category_types (age_band_id, ux_wrapper_id)
  WHERE is_active = true;

-- Expose the wrapper slug on the public gateway view (NULL for legacy rows).
DROP VIEW IF EXISTS public.v_gateway_category_types_public;
CREATE VIEW public.v_gateway_category_types_public AS
SELECT
  abdnct.age_band_id,
  abdnct.development_need_id,
  uw.ux_slug AS wrapper_slug,
  abdnct.rank,
  abdnct.rationale,
  abdnct.audience_lens,
  abdnct.display_label,
  abdnct.content_type,
  abdnct.ui_lane,
  abdnct.ui_section_title,
  abdnct.lane_rank,
  abdnct.show_ember_picks,
  abdnct.show_gift_action,
  abdnct.gift_friendly,
  abdnct.buyer_mode_label,
  abdnct.gift_note,
  abdnct.ownership_note,
  abdnct.product_family_label,
  abdnct.primary_persona,
  abdnct.card_cta_label,
  abdnct.render_rule,
  ct.id,
  ct.slug,
  COALESCE(abdnct.display_label, ct.name, ct.label) AS label,
  ct.name,
  ct.description,
  ct.image_url,
  ct.safety_notes
FROM public.pl_category_types ct
INNER JOIN public.pl_age_band_development_need_category_types abdnct ON ct.id = abdnct.category_type_id
LEFT JOIN public.pl_ux_wrappers uw ON uw.id = abdnct.ux_wrapper_id
WHERE abdnct.is_active = true
ORDER BY abdnct.age_band_id, abdnct.development_need_id, abdnct.rank;

GRANT SELECT ON public.v_gateway_category_types_public TO anon, authenticated;

COMMIT;
