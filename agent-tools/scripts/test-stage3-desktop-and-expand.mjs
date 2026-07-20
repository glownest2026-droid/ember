/**
 * Verify desktop track height + expand pop-up Glass Stage on preview.
 * Run: node agent-tools/scripts/test-stage3-desktop-and-expand.mjs
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '../../web/package.json')
);
const { chromium } = require('playwright');

const PREVIEW =
  process.env.PREVIEW_URL ||
  'https://ember-git-feat-stage3-glass-stage-card-tims-projects-cd69a894.vercel.app';
const DEEP =
  '/discover/2?wrapper=ent_cluster_feeding_clean_kit&show=1&category=005cd628-1a48-4136-b071-400e815ec071';
const EXPORT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../exports');

function fail(msg) {
  console.error('FAIL:', msg);
  process.exitCode = 1;
}

async function main() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await desk.goto(`${PREVIEW}${DEEP}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await desk.locator('#pips-picks-heading').waitFor({ state: 'visible', timeout: 45000 });
    await desk.waitForTimeout(2000);

    const deskM = await desk.evaluate(() => {
      const heading = document.getElementById('pips-picks-heading');
      const shell = heading?.nextElementSibling;
      const card = document.querySelector('[data-pips-card]');
      const shellRect = shell?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      return {
        shellH: shellRect ? Math.round(shellRect.height) : null,
        cardH: cardRect ? Math.round(cardRect.height) : null,
        gapAbove: shellRect && cardRect ? Math.round(cardRect.top - shellRect.top) : null,
        gapBelow: shellRect && cardRect ? Math.round(shellRect.bottom - cardRect.bottom) : null,
      };
    });
    await desk.screenshot({ path: path.join(EXPORT_DIR, 'stage3-desktop-track.png'), fullPage: false });
    console.log('DESKTOP', JSON.stringify(deskM));

    if (deskM.shellH == null) fail('desktop track shell not found');
    else if (deskM.shellH > 620) fail(`desktop shell too tall: ${deskM.shellH}`);
    else console.log('PASS desktop shell height', deskM.shellH);

    if (deskM.gapAbove != null && deskM.gapAbove > 100) fail(`desktop gapAbove ${deskM.gapAbove}`);
    else console.log('PASS desktop gapAbove', deskM.gapAbove);

    const mob = await browser.newPage({ viewport: { width: 360, height: 740 } });
    await mob.goto(`${PREVIEW}${DEEP}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await mob.locator('#pips-picks-heading').waitFor({ state: 'visible', timeout: 45000 });
    await mob.waitForTimeout(1500);

    const expandBtn = mob.locator('[data-pips-card] button[aria-label*="Expand" i]').first();
    if (await expandBtn.count()) {
      await expandBtn.click({ timeout: 8000 });
    } else {
      // Thumb-row: Browse offers link, then expand, then save — expand is usually 2nd button.
      await mob.locator('[data-pips-card] button').nth(1).click({ timeout: 8000 });
    }
    await mob.waitForTimeout(900);

    const exp = await mob.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return { ok: false, reason: 'no dialog' };
      const article = dialog.querySelector('article');
      const cs = article ? getComputedStyle(article) : getComputedStyle(dialog);
      const dialogBg = getComputedStyle(dialog).backgroundColor;
      const cream = /251,\s*250,\s*247|fbfaf7/i.test(dialogBg);
      return {
        ok: true,
        hasRobin: !!dialog.querySelector('img[src*="Robin"]'),
        hasWhy: /why pip picked this/i.test(dialog.textContent || ''),
        creamBackdrop: cream,
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter || '',
        dialogBg,
      };
    });
    await mob.screenshot({ path: path.join(EXPORT_DIR, 'stage3-expand-glass.png'), fullPage: false });
    console.log('EXPAND', JSON.stringify(exp, null, 2));

    if (!exp.ok) fail(exp.reason || 'expand failed');
    else if (exp.creamBackdrop) fail('expand still has cream backdrop');
    else if (!exp.hasRobin) fail('expand missing corner robin');
    else if (!exp.hasWhy) fail('expand missing Why Pip drawer');
    else console.log('PASS expand glass stage');
  } finally {
    await browser.close();
  }
}

main();
