async function probe(u) {
  await new Promise((r) => setTimeout(r, 1200));
  const r = await fetch(u, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      accept: 'text/html',
      'accept-language': 'en-GB',
    },
    signal: AbortSignal.timeout(20000),
  });
  const t = await r.text();
  const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 100);
  const brand = (t.match(/"vendor":"([^"]+)"/) || [])[1];
  const ageBlock = t.match(/Age Range[\s\S]{0,80}/i)?.[0]?.replace(/\s+/g, ' ').slice(0, 100);
  const suitable = [...t.matchAll(/Suitable for[^.<]{0,40}/gi)].map((m) => m[0]).slice(0, 3);
  console.log(JSON.stringify({ s: r.status, brand, ageBlock, suitable, title, u: u.slice(40) }));
}

for (const u of [
  'https://www.woodentoyshop.co.uk/products/shop-till',
  'https://www.woodentoyshop.co.uk/products/vanity-kit',
  'https://www.woodentoyshop.co.uk/products/ice-lolly-pack-of-2-chocolate-with-sprinkles',
  'https://www.woodentoyshop.co.uk/products/wooden-cookie-baking-set',
  'https://www.woodentoyshop.co.uk/products/cutting-fruits-set',
  'https://www.woodentoyshop.co.uk/products/wooden-pots-and-pans-set',
]) {
  try {
    await probe(u);
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u }));
  }
}
