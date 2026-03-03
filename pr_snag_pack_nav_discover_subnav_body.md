# fix: snag pack (mobile nav 1-click, child name, subnav toggle + deeplinks)

## Snags addressed

- **A(i)** Mobile, signed out: Move "Sign in" (and Get started) from hamburger into the main nav bar so users can sign in with one less click.
- **A(ii)** Mobile, signed in: Duplicate Discover / My Saves / Marketplace / Family as icon links in the main nav bar (one less click); they remain in the hamburger menu as well.
- **B(i)** Everywhere it says "My child" (discover flow / my-ideas): use the child's name from the child table when populated (`child_name` or `display_name`).
- **C(i)** Subnav child toggle: when changing child, stay on the current page and set `?child=` in the URL (works on /discover, /my-ideas, /family).
- **C(ii)** Subnav: First (amber) CTA = child selector; "+ Add a child" is the secondary CTA after it.
- **C(iii)** Subnav stat counters (ideas / toys / gifts) are clickable and deeplink to the corresponding tab in the "My List" grid on /my-ideas (e.g. "X toys" → /my-ideas?tab=products).

## Root cause summary

- **A(i)(ii)** Mobile nav showed only logo + hamburger; Sign in and the four main links were inside the menu. No in-bar shortcuts for signed-out or signed-in users.
- **B(i)** MyIdeasClient and related copy used the literal "My child"; child profile fetch did not include `child_name`/`display_name` for display.
- **C(i)** Child select always navigated to `/family?child=id`; it did not preserve the current route (discover/my-ideas) with a child param.
- **C(ii)** Subnav had "+ Add a child" first (primary CTA) and child selector second; order and styling were reversed from spec.
- **C(iii)** Stats were plain text; /my-ideas did not accept a `tab` query param to open a specific My List tab.

## What changed (file paths)

- `web/src/components/discover/DiscoverStickyHeader.tsx` — Mobile: new nav strip (md:hidden) with Sign in + Get started when signed out, and four icon-only links (Compass, Bookmark, ShoppingBag, Users) when signed in; hamburger unchanged.
- `web/src/components/family/MyIdeasClient.tsx` — ChildProfile includes `child_name`, `display_name`; fetch selects them; `displayName` derived from selected child; "My child" replaced by name when set; accepts `initialTab` and syncs activeTab from URL for deeplinks.
- `web/src/app/my-ideas/page.tsx` — Passes `initialTab` from `searchParams.tab` to MyIdeasClient.
- `web/src/components/subnav/SubnavBar.tsx` — Uses pathname; child select stays on current page and sets `?child=` when on discover/my-ideas/family; child selector first (amber/primary CTA), "+ Add a child" second (secondary); ideas/toys/gifts stats are Links to `/my-ideas?tab=ideas|products|gifts` (preserving `?child=`); children query selects `child_name`, `display_name` for option labels.
- `PROGRESS.md` — Logged this snag pack.

## Before / after behaviour

| Snag | Before | After |
|------|--------|--------|
| A(i) | Mobile signed out: Sign in only in hamburger. | Mobile signed out: Sign in + Get started visible in main bar. |
| A(ii) | Mobile signed in: main links only in hamburger. | Mobile signed in: four nav icons in main bar; same links still in hamburger. |
| B(i) | "My child" everywhere. | Child's name shown when set in child table; "My child" fallback when not. |
| C(i) | Changing child in subnav always went to /family. | Changing child updates URL with ?child= on current page (discover/my-ideas/family). |
| C(ii) | "+ Add a child" first (primary), child selector second. | Child selector first (amber CTA), "+ Add a child" second. |
| C(iii) | Stats not clickable. | Clicking ideas/toys/gifts opens /my-ideas with the correct tab (ideas/products/gifts). |

## Vercel preview URL

After opening the PR, use the Vercel bot comment or the "Deployments" tab for the preview URL (e.g. `https://ember-git-fix-snag-pack-nav-discover-subnav-…vercel.app`).

## Build

- `pnpm build` (from `web`) passes.
