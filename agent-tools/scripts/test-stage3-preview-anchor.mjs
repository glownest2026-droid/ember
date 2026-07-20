/**
 * Preview smoke test — Stage 3 Glass Stage anchor + card description space.
 * Run: pnpm -C web exec node ../agent-tools/scripts/test-stage3-preview-anchor.mjs
 */
import { chromium } from 'playwright';

const PREVIEW =
  process.env.PREVIEW_URL ||
  'https://ember-git-feat-stage3-glass-stage-card-tims-projects-cd69a894.vercel.app';

const VIEWPORT = { width: 360, height: 740 }; // Galaxy S8+

function fail(msg, extra) {
  console.error('FAIL:', msg);
  if (extra) console.error(extra);
  process.exitCode = 1;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });
  const logs = [];

  try {
    // 1–3m band has Stage 3 picks in production data.
    await page.goto(`${PREVIEW}/discover/2`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(1500);

    // Pick first Stage 1 cluster card if present.
    const cluster = page.locator('[data-discover-cluster], button, a').filter({ hasText: /I.?m |I'm /i }).first();
    if (await cluster.count()) {
      await cluster.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
    }

    // Click Ember Picks / See Pip's Picks CTA.
    const picksCta = page
      .locator('button, a')
      .filter({ hasText: /Pip.?s Picks|Ember Picks|See (the )?picks|Show picks/i })
      .first();
    if (!(await picksCta.count())) {
      // Fallback: open any Stage 2 product card that advertises picks.
      const anyPicks = page.locator('text=/Pip.?s Picks|Ember Picks/i').first();
      if (await anyPicks.count()) {
        await anyPicks.click({ timeout: 5000 });
      } else {
        fail('Could not find Ember/Pip\'s Picks CTA on /discover/2');
        await page.screenshot({ path: 'agent-tools/exports/stage3-preview-no-cta.png', fullPage: true });
        return;
      }
    } else {
      await picksCta.click({ timeout: 8000 });
    }

    // Wait for heading to mount (scroll waits for this too).
    const heading = page.locator('#pips-picks-heading');
    await heading.waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(900); // allow one-shot scroll settle

    const metrics = await page.evaluate(() => {
      const h = document.getElementById('pips-picks-heading');
      const card = document.querySelector('[data-pips-card]');
      const desc = card?.querySelector('p.flex-1, p[class*="desc"], p');
      // Find description by scanning card paragraphs for length
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
      const footer = Array.from(document.querySelectorAll('h3,h2')).find((el) =>
        /want to explore another area/i.test(el.textContent || '')
      );
      const hRect = h?.getBoundingClientRect();
      const dRect = descEl?.getBoundingClientRect();
      const drawer = Array.from(card?.querySelectorAll('button') || []).find((b) =>
        /why pip picked this/i.test(b.textContent || '')
      );
      const drawerRect = drawer?.getBoundingClientRect();
      const gap =
        drawerRect && dRect ? Math.round(drawerRect.top - dRect.bottom) : null;
      return {
        headingTop: hRect ? Math.round(hRect.top) : null,
        headingText: (h?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        descLinesApprox: dRect ? Math.round(dRect.height / 20) : null,
        descText: descText.slice(0, 120),
        gapDescToDrawer: gap,
        footerInView: footer ? footer.getBoundingClientRect().top < window.innerHeight : false,
        scrollY: Math.round(window.scrollY),
        href: location.href,
      };
    });

    logs.push(metrics);
    await page.screenshot({
      path: 'agent-tools/exports/stage3-preview-anchor-test.png',
      fullPage: false,
    });

    console.log('METRICS', JSON.stringify(metrics, null, 2));

    // Anchor: Pip's Picks heading near top (within ~80px), footer not in view.
    if (metrics.headingTop == null) {
      fail('Pip\'s Picks heading not found after CTA');
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

    // Space: description should use more than ~2 lines when card is tall;
    // gap between desc and drawer should be small (< 28px).
    if (metrics.gapDescToDrawer != null && metrics.gapDescToDrawer > 36) {
      fail(`Space waste: gap desc→drawer = ${metrics.gapDescToDrawer}px`);
    } else if (metrics.gapDescToDrawer != null) {
      console.log(`PASS space: gap desc→drawer = ${metrics.gapDescToDrawer}px`);
    }

    if (metrics.descLinesApprox != null && metrics.descLinesApprox < 3) {
      fail(`Description too short: ~${metrics.descLinesApprox} lines (${metrics.descText})`);
    } else if (metrics.descLinesApprox != null) {
      console.log(`PASS space: description ~${metrics.descLinesApprox} lines`);
    }
  } catch (err) {
    fail(String(err));
    await page.screenshot({ path: 'agent-tools/exports/stage3-preview-error.png', fullPage: true }).catch(() => {});
  } finally {
    await browser.close();
  }
}

main();
