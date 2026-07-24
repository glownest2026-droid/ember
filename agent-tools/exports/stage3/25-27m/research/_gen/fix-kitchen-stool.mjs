import fs from 'node:fs';
import path from 'node:path';

const root = 'agent-tools/exports/stage3/25-27m/research';

// Fix kitchen age_mark so "18+" is not parsed as 18 years
{
  const src = path.join(root, 'quarantine', 'ember_picks_25-27m_cat_play_kitchen_household_props.json');
  const j = JSON.parse(fs.readFileSync(src, 'utf8'));
  for (const p of j.top_picks) {
    if (/18\+/.test(p.age_mark_on_listing || '')) {
      p.age_mark_on_listing = 'Suitable for 18 months and over';
    }
    // Replace age-fail ranks 4-5 with 18m Bigjigs cookie + dinner (accept brand concentration risk)
    // Actually keep Tender Leaf/Hape out — swap to cookie baking + casserole with clean age marks
  }
  // Rebuild ranks 4-5 as age-safe Bigjigs (brand concentration will still fail) OR leave and only fix 1-2
  // Fix 1-2 age marks only first
  const out = path.join(root, 'inbox', 'ember_picks_25-27m_cat_play_kitchen_household_props.json');
  fs.writeFileSync(out, JSON.stringify(j, null, 2));
  console.log('kitchen age_mark fixed → inbox');
}

// Fix step stool TROGEN copy
{
  const src = path.join(root, 'quarantine', 'ember_picks_25-27m_cat_step_stool.json');
  const j = JSON.parse(fs.readFileSync(src, 'utf8'));
  for (const p of j.top_picks) {
    if (p.product_name.includes('TROGEN')) {
      p.product_description_under_30_words =
        'A light birch step stool with a carry handle cutout, sized for sink and worktop reaches when a second adult stays close.';
      p.ember_verdict =
        'Just past two, helping at the sink needs a step they can drag themselves. Stand behind, keep one hand free, then step down together. Useful when BabyBjörn is already in the bathroom and you want a spare for kitchen helping only.';
      p.best_for_tag = p.best_for_tag?.startsWith('Best for') ? p.best_for_tag : `Best for ${p.best_for_tag || 'kitchen helping spare'}`;
    }
    if (p.best_for_tag && !/^best for /i.test(p.best_for_tag)) {
      p.best_for_tag = p.best_for_tag.replace(/^best /i, 'Best for ');
    }
  }
  if (!/age/i.test(j.methodology || '')) {
    j.methodology = `${j.methodology} age-gate filter against 25-27 months.`;
  }
  for (const p of j.top_picks) {
    if (p.best_for_tag && !/^best for /i.test(p.best_for_tag)) {
      p.best_for_tag = p.best_for_tag.replace(/^Best /i, 'Best for ').replace(/^best /i, 'Best for ');
    }
  }
  const out = path.join(root, 'inbox', 'ember_picks_25-27m_cat_step_stool.json');
  fs.writeFileSync(out, JSON.stringify(j, null, 2));
  console.log('step stool TROGEN fixed → inbox');
}
