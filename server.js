// Production server — bitta port, ikkala ilova.
//
//   /       -> frontend/build   (sayt, CRA)
//   /app    -> dist             (aniqlash ilovasi, Vite)
//
// Railway/Render kabi platformalar bitta servisga bitta port beradi,
// shuning uchun ikkala build shu yerdan tarqatiladi. Bu bir vaqtning
// o'zida iframe'ni same-origin qiladi va CORS muammosini yo'q qiladi.

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

const SITE = path.join(__dirname, 'frontend', 'build');
const APP = path.join(__dirname, 'dist');

for (const [name, dir] of [['sayt', SITE], ['ilova', APP]]) {
  if (!fs.existsSync(dir)) {
    console.error(`XATO: ${name} build topilmadi — ${dir}`);
    console.error('Avval "npm run build" ni bajaring.');
    process.exit(1);
  }
}

// ── Ilova: /app ──
app.use('/app', express.static(APP, { index: false, maxAge: '1y' }));
app.get(/^\/app(\/.*)?$/, (_req, res) => res.sendFile(path.join(APP, 'index.html')));

// ── Sayt: / ──
app.use(express.static(SITE, { index: false, maxAge: '1h' }));
app.get(/.*/, (_req, res) => res.sendFile(path.join(SITE, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Surdo AI ishga tushdi — port ${PORT}`);
  console.log('  sayt  : /');
  console.log('  ilova : /app');
});
