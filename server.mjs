import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root = resolve(process.cwd());
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (path === '/' || ['/math','/vocabulary','/reading','/reading-tr','/social-stories'].includes(path) ? '/index.html' : path));
    if (!file.startsWith(root + sep) || path.split('/').some(p => p.startsWith('.')) || !['index.html','app.js','styles.css','bank.js','vocabulary.js','stories.js','engine.js','storage.js','icon.svg','manifest.webmanifest','sw.js'].includes(file.slice(root.length + 1))) { res.writeHead(404); res.end('Not found'); return; }
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log(`TarikApp is ready at http://127.0.0.1:${server.address().port}`));
