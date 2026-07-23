/**
 * Generates PWA icons from brand robin asset (local file or fetched URL).
 * Outputs solid-background, centred robin — no transparency (fixes Android white tile).
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 * Optional: PWA_ICON_SOURCE_URL=file:// or https://...
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DEFAULT_SOURCE =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';
const CANVAS_BG = '#FFFCF8';

async function loadSourceBuffer() {
  const url = process.env.PWA_ICON_SOURCE_URL || DEFAULT_SOURCE;
  if (url.startsWith('file:') || (!url.startsWith('http') && existsSync(url))) {
    const p = url.startsWith('file:') ? url.slice(7) : url;
    return readFileSync(p);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * @param {Buffer} sourcePng
 * @param {number} size - square edge
 * @param {number} robinMaxFrac - max(robin w,h) / size (maskable: smaller for safe zone)
 */
async function renderIcon(sourcePng, size, robinMaxFrac) {
  const trimmed = sharp(sourcePng).trim({ threshold: 24 });
  const trimmedBuf = await trimmed.png().toBuffer();
  const meta = await sharp(trimmedBuf).metadata();
  const rw = meta.width;
  const rh = meta.height;
  const maxRobin = Math.round(size * robinMaxFrac);
  const scale = Math.min(maxRobin / rw, maxRobin / rh);
  const newW = Math.max(1, Math.round(rw * scale));
  const newH = Math.max(1, Math.round(rh * scale));

  const robinPng = await sharp(trimmedBuf)
    .resize(newW, newH, { fit: 'inside' })
    .png()
    .toBuffer();

  const left = Math.round((size - newW) / 2);
  const top = Math.round((size - newH) / 2);

  const flat = await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: CANVAS_BG,
    },
  })
    .composite([{ input: robinPng, left, top }])
    .flatten({ background: CANVAS_BG })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return sharp(flat.data, {
    raw: { width: size, height: size, channels: 4 },
  })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const cwd = process.cwd();
  const iconsDir = join(cwd, 'public', 'icons');
  mkdirSync(iconsDir, { recursive: true });

  const source = await loadSourceBuffer();

  const maskable512 = await renderIcon(source, 512, 0.56);
  const any512 = await renderIcon(source, 512, 0.76);
  const any192 = await renderIcon(source, 192, 0.76);
  const apple180 = await renderIcon(source, 180, 0.76);

  writeFileSync(join(iconsDir, 'icon-512-maskable.png'), maskable512);
  writeFileSync(join(iconsDir, 'icon-512.png'), any512);
  writeFileSync(join(iconsDir, 'icon-192.png'), any192);
  writeFileSync(join(cwd, 'public', 'apple-touch-icon.png'), apple180);

  console.log('Wrote public/icons/icon-512-maskable.png, icon-512.png, icon-192.png');
  console.log('Wrote public/apple-touch-icon.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
