/**
 * Parse discover import migrations and emit display_label backfill SQL.
 * Usage: node scripts/generate-display-label-backfill.mjs
 */
import fs from 'fs';
import path from 'path';

const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
const importFiles = fs
  .readdirSync(migrationsDir)
  .filter((f) => /import_discover|reimport_discover|import_.*m_abi/.test(f) && f.endsWith('.sql'))
  .sort();

/** Parse a single SQL quoted value starting at i; returns [value, nextIndex] */
function parseSqlString(sql, start) {
  const quote = sql[start];
  if (quote !== "'") return null;
  let i = start + 1;
  let value = '';
  while (i < sql.length) {
    if (sql[i] === "'") {
      if (sql[i + 1] === "'") {
        value += "'";
        i += 2;
        continue;
      }
      return [value, i + 1];
    }
    value += sql[i];
    i += 1;
  }
  return null;
}

function parseValuesRow(rowSql) {
  const fields = [];
  let i = 0;
  while (i < rowSql.length) {
    while (i < rowSql.length && /[\s,]/.test(rowSql[i])) i += 1;
    if (i >= rowSql.length) break;
    if (rowSql.slice(i, i + 4) === 'true') {
      fields.push(true);
      i += 4;
      continue;
    }
    if (rowSql.slice(i, i + 5) === 'false') {
      fields.push(false);
      i += 5;
      continue;
    }
    if (/[0-9]/.test(rowSql[i])) {
      const m = rowSql.slice(i).match(/^(\d+)/);
      if (m) {
        fields.push(parseInt(m[1], 10));
        i += m[1].length;
        continue;
      }
    }
    if (rowSql[i] === 'N' && rowSql.slice(i, i + 4) === 'NULL') {
      fields.push(null);
      i += 4;
      continue;
    }
    if (rowSql[i] === "'") {
      const parsed = parseSqlString(rowSql, i);
      if (!parsed) break;
      fields.push(parsed[0]);
      i = parsed[1];
      continue;
    }
    break;
  }
  return fields;
}

function extractRows(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const valuesIdx = sql.indexOf('INSERT INTO tmp_discover_projection_stage');
  if (valuesIdx === -1) return [];
  const valuesStart = sql.indexOf('VALUES', valuesIdx);
  if (valuesStart === -1) return [];
  const chunk = sql.slice(valuesStart + 6);
  const rows = [];
  let i = 0;
  while (i < chunk.length) {
    while (i < chunk.length && chunk[i] !== '(') {
      if (chunk.slice(i, i + 6) === 'CREATE ') break;
      i += 1;
    }
    if (i >= chunk.length || chunk.slice(i, i + 6) === 'CREATE ') break;
    let depth = 0;
    const start = i;
    for (; i < chunk.length; i += 1) {
      if (chunk[i] === '(') depth += 1;
      if (chunk[i] === ')') {
        depth -= 1;
        if (depth === 0) {
          i += 1;
          break;
        }
      }
    }
    const rowSql = chunk.slice(start + 1, i - 1);
    const fields = parseValuesRow(rowSql);
    if (fields.length >= 15) {
      rows.push({
        age_band_id: fields[0],
        slug: fields[13],
        display_label: fields[14],
        source: path.basename(filePath),
      });
    }
  }
  return rows;
}

const byKey = new Map();
for (const file of importFiles) {
  for (const row of extractRows(path.join(migrationsDir, file))) {
    const key = `${row.age_band_id}|${row.slug}`;
    byKey.set(key, row);
  }
}

function q(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

const lines = [
  '-- Backfill display_label from discover import migrations (generated; idempotent)',
  `UPDATE public.pl_age_band_development_need_category_types abdnct`,
  'SET display_label = src.display_label, updated_at = now()',
  'FROM (',
  '  SELECT * FROM (VALUES',
];

const entries = [...byKey.values()].sort(
  (a, b) => a.age_band_id.localeCompare(b.age_band_id) || a.slug.localeCompare(b.slug)
);
lines.push(
  entries
    .map((e) => `    (${q(e.age_band_id)}, ${q(e.slug)}, ${q(e.display_label)})`)
    .join(',\n')
);
lines.push(
  '  ) AS v(age_band_id, slug, display_label)',
  ') src',
  'JOIN public.pl_category_types ct ON LOWER(ct.slug) = LOWER(src.slug)',
  'WHERE abdnct.age_band_id = src.age_band_id',
  '  AND abdnct.category_type_id = ct.id',
  '  AND abdnct.is_active = true',
  '  AND NULLIF(TRIM(src.display_label), \'\') IS NOT NULL',
  '  AND (abdnct.display_label IS DISTINCT FROM src.display_label);',
  '',
  `-- Rows: ${entries.length} from ${importFiles.length} migration files`
);

const out = lines.join('\n');
const outPath = path.join(process.cwd(), 'supabase/sql/_generated_display_label_backfill.sql');
fs.writeFileSync(outPath, out);
console.log(`Wrote ${entries.length} backfill rows to ${outPath}`);
