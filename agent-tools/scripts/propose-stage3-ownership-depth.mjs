/**
 * Propose single vs multiple ownership research depth for Stage 3 shortlists.
 * Output: agent-tools/exports/stage3/ownership_depth_proposal_4-27m.{csv,json,md}
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const bands = ['4-6m', '6-9m', '9-12m', '13-15m', '16-18m', '19-21m', '22-24m', '25-27m'];

function parseCsvLine(line) {
  const cols = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
      continue;
    }
    if (c === ',' && !inQ) {
      cols.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  cols.push(cur);
  return cols;
}

/**
 * Strict ownership depth (founder 2026-07-24): default SINGLE.
 * MULTIPLE only when parents clearly build a rotating shelf/collection
 * (almost always books). Owning 2–3 cups or replacing crayons ≠ multiple.
 */
function classify(label, slug) {
  const s = `${slug} ${label}`.toLowerCase();

  // Books / reading shelf only — the clear "own many different items" case.
  if (
    /book|story|lift.?the.?flap|first.?word|feelings.?faces|faces and feelings|bedtime|potty and bathroom books|chats|parts_of_me|picture.?story/.test(
      s,
    )
  ) {
    return {
      ownership: 'multiple',
      depth: '25 longlist / show top 10',
      why: 'Reading shelf: households collect many titles over time.',
    };
  }

  return {
    ownership: 'single',
    depth: '15 longlist / show top 5',
    why: 'One primary purchase covers the need (strict default).',
  };
}

const rows = [];
for (const band of bands) {
  const csvPath = path.join(root, 'agent-tools', 'exports', `stage3_shortlist_${band}.csv`);
  const csv = fs.readFileSync(csvPath, 'utf8');
  const lines = csv.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);
  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));

  const regDir = path.join(root, 'agent-tools', 'exports', 'stage3', band, 'registry');
  fs.mkdirSync(regDir, { recursive: true });
  fs.copyFileSync(csvPath, path.join(regDir, `stage3_shortlist_${band}.csv`));
  fs.copyFileSync(
    path.join(root, 'agent-tools', 'exports', `stage3_shortlist_${band}.md`),
    path.join(regDir, `stage3_shortlist_${band}.md`),
  );

  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const selected = String(cols[idx.selected_for_stage3] ?? '').toUpperCase();
    if (selected !== 'TRUE') continue;
    const label = cols[idx.category_label];
    const slug = cols[idx.category_entity_id];
    const c = classify(label, slug);
    rows.push({
      band,
      cluster: cols[idx.cluster_label],
      category: label,
      slug,
      score: cols[idx.priority_score],
      ...c,
    });
  }
}

const outDir = path.join(root, 'agent-tools', 'exports', 'stage3');
const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
const outCsv = [
  'age_band,cluster,category_label,category_entity_id,priority_score,ownership_class,research_depth,rationale',
  ...rows.map((r) =>
    [r.band, esc(r.cluster), esc(r.category), r.slug, r.score, r.ownership, esc(r.depth), esc(r.why)].join(
      ',',
    ),
  ),
].join('\n');

fs.writeFileSync(path.join(outDir, 'ownership_depth_proposal_4-27m.csv'), outCsv);
fs.writeFileSync(path.join(outDir, 'ownership_depth_proposal_4-27m.json'), JSON.stringify(rows, null, 2));

const single = rows.filter((r) => r.ownership === 'single');
const multi = rows.filter((r) => r.ownership === 'multiple');

const md = [];
md.push('# Stage 3 ownership-depth proposal (4–6m → 25–27m)');
md.push('');
md.push('**Awaiting founder approval before research.**');
md.push('');
md.push('| Class | Research depth | Count |');
md.push('|---|---|---:|');
md.push(`| Single ownership | 15 longlist → show top 5 | ${single.length} |`);
md.push(`| Multiple ownership | 25 longlist → show top 10 | ${multi.length} |`);
md.push(`| **Total pilots** | | **${rows.length}** |`);
md.push('');
md.push('## Rule of thumb (strict)');
md.push('');
md.push('- **Single (default)** — one primary purchase covers the need (toys, gear, stools, cups, balls, puzzles, dolls…).');
md.push('- **Multiple (rare)** — only when parents clearly build a rotating shelf — almost always **books**.');
md.push('- Owning 2–3 of something (cups, teethers) or replacing consumables does **not** make it multiple.');
md.push('');

for (const band of bands) {
  const bandRows = rows.filter((r) => r.band === band);
  md.push(`## ${band} (${bandRows.length})`);
  md.push('');
  md.push('| Ownership | Stage 1 | Stage 2 pilot | Why |');
  md.push('|---|---|---|---|');
  for (const r of bandRows) {
    md.push(
      `| **${r.ownership}** | ${r.cluster} | ${r.category} (\`${r.slug}\`) | ${r.why} |`,
    );
  }
  md.push('');
}

md.push('## Only flip to multiple if you disagree');
md.push('');
md.push('Everything non-book is **single**. Candidates you might still want as multiple:');
md.push('');
md.push('- Soft balls / large balls (if you treat them as a growing kit)');
md.push('- Blocks / stacking sets (if you treat them as a growing kit)');
md.push('- Dolls / teddies (if you treat care characters as a shelf)');
md.push('');
md.push('Otherwise leave as single.');
md.push('');

fs.writeFileSync(path.join(outDir, 'ownership_depth_proposal_4-27m.md'), md.join('\n'));

console.log(
  JSON.stringify(
    {
      total: rows.length,
      single: single.length,
      multiple: multi.length,
      by_band: Object.fromEntries(bands.map((b) => [b, rows.filter((r) => r.band === b).length])),
      out: [
        'agent-tools/exports/stage3/ownership_depth_proposal_4-27m.md',
        'agent-tools/exports/stage3/ownership_depth_proposal_4-27m.csv',
      ],
    },
    null,
    2,
  ),
);
