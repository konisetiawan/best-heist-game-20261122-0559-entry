// Capture 4 real screenshots of The Velvet Vault with Playwright Chromium.
// Serves game/ over a local HTTP server (ES modules need HTTP, not file://).
// Session A: cover (level 1 mid-room) + alarm (stand in a guard's cone).
// Session B: play through level 1 -> level 2 lockpick (vault) -> level 3 -> final victory.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, 'game');
const OUT = path.join(__dirname, 'screenshots');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function serve() {
  const server = http.createServer((req, res) => {
    const p = path.join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(p) || !fs.statSync(p).isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, type: 'jpeg', quality: 82 });
  console.log(name + ': ' + fs.statSync(file).size + ' bytes');
}

async function key(page, k, ms) {
  await page.keyboard.down(k);
  await page.waitForTimeout(ms);
  await page.keyboard.up(k);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch();

  // ---- Session A: cover + alarm ----
  let page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  await page.waitForTimeout(800);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2200); // intro done
  await key(page, 'd', 1500); // thief mid-room
  await shot(page, '1-cover.jpg');
  await key(page, 'd', 1000); // walk into guard 1's patrol, then stand still and get spotted
  await page.waitForTimeout(6000);
  await shot(page, '3-alarm.jpg');
  await page.close();

  // ---- Session B: vault + victory ----
  page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  await page.waitForTimeout(800);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2200);
  // level 1: run right, grab loot, reach exit
  await key(page, 'd', 6000);
  await key(page, 'd', 600);
  await page.waitForTimeout(600); // clear screen
  await page.keyboard.press('Enter'); // continue to level 2
  await page.waitForTimeout(2200); // level 2 intro
  // level 2: run right to the vault wall, dip down through the gap, step to the safe, pick
  await key(page, 'd', 4900);
  await key(page, 's', 150);
  await key(page, 'd', 600);
  await key(page, 'w', 150);
  await page.waitForTimeout(1500); // pick ring half-filled
  await shot(page, '2-vault.jpg');
  await page.waitForTimeout(2000); // pick finishes, loot taken
  await key(page, 'd', 1200); // to the exit
  await page.waitForTimeout(600); // clear screen
  await page.keyboard.press('Enter'); // continue to level 3
  await page.waitForTimeout(2200); // level 3 intro
  // level 3: run right, grab moonstone, reach exit
  await key(page, 'd', 6000);
  await key(page, 'd', 600);
  await page.waitForTimeout(800); // final victory screen
  await shot(page, '4-victory.jpg');
  await page.close();

  await browser.close();
  server.close();
}
main().catch(e => { console.error(e); process.exit(1); });
