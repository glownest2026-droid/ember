-- Allow waitlist signup via anon/authenticated clients (no service_role required).
-- Unique index on lower(email) remains the anti-dupe control.

GRANT INSERT ON public.ember_plus_waitlist TO anon, authenticated;

DROP POLICY IF EXISTS ember_plus_waitlist_insert_anyone ON public.ember_plus_waitlist;
CREATE POLICY ember_plus_waitlist_insert_anyone
  ON public.ember_plus_waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(email) >= 5
    AND (user_id IS NULL OR user_id = auth.uid())
  );
