const urls = [
  'https://www.ikea.com/gb/en/p/duktig-9-piece-soft-toy-food-set-60364995/',
  'https://www.ikea.com/gb/en/p/uppstaa-shape-sorter-80319422/',
  'https://www.ikea.com/gb/en/p/mula-shape-sorter-beech-multicolour-30294889/',
  'https://www.ikea.com/gb/en/p/mula-building-beakers-multicolour-30294888/',
  'https://www.ikea.com/gb/en/p/foersiktig-childrens-stool-white-turquoise-10591318/',
  'https://www.ikea.com/gb/en/p/trogen-childrens-step-stool-yellow-80371520/',
  'https://www.ikea.com/gb/en/p/lockig-childrens-potty-white-turquoise-40591581/',
  'https://www.ikea.com/gb/en/p/sparka-soft-toy-football-green-70302645/',
  'https://www.ikea.com/gb/en/p/duktig-play-kitchen-birch-60319972/',
  'https://www.gompels.co.uk/soft-rugby-ball.html',
  'https://www.networldsports.co.uk/forza-foam-pe-balls.html',
  'https://www.decathlon.co.uk/p/mini-football-sunny-300-size-1-pastel-pink/146095/c174c344c227m8753526',
  'https://www.galttoys.com/products/chunky-farm-puzzle',
  'https://www.orange-tree-toys.com/products/farm-shape-sorter',
  'https://www.woodentoyshop.co.uk/products/bigjigs-toys-wooden-chunky-lift-out-puzzle-farm-animals',
  'https://www.woodentoyshop.co.uk/products/melissa-doug-shape-sorting-cube',
  'https://tonykealys.co.uk/products/babybjorn-safe-step-grey-1',
  'https://www.nosycrow.com/product/in-my-heart/',
  'https://www.childs-play.com/book/when-i-feel-angry/',
  'https://www.penguin.co.uk/books/317914/the-colour-monster-by-llenas-anna/9781787412736',
  'https://www.hachettechildrens.co.uk/titles/rachel-bright/dino-feelings-happy/9781444967111/',
  'https://www.penguin.co.uk/books/108934/dear-zoo-by-campbell-rod/9780230747890',
  'https://www.penguin.co.uk/books/312672/ten-minutes-to-bed-little-dinosaur-by-fielding-rhiannon/9780241532676',
  'https://uk.bookshop.org/p/books/press-here-herve-tullet/6458474',
  'https://www.amazon.co.uk/dp/B087F8T3S1',
  'https://www.amazon.co.uk/Pourty-Easy-Pour-Potty-White/dp/B003V1W2R0',
  'https://www.amazon.co.uk/OXO-Tot-Step-Stool-White/dp/B0759QF6T2',
];

for (const url of urls) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmberResearch/1.0)', 'Accept-Language': 'en-GB' },
    redirect: 'follow',
  });
  const html = await r.text();
  const title = ((html.match(/<title>([^<]+)/) || [])[1] || '').replace(/\s+/g, ' ').slice(0, 90);
  const ages = [...html.matchAll(/Recommended for ages from [^."<]+/gi)].map((m) => m[0]);
  const ageAlt = [...html.matchAll(/(?:Ages?|Age range|Suitable from|from)\s*[: ]?\s*(\d+\+?|\d+\s*[-–]\s*\d+)\s*(?:years?|months?)?/gi)]
    .map((m) => m[0])
    .slice(0, 3);
  const under = [
    ...html.matchAll(/(?:Not suitable for children under|hazardous to children under) [^."<]+/gi),
  ].map((m) => m[0]);
  const rating = (html.match(/"ratingValue":([\d.]+)/) || [])[1];
  const count = (html.match(/"reviewCount":(\d+)/) || [])[1];
  const soft404 =
    /Discover Our Full Range|Page not found|404|Sorry, we couldn't find/i.test(title) ||
    /currently unavailable|notify me when/i.test(html.slice(0, 5000));
  console.log(
    JSON.stringify({
      status: r.status,
      soft404,
      ages: ages[0] || ageAlt[0] || null,
      under: under[0] || null,
      rating,
      count,
      title,
      url: url.replace(/^https?:\/\//, '').slice(0, 65),
    }),
  );
}
