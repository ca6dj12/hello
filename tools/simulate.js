#!/usr/bin/env node
/* =============================================================
   결과 쏠림 검증기
     node tools/simulate.js                  ← 배포본(public/index.html) 검사
     node tools/simulate.js source/deadly_sins.html --legacy   ← 원본 방식 그대로

   사이트와 똑같은 채점을 재현해서, 여러 유형의 응답자를 수만 명씩 돌려 봅니다.
   완전 균등이면 각 죄가 14.3% 입니다.

   판정 (일반 응답자 모델 기준) — 하나라도 어기면 종료 코드 1
     · 어떤 죄도 25% 를 넘지 않을 것
     · 어떤 죄도 7% 아래로 떨어지지 않을 것
   "일관형"(한 자리만 계속 누르는 사람)은 판정에서 빼지만 숫자는 보여 줍니다.

   --legacy : 원본 채점(동점이면 SINS 배열 순서, 보기 섞지 않음)
   기본     : 개선된 채점(enhance.js 와 동일)
             동점 → 3점짜리로 받은 횟수 → 2점짜리 횟수 → 무작위
             보기 순서는 매 세션 섞음
   ============================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const LEGACY = args.includes('--legacy');
const file = args.find((a) => !a.startsWith('--')) || path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const QUESTIONS = JSON.parse(html.match(/const QUESTIONS=(\[.*?\]);/s)[1]);
const SINS = ['교', '질', '분', '나', '탐', '식', '색'];
const NAME = { 교: '교만', 질: '질투', 분: '분노', 나: '나태', 탐: '탐욕', 식: '탐식', 색: '색욕' };
const N = QUESTIONS.length;

const parse = (p) => p.split(' · ').map((s) => [s[0], Number(s.slice(-1))]);
/* 정확한 셔플 (Fisher–Yates). sort(() => Math.random() - 0.5) 는 편향돼서 쓰면 안 된다. */
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const OPTS = QUESTIONS.map((q) => q.a.map((o) => parse(o.points)));

/* ---------- 채점 ---------- */
function score(picks) {            // picks: 문항별 "원래" 선택지 번호
  const pts = {}, p3 = {}, p2 = {};
  SINS.forEach((k) => { pts[k] = 0; p3[k] = 0; p2[k] = 0; });
  picks.forEach((j, i) => OPTS[i][j].forEach(([k, v]) => {
    pts[k] += v; if (v === 3) p3[k]++; if (v === 2) p2[k]++;
  }));
  const top = Math.max(...SINS.map((k) => pts[k]));
  const tied = SINS.filter((k) => pts[k] === top);
  let winner;
  if (LEGACY) winner = tied[0];                       // 배열 순서
  else {
    const order = shuffled(SINS);
    winner = SINS.slice().sort((a, b) =>
      pts[b] - pts[a] || p3[b] - p3[a] || p2[b] - p2[a] || order.indexOf(a) - order.indexOf(b))[0];
  }
  return { winner, tie: tied.length > 1 };
}

/* ---------- 응답자 모델 ---------- */
// 화면에 보이는 자리(0=A … 3=D)를 고르는 습관 → 실제 선택지 번호로 바꾼다
function viaPosition(posPick) {
  return QUESTIONS.map((q) => {
    const perm = LEGACY ? [0, 1, 2, 3] : shuffled([0, 1, 2, 3]);
    return perm[posPick()];
  });
}
function softmax(w, t) {
  const e = w.map((x) => Math.exp(x / t)); let r = Math.random() * e.reduce((a, b) => a + b, 0);
  for (let i = 0; i < e.length; i++) { r -= e[i]; if (r <= 0) return i; } return e.length - 1;
}
const MODELS = [
  ['균등 랜덤', () => viaPosition(() => Math.floor(Math.random() * 4)), false],
  ['위쪽 보기 선호', () => viaPosition(() => softmax([3.4, 2.9, 2.6, 2.3], 0.8)), false],
  ['아래쪽 보기 선호', () => viaPosition(() => softmax([2.3, 2.6, 2.9, 3.4], 0.8)), false],
  ['늘 A만 (일관형)', () => viaPosition(() => 0), true],
  ['늘 D만 (일관형)', () => viaPosition(() => 3), true],
];

/* ---------- 구조 지표 ---------- */
const mass = {}, prim = {};
SINS.forEach((k) => { mass[k] = 0; prim[k] = 0; });
OPTS.forEach((q) => q.forEach((o) => o.forEach(([k, v]) => { mass[k] += v; if (v === 3) prim[k]++; })));
console.log(`${path.relative(process.cwd(), file)} · ${N}문항 · 채점: ${LEGACY ? '원본(배열 순서 동점, 섞지 않음)' : '개선(동점 규칙 + 보기 섞기)'}`);
console.log('\n■ 죄별 총 배점 / 주 선택지(3점) 개수');
SINS.forEach((k) => console.log(`   ${NAME[k]}  ${String(mass[k]).padStart(3)}점  3점짜리 ${prim[k]}개  ${'█'.repeat(mass[k])}`));

/* ---------- 결과 분포 ---------- */
const RUNS = 60000;
let fails = [];
MODELS.forEach(([name, fn, consistent]) => {
  const c = {}; SINS.forEach((k) => (c[k] = 0)); let ties = 0;
  for (let i = 0; i < RUNS; i++) { const r = score(fn()); c[r.winner]++; if (r.tie) ties++; }
  const rows = SINS.map((k) => ({ k, p: (100 * c[k]) / RUNS })).sort((a, b) => b.p - a.p);
  const max = rows[0].p, min = rows[6].p;
  if (!consistent && (max > 25 || min < 7)) fails.push(name);
  console.log(`\n■ ${name}   최다 ${max.toFixed(1)}%  최소 ${min.toFixed(1)}%  동점 ${(100 * ties / RUNS).toFixed(1)}%${consistent ? '  (일관형: 판정 제외)' : ''}`);
  rows.forEach((r) => console.log(`   ${NAME[r.k]} ${r.p.toFixed(1).padStart(5)}%  ${'█'.repeat(Math.round(r.p / 1.2))}`));
});

console.log('\n' + (fails.length ? `결과: 실패 — ${fails.join(', ')}` : '결과: 통과 ✓  (일반 모델에서 최다 ≤ 25%, 최소 ≥ 7%)'));
process.exitCode = fails.length ? 1 : 0;
