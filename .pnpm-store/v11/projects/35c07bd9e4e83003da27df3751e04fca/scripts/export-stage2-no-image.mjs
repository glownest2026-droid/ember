/**
 * Export active Stage 2 category cards with no founder-managed image.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const webRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.join(webRoot, '..');
const env = fs.readFileSync(path.join(webRoot, '.env.local'), 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();
const supabase = createClient(url, key);

const { data: cards, error: cardsErr } = await supabase
  .from('v_gateway_category_types_public')
  .select('age_band_id, id, slug, label, display_label, name, rank')
  .order('age_band_id')
  .order('rank');
if (cardsErr) throw cardsErr;

const { data: images, error: imgErr } = await supabase
  .from('v_gateway_category_type_images')
  .select('category_type_id, age_band_id');
if (imgErr) throw imgErr;

const imagesByCategory = new Map();
for (const img of images ?? []) {
  const list = imagesByCategory.get(img.category_type_id) ?? [];
  list.push(img);
  imagesByCategory.set(img.category_type_id, list);
}

function hasManagedImage(categoryTypeId, ageBandId) {
  const list = imagesByCategory.get(categoryTypeId) ?? [];
  return list.some((r) => r.age_band_id === ageBandId || r.age_band_id == null);
}

const { data: bands } = await supabase
  .from('v_gateway_age_bands_public')
  .select('id, label')
  .order('min_months');
const bandLabel = new Map((bands ?? []).map((b) => [b.id, b.label]));

const missing = (cards ?? []).filter((c) => !hasManagedImage(c.id, c.age_band_id));

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const header = [
  'age_band_id',
  'age_band_label',
  'category_entity_id',
  'category_type_id',
  'display_name',
];
const lines = [header.join(',')];
for (const c of missing) {
  lines.push(
    [
      c.age_band_id,
      bandLabel.get(c.age_band_id) ?? '',
      c.slug,
      c.id,
      c.label ?? c.display_label ?? c.name ?? '',
    ]
      .map(csvEscape)
      .join(',')
  );
}

const outDir = path.join(repoRoot, 'agent-tools/exports');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'stage2_categories_no_image.csv');
fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');

const byBand = {};
for (const c of missing) {
  byBand[c.age_band_id] = (byBand[c.age_band_id] ?? 0) + 1;
}

console.log(
  JSON.stringify(
    {
      total_active_stage2: cards.length,
      missing_managed_image: missing.length,
      by_band: byBand,
      csv: outPath,
    },
    null,
    2
  )
);
