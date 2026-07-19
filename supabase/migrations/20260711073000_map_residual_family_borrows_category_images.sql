-- Family/age-scoped borrows for residual audit gaps.

BEGIN;

-- cat_board_books @ 6-9m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '1c96c630-c8f2-4605-8742-40e3296abfef'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '1c96c630-c8f2-4605-8742-40e3296abfef'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1c96c630-c8f2-4605-8742-40e3296abfef'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_first_spoons_bowls @ 19-21m → ember_cat_first_spoons_bowls_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'::uuid, '19-21m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png');

-- cat_first_spoons_bowls @ 25-27m → ember_cat_first_spoons_bowls_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png');

-- cat_first_spoons_bowls @ 6-9m → ember_cat_first_spoons_bowls_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dad8a6e5-e642-4330-8a18-820ead5b2ac5'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_spoons_bowls_4_6m_category.png');

-- cat_small_object_sweep @ 28-30m → ember_cat_small_object_sweep_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '0de8d58f-8a73-4924-86c5-c09181299170'::uuid, '28-30m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png');

-- cat_small_object_sweep @ 6-9m → ember_cat_small_object_sweep_1_3m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '0de8d58f-8a73-4924-86c5-c09181299170'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0de8d58f-8a73-4924-86c5-c09181299170'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_small_object_sweep_1_3m_category.png');

-- cat_rear_facing_car_seat @ 22-24m → ember_cat_car_seat_size_check_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '303e4833-f4ac-4486-90e0-ddfe5e259a22'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_car_seat_size_check_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '303e4833-f4ac-4486-90e0-ddfe5e259a22'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_car_seat_size_check_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '303e4833-f4ac-4486-90e0-ddfe5e259a22'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_car_seat_size_check_category.png');

-- cat_feelings_faces_books @ 19-21m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '19-21m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_feelings_faces_books @ 22-24m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '22-24m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_feelings_faces_books @ 25-27m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '25-27m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_feelings_faces_books @ 28-30m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '28-30m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_feelings_faces_books @ 34-36m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '34-36m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

-- cat_feelings_faces_books @ 6-9m → ember_cat_board_books_4_6m_category.png
UPDATE public.pl_category_type_images SET is_active = false
WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png';

INSERT INTO public.pl_category_type_images (category_type_id, age_band_id, image_url, alt, is_active, sort)
SELECT '314cee75-1e7b-4489-a789-c178109feb41'::uuid, '6-9m', 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png', NULL, true, 0
WHERE NOT EXISTS (SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '314cee75-1e7b-4489-a789-c178109feb41'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_board_books_4_6m_category.png');

COMMIT;
