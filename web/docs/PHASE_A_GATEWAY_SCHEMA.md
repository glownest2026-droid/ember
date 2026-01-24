# Phase A Gateway Schema — ERD and Design

**Date**: 2026-01-15  
**Purpose**: Document the Phase A gateway schema design (age-first gateway: age band → UX wrapper cards → development need → category types → products)  
**Status**: Write-only plan — no migrations in this PR

---

## 1. ERD in Text (Tables + Relationships + Why)

### 1.1 Core Flow

```
pl_age_bands (text id, immutable vocabulary)
  ↓ (1:N via pl_age_band_ux_wrappers)
pl_ux_wrappers (parent-friendly labels, e.g., "Shapes & colours")
  ↓ (1:1 via pl_ux_wrapper_needs, UNIQUE constraint)
pl_development_needs (science layer, e.g., "Color and shape recognition")
  ↓ (N:M via pl_age_band_development_need_category_types, age-specific)
pl_category_types (product categories, e.g., "Balance bikes")
  ↓ (N:M via pl_age_band_category_type_products, age-specific)
products (canonical SKUs)
```

### 1.2 Why This Structure?

1. **Age band first**: User selects age → system shows ranked UX wrapper cards for that age
2. **UX wrapper → development need (1:1)**: Each parent-friendly label maps to exactly one science need (enforced via UNIQUE constraint on `pl_ux_wrapper_needs.ux_wrapper_id`)
3. **Development need → category types (N:M, age-specific)**: A need can map to multiple category types, and mappings are age-band-specific (e.g., "Gross motor skills" → "Balance bikes" for 25–27m, but different categories for 18–24m)
4. **Category types → products (N:M, age-specific)**: A category can map to multiple products, and mappings are age-band-specific (e.g., "Balance bikes" → Product A for 25–27m, Product B for 18–24m)
5. **Stage metadata per age band**: Stage information (`stage_anchor_month`, `stage_phase`, `stage_reason`) stored in `pl_age_band_development_need_meta`, not on base tables (allows different stages per age band)
6. **Operational toggles**: `is_active` on mapping tables allows deactivating links without delete (soft delete pattern)

---

## 2. New Tables (To Be Created in PR #2)

### 2.1 `pl_ux_wrappers`

**Purpose**: Parent-friendly UX labels (e.g., "Shapes & colours", "Let me help", "Quiet play")

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `ux_label` | `TEXT` | NOT NULL | Display label (e.g., "Shapes & colours") |
| `ux_slug` | `TEXT` | NOT NULL, UNIQUE | URL-friendly identifier (e.g., "shapes-colours") |
| `ux_description` | `TEXT` | | Optional description |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RLS**: Admin CRUD, public read via curated view only

**Indexes**:
- `pl_ux_wrappers_ux_slug_idx` on `ux_slug` (unique)

---

### 2.2 `pl_ux_wrapper_needs`

**Purpose**: Maps UX wrapper to development need (1:1 enforced via UNIQUE constraint)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `ux_wrapper_id` | `UUID` | NOT NULL, FK → `pl_ux_wrappers(id)` ON DELETE CASCADE, UNIQUE | Enforces 1:1 (one wrapper → one need) |
| `development_need_id` | `UUID` | NOT NULL, FK → `pl_development_needs(id)` ON DELETE CASCADE | |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RLS**: Admin CRUD, public read via curated view only

**Indexes**:
- `pl_ux_wrapper_needs_ux_wrapper_id_idx` on `ux_wrapper_id` (unique)
- `pl_ux_wrapper_needs_development_need_id_idx` on `development_need_id`

**Note**: UNIQUE constraint on `ux_wrapper_id` enforces 1:1 relationship (one wrapper maps to exactly one need). Future may allow many-to-many by removing this constraint.

---

### 2.3 `pl_age_band_ux_wrappers`

**Purpose**: Age-band-specific ranking of UX wrapper cards

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `age_band_id` | `TEXT` | NOT NULL, FK → `pl_age_bands(id)` ON DELETE RESTRICT | Immutable vocabulary |
| `ux_wrapper_id` | `UUID` | NOT NULL, FK → `pl_ux_wrappers(id)` ON DELETE CASCADE | |
| `rank` | `INTEGER` | NOT NULL | Order within age band (1 = highest priority) |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Operational toggle |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RLS**: Admin CRUD, public read via curated view only

**Indexes**:
- `pl_age_band_ux_wrappers_age_band_id_idx` on `age_band_id`
- `pl_age_band_ux_wrappers_ux_wrapper_id_idx` on `ux_wrapper_id`
- `pl_age_band_ux_wrappers_age_band_rank_idx` on `(age_band_id, rank)` (for sorted queries)

**Unique Constraint**: `UNIQUE(age_band_id, ux_wrapper_id)` (one wrapper per age band, but can have different ranks per age band if needed)

---

### 2.4 `pl_age_band_development_need_meta`

**Purpose**: Age-band-specific stage metadata for development needs (not on base tables)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `age_band_id` | `TEXT` | NOT NULL, FK → `pl_age_bands(id)` ON DELETE RESTRICT | Immutable vocabulary |
| `development_need_id` | `UUID` | NOT NULL, FK → `pl_development_needs(id)` ON DELETE CASCADE | |
| `stage_anchor_month` | `INTEGER` | | Age at which this need is most relevant |
| `stage_phase` | `TEXT` | | Phase enum (e.g., "emerging", "developing", "mastered") |
| `stage_reason` | `TEXT` | | Reason/explanation for stage assignment |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Operational toggle |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RLS**: Admin CRUD, public read via curated view only

**Indexes**:
- `pl_age_band_development_need_meta_age_band_id_idx` on `age_band_id`
- `pl_age_band_development_need_meta_development_need_id_idx` on `development_need_id`

**Unique Constraint**: `UNIQUE(age_band_id, development_need_id)` (one meta record per age band + need combination)

**Note**: Stage metadata is age-specific (e.g., "Gross motor skills" may be "developing" for 25–27m but "mastered" for 30–36m). This table stores that metadata, not the base `pl_development_needs` table.

---

### 2.5 `pl_age_band_development_need_category_types`

**Purpose**: Age-band-specific mapping from development needs to category types (with ranking)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `age_band_id` | `TEXT` | NOT NULL, FK → `pl_age_bands(id)` ON DELETE RESTRICT | Immutable vocabulary |
| `development_need_id` | `UUID` | NOT NULL, FK → `pl_development_needs(id)` ON DELETE CASCADE | |
| `category_type_id` | `UUID` | NOT NULL, FK → `pl_category_types(id)` ON DELETE CASCADE | |
| `rank` | `INTEGER` | NOT NULL | Order within age band + need (1 = highest priority) |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Operational toggle |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RLS**: Admin CRUD, public read via curated view only

**Indexes**:
- `pl_age_band_development_need_category_types_age_band_id_idx` on `age_band_id`
- `pl_age_band_development_need_category_types_development_need_id_idx` on `development_need_id`
- `pl_age_band_development_need_category_types_category_type_id_idx` on `category_type_id`
- `pl_age_band_development_need_category_types_age_band_need_rank_idx` on `(age_band_id, development_need_id, rank)` (for sorted queries)

**Unique Constraint**: `UNIQUE(age_band_id, development_need_id, category_type_id)` (one mapping per combination)

---

### 2.6 `pl_age_band_category_type_products`

**Purpose**: Age-band-specific mapping from category types to products (with ranking)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `age_band_id` | `TEXT` | NOT NULL, FK → `pl_age_bands(id)` ON DELETE RESTRICT | Immutable vocabulary |
| `category_type_id` | `UUID` | NOT NULL, FK → `pl_category_types(id)` ON DELETE CASCADE | |
| `product_id` | `UUID` | NOT NULL, FK → `products(id)` ON DELETE CASCADE | |
| `rank` | `INTEGER` | NOT NULL | Order within age band + category (1 = highest priority) |
| `is_active` | `BOOLEAN` | NOT NULL, DEFAULT `true` | Operational toggle |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RLS**: Admin CRUD, public read via curated view only

**Indexes**:
- `pl_age_band_category_type_products_age_band_id_idx` on `age_band_id`
- `pl_age_band_category_type_products_category_type_id_idx` on `category_type_id`
- `pl_age_band_category_type_products_product_id_idx` on `product_id`
- `pl_age_band_category_type_products_age_band_category_rank_idx` on `(age_band_id, category_type_id, rank)` (for sorted queries)

**Unique Constraint**: `UNIQUE(age_band_id, category_type_id, product_id)` (one mapping per combination)

---

### 2.7 `pl_product_sources` (Optional)

**Purpose**: Track product sources/external IDs/raw JSONB for product mapping

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `UUID` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `product_id` | `UUID` | NOT NULL, FK → `products(id)` ON DELETE CASCADE | |
| `source_name` | `TEXT` | NOT NULL | Source identifier (e.g., "manus", "amazon", "manual") |
| `external_id` | `TEXT` | | External system ID |
| `raw_data` | `JSONB` | | Raw source data (flexible schema) |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RLS**: Admin CRUD, public read via curated view only

**Indexes**:
- `pl_product_sources_product_id_idx` on `product_id`
- `pl_product_sources_source_name_idx` on `source_name`
- `pl_product_sources_external_id_idx` on `external_id` (if needed)

**Note**: Optional table — may not be needed for Phase A MVP, but useful for tracking product provenance.

---

## 3. Public View Shapes (Curated Views for Anonymous Access)

**Security Principle**: Canonical tables remain protected by default. Anonymous users read from curated public views that expose only safe columns.

### 3.1 `v_gateway_age_bands_public`

**Purpose**: Public read for age bands (minimal columns)

**Columns**:
- `id` (TEXT)
- `label` (TEXT)
- `min_months` (INTEGER)
- `max_months` (INTEGER)

**RLS**: Public SELECT (anon + authenticated)

**Query Pattern**:
```sql
CREATE VIEW v_gateway_age_bands_public AS
SELECT id, label, min_months, max_months
FROM public.pl_age_bands
WHERE is_active = true;
```

---

### 3.2 `v_gateway_wrappers_public`

**Purpose**: Public read for UX wrappers with rank per age band

**Columns**:
- `ux_wrapper_id` (UUID)
- `ux_label` (TEXT)
- `ux_slug` (TEXT)
- `ux_description` (TEXT, nullable)
- `age_band_id` (TEXT)
- `rank` (INTEGER)

**RLS**: Public SELECT (anon + authenticated)

**Query Pattern**:
```sql
CREATE VIEW v_gateway_wrappers_public AS
SELECT 
  uw.id AS ux_wrapper_id,
  uw.ux_label,
  uw.ux_slug,
  uw.ux_description,
  abuw.age_band_id,
  abuw.rank
FROM public.pl_ux_wrappers uw
JOIN public.pl_age_band_ux_wrappers abuw ON uw.id = abuw.ux_wrapper_id
WHERE abuw.is_active = true
ORDER BY abuw.age_band_id, abuw.rank;
```

---

### 3.3 `v_gateway_development_needs_public`

**Purpose**: Public read for development needs (safe columns only)

**Columns**:
- `id` (UUID)
- `name` (TEXT)
- `slug` (TEXT)
- `plain_english_description` (TEXT)
- `why_it_matters` (TEXT)

**RLS**: Public SELECT (anon + authenticated)

**Query Pattern**:
```sql
CREATE VIEW v_gateway_development_needs_public AS
SELECT id, name, slug, plain_english_description, why_it_matters
FROM public.pl_development_needs;
```

**Note**: Excludes internal columns like `min_month`, `max_month`, `stage_*` fields (those are in meta table, not base table).

---

### 3.4 `v_gateway_category_types_public`

**Purpose**: Public read for category types (safe columns only)

**Columns**:
- `id` (UUID)
- `slug` (TEXT)
- `label` (TEXT)
- `name` (TEXT)
- `description` (TEXT, nullable)
- `image_url` (TEXT, nullable)
- `safety_notes` (TEXT, nullable)

**RLS**: Public SELECT (anon + authenticated)

**Query Pattern**:
```sql
CREATE VIEW v_gateway_category_types_public AS
SELECT id, slug, label, name, description, image_url, safety_notes
FROM public.pl_category_types;
```

**Note**: Excludes internal columns like `image_reference_url`, `min_month`, `max_month`, `evidence_urls`, `confidence_score`.

---

### 3.5 `v_gateway_products_public`

**Purpose**: Public read for products (safe columns only — affiliate/deeplink fields)

**Columns**:
- `id` (UUID)
- `name` (TEXT)
- `brand` (TEXT, nullable)
- `image_url` (TEXT, nullable)
- `canonical_url` (TEXT, nullable)
- `amazon_uk_url` (TEXT, nullable)
- `affiliate_url` (TEXT, nullable)
- `affiliate_deeplink` (TEXT, nullable)
- `deep_link_url` (TEXT, nullable) — if exists

**RLS**: Public SELECT (anon + authenticated)

**Query Pattern**:
```sql
CREATE VIEW v_gateway_products_public AS
SELECT 
  id,
  name,
  brand,
  image_url,
  canonical_url,
  amazon_uk_url,
  affiliate_url,
  affiliate_deeplink,
  deep_link_url -- if column exists
FROM public.products;
```

**Note**: Excludes internal columns like `why_it_matters`, `tags`, `age_band`, `category_type_id`, `amazon_rating`, `confidence_score`, `quality_score`, `manus_payload`, etc.

---

## 4. Updated_at Triggers Plan

**Shared Trigger Function**: All new tables with `updated_at` columns will use the same trigger function pattern.

**Function** (if not exists, create in PR #2):
```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

**Trigger Pattern** (for each new table):
```sql
CREATE TRIGGER trg_pl_ux_wrappers_updated_at
  BEFORE UPDATE ON public.pl_ux_wrappers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

**Tables Requiring Triggers**:
- `pl_ux_wrappers`
- `pl_ux_wrapper_needs`
- `pl_age_band_ux_wrappers`
- `pl_age_band_development_need_meta`
- `pl_age_band_development_need_category_types`
- `pl_age_band_category_type_products`
- `pl_product_sources` (if created)

**Note**: Do not assume existing function exists — check and create if missing in PR #2.

---

## 5. Immutability Plan for `pl_age_bands.id`

**Requirement**: Text IDs in `pl_age_bands` are immutable vocabulary (e.g., "25-27m"). Prevent updates to `id` column.

**Trigger Plan** (to be created in PR #2):
```sql
CREATE OR REPLACE FUNCTION public.prevent_age_band_id_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.id IS DISTINCT FROM NEW.id THEN
    RAISE EXCEPTION 'pl_age_bands.id is immutable and cannot be updated';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_pl_age_bands_prevent_id_update
  BEFORE UPDATE ON public.pl_age_bands
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_age_band_id_update();
```

**Alternative**: Add CHECK constraint or application-level validation (but trigger is more robust).

---

## 6. RLS Stance

### 6.1 Canonical Tables (Default: Protected)

**Principle**: Canonical tables (`pl_ux_wrappers`, `pl_development_needs`, `pl_category_types`, `products`, etc.) remain protected by default.

**RLS Policies**:
- **Admin CRUD**: `is_admin()` check for INSERT/UPDATE/DELETE
- **Authenticated Read**: `auth.role() = 'authenticated'` for SELECT (if needed for internal use)
- **Public Read**: ❌ **NO** — Anonymous users cannot read canonical tables directly

### 6.2 Curated Public Views (Anonymous Access)

**Principle**: Anonymous users read from curated public views (`v_gateway_*_public`) that expose only safe columns.

**RLS Policies**:
- **Public SELECT**: `USING (true)` — Anonymous and authenticated users can read
- **No Write Access**: Views are read-only (no INSERT/UPDATE/DELETE)

### 6.3 Mapping Tables (Default: Protected)

**Principle**: Mapping tables (`pl_age_band_ux_wrappers`, `pl_age_band_development_need_category_types`, etc.) are protected by default.

**RLS Policies**:
- **Admin CRUD**: `is_admin()` check for INSERT/UPDATE/DELETE
- **Public Read**: ❌ **NO** — Anonymous users cannot read mapping tables directly (they read via curated views)

**Exception**: Curated views may JOIN mapping tables internally (views run with definer security, so RLS on base tables still applies).

---

## 7. Summary: Minimum New Tables for PR #2

1. ✅ `pl_ux_wrappers` — UX wrapper vocabulary
2. ✅ `pl_ux_wrapper_needs` — Wrapper → need mapping (1:1 via UNIQUE)
3. ✅ `pl_age_band_ux_wrappers` — Age-band-specific wrapper ranking
4. ✅ `pl_age_band_development_need_meta` — Age-band-specific stage metadata
5. ✅ `pl_age_band_development_need_category_types` — Age-band-specific need → category mapping
6. ✅ `pl_age_band_category_type_products` — Age-band-specific category → product mapping
7. ⚠️ `pl_product_sources` — Optional (product provenance tracking)

**Plus**:
- Curated public views (`v_gateway_*_public`)
- Updated_at triggers (shared function)
- Immutability trigger for `pl_age_bands.id`
- RLS policies (admin CRUD, public read on views only)

---

_End of Phase A Gateway Schema_

