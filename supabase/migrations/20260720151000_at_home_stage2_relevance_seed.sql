-- PR2 seed: puzzles family + multi-band Stage 2 relevance for founder families.

-- =============================================================================
-- A. Puzzles family + age-fit product types
-- =============================================================================
INSERT INTO public.item_type_families (slug, label, hint)
VALUES
  ('puzzles', 'Puzzles', 'Chunky peg puzzles come first; bigger jigsaws later.')
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  hint = EXCLUDED.hint,
  is_active = true;

INSERT INTO public.product_types (
  slug,
  label,
  subtitle,
  family_slug,
  age_fit_variant,
  default_age_fit_min_months,
  default_age_fit_max_months,
  is_active
)
VALUES
  (
    'puzzle_peg_chunky',
    'Chunky peg puzzle',
    'Big knobs, few pieces — usually before two.',
    'puzzles',
    'peg_chunky',
    9,
    27,
    true
  ),
  (
    'puzzle_jigsaw_24_plus',
    '24+ piece jigsaw',
    'More pieces and a picture to work towards — usually from two up.',
    'puzzles',
    'jigsaw_24_plus',
    24,
    72,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  subtitle = EXCLUDED.subtitle,
  family_slug = EXCLUDED.family_slug,
  age_fit_variant = EXCLUDED.age_fit_variant,
  default_age_fit_min_months = EXCLUDED.default_age_fit_min_months,
  default_age_fit_max_months = EXCLUDED.default_age_fit_max_months,
  is_active = true;

DELETE FROM public.product_type_aliases pa
WHERE pa.normalized_alias IN (
  SELECT public.normalize_inventory_alias(v.alias)
  FROM (VALUES
    ('peg puzzle'),
    ('chunky puzzle'),
    ('shape puzzle'),
    ('peg puzzles'),
    ('chunky puzzles'),
    ('24 piece jigsaw'),
    ('24 piece puzzle'),
    ('48 piece jigsaw'),
    ('100 piece jigsaw'),
    ('floor puzzle')
  ) AS v(alias)
);

INSERT INTO public.product_type_aliases (product_type_id, alias)
SELECT pt.id, a.alias
FROM (VALUES
  ('puzzle_peg_chunky', 'peg puzzle'),
  ('puzzle_peg_chunky', 'chunky puzzle'),
  ('puzzle_peg_chunky', 'shape puzzle'),
  ('puzzle_peg_chunky', 'peg puzzles'),
  ('puzzle_peg_chunky', 'chunky puzzles'),
  ('puzzle_jigsaw_24_plus', '24 piece jigsaw'),
  ('puzzle_jigsaw_24_plus', '24 piece puzzle'),
  ('puzzle_jigsaw_24_plus', '48 piece jigsaw'),
  ('puzzle_jigsaw_24_plus', '100 piece jigsaw'),
  ('puzzle_jigsaw_24_plus', 'floor puzzle')
) AS a(type_slug, alias)
JOIN public.product_types pt ON pt.slug = a.type_slug
WHERE public.normalize_inventory_alias(a.alias) <> ''
ON CONFLICT (product_type_id, normalized_alias) DO NOTHING;

-- =============================================================================
-- B. Relevance seeds (join on slugs — data lives in data)
-- =============================================================================
INSERT INTO public.item_type_stage2_relevance (
  product_type_id,
  category_type_id,
  age_band_id,
  relevance_strength,
  min_fit_months,
  max_fit_months,
  mapping_rationale,
  source
)
SELECT
  pt.id,
  ct.id,
  m.age_band_id,
  m.relevance_strength,
  m.min_fit_months,
  m.max_fit_months,
  m.mapping_rationale,
  'seed'
FROM (VALUES
  -- character_soft_toy → comfort + care play across bands
  ('character_soft_toy', 'cat_13_15_comfort_toy', '13-15m', 'exact', 12, 18, 'Comfort object in routines cluster'),
  ('character_soft_toy', 'cat_comfort_toy', '19-21m', 'exact', 18, 24, 'Named comforter / soft toy'),
  ('character_soft_toy', 'cat_13_15_doll_soft_toy_care', '13-15m', 'close', 12, 18, 'Care play with named soft toys'),
  ('character_soft_toy', 'ent_cat_soft_doll', '9-12m', 'close', 9, 14, 'Early cuddly care play'),
  ('character_soft_toy', 'cat_doll_soft_toy_care', '34-36m', 'close', 30, 42, 'Richer pretend care play'),
  -- soft_toy (generic)
  ('soft_toy', 'cat_13_15_comfort_toy', '13-15m', 'close', 12, 18, 'Generic soft toy as comfort'),
  ('soft_toy', 'cat_comfort_toy', '19-21m', 'close', 18, 24, 'Generic soft toy comfort'),
  ('soft_toy', 'ent_cat_soft_doll', '9-12m', 'estimated', 9, 14, 'Early cuddly play'),
  -- toy_broom → pretend household copying
  ('toy_broom', 'cat_toy_cleaning_set', '19-21m', 'exact', 18, 24, 'Copying sweeping and tidying'),
  ('toy_broom', 'cat_child_cleaning_helper_set', '22-24m', 'exact', 22, 28, 'Helper-set pretend play'),
  ('toy_broom', 'cat_safe_household_objects', '13-15m', 'estimated', 12, 18, 'Everyday-object copying'),
  -- pretend_phone
  ('pretend_phone', 'cat_13_15_pretend_phone_talk', '13-15m', 'exact', 12, 18, 'Pretend phone chatter'),
  -- puzzle_peg_chunky — younger bands only
  ('puzzle_peg_chunky', 'ent_cat_pincer_puzzle', '9-12m', 'exact', 9, 14, 'Chunky peg / drop games'),
  ('puzzle_peg_chunky', 'ent_cat_first_puzzles', '9-12m', 'close', 10, 15, 'Big-piece first puzzles'),
  ('puzzle_peg_chunky', 'cat_13_15_shape_peg_puzzles', '13-15m', 'exact', 12, 18, 'Chunky shape peg puzzles'),
  ('puzzle_peg_chunky', 'cat_shape_sorters_puzzles', '19-21m', 'close', 18, 24, 'Shape sorters and first puzzles'),
  ('puzzle_peg_chunky', 'cat_shape_sorters_puzzles', '25-27m', 'estimated', 24, 30, 'Still chunky puzzle play'),
  -- puzzle_jigsaw_24_plus — NOT for 13–15m toddler bands
  ('puzzle_jigsaw_24_plus', 'cat_jigsaw_puzzles', '34-36m', 'exact', 30, 42, 'First jigsaw puzzles with a plan'),
  ('puzzle_jigsaw_24_plus', 'cat_shape_sorters_puzzles', '25-27m', 'close', 24, 30, 'Turning pieces and trying again')
) AS m(type_slug, category_slug, age_band_id, relevance_strength, min_fit_months, max_fit_months, mapping_rationale)
JOIN public.product_types pt ON pt.slug = m.type_slug
JOIN public.pl_category_types ct ON ct.slug = m.category_slug
ON CONFLICT ON CONSTRAINT item_type_stage2_relevance_unique DO UPDATE SET
  relevance_strength = EXCLUDED.relevance_strength,
  min_fit_months = EXCLUDED.min_fit_months,
  max_fit_months = EXCLUDED.max_fit_months,
  mapping_rationale = EXCLUDED.mapping_rationale,
  is_active = true,
  source = EXCLUDED.source;
