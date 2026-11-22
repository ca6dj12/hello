/* =============================================================
   DEADLY SINS — 개선 레이어
   원본 HTML 의 스크립트 뒤에 실행되어, 원본 함수를 감싸서 기능을 더합니다.
   원본 파일은 손대지 않으므로 디자이너가 새 버전을 보내도 다시 끼워 넣기만 하면 됩니다.

   하는 일
     · 설문 문항을 quiz.js (v2) 것으로 바꿔 끼우기      → 선택지 하나 = 죄 하나 = 1점
     · 보기 순서를 매 세션 섞기 (Fisher–Yates)          → 위치 습관이 결과를 끌지 않게
     · 동점 처리: 최근 손님 100명 중 덜 나온 죄 우선 (서버가 순서를 알려 줌, 못 받으면 세션별 무작위)
     · 결과 제목과 시그니처 술이 늘 같은 죄를 가리키게
     · 폰 뒤로가기 = 앱 안의 뒤로가기
     · 다시 하기 / 맛·향·강도·가격 / 바텐더용 주문 화면 / 전체 메뉴 / 결과 이미지 공유
     · 한국어 ⇄ English
     · 결과·오류 익명 기록 → /api/track → Neon (data.js 의 collect.enabled 로 끄고 켬)
   ============================================================= */
(function () {
  'use strict';

  if (typeof QUESTIONS === 'undefined' || typeof SINS === 'undefined' || !window.DS_DATA || !window.DS_I18N || !window.DS_QUIZ) {
    console.warn('[deadly-sins] 원본 스크립트나 데이터 파일을 찾지 못해 개선 레이어를 건너뜁니다.');
    return;
  }

  const VERSION = '2026-11-22a';
  const DATA = window.DS_DATA;
  const I18N = window.DS_I18N;
  const QUIZ = window.DS_QUIZ;
  const el = (id) => document.getElementById(id);

  /* -----------------------------------------------------------
     설문 문항: 원본에 박힌 문항(v1) 대신 quiz.js 의 문항을 쓴다.
     원본 채점 코드가 그대로 돌도록 같은 모양으로 넣는다 — 선택지 하나가 죄 하나에 "3" (= 1점. 미터 · 레이더 눈금이 3 단위).
     quiz.js 가 잘못돼 있으면 개선 레이어 전체를 건너뛴다 (원본 그대로 동작, 기록 안 함).
     ----------------------------------------------------------- */
  const SIN_KEYS = SINS.map((s) => s.k);
  const quizOk = Array.isArray(QUIZ.questions) && QUIZ.questions.length === QUESTIONS.length && /^v\d{1,3}$/.test(QUIZ.version || '') &&
    QUIZ.questions.every((q) => q && q.q && q.q.ko && Array.isArray(q.a) && q.a.length === 4 &&
      new Set(q.a.map((o) => o && o.sin)).size === 4 && q.a.every((o) => SIN_KEYS.includes(o.sin) && o.ko));
  if (!quizOk) {
    console.warn('[deadly-sins] quiz.js 의 문항 형식이 맞지 않아 개선 레이어를 건너뜁니다.');
    return;
  }
  QUESTIONS.length = 0;
  QUIZ.questions.forEach((q) => {
    QUESTIONS.push({ q: q.q.ko, _t: q.q, a: q.a.map((o) => ({ text: o.ko, points: o.sin + '3', sin: o.sin, _t: o })) });   // _t = { ko, en, zh }
  });
  const N = QUESTIONS.length;

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
  const AUTO = !!navigator.webdriver;   // 자동 조종되는 브라우저(배포 미리보기 봇 · 검사 도구) → 서버가 통계에 넣지 않는다

  function track(type, data) {
    if (!COLLECT_ON) return;
    try {
      const body = JSON.stringify(Object.assign({ sid: SID, type, lang, v: VERSION, quiz: QUIZ.version }, AUTO ? { auto: 1 } : null, data || {}));
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
  // 퀴즈 도중 화면을 떠나면(앱 전환 · 탭 닫기) 몇 번 문항이었는지 남긴다 — 어느 문항에서 그만두는지 보려고.
  // 돌아와서 끝까지 한 세션은 통계에서 빠진다(결과가 있는 세션은 제외).
  let lastQuit = '';
  function noteQuit() {
    if (document.body.dataset.dsScreen !== 'quiz') return;
    const key = SID + ':' + index;
    if (key === lastQuit) return;
    lastQuit = key;
    track('quit', { q: index + 1, answered: answers.filter((a) => a !== null).length });
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') noteQuit(); });
  window.addEventListener('pagehide', noteQuit);
  window.addEventListener('unhandledrejection', (e) => {
    if (errorBudget-- <= 0) return;
    track('error', { message: String((e.reason && e.reason.message) || e.reason).slice(0, 300), ua: navigator.userAgent.slice(0, 200) });
  });

  /* -----------------------------------------------------------
     1. 언어
     ----------------------------------------------------------- */
  // 한국어 · English · 中文(간체) · 日本語. 폰 언어로 시작하고, 손님이 고르면 그걸 기억한다.
  const LANGS = ['ko', 'en', 'zh', 'ja'].filter((l) => I18N[l] && I18N[l].ui);
  const LANG_LABEL = { ko: '한국어', en: 'EN', zh: '中文', ja: '日本語' };
  const HTML_LANG = { ko: 'ko', en: 'en', zh: 'zh-Hans', ja: 'ja' };
  let lang = (function () {
    try { const v = localStorage.getItem('ds_lang'); if (LANGS.includes(v)) return v; } catch (e) {}
    const n = navigator.language || 'ko';
    const two = n.slice(0, 2).toLowerCase();
    return two === 'ko' ? 'ko' : (two === 'zh' || two === 'ja') && LANGS.includes(two) ? two : 'en';
  })();
  // 화면 문구. 한국어가 아닌 언어는 그 언어 → 영어 → 한국어 순으로 찾는다 (빠진 문구가 있어도 빈칸이 안 되게)
  const t = (key) => {
    const own = I18N[lang].ui[key];
    const v = own !== undefined ? own : (lang !== 'ko' && I18N.en.ui[key] !== undefined ? I18N.en.ui[key] : I18N.ko.ui[key]);
    return v === undefined ? key : v;
  };
  // i18n.js 의 묶음(sins · drinkName · traits · aria · reactions): 지금 언어 것, 없으면 영어 것
  const pack = (name) => (I18N[lang] && I18N[lang][name]) || I18N.en[name] || {};
  // data.js · stories.js · quiz.js 의 { ko, en, zh } 에서 지금 언어의 글. 없으면 영어 → 한국어 (새로 넣은 메뉴 · 병 이름처럼 번역이 없는 것)
  const tx = (o) => (o ? (o[lang] || o.en || o.ko || '') : '');

  // 문구를 한 번 떠 두고, 언어를 바꿀 때마다 둘 중 하나로 덮어쓴다 (_id = quiz.js 에 적힌 순서)
  QUESTIONS.forEach((q, i) => {
    q._ko = q.q;
    q.a.forEach((o, j) => { o._id = i + '-' + j; o._ko = o.text; });
  });
  const SIN_KO = SINS.map((s) => s.name);
  const KO = {};
  SINS.forEach((s, i) => { KO[s.k] = SIN_KO[i]; });
  const REACTIONS_KO = REACTIONS.slice();
  const TRAITS_KO = JSON.parse(JSON.stringify(RESULT_TRAITS));
  const DRINK_KO = {};
  const drinkLocal = (k) => (lang === 'ko' ? DRINK_KO[k] : pack('drinkName')[k] || I18N.en.drinkName[k]);   // 술 이름: 교만의 술 · The Drink of Pride · 傲慢之酒
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

  // 화면낭독기가 읽는 이름표(aria-label · alt). 원본에는 한국어로만 적혀 있어서 영어일 때 바꿔 준다 (문구는 i18n.js 의 en.aria)
  const ARIA = [
    ['#cover', 'aria-label', 'cover'], ['#cover .cover-art', 'alt', 'coverArt'],
    ['#quiz', 'aria-label', 'quiz'], ['#progress', 'aria-label', 'progress'], ['#choices', 'aria-label', 'choices'],
    ['#results', 'aria-label', 'results'], ['#radarSvg', 'aria-label', 'radar'],
    ['#signature', 'aria-label', 'signature'], ['#signatureBack', 'aria-label', 'back']
  ].map(([sel, attr, key]) => {
    const node = document.querySelector(sel);
    return node && (I18N.en.aria || {})[key] ? { node, attr, key, ko: node.getAttribute(attr) } : null;
  }).filter(Boolean);
  function artAlt() {          // 시그니처 그림의 설명 (원본은 "PRIDE 상징과 술잔")
    const art = el('signatureArt');
    if (art && currentSin && SIGNATURE_DRINKS[currentSin]) art.alt = SIGNATURE_DRINKS[currentSin].en + (lang !== 'ko' ? pack('aria').art || '' : ' 상징과 술잔');
  }

  const TITLE_KO = document.title;
  function applyLang() {
    document.documentElement.lang = HTML_LANG[lang];
    document.title = lang !== 'ko' ? t('docTitle') || TITLE_KO : TITLE_KO;   // 브라우저 탭 · 방문 기록에 뜨는 제목
    ARIA.forEach(({ node, attr, key, ko }) => { node.setAttribute(attr, lang !== 'ko' ? pack('aria')[key] || I18N.en.aria[key] : ko); });
    artAlt();
    QUESTIONS.forEach((q) => {
      q.q = lang === 'ko' ? q._ko : tx(q._t) || q._ko;
      q.a.forEach((o) => { o.text = lang === 'ko' ? o._ko : tx(o._t) || o._ko; });
    });
    // 화면에 보이는 죄 이름. 한국어는 i18n.js 의 ko.sins 에 적힌 것만 바꿔 보인다 (기록 · 통계에 쓰는 이름 KO 는 원본 그대로)
    SINS.forEach((s, i) => { s.name = lang !== 'ko' ? pack('sins')[s.k] : (I18N.ko.sins && I18N.ko.sins[s.k]) || SIN_KO[i]; });
    Object.keys(RESULT_TRAITS).forEach((k) => {
      RESULT_TRAITS[k] = lang !== 'ko' ? pack('traits')[k] || I18N.en.traits[k] : TRAITS_KO[k];
    });
    Object.keys(SIGNATURE_DRINKS).forEach((k) => {
      SIGNATURE_DRINKS[k].kr = drinkLocal(k);
    });
    REACTIONS.forEach((_, i) => { REACTIONS[i] = (lang !== 'ko' && (pack('reactions')[i] || I18N.en.reactions[i])) || REACTIONS_KO[i]; });
    STATIC.forEach(({ node, key, html, ko }) => {
      const v = lang !== 'ko' ? t(key) : ko;
      if (html) node.innerHTML = v; else node.textContent = v;
    });
    document.querySelectorAll('#dsLang [data-lang]').forEach((b) => {
      const on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
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
  /* 동점 순서: 7문항으로 일곱 죄를 가리면 손님 셋 중 하나쯤은 1위가 동점이다. 그때 누구를 줄지의 순서.
     서버(api/track?order=1)가 "최근 손님 100명 중 덜 나온 죄 먼저" 순서를 알려 준다 → 결과가 스스로 고르게 나뉜다.
     동점만 가르므로, 손님이 더 많이 고른 죄를 제치고 다른 죄가 나오는 일은 없다.
     못 받으면(오프라인 · 기록 끔) 세션마다 무작위. 결과를 한 번 보여 준 뒤에는 그 세션 동안 순서를 바꾸지 않는다
     (결과 화면 · 시그니처 · 공유 이미지가 늘 같은 죄를 가리키게). */
  let tieOrder = shuffle(SIN_KEYS.slice()), tieBy = 'random', tieFrozen = false, tieSeq = 0;
  function fetchTieOrder() {
    if (!COLLECT_ON || typeof fetch !== 'function') return;
    const seq = ++tieSeq;
    fetch(ENDPOINT + '?order=1&quiz=' + encodeURIComponent(QUIZ.version), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (seq !== tieSeq || tieFrozen || !j || !Array.isArray(j.order)) return;
        if (j.order.length === SIN_KEYS.length && SIN_KEYS.every((k) => j.order.includes(k))) { tieOrder = j.order.slice(); tieBy = 'recent'; }
      })
      .catch(() => { /* 못 받으면 무작위 순서 그대로 */ });
  }
  const isFresh = () => answers.every((a) => a === null);
  function newSession() {
    QUESTIONS.forEach((q) => shuffle(q.a));
    tieOrder = shuffle(SIN_KEYS.slice()); tieBy = 'random'; tieFrozen = false;
    SID = newSid();
    fetchTieOrder();
  }

  // 원본 calculate 를 대체. 같은 모양({...sin, points})으로 돌려준다. points 는 고른 횟수 × 3.
  calculate = function () {
    const pts = {};
    SINS.forEach((s) => { pts[s.k] = 0; });
    QUESTIONS.forEach((q, i) => {
      const o = q.a[answers[i]];
      if (o) pts[o.sin] += 3;
    });
    return SINS.map((s) => Object.assign({}, s, { points: pts[s.k] }))
      .sort((a, b) => b.points - a.points || tieOrder.indexOf(a.k) - tieOrder.indexOf(b.k));
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
    // 답 고르기 (끝에서 두 번째 문항을 답할 때 동점 순서를 한 번 더 받아 둔다 — 그사이 다른 손님 결과가 반영되게)
    const choice = target.closest('#choices .choice');
    if (choice && !advancing) { push('q'); if (index === N - 2 && !tieFrozen) fetchTieOrder(); return; }
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
    tieFrozen = true;
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
      tieBy: ranked[0].points === ranked[1].points ? tieBy : undefined,   // 동점을 무엇으로 갈랐나: recent(서버 순서) · random
      points: ranked.map((s) => KO[s.k] + ' ' + s.points / 3).join(' · '),   // 죄별로 고른 횟수
      // 문항마다 고른 선택지의 죄: "Q1분 Q2교 …" (선택지 = 죄 하나라서 이것으로 선택지가 정해진다)
      picks: QUESTIONS.map((q, i) => {
        const o = q.a[answers[i]]; if (!o) return '';
        return 'Q' + (i + 1) + o.sin;
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
  // 칵테일 이름 바로 아래 공유 버튼 — 스크롤하지 않아도 보이게
  const shareTop = document.createElement('button');
  shareTop.type = 'button'; shareTop.className = 'ds-share-top'; shareTop.setAttribute('data-ds', 'share');
  if (revealHost) revealHost.insertBefore(shareTop, el('signatureTrait'));
  const SHARE_ICON = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 3v12"/><path d="M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';

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
      if (d.line && d.line.confirmed) html += '<p class="ds-line">' + esc(tx(d.line)) + '</p>';
      html += '<dl>';
      html += '<dt>' + esc(t('aroma')) + '</dt><dd>' + esc(tx(d.aroma)) + '</dd>';
      html += '<dt>' + esc(t('taste')) + '</dt><dd>' + esc(tx(d.taste)) + '</dd>';
      html += '<dt>' + esc(t('finish')) + '</dt><dd>' + esc(tx(d.finish)) + '</dd>';
      html += '<dt>' + esc(t('strength')) + '</dt><dd>' + esc(tx(d.strength)) + ' ' + pips(d.level) + '</dd>';
      html += '<dt>' + esc(t('price')) + '</dt><dd class="ds-price">' + esc(priceOf()) + '</dd>';
      html += '</dl></div>';
    }
    if (pair) {
      html += '<div class="ds-card ds-pair">';
      html += '<p class="ds-card-head">' + esc(t('pairHead')) + ' <span>' + esc(tx(pair.label)) + '</span></p>';
      pair.items.filter(shown).forEach((it) => { html += menuRow(tx(it), it.g ? t('glass') + ' ' + it.g : '', '', it.id); });
      html += '</div>';
    }
    if ((SIG_FLAGS[k] || {}).soldOut) html += '<p class="ds-soldout-note">' + esc(t('sigSoldOut')) + '</p>';
    html += '<button type="button" class="cta ds-order-btn" data-ds="order">' + esc(t('order')) + '</button>';
    html += '<div class="ds-actions">';
    html += '<button type="button" data-ds="share">' + esc(t('share')) + '</button>';
    html += '<button type="button" data-ds="menu">' + esc(t('fullMenu')) + '</button>';
    html += '<button type="button" data-ds="restart">' + esc(t('restart')) + '</button>';
    html += '</div>';
    extra.innerHTML = html;
    settleImages(extra);
    shareTop.innerHTML = SHARE_ICON + '<span>' + esc(t('share')) + '</span>';
  }

  const originalRenderTrait = renderSignatureTrait;
  renderSignatureTrait = function (ranked) {
    originalRenderTrait.apply(this, arguments);
    currentSin = ranked[0].k;
    artAlt();
    if (lang !== 'ko') {
      const host = el('signatureTrait');
      const labels = host.querySelectorAll('.trait-label');
      ['love', 'work', 'sex'].forEach((key, i) => { if (labels[i]) labels[i].textContent = t(key); });
      const age = host.querySelector('.sex-age-warning'); if (age) age.textContent = t('ageWarn');
      const lock = host.querySelector('.sex-lock-main'); if (lock) lock.textContent = t('lockMain');
      const secret = host.querySelector('.sex-secret'); if (secret) secret.setAttribute('aria-label', t('lockMain'));
    }
    renderExtra(currentSin);
    prepareShare(currentSin);
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
    settleImages(node);
    if (node.id === 'dsMenu') revealOnScroll(node);
    push('overlay');
  }
  function closeTopOverlay() {
    const node = overlays.pop();
    if (!node) return false;
    node.classList.remove('open');
    setTimeout(() => node.remove(), 280);   // 닫히는 움직임(.26s)이 끝난 뒤
    if (wakeLock && !overlays.some((o) => o.id === 'dsOrder')) { wakeLock.release().catch(() => {}); wakeLock = null; }
    return true;
  }
  function closeAllOverlays() { while (overlays.length) closeTopOverlay(); }

  /* ---------- 부드러운 움직임 (움직임 줄이기 설정이면 전부 끔) ---------- */
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // 사진은 다 받아진 뒤에 부드럽게 나타나게
  function settleImages(root) {
    if (REDUCED) return;
    root.querySelectorAll('.ds-photo img, img.ds-thumb').forEach((img) => {
      img.classList.add('ds-fade');
      const done = () => requestAnimationFrame(() => img.classList.add('ds-ready'));
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    });
  }
  // 메뉴판: 화면에 들어오는 줄부터 차례로 떠오름
  function revealOnScroll(root) {
    if (REDUCED || typeof IntersectionObserver === 'undefined') return;
    const els = root.querySelectorAll('.ds-menu > h2, .ds-tap-hint, .ds-menu h3, .ds-menu section > .ds-note, .ds-sig, .ds-group, .ds-menu section > .ds-row, .ds-info, .ds-credits');
    const io = new IntersectionObserver((entries) => {
      let k = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--d', Math.min(k++, 10) * 45 + 'ms');
        e.target.classList.add('ds-in');
        io.unobserve(e.target);
      });
    }, { root, threshold: 0.01 });
    els.forEach((el) => { el.classList.add('ds-reveal'); io.observe(el); });
  }
  // 누른 자리에서 번지는 잔물결
  const RIPPLE = '.choice, button.ds-row, .ds-share-top, .ds-more, .ds-actions button, .ds-share-copy';
  if (!REDUCED) {
    document.addEventListener('pointerdown', (e) => {
      const b = e.target.closest && e.target.closest(RIPPLE);
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty('--rx', (e.clientX - r.left) + 'px');
      b.style.setProperty('--ry', (e.clientY - r.top) + 'px');
      b.classList.remove('ds-ripple'); void b.offsetWidth; b.classList.add('ds-ripple');
      clearTimeout(b.dsRipple); b.dsRipple = setTimeout(() => b.classList.remove('ds-ripple'), 700);
    }, { passive: true });
  }
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
        '<p class="ds-order-ko">' + esc(DRINK_KO[k]) + (lang !== 'ko' ? '<br><span>' + esc(drinkLocal(k)) + '</span>' : '') + '</p>' +
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
  function indexMenu() {
    Object.keys(MENU_INDEX).forEach((k) => { delete MENU_INDEX[k]; });
    const m = DATA.menu;
    m.whisky.forEach((w) => w.items.forEach((it) => { if (it.id) MENU_INDEX[it.id] = { item: it, group: w.label, sinKey: w.sin, kind: 'whisky' }; }));
    m.final.items.forEach((it) => { if (it.id) MENU_INDEX[it.id] = { item: it, group: m.final.label, title: m.final.title, kind: 'whisky' }; });
    ['cocktails', 'bites', 'beverages'].forEach((sec) => (m[sec] || []).forEach((it) => { if (it.id) MENU_INDEX[it.id] = { item: it, kind: sec }; }));
  }
  indexMenu();
  const detailOf = (id) => (DATA.details || {})[id] || null;
  const canOpen = (id) => !!id && (id.indexOf('sig:') === 0 || !!detailOf(id));

  /* 사장님이 /admin 에서 고친 것(품절 · 가격 · 숨김 · NEW · 새 메뉴)을 data.js 위에 덮는다.
     첫 화면을 막지 않게 따로 받아 두고, 메뉴판을 열 때는 1.5초까지만 기다린다. 못 받으면 data.js 그대로. */
  const SIG_FLAGS = {};   // 시그니처 일곱 잔의 품절 · NEW: { 교: { soldOut, new } }
  const LIVE_KEYS = ['g', 'b', 'p', 'soldOut', 'hidden', 'new'];
  function applyLive(live) {
    const d = live && live.data;
    if (!d || typeof d !== 'object') return;
    const m = DATA.menu;
    if (Number.isInteger(d.signaturePrice) && d.signaturePrice > 0) DATA.signaturePrice = d.signaturePrice;
    const items = d.items || {};
    const all = [].concat(...m.whisky.map((w) => w.items), m.final.items, m.cocktails, m.bites, m.beverages);
    all.forEach((it) => {
      const o = it.id && items[it.id];
      if (o) LIVE_KEYS.forEach((k) => { if (o[k] !== undefined) it[k] = o[k]; });
    });
    Object.keys(items).forEach((id) => { if (id.indexOf('sig:') === 0) SIG_FLAGS[id.slice(4)] = items[id]; });
    DATA.details = DATA.details || {};
    (Array.isArray(d.extra) ? d.extra : []).forEach((x) => {
      const sec = String(x.section || '');
      const list = sec === 'final' ? m.final.items
        : sec.indexOf('whisky:') === 0 ? (m.whisky.find((w) => w.sin === sec.slice(7)) || {}).items
        : ['cocktails', 'bites', 'beverages'].includes(sec) ? m[sec] : null;
      if (!Array.isArray(list) || !x.id || list.some((it) => it.id === x.id)) return;
      list.push({ id: x.id, ko: x.ko || x.en, en: x.en || x.ko, g: x.g, b: x.b, p: x.p,
        soldOut: x.soldOut, hidden: x.hidden, new: x.new, added: true });
      if (x.about) DATA.details[x.id] = { kind: null, region: null, abv: null, about: x.about, photo: null, photoCredit: null };
    });
    indexMenu();
  }
  let liveDone = false;
  const liveMenu = (typeof fetch === 'function' ? fetch('api/menu').then((r) => (r.ok ? r.json() : null)) : Promise.resolve(null))
    .then(applyLive).catch(() => {}).then(() => { liveDone = true; });
  const waitLive = () => (liveDone ? Promise.resolve() : Promise.race([liveMenu, new Promise((r) => setTimeout(r, 1500))]));
  const flagsOf = (id) => (!id ? {} : id.indexOf('sig:') === 0 ? SIG_FLAGS[id.slice(4)] || {} : (MENU_INDEX[id] || {}).item || {});
  const shown = (it) => !it.hidden;

  // 메뉴 한 줄. 설명이 있는 항목은 누를 수 있는 버튼으로. desc 는 이름 아래 한 줄 설명 (시그니처 잔).
  function menuRow(name, price, sub, id, desc) {
    const d = id && detailOf(id);
    // 시그니처 잔은 그 죄의 상징(마름모 · 별 · 원 …), 나머지는 병 · 접시 사진
    const sym = id && id.indexOf('sig:') === 0 && window.DS_SYMBOLS ? window.DS_SYMBOLS[id.slice(4)] : null;
    const thumb = sym ? '<img class="ds-sym" src="' + esc(sym) + '" alt="" loading="lazy">'
      : d && d.photo ? '<img class="ds-thumb' + (d.scene ? ' ds-thumb-scene' : '') + '" src="' + esc(d.photo) + '" alt="" loading="lazy">'
      : id ? '<span class="ds-thumb ds-thumb-empty" aria-hidden="true"></span>' : '';   // 사진 없는 새 메뉴도 줄이 맞게
    const f = flagsOf(id);
    const badge = f.new ? ' <span class="ds-new">NEW</span>' : '';   // data.js 의 "new": true 또는 /admin 의 NEW
    const inner = thumb + '<span class="ds-row-name">' + esc(name) + badge + (sub ? '<small>' + esc(sub) + '</small>' : '') +
      (desc ? '<small class="ds-row-desc">' + esc(desc) + '</small>' : '') + '</span>' +
      '<span class="ds-row-price">' + esc(f.soldOut ? t('soldOut') : price) + '</span>';
    const cls = 'ds-row' + (f.soldOut ? ' ds-soldout' : '');
    if (canOpen(id)) {
      return '<button type="button" class="' + cls + ' ds-tap" data-ds="item" data-id="' + esc(id) + '">' + inner + '<i class="ds-chev" aria-hidden="true">›</i></button>';
    }
    return '<p class="' + cls + '">' + inner + '</p>';
  }

  let menuOpening = false;
  async function openMenu() {
    if (menuOpening || document.getElementById('dsMenu')) return;
    menuOpening = true;
    try { await waitLive(); renderMenu(); } finally { menuOpening = false; }
  }
  function renderMenu() {
    const m = DATA.menu, mine = currentSin;
    let h = '<div class="ds-menu"><h2>MENU</h2><p class="ds-tap-hint">' + esc(t('tapHint')) + '</p>';

    h += '<section><h3>' + esc(t('menuSeven')) + '</h3><p class="ds-note">' + esc(t('menuSevenNote')(DATA.signaturePrice.toLocaleString('ko-KR'))) + '</p>';
    SINS.forEach((s) => {
      const d = DATA.drinks[s.k];
      const name = lang === 'en' ? SIGNATURE_DRINKS[s.k].en : SIGNATURE_DRINKS[s.k].en + ' · ' + drinkLocal(s.k);   // 영어는 "PRIDE · The Drink of Pride" 로 같은 말이 겹쳐서 이름만
      const sub = d ? (d.style ? tx(d.style) : tx(d.aroma)) : '';
      h += '<div class="ds-sig' + (s.k === mine ? ' mine' : '') + '">' + menuRow(name, priceOf(), sub, 'sig:' + s.k, d && d.desc ? tx(d.desc) : '') +
        (s.k === mine ? '<em>' + esc(t('yourSin')) + '</em>' : '') + '</div>';
    });
    h += '</section>';

    h += '<section><h3>' + esc(t('menuWhisky')) + '</h3><p class="ds-note">' + esc(tx(m.whiskyNote)) + ' · ' + esc(tx(m.whiskyHead)) + '</p>';
    const gb = (it) => [it.g && 'G ' + it.g, it.b && 'B ' + it.b].filter(Boolean).join(' · ');
    m.whisky.forEach((w) => {
      const items = w.items.filter(shown);
      if (!items.length) return;
      h += '<div class="ds-group' + (w.sin === mine ? ' mine' : '') + '"><p class="ds-group-head">' + esc(tx(w.label)) +
        ' <span>' + esc(SINS.find((s) => s.k === w.sin).name) + '</span>' + (w.sin === mine ? '<em>' + esc(t('yourSin')) + '</em>' : '') + '</p>';
      items.forEach((it) => { h += menuRow(tx(it), gb(it), '', it.id); });
      h += '</div>';
    });
    const finals = m.final.items.filter(shown);
    if (finals.length) {
      h += '<div class="ds-group"><p class="ds-group-head">' + esc(m.final.title) + ' <span>' + esc(tx(m.final.label)) + '</span></p>';
      finals.forEach((it) => { h += menuRow(tx(it), gb(it), '', it.id); });
      h += '</div>';
    }
    h += '</section>';

    const list = (key, all) => {
      const items = all.filter(shown);
      if (!items.length) return;
      h += '<section><h3>' + esc(t(key)) + '</h3>';
      items.forEach((it) => { h += menuRow(tx(it), it.p, lang === 'en' || tx(it) === it.en ? '' : it.en, it.id); });   // 보조 이름(영어)은 한국어 · 중국어 화면에서만
      h += '</section>';
    };
    list('menuCocktails', m.cocktails);
    list('menuBites', m.bites);
    list('menuBeverages', m.beverages);

    h += '<section><h3>' + esc(t('menuInfo')) + '</h3>';
    m.info.forEach((i) => { h += '<p class="ds-info">' + esc(tx(i)) + '</p>'; });
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
      return '<li>' + esc(tx(MENU_INDEX[id].item)) + ' — ' +
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
    let h = '<h3 class="ds-story-h">' + esc(t('storyHistory')) + '</h3><p class="ds-story-p">' + esc(tx(st.history)) + '</p>';
    h += '<h3 class="ds-story-h">' + esc(t('storyLayers')) + '</h3><ol class="ds-layers">';
    st.layers.forEach((l, i) => { h += '<li><b>' + esc(labels[i] || '') + '</b><span>' + esc(tx(l)) + '</span></li>'; });
    h += '</ol>';
    if (st.serve) h += '<h3 class="ds-story-h">' + esc(t('storyServe')) + '</h3><p class="ds-story-p">' + esc(tx(st.serve)) + '</p>';
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
        '<p class="ds-item-ko">' + esc(drinkLocal(k)) + '</p>' +
        (d.style ? '<ul class="ds-chips"><li>' + esc(tx(d.style)) + '</li></ul>' : '') +
        (d.desc ? '<p class="ds-about">' + esc(tx(d.desc)) + '</p>' : '') +
        (d.line && d.line.confirmed ? '<p class="' + (d.desc ? 'ds-quote' : 'ds-about') + '">' + esc(tx(d.line)) + '</p>' : '') +
        noteList([[t('aroma'), tx(d.aroma)], [t('taste'), tx(d.taste)], [t('finish'), tx(d.finish)], [t('strength'), tx(d.strength)]]) +
        ((SIG_FLAGS[k] || {}).soldOut ? '<p class="ds-soldout-note">' + esc(t('soldOutNote')) + '</p>' : '') +
        '<div class="ds-prices"><div><span>' + esc(t('glass')) + '</span><b>' + esc(priceOf()) + '</b></div></div>' +
      '</div>';
    }
    const ref = MENU_INDEX[id], d = detailOf(id);
    if (!ref || !d) return null;
    const it = ref.item, L = (o) => (o ? tx(o) : '');
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
      '<h2 class="ds-item-en">' + esc(it.en) + (it.new ? ' <span class="ds-new">NEW</span>' : '') + '</h2>' +
      (lang !== 'en' && tx(it) !== it.en ? '<p class="ds-item-ko">' + esc(tx(it)) + '</p>' : '') +
      (chips.length ? '<ul class="ds-chips">' + chips.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul>' : '') +
      '<p class="ds-about">' + esc(L(d.about)) + '</p>' +
      noteList([[t('plate'), L(d.plate)], [t('recipe'), L(d.recipe)], [t('cask'), L(d.cask)], [t('nose'), L(d.nose)], [t('palate'), L(d.palate)], [t('finish'), L(d.finish)]]) +
      (it.soldOut ? '<p class="ds-soldout-note">' + esc(t('soldOutNote')) + '</p>' : '') +
      (prices ? '<div class="ds-prices">' + prices + '</div>' : '') +
      ((ref.kind === 'whisky' || ref.kind === 'cocktails') && !it.added   // 사장님이 새로 넣은 메뉴는 '알아보기' 원문이 없다
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
    // 중국어 · 일본어는 띄어쓰기가 없어서 글자 단위로 끊는다 (쉼표 · 마침표 · 작은 가나가 줄 맨 앞에 오지 않게)
    const cjk = (lang === 'zh' || lang === 'ja') && /[\u3040-\u30ff\u3400-\u9fff]/.test(text), glue = cjk ? '' : ' ';
    const words = cjk ? Array.from(String(text)) : String(text).split(/\s+/), lines = [];
    let cur = '';
    words.forEach((w) => {
      const test = cur ? cur + glue + w : w;
      if (ctx.measureText(test).width > maxW && cur && !(cjk && /[，。！？；：、”’）》」』ーっゃゅょぁぃぅぇぉッャュョァィゥェォ…]/.test(w))) { lines.push(cur); cur = w; } else cur = test;
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
    const sans = lang === 'zh' ? '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif'
      : lang === 'ja' ? '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif'
      : '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
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
    ctx.fillText(drinkLocal(k), W / 2, 1512);

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

  /* 공유: 폰의 공유 창(인스타그램 · 카카오톡 · 사진에 저장 …)으로 결과 이미지를 보낸다.
     공유 창은 누른 직후에 열어야 해서(사파리는 시간이 지나면 막는다) 이미지는 시그니처가 뜰 때 미리 만들어 둔다.
     공유 창이 없는 곳(앱 안 브라우저 · PC)은 이미지를 띄워 길게 눌러 저장하게 한다. */
  const SITE_URL = location.origin + '/';
  let shareCache = null;   // { key, blob }
  function prepareShare(k) {
    const key = k + ':' + lang;
    if (shareCache && shareCache.key === key) return;
    shareCache = { key, blob: null };
    const job = shareCache;
    setTimeout(() => {   // 이름이 떠오르는 애니메이션이 끝난 뒤에
      makeShareImage(k).then((b) => { job.blob = b; }).catch(() => {});
    }, 1800);
  }
  let sharing = false, shareUrl = null;
  async function shareResult(btn) {
    const k = currentSin; if (!k || sharing) return;
    sharing = true;
    const label = btn ? btn.innerHTML : '';
    try {
      const key = k + ':' + lang;
      let blob = shareCache && shareCache.key === key ? shareCache.blob : null;
      if (!blob) {
        if (btn) { (btn.querySelector('span') || btn).textContent = t('making'); btn.setAttribute('aria-busy', 'true'); }
        blob = await makeShareImage(k);
        shareCache = { key, blob };
      }
      const name = 'deadly-sins-' + SIGNATURE_DRINKS[k].en.toLowerCase() + '.png';
      const file = new File([blob], name, { type: 'image/png' });
      const text = t('shareText')(SIGNATURE_DRINKS[k].en, drinkLocal(k)) +
        '\n' + t('shareInvite') + ' ' + SITE_URL;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: t('shareTitle'), text });
          track('share', { sin: KO[k], via: 'native' });
          return;
        } catch (e) {
          if (e && e.name === 'AbortError') return;   // 공유 창을 그냥 닫음
          // 그 밖의 실패(앱 안 브라우저가 막는 경우 등)는 아래 이미지 화면으로
        }
      }
      openShareSheet(blob, name, k);
    } catch (e) {
      track('error', { message: 'share: ' + String(e && e.message || e).slice(0, 200) });
    } finally {
      if (btn) { btn.innerHTML = label; btn.removeAttribute('aria-busy'); }
      sharing = false;
    }
  }
  function openShareSheet(blob, name, k) {
    if (shareUrl) URL.revokeObjectURL(shareUrl);
    shareUrl = URL.createObjectURL(blob);
    const inner =
      '<div class="ds-sharesheet">' +
        '<p class="ds-kicker">' + esc(t('shareKicker')) + '</p>' +
        '<img class="ds-share-img" src="' + shareUrl + '" alt="' + esc(SIGNATURE_DRINKS[k].en) + '">' +
        '<p class="ds-share-hint">' + esc(t('shareHint')) + '</p>' +
        '<a class="cta ds-share-save" href="' + shareUrl + '" download="' + esc(name) + '">' + esc(t('saveImage')) + '</a>' +
        '<button type="button" class="ds-share-copy" data-ds="copylink">' + esc(t('copyLink')) + '</button>' +
      '</div>';
    openOverlay(layer('dsShare', inner));
    track('share', { sin: KO[k], via: 'sheet' });
  }
  function copyLink(btn) {
    const done = () => {
      btn.textContent = t('copied'); btn.classList.add('ds-done');
      setTimeout(() => { btn.textContent = t('copyLink'); btn.classList.remove('ds-done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(SITE_URL).then(done, () => window.prompt(t('copyLink'), SITE_URL));
    else window.prompt(t('copyLink'), SITE_URL);
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
    else if (a === 'share') shareResult(b);
    else if (a === 'copylink') copyLink(b);
    else if (a === 'restart') restart();
    else if (a === 'close') { if (depth > 0) history.back(); else closeTopOverlay(); }
    else if (a === 'lang') {
      const to = b.getAttribute('data-lang');
      if (!LANGS.includes(to) || to === lang) return;
      lang = to;
      try { localStorage.setItem('ds_lang', lang); } catch (err) {}
      applyLang();
      track('lang', { to: lang });
    }
  });

  const top = document.createElement('div');
  top.className = 'ds-top';
  top.innerHTML =
    '<button type="button" class="ds-pill" id="dsMenuBtn" data-ds="menu">MENU</button>' +
    '<div class="ds-langs" id="dsLang" role="group" aria-label="Language">' + LANGS.map((l) =>
      '<button type="button" data-ds="lang" data-lang="' + l + '" lang="' + HTML_LANG[l] + '">' + LANG_LABEL[l] + '</button>').join('') + '</div>';
  document.body.appendChild(top);   // #cover 안에 두면 누를 때 표지 전환까지 같이 시작된다

  applyLang();
  renderQuestion();   // 원본이 처음에 그려 둔 v1 의 1번 문항을 새 문항으로 다시 그린다

  // 주소 끝이 #menu 면 메뉴를, #menu/<id> 면 그 항목까지 바로 연다 (메뉴판 전용 QR · 링크 공유용)
  async function openFromHash() {
    const m = /^#menu(?:\/([\w:%-]+))?$/.exec(location.hash || '');
    if (!m) return;
    history.replaceState(history.state, '', location.pathname + location.search);
    if (!document.getElementById('dsMenu')) await openMenu();
    let id = '';
    try { id = decodeURIComponent(m[1] || ''); } catch (e) { /* 깨진 주소면 메뉴판만 */ }
    if (id && canOpen(id)) openItem(id);   // #menu/sig:교 처럼 한글이 들어가면 %EA… 로 인코딩돼 온다
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
  window.DS_ENHANCE = { version: VERSION, quiz: QUIZ.version, collect: COLLECT_ON, calculate: () => calculate(), tie: () => ({ order: tieOrder.slice(), by: tieBy, frozen: tieFrozen }) };
})();
