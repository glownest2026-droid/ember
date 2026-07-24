import fs from 'node:fs';

const r = await fetch('https://www.woodentoyshop.co.uk/collections/wooden-toy-kitchen-play-shop?page=1', {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    accept: 'text/html',
    'accept-language': 'en-GB',
  },
  signal: AbortSignal.timeout(25000),
});
const t = await r.text();
const cards = [];
const re =
  /href="(\/products\/[a-z0-9-]+)"[^>]*>[\s\S]{0,400}?<(?:h2|h3|span)[^>]*>([^<]{5,120})/gi;
for (const m of t.matchAll(re)) {
  cards.push({ handle: m[1], name: m[2].replace(/\s+/g, ' ').trim() });
}
// also grab product links near "Months"
const nearAge = [];
for (const m of t.matchAll(/\/products\/([a-z0-9-]+)[\s\S]{0,800}?(\d+\+?\s*Months?|\d+\+?\s*Years?)/gi)) {
  nearAge.push({ handle: m[1], age: m[2] });
}
console.log('status', r.status, 'len', t.length);
console.log('cards', [...new Map(cards.map((c) => [c.handle, c])).values()].slice(0, 40));
console.log(
  'ages',
  [...new Map(nearAge.map((c) => [c.handle + c.age, c])).values()].filter((c) => /month/i.test(c.age)).slice(0, 40),
);
fs.writeFileSync(
  new URL('./kitchen-collection-snip.html', import.meta.url),
  t.slice(0, 50000),
);
