/** Shared Spine 2.0 category slug canonicalisation rules. */

export const SOURCE_DIR =
  'G:/My Drive/Project Leaf/Project Leaf - Database Builds/Spine Build 2.0/Spine 2.0 Database Files';

export const SOURCE_FILES = [
  { file: '1-3M Ember ABI.xlsx', defaultBand: '1-3m' },
  { file: '4-6M Ember ABI.xlsx', defaultBand: '4-6m' },
  { file: '10-12M Ember ABI.xlsx', defaultBand: '9-12m' },
  { file: '13-15M Ember ABI.xlsx', defaultBand: '13-15m' },
  { file: '16-18M Ember ABI.xlsx', defaultBand: '16-18m' },
];

export const DEPRECATED_AGE_BAND_IDS = ['6-9m', '22-24m', '25-27m', '28-30m', '31-33m', '34-36m'];

export const EXPLICIT_CANONICAL = {
  ent_cat_soft_balls: 'cat_soft_graspable_balls',
  ent_cat_stacking_cups: 'cat_stacking_nesting_cups',
  ent_cat_feelings_books: 'cat_feelings_faces_books',
  ent_cat_board_books: 'cat_board_books',
  ent_cat_push_pull_toy: 'cat_push_pull_toys',
  cat_13_15_push_pull_toys: 'cat_push_pull_toys',
  cat_13_15_bedtime_board_books: 'cat_bedtime_board_books',
};

export function stripBandPrefix(slug) {
  return slug.replace(/^cat_\d+_\d+m?_/, 'cat_');
}

export function stripEntPrefix(slug) {
  return slug.replace(/^ent_cat_/, 'cat_');
}

export function proposeCanonical(sourceSlug) {
  if (EXPLICIT_CANONICAL[sourceSlug]) return EXPLICIT_CANONICAL[sourceSlug];
  if (/^cat_\d+_\d+m?_/.test(sourceSlug)) return stripBandPrefix(sourceSlug);
  if (sourceSlug.startsWith('ent_cat_')) return stripEntPrefix(sourceSlug);
  return sourceSlug;
}

export function buildRenamePairs(sourceSlugs) {
  const pairs = [];
  const seen = new Set();
  for (const legacy of sourceSlugs) {
    const canonical = proposeCanonical(legacy);
    if (legacy === canonical || seen.has(legacy)) continue;
    seen.add(legacy);
    pairs.push({ legacy, canonical });
  }
  return pairs.sort((a, b) => a.canonical.localeCompare(b.canonical) || a.legacy.localeCompare(b.legacy));
}

export function q(value) {
  if (value == null || value === '') return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}
