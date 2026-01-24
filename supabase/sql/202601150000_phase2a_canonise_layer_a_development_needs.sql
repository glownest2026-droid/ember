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

