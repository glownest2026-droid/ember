const urls = [
  'https://www.woodentoyshop.co.uk/products/cutting-fruits-set',
  'https://www.woodentoyshop.co.uk/products/cutting-vegetables-set',
  'https://www.woodentoyshop.co.uk/products/wooden-cookie-baking-set',
  'https://www.woodentoyshop.co.uk/products/tea-set-for-two',
  'https://www.woodentoyshop.co.uk/products/wooden-breakfast-set',
  'https://www.woodentoyshop.co.uk/products/wooden-pots-and-pans-set',
  'https://www.woodentoyshop.co.uk/products/casserole-dish-set',
  'https://www.woodentoyshop.co.uk/search?q=tidlo+kitchen',
  'https://www.woodentoyshop.co.uk/search?q=tidlo+tea',
  'https://www.woodentoyshop.co.uk/search?q=tidlo+pots',
  'https://www.woodentoyshop.co.uk/search?q=orange+tree+toys+kitchen',
  'https://www.woodentoyshop.co.uk/search?q=smallfoot+kitchen',
  'https://www.woodentoyshop.co.uk/search?q=classic+world+kitchen',
];

async function probe(u) {
  try {
    const r = await fetch(u, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        accept: 'text/html',
        'accept-language': 'en-GB',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    const t = await r.text();
    const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 110);
    const brand = (t.match(/Brand[^<]*<\/[^>]+>\s*<[^>]+>([^<]+)/i) || t.match(/vendor":"([^"]+)/i) || [])[1];
    const age = [];
    for (const re of [/18\s*\+?\s*months?/gi, /Suitable for[^.<]{0,45}/gi, /Age Range\s*([^<\n]{0,40})/gi, /3\s*\+?\s*years?/gi, /12\s*\+?\s*months?/gi]) {
      const m = t.match(re);
      if (m) age.push(...m.slice(0, 2));
    }
    const buy = /add to (bag|basket|cart)/i.test(t);
    const price = (t.match(/£\s?\d+(\.\d{2})?/) || [])[0];
    const handles = [...t.matchAll(/\/products\/([a-z0-9-]+)/gi)].map((m) => m[1]);
    console.log(
      JSON.stringify({
        s: r.status,
        buy,
        price,
        brand,
        age: [...new Set(age.map((x) => x.replace(/\s+/g, ' ').trim()))].slice(0, 5),
        title,
        sample: [...new Set(handles)].slice(0, 6),
        u: u.slice(0, 85),
      }),
    );
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
