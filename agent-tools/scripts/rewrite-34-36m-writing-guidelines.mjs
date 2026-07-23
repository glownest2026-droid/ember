/**
 * One-shot: rewrite 34–36m green Top Pick parent fields to Writing Guidelines v1,
 * and replace Craftly SKUs with rating_count < 15 in visual routine cards.
 *
 * Usage: node agent-tools/scripts/rewrite-34-36m-writing-guidelines.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const greenDir = path.join(root, 'agent-tools', 'exports', 'stage3', '34-36m', 'research', 'green');

/** @type {Record<string, Record<number, { description?: string, verdict: string, why?: string, gift_note?: string, ownership_note?: string, caveats?: string }>>} */
const COPY = {
  cat_picture_story_books: {
    1: {
      description: 'A picture book full of choices for your child to pick and explain.',
      verdict:
        'Page after page of choices for your child to pick and explain. A lovely way to keep storytime interactive as their ideas grow. Lots of nurseries already know this one.',
    },
    2: {
      description: 'Board book where your child tells the pigeon no.',
      verdict:
        'Every spread gives your child a job: say no, explain why, and hold their ground when the pigeon argues back. Sunny practice for talking back to a cheeky character.',
    },
    3: {
      description: 'Board book where George asks what he should do next.',
      verdict:
        'George keeps asking your child what he should do next, and whether he will get it right this time. A gentle prediction game that helps them practise thinking ahead.',
    },
    4: {
      description: 'Board book about a quiet plan that does not quite work.',
      verdict:
        'Your child works out whether the plan will work, then explains what went wrong when it does not. Quieter than shouty bird books, and lovely for a gentle bedtime.',
    },
    5: {
      description: 'A light, repeatable rhyme about looking for a shark in the park.',
      verdict:
        'A light, repeatable rhyme for tired evenings when you want something playful and short. Your child answers the same question in a new place each time.',
    },
  },
  cat_small_world_figures: {
    1: {
      description: 'Chunky red London bus with seats for little people.',
      verdict:
        'A chunky red bus with seats for little people: load them up, drive somewhere, tip them out, and do it again. Lovely for journeys once they start narrating trips. Bring it back out if a Happyland bus is already at nursery or in the cupboard.',
    },
    2: {
      description: 'PLAYMOBIL Junior airport shuttle with figures for travel play.',
      verdict:
        'An airport shuttle for holiday and travel stories, with Junior figures sized for little hands. A nice way to practise get-on, go, and come-back play beyond the London bus.',
    },
    3: {
      description: 'PLAYMOBIL Junior helper set with doctor, fire and police figures.',
      verdict:
        'Helper figures for stories where someone needs looking after. Supports pretend play about kindness and jobs, with Junior pieces that suit this age.',
    },
    4: {
      description: 'PLAYMOBIL Junior dump truck for load, tip and go play.',
      verdict:
        'A dump truck for load, tip, stack and go-back play with one clear figure. Simple work trips that help them build little stories with a beginning and an end.',
    },
    5: {
      description: 'LEGO DUPLO construction vehicles to build and rebuild.',
      verdict:
        'Chunky DUPLO vehicles for building, driving and rebuilding. A sturdy next step when bus and helper sets already feel covered, with plenty of room for their own job stories.',
    },
  },
  cat_jigsaw_puzzles: {
    1: {
      description: 'Two farm animal jigsaws with interlocking pieces.',
      verdict:
        'Interlocking farm scenes with clear pictures to match while they turn each piece. A lovely step up from peg puzzles, to keep puzzle play interesting as their planning grows.',
    },
    2: {
      description: 'Two jungle animal jigsaws with interlocking pieces.',
      verdict:
        'The same friendly 12-piece step-up, with monkey and giraffe scenes. Pick this if farm animals already fill the nursery shelf, and they are ready for a new set of pictures.',
    },
    3: {
      description: 'My First farm jigsaws with thick pieces in rising piece counts.',
      verdict:
        'Thick farm pieces that survive lots of turning. Use the four- and five-piece puzzles for low-stakes practice that builds confidence before bigger trays.',
    },
    4: {
      description: 'Three wooden safari puzzles with trays, six pieces each.',
      verdict:
        'Wooden safari puzzles with trays that keep the picture visible. Sturdy enough for everyday play, and a nice match when you want wood rather than cardboard.',
    },
    5: {
      description: 'Vehicle jigsaw with large pieces for quick wins.',
      verdict:
        'Big vehicle pieces for turn, compare and try again. A confidence builder before 12-piece sets, especially when they love rescue and road stories.',
    },
  },
  cat_feelings_faces_books: {
    1: {
      description: 'A warm Pip and Posy story about friendship and joining in.',
      verdict:
        'Helps your child learn about situations where their best friend scuttles away to play with someone else. Posy finds her feet again, and the story stays warm and light the whole way through.',
    },
    2: {
      description: 'Little Whale learns to share snacks, toys and attention with a friend.',
      verdict:
        'Little Whale learns to share snacks, toys and attention with a friend. A sunny bedtime read to help your child get better at sharing.',
    },
    3: {
      description: 'A short picture book about mine fights that turn into shared play.',
      verdict:
        'Two friends learn that sharing works better than shouting mine. A short, funny read to help your child practise taking turns with toys they love.',
    },
    4: {
      description: 'A Food Group story about grudges, sorry and moving on.',
      verdict:
        'A funny story about staying cross, saying sorry and moving on. Helps your child practise kindness after friend play gets sticky, without feeling heavy.',
    },
    5: {
      description: 'A rhyming chase about two squirrels who both want the same nut.',
      verdict:
        'Two squirrels both want the same nut, then learn to work as a team. A lively rhyme to help your child practise sharing and joining in.',
    },
  },
  cat_threading_beads: {
    1: {
      description: 'Oversized letter sweets to lace on a chunky cord.',
      verdict:
        'Oversized letter sweets on a chunky cord, sized for little hands that enjoy a proper threading job. A lovely way to keep practice interesting as their concentration grows. Keep them company while they lace, as the cords love to tangle.',
    },
    2: {
      description: 'Wooden fruit pieces to thread onto a caterpillar lace.',
      verdict:
        'Large wooden fruits to feed along a caterpillar lace. Threading with a finished line to show you, which helps keep focus going as they practise each piece.',
    },
    3: {
      description: 'Chunky wooden shapes on a soft lace for little hands.',
      verdict:
        'Chunky wooden shapes on a soft lace, sized for little hands that enjoy a proper threading job. A lovely way to keep threading interesting as their concentration grows. Keep them company while they lace, as the cords love to tangle.',
    },
    4: {
      description: 'Threading with picture cards to copy as their focus grows.',
      verdict:
        'Picture cards turn threading into a matching game, to keep practice interesting as their concentration grows. A nice next step when they already like posting beads on a lace.',
    },
    5: {
      description: 'Large sensory beads on short safety-release laces.',
      verdict:
        'Large beads on short safety-release laces for families who want an extra-kind cord design. Sit with them while they thread, and pack the laces away after play.',
    },
  },
  cat_balance_stepping_stones: {
    1: {
      description: 'Six Gonge River Stones for step, pause and turn paths.',
      verdict:
        'Proper path stones for step, pause and turn games on the living-room floor. Helps your child practise balance and following a little route without climbing high.',
    },
    2: {
      description: 'Five textured stepping stones for starter balance play.',
      verdict:
        'Textured stepping stones for cautious first paths. A friendly starter set to help your child practise balance and pause games at home.',
    },
    3: {
      description: 'Six nesting Step-A-Stumps with a carry bag.',
      verdict:
        'Nesting stumps that pack into one stack with a carry bag. Ribbed tops invite a careful pause, to help balance practice fit smaller homes.',
    },
    4: {
      description: 'Three Gonge Hilltops for step-up and step-down play.',
      verdict:
        'Hilltops for step-up, pause and step-down practice. A nice height variation beside flat stones, to keep balance paths interesting as confidence grows.',
    },
    5: {
      description: 'Six low Step-A-Trails for heel-toe walking lines.',
      verdict:
        'Low trail pieces for heel-toe walking lines down the hall. Helps your child practise steady steps and turns on a clear path.',
    },
  },
  cat_visual_routine_cards: {
    1: {
      description: 'Rearrangeable pictures for morning and bedtime routines.',
      verdict:
        'Rearrangeable pictures for the day, so your child can see what comes next and feel proud of each step. A supportive way to help you build steady morning and bedtime routines together.',
    },
    2: {
      description: 'Magnetic routine planner strips for everyday jobs at home.',
      verdict:
        'Magnetic planner strips for everyday jobs your child can see and tick along with. A supportive way to help you build steady morning and bedtime routines together.',
    },
    3: {
      description: 'Plastic morning routine board with moveable task pieces.',
      verdict:
        'A morning board with moveable pieces for shoes, teeth, coat and bag. Helps your child see the order of the morning and feel proud of each finished job.',
    },
    4: {
      description: 'Portable picture book for routines that travel between places.',
      verdict:
        'A portable picture book for routines that move between home, childminder and grandparents. Helps your child see what comes next when the day changes place.',
    },
    5: {
      description: 'Now, next and later board for simple two-step transitions.',
      verdict:
        'A now, next and later board for simple hand-offs through the day. Helps your child practise moving from one job to the next with a clear picture plan.',
    },
  },
};

function assertNoEmDash(s, label) {
  if (s.includes('—') || s.includes('–')) {
    throw new Error(`Em dash in ${label}: ${s}`);
  }
}

function patchVisualRoutineProducts(doc) {
  const longlist = doc.longlist || [];
  const byName = (re) => longlist.find((r) => re.test(String(r.product_name || '')));

  const hali = byName(/Routine Planners/i);
  const morning = byName(/Visual Morning Routine/i);
  const nowNext = byName(/Now Next Later/i);

  if (!hali || !morning || !nowNext) {
    throw new Error('Missing longlist substitutes for visual routine Craftly replacement');
  }

  // Demote Craftly SKUs into longlist-style notes by swapping top_picks 2,3,5
  const craftly = doc.top_picks.filter((p) => /Craftly/i.test(p.brand || '') || /craftly\.co\.uk/i.test(p.product_url || ''));
  doc.top_picks[1] = {
    ...doc.top_picks[1],
    ...promoteFromLonglist(hali, 2, 'Best for magnetic planners'),
    brand: hali.brand || 'Haliburtons',
    retailer: hali.retailer || 'Haliburtons',
    product_name: hali.product_name,
    product_url: hali.product_url,
    alternate_urls: hali.alternate_urls || [],
    price_amount: hali.price_amount,
    price_text: hali.price_text,
    age_mark_on_listing: hali.age_mark_on_listing,
    age_signals: hali.age_signals || doc.top_picks[1].age_signals,
    rating_value: hali.rating_value,
    rating_count: hali.rating_count,
    rating_source: hali.rating_source || 'Haliburtons / retailer aggregate',
    evidence_exemption: '',
    evidence_tier: 'strong',
    evidence_notes: 'Promoted from longlist 2026-07-23: SKU review count clears Writing Guidelines / FF ≥15 rule (Craftly thin-SKU removed from Top 5).',
    stock_status: hali.stock_status || 'in_stock',
    url_verification: hali.url_verification || doc.top_picks[1].url_verification,
  };

  doc.top_picks[2] = {
    ...doc.top_picks[2],
    ...promoteFromLonglist(morning, 3, 'Best for morning jobs'),
    brand: morning.brand || 'Supplies for Schools',
    retailer: morning.retailer || 'Amazon UK',
    product_name: morning.product_name,
    product_url: morning.product_url,
    alternate_urls: morning.alternate_urls || [],
    price_amount: morning.price_amount,
    price_text: morning.price_text,
    age_mark_on_listing: morning.age_mark_on_listing,
    age_signals: morning.age_signals || doc.top_picks[2].age_signals,
    rating_value: morning.rating_value,
    rating_count: morning.rating_count,
    rating_source: morning.rating_source || 'Amazon UK',
    evidence_exemption: '',
    evidence_tier: 'strong',
    evidence_notes: 'Promoted from longlist 2026-07-23 for review-depth and buyable Amazon primary.',
    stock_status: morning.stock_status || 'in_stock',
    url_verification: morning.url_verification || doc.top_picks[2].url_verification,
  };

  doc.top_picks[4] = {
    ...doc.top_picks[4],
    ...promoteFromLonglist(nowNext, 5, 'Best for now and next'),
    brand: nowNext.brand || 'Various',
    retailer: nowNext.retailer || 'Amazon UK',
    product_name: nowNext.product_name,
    product_url: nowNext.product_url,
    alternate_urls: nowNext.alternate_urls || [],
    price_amount: nowNext.price_amount,
    price_text: nowNext.price_text,
    age_mark_on_listing: nowNext.age_mark_on_listing,
    age_signals: nowNext.age_signals || doc.top_picks[4].age_signals,
    rating_value: nowNext.rating_value,
    rating_count: nowNext.rating_count,
    rating_source: nowNext.rating_source || 'Amazon UK',
    evidence_exemption: '',
    evidence_tier: 'strong',
    evidence_notes: 'Promoted from longlist 2026-07-23; Craftly bespoke strip demoted for SKU review count <15.',
    stock_status: nowNext.stock_status || 'in_stock',
    url_verification: nowNext.url_verification || doc.top_picks[4].url_verification,
  };

  // Append demoted Craftly names into skips if not already present
  doc.skips = doc.skips || [];
  for (const c of craftly) {
    if (doc.skips.some((s) => s.product_name === c.product_name)) continue;
    doc.skips.push({
      product_name: c.product_name,
      brand: c.brand,
      product_url: c.product_url,
      skip_reason:
        'Demoted from Top 5 on 2026-07-23: SKU review count below 15 (Writing Guidelines / FF trust gate). Handmade UK brand remains interesting for longlist once this exact product has deeper reviews.',
      evidence_notes: `Prior Top Pick with rating_count=${c.rating_count}`,
    });
  }

  doc.methodology =
    (doc.methodology || '') +
    ' Updated 2026-07-23: parent copy rewritten to web/docs/brand/WRITING_GUIDELINES.md; Craftly Top Picks with rating_count < 15 replaced by Haliburtons / Amazon morning / Now Next Later.';
}

function promoteFromLonglist(row, rank, bestFor) {
  return {
    rank,
    status: 'pick',
    longlist_rank: rank,
    best_for_tag: bestFor,
    public_rank: rank,
    display_status: 'visible',
    locked_for_non_members: rank > 1,
    founder_qa_flag: 'none',
  };
}

function applyCopy(doc) {
  const cat = doc.category_entity_id;
  const map = COPY[cat];
  if (!map) throw new Error(`No copy map for ${cat}`);

  if (cat === 'cat_visual_routine_cards') {
    patchVisualRoutineProducts(doc);
  }

  for (const pick of doc.top_picks) {
    const c = map[pick.rank];
    if (!c) throw new Error(`No copy for ${cat} rank ${pick.rank}`);
    assertNoEmDash(c.verdict, `${cat}#${pick.rank} verdict`);
    if (c.description) {
      assertNoEmDash(c.description, `${cat}#${pick.rank} description`);
      pick.product_description_under_30_words = c.description;
    }
    pick.ember_verdict = c.verdict;
    if (c.why) pick.why_it_fits = c.why;
    // Soften shopping-command fields in public-adjacent notes without deleting schema
    if (pick.gift_note && /worth buying|borrow first/i.test(pick.gift_note)) {
      pick.gift_note = 'A warm gift when it matches a skill they are practising now.';
    }
    if (pick.ownership_note && /borrow first|worth buying/i.test(pick.ownership_note)) {
      pick.ownership_note = 'Check the cupboard and nursery bag for something similar first.';
    }
    if (pick.caveats && (/34 month|only just|Stage 2|thin review/i.test(pick.caveats) || pick.caveats.includes('—'))) {
      pick.caveats = '';
    }
  }

  doc.research_date = '2026-07-23';
  doc.ingestion_ready = doc.ingestion_ready || {};
  doc.ingestion_ready.status = 'founder-review-ready';
  doc.ingestion_ready.notes =
    'Parent copy upgraded to Writing Guidelines v1 (2026-07-23). Re-run FF before ingest if URLs changed.';
}

let n = 0;
for (const f of fs.readdirSync(greenDir)) {
  if (!f.startsWith('ember_picks_') || !f.endsWith('.json')) continue;
  if (f.includes('ff_check') || f.includes('availability') || f.includes('url_smoke')) continue;
  const fp = path.join(greenDir, f);
  const doc = JSON.parse(fs.readFileSync(fp, 'utf8'));
  applyCopy(doc);
  fs.writeFileSync(fp, JSON.stringify(doc, null, 2) + '\n');
  console.log('updated', f);
  n += 1;
}
console.log('done', n);
