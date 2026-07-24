async function extract(q) {
  const u = 'https://www.ikea.com/gb/en/search/?q=' + encodeURIComponent(q);
  const r = await fetch(u, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });
  const t = await r.text();
  const links = [...t.matchAll(/href="(https:\/\/www\.ikea\.com\/gb\/en\/p\/[^"]+)"/g)].map((m) => m[1]);
  const uniq = [...new Set(links)].slice(0, 10);
  console.log('Q:', q, 'status', r.status, 'links', uniq.length);
  for (const l of uniq) console.log(' ', l);
}

for (const q of [
  'duktig play kitchen',
  'lockig',
  'lilla potty',
  'sparka',
  'klappa ball',
  'trogen stool',
  'foersiktig',
]) {
  await extract(q);
}
