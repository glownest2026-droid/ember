/**
 * UK market gate for Stage 3 Pip's Picks.
 * Shared by FF checker + ingest. Fail closed: a UK parent must land on a
 * buyable UK-facing page in £ — never a US brand catalog with dollars.
 *
 * Canonical doc: web/docs/STAGE3_TRUST_GATES.md (UK market row)
 */

/** US / non-UK retail & brand catalogs that must never be primary CTAs. */
export const HARD_NON_UK_HOSTS = new Set([
  'manhattantoy.com',
  'kids2.com',
  'brightstarts.com',
  'amazon.com',
  'walmart.com',
  'target.com',
  'buybuybaby.com',
  'babylist.com',
  'kohls.com',
  'macys.com',
  'nordstrom.com',
  'toysrus.com',
  'babiesrus.com',
  'costco.com',
  'samsclub.com',
  'global.hape.com',
  'kidkraft.com',
  'bigamart.com',
]);

/**
 * Known UK-facing retailers / brand shops that sell in GBP to UK parents
 * even when the host is not *.co.uk. Keep this list tight — unknown .com fails closed.
 */
export const UK_FACING_HOSTS = new Set([
  // Major UK retail
  'boots.com',
  'johnlewis.com',
  'marksandspencer.com',
  'selfridges.com',
  'harrods.com',
  'mamasandpapas.com',
  'jojomamanbebe.com',
  'tesco.com',
  'asda.com',
  'waterstones.com',
  'notonthehighstreet.com',
  'ikea.com',
  'hamleys.com',
  'smythstoys.com',
  'dunelm.com',
  'sportsdirect.com',
  'moonpig.com',
  'very.com',
  'ocado.com',
  'waitrose.com',
  'morrisons.com',
  'halfords.com',
  'mothercare.com',
  'kiddicare.com',
  'theenterainer.com',
  'thetoyshop.com', // The Entertainer live storefront
  'decathlon.co.uk',
  'uk.bookshop.org',
  // Specialist / indie UK stockists commonly used in research
  'libertyhousetoys.com',
  'kiddies-kingdom.com',
  'poppydoggifts.com',
  'haliburtons.com',
  'forza.com',
  'phdsmart.com',
  'qttoyslondon.com',
  'kitchenplaytoys.co.uk',
  'vertbaudet.co.uk',
  'scandiborn.co.uk',
  'naturalbabyshower.co.uk',
  'adventuretoys.co.uk',
  'woodentoyshop.co.uk',
  'earlyyearsresources.co.uk',
  'tts-group.co.uk',
  'primaryict.co.uk',
  'halilit.co.uk',
  'mysmallworld.co.uk',
  'shopedx.co.uk',
  'thedyslexiashop.co.uk',
  'bigjigstoys.co.uk',
  'jaqueslondon.co.uk',
  'tickety-boo-toys.co.uk',
  'daisydaisydirect.co.uk',
  'toyrific.co.uk',
  'costway.co.uk',
  'sensoryeducation.co.uk',
  'robertdyas.co.uk',
  'ee-supplies.co.uk',
  'learningspace.co.uk',
  'createvisualaids.co.uk',
  'craftly.co.uk',
  'waylandgames.co.uk',
  'happy-returns.co.uk',
  'spcrtoys.co.uk',
  'totterandtumble.co.uk',
  'lovevery.co.uk',
  'gltc.co.uk',
  'learningresources.co.uk',
  'babybjorn.co.uk',
  'muslinz.co.uk',
  'snuz.co.uk',
  'obaby.co.uk',
  'pramworld.co.uk',
  'shop.scholastic.co.uk',
  'books4people.co.uk',
  'penguin.co.uk',
  'cuddleco.co.uk',
  'thelittlegreensheep.co.uk',
  'naturalmat.co.uk',
  'babymore.co.uk',
  'averyrow.co.uk',
  'adenandanais.co.uk',
  'pandalondon.com',
  'simbasleep.com',
  'priddybooks.com',
  'usborne.com',
  'barefootbooks.com',
  'priyaandpeanut.com',
  'gusandbeau.com',
  'playmobil.com',
  'galttoys.com',
  'donebydeer.com',
  'weegallery.com',
  'wee-gallery.com',
  'taftoys.com',
  'littledutch.com',
  'little-dutch.com',
  'yookidoo.com',
  'uk.yookidoo.com',
  'tutti-bambini.com',
  'silvercrossbaby.com',
  'cosatto.com',
  'joiebaby.com',
  'cybex-online.com',
  'nuna.eu',
  'ergobaby.com',
  'babybjorn.com',
  'maxi-cosi.com',
  'learningtowercompany.com',
  'hauck-toys.com',
  'icklebubba.com',
  'izmi.com',
  'liewood.com',
  'jollein.com',
  'clevamama.com',
  'sophielagirafe.com',
  'lamaze.com',
  'playgro.com',
  'infantino.com',
  'hahaland.com',
  'hape.com',
  'melissaanddoug.com',
  'learningresources.com',
  'boba.com',
  'tula.com',
  // Additional UK retail / UK-brand hosts found in pilot research
  'tuttibambini.com',
  'littlewoods.com',
  'hellobabydirect.com',
  'orchardtoys.com',
  'suck.uk.com',
  'sensorydirect.com',
  'baby-born.com',
  'thelittlesensorybox.com',
  'first-play.com',
  'm3csports.com',
  'cuddleco.com',
  'munchkin.co.uk',
  'smallkind.co.uk',
  'planethappytoys.co.uk',
  'samueljohnston.com',
  'nosycrow.com',
  'walker.co.uk',
  'lovereading4kids.co.uk',
  'mrbsemporium.com',
  'wordery.com',
  'hachette.co.uk',
  'babydan.co.uk',
  'gompels.co.uk',
  'rexlondon.com',
  'superdrug.com',
  'vitalbaby.com',
  'growingsmiles.co.uk',
]);

export function hostnameOf(url) {
  try {
    return new URL(String(url || ''))
      .hostname.replace(/^www\./, '')
      .toLowerCase();
  } catch {
    return '';
  }
}

export function isUsdOnlyPrice(priceText) {
  const t = String(priceText || '');
  if (!t.trim()) return false;
  const hasUsd = /\$|USD|US\$/i.test(t);
  const hasGbp = /£|GBP|about\s*£|~\s*£/i.test(t);
  return hasUsd && !hasGbp;
}

export function isSearchNotProductUrl(url) {
  const u = String(url || '');
  if (/google\.[^/]+\/search/i.test(u)) return true;
  // Retailer search / category browse stubs are not buyable product pages
  if (/[?&]q=/i.test(u) && /\/search(\/|\?|$)/i.test(u)) return true;
  if (/\/search\/\?q=/i.test(u)) return true;
  return false;
}

export function isAffiliateRedirectUrl(url) {
  return /nytimes\.com|wirecutter\/out\/link/i.test(String(url || ''));
}

/**
 * @param {string} url
 * @param {{ priceText?: string, requireUrl?: boolean }} [opts]
 * @returns {string[]} fail reason codes (empty = pass)
 */
export function ukMarketFailReasons(url, opts = {}) {
  const { priceText = '', requireUrl = true } = opts;
  const reasons = [];
  const raw = String(url || '').trim();

  if (!raw) {
    if (requireUrl) reasons.push('uk_market_missing_url');
    return reasons;
  }

  if (isSearchNotProductUrl(raw)) reasons.push('uk_market_search_not_product');
  if (isAffiliateRedirectUrl(raw)) reasons.push('uk_market_affiliate_redirect');
  if (isUsdOnlyPrice(priceText)) reasons.push('uk_market_usd_price');

  const host = hostnameOf(raw);
  if (!host) {
    reasons.push('uk_market_invalid_url');
    return reasons;
  }

  if (HARD_NON_UK_HOSTS.has(host) || [...HARD_NON_UK_HOSTS].some((h) => host.endsWith(`.${h}`))) {
    reasons.push(`uk_market_non_uk_host:${host}`);
  }

  if (host === 'amazon.com' || host.endsWith('.amazon.com')) {
    reasons.push('uk_market_amazon_us');
  }

  if (host.endsWith('.com.au') || host.endsWith('.ca') || host.endsWith('.com.au')) {
    reasons.push(`uk_market_foreign_tld:${host}`);
  }

  const ukTld =
    host.endsWith('.co.uk') ||
    host.endsWith('.org.uk') ||
    host.endsWith('.uk') ||
    host.includes('amazon.co.uk') ||
    host.startsWith('uk.');

  if (
    !reasons.length &&
    !ukTld &&
    !UK_FACING_HOSTS.has(host) &&
    (host.endsWith('.com') || host.endsWith('.net') || host.endsWith('.io') || host.endsWith('.shop'))
  ) {
    reasons.push(`uk_market_unlisted_host:${host}`);
  }

  return reasons;
}

export function assertUkMarketOrThrow(label, url, priceText) {
  const fails = ukMarketFailReasons(url, { priceText, requireUrl: true });
  if (fails.length) {
    throw new Error(`UK market gate failed for ${label}: ${fails.join(', ')} (${url || 'no-url'})`);
  }
}
