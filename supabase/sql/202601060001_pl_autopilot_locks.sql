-- PL Autopilot: Add locks to pl_reco_cards
-- Date: 2026-01-06
-- Purpose: Add is_locked column to prevent autopilot from overwriting founder choices

ALTER TABLE public.pl_reco_cards 
  ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS locked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Index for filtering locked cards
CREATE INDEX IF NOT EXISTS pl_reco_cards_is_locked_idx ON public.pl_reco_cards(is_locked) WHERE is_locked = true;

