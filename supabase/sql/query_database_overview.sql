-- Database Overview Queries
-- Run this in Supabase SQL Editor to get row counts and sample data
-- Date: 2026-01-14

-- ============================================================================
-- PART 1: ROW COUNTS PER TABLE
-- ============================================================================

SELECT 
  schemaname,
  relname as tablename,
  n_live_tup as row_count,
  n_dead_tup as dead_rows,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY relname;

-- ============================================================================
-- PART 2: SAMPLE ROWS FROM EACH TABLE
-- ============================================================================

-- Core Tables
SELECT 'products' as table_name, COUNT(*) as total_rows FROM public.products;
SELECT * FROM public.products LIMIT 3;

SELECT 'children' as table_name, COUNT(*) as total_rows FROM public.children;
SELECT * FROM public.children LIMIT 3;

SELECT 'clicks' as table_name, COUNT(*) as total_rows FROM public.clicks;
SELECT * FROM public.clicks LIMIT 3;

SELECT 'site_settings' as table_name, COUNT(*) as total_rows FROM public.site_settings;
SELECT * FROM public.site_settings;

-- Product Library Tables
SELECT 'pl_age_bands' as table_name, COUNT(*) as total_rows FROM public.pl_age_bands;
SELECT * FROM public.pl_age_bands ORDER BY min_months LIMIT 5;

SELECT 'pl_moments' as table_name, COUNT(*) as total_rows FROM public.pl_moments;
SELECT * FROM public.pl_moments WHERE is_active = true LIMIT 5;

SELECT 'pl_dev_tags' as table_name, COUNT(*) as total_rows FROM public.pl_dev_tags;
SELECT * FROM public.pl_dev_tags LIMIT 5;

SELECT 'pl_category_types' as table_name, COUNT(*) as total_rows FROM public.pl_category_types;
SELECT * FROM public.pl_category_types LIMIT 5;

SELECT 'pl_age_moment_sets' as table_name, COUNT(*) as total_rows FROM public.pl_age_moment_sets;
SELECT 
  ams.*,
  ab.label as age_band_label,
  m.label as moment_label
FROM public.pl_age_moment_sets ams
LEFT JOIN public.pl_age_bands ab ON ams.age_band_id = ab.id
LEFT JOIN public.pl_moments m ON ams.moment_id = m.id
ORDER BY ams.created_at DESC
LIMIT 5;

SELECT 'pl_reco_cards' as table_name, COUNT(*) as total_rows FROM public.pl_reco_cards;
SELECT 
  rc.*,
  ams.status as set_status,
  ct.label as category_type_label,
  p.name as product_name
FROM public.pl_reco_cards rc
LEFT JOIN public.pl_age_moment_sets ams ON rc.set_id = ams.id
LEFT JOIN public.pl_category_types ct ON rc.category_type_id = ct.id
LEFT JOIN public.products p ON rc.product_id = p.id
ORDER BY rc.created_at DESC
LIMIT 5;

SELECT 'pl_evidence' as table_name, COUNT(*) as total_rows FROM public.pl_evidence;
SELECT * FROM public.pl_evidence ORDER BY created_at DESC LIMIT 5;

SELECT 'pl_pool_items' as table_name, COUNT(*) as total_rows FROM public.pl_pool_items;
SELECT * FROM public.pl_pool_items ORDER BY created_at DESC LIMIT 5;

SELECT 'pl_need_ux_labels' as table_name, COUNT(*) as total_rows FROM public.pl_need_ux_labels;
SELECT * FROM public.pl_need_ux_labels WHERE is_primary = true AND is_active = true ORDER BY ux_label LIMIT 12;

-- Check for legacy pl_card_evidence table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_card_evidence'
  ) THEN
    RAISE NOTICE 'pl_card_evidence table exists';
  ELSE
    RAISE NOTICE 'pl_card_evidence table does not exist';
  END IF;
END $$;

-- ============================================================================
-- PART 3: VERIFY REFERENCED TABLES (may not exist in migrations)
-- ============================================================================

-- Check if user_roles exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) THEN 'EXISTS'
    ELSE 'MISSING'
  END as user_roles_status;

-- If exists, show schema and sample
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_roles'
  ) THEN
    RAISE NOTICE 'user_roles table exists - querying...';
  END IF;
END $$;

-- Check if waitlist exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'waitlist'
    ) THEN 'EXISTS'
    ELSE 'MISSING'
  END as waitlist_status;

-- Check if play_idea exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'play_idea'
    ) THEN 'EXISTS'
    ELSE 'MISSING'
  END as play_idea_status;

-- Check if pl_development_needs exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'pl_development_needs'
    ) THEN 'EXISTS'
    ELSE 'MISSING'
  END as pl_development_needs_status;

-- If pl_development_needs exists, show sample
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs'
  ) THEN
    RAISE NOTICE 'pl_development_needs table exists - querying...';
  END IF;
END $$;

-- ============================================================================
-- PART 4: RLS POLICIES SUMMARY
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- PART 5: TRIGGERS SUMMARY
-- ============================================================================

SELECT 
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- PART 6: FOREIGN KEYS SUMMARY
-- ============================================================================

SELECT
  tc.table_schema,
  tc.table_name,
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- PART 7: CHECK CONSTRAINTS SUMMARY
-- ============================================================================

SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE contype = 'c'
  AND connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass, conname;

-- ============================================================================
-- PART 8: UNIQUE CONSTRAINTS SUMMARY
-- ============================================================================

SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE contype = 'u'
  AND connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass, conname;

-- ============================================================================
-- PART 9: ENUM TYPES
-- ============================================================================

SELECT 
  t.typname AS enum_name,
  e.enumlabel AS enum_value,
  e.enumsortorder AS sort_order
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname LIKE 'pl_%'
ORDER BY t.typname, e.enumsortorder;

-- ============================================================================
-- PART 10: FUNCTIONS
-- ============================================================================

SELECT 
  routine_schema,
  routine_name,
  routine_type,
  data_type AS return_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('set_updated_at', 'is_admin')
ORDER BY routine_name;

