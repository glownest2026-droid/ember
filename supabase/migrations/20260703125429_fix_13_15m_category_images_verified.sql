-- Fix category image mappings: point at verified Storage objects only.
-- Deactivate age-scoped rows when no live object exists.

BEGIN;

-- cat_walk_with_job → ember_cat_walk_with_job_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '629b2e06-6ad9-4e6e-9a88-d4b766245e1b'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_walk_with_job_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '629b2e06-6ad9-4e6e-9a88-d4b766245e1b'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_walk_with_job_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '629b2e06-6ad9-4e6e-9a88-d4b766245e1b'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_walk_with_job_category.png'
);

-- cat_water_marks → ember_cat_water_marks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'aaae0f93-3f24-46b0-aae5-4d2e77a27a15'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_marks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'aaae0f93-3f24-46b0-aae5-4d2e77a27a15'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_marks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'aaae0f93-3f24-46b0-aae5-4d2e77a27a15'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_marks_category.png'
);

-- cat_spoon_practice → ember_cat_spoon_practice_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '157737e6-aa62-48b3-b9d4-31bddd20325d'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '157737e6-aa62-48b3-b9d4-31bddd20325d'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '157737e6-aa62-48b3-b9d4-31bddd20325d'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png'
);

-- cat_tiny_choices → ember_cat_tiny_choices_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c5e6026e-f6ca-4ee2-a4a8-0c8c7db93ff4'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c5e6026e-f6ca-4ee2-a4a8-0c8c7db93ff4'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c5e6026e-f6ca-4ee2-a4a8-0c8c7db93ff4'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png'
);

-- cat_real_object_baskets → ember_cat_safe_household_objects_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png'
);

-- cat_carry_something_small → ember_cat_carry_something_small_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6b5d0987-3539-4f18-8e6f-61f49cd95a69'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_carry_something_small_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6b5d0987-3539-4f18-8e6f-61f49cd95a69'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_carry_something_small_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6b5d0987-3539-4f18-8e6f-61f49cd95a69'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_carry_something_small_category.png'
);

-- cat_small_object_sweep → ember_cat_small_object_sweep_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0de8d58f-8a73-4924-86c5-c09181299170'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_4_6m_category.png'
);

-- cat_action_songs_pauses → ember_cat_songs_action_games_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '69daba17-3cac-4a0d-8bee-ef456b4954a9'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '69daba17-3cac-4a0d-8bee-ef456b4954a9'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '69daba17-3cac-4a0d-8bee-ef456b4954a9'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png'
);

-- cat_point_name_walks → ember_cat_park_swing_walks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '672e39cf-8884-41bd-9f69-0ca37bedcd32'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swing_walks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '672e39cf-8884-41bd-9f69-0ca37bedcd32'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swing_walks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '672e39cf-8884-41bd-9f69-0ca37bedcd32'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swing_walks_category.png'
);

-- cat_teddy_care_play → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '16973065-e03d-4999-ac6a-47221e9a6d7c'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_two_block_towers → ember_cat_tower_blocks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '006db08a-385a-436b-a850-727d1fd2a988'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '006db08a-385a-436b-a850-727d1fd2a988'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '006db08a-385a-436b-a850-727d1fd2a988'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png'
);

-- cat_books_with_pauses → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0ce343fd-d011-4ab5-bc54-516a034919cc'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_big_paper_floor → ember_cat_big_paper_floor_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bd04727a-80da-447a-a2bd-6fea9b46c4eb'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_paper_floor_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bd04727a-80da-447a-a2bd-6fea9b46c4eb'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_paper_floor_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bd04727a-80da-447a-a2bd-6fea9b46c4eb'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_paper_floor_category.png'
);

-- cat_copy_me_games → ember_cat_songs_action_games_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '64364568-020b-4dd4-8e95-45f41d91682f'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '64364568-020b-4dd4-8e95-45f41d91682f'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '64364568-020b-4dd4-8e95-45f41d91682f'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png'
);

-- cat_stairs_climbing_check → ember_cat_stairs_climbing_check_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '50e55d32-59c9-44db-b0f3-8cdf80bdd7eb'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stairs_climbing_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '50e55d32-59c9-44db-b0f3-8cdf80bdd7eb'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stairs_climbing_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '50e55d32-59c9-44db-b0f3-8cdf80bdd7eb'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stairs_climbing_check_category.png'
);

-- cat_roll_chase_games → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '90be286b-e051-44c7-aa9e-5abb6767281b'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '90be286b-e051-44c7-aa9e-5abb6767281b'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '90be286b-e051-44c7-aa9e-5abb6767281b'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_same_ending_phrase → ember_cat_same_ending_phrase_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '17e49cd4-e86b-46db-a642-69375fb364bd'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_same_ending_phrase_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '17e49cd4-e86b-46db-a642-69375fb364bd'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_same_ending_phrase_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '17e49cd4-e86b-46db-a642-69375fb364bd'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_same_ending_phrase_category.png'
);

-- cat_bath_cup_pouring → ember_cat_bath_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '59f39146-4717-473d-88d7-f8f375aa3759'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '59f39146-4717-473d-88d7-f8f375aa3759'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '59f39146-4717-473d-88d7-f8f375aa3759'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cups_category.png'
);

-- cat_hide_find_cups → ember_cat_stacking_nesting_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png'
);

-- cat_roll_ball_turns → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c9a05937-5116-4a54-87e2-b1d34922e826'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_short_reconnects → ember_cat_short_reconnects_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '9632a54f-be58-4566-aaef-dcd7820bbc20'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_reconnects_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '9632a54f-be58-4566-aaef-dcd7820bbc20'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_reconnects_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9632a54f-be58-4566-aaef-dcd7820bbc20'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_reconnects_category.png'
);

-- cat_everyday_sound_games → ember_cat_everyday_sound_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b47b102c-382a-4949-9b8f-99e877984304'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_everyday_sound_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b47b102c-382a-4949-9b8f-99e877984304'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_everyday_sound_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b47b102c-382a-4949-9b8f-99e877984304'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_everyday_sound_games_category.png'
);

-- cat_mini_jobs → ember_cat_mini_jobs_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '246ee4ce-d764-426e-9c85-b55bdc9f4c06'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mini_jobs_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '246ee4ce-d764-426e-9c85-b55bdc9f4c06'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mini_jobs_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '246ee4ce-d764-426e-9c85-b55bdc9f4c06'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mini_jobs_category.png'
);

-- cat_tray_marks_food → ember_cat_tray_marks_food_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1c704dfd-cd67-4bf7-8382-cd0d179f72a7'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tray_marks_food_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1c704dfd-cd67-4bf7-8382-cd0d179f72a7'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tray_marks_food_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c704dfd-cd67-4bf7-8382-cd0d179f72a7'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tray_marks_food_category.png'
);

-- cat_family_food_copying → ember_cat_finger_food_prep_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6024951f-51f9-4618-80c6-53587b5de16c'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_prep_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6024951f-51f9-4618-80c6-53587b5de16c'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_prep_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6024951f-51f9-4618-80c6-53587b5de16c'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_prep_category.png'
);

-- cat_sofa_table_cruising → ember_cat_cruising_furniture_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '02efb5cc-c478-4177-bb36-cfeec827a81d'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cruising_furniture_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '02efb5cc-c478-4177-bb36-cfeec827a81d'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cruising_furniture_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '02efb5cc-c478-4177-bb36-cfeec827a81d'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cruising_furniture_category.png'
);

-- cat_three_object_tray → ember_cat_safe_household_objects_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4cf2bd8e-4b6e-4930-a146-5b596802293e'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4cf2bd8e-4b6e-4930-a146-5b596802293e'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4cf2bd8e-4b6e-4930-a146-5b596802293e'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png'
);

-- cat_blind_cords_trailing_wires → ember_cat_blind_cords_trailing_wires_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c4b55a07-66cd-4683-a36e-c6ad3bd7e31e'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cords_trailing_wires_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c4b55a07-66cd-4683-a36e-c6ad3bd7e31e'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cords_trailing_wires_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c4b55a07-66cd-4683-a36e-c6ad3bd7e31e'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cords_trailing_wires_category.png'
);

-- cat_tiny_music_basket → ember_cat_tiny_music_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f9b6c869-86de-4a14-b5fc-004ab8f27776'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_music_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f9b6c869-86de-4a14-b5fc-004ab8f27776'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_music_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f9b6c869-86de-4a14-b5fc-004ab8f27776'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_music_basket_category.png'
);

-- cat_more_all_done_routine → ember_cat_more_all_done_routine_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1c6e42c8-62a0-4e3c-8d86-4de33e53024d'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_more_all_done_routine_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1c6e42c8-62a0-4e3c-8d86-4de33e53024d'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_more_all_done_routine_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c6e42c8-62a0-4e3c-8d86-4de33e53024d'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_more_all_done_routine_category.png'
);

-- cat_safe_cupboard → ember_cat_safe_cupboard_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7e398750-cb7d-4047-a8cf-028113d20449'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_cupboard_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7e398750-cb7d-4047-a8cf-028113d20449'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_cupboard_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7e398750-cb7d-4047-a8cf-028113d20449'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_cupboard_category.png'
);

-- cat_low_cushion_routes → ember_cat_low_cushion_routes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0986f3e4-7305-4e29-97a9-39588313a840'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_cushion_routes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0986f3e4-7305-4e29-97a9-39588313a840'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_cushion_routes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0986f3e4-7305-4e29-97a9-39588313a840'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_cushion_routes_category.png'
);

-- cat_yes_drawer → ember_cat_yes_drawer_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e142906b-f27b-4357-8131-c35238691b8f'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_yes_drawer_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e142906b-f27b-4357-8131-c35238691b8f'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_yes_drawer_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e142906b-f27b-4357-8131-c35238691b8f'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_yes_drawer_category.png'
);

-- cat_tip_out_baskets → ember_cat_tip_out_baskets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dfa57e3b-a621-429e-832f-15d18ca9a211'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tip_out_baskets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dfa57e3b-a621-429e-832f-15d18ca9a211'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tip_out_baskets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dfa57e3b-a621-429e-832f-15d18ca9a211'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tip_out_baskets_category.png'
);

-- cat_out_and_about_kit → ember_cat_out_and_about_kit_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '05cc946c-2735-40eb-b034-45ec98fa36d5'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_out_and_about_kit_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '05cc946c-2735-40eb-b034-45ec98fa36d5'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_out_and_about_kit_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '05cc946c-2735-40eb-b034-45ec98fa36d5'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_out_and_about_kit_category.png'
);

-- cat_tiny_choice_moments → ember_cat_tiny_choice_moments_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd9c089b7-b8c9-4f54-9238-b17c922db5f0'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choice_moments_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd9c089b7-b8c9-4f54-9238-b17c922db5f0'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choice_moments_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd9c089b7-b8c9-4f54-9238-b17c922db5f0'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choice_moments_category.png'
);

-- cat_transition_basket → ember_cat_transition_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c1d1a79c-fbb4-44b7-ab09-13cf437941e6'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_transition_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c1d1a79c-fbb4-44b7-ab09-13cf437941e6'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_transition_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c1d1a79c-fbb4-44b7-ab09-13cf437941e6'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_transition_basket_category.png'
);

-- cat_all_done_cue → ember_cat_all_done_cue_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '06190b96-ffa9-47dc-b6da-01f5e7a31dd5'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_all_done_cue_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '06190b96-ffa9-47dc-b6da-01f5e7a31dd5'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_all_done_cue_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '06190b96-ffa9-47dc-b6da-01f5e7a31dd5'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_all_done_cue_category.png'
);

-- cat_low_shelf_tidy → ember_cat_low_shelf_tidy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '16353285-fb0e-4068-92a1-8e9583707601'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_shelf_tidy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '16353285-fb0e-4068-92a1-8e9583707601'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_shelf_tidy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '16353285-fb0e-4068-92a1-8e9583707601'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_shelf_tidy_category.png'
);

-- cat_rhyme_time_purpose → ember_cat_rhyme_time_purpose_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '63b8ffed-27f8-4283-a719-f1c7f7574965'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rhyme_time_purpose_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '63b8ffed-27f8-4283-a719-f1c7f7574965'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rhyme_time_purpose_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '63b8ffed-27f8-4283-a719-f1c7f7574965'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rhyme_time_purpose_category.png'
);

-- cat_wipe_clean_marks → ember_cat_wipe_clean_marks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c640e0b4-9297-4607-a012-dfffd12de323'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_wipe_clean_marks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c640e0b4-9297-4607-a012-dfffd12de323'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_wipe_clean_marks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c640e0b4-9297-4607-a012-dfffd12de323'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_wipe_clean_marks_category.png'
);

-- cat_push_pull_play → ember_cat_push_pull_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '78225434-8e4d-4e9b-aeee-b79e980bde70'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '78225434-8e4d-4e9b-aeee-b79e980bde70'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '78225434-8e4d-4e9b-aeee-b79e980bde70'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_play_category.png'
);

-- cat_mealtime_clean_up_zone → ember_cat_mealtime_clean_up_zone_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd144495-c1d8-4255-a43c-1d3b0dae200f'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mealtime_clean_up_zone_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd144495-c1d8-4255-a43c-1d3b0dae200f'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mealtime_clean_up_zone_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd144495-c1d8-4255-a43c-1d3b0dae200f'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mealtime_clean_up_zone_category.png'
);

-- cat_kitchen_floor_setup → ember_cat_kitchen_floor_setup_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '84ceedcc-9ac2-4749-8fc0-cb3d85bbcf5c'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kitchen_floor_setup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '84ceedcc-9ac2-4749-8fc0-cb3d85bbcf5c'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kitchen_floor_setup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '84ceedcc-9ac2-4749-8fc0-cb3d85bbcf5c'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kitchen_floor_setup_category.png'
);

-- cat_bring_me_games → ember_cat_bring_me_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0d5bf0ac-de3c-4419-90d5-ae27377d4e5d'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bring_me_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0d5bf0ac-de3c-4419-90d5-ae27377d4e5d'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bring_me_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0d5bf0ac-de3c-4419-90d5-ae27377d4e5d'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bring_me_games_category.png'
);

-- cat_library_mat_stay_play → ember_cat_library_mat_stay_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1894cc19-8bb5-47b4-ba60-599e7fd89504'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1894cc19-8bb5-47b4-ba60-599e7fd89504'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1894cc19-8bb5-47b4-ba60-599e7fd89504'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png'
);

-- cat_cupboard_locks_cable_tidy → ember_cat_cupboard_locks_cable_tidy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd8d4261d-f44c-432d-af3d-e498d3db9cdb'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_cable_tidy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd8d4261d-f44c-432d-af3d-e498d3db9cdb'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_cable_tidy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd8d4261d-f44c-432d-af3d-e498d3db9cdb'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_cable_tidy_category.png'
);

-- cat_first_word_flap_books → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5727f5a1-3466-4b0d-aa3a-763396baf91b'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5727f5a1-3466-4b0d-aa3a-763396baf91b'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5727f5a1-3466-4b0d-aa3a-763396baf91b'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_simple_posting_toys → ember_cat_simple_posting_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0893c631-d8e2-4f02-bf44-f6d5b3e3861e'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_posting_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0893c631-d8e2-4f02-bf44-f6d5b3e3861e'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_posting_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0893c631-d8e2-4f02-bf44-f6d5b3e3861e'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_posting_toys_category.png'
);

-- cat_soft_balls → ember_cat_soft_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a8e7148c-a732-4d58-8a12-cb24fc26299a'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a8e7148c-a732-4d58-8a12-cb24fc26299a'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a8e7148c-a732-4d58-8a12-cb24fc26299a'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_balls_category.png'
);

-- cat_animal_books → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ec7afc3c-4bde-4c84-949b-e10391132dcb'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ec7afc3c-4bde-4c84-949b-e10391132dcb'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ec7afc3c-4bde-4c84-949b-e10391132dcb'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_simple_puppets → ember_cat_simple_puppets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e5585ebd-ae1a-4306-9c6f-2d1a10069d90'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e5585ebd-ae1a-4306-9c6f-2d1a10069d90'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e5585ebd-ae1a-4306-9c6f-2d1a10069d90'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png'
);

-- cat_teddy_care_sets → ember_cat_teddy_care_sets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7cd4c296-f1b2-49f1-9aa4-25b4ef325390'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7cd4c296-f1b2-49f1-9aa4-25b4ef325390'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7cd4c296-f1b2-49f1-9aa4-25b4ef325390'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_sets_category.png'
);

-- cat_pull_along_animals → ember_cat_pull_along_animals_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4d3e3da5-1f4f-4f67-bb02-98d60f28f136'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_along_animals_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4d3e3da5-1f4f-4f67-bb02-98d60f28f136'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_along_animals_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4d3e3da5-1f4f-4f67-bb02-98d60f28f136'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_along_animals_category.png'
);

-- cat_action_song_books → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '05e09db2-af51-4370-923f-9fb080fedc64'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_toy_cups_bowls_spoons → ember_cat_toy_cups_bowls_spoons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd9947056-016a-4ad2-92a4-6cc330d9a7ed'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_bowls_spoons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd9947056-016a-4ad2-92a4-6cc330d9a7ed'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_bowls_spoons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd9947056-016a-4ad2-92a4-6cc330d9a7ed'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_bowls_spoons_category.png'
);

-- cat_water_doodle_mats → ember_cat_water_doodle_mats_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b98e4feb-2b97-4b53-9522-6f2ba497d2bc'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_doodle_mats_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b98e4feb-2b97-4b53-9522-6f2ba497d2bc'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_doodle_mats_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b98e4feb-2b97-4b53-9522-6f2ba497d2bc'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_doodle_mats_category.png'
);

-- cat_first_ride_on_toys → ember_cat_first_ride_on_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'de0aba2f-f925-4fb4-8049-19eae5a65911'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'de0aba2f-f925-4fb4-8049-19eae5a65911'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'de0aba2f-f925-4fb4-8049-19eae5a65911'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png'
);

-- cat_first_cleaning_play_sets → ember_cat_first_cleaning_play_sets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bc2ca6ac-cd11-4fbd-9d27-15ad7aca4fab'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bc2ca6ac-cd11-4fbd-9d27-15ad7aca4fab'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bc2ca6ac-cd11-4fbd-9d27-15ad7aca4fab'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png'
);

-- cat_little_carry_bags_baskets → ember_cat_little_carry_bags_baskets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '88b8f4ee-e595-49b0-a5b6-37465e98538d'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_little_carry_bags_baskets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '88b8f4ee-e595-49b0-a5b6-37465e98538d'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_little_carry_bags_baskets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '88b8f4ee-e595-49b0-a5b6-37465e98538d'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_little_carry_bags_baskets_category.png'
);

-- cat_play_tunnels_soft_shapes → ember_cat_play_tunnels_soft_shapes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b2f80128-3821-4c45-b2ea-1416e8f7a492'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tunnels_soft_shapes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b2f80128-3821-4c45-b2ea-1416e8f7a492'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tunnels_soft_shapes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b2f80128-3821-4c45-b2ea-1416e8f7a492'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tunnels_soft_shapes_category.png'
);

-- cat_hide_squeak_toys → ember_cat_hide_squeak_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8821df97-e91b-4190-b685-015bd2bd6383'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_squeak_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8821df97-e91b-4190-b685-015bd2bd6383'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_squeak_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8821df97-e91b-4190-b685-015bd2bd6383'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_squeak_toys_category.png'
);

-- cat_pretend_phone_keys → ember_cat_pretend_phone_keys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fc4196f4-e9d5-42df-9c35-d32d10a6bf34'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_phone_keys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fc4196f4-e9d5-42df-9c35-d32d10a6bf34'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_phone_keys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fc4196f4-e9d5-42df-9c35-d32d10a6bf34'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_phone_keys_category.png'
);

-- cat_ball_drop_rolling_toys → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '387ae64c-41a2-4e2a-974f-d5873a515c49'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '387ae64c-41a2-4e2a-974f-d5873a515c49'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '387ae64c-41a2-4e2a-974f-d5873a515c49'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

COMMIT;
