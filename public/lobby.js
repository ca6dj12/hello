/* =============================================================
   DEADLY SINS — 1층 QR 소개 페이지 (/lobby)
   지나가던 사람이 QR 을 찍고 3초 안에 알아야 할 것: 무슨 곳인지 · 분위기 · 가격 · 어떻게 올라가는지.
   그리고 "올라오기 전에 나의 죄 테스트" → 결과로 나온 잔을 5층에서 주문하게 이어 준다.

   내용: data.js (메뉴 · 시그니처 설명 · lobby 설정) + brand.js (그림 경로) + /api/menu (사장님이 고친 가격 · 숨김)
   lobby 설정에서 null 인 칸(주소 · 영업시간 · 인스타 …)은 화면에 나오지 않는다.
   ============================================================= */
(function () {
  'use strict';
  const D = window.DS_DATA, B = window.DS_BRAND;
  if (!D || !B) return;
  const L = D.lobby || {};
  const ROOT = document.getElementById('lb');
  const DOCK = document.getElementById('lbDock');
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const SINS = [['교', '교만', 'PRIDE'], ['질', '질투', 'ENVY'], ['분', '분노', 'WRATH'], ['나', '나태', 'SLOTH'],
    ['탐', '탐욕', 'GREED'], ['식', '폭식', 'GLUTTONY'], ['색', '색욕', 'LUST']];
  const DAYS = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

  const T = {
    ko: {
      lang: 'EN', floorLine: 'COCKTAIL & WHISKY BAR',
      heroTitle: '일곱 개의 죄,<br>일곱 잔의 칵테일',
      ctaWay: '5층으로 오는 길', ctaTest: '올라오기 전, 나의 죄 테스트',
      conceptTitle: '오늘 밤, 당신은<br>어떤 죄를 삼키시겠습니까?',
      conceptBody: '데들리 신스는 일곱 가지 죄를 일곱 잔의 칵테일로 빚었습니다. 일곱 개의 질문에 답하면, 일곱 잔 중 하나가 당신을 고릅니다.',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: '일곱 잔의 시그니처', sevenNote: (p) => '모든 잔 ' + p + '원', swipe: '옆으로 넘겨 보세요',
      whiskyBody: (g) => '죄마다 어울리는 위스키를 골라 두었습니다. 글라스 ' + g + '원부터.', fullMenu: '전체 메뉴 보기',
      roomKicker: 'THE ROOM', roomTitle: '5층의 밤', roomBody: '낮은 조명, 거친 벽, 그리고 일곱 개의 죄. 혼자여도, 둘이어도 좋은 자리.',
      bitesKicker: 'BITES', bitesTitle: '곁들이는 것들', entrance: '이 간판이 보이면 도착이에요',
      testKicker: 'BEFORE YOU COME UP', testTitle: '올라오기 전에,<br>당신의 죄부터.',
      testBody: (f) => '질문 일곱 개, 1분이면 끝나요. 결과로 나온 잔을 ' + f + '층에서 주문하세요.', testCta: '나의 죄 알아보기',
      wayKicker: 'FIND US', wayTitle: (f) => f + '층에서<br>기다리고 있어요',
      here: (f) => '지금 계신 이 건물 ' + f + '층', map: '지도에서 보기',
      where: '위치', hours: '영업시간', price: '가격', contact: '문의',
      priceSig: (p) => '시그니처 칵테일 ' + p + '원', priceWhisky: (g) => '위스키 글라스 ' + g + '원부터', noCover: '커버차지 없음',
      openNow: (c) => '지금 영업 중 · ' + c + '까지', opensAt: (o) => '오늘 ' + o + ' 오픈', closedToday: '오늘은 쉬어요',
      dockTest: '나의 죄 테스트', dockWay: '오시는 길', won: '원'
    },
    en: {
      lang: '한국어', floorLine: 'COCKTAIL & WHISKY BAR',
      heroTitle: 'Seven sins.<br>Seven glasses.',
      ctaWay: 'How to find us · 5F', ctaTest: 'Find your sin before you come up',
      conceptTitle: 'Tonight, which sin<br>will you swallow?',
      conceptBody: 'Deadly Sins turns the seven deadly sins into seven cocktails. Answer seven questions, and one of the seven glasses chooses you.',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: 'Seven signatures', sevenNote: (p) => p + ' KRW each', swipe: 'Swipe to see them all',
      whiskyBody: (g) => 'A whisky for every sin. Glasses from ' + g + ' KRW.', fullMenu: 'See the full menu',
      roomKicker: 'THE ROOM', roomTitle: 'Nights on 5F', roomBody: 'Low light, rough walls and seven sins. A seat for one, or for two.',
      bitesKicker: 'BITES', bitesTitle: 'On the side', entrance: 'You have arrived when you see this sign',
      testKicker: 'BEFORE YOU COME UP', testTitle: 'Before you come up,<br>find your sin.',
      testBody: (f) => 'Seven questions, one minute. Order the glass you get on the ' + f + 'th floor.', testCta: 'Find my sin',
      wayKicker: 'FIND US', wayTitle: (f) => 'We are waiting<br>on the ' + f + 'th floor',
      here: (f) => 'This building, ' + f + 'th floor', map: 'Open in maps',
      where: 'Where', hours: 'Hours', price: 'Prices', contact: 'Contact',
      priceSig: (p) => 'Signature cocktails ' + p + ' KRW', priceWhisky: (g) => 'Whisky by the glass from ' + g + ' KRW', noCover: 'No cover charge',
      openNow: (c) => 'Open now · until ' + c, opensAt: (o) => 'Opens today at ' + o, closedToday: 'Closed today',
      dockTest: 'Find my sin', dockWay: 'Find us', won: ' KRW'
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

  /* ---------- 사장님이 /admin 에서 고친 가격 · 숨김 · 시그니처 가격 ---------- */
  function applyLive(live) {
    const d = live && live.data;
    if (!d) return;
    if (Number.isInteger(d.signaturePrice) && d.signaturePrice > 0) D.signaturePrice = d.signaturePrice;
    const items = d.items || {};
    const m = D.menu;
    [].concat(...m.whisky.map((w) => w.items), m.final.items, m.bites).forEach((it) => {
      const o = it.id && items[it.id];
      if (o) ['g', 'b', 'p', 'hidden', 'soldOut'].forEach((k) => { if (o[k] !== undefined) it[k] = o[k]; });
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
    // 어제 연 영업이 자정을 넘겨 지금까지 이어지는지
    if (yday && toMin(yday.close) < toMin(yday.open) && min < toMin(yday.close)) return { open: true, text: t('openNow', pretty(yday.close)) };
    if (today) {
      const o = toMin(today.open), c = toMin(today.close);
      const past = c < o ? min >= o : (min >= o && min < c);
      if (past) return { open: true, text: t('openNow', pretty(today.close)) };
      if (min < o) return { open: false, text: t('opensAt', pretty(today.open)) };
    }
    return { open: false, text: t('closedToday') };
  }
  function hoursHtml() {
    const H = Array.isArray(L.hours) ? L.hours : [];
    if (!H.length) return '';
    return H.map((h) => '<span>' + esc(h.days.slice().sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map((d) => DAYS[lang][d]).join(' · ')) +
      '</span> ' + esc(h.open) + ' – ' + esc(h.close)).join('<br>') + (L.hoursNote ? '<br><small>' + esc(L10(L.hoursNote)) + '</small>' : '');
  }

  /* ---------- 그리기 ---------- */
  function render() {
    const m = D.menu, F = L.floor || 5;
    const sigPrice = money(D.signaturePrice);
    const whiskies = [].concat(...m.whisky.map((w) => w.items), m.final.items).filter((it) => !it.hidden);
    const minGlass = money(Math.min(...whiskies.map((it) => num(it.g)).filter(Boolean)));
    const detail = (id) => (D.details || {})[id] || {};
    const P = L.photos && typeof L.photos === 'object' ? L.photos : {};
    let h = '';

    // 첫 화면
    const st = openStatus();
    h += '<section class="lb-hero" id="top">' +
      '<img class="lb-hero-art" src="' + esc(B.cover) + '" alt="Deadly Sins">' +
      '<div class="lb-hero-copy">' +
        '<p class="lb-floor"><span>' + F + 'F</span>' + esc(t('floorLine')) + '</p>' +
        '<h1>' + t('heroTitle') + '</h1>' +
        (st ? '<p class="lb-status' + (st.open ? ' is-open' : '') + '"><i></i>' + esc(st.text) + '</p>' : '') +
        '<div class="lb-cta">' +
          '<a class="lb-btn lb-primary" href="#way" data-act="way">' + esc(t('ctaWay')) + '</a>' +
          '<a class="lb-btn" href="./?from=lobby" data-act="test">' + esc(t('ctaTest')) + '</a>' +
        '</div>' +
      '</div>' +
      '<a class="lb-down" href="#concept" aria-label="↓"><span></span></a>' +
    '</section>';

    // 콘셉트 + 일곱 상징
    h += '<section class="lb-sec lb-concept" id="concept">' +
      '<p class="lb-kicker lb-r">THE CONCEPT</p>' +
      '<h2 class="lb-r">' + t('conceptTitle') + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('conceptBody')) + '</p>' +
      '<ul class="lb-syms lb-r">' + SINS.map(([k, ko, en]) =>
        '<li><img src="' + esc((B.symbols || {})[k] || '') + '" alt=""><span>' + esc(lang === 'en' ? en : ko) + '</span></li>').join('') + '</ul>' +
      (P.wall ? '<figure class="lb-wide lb-r"><img src="' + esc(P.wall) + '" alt="" loading="lazy"></figure>' : '') +
    '</section>';

    // 일곱 잔
    h += '<section class="lb-sec" id="seven">' +
      '<p class="lb-kicker lb-r">' + esc(t('sevenKicker')) + '</p>' +
      '<h2 class="lb-r">' + esc(t('sevenTitle')) + '</h2>' +
      '<p class="lb-note lb-r">' + esc(t('sevenNote', sigPrice)) + ' · ' + esc(t('swipe')) + '</p>' +
      '<div class="lb-carousel lb-r" id="lbCarousel" tabindex="0">' + SINS.map(([k, ko, en]) => {
        const dr = (B.drinks || {})[k] || {}, d = D.drinks[k] || {};
        return '<article class="lb-card">' +
          '<div class="lb-card-art"><img src="' + esc(dr.image) + '" alt="" loading="lazy"></div>' +
          '<p class="lb-card-sin"><img src="' + esc((B.symbols || {})[k] || '') + '" alt="">' + esc(lang === 'en' ? en : ko) + '</p>' +
          '<h3>' + esc(en) + '</h3>' +
          '<p class="lb-card-ko">' + esc(lang === 'en' ? (d.style ? d.style.en : '') : dr.kr) + '</p>' +
          (d.style && lang === 'ko' ? '<p class="lb-chip">' + esc(d.style.ko) + '</p>' : '') +
          (d.desc ? '<p class="lb-card-desc">' + esc(L10(d.desc)) + '</p>' : '') +
          '<p class="lb-card-price">' + esc(sigPrice) + esc(t('won')) + '</p>' +
        '</article>';
      }).join('') + '</div>' +
      '<div class="lb-dots" aria-hidden="true">' + SINS.map((_, i) => '<i' + (i ? '' : ' class="on"') + '></i>').join('') + '</div>' +
    '</section>';

    // 위스키 선반
    h += '<section class="lb-sec" id="whisky">' +
      '<p class="lb-kicker lb-r">WHISKY</p>' +
      '<h2 class="lb-r">' + esc(L10(m.whiskyHead)) + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('whiskyBody', minGlass)) + '</p>' +
      '<div class="lb-shelf lb-r">' + whiskies.filter((it) => detail(it.id).photo).map((it) =>
        '<a class="lb-bottle" href="./#menu/' + esc(it.id) + '" data-act="bottle">' +
          '<span class="lb-bottle-img"><img src="' + esc(detail(it.id).photo) + '" alt="" loading="lazy"></span>' +
          '<b>' + esc(it[lang] || it.ko) + '</b><small>G ' + esc(it.g) + '</small></a>').join('') + '</div>' +
      '<a class="lb-link lb-r" href="./#menu" data-act="menu">' + esc(t('fullMenu')) + ' →</a>' +
    '</section>';

    // 바 안 풍경 · 안주
    const room = Array.isArray(P.room) ? P.room.filter(Boolean) : [];
    const bites = m.bites.filter((it) => !it.hidden && detail(it.id).photo);
    if (room.length) {
      h += '<section class="lb-sec" id="room"><p class="lb-kicker lb-r">' + t('roomKicker') + '</p><h2 class="lb-r">' + esc(t('roomTitle')) + '</h2>' +
        '<p class="lb-body lb-r">' + esc(t('roomBody')) + '</p>' +
        '<div class="lb-room">' + room.map((p) => '<figure class="lb-r"><img src="' + esc(p) + '" alt="" loading="lazy"></figure>').join('') + '</div></section>';
    }
    if (bites.length) {
      h += '<section class="lb-sec" id="bites"><p class="lb-kicker lb-r">' + t('bitesKicker') + '</p><h2 class="lb-r">' + esc(t('bitesTitle')) + '</h2>' +
        '<div class="lb-gallery">' + bites.map((it) =>
          '<a class="lb-shot lb-r" href="./#menu/' + esc(it.id) + '" data-act="bite"><img src="' + esc(detail(it.id).photo) + '" alt="" loading="lazy">' +
          '<span><b>' + esc(lang === 'en' ? it.en : it.ko) + '</b><small>' + esc(it.p) + esc(t('won')) + '</small></span></a>').join('') +
        '</div></section>';
    }

    // 테스트
    h += '<section class="lb-sec lb-test" id="test">' +
      '<p class="lb-kicker lb-r">' + t('testKicker') + '</p>' +
      '<h2 class="lb-r">' + t('testTitle') + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('testBody', F)) + '</p>' +
      '<a class="lb-btn lb-primary lb-r" href="./?from=lobby" data-act="test">' + esc(t('testCta')) + ' →</a>' +
    '</section>';

    // 오시는 길 · 시간 · 가격
    const contact = [L.instagram ? '<a href="https://instagram.com/' + esc(String(L.instagram).replace(/^@/, '')) + '" target="_blank" rel="noopener">@' + esc(String(L.instagram).replace(/^@/, '')) + '</a>' : '',
      L.phone ? '<a href="tel:' + esc(String(L.phone).replace(/[^\d+]/g, '')) + '">' + esc(L.phone) + '</a>' : ''].filter(Boolean);
    h += '<section class="lb-sec lb-way" id="way">' +
      '<p class="lb-kicker lb-r">' + t('wayKicker') + '</p>' +
      '<h2 class="lb-r">' + t('wayTitle', F) + '</h2>' +
      (P.entrance ? '<figure class="lb-entrance lb-r"><img src="' + esc(P.entrance) + '" alt="" loading="lazy"><figcaption>' + esc(t('entrance')) + '</figcaption></figure>' : '') +
      '<div class="lb-lift lb-r" aria-hidden="true">' + Array.from({ length: F }, (_, i) => '<i' + (i === F - 1 ? ' class="on"' : '') + '>' + (i + 1) + '</i>').join('') + '</div>' +
      '<dl class="lb-info lb-r">' +
        '<dt>' + esc(t('where')) + '</dt><dd><b>' + esc(t('here', F)) + '</b>' +
          (L.directions ? '<br>' + esc(L10(L.directions)) : '') +
          (L.address ? '<br><span class="lb-dim">' + esc(L10(L.address)) + '</span>' : '') +
          (L.mapUrl ? '<br><a href="' + esc(L.mapUrl) + '" target="_blank" rel="noopener">' + esc(t('map')) + ' →</a>' : '') + '</dd>' +
        (hoursHtml() ? '<dt>' + esc(t('hours')) + '</dt><dd>' + hoursHtml() + '</dd>' : '') +
        '<dt>' + esc(t('price')) + '</dt><dd>' + esc(t('priceSig', sigPrice)) + '<br>' + esc(t('priceWhisky', minGlass)) + '<br>' + esc(t('noCover')) + '</dd>' +
        (contact.length ? '<dt>' + esc(t('contact')) + '</dt><dd>' + contact.join('<br>') + '</dd>' : '') +
      '</dl>' +
      (L.offer ? '<p class="lb-offer lb-r">' + esc(L10(L.offer)) + '</p>' : '') +
    '</section>';

    h += '<footer class="lb-foot"><img src="' + esc(B.wordmark) + '" alt="Deadly Sins"><p>' + F + 'F · COCKTAIL &amp; WHISKY BAR</p></footer>';

    ROOT.innerHTML = h;
    DOCK.innerHTML = '<a href="./?from=lobby" class="lb-dock-test" data-act="test">' + esc(t('dockTest')) + '</a>' +
      '<a href="#way" class="lb-dock-way" data-act="way">' + esc(t('dockWay')) + ' · ' + F + 'F</a>';
    document.documentElement.lang = lang;
    document.getElementById('lbLang').textContent = t('lang');
    motion();
  }

  /* ---------- 움직임 ---------- */
  let io = null;
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
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      ROOT.querySelectorAll('.lb-r').forEach((el) => io.observe(el));
    } else ROOT.querySelectorAll('.lb-r').forEach((el) => el.classList.add('lb-in'));
    // 첫 화면을 벗어나면 아래 바로가기 막대
    const hero = ROOT.querySelector('.lb-hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { DOCK.classList.toggle('show', !e.isIntersecting); }, { threshold: 0.15 }).observe(hero);
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

  /* ---------- 기록: 1층 QR 로 몇 명이 들어와서 몇 명이 테스트 · 메뉴로 갔는지 ---------- */
  const SID = Math.random().toString(36).slice(2, 10);
  function track(type, data) {
    if (D.collect && D.collect.enabled === false) return;
    try {
      const body = new Blob([JSON.stringify(Object.assign({ sid: SID, type, lang, from: 'lobby' }, data || {}))], { type: 'text/plain;charset=utf-8' });
      if (!(navigator.sendBeacon && navigator.sendBeacon('api/track', body))) fetch('api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
    } catch (e) { /* 기록 실패는 무시 */ }
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
    if (act === 'way') {
      e.preventDefault();
      const way = document.getElementById('way');
      if (way) way.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    }
    track('visit', { act });
  });

  render();
  if (location.hash.length > 1) {   // lobby#way 처럼 들어오면 (그리기 전이라 브라우저가 못 찾았다)
    const target = document.getElementById(location.hash.slice(1));
    if (target) setTimeout(() => target.scrollIntoView({ block: 'start' }), 60);
  }
  track('visit', { act: 'open' });
  if (typeof fetch === 'function') {
    fetch('api/menu').then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && j.data) { applyLive(j); render(); } }).catch(() => {});
  }
  // 영업 상태는 1분마다 다시
  setInterval(() => {
    const el = ROOT.querySelector('.lb-status'), st = openStatus();
    if (el && st) { el.lastChild.textContent = st.text; el.classList.toggle('is-open', st.open); }
  }, 60000);
})();
