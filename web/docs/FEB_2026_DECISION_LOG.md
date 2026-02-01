# Feb 2026 Decision Log (Scaffold)

**Status**: Scaffold only (placeholders; do not treat as decided)  
**Created**: 2026-01-31  
**Scope**: Public gateway (`/new`, `/new/[months]`) and Phase A cutover decisions

---

## Month → band rule (TBD)

- **Decision**: Deterministic month → age band mapping using inclusive ranges + deterministic overlap tie-break.
- **Owner**: Cursor (Lead Dev)
- **Date**: 2026-01-31
- **Rule (exact)**:
  1) Normalize each age band row into `{ ageBandId, min, max }` using:
     - `ageBandId`: `id` OR `age_band_id`
     - `min/max`: `min_months`/`max_months` (plural) OR `min_month`/`max_month` (singular)
     - If min/max are missing: parse from `ageBandId` string (e.g. `"25-27m"` → min=25, max=27)
  2) `candidates = bands where min <= selectedMonth <= max`
  3) If exactly 1 candidate → choose it
  4) If multiple candidates (overlap month like 25) → choose the candidate with **higher `min`** (prefer newer band)
  5) If 0 candidates → no band (“catalogue coming soon”)
- **Implementation**:
  - `web/src/lib/pl/ageBandResolution.ts` → `resolveAgeBandForMonth(selectedMonth, ageBands)`
  - `web/src/lib/pl/public.ts` → `loadAgeBandsForResolution()` prefers `v_gateway_age_bands_public` and falls back to `pl_age_bands`

### Schema drift note (discovered)
- The gateway age band source can vary across environments:
  - `min_months`/`max_months` (plural) vs `min_month`/`max_month` (singular)
  - `id` vs `age_band_id`
- Hotfix stance: tolerate drift in code; **do not** change DB schemas/policies in this PR.

---

## Coverage promise for 23–25m (TBD)

- **Decision**: TBD
- **Owner**: TBD
- **Date**: TBD
- **Promise text (customer-facing)**: TBD
- **Notes / context**:
  - TBD: Are 23–25m and 25–27m both guaranteed to have content at launch?
  - TBD: What is the fallback UX if a band has partial coverage?

---

## Month-sensitive ordering (TBD)

- **Decision**: TBD
- **Owner**: TBD
- **Date**: TBD
- **Notes / context**:
  - TBD: Should ordering within a band vary by month (e.g. 25 vs 27) or be band-stable?
  - TBD: If month-sensitive, what is the deterministic rule (e.g. anchor-month proximity)?

---

## Known accepted gaps (TBD)

- **Decision**: TBD
- **Owner**: TBD
- **Date**: TBD
- **Accepted gaps list**:
  - TBD

