const urls = [
  'https://www.woodentoyshop.co.uk/products/tidlo-wooden-cutting-fruits-set',
  'https://www.woodentoyshop.co.uk/products/wooden-cutting-fruits-set',
  'https://www.woodentoyshop.co.uk/products/tidlo-cutting-fruit',
  'https://www.woodentoyshop.co.uk/products/cutting-fruits-set',
  'https://www.woodentoyshop.co.uk/products/wooden-baking-cookies-set',
  'https://www.woodentoyshop.co.uk/products/baking-cookies-set',
  'https://www.woodentoyshop.co.uk/products/bigjigs-baking-cookies-set',
  'https://www.woodentoyshop.co.uk/products/wooden-sausages',
  'https://www.woodentoyshop.co.uk/products/wooden-play-food-egg',
  'https://www.woodentoyshop.co.uk/products/wooden-egg',
  'https://www.woodentoyshop.co.uk/products/play-food-egg',
  'https://www.woodentoyshop.co.uk/products/wooden-cupboard-groceries',
  'https://www.woodentoyshop.co.uk/products/cupboard-groceries',
  'https://www.woodentoyshop.co.uk/products/tidlo-wooden-fruit',
  'https://www.woodentoyshop.co.uk/search?q=tidlo+cutting',
  'https://www.woodentoyshop.co.uk/search?q=tidlo+fruit',
  'https://www.woodentoyshop.co.uk/search?q=baking+cookies',
  'https://www.woodentoyshop.co.uk/search?q=janod+kitchen',
  'https://www.woodentoyshop.co.uk/search?q=tidlo',
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
    const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 100);
    const age = [];
    for (const re of [/18\s*\+?\s*months?/gi, /Suitable for[^.<]{0,40}/gi, /Age Range[^<]{0,50}/gi, /3\s*\+?\s*years?/gi]) {
      const m = t.match(re);
      if (m) age.push(...m.slice(0, 2));
    }
    const buy = /add to (bag|basket|cart)/i.test(t);
    const handles = [...t.matchAll(/\/products\/([a-z0-9-]+)/gi)].map((m) => m[1]);
    const price = (t.match(/£\s?\d+(\.\d{2})?/) || [])[0];
    console.log(
      JSON.stringify({
        s: r.status,
        buy,
        price,
        age: [...new Set(age.map((x) => x.replace(/\s+/g, ' ').trim()))].slice(0, 4),
        title,
        sample: [...new Set(handles)].slice(0, 8),
        u: u.slice(0, 90),
      }),
    );
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
