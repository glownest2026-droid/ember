#!/usr/bin/env node
/**
 * Preflight URL smoke for Stage 3 research — run BEFORE locking Top 5.
 * See web/docs/STAGE3_RESEARCH_METHODOLOGY.md § Pilot learnings.
 *
 * Usage:
 *   node agent-tools/scripts/stage3-url-preflight.mjs https://… https://…
 *   node agent-tools/scripts/stage3-url-preflight.mjs --file=urls.txt
 */
import fs from 'node:fs';
import { smokeUrl } from './stage3-url-smoke.mjs';

function parseArgs(argv) {
  const urls = [];
  let file = '';
  for (const a of argv) {
    if (a.startsWith('--file=')) file = a.slice('--file='.length);
    else if (!a.startsWith('-')) urls.push(a);
  }
  if (file) {
    const text = fs.readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const u = line.trim();
      if (u && !u.startsWith('#') && /^https:\/\//i.test(u)) urls.push(u);
    }
  }
  return [...new Set(urls)];
}

async function main() {
  const urls = parseArgs(process.argv.slice(2));
  if (!urls.length) {
    console.error('Usage: node stage3-url-preflight.mjs <url…> | --file=urls.txt');
    process.exit(1);
  }
  const results = [];
  for (const url of urls) {
    const r = await smokeUrl(url);
    results.push(r);
    const mark = r.url_ok ? 'OK ' : 'FAIL';
    console.log(`${mark} ${r.http_status ?? r.error}  ${url}`);
  }
  const ok = results.filter((r) => r.url_ok).length;
  console.log(JSON.stringify({ checked: results.length, ok, fail: results.length - ok }, null, 2));
  if (ok < results.length) process.exitCode = 2;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
