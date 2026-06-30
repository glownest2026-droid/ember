-- Discover pilot import: age bands 13–15 months
-- Source: discover_projection tab from Ember ABI workbooks (13-15m)
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
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_posting_boxes','Posting boxes and drop games','Posting Boxes',1,'Use a tissue box, tub or basket with chunky, safe objects. Dropping things in and pulling them out gives your toddler a satisfying little challenge without needing anything fancy.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Before buying, try a tissue box, tub or basket with large safe objects.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_two_block_towers','Blocks for stacking and crashing','Two Block Towers',2,'If you already have blocks, keep them out. Around this age, the interesting bit is copying, stacking, knocking down and trying again.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A good gift only if they do not already have a solid set of blocks.','If blocks are already out, this is about using them differently now.','Blocks for stacking and crashing','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_hide_find_cups','Hide-and-find cups','Hide Find Cups',3,'Hide a small toy under a cup and let them find it. Keep it simple. The fun is in the reveal, the repeat and the little look of “again”.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Cups, bowls or bath toys may already cover this.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_tip_out_baskets','Tip-out baskets','Tip Out Baskets',4,'Give them one basket they are allowed to empty and refill. It scratches the “into everything” itch without sacrificing the real cupboards.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Setup',NULL,'Use a real basket or tub before adding another toy.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_shape_peg_puzzles','Shape and peg puzzles','Shape Peg Puzzles',5,'Look for chunky pieces that are easy to grip. The point is turning, testing and noticing when something fits, not finishing neatly.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A good first-birthday gift if the pieces are chunky and age-fit.','Useful if you do not already have a chunky puzzle.','Shape and peg puzzles','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_point_name_walks','Point-and-name walks','Point Name Walks',1,'Give a familiar walk a small job: point to dogs, listen for buses, wave at lights, find leaves. Same walk, more to notice.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'This is a different way to use a walk you already do.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_books_with_pauses','Board books with flaps and first words','Books With Pauses',2,'Sturdy books with flaps, familiar objects and simple words give your toddler chances to point, pause, copy sounds and ask for more.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A strong gift choice: useful, easy to store and unlikely to feel too risky.','If you already have board books, slow them down before buying more.','Board books with flaps and first words','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_everyday_sound_games','Everyday sound games','Everyday Sound Games',3,'Woof, beep, uh-oh, bye-bye and “more” may feel small, but they are easy sounds to copy and use in real moments.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'No toy needed: use animals, vehicles and familiar household sounds.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_tiny_choice_moments','Tiny choice moments','Tiny Choice Moments',4,'Hold up two snacks, books or toys and wait. It gives your toddler a reason to point, reach, sound or choose.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use snacks, books or toys already in reach.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_bring_me_games','Bring-me games','Bring Me Games',5,'“Bring me your shoes” or “Where’s the ball?” turns understanding into action. Keep it playful, not test-like.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use familiar objects: shoes, ball, cup, teddy.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_real_object_baskets','Real-object baskets','Real Object Baskets',1,'A safe spoon, cup, brush, cloth and old purse can be more interesting than a toy set because they feel connected to the real day.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Setup',NULL,'Household objects often beat toy versions here.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_teddy_care_play','Teddies and soft dolls for caring play','Teddy Care Play',2,'A soft doll, teddy or animal can help your toddler copy feeding, wiping, brushing and bedtime routines they see every day.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A thoughtful gift if the family does not already have a favourite teddy or doll.','Try a favourite soft toy before buying a care set.','Teddies and soft dolls for caring play','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_mini_jobs','Mini jobs beside you','Mini Jobs',3,'Passing a sock, stirring an empty bowl or wiping a tray gives them a way to join in without making the whole task harder.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use real routines, not a special activity setup.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_yes_drawer','One yes drawer','Yes Drawer',4,'A low drawer or basket they can safely empty gives copying somewhere to go. It also reduces the number of things you have to keep saying no to.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Setup',NULL,'Make one existing drawer or basket toddler-safe.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_kitchen_floor_setup','A kitchen-floor setup','Kitchen Floor Setup',5,'A bowl, spoon and cloth on the floor can keep them close while you cook, without handing over the actual cupboards.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Setup',NULL,'A bowl, spoon and cloth can be enough.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_carry_something_small','Carry something small','Carry Something Small',1,'A soft toy, little bag or chunky object gives walking a purpose. Carrying changes balance, so keep it short and supervised.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use a soft toy, little bag or chunky safe object.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_roll_chase_games','Roll-and-chase games','Roll Chase Games',2,'Roll a ball a few feet away and let them go after it. It gives movement a reason without turning the room into an obstacle course.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use any soft ball that is already around.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_sofa_table_cruising','Sofa-to-table cruising','Sofa Table Cruising',3,'Place something interesting just out of reach between two safe supports. The aim is gentle movement, not rushing walking.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use safe furniture and space before buying movement toys.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_low_cushion_routes','Low cushion routes','Low Cushion Routes',4,'A cushion, mat or low obstacle can make movement interesting when the house feels too familiar.','for_your_child','setup','useful_ideas','Useful ideas',1,false,false,false,'Setup',NULL,'Use cushions or mats you already have.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_push_pull_play','Push and pull toys','Push Pull Play',5,'Useful if your toddler enjoys moving things around. If furniture, boxes and balls already keep them busy, this is optional.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A good gift when chosen simply: sturdy, low-noise and not too bulky.','Useful if movement toys are a genuine gap.','Push and pull toys','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_spoon_practice','Spoon practice without the pressure','Spoon Practice',1,'Let them dip, scoop, miss and try again. A second spoon for you can keep the meal moving while they practise.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use a spare spoon and the food they are already eating.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_open_cup','Small open cups','Open Cup',2,'A small, easy-to-hold cup gives them a chance to practise control. Keep it close-supervised and expect spills.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,false,false,'Parent buy','Better as a parent buy than a toy gift.','Use a small cup if you already have one.','Small open cups','conor','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_family_food_copying','Family-food copying','Family Food Copying',3,'They may want what is on your plate. Small, safely prepared versions of family food can make meals feel more shared.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use small, safely prepared versions of family food.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_more_all_done_routine','More and all done','More All Done Routine',4,'Simple words or gestures around meals give them a way to take part before they can say much.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'No purchase needed: repeat the same words or gestures.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_mealtime_clean_up_zone','Mealtime mats and cloths','Mealtime Clean Up Zone',5,'A wipeable mat, cloths and simple toddler cutlery can make self-feeding easier to live with.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,false,false,'Parent buy','Useful for parents, but not usually an exciting birthday gift.','Worth improving only if meals are becoming a daily battle.','Mealtime mats and cloths','conor','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_water_marks','Water marks outside','Water Marks',1,'A paintbrush and water on paving, cardboard or a tray lets them see a mark appear without much clean-up.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'A brush and water may be enough.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_big_paper_floor','Large paper pads','Big Paper Floor',2,'Big paper gives early marks somewhere to go. Tape it down and keep sessions short.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A useful add-on gift with chunky crayons.','Useful if you do not already have large paper or cardboard.','Large paper pads','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_tray_marks_food','Tray marks with food','Tray Marks Food',3,'At mealtimes, a little yoghurt or mash on the tray can become a first mark-making moment.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use yoghurt, mash or safe food already in the meal.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_chunky_crayons','Chunky crayons','Chunky Crayons',4,'Chunky crayons are easier to grip for early marks. Stay close, especially if everything still goes in the mouth.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A good gift when age-fit and paired with big paper.','Add chunky crayons only if mouthing is easing and supervision is realistic.','Chunky crayons','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_wipe_clean_marks','Wipe-clean boards and bath crayons','Wipe Clean Marks',5,'Wipe-clean surfaces or bath crayons can keep first marks contained if your toddler is ready for close-supervised mark-making.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A good gift if the parent is happy with supervised messy play.','Useful if mess is the barrier to trying marks.','Wipe-clean boards and bath crayons','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_action_songs_pauses','Pause-before-the-action songs','Action Songs Pauses',1,'Pause before the clap, stomp, wave or “again” moment. Give them time to join in rather than performing the song at them.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use songs you already sing, but leave more space for joining in.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_copy_me_games','Copy-me games','Copy Me Games',2,'You clap, they clap. You tap the table, they tap. It is simple, but it gives them a clear turn.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'No toy needed.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_roll_ball_turns','Roll-the-ball turns','Roll Ball Turns',3,'Roll a ball back and forth. Short turns, big smiles, no rules. This is often enough.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use any soft ball.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_tiny_music_basket','Simple shakers and first instruments','Tiny Music Basket',4,'One shaker, one tub or a small drum is enough. The aim is joining in, not a full noise collection.','for_your_child','product_category','things_that_can_help','Things that can help',1,true,true,true,'Good gift','A fun gift, best kept simple and not too loud.','Start with one shaker or a tub and spoon.','Simple shakers and first instruments','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_rhyme_time_purpose','Rhyme time with a purpose','Rhyme Time Purpose',5,'Use library rhyme time when you want new songs, faces and actions without inventing the entertainment yourself.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Useful when home feels stale, not because parents forgot groups exist.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_small_object_sweep','Small-object sweep','Small Object Sweep',1,'Get down low and look for coins, caps, older-child toys and anything that disappears into the mouth.','for_you','safety_check','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,'Use this as a quick room check, not a shopping prompt.',NULL,'conor','Save check','safety_no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_stairs_climbing_check','Stairs, sofas and climbable corners','Stairs Climbing Check',2,'The risk is not just walking. It is pulling, climbing, reaching and suddenly being taller than yesterday.','for_you','safety_check','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,'Check what has changed in reach before buying fixes.',NULL,'conor','Save check','safety_no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_blind_cords_trailing_wires','Blind cords and trailing wires','Blind Cords Trailing Wires',3,'Do a quick check of cords, cables and anything dangling near furniture.','for_you','safety_check','quick_checks','Quick checks',1,false,false,false,'Quick check',NULL,'Check cords and cables before adding products.',NULL,'conor','Save check','safety_no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_safe_cupboard','One safe cupboard','Safe Cupboard',4,'Give curiosity somewhere allowed to go. A cupboard with pans, tubs or cloths can reduce the battles elsewhere.','for_you','setup','useful_ideas','Useful ideas',1,false,false,false,'Setup',NULL,'Use an existing cupboard with safe pans, tubs or cloths.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_low_shelf_tidy','Low shelf tidy-up','Low Shelf Tidy',5,'Fewer things at toddler height can make the room easier to manage.','for_you','setup','useful_ideas','Useful ideas',1,false,false,false,'Setup',NULL,'Fewer visible choices may help more than more toys.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_tiny_choices','Tiny choices','Tiny Choices',1,'Two books, two snacks, two tops. Small choices can help them feel involved without giving away the whole day.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use two real options from the day.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_same_ending_phrase','Same ending phrase','Same Ending Phrase',2,'Use the same words when something finishes: bath done, shoes on, buggy time, bedtime. Repetition can make endings feel less sudden.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'No purchase needed.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_short_reconnects','Short reconnects','Short Reconnects',3,'After naps, nursery, childcare or a hard outing, two minutes on the floor with a book or cuddle can help you both reset.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'A book, cuddle or floor sit is enough.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_transition_basket','Small transition basket','Transition Basket',4,'A small basket with a familiar book or soft toy can help awkward gaps like after naps, before dinner or leaving the house.','for_you','product_category','things_that_can_help','Things that can help',1,true,false,false,'Parent buy','More of a parent helper than a birthday toy.','A small basket helps only if transitions are tricky.','Small transition basket','conor','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_all_done_cue','All done cue','All Done Cue',5,'Use the same word or gesture when an activity ends. It gives them a clue before the change happens.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'No purchase needed.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_walk_with_job','Walk with a job','Walk With Job',1,'Pick one job: find dogs, listen for buses, wave at lights, collect three leaves. Same outing, more for them to notice.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use a walk you already do.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_bath_cup_pouring','Bath-cup pouring','Bath Cup Pouring',2,'If the afternoon is going sideways, cups in the bath can buy a more settled few minutes while still giving real pouring and control practice.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use bath cups or safe plastic cups.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_three_object_tray','Three-object tray','Three Object Tray',3,'Put three safe objects on a tray: spoon, cup, cloth. Change one object tomorrow. It feels fresh without becoming a project.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Use three household-safe objects.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_out_and_about_kit','Out-and-about toy pouch','Out And About Kit',4,'A small pouch with a book, snack pot and one little object can help with cafés, queues and car-seat delays.','for_you','product_category','things_that_can_help','Things that can help',1,true,false,false,'Parent buy','Useful for parents, but choose only if they like practical gifts.','Useful only if trips out are getting fiddly.','Out-and-about toy pouch','conor','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_library_mat_stay_play','Library mat or stay-and-play','Library Mat Stay Play',5,'Not a revelation. Just useful when home feels stale and you want new songs, faces and objects without setting it all up yourself.','for_you','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,'Useful when you want a change of scene without setting it all up.',NULL,'conor','Save idea','no_shop_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_simple_posting_toys','Simple posting toys','Simple Posting Toys',6,'A simple posting toy can be useful if boxes and tubs are not holding attention. Look for large, chunky pieces and easy in-and-out play.','for_your_child','product_category','things_that_can_help','Things that can help',99,true,true,true,'Good gift','A good first-birthday gift if the family does not already have a posting toy.','Try a tissue box or tub first; buy only if a clearer challenge would help.','Simple posting toys','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_first_word_flap_books','First-word and lift-the-flap books','First Word Flap Books',6,'Sturdy first-word or lift-the-flap books give your toddler lots of chances to point, reveal, name and ask for more.','for_your_child','product_category','things_that_can_help','Things that can help',99,true,true,true,'Good gift','A strong gift choice for a child turning one.','If they already have sturdy board books, choose a different theme rather than more of the same.','First-word and lift-the-flap books','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_animal_books','Animal books','Animal Books',7,'Animal books give easy sounds to copy: woof, moo, baa, quack. They work well when words are still emerging but sounds and pointing are taking off.','for_your_child','product_category','things_that_can_help','Things that can help',99,true,true,true,'Good gift','A simple, safe-feeling gift that usually lands well around a first birthday.','Useful if current books do not already cover animals and sounds.','Animal books','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_simple_puppets','Simple puppets','Simple Puppets',8,'A simple puppet can make sounds, pauses and little turns feel more playful. Keep it soft, simple and easy for an adult to use with them.','for_your_child','product_category','things_that_can_help','Things that can help',99,true,true,true,'Good gift','A thoughtful gift if the parent enjoys interactive play.','Not needed if soft toys are already doing this job.','Simple puppets','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_soft_balls','Soft balls','Soft Balls',6,'A soft ball gives walking, crawling or cruising a purpose: roll it away, chase it, bring it back, do it again.','for_your_child','product_category','things_that_can_help','Things that can help',99,true,true,true,'Good gift','A safe-feeling, easy gift if it is soft and age-fit.','Use any soft ball already in the house before buying another.','Soft balls','both','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_toddler_cutlery','Toddler spoons and small forks','Toddler Cutlery',6,'Small toddler cutlery gives your child something easier to hold while they practise dipping, scooping and copying the family meal.','for_your_child','product_category','things_that_can_help','Things that can help',99,true,false,false,'Parent buy','Better as a practical parent buy than a friend gift.','Add only if current spoons are awkward or meals are becoming a battle.','Toddler spoons and small forks','conor','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_cupboard_locks_cable_tidy','Cupboard locks and cable tidies','Cupboard Locks Cable Tidy',6,'If curiosity has moved up a gear, cupboard locks or cable tidies may help with the few spots that are now genuinely reachable.','for_you','product_category','things_that_can_help','Things that can help',99,true,false,false,'Parent buy','Not a typical toy gift; useful for parents when the room has changed.','Check what is actually accessible before buying every safety product.','Cupboard locks and cable tidies','conor','See Ember Picks','product_actions'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_stair_gates','Stair gates','Stair Gates',7,'If stairs or doorways are newly in play, a properly fitted stair gate may be part of making the room work for this stage.','for_you','product_category','things_that_can_help','Things that can help',99,true,false,false,'Parent buy','Not a toy gift; a practical safety purchase.','Only relevant if the home setup now needs it.','Stair gates','conor','See Ember Picks','product_actions');

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
  v_rows_13_15m INTEGER;
  v_clusters_13_15m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_13_15m FROM tmp_discover_projection_stage WHERE age_band_id = '13-15m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_13_15m
  FROM tmp_discover_projection_stage WHERE age_band_id = '13-15m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('13-15m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 58)', v_rows_loaded;
  RAISE NOTICE '13-15m rows: % (expected 58), clusters: % (expected 10)', v_rows_13_15m, v_clusters_13_15m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 58 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_13_15m <> 58 THEN
    RAISE EXCEPTION 'Row count validation failed for 13-15m';
  END IF;
  IF v_clusters_13_15m <> 10 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 13-15m';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('13-15m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('13-15m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('13-15m');
