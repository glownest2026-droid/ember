/**
 * One-off: compress large public/home PNGs to WebP (run from web/: node scripts/compress-home-images.mjs)
 */
import sharp from 'sharp';
import { stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const homeDir = path.join(__dirname, '..', 'public', 'home');

const targets = [
  { in: 'hero.png', out: 'hero.webp', width: 1200, quality: 82 },
  { in: 'stages.png', out: 'stages.webp', width: 1200, quality: 82 },
];

for (const { in: inputName, out: outputName, width, quality } of targets) {
  const inputPath = path.join(homeDir, inputName);
  const outputPath = path.join(homeDir, outputName);
  const before = (await stat(inputPath)).size;
  await sharp(inputPath).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(outputPath);
  const after = (await stat(outputPath)).size;
  console.log(`${inputName}: ${(before / 1024).toFixed(1)} KB -> ${outputName}: ${(after / 1024).toFixed(1)} KB`);
}
