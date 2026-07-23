/**
 * Founder feedback pass (2026-07-23): rewrite 34–36m Top Pick public copy.
 * - Ban AI tells; kinder money tags; Best for must land
 * - Description = what it is; Why Pip = Stage 1 need + earns Best for (no echo)
 * - Decode ambiguous SKUs; diversify balance Top 5 (one Step-A line only)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const greenDir = path.join(root, 'agent-tools', 'exports', 'stage3', '34-36m', 'research', 'green');

function wordCount(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function assertDesc(cat, rank, text) {
  const n = wordCount(text);
  if (n < 20 || n > 40) throw new Error(`${cat}#${rank} desc ${n} words: ${text}`);
  if (/[—–]/.test(text)) throw new Error(`${cat}#${rank} em dash in desc`);
  return text;
}

function assertWhy(cat, rank, text) {
  if (!String(text || '').trim()) throw new Error(`${cat}#${rank} empty why`);
  if (/[—–]/.test(text)) throw new Error(`${cat}#${rank} em dash in why`);
  for (const ban of [
    'low-stakes',
    'low stakes',
    'quick wins',
    'quick win',
    'tight budget',
    'tight budgets',
    'worth buying',
    'calm',
  ]) {
    if (text.toLowerCase().includes(ban)) throw new Error(`${cat}#${rank} banned "${ban}" in why`);
  }
  return text;
}

/** @type {Record<string, Record<number, { tag?: string, name?: string, desc: string, why: string }>>} */
const PATCH = {
  cat_balance_stepping_stones: {
    1: {
      tag: 'Best for step-pause-turn paths',
      name: 'Gonge River Stones (set of 6)',
      desc: 'Six triangular plastic stepping stones with rubber rims you arrange on the floor into a route, so your child can step, pause and turn without climbing high furniture.',
      why: 'At nearly three, movement gets planned: step, pause, turn, not random crashing. These stones let you invent little path rules on the living-room floor, which is why they earn the step-pause-turn tag.',
    },
    2: {
      tag: 'Best for smaller budgets',
      name: 'Tippi Sensory Stepping Stones',
      desc: 'A pack of five low plastic stepping stones with textured tops and rubber bases, made for short indoor paths on carpet or laminate when you want to try balance play without a big spend.',
      why: 'A kinder way to test whether path play sticks before you buy premium stones. The smaller-budget tag is fair because five pieces still make a hallway route with pause points.',
    },
    3: {
      tag: 'Best for small spaces',
      name: 'Edx Nesting Balance Stumps (set of 6)',
      desc: 'Six colourful plastic platforms in three sizes that you step on like low tree stumps, then nest into one stack with a carry bag so balance kit does not take over a small flat.',
      why: 'Hallways and living rooms need kit that packs away. Nesting sizes keep a proper step-up path without clutter, which is how this earns the small-spaces tag for nearly-three balance practice.',
    },
    4: {
      tag: 'Best for height practice',
      name: 'Gonge Hilltops (set of 3)',
      desc: 'Three plastic hill shapes at different heights with rubber feet, used beside flat stones so your child practises step-up, pause and step-down on a short indoor path.',
      why: 'Once flat paths feel easy, a little height makes the next step interesting. These three levels earn the height-practice tag without turning play into daredevil jumping.',
    },
    5: {
      tag: 'Best for gap practice',
      name: 'Edx Rope-Gap Stepping Stones',
      desc: 'Six plastic stepping stones linked by adjustable rope, so you set the gap between each step and your child practises reaching the next stone on a controlled indoor path.',
      why: 'Distance judgement is a real nearly-three shift: can they stretch to the next stone without rushing? Rope gaps make that practice clear, which is why this earns the gap-practice tag.',
    },
  },
  cat_jigsaw_puzzles: {
    1: {
      tag: 'Best for first 12-piece plan',
      desc: 'Two farm-animal jigsaws with chunky interlocking cardboard pieces and clear finished pictures, a step up from peg puzzles when your child is ready for a proper tray.',
      why: 'Nearly-three puzzle play is about turning, comparing and holding a small plan. Two readable 12-piece farm scenes earn the first 12-piece tag without jumping straight to adult-style trays.',
    },
    2: {
      tag: 'Best for jungle theme fans',
      desc: 'Two jungle-animal jigsaws with interlocking pieces and bright monkey and giraffe scenes, the same friendly 12-piece format when farm puzzles already fill the nursery shelf.',
      why: 'Same planning step as the farm set, new pictures. Pick this when farm animals are already everywhere and you want the jungle theme to keep interlocking practice interesting.',
    },
    3: {
      tag: 'Best for warm-up sessions',
      desc: 'A Ravensburger box of four thick farm mini-jigsaws that rise from two to five pieces, so you can start small and move up as confidence grows.',
      why: 'When a full 12-piece tray still feels like a stretch, these rising counts give gentle warm-up sessions. Thick pieces survive lots of turning while they build the habit of finishing a picture.',
    },
    4: {
      tag: 'Best for wooden durability',
      desc: 'Three wooden safari jigsaws in trays, six interlocking pieces each, sturdy enough for everyday floor play when you want wood rather than cardboard.',
      why: 'Wood earns its place when cardboard is already chewed or stepped on. Six-piece trays still need a small plan, which fits nearly-three puzzle play with better durability.',
    },
    5: {
      tag: 'Best for rescue vehicles',
      name: 'Rescue Squad Jigsaw Puzzle',
      desc: 'Six small emergency-vehicle jigsaws in one Orchard Toys box, mostly two and three pieces, plus character pieces for matching drivers to ambulance, fire engine and more.',
      why: 'Vehicle fans get a confidence-building set before twelve-piece trays. Short rescue scenes earn the rescue-vehicles tag and keep turn-compare-try-again play going without a table full of bits.',
    },
  },
  cat_visual_routine_cards: {
    1: {
      desc: 'A wipe-clean set of rearrangeable routine picture cards for home, so morning and bedtime jobs sit in order on a strip and move as each step is done.',
      why: 'Nearly-threes manage real jobs better when they can see the day. Whole-day pictures earn that tag by turning morning and bedtime into a shared plan you build together.',
    },
    2: {
      desc: 'Magnetic planner strips with everyday job pictures for the fridge or a metal board, so your child can see the order of the day and tick along as each job finishes.',
      why: 'Magnets make the plan easy to change without sticky mess. That is how this earns the magnetic-planners tag for families who live on the fridge door.',
    },
    3: {
      desc: 'A small board that shows only two pictures at a time, Now and Next, for simple hand-offs when you need a clear change from one job to another.',
      why: 'Big timetables can overwhelm. Now and Next keeps the Stage 1 need tight: one clear hand-off, which is exactly what the now-and-next tag promises.',
    },
    4: {
      desc: 'An A5 picture book with removable early-years routine cards inside, including Now and Next style inserts, designed to travel between home, childminder and grandparents.',
      why: 'Wall charts stay in one room. This book earns the portable-routines tag because the same symbols can go in the changing bag when the day changes place.',
    },
    5: {
      desc: 'A short picture strip for the doorway jobs before leaving, such as shoes, coat and bag, so your child can see each step and move a marker as it is done.',
      why: 'Leaving the house is its own nearly-three skill. A doorway strip earns that tag by making the exit routine visible without needing a whole-day board.',
    },
  },
  cat_picture_story_books: {
    1: {
      desc: 'A picture book packed with choices on every page, inviting your child to pick, point and explain as you read together at bedtime or on the sofa.',
      why: 'Talk-back is the Stage 1 need here: choosing and explaining. Open choice pages earn that tag because every spread gives them a job, not just listening.',
    },
    2: {
      desc: 'A sturdy board book where the cheeky pigeon keeps asking to drive the bus, and your child gets to say no and explain why on every spread.',
      why: 'Practising a firm, funny no is useful at nearly three. The saying-no tag fits because the pigeon argues back and your child holds the line.',
    },
    3: {
      desc: 'A board book where lovable George asks what he should do next, and whether he will get it right this time, turning each page into a gentle prediction game.',
      why: 'Guessing what comes next builds the talk-stories muscle. George keeps asking, which is how this earns the guessing-what-next tag without a heavy lesson.',
    },
    4: {
      desc: 'A quieter board book about a careful plan that does not quite work out, inviting your child to notice what went wrong and what might work better.',
      why: 'Plans and predictions matter once stories get longer. This quieter book earns the predicting-plans tag by letting them spot the wobble and talk it through.',
    },
    5: {
      desc: 'A light, repeatable rhyme about looking for a shark in the park, short enough for tired evenings and playful enough to answer again and again.',
      why: 'Tired evenings need a short call-and-response. The is-it-a-shark tag sticks because they answer the same playful question in a new place each time.',
    },
  },
  cat_feelings_faces_books: {
    1: {
      desc: 'A warm Pip and Posy picture book where Posy finds Pip playing with someone new, then finds her feet again in a story about friendship and joining in.',
      why: 'Jealous friendship wobbles are common at nearly three. Posy’s recovery earns the jealous-moments tag while keeping the tone light enough for bedtime.',
    },
    2: {
      desc: 'A short sunny picture book where Little Whale learns to share snacks, toys and attention with a friend, told in warm words that suit bedtime and playdates.',
      why: 'Sharing is the Stage 1 need, not a lecture. Little Whale’s snack-and-toy moments earn the sharing-rows tag with a sunny bedtime pace.',
    },
    3: {
      desc: 'A short funny picture book about friends learning that sharing works better than shouting mine, with a pivot into shared play that feels light rather than heavy.',
      why: 'Mine fights need humour more than a sermon. The pivot into shared play is why this earns the mine-fights tag for repeat reads after sticky playdates.',
    },
    4: {
      desc: 'A Food Group picture book about staying cross, saying sorry and moving on, written with enough humour for repeat reads after sticky friend play.',
      why: 'Holding a grudge is a new nearly-three skill. Saying sorry and moving on earns the grudge-loops tag without making the evening feel heavy.',
    },
    5: {
      desc: 'A lively rhyming chase about two squirrels who both want the same nut, then learn to work as a team in a story about sharing and joining in.',
      why: 'Competitive rows need a team ending. The squirrels’ chase earns the competitive-rows tag while still landing on sharing and joining in.',
    },
  },
  cat_small_world_figures: {
    1: {
      desc: 'A chunky red London bus with seats for little people, made for loading passengers, driving somewhere, tipping them out and starting the journey all over again.',
      why: 'Get-on, go, return is the story shape nearly-threes love. The bus earns that tag because the seats make the journey loop obvious every time.',
    },
    2: {
      desc: 'A PLAYMOBIL Junior airport shuttle with figures sized for little hands, ready for holiday and travel stories about getting on, going and coming back.',
      why: 'Travel stories widen the same get-on-go-return need beyond the London bus. Airport boarding is how this earns the airport board-and-go tag.',
    },
    3: {
      desc: 'A PLAYMOBIL Junior helper set with doctor, fire and police figures, for pretend stories where someone needs looking after and kindness is part of the play.',
      why: 'Help-and-rescue roles let them practise care in play. That is the Stage 1 need, and why the helper figures earn the help-and-rescue tag.',
    },
    4: {
      desc: 'A PLAYMOBIL Junior dump truck with one clear figure, made for load, tip, stack and go-back play that turns into little work trips with a beginning and an end.',
      why: 'Load-tip-return gives a clear work story. The dump truck earns that tag when they are ready for trips with a beginning and an end.',
    },
    5: {
      desc: 'Chunky LEGO DUPLO construction vehicles to build, drive and rebuild, with sturdy pieces that leave plenty of room for your child to invent their own job stories.',
      why: 'Rebuild vehicle jobs keep small-world play fresh after bus and helper sets. DUPLO earns that tag because they can invent the job, not only follow one script.',
    },
  },
  cat_threading_beads: {
    1: {
      desc: 'Oversized letter sweets on a chunky cord, sized for little hands that enjoy a proper threading job at the table rather than tiny jewellery beads.',
      why: 'Letters make the lace feel like a finished word job. That keeps concentration growing, which is how this earns the letters-and-lacing tag. Keep them company, as the cords love to tangle.',
    },
    2: {
      desc: 'Large wooden fruit pieces to feed along a caterpillar lace, so threading has a finished line to show you as they practise guiding each piece.',
      why: 'A storybook lace gives threading a clear finish line. That visible progress is why fruit-on-caterpillar play earns the storybook-threading tag.',
    },
    3: {
      desc: 'A set of large colourful wooden beads and shapes to thread onto a soft fabric lace, sized for little hands that are ready for a proper threading job.',
      why: 'Chunky first beads are the classic next step after posting toys. Soft lace and big shapes earn that tag while concentration is still growing. Sit with them while they lace.',
    },
    4: {
      desc: 'Chunky beads plus picture cards that invite children to copy a pattern on the lace, turning simple threading into a matching game as their focus grows.',
      why: 'Copying a pattern is the Stage 1 stretch beyond random threading. The cards earn the copying-patterns tag when they already like beads on a lace.',
    },
    5: {
      desc: 'Large sensory beads on short safety-release laces, for families who want an extra-kind cord design while still practising a chunky threading job together.',
      why: 'Some families want a kinder cord end. Safety-release laces earn the safer-cord-ends tag without giving up the chunky threading practice. Pack the laces away after play.',
    },
  },
};

function applyBalanceTrailsSwap(doc) {
  const trails = doc.top_picks.find((p) => p.rank === 5);
  if (!trails) return;
  // Demote old Trails into longlist backup slot if present; promote rope-gap stones.
  const ll5 = (doc.longlist || []).find((r) => Number(r.longlist_rank) === 5);
  const ll9 = (doc.longlist || []).find((r) => Number(r.longlist_rank) === 9);
  trails.product_name = 'Edx Rope-Gap Stepping Stones';
  trails.brand = 'Edx Education';
  trails.retailer = 'Shopedx';
  trails.product_url = 'https://www.shopedx.co.uk/products/step-a-stones';
  trails.alternate_urls = [
    'https://www.thedyslexiashop.co.uk/products/step-a-stones-rope-connected-balance-stepping-stones',
  ];
  trails.price_amount = 75.6;
  trails.price_text = '£75.60';
  trails.age_mark_on_listing = '18 months+ (Shopedx product page)';
  trails.age_signals = [
    {
      signal_type: 'min_age',
      raw_text: '18 months+',
      min_months: 18,
      max_months: null,
      forbidden_under_months: null,
    },
  ];
  trails.key_specs = {
    piece_count: '6 stones with connecting rope',
    dimensions: 'Modular stepping stones with adjustable gaps',
    materials: 'Polypropylene with non-slip tops',
    included_items: '6 stones, connecting rope',
    other: 'Adult sets gap distance each session',
  };
  trails.best_for_tag = 'Best for gap practice';
  trails.evidence_tier = 'specialist';
  trails.evidence_exemption = 'specialist';
  trails.rating_value = null;
  trails.rating_count = null;
  trails.rank_rationale =
    '#5: rope gaps add distance judgement without a second Step-A beam SKU that truncates into the same title as nesting stumps.';
  trails.why_it_fits =
    'Adjustable gaps train planned step-and-reach on a path — distinct from nesting stumps and flat stones.';
  trails.substitute_if_unavailable = 'Painter tape path on the floor (hold off buying)';
  trails.founder_qa_flag = 'check_price';
  if (ll5) {
    ll5.product_name = 'Edx Education Step-A-Trails (set of 6)';
    ll5.status = 'backup';
    ll5.top_pick_rank = null;
    ll5.included_in_top_5 = false;
    ll5.display_status = 'backup';
    ll5.public_rank = null;
    ll5.best_for_tag = 'Best for straight paths';
    ll5.missed_top5_reason =
      'Second Edx Step-A line beside nesting stumps truncated into a lookalike Top 5 card; demoted after founder review.';
    ll5.product_url = 'https://www.shopedx.co.uk/products/step-a-trails';
  }
  if (ll9) {
    ll9.status = 'pick';
    ll9.top_pick_rank = 5;
    ll9.included_in_top_5 = true;
    ll9.display_status = 'visible';
    ll9.public_rank = 5;
    ll9.product_name = 'Edx Rope-Gap Stepping Stones';
    ll9.best_for_tag = 'Best for gap practice';
    ll9.missed_top5_reason = '';
    ll9.rank_rationale = '#5: rope-gap distance practice without a second Step-A beam title.';
  }
}

let n = 0;
for (const f of fs.readdirSync(greenDir)) {
  if (!f.startsWith('ember_picks_') || !f.endsWith('.json')) continue;
  if (f.includes('ff_check') || f.includes('availability') || f.includes('url_smoke')) continue;
  const fp = path.join(greenDir, f);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const cat = doc.category_entity_id;
  const map = PATCH[cat];
  if (!map) throw new Error(`No patch map for ${cat}`);

  if (cat === 'cat_balance_stepping_stones') applyBalanceTrailsSwap(doc);

  for (const pick of doc.top_picks) {
    const p = map[pick.rank];
    if (!p) throw new Error(`No patch for ${cat}#${pick.rank}`);
    if (p.tag) pick.best_for_tag = p.tag;
    if (p.name) pick.product_name = p.name;
    pick.product_description_under_30_words = assertDesc(cat, pick.rank, p.desc);
    pick.ember_verdict = assertWhy(cat, pick.rank, p.why);
  }

  // Mirror tags/names onto longlist mirrors for ranks 1-5 where present
  for (const row of doc.longlist || []) {
    const tr = Number(row.top_pick_rank);
    if (tr >= 1 && tr <= 5 && map[tr]) {
      if (map[tr].tag) row.best_for_tag = map[tr].tag;
      if (map[tr].name) row.product_name = map[tr].name;
    }
  }

  doc.research_date = '2026-07-23';
  fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n');
  console.log('ok', cat);
  n += 1;
}
console.log('updated', n);
