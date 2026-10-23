/* =============================================================
   결과 기록 → Neon (Postgres)
     POST /api/track          사이트가 보내는 기록 한 건을 저장
     GET  /api/track          연결 상태 확인 ({ db, events })
     GET  /api/track?stats=1  통계 — 배포 전용 주소(…-ca6dj12s-projects.vercel.app)에서만.
                              그 주소는 Vercel 로그인(Deployment Protection) 뒤에 있어서
                              팀원만 열 수 있다. 손님이 쓰는 공개 주소에서는 404.

   Vercel 프로젝트에 Neon 을 연결하면 생기는 DATABASE_URL 을 쓴다.
   연결 전에는 받은 기록을 조용히 버린다 (사이트는 아무 영향 없음).
   테이블은 처음 호출될 때 스스로 만든다.

   손님 브라우저는 DB 주소도 키도 모른다. 이 함수만 DB 에 쓴다.
   누구나 POST 할 수 있는 주소라서 종류 · 길이 · 죄 이름을 여기서 검사한다.
   ============================================================= */
'use strict';
const { neon } = require('@neondatabase/serverless');

const TYPES = ['start', 'quit', 'result', 'signature', 'order', 'menu', 'item', 'share', 'restart', 'lang', 'error'];
const SINS = ['교만', '질투', '분노', '나태', '탐욕', '탐식', '색욕'];
const KNOWN = ['sid', 'type', 'lang', 'v', 'sin', 'second', 'tie', 'points', 'picks'];

const SCHEMA = [
  `create table if not exists deadly_sins_events (
     id         bigint generated always as identity primary key,
     created_at timestamptz not null default now(),
     sid        text not null,
     type       text not null,
     lang       text,
     sin        text,
     second     text,
     tie        boolean,
     points     text,
     picks      text,
     extra      jsonb,
     version    text
   )`,
  // 결과는 세션마다 한 줄: 손님이 뒤로 가서 답을 바꾸면 덮어쓴다
  `create unique index if not exists deadly_sins_one_result
     on deadly_sins_events (sid) where type = 'result'`,
  `create index if not exists deadly_sins_created_at on deadly_sins_events (created_at desc)`
];

let ready = null;   // 함수 인스턴스마다 한 번만 스키마 확인
function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  const sql = neon(url);
  if (!ready) {
    ready = SCHEMA.reduce((p, q) => p.then(() => sql.query(q)), Promise.resolve())
      .catch((e) => { ready = null; throw e; });
  }
  return sql;
}

const cut = (v, n) => (v === undefined || v === null || v === '') ? null : String(v).slice(0, n);
const sin = (v) => (SINS.includes(v) ? v : null);

// 받은 값 → 저장할 한 줄. 받으면 안 되는 값이면 null.
function toRow(d) {
  if (!d || typeof d !== 'object' || !TYPES.includes(d.type)) return null;
  const sid = cut(d.sid, 16);
  if (!sid) return null;
  if (d.type === 'result' && !sin(d.sin)) return null;
  const extra = {};
  Object.keys(d).forEach((k) => { if (!KNOWN.includes(k)) extra[k] = d[k]; });
  if (d.type === 'quit') {   // 퀴즈 도중 화면을 떠남: 몇 번 문항이었는지(q), 몇 개 답했는지
    const q = Number(d.q), answered = Number(d.answered);
    if (!Number.isInteger(q) || q < 1 || q > 30) return null;
    Object.keys(extra).forEach((k) => { delete extra[k]; });
    extra.q = q;
    if (Number.isInteger(answered) && answered >= 0 && answered <= 30) extra.answered = answered;
  }
  const extraJson = Object.keys(extra).length ? JSON.stringify(extra).slice(0, 1000) : null;
  return {
    sid,
    type: d.type,
    lang: d.lang === 'en' ? 'en' : 'ko',
    sin: sin(d.sin),
    second: sin(d.second),
    tie: d.tie === true ? true : (d.type === 'result' ? false : null),
    points: cut(d.points, 160),
    picks: cut(d.picks, 60),
    // 잘린 JSON 은 jsonb 에 못 들어가므로 그때는 글자로 감싼다
    extra: extraJson && (() => { try { JSON.parse(extraJson); return extraJson; } catch (e) { return JSON.stringify({ raw: extraJson }); } })(),
    version: cut(d.v, 20)
  };
}

// 통계는 Vercel 로그인 뒤에 있는 "이 배포의 고유 주소" 로 들어온 요청에만 보여 준다.
// VERCEL_URL = 그 고유 주소. 공개 주소(deadly-sins-mu.vercel.app)로 오면 거절.
function canSeeStats(req) {
  const own = process.env.VERCEL_URL;
  // host 만 본다. x-forwarded-host 같은 헤더는 요청하는 쪽이 마음대로 넣을 수 있다.
  // (host 를 고유 주소로 바꿔 보내면 Vercel 이 그 배포로 보내면서 로그인 검사를 먼저 한다)
  const host = String((req.headers && req.headers.host) || '').toLowerCase();
  return !!own && host === own.toLowerCase();
}

const KST = "(created_at at time zone 'Asia/Seoul')";
async function stats(sql) {
  const q = (text) => sql.query(text);
  const [types, sins, days, picks, recent, errors, items, quits] = await Promise.all([
    q(`select type, count(*)::int as n, count(distinct sid)::int as sessions
       from deadly_sins_events group by type order by n desc`),
    q(`select sin, count(*)::int as n, count(*) filter (where tie)::int as ties
       from deadly_sins_events where type = 'result' group by sin order by n desc`),
    q(`select to_char(${KST}, 'YYYY-MM-DD') as day,
              count(distinct sid) filter (where type = 'start')::int  as started,
              count(*)            filter (where type = 'result')::int as finished,
              count(distinct sid) filter (where type = 'order')::int  as ordered,
              count(distinct sid) filter (where type = 'share')::int  as shared
       from deadly_sins_events group by 1 order by 1 desc limit 30`),
    q(`select p as pick, count(*)::int as n
       from deadly_sins_events, unnest(string_to_array(picks, ' ')) as p
       where type = 'result' and p <> '' group by p order by p`),
    q(`select to_char(${KST}, 'MM-DD HH24:MI') as at, sid, type, lang, sin, second, tie, picks
       from deadly_sins_events order by id desc limit 40`),
    q(`select to_char(${KST}, 'MM-DD HH24:MI') as at, extra->>'message' as message, extra->>'ua' as ua
       from deadly_sins_events where type = 'error' order by id desc limit 10`),
    q(`select extra->>'id' as id, count(*)::int as n, count(distinct sid)::int as sessions
       from deadly_sins_events where type = 'item' group by 1 order by n desc limit 30`),
    // 결과까지 못 간 세션이 마지막으로 보던 문항 (돌아와서 끝낸 세션은 빠진다)
    q(`select (extra->>'q')::int as q, count(*)::int as n
       from (select distinct on (sid) sid, extra from deadly_sins_events
             where type = 'quit' order by sid, id desc) last
       where not exists (select 1 from deadly_sins_events r where r.type = 'result' and r.sid = last.sid)
       group by 1 order by 1`)
  ]);
  const total = sins.reduce((a, r) => a + r.n, 0);
  return {
    generatedAt: new Date().toISOString(),
    results: { total, bySin: sins.map((r) => Object.assign(r, { pct: total ? Math.round(1000 * r.n / total) / 10 : 0 })) },
    events: types,
    days,
    picks,
    items,      // 메뉴판에서 많이 눌러 본 항목
    quits,      // 퀴즈를 그만둔 문항 (q 번에서 n 명)
    recent,
    errors
  };
}

async function save(sql, r) {
  const values = [r.sid, r.type, r.lang, r.sin, r.second, r.tie, r.points, r.picks, r.extra, r.version];
  if (r.type === 'result') {
    await sql.query(
      `insert into deadly_sins_events (sid, type, lang, sin, second, tie, points, picks, extra, version)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10)
       on conflict (sid) where type = 'result' do update set
         created_at = now(), lang = excluded.lang, sin = excluded.sin, second = excluded.second,
         tie = excluded.tie, points = excluded.points, picks = excluded.picks,
         extra = excluded.extra, version = excluded.version`, values);
  } else {
    await sql.query(
      `insert into deadly_sins_events (sid, type, lang, sin, second, tie, points, picks, extra, version)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10)`, values);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const sql = db();
    if (req.method === 'GET') {
      const wantStats = !!(req.query && req.query.stats);
      if (wantStats && !canSeeStats(req)) return res.status(404).end();
      if (!sql) return res.status(200).json({ db: false });
      await ready;
      if (wantStats) return res.status(200).json(await stats(sql));
      const [{ n }] = await sql.query('select count(*)::int as n from deadly_sins_events');
      return res.status(200).json({ db: true, events: n });
    }
    if (req.method !== 'POST') return res.status(405).end();
    if (!sql) return res.status(204).end();

    let d = req.body;
    if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { return res.status(400).end(); } }
    if (Buffer.isBuffer(d)) { try { d = JSON.parse(d.toString('utf8')); } catch (e) { return res.status(400).end(); } }
    const row = toRow(d);
    if (!row) return res.status(400).end();

    await ready;
    await save(sql, row);
    return res.status(204).end();
  } catch (e) {
    console.error('[track]', e && e.message);
    return res.status(500).end();
  }
};
module.exports.toRow = toRow;      // 테스트용
module.exports.SCHEMA = SCHEMA;
module.exports.save = save;
