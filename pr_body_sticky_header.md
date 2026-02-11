# feat(ui): sticky header + calm hero + "What is Ember?" bottom sheet

## Goal
Replace the `/discover` top-of-page shell with a mobile-first sticky header and a calmer hero, and add a "What is Ember?" bottom sheet (exact copy) plus a single "Join free" CTA.

## What changed

### Sticky header (discover-only)
- **ConditionalHeader**: When path starts with `/discover`, render `DiscoverStickyHeader` instead of the global header.
- **DiscoverStickyHeader**: Left = Ember robin logo (brand-assets URL) + "Ember" text; entire cluster scrolls to top. Right = "What is Ember?" (opens bottom sheet), "Join free" (links to `/signin?next=current path`).
- Styling: App-like, minimal, trust-led. Sticky with safe-area padding, border #E5E7EB, white surface. Button #FF6347, hover #B8432B.

### Bottom sheet — "What is Ember?"
- **WhatIsEmberSheet**: Reusable bottom sheet. Close by: swipe down, X icon, tap outside overlay.
- Copy (exact): Title "What is Ember?"; sections What it does / How it works (bullets) / Privacy. Single CTA "Join free" (primary).

### Hero
- Replaced previous hero with calm full-width container: 240–320px height (responsive), gradient + subtle ember glow.
- Copy (exact): Headline "Guided toy shopping. From bump to big steps."; subhead "See what they're learning next - and what to buy for it."; support "Use what you've got. Add what you need."

### Fixes (5 regressions)
1. **Sticky header alignment + logo**: Header uses `max-w-7xl` to match page content; flex `items-center` / `justify-between`; logo `h-6` mobile / `h-7` desktop, `w-auto`; left cluster centered; right cluster vertically aligned.
2. **"Show examples" affordance**: Button has `cursor-pointer`, `hover:underline`, `focus-visible:ring`; clearly interactive.
3. **"Explained" clickable + HowWeChooseSheet**: Next steps subheader shows "Chosen for X–Y months • Explained ⓘ"; ⓘ (and "Explained ⓘ") opens **HowWeChooseSheet** ("How Ember chooses" — exact copy). "Why these?" in Examples opens the same sheet. Close: tap outside, X, swipe down.
4. **Reset Layer B on Layer A change**: When doorway changes, Layer B carousel resets to index 0 (shows 1/N), scroll to start; Layer C state cleared. `resetKey={selectedWrapper}` passed to `CategoryCarousel`.
5. **"Have them" wired**: "Have them" calls existing handler; toast "Marked as have them."; `cursor-pointer`; no dead click.

### Residual fixes (follow-up)
1. **Header polish**: Bigger logo (~2×): `h-7 sm:h-8`, `w-auto`. Inner container `max-w-6xl px-4` to remove giant middle space; vertical centering; no min-height/line-height issues.
2. **"What is Ember?" responsiveness**: Mobile = bottom sheet (swipe down + X + outside). Desktop = centered modal card (`max-w-[720px]`, `w-[92vw]`, `rounded-2xl`, `shadow-xl`); close via X + outside click only.
3. **Auto-scroll on Layer A selection**: Clicking a development tile scrolls to Next steps (Layer B); ref on section, `setTimeout` after state update; respects `prefers-reduced-motion`.
4. **"Have them" / "Have it already"**: Signed out → open existing auth modal (SaveToListModal) + toast. Signed in → "Have them" toast "We've noted it."; "Have it already" calls `/api/click` + toast. No dead clicks.

### Final fixes (once and for all)
1. **Nav: everything left**: Single left-aligned cluster `[Logo] [Ember] [What is Ember?] [Join free]`; no right-aligned block; `justify-start`; logo `h-8` mobile / `h-9` desktop; gaps logo–Ember ~8px, Ember–What is Ember? ~24px, What is Ember?–Join free ~16px.
2. **Auto-scroll when Layer B ready**: `pendingScrollToNextSteps` set on tile click; effect runs when `categoryTypes.length > 0` and pending; then RAF `scrollIntoView` (reduced-motion: `auto`); optional guard: only scroll if `window.scrollY < nextStepsTop - 40`. Changing doorway while loading keeps pending until ready.
3. **Carousel counter**: Page count from `cardsPerView` (container width / (cardWidth + gap)); `totalPages = ceil(count / cardsPerView)`, `activePage` from `current`; ResizeObserver to recompute; display `activePage / totalPages` (no +2 inflation).

## Non‑negotiable (unchanged)
- No DB/RLS/gateway changes. No new vendors.
- No headless automation or deployment polling. Founder QA in browser only.

## Founder QA (browser-only, Vercel preview URL)

**1) Header**  
- Logo visibly bigger.  
- All items grouped on left: logo + Ember + What is Ember? + Join free.  
- Nothing right-aligned.  

**2) Auto-scroll**  
- Click a development tile at top.  
- Even if “We’re adding more ideas here” appears briefly, once tiles load, page scrolls down to Next steps automatically.  

**3) Carousel counter**  
- For a known small set (e.g. 3 pages worth), counter matches actual pages; no +2 inflation.  
- Resize window narrower/wider: counter still correct.  

## Rollback
Revert PR (no schema changes).

## Delivery
- Branch: `feat/sticky-header-calm-hero` (existing PR).
- **Preview URL**: _(set in PR after Vercel deploy; founder QA in browser only, no terminal)_
