/**
 * Probe UK play-kitchen / household props for 25-27m (age overlap under 36m + buyable).
 */
const urls = [
  'https://www.bigjigstoys.co.uk/products/breakfast-set',
  'https://www.bigjigstoys.co.uk/products/cutting-fruit',
  'https://www.bigjigstoys.co.uk/products/fruit-crate',
  'https://www.bigjigstoys.co.uk/products/wooden-tea-set',
  'https://www.bigjigstoys.co.uk/products/pots-and-pans',
  'https://www.bigjigstoys.co.uk/products/toaster-set',
  'https://www.bigjigstoys.co.uk/products/coffee-machine',
  'https://www.argos.co.uk/product/3141846',
  'https://www.argos.co.uk/product/8870466',
  'https://www.argos.co.uk/product/1307980',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/role-play/elc-wooden-toaster/p/186575',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/role-play/elc-wooden-blender/p/189196',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool-toys/role-play-and-dress-up/play-kitchens-and-shops/elc-wooden-toaster/p/186575',
  'https://www.johnlewis.com/early-learning-centre-wooden-toaster/p3399787',
  'https://www.johnlewis.com/early-learning-centre-wooden-blender/p4509567',
  'https://www.very.co.uk/elc-wooden-toaster/1600583416.prd',
  'https://www.very.co.uk/elc-wooden-fruit-chopping-board/1600468123.prd',
  'https://www.toysrus.co.uk/elc-wooden-toaster/A-364489.html',
  'https://www.hamleys.com/elc-wooden-toaster',
  'https://www.ikea.com/gb/en/p/duktig-9-piece-tea-set-80363966/',
  'https://www.ikea.com/gb/en/p/duktig-10-piece-cookware-set-60185745/',
  'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-kitchen-utensil-set-00185744/',
  'https://www.ikea.com/gb/en/p/duktig-play-kitchen-white-20319974/',
  'https://www.mothercare.com/p/elc-wooden-toaster/146864.html',
  'https://www.boots.com/elc-wooden-toaster-10279636',
  'https://www.alframetoys.com/products/bigjigs-toys-breakfast-set',
  'https://www.alframetoys.com/products/bigjigs-toys-cutting-fruit',
  'https://www.alframetoys.com/products/bigjigs-toys-tea-set',
  'https://www.alframetoys.com/products/bigjigs-toys-toaster',
  'https://www.alframetoys.com/products/bigjigs-toys-coffee-machine',
  'https://www.kidly.co.uk/products/bigjigs-breakfast-set',
  'https://www.naturalbabyshower.co.uk/products/bigjigs-toys-breakfast-set',
  'https://www.scandiborn.co.uk/products/little-dutch-mini-kitchen',
  'https://www.kidly.co.uk/products/little-dutch-wooden-mini-kitchen',
  'https://www.naturalbabyshower.co.uk/products/little-dutch-mini-kitchen',
];

async function probe(u) {
  try {
    const r = await fetch(u, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'en-GB,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    const t = await r.text();
    const ageBits = [];
    for (const re of [
      /suitable from[^.<]{0,40}/gi,
      /from\s+\d+\s*(months?|years?)/gi,
      /Ages?\s*\d+(\s*[-–]\s*\d+)?(\+)?/gi,
      /\d+\+\s*years?/gi,
      /not suitable (for|under)[^.<]{0,40}/gi,
      /18\s*months?/gi,
      /24\s*months?/gi,
      /3\s*years?/gi,
    ]) {
      const m = t.match(re);
      if (m) ageBits.push(...m.slice(0, 3));
    }
    const buy = /add to (bag|basket|cart)|buy now|add_to_cart/i.test(t);
    const oos = /out of stock|sold out|notify me when|currently unavailable/i.test(t.slice(0, 15000));
    const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').slice(0, 80);
    console.log(
      JSON.stringify({
        s: r.status,
        buy,
        oos,
        age: [...new Set(ageBits.map((x) => x.trim()))].slice(0, 6),
        title,
        u: u.slice(0, 100),
      }),
    );
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
