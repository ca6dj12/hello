/* =============================================================
   채점 — 각 죄가 "자기 만점 대비 몇 %를 받았는지"로 겨룬다.
   문항 수를 늘리거나 가중치를 손봐도 특정 죄가 과대표되지 않는다.
   ============================================================= */

function sinCeilings(questions, sinOrder) {
  const max = {};
  sinOrder.forEach((s) => (max[s] = 0));
  questions.forEach((q) => {
    sinOrder.forEach((s) => {
      let best = 0;
      q.options.forEach((o) => { if ((o.w[s] || 0) > best) best = o.w[s] || 0; });
      max[s] += best;
    });
  });
  return max;
}

/* answers: 문항 순서대로의 선택지 index 배열 */
function scoreAnswers(answers, questions, sinOrder) {
  const ceil = sinCeilings(questions, sinOrder);
  const raw = {}, sensory = {};
  sinOrder.forEach((s) => { raw[s] = 0; sensory[s] = 0; });

  questions.forEach((q, i) => {
    const opt = q.options[answers[i]];
    if (!opt) return;
    Object.entries(opt.w).forEach(([sin, v]) => {
      raw[sin] += v;
      if (q.sensory) sensory[sin] += v;
    });
  });

  const ranked = sinOrder
    .map((sin) => ({ sin, raw: raw[sin], sensory: sensory[sin], norm: raw[sin] / ceil[sin] }))
    .sort((a, b) =>
      b.norm - a.norm ||
      b.sensory - a.sensory ||
      b.raw - a.raw ||
      sinOrder.indexOf(a.sin) - sinOrder.indexOf(b.sin)
    );

  return { ranked, top: ranked[0].sin, second: ranked[1].sin };
}

if (typeof module !== 'undefined') module.exports = { sinCeilings, scoreAnswers };
