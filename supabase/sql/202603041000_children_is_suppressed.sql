-- Add is_suppressed to children for soft-remove (hide from family/subnav/discover; no hard delete).
-- When true, child is excluded from lists; user can "restore" by updating is_suppressed to false later if needed.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS is_suppressed boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.children.is_suppressed IS 'When true, child is hidden from family grid, subnav and discover; soft-remove only.';

CREATE INDEX IF NOT EXISTS children_user_suppressed_idx ON public.children(user_id) WHERE is_suppressed = false;
