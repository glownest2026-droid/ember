/**
 * Generate idempotent SQL import for Discover pilot age bands 6–9m and 9–12m.
 * Source: discover_projection tab only (Ember ABI workbooks).
 *
 * Usage:
 *   node scripts/generate-discover-projection-sql.mjs \
 *     "C:/Users/timwo/Downloads/6-9M Ember ABI.xlsx" \
 *     "C:/Users/timwo/Downloads/9-12M Ember ABI.xlsx"
 */
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const DEFAULT_FILES = [
  'C:/Users/timwo/Downloads/6-9M Ember ABI.xlsx',
  'C:/Users/timwo/Downloads/9-12M Ember ABI.xlsx',
];

const outputSql = path.join(
  process.cwd(),
  'supabase/sql/202606151201_import_discover_6_9m_9_12m_pilot.sql'
);
const outputMigration = path.join(
  process.cwd(),
  'supabase/migrations/20260615120100_import_discover_6_9m_9_12m_pilot.sql'
);

function q(value) {
  if (value == null || value === '') return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toInt(value) {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? String(n) : 'NULL';
}

function mapAgeBandId(raw) {
  if (raw === 'age_6_9m') return '6-9m';
  if (raw === 'age_9_12m') return '9-12m';
  return raw;
}

function ageBandMeta(id) {
  if (id === '6-9m') return { label: '6–9 months', min: 6, max: 9 };
  if (id === '9-12m') return { label: '9–12 months', min: 9, max: 12 };
  throw new Error(`Unknown age band id: ${id}`);
}

function buildClusterLensMap(rawRows) {
  const map = new Map();
  for (const raw of rawRows) {
    const ageBandId = mapAgeBandId(String(raw.age_band_id || '').trim());
    const clusterId = String(raw.cluster_entity_id || '').trim();
    const key = `${ageBandId}|${clusterId}`;
    const explicitCluster = String(raw.cluster_audience_lens || '').trim();
    if (explicitCluster) {
      map.set(key, explicitCluster);
      continue;
    }
    const categoryRank = parseInt(String(raw.category_rank), 10);
    const rank = Number.isFinite(categoryRank) ? categoryRank : 999;
    const lens = String(raw.audience_lens || '').trim();
    const current = map.get(key);
    if (!current || rank < current.rank) {
      map.set(key, { rank, lens });
    }
  }
  const resolved = new Map();
  for (const [key, value] of map.entries()) {
    resolved.set(key, typeof value === 'string' ? value : value.lens);
  }
  return resolved;
}

function normalizeRow(raw, clusterLensMap) {
  const ageBandId = mapAgeBandId(String(raw.age_band_id || '').trim());
  const meta = ageBandMeta(ageBandId);
  const clusterId = String(raw.cluster_entity_id || '').trim();
  const clusterKey = `${ageBandId}|${clusterId}`;
  const clusterLabelParentFriendly = String(
    raw.cluster_parent_friendly_label || raw.cluster_label_parent_friendly || ''
  ).trim();
  const clusterAudienceLens = String(raw.cluster_audience_lens || '').trim()
    || clusterLensMap.get(clusterKey)
    || '';
  const categoryAudienceLens = String(raw.audience_lens || '').trim();

  return {
    age_band_id: ageBandId,
    age_band_label: meta.label,
    min_months: meta.min,
    max_months: meta.max,
    stage1_wrapper_ux_slug: String(raw.cluster_entity_id || '').trim(),
    stage1_wrapper_ux_label: clusterLabelParentFriendly,
    stage1_wrapper_rank_in_band: raw.cluster_rank,
    stage1_mapping_is_active: true,
    development_need_slug: String(raw.cluster_entity_id || '').trim(),
    development_need_canonical_name: String(raw.cluster_label || clusterLabelParentFriendly).trim(),
    stage1_why_it_matters_ux_description: String(raw.cluster_why_it_matters_long || '').trim(),
    audience_lens: clusterAudienceLens,
    stage2_category_type_slug: String(raw.category_entity_id || '').trim(),
    stage2_category_type_label: String(raw.category_label || '').trim(),
    stage2_category_type_name: String(raw.category_label || '').trim(),
    stage2_play_ideas_rank: raw.category_rank,
    stage2_play_idea_mapping_rationale: String(raw.why_it_matters_long || '').trim(),
    category_audience_lens: categoryAudienceLens,
  };
}

function readDiscoverProjection(filePath) {
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets.discover_projection;
  if (!sheet) {
    throw new Error(`Missing discover_projection tab in ${filePath}`);
  }
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

function loadRows(files) {
  const rawRows = [];
  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new Error(`Workbook not found: ${file}`);
    }
    rawRows.push(...readDiscoverProjection(file));
  }
  const clusterLensMap = buildClusterLensMap(rawRows);
  return rawRows.map((raw) => normalizeRow(raw, clusterLensMap));
}

function buildSql(rows) {
  const valuesSql = rows
    .map(
      (r) =>
        `(${q(r.age_band_id)},${q(r.age_band_label)},${r.min_months},${r.max_months},true,${q(r.stage1_wrapper_ux_slug)},${q(r.stage1_wrapper_ux_label)},${toInt(r.stage1_wrapper_rank_in_band)},true,${q(r.development_need_slug)},${q(r.development_need_canonical_name)},${q(r.stage1_why_it_matters_ux_description)},${q(r.audience_lens)},${q(r.stage2_category_type_slug)},${q(r.stage2_category_type_label)},${q(r.stage2_category_type_name)},${toInt(r.stage2_play_ideas_rank)},${q(r.stage2_play_idea_mapping_rationale)},${q(r.category_audience_lens)})`
    )
    .join(',\n  ');

  const bandIds = [...new Set(rows.map((r) => r.age_band_id))];
  const bandList = bandIds.map((b) => q(b)).join(', ');

  return `-- Discover pilot import: age bands 6–9m and 9–12m
-- Source: discover_projection tab from Ember ABI workbooks (6–9m + 9–12m)
-- Stage 3 intentionally empty. Idempotent: safe to re-run.

BEGIN;

CREATE TEMP TABLE tmp_discover_projection_stage (
  age_band_id TEXT NOT NULL,
  age_band_label TEXT NOT NULL,
  min_months INTEGER NOT NULL,
  max_months INTEGER NOT NULL,
  age_band_is_active BOOLEAN NOT NULL,
  stage1_wrapper_ux_slug TEXT NOT NULL,
  stage1_wrapper_ux_label TEXT NOT NULL,
  stage1_wrapper_rank_in_band INTEGER NOT NULL,
  stage1_mapping_is_active BOOLEAN NOT NULL,
  development_need_slug TEXT NOT NULL,
  development_need_canonical_name TEXT NOT NULL,
  stage1_why_it_matters_ux_description TEXT,
  audience_lens TEXT,
  stage2_category_type_slug TEXT NOT NULL,
  stage2_category_type_label TEXT NOT NULL,
  stage2_category_type_name TEXT NOT NULL,
  stage2_play_ideas_rank INTEGER NOT NULL,
  stage2_play_idea_mapping_rationale TEXT,
  category_audience_lens TEXT
) ON COMMIT DROP;

INSERT INTO tmp_discover_projection_stage (
  age_band_id,
  age_band_label,
  min_months,
  max_months,
  age_band_is_active,
  stage1_wrapper_ux_slug,
  stage1_wrapper_ux_label,
  stage1_wrapper_rank_in_band,
  stage1_mapping_is_active,
  development_need_slug,
  development_need_canonical_name,
  stage1_why_it_matters_ux_description,
  audience_lens,
  stage2_category_type_slug,
  stage2_category_type_label,
  stage2_category_type_name,
  stage2_play_ideas_rank,
  stage2_play_idea_mapping_rationale,
  category_audience_lens
)
VALUES
  ${valuesSql};

CREATE TEMP TABLE tmp_discover_stage1_wrappers AS
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description,
  NULLIF(TRIM(COALESCE(s.audience_lens, '')), '') AS audience_lens
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY s.stage1_wrapper_ux_slug
      ORDER BY s.min_months ASC, s.age_band_id ASC, s.stage1_wrapper_rank_in_band ASC
    ) AS rn
  FROM tmp_discover_projection_stage s
) s
WHERE s.rn = 1;

CREATE TEMP TABLE tmp_discover_stage1_age_band_wrappers AS
SELECT
  s.age_band_id,
  s.stage1_wrapper_ux_slug,
  MIN(s.stage1_wrapper_rank_in_band) AS stage1_wrapper_rank_in_band,
  BOOL_OR(s.stage1_mapping_is_active) AS stage1_mapping_is_active
FROM tmp_discover_projection_stage s
GROUP BY s.age_band_id, s.stage1_wrapper_ux_slug;

CREATE TEMP TABLE tmp_discover_stage2_category_types AS
SELECT
  s.stage2_category_type_slug,
  s.stage2_category_type_label,
  s.stage2_category_type_name
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(s.stage2_category_type_label))
      ORDER BY s.min_months ASC, s.age_band_id ASC, s.stage2_play_ideas_rank ASC, s.stage2_category_type_slug ASC
    ) AS rn
  FROM tmp_discover_projection_stage s
) s
WHERE s.rn = 1;

INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT DISTINCT
  s.age_band_id,
  s.age_band_label,
  s.min_months,
  s.max_months,
  s.age_band_is_active
FROM tmp_discover_projection_stage s
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = EXCLUDED.is_active,
  updated_at = now();

INSERT INTO public.pl_development_needs (
  name,
  slug,
  plain_english_description,
  why_it_matters
)
SELECT
  src.development_need_canonical_name,
  src.development_need_slug,
  COALESCE(src.stage1_why_it_matters_ux_description, ''),
  COALESCE(src.stage1_why_it_matters_ux_description, '')
FROM (
  SELECT DISTINCT
    s.development_need_slug,
    s.development_need_canonical_name,
    NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
  FROM tmp_discover_projection_stage s
) src
LEFT JOIN public.pl_development_needs dn_slug
  ON LOWER(COALESCE(dn_slug.slug, '')) = LOWER(src.development_need_slug)
LEFT JOIN public.pl_development_needs dn_name
  ON LOWER(COALESCE(dn_name.name, '')) = LOWER(src.development_need_canonical_name)
WHERE dn_slug.id IS NULL
  AND dn_name.id IS NULL
ON CONFLICT (slug) DO NOTHING;

UPDATE public.pl_development_needs dn
SET
  name = COALESCE(NULLIF(dn.name, ''), src.development_need_canonical_name),
  plain_english_description = COALESCE(NULLIF(dn.plain_english_description, ''), src.stage1_why_it_matters_ux_description),
  why_it_matters = COALESCE(NULLIF(dn.why_it_matters, ''), src.stage1_why_it_matters_ux_description),
  updated_at = now()
FROM (
  SELECT DISTINCT
    s.development_need_slug,
    s.development_need_canonical_name,
    NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
  FROM tmp_discover_projection_stage s
) src
WHERE LOWER(COALESCE(dn.slug, '')) = LOWER(src.development_need_slug);

INSERT INTO public.pl_ux_wrappers (
  ux_slug,
  ux_label,
  ux_description,
  audience_lens,
  is_active
)
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  s.stage1_why_it_matters_ux_description,
  s.audience_lens,
  true
FROM tmp_discover_stage1_wrappers s
ON CONFLICT (ux_slug) DO UPDATE
SET
  ux_label = EXCLUDED.ux_label,
  ux_description = EXCLUDED.ux_description,
  audience_lens = EXCLUDED.audience_lens,
  is_active = true,
  updated_at = now();

INSERT INTO public.pl_ux_wrapper_needs (
  ux_wrapper_id,
  development_need_id
)
SELECT DISTINCT
  uw.id AS ux_wrapper_id,
  dn.id AS development_need_id
FROM tmp_discover_projection_stage s
JOIN public.pl_ux_wrappers uw
  ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
JOIN LATERAL (
  SELECT d.id
  FROM public.pl_development_needs d
  WHERE LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug)
     OR LOWER(COALESCE(d.name, '')) = LOWER(s.development_need_canonical_name)
  ORDER BY
    CASE WHEN LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug) THEN 0 ELSE 1 END,
    d.id
  LIMIT 1
) dn ON true
ON CONFLICT (ux_wrapper_id) DO UPDATE
SET
  development_need_id = EXCLUDED.development_need_id,
  updated_at = now();

UPDATE public.pl_age_band_ux_wrappers abuw
SET
  is_active = false,
  updated_at = now()
WHERE abuw.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_discover_stage1_age_band_wrappers)
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_discover_stage1_age_band_wrappers s
    JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
    WHERE s.age_band_id = abuw.age_band_id
      AND uw.id = abuw.ux_wrapper_id
  );

INSERT INTO public.pl_age_band_ux_wrappers (
  age_band_id,
  ux_wrapper_id,
  rank,
  is_active
)
SELECT
  s.age_band_id,
  uw.id,
  s.stage1_wrapper_rank_in_band,
  s.stage1_mapping_is_active
FROM tmp_discover_stage1_age_band_wrappers s
JOIN public.pl_ux_wrappers uw
  ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  is_active = EXCLUDED.is_active,
  updated_at = now();

INSERT INTO public.pl_category_types (
  slug,
  label,
  name,
  description,
  safety_notes
)
SELECT
  src.stage2_category_type_slug,
  src.stage2_category_type_label,
  src.stage2_category_type_name,
  NULL,
  NULL
FROM tmp_discover_stage2_category_types src
LEFT JOIN public.pl_category_types ct_slug
  ON LOWER(COALESCE(ct_slug.slug, '')) = LOWER(src.stage2_category_type_slug)
LEFT JOIN public.pl_category_types ct_name
  ON LOWER(COALESCE(ct_name.name, '')) = LOWER(src.stage2_category_type_name)
LEFT JOIN public.pl_category_types ct_label
  ON LOWER(COALESCE(ct_label.label, '')) = LOWER(src.stage2_category_type_label)
WHERE ct_slug.id IS NULL
  AND ct_name.id IS NULL
  AND ct_label.id IS NULL
ON CONFLICT (slug) DO NOTHING;

UPDATE public.pl_category_types ct
SET
  label = COALESCE(NULLIF(ct.label, ''), src.stage2_category_type_label),
  name = COALESCE(NULLIF(ct.name, ''), src.stage2_category_type_name),
  updated_at = now()
FROM tmp_discover_stage2_category_types src
WHERE LOWER(COALESCE(ct.slug, '')) = LOWER(src.stage2_category_type_slug);

CREATE TEMP TABLE tmp_discover_resolved_need_category AS
SELECT DISTINCT
  s.age_band_id,
  dn.id AS development_need_id,
  ct.id AS category_type_id,
  s.stage2_play_ideas_rank AS rank,
  NULLIF(TRIM(COALESCE(s.stage2_play_idea_mapping_rationale, '')), '') AS rationale,
  NULLIF(TRIM(COALESCE(s.category_audience_lens, '')), '') AS audience_lens
FROM tmp_discover_projection_stage s
JOIN LATERAL (
  SELECT d.id
  FROM public.pl_development_needs d
  WHERE LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug)
     OR LOWER(COALESCE(d.name, '')) = LOWER(s.development_need_canonical_name)
  ORDER BY
    CASE WHEN LOWER(COALESCE(d.slug, '')) = LOWER(s.development_need_slug) THEN 0 ELSE 1 END,
    d.id
  LIMIT 1
) dn ON true
JOIN LATERAL (
  SELECT c.id
  FROM public.pl_category_types c
  WHERE LOWER(COALESCE(c.slug, '')) = LOWER(s.stage2_category_type_slug)
     OR LOWER(COALESCE(c.name, '')) = LOWER(s.stage2_category_type_name)
     OR LOWER(COALESCE(c.label, '')) = LOWER(s.stage2_category_type_label)
  ORDER BY
    CASE
      WHEN LOWER(COALESCE(c.slug, '')) = LOWER(s.stage2_category_type_slug) THEN 0
      WHEN LOWER(COALESCE(c.name, '')) = LOWER(s.stage2_category_type_name) THEN 1
      ELSE 2
    END,
    c.id
  LIMIT 1
) ct ON true;

UPDATE public.pl_age_band_development_need_category_types m
SET
  is_active = false,
  updated_at = now()
WHERE m.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_discover_projection_stage)
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_discover_resolved_need_category r
    WHERE r.age_band_id = m.age_band_id
      AND r.development_need_id = m.development_need_id
      AND r.category_type_id = m.category_type_id
  );

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id,
  development_need_id,
  category_type_id,
  rank,
  rationale,
  audience_lens,
  is_active
)
SELECT
  r.age_band_id,
  r.development_need_id,
  r.category_type_id,
  r.rank,
  r.rationale,
  r.audience_lens,
  true
FROM tmp_discover_resolved_need_category r
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  audience_lens = EXCLUDED.audience_lens,
  is_active = true,
  updated_at = now();

UPDATE public.pl_age_band_category_type_products p
SET
  is_active = false,
  updated_at = now()
WHERE p.age_band_id IN (SELECT DISTINCT age_band_id FROM tmp_discover_projection_stage);

DO $$
DECLARE
  v_rows_loaded INTEGER;
  v_rows_6_9 INTEGER;
  v_rows_9_12 INTEGER;
  v_clusters_6_9 INTEGER;
  v_clusters_9_12 INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_discover_projection_stage;
  SELECT COUNT(*) INTO v_rows_6_9 FROM tmp_discover_projection_stage WHERE age_band_id = '6-9m';
  SELECT COUNT(*) INTO v_rows_9_12 FROM tmp_discover_projection_stage WHERE age_band_id = '9-12m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_6_9
  FROM tmp_discover_projection_stage WHERE age_band_id = '6-9m';
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_clusters_9_12
  FROM tmp_discover_projection_stage WHERE age_band_id = '9-12m';
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id IN (${bandList})
    AND is_active = true;

  RAISE NOTICE 'Discover projection rows loaded: % (expected 90)', v_rows_loaded;
  RAISE NOTICE '6-9m rows: % (expected 42), clusters: % (expected 8)', v_rows_6_9, v_clusters_6_9;
  RAISE NOTICE '9-12m rows: % (expected 48), clusters: % (expected 8)', v_rows_9_12, v_clusters_9_12;
  RAISE NOTICE 'Active Stage 3 mappings (expected 0): %', v_stage3_active;

  IF v_rows_loaded <> 90 OR v_rows_6_9 <> 42 OR v_rows_9_12 <> 48 THEN
    RAISE EXCEPTION 'Row count validation failed';
  END IF;
  IF v_clusters_6_9 <> 8 OR v_clusters_9_12 <> 8 THEN
    RAISE EXCEPTION 'Cluster count validation failed';
  END IF;
END $$;

COMMIT;

-- Rollback (scoped):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id IN ('6-9m','9-12m');
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id IN ('6-9m','9-12m');
-- DELETE FROM public.pl_age_band_category_type_products WHERE age_band_id IN ('6-9m','9-12m');
-- DELETE FROM public.pl_age_bands WHERE id IN ('6-9m','9-12m');
`;
}

const files = process.argv.slice(2);
const inputFiles = files.length > 0 ? files : DEFAULT_FILES;
const rows = loadRows(inputFiles);

const counts = rows.reduce(
  (acc, r) => {
    acc.total += 1;
    acc[r.age_band_id] = (acc[r.age_band_id] || 0) + 1;
    return acc;
  },
  { total: 0 }
);

const sql = buildSql(rows);
fs.mkdirSync(path.dirname(outputSql), { recursive: true });
fs.writeFileSync(outputSql, sql);
fs.writeFileSync(outputMigration, sql);

console.log('Generated import SQL:');
console.log(`  ${outputSql}`);
console.log(`  ${outputMigration}`);
console.log(`Rows: total=${counts.total}, 6-9m=${counts['6-9m'] ?? 0}, 9-12m=${counts['9-12m'] ?? 0}`);
