-- Map founder-managed category images for Discover Stage 2 (age-scoped).
-- Idempotent: deactivate superseded active rows, then insert one active row per scope.

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

-- cat_real_object_baskets → ember_cat_real_object_baskets_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_real_object_baskets_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_real_object_baskets_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_real_object_baskets_13_15m_category.png'
);

-- cat_carry_something_small → ember_cat_carry_something_small_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6b5d0987-3539-4f18-8e6f-61f49cd95a69'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_carry_something_small_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6b5d0987-3539-4f18-8e6f-61f49cd95a69'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_carry_something_small_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6b5d0987-3539-4f18-8e6f-61f49cd95a69'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_carry_something_small_13_15m_category.png'
);

-- cat_small_object_sweep → ember_cat_small_object_sweep_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0de8d58f-8a73-4924-86c5-c09181299170'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_13_15m_category.png'
);

-- cat_action_songs_pauses → ember_cat_action_songs_pauses_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '69daba17-3cac-4a0d-8bee-ef456b4954a9'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_songs_pauses_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '69daba17-3cac-4a0d-8bee-ef456b4954a9'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_songs_pauses_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '69daba17-3cac-4a0d-8bee-ef456b4954a9'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_songs_pauses_13_15m_category.png'
);

-- cat_point_name_walks → ember_cat_point_name_walks_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '672e39cf-8884-41bd-9f69-0ca37bedcd32'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_point_name_walks_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '672e39cf-8884-41bd-9f69-0ca37bedcd32'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_point_name_walks_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '672e39cf-8884-41bd-9f69-0ca37bedcd32'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_point_name_walks_13_15m_category.png'
);

-- cat_teddy_care_play → ember_cat_teddy_care_play_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_play_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '16973065-e03d-4999-ac6a-47221e9a6d7c'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_play_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_play_13_15m_category.png'
);

-- cat_two_block_towers → ember_cat_two_block_towers_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '006db08a-385a-436b-a850-727d1fd2a988'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_two_block_towers_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '006db08a-385a-436b-a850-727d1fd2a988'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_two_block_towers_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '006db08a-385a-436b-a850-727d1fd2a988'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_two_block_towers_13_15m_category.png'
);

-- cat_books_with_pauses → ember_cat_books_with_pauses_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_books_with_pauses_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0ce343fd-d011-4ab5-bc54-516a034919cc'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_books_with_pauses_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_books_with_pauses_13_15m_category.png'
);

-- cat_big_paper_floor → ember_cat_big_paper_floor_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bd04727a-80da-447a-a2bd-6fea9b46c4eb'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_paper_floor_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bd04727a-80da-447a-a2bd-6fea9b46c4eb'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_paper_floor_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bd04727a-80da-447a-a2bd-6fea9b46c4eb'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_paper_floor_13_15m_category.png'
);

-- cat_copy_me_games → ember_cat_copy_me_games_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '64364568-020b-4dd4-8e95-45f41d91682f'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_copy_me_games_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '64364568-020b-4dd4-8e95-45f41d91682f'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_copy_me_games_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '64364568-020b-4dd4-8e95-45f41d91682f'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_copy_me_games_13_15m_category.png'
);

-- cat_stairs_climbing_check → ember_cat_stairs_climbing_check_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '50e55d32-59c9-44db-b0f3-8cdf80bdd7eb'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stairs_climbing_check_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '50e55d32-59c9-44db-b0f3-8cdf80bdd7eb'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stairs_climbing_check_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '50e55d32-59c9-44db-b0f3-8cdf80bdd7eb'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stairs_climbing_check_13_15m_category.png'
);

-- cat_roll_chase_games → ember_cat_roll_chase_games_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '90be286b-e051-44c7-aa9e-5abb6767281b'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_chase_games_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '90be286b-e051-44c7-aa9e-5abb6767281b'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_chase_games_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '90be286b-e051-44c7-aa9e-5abb6767281b'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_chase_games_13_15m_category.png'
);

-- cat_same_ending_phrase → ember_cat_same_ending_phrase_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '17e49cd4-e86b-46db-a642-69375fb364bd'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_same_ending_phrase_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '17e49cd4-e86b-46db-a642-69375fb364bd'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_same_ending_phrase_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '17e49cd4-e86b-46db-a642-69375fb364bd'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_same_ending_phrase_13_15m_category.png'
);

-- cat_bath_cup_pouring → ember_cat_bath_cup_pouring_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '59f39146-4717-473d-88d7-f8f375aa3759'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cup_pouring_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '59f39146-4717-473d-88d7-f8f375aa3759'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cup_pouring_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '59f39146-4717-473d-88d7-f8f375aa3759'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cup_pouring_13_15m_category.png'
);

-- cat_hide_find_cups → ember_cat_hide_find_cups_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_find_cups_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_find_cups_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_find_cups_13_15m_category.png'
);

-- cat_roll_ball_turns → ember_cat_roll_ball_turns_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_ball_turns_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c9a05937-5116-4a54-87e2-b1d34922e826'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_ball_turns_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_ball_turns_13_15m_category.png'
);

-- cat_short_reconnects → ember_cat_short_reconnects_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '9632a54f-be58-4566-aaef-dcd7820bbc20'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_reconnects_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '9632a54f-be58-4566-aaef-dcd7820bbc20'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_reconnects_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9632a54f-be58-4566-aaef-dcd7820bbc20'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_reconnects_13_15m_category.png'
);

-- cat_everyday_sound_games → ember_cat_everyday_sound_games_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b47b102c-382a-4949-9b8f-99e877984304'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_everyday_sound_games_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b47b102c-382a-4949-9b8f-99e877984304'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_everyday_sound_games_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b47b102c-382a-4949-9b8f-99e877984304'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_everyday_sound_games_13_15m_category.png'
);

-- cat_mini_jobs → ember_cat_mini_jobs_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '246ee4ce-d764-426e-9c85-b55bdc9f4c06'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mini_jobs_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '246ee4ce-d764-426e-9c85-b55bdc9f4c06'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mini_jobs_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '246ee4ce-d764-426e-9c85-b55bdc9f4c06'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mini_jobs_13_15m_category.png'
);

-- cat_tray_marks_food → ember_cat_tray_marks_food_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1c704dfd-cd67-4bf7-8382-cd0d179f72a7'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tray_marks_food_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1c704dfd-cd67-4bf7-8382-cd0d179f72a7'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tray_marks_food_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c704dfd-cd67-4bf7-8382-cd0d179f72a7'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tray_marks_food_13_15m_category.png'
);

-- cat_family_food_copying → ember_cat_family_food_copying_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6024951f-51f9-4618-80c6-53587b5de16c'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_food_copying_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6024951f-51f9-4618-80c6-53587b5de16c'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_food_copying_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6024951f-51f9-4618-80c6-53587b5de16c'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_food_copying_13_15m_category.png'
);

-- cat_sofa_table_cruising → ember_cat_sofa_table_cruising_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '02efb5cc-c478-4177-bb36-cfeec827a81d'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sofa_table_cruising_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '02efb5cc-c478-4177-bb36-cfeec827a81d'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sofa_table_cruising_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '02efb5cc-c478-4177-bb36-cfeec827a81d'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sofa_table_cruising_13_15m_category.png'
);

-- cat_three_object_tray → ember_cat_three_object_tray_13_15m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4cf2bd8e-4b6e-4930-a146-5b596802293e'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_three_object_tray_13_15m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4cf2bd8e-4b6e-4930-a146-5b596802293e'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_three_object_tray_13_15m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4cf2bd8e-4b6e-4930-a146-5b596802293e'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_three_object_tray_13_15m_category.png'
);

COMMIT;
