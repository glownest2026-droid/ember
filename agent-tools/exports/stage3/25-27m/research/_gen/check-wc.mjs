import fs from 'node:fs';
import { bannedHits } from '../../../../../scripts/lib/stage3-banned-copy.mjs';

function wc(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const file = process.argv[2];
const src = fs.readFileSync(file, 'utf8');
const re =
  /product_name: ((?:'[^']*'|"[^"]*"))[\s\S]*?product_description_under_30_words:\s*\n?\s*'([^']*)'[\s\S]*?ember_verdict:\s*\n?\s*'([^']*)'/g;
let i = 0;
for (const m of src.matchAll(re)) {
  if (i >= 10) break;
  const n = m[1];
  const d = m[2];
  const w = m[3];
  const hits = [
    ...bannedHits(d, { publicCopy: true, field: 'product_description_under_30_words' }),
    ...bannedHits(w, { publicCopy: true, field: 'ember_verdict' }),
  ];
  const ok = wc(d) >= 20 && wc(d) <= 40 && wc(w) >= 40 && wc(w) <= 60 && !hits.length;
  console.log(ok ? 'OK' : 'FAIL', n, `d=${wc(d)}`, `w=${wc(w)}`, hits.join(',') || '');
  i += 1;
}
