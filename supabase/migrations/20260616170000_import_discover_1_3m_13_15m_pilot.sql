-- Discover pilot import: age bands 1–3 months, 13–15 months
-- Source: discover_projection tab from Ember ABI workbooks (1-3m + 13-15m)
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
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','Talk to me',1,true,'ent_cluster_faces_smiles_chats','Faces, smiles and little chats','Your baby may be watching your face, softening when you speak and starting to answer with little coos or smiles. These tiny back-and-forth moments build connection, attention and early communication without turning play into a lesson.','for_your_child','cat_face_to_face_play','Face-to-face talking and smiling','Face-to-face talking and smiling',1,'Your baby may be watching your face closely and beginning to answer with little sounds or smiles. Talking, smiling, pausing and copying expressions gives them a simple back-and-forth moment that supports bonding and early communication.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','Talk to me',1,true,'ent_cluster_faces_smiles_chats','Faces, smiles and little chats','Your baby may be watching your face, softening when you speak and starting to answer with little coos or smiles. These tiny back-and-forth moments build connection, attention and early communication without turning play into a lesson.','for_your_child','cat_high_contrast_cards','High-contrast cards and simple patterns','High-contrast cards and simple patterns',2,'At this age, a simple pattern, face or bold shape can be enough. High-contrast cards or pages give your baby something easy to look at during short awake windows, while you slowly move, pause and talk alongside them.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','Talk to me',1,true,'ent_cluster_faces_smiles_chats','Faces, smiles and little chats','Your baby may be watching your face, softening when you speak and starting to answer with little coos or smiles. These tiny back-and-forth moments build connection, attention and early communication without turning play into a lesson.','for_your_child','cat_board_books','Board books and face books','Board books and face books',3,'Reading at this stage is less about the story and more about your voice, rhythm and closeness. A chunky board book, wooden book or face book gives your baby something to look at while you name, pause and repeat.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','Talk to me',1,true,'ent_cluster_faces_smiles_chats','Faces, smiles and little chats','Your baby may be watching your face, softening when you speak and starting to answer with little coos or smiles. These tiny back-and-forth moments build connection, attention and early communication without turning play into a lesson.','for_your_child','cat_songs_action_games','Songs, rhymes and tiny games','Songs, rhymes and tiny games',4,'A short song, silly face or gentle peekaboo gives your baby sound, rhythm and expression to tune into. The pauses matter too, because they invite your baby to look, wriggle, coo or smile back in their own tiny way.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','Talk to me',1,true,'ent_cluster_faces_smiles_chats','Faces, smiles and little chats','Your baby may be watching your face, softening when you speak and starting to answer with little coos or smiles. These tiny back-and-forth moments build connection, attention and early communication without turning play into a lesson.','for_your_child','cat_baby_safe_mirror','A baby-safe mirror for faces','A baby-safe mirror for faces',5,'A baby-safe mirror can make a few minutes of awake play feel more interesting. Your baby will not understand the reflection yet, but faces, movement and your voice nearby can help hold their attention during floor or tummy-time moments.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','Lift my head',2,true,'ent_cluster_tummy_head_control','Tummy time and wobbly head control','Short, supervised tummy-time moments help your baby practise lifting, turning and settling into their body. Some babies only manage a minute or two at first, which is still useful. The aim is calm practice, not a performance.','for_your_child','cat_tummy_time_mat','A simple tummy-time mat','A simple tummy-time mat',1,'Tummy time can be tiny at first. A clean, firm floor mat gives your baby a safe awake place to practise lifting, turning and resting, while giving you one clear spot to return to without overcomplicating it.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','Lift my head',2,true,'ent_cluster_tummy_head_control','Tummy time and wobbly head control','Short, supervised tummy-time moments help your baby practise lifting, turning and settling into their body. Some babies only manage a minute or two at first, which is still useful. The aim is calm practice, not a performance.','for_your_child','cat_tummy_time_wobbler','Tummy-time mirror or wobbler','Tummy-time mirror or wobbler',2,'Some babies protest tummy time quickly. A small mirror, wobbly toy or crinkle object placed nearby can give them a reason to lift, look or turn for a moment, while you keep the session short and close.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','Lift my head',2,true,'ent_cluster_tummy_head_control','Tummy time and wobbly head control','Short, supervised tummy-time moments help your baby practise lifting, turning and settling into their body. Some babies only manage a minute or two at first, which is still useful. The aim is calm practice, not a performance.','for_your_child','cat_safe_floor_space','A clear low floor space','A clear low floor space',3,'The safest place for early movement practice is low and close to you. A clear patch of floor helps you avoid raised-surface risks as your baby gets stronger, wrigglier and more surprising in how quickly they can shift position.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','Lift my head',2,true,'ent_cluster_tummy_head_control','Tummy time and wobbly head control','Short, supervised tummy-time moments help your baby practise lifting, turning and settling into their body. Some babies only manage a minute or two at first, which is still useful. The aim is calm practice, not a performance.','for_your_child','cat_rolled_towel_tummy_support','Rolled-towel tummy support','Rolled-towel tummy support',4,'A small rolled towel under your baby’s arms can sometimes make tummy time feel more manageable. It is not a must-have product, just a supervised setup trick for moments when your baby needs a little support to lift and look.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','Lift my head',2,true,'ent_cluster_tummy_head_control','Tummy time and wobbly head control','Short, supervised tummy-time moments help your baby practise lifting, turning and settling into their body. Some babies only manage a minute or two at first, which is still useful. The aim is calm practice, not a performance.','for_your_child','cat_tummy_time_books','A soft tummy-time book','A soft tummy-time book',5,'A soft fold-out or crinkle book can sit in front of your baby during supervised floor play. It gives them something to look towards, hear and touch, while you talk through what they are noticing.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','Catch my eye',3,true,'ent_cluster_watching_tracking','Watching, tracking and turning','Your baby may be staring at faces, following movement and noticing simple sounds. A few calm objects to watch, hear and track can turn awake time into gentle discovery, especially when you move slowly and let your baby lead.','for_your_child','cat_tracking_rattle','A slow-moving rattle to track','A slow-moving rattle to track',1,'A gentle rattle gives your baby one sound and movement to follow. Move it slowly, pause often and watch whether they turn, look or settle on it for a few seconds. That tiny focus is the point.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','Catch my eye',3,true,'ent_cluster_watching_tracking','Watching, tracking and turning','Your baby may be staring at faces, following movement and noticing simple sounds. A few calm objects to watch, hear and track can turn awake time into gentle discovery, especially when you move slowly and let your baby lead.','for_your_child','cat_sound_cylinders_shakers','Gentle shakers and sound toys','Gentle shakers and sound toys',2,'A soft shaker or gentle sound toy can help your baby notice where sound comes from. Keep it calm and close, because the value is not noise, it is the little turn, pause or widening eyes that shows they are tuning in.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','Catch my eye',3,true,'ent_cluster_watching_tracking','Watching, tracking and turning','Your baby may be staring at faces, following movement and noticing simple sounds. A few calm objects to watch, hear and track can turn awake time into gentle discovery, especially when you move slowly and let your baby lead.','for_your_child','cat_play_gym_hanging_toys','A simple play gym or hanging toys','A simple play gym or hanging toys',3,'A simple play gym can support short back-lying awake moments: looking up, kicking, swiping and beginning to notice what happens when their body moves. Keep it low-pressure and avoid leaving toys where baby sleeps.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','Catch my eye',3,true,'ent_cluster_watching_tracking','Watching, tracking and turning','Your baby may be staring at faces, following movement and noticing simple sounds. A few calm objects to watch, hear and track can turn awake time into gentle discovery, especially when you move slowly and let your baby lead.','for_your_child','cat_contrast_mobile_supervised','A supervised mobile or moving object','A supervised mobile or moving object',4,'A slow moving object can give your baby a calm looking game. The key is supervision and simplicity: move slowly, pause, and keep anything loose or dangling away from the cot once your baby is sleeping.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','Open my hands',4,true,'ent_cluster_first_grasps','Opening hands and first grasps','Around this stage, babies begin moving from curled newborn fists towards open hands, swipes and accidental grasps. Soft, clean, easy-to-hold objects let them notice their hands and begin linking what they see, feel and hear.','for_your_child','cat_reach_grab_toys','Reach-and-grab toys','Reach-and-grab toys',1,'Your baby’s hands may be opening more, with swipes and accidental touches starting to appear. A simple reach-and-grab toy lets them practise looking, moving an arm and feeling a response, even before grasping is reliable.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','Open my hands',4,true,'ent_cluster_first_grasps','Opening hands and first grasps','Around this stage, babies begin moving from curled newborn fists towards open hands, swipes and accidental grasps. Soft, clean, easy-to-hold objects let them notice their hands and begin linking what they see, feel and hear.','for_your_child','cat_soft_rattle_ring','A soft rattle or grasp ring','A soft rattle or grasp ring',2,'A soft rattle or grasp ring can make an accidental hand movement feel interesting. The sound or texture gives instant feedback, helping your baby begin to connect their hand, the object and what happens next.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','Open my hands',4,true,'ent_cluster_first_grasps','Opening hands and first grasps','Around this stage, babies begin moving from curled newborn fists towards open hands, swipes and accidental grasps. Soft, clean, easy-to-hold objects let them notice their hands and begin linking what they see, feel and hear.','for_your_child','cat_texture_cards_books','Soft textures to stroke and touch','Soft textures to stroke and touch',3,'Soft cloth, crinkle pages or simple texture cards give your baby something gentle to brush, scrunch or accidentally grab. At this stage, the value is in noticing touch and sound, not doing anything neatly.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','Open my hands',4,true,'ent_cluster_first_grasps','Opening hands and first grasps','Around this stage, babies begin moving from curled newborn fists towards open hands, swipes and accidental grasps. Soft, clean, easy-to-hold objects let them notice their hands and begin linking what they see, feel and hear.','for_your_child','cat_cleanable_sensory_toys','Easy-clean sensory toys','Easy-clean sensory toys',4,'As hands and mouths become busier, easy-clean toys make repeated play less stressful. Choose simple textures, secure parts and materials you can wipe or wash, because hygiene starts to matter more as everything heads towards the mouth.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','Open my hands',4,true,'ent_cluster_first_grasps','Opening hands and first grasps','Around this stage, babies begin moving from curled newborn fists towards open hands, swipes and accidental grasps. Soft, clean, easy-to-hold objects let them notice their hands and begin linking what they see, feel and hear.','for_your_child','cat_teethers','Chew-safe toys and early teethers','Chew-safe toys and early teethers',5,'Some babies start bringing hands and safe objects towards their mouth near the top of this band. A clean, age-suitable teether or chew-safe toy can give that exploring a safer outlet, but it is an edge-of-stage idea rather than a must-have for every baby.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle',5,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Crying and fussing can be intense in this band, especially around the 6- to 8-week peak. Calm routines, movement, cuddles and support tools are not magic fixes, but they can give you a few safer ways to respond and recover.','for_both','cat_white_noise_soother','Gentle white noise or sound reset','Gentle white noise or sound reset',1,'White noise is not a cure for crying, but a gentle background sound can sometimes help with a reset when your baby is tired, windy or overstimulated. Keep it low, distant and part of a calm response, not a constant soundtrack.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle',5,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Crying and fussing can be intense in this band, especially around the 6- to 8-week peak. Calm routines, movement, cuddles and support tools are not magic fixes, but they can give you a few safer ways to respond and recover.','for_both','cat_pram_walk_reset','A pram walk reset','A pram walk reset',2,'A short pram walk can reset a difficult stretch of the day. Your baby gets movement, light and a new soundscape, while you get a small change of scene. It is useful because it is simple, not because it solves everything.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle',5,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Crying and fussing can be intense in this band, especially around the 6- to 8-week peak. Calm routines, movement, cuddles and support tools are not magic fixes, but they can give you a few safer ways to respond and recover.','for_both','cat_soft_carrier_sling','A safe sling or carrier cuddle','A safe sling or carrier cuddle',3,'Some unsettled babies calm when they are close to your body and voice. A safe, correctly fitted sling or carrier can help with cuddly resets and short household moments, as long as airway, position and temperature are carefully checked.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle',5,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Crying and fussing can be intense in this band, especially around the 6- to 8-week peak. Calm routines, movement, cuddles and support tools are not magic fixes, but they can give you a few safer ways to respond and recover.','for_both','cat_settling_routine_notes','A simple settling notes routine','A simple settling notes routine',4,'When days blur together, a few notes on feeds, sleep, crying or what helped can make you feel less lost. The aim is not to force a routine, but to notice patterns and have something clear to share if you ask for support.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Feed me calmly',6,true,'ent_cluster_feeding_clean_kit','Feeding rhythm and clean kit','Feeding can feel constant in the early weeks, and every household finds its rhythm differently. Simple cue-reading, clean feeding kit and a few comfort supplies can make the repeated cycle of feed, wind, wipe and reset feel more manageable.','for_you','cat_responsive_feeding_support','Responsive feeding cues','Responsive feeding cues',1,'Early feeds can feel constant. Watching for cues like restlessness, rooting, murmuring or sucking hands can make feeding feel a little calmer because you are responding before your baby is fully upset.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Feed me calmly',6,true,'ent_cluster_feeding_clean_kit','Feeding rhythm and clean kit','Feeding can feel constant in the early weeks, and every household finds its rhythm differently. Simple cue-reading, clean feeding kit and a few comfort supplies can make the repeated cycle of feed, wind, wipe and reset feel more manageable.','for_you','cat_burp_cloths_muslins','Muslins and burp cloths','Muslins and burp cloths',2,'Tiny babies produce a surprising amount of milk dribble, spit-up and nappy-change mess. Muslins and burp cloths are not developmental toys, but they make the repeated feed, wind, wipe and reset loop easier to manage.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Feed me calmly',6,true,'ent_cluster_feeding_clean_kit','Feeding rhythm and clean kit','Feeding can feel constant in the early weeks, and every household finds its rhythm differently. Simple cue-reading, clean feeding kit and a few comfort supplies can make the repeated cycle of feed, wind, wipe and reset feel more manageable.','for_you','cat_bottle_sterilising_kit','Bottle sterilising kit','Bottle sterilising kit',3,'If bottles are part of your routine, clean kit matters every day. Sterilising bottles, teats and feeding equipment reduces infection risk while your baby’s immune system is still developing, and keeps late-night feeds less chaotic.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Feed me calmly',6,true,'ent_cluster_feeding_clean_kit','Feeding rhythm and clean kit','Feeding can feel constant in the early weeks, and every household finds its rhythm differently. Simple cue-reading, clean feeding kit and a few comfort supplies can make the repeated cycle of feed, wind, wipe and reset feel more manageable.','for_you','cat_breastfeeding_comfort_supplies','Breastfeeding comfort supplies','Breastfeeding comfort supplies',4,'A few practical supplies, such as breast pads, a water bottle, comfortable setup or support contact, can make frequent feeds feel less punishing. The important part is not buying more, it is making support and comfort easier to reach.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Feed me calmly',6,true,'ent_cluster_feeding_clean_kit','Feeding rhythm and clean kit','Feeding can feel constant in the early weeks, and every household finds its rhythm differently. Simple cue-reading, clean feeding kit and a few comfort supplies can make the repeated cycle of feed, wind, wipe and reset feel more manageable.','for_you','cat_milk_storage_and_labels','Milk storage and labels','Milk storage and labels',5,'If expressing is part of your routine, simple storage bags or containers and clear labels can reduce confusion. This is mainly a practical parent tool, helping you track dates and use milk safely without relying on memory during tired weeks.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Sleep safely',7,true,'ent_cluster_safe_sleep_setup','Safer sleep setup','At this age, sleep safety matters more than sleep gadgets. A clear cot or Moses basket, a firm flat mattress, the right temperature and simple bedding choices help parents avoid tempting products that look helpful but can make sleep less safe.','for_you','cat_safe_sleep_continuity','Safe sleep check-in','Safe sleep check-in',1,'A safe sleep check is one of the highest-value parent jobs in this band. Back sleeping, a clear cot or Moses basket, same-room sleep and no loose extras matter more than any gadget promising better sleep.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Sleep safely',7,true,'ent_cluster_safe_sleep_setup','Safer sleep setup','At this age, sleep safety matters more than sleep gadgets. A clear cot or Moses basket, a firm flat mattress, the right temperature and simple bedding choices help parents avoid tempting products that look helpful but can make sleep less safe.','for_you','cat_firm_flat_mattress','A firm, flat, waterproof mattress','A firm, flat, waterproof mattress',2,'A firm, flat, waterproof mattress is a quiet safety essential. It helps keep the sleep surface clear and appropriate, and the NHS advises buying new if possible or only reusing from your own clean, dry, smoke-free home.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Sleep safely',7,true,'ent_cluster_safe_sleep_setup','Safer sleep setup','At this age, sleep safety matters more than sleep gadgets. A clear cot or Moses basket, a firm flat mattress, the right temperature and simple bedding choices help parents avoid tempting products that look helpful but can make sleep less safe.','for_you','cat_room_thermometer','Room thermometer','Room thermometer',3,'A room thermometer helps you check whether the room is in the safer sleep temperature range, rather than guessing by how you feel. It pairs with clothing and sleeping-bag choices, especially as seasons change.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Sleep safely',7,true,'ent_cluster_safe_sleep_setup','Safer sleep setup','At this age, sleep safety matters more than sleep gadgets. A clear cot or Moses basket, a firm flat mattress, the right temperature and simple bedding choices help parents avoid tempting products that look helpful but can make sleep less safe.','for_you','cat_baby_sleeping_bag','A well-fitting baby sleeping bag','A well-fitting baby sleeping bag',4,'A baby sleeping bag can help keep bedding simple, but fit and tog matter. The shoulders should fit well so baby cannot slip down inside, and the warmth should match the room temperature.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Sleep safely',7,true,'ent_cluster_safe_sleep_setup','Safer sleep setup','At this age, sleep safety matters more than sleep gadgets. A clear cot or Moses basket, a firm flat mattress, the right temperature and simple bedding choices help parents avoid tempting products that look helpful but can make sleep less safe.','for_you','cat_clear_cot_check','Clear cot checks','Clear cot checks',5,'A clear cot check is a small habit with big safety value. It helps you spot pillows, bumpers, soft toys, pods, nests, wedges or bulky bedding that can look helpful in a shop but should not be in baby’s sleep space.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep us ready',8,true,'ent_cluster_health_first_trips','Health check-ins and first trips','The first few months bring appointments, nappy changes, first jabs and car-seat routines, often while everyone is still tired. A small amount of prep can make everyday care and short trips feel calmer, without overloading the house with kit.','for_you','cat_red_book_vaccine_planning','Red Book and vaccine planning','Red Book and vaccine planning',1,'The 6-week check and first vaccinations can arrive quickly while you are still in newborn fog. Keeping the Red Book, appointments and questions together helps you feel prepared, and gives you a useful record of growth, checks and immunisations.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep us ready',8,true,'ent_cluster_health_first_trips','Health check-ins and first trips','The first few months bring appointments, nappy changes, first jabs and car-seat routines, often while everyone is still tired. A small amount of prep can make everyday care and short trips feel calmer, without overloading the house with kit.','for_you','cat_rear_facing_car_seat','Rear-facing infant car seat','Rear-facing infant car seat',2,'A suitable rear-facing infant car seat is one of the clearest safety-critical purchases. UK rules require height-based seats to stay rear-facing until your child is over 15 months, so fit, approval and history matter from the start.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep us ready',8,true,'ent_cluster_health_first_trips','Health check-ins and first trips','The first few months bring appointments, nappy changes, first jabs and car-seat routines, often while everyone is still tired. A small amount of prep can make everyday care and short trips feel calmer, without overloading the house with kit.','for_you','cat_nappy_change_station','Nappy change station','Nappy change station',3,'A simple change station means the mat, wipes or cotton wool, clean nappy, bag, drying cloth and barrier cream are within reach before you start. That matters when changes are frequent and baby is getting wrigglier.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep us ready',8,true,'ent_cluster_health_first_trips','Health check-ins and first trips','The first few months bring appointments, nappy changes, first jabs and car-seat routines, often while everyone is still tired. A small amount of prep can make everyday care and short trips feel calmer, without overloading the house with kit.','for_you','cat_small_object_sweep','Small-object safety sweep','Small-object safety sweep',4,'Your baby may not be crawling yet, but hands and mouths become busier fast. A simple sweep for tiny loose parts, cords, old toy pieces and unsafe older-sibling items keeps the floor-play area ready before movement suddenly jumps forward.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep us ready',8,true,'ent_cluster_health_first_trips','Health check-ins and first trips','The first few months bring appointments, nappy changes, first jabs and car-seat routines, often while everyone is still tired. A small amount of prep can make everyday care and short trips feel calmer, without overloading the house with kit.','for_you','cat_button_battery_check','Button battery checks','Button battery checks',5,'Button batteries are not a play category, but they matter in homes full of gadgets, musical toys and older-sibling items. A quick check for secure compartments and loose batteries helps keep the play area safer as reaching and mouthing increase.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_both','cat_safe_floor_space','A clear floor space','A clear floor space',1,'Your toddler may suddenly cross the room, crawl faster or pull up where you did not expect it. A clear patch of floor gives them space to move, fall softly, recover and try again, while you reduce obvious trip hazards and sharp edges nearby.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_both','cat_13_15_cruising_furniture','Steady cruising surfaces','Steady cruising surfaces',2,'Low, stable surfaces give a new mover something to lean on, cruise along and practise balance. The aim is not to force walking, but to make everyday standing safer and easier to supervise, especially as they start using furniture to explore.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_both','cat_13_15_push_pull_toys','Sturdy push-and-pull toys','Sturdy push-and-pull toys',3,'A stable push toy or pull-along can give your toddler a reason to move, stop, turn and try again. It is best treated as playful practice for children already showing readiness, not as a shortcut to walking or a seated walker substitute.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_both','cat_soft_graspable_balls','Soft balls to roll and chase','Soft balls to roll and chase',4,'A soft ball gives your toddler a clear reason to move: roll it away, crawl after it, bring it back or copy your throw. The game can stretch balance, coordination and shared attention while staying simple, cheap and easy to repeat indoors or outside.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_both','cat_13_15_park_swing_walks','Park walks and toddler swings','Park walks and toddler swings',5,'A short walk or closely supervised swing can reset both of you. Your toddler gets movement, changing sights and things to point at, while you get easy naming moments: dog, bus, tree, swing. It is useful because it combines movement, language and a change of scene.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_stacking_nesting_cups','Stacking and nesting cups','Stacking and nesting cups',1,'Cups can be stacked, nested, filled, tipped, posted into, hidden under and used in the bath. That flexibility makes them especially strong at this stage, when toddlers enjoy repeating the same little experiment and watching what changes each time.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_13_15_posting_coin_box','Posting boxes and coin slots','Posting boxes and coin slots',2,'Posting a chunky coin or shape into a slot gives your toddler a clear challenge: hold, aim, release, then try again. It builds finger control and persistence, and the satisfying drop can make the practice feel like play rather than a task.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_object_permanence_box','Hide-and-find boxes','Hide-and-find boxes',3,'When a ball or toy vanishes into a box and comes back, your toddler gets a tiny mystery to solve. These hide-and-find moments support attention, memory and cause-and-effect, especially when you keep the game slow enough for them to watch and join in.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_13_15_shape_peg_puzzles','Chunky shape and peg puzzles','Chunky shape and peg puzzles',4,'A chunky puzzle does not need to be completed perfectly to be valuable. Picking up a piece, turning it, testing where it fits and trying again gives your toddler useful practice with focus, hand control and early spatial thinking.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_13_15_tower_blocks','First tower blocks','First tower blocks',5,'Stacking two blocks, knocking them down and starting again is a neat little experiment. Your toddler practises hand control, cause-and-effect and anticipation, while also learning that repeating the same action can produce a predictable result.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_board_books','Board books and face books','Board books and face books',1,'A sturdy board book gives your toddler something to hold, turn, point at and hear named again and again. If they grab the book or chew the corner, the moment can still count: short, repeatable pages are often more realistic than a perfect storytime.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_13_15_picture_word_cards','Picture and word cards','Picture and word cards',2,'Simple picture cards, family photos or object cards can make naming feel concrete. Your toddler can point, look back at you, hand one over or wait for the word, giving you an easy way to turn everyday vocabulary into a shared moment.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_songs_action_games','Songs and action games','Songs and action games',3,'Action songs give your toddler a predictable pattern: listen, watch, clap, wave, pause and try a sound. Wheels on the Bus, pat-a-cake or a clean-up song can turn communication into a back-and-forth game without needing any new kit.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_13_15_gesture_sign_games','First gestures and simple signs','First gestures and simple signs',4,'Pointing, waving, arms up, more and all gone can reduce guesswork when words are still emerging. Repeating gestures during real routines helps your toddler see that their signals make something happen, which can build confidence and connection.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_13_15_pretend_phone_talk','Pretend phone and object talk','Pretend phone and object talk',5,'A toy phone, cup, brush or spoon can become a little language prompt when your toddler copies what you do. Naming the object, acting it out and waiting for their sound or gesture builds understanding, imitation and a playful reason to communicate.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_safe_household_objects','Safe everyday-object play','Safe everyday-object play',1,'A clean tub, wooden spoon, shoe, soft cloth or empty box can be just as interesting as a toy when it is safe and supervised. Everyday objects help your toddler practise choosing, copying, carrying and using things with purpose, while keeping play grounded in real life.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_doll_soft_toy_care','Dolls and soft-toy care','Dolls and soft-toy care',2,'A soft toy or doll can become part of simple care play: hugging, patting, feeding, putting to bed or handing over. These are small social moments, but they help your toddler copy familiar routines and practise early affection and empathy.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_toy_cups_spoons','Toy cups, spoons and plates','Toy cups, spoons and plates',3,'Pretending to drink from a cup or feed a soft toy is simple, but it links real routines with play. Your toddler can copy you, practise object use and turn familiar mealtime objects into early pretend moments, without needing a full play kitchen.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_cleanup_basket','Clean-up basket games','Clean-up basket games',4,'Putting socks in a basket or toys into a box can become a little game. It gives your toddler a useful job, a clear target and a satisfying finish, while also turning cleanup into language, cooperation and movement practice.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_pretend_shoes_brushes','Shoes, brushes and getting-ready play','Shoes, brushes and getting-ready play',5,'Shoes, hats and brushes are everyday objects with obvious meaning. Your toddler may fetch a shoe, hold out a foot or copy brushing, turning the getting-ready rush into a short naming and imitation opportunity when you have the patience for it.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_both','cat_highchair','A supportive highchair','A supportive highchair',1,'At 13-15 months, meals can be busy, messy and hands-on. A stable highchair or feeding seat keeps your toddler upright while they practise finger foods, cup use and spoon attempts, giving you a safer, calmer place to supervise and clean up.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_both','cat_open_cup','An open or free-flow cup','An open or free-flow cup',2,'A small cup with a little water or milk gives your toddler a real skill to practise. There will be spills, chewing and tipping, but holding, lifting and trying again helps coordination and independence during normal meals.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_both','cat_first_spoons_bowls','Toddler spoons and bowls','Toddler spoons and bowls',3,'Trying a spoon can be slow, messy and very imperfect, but it gives your toddler a way to join in. Small spoons, stable bowls and relaxed expectations make self-feeding easier to practise without turning every mouthful into a power struggle.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_both','cat_weaning_bibs_mat','Bibs and splash mats','Bibs and splash mats',4,'A bib or floor mat will not teach eating, but it can make practice feel less stressful. When cleanup is easier, parents are more likely to let toddlers touch, grip, spill, scoop and try again, which is exactly how self-feeding improves.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_both','cat_13_15_snack_prep_pots','Snack pots and safe food prep','Snack pots and safe food prep',5,'Toddlers may need two healthy snacks as well as meals. Small snack pots, simple prep and safe shapes can help days out, nursery handovers and hungry moments feel easier, while still keeping salt, sugar and choking risks in view.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',6,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_both','cat_13_15_bedtime_board_books','Bedtime board books','Bedtime board books',1,'A short bedtime book can give your toddler a repeated cue: pyjamas, teeth, book, cuddle, sleep. The story matters less than the rhythm. Familiar pages help language, comfort and routine without needing a long, perfect read every night.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',6,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_both','cat_13_15_toothbrush_toothpaste','Toddler toothbrush and toothpaste','Toddler toothbrush and toothpaste',2,'A small toothbrush and age-appropriate fluoride toothpaste support a routine that starts before toddlers can do it themselves. The parent still brushes, but songs, mirrors or a familiar order can make the twice-daily habit less of a battle.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',6,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_both','cat_13_15_comfort_toy','A safe comfort object','A safe comfort object',3,'A favourite soft toy or comforter can help some toddlers reconnect during separation, travel or bedtime. It can also become part of simple care play, giving your child a familiar thing to hug, find and include in routines.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',6,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_both','cat_feelings_faces_books','Baby faces and feelings books','Baby faces and feelings books',4,'A faces or feelings book gives you a gentle way to name happy, sad, cross or tired when the moment is calm. Your toddler will not manage feelings neatly yet, but repeated words and expressions can help them begin to connect faces, sounds and comfort.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',6,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_both','cat_13_15_routine_songs','Routine songs and transition cues','Routine songs and transition cues',5,'A clean-up song, toothbrushing song or goodbye wave can soften the small transitions that often trigger frustration. The repetition helps your toddler know what comes next, while giving you a low-effort way to guide behaviour without lengthy explanations.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','I’m suddenly into everything',7,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_safety_gates','Safety gates','Safety gates',1,'Stairs can become fascinating as soon as crawling, cruising or climbing feels possible. Safety gates help keep the biggest risk areas contained, giving your toddler safer places to practise movement while you stay close and supervise.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','I’m suddenly into everything',7,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_cupboard_locks','Cupboard locks','Cupboard locks',2,'Opening cupboards can become a favourite experiment. Locks and safer storage keep medicines, chemicals and cleaning products out of reach, so your toddler can keep exploring lower-risk objects while the dangerous things stay unavailable.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','I’m suddenly into everything',7,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_13_15_furniture_anchors','Furniture anchors and corner checks','Furniture anchors and corner checks',3,'Pulling up often happens on whatever is closest: shelves, drawers, side tables or the sofa. Anchoring unstable furniture and checking hard corners helps prepare the room for a child who is stronger, taller and far less predictable than last month.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','I’m suddenly into everything',7,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_button_battery_check','Button battery checks','Button battery checks',4,'Button batteries can look like tiny interesting objects, and toddlers are still likely to mouth what they find. A household sweep of remotes, thermometers, cards and toys helps remove one of the most serious hidden risks from everyday rooms.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','I’m suddenly into everything',7,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_13_15_car_seat_size_check','Car-seat size and direction check','Car-seat size and direction check',5,'Around this band, parents may wonder whether to turn a car seat forward. UK rules require height-based seats to stay rear-facing until over 15 months, and fit still depends on the child and seat limits. This is a check moment, not a hurry-up moment.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',8,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_both','cat_13_15_pram_walks','Pram walks and naming games','Pram walks and naming games',1,'A walk can become more than fresh air when you follow what your toddler notices. Naming the bus, dog, leaf or bin lorry turns ordinary movement into shared attention and language practice, with no extra setup and no pressure to entertain perfectly.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',8,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_both','cat_13_15_library_baby_group','Library mats and baby groups','Library mats and baby groups',2,'A library session or baby group gives your toddler new sounds, faces, songs and books to explore, while giving you a gentle reset. The value is not a packed schedule, just a fresh social and language moment outside the house.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',8,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_both','cat_13_15_bubbles','Bubbles','Bubbles',3,'Bubbles float, pop, disappear and come back, which makes them perfect for short attention spans. Your toddler can watch, point, reach, chase and laugh, while you add simple words like pop, more, high and gone.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',8,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_both','cat_13_15_bath_cups','Bath cups and pouring games','Bath cups and pouring games',4,'Pouring water between cups gives toddlers a clear full-empty experiment. They can scoop, tip, splash and watch what happens, while you keep the activity contained. It is simple and engaging, but water always needs close adult attention.','for_both'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',8,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_both','cat_treasure_basket','A rotating safe treasure basket','A rotating safe treasure basket',5,'A small basket of safe, ordinary objects can make the room feel new without buying more. Swapping a few items gives your toddler choices, textures and sounds to explore, while helping you avoid turning every restless afternoon into a shopping list.','for_both');

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
  v_rows_1_3m INTEGER;
  v_clusters_1_3m INTEGER;
  v_rows_13_15m INTEGER;
  v_clusters_13_15m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_1_3m FROM tmp_discover_projection_stage WHERE age_band_id = '1-3m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_1_3m
  FROM tmp_discover_projection_stage WHERE age_band_id = '1-3m';
  SELECT COUNT(*) INTO v_rows_13_15m FROM tmp_discover_projection_stage WHERE age_band_id = '13-15m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_13_15m
  FROM tmp_discover_projection_stage WHERE age_band_id = '13-15m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('1-3m', '13-15m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 78)', v_rows_loaded;
  RAISE NOTICE '1-3m rows: % (expected 38), clusters: % (expected 8)', v_rows_1_3m, v_clusters_1_3m;
  RAISE NOTICE '13-15m rows: % (expected 40), clusters: % (expected 8)', v_rows_13_15m, v_clusters_13_15m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 78 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_1_3m <> 38 THEN
    RAISE EXCEPTION 'Row count validation failed for 1-3m';
  END IF;
  IF v_rows_13_15m <> 40 THEN
    RAISE EXCEPTION 'Row count validation failed for 13-15m';
  END IF;
  IF v_clusters_1_3m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 1-3m';
  END IF;
  IF v_clusters_13_15m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 13-15m';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('1-3m', '13-15m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('1-3m', '13-15m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('1-3m', '13-15m');
