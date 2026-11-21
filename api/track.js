/* =============================================================
   결과 기록 → Neon (Postgres)
     POST /api/track          사이트가 보내는 기록 한 건을 저장
     GET  /api/track          연결 상태 확인 ({ db, events })
     GET  /api/track?order=1&quiz=v2   동점일 때 줄 죄의 순서 — 누구나 (손님 화면이 읽는다).
                              그 설문 버전의 최근 결과 100건에서 적게 나온 죄가 앞. 순서만 내보내고 건수는 안 내보낸다.
     GET  /api/track?stats=1  통계 — 배포 전용 주소(…-ca6dj12s-projects.vercel.app)에서만.
                              결과 · 선택지 선택률은 설문 버전별 (가장 최근 버전이 results · options, 이전 것은 previous).
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

const TYPES = ['visit', 'start', 'quit', 'result', 'signature', 'order', 'menu', 'item', 'share', 'restart', 'lang', 'error'];
const SINS = ['교만', '질투', '분노', '나태', '탐욕', '탐식', '색욕'];
const KEYS = ['교', '질', '분', '나', '탐', '식', '색'];   // 사이트가 쓰는 한 글자 이름 (SINS 와 같은 순서)
const KNOWN = ['sid', 'type', 'lang', 'v', 'sin', 'second', 'tie', 'points', 'picks'];
const QUIZ_RE = /^v\d{1,3}$/;   // 설문 버전 (public/quiz.js 의 version). 표시가 없는 옛 기록은 v1

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
  const quiz = typeof d.quiz === 'string' && QUIZ_RE.test(d.quiz) ? d.quiz : null;
  delete extra.quiz;
  if (d.type === 'quit') {   // 퀴즈 도중 화면을 떠남: 몇 번 문항이었는지(q), 몇 개 답했는지
    const q = Number(d.q), answered = Number(d.answered);
    if (!Number.isInteger(q) || q < 1 || q > 30) return null;
    Object.keys(extra).forEach((k) => { delete extra[k]; });
    extra.q = q;
    if (Number.isInteger(answered) && answered >= 0 && answered <= 30) extra.answered = answered;
  }
  if (quiz) extra.quiz = quiz;   // 통계를 설문 버전별로 나누는 표시
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
const QUIZ_OF = "coalesce(extra->>'quiz', 'v1')";

/* 동점일 때 줄 죄의 순서: 그 설문 버전의 최근 결과 100건에서 적게 나온 죄가 앞.
   건수가 같으면 더 오래전에 나온 죄가 앞 (한 번도 안 나온 죄가 맨 앞). */
async function tieOrder(sql, quiz) {
  const rows = await sql.query(
    `select sin, count(*)::int as n, max(created_at) as last
       from (select sin, created_at from deadly_sins_events
              where type = 'result' and ${QUIZ_OF} = $1 order by created_at desc limit 100) r
      group by sin`, [quiz]);
  const by = {};
  rows.forEach((r) => { by[r.sin] = { n: r.n, last: new Date(r.last).getTime() || 0 }; });
  return SINS.map((name, i) => Object.assign({ k: KEYS[i], i, n: 0, last: 0 }, by[name]))
    .sort((a, b) => a.n - b.n || a.last - b.last || a.i - b.i).map((x) => x.k);
}

/* 설문 한 버전의 결과 분포와 선택지별 선택률 (picks 가 "Q1분 Q2교 …" 꼴인 v2 부터 선택지 표가 나온다) */
function quizReport(sins, picks, tieBy) {
  const total = sins.reduce((a, r) => a + r.n, 0), ties = sins.reduce((a, r) => a + r.ties, 0);
  const by = {}; sins.forEach((r) => { by[r.sin] = r; });
  const bySin = SINS.map((name) => ({ sin: name, n: by[name] ? by[name].n : 0, ties: by[name] ? by[name].ties : 0 }))
    .map((r) => Object.assign(r, { pct: total ? Math.round(1000 * r.n / total) / 10 : 0 })).sort((a, b) => b.n - a.n);
  // 균등 검정(카이제곱, 자유도 6): 12.59 를 넘으면 "고르지 않다" (5% 수준)
  const e = total / 7, chi2 = total ? Math.round(10 * bySin.reduce((a, r) => a + (r.n - e) ** 2 / e, 0)) / 10 : null;
  const qs = {};
  picks.forEach((r) => {
    const m = /^Q(\d{1,2})(.)$/u.exec(r.pick || ''), k = m ? KEYS.indexOf(m[2]) : -1;
    if (k < 0) return;
    (qs[m[1]] = qs[m[1]] || []).push({ sin: SINS[k], n: r.n });
  });
  const options = Object.keys(qs).map(Number).sort((a, b) => a - b).map((q) => {
    const list = qs[q], sum = list.reduce((a, o) => a + o.n, 0);
    let h = 0;
    list.forEach((o) => { const p = o.n / sum; if (p > 0) h -= p * Math.log(p); o.pct = Math.round(1000 * p) / 10; o.warn = o.pct < 8 || o.pct > 50; });
    // 유효 선택지 수: 4 면 네 답이 똑같이 나뉨, 1 이면 모두 같은 답 (목표 3.3 이상, 2.8 미만이면 문항 교체)
    return { q, answered: sum, eff: Math.round(100 * Math.exp(h)) / 100, picks: list.sort((a, b) => b.n - a.n) };
  });
  // 죄별 평균 선택률: 그 죄의 선택지들이 평균 몇 % 선택됐나 (고른 설계면 모두 25%)
  const acc = {};
  options.forEach((o) => o.picks.forEach((x) => { (acc[x.sin] = acc[x.sin] || []).push(x.pct); }));
  const sinAvg = SINS.filter((name) => acc[name]).map((name) => ({ sin: name, options: acc[name].length, pct: Math.round(10 * acc[name].reduce((a, x) => a + x, 0) / acc[name].length) / 10 }));
  return { total, bySin, ties, tieRate: total ? Math.round(1000 * ties / total) / 10 : 0, tieBy, chi2, options, sinAvg };
}

async function stats(sql) {
  const q = (text, params) => sql.query(text, params);
  // 지금 설문 버전 = 결과가 있는 버전 중 번호가 가장 큰 것
  // (가장 최근 결과로 고르면, 배포 전에 열어 둔 화면에서 뒤늦게 끝낸 옛 버전 결과 한 건에 통계가 뒤집힌다)
  const seen = await q(`select distinct ${QUIZ_OF} as quiz from deadly_sins_events where type = 'result'`);
  const cur = seen.map((r) => r.quiz).filter((v) => QUIZ_RE.test(v)).sort((x, y) => Number(y.slice(1)) - Number(x.slice(1)))[0] || 'v1';
  const [types, sins, days, picks, recent, errors, items, quits, promo, tieBy] = await Promise.all([
    q(`select type, count(*)::int as n, count(distinct sid)::int as sessions
       from deadly_sins_events group by type order by n desc`),
    q(`select ${QUIZ_OF} as quiz, sin, count(*)::int as n, count(*) filter (where tie)::int as ties
       from deadly_sins_events where type = 'result' group by 1, 2`),
    q(`select to_char(${KST}, 'YYYY-MM-DD') as day,
              count(distinct sid) filter (where type = 'start')::int  as started,
              count(*)            filter (where type = 'result')::int as finished,
              count(distinct sid) filter (where type = 'order')::int  as ordered,
              count(distinct sid) filter (where type = 'share')::int  as shared
       from deadly_sins_events group by 1 order by 1 desc limit 30`),
    q(`select p as pick, count(*)::int as n
       from deadly_sins_events, unnest(string_to_array(picks, ' ')) as p
       where type = 'result' and p <> '' and ${QUIZ_OF} = $1 group by p order by p`, [cur]),
    q(`select to_char(${KST}, 'MM-DD HH24:MI') as at, sid, type, lang, sin, second, tie, picks, extra->>'quiz' as quiz
       from deadly_sins_events order by id desc limit 40`),
    q(`select to_char(${KST}, 'MM-DD HH24:MI') as at, extra->>'message' as message, extra->>'ua' as ua
       from deadly_sins_events where type = 'error' order by id desc limit 10`),
    q(`select extra->>'id' as id, count(*)::int as n, count(distinct sid)::int as sessions
       from deadly_sins_events where type = 'item' group by 1 order by n desc limit 30`),
    // 결과까지 못 간 세션이 마지막으로 보던 문항 (돌아와서 끝낸 세션은 빠진다). 문항이 버전마다 달라서 지금 버전만.
    q(`select (extra->>'q')::int as q, count(*)::int as n
       from (select distinct on (sid) sid, extra from deadly_sins_events
             where type = 'quit' and ${QUIZ_OF} = $1 order by sid, id desc) last
       where not exists (select 1 from deadly_sins_events r where r.type = 'result' and r.sid = last.sid)
       group by 1 order by 1`, [cur]),
    // 1층 배너 홍보 사이트: 들어온 사람 → 메뉴 · 오시는 길 · 인스타/전화/지도를 누른 사람 (세션 수)
    q(`select
         count(distinct sid) filter (where extra->>'act' = 'open')::int as opened,
         count(distinct sid) filter (where extra->>'act' in ('menu', 'cat', 'item', 'bottle', 'bite'))::int as clicked_menu,
         count(distinct sid) filter (where extra->>'act' = 'way')::int as clicked_way,
         count(distinct sid) filter (where extra->>'act' in ('instagram', 'phone', 'email', 'map'))::int as clicked_contact,
         count(distinct sid) filter (where extra->>'act' = 'rental')::int as clicked_rental
       from deadly_sins_events where type = 'visit' and extra->>'from' = 'promo'`),
    // 동점을 무엇으로 갈랐나: recent = 서버가 알려 준 "덜 나온 죄" 순서, random = 순서를 못 받아 무작위
    q(`select coalesce(extra->>'tieBy', 'unknown') as by, count(*)::int as n
       from deadly_sins_events where type = 'result' and tie and ${QUIZ_OF} = $1 group by 1`, [cur])
  ]);
  const report = quizReport(sins.filter((r) => r.quiz === cur), picks, Object.fromEntries(tieBy.map((r) => [r.by, r.n])));
  const older = [...new Set(sins.map((r) => r.quiz))].filter((v) => v !== cur).sort();
  return {
    generatedAt: new Date().toISOString(),
    quiz: cur,                    // 아래 results · options · sinAvg · quits 는 이 설문 버전의 것
    results: { total: report.total, bySin: report.bySin, ties: report.ties, tieRate: report.tieRate, tieBy: report.tieBy, chi2: report.chi2 },
    options: report.options,      // 문항별 선택지 선택률 + 유효 선택지 수
    sinAvg: report.sinAvg,        // 죄별 평균 선택률
    previous: older.map((v) => { const r = quizReport(sins.filter((x) => x.quiz === v), [], {}); return { quiz: v, total: r.total, bySin: r.bySin }; }),
    events: types,
    days,
    items,      // 메뉴판에서 많이 눌러 본 항목
    quits,      // 퀴즈를 그만둔 문항 (q 번에서 n 명)
    promo: promo[0],   // 1층 배너 홍보 사이트에서 누른 것 (세션 수)
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
      if (req.query && req.query.order) {   // 동점 순서 (공개)
        const quiz = String(req.query.quiz || '');
        if (!QUIZ_RE.test(quiz)) return res.status(400).end();
        if (!sql) return res.status(200).json({ order: null });
        await ready;
        return res.status(200).json({ order: await tieOrder(sql, quiz) });
      }
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
