#!/usr/bin/env node
/* =============================================================
   실제 브라우저로 사이트를 끝까지 눌러 보는 자동 점검
     node tools/e2e.js                    ← public/ 를 직접 띄워서 검사
     node tools/e2e.js https://…          ← 배포된 주소를 검사
     CHROME_PATH=/path/to/chrome node tools/e2e.js

   한국어 · 영어로 한 번씩 질문 7개 → 결과 → 시그니처 → 주문 화면 → 메뉴 →
   결과 이미지 → 다시 하기 까지 가면서, 아래가 하나라도 어긋나면 종료 코드 1.
     · 스크립트 오류 / 404
     · 보기 순서가 섞이는지
     · 결과 제목이 한 가지 죄이고, 시그니처 술과 같은 죄인지
     · 폰 뒤로가기가 앱 안의 한 단계씩 돌아가는지
     · 가격(16,000원)과 바텐더 화면, 메뉴, 다시 하기
   --shots <폴더> 를 주면 단계별 화면을 저장합니다.
   ============================================================= */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const args = process.argv.slice(2);
const SHOTS = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;
const TARGET = args.find((a) => /^https?:/.test(a));
const PUBLIC = path.join(__dirname, '..', 'public');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
      const file = path.join(PUBLIC, rel);
      if (!file.startsWith(PUBLIC) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

const fails = [];
const check = (ok, what, detail) => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${what}${!ok && detail !== undefined ? '  → ' + JSON.stringify(detail) : ''}`);
  if (!ok) fails.push(what);
};
let shotNo = 0;
async function shot(page, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, `${String(++shotNo).padStart(2, '0')}-${name}.png`) });
}

async function answerAll(page) {
  for (let guard = 0; guard < 40; guard++) {
    if (await page.$('#results.active')) return true;
    const before = await page.evaluate(() => index);
    const opts = await page.$$('#choices .choice');
    if (!opts.length) { await page.waitForTimeout(150); continue; }
    await opts[Math.floor(Math.random() * opts.length)].click().catch(() => {});
    await page.waitForFunction((b) => index !== b || document.querySelector('#results.active'), before, { timeout: 6000 }).catch(() => {});
    await page.waitForFunction(() => !advancing, null, { timeout: 6000 }).catch(() => {});
  }
  return !!(await page.$('#results.active'));
}
const screen = (page) => page.evaluate(() => document.body.dataset.dsScreen);

async function run(browser, base, lang) {
  console.log(`\n■ ${lang === 'en' ? 'English' : '한국어'}`);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: lang === 'en' ? 'en-US' : 'ko-KR' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  check(await page.evaluate(() => !!window.DS_ENHANCE), '개선 레이어가 붙음');
  check(await page.evaluate(() => document.documentElement.lang) === lang, `브라우저 언어대로 시작 (${lang})`);
  const startText = await page.textContent('#start');
  check(lang === 'en' ? startText === 'Tap to begin' : startText === '클릭해주세요', '표지 버튼 문구', startText);
  check(await page.isVisible('#dsMenuBtn'), '표지에 MENU 버튼');
  await shot(page, lang + '-cover');

  // 표지의 MENU 는 퀴즈를 시작시키지 않아야 한다
  await page.click('#dsMenuBtn');
  await page.waitForTimeout(350);
  check(await page.isVisible('#dsMenu'), '표지에서 메뉴 열림');
  check(await screen(page) === 'cover', '메뉴를 눌러도 퀴즈가 시작되지 않음', await screen(page));
  await page.goBack();
  await page.waitForTimeout(350);
  check(!(await page.$('#dsMenu')), '폰 뒤로가기로 메뉴 닫힘');

  // 시작
  await page.click('#start');
  await page.waitForSelector('#quiz.active', { timeout: 8000 });
  await page.waitForFunction(() => !coverTransitionBusy, null, { timeout: 8000 });
  const shuffled = await page.evaluate(() => QUESTIONS.some((q) => q.a.some((o, j) => o._id.split('-')[1] !== String(j))));
  check(shuffled, '보기 순서가 섞임');
  const qText = await page.textContent('#questionText');
  check(lang === 'en' ? /^[\x00-\x7F‘’“”…—–·]+$/.test(qText) : /[가-힣]/.test(qText), '질문 문구 언어', qText);
  await shot(page, lang + '-q1');

  // 2문항 답한 뒤 폰 뒤로가기 → 2번 문항
  for (let i = 0; i < 2; i++) {
    const before = await page.evaluate(() => index);
    await (await page.$$('#choices .choice'))[i].click();
    await page.waitForFunction((b) => index !== b, before, { timeout: 6000 });
    await page.waitForFunction(() => !advancing, null, { timeout: 6000 }).catch(() => {});
  }
  check(await page.evaluate(() => index) === 2, '3번 문항 도착');
  await page.goBack();
  await page.waitForFunction(() => index === 1, null, { timeout: 6000 }).catch(() => {});
  check(await page.evaluate(() => index) === 1 && await screen(page) === 'quiz', '폰 뒤로가기 → 2번 문항', await page.evaluate(() => index));

  check(await answerAll(page), '7문항 끝까지 → 결과');
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const ranked = calculate();
    return { title: document.getElementById('resultTitle').textContent, top: ranked[0].name, k: ranked[0].k };
  });
  check(!r.title.includes('·') && r.title === r.top, '결과 제목 = 1위 한 가지', r);
  await shot(page, lang + '-result');

  // 결과 → 폰 뒤로가기 → 7번 문항 → 다시 답 → 결과
  await page.goBack();
  await page.waitForSelector('#quiz.active', { timeout: 6000 }).catch(() => {});
  check(await screen(page) === 'quiz' && await page.evaluate(() => index === QUESTIONS.length - 1), '결과에서 폰 뒤로가기 → 7번 문항');
  check(await answerAll(page), '다시 답하면 결과로');
  await page.waitForTimeout(400);

  // 시그니처
  await page.click('#toDesire');
  await page.waitForSelector('#signatureNameReveal.visible', { timeout: 20000 });
  await page.waitForTimeout(700);
  const sig = await page.evaluate(() => ({
    k: calculate()[0].k,
    title: document.getElementById('resultTitle').textContent,
    en: document.getElementById('signatureNameEn').textContent,
    intro: getComputedStyle(document.querySelector('.signature-intro')).visibility,
    extra: document.querySelector('.ds-extra').textContent,
    label: (document.querySelector('#signatureTrait .trait-label') || {}).textContent
  }));
  check(sig.en === SIGNATURE_EN[sig.k], '시그니처 술 = 결과의 죄', sig);
  check(sig.intro === 'hidden', '이름 화면 뒤로 제목이 비치지 않음', sig.intro);
  check(lang === 'en' ? sig.extra.includes('16,000 KRW') : sig.extra.includes('16,000원'), '가격 16,000원 표시');
  check(lang === 'en' ? sig.label === 'Love' : sig.label === '연애 성향', '성향 라벨 언어', sig.label);
  await shot(page, lang + '-signature');
  const canScroll = await page.evaluate(() => {
    const h = document.getElementById('signatureNameReveal');
    h.scrollTop = h.scrollHeight;
    const last = document.querySelector('.ds-actions').getBoundingClientRect();
    return last.bottom <= window.innerHeight + 1 && last.top >= 0;
  });
  check(canScroll, '아래 버튼까지 스크롤로 닿음');
  await shot(page, lang + '-signature-bottom');

  // 바텐더 화면
  await page.click('[data-ds="order"]');
  await page.waitForSelector('#dsOrder.open', { timeout: 3000 });
  await page.waitForTimeout(400);
  const order = await page.textContent('#dsOrder');
  check(order.includes(sig.en) && order.includes('16,000'), '바텐더 화면에 술 이름과 가격', order.slice(0, 120));
  await shot(page, lang + '-order');
  await page.goBack();
  await page.waitForTimeout(400);
  check(!(await page.$('#dsOrder')) && await screen(page) === 'signature', '폰 뒤로가기 → 바텐더 화면만 닫힘');

  // 메뉴
  await page.click('.ds-actions [data-ds="menu"]');
  await page.waitForSelector('#dsMenu.open', { timeout: 3000 });
  await page.waitForTimeout(400);
  const menu = await page.evaluate(() => ({
    mine: document.querySelectorAll('#dsMenu .mine').length,
    sig: document.querySelectorAll('#dsMenu .ds-sig').length,
    rows: document.querySelectorAll('#dsMenu .ds-row').length
  }));
  check(menu.sig === 7 && menu.mine >= 1 && menu.rows > 20, '메뉴: 일곱 잔 + 내 죄 표시 + 전체 품목', menu);
  await shot(page, lang + '-menu');
  await page.click('#dsMenu [data-ds="close"]');
  await page.waitForTimeout(400);
  check(!(await page.$('#dsMenu')), '메뉴 닫기 버튼');

  // 결과 이미지
  const img = await page.evaluate(async (k) => {
    const blob = await window.DS_makeShareImage(k);
    const bmp = await createImageBitmap(blob);
    return { size: blob.size, w: bmp.width, h: bmp.height };
  }, sig.k);
  check(img.w === 1080 && img.h === 1920 && img.size > 40000, '결과 이미지 1080×1920 생성', img);
  if (SHOTS) {
    const data = await page.evaluate(async (k) => {
      const blob = await window.DS_makeShareImage(k);
      return await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
    }, sig.k);
    fs.writeFileSync(path.join(SHOTS, `share-${lang}.png`), Buffer.from(data.split(',')[1], 'base64'));
  }

  // 다시 하기
  await page.click('[data-ds="restart"]');
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => ({ s: document.body.dataset.dsScreen, fresh: answers.every((a) => a === null), i: index }));
  check(after.s === 'cover' && after.fresh && after.i === 0, '다시 하기 → 표지, 답 초기화', after);
  await page.click('#start');
  await page.waitForSelector('#quiz.active', { timeout: 8000 });
  check(await page.evaluate(() => index) === 0, '다시 시작하면 1번 문항부터');

  // 언어 바꾸기 (표지에서)
  await page.goBack();
  await page.waitForTimeout(500);
  if (await screen(page) === 'cover') {
    await page.click('#dsLang');
    await page.waitForTimeout(200);
    const other = lang === 'en' ? 'ko' : 'en';
    check(await page.evaluate(() => document.documentElement.lang) === other, `언어 전환 → ${other}`);
  } else check(false, '퀴즈 1번에서 폰 뒤로가기 → 표지', await screen(page));

  check(errors.length === 0, '스크립트 오류 · 404 없음', errors);
  await ctx.close();
}

/* 화면 크기별: 가로 넘침 없이, 질문 보기가 화면 안에 들어오고, 마지막 버튼까지 스크롤로 닿는지.
   (크로미움으로 크기만 흉내 낸 것이라 실제 아이폰 사파리를 대신하지는 못함) */
const DEVICES = [
  ['iPhone SE', 375, 667, 2], ['iPhone 13/14', 390, 844, 3], ['iPhone 15 Pro Max', 430, 932, 3],
  ['Galaxy S 계열', 360, 780, 3], ['작은 안드로이드', 360, 640, 2]
];
async function sizes(browser, base) {
  console.log('\n■ 화면 크기별');
  for (const [name, width, height, dpr] of DEVICES) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, isMobile: true, hasTouch: true, locale: 'ko-KR' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.tap('#start');
    await page.waitForSelector('#quiz.active', { timeout: 8000 });
    await page.waitForFunction(() => !coverTransitionBusy, null, { timeout: 8000 });
    // 가장 긴 문항에서 보기 4개가 다 보이는지 (스크롤 영역 안에서라도)
    const quiz = await page.evaluate(() => {
      let worst = 0;
      for (let i = 0; i < QUESTIONS.length; i++) {
        index = i; renderQuestion();
        const sc = document.getElementById('questionScroll');
        sc.scrollTop = sc.scrollHeight;
        const last = [...document.querySelectorAll('#choices .choice')].pop().getBoundingClientRect();
        const box = sc.getBoundingClientRect();
        worst = Math.max(worst, last.bottom - box.bottom);
      }
      index = 0; renderQuestion();
      return { worst: Math.round(worst), wide: document.documentElement.scrollWidth > innerWidth };
    });
    await page.evaluate(() => { answers = answers.map(() => 0); renderResults(); });
    await page.waitForTimeout(300);
    await page.tap('#toDesire');
    await page.waitForSelector('#signatureNameReveal.visible', { timeout: 20000 });
    await page.waitForTimeout(500);
    const sig = await page.evaluate(() => {
      const h = document.getElementById('signatureNameReveal');
      h.scrollTop = h.scrollHeight;
      const a = document.querySelector('.ds-actions').getBoundingClientRect();
      const g = document.querySelector('.signature-glass-crop').getBoundingClientRect();
      h.scrollTop = 0;
      const g0 = document.querySelector('.signature-glass-crop').getBoundingClientRect();
      return { reach: a.bottom <= innerHeight + 1, glassTop: Math.round(g0.top), wide: document.documentElement.scrollWidth > innerWidth || a.right > innerWidth };
    });
    check(!quiz.wide && quiz.worst <= 1 && sig.reach && !sig.wide && sig.glassTop >= 0 && !errors.length,
      `${name} ${width}×${height}`, { quiz, sig, errors });
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `size-${width}x${height}.png`) });
    await ctx.close();
  }
}

let SIGNATURE_EN = {};
(async () => {
  let srv = null, base = TARGET;
  if (!base) { srv = await serve(); base = `http://127.0.0.1:${srv.address().port}/`; }
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  try {
    const probe = await browser.newPage();
    await probe.goto(base, { waitUntil: 'domcontentloaded' });
    SIGNATURE_EN = await probe.evaluate(() => Object.fromEntries(Object.entries(SIGNATURE_DRINKS).map(([k, v]) => [k, v.en])));
    await probe.close();
    console.log('대상:', base);
    await run(browser, base, 'ko');
    await run(browser, base, 'en');
    await sizes(browser, base);
  } catch (e) {
    check(false, '테스트 진행 중 예외', String(e).slice(0, 300));
  } finally {
    await browser.close();
    if (srv) srv.close();
  }
  console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건` : '결과: 모두 통과 ✓'));
  process.exitCode = fails.length ? 1 : 0;
})();
