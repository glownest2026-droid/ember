# PostHog starter dashboards — founder runbook

This document matches **Ember’s current client analytics** (PostHog). It does **not** add new tracking; it explains how to turn what is already firing into a small, readable reporting layer.

## Ground truth: custom events in code today

These are the **exact** `capture` event names from `web/src/lib/analytics/eventNames.ts` and call sites:

| Event name | What it roughly means | Main surfaces |
|------------|----------------------|----------------|
| `page_view` | Manual page/screen view | Every route change (`PostHogProvider`) |
| `sign_in_completed` | Successful sign-in | Cookie after OAuth-style return, `/verify` (OTP), `/signin/password` |
| `shortlist_viewed` | Discover examples/shortlist became visible | `/discover/[months]` when picks/examples show |
| `product_saved` | Product saved to list (RPC success) | Discover save flow |
| `retailer_outbound_clicked` | Outbound retailer intent | Discover save/have, `/go/…` link clicks, `/app/recs` cards |
| `child_profile_created` / `child_profile_updated` | Child profile saved | After successful `saveChild()` (when cookie bridge fires) |
| `gift_page_viewed` / `gift_page_shared` | Gift list view / share copy | `/gift/[slug]` flows |

**Identify (not a custom event name):** The app calls `posthog.identify(userId)` when a Supabase user exists. In PostHog’s Activity/Live events you typically see the reserved event **`$identify`** (or person updates), not an event literally named `identify`. Use **Persons** and **unique users** on insights keyed to logged-in behavior; do not expect a custom event called `identify`.

**Web Vitals:** PostHog may also show automatic performance events (depending on project settings). Treat them as **quality signals**, not growth metrics, until you have steady traffic.

---

## Where to click in PostHog (repeatable pattern)

Use **Product analytics → New insight** (or **Dashboards → New dashboard** then **Add insight**). Exact labels move between PostHog versions; the pattern is always: **pick insight type → pick event → add breakdown/filter → save → pin to dashboard**.

Suggested flow:

1. Open your Ember **project** in PostHog.
2. Go to **Product analytics** (or **Insights**).
3. **New insight**.
4. Choose **Trends** for counts over time, **Funnel** for step conversion, or **Stickiness** later when you care about return visitors.
5. Set the **time range** (e.g. last 7 / 30 days).
6. **Save** the insight, then **Add to dashboard** (create **“Ember — Starter”** once and reuse it).

**Tips:**

- **Filters:** Use `properties.pathname`, `properties.area`, or `properties.source_surface` when the event supports them (see property table below).
- **Unique users:** For many charts, switch from **Total count** to **Unique users** (often labeled “unique” or uses distinct persons) when you care about *people*, not raw event volume.
- **Duplicates:** `sign_in_completed` may occasionally appear more than once per person if both the **cookie bridge** and a **page-level** success path fire for the same login. For early dashboards, track **trend direction**, not single-session precision.

---

## Starter dashboard plan (use these sections on one dashboard)

### A. Acquisition / traffic

| Chart | Insight type | Event / setup | Notes |
|-------|--------------|---------------|--------|
| Total page views | Trend | `page_view` | Use **total count** for volume. |
| Unique visitors (approx.) | Trend | `page_view` → **Unique users** | Good proxy for “how many people hit the site” while anonymous traffic exists. |
| Top entry pages | Trend or **Paths** (if available) | `page_view`, breakdown `pathname` | Alternatively use **Session replay / Paths** if enabled; Paths can be nosier. |
| Top URLs / areas | Trend | `page_view`, breakdown `pathname` or `area` | `area` is a coarse bucket: `discover`, `auth`, `family`, etc. |

### B. Activation

| Chart | Insight type | Event / setup | Notes |
|-------|--------------|---------------|--------|
| Sign-ins | Trend | `sign_in_completed` | Break down by `auth_method` (`otp`, `password`) where present; cookie-driven rows may omit it. |
| Discover examples reached | Trend | `shortlist_viewed` | Break down by `pathname` for `/discover/...` routes (see property note). |
| Activation funnel | **Funnel** | Steps in order: `page_view` → `shortlist_viewed` → `product_saved` → `retailer_outbound_clicked` | **Caveat:** This is a **directional** product funnel, not a strict user journey. Users can `retailer_outbound_clicked` without `product_saved` (e.g. “have it” or recs). **Order matters** only if you keep steps strict; consider a second funnel ending at `product_saved` only. |

### C. Product engagement

| Chart | Insight type | Events | Notes |
|-------|--------------|--------|--------|
| Saves over time | Trend | `product_saved` | Break down `source_surface` if needed (`discover_save`). |
| Retailer clicks over time | Trend | `retailer_outbound_clicked` | Break down `click_path_type` (`go_redirect` vs `api_click`) and `source_surface` (`discover`, `recs`, or query param on `/go`). |
| Shortlist impressions | Trend | `shortlist_viewed` | Correlates with Discover depth. |

### D. Top content

| Chart | Insight type | Setup | Notes |
|-------|--------------|--------|--------|
| Top pages by views | Trend / Bar | `page_view`, breakdown `pathname`, show last 7d | Trim query strings mentally or add a PostHog **property transform** later if needed. |
| Top discover routes by shortlist | Trend | `shortlist_viewed`, breakdown `pathname` | Requires `pathname` on the event (added for dashboard clarity). |
| Top products / retailers clicked | Trend | `retailer_outbound_clicked`, breakdown `product_id` or `retailer_host` | **No full retailer URL** is sent—only `product_id` and best-effort `retailer_host` / `dest_host` patterns. |

---

## Property review (are breakdowns “good enough”?)

| Event | Properties (non-exhaustive) | Sufficient? | Gaps / how to work around |
|-------|----------------------------|------------|---------------------------|
| `page_view` | `pathname`, `area` | **Yes** for routing and coarse product areas. | Query strings are part of `pathname` in Next.js; treat `/discover/26?...` as one URL or normalize in PostHog if clutter appears. |
| `shortlist_viewed` | `pathname`, `user_id`, `child_id`, `age_band_id`, `wrapper_slug`, `result_count` | **Yes** after `pathname` (see code). | `wrapper_slug` helps doorway/category; `pathname` ties to concrete discover URLs. |
| `product_saved` | `user_id`, `kind`, `product_id`, `source_surface`, `child_id` | **Yes** for saves by product and surface. | No category slug on the event; use `product_id` or join mentally to catalog. |
| `retailer_outbound_clicked` | `user_id` (when known), `product_id`, `source_surface`, `source`,… | **Yes** for intent and surface mix. | **`source` vs `source_surface`:** Discover uses both (`source` is finer, e.g. `discover_save`); `/go/` uses `source_surface` from `src` query. Prefer **both** in breakdowns until you learn your habits. |
|  | … `click_path_type`, `retailer_host`, `child_id`, sometimes `age_band` | | `click_path_type`: `go_redirect` (link proxy) vs `api_click` (Discover/recs instrumented paths). |

**Tiny improvement shipped with this runbook:** `shortlist_viewed` now includes **`pathname`** so “top discover routes by shortlist” does not depend on joining-only logic to `page_view`.

---

## What “good” vs “bad” looks like (early stage)

**Encouraging early signals**

- `page_view` unique users rises week over week.
- `shortlist_viewed` grows in line with or faster than raw hits (people reach examples, not just landing).
- `product_saved` and `retailer_outbound_clicked` show **non-zero** steady tails—intent exists.
- `sign_in_completed` grows without `page_view` collapsing (traffic isn’t “bouncing harder”).

**Reasons to dig in (not necessarily “bad,” but investigate)**

- High `page_view`, near-zero `shortlist_viewed`: Discover entry or age-wrapper UX may be blocking examples.
- `shortlist_viewed` high, `product_saved` flat: save friction, relevance, or auth gating.
- `retailer_outbound_clicked` dominated by one surface: dependency on one flow (e.g. only recs); diversification might be lacking.

**What to ignore for now**

- Perfect funnel conversion rates (steps are not mutually exclusive).
- Single-day spikes without comparison to trailing week.
- **Session duration** and replay-heavy diagnostics until you’ve confirmed baseline event volume.
- Exact deduplication of `sign_in_completed` per user per month (optimize later).

---

## Rollback

- **Docs-only / property addition:** Revert the PR. Removing `pathname` from `shortlist_viewed` does not break the app; it only removes one PostHog breakdown dimension.
- Historical PostHog data remains as captured.

---

## How to verify it worked

1. Deploy or run the app with PostHog env vars set (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`).
2. Open a discover page until examples show; in PostHog **Activity**, confirm `shortlist_viewed` includes a `pathname` property.
3. Create one **Trend** on `shortlist_viewed` with breakdown **pathname** and confirm `/discover/...` values appear.
4. `pnpm -C web build` passes on the branch.
