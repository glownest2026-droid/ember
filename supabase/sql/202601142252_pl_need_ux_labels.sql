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
      -- Add slug column
      ALTER TABLE public.pl_development_needs ADD COLUMN slug TEXT;
      
      -- Backfill slugs from need_name (slugify: lowercase, hyphens, alnum only)
      -- Pattern: lowercase, keep alnum and spaces, replace spaces with hyphens, collapse multiple hyphens
      UPDATE public.pl_development_needs
      SET slug = regexp_replace(
        regexp_replace(
          regexp_replace(
            lower(trim(need_name)),
            '[^a-z0-9\s]', '', 'g'
          ),
          '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
      )
      WHERE slug IS NULL;
      
      -- Remove leading/trailing hyphens
      UPDATE public.pl_development_needs
      SET slug = trim(both '-' from slug)
      WHERE slug IS NOT NULL;
      
      -- Add unique constraint on slug
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'pl_development_needs_slug_unique'
      ) THEN
        ALTER TABLE public.pl_development_needs
        ADD CONSTRAINT pl_development_needs_slug_unique UNIQUE (slug);
      END IF;
      
      -- Make slug NOT NULL after backfill
      ALTER TABLE public.pl_development_needs ALTER COLUMN slug SET NOT NULL;
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

-- Note: Prefer slug lookup, fallback to exact need_name match
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
       OR need_name = 'Color and shape recognition'
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
       OR need_name = 'Creative expression and mark-making'
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
       OR need_name = 'Emotional regulation and self-awareness'
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
       OR need_name = 'Fine motor control and hand coordination'
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
       OR need_name = 'Gross motor skills and physical confidence'
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
       OR need_name = 'Independence and practical life skills'
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
       OR need_name = 'Language development and communication'
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
       OR need_name = 'Pretend play and imagination'
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
       OR need_name = 'Problem-solving and cognitive skills'
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
       OR need_name = 'Routine understanding and cooperation'
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
       OR need_name = 'Social skills and peer interaction'
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
       OR need_name = 'Spatial reasoning and construction play'
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
--   dn.need_name,
--   dn.slug AS need_slug,
--   ul.ux_label,
--   ul.ux_slug
-- FROM public.pl_need_ux_labels ul
-- JOIN public.pl_development_needs dn ON ul.development_need_id = dn.id
-- WHERE ul.is_primary = true AND ul.is_active = true
-- ORDER BY ul.sort_order NULLS LAST, ul.ux_label;
