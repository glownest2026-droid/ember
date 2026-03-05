# feat(marketplace): Pre-list flow (Figma exact) + wiring

## Goal
Single PR: Marketplace pre-launch listing flow implemented exactly from the Figma Make code pack, wired to PR1 backend (tables, RLS, pg_trgm RPC, storage bucket). End-to-end user success.

## Summary
- **Branch:** `feat/marketplace-prelist-figma-wiring`
- **Route:** `/marketplace` (logged-in): prelist widget above hero; modal flow for "List an item". `/app/listings`: view and manage pre-launch listings.
- **Backend:** Uses existing PR1 only — no schema or RLS changes.

## What was done

### 1. Prelist widget (logged-in only)
- Above hero on `/marketplace`: "Ready to pass anything on for {child}?" with CTA "List an item".
- Uses first non-suppressed child for name and age band label.

### 2. Listing modal (Figma exact)
- **Step 1 — What item:** Item name input; RPC `suggest_marketplace_item_types(query_text, 5)` for "Did you mean" suggestions; no auto-pick; "Not sure" clears type. Optional category chips and "List a bundle" toggle.
- **Step 2 — Condition + photos:** Condition (new / like-new / good / well-loved); optional quantity if bundle; photo upload to bucket `marketplace-listing-photos` at `{user_id}/{listing_id}/{uuid}.{ext}`; rows in `marketplace_listing_photos`; thumbnails via signed URLs.
- **Step 3 — Pickup area:** Postcode + radius; prefill from `marketplace_preferences`; "Save as my default area" upserts preferences; pickup-only (no post); optional "Email me when there's a strong match".
- **Step 4 — Pricing intent:** Decide later / rough price / free / open to offers; stored in listing notes.
- **Step 5 — Review:** Pre-launch badge "Not public yet"; optional "Email me when Marketplace launches" (writes to `user_notification_prefs.development_reminders_enabled`). Submit sets `status='submitted'`, `submitted_at=now()`.

### 3. Draft and submit
- Draft `marketplace_listings` row created on first "Next" (step 1 → 2) so `listing_id` exists for photo paths.
- Submit updates that row with all fields and sets status to submitted.

### 4. Success modal
- "Your item is saved for launch"; what happens next; "List another item"; "View my listings" → `/app/listings`; "Browse marketplace" → `/marketplace`.

### 5. My listings (`/app/listings`)
- Lists current user's listings (RLS): item label (type or raw text), condition, area/radius, photo thumbnails (signed URLs), "Not public yet".
- **Edit:** Links to `/marketplace?edit={id}`; modal opens prefilled; submit updates same row.
- **Delete:** Sets status to archived; deletes `marketplace_listing_photos` rows and storage objects.

## Tables touched (PR1 only)
- `marketplace_listings` — insert (draft), update (submit), select (listings page)
- `marketplace_listing_photos` — insert (after upload), select, delete (on listing delete)
- `marketplace_preferences` — select (prefill), upsert (save area)
- `marketplace_item_types` — read via RPC `suggest_marketplace_item_types`
- `user_notification_prefs` — upsert when "Email me when Marketplace launches" checked
- Storage bucket `marketplace-listing-photos` — upload, signed URL, delete

## How to verify

1. **Login** and open `/marketplace`. You should see the prelist widget above the hero ("Ready to pass anything on for {child}?").
2. **List an item:** Click "List an item" → Step 1: type "chair" → see "Did you mean" suggestions (e.g. Bath chair, High chair); pick one or "Not sure" → Next. Step 2: choose condition, optionally add a photo → Next. Step 3: enter postcode and radius (or use saved) → Next. Step 4: choose pricing intent → Next. Step 5: review, optionally check "Email me when Marketplace launches" → "Save pre-launch listing".
3. **Success:** Success modal appears; "View my listings" → `/app/listings`; listing appears with thumbnail and "Not public yet".
4. **Edit:** On `/app/listings`, click Edit (pencil) → redirects to `/marketplace?edit={id}` and modal opens prefilled; change and submit updates the same listing.
5. **Delete:** On `/app/listings`, click Delete (trash) → listing disappears; storage objects removed.
6. **RLS:** As another user (or anon), you cannot see the first user's listings or photos.

## Proof of done
- **Vercel preview URL:** (add after push)
- **Test script:** Login → /marketplace → List an item → type "chair" → pick "Bath chair" → upload 1 photo → submit → open /app/listings and confirm visible. Edit and Delete as above.
- **Build:** `pnpm -C web build` passes.
