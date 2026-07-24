async function probe(u) {
  await new Promise((r) => setTimeout(r, 800));
  const r = await fetch(u, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'accept-language': 'en-GB',
    },
    signal: AbortSignal.timeout(20000),
  });
  const t = await r.text();
  const title = (t.match(/<title[^>]*>([^<]+)/i) || [])[1]?.replace(/\s+/g, ' ').trim().slice(0, 90);
  const buy = /add to (bag|basket|cart)|Buy Now/i.test(t);
  const age = [...t.matchAll(/(Age\s*\d+|Ages?\s*\d+|months?|years?\s*\+|from\s+\d+|Suitable[^<.]{0,40})/gi)]
    .map((m) => m[0].replace(/\s+/g, ' ').trim())
    .filter((x) => /\d/.test(x))
    .slice(0, 8);
  const price = (t.match(/£\s?\d+(\.\d{2})?/) || [])[0];
  console.log(JSON.stringify({ s: r.status, buy, price, age: [...new Set(age)].slice(0, 6), title, u: u.slice(30) }));
}

for (const u of [
  'https://www.adventuretoys.co.uk/gowi-toys-play-food-vegetables/',
  'https://www.adventuretoys.co.uk/plan-toys-cupcake-set-wooden/',
  'https://www.adventuretoys.co.uk/bigjigs-spotted-metal-kitchen-ware-set/',
  'https://www.adventuretoys.co.uk/big-jigs-toaster-primary/',
  'https://www.adventuretoys.co.uk/bigjigs-tin-tea-set-with-carry-case/',
  'https://www.adventuretoys.co.uk/tidlo-cutting-fruits-set/',
  'https://www.adventuretoys.co.uk/hape-tea-set-for-two/',
  'https://www.adventuretoys.co.uk/hape-mix-and-bake-wooden-food-processor-mixer/',
  'https://www.adventuretoys.co.uk/little-tikes-fast-food-delivery-set/',
]) {
  try {
    await probe(u);
  } catch (e) {
    console.log(JSON.stringify({ err: e.message, u }));
  }
}
