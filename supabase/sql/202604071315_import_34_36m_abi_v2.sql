-- Import 34-36m ABI V2 CSV into Discover gateway canonical tables
-- Source: C:/Users/timwo/Downloads/ABI_34_36m_completed.csv

BEGIN;

CREATE TEMP TABLE _abi34 (
  age_band_id text, age_band_label text, min_months int, max_months int, age_band_is_active boolean,
  stage1_wrapper_ux_slug text, stage1_wrapper_ux_label text, stage1_wrapper_rank_in_band int, stage1_mapping_is_active boolean,
  development_need_slug text, development_need_canonical_name text, stage1_why_it_matters_ux_description text,
  stage2_category_type_slug text, stage2_category_type_label text, stage2_category_type_name text, stage2_play_ideas_rank int, stage2_play_idea_mapping_rationale text,
  stage3_product_name text, stage3_product_brand text, stage3_product_rank_in_category int, stage3_product_mapping_rationale text,
  optional_need_meta_stage_anchor_month int, optional_need_meta_stage_phase text, optional_need_meta_stage_reason text,
  optional_category_image_url text, optional_category_safety_notes text
);

INSERT INTO _abi34 VALUES
  ('34-36m','34–36 months',34,36,true,'pretend-and-story-play','Pretend & story play',1,true,'pretend-and-story-play','Pretend play and storytelling','Around 3, pretend play becomes more layered. Children use one object to stand for another, act out familiar routines, and begin building simple storylines with characters, props, and everyday scenes.','pretend-play-props','Pretend play props','Pretend play props',1,'Around 3, children use objects to represent other things in play — a block becomes a cake, a box becomes a car. Open-ended props give this imagination room to grow.',NULL,NULL,NULL,NULL,35,'consolidating','Symbolic play is one of the clearest developmental signals in the 24–36 month window and feels especially visible by age 3, when children combine props, roles, and simple storylines more deliberately.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'pretend-and-story-play','Pretend & story play',1,true,'pretend-and-story-play','Pretend play and storytelling','Around 3, pretend play becomes more layered. Children use one object to stand for another, act out familiar routines, and begin building simple storylines with characters, props, and everyday scenes.','small-world-play-set','Small world play sets','Small world play sets',2,'Miniature figures and vehicles help children create little scenes, extend pretend storylines, and practise sequencing, dialogue, and social roles in play.',NULL,NULL,NULL,NULL,35,'consolidating','Symbolic play is one of the clearest developmental signals in the 24–36 month window and feels especially visible by age 3, when children combine props, roles, and simple storylines more deliberately.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'pretend-and-story-play','Pretend & story play',1,true,'pretend-and-story-play','Pretend play and storytelling','Around 3, pretend play becomes more layered. Children use one object to stand for another, act out familiar routines, and begin building simple storylines with characters, props, and everyday scenes.','dressing-up-clothes','Dressing-up clothes','Dressing-up clothes',3,'Simple costume pieces let children step into roles, stretch story play, and practise little fastening movements while getting into character.',NULL,NULL,NULL,NULL,35,'consolidating','Symbolic play is one of the clearest developmental signals in the 24–36 month window and feels especially visible by age 3, when children combine props, roles, and simple storylines more deliberately.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'toilet-learning-and-independence','Toilet learning & independence',2,true,'toilet-learning-and-independence','Toilet learning and independence','Many children in this window show growing readiness to do more for themselves — noticing urges, reaching the sink, helping with dressing, and wanting more control over everyday routines.','potty','Potty','Potty',1,'Most children show signs of toilet readiness between 2 and 3. Having a potty available means they can act on the urge when it comes.',NULL,NULL,NULL,NULL,35,'emerging','Readiness for toilet learning and self-care varies widely, but this band is a common window for noticing bodily urges, wanting more independence, and joining hygiene and dressing routines with support.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'toilet-learning-and-independence','Toilet learning & independence',2,true,'toilet-learning-and-independence','Toilet learning and independence','Many children in this window show growing readiness to do more for themselves — noticing urges, reaching the sink, helping with dressing, and wanting more control over everyday routines.','step-stool','Step stool','Step stool',2,'A step stool at the sink means your 3-year-old can wash their hands, brush their teeth, and feel capable — without waiting for you to lift them.',NULL,NULL,NULL,NULL,35,'emerging','Readiness for toilet learning and self-care varies widely, but this band is a common window for noticing bodily urges, wanting more independence, and joining hygiene and dressing routines with support.',NULL,'Prefer a wide, non-slip base for bathroom use.'),
  ('34-36m','34–36 months',34,36,true,'toilet-learning-and-independence','Toilet learning & independence',2,true,'toilet-learning-and-independence','Toilet learning and independence','Many children in this window show growing readiness to do more for themselves — noticing urges, reaching the sink, helping with dressing, and wanting more control over everyday routines.','toilet-training-seat','Toilet training seats','Toilet training seats',3,'A child-sized training seat helps bridge the jump from potty to adult toilet, making toileting feel safer and more manageable while confidence grows.',NULL,NULL,NULL,NULL,35,'emerging','Readiness for toilet learning and self-care varies widely, but this band is a common window for noticing bodily urges, wanting more independence, and joining hygiene and dressing routines with support.',NULL,'Choose a stable fit and supervise toilet use while confidence is still emerging.'),
  ('34-36m','34–36 months',34,36,true,'toilet-learning-and-independence','Toilet learning & independence',2,true,'toilet-learning-and-independence','Toilet learning and independence','Many children in this window show growing readiness to do more for themselves — noticing urges, reaching the sink, helping with dressing, and wanting more control over everyday routines.','child-toothbrush','Child toothbrushes','Child toothbrushes',4,'A child-sized toothbrush invites participation in toothbrushing routines and supports the growing ''I can do it'' feeling that becomes stronger around 3.',NULL,NULL,NULL,NULL,35,'emerging','Readiness for toilet learning and self-care varies widely, but this band is a common window for noticing bodily urges, wanting more independence, and joining hygiene and dressing routines with support.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'big-feelings-and-peer-play','Big feelings & peer play',3,true,'big-feelings-and-peer-play','Big feelings and peer play','Feelings get bigger and social play gets more interactive. Children are starting to notice how others feel, practise turn-taking, and need simple support to handle conflict, waiting, and frustration.','picture-books','Picture books','Picture books',1,'Feelings-themed picture books give children a calm, distanced way to talk about emotions, empathy, sharing, and social hiccups they are starting to meet in real life.',NULL,NULL,NULL,NULL,35,'consolidating','By age 3, empathy, turn-taking, and interactive play become more visible, but self-control is still immature. This is a strong support window for social language and calm emotional coaching.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'big-feelings-and-peer-play','Big feelings & peer play',3,true,'big-feelings-and-peer-play','Big feelings and peer play','Feelings get bigger and social play gets more interactive. Children are starting to notice how others feel, practise turn-taking, and need simple support to handle conflict, waiting, and frustration.','sand-and-water-play-set','Sand and water play','Sand and water play',2,'Sand and water play encourages side-by-side play, turn-taking language, and simple shared problem-solving without forcing too much direct sharing too soon.',NULL,NULL,NULL,NULL,35,'consolidating','By age 3, empathy, turn-taking, and interactive play become more visible, but self-control is still immature. This is a strong support window for social language and calm emotional coaching.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','jigsaw-puzzle','Jigsaw puzzles','Jigsaw puzzles',1,'Chunky jigsaws give children practice in rotating pieces, spotting where something fits, and sticking with a problem when the first try does not work.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','matching-games','Matching games','Matching games',2,'Matching games build visual discrimination, memory, and early sorting logic in a way that feels playful rather than formal.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','counting-toys','Counting toys','Counting toys',3,'Counting out loud is a great start, but touching objects one by one helps children truly understand that numbers represent quantity.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','construction-blocks','Construction blocks','Construction blocks',4,'Construction blocks let children test ideas, build and rebuild, and explore shape, balance, and simple problem-solving with their hands.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','threading-and-lacing-toys','Threading and lacing toys','Threading and lacing toys',5,'Threading and lacing toys strengthen hand-eye coordination and fine-motor precision through a satisfying, repeatable challenge.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','early-art-materials','Early art materials','Early art materials',6,'Washable crayons and paper support more intentional mark-making as children move from scribbles toward lines, circles, and early representational drawing.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','playdough','Playdough','Playdough',7,'Playdough builds hand strength through squeezing, rolling, and pinching, giving little fingers the workout they need for drawing, dressing, and tool use.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles & early maths',4,true,'little-hands-puzzles-and-early-maths','Little hands, puzzles and early maths','Around 3, children start matching, sorting, counting, drawing, snipping, and building with more intent. Hands-on play helps connect pattern, quantity, problem-solving, and fine-motor control.','child-safety-scissors','Child-safe scissors','Child-safe scissors',8,'Child-safe scissors help children practise opening and closing one hand while the other hand holds paper steady — an important two-handed skill.',NULL,NULL,NULL,NULL,35,'emerging','This band marks a clearer shift from simple trial-and-error into deliberate matching, counting, building, and tool use. The cognitive and fine-motor challenge level noticeably steps up around 3 years.',NULL,'Use only with adult supervision and choose toddler-safe rounded designs.'),
  ('34-36m','34–36 months',34,36,true,'moving-and-playing-outside','Moving & playing outside',5,true,'moving-and-playing-outside','Moving and playing outside','By this age many children want to run, climb, jump, kick, pedal, and test what their body can do. The right outdoor play supports confidence, coordination, and joyful movement.','tricycle','Tricycles','Tricycles',1,'Tricycles support pedalling, steering, and reciprocal leg movement for children who are ready for longer bursts of active outdoor play.',NULL,NULL,NULL,NULL,35,'consolidating','Running, climbing, jumping, kicking, and pedalling are all highly visible 3-year movement themes. This band is less about first steps and more about practising control, agility, and confidence in motion.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'moving-and-playing-outside','Moving & playing outside',5,true,'moving-and-playing-outside','Moving and playing outside','By this age many children want to run, climb, jump, kick, pedal, and test what their body can do. The right outdoor play supports confidence, coordination, and joyful movement.','balance-bike','Balance bikes','Balance bikes',2,'Balance bikes help children practise steering, gliding, and body balance in motion, building coordination and confidence before pedal bikes.',NULL,NULL,NULL,NULL,35,'consolidating','Running, climbing, jumping, kicking, and pedalling are all highly visible 3-year movement themes. This band is less about first steps and more about practising control, agility, and confidence in motion.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'moving-and-playing-outside','Moving & playing outside',5,true,'moving-and-playing-outside','Moving and playing outside','By this age many children want to run, climb, jump, kick, pedal, and test what their body can do. The right outdoor play supports confidence, coordination, and joyful movement.','outdoor-climbing-frame','Outdoor climbing frames','Outdoor climbing frames',3,'Outdoor climbing frames give children a place to climb, scramble, and test space, height, and movement with growing confidence.',NULL,NULL,NULL,NULL,35,'consolidating','Running, climbing, jumping, kicking, and pedalling are all highly visible 3-year movement themes. This band is less about first steps and more about practising control, agility, and confidence in motion.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'moving-and-playing-outside','Moving & playing outside',5,true,'moving-and-playing-outside','Moving and playing outside','By this age many children want to run, climb, jump, kick, pedal, and test what their body can do. The right outdoor play supports confidence, coordination, and joyful movement.','ball','Balls','Balls',4,'Large soft balls make it easy to practise kicking, throwing, catching, and chasing — all classic 3-year-old movement skills.',NULL,NULL,NULL,NULL,35,'consolidating','Running, climbing, jumping, kicking, and pedalling are all highly visible 3-year movement themes. This band is less about first steps and more about practising control, agility, and confidence in motion.',NULL,NULL),
  ('34-36m','34–36 months',34,36,true,'language-books-and-conversation','Language, books & conversation',6,true,'language-books-and-conversation','Language, books and conversation','Sentences are getting longer, questions are multiplying, and children are starting to retell parts of stories. Rich back-and-forth talk and books help vocabulary, comprehension, and narrative thinking grow.','picture-books','Picture books','Picture books',1,'Narrative picture books help children listen to longer plots, answer simple questions about stories, and start retelling events in their own words.',NULL,NULL,NULL,NULL,35,'consolidating','By age 3, language shifts from short phrases toward fuller sentences, more questions, and simple storytelling. Books and conversation become especially useful because children can hold more of the narrative thread.',NULL,NULL);

INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT DISTINCT age_band_id, age_band_label, min_months, max_months, age_band_is_active
FROM _abi34
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = EXCLUDED.is_active;

DO $$
DECLARE
  r record;
  v_need_id uuid;
  has_need_name boolean;
  has_name boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='pl_development_needs' AND column_name='need_name'
  ) INTO has_need_name;
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='pl_development_needs' AND column_name='name'
  ) INTO has_name;

  FOR r IN (
    SELECT DISTINCT
      development_need_slug,
      development_need_canonical_name,
      stage1_why_it_matters_ux_description,
      optional_need_meta_stage_reason
    FROM _abi34
  ) LOOP
    SELECT id INTO v_need_id
    FROM public.pl_development_needs
    WHERE slug = r.development_need_slug
    LIMIT 1;

    IF v_need_id IS NULL THEN
      IF has_need_name AND has_name THEN
        EXECUTE 'INSERT INTO public.pl_development_needs (need_name, name, slug, plain_english_description, why_it_matters) VALUES ($1, $2, $3, $4, $5) RETURNING id'
          INTO v_need_id
          USING
            r.development_need_canonical_name,
            r.development_need_canonical_name,
            r.development_need_slug,
            r.stage1_why_it_matters_ux_description,
            COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''''), r.stage1_why_it_matters_ux_description);
      ELSIF has_need_name THEN
        EXECUTE 'INSERT INTO public.pl_development_needs (need_name, slug, plain_english_description, why_it_matters) VALUES ($1, $2, $3, $4) RETURNING id'
          INTO v_need_id
          USING
            r.development_need_canonical_name,
            r.development_need_slug,
            r.stage1_why_it_matters_ux_description,
            COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''''), r.stage1_why_it_matters_ux_description);
      ELSE
        EXECUTE 'INSERT INTO public.pl_development_needs (name, slug, plain_english_description, why_it_matters) VALUES ($1, $2, $3, $4) RETURNING id'
          INTO v_need_id
          USING
            r.development_need_canonical_name,
            r.development_need_slug,
            r.stage1_why_it_matters_ux_description,
            COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''''), r.stage1_why_it_matters_ux_description);
      END IF;
    ELSE
      UPDATE public.pl_development_needs
      SET
        name = COALESCE(name, r.development_need_canonical_name),
        plain_english_description = COALESCE(NULLIF(plain_english_description, ''), r.stage1_why_it_matters_ux_description),
        why_it_matters = COALESCE(NULLIF(why_it_matters, ''), COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''), r.stage1_why_it_matters_ux_description))
      WHERE id = v_need_id;

      IF has_need_name THEN
        UPDATE public.pl_development_needs
        SET need_name = COALESCE(need_name, r.development_need_canonical_name)
        WHERE id = v_need_id;
      END IF;
    END IF;
  END LOOP;
END $$;

INSERT INTO public.pl_ux_wrappers (ux_slug, ux_label, ux_description, is_active)
SELECT DISTINCT stage1_wrapper_ux_slug, stage1_wrapper_ux_label, stage1_why_it_matters_ux_description, true
FROM _abi34
ON CONFLICT (ux_slug) DO UPDATE SET
  ux_label = EXCLUDED.ux_label,
  ux_description = EXCLUDED.ux_description,
  is_active = true;

INSERT INTO public.pl_ux_wrapper_needs (ux_wrapper_id, development_need_id)
SELECT DISTINCT uw.id, dn.id
FROM _abi34 s
JOIN public.pl_ux_wrappers uw ON uw.ux_slug = s.stage1_wrapper_ux_slug
JOIN public.pl_development_needs dn ON dn.slug = s.development_need_slug
ON CONFLICT (ux_wrapper_id) DO UPDATE
SET development_need_id = EXCLUDED.development_need_id;

INSERT INTO public.pl_age_band_ux_wrappers (age_band_id, ux_wrapper_id, rank, is_active)
SELECT DISTINCT s.age_band_id, uw.id, s.stage1_wrapper_rank_in_band, s.stage1_mapping_is_active
FROM _abi34 s
JOIN public.pl_ux_wrappers uw ON uw.ux_slug = s.stage1_wrapper_ux_slug
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE SET
  rank = EXCLUDED.rank,
  is_active = EXCLUDED.is_active;

INSERT INTO public.pl_age_band_development_need_meta (
  age_band_id, development_need_id, stage_anchor_month, stage_phase, stage_reason, is_active
)
SELECT DISTINCT
  s.age_band_id,
  dn.id,
  s.optional_need_meta_stage_anchor_month,
  s.optional_need_meta_stage_phase,
  s.optional_need_meta_stage_reason,
  true
FROM _abi34 s
JOIN public.pl_development_needs dn ON dn.slug = s.development_need_slug
ON CONFLICT (age_band_id, development_need_id) DO UPDATE SET
  stage_anchor_month = EXCLUDED.stage_anchor_month,
  stage_phase = EXCLUDED.stage_phase,
  stage_reason = EXCLUDED.stage_reason,
  is_active = true;

WITH distinct_cats AS (
  SELECT DISTINCT
    stage2_category_type_slug AS slug,
    stage2_category_type_label AS label,
    stage2_category_type_name AS name,
    NULLIF(optional_category_image_url, '') AS image_url,
    NULLIF(optional_category_safety_notes, '') AS safety_notes
  FROM _abi34
),
resolved AS (
  SELECT
    dc.*,
    ct.id AS existing_id
  FROM distinct_cats dc
  LEFT JOIN public.pl_category_types ct
    ON ct.slug = dc.slug OR ct.name = dc.name
)
UPDATE public.pl_category_types ct
SET
  slug = COALESCE(NULLIF(ct.slug, ''), r.slug),
  label = COALESCE(r.label, ct.label),
  name = COALESCE(r.name, ct.name),
  image_url = COALESCE(r.image_url, ct.image_url),
  safety_notes = COALESCE(r.safety_notes, ct.safety_notes)
FROM resolved r
WHERE ct.id = r.existing_id;

WITH distinct_cats AS (
  SELECT DISTINCT
    stage2_category_type_slug AS slug,
    stage2_category_type_label AS label,
    stage2_category_type_name AS name,
    NULLIF(optional_category_image_url, '') AS image_url,
    NULLIF(optional_category_safety_notes, '') AS safety_notes
  FROM _abi34
),
resolved AS (
  SELECT
    dc.*,
    ct.id AS existing_id
  FROM distinct_cats dc
  LEFT JOIN public.pl_category_types ct
    ON ct.slug = dc.slug OR ct.name = dc.name
)
INSERT INTO public.pl_category_types (slug, label, name, image_url, safety_notes)
SELECT r.slug, r.label, r.name, r.image_url, r.safety_notes
FROM resolved r
WHERE r.existing_id IS NULL;

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id, development_need_id, category_type_id, rank, rationale, is_active
)
SELECT DISTINCT
  s.age_band_id,
  dn.id,
  ct.id,
  s.stage2_play_ideas_rank,
  s.stage2_play_idea_mapping_rationale,
  true
FROM _abi34 s
JOIN public.pl_development_needs dn ON dn.slug = s.development_need_slug
JOIN public.pl_category_types ct
  ON ct.slug = s.stage2_category_type_slug OR ct.name = s.stage2_category_type_name
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  is_active = true;

-- CSV has blank Stage 3 product fields, so keep this age band empty at Stage 3.
DELETE FROM public.pl_age_band_category_type_products
WHERE age_band_id = (SELECT DISTINCT age_band_id FROM _abi34 LIMIT 1);

COMMIT;
