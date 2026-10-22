#!/usr/bin/env node
/* =============================================================
   인쇄물 + 공유 미리보기 이미지 만들기
     cd tools && npm install
     node make-qr.js https://<배포주소>
     node make-qr.js https://<배포주소> --menu     ← 메뉴판 전용 (주소 끝에 #menu, 메뉴판이 바로 열림)
     (크롬 경로를 직접 줄 때)  CHROME_PATH=/path/to/chrome node make-qr.js https://…

   만드는 것
     print/deadly-sins-qr.svg          QR 원본 (벡터)
     print/deadly-sins-qr.png          QR 1200×1200
     print/card.html                   테이블 카드 원본 (A6)
     print/deadly-sins-table-card.pdf  인쇄소용
     print/deadly-sins-table-card.png  카드 이미지본
     public/og.jpg                     카톡·인스타 링크 미리보기 (1200×630)

   --menu 일 때는 같은 디자인으로 메뉴판 카드를 만든다 (링크 미리보기는 그대로 둠)
     print/menu-qr.svg · print/menu-qr.png · print/menu-card.html
     print/deadly-sins-menu-card.pdf · print/deadly-sins-menu-card.png

   카드와 미리보기는 사이트 첫 화면 그림을 그대로 씁니다.
   그림의 위는 순백, 아래는 순흑이고 경계가 748px 줄에서 곧게 떨어지므로,
   그림을 줄여 놓고 바탕을 같은 높이에서 흰색/검은색으로 나누면 이음매 없이 이어집니다.
   만든 뒤 카드 PNG 에서 QR 을 실제로 해독해서 주소가 맞는지 확인합니다.
   ============================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { chromium } = require('playwright-core');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

const MENU = process.argv.includes('--menu');
let url = process.argv.slice(2).find((a) => /^https?:\/\//.test(a));
if (MENU && url && !/#menu$/.test(url)) url = url.replace(/\/?$/, '/') + '#menu';
if (!url) {
  console.error('주소를 넣어주세요.  예)  node make-qr.js https://deadly-sins.vercel.app');
  process.exit(1);
}
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'print');
const PUBLIC = path.join(ROOT, 'public');
fs.mkdirSync(OUT, { recursive: true });

/* 사이트에서 첫 화면 그림과 가격을 읽는다 (빌드된 public/index.html 기준) */
const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
const coverSrc = (html.match(/<img class="cover-art" src="([^"]+)"/) || [])[1];
if (!coverSrc) { console.error('public/index.html 에서 표지 그림을 못 찾음. 먼저 tools/build.py 를 실행하세요.'); process.exit(1); }
const cover = 'data:image/webp;base64,' + fs.readFileSync(path.join(PUBLIC, coverSrc)).toString('base64');
const price = Number((fs.readFileSync(path.join(PUBLIC, 'data.js'), 'utf8').match(/signaturePrice:\s*(\d+)/) || [])[1]);
if (!price) { console.error('public/data.js 에서 signaturePrice 를 못 찾음'); process.exit(1); }
const priceText = price.toLocaleString('ko-KR');

/* 카드 문구와 파일 이름: 기본(퀴즈) / 메뉴판 */
const KIND = MENU ? {
  title: '메뉴판 카드', kicker: 'WHISKY · COCKTAILS · BITES',
  cta: 'QR을 찍으면 메뉴판이 열려요', sub: '이름을 누르면 사진과 설명이 나와요', en: 'OPEN THE MENU',
  qr: 'menu-qr', html: 'menu-card.html', card: 'deadly-sins-menu-card'
} : {
  title: '테이블 카드', kicker: 'SEVEN QUESTIONS · SEVEN GLASSES',
  cta: 'QR을 찍고, 당신의 죄를 찾으세요', sub: '일곱 개의 잔 · 각 ' + priceText + '원', en: 'FIND YOUR SIN',
  qr: 'deadly-sins-qr', html: 'card.html', card: 'deadly-sins-table-card'
};

/* 표지 그림의 기준점 (원본 1024×1536 px) */
const ART = { w: 1024, h: 1536, horizon: 748 };

const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gelasio:wght@500;700&family=Noto+Sans+KR:wght@500;700;900&display=block">';

function cardHtml(qrSvg) {
  // A6 105×148mm. 그림 폭 88mm, 경계선은 위에서 40mm.
  const W = 88, HORIZON = 40, s = W / ART.w, top = HORIZON - ART.horizon * s;
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<title>DEADLY SINS — ${KIND.title}</title>
${FONTS}
<style>
 @page{size:105mm 148mm;margin:0}
 *{margin:0;padding:0;box-sizing:border-box}
 html,body{background:#3a3a3a}
 body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
 .card{
   width:105mm;height:148mm;position:relative;overflow:hidden;
   background:linear-gradient(#fff 0 ${HORIZON}mm,#000 ${HORIZON}mm);
   -webkit-print-color-adjust:exact;print-color-adjust:exact;
 }
 .art{position:absolute;width:105mm;left:0;top:${top.toFixed(2)}mm}
 .kicker{
   position:absolute;top:7.2mm;left:0;right:0;text-align:center;
   font:500 2.5mm/1 'Gelasio',Georgia,serif;letter-spacing:.42em;text-indent:.42em;color:#000;
 }
 .bottom{position:absolute;top:80mm;left:0;right:0;display:flex;flex-direction:column;align-items:center}
 .qr{background:#fff;padding:3mm;border-radius:2.2mm;line-height:0}
 .qr svg{width:30mm;height:30mm;display:block;shape-rendering:crispEdges}
 .cta{margin-top:5mm;font:900 4.1mm/1.3 'Noto Sans KR',sans-serif;letter-spacing:-.04em;color:#f7f5f3}
 .price{margin-top:2.2mm;font:700 2.7mm/1 'Noto Sans KR',sans-serif;letter-spacing:.08em;color:#c84a50}
 .en{margin-top:2.6mm;font:500 2.2mm/1 'Gelasio',Georgia,serif;letter-spacing:.3em;text-indent:.3em;color:rgba(247,245,243,.45)}
 @media print{html,body{background:none}body{padding:0;min-height:0;display:block}}
</style></head><body>
<div class="card">
  <canvas class="art" width="${Math.round(ART.w * 105 / W)}" height="${ART.h}" aria-label="Deadly Sins"></canvas>
  <p class="kicker">${KIND.kicker}</p>
  <div class="bottom">
    <div class="qr">${qrSvg}</div>
    <p class="cta">${KIND.cta}</p>
    <p class="price">${KIND.sub}</p>
    <p class="en">${KIND.en}</p>
  </div>
</div>
<script>
/* 그림 좌우를 같은 흰색/검은색으로 넓혀 카드 폭을 채운다 (그림과 바탕 사이 이음매가 생기지 않게) */
const img = new Image();
img.onload = () => {
  const c = document.querySelector('canvas.art'), x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, ${ART.horizon});
  x.fillStyle = '#000'; x.fillRect(0, ${ART.horizon}, c.width, c.height - ${ART.horizon});
  x.drawImage(img, (c.width - img.width) / 2, 0);
  document.body.dataset.ready = '1';
};
img.src = '${cover}';
</script>
</body></html>`;
}

function ogHtml() {
  // 1200×630. 그림 배율 0.62, 경계선 y=300. 왼쪽에 로고, 오른쪽에 글.
  const s = 0.62, HORIZON = 300, top = HORIZON - ART.horizon * s;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">${FONTS}
<style>
 *{margin:0;padding:0;box-sizing:border-box}
 body{width:1200px;height:630px;overflow:hidden;position:relative;background:linear-gradient(#fff 0 ${HORIZON}px,#000 ${HORIZON}px)}
 .art{position:absolute;width:${ART.w * s}px;left:10px;top:${top}px}
 .kicker{position:absolute;left:660px;top:228px;font:500 19px/1 'Gelasio',Georgia,serif;letter-spacing:.36em;color:#000}
 h1{position:absolute;left:656px;top:352px;font:900 58px/1.28 'Noto Sans KR',sans-serif;letter-spacing:-.055em;color:#f7f5f3}
 .sub{position:absolute;left:660px;top:530px;font:700 20px/1 'Noto Sans KR',sans-serif;letter-spacing:.06em;color:#c84a50}
</style></head><body>
<img class="art" src="${cover}" alt="">
<p class="kicker">SEVEN QUESTIONS<br><br>SEVEN GLASSES</p>
<h1>당신의 욕망을<br>채워주세요</h1>
<p class="sub">일곱 개의 질문 · 일곱 개의 잔</p>
</body></html>`;
}

function decode(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return r ? r.data : null;
}

(async () => {
  const qrSvg = await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } });
  fs.writeFileSync(path.join(OUT, KIND.qr + '.svg'), qrSvg);
  await QRCode.toFile(path.join(OUT, KIND.qr + '.png'), url, { width: 1200, margin: 4, errorCorrectionLevel: 'M' });
  fs.writeFileSync(path.join(OUT, KIND.html), cardHtml(qrSvg.replace(/<\?xml[^>]*>/, '')));

  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  try {
    // 카드: PNG(약 600dpi 상당) + PDF
    const ctx = await browser.newContext({ viewport: { width: 520, height: 700 }, deviceScaleFactor: 6, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(OUT, KIND.html), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('body[data-ready="1"]');
    const fontsOk = await page.evaluate(() => document.fonts.check('900 16px "Noto Sans KR"') && document.fonts.check('500 16px Gelasio'));
    if (!fontsOk) console.warn('주의: 웹폰트를 못 받아서 기본 글꼴로 그렸습니다 (인터넷 연결 확인).');
    // 카드 폭(105mm)이 정수 픽셀이 아니라 가장자리에 바탕색 실선이 끼므로 안쪽으로 반올림해서 자른다
    const b = await page.locator('.card').boundingBox();
    const x = Math.ceil(b.x), y = Math.ceil(b.y);
    await page.screenshot({ path: path.join(OUT, KIND.card + '.png'),
      clip: { x, y, width: Math.floor(b.x + b.width) - x, height: Math.floor(b.y + b.height) - y } });
    await ctx.close();

    // PDF: 크롬이 한글 웹폰트를 PDF 에 넣으면 글자마다 굵기가 섞여 나오는 문제가 있어서,
    // 위 PNG(약 575dpi)를 한 장 그대로 깐 PDF 로 만든다. 인쇄 품질엔 충분하다.
    const pdfCtx = await browser.newContext();
    const pdfPage = await pdfCtx.newPage();
    const png = fs.readFileSync(path.join(OUT, KIND.card + '.png')).toString('base64');
    await pdfPage.setContent(`<!doctype html><style>@page{size:105mm 148mm;margin:0}*{margin:0}
      img{display:block;width:105mm;height:148mm}</style><img src="data:image/png;base64,${png}">`, { waitUntil: 'load' });
    await pdfPage.pdf({ path: path.join(OUT, KIND.card + '.pdf'), width: '105mm', height: '148mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    await pdfCtx.close();

    // 링크 미리보기 (메뉴판 카드를 만들 때는 건드리지 않는다)
    if (!MENU) {
    const og = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
    const p2 = await og.newPage();
    await p2.setContent(ogHtml(), { waitUntil: 'networkidle' });
    await p2.evaluate(() => document.fonts.ready);
    await p2.screenshot({ path: path.join(PUBLIC, 'og.jpg'), type: 'jpeg', quality: 82 });
    await og.close();
    }
  } finally {
    await browser.close();
  }

  const read = decode(path.join(OUT, KIND.card + '.png'));
  const readQr = decode(path.join(OUT, KIND.qr + '.png'));
  console.log('만들었습니다 →', url);
  [KIND.qr + '.svg', KIND.qr + '.png', KIND.html, KIND.card + '.pdf', KIND.card + '.png']
    .forEach((f) => console.log('  print/' + f));
  if (!MENU) console.log('  public/og.jpg');
  console.log(`QR 해독: 카드 ${read === url ? '✓' : '✗ (' + read + ')'} · QR PNG ${readQr === url ? '✓' : '✗ (' + readQr + ')'}`);
  if (read !== url || readQr !== url) process.exitCode = 1;
})().catch((e) => { console.error(e); process.exit(1); });
