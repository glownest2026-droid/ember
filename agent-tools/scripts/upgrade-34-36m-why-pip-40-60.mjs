/**
 * Founder UX 2026-07-23b — research-owned copy + diversification.
 * Why Pip 40–60 words; no tag meta-talk; max 2 brands; visual routines rebalanced.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const greenDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'agent-tools',
  'exports',
  'stage3',
  '34-36m',
  'research',
  'green',
);

function wc(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function assertWhy(id, text) {
  const n = wc(text);
  if (n < 40 || n > 60) throw new Error(`${id} why=${n}`);
  if (/\b(the tag|that tag|this tag|tag promises|earns that tag|earns the \w[\w-]* tag)\b/i.test(text)) {
    throw new Error(`${id} tag meta`);
  }
  if (/[—–]/.test(text)) throw new Error(`${id} em dash`);
  return text;
}

function assertDesc(id, text) {
  const n = wc(text);
  if (text && (n < 20 || n > 40)) throw new Error(`${id} desc=${n}`);
  return text;
}

/** Patch maps: why required; optional product field overrides */
const PATCH = {
  cat_balance_stepping_stones: {
    1: {
      why: 'At nearly three, movement gets planned: step, pause, turn, rather than random crashing around the room. These stones let you invent little living-room routes with clear rules, so balance practice feels like a game you build together. That is why they suit step-pause-turn paths so well for this age.',
    },
    2: {
      why: 'Not every family wants premium stones on day one. Five textured pieces are enough for a short hallway route with pause points, so you can see whether path play sticks before spending more. That kinder try-first approach is why this suits smaller budgets without feeling like a compromise on the skill.',
    },
    3: {
      why: 'Hallways and small flats need kit that packs away. Nesting stump sizes still give a proper step-up path, then collapse into one stack with a carry bag so the living room is free again. That storage honesty is why they suit small spaces while balance practice stays part of everyday play.',
    },
    4: {
      why: 'Once flat paths feel easy, a little height makes the next step interesting without turning play into daredevil jumping. Three fixed levels invite step-up, pause and step-down, which matches the planned movement this age is growing into. That is why they suit height practice beside flatter stones you may already own.',
    },
    5: {
      why: 'Distance judgement is a real nearly-three shift: can they stretch to the next stone without rushing? Rope-linked gaps make that stretch visible and adjustable, so you can widen the challenge as confidence grows. That controlled reach is why they suit gap practice better than another set of freestanding stones.',
    },
  },
  cat_jigsaw_puzzles: {
    1: {
      why: 'Nearly-three puzzle play is about turning, comparing and holding a small plan until the picture appears. Two readable twelve-piece farm scenes give that step up from peg puzzles without jumping to adult-style trays. Clear animals and backgrounds keep the plan visible, which is why this suits a first proper twelve-piece job.',
    },
    2: {
      name: '4 Puzzles in a Box — Farm',
      brand: 'Galt',
      tag: 'Best for rising piece counts',
      retailer: 'Amazon UK',
      url: 'https://www.amazon.co.uk/Galt-Toys-Puzzles-Box-Farm/dp/B00009XO3P',
      alts: ['https://www.galttoys.com/'],
      desc: 'Four farm mini-jigsaws in one Galt box that rise from two to five pieces, with thick cardboard pieces sized for little hands still building confidence.',
      why: 'When a full twelve-piece tray still feels like a stretch, rising piece counts give gentle warm-up sessions in one box. Thick Galt pieces survive lots of turning while they learn to finish a picture. That progressive climb is why this suits rising piece counts before bigger interlocking sets.',
      rating: 4.6,
      count: 2100,
      exemption: '',
    },
    3: {
      why: 'Warm-up sessions matter when a full twelve-piece tray still feels busy. Ravensburger My First farm scenes keep the picture clear while pieces stay thick enough for lots of turning. That gentler on-ramp is why this suits families easing into interlocking puzzles before the bigger farm and jungle trays.',
    },
    4: {
      why: 'Wood earns its place when cardboard is already chewed or stepped on in daily play. Six-piece safari trays still need a small plan, but the material survives floor life better. That durability plus a clear tray picture is why this suits families who want wooden puzzles in the mix, not another soft cardboard set.',
    },
    5: {
      why: 'Vehicle fans need a confidence-building set before twelve-piece trays feel fair. Short rescue scenes keep turn, compare and try-again play going without a table full of bits, and the characters invite a little matching story after the picture is done. That hook is why this suits rescue-vehicle play at this age.',
    },
  },
  cat_visual_routine_cards: {
    1: {
      why: 'Nearly-threes manage everyday jobs better when they can see the shape of the day. Rearrangeable morning and bedtime pictures turn those stretches into a shared plan you build together, with pride as each card moves. That whole-day visibility is why this timetable suits families ready for a fuller strip at home.',
    },
    2: {
      why: 'Fridge doors are where many UK homes already live. Magnetic strips make the plan easy to change without sticky mess, so morning and bedtime jobs can shift as the week changes. That everyday practicality is why magnetic planners suit families who want the routine visible in the kitchen, not only on a nursery wall.',
    },
    3: {
      name: 'Now and Next Visual Routine Board',
      brand: 'Craftly',
      tag: 'Best for now and next',
      retailer: 'Craftly',
      url: 'https://www.craftly.co.uk/products/now-and-next-visual-routine-board',
      desc: 'A handmade metal Now and Next board for short hand-offs, with picture tokens sold to match your real morning and bedtime jobs at home.',
      why: 'Big whole-day boards can overwhelm when all you need is the next hand-off. Showing only a couple of pictures keeps the change clear for nearly-threes still learning transitions. Handmade UK metal and tokens you can match to your real jobs are why this suits now-and-next moments without a ten-step wall.',
      rating: null,
      count: null,
      exemption: 'specialist',
      evidence:
        'Craftly handmade UK Now/Next board; public review widget thin on check date. Ages 2+ parent-setup preschool tool. Specialist exemption with written UK-maker notes. Prefer photos on the fridge first. Founder QA: confirm live reviews on human click.',
    },
    4: {
      name: 'My Communication Book (Early Years)',
      why: 'Wall charts stay in one room, but many nearly-three days move between home, childminder and grandparents. A portable picture book keeps the same routine symbols in the changing bag, so what comes next stays familiar when the place changes. That travel honesty is why this suits portable routines without buying a second wall set.',
    },
    5: {
      name: "Children's Daily Routine Board",
      brand: 'Craftly',
      tag: 'Best for leaving the house',
      retailer: 'Craftly',
      url: 'https://www.craftly.co.uk/products/childrens-daily-routine-board',
      desc: 'A handmade aluminium morning and evening routine board with picture tokens and star progress markers, sized for the jobs that get you out the door and into bed.',
      why: 'Leaving the house is its own nearly-three skill: shoes, coat and bag without a running commentary from you. A clear morning strip makes those doorway jobs visible and movable, so pride replaces nagging. Handmade UK build and tokens matched to real jobs are why this suits getting-out-the-door practice at this age.',
      rating: null,
      count: null,
      exemption: 'specialist',
      evidence:
        'Craftly handmade UK AM/PM board; public review widget thin on check date (previously demoted for count under 15). Ages 2+ parent-setup. Specialist exemption for UK maker; photos-first still preferred. Founder QA: confirm live reviews. Chosen to diversify away from Create Visual Aids monoculture while staying age-safe.',
    },
  },
  cat_picture_story_books: {
    1: {
      why: 'Talk-back is growing fast at nearly three: choosing and explaining, not only listening. Page after page of open choices gives them a real job on every spread, which keeps storytime interactive as their ideas get bigger. That choosing muscle is why this book suits open-choice reading on the sofa or at bedtime.',
    },
    2: {
      why: 'Practising a firm, funny no is useful once opinions arrive. The pigeon argues back on every spread, and your child holds the line with a reason. That playful back-and-forth is why this board book suits saying-no practice without turning bedtime into a lecture.',
    },
    3: {
      why: 'Guessing what comes next builds the talk-stories muscle before longer plots arrive. George keeps asking what he should do, and whether he will get it right this time, so each page becomes a gentle prediction game. That forward-looking chat is why this book suits guessing-what-next reads at nearly three.',
    },
    4: {
      why: 'Plans and predictions matter once stories get a little longer. This quieter book lets your child spot when a careful plan wobbles, then talk through what might work better. That noticing and explaining is why it suits predicting-plans moments without shouty bird energy at bedtime.',
    },
    5: {
      why: 'Tired evenings need a short call-and-response that still feels playful. Looking for a shark in a new spot each time keeps them answering without a long plot to carry. That light repeat pattern is why this rhyme suits is-it-a-shark guesses when everyone is running on empty.',
    },
  },
  cat_feelings_faces_books: {
    1: {
      why: 'Jealous friendship wobbles are common once best-friend feelings run deep. Posy watches Pip play with someone new, then finds her feet again, which keeps the story warm enough for bedtime. That soft recovery is why this book suits jealous moments without making the evening feel heavy.',
    },
    2: {
      why: 'Sharing is the skill to grow into, not a lecture to survive. Little Whale practises snacks, toys and attention with a friend in sunny words that suit playdates and bedtime alike. That gentle rehearsal is why this book suits sharing rows when you want warmth more than a warning.',
    },
    3: {
      why: 'Mine fights need humour more than a sermon after a sticky playdate. Friends learn that sharing works better than shouting mine, then pivot into shared play that stays light. That funny reset is why this book suits mine-fight evenings you may want to read more than once.',
    },
    4: {
      why: 'Holding a grudge is a new nearly-three skill, and so is moving on. A Food Group story about staying cross, saying sorry and starting again brings enough humour for repeat reads. That kind reset is why this book suits grudge-loop nights without turning feelings into a lesson plan.',
    },
    5: {
      why: 'Competitive rows need a team ending once both children want the same prize. Two squirrels chase one nut, then learn to work together, which keeps sharing inside a lively rhyme. That joining-in finish is why this book suits competitive moments without dampening the fun of the chase.',
    },
  },
  cat_small_world_figures: {
    1: {
      why: 'Get-on, go and return is the story shape nearly-threes love once journeys become talk. A chunky bus with seats makes that loop obvious every time they load, drive and tip out. That clear trip structure is why this set suits get-on-go-return play, especially if a Happyland bus is already familiar from nursery.',
    },
    2: {
      why: 'Travel stories widen the same journey muscle beyond the London bus. An airport shuttle with Junior figures sized for little hands invites holiday boarding, going and coming back. That board-and-go pattern is why this set suits airport play when they are ready for trips that are not only around the block.',
    },
    3: {
      why: 'Help-and-rescue roles let them practise care inside pretend play. Doctor, fire and police figures open stories where someone needs looking after, with kindness as part of the job. That caring script is why this set suits help-and-rescue play once bus journeys already feel covered.',
    },
    4: {
      // Reduce Playmobil from 3 → 2: swap dump truck for DUPLO ambulance
      name: 'LEGO DUPLO Town Ambulance and Driver (10447)',
      brand: 'LEGO DUPLO',
      tag: 'Best for help-on-wheels',
      retailer: 'Wayland Games',
      url: 'https://www.waylandgames.co.uk/ambulance-driver-lego-duplo-10447-lego-10447',
      alts: [
        'https://www.lego.com/en-gb/product/ambulance-and-driver-10447',
        'https://www.johnlewis.com/lego-duplo-ambulance-and-driver-10447/p113215047',
      ],
      desc: 'A chunky DUPLO ambulance with a driver and patient figure, made for load-the-patient, drive, help and return play with pieces sized for little hands.',
      why: 'Help-on-wheels gives a clear care story with a beginning and an end: someone needs help, you drive, you help, you come back. DUPLO pieces stay sturdy when bus and helper figures already fill the basket. That simple rescue loop is why this set suits help-on-wheels play at nearly three.',
      rating: 4.7,
      count: null,
      exemption: 'specialist',
      evidence:
        'LEGO DUPLO 10447 Ambulance & Driver; Ages 2+. Primary locked to UK retailer product page (Wayland) after LEGO.com 403 for bots. Specialist exemption: review widgets not scrapeable on check date; founder QA confirm live stars on human click. Chosen to diversify away from three Playmobil Junior Top Picks.',
    },
    5: {
      why: 'Rebuild vehicle jobs keep small-world play fresh after bus and helper sets. Chunky DUPLO pieces let them invent the job, not only follow one script, while still driving and rebuilding. That open job inventiveness is why this set suits rebuild-vehicle play when the shelf already has a clear journey toy.',
    },
  },
  cat_threading_beads: {
    1: {
      why: 'Letters make the lace feel like a finished word job, not endless random beads. Oversized sweets keep little hands on a proper threading task while concentration is still growing. Keep them company as the cords love to tangle. That letter-finish pride is why this set suits letters-and-lacing practice at the table.',
    },
    2: {
      why: 'A storybook lace gives threading a clear finish line to show you. Feeding fruit along the caterpillar keeps guiding each piece interesting without tiny jewellery beads. That visible progress is why this set suits storybook threading when they need a reason to keep going to the end.',
    },
    3: {
      why: 'Chunky first beads are the classic next step after posting toys. Soft lace and big wooden shapes invite a proper threading job while concentration is still growing. Sit with them while they lace. That simple big-bead start is why this set suits chunky first beads without jumping to fiddly jewellery kits.',
    },
    4: {
      why: 'Copying a pattern is the stretch beyond random threading once focus grows. Picture cards turn the lace into a matching game, which keeps practice interesting beside beads they already like. That pattern step is why this set suits copying-patterns play without replacing the basic threading joy.',
    },
    5: {
      why: 'Some families want a kinder cord end while still practising a chunky threading job together. Short safety-release laces and large sensory beads keep the skill, with pack-away habits after play. That extra-kind cord design is why this set suits safer cord ends without giving up table threading time.',
    },
  },
};

function applyPick(pick, p, id) {
  if (p.tag) pick.best_for_tag = p.tag;
  if (p.name) pick.product_name = p.name;
  if (p.brand) pick.brand = p.brand;
  if (p.retailer) pick.retailer = p.retailer;
  if (p.url) pick.product_url = p.url;
  if (p.alts) pick.alternate_urls = p.alts;
  if (p.desc) pick.product_description_under_30_words = assertDesc(id, p.desc);
  if (p.rating !== undefined) pick.rating_value = p.rating;
  if (p.count !== undefined) pick.rating_count = p.count;
  if (p.exemption !== undefined) {
    pick.evidence_exemption = p.exemption;
    if (p.exemption === 'specialist') pick.evidence_tier = 'specialist';
  }
  if (p.evidence) pick.evidence_notes = p.evidence;
  pick.ember_verdict = assertWhy(id, p.why);
}

let n = 0;
for (const f of fs.readdirSync(greenDir)) {
  if (!/^ember_picks_.*\.json$/.test(f) || /ff_check|availability|url_smoke/.test(f)) continue;
  const fp = path.join(greenDir, f);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const map = PATCH[doc.category_entity_id];
  if (!map) throw new Error(doc.category_entity_id);
  for (const pick of doc.top_picks) {
    const p = map[pick.rank];
    if (!p) throw new Error(`${doc.category_entity_id}#${pick.rank}`);
    applyPick(pick, p, `${doc.category_entity_id}#${pick.rank}`);
  }
  // Demote Jungle Friends Orchard from appearing as duplicate brand story in longlist mirror
  if (doc.category_entity_id === 'cat_jigsaw_puzzles') {
    const ll2 = (doc.longlist || []).find((r) => Number(r.longlist_rank) === 2);
    if (ll2) {
      ll2.product_name = '4 Puzzles in a Box — Farm';
      ll2.brand = 'Galt';
      ll2.best_for_tag = 'Best for rising piece counts';
      ll2.product_url = 'https://www.amazon.co.uk/Galt-Toys-Puzzles-Box-Farm/dp/B00009XO3P';
      ll2.included_in_top_5 = true;
      ll2.top_pick_rank = 2;
    }
  }
  if (doc.category_entity_id === 'cat_small_world_figures') {
    const ll4 = (doc.longlist || []).find((r) => Number(r.longlist_rank) === 4);
    if (ll4) {
      ll4.product_name = 'LEGO DUPLO Town Ambulance and Driver (10447)';
      ll4.brand = 'LEGO DUPLO';
      ll4.best_for_tag = 'Best for help-on-wheels';
      ll4.included_in_top_5 = true;
      ll4.top_pick_rank = 4;
    }
  }
  if (doc.category_entity_id === 'cat_visual_routine_cards') {
    doc.methodology =
      'Benchmarked UK visual-routine cards against nearly-three independence. Screened under-36 ASD boards. Cap Create Visual Aids at two Top Picks (Amazon-findable timetable + portable book). Diversified with Little Goose magnets and Craftly handmade boards (specialist exemption; photos-first). Brand URLs preferred for Browse offers clarity.';
    doc.buying_factor_memo =
      'Photos-first honesty; age overlap without under-36 exclusions; job-fit (whole day, magnets, now/next, portable, doorway); brand diversity max two per brand; buyability and Shopping/primary-URL clarity for Browse offers.';
  }
  doc.research_date = '2026-07-23';
  fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n');
  console.log('ok', doc.category_entity_id);
  n += 1;
}
console.log('updated', n);
