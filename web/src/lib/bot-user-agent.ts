/** Known crawlers/bots — used to skip expensive side effects (e.g. click logging), not to block redirects. */
const BOT_UA_PATTERN =
  /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|semrush|ahrefs|petalbot|headlesschrome|phantomjs/i;

export function isKnownBotUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.length < 3) return false;
  return BOT_UA_PATTERN.test(userAgent);
}
