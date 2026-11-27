// dist/ içindeki HTML/JS dosyalarındaki yerel href/src bağlantılarının
// yayında karşılığı olduğunu doğrular (Pages uzantısız adresleri .html'e çözer).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || 'dist';
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|js)$/.test(name)) files.push(p);
  }
})(root);

function resolves(url) {
  const path = decodeURI(url.split(/[?#]/)[0]);
  if (path === '/' ) return existsSync(join(root, 'index.html'));
  const base = join(root, path);
  return (
    (existsSync(base) && statSync(base).isFile()) ||
    existsSync(base + '.html') ||
    existsSync(join(base, 'index.html'))
  );
}

const missing = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const [, url] of text.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith('//') || url.includes('${')) continue;
    if (url.startsWith('/api/')) continue; // Worker route
    if (!resolves(url)) missing.push(`${f}: ${url}`);
  }
}

if (!existsSync(join(root, 'index.html'))) missing.push('index.html yok');
if (existsSync(join(root, 'package.json')) || existsSync(join(root, 'worker'))) {
  missing.push('kaynak dosyalar dist/ içine sızmış');
}

if (missing.length) {
  console.error('Kırık bağlantılar / sorunlar:\n' + missing.join('\n'));
  process.exit(1);
}
console.log(`${files.length} dosya kontrol edildi, kırık yerel bağlantı yok.`);
