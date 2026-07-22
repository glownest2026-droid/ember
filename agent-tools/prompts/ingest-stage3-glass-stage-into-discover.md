# Cursor agent prompt — ingest Glass Stage into Discover Stage 3

Copy everything below the line into a **new Cursor agent chat** when ready to ship the founder-selected Stage 3 card style into the live app.

---

## Prompt (paste into new agent)

```
You are shipping Ember’s founder-selected Stage 3 / Pip’s Picks card UI into production Discover.

## Goal
Replace the current Stage 3 card visual language with the canonical **Glass Stage** template — precisely — across all Stage 3 cards on mobile-first Discover. Include the addictive **“Why Pip picked this” drawer** (closed by default).

## Read first (mandatory)
1. `web/docs/ui/STAGE3_GLASS_STAGE_CARD.md` — tokens, anatomy, behaviour, acceptance checklist
2. `web/docs/ui/artifacts/stage3-glass-stage-card.reference.html` — open at phone width; this is the visual golden sample
3. `web/docs/EMBER_BRAND_BOOK.md` — Manrope + colour rules
4. `.cursor/rules/conscientious-conor.mdc` — no banned copy; Conor five tests on any new chrome strings
5. Find the live Stage 3 carousel component:
   - Prefer `web/src/components/discover/figma/PipsPicksPersimmonCarousel.tsx` if present on this branch
   - Else search for Pip’s Picks / Stage 3 product carousel under `web/src/components/discover/figma/` and `DiscoveryPageClient.tsx`
   - If only in a PR worktree (e.g. `.codex-worktrees/pr273/...`), port into the current branch’s Discover tree

## Non-negotiables
- Dark spatial track (`#1C2537` → `#131A28`) + frosted glass cards (`backdrop-filter: blur(22px) saturate(150%)`) with specular inset edge + subtle grain
- Ambient orbs that recolour with the active pick’s accent
- Per-pick accent variance from the Ember warm family in the template (never purple)
- Robin: upright 44px, top-right corner only — kill any tilted / watermark / mid-card robin
- **Why Pip picked this = drawer** (tap to expand; dim description when open; aria-expanded; reduced-motion safe)
- Browse offers → Google Shopping for `brand + title` (never one retailer)
- 44px min tap targets; Manrope only; white text on persimmon CTA
- Preserve existing product rules: free member pick-1 + locked upsell; expand/save behaviours if already present
- Smallest change possible — restyle Stage 3 cards / track; do not rewrite Stage 1/2

## Fallback
If `backdrop-filter` is weak on older Android WebViews, solid navy/ink glass (`#253044` / `#1C2436`) is acceptable — document in PR.

## Deliver
1. Implement Glass Stage in the production Stage 3 component(s)
2. Update `PROGRESS.md`
3. Open a PR (do not stop at local-only) with summary + test plan
4. Follow repo PR handoff until Vercel preview is green
5. Handoff: preview URL + path to test (e.g. `/discover/2` → Stage 2 card with Ember Picks → Pip’s Picks)

## Verify before handoff
- [ ] Phone-width: matches reference HTML mood (glass + dark track + orbs)
- [ ] Swipe: accents/orbs shift pick-to-pick
- [ ] Drawer: closed by default; tap opens; description dims
- [ ] Robin only top-right, upright
- [ ] Browse offers → Google Shopping
- [ ] Stage 1/2 still cream/white; Stage 3 still feels VIP
- [ ] `pnpm -C web build` (or project equivalent) passes
```

---

## Notes for the founder

- This prompt does **not** change catalogue data — UI only.
- Exploration HTML files under `agent-tools/exports/` are historical; **canonical** sources are `web/docs/ui/STAGE3_GLASS_STAGE_CARD.md` + the reference HTML artifact.
- After ingest, prefer deleting or ignoring stale exploration exports so agents don’t restyle from Soft Cream / Espresso by mistake.
