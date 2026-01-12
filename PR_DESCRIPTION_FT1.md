## New Public Routes

- `/new` → redirects to `/new/26` (default 26 months)
- `/new/[months]` → dynamic route with months param (clamped to 24-30)

## Deep Linking

- Slider changes update URL: moving slider to 27 updates URL to `/new/27`
- Moment selection uses query params: selecting "Bath time" updates URL to `?moment=bath`
- Preloading works: visiting `/new/25` shows slider at 25 months

## Save to Shortlist Gate

- Clicking "Save to shortlist" navigates to `/signin?next=/new/<months>?moment=<momentId>`
- After successful login, user returns to same `/new` route (preserving month + moment state)
- No DB writes for shortlists in FT-1 (conversion gate only)

## Data Source: PL Curation

- Fetches published sets from `pl_age_moment_sets` (status='published' only)
- Maps months → age band using existing `getAgeBandForAge()` helper
- Shows curated "top 3 picks" cards sorted by rank (obvious, nearby, surprise)
- Empty state: "We're still building this moment for this age. Try another moment." (when no published set exists)

## Header Integration

- Header logo links to `/new` when on `/new` routes (path-aware ConditionalHeader)
- Middleware sets `x-pathname` header for server component path detection
- No header duplication - single unified header

## UI Implementation

- Matches HTML mockup design (ember_24months_mockup_v4.html)
- Mobile-first responsive layout (max-width: 430px)
- Custom slider styling with gradient thumb matching mockup
- Card layout with badges, tags, and actions

## Verification

All proof routes still functional:
- ✅ `/signin`, `/auth/callback`, `/app`, `/app/children`, `/app/recs`, `/ping`, `/cms/lego-kit-demo`

## Files Changed

- `web/src/app/new/page.tsx` - default route redirect
- `web/src/app/new/[months]/page.tsx` - server component (data fetching)
- `web/src/app/new/[months]/NewLandingPageClient.tsx` - client component (UI + interactions)
- `web/src/lib/pl/public.ts` - new helper: `getPublishedSetForAgeBandAndMoment()`
- `web/src/components/ConditionalHeader.tsx` - path-aware header (logo links to /new)
- `web/middleware.ts` - adds x-pathname header
- `web/src/app/globals.css` - slider styling
- `PROGRESS.md` - updated routes list

