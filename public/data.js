/* =============================================================
   DEADLY SINS — 가격 · 메뉴 · 맛 정보
   가격이나 메뉴가 바뀌면 이 파일만 고치면 됩니다 (빌드 불필요).

   ※ 시그니처 일곱 잔 가격(signaturePrice)은 2026-10-17 에 16,000원으로 확인.
     안주 세 가지(이름 · 구성 · 가격)는 2026-10-23 사장님 확인.
     위스키 · 음료 가격은 2026-09-18 메뉴판 사진 기준이라,
     그 뒤 바뀐 게 있으면 여기서 고쳐 주세요.
   ※ 키(교·질·분·나·탐·식·색)는 사이트 원본의 SINS 키와 같아야 합니다.
   ============================================================= */
window.DS_DATA = {
  signaturePrice: 16000,

  /* 시그니처 일곱 잔의 맛 (나무 메뉴판 그대로). level 은 강도 1~5.
     style · desc 는 사장님이 준 칵테일 설명 (2026-10-22). 메뉴판 목록과 상세에 나온다.
     line.confirmed:false 인 문구는 각인을 확실히 못 읽은 것이라 화면에 나가지 않습니다. */
  drinks: {
    "교": {
      "line": {
        "ko": "은은한 꽃향과 단단한 기품이 입안을 지배한다.",
        "en": "Soft florals and a firm poise take over the palate.",
        "zh": "淡雅的花香与凛然的气度，主宰唇齿之间。",
        "ja": "ほのかな花の香りと揺るぎない気品が、口の中を支配する。",
        "confirmed": true
      },
      "style": {
        "ko": "깊고 우아한",
        "en": "Deep and elegant",
        "zh": "深邃而优雅",
        "ja": "深く、エレガント"
      },
      "desc": {
        "ko": "깊고 부드러운 맛에 화사한 꽃향을 더해 우아한 느낌을 표현한 칵테일.",
        "en": "Deep, smooth flavour lifted with bright florals — a cocktail of quiet elegance.",
        "zh": "在深邃柔顺的口感中添一抹明丽花香，尽显优雅的鸡尾酒。",
        "ja": "深くまろやかな味わいに華やかな花の香りを重ね、優雅さを表現したカクテル。"
      },
      "aroma": {
        "ko": "꽃 향기, 시트러스",
        "en": "Florals, citrus",
        "zh": "花香、柑橘",
        "ja": "花の香り、シトラス"
      },
      "taste": {
        "ko": "가벼운 단맛, 약간 쌉싸름한",
        "en": "Lightly sweet, faintly bitter",
        "zh": "微甜，略带苦味",
        "ja": "軽い甘み、ほのかな苦み"
      },
      "finish": {
        "ko": "드라이하고 부드러운",
        "en": "Dry and smooth",
        "zh": "干爽而柔顺",
        "ja": "ドライでなめらか"
      },
      "strength": {
        "ko": "중간",
        "en": "Medium",
        "zh": "中等",
        "ja": "ふつう"
      },
      "level": 3
    },
    "질": {
      "line": {
        "ko": "상큼한 열망이 톡 쏘며, 마음을 간질인다.",
        "en": "A bright longing fizzes up and tickles the heart.",
        "zh": "清新的渴望在舌尖轻轻迸开，撩得人心痒。",
        "ja": "爽やかな渇望がピリッとはじけ、心をくすぐる。",
        "confirmed": true
      },
      "style": {
        "ko": "상큼하고 쌉쌀한",
        "en": "Bright and bittersweet",
        "zh": "清新而微苦",
        "ja": "爽やかでほろ苦い"
      },
      "desc": {
        "ko": "상큼함과 쌉쌀함의 대비로 질투의 양면성을 표현한 칵테일.",
        "en": "Bright against bitter — a cocktail for the two faces of envy.",
        "zh": "以清新与微苦的对比，表现嫉妒两面性的鸡尾酒。",
        "ja": "爽やかさとほろ苦さの対比で、嫉妬の二面性を表現したカクテル。"
      },
      "aroma": {
        "ko": "베르가못, 오렌지",
        "en": "Bergamot, orange",
        "zh": "佛手柑、橙子",
        "ja": "ベルガモット、オレンジ"
      },
      "taste": {
        "ko": "상큼하고 은은한 산미",
        "en": "Fresh, with a gentle acidity",
        "zh": "清新，酸度柔和",
        "ja": "爽やかで、ほのかな酸味"
      },
      "finish": {
        "ko": "짧고 깔끔한",
        "en": "Short and clean",
        "zh": "短促而干净",
        "ja": "短く、すっきり"
      },
      "strength": {
        "ko": "낮음",
        "en": "Low",
        "zh": "低",
        "ja": "弱め"
      },
      "level": 1
    },
    "분": {
      "line": {
        "ko": "불꽃처럼 타오르는 열기가 목을 타고 흐르며 뜨거운 에너지가 폭발한다.",
        "en": "Heat that burns like a flame runs down the throat, then bursts.",
        "zh": "如烈焰般燃烧的热意顺喉而下，炽热的能量随之爆发。",
        "ja": "炎のように燃え上がる熱が喉を駆け下り、灼熱のエネルギーが爆発する。",
        "confirmed": true
      },
      "style": {
        "ko": "강렬하고 스모키한",
        "en": "Intense and smoky",
        "zh": "浓烈而烟熏",
        "ja": "強烈でスモーキー"
      },
      "desc": {
        "ko": "높은 도수와 짙은 훈연 향으로 분노의 강렬함을 표현한 칵테일.",
        "en": "High proof and deep smoke — a cocktail with all the force of wrath.",
        "zh": "以高酒精度与浓重烟熏香，表现暴怒之烈的鸡尾酒。",
        "ja": "高い度数と濃いスモーク香で、憤怒の激しさを表現したカクテル。"
      },
      "aroma": {
        "ko": "스모키, 구운 오크",
        "en": "Smoke, toasted oak",
        "zh": "烟熏、烘烤橡木",
        "ja": "スモーキー、トーストオーク"
      },
      "taste": {
        "ko": "다층적이고 강렬한",
        "en": "Layered and forceful",
        "zh": "层次丰富而浓烈",
        "ja": "重層的で強烈"
      },
      "finish": {
        "ko": "길고 묵직한 여운",
        "en": "Long and heavy",
        "zh": "悠长而厚重",
        "ja": "長く重厚な余韻"
      },
      "strength": {
        "ko": "매우 높음",
        "en": "Very high",
        "zh": "非常高",
        "ja": "とても強い"
      },
      "level": 5
    },
    "나": {
      "line": {
        "ko": "부드럽고 상쾌한 맛이 나른함을 풀어주며 편안한 쉼을 안겨준다.",
        "en": "Smooth and refreshing, it loosens you up and hands you a slow, easy rest.",
        "zh": "柔和清爽的滋味化开倦意，带来安适的休憩。",
        "ja": "やわらかく爽快な味わいが気だるさをほどき、安らかなひとときをもたらす。",
        "confirmed": true
      },
      "style": {
        "ko": "가볍고 청량한",
        "en": "Light and crisp",
        "zh": "轻盈而清爽",
        "ja": "軽やかで爽快"
      },
      "desc": {
        "ko": "가볍고 청량한 맛으로 편안하고 느슨한 느낌을 표현한 칵테일.",
        "en": "Light and crisp — a cocktail for an easy, unhurried, loosened-up mood.",
        "zh": "以轻盈清爽的口感，表现舒适松弛之感的鸡尾酒。",
        "ja": "軽く爽快な味わいで、ゆったりとくつろいだ気分を表現したカクテル。"
      },
      "aroma": {
        "ko": "진저, 시트러스",
        "en": "Ginger, citrus",
        "zh": "生姜、柑橘",
        "ja": "ジンジャー、シトラス"
      },
      "taste": {
        "ko": "가볍고 향긋한 스파이시",
        "en": "Light, fragrant spice",
        "zh": "轻盈芬芳的辛香",
        "ja": "軽やかで香り高いスパイス感"
      },
      "finish": {
        "ko": "짧고 깔끔한",
        "en": "Short and clean",
        "zh": "短促而干净",
        "ja": "短く、すっきり"
      },
      "strength": {
        "ko": "낮음",
        "en": "Low",
        "zh": "低",
        "ja": "弱め"
      },
      "level": 1
    },
    "탐": {
      "line": {
        "ko": "달콤한 유혹과 쌉싸름한 깊이가 교차하며 끝없는 욕망을 부른다.",
        "en": "Sweet temptation crosses bitter depth and calls for more.",
        "zh": "甜美的诱惑与微苦的深邃交织，唤起无尽的欲望。",
        "ja": "甘い誘惑とほろ苦い深みが交錯し、尽きない欲望を呼ぶ。",
        "confirmed": true
      },
      "style": {
        "ko": "강하고 아로마틱한",
        "en": "Bold and aromatic",
        "zh": "强劲而芳香",
        "ja": "力強くアロマティック"
      },
      "desc": {
        "ko": "짙은 허브향과 스파이시함으로 강한 욕망을 표현한 칵테일.",
        "en": "Dark herbs and spice — a cocktail of strong desire.",
        "zh": "以浓郁草本香与辛香，表现强烈欲望的鸡尾酒。",
        "ja": "濃厚なハーブの香りとスパイス感で、強い欲望を表現したカクテル。"
      },
      "aroma": {
        "ko": "레몬, 허브, 스파이시",
        "en": "Lemon, herbs, spice",
        "zh": "柠檬、草本、辛香",
        "ja": "レモン、ハーブ、スパイシー"
      },
      "taste": {
        "ko": "드라이, 은은한 단맛",
        "en": "Dry, with a quiet sweetness",
        "zh": "干爽，淡淡甜味",
        "ja": "ドライ、ほのかな甘み"
      },
      "finish": {
        "ko": "강렬한 시트러스",
        "en": "A sharp citrus close",
        "zh": "强烈的柑橘感",
        "ja": "鮮烈なシトラス"
      },
      "strength": {
        "ko": "높음",
        "en": "High",
        "zh": "高",
        "ja": "強め"
      },
      "level": 4
    },
    "식": {
      "line": {
        "ko": "따스한 시나몬 향이 입안을 가득 채우며 끝없이 탐식하게 만든다.",
        "en": "Warm cinnamon fills the mouth and keeps you reaching for more.",
        "zh": "温暖的肉桂香盈满口中，令人贪食不止。",
        "ja": "温かなシナモンの香りが口いっぱいに広がり、とめどなく貪りたくなる。",
        "confirmed": true
      },
      "style": {
        "ko": "달큰하고 농밀한",
        "en": "Sweet and rich",
        "zh": "甜润而浓郁",
        "ja": "甘く濃密"
      },
      "desc": {
        "ko": "달큰하고 농밀한 맛으로 풍성하고 계속 손이 가는 느낌을 표현한 칵테일.",
        "en": "Sweet and dense — a generous cocktail you keep reaching for.",
        "zh": "以甜润浓郁的口感，表现丰盛且令人欲罢不能的鸡尾酒。",
        "ja": "甘く濃密な味わいで、豊かでつい手が伸びる感覚を表現したカクテル。"
      },
      "aroma": {
        "ko": "아몬드, 사과",
        "en": "Almond, apple",
        "zh": "杏仁、苹果",
        "ja": "アーモンド、リンゴ"
      },
      "taste": {
        "ko": "달콤하고 부드러운",
        "en": "Sweet and soft",
        "zh": "香甜而柔和",
        "ja": "甘くやわらか"
      },
      "finish": {
        "ko": "따뜻하고 긴 여운",
        "en": "Warm and lingering",
        "zh": "温暖而悠长",
        "ja": "温かく長い余韻"
      },
      "strength": {
        "ko": "중간",
        "en": "Medium",
        "zh": "中等",
        "ja": "ふつう"
      },
      "level": 3
    },
    "색": {
      "line": {
        "ko": "향긋하고 유혹적인 향기가 혀끝을 간질이며 감각을 자극한다.",
        "en": "A fragrant, tempting scent teases the tongue and wakes the senses.",
        "zh": "芬芳诱人的香气轻撩舌尖，唤醒感官。",
        "ja": "芳しく誘うような香りが舌先をくすぐり、感覚を刺激する。",
        "confirmed": true
      },
      "style": {
        "ko": "향긋하고 달콤한",
        "en": "Fragrant and sweet",
        "zh": "芬芳而甜美",
        "ja": "香り高く甘い"
      },
      "desc": {
        "ko": "은은한 꽃향과 달콤함으로 부드럽고 유혹적인 느낌을 표현한 칵테일.",
        "en": "Soft florals and sweetness — a cocktail that feels gentle and seductive.",
        "zh": "以淡雅花香与甜美，表现温柔而诱惑之感的鸡尾酒。",
        "ja": "ほのかな花の香りと甘さで、やわらかく誘惑的な雰囲気を表現したカクテル。"
      },
      "aroma": {
        "ko": "꽃 향기, 시트러스",
        "en": "Florals, citrus",
        "zh": "花香、柑橘",
        "ja": "花の香り、シトラス"
      },
      "taste": {
        "ko": "달콤하고 부드러운",
        "en": "Sweet and soft",
        "zh": "香甜而柔和",
        "ja": "甘くやわらか"
      },
      "finish": {
        "ko": "깔끔하고 상쾌한",
        "en": "Clean and cool",
        "zh": "干净而清爽",
        "ja": "すっきり爽やか"
      },
      "strength": {
        "ko": "낮음",
        "en": "Low",
        "zh": "低",
        "ja": "弱め"
      },
      "level": 1
    }
  },

  /* 전체 메뉴. whisky[].sin 은 그 소제목이 어느 죄인지 */
  menu: {
    "whiskyHead": {
      "ko": "\"죄는 취향이 된다\"",
      "en": "\"Sin becomes taste\"",
      "zh": "“罪，化为品味”",
      "ja": "「罪は嗜好になる」"
    },
    "whiskyNote": {
      "ko": "G · 글라스   |   B · 보틀",
      "en": "G · glass   |   B · bottle",
      "zh": "G · 单杯   |   B · 整瓶",
      "ja": "G · グラス   |   B · ボトル"
    },
    "whisky": [
      {
        "sin": "교",
        "label": {
          "ko": "\"난 달라\"",
          "en": "\"I'm not like them\"",
          "zh": "“我与众不同”",
          "ja": "「私は違う」"
        },
        "items": [
          {
            "ko": "글렌파클라스 25년",
            "en": "Glenfarclas 25", "id": "glenfarclas-25",
            "g": "95,000",
            "b": "1,570,000"
          },
          {
            "ko": "맥캘란 18년 셰리",
            "en": "Macallan 18 Sherry", "id": "macallan-18",
            "g": "63,000",
            "b": "990,000"
          }
        ]
      },
      {
        "sin": "질",
        "label": {
          "ko": "\"갖고 싶지?\"",
          "en": "\"You want this, don't you?\"",
          "zh": "“想要吧？”",
          "ja": "「欲しいでしょ？」"
        },
        "items": [
          {
            "ko": "블랑톤",
            "en": "Blanton's", "id": "blantons",
            "g": "35,000",
            "b": "600,000"
          },
          {
            "ko": "달모어 15년",
            "en": "Dalmore 15", "id": "dalmore-15",
            "g": "28,000",
            "b": "450,000"
          }
        ]
      },
      {
        "sin": "탐",
        "label": {
          "ko": "\"더 진한 걸 원해\"",
          "en": "\"I want it richer\"",
          "zh": "“我要更浓的”",
          "ja": "「もっと濃いのが欲しい」"
        },
        "items": [
          {
            "ko": "아벨라워 아부나흐",
            "en": "Aberlour A'bunadh", "id": "aberlour-abunadh",
            "g": "28,000",
            "b": "450,000"
          },
          {
            "ko": "글렌알라키 15년",
            "en": "GlenAllachie 15", "id": "glenallachie-15",
            "g": "25,000",
            "b": "400,000"
          }
        ]
      },
      {
        "sin": "식",
        "label": {
          "ko": "\"못 멈추겠어\"",
          "en": "\"I can't stop\"",
          "zh": "“停不下来”",
          "ja": "「やめられない」"
        },
        "items": [
          {
            "ko": "글렌드로낙 12년",
            "en": "GlenDronach 12", "id": "glendronach-12",
            "g": "16,000",
            "b": "250,000"
          },
          {
            "ko": "우드포드 리저브",
            "en": "Woodford Reserve", "id": "woodford-reserve",
            "g": "14,000",
            "b": "190,000"
          }
        ]
      },
      {
        "sin": "나",
        "label": {
          "ko": "\"아무 생각 없이\"",
          "en": "\"Not a single thought\"",
          "zh": "“什么都不想”",
          "ja": "「何も考えずに」"
        },
        "items": [
          {
            "ko": "듀어스 12년",
            "en": "Dewar's 12", "id": "dewars-12",
            "g": "9,000",
            "b": "140,000"
          },
          {
            "ko": "메이커스 마크",
            "en": "Maker's Mark", "id": "makers-mark",
            "g": "9,000",
            "b": "140,000"
          }
        ]
      },
      {
        "sin": "분",
        "label": {
          "ko": "\"강하게 때려박는다\"",
          "en": "\"Hit me hard\"",
          "zh": "“狠狠来一记”",
          "ja": "「ガツンと叩き込む」"
        },
        "items": [
          {
            "ko": "라가불린 16년",
            "en": "Lagavulin 16", "id": "lagavulin-16",
            "g": "23,000",
            "b": "370,000"
          },
          {
            "ko": "아드벡 10년",
            "en": "Ardbeg 10", "id": "ardbeg-10",
            "g": "15,000",
            "b": "220,000"
          }
        ]
      },
      {
        "sin": "색",
        "label": {
          "ko": "\"부드러워..\"",
          "en": "\"So smooth…\"",
          "zh": "“好柔滑……”",
          "ja": "「なめらか…」"
        },
        "items": [
          {
            "ko": "글렌모렌지 넥타도르",
            "en": "Glenmorangie Nectar d'Or", "id": "glenmorangie-nectar-dor",
            "g": "25,000",
            "b": "400,000"
          },
          {
            "ko": "발베니 14년 캐리비안",
            "en": "Balvenie 14 Caribbean Cask", "id": "balvenie-14-caribbean",
            "g": "24,000",
            "b": "380,000"
          }
        ]
      }
    ],
    "final": {
      "title": "The Final Chapter",
      "label": {
        "ko": "\"파멸, 혹은 속죄\"",
        "en": "\"Ruin, or atonement\"",
        "zh": "“毁灭，或赎罪”",
        "ja": "「破滅、あるいは贖罪」"
      },
      "items": [
        {
          "ko": "옥토모어 16.3",
          "en": "Octomore 16.3", "id": "octomore-16-3",
          "g": "75,000",
          "b": "1,220,000"
        }
      ]
    },
    "bites": [
      {
        "ko": "크래커",
        "en": "Crackers",
        "zh": "薄脆饼干",
        "ja": "クラッカー", "id": "cracker",
        "p": "8,000"
      },
      {
        "ko": "체리 요거트 푸딩",
        "en": "Cherry Yogurt Pudding",
        "zh": "樱桃酸奶布丁",
        "ja": "チェリーヨーグルトプリン", "id": "cherry-yogurt-pudding",
        "p": "8,000"
      },
      {
        "ko": "치즈케이크",
        "en": "Cheesecake",
        "zh": "芝士蛋糕",
        "ja": "チーズケーキ", "id": "cheesecake", "new": true,
        "p": "8,000"
      }
    ],
    "cocktails": [
      {
        "ko": "올드패션드",
        "en": "Old Fashioned",
        "zh": "古典鸡尾酒",
        "ja": "オールドファッションド", "id": "old-fashioned",
        "p": "22,000"
      }
    ],
    "beverages": [
      {
        "ko": "아쿠아파나",
        "en": "Acqua Panna",
        "zh": "普娜矿泉水",
        "ja": "アクア パンナ", "id": "acqua-panna",
        "p": "5,000"
      },
      {
        "ko": "콜라",
        "en": "Coke",
        "zh": "可口可乐",
        "ja": "コカ・コーラ", "id": "coke",
        "p": "3,000"
      },
      {
        "ko": "콜라제로",
        "en": "Coke Zero",
        "zh": "零度可口可乐",
        "ja": "コカ・コーラ ゼロ", "id": "coke-zero",
        "p": "3,000"
      },
      {
        "ko": "진저에일",
        "en": "Ginger Ale",
        "zh": "干姜水",
        "ja": "ジンジャーエール", "id": "ginger-ale",
        "p": "3,000"
      },
      {
        "ko": "소다워터",
        "en": "Soda Water",
        "zh": "苏打水",
        "ja": "ソーダ水", "id": "soda-water",
        "p": "3,000"
      }
    ],
    "info": [
      {
        "ko": "커버차지는 없습니다. 편하게 즐겨주세요.",
        "en": "No cover charge. Make yourself at home.",
        "zh": "本店不收座位费，请安心享用。",
        "ja": "チャージ料はございません。どうぞお気軽にお楽しみください。"
      },
      {
        "ko": "콜키지는 제공하지 않습니다. 양해 부탁드립니다.",
        "en": "Outside drinks are not allowed (no corkage). Thank you for understanding.",
        "zh": "谢绝自带酒水（不提供开瓶服务），敬请谅解。",
        "ja": "お飲み物は持ち込み不可です。ご了承ください。"
      },
      {
        "ko": "킵바틀은 첫 이용일로부터 1달간 보관됩니다. (재방문 시 10,000원)",
        "en": "We keep your unfinished bottle for one month from your first visit. (10,000 KRW when you come back for it)",
        "zh": "存酒自首次光临之日起保管1个月。（再次光临时收取10,000韩元）",
        "ja": "ボトルキープは初回ご利用日から1か月間お預かりします。（再来店時10,000ウォン）"
      },
      {
        "ko": "잔 및 기물 파손 시 구입가의 50%가 청구됩니다.",
        "en": "Broken glasses or bar items are charged at 50% of their purchase price.",
        "zh": "如损坏酒杯或器具，将按购入价的50%收费。",
        "ja": "グラスや備品を破損された場合は、購入価格の50%をご請求いたします。"
      }
    ]
  },

  /* 메뉴 상세 설명 — 메뉴판에서 항목을 누르면 나온다. 키는 menu 의 id.
     일반 공개 정보 기준. 매장 보틀(빈티지 · 배치)에 따라 도수나 맛이 다를 수 있으니 사장님 확인 권장.
     abv 가 null 이면 abvNote 를 보여 준다. photo 는 tools/menu-photos.py 로 만든 사진 경로. */
  details: {
    "glenfarclas-25": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland",
        "zh": "苏格兰斯佩塞",
        "ja": "スコットランド・スペイサイド"
      },
      "abv": "43%",
      "cask": {
        "ko": "올로로소 셰리",
        "en": "Oloroso sherry",
        "zh": "Oloroso 雪莉桶",
        "ja": "オロロソ・シェリー樽"
      },
      "about": {
        "ko": "1865년부터 한 가문(그랜트 가)이 지켜 온 증류소의 25년 숙성. 셰리 통이 만든 깊이를 오래 즐기는 잔.",
        "en": "Twenty-five years from a distillery one family (the Grants) has run since 1865. Deep, slow, sherried.",
        "zh": "自1865年起由同一家族（Grant 家族）守护至今的酒厂，25年陈酿。雪莉桶赋予的深邃，值得慢慢细品。",
        "ja": "1865年から一族（グラント家）が守り続ける蒸溜所の25年熟成。シェリー樽が生んだ深みをじっくり味わう一杯。"
      },
      "nose": {
        "ko": "건포도, 말린 과일, 셰리, 오크",
        "en": "Raisin, dried fruit, sherry, oak",
        "zh": "葡萄干、果干、雪莉、橡木",
        "ja": "レーズン、ドライフルーツ、シェリー、オーク"
      },
      "palate": {
        "ko": "다크 초콜릿, 호두, 향신료",
        "en": "Dark chocolate, walnut, spice",
        "zh": "黑巧克力、核桃、香料",
        "ja": "ダークチョコレート、クルミ、スパイス"
      },
      "finish": {
        "ko": "길고 드라이, 커피와 오크",
        "en": "Long and dry, coffee and oak",
        "zh": "悠长而干爽，咖啡与橡木",
        "ja": "長くドライ、コーヒーとオーク"
      },
      "photo": "img/menu/glenfarclas-25.webp",
      "photoCredit": null
    },
    "macallan-18": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland",
        "zh": "苏格兰斯佩塞",
        "ja": "スコットランド・スペイサイド"
      },
      "abv": "43%",
      "cask": {
        "ko": "스페인 헤레스 셰리 시즈닝 오크",
        "en": "Sherry-seasoned oak from Jerez",
        "zh": "西班牙赫雷斯雪莉润桶橡木桶",
        "ja": "スペイン・ヘレスのシェリーシーズニング・オーク樽"
      },
      "about": {
        "ko": "헤레스에서 셰리로 길들인 오크 통에서만 18년. 맥캘란을 상징하는 한 병.",
        "en": "Eighteen years in oak seasoned with sherry in Jerez — the bottle Macallan is known for.",
        "zh": "只在赫雷斯以雪莉酒润养的橡木桶中陈年18年。Macallan 的代表之作。",
        "ja": "ヘレスでシェリーを染み込ませたオーク樽だけで18年。Macallanを象徴する一本。"
      },
      "nose": {
        "ko": "말린 과일, 생강, 오렌지 껍질",
        "en": "Dried fruit, ginger, orange peel",
        "zh": "果干、生姜、橙皮",
        "ja": "ドライフルーツ、ジンジャー、オレンジピール"
      },
      "palate": {
        "ko": "건포도, 다크 초콜릿, 시나몬",
        "en": "Raisin, dark chocolate, cinnamon",
        "zh": "葡萄干、黑巧克力、肉桂",
        "ja": "レーズン、ダークチョコレート、シナモン"
      },
      "finish": {
        "ko": "길고 따뜻한 말린 과일과 스파이스",
        "en": "Long and warm, dried fruit and spice",
        "zh": "悠长温暖，果干与香料",
        "ja": "長く温かい、ドライフルーツとスパイス"
      },
      "photo": "img/menu/macallan-18.webp",
      "photoCredit": null
    },
    "blantons": {
      "kind": {
        "ko": "켄터키 스트레이트 버번",
        "en": "Kentucky straight bourbon",
        "zh": "肯塔基纯波本威士忌",
        "ja": "ケンタッキー・ストレート・バーボン"
      },
      "region": {
        "ko": "미국 켄터키",
        "en": "Kentucky, USA",
        "zh": "美国肯塔基州",
        "ja": "ケンタッキー州（アメリカ）"
      },
      "abv": "46.5%",
      "cask": {
        "ko": "싱글 배럴 (새 아메리칸 오크)",
        "en": "Single barrel, new American oak",
        "zh": "单桶（全新美国橡木桶）",
        "ja": "シングルバレル（アメリカンオークの新樽）"
      },
      "about": {
        "ko": "처음으로 \"싱글 배럴\"을 내건 버번. 병마개의 경주마는 8가지 자세라 모으는 사람도 있다.",
        "en": "The first bourbon sold as a single barrel. The racehorse stopper comes in eight poses — people collect them.",
        "zh": "首款打出“单桶”旗号的波本。瓶塞上的赛马共有8种姿态，也有人专门收集。",
        "ja": "初めて「シングルバレル」を掲げたバーボン。栓の競走馬は8種類のポーズがあり、集める人もいる。"
      },
      "nose": {
        "ko": "바닐라, 캐러멜, 오렌지 껍질",
        "en": "Vanilla, caramel, orange peel",
        "zh": "香草、焦糖、橙皮",
        "ja": "バニラ、キャラメル、オレンジピール"
      },
      "palate": {
        "ko": "꿀, 토피, 시트러스",
        "en": "Honey, toffee, citrus",
        "zh": "蜂蜜、太妃糖、柑橘",
        "ja": "ハチミツ、トフィー、シトラス"
      },
      "finish": {
        "ko": "중간 길이, 따뜻한 스파이스",
        "en": "Medium, warm spice",
        "zh": "中等长度，温暖的香料",
        "ja": "ミディアム、温かなスパイス"
      },
      "photo": "img/menu/blantons.webp",
      "photoCredit": null
    },
    "dalmore-15": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 하이랜드",
        "en": "Highlands, Scotland",
        "zh": "苏格兰高地",
        "ja": "スコットランド・ハイランド"
      },
      "abv": "40%",
      "cask": {
        "ko": "버번 통 → 세 가지 셰리 통 마무리",
        "en": "Bourbon cask, finished in three sherry casks",
        "zh": "波本桶 → 三种雪莉桶过桶",
        "ja": "バーボン樽 → 3種のシェリー樽でフィニッシュ"
      },
      "about": {
        "ko": "병에 박힌 12갈래 뿔의 수사슴. 세 종류의 셰리 통에서 마무리한 하이랜드 몰트.",
        "en": "The twelve-point stag on the bottle. A Highland malt finished in three kinds of sherry cask.",
        "zh": "瓶身上嵌着12叉鹿角的雄鹿。在三种雪莉桶中过桶的高地麦芽威士忌。",
        "ja": "ボトルに刻まれた12本角の牡鹿。3種のシェリー樽でフィニッシュしたハイランドモルト。"
      },
      "nose": {
        "ko": "오렌지 마멀레이드, 크리스마스 케이크",
        "en": "Orange marmalade, Christmas cake",
        "zh": "橙子果酱、圣诞蛋糕",
        "ja": "オレンジマーマレード、クリスマスケーキ"
      },
      "palate": {
        "ko": "오렌지, 생강, 다크 초콜릿",
        "en": "Orange, ginger, dark chocolate",
        "zh": "橙子、生姜、黑巧克力",
        "ja": "オレンジ、ジンジャー、ダークチョコレート"
      },
      "finish": {
        "ko": "부드럽고 달콤한 향신료",
        "en": "Smooth, sweet spice",
        "zh": "柔顺甜美的香料",
        "ja": "なめらかで甘いスパイス"
      },
      "photo": "img/menu/dalmore-15.webp",
      "photoCredit": null
    },
    "aberlour-abunadh": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland",
        "zh": "苏格兰斯佩塞",
        "ja": "スコットランド・スペイサイド"
      },
      "abv": null,
      "abvNote": {
        "ko": "캐스크 스트렝스 · 배치마다 다름 (보통 60% 안팎)",
        "en": "Cask strength, varies by batch (around 60%)",
        "zh": "原桶强度 · 每批次不同（通常60%上下）",
        "ja": "カスクストレングス · バッチごとに異なる（通常60%前後）"
      },
      "cask": {
        "ko": "올로로소 셰리",
        "en": "Oloroso sherry",
        "zh": "Oloroso 雪莉桶",
        "ja": "オロロソ・シェリー樽"
      },
      "about": {
        "ko": "물을 섞지 않고 통에서 꺼낸 그대로. 이름은 게일어로 \"근원\". 물을 몇 방울 떨어뜨려 보는 것도 좋다.",
        "en": "Bottled straight from the cask, no water added. Gaelic for \"the origin\". Try a few drops of water.",
        "zh": "不加水稀释，出桶即装瓶。名字在盖尔语中意为“本源”。不妨滴几滴水试试。",
        "ja": "加水せず、樽から出したそのままの姿で。名前はゲール語で「起源」。数滴の加水を試すのもおすすめ。"
      },
      "nose": {
        "ko": "오렌지, 체리, 다크 초콜릿",
        "en": "Orange, cherry, dark chocolate",
        "zh": "橙子、樱桃、黑巧克力",
        "ja": "オレンジ、チェリー、ダークチョコレート"
      },
      "palate": {
        "ko": "진한 셰리, 건포도, 생강",
        "en": "Rich sherry, raisin, ginger",
        "zh": "浓郁雪莉、葡萄干、生姜",
        "ja": "濃厚なシェリー、レーズン、ジンジャー"
      },
      "finish": {
        "ko": "길고 묵직",
        "en": "Long and heavy",
        "zh": "悠长厚重",
        "ja": "長く重厚"
      },
      "photo": "img/menu/aberlour-abunadh.webp",
      "photoCredit": null
    },
    "glenallachie-15": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland",
        "zh": "苏格兰斯佩塞",
        "ja": "スコットランド・スペイサイド"
      },
      "abv": "46%",
      "cask": {
        "ko": "페드로 히메네스 · 올로로소 셰리",
        "en": "Pedro Ximénez and Oloroso sherry",
        "zh": "Pedro Ximénez (PX) · Oloroso 雪莉桶",
        "ja": "ペドロ・ヒメネス（PX） · オロロソ・シェリー樽"
      },
      "about": {
        "ko": "업계의 전설 빌리 워커가 되살린 증류소의 15년. 냉각 여과 없이, 색소 없이.",
        "en": "Fifteen years from the distillery Billy Walker revived. No chill filtering, no added colour.",
        "zh": "业界传奇 Billy Walker 重振的酒厂所出的15年。非冷凝过滤，不添加焦糖色。",
        "ja": "業界の伝説、Billy Walkerが復活させた蒸溜所の15年。ノンチルフィルタード、無着色。"
      },
      "nose": {
        "ko": "무화과, 건포도, 다크 초콜릿",
        "en": "Fig, raisin, dark chocolate",
        "zh": "无花果、葡萄干、黑巧克力",
        "ja": "イチジク、レーズン、ダークチョコレート"
      },
      "palate": {
        "ko": "셰리, 토피, 시나몬",
        "en": "Sherry, toffee, cinnamon",
        "zh": "雪莉、太妃糖、肉桂",
        "ja": "シェリー、トフィー、シナモン"
      },
      "finish": {
        "ko": "길고 달콤한 스파이스",
        "en": "Long, sweet spice",
        "zh": "悠长甜美的香料",
        "ja": "長く甘いスパイス"
      },
      "photo": "img/menu/glenallachie-15.webp",
      "photoCredit": null
    },
    "glendronach-12": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 하이랜드",
        "en": "Highlands, Scotland",
        "zh": "苏格兰高地",
        "ja": "スコットランド・ハイランド"
      },
      "abv": "43%",
      "cask": {
        "ko": "페드로 히메네스 · 올로로소 셰리",
        "en": "Pedro Ximénez and Oloroso sherry",
        "zh": "Pedro Ximénez (PX) · Oloroso 雪莉桶",
        "ja": "ペドロ・ヒメネス（PX） · オロロソ・シェリー樽"
      },
      "about": {
        "ko": "셰리 위스키를 처음 마신다면 흔히 권하는 한 잔. 달고 둥글다.",
        "en": "An often-recommended first sherried malt. Sweet and round.",
        "zh": "初尝雪莉桶威士忌时，常被推荐的一杯。甜美圆润。",
        "ja": "初めてのシェリー系ウイスキーによく勧められる一杯。甘くまろやか。"
      },
      "nose": {
        "ko": "건포도, 바닐라, 시나몬",
        "en": "Raisin, vanilla, cinnamon",
        "zh": "葡萄干、香草、肉桂",
        "ja": "レーズン、バニラ、シナモン"
      },
      "palate": {
        "ko": "셰리, 말린 과일, 견과",
        "en": "Sherry, dried fruit, nuts",
        "zh": "雪莉、果干、坚果",
        "ja": "シェリー、ドライフルーツ、ナッツ"
      },
      "finish": {
        "ko": "부드럽고 달콤",
        "en": "Soft and sweet",
        "zh": "柔和甜美",
        "ja": "やわらかく甘い"
      },
      "photo": "img/menu/glendronach-12.webp",
      "photoCredit": null
    },
    "woodford-reserve": {
      "kind": {
        "ko": "켄터키 스트레이트 버번",
        "en": "Kentucky straight bourbon",
        "zh": "肯塔基纯波本威士忌",
        "ja": "ケンタッキー・ストレート・バーボン"
      },
      "region": {
        "ko": "미국 켄터키",
        "en": "Kentucky, USA",
        "zh": "美国肯塔基州",
        "ja": "ケンタッキー州（アメリカ）"
      },
      "abv": null,
      "abvNote": {
        "ko": "43.2% (미국 판매분은 45.2%)",
        "en": "43.2% (45.2% in the US)",
        "zh": "43.2%（美国销售版为45.2%）",
        "ja": "43.2%（アメリカ国内向けは45.2%）"
      },
      "cask": {
        "ko": "새 아메리칸 오크 (내부를 태운 통)",
        "en": "New charred American oak",
        "zh": "全新炙烤美国橡木桶",
        "ja": "内側を焦がしたアメリカンオークの新樽"
      },
      "about": {
        "ko": "켄터키 더비의 공식 버번. 구리 단식 증류기로 세 번 증류한 원액을 섞어 만든다.",
        "en": "The official bourbon of the Kentucky Derby, blended with whiskey triple-distilled in copper pot stills.",
        "zh": "肯塔基德比的官方波本。调入了以铜制壶式蒸馏器三次蒸馏的原酒。",
        "ja": "ケンタッキーダービーの公式バーボン。銅製ポットスチルで3回蒸溜した原酒をブレンドして造る。"
      },
      "nose": {
        "ko": "바닐라, 캐러멜, 말린 과일",
        "en": "Vanilla, caramel, dried fruit",
        "zh": "香草、焦糖、果干",
        "ja": "バニラ、キャラメル、ドライフルーツ"
      },
      "palate": {
        "ko": "코코아, 토피, 시나몬",
        "en": "Cocoa, toffee, cinnamon",
        "zh": "可可、太妃糖、肉桂",
        "ja": "ココア、トフィー、シナモン"
      },
      "finish": {
        "ko": "실키하고 스파이시",
        "en": "Silky and spicy",
        "zh": "丝滑而辛香",
        "ja": "シルキーでスパイシー"
      },
      "photo": "img/menu/woodford-reserve.webp",
      "photoCredit": null
    },
    "dewars-12": {
      "kind": {
        "ko": "블렌디드 스카치",
        "en": "Blended Scotch",
        "zh": "调和苏格兰威士忌",
        "ja": "ブレンデッド・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드",
        "en": "Scotland",
        "zh": "苏格兰",
        "ja": "スコットランド"
      },
      "abv": "40%",
      "cask": {
        "ko": "블렌딩 후 오크 통에서 한 번 더 숙성 (더블 에이징)",
        "en": "Married again in oak after blending (\"double aged\")",
        "zh": "调和后再入橡木桶陈酿一次（双重陈酿）",
        "ja": "ブレンド後にオーク樽で再熟成（ダブルエイジ）"
      },
      "about": {
        "ko": "섞은 뒤 다시 통에서 재워 부드럽게 만든 블렌디드. 하이볼로도 좋다.",
        "en": "Blended, then rested in oak again for smoothness. Great as a highball too.",
        "zh": "调和后再次入桶静置，口感更柔顺的调和威士忌。做成嗨棒也很好。",
        "ja": "ブレンド後、再び樽で寝かせてまろやかに仕上げたブレンデッド。ハイボールにもおすすめ。"
      },
      "nose": {
        "ko": "꿀, 바닐라, 서양배",
        "en": "Honey, vanilla, pear",
        "zh": "蜂蜜、香草、西洋梨",
        "ja": "ハチミツ、バニラ、洋梨"
      },
      "palate": {
        "ko": "부드러운 꿀, 캐러멜",
        "en": "Soft honey, caramel",
        "zh": "柔和的蜂蜜、焦糖",
        "ja": "やさしいハチミツ、キャラメル"
      },
      "finish": {
        "ko": "가볍고 깔끔",
        "en": "Light and clean",
        "zh": "轻盈干净",
        "ja": "軽くすっきり"
      },
      "photo": "img/menu/dewars-12.webp",
      "photoCredit": null
    },
    "makers-mark": {
      "kind": {
        "ko": "켄터키 스트레이트 버번",
        "en": "Kentucky straight bourbon",
        "zh": "肯塔基纯波本威士忌",
        "ja": "ケンタッキー・ストレート・バーボン"
      },
      "region": {
        "ko": "미국 켄터키",
        "en": "Kentucky, USA",
        "zh": "美国肯塔基州",
        "ja": "ケンタッキー州（アメリカ）"
      },
      "abv": "45%",
      "cask": {
        "ko": "새 아메리칸 오크 (내부를 태운 통)",
        "en": "New charred American oak",
        "zh": "全新炙烤美国橡木桶",
        "ja": "内側を焦がしたアメリカンオークの新樽"
      },
      "about": {
        "ko": "호밀 대신 붉은 겨울 밀을 넣어 부드러운 버번. 병목의 빨간 왁스는 하나하나 손으로 담근다.",
        "en": "Red winter wheat instead of rye makes it soft. Every red wax top is hand-dipped.",
        "zh": "以红冬小麦代替黑麦，口感柔和的波本。瓶颈的红色封蜡，每一瓶都由手工蘸制。",
        "ja": "ライ麦の代わりに赤い冬小麦を使った、やわらかなバーボン。ボトルネックの赤い封蝋は一本ずつ手作業で浸したもの。"
      },
      "nose": {
        "ko": "캐러멜, 바닐라",
        "en": "Caramel, vanilla",
        "zh": "焦糖、香草",
        "ja": "キャラメル、バニラ"
      },
      "palate": {
        "ko": "부드러운 밀, 캐러멜, 과일",
        "en": "Soft wheat, caramel, fruit",
        "zh": "柔和的小麦、焦糖、水果",
        "ja": "やわらかな小麦、キャラメル、フルーツ"
      },
      "finish": {
        "ko": "짧고 달콤",
        "en": "Short and sweet",
        "zh": "短而甜美",
        "ja": "短く甘い"
      },
      "photo": "img/menu/makers-mark.webp",
      "photoCredit": null
    },
    "lagavulin-16": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 아일라",
        "en": "Islay, Scotland",
        "zh": "苏格兰艾雷岛",
        "ja": "スコットランド・アイラ"
      },
      "abv": "43%",
      "cask": {
        "ko": "주로 버번 통",
        "en": "Mostly ex-bourbon casks",
        "zh": "以波本桶为主",
        "ja": "主にバーボン樽"
      },
      "about": {
        "ko": "아일라 섬의 묵직한 피트 위스키를 대표하는 한 병. 모닥불 연기와 바다 냄새.",
        "en": "The classic heavy Islay peat. Bonfire smoke and the sea.",
        "zh": "艾雷岛厚重泥煤威士忌的代表之作。篝火的烟与大海的气息。",
        "ja": "アイラ島の重厚なピートウイスキーを代表する一本。焚き火の煙と海の香り。"
      },
      "nose": {
        "ko": "피트 스모크, 요오드, 해초",
        "en": "Peat smoke, iodine, seaweed",
        "zh": "泥煤烟熏、碘、海藻",
        "ja": "ピートスモーク、ヨード、海藻"
      },
      "palate": {
        "ko": "스모크, 셰리 같은 단맛, 짠맛",
        "en": "Smoke, sherry-like sweetness, salt",
        "zh": "烟熏、雪莉般的甜味、咸味",
        "ja": "スモーク、シェリーのような甘み、塩気"
      },
      "finish": {
        "ko": "아주 길고 스모키",
        "en": "Very long and smoky",
        "zh": "极其悠长而烟熏",
        "ja": "とても長くスモーキー"
      },
      "photo": "img/menu/lagavulin-16.webp",
      "photoCredit": {"author": "Céréales Killer", "license": "CC BY-SA 3.0", "url": "https://commons.wikimedia.org/wiki/File:Lagavulin_Single_Islay_Malt_16.jpg"}
    },
    "ardbeg-10": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 아일라",
        "en": "Islay, Scotland",
        "zh": "苏格兰艾雷岛",
        "ja": "スコットランド・アイラ"
      },
      "abv": "46%",
      "cask": {
        "ko": "버번 통 · 냉각 여과 없음",
        "en": "Ex-bourbon casks, not chill-filtered",
        "zh": "波本桶 · 非冷凝过滤",
        "ja": "バーボン樽 · ノンチルフィルタード"
      },
      "about": {
        "ko": "가장 스모키한 아일라 몰트로 자주 꼽히는 10년. 강하지만 레몬처럼 상쾌한 끝.",
        "en": "Often called the smokiest Islay ten-year-old. Fierce, with a lemony lift.",
        "zh": "这款10年常被推为烟熏感最强的艾雷岛麦芽威士忌。劲道十足，收尾却如柠檬般清爽。",
        "ja": "最もスモーキーなアイラモルトとしてよく名が挙がる10年。力強くも、レモンのように爽やかな後味。"
      },
      "nose": {
        "ko": "피트, 레몬, 타르",
        "en": "Peat, lemon, tar",
        "zh": "泥煤、柠檬、焦油",
        "ja": "ピート、レモン、タール"
      },
      "palate": {
        "ko": "스모크, 에스프레소, 시트러스",
        "en": "Smoke, espresso, citrus",
        "zh": "烟熏、意式浓缩咖啡、柑橘",
        "ja": "スモーク、エスプレッソ、シトラス"
      },
      "finish": {
        "ko": "길고 스모키",
        "en": "Long and smoky",
        "zh": "悠长而烟熏",
        "ja": "長くスモーキー"
      },
      "photo": "img/menu/ardbeg-10.webp",
      "photoCredit": {"author": "DYVER", "license": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:Ardbeg_10_Jahre_Flasche.jpg"}
    },
    "glenmorangie-nectar-dor": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 하이랜드",
        "en": "Highlands, Scotland",
        "zh": "苏格兰高地",
        "ja": "スコットランド・ハイランド"
      },
      "abv": "46%",
      "cask": {
        "ko": "버번 통 → 프랑스 소테른 와인 통 마무리",
        "en": "Bourbon cask, finished in Sauternes wine casks",
        "zh": "波本桶 → 法国苏玳 (Sauternes) 贵腐甜酒桶过桶",
        "ja": "バーボン樽 → フランス産ソーテルヌ（貴腐ワイン）樽でフィニッシュ"
      },
      "about": {
        "ko": "프랑스 디저트 와인(소테른) 통에서 마무리해 꿀처럼 달고 부드럽다.",
        "en": "Finished in casks that held Sauternes, the French dessert wine. Honeyed and smooth.",
        "zh": "在法国甜酒苏玳 (Sauternes) 的酒桶中过桶，如蜂蜜般甜润柔滑。",
        "ja": "フランスのデザートワイン（ソーテルヌ）の樽でフィニッシュ。ハチミツのように甘くなめらか。"
      },
      "nose": {
        "ko": "꿀, 레몬, 아몬드",
        "en": "Honey, lemon, almond",
        "zh": "蜂蜜、柠檬、杏仁",
        "ja": "ハチミツ、レモン、アーモンド"
      },
      "palate": {
        "ko": "꿀, 생강, 넛맥",
        "en": "Honey, ginger, nutmeg",
        "zh": "蜂蜜、生姜、肉豆蔻",
        "ja": "ハチミツ、ジンジャー、ナツメグ"
      },
      "finish": {
        "ko": "길고 달콤",
        "en": "Long and sweet",
        "zh": "悠长甜美",
        "ja": "長く甘い"
      },
      "photo": "img/menu/glenmorangie-nectar-dor.webp",
      "photoCredit": null
    },
    "balvenie-14-caribbean": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland",
        "zh": "苏格兰斯佩塞",
        "ja": "スコットランド・スペイサイド"
      },
      "abv": "43%",
      "cask": {
        "ko": "버번 통 → 카리브 럼 통 마무리",
        "en": "Bourbon cask, finished in Caribbean rum casks",
        "zh": "波本桶 → 加勒比朗姆酒桶过桶",
        "ja": "バーボン樽 → カリビアン・ラム樽でフィニッシュ"
      },
      "about": {
        "ko": "카리브 럼을 담았던 통에서 마무리해 토피와 열대 과일 향이 난다.",
        "en": "Finished in casks that held Caribbean rum: toffee and tropical fruit.",
        "zh": "在盛过加勒比朗姆酒的酒桶中过桶，带有太妃糖与热带水果的香气。",
        "ja": "カリブ産ラムを貯蔵していた樽でフィニッシュ。トフィーとトロピカルフルーツの香り。"
      },
      "nose": {
        "ko": "토피, 바닐라, 열대 과일",
        "en": "Toffee, vanilla, tropical fruit",
        "zh": "太妃糖、香草、热带水果",
        "ja": "トフィー、バニラ、トロピカルフルーツ"
      },
      "palate": {
        "ko": "바닐라, 토피, 달콤한 오크",
        "en": "Vanilla, toffee, sweet oak",
        "zh": "香草、太妃糖、甜美的橡木",
        "ja": "バニラ、トフィー、甘いオーク"
      },
      "finish": {
        "ko": "부드럽고 따뜻",
        "en": "Soft and warm",
        "zh": "柔和温暖",
        "ja": "やわらかく温かい"
      },
      "photo": "img/menu/balvenie-14-caribbean.webp",
      "photoCredit": null
    },
    "octomore-16-3": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch",
        "zh": "单一麦芽苏格兰威士忌",
        "ja": "シングルモルト・スコッチ"
      },
      "region": {
        "ko": "스코틀랜드 아일라 (브룩라디)",
        "en": "Islay, Scotland (Bruichladdich)",
        "zh": "苏格兰艾雷岛（Bruichladdich）",
        "ja": "スコットランド・アイラ（Bruichladdich）"
      },
      "abv": null,
      "abvNote": {
        "ko": "캐스크 스트렝스 · 정확한 도수와 피트 수치는 병 라벨 참고",
        "en": "Cask strength; see the label for exact ABV and peating",
        "zh": "原桶强度 · 确切酒精度与泥煤值请见酒标",
        "ja": "カスクストレングス · 正確な度数とピート値はボトルのラベルを参照"
      },
      "cask": null,
      "about": {
        "ko": "세상에서 가장 강한 피트 위스키로 손꼽히는 시리즈. \".3\" 판은 아일라 섬에서 키운 보리로 만든다. 이 메뉴판의 마지막 장.",
        "en": "Among the most heavily peated whiskies made. The \".3\" editions use barley grown on Islay. The last page of this menu.",
        "zh": "被列为世上泥煤味最重的威士忌系列之一。“.3”版以艾雷岛种植的大麦酿造。本酒单的最后一页。",
        "ja": "世界で最もピートの強いウイスキーに数えられるシリーズ。「.3」はアイラ島で育った大麦から造られる。このメニューの最終ページ。"
      },
      "nose": {
        "ko": "강한 피트, 바다, 달콤한 보리",
        "en": "Massive peat, sea air, sweet barley",
        "zh": "强劲泥煤、海洋气息、甜美的大麦",
        "ja": "強烈なピート、海、甘い大麦"
      },
      "palate": {
        "ko": "불, 스모크, 과일",
        "en": "Fire, smoke, fruit",
        "zh": "火焰、烟熏、水果",
        "ja": "炎、スモーク、フルーツ"
      },
      "finish": {
        "ko": "아주 길다",
        "en": "Very long",
        "zh": "极其悠长",
        "ja": "とても長い"
      },
      "photo": "img/menu/octomore-16-3.webp",
      "photoCredit": null
    },
    "old-fashioned": {
      "kind": {
        "ko": "클래식 칵테일",
        "en": "Classic cocktail",
        "zh": "经典鸡尾酒",
        "ja": "クラシックカクテル"
      },
      "region": null,
      "abv": null,
      "recipe": {
        "ko": "버번(또는 라이) · 설탕 · 앙고스투라 비터스 · 오렌지 필",
        "en": "Bourbon or rye, sugar, Angostura bitters, orange peel",
        "zh": "波本（或黑麦威士忌） · 糖 · Angostura 苦精 · 橙皮",
        "ja": "バーボン（またはライ） · 砂糖 · Angostura ビターズ · オレンジピール"
      },
      "about": {
        "ko": "\"칵테일\"이라는 말이 막 생겼을 무렵의 방식 그대로. 위스키를 가장 위스키답게 마시는 한 잔.",
        "en": "Made the way the word \"cocktail\" first meant it. Whisky, at its most whisky.",
        "zh": "沿用“鸡尾酒”一词刚诞生时的做法。让威士忌喝起来最像威士忌的一杯。",
        "ja": "「カクテル」という言葉が生まれた頃の作り方そのままに。ウイスキーを最もウイスキーらしく味わう一杯。"
      },
      "nose": {
        "ko": "오렌지 껍질, 바닐라",
        "en": "Orange peel, vanilla",
        "zh": "橙皮、香草",
        "ja": "オレンジピール、バニラ"
      },
      "palate": {
        "ko": "진한 위스키, 은은한 단맛, 비터스",
        "en": "Rich whisky, gentle sweetness, bitters",
        "zh": "浓郁的威士忌、淡淡甜味、苦精",
        "ja": "濃厚なウイスキー、ほのかな甘み、ビターズ"
      },
      "finish": {
        "ko": "따뜻하고 길다",
        "en": "Warm and long",
        "zh": "温暖而悠长",
        "ja": "温かく長い"
      },
      "photo": "img/menu/old-fashioned.webp",
      "photoCredit": null
    },
    "cracker": {
      "kind": {
        "ko": "안주",
        "en": "Bite",
        "zh": "小食",
        "ja": "おつまみ"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "트러플 크래커에 블루베리 크림을 얹어 먹는 플레이트. 블루베리 · 올리브 · 아몬드가 곁들여 나온다.",
        "en": "Truffle crackers to spread with blueberry cream, with blueberries, olives and almonds on the side.",
        "zh": "把蓝莓奶油抹在松露薄脆饼干上享用的拼盘，佐以蓝莓 · 橄榄 · 杏仁。",
        "ja": "トリュフクラッカーにブルーベリークリームをのせて味わうプレート。ブルーベリー · オリーブ · アーモンドを添えて。"
      },
      "plate": {
        "ko": "트러플 크래커 · 블루베리크림 · 블루베리 · 올리브 · 아몬드",
        "en": "Truffle crackers, blueberry cream, blueberries, olives, almonds",
        "zh": "松露薄脆饼干 · 蓝莓奶油 · 蓝莓 · 橄榄 · 杏仁",
        "ja": "トリュフクラッカー · ブルーベリークリーム · ブルーベリー · オリーブ · アーモンド"
      },
      "scene": true,
      "photo": "img/menu/cracker.webp",
      "photoCredit": null
    },
    "cherry-yogurt-pudding": {
      "kind": {
        "ko": "안주 · 디저트",
        "en": "Bite · dessert",
        "zh": "小食 · 甜点",
        "ja": "おつまみ · デザート"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "잔에 담아 내는 요거트 푸딩에 체리를 듬뿍 올린 디저트.",
        "en": "Yogurt pudding served in a coupe, heaped with cherries.",
        "zh": "盛在杯中的酸奶布丁，上面堆满樱桃的甜点。",
        "ja": "グラスに盛ったヨーグルトプリンに、チェリーをたっぷりのせたデザート。"
      },
      "plate": {
        "ko": "체리 요거트 푸딩 · 체리",
        "en": "Cherry yogurt pudding, cherries",
        "zh": "樱桃酸奶布丁 · 樱桃",
        "ja": "チェリーヨーグルトプリン · チェリー"
      },
      "scene": true,
      "photo": "img/menu/cherry-yogurt-pudding.webp",
      "photoCredit": null
    },
    "cheesecake": {
      "kind": {
        "ko": "안주 · 디저트",
        "en": "Bite · dessert",
        "zh": "小食 · 甜点",
        "ja": "おつまみ · デザート"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "치즈케이크 한 조각에 블루베리 크림과 블루베리를 곁들인 디저트.",
        "en": "A slice of cheesecake with blueberry cream and blueberries.",
        "zh": "一块芝士蛋糕，搭配蓝莓奶油与蓝莓的甜点。",
        "ja": "チーズケーキ1切れに、ブルーベリークリームとブルーベリーを添えたデザート。"
      },
      "plate": {
        "ko": "치즈케이크 · 블루베리크림 · 블루베리",
        "en": "Cheesecake, blueberry cream, blueberries",
        "zh": "芝士蛋糕 · 蓝莓奶油 · 蓝莓",
        "ja": "チーズケーキ · ブルーベリークリーム · ブルーベリー"
      },
      "scene": true,
      "photo": "img/menu/cheesecake.webp",
      "photoCredit": null
    },
    "acqua-panna": {
      "kind": {
        "ko": "생수 · 탄산 없음",
        "en": "Still mineral water",
        "zh": "矿泉水 · 无气泡",
        "ja": "ミネラルウォーター · 炭酸なし"
      },
      "region": {
        "ko": "이탈리아 토스카나",
        "en": "Tuscany, Italy",
        "zh": "意大利托斯卡纳",
        "ja": "イタリア・トスカーナ"
      },
      "abv": null,
      "about": {
        "ko": "토스카나 언덕의 샘에서 나는 이탈리아 내추럴 미네랄워터. 순하고 부드러워서 위스키 사이사이 입을 헹구는 체이서로 좋다.",
        "en": "Natural mineral water from a spring in the Tuscan hills. Soft and smooth — a good chaser between whiskies.",
        "zh": "源自托斯卡纳山丘泉眼的意大利天然矿泉水。口感温和柔顺，很适合在威士忌之间用来清口。",
        "ja": "トスカーナの丘の泉から湧く、イタリアのナチュラルミネラルウォーター。やさしくまろやかで、ウイスキーの合間に口をリセットするチェイサーにおすすめ。"
      },
      "photo": "img/menu/acqua-panna.webp",
      "photoCredit": {"author": "Smuconlaw", "license": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:Acqua_Panna_mineral_water_in_a_glass_bottle_-_20140408.jpg"}
    },
    "coke": {
      "kind": {
        "ko": "탄산음료 · 캔",
        "en": "Soft drink · can",
        "zh": "软饮 · 罐装",
        "ja": "ソフトドリンク · 缶"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "코카콜라 오리지널.",
        "en": "Coca-Cola Original.",
        "zh": "Coca-Cola 经典原味。",
        "ja": "Coca-Cola Original。"
      },
      "photo": "img/menu/coke.webp",
      "photoCredit": {"author": "James Larrison", "license": "CC BY 2.0", "url": "https://commons.wikimedia.org/wiki/File:Coca-Cola_Trio-_Zero_Sugar,_Original,_and_Diet_Coke.jpg"}
    },
    "coke-zero": {
      "kind": {
        "ko": "탄산음료 · 캔",
        "en": "Soft drink · can",
        "zh": "软饮 · 罐装",
        "ja": "ソフトドリンク · 缶"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "설탕 없는 코카콜라 제로.",
        "en": "Coca-Cola Zero Sugar.",
        "zh": "无糖的 Coca-Cola Zero。",
        "ja": "砂糖不使用のCoca-Cola Zero Sugar。"
      },
      "photo": "img/menu/coke-zero.webp",
      "photoCredit": {"author": "James Larrison", "license": "CC BY 2.0", "url": "https://commons.wikimedia.org/wiki/File:Coca-Cola_Trio-_Zero_Sugar,_Original,_and_Diet_Coke.jpg"}
    },
    "ginger-ale": {
      "kind": {
        "ko": "탄산음료",
        "en": "Soft drink",
        "zh": "软饮",
        "ja": "ソフトドリンク"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "캐나다드라이 진저에일. 생강 향이 은은하고 달지 않은 편이라 위스키에 섞어 마시기도 좋다.",
        "en": "Canada Dry Ginger Ale — gently gingery and not too sweet, so it also mixes well with whisky.",
        "zh": "Canada Dry 干姜水。姜香淡雅，不太甜，也很适合兑威士忌饮用。",
        "ja": "Canada Dryのジンジャーエール。生姜の香りがほのかで甘さ控えめなので、ウイスキーで割るのにもぴったり。"
      },
      "photo": "img/menu/ginger-ale.webp",
      "photoCredit": {"author": "Fmvh", "license": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:Canada_Dry_ginger_ale_can.jpg"}
    },
    "soda-water": {
      "kind": {
        "ko": "탄산수",
        "en": "Sparkling water",
        "zh": "气泡水",
        "ja": "炭酸水"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "단맛도 향도 없는 탄산수. 그대로 마시거나, 위스키에 부어 하이볼로.",
        "en": "Plain sparkling water, no sugar, no flavour. On its own, or poured over whisky for a highball.",
        "zh": "不甜也无香的气泡水。可直接饮用，或倒入威士忌做成嗨棒。",
        "ja": "甘みも香りもない炭酸水。そのままで、またはウイスキーに注いでハイボールに。"
      },
      "photo": "img/menu/soda-water.webp",
      "photoCredit": {"author": "Égoïté", "license": "CC BY-SA 3.0", "url": "https://commons.wikimedia.org/wiki/File:Verre-eau-gazeuse-au-jardin.jpg", "gray": true}
    }
  },

  /* 1층 배너 QR 홍보 사이트 (promo/ — 테이블 설문 사이트와 별개의 주소). 그 사이트가 이 파일을 읽어 그립니다.
     null 인 칸은 화면에 나오지 않습니다 — 알게 되면 채워 주세요.
     hours: 요일(0=일 … 6=토)마다 여는 시각 · 닫는 시각 · 라스트오더(last, 없어도 됨).
       닫는 시각이 여는 시각보다 이르면 다음 날 새벽. 빠진 요일은 쉬는 날. */
  promo: {
    floor: 5,
    // 사장님 제공 2026-10-26 (네이버 · 카카오 지도 등록 내용)
    address: { ko: "서울 송파구 백제고분로41길 42-20, 5층", en: "5F, 42-20 Baekjegobun-ro 41-gil, Songpa-gu, Seoul", zh: "首尔 松坡区 百济古坟路41街 42-20, 5楼", ja: "ソウル 松坡区 百済古墳路41ギル 42-20、5階" },
    station: { ko: "잠실역 2·8호선 10번 출구에서 900m", en: "900 m from Jamsil Station (Lines 2 & 8), Exit 10", zh: "距蚕室站（2号线、8号线）10号出口900米", ja: "蚕室（チャムシル）駅 2・8号線 10番出口から900m" },
    directions: { ko: "건물 입구로 들어오시면 바로 엘리베이터가 있어요. 5층으로 올라와 주세요.", en: "The elevator is just inside the building entrance. Take it up to the 5th floor.", zh: "进入大楼入口后就是电梯，请乘电梯上5楼。", ja: "建物の入口を入るとすぐにエレベーターがあります。5階までお上がりください。" },
    parking: { ko: "주차는 지원되지 않아요 · 근처 주차장을 이용해 주세요", en: "No parking on site · please use a nearby parking lot", zh: "本店不提供停车 · 请使用附近停车场", ja: "駐車場のご用意はありません · 近くの駐車場をご利用ください" },
    maps: [
      { name: { ko: "네이버 지도", en: "Naver Map", zh: "Naver 地图", ja: "NAVER マップ" }, url: "https://naver.me/GUTF4SLo" },
      { name: { ko: "카카오맵", en: "Kakao Map", zh: "Kakao 地图", ja: "カカオマップ" }, url: "https://kko.to/4nOHx5G0m" }
    ],
    // 영업 요일(0 = 일요일 … 6 = 토요일) · 여는 시간 · 닫는 시간 · 라스트오더. 월요일만 휴무 (일요일도 영업 — 네이버에는 아직 일요일 휴무로 나옴).
    // ★ 사장님은 /admin 의 "가게 정보"에서 바꿀 수 있다 (거기서 저장한 값이 여기 값보다 먼저). "매주 월요일 휴무" 같은 안내는 요일에서 자동으로 만들어진다.
    hours: [{ days: [0, 2, 3, 4, 5, 6], open: "20:00", close: "02:00", last: "01:30" }],
    instagram: "deadlysins.bar",   // @ 없이
    phone: "0507-1304-6522",   // 네이버 스마트콜 가상번호 (사장님 2026-10-27, 개인 010 번호는 싣지 않음) — 누르면 바로 전화
    email: "deadly_sins@naver.com",  // 누르면 메일 앱
    offer: null,         // { ko: "1층 QR 보고 왔다고 말씀해 주세요", en: "…" }
    // 바 안 사진 (사장님 제공 2026-10-25, 원본은 photos/room/). 빼고 싶으면 그 칸을 null 로
    photos: {
      wall: "img/room/sin-wall.webp",       // 일곱 죄 포스터 벽 — 콘셉트 아래
      entrance: "img/room/entrance.webp",   // 입구 간판 — 오시는 길
      room: ["img/room/couple.webp", "img/room/table.webp", "img/room/long-table.webp"]   // 바 안 풍경
    }
  },

  /* 결과 · 오류 익명 기록 (→ /api/track → Neon). 끄려면 false.
     Neon 이 Vercel 프로젝트에 연결되기 전에는 서버가 받은 기록을 그냥 버립니다. README 의 "결과 기록" 참고. */
  collect: { enabled: true }
};
