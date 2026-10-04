// Generates all PWA icons from a single 1024x1024 source PNG using sharp.
// Usage: node scripts/generate-icons.mjs <absolute-path-to-source-png>
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const source = process.argv[2];

if (!source) {
  console.error('Please pass the absolute path to the 1024x1024 source PNG.');
  process.exit(1);
}

// The source is full-bleed (background reaches every edge), so it is safe for
// both "any" and "maskable" purposes without extra padding.
const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'maskable-icon-192.png', size: 192 },
  { file: 'maskable-icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-32.png', size: 32 },
];

for (const t of targets) {
  await sharp(source)
    .resize(t.size, t.size, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, t.file));
  console.log(`wrote ${t.file} (${t.size}x${t.size})`);
}

console.log('Done.');
