-- Map quality-replacement Stage 2 category images (founder Make upload batch).
-- Source: ABI_Image_Creation_Template_quality_replacements_expected_filenames.csv

BEGIN;

-- cat_open_cup @ 19-21m → ember_cat_open_cup_19-21m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_19-21m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_19-21m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_19-21m_category.png'
);

-- cat_action_song_books @ 22-24m → ember_cat_action_song_books_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_song_books_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '05e09db2-af51-4370-923f-9fb080fedc64'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_song_books_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_action_song_books_22-24m_category.png'
);

-- cat_balance_bike_scooter @ 22-24m → ember_cat_balance_bike_scooter_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_bike_scooter_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '60442018-8a37-451e-a7bd-70c77fd58ddb'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_bike_scooter_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_bike_scooter_22-24m_category.png'
);

-- cat_button_battery_check @ 22-24m → ember_cat_button_battery_check_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_category.png'
);

-- cat_choking_hazard_sweep @ 22-24m → ember_cat_choking_hazard_sweep_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8ba13890-6b9e-49b9-b484-c0e6f2416936'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_hazard_sweep_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8ba13890-6b9e-49b9-b484-c0e6f2416936'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_hazard_sweep_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8ba13890-6b9e-49b9-b484-c0e6f2416936'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_hazard_sweep_22-24m_category.png'
);

-- cat_doctor_visit_books @ 22-24m → ember_cat_doctor_visit_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doctor_visit_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a539954a-15c0-49cb-a8d8-cb2b30892bd2'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doctor_visit_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doctor_visit_books_category.png'
);

-- cat_peer_play_books @ 22-24m → ember_cat_peer_play_books_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '119a70d0-06f5-49b3-9d6a-1b8e96be5800'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peer_play_books_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '119a70d0-06f5-49b3-9d6a-1b8e96be5800'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peer_play_books_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '119a70d0-06f5-49b3-9d6a-1b8e96be5800'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peer_play_books_22-24m_category.png'
);

-- cat_potty_story_books @ 22-24m → ember_cat_potty_story_books_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_story_books_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '84ea8b89-7614-452f-953e-eb1551663b19'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_story_books_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_story_books_22-24m_category.png'
);

-- cat_roll_ball_turns @ 22-24m → ember_cat_roll_ball_turns_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_ball_turns_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c9a05937-5116-4a54-87e2-b1d34922e826'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_ball_turns_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_ball_turns_22-24m_category.png'
);

-- cat_safe_sleep_continuity @ 22-24m → ember_cat_safe_sleep_continuity_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd07913e8-1fb1-4dbc-8fe5-619345691dd6'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_22-24m_category.png'
);

-- cat_teddy_care_play @ 22-24m → ember_cat_teddy_care_play_22-24m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_play_22-24m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '16973065-e03d-4999-ac6a-47221e9a6d7c'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_play_22-24m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teddy_care_play_22-24m_category.png'
);

-- cat_felt_colour_sorting_play @ 25-27m → ember_cat_felt_colour_sorting_play_25-27m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8797c035-a159-412d-8cc5-9f7429814773'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_felt_colour_sorting_play_25-27m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8797c035-a159-412d-8cc5-9f7429814773'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_felt_colour_sorting_play_25-27m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8797c035-a159-412d-8cc5-9f7429814773'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_felt_colour_sorting_play_25-27m_category.png'
);

-- cat_potty_training_books @ 25-27m → ember_cat_potty_training_books_25-27m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c844a03f-f26c-4c67-aa5b-720b7c922714'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_training_books_25-27m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c844a03f-f26c-4c67-aa5b-720b7c922714'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_training_books_25-27m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c844a03f-f26c-4c67-aa5b-720b7c922714'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_training_books_25-27m_category.png'
);

-- cat_song_rhyme_books @ 25-27m → ember_cat_song_rhyme_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_song_rhyme_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3057fe47-9719-4aad-bffe-49634231d745'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_song_rhyme_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_song_rhyme_books_category.png'
);

-- cat_obstacle_course_home @ 28-30m → ember_cat_obstacle_course_home_28-30m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '60fb247d-e2cc-480f-8013-b5d15d9f8e98'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_obstacle_course_home_28-30m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '60fb247d-e2cc-480f-8013-b5d15d9f8e98'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_obstacle_course_home_28-30m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '60fb247d-e2cc-480f-8013-b5d15d9f8e98'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_obstacle_course_home_28-30m_category.png'
);

-- cat_picture_story_books @ 28-30m → ember_cat_picture_story_books_28-30m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_story_books_28-30m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '726c04fa-9186-43be-a569-8e21d91843ff'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_story_books_28-30m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_story_books_28-30m_category.png'
);

-- cat_toilet_training_seat @ 28-30m → ember_cat_toilet_training_seat_28-30m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8c9a624d-c1db-4651-9691-144d48dea6d3'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toilet_training_seat_28-30m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8c9a624d-c1db-4651-9691-144d48dea6d3'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toilet_training_seat_28-30m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8c9a624d-c1db-4651-9691-144d48dea6d3'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toilet_training_seat_28-30m_category.png'
);

-- cat_family_photo_story_cards @ 34-36m → ember_cat_family_photo_story_cards_34-36m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_photo_story_cards_34-36m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_photo_story_cards_34-36m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e2ff6621-795d-45d7-bc22-5f5daa29a8ff'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_photo_story_cards_34-36m_category.png'
);

-- cat_potty_story_books @ 34-36m → ember_cat_potty_story_books_34-36m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_story_books_34-36m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '84ea8b89-7614-452f-953e-eb1551663b19'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_story_books_34-36m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_potty_story_books_34-36m_category.png'
);

-- cat_crinkle_floor_book @ 4-6m → ember_cat_crinkle_floor_book_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_crinkle_floor_book_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_crinkle_floor_book_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_crinkle_floor_book_category.png'
);

-- cat_drop_roll_toys @ 6-9m → ember_cat_drop_roll_toys_6-9m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '397f87f0-9486-4d42-b6c3-e257953e6b23'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_drop_roll_toys_6-9m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '397f87f0-9486-4d42-b6c3-e257953e6b23'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_drop_roll_toys_6-9m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '397f87f0-9486-4d42-b6c3-e257953e6b23'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_drop_roll_toys_6-9m_category.png'
);

-- cat_first_signs_books @ 6-9m → ember_cat_first_signs_books_6-9m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '89cb2651-6256-4082-ae16-497827b77c95'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_signs_books_6-9m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '89cb2651-6256-4082-ae16-497827b77c95'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_signs_books_6-9m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '89cb2651-6256-4082-ae16-497827b77c95'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_signs_books_6-9m_category.png'
);

-- cat_roll_build_cones @ 6-9m → ember_cat_roll_build_cones_6-9m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '091da35e-5012-4b74-a890-0412031b21a4'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_build_cones_6-9m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '091da35e-5012-4b74-a890-0412031b21a4'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_build_cones_6-9m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '091da35e-5012-4b74-a890-0412031b21a4'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_roll_build_cones_6-9m_category.png'
);

-- cat_rolling_ball_set @ 6-9m → ember_cat_rolling_ball_set_6-9m_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0a912f51-f157-4ee1-8f76-40b5d01daa81'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rolling_ball_set_6-9m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0a912f51-f157-4ee1-8f76-40b5d01daa81'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rolling_ball_set_6-9m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0a912f51-f157-4ee1-8f76-40b5d01daa81'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rolling_ball_set_6-9m_category.png'
);

COMMIT;
