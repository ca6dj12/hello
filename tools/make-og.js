#!/usr/bin/env node
/* =============================================================
   링크 미리보기 이미지 만들기 (카카오톡/문자로 공유할 때 뜨는 그림)
     cd tools && npm install
     node make-og.js
   결과: public/og.jpg (600x315)
   ※ playwright-core 와 크로미움이 있는 환경에서만 동작합니다.
     없으면 public/og.jpg 를 그대로 두면 됩니다.
   ============================================================= */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const PUB = path.join(__dirname, '..', 'public');
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/* 벽면 도형 일곱 개를 app.js / data.js 에서 그대로 가져온다 */
const app = fs.readFileSync(path.join(PUB, 'app.js'), 'utf8');
const shapes = app.slice(app.indexOf('var SHAPES'), app.indexOf('/* ---------- 잔'));
const data = fs.readFileSync(path.join(PUB, 'data.js'), 'utf8');
const marks = new Function(data + shapes +
  '; return SIN_ORDER.map(function(k){return inkShape(SINS[k].shape,"");}).join("");')();

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Noto+Serif+KR:wght@300;400&display=swap">
<style>
 *{margin:0;padding:0;box-sizing:border-box}
 body{width:1200px;height:630px;background:#060607;color:#eae6de;
  font-family:'Cormorant Garamond','Noto Serif KR',serif;overflow:hidden;position:relative;
  display:flex;flex-direction:column;align-items:center;justify-content:center}
 .glow{position:absolute;inset:0;background:radial-gradient(70% 55% at 50% -6%,rgba(200,164,106,.22),transparent 62%)}
 .frame{position:absolute;inset:30px;border:1px solid rgba(200,164,106,.32)}
 .mark{font-size:19px;letter-spacing:.5em;color:#b6b1a8;text-indent:.5em;z-index:2}
 .shapes{display:flex;gap:20px;align-items:flex-end;margin:28px 0 30px;z-index:2}
 .shapes svg{width:32px;color:#eae6de;opacity:.32}
 .shapes svg:nth-child(4){opacity:1;color:#c8a46a}
 h1{font-family:'Noto Serif KR',serif;font-weight:300;font-size:54px;line-height:1.45;text-align:center;z-index:2}
 p{margin-top:26px;font-size:21px;letter-spacing:.14em;color:#c8a46a;font-family:'Noto Serif KR',serif;font-weight:300;z-index:2}
</style></head><body>
<div class="glow"></div><div class="frame"></div>
<div class="mark">DEADLYSINS</div>
<div class="shapes">${marks}</div>
<h1>오늘 밤,<br>당신은 어떤 죄를 삼키시겠습니까?</h1>
<p>여기선 착할 필요 없습니다.</p>
<svg style="position:absolute;width:0;height:0"><defs>
<filter id="ink" x="-25%" y="-25%" width="150%" height="160%">
<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="5.5" xChannelSelector="R" yChannelSelector="G"/>
</filter></defs></svg>
</body></html>`;

const tmp = path.join(__dirname, 'og', 'og.html');
fs.mkdirSync(path.dirname(tmp), { recursive: true });
fs.writeFileSync(tmp, html);

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 0.5, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(PUB, 'og.jpg'), type: 'jpeg', quality: 82 });
  await browser.close();
  console.log('만들었습니다: public/og.jpg (' + fs.statSync(path.join(PUB, 'og.jpg')).size + ' bytes)');
})();
