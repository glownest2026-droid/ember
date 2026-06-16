-- Discover pilot import: age bands 16–18 months, 4–6 months
-- Source: discover_projection tab from Ember ABI workbooks (16-18m + 4-6m)
-- Stage 3 intentionally empty. Idempotent: safe to re-run.

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
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_floor_strength','The floor is my little gym',1,true,'ent_cluster_4_6_floor_strength','Floor strength and rolling practice','Wriggling on the floor, lifting for a toy or rolling onto a side can be hard work. This cluster gives your baby safe, supervised reasons to look, reach, push and rest, so floor time feels like a small discovery moment rather than a formal exercise.','for_your_child','cat_tummy_time_mat','A clean floor-play mat','A clean floor-play mat',1,'A clean, firm floor space makes short tummy-time sessions easier to repeat. Your baby can lift, turn, rest and try again while staying low to the ground. It gives you one simple place for awake play without turning every session into a big setup.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_floor_strength','The floor is my little gym',1,true,'ent_cluster_4_6_floor_strength','Floor strength and rolling practice','Wriggling on the floor, lifting for a toy or rolling onto a side can be hard work. This cluster gives your baby safe, supervised reasons to look, reach, push and rest, so floor time feels like a small discovery moment rather than a formal exercise.','for_your_child','cat_tummy_time_wobbler','Wobbly tummy-time toys','Wobbly tummy-time toys',2,'A small wobbly toy, placed just in front of your baby, can make tummy time more interesting. The tiny movement gives them something to look towards, bat at or follow, while you keep the session short, close and responsive to their cues.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_floor_strength','The floor is my little gym',1,true,'ent_cluster_4_6_floor_strength','Floor strength and rolling practice','Wriggling on the floor, lifting for a toy or rolling onto a side can be hard work. This cluster gives your baby safe, supervised reasons to look, reach, push and rest, so floor time feels like a small discovery moment rather than a formal exercise.','for_your_child','cat_baby_safe_mirror','A baby-safe mirror','A baby-safe mirror',3,'A mirror can hold your baby’s attention for a few extra moments on the floor. They may not understand the reflection yet, but the face, movement and your voice nearby can invite looking, lifting and shared smiles during supervised play.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_floor_strength','The floor is my little gym',1,true,'ent_cluster_4_6_floor_strength','Floor strength and rolling practice','Wriggling on the floor, lifting for a toy or rolling onto a side can be hard work. This cluster gives your baby safe, supervised reasons to look, reach, push and rest, so floor time feels like a small discovery moment rather than a formal exercise.','for_your_child','cat_soft_graspable_balls','Soft balls to watch, hold and roll','Soft balls to watch, hold and roll',4,'A soft ball can turn ordinary floor time into a little chase. You can roll it slowly, pause, let your baby watch or reach, then bring it back again. That simple loop gives movement, attention and hand control something playful to work with.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_hands','My hands can do more now',2,true,'ent_cluster_4_6_hands','Reaching, grasping and early hand control','Your baby may be swiping, holding, chewing and trying to bring interesting things closer. These small hand moments can become satisfying play when objects are light, safe and easy to grip, helping your baby connect what they see, feel and move.','for_your_child','cat_reach_grab_toys','Reach-and-grab toys','Reach-and-grab toys',1,'A toy just within reach can become a tiny challenge. Your baby may stare, swipe, grab, drop and try again. That repeated effort helps connect looking with hand movement, while keeping the play simple enough for short awake windows while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_hands','My hands can do more now',2,true,'ent_cluster_4_6_hands','Reaching, grasping and early hand control','Your baby may be swiping, holding, chewing and trying to bring interesting things closer. These small hand moments can become satisfying play when objects are light, safe and easy to grip, helping your baby connect what they see, feel and move.','for_your_child','cat_hand_transfer_toys','Toys to pass between hands','Toys to pass between hands',2,'Near the top of this band, some babies start turning, twisting or passing objects from one hand to the other. A light, easy-to-hold toy gives them space to practise that back-and-forth without needing a complicated activity.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_hands','My hands can do more now',2,true,'ent_cluster_4_6_hands','Reaching, grasping and early hand control','Your baby may be swiping, holding, chewing and trying to bring interesting things closer. These small hand moments can become satisfying play when objects are light, safe and easy to grip, helping your baby connect what they see, feel and move.','for_your_child','cat_sound_cylinders_shakers','Soft rattles and shakers','Soft rattles and shakers',3,'A soft rattle can make a hand movement feel exciting. When your baby shakes, drops or bangs it and hears a sound, they begin to notice that their own movement can change what happens around them while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_hands','My hands can do more now',2,true,'ent_cluster_4_6_hands','Reaching, grasping and early hand control','Your baby may be swiping, holding, chewing and trying to bring interesting things closer. These small hand moments can become satisfying play when objects are light, safe and easy to grip, helping your baby connect what they see, feel and move.','for_your_child','cat_cleanable_sensory_toys','Easy-clean sensory toys','Easy-clean sensory toys',4,'As hands and mouths get busier, wipeable or washable toys make repeated play less stressful. Different textures can invite grabbing, squeezing and mouthing, while easy cleaning helps parents keep the stage practical rather than constantly worrying about mess while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'cluster_mouth_sensory','Everything goes in my mouth',3,true,'cluster_mouth_sensory','Mouthing and sensory exploration','Hands, toys and safe textures often head straight to your baby’s mouth now. That can be normal exploring, and near six months it may overlap with teething. This cluster helps parents choose simple, washable, age-suitable objects while keeping tiny hazards away.','for_your_child','cat_teethers','Teethers and chew-safe toys','Teethers and chew-safe toys',1,'If your baby is chewing everything they can reach, an age-suitable teether can give that urge somewhere safer to go. It can help during ordinary mouthing and, near six months, may also be useful if teething signs start to appear.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'cluster_mouth_sensory','Everything goes in my mouth',3,true,'cluster_mouth_sensory','Mouthing and sensory exploration','Hands, toys and safe textures often head straight to your baby’s mouth now. That can be normal exploring, and near six months it may overlap with teething. This cluster helps parents choose simple, washable, age-suitable objects while keeping tiny hazards away.','for_your_child','cat_texture_cards_books','Touch-and-feel cards or books','Touch-and-feel cards or books',2,'A soft texture page or card gives your baby something to brush, grab, crinkle or mouth while you name what they notice. The value is not reading neatly, it is the shared moment of touch, sound and attention while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'cluster_mouth_sensory','Everything goes in my mouth',3,true,'cluster_mouth_sensory','Mouthing and sensory exploration','Hands, toys and safe textures often head straight to your baby’s mouth now. That can be normal exploring, and near six months it may overlap with teething. This cluster helps parents choose simple, washable, age-suitable objects while keeping tiny hazards away.','for_your_child','cat_mouth_safe_grasp_rings','Mouth-safe grasp rings','Mouth-safe grasp rings',3,'A simple grasp ring can be easy for little hands to catch, hold, drop and bring back to the mouth. That makes it useful for both hand practice and safe sensory exploring, especially when everything is being tested by touch and taste.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'cluster_mouth_sensory','Everything goes in my mouth',3,true,'cluster_mouth_sensory','Mouthing and sensory exploration','Hands, toys and safe textures often head straight to your baby’s mouth now. That can be normal exploring, and near six months it may overlap with teething. This cluster helps parents choose simple, washable, age-suitable objects while keeping tiny hazards away.','for_your_child','cat_safe_household_objects','Safe everyday-object play','Safe everyday-object play',4,'A clean cloth, large silicone spoon or empty tub can be fascinating when it is safe and supervised. Everyday objects give your baby new textures, shapes and sounds to explore, while helping parents avoid buying a new toy for every tiny stage.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_faces_sounds','Talk to me',4,true,'ent_cluster_4_6_faces_sounds','Faces, sounds and back-and-forth play','A squeal, a smile, a raspberry or a look back at you can be the start of a tiny conversation. This cluster gives parents easy ways to pause, copy, sing, show faces and read together, so communication feels warm and playful before words arrive.','for_your_child','cat_board_books','Chunky board books','Chunky board books',1,'A short board book can become a familiar little ritual: look, pause, name one thing, then wait for your baby’s face or sound. The pages matter less than the shared attention and your voice doing the same thing again while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_faces_sounds','Talk to me',4,true,'ent_cluster_4_6_faces_sounds','Faces, sounds and back-and-forth play','A squeal, a smile, a raspberry or a look back at you can be the start of a tiny conversation. This cluster gives parents easy ways to pause, copy, sing, show faces and read together, so communication feels warm and playful before words arrive.','for_your_child','cat_songs_action_games','Songs, pauses and silly sounds','Songs, pauses and silly sounds',2,'A song with pauses gives your baby a chance to join in with a look, wriggle, squeal or raspberry. Copying their sound and waiting can make a tiny back-and-forth game, even before clear babbling arrives while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_faces_sounds','Talk to me',4,true,'ent_cluster_4_6_faces_sounds','Faces, sounds and back-and-forth play','A squeal, a smile, a raspberry or a look back at you can be the start of a tiny conversation. This cluster gives parents easy ways to pause, copy, sing, show faces and read together, so communication feels warm and playful before words arrive.','for_your_child','cat_family_faces_cards','Family photo cards','Family photo cards',3,'Simple family photos can give your baby familiar faces to notice. You can name one person, wait, smile and repeat. It is a small way to connect recognition, attention and language without needing a busy toy or screen while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_faces_sounds','Talk to me',4,true,'ent_cluster_4_6_faces_sounds','Faces, sounds and back-and-forth play','A squeal, a smile, a raspberry or a look back at you can be the start of a tiny conversation. This cluster gives parents easy ways to pause, copy, sing, show faces and read together, so communication feels warm and playful before words arrive.','for_your_child','cat_feelings_faces_books','Baby faces and feelings books','Baby faces and feelings books',4,'Books with baby faces, smiles or everyday expressions give you something concrete to point to and name. Your baby will not understand feelings neatly yet, but faces, voice and repetition make this a warm shared-attention moment while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_cause_effect','I can make things happen',5,true,'ent_cluster_4_6_cause_effect','Cause-and-effect sensory play','A shake, kick, crinkle or spin can suddenly feel fascinating because your baby is starting to connect movement with a response. This cluster turns simple sensory feedback into playful experiments, while keeping the objects sturdy, safe and easy to supervise.','for_your_child','cat_crinkle_cloth_toys','Crinkle cloths and soft sound toys','Crinkle cloths and soft sound toys',1,'A soft crinkle toy can turn a small squeeze or swipe into sound. That little response helps your baby notice the connection between their hand and what happens next, while keeping the play soft enough for floor or lap time.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_cause_effect','I can make things happen',5,true,'ent_cluster_4_6_cause_effect','Cause-and-effect sensory play','A shake, kick, crinkle or spin can suddenly feel fascinating because your baby is starting to connect movement with a response. This cluster turns simple sensory feedback into playful experiments, while keeping the objects sturdy, safe and easy to supervise.','for_your_child','cat_kick_play_socks','Kick-and-discover socks','Kick-and-discover socks',2,'If your baby is finding their feet, soft play socks or gentle ankle rattles can make kicks and leg movements more noticeable. It is not about training movement, just giving your baby another small thing to feel, hear and discover.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_cause_effect','I can make things happen',5,true,'ent_cluster_4_6_cause_effect','Cause-and-effect sensory play','A shake, kick, crinkle or spin can suddenly feel fascinating because your baby is starting to connect movement with a response. This cluster turns simple sensory feedback into playful experiments, while keeping the objects sturdy, safe and easy to supervise.','for_your_child','cat_spinner_reach_toys','Simple spinners for reaching','Simple spinners for reaching',3,'A simple spinner can give your baby an obvious result when they reach, tap or push. The movement keeps attention for a moment, while the action stays small and manageable for a baby who is still learning how hands work.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_cause_effect','I can make things happen',5,true,'ent_cluster_4_6_cause_effect','Cause-and-effect sensory play','A shake, kick, crinkle or spin can suddenly feel fascinating because your baby is starting to connect movement with a response. This cluster turns simple sensory feedback into playful experiments, while keeping the objects sturdy, safe and easy to supervise.','for_your_child','cat_pull_out_tissue_box','Pull-out box toys','Pull-out box toys',4,'Pulling a soft cloth from a box, seeing another appear and trying again can feel wonderfully satisfying. It gives your baby a first taste of cause and effect, containment and texture without needing a complicated toy while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_body_world','I’m finding my body',6,true,'ent_cluster_4_6_body_world','Body awareness and first little words','Your baby may be staring at their hands, grabbing feet or lighting up at a familiar face. This cluster makes those ordinary moments easier to notice and name, using mirrors, body books and simple games that help your baby connect movement, touch and words.','for_your_child','cat_parts_of_me_books','Body-part board books','Body-part board books',1,'A body-part book gives you easy words for what your baby is already finding: hands, feet, tummy, face. Pointing, naming and pausing makes the moment feel playful, even if your baby mostly wants to chew the page while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_body_world','I’m finding my body',6,true,'ent_cluster_4_6_body_world','Body awareness and first little words','Your baby may be staring at their hands, grabbing feet or lighting up at a familiar face. This cluster makes those ordinary moments easier to notice and name, using mirrors, body books and simple games that help your baby connect movement, touch and words.','for_your_child','cat_feet_discovery_games','Foot-finding floor games','Foot-finding floor games',2,'When your baby reaches for their toes, you can turn it into a gentle naming game: feet, toes, kick, again. The movement is already happening, and your voice helps make it a shared moment of body awareness while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_body_world','I’m finding my body',6,true,'ent_cluster_4_6_body_world','Body awareness and first little words','Your baby may be staring at their hands, grabbing feet or lighting up at a familiar face. This cluster makes those ordinary moments easier to notice and name, using mirrors, body books and simple games that help your baby connect movement, touch and words.','for_your_child','cat_mirror_body_play','Mirror-and-body play','Mirror-and-body play',3,'A baby-safe mirror can become more than a looking toy when you name what appears: eyes, smile, hands, baby. Your baby may simply watch or grin, but that small pause builds shared attention around body and face words while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_body_world','I’m finding my body',6,true,'ent_cluster_4_6_body_world','Body awareness and first little words','Your baby may be staring at their hands, grabbing feet or lighting up at a familiar face. This cluster makes those ordinary moments easier to notice and name, using mirrors, body books and simple games that help your baby connect movement, touch and words.','for_your_child','cat_soft_sensory_balls','Soft sensory balls','Soft sensory balls',4,'A soft textured ball can be squeezed, rolled, mouthed or held against little feet. It gives your baby another way to feel shape, pressure and movement, while you keep the language simple and the game close while you stay close.','for_your_child'),
  ('4-6m','4–6 months',4,6,true,'cluster_first_foods','First tastes are getting close',7,true,'cluster_first_foods','First foods readiness','Near six months, first tastes may be getting closer, but the useful job is readiness, not rushing. This cluster helps parents spot the real signs, set up safe seating and keep early meals calm, messy and responsive to their baby’s cues.','for_both','cat_highchair','A supportive highchair','A supportive highchair',1,'When first foods begin, upright seating helps your baby stay steady while you stay close. A supportive highchair or feeding seat is not about neat eating, it is about making those tiny first tastes safer, calmer and easier to manage.','for_both'),
  ('4-6m','4–6 months',4,6,true,'cluster_first_foods','First tastes are getting close',7,true,'cluster_first_foods','First foods readiness','Near six months, first tastes may be getting closer, but the useful job is readiness, not rushing. This cluster helps parents spot the real signs, set up safe seating and keep early meals calm, messy and responsive to their baby’s cues.','for_both','cat_open_cup','An open or free-flow cup','An open or free-flow cup',2,'A small open or free-flow cup can be introduced with meals from around six months. Expect spills, chewing and confusion at first. The useful part is the repeated practice: holding, sipping and learning a new mouth movement slowly while you stay close.','for_both'),
  ('4-6m','4–6 months',4,6,true,'cluster_first_foods','First tastes are getting close',7,true,'cluster_first_foods','First foods readiness','Near six months, first tastes may be getting closer, but the useful job is readiness, not rushing. This cluster helps parents spot the real signs, set up safe seating and keep early meals calm, messy and responsive to their baby’s cues.','for_both','cat_first_spoons_bowls','First spoons and bowls','First spoons and bowls',3,'A small spoon and simple bowl can help your baby touch, hold, wave and sometimes taste food. If they turn away or close their mouth, that is useful communication too. The aim is relaxed practice, not finishing a portion while you stay close.','for_both'),
  ('4-6m','4–6 months',4,6,true,'cluster_first_foods','First tastes are getting close',7,true,'cluster_first_foods','First foods readiness','Near six months, first tastes may be getting closer, but the useful job is readiness, not rushing. This cluster helps parents spot the real signs, set up safe seating and keep early meals calm, messy and responsive to their baby’s cues.','for_both','cat_weaning_bibs_mat','Bibs and splash mats','Bibs and splash mats',4,'Early feeding can mean food on hands, cheeks, chair and floor. Bibs and a splash mat do not teach feeding, but they make the mess easier to tolerate, so parents can let babies touch and explore without feeling every meal is a cleanup crisis.','for_both'),
  ('4-6m','4–6 months',4,6,true,'cluster_first_foods','First tastes are getting close',7,true,'cluster_first_foods','First foods readiness','Near six months, first tastes may be getting closer, but the useful job is readiness, not rushing. This cluster helps parents spot the real signs, set up safe seating and keep early meals calm, messy and responsive to their baby’s cues.','for_both','cat_allergen_tracking','Food notes or allergen tracker','Food notes or allergen tracker',5,'A few simple notes can help parents remember what was offered, when, and whether anything changed afterwards. It is especially useful when introducing common allergen foods one at a time, without turning early feeding into a spreadsheet obsession while you stay close.','for_both'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_safety','Keep this next stage safe',8,true,'ent_cluster_4_6_safety','Safety checks for a busier baby','A baby who rolls, reaches and mouths more can change the home before anyone feels ready. This cluster keeps the parent job calm and practical: check sleep space, car-seat fit, tiny hazards and battery risks before the next jump in movement.','for_you','cat_safe_sleep_continuity','Safe sleep check-in','Safe sleep check-in',1,'This is still part of the first-six-month safer sleep window. A quick check of back sleeping, same-room sleep, room temperature and a clear cot can do more for safety than adding another sleep gadget while you stay close.','for_you'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_safety','Keep this next stage safe',8,true,'ent_cluster_4_6_safety','Safety checks for a busier baby','A baby who rolls, reaches and mouths more can change the home before anyone feels ready. This cluster keeps the parent job calm and practical: check sleep space, car-seat fit, tiny hazards and battery risks before the next jump in movement.','for_you','cat_rear_facing_car_seat','Rear-facing car-seat check','Rear-facing car-seat check',2,'At 4-6 months, the question is usually fit and correct use, not turning forward. A quick check of approval label, harness position, seat limits and airbag guidance helps keep travel safe as your baby grows while you stay close.','for_you'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_safety','Keep this next stage safe',8,true,'ent_cluster_4_6_safety','Safety checks for a busier baby','A baby who rolls, reaches and mouths more can change the home before anyone feels ready. This cluster keeps the parent job calm and practical: check sleep space, car-seat fit, tiny hazards and battery risks before the next jump in movement.','for_you','cat_small_object_sweep','Small-object safety sweep','Small-object safety sweep',3,'Your baby may not be crawling yet, but reaching and mouthing can make the floor feel different overnight. A simple sweep for coins, old toy parts, beads and older-sibling pieces helps keep floor play safer while you stay close.','for_you'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_safety','Keep this next stage safe',8,true,'ent_cluster_4_6_safety','Safety checks for a busier baby','A baby who rolls, reaches and mouths more can change the home before anyone feels ready. This cluster keeps the parent job calm and practical: check sleep space, car-seat fit, tiny hazards and battery risks before the next jump in movement.','for_you','cat_button_battery_check','Button battery check','Button battery check',4,'Musical toys, remotes, thermometers and greeting cards can hide button batteries. Checking that compartments are secure and loose batteries are out of reach is a small job with high safety value as hands and mouths get busier while you stay close.','for_you'),
  ('4-6m','4–6 months',4,6,true,'ent_cluster_4_6_safety','Keep this next stage safe',8,true,'ent_cluster_4_6_safety','Safety checks for a busier baby','A baby who rolls, reaches and mouths more can change the home before anyone feels ready. This cluster keeps the parent job calm and practical: check sleep space, car-seat fit, tiny hazards and battery risks before the next jump in movement.','for_you','cat_clear_cot_check','Clear cot check','Clear cot check',5,'Soft toys, bumpers, nests and wedges can look helpful, but a clear sleep space is safer. A quick cot check is especially useful before rolling and reaching feel more active, when extra items can end up closer to baby’s face.','for_you'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_little_adventures','Little explorer mode',1,true,'ent_cluster_16_18_little_adventures','Walking, climbing and little adventures','Your toddler may be walking further, climbing higher and turning the whole room into a route. This cluster gives that new movement a safer outlet: balls to chase, things to pull, music to dance to and simple spaces where they can practise balance without every moment feeling risky.','for_your_child','cat_soft_graspable_balls','Soft balls to roll and chase','Soft balls to roll and chase',1,'Rolling a soft ball away gives your toddler a clear reason to move: step, bend, reach, fetch and try again. It can redirect throwing into something safer, while building balance, coordination and shared attention indoors, in the garden or during a quick park reset.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_little_adventures','Little explorer mode',1,true,'ent_cluster_16_18_little_adventures','Walking, climbing and little adventures','Your toddler may be walking further, climbing higher and turning the whole room into a route. This cluster gives that new movement a safer outlet: balls to chase, things to pull, music to dance to and simple spaces where they can practise balance without every moment feeling risky.','for_your_child','cat_16_18_pull_push_toys','Push-and-pull toys','Push-and-pull toys',2,'A pull toy or steady push toy can make walking feel purposeful without rushing it. Your toddler gets to move, stop, turn and watch something follow them, which adds a little problem-solving to all that new whole-body practice.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_little_adventures','Little explorer mode',1,true,'ent_cluster_16_18_little_adventures','Walking, climbing and little adventures','Your toddler may be walking further, climbing higher and turning the whole room into a route. This cluster gives that new movement a safer outlet: balls to chase, things to pull, music to dance to and simple spaces where they can practise balance without every moment feeling risky.','for_your_child','cat_16_18_low_climb_tunnel','Low climbing and crawl-through play','Low climbing and crawl-through play',3,'Climbing onto the sofa, crawling through a tunnel or stepping over a cushion can feel thrilling at this stage. Low, supervised movement play gives your toddler a safer way to practise balance, strength and problem-solving without turning every chair into the main attraction.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_little_adventures','Little explorer mode',1,true,'ent_cluster_16_18_little_adventures','Walking, climbing and little adventures','Your toddler may be walking further, climbing higher and turning the whole room into a route. This cluster gives that new movement a safer outlet: balls to chase, things to pull, music to dance to and simple spaces where they can practise balance without every moment feeling risky.','for_your_child','cat_16_18_music_dance','Music and dancing games','Music and dancing games',4,'A song, clap or silly dance can turn a restless moment into movement practice. Your toddler can copy actions, stop and start, hear rhythm and use their whole body, while you add simple words like more, stop, fast and slow.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_busy_hands','Busy little hands',2,true,'ent_cluster_16_18_busy_hands','Busy hands and two-handed challenges','Little hands are getting more purposeful now. Your toddler may stack, pull, poke, turn, post and try again, often with fierce concentration. Simple two-handed challenges help build finger strength, coordination and focus, while still feeling like play rather than a task to complete.','for_your_child','cat_16_18_threading_beads','Threading beads and chunky lacing','Threading beads and chunky lacing',1,'Holding a bead in one hand and guiding a cord with the other is a satisfying challenge. Big, age-rated pieces let your toddler practise grip, focus and two-handed coordination, even if they spend most of the time exploring rather than threading neatly.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_busy_hands','Busy little hands',2,true,'ent_cluster_16_18_busy_hands','Busy hands and two-handed challenges','Little hands are getting more purposeful now. Your toddler may stack, pull, poke, turn, post and try again, often with fierce concentration. Simple two-handed challenges help build finger strength, coordination and focus, while still feeling like play rather than a task to complete.','for_your_child','cat_16_18_stacking_pegboard','Stacking pegboards and block towers','Stacking pegboards and block towers',2,'Building a little tower, fitting pieces onto pegs and knocking everything down can be wonderfully repeatable. Your toddler practises hand control, depth, balance and early problem-solving, while learning that the same action can create a result they recognise, change and try again.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_busy_hands','Busy little hands',2,true,'ent_cluster_16_18_busy_hands','Busy hands and two-handed challenges','Little hands are getting more purposeful now. Your toddler may stack, pull, poke, turn, post and try again, often with fierce concentration. Simple two-handed challenges help build finger strength, coordination and focus, while still feeling like play rather than a task to complete.','for_your_child','cat_16_18_shape_sorters_puzzles','Shape sorters and first puzzles','Shape sorters and first puzzles',3,'Turning a chunky piece around and trying it in a hole can hold attention for longer than parents expect. Shape sorters and first puzzles help toddlers practise matching, rotation, patience and hand control, even when the answer takes a few attempts.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_busy_hands','Busy little hands',2,true,'ent_cluster_16_18_busy_hands','Busy hands and two-handed challenges','Little hands are getting more purposeful now. Your toddler may stack, pull, poke, turn, post and try again, often with fierce concentration. Simple two-handed challenges help build finger strength, coordination and focus, while still feeling like play rather than a task to complete.','for_your_child','cat_16_18_velcro_pull_hide','Pull, stick and hide toys','Pull, stick and hide toys',4,'Pulling a soft piece away, sticking it back and hiding it again gives both hands a job. This kind of play supports grip strength, coordination and attention, while adding a little hide-and-find surprise that keeps the challenge playful.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_cause_effect','What happens next?',3,true,'ent_cluster_16_18_cause_effect','Cause-and-effect discoveries','Rolling a car, posting a shape or opening a little door can become a tiny experiment. Your toddler is starting to connect their action with what happens next. These simple repeatable toys give them a clear result to watch, test and enjoy again.','for_your_child','cat_16_18_ramp_rolling_toys','Ramp and rolling toys','Ramp and rolling toys',1,'Sending a car or ball down a ramp gives your toddler a clear little experiment. They can watch speed, direction and surprise, then do it again. The repetition helps build attention, anticipation and early cause-and-effect thinking in a way they can see straight away.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_cause_effect','What happens next?',3,true,'ent_cluster_16_18_cause_effect','Cause-and-effect discoveries','Rolling a car, posting a shape or opening a little door can become a tiny experiment. Your toddler is starting to connect their action with what happens next. These simple repeatable toys give them a clear result to watch, test and enjoy again.','for_your_child','cat_16_18_posting_drop_boxes','Posting and drop boxes','Posting and drop boxes',2,'Dropping a shape into a box and finding it again can become a tiny mystery. Your toddler practises aiming, releasing, waiting and checking where something went, which turns a simple container into a strong problem-solving toy with a satisfying ending.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_cause_effect','What happens next?',3,true,'ent_cluster_16_18_cause_effect','Cause-and-effect discoveries','Rolling a car, posting a shape or opening a little door can become a tiny experiment. Your toddler is starting to connect their action with what happens next. These simple repeatable toys give them a clear result to watch, test and enjoy again.','for_your_child','cat_16_18_latch_busy_boards','Latches, doors and busy boards','Latches, doors and busy boards',3,'A toddler who wants to open every cupboard may love a safer board with simple latches, doors or switches. It gives curiosity a contained place to practise cause-and-effect, hand control and focus, while keeping real hazards out of reach.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_cause_effect','What happens next?',3,true,'ent_cluster_16_18_cause_effect','Cause-and-effect discoveries','Rolling a car, posting a shape or opening a little door can become a tiny experiment. Your toddler is starting to connect their action with what happens next. These simple repeatable toys give them a clear result to watch, test and enjoy again.','for_your_child','cat_stacking_nesting_cups','Stacking and nesting cups','Stacking and nesting cups',4,'Cups can be stacked, knocked down, nested, filled, tipped and hidden under. That flexibility makes them useful at this stage, when toddlers enjoy changing one small thing and watching what happens, especially in the bath, on the floor or with safe household objects.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_words_instructions','Words are waking up',4,true,'ent_cluster_16_18_words_instructions','First words, body parts and little instructions','Words, pointing and understanding can jump forward around this stage. Your toddler may name familiar things, follow one simple instruction or show you what they want. Books, songs and body-part games turn those little moments into warm, repeatable language practice.','for_your_child','cat_16_18_first_word_picture_books','First-word picture books','First-word picture books',1,'A sturdy picture book gives your toddler something to point at, hold and hear named again. Real photos, familiar objects and short pages make it easier to repeat words, wait for their gesture and turn book time into a tiny conversation.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_words_instructions','Words are waking up',4,true,'ent_cluster_16_18_words_instructions','First words, body parts and little instructions','Words, pointing and understanding can jump forward around this stage. Your toddler may name familiar things, follow one simple instruction or show you what they want. Books, songs and body-part games turn those little moments into warm, repeatable language practice.','for_your_child','cat_16_18_body_part_books_games','Body-part books and games','Body-part books and games',2,'Pointing to a nose, foot or tummy can become a funny little game. Body-part books, songs and mirror moments help your toddler link words with themselves and other people, while practising one simple instruction at a time in a warm, low-pressure way.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_words_instructions','Words are waking up',4,true,'ent_cluster_16_18_words_instructions','First words, body parts and little instructions','Words, pointing and understanding can jump forward around this stage. Your toddler may name familiar things, follow one simple instruction or show you what they want. Books, songs and body-part games turn those little moments into warm, repeatable language practice.','for_your_child','cat_songs_action_games','Songs and action games','Songs and action games',3,'Action songs give your toddler a pattern they can predict: listen, clap, pause, copy and try a sound. The words matter, but so do the gestures and shared laughter, which make communication feel warm, physical and easy to repeat during ordinary moments.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_words_instructions','Words are waking up',4,true,'ent_cluster_16_18_words_instructions','First words, body parts and little instructions','Words, pointing and understanding can jump forward around this stage. Your toddler may name familiar things, follow one simple instruction or show you what they want. Books, songs and body-part games turn those little moments into warm, repeatable language practice.','for_your_child','cat_16_18_naming_walks','Naming walks and object hunts','Naming walks and object hunts',4,'A walk can become a naming game when your toddler points to a dog, bus, leaf or bin lorry. Following what they notice helps link words with real objects, while giving the day a low-pressure reset outside the house.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_copying_life','Copying real life',5,true,'ent_cluster_16_18_copying_life','Pretend, care and everyday copying','Your toddler may copy what they see: feeding a teddy, sweeping the floor, carrying a bag or pretending to drink from a cup. These small scenes help them practise memory, language and care, using the everyday life they already understand.','for_your_child','cat_13_15_doll_soft_toy_care','Soft toy and doll care play','Soft toy and doll care play',1,'Feeding a teddy, tucking in a doll or patting a soft toy can look tiny, but it shows your toddler copying care they know. These familiar scenes help with imitation, language and early empathy without needing complicated pretend play or a big setup.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_copying_life','Copying real life',5,true,'ent_cluster_16_18_copying_life','Pretend, care and everyday copying','Your toddler may copy what they see: feeding a teddy, sweeping the floor, carrying a bag or pretending to drink from a cup. These small scenes help them practise memory, language and care, using the everyday life they already understand.','for_your_child','cat_13_15_toy_cups_spoons','Pretend cups, spoons and food','Pretend cups, spoons and food',2,'Pretending to pour a drink, stir a bowl or feed a teddy links real daily routines with play. Your toddler can copy what they see, practise words like more and drink, and explore object use in a safe, familiar way.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_copying_life','Copying real life',5,true,'ent_cluster_16_18_copying_life','Pretend, care and everyday copying','Your toddler may copy what they see: feeding a teddy, sweeping the floor, carrying a bag or pretending to drink from a cup. These small scenes help them practise memory, language and care, using the everyday life they already understand.','for_your_child','cat_16_18_play_kitchen_household_props','Play kitchen and household props','Play kitchen and household props',3,'A small pan, spoon, brush or play kitchen can make copying feel purposeful. Your toddler may stir, sweep, carry, open and close, turning what they watch every day into language, memory and early pretend play that feels close to real family life.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_copying_life','Copying real life',5,true,'ent_cluster_16_18_copying_life','Pretend, care and everyday copying','Your toddler may copy what they see: feeding a teddy, sweeping the floor, carrying a bag or pretending to drink from a cup. These small scenes help them practise memory, language and care, using the everyday life they already understand.','for_your_child','cat_16_18_toddler_bag_carry','Carry bags and little errands','Carry bags and little errands',4,'Putting a block in a bag, carrying it across the room and taking it out again can be deeply satisfying. A little carry game gives your toddler movement, purpose and simple language while they practise doing what grown-ups do.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_mark_mess','Making my mark',6,true,'ent_cluster_16_18_mark_mess','Scribbles, marks and messy little play','A scribble, splash or squish can be the whole point at this age. Your toddler is exploring what their hands can change. Chunky crayons, water marks and soft sensory play give them a safe way to notice texture, pressure, colour and movement.','for_your_child','cat_16_18_chunky_crayons','Chunky crayons and first scribbles','Chunky crayons and first scribbles',1,'Scribbling is not about drawing something recognisable yet. A chunky crayon lets your toddler press, swipe, dot and notice the mark they made, building hand control and confidence through a simple, visible result they can repeat again and again on paper.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_mark_mess','Making my mark',6,true,'ent_cluster_16_18_mark_mess','Scribbles, marks and messy little play','A scribble, splash or squish can be the whole point at this age. Your toddler is exploring what their hands can change. Chunky crayons, water marks and soft sensory play give them a safe way to notice texture, pressure, colour and movement.','for_your_child','cat_16_18_water_drawing','Water drawing mats','Water drawing mats',2,'A water mat lets your toddler make a mark, watch it fade and try again. It keeps early drawing low-mess, while still offering the satisfying loop of press, swipe, see and repeat that makes first marks so interesting for busy hands.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_mark_mess','Making my mark',6,true,'ent_cluster_16_18_mark_mess','Scribbles, marks and messy little play','A scribble, splash or squish can be the whole point at this age. Your toddler is exploring what their hands can change. Chunky crayons, water marks and soft sensory play give them a safe way to notice texture, pressure, colour and movement.','for_your_child','cat_16_18_play_dough_soft_clay','Soft dough and squish-safe sensory play','Soft dough and squish-safe sensory play',3,'Squashing, poking and pulling soft dough gives little fingers a different kind of workout. Your toddler explores pressure, texture and shape, while you can add simple words like soft, flat, more and again as the play unfolds beside you calmly.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_mark_mess','Making my mark',6,true,'ent_cluster_16_18_mark_mess','Scribbles, marks and messy little play','A scribble, splash or squish can be the whole point at this age. Your toddler is exploring what their hands can change. Chunky crayons, water marks and soft sensory play give them a safe way to notice texture, pressure, colour and movement.','for_your_child','cat_16_18_texture_tubs','Texture tubs and safe sensory baskets','Texture tubs and safe sensory baskets',4,'A basket with safe, large textures can hold attention without needing a complex toy. Your toddler can pick up, squeeze, sort and compare, while you name simple contrasts like soft, hard, big and small during a calm floor-play moment.','for_your_child'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_daily_practice','Daily practice, less stress',7,true,'ent_cluster_16_18_daily_practice','Messy meals and toothbrushing practice','Meals and teeth can feel messy, slow and repetitive, but they are also full of useful practice. Cups, spoons, finger foods and toothbrushing routines help your toddler join in with daily care, while giving you calmer ways to supervise and clean up.','for_both','cat_open_cup','Open or free-flow cup','Open or free-flow cup',1,'Drinking from an open or free-flow cup can be messy at first, and that is normal. A small cup gives your toddler practice holding, tipping and swallowing, while helping move daily drinks away from baby-bottle habits at their own pace.','for_both'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_daily_practice','Daily practice, less stress',7,true,'ent_cluster_16_18_daily_practice','Messy meals and toothbrushing practice','Meals and teeth can feel messy, slow and repetitive, but they are also full of useful practice. Cups, spoons, finger foods and toothbrushing routines help your toddler join in with daily care, while giving you calmer ways to supervise and clean up.','for_both','cat_first_spoons_bowls','Small spoons and stable bowls','Small spoons and stable bowls',2,'Trying a spoon can mean slow meals and food everywhere, but it is useful practice. A small spoon and stable bowl let your toddler scoop, miss, try again and feel involved, while you keep expectations calm, realistic and easier to clean up.','for_both'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_daily_practice','Daily practice, less stress',7,true,'ent_cluster_16_18_daily_practice','Messy meals and toothbrushing practice','Meals and teeth can feel messy, slow and repetitive, but they are also full of useful practice. Cups, spoons, finger foods and toothbrushing routines help your toddler join in with daily care, while giving you calmer ways to supervise and clean up.','for_both','cat_16_18_finger_food_snack_prep','Finger-food and snack prep','Finger-food and snack prep',3,'Finger foods help toddlers practise picking up, chewing and feeding themselves. The parent job is the safety bit: soft textures, suitable shapes, close supervision and simple snacks that make days out, nursery handovers or hungry moments easier to manage without panic.','for_both'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_daily_practice','Daily practice, less stress',7,true,'ent_cluster_16_18_daily_practice','Messy meals and toothbrushing practice','Meals and teeth can feel messy, slow and repetitive, but they are also full of useful practice. Cups, spoons, finger foods and toothbrushing routines help your toddler join in with daily care, while giving you calmer ways to supervise and clean up.','for_both','cat_16_18_toothbrush_routine','Toddler toothbrush and teeth routine','Toddler toothbrush and teeth routine',4,'A tiny toothbrush, a familiar song and the same order each night can make teeth less of a battle. The aim is steady practice: brush, pause, repeat and let the routine become something your toddler recognises before bed each evening.','for_both'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_safer_home','Safer home checks',8,true,'ent_cluster_16_18_safer_home','Home safety for a taller, faster toddler','A 16- to 18-month-old can be suddenly taller, quicker and more determined. The same room may need a new scan for stairs, windows, cupboards, water and hidden batteries. These checks help your toddler keep exploring while the riskiest hazards stay out of reach.','for_you','cat_safety_gates','Safety gates','Safety gates',1,'Stairs can become interesting very quickly once walking and climbing grow. Safety gates at the right places help contain the biggest fall risks, giving your toddler safer areas to explore while you stay close, supervise and keep stairways clear every day.','for_you'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_safer_home','Safer home checks',8,true,'ent_cluster_16_18_safer_home','Home safety for a taller, faster toddler','A 16- to 18-month-old can be suddenly taller, quicker and more determined. The same room may need a new scan for stairs, windows, cupboards, water and hidden batteries. These checks help your toddler keep exploring while the riskiest hazards stay out of reach.','for_you','cat_cupboard_locks','Cupboard locks and safer storage','Cupboard locks and safer storage',2,'Opening cupboards can be a fascinating experiment for a toddler. Locks and higher storage keep medicines, cleaning products and other dangerous items unavailable, while still leaving safer drawers and baskets for supervised exploring with everyday objects that are suitable nearby.','for_you'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_safer_home','Safer home checks',8,true,'ent_cluster_16_18_safer_home','Home safety for a taller, faster toddler','A 16- to 18-month-old can be suddenly taller, quicker and more determined. The same room may need a new scan for stairs, windows, cupboards, water and hidden batteries. These checks help your toddler keep exploring while the riskiest hazards stay out of reach.','for_you','cat_16_18_furniture_window_checks','Furniture, stair and window checks','Furniture, stair and window checks',3,'A toddler can use furniture as a ladder before you expect it. Checking window areas, trip hazards, unstable furniture and climbable surfaces helps the room keep pace with their new reach, strength and curiosity as movement gets quicker and bolder.','for_you'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_safer_home','Safer home checks',8,true,'ent_cluster_16_18_safer_home','Home safety for a taller, faster toddler','A 16- to 18-month-old can be suddenly taller, quicker and more determined. The same room may need a new scan for stairs, windows, cupboards, water and hidden batteries. These checks help your toddler keep exploring while the riskiest hazards stay out of reach.','for_you','cat_button_battery_check','Button battery checks','Button battery checks',4,'Remotes, cards, scales, toys and lights can hide button batteries. A quick household sweep helps remove one of the more serious risks for a toddler who still explores with hands and mouth, especially around older-sibling toys and gadgets nearby.','for_you'),
  ('16-18m','16–18 months',16,18,true,'ent_cluster_16_18_safer_home','Safer home checks',8,true,'ent_cluster_16_18_safer_home','Home safety for a taller, faster toddler','A 16- to 18-month-old can be suddenly taller, quicker and more determined. The same room may need a new scan for stairs, windows, cupboards, water and hidden batteries. These checks help your toddler keep exploring while the riskiest hazards stay out of reach.','for_you','cat_16_18_bath_water_supervision','Bath and water supervision','Bath and water supervision',5,'Bath cups and splashing can be brilliant, but water needs full adult attention every time. Keeping everything within reach before the bath helps you stay close while your toddler pours, tips and explores safely in a contained space with you.','for_you');

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

CREATE TEMP TABLE tmp_discover_stage2_category_types AS
SELECT
  s.stage2_category_type_slug,
  s.stage2_category_type_label,
  s.stage2_category_type_name
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(s.stage2_category_type_label))
      ORDER BY s.min_months ASC, s.age_band_id ASC, s.stage2_play_ideas_rank ASC, s.stage2_category_type_slug ASC
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
SELECT DISTINCT
  uw.id AS ux_wrapper_id,
  dn.id AS development_need_id
FROM tmp_discover_projection_stage s
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
  src.stage2_category_type_label,
  src.stage2_category_type_name,
  NULL,
  NULL
FROM tmp_discover_stage2_category_types src
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
  label = src.stage2_category_type_label,
  name = src.stage2_category_type_name,
  updated_at = now()
FROM tmp_discover_stage2_category_types src
WHERE LOWER(COALESCE(ct.slug, '')) = LOWER(src.stage2_category_type_slug);

CREATE TEMP TABLE tmp_discover_resolved_need_category AS
SELECT DISTINCT
  s.age_band_id,
  dn.id AS development_need_id,
  ct.id AS category_type_id,
  s.stage2_play_ideas_rank AS rank,
  NULLIF(TRIM(COALESCE(s.stage2_play_idea_mapping_rationale, '')), '') AS rationale,
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
  audience_lens,
  is_active
)
SELECT
  r.age_band_id,
  r.development_need_id,
  r.category_type_id,
  r.rank,
  r.rationale,
  r.audience_lens,
  true
FROM tmp_discover_resolved_need_category r
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
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
  v_rows_16_18m INTEGER;
  v_clusters_16_18m INTEGER;
  v_rows_4_6m INTEGER;
  v_clusters_4_6m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_16_18m FROM tmp_discover_projection_stage WHERE age_band_id = '16-18m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_16_18m
  FROM tmp_discover_projection_stage WHERE age_band_id = '16-18m';
  SELECT COUNT(*) INTO v_rows_4_6m FROM tmp_discover_projection_stage WHERE age_band_id = '4-6m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_4_6m
  FROM tmp_discover_projection_stage WHERE age_band_id = '4-6m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('16-18m', '4-6m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 67)', v_rows_loaded;
  RAISE NOTICE '16-18m rows: % (expected 33), clusters: % (expected 8)', v_rows_16_18m, v_clusters_16_18m;
  RAISE NOTICE '4-6m rows: % (expected 34), clusters: % (expected 8)', v_rows_4_6m, v_clusters_4_6m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 67 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_16_18m <> 33 THEN
    RAISE EXCEPTION 'Row count validation failed for 16-18m';
  END IF;
  IF v_rows_4_6m <> 34 THEN
    RAISE EXCEPTION 'Row count validation failed for 4-6m';
  END IF;
  IF v_clusters_16_18m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 16-18m';
  END IF;
  IF v_clusters_4_6m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 4-6m';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('16-18m', '4-6m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('16-18m', '4-6m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('16-18m', '4-6m');
