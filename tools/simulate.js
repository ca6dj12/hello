#!/usr/bin/env node
/* =============================================================
   결과 쏠림 검증기   실행:  node tools/simulate.js
   public/index.html 안의 QUESTIONS 를 그대로 읽어 채점을 재현합니다.
   질문이나 배점을 고친 뒤에는 반드시 이걸 돌려보세요.

   보는 법
   - 죄별 총 배점: 특정 죄가 구조적으로 유리한지
   - 자리별 배점: 이 테스트는 보기 순서를 섞지 않으므로,
     A/B/C/D 중 한 자리에 한 죄가 몰려 있으면 위치 습관이 결과를 끌고 갑니다
   - 결과 분포: 완전 균등은 14.3%. 어떤 모델에서도 30%를 넘거나
     5% 아래로 굶는 죄가 없어야 합니다
   ============================================================= */
const path=require('path');
const fs=require('fs');
const html=fs.readFileSync(process.argv[2]||path.join(__dirname,'..','public','index.html'),'utf8');
const qLine=html.match(/const QUESTIONS=(\[.*?\]);/s)[1];
const QUESTIONS=JSON.parse(qLine);
const SINS=[{k:'교',name:'교만'},{k:'질',name:'질투'},{k:'분',name:'분노'},{k:'나',name:'나태'},{k:'탐',name:'탐욕'},{k:'식',name:'탐식'},{k:'색',name:'색욕'}];
const KEYS=SINS.map(s=>s.k);

function parse(p){return p.split(' · ').map(s=>[s[0],Number(s.slice(-1))]);}

// 1) 구조 지표: 죄별 총 배점 / 각 자리(A~D)에서의 배점
const mass={},byPos={};KEYS.forEach(k=>{mass[k]=0;byPos[k]=[0,0,0,0];});
QUESTIONS.forEach(q=>q.a.forEach((o,i)=>parse(o.points).forEach(([k,v])=>{mass[k]+=v;byPos[k][i]+=v;})));
const total=Object.values(mass).reduce((a,b)=>a+b,0);
console.log('문항',QUESTIONS.length,'· 총 배점',total,'· 죄당 이상치',(total/7).toFixed(1));
console.log('\n■ 죄별 총 배점 (구조적 유불리)');
SINS.map(s=>[s.name,mass[s.k]]).sort((a,b)=>b[1]-a[1]).forEach(([n,m])=>
  console.log('   '+n.padEnd(4)+String(m).padStart(3)+'점   '+'█'.repeat(Math.round(m/2))));

console.log('\n■ 선택지 자리별 배점 (A/B/C/D) — 이 테스트는 보기 순서를 섞지 않음');
console.log('        A    B    C    D');
SINS.forEach(s=>console.log('   '+s.name.padEnd(4)+byPos[s.k].map(v=>String(v).padStart(4)).join(' ')));

// 2) 결과 분포
function winner(ans){
  const pts={};KEYS.forEach(k=>pts[k]=0);
  QUESTIONS.forEach((q,i)=>parse(q.a[ans[i]].points).forEach(([k,v])=>pts[k]+=v));
  const ranked=KEYS.map(k=>({k,p:pts[k]})).sort((a,b)=>b.p-a.p);
  const tie=ranked.filter(r=>r.p===ranked[0].p).length>1;
  return {k:ranked[0].k,tie};
}
function softmax(w,t){const e=w.map(x=>Math.exp(x/t));const s=e.reduce((a,b)=>a+b,0);let r=Math.random()*s;for(let i=0;i<e.length;i++){r-=e[i];if(r<=0)return i;}return 3;}

const MODELS={
  '균등 랜덤': ()=>QUESTIONS.map(()=>Math.floor(Math.random()*4)),
  '앞 보기 선호': ()=>QUESTIONS.map(()=>softmax([3.4,2.9,2.6,2.3],0.8)),
  '뒤 보기 선호': ()=>QUESTIONS.map(()=>softmax([2.3,2.6,2.9,3.4],0.8)),
  '첫 보기만 고름': ()=>QUESTIONS.map(()=>0),
};
const N=60000;
Object.entries(MODELS).forEach(([name,fn])=>{
  const c={},ties=[];KEYS.forEach(k=>c[k]=0);let tieCount=0;
  const runs = name==='첫 보기만 고름' ? 1 : N;
  for(let i=0;i<runs;i++){const w=winner(fn());c[w.k]++;if(w.tie)tieCount++;}
  const rows=SINS.map(s=>({n:s.name,pct:100*c[s.k]/runs})).sort((a,b)=>b.pct-a.pct);
  console.log('\n■ '+name+'   최다 '+rows[0].pct.toFixed(1)+'%  최소 '+rows[6].pct.toFixed(1)+'%  (동점 발생 '+(100*tieCount/runs).toFixed(1)+'%)');
  rows.forEach(r=>console.log('   '+r.n.padEnd(4)+r.pct.toFixed(1).padStart(5)+'%  '+'█'.repeat(Math.round(r.pct/1.2))));
});
