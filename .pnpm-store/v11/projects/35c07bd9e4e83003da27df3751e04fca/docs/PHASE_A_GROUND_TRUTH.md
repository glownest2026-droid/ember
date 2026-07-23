# Phase A Ground Truth — Current State Audit

**Date**: 2026-01-15  
**Purpose**: Document the current state of the gateway/landing page implementation and data dependencies for Phase A rebuild  
**Status**: Ground truth only — no migrations, no code changes

---

## 1. What Exists Today

### 1.1 Gateway Routes

The public, anonymous "age-first gateway" experience is currently implemented at:

- **`/new`** — Redirects to `/new/26` (default age)
- **`/new/[months]`** — Main gateway landing page with:
  - Age slider (24–30 months range, clamped)
  - Moment selection (e.g., "Bath time", "Let me help", "Quiet play", "Burn energy")
  - Top 3 picks display (when published set exists)
  - "Save to shortlist" CTA that redirects to `/signin?next=...`

**Route Files**:
- `web/src/app/new/page.tsx` — Redirect handler
- `web/src/app/new/[months]/page.tsx` — Server component (data fetching)
- `web/src/app/new/[months]/NewLandingPageClient.tsx` — Client component (UI)

### 1.2 Data Fetching (Supabase Read Paths)

The gateway uses server-side data fetching via `web/src/lib/pl/public.ts`:

**Functions Used**:
- `getAgeBandForAge(ageMonths)` — Maps age in months to `pl_age_bands` (filters by `is_active = true`)
- `getActiveMomentsForAgeBand(ageBandId)` — Fetches `pl_moments` that have published sets
- `getPublishedSetForAgeBandAndMoment(ageBandId, momentId)` — Fetches published `pl_age_moment_sets` with related:
  - `pl_reco_cards` (sorted by `rank`)
  - `pl_category_types` (via `category_type_id`)
  - `products` (via `product_id`)

**Tables Read** (via Supabase client):
- `pl_age_bands` — Age band vocabulary (public read for `is_active = true`)
- `pl_moments` — Moment vocabulary (public read for `is_active = true`)
- `pl_age_moment_sets` — Sets (public read for `status = 'published'`)
- `pl_reco_cards` — Cards (public read via published set check)
- `pl_category_types` — Category types (public read via published card references)
- `products` — Products (public read via `products_public_read` policy)

**RLS Status**:
- All reads use server-side Supabase client (`createClient()` from `utils/supabase/server`)
- RLS policies currently allow public SELECT on published sets/cards
- `pl_category_types` and `products` have public read policies (but per CTO Alex, we will NOT rely on this for Phase A — will use curated views instead)

### 1.3 UI Components

**Client Component**: `NewLandingPageClient.tsx`
- Age slider (24–30 months)
- Moment selection grid (2x2 layout)
- Product cards display (top 3 picks)
- "Save to shortlist" buttons (redirect to signin)

**Data Display**:
- Card titles from `pl_category_types.label` or `products.name`
- Card descriptions from `card.because` (recommendation rationale)
- Lane badges ("Bath pick", "Nearby idea", "Surprise pick") mapped from `card.lane` enum
- Tags from `card.why_tags` array

### 1.4 Mock HTML / Functional Requirements

**No mock HTML files found** in the repository. The current implementation (`NewLandingPageClient.tsx`) appears to be the production implementation based on functional requirements.

**Functional Requirements** (extracted from current code):
1. Age slider: 24–30 months range, updates URL (`/new/{months}`)
2. Moment selection: Query param `?moment={momentId}`, updates URL on change
3. Top 3 picks: Only shown when published set exists for selected age+moment
4. Empty state: Shows "We're still building this moment for this age" when no published set
5. Sign-in gate: "Save to shortlist" redirects to `/signin?next=/new/{months}?moment={momentId}`

---

## 2. Legacy Freeze

### 2.1 Legacy PL Tables (Frozen — No New Writes)

The following tables are **deprecated/frozen** for Phase A gateway. We are **NOT** using them for the new age-first gateway experience:

- **`pl_age_moment_sets`** — Legacy set pattern (age band + moment → cards)
  - **Status**: FROZEN — No new writes for Phase A gateway
  - **Reason**: Phase A uses new UX wrapper → development need → category types → products pattern
  - **Note**: Existing published sets may still be read for backward compatibility, but new gateway will not create new sets

- **`pl_reco_cards`** — Legacy card pattern (lanes: obvious/nearby/surprise)
  - **Status**: FROZEN — No new writes for Phase A gateway
  - **Reason**: Phase A uses ranked UX wrapper cards, not lane-based cards
  - **Note**: Existing published cards may still be read, but new gateway will not create new cards

- **`pl_evidence`** (legacy card evidence) — Legacy evidence pattern
  - **Status**: FROZEN — No new writes for Phase A gateway
  - **Reason**: Phase A uses new evidence structure (if needed)
  - **Note**: May be renamed to `pl_card_evidence` in some environments

- **`pl_pool_items`** — Legacy pool management
  - **Status**: FROZEN — No new writes for Phase A gateway
  - **Reason**: Phase A uses new mapping tables

**Migration Path**: Phase A gateway will use new tables (`pl_ux_wrappers`, `pl_age_band_ux_wrappers`, etc.) instead of legacy tables. Legacy tables remain for backward compatibility only.

---

## 3. DB Reality Summary

### 3.1 Canonical Tables (Existing Today)

#### `pl_age_bands`
- **Schema**: `id TEXT PK`, `label TEXT`, `min_months INT`, `max_months INT`, `is_active BOOL default true`, `created_at`, `updated_at`
- **RLS**: Currently admin-only (no anon read today, but Phase A will need public read via curated view)
- **Note**: Text IDs are immutable vocabulary (e.g., "25-27m")

#### `pl_development_needs`
- **Schema**: `id UUID PK`, `name TEXT NOT NULL`, `slug TEXT NOT NULL`, `plain_english_description TEXT`, `why_it_matters TEXT`, `created_at`, `updated_at`
- **RLS**: Has `admin_all` and `authenticated_read` (anon blocked today)
- **Status**: Populated from Manus Layer A CSV (12 development needs)

#### `pl_category_types`
- **Schema**: `id UUID PK`, `slug TEXT NOT NULL`, `label TEXT NOT NULL`, `name TEXT NOT NULL`, `description TEXT`, `image_url`, `image_reference_url`, `safety_notes`, `created_at`, `updated_at`
- **RLS**: Has `admin_all` and `authenticated_read` (anon blocked today)
- **Status**: 40 rows, actively used

#### `products` (Canonical SKUs)
- **Schema**: `id UUID PK`, `name`, `affiliate_url`, `image_url`, `why_it_matters`, `age_band TEXT nullable`, `affiliate fields`, `tags array`, `brand`, `canonical_url`, `amazon_uk_url`, `ean_gtin`, `asin`, `mpn_model`, `category_type_id UUID nullable`, etc.
- **RLS**: Has `products_public_read` policy today, but per CTO Alex we will NOT rely on exposing all product columns to anon for the gateway. We will use curated gateway views.

### 3.2 Legacy PL System Tables (Frozen)

#### `pl_age_moment_sets`
- **Schema**: `id UUID PK`, `age_band_id TEXT`, `moment_id TEXT`, `status ENUM published/draft/etc`, `headline`, `timestamps`
- **Status**: FROZEN — No new writes for Phase A

#### `pl_reco_cards`
- **Schema**: `id UUID PK`, `set_id UUID`, `lane ENUM`, `rank INT`, `category_type_id UUID`, `product_id UUID`, `because TEXT`, `why_tags ARRAY`, `timestamps`
- **Status**: FROZEN — No new writes for Phase A

#### `pl_evidence` (legacy)
- **Schema**: `id UUID PK`, `card_id UUID`, `source_type TEXT`, `url`, `quote_snippet`, `captured_at`, `confidence INT`, `timestamps`
- **Status**: FROZEN — May be renamed to `pl_card_evidence` in some environments

#### `pl_pool_items`
- **Schema**: `id UUID PK`, `age_band_id TEXT`, `moment_id TEXT`, `category_type_id UUID`, `note`, `timestamps`
- **Status**: FROZEN — No new writes for Phase A

### 3.3 Seed Tables (Staging/Import Only)

#### `pl_seed_development_needs`
- **Schema**: `need_name TEXT`, `plain_english_description`, `why_it_matters`, `min_month`, `max_month`, `stage_anchor_month`, `stage_phase ENUM`, `stage_reason`, `evidence_urls TEXT` (pipe-separated), `evidence_notes TEXT` (pipe-separated), `imported_at`
- **Status**: Staging table — NOT referenced in application code
- **Delimiter Format**: `evidence_urls` and `evidence_notes` are pipe-separated (`|`)

#### `pl_seed_category_types`
- **Schema**: `name`, `slug`, `description`, `mapped_developmental_needs TEXT` (comma-separated need names), `min_month`, `max_month`, `stage_anchor_month`, `stage_phase ENUM`, `stage_reason`, `evidence_urls TEXT` (pipe-separated), `evidence_notes TEXT` (pipe-separated), `imported_at`
- **Status**: Staging table — NOT referenced in application code
- **Delimiter Format**: 
  - `mapped_developmental_needs` is comma-separated string of need names
  - `evidence_urls` and `evidence_notes` are pipe-separated

#### `pl_seed_products`
- **Schema**: `name`, `brand`, `category_type_slug`, `age_band_id TEXT` (e.g., "25-27m"), `min_month`/`max_month`, `stage_*` fields, `canonical_url`, `amazon_uk_url`, `rating fields`, `identifiers`, `evidence_urls`/`evidence_notes` (pipe-separated), `confidence_score_0_to_10`, `quality_score_0_to_10`, `price_gbp`, `uk_retailers`, `age_suitability_note`, `category_name_raw`, `imported_at`
- **Status**: Staging table — NOT referenced in application code
- **Delimiter Format**: `evidence_urls` and `evidence_notes` are pipe-separated

**Note**: Seed tables use different delimiter formats:
- `mapped_developmental_needs` (in `pl_seed_category_types`): **comma-separated** string of need names
- `evidence_urls` / `evidence_notes` (all seed tables): **pipe-separated** (`|`)
- `stage_phase` (all seed tables): **ENUM** (not free text)

---

## 4. Current Data Flow (Legacy Pattern)

**Current Flow** (legacy, to be replaced in Phase A):
1. User selects age (slider) → maps to `pl_age_bands.id`
2. User selects moment → maps to `pl_moments.id`
3. System queries `pl_age_moment_sets` WHERE `age_band_id = X AND moment_id = Y AND status = 'published'`
4. System fetches `pl_reco_cards` for that set (sorted by `rank`)
5. System displays cards with `pl_category_types` and `products` data

**Phase A Flow** (new, to be implemented):
1. User selects age (slider) → maps to `pl_age_bands.id`
2. System queries `pl_age_band_ux_wrappers` WHERE `age_band_id = X AND is_active = true` (sorted by `rank`)
3. Each UX wrapper links to `pl_development_needs` via `pl_ux_wrapper_needs`
4. Each development need links to `pl_category_types` via `pl_age_band_development_need_category_types`
5. Each category type links to `products` via `pl_age_band_category_type_products`
6. System displays ranked UX wrapper cards with category types and products

---

## 5. Discovered Surprises

1. **No mock HTML files**: The current implementation appears to be production-ready, not a mockup
2. **Legacy tables still in use**: Current `/new` route uses legacy `pl_age_moment_sets` / `pl_reco_cards` pattern
3. **Public read policies exist**: `pl_category_types` and `products` have public read policies, but CTO Alex requires curated views instead
4. **Seed table delimiters**: Different delimiter formats (comma for `mapped_developmental_needs`, pipe for `evidence_urls`/`evidence_notes`)
5. **Stage metadata in seed tables**: `stage_anchor_month`, `stage_phase`, `stage_reason` exist in seed tables but not on base canonical tables (will be moved to age-specific mapping tables in Phase A)

---

## 6. Next Steps

1. **PR #2**: Create migrations for new Phase A tables (`pl_ux_wrappers`, mapping tables, curated public views)
2. **PR #3**: Wire new Phase A data flow into `/new/[months]` route
3. **PR #4**: Remove legacy table dependencies from gateway route (optional, for cleanup)

---

_End of Phase A Ground Truth_

