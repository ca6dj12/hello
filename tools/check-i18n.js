#!/usr/bin/env node
/* =============================================================
   번역 빠짐 검사 (한국어 · English · 中文 · 日本語)
     node tools/check-i18n.js

   새 문구를 한국어로만 넣고 영어 · 중국어 · 일본어를 빠뜨리면 여기서 걸린다. 하나라도 어긋나면 종료 코드 1.
     · data.js · stories.js: { ko: … } 가 있는 곳마다 en · zh · ja 가 있을 것
         (위스키 병 이름은 예외 — 병에 적힌 영어 이름을 중국어 · 일본어 화면에서도 그대로 쓴다)
     · quiz.js: 문항 · 선택지 · 예비 문항마다 en · zh · ja
     · i18n.js: 영어 화면 문구(en.ui)마다 중국어 · 일본어, 성향 49개, 죄 이름 · 술 이름 · 한마디
     · 번역에 한글이 섞이지 않을 것, 중국어에 번체자가 섞이지 않을 것(자주 틀리는 글자만),
       일본어의 긴 문장(12자 이상)에는 가나가 있을 것 (중국어를 잘못 붙여 넣은 것 잡기)
   ============================================================= */
'use strict';
const path = require('path');
global.window = {};
['data.js', 'stories.js', 'i18n.js', 'quiz.js'].forEach((f) => require(path.join(__dirname, '..', 'public', f)));
const { DS_DATA: DATA, DS_STORIES: STORIES, DS_I18N: I18N, DS_QUIZ: QUIZ } = global.window;

const HANGUL = /[가-힣]/;
const KANA = /[\u3040-\u30ff]/;
const notJapanese = (v) => typeof v === 'string' && v.replace(/[A-Za-z0-9'’.\s·,&()\-]/g, '').length >= 12 && !KANA.test(v);   // 긴데 가나가 하나도 없음
// 간체 화면에 섞이면 안 되는 번체자 (흔히 섞여 들어오는 것들)
const TRADITIONAL = /[麼為這個們來時會說對還沒過種點從開關學體聲雞飲醬龍歲禮藝愛曖樂氣風點擊壞邊遠嗎請讓選擇題結價錢韓網圖號碼買賣農質際號聽親隻雙團圓廳樓層園區廣場]/;
const fails = [];
const check = (ok, what, detail) => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${what}${!ok && detail !== undefined ? '  → ' + JSON.stringify(detail).slice(0, 400) : ''}`);
  if (!ok) fails.push(what);
};

// { ko, en, zh } 묶음을 모두 찾는다
function pairs(o, p, out) {
  if (Array.isArray(o)) { o.forEach((x, i) => pairs(x, p + '.' + i, out)); return out; }
  if (o && typeof o === 'object') {
    if (typeof o.ko === 'string') { out.push({ path: p.replace(/^\./, ''), o }); return out; }
    Object.keys(o).forEach((k) => pairs(o[k], p + '.' + k, out));
  }
  return out;
}
const bottleName = (p) => /^menu\.(whisky\.\d+\.items|final\.items)\.\d+$/.test(p);   // 병 이름: 중국어 없이 영어 그대로
const bad = (list, f) => list.filter(f).map((x) => x.path);

console.log('■ 메뉴 · 가게 안내 (public/data.js)');
const d = pairs(DATA, '', []);
check(bad(d, (x) => !x.o.en || !String(x.o.en).trim()).length === 0, `한국어 문구 ${d.length}개마다 영어`, bad(d, (x) => !x.o.en));
check(bad(d, (x) => !bottleName(x.path) && (!x.o.zh || !x.o.ja)).length === 0, '위스키 병 이름을 뺀 문구마다 중국어 · 일본어', bad(d, (x) => !bottleName(x.path) && (!x.o.zh || !x.o.ja)));
check(bad(d, (x) => HANGUL.test((x.o.en || '') + (x.o.zh || '') + (x.o.ja || ''))).length === 0, '번역에 한글이 섞이지 않음', bad(d, (x) => HANGUL.test((x.o.en || '') + (x.o.zh || '') + (x.o.ja || ''))));
check(bad(d, (x) => notJapanese(x.o.ja)).length === 0, '일본어 문장에 가나가 있음 (중국어가 잘못 들어가지 않음)', bad(d, (x) => notJapanese(x.o.ja)));
check(bad(d, (x) => TRADITIONAL.test(x.o.zh || '')).length === 0, '중국어는 간체자', bad(d, (x) => TRADITIONAL.test(x.o.zh || '')));

console.log('\n■ 술 이야기 (public/stories.js)');
const s = pairs(STORIES, '', []);
check(bad(s, (x) => !x.o.en || !x.o.zh || !x.o.ja).length === 0, `문구 ${s.length}개마다 영어 · 중국어 · 일본어`, bad(s, (x) => !x.o.en || !x.o.zh || !x.o.ja));
const badS = (x) => HANGUL.test((x.o.en || '') + (x.o.zh || '') + (x.o.ja || '')) || TRADITIONAL.test(x.o.zh || '') || notJapanese(x.o.ja);
check(bad(s, badS).length === 0, '한글이 섞이지 않음 · 중국어는 간체자 · 일본어에 가나', bad(s, badS));

console.log('\n■ 설문 (public/quiz.js)');
const q = [];
[...QUIZ.questions, ...(QUIZ.spares || [])].forEach((x, i) => { q.push({ path: 'q' + (i + 1), o: x.q }); x.a.forEach((o) => q.push({ path: 'q' + (i + 1) + '.' + o.sin, o })); });
check(bad(q, (x) => !x.o.ko || !x.o.en || !x.o.zh || !x.o.ja).length === 0, `문항 · 선택지 ${q.length}개마다 한국어 · 영어 · 중국어 · 일본어`, bad(q, (x) => !x.o.ko || !x.o.en || !x.o.zh || !x.o.ja));
const badQ = (x) => HANGUL.test(x.o.en + x.o.zh + x.o.ja) || TRADITIONAL.test(x.o.zh) || !KANA.test(x.o.ja);
check(bad(q, badQ).length === 0, '한글이 섞이지 않음 · 중국어는 간체자 · 일본어에 가나', bad(q, badQ));

console.log('\n■ 화면 문구 (public/i18n.js)');
const en = I18N.en, zh = I18N.zh || {}, ja = I18N.ja || {};
const missUi = Object.keys(en.ui).filter((k) => (zh.ui || {})[k] === undefined || (ja.ui || {})[k] === undefined);
check(missUi.length === 0, `영어 화면 문구 ${Object.keys(en.ui).length}개마다 중국어 · 일본어`, missUi);
const fnKeys = Object.keys(en.ui).filter((k) => typeof en.ui[k] === 'function');
check(fnKeys.every((k) => typeof zh.ui[k] === 'function' && typeof ja.ui[k] === 'function'), '값을 끼워 넣는 문구(가격 · 공유 글)는 중국어 · 일본어도 함수', fnKeys.filter((k) => typeof zh.ui[k] !== 'function' || typeof ja.ui[k] !== 'function'));
const traitKeys = Object.keys(en.traits);
const missTraits = traitKeys.filter((k) => [zh, ja].some((L) => !(L.traits || {})[k] || ['love', 'work', 'sex'].some((f) => !L.traits[k][f])));
check(traitKeys.length === 49 && missTraits.length === 0, '성향 49개(단일 7 + 순서쌍 42) 모두 중국어 · 일본어', missTraits);
const KEYS = ['교', '질', '분', '나', '탐', '식', '색'];
check([zh, ja].every((L) => KEYS.every((k) => (L.sins || {})[k] && (L.drinkName || {})[k]) && (L.reactions || []).length === en.reactions.length && Object.keys(en.aria).every((k) => (L.aria || {})[k])),
  '죄 이름 · 술 이름 · 한마디 · 화면낭독 이름표 (중국어 · 일본어)');
const flat = (o) => (typeof o === 'string' ? [o] : typeof o === 'function' ? [String(o('X', 'Y'))] : Array.isArray(o) ? [].concat(...o.map(flat)) : o && typeof o === 'object' ? [].concat(...Object.values(o).map(flat)) : []);
const zhAll = flat(zh), jaAll = flat(ja), enAll = flat(en);
check(![...zhAll, ...jaAll, ...enAll].some((x) => HANGUL.test(x)), '영어 · 중국어 · 일본어 문구에 한글이 섞이지 않음', [...zhAll, ...jaAll, ...enAll].filter((x) => HANGUL.test(x)).slice(0, 5));
check(!jaAll.some(notJapanese), '일본어 긴 문장에 가나가 있음', jaAll.filter(notJapanese).slice(0, 5));
check(!zhAll.some((x) => TRADITIONAL.test(x)), '중국어는 간체자', zhAll.filter((x) => TRADITIONAL.test(x)).slice(0, 5));

console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건 — ${fails.join(' / ')}` : '결과: 통과 ✓'));
process.exitCode = fails.length ? 1 : 0;
