/**
 * Scan category_images Storage (HEAD probes) + crosswalk aliases;
 * generate pl_category_type_images upserts for cards missing band/global mappings.
 *
 * Usage: node web/scripts/generate-category-image-repoint.mjs [--write]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { q } from '../../scripts/spine-v2-slug-canonical.mjs';

const webRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.join(webRoot, '..');
const env = fs.readFileSync(path.join(webRoot, '.env.local'), 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim().replace(/\/$/, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();
const supabase = createClient(supabaseUrl, supabaseKey);
const writeMigration = process.argv.includes('--write');

const BAND_ORDER = ['1-3m', '4-6m', '9-12m', '13-15m', '16-18m'];
const ALT_BAND_TOKENS = {
  '9-12m': ['9_12m', '10_12m'],
};

function ageBandIdToFileToken(ageBandId) {
  return ageBandId.replace(/^age_/, '').replace(/-/g, '_');
}

function bandTokens(ageBandId) {
  return ALT_BAND_TOKENS[ageBandId] ?? [ageBandIdToFileToken(ageBandId)];
}

function publicUrl(filename) {
  return `${supabaseUrl}/storage/v1/object/public/category_images/${encodeURIComponent(filename)}`;
}

function parseEmberFilename(name) {
  if (!name.startsWith('ember_') || !name.endsWith('_category.png')) return null;
  const inner = name.slice(6, -'_category.png'.length);
  for (const bandId of BAND_ORDER) {
    for (const token of bandTokens(bandId)) {
      const suffix = `_${token}`;
      if (inner.endsWith(suffix)) {
        return { slug: inner.slice(0, -suffix.length), ageBandId: bandId, scope: 'band' };
      }
    }
  }
  return { slug: inner, ageBandId: null, scope: 'global' };
}

function loadCrosswalkAliases() {
  const csv = fs.readFileSync(path.join(ROOT, 'agent-tools/exports/category_slug_crosswalk.csv'), 'utf8');
  const aliasesByCanonical = new Map();
  for (const line of csv.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const cols = line.split(',');
    const sourceSlug = cols[0];
    const canonicalSlug = cols[1];
    if (!sourceSlug || !canonicalSlug) continue;
    const list = aliasesByCanonical.get(canonicalSlug) ?? new Set();
    list.add(sourceSlug);
    list.add(canonicalSlug);
    aliasesByCanonical.set(canonicalSlug, list);
  }
  return aliasesByCanonical;
}

function candidateFilenames(canonicalSlug, ageBandId, aliases) {
  const slugs = [...aliases];
  const names = [];
  for (const token of bandTokens(ageBandId)) {
    for (const slug of slugs) {
      names.push(`ember_${slug}_${token}_category.png`);
    }
  }
  for (const slug of slugs) {
    names.push(`ember_${slug}_category.png`);
  }
  return [...new Set(names)];
}

async function headExists(filename) {
  const url = publicUrl(filename);
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok ? filename : null;
  } catch {
    return null;
  }
}

async function probeFirstMatch(filenames, concurrency = 24) {
  for (let i = 0; i < filenames.length; i += concurrency) {
    const batch = filenames.slice(i, i + concurrency);
    const results = await Promise.all(batch.map((f) => headExists(f).then((ok) => (ok ? f : null))));
    const hit = results.find(Boolean);
    if (hit) return hit;
  }
  return null;
}

function hasBandOrGlobal(imagesByCategory, categoryTypeId, ageBandId) {
  const list = imagesByCategory.get(categoryTypeId) ?? [];
  return list.some((r) => r.age_band_id === ageBandId || r.age_band_id == null);
}

function pickCrossBandFallback(existingRows, targetBand) {
  if (!existingRows.length) return null;
  const global = existingRows.find((r) => r.age_band_id == null);
  if (global) return global.image_url;
  const targetIdx = BAND_ORDER.indexOf(targetBand);
  const sorted = [...existingRows].sort((a, b) => {
    const ai = BAND_ORDER.indexOf(a.age_band_id ?? '');
    const bi = BAND_ORDER.indexOf(b.age_band_id ?? '');
    const ad = ai < 0 ? 999 : Math.abs(ai - targetIdx);
    const bd = bi < 0 ? 999 : Math.abs(bi - targetIdx);
    return ad - bd || ai - bi;
  });
  return sorted[0]?.image_url ?? null;
}

function buildUpsertBlock(rows) {
  if (!rows.length) return '-- No new mappings to upsert.\n';
  const valueLines = rows
    .map((r) => `      ('${r.category_type_id}'::uuid, ${q(r.age_band_id)}, ${q(r.image_url)})`)
    .join(',\n');

  return `-- Upsert ${rows.length} founder-managed category image mapping(s).

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
      AND COALESCE(age_band_id, '__global__') = COALESCE(rec.age_band_id, '__global__')
      AND is_active = true
      AND image_url IS DISTINCT FROM rec.image_url;

    IF NOT EXISTS (
      SELECT 1
      FROM public.pl_category_type_images existing
      WHERE existing.category_type_id = rec.category_type_id
        AND COALESCE(existing.age_band_id, '__global__') = COALESCE(rec.age_band_id, '__global__')
        AND existing.is_active = true
        AND existing.image_url = rec.image_url
    ) THEN
      INSERT INTO public.pl_category_type_images (
        category_type_id,
        age_band_id,
        image_url,
        alt,
        is_active,
        sort
      )
      VALUES (
        rec.category_type_id,
        rec.age_band_id,
        rec.image_url,
        NULL,
        true,
        0
      );
    END IF;
  END LOOP;
END $$;
`;
}

async function main() {
  const aliasesByCanonical = loadCrosswalkAliases();

  const { data: cards, error: cardsErr } = await supabase
    .from('v_gateway_category_types_public')
    .select('age_band_id, id, slug, label')
    .order('age_band_id');
  if (cardsErr) throw cardsErr;

  const { data: images, error: imgErr } = await supabase
    .from('v_gateway_category_type_images')
    .select('category_type_id, age_band_id, image_url');
  if (imgErr) throw imgErr;

  const imagesByCategory = new Map();
  for (const img of images ?? []) {
    const list = imagesByCategory.get(img.category_type_id) ?? [];
    list.push(img);
    imagesByCategory.set(img.category_type_id, list);
  }

  const missing = (cards ?? []).filter((c) => !hasBandOrGlobal(imagesByCategory, c.id, c.age_band_id));

  const upserts = [];
  const storageHits = [];
  const crossBandHits = [];
  const unresolved = [];

  for (const card of missing) {
    const aliases = [...(aliasesByCanonical.get(card.slug) ?? new Set([card.slug]))];
    const filenames = candidateFilenames(card.slug, card.age_band_id, aliases);
    const matchedFile = await probeFirstMatch(filenames);

    if (matchedFile) {
      const parsed = parseEmberFilename(matchedFile);
      const scopeBand = parsed?.scope === 'band' ? card.age_band_id : card.age_band_id;
      upserts.push({
        category_type_id: card.id,
        age_band_id: scopeBand,
        image_url: publicUrl(matchedFile),
        slug: card.slug,
        age_band_id_card: card.age_band_id,
        source: 'storage',
        filename: matchedFile,
      });
      storageHits.push(card);
      continue;
    }

    const existing = imagesByCategory.get(card.id) ?? [];
    const fallbackUrl = pickCrossBandFallback(existing, card.age_band_id);
    if (fallbackUrl) {
      upserts.push({
        category_type_id: card.id,
        age_band_id: card.age_band_id,
        image_url: fallbackUrl,
        slug: card.slug,
        age_band_id_card: card.age_band_id,
        source: 'cross_band',
        filename: fallbackUrl.split('/').pop(),
      });
      crossBandHits.push(card);
      continue;
    }

    unresolved.push(card);
  }

  const summary = {
    missing_before: missing.length,
    upsert_count: upserts.length,
    storage_hits: storageHits.length,
    cross_band_hits: crossBandHits.length,
    unresolved_count: unresolved.length,
    by_band: Object.fromEntries(
      BAND_ORDER.map((b) => [b, upserts.filter((u) => u.age_band_id_card === b).length]).filter(([, n]) => n > 0)
    ),
  };

  console.log(JSON.stringify(summary, null, 2));

  const outDir = path.join(ROOT, 'agent-tools/exports');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'category_image_repoint_plan.json'),
    `${JSON.stringify({ summary, upserts, unresolved }, null, 2)}\n`,
    'utf8'
  );

  const sqlBody = buildUpsertBlock(
    upserts.map(({ category_type_id, age_band_id, image_url }) => ({
      category_type_id,
      age_band_id,
      image_url,
    }))
  );
  const fullSql = `-- Ops: repoint category_images Storage -> pl_category_type_images (post slug cleanup)
-- Generated by web/scripts/generate-category-image-repoint.mjs
-- ${upserts.length} upserts (${storageHits.length} storage, ${crossBandHits.length} cross-band); ${unresolved.length} cards still without match

BEGIN;

${sqlBody}
COMMIT;
`;

  const migrationName = '20260628200000_repoint_category_images_post_slug_cleanup.sql';
  const migrationPath = path.join(ROOT, 'supabase/migrations', migrationName);
  const sqlMirrorPath = path.join(ROOT, 'supabase/sql/202606282000_repoint_category_images_post_slug_cleanup.sql');

  if (writeMigration) {
    fs.writeFileSync(migrationPath, fullSql, 'utf8');
    fs.writeFileSync(sqlMirrorPath, fullSql, 'utf8');
    console.log(`Wrote ${migrationPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
