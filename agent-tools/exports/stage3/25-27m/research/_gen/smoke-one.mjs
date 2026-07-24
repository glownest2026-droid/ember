import { smokeUrl } from '../../../../../scripts/stage3-url-smoke.mjs';
import { checkUrlAvailability } from '../../../../../scripts/stage3-availability-check.mjs';

const urls = process.argv.slice(2);
if (!urls.length) {
  console.error('pass urls');
  process.exit(1);
}

for (const u of urls) {
  const s = await smokeUrl(u);
  const a = await checkUrlAvailability(u);
  console.log(
    JSON.stringify({
      ok: s.ok,
      soft404: s.soft404,
      status: s.status,
      unavailable: a.unavailable,
      reason: a.reason || a.signal || null,
      url: u,
    }),
  );
}
