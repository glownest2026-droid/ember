await new Promise((r) => setTimeout(r, 2000));
const r = await fetch('https://www.woodentoyshop.co.uk/search?q=tidlo', {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'accept-language': 'en-GB',
  },
  signal: AbortSignal.timeout(25000),
});
const t = await r.text();
const near = [];
for (const m of t.matchAll(/\/products\/([a-z0-9-]+)[\s\S]{0,1200}?(18\s*Months?|3\+?\s*years?|3 Years)/gi)) {
  near.push({ handle: m[1], age: m[2] });
}
console.log('status', r.status);
console.log(
  [...new Map(near.map((x) => [x.handle + x.age, x])).values()]
    .filter((x) => /month/i.test(x.age))
    .slice(0, 30),
);
