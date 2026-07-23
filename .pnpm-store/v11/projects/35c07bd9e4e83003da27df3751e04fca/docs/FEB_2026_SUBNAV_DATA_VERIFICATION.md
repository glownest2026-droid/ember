# Subnav data migration — verification (Feb 2026)

Run the migration in Supabase **SQL Editor** first: `supabase/sql/202602190000_subnav_saves_and_consent.sql`.

Then use the steps below to confirm tables, RLS, and the RPC.

---

## 1. Confirm tables exist

In Supabase **SQL Editor**, run (comments use `--` only):

```sql
-- Tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_saved_products', 'user_saved_ideas', 'user_notification_prefs')
ORDER BY table_name;
```

Expected: 3 rows (`user_notification_prefs`, `user_saved_ideas`, `user_saved_products`).

---

## 2. Confirm RLS is enabled

```sql
-- RLS
SELECT relname, relrowsecurity
FROM pg_class
WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND relname IN ('user_saved_products', 'user_saved_ideas', 'user_notification_prefs');
```

Expected: `relrowsecurity = true` for all three.

---

## 3. Confirm policies exist

```sql
-- Policies (names only)
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_saved_products', 'user_saved_ideas', 'user_notification_prefs')
ORDER BY tablename, policyname;
```

Expected: 3 policies per saves tables (select_own, insert_own, delete_own); 3 for prefs (select_own, insert_own, update_own).

---

## 4. Confirm RPC exists

```sql
-- RPC
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'get_my_subnav_stats';
```

Expected: 1 row.

---

## 5. Test get_my_subnav_stats (authenticated)

You cannot impersonate `auth.uid()` in the SQL Editor. Test from the app in a follow-up PR when the subnav UI calls `supabase.rpc('get_my_subnav_stats')`. As an anonymous session, the RPC returns zeros and `development_reminders_enabled: false`.

---

## Rollback (only if needed)

Run in this order:

```sql
DROP TRIGGER IF EXISTS user_notification_prefs_updated_at ON public.user_notification_prefs;
DROP FUNCTION IF EXISTS public.get_my_subnav_stats();
DROP TABLE IF EXISTS public.user_notification_prefs;
DROP TABLE IF EXISTS public.user_saved_ideas;
DROP TABLE IF EXISTS public.user_saved_products;
```
