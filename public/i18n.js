/* =============================================================
   DEADLY SINS — 화면 문구 (한국어 / English / 中文 / 日本語)
   ko 는 개선 레이어가 새로 더한 문구만 있습니다. 원본 문구는 원본 HTML 에서 그대로 읽습니다.
   설문 문항(한국어 · 영어)은 quiz.js 에 있습니다.
   en.traits 의 키는 원본 RESULT_TRAITS 와 같아야 합니다 (단일 7개 + 순서쌍 42개).
   ============================================================= */
window.DS_I18N = {
  ko: {
    /* 화면에 보이는 죄 이름을 원본과 다르게 할 때만 적는다.
       원본 결과 화면은 "탐식"인데, 바로 다음 화면의 술 이름(폭식의 술) · 메뉴판 · 1층 배너 사이트는 "폭식"이라 화면 표시를 폭식으로 맞췄다 (2026-11-21).
       통계 · 기록의 이름은 그대로 "탐식"이다. 되돌리려면 이 줄을 지우면 된다. */
    sins: { 식: '폭식' },
    ui: {
      menu: 'MENU',
      tasteHead: '이 잔의 맛',
      aroma: '향', taste: '맛', finish: '피니시', strength: '강도', price: '가격',
      won: '원',
      pairHead: '같은 죄의 위스키',
      glass: '글라스',
      order: '바텐더에게 보여주기',
      saveImage: '이미지 저장',
      soldOut: '품절', soldOutNote: '오늘은 품절이에요.',
      sigSoldOut: '오늘은 이 잔이 품절이에요. 바텐더에게 비슷한 잔을 추천받아 보세요.',
      share: '공유하기', shareInvite: '나도 해 보기:', shareKicker: '내 결과 공유하기',
      shareHint: '이미지를 길게 눌러 저장한 뒤, 인스타그램 스토리나 카카오톡에 올려 보세요.',
      copyLink: '테스트 링크 복사', copied: '복사했어요',
      fullMenu: '전체 메뉴',
      restart: '처음부터 다시',
      close: '닫기',
      orderNote: '이 화면을 바텐더에게 보여주세요',
      orderKicker: 'TONIGHT’S ORDER',
      making: '이미지를 만드는 중…',
      shareTitle: '오늘 밤 나의 죄',
      shareText: (en, kr) => `오늘 밤 나의 죄는 ${en} — ${kr}`,
      yourSin: '당신의 죄',
      menuSeven: 'SEVEN SINS',
      menuSevenNote: (p) => `일곱 개의 잔 · 각 ${p}원`,
      menuWhisky: 'WHISKY SELECTION',
      menuBites: 'BITES', menuCocktails: 'COCKTAILS', menuBeverages: 'BEVERAGES', menuInfo: 'INFORMATION',
      menuNote: '가격은 매장 사정에 따라 바뀔 수 있습니다.',
      tapHint: '이름을 누르면 자세한 설명이 나와요',
      bottle: '보틀', cask: '캐스크', nose: '향', palate: '맛', recipe: '재료', plate: '구성', photoCredits: '사진 출처', photoEdited: '배경 제거 · 크기 조정', photoEditedGray: '배경 제거 · 흑백 · 크기 조정',
      learnMore: '이 술에 대해 알아보기', storyHistory: '이야기', storyLayers: '맛의 흐름', storyServe: '이렇게 마셔 보세요',
      layerLabels: ['첫 향', '첫 모금', '가운데', '여운'], loading: '불러오는 중…',
      storyError: '불러오지 못했어요. 잠시 뒤 다시 눌러 주세요.',
      detailNote: '일반적인 제품 정보 기준이에요. 매장에 있는 병(배치 · 연도)에 따라 조금 다를 수 있어요.'
    }
  },

  en: {
    ui: {
      menu: 'MENU',
      docTitle: 'DEADLY SINS · Seven Deadly Sins Quiz',
      /* 원본 화면 문구 */
      start: 'Tap to begin',
      footerTip: 'Tap an answer to go to the next question.',
      legendWeak: 'Empty = weak',
      legendStrong: 'Filled = strong',
      toDesire: 'Meet my signature drink →',
      sigTitle: 'Feed<br>your desire',
      sigSub: 'Meet the drink that mirrors your sin.',
      love: 'Love', work: 'Work', sex: 'In bed',
      ageWarn: 'Rated 29+. No peeking.',
      lockMain: 'Tap to reveal',
      /* 개선 레이어 문구 */
      tasteHead: 'In the glass',
      aroma: 'Aroma', taste: 'Taste', finish: 'Finish', strength: 'Strength', price: 'Price',
      won: ' KRW',
      pairHead: 'Whiskies for this sin',
      glass: 'Glass',
      order: 'Show the bartender',
      saveImage: 'Save image',
      soldOut: 'Sold out', soldOutNote: 'Sold out today.',
      sigSoldOut: 'This one is sold out tonight. Ask the bartender for something close.',
      share: 'Share', shareInvite: 'Find your sin:', shareKicker: 'Share your result',
      shareHint: 'Press and hold the image to save it, then post it to your Instagram story or send it to a friend.',
      copyLink: 'Copy quiz link', copied: 'Copied',
      fullMenu: 'Full menu',
      restart: 'Start over',
      close: 'Close',
      orderNote: 'Show this screen to the bartender',
      orderKicker: 'TONIGHT’S ORDER',
      making: 'Making your image…',
      shareTitle: 'My sin tonight',
      shareText: (en, kr) => `My sin tonight is ${en} — ${kr}`,
      yourSin: 'Your sin',
      menuSeven: 'SEVEN SINS',
      menuSevenNote: (p) => `Seven signature cocktails · ${p} KRW each`,
      menuWhisky: 'WHISKY SELECTION',
      menuBites: 'BITES', menuCocktails: 'COCKTAILS', menuBeverages: 'BEVERAGES', menuInfo: 'INFORMATION',
      menuNote: 'Prices are subject to change.',
      tapHint: 'Tap a name for details',
      bottle: 'Bottle', cask: 'Cask', nose: 'Nose', palate: 'Palate', recipe: 'Ingredients', plate: 'On the plate', photoCredits: 'Photo credits', photoEdited: 'background removed, resized', photoEditedGray: 'background removed, black and white, resized',
      learnMore: 'Learn more about this drink', storyHistory: 'The story', storyLayers: 'How it tastes', storyServe: 'How to drink it',
      layerLabels: ['Nose', 'First sip', 'Mid-palate', 'Finish'], loading: 'Loading…',
      storyError: 'Could not load this. Please try again in a moment.',
      detailNote: 'General product information. The bottle on our shelf may differ slightly by batch or year.'
    },

    /* 화면낭독기가 읽는 이름표 (원본의 aria-label · alt 를 영어일 때 이걸로 바꾼다) */
    aria: {
      cover: 'Cover', coverArt: 'Deadly Sins logo in black and white',
      quiz: 'Seven questions', progress: 'Question progress', choices: 'Choose an answer',
      results: 'Your result', radar: 'Chart of your seven deadly sins',
      signature: 'Your signature drink', back: 'Back to the previous screen', art: ' symbol and glass'
    },

    /* 답을 누르면 잠깐 뜨는 한마디 (원본 REACTIONS 와 같은 개수·순서) */
    reactions: ['Oh?', 'Noted.', 'Suspicious…', 'So that’s your taste?', 'Interesting.', 'Honest, huh?',
      'I see.', 'Bold.', 'I’ll remember that.', 'Heh…', 'Didn’t see that coming.', 'Called it.'],

    sins: { 교: 'Pride', 질: 'Envy', 분: 'Wrath', 나: 'Sloth', 탐: 'Greed', 식: 'Gluttony', 색: 'Lust' },
    drinkName: {
      교: 'The Drink of Pride', 질: 'The Drink of Envy', 분: 'The Drink of Wrath', 나: 'The Drink of Sloth',
      탐: 'The Drink of Greed', 식: 'The Drink of Gluttony', 색: 'The Drink of Lust'
    },

    /* 설문 문항의 영어는 quiz.js 에 한국어와 나란히 있다 */

    traits: {
      교: {
        love: 'You don’t cling, even when you like someone. You want a relationship built on mutual respect, where you’re seen as special.',
        work: 'The more recognition you get, the deeper you dive in. Once something is yours, you want to do it better than anyone.',
        sex: 'You like to take the lead in bed, and you’re most satisfied watching your partner react to your charm.'
      },
      질: {
        love: 'You notice every shift in the tone and gaze of someone you like. When their attention drifts, it quietly gets to you.',
        work: 'A rival sharpens your focus. Comparison stresses you out, but it also pushes you to grow.',
        sex: 'You need to be sure their focus is on you alone. When it scatters, jealousy and possessiveness creep in.'
      },
      분: {
        love: 'You say what hurts right away instead of hiding it. That honesty makes relationships heat up fast.',
        work: 'You don’t let frustrating or unfair situations slide. When action is needed, you move first.',
        sex: 'You’re drawn to high emotion and high tension over calm. The stronger you both react, the more you lose yourself in it.'
      },
      나: {
        love: 'You’d rather be comfortable together than play games. You’re drawn to people who feel natural to be with, no effort needed.',
        work: 'Smart over hard: you look for ways to get results with less effort, and you’re good at finding them.',
        sex: 'Instead of setting an elaborate mood, you like lounging close until touch happens naturally.'
      },
      탐: {
        love: 'When you like someone, you’d rather make it official than leave it vague.',
        work: 'When you have a goal, your ambition is clear. You grab good opportunities fast.',
        sex: 'Once you’re into someone, a little is never enough. You want to enjoy the touching, and everything after, until you’re fully satisfied.'
      },
      식: {
        love: 'To you, a date is a pleasure in itself. Shared experiences like great food, drinks and travel matter a lot.',
        work: 'You go all in on work you enjoy. Without interest, though, your focus fades fast.',
        sex: 'You have a weakness for the senses: scent, drink, music, the feel of skin. When the mood is right, you want it to last.'
      },
      색: {
        love: 'Butterflies and attraction matter most. When you like someone, it naturally shows in what you do.',
        work: 'You read people and rooms well. When something grabs you, your drive kicks in fast.',
        sex: 'Attraction turns into touch quickly for you. When you’re into someone, you’re fairly upfront about what you want.'
      },

      교질: {
        love: 'You want to be valued in love too. If your partner pays more attention to someone else, your competitive side wakes up.',
        work: 'You get stronger under competition. Feeling outpaced pushes your skills higher.',
        sex: 'You love feeling that your partner is completely into you. The surer you are of their attention, the more you want to take the lead.'
      },
      교분: {
        love: 'You especially hate feeling disrespected. When respect breaks down, you say so right away.',
        work: 'A hit to your pride actually sharpens your focus. Once you take something on, you don’t back down.',
        sex: 'You’d rather it be high-tension and all-consuming than soft and gentle. A battle for control can be part of the thrill.'
      },
      교나: {
        love: 'Even when you like someone, you won’t chase. You warm more to people who fall for you on their own.',
        work: 'You save energy but still want great results. You manage efficiency and quality at the same time.',
        sex: 'You start relaxed, but once the mood builds, you naturally take the lead, and you enjoy having them follow.'
      },
      교탐: {
        love: 'You want to be the one they choose. Your standards in relationships are high.',
        work: 'You’re driven by achievement. When a good position or result is in sight, you make sure it’s yours.',
        sex: 'You want to see their reaction in full and to feel deeply satisfied. In bed, too, you don’t do half measures.'
      },
      교식: {
        love: 'You love special dates in great places with great food. You want a relationship worth remembering, not an ordinary one.',
        work: 'You’re most effective when fun and recognition come together. The satisfaction of the process matters as much as the result.',
        sex: 'The whole mood matters: the setting, the scent, the drinks. Once it’s right, you enjoy showing off your charm.'
      },
      교색: {
        love: 'You know your own charm. When you like someone, you naturally try to catch their attention.',
        work: 'You have a knack for drawing people in. You shine where you can be noticed or take the lead.',
        sex: 'You like setting the mood first and catching their eye. Knowing you’re getting to them is what satisfies you.'
      },
      질교: {
        love: 'You watch closely who your partner pays attention to, and you want to feel special too.',
        work: 'Constant comparison can stress you out, but it also drives you to deliver great results.',
        sex: 'You need to know they’re drawn to you more than anyone else. Feeling like you’re winning the comparison turns you on.'
      },
      질분: {
        love: 'Jealousy shows on your face and in your voice. You don’t hold in hurt feelings for long.',
        work: 'When you can see a rival, your focus spikes. Hating to lose turns into action fast.',
        sex: 'Strong feelings like jealousy or hurt actually raise the heat, both in touch and in bed.'
      },
      질나: {
        love: 'Things do get to you, but competing or clinging feels exhausting. In the end, you pick the comfortable relationship.',
        work: 'You compare yourself to others but don’t jump into every contest. You use your energy only when it counts.',
        sex: 'You want attention but find mind games tiring. You prefer a calm, steady relationship where they focus on you.'
      },
      질탐: {
        love: 'When your partner shows interest in someone else, you want even more attention for yourself.',
        work: 'When someone gets a great result, you want more than that. Competition feeds your ambition.',
        sex: 'You want plenty of attention and affection. The closer you get, the more affection and touch you want.'
      },
      질식: {
        love: 'When you see others enjoying their dates and relationships, you want the same experience.',
        work: 'You’re quick to pick up on what’s fun and buzzworthy. The mood around you affects you quite a bit.',
        sex: 'You love sharing the mood, but in that moment you want their attention all to yourself.'
      },
      질색: {
        love: 'The more you like someone, the more closely you watch their small moves. When someone else gets close, it naturally gets to you.',
        work: 'You read the atmosphere between people well. You’re sharp where competition and relationships tangle.',
        sex: 'The more you like them, the more sensitive you are to their touch and reactions. Feeling that they’re focused only on you is a strong turn-on.'
      },
      분교: {
        love: 'If you don’t feel respected, you pull away or speak up at once. Pride is a key standard in your relationships.',
        work: 'You speak up in unfair or frustrating situations. Your sense of responsibility and your competitiveness rise together.',
        sex: 'In bed, you’d rather set the mood than be led. You enjoy the tension of pushing against each other.'
      },
      분질: {
        love: 'If someone you like shows interest in someone else, you can get rattled fast, but you won’t hide it.',
        work: 'You’re at your strongest in competition. Feeling outpaced fuels your drive.',
        sex: 'Jealousy or rivalry quickly raises the tension. The stronger the feelings, the more forward you get with touch.'
      },
      분나: {
        love: 'You let most things go, but once a line is crossed, your attitude flips. Usually you’re pretty easygoing.',
        work: 'You save energy on tedious tasks but step up fast when there’s a problem. Strong when it counts.',
        sex: 'Usually laid-back, but once the switch flips the mood changes completely. Slow start, intense once you’re in it.'
      },
      분탐: {
        love: 'You hate it when a relationship you want gets disrupted. Once you like someone, you’re strongly protective of what you have.',
        work: 'You’re touchy when something gets in the way of your goals, but once you set one, you rarely give up.',
        sex: 'When you want something, you make it clear. In bed, too, you stay fully engaged until you’re satisfied.'
      },
      분식: {
        love: 'Even after a fight, you’d rather clear the air over food and fun than drag it out.',
        work: 'You blow off stress right away instead of letting it build. You bounce back fast.',
        sex: 'When drinks or the mood stir your feelings, you get physical quickly. You follow the desire and emotion of the moment.'
      },
      분색: {
        love: 'You feel both love and hurt intensely. Your relationships rarely run flat.',
        work: 'When something interests you, you move fast. Your passion runs high, so emotional situations hit you hard too.',
        sex: 'When you’re attracted, you react fast and intensely. You burn hottest when emotion and desire rise together.'
      },
      나교: {
        love: 'You won’t cling, but you want to be respected. You like relationships that are comfortable but keep your pride intact.',
        work: 'You want great results with little effort. Efficiency matters a lot to you.',
        sex: 'You’d rather they come to you than make the effort yourself. Relaxed at first, but once the mood sets, you quietly take the lead.'
      },
      나질: {
        love: 'Their behavior bothers you, but confronting them or competing feels tiring.',
        work: 'You compare yourself to others but don’t react to every contest. You keep your own pace.',
        sex: 'You want to feel their affection but hate complicated games. You like staying close and letting touch follow.'
      },
      나분: {
        love: 'You let most things slide, but if lines keep getting crossed, you turn firm. Usually you’re very relaxed.',
        work: 'You normally save your energy, but when a problem hits, your focus suddenly kicks in.',
        sex: 'Usually laid-back, but more forward than expected when feelings surge. A big contrast, full of surprises.'
      },
      나탐: {
        love: 'You want a good relationship, just not an exhausting one. You prefer one that’s comfortable and deeply satisfying.',
        work: 'You’re good at finding ways to get big results with little effort. Your sense of efficiency is sharp.',
        sex: 'You want to enjoy it comfortably but still be fully satisfied: minimal effort, maximum pleasure.'
      },
      나식: {
        love: 'You’re drawn to people you can simply lie around, eat and rest with.',
        work: 'Work without joy wears you out. In a comfortable setup, though, you do steady, good work.',
        sex: 'You like lying close in bed and letting the touch go on slowly. You’d rather savor it than rush.'
      },
      나색: {
        love: 'You love the butterflies but find mind games tiring. You’re drawn to relationships that grow close naturally.',
        work: 'Your energy really rises only when the people or the work feel fun.',
        sex: 'Rather than making the first bold move, you like letting the mood ripen naturally. Your desire grows slowly in comfort.'
      },
      탐교: {
        love: 'You want to be chosen by the person you like, and your standards are high.',
        work: 'Goals make you ambitious. You don’t want to miss out on either results or recognition.',
        sex: 'You make sure you get the reaction and satisfaction you’re after. You want to look irresistible while keeping control.'
      },
      탐질: {
        love: 'When their attention drifts elsewhere, you want even more of it for yourself.',
        work: 'When others do well, you aim higher. Competition motivates you a lot.',
        sex: 'You want plenty of their attention, and feeling more special than anyone else matters to you.'
      },
      탐분: {
        love: 'You don’t let go of a relationship you like easily. When you don’t get the response you want, it frustrates you.',
        work: 'You hate missing chances or being blocked. With a goal in sight, you’re relentless.',
        sex: 'When you want something, you say it directly. When the mood is right, you take charge, and you hate it ending half-done.'
      },
      탐나: {
        love: 'You want a satisfying relationship, but if getting there is too hard, you tire quickly.',
        work: 'You want a lot but avoid unnecessary hardship. You chase efficient success.',
        sex: 'You want it easy but highly satisfying. You like a mood where you can enjoy plenty without working hard for it.'
      },
      탐식: {
        love: 'You want to fully enjoy great dates and good times. Satisfaction matters in your relationships.',
        work: 'You want a lot and have plenty of energy. You’re especially strong when the reward is clear.',
        sex: 'You like many senses satisfied at once, not just one. When the mood is right, you want it to last as long as possible.'
      },
      탐색: {
        love: 'When you like someone, you want to make it official. You don’t leave things vague for long.',
        work: 'You have both a knack for drawing people in and a drive to achieve. You’re strong where people and results connect.',
        sex: 'Attraction makes you forward, and you’re fairly upfront about desire. With someone you like, you want the touch to keep going.'
      },
      식교: {
        love: 'You love special dates and a great atmosphere. The quality of your time together matters a lot.',
        work: 'You’re most effective when fun and recognition come together. Your taste shapes your results.',
        sex: 'Setting the mood matters: lighting, scent, music, drinks. In a great setting, you want to show off your charm too.'
      },
      식질: {
        love: 'When you see others enjoying their relationships, you want that experience too.',
        work: 'The mood around you affects you a lot. You focus best with fun people.',
        sex: 'You love sharing the sensations, but you want their attention on you. If it wanders, you lose the mood.'
      },
      식분: {
        love: 'Even after a fight, you want to clear the air quickly by eating or having fun together.',
        work: 'You release stress right away. You recover fast, but in-the-moment emotions can sway you.',
        sex: 'When feelings rise, your body responds fast. You get most lost in it when the mood is intense and the senses are stirred.'
      },
      식나: {
        love: 'You love everyday dates spent comfortably eating and resting.',
        work: 'With a comfortable setting and a good vibe, you do steady, good work. In a dull environment, you tire quickly.',
        sex: 'Rather than rushing, you like lying back and keeping the touch going for a long time. Comfort itself is the turn-on.'
      },
      식탐: {
        love: 'You want to fully enjoy both a good relationship and good experiences. Satisfaction matters in love.',
        work: 'You’re strong where the reward and the fun are clear. The bigger the goal, the more energy you have.',
        sex: 'When you love an experience, you want it to last. You’d rather not stop before you’re satisfied.'
      },
      식색: {
        love: 'You value the shared atmosphere of people, places, food and drink. You know how to enjoy the date itself.',
        work: 'Meeting people and trying new things fires you up. You’re also good at setting a mood.',
        sex: 'You have a real weakness for anything that stirs the senses: touch, scent, music, drinks, mood. When the vibe is right, desire rises fast.'
      },
      색교: {
        love: 'You want to look irresistible to the person you like. Liking someone doesn’t make you lose confidence.',
        work: 'You can draw people in. You shine in roles that need presence, like presenting, sales or hospitality.',
        sex: 'You enjoy their gaze and reactions and set the mood first. Feeling that you’re pulling them in is what satisfies you.'
      },
      색질: {
        love: 'The more you like someone, the more closely you watch them. When someone else gets close, it quietly bothers you.',
        work: 'You read the atmosphere between people quickly. You move by instinct where competition and relationships mix.',
        sex: 'The more you like them, the more sensitive you get to their reactions, and the more you want them to yourself. You’re most into it when they focus only on you.'
      },
      색분: {
        love: 'When you like someone you mean it, and when you’re hurt you say it. Your love life runs hot, not calm.',
        work: 'When something feels fun, you move fast, though your emotions affect your work quite a bit.',
        sex: 'Attraction heats up fast for you. You like relationships where strong emotion and touch rise together.'
      },
      색나: {
        love: 'You love the butterflies but hate complicated games. You prefer getting close the easy way.',
        work: 'You focus well when the people or the work are fun. In overly repetitive settings, you lose interest fast.',
        sex: 'You have desire but don’t want to complicate it. You like staying close and letting it flow naturally into touch.'
      },
      색탐: {
        love: 'You want unmistakable attention from the person you like. Leaving things vague can frustrate you.',
        work: 'You combine a knack for drawing people in with a strong sense of purpose. When the result you want is in sight, you move fast.',
        sex: 'With someone you like, you want plenty of attention and touch. When you’re curious, you’re fairly open to new moods and new things.'
      },
      색식: {
        love: 'You love sharing good food, drinks and atmosphere with good people. The sensory side of a date matters to you.',
        work: 'You get energy from new people and experiences. In a fun setting, you’re great at lifting the mood.',
        sex: 'You’re very sensitive to atmosphere. When drink, scent, music and the feel of skin all line up, your desire soars and you lose yourself in it.'
      }
    }
  },

  /* 中文 (간체). 손님 폰 언어가 중국어이거나 표지에서 中文 을 고르면 나온다.
     빠진 문구는 영어 것으로 채워진다 (enhance.js 의 t · pack). 설문 · 메뉴 · 술 이야기의 중국어는 quiz.js · data.js · stories.js 의 zh. */
  zh: {
    ui: {
      menu: 'MENU',
      docTitle: 'DEADLY SINS · 七宗罪测试',
      /* 원본 화면 문구 */
      start: '点击开始',
      footerTip: '点选答案后会自动进入下一题。',
      legendWeak: '空心 = 弱',
      legendStrong: '实心 = 强',
      toDesire: '看看我的专属特调 →',
      sigTitle: '满足<br>你的欲望',
      sigSub: '来见见和你的罪最像的那一杯。',
      love: '恋爱', work: '工作', sex: '亲密',
      ageWarn: '29禁，请勿偷看',
      lockMain: '点击查看结果',
      /* 개선 레이어 문구 */
      tasteHead: '这一杯的味道',
      aroma: '香气', taste: '口感', finish: '余韵', strength: '酒精度', price: '价格',
      won: '韩元',
      pairHead: '同一种罪的威士忌',
      glass: '单杯',
      order: '给调酒师看',
      saveImage: '保存图片',
      soldOut: '售罄', soldOutNote: '今天已售罄。',
      sigSoldOut: '这一杯今天已售罄，可以请调酒师推荐一杯相近的。',
      share: '分享', shareInvite: '你也来测一测：', shareKicker: '分享我的结果',
      shareHint: '长按图片保存，然后发到朋友圈、Instagram，或直接发给朋友。',
      copyLink: '复制测试链接', copied: '已复制',
      fullMenu: '完整菜单',
      restart: '重新开始',
      close: '关闭',
      orderNote: '请把这个画面给调酒师看',
      orderKicker: 'TONIGHT’S ORDER',
      making: '正在生成图片…',
      shareTitle: '今晚我的罪',
      shareText: (en, kr) => `今晚我的罪是 ${en} — ${kr}`,
      yourSin: '你的罪',
      menuSeven: 'SEVEN SINS',
      menuSevenNote: (p) => `七款招牌特调 · 每杯 ${p} 韩元`,
      menuWhisky: 'WHISKY SELECTION',
      menuBites: 'BITES', menuCocktails: 'COCKTAILS', menuBeverages: 'BEVERAGES', menuInfo: 'INFORMATION',
      menuNote: '价格可能会有调整。',
      tapHint: '点击名称查看详情',
      bottle: '整瓶', cask: '橡木桶', nose: '闻香', palate: '口感', recipe: '配方', plate: '搭配', photoCredits: '图片来源', photoEdited: '去除背景 · 调整尺寸', photoEditedGray: '去除背景 · 黑白 · 调整尺寸',
      learnMore: '了解这款酒', storyHistory: '故事', storyLayers: '风味层次', storyServe: '推荐喝法',
      layerLabels: ['闻香', '入口', '中段', '余韵'], loading: '加载中…',
      storyError: '加载失败，请稍后再试。',
      detailNote: '以上为一般产品信息，店内实际酒款可能因批次或年份略有不同。'
    },

    aria: {
      cover: '封面', coverArt: 'Deadly Sins 黑白标志',
      quiz: '七个问题', progress: '答题进度', choices: '选择答案',
      results: '测试结果', radar: '七宗罪倾向图',
      signature: '你的专属特调', back: '返回上一页', art: ' 的象征与酒杯'
    },

    reactions: ['哦？', '原来如此！', '有点可疑！', '原来你好这口？', '有意思！', '挺诚实嘛？',
      '明白了。', '够大胆！', '我记住了！', '嘿嘿…', '没想到！', '果然！'],

    sins: { 교: '傲慢', 질: '嫉妒', 분: '暴怒', 나: '懒惰', 탐: '贪婪', 식: '暴食', 색: '色欲' },
    drinkName: {
      교: '傲慢之酒', 질: '嫉妒之酒', 분: '暴怒之酒', 나: '懒惰之酒',
      탐: '贪婪之酒', 식: '暴食之酒', 색: '色欲之酒'
    },

    /* 결과 성향 49개 (단일 7 + 순서쌍 42). 키는 en.traits 와 같다. */
    traits: {
      교: {
        love: '就算喜欢，你也不会轻易缠着对方。你想要的是彼此尊重、对方又把你当成特别存在的关系。',
        work: '越被认可，你越投入。事情一旦交到你手上，就想做得比谁都漂亮。',
        sex: '到了床上，你也喜欢掌握主导权。看着对方被你的魅力撩动，是你最满足的时刻。'
      },
      질: {
        love: '喜欢的人语气、眼神稍有变化，你都能察觉。对方的注意力一飘走，你就会暗暗在意。',
        work: '有了竞争对手，你反而更能集中。比较让你有压力，却也刺激着你成长。',
        sex: '你需要确信对方此刻只专注于你一个人。注意力一分散，醋意和占有欲就会冒上来。'
      },
      분: {
        love: '心里委屈了，你不爱憋着，而是当场说出来。情绪表达得直率，感情也升温得快。',
        work: '让人憋屈或不公平的事，你不会就这么算了。需要行动的时候，你总是第一个站出来。',
        sex: '比起风平浪静，情绪浓烈、张力十足的关系更吸引你。彼此反应越强烈，你就越投入。'
      },
      나: {
        love: '比起复杂的拉扯，你更喜欢待在一起就舒服的关系。不用刻意经营也很自然的人，最吸引你。',
        work: '你不信奉一味埋头苦干，更讲究效率。少花力气又能出成果的办法，你总能找到。',
        sex: '你不爱刻意营造气氛。舒舒服服地贴在一起，亲密接触自然而然就来了，这才是你喜欢的。'
      },
      탐: {
        love: '遇到心仪的人，你不想一直暧昧着，更想把关系明明白白地定下来。',
        work: '一旦有了目标，你的野心就毫不含糊。好机会一出现，你出手很快。',
        sex: '一旦看对眼，浅尝辄止只会让你意犹未尽。无论是肢体接触还是更进一步，你都想享受到心满意足。'
      },
      식: {
        love: '在你看来，约会本身就是一种享受。美食、小酒、旅行，这些一起体验的时光对你很重要。',
        work: '觉得有意思的事，你会一头扎进去。反过来，没了兴趣，专注力也掉得很快。',
        sex: '香气、酒、音乐、肌肤的触感，这些感官上的东西你最没抵抗力。气氛对了，你就想久久地享受。'
      },
      색: {
        love: '心动和吸引力对你很重要。有了喜欢的人，你的好感会自然而然地流露在行动里。',
        work: '你看人很准，对气氛也很敏锐。碰上感兴趣的事，行动力一下子就上来了。',
        sex: '对你来说，从互相来电到亲密接触往往发展得很快。只要喜欢，你会比较坦率地表达自己的渴望。'
      },
      교질: {
        love: '在爱情里，你也很想被认可。对方要是更在意别人，你的好胜心就会悄悄冒头。',
        work: '越是竞争，你越强。被人比下去的感觉，反而会刺激你把实力提上来。',
        sex: '你喜欢对方完全为你着迷的感觉。越是确认了对方的在意，你就越想把主导权握在手里。'
      },
      교분: {
        love: '你尤其讨厌被人轻视的感觉。一旦觉得不被尊重，你会当场把情绪表达出来。',
        work: '自尊心被戳到时，你的专注力反而更高。事情一旦接手，你就不会轻易退缩。',
        sex: '比起温柔平缓，你更喜欢张力十足、让人深深沉浸的气氛。争夺主导权，对你来说也可以是一种刺激。'
      },
      교나: {
        love: '就算喜欢，你也不会费劲去追。那些自然而然就喜欢你的人，更能让你动心。',
        work: '力气要省着用，结果却要漂亮。效率和完成度，你两样都要顾到。',
        sex: '你开始得很放松，可气氛一上来，就会顺势接过主导权。对方跟着你的节奏走，让你很享受。'
      },
      교탐: {
        love: '你有点贪心，想被自己看中的人选中。在感情里，你的标准也偏高。',
        work: '你的成就欲很强。好位置、好成果一出现，你就想稳稳地把它变成自己的。',
        sex: '对方的反应你想看个够，满足感也要来得够强烈。在亲密这件事上，你同样宁要明确，不要敷衍。'
      },
      교식: {
        love: '好地方配好美食，这样特别的约会你最喜欢。比起平平淡淡，你想要一段值得记住的感情。',
        work: '乐趣和认可同时到位，你的效率会大幅提升。对你来说，结果重要，过程里的满足感也重要。',
        sex: '气氛、空间、香气，连那杯酒在内，整体的情调你都很看重。在这样的情调里展现自己的魅力，是你的乐趣。'
      },
      교색: {
        love: '你对自己的魅力心里有数。遇到喜欢的人，你会很自然地去吸引对方的注意。',
        work: '你很有吸引人的天分。在能被关注、能掌握主导的事情上，你格外出彩。',
        sex: '你喜欢先把气氛造起来，把对方的目光吸引过来。感觉到对方正被你撩得心神不定，你才最满足。'
      },
      질교: {
        love: '对方对谁上心、对谁感兴趣，你都看得很仔细。你也希望自己被当成特别的那个人。',
        work: '在处处被比较的环境里，你会有压力，可这同时也成了你拿出高成绩的动力。',
        sex: '你需要确信，对方被你吸引的程度胜过任何人。在比较中占上风的感觉，对你也是一种刺激。'
      },
      질분: {
        love: '一吃醋，你的表情和语气就藏不住。心里委屈了，也忍不了太久。',
        work: '对手就在眼前时，你的专注力会直线上升。不想输的心情，很快就会变成行动。',
        sex: '吃醋也好，委屈也好，这类强烈的情绪一上来，你们之间的肢体接触反而更多，张力也更足。'
      },
      질나: {
        love: '心里是在意的，可要你去争、去缠着对方，你只觉得累。到头来，你还是会选让自己舒服的关系。',
        work: '你会和别人比较，却不会什么竞争都往里跳。只在必要的时候才发力，是你的风格。',
        sex: '你想被关注，却嫌复杂的拉扯太累。对方专心对你、舒服又安稳的关系，才是你的偏好。'
      },
      질탐: {
        love: '对方一对别人表现出兴趣，你就想从对方那里得到更多的关注。',
        work: '有人拿出好成绩，你就想要比那更好的。竞争，会勾起你的野心。',
        sex: '对方的关注和爱意，你想得到满满的。关系越亲近，你想要的爱意表达和肢体接触也越多。'
      },
      질식: {
        love: '看到别人享受的约会和恋爱，你也会想拥有差不多的体验。',
        work: '有趣的、正被热议的事，你很快就会感兴趣。周围的气氛对你的影响还挺大的。',
        sex: '你喜欢两个人一起享受气氛，但至少在那一刻，你想把对方的注意力全部占为己有。'
      },
      질색: {
        love: '越喜欢，你越会留意对方的小举动。有别人靠近时，你自然而然就会在意起来。',
        work: '人与人之间的微妙气氛，你总能准确捕捉。在竞争和人际关系交织的局面里，你的反应很快。',
        sex: '越是喜欢的人，你对肢体接触和对方的反应就越敏感。“对方只专注于我”的感觉，对你是很强的刺激。'
      },
      분교: {
        love: '一觉得没被尊重，你会立刻拉开距离，或者把情绪说出来。自尊心，是你衡量感情的重要标准。',
        work: '遇到不公平或憋屈的情况，你会站出来发声。责任感和好胜心，会在你身上一起高涨。',
        sex: '在床上，你也不愿轻易被牵着走，更想由自己来定调。和对方强烈碰撞出的那股张力，你很享受。'
      },
      분질: {
        love: '喜欢的人对别人表现出兴趣时，你的情绪可能很快就乱了。不过，你不会把心思藏起来。',
        work: '竞争的时候，是你最强的时候。被人甩在后面的感觉，会把你的行动力一下子拉高。',
        sex: '醋意或好胜心一上来，你们之间的张力也会迅速升高。情绪越浓，你在肢体接触上就越主动。'
      },
      분나: {
        love: '一般的事你都会让它过去，可一旦觉得对方越了线，态度就会突然一变。平时的你其实挺随和的。',
        work: '麻烦的琐事你会省着力气，可一出问题，你很快就站出来。你是“选择性强大”的类型。',
        sex: '平时慢悠悠的你，开关一打开，气氛就完全不一样了。开始时慢慢来，一旦投入就很强烈。'
      },
      분탐: {
        love: '你讨厌自己想要的关系被打乱。只要喜欢上了，想守住这段关系的心也很强。',
        work: '目标受到干扰时，你会很敏感。但目标一旦定下，你就不会轻易放弃。',
        sex: '有了想要的，你会明确地表达出来。在亲密这件事上，你也会主动投入，直到满足为止。'
      },
      분식: {
        love: '就算吵了架，你也不想拖太久，更愿意一起吃吃玩玩，把气氛缓和过来。',
        work: '压力你不会闷在心里太久，而是当场就释放掉。你属于恢复速度很快的那一型。',
        sex: '酒意或气氛把情绪带上来时，你的肢体接触也会很快变得主动。你忠于当下的欲望和感觉。'
      },
      분색: {
        love: '喜欢也好，委屈也好，你都感受得很强烈。你的恋爱，很少会平平淡淡地过。',
        work: '一有兴趣，你就动得很快。热情有多足，受情绪化场面的影响也就有多大。',
        sex: '一旦被吸引，你的反应又快又强烈。情绪和欲望同时涌上来的时候，你投入得最火热。'
      },
      나교: {
        love: '你不会刻意去纠缠，但希望得到对方的尊重。相处舒服、又能守住自尊的关系，最合你意。',
        work: '你想少花点力气，又拿出好结果。效率，在你眼里相当重要。',
        sex: '比起自己先费心，你更喜欢对方主动靠过来。舒舒服服待着，气氛一到，你又会悄悄把主导权拿过来。'
      },
      나질: {
        love: '对方的举动你明明在意，可要当面追问或跟人较劲，你又觉得太累。',
        work: '你会和周围的人比较，却不会对每场竞争都有反应。你更习惯守住自己的节奏。',
        sex: '你想确认对方的爱意，却讨厌复杂的较劲和拉扯。舒舒服服地贴着，亲密接触顺势延续，这样的关系你最喜欢。'
      },
      나분: {
        love: '能过去的事你一般都让它过去，但对方一再越线，你就会变得很坚决。平时的你相当从容。',
        work: '平时你省着力气，可问题一来，专注力会突然飙升。',
        sex: '平时不紧不慢，情绪猛地涌上来的那一刻，你却比想象中主动。你是反差极大、自带反转的类型。'
      },
      나탐: {
        love: '你想要一段好的感情，却不喜欢太累人的恋爱。舒服、满意度又高的关系，才是你的首选。',
        work: '用很少的努力换来大成果的方法，你很会找。你对效率的嗅觉相当不错。',
        sex: '你想轻松地享受，满足感却一点不能少。动得越少越好，快乐越多越好，说的就是你。'
      },
      나식: {
        love: '一起躺着、吃东西、休息，连这种平凡的时光都很合拍的人，最让你心动。',
        work: '没有乐趣的事，很容易让你累。可环境一舒服，你反而能稳稳地做得很好。',
        sex: '你喜欢在床上舒服地贴在一起，让亲密接触慢慢延续。比起急匆匆的气氛，你更偏向长久地享受。'
      },
      나색: {
        love: '你喜欢心动的感觉，却嫌复杂的拉扯太累。自然而然走近的关系，更吸引你。',
        work: '只有觉得人或事有意思的时候，你的能量才会真正涨起来。',
        sex: '比起自己先主动扑上去，你更喜欢气氛慢慢酝酿、水到渠成。你的渴望，是在安心舒适里一点点升温的。'
      },
      탐교: {
        love: '你想成为心仪之人选中的那一个，对感情的标准也偏高。',
        work: '一有目标，你的成就欲就会变强。好成果和认可，你两样都不想错过。',
        sex: '想要的反应和满足，你都要实实在在地得到。你既想在对方眼里魅力十足，又不想放掉主导权。'
      },
      탐질: {
        love: '对方的注意力一飘到别处，你也会想要更多的关注落在自己身上。',
        work: '别人拿出好成绩，你就会瞄准更高的目标。竞争给了你很多动力。',
        sex: '你想得到对方足够多的关注，也很看重“我比任何人都特别”的感觉。'
      },
      탐분: {
        love: '中意的感情，你不想轻易放手。对方的回应不如你所愿时，你可能会觉得憋闷。',
        work: '你讨厌错过机会，也讨厌被人妨碍。在目标面前，你相当执着。',
        sex: '有了想要的，你会直接说出来。气氛对了，你会主动带着节奏走，不上不下地收场只会让你觉得可惜。'
      },
      탐나: {
        love: '你想要一段让自己满意的感情，可如果过程太辛苦，你可能很快就累了。',
        work: '你想得到很多，却想避开不必要的辛苦。你追求的是高效率的成功。',
        sex: '享受要轻松，满意度却必须高。不用太费力也能尽兴的气氛，最合你的心意。'
      },
      탐식: {
        love: '好的约会、愉快的体验，你都想尽情享受。在感情里，你也很看重满足感。',
        work: '你想要的多，能量也足。在回报明确的事情上，你尤其强。',
        sex: '比起单一的刺激，你更喜欢多种感官同时被满足。好气氛一到位，你就想尽可能久地享受下去。'
      },
      탐색: {
        love: '有了喜欢的人，你就想把关系确定下来。你不是会让暧昧状态拖很久的人。',
        work: '你既有吸引人的天分，又有成就欲。在人和成果挂钩的事情上，你比较强。',
        sex: '一旦来电，你就很主动，表达欲望也比较坦率。和心仪的人，你想让亲密接触实实在在地继续下去。'
      },
      식교: {
        love: '你喜欢特别的约会和好的气氛。两个人一起度过的时间质量如何，你相当看重。',
        work: '乐趣和认可兼得时，你的效率会大大提高。你的个人喜好，对结果的影响不小。',
        sex: '灯光、香气、音乐、酒，把气氛布置好对你很重要。在迷人的情境里，你也想秀出自己的魅力。'
      },
      식질: {
        love: '看到别人那种看起来很快乐的感情，你也会想亲自体验一下。',
        work: '你很容易受周围气氛影响。和有趣的人在一起时，你的专注力会更高。',
        sex: '你喜欢一起享受的感觉，但对方的注意力一定要集中在你身上。注意力一分散，你的投入度也会跟着下降。'
      },
      식분: {
        love: '就算吵架，你也不想拖着，更想一起吃点东西或玩一玩，快点把气氛缓过来。',
        work: '压力你不会攒着，而是马上释放。恢复得快，但也可能被一时的情绪左右。',
        sex: '情绪一上来，你身体的反应也跟着变快。浓烈的气氛加上感官的刺激，会让你格外投入。'
      },
      식나: {
        love: '舒舒服服地吃、懒懒地歇着，这种日常型的约会最对你的胃口。',
        work: '环境舒服、气氛好，你就能稳稳地做好。在没意思的环境里，你很容易累。',
        sex: '比起急着推进，你更喜欢舒服地躺着，让亲密接触久久延续。舒适本身，就是重要的刺激。'
      },
      식탐: {
        love: '好的感情和好的体验，你两样都想尽情拥有。谈恋爱，你同样看重满意度。',
        work: '回报和乐趣都明确的事，是你的强项。目标越大，你的能量也越大。',
        sex: '喜欢的体验，你想享受得够久。在满足之前，你不太愿意轻易结束。'
      },
      식색: {
        love: '人、地方、美食、酒，这些一起感受的氛围你很看重。你懂得享受约会本身。',
        work: '认识新的人、尝试新的体验，会让你能量上升。营造气氛，你也很有一套。',
        sex: '肢体接触、香气、音乐、酒、氛围，凡是撩动五感的东西你都格外没抵抗力。情调一好，欲望也来得很快。'
      },
      색교: {
        love: '你想在喜欢的人眼里显得有魅力。就算喜欢上谁，你也不是会丢掉自信的类型。',
        work: '你有把人吸引过来的本事。演讲、销售、服务这类需要存在感的工作，是你的强项。',
        sex: '你享受对方的目光和反应，习惯先把气氛带起来。感觉到自己正把对方一点点吸引过来，你就很满足。'
      },
      색질: {
        love: '越喜欢，你越会仔细地看对方的一举一动。别人靠近时，你会暗暗在意。',
        work: '人与人之间的气氛，你察觉得很快。在竞争和人际关系交织的环境里，你习惯凭直觉行动。',
        sex: '越喜欢，你对对方的反应越敏感，想独占的心也越强。对方只专注于你的那一刻，你最投入。'
      },
      색분: {
        love: '喜欢就明明白白地喜欢，委屈就明明白白地说。你的恋爱不是平平静静的，而是火热的。',
        work: '觉得有意思，你就动得很快。只是在工作上，你也挺容易受情绪影响。',
        sex: '一旦来电，你很快就会热起来。强烈的情感和肢体接触一同升温的关系，是你喜欢的。'
      },
      색나: {
        love: '你喜欢心动，却讨厌复杂的拉扯。轻轻松松就亲近起来的关系，是你的偏好。',
        work: '人或事有趣的时候，你的专注力就会上来。在过于重复的环境里，你可能很快失去兴趣。',
        sex: '欲望是有的，但你不想把事情弄复杂。舒服地贴着，再自然地过渡到亲密接触，这种节奏你最喜欢。'
      },
      색탐: {
        love: '对喜欢的人，你想得到明明白白的关注。关系一直暧昧不清，会让你觉得憋闷。',
        work: '你兼具吸引人的天分和目标感。想要的结果一出现，你就会迅速行动。',
        sex: '只要是心仪的人，关注和肢体接触你都想要得足够多。好奇心一起，你对新的气氛、新的尝试也比较开放。'
      },
      색식: {
        love: '和对的人一起享受美食、好酒和气氛，是你的最爱。约会里感官的那一面，你很看重。',
        work: '新的人和新的体验会给你能量。在有趣的环境里，你很擅长把气氛带起来。',
        sex: '你对气氛非常敏感。酒、香气、音乐，乃至肌肤的触感，全都对上的时候，你的欲望和投入度会大大升高。'
      }
    }
  },

  /* 日本語. 손님 폰 언어가 일본어이거나 표지에서 日本語 를 고르면 나온다.
     빠진 문구는 영어 것으로 채워진다 (enhance.js 의 t · pack). 설문 · 메뉴 · 술 이야기의 일본어는 quiz.js · data.js · stories.js 의 ja. */
  ja: {
    ui: {
      menu: 'MENU',
      docTitle: 'DEADLY SINS · 七つの大罪診断',
      /* 원본 화면 문구 */
      start: 'タップしてスタート',
      footerTip: '答えをタップすると次の質問へ進みます。',
      legendWeak: '白抜き = 弱い',
      legendStrong: '塗りつぶし = 強い',
      toDesire: '私のシグネチャーカクテルに出会う →',
      sigTitle: 'あなたの欲望を<br>満たして',
      sigSub: 'あなたの罪に似た一杯に出会ってください。',
      love: '恋愛', work: '仕事', sex: '夜の顔',
      ageWarn: '29禁・のぞき見禁止',
      lockMain: 'タップして結果を見る',
      /* 개선 레이어 문구 */
      tasteHead: 'この一杯の味',
      aroma: '香り', taste: '味わい', finish: 'フィニッシュ', strength: '強さ', price: '価格',
      won: 'ウォン',
      pairHead: '同じ罪のウイスキー',
      glass: 'グラス',
      order: 'バーテンダーに見せる',
      saveImage: '画像を保存',
      soldOut: '売り切れ', soldOutNote: '本日は売り切れです。',
      sigSoldOut: '本日この一杯は売り切れです。バーテンダーに、似た味わいの一杯をおすすめしてもらってください。',
      share: 'シェア', shareInvite: 'あなたも診断：', shareKicker: '結果をシェア',
      shareHint: '画像を長押しして保存し、インスタのストーリーやLINEでシェアしてください。',
      copyLink: '診断リンクをコピー', copied: 'コピーしました',
      fullMenu: '全メニュー',
      restart: '最初からやり直す',
      close: '閉じる',
      orderNote: 'この画面をバーテンダーに見せてください',
      orderKicker: 'TONIGHT’S ORDER',
      making: '画像を作成中…',
      shareTitle: '今夜の私の罪',
      shareText: (en, kr) => `今夜の私の罪は ${en} — ${kr}`,
      yourSin: 'あなたの罪',
      menuSeven: 'SEVEN SINS',
      menuSevenNote: (p) => `シグネチャー7種 · 各${p}ウォン`,
      menuWhisky: 'WHISKY SELECTION',
      menuBites: 'BITES', menuCocktails: 'COCKTAILS', menuBeverages: 'BEVERAGES', menuInfo: 'INFORMATION',
      menuNote: '価格は変更になる場合があります。',
      tapHint: '名前をタップすると詳細が見られます',
      bottle: 'ボトル', cask: '樽', nose: '香り', palate: '味わい', recipe: '材料', plate: '内容', photoCredits: '写真の出典', photoEdited: '背景除去・サイズ調整', photoEditedGray: '背景除去・モノクロ・サイズ調整',
      learnMore: 'このお酒について', storyHistory: 'ストーリー', storyLayers: '味の流れ', storyServe: 'おすすめの飲み方',
      layerLabels: ['香り', 'ひと口目', '中盤', '余韻'], loading: '読み込み中…',
      storyError: '読み込めませんでした。少し時間をおいてもう一度タップしてください。',
      detailNote: '一般的な製品情報です。店内のボトルは、バッチや製造年によって多少異なる場合があります。'
    },

    aria: {
      cover: '表紙', coverArt: 'Deadly Sinsのモノクロロゴ',
      quiz: '七つの質問', progress: '質問の進み具合', choices: '答えを選ぶ',
      results: '診断結果', radar: '七つの大罪の傾向グラフ',
      signature: 'あなたのシグネチャーカクテルの画像', back: '前の画面に戻る', art: ' のシンボルとグラス'
    },

    reactions: ['おっ！', 'なるほど！', 'あやしい！', 'そういう好み？', 'おもしろい！', '正直だね？',
      'そうなんだ！', '大胆！', '覚えておくね！', 'ふふ…', '意外！', 'やっぱり！'],

    sins: { 교: '傲慢', 질: '嫉妬', 분: '憤怒', 나: '怠惰', 탐: '強欲', 식: '暴食', 색: '色欲' },
    drinkName: {
      교: '傲慢の酒', 질: '嫉妬の酒', 분: '憤怒の酒', 나: '怠惰の酒',
      탐: '強欲の酒', 식: '暴食の酒', 색: '色欲の酒'
    },

    /* 결과 성향 49개 (단일 7 + 순서쌍 42). 키는 en.traits 와 같다. */
    traits: {
      교: {
        love: '好きでも簡単にはすがらない。互いに尊重し合い、自分を特別に扱ってくれる関係が好き。',
        work: '認められるほど没頭していく。任されたからには、誰よりもうまくやり遂げたい。',
        sex: 'ベッドでも主導権を握りたいタイプ。自分の魅力に相手が反応する姿を見るのが、何よりの満足。'
      },
      질: {
        love: '好きな人の口調や視線の変化にすぐ気づく。関心がよそへ向くと、内心穏やかではいられない。',
        work: 'ライバルがいると集中力が増す。比べられるのはストレスだけど、成長の刺激にもなる。',
        sex: '相手の意識が自分だけに向いている、という確信が大事。気がそれると、嫉妬や独占欲が顔を出しがち。'
      },
      분: {
        love: 'モヤッとしたことは隠さず、すぐに伝えるほう。感情表現がストレートだから、関係も一気に熱くなる。',
        work: 'もどかしいことや理不尽なことを見過ごさない。いざという時、真っ先に動くタイプ。',
        sex: '穏やかなムードより、感情もテンションも高い関係に惹かれる。互いに強く反応し合うほど、深く没頭していく。'
      },
      나: {
        love: '面倒な駆け引きより、一緒にいてラクな関係が好き。無理しなくても自然体でいられる人に惹かれる。',
        work: 'がむしゃらより効率重視。力を抜いて結果を出すコツを見つけるのがうまい。',
        sex: '凝ったムード作りより、くっついてゴロゴロ。そのまま自然にスキンシップへ、が理想の流れ。'
      },
      탐: {
        love: '気になる人ができたら、曖昧なままにはしておけない。関係をはっきりさせたいタイプ。',
        work: '目標ができると、欲に迷いがない。いいチャンスと見れば、すかさずつかみにいく。',
        sex: '一度ハマると、少しだけでは物足りない。スキンシップもその先も、満足するまでとことん楽しみたい。'
      },
      식: {
        love: 'デートもひとつのお楽しみ。グルメ、お酒、旅行など、一緒に味わう体験を大切にする。',
        work: '面白いと感じる仕事にはとことんのめり込む。逆に興味が持てないと、集中力が一気に落ちることも。',
        sex: '香り、お酒、音楽、肌の感触といった感覚的なものに弱い。雰囲気が合えば、長く楽しみたくなる。'
      },
      색: {
        love: 'ときめきと惹かれ合う感覚が大事。気になる人ができると、好意が自然と行動に表れる。',
        work: '人や場の空気を読む感覚に優れている。興味がわいた仕事には、一気にエンジンがかかる。',
        sex: '惹かれ合ったら、スキンシップまでが早いタイプ。気に入った相手には、欲求を比較的素直に伝える。'
      },
      교질: {
        love: '恋愛でも認められたい気持ちが強い。相手がほかの人を気にかけると、ひそかに負けず嫌いに火がつく。',
        work: '競争があると、ぐっと強くなる。人に後れを取っている感覚が、かえって実力を引き上げる刺激になる。',
        sex: '相手が完全に自分にハマっている、と感じられるのが好き。関心を確かめるほど、主導権も握りたくなる。'
      },
      교분: {
        love: 'ないがしろにされるのが特に嫌い。尊重が崩れると、すぐに気持ちを口に出す。',
        work: 'プライドを刺激されると、かえって集中力が上がる。一度引き受けたら、簡単には引き下がらない。',
        sex: '優しく穏やかなものより、テンション高く強く没頭できる雰囲気が好き。主導権の奪い合いも刺激になる。'
      },
      교나: {
        love: '好きでも、わざわざ追いかけたりはしない。自然と自分を好きになってくれる人に、心が傾く。',
        work: '力は温存しつつ、結果はしっかり出したい。効率と完成度を両立させるタイプ。',
        sex: 'ゆるく始まっても、ムードが高まると自然に主導権を握るほう。相手がついてくるのを楽しむ。'
      },
      교탐: {
        love: '気になる人に選ばれたいという欲がある。恋愛でも求める基準は高め。',
        work: '達成欲が強い。いいポジションや成果が見えたら、確実に自分のものにしたい。',
        sex: '相手の反応もじっくり見たいし、満足感もたっぷり味わいたい。肌を重ねるときも、中途半端より確かなものを選ぶ。'
      },
      교식: {
        love: 'いいお店、おいしい料理のような特別なデートが好き。ありきたりな関係より、記憶に残る関係を求める。',
        work: '面白さと評価がそろうと、能率がぐんと上がる。結果だけでなく、過程の満足感も大切にする。',
        sex: '雰囲気、空間、香り、お酒まで、トータルのムードを重視。その中で自分の魅力を披露するのが楽しい。'
      },
      교색: {
        love: '自分の魅力をそれなりに自覚している。気になる人ができると、自然と相手の気を引こうとする。',
        work: '人を引き込むのが上手。注目されたり、リードできたりする場面で強みを発揮する。',
        sex: '先に雰囲気を作って、相手の視線を引きつけるのが好き。自分が相手を揺さぶっている、という手応えが満足感に。'
      },
      질교: {
        love: '相手が誰に関心を向けているか、よく見ている。自分も特別な存在だと感じたい。',
        work: '比べられる環境はストレスにもなるけれど、同時に高い成果を生む原動力にもなる。',
        sex: 'ほかの誰よりも自分に惹かれている、という確信が大事。比べて勝っている感覚も刺激になる。'
      },
      질분: {
        love: '嫉妬すると、表情や口ぶりにすぐ出る。傷ついた気持ちを長くは溜め込まない。',
        work: 'ライバルの姿が見えると、集中力が跳ね上がる。負けず嫌いが、すぐ行動に変わる。',
        sex: '嫉妬や寂しさのような強い感情がわくと、かえってスキンシップも、ふたりの夜の温度も上がりやすい。'
      },
      질나: {
        love: '気にはなるけれど、張り合ったりすがったりするのは面倒。結局、ラクな関係を選びがち。',
        work: '人と比べはするけど、すべての競争に飛び込みはしない。必要な時だけ力を出すタイプ。',
        sex: 'かまってほしいけど、面倒な駆け引きは疲れる。自分だけを見てくれる、穏やかで安定した関係が理想。'
      },
      질탐: {
        love: '相手がほかの人に興味を見せると、そのぶん自分にもっと関心を向けてほしくなる。',
        work: '誰かがいい結果を出すと、自分はそれ以上が欲しくなる。競争が欲に火をつける。',
        sex: '相手の関心と愛情をたっぷり受けたい。距離が縮まるほど、愛情表現もスキンシップも多めに求めがち。'
      },
      질식: {
        love: '周りが楽しんでいるデートや恋愛を見ると、自分も同じような経験がしたくなる。',
        work: '面白くて話題になっていることに、すぐ興味が向く。周りの空気にけっこう左右されるほう。',
        sex: '一緒にムードを楽しむのが好き。でもその瞬間だけは、相手の関心を独り占めしたい。'
      },
      질색: {
        love: '好きになるほど、相手の小さな仕草までよく見ている。ほかの人が近づくと、自然と気になってしまう。',
        work: '人間関係の空気を読むのがうまい。競争と人づきあいが絡む場面で、勘が冴える。',
        sex: '好きな相手ほど、スキンシップや反応に敏感になる。自分だけに集中してくれている感覚が、強い刺激に。'
      },
      분교: {
        love: '尊重されていないと感じたら、すぐに距離を置くか、気持ちをぶつける。プライドが恋愛の大事な物差し。',
        work: '理不尽な状況やもどかしい場面では、声を上げるほう。責任感と負けん気が一緒に高まる。',
        sex: 'ベッドでも流されるより、自分でムードをつかみたい。相手と強くぶつかり合うテンションを楽しむ。'
      },
      분질: {
        love: '好きな人がほかの誰かに興味を示すと、気持ちがすぐ揺れる。そのかわり、その思いを隠しはしない。',
        work: '勝負の場面でこそ、いちばん強くなる。押されていると感じるほど、行動力が増すタイプ。',
        sex: '嫉妬や対抗心がわくと、関係のテンションも一気に上がる。感情が強いほど、スキンシップも大胆に。'
      },
      분나: {
        love: 'たいていのことは流すけれど、一線を越えられたと感じると態度がガラッと変わる。普段はかなり気楽な人。',
        work: '面倒なことには力を温存、問題が起きればすぐ前に出る。ここぞという時に強いタイプ。',
        sex: '普段はのんびりなのに、スイッチが入ると雰囲気が一変。始まりはゆっくり、入り込むと一気に熱くなる。'
      },
      분탐: {
        love: '望んだ関係が乱されるのを嫌う。気に入った相手との関係は、守り抜きたい気持ちも強い。',
        work: '目標を邪魔されると敏感に反応する。そのかわり、一度目標を決めたら簡単にはあきらめない。',
        sex: '望むことがあれば、はっきり態度で示す。肌を重ねるときも、満足するまで積極的にのめり込むほう。'
      },
      분식: {
        love: 'ケンカしてもズルズル引きずらない。一緒においしいものを食べて、遊んで、空気を和ませたい。',
        work: 'ストレスは寝かせず、その場で吐き出すほう。切り替えが早く、回復も早いタイプ。',
        sex: 'お酒や雰囲気で気持ちが高まると、スキンシップもすぐ積極的に。その瞬間の欲求と感情に正直なタイプ。'
      },
      분색: {
        love: '好きという気持ちも、傷ついた気持ちも強く感じる。恋愛が淡々と進むタイプではない。',
        work: '興味がわくとすぐ動く。情熱が強いぶん、感情的な場面の影響も大きく受ける。',
        sex: '惹かれたら、すばやく強く反応する。感情と欲求が同時に高まる時こそ、いちばん熱く没頭するタイプ。'
      },
      나교: {
        love: 'わざわざすがりはしないけど、相手からの敬意は欲しい。ラクでいながら、プライドも守れる関係が理想。',
        work: '労力は少なく、結果はしっかり出したい。効率はかなり重視するほう。',
        sex: '自分から頑張るより、相手から来てくれるのが好き。のんびりしていても、ムードが整えばさりげなく主導権を握る。'
      },
      나질: {
        love: '相手の行動は気になる。でも、問い詰めたり競ったりするのは正直おっくう。',
        work: '周りとの比較はしても、いちいち競争には反応しない。自分のペースを守るほう。',
        sex: '愛情は確かめたいけど、張り合いや駆け引きはごめん。気楽にくっついたまま、触れ合いが続く関係が好き。'
      },
      나분: {
        love: '基本は大目に見るけれど、何度も一線を越えられるとキッパリする。普段はかなりおおらか。',
        work: '普段は省エネモード。でも問題が起きると、急に集中力のスイッチが入る。',
        sex: '普段はゆるいのに、感情が一気に高まる瞬間は意外なほど積極的。温度差の大きいギャップ型。'
      },
      나탐: {
        love: 'いい恋愛はしたいけど、しんどすぎる恋はイヤ。気楽で満足度の高い関係が理想。',
        work: '少ない労力で大きな成果を出す方法を見つけるのが得意。効率を見抜く勘がいい。',
        sex: '気楽に楽しみつつ、満足感はしっかり欲しい。動きは最小限、楽しさは最大限がモットー。'
      },
      나식: {
        love: '一緒に寝転んで、食べて、休む。そんな何気ない時間がしっくりくる人に惹かれる。',
        work: '楽しくない仕事にはすぐ疲れてしまう。でも居心地のいい環境があれば、むしろ地道に成果を積み上げる。',
        sex: 'ベッドでのんびりくっついて、ゆっくりスキンシップを続けるのが好き。急ぐより、長く味わうほう。'
      },
      나색: {
        love: 'ドキドキは好きでも、ややこしい駆け引きには疲れてしまう。自然と距離が縮まる関係に惹かれる。',
        work: '人や仕事を面白いと感じた時にだけ、ぐっとエネルギーが上がる。',
        sex: '自分からガツガツいくより、雰囲気が自然に熟すのを待つのが好き。くつろぎの中で、欲求がじわじわ高まっていく。'
      },
      탐교: {
        love: '好きになった人には、自分を選んでほしい。恋愛の理想も高いほう。',
        work: '目標ができると、達成欲に火がつく。いい結果も評価も、どちらも逃したくない。',
        sex: '望む反応と満足を、確実に手に入れたい。相手に魅力的に映りつつ、主導権も手放したくない。'
      },
      탐질: {
        love: '相手の気持ちがよそへ向くと、もっと自分を見てほしいという欲が強くなる。',
        work: '人がいい結果を出すと、自分はさらに上を狙いたくなる。競争から大きなモチベーションをもらう。',
        sex: '相手の関心をたっぷり受けたい。ほかの誰よりも特別な存在だと感じられることが大切。'
      },
      탐분: {
        love: '気に入った関係は、簡単には手放したくない。思うような反応がないと、もどかしくなることも。',
        work: 'チャンスを逃したり邪魔されたりするのが大嫌い。目標を前にすると、とことん粘り強い。',
        sex: '欲しいものはストレートに口にする。ムードが合えば積極的にリードし、中途半端に終わるのは物足りない。'
      },
      탐나: {
        love: '満たされる関係を望むけど、そこまでの道のりが大変すぎると、すぐに疲れてしまう。',
        work: 'たくさん手に入れたいけど、ムダな苦労は避けたい。効率のいい成功を追い求める。',
        sex: 'ラクに楽しみたいけど、満足度は高くないとイヤ。頑張りすぎなくても、たっぷり楽しめる雰囲気が好き。'
      },
      탐식: {
        love: '素敵なデートや楽しい体験を、思う存分味わいたい。関係にも、しっかりした満足感を求める。',
        work: '欲しいものが多く、エネルギーも大きいほう。見返りがはっきりしている仕事には特に強い。',
        sex: 'ひとつの刺激より、いくつもの感覚が同時に満たされるのが好き。いいムードになったら、できるだけ長く楽しみたい。'
      },
      탐색: {
        love: '好きになったら、きちんと恋人同士になりたい。どっちつかずの関係を長引かせるタイプではない。',
        work: '人を巻き込む力と、成果への欲を両方持っている。人と結果が結びつく仕事で本領を発揮する。',
        sex: '惹かれたら積極的、欲しい気持ちもわりと正直に伝える。気に入った相手とは、触れ合いをしっかり重ねていきたい。'
      },
      식교: {
        love: 'とっておきのデートと、いい雰囲気が好き。一緒に過ごす時間の質にはこだわりがある。',
        work: '楽しくて、しかも認められる。そんな時に能率がいちばん上がる。好き嫌いが結果に出やすいほう。',
        sex: '照明、香り、音楽、お酒。ムードのセッティングにこだわるタイプ。素敵なシーンの中で、自分の魅力も存分に見せたい。'
      },
      식질: {
        love: '幸せそうなカップルを見ると、自分もあんな時間を過ごしてみたくなる。',
        work: '周りの雰囲気に影響されやすい。面白い人たちと一緒だと、集中力が上がる。',
        sex: '感覚を分かち合うのは好きだけど、相手の関心だけは自分に向けてほしい。気がそれると、没頭度も下がってしまう。'
      },
      식분: {
        love: '言い合いになっても、長くは引っ張らない。ごはんや遊びで、さっさと仲直りしたいタイプ。',
        work: 'ストレスは溜めずにすぐ発散。立ち直りが早いぶん、その時の気分に左右されることも。',
        sex: '気持ちが高ぶると、体の反応も早くなるほう。強いムードと五感への刺激がそろうと、特に没頭する。'
      },
      식나: {
        love: '気楽に食べて、まったり休んで過ごす。そんな日常型のデートがいちばん好き。',
        work: '快適な環境と心地いい空気がそろえば、安定して力を発揮する。退屈な場所ではすぐにバテてしまう。',
        sex: '急いで盛り上げるより、のんびり横になって長く触れ合っていたい。リラックスそのものが最高の刺激。'
      },
      식탐: {
        love: 'いい恋もいい体験も、両方とことん楽しみたい。満足度にはこだわるほう。',
        work: '報酬と楽しさがはっきりしている仕事に強い。目標が大きいほど、エネルギーもわいてくる。',
        sex: '気に入った体験は、心ゆくまで長く味わいたい。満足する前に終わらせるのは、どうも惜しい。'
      },
      식색: {
        love: '人、場所、料理、お酒。一緒に感じる雰囲気を大切にする。デートそのものを楽しめる人。',
        work: '人と会ったり、新しい体験をしたりする仕事でエネルギーが上がる。場の空気を作るセンスもある。',
        sex: 'スキンシップ、香り、音楽、お酒、ムード。五感をくすぐるものにとにかく弱い。雰囲気がよければ、欲求もすぐ高まる。'
      },
      색교: {
        love: '好きな人には魅力的に見られたい。好きになっても、自信を失うタイプではない。',
        work: '人を惹きつける力がある。プレゼン、営業、接客など、存在感が求められる仕事で輝く。',
        sex: '相手の視線や反応を楽しみながら、自分から雰囲気を作るほう。相手を引き寄せている感覚に満足を覚える。'
      },
      색질: {
        love: '好きになるほど、相手の一挙一動を細かく追ってしまう。ほかの誰かが近づくと、心がそっとざわつく。',
        work: '人と人との間に流れる空気を、すばやく察知する。競争と関係が入り混じる場で、直感的に動けるタイプ。',
        sex: '好きになるほど相手の反応に敏感になり、独り占めしたい気持ちもふくらむ。自分だけを見てくれる瞬間に、いちばん没頭する。'
      },
      색분: {
        love: '好きならとことん好きだし、不満があればはっきり言う。恋愛は穏やかというより熱いタイプ。',
        work: '面白いと感じたら即行動。ただ、仕事でも感情にけっこう左右されるほう。',
        sex: '惹かれると、一気に熱くなるほう。強い感情とスキンシップが一緒に高まっていく関係が好き。'
      },
      색나: {
        love: 'ときめきは大好き、でも面倒な駆け引きは苦手。肩の力を抜いて近づける関係がいい。',
        work: '一緒にいる人や仕事が楽しいと集中力が上がる。単調な繰り返しが続くと、すぐに飽きてしまうことも。',
        sex: '欲はあっても、わざわざややこしくはしたくない。気楽に寄り添ううちに、自然と触れ合いへ移っていくのが好き。'
      },
      색탐: {
        love: '好きな人からは、はっきりと関心を向けられたい。関係を曖昧にしておくのはもどかしい。',
        work: '人を魅了するセンスと、ブレない目的意識をあわせ持つ。狙った結果が見えたら、すぐさま動き出す。',
        sex: '気に入った相手なら、関心もスキンシップもたっぷり欲しい。好奇心がわけば、新しいムードや試みにもわりとオープン。'
      },
      색식: {
        love: '素敵な人と、おいしい料理にお酒、いい雰囲気を一緒に楽しむのが好き。デートの感覚的な部分を大事にする。',
        work: '新しい人や体験からエネルギーをもらう。楽しい場では、ムードメーカーになれるタイプ。',
        sex: '雰囲気にとても敏感。お酒、香り、音楽、肌の感触まで、すべてがかみ合った時に欲求も没頭度も一気に高まる。'
      }
    }
  }
};
