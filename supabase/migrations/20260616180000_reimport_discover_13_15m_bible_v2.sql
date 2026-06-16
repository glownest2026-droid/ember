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
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_your_child','cat_safe_floor_space','A clear floor space','A clear floor space',1,'Your toddler may suddenly cross the room, crawl faster or pull up where you did not expect it. A clear patch of floor gives them space to move, fall softly, recover and try again, while you reduce obvious trip hazards and sharp edges nearby.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_your_child','cat_13_15_cruising_furniture','Steady cruising surfaces','Steady cruising surfaces',2,'Low, stable surfaces give a new mover something to lean on, cruise along and practise balance. The aim is not to force walking, but to make everyday standing safer and easier to supervise, especially as they start using furniture to explore.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_your_child','cat_13_15_push_pull_toys','Sturdy push-and-pull toys','Sturdy push-and-pull toys',3,'A stable push toy or pull-along can give your toddler a reason to move, stop, turn and try again. It is best treated as playful practice for children already showing readiness, not as a shortcut to walking or a seated walker substitute.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_your_child','cat_soft_graspable_balls','Soft balls to roll and chase','Soft balls to roll and chase',4,'A soft ball gives your toddler a clear reason to move: roll it away, crawl after it, bring it back or copy your throw. The game can stretch balance, coordination and shared attention while staying simple, cheap and easy to repeat indoors or outside.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_move','I’m off and moving',1,true,'ent_cluster_move','First steps and safe movement','Your toddler may be cruising, taking wobbly steps or trying to climb anything nearby. This cluster turns that burst of movement into safer practice, with steady surfaces, simple movement games and home checks that make exploring feel exciting without leaving you constantly on edge.','for_your_child','cat_13_15_park_swing_walks','Park walks and toddler swings','Park walks and toddler swings',5,'A short walk or closely supervised swing can reset both of you. Your toddler gets movement, changing sights and things to point at, while you get easy naming moments: dog, bus, tree, swing. It is useful because it combines movement, language and a change of scene.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_stacking_nesting_cups','Stacking and nesting cups','Stacking and nesting cups',1,'Cups can be stacked, nested, filled, tipped, posted into, hidden under and used in the bath. That flexibility makes them especially strong at this stage, when toddlers enjoy repeating the same little experiment and watching what changes each time.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_13_15_posting_coin_box','Posting boxes and coin slots','Posting boxes and coin slots',2,'Posting a chunky coin or shape into a slot gives your toddler a clear challenge: hold, aim, release, then try again. It builds finger control and persistence, and the satisfying drop can make the practice feel like play rather than a task.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_object_permanence_box','Hide-and-find boxes','Hide-and-find boxes',3,'When a ball or toy vanishes into a box and comes back, your toddler gets a tiny mystery to solve. These hide-and-find moments support attention, memory and cause-and-effect, especially when you keep the game slow enough for them to watch and join in.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_13_15_shape_peg_puzzles','Chunky shape and peg puzzles','Chunky shape and peg puzzles',4,'A chunky puzzle does not need to be completed perfectly to be valuable. Picking up a piece, turning it, testing where it fits and trying again gives your toddler useful practice with focus, hand control and early spatial thinking.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_hands','I’m posting, stacking and finding out',2,true,'ent_cluster_hands','Posting, stacking and little experiments','At this stage, dropping, posting, stacking and taking things apart can become wonderfully absorbing. Your toddler is not making a mess for no reason. They are testing how objects move, fit, disappear and come back, while building hand control, focus and early problem-solving.','for_your_child','cat_13_15_tower_blocks','First tower blocks','First tower blocks',5,'Stacking two blocks, knocking them down and starting again is a neat little experiment. Your toddler practises hand control, cause-and-effect and anticipation, while also learning that repeating the same action can produce a predictable result.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_board_books','Board books and face books','Board books and face books',1,'A sturdy board book gives your toddler something to hold, turn, point at and hear named again and again. If they grab the book or chew the corner, the moment can still count: short, repeatable pages are often more realistic than a perfect storytime.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_13_15_picture_word_cards','Picture and word cards','Picture and word cards',2,'Simple picture cards, family photos or object cards can make naming feel concrete. Your toddler can point, look back at you, hand one over or wait for the word, giving you an easy way to turn everyday vocabulary into a shared moment.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_13_15_gesture_sign_games','First gestures and simple signs','First gestures and simple signs',3,'Pointing, waving, arms up, more and all gone can reduce guesswork when words are still emerging. Repeating gestures during real routines helps your toddler see that their signals make something happen, which can build confidence and connection.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_words','I’m telling you things',3,true,'ent_cluster_words','Pointing, words and little chats','Your toddler may point, look back at you, try a new word or bring you something familiar. These small exchanges are the start of real communication. Books, songs, gestures and naming games give you easy ways to respond and stretch the moment without making it feel like a lesson.','for_your_child','cat_13_15_pretend_phone_talk','Pretend phone and object talk','Pretend phone and object talk',4,'A toy phone, cup, brush or spoon can become a little language prompt when your toddler copies what you do. Naming the object, acting it out and waiting for their sound or gesture builds understanding, imitation and a playful reason to communicate.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_safe_household_objects','Safe everyday-object play','Safe everyday-object play',1,'A clean tub, wooden spoon, shoe, soft cloth or empty box can be just as interesting as a toy when it is safe and supervised. Everyday objects help your toddler practise choosing, copying, carrying and using things with purpose, while keeping play grounded in real life.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_doll_soft_toy_care','Dolls and soft-toy care','Dolls and soft-toy care',2,'A soft toy or doll can become part of simple care play: hugging, patting, feeding, putting to bed or handing over. These are small social moments, but they help your toddler copy familiar routines and practise early affection and empathy.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_toy_cups_spoons','Toy cups, spoons and plates','Toy cups, spoons and plates',3,'Pretending to drink from a cup or feed a soft toy is simple, but it links real routines with play. Your toddler can copy you, practise object use and turn familiar mealtime objects into early pretend moments, without needing a full play kitchen.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_cleanup_basket','Clean-up basket games','Clean-up basket games',4,'Putting socks in a basket or toys into a box can become a little game. It gives your toddler a useful job, a clear target and a satisfying finish, while also turning cleanup into language, cooperation and movement practice.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_copying_everyday','I’m copying the everyday',4,true,'ent_cluster_copying_everyday','Copying everyday life','Phones, cups, shoes, brushes and soft toys can suddenly become fascinating because your toddler is watching what people do. Copying these little routines helps them connect objects with meaning, practise social understanding and join family life through simple, repeatable pretend moments.','for_your_child','cat_13_15_pretend_shoes_brushes','Shoes, brushes and getting-ready play','Shoes, brushes and getting-ready play',5,'Shoes, hats and brushes are everyday objects with obvious meaning. Your toddler may fetch a shoe, hold out a foot or copy brushing, turning the getting-ready rush into a short naming and imitation opportunity when you have the patience for it.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_your_child','cat_highchair','A supportive highchair','A supportive highchair',1,'At 13-15 months, meals can be busy, messy and hands-on. A stable highchair or feeding seat keeps your toddler upright while they practise finger foods, cup use and spoon attempts, giving you a safer, calmer place to supervise and clean up.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_your_child','cat_open_cup','An open or free-flow cup','An open or free-flow cup',2,'A small cup with a little water or milk gives your toddler a real skill to practise. There will be spills, chewing and tipping, but holding, lifting and trying again helps coordination and independence during normal meals.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_your_child','cat_first_spoons_bowls','Toddler spoons and bowls','Toddler spoons and bowls',3,'Trying a spoon can be slow, messy and very imperfect, but it gives your toddler a way to join in. Small spoons, stable bowls and relaxed expectations make self-feeding easier to practise without turning every mouthful into a power struggle.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_your_child','cat_weaning_bibs_mat','Bibs and splash mats','Bibs and splash mats',4,'A bib or floor mat will not teach eating, but it can make practice feel less stressful. When cleanup is easier, parents are more likely to let toddlers touch, grip, spill, scoop and try again, which is exactly how self-feeding improves.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_feeding','I’m feeding myself',5,true,'ent_cluster_feeding','Messy meals and self-feeding','Mealtimes may now involve finger foods, cup spills, spoon attempts and a strong wish to do it themselves. This cluster helps parents set up safe, manageable practice: steady seating, simple cups, easy-clean gear and food choices that support independence without turning every meal into a battle.','for_your_child','cat_13_15_snack_prep_pots','Snack pots and safe food prep','Snack pots and safe food prep',5,'Toddlers may need two healthy snacks as well as meals. Small snack pots, simple prep and safe shapes can help days out, nursery handovers and hungry moments feel easier, while still keeping salt, sugar and choking risks in view.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_cluster_first_marks','First scribbles and mark-making','Your toddler may start making accidental lines, dots and smudges before anything looks like a drawing. Big paper, chunky crayons and mess-safe water play turn those marks into practice for grip, arm control and attention, while keeping the activity simple enough to stop before it becomes chaos.','for_your_child','cat_13_15_chunky_crayons','Chunky crayons','Chunky crayons',1,'A chunky crayon lets your toddler press, swipe and see that their hand can change the page. At this age the mark matters more than the picture. Keep it short, supervised and washable so the moment stays about exploration, not performance.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_cluster_first_marks','First scribbles and mark-making','Your toddler may start making accidental lines, dots and smudges before anything looks like a drawing. Big paper, chunky crayons and mess-safe water play turn those marks into practice for grip, arm control and attention, while keeping the activity simple enough to stop before it becomes chaos.','for_your_child','cat_13_15_big_paper_scribbles','Big paper scribble space','Big paper scribble space',2,'A large sheet on the floor or table gives wobbly arms somewhere forgiving to move. Your toddler can tap, sweep and scribble without needing precision, which helps early control while making clean-up and supervision easier for you.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_cluster_first_marks','First scribbles and mark-making','Your toddler may start making accidental lines, dots and smudges before anything looks like a drawing. Big paper, chunky crayons and mess-safe water play turn those marks into practice for grip, arm control and attention, while keeping the activity simple enough to stop before it becomes chaos.','for_your_child','cat_13_15_water_painting','Water painting and brush play','Water painting and brush play',3,'A brush, water and a safe surface can make mark-making feel magical without adding much clean-up. Dipping, brushing and watching marks appear helps your toddler practise grip, cause and effect and concentration in a low-pressure way.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_first_marks','I’m making my first marks',6,true,'ent_cluster_first_marks','First scribbles and mark-making','Your toddler may start making accidental lines, dots and smudges before anything looks like a drawing. Big paper, chunky crayons and mess-safe water play turn those marks into practice for grip, arm control and attention, while keeping the activity simple enough to stop before it becomes chaos.','for_your_child','cat_13_15_mess_safe_mark_making_setup','Mess-safe mark-making setup','Mess-safe mark-making setup',4,'A washable mat, bib or wipe-clean setup gives you permission to say yes to early marks more often. The point is not neat art; it is making space for safe, supervised exploring with hands, tools and simple materials.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m clapping, singing and joining in',7,true,'ent_cluster_joining_in','Clapping, singing and joining in','Your toddler may copy a clap, wait for a pause in a rhyme or light up when a song repeats. These playful little loops help them practise listening, anticipation, movement and early turn-taking, while giving you an easy way to connect without needing a big activity.','for_your_child','cat_songs_action_games','Songs and action games','Songs and action games',1,'Action songs give your toddler a predictable pattern: listen, watch, clap, wave, pause and try a sound. Wheels on the Bus, pat-a-cake or a clean-up song can turn communication into a back-and-forth game without needing any new kit.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m clapping, singing and joining in',7,true,'ent_cluster_joining_in','Clapping, singing and joining in','Your toddler may copy a clap, wait for a pause in a rhyme or light up when a song repeats. These playful little loops help them practise listening, anticipation, movement and early turn-taking, while giving you an easy way to connect without needing a big activity.','for_your_child','cat_13_15_copy_me_clapping','Copy-me clapping games','Copy-me clapping games',2,'Simple clapping, waving and tapping games give your toddler a clear action to copy and repeat. They can watch you, try it themselves, laugh when it works and slowly learn the rhythm of taking turns with another person.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m clapping, singing and joining in',7,true,'ent_cluster_joining_in','Clapping, singing and joining in','Your toddler may copy a clap, wait for a pause in a rhyme or light up when a song repeats. These playful little loops help them practise listening, anticipation, movement and early turn-taking, while giving you an easy way to connect without needing a big activity.','for_your_child','cat_13_15_simple_music_makers','Simple music makers','Simple music makers',3,'Shakers, drums or safe noisy objects let your toddler experiment with sound while they move. The value is in noticing cause and effect, copying a beat and joining in with you, not playing music neatly.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_joining_in','I’m clapping, singing and joining in',7,true,'ent_cluster_joining_in','Clapping, singing and joining in','Your toddler may copy a clap, wait for a pause in a rhyme or light up when a song repeats. These playful little loops help them practise listening, anticipation, movement and early turn-taking, while giving you an easy way to connect without needing a big activity.','for_your_child','cat_13_15_pause_wait_rhymes','Pause-and-wait rhymes','Pause-and-wait rhymes',4,'Stopping just before the familiar word or action gives your toddler a tiny chance to join in. They might point, bounce, clap or make a sound. That pause helps turn songs into shared communication rather than background noise.','for_your_child'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','Keep curious hands safer',8,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_safety_gates','Safety gates','Safety gates',1,'Stairs can become fascinating as soon as crawling, cruising or climbing feels possible. Safety gates help keep the biggest risk areas contained, giving your toddler safer places to practise movement while you stay close and supervise.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','Keep curious hands safer',8,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_cupboard_locks','Cupboard locks','Cupboard locks',2,'Opening cupboards can become a favourite experiment. Locks and safer storage keep medicines, chemicals and cleaning products out of reach, so your toddler can keep exploring lower-risk objects while the dangerous things stay unavailable.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','Keep curious hands safer',8,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_13_15_furniture_anchors','Furniture anchors and corner checks','Furniture anchors and corner checks',3,'Pulling up often happens on whatever is closest: shelves, drawers, side tables or the sofa. Anchoring unstable furniture and checking hard corners helps prepare the room for a child who is stronger, taller and far less predictable than last month.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','Keep curious hands safer',8,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_button_battery_check','Button battery checks','Button battery checks',4,'Button batteries can look like tiny interesting objects, and toddlers are still likely to mouth what they find. A household sweep of remotes, thermometers, cards and toys helps remove one of the most serious hidden risks from everyday rooms.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_safety','Keep curious hands safer',8,true,'ent_cluster_safety','Home safety for curious climbers','More movement means more reach, more opening, more climbing and more surprises. This cluster is for the parent job around the child’s development: gates, locks, cords, batteries, furniture and toy checks. It helps your toddler explore a bigger world while the riskiest hazards stay out of reach.','for_you','cat_13_15_car_seat_size_check','Car-seat size and direction check','Car-seat size and direction check',5,'Around this band, parents may wonder whether to turn a car seat forward. UK rules require height-based seats to stay rear-facing until over 15 months, and fit still depends on the child and seat limits. This is a check moment, not a hurry-up moment.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',9,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_you','cat_13_15_bedtime_board_books','Bedtime board books','Bedtime board books',1,'A short bedtime book can give your toddler a repeated cue: pyjamas, teeth, book, cuddle, sleep. The story matters less than the rhythm. Familiar pages help language, comfort and routine without needing a long, perfect read every night.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',9,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_you','cat_13_15_toothbrush_toothpaste','Toddler toothbrush and toothpaste','Toddler toothbrush and toothpaste',2,'A small toothbrush and age-appropriate fluoride toothpaste support a routine that starts before toddlers can do it themselves. The parent still brushes, but songs, mirrors or a familiar order can make the twice-daily habit less of a battle.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',9,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_you','cat_13_15_comfort_toy','A safe comfort object','A safe comfort object',3,'A favourite soft toy or comforter can help some toddlers reconnect during separation, travel or bedtime. It can also become part of simple care play, giving your child a familiar thing to hug, find and include in routines.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',9,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_you','cat_feelings_faces_books','Baby faces and feelings books','Baby faces and feelings books',4,'A faces or feelings book gives you a gentle way to name happy, sad, cross or tired when the moment is calm. Your toddler will not manage feelings neatly yet, but repeated words and expressions can help them begin to connect faces, sounds and comfort.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_routines_feelings','Help me settle and reconnect',9,true,'ent_cluster_routines_feelings','Bedtime, teeth and big feelings','A one-year-old can be affectionate, frustrated, clingy and determined, sometimes all in the same hour. Familiar routines, bedtime books, comfort objects, toothbrushing and simple feeling words give parents steady anchors, helping daily care feel more predictable while your toddler practises connection and control.','for_you','cat_13_15_routine_songs','Routine songs and transition cues','Routine songs and transition cues',5,'A clean-up song, toothbrushing song or goodbye wave can soften the small transitions that often trigger frustration. The repetition helps your toddler know what comes next, while giving you a low-effort way to guide behaviour without lengthy explanations.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',10,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_you','cat_13_15_pram_walks','Pram walks and naming games','Pram walks and naming games',1,'A walk can become more than fresh air when you follow what your toddler notices. Naming the bus, dog, leaf or bin lorry turns ordinary movement into shared attention and language practice, with no extra setup and no pressure to entertain perfectly.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',10,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_you','cat_13_15_library_baby_group','Library mats and baby groups','Library mats and baby groups',2,'A library session or baby group gives your toddler new sounds, faces, songs and books to explore, while giving you a gentle reset. The value is not a packed schedule, just a fresh social and language moment outside the house.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',10,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_you','cat_13_15_bubbles','Bubbles','Bubbles',3,'Bubbles float, pop, disappear and come back, which makes them perfect for short attention spans. Your toddler can watch, point, reach, chase and laugh, while you add simple words like pop, more, high and gone.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',10,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_you','cat_13_15_bath_cups','Bath cups and pouring games','Bath cups and pouring games',4,'Pouring water between cups gives toddlers a clear full-empty experiment. They can scoop, tip, splash and watch what happens, while you keep the activity contained. It is simple and engaging, but water always needs close adult attention.','for_you'),
  ('13-15m','13–15 months',13,15,true,'ent_cluster_days','Give us a good little moment',10,true,'ent_cluster_days','Good little outings and resets','Some days need a small reset more than another toy. A walk, library mat, park swing, bubbles, music or bath cups can give your toddler new things to point at, move towards, name and explore. These ideas keep the day moving without making parents feel they need to perform.','for_you','cat_treasure_basket','A rotating safe treasure basket','A rotating safe treasure basket',5,'A small basket of safe, ordinary objects can make the room feel new without buying more. Swapping a few items gives your toddler choices, textures and sounds to explore, while helping you avoid turning every restless afternoon into a shopping list.','for_you');

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

  RAISE NOTICE 'Discover projection rows loaded: % (expected 47)', v_rows_loaded;
  RAISE NOTICE '13-15m rows: % (expected 47), clusters: % (expected 10)', v_rows_13_15m, v_clusters_13_15m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 47 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_13_15m <> 47 THEN
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
