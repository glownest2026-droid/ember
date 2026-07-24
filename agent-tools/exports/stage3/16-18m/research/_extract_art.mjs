const UA = 'Mozilla/5.0 (compatible; EmberStage3Research/1.0)';
const pages = [
  'https://www.adventuretoys.co.uk/?s=stockmar',
  'https://www.adventuretoys.co.uk/?s=crayon+chunky',
  'https://www.adventuretoys.co.uk/?s=galt+crayon',
  'https://toytastic.co.uk/?s=stockmar&post_type=product',
  'https://toytastic.co.uk/?s=lyra&post_type=product',
  'https://toytastic.co.uk/brand/ses-creative/',
];

for (const url of pages) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
  const html = await res.text();
  console.log('\n===', res.status, url);
  const links = [...html.matchAll(/href="(https?:\/\/[^"]+|\/[^"]+)"/g)]
    .map((m) => {
      const h = m[1];
      if (h.startsWith('/')) return new URL(url).origin + h;
      return h;
    })
    .filter((h) => /product|stockmar|crayon|lyra|galt|colour|paint|chalk/i.test(h))
    .filter((h) => !/promo|category|tag|wp-json|feed|oembed/i.test(h))
    .filter((h, i, a) => a.indexOf(h) === i)
    .slice(0, 30);
  for (const l of links) console.log(l);
}
