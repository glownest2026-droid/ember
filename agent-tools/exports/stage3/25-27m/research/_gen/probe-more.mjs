import { smokeUrl } from '../../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../../scripts/stage3-availability-check.mjs';

const urls = [
  ['ld mini', 'https://www.kidsdream.co.uk/little-dutch-mini-kitchen-3936-p.asp'],
  ['ld market', 'https://www.kidsdream.co.uk/little-dutch-market-stall-3958-p.asp'],
  ['ld coffee', 'https://www.kidsdream.co.uk/little-dutch-coffee-corner-3947-p.asp'],
  ['ld cube', 'https://www.kidsdream.co.uk/little-dutch-activity-cube-3308-p.asp'],
  ['edvin sorter', 'https://www.kidsdream.co.uk/kids-concept-edvin-shape-sorter-1852-p.asp'],
  ['skip hop jl', 'https://www.johnlewis.com/skip-hop-zoo-ready-set-roll-activity-ball-set/p3985433'],
  ['carry potty jl', 'https://www.johnlewis.com/my-carry-potty-travel-potty-dino/p5521669'],
  ['smyths md', 'https://www.smythstoys.com/uk/en-gb/toys/preschool/educational-toys/melissa-and-doug-shape-sorting-cube/p/159210'],
  ['gompels', 'https://www.gompels.co.uk/soft-rugby-ball.html'],
  ['colour monster', 'https://www.penguin.co.uk/books/317914/the-colour-monster-by-llenas-anna/9781787412736'],
  ['dear zoo', 'https://www.penguin.co.uk/books/108934/dear-zoo-by-campbell-rod/9780230747890'],
  ['oi frog', 'https://www.hachettechildrens.co.uk/titles/kes-gray/oi-frog/9781444910865/'],
  ['happy nosy', 'https://nosycrow.com/book/happy/'],
  ['pip feelings', 'https://nosycrow.com/book/pip-and-posys-big-book-of-feelings/'],
  ['frog day out', 'https://www.panmacmillan.com/authors/julia-donaldson/frog-s-day-out/9781035006885'],
];

for (const [label, u] of urls) {
  const s = await smokeUrl(u);
  const a = await checkUrlAvailability(u);
  let age = '-';
  try {
    const r = await fetch(u, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
    });
    const html = await r.text();
    const m =
      html.match(/Recommended for ages from [^."<]+/i) ||
      html.match(/Best from [^<]{0,30}/i) ||
      html.match(/Age:\s*<\/[^>]*>\s*([^<]+)/i) ||
      html.match(/(\d+\s*mths?\+|\d+\s*months?\+|\d+\s*yrs?\+|Ages?\s*\d+[+\-–]\d+)/i) ||
      html.match(/Interest [Aa]ge[^<]{0,40}/) ||
      html.match(/(\d+\s*[-–]\s*\d+)/);
    age = m ? m[0].replace(/\s+/g, ' ').slice(0, 50) : '-';
    if (/NOT be processing orders/i.test(html)) age += ' [KD_HALTED]';
  } catch (e) {
    age = 'fetch_err';
  }
  console.log(
    [label, s.url_ok ? 'OK' : 'FAIL', a.unavailable ? 'OOS' : 'IN', String(a.reason || '-').slice(0, 30), age].join(
      ' | ',
    ),
  );
}
