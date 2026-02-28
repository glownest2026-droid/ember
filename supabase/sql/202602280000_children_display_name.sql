-- Add optional display_name to children (Figma: "What do you call them?").
-- Optional nickname for UI only; not a legal name.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS display_name text;

COMMENT ON COLUMN public.children.display_name IS 'Optional: what the parent calls the child (e.g. nickname). For UI only.';
