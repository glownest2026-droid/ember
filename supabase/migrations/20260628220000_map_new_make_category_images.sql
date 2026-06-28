-- Ops: map new Make category_images -> pl_category_type_images (global fallback)
-- 34 Storage files from audit 49 DB-missing rows scanned
-- Audit: 34 in Storage, 15 still absent

BEGIN;

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT *
    FROM (VALUES
      ('2dc9cc38-631c-493d-afa4-3237dc00b0ef'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_body_part_books_games_category.png'),
      ('2874d8e8-4f6b-4103-a40a-793863fdc0ef'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pull_push_toys_category.png'),
      ('08a7046f-cacd-49ca-95a6-80f8e17e3bbf'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_drop_boxes_category.png'),
      ('b7626461-4419-406c-a792-7e7e0f1c20fb'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_water_drawing_category.png'),
      ('51070dcd-3af3-41a6-80ba-a8d9e6f4d36a'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_dough_soft_clay_category.png'),
      ('f11ad2ba-93d8-460f-ab83-48231fa0f1a9'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_latch_busy_boards_category.png'),
      ('63fae8f0-e1ac-4996-83de-9d5c0d446e86'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_low_climb_tunnel_category.png'),
      ('3ee380fa-ded8-416d-a7f0-23fa16b0ce88'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_play_kitchen_household_props_category.png'),
      ('dd67d87f-0f41-4c7a-8799-524b49b9af80'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_shape_sorters_puzzles_category.png'),
      ('1bb27946-4bb2-4b9d-b5e9-759ca5860c73'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_furniture_window_checks_category.png'),
      ('7c39255f-216d-49ad-8361-fa112764f70a'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_snack_prep_category.png'),
      ('c55d6e31-f536-42bb-a8cf-eac54a6e9c62'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_naming_walks_category.png'),
      ('dc9ea1e9-5da4-4f4b-896c-62843a479db6'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toothbrush_routine_category.png'),
      ('8c15be9d-3fe4-4ec0-9370-04a8ce2a5c9c'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_velcro_pull_hide_category.png'),
      ('57df56e7-feca-4dc7-a505-feb6e8309e65'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_texture_tubs_category.png'),
      ('691a9db6-36d9-4399-bf38-98b91bfa0c58'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_toddler_bag_carry_category.png'),
      ('cfed9284-aef5-4ff8-9150-20463cb9b603'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bath_water_supervision_category.png'),
      ('ef3ca71f-076e-405a-a293-dfc26ece896c'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_stair_gates_category.png'),
      ('ff5b6588-2896-4a43-8085-94f40cf9042a'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_floor_zone_category.png'),
      ('a2f31ae2-5244-4d98-ade3-a6aafbc74efb'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_peekaboo_scarf_category.png'),
      ('69c48be5-04d3-4dfd-bb08-a7bed9a8e2e3'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_pincer_puzzle_category.png'),
      ('0e1e2309-5bca-4f34-af78-692ee82c0a3e'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_soft_doll_category.png'),
      ('af6f3a7d-336c-4e1d-abd0-8c8ea6997419'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_rhyme_games_category.png'),
      ('f7b08527-63ac-4300-bb6e-c4c06cc8a4f3'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_posting_boxes_category.png'),
      ('1de10862-16fa-4119-945a-c02867d3159a'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_container_basket_category.png'),
      ('97ad4592-bc69-4ba4-b484-0612d43c9753'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_animal_mini_books_category.png'),
      ('eceae982-994d-4e18-b7d1-aee35243a38d'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_drop_roll_tubes_category.png'),
      ('3cb473ee-e122-4159-a867-49e0614cf811'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_finger_food_prep_category.png'),
      ('80c0f30a-27d1-4906-86cb-d135a254943b'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_waving_signs_category.png'),
      ('c7445497-c0b5-4a0a-8318-86bbc34558fc'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_bibs_mats_category.png'),
      ('12e94a6d-41fd-4996-b542-5d413704b0cf'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_sound_copy_category.png'),
      ('5dd73eb4-0216-4d7a-9ca8-98a3c4796bd8'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_puppets_category.png'),
      ('d0ddbc51-131e-464e-b050-49e409fca0c6'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_first_puzzles_category.png'),
      ('47247240-bf08-4bb9-a516-4a1771865f0b'::uuid, NULL, 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_cat_two_handed_objects_category.png')
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
