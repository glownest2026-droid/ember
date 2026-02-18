# Feb 2026 Auth — Decision Log

Scaffold for recording auth-related decisions. One entry per decision with consistent fields.

---

## Template (per entry)

- **Date**
- **Decision**
- **Status:** Proposed | Accepted
- **Context**
- **Options considered**
- **Chosen option**
- **Consequences**

---

## 2026-02-18 — Auth approach baseline (PR0)

- **Date:** 2026-02-18
- **Decision:** Auth approach will use Supabase Auth with server-side cookie session plumbing via `@supabase/ssr`; PR0 confirms existing state before change.
- **Status:** Accepted
- **Context:** Feb 2026 auth baseline audit (PR0) documents current routes, CTAs, Supabase wiring, and saves/ownership without changing behavior. Ensures founder-readable ground truth before PR1 changes.
- **Options considered:** (1) Proceed with PR1 changes without a doc baseline; (2) Add PR0 audit doc and decision log scaffold, then proceed.
- **Chosen option:** (2) — Add `FEB_2026_AUTH_BASELINE.md` and this decision log with one initial entry; no runtime changes in PR0.
- **Consequences:** Single source of truth for “current state” when implementing server-side cookie session and CTA gating in follow-up PRs; decision log available for future auth decisions.

---

## 2026-02-18 — Auth modal + session plumbing (PR1)

- **Date:** 2026-02-18
- **Decision:** Upgrade SaveToListModal to a generic auth modal with Apple/Google (feature-flagged), Email OTP (6-digit in-modal), and fix auth callback/confirm to set session cookies in route handlers.
- **Status:** Implemented
- **Context:** PR0 identified that auth callback used server client with no-op cookie setters; sessions were not persisted after OAuth/OTP. PR1 adds in-modal OTP UX and return-to for OAuth.
- **Options considered:** (1) New modal component; (2) Reuse and upgrade SaveToListModal. (3) Leave callback as no-op and rely on middleware on next request.
- **Chosen option:** (2) — Reuse SaveToListModal; add route-handler Supabase client that sets cookies on the response in `/auth/callback` and `/auth/confirm`.
- **Consequences:** Sessions persist after code exchange and OTP verify; modal supports 6-digit Email OTP and OAuth with return URL in `next` param; founder can enable Google/Apple via env flags and Supabase dashboard.
