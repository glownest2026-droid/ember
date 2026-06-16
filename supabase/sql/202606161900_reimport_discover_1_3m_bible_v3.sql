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
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_cluster_faces_smiles_chats','Finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These little back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_face_to_face_play','Face-to-face talking and smiling','Face-to-face talking and smiling',1,'Your baby may be watching your face closely and beginning to answer with little sounds or smiles. Talking, smiling, pausing and copying expressions gives them a simple back-and-forth moment that supports bonding and early communication. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_cluster_faces_smiles_chats','Finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These little back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_copying_faces_expressions','Copying faces and little expressions','Copying faces and little expressions',2,'Your baby may begin copying tiny facial expressions, such as a tongue out or a wide-eyed look. Turning those moments into a gentle game helps them practise watching, waiting and responding, while keeping connection at the centre. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_faces_smiles_chats','I’m finding your face',1,true,'ent_cluster_faces_smiles_chats','Finding your face','Your baby may be watching your face, softening when you speak and trying tiny coos or smiles. These little back-and-forth moments make everyday cuddles, changes and floor play feel shared, while supporting connection, attention and early communication. Your voice, face and pauses are enough.','for_your_child','cat_baby_safe_mirror','A baby-safe mirror for faces','A baby-safe mirror for faces',3,'A baby-safe mirror can make a few minutes of awake play feel more interesting. Your baby will not understand the reflection yet, but faces, movement and your voice nearby can help hold their attention during floor or tummy-time moments. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_cluster_listen_and_coo','Listening to familiar voices','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this stage.','for_your_child','cat_familiar_voice_pauses','Familiar voices and little pauses','Familiar voices and little pauses',1,'Your baby may quieten, look or coo when they hear a familiar voice. A simple pattern of talk, pause, wait and answer gives them time to process sound and try their own tiny response, without needing a toy at all.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_cluster_listen_and_coo','Listening to familiar voices','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this stage.','for_your_child','cat_songs_action_games','Songs, rhymes and tiny games','Songs, rhymes and tiny games',2,'A short song, silly face or gentle peekaboo gives your baby sound, rhythm and expression to tune into. The pauses matter too, because they invite your baby to look, wriggle, coo or smile back in their own tiny way. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_cluster_listen_and_coo','Listening to familiar voices','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this stage.','for_your_child','cat_board_books','Board books and face books','Board books and face books',3,'Reading at this stage is less about the story and more about your voice, rhythm and closeness. A chunky board book, wooden book or face book gives your baby something to look at while you name, pause and repeat. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_listen_and_coo','I’m listening to your voice',2,true,'ent_cluster_listen_and_coo','Listening to familiar voices','Your baby may pause when they hear you, turn towards a sound, or answer with a tiny coo. Gentle songs, familiar voices and simple rhythm help them connect listening with comfort, attention and early conversation. Short, repeated moments are enough at this stage.','for_your_child','cat_sound_cylinders_shakers','Gentle shakers and sound toys','Gentle shakers and sound toys',4,'A soft shaker or gentle sound toy can help your baby notice where sound comes from. Keep it calm and close, because the value is not noise, it is the little turn, pause or widening eyes that shows they are tuning in.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','I’m watching the world',3,true,'ent_cluster_watching_tracking','Watching the world','Your baby may fix on a face, bold pattern or slow-moving object for a few seconds. Simple things to watch can help them practise focus, tracking and turning their head, without overstimulation. Keep it slow, close and easy to follow.','for_your_child','cat_high_contrast_cards','High-contrast cards and simple patterns','High-contrast cards and simple patterns',1,'At this age, a simple pattern, face or bold shape can be enough. High-contrast cards or pages give your baby something easy to look at during short awake windows, while you slowly move, pause and talk alongside them. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','I’m watching the world',3,true,'ent_cluster_watching_tracking','Watching the world','Your baby may fix on a face, bold pattern or slow-moving object for a few seconds. Simple things to watch can help them practise focus, tracking and turning their head, without overstimulation. Keep it slow, close and easy to follow.','for_your_child','cat_tracking_rattle','A slow-moving rattle to track','A slow-moving rattle to track',2,'A gentle rattle gives your baby one sound and movement to follow. Move it slowly, pause often and watch whether they turn, look or settle on it for a few seconds. That tiny focus is the point. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_watching_tracking','I’m watching the world',3,true,'ent_cluster_watching_tracking','Watching the world','Your baby may fix on a face, bold pattern or slow-moving object for a few seconds. Simple things to watch can help them practise focus, tracking and turning their head, without overstimulation. Keep it slow, close and easy to follow.','for_your_child','cat_contrast_mobile_supervised','A supervised mobile or moving object','A supervised mobile or moving object',3,'A slow moving object can give your baby a calm looking game. The key is supervision and simplicity: move slowly, pause, and keep anything loose or dangling away from the cot once your baby is sleeping. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_cluster_tummy_head_control','Getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That is still useful. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_tummy_time_mat','A simple tummy-time mat','A simple tummy-time mat',1,'Tummy time can be tiny at first. A clean, firm floor mat gives your baby a safe awake place to practise lifting, turning and resting, while giving you one clear spot to return to without overcomplicating it. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_cluster_tummy_head_control','Getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That is still useful. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_tummy_time_wobbler','Tummy-time mirror or wobbler','Tummy-time mirror or wobbler',2,'Some babies protest tummy time quickly. A small mirror, wobbly toy or crinkle object placed nearby can give them a reason to lift, look or turn for a moment, while you keep the session short and close. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_cluster_tummy_head_control','Getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That is still useful. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_rolled_towel_tummy_support','Rolled-towel tummy support','Rolled-towel tummy support',3,'A small rolled towel under your baby’s arms can sometimes make tummy time feel more manageable. It is not a must-have product, just a supervised setup trick for moments when your baby needs a little support to lift and look.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_tummy_head_control','I’m getting stronger on my tummy',4,true,'ent_cluster_tummy_head_control','Getting stronger on my tummy','Your baby may only manage a minute or two on their tummy at first. That is still useful. Short, supervised floor moments help them practise lifting, turning and settling into their body, while building the neck, shoulder and back strength that later supports rolling and reaching.','for_your_child','cat_tummy_time_books','A soft tummy-time book','A soft tummy-time book',4,'A soft fold-out or crinkle book can sit in front of your baby during supervised floor play. It gives them something to look towards, hear and touch, while you talk through what they are noticing. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_cluster_kicks_wriggles','Starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. Safe floor time gives those little movements room to happen. It helps them notice their body, practise early control and build confidence before bigger movement arrives.','for_your_child','cat_kicky_floor_play','Kicky floor time','Kicky floor time',1,'Your baby may be stretching and kicking more strongly by the week. A low, clear play space lets them move both arms and legs freely, while you stay close and notice the little body-control experiments starting to appear. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_cluster_kicks_wriggles','Starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. Safe floor time gives those little movements room to happen. It helps them notice their body, practise early control and build confidence before bigger movement arrives.','for_your_child','cat_play_gym_hanging_toys','A simple play gym or hanging toys','A simple play gym or hanging toys',2,'A simple play gym can support short back-lying awake moments: looking up, kicking, swiping and beginning to notice what happens when their body moves. Keep it low-pressure and avoid leaving toys where baby sleeps. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_cluster_kicks_wriggles','Starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. Safe floor time gives those little movements room to happen. It helps them notice their body, practise early control and build confidence before bigger movement arrives.','for_your_child','cat_safe_floor_space','A clear low floor space','A clear low floor space',3,'The safest place for early movement practice is low and close to you. A clear patch of floor helps you avoid raised-surface risks as your baby gets stronger, wrigglier and more surprising in how quickly they can shift position. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_kicks_wriggles','I’m starting to wriggle',5,true,'ent_cluster_kicks_wriggles','Starting to wriggle','Your baby may kick, stretch, arch or wriggle when they are awake and comfortable. Safe floor time gives those little movements room to happen. It helps them notice their body, practise early control and build confidence before bigger movement arrives.','for_your_child','cat_supported_side_lying_play','Side-lying pauses and turns','Side-lying pauses and turns',4,'Some babies start tipping or resting onto their side near this stage. Short, supervised side-lying pauses can help them feel a different body position, but the aim is gentle variety, not pushing rolling before they are ready. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_cluster_first_grasps','Hands waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers or holding a soft toy for a moment. These tiny discoveries help them connect sight, touch and movement. Simple graspable textures make hand play feel interesting without needing lots of stimulation.','for_your_child','cat_reach_grab_toys','Reach-and-grab toys','Reach-and-grab toys',1,'Your baby’s hands may be opening more, with swipes and accidental touches starting to appear. A simple reach-and-grab toy lets them practise looking, moving an arm and feeling a response, even before grasping is reliable. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_cluster_first_grasps','Hands waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers or holding a soft toy for a moment. These tiny discoveries help them connect sight, touch and movement. Simple graspable textures make hand play feel interesting without needing lots of stimulation.','for_your_child','cat_soft_rattle_ring','A soft rattle or grasp ring','A soft rattle or grasp ring',2,'A soft rattle or grasp ring can make an accidental hand movement feel interesting. The sound or texture gives instant feedback, helping your baby begin to connect their hand, the object and what happens next. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_cluster_first_grasps','Hands waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers or holding a soft toy for a moment. These tiny discoveries help them connect sight, touch and movement. Simple graspable textures make hand play feel interesting without needing lots of stimulation.','for_your_child','cat_texture_cards_books','Soft textures to stroke and touch','Soft textures to stroke and touch',3,'Soft cloth, crinkle pages or simple texture cards give your baby something gentle to brush, scrunch or accidentally grab. At this stage, the value is in noticing touch and sound, not doing anything neatly. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_cluster_first_grasps','Hands waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers or holding a soft toy for a moment. These tiny discoveries help them connect sight, touch and movement. Simple graspable textures make hand play feel interesting without needing lots of stimulation.','for_your_child','cat_cleanable_sensory_toys','Easy-clean sensory toys','Easy-clean sensory toys',4,'As hands and mouths become busier, easy-clean toys make repeated play less stressful. Choose simple textures, secure parts and materials you can wipe or wash, because hygiene starts to matter more as everything heads towards the mouth. Keep it short, gentle and led by what your baby seems ready for.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_first_grasps','My hands are waking up',6,true,'ent_cluster_first_grasps','Hands waking up','Your baby’s hands may be opening more often, brushing objects, watching fingers or holding a soft toy for a moment. These tiny discoveries help them connect sight, touch and movement. Simple graspable textures make hand play feel interesting without needing lots of stimulation.','for_your_child','cat_teethers','Chew-safe toys and early teethers','Chew-safe toys and early teethers',5,'Some babies start bringing hands and safe objects towards their mouth near the top of this band. A clean, age-suitable teether or chew-safe toy can give that exploring a safer outlet, but it is an edge-of-stage idea rather than a must-have for every baby.','for_your_child'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Some days, your baby may cry, fuss or need help switching off. Gentle resets, cuddles, short walks and simple notes can help you spot patterns without turning it into a test. The aim is a calmer rhythm for both of you, not perfect settling.','for_both','cat_white_noise_soother','Gentle white noise or sound reset','Gentle white noise or sound reset',1,'White noise is not a cure for crying, but a gentle background sound can sometimes help with a reset when your baby is tired, windy or overstimulated. Keep it low, distant and part of a calm response, not a constant soundtrack.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Some days, your baby may cry, fuss or need help switching off. Gentle resets, cuddles, short walks and simple notes can help you spot patterns without turning it into a test. The aim is a calmer rhythm for both of you, not perfect settling.','for_both','cat_pram_walk_reset','A pram walk reset','A pram walk reset',2,'A short pram walk can reset a difficult stretch of the day. Your baby gets movement, light and a new soundscape, while you get a small change of scene. It is useful because it is simple, not because it solves everything.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Some days, your baby may cry, fuss or need help switching off. Gentle resets, cuddles, short walks and simple notes can help you spot patterns without turning it into a test. The aim is a calmer rhythm for both of you, not perfect settling.','for_both','cat_soft_carrier_sling','A safe sling or carrier cuddle','A safe sling or carrier cuddle',3,'Some unsettled babies calm when they are close to your body and voice. A safe, correctly fitted sling or carrier can help with cuddly resets and short household moments, as long as airway, position and temperature are carefully checked. Keep the setup simple and follow trusted safety guidance.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_calm_crying_settling','Help me settle and reconnect',7,true,'ent_cluster_calm_crying_settling','Crying, comfort and little resets','Some days, your baby may cry, fuss or need help switching off. Gentle resets, cuddles, short walks and simple notes can help you spot patterns without turning it into a test. The aim is a calmer rhythm for both of you, not perfect settling.','for_both','cat_settling_routine_notes','A simple settling notes routine','A simple settling notes routine',4,'When days blur together, a few notes on feeds, sleep, crying or what helped can make you feel less lost. The aim is not to force a routine, but to notice patterns and have something clear to share if you ask for support.','for_both'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Keep feeds calm and clean',8,true,'ent_cluster_feeding_clean_kit','Calm feeds and clean kit','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breastfeeding comfort all happening at once. A small, calm setup helps you respond more easily and keep kit clean, whether you are feeding at home, overnight or out for a short trip.','for_you','cat_responsive_feeding_support','Responsive feeding cues','Responsive feeding cues',1,'Early feeds can feel constant. Watching for cues like restlessness, rooting, murmuring or sucking hands can make feeding feel a little calmer because you are responding before your baby is fully upset. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Keep feeds calm and clean',8,true,'ent_cluster_feeding_clean_kit','Calm feeds and clean kit','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breastfeeding comfort all happening at once. A small, calm setup helps you respond more easily and keep kit clean, whether you are feeding at home, overnight or out for a short trip.','for_you','cat_burp_cloths_muslins','Muslins and burp cloths','Muslins and burp cloths',2,'Tiny babies produce a surprising amount of milk dribble, spit-up and nappy-change mess. Muslins and burp cloths are not developmental toys, but they make the repeated feed, wind, wipe and reset loop easier to manage. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Keep feeds calm and clean',8,true,'ent_cluster_feeding_clean_kit','Calm feeds and clean kit','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breastfeeding comfort all happening at once. A small, calm setup helps you respond more easily and keep kit clean, whether you are feeding at home, overnight or out for a short trip.','for_you','cat_bottle_sterilising_kit','Bottle sterilising kit','Bottle sterilising kit',3,'If bottles are part of your routine, clean kit matters every day. Sterilising bottles, teats and feeding equipment reduces infection risk while your baby’s immune system is still developing, and keeps late-night feeds less chaotic. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Keep feeds calm and clean',8,true,'ent_cluster_feeding_clean_kit','Calm feeds and clean kit','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breastfeeding comfort all happening at once. A small, calm setup helps you respond more easily and keep kit clean, whether you are feeding at home, overnight or out for a short trip.','for_you','cat_breastfeeding_comfort_supplies','Breastfeeding comfort supplies','Breastfeeding comfort supplies',4,'A few practical supplies, such as breast pads, a water bottle, comfortable setup or support contact, can make frequent feeds feel less punishing. The important part is not buying more, it is making support and comfort easier to reach. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_feeding_clean_kit','Keep feeds calm and clean',8,true,'ent_cluster_feeding_clean_kit','Calm feeds and clean kit','Feeds can feel constant at this age, with cues, winding, leaking, bottles or breastfeeding comfort all happening at once. A small, calm setup helps you respond more easily and keep kit clean, whether you are feeding at home, overnight or out for a short trip.','for_you','cat_milk_storage_and_labels','Milk storage and labels','Milk storage and labels',5,'If expressing is part of your routine, simple storage bags or containers and clear labels can reduce confusion. This is mainly a practical parent tool, helping you track dates and use milk safely without relying on memory during tired weeks.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Make sleep feel safe',9,true,'ent_cluster_safe_sleep_setup','Safer sleep made simple','Safer sleep is one place where simple rules really help. A clear, firm, flat space with the right bedding choices can make naps and nights feel less confusing. This cluster keeps the focus on calm, practical setup rather than extra sleep products.','for_you','cat_safe_sleep_continuity','Safe sleep check-in','Safe sleep check-in',1,'A safe sleep check is one of the highest-value parent jobs in this band. Back sleeping, a clear cot or Moses basket, same-room sleep and no loose extras matter more than any gadget promising better sleep. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Make sleep feel safe',9,true,'ent_cluster_safe_sleep_setup','Safer sleep made simple','Safer sleep is one place where simple rules really help. A clear, firm, flat space with the right bedding choices can make naps and nights feel less confusing. This cluster keeps the focus on calm, practical setup rather than extra sleep products.','for_you','cat_firm_flat_mattress','A firm, flat, waterproof mattress','A firm, flat, waterproof mattress',2,'A firm, flat, waterproof mattress is a quiet safety essential. It helps keep the sleep surface clear and appropriate, and the NHS advises buying new if possible or only reusing from your own clean, dry, smoke-free home. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Make sleep feel safe',9,true,'ent_cluster_safe_sleep_setup','Safer sleep made simple','Safer sleep is one place where simple rules really help. A clear, firm, flat space with the right bedding choices can make naps and nights feel less confusing. This cluster keeps the focus on calm, practical setup rather than extra sleep products.','for_you','cat_room_thermometer','Room thermometer','Room thermometer',3,'A room thermometer helps you check whether the room is in the safer sleep temperature range, rather than guessing by how you feel. It pairs with clothing and sleeping-bag choices, especially as seasons change. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Make sleep feel safe',9,true,'ent_cluster_safe_sleep_setup','Safer sleep made simple','Safer sleep is one place where simple rules really help. A clear, firm, flat space with the right bedding choices can make naps and nights feel less confusing. This cluster keeps the focus on calm, practical setup rather than extra sleep products.','for_you','cat_baby_sleeping_bag','A well-fitting baby sleeping bag','A well-fitting baby sleeping bag',4,'A baby sleeping bag can help keep bedding simple, but fit and tog matter. The shoulders should fit well so baby cannot slip down inside, and the warmth should match the room temperature. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_safe_sleep_setup','Make sleep feel safe',9,true,'ent_cluster_safe_sleep_setup','Safer sleep made simple','Safer sleep is one place where simple rules really help. A clear, firm, flat space with the right bedding choices can make naps and nights feel less confusing. This cluster keeps the focus on calm, practical setup rather than extra sleep products.','for_you','cat_clear_cot_check','Clear cot checks','Clear cot checks',5,'A clear cot check is a small habit with big safety value. It helps you spot pillows, bumpers, soft toys, pods, nests, wedges or bulky bedding that can look helpful in a shop but should not be in baby’s sleep space.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_cluster_health_first_trips','First trips and check-ins','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_red_book_vaccine_planning','Red Book and vaccine planning','Red Book and vaccine planning',1,'The 6-week check and first vaccinations can arrive quickly while you are still in newborn fog. Keeping the Red Book, appointments and questions together helps you feel prepared, and gives you a useful record of growth, checks and immunisations. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_cluster_health_first_trips','First trips and check-ins','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_rear_facing_car_seat','Rear-facing infant car seat','Rear-facing infant car seat',2,'A suitable rear-facing infant car seat is one of the clearest safety-critical purchases. UK rules require height-based seats to stay rear-facing until your child is over 15 months, so fit, approval and history matter from the start. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_cluster_health_first_trips','First trips and check-ins','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_nappy_change_station','Nappy change station','Nappy change station',3,'A simple change station means the mat, wipes or cotton wool, clean nappy, bag, drying cloth and barrier cream are within reach before you start. That matters when changes are frequent and baby is getting wrigglier. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_cluster_health_first_trips','First trips and check-ins','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_small_object_sweep','Small-object safety sweep','Small-object safety sweep',4,'Your baby may not be crawling yet, but hands and mouths become busier fast. A simple sweep for tiny loose parts, cords, old toy pieces and unsafe older-sibling items keeps the floor-play area ready before movement suddenly jumps forward. Keep the setup simple and follow trusted safety guidance.','for_you'),
  ('1-3m','1–3 months',1,3,true,'ent_cluster_health_first_trips','Keep first trips simpler',10,true,'ent_cluster_health_first_trips','First trips and check-ins','By 1 to 3 months, check-ups, jabs, nappy changes and first outings can all start to stack up. A few prepared basics make it easier to leave the house or handle a change quickly, while keeping safety jobs like car seats and small objects in view.','for_you','cat_button_battery_check','Button battery checks','Button battery checks',5,'Button batteries are not a play category, but they matter in homes full of gadgets, musical toys and older-sibling items. A quick check for secure compartments and loose batteries helps keep the play area safer as reaching and mouthing increase.','for_you');

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

  RAISE NOTICE 'Discover projection rows loaded: % (expected 42)', v_rows_loaded;
  RAISE NOTICE '1-3m rows: % (expected 42), clusters: % (expected 10)', v_rows_1_3m, v_clusters_1_3m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 42 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_1_3m <> 42 THEN
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
