-- Expand At home catalogue for AI Tier 2 (pretend play props).

INSERT INTO public.item_type_families (slug, label, hint)
VALUES
  ('pretend_play', 'Pretend play', 'Dress-up, props and small-world play.')
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  hint = EXCLUDED.hint,
  is_active = true;

INSERT INTO public.product_types (slug, label, subtitle, family_slug, is_active)
VALUES
  ('toy_sword', 'Toy sword', 'Play swords and knight props.', 'pretend_play', true),
  ('toy_umbrella', 'Toy umbrella', 'Child-size play umbrellas.', 'pretend_play', true),
  ('toy_figure', 'Toy figure', 'Figures and characters like mermaids or animals.', 'pretend_play', true)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  subtitle = EXCLUDED.subtitle,
  family_slug = EXCLUDED.family_slug,
  is_active = true;

DELETE FROM public.product_type_aliases pa
WHERE pa.normalized_alias IN (
  SELECT public.normalize_inventory_alias(v.alias)
  FROM (VALUES ('sword'), ('sooty and sweep')) AS v(alias)
);

INSERT INTO public.product_type_aliases (product_type_id, alias)
SELECT pt.id, a.alias
FROM (VALUES
  ('character_soft_toy', 'sooty and sweep'),
  ('character_soft_toy', 'sooty'),
  ('character_soft_toy', 'sweep'),
  ('character_soft_toy', 'puppet'),
  ('character_soft_toy', 'hand puppet'),
  ('toy_figure', 'toy mermaid'),
  ('toy_figure', 'mermaid toy'),
  ('toy_umbrella', 'toy umbrella'),
  ('toy_sword', 'sword'),
  ('toy_sword', 'toy sword'),
  ('toy_sword', 'play sword')
) AS a(type_slug, alias)
JOIN public.product_types pt ON pt.slug = a.type_slug
WHERE public.normalize_inventory_alias(a.alias) <> ''
ON CONFLICT (product_type_id, normalized_alias) DO NOTHING;
