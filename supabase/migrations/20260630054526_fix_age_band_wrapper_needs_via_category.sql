-- Replace slug-based wrapper→need view: production need slugs often differ from spine
-- projection labels. Resolve development_need_id via anchored category_type slugs instead.

DROP VIEW IF EXISTS public.v_gateway_age_band_wrapper_needs_public;

CREATE VIEW public.v_gateway_age_band_wrapper_needs_public AS
WITH spine_v2_mapping (age_band_id, wrapper_slug, category_slug, need_rank) AS (
  VALUES
    ('1-3m', 'ent_cluster_faces_smiles_chats', 'cat_face_to_face_play', 1),
    ('1-3m', 'ent_cluster_listen_and_coo', 'cat_familiar_voice_pauses', 1),
    ('1-3m', 'ent_cluster_listen_and_coo', 'cat_sound_cylinders_shakers', 2),
    ('1-3m', 'ent_cluster_watching_tracking', 'cat_high_contrast_cards', 1),
    ('1-3m', 'ent_cluster_tummy_head_control', 'cat_tummy_time_mat', 1),
    ('1-3m', 'ent_cluster_kicks_wriggles', 'cat_kicky_floor_play', 1),
    ('1-3m', 'ent_cluster_kicks_wriggles', 'cat_play_gym_hanging_toys', 2),
    ('1-3m', 'ent_cluster_kicks_wriggles', 'cat_safe_floor_space', 3),
    ('1-3m', 'ent_cluster_first_grasps', 'cat_reach_grab_toys', 1),
    ('1-3m', 'ent_cluster_calm_crying_settling', 'cat_white_noise_soother', 1),
    ('1-3m', 'ent_cluster_feeding_clean_kit', 'cat_responsive_feeding_support', 1),
    ('1-3m', 'ent_cluster_safe_sleep_setup', 'cat_safe_sleep_continuity', 1),
    ('1-3m', 'ent_cluster_health_first_trips', 'cat_red_book_vaccine_planning', 1),
    ('4-6m', 'ent_cluster_4_6_floor_strength', 'cat_tummy_time_mat', 1),
    ('4-6m', 'ent_cluster_4_6_hands', 'cat_reach_grab_toys', 1),
    ('4-6m', 'cluster_mouth_sensory', 'cat_teethers', 1),
    ('4-6m', 'ent_cluster_4_6_faces_sounds', 'cat_board_books', 1),
    ('4-6m', 'ent_cluster_4_6_cause_effect', 'cat_crinkle_cloth_toys', 1),
    ('4-6m', 'ent_cluster_4_6_body_world', 'cat_parts_of_me_books', 1),
    ('4-6m', 'cluster_first_foods', 'cat_highchair', 1),
    ('4-6m', 'ent_cluster_4_6_safety', 'cat_safe_sleep_continuity', 1),
    ('9-12m', 'ent_cluster_move', 'cat_floor_zone', 1),
    ('9-12m', 'ent_cluster_hands', 'cat_pincer_puzzle', 1),
    ('9-12m', 'ent_cluster_hands', 'cat_stacking_nesting_cups', 2),
    ('9-12m', 'ent_cluster_hands', 'cat_container_basket', 3),
    ('9-12m', 'ent_cluster_hands', 'cat_safe_household_objects', 4),
    ('9-12m', 'ent_cluster_solve', 'cat_peekaboo_scarf', 1),
    ('9-12m', 'ent_cluster_solve', 'cat_drop_roll_tubes', 2),
    ('9-12m', 'ent_cluster_words', 'cat_board_books', 1),
    ('9-12m', 'ent_cluster_words', 'cat_rhyme_games', 2),
    ('9-12m', 'ent_cluster_feeding', 'cat_highchair', 1),
    ('9-12m', 'ent_cluster_feeding', 'cat_bibs_mats', 2),
    ('9-12m', 'ent_cluster_safety', 'cat_stair_gates', 1),
    ('9-12m', 'ent_cluster_safety', 'cat_bath_supervision', 2),
    ('9-12m', 'ent_cluster_stories', 'cat_feelings_faces_books', 1),
    ('9-12m', 'ent_cluster_stories', 'cat_animal_mini_books', 2),
    ('9-12m', 'ent_cluster_stories', 'cat_texture_sensory', 3),
    ('9-12m', 'ent_cluster_days', 'cat_pram_walks', 1),
    ('13-15m', 'ent_cluster_move', 'cat_safe_floor_space', 1),
    ('13-15m', 'ent_cluster_hands', 'cat_stacking_nesting_cups', 1),
    ('13-15m', 'ent_cluster_words', 'cat_board_books', 1),
    ('13-15m', 'ent_cluster_copying_everyday', 'cat_safe_household_objects', 1),
    ('13-15m', 'ent_cluster_feeding', 'cat_highchair', 1),
    ('13-15m', 'ent_cluster_routines_feelings', 'cat_bedtime_board_books', 1),
    ('13-15m', 'ent_cluster_safety', 'cat_safety_gates', 1),
    ('13-15m', 'ent_cluster_days', 'cat_pram_walks', 1),
    ('16-18m', 'ent_cluster_16_18_little_adventures', 'cat_soft_graspable_balls', 1),
    ('16-18m', 'ent_cluster_16_18_busy_hands', 'cat_threading_beads', 1),
    ('16-18m', 'ent_cluster_16_18_cause_effect', 'cat_ramp_rolling_toys', 1),
    ('16-18m', 'ent_cluster_16_18_words_instructions', 'cat_first_word_picture_books', 1),
    ('16-18m', 'ent_cluster_16_18_copying_life', 'cat_doll_soft_toy_care', 1),
    ('16-18m', 'ent_cluster_16_18_mark_mess', 'cat_chunky_crayons', 1),
    ('16-18m', 'ent_cluster_16_18_daily_practice', 'cat_open_cup', 1),
    ('16-18m', 'ent_cluster_16_18_safer_home', 'cat_safety_gates', 1)
)
SELECT DISTINCT
  m.age_band_id,
  uw.id AS ux_wrapper_id,
  uw.ux_slug AS wrapper_slug,
  abdnct.development_need_id,
  dn.slug AS development_need_slug,
  m.need_rank
FROM spine_v2_mapping m
JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(m.wrapper_slug)
JOIN public.pl_category_types ct ON LOWER(ct.slug) = LOWER(m.category_slug)
JOIN public.pl_age_band_development_need_category_types abdnct
  ON abdnct.age_band_id = m.age_band_id
  AND abdnct.category_type_id = ct.id
  AND abdnct.is_active = true
JOIN public.pl_development_needs dn ON dn.id = abdnct.development_need_id
WHERE uw.is_active = true;

GRANT SELECT ON public.v_gateway_age_band_wrapper_needs_public TO anon, authenticated;
