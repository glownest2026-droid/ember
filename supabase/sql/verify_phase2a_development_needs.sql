-- Phase 2A Verification Queries
-- Run these after applying: 202601150000_phase2a_canonise_layer_a_development_needs.sql
-- Date: 2026-01-15

-- ============================================================================
-- A) Schema Verification
-- ============================================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'pl_development_needs'
ORDER BY ordinal_position;

-- ============================================================================
-- B) Row Count
-- ============================================================================
SELECT COUNT(*) as total_rows FROM public.pl_development_needs;

-- ============================================================================
-- C) Sample Rows (Sanity)
-- ============================================================================
SELECT 
  need_name, 
  slug, 
  min_month, 
  max_month, 
  stage_anchor_month
FROM public.pl_development_needs
ORDER BY need_name
LIMIT 5;

-- ============================================================================
-- D) Constraints / Uniqueness
-- ============================================================================

-- Confirm no duplicate need_name
SELECT need_name, COUNT(*) as c
FROM public.pl_development_needs
GROUP BY need_name
HAVING COUNT(*) > 1;

-- Confirm slug uniqueness
SELECT slug, COUNT(*) as c
FROM public.pl_development_needs
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1;

-- ============================================================================
-- E) Null Checks for Required Fields
-- ============================================================================
SELECT
  SUM((need_name IS NULL)::int) as null_need_name,
  SUM((plain_english_description IS NULL)::int) as null_desc,
  SUM((why_it_matters IS NULL)::int) as null_why,
  SUM((min_month IS NULL)::int) as null_min,
  SUM((max_month IS NULL)::int) as null_max
FROM public.pl_development_needs;

-- ============================================================================
-- F) Evidence URLs Sanity
-- ============================================================================
SELECT 
  need_name, 
  array_length(evidence_urls, 1) as n_urls
FROM public.pl_development_needs
ORDER BY n_urls DESC NULLS LAST
LIMIT 5;

-- ============================================================================
-- G) RLS Verification
-- ============================================================================

-- Check if RLS is enabled
SELECT relrowsecurity as rls_enabled
FROM pg_class
WHERE oid = 'public.pl_development_needs'::regclass;

-- List policies on pl_development_needs
SELECT 
  polname as policy_name,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'pl_development_needs'
ORDER BY polname;

-- ============================================================================
-- H) All 12 Needs Present
-- ============================================================================
SELECT need_name, slug, min_month, max_month
FROM public.pl_development_needs
ORDER BY need_name;



