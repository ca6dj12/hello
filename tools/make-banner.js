#!/usr/bin/env node
/* =============================================================
   1층 X배너 (기본 600×1800mm) — 검은 바탕에 QR 하나. 무엇인지 다 말하지 않고 "바"라는 느낌만.
     cd tools && npm install
     node make-banner.js [https://홍보 사이트 주소] [--only a,b,c] [--dpi 150] [--size 600x1800]
     (크롬 경로를 직접 줄 때)  CHROME_PATH=/path/to/chrome node make-banner.js

   시안
     a  한 방울    위에서 잉크 한 줄기가 흘러내려 QR 위에 떨어진다. "오늘 밤, 어떤 죄를 삼키시겠습니까?"
     b  5층의 불빛  일곱 죄 포스터 벽 사진을 어둡게 깔고 그 아래 QR. "고백은, 5층에서"
     c  일곱 개의 표식  일곱 죄의 상징을 암호처럼 한 줄로. "당신의 죄는 5층에서 밝혀집니다"

   만드는 것 (print/xbanner/)
     xbanner-<시안>.png   인쇄용 그림 (기본 150dpi — 배너 인쇄에 보통 쓰는 해상도)
     xbanner-<시안>.pdf   위 그림을 실제 크기로 깐 PDF (인쇄소에 이걸 주면 됨)
     preview.png          세 시안 나란히 (확인용)

   QR 은 서 있는 사람 가슴 높이(바닥에서 약 1.2m)에 오도록 위에서 500mm 아래에 둔다.
   만든 뒤 그림에서 QR 을 실제로 해독해 주소가 맞는지 확인한다.
   ============================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { chromium } = require('playwright-core');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const url = (args.find((a) => /^https?:\/\//.test(a)) || 'https://deadly-sins-5f.vercel.app/').replace(/\/?$/, '/');
const ONLY = opt('only', 'a,b,c').split(',').map((s) => s.trim()).filter(Boolean);
const DPI = Number(opt('dpi', 150));
const [W, H] = opt('size', '600x1800').split('x').map(Number);

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'print', 'xbanner');
fs.mkdirSync(OUT, { recursive: true });

// 사이트의 그림들 (brand.js 에 경로가 있다)
global.window = {};
require(path.join(PUBLIC, 'brand.js'));
const BRAND = global.window.DS_BRAND;
const dataUri = (file, type) => 'data:' + type + ';base64,' + fs.readFileSync(file).toString('base64');
const webp = (rel) => dataUri(path.join(PUBLIC, rel), 'image/webp');
const SINS = ['교', '질', '분', '나', '탐', '식', '색'];
const floor = Number((fs.readFileSync(path.join(PUBLIC, 'data.js'), 'utf8').match(/floor:\s*(\d+)/) || [])[1]) || 5;

const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gelasio:wght@500;700&family=Noto+Sans+KR:wght@500;700;900&display=block">';

/* 잉크 한 줄기 (벡터). x=0 이 가운데, 위 끝 y=0, 방울 끝 y=len+44 (mm) */
function dripPath(len) {
  const l = len;
  return `M -3.4 0 L -3.4 ${l * .36} C -3.4 ${l * .39} -5.2 ${l * .41} -5.2 ${l * .44} C -5.2 ${l * .47} -3 ${l * .49} -3 ${l * .52}
    L -3 ${l} C -3 ${l + 9} -13.5 ${l + 19} -13.5 ${l + 30} C -13.5 ${l + 38.5} -7.4 ${l + 44} 0 ${l + 44} C 7.4 ${l + 44} 13.5 ${l + 38.5} 13.5 ${l + 30}
    C 13.5 ${l + 19} 3 ${l + 9} 3 ${l} L 3 ${l * .52} C 3 ${l * .49} 5.2 ${l * .47} 5.2 ${l * .44} C 5.2 ${l * .41} 3.4 ${l * .39} 3.4 ${l * .36} L 3.4 0 Z`;
}

function bannerHtml(v, qrSvg) {
  const QT = 500, TILE = 330, PAD = 24;   // QR 칸: 위에서 500mm, 330mm 정사각 (QR 자체는 약 280mm)
  const below = QT + TILE;
  const symbols = SINS.map((k) => `<img class="sym" data-crisp="alpha" src="${webp(BRAND.symbols[k])}" alt="">`).join('');
  const parts = {
    a: `
      <svg class="drip" viewBox="-15 0 30 ${QT - 20}" style="height:${QT - 20}mm"><path d="${dripPath(QT - 20 - 46)}" fill="#f7f5f3"/></svg>
      <p class="center scan" style="top:${below + 30}mm">SCAN</p>
      <p class="center line" style="top:${below + 110}mm">오늘 밤,<br>어떤 죄를 삼키시겠습니까?</p>
      <p class="center" style="top:${below + 290}mm"><span class="floor">${floor}F</span></p>
      <div class="foot" style="top:${H - 410}mm"><p class="name">Deadly Sins</p><p class="bar">COCKTAIL &amp; WHISKY BAR</p></div>`,
    b: `
      <div class="photo"><img src="${dataUri(path.join(ROOT, 'photos/room/sin-wall.jpg'), 'image/jpeg')}" alt=""></div>
      <p class="center bar" style="top:70mm">COCKTAIL &amp; WHISKY BAR</p>
      <p class="center scan" style="top:${below + 30}mm">SCAN</p>
      <p class="center line big" style="top:${below + 110}mm">고백은,<br>5층에서</p>
      <div class="foot" style="top:${H - 410}mm"><p class="name">Deadly Sins</p><p class="bar"><span class="floor sm">${floor}F</span></p></div>`,
    c: `
      <div class="foot" style="top:110mm"><p class="name">Deadly Sins</p></div>
      <div class="syms" style="top:300mm">${symbols}</div>
      <p class="center scan" style="top:${below + 30}mm">SCAN</p>
      <p class="center line" style="top:${below + 110}mm">당신의 죄는<br>5층에서 밝혀집니다</p>
      <p class="center" style="top:${below + 290}mm"><span class="floor">${floor}F</span></p>
      <p class="center bar" style="top:${H - 330}mm">COCKTAIL &amp; WHISKY BAR</p>`
  };
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">${FONTS}
<style>
 *{margin:0;padding:0;box-sizing:border-box}
 html,body{background:#000}
 .b{position:relative;width:${W}mm;height:${H}mm;overflow:hidden;background:#000;color:#f7f5f3}
 .center{position:absolute;left:0;right:0;text-align:center}
 .qr{position:absolute;z-index:2;left:50%;top:${QT}mm;width:${TILE}mm;height:${TILE}mm;margin-left:-${TILE / 2}mm;padding:${PAD}mm;background:#fff;border-radius:${TILE * .055}mm;
     box-shadow:0 0 0 2.2mm #000,0 0 0 3.6mm rgba(200,74,80,.9)}
 .qr svg{display:block;width:100%;height:100%}
 .scan{font:500 13mm/1 'Gelasio',Georgia,serif;letter-spacing:.6em;text-indent:.6em;color:rgba(247,245,243,.5)}
 .line{font:900 36mm/1.42 'Noto Sans KR',sans-serif;letter-spacing:-.05em}
 .line.big{font-size:52mm;line-height:1.3}
 .floor{display:inline-block;padding:7mm 13mm 5mm;border:2.2mm solid #c84a50;border-radius:5mm;background:rgba(200,74,80,.18);
        font:700 46mm/1 'Gelasio',Georgia,serif;letter-spacing:.05em}
 .floor.sm{font-size:26mm;padding:5mm 9mm 3.5mm;border-width:1.6mm;letter-spacing:.08em}
 .bar{font:500 13mm/1 'Gelasio',Georgia,serif;letter-spacing:.42em;text-indent:.42em;color:rgba(247,245,243,.62)}
 .foot{position:absolute;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:22mm}
 .name{font:700 ${W * .1}mm/1 'Gelasio',Georgia,serif;letter-spacing:-.01em}   /* 워드마크 그림은 작아서 배너 크기로 키우면 뭉개짐 → 같은 계열 글꼴로 */
 .drip{position:absolute;left:50%;top:0;width:30mm;margin-left:-15mm}
 .photo{position:absolute;left:0;top:0;width:100%;height:${QT + 140}mm;overflow:hidden}
 .photo img{width:100%;height:100%;object-fit:cover;object-position:50% 30%;filter:brightness(.5) saturate(.85) contrast(1.05)}
 .photo::after{content:'';position:absolute;inset:0;
   background:radial-gradient(ellipse 85% 70% at 50% 32%,transparent 30%,rgba(0,0,0,.75) 100%),linear-gradient(transparent 45%,#000 96%)}
 .syms{position:absolute;left:0;right:0;display:flex;justify-content:center;gap:15mm}
 .sym{width:56mm;height:56mm;object-fit:contain;opacity:.92}
</style></head>
<body><div class="b v-${v}">
 ${parts[v]}
 <div class="qr">${qrSvg}</div>
</div>
<script>
 // 작은 원본 그림(일곱 상징)을 크게 뽑아도 가장자리가 뭉개지지 않게: 크게 늘려 살짝 흐린 뒤 경계를 다시 세운다
 async function crisp(img) {
   await img.decode();
   const s = 6, w = img.naturalWidth * s, h = img.naturalHeight * s;
   const c = document.createElement('canvas'); c.width = w; c.height = h;
   const g = c.getContext('2d');
   g.imageSmoothingQuality = 'high'; g.filter = 'blur(' + (s * .45) + 'px)';
   g.drawImage(img, 0, 0, w, h);
   const d = g.getImageData(0, 0, w, h), p = d.data;
   for (let i = 0; i < p.length; i += 4) {
     const a = Math.max(0, Math.min(255, (p[i + 3] - 110) * 6));
     p[i] = 247; p[i + 1] = 245; p[i + 2] = 243; p[i + 3] = a;
   }
   g.putImageData(d, 0, 0);
   img.src = c.toDataURL('image/png');
   await img.decode();
 }
 Promise.all([...document.querySelectorAll('img[data-crisp]')].map(crisp)).then(() => document.body.dataset.ready = '1');
</script></body></html>`;
}

function decode(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  // 큰 그림은 줄여서 읽어도 된다 (QR 은 커서 충분)
  const r = jsQR(new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.length), png.width, png.height);
  return r && r.data;
}

(async () => {
  const qrSvg = (await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })).replace(/<\?xml[^>]*>/, '');
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const pxW = Math.round(W / 25.4 * 96), pxH = Math.round(H / 25.4 * 96);
  const made = [];
  try {
    for (const v of ONLY) {
      const htmlFile = path.join(OUT, 'xbanner-' + v + '.html');
      fs.writeFileSync(htmlFile, bannerHtml(v, qrSvg));
      const ctx = await browser.newContext({ viewport: { width: pxW, height: pxH }, deviceScaleFactor: DPI / 96 });
      const page = await ctx.newPage();
      await page.goto('file://' + htmlFile, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForSelector('body[data-ready="1"]');
      const fontsOk = await page.evaluate(() => document.fonts.check('900 16px "Noto Sans KR"') && document.fonts.check('500 16px Gelasio'));
      if (!fontsOk) console.warn('주의: 웹폰트를 못 받아서 기본 글꼴로 그렸습니다 (인터넷 연결 확인).');
      const pngFile = path.join(OUT, 'xbanner-' + v + '.png');
      await page.screenshot({ path: pngFile, clip: { x: 0, y: 0, width: pxW, height: pxH } });
      await ctx.close();
      fs.unlinkSync(htmlFile);   // 그림이 통째로 들어 있는 중간 파일이라 남기지 않는다
      // PDF: 크롬이 한글 웹폰트를 PDF 에 직접 넣으면 굵기가 섞여 나오므로 그림을 실제 크기로 깐다 (make-qr.js 와 같은 방식)
      const pdfCtx = await browser.newContext();
      const pdfPage = await pdfCtx.newPage();
      await pdfPage.setContent(`<!doctype html><style>@page{size:${W}mm ${H}mm;margin:0}*{margin:0}img{display:block;width:${W}mm;height:${H}mm}</style>
        <img src="${dataUri(pngFile, 'image/png')}">`, { waitUntil: 'load' });
      await pdfPage.pdf({ path: path.join(OUT, 'xbanner-' + v + '.pdf'), width: W + 'mm', height: H + 'mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      await pdfCtx.close();
      const got = decode(pngFile);
      console.log('시안 ' + v + ': ' + path.relative(ROOT, pngFile) + ' · QR 해독 ' + (got === url ? '✓' : '✗ ' + got));
      if (got !== url) process.exitCode = 1;
      made.push(pngFile);
    }
    // 세 시안 나란히 (확인용, 작게)
    if (made.length > 1) {
      const ctx = await browser.newContext({ viewport: { width: 400 * made.length + 40 * (made.length + 1), height: 1300 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.setContent(`<!doctype html><body style="margin:0;background:#2b2b2b;display:flex;gap:40px;padding:40px;font:700 22px sans-serif;color:#ddd">` +
        made.map((f) => `<figure style="margin:0;width:400px"><img src="${dataUri(f, 'image/png')}" style="width:400px;height:1200px;display:block"><figcaption style="margin-top:12px;text-align:center">${path.basename(f, '.png').slice(-1).toUpperCase()}</figcaption></figure>`).join('') + '</body>', { waitUntil: 'load' });
      await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true });
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  console.log('주소: ' + url + ' · ' + W + '×' + H + 'mm · ' + DPI + 'dpi');
})();
