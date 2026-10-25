/* =============================================================
   DEADLY SINS — 화면 문구 (한국어 / English)
   ko 는 개선 레이어가 새로 더한 문구만 있습니다. 원본 문구는 원본 HTML 에서 그대로 읽습니다.
   en.questions 는 원본 QUESTIONS 의 "원래 순서"와 같아야 합니다 (보기를 섞어도 짝이 유지됨).
   en.traits 의 키는 원본 RESULT_TRAITS 와 같아야 합니다 (단일 7개 + 순서쌍 42개).
   ============================================================= */
window.DS_I18N = {
  ko: {
    ui: {
      langToggle: 'EN',
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
      langToggle: '한국어',
      menu: 'MENU',
      /* 원본 화면 문구 */
      start: 'Tap to begin',
      footerTip: 'Tap an answer to move on to the next question.',
      legendWeak: 'Empty heptagon = weak',
      legendStrong: 'Filled heptagon = strong',
      toDesire: 'Meet my signature drink →',
      sigTitle: 'Satisfy<br>your desire',
      sigSub: 'Meet the glass that looks like your sin.',
      love: 'Love', work: 'Work', sex: 'In bed',
      ageWarn: '29+ only. No peeking.',
      lockMain: 'Tap to reveal',
      /* 개선 레이어 문구 */
      tasteHead: 'In the glass',
      aroma: 'Aroma', taste: 'Taste', finish: 'Finish', strength: 'Strength', price: 'Price',
      won: ' KRW',
      pairHead: 'Whisky of the same sin',
      glass: 'Glass',
      order: 'Show the bartender',
      saveImage: 'Save image',
      soldOut: 'Sold out', soldOutNote: 'Sold out today.',
      sigSoldOut: 'This one is sold out tonight. Ask the bartender for something close.',
      share: 'Share', shareInvite: 'Try it:', shareKicker: 'Share your result',
      shareHint: 'Press and hold the image to save it, then post it to your Instagram story or send it to a friend.',
      copyLink: 'Copy test link', copied: 'Copied',
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
      menuSevenNote: (p) => `Seven glasses · ${p} KRW each`,
      menuWhisky: 'WHISKY SELECTION',
      menuBites: 'BITES', menuCocktails: 'COCKTAILS', menuBeverages: 'BEVERAGES', menuInfo: 'INFORMATION',
      menuNote: 'Prices may change.',
      tapHint: 'Tap a name for details',
      bottle: 'Bottle', cask: 'Cask', nose: 'Nose', palate: 'Palate', recipe: 'Build', plate: 'On the plate', photoCredits: 'Photo credits', photoEdited: 'background removed, resized', photoEditedGray: 'background removed, black and white, resized',
      learnMore: 'Learn more about this drink', storyHistory: 'The story', storyLayers: 'How it tastes', storyServe: 'How to drink it',
      layerLabels: ['Nose', 'First sip', 'Mid-palate', 'Finish'], loading: 'Loading…',
      storyError: 'Could not load this. Please try again in a moment.',
      detailNote: 'General product information; the bottle on our shelf (batch or year) may differ slightly.'
    },

    /* 답을 누르면 잠깐 뜨는 한마디 (원본 REACTIONS 와 같은 개수·순서) */
    reactions: ['Oh?', 'Noted.', 'Suspicious…', 'That’s your type?', 'Interesting.', 'Honest.',
      'I see.', 'Bold.', 'I’ll remember that.', 'Heh…', 'Didn’t expect that.', 'Called it.'],

    sins: { 교: 'Pride', 질: 'Envy', 분: 'Wrath', 나: 'Sloth', 탐: 'Greed', 식: 'Gluttony', 색: 'Lust' },
    drinkName: {
      교: 'The Drink of Pride', 질: 'The Drink of Envy', 분: 'The Drink of Wrath', 나: 'The Drink of Sloth',
      탐: 'The Drink of Greed', 식: 'The Drink of Gluttony', 색: 'The Drink of Lust'
    },

    /* 원본 QUESTIONS 순서 그대로 (A, B, C, D) */
    questions: [
      {
        q: 'It’s 2 a.m. and your crush texts: “Want to come over?”',
        a: [
          'I’m drawn in. I think about it for a second, then I go.',
          'If you miss me, you come here. I’m not moving at 2 a.m. for this.',
          'I keep wondering: is it just me, or do they text other people like this too?',
          'Tempting, but even the thought of heading out is exhausting. I’ll sleep and see them another time.'
        ]
      },
      {
        q: 'Your partner secretly bought a sex toy.',
        a: [
          'Curious what it is. It’s already bought, so let’s try it together.',
          'I’m hurt they didn’t tell me, so I confront them right away.',
          'If they were going to buy one, I would have picked a better one.',
          'Did they want to enjoy that without me? It keeps bugging me, and I’m a little angry.'
        ]
      },
      {
        q: 'You win the lottery jackpot. What’s the first thing you do?',
        a: [
          'Look into houses, buildings and investments to grow the money even more.',
          'Take a break from work and indulge in the finest food, drinks, hotels and travel.',
          'Stop working entirely and spend a while lying around, eating, playing and doing nothing.',
          'Show everyone who looked down on me just how well I’m doing.'
        ]
      },
      {
        q: 'On a trip with your partner, you alone get a free upgrade to business class.',
        a: [
          'Chances like this are rare. I’m properly enjoying the food, drinks, lounge and service.',
          'From the lounge to the in-flight service, I’m claiming every single perk I can.',
          'If my partner asks me to give it up, I get annoyed. Why should I give up my luck?',
          'They always seemed luckier than me. This time I got picked, and I’m quietly pleased.'
        ]
      },
      {
        q: 'For one day, people will grant any request you make.',
        a: [
          'Make the people I thought were better than me admit my ability, and their mistakes, to my face.',
          'Ask for enough money and property that I never have to work again.',
          'Spend a perfect day exactly my way with someone I’ve had my eye on: a great hotel, drinks, a date.',
          'Make the person who hurt me most apologize to my face and admit what they did.'
        ]
      },
      {
        q: 'If you could be guaranteed one thing tonight, what would you choose?',
        a: [
          'The person I like, who has other admirers, finally choosing me.',
          'The finest food and drink, as much as I want, no limits.',
          'Money or assets big enough to completely change my options in life.',
          'A life where I can eat, play and live without worry, never having to work hard again.'
        ]
      },
      {
        q: 'You can become famous, but you have to reveal one embarrassing secret from your past.',
        a: [
          'I hate that only people more famous and successful than me get noticed. If I can reach their level, I’ll reveal it.',
          'I can reveal it, but anyone who mocks or laughs at me won’t get away with it.',
          'Once famous, I’d have to explain myself and keep managing people’s reactions. Not worth it.',
          'If fame gets me great food, drinks, parties, invites and freebies without much effort, I’ll reveal it.'
        ]
      }
    ],

    /* 원본 RESULT_TRAITS 와 같은 키. love = 연애, work = 일, sex = 성적 성향 */
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
        sex: 'You’re drawn to high emotion and high tension over calm. The stronger you both react, the deeper you get.'
      },
      나: {
        love: 'You’d rather be comfortable together than play games. You’re drawn to people who feel easy without trying.',
        work: 'Smart over hard: you look for ways to get results with less effort, and you’re good at finding them.',
        sex: 'Instead of setting an elaborate mood, you like lounging close until touch happens naturally.'
      },
      탐: {
        love: 'When you like someone, you’d rather make it official than leave it vague.',
        work: 'When you have a goal, your ambition is clear. You grab good opportunities fast.',
        sex: 'Once you’re into someone, a little is never enough. You want to enjoy the touch, and the relationship, until you’re fully satisfied.'
      },
      식: {
        love: 'To you, a date is a pleasure in itself. Shared experiences like great food, drinks and travel matter a lot.',
        work: 'You go all in on work you enjoy. Without interest, though, your focus fades fast.',
        sex: 'You’re weak for the senses: scent, drink, music, the feel of skin. When the mood is right, you want it to last.'
      },
      색: {
        love: 'Butterflies and attraction matter most. When you like someone, it naturally shows in what you do.',
        work: 'You read people and rooms well. When something grabs you, your drive kicks in fast.',
        sex: 'Attraction turns into touch quickly for you. When you’re into someone, you’re fairly upfront about what you want.'
      },

      교질: {
        love: 'You want to be valued in love too. If your partner pays more attention to someone else, your competitive side wakes up.',
        work: 'You get stronger under competition. Feeling outpaced pushes your skills higher.',
        sex: 'You love feeling that your partner is completely into you. The more attention you confirm, the more you want to lead.'
      },
      교분: {
        love: 'You especially hate feeling ignored. When respect breaks down, you say so right away.',
        work: 'A hit to your pride actually sharpens your focus. Once you take something on, you don’t back down.',
        sex: 'You prefer high tension and intense immersion to soft and gentle. A battle for control can be part of the thrill.'
      },
      교나: {
        love: 'Even when you like someone, you won’t chase. You lean toward people who simply like you back.',
        work: 'You save energy but still want great results. You manage efficiency and quality at the same time.',
        sex: 'You start relaxed, but once the mood builds you naturally take the lead, and you enjoy them following.'
      },
      교탐: {
        love: 'You want to be the one they choose. Your standards in relationships are high.',
        work: 'You’re driven by achievement. When a good position or result is in sight, you make sure it’s yours.',
        sex: 'You want to see their reaction in full and feel deeply satisfied. You prefer certain over half-hearted.'
      },
      교식: {
        love: 'You love special dates in great places with great food. You want a relationship worth remembering, not an ordinary one.',
        work: 'You’re most effective when fun and recognition come together. The satisfaction of the process matters as much as the result.',
        sex: 'The whole mood matters: the setting, the scent, the drinks. Within it, you enjoy showing off your charm.'
      },
      교색: {
        love: 'You know your own charm. When you like someone, you naturally try to catch their attention.',
        work: 'You have a knack for drawing people in. You shine where you can be noticed or take the lead.',
        sex: 'You like setting the mood first and catching their eye. Knowing you’re getting to them is what satisfies you.'
      },
      질교: {
        love: 'You watch closely who your partner pays attention to, and you want to feel special too.',
        work: 'Constant comparison can stress you out, but it also drives you to high results.',
        sex: 'You need to know they’re drawn to you more than anyone else. Feeling like you’re winning the comparison turns you on.'
      },
      질분: {
        love: 'Jealousy shows on your face and in your voice. You don’t hold in hurt feelings for long.',
        work: 'When you can see a rival, your focus spikes. Hating to lose turns into action fast.',
        sex: 'Strong feelings like jealousy or hurt actually raise the heat, in touch and in the relationship.'
      },
      질나: {
        love: 'It bothers you, but competing or clinging feels exhausting. In the end, you pick the comfortable relationship.',
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
        love: 'The more you like someone, the more closely you watch their small moves. When someone else gets close, you notice.',
        work: 'You read the atmosphere between people well. You’re sharp where competition and relationships tangle.',
        sex: 'The more you like them, the more sensitive you are to their touch and reactions. Feeling that they’re focused only on you is a strong turn-on.'
      },
      분교: {
        love: 'If you don’t feel respected, you pull away or speak up at once. Pride is a key standard in your relationships.',
        work: 'You speak up in unfair or frustrating situations. Your sense of responsibility and your competitiveness rise together.',
        sex: 'In bed, you’d rather set the mood than be led. You enjoy the tension of pushing against each other.'
      },
      분질: {
        love: 'If someone you like shows interest in another, your feelings can shake fast, but you won’t hide them.',
        work: 'You’re at your strongest in competition. Feeling outpaced fuels your drive.',
        sex: 'Jealousy or rivalry quickly raises the tension. The stronger the feelings, the more forward you get with touch.'
      },
      분나: {
        love: 'You let most things go, but once a line is crossed, your attitude flips. Usually you’re pretty easygoing.',
        work: 'You save energy on tedious tasks but step up fast when there’s a problem. Strong when it counts.',
        sex: 'Usually laid-back, but once the switch flips the mood changes completely. Slow start, intense once you’re in it.'
      },
      분탐: {
        love: 'You hate it when a relationship you want gets disrupted. Once you like someone, you want to protect it.',
        work: 'You’re touchy when something gets in the way of your goals, but once you set one, you rarely give up.',
        sex: 'When you want something, you make it clear. In a relationship, you stay fully engaged until you’re satisfied.'
      },
      분식: {
        love: 'Even after a fight, you’d rather clear the air over food and fun than drag it out.',
        work: 'You blow off stress right away instead of letting it build. You bounce back fast.',
        sex: 'When drinks or the mood stir your feelings, you get physical quickly. You follow the desire and emotion of the moment.'
      },
      분색: {
        love: 'You feel both love and hurt intensely. Your relationships rarely run flat.',
        work: 'When something interests you, you move fast. Your passion runs high, so emotional situations hit you hard too.',
        sex: 'When you’re attracted, you react fast and hard. You burn hottest when emotion and desire rise together.'
      },
      나교: {
        love: 'You won’t cling, but you want to be respected. You like relationships that are comfortable but keep your pride intact.',
        work: 'You want great results with little effort. Efficiency matters a lot to you.',
        sex: 'You’d rather they come to you than make the effort yourself. Relaxed at first, but once the mood sets you quietly take the lead.'
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
        love: 'You want a good relationship, just not an exhausting one. You prefer comfortable and highly satisfying.',
        work: 'You’re good at finding ways to get big results with little effort. Your sense of efficiency is sharp.',
        sex: 'You want to enjoy it comfortably but still be fully satisfied: minimal effort, maximum pleasure.'
      },
      나식: {
        love: 'You’re drawn to people you can simply lie around, eat and rest with.',
        work: 'Work without joy wears you out. Give you a comfortable setup, though, and you do steady, good work.',
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
        sex: 'You want the reaction and satisfaction you’re after. You want to look irresistible while keeping control.'
      },
      탐질: {
        love: 'When their attention drifts elsewhere, you want even more of it for yourself.',
        work: 'When others do well, you aim higher. Competition motivates you a lot.',
        sex: 'You want plenty of their attention, and feeling more special than anyone else matters to you.'
      },
      탐분: {
        love: 'You don’t let go of a relationship you like easily. When you don’t get the response you want, it frustrates you.',
        work: 'You hate missing chances or being blocked. In front of a goal, you’re relentless.',
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
        sex: 'You love sharing the sensations, but you want their attention on you. If it scatters, so does your immersion.'
      },
      식분: {
        love: 'Even after a fight, you want to clear the air quickly by eating or having fun together.',
        work: 'You release stress right away. You recover fast, but in-the-moment emotions can sway you.',
        sex: 'When feelings rise, your body responds fast. You’re most immersed when the mood is intense and the senses are stirred.'
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
        sex: 'You’re especially weak to anything that stirs the five senses: touch, scent, music, drinks, mood. When the vibe is right, desire rises fast.'
      },
      색교: {
        love: 'You want to look irresistible to the person you like. Liking someone doesn’t make you lose confidence.',
        work: 'You can draw people in. You shine in roles that need presence, like presenting, sales or hospitality.',
        sex: 'You enjoy their gaze and reactions and set the mood first. Feeling that you’re pulling them in is what satisfies you.'
      },
      색질: {
        love: 'The more you like someone, the more closely you watch them. When someone else gets close, it quietly bothers you.',
        work: 'You read the atmosphere between people quickly. You move by instinct where competition and relationships mix.',
        sex: 'The more you like them, the more sensitive you get to their reactions, and the more you want them to yourself. You’re most immersed when they focus only on you.'
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
        love: 'You want clear attention from the person you like. Leaving things vague can frustrate you.',
        work: 'You combine a knack for drawing people in with a strong sense of purpose. When the result you want is in sight, you move fast.',
        sex: 'With someone you like, you want plenty of attention and touch. When you’re curious, you’re fairly open to new moods and new things.'
      },
      색식: {
        love: 'You love sharing good food, drinks and atmosphere with good people. The sensory side of a date matters to you.',
        work: 'You get energy from new people and experiences. In a fun setting, you’re great at lifting the mood.',
        sex: 'You’re very sensitive to atmosphere. When drink, scent, music and the feel of skin all line up, your desire and immersion soar.'
      }
    }
  }
};
