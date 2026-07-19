-- Fix category image mappings: point at verified Storage objects only.
-- Deactivate age-scoped rows when no live object exists.

BEGIN;

-- cat_practise_one_short_turn_each → ember_cat_practise_one_short_turn_each_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2607437d-5de7-4ac4-82a5-f2a174df4c55'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2607437d-5de7-4ac4-82a5-f2a174df4c55'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2607437d-5de7-4ac4-82a5-f2a174df4c55'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_practise_one_short_turn_each_category.png'
);

-- cat_pour_between_just_two_containers → ember_cat_pour_between_just_two_containers_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a245cfb9-9e3e-4424-9456-25022a9356f8'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pour_between_just_two_containers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a245cfb9-9e3e-4424-9456-25022a9356f8'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pour_between_just_two_containers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a245cfb9-9e3e-4424-9456-25022a9356f8'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pour_between_just_two_containers_category.png'
);

-- cat_let_one_object_become_something_else → ember_cat_let_one_object_become_something_else_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ee31fefc-eef5-4841-be36-def5da9fedba'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_let_one_object_become_something_else_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ee31fefc-eef5-4841-be36-def5da9fedba'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_let_one_object_become_something_else_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ee31fefc-eef5-4841-be36-def5da9fedba'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_let_one_object_become_something_else_category.png'
);

-- cat_give_one_real_job_not_five → ember_cat_give_one_real_job_not_five_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f094c783-be87-4e02-9251-6f9061719bad'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_one_real_job_not_five_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f094c783-be87-4e02-9251-6f9061719bad'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_one_real_job_not_five_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f094c783-be87-4e02-9251-6f9061719bad'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_one_real_job_not_five_category.png'
);

-- cat_make_a_jump_and_collect_game → ember_cat_make_a_jump_and_collect_game_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e6564ef8-167c-4f34-af8f-17e67a17ea5d'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_make_a_jump_and_collect_game_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e6564ef8-167c-4f34-af8f-17e67a17ea5d'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_make_a_jump_and_collect_game_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e6564ef8-167c-4f34-af8f-17e67a17ea5d'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_make_a_jump_and_collect_game_category.png'
);

-- cat_pause_before_the_next_page → ember_cat_pause_before_the_next_page_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd53deadc-cf21-4a79-b36f-5686c4691f98'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pause_before_the_next_page_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd53deadc-cf21-4a79-b36f-5686c4691f98'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pause_before_the_next_page_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd53deadc-cf21-4a79-b36f-5686c4691f98'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pause_before_the_next_page_category.png'
);

-- cat_retell_one_tiny_bit_of_the_day → ember_cat_retell_one_tiny_bit_of_the_day_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '81977c73-178f-4fef-ad29-99b7ceaa2cf2'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_retell_one_tiny_bit_of_the_day_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '81977c73-178f-4fef-ad29-99b7ceaa2cf2'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_retell_one_tiny_bit_of_the_day_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '81977c73-178f-4fef-ad29-99b7ceaa2cf2'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_retell_one_tiny_bit_of_the_day_category.png'
);

-- cat_offer_a_bigger_making_surface → ember_cat_offer_a_bigger_making_surface_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f2607c1f-2421-4f88-874b-20942416f818'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_offer_a_bigger_making_surface_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f2607c1f-2421-4f88-874b-20942416f818'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_offer_a_bigger_making_surface_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f2607c1f-2421-4f88-874b-20942416f818'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_offer_a_bigger_making_surface_category.png'
);

-- cat_ask_who_what_and_where → ember_cat_ask_who_what_and_where_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0100100e-9644-4396-8e59-7c037b6c5d96'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ask_who_what_and_where_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0100100e-9644-4396-8e59-7c037b6c5d96'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ask_who_what_and_where_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0100100e-9644-4396-8e59-7c037b6c5d96'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ask_who_what_and_where_category.png'
);

-- cat_kick_chase_and_bring_back → ember_cat_kick_chase_and_bring_back_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '82bc44bb-a7c9-419f-b58c-eba09ebd3f90'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kick_chase_and_bring_back_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '82bc44bb-a7c9-419f-b58c-eba09ebd3f90'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kick_chase_and_bring_back_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '82bc44bb-a7c9-419f-b58c-eba09ebd3f90'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_kick_chase_and_bring_back_category.png'
);

-- cat_add_one_word_to_what_they_say → ember_cat_add_one_word_to_what_they_say_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1d116ed3-61bc-449a-b73f-5b5f22f9034f'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_add_one_word_to_what_they_say_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1d116ed3-61bc-449a-b73f-5b5f22f9034f'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_add_one_word_to_what_they_say_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1d116ed3-61bc-449a-b73f-5b5f22f9034f'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_add_one_word_to_what_they_say_category.png'
);

-- cat_give_one_fiddly_challenge_at_a_time → ember_cat_give_one_fiddly_challenge_at_a_time_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a472af55-bf99-4b05-956c-ecc9ac850f9d'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_one_fiddly_challenge_at_a_time_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a472af55-bf99-4b05-956c-ecc9ac850f9d'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_one_fiddly_challenge_at_a_time_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a472af55-bf99-4b05-956c-ecc9ac850f9d'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_one_fiddly_challenge_at_a_time_category.png'
);

-- cat_let_them_try_the_easy_bit_first → ember_cat_let_them_try_the_easy_bit_first_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '51810e1b-91c8-43b0-8edf-f93a4fb20397'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_let_them_try_the_easy_bit_first_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '51810e1b-91c8-43b0-8edf-f93a4fb20397'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_let_them_try_the_easy_bit_first_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '51810e1b-91c8-43b0-8edf-f93a4fb20397'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_let_them_try_the_easy_bit_first_category.png'
);

-- cat_narrate_care_play_softly → ember_cat_narrate_care_play_softly_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1c633e33-bcfe-40c9-89df-49ff5c46e2a5'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_narrate_care_play_softly_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1c633e33-bcfe-40c9-89df-49ff5c46e2a5'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_narrate_care_play_softly_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c633e33-bcfe-40c9-89df-49ff5c46e2a5'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_narrate_care_play_softly_category.png'
);

-- cat_make_messy_play_repeatable → ember_cat_make_messy_play_repeatable_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '77d0b623-2787-438b-acd7-11b15d0d9505'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_make_messy_play_repeatable_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '77d0b623-2787-438b-acd7-11b15d0d9505'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_make_messy_play_repeatable_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '77d0b623-2787-438b-acd7-11b15d0d9505'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_make_messy_play_repeatable_category.png'
);

-- cat_give_them_the_words_for_stuck_moments → ember_cat_give_them_the_words_for_stuck_moments_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8314483e-da2c-425e-8cb2-cf75766fe56e'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_them_the_words_for_stuck_moments_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8314483e-da2c-425e-8cb2-cf75766fe56e'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_them_the_words_for_stuck_moments_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8314483e-da2c-425e-8cb2-cf75766fe56e'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_give_them_the_words_for_stuck_moments_category.png'
);

-- cat_match_bravery_with_supervision → ember_cat_match_bravery_with_supervision_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '00b4bf12-8338-4866-8656-1834aab9e086'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_match_bravery_with_supervision_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '00b4bf12-8338-4866-8656-1834aab9e086'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_match_bravery_with_supervision_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '00b4bf12-8338-4866-8656-1834aab9e086'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_match_bravery_with_supervision_category.png'
);

-- cat_supervise_water_dough_and_small_tools → ember_cat_supervise_water_dough_and_small_tools_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cea7cb88-822f-40c5-a5c1-c535ec327b2e'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_supervise_water_dough_and_small_tools_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cea7cb88-822f-40c5-a5c1-c535ec327b2e'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_supervise_water_dough_and_small_tools_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cea7cb88-822f-40c5-a5c1-c535ec327b2e'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_supervise_water_dough_and_small_tools_category.png'
);

-- cat_keep_screens_from_crowding_out_talk → ember_cat_keep_screens_from_crowding_out_talk_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fab8f091-8409-43a3-93ed-c8219b66af48'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_screens_from_crowding_out_talk_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fab8f091-8409-43a3-93ed-c8219b66af48'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_screens_from_crowding_out_talk_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fab8f091-8409-43a3-93ed-c8219b66af48'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_screens_from_crowding_out_talk_category.png'
);

-- cat_keep_peer_play_expectations_small → ember_cat_keep_peer_play_expectations_small_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cbe01969-0fcb-4c06-8aec-f4472f70aac2'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_peer_play_expectations_small_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cbe01969-0fcb-4c06-8aec-f4472f70aac2'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_peer_play_expectations_small_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cbe01969-0fcb-4c06-8aec-f4472f70aac2'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_peer_play_expectations_small_category.png'
);

-- cat_avoid_tiny_pretend_accessories → ember_cat_avoid_tiny_pretend_accessories_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e528984d-e33e-42c2-988a-7090d4df691d'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_avoid_tiny_pretend_accessories_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e528984d-e33e-42c2-988a-7090d4df691d'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_avoid_tiny_pretend_accessories_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e528984d-e33e-42c2-988a-7090d4df691d'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_avoid_tiny_pretend_accessories_category.png'
);

-- cat_keep_potty_progress_low_pressure → ember_cat_keep_potty_progress_low_pressure_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e9ffc63e-8fad-4e7c-8982-82a0dedb19ff'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_potty_progress_low_pressure_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e9ffc63e-8fad-4e7c-8982-82a0dedb19ff'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_potty_progress_low_pressure_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e9ffc63e-8fad-4e7c-8982-82a0dedb19ff'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_potty_progress_low_pressure_category.png'
);

-- cat_keep_the_answer_easy_to_find → ember_cat_keep_the_answer_easy_to_find_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cc801dff-22c3-4974-a815-a6b964aae594'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_the_answer_easy_to_find_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cc801dff-22c3-4974-a815-a6b964aae594'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_the_answer_easy_to_find_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cc801dff-22c3-4974-a815-a6b964aae594'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_keep_the_answer_easy_to_find_category.png'
);

-- cat_check_small_parts_before_threading_or_collage → ember_cat_check_small_parts_before_threading_or_collage_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '97b285a6-8316-420d-b540-de39231a3635'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_check_small_parts_before_threading_or_collage_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '97b285a6-8316-420d-b540-de39231a3635'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_check_small_parts_before_threading_or_collage_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '97b285a6-8316-420d-b540-de39231a3635'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_check_small_parts_before_threading_or_collage_category.png'
);

-- cat_big_soft_ball_for_turn_taking → ember_cat_big_soft_ball_for_turn_taking_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7cc3bda8-4203-4436-b95e-f73ff3239004'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_soft_ball_for_turn_taking_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7cc3bda8-4203-4436-b95e-f73ff3239004'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_soft_ball_for_turn_taking_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7cc3bda8-4203-4436-b95e-f73ff3239004'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_soft_ball_for_turn_taking_category.png'
);

-- cat_feeling_faces_and_story_books → ember_cat_feeling_faces_and_story_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '48e01426-3333-4e36-909a-abc3b0d7b4e4'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '48e01426-3333-4e36-909a-abc3b0d7b4e4'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '48e01426-3333-4e36-909a-abc3b0d7b4e4'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_feeling_faces_and_story_books_category.png'
);

-- cat_chunky_crayons_and_big_paper → ember_cat_chunky_crayons_and_big_paper_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '480b287e-66a3-4a3f-bb21-12b9fd00cfbc'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_and_big_paper_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '480b287e-66a3-4a3f-bb21-12b9fd00cfbc'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_and_big_paper_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '480b287e-66a3-4a3f-bb21-12b9fd00cfbc'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_and_big_paper_category.png'
);

-- cat_pouring_cups_and_water_lab → ember_cat_pouring_cups_and_water_lab_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0fd4e043-735e-4af1-a4f4-81672153f89a'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0fd4e043-735e-4af1-a4f4-81672153f89a'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0fd4e043-735e-4af1-a4f4-81672153f89a'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouring_cups_and_water_lab_category.png'
);

-- cat_picture_books_with_little_stories → ember_cat_picture_books_with_little_stories_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ace5d847-b262-4396-b9ca-f90eba8e1ade'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_books_with_little_stories_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ace5d847-b262-4396-b9ca-f90eba8e1ade'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_books_with_little_stories_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ace5d847-b262-4396-b9ca-f90eba8e1ade'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_books_with_little_stories_category.png'
);

-- cat_soft_doll_or_teddy_care_play → ember_cat_soft_doll_or_teddy_care_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1c79622a-d66e-4fee-9806-b6dfcb53b299'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_doll_or_teddy_care_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1c79622a-d66e-4fee-9806-b6dfcb53b299'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_doll_or_teddy_care_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c79622a-d66e-4fee-9806-b6dfcb53b299'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_doll_or_teddy_care_play_category.png'
);

-- cat_hoops_beanbags_and_jump_markers → ember_cat_hoops_beanbags_and_jump_markers_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '9808eced-4e4b-4601-8ee9-7ff4b5bed4d1'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '9808eced-4e4b-4601-8ee9-7ff4b5bed4d1'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9808eced-4e4b-4601-8ee9-7ff4b5bed4d1'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_beanbags_and_jump_markers_category.png'
);

-- cat_safe_step_up_stool_or_learning_tower → ember_cat_safe_step_up_stool_or_learning_tower_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '9cb0e62e-4b5a-49dd-bb5a-600e6724107d'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_step_up_stool_or_learning_tower_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '9cb0e62e-4b5a-49dd-bb5a-600e6724107d'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_step_up_stool_or_learning_tower_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9cb0e62e-4b5a-49dd-bb5a-600e6724107d'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_step_up_stool_or_learning_tower_category.png'
);

-- cat_little_question_prompts → ember_cat_little_question_prompts_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ee464e13-63e2-4822-a230-6dccf5fe9626'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_little_question_prompts_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ee464e13-63e2-4822-a230-6dccf5fe9626'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_little_question_prompts_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ee464e13-63e2-4822-a230-6dccf5fe9626'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_little_question_prompts_category.png'
);

-- cat_toddler_care_set → ember_cat_toddler_care_set_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd04ea03-2107-4580-85d4-2c6873dd3e3d'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_care_set_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd04ea03-2107-4580-85d4-2c6873dd3e3d'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_care_set_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd04ea03-2107-4580-85d4-2c6873dd3e3d'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_care_set_category.png'
);

-- cat_big_balls_for_kicking_and_catching → ember_cat_big_balls_for_kicking_and_catching_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd3455f25-cc87-4467-b421-f20d19b6e8ef'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_balls_for_kicking_and_catching_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd3455f25-cc87-4467-b421-f20d19b6e8ef'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_balls_for_kicking_and_catching_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd3455f25-cc87-4467-b421-f20d19b6e8ef'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_big_balls_for_kicking_and_catching_category.png'
);

-- cat_bath_pouring_set → ember_cat_bath_pouring_set_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '98d10149-aa49-4d17-851a-ca18ef2a19fa'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_pouring_set_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '98d10149-aa49-4d17-851a-ca18ef2a19fa'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_pouring_set_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '98d10149-aa49-4d17-851a-ca18ef2a19fa'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_pouring_set_category.png'
);

-- cat_picture_routines_and_countdown_timer → ember_cat_picture_routines_and_countdown_timer_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '117a3d60-ff5a-45c8-a88a-f2764559b945'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_routines_and_countdown_timer_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '117a3d60-ff5a-45c8-a88a-f2764559b945'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_routines_and_countdown_timer_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '117a3d60-ff5a-45c8-a88a-f2764559b945'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_routines_and_countdown_timer_category.png'
);

-- cat_hoops_and_beanbags → ember_cat_hoops_and_beanbags_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8502e2fd-d1cf-4c2a-aaa3-24eee44c2e1d'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_and_beanbags_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8502e2fd-d1cf-4c2a-aaa3-24eee44c2e1d'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_and_beanbags_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8502e2fd-d1cf-4c2a-aaa3-24eee44c2e1d'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hoops_and_beanbags_category.png'
);

-- cat_soft_dough_and_simple_tools → ember_cat_soft_dough_and_simple_tools_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '598e31f6-f299-4ea8-8823-7816b49c60a2'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_dough_and_simple_tools_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '598e31f6-f299-4ea8-8823-7816b49c60a2'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_dough_and_simple_tools_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '598e31f6-f299-4ea8-8823-7816b49c60a2'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_dough_and_simple_tools_category.png'
);

-- cat_songs_with_actions_and_silly_sounds → ember_cat_songs_with_actions_and_silly_sounds_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5881bd69-c5b6-416e-bd5b-ee0a109c9f10'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5881bd69-c5b6-416e-bd5b-ee0a109c9f10'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5881bd69-c5b6-416e-bd5b-ee0a109c9f10'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_with_actions_and_silly_sounds_category.png'
);

-- cat_first_matching_games → ember_cat_first_matching_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '628b3334-c89f-4614-88b0-be0dc7e69852'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '628b3334-c89f-4614-88b0-be0dc7e69852'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '628b3334-c89f-4614-88b0-be0dc7e69852'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_matching_games_category.png'
);

-- cat_stickers_and_simple_collage → ember_cat_stickers_and_simple_collage_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3c840965-67b9-4c6f-b40c-3c7437f46052'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stickers_and_simple_collage_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3c840965-67b9-4c6f-b40c-3c7437f46052'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stickers_and_simple_collage_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3c840965-67b9-4c6f-b40c-3c7437f46052'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stickers_and_simple_collage_category.png'
);

-- cat_easy_dressing_practice_pieces → ember_cat_easy_dressing_practice_pieces_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2b384f06-6cc6-4542-8436-667bf3a98f64'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2b384f06-6cc6-4542-8436-667bf3a98f64'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2b384f06-6cc6-4542-8436-667bf3a98f64'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_easy_dressing_practice_pieces_category.png'
);

-- cat_play_kitchen_and_home_props → ember_cat_play_kitchen_and_home_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f5e07c6f-789c-49ac-82e4-970f47bbd569'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_and_home_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f5e07c6f-789c-49ac-82e4-970f47bbd569'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_and_home_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f5e07c6f-789c-49ac-82e4-970f47bbd569'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_and_home_props_category.png'
);

-- cat_balance_paths_and_stepping_stones → ember_cat_balance_paths_and_stepping_stones_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '18133693-82db-4506-b98a-411fc82d0958'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '18133693-82db-4506-b98a-411fc82d0958'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '18133693-82db-4506-b98a-411fc82d0958'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_balance_paths_and_stepping_stones_category.png'
);

-- cat_simple_memory_pairs → ember_cat_simple_memory_pairs_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bebdd97f-aa0d-4ce6-b06e-9083743e05bd'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_memory_pairs_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bebdd97f-aa0d-4ce6-b06e-9083743e05bd'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_memory_pairs_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bebdd97f-aa0d-4ce6-b06e-9083743e05bd'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_simple_memory_pairs_category.png'
);

-- cat_peer_play_board_books → ember_cat_peer_play_board_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '14fc3da1-d4b4-443f-8b96-cd2e99ff20d1'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peer_play_board_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '14fc3da1-d4b4-443f-8b96-cd2e99ff20d1'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peer_play_board_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '14fc3da1-d4b4-443f-8b96-cd2e99ff20d1'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peer_play_board_books_category.png'
);

-- cat_washable_paint_and_chunky_brushes → ember_cat_washable_paint_and_chunky_brushes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0575bc3c-5b11-4f3e-9b2b-97ee22ea1153'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_paint_and_chunky_brushes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0575bc3c-5b11-4f3e-9b2b-97ee22ea1153'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_paint_and_chunky_brushes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0575bc3c-5b11-4f3e-9b2b-97ee22ea1153'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_washable_paint_and_chunky_brushes_category.png'
);

-- cat_conversation_picture_cards → ember_cat_conversation_picture_cards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'eefb38af-fa89-4440-a1f8-d582d29213fb'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_conversation_picture_cards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'eefb38af-fa89-4440-a1f8-d582d29213fb'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_conversation_picture_cards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'eefb38af-fa89-4440-a1f8-d582d29213fb'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_conversation_picture_cards_category.png'
);

-- cat_picture_routine_cards_and_timers → ember_cat_picture_routine_cards_and_timers_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '615ccc42-ed28-4db3-bcfc-b425b75f9b1f'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_routine_cards_and_timers_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '615ccc42-ed28-4db3-bcfc-b425b75f9b1f'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_routine_cards_and_timers_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '615ccc42-ed28-4db3-bcfc-b425b75f9b1f'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_routine_cards_and_timers_category.png'
);

-- cat_chunky_lacing_and_threading → ember_cat_chunky_lacing_and_threading_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '68045388-119f-46d2-adc8-febcb488d215'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '68045388-119f-46d2-adc8-febcb488d215'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '68045388-119f-46d2-adc8-febcb488d215'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_lacing_and_threading_category.png'
);

-- cat_sand_and_water_table → ember_cat_sand_and_water_table_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8fb79fe8-e78b-46e4-b626-41a5bb589573'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sand_and_water_table_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8fb79fe8-e78b-46e4-b626-41a5bb589573'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sand_and_water_table_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8fb79fe8-e78b-46e4-b626-41a5bb589573'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sand_and_water_table_category.png'
);

-- cat_pretend_food_and_shopping_basket → ember_cat_pretend_food_and_shopping_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '52714b5e-eaf9-43b4-b0f1-deaf4fbde759'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_food_and_shopping_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '52714b5e-eaf9-43b4-b0f1-deaf4fbde759'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_food_and_shopping_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '52714b5e-eaf9-43b4-b0f1-deaf4fbde759'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_food_and_shopping_basket_category.png'
);

-- cat_trikes_and_beginner_scooters → ember_cat_trikes_and_beginner_scooters_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'e046b17b-dfed-4e41-a5c8-ff309a1d8273'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'e046b17b-dfed-4e41-a5c8-ff309a1d8273'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e046b17b-dfed-4e41-a5c8-ff309a1d8273'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_trikes_and_beginner_scooters_category.png'
);

-- cat_books_about_friends_and_sharing → ember_cat_books_about_friends_and_sharing_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '17e8a1a7-26bc-4f6a-bee6-9064b644ad92'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_books_about_friends_and_sharing_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '17e8a1a7-26bc-4f6a-bee6-9064b644ad92'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_books_about_friends_and_sharing_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '17e8a1a7-26bc-4f6a-bee6-9064b644ad92'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_books_about_friends_and_sharing_category.png'
);

-- cat_toddler_safe_food_prep_tools → ember_cat_toddler_safe_food_prep_tools_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5bef0e21-5456-4a53-8a45-319d640865c1'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_safe_food_prep_tools_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5bef0e21-5456-4a53-8a45-319d640865c1'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_safe_food_prep_tools_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5bef0e21-5456-4a53-8a45-319d640865c1'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_safe_food_prep_tools_category.png'
);

-- cat_low_baskets_and_easy_shelves → ember_cat_low_baskets_and_easy_shelves_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '43a7d453-c470-46bd-8968-b362be57718f'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_baskets_and_easy_shelves_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '43a7d453-c470-46bd-8968-b362be57718f'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_baskets_and_easy_shelves_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '43a7d453-c470-46bd-8968-b362be57718f'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_baskets_and_easy_shelves_category.png'
);

-- cat_small_world_cars_and_garages → ember_cat_small_world_cars_and_garages_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a79f55b2-d1b7-449f-b4e6-d8550a602102'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a79f55b2-d1b7-449f-b4e6-d8550a602102'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a79f55b2-d1b7-449f-b4e6-d8550a602102'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_world_cars_and_garages_category.png'
);

-- cat_playdough_and_messy_tray → ember_cat_playdough_and_messy_tray_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6b41e4f6-97ef-4358-9324-2676f215a70c'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdough_and_messy_tray_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6b41e4f6-97ef-4358-9324-2676f215a70c'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdough_and_messy_tray_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6b41e4f6-97ef-4358-9324-2676f215a70c'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_playdough_and_messy_tray_category.png'
);

-- cat_twist_turn_and_peg_puzzles → ember_cat_twist_turn_and_peg_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '15fb550c-8bfd-4d3d-a88b-6addce81f268'
  AND COALESCE(age_band_id, '__global__') = '31-33m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_twist_turn_and_peg_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '15fb550c-8bfd-4d3d-a88b-6addce81f268'::uuid,
  '31-33m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_twist_turn_and_peg_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '15fb550c-8bfd-4d3d-a88b-6addce81f268'
    AND COALESCE(age_band_id, '__global__') = '31-33m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_twist_turn_and_peg_puzzles_category.png'
);

COMMIT;
