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
supabase/                 결과 · 오류 수집용 테이블 SQL
tools/
  build.py                source → public
  simulate.js             결과 쏠림 검증 (실패하면 종료 코드 1)
  e2e.js                  실제 브라우저로 끝까지 눌러 보는 점검
  make-qr.js              QR · 테이블 카드 · 링크 미리보기 이미지 생성
.github/workflows/check.yml   푸시마다 위 세 가지 자동 실행
```

```bash
pip install pillow
python3 tools/build.py              # source → public
cd tools && npm install && cd ..
node tools/simulate.js              # 결과 쏠림
node tools/e2e.js                   # 브라우저 점검 (크롬 필요, CHROME_PATH 로 지정 가능)
python3 -m http.server 8080 --directory public   # http://localhost:8080
```

## 자주 하는 수정

| 하고 싶은 것 | 고칠 곳 | 빌드 필요 |
|---|---|---|
| 시그니처 가격 | `public/data.js` 의 `signaturePrice` | 아니오 |
| 위스키 · 안주 · 음료 메뉴와 가격 | `public/data.js` 의 `menu` | 아니오 |
| 잔마다 향 · 맛 · 피니시 · 강도 · 한 줄 소개 | `public/data.js` 의 `drinks` | 아니오 |
| 영어 문구 | `public/i18n.js` | 아니오 |
| 질문 · 보기 · 배점 · 그림 · 디자인 | 디자이너가 원본을 새로 주면 `source/` 교체 | **예** → `python3 tools/build.py` |

질문이나 배점이 바뀌었으면 **반드시** `node tools/simulate.js` 를 돌려 보세요.

> `data.js` 의 메뉴 가격은 2026-09-18 메뉴판 사진 기준입니다. 시그니처는 16,000원(2026-10-17 확인).
> 질투(ENVY) 잔의 한 줄 소개는 나무 메뉴판 각인을 확실히 못 읽어서 화면에 내보내지 않고 있습니다
> (`confirmed: false`). 실물 문구를 확인해 넣고 `true` 로 바꾸면 나옵니다.

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
- 결과 · 오류 익명 수집 (아래, 기본은 꺼짐)
- 원본 버그 수정: 없는 `#restart` 요소에 이벤트를 걸다 스크립트가 멈추던 것
- 용량: 원본 555KB 한 파일 → 첫 화면 약 240KB (그림 분리 · 무손실 WebP · 캐시)

## 결과 · 오류 수집 (선택)

꺼져 있습니다. 켜려면:

1. Supabase 프로젝트의 SQL Editor 에서 `supabase/deadly_sins_events.sql` 실행
2. `public/data.js` 의 `collect` 에 Project URL 과 anon 키 입력

시작 · 결과(1·2위, 점수, 고른 보기) · 바텐더 화면 · 공유 · 오류만 보냅니다.
개인 정보는 없고, 손님 브라우저는 넣기만 되고 읽을 수 없습니다.
결과 분포 · 완주율 · 오류를 보는 쿼리가 SQL 파일 아래에 있습니다.

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
- 빌드 단계는 없습니다. 저장소의 `vercel.json` 이 커밋된 `public/` 을 그대로 내보냅니다.
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
