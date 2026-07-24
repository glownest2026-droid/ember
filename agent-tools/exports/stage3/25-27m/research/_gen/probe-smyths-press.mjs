const urls = [
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/role-play/elc-wooden-toaster/p/186575',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool-toys/role-play-and-dress-up/play-kitchens-and-shops/elc-wooden-toaster/p/186575',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool-toys/role-play-and-dress-up/play-kitchens-and-shops/elc-wooden-fruit-chopping-board/p/189194',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/educational-toys/melissa-and-doug-shape-sorting-cube/p/159210',
  'https://www.smythstoys.com/uk/en-gb/search/?text=wooden+toaster',
  'https://www.smythstoys.com/uk/en-gb/search/?text=play+food',
  'https://www.smythstoys.com/uk/en-gb/search/?text=melissa+doug+food',
  'https://www.penguin.co.uk/books/108934/mix-it-up-by-tullet-herve/9781452137356',
  'https://www.penguin.co.uk/search/all?q=press+here',
  'https://uk.bookshop.org/p/books/mix-it-up-herve-tullet/9781452137356',
  'https://uk.bookshop.org/p/books/let-s-play-herve-tullet/9781452154770',
  'https://www.penguin.co.uk/books/111060/dear-zoo/9780230747890',
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
    const interruption = /Pardon Our Interruption|Access Denied|captcha/i.test(t);
    const buy = /add to (bag|basket|cart)/i.test(t);
    const age = [...t.matchAll(/(18\s*months?|Ages?\s*\d+|from\s+\d+\s*years?|3\s*years?)/gi)].map((m) => m[0]).slice(0, 5);
    console.log(JSON.stringify({ s: r.status, buy, interruption, age: [...new Set(age)], title, u: u.slice(0, 95) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
