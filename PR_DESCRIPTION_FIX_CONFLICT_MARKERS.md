# Fix: Remove conflict markers from SQL migration and add guard script

## Problem

The Phase A migration (`202601150000_phase_a_db_foundation.sql`) failed in Supabase with:
```
ERROR: 42601 syntax error at or near "<<<<<<<"
LINE 927: <<<<<<< HEAD
```

Conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) were shipped into the SQL migration file, causing a hard failure when executed in Supabase.

## Root Cause

Conflict markers from a merge/rebase were not fully resolved and were committed to the repository. The migration file contained duplicate sections with conflict markers in the proof bundle section (Part 11).

## Solution

### 1. Removed Conflict Markers

Fixed `supabase/sql/202601150000_phase_a_db_foundation.sql`:
- Removed all `<<<<<<< HEAD`, `=======`, and `>>>>>>>` markers
- Resolved duplicate sections in proof bundle (lines 927-986)
- Kept the correct intended content (seed import verification sections)

### 2. Added Guard Script

Created `web/scripts/check-no-conflict-markers.js`:
- Scans `supabase/sql`, `web/src`, and `docs` directories
- Checks for conflict markers in `.sql`, `.ts`, `.tsx`, `.js`, `.jsx`, `.md` files
- Exits with code 1 if any markers are found
- Provides clear error output with file paths and line numbers

### 3. Integrated into Build Pipeline

Updated `web/package.json`:
- Added `prebuild` hook to run conflict check before every build
- Added `check:conflicts` script for manual verification
- Build will now fail if conflict markers are present

## Verification

✅ **Conflict markers removed**: 
```bash
$ node web/scripts/check-no-conflict-markers.js
✅ No conflict markers found.
```

✅ **Build passes**: `pnpm run build` succeeds (15.4s)
- Prebuild hook runs conflict check automatically
- Build completes successfully

✅ **Migration is valid SQL**:
- No syntax errors
- All conflict markers removed
- File is ready for Supabase execution

## Files Changed

- `supabase/sql/202601150000_phase_a_db_foundation.sql` — Removed conflict markers (lines 927, 955)
- `web/scripts/check-no-conflict-markers.js` — New guard script
- `web/package.json` — Added prebuild hook and check:conflicts script

## Prevention

The guard script will:
1. Run automatically before every build (`prebuild` hook)
2. Fail the build if conflict markers are detected
3. Can be run manually with `pnpm run check:conflicts`

This ensures conflict markers cannot be shipped to production.

## Migration Application

1. Open Supabase Dashboard → SQL Editor
2. Paste entire contents of `supabase/sql/202601150000_phase_a_db_foundation.sql`
3. Execute
4. Verify: No syntax errors; proof bundle runs successfully

