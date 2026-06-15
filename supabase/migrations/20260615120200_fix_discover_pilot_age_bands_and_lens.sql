-- Activate pilot Discover age bands and resolve overlap with empty placeholder bands.
-- Correct cluster-level audience_lens using discover_projection normalisation rules.

BEGIN;

INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
VALUES
  ('6-9m', '6–9 months', 6, 9, true),
  ('9-12m', '9–12 months', 9, 12, true)
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = true,
  updated_at = now();

-- Empty taxonomy placeholders overlapped pilot month ranges and won tie-breaks.
UPDATE public.pl_age_bands
SET is_active = false, updated_at = now()
WHERE id IN ('7-9m', '10-12m');

UPDATE public.pl_age_band_ux_wrappers
SET is_active = false, updated_at = now()
WHERE age_band_id IN ('7-9m', '10-12m');

UPDATE public.pl_ux_wrappers uw
SET
  audience_lens = src.audience_lens,
  updated_at = now()
FROM (
  VALUES
    ('cluster_sitting_reaching', 'for_your_child'),
    ('cluster_crawling_floor', 'for_your_child'),
    ('cluster_object_permanence', 'for_your_child'),
    ('cluster_stacking_containment', 'for_your_child'),
    ('cluster_mouth_sensory', 'for_both'),
    ('cluster_first_foods', 'for_both'),
    ('cluster_home_safety', 'for_you'),
    ('cluster_books_sounds', 'for_your_child'),
    ('ent_cluster_move', 'for_both'),
    ('ent_cluster_hands', 'for_your_child'),
    ('ent_cluster_solve', 'for_your_child'),
    ('ent_cluster_words', 'for_your_child'),
    ('ent_cluster_feeding', 'for_you'),
    ('ent_cluster_safety', 'for_you'),
    ('ent_cluster_stories', 'for_your_child'),
    ('ent_cluster_days', 'for_both')
) AS src(ux_slug, audience_lens)
WHERE uw.ux_slug = src.ux_slug;

COMMIT;
