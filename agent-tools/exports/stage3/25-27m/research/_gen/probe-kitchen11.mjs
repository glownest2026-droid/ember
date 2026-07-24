const urls = [
  'https://www.woodentoyshop.co.uk/products/pancake-set',
  'https://www.woodentoyshop.co.uk/products/breakfast-fry-up',
  'https://www.woodentoyshop.co.uk/products/fsc-coffee-maker',
  'https://www.woodentoyshop.co.uk/products/chilled-groceries',
  'https://www.woodentoyshop.co.uk/products/fruit-crate',
  'https://www.woodentoyshop.co.uk/products/roast-dinner-set',
  'https://www.woodentoyshop.co.uk/products/fruit-and-veg-magnets',
  'https://www.woodentoyshop.co.uk/products/pretend-play-wooden-pumpkins',
  'https://www.woodentoyshop.co.uk/products/tabletop-kitchen',
  'https://www.woodentoyshop.co.uk/products/iron-and-board',
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
    const brandMatch =
      t.match(/itemprop="brand"[^>]*>\s*<[^>]+>([^<]+)/i) ||
      t.match(/"vendor":"([^"]+)"/i) ||
      t.match(/Brand\s*<\/[^>]+>\s*<[^>]+>\s*([^<\n]+)/i);
    const age = [...t.matchAll(/(18\s*\+?\s*months?|Suitable for[^.<]{0,45}|Age Range[^<]{0,40}|3\s*\+?\s*years?)/gi)]
      .map((m) => m[0].replace(/\s+/g, ' ').trim())
      .slice(0, 5);
    const buy = /add to (bag|basket|cart)/i.test(t);
    const price = (t.match(/£\s?\d+(\.\d{2})?/) || [])[0];
    console.log(JSON.stringify({ s: r.status, buy, price, brand: brandMatch?.[1]?.trim(), age: [...new Set(age)], title, u: u.slice(40) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(40) }));
  }
}

for (const u of urls) await probe(u);
