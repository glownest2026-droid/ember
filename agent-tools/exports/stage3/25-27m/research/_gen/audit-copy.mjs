import fs from 'fs';
import { bannedHits } from '../../../../../scripts/lib/stage3-banned-copy.mjs';

const file = process.argv[2];
const s = fs.readFileSync(file, 'utf8');
const parts = s.split(/book\(\{/);
for (let i = 1; i < parts.length; i++) {
  const p = parts[i];
  const name = (p.match(/product_name:\s*(?:"([^"]+)"|'([^']+)')/) || [])[1] || (p.match(/product_name:\s*(?:"([^"]+)"|'([^']+)')/) || [])[2];
  const nm = (p.match(/product_name:\s*"([^"]+)"/) || p.match(/product_name:\s*'([^']+)'/) || [])[1];
  const desc = (p.match(/product_description_under_30_words:\s*'([^']+)'/) || [])[1];
  const why = (p.match(/ember_verdict:\s*'([^']+)'/) || [])[1];
  if (!nm || !desc || !why) continue;
  const dw = desc.trim().split(/\s+/).length;
  const ww = why.trim().split(/\s+/).length;
  const hits = [
    ...bannedHits(desc, { publicCopy: true }),
    ...bannedHits(why, { publicCopy: true, field: 'ember_verdict' }),
  ];
  if (dw < 20 || dw > 40 || ww < 40 || ww > 60 || hits.length) {
    console.log(nm, 'd', dw, 'w', ww, hits.join('|') || 'ok-range-fail');
  }
}
