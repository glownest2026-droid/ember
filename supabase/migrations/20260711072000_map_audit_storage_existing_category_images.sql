-- Map Stage 2 cards: Storage exists (audit map_existing), DB row missing.

BEGIN;

-- cat_reach_grab_toys @ 1-3m → ember_cat_reach_grab_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '04d51d9f-3911-4fba-b0ce-c422a6e8b8c0'
  AND COALESCE(age_band_id, '__global__') = '1-3m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_grab_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '04d51d9f-3911-4fba-b0ce-c422a6e8b8c0'::uuid,
  '1-3m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_grab_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '04d51d9f-3911-4fba-b0ce-c422a6e8b8c0'
    AND COALESCE(age_band_id, '__global__') = '1-3m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_grab_toys_category.png'
);

-- cat_posting_boxes @ 13-15m → ember_cat_posting_boxes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f7b08527-63ac-4300-bb6e-c4c06cc8a4f3'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_boxes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f7b08527-63ac-4300-bb6e-c4c06cc8a4f3'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_boxes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f7b08527-63ac-4300-bb6e-c4c06cc8a4f3'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_boxes_category.png'
);

-- cat_chunky_crayons @ 13-15m → ember_cat_chunky_crayons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '315365c1-dc1b-4058-ab64-d03282aeeeea'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png'
);

-- cat_shape_peg_puzzles @ 13-15m → ember_cat_shape_peg_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1de6263d-4955-42fc-8c76-fe1431fe8ea7'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_peg_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1de6263d-4955-42fc-8c76-fe1431fe8ea7'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_peg_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1de6263d-4955-42fc-8c76-fe1431fe8ea7'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_peg_puzzles_category.png'
);

-- cat_stair_gates @ 13-15m → ember_cat_stair_gates_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ef3ca71f-076e-405a-a293-dfc26ece896c'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png'
);

-- cat_stacking_nesting_cups @ 13-15m → ember_cat_stacking_nesting_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
  AND COALESCE(age_band_id, '__global__') = '13-15m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f65c860e-5c79-4339-b57f-54425ffd0491'::uuid,
  '13-15m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
    AND COALESCE(age_band_id, '__global__') = '13-15m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png'
);

-- cat_ramp_rolling_toys @ 16-18m → ember_cat_ramp_rolling_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2fa3c4f6-4e68-40a9-8dde-71708585400c'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ramp_rolling_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2fa3c4f6-4e68-40a9-8dde-71708585400c'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ramp_rolling_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2fa3c4f6-4e68-40a9-8dde-71708585400c'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ramp_rolling_toys_category.png'
);

-- cat_doll_soft_toy_care @ 16-18m → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af0295d0-5072-45ca-837b-f629c62cbff6'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_first_word_picture_books @ 16-18m → ember_cat_first_word_picture_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ac27015e-4a15-4828-8923-4ae4d6b716b7'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_picture_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ac27015e-4a15-4828-8923-4ae4d6b716b7'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_picture_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ac27015e-4a15-4828-8923-4ae4d6b716b7'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_picture_books_category.png'
);

-- cat_stair_gates @ 16-18m → ember_cat_stair_gates_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ef3ca71f-076e-405a-a293-dfc26ece896c'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png'
);

-- cat_soft_graspable_balls @ 16-18m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_chunky_crayons @ 16-18m → ember_cat_chunky_crayons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '315365c1-dc1b-4058-ab64-d03282aeeeea'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png'
);

-- cat_cupboard_locks @ 16-18m → ember_cat_cupboard_locks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ab2bc7cb-3296-4047-a948-863d90daa783'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png'
);

-- cat_toy_cups_spoons @ 16-18m → ember_cat_toy_cups_spoons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png'
);

-- cat_water_drawing @ 16-18m → ember_cat_water_drawing_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b7626461-4419-406c-a792-7e7e0f1c20fb'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_drawing_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b7626461-4419-406c-a792-7e7e0f1c20fb'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_drawing_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b7626461-4419-406c-a792-7e7e0f1c20fb'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_drawing_category.png'
);

-- cat_push_pull_toys @ 16-18m → ember_cat_push_pull_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '990ea45e-1186-417b-94ef-d17970b8eba5'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '990ea45e-1186-417b-94ef-d17970b8eba5'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '990ea45e-1186-417b-94ef-d17970b8eba5'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_toys_category.png'
);

-- cat_body_part_books_games @ 16-18m → ember_cat_body_part_books_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2dc9cc38-631c-493d-afa4-3237dc00b0ef'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2dc9cc38-631c-493d-afa4-3237dc00b0ef'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2dc9cc38-631c-493d-afa4-3237dc00b0ef'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png'
);

-- cat_posting_drop_boxes @ 16-18m → ember_cat_posting_drop_boxes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '08a7046f-cacd-49ca-95a6-80f8e17e3bbf'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_drop_boxes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '08a7046f-cacd-49ca-95a6-80f8e17e3bbf'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_drop_boxes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '08a7046f-cacd-49ca-95a6-80f8e17e3bbf'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_drop_boxes_category.png'
);

-- cat_low_climb_tunnel @ 16-18m → ember_cat_low_climb_tunnel_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '63fae8f0-e1ac-4996-83de-9d5c0d446e86'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_climb_tunnel_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '63fae8f0-e1ac-4996-83de-9d5c0d446e86'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_climb_tunnel_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '63fae8f0-e1ac-4996-83de-9d5c0d446e86'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_climb_tunnel_category.png'
);

-- cat_shape_sorters_puzzles @ 16-18m → ember_cat_shape_sorters_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dd67d87f-0f41-4c7a-8799-524b49b9af80'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png'
);

-- cat_finger_food_snack_prep @ 16-18m → ember_cat_finger_food_snack_prep_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7c39255f-216d-49ad-8361-fa112764f70a'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_snack_prep_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7c39255f-216d-49ad-8361-fa112764f70a'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_snack_prep_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7c39255f-216d-49ad-8361-fa112764f70a'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_snack_prep_category.png'
);

-- cat_furniture_window_checks @ 16-18m → ember_cat_furniture_window_checks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png'
);

-- cat_play_dough_soft_clay @ 16-18m → ember_cat_play_dough_soft_clay_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '51070dcd-3af3-41a6-80ba-a8d9e6f4d36a'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_dough_soft_clay_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '51070dcd-3af3-41a6-80ba-a8d9e6f4d36a'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_dough_soft_clay_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '51070dcd-3af3-41a6-80ba-a8d9e6f4d36a'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_dough_soft_clay_category.png'
);

-- cat_latch_busy_boards @ 16-18m → ember_cat_latch_busy_boards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png'
);

-- cat_play_kitchen_household_props @ 16-18m → ember_cat_play_kitchen_household_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png'
);

-- cat_velcro_pull_hide @ 16-18m → ember_cat_velcro_pull_hide_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8c15be9d-3fe4-4ec0-9370-04a8ce2a5c9c'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_velcro_pull_hide_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8c15be9d-3fe4-4ec0-9370-04a8ce2a5c9c'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_velcro_pull_hide_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8c15be9d-3fe4-4ec0-9370-04a8ce2a5c9c'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_velcro_pull_hide_category.png'
);

-- cat_naming_walks @ 16-18m → ember_cat_naming_walks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png'
);

-- cat_toddler_bag_carry @ 16-18m → ember_cat_toddler_bag_carry_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '691a9db6-36d9-4399-bf38-98b91bfa0c58'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_bag_carry_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '691a9db6-36d9-4399-bf38-98b91bfa0c58'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_bag_carry_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '691a9db6-36d9-4399-bf38-98b91bfa0c58'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_bag_carry_category.png'
);

-- cat_stacking_nesting_cups @ 16-18m → ember_cat_stacking_nesting_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f65c860e-5c79-4339-b57f-54425ffd0491'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png'
);

-- cat_toothbrush_routine @ 16-18m → ember_cat_toothbrush_routine_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dc9ea1e9-5da4-4f4b-896c-62843a479db6'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_routine_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dc9ea1e9-5da4-4f4b-896c-62843a479db6'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_routine_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dc9ea1e9-5da4-4f4b-896c-62843a479db6'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_routine_category.png'
);

-- cat_texture_tubs @ 16-18m → ember_cat_texture_tubs_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '57df56e7-feca-4dc7-a505-feb6e8309e65'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_tubs_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '57df56e7-feca-4dc7-a505-feb6e8309e65'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_tubs_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '57df56e7-feca-4dc7-a505-feb6e8309e65'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_tubs_category.png'
);

-- cat_bath_water_supervision @ 16-18m → ember_cat_bath_water_supervision_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cfed9284-aef5-4ff8-9150-20463cb9b603'
  AND COALESCE(age_band_id, '__global__') = '16-18m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cfed9284-aef5-4ff8-9150-20463cb9b603'::uuid,
  '16-18m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cfed9284-aef5-4ff8-9150-20463cb9b603'
    AND COALESCE(age_band_id, '__global__') = '16-18m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png'
);

-- cat_doll_soft_toy_care @ 19-21m → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af0295d0-5072-45ca-837b-f629c62cbff6'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_safety_gates @ 19-21m → ember_cat_safety_gates_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '9884ab18-4776-4e1b-ab78-76d791786ed4'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safety_gates_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '9884ab18-4776-4e1b-ab78-76d791786ed4'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safety_gates_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9884ab18-4776-4e1b-ab78-76d791786ed4'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safety_gates_category.png'
);

-- cat_soft_graspable_balls @ 19-21m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_first_word_picture_books @ 19-21m → ember_cat_first_word_picture_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ac27015e-4a15-4828-8923-4ae4d6b716b7'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_picture_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ac27015e-4a15-4828-8923-4ae4d6b716b7'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_picture_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ac27015e-4a15-4828-8923-4ae4d6b716b7'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_picture_books_category.png'
);

-- cat_shape_sorters_puzzles @ 19-21m → ember_cat_shape_sorters_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dd67d87f-0f41-4c7a-8799-524b49b9af80'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png'
);

-- cat_toy_cups_spoons @ 19-21m → ember_cat_toy_cups_spoons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png'
);

-- cat_cupboard_locks @ 19-21m → ember_cat_cupboard_locks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ab2bc7cb-3296-4047-a948-863d90daa783'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png'
);

-- cat_pull_push_toys @ 19-21m → ember_cat_pull_push_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2874d8e8-4f6b-4103-a40a-793863fdc0ef'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_push_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2874d8e8-4f6b-4103-a40a-793863fdc0ef'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_push_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2874d8e8-4f6b-4103-a40a-793863fdc0ef'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_push_toys_category.png'
);

-- cat_body_part_books_games @ 19-21m → ember_cat_body_part_books_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2dc9cc38-631c-493d-afa4-3237dc00b0ef'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2dc9cc38-631c-493d-afa4-3237dc00b0ef'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2dc9cc38-631c-493d-afa4-3237dc00b0ef'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png'
);

-- cat_play_kitchen_household_props @ 19-21m → ember_cat_play_kitchen_household_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png'
);

-- cat_naming_walks @ 19-21m → ember_cat_naming_walks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png'
);

-- cat_routine_songs @ 19-21m → ember_cat_routine_songs_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '99cef4c1-c78e-467d-8517-56484db223fa'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_routine_songs_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '99cef4c1-c78e-467d-8517-56484db223fa'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_routine_songs_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '99cef4c1-c78e-467d-8517-56484db223fa'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_routine_songs_category.png'
);

-- cat_low_climb_tunnel @ 19-21m → ember_cat_low_climb_tunnel_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '63fae8f0-e1ac-4996-83de-9d5c0d446e86'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_climb_tunnel_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '63fae8f0-e1ac-4996-83de-9d5c0d446e86'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_climb_tunnel_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '63fae8f0-e1ac-4996-83de-9d5c0d446e86'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_climb_tunnel_category.png'
);

-- cat_furniture_window_checks @ 19-21m → ember_cat_furniture_window_checks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png'
);

-- cat_finger_food_snack_prep @ 19-21m → ember_cat_finger_food_snack_prep_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7c39255f-216d-49ad-8361-fa112764f70a'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_snack_prep_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7c39255f-216d-49ad-8361-fa112764f70a'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_snack_prep_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7c39255f-216d-49ad-8361-fa112764f70a'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_snack_prep_category.png'
);

-- cat_posting_drop_boxes @ 19-21m → ember_cat_posting_drop_boxes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '08a7046f-cacd-49ca-95a6-80f8e17e3bbf'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_drop_boxes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '08a7046f-cacd-49ca-95a6-80f8e17e3bbf'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_drop_boxes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '08a7046f-cacd-49ca-95a6-80f8e17e3bbf'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_drop_boxes_category.png'
);

-- cat_toddler_bag_carry @ 19-21m → ember_cat_toddler_bag_carry_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '691a9db6-36d9-4399-bf38-98b91bfa0c58'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_bag_carry_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '691a9db6-36d9-4399-bf38-98b91bfa0c58'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_bag_carry_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '691a9db6-36d9-4399-bf38-98b91bfa0c58'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_bag_carry_category.png'
);

-- cat_comfort_toy @ 19-21m → ember_cat_comfort_toy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '34794a43-a195-49ca-95de-8e045cb9b5a8'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_comfort_toy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '34794a43-a195-49ca-95de-8e045cb9b5a8'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_comfort_toy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '34794a43-a195-49ca-95de-8e045cb9b5a8'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_comfort_toy_category.png'
);

-- cat_latch_busy_boards @ 19-21m → ember_cat_latch_busy_boards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png'
);

-- cat_bath_water_supervision @ 19-21m → ember_cat_bath_water_supervision_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cfed9284-aef5-4ff8-9150-20463cb9b603'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cfed9284-aef5-4ff8-9150-20463cb9b603'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cfed9284-aef5-4ff8-9150-20463cb9b603'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png'
);

-- cat_park_swing_walks @ 19-21m → ember_cat_park_swing_walks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5f67eadc-3d94-4b15-9295-220dd992a5ca'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swing_walks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5f67eadc-3d94-4b15-9295-220dd992a5ca'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swing_walks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5f67eadc-3d94-4b15-9295-220dd992a5ca'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swing_walks_category.png'
);

-- cat_chunky_crayons @ 19-21m → ember_cat_chunky_crayons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '315365c1-dc1b-4058-ab64-d03282aeeeea'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png'
);

-- cat_stacking_nesting_cups @ 19-21m → ember_cat_stacking_nesting_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
  AND COALESCE(age_band_id, '__global__') = '19-21m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f65c860e-5c79-4339-b57f-54425ffd0491'::uuid,
  '19-21m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
    AND COALESCE(age_band_id, '__global__') = '19-21m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png'
);

-- cat_furniture_window_checks @ 22-24m → ember_cat_furniture_window_checks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png'
);

-- cat_play_kitchen_household_props @ 22-24m → ember_cat_play_kitchen_household_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png'
);

-- cat_shape_peg_puzzles @ 22-24m → ember_cat_shape_peg_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1de6263d-4955-42fc-8c76-fe1431fe8ea7'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_peg_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1de6263d-4955-42fc-8c76-fe1431fe8ea7'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_peg_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1de6263d-4955-42fc-8c76-fe1431fe8ea7'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_peg_puzzles_category.png'
);

-- cat_stair_gates @ 22-24m → ember_cat_stair_gates_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ef3ca71f-076e-405a-a293-dfc26ece896c'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png'
);

-- cat_doll_soft_toy_care @ 22-24m → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af0295d0-5072-45ca-837b-f629c62cbff6'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_cupboard_locks @ 22-24m → ember_cat_cupboard_locks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ab2bc7cb-3296-4047-a948-863d90daa783'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png'
);

-- cat_naming_walks @ 22-24m → ember_cat_naming_walks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c55d6e31-f536-42bb-a8cf-eac54a6e9c62'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png'
);

-- cat_cleanup_basket @ 22-24m → ember_cat_cleanup_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd639aa7f-3c6d-4f4b-a32a-a98e4738c8b4'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanup_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd639aa7f-3c6d-4f4b-a32a-a98e4738c8b4'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanup_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd639aa7f-3c6d-4f4b-a32a-a98e4738c8b4'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanup_basket_category.png'
);

-- cat_puppets @ 22-24m → ember_cat_puppets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5dd73eb4-0216-4d7a-9ca8-98a3c4796bd8'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_puppets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5dd73eb4-0216-4d7a-9ca8-98a3c4796bd8'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_puppets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5dd73eb4-0216-4d7a-9ca8-98a3c4796bd8'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_puppets_category.png'
);

-- cat_toothbrush_routine @ 22-24m → ember_cat_toothbrush_routine_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dc9ea1e9-5da4-4f4b-896c-62843a479db6'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_routine_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dc9ea1e9-5da4-4f4b-896c-62843a479db6'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_routine_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dc9ea1e9-5da4-4f4b-896c-62843a479db6'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_routine_category.png'
);

-- cat_tiny_choice_moments @ 22-24m → ember_cat_tiny_choice_moments_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd9c089b7-b8c9-4f54-9238-b17c922db5f0'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choice_moments_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd9c089b7-b8c9-4f54-9238-b17c922db5f0'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choice_moments_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd9c089b7-b8c9-4f54-9238-b17c922db5f0'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tiny_choice_moments_category.png'
);

-- cat_body_part_books_games @ 22-24m → ember_cat_body_part_books_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '2dc9cc38-631c-493d-afa4-3237dc00b0ef'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '2dc9cc38-631c-493d-afa4-3237dc00b0ef'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '2dc9cc38-631c-493d-afa4-3237dc00b0ef'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png'
);

-- cat_walk_with_job @ 22-24m → ember_cat_walk_with_job_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '629b2e06-6ad9-4e6e-9a88-d4b766245e1b'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_walk_with_job_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '629b2e06-6ad9-4e6e-9a88-d4b766245e1b'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_walk_with_job_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '629b2e06-6ad9-4e6e-9a88-d4b766245e1b'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_walk_with_job_category.png'
);

-- cat_latch_busy_boards @ 22-24m → ember_cat_latch_busy_boards_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f11ad2ba-93d8-460f-ab83-48231fa0f1a9'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png'
);

-- cat_blind_cord_cleats @ 22-24m → ember_cat_blind_cord_cleats_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3fea4f0a-623e-4d7e-bc62-902553cce684'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3fea4f0a-623e-4d7e-bc62-902553cce684'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3fea4f0a-623e-4d7e-bc62-902553cce684'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png'
);

-- cat_bath_supervision @ 22-24m → ember_cat_bath_supervision_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3faf02a5-c0c7-46d0-9f75-122a4abd799e'
  AND COALESCE(age_band_id, '__global__') = '22-24m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_supervision_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3faf02a5-c0c7-46d0-9f75-122a4abd799e'::uuid,
  '22-24m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_supervision_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3faf02a5-c0c7-46d0-9f75-122a4abd799e'
    AND COALESCE(age_band_id, '__global__') = '22-24m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_supervision_category.png'
);

-- cat_play_kitchen_household_props @ 25-27m → ember_cat_play_kitchen_household_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png'
);

-- cat_shape_sorters_puzzles @ 25-27m → ember_cat_shape_sorters_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dd67d87f-0f41-4c7a-8799-524b49b9af80'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png'
);

-- cat_doll_soft_toy_care @ 25-27m → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af0295d0-5072-45ca-837b-f629c62cbff6'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_toy_cups_spoons @ 25-27m → ember_cat_toy_cups_spoons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png'
);

-- cat_chunky_crayons @ 25-27m → ember_cat_chunky_crayons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '315365c1-dc1b-4058-ab64-d03282aeeeea'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png'
);

-- cat_furniture_window_checks @ 25-27m → ember_cat_furniture_window_checks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png'
);

-- cat_soft_graspable_balls @ 25-27m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_bedtime_board_books @ 25-27m → ember_cat_bedtime_board_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'bc4648b8-2510-453b-9848-5c26fa5f6d6e'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bedtime_board_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'bc4648b8-2510-453b-9848-5c26fa5f6d6e'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bedtime_board_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'bc4648b8-2510-453b-9848-5c26fa5f6d6e'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bedtime_board_books_category.png'
);

-- cat_comfort_toy @ 25-27m → ember_cat_comfort_toy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '34794a43-a195-49ca-95de-8e045cb9b5a8'
  AND COALESCE(age_band_id, '__global__') = '25-27m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_comfort_toy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '34794a43-a195-49ca-95de-8e045cb9b5a8'::uuid,
  '25-27m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_comfort_toy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '34794a43-a195-49ca-95de-8e045cb9b5a8'
    AND COALESCE(age_band_id, '__global__') = '25-27m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_comfort_toy_category.png'
);

-- cat_shape_sorters_puzzles @ 28-30m → ember_cat_shape_sorters_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dd67d87f-0f41-4c7a-8799-524b49b9af80'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dd67d87f-0f41-4c7a-8799-524b49b9af80'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png'
);

-- cat_play_kitchen_household_props @ 28-30m → ember_cat_play_kitchen_household_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png'
);

-- cat_doll_soft_toy_care @ 28-30m → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af0295d0-5072-45ca-837b-f629c62cbff6'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_soft_graspable_balls @ 28-30m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_toy_cups_spoons @ 28-30m → ember_cat_toy_cups_spoons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'dee7f125-cb1c-4252-a01c-b668fa2f4aa4'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png'
);

-- cat_furniture_window_checks @ 28-30m → ember_cat_furniture_window_checks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1bb27946-4bb2-4b9d-b5e9-759ca5860c73'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png'
);

-- cat_toy_rotation @ 28-30m → ember_cat_toy_rotation_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6b1069fa-1de6-4fe8-843b-b537e489bad1'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_rotation_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6b1069fa-1de6-4fe8-843b-b537e489bad1'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_rotation_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6b1069fa-1de6-4fe8-843b-b537e489bad1'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_rotation_category.png'
);

-- cat_chunky_crayons @ 28-30m → ember_cat_chunky_crayons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
  AND COALESCE(age_band_id, '__global__') = '28-30m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '315365c1-dc1b-4058-ab64-d03282aeeeea'::uuid,
  '28-30m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
    AND COALESCE(age_band_id, '__global__') = '28-30m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png'
);

-- cat_chunky_crayons @ 34-36m → ember_cat_chunky_crayons_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '315365c1-dc1b-4058-ab64-d03282aeeeea'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '315365c1-dc1b-4058-ab64-d03282aeeeea'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png'
);

-- cat_doll_soft_toy_care @ 34-36m → ember_cat_doll_soft_toy_care_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af0295d0-5072-45ca-837b-f629c62cbff6'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af0295d0-5072-45ca-837b-f629c62cbff6'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'
);

-- cat_cleanup_basket @ 34-36m → ember_cat_cleanup_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd639aa7f-3c6d-4f4b-a32a-a98e4738c8b4'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanup_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd639aa7f-3c6d-4f4b-a32a-a98e4738c8b4'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanup_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd639aa7f-3c6d-4f4b-a32a-a98e4738c8b4'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanup_basket_category.png'
);

-- cat_play_kitchen_household_props @ 34-36m → ember_cat_play_kitchen_household_props_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3ee380fa-ded8-416d-a7f0-23fa16b0ce88'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png'
);

-- cat_play_dough_soft_clay @ 34-36m → ember_cat_play_dough_soft_clay_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '51070dcd-3af3-41a6-80ba-a8d9e6f4d36a'
  AND COALESCE(age_band_id, '__global__') = '34-36m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_dough_soft_clay_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '51070dcd-3af3-41a6-80ba-a8d9e6f4d36a'::uuid,
  '34-36m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_dough_soft_clay_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '51070dcd-3af3-41a6-80ba-a8d9e6f4d36a'
    AND COALESCE(age_band_id, '__global__') = '34-36m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_dough_soft_clay_category.png'
);

-- cat_sitting_play_mat @ 6-9m → ember_cat_sitting_play_mat_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0e755882-ba6b-4ca5-96ef-945321249635'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sitting_play_mat_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0e755882-ba6b-4ca5-96ef-945321249635'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sitting_play_mat_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0e755882-ba6b-4ca5-96ef-945321249635'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sitting_play_mat_category.png'
);

-- cat_peekaboo_scarf @ 6-9m → ember_cat_peekaboo_scarf_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a2f31ae2-5244-4d98-ade3-a6aafbc74efb'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peekaboo_scarf_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a2f31ae2-5244-4d98-ade3-a6aafbc74efb'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peekaboo_scarf_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a2f31ae2-5244-4d98-ade3-a6aafbc74efb'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peekaboo_scarf_category.png'
);

-- cat_safety_gates @ 6-9m → ember_cat_safety_gates_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '9884ab18-4776-4e1b-ab78-76d791786ed4'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safety_gates_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '9884ab18-4776-4e1b-ab78-76d791786ed4'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safety_gates_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '9884ab18-4776-4e1b-ab78-76d791786ed4'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safety_gates_category.png'
);

-- cat_stacking_nesting_cups @ 6-9m → ember_cat_stacking_nesting_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f65c860e-5c79-4339-b57f-54425ffd0491'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png'
);

-- cat_cupboard_locks @ 6-9m → ember_cat_cupboard_locks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ab2bc7cb-3296-4047-a948-863d90daa783'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png'
);

-- cat_object_permanence_box @ 6-9m → ember_cat_object_permanence_box_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cb87fcdc-66bb-4cc2-bd8b-55e78bd438b8'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_object_permanence_box_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cb87fcdc-66bb-4cc2-bd8b-55e78bd438b8'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_object_permanence_box_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cb87fcdc-66bb-4cc2-bd8b-55e78bd438b8'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_object_permanence_box_category.png'
);

-- cat_reach_grab_toys @ 6-9m → ember_cat_reach_grab_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '04d51d9f-3911-4fba-b0ce-c422a6e8b8c0'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_grab_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '04d51d9f-3911-4fba-b0ce-c422a6e8b8c0'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_grab_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '04d51d9f-3911-4fba-b0ce-c422a6e8b8c0'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_reach_grab_toys_category.png'
);

-- cat_treasure_basket @ 6-9m → ember_cat_treasure_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '7fb7727f-0320-4d65-967c-705325dc0a99'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_treasure_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '7fb7727f-0320-4d65-967c-705325dc0a99'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_treasure_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '7fb7727f-0320-4d65-967c-705325dc0a99'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_treasure_basket_category.png'
);

-- cat_hand_transfer_toys @ 6-9m → ember_cat_hand_transfer_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fdb7bcc5-ff42-48fb-8ac3-9f198da1bbb4'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hand_transfer_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fdb7bcc5-ff42-48fb-8ac3-9f198da1bbb4'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hand_transfer_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fdb7bcc5-ff42-48fb-8ac3-9f198da1bbb4'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hand_transfer_toys_category.png'
);

-- cat_soft_graspable_balls @ 6-9m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_first_puzzle @ 6-9m → ember_cat_first_puzzle_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '97be5e74-befc-47ed-95b2-3444439b017c'
  AND COALESCE(age_band_id, '__global__') = '6-9m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzle_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '97be5e74-befc-47ed-95b2-3444439b017c'::uuid,
  '6-9m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzle_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '97be5e74-befc-47ed-95b2-3444439b017c'
    AND COALESCE(age_band_id, '__global__') = '6-9m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzle_category.png'
);

-- cat_stair_gates @ 9-12m → ember_cat_stair_gates_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ef3ca71f-076e-405a-a293-dfc26ece896c'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ef3ca71f-076e-405a-a293-dfc26ece896c'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png'
);

-- cat_floor_zone @ 9-12m → ember_cat_floor_zone_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ff5b6588-2896-4a43-8085-94f40cf9042a'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_floor_zone_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ff5b6588-2896-4a43-8085-94f40cf9042a'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_floor_zone_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ff5b6588-2896-4a43-8085-94f40cf9042a'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_floor_zone_category.png'
);

-- cat_pincer_puzzle @ 9-12m → ember_cat_pincer_puzzle_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '69c48be5-04d3-4dfd-bb08-a7bed9a8e2e3'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pincer_puzzle_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '69c48be5-04d3-4dfd-bb08-a7bed9a8e2e3'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pincer_puzzle_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '69c48be5-04d3-4dfd-bb08-a7bed9a8e2e3'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pincer_puzzle_category.png'
);

-- cat_peekaboo_scarf @ 9-12m → ember_cat_peekaboo_scarf_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'a2f31ae2-5244-4d98-ade3-a6aafbc74efb'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peekaboo_scarf_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'a2f31ae2-5244-4d98-ade3-a6aafbc74efb'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peekaboo_scarf_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'a2f31ae2-5244-4d98-ade3-a6aafbc74efb'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peekaboo_scarf_category.png'
);

-- cat_pram_walks @ 9-12m → ember_cat_pram_walks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '00761e08-df5b-479f-a2b0-db131f2c9322'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pram_walks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '00761e08-df5b-479f-a2b0-db131f2c9322'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pram_walks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '00761e08-df5b-479f-a2b0-db131f2c9322'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pram_walks_category.png'
);

-- cat_library_baby_group @ 9-12m → ember_cat_library_baby_group_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '835b99db-c6b0-4d80-9857-1939cad8a28d'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_baby_group_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '835b99db-c6b0-4d80-9857-1939cad8a28d'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_baby_group_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '835b99db-c6b0-4d80-9857-1939cad8a28d'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_baby_group_category.png'
);

-- cat_rhyme_games @ 9-12m → ember_cat_rhyme_games_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'af6f3a7d-336c-4e1d-abd0-8c8ea6997419'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rhyme_games_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'af6f3a7d-336c-4e1d-abd0-8c8ea6997419'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rhyme_games_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'af6f3a7d-336c-4e1d-abd0-8c8ea6997419'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rhyme_games_category.png'
);

-- cat_stacking_nesting_cups @ 9-12m → ember_cat_stacking_nesting_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f65c860e-5c79-4339-b57f-54425ffd0491'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f65c860e-5c79-4339-b57f-54425ffd0491'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png'
);

-- cat_cruising_furniture @ 9-12m → ember_cat_cruising_furniture_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5fdb390d-e72f-4292-9f95-cd66223ec44c'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cruising_furniture_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5fdb390d-e72f-4292-9f95-cd66223ec44c'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cruising_furniture_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5fdb390d-e72f-4292-9f95-cd66223ec44c'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cruising_furniture_category.png'
);

-- cat_soft_doll @ 9-12m → ember_cat_soft_doll_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '0e1e2309-5bca-4f34-af78-692ee82c0a3e'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_doll_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '0e1e2309-5bca-4f34-af78-692ee82c0a3e'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_doll_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '0e1e2309-5bca-4f34-af78-692ee82c0a3e'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_doll_category.png'
);

-- cat_furniture_anchors @ 9-12m → ember_cat_furniture_anchors_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '53f684d5-04c7-4bf5-a43b-289013cc8f2f'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_anchors_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '53f684d5-04c7-4bf5-a43b-289013cc8f2f'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_anchors_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '53f684d5-04c7-4bf5-a43b-289013cc8f2f'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_anchors_category.png'
);

-- cat_posting_boxes @ 9-12m → ember_cat_posting_boxes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f7b08527-63ac-4300-bb6e-c4c06cc8a4f3'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_boxes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f7b08527-63ac-4300-bb6e-c4c06cc8a4f3'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_boxes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f7b08527-63ac-4300-bb6e-c4c06cc8a4f3'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_boxes_category.png'
);

-- cat_animal_mini_books @ 9-12m → ember_cat_animal_mini_books_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '97ad4592-bc69-4ba4-b484-0612d43c9753'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_animal_mini_books_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '97ad4592-bc69-4ba4-b484-0612d43c9753'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_animal_mini_books_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '97ad4592-bc69-4ba4-b484-0612d43c9753'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_animal_mini_books_category.png'
);

-- cat_waving_signs @ 9-12m → ember_cat_waving_signs_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '80c0f30a-27d1-4906-86cb-d135a254943b'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_waving_signs_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '80c0f30a-27d1-4906-86cb-d135a254943b'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_waving_signs_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '80c0f30a-27d1-4906-86cb-d135a254943b'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_waving_signs_category.png'
);

-- cat_push_pull_toys @ 9-12m → ember_cat_push_pull_toys_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '990ea45e-1186-417b-94ef-d17970b8eba5'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_toys_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '990ea45e-1186-417b-94ef-d17970b8eba5'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_toys_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '990ea45e-1186-417b-94ef-d17970b8eba5'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_toys_category.png'
);

-- cat_container_basket @ 9-12m → ember_cat_container_basket_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1de10862-16fa-4119-945a-c02867d3159a'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_container_basket_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1de10862-16fa-4119-945a-c02867d3159a'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_container_basket_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1de10862-16fa-4119-945a-c02867d3159a'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_container_basket_category.png'
);

-- cat_finger_food_prep @ 9-12m → ember_cat_finger_food_prep_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3cb473ee-e122-4159-a867-49e0614cf811'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_prep_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3cb473ee-e122-4159-a867-49e0614cf811'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_prep_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3cb473ee-e122-4159-a867-49e0614cf811'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_prep_category.png'
);

-- cat_drop_roll_tubes @ 9-12m → ember_cat_drop_roll_tubes_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'eceae982-994d-4e18-b7d1-aee35243a38d'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_drop_roll_tubes_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'eceae982-994d-4e18-b7d1-aee35243a38d'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_drop_roll_tubes_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'eceae982-994d-4e18-b7d1-aee35243a38d'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_drop_roll_tubes_category.png'
);

-- cat_bubbles @ 9-12m → ember_cat_bubbles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cfd4873f-cd43-45f0-a2cd-a4822ae74165'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bubbles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cfd4873f-cd43-45f0-a2cd-a4822ae74165'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bubbles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cfd4873f-cd43-45f0-a2cd-a4822ae74165'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bubbles_category.png'
);

-- cat_cupboard_locks @ 9-12m → ember_cat_cupboard_locks_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ab2bc7cb-3296-4047-a948-863d90daa783'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ab2bc7cb-3296-4047-a948-863d90daa783'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png'
);

-- cat_puppets @ 9-12m → ember_cat_puppets_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5dd73eb4-0216-4d7a-9ca8-98a3c4796bd8'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_puppets_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5dd73eb4-0216-4d7a-9ca8-98a3c4796bd8'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_puppets_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5dd73eb4-0216-4d7a-9ca8-98a3c4796bd8'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_puppets_category.png'
);

-- cat_bath_cups @ 9-12m → ember_cat_bath_cups_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '840a111a-6fcc-4745-96f9-6fcbc6297418'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cups_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '840a111a-6fcc-4745-96f9-6fcbc6297418'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cups_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '840a111a-6fcc-4745-96f9-6fcbc6297418'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cups_category.png'
);

-- cat_blind_cord_cleats @ 9-12m → ember_cat_blind_cord_cleats_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3fea4f0a-623e-4d7e-bc62-902553cce684'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3fea4f0a-623e-4d7e-bc62-902553cce684'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3fea4f0a-623e-4d7e-bc62-902553cce684'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png'
);

-- cat_bibs_mats @ 9-12m → ember_cat_bibs_mats_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'c7445497-c0b5-4a0a-8318-86bbc34558fc'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bibs_mats_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'c7445497-c0b5-4a0a-8318-86bbc34558fc'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bibs_mats_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'c7445497-c0b5-4a0a-8318-86bbc34558fc'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bibs_mats_category.png'
);

-- cat_soft_graspable_balls @ 9-12m → ember_cat_soft_graspable_balls_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fd6bcc99-99f4-4a74-af0b-bc3304a95eb9'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_graspable_balls_category.png'
);

-- cat_sound_copy @ 9-12m → ember_cat_sound_copy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '12e94a6d-41fd-4996-b542-5d413704b0cf'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sound_copy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '12e94a6d-41fd-4996-b542-5d413704b0cf'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sound_copy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '12e94a6d-41fd-4996-b542-5d413704b0cf'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sound_copy_category.png'
);

-- cat_two_handed_objects @ 9-12m → ember_cat_two_handed_objects_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '47247240-bf08-4bb9-a516-4a1771865f0b'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_two_handed_objects_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '47247240-bf08-4bb9-a516-4a1771865f0b'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_two_handed_objects_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '47247240-bf08-4bb9-a516-4a1771865f0b'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_two_handed_objects_category.png'
);

-- cat_first_puzzles @ 9-12m → ember_cat_first_puzzles_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'd0ddbc51-131e-464e-b050-49e409fca0c6'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzles_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'd0ddbc51-131e-464e-b050-49e409fca0c6'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzles_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'd0ddbc51-131e-464e-b050-49e409fca0c6'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzles_category.png'
);

-- cat_bath_supervision @ 9-12m → ember_cat_bath_supervision_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '3faf02a5-c0c7-46d0-9f75-122a4abd799e'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_supervision_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '3faf02a5-c0c7-46d0-9f75-122a4abd799e'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_supervision_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '3faf02a5-c0c7-46d0-9f75-122a4abd799e'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_supervision_category.png'
);

-- cat_family_photos @ 9-12m → ember_cat_family_photos_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '28ef6834-320d-4fe5-9a33-c168d73ee4a0'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_photos_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '28ef6834-320d-4fe5-9a33-c168d73ee4a0'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_photos_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '28ef6834-320d-4fe5-9a33-c168d73ee4a0'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_photos_category.png'
);

-- cat_family_meal_plan @ 9-12m → ember_cat_family_meal_plan_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '5b3ba2d3-dbbc-4c1a-8c0a-f08a09dd0250'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_meal_plan_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '5b3ba2d3-dbbc-4c1a-8c0a-f08a09dd0250'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_meal_plan_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '5b3ba2d3-dbbc-4c1a-8c0a-f08a09dd0250'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_meal_plan_category.png'
);

-- cat_park_swings @ 9-12m → ember_cat_park_swings_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b9b965ec-d373-46b2-a8cf-0ccd87f2dfee'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swings_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b9b965ec-d373-46b2-a8cf-0ccd87f2dfee'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swings_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b9b965ec-d373-46b2-a8cf-0ccd87f2dfee'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swings_category.png'
);

-- cat_toy_rotation @ 9-12m → ember_cat_toy_rotation_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '6b1069fa-1de6-4fe8-843b-b537e489bad1'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_rotation_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '6b1069fa-1de6-4fe8-843b-b537e489bad1'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_rotation_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '6b1069fa-1de6-4fe8-843b-b537e489bad1'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_rotation_category.png'
);

-- cat_switchboard @ 9-12m → ember_cat_switchboard_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '8a7512f2-305d-4fe8-8893-632be7ca9e27'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_switchboard_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '8a7512f2-305d-4fe8-8893-632be7ca9e27'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_switchboard_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '8a7512f2-305d-4fe8-8893-632be7ca9e27'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_switchboard_category.png'
);

-- cat_point_name_outings @ 9-12m → ember_cat_point_name_outings_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cb23b67f-6fe5-48f3-b2a1-8db6647b4557'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_point_name_outings_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cb23b67f-6fe5-48f3-b2a1-8db6647b4557'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_point_name_outings_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cb23b67f-6fe5-48f3-b2a1-8db6647b4557'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_point_name_outings_category.png'
);

-- cat_musical_noise @ 9-12m → ember_cat_musical_noise_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'fcd2a021-6994-4d9c-a7b9-2f4780656aed'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_musical_noise_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'fcd2a021-6994-4d9c-a7b9-2f4780656aed'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_musical_noise_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'fcd2a021-6994-4d9c-a7b9-2f4780656aed'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_musical_noise_category.png'
);

-- cat_exclude_baby_walker @ 9-12m → ember_cat_exclude_baby_walker_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'b3c57dea-aafd-41d4-a4eb-586d85174026'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_exclude_baby_walker_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'b3c57dea-aafd-41d4-a4eb-586d85174026'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_exclude_baby_walker_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'b3c57dea-aafd-41d4-a4eb-586d85174026'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_exclude_baby_walker_category.png'
);

-- cat_hide_favourite_toy @ 9-12m → ember_cat_hide_favourite_toy_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'cc28cd24-e2a0-4abe-8303-ab8f26f3bad6'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_favourite_toy_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'cc28cd24-e2a0-4abe-8303-ab8f26f3bad6'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_favourite_toy_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'cc28cd24-e2a0-4abe-8303-ab8f26f3bad6'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_favourite_toy_category.png'
);

-- cat_texture_sensory @ 9-12m → ember_cat_texture_sensory_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '57da23ca-3fc2-444d-b994-7c654774fc18'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_sensory_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '57da23ca-3fc2-444d-b994-7c654774fc18'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_sensory_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '57da23ca-3fc2-444d-b994-7c654774fc18'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_sensory_category.png'
);

-- cat_low_obstacle @ 9-12m → ember_cat_low_obstacle_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = '1499637d-b35d-4242-9833-b43a9a893dd2'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_obstacle_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  '1499637d-b35d-4242-9833-b43a9a893dd2'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_obstacle_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = '1499637d-b35d-4242-9833-b43a9a893dd2'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_obstacle_category.png'
);

-- cat_pouches_caution @ 9-12m → ember_cat_pouches_caution_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'f3f256d8-0d2a-4ed6-b549-4b30b08f3140'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouches_caution_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'f3f256d8-0d2a-4ed6-b549-4b30b08f3140'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouches_caution_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'f3f256d8-0d2a-4ed6-b549-4b30b08f3140'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouches_caution_category.png'
);

-- cat_safe_laundry_play @ 9-12m → ember_cat_safe_laundry_play_category.png
UPDATE public.pl_category_type_images
SET is_active = false
WHERE category_type_id = 'ea52d44f-5f06-4810-9e60-d71abe4d11f4'
  AND COALESCE(age_band_id, '__global__') = '9-12m'
  AND is_active = true
  AND image_url IS DISTINCT FROM 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_laundry_play_category.png';

INSERT INTO public.pl_category_type_images (
  category_type_id, age_band_id, image_url, alt, is_active, sort
)
SELECT
  'ea52d44f-5f06-4810-9e60-d71abe4d11f4'::uuid,
  '9-12m',
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_laundry_play_category.png',
  NULL, true, 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.pl_category_type_images
  WHERE category_type_id = 'ea52d44f-5f06-4810-9e60-d71abe4d11f4'
    AND COALESCE(age_band_id, '__global__') = '9-12m'
    AND is_active = true
    AND image_url = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_laundry_play_category.png'
);

COMMIT;
