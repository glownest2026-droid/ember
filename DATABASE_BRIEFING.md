# Supabase Database Briefing for CTO
**Project Ember - Complete Database Schema Documentation**

_Generated: 2026-01-14_  
_Last Migration: `202601142252_pl_need_ux_labels.sql`_

---

## Executive Summary

**Database**: Supabase (PostgreSQL)  
**Total Tables**: 18+ tables (see detailed list below)  
**RLS**: Row Level Security enabled on all public tables  
**Admin System**: Role-based via `user_roles` table (referenced but schema not in migrations)  
**Privacy**: No child name collection (privacy promise enforced)

### Key Architectural Patterns
- **Product Library (pl_*)**: Vocabulary tables + curated recommendation sets
- **Public Read, Admin Write**: Most tables allow public SELECT, admin-only writes
- **Published Content**: Only published sets/cards visible to public
- **Autopilot Locks**: Cards can be locked to prevent autopilot overwrites

---

## Table Inventory

### Core Tables (User Data)

#### `products`
**Purpose**: Product catalog with ratings, affiliate links, and Manus scoring  
**RLS**: Public SELECT, Admin-only INSERT/UPDATE/DELETE

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | Product name |
| `rating` | `numeric(2,1)` | CHECK `rating >= 0 AND rating <= 5` | 0-5 scale, nullable |
| `affiliate_url` | `text` | | |
| `image_url` | `text` | | |
| `why_it_matters` | `text` | | |
| `tags` | `text[]` | NOT NULL, DEFAULT `'{}'` | Array of lowercase slugs |
| `age_band` | `text` | NOT NULL | |
| `category_type_id` | `uuid` | FK → `pl_category_types(id)` ON DELETE SET NULL | Added in PL taxonomy migration |
| `amazon_rating` | `numeric(2,1)` | CHECK `0-5` | Manus scoring |
| `amazon_review_count` | `integer` | | |
| `confidence_score` | `smallint` | CHECK `0-10` | Manus scoring |
| `quality_score` | `smallint` | CHECK `0-10` | Manus scoring |
| `primary_url` | `text` | | |
| `source_name` | `text` | | |
| `source_run_id` | `text` | | |
| `manus_payload` | `jsonb` | | Raw Manus data |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `products_age_band_idx` on `age_band`
- `products_tags_gin` GIN index on `tags`
- `products_category_type_idx` on `category_type_id`
- `products_quality_score_idx` (partial, WHERE `quality_score IS NOT NULL`)
- `products_amazon_rating_idx` (partial, WHERE `amazon_rating IS NOT NULL`)
- `products_confidence_score_idx` (partial, WHERE `confidence_score IS NOT NULL`)

**Triggers**:
- `trg_products_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `products_public_read`: SELECT using `(true)` - public read
- `products_admin_insert`: INSERT with check `is_admin()`
- `products_admin_update`: UPDATE using/with check `is_admin()`
- `products_admin_delete`: DELETE using `is_admin()`

---

#### `children`
**Purpose**: Child profiles (privacy: NO name field)  
**RLS**: Owner-only CRUD (user_id = auth.uid())

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | |
| `birthdate` | `date` | | |
| `gender` | `text` | | |
| `age_band` | `text` | | |
| `preferences` | `jsonb` | NOT NULL, DEFAULT `'{}'::jsonb` | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `children_user_id_idx` on `user_id`

**Triggers**:
- `trg_children_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `children_select_own`: SELECT using `auth.uid() = user_id`
- `children_insert_own`: INSERT with check `auth.uid() = user_id`
- `children_update_own`: UPDATE using/with check `auth.uid() = user_id`
- `children_delete_own`: DELETE using `auth.uid() = user_id`

**Privacy Note**: `legacy_name` column may exist (deprecated, nullable) - do not use.

---

#### `clicks`
**Purpose**: Track product clicks/engagement  
**RLS**: Owner-only CRUD

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | |
| `product_id` | `uuid` | NOT NULL, FK → `products(id)` ON DELETE CASCADE | |
| `context` | `text` | | |
| `referer` | `text` | | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes**:
- `clicks_user_created_idx` on `(user_id, created_at DESC)`

**RLS Policies**:
- `clicks_select_own`: SELECT using `auth.uid() = user_id`
- `clicks_insert_own`: INSERT with check `auth.uid() = user_id`
- `clicks_update_own`: UPDATE using/with check `auth.uid() = user_id`
- `clicks_delete_own`: DELETE using `auth.uid() = user_id`

---

#### `site_settings`
**Purpose**: Site-wide settings (theme, branding)  
**RLS**: Public SELECT on theme, Authenticated UPDATE/INSERT

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `text` | PRIMARY KEY | |
| `theme` | `jsonb` | | Public-readable for branding |
| `updated_at` | `timestamptz` | DEFAULT `now()` | |
| `updated_by` | `uuid` | FK → `auth.users(id)` | |

**RLS Policies**:
- `site_settings_theme_public_read`: SELECT using `(true)` - public read
- `site_settings_authenticated_update`: UPDATE using/with check `auth.role() = 'authenticated'`
- `site_settings_authenticated_insert`: INSERT with check `auth.role() = 'authenticated'`

---

### Product Library Tables (pl_*)

#### `pl_age_bands`
**Purpose**: Vocabulary table for age ranges (months)  
**RLS**: Admin CRUD, Public SELECT for active bands

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `text` | PRIMARY KEY | e.g., "25-27m" |
| `label` | `text` | NOT NULL | Display label |
| `min_months` | `integer` | NOT NULL | |
| `max_months` | `integer` | NOT NULL | |
| `is_active` | `boolean` | NOT NULL, DEFAULT `true` | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Triggers**:
- `trg_pl_age_bands_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_age_bands_admin_all`: ALL operations using/with check `is_admin()`
- `pl_age_bands_public_read_active`: SELECT using `is_active = true` (added in PL-2)

---

#### `pl_moments`
**Purpose**: Vocabulary table for play moments  
**RLS**: Admin CRUD, Public SELECT for active moments

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `text` | PRIMARY KEY | |
| `label` | `text` | NOT NULL | |
| `description` | `text` | | |
| `is_active` | `boolean` | NOT NULL, DEFAULT `true` | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Triggers**:
- `trg_pl_moments_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_moments_admin_all`: ALL operations using/with check `is_admin()`
- `pl_moments_public_read_active`: SELECT using `is_active = true` (added in PL-2)

---

#### `pl_dev_tags`
**Purpose**: Vocabulary table for development tags  
**RLS**: Admin-only CRUD

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `text` | PRIMARY KEY | |
| `label` | `text` | NOT NULL | |
| `description` | `text` | | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Triggers**:
- `trg_pl_dev_tags_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_dev_tags_admin_all`: ALL operations using/with check `is_admin()`

---

#### `pl_category_types`
**Purpose**: Product category taxonomy  
**RLS**: Admin CRUD, Authenticated SELECT, Public SELECT for published content

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `slug` | `text` | NOT NULL, UNIQUE | URL-friendly identifier |
| `name` | `text` | NOT NULL, UNIQUE | Added in PL taxonomy migration |
| `label` | `text` | NOT NULL | Display label (original column) |
| `description` | `text` | | |
| `image_url` | `text` | | |
| `image_reference_url` | `text` | | |
| `safety_notes` | `text` | | |
| `min_month` | `integer` | | Added in Manus migration |
| `max_month` | `integer` | | Added in Manus migration |
| `evidence_urls` | `text[]` | | Added in Manus migration |
| `confidence_score` | `smallint` | CHECK `0-10` | Added in Manus migration |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `pl_category_types_slug_idx` on `slug`

**Triggers**:
- `trg_pl_category_types_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_category_types_admin_all`: ALL operations using/with check `is_admin()`
- `pl_category_types_authenticated_read`: SELECT using `auth.role() = 'authenticated'` (added in PL taxonomy)
- `pl_category_types_public_read_published`: SELECT using published cards check (added in PL-2)

---

#### `pl_age_moment_sets`
**Purpose**: Sets combining age band + moment (draft/published/archived)  
**RLS**: Admin CRUD, Public SELECT for published sets

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `age_band_id` | `text` | NOT NULL, FK → `pl_age_bands(id)` ON DELETE RESTRICT | |
| `moment_id` | `text` | NOT NULL, FK → `pl_moments(id)` ON DELETE RESTRICT | |
| `status` | `pl_set_status_enum` | NOT NULL, DEFAULT `'draft'` | Enum: 'draft', 'published', 'archived' |
| `headline` | `text` | | |
| `created_by` | `uuid` | FK → `auth.users(id)` ON DELETE SET NULL | |
| `published_at` | `timestamptz` | | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `pl_age_moment_sets_age_band_id_idx` on `age_band_id`
- `pl_age_moment_sets_moment_id_idx` on `moment_id`
- `pl_age_moment_sets_status_idx` on `status`

**Triggers**:
- `trg_pl_age_moment_sets_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_age_moment_sets_admin_all`: ALL operations using/with check `is_admin()`
- `pl_age_moment_sets_public_read_published`: SELECT using `status = 'published'`

---

#### `pl_reco_cards`
**Purpose**: Recommendation cards within a set (obvious/nearby/surprise lanes)  
**RLS**: Admin CRUD, Public SELECT for cards in published sets

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `set_id` | `uuid` | NOT NULL, FK → `pl_age_moment_sets(id)` ON DELETE CASCADE | |
| `lane` | `pl_lane_enum` | NOT NULL | Enum: 'obvious', 'nearby', 'surprise' |
| `rank` | `integer` | NOT NULL | Order within lane |
| `category_type_id` | `uuid` | FK → `pl_category_types(id)` ON DELETE SET NULL | |
| `product_id` | `uuid` | FK → `products(id)` ON DELETE SET NULL | |
| `because` | `text` | NOT NULL | Recommendation rationale |
| `why_tags` | `text[]` | | |
| `is_locked` | `boolean` | NOT NULL, DEFAULT `false` | Autopilot lock (added in PL autopilot) |
| `locked_at` | `timestamptz` | | Added in PL autopilot |
| `locked_by` | `uuid` | FK → `auth.users(id)` ON DELETE SET NULL | Added in PL autopilot |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `pl_reco_cards_set_id_idx` on `set_id`
- `pl_reco_cards_lane_idx` on `lane`
- `pl_reco_cards_is_locked_idx` (partial, WHERE `is_locked = true`)

**Triggers**:
- `trg_pl_reco_cards_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_reco_cards_admin_all`: ALL operations using/with check `is_admin()`
- `pl_reco_cards_public_read_published`: SELECT using published set check (subquery)

---

#### `pl_evidence` (General-purpose)
**Purpose**: Evidence/sources for category_types and products  
**RLS**: Authenticated SELECT only (writes via service role)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `entity_type` | `text` | NOT NULL, CHECK `IN ('category_type', 'product')` | |
| `entity_id` | `uuid` | NOT NULL | References category_type or product |
| `source_type` | `text` | NOT NULL | |
| `url` | `text` | NOT NULL | |
| `notes` | `text` | | |
| `weight` | `smallint` | | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes**:
- `pl_evidence_entity_idx` on `(entity_type, entity_id)`
- `pl_evidence_source_type_idx` on `source_type`

**RLS Policies**:
- `pl_evidence_authenticated_read`: SELECT using `auth.role() = 'authenticated'`

**Note**: If old `pl_evidence` table with `card_id` existed, it was renamed to `pl_card_evidence` (see below).

---

#### `pl_card_evidence` (Legacy, if exists)
**Purpose**: Evidence for recommendation cards (legacy structure)  
**Note**: Created if old `pl_evidence` table existed before Manus migration

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY | |
| `card_id` | `uuid` | NOT NULL, FK → `pl_reco_cards(id)` ON DELETE CASCADE | |
| `source_type` | `text` | NOT NULL | |
| `url` | `text` | | |
| `quote_snippet` | `text` | | |
| `captured_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `confidence` | `integer` | NOT NULL, CHECK `1-5` | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS Policies** (if exists):
- `pl_card_evidence_admin_all`: ALL operations using/with check `is_admin()`
- `pl_card_evidence_public_read_published`: SELECT using published set check

---

#### `pl_pool_items`
**Purpose**: Product type pool management  
**RLS**: Admin-only CRUD

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `age_band_id` | `text` | NOT NULL, FK → `pl_age_bands(id)` ON DELETE CASCADE | |
| `moment_id` | `text` | NOT NULL, FK → `pl_moments(id)` ON DELETE CASCADE | |
| `category_type_id` | `uuid` | FK → `pl_category_types(id)` ON DELETE SET NULL | |
| `note` | `text` | | |
| `created_by` | `uuid` | FK → `auth.users(id)` ON DELETE SET NULL | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `pl_pool_items_age_band_moment_idx` on `(age_band_id, moment_id)`
- `pl_pool_items_category_type_idx` on `category_type_id`

**Triggers**:
- `trg_pl_pool_items_updated_at`: Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_pool_items_admin_all`: ALL operations using/with check `is_admin()`

---

#### `pl_need_ux_labels`
**Purpose**: UX wrapper mapping for development needs (brand director mappings)  
**RLS**: Not explicitly set (likely admin-only, check live DB)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | |
| `development_need_id` | `uuid` | NOT NULL, FK → `pl_development_needs(id)` ON DELETE CASCADE | |
| `ux_label` | `text` | NOT NULL | e.g., "Shapes & colours" |
| `ux_slug` | `text` | NOT NULL | e.g., "shapes-colours" |
| `ux_description` | `text` | | |
| `is_primary` | `boolean` | NOT NULL, DEFAULT `true` | One primary per need |
| `sort_order` | `integer` | | |
| `is_active` | `boolean` | NOT NULL, DEFAULT `true` | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `pl_need_ux_labels_primary_per_need_idx` (unique, WHERE `is_primary = true`)
- `pl_need_ux_labels_active_slug_idx` (unique, WHERE `is_active = true`)
- `pl_need_ux_labels_development_need_id_idx` on `development_need_id`

**Triggers**:
- `trg_pl_need_ux_labels_updated_at`: Updates `updated_at` before UPDATE

**Seeded Data**: 12 brand director mappings for 25-27m age band (see migration file for details)

---

### Referenced but Schema Not in Migrations

The following tables are referenced in code/RLS policies but their CREATE TABLE statements are not in the migration files. They may exist in the live database or be created elsewhere:

#### `user_roles`
**Referenced in**: RLS policies, admin layout, `is_admin()` function  
**Expected Structure** (inferred):
- `user_id` (uuid, FK → auth.users)
- `role` (text, likely 'admin')
- Possibly: `created_at`, `updated_at`

**Usage**: Admin role checking for RLS policies

---

#### `waitlist`
**Referenced in**: SECURITY.md  
**Expected RLS**: Anon INSERT allowed, no SELECT policy (blocks reads)

---

#### `play_idea`
**Referenced in**: SECURITY.md  
**Expected RLS**: Public SELECT allowed (anon)

---

#### `pl_development_needs`
**Referenced in**: `pl_need_ux_labels` migration  
**Expected Structure** (inferred):
- `id` (uuid, PRIMARY KEY)
- `slug` (text, unique, nullable - added by migration)
- Other columns unknown

**Note**: Migration adds `slug` column if table exists

---

## Enum Types

### `pl_set_status_enum`
Values: `'draft'`, `'published'`, `'archived'`  
Used by: `pl_age_moment_sets.status`

### `pl_lane_enum`
Values: `'obvious'`, `'nearby'`, `'surprise'`  
Used by: `pl_reco_cards.lane`

---

## Functions

### `public.set_updated_at()`
**Purpose**: Trigger function to update `updated_at` timestamp  
**Language**: `plpgsql`  
**Returns**: `trigger`

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

**Used by**: All tables with `updated_at` columns (via triggers)

---

### `public.is_admin()`
**Purpose**: Check if current user has admin role  
**Language**: `plpgsql`  
**Security**: `SECURITY DEFINER`  
**Returns**: `boolean`

```sql
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
```

**Used by**: RLS policies for admin-only operations

---

## Triggers Summary

| Trigger | Table | Event | Function |
|---------|-------|-------|----------|
| `trg_products_updated_at` | `products` | BEFORE UPDATE | `set_updated_at()` |
| `trg_children_updated_at` | `children` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_age_bands_updated_at` | `pl_age_bands` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_moments_updated_at` | `pl_moments` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_dev_tags_updated_at` | `pl_dev_tags` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_category_types_updated_at` | `pl_category_types` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_age_moment_sets_updated_at` | `pl_age_moment_sets` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_reco_cards_updated_at` | `pl_reco_cards` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_evidence_updated_at` | `pl_evidence` (old) | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_pool_items_updated_at` | `pl_pool_items` | BEFORE UPDATE | `set_updated_at()` |
| `trg_pl_need_ux_labels_updated_at` | `pl_need_ux_labels` | BEFORE UPDATE | `set_updated_at()` |

---

## Foreign Key Relationships

### Core Tables
- `children.user_id` → `auth.users(id)` ON DELETE CASCADE
- `clicks.user_id` → `auth.users(id)` ON DELETE CASCADE
- `clicks.product_id` → `products(id)` ON DELETE CASCADE
- `products.category_type_id` → `pl_category_types(id)` ON DELETE SET NULL

### Product Library Tables
- `pl_age_moment_sets.age_band_id` → `pl_age_bands(id)` ON DELETE RESTRICT
- `pl_age_moment_sets.moment_id` → `pl_moments(id)` ON DELETE RESTRICT
- `pl_age_moment_sets.created_by` → `auth.users(id)` ON DELETE SET NULL
- `pl_reco_cards.set_id` → `pl_age_moment_sets(id)` ON DELETE CASCADE
- `pl_reco_cards.category_type_id` → `pl_category_types(id)` ON DELETE SET NULL
- `pl_reco_cards.product_id` → `products(id)` ON DELETE SET NULL
- `pl_reco_cards.locked_by` → `auth.users(id)` ON DELETE SET NULL
- `pl_evidence.entity_id` → (polymorphic: `pl_category_types` or `products`)
- `pl_card_evidence.card_id` → `pl_reco_cards(id)` ON DELETE CASCADE (if exists)
- `pl_pool_items.age_band_id` → `pl_age_bands(id)` ON DELETE CASCADE
- `pl_pool_items.moment_id` → `pl_moments(id)` ON DELETE CASCADE
- `pl_pool_items.category_type_id` → `pl_category_types(id)` ON DELETE SET NULL
- `pl_pool_items.created_by` → `auth.users(id)` ON DELETE SET NULL
- `pl_need_ux_labels.development_need_id` → `pl_development_needs(id)` ON DELETE CASCADE
- `site_settings.updated_by` → `auth.users(id)`

---

## Check Constraints

| Table | Constraint | Rule |
|-------|------------|------|
| `products` | `products_rating_check` | `rating IS NULL OR (rating >= 0 AND rating <= 5)` |
| `products` | `products_quality_score_check` | `quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 10)` |
| `products` | `products_confidence_score_check` | `confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 10)` |
| `products` | `products_amazon_rating_check` | `amazon_rating IS NULL OR (amazon_rating >= 0 AND amazon_rating <= 5)` |
| `pl_category_types` | `pl_category_types_confidence_score_check` | `confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 10)` |
| `pl_evidence` | `pl_evidence_entity_type_check` | `entity_type IN ('category_type', 'product')` |
| `pl_card_evidence` (if exists) | `pl_evidence_confidence_check` | `confidence >= 1 AND confidence <= 5` |

---

## Unique Constraints

| Table | Constraint | Columns |
|-------|------------|---------|
| `pl_category_types` | `pl_category_types_slug_unique` | `slug` |
| `pl_category_types` | `pl_category_types_name_unique` | `name` |
| `pl_need_ux_labels` | `pl_need_ux_labels_primary_per_need_idx` | `development_need_id` (WHERE `is_primary = true`) |
| `pl_need_ux_labels` | `pl_need_ux_labels_active_slug_idx` | `ux_slug` (WHERE `is_active = true`) |
| `pl_development_needs` (if exists) | `pl_development_needs_slug_unique` | `slug` (WHERE `slug IS NOT NULL`) |

---

## RLS Policy Summary by Table

| Table | Public SELECT | Authenticated SELECT | Admin CRUD | Owner CRUD | Notes |
|-------|--------------|---------------------|------------|------------|-------|
| `products` | ✅ | ✅ | ✅ | ❌ | Public read, admin write |
| `children` | ❌ | ❌ | ❌ | ✅ | Owner-only |
| `clicks` | ❌ | ❌ | ❌ | ✅ | Owner-only |
| `site_settings` | ✅ (theme only) | ✅ | ✅ | ❌ | Public theme read |
| `pl_age_bands` | ✅ (active only) | ✅ | ✅ | ❌ | Active bands public |
| `pl_moments` | ✅ (active only) | ✅ | ✅ | ❌ | Active moments public |
| `pl_dev_tags` | ❌ | ❌ | ✅ | ❌ | Admin-only |
| `pl_category_types` | ✅ (published refs) | ✅ | ✅ | ❌ | Published refs public |
| `pl_age_moment_sets` | ✅ (published) | ✅ | ✅ | ❌ | Published sets public |
| `pl_reco_cards` | ✅ (published sets) | ✅ | ✅ | ❌ | Published cards public |
| `pl_evidence` | ❌ | ✅ | ✅ | ❌ | Authenticated read |
| `pl_card_evidence` | ✅ (published) | ✅ | ✅ | ❌ | If exists |
| `pl_pool_items` | ❌ | ❌ | ✅ | ❌ | Admin-only |
| `pl_need_ux_labels` | ❓ | ❓ | ❓ | ❌ | Check live DB |

---

## Extensions

- `pgcrypto`: For `gen_random_uuid()` function

---

## Sample Data Queries

To get row counts and sample data from the live database, run:

```sql
-- Row counts per table
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Sample rows (example for products)
SELECT * FROM public.products LIMIT 5;

-- Sample rows for pl_* tables
SELECT * FROM public.pl_age_bands LIMIT 5;
SELECT * FROM public.pl_moments LIMIT 5;
SELECT * FROM public.pl_category_types LIMIT 5;
SELECT * FROM public.pl_age_moment_sets WHERE status = 'published' LIMIT 5;
SELECT * FROM public.pl_reco_cards LIMIT 5;
```

---

## Migration History

1. **2025-11-04**: Core schema (products, children, clicks)
2. **2025-12-20**: Privacy fix (remove child name)
3. **2025-12-30**: Site settings (theme anonymous access)
4. **2026-01-04**: PL-0 (Product Library foundation)
5. **2026-01-04**: PL-1 (Pool items)
6. **2026-01-05**: PL Taxonomy (category types + products link)
7. **2026-01-05**: Remove rating min constraint
8. **2026-01-05**: PL-2 (Public read policies)
9. **2026-01-06**: Manus scoring and evidence
10. **2026-01-06**: PL Autopilot locks
11. **2026-01-14**: PL Need UX Labels

---

## Security Notes

1. **Admin Access**: Controlled via `user_roles` table (role='admin') + email allowlist in application code
2. **Privacy**: No child name collection (privacy promise)
3. **Public Content**: Only published sets/cards visible to public
4. **Service Role**: Used for admin writes via API routes (never exposed to client)
5. **RLS**: All public tables have RLS enabled

---

## Questions for Live Database Verification

1. Does `user_roles` table exist? What is its exact schema?
2. Does `waitlist` table exist? What is its schema?
3. Does `play_idea` table exist? What is its schema?
4. Does `pl_development_needs` table exist? What is its full schema?
5. Does `pl_card_evidence` table exist (legacy)?
6. What are the actual row counts per table?
7. What are the RLS policies on `pl_need_ux_labels`?
8. Are there any additional tables not documented in migrations?

---

## Next Steps

1. **Query Live DB**: Run row count queries and sample data queries
2. **Verify Missing Tables**: Check for `user_roles`, `waitlist`, `play_idea`, `pl_development_needs`
3. **Document RLS**: Verify all RLS policies match this document
4. **Update This Doc**: Add any missing tables/policies found

---

_End of Database Briefing_



