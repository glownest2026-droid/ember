## Summary

Replace `/discover/[months]` UI with the local Figma Discover redesign (stages 1–4): doorway cards, science block, play-ideas carousel, product carousel. **Same data plumbing** (wrappers, categories, picks, save/have, auth). **Personalization:** first name from `children.display_name` / `child_name` when `?child=` + signed in; otherwise **your child** / **your family** fallbacks. **Gender** loaded for future copy; hero uses name-first fallbacks.

## Verification

1. `cd web && pnpm run build`
2. Signed in with `?child=` → hero “Curated for {FirstName}”, stages use real gateway data
3. Pick doorway → science → category carousel → See examples → products; Save / Have / Visit work
4. Start over + second tap on same doorway deselects

## Rollback

Revert branch `feat/discover-figma-redesign`.
