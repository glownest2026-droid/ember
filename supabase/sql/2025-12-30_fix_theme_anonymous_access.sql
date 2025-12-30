-- Fix: Allow anonymous SELECT on site_settings.theme for branding on logged-out routes
-- This ensures ThemeProvider can load theme data for /, /signin, /signin/password, etc.

-- Ensure site_settings table exists (idempotent)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY,
  theme JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous SELECT on theme column (public branding data)
DROP POLICY IF EXISTS "site_settings_theme_public_read" ON public.site_settings;
CREATE POLICY "site_settings_theme_public_read" ON public.site_settings
  FOR SELECT
  USING (true); -- Allow all users (including anonymous) to read theme

-- Allow authenticated users to update (admin-only via application logic)
DROP POLICY IF EXISTS "site_settings_authenticated_update" ON public.site_settings;
CREATE POLICY "site_settings_authenticated_update" ON public.site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to insert (admin-only via application logic)
DROP POLICY IF EXISTS "site_settings_authenticated_insert" ON public.site_settings;
CREATE POLICY "site_settings_authenticated_insert" ON public.site_settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

