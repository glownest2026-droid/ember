const urls = [
  'https://www.earlylearningcentre.com/uk/p/elc-wooden-toaster/139549',
  'https://www.earlylearningcentre.com/uk/p/elc-wooden-fruit-chopping-board/139548',
  'https://www.earlylearningcentre.com/uk/p/elc-wooden-blender/139550',
  'https://www.earlylearningcentre.com/uk/c/toys/role-play/play-kitchens/',
  'https://www.theentertainer.com/elc-wooden-toaster/p/mp0000000094285',
  'https://www.theentertainer.com/elc-wooden-fruit-chopping-board/p/mp0000000094284',
  'https://www.gompels.co.uk/role-play-kitchen.html',
  'https://www.gompels.co.uk/wooden-fruit.html',
  'https://www.gompels.co.uk/search.php?search_query=toaster',
  'https://www.gompels.co.uk/search.php?search_query=play+food',
  'https://www.gompels.co.uk/search.php?search_query=kitchen',
  'https://www.boots.com/elc-wooden-toaster-10279636',
  'https://www.johnlewis.com/search?search-term=elc+wooden+toaster',
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
    const age = [];
    for (const re of [/18\s*months?/gi, /Ages?\s*\d+/gi, /from\s+\d+/gi, /3\s*years?/gi, /suitable from[^.<]{0,40}/gi]) {
      const m = t.match(re);
      if (m) age.push(...m.slice(0, 2));
    }
    const buy = /add to (bag|basket|cart)/i.test(t);
    console.log(JSON.stringify({ s: r.status, buy, age: [...new Set(age)].slice(0, 5), title, u: u.slice(0, 90) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

for (const u of urls) await probe(u);
