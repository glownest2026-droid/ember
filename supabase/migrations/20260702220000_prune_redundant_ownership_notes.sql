-- Prune well-duh ownership_note copy from Stage 2 junction rows.
-- Keeps genuinely useful notes (safety, gift-buyer fit, non-obvious hacks).
-- Idempotent: safe to re-run.

BEGIN;

UPDATE public.pl_age_band_development_need_category_types
SET ownership_note = NULL
WHERE ownership_note IS NOT NULL
  AND (
    ownership_note ILIKE 'Borrow or reuse%'
    OR ownership_note ILIKE 'If you already have something similar%'
    OR ownership_note ILIKE 'If the family already owns something similar%'
    OR ownership_note ILIKE 'If you already have a %'
    OR ownership_note ILIKE 'If they already have %'
    OR ownership_note ILIKE 'Use photos you already have%'
    OR ownership_note ILIKE 'Use a small cup if you already have%'
    OR ownership_note ILIKE 'Use a real basket%'
    OR ownership_note ILIKE 'Give one a caring role before buying%'
    OR ownership_note ILIKE 'A favourite soft toy can become a puppet%'
    OR ownership_note ILIKE 'Choose this only if it adds a clearer age-fit%'
    OR ownership_note ILIKE 'If blocks are already out%'
    OR ownership_note ILIKE 'Cups, bowls or bath toys may already cover%'
    OR ownership_note ILIKE 'Useful if you do not already have%'
    OR ownership_note ILIKE 'If you already have lots of %'
    OR ownership_note ILIKE 'Skip this and choose%'
    OR ownership_note ILIKE 'Common ownership risk is medium, so check whether they already have one%'
    OR ownership_note ILIKE 'If they already have a rattle%'
    OR ownership_note ILIKE 'If they already have a good mat%'
    OR ownership_note ILIKE 'If they already have books, choose%'
    OR ownership_note ILIKE 'If they already have soft toys%'
  );

COMMIT;
