const urls = [
  ['veg', 'https://www.ikea.com/gb/en/p/duktig-14-piece-vegetables-set-10185748/'],
  ['pizza', 'https://www.ikea.com/gb/en/p/duktig-24-piece-pizza-set-pizza-multicolour-10423594/'],
  ['rolls', 'https://www.ikea.com/gb/en/p/duktig-6-piece-roll-set-cinnamon-bun-80423595/'],
  ['utensils', 'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-kitchen-utensil-set-multicolour-80130168/'],
  ['cookware', 'https://www.ikea.com/gb/en/p/duktig-5-piece-toy-cookware-set-stainless-steel-colour-00185747/'],
  ['uppsta sorter', 'https://www.ikea.com/gb/en/p/uppsta-shape-sorter-multicolour-90592088/'],
  ['uppsta beakers', 'https://www.ikea.com/gb/en/p/uppsta-building-beakers-multicolour-70513884/'],
  ['uppsta rings', 'https://www.ikea.com/gb/en/p/uppsta-stacking-rings-multicolour-00513892/'],
  ['sparka mini', 'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-mini-blue-red-20506758/'],
  ['sparka green', 'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-green-70302645/'],
  ['foersiktig', 'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/'],
  ['lockig', 'https://www.ikea.com/gb/en/p/lockig-childrens-potty-white-turquoise-40591581/'],
  ['md cube', 'https://www.woodentoyshop.co.uk/products/melissa-doug-shape-sorting-cube'],
  ['bigjigs farm', 'https://www.woodentoyshop.co.uk/products/bigjigs-toys-wooden-chunky-lift-out-puzzle-farm-animals'],
  ['gompels', 'https://www.gompels.co.uk/soft-rugby-ball.html'],
  ['forza', 'https://www.networldsports.co.uk/forza-foam-pe-balls.html'],
  ['bb step', 'https://www.babybjorn.co.uk/products/bathroom/step-stool/'],
  ['bb potty', 'https://www.babybjorn.co.uk/products/bathroom/potty-chair/'],
  ['bb seat', 'https://www.babybjorn.co.uk/products/bathroom/toilet-training-seat/'],
  ['bb smart', 'https://www.babybjorn.co.uk/products/bathroom/smart-potty/'],
  ['bumbo', 'https://www.boots.com/bumbo-step-n-potty'],
  ['dear zoo', 'https://www.penguin.co.uk/books/108934/dear-zoo-by-campbell-rod/9780230747890'],
  ['colour monster', 'https://www.penguin.co.uk/books/317914/the-colour-monster-by-llenas-anna/9781787412736'],
  ['oi frog', 'https://www.hachettechildrens.co.uk/titles/kes-gray/oi-frog/9781444910865/'],
  ['dino happy', 'https://www.hachettechildrens.co.uk/titles/rachel-bright/dino-feelings-happy/9781444967111/'],
  ['ten min dino', 'https://www.penguin.co.uk/books/312672/ten-minutes-to-bed-little-dinosaur-by-fielding-rhiannon/9780241532676'],
  ['goodnight moon', 'https://www.penguin.co.uk/books/108935/goodnight-moon-by-brown-margaret-wise/9781509831975'],
  ['peepo', 'https://www.penguin.co.uk/books/111124/peepo-by-ahlberg-janet/9780141337425'],
  ['each peach', 'https://www.penguin.co.uk/books/57304/each-peach-pear-plum-by-ahlberg-janet/9780140506396'],
  ['press here', 'https://uk.bookshop.org/p/books/press-here-herve-tullet/6458474'],
  ['in my heart', 'https://www.nosycrow.com/product/in-my-heart/'],
  ['when angry', 'https://www.childs-play.com/book/when-i-feel-angry/'],
  ['ekobo', 'https://ekobo.co/products/bamboo-kids-step-stool-lemon'],
  ['pourty amz', 'https://www.amazon.co.uk/Pourty-Easy-Pour-Potty-White/dp/B003V1W2R0'],
  ['oxo amz', 'https://www.amazon.co.uk/OXO-Tot-Step-Stool-White/dp/B0759QF6T2'],
  ['inpodak', 'https://www.amazon.co.uk/dp/B087F8T3S1'],
];

function firstAge(html) {
  const m =
    html.match(/Recommended for ages from [^."<]+/i) ||
    html.match(/Not suitable for children under [^."<]+/i) ||
    html.match(/Ages?\s*[: ]\s*\d+\+/i) ||
    html.match(/\d+\s*months?\s*[-–+]/i) ||
    html.match(/Interest age[^<]{0,40}/i) ||
    html.match(/Reading age[^<]{0,40}/i);
  return m ? m[0].replace(/\s+/g, ' ').slice(0, 80) : null;
}

for (const [label, url] of urls) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmberResearch/1.0)', Accept: 'text/html' },
      redirect: 'follow',
    });
    const html = await r.text();
    const title = ((html.match(/<title>([^<]+)/) || [])[1] || '').replace(/\s+/g, ' ').slice(0, 70);
    const dead = /Discover Our Full Range|404 Not Found|Page not found|Just a moment/i.test(title);
    const rating = (html.match(/"ratingValue"\s*:\s*"?([\d.]+)"?/) || [])[1];
    const count = (html.match(/"reviewCount"\s*:\s*"?(\d+)"?/) || [])[1];
    console.log(
      [dead ? 'DEAD' : 'LIVE', r.status, label, firstAge(html) || '-', rating || '-', count || '-', title].join(
        ' | ',
      ),
    );
  } catch (e) {
    console.log(['ERR', label, e.message.slice(0, 50)].join(' | '));
  }
}
