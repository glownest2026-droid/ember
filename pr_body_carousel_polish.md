## Goal
Make Layer B category cards feel premium and readable over real photography: consistent media sizing, calm scrim overlays, stable text layout, and a multi-card carousel that teases the next/previous card (user-controlled only), while preserving existing CTAs and “Show examples” behavior.

## What changed
- **Card media**: 4:3 aspect ratio, object-cover, intentional fallback. Scrim gradient (subtle top → stronger bottom) for text legibility.
- **Text**: Title and “why” clamped to 2 lines; “More” as stable ghost pill. Actions on solid surface.
- **Carousel**: Peek/tease layout — desktop 380px card with ~80px peek each side; mobile 320px with ~40px peek. Active card centered; prev/next + counter; click teased card to advance. No auto-advance.
- **Accessibility**: useReducedMotion disables carousel transition when OS prefers reduced motion. Focus rings on buttons.

## Founder QA steps (browser only)
1. Open Vercel preview → `/discover/26`
2. Select doorway → click “See next steps”
3. Navigate carousel to “Tea sets and tableware” (or any category with HD image)
4. Confirm: image crops nicely (no awkward stretching); title and why text readable over image; “More” affordance stable and usable
5. Confirm desktop shows a “peek” of next/prev card
6. Confirm mobile layout has no overlap and buttons are tappable
7. Confirm “Show examples” still reveals Layer C products
8. Turn on Reduce Motion (OS) and refresh: carousel still works, motion simplified

## Non‑negotiable (unchanged)
- No data/Supabase schema changes
- Carousel user-controlled only (no timers)
- Save idea / Have them / Show examples unchanged
- No new vendors; lucide-react only
