const urls = [
  'https://www.amazon.co.uk/Bigjigs-Toys-Breakfast-Set/dp/B00BM5W1A0',
  'https://www.amazon.co.uk/Tidlo-Cutting-Fruits/dp/B00BM5UZ1K',
  'https://www.amazon.co.uk/Hape-Pop-Up-Toaster-E3151B/dp/B006WZ9Y6C',
  'https://www.amazon.co.uk/Hape-Cook-Serve-Wooden-Kitchen/dp/B007VFCR96',
  'https://www.amazon.co.uk/Melissa-Doug-Food-Groups/dp/B000GHW7IW',
  'https://www.amazon.co.uk/Chad-Valley-Wooden-Toaster/dp/B07D9YZXYZ',
  'https://www.amazon.co.uk/Early-Learning-Centre-Wooden-Toaster/dp/B07D9YZY1Z',
  'https://www.amazon.co.uk/Orange-Tree-Toys-Wooden-Toaster/dp/B08XYZ',
  'https://www.argos.co.uk/product/8870466', // chad valley?
  'https://www.tesco.com/direct/chad-valley-wooden-toaster',
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
    const captcha = /captcha|robot|api-services-support@amazon/i.test(t);
    const age = [...t.matchAll(/(\d+\s*\+?\s*(?:months?|years?)|Ages?\s*\d+)/gi)].map((m) => m[0]).slice(0, 5);
    console.log(JSON.stringify({ s: r.status, captcha, age: [...new Set(age)], title, u: u.slice(0, 80) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 70) }));
  }
}

for (const u of urls) await probe(u);
