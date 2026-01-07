import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const inputSvgPath = path.join(publicDir, 'icon.svg');

const outputs = [
  { filename: 'apple-touch-icon.png', size: 180 },
  { filename: 'icon-192.png', size: 192 },
  { filename: 'icon-512.png', size: 512 },
];

async function main() {
  const svg = await fs.readFile(inputSvgPath);

  await Promise.all(
    outputs.map(async ({ filename, size }) => {
      const resvg = new Resvg(svg, {
        fitTo: {
          mode: 'width',
          value: size,
        },
      });

      const rendered = resvg.render();
      const png = rendered.asPng();

      const outPath = path.join(publicDir, filename);
      await fs.writeFile(outPath, png);
      // eslint-disable-next-line no-console
      console.log(`Generated ${filename} (${size}x${size})`);
    })
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
