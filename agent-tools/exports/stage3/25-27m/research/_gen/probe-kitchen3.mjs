const urls = [
  'https://www.woodentoyshop.co.uk/products/wooden-breakfast-set',
  'https://www.thetoycentre.co.uk/breakfast-set/',
  'https://www.jarrolds.co.uk/departments/toys-and-hobbies/preschool-and-infant/roleplay-and-dressing-up/bigjigs-toys-breakfast-set',
  'https://www.bigjigstoys.co.uk/products/wooden-breakfast-set',
  'https://www.woodentoyshop.co.uk/products/wooden-cutting-fruit',
  'https://www.woodentoyshop.co.uk/products/bigjigs-cutting-fruit',
  'https://www.woodentoyshop.co.uk/products/wooden-tea-set',
  'https://www.woodentoyshop.co.uk/products/bigjigs-tea-set',
  'https://www.thetoycentre.co.uk/cutting-fruit/',
  'https://www.thetoycentre.co.uk/tea-set/',
  'https://www.thetoycentre.co.uk/toaster/',
  'https://www.thetoycentre.co.uk/coffee-machine/',
  'https://www.thetoycentre.co.uk/dinner-set/',
  'https://www.woodentoyshop.co.uk/collections/role-play',
  'https://www.kidly.co.uk/bigjigs-toys-wooden-breakfast-set',
  'https://www.jojomamanbebe.co.uk/bigjigs-breakfast-set-n2199.html',
  'https://www.selfridges.com/GB/en/cat/bigjigs-toys-breakfast-set_R03833718/',
  'https://www.fenwick.co.uk/bigjigs-toys-breakfast-set',
  'https://www.babipur.co.uk/products/bigjigs-toys-breakfast-set',
  'https://www.babipur.co.uk/products/bigjigs-toys-tea-set',
  'https://www.babipur.co.uk/products/bigjigs-toys-cutting-fruit',
  'https://www.babipur.co.uk/products/bigjigs-toys-toaster',
  'https://www.babipur.co.uk/products/plan-toys-toaster-set',
  'https://www.babipur.co.uk/products/plan-toys-kitchen-ware-set',
  'https://www.babipur.co.uk/products/plantoys-cooking-utensils',
  'https://www.babipur.co.uk/products/plan-toys-fruit-set',
  'https://www.babipur.co.uk/products/tender-leaf-toast-rack',
  'https://www.babipur.co.uk/products/tender-leaf-tea-set',
  'https://www.babipur.co.uk/products/tender-leaf-mini-chef-chopping-board',
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
      signal: AbortSignal.timeout(20000),
    });
    const t = await r.text();
    const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 90);
    const age = [];
    for (const re of [/18\s*\+?\s*months?/gi, /from\s+18/gi, /Ages?\s*\d+/gi, /3\s*\+?\s*years?/gi, /suitable for[^.<]{0,40}/gi]) {
      const m = t.match(re);
      if (m) age.push(...m.slice(0, 2));
    }
    const buy = /add to (bag|basket|cart)/i.test(t);
    const oos = /out of stock|sold out/i.test(t.slice(0, 12000));
    console.log(JSON.stringify({ s: r.status, buy, oos, age: [...new Set(age)].slice(0, 5), title, u: u.slice(0, 95) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
