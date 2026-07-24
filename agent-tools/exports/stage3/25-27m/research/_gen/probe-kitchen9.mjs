const urls = [
  'https://www.adventuretoys.co.uk/hape-toaster-pop-up-set/',
  'https://www.adventuretoys.co.uk/im-toy-mixed-fruit-and-vegetable-box/',
  'https://www.adventuretoys.co.uk/search/?q=tidlo',
  'https://www.adventuretoys.co.uk/search/?q=bigjigs+breakfast',
  'https://www.adventuretoys.co.uk/search/?q=play+food',
  'https://www.adventuretoys.co.uk/search/?q=toaster',
  'https://www.adventuretoys.co.uk/search/?q=tea+set',
  'https://www.jarrolds.co.uk/departments/toys-and-hobbies/preschool-and-infant/roleplay-and-dressing-up/',
  'https://www.woodentoyshop.co.uk/products/wooden-breakfast-set',
  'https://www.woodentoyshop.co.uk/products/wooden-pots-and-pans-set',
  'https://www.woodentoyshop.co.uk/products/wooden-cookie-baking-set',
  'https://www.woodentoyshop.co.uk/products/casserole-dish-set',
  'https://uk.hape.com/pop-up-toaster-set-e3148',
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
    const age = [...t.matchAll(/(18\s*\+?\s*months?|3\s*\+?\s*years?|Age[:\s]+\d+|from\s+\d+\s*years?)/gi)].map((m) => m[0]).slice(0, 5);
    const buy = /add to (bag|basket|cart)|Buy Now/i.test(t);
    const links = [...t.matchAll(/href="([^"]*(?:toaster|fruit|tidlo|bigjigs|kitchen|tea|food)[^"]*)"/gi)].map((m) => m[1]).slice(0, 8);
    console.log(JSON.stringify({ s: r.status, buy, age: [...new Set(age)], title, links: links.slice(0, 5), u: u.slice(0, 85) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
