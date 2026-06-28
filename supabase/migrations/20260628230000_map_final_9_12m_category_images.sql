-- Ops: map new Make category_images -> pl_category_type_images (global fallback)
-- 15 Storage files from audit 15 DB-missing rows scanned
-- Audit: 15 in Storage, 0 still absent

BEGIN;

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT *
    FROM (VALUES
      ('3fea4f0a-623e-4d7e-bc62-902553cce684'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_blind_cord_cleats_category.png'),
      ('6b1069fa-1de6-4fe8-843b-b537e489bad1'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_rotation_category.png'),
      ('3faf02a5-c0c7-46d0-9f75-122a4abd799e'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_supervision_category.png'),
      ('b9b965ec-d373-46b2-a8cf-0ccd87f2dfee'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swings_category.png'),
      ('fcd2a021-6994-4d9c-a7b9-2f4780656aed'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_musical_noise_category.png'),
      ('8a7512f2-305d-4fe8-8893-632be7ca9e27'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_switchboard_category.png'),
      ('28ef6834-320d-4fe5-9a33-c168d73ee4a0'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_photos_category.png'),
      ('cb23b67f-6fe5-48f3-b2a1-8db6647b4557'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_point_name_outings_category.png'),
      ('5b3ba2d3-dbbc-4c1a-8c0a-f08a09dd0250'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_family_meal_plan_category.png'),
      ('ea52d44f-5f06-4810-9e60-d71abe4d11f4'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safe_laundry_play_category.png'),
      ('b3c57dea-aafd-41d4-a4eb-586d85174026'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_exclude_baby_walker_category.png'),
      ('1499637d-b35d-4242-9833-b43a9a893dd2'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_obstacle_category.png'),
      ('f3f256d8-0d2a-4ed6-b549-4b30b08f3140'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pouches_caution_category.png'),
      ('cc28cd24-e2a0-4abe-8303-ab8f26f3bad6'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_hide_favourite_toy_category.png'),
      ('57da23ca-3fc2-444d-b994-7c654774fc18'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_sensory_category.png')
    ) AS t(category_type_id, age_band_id, image_url)
  LOOP
    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id = rec.category_type_id
      AND age_band_id IS NULL
      AND is_active = true
      AND image_url IS DISTINCT FROM rec.image_url;

    IF NOT EXISTS (
      SELECT 1
      FROM public.pl_category_type_images existing
      WHERE existing.category_type_id = rec.category_type_id
        AND existing.age_band_id IS NULL
        AND existing.is_active = true
        AND existing.image_url = rec.image_url
    ) THEN
      INSERT INTO public.pl_category_type_images (
        category_type_id, age_band_id, image_url, alt, is_active, sort
      )
      VALUES (rec.category_type_id, rec.age_band_id, rec.image_url, NULL, true, 0);
    END IF;
  END LOOP;
END $$;

COMMIT;
