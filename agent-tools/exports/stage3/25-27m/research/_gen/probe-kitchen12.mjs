async function probe(u) {
  await new Promise((r) => setTimeout(r, 1500));
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
    const brand = (t.match(/"vendor":"([^"]+)"/i) || t.match(/Brand[^A-Za-z]{0,20}([A-Za-z][^<\n]{2,40})/i) || [])[1];
    const snippet = t.replace(/\s+/g, ' ').match(/.{0,80}(18|months|years|Age|Suitable).{0,80}/gi)?.slice(0, 4);
    const buy = /add to (bag|basket|cart)|Buy Now/i.test(t);
    const price = (t.match(/£\s?\d+(\.\d{2})?/) || [])[0];
    console.log(JSON.stringify({ s: r.status, buy, price, brand, title, snippet, u: u.slice(0, 90) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

const urls = [
  'https://www.adventuretoys.co.uk/bigjigs-breakfast-time-set/',
  'https://www.adventuretoys.co.uk/big-jigs-toaster-pink/',
  'https://www.woodentoyshop.co.uk/products/fruit-and-veg-magnets',
  'https://www.woodentoyshop.co.uk/products/pancake-set',
  'https://www.woodentoyshop.co.uk/products/breakfast-fry-up',
  'https://www.woodentoyshop.co.uk/products/fsc-coffee-maker',
  'https://www.woodentoyshop.co.uk/products/fruit-crate',
  'https://www.woodentoyshop.co.uk/products/cutting-fruits-set',
];

for (const u of urls) await probe(u);
