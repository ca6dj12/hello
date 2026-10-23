/* =============================================================
   DEADLY SINS — 가격 · 메뉴 · 맛 정보
   가격이나 메뉴가 바뀌면 이 파일만 고치면 됩니다 (빌드 불필요).

   ※ 시그니처 일곱 잔 가격(signaturePrice)은 2026-10-17 에 16,000원으로 확인.
     위스키 · 안주 · 음료 가격은 2026-09-18 메뉴판 사진 기준이라,
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
        "confirmed": true
      },
      "style": {
        "ko": "깊고 우아한",
        "en": "Deep and elegant"
      },
      "desc": {
        "ko": "깊고 부드러운 맛에 화사한 꽃향을 더해 우아한 느낌을 표현한 칵테일.",
        "en": "Deep, smooth flavour lifted with bright florals — a cocktail of quiet elegance."
      },
      "aroma": {
        "ko": "꽃 향기, 시트러스",
        "en": "Florals, citrus"
      },
      "taste": {
        "ko": "가벼운 단맛, 약간 쌉싸름한",
        "en": "Lightly sweet, faintly bitter"
      },
      "finish": {
        "ko": "드라이하고 부드러운",
        "en": "Dry and smooth"
      },
      "strength": {
        "ko": "중간",
        "en": "Medium"
      },
      "level": 3
    },
    "질": {
      "line": {
        "ko": "상큼한 열망이 톡 쏘며, 마음을 간질인다.",
        "en": "A bright longing fizzes up and tickles the heart.",
        "confirmed": true
      },
      "style": {
        "ko": "상큼하고 쌉쌀한",
        "en": "Bright and bittersweet"
      },
      "desc": {
        "ko": "상큼함과 쌉쌀함의 대비로 질투의 양면성을 표현한 칵테일.",
        "en": "Bright against bitter — a cocktail for the two faces of envy."
      },
      "aroma": {
        "ko": "베르가못, 오렌지",
        "en": "Bergamot, orange"
      },
      "taste": {
        "ko": "상큼하고 은은한 산미",
        "en": "Fresh, with a gentle acidity"
      },
      "finish": {
        "ko": "짧고 깔끔한",
        "en": "Short and clean"
      },
      "strength": {
        "ko": "낮음",
        "en": "Low"
      },
      "level": 1
    },
    "분": {
      "line": {
        "ko": "불꽃처럼 타오르는 열기가 목을 타고 흐르며 뜨거운 에너지가 폭발한다.",
        "en": "Heat that burns like a flame runs down the throat, then bursts.",
        "confirmed": true
      },
      "style": {
        "ko": "강렬하고 스모키한",
        "en": "Intense and smoky"
      },
      "desc": {
        "ko": "높은 도수와 짙은 훈연 향으로 분노의 강렬함을 표현한 칵테일.",
        "en": "High proof and deep smoke — a cocktail with all the force of wrath."
      },
      "aroma": {
        "ko": "스모키, 구운 오크",
        "en": "Smoke, toasted oak"
      },
      "taste": {
        "ko": "다층적이고 강렬한",
        "en": "Layered and forceful"
      },
      "finish": {
        "ko": "길고 묵직한 여운",
        "en": "Long and heavy"
      },
      "strength": {
        "ko": "매우 높음",
        "en": "Very high"
      },
      "level": 5
    },
    "나": {
      "line": {
        "ko": "부드럽고 상쾌한 맛이 나른함을 풀어주며 편안한 쉼을 안겨준다.",
        "en": "Smooth and refreshing, it loosens you up and hands you a slow, easy rest.",
        "confirmed": true
      },
      "style": {
        "ko": "가볍고 청량한",
        "en": "Light and crisp"
      },
      "desc": {
        "ko": "가볍고 청량한 맛으로 편안하고 느슨한 느낌을 표현한 칵테일.",
        "en": "Light and crisp — a cocktail for an easy, unhurried, loosened-up mood."
      },
      "aroma": {
        "ko": "진저, 시트러스",
        "en": "Ginger, citrus"
      },
      "taste": {
        "ko": "가볍고 향긋한 스파이시",
        "en": "Light, fragrant spice"
      },
      "finish": {
        "ko": "짧고 깔끔한",
        "en": "Short and clean"
      },
      "strength": {
        "ko": "낮음",
        "en": "Low"
      },
      "level": 1
    },
    "탐": {
      "line": {
        "ko": "달콤한 유혹과 쌉싸름한 깊이가 교차하며 끝없는 욕망을 부른다.",
        "en": "Sweet temptation crosses bitter depth and calls for more.",
        "confirmed": true
      },
      "style": {
        "ko": "강하고 아로마틱한",
        "en": "Bold and aromatic"
      },
      "desc": {
        "ko": "짙은 허브향과 스파이시함으로 강한 욕망을 표현한 칵테일.",
        "en": "Dark herbs and spice — a cocktail of strong desire."
      },
      "aroma": {
        "ko": "레몬, 허브, 스파이시",
        "en": "Lemon, herbs, spice"
      },
      "taste": {
        "ko": "드라이, 은은한 단맛",
        "en": "Dry, with a quiet sweetness"
      },
      "finish": {
        "ko": "강렬한 시트러스",
        "en": "A sharp citrus close"
      },
      "strength": {
        "ko": "높음",
        "en": "High"
      },
      "level": 4
    },
    "식": {
      "line": {
        "ko": "따스한 시나몬 향이 입안을 가득 채우며 끝없이 탐식하게 만든다.",
        "en": "Warm cinnamon fills the mouth and keeps you reaching for more.",
        "confirmed": true
      },
      "style": {
        "ko": "달큰하고 농밀한",
        "en": "Sweet and rich"
      },
      "desc": {
        "ko": "달큰하고 농밀한 맛으로 풍성하고 계속 손이 가는 느낌을 표현한 칵테일.",
        "en": "Sweet and dense — a generous cocktail you keep reaching for."
      },
      "aroma": {
        "ko": "아몬드, 사과",
        "en": "Almond, apple"
      },
      "taste": {
        "ko": "달콤하고 부드러운",
        "en": "Sweet and soft"
      },
      "finish": {
        "ko": "따뜻하고 긴 여운",
        "en": "Warm and lingering"
      },
      "strength": {
        "ko": "중간",
        "en": "Medium"
      },
      "level": 3
    },
    "색": {
      "line": {
        "ko": "향긋하고 유혹적인 향기가 혀끝을 간질이며 감각을 자극한다.",
        "en": "A fragrant, tempting scent teases the tongue and wakes the senses.",
        "confirmed": true
      },
      "style": {
        "ko": "향긋하고 달콤한",
        "en": "Fragrant and sweet"
      },
      "desc": {
        "ko": "은은한 꽃향과 달콤함으로 부드럽고 유혹적인 느낌을 표현한 칵테일.",
        "en": "Soft florals and sweetness — a cocktail that feels gentle and seductive."
      },
      "aroma": {
        "ko": "꽃 향기, 시트러스",
        "en": "Florals, citrus"
      },
      "taste": {
        "ko": "달콤하고 부드러운",
        "en": "Sweet and soft"
      },
      "finish": {
        "ko": "깔끔하고 상쾌한",
        "en": "Clean and cool"
      },
      "strength": {
        "ko": "낮음",
        "en": "Low"
      },
      "level": 1
    }
  },

  /* 전체 메뉴. whisky[].sin 은 그 소제목이 어느 죄인지 */
  menu: {
    "whiskyHead": {
      "ko": "\"죄는 취향이 된다\"",
      "en": "\"Sin becomes taste\""
    },
    "whiskyNote": {
      "ko": "G · 글라스   |   B · 보틀",
      "en": "G · glass   |   B · bottle"
    },
    "whisky": [
      {
        "sin": "교",
        "label": {
          "ko": "\"난 달라\"",
          "en": "\"I'm not like them\""
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
          "en": "\"You want this, don't you?\""
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
          "en": "\"I want it richer\""
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
          "en": "\"I can't stop\""
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
          "en": "\"No thoughts\""
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
          "en": "\"Hit it hard\""
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
          "en": "\"So smooth..\""
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
        "en": "\"Ruin, or atonement\""
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
        "ko": "블루베리 페퍼 크래커",
        "en": "Blueberry Pepper Cracker", "id": "blueberry-pepper-cracker",
        "p": "8,000"
      },
      {
        "ko": "체리 요거트 크림",
        "en": "Cherry Yogurt Cream", "id": "cherry-yogurt-cream",
        "p": "8,000"
      }
    ],
    "cocktails": [
      {
        "ko": "올드패션드",
        "en": "Old Fashioned", "id": "old-fashioned",
        "p": "22,000"
      }
    ],
    "beverages": [
      {
        "ko": "아쿠아파나",
        "en": "Acqua Panna", "id": "acqua-panna",
        "p": "5,000"
      },
      {
        "ko": "콜라",
        "en": "Coke", "id": "coke",
        "p": "3,000"
      },
      {
        "ko": "콜라제로",
        "en": "Coke Zero", "id": "coke-zero",
        "p": "3,000"
      },
      {
        "ko": "진저에일",
        "en": "Ginger Ale", "id": "ginger-ale",
        "p": "3,000"
      },
      {
        "ko": "소다워터",
        "en": "Soda Water", "id": "soda-water",
        "p": "3,000"
      }
    ],
    "info": [
      {
        "ko": "커버차지는 없습니다. 편하게 즐겨주세요.",
        "en": "No cover charge. Please make yourself comfortable."
      },
      {
        "ko": "콜키지는 제공하지 않습니다. 양해 부탁드립니다.",
        "en": "We do not offer corkage. Thank you for understanding."
      },
      {
        "ko": "킵바틀은 첫 이용일로부터 1달간 보관됩니다. (재방문 시 10,000원)",
        "en": "Kept bottles are held for one month from first use. (10,000 KRW on a return visit)"
      },
      {
        "ko": "잔 및 기물 파손 시 구입가의 50%가 청구됩니다.",
        "en": "Broken glassware or fixtures are charged at 50% of the purchase price."
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
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland"
      },
      "abv": "43%",
      "cask": {
        "ko": "올로로소 셰리",
        "en": "Oloroso sherry"
      },
      "about": {
        "ko": "1865년부터 한 가문(그랜트 가)이 지켜 온 증류소의 25년 숙성. 셰리 통이 만든 깊이를 오래 즐기는 잔.",
        "en": "Twenty-five years from a distillery one family (the Grants) has run since 1865. Deep, slow, sherried."
      },
      "nose": {
        "ko": "건포도, 말린 과일, 셰리, 오크",
        "en": "Raisin, dried fruit, sherry, oak"
      },
      "palate": {
        "ko": "다크 초콜릿, 호두, 향신료",
        "en": "Dark chocolate, walnut, spice"
      },
      "finish": {
        "ko": "길고 드라이, 커피와 오크",
        "en": "Long and dry, coffee and oak"
      },
      "photo": "img/menu/glenfarclas-25.webp",
      "photoCredit": null
    },
    "macallan-18": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland"
      },
      "abv": "43%",
      "cask": {
        "ko": "스페인 헤레스 셰리 시즈닝 오크",
        "en": "Sherry-seasoned oak from Jerez"
      },
      "about": {
        "ko": "헤레스에서 셰리로 길들인 오크 통에서만 18년. 맥캘란을 상징하는 한 병.",
        "en": "Eighteen years in oak seasoned with sherry in Jerez — the bottle Macallan is known for."
      },
      "nose": {
        "ko": "말린 과일, 생강, 오렌지 껍질",
        "en": "Dried fruit, ginger, orange peel"
      },
      "palate": {
        "ko": "건포도, 다크 초콜릿, 시나몬",
        "en": "Raisin, dark chocolate, cinnamon"
      },
      "finish": {
        "ko": "길고 따뜻한 말린 과일과 스파이스",
        "en": "Long and warm, dried fruit and spice"
      },
      "photo": "img/menu/macallan-18.webp",
      "photoCredit": null
    },
    "blantons": {
      "kind": {
        "ko": "켄터키 스트레이트 버번",
        "en": "Kentucky straight bourbon"
      },
      "region": {
        "ko": "미국 켄터키",
        "en": "Kentucky, USA"
      },
      "abv": "46.5%",
      "cask": {
        "ko": "싱글 배럴 (새 아메리칸 오크)",
        "en": "Single barrel, new American oak"
      },
      "about": {
        "ko": "처음으로 \"싱글 배럴\"을 내건 버번. 병마개의 경주마는 8가지 자세라 모으는 사람도 있다.",
        "en": "The first bourbon sold as a single barrel. The racehorse stopper comes in eight poses — people collect them."
      },
      "nose": {
        "ko": "바닐라, 캐러멜, 오렌지 껍질",
        "en": "Vanilla, caramel, orange peel"
      },
      "palate": {
        "ko": "꿀, 토피, 시트러스",
        "en": "Honey, toffee, citrus"
      },
      "finish": {
        "ko": "중간 길이, 따뜻한 스파이스",
        "en": "Medium, warm spice"
      },
      "photo": "img/menu/blantons.webp",
      "photoCredit": null
    },
    "dalmore-15": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 하이랜드",
        "en": "Highlands, Scotland"
      },
      "abv": "40%",
      "cask": {
        "ko": "버번 통 → 세 가지 셰리 통 마무리",
        "en": "Bourbon cask, finished in three sherry casks"
      },
      "about": {
        "ko": "병에 박힌 12갈래 뿔의 수사슴. 세 종류의 셰리 통에서 마무리한 하이랜드 몰트.",
        "en": "The twelve-point stag on the bottle. A Highland malt finished in three kinds of sherry cask."
      },
      "nose": {
        "ko": "오렌지 마멀레이드, 크리스마스 케이크",
        "en": "Orange marmalade, Christmas cake"
      },
      "palate": {
        "ko": "오렌지, 생강, 다크 초콜릿",
        "en": "Orange, ginger, dark chocolate"
      },
      "finish": {
        "ko": "부드럽고 달콤한 향신료",
        "en": "Smooth, sweet spice"
      },
      "photo": "img/menu/dalmore-15.webp",
      "photoCredit": null
    },
    "aberlour-abunadh": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland"
      },
      "abv": null,
      "abvNote": {
        "ko": "캐스크 스트렝스 · 배치마다 다름 (보통 60% 안팎)",
        "en": "Cask strength, varies by batch (around 60%)"
      },
      "cask": {
        "ko": "올로로소 셰리",
        "en": "Oloroso sherry"
      },
      "about": {
        "ko": "물을 섞지 않고 통에서 꺼낸 그대로. 이름은 게일어로 \"근원\". 물을 몇 방울 떨어뜨려 보는 것도 좋다.",
        "en": "Bottled straight from the cask, no water added. Gaelic for \"the origin\". Try a few drops of water."
      },
      "nose": {
        "ko": "오렌지, 체리, 다크 초콜릿",
        "en": "Orange, cherry, dark chocolate"
      },
      "palate": {
        "ko": "진한 셰리, 건포도, 생강",
        "en": "Rich sherry, raisin, ginger"
      },
      "finish": {
        "ko": "길고 묵직",
        "en": "Long and heavy"
      },
      "photo": "img/menu/aberlour-abunadh.webp",
      "photoCredit": null
    },
    "glenallachie-15": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland"
      },
      "abv": "46%",
      "cask": {
        "ko": "페드로 히메네스 · 올로로소 셰리",
        "en": "Pedro Ximénez and Oloroso sherry"
      },
      "about": {
        "ko": "업계의 전설 빌리 워커가 되살린 증류소의 15년. 냉각 여과 없이, 색소 없이.",
        "en": "Fifteen years from the distillery Billy Walker revived. No chill filtering, no added colour."
      },
      "nose": {
        "ko": "무화과, 건포도, 다크 초콜릿",
        "en": "Fig, raisin, dark chocolate"
      },
      "palate": {
        "ko": "셰리, 토피, 시나몬",
        "en": "Sherry, toffee, cinnamon"
      },
      "finish": {
        "ko": "길고 달콤한 스파이스",
        "en": "Long, sweet spice"
      },
      "photo": "img/menu/glenallachie-15.webp",
      "photoCredit": null
    },
    "glendronach-12": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 하이랜드",
        "en": "Highlands, Scotland"
      },
      "abv": "43%",
      "cask": {
        "ko": "페드로 히메네스 · 올로로소 셰리",
        "en": "Pedro Ximénez and Oloroso sherry"
      },
      "about": {
        "ko": "셰리 위스키를 처음 마신다면 흔히 권하는 한 잔. 달고 둥글다.",
        "en": "An often-recommended first sherried malt. Sweet and round."
      },
      "nose": {
        "ko": "건포도, 바닐라, 시나몬",
        "en": "Raisin, vanilla, cinnamon"
      },
      "palate": {
        "ko": "셰리, 말린 과일, 견과",
        "en": "Sherry, dried fruit, nuts"
      },
      "finish": {
        "ko": "부드럽고 달콤",
        "en": "Soft and sweet"
      },
      "photo": "img/menu/glendronach-12.webp",
      "photoCredit": null
    },
    "woodford-reserve": {
      "kind": {
        "ko": "켄터키 스트레이트 버번",
        "en": "Kentucky straight bourbon"
      },
      "region": {
        "ko": "미국 켄터키",
        "en": "Kentucky, USA"
      },
      "abv": null,
      "abvNote": {
        "ko": "43.2% (미국 판매분은 45.2%)",
        "en": "43.2% (45.2% in the US)"
      },
      "cask": {
        "ko": "새 아메리칸 오크 (내부를 태운 통)",
        "en": "New charred American oak"
      },
      "about": {
        "ko": "켄터키 더비의 공식 버번. 구리 단식 증류기로 세 번 증류한 원액을 섞어 만든다.",
        "en": "The official bourbon of the Kentucky Derby, blended with whiskey triple-distilled in copper pot stills."
      },
      "nose": {
        "ko": "바닐라, 캐러멜, 말린 과일",
        "en": "Vanilla, caramel, dried fruit"
      },
      "palate": {
        "ko": "코코아, 토피, 시나몬",
        "en": "Cocoa, toffee, cinnamon"
      },
      "finish": {
        "ko": "실키하고 스파이시",
        "en": "Silky and spicy"
      },
      "photo": "img/menu/woodford-reserve.webp",
      "photoCredit": null
    },
    "dewars-12": {
      "kind": {
        "ko": "블렌디드 스카치",
        "en": "Blended Scotch"
      },
      "region": {
        "ko": "스코틀랜드",
        "en": "Scotland"
      },
      "abv": "40%",
      "cask": {
        "ko": "블렌딩 후 오크 통에서 한 번 더 숙성 (더블 에이징)",
        "en": "Married again in oak after blending (\"double aged\")"
      },
      "about": {
        "ko": "섞은 뒤 다시 통에서 재워 부드럽게 만든 블렌디드. 하이볼로도 좋다.",
        "en": "Blended, then rested in oak again for smoothness. Great as a highball too."
      },
      "nose": {
        "ko": "꿀, 바닐라, 서양배",
        "en": "Honey, vanilla, pear"
      },
      "palate": {
        "ko": "부드러운 꿀, 캐러멜",
        "en": "Soft honey, caramel"
      },
      "finish": {
        "ko": "가볍고 깔끔",
        "en": "Light and clean"
      },
      "photo": "img/menu/dewars-12.webp",
      "photoCredit": null
    },
    "makers-mark": {
      "kind": {
        "ko": "켄터키 스트레이트 버번",
        "en": "Kentucky straight bourbon"
      },
      "region": {
        "ko": "미국 켄터키",
        "en": "Kentucky, USA"
      },
      "abv": "45%",
      "cask": {
        "ko": "새 아메리칸 오크 (내부를 태운 통)",
        "en": "New charred American oak"
      },
      "about": {
        "ko": "호밀 대신 붉은 겨울 밀을 넣어 부드러운 버번. 병목의 빨간 왁스는 하나하나 손으로 담근다.",
        "en": "Red winter wheat instead of rye makes it soft. Every red wax top is hand-dipped."
      },
      "nose": {
        "ko": "캐러멜, 바닐라",
        "en": "Caramel, vanilla"
      },
      "palate": {
        "ko": "부드러운 밀, 캐러멜, 과일",
        "en": "Soft wheat, caramel, fruit"
      },
      "finish": {
        "ko": "짧고 달콤",
        "en": "Short and sweet"
      },
      "photo": "img/menu/makers-mark.webp",
      "photoCredit": null
    },
    "lagavulin-16": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 아일라",
        "en": "Islay, Scotland"
      },
      "abv": "43%",
      "cask": {
        "ko": "주로 버번 통",
        "en": "Mostly ex-bourbon casks"
      },
      "about": {
        "ko": "아일라 섬의 묵직한 피트 위스키를 대표하는 한 병. 모닥불 연기와 바다 냄새.",
        "en": "The classic heavy Islay peat. Bonfire smoke and the sea."
      },
      "nose": {
        "ko": "피트 스모크, 요오드, 해초",
        "en": "Peat smoke, iodine, seaweed"
      },
      "palate": {
        "ko": "스모크, 셰리 같은 단맛, 짠맛",
        "en": "Smoke, sherry-like sweetness, salt"
      },
      "finish": {
        "ko": "아주 길고 스모키",
        "en": "Very long and smoky"
      },
      "photo": "img/menu/lagavulin-16.webp",
      "photoCredit": {"author": "Céréales Killer", "license": "CC BY-SA 3.0", "url": "https://commons.wikimedia.org/wiki/File:Lagavulin_Single_Islay_Malt_16.jpg"}
    },
    "ardbeg-10": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 아일라",
        "en": "Islay, Scotland"
      },
      "abv": "46%",
      "cask": {
        "ko": "버번 통 · 냉각 여과 없음",
        "en": "Ex-bourbon casks, not chill-filtered"
      },
      "about": {
        "ko": "가장 스모키한 아일라 몰트로 자주 꼽히는 10년. 강하지만 레몬처럼 상쾌한 끝.",
        "en": "Often called the smokiest Islay ten-year-old. Fierce, with a lemony lift."
      },
      "nose": {
        "ko": "피트, 레몬, 타르",
        "en": "Peat, lemon, tar"
      },
      "palate": {
        "ko": "스모크, 에스프레소, 시트러스",
        "en": "Smoke, espresso, citrus"
      },
      "finish": {
        "ko": "길고 스모키",
        "en": "Long and smoky"
      },
      "photo": "img/menu/ardbeg-10.webp",
      "photoCredit": {"author": "DYVER", "license": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:Ardbeg_10_Jahre_Flasche.jpg"}
    },
    "glenmorangie-nectar-dor": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 하이랜드",
        "en": "Highlands, Scotland"
      },
      "abv": "46%",
      "cask": {
        "ko": "버번 통 → 프랑스 소테른 와인 통 마무리",
        "en": "Bourbon cask, finished in Sauternes wine casks"
      },
      "about": {
        "ko": "프랑스 디저트 와인(소테른) 통에서 마무리해 꿀처럼 달고 부드럽다.",
        "en": "Finished in casks that held Sauternes, the French dessert wine. Honeyed and smooth."
      },
      "nose": {
        "ko": "꿀, 레몬, 아몬드",
        "en": "Honey, lemon, almond"
      },
      "palate": {
        "ko": "꿀, 생강, 넛맥",
        "en": "Honey, ginger, nutmeg"
      },
      "finish": {
        "ko": "길고 달콤",
        "en": "Long and sweet"
      },
      "photo": "img/menu/glenmorangie-nectar-dor.webp",
      "photoCredit": null
    },
    "balvenie-14-caribbean": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 스페이사이드",
        "en": "Speyside, Scotland"
      },
      "abv": "43%",
      "cask": {
        "ko": "버번 통 → 카리브 럼 통 마무리",
        "en": "Bourbon cask, finished in Caribbean rum casks"
      },
      "about": {
        "ko": "카리브 럼을 담았던 통에서 마무리해 토피와 열대 과일 향이 난다.",
        "en": "Finished in casks that held Caribbean rum: toffee and tropical fruit."
      },
      "nose": {
        "ko": "토피, 바닐라, 열대 과일",
        "en": "Toffee, vanilla, tropical fruit"
      },
      "palate": {
        "ko": "바닐라, 토피, 달콤한 오크",
        "en": "Vanilla, toffee, sweet oak"
      },
      "finish": {
        "ko": "부드럽고 따뜻",
        "en": "Soft and warm"
      },
      "photo": "img/menu/balvenie-14-caribbean.webp",
      "photoCredit": null
    },
    "octomore-16-3": {
      "kind": {
        "ko": "스카치 싱글 몰트",
        "en": "Single malt Scotch"
      },
      "region": {
        "ko": "스코틀랜드 아일라 (브룩라디)",
        "en": "Islay, Scotland (Bruichladdich)"
      },
      "abv": null,
      "abvNote": {
        "ko": "캐스크 스트렝스 · 정확한 도수와 피트 수치는 병 라벨 참고",
        "en": "Cask strength; see the label for exact ABV and peating"
      },
      "cask": null,
      "about": {
        "ko": "세상에서 가장 강한 피트 위스키로 손꼽히는 시리즈. \".3\" 판은 아일라 섬에서 키운 보리로 만든다. 이 메뉴판의 마지막 장.",
        "en": "Among the most heavily peated whiskies made. The \".3\" editions use barley grown on Islay. The last page of this menu."
      },
      "nose": {
        "ko": "강한 피트, 바다, 달콤한 보리",
        "en": "Massive peat, sea air, sweet barley"
      },
      "palate": {
        "ko": "불, 스모크, 과일",
        "en": "Fire, smoke, fruit"
      },
      "finish": {
        "ko": "아주 길다",
        "en": "Very long"
      },
      "photo": "img/menu/octomore-16-3.webp",
      "photoCredit": null
    },
    "old-fashioned": {
      "kind": {
        "ko": "클래식 칵테일",
        "en": "Classic cocktail"
      },
      "region": null,
      "abv": null,
      "recipe": {
        "ko": "버번(또는 라이) · 설탕 · 앙고스투라 비터스 · 오렌지 필",
        "en": "Bourbon or rye, sugar, Angostura bitters, orange peel"
      },
      "about": {
        "ko": "\"칵테일\"이라는 말이 막 생겼을 무렵의 방식 그대로. 위스키를 가장 위스키답게 마시는 한 잔.",
        "en": "Made the way the word \"cocktail\" first meant it. Whisky, at its most whisky."
      },
      "nose": {
        "ko": "오렌지 껍질, 바닐라",
        "en": "Orange peel, vanilla"
      },
      "palate": {
        "ko": "진한 위스키, 은은한 단맛, 비터스",
        "en": "Rich whisky, gentle sweetness, bitters"
      },
      "finish": {
        "ko": "따뜻하고 길다",
        "en": "Warm and long"
      },
      "photo": "img/menu/old-fashioned.webp",
      "photoCredit": null
    },
    "blueberry-pepper-cracker": {
      "kind": {
        "ko": "안주",
        "en": "Bite"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "블루베리에 후추를 더한 분홍빛 크림을 바삭한 크래커에 얹어 먹는 플레이트. 올리브 · 아몬드 · 블루베리가 곁들여 나온다.",
        "en": "A blush-pink blueberry cream with cracked pepper, spread on crisp crackers, with olives, almonds and blueberries on the side."
      },
      "plate": {
        "ko": "크래커 · 블루베리 페퍼 크림 · 올리브 · 아몬드 · 블루베리",
        "en": "Crackers, blueberry-pepper cream, olives, almonds, blueberries"
      },
      "scene": true,
      "photo": "img/menu/blueberry-pepper-cracker.webp",
      "photoCredit": null
    },
    "cherry-yogurt-cream": {
      "kind": {
        "ko": "안주 · 디저트",
        "en": "Bite · dessert"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "부드러운 요거트 크림 위에 체리 콩포트를 듬뿍 올려 잔에 담아 내는 디저트.",
        "en": "Soft yogurt cream under a generous spoon of cherry compote, served in a coupe."
      },
      "plate": {
        "ko": "요거트 크림 · 체리 콩포트 · 체리",
        "en": "Yogurt cream, cherry compote, cherries"
      },
      "scene": true,
      "photo": "img/menu/cherry-yogurt-cream.webp",
      "photoCredit": null
    },
    "acqua-panna": {
      "kind": {
        "ko": "생수 · 탄산 없음",
        "en": "Still mineral water"
      },
      "region": {
        "ko": "이탈리아 토스카나",
        "en": "Tuscany, Italy"
      },
      "abv": null,
      "about": {
        "ko": "토스카나 언덕의 샘에서 나는 이탈리아 내추럴 미네랄워터. 순하고 부드러워서 위스키 사이사이 입을 헹구는 체이서로 좋다.",
        "en": "Natural mineral water from a spring in the Tuscan hills. Soft and smooth — a good chaser between whiskies."
      },
      "photo": "img/menu/acqua-panna.webp",
      "photoCredit": {"author": "Smuconlaw", "license": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:Acqua_Panna_mineral_water_in_a_glass_bottle_-_20140408.jpg"}
    },
    "coke": {
      "kind": {
        "ko": "탄산음료 · 캔",
        "en": "Soft drink · can"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "코카콜라 오리지널.",
        "en": "Coca-Cola Original."
      },
      "photo": null,
      "photoCredit": null
    },
    "coke-zero": {
      "kind": {
        "ko": "탄산음료 · 캔",
        "en": "Soft drink · can"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "설탕 없는 코카콜라 제로.",
        "en": "Coca-Cola Zero Sugar."
      },
      "photo": null,
      "photoCredit": null
    },
    "ginger-ale": {
      "kind": {
        "ko": "탄산음료",
        "en": "Soft drink"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "캐나다드라이 진저에일. 생강 향이 은은하고 달지 않은 편이라 위스키에 섞어 마시기도 좋다.",
        "en": "Canada Dry Ginger Ale — gently gingery and not too sweet, so it also mixes well with whisky."
      },
      "photo": "img/menu/ginger-ale.webp",
      "photoCredit": {"author": "Fmvh", "license": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:Canada_Dry_ginger_ale_can.jpg"}
    },
    "soda-water": {
      "kind": {
        "ko": "탄산수",
        "en": "Sparkling water"
      },
      "region": null,
      "abv": null,
      "about": {
        "ko": "단맛도 향도 없는 탄산수. 그대로 마시거나, 위스키에 부어 하이볼로.",
        "en": "Plain sparkling water, no sugar, no flavour. On its own, or poured over whisky for a highball."
      },
      "photo": "img/menu/soda-water.webp",
      "photoCredit": {"author": "Égoïté", "license": "CC BY-SA 3.0", "url": "https://commons.wikimedia.org/wiki/File:Verre-eau-gazeuse-au-jardin.jpg", "gray": true}
    }
  },

  /* 결과 · 오류 익명 기록 (→ /api/track → Neon). 끄려면 false.
     Neon 이 Vercel 프로젝트에 연결되기 전에는 서버가 받은 기록을 그냥 버립니다. README 의 "결과 기록" 참고. */
  collect: { enabled: true }
};
