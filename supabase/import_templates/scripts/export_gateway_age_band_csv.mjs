/**
 * Reads Supabase public gateway views and writes gateway_age_band_bulk_import_template.csv
 * for age_band_id = 25-27m (real production-shaped data).
 *
 * Usage (from repo root):
 *   node supabase/import_templates/scripts/export_gateway_age_band_csv.mjs
 *
 * Requires: web/.env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../../../web/.env.local');

function loadEnv() {
  const t = fs.readFileSync(envPath, 'utf8');
  let url;
  let key;
  for (const line of t.split(/\r?\n/)) {
    const m = line.match(/^NEXT_PUBLIC_SUPABASE_URL=(.+)$/);
    const m2 = line.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)$/);
    if (m) url = m[1].trim();
    if (m2) key = m2[1].trim();
  }
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in web/.env.local');
  return { url, key };
}

function esc(s) {
  if (s == null) return '';
  const x = String(s);
  if (/[",\r\n]/.test(x)) return `"${x.replace(/"/g, '""')}"`;
  return x;
}

const BAND = process.env.GATEWAY_EXPORT_BAND ?? '25-27m';
/** Also writes gateway_age_band_{band}_sample_{n}rows.csv — first product per distinct category (default 10). Set to 0 to skip. */
const SAMPLE_ROWS = process.env.GATEWAY_SAMPLE_ROWS
  ? parseInt(process.env.GATEWAY_SAMPLE_ROWS, 10)
  : 10;

const cols = [
  'age_band_id',
  'age_band_label',
  'min_months',
  'max_months',
  'age_band_is_active',
  'stage1_wrapper_ux_slug',
  'stage1_wrapper_ux_label',
  'stage1_wrapper_rank_in_band',
  'stage1_mapping_is_active',
  'development_need_slug',
  'development_need_canonical_name',
  'stage1_why_it_matters_ux_description',
  'stage2_category_type_slug',
  'stage2_category_type_label',
  'stage2_category_type_name',
  'stage2_play_ideas_rank',
  'stage2_play_idea_mapping_rationale',
  'stage3_product_name',
  'stage3_product_brand',
  'stage3_product_rank_in_category',
  'stage3_product_mapping_rationale',
  'optional_need_meta_stage_anchor_month',
  'optional_need_meta_stage_phase',
  'optional_need_meta_stage_reason',
  'optional_category_image_url',
  'optional_category_safety_notes',
  'ref_ux_wrapper_uuid',
  'ref_development_need_uuid',
  'ref_category_type_uuid',
  'ref_product_uuid',
];

async function main() {
  const { url, key } = loadEnv();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: 'application/json',
  };

  const [abRes, prodRes, catRes, wrapRes] = await Promise.all([
    fetch(`${url}/rest/v1/v_gateway_age_bands_public?id=eq.${BAND}&select=*`, { headers }),
    fetch(
      `${url}/rest/v1/v_gateway_products_public?age_band_id=eq.${BAND}&select=*&order=category_type_id.asc,rank.asc`,
      { headers }
    ),
    fetch(`${url}/rest/v1/v_gateway_category_types_public?age_band_id=eq.${BAND}&select=*`, { headers }),
    fetch(`${url}/rest/v1/v_gateway_wrapper_detail_public?age_band_id=eq.${BAND}&select=*`, { headers }),
  ]);

  if (!abRes.ok) throw new Error(`age_bands ${abRes.status} ${await abRes.text()}`);
  if (!prodRes.ok) throw new Error(`products ${prodRes.status} ${await prodRes.text()}`);
  if (!catRes.ok) throw new Error(`categories ${catRes.status} ${await catRes.text()}`);
  if (!wrapRes.ok) throw new Error(`wrappers ${wrapRes.status} ${await wrapRes.text()}`);

  const ab = (await abRes.json())[0];
  if (!ab) throw new Error(`Age band ${BAND} not found in v_gateway_age_bands_public`);

  const products = await prodRes.json();
  const cats = await catRes.json();
  const wraps = await wrapRes.json();

  const catById = Object.fromEntries(cats.map((c) => [c.id, c]));
  const wrapByNeed = Object.fromEntries(wraps.map((w) => [w.development_need_id, w]));

  const dataRows = [];

  for (const p of products) {
    const ct = catById[p.category_type_id];
    if (!ct) {
      console.warn('Skip product: unknown category_type_id', p.id, p.category_type_id);
      continue;
    }
    const w = wrapByNeed[ct.development_need_id];
    if (!w) {
      console.warn('Skip product: no wrapper for need', ct.development_need_id, p.id);
      continue;
    }

    const row = {
      age_band_id: ab.id,
      age_band_label: ab.label,
      min_months: ab.min_months,
      max_months: ab.max_months,
      age_band_is_active: 'true',
      stage1_wrapper_ux_slug: w.ux_slug,
      stage1_wrapper_ux_label: w.ux_label,
      stage1_wrapper_rank_in_band: w.rank,
      stage1_mapping_is_active: 'true',
      development_need_slug: w.development_need_slug,
      development_need_canonical_name: w.development_need_name,
      stage1_why_it_matters_ux_description: w.ux_description ?? '',
      stage2_category_type_slug: ct.slug,
      stage2_category_type_label: ct.label ?? '',
      stage2_category_type_name: ct.name ?? '',
      stage2_play_ideas_rank: ct.rank,
      stage2_play_idea_mapping_rationale: ct.rationale ?? '',
      stage3_product_name: p.name,
      stage3_product_brand: p.brand ?? '',
      stage3_product_rank_in_category: p.rank,
      stage3_product_mapping_rationale: p.rationale ?? '',
      optional_need_meta_stage_anchor_month: w.stage_anchor_month ?? '',
      optional_need_meta_stage_phase: w.stage_phase ?? '',
      optional_need_meta_stage_reason: w.stage_reason ?? '',
      optional_category_image_url: ct.image_url ?? '',
      optional_category_safety_notes: ct.safety_notes ?? '',
      ref_ux_wrapper_uuid: w.ux_wrapper_id,
      ref_development_need_uuid: w.development_need_id,
      ref_category_type_uuid: ct.id,
      ref_product_uuid: p.id,
    };

    dataRows.push(row);
  }

  const toLine = (row) => cols.map((c) => esc(row[c])).join(',');
  const out = [cols.join(','), ...dataRows.map(toLine)];

  const dir = path.join(__dirname, '..');
  const target = path.join(dir, 'gateway_age_band_bulk_import_template.csv');
  fs.writeFileSync(target, out.join('\r\n'), 'utf8');
  console.log(`Wrote ${dataRows.length} data rows to ${target}`);

  if (SAMPLE_ROWS > 0) {
    const seen = new Set();
    const sampleData = [];
    for (const row of dataRows) {
      if (seen.has(row.ref_category_type_uuid)) continue;
      seen.add(row.ref_category_type_uuid);
      sampleData.push(row);
      if (sampleData.length >= SAMPLE_ROWS) break;
    }
    const samplePath = path.join(dir, `gateway_age_band_${BAND}_sample_${sampleData.length}rows.csv`);
    fs.writeFileSync(samplePath, [cols.join(','), ...sampleData.map(toLine)].join('\r\n'), 'utf8');
    console.log(`Wrote ${sampleData.length} sample rows to ${samplePath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
