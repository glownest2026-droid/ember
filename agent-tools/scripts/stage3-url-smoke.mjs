#!/usr/bin/env node
/**
 * Batch HTTP status check for Stage 3 product URLs.
 * Never guess — records url_ok from real responses.
 *
 * Usage:
 *   node agent-tools/scripts/stage3-url-smoke.mjs path/to/file.json
 *   node agent-tools/scripts/stage3-url-smoke.mjs --dir=agent-tools/exports/stage3/34-36m/research/inbox
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TIMEOUT_MS = 12000;
const USER_AGENT =
  'Mozilla/5.0 (compatible; EmberStage3UrlSmoke/1.0; +https://github.com/glownest2026-droid/ember)';

export async function smokeUrl(url) {
  if (!url || !/^https:\/\//i.test(url)) {
    return { url: url || '', http_status: null, url_ok: false, error: 'missing_or_non_https', checked_at: isoDate() };
  }
  const checked_at = isoDate();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
    });
    // Some retailers reject HEAD — retry GET
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
      });
    }
    clearTimeout(timer);
    const status = res.status;
    const url_ok = status >= 200 && status < 400;
    return { url, http_status: status, url_ok, error: url_ok ? null : `http_${status}`, checked_at };
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

function isoDate() {
  return new Date().toISOString().slice(0, 10);
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

export async function smokeDocument(doc, { concurrency = 6 } = {}) {
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
  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, () => worker()));
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
