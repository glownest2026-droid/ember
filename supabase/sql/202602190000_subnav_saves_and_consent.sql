-- Migration: subnav saves + consent schema and get_my_subnav_stats
-- Date: 2026-02-19
-- Purpose: Tables for saved products, saved ideas, notification prefs; RLS; single RPC for "my subnav stats".
-- Scope: Data foundation only; no UI subnav in this PR.
-- Idempotent: Safe to re-run (IF NOT EXISTS, DROP IF EXISTS for policies/function).

-- ============================================================================
-- PART 1: user_saved_products
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_saved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS user_saved_products_user_id_idx
  ON public.user_saved_products(user_id);

ALTER TABLE public.user_saved_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_saved_products_select_own" ON public.user_saved_products;
CREATE POLICY "user_saved_products_select_own" ON public.user_saved_products
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_products_insert_own" ON public.user_saved_products;
CREATE POLICY "user_saved_products_insert_own" ON public.user_saved_products
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_products_delete_own" ON public.user_saved_products;
CREATE POLICY "user_saved_products_delete_own" ON public.user_saved_products
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- PART 2: user_saved_ideas
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_saved_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  idea_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, idea_id)
);

CREATE INDEX IF NOT EXISTS user_saved_ideas_user_id_idx
  ON public.user_saved_ideas(user_id);

ALTER TABLE public.user_saved_ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_saved_ideas_select_own" ON public.user_saved_ideas;
CREATE POLICY "user_saved_ideas_select_own" ON public.user_saved_ideas
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_ideas_insert_own" ON public.user_saved_ideas;
CREATE POLICY "user_saved_ideas_insert_own" ON public.user_saved_ideas
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_ideas_delete_own" ON public.user_saved_ideas;
CREATE POLICY "user_saved_ideas_delete_own" ON public.user_saved_ideas
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- PART 3: user_notification_prefs
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_notification_prefs (
  user_id UUID PRIMARY KEY,
  development_reminders_enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_notification_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_notification_prefs_select_own" ON public.user_notification_prefs;
CREATE POLICY "user_notification_prefs_select_own" ON public.user_notification_prefs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_notification_prefs_insert_own" ON public.user_notification_prefs;
CREATE POLICY "user_notification_prefs_insert_own" ON public.user_notification_prefs
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_notification_prefs_update_own" ON public.user_notification_prefs;
CREATE POLICY "user_notification_prefs_update_own" ON public.user_notification_prefs
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- PART 4: get_my_subnav_stats() RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  SELECT count(*)::INT INTO toys_count
  FROM public.user_saved_products
  WHERE user_id = uid;

  SELECT count(*)::INT INTO ideas_count
  FROM public.user_saved_ideas
  WHERE user_id = uid;

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- ============================================================================
-- PART 5: Trigger for updated_at on user_notification_prefs (optional)
-- ============================================================================

-- Reuse set_updated_at() if it exists (from phase_a_db_foundation)
DROP TRIGGER IF EXISTS user_notification_prefs_updated_at ON public.user_notification_prefs;
CREATE TRIGGER user_notification_prefs_updated_at
  BEFORE UPDATE ON public.user_notification_prefs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
