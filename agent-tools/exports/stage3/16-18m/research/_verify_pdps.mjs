const urls = [
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/bright-starts-oball-classic-ball/p/184109',
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/edushape-sensory-ball/p/189855',
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/infantino-sensory-balls/p/191234',
  'https://www.smythstoys.com/uk/en-gb/toys/baby-and-toddler/baby-toys/hape-double-rainbow-stacker/p/178234',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/vehicles/wooden-car-ramp/p/201111',
  'https://www.smythstoys.com/uk/en-gb/toys/dolls/baby-dolls/baby-annabell-my-first-annabell/p/188001',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-8-pack/p/195185',
  'https://www.smythstoys.com/uk/en-gb/toys/arts-and-crafts/crayons-and-pastels/crayola-my-first-jumbo-crayons-24-pack/p/195186',
  'https://toytastic.co.uk/product/quercetti-flipcar-racetrack/',
  'https://www.boots.com/doidy-cup-10150006',
  'https://www.boots.com/tommee-tippee-explora-first-cup-2-pack',
  'https://www.boots.com/munchkin-miracle-360-trainer-cup-207ml-10220685',
  'https://www.boots.com/philips-avent-natural-response-trainer-cup',
  'https://www.boots.com/nuk-first-choice-learner-cup',
  'https://www.priddybooks.com/books/first-100-words/',
  'https://www.priddybooks.com/books/big-board-first-100-words/',
  'https://www.penguin.co.uk/books/451935/my-first-words-lets-get-talking-by-dk/9780241533376',
  'https://uk.bookshop.org/books/my-first-words-let-s-get-talking/9780241533376',
  'https://uk.bookshop.org/books/first-100-words/9781843322924',
];

for (const url of urls) {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Accept-Language': 'en-GB',
      },
      redirect: 'follow',
    });
    const html = await r.text();
    const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [,''])[1].replace(/\s+/g, ' ').trim().slice(0, 120);
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
    const price = (html.match(/£\s?\d+(?:\.\d{2})?/) || [''])[0];
    const age = (html.match(/(?:age[sd]?|suitable from|months?\+|years?\+)\s*[:\s]*[^<.,]{0,40}/i) || [''])[0].slice(0, 60);
    console.log(JSON.stringify({ status: r.status, len: html.length, title, h1, price, age, url }));
  } catch (e) {
    console.log(JSON.stringify({ error: e.message, url }));
  }
}
