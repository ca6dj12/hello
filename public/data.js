/* =============================================================
   DEADLY SINS — 콘텐츠 데이터
   문구 / 메뉴 / 가격은 전부 이 파일에서만 수정하면 됩니다.
   ============================================================= */

const SINS = {
  pride: {
    en: 'PRIDE', ko: '교만',
    drink: { ko: '교만의 술', en: 'The Drink of Pride' },
    latin: 'Contritionem praecedit superbia, et ante ruinam exaltatur spiritus.',
    latinTr: {
      ko: '파멸에 앞서 교만이 오고, 넘어지기 전에 마음이 높아진다.',
      en: 'Pride goes before destruction, and a haughty spirit before a fall.'
    },
    verdict: {
      ko: '당신은 무너지는 순간에도 자세를 고칩니다. 이 잔은 당신을 흔들지 않습니다. 대신, 정확하게 앉힙니다.',
      en: 'You straighten your posture even as things fall. This glass will not shake you — it seats you, precisely.'
    },
    aroma:    { ko: '꽃 향기, 시트러스',          en: 'Florals, citrus' },
    taste:    { ko: '가벼운 단맛, 약간 쌉싸름한',   en: 'Lightly sweet, faintly bitter' },
    finish:   { ko: '드라이하고 부드러운',          en: 'Dry and smooth' },
    strength: { ko: '중간', en: 'Medium' },
    level: 3, price: '18,000', shape: 'diamond', glass: 'rocks'
  },
  greed: {
    en: 'GREED', ko: '탐욕',
    drink: { ko: '탐욕의 술', en: 'The Drink of Greed' },
    latin: 'Avaritia est fovea sine fundo; numquam satiatur.',
    latinTr: {
      ko: '탐욕은 바닥 없는 구덩이라, 결코 채워지지 않는다.',
      en: 'Greed is a pit without a bottom; it is never filled.'
    },
    verdict: {
      ko: '당신의 잔은 늘 한 모금이 모자랍니다. 다 비우고도 남는 것이 있다면, 그건 갈증입니다.',
      en: 'Your glass is always one sip short. What is left at the bottom is thirst.'
    },
    aroma:    { ko: '레몬, 허브, 스파이시',   en: 'Lemon, herbs, spice' },
    taste:    { ko: '드라이, 은은한 단맛',    en: 'Dry, with a quiet sweetness' },
    finish:   { ko: '강렬한 시트러스',        en: 'A sharp citrus close' },
    strength: { ko: '높음', en: 'High' },
    level: 4, price: '18,000', shape: 'hex', glass: 'copita'
  },
  envy: {
    en: 'ENVY', ko: '질투',
    drink: { ko: '질투의 술', en: 'The Drink of Envy' },
    latin: 'Invidi non semel moriuntur, sed quotiens invidiati laudantur.',
    latinTr: {
      ko: '질투하는 자는 한 번 죽지 않는다. 부러워하던 이가 칭송받을 때마다 죽는다.',
      en: 'The envious do not die once, but as often as the envied are praised.'
    },
    verdict: {
      ko: '당신은 남의 잔에 남은 색까지 기억합니다. 이 잔은 그 눈을 탓하지 않고, 잠깐 시원하게 씻어냅니다.',
      en: "You remember the colour left in someone else's glass. This one does not scold that eye — it rinses it, briefly."
    },
    aroma:    { ko: '베르가못, 오렌지',      en: 'Bergamot, orange' },
    taste:    { ko: '상큼하고 은은한 산미',   en: 'Fresh, with a gentle acidity' },
    finish:   { ko: '짧고 깔끔한',           en: 'Short and clean' },
    strength: { ko: '낮음', en: 'Low' },
    level: 1, price: '18,000', shape: 'star', glass: 'wine'
  },
  wrath: {
    en: 'WRATH', ko: '분노',
    drink: { ko: '분노의 술', en: 'The Drink of Wrath' },
    latin: 'Crudelis est furor, et impetuosa ira.',
    latinTr: {
      ko: '분노는 잔인하고, 노여움은 사납다.',
      en: 'Wrath is cruel, and anger is a flood.'
    },
    verdict: {
      ko: '당신 안엔 아직 끄지 못한 불이 있습니다. 이 잔은 그 불을 재우지 않고, 태울 만한 곳으로 데려갑니다.',
      en: 'There is a fire in you that never quite went out. This glass does not smother it — it gives it somewhere to burn.'
    },
    aroma:    { ko: '스모키, 구운 오크',      en: 'Smoke, toasted oak' },
    taste:    { ko: '다층적이고 강렬한',       en: 'Layered and forceful' },
    finish:   { ko: '길고 묵직한 여운',        en: 'Long and heavy' },
    strength: { ko: '매우 높음', en: 'Very high' },
    level: 5, price: '18,000', shape: 'tri-down', glass: 'glencairn'
  },
  lust: {
    en: 'LUST', ko: '색욕',
    drink: { ko: '색욕의 술', en: 'The Drink of Lust' },
    latin: 'Inter septem peccata capitalia, luxuria profecto praestantissima est.',
    latinTr: {
      ko: '일곱 죄악 가운데, 색욕이야말로 가장 빼어나다.',
      en: 'Among the seven deadly sins, lust is surely the finest.'
    },
    verdict: {
      ko: '당신은 닿기 직전의 순간을 가장 오래 기억합니다. 이 잔도 서두르지 않습니다. 혀끝에서 조금 더 머뭅니다.',
      en: 'You remember the moment just before touch the longest. This one does not hurry either; it lingers.'
    },
    aroma:    { ko: '꽃 향기, 시트러스',     en: 'Florals, citrus' },
    taste:    { ko: '달콤하고 부드러운',      en: 'Sweet and soft' },
    finish:   { ko: '깔끔하고 상쾌한',        en: 'Clean and cool' },
    strength: { ko: '낮음', en: 'Low' },
    level: 1, price: '18,000', shape: 'tri-up', glass: 'cocktail'
  },
  gluttony: {
    en: 'GLUTTONY', ko: '폭식',
    drink: { ko: '폭식의 술', en: 'The Drink of Gluttony' },
    latin: 'Gula est fuga animi, signum aliquid nos intus consumere.',
    latinTr: {
      ko: '탐식은 마음의 도피이며, 무언가가 우리를 안에서 먹고 있다는 신호다.',
      en: 'Gluttony is a flight of the soul, a sign that something is eating us from within.'
    },
    verdict: {
      ko: '당신은 비어가는 접시를 견디지 못합니다. 이 잔은 채우는 쪽을 택했고, 오래 따뜻하게 남습니다.',
      en: 'You cannot stand a plate going empty. This glass takes the side of filling, and stays warm a long while.'
    },
    aroma:    { ko: '아몬드, 사과',          en: 'Almond, apple' },
    taste:    { ko: '달콤하고 부드러운',      en: 'Sweet and soft' },
    finish:   { ko: '따뜻하고 긴 여운',       en: 'Warm and lingering' },
    strength: { ko: '중간', en: 'Medium' },
    level: 3, price: '18,000', shape: 'circle', glass: 'rocks'
  },
  sloth: {
    en: 'SLOTH', ko: '나태',
    drink: { ko: '나태의 술', en: 'The Drink of Sloth' },
    latin: 'Mens otiosa officina diaboli est.',
    latinTr: {
      ko: '게으른 마음은 악마의 작업장이다.',
      en: "An idle mind is the devil's workshop."
    },
    verdict: {
      ko: '당신은 서두르지 않는 법을 이미 알고 있습니다. 이 잔은 아무것도 요구하지 않고, 짧고 깨끗하게 사라집니다.',
      en: 'You already know how not to hurry. This glass asks nothing of you, and leaves short and clean.'
    },
    aroma:    { ko: '진저, 시트러스',        en: 'Ginger, citrus' },
    taste:    { ko: '가볍고 향긋한 스파이시', en: 'Light, fragrant spice' },
    finish:   { ko: '짧고 깔끔한',           en: 'Short and clean' },
    strength: { ko: '낮음', en: 'Low' },
    level: 1, price: '18,000', shape: 'square', glass: 'highball'
  }
};

const SIN_ORDER = ['pride', 'greed', 'envy', 'wrath', 'lust', 'gluttony', 'sloth'];

/* =============================================================
   질문 — 설계 규칙 (편향 방지)
   1) 죄 이름을 노출하지 않는다. 자기평가("나는 ~한 편이다")를 묻지 않는다.
   2) 10문항 중 6문항은 감각/미감(온도·소리·촉감·향·색·여운)이다.
      감정 상황극은 "답정너"가 되기 쉬워 최소로만 쓴다.
   3) 모든 선택지의 가중치 합 = 정확히 4. 더 비싼 선택지가 없다.
   4) 한 선택지는 반드시 2개 이상의 죄에 나눠 걸린다. 역산이 안 되게.
   5) 선택지 순서는 매 세션 무작위로 섞인다(첫 번째 선택지 편향 제거).
   6) sensory:true 문항은 동점일 때 우선권을 갖는다(실제 잔의 향·강도와 직결).
   ※ 수정 후에는 반드시 `node tools/simulate.js` 로 쏠림을 재검증할 것.
   ============================================================= */

const QUESTIONS = [
  {
    id: 'q1',
    q: { ko: '문을 열고 들어선 순간, 시선이 가장 먼저 멈춘 곳.',
         en: 'The moment the door shut behind you, your eyes stopped on —' },
    options: [
      { ko: '벽에 걸린 일곱 개의 문장',        en: 'the seven sentences on the wall',            w: { pride: 3, envy: 1 } },
      { ko: '조명이 벽에 남긴 빛의 테두리',     en: 'the rim of light the lamps left on the wall', w: { sloth: 2, envy: 2 } },
      { ko: '옆 테이블 잔에 남아 있는 색',      en: 'the colour left in the next glass over',      w: { lust: 2, gluttony: 2 } },
      { ko: '바 뒤에 늘어선 병들의 라벨',       en: 'the labels lined up behind the bar',          w: { greed: 3, gluttony: 1 } }
    ]
  },
  {
    id: 'q2', sensory: true,
    q: { ko: '오늘 하루를 사진 한 장으로 남긴다면, 그 사진의 온도.',
         en: 'If today were a single photograph, its temperature.' },
    options: [
      { ko: '손끝이 시린 새벽 공기',     en: 'dawn air, cold at the fingertips',    w: { envy: 2, pride: 2 } },
      { ko: '식어버린 커피의 미지근함',   en: 'coffee gone lukewarm',                w: { sloth: 3, gluttony: 1 } },
      { ko: '아스팔트가 일렁이던 한낮의 열', en: 'midday heat rippling off the asphalt', w: { wrath: 3, greed: 1 } },
      { ko: '살갗에 닿는 늦은 밤의 습기', en: 'late-night damp on the skin',         w: { lust: 2, wrath: 2 } }
    ]
  },
  {
    id: 'q3', sensory: true,
    q: { ko: '지금 이 공간에 딱 하나만 더 넣을 수 있다면, 어떤 소리.',
         en: 'One more sound allowed in this room — which one.' },
    options: [
      { ko: '얼음이 잔 벽을 치는 소리',    en: 'ice knocking the side of a glass',   w: { greed: 2, wrath: 2 } },
      { ko: '바닥에 낮게 깔리는 베이스',    en: 'bass sitting low on the floor',      w: { wrath: 3, lust: 1 } },
      { ko: '종이를 넘기는 소리',          en: 'a page being turned',                w: { sloth: 2, envy: 2 } },
      { ko: '접시와 포크가 부딪히는 소리',  en: 'a fork meeting a plate',             w: { gluttony: 3, greed: 1 } }
    ]
  },
  {
    id: 'q4', sensory: true,
    q: { ko: '손이 가장 오래 머무는 표면.',
         en: 'The surface your hand stays on the longest.' },
    options: [
      { ko: '차갑게 식은 금속',          en: 'metal that has gone cold',  w: { pride: 1, envy: 3 } },
      { ko: '오래 만져 반질해진 나무',    en: 'wood worn smooth by hands', w: { gluttony: 2, greed: 2 } },
      { ko: '살에 닿는 실크',            en: 'silk against skin',         w: { lust: 3, pride: 1 } },
      { ko: '손바닥을 쓸고 가는 거친 돌',  en: 'rough stone under the palm', w: { wrath: 3, sloth: 1 } }
    ]
  },
  {
    id: 'q5', sensory: true,
    q: { ko: '눈을 감았을 때, 당신을 가장 빨리 어딘가로 데려가는 냄새.',
         en: 'Eyes closed — the smell that takes you somewhere fastest.' },
    options: [
      { ko: '오래된 오크와 재가 된 장작',     en: 'old oak and firewood turned to ash',      w: { wrath: 2, sloth: 2 } },
      { ko: '오븐에서 막 꺼낸 사과와 아몬드',  en: 'apple and almond straight from the oven', w: { gluttony: 3, lust: 1 } },
      { ko: '비 그친 정원의 흰 꽃',          en: 'white flowers in a garden after rain',     w: { lust: 2, pride: 2 } },
      { ko: '손톱 밑에 남은 감귤 껍질',       en: 'citrus peel still under your nails',       w: { envy: 2, sloth: 2 } }
    ]
  },
  {
    id: 'q6',
    q: { ko: '당신이 가장 오래 망설이는 순간.',
         en: 'The moment you hesitate in the longest.' },
    options: [
      { ko: '접시에 남은 마지막 한 조각 앞에서', en: 'before the last piece on the plate',     w: { gluttony: 2, envy: 2 } },
      { ko: '먼저 연락할까, 기다릴까',          en: 'to message first, or to wait',           w: { lust: 2, envy: 2 } },
      { ko: '더 가질까, 여기서 멈출까',          en: 'to take more, or to stop here',          w: { greed: 3, wrath: 1 } },
      { ko: '지금 일어날까, 조금 더 있을까',      en: 'to get up now, or stay a little longer', w: { sloth: 2, greed: 2 } }
    ]
  },
  {
    id: 'q7',
    q: { ko: '오래 못 본 사람의 아주 좋은 소식을 들었다. 그날 밤 당신이 실제로 한 일.',
         en: 'Very good news from someone you had not seen in years. What you actually did that night.' },
    options: [
      { ko: '그 사람이 올린 사진을 오래 들여다봤다', en: 'looked at the photo they posted for a long time', w: { envy: 3, lust: 1 } },
      { ko: '내 계획표를 열어 날짜를 다시 적었다',   en: 'opened my own plan and rewrote the dates',        w: { pride: 2, greed: 2 } },
      { ko: '축하 한 줄 보내고 그대로 잠들었다',     en: 'sent one line of congratulations, then slept',    w: { sloth: 2, envy: 2 } },
      { ko: '혼자 한 잔 따르고 안주를 꺼냈다',       en: 'poured one for myself and opened something to eat', w: { gluttony: 3, sloth: 1 } }
    ]
  },
  {
    id: 'q8',
    q: { ko: '첫 잔이 나왔다. 당신의 손이 움직이는 방식.',
         en: 'The first glass arrives. How your hand moves.' },
    options: [
      { ko: '첫 모금은 깊게, 망설임 없이',      en: 'the first sip deep, without hesitating', w: { wrath: 3, gluttony: 1 } },
      { ko: '한 모금 뒤, 잔을 오래 들여다본다', en: 'one sip, then a long look at the glass', w: { pride: 3, envy: 1 } },
      { ko: '얼음이 녹는 속도에 맞춘다',       en: 'at exactly the speed the ice melts',      w: { lust: 2, sloth: 2 } },
      { ko: '다음 잔을 먼저 고르고 나서 마신다', en: 'pick the next one first, then drink',    w: { greed: 3, pride: 1 } }
    ]
  },
  {
    id: 'q9', sensory: true,
    q: { ko: '오늘 밤, 목 안에 남기고 싶은 감각.',
         en: 'What you want left in your throat tonight.' },
    options: [
      { ko: '짧고 깨끗하게 사라지는 것',  en: 'something that leaves short and clean', w: { sloth: 2, envy: 2 } },
      { ko: '길고 따뜻하게 머무는 것',    en: 'something warm that stays',             w: { gluttony: 2, lust: 2 } },
      { ko: '드라이하게 조여오는 것',     en: 'something dry that tightens',           w: { pride: 2, greed: 2 } },
      { ko: '묵직하게 타고 내려가는 것',  en: 'something heavy on the way down',       w: { wrath: 3, greed: 1 } }
    ]
  },
  {
    id: 'q10',
    q: { ko: '내일 아침의 당신에게 남기고 싶은 것.',
         en: "What you want to leave for tomorrow morning's version of you." },
    options: [
      { ko: '아무 기억 없는 개운함',       en: 'a clear head and no memory',          w: { sloth: 2, envy: 2 } },
      { ko: '아까워서 자꾸 떠오르는 밤',    en: 'a night too good to stop replaying',  w: { lust: 2, gluttony: 2 } },
      { ko: '다시 읽게 되는 결심 한 문장',  en: 'one line of resolve worth rereading', w: { pride: 3, greed: 1 } },
      { ko: '아직 식지 않은 열',           en: 'heat that has not cooled yet',        w: { wrath: 2, pride: 2 } }
    ]
  }
];

/* =============================================================
   메뉴 — 실제 메뉴판 그대로. 가격만 고치면 사이트에 바로 반영됩니다.
   ※ whisky[].sin : 위스키 소제목 ↔ 7죄악 연결.
     "난 달라"=교만 / "못 멈추겠어"=폭식 / "아무 생각 없이"=나태 /
     "강하게 때려박는다"=분노 / "부드러워.."=색욕 는 확실해 보이지만,
     "갖고 싶지?"=질투, "더 진한 걸 원해"=탐욕 은 추측입니다. 바꾸려면
     아래 sin 값만 교체하세요.
   ============================================================= */

const MENU = {
  whiskyHead: { ko: '"죄는 취향이 된다"', en: '"Sin becomes taste"' },
  whiskyNote: { ko: 'G · 글라스   |   B · 보틀', en: 'G · glass   |   B · bottle' },
  whisky: [
    { sin: 'pride', label: { ko: '"난 달라"', en: '"I\'m not like them"' }, items: [
      { ko: '글렌파클라스 25년', en: 'Glenfarclas 25', g: '95,000', b: '1,570,000' },
      { ko: '맥캘란 18년 셰리',  en: 'Macallan 18 Sherry', g: '63,000', b: '990,000' }
    ]},
    { sin: 'envy', label: { ko: '"갖고 싶지?"', en: '"You want this, don\'t you?"' }, items: [
      { ko: '블랑톤',        en: "Blanton's",  g: '35,000', b: '600,000' },
      { ko: '달모어 15년',   en: 'Dalmore 15', g: '28,000', b: '450,000' }
    ]},
    { sin: 'greed', label: { ko: '"더 진한 걸 원해"', en: '"I want it richer"' }, items: [
      { ko: '아벨라워 아부나흐', en: "Aberlour A'bunadh", g: '28,000', b: '450,000' },
      { ko: '글렌알라키 15년',   en: 'GlenAllachie 15',   g: '25,000', b: '400,000' }
    ]},
    { sin: 'gluttony', label: { ko: '"못 멈추겠어"', en: '"I can\'t stop"' }, items: [
      { ko: '글렌드로낙 12년',  en: 'GlenDronach 12',   g: '16,000', b: '250,000' },
      { ko: '우드포드 리저브',  en: 'Woodford Reserve', g: '14,000', b: '190,000' }
    ]},
    { sin: 'sloth', label: { ko: '"아무 생각 없이"', en: '"No thoughts"' }, items: [
      { ko: '듀어스 12년',    en: "Dewar's 12",   g: '9,000', b: '140,000' },
      { ko: '메이커스 마크',  en: "Maker's Mark", g: '9,000', b: '140,000' }
    ]},
    { sin: 'wrath', label: { ko: '"강하게 때려박는다"', en: '"Hit it hard"' }, items: [
      { ko: '라가불린 16년', en: 'Lagavulin 16', g: '23,000', b: '370,000' },
      { ko: '아드벡 10년',   en: 'Ardbeg 10',    g: '15,000', b: '220,000' }
    ]},
    { sin: 'lust', label: { ko: '"부드러워.."', en: '"So smooth.."' }, items: [
      { ko: '글렌모렌지 넥타도르',   en: "Glenmorangie Nectar d'Or",  g: '25,000', b: '400,000' },
      { ko: '발베니 14년 캐리비안', en: 'Balvenie 14 Caribbean Cask', g: '24,000', b: '380,000' }
    ]}
  ],
  final: {
    title: 'The Final Chapter',
    label: { ko: '"파멸, 혹은 속죄"', en: '"Ruin, or atonement"' },
    items: [{ ko: '옥토모어 16.3', en: 'Octomore 16.3', g: '75,000', b: '1,220,000' }]
  },
  bites: [
    { ko: '블루베리 페퍼 크래커', en: 'Blueberry Pepper Cracker', p: '8,000' },
    { ko: '체리 요거트 크림',     en: 'Cherry Yogurt Cream',      p: '8,000' }
  ],
  cocktails: [
    { ko: '올드패션드', en: 'Old Fashioned', p: '22,000' }
  ],
  beverages: [
    { ko: '아쿠아파나', en: 'Acqua Panna', p: '5,000' },
    { ko: '콜라',       en: 'Coke',        p: '3,000' },
    { ko: '콜라제로',   en: 'Coke Zero',   p: '3,000' },
    { ko: '진저에일',   en: 'Ginger Ale',  p: '3,000' },
    { ko: '소다워터',   en: 'Soda Water',  p: '3,000' }
  ],
  info: [
    { ko: '커버차지는 없습니다. 편하게 즐겨주세요.',
      en: 'No cover charge. Please make yourself comfortable.' },
    { ko: '콜키지는 제공하지 않습니다. 양해 부탁드립니다.',
      en: 'We do not offer corkage. Thank you for understanding.' },
    { ko: '킵바틀은 첫 이용일로부터 1달간 보관됩니다. (재방문 시 10,000원)',
      en: 'Kept bottles are held for one month from first use. (10,000 KRW on a return visit)' },
    { ko: '잔 및 기물 파손 시 구입가의 50%가 청구됩니다.',
      en: 'Broken glassware or fixtures are charged at 50% of the purchase price.' }
  ]
};

/* ---------- 화면 문구 ---------- */
const UI = {
  ko: {
    brand: 'DEADLYSINS',
    kicker: '여기선 착할 필요 없습니다.',
    introTitle: '오늘 밤,<br>당신은 어떤 죄를<br>삼키시겠습니까?',
    introBody: '열 개의 질문이 끝나면, 일곱 개의 잔 중 하나가 당신을 고릅니다.<br>맞히려 하지 말고, 먼저 손이 가는 쪽을 고르세요.',
    start: '죄를 마주하기',
    time: '약 1분',
    skipToMenu: '메뉴만 볼게요',
    of: '／',
    back: '이전',
    resultKicker: '오늘 밤 당신의 죄는',
    order: '주문은 이렇게',
    orderLine: function (d) { return '「' + d + ' 한 잔이요」'; },
    second: '두 번째로 짙은 죄',
    aroma: '향', taste: '맛', finish: '피니시', strength: '강도', price: '가격',
    won: '원',
    whiskyForSin: '같은 죄의 위스키',
    again: '다시 마주하기',
    share: '공유하기',
    copied: '링크를 복사했습니다',
    all: '일곱 개의 잔 모두 보기',
    close: '닫기',
    menuTitle: 'MENU',
    signature: 'SEVEN SINS',
    signatureNote: '일곱 개의 잔 · 각 18,000원',
    bites: 'BITES', cocktails: 'COCKTAILS', beverages: 'BEVERAGES',
    whisky: 'WHISKY SELECTION', info: 'INFORMATION',
    toMenu: '전체 메뉴 보기',
    toTop: '위로',
    langLabel: 'EN',
    footer: '일곱 개의 잔, 모두 18,000원'
  },
  en: {
    brand: 'DEADLYSINS',
    kicker: 'You don\'t have to be good in here.',
    introTitle: 'Tonight,<br>which sin<br>will you swallow?',
    introBody: 'Ten questions. At the end, one of the seven glasses picks you.<br>Don\'t try to get it right — take whichever your hand reaches for.',
    start: 'Face your sin',
    time: 'about a minute',
    skipToMenu: 'Just the menu',
    of: '／',
    back: 'Back',
    resultKicker: 'Tonight, your sin is',
    order: 'Order it like this',
    orderLine: function (d) { return '“One ' + d + ', please.”'; },
    second: 'The second shade in you',
    aroma: 'Aroma', taste: 'Taste', finish: 'Finish', strength: 'Strength', price: 'Price',
    won: ' KRW',
    whiskyForSin: 'Whisky of the same sin',
    again: 'Face it again',
    share: 'Share',
    copied: 'Link copied',
    all: 'See all seven glasses',
    close: 'Close',
    menuTitle: 'MENU',
    signature: 'SEVEN SINS',
    signatureNote: 'Seven glasses · 18,000 KRW each',
    bites: 'BITES', cocktails: 'COCKTAILS', beverages: 'BEVERAGES',
    whisky: 'WHISKY SELECTION', info: 'INFORMATION',
    toMenu: 'See the full menu',
    toTop: 'Top',
    langLabel: '한국어',
    footer: 'Seven glasses, 18,000 KRW each'
  }
};
