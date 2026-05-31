-- PR9: Marketplace Intelligence Backbone, Taxonomy Bridge & Safety Gates.
-- Extends the existing public.marketplace_item_types (do NOT recreate it) and adds:
--   - marketplace_item_type_aliases
--   - marketplace_item_type_development_mappings
--   - marketplace_listing_intelligence
--   - marketplace_taxonomy_review_queue
-- All idempotent. RLS preserved/added. Seeds a small controlled starter taxonomy only.
-- No ABI Stage 2 editorial content is created here; development mappings use Stage 1
-- wrapper ux slugs as TEXT bridge references (no FK to ABI tables).

-- =============================================================================
-- A. Extend existing controlled item taxonomy (marketplace_item_types)
-- =============================================================================
ALTER TABLE public.marketplace_item_types
  ADD COLUMN IF NOT EXISTS label TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS parent_category_slug TEXT,
  ADD COLUMN IF NOT EXISTS default_min_age_months INTEGER,
  ADD COLUMN IF NOT EXISTS default_max_age_months INTEGER,
  ADD COLUMN IF NOT EXISTS default_outgrown_months INTEGER,
  ADD COLUMN IF NOT EXISTS risk_level TEXT NOT NULL DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS recommendation_policy TEXT NOT NULL DEFAULT 'recommendable';

-- Backfill label from existing canonical_name so older rows stay usable.
UPDATE public.marketplace_item_types
  SET label = canonical_name
  WHERE label IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'marketplace_item_types_risk_level_check'
  ) THEN
    ALTER TABLE public.marketplace_item_types
      ADD CONSTRAINT marketplace_item_types_risk_level_check
      CHECK (risk_level IN ('low', 'medium', 'high', 'restricted'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'marketplace_item_types_recommendation_policy_check'
  ) THEN
    ALTER TABLE public.marketplace_item_types
      ADD CONSTRAINT marketplace_item_types_recommendation_policy_check
      CHECK (recommendation_policy IN ('recommendable', 'browse_with_caution', 'do_not_recommend'));
  END IF;
END $$;

-- =============================================================================
-- B. marketplace_item_type_aliases (Gemini/parent wording -> controlled type)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_item_type_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type_id UUID NOT NULL REFERENCES public.marketplace_item_types(id) ON DELETE CASCADE,
  alias_text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'seed',
  confidence NUMERIC NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_item_type_aliases_unique_idx
  ON public.marketplace_item_type_aliases (item_type_id, lower(alias_text));
CREATE INDEX IF NOT EXISTS marketplace_item_type_aliases_item_type_idx
  ON public.marketplace_item_type_aliases (item_type_id);

DROP TRIGGER IF EXISTS marketplace_item_type_aliases_updated_at ON public.marketplace_item_type_aliases;
CREATE TRIGGER marketplace_item_type_aliases_updated_at
  BEFORE UPDATE ON public.marketplace_item_type_aliases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.marketplace_item_type_aliases IS
  'Maps Gemini/parent wording to controlled marketplace item types. Writes server/admin only.';

-- =============================================================================
-- C. marketplace_item_type_development_mappings (bridge to Stage 1 wrapper cards)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_item_type_development_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type_id UUID NOT NULL REFERENCES public.marketplace_item_types(id) ON DELETE CASCADE,
  stage1_wrapper_ux_slug TEXT NOT NULL,
  stage1_wrapper_ux_label TEXT NULL,
  development_need_slug TEXT NULL,
  stage2_category_type_slug TEXT NULL,
  mapping_strength TEXT NOT NULL DEFAULT 'estimated'
    CHECK (mapping_strength IN ('exact', 'close', 'estimated', 'review_needed')),
  estimated_min_months INTEGER NULL,
  estimated_max_months INTEGER NULL,
  lookahead_months INTEGER NOT NULL DEFAULT 6,
  safety_gate_policy TEXT NOT NULL DEFAULT 'normal'
    CHECK (safety_gate_policy IN ('normal', 'caution', 'hard_age_gate', 'restricted')),
  mapping_rationale TEXT NULL,
  source TEXT NOT NULL DEFAULT 'seed',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_item_type_dev_mappings_unique_idx
  ON public.marketplace_item_type_development_mappings (item_type_id, stage1_wrapper_ux_slug);
CREATE INDEX IF NOT EXISTS marketplace_item_type_dev_mappings_item_type_idx
  ON public.marketplace_item_type_development_mappings (item_type_id);

DROP TRIGGER IF EXISTS marketplace_item_type_dev_mappings_updated_at
  ON public.marketplace_item_type_development_mappings;
CREATE TRIGGER marketplace_item_type_dev_mappings_updated_at
  BEFORE UPDATE ON public.marketplace_item_type_development_mappings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.marketplace_item_type_development_mappings IS
  'Bridge from marketplace item types to Ember Stage 1 development wrapper cards (text slug bridge, no ABI FK).';

-- =============================================================================
-- D. marketplace_listing_intelligence (per-draft / per-listing intelligence)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_listing_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NULL REFERENCES public.marketplace_listing_drafts(id) ON DELETE CASCADE,
  listing_id UUID NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  seller_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  confirmed_item_label TEXT NULL,
  confirmed_visual_description TEXT NULL,
  marketplace_item_type_id UUID NULL REFERENCES public.marketplace_item_types(id) ON DELETE SET NULL,
  marketplace_item_type_slug TEXT NULL,
  ai_marketplace_item_type_candidates_json JSONB NULL,
  development_area_slugs_json JSONB NULL,
  stage2_category_type_slugs_json JSONB NULL,
  ai_estimated_min_age_months INTEGER NULL,
  ai_estimated_max_age_months INTEGER NULL,
  parent_confirmed_min_age_months INTEGER NULL,
  parent_confirmed_max_age_months INTEGER NULL,
  manufacturer_min_age_months INTEGER NULL,
  manufacturer_max_age_months INTEGER NULL,
  manufacturer_age_source TEXT NULL,
  safety_flags_json JSONB NULL,
  risk_level TEXT NULL,
  recommendation_eligibility TEXT NULL
    CHECK (recommendation_eligibility IS NULL OR recommendation_eligibility IN
      ('recommended', 'browse_with_caution', 'do_not_recommend', 'review_needed')),
  outgrown_estimate_months INTEGER NULL,
  confidence TEXT NULL
    CHECK (confidence IS NULL OR confidence IN ('low', 'medium', 'high')),
  coverage_state TEXT NULL
    CHECK (coverage_state IS NULL OR coverage_state IN
      ('exact_age_band_content', 'adjacent_age_band_content',
       'marketplace_item_estimate_only', 'no_editorial_content_coverage')),
  parent_confirmed_intelligence_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_listing_intelligence_draft_idx
  ON public.marketplace_listing_intelligence (draft_id)
  WHERE draft_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS marketplace_listing_intelligence_listing_idx
  ON public.marketplace_listing_intelligence (listing_id);
CREATE INDEX IF NOT EXISTS marketplace_listing_intelligence_seller_idx
  ON public.marketplace_listing_intelligence (seller_user_id);

DROP TRIGGER IF EXISTS marketplace_listing_intelligence_updated_at
  ON public.marketplace_listing_intelligence;
CREATE TRIGGER marketplace_listing_intelligence_updated_at
  BEFORE UPDATE ON public.marketplace_listing_intelligence
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.marketplace_listing_intelligence IS
  'Per-draft/listing structured intelligence. Owner-private until safely exposed by marketplace APIs.';

-- =============================================================================
-- E. marketplace_taxonomy_review_queue (unmatched Gemini suggestions)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_taxonomy_review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NULL REFERENCES public.marketplace_listing_drafts(id) ON DELETE CASCADE,
  listing_id UUID NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  submitted_by_user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  observed_item_label TEXT NULL,
  suggested_item_type_slug TEXT NULL,
  suggested_aliases_json JSONB NULL,
  suggested_stage1_wrapper_ux_slugs_json JSONB NULL,
  suggested_stage2_category_type_slug TEXT NULL,
  reason TEXT NULL,
  confidence TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'merged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_taxonomy_review_queue_status_idx
  ON public.marketplace_taxonomy_review_queue (status);
CREATE INDEX IF NOT EXISTS marketplace_taxonomy_review_queue_draft_idx
  ON public.marketplace_taxonomy_review_queue (draft_id);

DROP TRIGGER IF EXISTS marketplace_taxonomy_review_queue_updated_at
  ON public.marketplace_taxonomy_review_queue;
CREATE TRIGGER marketplace_taxonomy_review_queue_updated_at
  BEFORE UPDATE ON public.marketplace_taxonomy_review_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.marketplace_taxonomy_review_queue IS
  'Queue of Gemini taxonomy suggestions that do not map cleanly. Not exposed to unrelated users; admin review later.';

-- =============================================================================
-- F. RLS
-- =============================================================================
-- Controlled taxonomy: authenticated read of active rows; writes server/admin only (no write policy).
ALTER TABLE public.marketplace_item_type_aliases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "marketplace_item_type_aliases_select_authenticated"
  ON public.marketplace_item_type_aliases;
CREATE POLICY "marketplace_item_type_aliases_select_authenticated"
  ON public.marketplace_item_type_aliases
  FOR SELECT TO authenticated USING (is_active = true);

ALTER TABLE public.marketplace_item_type_development_mappings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "marketplace_item_type_dev_mappings_select_authenticated"
  ON public.marketplace_item_type_development_mappings;
CREATE POLICY "marketplace_item_type_dev_mappings_select_authenticated"
  ON public.marketplace_item_type_development_mappings
  FOR SELECT TO authenticated USING (is_active = true);

-- Listing intelligence: seller-owned only. Writes go through server routes (still owner-scoped).
ALTER TABLE public.marketplace_listing_intelligence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_listing_intelligence_select_own"
  ON public.marketplace_listing_intelligence;
CREATE POLICY "marketplace_listing_intelligence_select_own"
  ON public.marketplace_listing_intelligence
  FOR SELECT USING (seller_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_intelligence_insert_own"
  ON public.marketplace_listing_intelligence;
CREATE POLICY "marketplace_listing_intelligence_insert_own"
  ON public.marketplace_listing_intelligence
  FOR INSERT WITH CHECK (seller_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_intelligence_update_own"
  ON public.marketplace_listing_intelligence;
CREATE POLICY "marketplace_listing_intelligence_update_own"
  ON public.marketplace_listing_intelligence
  FOR UPDATE USING (seller_user_id = auth.uid()) WITH CHECK (seller_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_listing_intelligence_delete_own"
  ON public.marketplace_listing_intelligence;
CREATE POLICY "marketplace_listing_intelligence_delete_own"
  ON public.marketplace_listing_intelligence
  FOR DELETE USING (seller_user_id = auth.uid());

-- Review queue: owner may insert (and view) rows tied to their own drafts/listings.
-- No public/cross-user exposure. Admin review handled later (no dashboard in PR9).
ALTER TABLE public.marketplace_taxonomy_review_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_taxonomy_review_queue_insert_own"
  ON public.marketplace_taxonomy_review_queue;
CREATE POLICY "marketplace_taxonomy_review_queue_insert_own"
  ON public.marketplace_taxonomy_review_queue
  FOR INSERT WITH CHECK (submitted_by_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_taxonomy_review_queue_select_own"
  ON public.marketplace_taxonomy_review_queue;
CREATE POLICY "marketplace_taxonomy_review_queue_select_own"
  ON public.marketplace_taxonomy_review_queue
  FOR SELECT USING (submitted_by_user_id = auth.uid());

-- =============================================================================
-- G. Seed: small controlled starter taxonomy (idempotent on slug)
-- =============================================================================
INSERT INTO public.marketplace_item_types
  (slug, canonical_name, label, synonyms, category_hint, parent_category_slug,
   default_min_age_months, default_max_age_months, default_outgrown_months,
   risk_level, recommendation_policy)
VALUES
  ('toy_saxophone', 'Toy saxophone', 'Toy saxophone',
    ARRAY['toy saxophone','saxophone-style musical toy','red plastic saxophone','button musical instrument'],
    'music', 'musical_toys', 24, 60, 72, 'medium', 'recommendable'),
  ('dress_up_costume_helmet', 'Dress-up costume helmet', 'Dress-up costume helmet',
    ARRAY['costume helmet','knight helmet','dress up helmet','medieval helmet','plastic costume helmet'],
    'dress_up', 'dress_up_pretend', 36, 72, 84, 'medium', 'browse_with_caution'),
  ('child_binoculars', 'Child binoculars', 'Child binoculars',
    ARRAY['children''s binoculars','toy binoculars','safari binoculars','binoculars'],
    'exploration', 'outdoor_exploration', 36, 72, 84, 'medium', 'browse_with_caution'),
  ('hammer_peg_toy', 'Hammer and peg toy', 'Hammer and peg toy',
    ARRAY['hammer and peg toy','wooden hammer peg toy','pounding bench','peg hammer toy'],
    'toys', 'first_toys', 18, 48, 54, 'medium', 'recommendable'),
  ('picture_book', 'Picture book', 'Picture book',
    ARRAY['picture book','children''s book','board book','story book'],
    'books', 'books', 0, 72, NULL, 'low', 'recommendable'),
  ('toy_doctor_kit', 'Toy doctor kit', 'Toy doctor kit',
    ARRAY['doctor kit','vet kit','toy medical kit','pretend doctor set'],
    'pretend_play', 'dress_up_pretend', 24, 60, 72, 'medium', 'recommendable'),
  ('baby_sleep_aid', 'Baby sleep aid', 'Baby sleep aid',
    ARRAY['sleep aid','white noise machine','baby night light','cot soother'],
    'sleep', 'sleep', 0, 24, 36, 'high', 'browse_with_caution')
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  parent_category_slug = EXCLUDED.parent_category_slug,
  default_min_age_months = EXCLUDED.default_min_age_months,
  default_max_age_months = EXCLUDED.default_max_age_months,
  default_outgrown_months = EXCLUDED.default_outgrown_months,
  risk_level = EXCLUDED.risk_level,
  recommendation_policy = EXCLUDED.recommendation_policy;

-- Aliases (idempotent on item_type_id + lower(alias_text))
INSERT INTO public.marketplace_item_type_aliases (item_type_id, alias_text, source)
SELECT mit.id, a.alias_text, 'seed'
FROM (VALUES
  ('toy_saxophone', 'toy saxophone'),
  ('toy_saxophone', 'saxophone-style musical toy'),
  ('toy_saxophone', 'red plastic saxophone'),
  ('toy_saxophone', 'button musical instrument'),
  ('dress_up_costume_helmet', 'costume helmet'),
  ('dress_up_costume_helmet', 'knight helmet'),
  ('dress_up_costume_helmet', 'dress up helmet'),
  ('dress_up_costume_helmet', 'medieval helmet'),
  ('dress_up_costume_helmet', 'plastic costume helmet'),
  ('child_binoculars', 'children''s binoculars'),
  ('child_binoculars', 'toy binoculars'),
  ('child_binoculars', 'safari binoculars'),
  ('child_binoculars', 'binoculars'),
  ('hammer_peg_toy', 'hammer and peg toy'),
  ('hammer_peg_toy', 'wooden hammer peg toy'),
  ('hammer_peg_toy', 'pounding bench'),
  ('hammer_peg_toy', 'peg hammer toy'),
  ('picture_book', 'picture book'),
  ('picture_book', 'children''s book'),
  ('picture_book', 'board book'),
  ('picture_book', 'story book'),
  ('toy_doctor_kit', 'doctor kit'),
  ('toy_doctor_kit', 'vet kit'),
  ('toy_doctor_kit', 'toy medical kit'),
  ('toy_doctor_kit', 'pretend doctor set'),
  ('baby_sleep_aid', 'sleep aid'),
  ('baby_sleep_aid', 'white noise machine'),
  ('baby_sleep_aid', 'baby night light'),
  ('baby_sleep_aid', 'cot soother')
) AS a(slug, alias_text)
JOIN public.marketplace_item_types mit ON mit.slug = a.slug
ON CONFLICT (item_type_id, lower(alias_text)) DO NOTHING;

-- Development mappings (idempotent on item_type_id + stage1_wrapper_ux_slug)
INSERT INTO public.marketplace_item_type_development_mappings
  (item_type_id, stage1_wrapper_ux_slug, stage1_wrapper_ux_label, mapping_strength,
   estimated_min_months, estimated_max_months, safety_gate_policy, mapping_rationale, source)
SELECT mit.id, m.wrapper_slug, m.label, m.strength, m.min_m, m.max_m, m.gate, m.rationale, 'seed'
FROM (VALUES
  ('toy_saxophone', 'fine_motor', 'My hands can do more now', 'close', 24, 60, 'normal', 'Pressing buttons and holding the toy supports hand control.'),
  ('toy_saxophone', 'cognitive_problem_solving', 'I''m figuring things out', 'estimated', 24, 60, 'normal', 'Cause-and-effect play with sounds and controls.'),
  ('dress_up_costume_helmet', 'social_emotional', 'I''m learning to play with other people', 'estimated', 36, 72, 'caution', 'Supports role play and pretending with others.'),
  ('dress_up_costume_helmet', 'cognitive_problem_solving', 'I''m figuring things out', 'estimated', 36, 72, 'caution', 'Imaginative scenarios and pretend logic.'),
  ('child_binoculars', 'cognitive_problem_solving', 'I''m figuring things out', 'estimated', 36, 72, 'caution', 'Observation, looking closely and noticing detail.'),
  ('child_binoculars', 'gross_motor', 'My body is ready for bigger moves', 'estimated', 36, 72, 'caution', 'Outdoor exploration and active looking.'),
  ('hammer_peg_toy', 'fine_motor', 'My hands can do more now', 'close', 18, 48, 'normal', 'Grasping the mallet and aiming at pegs builds hand control.'),
  ('hammer_peg_toy', 'cognitive_problem_solving', 'I''m figuring things out', 'estimated', 18, 48, 'normal', 'Cause and effect, sequencing and persistence.'),
  ('picture_book', 'language_communication', 'I''ve got more to say', 'estimated', 0, 72, 'normal', 'Shared reading supports words and conversation.'),
  ('picture_book', 'cognitive_problem_solving', 'I''m figuring things out', 'estimated', 0, 72, 'normal', 'Naming, noticing and early reasoning.'),
  ('toy_doctor_kit', 'social_emotional', 'I''m learning to play with other people', 'close', 24, 60, 'normal', 'Pretend caregiving and turn-taking with others.'),
  ('toy_doctor_kit', 'language_communication', 'I''ve got more to say', 'estimated', 24, 60, 'normal', 'Role-play vocabulary and narration.'),
  ('baby_sleep_aid', 'self_care_independence', 'I''m doing more by myself', 'review_needed', 0, 24, 'hard_age_gate', 'Sleep-space items need manufacturer guidance; mapping needs review.')
) AS m(item_type_slug, wrapper_slug, label, strength, min_m, max_m, gate, rationale)
JOIN public.marketplace_item_types mit ON mit.slug = m.item_type_slug
ON CONFLICT (item_type_id, stage1_wrapper_ux_slug) DO NOTHING;
