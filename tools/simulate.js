#!/usr/bin/env node
/* =============================================================
   설문 구조 · 결과 쏠림 검증기 (설문 v2 — public/quiz.js)
     node tools/simulate.js

   1. 구조: 균형 배치인지 센다 — 하나라도 어기면 종료 코드 1
        · 7문항, 문항마다 서로 다른 죄 4개, 한국어 · 영어 · 중국어 문구가 모두 있을 것
        · 일곱 죄가 각각 정확히 4문항에 나올 것
        · 어떤 두 죄든 정확히 2문항에서 맞붙을 것 (21쌍 모두)
        · 예비 문항은 바꿔 끼울 문항과 죄 구성이 같을 것
   2. 결과 분포: 사이트와 같은 채점(선택지 하나 = 죄 하나 = 1점, 동점은 규칙대로)으로 가상의 손님을 돌린다.
      완전 균등이면 각 죄가 14.3% 입니다.
        · 판정: 네 답을 똑같은 확률로 고르는 손님 → 어떤 죄도 17% 를 넘거나 12% 아래로 가지 않을 것
        · 판정: 탐욕 · 나태 쪽 답이 더 끌리는 손님(보수적 가정)에 "덜 나온 죄 우선"을 적용 → 22% 이하, 8% 이상
        · 참고(판정 안 함): 같은 손님에 무작위 동점 처리, 훨씬 치우친 손님

   동점 처리
     recent : 최근 결과 100건에서 적게 나온 죄가 이김 (api/track.js ?order=1 과 같은 순서 규칙)
     random : 세션마다 무작위 (서버 순서를 못 받았을 때 사이트가 쓰는 방식)
   난수는 씨앗이 고정돼 있어서 돌릴 때마다 같은 숫자가 나옵니다.
   ============================================================= */
'use strict';
const path = require('path');

global.window = {};
require(path.join(__dirname, '..', 'public', 'quiz.js'));
const QUIZ = global.window.DS_QUIZ;
const SINS = ['교', '질', '분', '나', '탐', '식', '색'];
const NAME = { 교: '교만', 질: '질투', 분: '분노', 나: '나태', 탐: '탐욕', 식: '탐식', 색: '색욕' };

const fails = [];
const check = (ok, what, detail) => {
  console.log(`${ok ? '  ✓' : '  ✗'} ${what}${!ok && detail !== undefined ? '  → ' + JSON.stringify(detail) : ''}`);
  if (!ok) fails.push(what);
};

/* ---------- 1. 구조 ---------- */
console.log(`public/quiz.js · 설문 ${QUIZ.version} · ${QUIZ.questions.length}문항`);
console.log('\n■ 구조 (균형 배치)');
const Q = QUIZ.questions;
const HANGUL = /[가-힣]/;
const wellFormed = (q) => q && q.q && q.q.ko && q.q.en && q.q.zh && !HANGUL.test(q.q.en + q.q.zh) && Array.isArray(q.a) && q.a.length === 4 &&
  q.a.every((o) => SINS.includes(o.sin) && o.ko && o.en && o.zh && !HANGUL.test(o.en + o.zh)) && new Set(q.a.map((o) => o.sin)).size === 4;
check(/^v\d{1,3}$/.test(QUIZ.version), '설문 버전 표시 (v숫자)', QUIZ.version);
check(Q.length === 7 && Q.every(wellFormed), '7문항 · 문항마다 서로 다른 죄 4개 · 한국어 · 영어 · 중국어 문구');
const appear = {}, pair = {};
SINS.forEach((k) => { appear[k] = 0; });
Q.forEach((q) => {
  const s = q.a.map((o) => o.sin);
  s.forEach((k) => { appear[k]++; });
  for (let a = 0; a < s.length; a++) for (let b = a + 1; b < s.length; b++) { const key = [s[a], s[b]].sort().join(''); pair[key] = (pair[key] || 0) + 1; }
});
check(SINS.every((k) => appear[k] === 4), '일곱 죄가 각각 4문항에 나옴', appear);
check(Object.keys(pair).length === 21 && Object.values(pair).every((n) => n === 2), '어떤 두 죄든 정확히 2문항에서 맞붙음 (21쌍)', pair);
const sinsOf = (q) => q.a.map((o) => o.sin).sort().join('');
check((QUIZ.spares || []).every((sp) => wellFormed(sp) && Q[sp.replaces - 1] && sinsOf(sp) === sinsOf(Q[sp.replaces - 1])),
  `예비 문항 ${(QUIZ.spares || []).length}개: 바꿔 끼울 문항과 죄 구성이 같음`, (QUIZ.spares || []).map((sp) => sp.replaces + ':' + (wellFormed(sp) ? sinsOf(sp) : '형식 오류')));
// 문구 길이 (참고): 한 문항 안에서 가장 긴 답이 가장 짧은 답의 두 배를 넘으면 눈에 띄어 선택률이 달라질 수 있다
Q.forEach((q, i) => {
  const len = q.a.map((o) => o.ko.length), ratio = Math.max(...len) / Math.min(...len);
  if (ratio > 2) console.log(`    참고: ${i + 1}번 문항의 답 길이 차이가 큼 (${Math.min(...len)}~${Math.max(...len)}자)`);
});

/* ---------- 2. 결과 분포 ---------- */
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffled(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// 손님 한 명: 문항마다 죄별 끌림(weight)에 비례해 답을 고른다. 선택지 순서는 섞여 나오므로 자리 습관은 결과에 영향이 없다.
function guest(r, weight) {
  const pts = {}; SINS.forEach((k) => { pts[k] = 0; });
  Q.forEach((q) => {
    const w = q.a.map((o) => weight[o.sin]); let u = r() * w.reduce((a, b) => a + b, 0), j = 0;
    for (; j < w.length - 1; j++) { u -= w[j]; if (u <= 0) break; }
    pts[q.a[j].sin]++;
  });
  return pts;
}
// 서버(api/track.js tieOrder)와 같은 규칙: 최근 100건에서 적게 나온 죄가 앞, 같으면 더 오래전에 나온 죄가 앞
function recentOrder(hist) {
  const last = hist.slice(-100), n = {}, at = {};
  SINS.forEach((k) => { n[k] = 0; at[k] = -1; });
  last.forEach((k, i) => { n[k]++; at[k] = i; });
  return SINS.slice().sort((a, b) => n[a] - n[b] || at[a] - at[b] || SINS.indexOf(a) - SINS.indexOf(b));
}
function run(name, weight, tie, limits) {
  const r = rng(20261121), RUNS = 60000, c = {}, hist = [];
  SINS.forEach((k) => { c[k] = 0; });
  let ties = 0;
  for (let i = 0; i < RUNS; i++) {
    const pts = guest(r, weight), top = Math.max(...SINS.map((k) => pts[k]));
    const order = tie === 'recent' ? recentOrder(hist) : shuffled(SINS, r);
    const tied = SINS.filter((k) => pts[k] === top);
    const winner = order.find((k) => tied.includes(k));
    if (tied.length > 1) ties++;
    c[winner]++; hist.push(winner);
    if (hist.length > 400) hist.splice(0, 200);
  }
  const rows = SINS.map((k) => ({ k, p: 100 * c[k] / RUNS })).sort((a, b) => b.p - a.p), max = rows[0].p, min = rows[6].p;
  console.log(`\n■ ${name} · 동점 처리 ${tie === 'recent' ? '덜 나온 죄 우선' : '무작위'}   최다 ${max.toFixed(1)}%  최소 ${min.toFixed(1)}%  동점 ${(100 * ties / RUNS).toFixed(1)}%`);
  rows.forEach((x) => console.log(`   ${NAME[x.k]} ${x.p.toFixed(1).padStart(5)}%  ${'█'.repeat(Math.round(x.p / 1.2))}`));
  if (limits) check(max <= limits[1] && min >= limits[0], `판정: 모든 죄가 ${limits[0]}~${limits[1]}% 안`, { max: +max.toFixed(1), min: +min.toFixed(1) });
  else console.log('    (참고용 — 판정하지 않음)');
}
const even = { 교: 1, 질: 1, 분: 1, 나: 1, 탐: 1, 식: 1, 색: 1 };
// 보수적 가정: 새로 써도 탐욕 · 나태 쪽 답이 조금 더 끌리고 분노 · 교만 · 질투가 덜 끌림 (재설계 보고서의 "보수적" 경우와 같은 크기)
const tilted = { 교: Math.exp(-0.25), 질: Math.exp(-0.20), 분: Math.exp(-0.40), 나: Math.exp(0.25), 탐: Math.exp(0.35), 식: Math.exp(0.10), 색: Math.exp(0.15) };
const skewed = { 교: Math.exp(-0.5), 질: Math.exp(-0.4), 분: Math.exp(-0.8), 나: Math.exp(0.5), 탐: Math.exp(0.7), 식: Math.exp(0.2), 색: Math.exp(0.3) };
run('네 답을 똑같은 확률로 고르는 손님', even, 'random', [12, 17]);
run('네 답을 똑같은 확률로 고르는 손님', even, 'recent', [12, 17]);
run('탐욕 · 나태 쪽 답이 더 끌리는 손님 (보수적 가정)', tilted, 'recent', [8, 22]);
run('탐욕 · 나태 쪽 답이 더 끌리는 손님 (보수적 가정)', tilted, 'random', null);
run('훨씬 치우친 손님 (문항을 고쳐 써야 하는 경우)', skewed, 'recent', null);

console.log('\n' + (fails.length ? `결과: 실패 ${fails.length}건 — ${fails.join(' / ')}` : '결과: 통과 ✓'));
process.exitCode = fails.length ? 1 : 0;
