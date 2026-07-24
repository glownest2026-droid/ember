import { smokeUrl } from '../../../../scripts/stage3-url-smoke.mjs';

// Use smoke's successful path: fetch HTML via smoke internals by hitting known buyable Boots pages
// and also try search pages with Chrome UA.

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const pages = [
  'https://www.boots.com/doidy-cup-10150006',
  'https://www.boots.com/tommee-tippee-explora-first-cup-2-pack-10202518',
  'https://www.boots.com/sitesearch?searchTerm=open%20cup',
  'https://www.boots.com/sitesearch?searchTerm=free%20flow%20cup',
  'https://www.boots.com/sitesearch?searchTerm=doidy',
  'https://www.boots.com/sitesearch?searchTerm=first%20cup%20toddler',
];

for (const url of pages) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
  const html = await res.text();
  const title = ((html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  console.log('\n===', res.status, title, url);
  const links = [...html.matchAll(/href="(\/[^"]+)"/g)]
    .map((m) => 'https://www.boots.com' + m[1])
    .filter((h) => /cup|doidy|explora|tommee|nuby|avent|munchkin|vital|beaba|oxi|oxo/i.test(h))
    .filter((h) => !/search|media|static|assets/i.test(h))
    .filter((h, i, a) => a.indexOf(h) === i)
    .slice(0, 25);
  for (const l of links) console.log(l);
  // also smoke one known
  if (url.includes('doidy-cup-10150006')) {
    const s = await smokeUrl(url);
    console.log('smoke', s.url_ok, s.http_status);
  }
}
