# Awin re-application: public URLs and positioning

Use these URLs when submitting Ember for affiliate network review. All routes are on production (`https://www.emberplay.app`) and Vercel preview deployments of this branch.

## Primary URLs

| Purpose | URL |
|--------|-----|
| Main site | https://www.emberplay.app/ |
| Discover (26 months) | https://www.emberplay.app/discover/26 |
| Discover deep link (focus + examples) | https://www.emberplay.app/discover/26?wrapper=little-hands&show=1 |
| Discover deep link (`focus` alias) | https://www.emberplay.app/discover/26?focus=little-hands&show=1 |
| Reviewer shortcut (`review=1`) | https://www.emberplay.app/discover/26?review=1 |
| Affiliate disclosure | https://www.emberplay.app/affiliate-disclosure |
| How Ember makes money | https://www.emberplay.app/how-ember-makes-money |
| How we choose | https://www.emberplay.app/how-we-choose |
| Safety rules | https://www.emberplay.app/safety-rules |
| Pricing | https://www.emberplay.app/pricing |

## Query parameters on Discover

- `wrapper` — gateway wrapper slug (e.g. `little-hands`, `let-me-help`).
- `focus` — optional alias for doorway keys from `web/src/lib/discover/doorways.ts` (e.g. `little-hands`).
- `show=1` — opens product examples for the selected focus.
- `category` — optional category type id when `show=1`.
- `review=1` — redirects to a default focus with examples visible (for reviewers).
- `child` — optional signed-in child id for personalization.

## Suggested promotional type wording

Content-led editorial product discovery for UK parents. Ember’s Discover journey helps parents understand what their child is practising at each stage, then surfaces relevant play ideas, product examples and retailer links. Ember does not operate cashback, voucher scraping, PPC brand bidding, subnetwork traffic or incentivised clicks.

## What reviewers should see

1. UK parenting content-led positioning on the homepage.
2. Discover as the promotional journey (`/discover/26`).
3. Developmental focus tiles, then ideas, then labelled product examples.
4. Point-of-decision affiliate disclosure near examples.
5. Site-wide trust pages linked from the public footer.
