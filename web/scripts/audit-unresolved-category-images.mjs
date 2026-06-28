/**
 * Exhaustive Storage HEAD audit for stage2_categories_no_image.csv rows.
 * Probes canonical + legacy alias filename patterns.
 *
 * Usage: node web/scripts/audit-unresolved-category-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { proposeCanonical } from '../../scripts/spine-v2-slug-canonical.mjs';

const webRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.join(webRoot, '..');
const env = fs.readFileSync(path.join(webRoot, '.env.local'), 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim().replace(/\/$/, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();
const supabase = createClient(supabaseUrl, supabaseKey);

const BAND_TOKENS = {
  '1-3m': ['1_3m'],
  '4-6m': ['4_6m'],
  '9-12m': ['9_12m', '10_12m'],
  '13-15m': ['13_15m'],
  '16-18m': ['16_18m'],
};

function loadCrosswalk() {
  const csv = fs.readFileSync(path.join(ROOT, 'agent-tools/exports/category_slug_crosswalk.csv'), 'utf8');
  const aliasesByCanonical = new Map();
  const canonicalBySource = new Map();
  for (const line of csv.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const [source, canonical] = line.split(',');
    if (!source || !canonical) continue;
    canonicalBySource.set(source, canonical);
    const set = aliasesByCanonical.get(canonical) ?? new Set();
    set.add(source);
    set.add(canonical);
    aliasesByCanonical.set(canonical, set);
  }
  return { aliasesByCanonical, canonicalBySource };
}

function slugVariants(slug, bandId) {
  const variants = new Set([slug]);
  // band-prefixed legacy forms
  const bandPrefix = bandId.replace(/-/g, '_').replace(/m$/, 'm');
  if (slug.startsWith('cat_') && !slug.startsWith(`cat_${bandPrefix.replace('-', '_')}`)) {
    variants.add(`cat_${bandId.replace(/-/g, '_')}_${slug.slice(4)}`);
    variants.add(`cat_${bandId.replace(/-/g, '_')}${slug.slice(3)}`);
  }
  variants.add(`ent_${slug}`);
  if (slug.startsWith('cat_')) {
    variants.add(`ent_cat_${slug.slice(4)}`);
    variants.add(slug.slice(4)); // no cat_ prefix
  }
  return [...variants];
}

function candidateFilenames(slug, bandId, aliases) {
  const tokens = BAND_TOKENS[bandId] ?? [bandId.replace(/-/g, '_')];
  const slugs = new Set();
  for (const s of aliases) {
    for (const v of slugVariants(s, bandId)) slugs.add(v);
  }
  for (const v of slugVariants(slug, bandId)) slugs.add(v);

  const names = [];
  for (const s of slugs) {
    for (const token of tokens) {
      names.push(`ember_${s}_${token}_category.png`);
    }
    names.push(`ember_${s}_category.png`);
    // legacy without ember_ prefix
    for (const token of tokens) {
      names.push(`${s}_${token}_category.png`);
    }
    names.push(`${s}_category.png`);
  }
  return [...new Set(names)];
}

async function headOk(filename) {
  const url = `${supabaseUrl}/storage/v1/object/public/category_images/${encodeURIComponent(filename)}`;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok ? { filename, url } : null;
  } catch {
    return null;
  }
}

async function probeBatch(filenames, concurrency = 32) {
  for (let i = 0; i < filenames.length; i += concurrency) {
    const batch = filenames.slice(i, i + concurrency);
    const results = await Promise.all(batch.map((f) => headOk(f).then((r) => (r ? { ...r } : null))));
    const hit = results.find(Boolean);
    if (hit) return hit;
  }
  return null;
}

function parseCsv(path) {
  const lines = fs.readFileSync(path, 'utf8').trim().split('\n');
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cols = [];
    let cur = '';
    let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { cols.push(cur); cur = ''; continue; }
      cur += ch;
    }
    cols.push(cur);
    const row = {};
    header.forEach((h, i) => { row[h.trim()] = cols[i]?.trim(); });
    return row;
  });
}

async function main() {
  const { aliasesByCanonical } = loadCrosswalk();
  const rows = parseCsv(path.join(ROOT, 'agent-tools/exports/stage2_categories_no_image.csv'));

  const { data: dbImages } = await supabase
    .from('pl_category_type_images')
    .select('category_type_id, age_band_id, image_url, is_active')
    .eq('is_active', true);

  const dbByCategory = new Map();
  for (const img of dbImages ?? []) {
    const list = dbByCategory.get(img.category_type_id) ?? [];
    list.push(img);
    dbByCategory.set(img.category_type_id, list);
  }

  const found = [];
  const notFound = [];

  for (const row of rows) {
    const slug = row.category_entity_id;
    const bandId = row.age_band_id;
    const aliases = [...(aliasesByCanonical.get(slug) ?? [slug])];
    const names = candidateFilenames(slug, bandId, aliases);
    const hit = await probeBatch(names);

    const dbRows = dbByCategory.get(row.category_type_id) ?? [];
    const hasBandOrGlobal = dbRows.some((r) => r.age_band_id === bandId || r.age_band_id == null);

    if (hit) {
      found.push({
        slug,
        bandId,
        display_name: row.display_name,
        category_type_id: row.category_type_id,
        storage_file: hit.filename,
        storage_url: hit.url,
        has_db_mapping: hasBandOrGlobal,
        db_rows: dbRows.map((r) => ({ age_band_id: r.age_band_id, file: r.image_url?.split('/').pop() })),
      });
    } else {
      notFound.push({ slug, bandId, display_name: row.display_name });
    }
  }

  const summary = {
    total: rows.length,
    storage_exists: found.length,
    storage_exists_no_db: found.filter((f) => !f.has_db_mapping).length,
    storage_exists_has_db: found.filter((f) => f.has_db_mapping).length,
    truly_missing: notFound.length,
    by_band: Object.fromEntries(
      ['9-12m', '13-15m', '16-18m'].map((b) => [
        b,
        {
          exists: found.filter((f) => f.bandId === b).length,
          missing: notFound.filter((f) => f.bandId === b).length,
        },
      ])
    ),
  };

  console.log(JSON.stringify(summary, null, 2));

  const outDir = path.join(ROOT, 'agent-tools/exports');
  fs.writeFileSync(
    path.join(outDir, 'stage2_storage_audit.json'),
    `${JSON.stringify({ summary, found, notFound }, null, 2)}\n`
  );

  // CSV for Make: rows where storage exists but DB mapping missing
  const needsMapping = found.filter((f) => !f.has_db_mapping);
  const csvLines = [
    'age_band_id,category_entity_id,category_type_id,display_name,storage_filename,storage_url,action',
    ...needsMapping.map((f) =>
      [f.bandId, f.slug, f.category_type_id, `"${f.display_name.replace(/"/g, '""')}"`, f.storage_file, f.storage_url, 'map_only_skip_upload'].join(',')
    ),
  ];
  fs.writeFileSync(path.join(outDir, 'stage2_storage_exists_needs_mapping.csv'), `${csvLines.join('\n')}\n`);

  console.log(`\nWrote agent-tools/exports/stage2_storage_audit.json`);
  console.log(`Wrote agent-tools/exports/stage2_storage_exists_needs_mapping.csv (${needsMapping.length} rows)`);
  if (found.length) {
    console.log('\nSample storage hits:');
    for (const f of found.slice(0, 10)) {
      console.log(`  ${f.slug}@${f.bandId} -> ${f.storage_file} (db=${f.has_db_mapping})`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
