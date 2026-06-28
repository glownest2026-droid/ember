/**
 * Generate migration from stage2_storage_audit.json global hits.
 * Usage: node web/scripts/generate-global-image-map-sql.mjs [--write]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { q } from '../../scripts/spine-v2-slug-canonical.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const write = process.argv.includes('--write');

const data = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'agent-tools/exports/stage2_storage_audit.json'), 'utf8')
);
const byCat = new Map();
for (const f of data.found) {
  if (!byCat.has(f.category_type_id)) byCat.set(f.category_type_id, f);
}
const rows = [...byCat.values()];

const valueLines = rows
  .map((r) => `      ('${r.category_type_id}'::uuid, NULL, ${q(r.storage_url)})`)
  .join(',\n');

const sql = `-- Ops: map new Make category_images -> pl_category_type_images (global fallback)
-- ${rows.length} Storage files from audit ${data.summary?.total ?? '?'} DB-missing rows scanned
-- Audit: ${data.summary?.storage_exists ?? '?'} in Storage, ${data.summary?.truly_missing ?? '?'} still absent

BEGIN;

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT *
    FROM (VALUES
${valueLines}
    ) AS t(category_type_id, age_band_id, image_url)
  LOOP
    UPDATE public.pl_category_type_images
    SET is_active = false
    WHERE category_type_id = rec.category_type_id
      AND age_band_id IS NULL
      AND is_active = true
      AND image_url IS DISTINCT FROM rec.image_url;

    IF NOT EXISTS (
      SELECT 1
      FROM public.pl_category_type_images existing
      WHERE existing.category_type_id = rec.category_type_id
        AND existing.age_band_id IS NULL
        AND existing.is_active = true
        AND existing.image_url = rec.image_url
    ) THEN
      INSERT INTO public.pl_category_type_images (
        category_type_id, age_band_id, image_url, alt, is_active, sort
      )
      VALUES (rec.category_type_id, rec.age_band_id, rec.image_url, NULL, true, 0);
    END IF;
  END LOOP;
END $$;

COMMIT;
`;

const migrationPath = path.join(
  ROOT,
  'supabase/migrations/20260628230000_map_final_9_12m_category_images.sql'
);
const mirrorPath = path.join(ROOT, 'supabase/sql/202606282300_map_final_9_12m_category_images.sql');

if (write) {
  fs.writeFileSync(migrationPath, sql, 'utf8');
  fs.writeFileSync(mirrorPath, sql, 'utf8');
  console.log(`Wrote ${migrationPath} (${rows.length} rows)`);
} else {
  console.log(`Would write ${rows.length} global mappings`);
}
