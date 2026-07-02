-- Discover pilot import: age bands 31–33 months
-- Source: discover_projection tab from Ember ABI workbooks (31-33m)
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
  ('31-33m','31–33 months',31,33,true,'ent_cluster_asking_what_happens_next','I’m asking what happens next',1,true,'ent_need_31_33_sequences_problem_solving','I’m asking what happens next','Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.','for_your_child','cat_pause_before_the_next_page','Pause before the next page','Pause Before The Next Page',1,'When reading, pause before you turn the page or finish a repeated phrase. Your toddler may fill in a word, point to the next picture or simply enjoy being part of the rhythm.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_asking_what_happens_next','I’m asking what happens next',1,true,'ent_need_31_33_sequences_problem_solving','I’m asking what happens next','Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.','for_your_child','cat_ask_who_what_and_where','Ask who, what and where','Ask Who What And Where',2,'Use simple who, what and where questions with books, meals and trips out. Keep it light and answer for them when needed, so language stays warm rather than becoming a quiz.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_asking_what_happens_next','I’m asking what happens next',1,true,'ent_need_31_33_sequences_problem_solving','I’m asking what happens next','Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.','for_your_child','cat_keep_the_answer_easy_to_find','Keep the answer easy to find','Keep The Answer Easy To Find',3,'If a puzzle, book or matching game is too hard, reduce the choices. Two or three options are often enough for this age and can stop a good idea becoming a battle.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_asking_what_happens_next','I’m asking what happens next',1,true,'ent_need_31_33_sequences_problem_solving','I’m asking what happens next','Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.','for_your_child','cat_picture_books_with_little_stories','Picture books with little stories','Picture Books With Little Stories',4,'Books with a clear little scene give your toddler chances to name, predict and retell. If they already have lots of books, look for simple plots, familiar routines and pages that invite pauses.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Picture books with little stories','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_asking_what_happens_next','I’m asking what happens next',1,true,'ent_need_31_33_sequences_problem_solving','I’m asking what happens next','Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.','for_your_child','cat_little_question_prompts','Little question prompts','Little Question Prompts',5,'Prompt cards or picture scenes can help adults start a conversation when energy is low. They are most useful when used gently, for choosing, naming and noticing, not as flashcards.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Little question prompts','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_asking_what_happens_next','I’m asking what happens next',1,true,'ent_need_31_33_sequences_problem_solving','I’m asking what happens next','Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.','for_your_child','cat_simple_memory_pairs','Simple memory pairs','Simple Memory Pairs',6,'A small memory or matching game can support turn-taking, recall and attention. Choose chunky, clear pictures and keep the number of pairs low at first.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Simple memory pairs','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_asking_what_happens_next','I’m asking what happens next',1,true,'ent_need_31_33_sequences_problem_solving','I’m asking what happens next','Around this age, your toddler may be asking, predicting and testing what comes next: in a story, a routine, a puzzle or a game. The useful ideas are not about formal learning. They are about giving curiosity a simple next step.','for_your_child','cat_picture_routine_cards_and_timers','Picture routine cards and timers','Picture Routine Cards And Timers',7,'Visual routine cards or a simple countdown timer can help toddlers see what is coming next. They are especially useful for transitions, not for adding more rules to the day.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Picture routine cards and timers','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_telling_my_version','I’m telling you my version',2,true,'ent_need_31_33_language_retelling_feelings','I’m telling you my version','Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.','for_your_child','cat_retell_one_tiny_bit_of_the_day','Retell one tiny bit of the day','Retell One Tiny Bit Of The Day',1,'At bedtime or mealtime, retell one moment from the day and leave space for your toddler to add a word, sound or correction. Their version does not need to be accurate to be useful.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_telling_my_version','I’m telling you my version',2,true,'ent_need_31_33_language_retelling_feelings','I’m telling you my version','Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.','for_your_child','cat_add_one_word_to_what_they_say','Add one word to what they say','Add One Word To What They Say',2,'If your toddler says ''car go'', you might say ''red car go'' or ''car goes fast''. Small expansions give them a model without turning conversation into a lesson.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_telling_my_version','I’m telling you my version',2,true,'ent_need_31_33_language_retelling_feelings','I’m telling you my version','Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.','for_your_child','cat_keep_screens_from_crowding_out_talk','Keep screens from crowding out talk','Keep Screens From Crowding Out Talk',3,'If screens are part of the day, keep them bounded and make sure there is still space for songs, books, chatter and pretend play. The useful language practice usually comes from back-and-forth with people.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_telling_my_version','I’m telling you my version',2,true,'ent_need_31_33_language_retelling_feelings','I’m telling you my version','Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.','for_your_child','cat_feeling_faces_and_story_books','Feeling faces and story books','Feeling Faces And Story Books',4,'Books or cards about faces and feelings can help toddlers name what is happening inside and around them. They are useful for frustration, waiting, sharing and care.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Feeling faces and story books','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_telling_my_version','I’m telling you my version',2,true,'ent_need_31_33_language_retelling_feelings','I’m telling you my version','Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.','for_your_child','cat_songs_with_actions_and_silly_sounds','Songs with actions and silly sounds','Songs With Actions And Silly Sounds',5,'Songs with actions, repeated lines and silly sounds give your toddler another way to join in. If you already know plenty, the useful upgrade is choosing ones they can finish or act out.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Songs with actions and silly sounds','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_telling_my_version','I’m telling you my version',2,true,'ent_need_31_33_language_retelling_feelings','I’m telling you my version','Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.','for_your_child','cat_peer_play_board_books','Peer-play board books','Peer Play Board Books',6,'Books about playdates, sharing or friends can give toddlers simple language for moments they are starting to meet in real life: waiting, wanting a turn and playing near other children.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Peer-play board books','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_telling_my_version','I’m telling you my version',2,true,'ent_need_31_33_language_retelling_feelings','I’m telling you my version','Your toddler may be using more words to explain their version of the world: what happened, what they want, who did what and how they feel. Shared stories, songs and warm back-and-forth chat can give those words somewhere useful to land.','for_your_child','cat_conversation_picture_cards','Conversation picture cards','Conversation Picture Cards',7,'Picture cards with familiar scenes can invite toddlers to say what they see, what happened and what might happen next. Use them as talk starters, not as a correct-answer game.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Conversation picture cards','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_let_one_object_become_something_else','Let one object become something else','Let One Object Become Something Else',1,'A block can be food, a cup can be a phone and a box can be a bed. Follow their idea before adding yours, so the play stays theirs.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_narrate_care_play_softly','Narrate care play softly','Narrate Care Play Softly',2,'When teddy is tired or the doll is hungry, add a few simple words: ''Teddy is sad'' or ''Baby needs a cuddle''. This supports language and social understanding without over-directing the game.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_avoid_tiny_pretend_accessories','Avoid tiny pretend accessories','Avoid Tiny Pretend Accessories',3,'Pretend sets often include small pieces. Check age warnings and remove tiny foods, magnets, button batteries or loose parts before letting the play run freely.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_soft_doll_or_teddy_care_play','Soft doll or teddy care play','Soft Doll Or Teddy Care Play',4,'A doll, teddy or soft toy gives your toddler someone to feed, dress, comfort and talk to. If they already have one, a small care prop may be more useful than another soft toy.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Soft doll or teddy care play','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_toddler_care_set','Toddler care set','Toddler Care Set',5,'A simple care set, with safe chunky pieces, can deepen doll or teddy play. Look for fewer, larger pieces rather than lots of fiddly accessories.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Toddler care set','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_play_kitchen_and_home_props','Play kitchen and home props','Play Kitchen And Home Props',6,'Toy cups, bowls, pans or safe kitchen props let toddlers copy cooking, serving and tidying. This is a strong stage-fit idea because pretend play and helping around the home overlap.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Play kitchen and home props','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_pretend_food_and_shopping_basket','Pretend food and shopping basket','Pretend Food And Shopping Basket',7,'Pretend food or a small shopping basket can support naming, sorting, carrying, choosing and little stories. Choose chunky pieces and avoid tiny accessories for under-3s.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Pretend food and shopping basket','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_pretend_worlds_bigger','I’m making pretend worlds bigger',3,true,'ent_need_31_33_richer_pretend_play','I’m making pretend worlds bigger','Pretend play can become much more elaborate near this stage. A block can become food, a teddy can need care, and a toy car can start a whole story. Good props give your toddler more ways to practise language, social understanding and imagination.','for_your_child','cat_small_world_cars_and_garages','Small-world cars and garages','Small World Cars And Garages',8,'Cars, garages or simple small-world vehicles can support pretend scenes, action words and turn-taking. Keep pieces large and simple enough for under-3 play.','for_your_child','product_category','things_that_can_help','Things that can help',8,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Small-world cars and garages','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_playing_with_people','I’m learning how other people play',4,true,'ent_need_31_33_peer_turn_taking','I’m learning how other people play','Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.','for_your_child','cat_practise_one_short_turn_each','Practise one short turn each','Practise One Short Turn Each',1,'Try one roll, one throw or one puzzle piece each. Short, visible turns help toddlers practise waiting without expecting them to share smoothly for long.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_playing_with_people','I’m learning how other people play',4,true,'ent_need_31_33_peer_turn_taking','I’m learning how other people play','Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.','for_your_child','cat_give_them_the_words_for_stuck_moments','Give them the words for stuck moments','Give Them The Words For Stuck Moments',2,'When play gets bumpy, model simple words like ''my turn'', ''your turn'', ''can I have it?'' or ''wait''. This gives them a script before they can manage the feeling alone.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_playing_with_people','I’m learning how other people play',4,true,'ent_need_31_33_peer_turn_taking','I’m learning how other people play','Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.','for_your_child','cat_keep_peer_play_expectations_small','Keep peer play expectations small','Keep Peer Play Expectations Small',3,'Playing with others is still developing. Short shared moments, parallel play and adult help are all normal at this stage, especially when toys are exciting.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_playing_with_people','I’m learning how other people play',4,true,'ent_need_31_33_peer_turn_taking','I’m learning how other people play','Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.','for_your_child','cat_big_soft_ball_for_turn_taking','Big soft ball for turn-taking','Big Soft Ball For Turn Taking',4,'A large ball can make early turn-taking feel obvious: roll, kick, chase, bring back. It is also useful because it works indoors or outside with little setup.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Big soft ball for turn-taking','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_playing_with_people','I’m learning how other people play',4,true,'ent_need_31_33_peer_turn_taking','I’m learning how other people play','Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.','for_your_child','cat_hoops_and_beanbags','Hoops and beanbags','Hoops And Beanbags',5,'Hoops and beanbags give toddlers a movement game that can be shared. They can jump, toss, collect and wait for another person to have a go.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Hoops and beanbags','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_playing_with_people','I’m learning how other people play',4,true,'ent_need_31_33_peer_turn_taking','I’m learning how other people play','Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.','for_your_child','cat_first_matching_games','First matching games','First Matching Games',6,'Simple matching games can be played cooperatively before they become competitive. Use only a few pieces and celebrate finding a pair together.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','First matching games','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_playing_with_people','I’m learning how other people play',4,true,'ent_need_31_33_peer_turn_taking','I’m learning how other people play','Peer play is still messy at this age, but it is getting more interesting. Your toddler may play beside other children, copy them, try short turns or need help finding words when play gets stuck. Simple turn-taking toys can make this easier.','for_your_child','cat_books_about_friends_and_sharing','Books about friends and sharing','Books About Friends And Sharing',7,'Stories about friends, waiting and turns can make tricky playdate moments easier to talk about later. They are especially useful if your toddler is starting nursery or group play.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Books about friends and sharing','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_give_one_real_job_not_five','Give one real job, not five','Give One Real Job Not Five',1,'Ask for one concrete job: put socks in the basket, carry a spoon, choose a book or wipe a small spill. Real jobs work best when they are short and repeatable.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_let_them_try_the_easy_bit_first','Let them try the easy bit first','Let Them Try The Easy Bit First',2,'Break a routine into the bit they can manage: pull trousers down, press the timer, carry the cup, put one toy away. You can finish the harder part.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_keep_potty_progress_low_pressure','Keep potty progress low-pressure','Keep Potty Progress Low Pressure',3,'Potty learning can be gradual. If your toddler communicates well but refuses the potty, it may be better to keep routines calm rather than forcing a big training weekend.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_safe_step_up_stool_or_learning_tower','Safe step-up stool or learning tower','Safe Step Up Stool Or Learning Tower',4,'A stable step or learning tower can help toddlers join handwashing, cooking or tidying. Choose based on the job and space, not because every family needs the largest version.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Safe step-up stool or learning tower','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_picture_routines_and_countdown_timer','Picture routines and countdown timer','Picture Routines And Countdown Timer',5,'A simple routine card or visual timer can make transitions clearer when words are not enough. It is useful for tidying, bedtime, washing hands and leaving the house.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Picture routines and countdown timer','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_easy_dressing_practice_pieces','Easy dressing practice pieces','Easy Dressing Practice Pieces',6,'Loose trousers, open jackets, doll clothes or dressing props can help toddlers practise pulling, pushing and naming clothes without making every real outfit a test.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Easy dressing practice pieces','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_toddler_safe_food_prep_tools','Toddler-safe food prep tools','Toddler Safe Food Prep Tools',7,'Simple child-safe kitchen tools can support helping, pretend cooking and mealtime language. Borrow or use household items first if you are unsure how often it will happen.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Toddler-safe food prep tools','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_real_job_to_do','I want a real job to do',5,true,'ent_need_31_33_helping_independence','I want a real job to do','The drive to help can become very real now. Your toddler may want to climb up, carry something, choose clothes, stir, tidy or follow a little routine. The best support is usually a small job that is safe, repeatable and not too adult-dependent.','for_your_child','cat_low_baskets_and_easy_shelves','Low baskets and easy shelves','Low Baskets And Easy Shelves',8,'Low baskets, clear categories and reachable shelves can make clean-up more realistic. This is often a use-what-you-have upgrade rather than a new purchase.','for_your_child','product_category','things_that_can_help','Things that can help',8,true,false,false,'Quick check',NULL,'Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Low baskets and easy shelves','conor','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_offer_a_bigger_making_surface','Offer a bigger making surface','Offer A Bigger Making Surface',1,'Big paper, cardboard or pavement chalk lets toddlers use their whole arm while still practising hand control. The goal is marks, lines and choices, not neat pictures.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_give_one_fiddly_challenge_at_a_time','Give one fiddly challenge at a time','Give One Fiddly Challenge At A Time',2,'Threading, twisting, peeling and fitting pieces can be hard work. Put out one challenge with a few pieces, then stop while it still feels like success.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_check_small_parts_before_threading_or_collage','Check small parts before threading or collage','Check Small Parts Before Threading Or Collage',3,'Threading toys, stickers and craft kits can include small pieces. Check age guidance and remove anything that could be swallowed, especially if younger siblings are nearby.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_chunky_crayons_and_big_paper','Chunky crayons and big paper','Chunky Crayons And Big Paper',4,'Chunky crayons, chalks or big paper are route-one for this stage, but they are useful because they suit whole-arm marks, copying lines and early colour interest.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Chunky crayons and big paper','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_soft_dough_and_simple_tools','Soft dough and simple tools','Soft Dough And Simple Tools',5,'Soft dough, rollers or chunky cutters give hands a satisfying workout. Homemade dough is a good first try if you do not want another kit in the house.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Soft dough and simple tools','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_stickers_and_simple_collage','Stickers and simple collage','Stickers And Simple Collage',6,'Large stickers and simple collage materials can be surprisingly absorbing now. Choose chunky, easy-peel options and avoid tiny craft pieces.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Stickers and simple collage','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_chunky_lacing_and_threading','Chunky lacing and threading','Chunky Lacing And Threading',7,'Chunky threading sets can support two-hand coordination and focus. For under-3s, size and supervision matter more than how educational the toy looks.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Chunky lacing and threading','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_hands_make_more','My hands can make more now',6,true,'ent_need_31_33_fine_motor_making','My hands can make more now','Small hand control is becoming more purposeful. Your toddler may scribble with more intent, twist lids, fit pieces, thread chunky items or use both hands for a fiddly task. The best ideas give them a real challenge without tiny parts.','for_your_child','cat_twist_turn_and_peg_puzzles','Twist, turn and peg puzzles','Twist Turn And Peg Puzzles',8,'Twist, peg or latch-style puzzles can give toddlers a satisfying hand challenge. They are a sharper buy than another basic puzzle if your child already enjoys fitting pieces.','for_your_child','product_category','things_that_can_help','Things that can help',8,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Twist, turn and peg puzzles','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_balance_bravery','I’m testing balance and bravery',7,true,'ent_need_31_33_gross_motor_confidence','I’m testing balance and bravery','Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.','for_your_child','cat_make_a_jump_and_collect_game','Make a jump-and-collect game','Make A Jump And Collect Game',1,'Put soft markers or toys on the floor and invite your toddler to jump, step, collect and return. It gives bravery a little structure without needing a sports lesson.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_balance_bravery','I’m testing balance and bravery',7,true,'ent_need_31_33_gross_motor_confidence','I’m testing balance and bravery','Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.','for_your_child','cat_kick_chase_and_bring_back','Kick, chase and bring back','Kick Chase And Bring Back',2,'A ball game can be very simple: kick it, chase it, bring it back, then swap turns. It supports movement, listening and early shared play.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_balance_bravery','I’m testing balance and bravery',7,true,'ent_need_31_33_gross_motor_confidence','I’m testing balance and bravery','Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.','for_your_child','cat_match_bravery_with_supervision','Match bravery with supervision','Match Bravery With Supervision',3,'Climbing, scooters, trikes and big balls need space and supervision. Check the setting before the play begins, especially near steps, hard edges or other children.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_balance_bravery','I’m testing balance and bravery',7,true,'ent_need_31_33_gross_motor_confidence','I’m testing balance and bravery','Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.','for_your_child','cat_hoops_beanbags_and_jump_markers','Hoops, beanbags and jump markers','Hoops Beanbags And Jump Markers',4,'Hoops, beanbags or floor markers can turn jumping, tossing and collecting into a repeatable game. This is a good fresh gift because it works indoors, garden or park.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Hoops, beanbags and jump markers','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_balance_bravery','I’m testing balance and bravery',7,true,'ent_need_31_33_gross_motor_confidence','I’m testing balance and bravery','Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.','for_your_child','cat_big_balls_for_kicking_and_catching','Big balls for kicking and catching','Big Balls For Kicking And Catching',5,'A large, light ball is still one of the most useful movement toys. At this age, look for one that invites kicking, carrying and simple back-and-forth play.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Big balls for kicking and catching','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_balance_bravery','I’m testing balance and bravery',7,true,'ent_need_31_33_gross_motor_confidence','I’m testing balance and bravery','Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.','for_your_child','cat_balance_paths_and_stepping_stones','Balance paths and stepping stones','Balance Paths And Stepping Stones',6,'Stepping stones, lines or low balance paths can help toddlers practise careful feet, turns and confidence. You can also make a no-buy version with cushions or tape.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Balance paths and stepping stones','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_balance_bravery','I’m testing balance and bravery',7,true,'ent_need_31_33_gross_motor_confidence','I’m testing balance and bravery','Bigger movement can look wonderfully bold at this stage. Your toddler may jump with both feet, run with more purpose, kick a ball, try tiptoes or want climbing challenges. The useful bit is safe practice, not pushing risk.','for_your_child','cat_trikes_and_beginner_scooters','Trikes and beginner scooters','Trikes And Beginner Scooters',7,'Some toddlers near 3 are ready to try pedalling or scooting, while others are not. Fit, stability, helmet habits and supervision matter more than buying early.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Trikes and beginner scooters','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_pour_between_just_two_containers','Pour between just two containers','Pour Between Just Two Containers',1,'Use two cups or bowls and a small amount of water. Toddlers can pour, compare, spill, refill and try again without needing a big setup.','for_your_child','activity','useful_ideas','Useful ideas',1,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_make_messy_play_repeatable','Make messy play repeatable','Make Messy Play Repeatable',2,'Keep one washable, low-effort option ready: dough, chalk, water cups or a small paint tray. The best messy play is the version you can face doing again.','for_your_child','activity','useful_ideas','Useful ideas',2,false,false,false,'Idea',NULL,NULL,NULL,'conor','Save idea','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_supervise_water_dough_and_small_tools','Supervise water, dough and small tools','Supervise Water Dough And Small Tools',3,'Water play, dough tools and craft pieces need close supervision. Avoid water beads, magnets and small parts, especially while your child is still under 3.','for_your_child','setup','quick_checks','Quick checks',3,false,false,false,'Quick check',NULL,NULL,NULL,'conor','Save check','no_shop_actions'),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_pouring_cups_and_water_lab','Pouring cups and water lab','Pouring Cups And Water Lab',4,'Pouring cups, funnels or a simple water-lab style set can support early volume ideas. Keep it small, supervised and easy to clean up.','for_your_child','product_category','things_that_can_help','Things that can help',4,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Pouring cups and water lab','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_bath_pouring_set','Bath pouring set','Bath Pouring Set',5,'Bath cups and pouring toys can make water experiments easier to repeat because the mess is already contained. Check for trapped mould and cleanable pieces.','for_your_child','product_category','things_that_can_help','Things that can help',5,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Bath pouring set','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_washable_paint_and_chunky_brushes','Washable paint and chunky brushes','Washable Paint And Chunky Brushes',6,'Washable paint, chunky brushes or sponge tools let toddlers make bold marks without needing fine control. This is a good gift when parents have space and tolerance for mess.','for_your_child','product_category','things_that_can_help','Things that can help',6,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Washable paint and chunky brushes','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_sand_and_water_table','Sand and water table','Sand And Water Table',7,'A sand or water table can be useful if a family has outdoor space. It supports scooping, pouring, comparing and repeated experiments, but it is not necessary for every home.','for_your_child','product_category','things_that_can_help','Things that can help',7,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','Check whether the family already has a basic version. Upgrade only if this version solves a new job for 31–33 months.','Sand and water table','both','See Ember Picks',NULL),
  ('31-33m','31–33 months',31,33,true,'ent_cluster_water_colour_mess','I’m experimenting with water and colour',8,true,'ent_need_31_33_sensory_messy_experimenting','I’m experimenting with water and colour','Messy play can become more purposeful now. Your toddler may compare, pour, squash, paint, scoop or notice what changes when they add water or pressure. A few well-chosen, washable tools can make this feel doable at home.','for_your_child','cat_playdough_and_messy_tray','Playdough and messy tray','Playdough And Messy Tray',8,'A tray plus dough can make sensory play easier to offer without taking over the room. Homemade dough and a baking tray can be enough to test the idea first.','for_your_child','product_category','things_that_can_help','Things that can help',8,true,true,true,'Gift idea','Thoughtful if age-fit and not already owned.','High chance the family owns a version already. Look for the stage shift: a version that adds clearer turns, richer pretend play, more control or easier setup rather than simply more of the same.','Playdough and messy tray','both','See Ember Picks',NULL);

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
SELECT DISTINCT ON (s.age_band_id, dn.id, ct.id)
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
) ct ON true
ORDER BY
  s.age_band_id,
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
  v_rows_31_33m INTEGER;
  v_clusters_31_33m INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_31_33m FROM tmp_discover_projection_stage WHERE age_band_id = '31-33m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_31_33m
  FROM tmp_discover_projection_stage WHERE age_band_id = '31-33m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN ('31-33m')
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 60)', v_rows_loaded;
  RAISE NOTICE '31-33m rows: % (expected 60), clusters: % (expected 8)', v_rows_31_33m, v_clusters_31_33m;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 60 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_rows_31_33m <> 60 THEN
    RAISE EXCEPTION 'Row count validation failed for 31-33m';
  END IF;
  IF v_clusters_31_33m <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed for 31-33m';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('31-33m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('31-33m');
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('31-33m');
