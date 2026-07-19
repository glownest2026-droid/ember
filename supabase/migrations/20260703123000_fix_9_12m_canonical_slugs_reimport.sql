-- 9-12m slug canonicalisation: ent_cat_* → cat_* + discover reimport
-- Source: 02_Ember_Bible_9_12m_Conor_Thea_Depth_v2.xlsx (discover_projection, patched)
-- Merge pairs: 60; reimport rows: 60 expected

BEGIN;


-- ent_cat_activity_cube → cat_activity_cube
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_activity_cube')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_activity_cube') THEN
    UPDATE public.pl_category_types SET slug = 'cat_activity_cube', updated_at = now() WHERE slug = 'ent_cat_activity_cube';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_activity_cube')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_activity_cube') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_activity_cube'
    WHERE legacy.slug = 'ent_cat_activity_cube'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_activity_cube');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_activity_cube'
    WHERE legacy.slug = 'ent_cat_activity_cube'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_activity_cube');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_activity_cube'
    WHERE legacy.slug = 'ent_cat_activity_cube'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_animal_mini_books → cat_animal_mini_books
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_animal_mini_books')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_animal_mini_books') THEN
    UPDATE public.pl_category_types SET slug = 'cat_animal_mini_books', updated_at = now() WHERE slug = 'ent_cat_animal_mini_books';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_animal_mini_books')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_animal_mini_books') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_animal_mini_books'
    WHERE legacy.slug = 'ent_cat_animal_mini_books'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_animal_mini_books');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_animal_mini_books'
    WHERE legacy.slug = 'ent_cat_animal_mini_books'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_animal_mini_books');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_animal_mini_books'
    WHERE legacy.slug = 'ent_cat_animal_mini_books'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_baby_photo_book → cat_baby_photo_book
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_baby_photo_book')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_baby_photo_book') THEN
    UPDATE public.pl_category_types SET slug = 'cat_baby_photo_book', updated_at = now() WHERE slug = 'ent_cat_baby_photo_book';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_baby_photo_book')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_baby_photo_book') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_baby_photo_book'
    WHERE legacy.slug = 'ent_cat_baby_photo_book'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_baby_photo_book');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_baby_photo_book'
    WHERE legacy.slug = 'ent_cat_baby_photo_book'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_baby_photo_book');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_baby_photo_book'
    WHERE legacy.slug = 'ent_cat_baby_photo_book'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_bag_sweep → cat_bag_sweep
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bag_sweep')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bag_sweep') THEN
    UPDATE public.pl_category_types SET slug = 'cat_bag_sweep', updated_at = now() WHERE slug = 'ent_cat_bag_sweep';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bag_sweep')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bag_sweep') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bag_sweep'
    WHERE legacy.slug = 'ent_cat_bag_sweep'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bag_sweep');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bag_sweep'
    WHERE legacy.slug = 'ent_cat_bag_sweep'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bag_sweep');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bag_sweep'
    WHERE legacy.slug = 'ent_cat_bag_sweep'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_bath_cups → cat_bath_cups
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bath_cups')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bath_cups') THEN
    UPDATE public.pl_category_types SET slug = 'cat_bath_cups', updated_at = now() WHERE slug = 'ent_cat_bath_cups';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bath_cups')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bath_cups') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bath_cups'
    WHERE legacy.slug = 'ent_cat_bath_cups'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bath_cups');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bath_cups'
    WHERE legacy.slug = 'ent_cat_bath_cups'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bath_cups');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bath_cups'
    WHERE legacy.slug = 'ent_cat_bath_cups'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_bath_supervision → cat_bath_supervision
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bath_supervision')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bath_supervision') THEN
    UPDATE public.pl_category_types SET slug = 'cat_bath_supervision', updated_at = now() WHERE slug = 'ent_cat_bath_supervision';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bath_supervision')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bath_supervision') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bath_supervision'
    WHERE legacy.slug = 'ent_cat_bath_supervision'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bath_supervision');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bath_supervision'
    WHERE legacy.slug = 'ent_cat_bath_supervision'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bath_supervision');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bath_supervision'
    WHERE legacy.slug = 'ent_cat_bath_supervision'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_bibs_mats → cat_bibs_mats
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bibs_mats')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bibs_mats') THEN
    UPDATE public.pl_category_types SET slug = 'cat_bibs_mats', updated_at = now() WHERE slug = 'ent_cat_bibs_mats';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bibs_mats')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bibs_mats') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bibs_mats'
    WHERE legacy.slug = 'ent_cat_bibs_mats'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bibs_mats');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bibs_mats'
    WHERE legacy.slug = 'ent_cat_bibs_mats'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bibs_mats');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bibs_mats'
    WHERE legacy.slug = 'ent_cat_bibs_mats'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_blind_cord_cleats → cat_blind_cord_cleats
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_blind_cord_cleats')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_blind_cord_cleats') THEN
    UPDATE public.pl_category_types SET slug = 'cat_blind_cord_cleats', updated_at = now() WHERE slug = 'ent_cat_blind_cord_cleats';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_blind_cord_cleats')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_blind_cord_cleats') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_blind_cord_cleats'
    WHERE legacy.slug = 'ent_cat_blind_cord_cleats'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_blind_cord_cleats');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_blind_cord_cleats'
    WHERE legacy.slug = 'ent_cat_blind_cord_cleats'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_blind_cord_cleats');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_blind_cord_cleats'
    WHERE legacy.slug = 'ent_cat_blind_cord_cleats'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_board_books → cat_board_books
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_board_books')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_board_books') THEN
    UPDATE public.pl_category_types SET slug = 'cat_board_books', updated_at = now() WHERE slug = 'ent_cat_board_books';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_board_books')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_board_books') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_board_books'
    WHERE legacy.slug = 'ent_cat_board_books'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_board_books');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_board_books'
    WHERE legacy.slug = 'ent_cat_board_books'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_board_books');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_board_books'
    WHERE legacy.slug = 'ent_cat_board_books'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_bubbles → cat_bubbles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bubbles')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bubbles') THEN
    UPDATE public.pl_category_types SET slug = 'cat_bubbles', updated_at = now() WHERE slug = 'ent_cat_bubbles';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_bubbles')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_bubbles') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bubbles'
    WHERE legacy.slug = 'ent_cat_bubbles'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bubbles');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bubbles'
    WHERE legacy.slug = 'ent_cat_bubbles'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_bubbles');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_bubbles'
    WHERE legacy.slug = 'ent_cat_bubbles'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_container_basket → cat_container_basket
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_container_basket')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_container_basket') THEN
    UPDATE public.pl_category_types SET slug = 'cat_container_basket', updated_at = now() WHERE slug = 'ent_cat_container_basket';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_container_basket')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_container_basket') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_container_basket'
    WHERE legacy.slug = 'ent_cat_container_basket'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_container_basket');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_container_basket'
    WHERE legacy.slug = 'ent_cat_container_basket'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_container_basket');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_container_basket'
    WHERE legacy.slug = 'ent_cat_container_basket'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_cruising_furniture → cat_cruising_furniture
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_cruising_furniture')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_cruising_furniture') THEN
    UPDATE public.pl_category_types SET slug = 'cat_cruising_furniture', updated_at = now() WHERE slug = 'ent_cat_cruising_furniture';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_cruising_furniture')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_cruising_furniture') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_cruising_furniture'
    WHERE legacy.slug = 'ent_cat_cruising_furniture'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_cruising_furniture');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_cruising_furniture'
    WHERE legacy.slug = 'ent_cat_cruising_furniture'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_cruising_furniture');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_cruising_furniture'
    WHERE legacy.slug = 'ent_cat_cruising_furniture'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_cupboard_locks → cat_cupboard_locks
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_cupboard_locks')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_cupboard_locks') THEN
    UPDATE public.pl_category_types SET slug = 'cat_cupboard_locks', updated_at = now() WHERE slug = 'ent_cat_cupboard_locks';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_cupboard_locks')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_cupboard_locks') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_cupboard_locks'
    WHERE legacy.slug = 'ent_cat_cupboard_locks'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_cupboard_locks');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_cupboard_locks'
    WHERE legacy.slug = 'ent_cat_cupboard_locks'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_cupboard_locks');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_cupboard_locks'
    WHERE legacy.slug = 'ent_cat_cupboard_locks'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_drop_roll_tubes → cat_drop_roll_tubes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_drop_roll_tubes')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_drop_roll_tubes') THEN
    UPDATE public.pl_category_types SET slug = 'cat_drop_roll_tubes', updated_at = now() WHERE slug = 'ent_cat_drop_roll_tubes';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_drop_roll_tubes')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_drop_roll_tubes') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_drop_roll_tubes'
    WHERE legacy.slug = 'ent_cat_drop_roll_tubes'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_drop_roll_tubes');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_drop_roll_tubes'
    WHERE legacy.slug = 'ent_cat_drop_roll_tubes'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_drop_roll_tubes');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_drop_roll_tubes'
    WHERE legacy.slug = 'ent_cat_drop_roll_tubes'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_exclude_baby_walker → cat_exclude_baby_walker
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_exclude_baby_walker')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_exclude_baby_walker') THEN
    UPDATE public.pl_category_types SET slug = 'cat_exclude_baby_walker', updated_at = now() WHERE slug = 'ent_cat_exclude_baby_walker';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_exclude_baby_walker')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_exclude_baby_walker') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_exclude_baby_walker'
    WHERE legacy.slug = 'ent_cat_exclude_baby_walker'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_exclude_baby_walker');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_exclude_baby_walker'
    WHERE legacy.slug = 'ent_cat_exclude_baby_walker'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_exclude_baby_walker');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_exclude_baby_walker'
    WHERE legacy.slug = 'ent_cat_exclude_baby_walker'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_family_faces_cards → cat_family_faces_cards
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_family_faces_cards')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_family_faces_cards') THEN
    UPDATE public.pl_category_types SET slug = 'cat_family_faces_cards', updated_at = now() WHERE slug = 'ent_cat_family_faces_cards';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_family_faces_cards')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_family_faces_cards') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_faces_cards'
    WHERE legacy.slug = 'ent_cat_family_faces_cards'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_family_faces_cards');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_faces_cards'
    WHERE legacy.slug = 'ent_cat_family_faces_cards'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_family_faces_cards');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_faces_cards'
    WHERE legacy.slug = 'ent_cat_family_faces_cards'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_family_meal_plan → cat_family_meal_plan
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_family_meal_plan')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_family_meal_plan') THEN
    UPDATE public.pl_category_types SET slug = 'cat_family_meal_plan', updated_at = now() WHERE slug = 'ent_cat_family_meal_plan';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_family_meal_plan')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_family_meal_plan') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_meal_plan'
    WHERE legacy.slug = 'ent_cat_family_meal_plan'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_family_meal_plan');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_meal_plan'
    WHERE legacy.slug = 'ent_cat_family_meal_plan'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_family_meal_plan');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_meal_plan'
    WHERE legacy.slug = 'ent_cat_family_meal_plan'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_family_photos → cat_family_photos
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_family_photos')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_family_photos') THEN
    UPDATE public.pl_category_types SET slug = 'cat_family_photos', updated_at = now() WHERE slug = 'ent_cat_family_photos';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_family_photos')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_family_photos') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_photos'
    WHERE legacy.slug = 'ent_cat_family_photos'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_family_photos');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_photos'
    WHERE legacy.slug = 'ent_cat_family_photos'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_family_photos');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_family_photos'
    WHERE legacy.slug = 'ent_cat_family_photos'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_feelings_books → cat_feelings_faces_books
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_feelings_books')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_feelings_faces_books') THEN
    UPDATE public.pl_category_types SET slug = 'cat_feelings_faces_books', updated_at = now() WHERE slug = 'ent_cat_feelings_books';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_feelings_books')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_feelings_faces_books') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_feelings_faces_books'
    WHERE legacy.slug = 'ent_cat_feelings_books'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_feelings_books');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_feelings_faces_books'
    WHERE legacy.slug = 'ent_cat_feelings_books'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_feelings_books');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_feelings_faces_books'
    WHERE legacy.slug = 'ent_cat_feelings_books'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_finger_food_prep → cat_finger_food_prep
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_finger_food_prep')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_finger_food_prep') THEN
    UPDATE public.pl_category_types SET slug = 'cat_finger_food_prep', updated_at = now() WHERE slug = 'ent_cat_finger_food_prep';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_finger_food_prep')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_finger_food_prep') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_finger_food_prep'
    WHERE legacy.slug = 'ent_cat_finger_food_prep'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_finger_food_prep');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_finger_food_prep'
    WHERE legacy.slug = 'ent_cat_finger_food_prep'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_finger_food_prep');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_finger_food_prep'
    WHERE legacy.slug = 'ent_cat_finger_food_prep'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_first_puzzles → cat_first_puzzles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_first_puzzles')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_first_puzzles') THEN
    UPDATE public.pl_category_types SET slug = 'cat_first_puzzles', updated_at = now() WHERE slug = 'ent_cat_first_puzzles';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_first_puzzles')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_first_puzzles') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_first_puzzles'
    WHERE legacy.slug = 'ent_cat_first_puzzles'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_first_puzzles');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_first_puzzles'
    WHERE legacy.slug = 'ent_cat_first_puzzles'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_first_puzzles');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_first_puzzles'
    WHERE legacy.slug = 'ent_cat_first_puzzles'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_floor_zone → cat_floor_zone
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_floor_zone')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_floor_zone') THEN
    UPDATE public.pl_category_types SET slug = 'cat_floor_zone', updated_at = now() WHERE slug = 'ent_cat_floor_zone';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_floor_zone')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_floor_zone') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_floor_zone'
    WHERE legacy.slug = 'ent_cat_floor_zone'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_floor_zone');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_floor_zone'
    WHERE legacy.slug = 'ent_cat_floor_zone'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_floor_zone');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_floor_zone'
    WHERE legacy.slug = 'ent_cat_floor_zone'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_furniture_anchors → cat_furniture_anchors
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_furniture_anchors')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_furniture_anchors') THEN
    UPDATE public.pl_category_types SET slug = 'cat_furniture_anchors', updated_at = now() WHERE slug = 'ent_cat_furniture_anchors';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_furniture_anchors')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_furniture_anchors') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_furniture_anchors'
    WHERE legacy.slug = 'ent_cat_furniture_anchors'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_furniture_anchors');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_furniture_anchors'
    WHERE legacy.slug = 'ent_cat_furniture_anchors'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_furniture_anchors');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_furniture_anchors'
    WHERE legacy.slug = 'ent_cat_furniture_anchors'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_handheld_mini_books → cat_handheld_mini_books
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_handheld_mini_books')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_handheld_mini_books') THEN
    UPDATE public.pl_category_types SET slug = 'cat_handheld_mini_books', updated_at = now() WHERE slug = 'ent_cat_handheld_mini_books';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_handheld_mini_books')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_handheld_mini_books') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_handheld_mini_books'
    WHERE legacy.slug = 'ent_cat_handheld_mini_books'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_handheld_mini_books');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_handheld_mini_books'
    WHERE legacy.slug = 'ent_cat_handheld_mini_books'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_handheld_mini_books');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_handheld_mini_books'
    WHERE legacy.slug = 'ent_cat_handheld_mini_books'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_hide_favourite_toy → cat_hide_favourite_toy
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_hide_favourite_toy')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_hide_favourite_toy') THEN
    UPDATE public.pl_category_types SET slug = 'cat_hide_favourite_toy', updated_at = now() WHERE slug = 'ent_cat_hide_favourite_toy';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_hide_favourite_toy')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_hide_favourite_toy') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_hide_favourite_toy'
    WHERE legacy.slug = 'ent_cat_hide_favourite_toy'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_hide_favourite_toy');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_hide_favourite_toy'
    WHERE legacy.slug = 'ent_cat_hide_favourite_toy'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_hide_favourite_toy');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_hide_favourite_toy'
    WHERE legacy.slug = 'ent_cat_hide_favourite_toy'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_highchair → cat_highchair
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_highchair')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_highchair') THEN
    UPDATE public.pl_category_types SET slug = 'cat_highchair', updated_at = now() WHERE slug = 'ent_cat_highchair';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_highchair')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_highchair') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_highchair'
    WHERE legacy.slug = 'ent_cat_highchair'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_highchair');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_highchair'
    WHERE legacy.slug = 'ent_cat_highchair'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_highchair');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_highchair'
    WHERE legacy.slug = 'ent_cat_highchair'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_highchair_harness_check → cat_highchair_harness_check
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_highchair_harness_check')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_highchair_harness_check') THEN
    UPDATE public.pl_category_types SET slug = 'cat_highchair_harness_check', updated_at = now() WHERE slug = 'ent_cat_highchair_harness_check';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_highchair_harness_check')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_highchair_harness_check') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_highchair_harness_check'
    WHERE legacy.slug = 'ent_cat_highchair_harness_check'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_highchair_harness_check');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_highchair_harness_check'
    WHERE legacy.slug = 'ent_cat_highchair_harness_check'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_highchair_harness_check');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_highchair_harness_check'
    WHERE legacy.slug = 'ent_cat_highchair_harness_check'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_library_baby_group → cat_library_baby_group
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_library_baby_group')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_library_baby_group') THEN
    UPDATE public.pl_category_types SET slug = 'cat_library_baby_group', updated_at = now() WHERE slug = 'ent_cat_library_baby_group';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_library_baby_group')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_library_baby_group') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_library_baby_group'
    WHERE legacy.slug = 'ent_cat_library_baby_group'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_library_baby_group');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_library_baby_group'
    WHERE legacy.slug = 'ent_cat_library_baby_group'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_library_baby_group');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_library_baby_group'
    WHERE legacy.slug = 'ent_cat_library_baby_group'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_low_obstacle → cat_low_obstacle
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_low_obstacle')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_low_obstacle') THEN
    UPDATE public.pl_category_types SET slug = 'cat_low_obstacle', updated_at = now() WHERE slug = 'ent_cat_low_obstacle';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_low_obstacle')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_low_obstacle') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_low_obstacle'
    WHERE legacy.slug = 'ent_cat_low_obstacle'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_low_obstacle');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_low_obstacle'
    WHERE legacy.slug = 'ent_cat_low_obstacle'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_low_obstacle');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_low_obstacle'
    WHERE legacy.slug = 'ent_cat_low_obstacle'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_musical_noise → cat_musical_noise
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_musical_noise')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_musical_noise') THEN
    UPDATE public.pl_category_types SET slug = 'cat_musical_noise', updated_at = now() WHERE slug = 'ent_cat_musical_noise';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_musical_noise')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_musical_noise') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_musical_noise'
    WHERE legacy.slug = 'ent_cat_musical_noise'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_musical_noise');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_musical_noise'
    WHERE legacy.slug = 'ent_cat_musical_noise'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_musical_noise');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_musical_noise'
    WHERE legacy.slug = 'ent_cat_musical_noise'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_open_cup → cat_open_cup
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_open_cup')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_open_cup') THEN
    UPDATE public.pl_category_types SET slug = 'cat_open_cup', updated_at = now() WHERE slug = 'ent_cat_open_cup';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_open_cup')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_open_cup') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_open_cup'
    WHERE legacy.slug = 'ent_cat_open_cup'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_open_cup');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_open_cup'
    WHERE legacy.slug = 'ent_cat_open_cup'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_open_cup');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_open_cup'
    WHERE legacy.slug = 'ent_cat_open_cup'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_park_swings → cat_park_swings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_park_swings')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_park_swings') THEN
    UPDATE public.pl_category_types SET slug = 'cat_park_swings', updated_at = now() WHERE slug = 'ent_cat_park_swings';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_park_swings')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_park_swings') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_park_swings'
    WHERE legacy.slug = 'ent_cat_park_swings'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_park_swings');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_park_swings'
    WHERE legacy.slug = 'ent_cat_park_swings'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_park_swings');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_park_swings'
    WHERE legacy.slug = 'ent_cat_park_swings'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_peekaboo_scarf → cat_peekaboo_scarf
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_peekaboo_scarf')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_peekaboo_scarf') THEN
    UPDATE public.pl_category_types SET slug = 'cat_peekaboo_scarf', updated_at = now() WHERE slug = 'ent_cat_peekaboo_scarf';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_peekaboo_scarf')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_peekaboo_scarf') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_peekaboo_scarf'
    WHERE legacy.slug = 'ent_cat_peekaboo_scarf'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_peekaboo_scarf');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_peekaboo_scarf'
    WHERE legacy.slug = 'ent_cat_peekaboo_scarf'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_peekaboo_scarf');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_peekaboo_scarf'
    WHERE legacy.slug = 'ent_cat_peekaboo_scarf'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_pincer_puzzle → cat_pincer_puzzle
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_pincer_puzzle')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_pincer_puzzle') THEN
    UPDATE public.pl_category_types SET slug = 'cat_pincer_puzzle', updated_at = now() WHERE slug = 'ent_cat_pincer_puzzle';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_pincer_puzzle')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_pincer_puzzle') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pincer_puzzle'
    WHERE legacy.slug = 'ent_cat_pincer_puzzle'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_pincer_puzzle');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pincer_puzzle'
    WHERE legacy.slug = 'ent_cat_pincer_puzzle'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_pincer_puzzle');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pincer_puzzle'
    WHERE legacy.slug = 'ent_cat_pincer_puzzle'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_point_name_outings → cat_point_name_outings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_point_name_outings')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_point_name_outings') THEN
    UPDATE public.pl_category_types SET slug = 'cat_point_name_outings', updated_at = now() WHERE slug = 'ent_cat_point_name_outings';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_point_name_outings')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_point_name_outings') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_point_name_outings'
    WHERE legacy.slug = 'ent_cat_point_name_outings'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_point_name_outings');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_point_name_outings'
    WHERE legacy.slug = 'ent_cat_point_name_outings'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_point_name_outings');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_point_name_outings'
    WHERE legacy.slug = 'ent_cat_point_name_outings'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_posting_boxes → cat_posting_boxes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_posting_boxes')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_posting_boxes') THEN
    UPDATE public.pl_category_types SET slug = 'cat_posting_boxes', updated_at = now() WHERE slug = 'ent_cat_posting_boxes';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_posting_boxes')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_posting_boxes') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_posting_boxes'
    WHERE legacy.slug = 'ent_cat_posting_boxes'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_posting_boxes');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_posting_boxes'
    WHERE legacy.slug = 'ent_cat_posting_boxes'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_posting_boxes');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_posting_boxes'
    WHERE legacy.slug = 'ent_cat_posting_boxes'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_pouches_caution → cat_pouches_caution
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_pouches_caution')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_pouches_caution') THEN
    UPDATE public.pl_category_types SET slug = 'cat_pouches_caution', updated_at = now() WHERE slug = 'ent_cat_pouches_caution';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_pouches_caution')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_pouches_caution') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pouches_caution'
    WHERE legacy.slug = 'ent_cat_pouches_caution'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_pouches_caution');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pouches_caution'
    WHERE legacy.slug = 'ent_cat_pouches_caution'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_pouches_caution');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pouches_caution'
    WHERE legacy.slug = 'ent_cat_pouches_caution'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_pram_walks → cat_pram_walks
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_pram_walks')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_pram_walks') THEN
    UPDATE public.pl_category_types SET slug = 'cat_pram_walks', updated_at = now() WHERE slug = 'ent_cat_pram_walks';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_pram_walks')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_pram_walks') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pram_walks'
    WHERE legacy.slug = 'ent_cat_pram_walks'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_pram_walks');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pram_walks'
    WHERE legacy.slug = 'ent_cat_pram_walks'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_pram_walks');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_pram_walks'
    WHERE legacy.slug = 'ent_cat_pram_walks'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_puppets → cat_puppets
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_puppets')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_puppets') THEN
    UPDATE public.pl_category_types SET slug = 'cat_puppets', updated_at = now() WHERE slug = 'ent_cat_puppets';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_puppets')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_puppets') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_puppets'
    WHERE legacy.slug = 'ent_cat_puppets'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_puppets');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_puppets'
    WHERE legacy.slug = 'ent_cat_puppets'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_puppets');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_puppets'
    WHERE legacy.slug = 'ent_cat_puppets'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_push_pull_toy → cat_push_pull_toys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_push_pull_toy')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_push_pull_toys') THEN
    UPDATE public.pl_category_types SET slug = 'cat_push_pull_toys', updated_at = now() WHERE slug = 'ent_cat_push_pull_toy';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_push_pull_toy')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_push_pull_toys') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_push_pull_toys'
    WHERE legacy.slug = 'ent_cat_push_pull_toy'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_push_pull_toy');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_push_pull_toys'
    WHERE legacy.slug = 'ent_cat_push_pull_toy'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_push_pull_toy');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_push_pull_toys'
    WHERE legacy.slug = 'ent_cat_push_pull_toy'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_rhyme_games → cat_rhyme_games
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_rhyme_games')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_rhyme_games') THEN
    UPDATE public.pl_category_types SET slug = 'cat_rhyme_games', updated_at = now() WHERE slug = 'ent_cat_rhyme_games';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_rhyme_games')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_rhyme_games') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_rhyme_games'
    WHERE legacy.slug = 'ent_cat_rhyme_games'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_rhyme_games');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_rhyme_games'
    WHERE legacy.slug = 'ent_cat_rhyme_games'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_rhyme_games');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_rhyme_games'
    WHERE legacy.slug = 'ent_cat_rhyme_games'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_rolling_chime_ball → cat_rolling_chime_ball
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_rolling_chime_ball')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_rolling_chime_ball') THEN
    UPDATE public.pl_category_types SET slug = 'cat_rolling_chime_ball', updated_at = now() WHERE slug = 'ent_cat_rolling_chime_ball';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_rolling_chime_ball')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_rolling_chime_ball') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_rolling_chime_ball'
    WHERE legacy.slug = 'ent_cat_rolling_chime_ball'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_rolling_chime_ball');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_rolling_chime_ball'
    WHERE legacy.slug = 'ent_cat_rolling_chime_ball'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_rolling_chime_ball');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_rolling_chime_ball'
    WHERE legacy.slug = 'ent_cat_rolling_chime_ball'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_safe_household_objects → cat_safe_household_objects
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_safe_household_objects')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_safe_household_objects') THEN
    UPDATE public.pl_category_types SET slug = 'cat_safe_household_objects', updated_at = now() WHERE slug = 'ent_cat_safe_household_objects';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_safe_household_objects')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_safe_household_objects') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_safe_household_objects'
    WHERE legacy.slug = 'ent_cat_safe_household_objects'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_safe_household_objects');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_safe_household_objects'
    WHERE legacy.slug = 'ent_cat_safe_household_objects'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_safe_household_objects');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_safe_household_objects'
    WHERE legacy.slug = 'ent_cat_safe_household_objects'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_safe_laundry_play → cat_safe_laundry_play
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_safe_laundry_play')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_safe_laundry_play') THEN
    UPDATE public.pl_category_types SET slug = 'cat_safe_laundry_play', updated_at = now() WHERE slug = 'ent_cat_safe_laundry_play';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_safe_laundry_play')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_safe_laundry_play') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_safe_laundry_play'
    WHERE legacy.slug = 'ent_cat_safe_laundry_play'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_safe_laundry_play');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_safe_laundry_play'
    WHERE legacy.slug = 'ent_cat_safe_laundry_play'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_safe_laundry_play');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_safe_laundry_play'
    WHERE legacy.slug = 'ent_cat_safe_laundry_play'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_simple_puppets_words → cat_simple_puppets_words
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_simple_puppets_words')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_simple_puppets_words') THEN
    UPDATE public.pl_category_types SET slug = 'cat_simple_puppets_words', updated_at = now() WHERE slug = 'ent_cat_simple_puppets_words';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_simple_puppets_words')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_simple_puppets_words') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_simple_puppets_words'
    WHERE legacy.slug = 'ent_cat_simple_puppets_words'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_simple_puppets_words');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_simple_puppets_words'
    WHERE legacy.slug = 'ent_cat_simple_puppets_words'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_simple_puppets_words');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_simple_puppets_words'
    WHERE legacy.slug = 'ent_cat_simple_puppets_words'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_sling_ticks_check → cat_sling_ticks_check
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_sling_ticks_check')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_sling_ticks_check') THEN
    UPDATE public.pl_category_types SET slug = 'cat_sling_ticks_check', updated_at = now() WHERE slug = 'ent_cat_sling_ticks_check';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_sling_ticks_check')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_sling_ticks_check') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_sling_ticks_check'
    WHERE legacy.slug = 'ent_cat_sling_ticks_check'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_sling_ticks_check');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_sling_ticks_check'
    WHERE legacy.slug = 'ent_cat_sling_ticks_check'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_sling_ticks_check');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_sling_ticks_check'
    WHERE legacy.slug = 'ent_cat_sling_ticks_check'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_soft_crawl_shapes → cat_soft_crawl_shapes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_soft_crawl_shapes')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_soft_crawl_shapes') THEN
    UPDATE public.pl_category_types SET slug = 'cat_soft_crawl_shapes', updated_at = now() WHERE slug = 'ent_cat_soft_crawl_shapes';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_soft_crawl_shapes')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_soft_crawl_shapes') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_crawl_shapes'
    WHERE legacy.slug = 'ent_cat_soft_crawl_shapes'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_soft_crawl_shapes');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_crawl_shapes'
    WHERE legacy.slug = 'ent_cat_soft_crawl_shapes'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_soft_crawl_shapes');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_crawl_shapes'
    WHERE legacy.slug = 'ent_cat_soft_crawl_shapes'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_soft_doll → cat_soft_doll
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_soft_doll')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_soft_doll') THEN
    UPDATE public.pl_category_types SET slug = 'cat_soft_doll', updated_at = now() WHERE slug = 'ent_cat_soft_doll';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_soft_doll')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_soft_doll') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_doll'
    WHERE legacy.slug = 'ent_cat_soft_doll'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_soft_doll');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_doll'
    WHERE legacy.slug = 'ent_cat_soft_doll'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_soft_doll');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_doll'
    WHERE legacy.slug = 'ent_cat_soft_doll'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_soft_balls → cat_soft_graspable_balls
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_soft_balls')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_soft_graspable_balls') THEN
    UPDATE public.pl_category_types SET slug = 'cat_soft_graspable_balls', updated_at = now() WHERE slug = 'ent_cat_soft_balls';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_soft_balls')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_soft_graspable_balls') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_graspable_balls'
    WHERE legacy.slug = 'ent_cat_soft_balls'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_soft_balls');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_graspable_balls'
    WHERE legacy.slug = 'ent_cat_soft_balls'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_soft_balls');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_soft_graspable_balls'
    WHERE legacy.slug = 'ent_cat_soft_balls'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_sound_copy → cat_sound_copy
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_sound_copy')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_sound_copy') THEN
    UPDATE public.pl_category_types SET slug = 'cat_sound_copy', updated_at = now() WHERE slug = 'ent_cat_sound_copy';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_sound_copy')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_sound_copy') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_sound_copy'
    WHERE legacy.slug = 'ent_cat_sound_copy'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_sound_copy');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_sound_copy'
    WHERE legacy.slug = 'ent_cat_sound_copy'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_sound_copy');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_sound_copy'
    WHERE legacy.slug = 'ent_cat_sound_copy'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_stacking_cups → cat_stacking_nesting_cups
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_cups')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_stacking_nesting_cups') THEN
    UPDATE public.pl_category_types SET slug = 'cat_stacking_nesting_cups', updated_at = now() WHERE slug = 'ent_cat_stacking_cups';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_cups')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_stacking_nesting_cups') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stacking_nesting_cups'
    WHERE legacy.slug = 'ent_cat_stacking_cups'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_cups');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stacking_nesting_cups'
    WHERE legacy.slug = 'ent_cat_stacking_cups'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_cups');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stacking_nesting_cups'
    WHERE legacy.slug = 'ent_cat_stacking_cups'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_stacking_rings → cat_stacking_rings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_rings')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_stacking_rings') THEN
    UPDATE public.pl_category_types SET slug = 'cat_stacking_rings', updated_at = now() WHERE slug = 'ent_cat_stacking_rings';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_rings')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_stacking_rings') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stacking_rings'
    WHERE legacy.slug = 'ent_cat_stacking_rings'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_rings');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stacking_rings'
    WHERE legacy.slug = 'ent_cat_stacking_rings'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_stacking_rings');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stacking_rings'
    WHERE legacy.slug = 'ent_cat_stacking_rings'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_stair_gates → cat_stair_gates
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_stair_gates')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_stair_gates') THEN
    UPDATE public.pl_category_types SET slug = 'cat_stair_gates', updated_at = now() WHERE slug = 'ent_cat_stair_gates';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_stair_gates')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_stair_gates') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stair_gates'
    WHERE legacy.slug = 'ent_cat_stair_gates'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_stair_gates');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stair_gates'
    WHERE legacy.slug = 'ent_cat_stair_gates'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_stair_gates');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_stair_gates'
    WHERE legacy.slug = 'ent_cat_stair_gates'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_switchboard → cat_switchboard
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_switchboard')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_switchboard') THEN
    UPDATE public.pl_category_types SET slug = 'cat_switchboard', updated_at = now() WHERE slug = 'ent_cat_switchboard';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_switchboard')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_switchboard') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_switchboard'
    WHERE legacy.slug = 'ent_cat_switchboard'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_switchboard');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_switchboard'
    WHERE legacy.slug = 'ent_cat_switchboard'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_switchboard');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_switchboard'
    WHERE legacy.slug = 'ent_cat_switchboard'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_texture_sensory → cat_texture_sensory
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_texture_sensory')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_texture_sensory') THEN
    UPDATE public.pl_category_types SET slug = 'cat_texture_sensory', updated_at = now() WHERE slug = 'ent_cat_texture_sensory';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_texture_sensory')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_texture_sensory') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_texture_sensory'
    WHERE legacy.slug = 'ent_cat_texture_sensory'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_texture_sensory');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_texture_sensory'
    WHERE legacy.slug = 'ent_cat_texture_sensory'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_texture_sensory');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_texture_sensory'
    WHERE legacy.slug = 'ent_cat_texture_sensory'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_tiny_daily_play_loop → cat_tiny_daily_play_loop
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_tiny_daily_play_loop')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_tiny_daily_play_loop') THEN
    UPDATE public.pl_category_types SET slug = 'cat_tiny_daily_play_loop', updated_at = now() WHERE slug = 'ent_cat_tiny_daily_play_loop';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_tiny_daily_play_loop')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_tiny_daily_play_loop') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_tiny_daily_play_loop'
    WHERE legacy.slug = 'ent_cat_tiny_daily_play_loop'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_tiny_daily_play_loop');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_tiny_daily_play_loop'
    WHERE legacy.slug = 'ent_cat_tiny_daily_play_loop'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_tiny_daily_play_loop');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_tiny_daily_play_loop'
    WHERE legacy.slug = 'ent_cat_tiny_daily_play_loop'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_tissue_box_cloths → cat_tissue_box_cloths
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_tissue_box_cloths')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_tissue_box_cloths') THEN
    UPDATE public.pl_category_types SET slug = 'cat_tissue_box_cloths', updated_at = now() WHERE slug = 'ent_cat_tissue_box_cloths';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_tissue_box_cloths')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_tissue_box_cloths') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_tissue_box_cloths'
    WHERE legacy.slug = 'ent_cat_tissue_box_cloths'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_tissue_box_cloths');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_tissue_box_cloths'
    WHERE legacy.slug = 'ent_cat_tissue_box_cloths'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_tissue_box_cloths');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_tissue_box_cloths'
    WHERE legacy.slug = 'ent_cat_tissue_box_cloths'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_toy_rotation → cat_toy_rotation
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_toy_rotation')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_toy_rotation') THEN
    UPDATE public.pl_category_types SET slug = 'cat_toy_rotation', updated_at = now() WHERE slug = 'ent_cat_toy_rotation';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_toy_rotation')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_toy_rotation') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toy_rotation'
    WHERE legacy.slug = 'ent_cat_toy_rotation'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_toy_rotation');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toy_rotation'
    WHERE legacy.slug = 'ent_cat_toy_rotation'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_toy_rotation');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toy_rotation'
    WHERE legacy.slug = 'ent_cat_toy_rotation'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_two_handed_objects → cat_two_handed_objects
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_two_handed_objects')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_two_handed_objects') THEN
    UPDATE public.pl_category_types SET slug = 'cat_two_handed_objects', updated_at = now() WHERE slug = 'ent_cat_two_handed_objects';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_two_handed_objects')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_two_handed_objects') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_two_handed_objects'
    WHERE legacy.slug = 'ent_cat_two_handed_objects'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_two_handed_objects');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_two_handed_objects'
    WHERE legacy.slug = 'ent_cat_two_handed_objects'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_two_handed_objects');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_two_handed_objects'
    WHERE legacy.slug = 'ent_cat_two_handed_objects'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- ent_cat_waving_signs → cat_waving_signs
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_waving_signs')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_waving_signs') THEN
    UPDATE public.pl_category_types SET slug = 'cat_waving_signs', updated_at = now() WHERE slug = 'ent_cat_waving_signs';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'ent_cat_waving_signs')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_waving_signs') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_waving_signs'
    WHERE legacy.slug = 'ent_cat_waving_signs'
      AND m.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_age_band_development_need_category_types existing
        WHERE existing.age_band_id = m.age_band_id
          AND existing.development_need_id = m.development_need_id
          AND existing.category_type_id = canonical.id
      );

    UPDATE public.pl_age_band_development_need_category_types
    SET is_active = false, updated_at = now()
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_waving_signs');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_waving_signs'
    WHERE legacy.slug = 'ent_cat_waving_signs'
      AND img.category_type_id = legacy.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.pl_category_type_images existing
        WHERE existing.category_type_id = canonical.id
          AND COALESCE(existing.age_band_id, '__global__') = COALESCE(img.age_band_id, '__global__')
          AND existing.is_active = true
      );

    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'ent_cat_waving_signs');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_waving_signs'
    WHERE legacy.slug = 'ent_cat_waving_signs'
      AND p.category_type_id = legacy.id;
  END IF;
END $$;


-- Discover pilot import: age bands 10–12 months
-- Source: discover_projection tab from Ember ABI workbooks (9-12m)
-- Stage 3 intentionally empty. Idempotent: safe to re-run.

CREATE TEMP TABLE tmp_discover_projection_stage (
  age_band_id TEXT NOT NULL,
  age_band_label TEXT NOT NULL,
  min_months INTEGER NOT NULL,
  max_months INTEGER NOT NULL,
  age_band_is_active BOOLEAN NOT NULL,
  stage1_wrapper_ux_slug TEXT NOT NULL,
  stage1_wrapper_ux_label TEXT NOT NULL,
  stage1_wrapper_rank_in_band INTEGER NOT NULL,
  stage1_mapping_is_active BOOLEAN NOT NULL,
  development_need_slug TEXT NOT NULL,
  development_need_canonical_name TEXT NOT NULL,
  stage1_why_it_matters_ux_description TEXT,
  audience_lens TEXT,
  stage2_category_type_slug TEXT NOT NULL,
  stage2_category_type_label TEXT NOT NULL,
  stage2_category_type_name TEXT NOT NULL,
  stage2_play_ideas_rank INTEGER NOT NULL,
  stage2_play_idea_mapping_rationale TEXT,
  category_audience_lens TEXT,
  content_type TEXT,
  ui_lane TEXT,
  ui_section_title TEXT,
  lane_rank INTEGER,
  show_ember_picks BOOLEAN,
  show_gift_action BOOLEAN,
  gift_friendly BOOLEAN,
  buyer_mode_label TEXT,
  gift_note TEXT,
  ownership_note TEXT,
  product_family_label TEXT,
  primary_persona TEXT,
  card_cta_label TEXT,
  render_rule TEXT
) ON COMMIT DROP;

INSERT INTO tmp_discover_projection_stage (
  age_band_id,
  age_band_label,
  min_months,
  max_months,
  age_band_is_active,
  stage1_wrapper_ux_slug,
  stage1_wrapper_ux_label,
  stage1_wrapper_rank_in_band,
  stage1_mapping_is_active,
  development_need_slug,
  development_need_canonical_name,
  stage1_why_it_matters_ux_description,
  audience_lens,
  stage2_category_type_slug,
  stage2_category_type_label,
  stage2_category_type_name,
  stage2_play_ideas_rank,
  stage2_play_idea_mapping_rationale,
  category_audience_lens,
  content_type,
  ui_lane,
  ui_section_title,
  lane_rank,
  show_ember_picks,
  show_gift_action,
  gift_friendly,
  buyer_mode_label,
  gift_note,
  ownership_note,
  product_family_label,
  primary_persona,
  card_cta_label,
  render_rule
)
VALUES
  ('9-12m','10–12 months',10,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_need_mobility','I’m getting ready to move','Your baby may be sitting, crawling, pulling up or cruising around furniture. This is a useful time to make space for movement, offer steady support and give them something interesting to reach, roll towards or explore while you stay close.','for_your_child','cat_floor_zone','A clear floor for moving','Floor Zone',1,'Clear a small floor space and place one interesting toy just out of reach. Reaching, rolling, scooting or crawling towards it gives movement a simple reason, while keeping the space calm enough for you to supervise.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use a blanket, mat or clear patch of carpet before buying anything new.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_need_mobility','I’m getting ready to move','Your baby may be sitting, crawling, pulling up or cruising around furniture. This is a useful time to make space for movement, offer steady support and give them something interesting to reach, roll towards or explore while you stay close.','for_your_child','cat_cruising_furniture','A safer pulling-up spot','Cruising Furniture',2,'If your baby is trying to stand, choose one steady place for pulling up and keep the floor around it clear. The aim is not to hurry walking, but to make those repeated up-down attempts safer and less chaotic.','for_your_child','safety_check','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,'Use stable furniture you already own, but check it cannot tip or slide.',NULL,'conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_need_mobility','I’m getting ready to move','Your baby may be sitting, crawling, pulling up or cruising around furniture. This is a useful time to make space for movement, offer steady support and give them something interesting to reach, roll towards or explore while you stay close.','for_your_child','cat_push_pull_toys','Stable push and pull toys','Push Pull Toys',3,'A stable push or pull toy can suit the late edge of this stage if your baby is already pulling up or cruising. Look for a steady base and slow movement, and keep it separate from seated baby walkers.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','Worth considering only if your baby is already trying to stand or move along furniture.','Stable push and pull toys','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_need_mobility','I’m getting ready to move','Your baby may be sitting, crawling, pulling up or cruising around furniture. This is a useful time to make space for movement, offer steady support and give them something interesting to reach, roll towards or explore while you stay close.','for_your_child','cat_soft_graspable_balls','Soft balls for rolling and passing','Soft Graspable Balls',4,'A soft ball is simple, but it works hard at this age. Roll it just away, pass it back and forth, or let your baby practise an early throw while you keep the game safe and close.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','If they already have a ball, choose one that is soft, large enough and easy to grip.','Soft balls for rolling and passing','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_need_mobility','I’m getting ready to move','Your baby may be sitting, crawling, pulling up or cruising around furniture. This is a useful time to make space for movement, offer steady support and give them something interesting to reach, roll towards or explore while you stay close.','for_your_child','cat_park_swings','Park trips and baby swings','Park Swings',5,'A short park trip can make the day feel different without adding more toys. A suitable baby swing adds rhythm and shared attention, while the outing gives your baby new things to look at, hear and name.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,'No purchase needed if a local park works for your day.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_need_mobility','I’m getting ready to move','Your baby may be sitting, crawling, pulling up or cruising around furniture. This is a useful time to make space for movement, offer steady support and give them something interesting to reach, roll towards or explore while you stay close.','for_your_child','cat_low_obstacle','Low cushions to crawl over','Low Obstacle',6,'A cushion, rolled towel or very low tunnel can make floor time feel like exploration. Keep the route soft and low so your baby can crawl, scoot or reach without turning the room into a climbing zone.','for_your_child','setup','useful_ideas','Useful ideas',3,false,false,false,'Idea',NULL,'Try cushions, towels or a folded blanket before buying soft play shapes.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_need_mobility','I’m getting ready to move','Your baby may be sitting, crawling, pulling up or cruising around furniture. This is a useful time to make space for movement, offer steady support and give them something interesting to reach, roll towards or explore while you stay close.','for_your_child','cat_soft_crawl_shapes','Soft crawl tunnel or play shapes','Soft Crawl Shapes',7,'If your baby is already moving, a soft tunnel or very low play shape can make floor time feel new again. It is a more considered gift than another small toy, but it only helps if there is space and supervision.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A fresher idea that still fits this stage.','Skip if the family is short on space or already uses cushions for floor play.','Soft crawl tunnel or play shapes','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_hands','I’m busy with both hands',2,true,'ent_need_pincer','I’m busy with both hands','Hands can get much busier now. Your baby may pass toys across their body, bang things together, empty containers or start using finger and thumb. Simple stacking, posting and grasping toys give that new control a clear little job.','for_your_child','cat_pincer_puzzle','Pincer puzzles and peg drops','Pincer Puzzle',1,'Chunky peg drops or first pincer puzzles give finger-and-thumb practice a clear little job. Keep the pieces large and the challenge simple, so your baby can explore, try again and enjoy the feel of getting something into place.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A fresher idea that still fits this stage.','Choose only large-piece, age-fit versions. Skip tiny puzzle pieces.','Pincer puzzles and peg drops','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_hands','I’m busy with both hands',2,true,'ent_need_bilateral','I’m busy with both hands','Hands can get much busier now. Your baby may pass toys across their body, bang things together, empty containers or start using finger and thumb. Simple stacking, posting and grasping toys give that new control a clear little job.','for_your_child','cat_stacking_nesting_cups','Stacking and nesting cups','Stacking Nesting Cups',2,'Stacking cups can do much more now than sit in a toy basket. Your baby can pull them apart, nest them, bang them, fill them, tip them and knock them down, which makes them useful across floor, bath and container play.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','High ownership risk: if they already have cups, use them in new ways rather than buying another set.','Stacking and nesting cups','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_hands','I’m busy with both hands',2,true,'ent_need_container','I’m busy with both hands','Hands can get much busier now. Your baby may pass toys across their body, bang things together, empty containers or start using finger and thumb. Simple stacking, posting and grasping toys give that new control a clear little job.','for_your_child','cat_container_basket','Treasure basket and container play','Container Basket',3,'A simple basket or tub with large safe objects can become a brilliant little loop: empty, refill, pass, find and repeat. It gives busy hands a job without needing a full new toy setup.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use a basket or tub you already own and fill it with large baby-safe objects.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_hands','I’m busy with both hands',2,true,'ent_need_bilateral','I’m busy with both hands','Hands can get much busier now. Your baby may pass toys across their body, bang things together, empty containers or start using finger and thumb. Simple stacking, posting and grasping toys give that new control a clear little job.','for_your_child','cat_two_handed_objects','Two-hand toys','Two Handed Objects',4,'Objects that need two hands, like a tub to tip or a larger toy to pass, can help your baby practise using both sides together. Keep it simple: the best version is easy to hold, safe to mouth and interesting to repeat.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A fresher idea that still fits this stage.','Look first at larger toys or containers already at home.','Two-hand toys','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_hands','I’m busy with both hands',2,true,'ent_need_bilateral','I’m busy with both hands','Hands can get much busier now. Your baby may pass toys across their body, bang things together, empty containers or start using finger and thumb. Simple stacking, posting and grasping toys give that new control a clear little job.','for_your_child','cat_musical_noise','Simple instruments and noisy play','Musical Noise',5,'A shaker, little drum or pan-and-spoon moment gives your baby a clear cause-and-effect game. The useful part is not loudness; it is noticing that their hands can make a sound, then pausing for you to copy it back.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A fresher idea that still fits this stage.','Try a wooden spoon and pan before buying instruments.','Simple baby instruments','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_hands','I’m busy with both hands',2,true,'ent_need_parent_day','I’m busy with both hands','Hands can get much busier now. Your baby may pass toys across their body, bang things together, empty containers or start using finger and thumb. Simple stacking, posting and grasping toys give that new control a clear little job.','for_your_child','cat_safe_household_objects','Baby-safe household object basket','Safe Household Objects',6,'If your baby wants the real remote, keys or kitchen things, offer a small basket of safer everyday objects instead. It lets them explore textures, shapes and sounds without handing over hazards.','for_your_child','setup','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,'Use household objects only after a careful safety check.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_hands','I’m busy with both hands',2,true,'ent_need_bilateral','I’m busy with both hands','Hands can get much busier now. Your baby may pass toys across their body, bang things together, empty containers or start using finger and thumb. Simple stacking, posting and grasping toys give that new control a clear little job.','for_your_child','cat_stacking_rings','Stacking rings','Stacking Rings',7,'Stacking rings are a classic for this window because they are easy to grasp, repeat and knock down. They are different from cups because the post gives the hand movement a clearer target, which some babies find satisfying.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','High ownership risk: check whether the family already has a stacking toy before buying.','Stacking rings','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_container','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_peekaboo_scarf','Peekaboo cloths and scarves','Peekaboo Scarf',1,'A light cloth or play scarf lets your baby enjoy the little drama of something disappearing and coming back. Keep it short, silly and supervised, with your face or a favourite toy doing the reveal.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A fresher idea that still fits this stage.','A clean muslin or light cloth may already do the job.','Peekaboo cloths and scarves','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_container','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_posting_boxes','Posting boxes and sliding lids','Posting Boxes',2,'Posting a chunky piece into a slot, sliding a lid or opening a simple box can be very satisfying now. It gives busy hands, focus and problem-solving a tiny repeatable challenge.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A fresher idea that still fits this stage.','Try a tissue box or tub with large objects before buying a posting toy.','Posting boxes and sliding-lid toys','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_cause','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_drop_roll_tubes','Drop, roll and tube play','Drop Roll Tubes',3,'Dropping a ball into a tube or rolling it away gives your baby an action they can watch, repeat and begin to expect. It is a simple way to turn cause-and-effect into movement.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A fresher idea that still fits this stage.','Use a cardboard tube only if it is clean, sturdy and supervised.','Ball-drop and rolling toys','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_cause','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_first_puzzles','Large-piece first puzzles','First Puzzles',4,'A first puzzle should be simple, chunky and forgiving. At this age the value is turning, lifting, trying and exploring the piece, not completing a picture neatly.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','Choose chunky pieces only. Skip puzzles with small or fiddly parts.','Large-piece first puzzles','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_cause','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_switchboard','Buttons, switches and flaps','Switchboard',5,'A simple switchboard or busy-board style toy gives pushing, flipping and turning a clear effect. Choose non-electronic, sturdy versions where possible, so the play stays focused on hand control and curiosity rather than lights and noise.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A fresher idea that still fits this stage.','Check for loose parts and avoid overly noisy electronic versions if that is not what the family wants.','Non-electronic switch and button toys','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_container','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_hide_favourite_toy','Hide-and-find favourite toy games','Hide Favourite Toy',6,'Hide a favourite soft toy partly under a cloth or behind a box and let your baby find it. The familiar object keeps the game reassuring while the hiding and reveal make it exciting.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use a favourite toy they already know.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_object_permanence','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_tissue_box_cloths','Tissue-box cloth pull toy','Tissue Box Cloths',7,'A tissue-box cloth toy can be surprisingly satisfying now: pull a cloth out, find another one, hide it back in and do it again. It feels fresh, but it is really just a neat version of a very simple baby game.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Good gift','A fresher idea that still fits this stage.','A clean empty tissue box and scarves can make a no-buy version.','Tissue-box cloth pull toy','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_cause','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_rolling_chime_ball','Rolling chime ball','Rolling Chime Ball',8,'A rolling chime ball gives your baby something to follow with eyes, hands and body. The gentle sound helps them notice what happened after they touched it, without needing a complicated electronic toy.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Good gift','A fresher idea that still fits this stage.','Skip if the family already has several rolling or musical toys.','Rolling chime ball','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_solve','I’m finding hidden things',3,true,'ent_need_cause','I’m finding hidden things','Your baby may be starting to look for things that disappear, watch what happens when objects drop, or repeat the same action again and again. Hide-and-find games, boxes, tubes and simple puzzles can turn that curiosity into satisfying play.','for_your_child','cat_activity_cube','Activity cube with doors and sliders','Activity Cube',9,'An activity cube can be useful if it offers simple turning, sliding, opening or posting rather than just noise. It suits babies who want repeatable little challenges and parents who would rather buy one thoughtful item than several scattered toys.','for_your_child','product_category','things_that_can_help','Things that can help',8,true,true,true,'Good gift','A fresher idea that still fits this stage.','Check whether the family already has a busy board or activity cube before buying.','Activity cube with doors and sliders','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_books','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_board_books','Books with pauses','Board Books',1,'Books may already be part of the day. Around this age, the useful bit is slowing down, pausing, naming pictures and letting your baby look, reach, smile, babble or turn back to a favourite page.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','High ownership risk: choose a book with faces, rhythm or clear pictures if they already own basics.','Board and picture books','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_gestures','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_rhyme_games','Rhymes, clapping and pat-a-cake','Rhyme Games',2,'Short rhymes, clapping games and pat-a-cake give your baby a predictable rhythm to watch and copy. The best bit is the pause, when they get a chance to smile, move, babble or ask for more.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'No product needed; your voice and hands are enough.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_gestures','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_waving_signs','Waving and simple signs','Waving Signs',3,'Waving, shaking their head or using one simple sign can help your baby join in before clear words arrive. Keep it playful and repeat it in real moments, like hello, bye-bye, more or all gone.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,'No purchase needed.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_gestures','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_sound_copy','Babble-copying sound games','Sound Copy',4,'When your baby says ba, ma or another little sound, copy it back and pause. That tiny back-and-forth can feel like a game and helps them practise listening, taking turns and making sounds on purpose.','for_your_child','activity','useful_ideas','Useful ideas',3,false,false,false,'Idea',NULL,'No product needed.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_books','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_point_name_outings','Point-and-name outings','Point Name Outings',5,'If your baby points, looks or reaches towards something outside, name it simply: dog, bus, tree, bird. The outing does not need to be special. The useful part is noticing what caught their attention and giving it a word.','for_your_child','activity','useful_ideas','Useful ideas',4,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_books','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_family_faces_cards','Familiar-face cards','Family Faces Cards',6,'Photos of familiar people can turn naming into something your baby already cares about. You can point, say names, make silly voices or use the cards before calls and visits.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A fresher idea that still fits this stage.','Use printed family photos before buying a specialist card set.','Familiar-face cards','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_language','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_handheld_mini_books','Hand-held mini books','Handheld Mini Books',7,'A small sturdy book can be easier for your baby to hold, mouth, turn and bring to you. It is less about sitting still for a story and more about giving books a place in ordinary little moments.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','If they already have board books, choose a smaller, tougher one for pram, changing bag or nappy-time use.','Hand-held mini books','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_words','I’m chatting, clapping and waving',4,true,'ent_need_language','I’m chatting, clapping and waving','Words may still be limited, but communication is becoming richer. Your baby may babble, clap, wave, point, copy sounds or respond to familiar names. Books, songs, silly voices and small choices give them more reasons to join in.','for_your_child','cat_simple_puppets_words','Simple puppets for silly voices','Simple Puppets Words',8,'A simple puppet gives your voice somewhere funny to go. It can wave, hide, ask for a kiss, make a sound and then pause, giving your baby a clear little turn in the exchange.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A fresher idea that still fits this stage.','A soft toy can do the same job if you give it a voice.','Simple puppets','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_feeding','Mealtimes are changing',5,true,'ent_need_self_feeding','Mealtimes are changing','Your baby may be getting more involved at mealtimes: picking up food, trying water from a cup and watching everyone else eat. The helpful focus is safe textures, steady seating, calm supervision and practical clean-up rather than turning meals into a performance.','for_both','cat_highchair','Highchair or upright feeding seat','Highchair',1,'As finger foods and cup practice become more active, a steady upright seat matters. The right setup helps your baby sit safely, reach food and stay visible while you supervise every mouthful.','for_both','product_category','things_that_can_help','Things that can help',1,true,false,false,'Parent buy',NULL,NULL,'Highchair or upright feeding seat','conor','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_feeding','Mealtimes are changing',5,true,'ent_need_self_feeding','Mealtimes are changing','Your baby may be getting more involved at mealtimes: picking up food, trying water from a cup and watching everyone else eat. The helpful focus is safe textures, steady seating, calm supervision and practical clean-up rather than turning meals into a performance.','for_both','cat_open_cup','Open cup practice','Open Cup',2,'A small open cup with water can help your baby practise sipping while you stay close. Expect spills. The useful bit is little, calm practice rather than switching away from milk feeds suddenly.','for_both','product_category','things_that_can_help','Things that can help',2,true,false,false,'Parent buy',NULL,NULL,'Small open cup','conor','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_feeding','Mealtimes are changing',5,true,'ent_need_self_feeding','Mealtimes are changing','Your baby may be getting more involved at mealtimes: picking up food, trying water from a cup and watching everyone else eat. The helpful focus is safe textures, steady seating, calm supervision and practical clean-up rather than turning meals into a performance.','for_both','cat_finger_food_prep','Finger-food prep tools','Finger Food Prep',3,'The key buying job here is not a special baby gadget. It is having simple ways to cut, mash, cool and serve food safely so your baby can pick up pieces that suit their stage.','for_both','setup','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use ordinary kitchen tools if they already make safe shapes easy.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_feeding','Mealtimes are changing',5,true,'ent_need_mealtime','Mealtimes are changing','Your baby may be getting more involved at mealtimes: picking up food, trying water from a cup and watching everyone else eat. The helpful focus is safe textures, steady seating, calm supervision and practical clean-up rather than turning meals into a performance.','for_both','cat_bibs_mats','Bibs and clean-up mats','Bibs Mats',4,'Finger foods, water practice and self-feeding can get messy fast. A bib, wipe-clean mat or simple floor cover can make it easier to let your baby practise without turning every meal into a clean-up event.','for_both','product_category','things_that_can_help','Things that can help',3,true,false,false,'Parent buy',NULL,NULL,'Bibs and clean-up mats','conor','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_feeding','Mealtimes are changing',5,true,'ent_need_mealtime','Mealtimes are changing','Your baby may be getting more involved at mealtimes: picking up food, trying water from a cup and watching everyone else eat. The helpful focus is safe textures, steady seating, calm supervision and practical clean-up rather than turning meals into a performance.','for_both','cat_family_meal_plan','A simple family meal rhythm','Family Meal Plan',5,'Sitting with the family, tasting safe versions of suitable foods and hearing mealtime chat can be useful practice. Keep it ordinary: small amounts, calm supervision and no pressure to finish.','for_both','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,'No product needed.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_feeding','Mealtimes are changing',5,true,'ent_need_mealtime','Mealtimes are changing','Your baby may be getting more involved at mealtimes: picking up food, trying water from a cup and watching everyone else eat. The helpful focus is safe textures, steady seating, calm supervision and practical clean-up rather than turning meals into a performance.','for_both','cat_pouches_caution','Pouch and jar balance','Pouches Caution',6,'Pouches and jars can help on busy days, but they work best as a backup rather than the everyday default. Serving food from a spoon or bowl also gives your baby more chance to see, smell and explore texture.','for_both','safety_check','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,NULL,'Shop-bought pouches and jars','conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_feeding','Mealtimes are changing',5,true,'ent_need_feeding','Mealtimes are changing','Your baby may be getting more involved at mealtimes: picking up food, trying water from a cup and watching everyone else eat. The helpful focus is safe textures, steady seating, calm supervision and practical clean-up rather than turning meals into a performance.','for_both','cat_highchair_harness_check','Highchair harness check','Highchair Harness Check',7,'If your baby is leaning, twisting or reaching for food, check the highchair harness is fitted and used every time. It is a small habit that matters more as meals become busier.','for_both','safety_check','quick_checks','Quick checks',2,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_babyproof','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_stair_gates','Stair gate placement','Stair Gates',1,'If crawling, pulling up or cruising has started, stairs need a fresh look. Gates at the top and bottom can reduce risk, but placement and fitting matter more than buying in a hurry.','for_you','safety_check','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,NULL,'Stair gates','conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_babyproof','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_furniture_anchors','Furniture anchors','Furniture Anchors',2,'Babies can suddenly use furniture as a handle. Check tall or heavy items that could tip, especially drawers, bookcases and kitchen appliances, and anchor anything risky before it becomes part of their route.','for_you','safety_check','quick_checks','Quick checks',2,false,false,false,'Quick check',NULL,NULL,'Furniture anchors and anti-tip straps','conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_babyproof','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_cupboard_locks','Cupboard locks and poison storage','Cupboard Locks',3,'Once little hands can move further, low cupboards deserve a proper sweep. Lock away medicines, cleaning products and chemicals, and do not rely on a cupboard being boring to keep it ignored.','for_you','safety_check','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,'Cupboard locks','conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_babyproof','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_blind_cord_cleats','Blind cord cleats','Blind Cord Cleats',4,'Cords can be easy to miss until your baby is moving around the room. Check curtains and blinds now, and use a cleat or tidy to keep cords fixed up and out of reach.','for_you','safety_check','quick_checks','Quick checks',4,false,false,false,'Quick check',NULL,NULL,'Blind cord cleats and cord tidy','conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_bath','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_bath_supervision','Bath supervision and water-play rules','Bath Supervision',5,'Bath cups and water play can be brilliant, but the safety rule stays simple: stay with your baby the whole time. Bath seats or rings do not replace adult supervision.','for_you','safety_check','quick_checks','Quick checks',5,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_babyproof','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_exclude_baby_walker','Skip seated baby walkers','Exclude Baby Walker',6,'A seated baby walker can look like a helpful shortcut, but safety sources do not recommend them. If your baby wants to move, focus on floor space, stable support and supervised practice instead.','for_you','safety_check','quick_checks','Quick checks',6,false,false,false,'Quick check',NULL,NULL,'Seated baby walkers','conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_babyproof','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_bag_sweep','Plastic and nappy bag sweep','Bag Sweep',7,'Do one quick low-level sweep for plastic bags and nappy sacks. They can end up in reachable places after changes, deliveries or shopping, just when your baby is getting faster at finding things.','for_you','safety_check','quick_checks','Quick checks',7,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_safety','Keep little hands safer',6,true,'ent_need_transport','Keep little hands safer','As babies move further and put more things in their mouths, ordinary rooms can change quickly. A calm safety sweep now can make crawling, pulling up and exploring feel easier, without making the whole home feel off-limits.','for_you','cat_sling_ticks_check','Sling TICKS check','Sling Ticks Check',8,'If you still carry your baby in a sling, the fit needs to stay right as they grow. Check the TICKS basics: tight, in view, close enough to kiss, chin off chest and supported back.','for_you','safety_check','quick_checks','Quick checks',8,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_need_emotion','I’m noticing faces and feelings','Your baby may be watching expressions, recognising familiar people and beginning to enjoy little caring moments with dolls, soft toys or family photos. Books and playful voices can help them connect faces, feelings, sounds and everyday routines.','for_your_child','cat_feelings_faces_books','Faces and feelings books','Feelings Faces Books',1,'Books with faces and feelings can make expression-watching part of everyday play. Point to happy, sad, surprised or tired faces, then copy the expression and pause for your baby to watch you.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A fresher idea that still fits this stage.','If they already have books, choose one with clear faces or emotions rather than another general story.','Faces and feelings books','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_need_emotion','I’m noticing faces and feelings','Your baby may be watching expressions, recognising familiar people and beginning to enjoy little caring moments with dolls, soft toys or family photos. Books and playful voices can help them connect faces, feelings, sounds and everyday routines.','for_your_child','cat_soft_doll','Soft doll or cuddly care play','Soft Doll',2,'A soft doll or cuddly toy can become someone to cuddle, pat, feed pretend food to, or look for. Keep it simple and washable, with no tiny accessories needed.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','If they already have soft toys, give one a caring role before buying more.','Soft doll or cuddly toy','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_need_books','I’m noticing faces and feelings','Your baby may be watching expressions, recognising familiar people and beginning to enjoy little caring moments with dolls, soft toys or family photos. Books and playful voices can help them connect faces, feelings, sounds and everyday routines.','for_your_child','cat_animal_mini_books','Animal mini books','Animal Mini Books',3,'Animal books work well because they invite little sounds, pointing and repeated favourites. A small sturdy format can also fit short moments: nappy time, pram waits or a quick reset.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A familiar, low-risk gift if they do not already have one.','Check whether the family already has lots of animal books.','Animal mini books','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_need_emotion','I’m noticing faces and feelings','Your baby may be watching expressions, recognising familiar people and beginning to enjoy little caring moments with dolls, soft toys or family photos. Books and playful voices can help them connect faces, feelings, sounds and everyday routines.','for_your_child','cat_puppets','Puppets and different voices','Puppets',4,'A puppet can appear, disappear, wave, squeak, sing or ask for a cuddle. The useful bit is your pause after the puppet does something, so your baby gets a turn to react.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A fresher idea that still fits this stage.','A favourite soft toy can become a puppet if you give it a voice.','Simple puppets','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_need_emotion','I’m noticing faces and feelings','Your baby may be watching expressions, recognising familiar people and beginning to enjoy little caring moments with dolls, soft toys or family photos. Books and playful voices can help them connect faces, feelings, sounds and everyday routines.','for_your_child','cat_family_photos','Family photos and familiar people','Family Photos',5,'Print a few familiar faces, put them in a small album, or show them before a visit or call. Naming real people can feel more meaningful than generic pictures.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use photos you already have.',NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_need_bilateral','I’m noticing faces and feelings','Your baby may be watching expressions, recognising familiar people and beginning to enjoy little caring moments with dolls, soft toys or family photos. Books and playful voices can help them connect faces, feelings, sounds and everyday routines.','for_your_child','cat_texture_sensory','Texture and sensory balls','Texture Sensory',6,'A large textured ball can invite reaching, squeezing, rolling and passing, especially if your baby likes touch-and-feel play. Keep it simple, safe to mouth and easy to clean.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A fresher idea that still fits this stage.','Skip if they already have several balls or sensory toys.','Texture and sensory balls','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_need_social','I’m noticing faces and feelings','Your baby may be watching expressions, recognising familiar people and beginning to enjoy little caring moments with dolls, soft toys or family photos. Books and playful voices can help them connect faces, feelings, sounds and everyday routines.','for_your_child','cat_baby_photo_book','Baby photo book or soft album','Baby Photo Book',7,'A baby-safe photo book can be a lovely gift if the buyer can include family faces. It gives naming, recognition and little emotional moments a concrete place in the day.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Good gift','A fresher idea that still fits this stage.','A normal printed photo album works if it is safe and supervised.','Baby photo book or soft album','both','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_days','Make the day feel easier',8,true,'ent_need_parent_day','Make the day feel easier','Some days at this age can feel busy without being very structured. A walk, a library floor moment, a bath cup game or one small activity basket can be enough to give everyone a reset without creating a full entertainment plan.','for_both','cat_pram_walks','Pram walks and naming trips','Pram Walks',1,'A short pram or pushchair walk can count as a proper activity. Point out dogs, buses, birds or trees, and let the rhythm of being outside do some of the work for both of you.','for_both','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_days','Make the day feel easier',8,true,'ent_need_parent_day','Make the day feel easier','Some days at this age can feel busy without being very structured. A walk, a library floor moment, a bath cup game or one small activity basket can be enough to give everyone a reset without creating a full entertainment plan.','for_both','cat_library_baby_group','Library or baby group floor time','Library Baby Group',2,'A library, baby group or community floor session can offer new faces and toys without needing to buy more. It also helps parents who need a change of scene as much as the baby does.','for_both','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_days','Make the day feel easier',8,true,'ent_need_parent_day','Make the day feel easier','Some days at this age can feel busy without being very structured. A walk, a library floor moment, a bath cup game or one small activity basket can be enough to give everyone a reset without creating a full entertainment plan.','for_both','cat_bubbles','Bubbles for watching and reaching','Bubbles',3,'Bubbles can turn a flat moment into watching, reaching, laughing and looking again. Use them outside or in a wipeable space, and keep the bottle in adult hands.','for_both','product_category','things_that_can_help','Things that can help',1,true,false,false,'Parent buy',NULL,NULL,'Bubble wand or bubble tube','conor','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_days','Make the day feel easier',8,true,'ent_need_parent_day','Make the day feel easier','Some days at this age can feel busy without being very structured. A walk, a library floor moment, a bath cup game or one small activity basket can be enough to give everyone a reset without creating a full entertainment plan.','for_both','cat_bath_cups','Bath cups and pouring play','Bath Cups',4,'A cup in the bath can become fill, tip, splash, watch and repeat. It is simple, but it gives water play a clear little job while you keep supervision constant.','for_both','product_category','things_that_can_help','Things that can help',2,true,false,false,'Parent buy',NULL,NULL,'Bath cups and pouring set','conor','See Ember Picks','product_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_days','Make the day feel easier',8,true,'ent_need_parent_day','Make the day feel easier','Some days at this age can feel busy without being very structured. A walk, a library floor moment, a bath cup game or one small activity basket can be enough to give everyone a reset without creating a full entertainment plan.','for_both','cat_toy_rotation','Tiny toy rotation or activity basket','Toy Rotation',5,'You do not need a full new set of toys. Put two or three safe, age-fit things in one basket and swap them every so often. Novelty can come from less clutter, not more buying.','for_both','setup','useful_ideas','Useful ideas',3,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_days','Make the day feel easier',8,true,'ent_need_parent_day','Make the day feel easier','Some days at this age can feel busy without being very structured. A walk, a library floor moment, a bath cup game or one small activity basket can be enough to give everyone a reset without creating a full entertainment plan.','for_both','cat_safe_laundry_play','Safe laundry basket play','Safe Laundry Play',6,'A laundry basket can become a safe place to pull out soft cloths, peek through holes or practise putting things in and out. Keep it empty of hazards and use it only while you are nearby.','for_both','setup','useful_ideas','Useful ideas',4,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('9-12m','10–12 months',10,12,true,'ent_cluster_days','Make the day feel easier',8,true,'ent_need_parent_day','Make the day feel easier','Some days at this age can feel busy without being very structured. A walk, a library floor moment, a bath cup game or one small activity basket can be enough to give everyone a reset without creating a full entertainment plan.','for_both','cat_tiny_daily_play_loop','A tiny daily play loop','Tiny Daily Play Loop',7,'Some parents worry they are not doing enough at this age. A tiny loop can be enough: one short song, one book, a few minutes on the floor, or a pram walk when everyone needs a reset.','for_both','activity','useful_ideas','Useful ideas',5,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions');

CREATE TEMP TABLE tmp_discover_stage1_wrappers AS
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description,
  NULLIF(TRIM(COALESCE(s.audience_lens, '')), '') AS audience_lens
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY s.stage1_wrapper_ux_slug
      ORDER BY s.min_months ASC, s.age_band_id ASC, s.stage1_wrapper_rank_in_band ASC
    ) AS rn
  FROM tmp_discover_projection_stage s
) s
WHERE s.rn = 1;

CREATE TEMP TABLE tmp_discover_stage1_age_band_wrappers AS
SELECT
  s.age_band_id,
  s.stage1_wrapper_ux_slug,
  MIN(s.stage1_wrapper_rank_in_band) AS stage1_wrapper_rank_in_band,
  BOOL_OR(s.stage1_mapping_is_active) AS stage1_mapping_is_active
FROM tmp_discover_projection_stage s
GROUP BY s.age_band_id, s.stage1_wrapper_ux_slug;

CREATE TEMP TABLE tmp_discover_stage1_wrapper_needs AS
SELECT
  s.stage1_wrapper_ux_slug,
  s.development_need_slug,
  s.development_need_canonical_name
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY s.stage1_wrapper_ux_slug
      ORDER BY s.stage2_play_ideas_rank ASC, s.min_months ASC, s.age_band_id ASC
    ) AS rn
  FROM tmp_discover_projection_stage s
) s
WHERE s.rn = 1;

CREATE TEMP TABLE tmp_discover_stage2_category_types AS
SELECT
  s.stage2_category_type_slug,
  s.stage2_category_type_name
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(s.stage2_category_type_slug))
      ORDER BY s.min_months ASC, s.age_band_id ASC, s.stage2_play_ideas_rank ASC
    ) AS rn
  FROM tmp_discover_projection_stage s
) s
WHERE s.rn = 1;

INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT DISTINCT
  s.age_band_id,
  s.age_band_label,
  s.min_months,
  s.max_months,
  s.age_band_is_active
FROM tmp_discover_projection_stage s
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = EXCLUDED.is_active,
  updated_at = now();

INSERT INTO public.pl_development_needs (
  name,
  slug,
  plain_english_description,
  why_it_matters
)
SELECT
  src.development_need_canonical_name,
  src.development_need_slug,
  COALESCE(src.stage1_why_it_matters_ux_description, ''),
  COALESCE(src.stage1_why_it_matters_ux_description, '')
FROM (
  SELECT DISTINCT
    s.development_need_slug,
    s.development_need_canonical_name,
    NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
  FROM tmp_discover_projection_stage s
) src
LEFT JOIN public.pl_development_needs dn_slug
  ON LOWER(COALESCE(dn_slug.slug, '')) = LOWER(src.development_need_slug)
LEFT JOIN public.pl_development_needs dn_name
  ON LOWER(COALESCE(dn_name.name, '')) = LOWER(src.development_need_canonical_name)
WHERE dn_slug.id IS NULL
  AND dn_name.id IS NULL
ON CONFLICT (slug) DO NOTHING;

UPDATE public.pl_development_needs dn
SET
  name = src.development_need_canonical_name,
  plain_english_description = COALESCE(src.stage1_why_it_matters_ux_description, ''),
  why_it_matters = COALESCE(src.stage1_why_it_matters_ux_description, ''),
  updated_at = now()
FROM (
  SELECT DISTINCT
    s.development_need_slug,
    s.development_need_canonical_name,
    NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
  FROM tmp_discover_projection_stage s
) src
WHERE LOWER(COALESCE(dn.slug, '')) = LOWER(src.development_need_slug);

INSERT INTO public.pl_ux_wrappers (
  ux_slug,
  ux_label,
  ux_description,
  audience_lens,
  is_active
)
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  s.stage1_why_it_matters_ux_description,
  s.audience_lens,
  true
FROM tmp_discover_stage1_wrappers s
ON CONFLICT (ux_slug) DO UPDATE
SET
  ux_label = EXCLUDED.ux_label,
  ux_description = EXCLUDED.ux_description,
  audience_lens = EXCLUDED.audience_lens,
  is_active = true,
  updated_at = now();

INSERT INTO public.pl_ux_wrapper_needs (
  ux_wrapper_id,
  development_need_id
)
SELECT
  uw.id AS ux_wrapper_id,
  dn.id AS development_need_id
FROM tmp_discover_stage1_wrapper_needs s
JOIN public.pl_ux_wrappers uw
  ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
JOIN LATERAL (
  SELECT d.id
  FROM public.pl_development_needs d
  WHERE LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug)
     OR LOWER(COALESCE(d.name, '')) = LOWER(s.development_need_canonical_name)
  ORDER BY
    CASE WHEN LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug) THEN 0 ELSE 1 END,
    d.id
  LIMIT 1
) dn ON true
ON CONFLICT (ux_wrapper_id) DO UPDATE
SET
  development_need_id = EXCLUDED.development_need_id,
  updated_at = now();

UPDATE public.pl_age_band_ux_wrappers abuw
SET
  is_active = false,
  updated_at = now()
WHERE abuw.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_discover_stage1_age_band_wrappers)
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_discover_stage1_age_band_wrappers s
    JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
    WHERE s.age_band_id = abuw.age_band_id
      AND uw.id = abuw.ux_wrapper_id
  );

INSERT INTO public.pl_age_band_ux_wrappers (
  age_band_id,
  ux_wrapper_id,
  rank,
  is_active
)
SELECT
  s.age_band_id,
  uw.id,
  s.stage1_wrapper_rank_in_band,
  s.stage1_mapping_is_active
FROM tmp_discover_stage1_age_band_wrappers s
JOIN public.pl_ux_wrappers uw
  ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  is_active = EXCLUDED.is_active,
  updated_at = now();

INSERT INTO public.pl_category_types (
  slug,
  label,
  name,
  description,
  safety_notes
)
SELECT
  src.stage2_category_type_slug,
  src.stage2_category_type_name,
  src.stage2_category_type_name,
  NULL,
  NULL
FROM tmp_discover_stage2_category_types src
LEFT JOIN public.pl_category_types ct_slug
  ON LOWER(COALESCE(ct_slug.slug, '')) = LOWER(src.stage2_category_type_slug)
WHERE ct_slug.id IS NULL
ON CONFLICT (slug) DO NOTHING;

CREATE TEMP TABLE tmp_discover_resolved_need_category AS
SELECT DISTINCT ON (s.age_band_id, dn.id, ct.id)
  s.age_band_id,
  dn.id AS development_need_id,
  ct.id AS category_type_id,
  s.stage2_play_ideas_rank AS rank,
  NULLIF(TRIM(COALESCE(s.stage2_play_idea_mapping_rationale, '')), '') AS rationale,
  NULLIF(TRIM(COALESCE(s.stage2_category_type_label, '')), '') AS display_label,
  NULLIF(TRIM(COALESCE(s.category_audience_lens, '')), '') AS audience_lens,
  s.content_type,
  s.ui_lane,
  NULLIF(TRIM(COALESCE(s.ui_section_title, '')), '') AS ui_section_title,
  s.lane_rank,
  s.show_ember_picks,
  s.show_gift_action,
  s.gift_friendly,
  NULLIF(TRIM(COALESCE(s.buyer_mode_label, '')), '') AS buyer_mode_label,
  NULLIF(TRIM(COALESCE(s.gift_note, '')), '') AS gift_note,
  NULLIF(TRIM(COALESCE(s.ownership_note, '')), '') AS ownership_note,
  NULLIF(TRIM(COALESCE(s.product_family_label, '')), '') AS product_family_label,
  s.primary_persona,
  NULLIF(TRIM(COALESCE(s.card_cta_label, '')), '') AS card_cta_label,
  s.render_rule
FROM tmp_discover_projection_stage s
JOIN LATERAL (
  SELECT d.id
  FROM public.pl_development_needs d
  WHERE LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug)
     OR LOWER(COALESCE(d.name, '')) = LOWER(s.development_need_canonical_name)
  ORDER BY
    CASE WHEN LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug) THEN 0 ELSE 1 END,
    d.id
  LIMIT 1
) dn ON true
JOIN LATERAL (
  SELECT c.id
  FROM public.pl_category_types c
  WHERE LOWER(COALESCE(c.slug, '')) = LOWER(s.stage2_category_type_slug)
     OR LOWER(COALESCE(c.name, '')) = LOWER(s.stage2_category_type_name)
     OR LOWER(COALESCE(c.label, '')) = LOWER(s.stage2_category_type_label)
  ORDER BY
    CASE
      WHEN LOWER(COALESCE(c.slug, '')) = LOWER(s.stage2_category_type_slug) THEN 0
      WHEN LOWER(COALESCE(c.name, '')) = LOWER(s.stage2_category_type_name) THEN 1
      ELSE 2
    END,
    c.id
  LIMIT 1
) ct ON true
ORDER BY
  s.age_band_id,
  dn.id,
  ct.id,
  s.stage1_wrapper_rank_in_band DESC,
  s.stage2_play_ideas_rank ASC;

UPDATE public.pl_age_band_development_need_category_types m
SET
  is_active = false,
  updated_at = now()
WHERE m.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_discover_projection_stage)
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_discover_resolved_need_category r
    WHERE r.age_band_id = m.age_band_id
      AND r.development_need_id = m.development_need_id
      AND r.category_type_id = m.category_type_id
  );

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id,
  development_need_id,
  category_type_id,
  rank,
  rationale,
  display_label,
  audience_lens,
  content_type,
  ui_lane,
  ui_section_title,
  lane_rank,
  show_ember_picks,
  show_gift_action,
  gift_friendly,
  buyer_mode_label,
  gift_note,
  ownership_note,
  product_family_label,
  primary_persona,
  card_cta_label,
  render_rule,
  is_active
)
SELECT
  r.age_band_id,
  r.development_need_id,
  r.category_type_id,
  r.rank,
  r.rationale,
  r.display_label,
  r.audience_lens,
  r.content_type,
  r.ui_lane,
  r.ui_section_title,
  r.lane_rank,
  r.show_ember_picks,
  r.show_gift_action,
  r.gift_friendly,
  r.buyer_mode_label,
  r.gift_note,
  r.ownership_note,
  r.product_family_label,
  r.primary_persona,
  r.card_cta_label,
  r.render_rule,
  true
FROM tmp_discover_resolved_need_category r
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  display_label = EXCLUDED.display_label,
  audience_lens = EXCLUDED.audience_lens,
  content_type = EXCLUDED.content_type,
  ui_lane = EXCLUDED.ui_lane,
  ui_section_title = EXCLUDED.ui_section_title,
  lane_rank = EXCLUDED.lane_rank,
  show_ember_picks = EXCLUDED.show_ember_picks,
  show_gift_action = EXCLUDED.show_gift_action,
  gift_friendly = EXCLUDED.gift_friendly,
  buyer_mode_label = EXCLUDED.buyer_mode_label,
  gift_note = EXCLUDED.gift_note,
  ownership_note = EXCLUDED.ownership_note,
  product_family_label = EXCLUDED.product_family_label,
  primary_persona = EXCLUDED.primary_persona,
  card_cta_label = EXCLUDED.card_cta_label,
  render_rule = EXCLUDED.render_rule,
  is_active = true,
  updated_at = now();

UPDATE public.pl_age_band_category_type_products p
SET
  is_active = false,
  updated_at = now()
WHERE p.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_discover_projection_stage);

DO $$
DECLARE
  v_rows_loaded INTEGER;
  v_rows_9_12m INTEGER;
  v_clusters_9_12m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_9_12m FROM tmp_discover_projection_stage WHERE age_band_id = '9-12m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_9_12m
  FROM tmp_discover_projection_stage WHERE age_band_id = '9-12m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('9-12m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 60)', v_rows_loaded;
  RAISE NOTICE '9-12m rows: % (expected 60), clusters: % (expected 8)', v_rows_9_12m, v_clusters_9_12m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 60 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_9_12m <> 60 THEN
    RAISE EXCEPTION 'Row count validation failed for 9-12m';
  END IF;
  IF v_clusters_9_12m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 9-12m';
  END IF;
END $$;
-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('9-12m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('9-12m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('9-12m');


COMMIT;
