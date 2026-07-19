-- Map residual net-new Stage 2 category images (founder upload batch).
-- Source: stage2_net_new_art_distinct.csv + Storage HEAD preflight

BEGIN;

-- cat_age_warning_toy_check @ 34-36m → ember_cat_age_warning_toy_check_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bc4f36ce-2df0-4036-8a63-771a88424f43'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_age_warning_toy_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bc4f36ce-2df0-4036-8a63-771a88424f43'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_age_warning_toy_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bc4f36ce-2df0-4036-8a63-771a88424f43'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_age_warning_toy_check_category.png'
);

-- cat_blocks_building_challenges @ 34-36m → ember_cat_blocks_building_challenges_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4d17d20e-c133-49c9-8aa0-c5a4b762b923'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blocks_building_challenges_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4d17d20e-c133-49c9-8aa0-c5a4b762b923'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blocks_building_challenges_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4d17d20e-c133-49c9-8aa0-c5a4b762b923'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blocks_building_challenges_category.png'
);

-- cat_chunky_building_sets @ 19-21m → ember_cat_chunky_building_sets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ba969827-b286-49b4-b871-d664dbeae106'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_building_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ba969827-b286-49b4-b871-d664dbeae106'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_building_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ba969827-b286-49b4-b871-d664dbeae106'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_building_sets_category.png'
);

-- cat_chunky_building_sets @ 22-24m → ember_cat_chunky_building_sets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ba969827-b286-49b4-b871-d664dbeae106'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_building_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ba969827-b286-49b4-b871-d664dbeae106'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_building_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ba969827-b286-49b4-b871-d664dbeae106'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_building_sets_category.png'
);

-- cat_counting_sorting_loose_parts @ 34-36m → ember_cat_counting_sorting_loose_parts_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7d24bc0d-e9b0-42f6-b516-d8e7ccc0a65b'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_counting_sorting_loose_parts_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7d24bc0d-e9b0-42f6-b516-d8e7ccc0a65b'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_counting_sorting_loose_parts_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7d24bc0d-e9b0-42f6-b516-d8e7ccc0a65b'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_counting_sorting_loose_parts_category.png'
);

-- cat_draw_a_circle_games @ 34-36m → ember_cat_draw_a_circle_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '660474f5-1a66-4b63-a5c5-aad74063f89c'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_draw_a_circle_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '660474f5-1a66-4b63-a5c5-aad74063f89c'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_draw_a_circle_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '660474f5-1a66-4b63-a5c5-aad74063f89c'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_draw_a_circle_games_category.png'
);

-- cat_dress_up_role_play @ 22-24m → ember_cat_dress_up_role_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '81144834-ef9e-4d24-ab6f-fb8bf74bad50'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png'
);

-- cat_dress_up_role_play @ 25-27m → ember_cat_dress_up_role_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '81144834-ef9e-4d24-ab6f-fb8bf74bad50'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png'
);

-- cat_dress_up_role_play @ 28-30m → ember_cat_dress_up_role_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '81144834-ef9e-4d24-ab6f-fb8bf74bad50'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png'
);

-- cat_dress_up_role_play @ 34-36m → ember_cat_dress_up_role_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '81144834-ef9e-4d24-ab6f-fb8bf74bad50'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '81144834-ef9e-4d24-ab6f-fb8bf74bad50'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_dress_up_role_play_category.png'
);

-- cat_family_mealtime_setup @ 25-27m → ember_cat_family_mealtime_setup_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c187cfe7-2248-4048-abb1-ae27772acd06'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_mealtime_setup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c187cfe7-2248-4048-abb1-ae27772acd06'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_mealtime_setup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c187cfe7-2248-4048-abb1-ae27772acd06'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_mealtime_setup_category.png'
);

-- cat_first_rule_games @ 34-36m → ember_cat_first_rule_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '93b0e59e-849b-411e-856d-49668de11669'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_rule_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '93b0e59e-849b-411e-856d-49668de11669'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_rule_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '93b0e59e-849b-411e-856d-49668de11669'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_rule_games_category.png'
);

-- cat_follow_the_leader_games @ 25-27m → ember_cat_follow_the_leader_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4486abef-917f-45b0-bfca-1b3ec7531c97'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4486abef-917f-45b0-bfca-1b3ec7531c97'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4486abef-917f-45b0-bfca-1b3ec7531c97'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png'
);

-- cat_follow_the_leader_games @ 28-30m → ember_cat_follow_the_leader_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4486abef-917f-45b0-bfca-1b3ec7531c97'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4486abef-917f-45b0-bfca-1b3ec7531c97'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4486abef-917f-45b0-bfca-1b3ec7531c97'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png'
);

-- cat_follow_the_leader_games @ 34-36m → ember_cat_follow_the_leader_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4486abef-917f-45b0-bfca-1b3ec7531c97'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4486abef-917f-45b0-bfca-1b3ec7531c97'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4486abef-917f-45b0-bfca-1b3ec7531c97'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_follow_the_leader_games_category.png'
);

-- cat_handwashing_routine @ 19-21m → ember_cat_handwashing_routine_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f1ab873e-ab37-4340-b963-fd53ca0dc269'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png'
);

-- cat_handwashing_routine @ 22-24m → ember_cat_handwashing_routine_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f1ab873e-ab37-4340-b963-fd53ca0dc269'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png'
);

-- cat_handwashing_routine @ 25-27m → ember_cat_handwashing_routine_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f1ab873e-ab37-4340-b963-fd53ca0dc269'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png'
);

-- cat_handwashing_routine @ 28-30m → ember_cat_handwashing_routine_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f1ab873e-ab37-4340-b963-fd53ca0dc269'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f1ab873e-ab37-4340-b963-fd53ca0dc269'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handwashing_routine_category.png'
);

-- cat_hot_drink_bath_safety @ 28-30m → ember_cat_hot_drink_bath_safety_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fe46ddc4-ac24-48cc-9097-b511ee85c67a'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hot_drink_bath_safety_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fe46ddc4-ac24-48cc-9097-b511ee85c67a'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hot_drink_bath_safety_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fe46ddc4-ac24-48cc-9097-b511ee85c67a'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hot_drink_bath_safety_category.png'
);

-- cat_hot_drink_burns_check @ 34-36m → ember_cat_hot_drink_bath_safety_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5d99ab7f-5363-4e29-8fa2-33825c25ec99'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hot_drink_bath_safety_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5d99ab7f-5363-4e29-8fa2-33825c25ec99'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hot_drink_bath_safety_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5d99ab7f-5363-4e29-8fa2-33825c25ec99'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hot_drink_bath_safety_category.png'
);

-- cat_knob_button_toys @ 25-27m → ember_cat_knob_button_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '61fbaa81-ede0-4b71-ba0a-fcd9d12e2195'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_knob_button_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '61fbaa81-ede0-4b71-ba0a-fcd9d12e2195'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_knob_button_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '61fbaa81-ede0-4b71-ba0a-fcd9d12e2195'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_knob_button_toys_category.png'
);

-- cat_knob_button_toys @ 28-30m → ember_cat_knob_button_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '61fbaa81-ede0-4b71-ba0a-fcd9d12e2195'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_knob_button_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '61fbaa81-ede0-4b71-ba0a-fcd9d12e2195'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_knob_button_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '61fbaa81-ede0-4b71-ba0a-fcd9d12e2195'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_knob_button_toys_category.png'
);

-- cat_left_right_shoe_helpers @ 34-36m → ember_cat_left_right_shoe_helpers_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4959d134-1033-475e-b548-32bfef8eabec'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_left_right_shoe_helpers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4959d134-1033-475e-b548-32bfef8eabec'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_left_right_shoe_helpers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4959d134-1033-475e-b548-32bfef8eabec'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_left_right_shoe_helpers_category.png'
);

-- cat_low_table_chair @ 19-21m → ember_cat_low_table_chair_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '62ce6e7d-eae8-451e-8f9f-22bdee80c437'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_table_chair_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '62ce6e7d-eae8-451e-8f9f-22bdee80c437'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_table_chair_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '62ce6e7d-eae8-451e-8f9f-22bdee80c437'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_table_chair_category.png'
);

-- cat_magnetic_tiles @ 28-30m → ember_cat_magnetic_tiles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e6090ea7-f8ac-4167-9964-1a301875b19a'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_magnetic_tiles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e6090ea7-f8ac-4167-9964-1a301875b19a'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_magnetic_tiles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e6090ea7-f8ac-4167-9964-1a301875b19a'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_magnetic_tiles_category.png'
);

-- cat_matching_animals_figures @ 19-21m → ember_cat_matching_animals_figures_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7ef8bbd8-1362-4c72-a888-0f29d214c42a'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_matching_animals_figures_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7ef8bbd8-1362-4c72-a888-0f29d214c42a'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_matching_animals_figures_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7ef8bbd8-1362-4c72-a888-0f29d214c42a'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_matching_animals_figures_category.png'
);

-- cat_mealtime_routine_setup @ 19-21m → ember_cat_mealtime_routine_setup_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '991aeaca-881f-42b8-a203-bb596ef97390'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mealtime_routine_setup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '991aeaca-881f-42b8-a203-bb596ef97390'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mealtime_routine_setup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '991aeaca-881f-42b8-a203-bb596ef97390'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_mealtime_routine_setup_category.png'
);

-- cat_modular_playhouse @ 34-36m → ember_cat_modular_playhouse_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f012d417-7692-4aa1-8009-eec0ea1b5b9d'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_modular_playhouse_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f012d417-7692-4aa1-8009-eec0ea1b5b9d'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_modular_playhouse_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f012d417-7692-4aa1-8009-eec0ea1b5b9d'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_modular_playhouse_category.png'
);

-- cat_climbing_frame_play @ 25-27m → ember_cat_park_climbing_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dfd8eb98-8f98-47b5-9e88-d6bad782693c'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dfd8eb98-8f98-47b5-9e88-d6bad782693c'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dfd8eb98-8f98-47b5-9e88-d6bad782693c'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png'
);

-- cat_climbing_frame_play @ 28-30m → ember_cat_park_climbing_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dfd8eb98-8f98-47b5-9e88-d6bad782693c'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dfd8eb98-8f98-47b5-9e88-d6bad782693c'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dfd8eb98-8f98-47b5-9e88-d6bad782693c'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png'
);

-- cat_park_climbing_play @ 22-24m → ember_cat_park_climbing_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ba0fa377-b6c0-4443-9f63-b68cc1ac8182'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ba0fa377-b6c0-4443-9f63-b68cc1ac8182'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ba0fa377-b6c0-4443-9f63-b68cc1ac8182'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png'
);

-- cat_park_climbing_play @ 34-36m → ember_cat_park_climbing_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ba0fa377-b6c0-4443-9f63-b68cc1ac8182'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ba0fa377-b6c0-4443-9f63-b68cc1ac8182'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ba0fa377-b6c0-4443-9f63-b68cc1ac8182'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png'
);

-- cat_obstacle_course_home @ 28-30m → ember_cat_park_climbing_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '60fb247d-e2cc-480f-8013-b5d15d9f8e98'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '60fb247d-e2cc-480f-8013-b5d15d9f8e98'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '60fb247d-e2cc-480f-8013-b5d15d9f8e98'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_climbing_play_category.png'
);

-- cat_play_tent_den @ 25-27m → ember_cat_play_tent_den_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '83992d89-bc2d-4aee-9081-25409b8ca8ee'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tent_den_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '83992d89-bc2d-4aee-9081-25409b8ca8ee'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tent_den_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '83992d89-bc2d-4aee-9081-25409b8ca8ee'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tent_den_category.png'
);

-- cat_play_tent_den @ 28-30m → ember_cat_play_tent_den_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '83992d89-bc2d-4aee-9081-25409b8ca8ee'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tent_den_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '83992d89-bc2d-4aee-9081-25409b8ca8ee'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tent_den_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '83992d89-bc2d-4aee-9081-25409b8ca8ee'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_tent_den_category.png'
);

-- cat_playdate_library_groups @ 25-27m → ember_cat_playdate_library_groups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4cee7378-a21b-4fe7-ae86-5f4a9efff852'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_library_groups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4cee7378-a21b-4fe7-ae86-5f4a9efff852'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_library_groups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4cee7378-a21b-4fe7-ae86-5f4a9efff852'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_library_groups_category.png'
);

-- cat_playdate_library_groups @ 28-30m → ember_cat_playdate_library_groups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4cee7378-a21b-4fe7-ae86-5f4a9efff852'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_library_groups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4cee7378-a21b-4fe7-ae86-5f4a9efff852'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_library_groups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4cee7378-a21b-4fe7-ae86-5f4a9efff852'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_library_groups_category.png'
);

-- cat_playdate_role_play @ 34-36m → ember_cat_playdate_role_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '550dfa25-6e48-4e77-805b-062b17081a65'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_role_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '550dfa25-6e48-4e77-805b-062b17081a65'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_role_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '550dfa25-6e48-4e77-805b-062b17081a65'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdate_role_play_category.png'
);

-- cat_push_along_vehicles @ 19-21m → ember_cat_push_along_vehicles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '9bfab7c9-4702-458d-98a2-0f780dd5b64c'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_along_vehicles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '9bfab7c9-4702-458d-98a2-0f780dd5b64c'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_along_vehicles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9bfab7c9-4702-458d-98a2-0f780dd5b64c'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_along_vehicles_category.png'
);

-- cat_simple_musical_basket @ 25-27m → ember_cat_simple_musical_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '136a1ff3-c0c2-4dcb-8f9b-00131943658a'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_musical_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '136a1ff3-c0c2-4dcb-8f9b-00131943658a'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_musical_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '136a1ff3-c0c2-4dcb-8f9b-00131943658a'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_musical_basket_category.png'
);

-- cat_simple_sharing_games @ 34-36m → ember_cat_simple_sharing_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8a1a5c15-9797-4cc7-ad6b-f23c7e9183fc'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_sharing_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8a1a5c15-9797-4cc7-ad6b-f23c7e9183fc'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_sharing_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8a1a5c15-9797-4cc7-ad6b-f23c7e9183fc'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_sharing_games_category.png'
);

-- cat_sticker_chart @ 25-27m → ember_cat_sticker_chart_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bf4d0ca4-83f8-462e-b165-da134838484b'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sticker_chart_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bf4d0ca4-83f8-462e-b165-da134838484b'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sticker_chart_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bf4d0ca4-83f8-462e-b165-da134838484b'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sticker_chart_category.png'
);

-- cat_sticker_chart @ 28-30m → ember_cat_sticker_chart_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bf4d0ca4-83f8-462e-b165-da134838484b'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sticker_chart_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bf4d0ca4-83f8-462e-b165-da134838484b'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sticker_chart_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bf4d0ca4-83f8-462e-b165-da134838484b'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sticker_chart_category.png'
);

-- cat_story_replay_props @ 28-30m → ember_cat_story_replay_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ff3833b3-61d5-4f65-9237-89faf753d069'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_replay_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ff3833b3-61d5-4f65-9237-89faf753d069'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_replay_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ff3833b3-61d5-4f65-9237-89faf753d069'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_replay_props_category.png'
);

-- cat_family_photo_story_cards @ 34-36m → ember_cat_story_sequence_cards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png'
);

-- cat_story_sequence_cards @ 34-36m → ember_cat_story_sequence_cards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0e278c9d-d5de-4f67-934a-e87cbf09082e'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0e278c9d-d5de-4f67-934a-e87cbf09082e'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0e278c9d-d5de-4f67-934a-e87cbf09082e'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png'
);

-- cat_story_starter_figures @ 34-36m → ember_cat_story_starter_figures_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '73557e29-17af-45b6-abaf-696a876cd93e'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_starter_figures_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '73557e29-17af-45b6-abaf-696a876cd93e'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_starter_figures_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '73557e29-17af-45b6-abaf-696a876cd93e'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_starter_figures_category.png'
);

-- cat_tongs_scoops @ 22-24m → ember_cat_tongs_scoops_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '21241187-d1bb-4fb5-96ec-44e069e7b5ec'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tongs_scoops_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '21241187-d1bb-4fb5-96ec-44e069e7b5ec'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tongs_scoops_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '21241187-d1bb-4fb5-96ec-44e069e7b5ec'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tongs_scoops_category.png'
);

-- cat_training_pants @ 22-24m → ember_cat_training_pants_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '678715b6-a78a-45a5-80b7-20df9c388689'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '678715b6-a78a-45a5-80b7-20df9c388689'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '678715b6-a78a-45a5-80b7-20df9c388689'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png'
);

-- cat_training_pants @ 25-27m → ember_cat_training_pants_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '678715b6-a78a-45a5-80b7-20df9c388689'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '678715b6-a78a-45a5-80b7-20df9c388689'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '678715b6-a78a-45a5-80b7-20df9c388689'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png'
);

-- cat_training_pants @ 28-30m → ember_cat_training_pants_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '678715b6-a78a-45a5-80b7-20df9c388689'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '678715b6-a78a-45a5-80b7-20df9c388689'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '678715b6-a78a-45a5-80b7-20df9c388689'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_training_pants_category.png'
);

-- cat_weighing_balancing_play @ 28-30m → ember_cat_weighing_balancing_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '70741768-1afe-4ce7-adad-504f76d9487f'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_weighing_balancing_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '70741768-1afe-4ce7-adad-504f76d9487f'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_weighing_balancing_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '70741768-1afe-4ce7-adad-504f76d9487f'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_weighing_balancing_play_category.png'
);

-- cat_why_what_chats @ 34-36m → ember_cat_why_what_chats_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '43b5dea5-5156-4ded-8870-2bc9afb55b0d'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_why_what_chats_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '43b5dea5-5156-4ded-8870-2bc9afb55b0d'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_why_what_chats_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '43b5dea5-5156-4ded-8870-2bc9afb55b0d'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_why_what_chats_category.png'
);

COMMIT;
