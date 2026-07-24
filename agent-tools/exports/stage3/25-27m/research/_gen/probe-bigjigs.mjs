const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const urls = [
  'https://www.bigjigstoys.co.uk/products/cutting-fruit-crate',
  'https://www.bigjigstoys.co.uk/products/cutting-vegetables-crate',
  'https://www.bigjigstoys.co.uk/products/cutting-vegetables',
  'https://www.bigjigstoys.co.uk/products/wooden-breakfast-set',
  'https://www.bigjigstoys.co.uk/products/breakfast-set',
  'https://www.bigjigstoys.co.uk/products/butchers-crate',
  'https://www.bigjigstoys.co.uk/products/dinner-set',
  'https://www.bigjigstoys.co.uk/products/afternoon-tea-set',
  'https://www.bigjigstoys.co.uk/products/tea-set-pink',
  'https://www.bigjigstoys.co.uk/products/cookware-set',
  'https://www.bigjigstoys.co.uk/products/pots-and-pans-set',
  'https://www.bigjigstoys.co.uk/products/food-groups',
  'https://www.melissaanddoug.co.uk/products/food-groups',
  'https://www.melissaanddoug.com/products/food-groups-2159',
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
    });
    const t = await r.text();
    const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 80);
    const age = (
      t.match(/Suitable for children from[^.<]{0,40}/i) ||
      t.match(/from\s+\d+\s*(Months?|Years?)/i) ||
      t.match(/Ages?\s*\d+\+/i) ||
      []
    )[0];
    const price = (t.match(/£\d+\.\d{2}/) || [])[0];
    const buy = /add to (bag|cart|basket)/i.test(t);
    const oos = /sold out|out of stock/i.test(t.slice(0, 12000));
    console.log(JSON.stringify({ s: r.status, buy, oos, price, age, title, u: u.split('/').pop() }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.split('/').pop() }));
  }
}

for (const u of urls) {
  await probe(u);
  await sleep(1200);
}
