const urls = [
  'https://www.woodentoyshop.co.uk/products/education-cooker',
  'https://www.woodentoyshop.co.uk/products/kitchen',
  'https://www.woodentoyshop.co.uk/products/kiwi-pack-of-2',
  'https://www.woodentoyshop.co.uk/products/lemon-pack-of-2',
  'https://www.woodentoyshop.co.uk/products/pepper-pack-of-2',
  'https://www.woodentoyshop.co.uk/products/vegetable-crate',
  'https://www.woodentoyshop.co.uk/products/pretend-play-wooden-avocados',
  'https://www.woodentoyshop.co.uk/products/picnic-basket',
  'https://www.woodentoyshop.co.uk/products/education-fridge',
  'https://www.woodentoyshop.co.uk/products/country-play-kitchen',
  'https://www.jarrolds.co.uk/departments/toys-and-hobbies/preschool-and-infant/roleplay-and-dressing-up/bigjigs-toys-breakfast-set',
  'https://www.jarrolds.co.uk/search/?q=tidlo+cutting',
  'https://www.jarrolds.co.uk/search/?q=orange+tree',
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
    const age = [];
    for (const re of [/18\s*\+?\s*months?/gi, /Suitable for[^.<]{0,45}/gi, /Age Range\s*([^<\n]{0,40})/gi, /3\s*\+?\s*years?/gi, /12\s*\+?\s*months?/gi]) {
      const m = t.match(re);
      if (m) age.push(...m.slice(0, 2));
    }
    const buy = /add to (bag|basket|cart)/i.test(t);
    const price = (t.match(/£\s?\d+(\.\d{2})?/) || [])[0];
    console.log(JSON.stringify({ s: r.status, buy, price, age: [...new Set(age.map((x) => x.replace(/\s+/g, ' ').trim()))].slice(0, 5), title, u: u.slice(0, 90) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
