#!/usr/bin/env node
/**
 * Build Stage 3 founder preview HTML from rows JSON (green-only output).
 * Usage:
 *   node agent-tools/scripts/build_founder_preview.mjs rows.json output.html
 */
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error('Usage: node build_founder_preview.mjs rows.json output.html');
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(input, 'utf8'));
const rows = Array.isArray(payload) ? payload : payload.rows || [];
const categoryHow = Array.isArray(payload) ? [] : payload.category_how || [];

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function statusClass(status) {
  if (status === 'official_guidance' || status === 'verified_direct') return 'verified';
  if (status === 'direct_needs_qa') return 'direct';
  if (status === 'google_shopping') return 'shopping';
  return 'missing';
}

function statusLabel(status) {
  return (
    {
      verified_direct: 'Verified direct',
      direct_needs_qa: 'Direct needs QA',
      google_shopping: 'Shopping/search',
      official_guidance: 'Official guidance',
      missing: 'Missing',
    }[status] ||
    status ||
    'Unknown'
  );
}

const bodyRows = rows
  .map((row) => {
    const link = row.url
      ? `<a class="button" href="${esc(row.url)}" target="_blank" rel="noopener noreferrer">Open link</a>`
      : `<span class="missing-link">Missing</span>`;
    const alts = (row.alternate_urls || [])
      .slice(0, 2)
      .map(
        (u, i) =>
          `<div><a class="alt" href="${esc(u)}" target="_blank" rel="noopener noreferrer">Alt ${i + 1}</a></div>`,
      )
      .join('');
    const howSnippet = row.rank_rationale
      ? `<details class="how"><summary>HOW rank</summary><p>${esc(row.rank_rationale)}</p></details>`
      : '';
    return `<tr>
    <td class="stage1">${esc(row.stage_1_card_label)}</td>
    <td class="stage2">${esc(row.stage_2_card_label)}</td>
    <td class="rank">${esc(row.rank)}</td>
    <td class="product">${esc(row.product_or_action_name)}</td>
    <td class="url">${link}${alts}</td>
    <td class="status"><span class="pill ${statusClass(row.url_status)}">${esc(statusLabel(row.url_status))}</span>${
      row.ff_pass_badge === 'green' ? `<br><span class="pill verified">FF green</span>` : ''
    }${row.qa_note ? `<br>${esc(row.qa_note)}` : ''}</td>
    <td class="title">${esc(row.ui_title)}</td>
    <td class="description">${esc(row.ui_description)}</td>
    <td class="why">${esc(row.why_pip_picked_this)}${howSnippet}</td>
  </tr>`;
  })
  .join('\n');

const howPanels = categoryHow
  .map((cat) => {
    const rankRows = (cat.ranks_1_to_10 || [])
      .map(
        (r) => `<tr>
      <td>${esc(r.rank)}</td>
      <td>${esc([r.brand, r.product_name].filter(Boolean).join(' — '))}</td>
      <td>${esc(r.rank_rationale || '—')}</td>
      <td>${esc(r.missed_top5_reason || '—')}</td>
    </tr>`,
      )
      .join('\n');
    return `<section class="how-panel">
      <h2>${esc(cat.stage_2_card_label)}</h2>
      <p class="muted">${esc(cat.stage_1_card_label)}</p>
      <h3>Buying-factor memo</h3>
      <p>${esc(cat.buying_factor_memo || '—')}</p>
      <h3>Methodology</h3>
      <p>${esc(cat.methodology || '—')}</p>
      <h3>Ranks 1–10</h3>
      <div class="table-wrap compact">
        <table>
          <thead><tr><th>Rank</th><th>Product</th><th>Rank rationale</th><th>Missed Top 5 reason</th></tr></thead>
          <tbody>${rankRows || '<tr><td colspan="4">No HOW trail in green JSON</td></tr>'}</tbody>
        </table>
      </div>
    </section>`;
  })
  .join('\n');

const ageBand = payload.age_band_id || rows[0]?.age_band_id || 'unknown';
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Stage 3 Founder Review - ${esc(ageBand)}</title>
  <style>
    :root{--ink:#25211f;--muted:#6f625c;--line:#e5dad2;--paper:#fffaf4;--soft:#f8efe8;--accent:#a6423b;--accent-dark:#82322d;--gold:#8a5b12;--ok:#23603d}
    *{box-sizing:border-box}body{margin:0;font-family:Georgia,"Times New Roman",serif;color:var(--ink);background:linear-gradient(180deg,#fffaf4 0%,#f3ebe3 100%);line-height:1.45}
    header{padding:24px 28px 18px;border-bottom:1px solid var(--line);background:#fffdf9;position:sticky;top:0;z-index:5}
    h1{margin:0 0 8px;font-size:24px;line-height:1.2;letter-spacing:0;font-family:Arial,Helvetica,sans-serif}
    h2{font-family:Arial,Helvetica,sans-serif;font-size:18px;margin:0 0 6px}h3{font-family:Arial,Helvetica,sans-serif;font-size:15px;margin:14px 0 6px}
    .meta{display:flex;flex-wrap:wrap;gap:8px 16px;color:var(--muted);font-size:14px;font-family:Arial,Helvetica,sans-serif}
    main{padding:18px 28px 40px}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:8px;max-height:calc(100vh - 160px);background:white}
    .table-wrap.compact{max-height:none;margin-top:8px}
    table{border-collapse:separate;border-spacing:0;min-width:1900px;width:100%;font-size:14px;font-family:Arial,Helvetica,sans-serif}
    .compact table{min-width:0}
    thead th{position:sticky;top:0;z-index:4;background:#fffdf9;border-bottom:1px solid var(--line);text-align:left;padding:12px 10px;font-size:13px;vertical-align:bottom}
    tbody td{border-bottom:1px solid var(--line);padding:12px 10px;vertical-align:top;background:#fff}tbody tr:nth-child(5n+1) td{border-top:2px solid #d9b8a6}tbody tr:nth-child(even) td{background:#fffaf6}
    .stage1,.stage2{position:sticky;z-index:2;background:inherit;min-width:220px;max-width:250px;font-weight:700}.stage1{left:0;box-shadow:1px 0 0 var(--line)}.stage2{left:230px;box-shadow:1px 0 0 var(--line)}thead .stage1,thead .stage2{z-index:6;background:#fffdf9}
    .rank{width:56px;text-align:center;font-weight:700}.product{width:230px;font-weight:700}.url{width:130px}.status{width:190px;color:var(--muted);font-size:13px}.title{width:190px;font-weight:700}.description,.why{width:330px}
    a.button{display:inline-flex;align-items:center;justify-content:center;min-width:88px;height:34px;padding:0 12px;border-radius:6px;background:var(--accent);color:white;text-decoration:none;font-weight:700;font-size:13px;white-space:nowrap}a.button:hover,a.button:focus{background:var(--accent-dark);outline:none}
    a.alt{font-size:12px;color:var(--accent-dark)}
    .pill{display:inline-block;border-radius:999px;padding:3px 8px;font-size:12px;font-weight:700;line-height:1.2}.verified{background:#e7f3ea;color:var(--ok)}.shopping{background:#fff1d8;color:var(--gold)}.direct{background:#f4e2dd;color:var(--accent-dark)}.missing{background:#eee;color:#555}.missing-link{color:#777}
    .how{margin-top:8px;font-size:12px;color:var(--muted)}.how p{margin:6px 0 0}
    .how-panel{margin:28px 0;padding:18px;border:1px solid var(--line);border-radius:10px;background:#fffdf9}
    .muted{color:var(--muted);margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px}
    .foot{margin-top:18px;color:var(--muted);font-size:13px;font-family:Arial,Helvetica,sans-serif}
    @media(max-width:900px){header,main{padding-left:14px;padding-right:14px}.table-wrap{max-height:none}}
  </style>
</head>
<body>
  <header>
    <h1>Stage 3 Founder Review: ${esc(ageBand)} (FF green only)</h1>
    <div class="meta">
      <span>Rows: ${rows.length}</span>
      <span>Proposed public content + HOW trail</span>
      <span>Source: research/green/</span>
    </div>
  </header>
  <main>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th class="stage1">Stage 1 card</th>
          <th class="stage2">Pilot Stage 2 card</th>
          <th class="rank">Rank</th>
          <th class="product">Stage 3 product / action</th>
          <th class="url">Clickable URL</th>
          <th class="status">URL status</th>
          <th class="title">Proposed UI title</th>
          <th class="description">Proposed UI description</th>
          <th class="why">Why Pip picked this</th>
        </tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
    <h2 style="margin-top:28px;font-family:Arial,Helvetica,sans-serif">HOW — ranking trail by category</h2>
    <p class="muted">Use this when asking “why #1?” or “why these five?”. Answers must come from these fields, not invented chat.</p>
    ${howPanels || '<p class="muted">No category HOW panels (empty green set).</p>'}
    <p class="foot">Founder preview only. Green = FF first pass. Your second eyes still apply before ingestion.</p>
  </main>
</body>
</html>`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log(JSON.stringify({ output, rows: rows.length, how_panels: categoryHow.length }, null, 2));
