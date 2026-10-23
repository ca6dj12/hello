/* =============================================================
   사장님이 고치는 메뉴 (품절 · 가격 · 숨김 · NEW · 새 메뉴) → Neon
     GET  /api/menu                       지금 메뉴 고침 내용 { v, at, data } — 누구나 (손님 화면이 읽는다)
     POST /api/menu  x-admin-key: 비밀번호
          { action: 'check' }             비밀번호 확인
          { action: 'save', data }        새로 저장 (저장할 때마다 한 줄씩 쌓여서 되돌릴 수 있다)
          { action: 'undo' }              직전 저장으로 되돌리기

   data.js 가 기본 메뉴이고, 여기 저장되는 건 "기본과 다른 점" 뿐이다:
     { signaturePrice: 16000,
       items: { "<메뉴 id>": { g, b, p, soldOut, hidden, new } },     // 시그니처는 "sig:교" 처럼
       extra: [ { id: "x-…", section, ko, en, g, b, p, about: { ko, en }, soldOut, hidden, new } ] }   // 새 메뉴

   비밀번호는 Vercel 환경 변수 ADMIN_PASSWORD. 없으면 저장은 503 (읽기는 됨).
   틀린 비밀번호는 IP 마다 15분에 10번, 전체 15분에 50번까지 — 넘으면 잠시 막는다.
   ============================================================= */
'use strict';
const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');

const SCHEMA = [
  `create table if not exists deadly_sins_menu (
     id         bigint generated always as identity primary key,
     created_at timestamptz not null default now(),
     data       jsonb not null
   )`,
  `create table if not exists deadly_sins_admin_fail (
     at timestamptz not null default now(),
     ip text
   )`
];

let ready = null;
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

/* ---------- 받은 내용 검사 ---------- */
const SECTIONS = ['cocktails', 'bites', 'beverages', 'final', 'whisky:교', 'whisky:질', 'whisky:분', 'whisky:나', 'whisky:탐', 'whisky:식', 'whisky:색'];
const ID = /^(sig:[교질분나탐식색]|[a-z0-9][a-z0-9-]{0,39})$/;
const XID = /^x-[a-z0-9]{4,12}$/;

// "23000" · 23000 · "23,000" → "23,000". 이상하면 undefined
function price(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(String(v).replace(/[,\s원]/g, ''));
  if (!Number.isInteger(n) || n < 0 || n > 99999999) return undefined;
  return n.toLocaleString('en-US');
}
const text = (v, n) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : undefined);
const flag = (v) => (v === true ? true : v === false ? false : undefined);
function clean(o) { Object.keys(o).forEach((k) => { if (o[k] === undefined) delete o[k]; }); return o; }

function validate(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  const out = {};
  if (d.signaturePrice !== undefined && d.signaturePrice !== null) {
    const n = Number(d.signaturePrice);
    if (!Number.isInteger(n) || n < 0 || n > 1000000) return null;
    out.signaturePrice = n;
  }
  const items = {};
  const src = d.items && typeof d.items === 'object' ? d.items : {};
  const keys = Object.keys(src);
  if (keys.length > 300) return null;
  for (const id of keys) {
    if (!ID.test(id)) return null;
    const it = src[id] || {};
    const o = clean({ g: price(it.g), b: price(it.b), p: price(it.p), soldOut: flag(it.soldOut), hidden: flag(it.hidden), new: flag(it.new) });
    if (Object.keys(o).length) items[id] = o;
  }
  if (Object.keys(items).length) out.items = items;
  const extra = [];
  const list = Array.isArray(d.extra) ? d.extra : [];
  if (list.length > 60) return null;
  const seen = new Set();
  for (const x of list) {
    if (!x || typeof x !== 'object' || !XID.test(x.id) || seen.has(x.id) || !SECTIONS.includes(x.section)) return null;
    seen.add(x.id);
    const ko = text(x.ko, 40), en = text(x.en, 60);
    if (!ko && !en) return null;
    const about = x.about && typeof x.about === 'object' ? clean({ ko: text(x.about.ko, 300), en: text(x.about.en, 400) }) : {};
    extra.push(clean({
      id: x.id, section: x.section, ko, en,
      g: price(x.g), b: price(x.b), p: price(x.p),
      about: Object.keys(about).length ? about : undefined,
      soldOut: flag(x.soldOut), hidden: flag(x.hidden), new: flag(x.new)
    }));
  }
  if (extra.length) out.extra = extra;
  return out;
}

/* ---------- 비밀번호 · 막기 ---------- */
const digest = (s) => crypto.createHash('sha256').update(String(s)).digest();
function keyOk(req) {
  const want = process.env.ADMIN_PASSWORD;
  const got = req.headers && req.headers['x-admin-key'];
  if (!want || typeof got !== 'string' || !got) return false;
  return crypto.timingSafeEqual(digest(got), digest(want));   // 길이가 달라도 같은 시간
}
function ipOf(req) {
  const h = req.headers || {};
  return String(h['x-real-ip'] || String(h['x-forwarded-for'] || '').split(',')[0] || '').trim().slice(0, 64) || null;
}
async function blocked(sql, ip) {
  const [r] = await sql.query(
    `select count(*) filter (where ip = $1)::int as mine, count(*)::int as alls
     from deadly_sins_admin_fail where at > now() - interval '15 minutes'`, [ip]);
  return r.mine >= 10 || r.alls >= 50;
}

async function latest(sql) {
  const rows = await sql.query('select id, created_at, data from deadly_sins_menu order by id desc limit 2');
  return rows;
}
const pack = (row) => (row ? { v: Number(row.id), at: new Date(row.created_at).toISOString(), data: row.data } : { v: 0, at: null, data: null });

module.exports = async function handler(req, res) {
  try {
    const sql = db();
    if (req.method === 'GET') {
      // 손님 화면이 열 때마다 부르므로 Vercel 앞단에서 10초 묶어 둔다 (사장님이 저장하면 10초쯤 뒤 반영)
      res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=30');
      if (!sql) return res.status(200).json(pack(null));
      await ready;
      return res.status(200).json(pack((await latest(sql))[0]));
    }
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).end();
    if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'no-password' });
    if (!sql) return res.status(503).json({ error: 'no-db' });
    await ready;

    const ip = ipOf(req);
    if (await blocked(sql, ip)) return res.status(429).json({ error: 'too-many' });
    if (!keyOk(req)) {
      // 비밀번호를 넣은 시도만 센다. 헤더 없는 요청은 다른 사이트가 손님 브라우저로 보낼 수 있어서
      // 세면 그걸로 사장님을 잠글 수 있다 (헤더를 붙인 요청은 다른 사이트에서 못 보낸다).
      if (req.headers && req.headers['x-admin-key']) {
        await sql.query('insert into deadly_sins_admin_fail (ip) values ($1)', [ip]);
        await sql.query("delete from deadly_sins_admin_fail where at < now() - interval '1 day'");
        await new Promise((r) => setTimeout(r, 600));   // 연달아 맞혀 보기 어렵게
      }
      return res.status(401).json({ error: 'wrong-password' });
    }

    let d = req.body;
    if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { return res.status(400).json({ error: 'bad-json' }); } }
    if (Buffer.isBuffer(d)) { try { d = JSON.parse(d.toString('utf8')); } catch (e) { return res.status(400).json({ error: 'bad-json' }); } }
    const action = d && d.action;

    if (action === 'check') return res.status(200).json(Object.assign({ ok: true }, pack((await latest(sql))[0])));
    if (action === 'save') {
      const data = validate(d.data);
      if (!data) return res.status(400).json({ error: 'bad-data' });
      const json = JSON.stringify(data);
      if (json.length > 60000) return res.status(413).json({ error: 'too-big' });
      const [row] = await sql.query('insert into deadly_sins_menu (data) values ($1::jsonb) returning id, created_at, data', [json]);
      return res.status(200).json(Object.assign({ ok: true }, pack(row)));
    }
    if (action === 'undo') {
      const rows = await latest(sql);
      const prev = rows[1] ? rows[1].data : {};   // 저장이 하나뿐이면 아무것도 안 고친 처음 상태로
      if (!rows[0]) return res.status(409).json({ error: 'nothing-to-undo' });
      const [row] = await sql.query('insert into deadly_sins_menu (data) values ($1::jsonb) returning id, created_at, data', [JSON.stringify(prev)]);
      return res.status(200).json(Object.assign({ ok: true }, pack(row)));
    }
    return res.status(400).json({ error: 'bad-action' });
  } catch (e) {
    console.error('[menu]', e && e.message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).end();
  }
};
module.exports.validate = validate;   // 테스트용
