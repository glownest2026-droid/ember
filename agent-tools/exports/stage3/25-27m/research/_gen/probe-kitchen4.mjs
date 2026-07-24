const urls = [
  'https://www.woodentoyshop.co.uk/products/wooden-breakfast-set',
  'https://www.woodentoyshop.co.uk/products/wooden-pots-and-pans-set',
  'https://www.woodentoyshop.co.uk/products/wooden-dinner-service-set',
  'https://www.woodentoyshop.co.uk/products/casserole-dish-set',
  'https://www.woodentoyshop.co.uk/products/wooden-tea-set-for-two',
  'https://www.woodentoyshop.co.uk/products/wooden-baking-cookies-set',
  'https://www.woodentoyshop.co.uk/products/bigjigs-wooden-tea-set-for-two',
  'https://www.woodentoyshop.co.uk/products/tea-set-for-two',
  'https://www.woodentoyshop.co.uk/collections/wooden-toy-kitchen-play-shop',
  'https://www.jarrolds.co.uk/departments/toys-and-hobbies/preschool-and-infant/roleplay-and-dressing-up/bigjigs-toys-breakfast-set',
  'https://www.woodentoyshop.co.uk/products/plan-toys-toaster-set',
  'https://www.woodentoyshop.co.uk/products/plantoys-toaster-set',
  'https://www.woodentoyshop.co.uk/products/plan-toys-kitchen-set',
  'https://www.woodentoyshop.co.uk/products/tender-leaf-toaster',
  'https://www.woodentoyshop.co.uk/products/tender-leaf-toys-toaster-set',
  'https://www.woodentoyshop.co.uk/products/honeybake-toaster',
  'https://www.woodentoyshop.co.uk/products/le-toy-van-toaster',
  'https://www.woodentoyshop.co.uk/products/le-toy-van-honeybake-toaster',
  'https://www.woodentoyshop.co.uk/products/le-toy-van-honeybake-oven',
  'https://www.woodentoyshop.co.uk/products/le-toy-van-fruit-crate',
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
    const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 90);
    const age = [];
    for (const re of [
      /18\s*\+?\s*months?/gi,
      /Age Range[^<]{0,40}/gi,
      /Suitable for[^.<]{0,40}/gi,
      /3\s*\+?\s*years?/gi,
      /from\s+\d+\s*(months?|years?)/gi,
    ]) {
      const m = t.match(re);
      if (m) age.push(...m.slice(0, 2));
    }
    const buy = /add to (bag|basket|cart)/i.test(t);
    const oos = /out of stock|sold out/i.test(t.slice(0, 12000));
    const price = (t.match(/£\s?\d+(\.\d{2})?/) || [])[0];
    console.log(JSON.stringify({ s: r.status, buy, oos, price, age: [...new Set(age)].slice(0, 5), title, u: u.slice(0, 95) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
