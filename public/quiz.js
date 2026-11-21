/* =============================================================
   DEADLY SINS — 설문 문항 (v2, 2026-11-21 부터)
   문구를 고치거나 문항을 바꿀 때는 이 파일만 고치면 됩니다 (빌드 불필요).

   설계 (근거: 2026-10-20 ~ 11-20 완료 109건 분석, README "설문 v2")
     · 선택지 하나 = 죄 하나 = 1점. 점수가 가장 높은 죄가 결과.
     · 균형 배치: 일곱 죄가 각각 정확히 4문항에 나오고, 어떤 두 죄든 정확히 2문항에서 맞붙는다.
       → 문항을 바꿀 때는 그 문항의 네 죄(sin) 구성을 그대로 지킬 것.
          어기면 tools/simulate.js (CI) 가 실패한다.
     · 동점이면 최근 손님 100명 중 가장 적게 나온 죄가 이긴다 (api/track.js ?order=1).
     · 선택지 순서는 손님마다 섞여서 나온다 — 여기 적힌 순서는 화면 순서가 아니다.

   sin: 교(교만) 질(질투) 분(분노) 나(나태) 탐(탐욕) 식(탐식 · 폭식의 술) 색(색욕)

   문구를 고쳐 쓸 때
     1. 고른 사람이 옆 친구에게 웃으며 말할 수 있는 답인가 (못돼 보이면 아무도 안 고른다)
     2. 감정("짜증 난다") 대신 행동("바로 말한다")으로
     3. 네 답의 길이와 말투를 비슷하게 (두 문장, 한 줄 반 이내)
     4. 누구나 고를 답(큰돈 · 공짜 · 휴식)은 넣지 않거나 조건으로 막기
     5. 그 죄로만 읽히게
     6. 한 번에 한 선택지만 바꾸기 — 무엇이 효과였는지 알 수 있게
   version 은 문항 "구성"이 바뀔 때만 올린다 (통계가 버전별로 따로 쌓인다). 문구만 다듬을 때는 그대로.
   ============================================================= */
window.DS_QUIZ = {
  version: 'v2',
  questions: [
    { // 1 · 일상 · 식당
      q: { ko: '식당에서 나보다 늦게 온 옆 테이블 음식이 먼저 나왔다.', en: 'At a restaurant, the table that came in after you gets its food first.' },
      a: [
        { sin: '분', ko: '직원을 불러 바로 말한다. 할 말은 그 자리에서 해야 한다.', en: 'I call the server over and say so. If something needs saying, I say it on the spot.' },
        { sin: '질', ko: '저 테이블이 뭘 시켰는지부터 본다. 내 것보다 맛있어 보인다.', en: 'First I check what they ordered. It looks better than mine.' },
        { sin: '나', ko: '말하기도 귀찮다. 어차피 나올 테니 폰이나 본다.', en: 'Can’t be bothered to say anything. It’ll come eventually, so I go back to my phone.' },
        { sin: '탐', ko: '늦어진 만큼 서비스 하나는 받아야겠다. 손해는 안 본다.', en: 'If it’s late, I should get something on the house. I don’t lose out.' }
      ]
    },
    { // 2 · 친구 · SNS
      q: { ko: '친구가 인스타에 초호화 호캉스 사진을 올렸다.', en: 'A friend posts photos of a luxury hotel staycation on Instagram.' },
      a: [
        { sin: '질', ko: '어딘지 바로 검색한다. 다음엔 내가 더 좋은 방에 간다.', en: 'I look up where it is right away. Next time, I’m booking a better room.' },
        { sin: '교', ko: '좋아요만 누른다. 나는 다녀와도 굳이 올리지 않는다.', en: 'I just hit like. When I go to places like that, I don’t feel the need to post.' },
        { sin: '탐', ko: '1박에 얼마인지부터 찾아본다. 그 돈으로 뭘 할지 계산한다.', en: 'I check the price per night first, then work out what else that money could do.' },
        { sin: '식', ko: '방은 됐고 조식 뷔페 사진을 확대한다. 룸서비스 메뉴가 궁금하다.', en: 'Never mind the room. I zoom in on the breakfast buffet and wonder about room service.' }
      ]
    },
    { // 3 · 돈
      q: { ko: '공돈 100만 원이 생겼다. 단, 오늘 안에 다 써야 한다.', en: 'You’re handed a million won out of nowhere. The catch: spend it all today.' },
      a: [
        { sin: '나', ko: '호텔을 잡고 하루 종일 누워 있는다. 아무것도 안 하는 게 사치다.', en: 'I book a hotel and lie in bed all day. Doing nothing is the real luxury.' },
        { sin: '탐', ko: '쓰긴 쓴다. 나중에 되팔 수 있는 것만 골라 산다.', en: 'I’ll spend it, sure. Only on things I can resell later.' },
        { sin: '식', ko: '예약 어려운 오마카세에 간다. 좋은 술도 병으로 시킨다.', en: 'I go to that hard-to-book omakase and order a good bottle to go with it.' },
        { sin: '색', ko: '마음에 둔 사람을 불러낸다. 오늘은 제대로 된 데이트를 한다.', en: 'I call the person I’ve had my eye on. Tonight we’re having a proper date.' }
      ]
    },
    { // 4 · 일
      q: { ko: '회의에서 동료가 내 아이디어를 자기 것처럼 발표했다.', en: 'In a meeting, a coworker presents your idea as their own.' },
      a: [
        { sin: '분', ko: '그 자리에서 바로 말한다. “그거 제가 낸 아이디어인데요.”', en: 'I say it right there: “That was my idea, actually.”' },
        { sin: '교', ko: '가만히 둔다. 누가 진짜인지는 다음 결과물로 보여준다.', en: 'I let it go. My next piece of work will show who the real one is.' },
        { sin: '나', ko: '따지고 증명하는 게 더 피곤하다. 그냥 넘어간다.', en: 'Arguing and proving it would be more tiring. I let it slide.' },
        { sin: '식', ko: '퇴근하자마자 매운 안주에 술부터 시킨다. 먹어야 풀린다.', en: 'The minute work ends I order something spicy and a drink. Eating is how I get over it.' }
      ]
    },
    { // 5 · 연애 — v1 의 1번 문항 그대로 (실측 33 · 27 · 17 · 23% 로 가장 고르게 갈린 문항)
      q: { ko: '썸남·썸녀가 새벽 2시에 “우리 집 올래?”라고 한다.', en: 'It’s 2 a.m. and your crush texts: “Want to come over?”' },
      a: [
        { sin: '색', ko: '끌리니까 고민은 잠깐, 일단 가본다.', en: 'I’m drawn in. I think about it for a second, then I go.' },
        { sin: '교', ko: '보고 싶으면 네가 와. 내가 새벽에 움직일 정도는 아니라고 생각한다.', en: 'If you miss me, you come here. I’m not moving at 2 a.m. for this.' },
        { sin: '질', ko: '나한테만 이러는 건지, 다른 사람한테도 이러는 건지 계속 신경 쓰인다.', en: 'I keep wondering: is it just me, or do they text other people like this too?' },
        { sin: '나', ko: '끌리긴 하지만 나갈 생각만 해도 귀찮다. 그냥 자고 다음에 본다.', en: 'Tempting, but even the thought of heading out is exhausting. I’ll sleep and see them another time.' }
      ]
    },
    { // 6 · 친구 · 단톡방
      q: { ko: '친구들 단톡방에 누가 내 굴욕 사진을 올렸다.', en: 'Someone drops an embarrassing photo of you in the group chat.' },
      a: [
        { sin: '분', ko: '바로 답한다. “지금 내려.” 웃어넘기지 않는다.', en: 'I reply at once: “Take it down. Now.” I’m not laughing this one off.' },
        { sin: '교', ko: '대꾸하지 않는다. 제일 잘 나온 내 사진을 올려 덮어 버린다.', en: 'I don’t respond. I post my best photo and bury it.' },
        { sin: '탐', ko: '초상권 값은 받아야겠다. 올린 사람에게 밥을 사라고 한다.', en: 'My image has a price. Whoever posted it owes me dinner.' },
        { sin: '색', ko: '다른 건 괜찮다. 그 사람이 봤을지가 제일 신경 쓰인다.', en: 'I don’t mind the rest. I just keep wondering whether that one person saw it.' }
      ]
    },
    { // 7 · 연애 · 술집
      q: { ko: '술집에서 전 애인을 마주쳤다. 옆에는 새 애인이 있다.', en: 'You run into your ex at a bar. They’re with someone new.' },
      a: [
        { sin: '질', ko: '옆에 앉은 사람부터 본다. 나보다 나은지가 궁금하다.', en: 'I look at the new one first. I need to know if they’re better than me.' },
        { sin: '분', ko: '못다 한 말이 떠오른다. 눈이 마주치면 한마디는 해야겠다.', en: 'Everything I never got to say comes back. If our eyes meet, I’m saying something.' },
        { sin: '식', ko: '오늘 술이 유난히 잘 들어간다. 한 병 더 시킨다.', en: 'The drinks are going down easy tonight. I order another bottle.' },
        { sin: '색', ko: '오랜만에 보니 여전히 내 스타일이다. 자꾸 눈이 간다.', en: 'Seeing them again, they’re still my type. I can’t stop looking.' }
      ]
    }
  ],

  /* 예비 문항 — 시험 운영에서 탈락한 문항을 바꿔 끼울 때 (replaces: 몇 번 문항 자리인지).
     같은 번호 문항과 죄 구성이 같아서, questions 의 그 자리에 통째로 옮기면 균형 배치가 유지된다. */
  spares: [
    { replaces: 4,
      q: { ko: '소개팅 상대가 30분 늦게 왔다. 그런데 완전히 내 스타일이다.', en: 'Your blind date shows up 30 minutes late. And they’re exactly your type.' },
      a: [
        { sin: '분', ko: '늦은 건 짚고 넘어간다. 좋은 건 좋은 거고, 늦은 건 늦은 거다.', en: 'I bring up the lateness. Attractive is attractive, and late is late.' },
        { sin: '교', ko: '기다린 티를 내지 않는다. 나도 방금 온 것처럼 여유 있게 웃는다.', en: 'I don’t show that I waited. I smile as if I just got here too.' },
        { sin: '나', ko: '오히려 좋았다. 기다리는 동안 편하게 쉬었다.', en: 'Honestly, it was nice. I got to relax while I waited.' },
        { sin: '식', ko: '이미 한 잔 시켜서 마시고 있었다. 안주도 골라 놨다.', en: 'I’d already ordered a drink. I’ve picked the food too.' }
      ]
    },
    { replaces: 6,
      q: { ko: '모임에서 마지막 고기 한 점이 남았다. 다들 눈치만 본다.', en: 'One last piece of meat is left on the grill. Everyone’s pretending not to look.' },
      a: [
        { sin: '탐', ko: '먼저 집는 사람이 임자다. 내 접시로 가져온다.', en: 'Whoever grabs it first owns it. It goes on my plate.' },
        { sin: '교', ko: '체면이 있다. 먹고 싶어도 젓가락은 가지 않는다.', en: 'I have my dignity. Even if I want it, my chopsticks stay put.' },
        { sin: '분', ko: '눈치 싸움이 답답하다. “먹을 사람?” 하고 내가 정리한다.', en: 'The standoff annoys me. “Who’s eating this?” I settle it myself.' },
        { sin: '색', ko: '마음에 드는 그 사람 접시에 올려 준다.', en: 'I put it on the plate of the one I like.' }
      ]
    },
    { replaces: 7,
      q: { ko: '썸 타는 사람이 다른 이성과 즐겁게 이야기하고 있다.', en: 'The person you’re seeing is having a great time talking to someone else.' },
      a: [
        { sin: '질', ko: '누군지, 나보다 나은지 계속 살핀다.', en: 'I keep checking who it is, and whether they’re better than me.' },
        { sin: '분', ko: '돌려 말하지 않는다. 가서 바로 묻는다. “누구야?”', en: 'I don’t hint. I walk over and ask: “Who’s this?”' },
        { sin: '식', ko: '신경 끄고 안주와 술에 집중한다. 잔이 빨리 빈다.', en: 'I tune it out and focus on the food and drink. My glass empties fast.' },
        { sin: '색', ko: '오히려 불이 붙는다. 내가 더 적극적으로 다가간다.', en: 'It only fires me up. I make my move.' }
      ]
    },
    { replaces: 2,
      q: { ko: '바텐더가 “오늘은 한 잔 서비스로 드릴게요”라고 한다.', en: 'The bartender says, “This one’s on the house tonight.”' },
      a: [
        { sin: '탐', ko: '메뉴판에서 제일 비싼 것을 고른다.', en: 'I pick the most expensive thing on the menu.' },
        { sin: '교', ko: '늘 마시던 걸로 한다. 내 취향은 내가 제일 잘 안다.', en: 'I have my usual. Nobody knows my taste better than I do.' },
        { sin: '질', ko: '옆 사람이 마시는 저걸로 달라고 한다.', en: 'I ask for whatever the person next to me is having.' },
        { sin: '식', ko: '한 잔으로는 아쉽다. 어울리는 안주도 같이 물어본다.', en: 'One glass isn’t enough. I ask what food goes with it too.' }
      ]
    }
  ]
};
