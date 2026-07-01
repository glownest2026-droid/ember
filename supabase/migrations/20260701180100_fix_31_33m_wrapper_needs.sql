-- Wire 31–33m Conor+Thea depth v2 clusters to development needs for Discover Stage 2.

DROP VIEW IF EXISTS public.v_gateway_age_band_wrapper_needs_public;

CREATE VIEW public.v_gateway_age_band_wrapper_needs_public AS
WITH spine_v2_mapping (age_band_id, wrapper_slug, need_slug, need_rank) AS (
  VALUES
    ('1-3m', 'ent_cluster_faces_smiles_chats', 'ent_need_face_smile_chat', 1),
    ('1-3m', 'ent_cluster_listen_and_coo', 'ent_need_face_smile_chat', 1),
    ('1-3m', 'ent_cluster_listen_and_coo', 'ent_need_visual_tracking', 2),
    ('1-3m', 'ent_cluster_listen_and_coo', 'ent_need_1_3_listen_play_depth', 3),
    ('1-3m', 'ent_cluster_watching_tracking', 'ent_need_visual_tracking', 1),
    ('1-3m', 'ent_cluster_watching_tracking', 'ent_need_1_3_watching_play_depth', 2),
    ('1-3m', 'ent_cluster_tummy_head_control', 'ent_need_tummy_head_control', 1),
    ('1-3m', 'ent_cluster_tummy_head_control', 'ent_need_1_3_tummy_play_depth', 2),
    ('1-3m', 'ent_cluster_kicks_wriggles', 'ent_need_first_grasps', 1),
    ('1-3m', 'ent_cluster_kicks_wriggles', 'ent_need_visual_tracking', 2),
    ('1-3m', 'ent_cluster_kicks_wriggles', 'ent_need_tummy_head_control', 3),
    ('1-3m', 'ent_cluster_kicks_wriggles', 'ent_need_1_3_kicks_play_depth', 4),
    ('1-3m', 'ent_cluster_first_grasps', 'ent_need_first_grasps', 1),
    ('1-3m', 'ent_cluster_first_grasps', 'ent_need_1_3_grasps_play_depth', 2),
    ('1-3m', 'ent_cluster_calm_crying_settling', 'ent_need_crying_settling', 1),
    ('1-3m', 'ent_cluster_feeding_clean_kit', 'ent_need_feeding_rhythm', 1),
    ('1-3m', 'ent_cluster_safe_sleep_setup', 'ent_need_safe_sleep_setup', 1),
    ('1-3m', 'ent_cluster_health_first_trips', 'ent_need_health_first_trips', 1),
    ('4-6m', 'ent_cluster_4_6_floor_strength', 'ent_need_4_6_floor_strength', 1),
    ('4-6m', 'ent_cluster_4_6_hands', 'ent_need_4_6_hand_control', 1),
    ('4-6m', 'cluster_mouth_sensory', 'ent_need_4_6_mouth_sensory', 1),
    ('4-6m', 'ent_cluster_4_6_faces_sounds', 'ent_need_4_6_social_communication', 1),
    ('4-6m', 'ent_cluster_4_6_cause_effect', 'ent_need_4_6_cause_effect', 1),
    ('4-6m', 'ent_cluster_4_6_body_world', 'ent_need_4_6_body_awareness', 1),
    ('4-6m', 'cluster_first_foods', 'ent_need_4_6_first_foods', 1),
    ('4-6m', 'ent_cluster_4_6_safety', 'ent_need_4_6_safety_setup', 1),
    ('9-12m', 'ent_cluster_move', 'ent_need_mobility', 1),
    ('9-12m', 'ent_cluster_hands', 'ent_need_pincer', 1),
    ('9-12m', 'ent_cluster_hands', 'ent_need_bilateral', 2),
    ('9-12m', 'ent_cluster_hands', 'ent_need_container', 3),
    ('9-12m', 'ent_cluster_hands', 'ent_need_parent_day', 4),
    ('9-12m', 'ent_cluster_solve', 'ent_need_container', 1),
    ('9-12m', 'ent_cluster_solve', 'ent_need_cause', 2),
    ('9-12m', 'ent_cluster_words', 'ent_need_books', 1),
    ('9-12m', 'ent_cluster_words', 'ent_need_gestures', 2),
    ('9-12m', 'ent_cluster_feeding', 'ent_need_self_feeding', 1),
    ('9-12m', 'ent_cluster_feeding', 'ent_need_mealtime', 2),
    ('9-12m', 'ent_cluster_safety', 'ent_need_babyproof', 1),
    ('9-12m', 'ent_cluster_safety', 'ent_need_bath', 2),
    ('9-12m', 'ent_cluster_stories', 'ent_need_emotion', 1),
    ('9-12m', 'ent_cluster_stories', 'ent_need_books', 2),
    ('9-12m', 'ent_cluster_stories', 'ent_need_bilateral', 3),
    ('9-12m', 'ent_cluster_days', 'ent_need_parent_day', 1),
    ('13-15m', 'ent_cluster_move', 'ent_need_13_15_safe_movement', 1),
    ('13-15m', 'ent_cluster_hands', 'ent_need_13_15_hands_experiments', 1),
    ('13-15m', 'ent_cluster_words', 'ent_need_13_15_words_pointing', 1),
    ('13-15m', 'ent_cluster_copying_everyday', 'ent_need_13_15_copying_everyday', 1),
    ('13-15m', 'ent_cluster_feeding', 'ent_job_13_15_self_feeding', 1),
    ('13-15m', 'ent_cluster_routines_feelings', 'ent_job_13_15_routines_feelings', 1),
    ('13-15m', 'ent_cluster_safety', 'ent_job_13_15_home_safety', 1),
    ('13-15m', 'ent_cluster_days', 'ent_job_13_15_day_resets', 1),
    ('16-18m', 'ent_cluster_16_18_little_adventures', 'ent_need_16_18_movement_adventure', 1),
    ('16-18m', 'ent_cluster_16_18_busy_hands', 'ent_need_16_18_fine_motor_two_hands', 1),
    ('16-18m', 'ent_cluster_16_18_cause_effect', 'ent_need_16_18_cause_effect_problem_solving', 1),
    ('16-18m', 'ent_cluster_16_18_words_instructions', 'ent_need_16_18_words_body_parts_directions', 1),
    ('16-18m', 'ent_cluster_16_18_copying_life', 'ent_need_16_18_copying_pretend_care', 1),
    ('16-18m', 'ent_cluster_16_18_mark_mess', 'ent_need_16_18_scribbles_sensory', 1),
    ('16-18m', 'ent_cluster_16_18_daily_practice', 'ent_job_16_18_daily_care_practice', 1),
    ('16-18m', 'ent_cluster_16_18_safer_home', 'ent_job_16_18_home_safety', 1),
    ('31-33m', 'ent_cluster_asking_what_happens_next', 'ent_need_31_33_sequences_problem_solving', 1),
    ('31-33m', 'ent_cluster_telling_my_version', 'ent_need_31_33_language_retelling_feelings', 1),
    ('31-33m', 'ent_cluster_pretend_worlds_bigger', 'ent_need_31_33_richer_pretend_play', 1),
    ('31-33m', 'ent_cluster_playing_with_people', 'ent_need_31_33_peer_turn_taking', 1),
    ('31-33m', 'ent_cluster_real_job_to_do', 'ent_need_31_33_helping_independence', 1),
    ('31-33m', 'ent_cluster_hands_make_more', 'ent_need_31_33_fine_motor_making', 1),
    ('31-33m', 'ent_cluster_balance_bravery', 'ent_need_31_33_gross_motor_confidence', 1),
    ('31-33m', 'ent_cluster_water_colour_mess', 'ent_need_31_33_sensory_messy_experimenting', 1)
)
SELECT
  m.age_band_id,
  uw.id AS ux_wrapper_id,
  uw.ux_slug AS wrapper_slug,
  dn.id AS development_need_id,
  dn.slug AS development_need_slug,
  m.need_rank
FROM spine_v2_mapping m
JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(m.wrapper_slug)
JOIN public.pl_development_needs dn ON LOWER(dn.slug) = LOWER(m.need_slug)
WHERE uw.is_active = true;

GRANT SELECT ON public.v_gateway_age_band_wrapper_needs_public TO anon, authenticated;
