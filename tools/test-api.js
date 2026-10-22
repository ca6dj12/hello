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
  check(results.length === 2, '결과 줄은 세션 수만큼 (2)', results.map((r) => r.sid));
  const err = rows.find((r) => r.sid === 'x' && r.type === 'error');
  check(err && err.extra && err.extra.message === 'boom' && err.extra.line === 3, '오류의 기타 칸', err && err.extra);
  const big = rows.find((r) => r.sid === 'big');
  check(big && big.extra && JSON.stringify(big.extra).length <= 1100, '긴 기타는 1000자 안팎으로 잘림', big && JSON.stringify(big.extra).length);
  check(rows.every((r) => r.sid.length <= 16), '세션은 16자 이내');

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
  check(own.code === 200 && st.results && st.results.total === 2, '배포 고유 주소에서는 통계 (완주 2)', st.results);
  check(st.results && st.results.bySin.some((r) => r.sin === '나태' && r.n === 1 && r.pct === 50), '죄별 명수 · 비율', st.results && st.results.bySin);
  check(Array.isArray(st.days) && st.days.length >= 1 && st.days[0].finished === 2, '날짜별 (한국 시간)', st.days);
  check(Array.isArray(st.picks) && st.picks.some((r) => r.pick === 'Q1D' && r.n === 1), '보기별 선택 수', st.picks);
  check(Array.isArray(st.recent) && st.recent.length === rows.length, '최근 기록', st.recent && st.recent.length);
  check(Array.isArray(st.errors) && st.errors.some((r) => r.message === 'boom'), '최근 오류', st.errors);
  delete process.env.VERCEL_URL;
  check((await call('GET', undefined, { query: { stats: '1' }, headers: { host: 'x' } })).code === 404, 'VERCEL_URL 이 없으면 통계 꺼짐');

  // 새 인스턴스가 떠도 스키마 만들기가 다시 돌아도 문제없는지 (if not exists)
  delete require.cache[path.join(ROOT, 'api', 'track.js')];
  const again = require(path.join(ROOT, 'api', 'track.js'));
  const res = fakeRes(); await again({ method: 'GET' }, res);
  check(res.code === 200 && res.body.events === rows.length, '함수가 새로 떠도 테이블 그대로');

  console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건` : '결과: 모두 통과 ✓'));
  process.exitCode = fails.length ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(1); });
