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
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','Sitting up and reaching for toys',1,true,'cluster_sitting_reaching','Sitting, reaching and exploring','Between 6 and 9 months, babies often become steadier sitting and more purposeful with their hands. Reaching for safe objects, passing toys between hands and exploring simple shapes helps them practise balance, coordination, curiosity and confidence without needing complicated toys.','for_your_child','cat_sitting_play_mat','Firm floor play mat','Firm floor play mat',1,'A simple, firm floor space matters more as your baby learns to sit and lean towards toys. It lets them practise balance, reaching and recovering from wobbles while staying low to the ground, where falls are less risky than on beds, sofas or raised surfaces.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','Sitting up and reaching for toys',1,true,'cluster_sitting_reaching','Sitting, reaching and exploring','Between 6 and 9 months, babies often become steadier sitting and more purposeful with their hands. Reaching for safe objects, passing toys between hands and exploring simple shapes helps them practise balance, coordination, curiosity and confidence without needing complicated toys.','for_your_child','cat_reach_grab_toys','Reach-and-grab toys','Reach-and-grab toys',2,'At this stage, babies are increasingly interested in objects just out of reach. Placing safe, graspable toys nearby gives them a reason to stretch, shift weight, use their eyes and hands together, and practise the early movements that feed into crawling and sitting play.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','Sitting up and reaching for toys',1,true,'cluster_sitting_reaching','Sitting, reaching and exploring','Between 6 and 9 months, babies often become steadier sitting and more purposeful with their hands. Reaching for safe objects, passing toys between hands and exploring simple shapes helps them practise balance, coordination, curiosity and confidence without needing complicated toys.','for_your_child','cat_hand_transfer_toys','Hand-to-hand transfer toys','Hand-to-hand transfer toys',3,'Moving an object from one hand to the other is a useful 6-9 month skill. Lightweight toys, rings, balls and textured objects give your baby repeated practice coordinating both sides of the body while exploring shape, sound, texture and movement.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','Sitting up and reaching for toys',1,true,'cluster_sitting_reaching','Sitting, reaching and exploring','Between 6 and 9 months, babies often become steadier sitting and more purposeful with their hands. Reaching for safe objects, passing toys between hands and exploring simple shapes helps them practise balance, coordination, curiosity and confidence without needing complicated toys.','for_your_child','cat_soft_graspable_balls','Soft graspable balls','Soft graspable balls',4,'Soft balls are easy to hold, safe to explore and useful across sitting, reaching and early crawling. Babies can practise grasping, rolling, watching movement and passing objects between hands, while parents can keep the play simple and responsive rather than over-structured.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_sitting_reaching','Sitting up and reaching for toys',1,true,'cluster_sitting_reaching','Sitting, reaching and exploring','Between 6 and 9 months, babies often become steadier sitting and more purposeful with their hands. Reaching for safe objects, passing toys between hands and exploring simple shapes helps them practise balance, coordination, curiosity and confidence without needing complicated toys.','for_your_child','cat_first_puzzle','First simple puzzles','First simple puzzles',5,'A first puzzle is not about completing a task perfectly. It gives your baby a simple object to inspect, lift, turn and attempt to place, supporting fine motor control, early problem-solving and concentration while staying within a low-pressure play moment.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','Getting ready to crawl',2,true,'cluster_crawling_floor','Crawling and floor movement','This stage is full of floor-based effort: rolling, pivoting, stretching and early crawling attempts. Low, supervised play spaces and motivating objects give your baby safe reasons to move, while helping you avoid raised surfaces and household hazards as mobility increases.','for_your_child','cat_tummy_time_wobbler','Tummy-time wobblers','Tummy-time wobblers',1,'Tummy time continues to matter as babies build the strength for rolling, pivoting and crawling. A wobbling or rolling object can make floor play more interesting, giving your baby a reason to lift, look, reach and shift their weight during supervised awake time.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','Getting ready to crawl',2,true,'cluster_crawling_floor','Crawling and floor movement','This stage is full of floor-based effort: rolling, pivoting, stretching and early crawling attempts. Low, supervised play spaces and motivating objects give your baby safe reasons to move, while helping you avoid raised surfaces and household hazards as mobility increases.','for_your_child','cat_rolling_ball_set','Rolling ball sets','Rolling ball sets',2,'Balls help babies notice movement, distance and cause-and-effect. Rolling a ball just out of reach can invite reaching, pivoting or crawling attempts, while also keeping play simple enough for parents to repeat during short bursts of floor time.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','Getting ready to crawl',2,true,'cluster_crawling_floor','Crawling and floor movement','This stage is full of floor-based effort: rolling, pivoting, stretching and early crawling attempts. Low, supervised play spaces and motivating objects give your baby safe reasons to move, while helping you avoid raised surfaces and household hazards as mobility increases.','for_your_child','cat_safe_floor_space','Clear floor exploration space','Clear floor exploration space',3,'As rolling, pivoting and crawling emerge, the environment becomes part of the recommendation. A clear, low, supervised floor space helps your baby move freely while reducing avoidable hazards from raised surfaces, loose small objects, trailing cords or clutter.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','Getting ready to crawl',2,true,'cluster_crawling_floor','Crawling and floor movement','This stage is full of floor-based effort: rolling, pivoting, stretching and early crawling attempts. Low, supervised play spaces and motivating objects give your baby safe reasons to move, while helping you avoid raised surfaces and household hazards as mobility increases.','for_your_child','cat_reach_out_of_range','Out-of-reach toy placement','Out-of-reach toy placement',4,'You do not always need new toys. Placing an interesting safe object just beyond easy reach can encourage your baby to stretch, roll, pivot or attempt to move towards it, turning ordinary floor time into useful movement practice.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_crawling_floor','Getting ready to crawl',2,true,'cluster_crawling_floor','Crawling and floor movement','This stage is full of floor-based effort: rolling, pivoting, stretching and early crawling attempts. Low, supervised play spaces and motivating objects give your baby safe reasons to move, while helping you avoid raised surfaces and household hazards as mobility increases.','for_your_child','cat_activity_cube_floor','Floor activity cubes','Floor activity cubes',5,'Activity cubes appear often in parent and commercial toy language because they combine multiple actions in one place: touch, turn, press, rattle, look and reach. For Ember, they are best treated as a broad category that needs safety and age-fit checks.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Finding hidden things and making things happen',3,true,'cluster_object_permanence','Cause-and-effect and object permanence','Babies begin to enjoy simple surprises: something appears, drops, rolls, hides or comes back. Peekaboo, posting, dropping and pull-out toys support curiosity, memory and early problem-solving while giving parents easy games that feel playful, repeatable and naturally engaging rather than forced.','for_your_child','cat_peekaboo_scarf','Peekaboo scarves or play silks','Peekaboo scarves or play silks',1,'Peekaboo becomes especially meaningful as babies begin to understand that people and objects can disappear and return. A light scarf or play silk gives parents a simple way to repeat this idea through faces, laughter, anticipation and shared attention.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Finding hidden things and making things happen',3,true,'cluster_object_permanence','Cause-and-effect and object permanence','Babies begin to enjoy simple surprises: something appears, drops, rolls, hides or comes back. Peekaboo, posting, dropping and pull-out toys support curiosity, memory and early problem-solving while giving parents easy games that feel playful, repeatable and naturally engaging rather than forced.','for_your_child','cat_object_permanence_box','Object permanence boxes','Object permanence boxes',2,'Object permanence play helps babies test what happens when something goes out of sight. A simple box, posting toy or ball drop can turn that idea into hands-on practice, linking looking, reaching, releasing and searching in a clear repeatable loop.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Finding hidden things and making things happen',3,true,'cluster_object_permanence','Cause-and-effect and object permanence','Babies begin to enjoy simple surprises: something appears, drops, rolls, hides or comes back. Peekaboo, posting, dropping and pull-out toys support curiosity, memory and early problem-solving while giving parents easy games that feel playful, repeatable and naturally engaging rather than forced.','for_your_child','cat_pull_out_tissue_box','Pull-out tissue box toys','Pull-out tissue box toys',3,'Pull-out play is a strong example of cause-and-effect and containment. Babies can pull, empty, refill and repeat, while parents can offer a clean toy version of something babies naturally want to explore in the real world.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Finding hidden things and making things happen',3,true,'cluster_object_permanence','Cause-and-effect and object permanence','Babies begin to enjoy simple surprises: something appears, drops, rolls, hides or comes back. Peekaboo, posting, dropping and pull-out toys support curiosity, memory and early problem-solving while giving parents easy games that feel playful, repeatable and naturally engaging rather than forced.','for_your_child','cat_hide_squeak_eggs','Hide-and-squeak eggs','Hide-and-squeak eggs',4,'Commercial and community sources repeatedly surface hide-and-squeak or surprise toys for this wider stage. They can support lifting, opening, sound noticing and early matching, but should be mapped carefully as a category rather than treated as one required product.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_object_permanence','Finding hidden things and making things happen',3,true,'cluster_object_permanence','Cause-and-effect and object permanence','Babies begin to enjoy simple surprises: something appears, drops, rolls, hides or comes back. Peekaboo, posting, dropping and pull-out toys support curiosity, memory and early problem-solving while giving parents easy games that feel playful, repeatable and naturally engaging rather than forced.','for_your_child','cat_drop_roll_toys','Drop-and-roll toys','Drop-and-roll toys',5,'Drop-and-roll play lets babies test simple rules: I let go, it falls; I push, it rolls; I look, it moves away. These repeatable surprises support attention, motor planning and early problem-solving without needing complicated toys.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','Putting things in, out and together',4,true,'cluster_stacking_containment','Stacking, nesting and containment','Containers, cups and baskets are powerful because they let babies repeat simple experiments: put in, take out, stack, knock down and try again. This supports hand control, spatial awareness and concentration, using ordinary play patterns that grow with the child.','for_your_child','cat_stacking_nesting_cups','Stacking and nesting cups','Stacking and nesting cups',1,'Stacking cups are a high-value 6-9m category because they grow with the child. At first babies mouth, bang and pass them; then they begin exploring size, nesting, hiding, pouring and simple towers, creating a long useful life from one low-cost item.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','Putting things in, out and together',4,true,'cluster_stacking_containment','Stacking, nesting and containment','Containers, cups and baskets are powerful because they let babies repeat simple experiments: put in, take out, stack, knock down and try again. This supports hand control, spatial awareness and concentration, using ordinary play patterns that grow with the child.','for_your_child','cat_treasure_basket','Treasure baskets','Treasure baskets',2,'A treasure basket is less about one toy and more about curated safe exploration. It gives your baby varied textures, shapes and weights to inspect while helping parents rotate simple household-safe objects instead of constantly buying new things.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','Putting things in, out and together',4,true,'cluster_stacking_containment','Stacking, nesting and containment','Containers, cups and baskets are powerful because they let babies repeat simple experiments: put in, take out, stack, knock down and try again. This supports hand control, spatial awareness and concentration, using ordinary play patterns that grow with the child.','for_your_child','cat_transparent_tube_tower','Tube towers and posting tubes','Tube towers and posting tubes',3,'Tube towers and posting-style toys help babies explore what fits inside, what drops through and what reappears. This supports spatial understanding, concentration and hand coordination, especially towards the later end of the 6-9m band.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','Putting things in, out and together',4,true,'cluster_stacking_containment','Stacking, nesting and containment','Containers, cups and baskets are powerful because they let babies repeat simple experiments: put in, take out, stack, knock down and try again. This supports hand control, spatial awareness and concentration, using ordinary play patterns that grow with the child.','for_your_child','cat_roll_build_cones','Roll-and-build cones','Roll-and-build cones',4,'Cones and similar stacking shapes give babies more than one action: hold, mouth, nest, stack, roll and knock down. They are best surfaced as a category of open-ended stacking objects, with Lovevery providing one useful competitor example.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_stacking_containment','Putting things in, out and together',4,true,'cluster_stacking_containment','Stacking, nesting and containment','Containers, cups and baskets are powerful because they let babies repeat simple experiments: put in, take out, stack, knock down and try again. This supports hand control, spatial awareness and concentration, using ordinary play patterns that grow with the child.','for_your_child','cat_sorting_containers','Simple sorting containers','Simple sorting containers',5,'Before toddlers can sort formally, babies can still explore containers by putting objects in and taking them out. This kind of play supports attention, hand use and early problem solving while mapping neatly to many simple baskets, boxes and cups.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Safe things to chew and explore',5,true,'cluster_mouth_sensory','Mouth, teeth and safe sensory play','Mouthing is part of how babies explore at this age, and teething can make safe chewable objects especially useful. The right textures, teethers and easy-clean toys give them something appropriate to investigate while keeping small parts, batteries and unsafe objects out of reach.','for_both','cat_teethers','Teethers and chew-safe toys','Teethers and chew-safe toys',1,'Mouthing is part of how babies explore, and many parents also deal with teething around this broad period. Ember should surface cleanable, age-labelled chew-safe toys while being clear that safety, hygiene and product condition matter, especially for anything pre-loved.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Safe things to chew and explore',5,true,'cluster_mouth_sensory','Mouth, teeth and safe sensory play','Mouthing is part of how babies explore at this age, and teething can make safe chewable objects especially useful. The right textures, teethers and easy-clean toys give them something appropriate to investigate while keeping small parts, batteries and unsafe objects out of reach.','for_both','cat_texture_cards_books','Texture cards and touch books','Texture cards and touch books',2,'Texture cards and touch books connect hands, eyes and language. Babies can scratch, pat, mouth-safe explore and look at familiar objects while parents name what they see, turning a simple sensory object into a shared communication moment.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Safe things to chew and explore',5,true,'cluster_mouth_sensory','Mouth, teeth and safe sensory play','Mouthing is part of how babies explore at this age, and teething can make safe chewable objects especially useful. The right textures, teethers and easy-clean toys give them something appropriate to investigate while keeping small parts, batteries and unsafe objects out of reach.','for_both','cat_cleanable_sensory_toys','Easy-clean sensory toys','Easy-clean sensory toys',3,'At 6-9m, toys often end up in mouths, on floors and near food. Cleanable sensory toys are useful because they allow safe repetition: hold, mouth, bang, squish, wipe and use again, without turning every play idea into laundry.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Safe things to chew and explore',5,true,'cluster_mouth_sensory','Mouth, teeth and safe sensory play','Mouthing is part of how babies explore at this age, and teething can make safe chewable objects especially useful. The right textures, teethers and easy-clean toys give them something appropriate to investigate while keeping small parts, batteries and unsafe objects out of reach.','for_both','cat_safe_household_objects','Safe household-object play','Safe household-object play',4,'Babies often prefer real-world objects, but this stage needs stronger safety filtering. Ember can validate the parent instinct by suggesting safe household-object play, while warning against batteries, small parts, cords, sharp edges and choking hazards.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_mouth_sensory','Safe things to chew and explore',5,true,'cluster_mouth_sensory','Mouth, teeth and safe sensory play','Mouthing is part of how babies explore at this age, and teething can make safe chewable objects especially useful. The right textures, teethers and easy-clean toys give them something appropriate to investigate while keeping small parts, batteries and unsafe objects out of reach.','for_both','cat_battery_free_toys','Battery-safe or battery-free toys','Battery-safe or battery-free toys',5,'Battery-powered toys are not automatically unsafe, but this is the age when babies mouth, bang and explore objects intensely. Ember should flag battery compartments and loose spare batteries as a safety check, especially for second-hand or unknown-marketplace toys.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','Starting solids without the overwhelm',6,true,'cluster_first_foods','First foods and self-feeding','Around this stage, many families move from milk-only feeding towards first tastes, messy practice and self-feeding. Simple kit, safe food prep and clear routines help parents manage choking risk, allergens, cups, spoons and clean-up without turning weaning into a shopping panic.','for_both','cat_highchair','Supportive highchair','Supportive highchair',1,'Starting solids changes the household setup. A supportive highchair helps your baby sit upright for meals, gives parents a predictable feeding place, and keeps weaning safer and calmer than trying to manage food while baby is lying, crawling or distracted.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','Starting solids without the overwhelm',6,true,'cluster_first_foods','First foods and self-feeding','Around this stage, many families move from milk-only feeding towards first tastes, messy practice and self-feeding. Simple kit, safe food prep and clear routines help parents manage choking risk, allergens, cups, spoons and clean-up without turning weaning into a shopping panic.','for_both','cat_open_cup','Open or free-flow cup','Open or free-flow cup',2,'NHS guidance supports offering water in an open or free-flow cup with meals from around 6 months. A simple first cup is a small but important category because it supports drinking practice without relying only on bottles or spouted designs.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','Starting solids without the overwhelm',6,true,'cluster_first_foods','First foods and self-feeding','Around this stage, many families move from milk-only feeding towards first tastes, messy practice and self-feeding. Simple kit, safe food prep and clear routines help parents manage choking risk, allergens, cups, spoons and clean-up without turning weaning into a shopping panic.','for_both','cat_first_spoons_bowls','First spoons and bowls','First spoons and bowls',3,'First spoons and bowls become relevant because solids are about learning new tastes, textures and feeding rhythms. They help parents offer puree, mashed foods, lumpy textures and finger foods while keeping the experience manageable and repeatable.','for_both'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','Starting solids without the overwhelm',6,true,'cluster_first_foods','First foods and self-feeding','Around this stage, many families move from milk-only feeding towards first tastes, messy practice and self-feeding. Simple kit, safe food prep and clear routines help parents manage choking risk, allergens, cups, spoons and clean-up without turning weaning into a shopping panic.','for_both','cat_weaning_bibs_mat','Bibs and splash mats','Bibs and splash mats',4,'Mess is part of learning to eat, but it can overwhelm parents. Bibs, wipe-clean mats and easy-clean surfaces do not create development by themselves; they reduce friction so families can offer repeated safe food exploration without dreading cleanup.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','Starting solids without the overwhelm',6,true,'cluster_first_foods','First foods and self-feeding','Around this stage, many families move from milk-only feeding towards first tastes, messy practice and self-feeding. Simple kit, safe food prep and clear routines help parents manage choking risk, allergens, cups, spoons and clean-up without turning weaning into a shopping panic.','for_both','cat_safe_food_prep_tools','Safe food prep tools','Safe food prep tools',5,'Food safety becomes practical at 6-9m because shape, texture and firmness affect choking risk. Simple prep tools such as a masher, knife, chopping board or steamer can help parents create soft, age-appropriate foods and avoid risky shapes.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_first_foods','Starting solids without the overwhelm',6,true,'cluster_first_foods','First foods and self-feeding','Around this stage, many families move from milk-only feeding towards first tastes, messy practice and self-feeding. Simple kit, safe food prep and clear routines help parents manage choking risk, allergens, cups, spoons and clean-up without turning weaning into a shopping panic.','for_both','cat_allergen_tracking','Allergen introduction tracker','Allergen introduction tracker',6,'Allergen introduction needs calm, careful handling. Ember can support parents with a simple checklist or tracker that records what was introduced, when, and whether any reaction appeared, while keeping medical advice boundaries clear.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','Making home safer for a moving baby',7,true,'cluster_home_safety','Home safety as they start moving','Once babies roll, reach and start moving, the home itself becomes part of the parenting job. Safety gates, blind cord checks, cupboard locks, small-object sweeps and battery awareness help reduce common risks before your baby’s new mobility catches you out.','for_you','cat_safety_gates','Safety gates','Safety gates',1,'Crawling and pulling up can arrive quickly, so safety gates become a practical stage signal rather than a toddler-only purchase. NHS guidance specifically points to gates for stairs once babies start crawling, with attention to safety standards.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','Making home safer for a moving baby',7,true,'cluster_home_safety','Home safety as they start moving','Once babies roll, reach and start moving, the home itself becomes part of the parenting job. Safety gates, blind cord checks, cupboard locks, small-object sweeps and battery awareness help reduce common risks before your baby’s new mobility catches you out.','for_you','cat_cupboard_locks','Cupboard locks','Cupboard locks',2,'As babies move and mouth objects, cupboards and low storage become more relevant. Locks or latches help keep cleaning products, medicines and breakables out of reach, turning mobility evidence into a practical household recommendation.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','Making home safer for a moving baby',7,true,'cluster_home_safety','Home safety as they start moving','Once babies roll, reach and start moving, the home itself becomes part of the parenting job. Safety gates, blind cord checks, cupboard locks, small-object sweeps and battery awareness help reduce common risks before your baby’s new mobility catches you out.','for_you','cat_small_object_sweep','Small-object safety sweep','Small-object safety sweep',3,'A safety sweep is a behaviour, not just a product. It reminds parents to check floors, sofa edges, low shelves and play areas for coins, beads, batteries, small toy parts and other objects a newly mobile baby may mouth.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','Making home safer for a moving baby',7,true,'cluster_home_safety','Home safety as they start moving','Once babies roll, reach and start moving, the home itself becomes part of the parenting job. Safety gates, blind cord checks, cupboard locks, small-object sweeps and battery awareness help reduce common risks before your baby’s new mobility catches you out.','for_you','cat_blind_cord_tidy','Blind cord tidies','Blind cord tidies',4,'Blind cords and trailing cords become more concerning as babies sit, roll, reach and crawl. A cord tidy or cleat is a small household safety category that fits Ember’s parent-practical role rather than child-development content.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','Making home safer for a moving baby',7,true,'cluster_home_safety','Home safety as they start moving','Once babies roll, reach and start moving, the home itself becomes part of the parenting job. Safety gates, blind cord checks, cupboard locks, small-object sweeps and battery awareness help reduce common risks before your baby’s new mobility catches you out.','for_you','cat_button_battery_check','Button battery checks','Button battery checks',5,'Button batteries are a critical safety issue because babies explore with their mouths and households contain remotes, key fobs, cards and toys. Ember should surface this as a checklist and marketplace caution, not as an ordinary shopping idea.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_home_safety','Making home safer for a moving baby',7,true,'cluster_home_safety','Home safety as they start moving','Once babies roll, reach and start moving, the home itself becomes part of the parenting job. Safety gates, blind cord checks, cupboard locks, small-object sweeps and battery awareness help reduce common risks before your baby’s new mobility catches you out.','for_you','cat_safe_sleep_continuity','Safe sleep continuity','Safe sleep continuity',6,'Sleep guidance does not vanish when a baby becomes mobile. Ember should keep safe sleep visible, especially clear flat spaces, back-sleeping at the start of sleep, and avoiding padded or cluttered products marketed as convenient solutions.','for_you'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','Books, songs and little back-and-forth games',8,true,'cluster_books_sounds','Books, sounds and social games','Books, songs and responsive games help babies practise listening, looking, copying and taking turns with sounds or gestures. They also give parents simple ways to connect during everyday moments, without needing elaborate activities, lots of specialist toys or a perfect routine.','for_your_child','cat_board_books','Board books and face books','Board books and face books',1,'Board books are a recurring category because their role evolves. In 6-9m they support shared attention, repeated words, faces, rhythm and turning pages together, rather than only newborn visual interest.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','Books, songs and little back-and-forth games',8,true,'cluster_books_sounds','Books, sounds and social games','Books, songs and responsive games help babies practise listening, looking, copying and taking turns with sounds or gestures. They also give parents simple ways to connect during everyday moments, without needing elaborate activities, lots of specialist toys or a perfect routine.','for_your_child','cat_sound_cylinders_shakers','Shakers and sound cylinders','Shakers and sound cylinders',2,'Sound toys help babies notice that their actions can produce noise. Shakers, cylinders and small instruments can support grasping, shaking, listening and turn-taking, especially when an adult names the sound and pauses for a response.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','Books, songs and little back-and-forth games',8,true,'cluster_books_sounds','Books, sounds and social games','Books, songs and responsive games help babies practise listening, looking, copying and taking turns with sounds or gestures. They also give parents simple ways to connect during everyday moments, without needing elaborate activities, lots of specialist toys or a perfect routine.','for_your_child','cat_songs_action_games','Songs and action games','Songs and action games',3,'Songs, clapping, gestures and simple action games support communication because babies learn through repeated rhythms and responsive adults. They are low-cost, portable and especially useful for parents who need ideas without constantly buying more products.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','Books, songs and little back-and-forth games',8,true,'cluster_books_sounds','Books, sounds and social games','Books, songs and responsive games help babies practise listening, looking, copying and taking turns with sounds or gestures. They also give parents simple ways to connect during everyday moments, without needing elaborate activities, lots of specialist toys or a perfect routine.','for_your_child','cat_first_signs_books','First signs and gestures books','First signs and gestures books',4,'By around 9 months, gestures and communication cues become more visible. First signs or gesture books can give parents a concrete way to model waving, pointing, feelings or simple requests while keeping the interaction playful.','for_your_child'),
  ('6-9m','6–9 months',6,9,true,'cluster_books_sounds','Books, songs and little back-and-forth games',8,true,'cluster_books_sounds','Books, sounds and social games','Books, songs and responsive games help babies practise listening, looking, copying and taking turns with sounds or gestures. They also give parents simple ways to connect during everyday moments, without needing elaborate activities, lots of specialist toys or a perfect routine.','for_your_child','cat_feelings_faces_books','Feelings and baby faces books','Feelings and baby faces books',5,'Books with baby faces and emotions connect well with this stage’s social development. They give parents natural words for feelings, expressions and routines, while babies practise looking, listening and responding to familiar human faces.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','On the move',1,true,'ent_cluster_move','Crawling, pulling up and cruising','Your baby may be sitting, crawling, pulling up or cruising around furniture. The useful focus is not rushing walking, but giving them safe floor space, stable support and tempting objects just out of reach so movement feels playful and supervised.','for_both','ent_cat_floor_zone','Safe floor-play zone','Safe floor-play zone',1,'A clear floor zone helps your baby practise sitting, reaching, rolling, crawling or scooting without being surrounded by hazards. At 9 to 12 months, movement can change suddenly, so the setup matters as much as the toy placed just out of reach.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','On the move',1,true,'ent_cluster_move','Crawling, pulling up and cruising','Your baby may be sitting, crawling, pulling up or cruising around furniture. The useful focus is not rushing walking, but giving them safe floor space, stable support and tempting objects just out of reach so movement feels playful and supervised.','for_both','ent_cat_cruising_furniture','Stable cruising furniture setup','Stable cruising furniture setup',2,'Babies often practise standing by pulling up on furniture before they walk. A safer setup means stable surfaces, clear floors and nearby objects that invite reaching, not pressure to walk early or use risky seated baby walkers. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','On the move',1,true,'ent_cluster_move','Crawling, pulling up and cruising','Your baby may be sitting, crawling, pulling up or cruising around furniture. The useful focus is not rushing walking, but giving them safe floor space, stable support and tempting objects just out of reach so movement feels playful and supervised.','for_both','ent_cat_push_pull_toy','Stable push and pull toys','Stable push and pull toys',3,'Push and pull toys can fit the late edge of this band when a baby is already pulling up or cruising. They should be stable, supervised and clearly separated from seated rolling baby walkers, which safety sources do not recommend.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','On the move',1,true,'ent_cluster_move','Crawling, pulling up and cruising','Your baby may be sitting, crawling, pulling up or cruising around furniture. The useful focus is not rushing walking, but giving them safe floor space, stable support and tempting objects just out of reach so movement feels playful and supervised.','for_both','ent_cat_soft_balls','Soft balls for rolling and throwing','Soft balls for rolling and throwing',4,'Soft balls create simple movement games: rolling away for crawling, passing back and forth, or trying early throws. They are useful because they support big movement and hand-eye coordination without needing a screen or complicated instructions. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','On the move',1,true,'ent_cluster_move','Crawling, pulling up and cruising','Your baby may be sitting, crawling, pulling up or cruising around furniture. The useful focus is not rushing walking, but giving them safe floor space, stable support and tempting objects just out of reach so movement feels playful and supervised.','for_both','ent_cat_park_swings','Park trips and baby swings','Park trips and baby swings',5,'The park gives babies a different movement environment, while a suitable baby swing can add rhythm, vestibular input and parent-child interaction. It also helps parents who need a low-effort change of scene rather than more toys at home. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_move','On the move',1,true,'ent_cluster_move','Crawling, pulling up and cruising','Your baby may be sitting, crawling, pulling up or cruising around furniture. The useful focus is not rushing walking, but giving them safe floor space, stable support and tempting objects just out of reach so movement feels playful and supervised.','for_both','ent_cat_low_obstacle','Cushions and low crawl obstacles','Cushions and low crawl obstacles',6,'Soft cushions, tunnels or very low obstacles can turn floor time into exploration for a crawler or scooter. The goal is safe motivation and body awareness, not pushing a baby to crawl faster or climb furniture unsafely. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','Busy little hands',2,true,'ent_cluster_hands','Pincer grip, two hands and stacking','Hands get much busier in this window. Your baby may rake food, move toys between hands, bang objects together and begin pincer-style picking. Simple stacking, posting, grasping and two-handed toys let them practise precision without needing complicated products. It gives parents simple, repeatable play that feels useful without becoming a lesson.','for_your_child','ent_cat_pincer_puzzle','Pincer puzzles and peg drops','Pincer puzzles and peg drops',1,'Late in the first year, babies may start picking with fingertips and thumb. Large-piece peg drops or pincer puzzles give that grip a clear job, while still keeping the challenge simple enough to be about exploration, not getting it right.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','Busy little hands',2,true,'ent_cluster_hands','Pincer grip, two hands and stacking','Hands get much busier in this window. Your baby may rake food, move toys between hands, bang objects together and begin pincer-style picking. Simple stacking, posting, grasping and two-handed toys let them practise precision without needing complicated products. It gives parents simple, repeatable play that feels useful without becoming a lesson.','for_your_child','ent_cat_stacking_cups','Stacking and nesting cups','Stacking and nesting cups',2,'Stacking cups work across many mini-skills at this age: taking apart, putting together, nesting, filling, tipping and knocking down. They are simple enough for independent attempts and flexible enough for bath, floor or container play with supervision. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','Busy little hands',2,true,'ent_cluster_hands','Pincer grip, two hands and stacking','Hands get much busier in this window. Your baby may rake food, move toys between hands, bang objects together and begin pincer-style picking. Simple stacking, posting, grasping and two-handed toys let them practise precision without needing complicated products. It gives parents simple, repeatable play that feels useful without becoming a lesson.','for_your_child','ent_cat_container_basket','Treasure basket and container play','Treasure basket and container play',3,'Containers are one of the most useful play setups in this band. Babies can empty, refill, pass, find and follow simple requests, which links hand use with problem solving and language without requiring expensive toys. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','Busy little hands',2,true,'ent_cluster_hands','Pincer grip, two hands and stacking','Hands get much busier in this window. Your baby may rake food, move toys between hands, bang objects together and begin pincer-style picking. Simple stacking, posting, grasping and two-handed toys let them practise precision without needing complicated products. It gives parents simple, repeatable play that feels useful without becoming a lesson.','for_your_child','ent_cat_two_handed_objects','Two-handed play objects','Two-handed play objects',4,'Two-handed toys, pans, blocks or safe household objects let babies practise transferring, banging, clapping and manipulating with both hands. This fits the stage because several sources describe hand-to-hand movement and banging two things together. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','Busy little hands',2,true,'ent_cluster_hands','Pincer grip, two hands and stacking','Hands get much busier in this window. Your baby may rake food, move toys between hands, bang objects together and begin pincer-style picking. Simple stacking, posting, grasping and two-handed toys let them practise precision without needing complicated products. It gives parents simple, repeatable play that feels useful without becoming a lesson.','for_your_child','ent_cat_musical_noise','Musical and noisy play','Musical and noisy play',5,'At this age, noisy play can be purposeful: clapping, banging toys, shaking simple instruments or using spoons on pans. It connects two-handed movement with rhythm, imitation and laughter, especially when an adult joins in. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_hands','Busy little hands',2,true,'ent_cluster_hands','Pincer grip, two hands and stacking','Hands get much busier in this window. Your baby may rake food, move toys between hands, bang objects together and begin pincer-style picking. Simple stacking, posting, grasping and two-handed toys let them practise precision without needing complicated products. It gives parents simple, repeatable play that feels useful without becoming a lesson.','for_your_child','ent_cat_safe_household_objects','Baby-safe household object basket','Baby-safe household object basket',6,'Parents often find that safe household objects hold as much interest as bought toys. A small, supervised basket can reduce buying pressure while giving baby varied textures, weights and sounds, as long as safety checks are strict. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','Finding and figuring out',3,true,'ent_cluster_solve','Object permanence and simple problem-solving','This is a brilliant age for hide-and-find games, dumping and refilling containers, dropping objects, simple puzzles and surprising switches. Your baby is learning that things still exist when hidden and that their actions can make something happen. These games are easy to repeat, which is exactly why they work for tired parents.','for_your_child','ent_cat_peekaboo_scarf','Peekaboo cloths and scarves','Peekaboo cloths and scarves',1,'Peekaboo is directly named across 9 to 12 months. A cloth or scarf lets baby pull, reveal, laugh and repeat, linking social play with the idea that something can disappear and come back. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','Finding and figuring out',3,true,'ent_cluster_solve','Object permanence and simple problem-solving','This is a brilliant age for hide-and-find games, dumping and refilling containers, dropping objects, simple puzzles and surprising switches. Your baby is learning that things still exist when hidden and that their actions can make something happen. These games are easy to repeat, which is exactly why they work for tired parents.','for_your_child','ent_cat_posting_boxes','Posting boxes and sliding lids','Posting boxes and sliding lids',2,'Posting toys, sliding boxes and simple drop boxes give a baby a clear action: put in, open, find, repeat. They match the 12-month container milestone and object permanence evidence without needing screens or complex puzzles. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','Finding and figuring out',3,true,'ent_cluster_solve','Object permanence and simple problem-solving','This is a brilliant age for hide-and-find games, dumping and refilling containers, dropping objects, simple puzzles and surprising switches. Your baby is learning that things still exist when hidden and that their actions can make something happen. These games are easy to repeat, which is exactly why they work for tired parents.','for_your_child','ent_cat_drop_roll_tubes','Drop, roll and tube play','Drop, roll and tube play',3,'Dropping a ball through a tube or watching it roll away is simple but rich. It connects object permanence, cause-effect, tracking and movement motivation because baby can see an action produce a visible result. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','Finding and figuring out',3,true,'ent_cluster_solve','Object permanence and simple problem-solving','This is a brilliant age for hide-and-find games, dumping and refilling containers, dropping objects, simple puzzles and surprising switches. Your baby is learning that things still exist when hidden and that their actions can make something happen. These games are easy to repeat, which is exactly why they work for tired parents.','for_your_child','ent_cat_first_puzzles','Large-piece first puzzles','Large-piece first puzzles',4,'First puzzles at this age should be large, simple and tactile. They are less about completing a picture and more about trying, fitting, lifting, posting and repeating, which links fine motor practice with early problem solving. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','Finding and figuring out',3,true,'ent_cluster_solve','Object permanence and simple problem-solving','This is a brilliant age for hide-and-find games, dumping and refilling containers, dropping objects, simple puzzles and surprising switches. Your baby is learning that things still exist when hidden and that their actions can make something happen. These games are easy to repeat, which is exactly why they work for tired parents.','for_your_child','ent_cat_switchboard','Non-electronic switches and buttons','Non-electronic switches and buttons',5,'Switches, flaps and large buttons give babies satisfying cause-effect practice without needing electronic screens. This is captured from competitor parity and should be treated as a category candidate, strengthened by broader cause-effect evidence from banging and container play. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_solve','Finding and figuring out',3,true,'ent_cluster_solve','Object permanence and simple problem-solving','This is a brilliant age for hide-and-find games, dumping and refilling containers, dropping objects, simple puzzles and surprising switches. Your baby is learning that things still exist when hidden and that their actions can make something happen. These games are easy to repeat, which is exactly why they work for tired parents.','for_your_child','ent_cat_hide_favourite_toy','Hide-and-find favourite toy games','Hide-and-find favourite toy games',6,'When a baby has favourite objects, hiding them under a cloth or behind a cup turns attachment into learning. They can look, reach, point and enjoy the reveal while an adult keeps the game warm and predictable. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','Chats, claps and little signs',4,true,'ent_cluster_words','First gestures, sounds and social games','Your baby may babble, copy sounds, respond to their name, wave, point, clap or ask to be picked up. Short games, songs, books and naming routines help them connect sounds and gestures with people, objects and everyday moments. They turn ordinary moments into small conversations, even before clear words arrive.','for_your_child','ent_cat_board_books','Board and picture books','Board and picture books',1,'Board and picture books fit because babies can look, point, listen, turn pages and hear labels repeated. The value comes from an adult talking about pictures, not from leaving baby to consume content alone. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','Chats, claps and little signs',4,true,'ent_cluster_words','First gestures, sounds and social games','Your baby may babble, copy sounds, respond to their name, wave, point, clap or ask to be picked up. Short games, songs, books and naming routines help them connect sounds and gestures with people, objects and everyday moments. They turn ordinary moments into small conversations, even before clear words arrive.','for_your_child','ent_cat_rhyme_games','Rhymes, clapping and pat-a-cake','Rhymes, clapping and pat-a-cake',2,'Rhymes, clapping and pat-a-cake give baby predictable sounds, gestures and pauses. These games are useful because they combine imitation, rhythm, social attention and body movement with no product requirement. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','Chats, claps and little signs',4,true,'ent_cluster_words','First gestures, sounds and social games','Your baby may babble, copy sounds, respond to their name, wave, point, clap or ask to be picked up. Short games, songs, books and naming routines help them connect sounds and gestures with people, objects and everyday moments. They turn ordinary moments into small conversations, even before clear words arrive.','for_your_child','ent_cat_waving_signs','Waving, simple signs and no/bye-bye','Waving, simple signs and no/bye-bye',3,'Waving, lifting arms, pointing, shaking no or using a simple sign can help a baby express wants before words are reliable. The parent role is to model calmly and celebrate attempts without drilling. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','Chats, claps and little signs',4,true,'ent_cluster_words','First gestures, sounds and social games','Your baby may babble, copy sounds, respond to their name, wave, point, clap or ask to be picked up. Short games, songs, books and naming routines help them connect sounds and gestures with people, objects and everyday moments. They turn ordinary moments into small conversations, even before clear words arrive.','for_your_child','ent_cat_sound_copy','Babble-copying sound games','Babble-copying sound games',4,'Copying a baby''s babble and adding simple words makes communication feel like a conversation. It is a low-effort, high-trust activity because parents can do it during nappy changes, meals, play or walks. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','Chats, claps and little signs',4,true,'ent_cluster_words','First gestures, sounds and social games','Your baby may babble, copy sounds, respond to their name, wave, point, clap or ask to be picked up. Short games, songs, books and naming routines help them connect sounds and gestures with people, objects and everyday moments. They turn ordinary moments into small conversations, even before clear words arrive.','for_your_child','ent_cat_point_name_outings','Pointing and naming on outings','Pointing and naming on outings',5,'When baby points or looks at something, naming it gives their attention a word. Outings, windows, buses, animals and shelves can all become language moments without needing extra purchases. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_words','Chats, claps and little signs',4,true,'ent_cluster_words','First gestures, sounds and social games','Your baby may babble, copy sounds, respond to their name, wave, point, clap or ask to be picked up. Short games, songs, books and naming routines help them connect sounds and gestures with people, objects and everyday moments. They turn ordinary moments into small conversations, even before clear words arrive.','for_your_child','ent_cat_family_faces_cards','Family face and object cards','Family face and object cards',6,'Babies may prefer familiar adults and respond to names or faces. Simple photo cards, family pictures or object cards can make naming concrete and emotionally safe, especially around separation or busy routines. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','Learning to feed themselves',5,true,'ent_cluster_feeding','Self-feeding, cups and family meals','Between 10 and 12 months, meals usually become more structured: three meals, varied textures, finger foods and cup practice alongside milk feeds. The parent job is to make food safe, seat baby upright, supervise closely and keep mealtimes calm. The aim is practical confidence, not perfect meals or spotless floors.','for_you','ent_cat_highchair','Highchair or safe upright feeding seat','Highchair or safe upright feeding seat',1,'Safe seating is foundational once finger foods become normal. A highchair or upright seat supports alert posture, supervision and mess control, but it must be stable, intact and used with harnesses where supplied. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','Learning to feed themselves',5,true,'ent_cluster_feeding','Self-feeding, cups and family meals','Between 10 and 12 months, meals usually become more structured: three meals, varied textures, finger foods and cup practice alongside milk feeds. The parent job is to make food safe, seat baby upright, supervise closely and keep mealtimes calm. The aim is practical confidence, not perfect meals or spotless floors.','for_you','ent_cat_open_cup','Open cup and small water practice','Open cup and small water practice',2,'Cup practice becomes more relevant near the 12-month boundary, when CDC describes drinking from a cup with help. It should be parent-assisted and small-scale, because spills are part of the learning rather than a sign of failure. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','Learning to feed themselves',5,true,'ent_cluster_feeding','Self-feeding, cups and family meals','Between 10 and 12 months, meals usually become more structured: three meals, varied textures, finger foods and cup practice alongside milk feeds. The parent job is to make food safe, seat baby upright, supervise closely and keep mealtimes calm. The aim is practical confidence, not perfect meals or spotless floors.','for_you','ent_cat_finger_food_prep','Finger-food prep tools and safe cuts','Finger-food prep tools and safe cuts',3,'This stage brings lumpy, chopped and finger foods. The practical need is not a special product, but safe preparation: size, shape, texture, upright seating and constant supervision while baby learns to chew and swallow. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','Learning to feed themselves',5,true,'ent_cluster_feeding','Self-feeding, cups and family meals','Between 10 and 12 months, meals usually become more structured: three meals, varied textures, finger foods and cup practice alongside milk feeds. The parent job is to make food safe, seat baby upright, supervise closely and keep mealtimes calm. The aim is practical confidence, not perfect meals or spotless floors.','for_you','ent_cat_bibs_mats','Bibs, splash mats and clean-up kit','Bibs, splash mats and clean-up kit',4,'Self-feeding is messy because babies are learning textures, grip, chewing and cup control. Bibs and mats do not drive development themselves, but they reduce parent stress and make it easier to offer repeated practice. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','Learning to feed themselves',5,true,'ent_cluster_feeding','Self-feeding, cups and family meals','Between 10 and 12 months, meals usually become more structured: three meals, varied textures, finger foods and cup practice alongside milk feeds. The parent job is to make food safe, seat baby upright, supervise closely and keep mealtimes calm. The aim is practical confidence, not perfect meals or spotless floors.','for_you','ent_cat_family_meal_plan','Simple family meal rhythm','Simple family meal rhythm',5,'By 10 to 12 months, NHS guidance expects three meals alongside milk feeds and encourages eating together. Ember should support simple, low-pressure family meals with safe textures and no added salt or sugar. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_feeding','Learning to feed themselves',5,true,'ent_cluster_feeding','Self-feeding, cups and family meals','Between 10 and 12 months, meals usually become more structured: three meals, varied textures, finger foods and cup practice alongside milk feeds. The parent job is to make food safe, seat baby upright, supervise closely and keep mealtimes calm. The aim is practical confidence, not perfect meals or spotless floors.','for_you','ent_cat_pouches_caution','Shop-bought pouch and jar caution','Shop-bought pouch and jar caution',6,'Pouches can be convenient, but the NHS says not to rely on them as everyday food and not to let babies suck from them. Ember should treat them as an occasional fallback, not a core recommendation. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','Babyproofing the new mover',6,true,'ent_cluster_safety','Babyproofing for a mobile baby','As babies crawl, pull up, reach and put things in their mouth, the home changes quickly. Stair gates, anchored furniture, locked cupboards, safer cords and supervised bath routines are not nice-to-haves; they make exploration calmer and safer. It helps parents stay ahead of risks before new skills make hazards reachable.','for_you','ent_cat_stair_gates','Stair gates','Stair gates',1,'Once a baby is crawling or pulling up, stairs become a practical hazard rather than a future issue. Gates are parent-facing infrastructure that makes exploration safer while keeping the child-facing experience open. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','Babyproofing the new mover',6,true,'ent_cluster_safety','Babyproofing for a mobile baby','As babies crawl, pull up, reach and put things in their mouth, the home changes quickly. Stair gates, anchored furniture, locked cupboards, safer cords and supervised bath routines are not nice-to-haves; they make exploration calmer and safer. It helps parents stay ahead of risks before new skills make hazards reachable.','for_you','ent_cat_furniture_anchors','Furniture anchors and anti-tip straps','Furniture anchors and anti-tip straps',2,'Pulling up changes the furniture risk profile. Shelves, drawers and tall appliances can become support points, so anchoring is a practical safety step that belongs in the 9 to 12 month parent checklist. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','Babyproofing the new mover',6,true,'ent_cluster_safety','Babyproofing for a mobile baby','As babies crawl, pull up, reach and put things in their mouth, the home changes quickly. Stair gates, anchored furniture, locked cupboards, safer cords and supervised bath routines are not nice-to-haves; they make exploration calmer and safer. It helps parents stay ahead of risks before new skills make hazards reachable.','for_you','ent_cat_cupboard_locks','Cupboard locks and poison storage','Cupboard locks and poison storage',3,'Mobile babies explore with hands and mouths. Cupboard locks and locked high storage are about preventing access before a baby discovers a hazard, not reacting after they reach it. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','Babyproofing the new mover',6,true,'ent_cluster_safety','Babyproofing for a mobile baby','As babies crawl, pull up, reach and put things in their mouth, the home changes quickly. Stair gates, anchored furniture, locked cupboards, safer cords and supervised bath routines are not nice-to-haves; they make exploration calmer and safer. It helps parents stay ahead of risks before new skills make hazards reachable.','for_you','ent_cat_blind_cord_cleats','Blind cord cleats and cord tidy','Blind cord cleats and cord tidy',4,'Blind and curtain cords become more concerning as babies move, pull and explore upright. Cord cleats or tidy systems are a parent-facing safety need, not a developmental product. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','Babyproofing the new mover',6,true,'ent_cluster_safety','Babyproofing for a mobile baby','As babies crawl, pull up, reach and put things in their mouth, the home changes quickly. Stair gates, anchored furniture, locked cupboards, safer cords and supervised bath routines are not nice-to-haves; they make exploration calmer and safer. It helps parents stay ahead of risks before new skills make hazards reachable.','for_you','ent_cat_bath_supervision','Bath supervision and water-play rules','Bath supervision and water-play rules',5,'Bath play can be useful and calming, but the safety rule is non-negotiable: stay with the baby throughout. Any bath toy category should carry supervision language, especially where competitor items mention bath use. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_safety','Babyproofing the new mover',6,true,'ent_cluster_safety','Babyproofing for a mobile baby','As babies crawl, pull up, reach and put things in their mouth, the home changes quickly. Stair gates, anchored furniture, locked cupboards, safer cords and supervised bath routines are not nice-to-haves; they make exploration calmer and safer. It helps parents stay ahead of risks before new skills make hazards reachable.','for_you','ent_cat_exclude_baby_walker','Exclude seated baby walkers','Exclude seated baby walkers',6,'Parents often use the word walker loosely, but RoSPA explicitly does not recommend baby walkers. Ember must separate a stable push toy from a seated rolling walker and avoid recommending the latter. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','Stories, faces and feelings',7,true,'ent_cluster_stories','Stories, faces and early pretend play','Simple books, animal pictures, family faces, feeling words, puppets and soft toys help your baby practise looking, listening, pointing and caring. This is not formal learning; it is warm shared attention that turns everyday play into early communication. It gives parents gentle ways to support connection without formal teaching.','for_your_child','ent_cat_feelings_books','Feelings and baby-face books','Feelings and baby-face books',1,'Feeling books and baby-face books work because babies are already watching familiar people, expressions and sounds. The adult can name feelings gently, turning a short book into social learning rather than a lesson. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','Stories, faces and feelings',7,true,'ent_cluster_stories','Stories, faces and early pretend play','Simple books, animal pictures, family faces, feeling words, puppets and soft toys help your baby practise looking, listening, pointing and caring. This is not formal learning; it is warm shared attention that turns everyday play into early communication. It gives parents gentle ways to support connection without formal teaching.','for_your_child','ent_cat_soft_doll','Soft doll or cuddly toy care play','Soft doll or cuddly toy care play',2,'Near the first birthday, some babies hug soft toys or dolls. A simple soft doll or cuddly toy can support gentle caring play, comfort and imitation, provided it is safe for mouthing and close supervision. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','Stories, faces and feelings',7,true,'ent_cluster_stories','Stories, faces and early pretend play','Simple books, animal pictures, family faces, feeling words, puppets and soft toys help your baby practise looking, listening, pointing and caring. This is not formal learning; it is warm shared attention that turns everyday play into early communication. It gives parents gentle ways to support connection without formal teaching.','for_your_child','ent_cat_animal_mini_books','Animal mini books','Animal mini books',3,'Mini books can work well because babies are starting to hold books, point, look and listen. Animal pictures are easy for adults to name and make sounds for, helping turn short attention spans into shared moments. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','Stories, faces and feelings',7,true,'ent_cluster_stories','Stories, faces and early pretend play','Simple books, animal pictures, family faces, feeling words, puppets and soft toys help your baby practise looking, listening, pointing and caring. This is not formal learning; it is warm shared attention that turns everyday play into early communication. It gives parents gentle ways to support connection without formal teaching.','for_your_child','ent_cat_puppets','Puppets and different voices','Puppets and different voices',4,'Puppets help adults use different voices, actions and expressions, which local NHS guidance specifically encourages. They can make repeated songs or stories feel fresh without needing lots of toys. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','Stories, faces and feelings',7,true,'ent_cluster_stories','Stories, faces and early pretend play','Simple books, animal pictures, family faces, feeling words, puppets and soft toys help your baby practise looking, listening, pointing and caring. This is not formal learning; it is warm shared attention that turns everyday play into early communication. It gives parents gentle ways to support connection without formal teaching.','for_your_child','ent_cat_family_photos','Family photos and familiar-person play','Family photos and familiar-person play',5,'A few family photos can support recognition, naming and reassurance, especially when separation anxiety or familiar-adult preference is emerging. This is a low-cost category that fits the emotional reality of the stage. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_stories','Stories, faces and feelings',7,true,'ent_cluster_stories','Stories, faces and early pretend play','Simple books, animal pictures, family faces, feeling words, puppets and soft toys help your baby practise looking, listening, pointing and caring. This is not formal learning; it is warm shared attention that turns everyday play into early communication. It gives parents gentle ways to support connection without formal teaching.','for_your_child','ent_cat_texture_sensory','Texture and sensory balls','Texture and sensory balls',6,'Texture or sensory balls are parent-known categories for this age. They should be treated as commercial/community signals, useful when they also support grasping, rolling, mouthing-safe exploration and supervised sensory play. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_your_child'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Simple ways to fill the day',8,true,'ent_cluster_days','Everyday outings and low-effort play','Parents often worry they are not doing enough at this age. The evidence and community signals point to simple, repeatable options: floor play, books, songs, walks, park swings, safe household objects and short outings, rather than constant novelty. That reassurance is part of the product value, not just a nice extra.','for_both','ent_cat_pram_walks','Pram walks and naming trips','Pram walks and naming trips',1,'A walk can solve several jobs: fresh air, rhythm, parent reset and language moments as you name buses, dogs or trees. Community parents mention walks because they are realistic, not because they are glamorous. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Simple ways to fill the day',8,true,'ent_cluster_days','Everyday outings and low-effort play','Parents often worry they are not doing enough at this age. The evidence and community signals point to simple, repeatable options: floor play, books, songs, walks, park swings, safe household objects and short outings, rather than constant novelty. That reassurance is part of the product value, not just a nice extra.','for_both','ent_cat_library_baby_group','Library or baby group floor time','Library or baby group floor time',2,'For parents asking what to do all day, a library or baby group can provide a different room, books, simple songs and social rhythm. It answers the parent job without turning every need into a product. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Simple ways to fill the day',8,true,'ent_cluster_days','Everyday outings and low-effort play','Parents often worry they are not doing enough at this age. The evidence and community signals point to simple, repeatable options: floor play, books, songs, walks, park swings, safe household objects and short outings, rather than constant novelty. That reassurance is part of the product value, not just a nice extra.','for_both','ent_cat_bubbles','Bubbles for watching and reaching','Bubbles for watching and reaching',3,'Bubbles are a community-suggested, low-effort activity. They should remain a weak signal, useful as a supervised parent tool for attention, reaching and laughter rather than a developmental must-have. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Simple ways to fill the day',8,true,'ent_cluster_days','Everyday outings and low-effort play','Parents often worry they are not doing enough at this age. The evidence and community signals point to simple, repeatable options: floor play, books, songs, walks, park swings, safe household objects and short outings, rather than constant novelty. That reassurance is part of the product value, not just a nice extra.','for_both','ent_cat_bath_cups','Bath cups and pouring play','Bath cups and pouring play',4,'Cups in the bath support pouring, filling and nesting while giving parents a predictable activity. The safety wrapper matters more than the toy: water play is only appropriate with continuous supervision. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Simple ways to fill the day',8,true,'ent_cluster_days','Everyday outings and low-effort play','Parents often worry they are not doing enough at this age. The evidence and community signals point to simple, repeatable options: floor play, books, songs, walks, park swings, safe household objects and short outings, rather than constant novelty. That reassurance is part of the product value, not just a nice extra.','for_both','ent_cat_toy_rotation','Tiny toy rotation or activity basket','Tiny toy rotation or activity basket',5,'A tiny rotation basket helps parents who feel they need constant new stimulation. The key is not more toys; it is making a few safe, stage-fit objects feel fresh by changing the setup or context. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_you'),
  ('9-12m','9–12 months',9,12,true,'ent_cluster_days','Simple ways to fill the day',8,true,'ent_cluster_days','Everyday outings and low-effort play','Parents often worry they are not doing enough at this age. The evidence and community signals point to simple, repeatable options: floor play, books, songs, walks, park swings, safe household objects and short outings, rather than constant novelty. That reassurance is part of the product value, not just a nice extra.','for_both','ent_cat_safe_laundry_play','Safe laundry basket play','Safe laundry basket play',6,'Laundry is not a formal recommendation, but it is a real parent adaptation: babies enjoy pulling, dropping and exploring textures. Ember can treat it as an at-home idea only with clear safety screening. It gives parents a concrete, supervised way to support the stage without turning play into pressure.','for_both');

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
  name = COALESCE(NULLIF(dn.name, ''), src.development_need_canonical_name),
  plain_english_description = COALESCE(NULLIF(dn.plain_english_description, ''), src.stage1_why_it_matters_ux_description),
  why_it_matters = COALESCE(NULLIF(dn.why_it_matters, ''), src.stage1_why_it_matters_ux_description),
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
  label = COALESCE(NULLIF(ct.label, ''), src.stage2_category_type_label),
  name = COALESCE(NULLIF(ct.name, ''), src.stage2_category_type_name),
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
