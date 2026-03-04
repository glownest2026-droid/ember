-- PART 1 of 2: RLS policy only. Run this first in Supabase SQL Editor; then run PART 2.
-- Show only items assigned to a visible (non-suppressed) child. Unassigned (child_id IS NULL) items
-- are never shown so that when user adds a new child, old legacy unassigned saves do not reappear.

DROP POLICY IF EXISTS "user_list_items_select_own" ON public.user_list_items;
CREATE POLICY "user_list_items_select_own" ON public.user_list_items
  FOR SELECT USING (
    user_id = auth.uid()
    AND user_list_items.child_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = user_list_items.child_id
        AND c.user_id = auth.uid()
        AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
    )
  );

COMMENT ON POLICY "user_list_items_select_own" ON public.user_list_items IS 'Own rows only; show only items assigned to a visible (non-suppressed) child; unassigned never shown so legacy saves do not reappear when adding a new child.';
