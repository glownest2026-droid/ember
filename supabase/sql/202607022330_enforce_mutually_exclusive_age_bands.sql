-- Enforce mutually exclusive age-band month ranges (idempotent).
-- Band ids stay stable for catalogue FKs; labels match slider min–max.
-- Also re-applies after catalogue imports that reset ranges from workbook slugs.

BEGIN;

-- Early years (gap between bands: 4–6, then 7–9, then 10–12)
UPDATE public.pl_age_bands SET label = '7–9 months', min_months = 7, max_months = 9 WHERE id = '6-9m';
UPDATE public.pl_age_bands SET label = '10–12 months', min_months = 10, max_months = 12 WHERE id = '9-12m';

-- Toddler bands — remove 24–30 umbrella overlap with 25–27
UPDATE public.pl_age_bands SET is_active = false, label = label || ' [deprecated — pre-Spine 2.0]' WHERE id = '24_30m';

-- Ensure standard ladder has no month overlap (deactivate deprecated legacy bands if present)
UPDATE public.pl_age_bands SET is_active = false WHERE id IN ('22-24m', '28-30m', '34-36m') AND is_active = true;

COMMIT;
