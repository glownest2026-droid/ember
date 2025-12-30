// Simple script to generate placeholder PWA icons
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';

const sizes = [192, 512, 180]; // 180 for apple-touch-icon
const primaryColor = '#FFBEAB';
const accentColor = '#FFE5D7';
const backgroundColor = '#FFFCF8';

async function generateIcon(size) {
  // Create a simple gradient background with "E" letter
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size * 0.2}"/>
      <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="url(#grad)" text-anchor="middle" dominant-baseline="central">E</text>
    </svg>
  `;

  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return pngBuffer;
}

async function main() {
  const publicDir = join(process.cwd(), 'public');

  for (const size of sizes) {
    const buffer = await generateIcon(size);
    const filename = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
    const filepath = join(publicDir, filename);
    writeFileSync(filepath, buffer);
    console.log(`Generated ${filename}`);
  }
}

main().catch(console.error);
