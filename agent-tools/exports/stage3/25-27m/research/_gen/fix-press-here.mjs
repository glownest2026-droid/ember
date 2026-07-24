import fs from 'node:fs';

const p =
  'agent-tools/exports/stage3/25-27m/research/inbox/ember_picks_25-27m_cat_picture_story_books.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
const url = 'https://www.hachette.co.uk/titles/herve-tullet/press-here/9781854379571/';
for (const t of j.top_picks) {
  if (t.product_name === 'Press Here') {
    t.product_url = url;
    t.retailer = "Hachette Children's UK";
    t.alternate_urls = ['https://uk.bookshop.org/p/books/press-here-herve-tullet/9781452142275'];
    t.evidence_notes =
      'UK Hachette PDP smoke-OK and buyable 2026-07-24 (Press Here). Prior Bookshop primary failed availability 403; specialist exemption with long UK shelf presence.';
  }
}
for (const t of j.longlist || []) {
  if (t.product_name === 'Press Here') t.product_url = url;
}
fs.writeFileSync(p, JSON.stringify(j, null, 2));
console.log('Press Here ->', url);
