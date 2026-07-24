const pages = [
  'https://www.adventuretoys.co.uk/indoor-toys/dolls/',
  'https://www.adventuretoys.co.uk/wooden-toys/dolls/',
  'https://toytastic.co.uk/product-category/arts-crafts/painting-drawing-kits/',
  'https://priddybooks.com/gb/age-range/0-2-gb/',
  'https://priddybooks.com/gb/books/see-touch-feel-first-words/',
  'https://priddybooks.com/gb/books/first-100-words/',
  'https://www.penguin.co.uk/books/111111/baby-touch-words-by-ladybird/9780241361634',
  'https://www.penguin.co.uk/books/284567/the-very-hungry-caterpillar-s-first-100-words-by-eric-carle/9780241547724',
  'https://www.penguin.co.uk/books/111222/spots-first-words-by-eric-hill/9780241411193',
  'https://www.penguin.co.uk/books/313410/peppa-s-first-100-words-by-peppa-pig/9780241481233',
  'https://barefootbooks.com/uk/babys-first-words/',
  'https://www.adventuretoys.co.uk/corolle-miss-floral-sweet-dreams-soft-doll/',
];

const UA = 'Mozilla/5.0 (compatible; EmberStage3Research/1.0)';

for (const url of pages) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'follow' });
    const html = await res.text();
    const title = (html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '';
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
    const productLinks = [...html.matchAll(/href="((?:https:\/\/www\.adventuretoys\.co\.uk)?\/[^"]+)"/g)]
      .map((m) => m[1])
      .filter((h) => /corolle|stella|doll|crayon|ses|colour|goki/i.test(h))
      .map((h) => (h.startsWith('http') ? h : 'https://www.adventuretoys.co.uk' + h))
      .filter((h, i, a) => a.indexOf(h) === i)
      .slice(0, 25);
    const ttLinks = [...html.matchAll(/href="(https:\/\/toytastic\.co\.uk\/product\/[^"]+\/)"/g)]
      .map((m) => m[1])
      .filter((h, i, a) => a.indexOf(h) === i)
      .slice(0, 25);
    const bookLinks = [...html.matchAll(/href="(https:\/\/priddybooks\.com\/gb\/books\/[^"]+\/)"/g)]
      .map((m) => m[1])
      .filter((h, i, a) => a.indexOf(h) === i)
      .slice(0, 30);
    console.log('\n===', res.status, url);
    console.log('TITLE:', title.slice(0, 120));
    console.log('H1:', h1.slice(0, 120));
    if (productLinks.length) console.log('AT:', productLinks.join('\n'));
    if (ttLinks.length) console.log('TT:', ttLinks.join('\n'));
    if (bookLinks.length) console.log('PR:', bookLinks.join('\n'));
  } catch (e) {
    console.log('ERR', url, e.message);
  }
}
