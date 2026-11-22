import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium } from 'playwright-core';

const PORT = 4399;
const OUTPUT = 'public/cv/johan-petrikovsky-cv-lead-frontend.pdf';
const DATA_FILES = ['src/features/cv/data/cv.ts', 'src/features/cv/data/publishable.ts', 'src/config/person.ts'];

const STATIC_DIR = '.vercel/output/static';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

const resolveFile = (urlPath) => {
  const file = join(STATIC_DIR, decodeURIComponent(urlPath.split('?')[0]));
  if (existsSync(file) && statSync(file).isDirectory()) return join(file, 'index.html');
  return file;
};

const server = createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(PORT, resolve));

try {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/cv/imprimer`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: OUTPUT, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
  await browser.close();

  const hash = createHash('sha256');
  DATA_FILES.forEach((f) => hash.update(readFileSync(f)));
  writeFileSync('public/cv/cv.meta.json', JSON.stringify({ dataHash: hash.digest('hex') }, null, 2) + '\n');
} finally {
  server.close();
}
