-- Ops: map existing global category_images -> pl_category_type_images
-- 32 global Storage files (audit found 46 band-card rows covered via global fallback)
-- Do NOT re-upload these in Make — DB map only

BEGIN;

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT *
    FROM (VALUES
      ('bc4648b8-2510-453b-9848-5c26fa5f6d6e'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bedtime_board_books_category.png'),
      ('00761e08-df5b-479f-a2b0-db131f2c9322'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pram_walks_category.png'),
      ('f65c860e-5c79-4339-b57f-54425ffd0491'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stacking_nesting_cups_category.png'),
      ('9884ab18-4776-4e1b-ab78-76d791786ed4'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_safety_gates_category.png'),
      ('cb43b4d8-3cd1-41b6-9f57-fd131d3a5c5b'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_coin_box_category.png'),
      ('5fdb390d-e72f-4292-9f95-cd66223ec44c'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cruising_furniture_category.png'),
      ('cba17456-66eb-46e7-90eb-8ead6ac63833'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_toothpaste_category.png'),
      ('835b99db-c6b0-4d80-9857-1939cad8a28d'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_library_baby_group_category.png'),
      ('7ddabfb7-f156-4d3b-b93b-b99c81557694'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_picture_word_cards_category.png'),
      ('af0295d0-5072-45ca-837b-f629c62cbff6'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_doll_soft_toy_care_category.png'),
      ('ab2bc7cb-3296-4047-a948-863d90daa783'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cupboard_locks_category.png'),
      ('53f684d5-04c7-4bf5-a43b-289013cc8f2f'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_anchors_category.png'),
      ('990ea45e-1186-417b-94ef-d17970b8eba5'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_push_pull_toys_category.png'),
      ('cb87fcdc-66bb-4cc2-bd8b-55e78bd438b8'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_object_permanence_box_category.png'),
      ('cfd4873f-cd43-45f0-a2cd-a4822ae74165'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bubbles_category.png'),
      ('34794a43-a195-49ca-95de-8e045cb9b5a8'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_comfort_toy_category.png'),
      ('dee7f125-cb1c-4252-a01c-b668fa2f4aa4'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toy_cups_spoons_category.png'),
      ('840a111a-6fcc-4745-96f9-6fcbc6297418'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_cups_category.png'),
      ('1de6263d-4955-42fc-8c76-fe1431fe8ea7'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_peg_puzzles_category.png'),
      ('d639aa7f-3c6d-4f4b-a32a-a98e4738c8b4'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_cleanup_basket_category.png'),
      ('e4c310de-9d79-4670-ab4d-d966b3b5cdaf'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_gesture_sign_games_category.png'),
      ('4aebbbc0-443b-4aff-8fa8-0c8145f23ac1'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_snack_prep_pots_category.png'),
      ('b306511a-3d94-4ac3-a7c8-0da86d93780e'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_phone_talk_category.png'),
      ('8a5875a0-3704-4555-83a2-b4e10cb6f680'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_tower_blocks_category.png'),
      ('dec4d2e9-5962-4e28-b919-12db20b0ce40'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_car_seat_size_check_category.png'),
      ('99cef4c1-c78e-467d-8517-56484db223fa'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_routine_songs_category.png'),
      ('5f67eadc-3d94-4b15-9295-220dd992a5ca'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_park_swing_walks_category.png'),
      ('7fb7727f-0320-4d65-967c-705325dc0a99'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_treasure_basket_category.png'),
      ('e282478e-1ab9-4ac0-8e9f-fda3b252fd1d'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pretend_shoes_brushes_category.png'),
      ('ac27015e-4a15-4828-8923-4ae4d6b716b7'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_word_picture_books_category.png'),
      ('315365c1-dc1b-4058-ab64-d03282aeeeea'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_chunky_crayons_category.png'),
      ('2fa3c4f6-4e68-40a9-8dde-71708585400c'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_ramp_rolling_toys_category.png')
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
