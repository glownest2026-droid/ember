-- Staging baseline: run once in Supabase SQL Editor for new staging project.
-- Order matches repo migrations; 202603051000 uses full suppress_saves file (not PART1+PART2).

-- === 2025-11-04_core_schema.sql ===

-- Core Schema for Project Ember
-- Date: 2025-11-04
create extension if not exists pgcrypto;

-- PRODUCTS (public read)
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  rating         numeric(2,1) check (rating >= 0 and rating <= 5),
  affiliate_url  text,
  image_url      text,
  why_it_matters text,
  tags           text[] not null default '{}',
  age_band       text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- CHILDREN (owner-only)
-- Privacy promise: never collect a child's name. No name column.
create table if not exists public.children (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  birthdate   date,
  gender      text,
  age_band    text,
  preferences jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists children_user_id_idx on public.children(user_id);

-- CLICKS (owner-only)
create table if not exists public.clicks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  context     text,
  referer     text,
  created_at  timestamptz not null default now()
);
create index if not exists clicks_user_created_idx on public.clicks(user_id, created_at desc);

-- Performance indexes
create index if not exists products_age_band_idx on public.products(age_band);
create index if not exists products_tags_gin on public.products using gin (tags);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_children_updated_at on public.children;
create trigger trg_children_updated_at before update on public.children
for each row execute function public.set_updated_at();

-- RLS
alter table public.products enable row level security;
alter table public.children enable row level security;
alter table public.clicks   enable row level security;

-- products: public SELECT only
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (true);

-- children: owner-only CRUD
drop policy if exists "children_select_own" on public.children;
create policy "children_select_own" on public.children for select using (auth.uid() = user_id);

drop policy if exists "children_insert_own" on public.children;
create policy "children_insert_own" on public.children for insert with check (auth.uid() = user_id);

drop policy if exists "children_update_own" on public.children;
create policy "children_update_own" on public.children
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "children_delete_own" on public.children;
create policy "children_delete_own" on public.children for delete using (auth.uid() = user_id);

-- clicks: owner-only CRUD
drop policy if exists "clicks_select_own" on public.clicks;
create policy "clicks_select_own" on public.clicks for select using (auth.uid() = user_id);

drop policy if exists "clicks_insert_own" on public.clicks;
create policy "clicks_insert_own" on public.clicks for insert with check (auth.uid() = user_id);

drop policy if exists "clicks_update_own" on public.clicks;
create policy "clicks_update_own" on public.clicks
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clicks_delete_own" on public.clicks;
create policy "clicks_delete_own" on public.clicks for delete using (auth.uid() = user_id);

-- Notes:
-- - products writes require service role server-side.
-- - tags should be lowercase slugs for best GIN matches.

-- === 2025-12-20_module_10A_remove_child_name.sql ===

-- Module 10A: Privacy hotfix - Remove child name collection
-- Date: 2025-12-20
-- Reason: Privacy promise - never collect child's name
-- Migration: Rename name column to legacy_name and make nullable
-- Safe in environments where name/legacy_name never existed.

-- Step 1: Rename column (if it exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'children' and column_name = 'name'
  ) then
    alter table public.children rename column name to legacy_name;
  end if;
end $$;

-- Step 2: Make nullable (if column exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'children' and column_name = 'legacy_name'
  ) then
    alter table public.children alter column legacy_name drop not null;
  end if;
end $$;

-- Step 3: Add comment to document deprecation (only if column exists)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'children'
      and column_name = 'legacy_name'
  ) then
    execute
      'comment on column public.children.legacy_name is ''Deprecated: do not collect child name (privacy promise). This column exists only for legacy data compatibility and must not be used in new code.''';
  end if;
end $$;

-- Note: RLS policies are unchanged - they only check user_id ownership, not name field.

-- === 2025-12-30_fix_theme_anonymous_access.sql ===

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


-- === 202601041654_pl0_product_library.sql ===

-- PL-0: Product Library Ground Truth & Guardrails
-- Date: 2026-01-04
-- Purpose: Add pl_* tables for product library and harden products table RLS

-- ============================================================================
-- PART 1: HARDEN products TABLE RLS (admin-only writes)
-- ============================================================================

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on products (safe dynamic drop)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.products';
    END LOOP;
END $$;

-- Recreate SELECT: public read (anon + authenticated)
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT
  USING (true);

-- INSERT: admin-only via user_roles check
CREATE POLICY "products_admin_insert" ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- UPDATE: admin-only via user_roles check
CREATE POLICY "products_admin_update" ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- DELETE: admin-only via user_roles check
CREATE POLICY "products_admin_delete" ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================================================
-- PART 2: CREATE ENUM TYPES
-- ============================================================================

-- pl_set_status_enum: draft | published | archived
DO $$ BEGIN
    CREATE TYPE pl_set_status_enum AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- pl_lane_enum: obvious | nearby | surprise
DO $$ BEGIN
    CREATE TYPE pl_lane_enum AS ENUM ('obvious', 'nearby', 'surprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- PART 3: CREATE pl_* TABLES
-- ============================================================================

-- pl_age_bands: vocabulary table for age ranges
CREATE TABLE IF NOT EXISTS public.pl_age_bands (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  min_months INTEGER NOT NULL,
  max_months INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_moments: vocabulary table for play moments
CREATE TABLE IF NOT EXISTS public.pl_moments (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_dev_tags: vocabulary table for development tags
CREATE TABLE IF NOT EXISTS public.pl_dev_tags (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_category_types: product category taxonomy
CREATE TABLE IF NOT EXISTS public.pl_category_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_reference_url TEXT,
  safety_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_age_moment_sets: sets combining age band + moment
CREATE TABLE IF NOT EXISTS public.pl_age_moment_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  moment_id TEXT NOT NULL REFERENCES public.pl_moments(id) ON DELETE RESTRICT,
  status pl_set_status_enum NOT NULL DEFAULT 'draft',
  headline TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_reco_cards: recommendation cards within a set
CREATE TABLE IF NOT EXISTS public.pl_reco_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES public.pl_age_moment_sets(id) ON DELETE CASCADE,
  lane pl_lane_enum NOT NULL,
  rank INTEGER NOT NULL,
  category_type_id UUID REFERENCES public.pl_category_types(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  because TEXT NOT NULL,
  why_tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_evidence: evidence/sources for recommendation cards
CREATE TABLE IF NOT EXISTS public.pl_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.pl_reco_cards(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  url TEXT,
  quote_snippet TEXT,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confidence INTEGER NOT NULL CHECK (confidence >= 1 AND confidence <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- PART 4: INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS pl_age_moment_sets_age_band_id_idx ON public.pl_age_moment_sets(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_moment_sets_moment_id_idx ON public.pl_age_moment_sets(moment_id);
CREATE INDEX IF NOT EXISTS pl_age_moment_sets_status_idx ON public.pl_age_moment_sets(status);
CREATE INDEX IF NOT EXISTS pl_reco_cards_set_id_idx ON public.pl_reco_cards(set_id);
CREATE INDEX IF NOT EXISTS pl_reco_cards_lane_idx ON public.pl_reco_cards(lane);
CREATE INDEX IF NOT EXISTS pl_evidence_card_id_idx ON public.pl_evidence(card_id);

-- ============================================================================
-- PART 5: UPDATED_AT TRIGGERS
-- ============================================================================

-- Apply updated_at trigger to all pl_* tables
CREATE TRIGGER trg_pl_age_bands_updated_at BEFORE UPDATE ON public.pl_age_bands
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_moments_updated_at BEFORE UPDATE ON public.pl_moments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_dev_tags_updated_at BEFORE UPDATE ON public.pl_dev_tags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_category_types_updated_at BEFORE UPDATE ON public.pl_category_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_moment_sets_updated_at BEFORE UPDATE ON public.pl_age_moment_sets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_reco_cards_updated_at BEFORE UPDATE ON public.pl_reco_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_evidence_updated_at BEFORE UPDATE ON public.pl_evidence
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 6: ENABLE RLS ON ALL pl_* TABLES
-- ============================================================================

ALTER TABLE public.pl_age_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_dev_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_category_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_moment_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_reco_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_evidence ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 7: RLS POLICIES FOR pl_* TABLES
-- ============================================================================

-- Admin CRUD on all pl_* tables (vocabulary tables: age_bands, moments, dev_tags, category_types)
-- Helper function to check admin role (reusable)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- pl_age_bands: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_age_bands_admin_all" ON public.pl_age_bands
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_moments: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_moments_admin_all" ON public.pl_moments
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_dev_tags: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_dev_tags_admin_all" ON public.pl_dev_tags
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_category_types: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_category_types_admin_all" ON public.pl_category_types
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_moment_sets: admin CRUD + public SELECT for published sets
CREATE POLICY "pl_age_moment_sets_admin_all" ON public.pl_age_moment_sets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pl_age_moment_sets_public_read_published" ON public.pl_age_moment_sets
  FOR SELECT
  USING (status = 'published');

-- pl_reco_cards: admin CRUD + public SELECT for cards in published sets
CREATE POLICY "pl_reco_cards_admin_all" ON public.pl_reco_cards
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pl_reco_cards_public_read_published" ON public.pl_reco_cards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pl_age_moment_sets
      WHERE id = pl_reco_cards.set_id
      AND status = 'published'
    )
  );

-- pl_evidence: admin CRUD + public SELECT for evidence on cards in published sets
CREATE POLICY "pl_evidence_admin_all" ON public.pl_evidence
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pl_evidence_public_read_published" ON public.pl_evidence
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pl_reco_cards
      INNER JOIN public.pl_age_moment_sets ON pl_reco_cards.set_id = pl_age_moment_sets.id
      WHERE pl_reco_cards.id = pl_evidence.card_id
      AND pl_age_moment_sets.status = 'published'
    )
  );

-- ============================================================================
-- NOTES
-- ============================================================================
-- - products table: SELECT remains public, INSERT/UPDATE/DELETE are admin-only
-- - All pl_* tables: Admin has full CRUD access
-- - Public SELECT allowed ONLY for published sets and their related cards/evidence
-- - Vocabulary tables (age_bands, moments, dev_tags, category_types) are admin-only in PL-0
-- - Helper function is_admin() uses SECURITY DEFINER to check user_roles table


-- === 202601041700_pl1_pool_items.sql ===

-- PL-1: Product Type Pool
-- Date: 2026-01-04
-- Purpose: Add pl_pool_items table for product type pool management

-- Create pl_pool_items table
CREATE TABLE IF NOT EXISTS public.pl_pool_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE CASCADE,
  moment_id TEXT NOT NULL REFERENCES public.pl_moments(id) ON DELETE CASCADE,
  category_type_id UUID REFERENCES public.pl_category_types(id) ON DELETE SET NULL,
  note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pl_pool_items_age_band_moment_idx ON public.pl_pool_items(age_band_id, moment_id);
CREATE INDEX IF NOT EXISTS pl_pool_items_category_type_idx ON public.pl_pool_items(category_type_id);

-- Updated_at trigger
CREATE TRIGGER trg_pl_pool_items_updated_at BEFORE UPDATE ON public.pl_pool_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.pl_pool_items ENABLE ROW LEVEL SECURITY;

-- Admin-only CRUD policies
CREATE POLICY "pl_pool_items_admin_all" ON public.pl_pool_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- === 202601050000_pl_category_types_and_products.sql ===

-- PL Taxonomy: Category Types + Products Link
-- Date: 2026-01-05
-- Purpose: Add name column to pl_category_types (if missing) and link products to category types

-- Note: pl_category_types table already exists from PL-0 migration with 'label' column
-- Add 'name' column if it doesn't exist (for consistency with requirements)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'pl_category_types'
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.pl_category_types ADD COLUMN name TEXT;
    -- Populate name from label for existing rows
    UPDATE public.pl_category_types SET name = label WHERE name IS NULL;
    -- Make name required
    ALTER TABLE public.pl_category_types ALTER COLUMN name SET NOT NULL;
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'pl_category_types_name_unique'
    ) THEN
      ALTER TABLE public.pl_category_types ADD CONSTRAINT pl_category_types_name_unique UNIQUE (name);
    END IF;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS pl_category_types_slug_idx ON public.pl_category_types(slug);

-- Updated_at trigger
DROP TRIGGER IF EXISTS trg_pl_category_types_updated_at ON public.pl_category_types;
CREATE TRIGGER trg_pl_category_types_updated_at BEFORE UPDATE ON public.pl_category_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS (safe to re-run, no error if already enabled)
ALTER TABLE public.pl_category_types ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read (for dropdowns in admin UI)
DROP POLICY IF EXISTS "pl_category_types_authenticated_read" ON public.pl_category_types;
CREATE POLICY "pl_category_types_authenticated_read" ON public.pl_category_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin writes go via service-role server routes, so we keep write policies strict
-- (No direct write policy for users - all writes via API routes with service role)

-- Add category_type_id to products table
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS category_type_id UUID REFERENCES public.pl_category_types(id) ON DELETE SET NULL;

-- Index for category_type_id lookups
CREATE INDEX IF NOT EXISTS products_category_type_idx ON public.products(category_type_id);


-- === 202601050001_remove_rating_min_constraint.sql ===

-- Remove any minimum rating constraint if it exists
-- This migration ensures rating can be 0-5 (no minimum >= 4 requirement)

-- Check if there's a constraint requiring rating >= 4 and drop it
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find any check constraints on products.rating that require >= 4
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.products'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%rating%>=%4%';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.products DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No constraint found requiring rating >= 4';
    END IF;
END $$;

-- Ensure the rating check constraint allows 0-5 (idempotent)
-- Drop existing constraint if it exists and recreate
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_rating_check;
ALTER TABLE public.products ADD CONSTRAINT products_rating_check 
    CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));


-- === 202601050002_pl2_public_read_policies.sql ===

-- PL-2: Public Read Policies for Discovery Page
-- Date: 2026-01-05
-- Purpose: Enable public read access to active age bands, moments, and category types for published content

-- Add public SELECT for active age bands (needed to map age in months to age band)
DROP POLICY IF EXISTS "pl_age_bands_public_read_active" ON public.pl_age_bands;
CREATE POLICY "pl_age_bands_public_read_active" ON public.pl_age_bands
  FOR SELECT
  USING (is_active = true);

-- Add public SELECT for active moments (needed to show moment selector tabs)
DROP POLICY IF EXISTS "pl_moments_public_read_active" ON public.pl_moments;
CREATE POLICY "pl_moments_public_read_active" ON public.pl_moments
  FOR SELECT
  USING (is_active = true);

-- Add public SELECT for category types referenced by published cards
-- (needed to display category type names/labels on public discovery page)
DROP POLICY IF EXISTS "pl_category_types_public_read_published" ON public.pl_category_types;
CREATE POLICY "pl_category_types_public_read_published" ON public.pl_category_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pl_reco_cards
      INNER JOIN public.pl_age_moment_sets ON pl_reco_cards.set_id = pl_age_moment_sets.id
      WHERE pl_reco_cards.category_type_id = pl_category_types.id
      AND pl_age_moment_sets.status = 'published'
    )
  );


-- === 202601060000_manus_ready_scoring_and_evidence.sql ===

-- Manus-ready: Scoring and Evidence
-- Date: 2026-01-06
-- Purpose: Add Manus scoring columns to products and pl_category_types, create general-purpose evidence table
-- Note: Idempotent migration using IF NOT EXISTS where applicable

-- ============================================================================
-- PART 1: ALTER products TABLE - Add Manus scoring columns
-- ============================================================================

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS amazon_rating numeric(2,1),
  ADD COLUMN IF NOT EXISTS amazon_review_count integer,
  ADD COLUMN IF NOT EXISTS confidence_score smallint,
  ADD COLUMN IF NOT EXISTS quality_score smallint,
  ADD COLUMN IF NOT EXISTS primary_url text,
  ADD COLUMN IF NOT EXISTS source_name text,
  ADD COLUMN IF NOT EXISTS source_run_id text,
  ADD COLUMN IF NOT EXISTS manus_payload jsonb;

-- Add constraints for score ranges (0-10 for smallint fields, 0-5 for amazon_rating)
DO $$
BEGIN
  -- Add check constraint for quality_score if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_quality_score_check'
  ) THEN
    ALTER TABLE public.products 
      ADD CONSTRAINT products_quality_score_check 
      CHECK (quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 10));
  END IF;

  -- Add check constraint for confidence_score if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_confidence_score_check'
  ) THEN
    ALTER TABLE public.products 
      ADD CONSTRAINT products_confidence_score_check 
      CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 10));
  END IF;

  -- Add check constraint for amazon_rating if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_amazon_rating_check'
  ) THEN
    ALTER TABLE public.products 
      ADD CONSTRAINT products_amazon_rating_check 
      CHECK (amazon_rating IS NULL OR (amazon_rating >= 0 AND amazon_rating <= 5));
  END IF;
END $$;

-- Indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS products_quality_score_idx ON public.products(quality_score) WHERE quality_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_amazon_rating_idx ON public.products(amazon_rating) WHERE amazon_rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_confidence_score_idx ON public.products(confidence_score) WHERE confidence_score IS NOT NULL;

-- ============================================================================
-- PART 2: ALTER pl_category_types TABLE - Add optional columns
-- ============================================================================

ALTER TABLE public.pl_category_types 
  ADD COLUMN IF NOT EXISTS min_month integer,
  ADD COLUMN IF NOT EXISTS max_month integer,
  ADD COLUMN IF NOT EXISTS evidence_urls text[],
  ADD COLUMN IF NOT EXISTS confidence_score smallint;

-- Add constraint for category_type confidence_score if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'pl_category_types_confidence_score_check'
  ) THEN
    ALTER TABLE public.pl_category_types 
      ADD CONSTRAINT pl_category_types_confidence_score_check 
      CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 10));
  END IF;
END $$;

-- ============================================================================
-- PART 3: CREATE pl_evidence TABLE (general-purpose evidence for entities)
-- ============================================================================
-- Note: An existing pl_evidence table exists for pl_reco_cards (card_id).
-- This new structure is for general entity evidence (category_types/products).
-- We'll check if the old structure exists and handle migration safely.

DO $$
BEGIN
  -- Check if pl_evidence exists with old structure (card_id column)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'pl_evidence'
    AND column_name = 'card_id'
  ) THEN
    -- Old structure exists - check if new structure columns don't exist yet
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'pl_evidence'
      AND column_name = 'entity_type'
    ) THEN
      -- Rename old table to preserve data
      ALTER TABLE public.pl_evidence RENAME TO pl_card_evidence;
      
      -- Recreate policies on renamed table (if they exist)
      DROP POLICY IF EXISTS "pl_evidence_admin_all" ON public.pl_card_evidence;
      DROP POLICY IF EXISTS "pl_evidence_public_read_published" ON public.pl_card_evidence;
      
      -- Recreate policies with new name
      CREATE POLICY "pl_card_evidence_admin_all" ON public.pl_card_evidence
        FOR ALL
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
      
      CREATE POLICY "pl_card_evidence_public_read_published" ON public.pl_card_evidence
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.pl_reco_cards
            INNER JOIN public.pl_age_moment_sets ON pl_reco_cards.set_id = pl_age_moment_sets.id
            WHERE pl_reco_cards.id = pl_card_evidence.card_id
            AND pl_age_moment_sets.status = 'published'
          )
        );
      
      -- Recreate index with new name
      DROP INDEX IF EXISTS public.pl_evidence_card_id_idx;
      CREATE INDEX IF NOT EXISTS pl_card_evidence_card_id_idx ON public.pl_card_evidence(card_id);
    END IF;
  END IF;
END $$;

-- Now create the new pl_evidence table with entity_type/entity_id structure
CREATE TABLE IF NOT EXISTS public.pl_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('category_type', 'product')),
  entity_id uuid NOT NULL,
  source_type text NOT NULL,
  url text NOT NULL,
  notes text,
  weight smallint,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for entity lookups
CREATE INDEX IF NOT EXISTS pl_evidence_entity_idx ON public.pl_evidence(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS pl_evidence_source_type_idx ON public.pl_evidence(source_type);

-- ============================================================================
-- PART 4: RLS POLICIES FOR pl_evidence
-- ============================================================================

ALTER TABLE public.pl_evidence ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read (for admin UIs and future tooling)
DROP POLICY IF EXISTS "pl_evidence_authenticated_read" ON public.pl_evidence;
CREATE POLICY "pl_evidence_authenticated_read" ON public.pl_evidence
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Writes: only via service role (no open write policies needed)
-- Admin writes go through service role server routes, so we keep it simple here

-- ============================================================================
-- NOTES
-- ============================================================================
-- - products table: Added Manus scoring columns (amazon_rating, confidence_score, quality_score, etc.)
-- - pl_category_types: Added optional age range and evidence columns
-- - pl_evidence: New general-purpose evidence table for category_types/products
--   - If old pl_evidence (card_id) existed, it's been renamed to pl_card_evidence
--   - New pl_evidence supports entity_type/entity_id pattern
-- - RLS: pl_evidence allows authenticated read only; writes via service role
-- - All changes are additive and idempotent


-- === 202601060001_pl_autopilot_locks.sql ===

-- PL Autopilot: Add locks to pl_reco_cards
-- Date: 2026-01-06
-- Purpose: Add is_locked column to prevent autopilot from overwriting founder choices

ALTER TABLE public.pl_reco_cards 
  ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS locked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for filtering locked cards
CREATE INDEX IF NOT EXISTS pl_reco_cards_is_locked_idx ON public.pl_reco_cards(is_locked) WHERE is_locked = true;


-- === 202601142252_pl_need_ux_labels.sql ===

-- PL Need UX Labels: Scalable UX wrapper mapping table
-- Date: 2026-01-14
-- Purpose: Create pl_need_ux_labels table and add slug column to pl_development_needs if missing
-- Seeds 12 brand director mappings for 25-27m

-- ============================================================================
-- PART 1: Ensure pl_development_needs has slug column
-- ============================================================================

-- Check if pl_development_needs table exists and add slug column if missing
DO $$
BEGIN
  -- Check if table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'pl_development_needs'
  ) THEN
    -- Table exists, check if slug column exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'pl_development_needs'
      AND column_name = 'slug'
    ) THEN
      -- Add slug column (nullable - must be populated separately)
      ALTER TABLE public.pl_development_needs ADD COLUMN slug TEXT;
      
      -- Note: Backfill skipped - slug column must be populated separately before use
      -- Add unique constraint on slug (only on non-null values)
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'pl_development_needs_slug_unique'
      ) THEN
        CREATE UNIQUE INDEX pl_development_needs_slug_unique 
        ON public.pl_development_needs(slug)
        WHERE slug IS NOT NULL;
      END IF;
    END IF;
  END IF;
END $$;

-- ============================================================================
-- PART 2: Create pl_need_ux_labels table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pl_need_ux_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  development_need_id UUID NOT NULL REFERENCES public.pl_development_needs(id) ON DELETE CASCADE,
  ux_label TEXT NOT NULL,
  ux_slug TEXT NOT NULL,
  ux_description TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique index: one primary label per need
CREATE UNIQUE INDEX IF NOT EXISTS pl_need_ux_labels_primary_per_need_idx
ON public.pl_need_ux_labels(development_need_id)
WHERE is_primary = true;

-- Unique index: unique active ux_slug
CREATE UNIQUE INDEX IF NOT EXISTS pl_need_ux_labels_active_slug_idx
ON public.pl_need_ux_labels(ux_slug)
WHERE is_active = true;

-- Index for lookups
CREATE INDEX IF NOT EXISTS pl_need_ux_labels_development_need_id_idx
ON public.pl_need_ux_labels(development_need_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS trg_pl_need_ux_labels_updated_at ON public.pl_need_ux_labels;
CREATE TRIGGER trg_pl_need_ux_labels_updated_at BEFORE UPDATE ON public.pl_need_ux_labels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 3: Seed the 12 brand director mappings
-- ============================================================================

-- Note: Uses slug lookup only (slug column must exist in pl_development_needs)
DO $$
DECLARE
  need_id UUID;
BEGIN
  -- Only seed if pl_development_needs table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'pl_development_needs'
  ) THEN
    -- Color and shape recognition → Shapes & colours (shapes-colours)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'color-and-shape-recognition'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Shapes & colours', 'shapes-colours', true, true
      );
    END IF;

    -- Creative expression and mark-making → Drawing & making (drawing-making)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'creative-expression-and-mark-making'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Drawing & making', 'drawing-making', true, true
      );
    END IF;

    -- Emotional regulation and self-awareness → Big feelings (big-feelings)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'emotional-regulation-and-self-awareness'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Big feelings', 'big-feelings', true, true
      );
    END IF;

    -- Fine motor control and hand coordination → Little hands (little-hands)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'fine-motor-control-and-hand-coordination'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Little hands', 'little-hands', true, true
      );
    END IF;

    -- Gross motor skills and physical confidence → Burn energy (burn-energy)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'gross-motor-skills-and-physical-confidence'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Burn energy', 'burn-energy', true, true
      );
    END IF;

    -- Independence and practical life skills → Let me help (let-me-help)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'independence-and-practical-life-skills'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Let me help', 'let-me-help', true, true
      );
    END IF;

    -- Language development and communication → Talk & understand (talk-understand)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'language-development-and-communication'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Talk & understand', 'talk-understand', true, true
      );
    END IF;

    -- Pretend play and imagination → Pretend & stories (pretend-stories)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'pretend-play-and-imagination'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Pretend & stories', 'pretend-stories', true, true
      );
    END IF;

    -- Problem-solving and cognitive skills → Figuring things out (figuring-things-out)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'problem-solving-and-cognitive-skills'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Figuring things out', 'figuring-things-out', true, true
      );
    END IF;

    -- Routine understanding and cooperation → Transitions (transitions)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'routine-understanding-and-cooperation'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Transitions', 'transitions', true, true
      );
    END IF;

    -- Social skills and peer interaction → Playing with others (playing-with-others)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'social-skills-and-peer-interaction'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Playing with others', 'playing-with-others', true, true
      );
    END IF;

    -- Spatial reasoning and construction play → Build & puzzles (build-puzzles)
    SELECT id INTO need_id FROM public.pl_development_needs
    WHERE slug = 'spatial-reasoning-and-construction-play'
    LIMIT 1;
    IF need_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.pl_need_ux_labels
      WHERE development_need_id = need_id AND is_primary = true
    ) THEN
      INSERT INTO public.pl_need_ux_labels (
        development_need_id, ux_label, ux_slug, is_primary, is_active
      ) VALUES (
        need_id, 'Build & puzzles', 'build-puzzles', true, true
      );
    END IF;
  END IF;
END $$;

-- ============================================================================
-- PART 4: Verification SQL
-- ============================================================================
-- Run this to verify all primary active mappings:
-- SELECT
--   dn.slug AS need_slug,
--   ul.ux_label,
--   ul.ux_slug
-- FROM public.pl_need_ux_labels ul
-- JOIN public.pl_development_needs dn ON ul.development_need_id = dn.id
-- WHERE ul.is_primary = true AND ul.is_active = true
-- ORDER BY ul.sort_order NULLS LAST, ul.ux_label;

-- === 202601150000_phase_a_db_foundation.sql ===

-- Phase A: DB Foundation (Gateway Spine + Curated Public Views)
-- Date: 2026-01-15
-- Purpose: Create Phase A gateway spine tables, curated public views, triggers, RLS, and populate from seed tables
-- Scope: MVP age bands 23-25m and 25-27m
-- Idempotent: Safe to re-run (uses IF NOT EXISTS, ON CONFLICT, etc.)

-- ============================================================================
-- PART 0: PREFLIGHT CHECKS
-- ============================================================================

-- Check that is_admin() function exists (required for RLS policies)
DO $$
BEGIN
  IF to_regprocedure('public.is_admin()') IS NULL THEN
    RAISE EXCEPTION 'Required function public.is_admin() does not exist. Please run the migration that creates this function first (typically in pl0_product_library.sql or similar).';
  END IF;
END $$;

-- Check that products.is_archived column exists (required for products view)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'is_archived'
  ) THEN
    RAISE EXCEPTION 'Required column products.is_archived does not exist. Please add this column to the products table before running this migration.';
  END IF;
END $$;

-- ============================================================================
-- PART 1: HELPER FUNCTIONS
-- ============================================================================

-- Ensure set_updated_at() function exists (shared trigger function)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Slugify helper for UX wrapper slugs
CREATE OR REPLACE FUNCTION public.slugify_ux_label(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Prevent updates to pl_age_bands.id (immutability)
CREATE OR REPLACE FUNCTION public.prevent_age_band_id_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.id IS DISTINCT FROM NEW.id THEN
    RAISE EXCEPTION 'pl_age_bands.id is immutable and cannot be updated';
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================================
-- PART 2: CREATE PHASE A GATEWAY SPINE TABLES
-- ============================================================================

-- pl_ux_wrappers: Parent-friendly UX labels
CREATE TABLE IF NOT EXISTS public.pl_ux_wrappers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ux_label TEXT NOT NULL,
  ux_slug TEXT NOT NULL,
  ux_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_ux_wrapper_needs: Maps UX wrapper to development need (1:1 via UNIQUE)
CREATE TABLE IF NOT EXISTS public.pl_ux_wrapper_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ux_wrapper_id UUID NOT NULL REFERENCES public.pl_ux_wrappers(id) ON DELETE CASCADE,
  development_need_id UUID NOT NULL REFERENCES public.pl_development_needs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_ux_wrapper_needs_ux_wrapper_id_unique UNIQUE (ux_wrapper_id)
);

-- pl_age_band_ux_wrappers: Age-band-specific ranking of UX wrapper cards
CREATE TABLE IF NOT EXISTS public.pl_age_band_ux_wrappers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  ux_wrapper_id UUID NOT NULL REFERENCES public.pl_ux_wrappers(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_ux_wrappers_age_band_wrapper_unique UNIQUE (age_band_id, ux_wrapper_id)
);

-- pl_age_band_development_need_meta: Age-band-specific stage metadata for development needs
CREATE TABLE IF NOT EXISTS public.pl_age_band_development_need_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  development_need_id UUID NOT NULL REFERENCES public.pl_development_needs(id) ON DELETE CASCADE,
  stage_anchor_month INTEGER,
  stage_phase TEXT,
  stage_reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_development_need_meta_unique UNIQUE (age_band_id, development_need_id)
);

-- pl_age_band_development_need_category_types: Age-band-specific mapping from needs to category types
CREATE TABLE IF NOT EXISTS public.pl_age_band_development_need_category_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  development_need_id UUID NOT NULL REFERENCES public.pl_development_needs(id) ON DELETE CASCADE,
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  rationale TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_development_need_category_types_unique UNIQUE (age_band_id, development_need_id, category_type_id)
);

-- pl_age_band_category_type_products: Age-band-specific mapping from category types to products
CREATE TABLE IF NOT EXISTS public.pl_age_band_category_type_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  rationale TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_category_type_products_unique UNIQUE (age_band_id, category_type_id, product_id)
);

-- ============================================================================
-- PART 2B: ADD RATIONALE COLUMNS IF MISSING (idempotent)
-- ============================================================================

-- Add rationale column to pl_age_band_development_need_category_types if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'pl_age_band_development_need_category_types' 
      AND column_name = 'rationale'
  ) THEN
    ALTER TABLE public.pl_age_band_development_need_category_types ADD COLUMN rationale TEXT;
  END IF;
END $$;

-- Add rationale column to pl_age_band_category_type_products if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'pl_age_band_category_type_products' 
      AND column_name = 'rationale'
  ) THEN
    ALTER TABLE public.pl_age_band_category_type_products ADD COLUMN rationale TEXT;
  END IF;
END $$;

-- Add is_active column to pl_ux_wrappers if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'pl_ux_wrappers' 
      AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.pl_ux_wrappers ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- PART 3: CREATE INDEXES
-- ============================================================================

-- pl_ux_wrappers indexes
CREATE UNIQUE INDEX IF NOT EXISTS pl_ux_wrappers_ux_slug_idx ON public.pl_ux_wrappers(ux_slug);

-- pl_ux_wrapper_needs indexes
CREATE UNIQUE INDEX IF NOT EXISTS pl_ux_wrapper_needs_ux_wrapper_id_idx ON public.pl_ux_wrapper_needs(ux_wrapper_id);
CREATE INDEX IF NOT EXISTS pl_ux_wrapper_needs_development_need_id_idx ON public.pl_ux_wrapper_needs(development_need_id);

-- pl_age_band_ux_wrappers indexes
CREATE INDEX IF NOT EXISTS pl_age_band_ux_wrappers_age_band_id_idx ON public.pl_age_band_ux_wrappers(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_ux_wrappers_ux_wrapper_id_idx ON public.pl_age_band_ux_wrappers(ux_wrapper_id);
CREATE INDEX IF NOT EXISTS pl_age_band_ux_wrappers_age_band_rank_idx ON public.pl_age_band_ux_wrappers(age_band_id, rank);

-- pl_age_band_development_need_meta indexes
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_meta_age_band_id_idx ON public.pl_age_band_development_need_meta(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_meta_development_need_id_idx ON public.pl_age_band_development_need_meta(development_need_id);

-- pl_age_band_development_need_category_types indexes
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_age_band_id_idx ON public.pl_age_band_development_need_category_types(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_development_need_id_idx ON public.pl_age_band_development_need_category_types(development_need_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_category_type_id_idx ON public.pl_age_band_development_need_category_types(category_type_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_age_band_need_rank_idx ON public.pl_age_band_development_need_category_types(age_band_id, development_need_id, rank);

-- pl_age_band_category_type_products indexes
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_age_band_id_idx ON public.pl_age_band_category_type_products(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_category_type_id_idx ON public.pl_age_band_category_type_products(category_type_id);
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_product_id_idx ON public.pl_age_band_category_type_products(product_id);
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_age_band_category_rank_idx ON public.pl_age_band_category_type_products(age_band_id, category_type_id, rank);

-- ============================================================================
-- PART 4: CREATE TRIGGERS (updated_at)
-- ============================================================================

-- Drop existing triggers if they exist (idempotent)
DROP TRIGGER IF EXISTS trg_pl_ux_wrappers_updated_at ON public.pl_ux_wrappers;
DROP TRIGGER IF EXISTS trg_pl_ux_wrapper_needs_updated_at ON public.pl_ux_wrapper_needs;
DROP TRIGGER IF EXISTS trg_pl_age_band_ux_wrappers_updated_at ON public.pl_age_band_ux_wrappers;
DROP TRIGGER IF EXISTS trg_pl_age_band_development_need_meta_updated_at ON public.pl_age_band_development_need_meta;
DROP TRIGGER IF EXISTS trg_pl_age_band_development_need_category_types_updated_at ON public.pl_age_band_development_need_category_types;
DROP TRIGGER IF EXISTS trg_pl_age_band_category_type_products_updated_at ON public.pl_age_band_category_type_products;

-- Create triggers
CREATE TRIGGER trg_pl_ux_wrappers_updated_at
  BEFORE UPDATE ON public.pl_ux_wrappers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_ux_wrapper_needs_updated_at
  BEFORE UPDATE ON public.pl_ux_wrapper_needs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_ux_wrappers_updated_at
  BEFORE UPDATE ON public.pl_age_band_ux_wrappers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_development_need_meta_updated_at
  BEFORE UPDATE ON public.pl_age_band_development_need_meta
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_development_need_category_types_updated_at
  BEFORE UPDATE ON public.pl_age_band_development_need_category_types
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_category_type_products_updated_at
  BEFORE UPDATE ON public.pl_age_band_category_type_products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 5: IMMUTABILITY TRIGGER FOR pl_age_bands.id
-- ============================================================================

DROP TRIGGER IF EXISTS trg_pl_age_bands_prevent_id_update ON public.pl_age_bands;
CREATE TRIGGER trg_pl_age_bands_prevent_id_update
  BEFORE UPDATE ON public.pl_age_bands
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_age_band_id_update();

-- ============================================================================
-- PART 6: ENABLE RLS AND CREATE POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE public.pl_ux_wrappers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_ux_wrapper_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_ux_wrappers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_development_need_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_development_need_category_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_category_type_products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DO $$
DECLARE
  tables TEXT[] := ARRAY[
    'pl_ux_wrappers',
    'pl_ux_wrapper_needs',
    'pl_age_band_ux_wrappers',
    'pl_age_band_development_need_meta',
    'pl_age_band_development_need_category_types',
    'pl_age_band_category_type_products'
  ];
  tbl TEXT;
  pol RECORD;
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl)
    LOOP
      EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.' || quote_ident(tbl);
    END LOOP;
  END LOOP;
END $$;

-- Admin CRUD policies (using is_admin() function)
-- Note: Assumes is_admin() function exists (from previous migrations)

-- pl_ux_wrappers policies
CREATE POLICY "pl_ux_wrappers_admin_all" ON public.pl_ux_wrappers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_ux_wrapper_needs policies
CREATE POLICY "pl_ux_wrapper_needs_admin_all" ON public.pl_ux_wrapper_needs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_ux_wrappers policies
CREATE POLICY "pl_age_band_ux_wrappers_admin_all" ON public.pl_age_band_ux_wrappers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_development_need_meta policies
CREATE POLICY "pl_age_band_development_need_meta_admin_all" ON public.pl_age_band_development_need_meta
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_development_need_category_types policies
CREATE POLICY "pl_age_band_development_need_category_types_admin_all" ON public.pl_age_band_development_need_category_types
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_category_type_products policies
CREATE POLICY "pl_age_band_category_type_products_admin_all" ON public.pl_age_band_category_type_products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PART 7: CREATE CURATED PUBLIC VIEWS
-- ============================================================================

-- Drop existing views if they exist (idempotent)
DROP VIEW IF EXISTS public.v_gateway_age_bands_public;
DROP VIEW IF EXISTS public.v_gateway_wrappers_public;
DROP VIEW IF EXISTS public.v_gateway_development_needs_public;
DROP VIEW IF EXISTS public.v_gateway_category_types_public;
DROP VIEW IF EXISTS public.v_gateway_products_public;
DROP VIEW IF EXISTS public.v_gateway_wrapper_detail_public;

-- v_gateway_age_bands_public: Only age bands with at least one active wrapper ranking
CREATE VIEW public.v_gateway_age_bands_public AS
SELECT DISTINCT
  ab.id,
  ab.label,
  ab.min_months,
  ab.max_months
FROM public.pl_age_bands ab
INNER JOIN public.pl_age_band_ux_wrappers abuw ON ab.id = abuw.age_band_id
WHERE ab.is_active = true
  AND abuw.is_active = true;

-- v_gateway_wrappers_public: UX wrappers with rank per age band
CREATE VIEW public.v_gateway_wrappers_public AS
SELECT 
  uw.id AS ux_wrapper_id,
  uw.ux_label,
  uw.ux_slug,
  uw.ux_description,
  abuw.age_band_id,
  abuw.rank
FROM public.pl_ux_wrappers uw
JOIN public.pl_age_band_ux_wrappers abuw ON uw.id = abuw.ux_wrapper_id
WHERE uw.is_active = true
  AND abuw.is_active = true
ORDER BY abuw.age_band_id, abuw.rank;

-- v_gateway_wrapper_detail_public: Wrapper + linked need + age-band need meta (stage fields)
CREATE VIEW public.v_gateway_wrapper_detail_public AS
SELECT 
  abuw.age_band_id,
  abuw.rank,
  uw.id AS ux_wrapper_id,
  uw.ux_label,
  uw.ux_slug,
  uw.ux_description,
  dn.id AS development_need_id,
  dn.name AS development_need_name,
  dn.slug AS development_need_slug,
  dn.plain_english_description,
  dn.why_it_matters,
  meta.stage_anchor_month,
  meta.stage_phase,
  meta.stage_reason
FROM public.pl_ux_wrappers uw
INNER JOIN public.pl_age_band_ux_wrappers abuw ON uw.id = abuw.ux_wrapper_id
INNER JOIN public.pl_ux_wrapper_needs uwn ON uw.id = uwn.ux_wrapper_id
INNER JOIN public.pl_development_needs dn ON uwn.development_need_id = dn.id
LEFT JOIN public.pl_age_band_development_need_meta meta 
  ON dn.id = meta.development_need_id 
  AND abuw.age_band_id = meta.age_band_id
  AND meta.is_active = true
WHERE uw.is_active = true
  AND abuw.is_active = true
ORDER BY abuw.age_band_id, abuw.rank;

-- v_gateway_development_needs_public: Only needs reachable from active gateway wrappers
CREATE VIEW public.v_gateway_development_needs_public AS
SELECT DISTINCT
  dn.id,
  dn.name,
  dn.slug,
  dn.plain_english_description,
  dn.why_it_matters
FROM public.pl_development_needs dn
INNER JOIN public.pl_ux_wrapper_needs uwn ON dn.id = uwn.development_need_id
INNER JOIN public.pl_age_band_ux_wrappers abuw ON uwn.ux_wrapper_id = abuw.ux_wrapper_id
WHERE abuw.is_active = true;

-- v_gateway_category_types_public: Age-band scoped, only reachable via active mappings
CREATE VIEW public.v_gateway_category_types_public AS
SELECT 
  abdnct.age_band_id,
  abdnct.development_need_id,
  abdnct.rank,
  abdnct.rationale,
  ct.id,
  ct.slug,
  ct.label,
  ct.name,
  ct.description,
  ct.image_url,
  ct.safety_notes
FROM public.pl_category_types ct
INNER JOIN public.pl_age_band_development_need_category_types abdnct ON ct.id = abdnct.category_type_id
WHERE abdnct.is_active = true
ORDER BY abdnct.age_band_id, abdnct.development_need_id, abdnct.rank;

-- v_gateway_products_public: Age-band scoped, only reachable via active mappings
CREATE VIEW public.v_gateway_products_public AS
SELECT 
  abctp.age_band_id,
  abctp.category_type_id,
  abctp.rank,
  abctp.rationale,
  p.id,
  p.name,
  p.brand,
  p.image_url,
  p.canonical_url,
  p.amazon_uk_url,
  p.affiliate_url,
  p.affiliate_deeplink
FROM public.products p
INNER JOIN public.pl_age_band_category_type_products abctp ON p.id = abctp.product_id
WHERE abctp.is_active = true
  AND p.is_archived = false
ORDER BY abctp.age_band_id, abctp.category_type_id, abctp.rank;

-- ============================================================================
-- PART 8: GRANT SELECT ON VIEWS TO ANON/AUTHENTICATED
-- ============================================================================

-- Grant SELECT on all curated views to anon and authenticated roles
GRANT SELECT ON public.v_gateway_age_bands_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_wrappers_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_wrapper_detail_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_development_needs_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_category_types_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_products_public TO anon, authenticated;

-- ============================================================================
-- PART 9: ENSURE AGE BANDS 23-25m AND 25-27m EXIST
-- ============================================================================

-- Insert age bands if they don't exist (idempotent)
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
VALUES 
  ('23-25m', '23-25 months', 23, 25, true),
  ('25-27m', '25-27 months', 25, 27, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PART 10: POPULATE DATA FROM SEED TABLES (IDEMPOTENT)
-- ============================================================================

-- Note: This section assumes seed tables exist and have data.
-- The population logic is idempotent (uses ON CONFLICT or checks before insert).
--
-- IMPORTANT: All PL/pgSQL variables must be prefixed with v_ to avoid ambiguity
-- with column names in INSERT statements (e.g., v_product_id, v_category_id, v_need_id).

-- 10.1: Populate pl_development_needs from pl_seed_development_needs (if not already populated)
-- This is idempotent - only inserts if name doesn't exist, updates only NULL/empty descriptions
DO $$
DECLARE
  seed_rec RECORD;
  v_need_id UUID;
  need_slug TEXT;
BEGIN
  -- Only proceed if pl_seed_development_needs table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_development_needs'
  ) THEN
    FOR seed_rec IN (
      SELECT DISTINCT ON (need_name)
        need_name,
        plain_english_description,
        why_it_matters
      FROM public.pl_seed_development_needs
      WHERE need_name IS NOT NULL
      ORDER BY need_name, imported_at DESC NULLS LAST
    )
    LOOP
      -- Generate slug from need_name (use existing function if available, otherwise simple slugify)
      BEGIN
        need_slug := public.slugify_need_name(seed_rec.need_name);
      EXCEPTION WHEN OTHERS THEN
        need_slug := public.slugify_ux_label(seed_rec.need_name);
      END;
      
      -- Check if need already exists (by name or slug)
      SELECT id INTO v_need_id
      FROM public.pl_development_needs
      WHERE name = seed_rec.need_name
         OR slug = need_slug
      LIMIT 1;
      
      IF v_need_id IS NULL THEN
        -- Insert new development need (only canonical columns)
        INSERT INTO public.pl_development_needs (
          name,
          slug,
          plain_english_description,
          why_it_matters
        )
        VALUES (
          seed_rec.need_name,
          need_slug,
          COALESCE(seed_rec.plain_english_description, ''),
          COALESCE(seed_rec.why_it_matters, '')
        )
        RETURNING id INTO v_need_id;
      ELSE
        -- Update existing need only if descriptions are NULL/empty
        UPDATE public.pl_development_needs
        SET 
          plain_english_description = COALESCE(
            NULLIF(plain_english_description, ''),
            seed_rec.plain_english_description,
            ''
          ),
          why_it_matters = COALESCE(
            NULLIF(why_it_matters, ''),
            seed_rec.why_it_matters,
            ''
          ),
          slug = COALESCE(slug, need_slug)
        WHERE id = v_need_id;
      END IF;
    END LOOP;
  END IF;
END $$;

-- 10.2: Populate pl_ux_wrappers from pl_need_ux_labels (if exists) for 25-27m
-- This creates UX wrappers from existing pl_need_ux_labels mappings
DO $$
DECLARE
  ux_rec RECORD;
  v_wrapper_id UUID;
  wrapper_slug TEXT;
BEGIN
  -- Only proceed if pl_need_ux_labels table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_need_ux_labels'
  ) THEN
    FOR ux_rec IN (
      SELECT DISTINCT ON (ul.ux_label)
        ul.ux_label,
        ul.ux_slug,
        ul.ux_description,
        ul.development_need_id
      FROM public.pl_need_ux_labels ul
      WHERE ul.is_active = true AND ul.is_primary = true
      ORDER BY ul.ux_label, ul.created_at DESC
    )
    LOOP
      -- Generate slug if not provided
      wrapper_slug := COALESCE(ux_rec.ux_slug, public.slugify_ux_label(ux_rec.ux_label));
      
      -- Insert UX wrapper (idempotent - match by ux_slug)
      INSERT INTO public.pl_ux_wrappers (ux_label, ux_slug, ux_description)
      VALUES (ux_rec.ux_label, wrapper_slug, ux_rec.ux_description)
      ON CONFLICT (ux_slug) DO UPDATE SET
        ux_label = EXCLUDED.ux_label,
        ux_description = COALESCE(pl_ux_wrappers.ux_description, EXCLUDED.ux_description)
      RETURNING id INTO v_wrapper_id;
      
      -- Get v_wrapper_id if it already existed
      IF v_wrapper_id IS NULL THEN
        SELECT id INTO v_wrapper_id FROM public.pl_ux_wrappers WHERE ux_slug = wrapper_slug;
      END IF;
      
      -- Link wrapper to development need (1:1, idempotent)
      INSERT INTO public.pl_ux_wrapper_needs (ux_wrapper_id, development_need_id)
      VALUES (v_wrapper_id, ux_rec.development_need_id)
      ON CONFLICT (ux_wrapper_id) DO NOTHING;
      
      -- Link wrapper to age band 25-27m (idempotent)
      -- Use a simple rank based on creation order (can be adjusted later)
      INSERT INTO public.pl_age_band_ux_wrappers (age_band_id, ux_wrapper_id, rank, is_active)
      SELECT 
        '25-27m',
        v_wrapper_id,
        COALESCE((SELECT MAX(rank) FROM public.pl_age_band_ux_wrappers WHERE age_band_id = '25-27m'), 0) + 1,
        true
      ON CONFLICT (age_band_id, ux_wrapper_id) DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- 10.3: Populate pl_age_band_development_need_meta from seed tables for 23-25m and 25-27m
-- Filter seed needs by age band overlap (seed.min_month <= band.max_months AND seed.max_month >= band.min_months)
DO $$
DECLARE
  seed_rec RECORD;
  v_need_id UUID;
  v_age_band_id TEXT;
  band_min_months INTEGER;
  band_max_months INTEGER;
BEGIN
  -- Only proceed if pl_seed_development_needs table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_development_needs'
  ) THEN
    FOR v_age_band_id IN SELECT unnest(ARRAY['23-25m', '25-27m'])
    LOOP
      -- Get age band min/max months for overlap check
      SELECT min_months, max_months INTO band_min_months, band_max_months
      FROM public.pl_age_bands
      WHERE id = v_age_band_id
      LIMIT 1;
      
      -- Only proceed if age band found
      IF band_min_months IS NOT NULL AND band_max_months IS NOT NULL THEN
        FOR seed_rec IN (
          SELECT DISTINCT ON (need_name)
            need_name,
            min_month,
            max_month,
            stage_anchor_month,
            stage_phase,
            stage_reason
          FROM public.pl_seed_development_needs
          WHERE need_name IS NOT NULL
            -- Filter by age band overlap
            AND min_month <= band_max_months
            AND max_month >= band_min_months
          ORDER BY need_name, imported_at DESC NULLS LAST
        )
        LOOP
          -- Find development need by name
          SELECT id INTO v_need_id 
          FROM public.pl_development_needs 
          WHERE name = seed_rec.need_name
          LIMIT 1;
          
          -- Insert meta if need found
          IF v_need_id IS NOT NULL THEN
            INSERT INTO public.pl_age_band_development_need_meta (
              age_band_id,
              development_need_id,
              stage_anchor_month,
              stage_phase,
              stage_reason,
              is_active
            )
            VALUES (
              v_age_band_id,
              v_need_id,
              seed_rec.stage_anchor_month,
              seed_rec.stage_phase,
              seed_rec.stage_reason,
              true
            )
            ON CONFLICT (age_band_id, development_need_id) DO UPDATE SET
              -- Only overwrite if existing is NULL/empty
              stage_anchor_month = COALESCE(
                pl_age_band_development_need_meta.stage_anchor_month,
                EXCLUDED.stage_anchor_month
              ),
              stage_phase = COALESCE(
                NULLIF(pl_age_band_development_need_meta.stage_phase, ''),
                EXCLUDED.stage_phase
              ),
              stage_reason = COALESCE(
                NULLIF(pl_age_band_development_need_meta.stage_reason, ''),
                EXCLUDED.stage_reason
              );
          END IF;
        END LOOP;
      END IF;
    END LOOP;
  END IF;
END $$;

-- 10.4: Populate pl_age_band_development_need_category_types from seed tables
-- This maps category types to development needs based on mapped_developmental_needs (comma-separated)
DO $$
DECLARE
  seed_rec RECORD;
  v_category_id UUID;
  v_need_name TEXT;
  v_need_id UUID;
  v_age_band_id TEXT;
  rank_counter INTEGER;
BEGIN
  -- Only proceed if pl_seed_category_types table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_category_types'
  ) THEN
    FOR v_age_band_id IN SELECT unnest(ARRAY['23-25m', '25-27m'])
    LOOP
      FOR seed_rec IN (
        SELECT DISTINCT ON (slug)
          slug,
          name,
          mapped_developmental_needs,
          stage_reason
        FROM public.pl_seed_category_types
        WHERE slug IS NOT NULL
        ORDER BY slug, imported_at DESC NULLS LAST
      )
      LOOP
        -- Find category type by slug
        SELECT id INTO v_category_id 
        FROM public.pl_category_types 
        WHERE slug = seed_rec.slug
        LIMIT 1;
        
        -- If category found and has mapped needs
        IF v_category_id IS NOT NULL AND seed_rec.mapped_developmental_needs IS NOT NULL THEN
          rank_counter := 1;
          
          -- Parse comma-separated need names
          FOR v_need_name IN (
            SELECT trim(unnest(string_to_array(seed_rec.mapped_developmental_needs, ',')))
          )
          LOOP
            -- Find development need by name
            SELECT id INTO v_need_id 
            FROM public.pl_development_needs 
            WHERE name = trim(v_need_name)
            LIMIT 1;
            
            -- Insert mapping if need found
            IF v_need_id IS NOT NULL THEN
              INSERT INTO public.pl_age_band_development_need_category_types (
                age_band_id,
                development_need_id,
                category_type_id,
                rank,
                rationale,
                is_active
              )
              VALUES (
                v_age_band_id,
                v_need_id,
                v_category_id,
                rank_counter,
                seed_rec.stage_reason,
                true
              )
              ON CONFLICT (age_band_id, development_need_id, category_type_id) DO NOTHING;
              
              rank_counter := rank_counter + 1;
            END IF;
          END LOOP;
        END IF;
      END LOOP;
    END LOOP;
  END IF;
END $$;

-- 10.5: Populate pl_age_band_category_type_products from seed tables
-- This maps products to category types for each age band
DO $$
DECLARE
  seed_rec RECORD;
  v_category_id UUID;
  v_product_id UUID;
  v_age_band_id TEXT;
  rank_counter INTEGER;
  v_rationale TEXT;
BEGIN
  -- Only proceed if pl_seed_products table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_products'
  ) THEN
    FOR v_age_band_id IN SELECT unnest(ARRAY['23-25m', '25-27m'])
    LOOP
      FOR seed_rec IN (
        SELECT DISTINCT ON (name, brand)
          name,
          brand,
          category_type_slug,
          age_band_id AS seed_age_band_id,
          stage_reason,
          age_suitability_note
        FROM public.pl_seed_products
        WHERE name IS NOT NULL 
          AND category_type_slug IS NOT NULL
          AND age_band_id = v_age_band_id
        ORDER BY name, brand, imported_at DESC NULLS LAST
      )
      LOOP
        -- Find category type by slug
        SELECT id INTO v_category_id 
        FROM public.pl_category_types 
        WHERE slug = seed_rec.category_type_slug
        LIMIT 1;
        
        -- Find product by name and brand (best-effort match)
        SELECT id INTO v_product_id 
        FROM public.products 
        WHERE name = seed_rec.name
          AND (brand = seed_rec.brand OR (brand IS NULL AND seed_rec.brand IS NULL))
        LIMIT 1;
        
        -- If both found, create mapping
        IF v_category_id IS NOT NULL AND v_product_id IS NOT NULL THEN
          -- Get next rank for this age band + category
          SELECT COALESCE(MAX(rank), 0) + 1 INTO rank_counter
          FROM public.pl_age_band_category_type_products
          WHERE age_band_id = v_age_band_id AND category_type_id = v_category_id;
          
          -- Build rationale: stage_reason || ' | ' || age_suitability_note (safe concat)
          v_rationale := NULL;
          IF seed_rec.stage_reason IS NOT NULL AND seed_rec.stage_reason != '' THEN
            v_rationale := seed_rec.stage_reason;
          END IF;
          IF seed_rec.age_suitability_note IS NOT NULL AND seed_rec.age_suitability_note != '' THEN
            IF v_rationale IS NOT NULL THEN
              v_rationale := v_rationale || ' | ' || seed_rec.age_suitability_note;
            ELSE
              v_rationale := seed_rec.age_suitability_note;
            END IF;
          END IF;
          
          INSERT INTO public.pl_age_band_category_type_products (
            age_band_id,
            category_type_id,
            product_id,
            rank,
            rationale,
            is_active
          )
          VALUES (
            v_age_band_id,
            v_category_id,
            v_product_id,
            rank_counter,
            v_rationale,
            true
          )
          ON CONFLICT (age_band_id, category_type_id, product_id) DO NOTHING;
        END IF;
      END LOOP;
    END LOOP;
  END IF;
END $$;

-- ============================================================================
-- PART 10.6: ENSURE WRAPPERS + WRAPPER MAPPINGS + RANKINGS EXIST (FALLBACK)
-- ============================================================================
-- Fallback wrapper population using canonical/meta tables when pl_need_ux_labels is missing or empty.
-- This ensures wrappers exist for all development needs in the gateway (from pl_age_band_development_need_meta).
-- All operations are idempotent and set-based (no PL/pgSQL loops).

-- 10.6.1: Create wrappers from gateway development needs (idempotent)
-- Source: distinct development_need_id from pl_age_band_development_need_meta where age_band_id in ('23-25m','25-27m') and is_active = true
INSERT INTO public.pl_ux_wrappers (ux_slug, ux_label, ux_description, is_active)
SELECT DISTINCT
  dn.slug AS ux_slug,
  CASE
    WHEN dn.name = 'Color and shape recognition' THEN 'Shapes & colours'
    WHEN dn.name = 'Creative expression and mark-making' THEN 'Drawing & making'
    WHEN dn.name = 'Emotional regulation and self-awareness' THEN 'Big feelings'
    WHEN dn.name = 'Fine motor control and hand coordination' THEN 'Little hands'
    WHEN dn.name = 'Gross motor skills and physical confidence' THEN 'Burn energy'
    WHEN dn.name ILIKE 'Independence and practical%' THEN 'Do it myself'
    ELSE dn.name
  END AS ux_label,
  NULLIF(dn.plain_english_description, '') AS ux_description,
  true AS is_active
FROM public.pl_age_band_development_need_meta meta
INNER JOIN public.pl_development_needs dn ON meta.development_need_id = dn.id
WHERE meta.age_band_id IN ('23-25m', '25-27m')
  AND meta.is_active = true
ON CONFLICT (ux_slug) DO UPDATE SET
  is_active = true,
  ux_label = COALESCE(NULLIF(pl_ux_wrappers.ux_label, ''), EXCLUDED.ux_label),
  ux_description = COALESCE(NULLIF(pl_ux_wrappers.ux_description, ''), EXCLUDED.ux_description),
  updated_at = now();

-- 10.6.2: Map wrappers to development needs (idempotent)
-- Only include needs in the gateway need set (from meta table)
INSERT INTO public.pl_ux_wrapper_needs (ux_wrapper_id, development_need_id)
SELECT DISTINCT
  uw.id AS ux_wrapper_id,
  dn.id AS development_need_id
FROM public.pl_age_band_development_need_meta meta
INNER JOIN public.pl_development_needs dn ON meta.development_need_id = dn.id
INNER JOIN public.pl_ux_wrappers uw ON uw.ux_slug = dn.slug
WHERE meta.age_band_id IN ('23-25m', '25-27m')
  AND meta.is_active = true
ON CONFLICT (ux_wrapper_id) DO UPDATE SET
  development_need_id = EXCLUDED.development_need_id,
  updated_at = now();

-- 10.6.3: Create age-band wrapper rankings (idempotent)
-- Rank wrappers deterministically using stage_anchor_month proximity to band midpoint
INSERT INTO public.pl_age_band_ux_wrappers (age_band_id, ux_wrapper_id, rank, is_active)
SELECT
  ranked.age_band_id,
  ranked.ux_wrapper_id,
  ranked.rank,
  true AS is_active
FROM (
  SELECT
    meta.age_band_id,
    uw.id AS ux_wrapper_id,
    ROW_NUMBER() OVER (
      PARTITION BY meta.age_band_id
      ORDER BY 
        ABS(COALESCE(meta.stage_anchor_month, (ab.min_months + ab.max_months) / 2.0) - (ab.min_months + ab.max_months) / 2.0),
        dn.name
    ) AS rank
  FROM public.pl_age_band_development_need_meta meta
  INNER JOIN public.pl_age_bands ab ON meta.age_band_id = ab.id
  INNER JOIN public.pl_development_needs dn ON meta.development_need_id = dn.id
  INNER JOIN public.pl_ux_wrappers uw ON uw.ux_slug = dn.slug
  WHERE meta.age_band_id IN ('23-25m', '25-27m')
    AND meta.is_active = true
) ranked
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE SET
  rank = EXCLUDED.rank,
  is_active = true,
  updated_at = now();

-- ============================================================================
-- PART 11: PROOF BUNDLE (verification output)
-- ============================================================================

DO $$
DECLARE
  age_band_count INTEGER;
  ux_wrapper_count INTEGER;
  wrapper_need_count INTEGER;
  age_band_wrapper_count INTEGER;
  meta_count INTEGER;
  meta_count_23_25 INTEGER;
  meta_count_25_27 INTEGER;
  need_category_count INTEGER;
  category_product_count INTEGER;
  development_needs_count INTEGER;
  view_age_band_count INTEGER;
  view_wrapper_count INTEGER;
  view_wrapper_count_25_27 INTEGER;
  view_need_count INTEGER;
  view_category_count INTEGER;
  view_product_count INTEGER;
  view_wrapper_detail_count INTEGER;
  rec RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'PHASE A DB FOUNDATION - PROOF BUNDLE';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '';
  
  -- Age bands
  SELECT COUNT(*) INTO age_band_count FROM public.pl_age_bands WHERE id IN ('23-25m', '25-27m');
  RAISE NOTICE '=== AGE BANDS ===';
  RAISE NOTICE 'Age bands (23-25m, 25-27m): % (expected: 2)', age_band_count;
  
  -- Development needs (seed import verification)
  SELECT COUNT(*) INTO development_needs_count FROM public.pl_development_needs;
  RAISE NOTICE '';
  RAISE NOTICE '=== SEED IMPORT: DEVELOPMENT NEEDS ===';
  RAISE NOTICE 'Total pl_development_needs rows: % (seed import succeeded if > 0)', development_needs_count;
  
  -- UX wrappers
  SELECT COUNT(*) INTO ux_wrapper_count FROM public.pl_ux_wrappers;
  RAISE NOTICE '';
  RAISE NOTICE '=== UX WRAPPERS ===';
  RAISE NOTICE 'Total UX wrappers: %', ux_wrapper_count;
  
  -- Wrapper-need mappings
  SELECT COUNT(*) INTO wrapper_need_count FROM public.pl_ux_wrapper_needs;
  RAISE NOTICE '';
  RAISE NOTICE '=== WRAPPER-NEED MAPPINGS ===';
  RAISE NOTICE 'Total wrapper-need mappings: %', wrapper_need_count;
  
  -- Age band wrapper rankings
  SELECT COUNT(*) INTO age_band_wrapper_count 
  FROM public.pl_age_band_ux_wrappers 
  WHERE age_band_id IN ('23-25m', '25-27m');
  RAISE NOTICE '';
  RAISE NOTICE '=== AGE BAND WRAPPER RANKINGS ===';
  RAISE NOTICE 'Age band wrapper rankings (23-25m, 25-27m): %', age_band_wrapper_count;
  
  -- Wrappers for 25-27m (seed import verification)
  SELECT COUNT(*) INTO view_wrapper_count_25_27
  FROM public.v_gateway_wrappers_public
  WHERE age_band_id = '25-27m';
  RAISE NOTICE 'Wrappers for 25-27m: % (seed import succeeded if > 0)', view_wrapper_count_25_27;
  
  -- Development need meta (seed import verification)
  SELECT COUNT(*) INTO meta_count 
  FROM public.pl_age_band_development_need_meta 
  WHERE age_band_id IN ('23-25m', '25-27m');
  SELECT COUNT(*) INTO meta_count_23_25
  FROM public.pl_age_band_development_need_meta 
  WHERE age_band_id = '23-25m';
  SELECT COUNT(*) INTO meta_count_25_27
  FROM public.pl_age_band_development_need_meta 
  WHERE age_band_id = '25-27m';
  RAISE NOTICE '';
  RAISE NOTICE '=== SEED IMPORT: DEVELOPMENT NEED META ===';
  RAISE NOTICE 'Development need meta records (23-25m, 25-27m): %', meta_count;
  RAISE NOTICE '  - 23-25m: %', meta_count_23_25;
  RAISE NOTICE '  - 25-27m: %', meta_count_25_27;
  
  -- Need-category mappings
  SELECT COUNT(*) INTO need_category_count 
  FROM public.pl_age_band_development_need_category_types 
  WHERE age_band_id IN ('23-25m', '25-27m');
  RAISE NOTICE '';
  RAISE NOTICE '=== NEED-CATEGORY MAPPINGS ===';
  RAISE NOTICE 'Need-category mappings (23-25m, 25-27m): %', need_category_count;
  
  -- Category-product mappings
  SELECT COUNT(*) INTO category_product_count 
  FROM public.pl_age_band_category_type_products 
  WHERE age_band_id IN ('23-25m', '25-27m');
  RAISE NOTICE '';
  RAISE NOTICE '=== CATEGORY-PRODUCT MAPPINGS ===';
  RAISE NOTICE 'Category-product mappings (23-25m, 25-27m): %', category_product_count;
  
  -- Sample data from views
  RAISE NOTICE '';
  RAISE NOTICE '=== VIEW SAMPLE DATA ===';
  
  SELECT COUNT(*) INTO view_age_band_count FROM public.v_gateway_age_bands_public;
  RAISE NOTICE 'v_gateway_age_bands_public rows: %', view_age_band_count;
  
  SELECT COUNT(*) INTO view_wrapper_count FROM public.v_gateway_wrappers_public;
  RAISE NOTICE 'v_gateway_wrappers_public rows: %', view_wrapper_count;
  
  SELECT COUNT(*) INTO view_need_count FROM public.v_gateway_development_needs_public;
  RAISE NOTICE 'v_gateway_development_needs_public rows: %', view_need_count;
  
  SELECT COUNT(*) INTO view_category_count FROM public.v_gateway_category_types_public;
  RAISE NOTICE 'v_gateway_category_types_public rows: %', view_category_count;
  
  SELECT COUNT(*) INTO view_product_count FROM public.v_gateway_products_public;
  RAISE NOTICE 'v_gateway_products_public rows: %', view_product_count;
  
  SELECT COUNT(*) INTO view_wrapper_detail_count FROM public.v_gateway_wrapper_detail_public;
  RAISE NOTICE 'v_gateway_wrapper_detail_public rows: %', view_wrapper_detail_count;
  
  -- Sample wrapper detail data for 25-27m
  RAISE NOTICE '';
  RAISE NOTICE '=== SAMPLE: v_gateway_wrapper_detail_public (first 5 for 25-27m) ===';
  FOR rec IN (
    SELECT 
      age_band_id,
      rank,
      ux_wrapper_id,
      ux_label,
      ux_slug,
      development_need_id,
      development_need_name
    FROM public.v_gateway_wrapper_detail_public
    WHERE age_band_id = '25-27m'
    ORDER BY rank
    LIMIT 5
  )
  LOOP
    RAISE NOTICE '  age_band_id: %, rank: %, ux_wrapper_id: %, ux_label: %, ux_slug: %, need: %',
      rec.age_band_id, rec.rank, rec.ux_wrapper_id, 
      rec.ux_label, rec.ux_slug, rec.development_need_name;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'PROOF BUNDLE COMPLETE';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '';
END $$;

-- === 202601150000_phase2a_canonise_layer_a_development_needs.sql ===

-- Phase 2A: Canonise Layer A (Development Needs)
-- Date: 2026-01-15
-- Purpose: Create pl_development_needs table with correct schema and populate from Manus Layer A CSV
-- Source of Truth: Manus_LayerA-Sample-Development-Needs.csv (12 development needs)

-- ============================================================================
-- PART 1: INSPECT EXISTING SCHEMA (for documentation)
-- ============================================================================

-- Query to inspect pl_development_needs schema (run separately in SQL Editor):
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable,
--   column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'pl_development_needs'
-- ORDER BY ordinal_position;

-- Query to inspect pl_seed_development_needs schema and data (run separately):
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'pl_seed_development_needs'
-- ORDER BY ordinal_position;
-- SELECT * FROM public.pl_seed_development_needs;

-- ============================================================================
-- PART 2: CREATE pl_development_needs TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pl_development_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_name TEXT NOT NULL,
  slug TEXT,
  plain_english_description TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  min_month INTEGER NOT NULL,
  max_month INTEGER NOT NULL,
  stage_anchor_month INTEGER,
  stage_phase TEXT,
  stage_reason TEXT,
  evidence_urls TEXT[],
  evidence_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- PART 3: ADD COLUMNS IF TABLE EXISTS BUT MISSING COLUMNS
-- ============================================================================

-- Add need_name if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'need_name'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN need_name TEXT;
  END IF;
END $$;

-- Add plain_english_description if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'plain_english_description'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN plain_english_description TEXT;
  END IF;
END $$;

-- Add why_it_matters if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'why_it_matters'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN why_it_matters TEXT;
  END IF;
END $$;

-- Add min_month if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'min_month'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN min_month INTEGER;
  END IF;
END $$;

-- Add max_month if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'max_month'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN max_month INTEGER;
  END IF;
END $$;

-- Add stage_anchor_month if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'stage_anchor_month'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN stage_anchor_month INTEGER;
  END IF;
END $$;

-- Add stage_phase if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'stage_phase'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN stage_phase TEXT;
  END IF;
END $$;

-- Add stage_reason if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'stage_reason'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN stage_reason TEXT;
  END IF;
END $$;

-- Add evidence_urls if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'evidence_urls'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN evidence_urls TEXT[];
  END IF;
END $$;

-- Add evidence_notes if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'evidence_notes'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN evidence_notes TEXT;
  END IF;
END $$;

-- Add slug if missing (may have been added by previous migration)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN slug TEXT;
  END IF;
END $$;

-- Add name column if missing (for backwards compatibility with legacy schema)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'name'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD COLUMN name TEXT;
  END IF;
END $$;

-- ============================================================================
-- PART 4: ADD CONSTRAINTS AND INDEXES
-- ============================================================================

-- Make need_name required (if not already)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' 
      AND column_name = 'need_name' AND is_nullable = 'YES'
  ) THEN
    -- First ensure no NULLs exist
    UPDATE public.pl_development_needs SET need_name = 'Unknown' WHERE need_name IS NULL;
    ALTER TABLE public.pl_development_needs ALTER COLUMN need_name SET NOT NULL;
  END IF;
END $$;

-- Make plain_english_description required (if not already)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' 
      AND column_name = 'plain_english_description' AND is_nullable = 'YES'
  ) THEN
    UPDATE public.pl_development_needs SET plain_english_description = '' WHERE plain_english_description IS NULL;
    ALTER TABLE public.pl_development_needs ALTER COLUMN plain_english_description SET NOT NULL;
  END IF;
END $$;

-- Make why_it_matters required (if not already)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' 
      AND column_name = 'why_it_matters' AND is_nullable = 'YES'
  ) THEN
    UPDATE public.pl_development_needs SET why_it_matters = '' WHERE why_it_matters IS NULL;
    ALTER TABLE public.pl_development_needs ALTER COLUMN why_it_matters SET NOT NULL;
  END IF;
END $$;

-- Make min_month required (if not already)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' 
      AND column_name = 'min_month' AND is_nullable = 'YES'
  ) THEN
    UPDATE public.pl_development_needs SET min_month = 0 WHERE min_month IS NULL;
    ALTER TABLE public.pl_development_needs ALTER COLUMN min_month SET NOT NULL;
  END IF;
END $$;

-- Make max_month required (if not already)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' 
      AND column_name = 'max_month' AND is_nullable = 'YES'
  ) THEN
    UPDATE public.pl_development_needs SET max_month = 72 WHERE max_month IS NULL;
    ALTER TABLE public.pl_development_needs ALTER COLUMN max_month SET NOT NULL;
  END IF;
END $$;

-- Unique constraint on slug (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pl_development_needs_slug_unique'
  ) THEN
    CREATE UNIQUE INDEX pl_development_needs_slug_unique 
    ON public.pl_development_needs(slug)
    WHERE slug IS NOT NULL;
  END IF;
END $$;

-- Unique constraint on need_name
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pl_development_needs_need_name_unique'
  ) THEN
    ALTER TABLE public.pl_development_needs ADD CONSTRAINT pl_development_needs_need_name_unique UNIQUE (need_name);
  END IF;
END $$;

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS pl_development_needs_slug_idx ON public.pl_development_needs(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS pl_development_needs_min_month_idx ON public.pl_development_needs(min_month);
CREATE INDEX IF NOT EXISTS pl_development_needs_max_month_idx ON public.pl_development_needs(max_month);

-- ============================================================================
-- PART 5: HELPER FUNCTION TO GENERATE SLUG FROM NEED_NAME
-- ============================================================================

CREATE OR REPLACE FUNCTION public.slugify_need_name(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- PART 6: PREFLIGHT / BACKFILL (handle legacy schema drift)
-- ============================================================================

-- Backfill: If name column exists, populate from need_name where name is NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'name'
  ) THEN
    UPDATE public.pl_development_needs
    SET name = need_name
    WHERE name IS NULL AND need_name IS NOT NULL;
  END IF;
END $$;

-- Backfill: If need_name is NULL but name exists, populate need_name from name
DO $$
BEGIN
  UPDATE public.pl_development_needs
  SET need_name = name
  WHERE need_name IS NULL AND name IS NOT NULL;
END $$;

-- ============================================================================
-- PART 7: POPULATE FROM MANUS LAYER A CSV DATA (UPSERT-based)
-- ============================================================================

-- UPSERT: Use ON CONFLICT to handle re-runs gracefully
-- Handles legacy name column if it exists
DO $$
DECLARE
  has_name_column BOOLEAN;
BEGIN
  -- Check if name column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pl_development_needs' AND column_name = 'name'
  ) INTO has_name_column;
  
  -- UPSERT with conflict on need_name (unique constraint created in PART 4)
  IF has_name_column THEN
    -- Insert with both need_name and name (for legacy compatibility)
    INSERT INTO public.pl_development_needs (
      need_name, name, slug, plain_english_description, why_it_matters,
      min_month, max_month, stage_anchor_month, stage_phase, stage_reason,
      evidence_urls, evidence_notes
    ) VALUES
    ('Gross motor skills and physical confidence', 'Gross motor skills and physical confidence', 'gross-motor-skills-and-physical-confidence', 'Running, jumping, kicking balls, climbing stairs, and moving with increasing coordination and control.', 'Builds physical confidence, supports exploration, and provides foundation for active play and outdoor activities.', 24, 36, 26, 'consolidating', 'Children at 24 months can run and kick balls; by 30 months most can jump with both feet, showing steady progression.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://cambspborochildrenshealth.nhs.uk/child-development-and-growing-up/milestones/2-years/'], 'CDC lists running and kicking at 24 months.|NHS describes jumping with both feet and steering toys around objects at 2 years.'),
    ('Fine motor control and hand coordination', 'Fine motor control and hand coordination', 'fine-motor-control-and-hand-coordination', 'Using both hands together for tasks, manipulating small objects, turning pages, and operating buttons and switches.', 'Enables self-care tasks, supports learning through hands-on exploration, and prepares for writing and tool use.', 24, 36, 26, 'consolidating', 'At 24 months children hold containers while removing lids; by 30 months they twist doorknobs and turn pages individually.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.cdc.gov/act-early/milestones/30-months.html'], 'CDC 24m milestone: holds something in one hand while using other.|CDC 30m milestone: uses hands to twist things like doorknobs.'),
    ('Language development and communication', 'Language development and communication', 'language-development-and-communication', 'Speaking in two-word phrases, rapidly expanding vocabulary, naming objects, and using personal pronouns.', 'Enables children to express needs and feelings, reduces frustration, and supports social interaction and learning.', 24, 36, 26, 'emerging', 'At 24 months children say two words together; by 30 months vocabulary expands to about 50 words with action words.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.zerotothree.org/resource/24-30-months-your-childs-development/'], 'CDC notes 2-word phrases and pointing to body parts at 24 months.|Zero to Three describes using growing language skills to express thoughts and feelings.'),
    ('Pretend play and imagination', 'Pretend play and imagination', 'pretend-play-and-imagination', 'Using objects symbolically, engaging in role-play, and creating simple pretend scenarios.', 'Builds language, thinking, and social skills; helps children process experiences and develop creativity.', 24, 36, 26, 'emerging', 'Pretend play shows real explosion during this period as children begin symbolic thinking and role-taking.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.zerotothree.org/resource/24-36-months-social-emotional-development/'], 'CDC 24m: plays with more than one toy at same time.|Zero to Three describes ''real explosion in pretend play'' as critical developmental aspect.'),
    ('Social skills and peer interaction', 'Social skills and peer interaction', 'social-skills-and-peer-interaction', 'Beginning to play with other children, learning to share and take turns, and forming early friendships.', 'Develops cooperation, empathy, and relationship skills essential for school readiness and lifelong social success.', 24, 36, 26, 'emerging', 'At 24 months children play alongside peers; by 30 months they sometimes play with them, showing gradual shift.', ARRAY['https://www.cdc.gov/act-early/milestones/30-months.html', 'https://www.zerotothree.org/resource/24-36-months-social-emotional-development/'], 'CDC 30m: plays next to other children and sometimes plays with them.|Zero to Three notes children really begin to play interactively with peers as two-year-olds.'),
    ('Emotional regulation and self-awareness', 'Emotional regulation and self-awareness', 'emotional-regulation-and-self-awareness', 'Experiencing and expressing a wide range of emotions, developing empathy, and beginning to understand own feelings.', 'Supports mental well-being, helps children manage frustration, and builds foundation for healthy relationships.', 24, 36, 26, 'emerging', 'Two-year-olds show broad emotional range but limited impulse control; empathy is emerging but self-regulation still developing.', ARRAY['https://www.healthychildren.org/English/ages-stages/toddler/Pages/emotional-development-2-year-olds.aspx', 'https://www.zerotothree.org/resource/24-36-months-social-emotional-development/'], 'AAP describes wide range of emotions with limited impulse control at age two.|Zero to Three notes two-year-olds are capable of empathy and understanding others'' feelings.'),
    ('Independence and practical life skills', 'Independence and practical life skills', 'independence-and-practical-life-skills', 'Wanting to help with everyday tasks, feeding self with utensils, and participating in self-care routines.', 'Builds confidence, cooperation, and sense of competence; reduces daily routine struggles and supports autonomy.', 24, 36, 26, 'emerging', 'Strong increase in desire to participate in practical tasks around age two, aligned with ''Helper'' developmental stage.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'CDC lists eating with spoon as 24-month milestone.|Lovevery frames 25-27 months as ''Helper'' stage focused on Montessori practical life skills.'),
    ('Problem-solving and cognitive skills', 'Problem-solving and cognitive skills', 'problem-solving-and-cognitive-skills', 'Figuring out how things work, following simple instructions, and using tools or strategies to reach goals.', 'Develops thinking skills, persistence, and confidence in tackling challenges; supports school readiness.', 24, 36, 26, 'consolidating', 'At 24 months children use switches and buttons; by 30 months they follow two-step instructions and solve simple problems.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.cdc.gov/act-early/milestones/30-months.html'], 'CDC 24m: tries to use switches, knobs, or buttons on toy.|CDC 30m: shows simple problem-solving like standing on stool to reach something.'),
    ('Spatial reasoning and construction play', 'Spatial reasoning and construction play', 'spatial-reasoning-and-construction-play', 'Building with blocks, completing simple puzzles, and understanding spatial relationships.', 'Develops visual-spatial skills, problem-solving, and foundation for math and engineering concepts.', 24, 36, 26, 'emerging', 'Children begin building simple structures and solving spatial puzzles, with increasing complexity through this period.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'CDC mentions playing with more than one toy at same time.|Lovevery includes puzzles requiring mental and physical rotation for 25-27 months.'),
    ('Color and shape recognition', 'Color and shape recognition', 'color-and-shape-recognition', 'Beginning to identify and name colors and shapes in their environment.', 'Supports categorization skills, language development, and prepares for early academic learning.', 24, 36, 27, 'emerging', 'Color recognition typically emerges around 30 months, making 27 months an early emerging stage for this skill.', ARRAY['https://www.cdc.gov/act-early/milestones/30-months.html', 'https://cambspborochildrenshealth.nhs.uk/child-development-and-growing-up/milestones/2-years/'], 'CDC 30m milestone: shows he knows at least one color.|NHS mentions simple puzzles with shapes, colors, or animals for 2-year-olds.'),
    ('Routine understanding and cooperation', 'Routine understanding and cooperation', 'routine-understanding-and-cooperation', 'Following simple daily routines, understanding sequences, and participating in structured activities.', 'Reduces anxiety, supports transitions, and helps children feel secure and capable in daily life.', 24, 36, 26, 'emerging', 'Children begin to follow simple routines when told and can participate in planning routines around this age.', ARRAY['https://www.cdc.gov/act-early/milestones/30-months.html', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'CDC 30m: follows simple routines when told, like helping pick up toys.|Lovevery includes routine cards for planning bedtime and daily routines together.'),
    ('Creative expression and mark-making', 'Creative expression and mark-making', 'creative-expression-and-mark-making', 'Scribbling, painting, and exploring art materials to express ideas and feelings.', 'Develops fine motor skills, self-expression, and foundation for writing; supports emotional processing.', 24, 36, 26, 'emerging', 'Children begin purposeful mark-making and exploring art materials with increasing interest and control during this period.', ARRAY['https://cambspborochildrenshealth.nhs.uk/child-development-and-growing-up/milestones/2-years/', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'NHS lists crayons as appropriate activity for 2-year-olds.|Lovevery includes no-mess painting kit for creative expression at 25-27 months.')
    ON CONFLICT (need_name) DO UPDATE SET
      name = EXCLUDED.need_name,
      slug = EXCLUDED.slug,
      plain_english_description = EXCLUDED.plain_english_description,
      why_it_matters = EXCLUDED.why_it_matters,
      min_month = EXCLUDED.min_month,
      max_month = EXCLUDED.max_month,
      stage_anchor_month = EXCLUDED.stage_anchor_month,
      stage_phase = EXCLUDED.stage_phase,
      stage_reason = EXCLUDED.stage_reason,
      evidence_urls = EXCLUDED.evidence_urls,
      evidence_notes = EXCLUDED.evidence_notes,
      updated_at = now();
  ELSE
    -- Insert without name column (standard Manus schema)
    INSERT INTO public.pl_development_needs (
      need_name, slug, plain_english_description, why_it_matters,
      min_month, max_month, stage_anchor_month, stage_phase, stage_reason,
      evidence_urls, evidence_notes
    ) VALUES
    ('Gross motor skills and physical confidence', 'gross-motor-skills-and-physical-confidence', 'Running, jumping, kicking balls, climbing stairs, and moving with increasing coordination and control.', 'Builds physical confidence, supports exploration, and provides foundation for active play and outdoor activities.', 24, 36, 26, 'consolidating', 'Children at 24 months can run and kick balls; by 30 months most can jump with both feet, showing steady progression.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://cambspborochildrenshealth.nhs.uk/child-development-and-growing-up/milestones/2-years/'], 'CDC lists running and kicking at 24 months.|NHS describes jumping with both feet and steering toys around objects at 2 years.'),
    ('Fine motor control and hand coordination', 'fine-motor-control-and-hand-coordination', 'Using both hands together for tasks, manipulating small objects, turning pages, and operating buttons and switches.', 'Enables self-care tasks, supports learning through hands-on exploration, and prepares for writing and tool use.', 24, 36, 26, 'consolidating', 'At 24 months children hold containers while removing lids; by 30 months they twist doorknobs and turn pages individually.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.cdc.gov/act-early/milestones/30-months.html'], 'CDC 24m milestone: holds something in one hand while using other.|CDC 30m milestone: uses hands to twist things like doorknobs.'),
    ('Language development and communication', 'language-development-and-communication', 'Speaking in two-word phrases, rapidly expanding vocabulary, naming objects, and using personal pronouns.', 'Enables children to express needs and feelings, reduces frustration, and supports social interaction and learning.', 24, 36, 26, 'emerging', 'At 24 months children say two words together; by 30 months vocabulary expands to about 50 words with action words.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.zerotothree.org/resource/24-30-months-your-childs-development/'], 'CDC notes 2-word phrases and pointing to body parts at 24 months.|Zero to Three describes using growing language skills to express thoughts and feelings.'),
    ('Pretend play and imagination', 'pretend-play-and-imagination', 'Using objects symbolically, engaging in role-play, and creating simple pretend scenarios.', 'Builds language, thinking, and social skills; helps children process experiences and develop creativity.', 24, 36, 26, 'emerging', 'Pretend play shows real explosion during this period as children begin symbolic thinking and role-taking.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.zerotothree.org/resource/24-36-months-social-emotional-development/'], 'CDC 24m: plays with more than one toy at same time.|Zero to Three describes ''real explosion in pretend play'' as critical developmental aspect.'),
    ('Social skills and peer interaction', 'social-skills-and-peer-interaction', 'Beginning to play with other children, learning to share and take turns, and forming early friendships.', 'Develops cooperation, empathy, and relationship skills essential for school readiness and lifelong social success.', 24, 36, 26, 'emerging', 'At 24 months children play alongside peers; by 30 months they sometimes play with them, showing gradual shift.', ARRAY['https://www.cdc.gov/act-early/milestones/30-months.html', 'https://www.zerotothree.org/resource/24-36-months-social-emotional-development/'], 'CDC 30m: plays next to other children and sometimes plays with them.|Zero to Three notes children really begin to play interactively with peers as two-year-olds.'),
    ('Emotional regulation and self-awareness', 'emotional-regulation-and-self-awareness', 'Experiencing and expressing a wide range of emotions, developing empathy, and beginning to understand own feelings.', 'Supports mental well-being, helps children manage frustration, and builds foundation for healthy relationships.', 24, 36, 26, 'emerging', 'Two-year-olds show broad emotional range but limited impulse control; empathy is emerging but self-regulation still developing.', ARRAY['https://www.healthychildren.org/English/ages-stages/toddler/Pages/emotional-development-2-year-olds.aspx', 'https://www.zerotothree.org/resource/24-36-months-social-emotional-development/'], 'AAP describes wide range of emotions with limited impulse control at age two.|Zero to Three notes two-year-olds are capable of empathy and understanding others'' feelings.'),
    ('Independence and practical life skills', 'independence-and-practical-life-skills', 'Wanting to help with everyday tasks, feeding self with utensils, and participating in self-care routines.', 'Builds confidence, cooperation, and sense of competence; reduces daily routine struggles and supports autonomy.', 24, 36, 26, 'emerging', 'Strong increase in desire to participate in practical tasks around age two, aligned with ''Helper'' developmental stage.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'CDC lists eating with spoon as 24-month milestone.|Lovevery frames 25-27 months as ''Helper'' stage focused on Montessori practical life skills.'),
    ('Problem-solving and cognitive skills', 'problem-solving-and-cognitive-skills', 'Figuring out how things work, following simple instructions, and using tools or strategies to reach goals.', 'Develops thinking skills, persistence, and confidence in tackling challenges; supports school readiness.', 24, 36, 26, 'consolidating', 'At 24 months children use switches and buttons; by 30 months they follow two-step instructions and solve simple problems.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://www.cdc.gov/act-early/milestones/30-months.html'], 'CDC 24m: tries to use switches, knobs, or buttons on toy.|CDC 30m: shows simple problem-solving like standing on stool to reach something.'),
    ('Spatial reasoning and construction play', 'spatial-reasoning-and-construction-play', 'Building with blocks, completing simple puzzles, and understanding spatial relationships.', 'Develops visual-spatial skills, problem-solving, and foundation for math and engineering concepts.', 24, 36, 26, 'emerging', 'Children begin building simple structures and solving spatial puzzles, with increasing complexity through this period.', ARRAY['https://www.cdc.gov/act-early/milestones/2-years.html', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'CDC mentions playing with more than one toy at same time.|Lovevery includes puzzles requiring mental and physical rotation for 25-27 months.'),
    ('Color and shape recognition', 'color-and-shape-recognition', 'Beginning to identify and name colors and shapes in their environment.', 'Supports categorization skills, language development, and prepares for early academic learning.', 24, 36, 27, 'emerging', 'Color recognition typically emerges around 30 months, making 27 months an early emerging stage for this skill.', ARRAY['https://www.cdc.gov/act-early/milestones/30-months.html', 'https://cambspborochildrenshealth.nhs.uk/child-development-and-growing-up/milestones/2-years/'], 'CDC 30m milestone: shows he knows at least one color.|NHS mentions simple puzzles with shapes, colors, or animals for 2-year-olds.'),
    ('Routine understanding and cooperation', 'routine-understanding-and-cooperation', 'Following simple daily routines, understanding sequences, and participating in structured activities.', 'Reduces anxiety, supports transitions, and helps children feel secure and capable in daily life.', 24, 36, 26, 'emerging', 'Children begin to follow simple routines when told and can participate in planning routines around this age.', ARRAY['https://www.cdc.gov/act-early/milestones/30-months.html', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'CDC 30m: follows simple routines when told, like helping pick up toys.|Lovevery includes routine cards for planning bedtime and daily routines together.'),
    ('Creative expression and mark-making', 'creative-expression-and-mark-making', 'Scribbling, painting, and exploring art materials to express ideas and feelings.', 'Develops fine motor skills, self-expression, and foundation for writing; supports emotional processing.', 24, 36, 26, 'emerging', 'Children begin purposeful mark-making and exploring art materials with increasing interest and control during this period.', ARRAY['https://cambspborochildrenshealth.nhs.uk/child-development-and-growing-up/milestones/2-years/', 'https://lovevery.co.uk/products/the-play-kits-the-helper'], 'NHS lists crayons as appropriate activity for 2-year-olds.|Lovevery includes no-mess painting kit for creative expression at 25-27 months.')
    ON CONFLICT (need_name) DO UPDATE SET
      slug = EXCLUDED.slug,
      plain_english_description = EXCLUDED.plain_english_description,
      why_it_matters = EXCLUDED.why_it_matters,
      min_month = EXCLUDED.min_month,
      max_month = EXCLUDED.max_month,
      stage_anchor_month = EXCLUDED.stage_anchor_month,
      stage_phase = EXCLUDED.stage_phase,
      stage_reason = EXCLUDED.stage_reason,
      evidence_urls = EXCLUDED.evidence_urls,
      evidence_notes = EXCLUDED.evidence_notes,
      updated_at = now();
  END IF;
END $$;

-- ============================================================================
-- PART 8: UPDATE SLUGS FOR EXISTING ROWS (if any exist without slugs)
-- ============================================================================

UPDATE public.pl_development_needs
SET slug = public.slugify_need_name(need_name)
WHERE slug IS NULL OR slug = '';

-- ============================================================================
-- PART 9: ADD UPDATED_AT TRIGGER
-- ============================================================================

DROP TRIGGER IF EXISTS trg_pl_development_needs_updated_at ON public.pl_development_needs;
CREATE TRIGGER trg_pl_development_needs_updated_at BEFORE UPDATE ON public.pl_development_needs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 10: ENABLE RLS
-- ============================================================================

ALTER TABLE public.pl_development_needs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admin CRUD, authenticated read)
DROP POLICY IF EXISTS "pl_development_needs_admin_all" ON public.pl_development_needs;
CREATE POLICY "pl_development_needs_admin_all" ON public.pl_development_needs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "pl_development_needs_authenticated_read" ON public.pl_development_needs;
CREATE POLICY "pl_development_needs_authenticated_read" ON public.pl_development_needs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- PUBLIC READ: Allow anonymous users to read (required for MVP landing page)
DROP POLICY IF EXISTS "pl_development_needs_public_read" ON public.pl_development_needs;
CREATE POLICY "pl_development_needs_public_read" ON public.pl_development_needs
  FOR SELECT
  USING (true);

-- ============================================================================
-- PART 11: PROOF BUNDLE (run this entire block to verify migration)
-- ============================================================================

DO $$
DECLARE
  row_count_val INTEGER;
  duplicate_need_name_count INTEGER;
  duplicate_slug_count INTEGER;
  null_need_name_count INTEGER;
  null_desc_count INTEGER;
  null_why_count INTEGER;
  null_min_count INTEGER;
  null_max_count INTEGER;
  rec RECORD;
BEGIN
  -- Row count
  SELECT COUNT(*) INTO row_count_val FROM public.pl_development_needs;
  RAISE NOTICE '=== ROW COUNT ===';
  RAISE NOTICE 'Total rows: % (expected: 12)', row_count_val;
  
  -- Sample rows
  RAISE NOTICE '';
  RAISE NOTICE '=== SAMPLE ROWS (first 5 alphabetically) ===';
  FOR rec IN (
    SELECT need_name, slug, min_month, max_month, stage_anchor_month
    FROM public.pl_development_needs
    ORDER BY need_name
    LIMIT 5
  ) LOOP
    RAISE NOTICE 'need_name: %, slug: %, min_month: %, max_month: %, stage_anchor_month: %',
      rec.need_name, rec.slug, rec.min_month, rec.max_month, rec.stage_anchor_month;
  END LOOP;
  
  -- Duplicate checks
  SELECT COUNT(*) INTO duplicate_need_name_count
  FROM (
    SELECT need_name, COUNT(*) as c
    FROM public.pl_development_needs
    GROUP BY need_name
    HAVING COUNT(*) > 1
  ) dup;
  
  SELECT COUNT(*) INTO duplicate_slug_count
  FROM (
    SELECT slug, COUNT(*) as c
    FROM public.pl_development_needs
    WHERE slug IS NOT NULL
    GROUP BY slug
    HAVING COUNT(*) > 1
  ) dup;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== DUPLICATE CHECKS ===';
  RAISE NOTICE 'Duplicate need_name rows: % (expected: 0)', duplicate_need_name_count;
  RAISE NOTICE 'Duplicate slug rows: % (expected: 0)', duplicate_slug_count;
  
  -- Null checks
  SELECT 
    SUM((need_name IS NULL)::int),
    SUM((plain_english_description IS NULL)::int),
    SUM((why_it_matters IS NULL)::int),
    SUM((min_month IS NULL)::int),
    SUM((max_month IS NULL)::int)
  INTO 
    null_need_name_count,
    null_desc_count,
    null_why_count,
    null_min_count,
    null_max_count
  FROM public.pl_development_needs;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== NULL CHECKS (required fields) ===';
  RAISE NOTICE 'null_need_name: % (expected: 0)', null_need_name_count;
  RAISE NOTICE 'null_plain_english_description: % (expected: 0)', null_desc_count;
  RAISE NOTICE 'null_why_it_matters: % (expected: 0)', null_why_count;
  RAISE NOTICE 'null_min_month: % (expected: 0)', null_min_count;
  RAISE NOTICE 'null_max_month: % (expected: 0)', null_max_count;
  
  -- RLS Policies
  RAISE NOTICE '';
  RAISE NOTICE '=== RLS POLICIES ===';
  FOR rec IN (
    SELECT 
      polname as policy_name,
      permissive,
      roles,
      cmd as command
    FROM pg_policies
    WHERE schemaname = 'public' 
      AND tablename = 'pl_development_needs'
    ORDER BY polname
  ) LOOP
    RAISE NOTICE 'Policy: %, Permissive: %, Roles: %, Command: %',
      rec.policy_name, rec.permissive, rec.roles, rec.command;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== VERIFICATION COMPLETE ===';
  RAISE NOTICE 'If all checks pass (row count = 12, no duplicates, no nulls, 3 policies), migration succeeded!';
END $$;


-- === 202602080000_pl_category_type_images.sql ===

-- Migration: pl_category_type_images + v_gateway_category_type_images
-- Date: 2026-02-08
-- Purpose: Category imagery mapping so founder can swap URLs without code. Public reads via gateway view only.

-- ============================================================================
-- PART 1: CREATE pl_category_type_images TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pl_category_type_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pl_category_type_images_category_type_id_idx
  ON public.pl_category_type_images(category_type_id);

CREATE INDEX IF NOT EXISTS pl_category_type_images_active_sort_idx
  ON public.pl_category_type_images(category_type_id, is_active, sort)
  WHERE is_active = true;

-- RLS: canonical table protected; no direct public read
ALTER TABLE public.pl_category_type_images ENABLE ROW LEVEL SECURITY;

-- Admin/service role only (writes via API); anon/authenticated read via gateway view
DROP POLICY IF EXISTS "pl_category_type_images_admin_all" ON public.pl_category_type_images;
CREATE POLICY "pl_category_type_images_admin_all" ON public.pl_category_type_images
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- PART 2: CREATE v_gateway_category_type_images VIEW
-- ============================================================================

DROP VIEW IF EXISTS public.v_gateway_category_type_images;

-- security_invoker = false so view runs with owner privileges (bypasses RLS on canonical table)
CREATE VIEW public.v_gateway_category_type_images
  WITH (security_invoker = false)
AS
SELECT
  category_type_id,
  image_url,
  alt
FROM public.pl_category_type_images
WHERE is_active = true
ORDER BY category_type_id, sort, created_at;

-- Grant SELECT to anon and authenticated (public read path)
GRANT SELECT ON public.v_gateway_category_type_images TO anon, authenticated;

-- === 202602190000_subnav_saves_and_consent.sql ===

-- Migration: subnav saves + consent schema and get_my_subnav_stats
-- Date: 2026-02-19
-- Purpose: Tables for saved products, saved ideas, notification prefs; RLS; single RPC for "my subnav stats".
-- Scope: Data foundation only; no UI subnav in this PR.
-- Idempotent: Safe to re-run (IF NOT EXISTS, DROP IF EXISTS for policies/function).

-- ============================================================================
-- PART 1: user_saved_products
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_saved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS user_saved_products_user_id_idx
  ON public.user_saved_products(user_id);

ALTER TABLE public.user_saved_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_saved_products_select_own" ON public.user_saved_products;
CREATE POLICY "user_saved_products_select_own" ON public.user_saved_products
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_products_insert_own" ON public.user_saved_products;
CREATE POLICY "user_saved_products_insert_own" ON public.user_saved_products
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_products_delete_own" ON public.user_saved_products;
CREATE POLICY "user_saved_products_delete_own" ON public.user_saved_products
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- PART 2: user_saved_ideas
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_saved_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  idea_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, idea_id)
);

CREATE INDEX IF NOT EXISTS user_saved_ideas_user_id_idx
  ON public.user_saved_ideas(user_id);

ALTER TABLE public.user_saved_ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_saved_ideas_select_own" ON public.user_saved_ideas;
CREATE POLICY "user_saved_ideas_select_own" ON public.user_saved_ideas
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_ideas_insert_own" ON public.user_saved_ideas;
CREATE POLICY "user_saved_ideas_insert_own" ON public.user_saved_ideas
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_saved_ideas_delete_own" ON public.user_saved_ideas;
CREATE POLICY "user_saved_ideas_delete_own" ON public.user_saved_ideas
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- PART 3: user_notification_prefs
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_notification_prefs (
  user_id UUID PRIMARY KEY,
  development_reminders_enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_notification_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_notification_prefs_select_own" ON public.user_notification_prefs;
CREATE POLICY "user_notification_prefs_select_own" ON public.user_notification_prefs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_notification_prefs_insert_own" ON public.user_notification_prefs;
CREATE POLICY "user_notification_prefs_insert_own" ON public.user_notification_prefs
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_notification_prefs_update_own" ON public.user_notification_prefs;
CREATE POLICY "user_notification_prefs_update_own" ON public.user_notification_prefs
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- PART 4: get_my_subnav_stats() RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  SELECT count(*)::INT INTO toys_count
  FROM public.user_saved_products
  WHERE user_id = uid;

  SELECT count(*)::INT INTO ideas_count
  FROM public.user_saved_ideas
  WHERE user_id = uid;

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- ============================================================================
-- PART 5: Trigger for updated_at on user_notification_prefs (optional)
-- ============================================================================

-- Reuse set_updated_at() if it exists (from phase_a_db_foundation)
DROP TRIGGER IF EXISTS user_notification_prefs_updated_at ON public.user_notification_prefs;
CREATE TRIGGER user_notification_prefs_updated_at
  BEFORE UPDATE ON public.user_notification_prefs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- === 202602250000_family_user_list_items.sql ===

-- Migration: user_list_items for /family "My list" (Want / Have / Gift)
-- Date: 2026-02-25
-- Purpose: Single canonical table for user list items; RLS auth-only; Gift implies Want.
-- Idempotent: Safe re-run (IF NOT EXISTS, DROP IF EXISTS for policies/triggers).

-- ============================================================================
-- PART 1: user_list_items table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NULL REFERENCES public.children(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('idea', 'category', 'product')),
  ux_wrapper_id UUID NULL REFERENCES public.pl_ux_wrappers(id) ON DELETE CASCADE,
  category_type_id UUID NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  product_id UUID NULL REFERENCES public.products(id) ON DELETE CASCADE,
  want BOOLEAN NOT NULL DEFAULT false,
  have BOOLEAN NOT NULL DEFAULT false,
  gift BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Exactly one of (ux_wrapper_id, category_type_id, product_id) non-null, matching kind
  CONSTRAINT user_list_items_kind_ref_check CHECK (
    (kind = 'idea'    AND ux_wrapper_id IS NOT NULL AND category_type_id IS NULL AND product_id IS NULL) OR
    (kind = 'category' AND category_type_id IS NOT NULL AND ux_wrapper_id IS NULL AND product_id IS NULL) OR
    (kind = 'product'  AND product_id IS NOT NULL AND ux_wrapper_id IS NULL AND category_type_id IS NULL)
  ),
  -- Gift implies Want
  CONSTRAINT user_list_items_gift_implies_want CHECK (gift = false OR want = true)
);

-- Partial unique indexes (one row per user+child+ref per kind)
CREATE UNIQUE INDEX IF NOT EXISTS user_list_items_uniq_ux_wrapper
  ON public.user_list_items (user_id, child_id, ux_wrapper_id)
  WHERE ux_wrapper_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_list_items_uniq_category
  ON public.user_list_items (user_id, child_id, category_type_id)
  WHERE category_type_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_list_items_uniq_product
  ON public.user_list_items (user_id, child_id, product_id)
  WHERE product_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_list_items_user_id_idx ON public.user_list_items (user_id);
CREATE INDEX IF NOT EXISTS user_list_items_user_id_kind_idx ON public.user_list_items (user_id, kind);
CREATE INDEX IF NOT EXISTS user_list_items_user_id_gift_true_idx ON public.user_list_items (user_id) WHERE gift = true;

ALTER TABLE public.user_list_items ENABLE ROW LEVEL SECURITY;

-- RLS: auth only; child_id must be owned by user if set
DROP POLICY IF EXISTS "user_list_items_select_own" ON public.user_list_items;
CREATE POLICY "user_list_items_select_own" ON public.user_list_items
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_list_items_insert_own" ON public.user_list_items;
CREATE POLICY "user_list_items_insert_own" ON public.user_list_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND (child_id IS NULL OR EXISTS (SELECT 1 FROM public.children c WHERE c.id = child_id AND c.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "user_list_items_update_own" ON public.user_list_items;
CREATE POLICY "user_list_items_update_own" ON public.user_list_items
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND (child_id IS NULL OR EXISTS (SELECT 1 FROM public.children c WHERE c.id = child_id AND c.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "user_list_items_delete_own" ON public.user_list_items;
CREATE POLICY "user_list_items_delete_own" ON public.user_list_items
  FOR DELETE USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS user_list_items_updated_at ON public.user_list_items;
CREATE TRIGGER user_list_items_updated_at
  BEFORE UPDATE ON public.user_list_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 2: Backfill from existing user_saved_products and user_saved_ideas
-- ============================================================================

INSERT INTO public.user_list_items (user_id, child_id, kind, product_id, want, have, gift)
SELECT p.user_id, NULL, 'product', p.product_id, true, false, false
FROM public.user_saved_products p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_list_items uli
  WHERE uli.user_id = p.user_id AND uli.child_id IS NULL AND uli.product_id = p.product_id
);

DO $$
BEGIN
  INSERT INTO public.user_list_items (user_id, child_id, kind, category_type_id, want, have, gift)
  SELECT u.user_id, NULL, 'category', u.idea_id, true, false, false
  FROM public.user_saved_ideas u
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_list_items uli
    WHERE uli.user_id = u.user_id AND uli.child_id IS NULL AND uli.category_type_id = u.idea_id
  );
EXCEPTION
  WHEN unique_violation THEN NULL;
END $$;

-- ============================================================================
-- PART 3: Update get_my_subnav_stats to count from user_list_items
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  SELECT count(*)::INT INTO toys_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind = 'product' AND (want = true OR have = true);

  SELECT count(*)::INT INTO ideas_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind IN ('idea', 'category') AND (want = true OR have = true);

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- ============================================================================
-- PART 4: upsert_user_list_item (client upsert; Gift on => want=true)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.upsert_user_list_item(
  p_kind TEXT,
  p_product_id UUID DEFAULT NULL,
  p_category_type_id UUID DEFAULT NULL,
  p_ux_wrapper_id UUID DEFAULT NULL,
  p_want BOOLEAN DEFAULT true,
  p_have BOOLEAN DEFAULT false,
  p_gift BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  rid UUID;
  v_want BOOLEAN := p_want;
  v_gift BOOLEAN := p_gift;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_gift = true THEN
    v_want := true;
  END IF;

  IF p_kind = 'product' AND p_product_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND child_id IS NULL AND product_id = p_product_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, product_id, want, have, gift)
      VALUES (uid, NULL, 'product', p_product_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'category' AND p_category_type_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND child_id IS NULL AND category_type_id = p_category_type_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, category_type_id, want, have, gift)
      VALUES (uid, NULL, 'category', p_category_type_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'idea' AND p_ux_wrapper_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND child_id IS NULL AND ux_wrapper_id = p_ux_wrapper_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, ux_wrapper_id, want, have, gift)
      VALUES (uid, NULL, 'idea', p_ux_wrapper_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid kind or missing ref';
  END IF;
  RETURN rid;
END;
$$;
</think>
Fixing the migration: removing the duplicate category INSERT and making the backfill idempotent.
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace

-- === 202602261000_subnav_gifts_count.sql ===

-- Add gifts_saved_count to get_my_subnav_stats (user_list_items where gift = true).
-- Safe to run after 202602250000_family_user_list_items.

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  gifts_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'gifts_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  SELECT count(*)::INT INTO toys_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind = 'product' AND (want = true OR have = true);

  SELECT count(*)::INT INTO ideas_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind IN ('idea', 'category') AND (want = true OR have = true);

  SELECT count(*)::INT INTO gifts_count
  FROM public.user_list_items
  WHERE user_id = uid AND gift = true;

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'gifts_saved_count', COALESCE(gifts_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- === 202602280000_children_display_name.sql ===

-- Add optional display_name to children (Figma: "What do you call them?").
-- Optional nickname for UI only; not a legal name.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS display_name text;

COMMENT ON COLUMN public.children.display_name IS 'Optional: what the parent calls the child (e.g. nickname). For UI only.';

-- === 202602281000_children_child_name.sql ===

-- Add child_name to children (optional "What do you call them?" for UI).
-- Distinct from legacy/display_name: single source of truth for the call name shown in app.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS child_name text;

COMMENT ON COLUMN public.children.child_name IS 'Optional: what the parent calls the child (e.g. nickname). For UI only.';

-- Backfill from display_name where present
UPDATE public.children
SET child_name = display_name
WHERE display_name IS NOT NULL AND (child_name IS NULL OR child_name = '');

-- === 202603031000_subnav_stats_per_child.sql ===

-- Optional per-child filter for get_my_subnav_stats.
-- When p_child_id is set, counts ONLY items saved to that child (child_id = p_child_id). No inheritance of unassigned.
-- When p_child_id is null, aggregates all items. Safe to run after 202602261000_subnav_gifts_count.

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats(p_child_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  gifts_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'gifts_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  IF p_child_id IS NOT NULL THEN
    -- Per child only: items explicitly saved to this child. No unassigned (child_id IS NULL) items.
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id
      AND uli.kind = 'product' AND (uli.want = true OR uli.have = true);

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id
      AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true);

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id AND uli.gift = true;
  ELSE
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items
    WHERE user_id = uid AND kind = 'product' AND (want = true OR have = true);

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items
    WHERE user_id = uid AND kind IN ('idea', 'category') AND (want = true OR have = true);

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items
    WHERE user_id = uid AND gift = true;
  END IF;

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'gifts_saved_count', COALESCE(gifts_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- === 202603031100_upsert_user_list_item_child.sql ===

-- Add optional p_child_id to upsert_user_list_item so saves from /discover can store against the selected child.
-- When p_child_id is set, match/insert with that child_id; when null, keep existing behavior (child_id IS NULL).
-- Safe to run after 202602250000_family_user_list_items.

CREATE OR REPLACE FUNCTION public.upsert_user_list_item(
  p_kind TEXT,
  p_product_id UUID DEFAULT NULL,
  p_category_type_id UUID DEFAULT NULL,
  p_ux_wrapper_id UUID DEFAULT NULL,
  p_want BOOLEAN DEFAULT true,
  p_have BOOLEAN DEFAULT false,
  p_gift BOOLEAN DEFAULT false,
  p_child_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  rid UUID;
  v_want BOOLEAN := p_want;
  v_gift BOOLEAN := p_gift;
  v_child_id UUID := p_child_id;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_gift = true THEN
    v_want := true;
  END IF;
  -- Ensure child belongs to user when p_child_id is set
  IF v_child_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.children c WHERE c.id = v_child_id AND c.user_id = uid) THEN
    v_child_id := NULL;
  END IF;

  IF p_kind = 'product' AND p_product_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND (child_id IS NOT DISTINCT FROM v_child_id) AND product_id = p_product_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, product_id, want, have, gift)
      VALUES (uid, v_child_id, 'product', p_product_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'category' AND p_category_type_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND (child_id IS NOT DISTINCT FROM v_child_id) AND category_type_id = p_category_type_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, category_type_id, want, have, gift)
      VALUES (uid, v_child_id, 'category', p_category_type_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'idea' AND p_ux_wrapper_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND (child_id IS NOT DISTINCT FROM v_child_id) AND ux_wrapper_id = p_ux_wrapper_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, ux_wrapper_id, want, have, gift)
      VALUES (uid, v_child_id, 'idea', p_ux_wrapper_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid kind or missing ref';
  END IF;
  RETURN rid;
END;
$$;

-- === 202603031200_upsert_drop_old_overload.sql ===

-- Remove the old 7-parameter overload of upsert_user_list_item so the 8-param version
-- (with p_child_id) is the only one. Fixes "Could not choose the best candidate function" when
-- calling from my-ideas Want/Have toggle. Run after 202603031100_upsert_user_list_item_child.

DROP FUNCTION IF EXISTS public.upsert_user_list_item(text, uuid, uuid, uuid, boolean, boolean, boolean);

-- === 202603031300_subnav_stats_child_only.sql ===

-- Per-child stats: count only items explicitly saved to that child (child_id = p_child_id).
-- When a child has no saves, stats show 0. "All children" (p_child_id null) still aggregates all.
-- Safe to run after 202603031000_subnav_stats_per_child.

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats(p_child_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  gifts_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'gifts_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  IF p_child_id IS NOT NULL THEN
    -- Per child: only items saved to this child (child_id = p_child_id). No unassigned.
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id
      AND uli.kind = 'product' AND (uli.want = true OR uli.have = true);

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id
      AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true);

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id AND uli.gift = true;
  ELSE
    -- All children: aggregate everything
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items
    WHERE user_id = uid AND kind = 'product' AND (want = true OR have = true);

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items
    WHERE user_id = uid AND kind IN ('idea', 'category') AND (want = true OR have = true);

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items
    WHERE user_id = uid AND gift = true;
  END IF;

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'gifts_saved_count', COALESCE(gifts_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- === 202603041000_children_is_suppressed.sql ===

-- Add is_suppressed to children for soft-remove (hide from family/subnav/discover; no hard delete).
-- When true, child is excluded from lists; user can "restore" by updating is_suppressed to false later if needed.

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS is_suppressed boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.children.is_suppressed IS 'When true, child is hidden from family grid, subnav and discover; soft-remove only.';

CREATE INDEX IF NOT EXISTS children_user_suppressed_idx ON public.children(user_id) WHERE is_suppressed = false;

-- === 202603041100_gift_shares.sql ===

-- Gift share slugs for public /gift/[slug] URLs.
-- One row per user; slug is stable and URL-safe (8–12 chars). Anon cannot read this table.
-- Public gift list data is exposed only via get_public_gift_list(slug) SECURITY DEFINER.

-- Table: one slug per user
CREATE TABLE IF NOT EXISTS public.gift_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(slug)
);

CREATE INDEX IF NOT EXISTS gift_shares_slug_idx ON public.gift_shares(slug);
CREATE INDEX IF NOT EXISTS gift_shares_user_id_idx ON public.gift_shares(user_id);

COMMENT ON TABLE public.gift_shares IS 'Stable share slug per user for public /gift/[slug] read-only gift list.';
COMMENT ON COLUMN public.gift_shares.slug IS 'URL-safe 8–12 char string; used in /gift/[slug].';

ALTER TABLE public.gift_shares ENABLE ROW LEVEL SECURITY;

-- Owner can read/insert/update/delete own row only. Anon has no access.
DROP POLICY IF EXISTS "gift_shares_select_own" ON public.gift_shares;
CREATE POLICY "gift_shares_select_own" ON public.gift_shares
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "gift_shares_insert_own" ON public.gift_shares;
CREATE POLICY "gift_shares_insert_own" ON public.gift_shares
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "gift_shares_update_own" ON public.gift_shares;
CREATE POLICY "gift_shares_update_own" ON public.gift_shares
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "gift_shares_delete_own" ON public.gift_shares;
CREATE POLICY "gift_shares_delete_own" ON public.gift_shares
  FOR DELETE USING (user_id = auth.uid());

-- Resolve slug to user_id (for server-only use). Returns NULL if slug not found.
-- Used by get_public_gift_list; not exposed to client.
CREATE OR REPLACE FUNCTION public.resolve_gift_slug_user_id(p_slug TEXT)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT user_id FROM public.gift_shares WHERE slug = p_slug LIMIT 1;
$$;

-- Public (anon) callable: returns gift list rows for a slug. No user_id or private data.
-- Runs with definer rights so it can read user_list_items for the resolved user.
CREATE OR REPLACE FUNCTION public.get_public_gift_list(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  display_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := public.resolve_gift_slug_user_id(p_slug);
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    uli.id,
    uli.kind,
    COALESCE(
      (SELECT p.name FROM public.products p WHERE p.id = uli.product_id),
      (SELECT ct.name FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
      (SELECT uw.ux_label FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id),
      '—'
    )::TEXT AS display_name,
    COALESCE(
      (SELECT p.image_url FROM public.products p WHERE p.id = uli.product_id),
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id AND uli.gift = true
  ORDER BY uli.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_public_gift_list(TEXT) IS 'Returns read-only gift list for /gift/[slug]. Callable by anon; exposes only gift-flagged items.';

-- Allow anon to call get_public_gift_list only (no table read). resolve_gift_slug_user_id stays internal.
GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO authenticated;

-- === 202603041200_gift_list_child_id.sql ===

-- Add child_id to get_public_gift_list so /gift/[slug] can filter by child (All vs specific child).
-- child_id is nullable (unassigned items). No child names exposed; client labels as "Child 1", "Child 2".
-- Must DROP first because return type (OUT parameters) is changing.

DROP FUNCTION IF EXISTS public.get_public_gift_list(TEXT);

CREATE OR REPLACE FUNCTION public.get_public_gift_list(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  display_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  child_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := public.resolve_gift_slug_user_id(p_slug);
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    uli.id,
    uli.kind,
    COALESCE(
      (SELECT p.name FROM public.products p WHERE p.id = uli.product_id),
      (SELECT ct.name FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
      (SELECT uw.ux_label FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id),
      '—'
    )::TEXT AS display_name,
    COALESCE(
      (SELECT p.image_url FROM public.products p WHERE p.id = uli.product_id),
      (SELECT v.image_url FROM public.v_gateway_category_type_images v WHERE v.category_type_id = uli.category_type_id LIMIT 1),
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at,
    uli.child_id
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id AND uli.gift = true
  ORDER BY uli.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_public_gift_list(TEXT) IS 'Returns read-only gift list for /gift/[slug]. Includes child_id for filtering by child. Callable by anon; exposes only gift-flagged items.';

GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO authenticated;

-- === 202603041300_get_gift_share_list_title.sql ===

-- Returns display name for the gift list owner (for "Gift list for [Name]'s family").
-- Uses full_name, name, then first_name from auth.users.raw_user_meta_data (Dashboard Display name = full_name); fallback 'Their'. Anon can call.

CREATE OR REPLACE FUNCTION public.get_gift_share_list_title(p_slug TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(trim(u.raw_user_meta_data->>'display_name'), ''),
    NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(trim(u.raw_user_meta_data->>'name'), ''),
    NULLIF(trim(
      concat(
        trim(COALESCE(u.raw_user_meta_data->>'first_name', '')),
        CASE WHEN NULLIF(trim(u.raw_user_meta_data->>'last_name'), '') IS NOT NULL THEN ' ' || trim(u.raw_user_meta_data->>'last_name') ELSE '' END
      )
    ), ''),
    NULLIF(trim(u.raw_user_meta_data->>'first_name'), ''),
    'Their'
  )
  FROM public.gift_shares g
  JOIN auth.users u ON u.id = g.user_id
  WHERE g.slug = p_slug
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_gift_share_list_title(TEXT) IS 'Display name for /gift/[slug] title. First name or Their.';

GRANT EXECUTE ON FUNCTION public.get_gift_share_list_title(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_gift_share_list_title(TEXT) TO authenticated;

-- Returns child ids and display labels for the gift list owner (dropdown: "Alex - Aged 6+"). Uses child_name/display_name + age_band; fallback "Child N". Anon can call.
DROP FUNCTION IF EXISTS public.get_public_gift_children(TEXT);
CREATE FUNCTION public.get_public_gift_children(p_slug TEXT)
RETURNS TABLE (child_id UUID, label TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    c.id AS child_id,
    CASE
      WHEN NULLIF(trim(COALESCE(c.child_name, c.display_name, '')), '') IS NOT NULL THEN
        trim(COALESCE(c.child_name, c.display_name)) || CASE WHEN NULLIF(trim(COALESCE(c.age_band, '')), '') IS NOT NULL THEN ' - Aged ' || trim(c.age_band) ELSE '' END
      ELSE 'Child ' || (row_number() OVER (ORDER BY c.created_at ASC NULLS LAST, c.id ASC))::text
    END AS label
  FROM public.gift_shares g
  JOIN public.children c ON c.user_id = g.user_id AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
  WHERE g.slug = p_slug
  ORDER BY c.created_at ASC NULLS LAST, c.id ASC;
$$;

COMMENT ON FUNCTION public.get_public_gift_children(TEXT) IS 'Child ids + labels for /gift/[slug] dropdown (e.g. Alex - Aged 6+).';

GRANT EXECUTE ON FUNCTION public.get_public_gift_children(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_gift_children(TEXT) TO authenticated;

-- === 202603041400_gift_list_image_from_gateway.sql ===

-- Gift list image_url for ideas: use v_gateway_category_type_images (same as /my-ideas).
-- Run this if get_public_gift_list was already applied without this logic.

CREATE OR REPLACE FUNCTION public.get_public_gift_list(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  display_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  child_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := public.resolve_gift_slug_user_id(p_slug);
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    uli.id,
    uli.kind,
    COALESCE(
      (SELECT p.name FROM public.products p WHERE p.id = uli.product_id),
      (SELECT ct.name FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
      (SELECT uw.ux_label FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id),
      '—'
    )::TEXT AS display_name,
    COALESCE(
      (SELECT p.image_url FROM public.products p WHERE p.id = uli.product_id),
      (SELECT v.image_url FROM public.v_gateway_category_type_images v WHERE v.category_type_id = uli.category_type_id LIMIT 1),
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at,
    uli.child_id
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id AND uli.gift = true
  ORDER BY uli.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_public_gift_list(TEXT) IS 'Returns read-only gift list for /gift/[slug]. image_url for ideas from v_gateway_category_type_images (same as my-ideas).';

-- === 202603051000_suppress_saves_for_suppressed_children.sql ===

-- When a child is removed (is_suppressed = true), hide their saves in UI but keep data in DB.
-- Only items assigned to a visible (non-suppressed) child are shown; unassigned (child_id IS NULL)
-- are never shown so legacy saves do not reappear when user adds a new child.
-- Run PART 1 first, then PART 2.

-- ============================================================================
-- PART 1: user_list_items SELECT policy
-- ============================================================================

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

COMMENT ON POLICY "user_list_items_select_own" ON public.user_list_items IS 'Own rows only; show only items assigned to a visible child; unassigned never shown so legacy saves do not reappear when adding a new child.';

-- ============================================================================
-- PART 2: get_my_subnav_stats — exclude suppressed children from counts
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats(p_child_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  gifts_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'gifts_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  IF p_child_id IS NOT NULL THEN
    -- Per child: only items for this child, and only if child is not suppressed
    IF NOT EXISTS (SELECT 1 FROM public.children c WHERE c.id = p_child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL)) THEN
      toys_count := 0;
      ideas_count := 0;
      gifts_count := 0;
    ELSE
      SELECT count(*)::INT INTO toys_count
      FROM public.user_list_items uli
      WHERE uli.user_id = uid AND uli.child_id = p_child_id
        AND uli.kind = 'product' AND (uli.want = true OR uli.have = true);

      SELECT count(*)::INT INTO ideas_count
      FROM public.user_list_items uli
      WHERE uli.user_id = uid AND uli.child_id = p_child_id
        AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true);

      SELECT count(*)::INT INTO gifts_count
      FROM public.user_list_items uli
      WHERE uli.user_id = uid AND uli.child_id = p_child_id AND uli.gift = true;
    END IF;
  ELSE
    -- All children: only items assigned to a visible child (exclude unassigned)
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.kind = 'product' AND (uli.want = true OR uli.have = true)
      AND uli.child_id IS NOT NULL
      AND EXISTS (SELECT 1 FROM public.children c WHERE c.id = uli.child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL));

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true)
      AND uli.child_id IS NOT NULL
      AND EXISTS (SELECT 1 FROM public.children c WHERE c.id = uli.child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL));

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.gift = true
      AND uli.child_id IS NOT NULL
      AND EXISTS (SELECT 1 FROM public.children c WHERE c.id = uli.child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL));
  END IF;

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'gifts_saved_count', COALESCE(gifts_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

COMMENT ON FUNCTION public.get_my_subnav_stats(UUID) IS 'Counts for subnav; only items assigned to a visible child; unassigned never counted so legacy saves do not reappear when adding a new child.';

-- === 202603051100_gift_list_hide_legacy.sql ===

-- Gift list: only show items assigned to a visible (non-suppressed) child (match My List rule).
-- Excludes unassigned and suppressed-child items so /gift page does not show legacy content.

CREATE OR REPLACE FUNCTION public.get_public_gift_list(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  display_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  child_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := public.resolve_gift_slug_user_id(p_slug);
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    uli.id,
    uli.kind,
    COALESCE(
      (SELECT p.name FROM public.products p WHERE p.id = uli.product_id),
      (SELECT ct.name FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
      (SELECT uw.ux_label FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id),
      '—'
    )::TEXT AS display_name,
    COALESCE(
      (SELECT p.image_url FROM public.products p WHERE p.id = uli.product_id),
      (SELECT v.image_url FROM public.v_gateway_category_type_images v WHERE v.category_type_id = uli.category_type_id LIMIT 1),
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at,
    uli.child_id
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id
    AND uli.gift = true
    AND uli.child_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = uli.child_id
        AND c.user_id = v_user_id
        AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
    )
  ORDER BY uli.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_public_gift_list(TEXT) IS 'Read-only gift list for /gift/[slug]. Only items assigned to a visible (non-suppressed) child; no legacy/unassigned.';

-- === 202603051200_marketplace_pg_trgm_item_types.sql ===

-- Marketplace: enable pg_trgm and create canonical item types for fuzzy suggestions.
-- Pre-launch backend (A.1, A.2). Idempotent.

-- Extension (must be in extensions schema; search_path in functions will include it)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Canonical item types: slug, name, synonyms, category_hint, search_text for trigram matching
CREATE TABLE IF NOT EXISTS public.marketplace_item_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  canonical_name TEXT NOT NULL,
  synonyms TEXT[] NOT NULL DEFAULT '{}',
  category_hint TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generated search_text: canonical_name + all synonyms, space-separated, for similarity()
ALTER TABLE public.marketplace_item_types
  DROP COLUMN IF EXISTS search_text;
ALTER TABLE public.marketplace_item_types
  ADD COLUMN search_text TEXT GENERATED ALWAYS AS (
    TRIM(
      canonical_name || ' ' ||
      COALESCE(array_to_string(synonyms, ' '), '')
    )
  ) STORED;

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_item_types_slug_idx
  ON public.marketplace_item_types(slug);
CREATE INDEX IF NOT EXISTS marketplace_item_types_search_text_gin
  ON public.marketplace_item_types USING gin (search_text gin_trgm_ops);

COMMENT ON TABLE public.marketplace_item_types IS 'Canonical marketplace item types for fuzzy suggestion (pg_trgm).';
COMMENT ON COLUMN public.marketplace_item_types.search_text IS 'Generated: canonical_name + synonyms for trigram similarity.';

-- updated_at trigger
DROP TRIGGER IF EXISTS marketplace_item_types_updated_at ON public.marketplace_item_types;
CREATE TRIGGER marketplace_item_types_updated_at
  BEFORE UPDATE ON public.marketplace_item_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial rows (idempotent: insert only if slug missing)
INSERT INTO public.marketplace_item_types (slug, canonical_name, synonyms, category_hint)
VALUES
  ('bath-chair', 'bath chair', ARRAY['bath seat', 'baby bath seat', 'baby bath chair'], 'bathing'),
  ('high-chair', 'high chair', ARRAY['feeding chair', 'highchair', 'baby high chair'], 'feeding'),
  ('booster-seat', 'booster seat', ARRAY['booster', 'chair booster', 'table booster'], 'feeding'),
  ('car-seat', 'car seat', ARRAY['car seat', 'baby car seat', 'infant car seat', 'carrier'], 'travel'),
  ('stroller', 'stroller', ARRAY['pushchair', 'buggy', 'pram', 'baby stroller'], 'travel'),
  ('travel-cot', 'travel cot', ARRAY['travel cot', 'portable cot', 'playpen'], 'sleep'),
  ('baby-bouncer', 'baby bouncer', ARRAY['bouncer', 'baby bouncer seat', 'bouncing seat'], 'play'),
  ('playmat', 'playmat', ARRAY['play mat', 'play gym', 'activity mat', 'gym'], 'play'),
  ('shape-sorter', 'shape sorter', ARRAY['shape sorter', 'shape sorting toy'], 'toys'),
  ('stacking-rings', 'stacking rings', ARRAY['stacking rings', 'ring stacker', 'rainbow stacker'], 'toys')
ON CONFLICT (slug) DO NOTHING;

-- === 202603051201_marketplace_listings_tables.sql ===

-- Marketplace: listings, listing photos, and user preferences tables.
-- Pre-launch backend (A.3, A.4). Idempotent.

-- Listings (pre-launch): user_id, optional child_id, raw text, selected/normalized item type, condition, status, location
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NULL REFERENCES public.children(id) ON DELETE SET NULL,
  raw_item_text TEXT,
  selected_item_type_id UUID NULL REFERENCES public.marketplace_item_types(id) ON DELETE SET NULL,
  normalized_item_type_id UUID NULL REFERENCES public.marketplace_item_types(id) ON DELETE SET NULL,
  normalization_confidence NUMERIC(3,2),
  condition TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'archived')),
  postcode TEXT,
  radius_miles NUMERIC(4,1) NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS marketplace_listings_user_id_idx ON public.marketplace_listings(user_id);
CREATE INDEX IF NOT EXISTS marketplace_listings_status_idx ON public.marketplace_listings(status);

COMMENT ON TABLE public.marketplace_listings IS 'Pre-launch marketplace listings; RLS restricts to owner.';

-- Listing photos: storage path and sort order
CREATE TABLE IF NOT EXISTS public.marketplace_listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_listing_photos_listing_id_idx ON public.marketplace_listing_photos(listing_id);

COMMENT ON TABLE public.marketplace_listing_photos IS 'Photos for a listing; paths under storage bucket marketplace-listing-photos.';

-- User preferences: postcode, radius (lat/lng optional for later)
CREATE TABLE IF NOT EXISTS public.marketplace_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  postcode TEXT,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  radius_miles NUMERIC(4,1) NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.marketplace_preferences IS 'Per-user marketplace prefs; one row per user, RLS owner-only.';

-- updated_at triggers
DROP TRIGGER IF EXISTS marketplace_listings_updated_at ON public.marketplace_listings;
CREATE TRIGGER marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS marketplace_preferences_updated_at ON public.marketplace_preferences;
CREATE TRIGGER marketplace_preferences_updated_at
  BEFORE UPDATE ON public.marketplace_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- === 202603051202_marketplace_rls.sql ===

-- Marketplace: RLS on new tables. Least-privilege, auth only (B).

-- marketplace_item_types: read-only for authenticated (lookup for suggestions)
ALTER TABLE public.marketplace_item_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_item_types_select_authenticated" ON public.marketplace_item_types;
CREATE POLICY "marketplace_item_types_select_authenticated" ON public.marketplace_item_types
  FOR SELECT TO authenticated USING (is_active = true);

-- marketplace_listings: user can select/insert/update/delete only their rows
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_listings_select_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_select_own" ON public.marketplace_listings
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listings_insert_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_insert_own" ON public.marketplace_listings
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listings_update_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_update_own" ON public.marketplace_listings
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listings_delete_own" ON public.marketplace_listings;
CREATE POLICY "marketplace_listings_delete_own" ON public.marketplace_listings
  FOR DELETE USING (user_id = auth.uid());

-- marketplace_listing_photos: select/insert/delete only if user owns parent listing (no update needed)
ALTER TABLE public.marketplace_listing_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_listing_photos_select_own_listing" ON public.marketplace_listing_photos;
CREATE POLICY "marketplace_listing_photos_select_own_listing" ON public.marketplace_listing_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_listing_photos.listing_id AND ml.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "marketplace_listing_photos_insert_own_listing" ON public.marketplace_listing_photos;
CREATE POLICY "marketplace_listing_photos_insert_own_listing" ON public.marketplace_listing_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_listing_photos.listing_id AND ml.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "marketplace_listing_photos_delete_own_listing" ON public.marketplace_listing_photos;
CREATE POLICY "marketplace_listing_photos_delete_own_listing" ON public.marketplace_listing_photos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml
      WHERE ml.id = marketplace_listing_photos.listing_id AND ml.user_id = auth.uid()
    )
  );

-- marketplace_preferences: user can select/insert/update only their row (no delete required)
ALTER TABLE public.marketplace_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_preferences_select_own" ON public.marketplace_preferences;
CREATE POLICY "marketplace_preferences_select_own" ON public.marketplace_preferences
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_preferences_insert_own" ON public.marketplace_preferences;
CREATE POLICY "marketplace_preferences_insert_own" ON public.marketplace_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_preferences_update_own" ON public.marketplace_preferences;
CREATE POLICY "marketplace_preferences_update_own" ON public.marketplace_preferences
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- === 202603051203_marketplace_storage.sql ===

-- Marketplace: private storage bucket for listing photos (C).
-- Path pattern: {user_id}/{listing_id}/{filename}. RLS: auth only; owner access by path.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'marketplace-listing-photos',
  'marketplace-listing-photos',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: INSERT only into paths where first folder = auth.uid()
DROP POLICY IF EXISTS "marketplace_listing_photos_insert_own_path" ON storage.objects;
CREATE POLICY "marketplace_listing_photos_insert_own_path"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'marketplace-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT: only when first folder (user_id) matches auth.uid()
DROP POLICY IF EXISTS "marketplace_listing_photos_select_own_path" ON storage.objects;
CREATE POLICY "marketplace_listing_photos_select_own_path"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'marketplace-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: only owner (path user_id = auth.uid())
DROP POLICY IF EXISTS "marketplace_listing_photos_delete_own_path" ON storage.objects;
CREATE POLICY "marketplace_listing_photos_delete_own_path"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'marketplace-listing-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- === 202603051204_marketplace_suggest_rpc.sql ===

-- Marketplace: fuzzy item-type suggestion RPC using pg_trgm (D, E).
-- search_path includes extensions so similarity() resolves when pg_trgm is in extensions schema.

CREATE OR REPLACE FUNCTION public.suggest_marketplace_item_types(
  query_text TEXT,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  item_type_id UUID,
  canonical_name TEXT,
  slug TEXT,
  similarity_score NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT
    m.id AS item_type_id,
    m.canonical_name,
    m.slug,
    ROUND((similarity(m.search_text, TRIM(query_text)))::numeric, 4) AS similarity_score
  FROM public.marketplace_item_types m
  WHERE m.is_active = true
    AND similarity(m.search_text, TRIM(query_text)) > 0.1
  ORDER BY similarity(m.search_text, TRIM(query_text)) DESC
  LIMIT GREATEST(1, LEAST(COALESCE(NULLIF(p_limit, 0), 5), 20));
$$;

COMMENT ON FUNCTION public.suggest_marketplace_item_types(TEXT, INT) IS
  'Fuzzy suggestion for marketplace item types via pg_trgm; returns top N by similarity.';

-- Grant to authenticated (and anon if you want unauthenticated suggestions; least-privilege = authenticated only)
GRANT EXECUTE ON FUNCTION public.suggest_marketplace_item_types(TEXT, INT) TO authenticated;

-- =============================================================================
-- Smoke tests (run in Supabase SQL Editor after migrations)
-- =============================================================================
-- 1) suggest_marketplace_item_types('chair', 5)
--    Expect: high chair, bath chair, booster seat, car seat etc with similarity_score.
-- 2) suggest_marketplace_item_types('hi chair', 5)
--    Expect: high chair as strong candidate.
-- 3) suggest_marketplace_item_types('bath', 5)
--    Expect: bath chair / bath seat as candidate.

