#!/usr/bin/env node
/* =============================================================
   api/track.js 점검 — 진짜 Postgres(PGlite, 메모리) 위에서 돌린다
     node tools/test-api.js
   Neon 드라이버 자리에 PGlite 를 끼워 넣어서, 테이블 만들기 · 저장 · 결과 덮어쓰기 ·
   이상한 입력 거르기가 실제 SQL 로 되는지 확인한다. 하나라도 틀리면 종료 코드 1.
   ============================================================= */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');

const fails = [];
const check = (ok, what, detail) => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${what}${!ok && detail !== undefined ? '  → ' + JSON.stringify(detail) : ''}`);
  if (!ok) fails.push(what);
};

function fakeRes() {
  return {
    code: 0, body: undefined, headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.code = c; return this; },
    json(o) { this.body = o; return this; },
    end() { return this; }
  };
}

(async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const pg = new PGlite();

  // @neondatabase/serverless 를 PGlite 로 바꿔 끼운다 (api/track.js 가 require 하기 전에)
  const driverPath = require.resolve('@neondatabase/serverless', { paths: [ROOT] });
  require.cache[driverPath] = {
    id: driverPath, filename: driverPath, loaded: true,
    exports: { neon: () => ({ query: async (text, params) => (await pg.query(text, params || [])).rows }) }
  };

  const handler = require(path.join(ROOT, 'api', 'track.js'));
  const call = async (method, body, extra) => { const res = fakeRes(); await handler(Object.assign({ method, body, headers: {}, query: {} }, extra || {}), res); return res; };

  console.log('■ DB 연결 전 (DATABASE_URL 없음)');
  delete process.env.DATABASE_URL; delete process.env.POSTGRES_URL;
  check((await call('GET')).body.db === false, 'GET → db:false');
  check((await call('POST', '{"sid":"a","type":"start"}')).code === 204, 'POST 는 조용히 버림 (204)');

  console.log('\n■ DB 연결 후');
  process.env.DATABASE_URL = 'postgresql://test';
  const send = (o) => call('POST', typeof o === 'string' ? o : JSON.stringify(o));
  check((await send({ sid: 'abc', type: 'start', lang: 'ko', v: '2026-10-19' })).code === 204, '시작 저장');
  check((await send({ sid: 'abc', type: 'result', lang: 'ko', sin: '탐욕', second: '교만', tie: true, points: '탐욕 8 · 교만 8', picks: 'Q1B Q2B' })).code === 204, '결과 저장');
  check((await send({ sid: 'abc', type: 'result', lang: 'ko', sin: '나태', second: '탐욕', tie: false, points: '나태 9', picks: 'Q1D Q2A' })).code === 204, '같은 세션 결과 다시 → 덮어쓰기');
  check((await send({ sid: 'zzz', type: 'result', lang: 'en', sin: '색욕', second: '교만', points: '색욕 9', picks: 'Q1A' })).code === 204, '다른 세션 결과 → 새 줄');
  check((await send({ sid: 'abc', type: 'order', lang: 'ko', sin: '나태' })).code === 204, '바텐더 화면 저장');
  check((await send({ sid: 'x', type: 'error', message: 'boom', file: 'enhance.js', line: 3, ua: 'UA' })).code === 204, '오류 저장 (기타는 jsonb)');
  check((await call('POST', { sid: 'obj', type: 'start' })).code === 204, '본문이 이미 객체여도 저장');
  check((await call('POST', Buffer.from('{"sid":"buf","type":"menu"}'))).code === 204, '본문이 Buffer 여도 저장');
  check((await send({ sid: 'abc', type: 'item', id: 'lagavulin-16' })).code === 204, '메뉴 항목 열람 저장');
  // 퀴즈 도중 떠남: q1 은 3번에서 떠났다가 4번에서 다시 떠남(마지막 것만), q2 는 5번, abc 는 떠났다가 돌아와 결과까지
  check((await send({ sid: 'q1', type: 'quit', q: 3, answered: 2 })).code === 204, '이탈 문항 저장');
  await send({ sid: 'q1', type: 'quit', q: 4, answered: 3 });
  await send({ sid: 'q2', type: 'quit', q: 5, answered: 4, junk: 'x'.repeat(50) });
  await send({ sid: 'abc', type: 'quit', q: 2, answered: 1 });
  check((await send({ sid: 'q3', type: 'quit', q: 'drop' })).code === 400, '이탈 문항이 숫자가 아니면 → 400');
  check((await send({ sid: 'q3', type: 'quit', q: 99 })).code === 400, '이탈 문항이 범위 밖이면 → 400');
  // 1층 배너 홍보 사이트: lb1 은 들어와서 오시는 길 · 인스타, lb2 는 위스키 병을 눌러 메뉴로
  check((await send({ sid: 'lb1', type: 'visit', from: 'promo', act: 'open' })).code === 204, '1층 홍보 사이트 방문 저장');
  await send({ sid: 'lb1', type: 'visit', from: 'promo', act: 'way' });
  await send({ sid: 'lb1', type: 'visit', from: 'promo', act: 'instagram' });
  await send({ sid: 'lb2', type: 'visit', from: 'promo', act: 'open' });
  await send({ sid: 'lb2', type: 'visit', from: 'promo', act: 'item', id: 'dalmore-15' });
  await send({ sid: 'lb2', type: 'visit', from: 'promo', act: 'rental', via: 'phone' });
  await send({ sid: 't1', type: 'start' });
  await send({ sid: 't1', type: 'result', sin: '교만', second: '질투', points: '교만 9', picks: 'Q1A' });
  check((await send({ sid: 'x', type: 'drop table' })).code === 400, '모르는 종류 → 400');
  check((await send({ sid: 'x', type: 'result', sin: '<script>' })).code === 400, '이상한 죄 이름의 결과 → 400');
  check((await send({ type: 'start' })).code === 400, '세션 없음 → 400');
  check((await send('not json')).code === 400, '깨진 JSON → 400');
  check((await send({ sid: 'big', type: 'error', message: 'x'.repeat(5000) })).code === 204, '긴 오류 메시지 → 잘라서 저장');
  check((await call('DELETE')).code === 405, 'DELETE → 405');

  const rows = (await pg.query('select sid, type, lang, sin, second, tie, points, picks, extra from deadly_sins_events order by id')).rows;
  const results = rows.filter((r) => r.type === 'result');
  const abc = results.filter((r) => r.sid === 'abc');
  check(abc.length === 1 && abc[0].sin === '나태' && abc[0].picks === 'Q1D Q2A' && abc[0].tie === false, '세션 abc 의 결과는 마지막 것 한 줄', abc);
  check(results.length === 3, '결과 줄은 세션 수만큼 (3)', results.map((r) => r.sid));
  const err = rows.find((r) => r.sid === 'x' && r.type === 'error');
  check(err && err.extra && err.extra.message === 'boom' && err.extra.line === 3, '오류의 기타 칸', err && err.extra);
  const big = rows.find((r) => r.sid === 'big');
  check(big && big.extra && JSON.stringify(big.extra).length <= 1100, '긴 기타는 1000자 안팎으로 잘림', big && JSON.stringify(big.extra).length);
  check(rows.every((r) => r.sid.length <= 16), '세션은 16자 이내');
  const quitRow = rows.find((r) => r.sid === 'q2' && r.type === 'quit');
  check(quitRow && JSON.stringify(quitRow.extra) === '{"q":5,"answered":4}', '이탈 기록에는 문항 번호 · 답한 수만', quitRow && quitRow.extra);

  const get = await call('GET');
  check(get.body.db === true && get.body.events === rows.length, `GET → db:true, events:${rows.length}`, get.body);

  console.log('\n■ 통계 (?stats=1)');
  process.env.VERCEL_URL = 'deadly-sins-abc123-ca6dj12s-projects.vercel.app';
  const pub = await call('GET', undefined, { query: { stats: '1' }, headers: { host: 'deadly-sins-mu.vercel.app' } });
  check(pub.code === 404 && pub.body === undefined, '공개 주소에서는 404 (통계 숨김)');
  const spoof = await call('GET', undefined, { query: { stats: '1' }, headers: { host: 'evil.example' } });
  check(spoof.code === 404, '다른 주소도 404');
  const fwd = await call('GET', undefined, { query: { stats: '1' }, headers: { host: 'deadly-sins-mu.vercel.app', 'x-forwarded-host': 'deadly-sins-abc123-ca6dj12s-projects.vercel.app' } });
  check(fwd.code === 404, 'x-forwarded-host 를 꾸며 보내도 404');
  const own = await call('GET', undefined, { query: { stats: '1' }, headers: { host: 'deadly-sins-abc123-ca6dj12s-projects.vercel.app' } });
  const st = own.body || {};
  check(own.code === 200 && st.results && st.results.total === 3, '배포 고유 주소에서는 통계 (완주 3)', st.results);
  check(st.results && st.results.bySin.some((r) => r.sin === '나태' && r.n === 1 && r.pct === 33.3), '죄별 명수 · 비율', st.results && st.results.bySin);
  check(Array.isArray(st.days) && st.days.length >= 1 && st.days[0].finished === 3, '날짜별 (한국 시간)', st.days);
  check(Array.isArray(st.picks) && st.picks.some((r) => r.pick === 'Q1D' && r.n === 1), '보기별 선택 수', st.picks);
  check(Array.isArray(st.recent) && st.recent.length === rows.length, '최근 기록', st.recent && st.recent.length);
  check(Array.isArray(st.errors) && st.errors.some((r) => r.message === 'boom'), '최근 오류', st.errors);
  check(Array.isArray(st.items) && st.items.some((r) => r.id === 'lagavulin-16' && r.n === 1), '많이 눌러 본 메뉴', st.items);
  check(st.promo && st.promo.opened === 2 && st.promo.clicked_menu === 1 && st.promo.clicked_way === 1 && st.promo.clicked_contact === 1 && st.promo.clicked_rental === 1,
    '1층 홍보 사이트 (들어옴 2 · 메뉴 1 · 오시는 길 1 · 인스타/전화 1 · 대관 문의 1)', st.promo);
  check(JSON.stringify(st.quits) === JSON.stringify([{ q: 4, n: 1 }, { q: 5, n: 1 }]),
    '그만둔 문항: 세션마다 마지막 것, 끝까지 한 세션은 빼고', st.quits);
  delete process.env.VERCEL_URL;
  check((await call('GET', undefined, { query: { stats: '1' }, headers: { host: 'x' } })).code === 404, 'VERCEL_URL 이 없으면 통계 꺼짐');

  // 새 인스턴스가 떠도 스키마 만들기가 다시 돌아도 문제없는지 (if not exists)
  delete require.cache[path.join(ROOT, 'api', 'track.js')];
  const again = require(path.join(ROOT, 'api', 'track.js'));
  const res = fakeRes(); await again({ method: 'GET' }, res);
  check(res.code === 200 && res.body.events === rows.length, '함수가 새로 떠도 테이블 그대로');

  /* ---------- api/menu.js: 사장님 메뉴 고치기 ---------- */
  console.log('\n■ 메뉴 고치기 (/api/menu)');
  const menu = require(path.join(ROOT, 'api', 'menu.js'));
  const mcall = async (method, body, headers) => {
    const r = fakeRes(); await menu({ method, body, headers: Object.assign({ 'x-real-ip': '1.2.3.4' }, headers || {}), query: {} }, r); return r;
  };
  const KEY = { 'x-admin-key': 'correct horse battery' };
  const empty = await mcall('GET');
  check(empty.code === 200 && empty.body.v === 0 && empty.body.data === null, '처음엔 고친 것 없음', empty.body);
  check(/s-maxage=10/.test(empty.headers['Cache-Control']), '손님용 읽기는 10초 캐시', empty.headers['Cache-Control']);
  delete process.env.ADMIN_PASSWORD;
  check((await mcall('POST', { action: 'check' }, KEY)).code === 503, '비밀번호 환경 변수가 없으면 저장 막힘 (503)');
  process.env.ADMIN_PASSWORD = 'correct horse battery';
  for (let i = 0; i < 12; i++) await mcall('POST', { action: 'check' }, { 'x-real-ip': '5.5.5.5' });
  check((await mcall('POST', { action: 'check' })).code === 401, '비밀번호 없이 → 401');
  check((await mcall('POST', { action: 'check' }, Object.assign({}, KEY, { 'x-real-ip': '5.5.5.5' }))).code === 200,
    '비밀번호 없이 온 요청은 세지 않음 (다른 사이트가 사장님을 잠그지 못하게)');
  check((await mcall('POST', { action: 'check' }, { 'x-admin-key': 'wrong' })).code === 401, '틀린 비밀번호 → 401');
  const ok = await mcall('POST', { action: 'check' }, KEY);
  check(ok.code === 200 && ok.body.ok === true, '맞는 비밀번호 → 200');

  const saveData = {
    signaturePrice: '17000',
    items: { 'lagavulin-16': { g: '24000', b: '380,000', soldOut: true }, 'sig:교': { soldOut: true }, cheesecake: { new: false }, coke: { hidden: true, junk: 1 } },
    extra: [{ id: 'x-ab12', section: 'bites', ko: '<b>나쵸</b>', en: 'Nachos', p: '9000', about: { ko: '치즈 나쵸', en: '' }, new: true }]
  };
  const saved = await mcall('POST', JSON.stringify({ action: 'save', data: saveData }), KEY);
  const sd = saved.body && saved.body.data;
  check(saved.code === 200 && saved.body.v > 0, '저장 → 새 버전', saved.body);
  check(sd && sd.signaturePrice === 17000 && sd.items['lagavulin-16'].g === '24,000' && sd.items['lagavulin-16'].b === '380,000',
    '가격은 숫자로 받아 "24,000" 꼴로', sd && sd.items);
  check(sd && sd.items.coke && sd.items.coke.hidden === true && !('junk' in sd.items.coke), '모르는 칸은 버림', sd && sd.items.coke);
  check(sd && sd.extra[0].ko === '<b>나쵸</b>' && sd.extra[0].p === '9,000' && !('en' in sd.extra[0].about), '새 메뉴 (글자는 그대로 두고 화면에서 이스케이프)', sd && sd.extra);
  const now = await mcall('GET');
  check(now.body.v === saved.body.v && now.body.data.items['sig:교'].soldOut === true, '손님 화면이 읽는 값 = 마지막 저장', now.body);

  const bad = async (data, what) => check((await mcall('POST', { action: 'save', data }, KEY)).code === 400, what);
  await bad({ items: { 'DROP TABLE': { p: '1' } } }, '이상한 메뉴 id → 400');
  await bad({ signaturePrice: -5 }, '음수 가격 → 400');
  await bad({ extra: [{ id: 'x-ab12', section: 'bar', ko: 'a' }] }, '모르는 구역의 새 메뉴 → 400');
  await bad({ extra: [{ id: 'nope', section: 'bites', ko: 'a' }] }, '새 메뉴 id 꼴이 틀림 → 400');
  await bad({ extra: [{ id: 'x-ab12', section: 'bites' }] }, '이름 없는 새 메뉴 → 400');
  check(JSON.stringify(menu.validate({ items: { coke: { p: 'abc' } } })) === '{}', '숫자가 아닌 가격은 무시');

  await mcall('POST', { action: 'save', data: { signaturePrice: 18000 } }, KEY);
  const undo = await mcall('POST', { action: 'undo' }, KEY);
  check(undo.code === 200 && undo.body.data.signaturePrice === 17000 && undo.body.data.items, '되돌리기 → 직전 저장 내용', undo.body.data);

  // 틀린 비밀번호를 계속 넣으면 그 IP 는 잠시 막힘 (맞는 비밀번호도)
  for (let i = 0; i < 10; i++) await mcall('POST', { action: 'check' }, { 'x-admin-key': 'guess' + i, 'x-real-ip': '9.9.9.9' });
  check((await mcall('POST', { action: 'check' }, Object.assign({}, KEY, { 'x-real-ip': '9.9.9.9' }))).code === 429, '틀리기 10번 → 15분 막힘 (429)');
  check((await mcall('POST', { action: 'check' }, KEY)).code === 200, '다른 IP 는 그대로');
  delete process.env.ADMIN_PASSWORD;

  console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건` : '결과: 모두 통과 ✓'));
  process.exitCode = fails.length ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(1); });
