# Database Migrations Guide

**Project Ember — Supabase Migration Workflow**

This guide explains how to work with database migrations using Supabase CLI.

---

## Prerequisites

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   # OR
   brew install supabase/tap/supabase
   ```

2. **Verify installation**:
   ```bash
   supabase --version
   ```

---

## Initial Setup (One-Time)

### 1. Link Your Project to Supabase

⚠️ **DO NOT PASTE SECRETS INTO THIS REPO**

Run this command in your terminal (it will prompt for credentials):

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**Where to find your Project Ref**:
- Supabase Dashboard → Project Settings → General → Reference ID

**What this does**:
- Creates `supabase/.temp` directory (gitignored)
- Stores connection info locally (never committed)
- Links your local CLI to your remote Supabase project

---

## Working with Migrations

### Current Migration Structure

We use `supabase/sql/` for migration files (not `supabase/migrations/`).

**Migration files follow this naming pattern**:
```
YYYYMMDDHHMM_description.sql
```

**Example**: `202601150000_phase2a_canonise_layer_a_development_needs.sql`

### Applying Migrations

#### Option 1: Apply via Supabase Dashboard (Recommended for Production)

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of migration file from `supabase/sql/`
3. Paste and execute
4. Verify success (no errors)

#### Option 2: Apply via Supabase CLI (Local Development)

```bash
# Apply a specific migration file
supabase db push --file supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql

# OR apply all migrations in order (if using migrations/ directory)
supabase migration up
```

**Note**: CLI method requires project to be linked (see Initial Setup above).

---

## Verifying Schema Objects

### Check if a Table Exists

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name = 'pl_development_needs'
);
```

### List All Tables

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Inspect Table Schema

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'YOUR_TABLE_NAME'
ORDER BY ordinal_position;
```

### Check Row Counts

```sql
SELECT 
  schemaname,
  relname as tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY relname;
```

### Verify RLS Policies

```sql
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## Creating New Migrations

### Migration File Template

```sql
-- Migration Name: Brief description
-- Date: YYYY-MM-DD
-- Purpose: What this migration does

-- ============================================================================
-- PART 1: Description of changes
-- ============================================================================

-- Your SQL here

-- ============================================================================
-- PART 2: Verification queries (commented out)
-- ============================================================================

-- SELECT COUNT(*) FROM public.your_table;
```

### Best Practices

1. **Idempotent migrations**: Use `IF NOT EXISTS` and `DO $$` blocks
2. **Descriptive names**: Include date and purpose in filename
3. **Document changes**: Add comments explaining what and why
4. **Test locally**: Apply migration in local/dev environment first
5. **Verify after**: Run verification queries to confirm success

---

## Security Reminders

⚠️ **NEVER COMMIT SECRETS**

- ❌ Do NOT commit `.env` files
- ❌ Do NOT commit `supabase/.temp` directory
- ❌ Do NOT paste API keys or tokens in migration files
- ❌ Do NOT hardcode connection strings

✅ **DO commit**:
- Migration SQL files (`.sql`)
- Documentation (`.md`)
- Schema definitions (no secrets)

---

## Troubleshooting

### "Project not linked" Error

**Solution**: Run `supabase link --project-ref YOUR_PROJECT_REF`

### "Migration already applied" Error

**Solution**: Check if migration was already run in Supabase Dashboard → Database → Migrations

### "Permission denied" Error

**Solution**: Ensure you have admin access to the Supabase project

### Local vs Remote Schema Mismatch

**Solution**: 
1. Check Supabase Dashboard for current schema
2. Compare with local migration files
3. Create new migration to sync differences

---

## Migration History

Current migrations in `supabase/sql/`:

- `2025-11-04_core_schema.sql` — Initial core schema
- `2025-12-20_module_10A_remove_child_name.sql` — Privacy fix
- `2025-12-30_fix_theme_anonymous_access.sql` — Theme access
- `202601041654_pl0_product_library.sql` — PL-0 foundation
- `202601041700_pl1_pool_items.sql` — PL-1 pool items
- `202601050000_pl_category_types_and_products.sql` — PL taxonomy
- `202601050001_remove_rating_min_constraint.sql` — Rating constraint
- `202601050002_pl2_public_read_policies.sql` — PL-2 public read
- `202601060000_manus_ready_scoring_and_evidence.sql` — Manus scoring
- `202601060001_pl_autopilot_locks.sql` — Autopilot locks
- `202601142252_pl_need_ux_labels.sql` — UX labels
- `202601150000_phase2a_canonise_layer_a_development_needs.sql` — Phase 2A

---

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
- [Supabase Migration Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

_Last updated: 2026-01-15_

