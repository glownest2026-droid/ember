#!/usr/bin/env node
/**
 * Batch HTTP status check for Stage 3 product URLs.
 * Never guess — records url_ok from real responses.
 *
 * Amazon special case (founder 2026-07-23): HTTP 200 is not enough.
 * Amazon often returns a tiny bot-wall or soft-404 stub with status 200.
 * Those must fail closed so dead ASINs cannot ship as Top Pick primaries.
 *
 * Usage:
 *   node agent-tools/scripts/stage3-url-smoke.mjs path/to/file.json
 *   node agent-tools/scripts/stage3-url-smoke.mjs --dir=agent-tools/exports/stage3/34-36m/research/inbox
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TIMEOUT_MS = 15000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isAmazonUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === 'amazon.co.uk' || host.endsWith('.amazon.co.uk') || host === 'www.amazon.com' || host.endsWith('.amazon.com');
  } catch {
    return false;
  }
}

function amazonAsin(url) {
  const m = String(url).match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}

/**
 * Substance gate for Amazon HTML. Status 200 alone is not proof the ASIN works.
 * @returns {{ ok: boolean, error: string | null, amazon_gate: string }}
 */
export function analyzeAmazonHtml(url, html) {
  const body = String(html || '');
  const asin = amazonAsin(url);

  if (
    /automated access to Amazon data/i.test(body) ||
    /api-services-support@amazon\.com/i.test(body) ||
    (/To discuss automated access/i.test(body) && body.length < 20000)
  ) {
    return {
      ok: false,
      error: 'amazon_bot_wall_unverified',
      amazon_gate: 'bot_wall',
    };
  }

  if (
    /looking for something/i.test(body) ||
    /dogs of amazon/i.test(body) ||
    /sorry, we couldn.?t find that page/i.test(body) ||
    /page not found/i.test(body)
  ) {
    return { ok: false, error: 'amazon_soft_404', amazon_gate: 'soft_404' };
  }

  // Tiny stub pages are never real product PDPs.
  if (body.length > 0 && body.length < 12000) {
    return { ok: false, error: 'amazon_stub_page', amazon_gate: 'stub' };
  }

  if (asin && !body.includes(asin)) {
    return { ok: false, error: 'amazon_asin_missing_from_page', amazon_gate: 'asin_missing' };
  }

  const hasProductSignal =
    /id=["']productTitle["']/i.test(body) ||
    /data-asin=["'][A-Z0-9]{10}["']/i.test(body) ||
    /add.to.(?:cart|basket)/i.test(body) ||
    /add-to-(?:cart|basket)/i.test(body);

  if (!hasProductSignal) {
    return { ok: false, error: 'amazon_not_product_page', amazon_gate: 'not_product' };
  }

  return { ok: true, error: null, amazon_gate: 'pass' };
}

export async function smokeUrl(url) {
  if (!url || !/^https:\/\//i.test(url)) {
    return { url: url || '', http_status: null, url_ok: false, error: 'missing_or_non_https', checked_at: isoDate() };
  }
  const checked_at = isoDate();
  const amazon = isAmazonUrl(url);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Amazon: always GET + read body (HEAD 200 on bot walls / soft-404s is a false pass).
    // Other hosts: HEAD first, fall back to GET.
    let res;
    let html = '';
    if (amazon) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-GB,en;q=0.9',
        },
      });
      html = await res.text();
    } else {
      res = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      });
      if (res.status === 405 || res.status === 403 || res.status === 501) {
        res = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          signal: controller.signal,
          headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
        });
        html = await res.text();
      }
    }
    clearTimeout(timer);

    const status = res.status;
    if (!(status >= 200 && status < 400)) {
      return { url, http_status: status, url_ok: false, error: `http_${status}`, checked_at };
    }

    if (amazon) {
      const gate = analyzeAmazonHtml(url, html);
      return {
        url,
        http_status: status,
        url_ok: gate.ok,
        error: gate.error,
        amazon_gate: gate.amazon_gate,
        checked_at,
      };
    }

    return { url, http_status: status, url_ok: true, error: null, checked_at };
  } catch (err) {
    return {
      url,
      http_status: null,
      url_ok: false,
      error: err?.name === 'AbortError' ? 'timeout' : String(err?.message || err),
      checked_at,
    };
  }
}

function collectUrls(doc) {
  const urls = new Map();
  const add = (u, role, rank, name) => {
    if (!u) return;
    if (!urls.has(u)) urls.set(u, []);
    urls.get(u).push({ role, rank, name });
  };
  for (const p of doc.top_picks || []) {
    add(p.product_url, 'top_pick', p.rank, p.product_name);
    for (const a of p.alternate_urls || []) add(a, 'top_pick_alt', p.rank, p.product_name);
  }
  for (const p of doc.longlist || []) {
    add(p.product_url, 'longlist', p.longlist_rank, p.product_name);
  }
  for (const p of doc.skips || []) {
    add(p.product_url, 'skip', null, p.product_name);
  }
  return urls;
}

export async function smokeDocument(doc, { concurrency = 4 } = {}) {
  const urlMap = collectUrls(doc);
  const entries = [...urlMap.keys()];
  const results = new Map();
  let i = 0;
  async function worker() {
    while (i < entries.length) {
      const idx = i++;
      const url = entries[idx];
      results.set(url, await smokeUrl(url));
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length || 1) }, () => worker()));
  return {
    checked_at: isoDate(),
    url_count: entries.length,
    ok_count: [...results.values()].filter((r) => r.url_ok).length,
    results: Object.fromEntries(results),
  };
}

function parseArgs(argv) {
  const files = [];
  let dir = '';
  for (const a of argv) {
    if (a.startsWith('--dir=')) dir = a.slice(6);
    else if (!a.startsWith('-')) files.push(a);
  }
  return { files, dir };
}

async function main() {
  const { files, dir } = parseArgs(process.argv.slice(2));
  const paths = [...files];
  if (dir) {
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith('.json') && name.startsWith('ember_picks_')) {
        paths.push(path.join(dir, name));
      }
    }
  }
  if (!paths.length) {
    console.error('Usage: node stage3-url-smoke.mjs <file.json> | --dir=<inbox>');
    process.exit(1);
  }
  const summary = [];
  for (const file of paths) {
    const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
    const smoke = await smokeDocument(doc);
    const outPath = file.replace(/\.json$/i, '.url_smoke.json');
    fs.writeFileSync(outPath, JSON.stringify(smoke, null, 2), 'utf8');
    summary.push({
      file: path.basename(file),
      url_count: smoke.url_count,
      ok_count: smoke.ok_count,
      fail_count: smoke.url_count - smoke.ok_count,
      report: outPath,
    });
  }
  console.log(JSON.stringify({ summary }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
