-- Add child_name to children (optional "What do you call them?" for UI).
-- Distinct from legacy/display_name: single source of truth for the call name shown in app.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS child_name text;

COMMENT ON COLUMN public.children.child_name IS 'Optional: what the parent calls the child (e.g. nickname). For UI only.';

-- Backfill from display_name where present
UPDATE public.children
SET child_name = display_name
WHERE display_name IS NOT NULL AND (child_name IS NULL OR child_name = '');
