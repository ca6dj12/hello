/* =============================================================
   DEADLY SINS — 설문 문항 (v2, 2026-11-21 부터) · 한국어 ko / English en / 中文 zh
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
      q: { ko: '식당에서 나보다 늦게 온 옆 테이블 음식이 먼저 나왔다.', en: 'At a restaurant, the table seated after you gets their food first.', zh: '在餐厅，比你晚到的隔壁桌先上菜了。' },
      a: [
        { sin: '분', ko: '직원을 불러 바로 말한다. 할 말은 그 자리에서 해야 한다.', en: 'I flag down the server and say so. If something needs saying, I say it right then.', zh: '马上叫来店员说清楚。有话就得当场讲。' },
        { sin: '질', ko: '저 테이블이 뭘 시켰는지부터 본다. 내 것보다 맛있어 보인다.', en: 'First I look at what they ordered. It looks better than mine.', zh: '先看看那桌点了什么。看起来比我的好吃。' },
        { sin: '나', ko: '말하기도 귀찮다. 어차피 나올 테니 폰이나 본다.', en: 'Too much effort to complain. It’ll come eventually, so I go back to my phone.', zh: '懒得开口。反正迟早会上，继续玩手机。' },
        { sin: '탐', ko: '늦어진 만큼 서비스 하나는 받아야겠다. 손해는 안 본다.', en: 'If I’m kept waiting, I expect something on the house. I never come out behind.', zh: '既然让我等了，总得送点什么吧。我可不吃亏。' }
      ]
    },
    { // 2 · 친구 · SNS
      q: { ko: '친구가 인스타에 초호화 호캉스 사진을 올렸다.', en: 'A friend posts photos from a five-star hotel staycation on Instagram.', zh: '朋友在朋友圈晒了超豪华酒店度假的照片。' },
      a: [
        { sin: '질', ko: '어딘지 바로 검색한다. 다음엔 내가 더 좋은 방에 간다.', en: 'I look up the hotel right away. Next time, I’m booking a better room.', zh: '马上搜是哪家酒店。下次我要订更好的房间。' },
        { sin: '교', ko: '좋아요만 누른다. 나는 다녀와도 굳이 올리지 않는다.', en: 'I just tap like. When I stay somewhere like that, I don’t need to post about it.', zh: '只点个赞。这种地方我去了也不会特意发。' },
        { sin: '탐', ko: '1박에 얼마인지부터 찾아본다. 그 돈으로 뭘 할지 계산한다.', en: 'First I look up the nightly rate. Then I work out what else that money could buy.', zh: '先查一晚多少钱。再算算这笔钱还能干什么。' },
        { sin: '식', ko: '방은 됐고 조식 뷔페 사진을 확대한다. 룸서비스 메뉴가 궁금하다.', en: 'Forget the room. I zoom in on the breakfast buffet and wonder about the room-service menu.', zh: '房间无所谓，先放大早餐自助的照片。还好奇客房送餐的菜单。' }
      ]
    },
    { // 3 · 돈
      q: { ko: '공돈 100만 원이 생겼다. 단, 오늘 안에 다 써야 한다.', en: 'A million won lands in your lap. The catch: you have to spend it all today.', zh: '天上掉下100万韩元。条件是：今天之内必须花完。' },
      a: [
        { sin: '나', ko: '호텔을 잡고 하루 종일 누워 있는다. 아무것도 안 하는 게 사치다.', en: 'I book a hotel and lie in bed all day. Doing nothing is the real luxury.', zh: '订间酒店躺上一整天。什么都不做才是奢侈。' },
        { sin: '탐', ko: '쓰긴 쓴다. 나중에 되팔 수 있는 것만 골라 산다.', en: 'Fine, I’ll spend it. But only on things I can resell later.', zh: '花是会花。但只买以后能转手卖掉的东西。' },
        { sin: '식', ko: '예약 어려운 오마카세에 간다. 좋은 술도 병으로 시킨다.', en: 'I go to that impossible-to-book omakase. And I order a good bottle to go with it.', zh: '去那家很难订到的 Omakase。好酒也直接点一整瓶。' },
        { sin: '색', ko: '마음에 둔 사람을 불러낸다. 오늘은 제대로 된 데이트를 한다.', en: 'I call the one I’ve had my eye on. Tonight we’re going on a proper date.', zh: '把心里那个人约出来。今天要好好约一次会。' }
      ]
    },
    { // 4 · 일
      q: { ko: '회의에서 동료가 내 아이디어를 자기 것처럼 발표했다.', en: 'In a meeting, a coworker presents your idea as their own.', zh: '开会时，同事把我的点子当成自己的讲了出来。' },
      a: [
        { sin: '분', ko: '그 자리에서 바로 말한다. “그거 제가 낸 아이디어인데요.”', en: 'I speak up right there: “That was my idea, actually.”', zh: '当场就说：“这个点子是我提的。”' },
        { sin: '교', ko: '가만히 둔다. 누가 진짜인지는 다음 결과물로 보여준다.', en: 'I let it go. My next piece of work will show who the real talent is.', zh: '先不说破。谁有真本事，用下一份成果说话。' },
        { sin: '나', ko: '따지고 증명하는 게 더 피곤하다. 그냥 넘어간다.', en: 'Arguing and proving it sounds even more tiring. I let it slide.', zh: '去争论、去证明反而更累。算了，就这样吧。' },
        { sin: '식', ko: '퇴근하자마자 매운 안주에 술부터 시킨다. 먹어야 풀린다.', en: 'The minute I clock out, I order something spicy and a drink. Eating is how I get over things.', zh: '一下班就点辣味下酒菜配酒。吃了才能消气。' }
      ]
    },
    { // 5 · 연애 — v1 의 1번 문항 그대로 (실측 33 · 27 · 17 · 23% 로 가장 고르게 갈린 문항)
      q: { ko: '썸남·썸녀가 새벽 2시에 “우리 집 올래?”라고 한다.', en: 'It’s 2 a.m. and your crush texts: “Want to come over?”', zh: '暧昧对象凌晨两点发来：“要不要来我家？”' },
      a: [
        { sin: '색', ko: '끌리니까 고민은 잠깐, 일단 가본다.', en: 'I’m tempted. I think about it for a second, then I go.', zh: '心动了，纠结一下就算了，先去再说。' },
        { sin: '교', ko: '보고 싶으면 네가 와. 내가 새벽에 움직일 정도는 아니라고 생각한다.', en: '“If you miss me, you come here.” I’m not crossing town at 2 a.m. for this.', zh: '想见我就你过来。还不至于让我凌晨出门。' },
        { sin: '질', ko: '나한테만 이러는 건지, 다른 사람한테도 이러는 건지 계속 신경 쓰인다.', en: 'I can’t stop wondering. Is it just me, or do they text other people like this too?', zh: '一直在想：是只对我这样，还是对别人也这样？' },
        { sin: '나', ko: '끌리긴 하지만 나갈 생각만 해도 귀찮다. 그냥 자고 다음에 본다.', en: 'Tempting, but just thinking about going out is exhausting. I’ll sleep and see them another time.', zh: '心动是心动，可一想到要出门就嫌麻烦。先睡了，下次再见。' }
      ]
    },
    { // 6 · 친구 · 단톡방
      q: { ko: '친구들 단톡방에 누가 내 굴욕 사진을 올렸다.', en: 'Someone drops an embarrassing photo of you in the group chat.', zh: '有人把我的丑照发到了朋友群里。' },
      a: [
        { sin: '분', ko: '바로 답한다. “지금 내려.” 웃어넘기지 않는다.', en: 'I reply at once: “Take it down. Now.” I’m not laughing this one off.', zh: '立刻回：“马上撤回。”这事我可不会一笑了之。' },
        { sin: '교', ko: '대꾸하지 않는다. 제일 잘 나온 내 사진을 올려 덮어 버린다.', en: 'I don’t react. I post my best photo and bury it.', zh: '不回应。直接甩一张我最好看的照片盖过去。' },
        { sin: '탐', ko: '초상권 값은 받아야겠다. 올린 사람에게 밥을 사라고 한다.', en: 'My image rights aren’t free. Whoever posted it owes me dinner.', zh: '肖像权可不是免费的。让发照片的人请我吃饭。' },
        { sin: '색', ko: '다른 건 괜찮다. 그 사람이 봤을지가 제일 신경 쓰인다.', en: 'I don’t care who else saw it. I just keep wondering if that one person did.', zh: '别的都无所谓。我只在意那个人有没有看到。' }
      ]
    },
    { // 7 · 연애 · 술집
      q: { ko: '술집에서 전 애인을 마주쳤다. 옆에는 새 애인이 있다.', en: 'You run into your ex at a bar. They’re with someone new.', zh: '在酒吧撞见了前任。身边还带着新欢。' },
      a: [
        { sin: '질', ko: '옆에 앉은 사람부터 본다. 나보다 나은지가 궁금하다.', en: 'I look at the new one first. I need to know if they’re better than me.', zh: '先看坐在旁边的那位。想知道是不是比我强。' },
        { sin: '분', ko: '못다 한 말이 떠오른다. 눈이 마주치면 한마디는 해야겠다.', en: 'Everything I never got to say comes back. If our eyes meet, I’m saying something.', zh: '没说完的话全涌上来了。要是对上眼，非说一句不可。' },
        { sin: '식', ko: '오늘 술이 유난히 잘 들어간다. 한 병 더 시킨다.', en: 'The drinks are going down easy tonight. I order another bottle.', zh: '今晚的酒格外顺口。再来一瓶。' },
        { sin: '색', ko: '오랜만에 보니 여전히 내 스타일이다. 자꾸 눈이 간다.', en: 'It’s been a while, and they’re still my type. I can’t stop looking.', zh: '好久不见，还是我的菜。忍不住一直看。' }
      ]
    }
  ],

  /* 예비 문항 — 시험 운영에서 탈락한 문항을 바꿔 끼울 때 (replaces: 몇 번 문항 자리인지).
     같은 번호 문항과 죄 구성이 같아서, questions 의 그 자리에 통째로 옮기면 균형 배치가 유지된다. */
  spares: [
    { replaces: 4,
      q: { ko: '소개팅 상대가 30분 늦게 왔다. 그런데 완전히 내 스타일이다.', en: 'Your blind date shows up 30 minutes late. And they’re exactly your type.', zh: '相亲对象迟到了30分钟。可偏偏完全是我的菜。' },
      a: [
        { sin: '분', ko: '늦은 건 짚고 넘어간다. 좋은 건 좋은 거고, 늦은 건 늦은 거다.', en: 'I bring up the lateness. Attractive is attractive, and late is late.', zh: '迟到这事得说清楚。喜欢归喜欢，迟到归迟到。' },
        { sin: '교', ko: '기다린 티를 내지 않는다. 나도 방금 온 것처럼 여유 있게 웃는다.', en: 'I don’t let it show that I waited. I smile like I just got here myself.', zh: '不露出等过的样子。像自己也刚到一样从容地笑。' },
        { sin: '나', ko: '오히려 좋았다. 기다리는 동안 편하게 쉬었다.', en: 'Honestly, it was nice. I got to relax while I waited.', zh: '反倒挺好。等的时候舒舒服服歇了一会儿。' },
        { sin: '식', ko: '이미 한 잔 시켜서 마시고 있었다. 안주도 골라 놨다.', en: 'I’ve already got a drink in hand. I’ve picked out the food, too.', zh: '我已经点了一杯喝上了。下酒菜也挑好了。' }
      ]
    },
    { replaces: 6,
      q: { ko: '모임에서 마지막 고기 한 점이 남았다. 다들 눈치만 본다.', en: 'One last piece of meat is left on the grill. Everyone’s pretending not to look.', zh: '聚餐时只剩最后一块肉。大家都在互相观望。' },
      a: [
        { sin: '탐', ko: '먼저 집는 사람이 임자다. 내 접시로 가져온다.', en: 'Finders keepers. It goes on my plate.', zh: '谁先夹到算谁的。直接夹进我的盘子。' },
        { sin: '교', ko: '체면이 있다. 먹고 싶어도 젓가락은 가지 않는다.', en: 'I have my dignity. Even if I want it, my chopsticks stay put.', zh: '面子要紧。再想吃，筷子也不会伸过去。' },
        { sin: '분', ko: '눈치 싸움이 답답하다. “먹을 사람?” 하고 내가 정리한다.', en: 'I can’t stand the standoff. “Who’s eating this?” I settle it myself.', zh: '这种僵持最烦人。我直接问一句“谁吃？”了事。' },
        { sin: '색', ko: '마음에 드는 그 사람 접시에 올려 준다.', en: 'I put it on the plate of the person I like.', zh: '夹到我有好感的那个人盘子里。' }
      ]
    },
    { replaces: 7,
      q: { ko: '썸 타는 사람이 다른 이성과 즐겁게 이야기하고 있다.', en: 'The person you’re seeing is having a great time talking to someone else.', zh: '暧昧对象正和别的异性聊得很开心。' },
      a: [
        { sin: '질', ko: '누군지, 나보다 나은지 계속 살핀다.', en: 'I keep checking who it is, and whether they’re better than me.', zh: '一直打量那是谁，是不是比我强。' },
        { sin: '분', ko: '돌려 말하지 않는다. 가서 바로 묻는다. “누구야?”', en: 'I don’t hint. I walk over and ask: “Who’s this?”', zh: '不绕弯子。走过去直接问：“这位是谁？”' },
        { sin: '식', ko: '신경 끄고 안주와 술에 집중한다. 잔이 빨리 빈다.', en: 'I tune it out and focus on the food and drink. My glass empties fast.', zh: '不去管，专心对付下酒菜和酒。杯子空得特别快。' },
        { sin: '색', ko: '오히려 불이 붙는다. 내가 더 적극적으로 다가간다.', en: 'It only fires me up. I make my move.', zh: '反而被点燃了。我要更主动地靠过去。' }
      ]
    },
    { replaces: 2,
      q: { ko: '바텐더가 “오늘은 한 잔 서비스로 드릴게요”라고 한다.', en: 'The bartender says, “This one’s on the house tonight.”', zh: '调酒师说：“今天送您一杯。”' },
      a: [
        { sin: '탐', ko: '메뉴판에서 제일 비싼 것을 고른다.', en: 'I pick the most expensive thing on the menu.', zh: '从菜单里挑最贵的那一款。' },
        { sin: '교', ko: '늘 마시던 걸로 한다. 내 취향은 내가 제일 잘 안다.', en: 'I have my usual. Nobody knows my taste better than I do.', zh: '还是点常喝的那款。我的口味我最清楚。' },
        { sin: '질', ko: '옆 사람이 마시는 저걸로 달라고 한다.', en: 'I ask for whatever the person next to me is having.', zh: '就要旁边那位正在喝的那杯。' },
        { sin: '식', ko: '한 잔으로는 아쉽다. 어울리는 안주도 같이 물어본다.', en: 'One glass won’t do. I ask what food goes with it, too.', zh: '一杯不过瘾。顺便问问配什么下酒菜。' }
      ]
    }
  ]
};
