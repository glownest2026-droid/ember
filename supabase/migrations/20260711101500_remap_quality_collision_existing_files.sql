-- Remap quality-collision slugs to existing affinity-OK Storage files.

BEGIN;

-- cat_first_spoons_bowls @ 19-21m → ember_cat_spoon_practice_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'::uuid, '19-21m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png');

-- cat_songs_action_games @ 19-21m → ember_cat_songs_with_actions_and_silly_sounds_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c29c77b5-ce58-44a1-b8e6-638b150d7132'::uuid, '19-21m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png');

-- cat_feelings_faces_books @ 22-24m → ember_cat_feeling_faces_and_story_books_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png');

-- cat_roll_ball_turns @ 22-24m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c9a05937-5116-4a54-87e2-b1d34922e826'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png');

-- cat_teddy_care_play @ 22-24m → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '16973065-e03d-4999-ac6a-47221e9a6d7c'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png');

-- cat_felt_colour_sorting_play @ 25-27m → ember_cat_first_matching_games_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '8797c035-a159-412d-8cc5-9f7429814773'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '8797c035-a159-412d-8cc5-9f7429814773'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8797c035-a159-412d-8cc5-9f7429814773'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png');

-- cat_first_turn_taking_games @ 25-27m → ember_cat_practise_one_short_turn_each_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png');

-- cat_picture_story_books @ 25-27m → ember_cat_picture_books_with_little_stories_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_books_with_little_stories_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '726c04fa-9186-43be-a569-8e21d91843ff'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_books_with_little_stories_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_books_with_little_stories_category.png');

-- cat_handwashing_step_stool @ 28-30m → ember_child_step_stool_dual_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '6e437975-2b72-43b9-85c8-3371036b388a'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '6e437975-2b72-43b9-85c8-3371036b388a'::uuid, '28-30m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6e437975-2b72-43b9-85c8-3371036b388a'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png');

-- cat_songs_action_games @ 28-30m → ember_cat_songs_with_actions_and_silly_sounds_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c29c77b5-ce58-44a1-b8e6-638b150d7132'::uuid, '28-30m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png');

-- cat_family_photo_story_cards @ 34-36m → ember_cat_story_sequence_cards_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'::uuid, '34-36m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_story_sequence_cards_category.png');

-- cat_feelings_faces_books @ 34-36m → ember_cat_feeling_faces_and_story_books_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '34-36m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png');

-- cat_books_with_pauses @ 4-6m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '0ce343fd-d011-4ab5-bc54-516a034919cc'::uuid, '4-6m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_drop_roll_toys @ 6-9m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '397f87f0-9486-4d42-b6c3-e257953e6b23'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '397f87f0-9486-4d42-b6c3-e257953e6b23'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '397f87f0-9486-4d42-b6c3-e257953e6b23'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png');

-- cat_first_signs_books @ 6-9m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '89cb2651-6256-4082-ae16-497827b77c95'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '89cb2651-6256-4082-ae16-497827b77c95'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '89cb2651-6256-4082-ae16-497827b77c95'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_roll_build_cones @ 6-9m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '091da35e-5012-4b74-a890-0412031b21a4'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '091da35e-5012-4b74-a890-0412031b21a4'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '091da35e-5012-4b74-a890-0412031b21a4'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png');

-- cat_rolling_ball_set @ 6-9m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '0a912f51-f157-4ee1-8f76-40b5d01daa81'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '0a912f51-f157-4ee1-8f76-40b5d01daa81'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0a912f51-f157-4ee1-8f76-40b5d01daa81'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png');

-- cat_baby_photo_book @ 9-12m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '8061e042-a93f-499d-b31c-e1176d3838e9'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '8061e042-a93f-499d-b31c-e1176d3838e9'::uuid, '9-12m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8061e042-a93f-499d-b31c-e1176d3838e9'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_handheld_mini_books @ 9-12m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'::uuid, '9-12m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

COMMIT;
