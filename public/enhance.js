/* =============================================================
   DEADLY SINS — 개선 레이어
   원본 HTML 의 스크립트 뒤에 실행되어, 원본 함수를 감싸서 기능을 더합니다.
   원본 파일은 손대지 않으므로 디자이너가 새 버전을 보내도 다시 끼워 넣기만 하면 됩니다.

   하는 일
     · 보기 순서를 매 세션 섞기 (Fisher–Yates)          → 위치 습관이 결과를 끌지 않게
     · 동점 처리: 3점 받은 횟수 → 2점 횟수 → 세션별 무작위 → 배열 순서 편애 제거
     · 결과 제목과 시그니처 술이 늘 같은 죄를 가리키게
     · 폰 뒤로가기 = 앱 안의 뒤로가기
     · 다시 하기 / 맛·향·강도·가격 / 바텐더용 주문 화면 / 전체 메뉴 / 결과 이미지 공유
     · 한국어 ⇄ English
     · 결과·오류 익명 기록 → /api/track → Neon (data.js 의 collect.enabled 로 끄고 켬)
   ============================================================= */
(function () {
  'use strict';

  if (typeof QUESTIONS === 'undefined' || typeof SINS === 'undefined' || !window.DS_DATA || !window.DS_I18N) {
    console.warn('[deadly-sins] 원본 스크립트나 데이터 파일을 찾지 못해 개선 레이어를 건너뜁니다.');
    return;
  }

  const VERSION = '2026-10-22';
  const DATA = window.DS_DATA;
  const I18N = window.DS_I18N;
  const N = QUESTIONS.length;
  const el = (id) => document.getElementById(id);

  /* -----------------------------------------------------------
     0. 기록 → 같은 사이트의 /api/track (api/track.js 가 Neon 에 저장)
        DB 가 아직 연결 안 돼 있으면 서버가 조용히 버린다.
        sendBeacon 은 페이지를 닫는 순간에도 전송이 끝까지 간다. 응답은 읽지 않음.
     ----------------------------------------------------------- */
  const COLLECT = DATA.collect || {};
  const COLLECT_ON = COLLECT.enabled !== false;
  const ENDPOINT = 'api/track';
  const newSid = () => Math.random().toString(36).slice(2, 10);
  let SID = newSid();
  let errorBudget = 5;

  function track(type, data) {
    if (!COLLECT_ON) return;
    try {
      const body = JSON.stringify(Object.assign({ sid: SID, type, lang, v: VERSION }, data || {}));
      const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      if (!(navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob))) {
        fetch(ENDPOINT, { method: 'POST', keepalive: true, body: blob }).catch(() => {});
      }
    } catch (e) { /* 기록 실패가 사이트를 멈추면 안 된다 */ }
  }
  window.addEventListener('error', (e) => {
    if (errorBudget-- <= 0) return;
    track('error', {
      message: String(e.message || '').slice(0, 300),
      file: String(e.filename || '').split('/').pop(),
      line: e.lineno, col: e.colno,
      ua: navigator.userAgent.slice(0, 200)
    });
  });
  window.addEventListener('unhandledrejection', (e) => {
    if (errorBudget-- <= 0) return;
    track('error', { message: String((e.reason && e.reason.message) || e.reason).slice(0, 300), ua: navigator.userAgent.slice(0, 200) });
  });

  /* -----------------------------------------------------------
     1. 언어
     ----------------------------------------------------------- */
  let lang = (function () {
    try { const v = localStorage.getItem('ds_lang'); if (v === 'ko' || v === 'en') return v; } catch (e) {}
    return /^ko\b/i.test(navigator.language || 'ko') ? 'ko' : 'en';
  })();
  const t = (key) => {
    const v = (I18N[lang].ui[key] !== undefined) ? I18N[lang].ui[key] : I18N.ko.ui[key];
    return v === undefined ? key : v;
  };

  // 원본 문구를 한 번 떠 두고, 언어를 바꿀 때마다 둘 중 하나로 덮어쓴다
  QUESTIONS.forEach((q, i) => {
    q._ko = q.q; q._en = I18N.en.questions[i].q;
    q.a.forEach((o, j) => { o._id = i + '-' + j; o._ko = o.text; o._en = I18N.en.questions[i].a[j]; });
  });
  const SIN_KO = SINS.map((s) => s.name);
  const KO = {};
  SINS.forEach((s, i) => { KO[s.k] = SIN_KO[i]; });
  const REACTIONS_KO = REACTIONS.slice();
  const TRAITS_KO = JSON.parse(JSON.stringify(RESULT_TRAITS));
  const DRINK_KO = {};
  Object.keys(SIGNATURE_DRINKS).forEach((k) => { DRINK_KO[k] = SIGNATURE_DRINKS[k].kr; });

  const STATIC = [
    ['#start', 'start', false],
    ['.footer-tip', 'footerTip', false],
    ['#toDesire', 'toDesire', false],
    ['.legend-soft span:nth-child(1)', 'legendWeak', false],
    ['.legend-soft span:nth-child(2)', 'legendStrong', false],
    ['.signature-intro h1', 'sigTitle', true],
    ['.signature-intro p', 'sigSub', false]
  ].map(([sel, key, html]) => {
    const node = document.querySelector(sel);
    return node ? { node, key, html, ko: html ? node.innerHTML : node.textContent } : null;
  }).filter(Boolean);

  function applyLang() {
    document.documentElement.lang = lang;
    QUESTIONS.forEach((q) => {
      q.q = lang === 'en' ? q._en : q._ko;
      q.a.forEach((o) => { o.text = lang === 'en' ? o._en : o._ko; });
    });
    SINS.forEach((s, i) => { s.name = lang === 'en' ? I18N.en.sins[s.k] : SIN_KO[i]; });
    Object.keys(RESULT_TRAITS).forEach((k) => {
      RESULT_TRAITS[k] = lang === 'en' ? I18N.en.traits[k] : TRAITS_KO[k];
    });
    Object.keys(SIGNATURE_DRINKS).forEach((k) => {
      SIGNATURE_DRINKS[k].kr = lang === 'en' ? I18N.en.drinkName[k] : DRINK_KO[k];
    });
    REACTIONS.forEach((_, i) => { REACTIONS[i] = (lang === 'en' && I18N.en.reactions[i]) || REACTIONS_KO[i]; });
    STATIC.forEach(({ node, key, html, ko }) => {
      const v = lang === 'en' ? t(key) : ko;
      if (html) node.innerHTML = v; else node.textContent = v;
    });
    const btn = el('dsLang');
    if (btn) btn.textContent = t('langToggle');
    const mb = el('dsMenuBtn');
    if (mb) mb.textContent = t('menu');
    if (document.body.dataset.dsScreen === 'quiz') renderQuestion();
  }

  /* -----------------------------------------------------------
     2. 보기 섞기 + 동점 처리
     ----------------------------------------------------------- */
  function shuffle(arr) {          // Fisher–Yates. sort(() => Math.random() - .5) 는 편향돼서 쓰면 안 된다.
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }
  let tieOrder = shuffle(SINS.map((s) => s.k));
  const isFresh = () => answers.every((a) => a === null);
  function newSession() {
    QUESTIONS.forEach((q) => shuffle(q.a));
    tieOrder = shuffle(SINS.map((s) => s.k));
    SID = newSid();
  }

  // 원본 calculate 를 대체. 같은 모양({...sin, points})으로 돌려준다.
  calculate = function () {
    const pts = {}, p3 = {}, p2 = {};
    SINS.forEach((s) => { pts[s.k] = 0; p3[s.k] = 0; p2[s.k] = 0; });
    QUESTIONS.forEach((q, i) => {
      const o = q.a[answers[i]];
      if (!o) return;
      o.points.split(' · ').forEach((part) => {
        const k = part[0], v = Number(part.slice(-1));
        pts[k] += v;
        if (v === 3) p3[k]++;
        if (v === 2) p2[k]++;
      });
    });
    return SINS.map((s) => Object.assign({}, s, { points: pts[s.k] }))
      .sort((a, b) => b.points - a.points || p3[b.k] - p3[a.k] || p2[b.k] - p2[a.k] ||
        tieOrder.indexOf(a.k) - tieOrder.indexOf(b.k));
  };

  /* -----------------------------------------------------------
     3. 화면 전환 감시 (show 감싸기)
     ----------------------------------------------------------- */
  const originalShow = show;
  show = function (name) {
    originalShow(name);
    document.body.dataset.dsScreen = name;
  };
  document.body.dataset.dsScreen = 'cover';

  // #app 은 overflow:hidden 이라 손가락으로는 안 밀리지만, 포커스나 scrollIntoView 같은
  // 프로그램 동작에 통째로 밀려 올라가 화면 위가 잘린 채로 남을 수 있다. 늘 제자리로 되돌린다.
  const appRoot = el('app');
  if (appRoot) {
    appRoot.addEventListener('scroll', () => {
      if (appRoot.scrollTop || appRoot.scrollLeft) { appRoot.scrollTop = 0; appRoot.scrollLeft = 0; }
    });
  }

  /* -----------------------------------------------------------
     4. 폰 뒤로가기 = 앱 안의 뒤로가기
        앞으로 가는 동작(클릭)마다 기록을 하나씩 쌓고,
        뒤로가기는 한 칸 빼면서 그 화면의 ← 버튼을 대신 눌러 준다.
        앱 안의 ← 버튼도 같은 길(history.back)로 보내 기록과 화면이 어긋나지 않게 한다.
     ----------------------------------------------------------- */
  let depth = 0, passNative = false, ignorePops = 0;
  function push(tag) { history.pushState({ ds: tag }, ''); depth++; }
  function nativeClick(id) {
    const b = el(id); if (!b) return;
    passNative = true;
    try { b.click(); } finally { passNative = false; }
  }
  function unwindHistory() {
    if (depth > 0) { ignorePops++; history.go(-depth); depth = 0; }
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // 새 세션 시작: 보기 섞기 + 기록 쌓기
    if (target.closest('#cover') && !coverTransitionBusy) {
      if (isFresh()) newSession();
      push('quiz');
      track('start');
      return;
    }
    // 답 고르기
    const choice = target.closest('#choices .choice');
    if (choice && !advancing) { push('q'); return; }
    // 시그니처 술로
    if (target.closest('#toDesire')) { push('signature'); return; }

    // 앱 안의 ← 버튼들은 history.back 으로 돌린다
    const backBtn = target.closest('#back, #resultBack, #signatureBack');
    if (backBtn && !passNative && depth > 0) {
      e.stopImmediatePropagation();
      e.preventDefault();
      history.back();
    }
  }, true);

  window.addEventListener('popstate', () => {
    if (ignorePops > 0) { ignorePops--; return; }
    depth = Math.max(0, depth - 1);
    if (closeTopOverlay()) return;
    const screen = document.body.dataset.dsScreen;
    if (screen === 'signature') nativeClick('signatureBack');
    else if (screen === 'results') nativeClick('resultBack');
    else if (screen === 'quiz') nativeClick('back');
  });

  /* -----------------------------------------------------------
     5. 결과 화면: 제목 = 시그니처 술과 같은 죄
     ----------------------------------------------------------- */
  const originalRenderResults = renderResults;
  renderResults = function () {
    originalRenderResults.apply(this, arguments);
    if (answers.some((a) => a === null)) return;
    const ranked = calculate();
    const winner = ranked[0];
    el('resultTitle').textContent = winner.name;
    // 다음 화면에서 쓸 술 이미지를 미리 받아 둔다
    const img = new Image(); img.src = SIGNATURE_DRINKS[winner.k].image;
    // 뒤로 가서 답을 바꾸면 다시 보낸다. 서버가 같은 세션의 결과 줄을 덮어써서 마지막 결과만 남긴다.
    track('result', {
      sin: KO[winner.k],
      second: KO[ranked[1].k],
      tie: ranked[0].points === ranked[1].points,
      points: ranked.map((s) => KO[s.k] + ' ' + s.points).join(' · '),
      // 고른 보기를 "원래" 보기 순서로: Q1B = 1번 문항의 디자이너 원본 B 보기
      picks: QUESTIONS.map((q, i) => {
        const o = q.a[answers[i]]; if (!o) return '';
        return 'Q' + (i + 1) + 'ABCD'[Number(o._id.split('-')[1])];
      }).join(' ')
    });
  };

  /* -----------------------------------------------------------
     6. 시그니처 화면: 라벨 번역 + 맛·가격·주문·메뉴·공유·다시 하기
     ----------------------------------------------------------- */
  const won = (n) => n.toLocaleString('ko-KR') + t('won');
  const priceOf = () => won(DATA.signaturePrice);
  let currentSin = null;

  const extra = document.createElement('div');
  extra.className = 'ds-extra';
  const revealHost = el('signatureNameReveal');
  if (revealHost) revealHost.appendChild(extra);

  function pips(level) {
    let out = '<span class="ds-pips" aria-hidden="true">';
    for (let i = 1; i <= 5; i++) out += '<i class="' + (i <= level ? 'on' : '') + '"></i>';
    return out + '</span>';
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderExtra(k) {
    const d = DATA.drinks[k];
    const pair = DATA.menu.whisky.find((w) => w.sin === k);
    let html = '';
    if (d) {
      html += '<div class="ds-card ds-taste">';
      html += '<p class="ds-card-head">' + esc(t('tasteHead')) + '</p>';
      if (d.line && d.line.confirmed) html += '<p class="ds-line">' + esc(d.line[lang]) + '</p>';
      html += '<dl>';
      html += '<dt>' + esc(t('aroma')) + '</dt><dd>' + esc(d.aroma[lang]) + '</dd>';
      html += '<dt>' + esc(t('taste')) + '</dt><dd>' + esc(d.taste[lang]) + '</dd>';
      html += '<dt>' + esc(t('finish')) + '</dt><dd>' + esc(d.finish[lang]) + '</dd>';
      html += '<dt>' + esc(t('strength')) + '</dt><dd>' + esc(d.strength[lang]) + ' ' + pips(d.level) + '</dd>';
      html += '<dt>' + esc(t('price')) + '</dt><dd class="ds-price">' + esc(priceOf()) + '</dd>';
      html += '</dl></div>';
    }
    if (pair) {
      html += '<div class="ds-card ds-pair">';
      html += '<p class="ds-card-head">' + esc(t('pairHead')) + ' <span>' + esc(pair.label[lang]) + '</span></p>';
      pair.items.forEach((it) => { html += menuRow(it[lang], t('glass') + ' ' + it.g, '', it.id); });
      html += '</div>';
    }
    html += '<button type="button" class="cta ds-order-btn" data-ds="order">' + esc(t('order')) + '</button>';
    html += '<div class="ds-actions">';
    html += '<button type="button" data-ds="share">' + esc(t('saveImage')) + '</button>';
    html += '<button type="button" data-ds="menu">' + esc(t('fullMenu')) + '</button>';
    html += '<button type="button" data-ds="restart">' + esc(t('restart')) + '</button>';
    html += '</div>';
    extra.innerHTML = html;
  }

  const originalRenderTrait = renderSignatureTrait;
  renderSignatureTrait = function (ranked) {
    originalRenderTrait.apply(this, arguments);
    currentSin = ranked[0].k;
    if (lang === 'en') {
      const host = el('signatureTrait');
      const labels = host.querySelectorAll('.trait-label');
      ['love', 'work', 'sex'].forEach((key, i) => { if (labels[i]) labels[i].textContent = t(key); });
      const age = host.querySelector('.sex-age-warning'); if (age) age.textContent = t('ageWarn');
      const lock = host.querySelector('.sex-lock-main'); if (lock) lock.textContent = t('lockMain');
      const secret = host.querySelector('.sex-secret'); if (secret) secret.setAttribute('aria-label', t('lockMain'));
    }
    renderExtra(currentSin);
    track('signature', { sin: KO[currentSin] });
  };

  // 이름이 떠오르면(오버레이가 덮이면) 뒤에 비치던 "당신의 욕망을 채워주세요" 를 숨긴다
  if (revealHost && typeof MutationObserver !== 'undefined') {
    new MutationObserver(() => {
      el('signature').classList.toggle('ds-revealed', revealHost.classList.contains('visible'));
    }).observe(revealHost, { attributes: true, attributeFilter: ['class'] });
  }

  /* -----------------------------------------------------------
     7. 전체 화면 레이어 (주문 화면, 메뉴)
     ----------------------------------------------------------- */
  const overlays = [];
  let wakeLock = null;
  function openOverlay(node) {
    document.body.appendChild(node);
    overlays.push(node);
    requestAnimationFrame(() => node.classList.add('open'));
    push('overlay');
  }
  function closeTopOverlay() {
    const node = overlays.pop();
    if (!node) return false;
    node.classList.remove('open');
    setTimeout(() => node.remove(), 220);
    if (wakeLock && !overlays.some((o) => o.id === 'dsOrder')) { wakeLock.release().catch(() => {}); wakeLock = null; }
    return true;
  }
  function closeAllOverlays() { while (overlays.length) closeTopOverlay(); }
  function layer(id, inner) {
    const node = document.createElement('div');
    node.className = 'ds-layer'; node.id = id;
    node.setAttribute('role', 'dialog'); node.setAttribute('aria-modal', 'true');
    node.innerHTML = '<button type="button" class="nav-back ds-close" data-ds="close">← ' + esc(t('close')) + '</button>' + inner;
    return node;
  }

  function openOrder() {
    const k = currentSin; if (!k) return;
    const drink = SIGNATURE_DRINKS[k];
    const inner =
      '<div class="ds-order">' +
        '<p class="ds-kicker">' + esc(t('orderKicker')) + '</p>' +
        '<img class="ds-order-art" src="' + esc(drink.image) + '" alt="">' +
        '<p class="ds-order-en">' + esc(drink.en) + '</p>' +
        '<p class="ds-order-ko">' + esc(DRINK_KO[k]) + (lang === 'en' ? '<br><span>' + esc(I18N.en.drinkName[k]) + '</span>' : '') + '</p>' +
        '<p class="ds-order-price">' + esc(priceOf()) + '</p>' +
        '<p class="ds-order-note">' + esc(t('orderNote')) + '</p>' +
      '</div>';
    openOverlay(layer('dsOrder', inner));
    // 바텐더가 읽는 동안 화면이 꺼지지 않게 (지원하는 폰만)
    if (navigator.wakeLock && navigator.wakeLock.request) {
      navigator.wakeLock.request('screen').then((l) => { wakeLock = l; }).catch(() => {});
    }
    track('order', { sin: KO[k] });
  }

  // 메뉴 항목 찾기: id → { item, group, sinKey, kind }
  const MENU_INDEX = {};
  (function indexMenu() {
    const m = DATA.menu;
    m.whisky.forEach((w) => w.items.forEach((it) => { if (it.id) MENU_INDEX[it.id] = { item: it, group: w.label, sinKey: w.sin, kind: 'whisky' }; }));
    m.final.items.forEach((it) => { if (it.id) MENU_INDEX[it.id] = { item: it, group: m.final.label, title: m.final.title, kind: 'whisky' }; });
    ['cocktails', 'bites', 'beverages'].forEach((sec) => (m[sec] || []).forEach((it) => { if (it.id) MENU_INDEX[it.id] = { item: it, kind: sec }; }));
  })();
  const detailOf = (id) => (DATA.details || {})[id] || null;
  const canOpen = (id) => !!id && (id.indexOf('sig:') === 0 || !!detailOf(id));

  // 메뉴 한 줄. 설명이 있는 항목은 누를 수 있는 버튼으로. desc 는 이름 아래 한 줄 설명 (시그니처 잔).
  function menuRow(name, price, sub, id, desc) {
    const d = id && detailOf(id);
    // 시그니처 잔은 그 죄의 상징(마름모 · 별 · 원 …), 나머지는 병 · 접시 사진
    const sym = id && id.indexOf('sig:') === 0 && window.DS_SYMBOLS ? window.DS_SYMBOLS[id.slice(4)] : null;
    const thumb = sym ? '<img class="ds-sym" src="' + esc(sym) + '" alt="" loading="lazy">'
      : d && d.photo ? '<img class="ds-thumb' + (d.scene ? ' ds-thumb-scene' : '') + '" src="' + esc(d.photo) + '" alt="" loading="lazy">' : '';
    const inner = thumb + '<span class="ds-row-name">' + esc(name) + (sub ? '<small>' + esc(sub) + '</small>' : '') +
      (desc ? '<small class="ds-row-desc">' + esc(desc) + '</small>' : '') + '</span>' +
      '<span class="ds-row-price">' + esc(price) + '</span>';
    if (canOpen(id)) {
      return '<button type="button" class="ds-row ds-tap" data-ds="item" data-id="' + esc(id) + '">' + inner + '<i class="ds-chev" aria-hidden="true">›</i></button>';
    }
    return '<p class="ds-row">' + inner + '</p>';
  }

  function openMenu() {
    const m = DATA.menu, mine = currentSin;
    let h = '<div class="ds-menu"><h2>MENU</h2><p class="ds-tap-hint">' + esc(t('tapHint')) + '</p>';

    h += '<section><h3>' + esc(t('menuSeven')) + '</h3><p class="ds-note">' + esc(t('menuSevenNote')(DATA.signaturePrice.toLocaleString('ko-KR'))) + '</p>';
    SINS.forEach((s) => {
      const d = DATA.drinks[s.k];
      const name = SIGNATURE_DRINKS[s.k].en + ' · ' + (lang === 'en' ? I18N.en.drinkName[s.k] : DRINK_KO[s.k]);
      const sub = d ? (d.style ? d.style[lang] : d.aroma[lang]) : '';
      h += '<div class="ds-sig' + (s.k === mine ? ' mine' : '') + '">' + menuRow(name, priceOf(), sub, 'sig:' + s.k, d && d.desc ? d.desc[lang] : '') +
        (s.k === mine ? '<em>' + esc(t('yourSin')) + '</em>' : '') + '</div>';
    });
    h += '</section>';

    h += '<section><h3>' + esc(t('menuWhisky')) + '</h3><p class="ds-note">' + esc(m.whiskyNote[lang]) + ' · ' + esc(m.whiskyHead[lang]) + '</p>';
    m.whisky.forEach((w) => {
      h += '<div class="ds-group' + (w.sin === mine ? ' mine' : '') + '"><p class="ds-group-head">' + esc(w.label[lang]) +
        ' <span>' + esc(SINS.find((s) => s.k === w.sin).name) + '</span>' + (w.sin === mine ? '<em>' + esc(t('yourSin')) + '</em>' : '') + '</p>';
      w.items.forEach((it) => { h += menuRow(it[lang], 'G ' + it.g + ' · B ' + it.b, '', it.id); });
      h += '</div>';
    });
    h += '<div class="ds-group"><p class="ds-group-head">' + esc(m.final.title) + ' <span>' + esc(m.final.label[lang]) + '</span></p>';
    m.final.items.forEach((it) => { h += menuRow(it[lang], 'G ' + it.g + ' · B ' + it.b, '', it.id); });
    h += '</div></section>';

    const list = (key, items) => {
      h += '<section><h3>' + esc(t(key)) + '</h3>';
      items.forEach((it) => { h += menuRow(lang === 'en' ? it.en : it.ko, it.p, lang === 'en' ? it.ko : it.en, it.id); });
      h += '</section>';
    };
    list('menuCocktails', m.cocktails);
    list('menuBites', m.bites);
    list('menuBeverages', m.beverages);

    h += '<section><h3>' + esc(t('menuInfo')) + '</h3>';
    m.info.forEach((i) => { h += '<p class="ds-info">' + esc(i[lang]) + '</p>'; });
    h += '<p class="ds-note">' + esc(t('menuNote')) + '</p>' + creditsHtml() + '</section></div>';

    openOverlay(layer('dsMenu', h));
    ensureStories().catch(() => {});   // 상세를 누르기 전에 미리 받아 둔다
    track('menu', { from: document.body.dataset.dsScreen });
  }

  /* 자유 이용 사진(CC BY · BY-SA)은 작성자 · 라이선스 · 고친 점을 밝혀야 쓸 수 있다.
     상세 화면마다 붙이지 않고 메뉴판 맨 아래에 접어서 한곳에 모아 둔다. */
  function creditsHtml() {
    const rows = Object.keys(MENU_INDEX).filter((id) => { const d = detailOf(id); return d && d.photo && d.photoCredit; });
    if (!rows.length) return '';
    return '<details class="ds-credits"><summary>' + esc(t('photoCredits')) + '</summary><ul>' + rows.map((id) => {
      const c = detailOf(id).photoCredit;
      const who = esc([c.author, c.license].filter(Boolean).join(' · '));
      return '<li>' + esc(MENU_INDEX[id].item[lang]) + ' — ' +
        (c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + who + '</a>' : who) +
        ' (' + esc(t(c.gray ? 'photoEditedGray' : 'photoEdited')) + ')</li>';
    }).join('') + '</ul></details>';
  }

  /* '이 술에 대해 알아보기' 원문은 stories.js 에 따로 있다 — 첫 화면 용량에 넣지 않고 메뉴판을 열 때 받아 둔다 */
  let storiesLoading = null;
  function ensureStories() {
    if (window.DS_STORIES) return Promise.resolve();
    if (!storiesLoading) {
      storiesLoading = new Promise((res, rej) => {
        const sc = document.createElement('script');
        sc.src = 'stories.js?v=' + VERSION;
        sc.onload = () => res();
        sc.onerror = () => { storiesLoading = null; sc.remove(); rej(new Error('stories.js')); };
        document.head.appendChild(sc);
      });
    }
    return storiesLoading;
  }
  function storyHtml(st) {
    const labels = t('layerLabels');
    let h = '<h3 class="ds-story-h">' + esc(t('storyHistory')) + '</h3><p class="ds-story-p">' + esc(st.history[lang]) + '</p>';
    h += '<h3 class="ds-story-h">' + esc(t('storyLayers')) + '</h3><ol class="ds-layers">';
    st.layers.forEach((l, i) => { h += '<li><b>' + esc(labels[i] || '') + '</b><span>' + esc(l[lang]) + '</span></li>'; });
    h += '</ol>';
    if (st.serve) h += '<h3 class="ds-story-h">' + esc(t('storyServe')) + '</h3><p class="ds-story-p">' + esc(st.serve[lang]) + '</p>';
    return h;
  }
  function toggleStory(btn) {
    const box = btn.nextElementSibling;
    if (!box) return;
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    box.hidden = !open;
    if (!open) return;
    const id = btn.getAttribute('data-id');
    track('item', { id, more: true });
    if (box.dataset.ready) return;
    box.innerHTML = '<p class="ds-note">' + esc(t('loading')) + '</p>';
    ensureStories().then(() => {
      const st = (window.DS_STORIES || {})[id];
      box.innerHTML = st ? storyHtml(st) : '<p class="ds-note">' + esc(t('storyError')) + '</p>';
      if (st) box.dataset.ready = '1';
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(() => { box.innerHTML = '<p class="ds-note">' + esc(t('storyError')) + '</p>'; });
  }

  /* 항목 상세 (메뉴판에서 한 줄을 누르면) */
  const krw = (s) => s + t('won');
  function noteList(rows) {
    let h = '';
    rows.forEach(([label, v]) => { if (v) h += '<dt>' + esc(label) + '</dt><dd>' + esc(v) + '</dd>'; });
    return h ? '<dl class="ds-notes">' + h + '</dl>' : '';   // 음료처럼 적을 게 없으면 빈 상자를 그리지 않는다
  }
  function itemHtml(id) {
    if (id.indexOf('sig:') === 0) {
      const k = id.slice(4), drink = SIGNATURE_DRINKS[k], d = DATA.drinks[k];
      if (!drink || !d) return null;
      return '<div class="ds-item">' +
        '<div class="ds-photo ds-photo-ink"><img src="' + esc(drink.image) + '" alt=""></div>' +
        '<p class="ds-kicker">' + esc(t('menuSeven')) + (k === currentSin ? ' · ' + esc(t('yourSin')) : '') + '</p>' +
        '<h2 class="ds-item-en">' + esc(drink.en) + '</h2>' +
        '<p class="ds-item-ko">' + esc(lang === 'en' ? I18N.en.drinkName[k] : DRINK_KO[k]) + '</p>' +
        (d.style ? '<ul class="ds-chips"><li>' + esc(d.style[lang]) + '</li></ul>' : '') +
        (d.desc ? '<p class="ds-about">' + esc(d.desc[lang]) + '</p>' : '') +
        (d.line && d.line.confirmed ? '<p class="' + (d.desc ? 'ds-quote' : 'ds-about') + '">' + esc(d.line[lang]) + '</p>' : '') +
        noteList([[t('aroma'), d.aroma[lang]], [t('taste'), d.taste[lang]], [t('finish'), d.finish[lang]], [t('strength'), d.strength[lang]]]) +
        '<div class="ds-prices"><div><span>' + esc(t('glass')) + '</span><b>' + esc(priceOf()) + '</b></div></div>' +
      '</div>';
    }
    const ref = MENU_INDEX[id], d = detailOf(id);
    if (!ref || !d) return null;
    const it = ref.item, L = (o) => (o ? o[lang] : '');
    const chips = [L(d.kind), L(d.region), d.abv || L(d.abvNote)].filter(Boolean);
    let kicker = '';
    if (ref.sinKey) kicker = L(ref.group) + ' · ' + SINS.find((s) => s.k === ref.sinKey).name;
    else if (ref.title) kicker = ref.title + ' · ' + L(ref.group);
    else kicker = t(ref.kind === 'cocktails' ? 'menuCocktails' : ref.kind === 'bites' ? 'menuBites' : 'menuBeverages');
    let prices = '';
    if (it.g) prices += '<div><span>' + esc(t('glass')) + '</span><b>' + esc(krw(it.g)) + '</b></div>';
    if (it.b) prices += '<div><span>' + esc(t('bottle')) + '</span><b>' + esc(krw(it.b)) + '</b></div>';
    if (it.p) prices += '<div><span>' + esc(t('price')) + '</span><b>' + esc(krw(it.p)) + '</b></div>';
    return '<div class="ds-item">' +
      (d.photo ? '<div class="ds-photo' + (d.scene ? ' ds-photo-scene' : '') + '"><img src="' + esc(d.photo) + '" alt=""></div>' : '') +
      '<p class="ds-kicker">' + esc(kicker) + (ref.sinKey && ref.sinKey === currentSin ? ' · ' + esc(t('yourSin')) : '') + '</p>' +
      '<h2 class="ds-item-en">' + esc(it.en) + '</h2>' +
      (lang === 'ko' ? '<p class="ds-item-ko">' + esc(it.ko) + '</p>' : '') +
      (chips.length ? '<ul class="ds-chips">' + chips.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul>' : '') +
      '<p class="ds-about">' + esc(L(d.about)) + '</p>' +
      noteList([[t('plate'), L(d.plate)], [t('recipe'), L(d.recipe)], [t('cask'), L(d.cask)], [t('nose'), L(d.nose)], [t('palate'), L(d.palate)], [t('finish'), L(d.finish)]]) +
      (prices ? '<div class="ds-prices">' + prices + '</div>' : '') +
      (ref.kind === 'whisky' || ref.kind === 'cocktails'
        ? '<button type="button" class="ds-more" data-ds="more" data-id="' + esc(id) + '" aria-expanded="false">' +
            esc(t('learnMore')) + '<i aria-hidden="true">↓</i></button><div class="ds-story" hidden></div>'
        : '') +
      (ref.kind === 'whisky' ? '<p class="ds-note">' + esc(t('detailNote')) + '</p>' : '') +   // 병 · 배치 이야기라 위스키에만
    '</div>';
  }
  function openItem(id) {
    const html = itemHtml(id);
    if (!html) return;
    openOverlay(layer('dsItem', html));
    track('item', { id });
  }

  /* -----------------------------------------------------------
     8. 결과 이미지 (인스타 스토리 1080×1920)
     ----------------------------------------------------------- */
  function loadImg(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }
  // 원본 그림은 흰 바탕에 검은 잉크. 화면처럼 반전해서 검은 바탕 흰 잉크로 만든다.
  // (ctx.filter 는 구형 사파리에서 안 먹어서 픽셀을 직접 뒤집는다)
  function inverted(img) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < d.data.length; i += 4) {
      d.data[i] = 255 - d.data[i]; d.data[i + 1] = 255 - d.data[i + 1]; d.data[i + 2] = 255 - d.data[i + 2];
    }
    x.putImageData(d, 0, 0);
    return c;
  }
  function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/), lines = [];
    let cur = '';
    words.forEach((w) => {
      const test = cur ? cur + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  async function makeShareImage(k) {
    const W = 1080, H = 1920;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

    const serif = 'Georgia, "Times New Roman", serif';
    const sans = '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';

    const mark = document.querySelector('.wordmark-img');
    if (mark) {
      const wm = await loadImg(mark.src);
      const ww = 460, wh = ww * wm.naturalHeight / wm.naturalWidth;
      ctx.drawImage(wm, (W - ww) / 2, 150, ww, wh);
    }
    ctx.fillStyle = 'rgba(247,245,243,.62)';
    ctx.font = '600 34px ' + serif;
    ctx.fillText('Y O U R   D E A D L Y   S I N', W / 2, 330);

    const art = await loadImg(SIGNATURE_DRINKS[k].image);
    const ah = 900, aw = ah * art.naturalWidth / art.naturalHeight;
    ctx.drawImage(inverted(art), (W - aw) / 2, 380, aw, ah);

    ctx.fillStyle = '#f7f5f3';
    ctx.font = '700 132px ' + serif;
    ctx.fillText(SIGNATURE_DRINKS[k].en, W / 2, 1420);
    ctx.font = '800 66px ' + sans;
    ctx.fillText(lang === 'en' ? I18N.en.drinkName[k] : DRINK_KO[k], W / 2, 1512);

    // 화면에 보인 연애 성향 문구 그대로 (1·2위가 가까우면 조합 문구가 나오므로 DOM 에서 읽는다)
    const shown = document.querySelector('#signatureTrait .trait-copy');
    const trait = (shown && shown.textContent.trim()) || (RESULT_TRAITS[k] || {}).love;
    if (trait) {
      ctx.fillStyle = 'rgba(247,245,243,.78)';
      ctx.font = '500 38px ' + sans;
      wrap(ctx, trait, 860).slice(0, 3).forEach((line, i) => ctx.fillText(line, W / 2, 1610 + i * 56));
    }
    ctx.fillStyle = '#c84a50';
    ctx.font = '700 30px ' + serif;
    ctx.fillText('D E A D L Y   S I N S', W / 2, 1830);

    return new Promise((res) => c.toBlob(res, 'image/png'));
  }

  let sharing = false;
  async function shareResult() {
    const k = currentSin; if (!k || sharing) return;
    sharing = true;
    const btn = extra.querySelector('[data-ds="share"]');
    const label = btn ? btn.textContent : '';
    if (btn) btn.textContent = t('making');
    try {
      const blob = await makeShareImage(k);
      const file = new File([blob], 'deadly-sins-' + SIGNATURE_DRINKS[k].en.toLowerCase() + '.png', { type: 'image/png' });
      const text = t('shareText')(SIGNATURE_DRINKS[k].en, lang === 'en' ? I18N.en.drinkName[k] : DRINK_KO[k]);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('shareTitle'), text }).catch(() => {});
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = file.name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        if (btn) btn.textContent = t('saved');
        await new Promise((r) => setTimeout(r, 1400));
      }
      track('share', { sin: KO[k] });
    } catch (e) {
      track('error', { message: 'share: ' + String(e && e.message || e).slice(0, 200) });
    } finally {
      if (btn) btn.textContent = label;
      sharing = false;
    }
  }
  window.DS_makeShareImage = makeShareImage;   // 자동 테스트용

  /* -----------------------------------------------------------
     9. 다시 하기
     ----------------------------------------------------------- */
  function restart() {
    closeAllOverlays();
    try { stopSignatureDrop(); } catch (e) {}
    cancelAdvance();
    if (revealHost) revealHost.classList.remove('visible');
    index = 0;
    answers = Array(N).fill(null);
    currentSin = null;
    unwindHistory();
    const start = el('start'); if (start) start.disabled = false;
    show('cover');
    track('restart');
  }

  /* -----------------------------------------------------------
     10. 버튼 연결 + 표지 상단 (메뉴 / 언어)
     ----------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const b = e.target instanceof Element && e.target.closest('[data-ds]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const a = b.getAttribute('data-ds');
    if (a === 'order') openOrder();
    else if (a === 'menu') openMenu();
    else if (a === 'item') openItem(b.getAttribute('data-id'));
    else if (a === 'more') toggleStory(b);
    else if (a === 'share') shareResult();
    else if (a === 'restart') restart();
    else if (a === 'close') { if (depth > 0) history.back(); else closeTopOverlay(); }
    else if (a === 'lang') {
      lang = lang === 'ko' ? 'en' : 'ko';
      try { localStorage.setItem('ds_lang', lang); } catch (err) {}
      applyLang();
      track('lang', { to: lang });
    }
  });

  const top = document.createElement('div');
  top.className = 'ds-top';
  top.innerHTML =
    '<button type="button" class="ds-pill" id="dsMenuBtn" data-ds="menu">MENU</button>' +
    '<button type="button" class="ds-pill" id="dsLang" data-ds="lang" aria-label="Language"></button>';
  document.body.appendChild(top);   // #cover 안에 두면 누를 때 표지 전환까지 같이 시작된다

  applyLang();

  // 주소 끝이 #menu 면 메뉴를, #menu/<id> 면 그 항목까지 바로 연다 (메뉴판 전용 QR · 링크 공유용)
  function openFromHash() {
    const m = /^#menu(?:\/([\w:%-]+))?$/.exec(location.hash || '');
    if (!m) return;
    history.replaceState(history.state, '', location.pathname + location.search);
    if (!document.getElementById('dsMenu')) openMenu();
    let id = '';
    try { id = decodeURIComponent(m[1] || ''); } catch (e) { /* 깨진 주소면 메뉴판만 */ }
    if (id && canOpen(id)) openItem(id);   // #menu/sig:교 처럼 한글이 들어가면 %EA… 로 인코딩돼 온다
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
  window.DS_ENHANCE = { version: VERSION, collect: COLLECT_ON, calculate: () => calculate() };
})();
