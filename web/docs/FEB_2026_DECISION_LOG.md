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

### Schema drift note (discovered)
- In the wild, age band month columns can drift (`min_months` vs `min_month`). We tolerate this in code.

---

## Public anon contract: /new reads from curated gateway views ONLY (LOCKED)

- **Decision**: `/new` and `/new/[months]` must read **only** from Phase A curated public views (anon-safe contract).
- **Owner**: Cursor (Lead Dev)
- **Date**: 2026-01-31
- **Contract**:
  - Allowed sources (public/anon):  
    - `public.v_gateway_age_bands_public`  
    - `public.v_gateway_wrappers_public`  
    - `public.v_gateway_wrapper_detail_public`  
    - `public.v_gateway_category_types_public`  
    - `public.v_gateway_products_public`
  - Not allowed in `/new` experience: legacy moments/sets/cards/base tables.
  - No base-table anon SELECT policies added (views-only).

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

