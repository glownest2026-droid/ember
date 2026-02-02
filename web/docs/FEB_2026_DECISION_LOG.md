# Feb 2026 Decision Log (Scaffold)

**Status**: Active (append-only)  
**Created**: 2026-01-31  
**Scope**: Public gateway (`/new`, `/new/[months]`) and Phase A cutover decisions

---

## Decision: Age-band-first gateway UI (range slider)

- **Decision**: Move `/new` UX from month-first to **age-band-first** (range slider), because current real coverage is band-level and may be sparse (e.g. 23–25m empty is honest).
- **Owner**: Lead Dev (Cursor)
- **Date**: 2026-02-01
- **Notes / context**:
  - Slider steps over the age bands returned by `v_gateway_age_bands_public`, sorted by `min_months` (no hard-coded band list).
  - The primary selection label is the **age range** (e.g. “25–27 months”), not a single month.
  - If a selected band has no picks, the UI shows a calm “catalogue coming soon” empty state (no invented coverage).
  - Deep links remain `/new/[months]` for compatibility; the month param is **snapped to a band** on load (selection still shows the band).
  - Month-specific ordering within a band is explicitly deferred until anchor-month provenance is proven.

---

## Month → band rule (implemented)

- **Decision**: A month integer resolves to the first age band where \(min\_months \le m \le max\_months\).
- **Owner**: Lead Dev (Cursor)
- **Date**: 2026-02-01
- **Tie-break**: If overlapping bands ever exist, choose the band with the highest `min_months` (newer band; deterministic).
- **Notes / context**:
  - `/new` defaults to the first band with picks (detected via gateway views when possible), otherwise the newest band (highest `min_months`).

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

