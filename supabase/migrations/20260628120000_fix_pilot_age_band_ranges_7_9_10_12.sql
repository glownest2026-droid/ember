-- Correct pilot Discover age-band month ranges: 6-9m → 7-9 months, 9-12m → 10-12 months.
-- Band ids stay stable for catalogue FKs; labels and min/max drive slider + routing.

BEGIN;

UPDATE public.pl_age_bands
SET
  label = '7–9 months',
  min_months = 7,
  max_months = 9,
  is_active = true,
  updated_at = now()
WHERE id = '6-9m';

UPDATE public.pl_age_bands
SET
  label = '10–12 months',
  min_months = 10,
  max_months = 12,
  is_active = true,
  updated_at = now()
WHERE id = '9-12m';

COMMIT;
