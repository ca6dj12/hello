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
const BEACONS = [];   // 로컬 서버가 받은 /api/track 기록 (실제 서버 대신)
function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      if (req.url.split('?')[0] === '/api/track') {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          if (req.method === 'POST') { try { BEACONS.push({ ct: req.headers['content-type'] || '', body: JSON.parse(body) }); } catch (e) { BEACONS.push({ bad: true }); } }
          res.writeHead(req.method === 'POST' ? 204 : 200); res.end(req.method === 'POST' ? '' : '{"db":false}');
        });
        return;
      }
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
    label: (document.querySelector('#signatureTrait .trait-label') || {}).textContent,
    glassTop: Math.round(document.querySelector('.signature-glass-crop').getBoundingClientRect().top)
  }));
  check(sig.en === SIGNATURE_EN[sig.k], '시그니처 술 = 결과의 죄', sig);
  check(sig.intro === 'hidden', '이름 화면 뒤로 제목이 비치지 않음', sig.intro);
  check(sig.glassTop >= 0, '시그니처 화면 위쪽이 잘리지 않음', sig.glassTop);
  check(lang === 'en' ? sig.extra.includes('16,000 KRW') : sig.extra.includes('16,000원'), '가격 16,000원 표시');
  check(lang === 'en' ? sig.label === 'Love' : sig.label === '연애 성향', '성향 라벨 언어', sig.label);
  await shot(page, lang + '-signature');
  const shareBtn = await page.evaluate(() => {
    const b = document.querySelector('.ds-share-top'); if (!b) return null;
    const r = b.getBoundingClientRect(); return { text: b.textContent, bottom: Math.round(r.bottom), vh: innerHeight };
  });
  check(shareBtn && (lang === 'en' ? shareBtn.text === 'Share' : shareBtn.text === '공유하기') && shareBtn.bottom <= shareBtn.vh,
    '칵테일 이름 바로 아래 공유 버튼 (스크롤 없이 보임)', shareBtn);
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
  const syms = await page.evaluate(() => [...document.querySelectorAll('#dsMenu .ds-sig .ds-sym')].map((i) => i.complete && i.naturalWidth));
  check(syms.length === 7 && syms.every((w) => w > 0), '일곱 잔 이름 옆에 상징 아이콘', syms);
  // 자유 이용 사진의 출처는 메뉴판 맨 아래 '사진 출처' 한곳에 (접힌 채로)
  const credits = await page.evaluate(() => {
    const c = document.querySelector('#dsMenu details.ds-credits');
    const expected = Object.values(DS_DATA.details).filter((d) => d.photo && d.photoCredit).length;
    return { open: c && c.open, n: c ? c.querySelectorAll('li a[href^="https://commons.wikimedia.org/"]').length : 0, expected };
  });
  check(credits.open === false && credits.n === credits.expected && credits.n > 0, '사진 출처: 메뉴판 맨 아래에 접혀 있음', credits);
  const sigDesc = await page.evaluate(() => [...document.querySelectorAll('#dsMenu .ds-sig')].map((r) =>
    [(r.querySelector('small:not(.ds-row-desc)') || {}).textContent || '', ((r.querySelector('.ds-row-desc') || {}).textContent || '').length]));
  check(sigDesc.length === 7 && sigDesc.every(([style, n]) => style && n > 15), '일곱 잔: 맛 한마디 + 한 줄 설명', sigDesc);
  await shot(page, lang + '-menu');

  // 메뉴 항목 누르기 → 상세 → 폰 뒤로가기는 상세만 닫음
  const taps = await page.evaluate(() => document.querySelectorAll('#dsMenu button.ds-tap').length);
  check(taps >= 7 + 24, '누를 수 있는 항목 (시그니처 7 + 설명 있는 24)', taps);
  await page.click('#dsMenu button[data-id="lagavulin-16"]');
  await page.waitForSelector('#dsItem.open', { timeout: 3000 });
  await page.waitForTimeout(400);
  const item = await page.evaluate(() => ({
    en: (document.querySelector('#dsItem .ds-item-en') || {}).textContent,
    chips: [...document.querySelectorAll('#dsItem .ds-chips li')].map((x) => x.textContent),
    about: ((document.querySelector('#dsItem .ds-about') || {}).textContent || '').length,
    prices: [...document.querySelectorAll('#dsItem .ds-prices b')].map((x) => x.textContent)
  }));
  check(item.en === 'Lagavulin 16' && item.chips.includes('43%') && item.about > 10 &&
    item.prices.length === 2 && item.prices.every((p) => /\d/.test(p)), '위스키 상세: 이름 · 도수 · 설명 · 글라스/보틀 가격', item);
  await shot(page, lang + '-menu-item');

  // 이 술에 대해 알아보기 → 펼침 / 다시 누르면 접힘
  await page.click('#dsItem [data-ds="more"]');
  await page.waitForSelector('#dsItem .ds-story .ds-layers li', { timeout: 5000 });
  await page.waitForTimeout(500);
  const story = await page.evaluate(() => ({
    layers: document.querySelectorAll('#dsItem .ds-layers li').length,
    text: document.querySelector('#dsItem .ds-story').textContent.length,
    expanded: document.querySelector('#dsItem [data-ds="more"]').getAttribute('aria-expanded')
  }));
  check(story.layers === 4 && story.text > 150 && story.expanded === 'true', '알아보기: 이야기 · 맛의 흐름 4단계 · 마시는 법', story);
  await shot(page, lang + '-menu-item-story');
  await page.click('#dsItem [data-ds="more"]');
  check(await page.evaluate(() => document.querySelector('#dsItem .ds-story').hidden), '다시 누르면 접힘');
  await page.goBack();
  await page.waitForTimeout(400);
  check(!(await page.$('#dsItem')) && !!(await page.$('#dsMenu.open')), '폰 뒤로가기 → 상세만 닫히고 메뉴는 그대로');
  await page.click('#dsMenu button[data-id^="sig:"]');
  await page.waitForSelector('#dsItem.open', { timeout: 3000 });
  const sigItem = await page.evaluate(() => ({
    ink: !!document.querySelector('#dsItem .ds-photo-ink img'),
    style: (document.querySelector('#dsItem .ds-chips li') || {}).textContent,
    about: ((document.querySelector('#dsItem .ds-about') || {}).textContent || '').length
  }));
  check(sigItem.ink && sigItem.style && sigItem.about > 15, '시그니처 상세: 잉크 그림 · 맛 한마디 · 설명', sigItem);
  await page.click('#dsItem [data-ds="close"]');
  await page.waitForTimeout(400);
  check(!(await page.$('#dsItem')), '상세 닫기 버튼');

  // 안주: 매장 사진(꽉 찬 장면) + 구성 + 가격, 위스키용 안내 문구는 없음
  await page.click('#dsMenu button[data-id="cherry-yogurt-pudding"]');
  await page.waitForSelector('#dsItem.open', { timeout: 3000 });
  await page.waitForFunction(() => { const i = document.querySelector('#dsItem .ds-photo-scene img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 5000 });
  const bite = await page.evaluate(() => ({
    w: document.querySelector('#dsItem .ds-photo-scene img').naturalWidth,
    notes: document.querySelectorAll('#dsItem .ds-notes dd').length,
    price: (document.querySelector('#dsItem .ds-prices b') || {}).textContent,
    note: !!document.querySelector('#dsItem .ds-note'),
    more: !!document.querySelector('#dsItem [data-ds="more"]')
  }));
  check(bite.w === 900 && bite.notes === 1 && /\d/.test(bite.price || '') && !bite.note && !bite.more, '안주 상세: 사진 · 구성 · 가격', bite);
  await page.click('#dsItem [data-ds="close"]');
  await page.waitForTimeout(400);

  // 음료: 사진 · 가격, 적을 맛 정보가 없으니 빈 상자도 없음
  await page.click('#dsMenu button[data-id="coke"]');
  await page.waitForSelector('#dsItem.open', { timeout: 3000 });
  await page.waitForFunction(() => { const i = document.querySelector('#dsItem .ds-photo img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 5000 });
  const drink = await page.evaluate(() => ({
    notes: document.querySelectorAll('#dsItem .ds-notes').length,
    credit: !!document.querySelector('#dsItem .ds-credit'),
    price: (document.querySelector('#dsItem .ds-prices b') || {}).textContent
  }));
  check(drink.notes === 0 && !drink.credit && /\d/.test(drink.price || ''), '음료 상세: 사진 · 가격, 출처 줄 · 빈 상자 없음', drink);
  await page.click('#dsItem [data-ds="close"]');
  await page.waitForTimeout(400);

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

  // 공유하기: 폰 공유 창이 있으면 이미지 + 테스트 링크를 넘기고, 없으면 길게 눌러 저장하는 이미지 화면
  await page.evaluate(() => {
    window.__shared = null;
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    Object.defineProperty(navigator, 'share', { configurable: true, value: (d) => {
      window.__shared = { files: d.files.length, type: d.files[0].type, size: d.files[0].size, text: d.text }; return Promise.resolve();
    } });
  });
  await page.click('.ds-share-top');
  await page.waitForFunction(() => window.__shared, null, { timeout: 8000 }).catch(() => {});
  const shared = await page.evaluate(() => window.__shared);
  check(shared && shared.files === 1 && shared.type === 'image/png' && shared.size > 40000 && shared.text.includes(new URL(base).origin),
    '공유하기 → 폰 공유 창에 결과 이미지 + 테스트 링크', shared);
  await page.evaluate(() => { Object.defineProperty(navigator, 'canShare', { configurable: true, value: undefined }); });
  await page.click('.ds-share-top');
  const sheet = await page.waitForFunction(() => {
    const i = document.querySelector('#dsShare.open .ds-share-img'); return i && i.complete && i.naturalWidth === 1080;
  }, null, { timeout: 8000 }).then(() => true, () => false);
  check(sheet, '공유 창이 없는 곳 → 이미지 화면 (길게 눌러 저장)');
  await page.goBack(); await page.waitForTimeout(400);
  check(!(await page.$('#dsShare')) && await screen(page) === 'signature', '폰 뒤로가기 → 이미지 화면만 닫힘');

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

  // 메뉴판 전용 링크: #menu, #menu/<id>
  await page.goto('about:blank');
  await page.goto(base + '#menu/old-fashioned', { waitUntil: 'networkidle' });
  await page.waitForSelector('#dsItem.open', { timeout: 3000 });
  const deep = await page.evaluate(() => ({ menu: !!document.querySelector('#dsMenu'), en: document.querySelector('#dsItem .ds-item-en').textContent, hash: location.hash }));
  check(deep.menu && deep.en === 'Old Fashioned' && deep.hash === '', '#menu/old-fashioned → 메뉴 + 올드패션드 상세가 바로 열림', deep);
  await page.goBack(); await page.waitForTimeout(300);
  await page.goBack(); await page.waitForTimeout(300);
  check(!(await page.$('#dsMenu')) && await screen(page) === 'cover', '뒤로가기 두 번 → 표지');
  await page.goto('about:blank');
  await page.goto(base + '#menu/sig:교', { waitUntil: 'networkidle' });
  await page.waitForSelector('#dsItem.open', { timeout: 3000 });
  check(await page.evaluate(() => !!document.querySelector('#dsItem .ds-photo-ink')), '#menu/sig:교 (한글 주소) → 교만 상세');
  await page.goBack(); await page.waitForTimeout(300);
  await page.goBack(); await page.waitForTimeout(300);
  await page.evaluate(() => { location.hash = '#menu'; });
  await page.waitForSelector('#dsMenu.open', { timeout: 3000 });
  check(true, '페이지 안에서 #menu 로 바뀌어도 메뉴가 열림');
  await page.goBack(); await page.waitForTimeout(300);

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
      const sh = document.querySelector('.ds-share-top').getBoundingClientRect();
      return { reach: a.bottom <= innerHeight + 1, glassTop: Math.round(g0.top), shareBottom: Math.round(sh.bottom), vh: innerHeight,
        wide: document.documentElement.scrollWidth > innerWidth || a.right > innerWidth };
    });
    // 공유 버튼은 작은 폰에서도 스크롤 없이 첫 화면 안에
    check(!quiz.wide && quiz.worst <= 1 && sig.reach && !sig.wide && sig.glassTop >= 0 && sig.shareBottom <= sig.vh && !errors.length,
      `${name} ${width}×${height}`, { quiz, sig, errors });
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `size-${width}x${height}.png`) });
    await ctx.close();
  }
}

/* 결과 기록: 사이트가 /api/track 으로 보내는 내용이 맞는지 (로컬 서버가 대신 받음) */
async function collect(browser, base) {
  console.log('\n■ 결과 기록 (/api/track)');
  BEACONS.length = 0;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ko-KR' });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  check(await page.evaluate(() => DS_ENHANCE.collect), '기본값: 기록 켜짐');
  await page.click('#start');
  await page.waitForSelector('#quiz.active', { timeout: 8000 });
  await page.waitForFunction(() => !coverTransitionBusy, null, { timeout: 8000 });
  await answerAll(page);
  await page.click('#toDesire');
  await page.waitForSelector('#signatureNameReveal.visible', { timeout: 20000 });
  await page.waitForTimeout(600);
  const sent = BEACONS.slice();
  const types = sent.map((x) => x.body && x.body.type);
  const result = (sent.find((x) => x.body && x.body.type === 'result') || {}).body || {};
  const sig = (sent.find((x) => x.body && x.body.type === 'signature') || {}).body || {};
  const SINS_KO = ['교만', '질투', '분노', '나태', '탐욕', '탐식', '색욕'];
  check(['start', 'result', 'signature'].every((t) => types.includes(t)), '시작 · 결과 · 시그니처를 보냄', types);
  check(SINS_KO.includes(result.sin) && result.sin === sig.sin, '결과의 죄 = 시그니처의 죄 (한국어 이름)', [result.sin, sig.sin]);
  check(/^(Q\d[ABCD] ?){7}$/.test(result.picks || ''), '고른 보기 7개를 원본 순서로 (Q1B …)', result.picks);
  check(sent.every((x) => !x.bad && x.body.sid === sent[0].body.sid), '한 세션은 같은 세션 값');
  await ctx.close();

  // data.js 에서 끄면 아무것도 안 보냄
  BEACONS.length = 0;
  const ctx2 = await browser.newContext({ locale: 'ko-KR' });
  const p2 = await ctx2.newPage();
  await p2.route('**/data.js', async (route) => {
    const r = await route.fetch();
    route.fulfill({ response: r, body: (await r.text()).replace('collect: { enabled: true }', 'collect: { enabled: false }') });
  });
  await p2.goto(base, { waitUntil: 'networkidle' });
  await p2.click('#start');
  await p2.waitForTimeout(600);
  check(!(await p2.evaluate(() => DS_ENHANCE.collect)) && BEACONS.length === 0, 'enabled:false 면 아무것도 안 보냄', BEACONS.length);
  await ctx2.close();
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
    if (!TARGET) await collect(browser, base);   // 로컬 서버가 /api/track 을 대신 받는 검사라 로컬에서만
  } catch (e) {
    check(false, '테스트 진행 중 예외', String(e).slice(0, 300));
  } finally {
    await browser.close();
    if (srv) srv.close();
  }
  console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건` : '결과: 모두 통과 ✓'));
  process.exitCode = fails.length ? 1 : 0;
})();
