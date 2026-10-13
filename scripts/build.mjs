import { mkdir, copyFile, rm } from 'node:fs/promises';
const assets = ['index.html', 'app.js', 'styles.css', 'bank.js', 'vocabulary.js', 'stories.js', 'more-stories.js', 'engine.js', 'storage.js', 'icon.svg', 'manifest.webmanifest', 'sw.js'];
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const asset of assets) await copyFile(asset, `dist/${asset}`);
console.log(`Built ${assets.length} assets in dist/`);
