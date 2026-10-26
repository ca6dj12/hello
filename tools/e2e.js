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
const PROMO = path.join(__dirname, '..', 'promo');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
const BEACONS = [];   // 로컬 서버가 받은 /api/track 기록 (실제 서버 대신)
// 로컬 서버의 /api/menu (사장님 고침). 실제 서버의 검사는 tools/test-api.js 가 한다.
const ADMIN_KEY = 'test-key';
let LIVE = { v: 0, at: null, data: null };
const ADMIN_POSTS = [];
function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      if (req.url.split('?')[0] === '/api/menu') {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          const json = (code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
          if (req.method === 'GET') return json(200, LIVE);
          if (req.headers['x-admin-key'] !== ADMIN_KEY) return json(401, { error: 'wrong-password' });
          let d = {}; try { d = JSON.parse(body); } catch (e) { return json(400, {}); }
          ADMIN_POSTS.push(d);
          if (d.action === 'save') LIVE = { v: LIVE.v + 1, at: new Date().toISOString(), data: d.data };
          return json(200, Object.assign({ ok: true }, LIVE));
        });
        return;
      }
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
      const root = rel.startsWith('promo/') ? PROMO : PUBLIC;   // 1층 배너 홍보 사이트는 저장소의 promo/
      const file = path.join(root, rel.startsWith('promo/') ? rel.slice(6) : rel);
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
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
  // 줄은 화면에 들어올 때 떠오르는데, 끝까지 내리면 하나도 빠짐없이 나타나야 한다
  const unrevealed = await page.evaluate(async () => {
    const m = document.getElementById('dsMenu');
    for (let y = 0; y <= m.scrollHeight; y += 250) { m.scrollTop = y; await new Promise((r) => setTimeout(r, 40)); }
    await new Promise((r) => setTimeout(r, 250));
    const left = m.querySelectorAll('.ds-reveal:not(.ds-in)').length;
    m.scrollTop = 0;
    return left;
  });
  check(unrevealed === 0, '메뉴판을 끝까지 내리면 모든 줄이 나타남', unrevealed);
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

  check(await page.evaluate(() => [...document.querySelectorAll('#dsMenu .ds-new')].map((b) => b.closest('[data-id]').getAttribute('data-id')).join()) === 'cheesecake',
    '새 메뉴(치즈케이크)에 NEW 표시');
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
  // 2문항 답한 뒤 다른 앱으로 넘어감 → 3번 문항에서 떠났다는 기록
  for (let i = 0; i < 2; i++) {
    const before = await page.evaluate(() => index);
    await (await page.$$('#choices .choice'))[0].click();
    await page.waitForFunction((b) => index !== b, before, { timeout: 6000 });
    await page.waitForFunction(() => !advancing, null, { timeout: 6000 }).catch(() => {});
  }
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    document.dispatchEvent(new Event('visibilitychange'));   // 같은 문항에서 두 번 떠도 한 번만
    delete document.visibilityState;
  });
  await page.waitForTimeout(300);
  const quits = BEACONS.filter((x) => x.body && x.body.type === 'quit').map((x) => x.body);
  check(quits.length === 1 && quits[0].q === 3 && quits[0].answered === 2, '퀴즈 도중 떠나면 몇 번 문항이었는지 기록', quits);
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

/* 사장님 메뉴 관리: /admin 에서 고친 것이 손님 메뉴판에 그대로 보이는지 */
async function admin(browser, base) {
  console.log('\n■ 메뉴 관리 (/admin)');
  LIVE = { v: 0, at: null, data: null }; ADMIN_POSTS.length = 0;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ko-KR', isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('dialog', (d) => d.accept());
  await page.goto(base + 'admin.html', { waitUntil: 'networkidle' });
  await page.fill('#pw', 'nope'); await page.click('#login button');
  await page.waitForFunction(() => /틀렸/.test(document.getElementById('loginMsg').textContent), null, { timeout: 5000 }).catch(() => {});
  check(/틀렸/.test(await page.textContent('#loginMsg')) && await page.isHidden('#editor'), '틀린 비밀번호 → 들어가지 못함');
  await page.fill('#pw', ADMIN_KEY); await page.click('#login button');
  await page.waitForSelector('#editor:not([hidden])', { timeout: 5000 });
  check(await page.isDisabled('#save'), '들어가면 편집 화면, 바꾼 게 없으면 저장 버튼 꺼짐');

  // 라가불린 품절 · 콜라 3,500원 · 소다워터 숨김 · 치즈케이크 NEW 끄기 · 교만 품절 · 시그니처 17,000 · 안주에 새 메뉴
  const card = (ko) => page.locator('.card.row', { has: page.locator('.name', { hasText: ko }) }).first();
  await card('라가불린 16년').locator('.tg-sold').click();
  await card('콜라 ').locator('[data-f="p"]').fill('3500');
  await card('소다워터').locator('.tg', { hasText: '숨김' }).click();
  await card('치즈케이크').locator('.tg', { hasText: 'NEW' }).click();
  await card('PRIDE').locator('.tg-sold').click();
  await page.fill('[data-f="sigPrice"]', '17000');
  await page.click('.add:has-text("안주에 새 메뉴 추가")');
  const added = page.locator('.card.is-added').last();
  await added.locator('[data-f="ko"]').fill('<b>나쵸</b>');
  await added.locator('[data-f="en"]').fill('Nachos');
  await added.locator('[data-f="p"]').fill('9000');
  await added.locator('[data-f="about"]').fill('치즈를 듬뿍 올린 나쵸.');
  check(!(await page.isDisabled('#save')), '바꾸면 저장 버튼 켜짐');
  await page.click('#save');
  await page.waitForFunction(() => /저장했어요/.test(document.getElementById('barMsg').textContent), null, { timeout: 5000 }).catch(() => {});
  const saved = (ADMIN_POSTS.filter((p) => p.action === 'save').pop() || {}).data || {};
  check(saved.signaturePrice === 17000 && saved.items && saved.items['lagavulin-16'].soldOut === true && saved.items.coke.p === '3,500' &&
    saved.items['soda-water'].hidden === true && saved.items.cheesecake.new === false && saved.items['sig:교'].soldOut === true &&
    !saved.items['ardbeg-10'], '저장: 기본과 다른 점만 보냄', saved);
  check(Array.isArray(saved.extra) && saved.extra.length === 1 && saved.extra[0].section === 'bites' && saved.extra[0].p === '9,000' &&
    saved.extra[0].new === true && /^x-[a-z0-9]{4,12}$/.test(saved.extra[0].id), '새 메뉴: 구역 · 가격 · NEW', saved.extra);
  check(/저장했어요/.test(await page.textContent('#barMsg')) && await page.isDisabled('#save'), '저장하면 안내 + 저장 버튼 꺼짐');

  // 손님 메뉴판
  const g = await ctx.newPage();
  g.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  await g.goto(base + '#menu', { waitUntil: 'networkidle' });
  await g.waitForSelector('#dsMenu.open', { timeout: 5000 });
  const m = await g.evaluate(() => {
    const row = (id) => document.querySelector('#dsMenu [data-id="' + id + '"]');
    const price = (id) => (row(id) ? row(id).querySelector('.ds-row-price').textContent : null);
    const nachos = [...document.querySelectorAll('#dsMenu .ds-row')].find((r) => r.textContent.includes('나쵸'));
    return {
      lagavulin: price('lagavulin-16'), lagSold: row('lagavulin-16').classList.contains('ds-soldout'),
      coke: price('coke'), soda: !!row('soda-water'), cheeseNew: !!row('cheesecake').querySelector('.ds-new'),
      pride: price('sig:교'), sigNote: document.querySelector('#dsMenu .ds-note').textContent,
      nachos: nachos ? { html: nachos.querySelector('.ds-row-name').innerHTML, price: nachos.querySelector('.ds-row-price').textContent, id: nachos.getAttribute('data-id') } : null
    };
  });
  check(m.lagavulin === '품절' && m.lagSold, '손님 메뉴판: 품절 표시', m);
  check(m.coke === '3,500' && !m.soda && !m.cheeseNew, '손님 메뉴판: 가격 · 숨김 · NEW 끄기', m);
  check(m.pride === '품절' && m.sigNote.includes('17,000'), '손님 메뉴판: 시그니처 품절 · 가격', m);
  check(m.nachos && m.nachos.html.includes('&lt;b&gt;나쵸&lt;/b&gt;') && m.nachos.html.includes('ds-new') && m.nachos.price === '9,000' && m.nachos.id,
    '손님 메뉴판: 새 메뉴 (글자는 이스케이프)', m.nachos);
  if (m.nachos && m.nachos.id) {
    await g.click('#dsMenu [data-id="' + m.nachos.id + '"]');
    await g.waitForSelector('#dsItem.open', { timeout: 3000 });
    const it = await g.evaluate(() => ({ about: document.querySelector('#dsItem .ds-about').textContent, more: !!document.querySelector('#dsItem [data-ds="more"]') }));
    check(it.about === '치즈를 듬뿍 올린 나쵸.' && !it.more, '새 메뉴를 누르면 설명', it);
  }

  // 되돌리기 요청 · 나가기
  await page.click('#undo');
  await page.waitForTimeout(400);
  check(ADMIN_POSTS.some((p) => p.action === 'undo'), '직전 저장으로 되돌리기 요청');
  await page.click('#logout');
  check(await page.isVisible('#login') && await page.evaluate(() => sessionStorage.getItem('ds_admin_key')) === null, '나가기 → 비밀번호 잊음');
  check(errors.length === 0, '관리 · 손님 화면 스크립트 오류 없음', errors);
  await ctx.close();
  LIVE = { v: 0, at: null, data: null };
}

/* 1층 배너 QR 홍보 사이트 (promo/). 실제로는 다른 주소에서 설문 사이트의 data.js · 그림 · API 를 읽으므로,
   그 주소(PROMO_BASE)로 가는 요청을 로컬 public/ 과 로컬 기록으로 돌려서 검사한다. */
const PROMO_BASE = 'https://deadly-sins-mu.vercel.app/';
async function promoSite(browser, base) {
  console.log('\n■ 1층 배너 홍보 사이트 (promo/)');
  BEACONS.length = 0;
  const open = async (dataPatch, at) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ko-KR', isMobile: true, hasTouch: true });
    await ctx.route(PROMO_BASE + '**', async (route) => {
      const req = route.request(), u = new URL(req.url());
      if (u.pathname === '/api/track') {
        try { BEACONS.push({ body: JSON.parse(req.postData() || '{}') }); } catch (e) { BEACONS.push({ bad: true }); }
        return route.fulfill({ status: 204, body: '' });
      }
      if (u.pathname === '/api/menu') return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(LIVE) });
      const file = path.join(PUBLIC, decodeURIComponent(u.pathname));
      if (!file.startsWith(PUBLIC) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
      let body = fs.readFileSync(file);
      if (dataPatch && u.pathname === '/data.js') body = dataPatch(body.toString('utf8'));
      return route.fulfill({ status: 200, contentType: TYPES[path.extname(file)] || 'application/octet-stream', body });
    });
    const page = await ctx.newPage();
    if (at) await page.clock.setFixedTime(new Date(at));   // 영업 상태는 한국 시간 기준이라 시각을 고정
    return { ctx, page };
  };
  const status = (page) => page.evaluate(() => { const s = document.querySelector('.lb-status'); return s ? (s.classList.contains('is-open') ? '● ' : '○ ') + s.textContent : null; });
  const { ctx, page } = await open(null, '2026-10-27T12:00:00Z');   // 화요일 밤 9시 (한국)
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
  await page.goto(base + 'promo/index.html', { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => ({
    h1: document.querySelector('.lb-hero h1').textContent,
    cards: document.querySelectorAll('.lb-card').length,
    room: document.querySelectorAll('.lb-room img').length,
    cats: [...document.querySelectorAll('.lb-cats a')].map((a) => a.textContent).join(' '),
    grid: Object.fromEntries([...document.querySelectorAll('.lb-cat')].map((c) => [c.id, c.querySelectorAll('.lb-item').length])),
    noPhoto: [...document.querySelectorAll('.lb-item')].filter((b) => !b.querySelector('.lb-item-img img')).map((b) => b.id),
    // 가격은 이 사이트에 싣지 않는다: 16,000 · 9,000원 · 8,000 같은 숫자가 하나도 없어야
    prices: (document.getElementById('lb').innerText.match(/\d{1,3}(,\d{3})+|\d+\s*원|KRW/g) || []),
    rental: (document.querySelector('[data-act="rental"]') || {}).href,
    credits: document.querySelectorAll('.lb-credits li').length,
    table: !!document.getElementById('table'),
    toQuiz: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => /deadly-sins-mu|^\/|^[a-z-]+\.html/.test(h)),
    info: document.querySelector('.lb-info').textContent,
    maps: [...document.querySelectorAll('.lb-maps a')].map((a) => a.textContent + ' ' + a.getAttribute('href')),
    ig: (document.querySelector('[data-act="instagram"]') || {}).href,
    cta: Math.round(document.querySelector('.lb-cta').getBoundingClientRect().top),
    vh: innerHeight
  }));
  check(info.h1.includes('일곱 개의 죄') && info.cards === 7 && info.room === 3, '홍보 사이트: 첫 화면 · 일곱 잔 · 바 안 사진', info);
  check(info.cats === '시그니처 위스키 칵테일 안주 음료' && info.grid['cat-sig'] === 7 && info.grid['cat-whisky'] >= 15 && info.grid['cat-bites'] === 3 && info.grid['cat-bev'] === 5 && info.noPhoto.length === 0,
    '메뉴: 종류 칸 다섯 + 종류별 사진 격자 (모든 칸에 사진)', info.grid);
  check(info.prices.length === 0, '가격은 어디에도 없음', info.prices);
  check(info.credits >= 5, '공용 사진 출처는 메뉴 맨 아래 접어 둠', info.credits);
  check(info.table && info.toQuiz.length === 0, '설문 사이트로 가는 링크 없음 (테이블 질문은 예고만)', info.toQuiz);
  check(['백제고분로41길 42-20', '잠실역 2·8호선 10번 출구', '엘리베이터', '주차', '화–일 20:00 – 02:00', '라스트오더 01:30 · 매주 월요일 휴무', '@deadlysins.bar', '커버차지 없음', '대관 문의 환영']
    .every((w) => info.info.includes(w)), '오시는 길: 주소 · 역 · 엘리베이터 · 주차 · 영업시간 · 인스타 · 커버차지 없음 · 대관 문의', info.info);
  check(info.rental === 'https://www.instagram.com/deadlysins.bar/', '바 안 사진 아래 "대관 문의하기" → 인스타그램', info.rental);
  check(info.maps.length === 2 && /네이버 지도.*naver\.me/.test(info.maps[0]) && /카카오맵.*kko\.to/.test(info.maps[1]) && info.ig === 'https://www.instagram.com/deadlysins.bar/',
    '지도 버튼 둘(네이버 · 카카오) · 인스타 링크', info.maps.concat(info.ig));
  check(await status(page) === '● 지금 영업 중 · 새벽 2시까지', '화요일 밤 9시: 첫 화면에 "지금 영업 중"', await status(page));
  check(info.cta < info.vh - 60, '첫 화면 안에 버튼이 보임', info);
  check(BEACONS.some((x) => x.body && x.body.type === 'visit' && x.body.act === 'open' && x.body.from === 'promo'), '들어오면 방문 기록 (설문 사이트의 기록 API 로)');

  const dockY = () => page.evaluate(() => new DOMMatrixReadOnly(getComputedStyle(document.getElementById('lbDock')).transform).m42);
  const y0 = await dockY();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(700);
  check(y0 > 10 && Math.abs(await dockY()) < 1, '첫 화면을 지나면 아래 바로가기 막대가 올라옴', y0);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.click('.lb-hero [data-act="way"]');
  await page.waitForTimeout(1200);
  const wayTop = await page.evaluate(() => Math.round(document.getElementById('way').getBoundingClientRect().top));
  check(wayTop >= -5 && wayTop < 300, '"5층으로 오는 길" → 오시는 길로 내려감', wayTop);
  // 메뉴 종류 칸 → 그 종류로, 칸은 위에 붙어 있고 불이 옮겨감
  await page.click('.lb-hero [data-act="menu"]');
  await page.waitForTimeout(1200);
  await page.click('.lb-cats a[href="#cat-bites"]');
  await page.waitForTimeout(1400);
  const cat = await page.evaluate(() => ({
    top: Math.round(document.getElementById('cat-bites').getBoundingClientRect().top),
    chips: Math.round(document.querySelector('.lb-cats').getBoundingClientRect().top),
    on: (document.querySelector('.lb-cats a.on') || {}).textContent
  }));
  check(cat.top >= 0 && cat.top < 160 && Math.abs(cat.chips) < 2 && cat.on === '안주', '종류 칸 "안주" → 안주로 내려가고, 칸은 화면 위에 붙어 불이 옮겨감', cat);
  check(await page.evaluate(() => document.querySelector('.lb-top').classList.contains('hide')), '스크롤하면 위의 MENU · EN 은 숨김 (글자를 가리지 않게)');
  // 사진을 누르면 설명 판, 뒤로 가기 · 바깥 · ✕ 로 닫힘
  await page.click('#m-dalmore-15');
  await page.waitForTimeout(700);
  const sh = await page.evaluate(() => {
    const el = document.querySelector('.lb-sheet');
    const r = el.querySelector('.lb-sheet-panel').getBoundingClientRect();
    return { open: !el.hidden && el.classList.contains('open'), inView: r.top >= 0 && r.top < innerHeight / 2, text: el.innerText, lock: document.documentElement.classList.contains('lb-lock') };
  });
  check(sh.open && sh.inView && sh.lock && /달모어 15/.test(sh.text) && /하이랜드/.test(sh.text) && /캐스크/.test(sh.text) && !/\d,\d{3}|원\b/.test(sh.text),
    '사진을 누르면 아래에서 설명 판 (산지 · 도수 · 향 · 맛, 가격 없음)', sh.text.slice(0, 120));
  check(BEACONS.some((x) => x.body && x.body.act === 'item' && x.body.id === 'dalmore-15'), '어떤 메뉴를 열었는지 기록');
  await page.goBack();
  await page.waitForTimeout(600);
  check(await page.evaluate(() => document.querySelector('.lb-sheet').hidden && !document.documentElement.classList.contains('lb-lock')), '폰의 "뒤로"로 설명 판이 닫힘 (사이트를 떠나지 않음)', page.url());
  await page.click('#m-sig-교');
  await page.waitForTimeout(700);
  const sig = await page.evaluate(() => document.querySelector('.lb-sheet').innerText);
  check(/교만의 술/.test(sig) && /깊고 우아한/.test(sig) && /강도/.test(sig), '시그니처: 이름 · 스타일 · 설명 · 향/맛/강도', sig.slice(0, 120));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  await page.click('#m-cheesecake');
  await page.waitForTimeout(600);
  await page.mouse.click(195, 30);   // 판 바깥 (어두운 곳)
  await page.waitForTimeout(600);
  const closed = await page.evaluate(() => ({ hidden: document.querySelector('.lb-sheet').hidden, url: location.pathname }));
  check(closed.hidden && /promo/.test(closed.url), 'Esc · 바깥을 눌러도 닫힘', closed);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
  await page.click('#lbLang');
  check((await page.textContent('.lb-hero h1')).includes('Seven sins'), '영어 전환');
  await page.click('#lbLang');
  check(errors.length === 0, '홍보 사이트 스크립트 오류 · 404 없음', errors);
  await ctx.close();

  // 시각마다 첫 화면의 영업 상태 (화–일 20:00–02:00, 라스트오더 01:30, 월요일 휴무 · 한국 시간)
  const WHEN = [
    ['2026-10-27T06:00:00Z', '○ 오늘 오후 8시 오픈', '화요일 오후 3시'],
    ['2026-10-27T16:45:00Z', '○ 오늘 주문은 마감됐어요', '화요일 영업 중 새벽 1:45 (라스트오더 지남)'],
    ['2026-10-27T17:30:00Z', '○ 오늘 오후 8시 오픈', '수요일 새벽 2:30 (닫은 뒤)'],
    ['2026-10-25T16:00:00Z', '● 지금 영업 중 · 새벽 2시까지', '월요일 새벽 1시 (일요일 영업이 이어짐)'],
    ['2026-10-26T06:00:00Z', '○ 오늘은 쉬어요 · 내일 오후 8시 오픈', '월요일 오후 3시 (휴무)']
  ];
  for (const [at, want, what] of WHEN) {
    const o = await open(null, at);
    await o.page.goto(base + 'promo/index.html', { waitUntil: 'networkidle' });
    const got = await status(o.page);
    check(got === want, '영업 상태 · ' + what + ' → ' + want.slice(2), got);
    await o.ctx.close();
  }

  // 모르는 칸(null)은 안 보이고, 사장님이 품절로 바꾸면 메뉴에 '품절'
  LIVE = { v: 1, at: null, data: { items: { 'lagavulin-16': { soldOut: true } } } };
  const o2 = await open((txt) => txt + '\nwindow.DS_DATA.promo = Object.assign({}, window.DS_DATA.promo, { address: null, station: null, directions: null, parking: null, maps: null, hours: null, hoursNote: null, instagram: null });');
  await o2.page.goto(base + 'promo/index.html', { waitUntil: 'networkidle' });
  await o2.page.waitForTimeout(300);
  const st = await o2.page.evaluate(() => ({
    status: !!document.querySelector('.lb-status'), info: document.querySelector('.lb-info').textContent,
    dim: document.querySelectorAll('.lb-info .lb-dim, .lb-maps, [data-act="instagram"]').length,
    rental: !!document.querySelector('[data-act="rental"]'),
    lag: (document.querySelector('#m-lagavulin-16 .lb-sold') || {}).textContent
  }));
  check(!st.status && st.dim === 0 && !st.info.includes('영업시간') && st.info.includes('커버차지 없음') && !st.rental, '비워 둔 칸(주소 · 영업시간 · 인스타)은 숨김', st);
  check(st.lag === '품절', '/admin 에서 품절로 바꾸면 홍보 사이트 메뉴 사진에도 품절', st.lag);
  await o2.ctx.close();
  LIVE = { v: 0, at: null, data: null };
}

/* 폰에서 '동작 줄이기'를 켠 손님: 움직임 없이 처음부터 다 보여야 한다 */
async function reducedMotion(browser, base) {
  console.log('\n■ 동작 줄이기 설정');
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ko-KR', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '#menu', { waitUntil: 'networkidle' });
  await page.waitForSelector('#dsMenu.open', { timeout: 5000 });
  const r = await page.evaluate(() => ({
    reveal: document.querySelectorAll('.ds-reveal').length,
    faded: [...document.querySelectorAll('#dsMenu .ds-row')].filter((x) => getComputedStyle(x).opacity !== '1').length
  }));
  check(r.reveal === 0 && r.faded === 0, '동작 줄이기: 메뉴가 움직임 없이 바로 다 보임', r);
  await ctx.close();
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
    if (!TARGET) await admin(browser, base);     // 마찬가지로 /api/menu 를 로컬 서버가 대신 받는다
    await reducedMotion(browser, base);
    if (!TARGET) await promoSite(browser, base); // 방문 기록 · 그림을 로컬로 돌려서 하는 검사라 로컬에서만
  } catch (e) {
    check(false, '테스트 진행 중 예외', String(e).slice(0, 300));
  } finally {
    await browser.close();
    if (srv) srv.close();
  }
  console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건` : '결과: 모두 통과 ✓'));
  process.exitCode = fails.length ? 1 : 0;
})();
