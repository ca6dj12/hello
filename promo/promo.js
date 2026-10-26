/* =============================================================
   DEADLY SINS — 1층 배너 QR 홍보 사이트 (테이블 QR 의 설문 사이트와 별개)
   지나가던 사람이 QR 을 찍고 3초 안에 알아야 할 것: 무슨 곳인지 · 분위기 · 가격 · 어떻게 올라가는지.
   설문(나의 죄 테스트)은 테이블에서 하는 경험이라 여기서는 예고만 한다.

   그림 · 메뉴 · 가격은 설문 사이트(BASE)의 data.js · brand.js · img/ 를 그대로 읽는다.
   → 메뉴를 고치면(data.js 나 /admin) 이 사이트도 따라 바뀐다. 따로 고칠 것 없음.
   data.js 의 promo 설정에서 null 인 칸(주소 · 영업시간 · 인스타 …)은 화면에 나오지 않는다.
   ============================================================= */
(function () {
  'use strict';
  const BASE = (document.currentScript && document.currentScript.dataset.base) || 'https://deadly-sins-mu.vercel.app/';
  const D = window.DS_DATA, B = window.DS_BRAND;
  if (!D || !B) return;
  const L = D.promo || {};
  const A = (p) => (!p ? '' : /^https?:|^data:/.test(p) ? p : BASE + p);   // 설문 사이트의 그림 주소
  const ROOT = document.getElementById('lb');
  const DOCK = document.getElementById('lbDock');
  const TOP = document.querySelector('.lb-top');
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const SINS = [['교', '교만', 'PRIDE'], ['질', '질투', 'ENVY'], ['분', '분노', 'WRATH'], ['나', '나태', 'SLOTH'],
    ['탐', '탐욕', 'GREED'], ['식', '폭식', 'GLUTTONY'], ['색', '색욕', 'LUST']];
  const DAYS = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

  const T = {
    ko: {
      lang: 'EN', floorLine: 'COCKTAIL & WHISKY BAR',
      heroTitle: '일곱 개의 죄,<br>일곱 잔의 칵테일',
      ctaWay: '5층으로 오는 길', ctaMenu: '메뉴 · 가격 보기',
      conceptTitle: '오늘 밤, 당신은<br>어떤 죄를 삼키시겠습니까?',
      conceptBody: '데들리 신스는 일곱 가지 죄를 일곱 잔의 칵테일로 빚었습니다. 교만, 질투, 분노, 나태, 탐욕, 폭식, 색욕 — 오늘 밤 당신은 어느 쪽인가요?',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: '일곱 잔의 시그니처', sevenNote: (p) => '모든 잔 ' + p + '원', swipe: '옆으로 넘겨 보세요',
      whiskyBody: (g) => '죄마다 어울리는 위스키를 골라 두었습니다. 글라스 ' + g + '원부터.',
      roomKicker: 'THE ROOM', roomTitle: '5층의 밤', roomBody: '낮은 조명, 거친 벽, 그리고 일곱 개의 죄. 혼자여도, 둘이어도 좋은 자리.',
      bitesKicker: 'BITES', bitesTitle: '곁들이는 것들', entrance: '이 간판이 보이면 도착이에요',
      tableKicker: 'AT YOUR TABLE', tableTitle: '자리에 앉으면,<br>일곱 개의 질문이 기다립니다',
      tableBody: '테이블 위 QR을 찍고 질문 일곱 개에 답하면, 일곱 잔 중 당신의 죄에 맞는 한 잔을 골라 드려요. 그 답은 5층에서만.',
      menuKicker: 'MENU', menuTitle: '메뉴', menuSig: '시그니처 칵테일', menuWhisky: '위스키', menuCocktails: '칵테일', menuBites: '안주', menuBev: '음료',
      menuNote: 'G 글라스 · B 보틀 · 가격은 매장 사정에 따라 바뀔 수 있어요.', soldOut: '품절',
      wayKicker: 'FIND US', wayTitle: (f) => f + '층에서<br>기다리고 있어요',
      here: (f) => '지금 계신 이 건물 ' + f + '층', map: '지도에서 보기',
      where: '위치', hours: '영업시간', price: '가격', contact: '문의',
      priceSig: (p) => '시그니처 칵테일 ' + p + '원', priceWhisky: (g) => '위스키 글라스 ' + g + '원부터', noCover: '커버차지 없음',
      openNow: (c) => '지금 영업 중 · ' + c + '까지', opensAt: (o) => '오늘 ' + o + ' 오픈', closedToday: '오늘은 쉬어요',
      opensNext: (w, o) => w + ' ' + o + ' 오픈', tomorrow: '내일', dayName: (d) => d + '요일',
      lastOrder: (x) => '라스트오더 ' + x, lastDone: '오늘 주문은 마감됐어요',
      dockMenu: '메뉴', dockWay: '오시는 길', won: '원'
    },
    en: {
      lang: '한국어', floorLine: 'COCKTAIL & WHISKY BAR',
      heroTitle: 'Seven sins.<br>Seven glasses.',
      ctaWay: 'How to find us · 5F', ctaMenu: 'Menu & prices',
      conceptTitle: 'Tonight, which sin<br>will you swallow?',
      conceptBody: 'Deadly Sins turns the seven deadly sins into seven cocktails. Pride, envy, wrath, sloth, greed, gluttony, lust — which one are you tonight?',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: 'Seven signatures', sevenNote: (p) => p + ' KRW each', swipe: 'Swipe to see them all',
      whiskyBody: (g) => 'A whisky for every sin. Glasses from ' + g + ' KRW.',
      roomKicker: 'THE ROOM', roomTitle: 'Nights on 5F', roomBody: 'Low light, rough walls and seven sins. A seat for one, or for two.',
      bitesKicker: 'BITES', bitesTitle: 'On the side', entrance: 'You have arrived when you see this sign',
      tableKicker: 'AT YOUR TABLE', tableTitle: 'Take a seat,<br>seven questions are waiting',
      tableBody: 'Scan the QR on your table and answer seven questions — we will pick the one glass that matches your sin. Only on the 5th floor.',
      menuKicker: 'MENU', menuTitle: 'Menu', menuSig: 'Signature cocktails', menuWhisky: 'Whisky', menuCocktails: 'Cocktails', menuBites: 'Bites', menuBev: 'Beverages',
      menuNote: 'G glass · B bottle · prices may change.', soldOut: 'Sold out',
      wayKicker: 'FIND US', wayTitle: (f) => 'We are waiting<br>on the ' + f + 'th floor',
      here: (f) => 'This building, ' + f + 'th floor', map: 'Open in maps',
      where: 'Where', hours: 'Hours', price: 'Prices', contact: 'Contact',
      priceSig: (p) => 'Signature cocktails ' + p + ' KRW', priceWhisky: (g) => 'Whisky by the glass from ' + g + ' KRW', noCover: 'No cover charge',
      openNow: (c) => 'Open now · until ' + c, opensAt: (o) => 'Opens today at ' + o, closedToday: 'Closed today',
      opensNext: (w, o) => 'opens ' + w + ' at ' + o, tomorrow: 'tomorrow', dayName: (d) => d,
      lastOrder: (x) => 'Last order ' + x, lastDone: 'Last orders are done for tonight',
      dockMenu: 'Menu', dockWay: 'Find us', won: ' KRW'
    }
  };
  let lang = 'ko';
  try { lang = localStorage.getItem('ds_lang') || ((navigator.language || 'ko').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en'); } catch (e) {}
  if (lang !== 'en') lang = 'ko';
  const t = (k, ...a) => { const v = T[lang][k]; return typeof v === 'function' ? v(...a) : v; };
  const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const L10 = (o) => (o && typeof o === 'object' ? (o[lang] || o.ko || '') : (o || ''));
  const num = (s) => Number(String(s || '').replace(/[^\d]/g, '')) || 0;
  const money = (n) => Number(n).toLocaleString('ko-KR');

  /* ---------- 사장님이 /admin 에서 고친 가격 · 품절 · 숨김 · 새 메뉴 ---------- */
  const SIG_FLAGS = {};
  function applyLive(live) {
    const d = live && live.data;
    if (!d) return;
    const m = D.menu;
    if (Number.isInteger(d.signaturePrice) && d.signaturePrice > 0) D.signaturePrice = d.signaturePrice;
    const items = d.items || {};
    [].concat(...m.whisky.map((w) => w.items), m.final.items, m.cocktails, m.bites, m.beverages).forEach((it) => {
      const o = it.id && items[it.id];
      if (o) ['g', 'b', 'p', 'hidden', 'soldOut', 'new'].forEach((k) => { if (o[k] !== undefined) it[k] = o[k]; });
    });
    Object.keys(items).forEach((id) => { if (id.indexOf('sig:') === 0) SIG_FLAGS[id.slice(4)] = items[id]; });
    (Array.isArray(d.extra) ? d.extra : []).forEach((x) => {
      const sec = String(x.section || '');
      const list = sec === 'final' ? m.final.items
        : sec.indexOf('whisky:') === 0 ? (m.whisky.find((w) => w.sin === sec.slice(7)) || {}).items
        : ['cocktails', 'bites', 'beverages'].includes(sec) ? m[sec] : null;
      if (!Array.isArray(list) || !x.id || list.some((it) => it.id === x.id)) return;
      list.push({ id: x.id, ko: x.ko || x.en, en: x.en || x.ko, g: x.g, b: x.b, p: x.p, soldOut: x.soldOut, hidden: x.hidden, new: x.new });
    });
  }

  /* ---------- 영업 중인지 (한국 시간) ---------- */
  function seoulNow() {
    const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).reduce((a, x) => { a[x.type] = x.value; return a; }, {});
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), min: Number(p.hour) * 60 + Number(p.minute) };
  }
  const toMin = (s) => { const [h, m] = String(s).split(':').map(Number); return h * 60 + (m || 0); };
  const pretty = (s) => {
    const m = toMin(s);
    if (lang === 'en') return s;
    const h = Math.floor(m / 60) % 24, mm = m % 60;
    const word = h < 6 ? '새벽 ' + h + '시' : h < 12 ? '오전 ' + h + '시' : h === 12 ? '낮 12시' : '오후 ' + (h - 12) + '시';
    return word + (mm ? ' ' + mm + '분' : '');
  };
  function openStatus() {
    const H = Array.isArray(L.hours) ? L.hours : null;
    if (!H || !H.length) return null;
    const { day, min } = seoulNow();
    const entryFor = (d) => H.find((h) => Array.isArray(h.days) && h.days.includes(d));
    const today = entryFor(day), yday = entryFor((day + 6) % 7);
    // 열려 있어도 라스트오더가 지났으면 올라와도 주문을 못 하니 그렇게 알린다
    const during = (h) => {
      const o = toMin(h.open), since = (min - o + 1440) % 1440;
      if (h.last && since >= (toMin(h.last) - o + 1440) % 1440) return { open: false, text: t('lastDone') };
      return { open: true, text: t('openNow', pretty(h.close)) };
    };
    // 어제 연 영업이 자정을 넘겨 지금까지 이어지는지
    if (yday && toMin(yday.close) < toMin(yday.open) && min < toMin(yday.close)) return during(yday);
    if (today) {
      const o = toMin(today.open), c = toMin(today.close);
      const past = c < o ? min >= o : (min >= o && min < c);
      if (past) return during(today);
      if (min < o) return { open: false, text: t('opensAt', pretty(today.open)) };
    }
    // 쉬는 날이면 다음에 여는 날까지
    for (let k = 1; k <= 7; k++) {
      const next = entryFor((day + k) % 7);
      if (next) return { open: false, text: t('closedToday') + ' · ' + t('opensNext', k === 1 ? t('tomorrow') : t('dayName', DAYS[lang][(day + k) % 7]), pretty(next.open)) };
    }
    return { open: false, text: t('closedToday') };
  }
  // [0,2,3,4,5,6] → "화–일" (월요일부터 세어 사흘 이상 이어지면 줄여 쓴다)
  function dayRange(days) {
    const idx = days.map((d) => (d + 6) % 7).sort((a, b) => a - b), name = (i) => DAYS[lang][(i + 1) % 7], out = [];
    for (let i = 0; i < idx.length;) {
      let j = i;
      while (j + 1 < idx.length && idx[j + 1] === idx[j] + 1) j++;
      out.push(j - i >= 2 ? name(idx[i]) + '–' + name(idx[j]) : idx.slice(i, j + 1).map(name).join(' · '));
      i = j + 1;
    }
    return out.join(' · ');
  }
  function hoursHtml() {
    const H = Array.isArray(L.hours) ? L.hours : [];
    if (!H.length) return '';
    const notes = [...new Set(H.filter((h) => h.last).map((h) => t('lastOrder', h.last)))].concat(L.hoursNote ? [L10(L.hoursNote)] : []);
    return H.map((h) => '<span>' + esc(dayRange(h.days)) + '</span> ' + esc(h.open) + ' – ' + esc(h.close)).join('<br>') +
      (notes.length ? '<br><small>' + esc(notes.join(' · ')) + '</small>' : '');
  }

  /* ---------- 메뉴 (이 사이트 안에서 다 보이게, 글자로 간단히) ---------- */
  const shown = (it) => !it.hidden;
  function row(id, name, sub, price, flags) {
    const f = flags || {};
    return '<li class="lb-mrow' + (f.soldOut ? ' is-sold' : '') + '" id="m-' + esc(id || '') + '"><span class="lb-mname">' + esc(name) +
      (f.new ? ' <i class="lb-new">NEW</i>' : '') + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' +
      '<span class="lb-mprice">' + esc(f.soldOut ? t('soldOut') : price) + '</span></li>';
  }
  function menuHtml(sigPrice) {
    const m = D.menu;
    const gb = (it) => [it.g && 'G ' + it.g, it.b && 'B ' + it.b].filter(Boolean).join(' · ');
    const other = (it) => (lang === 'en' ? it.ko : it.en);
    let h = '<div class="lb-menu lb-r">';
    h += '<h3>' + esc(t('menuSig')) + '</h3><ul>' + SINS.map(([k, , en]) => {
      const d = D.drinks[k] || {}, dr = (B.drinks || {})[k] || {};
      return row('sig-' + k, en + ' · ' + (lang === 'en' ? (d.style ? d.style.en : '') : dr.kr), lang === 'ko' && d.style ? d.style.ko : '', sigPrice, SIG_FLAGS[k]);
    }).join('') + '</ul>';
    h += '<h3>' + esc(t('menuWhisky')) + '</h3>';
    m.whisky.forEach((w) => {
      const items = w.items.filter(shown);
      if (!items.length) return;
      h += '<p class="lb-mgroup">' + esc(L10(w.label)) + '</p><ul>' + items.map((it) => row(it.id, it[lang] || it.ko, '', gb(it), it)).join('') + '</ul>';
    });
    const finals = m.final.items.filter(shown);
    if (finals.length) h += '<p class="lb-mgroup">' + esc(m.final.title) + ' ' + esc(L10(m.final.label)) + '</p><ul>' + finals.map((it) => row(it.id, it[lang] || it.ko, '', gb(it), it)).join('') + '</ul>';
    [['menuCocktails', m.cocktails], ['menuBites', m.bites], ['menuBev', m.beverages]].forEach(([key, list]) => {
      const items = list.filter(shown);
      if (!items.length) return;
      h += '<h3>' + esc(t(key)) + '</h3><ul>' + items.map((it) => row(it.id, lang === 'en' ? it.en : it.ko, other(it), it.p, it)).join('') + '</ul>';
    });
    h += '<p class="lb-mnote">' + esc(t('menuNote')) + '</p>';
    (m.info || []).forEach((i) => { h += '<p class="lb-mnote">' + esc(L10(i)) + '</p>'; });
    return h + '</div>';
  }

  /* ---------- 그리기 ---------- */
  function render() {
    const m = D.menu, F = L.floor || 5;
    const sigPrice = money(D.signaturePrice);
    const whiskies = [].concat(...m.whisky.map((w) => w.items), m.final.items).filter(shown);
    const minGlass = money(Math.min(...whiskies.map((it) => num(it.g)).filter(Boolean)));
    const detail = (id) => (D.details || {})[id] || {};
    const P = L.photos && typeof L.photos === 'object' ? L.photos : {};
    let h = '';

    // 첫 화면
    const st = openStatus();
    h += '<section class="lb-hero" id="top">' +
      '<img class="lb-hero-art" src="' + esc(A(B.cover)) + '" alt="Deadly Sins">' +
      '<div class="lb-hero-copy">' +
        '<p class="lb-floor"><span>' + F + 'F</span>' + esc(t('floorLine')) + '</p>' +
        '<h1>' + t('heroTitle') + '</h1>' +
        (st ? '<p class="lb-status' + (st.open ? ' is-open' : '') + '"><i></i>' + esc(st.text) + '</p>' : '') +
        '<div class="lb-cta">' +
          '<a class="lb-btn lb-primary" href="#way" data-act="way">' + esc(t('ctaWay')) + '</a>' +
          '<a class="lb-btn" href="#menu" data-act="menu">' + esc(t('ctaMenu')) + '</a>' +
        '</div>' +
      '</div>' +
      '<a class="lb-down" href="#concept" aria-label="↓"><span></span></a>' +
    '</section>';

    // 콘셉트 + 일곱 상징 + 포스터 벽
    h += '<section class="lb-sec lb-concept" id="concept">' +
      '<p class="lb-kicker lb-r">THE CONCEPT</p>' +
      '<h2 class="lb-r">' + t('conceptTitle') + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('conceptBody')) + '</p>' +
      '<ul class="lb-syms lb-r">' + SINS.map(([k, ko, en]) =>
        '<li><img src="' + esc(A((B.symbols || {})[k])) + '" alt=""><span>' + esc(lang === 'en' ? en : ko) + '</span></li>').join('') + '</ul>' +
      (P.wall ? '<figure class="lb-wide lb-r"><img src="' + esc(A(P.wall)) + '" alt="" loading="lazy"></figure>' : '') +
    '</section>';

    // 일곱 잔
    h += '<section class="lb-sec" id="seven">' +
      '<p class="lb-kicker lb-r">' + esc(t('sevenKicker')) + '</p>' +
      '<h2 class="lb-r">' + esc(t('sevenTitle')) + '</h2>' +
      '<p class="lb-note lb-r">' + esc(t('sevenNote', sigPrice)) + ' · ' + esc(t('swipe')) + '</p>' +
      '<div class="lb-carousel lb-r" id="lbCarousel" tabindex="0">' + SINS.map(([k, ko, en]) => {
        const dr = (B.drinks || {})[k] || {}, d = D.drinks[k] || {};
        return '<article class="lb-card">' +
          '<div class="lb-card-art"><img src="' + esc(A(dr.image)) + '" alt="" loading="lazy"></div>' +
          '<p class="lb-card-sin"><img src="' + esc(A((B.symbols || {})[k])) + '" alt="">' + esc(lang === 'en' ? en : ko) + '</p>' +
          '<h3>' + esc(en) + '</h3>' +
          '<p class="lb-card-ko">' + esc(lang === 'en' ? (d.style ? d.style.en : '') : dr.kr) + '</p>' +
          (d.style && lang === 'ko' ? '<p class="lb-chip">' + esc(d.style.ko) + '</p>' : '') +
          (d.desc ? '<p class="lb-card-desc">' + esc(L10(d.desc)) + '</p>' : '') +
          '<p class="lb-card-price">' + esc((SIG_FLAGS[k] || {}).soldOut ? t('soldOut') : sigPrice + t('won')) + '</p>' +
        '</article>';
      }).join('') + '</div>' +
      '<div class="lb-dots" aria-hidden="true">' + SINS.map((_, i) => '<i' + (i ? '' : ' class="on"') + '></i>').join('') + '</div>' +
    '</section>';

    // 테이블에서 기다리는 질문 (설문은 5층 테이블에서만 — 여기서는 예고)
    h += '<section class="lb-sec lb-table" id="table">' +
      '<p class="lb-kicker lb-r">' + t('tableKicker') + '</p>' +
      '<h2 class="lb-r">' + t('tableTitle') + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('tableBody')) + '</p>' +
      '<ol class="lb-q lb-r" aria-hidden="true">' + [1, 2, 3, 4, 5, 6, 7].map((n) => '<li>' + n + '</li>').join('') + '</ol>' +
    '</section>';

    // 위스키 선반
    h += '<section class="lb-sec" id="whisky">' +
      '<p class="lb-kicker lb-r">WHISKY</p>' +
      '<h2 class="lb-r">' + esc(L10(m.whiskyHead)) + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('whiskyBody', minGlass)) + '</p>' +
      '<div class="lb-shelf lb-r">' + whiskies.filter((it) => detail(it.id).photo).map((it) =>
        '<a class="lb-bottle" href="#m-' + esc(it.id) + '" data-act="bottle">' +
          '<span class="lb-bottle-img"><img src="' + esc(A(detail(it.id).photo)) + '" alt="" loading="lazy"></span>' +
          '<b>' + esc(it[lang] || it.ko) + '</b><small>G ' + esc(it.g) + '</small></a>').join('') + '</div>' +
    '</section>';

    // 바 안 풍경 · 안주
    const room = Array.isArray(P.room) ? P.room.filter(Boolean) : [];
    const bites = m.bites.filter((it) => shown(it) && detail(it.id).photo);
    if (room.length) {
      h += '<section class="lb-sec" id="room"><p class="lb-kicker lb-r">' + t('roomKicker') + '</p><h2 class="lb-r">' + esc(t('roomTitle')) + '</h2>' +
        '<p class="lb-body lb-r">' + esc(t('roomBody')) + '</p>' +
        '<div class="lb-room">' + room.map((p) => '<figure class="lb-r"><img src="' + esc(A(p)) + '" alt="" loading="lazy"></figure>').join('') + '</div></section>';
    }
    if (bites.length) {
      h += '<section class="lb-sec" id="bites"><p class="lb-kicker lb-r">' + t('bitesKicker') + '</p><h2 class="lb-r">' + esc(t('bitesTitle')) + '</h2>' +
        '<div class="lb-gallery">' + bites.map((it) =>
          '<a class="lb-shot lb-r" href="#m-' + esc(it.id) + '" data-act="bite"><img src="' + esc(A(detail(it.id).photo)) + '" alt="" loading="lazy">' +
          '<span><b>' + esc(lang === 'en' ? it.en : it.ko) + '</b><small>' + esc(it.soldOut ? t('soldOut') : it.p + t('won')) + '</small></span></a>').join('') +
        '</div></section>';
    }

    // 메뉴 전체
    h += '<section class="lb-sec" id="menu">' +
      '<p class="lb-kicker lb-r">' + t('menuKicker') + '</p>' +
      '<h2 class="lb-r">' + esc(t('menuTitle')) + '</h2>' + menuHtml(sigPrice) +
    '</section>';

    // 오시는 길 · 시간 · 가격
    const ig = L.instagram ? String(L.instagram).replace(/^@/, '') : '';
    const maps = Array.isArray(L.maps) ? L.maps.filter((x) => x && x.url) : L.mapUrl ? [{ url: L.mapUrl }] : [];
    const dim = (o) => (o ? '<br><span class="lb-dim">' + esc(L10(o)) + '</span>' : '');
    const contact = [ig ? '<a href="https://www.instagram.com/' + esc(ig) + '/" target="_blank" rel="noopener" data-act="instagram">@' + esc(ig) + '</a>' : '',
      L.phone ? '<a href="tel:' + esc(String(L.phone).replace(/[^\d+]/g, '')) + '" data-act="phone">' + esc(L.phone) + '</a>' : ''].filter(Boolean);
    h += '<section class="lb-sec lb-way" id="way">' +
      '<p class="lb-kicker lb-r">' + t('wayKicker') + '</p>' +
      '<h2 class="lb-r">' + t('wayTitle', F) + '</h2>' +
      (P.entrance ? '<figure class="lb-entrance lb-r"><img src="' + esc(A(P.entrance)) + '" alt="" loading="lazy"><figcaption>' + esc(t('entrance')) + '</figcaption></figure>' : '') +
      '<div class="lb-lift lb-r" aria-hidden="true">' + Array.from({ length: F }, (_, i) => '<i' + (i === F - 1 ? ' class="on"' : '') + '>' + (i + 1) + '</i>').join('') + '</div>' +
      '<dl class="lb-info lb-r">' +
        '<dt>' + esc(t('where')) + '</dt><dd><b>' + esc(t('here', F)) + '</b>' +
          (L.directions ? '<br>' + esc(L10(L.directions)) : '') + dim(L.address) + dim(L.station) + dim(L.parking) +
          (maps.length ? '<span class="lb-maps">' + maps.map((x) => '<a href="' + esc(x.url) + '" target="_blank" rel="noopener" data-act="map">' +
            esc(x.name ? L10(x.name) : t('map')) + ' →</a>').join('') + '</span>' : '') + '</dd>' +
        (hoursHtml() ? '<dt>' + esc(t('hours')) + '</dt><dd>' + hoursHtml() + '</dd>' : '') +
        '<dt>' + esc(t('price')) + '</dt><dd>' + esc(t('priceSig', sigPrice)) + '<br>' + esc(t('priceWhisky', minGlass)) + '<br>' + esc(t('noCover')) + '</dd>' +
        (contact.length ? '<dt>' + esc(t('contact')) + '</dt><dd>' + contact.join('<br>') + '</dd>' : '') +
      '</dl>' +
      (L.offer ? '<p class="lb-offer lb-r">' + esc(L10(L.offer)) + '</p>' : '') +
    '</section>';

    h += '<footer class="lb-foot"><img src="' + esc(A(B.wordmark)) + '" alt="Deadly Sins"><p>' + F + 'F · COCKTAIL &amp; WHISKY BAR</p></footer>';

    ROOT.innerHTML = h;
    DOCK.innerHTML = '<a href="#menu" class="lb-dock-menu" data-act="menu">' + esc(t('dockMenu')) + '</a>' +
      '<a href="#way" class="lb-dock-way" data-act="way">' + esc(t('dockWay')) + ' · ' + F + 'F</a>';
    document.documentElement.lang = lang;
    document.getElementById('lbLang').textContent = t('lang');
    motion();
  }

  /* ---------- 움직임 ---------- */
  let io = null, heroIo = null;
  function motion() {
    // 사진은 받아진 뒤 부드럽게
    ROOT.querySelectorAll('img').forEach((img) => {
      if (REDUCED) return;
      img.classList.add('lb-fade');
      const done = () => img.classList.add('lb-ready');
      if (img.complete && img.naturalWidth) done(); else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    });
    // 스크롤하면 차례로 떠오름
    if (io) io.disconnect();
    if (!REDUCED && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        let k = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.style.setProperty('--d', Math.min(k++, 6) * 70 + 'ms');
          e.target.classList.add('lb-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
      ROOT.querySelectorAll('.lb-r').forEach((el) => io.observe(el));
    } else ROOT.querySelectorAll('.lb-r').forEach((el) => el.classList.add('lb-in'));
    // 첫 화면을 벗어나면 아래 바로가기 막대
    const hero = ROOT.querySelector('.lb-hero');
    if (heroIo) heroIo.disconnect();
    if (hero && 'IntersectionObserver' in window) {
      // 위의 MENU · EN 은 첫 화면에서만 (스크롤하면 글자를 가리므로 숨기고 아래 막대가 대신)
      heroIo = new IntersectionObserver(([e]) => {
        DOCK.classList.toggle('show', !e.isIntersecting);
        TOP.classList.toggle('hide', !e.isIntersecting);
      }, { threshold: 0.15 });
      heroIo.observe(hero);
    }
    // 일곱 잔 넘김 점
    const car = document.getElementById('lbCarousel');
    if (car) {
      const dots = ROOT.querySelectorAll('.lb-dots i');
      car.addEventListener('scroll', () => {
        const cards = car.children; let best = 0, bestD = Infinity;
        const mid = car.scrollLeft + car.clientWidth / 2;
        for (let i = 0; i < cards.length; i++) { const c = cards[i]; const dd = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (dd < bestD) { bestD = dd; best = i; } }
        dots.forEach((d, i) => d.classList.toggle('on', i === best));
      }, { passive: true });
    }
  }

  /* ---------- 기록: 배너 QR 로 몇 명이 들어와서 메뉴 · 오시는 길 · 인스타를 눌렀는지 ---------- */
  const SID = Math.random().toString(36).slice(2, 10);
  function track(type, data) {
    if (D.collect && D.collect.enabled === false) return;
    try {
      const body = new Blob([JSON.stringify(Object.assign({ sid: SID, type, lang, from: 'promo' }, data || {}))], { type: 'text/plain;charset=utf-8' });
      if (!(navigator.sendBeacon && navigator.sendBeacon(BASE + 'api/track', body))) fetch(BASE + 'api/track', { method: 'POST', body, keepalive: true, mode: 'no-cors' }).catch(() => {});
    } catch (e) { /* 기록 실패는 무시 */ }
  }

  function goTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: id.indexOf('m-') === 0 ? 'center' : 'start' });
    if (id.indexOf('m-') === 0) { el.classList.remove('lb-hl'); void el.offsetWidth; el.classList.add('lb-hl'); }
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const act = a.getAttribute('data-act');
    if (act === 'lang') {
      lang = lang === 'ko' ? 'en' : 'ko';
      try { localStorage.setItem('ds_lang', lang); } catch (err) {}
      render();
      return;
    }
    const href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') { e.preventDefault(); goTo(href.slice(1)); }
    track('visit', { act });
  });

  render();
  if (location.hash.length > 1) setTimeout(() => goTo(location.hash.slice(1)), 60);   // 그리기 전이라 브라우저가 못 찾은 #menu 같은 것
  track('visit', { act: 'open' });
  if (typeof fetch === 'function') {
    fetch(BASE + 'api/menu').then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && j.data) { applyLive(j); render(); } }).catch(() => {});
  }
  // 영업 상태는 1분마다 다시
  setInterval(() => {
    const el = ROOT.querySelector('.lb-status'), st = openStatus();
    if (el && st) { el.lastChild.textContent = st.text; el.classList.toggle('is-open', st.open); }
  }, 60000);
})();
