-- Discover pilot import: age band 7–9 months (pl_age_bands id 6-9m)
-- Source: discover_projection tab from 02_Ember_Bible_Pilot_6_9m_discover_projection_voice_v1.xlsx
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
  ('6-9m','7–9 months',7,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_sitting_play_mat','A safe floor-play mat','Sitting Play Mat',1,'A firm floor space can make this stage easier to support. Your baby can sit, lean towards toys, wobble and recover while staying low to the ground, rather than practising on beds, sofas or raised surfaces. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_reach_grab_toys','Reach-and-grab toys','Reach Grab Toys',2,'Your baby may be noticing toys just out of reach and working hard to get them. Light, easy-to-hold objects can give them a reason to stretch, grab, look and bring both hands into play. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_hand_transfer_toys','Toys to pass between hands','Hand Transfer Toys',3,'Passing a toy from one hand to the other can look small, but it is a useful new skill. Simple rings, soft shapes or easy-grip toys let your baby practise coordination, focus and control without needing a complicated setup. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_soft_graspable_balls','Soft balls to hold and roll','Soft Graspable Balls',4,'Soft balls are easy to grab, safe to explore and useful in lots of small moments. Your baby can hold them, drop them, watch them roll and try to reach again, building curiosity and movement practice. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_first_puzzle','Very first puzzles','First Puzzle',5,'A first puzzle is not about getting it right every time. Picking up chunky pieces, turning them around and trying to fit them back gives your baby a satisfying challenge while they practise focus, hand control and early problem-solving. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_tummy_time_wobbler','Wobbly tummy-time toys','Tummy Time Wobbler',1,'If your baby is pushing up, reaching or wriggling, a wobbly toy can give them something interesting to watch and reach for. Keep it for awake, supervised play so movement practice stays safe and playful. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_rolling_ball_set','Rolling balls','Rolling Ball Set',2,'Rolling a ball back and forth is simple, but babies can learn a lot from watching it move. It gives them a reason to look, reach, wait, copy and notice that a small push can change what happens next. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_safe_floor_space','A clear floor space','Safe Floor Space',3,'As rolling, pivoting and crawling begin, the room matters as much as the toy. A clear floor space helps your baby explore while you reduce small objects, trailing cords, sharp edges and other hazards that become more tempting now. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_reach_out_of_range','Just-out-of-reach play','Reach Out Of Range',4,'You do not always need a new toy. Placing a safe, interesting object just beyond your baby’s reach can encourage stretching, turning and problem-solving. Stay close, keep it gentle and stop if they seem frustrated. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_activity_cube_floor','Simple floor activity cubes','Activity Cube Floor',5,'Activity cubes can work well when they offer safe textures, simple movement and easy things to reach. At this age, the best options invite looking, touching and turning without tiny parts, unstable setups or too much stimulation. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_peekaboo_scarf','Peekaboo scarves','Peekaboo Scarf',1,'Peekaboo can become especially fun when your baby starts noticing that people and objects come back. A soft scarf or play silk gives you an easy way to hide, reveal, laugh and repeat, while keeping fabric away during sleep. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_object_permanence_box','Hide-and-find boxes','Object Permanence Box',2,'Dropping a toy into a box, looking for it and pulling it out again gives your baby a simple mystery to solve. It helps them practise focus, hand control and the joy of finding something that disappeared. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_pull_out_tissue_box','Pull-out box toys','Pull Out Tissue Box',3,'Pulling fabric or soft shapes from a box can be surprisingly absorbing. Your baby gets to grip, tug, watch something appear and try again, all while practising hand strength, curiosity and cause-and-effect in a contained way. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_hide_squeak_eggs','Hide-and-squeak toys','Hide Squeak Eggs',4,'Toys that hide, squeak or surprise can make repeated play feel exciting. Your baby can look, listen, grasp and discover what happens next, while you choose age-labelled options and check for safe size, parts and condition. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_drop_roll_toys','Drop-and-roll toys','Drop Roll Toys',5,'Letting go, watching something fall, then doing it again is real learning. Drop-and-roll toys give your baby a playful way to test simple patterns, practise hand release and notice how their actions change what they see. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_stacking_nesting_cups','Stacking and nesting cups','Stacking Nesting Cups',1,'Stacking cups grow with your baby because there are so many ways to use them. They can bang, mouth, fill, empty, knock down and eventually stack, giving lots of practice with hands, space, size and repetition. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_treasure_basket','A safe treasure basket','Treasure Basket',2,'A treasure basket is less about buying more and more about choosing safe objects carefully. Babies can explore different shapes, weights and textures while you stay close, remove choking risks and avoid batteries, sharp edges or unhygienic items. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','7–9 months',7,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_transparent_tube_tower','Posting tubes and towers','Transparent Tube Tower',3,'Posting a toy into a tube or tower gives your baby a clear little experiment. They can hold, drop, watch, search and try again, helping them explore space, movement and what fits where. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_roll_build_cones','Roll-and-stack cones','Roll Build Cones',4,'Cone-style toys give your baby more than one way to play. They can mouth, hold, roll, knock down and later stack them, which keeps the challenge fresh as their hands and balance become steadier. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_sorting_containers','Simple sorting containers','Sorting Containers',5,'Before formal sorting makes sense, babies can still enjoy containers. Putting safe objects in, taking them out and moving them between spaces helps them practise repeated actions, hand control and early noticing of shape and size. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_teethers','Teethers and chew-safe toys','Teethers',1,'Mouthing is a normal way for babies to explore, and teething can make safe chewing feel soothing. Choose easy-clean, age-suitable teethers, check them often for wear, and be cautious with pre-loved items because hygiene matters. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','7–9 months',7,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_texture_cards_books','Touch-and-feel cards or books','Texture Cards Books',2,'Texture cards and touch books let your baby feel, look and listen at the same time. Scratching, patting or mouthing a safe page can become a shared moment, while you add simple words for what they notice. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_cleanable_sensory_toys','Easy-clean sensory toys','Cleanable Sensory Toys',3,'At this age, toys often end up in mouths, on the floor and near food. Easy-clean sensory toys make everyday exploration more manageable, especially when textures, bumps and soft shapes are part of the appeal. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','7–9 months',7,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_safe_household_objects','Safe everyday-object play','Safe Household Objects',4,'Babies often love real household objects, but this stage needs extra care. Large spoons, soft cloths or sealed containers can be interesting, while loose batteries, cords, small parts and sharp edges stay firmly out of reach. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','7–9 months',7,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_battery_free_toys','Battery-safe or battery-free toys','Battery Free Toys',5,'Battery toys are not automatically wrong, but button batteries are a serious hazard if they become loose. Battery-free toys or items with secure compartments can reduce risk while still giving your baby sound, movement and discovery. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_highchair','A supportive highchair','Highchair',1,'Starting solids changes the setup at home. A supportive highchair helps your baby sit for meals while you offer tastes, textures and water. Stay close, use the harness properly and keep mealtimes calm and supervised. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','7–9 months',7,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_open_cup','An open or free-flow cup','Open Cup',2,'A small open or free-flow cup can be introduced with meals around this stage. It gives your baby a gentle chance to practise sipping, holding and joining the rhythm of family eating, with plenty of spills expected. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','7–9 months',7,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_first_spoons_bowls','First spoons and bowls','First Spoons Bowls',3,'First spoons and bowls are less about neat eating and more about learning. Your baby can taste, touch, mouth and gradually practise bringing food towards themselves, while you keep textures safe and expectations realistic. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','7–9 months',7,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_weaning_bibs_mat','Bibs and splash mats','Weaning Bibs Mat',4,'Mess is part of learning to eat, but it can feel like a lot. Bibs, wipe-clean mats and easy-clean surfaces help you say yes to safe exploration without every meal feeling like a full reset. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_safe_food_prep_tools','Safe food prep tools','Safe Food Prep Tools',5,'Food safety becomes practical quickly because shape, texture and firmness all matter. Simple tools for mashing, softening, cutting or serving food can help you prepare first tastes in ways that are easier for your baby to manage. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_allergen_tracking','Food notes or allergen tracker','Allergen Tracking',6,'As first foods expand, some parents find it helpful to note what was offered and any reaction they noticed. A simple food or allergen tracker can make conversations easier and support calm, careful introductions, while health advice still comes from trusted professionals.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_safety_gates','Safety gates','Safety Gates',1,'Crawling and pulling up can arrive quickly, so safety gates are worth thinking about before your baby is moving fast. They can help reduce stair risk when fitted correctly and used alongside close supervision. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_cupboard_locks','Cupboard locks','Cupboard Locks',2,'Once your baby can move, everyday cupboards can become suddenly interesting. Locks or latches on medicine, cleaning and sharp-object cupboards can help you stay ahead, especially in rooms where you cannot watch every reach. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_small_object_sweep','Small-object safety sweep','Small Object Sweep',3,'This is a good stage to get down to baby level and scan the floor. Coins, beads, pen lids and older siblings’ toys can be tempting to mouth, so regular sweeps help keep exploration safer. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_blind_cord_tidy','Blind cord tidies','Blind Cord Tidy',4,'Blind cords can sit quietly in the background until a baby starts reaching, rolling or crawling nearby. Keeping cords short, secure and out of reach can help reduce strangulation risk as movement increases. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_button_battery_check','Button battery checks','Button Battery Check',5,'Button batteries can be hidden inside remotes, cards, thermometers and toys. As babies mouth and explore more, checking compartments and keeping loose batteries well away is a simple but important safety habit. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_safe_sleep_continuity','Safe sleep check-in','Safe Sleep Continuity',6,'Sleep routines may shift around this stage, but safer sleep basics still matter. A clear cot, firm flat mattress and age-appropriate bedding help keep the sleep space calm and safe as your baby grows. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','7–9 months',7,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_board_books','Board books and face books','Board Books',1,'Board books are strong at this age because babies can look, grab, mouth and listen while you read. Simple faces, animals and routines give you natural words to repeat and little moments of shared attention. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_sound_cylinders_shakers','Shakers and sound toys','Sound Cylinders Shakers',2,'A shaker gives quick feedback: your baby moves their hand and hears a sound. That simple connection can make repeated play exciting while they practise grasping, listening, rhythm and turn-taking with you. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_songs_action_games','Songs and action games','Songs Action Games',3,'Songs, clapping and little action games give babies familiar patterns to enjoy. They can watch your face, hear repeated sounds and start to copy simple movements, turning everyday moments into warm back-and-forth play. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_first_signs_books','First signs and gesture books','First Signs Books',4,'Some babies start watching gestures closely before words arrive. Books or games with simple signs, waving or pointing can give you easy ways to model communication while your baby practises looking, copying and responding. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','7–9 months',7,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_feelings_faces_books','Baby faces and feelings books','Feelings Faces Books',5,'Books with baby faces and expressions can make social learning feel natural. You can name smiles, surprises and everyday routines while your baby looks, listens and begins to connect faces with simple words and feelings. It keeps the play simple, recognisable and easy to repeat.','for_your_child');

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
  v_rows_6_9m INTEGER;
  v_clusters_6_9m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_6_9m FROM tmp_discover_projection_stage WHERE age_band_id = '6-9m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_6_9m
  FROM tmp_discover_projection_stage WHERE age_band_id = '6-9m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('6-9m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 42)', v_rows_loaded;
  RAISE NOTICE '6-9m rows: % (expected 42), clusters: % (expected 8)', v_rows_6_9m, v_clusters_6_9m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 42 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_6_9m <> 42 THEN
    RAISE EXCEPTION 'Row count validation failed for 6-9m';
  END IF;
  IF v_clusters_6_9m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 6-9m';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('6-9m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('6-9m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('6-9m');
