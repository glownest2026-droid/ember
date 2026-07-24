#!/usr/bin/env node
/**
 * Detect deprecated / unbuyable products from live retailer HTML.
 * Complements stage3-url-smoke.mjs (HTTP status only).
 *
 * Usage:
 *   node agent-tools/scripts/stage3-availability-check.mjs https://…
 *   node agent-tools/scripts/stage3-availability-check.mjs --file=urls.txt
 */
import fs from 'node:fs';

// JL / heavy retailer PDPs often need >15s in cloud agents; 45s keeps fail-closed semantics.
const TIMEOUT_MS = Number(process.env.STAGE3_AVAIL_TIMEOUT_MS || 45000);
const MAX_BODY_CHARS = 250_000;
const USER_AGENT =
  'Mozilla/5.0 (compatible; EmberStage3Availability/1.0; +https://github.com/glownest2026-droid/ember)';

/** Manufacturer / catalogue retirement — hard fail for Top Picks */
export const DEPRECATED_PATTERNS = [
  /\bretired\s+product\b/i,
  /\bproduct\s+retired\b/i,
  /\bhas\s+been\s+retired\b/i,
  /\bdiscontinued\b/i,
  /\bno\s+longer\s+available\b/i,
  /\bno\s+longer\s+sold\b/i,
  /\bno\s+longer\s+stocked\b/i,
  /\bthis\s+item\s+is\s+not\s+available\b/i,
  /\bproduct\s+is\s+not\s+available\b/i,
];

/** Primary cannot be purchased today — hard fail for Top Pick primaries */
export const UNBUYABLE_PATTERNS = [
  /\bnotify\s+me\s+when\s+(this\s+product\s+is\s+)?in\s+stock\b/i,
  /\bemail\s+me\s+when\s+in\s+stock\b/i,
  /\bnotify\s+when\s+back\s+in\s+stock\b/i,
  /\bcurrently\s+out\s+of\s+stock\b/i,
  /\bout\s+of\s+stock\b/i,
  /\bsold\s+out\b/i,
  /\bcurrently\s+unavailable\b/i,
  /\bwe\s+don['']t\s+know\s+when\s+or\s+if\s+this\s+item\s+will\s+be\s+back\s+in\s+stock\b/i,
  /\bnot\s+available\s+for\s+delivery\b/i,
  /\bunavailable\s+online\b/i,
];

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    // IKEA and similar PDPs embed i18n dictionaries as quoted label strings
    // ("Currently unavailable for delivery") that are not product stock state.
    .replace(/"[^"]{0,120}(?:currently\s+unavailable|unavailable\s+online|out\s+of\s+stock|sold\s+out)[^"]{0,120}"/gi, ' ')
    // Site-wide range banners are not SKU-level unbuyable signals.
    .replace(/some parts of our range are currently unavailable online[^.]{0,80}\./gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchSignals(text, patterns) {
  const hits = [];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) hits.push(m[0].trim());
  }
  return [...new Set(hits)];
}

/**
 * @returns {{
 *   url: string,
 *   http_status: number|null,
 *   fetch_ok: boolean,
 *   product_status: 'buyable'|'deprecated'|'unbuyable'|'unknown',
 *   signals: string[],
 *   buyable: boolean,
 *   error: string|null,
 *   checked_at: string,
 * }}
 */
export async function checkUrlAvailability(url) {
  const checked_at = isoDate();
  if (!url || !/^https:\/\//i.test(url)) {
    return {
      url: url || '',
      http_status: null,
      fetch_ok: false,
      product_status: 'unknown',
      signals: [],
      buyable: false,
      error: 'missing_or_non_https',
      checked_at,
    };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'en-GB,en;q=0.9',
      },
    });
    clearTimeout(timer);

    const http_status = res.status;
    const fetch_ok = http_status >= 200 && http_status < 400;
    if (!fetch_ok) {
      return {
        url,
        http_status,
        fetch_ok: false,
        product_status: 'unknown',
        signals: [],
        buyable: false,
        error: `http_${http_status}`,
        checked_at,
      };
    }

    const raw = await res.text();
    const text = stripHtml(raw.slice(0, MAX_BODY_CHARS));
    const deprecated = matchSignals(text, DEPRECATED_PATTERNS);
    const unbuyable = matchSignals(text, UNBUYABLE_PATTERNS);

    let product_status = 'buyable';
    let signals = [];
    if (deprecated.length) {
      product_status = 'deprecated';
      signals = deprecated;
    } else if (unbuyable.length) {
      product_status = 'unbuyable';
      signals = unbuyable;
    }

    return {
      url,
      http_status,
      fetch_ok: true,
      product_status,
      signals,
      buyable: product_status === 'buyable',
      error: null,
      checked_at,
    };
  } catch (err) {
    return {
      url,
      http_status: null,
      fetch_ok: false,
      product_status: 'unknown',
      signals: [],
      buyable: false,
      error: err?.name === 'AbortError' ? 'timeout' : String(err?.message || err),
      checked_at,
    };
  }
}

export function availabilityGateFromPick(pick, availHit, altHits = []) {
  const reasons = [];
  const stock = String(pick?.stock_status || '').toLowerCase();
  if (stock === 'discontinued' || stock === 'retired') {
    reasons.push('stock_status_deprecated');
  }
  if (stock === 'out_of_stock') {
    reasons.push('stock_status_out_of_stock');
  }
  for (const altHit of altHits) {
    if (altHit?.product_status === 'deprecated') {
      reasons.push(`alternate_deprecated:${(altHit.signals || []).join('|')}`);
    }
  }
  if (!availHit) {
    reasons.push('availability_not_checked');
    return reasons;
  }
  if (!availHit.fetch_ok) {
    reasons.push(`availability_fetch_failed:${availHit.error || availHit.http_status}`);
    return reasons;
  }
  if (availHit.product_status === 'deprecated') {
    reasons.push(`product_deprecated:${availHit.signals.join('|')}`);
  } else if (availHit.product_status === 'unbuyable') {
    reasons.push(`product_unbuyable:${availHit.signals.join('|')}`);
  }
  return reasons;
}

export async function checkDocumentAvailability(doc, { concurrency = 4 } = {}) {
  const urls = new Set();
  for (const p of doc.top_picks || []) {
    if (p.product_url) urls.add(p.product_url);
    for (const a of p.alternate_urls || []) {
      if (a) urls.add(a);
    }
  }
  const entries = [...urls];
  const results = new Map();
  let i = 0;
  async function worker() {
    while (i < entries.length) {
      const idx = i++;
      const url = entries[idx];
      results.set(url, await checkUrlAvailability(url));
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, entries.length || 1) }, () => worker()),
  );
  return {
    checked_at: isoDate(),
    url_count: entries.length,
    buyable_count: [...results.values()].filter((r) => r.buyable).length,
    results: Object.fromEntries(results),
  };
}

function parseArgs(argv) {
  const urls = [];
  let file = '';
  for (const a of argv) {
    if (a.startsWith('--file=')) file = a.slice('--file='.length);
    else if (!a.startsWith('-')) urls.push(a);
  }
  if (file) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const u = line.trim();
      if (u && !u.startsWith('#') && /^https:\/\//i.test(u)) urls.push(u);
    }
  }
  return [...new Set(urls)];
}

async function main() {
  const urls = parseArgs(process.argv.slice(2));
  if (!urls.length) {
    console.error('Usage: node stage3-availability-check.mjs <url…> | --file=urls.txt');
    process.exit(1);
  }
  const results = [];
  for (const url of urls) {
    const r = await checkUrlAvailability(url);
    results.push(r);
    const mark = r.buyable ? 'BUYABLE' : r.product_status.toUpperCase();
    const sig = r.signals.length ? ` (${r.signals[0]})` : '';
    console.log(`${mark} ${r.http_status ?? r.error}${sig}  ${url}`);
  }
  const buyable = results.filter((r) => r.buyable).length;
  console.log(
    JSON.stringify({ checked: results.length, buyable, not_buyable: results.length - buyable }, null, 2),
  );
  if (buyable < results.length) process.exitCode = 2;
}

import { fileURLToPath } from 'node:url';
import path from 'node:path';
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
