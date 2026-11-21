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
  // 자동으로 여는 프로그램(배포 미리보기 봇 · 검사 도구)은 받은 척만 하고 저장하지 않는다
  const before = (await call('GET')).body.events;
  const a1 = await send({ sid: 'bot1', type: 'visit', lang: 'en', from: 'promo', act: 'open', auto: 1 });
  const a2 = await call('POST', { sid: 'bot2', type: 'visit', lang: 'en', from: 'promo', act: 'open' }, { headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36' } });
  const a3 = await call('POST', { sid: 'bot3', type: 'start' }, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } });
  const a4 = await call('POST', { sid: 'phone1', type: 'visit', lang: 'en', from: 'promo', act: 'open' }, { headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1' } });
  const after = (await call('GET')).body.events;
  const ua = (s) => handler.automated({ headers: { 'user-agent': s } }, {});
  check(!ua('Mozilla/5.0 (Linux; Android 11; CUBOT NOTE 20) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36') && !ua('Mozilla/5.0 (Linux; Android 14; SM-S921N) KAKAOTALK 10.9.5') && !ua('') &&
    ua('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)') && ua('Twitterbot/1.0') && ua('Mozilla/5.0 Chrome/120 Lighthouse'),
    '봇 판별: 진짜 폰(카카오톡 인앱 · 기종 이름에 BOT) 은 통과, 크롤러 · 검사 도구만 거름');
  check(a1.code === 204 && a2.code === 204 && a3.code === 204 && a4.code === 204 && after === before + 1,
    '자동화 브라우저 · 봇의 기록은 저장하지 않음 (auto 표시 · 헤드리스 · 크롤러), 진짜 폰은 저장', { before, after });
  // 언어: ko · en · zh 만. 모르는 값은 ko 로
  await send({ sid: 'zh1', type: 'visit', lang: 'zh', from: 'promo', act: 'open' });
  await send({ sid: 'ja1', type: 'visit', lang: 'ja', from: 'promo', act: 'open' });
  check(handler.toRow({ sid: 'a', type: 'start', lang: 'zh' }).lang === 'zh' && handler.toRow({ sid: 'a', type: 'start', lang: 'ja' }).lang === 'ja' && handler.toRow({ sid: 'a', type: 'start', lang: 'xx' }).lang === 'ko' && handler.toRow({ sid: 'a', type: 'start' }).lang === 'ko',
    '언어는 ko · en · zh · ja 만 저장 (모르는 값 · 빈 값은 ko)');
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
  check(own.code === 200 && st.results && st.results.total === 3 && st.quiz === 'v1', '배포 고유 주소에서는 통계 (완주 3, 버전 표시 없는 기록 = v1)', st.results);
  check(st.results && st.results.bySin.some((r) => r.sin === '나태' && r.n === 1 && r.pct === 33.3), '죄별 명수 · 비율', st.results && st.results.bySin);
  check(Array.isArray(st.days) && st.days.length >= 1 && st.days[0].finished === 3, '날짜별 (한국 시간)', st.days);
  check(Array.isArray(st.options) && st.options.length === 0 && Array.isArray(st.previous) && st.previous.length === 0, 'v1 기록(Q1D 꼴)은 선택지 표를 만들지 않음', st.options);
  check(Array.isArray(st.recent) && st.recent.length === rows.length, '최근 기록', st.recent && st.recent.length);
  check(Array.isArray(st.errors) && st.errors.some((r) => r.message === 'boom'), '최근 오류', st.errors);
  check(Array.isArray(st.items) && st.items.some((r) => r.id === 'lagavulin-16' && r.n === 1), '많이 눌러 본 메뉴', st.items);
  check(st.promo && st.promo.opened === 5 && st.promo.opened_en === 1 && st.promo.opened_zh === 1 && st.promo.opened_ja === 1 && st.promo.clicked_menu === 1 && st.promo.clicked_way === 1 && st.promo.clicked_contact === 1 && st.promo.clicked_rental === 1,
    '1층 홍보 사이트 (들어옴 5 · 그중 영어 1 · 중국어 1 · 일본어 1 · 메뉴 1 · 오시는 길 1 · 인스타/전화 1 · 대관 문의 1)', st.promo);
  check(JSON.stringify(st.quits) === JSON.stringify([{ q: 4, n: 1 }, { q: 5, n: 1 }]),
    '그만둔 문항: 세션마다 마지막 것, 끝까지 한 세션은 빼고', st.quits);
  /* ---------- 설문 v2: 버전 표시 · 동점 순서 · 버전별 통계 ---------- */
  console.log('\n■ 설문 v2 (버전 표시 · 동점 순서 · 버전별 통계)');
  const order = async (quiz) => call('GET', undefined, { query: { order: '1', quiz } });
  const ord0 = await order('v2');
  check(ord0.code === 200 && ord0.body.order.join('') === '교질분나탐식색' && !('n' in ord0.body), '동점 순서: 결과가 없으면 기본 순서 (건수는 내보내지 않음)', ord0.body);
  check((await order('drop table')).code === 400 && (await order('')).code === 400, '동점 순서: 이상한 버전 → 400');
  const v2 = (sid, sin, picks, more) => send(Object.assign({ sid, type: 'result', quiz: 'v2', sin, second: '교만', points: '', picks }, more || {}));
  await send({ sid: 'n1', type: 'start', quiz: 'v2' });
  check((await v2('n1', '분노', 'Q1분 Q2교 Q3색 Q4분 Q5교 Q6분 Q7식')).code === 204, 'v2 결과 저장 (고른 선택지를 죄 이름으로)');
  await v2('n2', '분노', 'Q1분 Q2질 Q3색 Q4나 Q5색 Q6분 Q7분', { tie: true, tieBy: 'recent' });
  await v2('n3', '탐욕', 'Q1탐 Q2탐 Q3탐 Q4식 Q5나 Q6탐 Q7질');
  await v2('n4', '색욕', 'Q1나 Q2식 Q3색 Q4교 Q5색 Q6색 Q7색', { tie: true, tieBy: 'random' });
  await send({ sid: 'n5', type: 'quit', quiz: 'v2', q: 1, answered: 0, junk: 1 });
  await send({ sid: 'n6', type: 'start', quiz: '<script>' });
  const tagged = (await pg.query("select sid, type, extra from deadly_sins_events where sid in ('n1','n5','n6') and type <> 'result' order by sid")).rows;
  check(JSON.stringify(tagged.map((r) => r.extra)) === JSON.stringify([{ quiz: 'v2' }, { q: 1, quiz: 'v2', answered: 0 }, null]),   // jsonb 는 키를 길이순으로 돌려준다
    '설문 버전 표시는 기타 칸에 (이탈 기록에도), 이상한 값은 버림', tagged.map((r) => r.extra));
  const ord1 = await order('v2');
  check(ord1.body.order.join('') === '교질나식탐색분', '동점 순서: 덜 나온 죄가 앞 (안 나온 죄 → 1번 나온 죄 → 2번 나온 분노)', ord1.body.order.join(''));
  check((await order('v3')).body.order.join('') === '교질분나탐식색', '동점 순서는 설문 버전마다 따로');
  await send({ sid: 'late', type: 'result', sin: '질투', second: '교만', points: '', picks: 'Q1C' });   // 배포 전에 열어 둔 화면에서 뒤늦게 온 v1 결과
  const s2 = (await call('GET', undefined, { query: { stats: '1' }, headers: { host: process.env.VERCEL_URL } })).body || {};
  check(s2.quiz === 'v2' && s2.results.total === 4 && s2.results.bySin[0].sin === '분노' && s2.results.bySin[0].pct === 50 && s2.results.bySin.length === 7,
    '통계는 번호가 가장 큰 설문 버전의 것 (v2 완주 4, 안 나온 죄도 0 으로 · 뒤늦게 온 v1 결과에 뒤집히지 않음)', s2.results);
  check(s2.results.ties === 2 && s2.results.tieRate === 50 && s2.results.tieBy.recent === 1 && s2.results.tieBy.random === 1 && s2.results.chi2 === 6.5,
    '동점 비율 · 동점을 가른 방식 · 균등 검정', s2.results);
  const q1 = (s2.options || [])[0] || {};
  check(s2.options.length === 7 && q1.q === 1 && q1.answered === 4 && q1.eff === 2.83 && q1.picks[0].sin === '분노' && q1.picks[0].pct === 50 && q1.picks[0].warn === false,
    '문항별 선택지 선택률 · 유효 선택지 수', q1);
  const q3 = s2.options[2].picks;
  check(q3[0].sin === '색욕' && q3[0].pct === 75 && q3[0].warn === true, '선택률이 50% 를 넘는 선택지는 경고', q3);
  const wrath = (s2.sinAvg || []).find((r) => r.sin === '분노');
  check(wrath && wrath.options === 4 && wrath.pct === 37.5, '죄별 평균 선택률', s2.sinAvg);
  check(s2.previous.length === 1 && s2.previous[0].quiz === 'v1' && s2.previous[0].total === 4, '이전 설문 버전은 따로 요약', s2.previous);
  check(JSON.stringify(s2.quits) === JSON.stringify([{ q: 1, n: 1 }]), '그만둔 문항도 지금 버전 것만', s2.quits);
  delete process.env.VERCEL_URL;
  check((await call('GET', undefined, { query: { stats: '1' }, headers: { host: 'x' } })).code === 404, 'VERCEL_URL 이 없으면 통계 꺼짐');
  process.env.DATABASE_URL = '';
  delete require.cache[path.join(ROOT, 'api', 'track.js')];
  const noDb = fakeRes(); await require(path.join(ROOT, 'api', 'track.js'))({ method: 'GET', query: { order: '1', quiz: 'v2' }, headers: {} }, noDb);
  check(noDb.code === 200 && noDb.body.order === null, 'DB 가 없으면 동점 순서 없음 (사이트는 무작위로)', noDb.body);
  process.env.DATABASE_URL = 'postgresql://test';

  // 새 인스턴스가 떠도 스키마 만들기가 다시 돌아도 문제없는지 (if not exists)
  delete require.cache[path.join(ROOT, 'api', 'track.js')];
  const again = require(path.join(ROOT, 'api', 'track.js'));
  const res = fakeRes(); await again({ method: 'GET' }, res);
  const [{ n: allRows }] = (await pg.query('select count(*)::int as n from deadly_sins_events')).rows;
  check(res.code === 200 && res.body.events === allRows && allRows > rows.length, '함수가 새로 떠도 테이블 그대로');

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

  // 가게 정보 (영업 요일 · 시간 · 라스트오더 · 공지 · 연락처)
  const INFO = { hours: { days: [6, 1, 2, 3, 4, 5], open: '19:00', close: '03:00', last: '02:30' }, notice: { ko: ' 12/25 휴무 ', en: '', zh: '12月25日休息', ja: '12/25 休業' }, phone: '', instagram: 'deadlysins.5f', email: 'a@b.kr' };
  const savedInfo = await mcall('POST', { action: 'save', data: { info: INFO } }, KEY);
  // jsonb 는 키 순서를 바꿔 돌려주므로 키를 정렬해서 견준다
  const canon = (o) => JSON.stringify(o, (k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.keys(v).sort().reduce((a, x) => { a[x] = v[x]; return a; }, {}) : v));
  check(savedInfo.code === 200 && canon(savedInfo.body.data.info) === canon({ hours: { days: [1, 2, 3, 4, 5, 6], open: '19:00', close: '03:00', last: '02:30' },
    notice: { ko: '12/25 휴무', zh: '12月25日休息', ja: '12/25 休業' }, phone: '', instagram: 'deadlysins.5f', email: 'a@b.kr' }),
    '가게 정보 저장: 요일은 정렬, 빈 공지 칸은 빠짐, 비운 전화는 빈 값 그대로(화면에서 숨김)', savedInfo.body.data);
  check(JSON.stringify((await mcall('GET')).body.data.info.hours.days) === '[1,2,3,4,5,6]', '손님 화면이 읽는 주소(GET)에도 가게 정보가 나옴');
  await bad({ info: { hours: { days: [], open: '19:00', close: '03:00' } } }, '영업 요일이 하나도 없음 → 400');
  await bad({ info: { hours: { days: [7], open: '19:00', close: '03:00' } } }, '없는 요일 번호 → 400');
  await bad({ info: { hours: { days: [1, 1], open: '19:00', close: '03:00' } } }, '같은 요일 두 번 → 400');
  await bad({ info: { hours: { days: [1], open: '7pm', close: '03:00' } } }, '시간 꼴이 틀림 → 400');
  await bad({ info: { hours: { days: [1], open: '19:00', close: '19:00' } } }, '여는 시간 = 닫는 시간 → 400');
  await bad({ info: { phone: '<script>alert(1)</script>' } }, '전화번호에 이상한 글자 → 400');
  await bad({ info: { instagram: 'javascript:alert(1)' } }, '인스타 아이디에 이상한 글자 → 400');
  await bad({ info: { email: 'not-an-email' } }, '이메일 꼴이 틀림 → 400');
  await bad({ info: 'x' }, '가게 정보가 객체가 아님 → 400');
  check(JSON.stringify(menu.validate({ info: {} })) === '{}' && JSON.stringify(menu.validate({ info: { notice: { ko: 'x'.repeat(500) } } }).info.notice.ko.length) === '120', '빈 가게 정보는 저장 안 함 · 공지는 120자까지');

  // 틀린 비밀번호를 계속 넣으면 그 IP 는 잠시 막힘 (맞는 비밀번호도)
  for (let i = 0; i < 10; i++) await mcall('POST', { action: 'check' }, { 'x-admin-key': 'guess' + i, 'x-real-ip': '9.9.9.9' });
  check((await mcall('POST', { action: 'check' }, Object.assign({}, KEY, { 'x-real-ip': '9.9.9.9' }))).code === 429, '틀리기 10번 → 15분 막힘 (429)');
  check((await mcall('POST', { action: 'check' }, KEY)).code === 200, '다른 IP 는 그대로');
  delete process.env.ADMIN_PASSWORD;

  console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건` : '결과: 모두 통과 ✓'));
  process.exitCode = fails.length ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(1); });
