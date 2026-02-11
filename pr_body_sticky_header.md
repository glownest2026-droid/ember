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

## Non‑negotiable (unchanged)
- No DB/RLS/gateway changes. No new vendors.
- Layer A/B/C logic, carousel behaviour, and state resets unchanged.
- No headless automation or deployment polling. Founder QA in browser only.

## Founder QA (preview URL)

1. **Mobile** `/discover/26` load: Sticky header visible; scroll page and confirm it stays. Tap "Ember" (left cluster) → returns to top.
2. Tap "What is Ember?" → bottom sheet opens; close via outside tap, X, and swipe down.
3. "Join free" CTA present and navigates to signin (with next param).
4. **Hero**: Shows the 3-line copy above selector UI; calm; text readable.
5. **Desktop**: Header minimal and aligned; no overlap.
6. **Reduced motion**: No smooth scroll when using header scroll-to-top (if OS Reduce motion on).

## Rollback
Revert PR (no schema changes).

## Delivery
- Branch: create from `main` (e.g. `feat/sticky-header-calm-hero`), push and open PR using this body.
- Preview URL: set in PR after Vercel deploy; founder QA in browser only (no terminal).
