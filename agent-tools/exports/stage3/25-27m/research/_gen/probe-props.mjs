const urls = [
  'https://www.smythstoys.com/uk/en-gb/toys/preschool-toys/role-play-and-dress-up/play-kitchens-and-shops/elc-wooden-fruit-chopping-board/p/189194',
  'https://www.bigjigstoys.co.uk/products/cutting-fruit-crate',
  'https://www.bigjigstoys.co.uk/products/cutting-vegetables',
  'https://www.bigjigstoys.co.uk/products/breakfast-set',
  'https://www.bigjigstoys.co.uk/products/dinner-set',
  'https://www.bigjigstoys.co.uk/products/tea-set',
  'https://www.smarttoys.co.uk/elc-wooden-fruit-chopping-board',
  'https://www.thetoyshop.com/elc-wooden-fruit-chopping-board/p/mp00000000',
  'https://www.johnlewis.com/early-learning-centre-wooden-fruit-chopping-board/p3399786',
  'https://www.amazon.co.uk/Early-Learning-Centre-Wooden-Chopping/dp/B07D9YZXYZ',
  'https://letoyvan.co.uk/collections/role-play-cooking-wooden-kitchens/products/honeybake-oven-hob-set',
  'https://letoyvan.co.uk/products/honeybake-fruit-crate',
  'https://www.dunelm.com/product/wooden-tea-set-1000181234',
  'https://www.ikea.com/gb/en/p/duktig-9-piece-tea-set-80363966/',
  'https://www.mooseetoys.com/',
];

async function probe(u) {
  try {
    const r = await fetch(u, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        accept: 'text/html',
        'accept-language': 'en-GB,en;q=0.9',
      },
      redirect: 'follow',
    });
    const t = await r.text();
    const ageBits = [];
    for (const re of [/suitable from[^.<]{0,30}/gi, /from\s+\d+\s*(months?|years?)/gi, /Ages?\s*\d+\+/gi, /18\s*months?/gi]) {
      const m = t.match(re);
      if (m) ageBits.push(...m.slice(0, 2));
    }
    const buy = /add to (bag|basket|cart)/i.test(t);
    const oos = /out of stock|sold out|unavailable/i.test(t.slice(0, 10000));
    console.log(JSON.stringify({ s: r.status, buy, oos, age: [...new Set(ageBits)].slice(0, 5), u: u.slice(0, 110) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
