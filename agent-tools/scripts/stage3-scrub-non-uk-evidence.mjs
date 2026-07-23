#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ukMarketFailReasons } from './lib/stage3-uk-market.mjs';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = path.join(repoRoot, 'agent-tools', 'exports', 'stage3');

function scrubUrls(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.filter((u) => {
    if (typeof u !== 'string' || !/^https?:/i.test(u)) return true;
    return ukMarketFailReasons(u, { requireUrl: true }).length === 0;
  });
}

function walk(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(walk);
    return;
  }
  if (Array.isArray(obj.evidence_sources)) {
    obj.evidence_sources = scrubUrls(obj.evidence_sources);
  }
  if (Array.isArray(obj.evidence)) {
    obj.evidence = obj.evidence.filter((e) => {
      if (!e || !e.url) return true;
      return ukMarketFailReasons(e.url, { requireUrl: true }).length === 0;
    });
  }
  for (const k of Object.keys(obj)) walk(obj[k]);
}

let files = 0;
for (const band of fs.readdirSync(root).filter((d) => /^\d/.test(d))) {
  const green = path.join(root, band, 'research', 'green');
  if (!fs.existsSync(green)) continue;
  for (const f of fs.readdirSync(green).filter((x) => /^ember_picks_.*\.json$/.test(x))) {
    const fp = path.join(green, f);
    const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const before = JSON.stringify(doc);
    walk(doc);
    if (JSON.stringify(doc) !== before) {
      fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n');
      for (const m of [path.join(root, band, 'research', f), path.join(root, band, 'research', 'inbox', f)]) {
        if (fs.existsSync(m)) fs.writeFileSync(m, JSON.stringify(doc, null, 2) + '\n');
      }
      files += 1;
      console.log('scrubbed', f);
    }
  }
}
console.log(JSON.stringify({ files }));
