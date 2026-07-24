const UA = 'Mozilla/5.0 (compatible; EmberStage3Research/1.0)';

async function titles(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
      const html = await res.text();
      const title = ((html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '').replace(/\s+/g, ' ').trim();
      const h1 = ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      console.log(res.status, '|' , title.slice(0, 90), '|', h1.slice(0, 60), '|', url);
    } catch (e) {
      console.log('ERR', e.message, url);
    }
  }
}

// Penguin/bookshop discovery via search HTML
const searches = [
  'https://www.penguin.co.uk/search/baby-touch-words',
  'https://www.penguin.co.uk/search/first-100-words',
  'https://www.penguin.co.uk/search/spot-first-words',
  'https://www.waterstones.com/books/search/term/baby+touch+words',
  'https://www.waterstones.com/books/search/term/first+100+words+priddy',
  'https://www.waterstones.com/books/search/term/hungry+caterpillar+first+100+words',
  'https://www.waterstones.com/books/search/term/spot+first+words',
  'https://www.waterstones.com/books/search/term/peppa+first+100+words',
  'https://www.waterstones.com/books/search/term/roald+dahl+first+100+words',
  'https://www.waterstones.com/books/search/term/dk+my+first+words',
];

for (const url of searches) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
    const html = await res.text();
    const links = [...html.matchAll(/href="(https:\/\/www\.(?:penguin|waterstones)\.co\.uk\/[^"]+)"/g)]
      .map((m) => m[1])
      .filter((h) => /book|9780/i.test(h))
      .filter((h, i, a) => a.indexOf(h) === i)
      .slice(0, 12);
    console.log('\n===', res.status, url);
    for (const l of links) console.log(l);
  } catch (e) {
    console.log('ERR', url, e.message);
  }
}

console.log('\n--- direct candidates ---');
await titles([
  'https://www.adventuretoys.co.uk/corolle-bath-alyzee-baby-doll/',
  'https://www.adventuretoys.co.uk/corolle-rag-doll-blandine-sweet-dreams/',
  'https://www.adventuretoys.co.uk/corolle-mini-cotton-flower-doll-age-0-years/',
  'https://www.adventuretoys.co.uk/bigjigs-doll-cradle-blue-wooden/',
  'https://www.adventuretoys.co.uk/goki-dolls-carry-cradle-mosses-basket-with-bedding/',
  'https://www.adventuretoys.co.uk/tidlo-dolls-rocking-cradle/',
  'https://toytastic.co.uk/product/ses-creative-my-first-colouring-with-water/',
  'https://priddybooks.com/gb/books/see-touch-feel-first-words/',
  'https://priddybooks.com/gb/books/bright-baby-words/',
  'https://priddybooks.com/gb/books/first-100-soft-to-touch/',
  'https://priddybooks.com/gb/books/first-100-trucks/',
  'https://priddybooks.com/gb/books/see-touch-feel-words/',
  'https://barefootbooks.com/uk/babys-first-words/',
]);
