# Analytics Foundation Discovery

## A. Current Truth

### Live surfaces now
- Auth sign-in: `/signin`, `/signin/password`, `/verify`, `/auth/callback`, `/auth/confirm`.
- Child profile flows: `/add-children`, `/add-children/[id]`, `/family`.
- Discovery and recommendations: `/discover`, `/discover/[months]`.
- Product browsing: `/products`.
- Product outbound/click logging points: `/api/click` and `/go/[id]`.
- Saves and list management: `/my-ideas`, save/have actions in discovery UI.
- Gift list/share: `/gift/[slug]` and share widget in family/my-ideas.
- Marketplace pre-launch listings: `/marketplace`, `/marketplace/listings`.
- Reminder preference UI: subnav switch and family/my-ideas reminder controls.

### Partial surfaces now
- Auth sign-up as explicit product flow is not present; current OTP sign-in uses `shouldCreateUser: false`.
- Garage/owned is represented as `have=true` flags in `user_list_items`, not a standalone garage module or route.
- Notifications exist as a single `development_reminders_enabled` preference; no vendor-backed lifecycle notification engine.

### Future surfaces not ready for tracking yet
- Marketplace demand, local match, purchase, dispute, and messaging flows are not implemented in code/schema.
- Stage-transition notification prompts are not implemented as a dedicated feature flow.

## B. Canonical IDs - Safe to Use Now

Only IDs below are grounded by current code/schema:
- `user_id` (Supabase Auth user id; used across children/list/saves/marketplace/gift ownership).
- `child_id` (`children.id`; appears in family/discovery filtering and `user_list_items.child_id`).
- `product_id` (`products.id`; used in picks, saves, click endpoints, outbound routes).
- `gift_share_slug` (`gift_shares.slug`) for public gift URL identity.
- `gift_item_id` (`user_list_items.id` where `gift=true`) for gift list item identity.
- `listing_id` (`marketplace_listings.id`) for pre-launch listings and photos linkage.
- `category_type_id` (`pl_category_types.id`) for idea/category saves.
- `ux_wrapper_id` (`pl_ux_wrappers.id`) for idea-kind rows in `user_list_items`.

## C. IDs We Must NOT Invent Yet

Do not introduce until real schema/flows exist:
- `idea_id` as a new canonical concept separate from existing `category_type_id` or `ux_wrapper_id`.
- `recommendation_id` (no durable recommendation entity currently persisted).
- `match_id` (no local-match entity exists yet).
- `gift_list_id` (public gift list identity is currently slug + owner, not a separate list table id).
- `demand_id`, `purchase_id`, `dispute_id`, `message_id` (not implemented in schema/routes).
- Any lifecycle vendor object IDs.

## D. Event Taxonomy - NOW

### `page_view`
- Trigger moment: any tracked route render in web app shell.
- Required properties: `path`, `route_group` (`auth|discover|family|my_ideas|gift|marketplace|products`).
- Optional properties: `user_id`, `child_id`, `age_band_id`.
- Forbidden properties: child name, exact DOB, due date, exact postcode, free text, message contents.
- Why it matters: baseline funnel and surface usage.

### `signup_started`
- Trigger moment: user opens auth entry flow (`/signin`) with intent to continue.
- Required properties: `entry_path`.
- Optional properties: `next_path`.
- Forbidden properties: raw email, child/family personal fields.
- Why it matters: top-of-funnel auth intent measurement.

### `signup_completed`
- Trigger moment: successful session establishment after auth callback/confirm where user is newly activated.
- Required properties: `auth_method` (`otp|oauth|password`), `result` (`success`).
- Optional properties: `next_path`.
- Forbidden properties: raw email, token/code values, child/family personal fields.
- Why it matters: conversion and auth method quality.

### `sign_in_completed`
- Trigger moment: successful sign-in session in callback/confirm/password/verify flow.
- Required properties: `auth_method`, `result` (`success`).
- Optional properties: `next_path`.
- Forbidden properties: raw email, token/code values.
- Why it matters: active user access and auth reliability.

### `child_profile_created`
- Trigger moment: new child row written via save child action.
- Required properties: `child_id`.
- Optional properties: `age_band`.
- Forbidden properties: child name, exact birthdate.
- Why it matters: personalization activation.

### `child_profile_updated`
- Trigger moment: existing child row updated.
- Required properties: `child_id`.
- Optional properties: `age_band`, `changed_fields_count`.
- Forbidden properties: child name, exact birthdate.
- Why it matters: profile freshness and lifecycle readiness.

### `shortlist_generated`
- Trigger moment: discovery flow resolves and renders product examples set for selected scope.
- Required properties: `age_band_id`, `wrapper_slug`.
- Optional properties: `category_type_id`, `child_id`, `result_count`.
- Forbidden properties: child name, exact birthdate.
- Why it matters: recommendation engine output health.

### `shortlist_viewed`
- Trigger moment: user reaches stage 4 examples section with visible picks.
- Required properties: `age_band_id`.
- Optional properties: `wrapper_slug`, `category_type_id`, `child_id`, `result_count`.
- Forbidden properties: child name, exact birthdate.
- Why it matters: recommendation engagement.

### `product_viewed`
- Trigger moment: user opens product destination intent (before outbound redirect/click insert).
- Required properties: `product_id`.
- Optional properties: `age_band_id`, `category_type_id`, `child_id`, `source_surface`.
- Forbidden properties: child name, exact birthdate, exact postcode.
- Why it matters: product interest and ranking quality.

### `retailer_outbound_clicked`
- Trigger moment: click logged through `/go/[id]` or `/api/click`.
- Required properties: `product_id`, `source`.
- Optional properties: `age_band`, `child_id`, `dest_host`.
- Forbidden properties: raw IP, exact location, child name.
- Why it matters: commerce intent and affiliate performance.

### `product_saved`
- Trigger moment: save action sets/updates `user_list_items` or legacy saved tables for product/category.
- Required properties: `kind` (`product|category|idea`).
- Optional properties: `product_id`, `category_type_id`, `ux_wrapper_id`, `child_id`, `gift`, `have`.
- Forbidden properties: child name, exact birthdate, free-text notes.
- Why it matters: shortlist quality and later lifecycle segmentation.

### `gift_page_viewed`
- Trigger moment: `/gift/[slug]` successfully loads list.
- Required properties: `gift_share_slug`.
- Optional properties: `items_count`, `child_filter_active`.
- Forbidden properties: owner private profile data, child names.
- Why it matters: gift sharing adoption.

### `gift_page_shared`
- Trigger moment: user copy-link action succeeds in gift share widget.
- Required properties: `gift_share_slug`.
- Optional properties: `surface` (`family|my_ideas`).
- Forbidden properties: recipient identity, message text.
- Why it matters: organic sharing loop.

### `garage_item_added`
- Trigger moment: `have=true` set on `user_list_items` for product/category.
- Required properties: `kind`.
- Optional properties: `product_id`, `category_type_id`, `child_id`.
- Forbidden properties: child name, exact birthdate.
- Why it matters: ownership state signal for future recommendations.

## E. Event Taxonomy - LATER

These are reserved only; do not implement in current build:
- `listing_created` (later when marketplace listing lifecycle is fully launched and public).
- `demand_posted` (future demand model not yet implemented).
- `local_match_found` (future matching entity/event not yet implemented).
- `purchase_confirmed` (future transaction flow not yet implemented).
- `dispute_opened` (future trust/safety flow not yet implemented).
- `dispute_closed` (future trust/safety flow not yet implemented).
- `stage_transition_prompted` (future lifecycle automation prompting).

## F. Privacy Boundary

### Must stay in Supabase only
- Child name fields (`child_name`, `display_name`).
- Exact DOB and due date.
- Exact postcode and precise coordinates.
- Free-text notes (`marketplace_listings.notes`, other unstructured fields).
- Message contents (if introduced later).
- Sensitive inferred household state.

### Coarse traits potentially safe for analytics later
- Age band label/range (coarse stage).
- High-level route/surface usage.
- Boolean preference flags (for example reminders enabled).
- Aggregated count metrics (saved/seen/clicked totals).

### Must never be sent to analytics/lifecycle vendors
- Any child names.
- Exact DOB or due date.
- Exact postcode or precise location.
- Free-text notes and message content.
- Raw auth tokens/codes/emails.
- Any payload that can reveal sensitive family status via notification content.

## G. Recommended Next 3 PRs

- PostHog foundation: add vendor integration only after this contract is approved, with strict event allowlist and privacy middleware guardrails.
- Dashboards + bot/form guard: build minimum operational dashboards plus abuse/bot protection for auth and key forms using the now-locked event names.
- Tiny lifecycle POC: ship one opt-in reminder experiment off `development_reminders_enabled` using coarse stage traits only and no child-identifying data.
