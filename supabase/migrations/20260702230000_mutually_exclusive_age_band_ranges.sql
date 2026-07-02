-- Mutually exclusive age band month ranges (no overlap at band boundaries).
-- Band ids stay stable for catalogue data; labels and ranges match the slider.
-- 4–6, 7–9, 10–12 (not 6–9 / 9–12).

BEGIN;

UPDATE public.pl_age_bands
SET
  label = '7–9 months',
  min_months = 7,
  max_months = 9
WHERE id = '6-9m';

UPDATE public.pl_age_bands
SET
  label = '10–12 months',
  min_months = 10,
  max_months = 12
WHERE id = '9-12m';

COMMIT;
