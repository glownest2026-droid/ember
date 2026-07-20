/**
 * Preview smoke test — Stage 3 Glass Stage anchor + card description space.
 *
 * Run: node agent-tools/scripts/test-stage3-preview-anchor.mjs
 * Optional: PREVIEW_URL=https://… node agent-tools/scripts/test-stage3-preview-anchor.mjs
 *
 * Deep-links into 1–3m muslins Pip's Picks (same card as founder screenshots).
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

/** 1–3m feeding cluster → muslins (has Stage 3 picks; matches founder screenshots). */
const DEEP =
  '/discover/2?wrapper=ent_cluster_feeding_clean_kit&show=1&category=005cd628-1a48-4136-b071-400e815ec071';

const VIEWPORT = { width: 360, height: 740 }; // Galaxy S8+

const EXPORT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../exports');

function fail(msg, extra) {
  console.error('FAIL:', msg);
  if (extra) console.error(extra);
  process.exitCode = 1;
}

async function main() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });

  try {
    const url = `${PREVIEW}${DEEP}`;
    console.log('GOTO', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });

    const heading = page.locator('#pips-picks-heading');
    await heading.waitFor({ state: 'visible', timeout: 45000 });
    // Allow picks fetch + one-shot scroll to settle.
    await page.waitForTimeout(2500);

    const metrics = await page.evaluate(() => {
      const h = document.getElementById('pips-picks-heading');
      const card = document.querySelector('[data-pips-card]');
      let descEl = null;
      let descText = '';
      if (card) {
        for (const p of card.querySelectorAll('p')) {
          const t = (p.textContent || '').trim();
          if (t.length > 40 && !/why pip|browse|of \d/i.test(t)) {
            descEl = p;
            descText = t;
            break;
          }
        }
      }
      const footer = Array.from(document.querySelectorAll('h2,h3,p')).find((el) =>
        /want to explore another area/i.test(el.textContent || '')
      );
      const hRect = h?.getBoundingClientRect();
      const dRect = descEl?.getBoundingClientRect();
      const drawer = Array.from(card?.querySelectorAll('button') || []).find((b) =>
        /why pip picked this/i.test(b.textContent || '')
      );
      const drawerRect = drawer?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      const browse = Array.from(card?.querySelectorAll('a') || []).find((a) =>
        /browse offers/i.test(a.textContent || '')
      );
      const browseRect = browse?.getBoundingClientRect();
      const gapDescToDrawer =
        drawerRect && dRect ? Math.round(drawerRect.top - dRect.bottom) : null;
      const gapBrowseToCardBottom =
        browseRect && cardRect ? Math.round(cardRect.bottom - browseRect.bottom) : null;
      let gapTextToDrawer = null;
      if (descEl && drawerRect) {
        const range = document.createRange();
        range.selectNodeContents(descEl);
        const textRect = range.getBoundingClientRect();
        gapTextToDrawer = Math.round(drawerRect.top - textRect.bottom);
      }
      const whyVisible = Array.from(document.querySelectorAll('button,a,h2,h3')).some((el) =>
        /\? Why these ideas/i.test(el.textContent || '')
      );
      return {
        headingTop: hRect ? Math.round(hRect.top) : null,
        headingText: (h?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        descLinesApprox: dRect ? Math.round(dRect.height / 20) : null,
        descHeight: dRect ? Math.round(dRect.height) : null,
        descText: descText.slice(0, 140),
        gapDescToDrawer,
        gapTextToDrawer,
        gapBrowseToCardBottom,
        cardHeight: cardRect ? Math.round(cardRect.height) : null,
        footerInView: footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false,
        whyTheseIdeasVisible: whyVisible,
        scrollY: Math.round(window.scrollY),
        innerHeight: window.innerHeight,
        href: location.href,
      };
    });

    await page.screenshot({
      path: path.join(EXPORT_DIR, 'stage3-preview-anchor-test.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(EXPORT_DIR, 'stage3-preview-anchor-full.png'),
      fullPage: true,
    });

    console.log('METRICS', JSON.stringify(metrics, null, 2));

    if (metrics.headingTop == null) {
      fail("Pip's Picks heading not found after deep link");
    } else if (metrics.headingTop < -20 || metrics.headingTop > 100) {
      fail(`Anchor miss: headingTop=${metrics.headingTop} (want ~0–80)`);
    } else {
      console.log('PASS anchor: heading near top');
    }

    if (metrics.footerInView) {
      fail('Anchor overshoot: "Want to explore another area?" is in the viewport');
    } else {
      console.log('PASS anchor: footer not in view');
    }

    if (metrics.whyTheseIdeasVisible) {
      fail('Underscroll: "? Why these ideas?" still visible above Pip\'s Picks');
    } else {
      console.log('PASS anchor: Why these ideas not visible');
    }

    // Space: text must sit close to the drawer (no hollow flex band inside the <p>).
    if (metrics.gapTextToDrawer != null && metrics.gapTextToDrawer > 28) {
      fail(`Space waste: gap text→drawer = ${metrics.gapTextToDrawer}px`);
    } else if (metrics.gapTextToDrawer != null) {
      console.log(`PASS space: gap text→drawer = ${metrics.gapTextToDrawer}px`);
    }

    if (metrics.gapDescToDrawer != null && metrics.gapDescToDrawer > 24) {
      fail(`Space waste: gap desc box→drawer = ${metrics.gapDescToDrawer}px`);
    } else if (metrics.gapDescToDrawer != null) {
      console.log(`PASS space: gap desc box→drawer = ${metrics.gapDescToDrawer}px`);
    }

    // Short blurbs may be 3–4 lines; long ones can use more. Fail only if mid-sentence
    // truncate smell + tiny height (legacy bug).
    if (
      metrics.descText &&
      /\b(Comes in a|perfect for)\s*$/i.test(metrics.descText.trim()) &&
      (metrics.descLinesApprox ?? 0) < 3
    ) {
      fail(`Description looks mid-truncated: (${metrics.descText})`);
    } else if (metrics.descLinesApprox != null) {
      console.log(`PASS space: description ~${metrics.descLinesApprox} lines`);
    }

    // Remaining empty below CTAs is OK on a viewport-tall glass card (content is
    // top-packed). The bug we care about is hollow space *above* the drawer.
    if (metrics.gapBrowseToCardBottom != null) {
      console.log(`INFO space: browse→card bottom = ${metrics.gapBrowseToCardBottom}px`);
    }
  } catch (err) {
    fail(String(err));
    await page
      .screenshot({ path: path.join(EXPORT_DIR, 'stage3-preview-error.png'), fullPage: true })
      .catch(() => {});
  } finally {
    await browser.close();
  }
}

main();
