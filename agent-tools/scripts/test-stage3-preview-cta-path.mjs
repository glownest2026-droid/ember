/**
 * Preview smoke — Stage 3 anchor via founder click path (not deep-link).
 * Run: node agent-tools/scripts/test-stage3-preview-cta-path.mjs
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

const VIEWPORT = { width: 360, height: 740 };
const EXPORT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../exports');

function fail(msg) {
  console.error('FAIL:', msg);
  process.exitCode = 1;
}

async function metrics(page) {
  return page.evaluate(() => {
    const h = document.getElementById('pips-picks-heading');
    const footer = Array.from(document.querySelectorAll('h2,h3,p')).find((el) =>
      /want to explore another area/i.test(el.textContent || '')
    );
    const hRect = h?.getBoundingClientRect();
    return {
      headingTop: hRect ? Math.round(hRect.top) : null,
      headingText: (h?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      footerInView: footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false,
      scrollY: Math.round(window.scrollY),
      href: location.href,
    };
  });
}

async function main() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });

  try {
    // Land on Stage 2 for feeding cluster (no show=1 yet).
    const stage2 = `${PREVIEW}/discover/2?wrapper=ent_cluster_feeding_clean_kit`;
    console.log('GOTO', stage2);
    await page.goto(stage2, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(1500);

    // Click "See Our Picks" on Muslins card (same CTA founder uses).
    const cta = page.getByRole('button', { name: /See Our Picks|Ember Picks|Pip.?s Picks/i }).first();
    await cta.waitFor({ state: 'visible', timeout: 20000 });
    console.log('CLICK CTA');
    await cta.click();

    const heading = page.locator('#pips-picks-heading');
    await heading.waitFor({ state: 'visible', timeout: 45000 });

    // Sample scroll position over ~2.5s while layout settles (catches overshoot).
    const samples = [];
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(400);
      samples.push(await metrics(page));
    }

    await page.screenshot({
      path: path.join(EXPORT_DIR, 'stage3-preview-cta-path.png'),
      fullPage: false,
    });

    console.log('SAMPLES', JSON.stringify(samples, null, 2));
    const last = samples[samples.length - 1];
    const anyOvershoot = samples.some((s) => s.footerInView);
    const anyMiss = samples.some((s) => s.headingTop != null && (s.headingTop < -40 || s.headingTop > 140));

    if (anyOvershoot) fail('CTA path overshoot: footer entered viewport during settle');
    else console.log('PASS: no footer overshoot across samples');

    if (last.headingTop == null) fail('heading missing');
    else if (last.headingTop < -20 || last.headingTop > 100) {
      fail(`CTA path final headingTop=${last.headingTop} (want ~0–80)`);
    } else console.log(`PASS: final headingTop=${last.headingTop}`);

    if (anyMiss && !process.exitCode) {
      console.log('WARN: intermediate headingTop outside band (may be settle flicker)');
    }
  } catch (err) {
    fail(String(err));
    await page
      .screenshot({ path: path.join(EXPORT_DIR, 'stage3-preview-cta-error.png'), fullPage: true })
      .catch(() => {});
  } finally {
    await browser.close();
  }
}

main();
