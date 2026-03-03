-- Remove the old 7-parameter overload of upsert_user_list_item so the 8-param version
-- (with p_child_id) is the only one. Fixes "Could not choose the best candidate function" when
-- calling from my-ideas Want/Have toggle. Run after 202603031100_upsert_user_list_item_child.

DROP FUNCTION IF EXISTS public.upsert_user_list_item(text, uuid, uuid, uuid, boolean, boolean, boolean);
