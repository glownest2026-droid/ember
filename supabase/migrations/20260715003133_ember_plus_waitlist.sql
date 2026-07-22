-- Project Rocket Phase 0: Ember Plus interest waitlist (Supabase-native).
-- Inserts go through the Next.js API with the service role; no public read.

CREATE TABLE IF NOT EXISTS public.ember_plus_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'pricing',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ember_plus_waitlist_email_format
    CHECK (char_length(email) >= 5 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

COMMENT ON TABLE public.ember_plus_waitlist IS
  'Ember Plus interest list — email (+ optional signed-in user_id). No payment.';

CREATE UNIQUE INDEX IF NOT EXISTS ember_plus_waitlist_email_lower_uidx
  ON public.ember_plus_waitlist (lower(email));

CREATE INDEX IF NOT EXISTS ember_plus_waitlist_created_at_idx
  ON public.ember_plus_waitlist (created_at DESC);

CREATE INDEX IF NOT EXISTS ember_plus_waitlist_user_id_idx
  ON public.ember_plus_waitlist (user_id)
  WHERE user_id IS NOT NULL;

ALTER TABLE public.ember_plus_waitlist ENABLE ROW LEVEL SECURITY;

-- Authenticated users may see only their own row (optional “already joined” UX).
DROP POLICY IF EXISTS ember_plus_waitlist_select_own ON public.ember_plus_waitlist;
CREATE POLICY ember_plus_waitlist_select_own
  ON public.ember_plus_waitlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No anon/authenticated INSERT/UPDATE/DELETE policies — API uses service_role.

GRANT SELECT ON public.ember_plus_waitlist TO authenticated;
GRANT INSERT ON public.ember_plus_waitlist TO anon, authenticated;
GRANT ALL ON public.ember_plus_waitlist TO service_role;

DROP POLICY IF EXISTS ember_plus_waitlist_insert_anyone ON public.ember_plus_waitlist;
CREATE POLICY ember_plus_waitlist_insert_anyone
  ON public.ember_plus_waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(email) >= 5
    AND (user_id IS NULL OR user_id = auth.uid())
  );
