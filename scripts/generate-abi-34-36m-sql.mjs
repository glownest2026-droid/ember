import fs from 'fs';

const inputCsv = 'C:/Users/timwo/Downloads/ABI_34_36m_completed.csv';
const outputSql = 'C:/Users/timwo/ember_34_36_import/supabase/sql/202604071315_import_34_36m_abi_v2.sql';

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

function q(value) {
  if (value == null || value === '') return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toBool(value) {
  return String(value).toLowerCase() === 'true' ? 'true' : 'false';
}

const csv = fs.readFileSync(inputCsv, 'utf8').replace(/^\uFEFF/, '').trim();
const lines = csv.split(/\r?\n/);
const headers = parseCsvLine(lines[0]);
const rows = lines.slice(1).map((line) => {
  const values = parseCsvLine(line);
  return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
});

const valuesSql = rows
  .map((r) => `(${q(r.age_band_id)},${q(r.age_band_label)},${r.min_months || 'NULL'},${r.max_months || 'NULL'},${toBool(r.age_band_is_active)},${q(r.stage1_wrapper_ux_slug)},${q(r.stage1_wrapper_ux_label)},${r.stage1_wrapper_rank_in_band || 'NULL'},${toBool(r.stage1_mapping_is_active)},${q(r.development_need_slug)},${q(r.development_need_canonical_name)},${q(r.stage1_why_it_matters_ux_description)},${q(r.stage2_category_type_slug)},${q(r.stage2_category_type_label)},${q(r.stage2_category_type_name)},${r.stage2_play_ideas_rank || 'NULL'},${q(r.stage2_play_idea_mapping_rationale)},${q(r.stage3_product_name)},${q(r.stage3_product_brand)},${r.stage3_product_rank_in_category || 'NULL'},${q(r.stage3_product_mapping_rationale)},${r.optional_need_meta_stage_anchor_month || 'NULL'},${q(r.optional_need_meta_stage_phase)},${q(r.optional_need_meta_stage_reason)},${q(r.optional_category_image_url)},${q(r.optional_category_safety_notes)})`)
  .join(',\n  ');

const sql = `-- Import 34-36m ABI V2 CSV into Discover gateway canonical tables
-- Source: C:/Users/timwo/Downloads/ABI_34_36m_completed.csv

BEGIN;

CREATE TEMP TABLE _abi34 (
  age_band_id text, age_band_label text, min_months int, max_months int, age_band_is_active boolean,
  stage1_wrapper_ux_slug text, stage1_wrapper_ux_label text, stage1_wrapper_rank_in_band int, stage1_mapping_is_active boolean,
  development_need_slug text, development_need_canonical_name text, stage1_why_it_matters_ux_description text,
  stage2_category_type_slug text, stage2_category_type_label text, stage2_category_type_name text, stage2_play_ideas_rank int, stage2_play_idea_mapping_rationale text,
  stage3_product_name text, stage3_product_brand text, stage3_product_rank_in_category int, stage3_product_mapping_rationale text,
  optional_need_meta_stage_anchor_month int, optional_need_meta_stage_phase text, optional_need_meta_stage_reason text,
  optional_category_image_url text, optional_category_safety_notes text
);

INSERT INTO _abi34 VALUES
  ${valuesSql};

INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
SELECT DISTINCT age_band_id, age_band_label, min_months, max_months, age_band_is_active
FROM _abi34
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  min_months = EXCLUDED.min_months,
  max_months = EXCLUDED.max_months,
  is_active = EXCLUDED.is_active;

DO $$
DECLARE
  r record;
  v_need_id uuid;
  has_need_name boolean;
  has_name boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='pl_development_needs' AND column_name='need_name'
  ) INTO has_need_name;
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='pl_development_needs' AND column_name='name'
  ) INTO has_name;

  FOR r IN (
    SELECT DISTINCT
      development_need_slug,
      development_need_canonical_name,
      stage1_why_it_matters_ux_description,
      optional_need_meta_stage_reason
    FROM _abi34
  ) LOOP
    SELECT id INTO v_need_id
    FROM public.pl_development_needs
    WHERE slug = r.development_need_slug
    LIMIT 1;

    IF v_need_id IS NULL THEN
      IF has_need_name AND has_name THEN
        EXECUTE 'INSERT INTO public.pl_development_needs (need_name, name, slug, plain_english_description, why_it_matters) VALUES ($1, $2, $3, $4, $5) RETURNING id'
          INTO v_need_id
          USING
            r.development_need_canonical_name,
            r.development_need_canonical_name,
            r.development_need_slug,
            r.stage1_why_it_matters_ux_description,
            COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''''), r.stage1_why_it_matters_ux_description);
      ELSIF has_need_name THEN
        EXECUTE 'INSERT INTO public.pl_development_needs (need_name, slug, plain_english_description, why_it_matters) VALUES ($1, $2, $3, $4) RETURNING id'
          INTO v_need_id
          USING
            r.development_need_canonical_name,
            r.development_need_slug,
            r.stage1_why_it_matters_ux_description,
            COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''''), r.stage1_why_it_matters_ux_description);
      ELSE
        EXECUTE 'INSERT INTO public.pl_development_needs (name, slug, plain_english_description, why_it_matters) VALUES ($1, $2, $3, $4) RETURNING id'
          INTO v_need_id
          USING
            r.development_need_canonical_name,
            r.development_need_slug,
            r.stage1_why_it_matters_ux_description,
            COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''''), r.stage1_why_it_matters_ux_description);
      END IF;
    ELSE
      UPDATE public.pl_development_needs
      SET
        name = COALESCE(name, r.development_need_canonical_name),
        plain_english_description = COALESCE(NULLIF(plain_english_description, ''), r.stage1_why_it_matters_ux_description),
        why_it_matters = COALESCE(NULLIF(why_it_matters, ''), COALESCE(NULLIF(r.optional_need_meta_stage_reason, ''), r.stage1_why_it_matters_ux_description))
      WHERE id = v_need_id;

      IF has_need_name THEN
        UPDATE public.pl_development_needs
        SET need_name = COALESCE(need_name, r.development_need_canonical_name)
        WHERE id = v_need_id;
      END IF;
    END IF;
  END LOOP;
END $$;

INSERT INTO public.pl_ux_wrappers (ux_slug, ux_label, ux_description, is_active)
SELECT DISTINCT stage1_wrapper_ux_slug, stage1_wrapper_ux_label, stage1_why_it_matters_ux_description, true
FROM _abi34
ON CONFLICT (ux_slug) DO UPDATE SET
  ux_label = EXCLUDED.ux_label,
  ux_description = EXCLUDED.ux_description,
  is_active = true;

INSERT INTO public.pl_ux_wrapper_needs (ux_wrapper_id, development_need_id)
SELECT DISTINCT uw.id, dn.id
FROM _abi34 s
JOIN public.pl_ux_wrappers uw ON uw.ux_slug = s.stage1_wrapper_ux_slug
JOIN public.pl_development_needs dn ON dn.slug = s.development_need_slug
ON CONFLICT (ux_wrapper_id) DO UPDATE
SET development_need_id = EXCLUDED.development_need_id;

INSERT INTO public.pl_age_band_ux_wrappers (age_band_id, ux_wrapper_id, rank, is_active)
SELECT DISTINCT s.age_band_id, uw.id, s.stage1_wrapper_rank_in_band, s.stage1_mapping_is_active
FROM _abi34 s
JOIN public.pl_ux_wrappers uw ON uw.ux_slug = s.stage1_wrapper_ux_slug
ON CONFLICT (age_band_id, ux_wrapper_id) DO UPDATE SET
  rank = EXCLUDED.rank,
  is_active = EXCLUDED.is_active;

INSERT INTO public.pl_age_band_development_need_meta (
  age_band_id, development_need_id, stage_anchor_month, stage_phase, stage_reason, is_active
)
SELECT DISTINCT
  s.age_band_id,
  dn.id,
  s.optional_need_meta_stage_anchor_month,
  s.optional_need_meta_stage_phase,
  s.optional_need_meta_stage_reason,
  true
FROM _abi34 s
JOIN public.pl_development_needs dn ON dn.slug = s.development_need_slug
ON CONFLICT (age_band_id, development_need_id) DO UPDATE SET
  stage_anchor_month = EXCLUDED.stage_anchor_month,
  stage_phase = EXCLUDED.stage_phase,
  stage_reason = EXCLUDED.stage_reason,
  is_active = true;

WITH distinct_cats AS (
  SELECT DISTINCT
    stage2_category_type_slug AS slug,
    stage2_category_type_label AS label,
    stage2_category_type_name AS name,
    NULLIF(optional_category_image_url, '') AS image_url,
    NULLIF(optional_category_safety_notes, '') AS safety_notes
  FROM _abi34
),
resolved AS (
  SELECT
    dc.*,
    ct.id AS existing_id
  FROM distinct_cats dc
  LEFT JOIN public.pl_category_types ct
    ON ct.slug = dc.slug OR ct.name = dc.name
)
UPDATE public.pl_category_types ct
SET
  slug = COALESCE(NULLIF(ct.slug, ''), r.slug),
  label = COALESCE(r.label, ct.label),
  name = COALESCE(r.name, ct.name),
  image_url = COALESCE(r.image_url, ct.image_url),
  safety_notes = COALESCE(r.safety_notes, ct.safety_notes)
FROM resolved r
WHERE ct.id = r.existing_id;

WITH distinct_cats AS (
  SELECT DISTINCT
    stage2_category_type_slug AS slug,
    stage2_category_type_label AS label,
    stage2_category_type_name AS name,
    NULLIF(optional_category_image_url, '') AS image_url,
    NULLIF(optional_category_safety_notes, '') AS safety_notes
  FROM _abi34
),
resolved AS (
  SELECT
    dc.*,
    ct.id AS existing_id
  FROM distinct_cats dc
  LEFT JOIN public.pl_category_types ct
    ON ct.slug = dc.slug OR ct.name = dc.name
)
INSERT INTO public.pl_category_types (slug, label, name, image_url, safety_notes)
SELECT r.slug, r.label, r.name, r.image_url, r.safety_notes
FROM resolved r
WHERE r.existing_id IS NULL;

INSERT INTO public.pl_age_band_development_need_category_types (
  age_band_id, development_need_id, category_type_id, rank, rationale, is_active
)
SELECT DISTINCT
  s.age_band_id,
  dn.id,
  ct.id,
  s.stage2_play_ideas_rank,
  s.stage2_play_idea_mapping_rationale,
  true
FROM _abi34 s
JOIN public.pl_development_needs dn ON dn.slug = s.development_need_slug
JOIN public.pl_category_types ct
  ON ct.slug = s.stage2_category_type_slug OR ct.name = s.stage2_category_type_name
ON CONFLICT (age_band_id, development_need_id, category_type_id) DO UPDATE SET
  rank = EXCLUDED.rank,
  rationale = EXCLUDED.rationale,
  is_active = true;

-- CSV has blank Stage 3 product fields, so keep this age band empty at Stage 3.
DELETE FROM public.pl_age_band_category_type_products
WHERE age_band_id = (SELECT DISTINCT age_band_id FROM _abi34 LIMIT 1);

COMMIT;
`;

fs.writeFileSync(outputSql, sql);
console.log(`Wrote ${outputSql} with ${rows.length} CSV rows`);
