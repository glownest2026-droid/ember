import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const env = fs.readFileSync(path.join(root, 'web/.env.local'), 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();

function labelToCandidates(label) {
  const base = label
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const stripped = base
    .replace(/^ember_/, '')
    .replace(/_category$/, '')
    .replace(/^visual_/, '')
    .replace(/_image$/, '');
  return [...new Set([base, stripped, stripped.replace(/_/g, '')])];
}

const csvPath = path.join(root, 'agent-tools/exports/31-33m_category_image_template.csv');
const lines = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
const header = lines[0].split(',');
const labelIdx = header.indexOf('category_type_label');
const slugIdx = header.indexOf('category_type_slug');

const candidates = new Set();
for (const line of lines.slice(1)) {
  const cols = line.split(',');
  const label = cols[labelIdx];
  const slug = cols[slugIdx];
  for (const stem of [slug, ...labelToCandidates(label)]) {
    candidates.add(`ember_${stem}_category-v2.png.png`);
    candidates.add(`ember_visual_${stem}_category-v2.png.png`);
  }
}

const found = [];
for (const f of candidates) {
  const u = `${url}/storage/v1/object/public/category_images/${encodeURIComponent(f)}`;
  const r = await fetch(u, { method: 'HEAD' });
  if (r.status === 200) found.push(f);
}
console.log(JSON.stringify(found.sort(), null, 2));
