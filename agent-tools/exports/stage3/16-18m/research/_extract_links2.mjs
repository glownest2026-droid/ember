const pages = [
  'https://www.adventuretoys.co.uk/?s=corolle&post_type=product',
  'https://toytastic.co.uk/?s=corolle&post_type=product',
  'https://toytastic.co.uk/?s=crayon&post_type=product',
  'https://www.adventuretoys.co.uk/?s=crayon',
  'https://toytastic.co.uk/?s=doll+bed&post_type=product',
  'https://www.adventuretoys.co.uk/?s=soft+doll',
  'https://priddybooks.com/gb/books/',
];

const UA = 'Mozilla/5.0 (compatible; EmberStage3Research/1.0)';

for (const url of pages) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
    const html = await res.text();
    const hrefs = [...html.matchAll(/href="(https?:\/\/[^"]+|\/[^"]+)"/g)].map((m) => m[1]);
    const interesting = hrefs
      .map((h) => {
        if (h.startsWith('/')) {
          const u = new URL(url);
          return u.origin + h;
        }
        return h;
      })
      .filter((h) => /product|books\/|corolle|crayon|colour|ses-|goki|priddy|doll/i.test(h))
      .filter((h, i, a) => a.indexOf(h) === i)
      .slice(0, 40);
    console.log('\n===', url, res.status, '===');
    for (const h of interesting) console.log(h);
  } catch (e) {
    console.log('ERR', url, e.message);
  }
}
