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
## 2026-02-18 — Pending action storage + replay; no anonymous saves (PR2)

- **Date:** 2026-02-18
- **Decision:** Pending action storage in sessionStorage; replay exactly once after sign-in; no anonymous saves.
- **Status:** Implemented
- **Context:** PR2 gates Save / Have / Join behind auth. When a guest triggers an action, we store it (actionId + payload + returnUrl) and open the auth modal. After sign-in, we replay the action once so the user’s intent is fulfilled without a second click.
- **Options considered:** (1) Navigate to /signin and lose context; (2) Store pending action in sessionStorage and replay in one place (DiscoveryPageClient) when user is detected; (3) Replay from modal onAuthSuccess (requires modal to know replay; chosen Option B for single place).
- **Chosen option:** (2) — sessionStorage key `ember.pendingAuthAction.v1`; consume in DiscoveryPageClient on auth state; clear before running to avoid double-exec.
- **Consequences:** No anonymous writes; all save/have actions require auth; replay is best-effort (toast on failure).

---

## 2026-02-18 — Account hardening: optional password + provider linking (PR3+4)

- **Date:** 2026-02-18
- **Decision:** Add minimal Account surface: (1) Set a password (optional) after OTP sign-in; (2) Password sign-in + Forgot password kept and working; (3) Explicit “Link Google” / “Link Apple” on /account while signed in. No automatic account merging; no anonymous saves.
- **Status:** Implemented
- **Context:** PR3+4 single PR to support password as optional second factor and user-driven provider linking without redesigning auth.
- **Options considered:** (1) Set-password CTA in header dropdown vs (2) Dedicated /account page with “Account” link in header; (3) Auto-merge identities vs explicit linking only.
- **Chosen option:** (2) — /account page with “Account” link in DiscoverStickyHeader; (3) explicit linking only, feature-flagged; if provider flags off, hide link buttons.
- **Consequences:** /account protected by middleware (redirect to signin?next=/account); linking uses same /auth/callback?next=/account; docs updated (FEB_2026_AUTH_SETUP.md sections 7–8, this log).
