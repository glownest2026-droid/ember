-- Map Stage 2 category images from borrowable catalogue (manual_recycle / family / crosswalk).
-- Source: stage2_borrowable_audit_distinct.csv

BEGIN;

-- cat_action_song_books @ 22-24m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '05e09db2-af51-4370-923f-9fb080fedc64'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '05e09db2-af51-4370-923f-9fb080fedc64'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_animal_picture_cards @ 19-21m → ember_cat_simple_picture_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c8c62444-9eda-4fe0-8241-776562c2b1d8'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_picture_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c8c62444-9eda-4fe0-8241-776562c2b1d8'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_picture_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c8c62444-9eda-4fe0-8241-776562c2b1d8'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_picture_cards_category.png'
);

-- cat_baby_photo_book @ 9-12m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8061e042-a93f-499d-b31c-e1176d3838e9'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8061e042-a93f-499d-b31c-e1176d3838e9'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8061e042-a93f-499d-b31c-e1176d3838e9'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_balance_bike_scooter @ 22-24m → ember_cat_trikes_and_beginner_scooters_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '60442018-8a37-451e-a7bd-70c77fd58ddb'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png'
);

-- cat_balance_bike_scooter @ 25-27m → ember_cat_trikes_and_beginner_scooters_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '60442018-8a37-451e-a7bd-70c77fd58ddb'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png'
);

-- cat_balance_bike_scooter @ 28-30m → ember_cat_trikes_and_beginner_scooters_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '60442018-8a37-451e-a7bd-70c77fd58ddb'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '60442018-8a37-451e-a7bd-70c77fd58ddb'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png'
);

-- cat_balance_stepping_stones @ 22-24m → ember_cat_balance_paths_and_stepping_stones_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '92544608-743e-4099-bb5e-0c384e002d92'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '92544608-743e-4099-bb5e-0c384e002d92'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '92544608-743e-4099-bb5e-0c384e002d92'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png'
);

-- cat_balance_stepping_stones @ 34-36m → ember_cat_balance_paths_and_stepping_stones_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '92544608-743e-4099-bb5e-0c384e002d92'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '92544608-743e-4099-bb5e-0c384e002d92'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '92544608-743e-4099-bb5e-0c384e002d92'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png'
);

-- cat_blind_cord_check @ 28-30m → ember_cat_blind_cord_cleats_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6f92abee-ff2e-40ff-979e-3b284244eb70'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6f92abee-ff2e-40ff-979e-3b284244eb70'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6f92abee-ff2e-40ff-979e-3b284244eb70'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png'
);

-- cat_blind_cord_window_check @ 34-36m → ember_cat_blind_cords_trailing_wires_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd0a4f33-7a4e-4c8d-a9ae-b8fdb85002b4'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cords_trailing_wires_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd0a4f33-7a4e-4c8d-a9ae-b8fdb85002b4'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cords_trailing_wires_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd0a4f33-7a4e-4c8d-a9ae-b8fdb85002b4'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cords_trailing_wires_category.png'
);

-- cat_books_with_pauses @ 22-24m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0ce343fd-d011-4ab5-bc54-516a034919cc'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_books_with_pauses @ 4-6m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0ce343fd-d011-4ab5-bc54-516a034919cc'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0ce343fd-d011-4ab5-bc54-516a034919cc'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_calm_corner_tools @ 22-24m → ember_calm_down_sensory_bottle.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd873762e-1158-4ef3-8620-73a8842ea29e'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png'
);

-- cat_calm_corner_tools @ 25-27m → ember_calm_down_sensory_bottle.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd873762e-1158-4ef3-8620-73a8842ea29e'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png'
);

-- cat_calm_corner_tools @ 28-30m → ember_calm_down_sensory_bottle.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd873762e-1158-4ef3-8620-73a8842ea29e'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png'
);

-- cat_calm_corner_tools @ 34-36m → ember_calm_down_sensory_bottle.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd873762e-1158-4ef3-8620-73a8842ea29e'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd873762e-1158-4ef3-8620-73a8842ea29e'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_calm_down_sensory_bottle.png'
);

-- cat_car_seat_fit_check @ 34-36m → ember_cat_car_seat_size_check_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4aa45389-d5f3-4e64-9d01-2ae8dff6ae44'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_car_seat_size_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4aa45389-d5f3-4e64-9d01-2ae8dff6ae44'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_car_seat_size_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4aa45389-d5f3-4e64-9d01-2ae8dff6ae44'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_car_seat_size_check_category.png'
);

-- cat_child_cleaning_helper_set @ 22-24m → ember_cat_first_cleaning_play_sets_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png'
);

-- cat_child_cleaning_helper_set @ 25-27m → ember_cat_first_cleaning_play_sets_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png'
);

-- cat_child_cleaning_helper_set @ 28-30m → ember_cat_first_cleaning_play_sets_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dfcc6be5-73a4-42f8-a6a8-f3fba96e6b63'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png'
);

-- cat_child_safe_scissors @ 34-36m → ember_child_safe_scissors_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '95393801-f892-4635-8a7d-cf860ad614b0'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_safe_scissors_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '95393801-f892-4635-8a7d-cf860ad614b0'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_safe_scissors_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '95393801-f892-4635-8a7d-cf860ad614b0'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_safe_scissors_category.png'
);

-- cat_choking_hazard_sweep @ 22-24m → ember_cat_small_object_sweep_1_3m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8ba13890-6b9e-49b9-b484-c0e6f2416936'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8ba13890-6b9e-49b9-b484-c0e6f2416936'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8ba13890-6b9e-49b9-b484-c0e6f2416936'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png'
);

-- cat_choking_hazard_sweep @ 25-27m → ember_cat_small_object_sweep_1_3m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8ba13890-6b9e-49b9-b484-c0e6f2416936'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8ba13890-6b9e-49b9-b484-c0e6f2416936'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8ba13890-6b9e-49b9-b484-c0e6f2416936'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png'
);

-- cat_colour_matching_games @ 34-36m → ember_cat_first_matching_games_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5003622f-6835-440e-b355-7c5b481f04df'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5003622f-6835-440e-b355-7c5b481f04df'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5003622f-6835-440e-b355-7c5b481f04df'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png'
);

-- cat_colour_sorting_matching @ 22-24m → ember_cat_first_matching_games_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3f332fa3-884b-46d0-adda-fef3f1e26495'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3f332fa3-884b-46d0-adda-fef3f1e26495'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3f332fa3-884b-46d0-adda-fef3f1e26495'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png'
);

-- cat_colour_sorting_matching @ 25-27m → ember_cat_first_matching_games_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3f332fa3-884b-46d0-adda-fef3f1e26495'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3f332fa3-884b-46d0-adda-fef3f1e26495'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3f332fa3-884b-46d0-adda-fef3f1e26495'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png'
);

-- cat_colour_sorting_matching @ 28-30m → ember_cat_first_matching_games_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3f332fa3-884b-46d0-adda-fef3f1e26495'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3f332fa3-884b-46d0-adda-fef3f1e26495'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3f332fa3-884b-46d0-adda-fef3f1e26495'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png'
);

-- cat_conversation_games @ 25-27m → ember_cat_conversation_picture_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '998bd025-79a2-46a7-960a-74a440eb84cd'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_conversation_picture_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '998bd025-79a2-46a7-960a-74a440eb84cd'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_conversation_picture_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '998bd025-79a2-46a7-960a-74a440eb84cd'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_conversation_picture_cards_category.png'
);

-- cat_conversation_prompt_cards @ 28-30m → ember_question_prompt_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b27653dc-f5b8-4c36-b532-40227d5d7423'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_question_prompt_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b27653dc-f5b8-4c36-b532-40227d5d7423'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_question_prompt_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b27653dc-f5b8-4c36-b532-40227d5d7423'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_question_prompt_cards_category.png'
);

-- cat_conversation_prompt_cards @ 34-36m → ember_question_prompt_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b27653dc-f5b8-4c36-b532-40227d5d7423'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_question_prompt_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b27653dc-f5b8-4c36-b532-40227d5d7423'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_question_prompt_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b27653dc-f5b8-4c36-b532-40227d5d7423'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_question_prompt_cards_category.png'
);

-- cat_crinkle_floor_book @ 1-3m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_crinkle_floor_book @ 4-6m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4d2faf16-d45b-4486-9095-3ddf0a5fd3c8'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_doctor_visit_books @ 19-21m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a539954a-15c0-49cb-a8d8-cb2b30892bd2'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_doctor_visit_books @ 22-24m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a539954a-15c0-49cb-a8d8-cb2b30892bd2'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a539954a-15c0-49cb-a8d8-cb2b30892bd2'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_dressing_practice @ 25-27m → ember_cat_easy_dressing_practice_pieces_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bd246d86-a168-4738-ae1c-e516e7356862'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bd246d86-a168-4738-ae1c-e516e7356862'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bd246d86-a168-4738-ae1c-e516e7356862'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png'
);

-- cat_dressing_practice @ 28-30m → ember_cat_easy_dressing_practice_pieces_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bd246d86-a168-4738-ae1c-e516e7356862'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bd246d86-a168-4738-ae1c-e516e7356862'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bd246d86-a168-4738-ae1c-e516e7356862'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png'
);

-- cat_dressing_practice_clothes @ 22-24m → ember_cat_easy_dressing_practice_pieces_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1ef60530-924d-47fd-849d-8a10d44e4c7b'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1ef60530-924d-47fd-849d-8a10d44e4c7b'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1ef60530-924d-47fd-849d-8a10d44e4c7b'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png'
);

-- cat_dressing_practice_clothes @ 34-36m → ember_cat_easy_dressing_practice_pieces_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1ef60530-924d-47fd-849d-8a10d44e4c7b'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1ef60530-924d-47fd-849d-8a10d44e4c7b'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1ef60530-924d-47fd-849d-8a10d44e4c7b'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png'
);

-- cat_drop_roll_toys @ 6-9m → ember_cat_soft_graspable_balls_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '397f87f0-9486-4d42-b6c3-e257953e6b23'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '397f87f0-9486-4d42-b6c3-e257953e6b23'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '397f87f0-9486-4d42-b6c3-e257953e6b23'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_emotion_dolls_cards @ 34-36m → ember_emotion_matching_tiles_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '27f559c2-6b5e-40b6-aa94-9451187e87cb'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_emotion_matching_tiles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '27f559c2-6b5e-40b6-aa94-9451187e87cb'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_emotion_matching_tiles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '27f559c2-6b5e-40b6-aa94-9451187e87cb'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_emotion_matching_tiles_category.png'
);

-- cat_felt_colour_sorting_play @ 25-27m → ember_cat_first_matching_games_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8797c035-a159-412d-8cc5-9f7429814773'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8797c035-a159-412d-8cc5-9f7429814773'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8797c035-a159-412d-8cc5-9f7429814773'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png'
);

-- cat_first_signs_books @ 6-9m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '89cb2651-6256-4082-ae16-497827b77c95'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '89cb2651-6256-4082-ae16-497827b77c95'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '89cb2651-6256-4082-ae16-497827b77c95'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_first_turn_taking_games @ 22-24m → ember_cat_practise_one_short_turn_each_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'aff2bdd9-001b-4629-bc59-f5edef03ebbf'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png'
);

-- cat_first_turn_taking_games @ 25-27m → ember_cat_practise_one_short_turn_each_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'aff2bdd9-001b-4629-bc59-f5edef03ebbf'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png'
);

-- cat_first_turn_taking_games @ 28-30m → ember_cat_practise_one_short_turn_each_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'aff2bdd9-001b-4629-bc59-f5edef03ebbf'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'aff2bdd9-001b-4629-bc59-f5edef03ebbf'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png'
);

-- cat_first_word_picture_cards @ 25-27m → ember_cat_picture_word_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6fcfe591-1ee0-4bc9-bf62-68f947d5def9'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_word_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6fcfe591-1ee0-4bc9-bf62-68f947d5def9'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_word_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6fcfe591-1ee0-4bc9-bf62-68f947d5def9'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_word_cards_category.png'
);

-- cat_food_choking_safety_prep @ 19-21m → ember_cat_choking_aware_meal_setup_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6baf7e34-13e0-4598-ab6a-b045f3379fac'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6baf7e34-13e0-4598-ab6a-b045f3379fac'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6baf7e34-13e0-4598-ab6a-b045f3379fac'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png'
);

-- cat_food_choking_safety_prep @ 22-24m → ember_cat_choking_aware_meal_setup_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6baf7e34-13e0-4598-ab6a-b045f3379fac'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6baf7e34-13e0-4598-ab6a-b045f3379fac'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6baf7e34-13e0-4598-ab6a-b045f3379fac'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png'
);

-- cat_handheld_mini_books @ 9-12m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '96ddd679-5a36-4bc9-9e96-4cdb8fb4dbbd'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_handwashing_step_stool @ 28-30m → ember_child_step_stool_dual_category.png (family_stool)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6e437975-2b72-43b9-85c8-3371036b388a'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6e437975-2b72-43b9-85c8-3371036b388a'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6e437975-2b72-43b9-85c8-3371036b388a'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png'
);

-- cat_jigsaw_puzzles @ 34-36m → ember_cat_first_puzzles_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ac8a518e-956a-4032-ada2-36d601dd5401'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ac8a518e-956a-4032-ada2-36d601dd5401'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ac8a518e-956a-4032-ada2-36d601dd5401'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzles_category.png'
);

-- cat_jump_hoops_beanbags @ 22-24m → ember_cat_hoops_beanbags_and_jump_markers_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '676d1808-3b00-4c60-9ba7-ce80828bc6b6'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '676d1808-3b00-4c60-9ba7-ce80828bc6b6'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '676d1808-3b00-4c60-9ba7-ce80828bc6b6'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png'
);

-- cat_jump_hoops_beanbags @ 34-36m → ember_cat_hoops_beanbags_and_jump_markers_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '676d1808-3b00-4c60-9ba7-ce80828bc6b6'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '676d1808-3b00-4c60-9ba7-ce80828bc6b6'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '676d1808-3b00-4c60-9ba7-ce80828bc6b6'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png'
);

-- cat_large_balls @ 22-24m → ember_cat_soft_graspable_balls_category.png (family_balls)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'acc5995a-f8de-45e3-ad67-7e46527bca88'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'acc5995a-f8de-45e3-ad67-7e46527bca88'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'acc5995a-f8de-45e3-ad67-7e46527bca88'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_large_balls @ 34-36m → ember_cat_soft_graspable_balls_category.png (family_balls)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'acc5995a-f8de-45e3-ad67-7e46527bca88'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'acc5995a-f8de-45e3-ad67-7e46527bca88'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'acc5995a-f8de-45e3-ad67-7e46527bca88'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_learning_tower_step_stool @ 22-24m → ember_child_step_stool_dual_category.png (family_stool)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1911e52c-53e4-4264-a860-b2f7bddd857b'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1911e52c-53e4-4264-a860-b2f7bddd857b'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1911e52c-53e4-4264-a860-b2f7bddd857b'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png'
);

-- cat_library_story_sessions @ 28-30m → ember_cat_library_mat_stay_play_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd698dbec-bf30-40da-9c94-94cade7ec38f'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd698dbec-bf30-40da-9c94-94cade7ec38f'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd698dbec-bf30-40da-9c94-94cade7ec38f'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png'
);

-- cat_library_storytime @ 25-27m → ember_cat_library_mat_stay_play_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a629781f-0549-41af-ab4c-002200e5695c'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a629781f-0549-41af-ab4c-002200e5695c'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a629781f-0549-41af-ab4c-002200e5695c'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_mat_stay_play_category.png'
);

-- cat_memory_matching_games @ 22-24m → ember_memory_match_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3f84a11c-a76e-4e7e-8858-2ab5505026ef'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_memory_match_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3f84a11c-a76e-4e7e-8858-2ab5505026ef'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_memory_match_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3f84a11c-a76e-4e7e-8858-2ab5505026ef'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_memory_match_cards_category.png'
);

-- cat_memory_matching_games @ 34-36m → ember_memory_match_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3f84a11c-a76e-4e7e-8858-2ab5505026ef'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_memory_match_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3f84a11c-a76e-4e7e-8858-2ab5505026ef'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_memory_match_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3f84a11c-a76e-4e7e-8858-2ab5505026ef'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_memory_match_cards_category.png'
);

-- cat_music_dance @ 19-21m → ember_cat_16_18_music_dance_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6ab4672b-5718-43f7-b7fc-8e88559749fe'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_16_18_music_dance_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6ab4672b-5718-43f7-b7fc-8e88559749fe'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_16_18_music_dance_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6ab4672b-5718-43f7-b7fc-8e88559749fe'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_16_18_music_dance_category.png'
);

-- cat_peer_play_books @ 22-24m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '119a70d0-06f5-49b3-9d6a-1b8e96be5800'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '119a70d0-06f5-49b3-9d6a-1b8e96be5800'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '119a70d0-06f5-49b3-9d6a-1b8e96be5800'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_picture_story_books @ 22-24m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '726c04fa-9186-43be-a569-8e21d91843ff'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_picture_story_books @ 25-27m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '726c04fa-9186-43be-a569-8e21d91843ff'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_picture_story_books @ 28-30m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '726c04fa-9186-43be-a569-8e21d91843ff'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_picture_story_books @ 34-36m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '726c04fa-9186-43be-a569-8e21d91843ff'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '726c04fa-9186-43be-a569-8e21d91843ff'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_play_dough_tools @ 25-27m → ember_cat_soft_dough_and_simple_tools_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '08368df8-fe31-48f9-a445-b38d20d482e7'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_dough_and_simple_tools_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '08368df8-fe31-48f9-a445-b38d20d482e7'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_dough_and_simple_tools_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '08368df8-fe31-48f9-a445-b38d20d482e7'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_dough_and_simple_tools_category.png'
);

-- cat_potty @ 19-21m → ember_potty_chair_low_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_potty @ 25-27m → ember_potty_chair_low_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_potty @ 28-30m → ember_potty_chair_low_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2f7208b3-d2d5-45dc-bc64-fbda80472e4d'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_potty_books @ 19-21m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4449ed2f-8009-4d02-8c23-7b47c6a508b9'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4449ed2f-8009-4d02-8c23-7b47c6a508b9'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4449ed2f-8009-4d02-8c23-7b47c6a508b9'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_potty_chair @ 22-24m → ember_potty_chair_low_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1c28ea19-8804-4712-843d-1b9e8937c5ac'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1c28ea19-8804-4712-843d-1b9e8937c5ac'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c28ea19-8804-4712-843d-1b9e8937c5ac'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_potty_chair @ 34-36m → ember_potty_chair_low_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1c28ea19-8804-4712-843d-1b9e8937c5ac'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1c28ea19-8804-4712-843d-1b9e8937c5ac'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c28ea19-8804-4712-843d-1b9e8937c5ac'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_potty_story_books @ 22-24m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '84ea8b89-7614-452f-953e-eb1551663b19'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_potty_story_books @ 34-36m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '84ea8b89-7614-452f-953e-eb1551663b19'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '84ea8b89-7614-452f-953e-eb1551663b19'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_potty_training_books @ 25-27m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c844a03f-f26c-4c67-aa5b-720b7c922714'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c844a03f-f26c-4c67-aa5b-720b7c922714'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c844a03f-f26c-4c67-aa5b-720b7c922714'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_potty_training_books @ 28-30m → ember_cat_board_books_4_6m_category.png (family_books)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c844a03f-f26c-4c67-aa5b-720b7c922714'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c844a03f-f26c-4c67-aa5b-720b7c922714'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c844a03f-f26c-4c67-aa5b-720b7c922714'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_pouring_jug_cups @ 19-21m → ember_cat_pouring_cups_and_water_lab_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2d27cb7f-46d2-4fa3-bd51-87673fdb8637'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2d27cb7f-46d2-4fa3-bd51-87673fdb8637'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2d27cb7f-46d2-4fa3-bd51-87673fdb8637'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png'
);

-- cat_pouring_serving_setup @ 34-36m → ember_cat_pour_between_just_two_containers_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '40d7934f-9942-434b-8e66-bb1946f3a757'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pour_between_just_two_containers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '40d7934f-9942-434b-8e66-bb1946f3a757'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pour_between_just_two_containers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '40d7934f-9942-434b-8e66-bb1946f3a757'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pour_between_just_two_containers_category.png'
);

-- cat_puppet_story_set @ 22-24m → ember_cat_simple_puppets_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png'
);

-- cat_puppet_story_set @ 25-27m → ember_cat_simple_puppets_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png'
);

-- cat_puppet_story_set @ 28-30m → ember_cat_simple_puppets_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c08fe7a8-8e6e-49f8-b8e4-086ff8f27870'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_category.png'
);

-- cat_ride_on_toys @ 25-27m → ember_cat_first_ride_on_toys_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6b4c6d2a-961c-4df7-8d92-831e22d6b2e2'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6b4c6d2a-961c-4df7-8d92-831e22d6b2e2'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6b4c6d2a-961c-4df7-8d92-831e22d6b2e2'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png'
);

-- cat_ride_on_toys @ 28-30m → ember_cat_first_ride_on_toys_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6b4c6d2a-961c-4df7-8d92-831e22d6b2e2'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6b4c6d2a-961c-4df7-8d92-831e22d6b2e2'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6b4c6d2a-961c-4df7-8d92-831e22d6b2e2'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_ride_on_toys_category.png'
);

-- cat_roll_ball_turns @ 22-24m → ember_cat_soft_graspable_balls_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c9a05937-5116-4a54-87e2-b1d34922e826'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c9a05937-5116-4a54-87e2-b1d34922e826'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_roll_build_cones @ 6-9m → ember_cat_soft_graspable_balls_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '091da35e-5012-4b74-a890-0412031b21a4'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '091da35e-5012-4b74-a890-0412031b21a4'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '091da35e-5012-4b74-a890-0412031b21a4'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_rolling_ball_set @ 6-9m → ember_cat_soft_graspable_balls_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0a912f51-f157-4ee1-8f76-40b5d01daa81'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0a912f51-f157-4ee1-8f76-40b5d01daa81'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0a912f51-f157-4ee1-8f76-40b5d01daa81'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_rolling_bell_sound_ball @ 1-3m → ember_cat_soft_graspable_balls_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd77f6092-5a2a-45e9-93d0-a2ad123b78c0'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd77f6092-5a2a-45e9-93d0-a2ad123b78c0'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd77f6092-5a2a-45e9-93d0-a2ad123b78c0'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_rolling_chime_ball @ 9-12m → ember_cat_soft_graspable_balls_category.png (family_balls)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8dd7584d-e074-4dc1-84f8-40fca6f766e5'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8dd7584d-e074-4dc1-84f8-40fca6f766e5'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8dd7584d-e074-4dc1-84f8-40fca6f766e5'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_routine_cards @ 25-27m → ember_visual_routine_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8913cef1-e4c0-4393-9f3c-a6a566feba00'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8913cef1-e4c0-4393-9f3c-a6a566feba00'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8913cef1-e4c0-4393-9f3c-a6a566feba00'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png'
);

-- cat_routine_cards @ 28-30m → ember_visual_routine_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8913cef1-e4c0-4393-9f3c-a6a566feba00'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8913cef1-e4c0-4393-9f3c-a6a566feba00'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8913cef1-e4c0-4393-9f3c-a6a566feba00'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png'
);

-- cat_sand_water_play_set @ 19-21m → ember_cat_sand_and_water_table_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '979c44fd-1ddf-496e-99aa-8d6897c59571'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sand_and_water_table_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '979c44fd-1ddf-496e-99aa-8d6897c59571'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sand_and_water_table_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '979c44fd-1ddf-496e-99aa-8d6897c59571'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sand_and_water_table_category.png'
);

-- cat_simple_choice_cards @ 19-21m → ember_cat_tiny_choices_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0a247617-5d6b-4673-bef0-03f4778ea478'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0a247617-5d6b-4673-bef0-03f4778ea478'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0a247617-5d6b-4673-bef0-03f4778ea478'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png'
);

-- cat_simple_choice_cards @ 22-24m → ember_cat_tiny_choices_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0a247617-5d6b-4673-bef0-03f4778ea478'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0a247617-5d6b-4673-bef0-03f4778ea478'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0a247617-5d6b-4673-bef0-03f4778ea478'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png'
);

-- cat_small_world_figures @ 34-36m → ember_cat_small_world_cars_and_garages_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5022d452-1c14-40e3-b62e-d2a46693c129'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5022d452-1c14-40e3-b62e-d2a46693c129'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5022d452-1c14-40e3-b62e-d2a46693c129'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png'
);

-- cat_small_world_vehicles_figures @ 22-24m → ember_cat_small_world_cars_and_garages_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png'
);

-- cat_small_world_vehicles_figures @ 25-27m → ember_cat_small_world_cars_and_garages_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png'
);

-- cat_small_world_vehicles_figures @ 28-30m → ember_cat_small_world_cars_and_garages_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b2523fdf-85a0-4ac8-b875-7e04a313c1f2'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png'
);

-- cat_song_rhyme_books @ 1-3m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3057fe47-9719-4aad-bffe-49634231d745'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_song_rhyme_books @ 19-21m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3057fe47-9719-4aad-bffe-49634231d745'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_song_rhyme_books @ 25-27m → ember_cat_board_books_4_6m_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3057fe47-9719-4aad-bffe-49634231d745'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3057fe47-9719-4aad-bffe-49634231d745'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png'
);

-- cat_stacking_pegboard @ 19-21m → ember_cat_tower_blocks_category.png (family_blocks)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4109bada-d23b-47bd-b235-ac81b7d190f4'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4109bada-d23b-47bd-b235-ac81b7d190f4'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4109bada-d23b-47bd-b235-ac81b7d190f4'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png'
);

-- cat_stacking_pegboard @ 22-24m → ember_cat_tower_blocks_category.png (family_blocks)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4109bada-d23b-47bd-b235-ac81b7d190f4'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4109bada-d23b-47bd-b235-ac81b7d190f4'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4109bada-d23b-47bd-b235-ac81b7d190f4'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png'
);

-- cat_stacking_pegboard @ 25-27m → ember_cat_tower_blocks_category.png (family_blocks)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4109bada-d23b-47bd-b235-ac81b7d190f4'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4109bada-d23b-47bd-b235-ac81b7d190f4'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4109bada-d23b-47bd-b235-ac81b7d190f4'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png'
);

-- cat_stacking_rings @ 9-12m → ember_cat_tower_blocks_category.png (family_blocks)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1133a09e-95a1-4543-b069-ae57d5ace73e'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1133a09e-95a1-4543-b069-ae57d5ace73e'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1133a09e-95a1-4543-b069-ae57d5ace73e'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png'
);

-- cat_step_stool @ 25-27m → ember_child_step_stool_dual_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '009bea9c-47d7-4efd-a1bc-abbac9cd6f0a'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '009bea9c-47d7-4efd-a1bc-abbac9cd6f0a'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '009bea9c-47d7-4efd-a1bc-abbac9cd6f0a'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png'
);

-- cat_step_stool @ 28-30m → ember_child_step_stool_dual_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '009bea9c-47d7-4efd-a1bc-abbac9cd6f0a'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '009bea9c-47d7-4efd-a1bc-abbac9cd6f0a'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '009bea9c-47d7-4efd-a1bc-abbac9cd6f0a'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png'
);

-- cat_step_stool_bathroom @ 19-21m → ember_child_step_stool_dual_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '68441cb3-083d-42e5-89ad-50e8004ca1f3'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '68441cb3-083d-42e5-89ad-50e8004ca1f3'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '68441cb3-083d-42e5-89ad-50e8004ca1f3'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png'
);

-- cat_step_stool_bathroom @ 22-24m → ember_child_step_stool_dual_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '68441cb3-083d-42e5-89ad-50e8004ca1f3'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '68441cb3-083d-42e5-89ad-50e8004ca1f3'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '68441cb3-083d-42e5-89ad-50e8004ca1f3'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_child_step_stool_dual_category.png'
);

-- cat_stickers_collage @ 34-36m → ember_cat_stickers_and_simple_collage_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '959a9f5d-cfb6-4060-a683-34cbd4d9fdbc'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stickers_and_simple_collage_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '959a9f5d-cfb6-4060-a683-34cbd4d9fdbc'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stickers_and_simple_collage_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '959a9f5d-cfb6-4060-a683-34cbd4d9fdbc'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stickers_and_simple_collage_category.png'
);

-- cat_teddy_care_play @ 22-24m → ember_cat_doll_soft_toy_care_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '16973065-e03d-4999-ac6a-47221e9a6d7c'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '16973065-e03d-4999-ac6a-47221e9a6d7c'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_threading_beads @ 22-24m → ember_cat_chunky_lacing_and_threading_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6c1986cf-2ff7-4321-b1ab-edbf42457b14'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6c1986cf-2ff7-4321-b1ab-edbf42457b14'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6c1986cf-2ff7-4321-b1ab-edbf42457b14'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png'
);

-- cat_threading_beads @ 25-27m → ember_cat_chunky_lacing_and_threading_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6c1986cf-2ff7-4321-b1ab-edbf42457b14'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6c1986cf-2ff7-4321-b1ab-edbf42457b14'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6c1986cf-2ff7-4321-b1ab-edbf42457b14'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png'
);

-- cat_threading_beads @ 34-36m → ember_cat_chunky_lacing_and_threading_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6c1986cf-2ff7-4321-b1ab-edbf42457b14'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6c1986cf-2ff7-4321-b1ab-edbf42457b14'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6c1986cf-2ff7-4321-b1ab-edbf42457b14'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png'
);

-- cat_toddler_cutlery @ 13-15m → ember_cat_spoon_practice_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5c7a0c09-085e-411d-8fc4-375af03dd188'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5c7a0c09-085e-411d-8fc4-375af03dd188'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5c7a0c09-085e-411d-8fc4-375af03dd188'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png'
);

-- cat_toddler_cutlery @ 22-24m → ember_cat_spoon_practice_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5c7a0c09-085e-411d-8fc4-375af03dd188'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5c7a0c09-085e-411d-8fc4-375af03dd188'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5c7a0c09-085e-411d-8fc4-375af03dd188'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_spoon_practice_category.png'
);

-- cat_toilet_seat_footrest @ 19-21m → ember_toilet_training_seat_adapter_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af14026b-86cc-4695-af34-57cbbae8fba4'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_toilet_training_seat_adapter_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af14026b-86cc-4695-af34-57cbbae8fba4'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_toilet_training_seat_adapter_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af14026b-86cc-4695-af34-57cbbae8fba4'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_toilet_training_seat_adapter_category.png'
);

-- cat_toilet_training_seat @ 25-27m → ember_potty_chair_low_category.png (family_potty)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8c9a624d-c1db-4651-9691-144d48dea6d3'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8c9a624d-c1db-4651-9691-144d48dea6d3'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8c9a624d-c1db-4651-9691-144d48dea6d3'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_toilet_training_seat @ 28-30m → ember_potty_chair_low_category.png (family_potty)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8c9a624d-c1db-4651-9691-144d48dea6d3'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8c9a624d-c1db-4651-9691-144d48dea6d3'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8c9a624d-c1db-4651-9691-144d48dea6d3'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_toilet_training_seat_step @ 22-24m → ember_potty_chair_low_category.png (family_potty)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '719f2fe4-c1c1-4d85-b0e1-0afb5af1bf32'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '719f2fe4-c1c1-4d85-b0e1-0afb5af1bf32'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '719f2fe4-c1c1-4d85-b0e1-0afb5af1bf32'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_potty_chair_low_category.png'
);

-- cat_toy_cleaning_set @ 19-21m → ember_cat_first_cleaning_play_sets_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ee0a1255-4182-4fd5-a287-73f58fab15f9'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ee0a1255-4182-4fd5-a287-73f58fab15f9'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ee0a1255-4182-4fd5-a287-73f58fab15f9'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_cleaning_play_sets_category.png'
);

-- cat_tricycle_scooter @ 22-24m → ember_cat_trikes_and_beginner_scooters_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b372c53e-0c36-47b3-9f06-031e440556f8'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b372c53e-0c36-47b3-9f06-031e440556f8'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b372c53e-0c36-47b3-9f06-031e440556f8'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png'
);

-- cat_tricycle_scooter @ 34-36m → ember_cat_trikes_and_beginner_scooters_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b372c53e-0c36-47b3-9f06-031e440556f8'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b372c53e-0c36-47b3-9f06-031e440556f8'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b372c53e-0c36-47b3-9f06-031e440556f8'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png'
);

-- cat_turn_taking_games @ 25-27m → ember_cat_practise_one_short_turn_each_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1f2271cf-e55c-491c-9add-48ae1b91f01e'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1f2271cf-e55c-491c-9add-48ae1b91f01e'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1f2271cf-e55c-491c-9add-48ae1b91f01e'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png'
);

-- cat_turn_taking_games @ 34-36m → ember_cat_practise_one_short_turn_each_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1f2271cf-e55c-491c-9add-48ae1b91f01e'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1f2271cf-e55c-491c-9add-48ae1b91f01e'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1f2271cf-e55c-491c-9add-48ae1b91f01e'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png'
);

-- cat_visual_choice_cards @ 25-27m → ember_cat_tiny_choices_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '458527f9-5e9b-458e-a23f-c5d8d41ed86c'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '458527f9-5e9b-458e-a23f-c5d8d41ed86c'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '458527f9-5e9b-458e-a23f-c5d8d41ed86c'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png'
);

-- cat_visual_choice_cards @ 28-30m → ember_cat_tiny_choices_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '458527f9-5e9b-458e-a23f-c5d8d41ed86c'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '458527f9-5e9b-458e-a23f-c5d8d41ed86c'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '458527f9-5e9b-458e-a23f-c5d8d41ed86c'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choices_category.png'
);

-- cat_visual_routine_cards @ 22-24m → ember_visual_routine_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd485f735-620f-47b3-b2e3-3ad9a4b03e90'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd485f735-620f-47b3-b2e3-3ad9a4b03e90'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd485f735-620f-47b3-b2e3-3ad9a4b03e90'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png'
);

-- cat_visual_routine_cards @ 34-36m → ember_visual_routine_cards_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd485f735-620f-47b3-b2e3-3ad9a4b03e90'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd485f735-620f-47b3-b2e3-3ad9a4b03e90'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd485f735-620f-47b3-b2e3-3ad9a4b03e90'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_visual_routine_cards_category.png'
);

-- cat_washable_paint_sticks @ 25-27m → ember_cat_washable_paint_and_chunky_brushes_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e519c4d1-aff1-4b6d-8000-1f4c88caa1ad'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_paint_and_chunky_brushes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e519c4d1-aff1-4b6d-8000-1f4c88caa1ad'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_paint_and_chunky_brushes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e519c4d1-aff1-4b6d-8000-1f4c88caa1ad'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_paint_and_chunky_brushes_category.png'
);

-- cat_water_doodle_mat @ 19-21m → ember_cat_water_doodle_mats_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5205ee90-decf-4a6c-a82d-46dfa9fac800'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_doodle_mats_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5205ee90-decf-4a6c-a82d-46dfa9fac800'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_doodle_mats_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5205ee90-decf-4a6c-a82d-46dfa9fac800'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_doodle_mats_category.png'
);

-- cat_water_play_cups @ 25-27m → ember_cat_pouring_cups_and_water_lab_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b33c0b36-edec-4727-8b0d-c60bade724ec'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b33c0b36-edec-4727-8b0d-c60bade724ec'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b33c0b36-edec-4727-8b0d-c60bade724ec'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png'
);

-- cat_water_play_supervision @ 34-36m → ember_cat_bath_water_supervision_category.png (manual_recycle)
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8cf11c94-360c-4267-892b-77e3ba1d69fa'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8cf11c94-360c-4267-892b-77e3ba1d69fa'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8cf11c94-360c-4267-892b-77e3ba1d69fa'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png'
);

COMMIT;
