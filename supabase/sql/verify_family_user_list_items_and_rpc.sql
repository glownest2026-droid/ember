-- Verification: user_list_items table, RLS, policies, function, counts
-- Run after 202602260000_family_user_list_items_and_rpc.sql (as authenticated user in SQL Editor or app).

-- 1) Table exists + column list
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_list_items'
ORDER BY ordinal_position;

-- 2) RLS enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'user_list_items';

-- 3) Policies
SELECT polname, polcmd, polpermissive
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
WHERE c.relname = 'user_list_items';

-- 4) Function exists (information_schema.routines)
SELECT routine_name, routine_schema
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'upsert_user_list_item';

-- 5) Counts (0 rows OK before use)
SELECT
  (SELECT count(*) FROM public.user_list_items) AS total_rows,
  (SELECT count(*) FROM public.user_list_items WHERE kind = 'product') AS products,
  (SELECT count(*) FROM public.user_list_items WHERE kind IN ('idea', 'category')) AS ideas,
  (SELECT count(*) FROM public.user_list_items WHERE gift = true) AS gifts;

-- Smoke call (authenticated-only): from the app, sign in and toggle Want/Have or Gift on /family.
-- Or in SQL Editor as a signed-in user: SELECT public.upsert_user_list_item('category', NULL, '<a-valid-category-type-uuid>', NULL, true, false, false);
