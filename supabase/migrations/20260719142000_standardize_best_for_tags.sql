-- Standardise Stage 3 "best for" taglines as "Best for ..." (founder rule,
-- bug bash 2026-07-19 follow-up, item 6).
--
-- Tags were a mix of formats ("BEST OVERALL BUDGET...", "sensory development",
-- "Highly absorbent and NICU trusted"). Every visible pick now reads
-- "Best for <parent/child situation>", short enough to never clamp.
--
-- Keyed by (age_band_id, category slug, pick_rank). Idempotent.

BEGIN;

WITH new_tags(age_band_id, category_slug, pick_rank, new_tag) AS (
  VALUES
    -- 1-3m: muslins & burp cloths
    ('1-3m', 'cat_burp_cloths_muslins', 1, 'Best for everyday mopping-up'),
    ('1-3m', 'cat_burp_cloths_muslins', 2, 'Best for heavy-duty absorbency'),
    ('1-3m', 'cat_burp_cloths_muslins', 3, 'Best for stocking up on a budget'),
    ('1-3m', 'cat_burp_cloths_muslins', 4, 'Best for simple white basics'),
    ('1-3m', 'cat_burp_cloths_muslins', 5, 'Best for sensitive skin'),
    -- 1-3m: reach & grab toys
    ('1-3m', 'cat_reach_grab_toys', 1, 'Best for first easy grasps'),
    ('1-3m', 'cat_reach_grab_toys', 2, 'Best for grasping and teething'),
    ('1-3m', 'cat_reach_grab_toys', 3, 'Best for sensory exploring'),
    ('1-3m', 'cat_reach_grab_toys', 4, 'Best for an all-in-one starter set'),
    ('1-3m', 'cat_reach_grab_toys', 5, 'Best for natural materials'),
    -- 1-3m: board books
    ('1-3m', 'cat_board_books', 1, 'Best for first face-gazing'),
    ('1-3m', 'cat_board_books', 2, 'Best for building a small library'),
    ('1-3m', 'cat_board_books', 3, 'Best for interactive peekaboo'),
    ('1-3m', 'cat_board_books', 4, 'Best for clear, simple faces'),
    ('1-3m', 'cat_board_books', 5, 'Best for bold black-and-white patterns'),
    -- 1-3m: high-contrast cards
    ('1-3m', 'cat_high_contrast_cards', 1, 'Best for most families'),
    ('1-3m', 'cat_high_contrast_cards', 2, 'Best for a premium feel'),
    ('1-3m', 'cat_high_contrast_cards', 3, 'Best for growing with your baby'),
    ('1-3m', 'cat_high_contrast_cards', 4, 'Best for supporting a small brand'),
    ('1-3m', 'cat_high_contrast_cards', 5, 'Best for month-by-month variety'),
    -- 1-3m: rear-facing car seat
    ('1-3m', 'cat_rear_facing_car_seat', 1, 'Best for all-round ease and safety'),
    ('1-3m', 'cat_rear_facing_car_seat', 2, 'Best for lie-flat comfort'),
    ('1-3m', 'cat_rear_facing_car_seat', 3, 'Best for lightweight transfers'),
    ('1-3m', 'cat_rear_facing_car_seat', 4, 'Best for small and premature babies'),
    ('1-3m', 'cat_rear_facing_car_seat', 5, 'Best for budget 360 rotation'),
    -- 1-3m: firm flat mattress
    ('1-3m', 'cat_firm_flat_mattress', 1, 'Best for budgets, with waterproofing'),
    ('1-3m', 'cat_firm_flat_mattress', 2, 'Best for growing into a toddler bed'),
    ('1-3m', 'cat_firm_flat_mattress', 3, 'Best for allergy-prone families'),
    ('1-3m', 'cat_firm_flat_mattress', 4, 'Best for warm sleepers'),
    ('1-3m', 'cat_firm_flat_mattress', 5, 'Best for premium support'),
    -- 1-3m: washable floor play mat
    ('1-3m', 'cat_washable_floor_play_mat', 1, 'Best for style that lasts'),
    ('1-3m', 'cat_washable_floor_play_mat', 2, 'Best for budget buyers'),
    ('1-3m', 'cat_washable_floor_play_mat', 3, 'Best for sensory-friendly print'),
    ('1-3m', 'cat_washable_floor_play_mat', 4, 'Best for cushioned comfort'),
    ('1-3m', 'cat_washable_floor_play_mat', 5, 'Best for portability'),
    -- 1-3m: baby-safe mirror
    ('1-3m', 'cat_baby_safe_mirror', 1, 'Best for floor play'),
    ('1-3m', 'cat_baby_safe_mirror', 2, 'Best for tummy time'),
    ('1-3m', 'cat_baby_safe_mirror', 3, 'Best for budget floor play'),
    ('1-3m', 'cat_baby_safe_mirror', 4, 'Best for out and about'),
    ('1-3m', 'cat_baby_safe_mirror', 5, 'Best for clipping anywhere'),
    -- 1-3m: soft carrier or sling
    ('1-3m', 'cat_soft_carrier_sling', 1, 'Best for the newborn weeks'),
    ('1-3m', 'cat_soft_carrier_sling', 2, 'Best for longer carries'),
    ('1-3m', 'cat_soft_carrier_sling', 3, 'Best for budget closeness'),
    ('1-3m', 'cat_soft_carrier_sling', 4, 'Best for warm-weather comfort'),
    ('1-3m', 'cat_soft_carrier_sling', 5, 'Best for newborn-to-toddler longevity')
)
UPDATE public.pl_stage3_picks s
SET best_for_tag = nt.new_tag
FROM new_tags nt
JOIN public.pl_category_types ct ON ct.slug = nt.category_slug
WHERE s.age_band_id = nt.age_band_id
  AND s.category_type_id = ct.id
  AND s.pick_rank = nt.pick_rank
  AND s.status = 'visible';

-- 34-36m: reword to the same "Best for ..." standard.
WITH new_tags(age_band_id, category_id, pick_rank, new_tag) AS (
  VALUES
    ('34-36m', '5022d452-1c14-40e3-b62e-d2a46693c129'::uuid, 1, 'Best for travel stories'),
    ('34-36m', '5022d452-1c14-40e3-b62e-d2a46693c129'::uuid, 2, 'Best for big open-ended scenes'),
    ('34-36m', '5022d452-1c14-40e3-b62e-d2a46693c129'::uuid, 3, 'Best for animal story add-ons'),
    ('34-36m', '5022d452-1c14-40e3-b62e-d2a46693c129'::uuid, 4, 'Best for simple vehicle role play'),
    ('34-36m', '5022d452-1c14-40e3-b62e-d2a46693c129'::uuid, 5, 'Best for a cosy town setup'),
    ('34-36m', '726c04fa-9186-43be-a569-8e21d91843ff'::uuid, 1, 'Best for starting conversations'),
    ('34-36m', '726c04fa-9186-43be-a569-8e21d91843ff'::uuid, 2, 'Best for talking about feelings'),
    ('34-36m', '726c04fa-9186-43be-a569-8e21d91843ff'::uuid, 3, 'Best for talk-back reading'),
    ('34-36m', '726c04fa-9186-43be-a569-8e21d91843ff'::uuid, 4, 'Best for rhythm and joining in'),
    ('34-36m', '726c04fa-9186-43be-a569-8e21d91843ff'::uuid, 5, 'Best for guessing what comes next')
)
UPDATE public.pl_stage3_picks s
SET best_for_tag = nt.new_tag
FROM new_tags nt
WHERE s.age_band_id = nt.age_band_id
  AND s.category_type_id = nt.category_id
  AND s.pick_rank = nt.pick_rank
  AND s.status = 'visible';

COMMIT;
