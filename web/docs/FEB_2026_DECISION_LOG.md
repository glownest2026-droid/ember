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
- **Status:** Proposed
- **Context:** Feb 2026 auth baseline audit (PR0) documents current routes, CTAs, Supabase wiring, and saves/ownership without changing behavior. Ensures founder-readable ground truth before PR1 changes.
- **Options considered:** (1) Proceed with PR1 changes without a doc baseline; (2) Add PR0 audit doc and decision log scaffold, then proceed.
- **Chosen option:** (2) — Add `FEB_2026_AUTH_BASELINE.md` and this decision log with one initial entry; no runtime changes in PR0.
- **Consequences:** Single source of truth for “current state” when implementing server-side cookie session and CTA gating in follow-up PRs; decision log available for future auth decisions.

---

## 2026-02-18 — Pending action storage + replay; no anonymous saves (PR2)

- **Date:** 2026-02-18
- **Decision:** Pending action storage in sessionStorage; replay exactly once after sign-in; no anonymous saves.
- **Status:** Implemented
- **Context:** PR2 gates Save / Have / Join behind auth. When a guest triggers an action, we store it (actionId + payload + returnUrl) and open the auth modal. After sign-in, we replay the action once so the user’s intent is fulfilled without a second click.
- **Options considered:** (1) Navigate to /signin and lose context; (2) Store pending action in sessionStorage and replay in one place (DiscoveryPageClient) when user is detected; (3) Replay from modal onAuthSuccess (requires modal to know replay; chosen Option B for single place).
- **Chosen option:** (2) — sessionStorage key `ember.pendingAuthAction.v1`; consume in DiscoveryPageClient on auth state; clear before running to avoid double-exec.
- **Consequences:** No anonymous writes; all save/have actions require auth; replay is best-effort (toast on failure).
