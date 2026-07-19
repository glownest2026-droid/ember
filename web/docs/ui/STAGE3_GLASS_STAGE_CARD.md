# Stage 3 card template — Glass Stage (canonical)

**Status:** Founder-selected 2026-07-19  
**Codename:** `glass-stage`  
**Source exploration:** in-situ toggle option **3 · R2 Glass Stage**  
**Visual golden sample:** `web/docs/ui/artifacts/stage3-glass-stage-card.reference.html`  
**Ingest prompt (separate agent):** `agent-tools/prompts/ingest-stage3-glass-stage-into-discover.md`

This is the **canonical UI template** for Pip’s Picks / Stage 3 cards on Discover (mobile-first). Agents must implement this style precisely across all Stage 3 cards — do not invent a new visual language.

---

## 1. Intent (founder-level)

| Need | How Glass Stage delivers it |
|------|-----------------------------|
| VIP moment after Stage 1+2 | Dark spatial track + frosted glass cards — feels like a different “room” |
| Premium Ember Plus | Specular edge, grain, drifting coloured light |
| Sofa-scroll addiction | **“Why Pip picked this” as a tappable drawer** (not a static text box) |
| Card recall after Browse offers | Per-pick accent + ambient orb colour shift |
| Brand presence without product photos | Upright robin tucked **top-right corner only** (44px) |

Banned: tilted/mid-card robins, peach-mush pastels, purple SaaS, static dense verdict walls that compete with the title.

---

## 2. Tokens (exact)

### Page / brand (unchanged Discover)

| Token | Hex | Use |
|-------|-----|-----|
| Page cream | `#FBFAF7` | Discover canvas |
| Ink navy | `#253044` | Section titles outside the track |
| Muted | `#66717D` | Subtitles |
| Persimmon | `#FF5C34` | CTA, active dot, accent default |
| Blush | `#FFE0D8` / soft `#FFB199` | Tag / soft accent |
| Font | **Manrope** 500–800 | Only |

### Glass Stage track

| Token | Value |
|-------|--------|
| Track background | `radial-gradient(130% 100% at 50% 0%, #1C2537 0%, #131A28 70%)` |
| Track radius | `28px` |
| Track shadow | `0 24px 56px rgba(19, 26, 40, 0.3)` |
| Track min-height (mobile) | `~560px` (or `max(452px, 100dvh − header − chrome)`) |
| Inactive dots | `rgba(255,255,255,0.25)` |
| Active dot | `#FF5C34`, width `22px` |

### Ambient orbs (behind glass)

Three blurred orbs; colours **follow the active card’s accent** as the user swipes:

| Orb | Size / place | Role |
|-----|----------------|------|
| A | ~240px, left mid | Primary accent wash |
| B | ~190px, top right | Soft blush / champagne wash |
| C | ~160px, bottom right | Soft echo of A |

`filter: blur(48px)`; `pointer-events: none`; transition background `400ms`.

### Per-pick accent family (card-to-card variance)

Stay in Ember warm family — **never purple**:

| Pick | `--accent` | `--accent-soft` | Orb A example |
|------|------------|-----------------|---------------|
| 1 | `#FF5C34` | `#FFB199` | `rgba(255,92,52,0.45)` |
| 2 | `#E8A05A` | `#F5D0A8` | `rgba(232,160,90,0.42)` |
| 3 | `#FF7A55` | `#FFC4B0` | `rgba(255,122,85,0.44)` |
| 4 | `#D9785C` | `#F0C4B4` | `rgba(217,120,92,0.40)` |
| 5 | `#F0A07A` | `#FFE0D0` | `rgba(240,160,122,0.42)` |

Set as CSS variables on each card root: `--accent`, `--accent-soft`.

### Glass card surface

| Property | Value |
|----------|--------|
| Width | `300px` (mobile carousel snap) |
| Radius | `28px` |
| Fill | `linear-gradient(170deg, rgba(56,70,98,0.52), rgba(28,36,54,0.65))` |
| Blur | `backdrop-filter: blur(22px) saturate(150%)` (+ `-webkit-` prefix) |
| Border | `1px solid rgba(255,255,255,0.14)` |
| Specular | `inset 0 1px 0 rgba(255,255,255,0.28)` |
| Drop shadow | `0 28px 56px rgba(10,14,24,0.48)` |
| Grain | SVG fractal noise overlay at ~30% opacity (see reference HTML) |
| Fallback | If `backdrop-filter` unsupported: solid `#253044` / `#1C2436` — still premium, not broken |

### Corner robin (mandatory)

| Property | Value |
|----------|--------|
| Class | `.corner-robin` |
| Position | `absolute; top: 10px; right: 10px;` |
| Size | `44×44px` |
| Transform | **none** (upright only) |
| z-index | `40` |
| Asset | `brand-assets/logos/Ember_Logo_Robin1.png` |
| Forbidden | Watermark giant robin, tilt, bottom-left float, medallion mid-header |

Leave `padding-right: ~52px` on kicker / rank / tag so type never runs under the robin.

---

## 3. Card anatomy (top → bottom)

1. **Corner robin** (top-right)
2. **Rank** — ghost-stroke numeral (`font-size ~42px`, `-webkit-text-stroke: 1.5px var(--accent)`, fill transparent) + “of N” caption
3. **Best-for tag** — pill, uppercase ~10.5–11px / 800, border + fill from accent
4. **Title** — ~22px / 800, white, max 2 lines; keep width ~78% so glass feels open
5. **Brand** — uppercase ~12px / 700, white 60%
6. **Description** — ~13.5–14px / 500, white 90%, clamp 2–3 lines; dims when drawer open
7. **Why Pip picked this — DRAWER** (required addictive component — see §4)
8. **Thumb row** — Browse offers (persimmon, flex-1, min 44px) + expand + save icon buttons

Carousel: scroll-snap center, flat scale physics on mobile (`scale(1 − absOffset × 0.08)`), no 3D tilt on touch.

---

## 4. Addictive component — “Why Pip picked this” drawer

**Do not** ship Glass Stage with a permanently expanded verdict box. The insight is **earned by a tap**.

### Behaviour

| State | UI |
|-------|-----|
| Closed (default) | One row: label “Why Pip picked this” + chevron down; soft glass fill |
| Open | Panel expands (~320ms); chevron rotates 180°; description opacity → ~0.35 |
| A11y | `aria-expanded` on the button; focusable; respect `prefers-reduced-motion` |

### Visual

```
border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent)
background: color-mix(in srgb, var(--accent) 12%, transparent)  // closed
open: slightly stronger wash (~18%)
label: uppercase 12px / 800, color var(--accent-soft)
body: 13px / 600, white ~94%
radius: 16–18px
```

### Why this exists

Founder rule: drive **addictive browsing** on the sofa — every card gives the thumb one small, satisfying action before Browse offers.

---

## 5. Content rules (Conor)

- Copy comes from ingested Stage 3 data (`best_for` / tag, title, brand, description, verdict).
- Voice: smart UK parent friend. No magic / win / unlock / essential / “research shows”.
- Retailer CTA → **Google Shopping** search for `brand + title` — never one retailer deep-link.
- Free members: pick 1 unlocked + one locked upsell card (existing product rule) — preserve when wiring.

---

## 6. Implementation map (code)

| Concern | Likely path |
|---------|-------------|
| Stage 3 carousel (PR #273 lineage) | `web/src/components/discover/figma/PipsPicksPersimmonCarousel.tsx` (may live in PR worktree until merged) |
| Discover mount | `web/src/app/discover/[months]/DiscoveryPageClient.tsx` |
| Brand tokens | `web/src/lib/discover/figmaTokens.ts`, `web/docs/EMBER_BRAND_BOOK.md` |
| This template | `web/docs/ui/STAGE3_GLASS_STAGE_CARD.md` |
| Visual reference | `web/docs/ui/artifacts/stage3-glass-stage-card.reference.html` |

Prefer **Tailwind + small CSS module / styled tokens** matching the values above — do not copy exploration class names (`v2-*`) into production unless convenient; match **pixels and behaviour**.

---

## 7. Acceptance checklist

- [ ] Dark spatial track + frosted glass cards match reference HTML at phone width
- [ ] Orbs recolour with active pick
- [ ] Robin upright top-right only (44px)
- [ ] Per-pick accent variance visible when swiping
- [ ] **Why Pip drawer** closed by default; tap opens; description dims
- [ ] Browse offers → Google Shopping
- [ ] 44px tap targets; Manrope only; reduced-motion respected
- [ ] Backdrop-filter fallback tested (or solid navy fallback)
- [ ] Stage 1/2 above still cream/white — Stage 3 still reads as VIP contrast
- [ ] Conor five tests on any new chrome copy

---

## 8. Non-goals

- Do not switch to Espresso / Mum light / porcelain as the default without a new founder decision.
- Do not reintroduce giant tilted robins for “visual interest”.
- Do not flatten the drawer back into a permanent verdict box.
