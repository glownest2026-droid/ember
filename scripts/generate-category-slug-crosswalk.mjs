/**
 * Generate category_slug_crosswalk.csv from Spine 2.0 source workbooks.
 * Rules:
 *  - Default canonical: cat_* (strip ent_, strip cat_{band}_ prefix)
 *  - EXPLICIT only for approved tail renames / cross-band aliases
 *  - cat_13_15_bedtime_board_books → cat_bedtime_board_books (distinct from board books)
 */
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR =
  'G:/My Drive/Project Leaf/Project Leaf - Database Builds/Spine Build 2.0/Spine 2.0 Database Files';

const SOURCE_FILES = [
  { file: '1-3M Ember ABI.xlsx', defaultBand: '1-3m' },
  { file: '4-6M Ember ABI.xlsx', defaultBand: '4-6m' },
  { file: '10-12M Ember ABI.xlsx', defaultBand: '9-12m' },
  { file: '13-15M Ember ABI.xlsx', defaultBand: '13-15m' },
  { file: '16-18M Ember ABI.xlsx', defaultBand: '16-18m' },
];

/** Approved renames where stripped tail ≠ canonical identity */
const EXPLICIT_CANONICAL = {
  ent_cat_soft_balls: 'cat_soft_graspable_balls',
  ent_cat_stacking_cups: 'cat_stacking_nesting_cups',
  ent_cat_feelings_books: 'cat_feelings_faces_books',
  ent_cat_board_books: 'cat_board_books',
  ent_cat_push_pull_toy: 'cat_push_pull_toys',
  cat_13_15_push_pull_toys: 'cat_push_pull_toys',
  cat_13_15_bedtime_board_books: 'cat_bedtime_board_books',
};

function mapAgeBandId(raw, fallback) {
  const m = String(raw || '').trim().match(/^age_(\d+)_(\d+)m$/);
  if (m) return `${m[1]}-${m[2]}m`;
  return fallback;
}

function stripBandPrefix(slug) {
  return slug.replace(/^cat_\d+_\d+m?_/, 'cat_');
}

function stripEntPrefix(slug) {
  return slug.replace(/^ent_cat_/, 'cat_');
}

function proposeCanonical(sourceSlug) {
  if (EXPLICIT_CANONICAL[sourceSlug]) return EXPLICIT_CANONICAL[sourceSlug];
  if (/^cat_\d+_\d+m?_/.test(sourceSlug)) return stripBandPrefix(sourceSlug);
  if (sourceSlug.startsWith('ent_cat_')) return stripEntPrefix(sourceSlug);
  return sourceSlug;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function loadSourceRows() {
  const rows = [];
  for (const { file, defaultBand } of SOURCE_FILES) {
    const wb = XLSX.readFile(path.join(SOURCE_DIR, file));
    const dp = XLSX.utils.sheet_to_json(wb.Sheets.discover_projection, { defval: '' });
    const bible = wb.Sheets.bible_entities
      ? XLSX.utils.sheet_to_json(wb.Sheets.bible_entities, { defval: '' })
      : [];
    const bibleById = new Map(bible.map((b) => [String(b.entity_id).trim(), b]));
    for (const r of dp) {
      const sourceSlug = String(r.category_entity_id || '').trim();
      const be = bibleById.get(sourceSlug);
      rows.push({
        source_file: file.replace(' Ember ABI.xlsx', ''),
        age_band_id: mapAgeBandId(r.age_band_id, defaultBand),
        source_slug: sourceSlug,
        category_label: String(r.category_label || '').trim(),
        bible_entity_id: be ? String(be.entity_id).trim() : '',
        bible_canonical_slug: be ? String(be.canonical_slug || '').trim() : '',
      });
    }
  }
  return rows;
}

const sourceRows = loadSourceRows();
const bySourceSlug = new Map();

for (const r of sourceRows) {
  if (!bySourceSlug.has(r.source_slug)) {
    const canonical = proposeCanonical(r.source_slug);
    bySourceSlug.set(r.source_slug, {
      source_slug: r.source_slug,
      canonical_slug: canonical,
      bands: new Set(),
      labels: new Set(),
      files: new Set(),
      bible_entity_id: r.bible_entity_id,
      bible_canonical_slug: r.bible_canonical_slug,
      merge_action: canonical === r.source_slug ? 'keep' : 'rename',
    });
  }
  const e = bySourceSlug.get(r.source_slug);
  e.bands.add(r.age_band_id);
  e.labels.add(r.category_label);
  e.files.add(r.source_file);
}

const canonicalToSources = new Map();
for (const e of bySourceSlug.values()) {
  const list = canonicalToSources.get(e.canonical_slug) ?? [];
  list.push(e.source_slug);
  canonicalToSources.set(e.canonical_slug, list);
}

const header = [
  'source_slug',
  'canonical_slug',
  'merge_action',
  'review_flag',
  'age_bands',
  'source_files',
  'sample_display_label',
  'bible_entity_id',
  'bible_canonical_slug',
  'aliases_merged_into_canonical',
];

const sorted = [...bySourceSlug.values()].sort(
  (a, b) => a.canonical_slug.localeCompare(b.canonical_slug) || a.source_slug.localeCompare(b.source_slug)
);

const lines = [header.join(',')];
for (const e of sorted) {
  const aliases = canonicalToSources.get(e.canonical_slug) ?? [];
  let reviewFlag = '';
  if (aliases.length > 1 && e.source_slug !== e.canonical_slug) reviewFlag = 'merged_alias';
  else if (aliases.length > 1 && e.merge_action === 'keep') reviewFlag = 'canonical_target';
  else if (e.source_slug.startsWith('ent_cat_')) reviewFlag = 'ent_prefix_removed';
  else if (/^cat_\d+_\d+m?_/.test(e.source_slug)) reviewFlag = 'band_prefix_removed';

  lines.push(
    [
      e.source_slug,
      e.canonical_slug,
      e.merge_action,
      reviewFlag,
      [...e.bands].sort().join(';'),
      [...e.files].sort().join(';'),
      [...e.labels][0] ?? '',
      e.bible_entity_id,
      e.bible_canonical_slug,
      aliases.length > 1 ? aliases.join(';') : '',
    ]
      .map(csvEscape)
      .join(',')
  );
}

const outPath = path.join(ROOT, 'agent-tools/exports/category_slug_crosswalk.csv');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');

const multiAlias = [...canonicalToSources.entries()].filter(([, s]) => s.length > 1);
console.log(
  JSON.stringify(
    {
      source_slugs: sorted.length,
      canonical_slugs: canonicalToSources.size,
      renames: sorted.filter((e) => e.merge_action === 'rename').length,
      canonical_with_multiple_aliases: multiAlias.length,
      multi_alias_examples: multiAlias.slice(0, 10).map(([c, s]) => ({ canonical: c, sources: s })),
      csv: outPath,
    },
    null,
    2
  )
);
