/**
 * Append discover_projection rows to Leaf - Master Library.xlsx (Master_Library sheet).
 * Usage:
 *   node scripts/update-master-library-from-discover.mjs "path/to/workbook1.xlsx" ...
 */
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const MASTER_PATH =
  'G:/My Drive/Project Leaf/Project Leaf - Database Builds/Spine Build 2.0/Spine Build PACK 2.0/Leaf - Master Library.xlsx';

const MASTER_COLUMNS = [
  'age_band_id',
  'band_status',
  'cluster_entity_id',
  'cluster_label',
  'cluster_parent_friendly_label',
  'cluster_why_it_matters_short',
  'cluster_why_it_matters_long',
  'cluster_rank',
  'cluster_audience_lens',
  'category_entity_id',
  'category_label',
  'category_rank',
  'audience_lens',
  'why_it_matters_short',
  'why_it_matters_long',
  'mapping_rationale',
  'safety_note_public',
  'evidence_ids',
  'review_status',
  'storage_filename',
  'image_mapped',
];

function buildClusterLensMap(rows) {
  const map = new Map();
  for (const raw of rows) {
    const ageBandId = String(raw.age_band_id || '').trim();
    const clusterId = String(raw.cluster_entity_id || '').trim();
    const key = `${ageBandId}|${clusterId}`;
    const explicit = String(raw.cluster_audience_lens || '').trim();
    if (explicit) {
      map.set(key, explicit);
      continue;
    }
    const rank = parseInt(String(raw.category_rank), 10);
    const categoryRank = Number.isFinite(rank) ? rank : 999;
    const lens = String(raw.audience_lens || '').trim();
    const current = map.get(key);
    if (!current || categoryRank < current.rank) {
      map.set(key, { rank: categoryRank, lens });
    }
  }
  const resolved = new Map();
  for (const [key, value] of map.entries()) {
    resolved.set(key, typeof value === 'string' ? value : value.lens);
  }
  return resolved;
}

function storageFilename(categoryEntityId, ageBandId) {
  const token = String(ageBandId || '')
    .replace(/^age_/, '')
    .replace(/-/g, '_');
  return `ember_${categoryEntityId}_${token}_category.png`;
}

function readDiscoverRows(filePath) {
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets.discover_projection;
  if (!sheet) throw new Error(`Missing discover_projection in ${filePath}`);
  return XLSX.utils
    .sheet_to_json(sheet, { defval: '' })
    .filter(
      (r) =>
        String(r.category_entity_id || '').trim() &&
        String(r.cluster_entity_id || '').trim()
    );
}

function toMasterRow(raw, clusterLensMap) {
  const ageBandId = String(raw.age_band_id || '').trim();
  const clusterId = String(raw.cluster_entity_id || '').trim();
  const clusterKey = `${ageBandId}|${clusterId}`;
  const categoryEntityId = String(raw.category_entity_id || '').trim();
  return {
    age_band_id: ageBandId,
    band_status: 'active',
    cluster_entity_id: clusterId,
    cluster_label: String(raw.cluster_label || '').trim(),
    cluster_parent_friendly_label: String(raw.cluster_label_parent_friendly || '').trim(),
    cluster_why_it_matters_short: String(raw.cluster_why_it_matters_short || '').trim(),
    cluster_why_it_matters_long: String(raw.cluster_why_it_matters_long || '').trim(),
    cluster_rank: raw.cluster_rank,
    cluster_audience_lens: clusterLensMap.get(clusterKey) || '',
    category_entity_id: categoryEntityId,
    category_label: String(raw.category_label || '').trim(),
    category_rank: raw.category_rank,
    audience_lens: String(raw.audience_lens || '').trim(),
    why_it_matters_short: String(raw.why_it_matters_short || '').trim(),
    why_it_matters_long: String(raw.why_it_matters_long || '').trim(),
    mapping_rationale: String(raw.mapping_rationale || '').trim(),
    safety_note_public: String(raw.safety_note_public || '').trim(),
    evidence_ids: String(raw.evidence_ids || '').trim(),
    review_status: String(raw.review_status || 'approved').trim() || 'approved',
    storage_filename: storageFilename(categoryEntityId, ageBandId),
    image_mapped: 'no',
  };
}

function bandSortKey(ageBandId) {
  const m = String(ageBandId).match(/^age_(\d+)_(\d+)m$/);
  if (m) return parseInt(m[1], 10);
  return 999;
}

function sortMasterRows(rows) {
  return [...rows].sort((a, b) => {
    const bandDiff = bandSortKey(a.age_band_id) - bandSortKey(b.age_band_id);
    if (bandDiff !== 0) return bandDiff;
    const clusterDiff =
      (parseInt(a.cluster_rank, 10) || 0) - (parseInt(b.cluster_rank, 10) || 0);
    if (clusterDiff !== 0) return clusterDiff;
    return (parseInt(a.category_rank, 10) || 0) - (parseInt(b.category_rank, 10) || 0);
  });
}

const inputFiles = process.argv.slice(2);
if (inputFiles.length === 0) {
  throw new Error('Provide one or more Ember ABI workbook paths');
}

const rawRows = [];
for (const file of inputFiles) {
  if (!fs.existsSync(file)) throw new Error(`Workbook not found: ${file}`);
  rawRows.push(...readDiscoverRows(file));
}

const clusterLensMap = buildClusterLensMap(rawRows);
const newRows = rawRows.map((r) => toMasterRow(r, clusterLensMap));
const newBandIds = [...new Set(newRows.map((r) => r.age_band_id))];

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const backupDir = path.join(root, 'agent-tools/backups/master-library-pre-rebuild');
fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupPath = path.join(backupDir, `Leaf - Master Library.${stamp}.xlsx`);
fs.copyFileSync(MASTER_PATH, backupPath);

const wb = XLSX.readFile(MASTER_PATH);
const existing = XLSX.utils.sheet_to_json(wb.Sheets.Master_Library, { defval: '' });
const kept = existing.filter((r) => !newBandIds.includes(String(r.age_band_id || '').trim()));
const merged = sortMasterRows([...kept, ...newRows]);

const ws = XLSX.utils.json_to_sheet(merged, { header: MASTER_COLUMNS });
wb.Sheets.Master_Library = ws;
XLSX.writeFile(wb, MASTER_PATH);

console.log(JSON.stringify({
  backup: backupPath,
  master_path: MASTER_PATH,
  bands_added: newBandIds,
  rows_added: newRows.length,
  rows_removed_for_bands: existing.length - kept.length,
  total_rows: merged.length,
}, null, 2));
