# Ember Brand Book

**Status:** Canonical as of July 2026  
**Source of truth (product UI):** `/discover` (Figma May 2026 app shell)  
**Source of truth (marketing scale):** Homepage (`.homepage-discover-brand`) uses the same face and colours; marketing sizes may be larger for first impression.

Use this document for any new page, component, or copy surface. If ThemeProvider / admin theme injects Inter or Source Serif 4, **do not** let those win on public Discover or marketing surfaces — force Manrope + the tokens below.

Related: Conor voice and copy bar → `web/docs/CONSCIENTIOUS_CONOR.md`  
Code tokens → `web/src/lib/discover/figmaTokens.ts`, `web/src/lib/discover/navStyles.ts`, `web/src/lib/discover/manrope.ts`, `web/src/lib/marketing/layout.ts`, `.homepage-discover-brand` in `web/src/app/globals.css`

---

## 1. Brand feel

Warm, calm, premium UK parenting — not clinical, not toy-catalogue shouty, not generic purple SaaS.

| Do | Don’t |
|----|--------|
| Soft cream canvas, navy ink, coral accent | Flat cold grey / purple gradients |
| Manrope only (UI + marketing) | Mix Inter + Source Serif on public surfaces |
| White label on orange CTAs | Dark/black text on orange buttons |
| Clear hierarchy, generous space | Dense dashboard chrome on marketing |
| Stage 2 catalogue art for product moments | Same AI parent model repeated across a page |

---

## 2. Colour

| Role | Hex | CSS / usage |
|------|-----|-------------|
| Ink / high text | `#253044` | Headings, primary labels |
| Muted / body | `#66717D` | Body, subheads, inactive nav |
| Accent (coral) | `#FF5C34` | Primary CTAs, active underline, links |
| Accent hover | `#E54A2E` / `#E04B28` | Button hover |
| Canvas | `#FBFAF7` | Page / nav background |
| Surface | `#FFFFFF` | Cards, hero wash start |
| Border | `#E7E2DC` | Hairlines, card borders |
| Soft blush | `#FFF6F3` | Soft CTA / marketing washes |

**Rules**

- Primary filled button: background `#FF5C34`, **text always `#FFFFFF`**.
- Text links on cream: muted `#66717D`, hover/active ink `#253044`.
- Active nav: ink + 2px bottom border `#FF5C34`.

---

## 3. Typography

### Face

**Manrope** only — weights **400 / 500 / 600 / 700**.  
Loaded via `discoverManrope` (`--font-discover-manrope`).

| Forbidden on public UI | Why it still appears in code |
|------------------------|------------------------------|
| Inter | ThemeProvider body default |
| Source Serif 4 | ThemeProvider heading default |

Always override with Manrope on Discover shell (`ember-figma-app`) and homepage (`.homepage-discover-brand`).

### Discover (in-app) scale — product source of truth

From `DiscoverFigmaChildHero`:

| Role | Size | Weight | Colour |
|------|------|--------|--------|
| Page title (h1) | 32px → 44px md | 700 | `#253044` |
| Body / hero sub | 16px → 17px md | 400 | `#66717D` |
| Nav links | 16px | 500 | muted / ink |
| Nav wordmark | `text-xl` (20px) | 700 | `#253044` |
| Primary CTA | 16px | 600 | white on coral |

### Marketing homepage scale

Same face and colours; braver sizes for SaaS first impression.

| Class | Role | Size (approx) | Weight |
|-------|------|---------------|--------|
| `.home-display` | Hero title | 48 → 60 → 80 → 88px | 600 |
| `.home-lead` / `.home-section-lead` / `.home-body` | **One body size pagewide** | 20 → 22 → 24px | 400 |
| `.home-section-title` | Section h2 | 32 → 36 → 44px | 600 |
| `.home-pullquote` | Statement line | 28 → 32 → 36px | 500 |
| `.home-card-title` | Card titles | 22 → 24px | 600 |
| `.home-cta` / `.home-link` | Buttons & text CTAs | 18 → 20px | 500 |

Hero may use `.home-cta-hero` / `.home-link-hero` (same type as page CTAs; larger padding).

---

## 4. Layout & containers

| Surface | Container | Notes |
|---------|-----------|--------|
| Discover / in-app | `max-w-5xl` (`EMBER_FIGMA_APP_CONTAINER`) | Dense product chrome |
| Marketing (home, pricing) | `max-w-7xl` (`EMBER_MARKETING_CONTAINER`) | Align signed-out nav to this width on `/` and `/pricing` |
| Signed-out nav height | ~96–112px (`h-24` / `h-28`) | Fits larger robin mark |
| Homepage hero | `min-h` ≈ viewport minus nav | Age slider sits below the fold |

**Alignment rule:** On marketing routes, nav content edge and page content edge must match (same max-width + padding).

---

## 5. Components

### Logo (signed-out nav)

- **Robin mark:** ~80×80 mobile, ~88×88 desktop (legible brand presence).
- **Wordmark “Ember”:** `text-xl` bold ink — **not** doubled with the icon; must sit with nav link scale.
- Asset: `brand-assets/logos/Ember_Logo_Robin1.png` (Supabase public).

### Primary CTA (filled)

```
bg #FF5C34 · text #FFFFFF · rounded-xl · font-medium/semibold
hover: #E54A2E + soft coral shadow optional
```

Never inherit body ink colour onto filled orange buttons.

### Secondary CTA (text)

Ink or accent text, medium weight, optional arrow — no filled background.

### Cards / media

- Radius ~20–24px (`rounded-[20px]` / `home-media` 1.5rem).
- Soft shadow: `0 12px 40px rgba(0,0,0,0.08)`.
- Stage 2 images: `object-cover`, edge-to-edge in the frame.

### Imagery

- Prefer Stage 2 `category_images` catalogue art on marketing.
- **No repeat of the same adult model** across adjacent homepage sections (AI red flag).
- Warm domestic play setups; avoid catalogue-y product dumps as the hero.

---

## 6. Motion

- Prefer ~0.5–0.8s fade/slide with `motion/react`.
- Respect `useReducedMotion`.
- Motion supports hierarchy; avoid noise.

---

## 7. Copy (visual tone)

Plain UK English. Warm, direct, not twee.  
Banned in public copy: magic, win, unlock, optimise, essential, must-have, “research shows”, vague leap language.  
Full Conor bar: `web/docs/CONSCIENTIOUS_CONOR.md`.

---

## 8. Agent / engineering checklist

Before shipping UI:

1. Manrope only — no Inter / Source Serif leak on the surface.
2. Body `#66717D`, headings `#253044`, accent `#FF5C34`.
3. Orange button → white text.
4. Marketing width = nav width on home/pricing.
5. Homepage body classes share one size (`.home-lead` / `.home-section-lead` / `.home-body`).
6. Logo icon can be large; wordmark stays nav-scale (`text-xl`).
7. Run Conor five tests on any parent-facing copy.

---

## 9. File map

| Concern | Path |
|---------|------|
| Brand book (this file) | `web/docs/EMBER_BRAND_BOOK.md` |
| Cursor rule | `.cursor/rules/ember-brand-book.mdc` |
| Colour / layout tokens | `web/src/lib/discover/figmaTokens.ts` |
| Nav styles | `web/src/lib/discover/navStyles.ts` |
| Manrope loader | `web/src/lib/discover/manrope.ts` |
| Marketing container | `web/src/lib/marketing/layout.ts` |
| Homepage type scale | `web/src/app/globals.css` → `.homepage-discover-brand` |
| Discover hero body reference | `web/src/components/discover/figma/DiscoverFigmaChildHero.tsx` |
