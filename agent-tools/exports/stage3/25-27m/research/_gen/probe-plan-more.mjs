async function probe(u) {
  await new Promise((r) => setTimeout(r, 700));
  const r = await fetch(u, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'accept-language': 'en-GB',
    },
    signal: AbortSignal.timeout(20000),
  });
  const t = await r.text();
  const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 80);
  const buy = /Buy Now|add to (bag|basket|cart)/i.test(t);
  const plain = t
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const ageLine = plain.match(/Age\s*\d+[+]?(?:\s*years?)?/i)?.[0];
  const about = plain.match(/About the[\s\S]{0,400}/i)?.[0]?.slice(0, 200);
  console.log(JSON.stringify({ s: r.status, buy, ageLine, title, about, u: u.slice(30) }));
}

for (const u of [
  'https://www.adventuretoys.co.uk/plan-toys-cupcake-set-wooden/',
  'https://www.adventuretoys.co.uk/bigjigs-sweet-treats-wooden-food/',
  'https://www.adventuretoys.co.uk/big-jigs-toaster-pink/',
  'https://www.adventuretoys.co.uk/bigjigs-tin-cupcake-tea-set/',
  'https://www.adventuretoys.co.uk/search/?q=plan+toys+kitchen',
  'https://www.adventuretoys.co.uk/search/?q=plan+toys+food',
  'https://www.adventuretoys.co.uk/search/?q=plan+toys+tea',
]) await probe(u);
