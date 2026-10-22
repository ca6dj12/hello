# DEADLY SINS — 당신의 욕망을 채워주세요

바 테이블의 QR을 찍으면 열리는 한 장짜리 사이트입니다.
일곱 개의 질문 → 일곱 개의 죄 중 하나 → 당신의 시그니처 술 → 바텐더에게 주문.

## 구조

디자이너가 만든 원본 HTML(`source/`)은 **손대지 않고**, 빌드할 때 그 위에
개선 레이어를 끼워 넣어 `public/` 을 만듭니다. 새 디자인을 받으면 원본만
갈아 끼우고 빌드를 다시 돌리면 됩니다.

```
source/deadly_sins.html   디자이너 원본 (7문항 · 폰트 수정판). 고치지 않음
public/                   실제로 배포되는 사이트 (빌드 결과, 커밋되어 있음)
  index.html              원본 + 메타 태그 + 개선 레이어 연결 (이미지는 img/ 로 분리)
  img/                    원본에 박혀 있던 그림 16장 (무손실 WebP)
  data.js                 ★ 가격 · 메뉴 · 맛 정보 · 수집 설정 — 가격이 바뀌면 여기만
  i18n.js                 영어 문구 (질문 7개, 성향 49개, 화면 문구)
  enhance.js / .css       개선 레이어
  og.jpg / favicon.svg    링크 미리보기 · 탭 아이콘
print/                    QR · 테이블 카드 (인쇄용, 사이트에는 안 올라감)
api/track.js              결과 기록 API → Neon(Postgres). 사이트에서 유일한 서버 코드
package.json              위 API 의 의존성(Neon 드라이버)만
tools/
  build.py                source → public
  simulate.js             결과 쏠림 검증 (실패하면 종료 코드 1)
  e2e.js                  실제 브라우저로 끝까지 눌러 보는 점검
  test-api.js             api/track.js 를 진짜 Postgres(PGlite) 위에서 점검
  make-qr.js              QR · 테이블 카드 · 링크 미리보기 이미지 생성
.github/workflows/check.yml   푸시마다 위 세 가지 자동 실행
```

```bash
pip install pillow
python3 tools/build.py              # source → public
cd tools && npm install && cd ..
node tools/simulate.js              # 결과 쏠림
node tools/e2e.js                   # 브라우저 점검 (크롬 필요, CHROME_PATH 로 지정 가능)
npm install && node tools/test-api.js   # 결과 기록 API
python3 -m http.server 8080 --directory public   # http://localhost:8080
```

## 자주 하는 수정

| 하고 싶은 것 | 고칠 곳 | 빌드 필요 |
|---|---|---|
| 시그니처 가격 | `public/data.js` 의 `signaturePrice` | 아니오 |
| 위스키 · 안주 · 음료 메뉴와 가격 | `public/data.js` 의 `menu` | 아니오 |
| 잔마다 향 · 맛 · 피니시 · 강도 · 한 줄 소개 | `public/data.js` 의 `drinks` | 아니오 |
| 위스키 · 칵테일 상세 설명 (메뉴판에서 누르면 나오는 것) | `public/data.js` 의 `details` (키 = 메뉴 `id`) | 아니오 |
| 메뉴 사진 | `photos/src/<id>.jpg` + `photos/credits.json` → `python3 tools/menu-photos.py` | 아니오 (사진 처리만) |
| 영어 문구 | `public/i18n.js` | 아니오 |
| 질문 · 보기 · 배점 · 그림 · 디자인 | 디자이너가 원본을 새로 주면 `source/` 교체 | **예** → `python3 tools/build.py` |

질문이나 배점이 바뀌었으면 **반드시** `node tools/simulate.js` 를 돌려 보세요.

> `data.js` 의 메뉴 가격은 2026-09-18 메뉴판 사진 기준입니다. 시그니처는 16,000원(2026-10-17 확인).
> 일곱 잔의 한 줄 소개는 나무 메뉴판 문구 그대로입니다(2026-10-20 사장님 확인 반영).
> 확실하지 않은 문구는 `confirmed: false` 로 두면 화면에 나가지 않습니다.

## 메뉴판

표지 오른쪽 위 MENU, 또는 결과 화면의 "전체 메뉴" 로 열립니다. 이름을 누르면 상세(사진 · 종류 · 산지 · 도수 ·
캐스크 · 향/맛/피니시 · 글라스/보틀 가격)가 열리고, 폰 뒤로가기로 하나씩 닫힙니다.

- **메뉴판만 바로 여는 주소**: https://deadly-sins-mu.vercel.app/#menu
  특정 항목까지: `#menu/lagavulin-16` (id 는 `public/data.js` 참고). 바 테이블에 메뉴판 전용 QR 을 따로 두고 싶을 때.
- 설명은 일반 공개 정보 기준입니다. 아벨라워 아부나흐 · 옥토모어처럼 배치마다 도수가 다른 병은 도수 대신 안내 문구를 띄웁니다.
  매장 병과 다르면 `details` 에서 고치세요.
- 안주(블루베리 페퍼 크래커 · 체리 요거트 크림)는 가게 고유 메뉴라 설명을 비워 뒀습니다. `details` 에 같은 모양으로 넣으면 눌러집니다.
- 사진은 `photos/README.md` 참고. 배경을 지우고 같은 틀에 맞춰 넣으므로, 어떤 배경에서 찍은 사진이든 똑같은 무대 위에 선 것처럼 나옵니다.

## 결과 쏠림 — 측정값 (2026-10-17, 7문항 원본)

`node tools/simulate.js`, 6만 명씩. **완전 균등은 14.3%.**

원본 배점은 이미 고르게 짜여 있습니다(일곱 죄 모두 총 18점, 3점짜리 주 선택지 4개씩).
쏠림은 전부 **채점 방식**에서 나왔습니다.

| 응답자 모델 | 원본 채점 (최소 ~ 최다) | 개선 후 |
|---|---|---|
| 아무거나 고름 | 10.5 ~ 18.2% | 13.3 ~ 15.2% |
| 위쪽 보기를 선호 | 5.7 ~ 20.6% ✗ | 13.4 ~ 15.6% |
| 아래쪽 보기를 선호 | 4.3 ~ 25.4% ✗ | 13.2 ~ 15.2% |
| 늘 같은 자리(A 또는 D)만 | 한 죄 100% | 13.2 ~ 15.4% |

응답의 약 20%가 1위 동점으로 끝납니다. 시뮬레이션은 돌릴 때마다 ±0.3%p 정도 흔들립니다.

고친 것 (문구 · 배점은 그대로):

1. **동점 처리** — 원본은 동점이면 `SINS` 배열 앞쪽(교만→질투→…)이 이겼습니다.
   이제 점수 → 3점짜리로 받은 횟수 → 2점짜리 횟수 → 세션마다 섞은 순서.
2. **보기 순서 섞기** — 매 세션 Fisher–Yates 로 섞습니다.
   (`sort(() => Math.random() - .5)` 는 편향이 있어서 쓰지 않음)
3. **결과 제목 = 시그니처 술** — 원본은 동점이면 제목에 "교만 · 질투" 처럼 여러 개가 나오고
   술은 그중 하나만 나왔습니다. 이제 둘이 늘 같은 죄입니다.

## 개선 레이어가 하는 일

- 보기 섞기 · 동점 처리 (위)
- 폰 뒤로가기 = 앱 안의 ← (질문 한 칸씩, 결과 → 7번 문항, 메뉴/주문 화면 닫기)
- 시그니처 화면 아래: 잔의 맛 · 향 · 피니시 · 강도 · **가격**, 같은 죄의 위스키,
  **바텐더에게 보여주기**(크게, 화면 꺼짐 방지), 결과 이미지 저장(인스타 스토리 1080×1920),
  전체 메뉴(내 죄 표시), 처음부터 다시
- 이름이 떠오를 때 뒤에 비치던 "당신의 욕망을 채워주세요" 제목 숨김, 내용이 길면 스크롤
- 한국어 ⇄ English (표지 오른쪽 위, 폰 언어로 자동 시작)
- 결과 · 오류 익명 기록 → Neon (아래, DB 를 연결하기 전까지는 서버가 그냥 버림)
- 원본 버그 수정: 없는 `#restart` 요소에 이벤트를 걸다 스크립트가 멈추던 것
- 용량: 원본 555KB 한 파일 → 첫 화면 약 240KB (그림 분리 · 무손실 WebP · 캐시)

## 결과 기록 (Neon, 무료 요금제)

손님 브라우저 → 같은 사이트의 `/api/track` (`api/track.js`) → Neon Postgres.
브라우저는 DB 주소도 키도 모르고, 이 함수만 DB 에 씁니다. 테이블은 처음 기록이 올 때 스스로 만듭니다.

### 연결 (한 번만, 대시보드에서)

1. Vercel → `deadly-sins` 프로젝트 → **Storage** → **Create Database** → **Neon** → 무료(Free) 요금제
2. 지역은 **US East (N. Virginia, aws-us-east-1)** — 기록 함수가 Vercel 의 미국 동부(iad1)에서 돌아서
   DB 도 같은 곳이 가장 빠릅니다. 손님 화면은 기록을 기다리지 않으니 한국에서 써도 느려지지 않습니다. 이름은 아무거나
3. **Connect to project** 에서 `deadly-sins`, 환경은 Production(과 Preview) 선택 → `DATABASE_URL` 이 자동으로 들어감
4. 환경 변수는 **다음 배포부터** 적용되므로 Deployments → 최신 배포 → **Redeploy** 한 번
5. https://deadly-sins-mu.vercel.app/api/track 을 열어 `{"db":true,...}` 가 나오면 끝

`{"db":false}` 면 아직 DATABASE_URL 이 안 들어간 것(4번 재배포를 안 했거나 연결 환경이 Production 이 아님).

### 무엇이 쌓이나 (`deadly_sins_events` 테이블)

| 칸 | 내용 |
|---|---|
| created_at | 시간 (UTC. 한국 시간은 `created_at at time zone 'Asia/Seoul'`) |
| sid | 퀴즈를 시작할 때마다 새로 만드는 임의 값 (사람을 특정하지 못함) |
| type | start · result · signature · order(바텐더 화면) · menu · share(이미지 저장) · restart · lang · error |
| sin / second / tie | 1위 · 2위 죄(한국어), 동점 여부 — result 일 때 |
| points / picks | 점수, 고른 보기 (`Q1B` = 1번 문항의 디자이너 원본 B 보기) |
| extra | 그 밖의 값 (오류 메시지 등) |

- result 는 세션마다 한 줄입니다. 손님이 뒤로 가서 답을 바꾸면 마지막 결과로 덮어씁니다.
- 개인 정보(이름 · 전화번호 · IP)는 저장하지 않습니다. 오류일 때만 브라우저 종류를 같이 저장합니다.
- `/api/track` 은 누구나 보낼 수 있는 주소라 종류 · 길이 · 죄 이름을 함수에서 검사합니다.
- 끄려면 `public/data.js` 의 `collect.enabled` 를 `false` 로.
- Neon 무료 요금제의 한도(저장 용량 · 계산 시간)는 바뀔 수 있습니다. 바 한 곳 기록은 한 줄이 수백 바이트라
  넉넉할 것으로 보지만, 정확한 한도는 Neon 요금 페이지를 확인하세요.

### 보는 법 ① — 통계 주소 (Vercel 로그인 필요)

Vercel → `deadly-sins` → Deployments → 맨 위(Production) 배포의 고유 주소
(`deadly-sins-xxxxxxxx-ca6dj12s-projects.vercel.app`) 뒤에 `/api/track?stats=1` 을 붙여 엽니다.
죄별 분포 · 날짜별 시작/완주/바텐더 화면 · 보기별 선택 수 · 최근 기록 40건 · 최근 오류가 JSON 으로 나옵니다.

- 이 주소는 Deployment Protection(로그인) 뒤에 있어서 팀원만 열립니다.
  손님이 쓰는 `deadly-sins-mu.vercel.app/api/track?stats=1` 은 404 입니다.
- Deployment Protection 을 끄면 고유 주소도 공개되므로 통계도 공개됩니다(주소를 아는 사람에 한해).

### 보는 법 ② — Neon 콘솔 → SQL Editor 에 붙여 넣기

```sql
-- 최근 30일 결과 분포 (완전히 고르면 죄마다 약 14%)
select sin, count(*) as 명, round(100.0 * count(*) / sum(count(*)) over (), 1) as 비율
from deadly_sins_events
where type = 'result' and created_at > now() - interval '30 days'
group by sin order by 명 desc;

-- 손님 흐름: 시작 → 완주 → 시그니처 → 바텐더 화면 → 이미지 저장
select
  count(distinct sid) filter (where type = 'start')     as 시작,
  count(distinct sid) filter (where type = 'result')    as 완주,
  count(distinct sid) filter (where type = 'signature') as 시그니처,
  count(distinct sid) filter (where type = 'order')     as 바텐더_화면,
  count(distinct sid) filter (where type = 'share')     as 이미지_저장
from deadly_sins_events
where created_at > now() - interval '30 days';

-- 날짜별 완주 수 (한국 시간)
select (created_at at time zone 'Asia/Seoul')::date as 날짜, count(*) as 완주
from deadly_sins_events where type = 'result'
group by 1 order by 1 desc limit 30;

-- 최근 오류
select created_at, extra->>'message' as 메시지, extra->>'ua' as 브라우저
from deadly_sins_events where type = 'error'
order by created_at desc limit 30;
```

## 테이블 QR 카드

```bash
cd tools && npm install
node make-qr.js https://<배포주소>
```

`print/` 의 QR(SVG/PNG) · A6 카드(PDF/PNG)와 `public/og.jpg` 를 다시 만들고,
카드 PNG 에서 QR 을 실제로 해독해 주소가 맞는지 확인합니다.
카드는 사이트 첫 화면 그림을 그대로 써서, 찍으면 같은 그림이 열립니다.

## 배포

**https://deadly-sins-mu.vercel.app** — Vercel 프로젝트 `deadly-sins` (2026-10-19 생성)

- 이 브랜치(`claude/deadly-sins-cocktail-qr-9ljntg`, 저장소 기본 브랜치)에 **푸시하면 자동으로 이 주소에 배포**됩니다.
  가격(`public/data.js`)을 고치고 푸시하면 몇 초 뒤 반영되고, **주소와 QR 은 그대로**입니다.
- 사이트 빌드 단계는 없습니다. 저장소의 `vercel.json` 이 커밋된 `public/` 을 그대로 내보내고,
  `api/track.js` 만 Vercel 함수로 올라갑니다(의존성은 루트 `package.json`).
  그래서 `source/` 를 바꿨다면 `python3 tools/build.py` 를 돌린 결과까지 커밋해야 합니다
  (안 돌리면 GitHub 자동 점검이 실패로 알려 줍니다).
- `deadly-sins.vercel.app` 은 이미 다른 사람이 써서 Vercel 이 `-mu` 를 붙였습니다.
  가게 도메인을 사면 프로젝트 → Settings → Domains 에서 붙일 수 있고, 그때는 QR 을 다시 만드세요.
- 새 프로젝트 기본값인 Deployment Protection(Standard) 이 켜져 있습니다.
  배포마다 생기는 긴 주소(`deadly-sins-xxxx-ca6dj12s-projects.vercel.app`)는 로그인해야 열리고,
  QR 에 들어간 `deadly-sins-mu.vercel.app` 은 로그인 없이 열려야 정상입니다.
  Vercel 에 로그인하지 않은 폰이나 시크릿 창에서 한 번 열어 확인하세요.

### 예전 주소

`sounds` 프로젝트 안에 남아 있는 프리뷰 배포(`sounds-8kvdl1zbk…` 등)는 이제 쓰지 않습니다.
지워도 yantai 에는 영향이 없지만, 그 주소의 QR 을 이미 붙여 둔 곳이 있다면 교체한 뒤에 지우세요.
`sounds-zeta.vercel.app` 은 yantai 입니다.
