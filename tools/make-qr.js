#!/usr/bin/env node
/* =============================================================
   테이블 QR 카드 만들기
     cd tools && npm install
     node make-qr.js https://<배포주소>
   결과: public/qr.svg (QR만) / public/card.html (인쇄용 카드)
   card.html 을 브라우저에서 열고 인쇄 → PDF 로 저장하면 됩니다. (A6, 여백 없음)
   ============================================================= */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const url = process.argv[2];
if (!url) {
  console.error('주소를 넣어주세요.  예)  node make-qr.js https://deadly-sins.vercel.app');
  process.exit(1);
}

const PUB = path.join(__dirname, '..', 'public');

QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#060607', light: '#ffffff' } })
  .then((svg) => {
    fs.writeFileSync(path.join(PUB, 'qr.svg'), svg);

    /* 벽면 도형 7개를 카드에도 얹는다 */
    const app = fs.readFileSync(path.join(PUB, 'app.js'), 'utf8');
    const shapes = app.slice(app.indexOf('var SHAPES'), app.indexOf('/* ---------- 잔'));
    const data = fs.readFileSync(path.join(PUB, 'data.js'), 'utf8');
    const marks = new Function(data + shapes +
      '; return SIN_ORDER.map(function(k){return inkShape(SINS[k].shape,"");}).join("");')();

    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    const vbMatch = svg.match(/viewBox="([^"]+)"/);
    const viewBox = vbMatch ? vbMatch[1] : '0 0 45 45';

    const card = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<title>DEADLY SINS — 테이블 카드</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Noto+Serif+KR:wght@300;400&display=swap">
<style>
 @page{size:A6;margin:0}
 *{margin:0;padding:0;box-sizing:border-box}
 body{background:#2a2a2c;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
 .card{
   width:105mm;height:148mm;background:#060607;color:#eae6de;position:relative;
   font-family:'Cormorant Garamond','Noto Serif KR',serif;
   display:flex;flex-direction:column;align-items:center;justify-content:center;
   padding:12mm 9mm;overflow:hidden;
 }
 .glow{position:absolute;inset:0;background:radial-gradient(72% 46% at 50% -4%,rgba(200,164,106,.24),transparent 62%)}
 .frame{position:absolute;inset:5mm;border:.4mm solid rgba(200,164,106,.34)}
 .mark{font-size:3.4mm;letter-spacing:.52em;color:#b6b1a8;z-index:2;text-indent:.52em}
 .shapes{display:flex;gap:2.6mm;align-items:flex-end;margin:6mm 0 5mm;z-index:2}
 .shapes svg{width:4.6mm;color:#eae6de;opacity:.3}
 .shapes svg:nth-child(4){opacity:1;color:#c8a46a}
 h1{font-family:'Noto Serif KR',serif;font-weight:300;font-size:6.2mm;line-height:1.6;text-align:center;z-index:2}
 .qr{background:#fff;padding:3.4mm;margin:7mm 0 4mm;z-index:2;line-height:0}
 .qr svg{width:38mm;height:38mm;display:block}
 .cta{font-family:'Noto Serif KR',serif;font-size:3.5mm;letter-spacing:.1em;color:#c8a46a;z-index:2;font-weight:300}
 .sub{font-size:3mm;letter-spacing:.16em;color:#79756e;margin-top:2.5mm;z-index:2;font-family:'Noto Serif KR',serif;font-weight:300}
 @media print{body{background:none;padding:0;min-height:0}.card{box-shadow:none}}
</style></head><body>
<div class="card">
  <div class="glow"></div><div class="frame"></div>
  <div class="mark">DEADLYSINS</div>
  <div class="shapes">${marks}</div>
  <h1>오늘 밤,<br>당신은 어떤 죄를<br>삼키시겠습니까?</h1>
  <div class="qr"><svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${inner}</svg></div>
  <p class="cta">QR을 찍고, 당신의 죄를 고르세요</p>
  <p class="sub">일곱 개의 잔 · 각 18,000원</p>
</div>
<svg style="position:absolute;width:0;height:0"><defs>
<filter id="ink" x="-25%" y="-25%" width="150%" height="160%">
<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="5.5" xChannelSelector="R" yChannelSelector="G"/>
</filter></defs></svg>
</body></html>`;

    fs.writeFileSync(path.join(PUB, 'card.html'), card);
    console.log('만들었습니다:');
    console.log('  public/qr.svg');
    console.log('  public/card.html   ← 브라우저에서 열고 인쇄(A6, 배경 그래픽 켜기)');
    console.log('  가리키는 주소:', url);
  })
  .catch((e) => { console.error(e); process.exit(1); });
