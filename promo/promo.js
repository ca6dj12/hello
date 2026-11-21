/* =============================================================
   DEADLY SINS — 1층 배너 QR 홍보 사이트 (테이블 QR 의 설문 사이트와 별개)
   지나가던 사람이 QR 을 찍고 3초 안에 알아야 할 것: 무슨 곳인지 · 분위기 · 무엇을 마시는지 · 어떻게 올라가는지.
   설문(나의 죄 테스트)은 테이블에서 하는 경험이라 여기서는 예고만 한다.
   가격은 이 사이트에 싣지 않는다 (사장님 2026-10-26). 메뉴는 사진 격자, 누르면 설명.

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

  // 일곱 죄의 순서 = 바 안 포스터 벽 (왼쪽부터 PRIDE · ENVY · GREED · GLUTTONY · WRATH · LUST · SLOTH). 사이트 어디서나 이 순서
  const SINS = [['교', '교만', 'PRIDE'], ['질', '질투', 'ENVY'], ['탐', '탐욕', 'GREED'], ['식', '폭식', 'GLUTTONY'],
    ['분', '분노', 'WRATH'], ['색', '색욕', 'LUST'], ['나', '나태', 'SLOTH']];
  const ORDER = SINS.map((s) => s[0]);
  const DAYS = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], ja: ['日', '月', '火', '水', '木', '金', '土'] };
  const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // 중국어 · 일본어 죄 이름과 술 이름 꼴 (傲慢之酒 · 傲慢の酒)
  const LOCAL_SIN = {
    zh: { 교: '傲慢', 질: '嫉妒', 탐: '贪婪', 식: '暴食', 분: '暴怒', 색: '色欲', 나: '懒惰' },
    ja: { 교: '傲慢', 질: '嫉妬', 탐: '強欲', 식: '暴食', 분: '憤怒', 색: '色欲', 나: '怠惰' }
  };
  const DRINK_OF = { zh: '之酒', ja: 'の酒' };
  const LANGS = ['ko', 'en', 'zh', 'ja'], LANG_LABEL = { ko: '한국어', en: 'EN', zh: '中文', ja: '日本語' }, HTML_LANG = { ko: 'ko', en: 'en', zh: 'zh-Hans', ja: 'ja' };

  const T = {
    ko: {
      conceptTitle: '오늘 밤, 당신은<br>어떤 죄를 삼키시겠습니까?',
      conceptBody: '데들리 신스는 일곱 가지 죄를 일곱 잔의 칵테일로 빚었습니다. 교만, 질투, 탐욕, 폭식, 분노, 색욕, 나태 — 오늘 밤 당신은 어느 쪽인가요?',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: '일곱 잔의 시그니처', swipe: '옆으로 넘겨 보세요',
      roomKicker: 'THE ROOM', roomTitle: '5층의 밤', roomBody: '낮은 조명, 거친 벽, 그리고 일곱 개의 죄. 혼자여도, 둘이어도 좋은 자리.',
      rental: '대관 문의 환영', rentalBody: '편한 방법으로 문의해 주세요.', viaIg: '인스타그램 DM', viaPhone: '전화', viaEmail: '메일',
      entrance: '이 간판이 보이면 도착이에요',
      tableKicker: 'AT YOUR TABLE', tableTitle: '자리에 앉으면,<br>일곱 개의 질문이 기다립니다',
      tableBody: '테이블 위 QR을 찍고 질문 일곱 개에 답하면, 일곱 잔 중 당신의 죄에 맞는 한 잔을 골라 드려요. 그 답은 5층에서만.',
      menuKicker: 'MENU', menuTitle: '메뉴', menuHint: '사진을 누르면 설명이 나와요',
      menuSig: '시그니처', menuWhisky: '위스키', menuCocktails: '칵테일', menuBites: '안주', menuBev: '음료',
      menuWhiskyNote: '죄마다 어울리는 위스키를 골라 두었습니다', soldOut: '품절', soldOutNote: '오늘은 품절이에요',
      aroma: '향', taste: '맛', finish: '피니시', strength: '강도', cask: '캐스크', nose: '향', palate: '맛', recipe: '재료', plate: '구성', close: '닫기',
      photoCredits: '사진 출처', photoEdited: '배경 제거 · 크기 조정', photoEditedGray: '배경 제거 · 흑백 · 크기 조정',
      wayKicker: 'FIND US', wayTitle: (f) => f + '층에서<br>기다리고 있어요',
      here: (f) => '지금 계신 이 건물 ' + f + '층', map: '지도에서 보기',
      where: '위치', hours: '영업시간', good: '안내', contact: '문의', noCover: '커버차지 없음',
      openNow: (c) => '지금 영업 중 · ' + c + '까지', opensAt: (o) => '오늘 ' + o + ' 오픈', closedToday: '오늘은 쉬어요',
      opensNext: (w, o) => w + ' ' + o + ' 오픈', tomorrow: '내일', dayName: (d) => d + '요일',
      lastOrder: (x) => '라스트오더 ' + x, lastDone: '오늘 주문은 마감됐어요',
      everyDay: '연중무휴', closedOn: (d) => '매주 ' + d.map((x) => DAYS.ko[x]).join(' · ') + '요일 휴무',
      dockMenu: '메뉴', dockWay: '오시는 길', dockLabel: '바로가기'
    },
    en: {
      conceptTitle: 'Which sin will you<br>drink tonight?',
      conceptBody: 'Deadly Sins turns the seven deadly sins into seven cocktails. Pride, envy, greed, gluttony, wrath, lust, sloth — which one are you tonight?',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: 'Seven signature cocktails', swipe: 'Swipe to see all seven',
      roomKicker: 'THE ROOM', roomTitle: 'A night on the fifth floor', roomBody: 'Low light, rough walls, seven sins. As good for one as it is for two.',
      rental: 'Private events welcome', rentalBody: 'Reach us whichever way is easiest.', viaIg: 'Instagram DM', viaPhone: 'Call', viaEmail: 'Email',
      entrance: 'When you see this sign, you’re here',
      tableKicker: 'AT YOUR TABLE', tableTitle: 'Take a seat.<br>Seven questions await.',
      tableBody: 'Scan the QR code on your table and answer seven questions. We’ll match you with the one cocktail, out of seven, that fits your sin. You’ll only find out on the 5th floor.',
      menuKicker: 'MENU', menuTitle: 'Menu', menuHint: 'Tap a photo for details',
      menuSig: 'Signature', menuWhisky: 'Whisky', menuCocktails: 'Cocktails', menuBites: 'Bites', menuBev: 'Soft drinks',
      menuWhiskyNote: 'A whisky for every sin', soldOut: 'Sold out', soldOutNote: 'Sold out today',
      aroma: 'Aroma', taste: 'Taste', finish: 'Finish', strength: 'Strength', cask: 'Cask', nose: 'Nose', palate: 'Palate', recipe: 'Ingredients', plate: 'On the plate', close: 'Close',
      photoCredits: 'Photo credits', photoEdited: 'background removed, resized', photoEditedGray: 'background removed, black and white, resized',
      wayKicker: 'FIND US', wayTitle: (f) => 'We’re waiting<br>on the ' + ordinal(f) + ' floor',
      here: (f) => 'This building, ' + ordinal(f) + ' floor', map: 'Open in maps',
      where: 'Where', hours: 'Hours', good: 'Good to know', contact: 'Contact', noCover: 'No cover charge',
      openNow: (c) => 'Open now · until ' + c, opensAt: (o) => 'Opens today at ' + o, closedToday: 'Closed today',
      opensNext: (w, o) => 'opens ' + w + ' at ' + o, tomorrow: 'tomorrow', dayName: (d) => d,
      lastOrder: (x) => 'Last order ' + x, lastDone: 'We’ve stopped taking orders for tonight',
      everyDay: 'Open every day', closedOn: (d) => 'Closed on ' + d.map((x) => DAY_FULL[x] + 's').join(', ').replace(/, ([^,]*)$/, ' and $1'),
      dockMenu: 'Menu', dockWay: 'Find us', dockLabel: 'Shortcuts'
    },
    zh: {
      conceptTitle: '今晚，你要饮下<br>哪一种罪？',
      conceptBody: 'Deadly Sins 把七宗罪酿成了七杯鸡尾酒。傲慢、嫉妒、贪婪、暴食、暴怒、色欲、懒惰——今晚的你，是哪一种？',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: '七杯招牌特调', swipe: '左右滑动查看',
      roomKicker: 'THE ROOM', roomTitle: '5楼的夜晚', roomBody: '昏暗的灯光，粗粝的墙面，还有七宗罪。一个人来，两个人来，都刚刚好。',
      rental: '欢迎包场咨询', rentalBody: '请用您方便的方式联系我们。', viaIg: 'Instagram 私信', viaPhone: '电话', viaEmail: '邮件',
      entrance: '看到这块招牌，就到了',
      tableKicker: 'AT YOUR TABLE', tableTitle: '入座之后，<br>七个问题在等你',
      tableBody: '扫一扫桌上的二维码，回答七个问题，我们会从七杯酒里为你挑出与你的罪最相配的那一杯。答案，只在5楼揭晓。',
      menuKicker: 'MENU', menuTitle: '菜单', menuHint: '点击图片查看介绍',
      menuSig: '招牌特调', menuWhisky: '威士忌', menuCocktails: '鸡尾酒', menuBites: '小食', menuBev: '软饮',
      menuWhiskyNote: '为每一种罪挑选了相配的威士忌', soldOut: '售罄', soldOutNote: '今天已售罄',
      aroma: '香气', taste: '口感', finish: '余韵', strength: '酒精度', cask: '橡木桶', nose: '闻香', palate: '口感', recipe: '配方', plate: '搭配', close: '关闭',
      photoCredits: '图片来源', photoEdited: '去除背景 · 调整尺寸', photoEditedGray: '去除背景 · 黑白 · 调整尺寸',
      wayKicker: 'FIND US', wayTitle: (f) => '我们在' + f + '楼<br>等你',
      here: (f) => '就在这栋楼的' + f + '楼', map: '在地图中查看',
      where: '位置', hours: '营业时间', good: '须知', contact: '联系', noCover: '不收座位费',
      openNow: (c) => '营业中 · 至 ' + c, opensAt: (o) => '今天 ' + o + ' 开门', closedToday: '今天休息',
      opensNext: (w, o) => w + ' ' + o + ' 开门', tomorrow: '明天', dayName: (d) => d,
      lastOrder: (x) => '最后点单 ' + x, lastDone: '今天已停止点单',
      everyDay: '全年无休', closedOn: (d) => '每' + d.map((x) => DAYS.zh[x]).join('、') + '休息',
      dockMenu: '菜单', dockWay: '到店路线', dockLabel: '快捷入口'
    },
    ja: {
      conceptTitle: '今夜、あなたは<br>どの罪を飲み干しますか？',
      conceptBody: 'Deadly Sinsは、七つの大罪を七杯のカクテルに仕立てました。傲慢、嫉妬、強欲、暴食、憤怒、色欲、怠惰——今夜のあなたはどれですか？',
      sevenKicker: 'SEVEN SINS · SIGNATURE', sevenTitle: '七杯のシグネチャー', swipe: '横にスワイプしてご覧ください',
      roomKicker: 'THE ROOM', roomTitle: '5階の夜', roomBody: '落とした照明、ざらついた壁、そして七つの罪。おひとりでも、おふたりでも。',
      rental: '貸切のご相談、歓迎します', rentalBody: 'ご都合のよい方法でお問い合わせください。', viaIg: 'Instagram DM', viaPhone: '電話', viaEmail: 'メール',
      entrance: 'この看板が見えたら到着です',
      tableKicker: 'AT YOUR TABLE', tableTitle: '席に着いたら、<br>七つの質問が待っています',
      tableBody: 'テーブルのQRコードを読み取って七つの質問に答えると、七杯の中からあなたの罪にぴったりの一杯をお選びします。答えは5階でのお楽しみ。',
      menuKicker: 'MENU', menuTitle: 'メニュー', menuHint: '写真をタップすると説明が出ます',
      menuSig: 'シグネチャー', menuWhisky: 'ウイスキー', menuCocktails: 'カクテル', menuBites: 'おつまみ', menuBev: 'ソフトドリンク',
      menuWhiskyNote: '罪ごとに合うウイスキーを選びました', soldOut: '売り切れ', soldOutNote: '本日は売り切れです',
      aroma: '香り', taste: '味わい', finish: 'フィニッシュ', strength: '強さ', cask: '樽', nose: '香り', palate: '味わい', recipe: '材料', plate: '内容', close: '閉じる',
      photoCredits: '写真の出典', photoEdited: '背景除去・サイズ調整', photoEditedGray: '背景除去・モノクロ・サイズ調整',
      wayKicker: 'FIND US', wayTitle: (f) => f + '階で<br>お待ちしています',
      here: (f) => 'このビルの' + f + '階', map: '地図で見る',
      where: '場所', hours: '営業時間', good: 'ご案内', contact: 'お問い合わせ', noCover: 'チャージ料なし',
      openNow: (c) => '営業中 · ' + c + 'まで', opensAt: (o) => '本日 ' + o + ' オープン', closedToday: '本日はお休みです',
      opensNext: (w, o) => w + ' ' + o + ' オープン', tomorrow: '明日', dayName: (d) => d + '曜',
      lastOrder: (x) => 'ラストオーダー ' + x, lastDone: '本日のご注文は終了しました',
      everyDay: '年中無休', closedOn: (d) => '毎週' + d.map((x) => DAYS.ja[x]).join('・') + '曜定休',
      dockMenu: 'メニュー', dockWay: 'アクセス', dockLabel: 'ショートカット'
    }
  };
  // 5 → 5th, 1 → 1st, 2 → 2nd, 3 → 3rd, 11~13 → th
  function ordinal(n) { const v = Math.abs(+n) % 100, s = ['th', 'st', 'nd', 'rd']; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  // 한국어 · English · 中文(간체). 고른 언어를 기억하고(설문 사이트와 같은 이름 ds_lang), 처음에는 폰 언어를 따른다.
  let lang = '';
  try { lang = localStorage.getItem('ds_lang') || ''; } catch (e) {}
  if (!LANGS.includes(lang)) { const n = (navigator.language || 'ko').toLowerCase(); lang = n.indexOf('ko') === 0 ? 'ko' : n.indexOf('zh') === 0 ? 'zh' : n.indexOf('ja') === 0 ? 'ja' : 'en'; }
  const t = (k, ...a) => { const v = T[lang][k] !== undefined ? T[lang][k] : T.en[k]; return typeof v === 'function' ? v(...a) : v; };
  const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // { ko, en, zh } 에서 지금 언어의 글. 없으면 (한국어 화면이 아닐 때) 영어 → 한국어
  const L10 = (o) => (o && typeof o === 'object' ? (o[lang] || (lang !== 'ko' && o.en) || o.ko || '') : (o || ''));

  /* ---------- 사장님이 /admin 에서 고친 품절 · 숨김 · NEW · 새 메뉴 (가격은 이 사이트에 안 나옴) ---------- */
  const SIG_FLAGS = {};
  function applyLive(live) {
    const d = live && live.data;
    if (!d) return;
    const m = D.menu;
    const items = d.items || {};
    [].concat(...m.whisky.map((w) => w.items), m.final.items, m.cocktails, m.bites, m.beverages).forEach((it) => {
      const o = it.id && items[it.id];
      if (o) ['hidden', 'soldOut', 'new'].forEach((k) => { if (o[k] !== undefined) it[k] = o[k]; });
    });
    Object.keys(items).forEach((id) => { if (id.indexOf('sig:') === 0) SIG_FLAGS[id.slice(4)] = items[id]; });
    (Array.isArray(d.extra) ? d.extra : []).forEach((x) => {
      const sec = String(x.section || '');
      const list = sec === 'final' ? m.final.items
        : sec.indexOf('whisky:') === 0 ? (m.whisky.find((w) => w.sin === sec.slice(7)) || {}).items
        : ['cocktails', 'bites', 'beverages'].includes(sec) ? m[sec] : null;
      if (!Array.isArray(list) || !x.id || list.some((it) => it.id === x.id)) return;
      list.push({ id: x.id, ko: x.ko || x.en, en: x.en || x.ko, about: x.about, soldOut: x.soldOut, hidden: x.hidden, new: x.new });
    });
    // 가게 정보: 영업 요일 · 시간 · 라스트오더 · 공지 · 연락처 (비운 연락처는 화면에서 빠진다)
    const info = d.info;
    if (info && typeof info === 'object') {
      const h = info.hours;
      if (h && Array.isArray(h.days) && h.days.length && h.open && h.close) L.hours = [{ days: h.days, open: h.open, close: h.close, last: h.last || undefined }];
      if (info.notice && typeof info.notice === 'object') L.notice = info.notice;
      ['phone', 'instagram', 'email'].forEach((k) => { if (typeof info[k] === 'string') L[k] = info[k]; });
    }
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
    if (lang !== 'ko') return s;   // 영어 · 중국어는 20:00 꼴 그대로
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
    // 쉬는 요일 안내는 영업 요일에서 만든다 ("매주 월요일 휴무" · "Closed on Mondays" · "每周一休息") — 요일을 바꾸면 문구도 같이 바뀌게
    const open = new Set([].concat(...H.map((h) => h.days || []))), off = [1, 2, 3, 4, 5, 6, 0].filter((d) => !open.has(d));
    const notes = [...new Set(H.filter((h) => h.last).map((h) => t('lastOrder', h.last)))].concat([off.length ? t('closedOn', off) : t('everyDay')]);
    return H.map((h) => '<span>' + esc(dayRange(h.days)) + '</span> ' + esc(h.open) + ' – ' + esc(h.close)).join('<br>') +
      (notes.length ? '<br><small>' + esc(notes.join(' · ')) + '</small>' : '');
  }

  /* ---------- 메뉴: 종류별 사진 격자, 누르면 설명 ---------- */
  const shown = (it) => !it.hidden;
  const det = (id) => (D.details || {})[id] || {};
  const sinName = (k) => { const x = SINS.find((s) => s[0] === k); return x ? (lang === 'en' ? x[2] : LOCAL_SIN[lang] ? LOCAL_SIN[lang][k] : x[1]) : ''; };
  const drinkName = (k, kr) => (LOCAL_SIN[lang] ? LOCAL_SIN[lang][k] + DRINK_OF[lang] : kr);   // 교만의 술 · 傲慢之酒 · 傲慢の酒
  let ITEMS = {};
  function menuCats() {
    const m = D.menu, other = (it) => (lang === 'en' || L10(it) === it.en ? '' : it.en);   // 보조 이름(병에 적힌 영어 이름)은 한국어 · 중국어 화면에서만
    const cats = [];
    cats.push({ key: 'sig', title: t('menuSig'), en: 'SEVEN SINS', items: SINS.map(([k, ko, en]) => {
      const d = D.drinks[k] || {}, dr = (B.drinks || {})[k] || {};
      return { id: 'sig-' + k, art: true, img: dr.image, tag: { sym: k, text: lang === 'en' ? 'SIGNATURE' : en }, name: lang === 'en' ? en : drinkName(k, dr.kr),
        sub: L10(d.style), flags: SIG_FLAGS[k] || {}, about: L10(d.desc), quote: d.line && d.line.confirmed ? L10(d.line) : '',
        rows: [['aroma', L10(d.aroma)], ['taste', L10(d.taste)], ['finish', L10(d.finish)], ['strength', L10(d.strength)]] };
    }) });
    const whisky = [];
    m.whisky.slice().sort((a, b) => ORDER.indexOf(a.sin) - ORDER.indexOf(b.sin)).forEach((g) => g.items.filter(shown).forEach((it) => whisky.push({ it, tag: { sym: g.sin, text: sinName(g.sin) }, quote: L10(g.label) })));
    m.final.items.filter(shown).forEach((it) => whisky.push({ it, tag: { text: m.final.title }, quote: L10(m.final.label) }));
    const plain = (it, extra) => {
      const d = det(it.id);
      return Object.assign({ id: it.id, img: d.photo, scene: !!d.scene, name: L10(it) || it.en, alt: other(it), flags: it, detail: d,
        sub: L10(d.region) || L10(d.kind), meta: [L10(d.kind), L10(d.region), d.abv].filter(Boolean).join(' · '), about: L10(d.about || it.about),
        rows: [['cask', L10(d.cask)], ['nose', L10(d.nose)], ['palate', L10(d.palate)], ['finish', L10(d.finish)], ['recipe', L10(d.recipe)], ['plate', L10(d.plate)]] }, extra || {});
    };
    cats.push({ key: 'whisky', title: t('menuWhisky'), en: 'WHISKY', note: t('menuWhiskyNote'), items: whisky.map((w) => plain(w.it, { tag: w.tag, quote: w.quote })) });
    cats.push({ key: 'cocktails', title: t('menuCocktails'), en: 'COCKTAILS', items: m.cocktails.filter(shown).map((it) => plain(it, { sub: L10(det(it.id).kind) })) });
    cats.push({ key: 'bites', title: t('menuBites'), en: 'BITES', items: m.bites.filter(shown).map((it) => plain(it, { sub: L10(det(it.id).plate) })) });
    cats.push({ key: 'bev', title: t('menuBev'), en: 'DRINKS', items: m.beverages.filter(shown).map((it) => plain(it, { sub: other(it) || L10(det(it.id).kind) })) });
    return cats.filter((c) => c.items.length);
  }
  const symImg = (k) => (k && (B.symbols || {})[k] ? '<img src="' + esc(A(B.symbols[k])) + '" alt="">' : '');
  function itemHtml(x) {
    const f = x.flags || {};
    return '<button type="button" class="lb-item lb-r' + (x.art ? ' is-art' : '') + (x.scene ? ' is-scene' : '') + (x.img ? '' : ' no-img') + (f.soldOut ? ' is-sold' : '') +
      '" id="m-' + esc(x.id) + '" data-act="item" data-id="' + esc(x.id) + '">' +
      '<span class="lb-item-img">' + (x.img ? '<img src="' + esc(A(x.img)) + '" alt="" loading="lazy">' : '<span class="lb-item-ph">' + esc(String(x.name).slice(0, 1)) + '</span>') +
        (f.new ? '<i class="lb-new">NEW</i>' : '') + (f.soldOut ? '<i class="lb-sold">' + esc(t('soldOut')) + '</i>' : '') + '</span>' +
      (x.tag ? '<span class="lb-item-tag">' + symImg(x.tag.sym) + esc(x.tag.text) + '</span>' : '') +
      '<b class="lb-item-name">' + esc(x.name) + '</b>' +
      (x.sub ? '<small class="lb-item-sub">' + esc(x.sub) + '</small>' : '') +
    '</button>';
  }
  // 위키미디어 공용 사진(CC)은 출처를 밝혀야 해서, 메뉴 맨 아래 접어 둔다 (설문 사이트 메뉴판과 같은 방식)
  function creditsHtml(cats) {
    const rows = [].concat(...cats.map((c) => c.items)).filter((x) => x.detail && x.detail.photo && x.detail.photoCredit);
    if (!rows.length) return '';
    return '<details class="lb-credits"><summary>' + esc(t('photoCredits')) + '</summary><ul>' + rows.map((x) => {
      const c = x.detail.photoCredit, who = esc([c.author, c.license].filter(Boolean).join(' · '));
      return '<li>' + esc(x.name) + ' — ' + (c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + who + '</a>' : who) +
        ' (' + esc(t(c.gray ? 'photoEditedGray' : 'photoEdited')) + ')</li>';
    }).join('') + '</ul></details>';
  }
  function menuHtml() {
    const cats = menuCats();
    ITEMS = {};
    cats.forEach((c) => c.items.forEach((x) => { ITEMS[x.id] = x; }));
    return '<nav class="lb-cats" aria-label="' + esc(t('menuTitle')) + '">' + cats.map((c, i) =>
      '<a href="#cat-' + c.key + '" data-act="cat"' + (i ? '' : ' class="on"') + '>' + esc(c.title) + '</a>').join('') + '</nav>' +
      cats.map((c) => '<div class="lb-cat" id="cat-' + c.key + '"><h3>' + esc(c.title) + (lang !== 'en' || c.key === 'sig' ? '<small>' + esc(c.en) + '</small>' : '') + '</h3>' +
        (c.note ? '<p class="lb-cat-note">' + esc(c.note) + '</p>' : '') +
        '<div class="lb-grid">' + c.items.map(itemHtml).join('') + '</div></div>').join('') +
      creditsHtml(cats);
  }

  /* ---------- 설명 (아래에서 올라오는 판) ---------- */
  let sheet = null, sheetFrom = null, sheetPushed = false;
  function sheetEl() {
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.className = 'lb-sheet';
    sheet.hidden = true;
    sheet.innerHTML = '<div class="lb-sheet-bg" data-close></div><div class="lb-sheet-panel" role="dialog" aria-modal="true" aria-labelledby="lbSheetTitle">' +
      '<button type="button" class="lb-sheet-x" data-close></button><div class="lb-sheet-body"></div></div>';
    document.body.appendChild(sheet);
    return sheet;
  }
  function sheetHtml(x) {
    const f = x.flags || {};
    const rows = (x.rows || []).filter((r) => r[1]);
    return '<div class="lb-sheet-img' + (x.art ? ' is-art' : '') + (x.scene ? ' is-scene' : '') + '">' + (x.img ? '<img src="' + esc(A(x.img)) + '" alt="">' : '') + '</div>' +
      '<div class="lb-sheet-text">' +
        (x.tag ? '<p class="lb-item-tag">' + symImg(x.tag.sym) + esc(x.tag.text) + (x.quote && !x.art ? ' · ' + esc(x.quote) : '') + '</p>' : '') +
        '<h3 id="lbSheetTitle">' + esc(x.name) + (f.new ? ' <i class="lb-new">NEW</i>' : '') + '</h3>' +
        (x.alt && x.alt !== x.name ? '<p class="lb-sheet-alt">' + esc(x.alt) + '</p>' : '') +
        (x.meta ? '<p class="lb-sheet-meta">' + esc(x.meta) + '</p>' : x.art && x.sub ? '<p class="lb-sheet-meta">' + esc(x.sub) + '</p>' : '') +
        (f.soldOut ? '<p class="lb-sheet-sold">' + esc(t('soldOutNote')) + '</p>' : '') +
        (x.art && x.quote ? '<p class="lb-sheet-quote">' + esc(x.quote) + '</p>' : '') +
        (x.about ? '<p class="lb-sheet-about">' + esc(x.about) + '</p>' : '') +
        (rows.length ? '<dl class="lb-sheet-dl">' + rows.map(([k, v]) => '<dt>' + esc(t(k)) + '</dt><dd>' + esc(v) + '</dd>').join('') + '</dl>' : '') +
      '</div>';
  }
  function openSheet(id, from) {
    const x = ITEMS[id];
    if (!x) return;
    const el = sheetEl();
    el.querySelector('.lb-sheet-body').innerHTML = sheetHtml(x);
    el.querySelector('.lb-sheet-x').setAttribute('aria-label', t('close'));
    el.querySelector('.lb-sheet-panel').scrollTop = 0;
    sheetFrom = from || null;
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('open');
    document.documentElement.classList.add('lb-lock');
    // 폰의 '뒤로'로도 닫히게
    if (!sheetPushed) { try { history.pushState({ lbSheet: 1 }, ''); sheetPushed = true; } catch (e) {} }
    el.querySelector('.lb-sheet-x').focus({ preventScroll: true });
  }
  function closeSheet(fromHistory) {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('open');
    document.documentElement.classList.remove('lb-lock');
    const el = sheet;
    setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, REDUCED ? 0 : 380);
    if (sheetPushed) { sheetPushed = false; if (!fromHistory) history.back(); }
    if (sheetFrom) sheetFrom.focus({ preventScroll: true });
  }
  window.addEventListener('popstate', () => { if (sheetPushed) { sheetPushed = false; closeSheet(true); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  /* ---------- 그리기 ---------- */
  function render() {
    const F = L.floor || 5;
    const P = L.photos && typeof L.photos === 'object' ? L.photos : {};
    const ig = L.instagram ? String(L.instagram).replace(/^@/, '') : '';
    const igUrl = ig ? 'https://www.instagram.com/' + ig + '/' : '';
    const tel = L.phone ? 'tel:' + String(L.phone).replace(/[^\d+]/g, '') : '';
    const mail = L.email ? 'mailto:' + String(L.email).trim() : '';
    // 대관 문의 길: 인스타 DM · 전화 · 메일 중 있는 것만
    const ways = [[igUrl, 'ig', 'viaIg'], [tel, 'phone', 'viaPhone'], [mail, 'email', 'viaEmail']].filter((w) => w[0]);
    let h = '';

    const st = openStatus();   // 오시는 길의 영업시간 칸에 "지금 영업 중"
    // 첫 화면: 표지 그림만, 잉크가 떨어진 바로 아래에서 "오늘 밤, 당신은 어떤 죄를…" 로 이어진다
    h += '<section class="lb-hero" id="top"><h1><img class="lb-hero-art" src="' + esc(A(B.cover)) + '" alt="Deadly Sins"></h1></section>';

    // 콘셉트 + 일곱 상징 + 포스터 벽
    h += '<section class="lb-sec lb-concept" id="concept">' +
      '<p class="lb-kicker lb-r">THE CONCEPT</p>' +
      '<h2 class="lb-r">' + t('conceptTitle') + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('conceptBody')) + '</p>' +
      '<ul class="lb-syms lb-r">' + SINS.map(([k, ko, en]) =>
        '<li><img src="' + esc(A((B.symbols || {})[k])) + '" alt=""><span>' + esc(lang === 'en' ? en : sinName(k)) + '</span></li>').join('') + '</ul>' +
      (P.wall ? '<figure class="lb-wide lb-r"><img src="' + esc(A(P.wall)) + '" alt="" loading="lazy"></figure>' : '') +
    '</section>';

    // 일곱 잔
    h += '<section class="lb-sec" id="seven">' +
      '<p class="lb-kicker lb-r">' + esc(t('sevenKicker')) + '</p>' +
      '<h2 class="lb-r">' + esc(t('sevenTitle')) + '</h2>' +
      '<p class="lb-note lb-r">' + esc(t('swipe')) + '</p>' +
      '<div class="lb-carousel lb-r" id="lbCarousel" tabindex="0">' + SINS.map(([k, ko, en]) => {
        const dr = (B.drinks || {})[k] || {}, d = D.drinks[k] || {};
        return '<article class="lb-card">' +
          '<div class="lb-card-art"><img src="' + esc(A(dr.image)) + '" alt="" loading="lazy"></div>' +
          '<p class="lb-card-sin"><img src="' + esc(A((B.symbols || {})[k])) + '" alt="">' + esc(lang === 'en' ? 'SIGNATURE' : sinName(k)) + '</p>' +
          '<h3>' + esc(en) + '</h3>' +
          '<p class="lb-card-ko">' + esc(lang === 'en' ? (d.style ? d.style.en : '') : drinkName(k, dr.kr)) + '</p>' +
          (d.style && lang !== 'en' ? '<p class="lb-chip">' + esc(L10(d.style)) + '</p>' : '') +
          (d.desc ? '<p class="lb-card-desc">' + esc(L10(d.desc)) + '</p>' : '') +
          ((SIG_FLAGS[k] || {}).soldOut ? '<p class="lb-card-sold">' + esc(t('soldOut')) + '</p>' : '') +
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

    // 바 안 풍경 + 대관 문의
    const room = Array.isArray(P.room) ? P.room.filter(Boolean) : [];
    h += '<section class="lb-sec" id="room"><p class="lb-kicker lb-r">' + t('roomKicker') + '</p><h2 class="lb-r">' + esc(t('roomTitle')) + '</h2>' +
      '<p class="lb-body lb-r">' + esc(t('roomBody')) + '</p>' +
      (room.length ? '<div class="lb-room">' + room.map((p) => '<figure class="lb-r"><img src="' + esc(A(p)) + '" alt="" loading="lazy"></figure>').join('') + '</div>' : '') +
      '<div class="lb-rent lb-r"><p class="lb-rent-title">' + esc(t('rental')) + '</p>' +
        (ways.length ? '<p>' + esc(t('rentalBody')) + '</p><div class="lb-rent-ways">' + ways.map(([href, via, label]) =>
          '<a class="lb-btn" href="' + esc(href) + '"' + (via === 'ig' ? ' target="_blank" rel="noopener"' : '') + ' data-act="rental" data-via="' + via + '">' + esc(t(label)) + '</a>').join('') + '</div>' : '') +
      '</div></section>';

    // 메뉴: 종류별 사진 격자
    h += '<section class="lb-sec lb-menu" id="menu">' +
      '<p class="lb-kicker lb-r">' + t('menuKicker') + '</p>' +
      '<h2 class="lb-r">' + esc(t('menuTitle')) + '</h2>' +
      '<p class="lb-note lb-r">' + esc(t('menuHint')) + '</p>' + menuHtml() +
    '</section>';

    // 오시는 길 · 시간 · 안내
    const maps = Array.isArray(L.maps) ? L.maps.filter((x) => x && x.url) : L.mapUrl ? [{ url: L.mapUrl }] : [];
    const dim = (o) => (o ? '<br><span class="lb-dim">' + esc(L10(o)) + '</span>' : '');
    const contact = [ig ? '<a href="' + esc(igUrl) + '" target="_blank" rel="noopener" data-act="instagram">@' + esc(ig) + '</a>' : '',
      tel ? '<a href="' + esc(tel) + '" data-act="phone">' + esc(L.phone) + '</a>' : '',
      mail ? '<a href="' + esc(mail) + '" data-act="email">' + esc(L.email) + '</a>' : ''].filter(Boolean);
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
        (hoursHtml() ? '<dt>' + esc(t('hours')) + '</dt><dd>' + (L.notice && L10(L.notice) ? '<p class="lb-notice">' + esc(L10(L.notice)) + '</p>' : '') +
          (st ? '<p class="lb-status' + (st.open ? ' is-open' : '') + '"><i></i>' + esc(st.text) + '</p>' : '') + hoursHtml() + '</dd>' : '') +
        '<dt>' + esc(t('good')) + '</dt><dd>' + esc(t('noCover')) + '<br>' + esc(t('rental')) + '</dd>' +
        (contact.length ? '<dt>' + esc(t('contact')) + '</dt><dd>' + contact.join('<br>') + '</dd>' : '') +
      '</dl>' +
      (L.offer ? '<p class="lb-offer lb-r">' + esc(L10(L.offer)) + '</p>' : '') +
    '</section>';

    h += '<footer class="lb-foot"><img src="' + esc(A(B.wordmark)) + '" alt="Deadly Sins"><p>' + F + 'F · COCKTAIL &amp; WHISKY BAR</p></footer>';

    ROOT.innerHTML = h;
    DOCK.innerHTML = '<a href="#menu" class="lb-dock-menu" data-act="menu">' + esc(t('dockMenu')) + '</a>' +
      '<a href="#way" class="lb-dock-way" data-act="way">' + esc(t('dockWay')) + ' · ' + F + 'F</a>';
    DOCK.setAttribute('aria-label', t('dockLabel'));
    document.documentElement.lang = HTML_LANG[lang];
    document.getElementById('lbLang').innerHTML = LANGS.map((l) => '<button type="button" data-act="lang" data-lang="' + l + '" lang="' + HTML_LANG[l] + '"' +
      (l === lang ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + '>' + LANG_LABEL[l] + '</button>').join('');
    motion();
  }

  /* ---------- 움직임 ---------- */
  let io = null, heroIo = null, catIo = null, topBound = false;
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
      // 아래 바로가기 막대는 첫 화면을 벗어나면
      heroIo = new IntersectionObserver(([e]) => { DOCK.classList.toggle('show', !e.isIntersecting); }, { threshold: 0.15 });
      heroIo.observe(hero);
    }
    // 메뉴 종류 칸: 지금 보고 있는 종류에 불
    if (catIo) catIo.disconnect();
    const chips = ROOT.querySelectorAll('.lb-cats a');
    if (chips.length && 'IntersectionObserver' in window) {
      catIo = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          chips.forEach((c) => {
            const on = c.getAttribute('href') === '#' + e.target.id;
            c.classList.toggle('on', on);
            if (on && c.parentNode.scrollWidth > c.parentNode.clientWidth) c.parentNode.scrollTo({ left: c.offsetLeft - 22, behavior: REDUCED ? 'auto' : 'smooth' });
          });
        });
      }, { rootMargin: '-90px 0px -65% 0px' });
      ROOT.querySelectorAll('.lb-cat').forEach((el) => catIo.observe(el));
    }
    // 위의 MENU · EN 은 맨 위에서만 (조금이라도 내리면 첫 화면 글자 위로 지나가므로 숨김)
    if (!topBound) { topBound = true; const f = () => TOP.classList.toggle('hide', window.scrollY > 40); window.addEventListener('scroll', f, { passive: true }); f(); }
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

  /* ---------- 기록: 배너 QR 로 몇 명이 들어와서 메뉴 · 오시는 길 · 인스타 · 대관 문의를 눌렀는지 ---------- */
  const SID = Math.random().toString(36).slice(2, 10);
  function track(type, data) {
    if (D.collect && D.collect.enabled === false) return;
    try {
      // auto: 자동 조종되는 브라우저(배포 미리보기 봇 · 검사 도구) 표시 → 서버가 통계에 넣지 않는다
      const body = new Blob([JSON.stringify(Object.assign({ sid: SID, type, lang, from: 'promo' }, navigator.webdriver ? { auto: 1 } : null, data || {}))], { type: 'text/plain;charset=utf-8' });
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
    if (e.target.closest('[data-close]')) { closeSheet(); return; }
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const act = a.getAttribute('data-act');
    if (act === 'item') {
      const id = a.getAttribute('data-id');
      openSheet(id, a);
      track('visit', { act, id });
      return;
    }
    if (act === 'lang') {
      const to = a.getAttribute('data-lang');
      if (!LANGS.includes(to) || to === lang) return;
      lang = to;
      try { localStorage.setItem('ds_lang', lang); } catch (err) {}
      closeSheet();
      render();
      return;
    }
    const href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#') { e.preventDefault(); goTo(href.slice(1)); }
    track('visit', a.dataset.via ? { act, via: a.dataset.via } : { act });
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
