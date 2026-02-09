# feat(discover): frictionless load + swipe-first carousels + Save-first CTAs

## Goal
Make `/discover` a frictionless, swipe-first A→B→C flow: hide B/C by default, remove "See next steps", doorway click scrolls to B, enable swipe/drag on both carousels, and make Save the primary CTA (B: Save idea, C: Save product).

## What changed

### Phase 1 — Default load: hide B/C until doorway selected
- **Server** (`page.tsx`): Pass `selectedWrapperSlug` from URL only (no default slug). Fetch `categoryTypes` only when `selectedWrapperSlug` is set. Deep links with `?wrapper=` and `?show=1` unchanged; redirect when `show=1` and no wrapper still uses first wrapper with picks.
- **Client**: When no `?wrapper=` in URL, only hero + age slider + doorway tiles render. Next steps (Layer B) and Examples (Layer C) render only after doorway selection or when URL has `wrapper=` / `show=1`.

### Phase 2 — Remove "See next steps"; tile click scrolls to Layer B
- "See next steps" CTA button removed.
- On doorway tile click: set selected doorway, update URL, then scroll to `#nextStepsSection`. Uses `scrollIntoView({ block: 'start', behavior: shouldReduceMotion ? 'auto' : 'smooth' })`. Scroll runs after DOM update via `requestAnimationFrame` (double RAF).

### Phase 3 — Swipe/drag carousels
- **Layer B (CategoryCarousel)**: Converted to horizontal scroll with `overflow-x-auto`, `scroll-snap-type: x mandatory`, `scroll-snap-align: center` on cards. Scrollbar hidden visually; `touch-pan-x` for swipe. Prev/next arrows call `scrollBy` to next snap; `scrollBehavior` respects `prefers-reduced-motion` (no smooth when reduced).
- **Layer C (AnimatedTestimonials)**: Swipe/drag to change active card: touch and pointer start/end with 40px threshold so taps on buttons are not treated as swipes. Cursor `grab`/`grabbing` on the card stack area.

### Phase 4 — CTA hierarchy
- **Layer B category card**: Primary (filled accent) = "Save idea"; secondary (outline) = "Have them"; tertiary (ghost) = "Show examples". Handlers unchanged; only order and styles.
- **Layer C product card**: Primary (filled accent) = "Save product" (was "Save to my list"); secondary (outline) = "Have it already"; tertiary (ghost) = "Visit". Handlers unchanged.

## Non‑negotiable (unchanged)
- No DB schema, RLS, or gateway changes.
- No new dependencies (native dialog, native scroll-snap, CSS only).
- Existing data selection / filtering by development need preserved; deep links with `?wrapper=` and `?show=1` work.
- `prefers-reduced-motion`: no forced smooth scroll; swipe animations minimal.
- No headless automation; no deployment polling; founder QA in browser only.

## Founder QA (preview URL)

1. **Load** `/discover/26` (mobile + desktop)  
   - Only hero, age slider, and doorway tiles visible. No "Next steps", no "Examples".

2. **Tap a doorway tile**  
   - Page scrolls to "Next steps" section; category cards show for that doorway.

3. **Swipe Layer B** horizontally  
   - Cards swipe; prev/next arrows still work.

4. **On a category card**  
   - Primary = "Save idea" (filled); "Show examples" = tertiary (ghost).

5. **Tap "Show examples"**  
   - Layer C (Examples) appears and scrolls into view.

6. **Swipe Layer C** horizontally (on the stacked cards area)  
   - Active product changes; no console errors.

7. **Reduced motion**  
   - In OS "Reduce motion" (or equivalent): no smooth scrolling when using arrows or doorway click.

8. **Deep link**  
   - Open `/discover/26?wrapper=let-me-help` → Layer B visible for that doorway. Open with `&show=1` → Layer C visible as today.

## Rollback
Revert PR (no schema changes).

## Delivery
- Branch: `feat/frictionless-discover` (create from `main`, then push and open PR using this body).
- Preview URL: set in PR after Vercel deploy; founder QA in browser only (no terminal).
