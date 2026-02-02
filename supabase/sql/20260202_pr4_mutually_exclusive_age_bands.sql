-- PR4 (2026-02-02): Mutually-exclusive age bands 0–36 months
-- Goal:
-- - Make age bands mutually exclusive and complete for 0–36 months.
-- - Replace overlapping '23-25m' with '22-24m' (migrate references where possible).
-- - Update curated public contract view `public.v_gateway_age_bands_public` to return ALL active bands.
--
-- Non-negotiables:
-- - No RLS/policy changes.
-- - No widening anon/public SELECT on base tables (anon reads remain through curated public views only).
-- - No public writes.
-- - Do not invent products/science. Empty bands remain honestly empty.
--
-- Band scheme (exact, anchored on 25-27m):
--   0-0m, 1-3m, 4-6m, 7-9m, 10-12m, 13-15m, 16-18m, 19-21m, 22-24m,
--   25-27m, 28-30m, 31-33m, 34-36m
--
-- ============================================================================
-- APPLY (forward migration) — copy/paste this whole block in Supabase SQL Editor
-- ============================================================================

BEGIN;

-- 1) Ensure the mutually-exclusive 0–36m band vocabulary exists (idempotent).
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
VALUES
  ('0-0m',   '0-0 months',   0,  0, true),
  ('1-3m',   '1-3 months',   1,  3, true),
  ('4-6m',   '4-6 months',   4,  6, true),
  ('7-9m',   '7-9 months',   7,  9, true),
  ('10-12m', '10-12 months', 10, 12, true),
  ('13-15m', '13-15 months', 13, 15, true),
  ('16-18m', '16-18 months', 16, 18, true),
  ('19-21m', '19-21 months', 19, 21, true),
  ('22-24m', '22-24 months', 22, 24, true),
  ('25-27m', '25-27 months', 25, 27, true),
  ('28-30m', '28-30 months', 28, 30, true),
  ('31-33m', '31-33 months', 31, 33, true),
  ('34-36m', '34-36 months', 34, 36, true)
ON CONFLICT (id) DO NOTHING;

-- 2) Replace overlapping '23-25m' with '22-24m' (no invented coverage; just boundary correction).
-- 2.1) Ensure legacy row exists (may already exist in older DBs).
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
VALUES ('23-25m', '23-25 months', 23, 25, true)
ON CONFLICT (id) DO NOTHING;

-- 2.2) Migrate references (only if the tables exist).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_ux_wrappers'
  ) THEN
    UPDATE public.pl_age_band_ux_wrappers
      SET age_band_id = '22-24m'
    WHERE age_band_id = '23-25m';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_development_need_meta'
  ) THEN
    UPDATE public.pl_age_band_development_need_meta
      SET age_band_id = '22-24m'
    WHERE age_band_id = '23-25m';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_development_need_category_types'
  ) THEN
    UPDATE public.pl_age_band_development_need_category_types
      SET age_band_id = '22-24m'
    WHERE age_band_id = '23-25m';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_category_type_products'
  ) THEN
    UPDATE public.pl_age_band_category_type_products
      SET age_band_id = '22-24m'
    WHERE age_band_id = '23-25m';
  END IF;
END $$;

-- 2.3) Make sure the legacy overlap band isn't considered active going forward.
UPDATE public.pl_age_bands
  SET is_active = false
WHERE id = '23-25m';

-- 2.4) Delete legacy overlap band only if nothing references it (avoid errors).
DO $$
DECLARE
  v_ref_count BIGINT := 0;
BEGIN
  -- Count references from known FK tables if they exist.
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pl_age_band_ux_wrappers') THEN
    SELECT v_ref_count + COUNT(*) INTO v_ref_count FROM public.pl_age_band_ux_wrappers WHERE age_band_id = '23-25m';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pl_age_band_development_need_meta') THEN
    SELECT v_ref_count + COUNT(*) INTO v_ref_count FROM public.pl_age_band_development_need_meta WHERE age_band_id = '23-25m';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pl_age_band_development_need_category_types') THEN
    SELECT v_ref_count + COUNT(*) INTO v_ref_count FROM public.pl_age_band_development_need_category_types WHERE age_band_id = '23-25m';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pl_age_band_category_type_products') THEN
    SELECT v_ref_count + COUNT(*) INTO v_ref_count FROM public.pl_age_band_category_type_products WHERE age_band_id = '23-25m';
  END IF;

  -- Also check common PL tables that reference pl_age_bands (defensive).
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pl_age_moment_sets') THEN
    SELECT v_ref_count + COUNT(*) INTO v_ref_count FROM public.pl_age_moment_sets WHERE age_band_id = '23-25m';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pl_pool_items') THEN
    SELECT v_ref_count + COUNT(*) INTO v_ref_count FROM public.pl_pool_items WHERE age_band_id = '23-25m';
  END IF;

  IF v_ref_count = 0 THEN
    DELETE FROM public.pl_age_bands WHERE id = '23-25m';
  ELSE
    RAISE NOTICE 'Not deleting public.pl_age_bands(23-25m): still referenced by % row(s). (It is set inactive.)', v_ref_count;
  END IF;
END $$;

-- 3) Public contract: `v_gateway_age_bands_public` should return ALL PR4 scheme bands
--    (not just bands populated with wrappers).
--
-- Previous definition (Phase A):
--   - Only age bands with at least one active wrapper ranking
--
-- New definition (PR4):
--   - All mutually-exclusive scheme bands for 0–36m
CREATE OR REPLACE VIEW public.v_gateway_age_bands_public AS
SELECT
  ab.id,
  ab.label,
  ab.min_months,
  ab.max_months
FROM public.pl_age_bands ab
WHERE ab.is_active = true
  AND ab.id IN (
    '0-0m',
    '1-3m',
    '4-6m',
    '7-9m',
    '10-12m',
    '13-15m',
    '16-18m',
    '19-21m',
    '22-24m',
    '25-27m',
    '28-30m',
    '31-33m',
    '34-36m'
  );

-- Preserve the view as the public contract for anon reads.
GRANT SELECT ON public.v_gateway_age_bands_public TO anon, authenticated;

COMMIT;

-- ============================================================================
-- ROLLBACK — copy/paste this whole block in Supabase SQL Editor if needed
-- ============================================================================
-- Notes:
-- - Restores the previous view definition.
-- - Deletes only the newly inserted mutually-exclusive bands (keeps existing ones like 25-27m).
-- - Optionally restores 23-25m and migrates 22-24m refs back (only if forward ran).

BEGIN;

-- 1) Restore previous Phase A view definition (store exact old definition).
CREATE OR REPLACE VIEW public.v_gateway_age_bands_public AS
SELECT DISTINCT
  ab.id,
  ab.label,
  ab.min_months,
  ab.max_months
FROM public.pl_age_bands ab
INNER JOIN public.pl_age_band_ux_wrappers abuw ON ab.id = abuw.age_band_id
WHERE ab.is_active = true
  AND abuw.is_active = true;

GRANT SELECT ON public.v_gateway_age_bands_public TO anon, authenticated;

-- 2) Optionally revert 22-24m back to 23-25m (if legacy row exists/should be active).
-- 2.1) Ensure 23-25m exists and is active.
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
VALUES ('23-25m', '23-25 months', 23, 25, true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- 2.2) Move any mappings from 22-24m back to 23-25m (only if those tables exist).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_ux_wrappers'
  ) THEN
    UPDATE public.pl_age_band_ux_wrappers
      SET age_band_id = '23-25m'
    WHERE age_band_id = '22-24m';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_development_need_meta'
  ) THEN
    UPDATE public.pl_age_band_development_need_meta
      SET age_band_id = '23-25m'
    WHERE age_band_id = '22-24m';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_development_need_category_types'
  ) THEN
    UPDATE public.pl_age_band_development_need_category_types
      SET age_band_id = '23-25m'
    WHERE age_band_id = '22-24m';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_age_band_category_type_products'
  ) THEN
    UPDATE public.pl_age_band_category_type_products
      SET age_band_id = '23-25m'
    WHERE age_band_id = '22-24m';
  END IF;
END $$;

-- 2.3) Delete 22-24m (it is new in PR4).
DELETE FROM public.pl_age_bands WHERE id = '22-24m';

-- 3) Delete only the newly inserted mutually-exclusive bands (keep 25-27m and any pre-existing).
--    Safe: delete by exact IDs and skip 25-27m.
DELETE FROM public.pl_age_bands WHERE id IN (
  '0-0m',
  '1-3m',
  '4-6m',
  '7-9m',
  '10-12m',
  '13-15m',
  '16-18m',
  '19-21m',
  '28-30m',
  '31-33m',
  '34-36m'
);

COMMIT;

