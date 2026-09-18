#!/usr/bin/env node
/* =============================================================
   결과 쏠림 검증기   실행:  node tools/simulate.js
   질문이나 가중치를 고친 뒤에는 반드시 이걸 돌려보세요.

   사람은 선택지를 고르게 찍지 않습니다. 듣기 좋은 쪽,
   자기 이미지가 상하지 않는 쪽으로 기웁니다. 그래서 균등 랜덤만이
   아니라 "실제 사람처럼 편향된" 응답자들도 같이 돌려서,
   그래도 일곱 잔이 고루 나오는지를 봅니다.
   ============================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const G = new Function(
  fs.readFileSync(path.join(ROOT, 'public/data.js'), 'utf8') +
  '; return {SINS,QUESTIONS,SIN_ORDER};'
)();
const { scoreAnswers, sinCeilings } = require(path.join(ROOT, 'public/scoring.js'));
const Q = G.QUESTIONS, ORDER = G.SIN_ORDER;

/* 선택지별 "고르고 싶은 정도" 추정치 (1~5).
   근거: 자기 이미지가 상하는 선택지(질투 행동, 공격적 표현)는 낮게,
   미감이 좋고 사회적으로 무해한 선택지는 높게 잡았습니다.
   어디까지나 가정이며, 최악을 가정한 스트레스 테스트용입니다. */
const APPEAL = {
  q1:  [3.5, 3.2, 2.5, 3.0],
  q2:  [3.2, 2.8, 2.8, 3.6],
  q3:  [3.6, 3.2, 3.0, 2.2],
  q4:  [2.6, 3.6, 3.2, 2.9],
  q5:  [3.0, 3.4, 3.4, 3.0],
  q6:  [3.0, 3.2, 2.6, 3.4],
  q7:  [2.8, 2.8, 3.6, 3.2],
  q8:  [3.2, 3.4, 3.4, 2.4],
  q9:  [3.2, 3.4, 3.0, 2.8],
  q10: [3.2, 3.4, 2.8, 2.6]
};

function softmaxPick(weights, temp) {
  const ex = weights.map((w) => Math.exp(w / temp));
  const sum = ex.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  for (let i = 0; i < ex.length; i++) { r -= ex[i]; if (r <= 0) return i; }
  return ex.length - 1;
}

/* 응답자 모델 --------------------------------------------------- */
const MODELS = {
  '균등 랜덤': function () {
    return Q.map((q) => Math.floor(Math.random() * q.options.length));
  },
  '듣기 좋은 쪽 (약)': function () {
    return Q.map((q) => softmaxPick(APPEAL[q.id], 1.2));
  },
  '듣기 좋은 쪽 (강)': function () {
    return Q.map((q) => softmaxPick(APPEAL[q.id], 0.45));
  },
  '첫 선택지 편향 + 섞기': function () {
    /* 앞쪽 선택지를 선호하지만, 앱이 매 세션 순서를 섞으므로
       그 편향이 특정 죄로 흘러가지 않아야 한다. */
    return Q.map((q) => {
      const perm = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      const posPref = [3.4, 2.9, 2.6, 2.3];
      const pos = softmaxPick(posPref, 0.8);
      return perm[pos];
    });
  },
  /* 아래 둘은 "일관형": 한 성향만 계속 고르는 사람이라
     한 죄로 몰리는 것이 정상입니다(도구가 작동한다는 증거). 합격 판정에서는 제외. */
  '조용한 사람 (일관형)': function () {
    /* 자극이 낮은 쪽을 일관되게 고르는 사람 */
    return Q.map((q) => {
      const calm = q.options.map((o) => (o.w.sloth || 0) + (o.w.lust || 0) * 0.5 + 1);
      return softmaxPick(calm, 0.8);
    });
  },
  '센 사람 (일관형)': function () {
    return Q.map((q) => {
      const hot = q.options.map((o) => (o.w.wrath || 0) + (o.w.greed || 0) * 0.5 + 1);
      return softmaxPick(hot, 0.8);
    });
  }
};


/* 진단: 죄별 평균 매력도 --------------------------------------
   어떤 죄가 "고르기 싫은 선택지"에만 실려 있으면 그 죄는 굶습니다.
   모든 죄의 평균 매력도가 서로 ±0.3 안쪽이어야 안전합니다. */
function appealDiagnostic() {
  const num = {}, den = {};
  ORDER.forEach((s) => { num[s] = 0; den[s] = 0; });
  Q.forEach((q) => q.options.forEach((o, i) => {
    Object.keys(o.w).forEach((s) => { num[s] += o.w[s] * APPEAL[q.id][i]; den[s] += o.w[s]; });
  }));
  const rows = ORDER.map((s) => ({ s: s, v: num[s] / den[s] })).sort((a, b) => b.v - a.v);
  console.log('\n■ 죄별 평균 매력도 (선택지 매력도를 가중치로 평균)');
  rows.forEach((r) => console.log('   ' + r.s.padEnd(9) + r.v.toFixed(2)));
  console.log('   격차 ' + (rows[0].v - rows[rows.length - 1].v).toFixed(2) + '  (0.30 이하 권장)');
}
appealDiagnostic();

/* 실행 --------------------------------------------------------- */
const N = 40000;
const ceil = sinCeilings(Q, ORDER);
console.log('문항 수:', Q.length, '| 죄별 만점:', ORDER.map((s) => s + ' ' + ceil[s]).join('  '));

let worst = { model: null, spread: 0 };
let fails = [];
Object.keys(MODELS).forEach((name) => {
  const consistent = name.indexOf('일관형') >= 0;
  const count = {}; ORDER.forEach((s) => (count[s] = 0));
  for (let i = 0; i < N; i++) count[scoreAnswers(MODELS[name](), Q, ORDER).top]++;

  const rows = ORDER.map((s) => ({ s: s, pct: (100 * count[s]) / N })).sort((a, b) => b.pct - a.pct);
  const max = rows[0].pct, min = rows[rows.length - 1].pct;
  if (!consistent && max - min > worst.spread) worst = { model: name, spread: max - min };
  if (!consistent && (max > 30 || min < 5)) fails.push(name);

  const bar = (p) => '█'.repeat(Math.round(p / 1.2));
  console.log('\n■ ' + name + '   최다 ' + max.toFixed(1) + '%  최소 ' + min.toFixed(1) + '%' +
    (consistent ? '   (쏠림이 정상인 모델)' : ''));
  rows.forEach((r) => console.log('   ' + r.s.padEnd(9) + r.pct.toFixed(1).padStart(5) + '%  ' + bar(r.pct)));
});

console.log('\n─────────────────────────────────────────────');
console.log('판정 기준: 일반 응답자 모델에서 한 죄가 30%를 넘지 않고, 5% 아래로 떨어지지 않을 것.');
console.log('가장 쏠린 일반 모델: ' + worst.model + ' (최다-최소 격차 ' + worst.spread.toFixed(1) + '%p)');
console.log(fails.length ? '결과: 실패 — ' + fails.join(', ') : '결과: 통과 ✓');
console.log('※ "일관형"은 한 성향만 계속 고르는 사람이라 한 죄로 몰리는 것이 정상입니다.');
