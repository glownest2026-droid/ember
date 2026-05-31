-- PR10 patch: potty_training_seat item type + toileting mapping (idempotent).
-- Apply after 202605311200_marketplace_intelligence_taxonomy.sql.

INSERT INTO public.marketplace_item_types
  (slug, canonical_name, label, synonyms, category_hint, parent_category_slug,
  default_min_age_months, default_max_age_months, default_outgrown_months,
  risk_level, recommendation_policy)
VALUES
  ('potty_training_seat', 'Potty training seat', 'Potty training seat',
    ARRAY['potty','potty chair','potty training seat','toilet training seat','training potty','toddler potty','potty seat','potty seat with handles','pink potty training seat','kids potty','child potty'],
    'toileting', 'toileting', 18, 48, 54, 'medium', 'recommendable')
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  parent_category_slug = EXCLUDED.parent_category_slug,
  default_min_age_months = EXCLUDED.default_min_age_months,
  default_max_age_months = EXCLUDED.default_max_age_months,
  default_outgrown_months = EXCLUDED.default_outgrown_months,
  risk_level = EXCLUDED.risk_level,
  recommendation_policy = EXCLUDED.recommendation_policy;

INSERT INTO public.marketplace_item_type_aliases (item_type_id, alias_text, source)
SELECT mit.id, a.alias_text, 'seed'
FROM (VALUES
  ('potty_training_seat', 'potty'),
  ('potty_training_seat', 'potty chair'),
  ('potty_training_seat', 'potty training seat'),
  ('potty_training_seat', 'toilet training seat'),
  ('potty_training_seat', 'training potty'),
  ('potty_training_seat', 'toddler potty'),
  ('potty_training_seat', 'potty seat'),
  ('potty_training_seat', 'potty seat with handles'),
  ('potty_training_seat', 'pink potty training seat'),
  ('potty_training_seat', 'kids potty'),
  ('potty_training_seat', 'child potty')
) AS a(slug, alias_text)
JOIN public.marketplace_item_types mit ON mit.slug = a.slug
ON CONFLICT (item_type_id, lower(alias_text)) DO NOTHING;

INSERT INTO public.marketplace_item_type_development_mappings
  (item_type_id, stage1_wrapper_ux_slug, stage1_wrapper_ux_label, mapping_strength,
  estimated_min_months, estimated_max_months, safety_gate_policy, mapping_rationale, source)
SELECT mit.id, m.wrapper_slug, m.label, m.strength, m.min_m, m.max_m, m.gate, m.rationale, 'seed'
FROM (VALUES
  ('potty_training_seat', 'toileting', 'I''m getting ready for potty', 'close', 18, 48, 'normal',
   'Supports toilet-training independence and toileting readiness.')
) AS m(item_type_slug, wrapper_slug, label, strength, min_m, max_m, gate, rationale)
JOIN public.marketplace_item_types mit ON mit.slug = m.item_type_slug
ON CONFLICT (item_type_id, stage1_wrapper_ux_slug) DO NOTHING;
