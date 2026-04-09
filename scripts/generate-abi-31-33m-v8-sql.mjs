import fs from 'fs';

const inputCsv = 'C:/Users/timwo/Downloads/ABI_31_33m_v8_ready_child_voice.csv';
const outputSql = 'C:/Users/timwo/ember/supabase/sql/202604090840_import_31_33m_abi_v8_child_voice.sql';
const outputMigration = 'C:/Users/timwo/ember/supabase/migrations/20260409084000_import_31_33m_abi_v8_child_voice.sql';

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function escSql(value) {
  if (value == null) return 'NULL';
  const s = String(value);
  if (s.length === 0) return 'NULL';
  return `'${s.replace(/'/g, "''")}'`;
}

function normText(value) {
  if (value == null) return '';
  return String(value).replace(/\r/g, '').trim();
}

function normBool(value) {
  return /^true$/i.test(normText(value));
}

function normInt(value) {
  const raw = normText(value);
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

const raw = fs.readFileSync(inputCsv, 'utf8').replace(/^\uFEFF/, '').trim();
const lines = raw.split(/\r?\n/);
const headers = parseCsvLine(lines[0]).map((h) => normText(h));
const rows = lines.slice(1).map((line) => {
  const values = parseCsvLine(line);
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = normText(values[i] ?? '');
  });
  return obj;
});

const stage3PresentCount = rows.filter((r) => normText(r.stage3_product_name)).length;

const tuples = rows
  .map((r) => {
    const ageBandId = normText(r.age_band_id);
    if (ageBandId !== '31-33m') {
      throw new Error(`Unexpected age_band_id in CSV: ${ageBandId}`);
    }
    return `(${[
      escSql(ageBandId),
      escSql(normText(r.age_band_label)),
      normInt(r.min_months) ?? 'NULL',
      normInt(r.max_months) ?? 'NULL',
      normBool(r.age_band_is_active) ? 'true' : 'false',
      escSql(normText(r.stage1_wrapper_ux_slug)),
      escSql(normText(r.stage1_wrapper_ux_label)),
      normInt(r.stage1_wrapper_rank_in_band) ?? 'NULL',
      normBool(r.stage1_mapping_is_active) ? 'true' : 'false',
      escSql(normText(r.development_need_slug)),
      escSql(normText(r.development_need_canonical_name)),
      escSql(normText(r.stage1_why_it_matters_ux_description)),
      escSql(normText(r.stage2_category_type_slug)),
      escSql(normText(r.stage2_category_type_label)),
      escSql(normText(r.stage2_category_type_name)),
      normInt(r.stage2_play_ideas_rank) ?? 'NULL',
      escSql(normText(r.stage2_play_idea_mapping_rationale)),
      normInt(r.optional_need_meta_stage_anchor_month) ?? 'NULL',
      escSql(normText(r.optional_need_meta_stage_phase)),
      escSql(normText(r.optional_need_meta_stage_reason)),
      escSql(normText(r.optional_category_image_url)),
      escSql(normText(r.optional_category_safety_notes)),
    ].join(',')})`;
  })
  .join(',\n  ');

const sql = `-- ABI V2 import for Discover age band 31-33m (child voice v8).
-- Source of truth: C:/Users/timwo/Downloads/ABI_31_33m_v8_ready_child_voice.csv
-- Stage 3 in this task is intentionally NOT imported.
-- Idempotent and scoped to age_band_id = '31-33m'.

BEGIN;

CREATE TEMP TABLE tmp_abi_31_33_v8 (
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
  stage2_category_type_slug TEXT NOT NULL,
  stage2_category_type_label TEXT NOT NULL,
  stage2_category_type_name TEXT NOT NULL,
  stage2_play_ideas_rank INTEGER NOT NULL,
  stage2_play_idea_mapping_rationale TEXT,
  optional_need_meta_stage_anchor_month INTEGER,
  optional_need_meta_stage_phase TEXT,
  optional_need_meta_stage_reason TEXT,
  optional_category_image_url TEXT,
  optional_category_safety_notes TEXT
) ON COMMIT DROP;

INSERT INTO tmp_abi_31_33_v8 (
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
  stage2_category_type_slug,
  stage2_category_type_label,
  stage2_category_type_name,
  stage2_play_ideas_rank,
  stage2_play_idea_mapping_rationale,
  optional_need_meta_stage_anchor_month,
  optional_need_meta_stage_phase,
  optional_need_meta_stage_reason,
  optional_category_image_url,
  optional_category_safety_notes
)
VALUES
  ${tuples};

-- 1) Age band row
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT DISTINCT age_band_id, age_band_label, min_months, max_months, age_band_is_active
FROM tmp_abi_31_33_v8
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 2) Development needs (reuse by slug/name; create unresolved only)
INSERT INTO public.pl_development_needs (name, slug, plain_english_description, why_it_matters)
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
  FROM tmp_abi_31_33_v8 s
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
  FROM tmp_abi_31_33_v8 s
) src
WHERE LOWER(COALESCE(dn.slug, '')) = LOWER(src.development_need_slug);

-- 3) Stage 1 wrappers + wrapper->need links
CREATE TEMP TABLE tmp_stage1_wrappers_31_33 AS
SELECT
  s.stage1_wrapper_ux_slug,
  s.stage1_wrapper_ux_label,
  NULLIF(TRIM(COALESCE(s.stage1_why_it_matters_ux_description, '')), '') AS stage1_why_it_matters_ux_description
FROM (
  SELECT
    s.*,
    ROW_NUMBER() OVER (
      PARTITION BY s.stage1_wrapper_ux_slug
      ORDER BY s.stage1_wrapper_rank_in_band, s.stage2_play_ideas_rank, s.stage2_category_type_slug
    ) AS rn
  FROM tmp_abi_31_33_v8 s
) s
WHERE s.rn = 1;

INSERT INTO public.pl_ux_wrappers (ux_slug, ux_label, ux_description, is_active)
SELECT stage1_wrapper_ux_slug, stage1_wrapper_ux_label, stage1_why_it_matters_ux_description, true
FROM tmp_stage1_wrappers_31_33
ON CONFLICT (ux_slug) DO UPDATE
SET
  ux_label = EXCLUDED.ux_label,
  ux_description = EXCLUDED.ux_description,
  is_active = true,
  updated_at = now();

INSERT INTO public.pl_ux_wrapper_needs (ux_wrapper_id, development_need_id)
SELECT DISTINCT
  uw.id AS ux_wrapper_id,
  dn.id AS development_need_id
FROM tmp_abi_31_33_v8 s
JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
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
WHERE abuw.age_band_id = '31-33m'
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_abi_31_33_v8 s
    JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
    WHERE uw.id = abuw.ux_wrapper_id
  );

INSERT INTO public.pl_age_band_ux_wrappers (age_band_id, ux_wrapper_id, rank, is_active)
SELECT DISTINCT
  s.age_band_id,
  uw.id,
  s.stage1_wrapper_rank_in_band,
  s.stage1_mapping_is_active
FROM tmp_abi_31_33_v8 s
JOIN public.pl_ux_wrappers uw ON LOWER(uw.ux_slug) = LOWER(s.stage1_wrapper_ux_slug)
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 4) Stage 2 category type masters + need->category mappings
INSERT INTO public.pl_category_types (slug, label, name, description, safety_notes, image_url)
SELECT
  src.stage2_category_type_slug,
  src.stage2_category_type_label,
  src.stage2_category_type_name,
  NULL,
  NULLIF(TRIM(COALESCE(src.optional_category_safety_notes, '')), ''),
  NULLIF(TRIM(COALESCE(src.optional_category_image_url, '')), '')
FROM (
  SELECT DISTINCT
    s.stage2_category_type_slug,
    s.stage2_category_type_label,
    s.stage2_category_type_name,
    s.optional_category_safety_notes,
    s.optional_category_image_url
  FROM tmp_abi_31_33_v8 s
) src
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
  image_url = COALESCE(NULLIF(ct.image_url, ''), NULLIF(TRIM(COALESCE(src.optional_category_image_url, '')), '')),
  safety_notes = COALESCE(NULLIF(ct.safety_notes, ''), NULLIF(TRIM(COALESCE(src.optional_category_safety_notes, '')), '')),
  updated_at = now()
FROM (
  SELECT DISTINCT
    s.stage2_category_type_slug,
    s.stage2_category_type_label,
    s.stage2_category_type_name,
    s.optional_category_image_url,
    s.optional_category_safety_notes
  FROM tmp_abi_31_33_v8 s
) src
WHERE LOWER(COALESCE(ct.slug, '')) = LOWER(src.stage2_category_type_slug);

CREATE TEMP TABLE tmp_need_category_31_33 AS
SELECT DISTINCT
  s.age_band_id,
  dn.id AS development_need_id,
  ct.id AS category_type_id,
  s.stage2_play_ideas_rank AS rank,
  NULLIF(TRIM(COALESCE(s.stage2_play_idea_mapping_rationale, '')), '') AS rationale
FROM tmp_abi_31_33_v8 s
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
WHERE m.age_band_id = '31-33m'
  AND NOT EXISTS (
    SELECT 1
    FROM tmp_need_category_31_33 r
    WHERE r.development_need_id = m.development_need_id
      AND r.category_type_id = m.category_type_id
  );

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id,
  development_need_id,
  category_type_id,
  rank,
  rationale,
  is_active
)
SELECT age_band_id, development_need_id, category_type_id, rank, rationale, true
FROM tmp_need_category_31_33
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE
SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  is_active = true,
  updated_at = now();

-- 5) Optional need meta
INSERT INTO public.pl_age_band_development_need_meta (
  age_band_id,
  development_need_id,
  stage_anchor_month,
  stage_phase,
  stage_reason,
  is_active
)
SELECT DISTINCT
  s.age_band_id,
  dn.id,
  s.optional_need_meta_stage_anchor_month,
  NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_phase, '')), ''),
  NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_reason, '')), ''),
  true
FROM tmp_abi_31_33_v8 s
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
WHERE s.optional_need_meta_stage_anchor_month IS NOT NULL
   OR NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_phase, '')), '') IS NOT NULL
   OR NULLIF(TRIM(COALESCE(s.optional_need_meta_stage_reason, '')), '') IS NOT NULL
ON CONFLICT (age_band_id, development_need_id) DO UPDATE
SET
  stage_anchor_month = COALESCE(EXCLUDED.stage_anchor_month, public.pl_age_band_development_need_meta.stage_anchor_month),
  stage_phase = COALESCE(EXCLUDED.stage_phase, public.pl_age_band_development_need_meta.stage_phase),
  stage_reason = COALESCE(EXCLUDED.stage_reason, public.pl_age_band_development_need_meta.stage_reason),
  is_active = true,
  updated_at = now();

-- 6) Stage 3 intentionally skipped in this task; force this band's mappings inactive.
UPDATE public.pl_age_band_category_type_products p
SET
  is_active = false,
  updated_at = now()
WHERE p.age_band_id = '31-33m';

DO $$
DECLARE
  v_rows_loaded INTEGER;
  v_wrappers INTEGER;
  v_categories INTEGER;
  v_stage3_active INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_rows_loaded FROM tmp_abi_31_33_v8;
  SELECT COUNT(DISTINCT stage1_wrapper_ux_slug) INTO v_wrappers FROM tmp_abi_31_33_v8;
  SELECT COUNT(DISTINCT stage2_category_type_slug) INTO v_categories FROM tmp_abi_31_33_v8;
  SELECT COUNT(*) INTO v_stage3_active
  FROM public.pl_age_band_category_type_products
  WHERE age_band_id = '31-33m' AND is_active = true;

  RAISE NOTICE 'ABI 31-33 v8 rows loaded: %', v_rows_loaded;
  RAISE NOTICE 'Distinct Stage 1 wrappers: %', v_wrappers;
  RAISE NOTICE 'Distinct Stage 2 category types: %', v_categories;
  RAISE NOTICE 'Stage 3 active mappings (expected 0): %', v_stage3_active;
END $$;

COMMIT;

-- Rollback (scoped to this import):
-- DELETE FROM public.pl_age_band_development_need_category_types WHERE age_band_id = '31-33m';
-- DELETE FROM public.pl_age_band_ux_wrappers WHERE age_band_id = '31-33m';
-- DELETE FROM public.pl_age_band_development_need_meta WHERE age_band_id = '31-33m';
-- UPDATE public.pl_age_band_category_type_products SET is_active = false WHERE age_band_id = '31-33m';
`;

fs.writeFileSync(outputSql, sql, 'utf8');
fs.writeFileSync(outputMigration, sql, 'utf8');

console.log(`Wrote SQL: ${outputSql}`);
console.log(`Wrote migration: ${outputMigration}`);
console.log(`CSV rows: ${rows.length}`);
console.log(`Stage 3 product rows present in CSV (intentionally skipped): ${stage3PresentCount}`);
