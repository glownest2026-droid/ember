# Hotfix: Phase A migration seed import matches canonical schema

## Problem

The Phase A migration (`202601150000_phase_a_db_foundation.sql`) failed in Supabase with:
```
ERROR: column "need_name" of relation "pl_development_needs" does not exist
```

## Root Cause

The migration attempted to:
1. Insert into `pl_development_needs` using `need_name` column (which doesn't exist)
2. Insert seed-only columns (min_month, max_month, stage fields, evidence) into canonical table
3. Look up development needs using `need_name` instead of `name`
4. Use variable shadowing in product population loop

## Solution

### A) Fixed development needs upsert
- Replaced all references to `pl_development_needs.need_name` with `pl_development_needs.name`
- Insert/merge ONLY canonical columns: `name`, `slug`, `plain_english_description`, `why_it_matters`
- Removed seed-only columns (min_month, max_month, stage fields, evidence) from insert
- Changed from `ON CONFLICT (need_name)` to `INSERT ... WHERE NOT EXISTS` pattern (safer, no unique constraint assumption)

### B) Fixed all downstream lookups
- Replaced `WHERE need_name = seed_rec.need_name` with `WHERE name = seed_rec.need_name`
- Applied to: meta population (10.3), category type mapping (10.4)

### C) Stage fields stored only in pl_age_band_development_need_meta
- Added age band overlap filtering: `seed.min_month <= band.max_months AND seed.max_month >= band.min_months`
- Only populate meta for needs that overlap with target age band
- Upsert meta rows idempotently, only overwrite if existing is NULL/empty

### D) Fixed variable shadowing bug
- Renamed loop variable from `age_band_id` to `v_age_band_id` in product population (10.5)
- Fixed WHERE clause: `WHERE age_band_id = v_age_band_id` (was incorrectly `age_band_id = age_band_id`)

### E) Populated rationale fields
- Category mappings: Set `rationale = seed.stage_reason` (or NULL if absent)
- Product mappings: Set `rationale = stage_reason || ' | ' || age_suitability_note` (safe concat, avoids trailing separators)

### F) Updated proof bundle
- Added seed import verification indicators:
  - Count of `pl_development_needs` rows
  - Count of meta rows for '23-25m' and '25-27m' separately
  - Count of wrappers for '25-27m'

## Conflict Resolution

**Conflicts resolved by Cursor** (2026-01-15):
- Merged with latest `origin/main` while preserving all hotfix changes
- Kept security/view hardening from main (gateway-scoped views, wrapper is_active filters, rationale fields)
- Applied hotfix changes to seed-population sections only:
  * Development needs upsert uses `name` (not `need_name`)
  * Only canonical columns inserted into `pl_development_needs`
  * Stage fields stored only in `pl_age_band_development_need_meta` with age band overlap filtering
  * Fixed variable shadowing bugs (`v_age_band_id`, `v_need_name`)
  * Populated rationale fields in category and product mappings

## Verification

✅ **Build passes**: `pnpm run build` succeeds (15.9s)

✅ **Migration uses canonical schema**:
- Uses `pl_development_needs.name` (not `need_name`)
- Stage fields stored only in `pl_age_band_development_need_meta`

✅ **Migration is runnable end-to-end**:
- Can be pasted as single block in Supabase SQL Editor
- No errors expected when run against canonical schema
- All conflict markers removed, idempotency maintained

## Files Changed

- `supabase/sql/202601150000_phase_a_db_foundation.sql` — Fixed seed import logic

## Migration Application

1. Open Supabase Dashboard → SQL Editor
2. Paste entire contents of `supabase/sql/202601150000_phase_a_db_foundation.sql`
3. Execute
4. Check NOTICE messages in output (proof bundle runs automatically)
5. Verify: Seed import succeeded (development_needs_count > 0, meta_count > 0)

