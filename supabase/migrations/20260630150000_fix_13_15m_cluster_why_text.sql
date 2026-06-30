-- Restore full Stage 1 "Why this matters now" copy for 13–15m.
-- v5 workbook cluster_why_it_matters_long cells were truncated at ~80 chars with "...".
-- Source: Conor-grade v3 import (20260630120000).

BEGIN;

CREATE TEMP TABLE tmp_cluster_why_fix (
  wrapper_slug TEXT PRIMARY KEY,
  why_text TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_cluster_why_fix (wrapper_slug, why_text) VALUES
  ('ent_cluster_working_things_out', 'Your toddler may be doing more than grabbing and banging. They may be testing what happens: posting, tipping, stacking, hiding and trying the same thing again. Familiar first-year toys can suddenly work harder when they are set up for small, repeatable experiments.'),
  ('ent_cluster_telling_things', 'Your toddler may still have only a few clear words, but pointing, sounds, looks and choices can start doing more of the talking. Books, walks, familiar objects and small choices give them reasons to show you what they mean.'),
  ('ent_cluster_copying_day', 'Everyday objects may suddenly beat toy versions because they look like your life. Your toddler may want the spoon, cloth, brush, keys or bowl you are actually using. Safe imitation gives them a way to join the day without taking over the real job.'),
  ('ent_cluster_braver_feet', 'Movement may become more purposeful: carrying something, reaching for something, pushing, pulling, climbing or going after a ball. The aim is not to rush walking, but to give new movement a safe reason and enough space.'),
  ('ent_cluster_meals_charge', 'Mealtimes may become more about joining in, not just being fed. Your toddler may want to hold the spoon, copy your cup or try food from the family plate. A little setup makes the practice easier to live with.'),
  ('ent_cluster_first_marks', 'This is not about drawing properly. It is about noticing that a hand movement can leave a mark: pressure, grip, movement and “I did that”. Keep it short, close and easy to clean up.'),
  ('ent_cluster_joining_in', 'You may have sung the same songs for months. The change now is that your toddler may start anticipating the fun bit, copying the action and asking for it again. Simple pauses and turns help them take part.'),
  ('ent_cluster_suddenly_everything', 'Curiosity may get faster, taller and more determined. The room that worked last month may suddenly have new hazards at toddler height, from stairs and cords to small objects and cupboards. This is a practical check, not a full-house panic.'),
  ('ent_cluster_between_baby_toddler', 'This is the awkward middle: more will, more frustration, still not many words. Your toddler may want to do more for themselves, then need you close two minutes later. Small choices and repeated endings can make the day feel more predictable.'),
  ('ent_cluster_change_scene', 'The usual things may still work, but they might need a small twist. A walk, bath or library visit can do more if it has a little purpose: something to point at, pour, carry, hear or name.');

UPDATE public.pl_ux_wrappers uw
SET ux_description = f.why_text
FROM tmp_cluster_why_fix f
WHERE uw.ux_slug = f.wrapper_slug;

COMMIT;
