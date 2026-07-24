const r = await fetch('https://www.adventuretoys.co.uk/indoor-toys/kitchens/', {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'accept-language': 'en-GB',
  },
});
const t = await r.text();
// Find product cards with Age 2
const chunks = t.split(/href="(\/[^"]+)"/);
const hits = [];
for (let i = 1; i < chunks.length; i += 2) {
  const href = chunks[i];
  const after = chunks[i + 1] || '';
  if (/Age\s*2/i.test(after.slice(0, 800)) && /kitchen|food|tea|toast|cook|cupcake|fruit|pot/i.test(href + after.slice(0, 200))) {
    hits.push({ href, snip: after.replace(/\s+/g, ' ').slice(0, 120) });
  }
}
console.log('status', r.status, 'hits', hits.slice(0, 20));

const r2 = await fetch('https://www.adventuretoys.co.uk/indoor-toys/kitchens/?pg=2', {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'accept-language': 'en-GB',
  },
});
const t2 = await r2.text();
const chunks2 = t2.split(/href="(\/[^"]+)"/);
const hits2 = [];
for (let i = 1; i < chunks2.length; i += 2) {
  const href = chunks2[i];
  const after = chunks2[i + 1] || '';
  if (/Age\s*2/i.test(after.slice(0, 800))) {
    hits2.push(href);
  }
}
console.log('page2 age2', [...new Set(hits2)].slice(0, 30));
