#!/usr/bin/env node
/**
 * Audit Stage 3 green research for UK market failures (Top Picks + longlist URLs).
 * Usage: node agent-tools/scripts/stage3-uk-market-audit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ukMarketFailReasons } from './lib/stage3-uk-market.mjs';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const root = path.join(repoRoot, 'agent-tools', 'exports', 'stage3');

const fails = [];
let topTotal = 0;
let longTotal = 0;

for (const band of fs.readdirSync(root).filter((d) => /^\d/.test(d))) {
  const green = path.join(root, band, 'research', 'green');
  if (!fs.existsSync(green)) continue;
  for (const f of fs.readdirSync(green).filter((x) => /^ember_picks_.*\.json$/.test(x))) {
    const doc = JSON.parse(fs.readFileSync(path.join(green, f), 'utf8'));
    for (const pick of doc.top_picks || []) {
      topTotal += 1;
      const url = pick.product_url || pick.url || '';
      const reasons = ukMarketFailReasons(url, {
        priceText: pick.price_text || pick.price_gbp || pick.price || '',
        requireUrl: true,
      });
      if (reasons.length) {
        fails.push({
          band,
          file: f,
          role: 'top',
          rank: pick.rank,
          name: pick.product_name,
          brand: pick.brand,
          url,
          price: pick.price_text || pick.price_gbp || '',
          reasons,
        });
      }
    }
    for (const row of doc.longlist || []) {
      const url = row.product_url || row.url || '';
      if (!String(url).trim()) continue;
      longTotal += 1;
      const reasons = ukMarketFailReasons(url, {
        priceText: row.price_text || row.price_gbp || row.price || '',
        requireUrl: true,
      });
      if (reasons.length) {
        fails.push({
          band,
          file: f,
          role: 'longlist',
          rank: row.longlist_rank,
          name: row.product_name,
          brand: row.brand,
          url,
          price: row.price_text || row.price_gbp || '',
          reasons,
        });
      }
    }
  }
}

console.log(JSON.stringify({ topTotal, longlistWithUrl: longTotal, failCount: fails.length, fails }, null, 2));
process.exit(fails.length ? 1 : 0);
