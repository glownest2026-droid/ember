-- Discover Stage 2 lane/CTA metadata for Conor + Thea UI model.
-- Idempotent. Safe to re-run.

BEGIN;

ALTER TABLE public.pl_age_band_development_need_category_types
  ADD COLUMN IF NOT EXISTS content_type TEXT,
  ADD COLUMN IF NOT EXISTS ui_lane TEXT,
  ADD COLUMN IF NOT EXISTS ui_section_title TEXT,
  ADD COLUMN IF NOT EXISTS lane_rank INTEGER,
  ADD COLUMN IF NOT EXISTS show_ember_picks BOOLEAN,
  ADD COLUMN IF NOT EXISTS show_gift_action BOOLEAN,
  ADD COLUMN IF NOT EXISTS gift_friendly BOOLEAN,
  ADD COLUMN IF NOT EXISTS buyer_mode_label TEXT,
  ADD COLUMN IF NOT EXISTS gift_note TEXT,
  ADD COLUMN IF NOT EXISTS ownership_note TEXT,
  ADD COLUMN IF NOT EXISTS product_family_label TEXT,
  ADD COLUMN IF NOT EXISTS primary_persona TEXT,
  ADD COLUMN IF NOT EXISTS card_cta_label TEXT,
  ADD COLUMN IF NOT EXISTS render_rule TEXT;

DROP VIEW IF EXISTS public.v_gateway_category_types_public;
CREATE VIEW public.v_gateway_category_types_public AS
SELECT
  abdnct.age_band_id,
  abdnct.development_need_id,
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
WHERE abdnct.is_active = true
ORDER BY abdnct.age_band_id, abdnct.development_need_id, abdnct.rank;

GRANT SELECT ON public.v_gateway_category_types_public TO anon, authenticated;

COMMIT;
