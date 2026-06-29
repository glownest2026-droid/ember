-- Discover pilot import: age bands 19–21 months, 25–27 months, 31–33 months
-- Source: discover_projection tab from Ember ABI workbooks (19-21m + 25-27m + 31-33m)
-- Stage 3 intentionally empty. Idempotent: safe to re-run.

-- Legacy slug drift merges (workbook category_entity_id wins)

-- potty → cat_potty
DO $merge$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'potty')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_potty') THEN
    UPDATE public.pl_category_types SET slug = 'cat_potty', updated_at = now() WHERE slug = 'potty';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'potty')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_potty') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_potty'
    WHERE legacy.slug = 'potty'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'potty');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_potty'
    WHERE legacy.slug = 'potty'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'potty');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_potty'
    WHERE legacy.slug = 'potty'
      AND p.category_type_id = legacy.id;
  END IF;
END $merge$;


-- toilet-training-seat → cat_toilet_training_seat
DO $merge$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'toilet-training-seat')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_toilet_training_seat') THEN
    UPDATE public.pl_category_types SET slug = 'cat_toilet_training_seat', updated_at = now() WHERE slug = 'toilet-training-seat';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'toilet-training-seat')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_toilet_training_seat') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toilet_training_seat'
    WHERE legacy.slug = 'toilet-training-seat'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'toilet-training-seat');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toilet_training_seat'
    WHERE legacy.slug = 'toilet-training-seat'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'toilet-training-seat');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toilet_training_seat'
    WHERE legacy.slug = 'toilet-training-seat'
      AND p.category_type_id = legacy.id;
  END IF;
END $merge$;


-- toilet_training_seat → cat_toilet_training_seat
DO $merge$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'toilet_training_seat')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_toilet_training_seat') THEN
    UPDATE public.pl_category_types SET slug = 'cat_toilet_training_seat', updated_at = now() WHERE slug = 'toilet_training_seat';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'toilet_training_seat')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_toilet_training_seat') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toilet_training_seat'
    WHERE legacy.slug = 'toilet_training_seat'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'toilet_training_seat');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toilet_training_seat'
    WHERE legacy.slug = 'toilet_training_seat'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'toilet_training_seat');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_toilet_training_seat'
    WHERE legacy.slug = 'toilet_training_seat'
      AND p.category_type_id = legacy.id;
  END IF;
END $merge$;


-- training_pants → cat_training_pants
DO $merge$
BEGIN
  IF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'training_pants')
     AND NOT EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_training_pants') THEN
    UPDATE public.pl_category_types SET slug = 'cat_training_pants', updated_at = now() WHERE slug = 'training_pants';
  ELSIF EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'training_pants')
     AND EXISTS (SELECT 1 FROM public.pl_category_types WHERE slug = 'cat_training_pants') THEN
    UPDATE public.pl_age_band_development_need_category_types m
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_training_pants'
    WHERE legacy.slug = 'training_pants'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'training_pants');

    UPDATE public.pl_category_type_images img
    SET category_type_id = canonical.id
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_training_pants'
    WHERE legacy.slug = 'training_pants'
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
    WHERE category_type_id IN (SELECT id FROM public.pl_category_types WHERE slug = 'training_pants');

    UPDATE public.products p
    SET category_type_id = canonical.id, updated_at = now()
    FROM public.pl_category_types legacy
    JOIN public.pl_category_types canonical ON canonical.slug = 'cat_training_pants'
    WHERE legacy.slug = 'training_pants'
      AND p.category_type_id = legacy.id;
  END IF;
END $merge$;


BEGIN;

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
  category_audience_lens TEXT
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
  category_audience_lens
)
VALUES
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_words_pointing','Words and pointing',1,true,'need_words_gestures','Little words and pointy fingers','Your toddler may be using more gestures, pointing at pictures and trying little phrases. Naming body parts, reading familiar books and adding words to daily routines can help them connect what they understand with what they are beginning to say, without any pressure.','for_your_child','cat_first_word_picture_books','First-word picture books','First Word Picture Books',1,'Your toddler may be pointing, naming or waiting for you to say the word. First-word picture books give lots of easy chances to repeat, pause and expand what they try to say, especially around animals, body parts and everyday objects.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_words_pointing','Words and pointing',1,true,'need_words_gestures','Little words and pointy fingers','Your toddler may be using more gestures, pointing at pictures and trying little phrases. Naming body parts, reading familiar books and adding words to daily routines can help them connect what they understand with what they are beginning to say, without any pressure.','for_your_child','cat_body_part_books_games','Body-part books and games','Body Part Books Games',2,'As body-part pointing starts to appear, bath time, dressing and simple books can become easy naming moments. Asking for eyes, nose or tummy gives your toddler a clear word-to-action link and lets them practise understanding before speech is fully clear.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_words_pointing','Words and pointing',1,true,'need_words_gestures','Little words and pointy fingers','Your toddler may be using more gestures, pointing at pictures and trying little phrases. Naming body parts, reading familiar books and adding words to daily routines can help them connect what they understand with what they are beginning to say, without any pressure.','for_your_child','cat_naming_walks','Naming walks and object hunts','Naming Walks',3,'A short walk, buggy trip or lap around the house can become a naming game. Pointing out buses, shoes, dogs and doors helps your toddler connect real objects with words, especially if you pause and let them point, copy or answer.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_words_pointing','Words and pointing',1,true,'need_words_gestures','Little words and pointy fingers','Your toddler may be using more gestures, pointing at pictures and trying little phrases. Naming body parts, reading familiar books and adding words to daily routines can help them connect what they understand with what they are beginning to say, without any pressure.','for_your_child','cat_songs_action_games','Songs and action games','Songs Action Games',4,'Songs with actions give your toddler a simple way to join in before every word is clear. Clapping, nodding, pointing or doing the same action again can support listening, gestures, turn-taking and early memory without making language feel like a lesson.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pretend_copying','Pretend and copy',2,true,'need_pretend_copying','Pretend worlds and everyday copying','Your toddler may be copying the small things they see every day, from stirring a bowl to caring for a teddy. Pretend play lets them practise language, memory and social understanding in a safe, funny way that feels close to real family life.','for_your_child','cat_doll_soft_toy_care','Doll and soft-toy care play','Doll Soft Toy Care',1,'Your toddler may copy feeding, wiping or cuddling a soft toy after seeing those routines at home. Doll and teddy care gives them a safe way to practise social understanding, language and sequencing, while making everyday care feel funny and familiar.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pretend_copying','Pretend and copy',2,true,'need_pretend_copying','Pretend worlds and everyday copying','Your toddler may be copying the small things they see every day, from stirring a bowl to caring for a teddy. Pretend play lets them practise language, memory and social understanding in a safe, funny way that feels close to real family life.','for_your_child','cat_toy_cups_spoons','Pretend cups, spoons and food','Toy Cups Spoons',2,'Pretend cups, spoons and food let your toddler copy the routines they watch every day. They can stir, offer a teddy a drink or put food on a plate, giving them a playful way to connect objects, actions and early words.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pretend_copying','Pretend and copy',2,true,'need_pretend_copying','Pretend worlds and everyday copying','Your toddler may be copying the small things they see every day, from stirring a bowl to caring for a teddy. Pretend play lets them practise language, memory and social understanding in a safe, funny way that feels close to real family life.','for_your_child','cat_play_kitchen_household_props','Play kitchen and household props','Play Kitchen Household Props',3,'A small kitchen, pan, whisk or safe household prop can make imitation feel irresistible. Pretend chores and cooking help your toddler practise memory, language and social roles, especially when you join in briefly and give words to what they are doing.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pretend_copying','Pretend and copy',2,true,'need_pretend_copying','Pretend worlds and everyday copying','Your toddler may be copying the small things they see every day, from stirring a bowl to caring for a teddy. Pretend play lets them practise language, memory and social understanding in a safe, funny way that feels close to real family life.','for_your_child','cat_toddler_bag_carry','Carry bags and little errands','Toddler Bag Carry',4,'Toddlers often love putting things in a bag, walking away and coming back again. A small bag or basket can turn carrying into pretend errands, helping them practise balance, object choices, language and the satisfying feeling of having a job.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pretend_copying','Pretend and copy',2,true,'need_pretend_copying','Pretend worlds and everyday copying','Your toddler may be copying the small things they see every day, from stirring a bowl to caring for a teddy. Pretend play lets them practise language, memory and social understanding in a safe, funny way that feels close to real family life.','for_your_child','cat_doctor_visit_books','Doctor-visit and care books','Doctor Visit Books',5,'Books about check-ups, care or everyday routines can help your toddler make sense of new experiences before they happen. Pointing, naming and pretending with a toy doctor scene can make unfamiliar moments feel more predictable and easier to talk about.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_busy_hands','Busy hands',3,true,'need_two_handed_control','Busy hands, sorting and matching','Your toddler may be turning objects, opening lids, matching shapes or repeating the same little challenge again and again. These hands-on games give them a satisfying way to practise two-handed control, attention and problem-solving while still feeling playful.','for_your_child','cat_shape_sorters_puzzles','Shape sorters and first puzzles','Shape Sorters Puzzles',1,'A chunky puzzle or shape sorter gives your toddler a clear problem they can solve with their hands. Turning a piece, testing a space and trying again supports focus, hand control and early problem-solving, especially when adults wait before stepping in.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_busy_hands','Busy hands',3,true,'need_two_handed_control','Busy hands, sorting and matching','Your toddler may be turning objects, opening lids, matching shapes or repeating the same little challenge again and again. These hands-on games give them a satisfying way to practise two-handed control, attention and problem-solving while still feeling playful.','for_your_child','cat_stacking_pegboard','Stacking pegboards and block towers','Stacking Pegboard',2,'Stacking, slotting and knocking down can keep a toddler absorbed because the feedback is instant. Pegboards, blocks and simple towers support two-handed coordination, concentration and problem-solving while letting your child repeat the challenge at their own pace.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_busy_hands','Busy hands',3,true,'need_two_handed_control','Busy hands, sorting and matching','Your toddler may be turning objects, opening lids, matching shapes or repeating the same little challenge again and again. These hands-on games give them a satisfying way to practise two-handed control, attention and problem-solving while still feeling playful.','for_your_child','cat_matching_animals_figures','Matching animals and chunky figures','Matching Animals Figures',3,'Animal figures, cards or matching pockets let toddlers compare what they can hold with what they can see in a picture. This can support naming, attention and early sorting, especially when you use simple words and let them try the match themselves.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_busy_hands','Busy hands',3,true,'need_two_handed_control','Busy hands, sorting and matching','Your toddler may be turning objects, opening lids, matching shapes or repeating the same little challenge again and again. These hands-on games give them a satisfying way to practise two-handed control, attention and problem-solving while still feeling playful.','for_your_child','cat_posting_drop_boxes','Posting, dropping and tucking boxes','Posting Drop Boxes',4,'Posting a shape, tucking an animal into a pocket or dropping an object into a box gives toddlers a simple challenge they can repeat. It supports focus, hand control and early planning while still feeling like a satisfying game.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_busy_hands','Busy hands',3,true,'need_two_handed_control','Busy hands, sorting and matching','Your toddler may be turning objects, opening lids, matching shapes or repeating the same little challenge again and again. These hands-on games give them a satisfying way to practise two-handed control, attention and problem-solving while still feeling playful.','for_your_child','cat_latch_busy_boards','Latches, lids and busy boards','Latch Busy Boards',5,'Toddlers may be fascinated by lids, switches, latches and buttons because each one does something. A safe busy board or container game can support two-handed control and cause-and-effect thinking, while letting them practise patience through a visible challenge.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_move_climb','Move and climb',4,true,'need_gross_motor','Running, climbing and ball play','Your toddler may be faster on their feet, keen to climb and delighted by chasing or kicking a ball. Simple movement play helps them test balance, coordination and confidence, while the grown-up job becomes setting up safe spaces for all that energy.','for_your_child','cat_soft_graspable_balls','Soft balls to kick, roll and chase','Soft Graspable Balls',1,'Kicking, rolling or chasing a soft ball gives your toddler a joyful reason to move. It supports balance, coordination and early turn-taking, especially when you keep the game simple: roll it back, name the action and celebrate the next try.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_move_climb','Move and climb',4,true,'need_gross_motor','Running, climbing and ball play','Your toddler may be faster on their feet, keen to climb and delighted by chasing or kicking a ball. Simple movement play helps them test balance, coordination and confidence, while the grown-up job becomes setting up safe spaces for all that energy.','for_your_child','cat_pull_push_toys','Push-and-pull toys','Pull Push Toys',2,'A sturdy push or pull toy can turn walking practice into a purposeful little mission. Your toddler can push, turn, stop and start while testing balance, direction and body control, with enough challenge to stay interesting as they get steadier.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_move_climb','Move and climb',4,true,'need_gross_motor','Running, climbing and ball play','Your toddler may be faster on their feet, keen to climb and delighted by chasing or kicking a ball. Simple movement play helps them test balance, coordination and confidence, while the grown-up job becomes setting up safe spaces for all that energy.','for_your_child','cat_low_climb_tunnel','Low climbing and crawl-through play','Low Climb Tunnel',3,'Climbing may be very appealing now, so a low tunnel, cushion path or supervised soft-play setup can give that energy a safer place to go. These games help balance, strength and confidence while keeping the grown-up close enough to spot risky moves.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_move_climb','Move and climb',4,true,'need_gross_motor','Running, climbing and ball play','Your toddler may be faster on their feet, keen to climb and delighted by chasing or kicking a ball. Simple movement play helps them test balance, coordination and confidence, while the grown-up job becomes setting up safe spaces for all that energy.','for_your_child','cat_music_dance','Music and dancing games','Music Dance',4,'Dancing to a song, stopping when the music stops or copying a simple action can help your toddler connect rhythm, movement and listening. It is also a low-kit way to burn energy indoors when the day needs a reset.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_move_climb','Move and climb',4,true,'need_gross_motor','Running, climbing and ball play','Your toddler may be faster on their feet, keen to climb and delighted by chasing or kicking a ball. Simple movement play helps them test balance, coordination and confidence, while the grown-up job becomes setting up safe spaces for all that energy.','for_your_child','cat_park_swing_walks','Park walks and toddler swings','Park Swing Walks',5,'A short park trip can give your toddler space to walk, run, climb and point at what they notice. Keeping it simple, close and supervised lets them explore physical skills while you add words, pauses and plenty of chances to reset.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pouring_feeding','Pour and feed',5,true,'need_self_feeding','Pouring, scooping and self-feeding','Your toddler may want to pour, scoop, hold the spoon and do more at the table. Small, repeatable mealtime jobs can support hand control, independence and routine language, while still leaving room for spills, refusal and very normal toddler mess.','for_both','cat_pouring_jug_cups','Pouring jugs and water cups','Pouring Jug Cups',1,'Pouring water from a small jug into a cup can feel grown-up and absorbing. It supports hand-eye control, concentration and cause-and-effect, while giving your toddler a safe way to practise everyday independence away from the pressure of mealtimes.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pouring_feeding','Pour and feed',5,true,'need_self_feeding','Pouring, scooping and self-feeding','Your toddler may want to pour, scoop, hold the spoon and do more at the table. Small, repeatable mealtime jobs can support hand control, independence and routine language, while still leaving room for spills, refusal and very normal toddler mess.','for_both','cat_open_cup','Open-cup practice','Open Cup',2,'Your toddler may be able to drink from an open cup but still spill, which is normal. Short, low-stakes practice with water can help them coordinate both hands, slow down and connect mealtime routines with doing more for themselves.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pouring_feeding','Pour and feed',5,true,'need_self_feeding','Pouring, scooping and self-feeding','Your toddler may want to pour, scoop, hold the spoon and do more at the table. Small, repeatable mealtime jobs can support hand control, independence and routine language, while still leaving room for spills, refusal and very normal toddler mess.','for_both','cat_first_spoons_bowls','Small spoons and stable bowls','First Spoons Bowls',3,'Trying to use a spoon can be messy, slow and very useful. A small spoon and stable bowl give your toddler a better chance to scoop, lift and try again, while you keep meals calm and avoid turning eating into a battle.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pouring_feeding','Pour and feed',5,true,'need_self_feeding','Pouring, scooping and self-feeding','Your toddler may want to pour, scoop, hold the spoon and do more at the table. Small, repeatable mealtime jobs can support hand control, independence and routine language, while still leaving room for spills, refusal and very normal toddler mess.','for_both','cat_finger_food_snack_prep','Finger-food and snack prep','Finger Food Snack Prep',4,'As your toddler feeds themselves more often, the grown-up job is making food easy and safe to manage. Preparing round, firm or sticky foods carefully lets them practise independence while reducing choking risk during snacks and family meals.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_pouring_feeding','Pour and feed',5,true,'need_self_feeding','Pouring, scooping and self-feeding','Your toddler may want to pour, scoop, hold the spoon and do more at the table. Small, repeatable mealtime jobs can support hand control, independence and routine language, while still leaving room for spills, refusal and very normal toddler mess.','for_both','cat_mealtime_routine_setup','Calm mealtime setup','Mealtime Routine Setup',5,'Food refusal can be a normal toddler phase, so the setup matters as much as the plate. Small portions, regular snack times, calm reactions and sitting together can make mealtimes feel predictable while your child keeps learning about new foods.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_big_feelings','Big feelings',6,true,'need_emotions_self_control','Big feelings and “me do it” moments','Your toddler may be saying no, asking for more or wanting to do things their way. That push is part of growing independence. Feelings books, simple choices and predictable routines can help them feel understood while they practise waiting, sharing and trying again.','for_your_child','cat_feelings_faces_books','Feelings and faces books','Feelings Faces Books',1,'Books with faces, feelings and everyday scenes can help your toddler start linking expressions with words. Naming sad, cross, happy or worried in a gentle story gives them language for moments that may otherwise arrive as grabbing, crying or shouting.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_big_feelings','Big feelings',6,true,'need_emotions_self_control','Big feelings and “me do it” moments','Your toddler may be saying no, asking for more or wanting to do things their way. That push is part of growing independence. Feelings books, simple choices and predictable routines can help them feel understood while they practise waiting, sharing and trying again.','for_your_child','cat_simple_choice_cards','Simple choice cards and cues','Simple Choice Cards',2,'Two simple choices, shown with a picture or object, can give your toddler a sense of control without opening every decision. This can be useful when independence is growing and words are still catching up with what they want.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_big_feelings','Big feelings',6,true,'need_emotions_self_control','Big feelings and “me do it” moments','Your toddler may be saying no, asking for more or wanting to do things their way. That push is part of growing independence. Feelings books, simple choices and predictable routines can help them feel understood while they practise waiting, sharing and trying again.','for_your_child','cat_routine_songs','Routine songs and transition cues','Routine Songs',3,'A familiar song, phrase or tiny ritual can make transitions easier to understand. Repeating the same cue before brushing teeth, tidying up or leaving the park helps your toddler hear what is coming next and feel more secure in the shift.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_big_feelings','Big feelings',6,true,'need_emotions_self_control','Big feelings and “me do it” moments','Your toddler may be saying no, asking for more or wanting to do things their way. That push is part of growing independence. Feelings books, simple choices and predictable routines can help them feel understood while they practise waiting, sharing and trying again.','for_your_child','cat_comfort_toy','A safe comfort object','Comfort Toy',4,'A familiar soft toy or comfort object can help some toddlers settle through transitions, tired moments or new places. Keep it simple and safe, and use it alongside words and routine cues rather than expecting it to solve every upset.','for_your_child'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_potty_bathroom','Potty practice',7,true,'need_toileting_readiness','Potty learning and bathroom practice','Some toddlers around this stage start showing interest in the toilet, nappies or bathroom routines. Potty learning can begin gently with sitting, handwashing, simple words and stories, long before stopping nappies becomes the main event.','for_both','cat_potty','A simple potty','Potty',1,'A simple potty can become part of bathroom familiarity before toilet training feels like a deadline. Short, relaxed sitting practice helps your toddler understand where wees and poos happen, while keeping the focus on learning rather than performing.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_potty_bathroom','Potty practice',7,true,'need_toileting_readiness','Potty learning and bathroom practice','Some toddlers around this stage start showing interest in the toilet, nappies or bathroom routines. Potty learning can begin gently with sitting, handwashing, simple words and stories, long before stopping nappies becomes the main event.','for_both','cat_potty_books','Potty and bathroom books','Potty Books',2,'Potty books can give your toddler simple words and pictures for a routine that may otherwise feel strange. Reading them away from the bathroom or while sitting nearby can make wees, poos, pants and handwashing part of everyday conversation.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_potty_bathroom','Potty practice',7,true,'need_toileting_readiness','Potty learning and bathroom practice','Some toddlers around this stage start showing interest in the toilet, nappies or bathroom routines. Potty learning can begin gently with sitting, handwashing, simple words and stories, long before stopping nappies becomes the main event.','for_both','cat_step_stool_bathroom','Bathroom step stool','Step Stool Bathroom',3,'A stable bathroom step can help your toddler reach the sink for handwashing, with you close by. It supports the wider bathroom routine around potty learning, dressing and teeth, while giving them a safe way to join in with daily care.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_potty_bathroom','Potty practice',7,true,'need_toileting_readiness','Potty learning and bathroom practice','Some toddlers around this stage start showing interest in the toilet, nappies or bathroom routines. Potty learning can begin gently with sitting, handwashing, simple words and stories, long before stopping nappies becomes the main event.','for_both','cat_toilet_seat_footrest','Toilet seat insert and foot support','Toilet Seat Footrest',4,'Some families prefer a toilet seat insert rather than a potty, especially if space is tight. A secure seat and foot support can help a toddler feel stable while practising, making the routine less physically awkward and easier to repeat calmly.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_potty_bathroom','Potty practice',7,true,'need_toileting_readiness','Potty learning and bathroom practice','Some toddlers around this stage start showing interest in the toilet, nappies or bathroom routines. Potty learning can begin gently with sitting, handwashing, simple words and stories, long before stopping nappies becomes the main event.','for_both','cat_handwashing_routine','Handwashing routine games','Handwashing Routine',5,'Handwashing is a useful first bathroom skill because it is short, visible and easy to repeat. A song, same words and a small towel hook can help your toddler understand the sequence, even before they are ready for full potty independence.','for_both'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_safer_home','Safer home',8,true,'need_home_safety','Safer home for a quick explorer','Your toddler may now reach higher, climb faster and copy more of what adults do. A fresh safety sweep can help keep exploration open while reducing avoidable risks from stairs, hot drinks, bath water, button batteries, small parts and choking hazards.','for_you','cat_safety_gates','Safety gates','Safety Gates',1,'A toddler who climbs, runs and wants to explore can reach risky places faster than before. Safety gates are not a substitute for supervision, but they can help manage stairs and room boundaries while your child practises movement safely.','for_you'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_safer_home','Safer home',8,true,'need_home_safety','Safer home for a quick explorer','Your toddler may now reach higher, climb faster and copy more of what adults do. A fresh safety sweep can help keep exploration open while reducing avoidable risks from stairs, hot drinks, bath water, button batteries, small parts and choking hazards.','for_you','cat_cupboard_locks','Cupboard locks and safer storage','Cupboard Locks',2,'As toddlers copy adults and open more things, cupboards can become very interesting. Locks and safer storage help keep cleaning products, medicines, batteries and sharp objects away from curious hands, without shutting down safe exploring everywhere else.','for_you'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_safer_home','Safer home',8,true,'need_home_safety','Safer home for a quick explorer','Your toddler may now reach higher, climb faster and copy more of what adults do. A fresh safety sweep can help keep exploration open while reducing avoidable risks from stairs, hot drinks, bath water, button batteries, small parts and choking hazards.','for_you','cat_furniture_window_checks','Furniture, stair and window checks','Furniture Window Checks',3,'Climbing may suddenly become part of everyday life, so it is worth checking furniture, windows, blind cords and tempting routes upwards. The aim is not to stop curiosity, but to make the space keep up with a taller, faster toddler.','for_you'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_safer_home','Safer home',8,true,'need_home_safety','Safer home for a quick explorer','Your toddler may now reach higher, climb faster and copy more of what adults do. A fresh safety sweep can help keep exploration open while reducing avoidable risks from stairs, hot drinks, bath water, button batteries, small parts and choking hazards.','for_you','cat_button_battery_check','Button battery and magnet checks','Button Battery Check',4,'Button batteries and strong magnets can be hidden inside toys, remotes, lights or cheap gadgets. A quick check for loose parts, secure battery compartments and age warnings is especially useful while toddlers still explore with hands and mouth.','for_you'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_safer_home','Safer home',8,true,'need_home_safety','Safer home for a quick explorer','Your toddler may now reach higher, climb faster and copy more of what adults do. A fresh safety sweep can help keep exploration open while reducing avoidable risks from stairs, hot drinks, bath water, button batteries, small parts and choking hazards.','for_you','cat_bath_water_supervision','Bath and water supervision','Bath Water Supervision',5,'Bath play and water pouring can be brilliant at this age, but water needs full attention. Staying within arm’s reach, emptying the bath afterwards and keeping taps safe lets toddlers enjoy water without relying on seats or toys for safety.','for_you'),
  ('19-21m','19–21 months',19,21,true,'ent_cluster_19_21_safer_home','Safer home',8,true,'need_home_safety','Safer home for a quick explorer','Your toddler may now reach higher, climb faster and copy more of what adults do. A fresh safety sweep can help keep exploration open while reducing avoidable risks from stairs, hot drinks, bath water, button batteries, small parts and choking hazards.','for_you','cat_food_choking_safety_prep','Food choking safety prep','Food Choking Safety Prep',6,'As toddlers feed themselves, they can move faster than their chewing skills. Cutting round foods safely, avoiding high-risk items and keeping them seated and supervised helps mealtimes stay relaxed while reducing choking risks during everyday snacks, lunches and family dinners.','for_you'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_talk_stories','Talk and stories',1,true,'need_language_sentences','Chats, stories and little explanations','Your toddler may be using more words, copying phrases and wanting favourite stories again and again. Talking through books, meals and outings helps them hear how words fit together, while keeping language practice relaxed and part of everyday life.','for_your_child','cat_picture_story_books','Picture and story books','Picture Story Books',1,'Looking at picture books together gives your toddler a natural reason to name objects, answer simple questions and hear longer sentences. Favourite stories can be repeated often, which helps new words feel familiar without needing formal teaching.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_talk_stories','Talk and stories',1,true,'need_language_sentences','Chats, stories and little explanations','Your toddler may be using more words, copying phrases and wanting favourite stories again and again. Talking through books, meals and outings helps them hear how words fit together, while keeping language practice relaxed and part of everyday life.','for_your_child','cat_conversation_games','Conversation games','Conversation Games',2,'Little games like naming what you can see, finishing a familiar phrase or adding words to your toddler’s sentence help them practise talking. Keep it light and follow their interest, especially during meals, outings or getting dressed.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_talk_stories','Talk and stories',1,true,'need_language_sentences','Chats, stories and little explanations','Your toddler may be using more words, copying phrases and wanting favourite stories again and again. Talking through books, meals and outings helps them hear how words fit together, while keeping language practice relaxed and part of everyday life.','for_your_child','cat_songs_action_games','Songs, rhymes and action games','Songs Action Games',3,'Rhymes and action songs give your toddler predictable words and movements to join in with. They can copy, pause, request another go and suggest ideas, all while practising listening and early turn-taking.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_talk_stories','Talk and stories',1,true,'need_language_sentences','Chats, stories and little explanations','Your toddler may be using more words, copying phrases and wanting favourite stories again and again. Talking through books, meals and outings helps them hear how words fit together, while keeping language practice relaxed and part of everyday life.','for_your_child','cat_library_storytime','Library visits and story sessions','Library Storytime',4,'A library visit gives your toddler new books, pictures and story routines to explore. Some libraries also run story sessions, which can make reading feel social and help your child practise sitting, listening and joining in.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_pretend_helper_play','Pretend and help',2,true,'need_pretend_imagination','Pretend worlds and helper play','This is a lovely stage for pretend cups of tea, cooking, teddy care and little helper jobs. Copying real life lets your toddler practise language, imagination, sequencing and confidence, without needing play to feel like a lesson.','for_your_child','cat_play_kitchen_household_props','Play kitchen and household props','Play Kitchen Household Props',1,'Pretend cooking, washing up or making tea gives your toddler a safe way to copy the routines they see every day. It supports imagination, sequencing and language, especially when you chat about what they are making or doing.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_pretend_helper_play','Pretend and help',2,true,'need_pretend_imagination','Pretend worlds and helper play','This is a lovely stage for pretend cups of tea, cooking, teddy care and little helper jobs. Copying real life lets your toddler practise language, imagination, sequencing and confidence, without needing play to feel like a lesson.','for_your_child','cat_doll_soft_toy_care','Doll and soft-toy care','Doll Soft Toy Care',2,'Feeding teddy, dressing a doll or putting a soft toy to bed lets your toddler copy familiar care routines. It can bring out new words, early empathy and simple sequencing while staying close to their everyday world.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_pretend_helper_play','Pretend and help',2,true,'need_pretend_imagination','Pretend worlds and helper play','This is a lovely stage for pretend cups of tea, cooking, teddy care and little helper jobs. Copying real life lets your toddler practise language, imagination, sequencing and confidence, without needing play to feel like a lesson.','for_your_child','cat_toy_cups_spoons','Toy cups, spoons and plates','Toy Cups Spoons',3,'Toy cups, plates and spoons help your toddler act out meals, cafés and tea parties. That kind of pretend play can make language, turn-taking and everyday routines easier to practise, especially when you join in gently.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_pretend_helper_play','Pretend and help',2,true,'need_pretend_imagination','Pretend worlds and helper play','This is a lovely stage for pretend cups of tea, cooking, teddy care and little helper jobs. Copying real life lets your toddler practise language, imagination, sequencing and confidence, without needing play to feel like a lesson.','for_your_child','cat_dress_up_role_play','Dress-up and getting-ready play','Dress Up Role Play',4,'Loose dress-up pieces, bags and everyday getting-ready props can turn shoes, coats and brushing into play. Your toddler can copy real routines, try new words and practise the steps involved, without the pressure of actually leaving the house.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_pretend_helper_play','Pretend and help',2,true,'need_pretend_imagination','Pretend worlds and helper play','This is a lovely stage for pretend cups of tea, cooking, teddy care and little helper jobs. Copying real life lets your toddler practise language, imagination, sequencing and confidence, without needing play to feel like a lesson.','for_your_child','cat_small_world_vehicles_figures','Vehicles, figures and little worlds','Small World Vehicles Figures',5,'Simple vehicles, figures or animals let your toddler make tiny scenes: going to the shop, visiting the park or driving a bus. This supports pretend play, story language and problem-solving, especially when the pieces are large and easy to handle.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_busy_hands_puzzles','Busy hands',3,true,'need_fine_motor_problem_solving','Busy hands, colours and little puzzles','Picking up pieces, matching colours, turning puzzle shapes and making marks gives your toddler a satisfying challenge. These small hand moments help them practise focus and control, while letting them see that trying, changing and trying again can work.','for_your_child','cat_shape_sorters_puzzles','Chunky puzzles and shape sorters','Shape Sorters Puzzles',1,'Chunky puzzles and shape sorters give your toddler a clear problem to solve with their hands. Turning pieces, matching shapes and naming colours helps them practise coordination, patience and early problem-solving.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_busy_hands_puzzles','Busy hands',3,true,'need_fine_motor_problem_solving','Busy hands, colours and little puzzles','Picking up pieces, matching colours, turning puzzle shapes and making marks gives your toddler a satisfying challenge. These small hand moments help them practise focus and control, while letting them see that trying, changing and trying again can work.','for_your_child','cat_colour_sorting_matching','Colour sorting and matching games','Colour Sorting Matching',2,'Sorting colours, matching dots or grouping objects gives your toddler a playful way to notice similarities and differences. It can also open up easy words like red, more, same, big and small while they move pieces around.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_busy_hands_puzzles','Busy hands',3,true,'need_fine_motor_problem_solving','Busy hands, colours and little puzzles','Picking up pieces, matching colours, turning puzzle shapes and making marks gives your toddler a satisfying challenge. These small hand moments help them practise focus and control, while letting them see that trying, changing and trying again can work.','for_your_child','cat_chunky_crayons','Chunky crayons and washable mark-making','Chunky Crayons',3,'Crayons, chalk or washable mark-making let your toddler practise grip, pressure and control. Lines, dots and early circles may look small, but they are useful hand practice and a satisfying way to show ideas on paper.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_busy_hands_puzzles','Busy hands',3,true,'need_fine_motor_problem_solving','Busy hands, colours and little puzzles','Picking up pieces, matching colours, turning puzzle shapes and making marks gives your toddler a satisfying challenge. These small hand moments help them practise focus and control, while letting them see that trying, changing and trying again can work.','for_your_child','cat_threading_beads','Chunky threading and lacing','Threading Beads',4,'Large beads, lacing boards or chunky threading activities can help your toddler slow down, line things up and use two hands together. Keep the pieces oversized and supervised so the challenge stays satisfying and safe.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_busy_hands_puzzles','Busy hands',3,true,'need_fine_motor_problem_solving','Busy hands, colours and little puzzles','Picking up pieces, matching colours, turning puzzle shapes and making marks gives your toddler a satisfying challenge. These small hand moments help them practise focus and control, while letting them see that trying, changing and trying again can work.','for_your_child','cat_play_dough_tools','Play dough and squish-and-roll tools','Play Dough Tools',5,'Rolling, poking and pressing dough gives your toddler a simple way to use fingers, hands and imagination. Add a cutter, spoon or pretend cake moment and it becomes both fine-motor play and early pretend play.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_busy_hands_puzzles','Busy hands',3,true,'need_fine_motor_problem_solving','Busy hands, colours and little puzzles','Picking up pieces, matching colours, turning puzzle shapes and making marks gives your toddler a satisfying challenge. These small hand moments help them practise focus and control, while letting them see that trying, changing and trying again can work.','for_your_child','cat_stacking_pegboard','Stacking pegboards and block towers','Stacking Pegboard',6,'Stacking blocks, pegs or tiles lets your toddler test balance, height and cause-and-effect. The falling down is part of the learning, giving them a chance to adjust, try again and talk about what happened.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_big_movement','Big movement',4,true,'need_gross_motor_outdoor','Running, jumping and outdoor confidence','Your toddler may be running, kicking, climbing and testing what their body can do. Balls, playground moments, ride-on practice and simple movement games help them build balance and confidence, while you keep the space safe and supervised.','for_your_child','cat_soft_graspable_balls','Kick-and-chase balls','Soft Graspable Balls',1,'A soft ball gives your toddler a reason to run, stop, kick, chase and try again. Rolling or kicking back and forth can also become an early turn-taking game, especially when you keep it relaxed and playful.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_big_movement','Big movement',4,true,'need_gross_motor_outdoor','Running, jumping and outdoor confidence','Your toddler may be running, kicking, climbing and testing what their body can do. Balls, playground moments, ride-on practice and simple movement games help them build balance and confidence, while you keep the space safe and supervised.','for_your_child','cat_balance_bike_scooter','Balance bike or scooter practice','Balance Bike Scooter',2,'A balance bike or scooter can give a confident toddler a new way to practise steering, stopping and balance. Short, supervised turns are enough; the aim is playful movement, not speed or performance.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_big_movement','Big movement',4,true,'need_gross_motor_outdoor','Running, jumping and outdoor confidence','Your toddler may be running, kicking, climbing and testing what their body can do. Balls, playground moments, ride-on practice and simple movement games help them build balance and confidence, while you keep the space safe and supervised.','for_your_child','cat_climbing_frame_play','Playground climbing and safe running','Climbing Frame Play',3,'Playgrounds give your toddler space to climb, run, step, wobble and try again. Staying close lets them explore what their body can do while you manage height, crowding and surfaces.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_big_movement','Big movement',4,true,'need_gross_motor_outdoor','Running, jumping and outdoor confidence','Your toddler may be running, kicking, climbing and testing what their body can do. Balls, playground moments, ride-on practice and simple movement games help them build balance and confidence, while you keep the space safe and supervised.','for_your_child','cat_follow_the_leader_games','Follow-the-leader movement games','Follow The Leader Games',4,'Walking backwards, tiptoeing, turning corners or playing ready-set-go gives your toddler a fun reason to copy movements and control their body. It can happen in a hallway, garden or park and needs no special equipment.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_big_movement','Big movement',4,true,'need_gross_motor_outdoor','Running, jumping and outdoor confidence','Your toddler may be running, kicking, climbing and testing what their body can do. Balls, playground moments, ride-on practice and simple movement games help them build balance and confidence, while you keep the space safe and supervised.','for_your_child','cat_water_play_cups','Water play cups and pouring','Water Play Cups',5,'Pouring between cups in the bath, garden or sink can be absorbing for a toddler. It supports hand control, early ideas about full and empty, and plenty of language, as long as water play is supervised closely.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_feelings_turn_taking','Feelings and friends',5,true,'need_social_emotional_turn_taking','Feelings, limits and playing with others','At this age, your toddler may want to join in, copy other children and also test limits. Simple turn-taking games, feelings books and calm language give them little ways to practise waiting, sharing and naming what is happening.','for_your_child','cat_feelings_faces_books','Feelings and faces books','Feelings Faces Books',1,'Books with faces and feelings can help your toddler notice happy, cross, sad or worried moments in other people. Naming feelings in a book is often easier than naming them in the middle of a real upset.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_feelings_turn_taking','Feelings and friends',5,true,'need_social_emotional_turn_taking','Feelings, limits and playing with others','At this age, your toddler may want to join in, copy other children and also test limits. Simple turn-taking games, feelings books and calm language give them little ways to practise waiting, sharing and naming what is happening.','for_your_child','cat_turn_taking_games','Turn-taking games','Turn Taking Games',2,'Simple games like rolling a ball, bottle bowling or taking turns with a toy let your toddler feel the rhythm of my turn, your turn. Short games keep the practice realistic and more enjoyable.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_feelings_turn_taking','Feelings and friends',5,true,'need_social_emotional_turn_taking','Feelings, limits and playing with others','At this age, your toddler may want to join in, copy other children and also test limits. Simple turn-taking games, feelings books and calm language give them little ways to practise waiting, sharing and naming what is happening.','for_your_child','cat_visual_choice_cards','Choice cards and simple options','Visual Choice Cards',3,'Offering two clear choices can help a toddler feel some control without the day becoming wide open. Picture cards or simple visual prompts can support clothes, snacks, routines or play choices.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_feelings_turn_taking','Feelings and friends',5,true,'need_social_emotional_turn_taking','Feelings, limits and playing with others','At this age, your toddler may want to join in, copy other children and also test limits. Simple turn-taking games, feelings books and calm language give them little ways to practise waiting, sharing and naming what is happening.','for_your_child','cat_calm_corner_tools','Calm corner comfort tools','Calm Corner Tools',4,'A small basket with books, soft toys or calm cards can help your toddler practise coming back down with you nearby. It is not a punishment space; it is a familiar place for quiet, comfort and naming feelings.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_feelings_turn_taking','Feelings and friends',5,true,'need_social_emotional_turn_taking','Feelings, limits and playing with others','At this age, your toddler may want to join in, copy other children and also test limits. Simple turn-taking games, feelings books and calm language give them little ways to practise waiting, sharing and naming what is happening.','for_your_child','cat_playdate_library_groups','Playgroups and library sessions','Playdate Library Groups',5,'Playgroups, parks and library sessions give toddlers small chances to play near others, copy, wait and join in. You can stay close, model words and keep expectations low while they learn the shape of social play.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_independence_practice','Doing it myself',6,true,'need_independence_self_care','I want to do it myself','You may be hearing more “me do it” moments now. Step stools, dressing practice, tidy-up routines and child-sized mealtime tools can make independence feel possible, while still keeping the adult close enough to guide and help.','for_your_child','cat_step_stool','Low step stool','Step Stool',1,'A steady low step can help your toddler practise reaching the sink, washing hands or joining a small task. It works best when you stay nearby and use it for short, supervised helper moments.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_independence_practice','Doing it myself',6,true,'need_independence_self_care','I want to do it myself','You may be hearing more “me do it” moments now. Step stools, dressing practice, tidy-up routines and child-sized mealtime tools can make independence feel possible, while still keeping the adult close enough to guide and help.','for_your_child','cat_dressing_practice','Dressing practice clothes and games','Dressing Practice',2,'Loose trousers, open jackets and dress-up games let your toddler practise pulling, pushing and choosing. These tiny steps build confidence and body awareness, even when the real morning still needs adult help.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_independence_practice','Doing it myself',6,true,'need_independence_self_care','I want to do it myself','You may be hearing more “me do it” moments now. Step stools, dressing practice, tidy-up routines and child-sized mealtime tools can make independence feel possible, while still keeping the adult close enough to guide and help.','for_your_child','cat_routine_cards','Routine cards and tidy-up cues','Routine Cards',3,'Simple picture routines can help your toddler understand what happens next: shoes, snack, tidy up, bath, book. Seeing the steps can reduce negotiation and give independence a small, repeatable structure.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_independence_practice','Doing it myself',6,true,'need_independence_self_care','I want to do it myself','You may be hearing more “me do it” moments now. Step stools, dressing practice, tidy-up routines and child-sized mealtime tools can make independence feel possible, while still keeping the adult close enough to guide and help.','for_your_child','cat_first_spoons_bowls','Toddler spoons, bowls and small servings','First Spoons Bowls',4,'A toddler spoon, stable bowl or small serving can let your child practise feeding themselves without turning every meal into a test. Expect mess; the value is in hand control, choice and confidence.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_independence_practice','Doing it myself',6,true,'need_independence_self_care','I want to do it myself','You may be hearing more “me do it” moments now. Step stools, dressing practice, tidy-up routines and child-sized mealtime tools can make independence feel possible, while still keeping the adult close enough to guide and help.','for_your_child','cat_handwashing_routine','Handwashing songs and sink routine','Handwashing Routine',5,'A little song, step stool and repeated sink routine can help handwashing become familiar after potty tries, messy play or meals. The goal is not getting every step right; it is building the pattern together.','for_your_child'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_potty_toilet_practice','Potty practice',7,true,'need_potty_toilet_awareness','Potty signs and toilet practice','Some toddlers are ready to practise parts of toileting around this stage, while others need more time. Potty books, step stools, training seats and simple handwashing routines can make the process familiar without turning it into a battle.','for_both','cat_potty','Potty chair','Potty',1,'A potty can help your toddler practise sitting, noticing body signals and joining bathroom routines. Keep it low-pressure and familiar, especially if they are showing interest or you are starting to prepare for nappy-free moments.','for_both'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_potty_toilet_practice','Potty practice',7,true,'need_potty_toilet_awareness','Potty signs and toilet practice','Some toddlers are ready to practise parts of toileting around this stage, while others need more time. Potty books, step stools, training seats and simple handwashing routines can make the process familiar without turning it into a battle.','for_both','cat_toilet_training_seat','Toilet training seat','Toilet Training Seat',2,'Some toddlers prefer the toilet with a child seat rather than a separate potty. A stable seat can make the big toilet feel less overwhelming and can sit alongside potty practice, depending on what your child accepts.','for_both'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_potty_toilet_practice','Potty practice',7,true,'need_potty_toilet_awareness','Potty signs and toilet practice','Some toddlers are ready to practise parts of toileting around this stage, while others need more time. Potty books, step stools, training seats and simple handwashing routines can make the process familiar without turning it into a battle.','for_both','cat_training_pants','Training pants and easy-off clothes','Training Pants',3,'Training pants and easy-off clothing can make early potty practice more manageable for both parent and toddler. They support quick trips, small accidents and independence without making success feel all-or-nothing.','for_both'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_potty_toilet_practice','Potty practice',7,true,'need_potty_toilet_awareness','Potty signs and toilet practice','Some toddlers are ready to practise parts of toileting around this stage, while others need more time. Potty books, step stools, training seats and simple handwashing routines can make the process familiar without turning it into a battle.','for_both','cat_potty_training_books','Potty books and bathroom stories','Potty Training Books',4,'A simple potty book can make wee, poo, wiping and handwashing easier to discuss before the moment arrives. It gives your toddler shared words for a new routine and keeps the topic light.','for_both'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_potty_toilet_practice','Potty practice',7,true,'need_potty_toilet_awareness','Potty signs and toilet practice','Some toddlers are ready to practise parts of toileting around this stage, while others need more time. Potty books, step stools, training seats and simple handwashing routines can make the process familiar without turning it into a battle.','for_both','cat_sticker_chart','Sticker chart or small progress tracker','Sticker Chart',5,'A simple sticker chart can help some toddlers see what they are practising. Keep it gentle: the chart should celebrate tries and routines, not make accidents feel like failure.','for_both'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_home_rhythm_safety','Safer daily rhythm',8,true,'need_parent_routines_safety','Home rhythm and safer setup','As your toddler gets faster, taller and more opinionated, the home may need small updates. Calm bedtime cues, mealtime routines and a fresh safety sweep help daily life run more smoothly while the riskiest hazards stay out of reach.','for_you','cat_bedtime_board_books','Bedtime board books','Bedtime Board Books',1,'A short, familiar book can become a simple cue that bedtime is coming. Repeating the same calm steps each night can help toddlers know what to expect, especially when independence and delay tactics are growing.','for_you'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_home_rhythm_safety','Safer daily rhythm',8,true,'need_parent_routines_safety','Home rhythm and safer setup','As your toddler gets faster, taller and more opinionated, the home may need small updates. Calm bedtime cues, mealtime routines and a fresh safety sweep help daily life run more smoothly while the riskiest hazards stay out of reach.','for_you','cat_comfort_toy','Safe comfort object','Comfort Toy',2,'A favourite soft toy or blanket can help some toddlers settle, especially if they wake at night. Choose something safe, simple and familiar, and check it regularly for loose parts or wear.','for_you'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_home_rhythm_safety','Safer daily rhythm',8,true,'need_parent_routines_safety','Home rhythm and safer setup','As your toddler gets faster, taller and more opinionated, the home may need small updates. Calm bedtime cues, mealtime routines and a fresh safety sweep help daily life run more smoothly while the riskiest hazards stay out of reach.','for_you','cat_family_mealtime_setup','Family mealtime setup','Family Mealtime Setup',3,'Small portions, repeated offers and eating together can make mealtimes calmer when your toddler refuses foods. The aim is steady exposure and connection, not winning every meal.','for_you'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_home_rhythm_safety','Safer daily rhythm',8,true,'need_parent_routines_safety','Home rhythm and safer setup','As your toddler gets faster, taller and more opinionated, the home may need small updates. Calm bedtime cues, mealtime routines and a fresh safety sweep help daily life run more smoothly while the riskiest hazards stay out of reach.','for_you','cat_button_battery_check','Button battery checks','Button Battery Check',4,'A faster, taller toddler can reach remotes, key fobs, cards, toys and drawers you had not noticed before. A button battery sweep is a small job with a serious safety purpose.','for_you'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_home_rhythm_safety','Safer daily rhythm',8,true,'need_parent_routines_safety','Home rhythm and safer setup','As your toddler gets faster, taller and more opinionated, the home may need small updates. Calm bedtime cues, mealtime routines and a fresh safety sweep help daily life run more smoothly while the riskiest hazards stay out of reach.','for_you','cat_furniture_window_checks','Furniture, stair and window checks','Furniture Window Checks',5,'When toddlers climb higher and move faster, furniture, stairs and windows deserve a fresh look. Simple checks such as anchoring furniture, keeping climbable items away from windows and using safer storage can reduce the bigger risks.','for_you'),
  ('25-27m','25–27 months',25,27,true,'ent_cluster_home_rhythm_safety','Safer daily rhythm',8,true,'need_parent_routines_safety','Home rhythm and safer setup','As your toddler gets faster, taller and more opinionated, the home may need small updates. Calm bedtime cues, mealtime routines and a fresh safety sweep help daily life run more smoothly while the riskiest hazards stay out of reach.','for_you','cat_choking_hazard_sweep','Small-object and choking sweep','Choking Hazard Sweep',6,'Toddlers still explore fast, especially when older-child toys, craft bits or household items are nearby. A quick sweep for small parts, magnets, batteries and unsafe food shapes helps make play safer.','for_you'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_talk_stories_questions','Talk and stories',1,true,'ent_need_language_stories','Talk, stories and little questions','Your toddler may be naming pictures, joining words and asking or answering simple questions. Books, songs and everyday chat can make language feel warm and useful, while giving them space to practise new words without turning home into a lesson.','for_your_child','cat_picture_story_books','Picture and story books','Picture Story Books',1,'Looking at pictures, naming what you see and asking little questions can make books feel more interactive now. Story books give your toddler a gentle way to practise new words, remember familiar scenes and connect language with people, places and feelings.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_talk_stories_questions','Talk and stories',1,true,'ent_need_language_stories','Talk, stories and little questions','Your toddler may be naming pictures, joining words and asking or answering simple questions. Books, songs and everyday chat can make language feel warm and useful, while giving them space to practise new words without turning home into a lesson.','for_your_child','cat_conversation_prompt_cards','Conversation prompt cards','Conversation Prompt Cards',2,'Simple picture or question prompts can help you keep conversation going when tired-parent brain is real. Used gently, they give your toddler more chances to name, choose, describe and answer without making language practice feel formal or test-like.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_talk_stories_questions','Talk and stories',1,true,'ent_need_language_stories','Talk, stories and little questions','Your toddler may be naming pictures, joining words and asking or answering simple questions. Books, songs and everyday chat can make language feel warm and useful, while giving them space to practise new words without turning home into a lesson.','for_your_child','cat_songs_action_games','Songs, rhymes and action games','Songs Action Games',3,'Songs with actions, silly sounds and repeated phrases give your toddler another way to join in with language. They can practise listening, copying, choosing words and moving their body, while the repetition makes new words easier to remember.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_talk_stories_questions','Talk and stories',1,true,'ent_need_language_stories','Talk, stories and little questions','Your toddler may be naming pictures, joining words and asking or answering simple questions. Books, songs and everyday chat can make language feel warm and useful, while giving them space to practise new words without turning home into a lesson.','for_your_child','cat_feelings_faces_books','Feeling stories and face books','Feelings Faces Books',4,'Books or cards about faces and feelings can help toddlers name what is happening inside and around them. They also create gentle openings to talk about sharing, waiting, frustration and care, especially as peer play becomes more common.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_social_worlds','Pretend play',2,true,'ent_need_pretend_peer_play','Pretend worlds and playing together','Pretend play may be getting more detailed now: teddy has tea, a box becomes a shop, or another child joins the story. These scenes help toddlers practise language, empathy, turn-taking and confidence in a way that still feels like play.','for_your_child','cat_doll_soft_toy_care','Soft toy and doll care play','Doll Soft Toy Care',1,'Feeding teddy, dressing a doll or putting a soft toy to bed lets your toddler practise care, language and sequencing. These small pretend scenes can also help them explore feelings and everyday routines safely, without needing lots of complicated toys.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_social_worlds','Pretend play',2,true,'ent_need_pretend_peer_play','Pretend worlds and playing together','Pretend play may be getting more detailed now: teddy has tea, a box becomes a shop, or another child joins the story. These scenes help toddlers practise language, empathy, turn-taking and confidence in a way that still feels like play.','for_your_child','cat_play_kitchen_household_props','Play kitchen and household props','Play Kitchen Household Props',2,'Pretend cooking, shopping or making tea lets your toddler copy familiar routines and create little scenes. Safe household props and play food can support imagination, words, turn-taking and problem-solving, especially when an adult follows their lead.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_social_worlds','Pretend play',2,true,'ent_need_pretend_peer_play','Pretend worlds and playing together','Pretend play may be getting more detailed now: teddy has tea, a box becomes a shop, or another child joins the story. These scenes help toddlers practise language, empathy, turn-taking and confidence in a way that still feels like play.','for_your_child','cat_small_world_figures','Small-world people and vehicles','Small World Figures',3,'Little people, vehicles, animals or buildings can help toddlers act out the world they see every day. At this age, small-world play can turn into early stories, problem-solving and social scripts, especially when adults add words without taking over.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_social_worlds','Pretend play',2,true,'ent_need_pretend_peer_play','Pretend worlds and playing together','Pretend play may be getting more detailed now: teddy has tea, a box becomes a shop, or another child joins the story. These scenes help toddlers practise language, empathy, turn-taking and confidence in a way that still feels like play.','for_your_child','cat_puppets','Puppets and silly voices','Puppets',4,'A puppet can ask questions, get things wrong, feel sad, or need help. That gives your toddler a playful reason to answer, explain, comfort or laugh, while supporting conversation and feelings talk without putting them on the spot.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_social_worlds','Pretend play',2,true,'ent_need_pretend_peer_play','Pretend worlds and playing together','Pretend play may be getting more detailed now: teddy has tea, a box becomes a shop, or another child joins the story. These scenes help toddlers practise language, empathy, turn-taking and confidence in a way that still feels like play.','for_your_child','cat_peer_play_books','Peer-play story books','Peer Play Books',5,'Stories about sharing, waiting, taking turns or playing beside another child can help toddlers recognise social moments before they are in them. They are especially useful when peer play is growing but conflict and big feelings still need adult support.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_puzzles_patterns_problem_solving','Puzzles and patterns',3,true,'ent_need_problem_solving_patterns','Puzzles, patterns and figuring it out','Matching colours, turning pieces, remembering where things are and pouring water between containers can all feel satisfying at this stage. These playful challenges help your toddler practise focus, hand control, early logic and the confidence to try again.','for_your_child','cat_shape_peg_puzzles','Chunky shape and peg puzzles','Shape Peg Puzzles',1,'Chunky puzzles let your toddler turn, match and try again until the piece fits. They practise focus, hand control, visual matching and problem-solving, while still giving quick wins that feel satisfying rather than frustrating.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_puzzles_patterns_problem_solving','Puzzles and patterns',3,true,'ent_need_problem_solving_patterns','Puzzles, patterns and figuring it out','Matching colours, turning pieces, remembering where things are and pouring water between containers can all feel satisfying at this stage. These playful challenges help your toddler practise focus, hand control, early logic and the confidence to try again.','for_your_child','cat_twist_pivot_puzzles','Twist-and-turn puzzles','Twist Pivot Puzzles',2,'Puzzles with pieces that twist, slide or pivot can stretch this stage beyond simple matching. They encourage your toddler to look closely, use both hands, test a movement and try a new approach when the first idea does not work.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_puzzles_patterns_problem_solving','Puzzles and patterns',3,true,'ent_need_problem_solving_patterns','Puzzles, patterns and figuring it out','Matching colours, turning pieces, remembering where things are and pouring water between containers can all feel satisfying at this stage. These playful challenges help your toddler practise focus, hand control, early logic and the confidence to try again.','for_your_child','cat_colour_matching_games','Colour matching games','Colour Matching Games',3,'Colour matching can be a simple way to practise noticing, naming and comparing. Matching pegs, cards, cups or blocks lets your toddler hear colour words in context while also building focus, hand control and early sorting skills.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_puzzles_patterns_problem_solving','Puzzles and patterns',3,true,'ent_need_problem_solving_patterns','Puzzles, patterns and figuring it out','Matching colours, turning pieces, remembering where things are and pouring water between containers can all feel satisfying at this stage. These playful challenges help your toddler practise focus, hand control, early logic and the confidence to try again.','for_your_child','cat_memory_matching_games','Memory matching games','Memory Matching Games',4,'A simple memory game can help your toddler look, wait, choose and remember where something was. Keep it short and cooperative at this age: matching a few familiar pictures is enough to practise attention and early turn-taking.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_puzzles_patterns_problem_solving','Puzzles and patterns',3,true,'ent_need_problem_solving_patterns','Puzzles, patterns and figuring it out','Matching colours, turning pieces, remembering where things are and pouring water between containers can all feel satisfying at this stage. These playful challenges help your toddler practise focus, hand control, early logic and the confidence to try again.','for_your_child','cat_pouring_volume_play','Pouring and volume play','Pouring Volume Play',5,'Pouring between cups, tubs or a supervised liquid set lets your toddler explore full, empty, same and different. It can support early problem-solving and language, but it needs close adult supervision, especially around water and small parts.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_busy_hands_making_marks','Making and drawing',4,true,'ent_need_fine_motor_mark_making','Busy hands and making marks','Your toddler may be more interested in making marks, peeling stickers, squashing dough or trying careful little finger jobs. These messy, hands-on moments help build the control they will use for feeding, dressing, drawing and later writing.','for_your_child','cat_chunky_crayons','Chunky crayons and first drawings','Chunky Crayons',1,'Chunky crayons, chalks or washable markers give your toddler a satisfying way to make lines, circles and colour choices. These early marks build hand control and confidence, and they can become lovely conversation starters about what they have made.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_busy_hands_making_marks','Making and drawing',4,true,'ent_need_fine_motor_mark_making','Busy hands and making marks','Your toddler may be more interested in making marks, peeling stickers, squashing dough or trying careful little finger jobs. These messy, hands-on moments help build the control they will use for feeding, dressing, drawing and later writing.','for_your_child','cat_play_dough_soft_clay','Soft dough and squish-safe sensory play','Play Dough Soft Clay',2,'Rolling, squeezing, poking and cutting soft dough gives little hands a proper workout. It also gives your toddler a calm, creative way to practise control, pretend making and descriptive words such as flat, round, long or squishy.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_busy_hands_making_marks','Making and drawing',4,true,'ent_need_fine_motor_mark_making','Busy hands and making marks','Your toddler may be more interested in making marks, peeling stickers, squashing dough or trying careful little finger jobs. These messy, hands-on moments help build the control they will use for feeding, dressing, drawing and later writing.','for_your_child','cat_threading_beads','Threading beads and chunky lacing','Threading Beads',3,'Large threading beads or chunky lacing boards can help toddlers practise two-hand coordination, focus and patience. Choose age-appropriate pieces and supervise closely, because anything small enough to choke remains a concern under 3.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_busy_hands_making_marks','Making and drawing',4,true,'ent_need_fine_motor_mark_making','Busy hands and making marks','Your toddler may be more interested in making marks, peeling stickers, squashing dough or trying careful little finger jobs. These messy, hands-on moments help build the control they will use for feeding, dressing, drawing and later writing.','for_your_child','cat_stickers_collage','Stickers and simple collage','Stickers Collage',4,'Peeling a sticker, turning it the right way and pressing it down is a tiny but useful hand-control challenge. Stickers also let toddlers make choices and talk about pictures, colours and stories without needing perfect drawing skills.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_busy_hands_making_marks','Making and drawing',4,true,'ent_need_fine_motor_mark_making','Busy hands and making marks','Your toddler may be more interested in making marks, peeling stickers, squashing dough or trying careful little finger jobs. These messy, hands-on moments help build the control they will use for feeding, dressing, drawing and later writing.','for_your_child','cat_tongs_scoops','Tongs, scoops and transfer play','Tongs Scoops',5,'Using chunky tongs, scoops or spoons to move safe objects gives your toddler a practical hand challenge. It can support grip, coordination and concentration, especially when linked to pretend cooking, sorting or clean-up games.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_jumping_balance_big_moves','Big body play',5,true,'ent_need_gross_motor_balance','Jumping, balancing and big moves','At this stage, many toddlers are trying bigger physical challenges: jumping, kicking, climbing, balancing or pedalling. Simple movement games give them a safe reason to practise coordination, strength and confidence while burning off real toddler energy.','for_your_child','cat_jump_hoops_beanbags','Jump hoops and beanbags','Jump Hoops Beanbags',1,'Hoops, floor spots or beanbags can make big-body practice feel playful and contained. Your toddler can jump in, toss, aim, copy and try again, building coordination while giving all that energy a clear place to go.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_jumping_balance_big_moves','Big body play',5,true,'ent_need_gross_motor_balance','Jumping, balancing and big moves','At this stage, many toddlers are trying bigger physical challenges: jumping, kicking, climbing, balancing or pedalling. Simple movement games give them a safe reason to practise coordination, strength and confidence while burning off real toddler energy.','for_your_child','cat_large_balls','Large balls for kicking and catching','Large Balls',2,'A soft, large ball is a simple way to practise kicking, chasing, catching and turn-taking. Back-and-forth games let your toddler use their whole body while also learning to wait, copy and share the game with someone else.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_jumping_balance_big_moves','Big body play',5,true,'ent_need_gross_motor_balance','Jumping, balancing and big moves','At this stage, many toddlers are trying bigger physical challenges: jumping, kicking, climbing, balancing or pedalling. Simple movement games give them a safe reason to practise coordination, strength and confidence while burning off real toddler energy.','for_your_child','cat_balance_stepping_stones','Balance paths and stepping stones','Balance Stepping Stones',3,'A line of cushions, stepping stones or floor markers can turn balance into a small adventure. Walking, turning, stopping and tiptoeing help toddlers practise body control, especially when you keep the challenge low, soft and supervised.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_jumping_balance_big_moves','Big body play',5,true,'ent_need_gross_motor_balance','Jumping, balancing and big moves','At this stage, many toddlers are trying bigger physical challenges: jumping, kicking, climbing, balancing or pedalling. Simple movement games give them a safe reason to practise coordination, strength and confidence while burning off real toddler energy.','for_your_child','cat_park_climbing_play','Park climbing and obstacle play','Park Climbing Play',4,'Climbing, running and obstacle play give toddlers a chance to test strength and coordination in a place built for movement. Choose age-suitable equipment, stay close and let them repeat the same challenge until it feels mastered.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_jumping_balance_big_moves','Big body play',5,true,'ent_need_gross_motor_balance','Jumping, balancing and big moves','At this stage, many toddlers are trying bigger physical challenges: jumping, kicking, climbing, balancing or pedalling. Simple movement games give them a safe reason to practise coordination, strength and confidence while burning off real toddler energy.','for_your_child','cat_tricycle_scooter','Tricycles and beginner scooters','Tricycle Scooter',5,'Pedalling, pushing or scooting can be exciting as toddlers move towards 3. A stable tricycle or beginner scooter can support coordination and confidence, but helmet fit, traffic-free spaces and adult supervision matter more than speed.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_little_helper_independence','Doing more myself',6,true,'ent_need_independence_routines','Little helper moments','Your toddler may want to help, choose, carry, dress, clean up or reach things for themselves. Small, safe routines can turn that push for independence into confidence and cooperation, while still keeping adults in charge of the setup.','for_your_child','cat_learning_tower_step_stool','Learning tower or safe step stool','Learning Tower Step Stool',1,'A stable step stool or learning tower can let your toddler join handwashing, cooking or tidying moments more safely. It supports independence and problem-solving, but it needs careful placement, adult supervision and clear rules around climbing.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_little_helper_independence','Doing more myself',6,true,'ent_need_independence_routines','Little helper moments','Your toddler may want to help, choose, carry, dress, clean up or reach things for themselves. Small, safe routines can turn that push for independence into confidence and cooperation, while still keeping adults in charge of the setup.','for_your_child','cat_visual_routine_cards','Visual routine cards and timers','Visual Routine Cards',2,'Simple pictures, first-then cards or a visual timer can help toddlers see what happens next. That can support two-step routines, transitions and clean-up moments without needing endless verbal reminders, especially when they want more control.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_little_helper_independence','Doing more myself',6,true,'ent_need_independence_routines','Little helper moments','Your toddler may want to help, choose, carry, dress, clean up or reach things for themselves. Small, safe routines can turn that push for independence into confidence and cooperation, while still keeping adults in charge of the setup.','for_your_child','cat_dressing_practice_clothes','Dressing practice clothes','Dressing Practice Clothes',3,'Loose trousers, open jackets, Velcro shoes or dressing-up items can help your toddler practise the parts of dressing they are ready for. Keep it playful and low-pressure, with clothes that are easy enough to make success feel possible.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_little_helper_independence','Doing more myself',6,true,'ent_need_independence_routines','Little helper moments','Your toddler may want to help, choose, carry, dress, clean up or reach things for themselves. Small, safe routines can turn that push for independence into confidence and cooperation, while still keeping adults in charge of the setup.','for_your_child','cat_safe_food_prep_tools','Safe food prep tools','Safe Food Prep Tools',4,'Child-safe spreading, stirring, washing or scooping tools can let your toddler join tiny kitchen jobs. These moments can support independence, hand control and words around food, while adults stay responsible for heat, sharp tools and hygiene.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_little_helper_independence','Doing more myself',6,true,'ent_need_independence_routines','Little helper moments','Your toddler may want to help, choose, carry, dress, clean up or reach things for themselves. Small, safe routines can turn that push for independence into confidence and cooperation, while still keeping adults in charge of the setup.','for_your_child','cat_cleanup_basket','Clean-up baskets and little jobs','Cleanup Basket',5,'A small basket, matching labels or a simple clean-up song can help your toddler join household routines. They practise following instructions, sorting, carrying and cooperation, while you keep expectations small and repeatable.','for_your_child'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_potty_teeth_body_routines','Potty and teeth',7,true,'ent_need_potty_teeth_hygiene','Potty, teeth and body routines','Toileting, toothbrushing and handwashing can all become bigger family routines around this stage. The aim is not pressure or perfection. Familiar tools, clear language and repeated steps can help your toddler understand what happens next and practise doing more.','for_both','cat_potty_chair','Potty chair','Potty Chair',1,'A simple potty can help your toddler understand where wee and poo go before they manage the whole process. Keep it familiar, calm and pressure-free, using short sits, clear language and lots of reassurance rather than a sudden all-or-nothing push.','for_both'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_potty_teeth_body_routines','Potty and teeth',7,true,'ent_need_potty_teeth_hygiene','Potty, teeth and body routines','Toileting, toothbrushing and handwashing can all become bigger family routines around this stage. The aim is not pressure or perfection. Familiar tools, clear language and repeated steps can help your toddler understand what happens next and practise doing more.','for_both','cat_toilet_training_seat_step','Toilet training seat and step','Toilet Training Seat Step',2,'A toilet seat insert and step can help some toddlers feel stable enough to relax and empty properly. They also make climbing up and down part of the routine, which supports independence while an adult stays nearby.','for_both'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_potty_teeth_body_routines','Potty and teeth',7,true,'ent_need_potty_teeth_hygiene','Potty, teeth and body routines','Toileting, toothbrushing and handwashing can all become bigger family routines around this stage. The aim is not pressure or perfection. Familiar tools, clear language and repeated steps can help your toddler understand what happens next and practise doing more.','for_both','cat_handwashing_step_stool','Handwashing step and soap routine','Handwashing Step Stool',3,'A safe step, child-height towel and simple handwashing routine can help your toddler finish the bathroom sequence. Repeating the same steps after potty tries, meals and messy play makes hygiene feel predictable rather than another battle.','for_both'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_potty_teeth_body_routines','Potty and teeth',7,true,'ent_need_potty_teeth_hygiene','Potty, teeth and body routines','Toileting, toothbrushing and handwashing can all become bigger family routines around this stage. The aim is not pressure or perfection. Familiar tools, clear language and repeated steps can help your toddler understand what happens next and practise doing more.','for_both','cat_toothbrush_toothpaste','Toddler toothbrush and toothpaste','Toothbrush Toothpaste',4,'Around this transition, toothbrushing still needs adult help. A small soft toothbrush, fluoride toothpaste and a calm twice-daily routine can make brushing more predictable, while the toothpaste amount changes as your child reaches 3.','for_both'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_potty_teeth_body_routines','Potty and teeth',7,true,'ent_need_potty_teeth_hygiene','Potty, teeth and body routines','Toileting, toothbrushing and handwashing can all become bigger family routines around this stage. The aim is not pressure or perfection. Familiar tools, clear language and repeated steps can help your toddler understand what happens next and practise doing more.','for_both','cat_potty_story_books','Potty story books','Potty Story Books',5,'A simple potty book can help your toddler understand the sequence before they have to do it in real life. It gives you shared words for wee, poo, pants, washing hands and accidents without making toileting feel like a lecture.','for_both'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_safer_spaces_bigger_curiosity','Home setup',8,true,'ent_need_safe_home_setup','Safer spaces for bigger curiosity','As your toddler climbs, twists, carries, opens and experiments more, the home may need a fresh safety pass. Small checks around toy parts, batteries, magnets, cords, storage and rotation can reduce risk while keeping play varied and manageable.','for_you','cat_small_object_sweep','Small-object safety sweep','Small Object Sweep',1,'Toddlers under 3 are still at higher risk from small parts, magnets, batteries and water beads. A regular floor-level sweep helps your home keep up with new climbing, opening and experimenting skills, especially after older-child play or visitors.','for_you'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_safer_spaces_bigger_curiosity','Home setup',8,true,'ent_need_safe_home_setup','Safer spaces for bigger curiosity','As your toddler climbs, twists, carries, opens and experiments more, the home may need a fresh safety pass. Small checks around toy parts, batteries, magnets, cords, storage and rotation can reduce risk while keeping play varied and manageable.','for_you','cat_button_battery_check','Button battery and magnet checks','Button Battery Check',2,'Button batteries and strong magnets can be especially dangerous for young children. Checking toys, remotes, greeting cards, lights and loose parts is not glamorous, but it is a high-value home safety habit at this age.','for_you'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_safer_spaces_bigger_curiosity','Home setup',8,true,'ent_need_safe_home_setup','Safer spaces for bigger curiosity','As your toddler climbs, twists, carries, opens and experiments more, the home may need a fresh safety pass. Small checks around toy parts, batteries, magnets, cords, storage and rotation can reduce risk while keeping play varied and manageable.','for_you','cat_toy_rotation','Toy rotation and reset basket','Toy Rotation',3,'A small rotation basket can make familiar toys feel new again while reducing mess and overwhelm. At this age, rotating open-ended favourites can support deeper play, and it helps parents spot broken parts, missing pieces or safety issues.','for_you'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_safer_spaces_bigger_curiosity','Home setup',8,true,'ent_need_safe_home_setup','Safer spaces for bigger curiosity','As your toddler climbs, twists, carries, opens and experiments more, the home may need a fresh safety pass. Small checks around toy parts, batteries, magnets, cords, storage and rotation can reduce risk while keeping play varied and manageable.','for_you','cat_battery_free_toys','Battery-free or low-tech toys','Battery Free Toys',4,'Battery-free toys, books, balls, boxes and craft materials often leave more room for toddler-led ideas. They also avoid some battery risks, though all toys still need age labels, condition checks and supervision where small parts are involved.','for_you'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_safer_spaces_bigger_curiosity','Home setup',8,true,'ent_need_safe_home_setup','Safer spaces for bigger curiosity','As your toddler climbs, twists, carries, opens and experiments more, the home may need a fresh safety pass. Small checks around toy parts, batteries, magnets, cords, storage and rotation can reduce risk while keeping play varied and manageable.','for_you','cat_nursery_spare_bag_labels','Nursery spare bag and labels','Nursery Spare Bag Labels',5,'If nursery or more regular childcare is on the horizon, spare clothes, labels and a simple bag routine can reduce daily friction. It also supports independence: your toddler can help pack, carry and recognise their own things.','for_you'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_safer_spaces_bigger_curiosity','Home setup',8,true,'ent_need_safe_home_setup','Safer spaces for bigger curiosity','As your toddler climbs, twists, carries, opens and experiments more, the home may need a fresh safety pass. Small checks around toy parts, batteries, magnets, cords, storage and rotation can reduce risk while keeping play varied and manageable.','for_you','cat_storage_baskets_shelves','Low storage baskets and shelves','Storage Baskets Shelves',6,'Low baskets or simple shelves make it easier for toddlers to choose, return and revisit play. Used well, they support independence and clean-up routines, while giving parents a practical place to rotate toys and remove unsafe pieces.','for_you');

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
SELECT DISTINCT
  s.age_band_id,
  dn.id AS development_need_id,
  ct.id AS category_type_id,
  s.stage2_play_ideas_rank AS rank,
  NULLIF(TRIM(COALESCE(s.stage2_play_idea_mapping_rationale, '')), '') AS rationale,
  NULLIF(TRIM(COALESCE(s.stage2_category_type_label, '')), '') AS display_label,
  NULLIF(TRIM(COALESCE(s.category_audience_lens, '')), '') AS audience_lens
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
) ct ON true;

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
  true
FROM tmp_discover_resolved_need_category r
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  display_label = EXCLUDED.display_label,
  audience_lens = EXCLUDED.audience_lens,
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
  v_rows_19_21m INTEGER;
  v_clusters_19_21m INTEGER;
  v_rows_25_27m INTEGER;
  v_clusters_25_27m INTEGER;
  v_rows_31_33m INTEGER;
  v_clusters_31_33m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_19_21m FROM tmp_discover_projection_stage WHERE age_band_id = '19-21m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_19_21m
  FROM tmp_discover_projection_stage WHERE age_band_id = '19-21m';
  SELECT COUNT(*) INTO v_rows_25_27m FROM tmp_discover_projection_stage WHERE age_band_id = '25-27m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_25_27m
  FROM tmp_discover_projection_stage WHERE age_band_id = '25-27m';
  SELECT COUNT(*) INTO v_rows_31_33m FROM tmp_discover_projection_stage WHERE age_band_id = '31-33m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_31_33m
  FROM tmp_discover_projection_stage WHERE age_band_id = '31-33m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('19-21m', '25-27m', '31-33m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 120)', v_rows_loaded;
  RAISE NOTICE '19-21m rows: % (expected 39), clusters: % (expected 8)', v_rows_19_21m, v_clusters_19_21m;
  RAISE NOTICE '25-27m rows: % (expected 41), clusters: % (expected 8)', v_rows_25_27m, v_clusters_25_27m;
  RAISE NOTICE '31-33m rows: % (expected 40), clusters: % (expected 8)', v_rows_31_33m, v_clusters_31_33m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 120 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_19_21m <> 39 THEN
    RAISE EXCEPTION 'Row count validation failed for 19-21m';
  END IF;
  IF v_rows_25_27m <> 41 THEN
    RAISE EXCEPTION 'Row count validation failed for 25-27m';
  END IF;
  IF v_rows_31_33m <> 40 THEN
    RAISE EXCEPTION 'Row count validation failed for 31-33m';
  END IF;
  IF v_clusters_19_21m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 19-21m';
  END IF;
  IF v_clusters_25_27m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 25-27m';
  END IF;
  IF v_clusters_31_33m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 31-33m';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('19-21m', '25-27m', '31-33m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('19-21m', '25-27m', '31-33m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('19-21m', '25-27m', '31-33m');
