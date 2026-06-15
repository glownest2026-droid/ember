-- Discover pilot import: age bands 6–9m and 9–12m
-- Source: discover_projection tab from Ember ABI workbooks (6–9m + 9–12m)
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
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_sitting_play_mat','A safe floor-play mat','A safe floor-play mat',1,'A firm floor space can make this stage easier to support. Your baby can sit, lean towards toys, wobble and recover while staying low to the ground, rather than practising on beds, sofas or raised surfaces. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_reach_grab_toys','Reach-and-grab toys','Reach-and-grab toys',2,'Your baby may be noticing toys just out of reach and working hard to get them. Light, easy-to-hold objects can give them a reason to stretch, grab, look and bring both hands into play. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_hand_transfer_toys','Toys to pass between hands','Toys to pass between hands',3,'Passing a toy from one hand to the other can look small, but it is a useful new skill. Simple rings, soft shapes or easy-grip toys let your baby practise coordination, focus and control without needing a complicated setup. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_soft_graspable_balls','Soft balls to hold and roll','Soft balls to hold and roll',4,'Soft balls are easy to grab, safe to explore and useful in lots of small moments. Your baby can hold them, drop them, watch them roll and try to reach again, building curiosity and movement practice. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','I can sit and reach',1,true,'cluster_sitting_reaching','Sitting up and reaching out','Your baby may be sitting more steadily and reaching for anything nearby. Safe floor play gives them space to wobble, lean, grab and recover. Simple toys they can hold or pass between hands help build balance, coordination and confidence. It gives parents a clear way to support what they are already noticing.','for_your_child','cat_first_puzzle','Very first puzzles','Very first puzzles',5,'A first puzzle is not about getting it right every time. Picking up chunky pieces, turning them around and trying to fit them back gives your baby a satisfying challenge while they practise focus, hand control and early problem-solving. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_tummy_time_wobbler','Wobbly tummy-time toys','Wobbly tummy-time toys',1,'If your baby is pushing up, reaching or wriggling, a wobbly toy can give them something interesting to watch and reach for. Keep it for awake, supervised play so movement practice stays safe and playful. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_rolling_ball_set','Rolling balls','Rolling balls',2,'Rolling a ball back and forth is simple, but babies can learn a lot from watching it move. It gives them a reason to look, reach, wait, copy and notice that a small push can change what happens next. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_safe_floor_space','A clear floor space','A clear floor space',3,'As rolling, pivoting and crawling begin, the room matters as much as the toy. A clear floor space helps your baby explore while you reduce small objects, trailing cords, sharp edges and other hazards that become more tempting now. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_reach_out_of_range','Just-out-of-reach play','Just-out-of-reach play',4,'You do not always need a new toy. Placing a safe, interesting object just beyond your baby’s reach can encourage stretching, turning and problem-solving. Stay close, keep it gentle and stop if they seem frustrated. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','I’m getting ready to move',2,true,'cluster_crawling_floor','Getting ready to move','This stage can bring lots of floor effort: rolling, stretching, pivoting and trying to get closer to something interesting. Safe, supervised floor play gives your baby a reason to push, reach and shift their weight while staying low to the ground.','for_your_child','cat_activity_cube_floor','Simple floor activity cubes','Simple floor activity cubes',5,'Activity cubes can work well when they offer safe textures, simple movement and easy things to reach. At this age, the best options invite looking, touching and turning without tiny parts, unstable setups or too much stimulation. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_peekaboo_scarf','Peekaboo scarves','Peekaboo scarves',1,'Peekaboo can become especially fun when your baby starts noticing that people and objects come back. A soft scarf or play silk gives you an easy way to hide, reveal, laugh and repeat, while keeping fabric away during sleep. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_object_permanence_box','Hide-and-find boxes','Hide-and-find boxes',2,'Dropping a toy into a box, looking for it and pulling it out again gives your baby a simple mystery to solve. It helps them practise focus, hand control and the joy of finding something that disappeared. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_pull_out_tissue_box','Pull-out box toys','Pull-out box toys',3,'Pulling fabric or soft shapes from a box can be surprisingly absorbing. Your baby gets to grip, tug, watch something appear and try again, all while practising hand strength, curiosity and cause-and-effect in a contained way. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_hide_squeak_eggs','Hide-and-squeak toys','Hide-and-squeak toys',4,'Toys that hide, squeak or surprise can make repeated play feel exciting. Your baby can look, listen, grasp and discover what happens next, while you choose age-labelled options and check for safe size, parts and condition. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Things can hide and come back',3,true,'cluster_object_permanence','Finding hidden things','Your baby may start to love simple surprises: a toy drops, a scarf lifts, a face disappears and comes back. Games with hiding, posting and rolling help them notice patterns, remember what happened and enjoy making things happen again. It turns a normal baby phase into playful, repeatable discovery.','for_your_child','cat_drop_roll_toys','Drop-and-roll toys','Drop-and-roll toys',5,'Letting go, watching something fall, then doing it again is real learning. Drop-and-roll toys give your baby a playful way to test simple patterns, practise hand release and notice how their actions change what they see. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_stacking_nesting_cups','Stacking and nesting cups','Stacking and nesting cups',1,'Stacking cups grow with your baby because there are so many ways to use them. They can bang, mouth, fill, empty, knock down and eventually stack, giving lots of practice with hands, space, size and repetition. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_treasure_basket','A safe treasure basket','A safe treasure basket',2,'A treasure basket is less about buying more and more about choosing safe objects carefully. Babies can explore different shapes, weights and textures while you stay close, remove choking risks and avoid batteries, sharp edges or unhygienic items. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_transparent_tube_tower','Posting tubes and towers','Posting tubes and towers',3,'Posting a toy into a tube or tower gives your baby a clear little experiment. They can hold, drop, watch, search and try again, helping them explore space, movement and what fits where. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_roll_build_cones','Roll-and-stack cones','Roll-and-stack cones',4,'Cone-style toys give your baby more than one way to play. They can mouth, hold, roll, knock down and later stack them, which keeps the challenge fresh as their hands and balance become steadier. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','I’m putting things in, out and together',4,true,'cluster_stacking_containment','Putting things in and out','Containers, cups and baskets can be wonderfully satisfying at this age. Your baby can pick things up, drop them in, pull them out and try again. Those small repeated actions help build hand control, focus and early problem-solving. It keeps the learning hands-on, simple and easy to repeat.','for_your_child','cat_sorting_containers','Simple sorting containers','Simple sorting containers',5,'Before formal sorting makes sense, babies can still enjoy containers. Putting safe objects in, taking them out and moving them between spaces helps them practise repeated actions, hand control and early noticing of shape and size. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_teethers','Teethers and chew-safe toys','Teethers and chew-safe toys',1,'Mouthing is a normal way for babies to explore, and teething can make safe chewing feel soothing. Choose easy-clean, age-suitable teethers, check them often for wear, and be cautious with pre-loved items because hygiene matters. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_texture_cards_books','Touch-and-feel cards or books','Touch-and-feel cards or books',2,'Texture cards and touch books let your baby feel, look and listen at the same time. Scratching, patting or mouthing a safe page can become a shared moment, while you add simple words for what they notice. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_cleanable_sensory_toys','Easy-clean sensory toys','Easy-clean sensory toys',3,'At this age, toys often end up in mouths, on the floor and near food. Easy-clean sensory toys make everyday exploration more manageable, especially when textures, bumps and soft shapes are part of the appeal. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_safe_household_objects','Safe everyday-object play','Safe everyday-object play',4,'Babies often love real household objects, but this stage needs extra care. Large spoons, soft cloths or sealed containers can be interesting, while loose batteries, cords, small parts and sharp edges stay firmly out of reach. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Everything goes in my mouth',5,true,'cluster_mouth_sensory','Safe things to chew and explore','Babies often explore with their mouths at this stage, and teething can make safe chewing especially appealing. Cleanable toys, textured books and carefully chosen household objects give them ways to feel, chew and investigate while you keep safety and hygiene in view.','for_both','cat_battery_free_toys','Battery-safe or battery-free toys','Battery-safe or battery-free toys',5,'Battery toys are not automatically wrong, but button batteries are a serious hazard if they become loose. Battery-free toys or items with secure compartments can reduce risk while still giving your baby sound, movement and discovery. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_highchair','A supportive highchair','A supportive highchair',1,'Starting solids changes the setup at home. A supportive highchair helps your baby sit for meals while you offer tastes, textures and water. Stay close, use the harness properly and keep mealtimes calm and supervised. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_open_cup','An open or free-flow cup','An open or free-flow cup',2,'A small open or free-flow cup can be introduced with meals around this stage. It gives your baby a gentle chance to practise sipping, holding and joining the rhythm of family eating, with plenty of spills expected. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_first_spoons_bowls','First spoons and bowls','First spoons and bowls',3,'First spoons and bowls are less about neat eating and more about learning. Your baby can taste, touch, mouth and gradually practise bringing food towards themselves, while you keep textures safe and expectations realistic. It gives families a calm, practical way to try it.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_weaning_bibs_mat','Bibs and splash mats','Bibs and splash mats',4,'Mess is part of learning to eat, but it can feel like a lot. Bibs, wipe-clean mats and easy-clean surfaces help you say yes to safe exploration without every meal feeling like a full reset. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_safe_food_prep_tools','Safe food prep tools','Safe food prep tools',5,'Food safety becomes practical quickly because shape, texture and firmness all matter. Simple tools for mashing, softening, cutting or serving food can help you prepare first tastes in ways that are easier for your baby to manage. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','I’m getting ready for first tastes',6,true,'cluster_first_foods','Starting first foods','Around this stage, many families begin moving from milk-only feeds towards first tastes and textures. The right setup can make meals calmer: somewhere safe to sit, simple cups and spoons, easy-clean surfaces and clear reminders about choking and food safety.','for_both','cat_allergen_tracking','Food notes or allergen tracker','Food notes or allergen tracker',6,'As first foods expand, some parents find it helpful to note what was offered and any reaction they noticed. A simple food or allergen tracker can make conversations easier and support calm, careful introductions, while health advice still comes from trusted professionals.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_safety_gates','Safety gates','Safety gates',1,'Crawling and pulling up can arrive quickly, so safety gates are worth thinking about before your baby is moving fast. They can help reduce stair risk when fitted correctly and used alongside close supervision. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_cupboard_locks','Cupboard locks','Cupboard locks',2,'Once your baby can move, everyday cupboards can become suddenly interesting. Locks or latches on medicine, cleaning and sharp-object cupboards can help you stay ahead, especially in rooms where you cannot watch every reach. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_small_object_sweep','Small-object safety sweep','Small-object safety sweep',3,'This is a good stage to get down to baby level and scan the floor. Coins, beads, pen lids and older siblings’ toys can be tempting to mouth, so regular sweeps help keep exploration safer. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_blind_cord_tidy','Blind cord tidies','Blind cord tidies',4,'Blind cords can sit quietly in the background until a baby starts reaching, rolling or crawling nearby. Keeping cords short, secure and out of reach can help reduce strangulation risk as movement increases. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_button_battery_check','Button battery checks','Button battery checks',5,'Button batteries can be hidden inside remotes, cards, thermometers and toys. As babies mouth and explore more, checking compartments and keeping loose batteries well away is a simple but important safety habit. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','I’m starting to get everywhere',7,true,'cluster_home_safety','Making home safer for movement','As rolling, reaching and crawling increase, everyday rooms can change quickly from calm to full of hazards. Looking ahead now can help you spot stairs, cords, cupboards, small objects and button batteries before your baby gets faster or more curious.','for_you','cat_safe_sleep_continuity','Safe sleep check-in','Safe sleep check-in',6,'Sleep routines may shift around this stage, but safer sleep basics still matter. A clear cot, firm flat mattress and age-appropriate bedding help keep the sleep space calm and safe as your baby grows. It gives you a clear, practical step to check now.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_board_books','Board books and face books','Board books and face books',1,'Board books are strong at this age because babies can look, grab, mouth and listen while you read. Simple faces, animals and routines give you natural words to repeat and little moments of shared attention. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_sound_cylinders_shakers','Shakers and sound toys','Shakers and sound toys',2,'A shaker gives quick feedback: your baby moves their hand and hears a sound. That simple connection can make repeated play exciting while they practise grasping, listening, rhythm and turn-taking with you. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_songs_action_games','Songs and action games','Songs and action games',3,'Songs, clapping and little action games give babies familiar patterns to enjoy. They can watch your face, hear repeated sounds and start to copy simple movements, turning everyday moments into warm back-and-forth play. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_first_signs_books','First signs and gesture books','First signs and gesture books',4,'Some babies start watching gestures closely before words arrive. Books or games with simple signs, waving or pointing can give you easy ways to model communication while your baby practises looking, copying and responding. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','I’m listening, copying and joining in',8,true,'cluster_books_sounds','Books, sounds and little games','Books, songs and responsive games give your baby simple ways to look, listen, copy and join in. A few repeated sounds, gestures or pages can become familiar little routines that build shared attention, early communication and closeness. It gives parents a warm, low-pressure way to join in.','for_your_child','cat_feelings_faces_books','Baby faces and feelings books','Baby faces and feelings books',5,'Books with baby faces and expressions can make social learning feel natural. You can name smiles, surprises and everyday routines while your baby looks, listens and begins to connect faces with simple words and feelings. It keeps the play simple, recognisable and easy to repeat.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_cluster_move','Ready to reach and move','Your baby may be sitting, crawling, reaching for toys, pulling up or cruising along furniture. This is a lovely window for safe floor space, steady surfaces and simple movement games that let them practise balance and confidence without rushing them toward walking.','for_both','ent_cat_floor_zone','Clear floor space for moving','Clear floor space for moving',1,'Clearing a safe patch of floor gives your baby a reason to reach, pivot, crawl or shuffle toward something interesting. A few soft, easy-to-grab objects just out of reach can turn ordinary floor time into calm movement practice. It is easy to repeat in short, supervised bursts.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_cluster_move','Ready to reach and move','Your baby may be sitting, crawling, reaching for toys, pulling up or cruising along furniture. This is a lovely window for safe floor space, steady surfaces and simple movement games that let them practise balance and confidence without rushing them toward walking.','for_both','ent_cat_cruising_furniture','Steady surfaces for pulling up','Steady surfaces for pulling up',2,'If your baby is starting to pull up, steady surfaces can give them a safe place to practise. The goal is not to hurry walking, but to make those wobbly standing moments calmer, more supported and easier to supervise. It is easy to repeat in short, supervised bursts.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_cluster_move','Ready to reach and move','Your baby may be sitting, crawling, reaching for toys, pulling up or cruising along furniture. This is a lovely window for safe floor space, steady surfaces and simple movement games that let them practise balance and confidence without rushing them toward walking.','for_both','ent_cat_push_pull_toy','Push-and-pull toys, when ready','Push-and-pull toys, when ready',3,'Some babies near the end of this stage enjoy pushing, pulling or following a toy across the floor. If your baby is already steady enough, a stable push-and-pull toy can add a playful reason to move, without using a seated walker.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_cluster_move','Ready to reach and move','Your baby may be sitting, crawling, reaching for toys, pulling up or cruising along furniture. This is a lovely window for safe floor space, steady surfaces and simple movement games that let them practise balance and confidence without rushing them toward walking.','for_both','ent_cat_soft_balls','Soft balls to chase and roll','Soft balls to chase and roll',4,'Rolling a soft ball away, passing it between you or watching it bounce gently can make movement feel playful. It gives your baby a clear thing to reach for, chase, hold, throw or pass, while keeping the game simple. It is easy to repeat in short, supervised bursts.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_cluster_move','Ready to reach and move','Your baby may be sitting, crawling, reaching for toys, pulling up or cruising along furniture. This is a lovely window for safe floor space, steady surfaces and simple movement games that let them practise balance and confidence without rushing them toward walking.','for_both','ent_cat_park_swings','Park trips and baby swings','Park trips and baby swings',5,'A short park trip can reset the day and give your baby new things to watch, hear and name. An age-suitable baby swing, used closely, can add gentle movement and shared smiles without needing another toy at home. It is easy to repeat in short, supervised bursts.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','I’m getting ready to move',1,true,'ent_cluster_move','Ready to reach and move','Your baby may be sitting, crawling, reaching for toys, pulling up or cruising along furniture. This is a lovely window for safe floor space, steady surfaces and simple movement games that let them practise balance and confidence without rushing them toward walking.','for_both','ent_cat_low_obstacle','Soft cushions and crawl-through games','Soft cushions and crawl-through games',6,'A cushion to move around or a low tunnel to crawl through can make floor play feel like an adventure. Keep it soft and simple so your baby can practise balance, reaching and body control while you stay close. It is easy to repeat in short, supervised bursts.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','My hands can do more now',2,true,'ent_cluster_hands','Busy little hands','Your baby may be grabbing, banging, passing toys between hands, raking food or trying tiny finger-and-thumb movements. Everyday play with cups, baskets, chunky pieces and safe household objects can help them practise hand control, focus and early problem-solving in a way that feels like discovery.','for_your_child','ent_cat_pincer_puzzle','Chunky peg and drop games','Chunky peg and drop games',1,'Picking up a chunky peg, holding it, turning it and dropping it into place gives your baby a clear little task. That satisfying try-again loop can help build finger control, focus and early problem-solving. It is simple to repeat and easy to change up.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','My hands can do more now',2,true,'ent_cluster_hands','Busy little hands','Your baby may be grabbing, banging, passing toys between hands, raking food or trying tiny finger-and-thumb movements. Everyday play with cups, baskets, chunky pieces and safe household objects can help them practise hand control, focus and early problem-solving in a way that feels like discovery.','for_your_child','ent_cat_stacking_cups','Stacking, nesting and filling cups','Stacking, nesting and filling cups',2,'Cups are wonderfully flexible at this age. Your baby can bang them, hide things inside, tip them out, stack them badly, knock them down and try again. Each small action helps with hand control, attention and cause-and-effect. It is simple to repeat and easy to change up.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','My hands can do more now',2,true,'ent_cluster_hands','Busy little hands','Your baby may be grabbing, banging, passing toys between hands, raking food or trying tiny finger-and-thumb movements. Everyday play with cups, baskets, chunky pieces and safe household objects can help them practise hand control, focus and early problem-solving in a way that feels like discovery.','for_your_child','ent_cat_container_basket','Treasure baskets and emptying games','Treasure baskets and emptying games',3,'A basket of large, baby-safe objects can keep little hands busy without making play complicated. Taking things out, dropping them back in and choosing what to grab next helps your baby practise control, curiosity and early decision-making. It is simple to repeat and easy to change up.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','My hands can do more now',2,true,'ent_cluster_hands','Busy little hands','Your baby may be grabbing, banging, passing toys between hands, raking food or trying tiny finger-and-thumb movements. Everyday play with cups, baskets, chunky pieces and safe household objects can help them practise hand control, focus and early problem-solving in a way that feels like discovery.','for_your_child','ent_cat_two_handed_objects','Two-hand toys and banging games','Two-hand toys and banging games',4,'Passing a toy from one hand to the other, banging two safe objects together or holding something with both hands may look ordinary. It gives your baby useful practice coordinating both sides of the body during playful, noisy moments. It is simple to repeat and easy to change up.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','My hands can do more now',2,true,'ent_cluster_hands','Busy little hands','Your baby may be grabbing, banging, passing toys between hands, raking food or trying tiny finger-and-thumb movements. Everyday play with cups, baskets, chunky pieces and safe household objects can help them practise hand control, focus and early problem-solving in a way that feels like discovery.','for_your_child','ent_cat_musical_noise','Clapping, shaking and noisy play','Clapping, shaking and noisy play',5,'Clapping, shaking a rattle or banging a safe object can become more than noise. Your baby is noticing rhythm, copying you and learning that their actions can create a response, especially when you smile, pause and join in. It is simple to repeat and easy to change up.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','My hands can do more now',2,true,'ent_cluster_hands','Busy little hands','Your baby may be grabbing, banging, passing toys between hands, raking food or trying tiny finger-and-thumb movements. Everyday play with cups, baskets, chunky pieces and safe household objects can help them practise hand control, focus and early problem-solving in a way that feels like discovery.','for_your_child','ent_cat_safe_household_objects','Baby-safe household treasures','Baby-safe household treasures',6,'A wooden spoon, a clean tub or a soft cloth can be just as interesting as a toy when it is safe and supervised. Everyday objects give your baby new textures, sounds and movements to explore, without adding more clutter.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','I’m finding things out',3,true,'ent_cluster_solve','Finding hidden things','Dropping a ball, lifting a cloth or posting something into a box can suddenly feel fascinating. These repeated little experiments help your baby learn that things can move, hide, come back and make something happen, while building focus and hand control.','for_your_child','ent_cat_peekaboo_scarf','Peekaboo scarves and cloths','Peekaboo scarves and cloths',1,'Hiding your face, a toy or a soft cloth and bringing it back can be endlessly funny at this stage. Peekaboo helps your baby explore disappearing and returning, while also building anticipation, attention and shared laughter. It also gives you an easy moment to join in.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','I’m finding things out',3,true,'ent_cluster_solve','Finding hidden things','Dropping a ball, lifting a cloth or posting something into a box can suddenly feel fascinating. These repeated little experiments help your baby learn that things can move, hide, come back and make something happen, while building focus and hand control.','for_your_child','ent_cat_posting_boxes','Posting boxes and hiding lids','Posting boxes and hiding lids',2,'Posting a chunky piece into a box, sliding a lid or finding something hidden inside gives your baby a clear challenge. It lets them practise hand control and early problem-solving while discovering that objects can go somewhere and come back.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','I’m finding things out',3,true,'ent_cluster_solve','Finding hidden things','Dropping a ball, lifting a cloth or posting something into a box can suddenly feel fascinating. These repeated little experiments help your baby learn that things can move, hide, come back and make something happen, while building focus and hand control.','for_your_child','ent_cat_drop_roll_tubes','Drop, roll and tube games','Drop, roll and tube games',3,'Dropping a ball into a tube or watching it roll across the floor gives your baby a simple experiment to repeat. They can see where things go, try again and begin to connect their action with what happens next. It also gives you an easy moment to join in.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','I’m finding things out',3,true,'ent_cluster_solve','Finding hidden things','Dropping a ball, lifting a cloth or posting something into a box can suddenly feel fascinating. These repeated little experiments help your baby learn that things can move, hide, come back and make something happen, while building focus and hand control.','for_your_child','ent_cat_first_puzzles','Big-piece first puzzles','Big-piece first puzzles',4,'Big, easy-to-hold puzzle pieces give your baby something to pick up, turn, test and try again. At this age, the value is not finishing the puzzle neatly, but practising focus, hand control and curiosity. It also gives you an easy moment to join in.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','I’m finding things out',3,true,'ent_cluster_solve','Finding hidden things','Dropping a ball, lifting a cloth or posting something into a box can suddenly feel fascinating. These repeated little experiments help your baby learn that things can move, hide, come back and make something happen, while building focus and hand control.','for_your_child','ent_cat_switchboard','Safe switches, flaps and buttons','Safe switches, flaps and buttons',5,'Large switches, flaps and buttons can be very satisfying for a baby who wants to make things happen. Simple cause-and-effect play helps them practise hand movements, attention and curiosity, especially when the pieces are safe and sturdy. It also gives you an easy moment to join in.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','I’m finding things out',3,true,'ent_cluster_solve','Finding hidden things','Dropping a ball, lifting a cloth or posting something into a box can suddenly feel fascinating. These repeated little experiments help your baby learn that things can move, hide, come back and make something happen, while building focus and hand control.','for_your_child','ent_cat_hide_favourite_toy','Hide-and-find favourite toys','Hide-and-find favourite toys',6,'If your baby has a favourite toy, hiding it under a cloth or behind a cup can turn a familiar object into a tiny discovery game. Looking, waiting and finding help build memory, attention and shared play. It also gives you an easy moment to join in.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','I’m learning to tell you things',4,true,'ent_cluster_words','Chats, claps and little signs','Your baby may be babbling back, responding to their name, waving, clapping, pointing or copying sounds. Songs, board books, simple signs and naming games help turn these small gestures into shared moments, giving your baby more ways to connect before clear words arrive.','for_your_child','ent_cat_board_books','Board books for pointing and naming','Board books for pointing and naming',1,'A chunky board book gives your baby something to hold, turn, point at and hear named again and again. Looking together helps build shared attention, early language and a calm little routine you can repeat anywhere. It can fit naturally into everyday routines.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','I’m learning to tell you things',4,true,'ent_cluster_words','Chats, claps and little signs','Your baby may be babbling back, responding to their name, waving, clapping, pointing or copying sounds. Songs, board books, simple signs and naming games help turn these small gestures into shared moments, giving your baby more ways to connect before clear words arrive.','for_your_child','ent_cat_rhyme_games','Rhymes, claps and pat-a-cake','Rhymes, claps and pat-a-cake',2,'Rhymes and clapping games give your baby predictable sounds, pauses and actions to copy. Pat-a-cake, waving songs or simple claps can turn communication into a back-and-forth game, even before clear words arrive. It can fit naturally into everyday routines you already do together.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','I’m learning to tell you things',4,true,'ent_cluster_words','Chats, claps and little signs','Your baby may be babbling back, responding to their name, waving, clapping, pointing or copying sounds. Songs, board books, simple signs and naming games help turn these small gestures into shared moments, giving your baby more ways to connect before clear words arrive.','for_your_child','ent_cat_waving_signs','Waving, pointing and simple signs','Waving, pointing and simple signs',3,'A wave, point, arm lift or simple sign can help your baby communicate before words are clear. Repeating these gestures during real routines, like bye-bye, more or all gone, gives them useful ways to join in. It can fit naturally into everyday routines.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','I’m learning to tell you things',4,true,'ent_cluster_words','Chats, claps and little signs','Your baby may be babbling back, responding to their name, waving, clapping, pointing or copying sounds. Songs, board books, simple signs and naming games help turn these small gestures into shared moments, giving your baby more ways to connect before clear words arrive.','for_your_child','ent_cat_sound_copy','Copy-me babble games','Copy-me babble games',4,'When your baby babbles, copying the sound and pausing can make it feel like a conversation. Adding one simple word, smile or gesture helps them learn turn-taking and shows that their sounds are worth listening to. It can fit naturally into everyday routines.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','I’m learning to tell you things',4,true,'ent_cluster_words','Chats, claps and little signs','Your baby may be babbling back, responding to their name, waving, clapping, pointing or copying sounds. Songs, board books, simple signs and naming games help turn these small gestures into shared moments, giving your baby more ways to connect before clear words arrive.','for_your_child','ent_cat_point_name_outings','Point-and-name little outings','Point-and-name little outings',5,'A walk can become a gentle naming game when your baby looks, points or reaches toward something. Saying simple words like dog, bus or tree helps connect what they notice with language, while giving the day a small reset. It can fit naturally into everyday routines.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','I’m learning to tell you things',4,true,'ent_cluster_words','Chats, claps and little signs','Your baby may be babbling back, responding to their name, waving, clapping, pointing or copying sounds. Songs, board books, simple signs and naming games help turn these small gestures into shared moments, giving your baby more ways to connect before clear words arrive.','for_your_child','ent_cat_family_faces_cards','Family faces and favourite objects','Family faces and favourite objects',6,'Babies often light up for familiar faces and favourite things. Simple photo cards or object cards give you easy chances to name people, point together and build recognition, especially if your baby is showing clear preferences. It can fit naturally into everyday routines.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','I’m learning to feed myself',5,true,'ent_cluster_feeding','Messy little meals','Mealtimes may start to look busier now, with finger foods, cup practice, lumpy textures and plenty of mess. Safe seating, calm supervision and simple prep help your baby practise eating, drinking and joining family meals without turning every meal into a battle.','for_you','ent_cat_highchair','Safe sitting for messy meals','Safe sitting for messy meals',1,'As finger foods and lumpy textures become more common, safe upright seating makes mealtimes easier to manage. A stable highchair or feeding seat helps your baby focus on eating while you can stay close and watch carefully. It keeps the focus on practice, not perfection.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','I’m learning to feed myself',5,true,'ent_cluster_feeding','Messy little meals','Mealtimes may start to look busier now, with finger foods, cup practice, lumpy textures and plenty of mess. Safe seating, calm supervision and simple prep help your baby practise eating, drinking and joining family meals without turning every meal into a battle.','for_you','ent_cat_open_cup','Tiny open-cup practice','Tiny open-cup practice',2,'A small open cup with a little water can become a careful practice moment near this stage. Your baby may spill, chew or splash at first, but holding, sipping and trying again can build coordination with your help. It keeps the focus on practice, not perfection.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','I’m learning to feed myself',5,true,'ent_cluster_feeding','Messy little meals','Mealtimes may start to look busier now, with finger foods, cup practice, lumpy textures and plenty of mess. Safe seating, calm supervision and simple prep help your baby practise eating, drinking and joining family meals without turning every meal into a battle.','for_you','ent_cat_finger_food_prep','Finger foods cut safely','Finger foods cut safely',3,'Finger foods give your baby a hands-on way to explore texture, grip and chewing. The adult job is to make the food safe: soft enough, cut to the right shape and watched closely while your baby experiments. It keeps the focus on practice, not perfection.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','I’m learning to feed myself',5,true,'ent_cluster_feeding','Messy little meals','Mealtimes may start to look busier now, with finger foods, cup practice, lumpy textures and plenty of mess. Safe seating, calm supervision and simple prep help your baby practise eating, drinking and joining family meals without turning every meal into a battle.','for_you','ent_cat_bibs_mats','Bibs, mats and clean-up helpers','Bibs, mats and clean-up helpers',4,'Self-feeding often means food on hands, clothes, hair and floor. Bibs, splash mats and simple clean-up helpers can make that mess easier to tolerate, so your baby still gets the practice of touching, gripping and tasting. It keeps the focus on practice, not perfection.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','I’m learning to feed myself',5,true,'ent_cluster_feeding','Messy little meals','Mealtimes may start to look busier now, with finger foods, cup practice, lumpy textures and plenty of mess. Safe seating, calm supervision and simple prep help your baby practise eating, drinking and joining family meals without turning every meal into a battle.','for_you','ent_cat_family_meal_plan','Joining simple family meals','Joining simple family meals',5,'By the end of the first year, your baby may be joining more regular meals alongside milk. Simple family food, adapted safely, lets them watch, copy and practise eating with you, while keeping salt, sugar and choking risks in mind.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','I’m learning to feed myself',5,true,'ent_cluster_feeding','Messy little meals','Mealtimes may start to look busier now, with finger foods, cup practice, lumpy textures and plenty of mess. Safe seating, calm supervision and simple prep help your baby practise eating, drinking and joining family meals without turning every meal into a battle.','for_you','ent_cat_pouches_caution','Using pouches without relying on them','Using pouches without relying on them',6,'Pouches can be helpful on difficult days, but they are not the same as exploring real textures and finger foods. Using them occasionally, and serving from a spoon, keeps convenience in its place while your baby keeps practising. It keeps the focus on practice, not perfection.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','I’m suddenly into everything',6,true,'ent_cluster_safety','Babyproofing the new mover','Once your baby crawls, pulls up or mouths everything, the home can change overnight. This is a good time to check stairs, furniture, cupboards, cords and water routines, so your baby has room to explore while the big risks are calmly managed.','for_you','ent_cat_stair_gates','Stair gates before the big climb','Stair gates before the big climb',1,'Once your baby starts moving, stairs can become interesting very quickly. Fitting stair gates where needed helps protect those sudden crawling, climbing or cruising attempts, while still giving your baby safer places to explore nearby. It gives your baby more freedom within safer limits.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','I’m suddenly into everything',6,true,'ent_cluster_safety','Babyproofing the new mover','Once your baby crawls, pulls up or mouths everything, the home can change overnight. This is a good time to check stairs, furniture, cupboards, cords and water routines, so your baby has room to explore while the big risks are calmly managed.','for_you','ent_cat_furniture_anchors','Anchored furniture for pull-up practice','Anchored furniture for pull-up practice',2,'Pulling up often happens on whatever is closest: a chair, shelf, drawer or low table. Anchoring furniture and checking unstable pieces helps make the room safer for those wobbly standing attempts and curious hands. It gives your baby more freedom within safer limits.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','I’m suddenly into everything',6,true,'ent_cluster_safety','Babyproofing the new mover','Once your baby crawls, pulls up or mouths everything, the home can change overnight. This is a good time to check stairs, furniture, cupboards, cords and water routines, so your baby has room to explore while the big risks are calmly managed.','for_you','ent_cat_cupboard_locks','Cupboard locks for curious hands','Cupboard locks for curious hands',3,'Opening cupboards can become a new favourite experiment once your baby is mobile. Locks and safer storage help keep cleaning products, medicines and small hazards out of reach, so curiosity can continue in safer places. It gives your baby more freedom within safer limits.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','I’m suddenly into everything',6,true,'ent_cluster_safety','Babyproofing the new mover','Once your baby crawls, pulls up or mouths everything, the home can change overnight. This is a good time to check stairs, furniture, cupboards, cords and water routines, so your baby has room to explore while the big risks are calmly managed.','for_you','ent_cat_blind_cord_cleats','Blind-cord tidies and cleats','Blind-cord tidies and cleats',4,'A dangling blind cord can look like something to pull or chew. Tidying cords with cleats or cordless options removes a serious risk from the room, especially as your baby starts reaching higher and moving more confidently. It gives your baby more freedom within safer limits.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','I’m suddenly into everything',6,true,'ent_cluster_safety','Babyproofing the new mover','Once your baby crawls, pulls up or mouths everything, the home can change overnight. This is a good time to check stairs, furniture, cupboards, cords and water routines, so your baby has room to explore while the big risks are calmly managed.','for_you','ent_cat_bath_supervision','Safe bath and water-play routines','Safe bath and water-play routines',5,'Bath cups, splashing and pouring can be lovely at this age, but water needs close attention every time. A simple routine, everything within reach and constant supervision help make water play enjoyable without taking safety for granted. It gives your baby more freedom within safer limits.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','I’m suddenly into everything',6,true,'ent_cluster_safety','Babyproofing the new mover','Once your baby crawls, pulls up or mouths everything, the home can change overnight. This is a good time to check stairs, furniture, cupboards, cords and water routines, so your baby has room to explore while the big risks are calmly managed.','for_you','ent_cat_exclude_baby_walker','Skip seated baby walkers','Skip seated baby walkers',6,'Seated baby walkers can look like a quick way to help movement, but they bring safety risks and do not help babies learn to walk well. Safer floor play, crawling space and steady surfaces are better routes for practice. It gives your baby more freedom within safer limits.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_cluster_stories','Faces, feelings and little stories','Your baby may show favourite people, familiar toys and early reactions to faces or voices. Simple books, photo cards, puppets and soft toys can make naming, comfort and early feelings easier to share, while giving you lovely repeatable moments together.','for_your_child','ent_cat_feelings_books','Baby faces and feelings books','Baby faces and feelings books',1,'Books with baby faces, simple expressions or familiar routines give you easy moments to point, name and react together. Your baby may not understand feelings fully yet, but they can enjoy faces, voices and shared attention. It is gentle, repeatable and easy to share.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_cluster_stories','Faces, feelings and little stories','Your baby may show favourite people, familiar toys and early reactions to faces or voices. Simple books, photo cards, puppets and soft toys can make naming, comfort and early feelings easier to share, while giving you lovely repeatable moments together.','for_your_child','ent_cat_soft_doll','Soft doll or cuddly care play','Soft doll or cuddly care play',2,'A soft doll or cuddly toy can become part of simple care play: patting, cuddling, handing over or finding again. These small moments support comfort, imitation and connection without needing complicated pretend play. It is gentle, repeatable and easy to share.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_cluster_stories','Faces, feelings and little stories','Your baby may show favourite people, familiar toys and early reactions to faces or voices. Simple books, photo cards, puppets and soft toys can make naming, comfort and early feelings easier to share, while giving you lovely repeatable moments together.','for_your_child','ent_cat_animal_mini_books','Little animal books','Little animal books',3,'Small animal books are easy to hold, chew, point at and revisit. Naming the animal, making the sound and waiting for your baby’s reaction turns a simple book into shared attention, sound play and early vocabulary. It is gentle, repeatable and easy to share.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_cluster_stories','Faces, feelings and little stories','Your baby may show favourite people, familiar toys and early reactions to faces or voices. Simple books, photo cards, puppets and soft toys can make naming, comfort and early feelings easier to share, while giving you lovely repeatable moments together.','for_your_child','ent_cat_puppets','Puppets and silly voices','Puppets and silly voices',4,'A puppet or funny voice can make a familiar song or book feel new again. Your baby may watch, smile, reach or babble back, giving you an easy way to stretch a small moment into shared play. It is gentle, repeatable and easy to share.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_cluster_stories','Faces, feelings and little stories','Your baby may show favourite people, familiar toys and early reactions to faces or voices. Simple books, photo cards, puppets and soft toys can make naming, comfort and early feelings easier to share, while giving you lovely repeatable moments together.','for_your_child','ent_cat_family_photos','Family photos and familiar faces','Family photos and familiar faces',5,'Photos of familiar people can be surprisingly powerful when your baby is tuned into favourite adults. Pointing, naming and smiling at the pictures helps connect faces with words and can make separation or waiting moments feel calmer. It is gentle, repeatable and easy to share.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','I’m noticing faces and feelings',7,true,'ent_cluster_stories','Faces, feelings and little stories','Your baby may show favourite people, familiar toys and early reactions to faces or voices. Simple books, photo cards, puppets and soft toys can make naming, comfort and early feelings easier to share, while giving you lovely repeatable moments together.','for_your_child','ent_cat_texture_sensory','Texture balls for touching and rolling','Texture balls for touching and rolling',6,'A textured ball gives your baby something to squeeze, roll, mouth, pass and chase. Different surfaces can make the object more interesting, while the simple rolling game still builds reaching, grip and shared attention. It is gentle, repeatable and easy to share.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Give me a good little moment',8,true,'ent_cluster_days','Simple ways to fill the day','Some days just need an easy reset: a pram walk, a library mat, bubbles, bath cups or a basket of safe objects. These small moments give your baby something fresh to reach, watch, name or explore, without making you feel you need to buy more.','for_both','ent_cat_pram_walks','Pram walks with naming','Pram walks with naming',1,'A pram walk can be a good reset for both of you. Naming what you pass, pausing for sounds and following your baby’s gaze turns an ordinary outing into gentle language, attention and connection practice. It keeps the day moving without adding pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Give me a good little moment',8,true,'ent_cluster_days','Simple ways to fill the day','Some days just need an easy reset: a pram walk, a library mat, bubbles, bath cups or a basket of safe objects. These small moments give your baby something fresh to reach, watch, name or explore, without making you feel you need to buy more.','for_both','ent_cat_library_baby_group','Library or baby-group floor time','Library or baby-group floor time',2,'A library mat or baby group gives your baby new faces, sounds and objects to notice, while you get a change of scene. The value is not a packed schedule, just a fresh little social and movement moment. It keeps the day moving without adding pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Give me a good little moment',8,true,'ent_cluster_days','Simple ways to fill the day','Some days just need an easy reset: a pram walk, a library mat, bubbles, bath cups or a basket of safe objects. These small moments give your baby something fresh to reach, watch, name or explore, without making you feel you need to buy more.','for_both','ent_cat_bubbles','Bubbles to watch and reach for','Bubbles to watch and reach for',3,'Bubbles are simple but captivating: they float, pop, disappear and come back again. Watching, reaching and laughing together can support attention, tracking and shared joy, especially when you need a quick activity at home. It keeps the day moving without adding pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Give me a good little moment',8,true,'ent_cluster_days','Simple ways to fill the day','Some days just need an easy reset: a pram walk, a library mat, bubbles, bath cups or a basket of safe objects. These small moments give your baby something fresh to reach, watch, name or explore, without making you feel you need to buy more.','for_both','ent_cat_bath_cups','Bath cups and pouring','Bath cups and pouring',4,'Pouring water between cups in the bath gives your baby a safe, contained way to explore movement and control. Scooping, tipping and watching water fall can be fascinating, as long as an adult stays close throughout. It keeps the day moving without adding pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Give me a good little moment',8,true,'ent_cluster_days','Simple ways to fill the day','Some days just need an easy reset: a pram walk, a library mat, bubbles, bath cups or a basket of safe objects. These small moments give your baby something fresh to reach, watch, name or explore, without making you feel you need to buy more.','for_both','ent_cat_toy_rotation','Tiny toy rotation basket','Tiny toy rotation basket',5,'Putting a few safe objects in a small basket and swapping them around can make play feel new without buying more. Your baby gets a fresh choice, and you get a simple way to reduce clutter and decision fatigue. It keeps the day moving without adding pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Give me a good little moment',8,true,'ent_cluster_days','Simple ways to fill the day','Some days just need an easy reset: a pram walk, a library mat, bubbles, bath cups or a basket of safe objects. These small moments give your baby something fresh to reach, watch, name or explore, without making you feel you need to buy more.','for_both','ent_cat_safe_laundry_play','Supervised laundry basket play','Supervised laundry basket play',6,'A laundry basket can become a simple supervised game: taking cloths out, putting them back, peeking through holes or crawling around it. It gives your baby texture, hiding and movement practice using something already in the house. It keeps the day moving without adding pressure.','for_both');

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
  v_rows_6_9 INTEGER;
  v_rows_9_12 INTEGER;
  v_clusters_6_9 INTEGER;
  v_clusters_9_12 INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_6_9 FROM tmp_discover_projection_stage WHERE age_band_id = '6-9m';
  SELECT COUNT(*) INTO v_rows_9_12 FROM tmp_discover_projection_stage WHERE age_band_id = '9-12m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_6_9
  FROM tmp_discover_projection_stage WHERE age_band_id = '6-9m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_9_12
  FROM tmp_discover_projection_stage WHERE age_band_id = '9-12m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('6-9m', '9-12m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 90)', v_rows_loaded;
  RAISE NOTICE '6-9m rows: % (expected 42), clusters: % (expected 8)', v_rows_6_9, v_clusters_6_9;
  RAISE NOTICE '9-12m rows: % (expected 48), clusters: % (expected 8)', v_rows_9_12, v_clusters_9_12;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 90 OR v_rows_6_9 <> 42 OR v_rows_9_12 <> 48 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_clusters_6_9 <> 8 OR v_clusters_9_12 <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('6-9m','9-12m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('6-9m','9-12m');
-- DELETE FROM public.pl_age_band_category_type_products WHERE age_band_id IN ('6-9m','9-12m');
-- DELETE FROM public.pl_age_bands WHERE id IN ('6-9m','9-12m');
