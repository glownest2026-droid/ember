/**
 * Full rebuild of Leaf - Master Library.xlsx Master_Library sheet.
 *
 * - Active bands: discover_projection from 5 Spine 2.0 ABI workbooks (canonical cat_* slugs)
 * - Deprecated 6-9m: preserved from existing Master_Library (42 rows, well-formed)
 * - Adds: band_status, storage_filename, image_mapped
 *
 * Usage: node scripts/rebuild-master-library.mjs [--write]
 */
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import {
  SOURCE_DIR,
  SOURCE_FILES,
  proposeCanonical,
} from './spine-v2-slug-canonical.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MASTER_PATH =
  'G:/My Drive/Project Leaf/Project Leaf - Database Builds/Spine Build 2.0/Spine Build PACK 2.0/Leaf - Master Library.xlsx';
const BACKUP_DIR = path.join(ROOT, 'agent-tools/backups/master-library-pre-rebuild');
const write = process.argv.includes('--write');

const BAND_ORDER = ['age_1_3m', 'age_4_6m', 'age_6_9m', 'age_9_12m', 'age_13_15m', 'age_16_18m'];
const ALT_BAND_TOKENS = { '9-12m': ['9_12m', '10_12m'] };

function workbookBandToRepo(ageBandId) {
  return String(ageBandId || '')
    .replace(/^age_/, '')
    .replace(/_/g, '-');
}

function repoBandToToken(repoBand) {
  return repoBand.replace(/-/g, '_');
}

function bandTokens(repoBand) {
  return ALT_BAND_TOKENS[repoBand] ?? [repoBandToToken(repoBand)];
}

function expectedFilenames(slug, repoBand) {
  const names = [];
  for (const token of bandTokens(repoBand)) {
    names.push(`ember_${slug}_${token}_category.png`);
  }
  names.push(`ember_${slug}_category.png`);
  return names;
}

function filenameFromUrl(url) {
  if (!url) return '';
  const m = url.match(/\/category_images\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

function mapDiscoverRow(row, bandStatus) {
  const slug = proposeCanonical(String(row.category_entity_id || '').trim());
  const repoBand = workbookBandToRepo(row.age_band_id);
  return {
    age_band_id: String(row.age_band_id || '').trim(),
    band_status: bandStatus,
    cluster_entity_id: String(row.cluster_entity_id || '').trim(),
    cluster_label: row.cluster_label ?? '',
    cluster_parent_friendly_label: row.cluster_label_parent_friendly ?? row.cluster_parent_friendly_label ?? '',
    cluster_why_it_matters_short: row.cluster_why_it_matters_short ?? '',
    cluster_why_it_matters_long: row.cluster_why_it_matters_long ?? '',
    cluster_rank: row.cluster_rank ?? '',
    cluster_audience_lens: row.audience_lens ?? row.cluster_audience_lens ?? '',
    category_entity_id: slug,
    category_label: row.category_label ?? '',
    category_rank: row.category_rank ?? '',
    audience_lens: row.audience_lens ?? '',
    why_it_matters_short: row.why_it_matters_short ?? '',
    why_it_matters_long: row.why_it_matters_long ?? '',
    mapping_rationale: row.mapping_rationale ?? '',
    safety_note_public: row.safety_note_public ?? '',
    evidence_ids: row.evidence_ids ?? '',
    review_status: bandStatus === 'active' ? 'approved' : 'deprecated',
    _repo_band: repoBand,
    _slug: slug,
  };
}

function mapLegacyRow(row) {
  const out = mapDiscoverRow(
    {
      ...row,
      cluster_label_parent_friendly: row.cluster_parent_friendly_label,
    },
    'deprecated — pre-Spine 2.0'
  );
  out.review_status = row.review_status || 'deprecated';
  return out;
}

async function loadImageMap() {
  const env = fs.readFileSync(path.join(ROOT, 'web/.env.local'), 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim().replace(/\/$/, '');
  const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  async function fetchAll(table, select) {
    const res = await fetch(`${url}/rest/v1/${table}?select=${encodeURIComponent(select)}`, { headers });
    if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
    return res.json();
  }

  const imgs = await fetchAll('v_gateway_category_type_images', 'category_type_id,age_band_id,image_url');
  const cards = await fetchAll('v_gateway_category_types_public', 'id,slug,age_band_id');
  const slugById = new Map(cards.map((c) => [c.id, c.slug]));

  /** slug -> { bands: Map<band|null, url>, globalUrl } */
  const bySlug = new Map();
  for (const img of imgs) {
    const slug = slugById.get(img.category_type_id);
    if (!slug) continue;
    const entry = bySlug.get(slug) ?? { bands: new Map(), globalUrl: null };
    if (img.age_band_id == null) {
      entry.globalUrl = img.image_url;
      entry.bands.set('global', img.image_url);
    } else {
      entry.bands.set(img.age_band_id, img.image_url);
    }
    bySlug.set(slug, entry);
  }
  return bySlug;
}

function applyImageFields(row, imageMap) {
  const { _slug: slug, _repo_band: repoBand } = row;
  const entry = imageMap.get(slug);
  const bandUrl = entry?.bands.get(repoBand);
  const globalUrl = entry?.globalUrl;
  const mapped = Boolean(bandUrl || globalUrl);

  let storageFilename = '';
  if (bandUrl) storageFilename = filenameFromUrl(bandUrl);
  else if (globalUrl) storageFilename = filenameFromUrl(globalUrl);
  else storageFilename = expectedFilenames(slug, repoBand)[0];

  return {
    ...row,
    storage_filename: storageFilename,
    image_mapped: mapped ? 'yes' : 'no',
  };
}

function stripInternal(row) {
  const { _repo_band, _slug, ...rest } = row;
  return rest;
}

function sortRows(rows) {
  return [...rows].sort((a, b) => {
    const bi = BAND_ORDER.indexOf(a.age_band_id) - BAND_ORDER.indexOf(b.age_band_id);
    if (bi !== 0) return bi;
    const cr = Number(a.cluster_rank) - Number(b.cluster_rank);
    if (cr !== 0) return cr;
    return Number(a.category_rank) - Number(b.category_rank);
  });
}

async function main() {
  if (!fs.existsSync(MASTER_PATH)) throw new Error(`Master Library not found: ${MASTER_PATH}`);

  const imageMap = await loadImageMap();

  const activeRows = [];
  for (const { file, defaultBand } of SOURCE_FILES) {
    const wb = XLSX.readFile(path.join(SOURCE_DIR, file));
    const rows = XLSX.utils.sheet_to_json(wb.Sheets.discover_projection, { defval: '' });
    for (const row of rows) {
      const cat = String(row.category_entity_id || '').trim();
      const cluster = String(row.cluster_entity_id || '').trim();
      if (!cat || !cluster) continue;
      if (!row.age_band_id) row.age_band_id = `age_${defaultBand.replace(/-/g, '_')}`;
      activeRows.push(mapDiscoverRow(row, 'active'));
    }
  }

  const legacyWb = XLSX.readFile(MASTER_PATH);
  const legacyRows = XLSX.utils.sheet_to_json(legacyWb.Sheets.Master_Library, { defval: '' });
  const deprecatedRows = legacyRows
    .filter((r) => r.age_band_id === 'age_6_9m' && /^cat_/.test(String(r.category_entity_id || '')))
    .map(mapLegacyRow);

  const combined = sortRows(
    [...activeRows, ...deprecatedRows].map((r) => stripInternal(applyImageFields(r, imageMap)))
  );

  const summary = {
    total_rows: combined.length,
    active: combined.filter((r) => r.band_status === 'active').length,
    deprecated_6_9m: combined.filter((r) => r.band_status === 'deprecated — pre-Spine 2.0').length,
    image_mapped_yes: combined.filter((r) => r.image_mapped === 'yes').length,
    image_mapped_no: combined.filter((r) => r.image_mapped === 'no').length,
    by_band: Object.fromEntries(
      BAND_ORDER.map((b) => [b, combined.filter((r) => r.age_band_id === b).length]).filter(([, n]) => n > 0)
    ),
  };

  console.log(JSON.stringify(summary, null, 2));

  const outDir = path.join(ROOT, 'agent-tools/exports');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'master_library_rebuild_summary.json'), `${JSON.stringify(summary, null, 2)}\n`);

  if (!write) {
    console.log('\nRe-run with --write to backup and update Master Library xlsx.');
    return;
  }

  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(MASTER_PATH, path.join(BACKUP_DIR, `Leaf - Master Library.${stamp}.xlsx`));

  const wb = XLSX.readFile(MASTER_PATH);
  const sheet = XLSX.utils.json_to_sheet(combined);
  wb.Sheets.Master_Library = sheet;
  if (!wb.SheetNames.includes('Master_Library')) wb.SheetNames.push('Master_Library');
  XLSX.writeFile(wb, MASTER_PATH);

  console.log(`Updated ${MASTER_PATH}`);
  console.log(`Backup: ${BACKUP_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
