-- Verification: user_list_items table, RLS, policies, counts
-- Run after 202602250000_family_user_list_items.sql

-- 1) Table existence
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'user_list_items'
) AS table_exists;

-- 2) RLS enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'user_list_items';

-- 3) Policy list (introspect pg_policies)
SELECT polname, polcmd, polpermissive
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
WHERE c.relname = 'user_list_items';

-- 4) Simple select counts (0 rows OK pre-use)
SELECT
  (SELECT count(*) FROM public.user_list_items) AS total_rows,
  (SELECT count(*) FROM public.user_list_items WHERE kind = 'product') AS products,
  (SELECT count(*) FROM public.user_list_items WHERE kind IN ('idea', 'category')) AS ideas,
  (SELECT count(*) FROM public.user_list_items WHERE gift = true) AS gifts;
