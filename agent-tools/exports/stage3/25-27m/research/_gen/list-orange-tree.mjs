await new Promise((r) => setTimeout(r, 1500));
const r = await fetch('https://www.woodentoyshop.co.uk/collections/all?q=orange+tree', {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'accept-language': 'en-GB',
  },
  signal: AbortSignal.timeout(25000),
});
const t = await r.text();
const products = [...t.matchAll(/href="(\/products\/[a-z0-9-]+)"/g)].map((m) => m[1]);
console.log('status', r.status, 'unique', new Set(products).size);
console.log([...new Set(products)].slice(0, 40).join('\n'));
