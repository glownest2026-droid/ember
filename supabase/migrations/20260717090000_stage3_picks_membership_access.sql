-- Future-proof Stage 3 Pip's Picks access for Ember Plus memberships.
-- Today the founder proxy is treated as Ember Plus. When paid membership
-- launches, Supabase Auth metadata can carry membership_type = 'ember_plus'.

BEGIN;

DROP POLICY IF EXISTS "pl_stage3_picks_public_read" ON public.pl_stage3_picks;
CREATE POLICY "pl_stage3_picks_public_read" ON public.pl_stage3_picks
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'visible'
    AND is_visible = true
    AND (
      is_locked = false
      OR lower(coalesce(auth.jwt() ->> 'email', '')) = 'timwd23@gmail.com'
      OR lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'membership_type', '')) = 'ember_plus'
    )
  );

COMMIT;
