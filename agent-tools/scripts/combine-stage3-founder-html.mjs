#!/usr/bin/env node
/**
 * Combine per-band Stage 3 founder-review HTML into one tabbed file.
 *
 * Usage:
 *   node agent-tools/scripts/combine-stage3-founder-html.mjs
 *   node agent-tools/scripts/combine-stage3-founder-html.mjs --bands=4-6m,6-9m,9-12m
 *   node agent-tools/scripts/combine-stage3-founder-html.mjs --out=path/to/combined.html
 *
 * Default: 4-6m → 25-27m wave into
 *   agent-tools/exports/stage3/founder-preview/stage3_founder_review_4-27m.html
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const stage3Root = path.join(root, 'agent-tools', 'exports', 'stage3');

const DEFAULT_BANDS = [
  { id: '4-6m', label: '4–6m' },
  { id: '6-9m', label: '7–9m' },
  { id: '9-12m', label: '10–12m' },
  { id: '13-15m', label: '13–15m' },
  { id: '16-18m', label: '16–18m' },
  { id: '19-21m', label: '19–21m' },
  { id: '22-24m', label: '22–24m' },
  { id: '25-27m', label: '25–27m' },
];

const LABEL_BY_ID = Object.fromEntries(DEFAULT_BANDS.map((b) => [b.id, b.label]));

function parseArgs(argv) {
  let out = path.join(stage3Root, 'founder-preview', 'stage3_founder_review_4-27m.html');
  let bandIds = DEFAULT_BANDS.map((b) => b.id);
  for (const arg of argv) {
    if (arg.startsWith('--out=')) out = path.resolve(arg.slice('--out='.length));
    else if (arg.startsWith('--bands=')) {
      bandIds = arg
        .slice('--bands='.length)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return {
    out,
    bands: bandIds.map((id) => ({ id, label: LABEL_BY_ID[id] || id })),
  };
}

function extractMain(html, bandId) {
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    throw new Error(`No <main> found in founder HTML for ${bandId}`);
  }
  return mainMatch[1].trim();
}

function rowCount(mainHtml) {
  const m = mainHtml.match(/<tbody[\s\S]*?<\/tbody>/i);
  if (!m) return 0;
  return (m[0].match(/<tr\b/gi) || []).length;
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const { out, bands } = parseArgs(process.argv.slice(2));

const panels = [];
for (const band of bands) {
  const htmlPath = path.join(
    stage3Root,
    band.id,
    'founder-preview',
    `stage3_founder_review_${band.id}.html`,
  );
  if (!fs.existsSync(htmlPath)) {
    console.error(`Missing: ${htmlPath}`);
    process.exit(1);
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const main = extractMain(html, band.id);
  panels.push({ ...band, main, rows: rowCount(main), path: htmlPath });
}

const totalRows = panels.reduce((n, p) => n + p.rows, 0);
const tabButtons = panels
  .map(
    (p, i) =>
      `<button type="button" class="tab${i === 0 ? ' active' : ''}" role="tab" aria-selected="${
        i === 0 ? 'true' : 'false'
      }" aria-controls="panel-${p.id}" id="tab-${p.id}" data-band="${esc(p.id)}">${esc(
        p.label,
      )}<span class="count">${p.rows}</span></button>`,
  )
  .join('\n      ');

const tabPanels = panels
  .map(
    (p, i) =>
      `<section class="panel${i === 0 ? ' active' : ''}" role="tabpanel" id="panel-${p.id}" aria-labelledby="tab-${p.id}" ${
        i === 0 ? '' : 'hidden'
      }>
      <div class="band-meta">
        <strong>${esc(p.label)}</strong>
        <span>${p.rows} product rows</span>
        <span>Source: ${esc(path.relative(root, p.path).replaceAll('\\', '/'))}</span>
      </div>
      ${p.main}
    </section>`,
  )
  .join('\n    ');

const combined = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Stage 3 Founder Review — 4–6m to 25–27m</title>
  <style>
    :root{--ink:#25211f;--muted:#6f625c;--line:#e5dad2;--paper:#fffaf4;--soft:#f8efe8;--accent:#a6423b;--accent-dark:#82322d;--gold:#8a5b12;--ok:#23603d;--tab:#fffdf9}
    *{box-sizing:border-box}
    body{margin:0;font-family:Georgia,"Times New Roman",serif;color:var(--ink);background:linear-gradient(180deg,#fffaf4 0%,#f3ebe3 100%);line-height:1.45}
    .top{position:sticky;top:0;z-index:20;background:#fffdf9;border-bottom:1px solid var(--line);box-shadow:0 1px 0 rgba(37,33,31,.04)}
    header{padding:20px 28px 10px}
    h1{margin:0 0 8px;font-size:24px;line-height:1.2;font-family:Arial,Helvetica,sans-serif}
    h2{font-family:Arial,Helvetica,sans-serif;font-size:18px;margin:0 0 6px}
    h3{font-family:Arial,Helvetica,sans-serif;font-size:15px;margin:14px 0 6px}
    .meta{display:flex;flex-wrap:wrap;gap:8px 16px;color:var(--muted);font-size:14px;font-family:Arial,Helvetica,sans-serif;margin-bottom:8px}
    .tabs{display:flex;flex-wrap:nowrap;gap:6px;padding:0 28px 12px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
    .tab{flex:0 0 auto;appearance:none;border:1px solid var(--line);background:var(--soft);color:var(--ink);border-radius:999px;padding:8px 14px;font:700 13px Arial,Helvetica,sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
    .tab:hover,.tab:focus{border-color:#c9a898;outline:none}
    .tab.active{background:var(--accent);color:#fff;border-color:var(--accent)}
    .tab .count{display:inline-flex;min-width:22px;height:20px;padding:0 6px;align-items:center;justify-content:center;border-radius:999px;background:rgba(255,255,255,.22);font-size:11px}
    .tab:not(.active) .count{background:#efe4dc;color:var(--muted)}
    .hint{padding:0 28px 14px;color:var(--muted);font:13px Arial,Helvetica,sans-serif}
    main.shell{padding:0 0 40px}
    .panel{padding:18px 28px 0}
    .panel[hidden]{display:none}
    .band-meta{display:flex;flex-wrap:wrap;gap:8px 16px;margin:0 0 12px;color:var(--muted);font:13px Arial,Helvetica,sans-serif}
    .table-wrap{overflow:auto;border:1px solid var(--line);border-radius:8px;max-height:calc(100vh - 210px);background:white}
    .table-wrap.compact{max-height:none;margin-top:8px}
    table{border-collapse:separate;border-spacing:0;min-width:1900px;width:100%;font-size:14px;font-family:Arial,Helvetica,sans-serif}
    .compact table{min-width:0}
    thead th{position:sticky;top:0;z-index:4;background:#fffdf9;border-bottom:1px solid var(--line);text-align:left;padding:12px 10px;font-size:13px;vertical-align:bottom}
    tbody td{border-bottom:1px solid var(--line);padding:12px 10px;vertical-align:top;background:#fff}
    tbody tr:nth-child(5n+1) td{border-top:2px solid #d9b8a6}
    tbody tr:nth-child(even) td{background:#fffaf6}
    .stage1,.stage2{position:sticky;z-index:2;background:inherit;min-width:220px;max-width:250px;font-weight:700}
    .stage1{left:0;box-shadow:1px 0 0 var(--line)}
    .stage2{left:230px;box-shadow:1px 0 0 var(--line)}
    thead .stage1,thead .stage2{z-index:6;background:#fffdf9}
    .rank{width:56px;text-align:center;font-weight:700}
    .product{width:230px;font-weight:700}
    .url{width:130px}.status{width:190px;color:var(--muted);font-size:13px}
    .title{width:190px;font-weight:700}.description,.why{width:330px}
    a.button{display:inline-flex;align-items:center;justify-content:center;min-width:88px;height:34px;padding:0 12px;border-radius:6px;background:var(--accent);color:white;text-decoration:none;font-weight:700;font-size:13px;white-space:nowrap}
    a.button:hover,a.button:focus{background:var(--accent-dark);outline:none}
    a.alt{font-size:12px;color:var(--accent-dark)}
    .pill{display:inline-block;border-radius:999px;padding:3px 8px;font-size:12px;font-weight:700;line-height:1.2}
    .verified{background:#e7f3ea;color:var(--ok)}.shopping{background:#fff1d8;color:var(--gold)}
    .direct{background:#f4e2dd;color:var(--accent-dark)}.missing{background:#eee;color:#555}.missing-link{color:#777}
    .how{margin-top:8px;font-size:12px;color:var(--muted)}.how p{margin:6px 0 0}
    .how-panel{margin:28px 0;padding:18px;border:1px solid var(--line);border-radius:10px;background:#fffdf9}
    .muted{color:var(--muted);margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px}
    .foot{margin:18px 28px 0;color:var(--muted);font-size:13px;font-family:Arial,Helvetica,sans-serif}
    @media(max-width:900px){
      header,.hint,.panel,.foot{padding-left:14px;padding-right:14px}
      .tabs{padding-left:14px;padding-right:14px}
      .table-wrap{max-height:none}
    }
  </style>
</head>
<body>
  <div class="top">
    <header>
      <h1>Stage 3 Founder Review — 4–6m to 25–27m</h1>
      <div class="meta">
        <span>${panels.length} age bands</span>
        <span>${totalRows} product rows</span>
        <span>FF green only · stop before ingest</span>
        <span>Built ${new Date().toISOString().slice(0, 10)}</span>
      </div>
    </header>
    <div class="tabs" role="tablist" aria-label="Age bands">
      ${tabButtons}
    </div>
    <p class="hint">Use the tabs (or keys 1–${Math.min(panels.length, 9)}) to switch bands. Scroll the table; Stage 1 / Stage 2 columns stay pinned.</p>
  </div>
  <main class="shell">
    ${tabPanels}
  </main>
  <p class="foot">Regenerate with <code>node agent-tools/scripts/combine-stage3-founder-html.mjs</code> after per-band founder HTML updates. Per-band files remain under each band’s <code>founder-preview/</code> folder.</p>
  <script>
    (function () {
      const tabs = Array.from(document.querySelectorAll('.tab'));
      const panels = Array.from(document.querySelectorAll('.panel'));
      function show(band) {
        tabs.forEach((tab) => {
          const on = tab.dataset.band === band;
          tab.classList.toggle('active', on);
          tab.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach((panel) => {
          const on = panel.id === 'panel-' + band;
          panel.classList.toggle('active', on);
          if (on) panel.removeAttribute('hidden');
          else panel.setAttribute('hidden', '');
        });
        try { history.replaceState(null, '', '#' + band); } catch (_) {}
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      }
      tabs.forEach((tab) => tab.addEventListener('click', () => show(tab.dataset.band)));
      document.addEventListener('keydown', (e) => {
        if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
        const n = Number(e.key);
        if (n >= 1 && n <= tabs.length) {
          e.preventDefault();
          show(tabs[n - 1].dataset.band);
        }
      });
      const hash = decodeURIComponent((location.hash || '').replace(/^#/, ''));
      if (hash && tabs.some((t) => t.dataset.band === hash)) show(hash);
    })();
  </script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, combined);
console.log(
  JSON.stringify(
    {
      out: path.relative(root, out).replaceAll('\\', '/'),
      bands: panels.map((p) => ({ id: p.id, label: p.label, rows: p.rows })),
      totalRows,
      bytes: Buffer.byteLength(combined),
    },
    null,
    2,
  ),
);
