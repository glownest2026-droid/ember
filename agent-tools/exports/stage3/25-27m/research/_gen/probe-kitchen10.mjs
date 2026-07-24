const urls = [
  'https://www.adventuretoys.co.uk/bigjigs-breakfast-time-set/',
  'https://www.adventuretoys.co.uk/big-jigs-toaster-pink/',
  'https://www.adventuretoys.co.uk/bigjigs-birthday-cake/',
  'https://www.woodentoyshop.co.uk/search?q=orange+tree+toys',
  'https://www.woodentoyshop.co.uk/search?q=i%27m+toy',
  'https://www.woodentoyshop.co.uk/search?q=im+toy',
  'https://www.woodentoyshop.co.uk/search?q=small+foot',
  'https://www.woodentoyshop.co.uk/search?q=scratch',
  'https://www.woodentoyshop.co.uk/search?q=djeco+kitchen',
  'https://www.woodentoyshop.co.uk/search?q=djeco+food',
  'https://www.woodentoyshop.co.uk/collections/wooden-play-food',
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
    const age = [...t.matchAll(/(18\s*\+?\s*months?|Suitable for[^.<]{0,40}|3\s*\+?\s*years?)/gi)].map((m) => m[0].replace(/\s+/g, ' ').trim()).slice(0, 6);
    const buy = /add to (bag|basket|cart)|Buy Now/i.test(t);
    const products = [...t.matchAll(/\/products\/([a-z0-9-]+)/gi)].map((m) => m[1]);
    console.log(JSON.stringify({ s: r.status, buy, age: [...new Set(age)].slice(0, 5), products: [...new Set(products)].slice(0, 10), title, u: u.slice(0, 85) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
