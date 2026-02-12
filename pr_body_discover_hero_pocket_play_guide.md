# Discover: Pocket play guide hero

## What changed
UI-only upgrade of the /discover hero to the new “Pocket play guide” spec: premium typography (Source Serif 4 headline, Inter subheadline + CTA), warm morning light gradients, and a single “Get started” CTA that scrolls to the discovery section.

- **Hero copy**: Headline “Your pocket” / “play guide”; subheadline “From bump to big steps — science-powered toy ideas for what they’re learning next”; CTA “Get started”.
- **Typography**: Headline 60px → 128px responsive (leading 0.95, tracking -0.025em); subheadline 20px → 30px (Inter 300, leading 1.625); CTA Inter 500, 18px, accent #FF6347 / hover #B8432B.
- **Layout**: min-h-[85vh], centered, max-w-6xl, px-6; white hero on canvas #FAFAFA.
- **Background**: Three gradient layers (warm cream, subtle peach, top-right ember glow) with blur; pointer-events-none.
- **CTA**: “Get started” scrolls to `#discover-start` (discovery section); respects `prefers-reduced-motion` (smooth vs instant).

No DB, RLS, or vendor changes. Nav/header and Layer A/B/C unchanged.

## Manual QA checklist

**Desktop (1440px)**
- [ ] Hero fills ~85vh, text centered, warm glow subtle.
- [ ] Headline font Source Serif 4, looks premium; largest breakpoint very large.
- [ ] Subheadline lighter, readable, max width ~3xl.
- [ ] CTA button is Ember accent with correct hover + arrow nudge.

**Mobile (~390px)**
- [ ] Headline is 60px, line-height tight, no overflow.
- [ ] Subheadline 20px, wraps naturally.
- [ ] CTA is tappable, single primary action.

**Behaviour**
- [ ] “Get started” scrolls to discovery start; reduced motion respected (no smooth scroll when prefers-reduced-motion).

## Rollback
Revert PR (no schema changes).

## Preview URL
_(Set after Vercel deploy; link from PR checks or Vercel dashboard.)_
