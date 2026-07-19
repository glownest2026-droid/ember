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

-- cat_first_turn_taking_games @ 25-27m → ember_cat_big_soft_ball_for_turn_taking_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_soft_ball_for_turn_taking_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_soft_ball_for_turn_taking_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_soft_ball_for_turn_taking_category.png');

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

-- cat_handwashing_step_stool @ 28-30m → ember_cat_safe_step_up_stool_or_learning_tower_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '6e437975-2b72-43b9-85c8-3371036b388a'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_step_up_stool_or_learning_tower_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '6e437975-2b72-43b9-85c8-3371036b388a'::uuid, '28-30m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_step_up_stool_or_learning_tower_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6e437975-2b72-43b9-85c8-3371036b388a'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_step_up_stool_or_learning_tower_category.png');

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

-- cat_books_with_pauses @ 4-6m → ember_cat_board_books_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '0ce343fd-d011-4ab5-bc54-516a034919cc'::uuid, '4-6m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_1_3m_category.png');

-- cat_baby_photo_book @ 9-12m → ember_cat_baby_photo_book_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '8061e042-a93f-499d-b31c-e1176d3838e9'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_baby_photo_book_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '8061e042-a93f-499d-b31c-e1176d3838e9'::uuid, '9-12m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_baby_photo_book_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8061e042-a93f-499d-b31c-e1176d3838e9'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_baby_photo_book_category.png');

-- cat_handheld_mini_books @ 9-12m → ember_cat_handheld_mini_books_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handheld_mini_books_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'::uuid, '9-12m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handheld_mini_books_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_handheld_mini_books_category.png');

COMMIT;
