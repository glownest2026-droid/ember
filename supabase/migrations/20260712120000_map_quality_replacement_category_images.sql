-- Map quality-replacement Stage 2 category images (founder Make upload batch).
-- Source: ABI_Image_Creation_Template_quality_replacements_expected_filenames.csv

BEGIN;

-- cat_crinkle_floor_book @ 1-3m → ember_cat_crinkle_floor_book_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_crinkle_floor_book_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_crinkle_floor_book_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_crinkle_floor_book_category.png'
);

-- cat_action_song_books @ 13-15m → ember_cat_action_song_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_song_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '05e09db2-af51-4370-923f-9fb080fedc64'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_song_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_song_books_category.png'
);

-- cat_action_songs_pauses @ 13-15m → ember_cat_action_songs_pauses_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '69daba17-3cac-4a0d-8bee-ef456b4954a9'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_songs_pauses_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '69daba17-3cac-4a0d-8bee-ef456b4954a9'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_songs_pauses_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '69daba17-3cac-4a0d-8bee-ef456b4954a9'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_songs_pauses_category.png'
);

-- cat_animal_books @ 13-15m → ember_cat_animal_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ec7afc3c-4bde-4c84-949b-e10391132dcb'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_animal_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ec7afc3c-4bde-4c84-949b-e10391132dcb'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_animal_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ec7afc3c-4bde-4c84-949b-e10391132dcb'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_animal_books_category.png'
);

-- cat_ball_drop_rolling_toys @ 13-15m → ember_cat_ball_drop_rolling_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '387ae64c-41a2-4e2a-974f-d5873a515c49'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ball_drop_rolling_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '387ae64c-41a2-4e2a-974f-d5873a515c49'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ball_drop_rolling_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '387ae64c-41a2-4e2a-974f-d5873a515c49'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ball_drop_rolling_toys_category.png'
);

-- cat_copy_me_games @ 13-15m → ember_cat_copy_me_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '64364568-020b-4dd4-8e95-45f41d91682f'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_copy_me_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '64364568-020b-4dd4-8e95-45f41d91682f'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_copy_me_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '64364568-020b-4dd4-8e95-45f41d91682f'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_copy_me_games_category.png'
);

-- cat_first_word_flap_books @ 13-15m → ember_cat_first_word_flap_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5727f5a1-3466-4b0d-aa3a-763396baf91b'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_flap_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5727f5a1-3466-4b0d-aa3a-763396baf91b'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_flap_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5727f5a1-3466-4b0d-aa3a-763396baf91b'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_flap_books_category.png'
);

-- cat_hide_find_cups @ 13-15m → ember_cat_hide_find_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_find_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_find_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a790ff2f-272a-4e07-9a93-0a29f0bdda3a'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_find_cups_category.png'
);

-- cat_real_object_baskets @ 13-15m → ember_cat_real_object_baskets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_real_object_baskets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_real_object_baskets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b4d4c687-77c2-42db-9abf-0d1f39e35bd3'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_real_object_baskets_category.png'
);

-- cat_roll_chase_games @ 13-15m → ember_cat_roll_chase_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '90be286b-e051-44c7-aa9e-5abb6767281b'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_chase_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '90be286b-e051-44c7-aa9e-5abb6767281b'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_chase_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '90be286b-e051-44c7-aa9e-5abb6767281b'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_chase_games_category.png'
);

-- cat_three_object_tray @ 13-15m → ember_cat_three_object_tray_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4cf2bd8e-4b6e-4930-a146-5b596802293e'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_three_object_tray_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4cf2bd8e-4b6e-4930-a146-5b596802293e'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_three_object_tray_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4cf2bd8e-4b6e-4930-a146-5b596802293e'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_three_object_tray_category.png'
);

-- cat_toddler_cutlery @ 13-15m → ember_cat_toddler_cutlery_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5c7a0c09-085e-411d-8fc4-375af03dd188'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_cutlery_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5c7a0c09-085e-411d-8fc4-375af03dd188'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_cutlery_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5c7a0c09-085e-411d-8fc4-375af03dd188'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_cutlery_category.png'
);

-- cat_open_cup @ 16-18m → ember_cat_open_cup_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_category.png'
);

-- cat_button_battery_check @ 19-21m → ember_cat_button_battery_check_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_category.png'
);

-- cat_doctor_visit_books @ 19-21m → ember_cat_doctor_visit_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doctor_visit_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a539954a-15c0-49cb-a8d8-cb2b30892bd2'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doctor_visit_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doctor_visit_books_category.png'
);

-- cat_potty_books @ 19-21m → ember_cat_potty_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4449ed2f-8009-4d02-8c23-7b47c6a508b9'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4449ed2f-8009-4d02-8c23-7b47c6a508b9'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4449ed2f-8009-4d02-8c23-7b47c6a508b9'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_books_category.png'
);

-- cat_song_rhyme_books @ 19-21m → ember_cat_song_rhyme_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_song_rhyme_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3057fe47-9719-4aad-bffe-49634231d745'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_song_rhyme_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_song_rhyme_books_category.png'
);

-- cat_feelings_faces_books @ 25-27m → ember_cat_feelings_faces_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feelings_faces_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '314cee75-1e7b-4489-a789-c178109feb41'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feelings_faces_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feelings_faces_books_category.png'
);

COMMIT;
