-- PART 1 of 2: RLS policy only. Run this first in Supabase SQL Editor; then run PART 2.
-- When a child is removed (is_suppressed = true), hide their saves + hide unassigned when no visible children.

DROP POLICY IF EXISTS "user_list_items_select_own" ON public.user_list_items;
CREATE POLICY "user_list_items_select_own" ON public.user_list_items
  FOR SELECT USING (
    user_id = auth.uid()
    AND (
      (user_list_items.child_id IS NULL AND EXISTS (
        SELECT 1 FROM public.children c
        WHERE c.user_id = auth.uid()
          AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
      ))
      OR
      (user_list_items.child_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.children c
        WHERE c.id = user_list_items.child_id
          AND c.user_id = auth.uid()
          AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
      ))
    )
  );

COMMENT ON POLICY "user_list_items_select_own" ON public.user_list_items IS 'Own rows only; hide items for suppressed children; when no visible children, hide unassigned too; data kept in DB.';
