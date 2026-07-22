-- Map Stage 2 category images: Storage exists, DB row missing (batch 31 slugs / 33 scopes).
-- Source: stage2_borrowable_audit_distinct.csv own_slug_storage_unmapped

BEGIN;

-- cat_activity_cube @ 9-12m → ember_cat_activity_cube_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bff6d15e-91ad-446e-bf3b-1fedb6d8675d'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_cube_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bff6d15e-91ad-446e-bf3b-1fedb6d8675d'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_cube_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bff6d15e-91ad-446e-bf3b-1fedb6d8675d'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_cube_category.png'
);

-- cat_activity_cube_floor @ 6-9m → ember_cat_activity_cube_floor_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b720f57f-d6fa-4c8a-b275-be530ed8c32a'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_cube_floor_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b720f57f-d6fa-4c8a-b275-be530ed8c32a'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_cube_floor_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b720f57f-d6fa-4c8a-b275-be530ed8c32a'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_cube_floor_category.png'
);

-- cat_activity_gym_detachable_toys @ 4-6m → ember_cat_activity_gym_detachable_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '84a9722d-8440-4067-a47a-285b4e11261e'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_gym_detachable_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '84a9722d-8440-4067-a47a-285b4e11261e'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_gym_detachable_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '84a9722d-8440-4067-a47a-285b4e11261e'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_activity_gym_detachable_toys_category.png'
);

-- cat_bag_sweep @ 9-12m → ember_cat_bag_sweep_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '40cbecb6-2671-431b-bdcf-19ef51718c29'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bag_sweep_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '40cbecb6-2671-431b-bdcf-19ef51718c29'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bag_sweep_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '40cbecb6-2671-431b-bdcf-19ef51718c29'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bag_sweep_category.png'
);

-- cat_battery_free_toys @ 6-9m → ember_cat_battery_free_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '72b4a6fd-6b12-4dbb-81be-3efdb09cfbd9'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_battery_free_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '72b4a6fd-6b12-4dbb-81be-3efdb09cfbd9'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_battery_free_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '72b4a6fd-6b12-4dbb-81be-3efdb09cfbd9'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_battery_free_toys_category.png'
);

-- cat_blind_cord_tidy @ 6-9m → ember_cat_blind_cord_tidy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd14cfed5-0d82-4dfa-82a7-d6f6190a82e6'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_tidy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd14cfed5-0d82-4dfa-82a7-d6f6190a82e6'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_tidy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd14cfed5-0d82-4dfa-82a7-d6f6190a82e6'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_tidy_category.png'
);

-- cat_choking_aware_meal_setup @ 4-6m → ember_cat_choking_aware_meal_setup_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '17668342-6622-480b-9b8e-6af38f871079'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '17668342-6622-480b-9b8e-6af38f871079'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '17668342-6622-480b-9b8e-6af38f871079'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_choking_aware_meal_setup_category.png'
);

-- cat_feeding_readiness_check @ 4-6m → ember_cat_feeding_readiness_check_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '13a7f712-8318-43c4-aebd-bea6780cc714'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeding_readiness_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '13a7f712-8318-43c4-aebd-bea6780cc714'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeding_readiness_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '13a7f712-8318-43c4-aebd-bea6780cc714'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeding_readiness_check_category.png'
);

-- cat_first_play_guide_cards @ 1-3m → ember_cat_first_play_guide_cards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '67705ff6-a833-408c-beb3-85d77cef48bb'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_play_guide_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '67705ff6-a833-408c-beb3-85d77cef48bb'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_play_guide_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '67705ff6-a833-408c-beb3-85d77cef48bb'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_play_guide_cards_category.png'
);

-- cat_gentle_musical_touch_toy @ 1-3m → ember_cat_gentle_musical_touch_toy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e4a6b946-3a89-42ea-a83f-be69138072c1'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_gentle_musical_touch_toy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e4a6b946-3a89-42ea-a83f-be69138072c1'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_gentle_musical_touch_toy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e4a6b946-3a89-42ea-a83f-be69138072c1'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_gentle_musical_touch_toy_category.png'
);

-- cat_hide_squeak_eggs @ 6-9m → ember_cat_hide_squeak_eggs_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b68d7170-fa33-4d8b-8529-16fa09ef1f07'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_squeak_eggs_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b68d7170-fa33-4d8b-8529-16fa09ef1f07'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_squeak_eggs_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b68d7170-fa33-4d8b-8529-16fa09ef1f07'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_squeak_eggs_category.png'
);

-- cat_highchair_harness_check @ 9-12m → ember_cat_highchair_harness_check_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f5bb5375-c9a7-459d-9f2b-b48ab329e7e8'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_highchair_harness_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f5bb5375-c9a7-459d-9f2b-b48ab329e7e8'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_highchair_harness_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f5bb5375-c9a7-459d-9f2b-b48ab329e7e8'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_highchair_harness_check_category.png'
);

-- cat_kick_and_look_play_gym @ 1-3m → ember_cat_kick_and_look_play_gym_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3f00c3bd-1680-4867-9517-69cee98324a5'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kick_and_look_play_gym_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3f00c3bd-1680-4867-9517-69cee98324a5'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kick_and_look_play_gym_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3f00c3bd-1680-4867-9517-69cee98324a5'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kick_and_look_play_gym_category.png'
);

-- cat_one_small_toy_reach_loop @ 4-6m → ember_cat_one_small_toy_reach_loop_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ed33adb6-c218-4210-ac88-53141c6ce283'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_one_small_toy_reach_loop_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ed33adb6-c218-4210-ac88-53141c6ce283'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_one_small_toy_reach_loop_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ed33adb6-c218-4210-ac88-53141c6ce283'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_one_small_toy_reach_loop_category.png'
);

-- cat_reach_out_of_range @ 6-9m → ember_cat_reach_out_of_range_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '530b29a1-3ad6-4047-9f35-d6b437017beb'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_out_of_range_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '530b29a1-3ad6-4047-9f35-d6b437017beb'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_out_of_range_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '530b29a1-3ad6-4047-9f35-d6b437017beb'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_out_of_range_category.png'
);

-- cat_safe_food_prep_tools @ 28-30m → ember_cat_safe_food_prep_tools_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e8ed19df-8f84-453a-8088-22466b937af7'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e8ed19df-8f84-453a-8088-22466b937af7'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e8ed19df-8f84-453a-8088-22466b937af7'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png'
);

-- cat_safe_food_prep_tools @ 34-36m → ember_cat_safe_food_prep_tools_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e8ed19df-8f84-453a-8088-22466b937af7'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e8ed19df-8f84-453a-8088-22466b937af7'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e8ed19df-8f84-453a-8088-22466b937af7'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png'
);

-- cat_safe_food_prep_tools @ 6-9m → ember_cat_safe_food_prep_tools_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e8ed19df-8f84-453a-8088-22466b937af7'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e8ed19df-8f84-453a-8088-22466b937af7'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e8ed19df-8f84-453a-8088-22466b937af7'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_food_prep_tools_category.png'
);

-- cat_short_tummy_time_tries @ 4-6m → ember_cat_short_tummy_time_tries_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bc4ba245-24f9-4fd1-9444-c486eadd4d5a'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_tummy_time_tries_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bc4ba245-24f9-4fd1-9444-c486eadd4d5a'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_tummy_time_tries_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bc4ba245-24f9-4fd1-9444-c486eadd4d5a'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_short_tummy_time_tries_category.png'
);

-- cat_simple_picture_cards @ 4-6m → ember_cat_simple_picture_cards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd7a93de2-a1be-4518-9276-5ff8c8f2d5c4'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_picture_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd7a93de2-a1be-4518-9276-5ff8c8f2d5c4'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_picture_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd7a93de2-a1be-4518-9276-5ff8c8f2d5c4'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_picture_cards_category.png'
);

-- cat_simple_puppets_words @ 9-12m → ember_cat_simple_puppets_words_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '934f83c4-be55-4734-ad18-fa1861a02228'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_words_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '934f83c4-be55-4734-ad18-fa1861a02228'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_words_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '934f83c4-be55-4734-ad18-fa1861a02228'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_puppets_words_category.png'
);

-- cat_sling_ticks_check @ 9-12m → ember_cat_sling_ticks_check_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b02d28ea-50a0-4eeb-b66e-9362041f2e29'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sling_ticks_check_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b02d28ea-50a0-4eeb-b66e-9362041f2e29'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sling_ticks_check_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b02d28ea-50a0-4eeb-b66e-9362041f2e29'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sling_ticks_check_category.png'
);

-- cat_soft_crawl_shapes @ 9-12m → ember_cat_soft_crawl_shapes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a2fc9d2c-3442-4117-8c75-d58ca97e709d'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_crawl_shapes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a2fc9d2c-3442-4117-8c75-d58ca97e709d'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_crawl_shapes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a2fc9d2c-3442-4117-8c75-d58ca97e709d'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_crawl_shapes_category.png'
);

-- cat_soft_hanging_toys @ 1-3m → ember_cat_soft_hanging_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a504445a-e7d5-4548-ba61-39990e0ca5c3'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_hanging_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a504445a-e7d5-4548-ba61-39990e0ca5c3'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_hanging_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a504445a-e7d5-4548-ba61-39990e0ca5c3'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_hanging_toys_category.png'
);

-- cat_sorting_containers @ 6-9m → ember_cat_sorting_containers_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd84cd59c-8682-4df8-8aae-d27988e1895d'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sorting_containers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd84cd59c-8682-4df8-8aae-d27988e1895d'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sorting_containers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd84cd59c-8682-4df8-8aae-d27988e1895d'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sorting_containers_category.png'
);

-- cat_teething_cloth @ 1-3m → ember_cat_teething_cloth_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '602d43c1-6084-4521-a878-b159266dedc8'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teething_cloth_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '602d43c1-6084-4521-a878-b159266dedc8'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teething_cloth_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '602d43c1-6084-4521-a878-b159266dedc8'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teething_cloth_category.png'
);

-- cat_tiny_daily_play_loop @ 9-12m → ember_cat_tiny_daily_play_loop_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3462db8a-c4e7-4982-b991-568d3b9afe29'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_daily_play_loop_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3462db8a-c4e7-4982-b991-568d3b9afe29'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_daily_play_loop_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3462db8a-c4e7-4982-b991-568d3b9afe29'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_daily_play_loop_category.png'
);

-- cat_tissue_box_cloths @ 9-12m → ember_cat_tissue_box_cloths_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b5f987c3-ccfb-4d2a-a354-2e34d13456f4'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tissue_box_cloths_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b5f987c3-ccfb-4d2a-a354-2e34d13456f4'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tissue_box_cloths_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b5f987c3-ccfb-4d2a-a354-2e34d13456f4'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tissue_box_cloths_category.png'
);

-- cat_transparent_tube_tower @ 6-9m → ember_cat_transparent_tube_tower_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cfea27cf-79b5-4ac0-af54-6988f43284e9'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_transparent_tube_tower_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cfea27cf-79b5-4ac0-af54-6988f43284e9'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_transparent_tube_tower_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cfea27cf-79b5-4ac0-af54-6988f43284e9'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_transparent_tube_tower_category.png'
);

-- cat_tummy_time_support_prop @ 1-3m → ember_cat_tummy_time_support_prop_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a808d427-0077-4f7b-ba0f-146b7c744837'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_support_prop_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a808d427-0077-4f7b-ba0f-146b7c744837'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_support_prop_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a808d427-0077-4f7b-ba0f-146b7c744837'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_support_prop_category.png'
);

-- cat_tummy_time_support_setup @ 4-6m → ember_cat_tummy_time_support_setup_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ab857358-70ec-46ce-b737-9897603666f0'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_support_setup_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ab857358-70ec-46ce-b737-9897603666f0'::uuid,
  '4-6m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_support_setup_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ab857358-70ec-46ce-b737-9897603666f0'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_support_setup_category.png'
);

-- cat_twist_stroke_tactile_toy @ 1-3m → ember_cat_twist_stroke_tactile_toy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '4c0911a7-3122-412f-94b6-c81881b6509a'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_twist_stroke_tactile_toy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '4c0911a7-3122-412f-94b6-c81881b6509a'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_twist_stroke_tactile_toy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '4c0911a7-3122-412f-94b6-c81881b6509a'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_twist_stroke_tactile_toy_category.png'
);

-- cat_washable_floor_play_mat @ 1-3m → ember_cat_washable_floor_play_mat_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3cf67118-9ef7-4cd0-816e-98952700e345'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_floor_play_mat_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3cf67118-9ef7-4cd0-816e-98952700e345'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_floor_play_mat_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3cf67118-9ef7-4cd0-816e-98952700e345'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_floor_play_mat_category.png'
);

COMMIT;
