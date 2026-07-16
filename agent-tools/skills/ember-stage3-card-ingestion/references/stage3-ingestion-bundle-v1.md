# Stage 3 Ingestion Bundle v1

Use this standard handoff between `$ember-stage3-research` and `$ember-stage3-card-ingestion`.

## Generator

Prefer the repo script:

```bash
node web/scripts/ingest-stage3-pips-picks.mjs \
  --age-band=34-36m \
  --inputs=agent-tools/exports/ember_picks_34-36m_*.json
```

Outputs:

- `agent-tools/exports/stage3_ingestion_bundle_[AGE_BAND].json`
- `agent-tools/exports/stage3_ingestion_bundle_[AGE_BAND]_qa.md`
- `supabase/migrations/[TIMESTAMP]_ingest_stage3_pips_picks_[AGE_BAND].sql`

Use `--dry-run` to validate without writing files. Use `--timestamp=YYYYMMDDHHMMSS` when a deterministic migration filename is needed.

## Bundle Shape

```json
{
  "schema_version": "stage3_ingestion_bundle_v1",
  "generated_at": "ISO timestamp",
  "age_band_id": "34-36m",
  "locked_from_rank": 2,
  "founder_paid_proxy_email": "timwd23@gmail.com",
  "categories": [
    {
      "source_file": "agent-tools/exports/ember_picks_34-36m_cat_example.json",
      "schema_version": "ember_picks_research_v2",
      "research_date": "YYYY-MM-DD",
      "age_band_id": "34-36m",
      "category_entity_id": "cat_example",
      "category_label": "Example category",
      "cluster_entity_id": "ent_cluster_example",
      "cluster_label": "Example Stage 1 card",
      "qa_summary": {},
      "top_picks": [],
      "backup_picks": [],
      "skips": [],
      "errors": [],
      "warnings": [],
      "ingestion_ready": "pass"
    }
  ],
  "acceptance_checks": {
    "top_5_per_category": true,
    "backups_6_to_15_per_category": true,
    "no_banned_copy": true,
    "all_categories_ingestion_ready": true
  }
}
```

## Acceptance

Do not ingest a bundle when `all_categories_ingestion_ready` is false unless the founder explicitly chooses founder-review-only publication. Fix the research first when:

- Top 5 count is not exactly 5.
- Longlist ranks 6-15 cannot produce 10 backups.
- Any Top Pick lacks `best_for_tag`, product description, Ember verdict, or URL/QA flag.
- Parent-facing copy contains banned brand language.
- The Stage 2 category mapping is missing or ambiguous.

## Standard Access Pattern

The generated migration must preserve this pattern:

- `pl_stage3_picks` stores visible and backup rows.
- RLS allows all users to read visible unlocked rows.
- RLS allows `timwd23@gmail.com` to read locked visible rows.
- The public view only exposes unlocked rows and uses `security_invoker = true`.
- The app route reads the RLS table server-side and returns locked placeholders for non-founder viewers.

## Standard Smoke Test

After deployment and migration:

```powershell
$r=Invoke-RestMethod 'https://PREVIEW_URL/api/discover/picks?ageBandId=AGE_BAND&categoryTypeId=CATEGORY_TYPE_UUID'
$r.picks | Select-Object @{n='rank';e={$_.product.rank}}, @{n='name';e={$_.product.name}}, @{n='locked';e={$_.product.is_locked}}, @{n='url';e={$_.product.canonical_url}}
```

Expected signed-out result:

- Rank 1 is a real product with URL.
- Ranks 2-5 are locked placeholders.
- Ranks 2-5 do not include real retailer URLs.
