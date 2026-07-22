-- Discover pilot import: age bands 1–3 months
-- Source: discover_projection tab from Ember ABI workbooks (1-3m)
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
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_need_face_smile_chat','I’m finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_face_to_face_play','Face-to-face talking and smiling','Face To Face Play',1,'Your baby may be watching your face closely and beginning to answer with little sounds or smiles. Talking, smiling, pausing and copying expressions gives them a simple back-and-forth moment that supports bonding and early communication, without needing anything extra.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_need_face_smile_chat','I’m finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_copying_faces_expressions','Copying faces and little expressions','Copying Faces Expressions',2,'Your baby may begin copying tiny facial expressions, such as a tongue out or a wide-eyed look. Turning those moments into a gentle game helps them practise watching, waiting and responding, while keeping connection at the centre.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_need_face_smile_chat','I’m finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_baby_safe_mirror','A baby-safe mirror for faces','Baby Safe Mirror',3,'A baby-safe mirror can make a few minutes of awake play feel more interesting. Your baby will not understand the reflection yet, but faces, movement and your voice nearby can help hold their attention during floor or tummy-time moments.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Baby-safe floor mirror','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_need_visual_tracking','I’m finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_high_contrast_cards','High-contrast face cards','High Contrast Cards',4,'Bold face cards or simple black-and-white patterns can give your baby an easy target to look at while you sit nearby. The useful bit is not the card alone, but your slow pauses, voice and closeness around it.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'High-contrast face cards','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_need_face_smile_chat','I’m finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_board_books','Face books to look at together','Board Books',5,'A soft or chunky face book gives you a simple reason to sit close, name what you see and pause for your baby’s look or sound. At this age, the book is less important than your voice, rhythm and shared attention.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Soft face books','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_need_face_smile_chat','I’m listening to your voice','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.','for_your_child','cat_familiar_voice_pauses','Familiar voices and little pauses','Familiar Voice Pauses',1,'Your baby may quieten, look or coo when they hear a familiar voice. A simple pattern of talk, pause, wait and answer gives them time to process sound and try their own tiny response, without needing a toy at all.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_need_face_smile_chat','I’m listening to your voice','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.','for_your_child','cat_songs_action_games','Songs, rhymes and tiny games','Songs Action Games',2,'A short song, silly face or tiny peekaboo gives your baby sound, rhythm and expression to tune into. The pauses matter too, because they invite your baby to look, wriggle, coo or smile back in their own way.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_need_face_smile_chat','I’m listening to your voice','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.','for_your_child','cat_board_books','Board books and face books','Board Books',3,'Reading at this age is less about the story and more about your voice, rhythm and closeness. A chunky board book, wooden book or face book gives your baby something to look at while you name, pause and repeat.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.','If they already have books, choose something with faces, contrast or rhythm that gives them a new way to share attention.','Board books and face books','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_need_visual_tracking','I’m listening to your voice','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.','for_your_child','cat_sound_cylinders_shakers','Gentle shakers and sound toys','Sound Cylinders Shakers',4,'A gentle shaker or soft sound toy gives your baby a sound to notice and, later, a reason to reach. Keep the sound small and close to you, so your voice still does most of the work.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Gentle shakers and sound toys','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_need_face_smile_chat','I’m listening to your voice','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.','for_your_child','cat_song_rhyme_books','First song and rhyme books','Song Rhyme Books',5,'A small song or rhyme book can help an adult know what to say when the day feels long. The value is in the repeat: the same sounds, pauses and expressions become familiar little moments for your baby.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'First song and rhyme books','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','I’m watching the world',3,true,'ent_need_visual_tracking','I’m watching the world','Your baby may fix on a face, bold pattern or slow-moving object for a few seconds. Simple things to watch can help them practise focus, tracking and turning their head, without too much going on at once. Keep it slow, close and easy to follow.','for_your_child','cat_high_contrast_cards','High-contrast cards and simple patterns','High Contrast Cards',1,'At this age, a simple pattern, face or bold shape can be enough. High-contrast cards or pages give your baby something easy to look at during short awake windows, while you slowly move, pause and talk alongside them.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'High-contrast card set','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','I’m watching the world',3,true,'ent_need_visual_tracking','I’m watching the world','Your baby may fix on a face, bold pattern or slow-moving object for a few seconds. Simple things to watch can help them practise focus, tracking and turning their head, without too much going on at once. Keep it slow, close and easy to follow.','for_your_child','cat_tracking_rattle','A slow-moving rattle to track','Tracking Rattle',2,'A rattle moved slowly from side to side can give your baby something clear to follow. The object should stay close, the movement should be slow, and your voice can help turn looking into a shared moment.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Slow-moving rattle','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','I’m watching the world',3,true,'ent_need_visual_tracking','I’m watching the world','Your baby may fix on a face, bold pattern or slow-moving object for a few seconds. Simple things to watch can help them practise focus, tracking and turning their head, without too much going on at once. Keep it slow, close and easy to follow.','for_your_child','cat_contrast_mobile_supervised','A supervised mobile or moving object','Contrast Mobile Supervised',3,'A supervised mobile or slowly moving object can catch your baby’s eye during awake time. Keep it simple, secure and out of reach, and never rely on loose hanging items in the sleep space.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Supervised cot or pram mobile','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_need_tummy_head_control','I’m getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That still counts. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_tummy_time_mat','A simple tummy-time mat','Tummy Time Mat',1,'Tummy time does not need to be long to be useful. A simple, firm floor mat gives your baby a clean place to practise lifting, turning and looking around, while you stay close and keep the moment brief.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Simple tummy-time mat','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_need_tummy_head_control','I’m getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That still counts. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_tummy_time_wobbler','Tummy-time mirror or wobbler','Tummy Time Wobbler',2,'If tummy time gets protests, a nearby face, mirror or wobbly toy can give your baby a reason to lift, look or turn. Keep it close, brief and supervised, rather than trying to make every try last longer.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Tummy-time mirror or wobbler','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_need_tummy_head_control','I’m getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That still counts. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_rolled_towel_tummy_support','Rolled-towel tummy support','Rolled Towel Tummy Support',3,'A small rolled towel under your baby’s arms can sometimes make a short tummy moment easier. It is a setup idea, not a product to leave with them, and should only be used while you are right there.','for_your_child','setup','useful_ideas','Useful ideas',3,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_need_tummy_head_control','I’m getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That still counts. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_tummy_time_books','A soft tummy-time book','Tummy Time Books',4,'A soft book or fold-out page can give your baby something interesting to look at during short floor moments. Choose simple faces, bold patterns or textures, and keep it close enough to notice without crowding them.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Soft tummy-time book','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_need_first_grasps','I’m starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.','for_your_child','cat_kicky_floor_play','Kicky floor time','Kicky Floor Play',1,'Your baby may stretch, kick or wriggle more when they are awake and comfortable. A few minutes on a clear low surface gives those early movements room to happen, without the risk of a sofa, bed or changing table.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_need_visual_tracking','I’m starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.','for_your_child','cat_play_gym_hanging_toys','A simple play gym or hanging toys','Play Gym Hanging Toys',2,'A simple play gym can give your baby something to look towards, kick near or brush with a hand. Keep the setup uncluttered and watch for tired cues, because one or two hanging objects is usually plenty.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,false,true,'Good gift','A thoughtful gift if it fills a real gap at home.','Many families already own a play gym. Treat this as useful only if you know there is space and a gap.','Simple baby play gym','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_need_tummy_head_control','I’m starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.','for_your_child','cat_safe_floor_space','A clear low floor space','Safe Floor Space',3,'The safest place for early movement practice is low and close to you. A clear patch of floor helps you avoid raised-surface risks as your baby gets stronger, wrigglier and more surprising in how quickly they can shift position.','for_your_child','safety_check','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_need_tummy_head_control','I’m starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.','for_your_child','cat_supported_side_lying_play','Side-lying pauses and turns','Supported Side Lying Play',4,'Some babies start tipping or resting onto their side near this stage. Short, supervised side-lying pauses can help them feel a different body position, but the aim is gentle variety, not pushing rolling before they are ready.','for_your_child','activity','useful_ideas','Useful ideas',4,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_need_first_grasps','My hands are waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers and starting the first accidental grabs. Soft textures, easy holds and clean objects give them something simple to notice with their hands, eyes and mouth.','for_your_child','cat_reach_grab_toys','Reach-and-grab toys','Reach Grab Toys',1,'Your baby’s hands may be opening more, with swipes and accidental touches starting to appear. A simple reach-and-grab toy lets them practise looking, moving an arm and feeling a response, even before grasping is reliable.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Reach-and-grab toy','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_need_first_grasps','My hands are waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers and starting the first accidental grabs. Soft textures, easy holds and clean objects give them something simple to notice with their hands, eyes and mouth.','for_your_child','cat_soft_rattle_ring','A soft rattle or grasp ring','Soft Rattle Ring',2,'A soft rattle or chunky grasp ring can suit the first stage of holding. Choose something light, large and easy to clean, so accidental grabs, small shakes and mouth exploration stay manageable.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Soft rattle or grasp ring','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_need_first_grasps','My hands are waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers and starting the first accidental grabs. Soft textures, easy holds and clean objects give them something simple to notice with their hands, eyes and mouth.','for_your_child','cat_texture_cards_books','Soft textures to stroke and touch','Texture Cards Books',3,'Soft textures, crinkles and simple fabric pages give your baby something to brush, stroke or notice with their hands. At this age, the best choices are large, light, clean and easy for you to hold nearby.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Soft texture cards or cloth book','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_need_first_grasps','My hands are waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers and starting the first accidental grabs. Soft textures, easy holds and clean objects give them something simple to notice with their hands, eyes and mouth.','for_your_child','cat_cleanable_sensory_toys','Easy-clean sensory toys','Cleanable Sensory Toys',4,'As hands start opening and objects move towards the mouth, cleanability matters. Simple washable toys help you offer touch, sound or texture without creating a hygiene headache around feeds, floors and first mouthing attempts.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Easy-clean sensory toys','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_need_first_grasps','My hands are waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers and starting the first accidental grabs. Soft textures, easy holds and clean objects give them something simple to notice with their hands, eyes and mouth.','for_your_child','cat_teethers','Chew-safe toys and early teethers','Teethers',5,'Some babies start bringing hands or objects towards their mouth around the upper edge of this band. A large, clean, age-fit teether or chew-safe toy can help if they are ready, but it is not something every baby needs yet.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A thoughtful gift if it fills a real gap at home.',NULL,'Early teether or chew-safe toy','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_need_crying_settling','Help me settle and reconnect','Some days, your baby may cry, fuss or need help switching gears. Tiny resets, a close cuddle, a walk, or one repeatable note about what helped can make hard patches easier to read over time.','for_both','cat_white_noise_soother','Gentle white noise or sound reset','White Noise Soother',1,'Some babies respond to a steady background sound, especially when the day feels scratchy. Keep the volume low, place any device away from baby’s head, and treat it as one possible reset rather than a fix-all.','for_both','setup','things_that_can_help','Things that can help',1,false,false,false,'Parent buy',NULL,'High ownership risk: frame as useful only if the buyer knows there is a real gap.',NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_need_crying_settling','Help me settle and reconnect','Some days, your baby may cry, fuss or need help switching gears. Tiny resets, a close cuddle, a walk, or one repeatable note about what helped can make hard patches easier to read over time.','for_both','cat_pram_walk_reset','A pram walk reset','Pram Walk Reset',2,'A short pram walk can sometimes help everyone reset, especially if the house feels too loud or stuck. The useful bit is not a big outing, but a small repeatable change of light, sound and movement.','for_both','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_need_crying_settling','Help me settle and reconnect','Some days, your baby may cry, fuss or need help switching gears. Tiny resets, a close cuddle, a walk, or one repeatable note about what helped can make hard patches easier to read over time.','for_both','cat_soft_carrier_sling','A safe sling or carrier cuddle','Soft Carrier Sling',3,'A well-fitted sling or carrier can help you keep baby close while freeing your hands for small jobs. Fit matters more than brand: baby should be visible, supported and positioned safely every time.','for_both','product_category','things_that_can_help','Things that can help',3,true,false,false,'Parent buy',NULL,'High ownership risk: frame as useful only if the buyer knows there is a real gap.','Baby carrier or sling','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_need_crying_settling','Help me settle and reconnect','Some days, your baby may cry, fuss or need help switching gears. Tiny resets, a close cuddle, a walk, or one repeatable note about what helped can make hard patches easier to read over time.','for_both','cat_settling_routine_notes','A simple settling notes routine','Settling Routine Notes',4,'If crying feels hard to read, a tiny note of what helped can be useful: feed, wind, nappy, cuddle, walk or nap. This is not tracking for tracking’s sake, just a way to notice patterns when everyone is tired.','for_both','setup','useful_ideas','Useful ideas',4,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Make feeds feel easier',8,true,'ent_need_feeding_rhythm','Make feeds feel easier','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breast comfort all happening at once. Small bits of setup can reduce faff around feeds, so you can notice your baby’s signals and keep the practical jobs manageable.','for_you','cat_responsive_feeding_support','Responsive feeding cues','Responsive Feeding Support',1,'Your baby may show early cues before they cry, such as stirring, sucking hands, turning their head or opening their mouth. Noticing those little signals can make feeding feel more responsive, whether breast or bottle feeding.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Make feeds feel easier',8,true,'ent_need_feeding_rhythm','Make feeds feel easier','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breast comfort all happening at once. Small bits of setup can reduce faff around feeds, so you can notice your baby’s signals and keep the practical jobs manageable.','for_you','cat_burp_cloths_muslins','Muslins and burp cloths','Burp Cloths Muslins',2,'Muslins are not exciting, but they earn their keep at this age. Keeping a few within reach during feeds, winding and changes can reduce the small bits of faff that build up across a day.','for_you','product_category','things_that_can_help','Things that can help',2,true,false,false,'Parent buy',NULL,'Most families need more than they expect, but check fabric preferences if buying for someone else.','Muslins and burp cloths','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Make feeds feel easier',8,true,'ent_need_feeding_rhythm','Make feeds feel easier','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breast comfort all happening at once. Small bits of setup can reduce faff around feeds, so you can notice your baby’s signals and keep the practical jobs manageable.','for_you','cat_bottle_sterilising_kit','Bottle sterilising kit','Bottle Sterilising Kit',3,'If you use bottles, sterilising stays part of the routine for now. A simple setup for washing, sterilising and storing bottles helps keep the job repeatable, especially when feeds are frequent.','for_you','product_category','things_that_can_help','Things that can help',3,true,false,false,'Parent buy',NULL,NULL,'Bottle sterilising kit','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Make feeds feel easier',8,true,'ent_need_feeding_rhythm','Make feeds feel easier','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breast comfort all happening at once. Small bits of setup can reduce faff around feeds, so you can notice your baby’s signals and keep the practical jobs manageable.','for_you','cat_breastfeeding_comfort_supplies','Breastfeeding comfort supplies','Breastfeeding Comfort Supplies',4,'If breastfeeding is part of your day, comfort supplies can make the practical side easier: breast pads, a water bottle, nipple cream if needed, and somewhere to sit that supports your back and arms.','for_you','product_category','things_that_can_help','Things that can help',4,true,false,false,'Parent buy',NULL,NULL,'Breastfeeding comfort supplies','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Make feeds feel easier',8,true,'ent_need_feeding_rhythm','Make feeds feel easier','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breast comfort all happening at once. Small bits of setup can reduce faff around feeds, so you can notice your baby’s signals and keep the practical jobs manageable.','for_you','cat_milk_storage_and_labels','Milk storage and labels','Milk Storage And Labels',5,'If you are expressing or storing milk, labels and a simple fridge or freezer routine can prevent guesswork later. The useful bit is clarity: what it is, when it was expressed and when it should be used.','for_you','product_category','things_that_can_help','Things that can help',5,true,false,false,'Parent buy',NULL,NULL,'Milk storage bags and labels','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Help sleep stay safe',9,true,'ent_need_safe_sleep_setup','Help sleep stay safe','Safer sleep is one place where simple rules really help. A clear cot, firm flat mattress, room sharing and sensible layers make the sleep space easier to check, especially when you are tired and doing the same routine many times.','for_you','cat_safe_sleep_continuity','Safe sleep check-in','Safe Sleep Continuity',1,'Back sleeping, a clear cot and a firm flat surface are still the core checks. A quick reset before sleep helps you spot extra blankets, pods, pillows or soft toys that can creep into the space.','for_you','safety_check','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Help sleep stay safe',9,true,'ent_need_safe_sleep_setup','Help sleep stay safe','Safer sleep is one place where simple rules really help. A clear cot, firm flat mattress, room sharing and sensible layers make the sleep space easier to check, especially when you are tired and doing the same routine many times.','for_you','cat_firm_flat_mattress','A firm, flat, waterproof mattress','Firm Flat Mattress',2,'A firm, flat, waterproof mattress is one of the few sleep purchases where boring is good. Fit, firmness and condition matter more than features, and a new mattress is preferred where possible.','for_you','product_category','things_that_can_help','Things that can help',2,true,false,false,'Parent buy',NULL,NULL,'Firm flat baby mattress','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Help sleep stay safe',9,true,'ent_need_safe_sleep_setup','Help sleep stay safe','Safer sleep is one place where simple rules really help. A clear cot, firm flat mattress, room sharing and sensible layers make the sleep space easier to check, especially when you are tired and doing the same routine many times.','for_you','cat_room_thermometer','Room thermometer','Room Thermometer',3,'A room thermometer can make night checks easier when you are unsure about layers. It does not need to be fancy; it just helps you judge the room rather than guessing when everyone is half-asleep.','for_you','product_category','things_that_can_help','Things that can help',3,true,false,false,'Parent buy',NULL,NULL,'Room thermometer','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Help sleep stay safe',9,true,'ent_need_safe_sleep_setup','Help sleep stay safe','Safer sleep is one place where simple rules really help. A clear cot, firm flat mattress, room sharing and sensible layers make the sleep space easier to check, especially when you are tired and doing the same routine many times.','for_you','cat_baby_sleeping_bag','A well-fitting baby sleeping bag','Baby Sleeping Bag',4,'A well-fitting baby sleeping bag can make bedding simpler, but the size, tog and neck opening need to be right. It is useful because it reduces loose bedding, not because every baby needs the same sleepwear.','for_you','product_category','things_that_can_help','Things that can help',4,true,false,false,'Parent buy',NULL,'Sizing and tog matter, so this is better as a parent-led buy than a surprise gift.','Baby sleeping bag','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Help sleep stay safe',9,true,'ent_need_safe_sleep_setup','Help sleep stay safe','Safer sleep is one place where simple rules really help. A clear cot, firm flat mattress, room sharing and sensible layers make the sleep space easier to check, especially when you are tired and doing the same routine many times.','for_you','cat_clear_cot_check','Clear cot checks','Clear Cot Check',5,'A clear cot check is a small habit with big safety value. It helps you spot pillows, bumpers, soft toys, pods, nests, wedges or bulky bedding that can look helpful in a shop but should not be in baby’s sleep space.','for_you','safety_check','quick_checks','Quick checks',5,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_need_health_first_trips','Keep first trips simpler','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_red_book_vaccine_planning','Red Book and vaccine planning','Red Book Vaccine Planning',1,'The 6-week check and first vaccinations can arrive quickly while you are still in newborn fog. Keeping the Red Book, appointments and questions together helps you feel prepared, and gives you a useful record of growth, checks and immunisations.','for_you','setup','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_need_health_first_trips','Keep first trips simpler','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_rear_facing_car_seat','Rear-facing infant car seat','Rear Facing Car Seat',2,'A suitable rear-facing infant car seat is one of the clearest safety-sensitive purchases. UK rules require height-based seats to stay rear-facing until your child is over 15 months, so fit, approval and history matter from the start.','for_you','product_category','things_that_can_help','Things that can help',2,true,false,false,'Parent buy',NULL,'This should be chosen by the parent or caregiver because fit, approval and history matter.','Rear-facing infant car seat','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_need_health_first_trips','Keep first trips simpler','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_nappy_change_station','Nappy change station','Nappy Change Station',3,'Before a change, it helps to have the basics within reach: clean nappy, wipes or cotton wool, bag, cloth and any cream you use. The point is not a fancy station, just avoiding a step away from baby.','for_you','setup','things_that_can_help','Things that can help',3,true,false,false,'Parent buy',NULL,'This is usually a parent setup job, not a main gift idea.',NULL,'both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_need_health_first_trips','Keep first trips simpler','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_small_object_sweep','Small-object safety sweep','Small Object Sweep',4,'As hands open and objects start heading mouth-wards, a quick floor sweep becomes more useful. Look especially for coins, older-child toys, loose parts, batteries and anything small enough to choke on.','for_you','safety_check','quick_checks','Quick checks',4,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_need_health_first_trips','Keep first trips simpler','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_button_battery_check','Button battery checks','Button Battery Check',5,'Button batteries can hide in remotes, scales, thermometers, lights and toys. A quick check around the places baby lies, plays or gets changed helps keep a serious hazard out of reach before mouthing becomes more active.','for_you','safety_check','quick_checks','Quick checks',5,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','safety_no_shop_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_need_early_play','I’m listening to your voice','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.','for_your_child','cat_first_play_guide_cards','First play guide cards','First Play Guide Cards',4,'Some days, thinking of what to do is the hard part. A small set of baby play cards or a simple guide can give adults quick prompts for songs, faces, tummy moments and tiny games, without turning the day into homework.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A thoughtful gift for parents who would like quick ideas, not another large toy.','If they already have lots of toys, this is useful because it adds ideas for using what is already at home.','Baby play cards or guide deck','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_need_early_play','I’m listening to your voice','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this age.','for_your_child','cat_gentle_musical_touch_toy','A gentle musical touch toy','Gentle Musical Touch Toy',5,'A single gentle sound can give your baby something to notice without flooding the moment. Choose a soft, simple musical toy that responds to touch or movement, then use it slowly with your voice so sound still feels shared.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A fresher sound gift if it is gentle, simple and not too busy.','Keep this as one gentle sound option, not a basket of noisy toys.','Gentle musical touch toy','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','I’m watching the world',3,true,'ent_need_early_play','I’m watching the world','Your baby may fix on a face, bold pattern or slow-moving object for a few seconds at a time. Simple things to watch can make awake moments feel more purposeful, without adding noise or too many choices.','for_your_child','cat_rolling_bell_sound_ball','A rolling bell or sound ball','Rolling Bell Sound Ball',4,'A rolling bell or soft sound ball can turn a short awake moment into a simple watch-and-listen game. Roll or move it slowly nearby so your baby can notice the sound, the movement and where it goes.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A more interesting alternative to a standard rattle.','If they already have a rattle, a rolling version gives it a different job.','Rolling bell or sound ball','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_need_early_play','I’m getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That still counts. Short, supervised awake moments, a nearby face and one simple thing to look at can make early head-lifting practice feel more worthwhile.','for_your_child','cat_tummy_time_support_prop','A tummy-time support prop','Tummy Time Support Prop',4,'If tummy time is hard work, a small supervised support prop can make the position feel less sudden. The research file already supports rolled-towel support; a bought prop should stay simple, firm enough for awake play and used only with an adult right there.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Good gift','A thoughtful gift for babies who do not love tummy time yet.','A rolled towel can do the job, so buy this only if it makes short floor moments easier.','Tummy-time roller or support prop','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_need_early_play','I’m getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That still counts. Short, supervised awake moments, a nearby face and one simple thing to look at can make early head-lifting practice feel more worthwhile.','for_your_child','cat_crinkle_floor_book','A crinkle floor book','Crinkle Floor Book',5,'A crinkle floor book can sit in front of your baby during short supervised play, giving them faces, contrast or texture to notice. It is still just a prompt; the useful bit is your baby having a reason to lift, look and pause.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Good gift','A small, useful gift with a clearer job than a generic baby book.','If they already have books, choose one that stands or lies open for floor play.','Crinkle floor book','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_need_early_play','I’m starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.','for_your_child','cat_kick_and_look_play_gym','A kick-and-look play gym','Kick And Look Play Gym',1,'A simple play gym can make back-lying awake time more useful: your baby can kick, stretch, look up and notice one or two hanging shapes. Keep it low-key and remove anything that makes the space feel too busy.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A classic baby gift that becomes more useful as the baby starts kicking and looking.','Common ownership risk is medium, so check whether they already have one.','Simple play gym','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_need_early_play','I’m starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.','for_your_child','cat_washable_floor_play_mat','A washable floor-play mat','Washable Floor Play Mat',2,'A washable floor mat gives wriggles, kicks and short supervised play a simple home base. It is not about padding the room with gear; it is about making a low, clean space easy to use several times a day.','for_your_child','product_category','things_that_can_help','Things that can help',2,true,true,true,'Good gift','A practical gift if the family needs a cleaner, easier floor space.','If they already have a good mat, skip this and choose a smaller toy for the mat instead.','Washable floor-play mat','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_need_early_play','I’m starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. A clear low space gives them room to practise little body movements, while you stay close and keep raised surfaces out of the equation.','for_your_child','cat_soft_hanging_toys','Soft hanging toys for the mat','Soft Hanging Toys',3,'Soft hanging toys can refresh a mat or play gym without buying a whole new setup. At this age, one or two simple shapes are enough for watching, kicking towards and, near the upper edge, early swiping.','for_your_child','product_category','things_that_can_help','Things that can help',3,true,true,true,'Good gift','A smart add-on gift if the family already has a mat or gym.','Useful when they already have the base setup but need one fresh reason to use it.','Soft hanging toys','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_need_early_play','My hands are waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers and moving towards their mouth. Light, large and washable objects can make those first hand discoveries easier to support without expecting a neat grab.','for_your_child','cat_twist_stroke_tactile_toy','A toy to twist, stroke and poke','Twist Stroke Tactile Toy',6,'A tactile toy with safe textures, soft parts or simple moving pieces gives opening hands something more interesting than a standard rattle. The captured parent source uses twist, turn, stroke and poke language, which fits this late-edge hand-discovery moment.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Good gift','A fresher hand-play gift than another basic rattle.','Best near the upper edge of the band, when hands are opening and swipes are starting.','Tactile twist-and-touch toy','both','See Ember Picks','product_actions'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_need_early_play','My hands are waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers and moving towards their mouth. Light, large and washable objects can make those first hand discoveries easier to support without expecting a neat grab.','for_your_child','cat_teething_cloth','A teething cloth or chew-safe fabric','Teething Cloth',7,'Near the upper edge of this band, some babies start bringing hands and safe objects towards their mouth. A washable teething cloth or chew-safe fabric can be a useful small gift, but it should be large, clean and age-fit.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Good gift','A small upper-edge gift if the baby is already mouthing more.','Choose this only if the baby is at the upper edge of the band or already mouthing more.','Teething cloth or chew-safe fabric','both','See Ember Picks','product_actions');

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
SELECT DISTINCT ON (s.age_band_id, uw.id, dn.id, ct.id)
  s.age_band_id,
  uw.id AS ux_wrapper_id,
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
  uw.id,
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
      AND r.ux_wrapper_id IS NOT DISTINCT FROM m.ux_wrapper_id
  );

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id,
  ux_wrapper_id,
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
  r.ux_wrapper_id,
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
ON CONFLICT (age_band_id, development_need_id, category_type_id, ux_wrapper_id) DO UPDATE
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
  v_rows_1_3m INTEGER;
  v_clusters_1_3m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_1_3m FROM tmp_discover_projection_stage WHERE age_band_id = '1-3m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_1_3m
  FROM tmp_discover_projection_stage WHERE age_band_id = '1-3m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('1-3m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 55)', v_rows_loaded;
  RAISE NOTICE '1-3m rows: % (expected 55), clusters: % (expected 10)', v_rows_1_3m, v_clusters_1_3m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 55 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_1_3m <> 55 THEN
    RAISE EXCEPTION 'Row count validation failed for 1-3m';
  END IF;
  IF v_clusters_1_3m <> 10 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 1-3m';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('1-3m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('1-3m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('1-3m');
