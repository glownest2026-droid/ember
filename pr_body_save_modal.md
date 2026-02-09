## Goal
Replace "Save to my list" navigation with an in-place modal popup, while reusing existing save/auth logic and keeping "Have it already" unchanged.

## What changed
- **SaveToListModal**: New accessible modal using native `<dialog>` (focus trap, ESC close, backdrop click close, focus return to trigger).
- **DiscoveryPageClient**: "Save to my list" is now a button. On click:
  - Signed out: Opens modal with "Sign in", "Join free" links (preserve next param), and "Not now".
  - Signed in: Calls existing `/api/click` (source: discover_save), opens "Saved" confirmation with "View my list" link.
- No page navigation unless user chooses Sign in, Join free, or View my list.

## Non‑negotiable (unchanged)
- No DB schema, RLS, or gateway changes.
- No new dependencies (native dialog only).
- "Have it already" unchanged.
- Works desktop and mobile; accessible.

## Founder QA steps
1. Build: `pnpm -C web build` (verify passes).
2. Open Vercel preview → `/discover/26`.
3. Select doorway → "See next steps" → scroll to Layer C product cards.
4. **Signed out**: Click "Save to my list" → modal appears, no navigation. Click "Sign in" or "Join free" → navigates. Click "Not now" or ESC or backdrop → closes, focus returns.
5. **Signed in**: Click "Save to my list" → modal shows "Saved", "View my list" link works. No navigation on open.
6. Confirm "Have it already" still works and shows toast.

## Rollback
Revert PR (no schema changes).
