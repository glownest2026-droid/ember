-- Move gift-buyer copy out of ownership_note (parent view must not show Thea/gift lines).

BEGIN;

UPDATE public.pl_age_band_development_need_category_types
SET ownership_note = NULL
WHERE ownership_note IS NOT NULL
  AND (
    ownership_note ILIKE 'High chance the family owns%'
    OR ownership_note ILIKE 'Good gift%'
    OR ownership_note ILIKE 'A practical gift%'
    OR ownership_note ILIKE 'A familiar gift%'
    OR ownership_note ILIKE 'A more thoughtful gift%'
    OR ownership_note ILIKE 'A more thoughtful idea%'
    OR ownership_note ILIKE 'Thoughtful if age-fit%'
    OR ownership_note ILIKE 'If the family already owns%'
    OR ownership_note ILIKE 'Choose this only if it adds a clearer age-fit%'
    OR ownership_note ILIKE 'Common ownership risk%'
    OR ownership_note ILIKE 'High ownership risk%'
    OR ownership_note ILIKE 'Look for the stage shift:%rather than simply more of the same%'
  );

COMMIT;
