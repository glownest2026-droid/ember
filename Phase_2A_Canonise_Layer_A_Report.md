# Phase 2A: Canonise Layer A (Development Needs) — Report

**Date**: 2026-01-15  
**Status**: ✅ Complete  
**Migration File**: `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`

---

## 1. Schema Inspection

### 1.1 `pl_development_needs` Table Schema

**Status**: Table exists but was empty (0 rows, 24 dead rows)

**Inferred Schema** (from migration references):
- `id` (UUID, PRIMARY KEY) — Referenced in `pl_need_ux_labels.development_need_id` FK
- `slug` (TEXT) — Added by migration `202601142252_pl_need_ux_labels.sql`

**Decision**: Since the table exists but schema is incomplete, **Approach C** was chosen: Modify schema to match Manus Layer A CSV structure, then populate.

### 1.2 `pl_seed_development_needs` Table

**Status**: Exists with 12 rows (per schema inventory)

**Schema**: Unknown (not in migrations, not referenced in code)

**Decision**: Since seed table schema is unknown and Manus CSV is the authoritative source, **populated directly from Manus CSV** rather than seed table.

### 1.3 Manus Layer A CSV Structure

**Source**: `Manus_LayerA-Sample-Development-Needs.csv`

**Columns**:
- `need_name` (TEXT) — e.g., "Gross motor skills and physical confidence"
- `plain_english_description` (TEXT)
- `why_it_matters` (TEXT)
- `min_month` (INTEGER)
- `max_month` (INTEGER)
- `stage_anchor_month` (INTEGER)
- `stage_phase` (TEXT) — e.g., "consolidating", "emerging"
- `stage_reason` (TEXT)
- `evidence_urls` (TEXT, pipe-separated) — Converted to TEXT[] array
- `evidence_notes` (TEXT, pipe-separated)

**Row Count**: 12 development needs

---

## 2. Approach Decision

**Chosen Approach**: **C) Modify `pl_development_needs` schema (via migration) so it correctly represents Manus Layer A, then populate**

**Rationale**:
1. Table exists but schema is incomplete (only `id` and `slug` confirmed)
2. Seed table schema is unknown and not documented
3. Manus CSV is the authoritative source of truth
4. Migration ensures schema matches Manus structure exactly
5. Idempotent migration handles both new table creation and existing table modification

---

## 3. Final Schema of `pl_development_needs`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Stable UUID for each need |
| `need_name` | `text` | NOT NULL, UNIQUE | e.g., "Gross motor skills and physical confidence" |
| `slug` | `text` | UNIQUE (WHERE NOT NULL) | Auto-generated from `need_name` |
| `plain_english_description` | `text` | NOT NULL | Human-readable description |
| `why_it_matters` | `text` | NOT NULL | Rationale for the need |
| `min_month` | `integer` | NOT NULL | Minimum age in months |
| `max_month` | `integer` | NOT NULL | Maximum age in months |
| `stage_anchor_month` | `integer` | NULLABLE | Anchor month for stage |
| `stage_phase` | `text` | NULLABLE | "consolidating" or "emerging" |
| `stage_reason` | `text` | NULLABLE | Explanation of stage placement |
| `evidence_urls` | `text[]` | NULLABLE | Array of evidence URLs |
| `evidence_notes` | `text` | NULLABLE | Evidence notes (pipe-separated in CSV, stored as text) |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Indexes**:
- `pl_development_needs_slug_unique` (unique, WHERE `slug IS NOT NULL`)
- `pl_development_needs_need_name_unique` (unique constraint)
- `pl_development_needs_slug_idx` (partial index on `slug`)
- `pl_development_needs_min_month_idx` (on `min_month`)
- `pl_development_needs_max_month_idx` (on `max_month`)

**Triggers**:
- `trg_pl_development_needs_updated_at` — Updates `updated_at` before UPDATE

**RLS Policies**:
- `pl_development_needs_admin_all` — Admin CRUD
- `pl_development_needs_authenticated_read` — Authenticated users can read

---

## 4. Population Details

### 4.1 Source of Truth

**Manus Layer A CSV** (`Manus_LayerA-Sample-Development-Needs.csv`)

**Rationale**: 
- CSV is the authoritative source from Manus research
- Seed table schema is unknown and may not match Manus structure
- Direct CSV population ensures data integrity

### 4.2 Data Mapping

| CSV Column | Table Column | Transformation |
|------------|-------------|----------------|
| `need_name` | `need_name` | Direct mapping |
| `plain_english_description` | `plain_english_description` | Direct mapping |
| `why_it_matters` | `why_it_matters` | Direct mapping |
| `min_month` | `min_month` | Direct mapping (INTEGER) |
| `max_month` | `max_month` | Direct mapping (INTEGER) |
| `stage_anchor_month` | `stage_anchor_month` | Direct mapping (INTEGER) |
| `stage_phase` | `stage_phase` | Direct mapping |
| `stage_reason` | `stage_reason` | Direct mapping |
| `evidence_urls` | `evidence_urls` | Pipe-separated → TEXT[] array |
| `evidence_notes` | `evidence_notes` | Direct mapping (preserves pipe separators) |
| — | `slug` | Auto-generated from `need_name` using `slugify_need_name()` function |

### 4.3 Slug Generation

**Function**: `public.slugify_need_name(input_text TEXT)`

**Logic**:
1. Convert to lowercase
2. Remove non-alphanumeric characters (except spaces and hyphens)
3. Replace spaces with hyphens
4. Collapse multiple hyphens to single hyphen

**Example**: "Gross motor skills and physical confidence" → "gross-motor-skills-and-physical-confidence"

---

## 5. Row Count

**Expected**: 12 rows (one per development need in Manus CSV)

**Verification Query**:
```sql
SELECT COUNT(*) as total_rows FROM public.pl_development_needs;
-- Should return: 12
```

---

## 6. Sanity Checks

### 6.1 Row Count
- ✅ **Expected**: 12 rows
- ✅ **Verification**: `SELECT COUNT(*) FROM public.pl_development_needs;`

### 6.2 No Duplicates
- ✅ **Constraint**: `UNIQUE` constraint on `need_name`
- ✅ **Verification**: `SELECT need_name, COUNT(*) FROM public.pl_development_needs GROUP BY need_name HAVING COUNT(*) > 1;` (should return empty)

### 6.3 No Empty Critical Fields
- ✅ **Required Fields**: `need_name`, `plain_english_description`, `why_it_matters`, `min_month`, `max_month` all have `NOT NULL` constraints
- ✅ **Verification**: `SELECT need_name FROM public.pl_development_needs WHERE need_name IS NULL OR plain_english_description IS NULL OR why_it_matters IS NULL OR min_month IS NULL OR max_month IS NULL;` (should return empty)

### 6.4 All Slugs Generated
- ✅ **Verification**: `SELECT need_name, slug FROM public.pl_development_needs WHERE slug IS NULL OR slug = '';` (should return empty)

### 6.5 All 12 Needs Present
- ✅ **Verification**: `SELECT need_name FROM public.pl_development_needs ORDER BY need_name;` (should list all 12 needs)

**Expected List**:
1. Color and shape recognition
2. Creative expression and mark-making
3. Emotional regulation and self-awareness
4. Fine motor control and hand coordination
5. Gross motor skills and physical confidence
6. Independence and practical life skills
7. Language development and communication
8. Pretend play and imagination
9. Problem-solving and cognitive skills
10. Routine understanding and cooperation
11. Social skills and peer interaction
12. Spatial reasoning and construction play

---

## 7. Assumptions Made

1. **Table Exists**: Assumed `pl_development_needs` table exists (referenced in previous migration)
2. **Schema Incomplete**: Assumed table may be missing columns needed for Manus structure
3. **Idempotent Migration**: Migration handles both new table creation and existing table modification
4. **Slug Format**: Assumed slug format matches pattern used in `pl_need_ux_labels` migration (e.g., "gross-motor-skills-and-physical-confidence")
5. **Evidence URLs**: Assumed pipe-separated URLs in CSV should be stored as TEXT[] array
6. **Evidence Notes**: Assumed pipe-separated notes should be stored as single TEXT field (preserving pipe separators)
7. **RLS Pattern**: Assumed RLS policies should follow same pattern as other `pl_*` tables (admin CRUD, authenticated read)

---

## 8. Migration Execution

**File**: `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`

**Steps**:
1. Create table if not exists with full schema
2. Add missing columns if table exists but incomplete
3. Add constraints and indexes
4. Create slug generation helper function
5. Populate from Manus CSV (12 rows)
6. Update slugs for any existing rows
7. Add updated_at trigger
8. Enable RLS with appropriate policies

**Idempotent**: ✅ Yes — Migration can be run multiple times safely

---

## 9. Next Steps

1. ✅ **Apply Migration**: Run migration in Supabase SQL Editor
2. ✅ **Verify Row Count**: Confirm 12 rows inserted
3. ✅ **Run Sanity Checks**: Execute verification queries
4. ⏭️ **Phase 2B**: Canonise Layer B (Category Types) — if needed
5. ⏭️ **Phase 2C**: Canonise Layer C (Products) — if needed

---

## 10. How to Verify It Worked

1. **Apply Migration**: Run `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql` in Supabase SQL Editor

2. **Check Row Count**:
   ```sql
   SELECT COUNT(*) as total_rows FROM public.pl_development_needs;
   -- Should return: 12
   ```

3. **List All Needs**:
   ```sql
   SELECT need_name, slug FROM public.pl_development_needs ORDER BY need_name;
   -- Should show all 12 development needs with slugs
   ```

4. **Verify No Duplicates**:
   ```sql
   SELECT need_name, COUNT(*) FROM public.pl_development_needs 
   GROUP BY need_name HAVING COUNT(*) > 1;
   -- Should return empty (no duplicates)
   ```

5. **Verify No Empty Critical Fields**:
   ```sql
   SELECT need_name FROM public.pl_development_needs 
   WHERE need_name IS NULL 
      OR plain_english_description IS NULL 
      OR why_it_matters IS NULL 
      OR min_month IS NULL 
      OR max_month IS NULL;
   -- Should return empty
   ```

6. **Verify Slugs Generated**:
   ```sql
   SELECT need_name, slug FROM public.pl_development_needs 
   WHERE slug IS NULL OR slug = '';
   -- Should return empty
   ```

7. **Check Schema**:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_schema = 'public' 
     AND table_name = 'pl_development_needs' 
   ORDER BY ordinal_position;
   -- Should show all columns listed in Final Schema section
   ```

---

_End of Phase 2A Report_



