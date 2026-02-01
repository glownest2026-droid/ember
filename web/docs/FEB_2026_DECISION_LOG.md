# Feb 2026 Decision Log (Scaffold)

**Status**: Scaffold only (placeholders; do not treat as decided)  
**Created**: 2026-01-31  
**Scope**: Public gateway (`/new`, `/new/[months]`) and Phase A cutover decisions

---

## Month → band rule (TBD)

- **Decision**: Deterministic month → age band mapping using inclusive ranges + deterministic overlap tie-break.
- **Owner**: Cursor (Lead Dev) — PR1
- **Date**: 2026-01-31
- **Rule (exact)**:
  1) `candidates = ageBands where min_months <= selectedMonth <= max_months`
  2) If `candidates.length === 1` → choose it
  3) If `candidates.length > 1`:
     - If `anchor_month` exists on the age band objects, choose the candidate with smallest `abs(anchor_month - selectedMonth)`
     - Else choose the candidate with smallest `(selectedMonth - min_months)` (i.e., prefer the “newer” band at overlap)
     - If still tied, choose the candidate with higher `min_months`
  4) If `candidates.length === 0` → no band (show “catalogue coming soon” empty state)
- **Implementation**:
  - `web/src/lib/pl/ageBandResolution.ts` → `resolveAgeBandForMonth(selectedMonth, ageBands)`
  - `web/src/lib/pl/public.ts` → `getActiveAgeBands()` (source list for mapping)

### Note: PR2 boundary (explicit)
- `/new` is still using **legacy “moments”** reads until PR2.
- PR1 does **not** switch wrapper/product reads to `v_gateway_*_public` views.

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

