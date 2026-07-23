/**
 * Founder 2026-07-23d — scrub AI tells that slipped past the old narrow FF net.
 * Uses the shared ban module for post-write validation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bannedHits } from './lib/stage3-banned-copy.mjs';

const greenDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
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
  if (n < 40 || n > 60) throw new Error(`${id} why=${n}: ${text}`);
  const hits = bannedHits(text);
  if (hits.length) throw new Error(`${id} why banned: ${hits.join('|')} — ${text}`);
  return text;
}

function assertDesc(id, text) {
  const n = wc(text);
  if (n < 20 || n > 40) throw new Error(`${id} desc=${n}: ${text}`);
  const hits = bannedHits(text);
  if (hits.length) throw new Error(`${id} desc banned: ${hits.join('|')} — ${text}`);
  return text;
}

function assertTag(id, text) {
  const hits = bannedHits(text);
  if (hits.length) throw new Error(`${id} tag banned: ${hits.join('|')} — ${text}`);
  return text;
}

const PATCH = {
  cat_balance_stepping_stones: {
    2: {
      why: 'Not every family wants premium stones on day one. Five textured pieces are enough for a short hallway route with pause points, so you can see whether path play sticks before spending more. That kinder first look is why this suits smaller budgets without cutting the balance skill short.',
    },
    3: {
      why: 'Hallways and small flats need kit that packs away. Nesting stump sizes still give a proper step-up path, then collapse into one stack with a carry bag so the living room is free again. That pack-away design is why they suit small spaces while balance practice stays part of everyday play.',
    },
    5: {
      why: 'Distance judgement grows fast around this age: can they stretch to the next stone without rushing? Rope-linked gaps make that stretch visible and adjustable, so you can widen the challenge as confidence grows. That controlled reach is why they suit gap practice better than another set of freestanding stones.',
    },
  },
  cat_feelings_faces_books: {
    1: {
      tag: 'Best for jealous wobbles',
      why: 'Best-friend feelings run deep at nearly three, and so do the wobbles when someone new joins in. This story keeps the evening light while naming that sting and the soft way back. That gentle recovery is why it suits jealous wobbles without turning bedtime into a behaviour chat.',
    },
    2: {
      why: 'Sharing is a skill to grow into after sticky playdates, not a warning to sit through. A sunny short read lets them practise the idea with you when the house feels settled again. That warm rehearsal is why this book suits sharing rows when you want kindness more than a scolding.',
    },
    3: {
      why: 'Mine fights need humour after a sticky playdate more than a talking-to. A funny short book gives you a shared joke to reset the evening without replaying the row. That light reset is why it suits mine-fight nights you may want to open more than once.',
    },
    4: {
      why: 'Holding a grudge is new at nearly three, and so is starting again. A Food Group story brings enough humour for repeat reads when the cross feeling has stuck. That kind reset is why it suits stuck-cross nights without turning feelings into homework.',
    },
    5: {
      why: 'Competitive rows need a team ending once both children want the same prize. A lively rhyme keeps the chase fun while landing on joining in rather than who won. That joining-in finish is why it suits competitive rows without dampening the fun of the race.',
    },
  },
  cat_jigsaw_puzzles: {
    2: {
      why: 'When a full twelve-piece tray still looks like a stretch, rising piece counts give gentler starts in one box. Thick Galt pieces survive lots of turning while they learn to finish a picture. That progressive climb is why this suits rising piece counts before bigger interlocking sets.',
    },
    3: {
      tag: 'Best for gentler starts',
      why: 'A full twelve-piece tray can look like a lot when interlocking is still new. Ravensburger My First farm scenes keep the picture clear while pieces stay thick enough for lots of turning. That gentler start is why this suits families easing into interlocking puzzles before the bigger farm and jungle trays.',
    },
    4: {
      why: 'When cardboard is already chewed or stepped on in daily play, wood holds up better on the floor. Six-piece safari trays still need a small plan, but the material survives everyday life. That durability plus a clear tray picture is why this suits families who want wooden puzzles in the mix, not another soft cardboard set.',
    },
    5: {
      why: 'Vehicle fans need a confidence-building set before a fuller twelve-piece tray. Short rescue scenes keep turn, compare and try again going without a table full of bits, and the characters invite a little matching story after the picture is done. That is why this suits rescue vehicle play at this age.',
    },
  },
  cat_picture_story_books: {
    1: {
      why: 'Talk-back is growing fast at nearly three: choosing and explaining, not only listening. Spread after spread of open choices gives them something to decide and say out loud. That choosing practice is why this book suits open-choice reading on the sofa or at bedtime.',
    },
    2: {
      why: 'Practising a firm, funny no is useful once opinions arrive. The pigeon argues back on every spread, and your child holds the line with a reason. That playful back-and-forth is why this board book suits saying-no practice without turning bedtime into a talking-to.',
    },
    3: {
      why: 'Guessing what comes next builds longer talk before bigger plots arrive. Each page invites a prediction from your child, so they stay in the conversation rather than only listening. That forward-looking chat is why this board book suits guessing-what-next reads at nearly three.',
    },
    4: {
      why: 'Once stories stretch a little longer, spotting a wobbly idea becomes useful talk. This quieter read invites your child to say what went wrong and what to try next, without a noisy bird on every page. That noticing chat is why it suits predicting-plans reads at bedtime.',
    },
  },
  cat_small_world_figures: {
    5: {
      why: 'Rebuild vehicle jobs keep small-world play fresh after bus and helper sets. Chunky DUPLO pieces let them invent the job, not only follow one fixed idea, while still driving and rebuilding. That open inventiveness is why this set suits rebuild vehicle play when the shelf already has a clear trip toy.',
    },
  },
  cat_threading_beads: {
    1: {
      why: 'Letters make the lace into a finished word job, not endless random beads. Oversized sweets keep little hands on a proper threading task while concentration is still growing. Keep them company because the cords tangle easily. That letter-finish pride is why this set suits letters-and-lacing practice at the table.',
    },
    5: {
      why: 'Cord ends need care when siblings or pets share the floor. Safety-release laces and large sensory beads keep the threading skill while making pack-away kinder after play. That safer finish is why this set suits safer cord ends without dropping table practice.',
    },
  },
  cat_visual_routine_cards: {
    3: {
      why: 'Big whole-day boards can overwhelm when all you need is the next hand-off. Showing only a couple of pictures keeps the change clear for nearly-threes still learning transitions. Handmade UK metal and tokens matched to your day are why this suits now-and-next changes without a ten-step wall.',
    },
    4: {
      why: 'Wall charts stay in one room, but many nearly-three days move between home, childminder and grandparents. A portable picture book keeps the same routine symbols in the changing bag, so what comes next stays familiar when the place changes. That take-anywhere design is why this suits portable routines without buying a second wall set.',
    },
  },
};

let updated = 0;
for (const [id, map] of Object.entries(PATCH)) {
  const fp = path.join(greenDir, `ember_picks_34-36m_${id}.json`);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  for (const pick of doc.top_picks) {
    const p = map[pick.rank];
    if (!p) continue;
    if (p.tag) {
      pick.best_for_tag = assertTag(`${id}#${pick.rank}`, p.tag);
      // Mirror on matching longlist row when present
      for (const row of doc.longlist || []) {
        if (row.top_pick_rank === pick.rank || row.included_in_top_5 && row.longlist_rank === pick.rank) {
          row.best_for_tag = pick.best_for_tag;
        }
      }
    }
    if (p.desc) pick.product_description_under_30_words = assertDesc(`${id}#${pick.rank}`, p.desc);
    if (p.why) {
      pick.ember_verdict = assertWhy(`${id}#${pick.rank}`, p.why);
      for (const row of doc.longlist || []) {
        if (row.top_pick_rank === pick.rank || (row.included_in_top_5 && Number(row.longlist_rank) === Number(pick.rank))) {
          if (row.ember_verdict != null) row.ember_verdict = pick.ember_verdict;
        }
      }
    }
    updated += 1;
  }

  // Final sweep: every Top Pick parent field must be clean
  for (const pick of doc.top_picks) {
    for (const field of ['ember_verdict', 'product_description_under_30_words', 'best_for_tag']) {
      const hits = bannedHits(pick[field]);
      if (hits.length) {
        throw new Error(`${id}#${pick.rank} ${field} still banned: ${hits.join('|')} — ${pick[field]}`);
      }
    }
  }

  fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n', 'utf8');
  console.log('updated', id);
}

console.log('done', updated, 'picks patched');
