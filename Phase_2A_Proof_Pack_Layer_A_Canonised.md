# Phase 2A Proof Pack — Layer A Canonised

**Date**: 2026-01-15  
**Migration File**: `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`  
**Branch**: `feat/pl-admin-4-merch-office-v1`  
**Status**: Migration file created, ready for application

---

## 1. Repo Proof

### 1.1 Migration File Location

✅ **Confirmed**: Migration file exists at:
```
supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql
```

### 1.2 Git Status

- **Current Branch**: `feat/pl-admin-4-merch-office-v1`
- **File Status**: Untracked (new file, not yet committed)
- **Action Required**: File needs to be committed and pushed

### 1.3 Migration File Excerpts

#### First ~60 Lines (DDL + Schema Creation)

```sql
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
```

#### Last ~60 Lines (Inserts + RLS Setup)

```sql
    INSERT INTO public.pl_development_needs (
      need_name, slug, plain_english_description, why_it_matters,
      min_month, max_month, stage_anchor_month, stage_phase, stage_reason,
      evidence_urls, evidence_notes
    ) VALUES (
      'Creative expression and mark-making',
      'creative-expression-and-mark-making',
      'Scribbling, painting, and exploring art materials to express ideas and feelings.',
      'Develops fine motor skills, self-expression, and foundation for writing; supports emotional processing.',
      24, 36, 26, 'emerging',
      'Children begin purposeful mark-making and exploring art materials with increasing interest and control during this period.',
      ARRAY['https://cambspborochildrenshealth.nhs.uk/child-development-and-growing-up/milestones/2-years/', 'https://lovevery.co.uk/products/the-play-kits-the-helper'],
      'NHS lists crayons as appropriate activity for 2-year-olds.|Lovevery includes no-mess painting kit for creative expression at 25-27 months.'
    );

  END IF;
END $$;

-- ============================================================================
-- PART 7: UPDATE SLUGS FOR EXISTING ROWS (if any exist without slugs)
-- ============================================================================

UPDATE public.pl_development_needs
SET slug = public.slugify_need_name(need_name)
WHERE slug IS NULL OR slug = '';

-- ============================================================================
-- PART 8: ADD UPDATED_AT TRIGGER
-- ============================================================================

DROP TRIGGER IF EXISTS trg_pl_development_needs_updated_at ON public.pl_development_needs;
CREATE TRIGGER trg_pl_development_needs_updated_at BEFORE UPDATE ON public.pl_development_needs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 9: ENABLE RLS
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

-- ============================================================================
-- PART 10: SANITY CHECKS (verification queries)
-- ============================================================================

-- Run these after migration to verify:
-- SELECT COUNT(*) as total_rows FROM public.pl_development_needs; -- Should be 12
-- SELECT need_name, slug FROM public.pl_development_needs ORDER BY need_name; -- Should show all 12 needs
-- SELECT need_name FROM public.pl_development_needs WHERE need_name IS NULL OR plain_english_description IS NULL OR why_it_matters IS NULL; -- Should be empty
-- SELECT need_name, COUNT(*) FROM public.pl_development_needs GROUP BY need_name HAVING COUNT(*) > 1; -- Should be empty (no duplicates)
```

---

## 2. Migration Application

### 2.1 Application Status

⚠️ **Note**: Migration has not been applied yet. The file is ready for execution in Supabase SQL Editor.

### 2.2 Idempotency Test

**To Prove Idempotency**:
1. Apply migration first time → Should succeed and insert 12 rows
2. Re-run migration → Should succeed without errors (no duplicate key violations)
3. Verify row count remains 12 → Confirms idempotency

**Expected Behavior**:
- First run: Creates table, adds columns, inserts 12 rows
- Second run: Skips inserts (IF NOT EXISTS check), updates any NULL slugs, no errors

---

## 3. Verification Queries

**Note**: These queries are provided in `supabase/sql/verify_phase2a_development_needs.sql` for easy execution.

### 3.1 A) Schema Verification

**Query**:
```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'pl_development_needs'
ORDER BY ordinal_position;
```

**Expected Output** (14 columns):
| column_name | data_type | is_nullable | column_default |
|-------------|-----------|-------------|----------------|
| id | uuid | NO | gen_random_uuid() |
| need_name | text | NO | NULL |
| slug | text | YES | NULL |
| plain_english_description | text | NO | NULL |
| why_it_matters | text | NO | NULL |
| min_month | integer | NO | NULL |
| max_month | integer | NO | NULL |
| stage_anchor_month | integer | YES | NULL |
| stage_phase | text | YES | NULL |
| stage_reason | text | YES | NULL |
| evidence_urls | ARRAY | YES | NULL |
| evidence_notes | text | YES | NULL |
| created_at | timestamp with time zone | NO | now() |
| updated_at | timestamp with time zone | NO | now() |

---

### 3.2 B) Row Count

**Query**:
```sql
SELECT COUNT(*) as total_rows FROM public.pl_development_needs;
```

**Expected Output**:
| total_rows |
|------------|
| 12 |

---

### 3.3 C) Sample Rows (Sanity)

**Query**:
```sql
SELECT 
  need_name, 
  slug, 
  min_month, 
  max_month, 
  stage_anchor_month
FROM public.pl_development_needs
ORDER BY need_name
LIMIT 5;
```

**Expected Output** (first 5 alphabetically):
| need_name | slug | min_month | max_month | stage_anchor_month |
|-----------|------|-----------|-----------|-------------------|
| Color and shape recognition | color-and-shape-recognition | 24 | 36 | 27 |
| Creative expression and mark-making | creative-expression-and-mark-making | 24 | 36 | 26 |
| Emotional regulation and self-awareness | emotional-regulation-and-self-awareness | 24 | 36 | 26 |
| Fine motor control and hand coordination | fine-motor-control-and-hand-coordination | 24 | 36 | 26 |
| Gross motor skills and physical confidence | gross-motor-skills-and-physical-confidence | 24 | 36 | 26 |

---

### 3.4 D) Constraints / Uniqueness

#### D1) No Duplicate need_name

**Query**:
```sql
SELECT need_name, COUNT(*) as c
FROM public.pl_development_needs
GROUP BY need_name
HAVING COUNT(*) > 1;
```

**Expected Output**: 
**Empty result set** (no rows) — confirms UNIQUE constraint on `need_name`

#### D2) Slug Uniqueness

**Query**:
```sql
SELECT slug, COUNT(*) as c
FROM public.pl_development_needs
WHERE slug IS NOT NULL
GROUP BY slug
HAVING COUNT(*) > 1;
```

**Expected Output**: 
**Empty result set** (no rows) — confirms unique index on `slug`

---

### 3.5 E) Null Checks for Required Fields

**Query**:
```sql
SELECT
  SUM((need_name IS NULL)::int) as null_need_name,
  SUM((plain_english_description IS NULL)::int) as null_desc,
  SUM((why_it_matters IS NULL)::int) as null_why,
  SUM((min_month IS NULL)::int) as null_min,
  SUM((max_month IS NULL)::int) as null_max
FROM public.pl_development_needs;
```

**Expected Output**:
| null_need_name | null_desc | null_why | null_min | null_max |
|----------------|-----------|----------|----------|----------|
| 0 | 0 | 0 | 0 | 0 |

**All zeros** — confirms NOT NULL constraints are enforced

---

### 3.6 F) Evidence URLs Sanity

**Query**:
```sql
SELECT 
  need_name, 
  array_length(evidence_urls, 1) as n_urls
FROM public.pl_development_needs
ORDER BY n_urls DESC NULLS LAST
LIMIT 5;
```

**Expected Output** (all needs should have 2 URLs):
| need_name | n_urls |
|-----------|--------|
| [Any need name] | 2 |
| [Any need name] | 2 |
| [Any need name] | 2 |
| [Any need name] | 2 |
| [Any need name] | 2 |

**All rows should show `n_urls = 2`** — confirms evidence_urls array is populated correctly

---

### 3.7 G) RLS Verification

#### G1) RLS Enabled Check

**Query**:
```sql
SELECT relrowsecurity as rls_enabled
FROM pg_class
WHERE oid = 'public.pl_development_needs'::regclass;
```

**Expected Output**:
| rls_enabled |
|-------------|
| true |

**Should return `true`** — confirms RLS is enabled

#### G2) RLS Policies

**Query**:
```sql
SELECT 
  polname as policy_name,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'pl_development_needs'
ORDER BY polname;
```

**Expected Output** (2 policies):
| policy_name | permissive | roles | command | using_expression | with_check_expression |
|-------------|------------|-------|---------|------------------|----------------------|
| pl_development_needs_admin_all | PERMISSIVE | {authenticated} | ALL | (is_admin()) | (is_admin()) |
| pl_development_needs_authenticated_read | PERMISSIVE | {authenticated} | SELECT | (auth.role() = 'authenticated'::text) | NULL |

**Should show 2 policies**:
1. `pl_development_needs_admin_all` — Admin CRUD
2. `pl_development_needs_authenticated_read` — Authenticated read

---

### 3.8 H) All 12 Needs Present

**Query**:
```sql
SELECT need_name, slug, min_month, max_month
FROM public.pl_development_needs
ORDER BY need_name;
```

**Expected Output** (12 rows):
| need_name | slug | min_month | max_month |
|-----------|------|-----------|-----------|
| Color and shape recognition | color-and-shape-recognition | 24 | 36 |
| Creative expression and mark-making | creative-expression-and-mark-making | 24 | 36 |
| Emotional regulation and self-awareness | emotional-regulation-and-self-awareness | 24 | 36 |
| Fine motor control and hand coordination | fine-motor-control-and-hand-coordination | 24 | 36 |
| Gross motor skills and physical confidence | gross-motor-skills-and-physical-confidence | 24 | 36 |
| Independence and practical life skills | independence-and-practical-life-skills | 24 | 36 |
| Language development and communication | language-development-and-communication | 24 | 36 |
| Pretend play and imagination | pretend-play-and-imagination | 24 | 36 |
| Problem-solving and cognitive skills | problem-solving-and-cognitive-skills | 24 | 36 |
| Routine understanding and cooperation | routine-understanding-and-cooperation | 24 | 36 |
| Social skills and peer interaction | social-skills-and-peer-interaction | 24 | 36 |
| Spatial reasoning and construction play | spatial-reasoning-and-construction-play | 24 | 36 |

**Should show exactly 12 rows** — confirms all Manus Layer A needs are present

---

## 4. Issues & Fixes

### 4.1 Database Access Limitation

**Issue**: Cannot directly access Supabase database to run verification queries automatically.

**Status**: ⚠️ **Limitation acknowledged**

**Workaround**: 
- Verification queries provided in `supabase/sql/verify_phase2a_development_needs.sql`
- Expected results documented above
- Queries can be run in Supabase SQL Editor after migration application

### 4.2 Migration Not Yet Applied

**Issue**: Migration file exists but has not been applied to database.

**Status**: ⚠️ **Pending application**

**Action Required**: 
1. Open Supabase SQL Editor
2. Run `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`
3. Verify success (no errors)
4. Run verification queries from `supabase/sql/verify_phase2a_development_needs.sql`

### 4.3 File Not Committed

**Issue**: Migration file is untracked (not yet committed to git).

**Status**: ⚠️ **Pending commit**

**Action Required**:
```bash
git add supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql
git add supabase/sql/verify_phase2a_development_needs.sql
git commit -m "feat(phase2a): canonise Layer A development needs"
git push
```

---

## 5. Summary

### 5.1 Migration Status

- ✅ **Migration File Created**: `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`
- ✅ **Verification Queries Created**: `supabase/sql/verify_phase2a_development_needs.sql`
- ⚠️ **Migration Not Applied**: Pending execution in Supabase SQL Editor
- ⚠️ **File Not Committed**: Pending git commit

### 5.2 Expected Results After Application

- **Row Count**: 12 development needs
- **Schema**: 14 columns (id, need_name, slug, plain_english_description, why_it_matters, min_month, max_month, stage_anchor_month, stage_phase, stage_reason, evidence_urls, evidence_notes, created_at, updated_at)
- **Constraints**: UNIQUE on `need_name` and `slug`
- **RLS**: Enabled with 2 policies (admin CRUD, authenticated read)
- **Data Quality**: No NULLs in required fields, no duplicates, all slugs generated

### 5.3 Next Steps

1. **Apply Migration**: Run migration in Supabase SQL Editor
2. **Run Verification**: Execute queries from `verify_phase2a_development_needs.sql`
3. **Commit Files**: Add and commit migration + verification files to git
4. **Verify Idempotency**: Re-run migration to confirm no errors

---

## 6. How to Verify It Worked

1. **Apply Migration**:
   - Open Supabase Dashboard → SQL Editor
   - Paste contents of `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`
   - Execute
   - Verify: Should complete without errors

2. **Run Verification Queries**:
   - Open `supabase/sql/verify_phase2a_development_needs.sql`
   - Execute each section
   - Compare results with expected outputs above

3. **Test Idempotency**:
   - Re-run the migration
   - Verify: Should complete without errors
   - Check row count: Should still be 12

4. **Commit Files**:
   ```bash
   git add supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql
   git add supabase/sql/verify_phase2a_development_needs.sql
   git commit -m "feat(phase2a): canonise Layer A development needs"
   git push
   ```

---

_End of Phase 2A Proof Pack_



