-- ABI V2 import for Discover age bands 28-30m and 31-33m.
-- Source of truth: uploaded ABI_28_30m_ready.csv + ABI_31_33m_ready.csv
-- Behavior: imports Stage 1 + Stage 2 mappings; Stage 3 intentionally stays empty.
-- Idempotent: safe to re-run.

BEGIN;

CREATE TEMP TABLE tmp_abi_gateway_stage (
  age_band_id TEXT NOT NULL,
  age_band_label TEXT NOT NULL,
  min_months INTEGER NOT NULL,
  max_months INTEGER NOT NULL,
  age_band_is_active BOOLEAN NOT NULL,
  stage1_wrapper_ux_slug TEXT NOT NULL,
  stage1_wrapper_ux_label TEXT NOT NULL,
  stage1_wrapper_rank_in_band INTEGER NOT NULL,
  stage1_mapping_is_active BOOLEAN NOT NULL,
  development_need_slug TEXT NOT NULL,
  development_need_canonical_name TEXT NOT NULL,
  stage1_why_it_matters_ux_description TEXT,
  stage2_category_type_slug TEXT NOT NULL,
  stage2_category_type_label TEXT NOT NULL,
  stage2_category_type_name TEXT NOT NULL,
  stage2_play_ideas_rank INTEGER NOT NULL,
  stage2_play_idea_mapping_rationale TEXT,
  stage3_product_name TEXT,
  stage3_product_brand TEXT,
  stage3_product_rank_in_category INTEGER,
  stage3_product_mapping_rationale TEXT,
  optional_need_meta_stage_anchor_month INTEGER,
  optional_need_meta_stage_phase TEXT,
  optional_need_meta_stage_reason TEXT
) ON COMMIT DROP;

INSERT INTO tmp_abi_gateway_stage (
  age_band_id,
  age_band_label,
  min_months,
  max_months,
  age_band_is_active,
  stage1_wrapper_ux_slug,
  stage1_wrapper_ux_label,
  stage1_wrapper_rank_in_band,
  stage1_mapping_is_active,
  development_need_slug,
  development_need_canonical_name,
  stage1_why_it_matters_ux_description,
  stage2_category_type_slug,
  stage2_category_type_label,
  stage2_category_type_name,
  stage2_play_ideas_rank,
  stage2_play_idea_mapping_rationale,
  stage3_product_name,
  stage3_product_brand,
  stage3_product_rank_in_category,
  stage3_product_mapping_rationale,
  optional_need_meta_stage_anchor_month,
  optional_need_meta_stage_phase,
  optional_need_meta_stage_reason
)
VALUES
  ('28-30m', '28–30 months', 28, 30, TRUE, 'pretend-and-social-play', 'Pretend & Social Play', 1, TRUE, 'pretend-and-social-play', 'Pretend & Social Play', 'Pretend play is at its richest right now — your child is beginning to assign roles and follow a shared story with peers.', 'tea_set_picnic_set', 'Tea Set / Picnic Set', 'Tea Set / Picnic Set', 1, 'Supports elaborate pretend play, social role-taking, and language development', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'emotions-and-feelings', 'Emotions & Feelings', 2, TRUE, 'emotions-and-feelings', 'Emotions & Feelings', 'Giving your child the words for feelings is one of the most powerful things you can do — it reduces tantrums and builds emotional intelligence.', 'emotion_cards', 'Emotion Cards / Feelings Mirror Set', 'Emotion Cards / Feelings Mirror Set', 1, 'Supports recognition and naming of emotions through visual matching and mirror play', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'emotions-and-feelings', 'Emotions & Feelings', 2, TRUE, 'emotions-and-feelings', 'Emotions & Feelings', 'Giving your child the words for feelings is one of the most powerful things you can do — it reduces tantrums and builds emotional intelligence.', 'picture_books_feelings', 'Feelings & Emotions Picture Books', 'Feelings & Emotions Picture Books', 2, 'Builds emotional vocabulary and empathy through story-based exploration of feelings', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'early-stem-and-spatial', 'Early STEM & Spatial', 3, TRUE, 'early-stem-and-spatial', 'Early STEM & Spatial', 'Weighing and balancing teaches your child that the world has patterns and rules — and that you can discover them by experimenting.', 'balance_scale', 'Balance Scale / Weighing Set', 'Balance Scale / Weighing Set', 1, 'Introduces early STEM concepts of weight, balance, and measurement through hands-on exploration', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'early-stem-and-spatial', 'Early STEM & Spatial', 3, TRUE, 'early-stem-and-spatial', 'Early STEM & Spatial', 'Weighing and balancing teaches your child that the world has patterns and rules — and that you can discover them by experimenting.', 'sand_water_play', 'Sand & Water Play Set', 'Sand & Water Play Set', 2, 'Supports early STEM exploration of volume, pouring, and measurement; builds fine motor and sensory processing', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'early-stem-and-spatial', 'Early STEM & Spatial', 3, TRUE, 'early-stem-and-spatial', 'Early STEM & Spatial', 'Weighing and balancing teaches your child that the world has patterns and rules — and that you can discover them by experimenting.', 'shape_peg_puzzle', 'Shape Peg Puzzle', 'Shape Peg Puzzle', 3, 'Builds shape recognition, spatial reasoning, and fine motor control through peg manipulation', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'language-and-questions', 'Language & Questions', 4, TRUE, 'language-and-questions', 'Language & Questions', 'Books are still the richest source of new vocabulary for your child — far richer than screen time.', 'picture_books', 'Picture Books (everyday scenes, simple narrative)', 'Picture Books (everyday scenes, simple narrative)', 1, 'Builds vocabulary, narrative understanding, and question-asking skills', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'toilet-training', 'Toilet Training', 5, TRUE, 'toilet-training', 'Toilet Training', 'Many children are ready to begin toilet training between 28-30 months — watch for readiness signs rather than starting by calendar age.', 'potty', 'Potty Chair', 'Potty Chair', 1, 'Supports active toilet training at the peak readiness window for many children', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'toilet-training', 'Toilet Training', 5, TRUE, 'toilet-training', 'Toilet Training', 'Many children are ready to begin toilet training between 28-30 months — watch for readiness signs rather than starting by calendar age.', 'step_stool', 'Child Step Stool (bathroom)', 'Child Step Stool (bathroom)', 2, 'Enables independent access to sink and toilet; supports toilet training and hygiene routines', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 6, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 'Ball play builds coordination and body awareness while giving your toddler a reason to run, kick, and chase.', 'ball', 'Soft Ball (kicking, throwing, rolling)', 'Soft Ball (kicking, throwing, rolling)', 1, 'Supports jumping, running, kicking, and throwing — all key gross motor milestones at 28-30 months', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('28-30m', '28–30 months', 28, 30, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 6, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 'Ball play builds coordination and body awareness while giving your toddler a reason to run, kick, and chase.', 'outdoor_climbing_frame', 'Outdoor Climbing Frame / Slide', 'Outdoor Climbing Frame / Slide', 2, 'Supports climbing, sliding, and jumping — key gross motor milestones at 28-30 months', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 1, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 'Matching, sorting, and measuring are how your child is building the foundations of maths and science — one experiment at a time.', 'memory_game', 'Simple Memory / Matching Card Game', 'Simple Memory / Matching Card Game', 1, 'Builds visual memory, matching skills, and concentration through structured turn-taking play', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 1, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 'Matching, sorting, and measuring are how your child is building the foundations of maths and science — one experiment at a time.', 'liquid_lab_pouring_set', 'Pouring & Volume Play Set', 'Pouring & Volume Play Set', 2, 'Introduces early STEM concepts of volume, conservation, and liquid behaviour through hands-on exploration', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 1, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 'Matching, sorting, and measuring are how your child is building the foundations of maths and science — one experiment at a time.', 'pattern_puzzle', 'Pattern / Twist Puzzle', 'Pattern / Twist Puzzle', 3, 'Builds spatial reasoning, concentration, and problem-solving through rotation and pattern challenges', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 1, TRUE, 'early-stem-and-matching', 'Early STEM & Matching', 'Matching, sorting, and measuring are how your child is building the foundations of maths and science — one experiment at a time.', 'jigsaw_puzzle', 'Jigsaw Puzzle (4-8 pieces)', 'Jigsaw Puzzle (4-8 pieces)', 4, 'Builds spatial reasoning, problem-solving, and concentration through increasingly complex puzzle challenges', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'pretend-and-peer-play', 'Pretend & Peer Play', 2, TRUE, 'pretend-and-peer-play', 'Pretend & Peer Play', 'Pretend play is at its richest right now — your child is assigning roles, following a story, and practising real-world social scripts.', 'pretend_play_props', 'Pretend Play Props (food, utensils, small world)', 'Pretend Play Props (food, utensils, small world)', 1, 'Supports elaborate cooperative pretend play, language, and social role-taking', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'pretend-and-peer-play', 'Pretend & Peer Play', 2, TRUE, 'pretend-and-peer-play', 'Pretend & Peer Play', 'Pretend play is at its richest right now — your child is assigning roles, following a story, and practising real-world social scripts.', 'picture_books', 'Picture Books (narrative, everyday scenes)', 'Picture Books (narrative, everyday scenes)', 2, 'Builds vocabulary, narrative sequencing, and question-asking skills', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'transitions-and-emotions', 'Transitions & Emotions', 3, TRUE, 'transitions-and-emotions', 'Transitions & Emotions', 'Transitions are one of the hardest moments for toddlers. A visual timer gives them a sense of control and predictability.', 'visual_timer', 'Visual Countdown Timer', 'Visual Countdown Timer', 1, 'Reduces transition frustration by making time visible; supports self-regulation and routine management', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'language-and-curiosity', 'Language & Curiosity', 4, TRUE, 'language-and-curiosity', 'Language & Curiosity', 'The ''why'' phase is beginning. The best response is to answer simply and ask ''What do you think?'' — curiosity is the engine of learning.', 'picture_books', 'Picture Books (narrative, everyday scenes)', 'Picture Books (narrative, everyday scenes)', 1, 'Builds vocabulary, narrative sequencing, and question-asking skills', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'toilet-training-and-independence', 'Toilet Training & Independence', 5, TRUE, 'toilet-training-and-independence', 'Toilet Training & Independence', 'If your child is not yet trained, 31-33 months is a common window for it to click — keep the potty accessible and the pressure low.', 'potty', 'Potty Chair / Toilet Seat Adapter', 'Potty Chair / Toilet Seat Adapter', 1, 'Supports active toilet training; many children are achieving daytime dryness at this stage', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'toilet-training-and-independence', 'Toilet Training & Independence', 5, TRUE, 'toilet-training-and-independence', 'Toilet Training & Independence', 'If your child is not yet trained, 31-33 months is a common window for it to click — keep the potty accessible and the pressure low.', 'step_stool', 'Child Step Stool', 'Child Step Stool', 2, 'Enables independent access to sink and toilet; supports hand-washing and toilet independence', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 6, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 'Hoops and bean bags turn movement into a game — building coordination, body awareness, and the joy of physical challenge.', 'hoops_bean_bags', 'Hoops & Bean Bags', 'Hoops & Bean Bags', 1, 'Supports jumping, hopping, tossing, and aiming — key gross motor milestones at 31-33 months', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('31-33m', '31–33 months', 31, 33, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 6, TRUE, 'gross-motor-and-active-play', 'Gross Motor & Active Play', 'Hoops and bean bags turn movement into a game — building coordination, body awareness, and the joy of physical challenge.', 'outdoor_climbing_frame', 'Outdoor Climbing Frame / Slide', 'Outdoor Climbing Frame / Slide', 2, 'Supports climbing, sliding, and jumping — key gross motor milestones at 31-33 months', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

DO $$
DECLARE
  v_stage3_rows INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_stage3_rows
  FROM tmp_abi_gateway_stage
  WHERE NULLIF(TRIM(COALESCE(stage3_product_name, '')), '') IS NOT NULL;

  IF v_stage3_rows > 0 THEN
    RAISE EXCEPTION 'Expected blank Stage 3 product fields for this import; found % rows.', v_stage3_rows;
  END IF;
END $$;

-- Pre-deduplicate payloads by ON CONFLICT keys so one statement never tries
-- to update the same target row more than once.
CREATE TEMP TABLE tmp_abi_stage1_wrappers AS
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY s.stage1_wrapper_ux_slug
      ORDER BY
        s.min_months ASC,
        s.age_band_id ASC,
        s.stage1_wrapper_rank_in_band ASC,
        s.stage2_play_ideas_rank ASC,
        s.stage2_category_type_slug ASC
    ) AS rn
  FROM tmp_abi_gateway_stage s
) s
WHERE s.rn = 1;

CREATE TEMP TABLE tmp_abi_stage1_age_band_wrappers AS
SELECT
  s.age_band_id,
  s.stage1_wrapper_ux_slug,
  MIN(s.stage1_wrapper_rank_in_band) AS stage1_wrapper_rank_in_band,
  BOOL_OR(s.stage1_mapping_is_active) AS stage1_mapping_is_active
FROM tmp_abi_gateway_stage s
GROUP BY s.age_band_id, s.stage1_wrapper_ux_slug;

CREATE TEMP TABLE tmp_abi_stage2_category_types AS
SELECT
  s.stage2_category_type_slug,
  s.stage2_category_type_label,
  s.stage2_category_type_name
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY s.stage2_category_type_slug
      ORDER BY
        s.min_months ASC,
        s.age_band_id ASC,
        s.stage2_play_ideas_rank ASC,
        s.stage1_wrapper_rank_in_band ASC
    ) AS rn
  FROM tmp_abi_gateway_stage s
) s
WHERE s.rn = 1;

-- 1) Age bands
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT DISTINCT
  s.age_band_id,
  s.age_band_label,
  s.min_months,
  s.max_months,
  s.age_band_is_active
FROM tmp_abi_gateway_stage s
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 2) Development needs (reuse by slug/name where possible; create only unresolved)
INSERT INTO public.pl_development_needs (
  name,
  slug,
  plain_english_description,
  why_it_matters
)
SELECT
  src.development_need_canonical_name,
  src.development_need_slug,
  COALESCE(src.stage1_why_it_matters_ux_description, ''),
  COALESCE(src.stage1_why_it_matters_ux_description, '')
FROM (
  SELECT DISTINCT
    s.development_need_slug,
    s.development_need_canonical_name,
    NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
  FROM tmp_abi_gateway_stage s
) src
LEFT JOIN public.pl_development_needs dn_slug
  ON LOWER(COALESCE(dn_slug.slug, '')) = LOWER(src.development_need_slug)
LEFT JOIN public.pl_development_needs dn_name
  ON LOWER(COALESCE(dn_name.name, '')) = LOWER(src.development_need_canonical_name)
WHERE dn_slug.id IS NULL
  AND dn_name.id IS NULL
ON CONFLICT (slug) DO NOTHING;

UPDATE public.pl_development_needs dn
SET
  name = COALESCE(NULLIF(dn.name, ''), src.development_need_canonical_name),
  plain_english_description = COALESCE(NULLIF(dn.plain_english_description, ''), src.stage1_why_it_matters_ux_description),
  why_it_matters = COALESCE(NULLIF(dn.why_it_matters, ''), src.stage1_why_it_matters_ux_description),
  updated_at = now()
FROM (
  SELECT DISTINCT
    s.development_need_slug,
    s.development_need_canonical_name,
    NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
  FROM tmp_abi_gateway_stage s
) src
WHERE LOWER(COALESCE(dn.slug, '')) = LOWER(src.development_need_slug);

-- 3) Stage 1 wrappers + wrapper->need mapping
INSERT INTO public.pl_ux_wrappers (
  ux_slug,
  ux_label,
  ux_description,
  is_active
)
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  s.stage1_why_it_matters_ux_description,
  true
FROM tmp_abi_stage1_wrappers s
ON CONFLICT (ux_slug) DO UPDATE
SET
  ux_label = EXCLUDED.ux_label,
  ux_description = EXCLUDED.ux_description,
  is_active = true,
  updated_at = now();

INSERT INTO public.pl_ux_wrapper_needs (
  ux_wrapper_id,
  development_need_id
)
SELECT DISTINCT
  uw.id AS ux_wrapper_id,
  dn.id AS development_need_id
FROM tmp_abi_gateway_stage s
JOIN public.pl_ux_wrappers uw
  ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
JOIN LATERAL (
  SELECT d.id
  FROM public.pl_development_needs d
  WHERE LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug)
     OR LOWER(COALESCE(d.name, '')) = LOWER(s.development_need_canonical_name)
  ORDER BY
    CASE WHEN LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug) THEN 0 ELSE 1 END,
    d.id
  LIMIT 1
) dn ON true
ON CONFLICT (ux_wrapper_id) DO UPDATE
SET
  development_need_id = EXCLUDED.development_need_id,
  updated_at = now();

-- 4) Stage 1 age-band wrapper rankings (deactivate extras for these bands, then upsert source rows)
UPDATE public.pl_age_band_ux_wrappers abuw
SET
  is_active = false,
  updated_at = now()
WHERE abuw.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_abi_stage1_age_band_wrappers)
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_abi_stage1_age_band_wrappers s
    JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
    WHERE s.age_band_id = abuw.age_band_id
      AND uw.id = abuw.ux_wrapper_id
  );

INSERT INTO public.pl_age_band_ux_wrappers (
  age_band_id,
  ux_wrapper_id,
  rank,
  is_active
)
SELECT
  s.age_band_id,
  uw.id,
  s.stage1_wrapper_rank_in_band,
  s.stage1_mapping_is_active
FROM tmp_abi_stage1_age_band_wrappers s
JOIN public.pl_ux_wrappers uw
  ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 5) Stage 2 category type masters (reuse by slug/name/label; create unresolved)
INSERT INTO public.pl_category_types (
  slug,
  label,
  name,
  description,
  safety_notes
)
SELECT
  src.stage2_category_type_slug,
  src.stage2_category_type_label,
  src.stage2_category_type_name,
  NULL,
  NULL
FROM tmp_abi_stage2_category_types src
LEFT JOIN public.pl_category_types ct_slug
  ON LOWER(COALESCE(ct_slug.slug, '')) = LOWER(src.stage2_category_type_slug)
LEFT JOIN public.pl_category_types ct_name
  ON LOWER(COALESCE(ct_name.name, '')) = LOWER(src.stage2_category_type_name)
LEFT JOIN public.pl_category_types ct_label
  ON LOWER(COALESCE(ct_label.label, '')) = LOWER(src.stage2_category_type_label)
WHERE ct_slug.id IS NULL
  AND ct_name.id IS NULL
  AND ct_label.id IS NULL
ON CONFLICT (slug) DO NOTHING;

UPDATE public.pl_category_types ct
SET
  label = COALESCE(NULLIF(ct.label, ''), src.stage2_category_type_label),
  name = COALESCE(NULLIF(ct.name, ''), src.stage2_category_type_name),
  updated_at = now()
FROM tmp_abi_stage2_category_types src
WHERE LOWER(COALESCE(ct.slug, '')) = LOWER(src.stage2_category_type_slug);

-- 6) Stage 2 need->category mappings for age bands
CREATE TEMP TABLE tmp_abi_resolved_need_category AS
SELECT DISTINCT
  s.age_band_id,
  dn.id AS development_need_id,
  ct.id AS category_type_id,
  s.stage2_play_ideas_rank AS rank,
  NULLIF(TRIM(COALESCE(s.stage2_play_idea_mapping_rationale, '')), '') AS rationale
FROM tmp_abi_gateway_stage s
JOIN LATERAL (
  SELECT d.id
  FROM public.pl_development_needs d
  WHERE LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug)
     OR LOWER(COALESCE(d.name, '')) = LOWER(s.development_need_canonical_name)
  ORDER BY
    CASE WHEN LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug) THEN 0 ELSE 1 END,
    d.id
  LIMIT 1
) dn ON true
JOIN LATERAL (
  SELECT c.id
  FROM public.pl_category_types c
  WHERE LOWER(COALESCE(c.slug, '')) = LOWER(s.stage2_category_type_slug)
     OR LOWER(COALESCE(c.name, '')) = LOWER(s.stage2_category_type_name)
     OR LOWER(COALESCE(c.label, '')) = LOWER(s.stage2_category_type_label)
  ORDER BY
    CASE
      WHEN LOWER(COALESCE(c.slug, '')) = LOWER(s.stage2_category_type_slug) THEN 0
      WHEN LOWER(COALESCE(c.name, '')) = LOWER(s.stage2_category_type_name) THEN 1
      ELSE 2
    END,
    c.id
  LIMIT 1
) ct ON true;

UPDATE public.pl_age_band_development_need_category_types m
SET
  is_active = false,
  updated_at = now()
WHERE m.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_abi_gateway_stage)
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_abi_resolved_need_category r
    WHERE r.age_band_id = m.age_band_id
      AND r.development_need_id = m.development_need_id
      AND r.category_type_id = m.category_type_id
  );

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id,
  development_need_id,
  category_type_id,
  rank,
  rationale,
  is_active
)
SELECT
  r.age_band_id,
  r.development_need_id,
  r.category_type_id,
  r.rank,
  r.rationale,
  true
FROM tmp_abi_resolved_need_category r
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  is_active = true,
  updated_at = now();

-- 7) Optional need meta (only when optional columns are provided)
INSERT INTO public.pl_age_band_development_need_meta (
  age_band_id,
  development_need_id,
  stage_anchor_month,
  stage_phase,
  stage_reason,
  is_active
)
SELECT DISTINCT
  s.age_band_id,
  dn.id,
  s.optional_need_meta_stage_anchor_month,
  NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_phase, '')), ''),
  NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_reason, '')), ''),
  true
FROM tmp_abi_gateway_stage s
JOIN LATERAL (
  SELECT d.id
  FROM public.pl_development_needs d
  WHERE LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug)
     OR LOWER(COALESCE(d.name, '')) = LOWER(s.development_need_canonical_name)
  ORDER BY
    CASE WHEN LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug) THEN 0 ELSE 1 END,
    d.id
  LIMIT 1
) dn ON true
WHERE s.optional_need_meta_stage_anchor_month IS NOT NULL
   OR NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_phase, '')), '') IS NOT NULL
   OR NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_reason, '')), '') IS NOT NULL
ON CONFLICT (age_band_id, development_need_id) DO UPDATE
SET
  stage_anchor_month = COALESCE(EXCLUDED.stage_anchor_month, public.pl_age_band_development_need_meta.stage_anchor_month),
  stage_phase = COALESCE(EXCLUDED.stage_phase, public.pl_age_band_development_need_meta.stage_phase),
  stage_reason = COALESCE(EXCLUDED.stage_reason, public.pl_age_band_development_need_meta.stage_reason),
  is_active = true,
  updated_at = now();

-- 8) Stage 3 intentionally empty per CSV: deactivate product mappings for these age bands.
UPDATE public.pl_age_band_category_type_products p
SET
  is_active = false,
  updated_at = now()
WHERE p.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_abi_gateway_stage);

DO $$
DECLARE
  v_rows_loaded INTEGER;
  v_age_bands INTEGER;
  v_wrappers INTEGER;
  v_needs INTEGER;
  v_categories INTEGER;
  v_need_category_mappings INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_abi_gateway_stage;
  SELECT COUNT(DISTINCT age_band_id) INTO v_age_bands FROM tmp_abi_gateway_stage;
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_wrappers FROM tmp_abi_gateway_stage;
  SELECT COUNT(DISTINCT development_need_slug) INTO v_needs FROM tmp_abi_gateway_stage;
  SELECT COUNT(DISTINCT stage2_category_type_slug) INTO v_categories FROM tmp_abi_gateway_stage;
  SELECT COUNT(*) INTO v_need_category_mappings FROM tmp_abi_resolved_need_category;
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_abi_gateway_stage)
    AND is_active = true;

  RAISE NOTICE 'ABI import rows loaded: %', v_rows_loaded;
  RAISE NOTICE 'Age bands in import: %', v_age_bands;
  RAISE NOTICE 'Distinct Stage 1 wrappers: %', v_wrappers;
  RAISE NOTICE 'Distinct development needs: %', v_needs;
  RAISE NOTICE 'Distinct Stage 2 category types: %', v_categories;
  RAISE NOTICE 'Resolved need->category mappings: %', v_need_category_mappings;
  RAISE NOTICE 'Active Stage 3 mappings after import (expected 0): %', v_stage3_active;
END $$;

COMMIT;

-- Rollback (scoped):
-- 1) Delete age-band mappings for imported bands:
--    DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('28-30m','31-33m');
--    DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('28-30m','31-33m');
--    DELETE FROM public.pl_age_band_development_need_meta WHERE age_band_id IN ('28-30m','31-33m');
--    DELETE FROM public.pl_age_band_category_type_products WHERE age_band_id IN ('28-30m','31-33m');
-- 2) Optionally delete age bands:
--    DELETE FROM public.pl_age_bands WHERE id IN ('28-30m','31-33m');
-- 3) Optionally deactivate or remove newly-created wrappers/needs/categories after manual verification.
