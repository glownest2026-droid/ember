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
    const buy = /add to (bag|basket|cart)/i.test(t);
    const age = [...t.matchAll(/(18\s*\+?\s*months?|Suitable for[^.<]{0,40}|3\s*\+?\s*years?)/gi)].map((m) => m[0].replace(/\s+/g, ' ')).slice(0, 5);
    const hrefs = [...t.matchAll(/href="([^"]*tidlo[^"]*)"/gi)].map((m) => m[1]).slice(0, 15);
    console.log(JSON.stringify({ s: r.status, buy, age: [...new Set(age)], hrefs, title, u: u.slice(0, 100) }));
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u: u.slice(0, 80) }));
  }
}

const urls = [
  'https://www.jarrolds.co.uk/search/?q=tidlo',
  'https://www.jarrolds.co.uk/search/?q=cutting+fruit',
  'https://www.jarrolds.co.uk/search/?q=play+kitchen',
  'https://www.jarrolds.co.uk/search/?q=wooden+toaster',
  'https://www.jarrolds.co.uk/departments/toys-and-hobbies/preschool-and-infant/roleplay-and-dressing-up/tender-leaf-toys-breakfast-toaster-set',
  'https://www.penguin.co.uk/books/313409/oh-no-george-by-haughton-chris/9781406338546',
  'https://www.penguin.co.uk/books/111124/the-tiger-who-came-to-tea-by-kerr-judith/9780007215997',
  'https://www.penguin.co.uk/books/108935/were-going-on-a-bear-hunt-by-rosen-michael/9780744523232',
];

for (const u of urls) await probe(u);
