import { smokeUrl } from '../../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../../scripts/stage3-availability-check.mjs';

const urls = [
  'https://www.jappynappy.com/little-dutch-7065-mini-kitchen',
  'https://www.jappynappy.com/',
  'https://www.smythstoys.com/uk/en-gb/toys/preschool/educational-toys/melissa-and-doug-shape-sorting-cube/p/159210',
  'https://www.gompels.co.uk/soft-rugby-ball.html',
  'https://www.gompels.co.uk/soft-football.html',
  'https://www.gompels.co.uk/soft-play-balls-assorted-colours.html',
  'https://littletoyhouse.co.uk/product/giant-45cm-mega-ball/',
  'https://www.networldsports.co.uk/forza-foam-pe-balls.html',
  'https://www.planethappytoys.co.uk/product/13319/twisk-soft-foam-football-blue-20-cm-kids-play-ball.html',
  'https://www.johnlewis.com/my-carry-potty-travel-potty-dino/p5521669',
  'https://www.johnlewis.com/babybjorn-step-stool/p3392730',
  'https://www.johnlewis.com/babybjorn-potty-chair/p198088',
];

for (const u of urls) {
  const s = await smokeUrl(u);
  const a = await checkUrlAvailability(u);
  console.log(
    JSON.stringify({
      ok: s.url_ok,
      buyable: a.buyable,
      status: s.http_status,
      signals: a.signals,
      err: s.error,
      u: u.replace('https://', '').slice(0, 75),
    }),
  );
}
