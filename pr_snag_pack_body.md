# fix: snag pack (mobile nav, add-children CTA, discover CTA, child name, subnav switcher + round 2)

## Snags addressed

**Round 1**
1. **Mobile navbar** — Navbar used desktop nav on mobile; now mobile-friendly with hamburger menu and slide-down panel.
2. **/add-children bottom CTA** — CTA now has mobile-friendly width (full width with safe-area padding) and text changed from "Start discovering toys" to "Add a child".
3. **/discover Get Started** — "Get started" CTA in the hero is hidden for signed-in users.
4. **/add-children first field** — Added optional "What do you call them?" field from Figma (stored as `display_name`).
5. **Subnav child switcher** — After "Add a child" button, the secondary control is now a dropdown to switch between child profiles; selection navigates to `/family?child=<id>`.

**Round 2**
6. **Post sign-in redirect** — After sign-in (magic link, password, or callback) users are taken to `/discover` when no `next` param is provided (was `/app`).
7. **Add-child consent error** — If user clicks "Add a child" without checking consent, the error message is shown above the CTA in the fixed bottom bar.
8. **Older-child modal** — "Just a heads up" warning for children >5 years is now a compact centred square modal instead of a full-width bottom sheet.
9. **Save then go to Discover** — After successfully saving a child, redirect to `/discover` (was `/family?saved=1`). Child is written to `children` table as before.
10. **Nav logo** — Nav uses Supabase URL for Ember logo; Image dimensions set to 96×96 for sharper display.

## Root cause summary

- **Snag 1:** DiscoverStickyHeader had no mobile breakpoint; nav links were always visible in a row (overflow on small screens). Fixed by hiding desktop nav on `md` down and adding hamburger + slide-down panel.
- **Snag 2:** CTA copy and container lacked mobile-safe width/safe-area. Fixed with updated copy and `paddingBottom: max(1rem, env(safe-area-inset-bottom))` + full width.
- **Snag 3:** DiscoverHeroPocketPlayGuide always showed "Get started" CTA. DiscoveryPageClient now passes `hideGetStarted={!!user}` so signed-in users don’t see it.
- **Snag 4:** Add-child form had no "What do you call them?" field. Figma uses it as first field (optional). Added DB column `display_name`, ChildDetailsCard field, form state, and actions.
- **Snag 5:** Subnav had static "All children" label. Replaced with a `<select>` that fetches children and navigates to `/family?child=id`; FamilyDashboardClient reads `initialChildId` from URL and syncs selection.
- **Snag 6:** Default `next` after sign-in was `/app`. Changed to `/discover` in auth/callback, auth/confirm, signin, and signin/password.
- **Snag 7:** Consent validation error was only at top of form. Added error block above the fixed CTA button so it appears directly above "Add a child".
- **Snag 8:** OlderChildSheet was a bottom sheet (full-width). Replaced with centred modal layout and `max-w-sm` for a compact square.
- **Snag 9:** saveChild redirected to `/family?saved=1`. Redirect changed to `/discover`; child insert/update to `children` table unchanged.
- **Snag 10:** Logo already used correct Supabase URL; increased Next/Image width/height to 96 for sharper rendering.

## What changed (file paths)

**Round 1**
- `web/src/components/discover/DiscoverStickyHeader.tsx` — Mobile menu (hamburger + panel); logo 96×96.
- `web/src/components/add-children/AddChildForm.tsx` — CTA text "Add a child", mobile-safe bottom bar; consent error above CTA; `childName` state and formData.
- `web/src/components/discover/DiscoverHeroPocketPlayGuide.tsx` — `hideGetStarted` prop; CTA wrapped in conditional.
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — Pass `hideGetStarted={!!user}` to hero.
- `web/src/components/add-children/ChildDetailsCard.tsx` — "What do you call them?" optional input (first field).
- `web/src/lib/children/actions.ts` — Read/write `display_name` in saveChild; redirect to `/discover` after save (was `/family?saved=1`).
- `web/src/app/add-children/[id]/page.tsx` — Pass `display_name` in initial to form.
- `supabase/sql/202602280000_children_display_name.sql` — Add optional `display_name` column to `children`.
- `web/src/components/subnav/SubnavBar.tsx` — Fetch children, replace static label with `<select>`; navigate to `/family?child=id`.
- `web/src/app/family/page.tsx` — Pass `initialChildId={params.child}` to FamilyDashboardClient.
- `web/src/components/family/FamilyDashboardClient.tsx` — Accept `initialChildId`, sync selectedChildId from URL and when list loads.
- `PROGRESS.md` — Log snag-pack entry.

**Round 2**
- `web/src/app/auth/callback/route.ts` — Default `next` to `/discover`.
- `web/src/app/auth/confirm/route.ts` — Default `next` to `/discover` (non-recovery).
- `web/src/app/signin/page.tsx` — Default `next` to `/discover`.
- `web/src/app/signin/password/page.tsx` — Default `next` to `/discover`.
- `web/src/components/add-children/AddChildForm.tsx` — Error message above CTA in fixed bottom bar.
- `web/src/components/add-children/OlderChildSheet.tsx` — Centred compact modal (max-w-sm) instead of bottom sheet.
- `web/src/lib/children/actions.ts` — saveChild redirect to `/discover`.
- `web/src/components/discover/DiscoverStickyHeader.tsx` — Logo Image width/height 96.

## Before / after behaviour

| Snag | Before | After |
|------|--------|--------|
| 1 | Desktop nav links in a row on mobile (overflow/cramped). | Hamburger on mobile; tap opens panel with Discover, Buy, Products, Manage Family, Account, Sign out (or Sign in, Get started). |
| 2 | CTA said "Start discovering toys"; layout could be tight on mobile. | CTA says "Add a child"; bottom bar has safe-area padding and full width. |
| 3 | Signed-in users saw "Get started" on /discover hero. | Signed-in users do not see the Get started button. |
| 4 | Add-child form started with DOB/gender; no call-name field. | First field is "What do you call them? (optional)" with placeholder; value saved to `children.display_name`. |
| 5 | Subnav showed static "All children" after Add a child. | Dropdown lists "All children" + each child (display_name or "Child N"); selecting one goes to /family?child=id and family dashboard shows that child. |
| 6 | After sign-in, default redirect was /app. | Default redirect is /discover (magic link, password, callback). |
| 7 | Consent error only at top of form. | Error shown above "Add a child" CTA in bottom bar. |
| 8 | "Just a heads up" was full-width bottom sheet. | Compact centred square modal (max-w-sm). |
| 9 | After save, redirect to /family?saved=1; reported hang. | Redirect to /discover; child still written to children table. |
| 10 | Nav logo could appear blurred. | Logo URL unchanged (Supabase); Image 96×96 for sharper display. |

## Vercel preview URL

_[Add preview URL after push, e.g. https://ember-git-fix-snag-pack-mobile-and-ux-….vercel.app]_

## Build

- `pnpm build` passes (run from `web/`).
