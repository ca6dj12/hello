/* =============================================================
   DEADLY SINS — 화면 로직
   흐름:  인트로 → 열 개의 질문 → 결과(잔 + 같은 죄의 위스키) → 전체 메뉴
   ============================================================= */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var langBtn = document.getElementById('lang');

  var state = {
    lang: (function () { try { return localStorage.getItem('ds_lang') || 'ko'; } catch (e) { return 'ko'; } })(),
    step: 0, answers: [], order: [], view: 'intro', browsing: null
  };

  /* ---------- 벽면의 먹빛 도형 ---------- */
  var SHAPES = {
    square:     { d: 'M20 14 H100 V90 H20 Z', drip: 90 },
    star:       { d: 'M60 4 C65 38 82 55 116 60 C82 65 65 82 60 116 C55 82 38 65 4 60 C38 55 55 38 60 4 Z', drip: 112 },
    'tri-up':   { d: 'M60 10 L104 92 H16 Z', drip: 92 },
    'tri-down': { d: 'M14 12 H106 L60 98 Z', drip: 96 },
    diamond:    { d: 'M60 6 L110 52 L60 98 L10 52 Z', drip: 96 },
    circle:     { d: 'M60 8 A44 44 0 1 1 59.6 8 Z', drip: 96 },
    hex:        { d: 'M60 8 L104 30 V74 L60 96 L16 74 V30 Z', drip: 94 }
  };

  function dripPath(y) {
    return 'M58.3 ' + (y - 7) + ' C57.9 ' + (y + 12) + ' 57.2 ' + (y + 23) + ' 58.1 ' + (y + 31) +
      ' a3.8 4.3 0 1 0 3.8 0 C62.8 ' + (y + 23) + ' 62.1 ' + (y + 12) + ' 61.7 ' + (y - 7) + ' Z';
  }

  function inkShape(shape, cls) {
    var s = SHAPES[shape] || SHAPES.square;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 120 150" fill="currentColor" aria-hidden="true">' +
      '<g filter="url(#ink)"><path d="' + s.d + '"/><path d="' + dripPath(s.drip) + '"/></g></svg>';
  }

  /* ---------- 잔 ---------- */
  var GLASSES = {
    highball:  { out: 'M27 16 L29 90 H51 L53 16', rim: 'M26 16 H54', fill: 'M28.5 38 L29.6 88.4 H50.4 L51.5 38 Z' },
    rocks:     { out: 'M19 40 L23 86 H57 L61 40', rim: 'M18 40 H62', fill: 'M21.3 60 L22.8 84.6 H57.2 L58.7 60 Z' },
    wine:      { out: 'M27 18 C27 44 32 55 40 57 C48 55 53 44 53 18 M40 57 V80 M28 81 C33 84 47 84 52 81', rim: 'M27 18 H53', fill: 'M30.4 34 C31.4 46 34.6 54 40 55.6 C45.4 54 48.6 46 49.6 34 Z' },
    cocktail:  { out: 'M24 16 C24 46 31 58 40 60 C49 58 56 46 56 16 M40 60 V82 M27 83 C32 86 48 86 53 83', rim: 'M24 16 H56', fill: 'M27.6 32 C28.6 47 33.2 56 40 58 C46.8 56 51.4 47 52.4 32 Z' },
    copita:    { out: 'M26 30 C17 48 21 68 34 75 C38 77 42 77 46 75 C59 68 63 48 54 30 M31 78 C35 80 45 80 49 78', rim: 'M26 30 H54', fill: 'M22.8 48 C23.6 62 28 71 34 74.4 C38 76.4 42 76.4 46 74.4 C52 71 56.4 62 57.2 48 Z' },
    glencairn: { out: 'M28 18 C28 34 24 42 24 50 C24 62 31 70 40 70 C49 70 56 62 56 50 C56 42 52 34 52 18 M40 70 V76 M28 78 C33 81 47 81 52 78', rim: 'M28 18 H52', fill: 'M25.2 52 C26 63 32 69 40 69 C48 69 54 63 54.8 52 Z' }
  };

  function glassMark(type, cls) {
    var g = GLASSES[type] || GLASSES.rocks;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 80 100" aria-hidden="true">' +
      '<g filter="url(#inkSoft)" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="' + g.out + '"/><path d="' + g.rim + '"/></g>' +
      '<path d="' + g.fill + '" fill="currentColor" filter="url(#inkSoft)" opacity=".55"/></svg>';
  }

  /* ---------- 유틸 ---------- */
  function t() { return UI[state.lang]; }
  function txt(o) { return o[state.lang]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function shuffled(n) {
    var a = [], i, j, tmp;
    for (i = 0; i < n; i++) a.push(i);
    for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); tmp = a[i]; a[i] = a[j]; a[j] = tmp; }
    return a;
  }
  function newRun() {
    state.step = 0; state.answers = [];
    state.order = QUESTIONS.map(function (q) { return shuffled(q.options.length); });
  }

  /* ---------- 인트로 ---------- */
  function renderIntro() {
    var marks = SIN_ORDER.map(function (k) { return inkShape(SINS[k].shape, ''); }).join('');
    return '<section class="screen intro">' +
        '<p class="kicker">' + t().kicker + '</p>' +
        '<div class="intro-shapes">' + marks + '</div>' +
        '<hr class="rule-short">' +
        '<h1 class="intro-title">' + t().introTitle + '</h1>' +
        '<p class="intro-body">' + t().introBody + '</p>' +
        '<button class="btn" type="button" data-act="start">' + t().start + '</button>' +
        '<p class="meta">' + QUESTIONS.length + (state.lang === 'ko' ? '개의 질문 · ' : ' questions · ') + t().time + '</p>' +
        '<button class="textlink" type="button" data-act="menu">' + t().skipToMenu + '</button>' +
      '</section>';
  }

  /* ---------- 질문 ---------- */
  function renderQuestion() {
    var i = state.step, q = QUESTIONS[i], order = state.order[i];
    var ticks = QUESTIONS.map(function (_, k) {
      return '<span class="tick ' + (k < i ? 'done' : k === i ? 'now' : '') + '"></span>';
    }).join('');
    var opts = order.map(function (origIdx, pos) {
      var o = q.options[origIdx];
      var picked = state.answers[i] === origIdx ? ' picked' : '';
      return '<li><button class="option' + picked + '" type="button" data-pick="' + origIdx + '">' +
        esc(txt(o)) + '<span class="key">' + (pos + 1) + '</span></button></li>';
    }).join('');

    return '<section class="screen">' +
        '<div class="q-head">' +
          '<button class="back" type="button" data-act="back">' + (i === 0 ? '' : '← ' + t().back) + '</button>' +
          '<div class="ticks">' + ticks + '</div>' +
          '<span class="count">' + (i + 1) + ' ' + t().of + ' ' + QUESTIONS.length + '</span>' +
        '</div>' +
        '<div class="q-body">' +
          '<h2 class="q-text">' + esc(txt(q.q)) + '</h2>' +
          '<ul class="options">' + opts + '</ul>' +
        '</div>' +
      '</section>';
  }

  /* ---------- 결과 ---------- */
  function pips(level) {
    var out = '';
    for (var i = 1; i <= 5; i++) out += '<span class="pip' + (i <= level ? ' on' : '') + '"></span>';
    return '<span class="pips" aria-hidden="true">' + out + '</span>';
  }

  function whiskyPair(sinKey) {
    var sec = null;
    MENU.whisky.forEach(function (w) { if (w.sin === sinKey) sec = w; });
    if (!sec) return '';
    var rows = sec.items.map(function (it) {
      return '<div class="row"><span class="n">' + txt(it) + '</span><span class="dots"></span>' +
        '<span class="p"><em>G</em>' + it.g + '　<em>B</em>' + it.b + '</span></div>';
    }).join('');
    return '<div class="pair">' +
      '<p class="pair-head">' + t().whiskyForSin + '</p>' +
      '<p class="pair-label">' + txt(sec.label) + '</p>' + rows + '</div>';
  }

  function renderResult(sinKey, secondKey) {
    var s = SINS[sinKey], u = t();
    var second = secondKey
      ? '<p class="second">' + u.second + ' · <b>' + SINS[secondKey].en + '</b> ' + SINS[secondKey].ko + '</p>' : '';

    return '<section class="screen result">' +
        '<div class="lamp"></div>' +
        '<article class="panel">' +
          inkShape(s.shape, 'sin-mark') + glassMark(s.glass, 'glass-mark') +
          '<p class="result-kicker">' + u.resultKicker + '</p>' +
          '<h1 class="sin-en">' + s.en + '</h1>' +
          '<p class="sin-ko">' + s.ko + '</p>' +
          '<div class="panel-rule"></div>' +
          '<p class="latin">' + s.latin + '</p>' +
          '<p class="latin-tr">' + txt(s.latinTr) + '</p>' +
          '<p class="verdict">' + txt(s.verdict) + '</p>' +
          '<ul class="tasting">' +
            '<li><span class="k">' + u.aroma + '</span><span class="v">' + txt(s.aroma) + '</span></li>' +
            '<li><span class="k">' + u.taste + '</span><span class="v">' + txt(s.taste) + '</span></li>' +
            '<li><span class="k">' + u.finish + '</span><span class="v">' + txt(s.finish) + '</span></li>' +
            '<li><span class="k">' + u.strength + '</span><span class="v">' + txt(s.strength) + pips(s.level) + '</span></li>' +
            '<li><span class="k">' + u.price + '</span><span class="v">' + s.price + u.won + '</span></li>' +
          '</ul>' +
          '<div class="order"><p class="k">' + u.order + '</p><p class="v">' + u.orderLine(txt(s.drink)) + '</p></div>' +
        '</article>' + second + whiskyPair(sinKey) +
        '<div class="actions">' +
          '<button class="btn ghost" type="button" data-act="share">' + u.share + '</button>' +
          '<button class="btn ghost" type="button" data-act="again">' + u.again + '</button>' +
        '</div>' +
      '</section>';
  }

  /* ---------- 메뉴 ---------- */
  function rows(list) {
    return list.map(function (it) {
      return '<div class="row"><span class="n">' + it.ko +
        (state.lang === 'ko' ? '<small>' + it.en + '</small>' : '<small>' + it.ko + '</small>') +
        '</span><span class="dots"></span><span class="p">' + it.p + '</span></div>';
    }).join('');
  }

  function renderMenu(withHeading) {
    var u = t();

    var sig = SIN_ORDER.map(function (k) {
      var s = SINS[k];
      return '<button class="sig" type="button" data-sin="' + k + '">' + inkShape(s.shape, '') +
        '<span class="t"><b>' + s.en + '</b><span>' + txt(s.drink) + ' · ' + txt(s.aroma) + '</span></span>' +
        '<span class="p">' + s.price + '</span></button>';
    }).join('');

    var whisky = MENU.whisky.map(function (w) {
      var items = w.items.map(function (it) {
        return '<div class="row"><span class="n">' + txt(it) + '</span><span class="dots"></span>' +
          '<span class="p"><em>G</em>' + it.g + '　<em>B</em>' + it.b + '</span></div>';
      }).join('');
      return '<div class="grp"><p class="grp-h">' + txt(w.label) +
        '<span class="sin">' + SINS[w.sin].en + '</span></p>' + items + '</div>';
    }).join('');

    var final = '<div class="final"><h3>' + MENU.final.title + '</h3>' +
      '<p class="grp-h">' + txt(MENU.final.label) + '</p>' +
      MENU.final.items.map(function (it) {
        return '<div class="row"><span class="n">' + txt(it) + '</span><span class="dots"></span>' +
          '<span class="p"><em>G</em>' + it.g + '　<em>B</em>' + it.b + '</span></div>';
      }).join('') + '</div>';

    return '<section class="menu" id="menu">' +
      (withHeading ? '<h2 class="menu-title">' + u.menuTitle + '</h2><p class="menu-sub">' + u.kicker + '</p>' : '') +
      '<div class="sec"><h3 class="sec-h">' + u.signature + '</h3>' +
        '<p class="sec-note">' + u.signatureNote + '</p>' + sig + '</div>' +
      '<div class="sec"><h3 class="sec-h">' + u.whisky + '</h3>' +
        '<p class="sec-note">' + txt(MENU.whiskyNote) + '　·　' + txt(MENU.whiskyHead) + '</p>' +
        whisky + final + '</div>' +
      '<div class="sec"><h3 class="sec-h">' + u.bites + '</h3>' + rows(MENU.bites) + '</div>' +
      '<div class="sec"><h3 class="sec-h">' + u.cocktails + '</h3>' + rows(MENU.cocktails) + '</div>' +
      '<div class="sec"><h3 class="sec-h">' + u.beverages + '</h3>' + rows(MENU.beverages) + '</div>' +
      '<div class="sec"><h3 class="sec-h">' + u.info + '</h3><ul class="info">' +
        MENU.info.map(function (i) { return '<li>' + txt(i) + '</li>'; }).join('') + '</ul></div>' +
      '<p class="foot">' + u.footer + '</p></section>';
  }

  /* ---------- 렌더 ---------- */
  function render(keepScroll) {
    var html = '';
    if (state.view === 'intro') html = renderIntro();
    else if (state.view === 'q') html = renderQuestion();
    else if (state.view === 'result') {
      var r = state.browsing ? { top: state.browsing, second: null }
                             : scoreAnswers(state.answers, QUESTIONS, SIN_ORDER);
      html = renderResult(r.top, r.second) +
        '<div class="divider">' + t().menuTitle + '</div>' + renderMenu(false);
    } else if (state.view === 'menu') {
      html = '<section class="screen"><button class="btn" type="button" data-act="start">' + t().start + '</button></section>' +
        '<div class="divider">' + t().menuTitle + '</div>' + renderMenu(false);
    }
    app.innerHTML = html;
    if (!keepScroll) window.scrollTo(0, 0);
  }

  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 400); }, 1800);
  }

  function share() {
    var sin = (location.hash || '').replace('#/', '');
    var s = SINS[sin];
    var url = location.origin + location.pathname + (s ? '#/' + sin : '');
    var text = s
      ? (state.lang === 'ko' ? '오늘 밤 나의 죄는 ' + s.en + ' — ' + txt(s.drink) : 'Tonight my sin is ' + s.en + ' — ' + txt(s.drink))
      : t().kicker;
    if (navigator.share) navigator.share({ title: 'DEADLY SINS', text: text, url: url }).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text + '\n' + url).then(function () { toast(t().copied); });
    else toast(url);
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', function (e) {
    var pick = e.target.closest('[data-pick]');
    if (pick) {
      var i = state.step;
      state.answers[i] = parseInt(pick.getAttribute('data-pick'), 10);
      pick.classList.add('picked');
      setTimeout(function () {
        if (i + 1 >= QUESTIONS.length) {
          var r = scoreAnswers(state.answers, QUESTIONS, SIN_ORDER);
          state.browsing = null; state.view = 'result';
          history.replaceState(null, '', '#/' + r.top);
        } else { state.step = i + 1; }
        render();
      }, 170);
      return;
    }

    var sinBtn = e.target.closest('[data-sin]');
    if (sinBtn) {
      state.browsing = sinBtn.getAttribute('data-sin');
      state.view = 'result';
      history.replaceState(null, '', '#/' + state.browsing);
      render();
      return;
    }

    var act = e.target.closest('[data-act]');
    if (!act) return;
    var a = act.getAttribute('data-act');

    if (a === 'start' || a === 'again') {
      newRun(); state.browsing = null; state.view = 'q';
      history.replaceState(null, '', '#/q'); render();
    } else if (a === 'back') {
      if (state.step > 0) { state.step--; render(); }
      else { state.view = 'intro'; history.replaceState(null, '', '#/'); render(); }
    } else if (a === 'menu') {
      state.view = 'menu'; history.replaceState(null, '', '#/menu'); render();
    } else if (a === 'home') {
      state.view = 'intro'; state.browsing = null;
      history.replaceState(null, '', '#/'); render();
    } else if (a === 'share') share();
  });

  document.addEventListener('keydown', function (e) {
    if (state.view !== 'q') return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) {
      var btn = app.querySelectorAll('.option')[n - 1];
      if (btn) btn.click();
    } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (state.step > 0) { state.step--; render(); }
    }
  });

  langBtn.addEventListener('click', function () {
    state.lang = state.lang === 'ko' ? 'en' : 'ko';
    try { localStorage.setItem('ds_lang', state.lang); } catch (err) {}
    document.documentElement.lang = state.lang;
    langBtn.textContent = t().langLabel;
    render(true);
  });

  /* 주소창 해시가 바뀌면(뒤로가기, 공유 링크 직접 입력) 그 화면으로 */
  window.addEventListener('hashchange', function () {
    var hash = (location.hash || '').replace('#/', '');
    if (SINS[hash]) { state.browsing = hash; state.view = 'result'; }
    else if (hash === 'menu') { state.view = 'menu'; }
    else if (hash === 'q') { return; }
    else { state.view = 'intro'; state.browsing = null; }
    render();
  });

  /* ---------- 시작 ---------- */
  (function boot() {
    document.documentElement.lang = state.lang;
    langBtn.textContent = t().langLabel;
    newRun();
    var hash = (location.hash || '').replace('#/', '');
    if (SINS[hash]) { state.browsing = hash; state.view = 'result'; }
    else if (hash === 'menu') state.view = 'menu';
    else state.view = 'intro';
    render();
  })();
})();
