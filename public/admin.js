/* =============================================================
   DEADLY SINS — 메뉴 · 가게 정보 관리 (사장님용, 한국어만)
   data.js 가 기본 메뉴 · 기본 가게 정보(promo). 여기서 바꾼 것 중 "기본과 다른 점"만 /api/menu 에 저장하고,
   손님 화면(enhance.js)이 그걸 data.js 위에 덮는다.
   비밀번호는 이 탭이 열려 있는 동안만 기억한다 (sessionStorage).
   ============================================================= */
(function () {
  'use strict';
  const BASE = window.DS_DATA;
  const API = 'api/menu';
  const KEY_STORE = 'ds_admin_key';
  const SIG = [['교', 'PRIDE', '교만의 술'], ['질', 'ENVY', '질투의 술'], ['분', 'WRATH', '분노의 술'], ['나', 'SLOTH', '나태의 술'],
    ['탐', 'GREED', '탐욕의 술'], ['식', 'GLUTTONY', '폭식의 술'], ['색', 'LUST', '색욕의 술']];
  const SIN_NAME = { 교: '교만', 질: '질투', 분: '분노', 나: '나태', 탐: '탐욕', 식: '폭식', 색: '색욕' };

  /* 가게 정보의 기본값 (data.js 의 promo). 요일 번호: 0 = 일요일 … 6 = 토요일. 화면에는 월요일부터 보여 준다. */
  const P = BASE.promo || {};
  const H0 = (Array.isArray(P.hours) && P.hours[0]) || { days: [0, 1, 2, 3, 4, 5, 6], open: '20:00', close: '02:00' };
  const BASE_INFO = {
    days: (H0.days || []).slice().sort((a, b) => a - b), open: H0.open || '', close: H0.close || '', last: H0.last || '',
    noticeKo: '', noticeEn: '', noticeZh: '', noticeJa: '',
    phone: P.phone || '', instagram: String(P.instagram || '').replace(/^@/, ''), email: P.email || ''
  };
  const WEEK = [[1, '월'], [2, '화'], [3, '수'], [4, '목'], [5, '금'], [6, '토'], [0, '일']];
  const toMin = (s) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '')); return m ? Number(m[1]) * 60 + Number(m[2]) : NaN; };
  // 인스타그램: 주소를 통째로 붙여 넣거나 @ 를 붙여도 아이디만 남긴다
  const igId = (v) => String(v || '').trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // "23000" · "23,000원" → "23,000". 비었거나 숫자가 아니면 ''
  const fmt = (v) => { const n = Number(String(v || '').replace(/[^\d]/g, '')); return String(v || '').replace(/[^\d]/g, '') === '' ? '' : n.toLocaleString('en-US'); };
  const rid = () => 'x-' + Math.random().toString(36).slice(2, 9).replace(/[^a-z0-9]/g, '0').padEnd(6, '0');

  let key = '';
  try { key = sessionStorage.getItem(KEY_STORE) || ''; } catch (e) { /* 사파리 사생활 보호 모드 등 */ }
  let model = null;      // 화면에 보이는 값 전부
  let dirty = false;

  /* ---------- 서버 ---------- */
  async function post(body) {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify(body),
      cache: 'no-store'
    });
    let j = null;
    try { j = await r.json(); } catch (e) { /* 본문 없음 */ }
    return { status: r.status, body: j || {} };
  }
  function failText(res) {
    if (res.status === 401) return '비밀번호가 틀렸어요.';
    if (res.status === 429) return '여러 번 틀려서 15분 동안 막혔어요. 잠시 뒤 다시 해 주세요.';
    if (res.status === 503 && res.body.error === 'no-password')
      return '아직 관리자 비밀번호가 설정되지 않았어요. Vercel → deadly-sins → Settings → Environment Variables 에 ADMIN_PASSWORD 를 넣고 다시 배포해 주세요.';
    if (res.status === 503) return '데이터베이스(Neon)가 연결되지 않았어요.';
    if (res.status === 400) return '저장하지 못했어요. 가격은 숫자로, 새 메뉴에는 이름을, 영업시간은 20:00 꼴로 넣어 주세요.';
    return '잠시 문제가 생겼어요 (' + res.status + '). 다시 해 주세요.';
  }

  /* ---------- 기본 + 저장된 것 → 화면 값 ---------- */
  function build(saved) {
    const d = (saved && saved.data) || {};
    const items = d.items || {};
    const m = BASE.menu;
    const row = (it, kind) => {
      const o = items[it.id] || {};
      return {
        id: it.id, ko: it.ko, en: it.en, kind,
        g: o.g !== undefined ? o.g : it.g || '', b: o.b !== undefined ? o.b : it.b || '', p: o.p !== undefined ? o.p : it.p || '',
        soldOut: !!o.soldOut, hidden: !!o.hidden, new: o.new !== undefined ? !!o.new : !!it.new,
        base: { g: it.g || '', b: it.b || '', p: it.p || '', new: !!it.new }
      };
    };
    const groups = [];
    m.whisky.forEach((w) => groups.push({ section: 'whisky:' + w.sin, title: '위스키 · ' + w.label.ko + ' ' + SIN_NAME[w.sin], gb: true, rows: w.items.map((it) => row(it, 'whisky')) }));
    groups.push({ section: 'final', title: '위스키 · ' + m.final.title, gb: true, rows: m.final.items.map((it) => row(it, 'whisky')) });
    groups.push({ section: 'cocktails', title: '칵테일', rows: m.cocktails.map((it) => row(it, 'cocktails')) });
    groups.push({ section: 'bites', title: '안주', rows: m.bites.map((it) => row(it, 'bites')) });
    groups.push({ section: 'beverages', title: '음료', rows: m.beverages.map((it) => row(it, 'beverages')) });
    (d.extra || []).forEach((x) => {
      const g = groups.find((gr) => gr.section === x.section);
      if (!g) return;
      g.rows.push({
        id: x.id, ko: x.ko || '', en: x.en || '', added: true,
        g: x.g || '', b: x.b || '', p: x.p || '', about: (x.about && x.about.ko) || '',
        soldOut: !!x.soldOut, hidden: !!x.hidden, new: !!x.new
      });
    });
    // 가게 정보: 저장된 것이 있으면 그것, 없으면 data.js 기본값
    const si = d.info || {}, sh = si.hours || null, sn = si.notice || {};
    const info = {
      days: sh && Array.isArray(sh.days) ? sh.days.slice().sort((a, b) => a - b) : BASE_INFO.days.slice(),
      open: sh ? sh.open || '' : BASE_INFO.open, close: sh ? sh.close || '' : BASE_INFO.close, last: sh ? sh.last || '' : BASE_INFO.last,
      noticeKo: sn.ko || '', noticeEn: sn.en || '', noticeZh: sn.zh || '', noticeJa: sn.ja || '',
      phone: typeof si.phone === 'string' ? si.phone : BASE_INFO.phone,
      instagram: typeof si.instagram === 'string' ? si.instagram : BASE_INFO.instagram,
      email: typeof si.email === 'string' ? si.email : BASE_INFO.email
    };
    return {
      info,
      v: saved ? saved.v : 0, at: saved ? saved.at : null,
      sigPrice: Number.isInteger(d.signaturePrice) ? d.signaturePrice : BASE.signaturePrice,
      sig: SIG.map(([k, en, ko]) => { const o = items['sig:' + k] || {}; return { k, en, ko, soldOut: !!o.soldOut, new: !!o.new }; }),
      groups
    };
  }

  /* ---------- 화면 값 → 저장할 것 (기본과 다른 점만) ---------- */
  function collect() {
    const out = {};
    if (model.sigPrice !== BASE.signaturePrice) out.signaturePrice = model.sigPrice;
    const items = {}, extra = [];
    model.sig.forEach((s) => {
      const o = {};
      if (s.soldOut) o.soldOut = true;
      if (s.new) o.new = true;
      if (Object.keys(o).length) items['sig:' + s.k] = o;
    });
    model.groups.forEach((g) => g.rows.forEach((r) => {
      if (r.added) {
        extra.push({
          id: r.id, section: g.section, ko: r.ko, en: r.en,
          g: g.gb ? fmt(r.g) || undefined : undefined, b: g.gb ? fmt(r.b) || undefined : undefined, p: g.gb ? undefined : fmt(r.p) || undefined,
          about: r.about ? { ko: r.about } : undefined,
          soldOut: r.soldOut || undefined, hidden: r.hidden || undefined, new: r.new || undefined
        });
        return;
      }
      const o = {};
      ['g', 'b', 'p'].forEach((k) => { if (fmt(r[k]) !== fmt(r.base[k])) o[k] = fmt(r[k]); });
      if (r.soldOut) o.soldOut = true;
      if (r.hidden) o.hidden = true;
      if (r.new !== r.base.new) o.new = r.new;
      if (Object.keys(o).length) items[r.id] = o;
    }));
    if (Object.keys(items).length) out.items = items;
    if (extra.length) out.extra = extra;
    // 가게 정보: 기본(data.js)과 달라진 것만
    const i = model.info, info = {};
    if (i.days.join() !== BASE_INFO.days.join() || i.open !== BASE_INFO.open || i.close !== BASE_INFO.close || (i.last || '') !== BASE_INFO.last)
      info.hours = { days: i.days.slice(), open: i.open, close: i.close, last: i.last || undefined };
    const notice = {};
    [['ko', i.noticeKo], ['en', i.noticeEn], ['zh', i.noticeZh], ['ja', i.noticeJa]].forEach(([k, v]) => { if (String(v || '').trim()) notice[k] = String(v).trim(); });
    if (Object.keys(notice).length) info.notice = notice;
    if (i.phone.trim() !== BASE_INFO.phone) info.phone = i.phone.trim();
    if (igId(i.instagram) !== BASE_INFO.instagram) info.instagram = igId(i.instagram);
    if (i.email.trim() !== BASE_INFO.email) info.email = i.email.trim();
    if (Object.keys(info).length) out.info = info;
    return out;
  }

  /* ---------- 그리기 ---------- */
  const toggle = (name, on, label) =>
    '<label class="tg' + (name === 'soldOut' ? ' tg-sold' : '') + '"><input type="checkbox" data-f="' + name + '"' + (on ? ' checked' : '') + '><span>' + label + '</span></label>';
  const priceInput = (f, v, label) =>
    '<label class="price"><span>' + label + '</span><input type="text" inputmode="numeric" data-f="' + f + '" value="' + esc(fmt(v)) + '" placeholder="0"></label>';

  /* ---------- 가게 정보: 영업 요일 · 시간 · 공지 · 연락처 ---------- */
  const timeInput = (f, v, label) =>
    '<label class="time"><span>' + label + '</span><input type="time" data-i="' + f + '" value="' + esc(v) + '" step="300"></label>';
  const textInput = (f, v, label, attrs) =>
    '<label class="txt"><span>' + label + '</span><input data-i="' + f + '" value="' + esc(v) + '" ' + (attrs || 'type="text"') + '></label>';
  // [0,2,3,4,5,6] → "화–일" (월요일부터 세어 사흘 이상 이어지면 줄여 쓴다 — 손님 화면과 같은 규칙)
  function dayRange(days) {
    const name = (i) => WEEK[i][1], idx = days.map((d) => (d + 6) % 7).sort((a, b) => a - b), out = [];
    for (let a = 0; a < idx.length;) {
      let b = a;
      while (b + 1 < idx.length && idx[b + 1] === idx[b] + 1) b++;
      out.push(b - a >= 2 ? name(idx[a]) + '–' + name(idx[b]) : idx.slice(a, b + 1).map(name).join(' · '));
      a = b + 1;
    }
    return out.join(' · ');
  }
  // 넣은 값에 문제가 있으면 그 설명, 없으면 ''
  function infoProblem() {
    const i = model.info, o = toMin(i.open), c = toMin(i.close), l = toMin(i.last);
    if (!i.days.length) return '영업하는 요일을 하나 이상 골라 주세요.';
    if (isNaN(o) || isNaN(c)) return '여는 시간과 닫는 시간을 넣어 주세요.';
    if (o === c) return '여는 시간과 닫는 시간이 같아요.';
    if (i.last && (isNaN(l) || (l - o + 1440) % 1440 >= (c - o + 1440) % 1440)) return '라스트오더는 여는 시간과 닫는 시간 사이로 넣어 주세요.';
    if (i.phone.trim() && !/^[\d+\-() ]{7,20}$/.test(i.phone.trim())) return '전화번호는 숫자와 - 만 넣어 주세요.';
    if (igId(i.instagram) && !/^[A-Za-z0-9._]{1,30}$/.test(igId(i.instagram))) return '인스타그램 아이디를 확인해 주세요 (영문 · 숫자 · 마침표 · 밑줄).';
    if (i.email.trim() && !/^[^\s@<>"']{1,60}@[^\s@<>"']{1,60}\.[A-Za-z]{2,}$/.test(i.email.trim())) return '이메일 주소를 확인해 주세요.';
    return '';
  }
  // 손님 화면에 어떻게 나오는지 미리 보여 준다
  function updatePreview() {
    const el = $('hoursPreview');
    if (!el) return;
    const i = model.info, bad = infoProblem();
    const off = WEEK.filter(([d]) => !i.days.includes(d)).map(([, n]) => n);
    el.classList.toggle('is-bad', !!bad);
    el.textContent = bad && (/요일|시간|라스트오더/.test(bad)) ? bad
      : '손님 화면: ' + dayRange(i.days) + ' ' + i.open + ' – ' + i.close + (i.last ? ' · 라스트오더 ' + i.last : '') + ' · ' + (off.length ? '매주 ' + off.join(' · ') + '요일 휴무' : '연중무휴');
  }
  function infoHtml() {
    const i = model.info;
    return '<section class="sec" id="sec-info" data-sec="info"><h2>가게 정보</h2>' +
      '<p class="hint">여기서 바꾼 내용은 <b>1층 배너 사이트</b>의 "오시는 길"에 나와요. "매주 월요일 휴무" 같은 안내는 요일을 고르면 알아서 바뀌어요.</p>' +
      '<div class="card"><p class="lbl">영업하는 요일 <small>흰색으로 켜진 요일에 영업해요</small></p><div class="tgs days">' +
        WEEK.map(([d, name]) => '<label class="tg"><input type="checkbox" data-day="' + d + '"' + (i.days.includes(d) ? ' checked' : '') + '><span>' + name + '</span></label>').join('') + '</div></div>' +
      '<div class="card"><p class="lbl">영업시간</p><div class="times">' + timeInput('open', i.open, '여는 시간') + timeInput('close', i.close, '닫는 시간') + timeInput('last', i.last, '라스트오더') + '</div>' +
        '<p class="hint">자정을 넘겨 새벽에 닫으면 새벽 시간 그대로 넣으면 돼요 (새벽 2시 = 오전 2:00). 라스트오더가 없으면 비워 두세요.</p>' +
        '<p class="preview" id="hoursPreview" role="status"></p></div>' +
      '<div class="card"><p class="lbl">공지 <small>선택 · 영업시간 위에 빨간 상자로 나와요</small></p>' +
        textInput('noticeKo', i.noticeKo, '예: 12/25 휴무 · 이번 주 토요일은 밤 9시에 열어요', 'type="text" maxlength="120"') +
        '<details class="more"' + (i.noticeEn || i.noticeZh || i.noticeJa ? ' open' : '') + '><summary>영어 · 중국어 · 일본어 공지도 적기</summary>' +
          '<p class="hint">비워 두면 외국어 화면에는 영어 공지가, 영어도 비어 있으면 위의 한국어 공지가 나와요.</p>' +
          textInput('noticeEn', i.noticeEn, '공지 (English)', 'type="text" maxlength="160" lang="en"') +
          textInput('noticeZh', i.noticeZh, '공지 (中文)', 'type="text" maxlength="120" lang="zh-Hans"') +
          textInput('noticeJa', i.noticeJa, '공지 (日本語)', 'type="text" maxlength="120" lang="ja"') + '</details></div>' +
      '<div class="card"><p class="lbl">연락처 <small>비우면 손님 화면에서 빠져요</small></p>' +
        textInput('phone', i.phone, '전화번호', 'type="tel" inputmode="tel" maxlength="20" autocomplete="off"') +
        textInput('instagram', i.instagram, '인스타그램 아이디 (@ 없이)', 'type="text" maxlength="60" autocapitalize="none" autocorrect="off" spellcheck="false"') +
        textInput('email', i.email, '이메일', 'type="email" inputmode="email" maxlength="100" autocapitalize="none" autocomplete="off"') + '</div>' +
    '</section>';
  }

  function render() {
    let h = infoHtml();
    h += '<section class="sec" id="sec-sig" data-sec="sig"><h2>시그니처 일곱 잔</h2>';
    h += '<div class="card">' + priceInput('sigPrice', model.sigPrice, '가격 (일곱 잔 공통)') + '</div>';
    model.sig.forEach((s, i) => {
      h += '<div class="card row' + (s.soldOut ? ' is-sold' : '') + '" data-sig="' + i + '"><p class="name">' + esc(s.en) + ' <small>' + esc(s.ko) + '</small></p>' +
        '<div class="tgs">' + toggle('soldOut', s.soldOut, '품절') + toggle('new', s.new, 'NEW') + '</div></div>';
    });
    h += '</section>';

    model.groups.forEach((g, gi) => {
      h += '<section class="sec" id="sec-g' + gi + '"><h2>' + esc(g.title) + '</h2>';
      g.rows.forEach((r, ri) => {
        const at = ' data-g="' + gi + '" data-r="' + ri + '"';
        h += '<div class="card row' + (r.soldOut ? ' is-sold' : '') + (r.hidden ? ' is-hidden' : '') + (r.added ? ' is-added' : '') + '"' + at + '>';
        if (r.added) {
          h += '<p class="added-tag">새로 넣은 메뉴</p>' +
            '<label class="txt"><span>이름 (한국어)</span><input type="text" data-f="ko" maxlength="40" value="' + esc(r.ko) + '"></label>' +
            '<label class="txt"><span>이름 (영어)</span><input type="text" data-f="en" maxlength="60" value="' + esc(r.en) + '"></label>' +
            '<label class="txt"><span>설명 (선택 · 있으면 손님이 눌러서 볼 수 있어요)</span><textarea data-f="about" maxlength="300" rows="2">' + esc(r.about) + '</textarea></label>';
        } else {
          h += '<p class="name">' + esc(r.ko) + ' <small>' + esc(r.en) + '</small></p>';
        }
        h += '<div class="prices">' + (g.gb ? priceInput('g', r.g, '글라스') + priceInput('b', r.b, '보틀') : priceInput('p', r.p, '가격')) + '</div>';
        h += '<div class="tgs">' + toggle('soldOut', r.soldOut, '품절') + toggle('hidden', r.hidden, '숨김') + toggle('new', r.new, 'NEW') +
          (r.added ? '<button type="button" class="del" data-act="del">삭제</button>' : '') + '</div>';
        h += '</div>';
      });
      h += '<button type="button" class="add" data-act="add" data-g="' + gi + '">+ ' + esc(g.title.replace(/^위스키 · /, '')) + '에 새 메뉴 추가</button>';
      h += '</section>';
    });
    $('sections').innerHTML = h;
    // 위쪽 바로가기: 가게 정보 · 시그니처 · 위스키 · 칵테일 · 안주 · 음료
    const at = (sec) => model.groups.findIndex((g) => g.section === sec || (sec === 'whisky' && g.section.indexOf('whisky:') === 0));
    $('jump').innerHTML = [['sec-info', '가게 정보'], ['sec-sig', '시그니처'], ['sec-g' + at('whisky'), '위스키'], ['sec-g' + at('cocktails'), '칵테일'],
      ['sec-g' + at('bites'), '안주'], ['sec-g' + at('beverages'), '음료']].map(([id, label]) => '<a href="#' + id + '">' + label + '</a>').join('');
    updatePreview();
    $('lastSaved').textContent = model.at ? '마지막 저장: ' + new Date(model.at).toLocaleString('ko-KR') : '아직 고친 것이 없어요 (data.js 기본 메뉴 그대로).';
  }

  function setDirty(on, msg) {
    dirty = on;
    $('save').disabled = !on;
    const text = msg !== undefined ? msg : (on ? '바뀐 내용이 있어요.' : '');
    if ($('barMsg').textContent !== text) { $('barMsg').textContent = text; replay($('barMsg'), 'msg-in'); }
  }
  // CSS 애니메이션을 처음부터 다시 (같은 클래스를 다시 붙여도 재생되게)
  function replay(el, cls, ms) {
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    if (ms) setTimeout(() => el.classList.remove(cls), ms);
  }

  /* ---------- 입력 ---------- */
  function targetOf(el) {
    const card = el.closest('[data-sig],[data-g]');
    if (!card) return null;
    if (card.hasAttribute('data-sig')) return { card, obj: model.sig[Number(card.getAttribute('data-sig'))] };
    if (!card.hasAttribute('data-r')) return null;
    return { card, obj: model.groups[Number(card.getAttribute('data-g'))].rows[Number(card.getAttribute('data-r'))] };
  }
  function onField(e) {
    const el = e.target, f = el.getAttribute('data-f');
    // 가게 정보 칸
    const day = el.getAttribute('data-day'), key = el.getAttribute('data-i');
    if (day !== null) {
      const s = new Set(model.info.days);
      if (el.checked) s.add(Number(day)); else s.delete(Number(day));
      model.info.days = [...s].sort((a, b) => a - b);
      updatePreview(); setDirty(true); return;
    }
    if (key) { model.info[key] = el.value; updatePreview(); setDirty(true); return; }
    if (!f) return;
    if (f === 'sigPrice') { model.sigPrice = Number(fmt(el.value).replace(/,/g, '')) || 0; setDirty(true); return; }
    const t = targetOf(el);
    if (!t) return;
    if (el.type === 'checkbox') {
      t.obj[f] = el.checked;
      t.card.classList.toggle('is-sold', !!t.obj.soldOut);
      t.card.classList.toggle('is-hidden', !!t.obj.hidden);
    } else t.obj[f] = el.value;
    setDirty(true);
  }
  $('sections').addEventListener('input', onField);
  $('sections').addEventListener('change', (e) => { if (e.target.type === 'checkbox' || e.target.type === 'time') onField(e); });   // 체크박스 input 이벤트가 없는 옛 브라우저
  // 가격 칸은 다 쓰고 나면 23,000 꼴로
  $('sections').addEventListener('focusout', (e) => {
    const el = e.target;
    if (el.closest && el.closest('.price')) el.value = fmt(el.value);
  });
  // 위쪽 바로가기: 그 구역으로 부드럽게 (주소 뒤에 #… 를 남기지 않는다)
  $('jump').addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const to = document.getElementById(a.getAttribute('href').slice(1));
    if (to) to.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  $('sections').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    if (b.getAttribute('data-act') === 'add') {
      const g = model.groups[Number(b.getAttribute('data-g'))];
      g.rows.push({ id: rid(), ko: '', en: '', added: true, g: '', b: '', p: '', about: '', soldOut: false, hidden: false, new: true });
      render(); setDirty(true);
      const cards = document.querySelectorAll('[data-g="' + b.getAttribute('data-g') + '"].is-added');
      const last = cards[cards.length - 1];
      if (last) {
        last.classList.add('just-added');
        last.scrollIntoView({ block: 'center', behavior: 'smooth' });
        const i = last.querySelector('input'); if (i) i.focus({ preventScroll: true });
      }
    } else if (b.getAttribute('data-act') === 'del') {
      const t = targetOf(b);
      if (!t || !window.confirm('이 메뉴를 지울까요? (저장해야 반영돼요)')) return;
      const g = model.groups[Number(t.card.getAttribute('data-g'))];
      const at = Number(t.card.getAttribute('data-r'));
      t.card.classList.add('removing');   // 접히며 사라진 뒤 지운다
      setTimeout(() => { g.rows.splice(at, 1); render(); setDirty(true); }, 260);
    }
  });

  /* ---------- 저장 · 되돌리기 ---------- */
  $('save').addEventListener('click', async () => {
    const data = collect();
    const nameless = (data.extra || []).some((x) => !String(x.ko || '').trim() && !String(x.en || '').trim());
    if (nameless) { setDirty(true, '새 메뉴에 이름을 넣어 주세요.'); return; }
    const bad = infoProblem();
    if (bad) { setDirty(true, bad); updatePreview(); $('sec-info').scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    $('save').disabled = true; $('barMsg').textContent = '저장하는 중…';
    try {
      const res = await post({ action: 'save', data });
      if (res.status === 200) {
        model = build(res.body); render();
        setDirty(false, '저장했어요. 손님 화면에는 10초쯤 뒤 반영돼요.');
        replay($('bar'), 'saved', 1400);
      } else if (res.status === 401) { showLogin(failText(res)); }
      else setDirty(true, failText(res));
    } catch (e) { setDirty(true, '인터넷 연결을 확인하고 다시 눌러 주세요.'); }
  });
  $('undo').addEventListener('click', async () => {
    if (!window.confirm('마지막으로 저장하기 전 상태로 되돌릴까요?')) return;
    try {
      const res = await post({ action: 'undo' });
      if (res.status === 200) { model = build(res.body); render(); setDirty(false, '직전 저장으로 되돌렸어요.'); }
      else if (res.status === 409) setDirty(dirty, '되돌릴 저장이 없어요.');
      else setDirty(dirty, failText(res));
    } catch (e) { setDirty(dirty, '인터넷 연결을 확인해 주세요.'); }
  });
  window.addEventListener('beforeunload', (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- 들어가기 ---------- */
  function showLogin(msg) {
    $('editor').hidden = true; $('bar').hidden = true; $('login').hidden = false;
    $('loginMsg').textContent = msg || '';
    if (msg) replay($('login'), 'shake', 500);
  }
  async function enter() {
    $('loginMsg').textContent = '확인하는 중…';
    try {
      const res = await post({ action: 'check' });
      if (res.status !== 200) {
        try { sessionStorage.removeItem(KEY_STORE); } catch (e) {}
        showLogin(failText(res));
        return;
      }
      try { sessionStorage.setItem(KEY_STORE, key); } catch (e) {}
      model = build(res.body);
      $('login').hidden = true; $('editor').hidden = false; $('bar').hidden = false;
      replay($('editor'), 'entering', 1600);   // 구역들이 차례로 떠오름 (그 뒤 다시 그릴 때는 안 움직임)
      render(); setDirty(false);
    } catch (e) { showLogin('인터넷 연결을 확인해 주세요.'); }
  }
  $('login').addEventListener('submit', (e) => { e.preventDefault(); key = $('pw').value; enter(); });
  $('logout').addEventListener('click', () => {
    if (dirty && !window.confirm('저장하지 않은 내용이 있어요. 그래도 나갈까요?')) return;
    key = ''; dirty = false;
    try { sessionStorage.removeItem(KEY_STORE); } catch (e) {}
    $('pw').value = '';
    showLogin('');
  });

  if (key) enter(); else showLogin('');
  window.DS_ADMIN = { collect: () => collect() };   // 자동 테스트용
})();
