-- Run after staging_baseline.sql in Supabase SQL Editor.
-- Quick check that key objects exist. Expect one row per check with ok = true.
SELECT 'products' AS obj, EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') AS ok
UNION ALL
SELECT 'children', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'children')
UNION ALL
SELECT 'user_list_items', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_list_items')
UNION ALL
SELECT 'marketplace_listings', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'marketplace_listings')
UNION ALL
SELECT 'get_my_subnav_stats', EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_my_subnav_stats')
UNION ALL
SELECT 'get_public_gift_list', EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_public_gift_list')
UNION ALL
SELECT 'suggest_marketplace_item_types', EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'suggest_marketplace_item_types');
