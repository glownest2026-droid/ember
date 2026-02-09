## Goal
Replace "Save to my list" navigation with an in-place modal popup, while reusing existing save/auth logic and keeping "Have it already" unchanged.

## What changed
- **SaveToListModal**: New accessible modal using native `<dialog>` (focus trap, ESC close, backdrop click close, focus return to trigger).
  - Signed out: "Sign in", "Join free" links; **Email address** field + magic link (same behavior as /signin); "Not now".
  - Signed in: "Saved" confirmation + "View my list" link.
- **DiscoveryPageClient**: "Save to my list" (Layer C products) is now a button; opens modal.
- **CategoryCarousel**: "Save idea" (Layer B categories) is now a button; opens same modal.
- No page navigation unless user chooses Sign in, Join free, View my list, or submits magic link.

## Non‑negotiable (unchanged)
- No DB schema, RLS, or gateway changes.
- No new dependencies (native dialog only).
- "Have it already" unchanged.
- Works desktop and mobile; accessible.

## Founder QA steps
1. Build: `pnpm -C web build` (verify passes).
2. Open Vercel preview → `/discover/26`.
3. Select doorway → "See next steps".
4. **Save idea (Layer B)**: Click "Save idea" on a category card → modal appears. Signed out: modal has Sign in, Join free, Email field + magic link, Not now.
5. **Save to my list (Layer C)**: Scroll to examples, click "Save to my list" → same modal.
6. **Email in modal**: Enter email, "Send magic link" → "Check your email" (same as /signin). Not now / ESC / backdrop closes.
7. **Signed in**: Either button → modal shows "Saved", "View my list" link works.
8. Confirm "Have it already" / "Have them" still work.

## Rollback
Revert PR (no schema changes).
