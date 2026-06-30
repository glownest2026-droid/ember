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
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_posting_boxes','Posting boxes and drop games','Posting Boxes',1,'Use a tissue box, tub or basket with chunky, safe objects. Dropping things in and pulling them out gives your toddler a satisfying little challenge without needing anything fancy.

Bring back out: stacking cups, blocks, soft balls, baskets, bath cups. Buy or borrow: simple posting toys, chunky peg puzzles, first shape puzzles. Hold off: tiny-piece puzzles, fiddly sorters, toys that do most of the work.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_two_block_towers','Two-block towers','Two Block Towers',2,'If you already have blocks, keep them out. The interesting bit now is copying you, trying two blocks, knocking them down and starting again.

Bring back out: stacking cups, blocks, soft balls, baskets, bath cups. Buy or borrow: simple posting toys, chunky peg puzzles, first shape puzzles. Hold off: tiny-piece puzzles, fiddly sorters, toys that do most of the work.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_hide_find_cups','Hide-and-find cups','Hide Find Cups',3,'Hide a small toy under a cup and let them find it. Keep it simple. The fun is in the reveal, the repeat and the little look of “again”.

Bring back out: stacking cups, blocks, soft balls, baskets, bath cups. Buy or borrow: simple posting toys, chunky peg puzzles, first shape puzzles. Hold off: tiny-piece puzzles, fiddly sorters, toys that do most of the work.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_tip_out_baskets','Tip-out baskets','Tip Out Baskets',4,'Give them one basket they are allowed to empty and refill. It scratches the “into everything” itch without sacrificing the real cupboards.

Bring back out: stacking cups, blocks, soft balls, baskets, bath cups. Buy or borrow: simple posting toys, chunky peg puzzles, first shape puzzles. Hold off: tiny-piece puzzles, fiddly sorters, toys that do most of the work.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_working_things_out','I’m working things out',1,true,'ent_need_13_15_working_things_out','I’m working things out','Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.','for_your_child','cat_shape_peg_puzzles','Simple shape and peg puzzles','Shape Peg Puzzles',5,'At this age, the value is not finishing the puzzle neatly. It is picking up a piece, turning it, trying it and noticing when it fits.

Bring back out: stacking cups, blocks, soft balls, baskets, bath cups. Buy or borrow: simple posting toys, chunky peg puzzles, first shape puzzles. Hold off: tiny-piece puzzles, fiddly sorters, toys that do most of the work.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_point_name_walks','Point-and-name walks','Point Name Walks',1,'Give a familiar walk a small job: point to dogs, listen for buses, wave at lights, find leaves. Same walk, more to notice.

Bring back out: board books, photo books, animal books, lift-the-flap books. Buy or borrow: sturdier interactive books if current ones feel too babyish or delicate. Hold off: toys that talk over you.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_books_with_pauses','Books with pauses','Books With Pauses',2,'Board books become more useful when you slow down. Pause before turning the page and wait for a point, sound, look or reach.

Bring back out: board books, photo books, animal books, lift-the-flap books. Buy or borrow: sturdier interactive books if current ones feel too babyish or delicate. Hold off: toys that talk over you.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_everyday_sound_games','Everyday sound games','Everyday Sound Games',3,'Woof, beep, uh-oh, bye-bye and “more” may feel small, but they are easy sounds to copy and use in real moments.

Bring back out: board books, photo books, animal books, lift-the-flap books. Buy or borrow: sturdier interactive books if current ones feel too babyish or delicate. Hold off: toys that talk over you.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_tiny_choice_moments','Tiny choice moments','Tiny Choice Moments',4,'Hold up two snacks, books or toys and wait. It gives your toddler a reason to point, reach, sound or choose.

Bring back out: board books, photo books, animal books, lift-the-flap books. Buy or borrow: sturdier interactive books if current ones feel too babyish or delicate. Hold off: toys that talk over you.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_telling_things','I’m telling you things',2,true,'ent_need_13_15_telling_things','I’m telling you things','Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.','for_your_child','cat_bring_me_games','Bring-me games','Bring Me Games',5,'“Bring me your shoes” or “Where’s the ball?” turns understanding into action. Keep it playful, not test-like.

Bring back out: board books, photo books, animal books, lift-the-flap books. Buy or borrow: sturdier interactive books if current ones feel too babyish or delicate. Hold off: toys that talk over you.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_real_object_baskets','Real-object baskets','Real Object Baskets',1,'A safe spoon, cup, brush, cloth and old purse can be more interesting than a toy set because they feel connected to the real day.

Bring back out: teddy, soft dolls, bowls, brushes, cloths, old bags, safe kitchen bits. Buy or borrow: simple care-play items if they are starting to feed or pat toys. Hold off: big pretend-play sets unless interest is clear.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_teddy_care_play','Feed teddy, wipe teddy, put teddy to bed','Teddy Care Play',2,'Tiny care routines let your toddler copy what they see every day. It is not full pretend play yet, but it is the start of it.

Bring back out: teddy, soft dolls, bowls, brushes, cloths, old bags, safe kitchen bits. Buy or borrow: simple care-play items if they are starting to feed or pat toys. Hold off: big pretend-play sets unless interest is clear.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_mini_jobs','Mini jobs beside you','Mini Jobs',3,'Passing a sock, stirring an empty bowl or wiping a tray gives them a way to join in without making the whole task harder.

Bring back out: teddy, soft dolls, bowls, brushes, cloths, old bags, safe kitchen bits. Buy or borrow: simple care-play items if they are starting to feed or pat toys. Hold off: big pretend-play sets unless interest is clear.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_yes_drawer','One yes drawer','Yes Drawer',4,'A low drawer or basket they can safely empty gives copying somewhere to go. It also reduces the number of things you have to keep saying no to.

Bring back out: teddy, soft dolls, bowls, brushes, cloths, old bags, safe kitchen bits. Buy or borrow: simple care-play items if they are starting to feed or pat toys. Hold off: big pretend-play sets unless interest is clear.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_day','I’m copying your day',3,true,'ent_need_13_15_copying_day','I’m copying your day','Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.','for_your_child','cat_kitchen_floor_setup','A kitchen-floor setup','Kitchen Floor Setup',5,'A bowl, spoon and cloth on the floor can keep them close while you cook, without handing over the actual cupboards.

Bring back out: teddy, soft dolls, bowls, brushes, cloths, old bags, safe kitchen bits. Buy or borrow: simple care-play items if they are starting to feed or pat toys. Hold off: big pretend-play sets unless interest is clear.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_carry_something_small','Carry something small','Carry Something Small',1,'A soft toy, little bag or chunky object gives walking a purpose. Carrying changes balance, so keep it short and supervised.

Bring back out: soft balls, sturdy boxes, push toys, low mats, safe cushions. Buy or borrow: pull-alongs, sturdy push toys, soft play shapes if there is a real movement gap. Hold off: structured shoes indoors unless they need shoes outside.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_roll_chase_games','Roll-and-chase games','Roll Chase Games',2,'Roll a ball a few feet away and let them go after it. It gives movement a reason without turning the room into an obstacle course.

Bring back out: soft balls, sturdy boxes, push toys, low mats, safe cushions. Buy or borrow: pull-alongs, sturdy push toys, soft play shapes if there is a real movement gap. Hold off: structured shoes indoors unless they need shoes outside.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_sofa_table_cruising','Sofa-to-table cruising','Sofa Table Cruising',3,'Place something interesting just out of reach between two safe supports. The aim is gentle movement, not rushing walking.

Bring back out: soft balls, sturdy boxes, push toys, low mats, safe cushions. Buy or borrow: pull-alongs, sturdy push toys, soft play shapes if there is a real movement gap. Hold off: structured shoes indoors unless they need shoes outside.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_low_cushion_routes','Low cushion routes','Low Cushion Routes',4,'A cushion, mat or low obstacle can make movement interesting when the house feels too familiar.

Bring back out: soft balls, sturdy boxes, push toys, low mats, safe cushions. Buy or borrow: pull-alongs, sturdy push toys, soft play shapes if there is a real movement gap. Hold off: structured shoes indoors unless they need shoes outside.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_braver_feet','I’m getting braver on my feet',4,true,'ent_need_13_15_braver_feet','I’m getting braver on my feet','Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.','for_your_child','cat_push_pull_play','Push and pull play','Push Pull Play',5,'If they enjoy moving things around, a sturdy push or pull toy can be useful. If they already use furniture, boxes and balls happily, you may not need to add much.

Bring back out: soft balls, sturdy boxes, push toys, low mats, safe cushions. Buy or borrow: pull-alongs, sturdy push toys, soft play shapes if there is a real movement gap. Hold off: structured shoes indoors unless they need shoes outside.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_spoon_practice','Spoon practice without the pressure','Spoon Practice',1,'Let them dip, scoop, miss and try again. A second spoon for you can keep the meal moving while they practise.

Bring back out: bibs, wipeable mats, small cups, toddler spoons, snack pots. Buy or borrow: better toddler cutlery or a more manageable mat if mealtimes are a daily battle. Hold off: novelty feeding gadgets unless they solve a real problem.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_open_cup','Open-cup sips','Open Cup',2,'A small amount of water in an open cup gives them a chance to practise control. Stay close and keep expectations low.

Bring back out: bibs, wipeable mats, small cups, toddler spoons, snack pots. Buy or borrow: better toddler cutlery or a more manageable mat if mealtimes are a daily battle. Hold off: novelty feeding gadgets unless they solve a real problem.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_family_food_copying','Family-food copying','Family Food Copying',3,'They may want what is on your plate. Small, safely prepared versions of family food can make meals feel more shared.

Bring back out: bibs, wipeable mats, small cups, toddler spoons, snack pots. Buy or borrow: better toddler cutlery or a more manageable mat if mealtimes are a daily battle. Hold off: novelty feeding gadgets unless they solve a real problem.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_more_all_done_routine','More and all done','More All Done Routine',4,'Simple words or gestures around meals give them a way to take part before they can say much.

Bring back out: bibs, wipeable mats, small cups, toddler spoons, snack pots. Buy or borrow: better toddler cutlery or a more manageable mat if mealtimes are a daily battle. Hold off: novelty feeding gadgets unless they solve a real problem.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_meals_charge','I’m taking charge at meals',5,true,'ent_need_13_15_meals_charge','I’m taking charge at meals','Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.','for_your_child','cat_mealtime_clean_up_zone','Clean-up within reach','Mealtime Clean Up Zone',5,'A wipeable mat, cloth and predictable place for messy practice can make independence less annoying for the adult.

Bring back out: bibs, wipeable mats, small cups, toddler spoons, snack pots. Buy or borrow: better toddler cutlery or a more manageable mat if mealtimes are a daily battle. Hold off: novelty feeding gadgets unless they solve a real problem.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_water_marks','Water marks outside','Water Marks',1,'A paintbrush and water on paving, cardboard or a tray lets them see a mark appear without much clean-up.

Bring back out: big paper, cardboard, brushes, wipe-clean boards. Buy or borrow: chunky crayons or bath crayons if mouthing is easing and you can supervise closely. Hold off: pens, small chalks or anything that feels hard to supervise.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_big_paper_floor','Big paper on the floor','Big Paper Floor',2,'Tape paper down and use chunky crayons. The point is the movement and surprise, not making a picture.

Bring back out: big paper, cardboard, brushes, wipe-clean boards. Buy or borrow: chunky crayons or bath crayons if mouthing is easing and you can supervise closely. Hold off: pens, small chalks or anything that feels hard to supervise.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_tray_marks_food','Tray marks with food','Tray Marks Food',3,'At mealtimes, a little yoghurt or mash on the tray can become a first mark-making moment.

Bring back out: big paper, cardboard, brushes, wipe-clean boards. Buy or borrow: chunky crayons or bath crayons if mouthing is easing and you can supervise closely. Hold off: pens, small chalks or anything that feels hard to supervise.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_chunky_crayons','Short crayon moments','Chunky Crayons',4,'A few minutes is enough. Stay close, especially if everything still goes in the mouth.

Bring back out: big paper, cardboard, brushes, wipe-clean boards. Buy or borrow: chunky crayons or bath crayons if mouthing is easing and you can supervise closely. Hold off: pens, small chalks or anything that feels hard to supervise.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_need_13_15_first_marks','I’m making my first marks','This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.','for_your_child','cat_wipe_clean_marks','Wipe-clean marks','Wipe Clean Marks',5,'Bath crayons or a wipe-clean board can keep the mess contained if your child is ready.

Bring back out: big paper, cardboard, brushes, wipe-clean boards. Buy or borrow: chunky crayons or bath crayons if mouthing is easing and you can supervise closely. Hold off: pens, small chalks or anything that feels hard to supervise.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_action_songs_pauses','Pause-before-the-action songs','Action Songs Pauses',1,'Pause before the clap, stomp, wave or “again” moment. Give them time to join in rather than performing the song at them.

Bring back out: shakers, tubs, spoons, soft balls, favourite song books. Buy or borrow: simple instruments if they enjoy rhythm. Hold off: large noisy sets that make the adult regret everything by 8am.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_copy_me_games','Copy-me games','Copy Me Games',2,'You clap, they clap. You tap the table, they tap. It is simple, but it gives them a clear turn.

Bring back out: shakers, tubs, spoons, soft balls, favourite song books. Buy or borrow: simple instruments if they enjoy rhythm. Hold off: large noisy sets that make the adult regret everything by 8am.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_roll_ball_turns','Roll-the-ball turns','Roll Ball Turns',3,'Roll a ball back and forth. Short turns, big smiles, no rules. This is often enough.

Bring back out: shakers, tubs, spoons, soft balls, favourite song books. Buy or borrow: simple instruments if they enjoy rhythm. Hold off: large noisy sets that make the adult regret everything by 8am.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_tiny_music_basket','Tiny music basket','Tiny Music Basket',4,'One shaker, one tub, one wooden spoon. Enough for rhythm without turning the house into a drum kit.

Bring back out: shakers, tubs, spoons, soft balls, favourite song books. Buy or borrow: simple instruments if they enjoy rhythm. Hold off: large noisy sets that make the adult regret everything by 8am.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m joining in properly now',7,true,'ent_need_13_15_joining_in','I’m joining in properly now','You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.','for_your_child','cat_rhyme_time_purpose','Rhyme time with a purpose','Rhyme Time Purpose',5,'Use library rhyme time when you want new songs, faces and actions without inventing the entertainment yourself.

Bring back out: shakers, tubs, spoons, soft balls, favourite song books. Buy or borrow: simple instruments if they enjoy rhythm. Hold off: large noisy sets that make the adult regret everything by 8am.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_small_object_sweep','Small-object sweep','Small Object Sweep',1,'Get down low and look for coins, caps, older-child toys and anything that disappears into the mouth.

Bring back out: cupboard locks, stair gates, corner guards, cable tidies if already owned. Buy or borrow: safety fixes only where the room has changed or your child can now reach more. Hold off: buying every safety product before checking the room.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_stairs_climbing_check','Stairs, sofas and climbable corners','Stairs Climbing Check',2,'The risk is not just walking. It is pulling, climbing, reaching and suddenly being taller than yesterday.

Bring back out: cupboard locks, stair gates, corner guards, cable tidies if already owned. Buy or borrow: safety fixes only where the room has changed or your child can now reach more. Hold off: buying every safety product before checking the room.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_blind_cords_trailing_wires','Blind cords and trailing wires','Blind Cords Trailing Wires',3,'Do a quick check of cords, cables and anything dangling near furniture.

Bring back out: cupboard locks, stair gates, corner guards, cable tidies if already owned. Buy or borrow: safety fixes only where the room has changed or your child can now reach more. Hold off: buying every safety product before checking the room.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_safe_cupboard','One safe cupboard','Safe Cupboard',4,'Give curiosity somewhere allowed to go. A cupboard with pans, tubs or cloths can reduce the battles elsewhere.

Bring back out: cupboard locks, stair gates, corner guards, cable tidies if already owned. Buy or borrow: safety fixes only where the room has changed or your child can now reach more. Hold off: buying every safety product before checking the room.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_suddenly_everything','I’m suddenly into everything',8,true,'ent_job_13_15_suddenly_everything','I’m suddenly into everything','Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.','for_you','cat_low_shelf_tidy','Low shelf tidy-up','Low Shelf Tidy',5,'Fewer things at toddler height can make the room easier to manage.

Bring back out: cupboard locks, stair gates, corner guards, cable tidies if already owned. Buy or borrow: safety fixes only where the room has changed or your child can now reach more. Hold off: buying every safety product before checking the room.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_tiny_choices','Tiny choices','Tiny Choices',1,'Two books, two snacks, two tops. Small choices can help them feel involved without giving away the whole day.

Bring back out: favourite books, comforters, soft toys, simple baskets, familiar songs. Buy or borrow: nothing automatically. This one is mostly about rhythm and repetition. Hold off: turning every tricky moment into a purchase.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_same_ending_phrase','Same ending phrase','Same Ending Phrase',2,'Use the same words when something finishes: bath done, shoes on, buggy time, bedtime. Repetition can make endings feel less sudden.

Bring back out: favourite books, comforters, soft toys, simple baskets, familiar songs. Buy or borrow: nothing automatically. This one is mostly about rhythm and repetition. Hold off: turning every tricky moment into a purchase.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_short_reconnects','Short reconnects','Short Reconnects',3,'After naps, nursery, childcare or a hard outing, two minutes on the floor with a book or cuddle can help you both reset.

Bring back out: favourite books, comforters, soft toys, simple baskets, familiar songs. Buy or borrow: nothing automatically. This one is mostly about rhythm and repetition. Hold off: turning every tricky moment into a purchase.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_transition_basket','Transition basket','Transition Basket',4,'Keep one or two familiar things for awkward gaps: after nap, before dinner, when leaving the house.

Bring back out: favourite books, comforters, soft toys, simple baskets, familiar songs. Buy or borrow: nothing automatically. This one is mostly about rhythm and repetition. Hold off: turning every tricky moment into a purchase.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_between_baby_toddler','I’m between baby and toddler',9,true,'ent_job_13_15_between_baby_toddler','I’m between baby and toddler','This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.','for_you','cat_all_done_cue','All done cue','All Done Cue',5,'Use the same word or gesture when an activity ends. It gives them a clue before the change happens.

Bring back out: favourite books, comforters, soft toys, simple baskets, familiar songs. Buy or borrow: nothing automatically. This one is mostly about rhythm and repetition. Hold off: turning every tricky moment into a purchase.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_walk_with_job','Walk with a job','Walk With Job',1,'Pick one job: find dogs, listen for buses, wave at lights, collect three leaves. Same outing, more for them to notice.

Bring back out: forgotten toys, bath cups, small books, snack pots, soft balls. Buy or borrow: a small out-and-about pouch or rotating toy bag if leaving the house is getting fiddly. Hold off: big new toys when what you need is probably novelty.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_bath_cup_pouring','Bath-cup pouring','Bath Cup Pouring',2,'If the afternoon is going sideways, cups in the bath can buy a more settled few minutes while still giving real pouring and control practice.

Bring back out: forgotten toys, bath cups, small books, snack pots, soft balls. Buy or borrow: a small out-and-about pouch or rotating toy bag if leaving the house is getting fiddly. Hold off: big new toys when what you need is probably novelty.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_three_object_tray','Three-object tray','Three Object Tray',3,'Put three safe objects on a tray: spoon, cup, cloth. Change one object tomorrow. It feels fresh without becoming a project.

Bring back out: forgotten toys, bath cups, small books, snack pots, soft balls. Buy or borrow: a small out-and-about pouch or rotating toy bag if leaving the house is getting fiddly. Hold off: big new toys when what you need is probably novelty.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_out_and_about_kit','Small out-and-about kit','Out And About Kit',4,'One book, one snack pot, one small object for pointing or naming. Useful for cafés, queues and car-seat delays.

Bring back out: forgotten toys, bath cups, small books, snack pots, soft balls. Buy or borrow: a small out-and-about pouch or rotating toy bag if leaving the house is getting fiddly. Hold off: big new toys when what you need is probably novelty.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_change_scene','I’m ready for a change of scene',10,true,'ent_job_13_15_change_scene','I’m ready for a change of scene','The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.','for_you','cat_library_mat_stay_play','Library mat or stay-and-play','Library Mat Stay Play',5,'Not a revelation. Just useful when home feels stale and you want new songs, faces and objects without setting it all up yourself.

Bring back out: forgotten toys, bath cups, small books, snack pots, soft balls. Buy or borrow: a small out-and-about pouch or rotating toy bag if leaving the house is getting fiddly. Hold off: big new toys when what you need is probably novelty.','for_you');

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

  RAISE NOTICE 'Discover projection rows loaded: % (expected 50)', v_rows_loaded;
  RAISE NOTICE '13-15m rows: % (expected 50), clusters: % (expected 10)', v_rows_13_15m, v_clusters_13_15m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 50 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_13_15m <> 50 THEN
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
