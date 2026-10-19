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
     line.confirmed:false 인 문구는 각인을 확실히 못 읽은 것이라 화면에 나가지 않습니다. */
  drinks: {
    "교": {
      "line": {
        "ko": "은은한 꽃향과 단단한 기품이 입안을 지배한다.",
        "en": "Soft florals and a firm poise take over the palate.",
        "confirmed": true
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
        "ko": "상큼한 ?향이 톡 오며 마음을 간질인다.",
        "en": "A bright note lands with a spark and teases the heart.",
        "confirmed": false,
        "note": "두 번째 단어 첫 글자가 번져서 못 읽음. 실물 확인 후 고치고 confirmed:true 로."
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
            "en": "Glenfarclas 25",
            "g": "95,000",
            "b": "1,570,000"
          },
          {
            "ko": "맥캘란 18년 셰리",
            "en": "Macallan 18 Sherry",
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
            "en": "Blanton's",
            "g": "35,000",
            "b": "600,000"
          },
          {
            "ko": "달모어 15년",
            "en": "Dalmore 15",
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
            "en": "Aberlour A'bunadh",
            "g": "28,000",
            "b": "450,000"
          },
          {
            "ko": "글렌알라키 15년",
            "en": "GlenAllachie 15",
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
            "en": "GlenDronach 12",
            "g": "16,000",
            "b": "250,000"
          },
          {
            "ko": "우드포드 리저브",
            "en": "Woodford Reserve",
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
            "en": "Dewar's 12",
            "g": "9,000",
            "b": "140,000"
          },
          {
            "ko": "메이커스 마크",
            "en": "Maker's Mark",
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
            "en": "Lagavulin 16",
            "g": "23,000",
            "b": "370,000"
          },
          {
            "ko": "아드벡 10년",
            "en": "Ardbeg 10",
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
            "en": "Glenmorangie Nectar d'Or",
            "g": "25,000",
            "b": "400,000"
          },
          {
            "ko": "발베니 14년 캐리비안",
            "en": "Balvenie 14 Caribbean Cask",
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
          "en": "Octomore 16.3",
          "g": "75,000",
          "b": "1,220,000"
        }
      ]
    },
    "bites": [
      {
        "ko": "블루베리 페퍼 크래커",
        "en": "Blueberry Pepper Cracker",
        "p": "8,000"
      },
      {
        "ko": "체리 요거트 크림",
        "en": "Cherry Yogurt Cream",
        "p": "8,000"
      }
    ],
    "cocktails": [
      {
        "ko": "올드패션드",
        "en": "Old Fashioned",
        "p": "22,000"
      }
    ],
    "beverages": [
      {
        "ko": "아쿠아파나",
        "en": "Acqua Panna",
        "p": "5,000"
      },
      {
        "ko": "콜라",
        "en": "Coke",
        "p": "3,000"
      },
      {
        "ko": "콜라제로",
        "en": "Coke Zero",
        "p": "3,000"
      },
      {
        "ko": "진저에일",
        "en": "Ginger Ale",
        "p": "3,000"
      },
      {
        "ko": "소다워터",
        "en": "Soda Water",
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

  /* 결과 · 오류 익명 기록 → 구글 시트. 비어 있으면 아무것도 보내지 않습니다.
     켜는 법: README 의 "결과 기록 (구글 시트)" — 시트에서 배포한 웹 앱 주소(…/exec)를 넣으면 됩니다. */
  collect: { sheet: '' }
};
