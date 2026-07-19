-- Map residual gaps to age-scoped sibling Storage files (1-3m / 4-6m precedents).

BEGIN;

-- cat_safe_floor_space @ 6-9m → ember_cat_safe_floor_space_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'daacc440-a3e7-4320-a7a9-7eb24df82da3'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_floor_space_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'daacc440-a3e7-4320-a7a9-7eb24df82da3'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_floor_space_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'daacc440-a3e7-4320-a7a9-7eb24df82da3'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_floor_space_1_3m_category.png');

-- cat_pull_out_tissue_box @ 6-9m → ember_cat_pull_out_tissue_box_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'e8c617f6-984e-4741-af0f-7e342d8e03e0'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_out_tissue_box_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'e8c617f6-984e-4741-af0f-7e342d8e03e0'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_out_tissue_box_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'e8c617f6-984e-4741-af0f-7e342d8e03e0'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_out_tissue_box_4_6m_category.png');

-- cat_highchair @ 6-9m → ember_cat_highchair_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '499cab91-4e58-443f-9ae5-749d4dffa05f'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_highchair_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '499cab91-4e58-443f-9ae5-749d4dffa05f'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_highchair_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '499cab91-4e58-443f-9ae5-749d4dffa05f'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_highchair_4_6m_category.png');

-- cat_teethers @ 6-9m → ember_cat_teethers_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'cbfb9548-bea3-4d7e-828f-503c11e8f388'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teethers_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'cbfb9548-bea3-4d7e-828f-503c11e8f388'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teethers_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cbfb9548-bea3-4d7e-828f-503c11e8f388'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_teethers_4_6m_category.png');

-- cat_tummy_time_wobbler @ 6-9m → ember_cat_tummy_time_wobbler_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '9a0fa048-9f92-44f5-89a3-a97f180a7227'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_wobbler_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '9a0fa048-9f92-44f5-89a3-a97f180a7227'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_wobbler_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9a0fa048-9f92-44f5-89a3-a97f180a7227'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tummy_time_wobbler_4_6m_category.png');

-- cat_sound_cylinders_shakers @ 6-9m → ember_cat_sound_cylinders_shakers_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '98a11544-d7c5-4285-830e-1d74e492f529'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sound_cylinders_shakers_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '98a11544-d7c5-4285-830e-1d74e492f529'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sound_cylinders_shakers_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '98a11544-d7c5-4285-830e-1d74e492f529'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sound_cylinders_shakers_4_6m_category.png');

-- cat_texture_cards_books @ 6-9m → ember_cat_texture_cards_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '5cce1d96-1056-4795-8e32-c129f03bbcbc'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_cards_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '5cce1d96-1056-4795-8e32-c129f03bbcbc'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_cards_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5cce1d96-1056-4795-8e32-c129f03bbcbc'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_cards_books_4_6m_category.png');

-- cat_open_cup @ 19-21m → ember_cat_open_cup_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'::uuid, '19-21m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png');

-- cat_open_cup @ 22-24m → ember_cat_open_cup_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png');

-- cat_open_cup @ 6-9m → ember_cat_open_cup_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c309beb1-58c1-4e17-bd4e-0e387b7d7b82'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_open_cup_4_6m_category.png');

-- cat_cleanable_sensory_toys @ 6-9m → ember_cat_cleanable_sensory_toys_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'b6fa74a6-c87f-4a9e-8a6a-a9573dba1618'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanable_sensory_toys_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'b6fa74a6-c87f-4a9e-8a6a-a9573dba1618'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanable_sensory_toys_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b6fa74a6-c87f-4a9e-8a6a-a9573dba1618'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanable_sensory_toys_4_6m_category.png');

-- cat_songs_action_games @ 19-21m → ember_cat_songs_action_games_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c29c77b5-ce58-44a1-b8e6-638b150d7132'::uuid, '19-21m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png');

-- cat_songs_action_games @ 25-27m → ember_cat_songs_action_games_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c29c77b5-ce58-44a1-b8e6-638b150d7132'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png');

-- cat_songs_action_games @ 28-30m → ember_cat_songs_action_games_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c29c77b5-ce58-44a1-b8e6-638b150d7132'::uuid, '28-30m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png');

-- cat_songs_action_games @ 34-36m → ember_cat_songs_action_games_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c29c77b5-ce58-44a1-b8e6-638b150d7132'::uuid, '34-36m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png');

-- cat_songs_action_games @ 6-9m → ember_cat_songs_action_games_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'c29c77b5-ce58-44a1-b8e6-638b150d7132'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c29c77b5-ce58-44a1-b8e6-638b150d7132'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_songs_action_games_4_6m_category.png');

-- cat_weaning_bibs_mat @ 6-9m → ember_cat_weaning_bibs_mat_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '14f2cfcb-18eb-42fe-9c3f-c7c211a98fda'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_weaning_bibs_mat_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '14f2cfcb-18eb-42fe-9c3f-c7c211a98fda'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_weaning_bibs_mat_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '14f2cfcb-18eb-42fe-9c3f-c7c211a98fda'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_weaning_bibs_mat_4_6m_category.png');

-- cat_safe_household_objects @ 6-9m → ember_cat_safe_household_objects_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '78b4f5b1-e47a-4ef0-bdf2-2c1763666f37'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '78b4f5b1-e47a-4ef0-bdf2-2c1763666f37'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '78b4f5b1-e47a-4ef0-bdf2-2c1763666f37'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_household_objects_4_6m_category.png');

-- cat_button_battery_check @ 19-21m → ember_cat_button_battery_check_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid, '19-21m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png');

-- cat_button_battery_check @ 22-24m → ember_cat_button_battery_check_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png');

-- cat_button_battery_check @ 25-27m → ember_cat_button_battery_check_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png');

-- cat_button_battery_check @ 28-30m → ember_cat_button_battery_check_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid, '28-30m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png');

-- cat_button_battery_check @ 34-36m → ember_cat_button_battery_check_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid, '34-36m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png');

-- cat_button_battery_check @ 6-9m → ember_cat_button_battery_check_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '475b1492-e629-4816-8d26-4897eb6a9f0e'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '475b1492-e629-4816-8d26-4897eb6a9f0e'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_button_battery_check_1_3m_category.png');

-- cat_allergen_tracking @ 6-9m → ember_cat_allergen_tracking_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'a22cc1ad-4bf7-4c48-807d-04683f34a685'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_allergen_tracking_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'a22cc1ad-4bf7-4c48-807d-04683f34a685'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_allergen_tracking_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a22cc1ad-4bf7-4c48-807d-04683f34a685'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_allergen_tracking_4_6m_category.png');

-- cat_safe_sleep_continuity @ 22-24m → ember_cat_safe_sleep_continuity_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_4_6m_category.png');

-- cat_safe_sleep_continuity @ 6-9m → ember_cat_safe_sleep_continuity_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd07913e8-1fb1-4dbc-8fe5-619345691dd6'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_sleep_continuity_4_6m_category.png');

-- cat_room_thermometer @ 4-6m → ember_cat_room_thermometer_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '029aa19b-00d6-467d-a8ff-c877b8c7670b'
  AND COALESCE(age_band_id, '__global__') = '4-6m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_room_thermometer_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '029aa19b-00d6-467d-a8ff-c877b8c7670b'::uuid, '4-6m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_room_thermometer_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '029aa19b-00d6-467d-a8ff-c877b8c7670b'
    AND COALESCE(age_band_id, '__global__') = '4-6m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_room_thermometer_1_3m_category.png');

COMMIT;
