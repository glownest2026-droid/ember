const UA = 'Mozilla/5.0 (compatible; EmberStage3Research/1.0)';
const urls = [
  'https://toytastic.co.uk/product/eco-fingerpaint-set-with-apron-100-recycled/',
  'https://toytastic.co.uk/product/ses-creative-my-first-colourball/',
  'https://toytastic.co.uk/product/ses-creative-my-first-crayon-beads/',
  'https://toytastic.co.uk/product/ses-creative-my-first-fingerpaint/',
  'https://toytastic.co.uk/product/ses-creative-my-first-colouring-with-water/',
  'https://www.boots.com/doidy-cup-10150006',
  'https://www.boots.com/tommee-tippee-explora-first-cup-2-pack-10202518',
  'https://www.boots.com/tommee-tippee-first-cup-10202516',
  'https://www.boots.com/tommee-tippee-explora-easy-drink-cup',
  'https://www.adventuretoys.co.uk/corolle-miss-floral-sweet-dreams-soft-doll/',
  'https://www.adventuretoys.co.uk/corolle-rag-doll-blandine-sweet-dreams/',
  'https://www.adventuretoys.co.uk/corolle-bath-alyzee-baby-doll/',
  'https://toytastic.co.uk/product-category/arts-crafts/painting-drawing-kits/page/2/',
  'https://www.adventuretoys.co.uk/indoor-toys/arts-and-crafts/',
];

for (const url of urls) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
  const html = await res.text();
  const title = ((html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '').replace(/\s+/g, ' ').trim().slice(0, 90);
  const price = (html.match(/£\s?\d+[\.,]\d{2}/) || [])[0];
  console.log(res.status, price || '-', '|', title, '|', url);
  const products = [...html.matchAll(/href="(https:\/\/(?:toytastic\.co\.uk|www\.adventuretoys\.co\.uk)\/[^"]+)"/g)].map(
    (m) => m[1],
  );
  const uniq = [...new Set(products)]
    .filter((u) => /crayon|colour|paint|chalk|ses-|stockmar|lyra|faber|crayola|finger/i.test(u))
    .slice(0, 25);
  for (const u of uniq) console.log('  ', u);
}
