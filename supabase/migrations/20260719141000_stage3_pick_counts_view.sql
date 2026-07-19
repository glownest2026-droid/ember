-- Public per-category Stage 3 pick counts.
--
-- Founder bug bash 2026-07-19 follow-up, item 10: signed-out users saw a single
-- "1 / 1" card with dead navigation arrows. RLS on pl_stage3_picks hides locked
-- rows from non-members, so the app could no longer tell how many picks exist
-- and stopped generating the locked upsell placeholders.
--
-- The count of picks is not sensitive (pick details are). This view runs with
-- owner privileges (standard view semantics), so it can count all visible rows
-- while RLS keeps the locked rows' contents protected.
--
-- Idempotent. Safe to re-run.

BEGIN;

CREATE OR REPLACE VIEW public.v_gateway_stage3_pick_counts_public AS
SELECT
  age_band_id,
  category_type_id,
  count(*)::int AS pick_count
FROM public.pl_stage3_picks
WHERE status = 'visible' AND is_visible = true
GROUP BY age_band_id, category_type_id;

GRANT SELECT ON public.v_gateway_stage3_pick_counts_public TO anon, authenticated;

COMMIT;
