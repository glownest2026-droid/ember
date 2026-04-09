-- ABI V2 import for Discover age band 31-33m (child voice v8).
-- Source of truth: C:/Users/timwo/Downloads/ABI_31_33m_v8_ready_child_voice.csv
-- Stage 3 in this task is intentionally NOT imported.
-- Idempotent and scoped to age_band_id = '31-33m'.

BEGIN;

CREATE TEMP TABLE tmp_abi_31_33_v8 (
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
  stage2_category_type_slug TEXT NOT NULL,
  stage2_category_type_label TEXT NOT NULL,
  stage2_category_type_name TEXT NOT NULL,
  stage2_play_ideas_rank INTEGER NOT NULL,
  stage2_play_idea_mapping_rationale TEXT,
  optional_need_meta_stage_anchor_month INTEGER,
  optional_need_meta_stage_phase TEXT,
  optional_need_meta_stage_reason TEXT,
  optional_category_image_url TEXT,
  optional_category_safety_notes TEXT
) ON COMMIT DROP;

INSERT INTO tmp_abi_31_33_v8 (
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
  stage2_category_type_slug,
  stage2_category_type_label,
  stage2_category_type_name,
  stage2_play_ideas_rank,
  stage2_play_idea_mapping_rationale,
  optional_need_meta_stage_anchor_month,
  optional_need_meta_stage_phase,
  optional_need_meta_stage_reason,
  optional_category_image_url,
  optional_category_safety_notes
)
VALUES
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','visual_countdown_timer','Visual Countdown Timer','Visual Countdown Timer',1,'Makes the abstract concept of ''time'' visible, reducing transition frustration by giving child a clear visual cue for when an activity will end.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','emotion_matching_tiles','Emotion Faces Matching Tiles','Emotion Faces Matching Tiles',2,'Builds emotional literacy by helping child identify and name subtle facial expressions in themselves and others.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','calm_down_sensory_bottle','DIY Calm-Down Sensory Bottle','DIY Calm-Down Sensory Bottle',3,'Provides a focused visual anchor during high-emotion moments, helping to lower the heart rate and redirect attention to a soothing stimulus.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','social_scripts_books','Social Script Board Books (Sharing/Turns)','Social Script Board Books (Sharing/Turns)',4,'Provides concrete language and ''blueprints'' for complex social situations like sharing toys or joining in peer play.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'self_care_independence','I’m doing more by myself',2,true,'self_care_independence','Self Care Independence','I want to do more for myself now — reaching the sink, helping with dressing, and joining in with everyday routines. Small tools, visual steps, and repeatable routines help me feel capable.','child_faucet_extender','Silicone Faucet Extender','Silicone Faucet Extender',1,'Brings the water stream within reach, allowing child to wash hands independently without needing to be lifted or reaching unsafely.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'self_care_independence','I’m doing more by myself',2,true,'self_care_independence','Self Care Independence','I want to do more for myself now — reaching the sink, helping with dressing, and joining in with everyday routines. Small tools, visual steps, and repeatable routines help me feel capable.','visual_routine_cards','Magnetic Visual Routine Cards','Magnetic Visual Routine Cards',2,'Breaks down multi-step tasks (like dressing or bedtime) into a sequence of images the child can follow independently.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'self_care_independence','I’m doing more by myself',2,true,'self_care_independence','Self Care Independence','I want to do more for myself now — reaching the sink, helping with dressing, and joining in with everyday routines. Small tools, visual steps, and repeatable routines help me feel capable.','child_safe_chopper','Wooden Child-Safe Vegetable Chopper','Wooden Child-Safe Vegetable Chopper',3,'Develops hand strength and bilateral coordination through ''real'' work; fosters a sense of contribution to the household.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'self_care_independence','I’m doing more by myself',2,true,'self_care_independence','Self Care Independence','I want to do more for myself now — reaching the sink, helping with dressing, and joining in with everyday routines. Small tools, visual steps, and repeatable routines help me feel capable.','dressing_frame_velcro','Velcro & Large Button Dressing Frame','Velcro & Large Button Dressing Frame',4,'Isolates the skill of fastening from the act of dressing, allowing child to practice coordination without the frustration of wearing the garment.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'fine_motor','My hands can do more now',3,true,'fine_motor','Fine Motor','My hands are ready for more precise jobs now. Twisting, threading, snipping, squeezing, and tool play help me build control for dressing, drawing, and everyday tasks.','screw_driver_board','Wooden Screwdriver & Bolt Board','Wooden Screwdriver & Bolt Board',1,'Builds precise pincer grasp, hand-eye coordination, and the ability to follow a multi-step mechanical process.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'fine_motor','My hands can do more now',3,true,'fine_motor','Fine Motor','My hands are ready for more precise jobs now. Twisting, threading, snipping, squeezing, and tool play help me build control for dressing, drawing, and everyday tasks.','dropper_painting_set','Pipette / Dropper Art Set','Pipette / Dropper Art Set',2,'Strengthens the small muscles of the thumb and index finger (pincer grasp) through the repetitive squeezing motion of the pipette.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'fine_motor','My hands can do more now',3,true,'fine_motor','Fine Motor','My hands are ready for more precise jobs now. Twisting, threading, snipping, squeezing, and tool play help me build control for dressing, drawing, and everyday tasks.','child_safe_scissors','Training Scissors & Paper Strips','Training Scissors & Paper Strips',3,'Develops bilateral coordination (using two hands for different tasks) and hand strength; introduces the concept of following a line.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'fine_motor','My hands can do more now',3,true,'fine_motor','Fine Motor','My hands are ready for more precise jobs now. Twisting, threading, snipping, squeezing, and tool play help me build control for dressing, drawing, and everyday tasks.','bead_pattern_threading','Pattern-Matching Threading Beads','Pattern-Matching Threading Beads',4,'Combines fine motor threading with cognitive pattern-matching; requires child to follow a visual rule while performing a motor task.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'gross_motor','My body is ready for bigger moves',4,true,'gross_motor','Gross Motor','My body wants bigger movement now — climbing, balancing, jumping, throwing, and scooting. Repeating these challenges helps me build confidence, coordination, and body control.','balance_stones','Nonslip Balance Stepping Stones','Nonslip Balance Stepping Stones',1,'Supports dynamic balance, spatial awareness, and the ability to judge distances; encourages active indoor play.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'gross_motor','My body is ready for bigger moves',4,true,'gross_motor','Gross Motor','My body wants bigger movement now — climbing, balancing, jumping, throwing, and scooting. Repeating these challenges helps me build confidence, coordination, and body control.','bean_bag_target_toss','Bean Bag Accuracy Toss Set','Bean Bag Accuracy Toss Set',2,'Develops hand-eye coordination and the ability to grade movements (adjusting force to hit a target).',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'gross_motor','My body is ready for bigger moves',4,true,'gross_motor','Gross Motor','My body wants bigger movement now — climbing, balancing, jumping, throwing, and scooting. Repeating these challenges helps me build confidence, coordination, and body control.','indoor_climbing_triangle','Pikler-Style Climbing Triangle','Pikler-Style Climbing Triangle',3,'Provides a safe outlet for the natural drive to climb; builds upper body strength and problem-solving skills in 3D space.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'gross_motor','My body is ready for bigger moves',4,true,'gross_motor','Gross Motor','My body wants bigger movement now — climbing, balancing, jumping, throwing, and scooting. Repeating these challenges helps me build confidence, coordination, and body control.','scooter_3_wheel','3-Wheeled Lean-to-Steer Scooter','3-Wheeled Lean-to-Steer Scooter',4,'Supports bilateral coordination, balance, and spatial planning; introduces the concept of steering and speed control.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'language_communication','I’ve got more to say',5,true,'language_communication','Language Communication','I’ve got more to say now. I’m asking more questions, talking in longer phrases, and starting to retell little bits of my day. Simple prompts and story play help me join ideas together.','narrative_sequencing_tiles','3-Part Story Sequencing Tiles','3-Part Story Sequencing Tiles',1,'Builds logical sequencing and narrative skills; supports the milestone of recalling parts of a story or event.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'language_communication','I’ve got more to say',5,true,'language_communication','Language Communication','I’ve got more to say now. I’m asking more questions, talking in longer phrases, and starting to retell little bits of my day. Simple prompts and story play help me join ideas together.','phonetic_sound_matching','Object-to-Sound Matching Set','Object-to-Sound Matching Set',2,'Introduces phonetic awareness by matching a physical object (e.g., ''a-a-apple'') to its starting sound.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'language_communication','I’ve got more to say',5,true,'language_communication','Language Communication','I’ve got more to say now. I’m asking more questions, talking in longer phrases, and starting to retell little bits of my day. Simple prompts and story play help me join ideas together.','action_verb_cards','Action Verb ''Do It'' Cards','Action Verb ''Do It'' Cards',3,'Expands vocabulary beyond nouns to include verbs and action words; supports the transition to 3-word sentences.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'language_communication','I’ve got more to say',5,true,'language_communication','Language Communication','I’ve got more to say now. I’m asking more questions, talking in longer phrases, and starting to retell little bits of my day. Simple prompts and story play help me join ideas together.','question_prompt_cards','Who/What/Where Question Prompts','Who/What/Where Question Prompts',4,'Encourages the use of question words and supports conversational turn-taking; builds social communication skills.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'cognitive_problem_solving','I’m figuring things out',6,true,'cognitive_problem_solving','Cognitive Problem Solving','I’m getting better at remembering, sorting, spotting patterns, and working things out. Play that asks me to compare, rotate, match, and hold a simple rule in mind helps me feel capable.','attribute_sorting_set','Multi-Attribute Sorting Bears','Multi-Attribute Sorting Bears',1,'Builds cognitive flexibility by requiring child to sort items by two rules at once (e.g., ''all the red small bears'').',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'cognitive_problem_solving','I’m figuring things out',6,true,'cognitive_problem_solving','Cognitive Problem Solving','I’m getting better at remembering, sorting, spotting patterns, and working things out. Play that asks me to compare, rotate, match, and hold a simple rule in mind helps me feel capable.','liquid_lab_volume','Liquid Lab Volume Discovery Set','Liquid Lab Volume Discovery Set',2,'Introduces early STEM concepts of volume and conservation through open-ended water play and measurement.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'cognitive_problem_solving','I’m figuring things out',6,true,'cognitive_problem_solving','Cognitive Problem Solving','I’m getting better at remembering, sorting, spotting patterns, and working things out. Play that asks me to compare, rotate, match, and hold a simple rule in mind helps me feel capable.','memory_match_cards','Working Memory Match Game','Working Memory Match Game',3,'Builds working memory and concentration by requiring child to remember the location of hidden images.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'cognitive_problem_solving','I’m figuring things out',6,true,'cognitive_problem_solving','Cognitive Problem Solving','I’m getting better at remembering, sorting, spotting patterns, and working things out. Play that asks me to compare, rotate, match, and hold a simple rule in mind helps me feel capable.','twist_pivot_puzzle','3D Spatial ''Twist & Pivot'' Puzzle','3D Spatial ''Twist & Pivot'' Puzzle',4,'Challenges spatial reasoning by requiring pieces to be rotated and oriented correctly to fit, moving beyond simple 2D jigsaws.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','cooperative_board_game','First Cooperative Game (e.g. Snail''s Pace)','First Cooperative Game (e.g. Snail''s Pace)',5,'Teaches the rules of turn-taking and shared goals without the stress of competition; supports inhibitory control.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','doctor_vet_pretend_set','Imaginative Role-Play Doctor/Vet Kit','Imaginative Role-Play Doctor/Vet Kit',6,'Develops empathy and reduces anxiety about medical visits through ''rehearsal'' play; supports complex narrative scripts.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','doll_care_set','Baby Doll Care & Nurturing Set','Baby Doll Care & Nurturing Set',7,'Fosters nurturing behaviors and empathy; provides a safe outlet for practicing social routines like feeding and bathing.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'social_emotional','I’m learning to play with other people',1,true,'social_emotional','Social Emotional','I’m getting better at waiting a little, taking turns, and noticing how other people feel. Role play, gentle routines, and simple games help me practise big feelings and playing together.','puppet_theatre_props','Hand Puppets for Social Role-Play','Hand Puppets for Social Role-Play',8,'Allows child to practice social interactions (like saying hello or sharing) through a ''character,'' making it less intimidating.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'toileting','I’m getting ready for potty',7,true,'toileting','Toileting','I’m getting ready for potty in my own time. Feeling safe, steady, and in control matters more than rushing. The right setup helps toileting feel manageable, not overwhelming.','potty_chair_low','Low-Profile Ergonomic Potty Chair','Low-Profile Ergonomic Potty Chair',1,'Ensures proper physiological positioning (feet flat) for successful elimination; reduces the ''fear of falling'' into a big toilet.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'toileting','I’m getting ready for potty',7,true,'toileting','Toileting','I’m getting ready for potty in my own time. Feeling safe, steady, and in control matters more than rushing. The right setup helps toileting feel manageable, not overwhelming.','toilet_training_seat_adapter','Contoured Toilet Seat Adapter','Contoured Toilet Seat Adapter',2,'Provides stability and reduces the aperture of the adult toilet, making the transition from potty to toilet feel secure.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'self_care_independence','I’m doing more by myself',2,true,'self_care_independence','Self Care Independence','I want to do more for myself now — reaching the sink, helping with dressing, and joining in with everyday routines. Small tools, visual steps, and repeatable routines help me feel capable.','child_step_stool_dual','Dual-Height Nonslip Step Stool','Dual-Height Nonslip Step Stool',5,'Allows child to reach the sink and toilet independently; dual height accommodates growth over the 31-36m window.',NULL,NULL,NULL,NULL,NULL),
  ('31-33m','31–33 months',31,33,true,'self_care_independence','I’m doing more by myself',2,true,'self_care_independence','Self Care Independence','I want to do more for myself now — reaching the sink, helping with dressing, and joining in with everyday routines. Small tools, visual steps, and repeatable routines help me feel capable.','visual_hygiene_schedule','Laminated ''Wash Your Hands'' Visual Guide','Laminated ''Wash Your Hands'' Visual Guide',6,'Breaks down the 5 steps of handwashing into clear images, ensuring child follows the full hygiene routine without constant prompting.',NULL,NULL,NULL,NULL,NULL);

-- 1) Age band row
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT DISTINCT age_band_id, age_band_label, min_months, max_months, age_band_is_active
FROM tmp_abi_31_33_v8
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 2) Development needs (reuse by slug/name; create unresolved only)
INSERT INTO public.pl_development_needs (name, slug, plain_english_description, why_it_matters)
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
  FROM tmp_abi_31_33_v8 s
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
  name = COALESCE(NULLIF(dn.name, ''), src.development_need_canonical_name),
  plain_english_description = COALESCE(NULLIF(dn.plain_english_description, ''), src.stage1_why_it_matters_ux_description),
  why_it_matters = COALESCE(NULLIF(dn.why_it_matters, ''), src.stage1_why_it_matters_ux_description),
  updated_at = now()
FROM (
  SELECT DISTINCT
    s.development_need_slug,
    s.development_need_canonical_name,
    NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
  FROM tmp_abi_31_33_v8 s
) src
WHERE LOWER(COALESCE(dn.slug, '')) = LOWER(src.development_need_slug);

-- 3) Stage 1 wrappers + wrapper->need links
CREATE TEMP TABLE tmp_stage1_wrappers_31_33 AS
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY s.stage1_wrapper_ux_slug
      ORDER BY s.stage1_wrapper_rank_in_band, s.stage2_play_ideas_rank, s.stage2_category_type_slug
    ) AS rn
  FROM tmp_abi_31_33_v8 s
) s
WHERE s.rn = 1;

INSERT INTO public.pl_ux_wrappers (ux_slug, ux_label, ux_description, is_active)
SELECT stage1_wrapper_ux_slug, stage1_wrapper_ux_label, stage1_why_it_matters_ux_description, true
FROM tmp_stage1_wrappers_31_33
ON CONFLICT (ux_slug) DO UPDATE
SET
  ux_label = EXCLUDED.ux_label,
  ux_description = EXCLUDED.ux_description,
  is_active = true,
  updated_at = now();

INSERT INTO public.pl_ux_wrapper_needs (ux_wrapper_id, development_need_id)
SELECT DISTINCT
  uw.id AS ux_wrapper_id,
  dn.id AS development_need_id
FROM tmp_abi_31_33_v8 s
JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
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
WHERE abuw.age_band_id = '31-33m'
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_abi_31_33_v8 s
    JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
    WHERE uw.id = abuw.ux_wrapper_id
  );

INSERT INTO public.pl_age_band_ux_wrappers (age_band_id, ux_wrapper_id, rank, is_active)
SELECT DISTINCT
  s.age_band_id,
  uw.id,
  s.stage1_wrapper_rank_in_band,
  s.stage1_mapping_is_active
FROM tmp_abi_31_33_v8 s
JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 4) Stage 2 category type masters + need->category mappings
INSERT INTO public.pl_category_types (slug, label, name, description, safety_notes, image_url)
SELECT
  src.stage2_category_type_slug,
  src.stage2_category_type_label,
  src.stage2_category_type_name,
  NULL,
  NULLIF(TRIM(COALESCE(src.optional_category_safety_notes, '')), ''),
  NULLIF(TRIM(COALESCE(src.optional_category_image_url, '')), '')
FROM (
  SELECT DISTINCT
    s.stage2_category_type_slug,
    s.stage2_category_type_label,
    s.stage2_category_type_name,
    s.optional_category_safety_notes,
    s.optional_category_image_url
  FROM tmp_abi_31_33_v8 s
) src
LEFT JOIN public.pl_category_types ct_slug
  ON LOWER(COALESCE(ct_slug.slug, '')) = LOWER(src.stage2_category_type_slug)
LEFT JOIN public.pl_category_types ct_name
  ON LOWER(COALESCE(ct_name.name, '')) = LOWER(src.stage2_category_type_name)
LEFT JOIN public.pl_category_types ct_label
  ON LOWER(COALESCE(ct_label.label, '')) = LOWER(src.stage2_category_type_label)
WHERE ct_slug.id IS NULL
  AND ct_name.id IS NULL
  AND ct_label.id IS NULL
ON CONFLICT (slug) DO NOTHING;

UPDATE public.pl_category_types ct
SET
  label = COALESCE(NULLIF(ct.label, ''), src.stage2_category_type_label),
  name = COALESCE(NULLIF(ct.name, ''), src.stage2_category_type_name),
  image_url = COALESCE(NULLIF(ct.image_url, ''), NULLIF(TRIM(COALESCE(src.optional_category_image_url, '')), '')),
  safety_notes = COALESCE(NULLIF(ct.safety_notes, ''), NULLIF(TRIM(COALESCE(src.optional_category_safety_notes, '')), '')),
  updated_at = now()
FROM (
  SELECT DISTINCT
    s.stage2_category_type_slug,
    s.stage2_category_type_label,
    s.stage2_category_type_name,
    s.optional_category_image_url,
    s.optional_category_safety_notes
  FROM tmp_abi_31_33_v8 s
) src
WHERE LOWER(COALESCE(ct.slug, '')) = LOWER(src.stage2_category_type_slug);

CREATE TEMP TABLE tmp_need_category_31_33 AS
SELECT DISTINCT
  s.age_band_id,
  dn.id AS development_need_id,
  ct.id AS category_type_id,
  s.stage2_play_ideas_rank AS rank,
  NULLIF(TRIM(COALESCE(s.stage2_play_idea_mapping_rationale, '')), '') AS rationale
FROM tmp_abi_31_33_v8 s
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
WHERE m.age_band_id = '31-33m'
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_need_category_31_33 r
    WHERE r.development_need_id = m.development_need_id
      AND r.category_type_id = m.category_type_id
  );

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id,
  development_need_id,
  category_type_id,
  rank,
  rationale,
  is_active
)
SELECT age_band_id, development_need_id, category_type_id, rank, rationale, true
FROM tmp_need_category_31_33
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  is_active = true,
  updated_at = now();

-- 5) Optional need meta
INSERT INTO public.pl_age_band_development_need_meta (
  age_band_id,
  development_need_id,
  stage_anchor_month,
  stage_phase,
  stage_reason,
  is_active
)
SELECT DISTINCT
  s.age_band_id,
  dn.id,
  s.optional_need_meta_stage_anchor_month,
  NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_phase, '')), ''),
  NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_reason, '')), ''),
  true
FROM tmp_abi_31_33_v8 s
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
WHERE s.optional_need_meta_stage_anchor_month IS NOT NULL
   OR NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_phase, '')), '') IS NOT NULL
   OR NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_reason, '')), '') IS NOT NULL
ON CONFLICT (age_band_id, development_need_id) DO UPDATE
SET
  stage_anchor_month = COALESCE(EXCLUDED.stage_anchor_month, public.pl_age_band_development_need_meta.stage_anchor_month),
  stage_phase = COALESCE(EXCLUDED.stage_phase, public.pl_age_band_development_need_meta.stage_phase),
  stage_reason = COALESCE(EXCLUDED.stage_reason, public.pl_age_band_development_need_meta.stage_reason),
  is_active = true,
  updated_at = now();

-- 6) Stage 3 intentionally skipped in this task; force this band's mappings inactive.
UPDATE public.pl_age_band_category_type_products p
SET
  is_active = false,
  updated_at = now()
WHERE p.age_band_id = '31-33m';

DO $$
DECLARE
  v_rows_loaded INTEGER;
  v_wrappers INTEGER;
  v_categories INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_abi_31_33_v8;
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_wrappers FROM tmp_abi_31_33_v8;
  SELECT COUNT(DISTINCT stage2_category_type_slug) INTO v_categories FROM tmp_abi_31_33_v8;
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id = '31-33m' AND is_active = true;

  RAISE NOTICE 'ABI 31-33 v8 rows loaded: %', v_rows_loaded;
  RAISE NOTICE 'Distinct Stage 1 wrappers: %', v_wrappers;
  RAISE NOTICE 'Distinct Stage 2 category types: %', v_categories;
  RAISE NOTICE 'Stage 3 active mappings (expected 0): %', v_stage3_active;
END $$;

COMMIT;

-- Rollback (scoped to this import):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id = '31-33m';
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id = '31-33m';
-- DELETE FROM public.pl_age_band_development_need_meta WHERE age_band_id = '31-33m';
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id = '31-33m';
