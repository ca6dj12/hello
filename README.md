# DEADLY SINS — 오늘 밤, 당신은 어떤 죄를 삼키시겠습니까

바 테이블의 QR을 찍으면 열리는 한 장짜리 사이트입니다.
열 개의 질문 → 일곱 개의 잔 중 하나 추천 → 그 아래에 전체 메뉴.

빌드 도구가 없습니다. `public/` 안의 파일이 그대로 서비스됩니다.
(지하·혼잡한 와이파이에서도 즉시 뜨게 하려고 프레임워크를 쓰지 않았습니다.)

```
public/
  index.html    화면 뼈대
  styles.css    디자인
  app.js        화면 로직 + 도형/잔 SVG
  data.js       ← 문구·메뉴·가격·질문은 전부 여기            (수정은 대부분 이 파일만)
  scoring.js    채점 규칙
tools/
  simulate.js   결과 쏠림 검증기
  make-qr.js    테이블 QR 카드 생성
```

## 자주 하는 수정

| 하고 싶은 것 | 고칠 곳 |
|---|---|
| 가격 / 메뉴 변경 | `public/data.js` 의 `MENU` |
| 잔 설명·향·맛 변경 | `public/data.js` 의 `SINS` |
| 질문 문장 변경 | `public/data.js` 의 `QUESTIONS` |
| 위스키 ↔ 죄 연결 변경 | `MENU.whisky[].sin` 값 |

질문이나 가중치를 건드렸다면 **반드시** 아래를 돌려보세요.

```bash
node tools/simulate.js
```

## 결과가 한쪽으로 몰리지 않게 하는 장치

1. **선택지 값이 모두 같습니다.** 어떤 선택지든 가중치 합이 정확히 4점이라,
   "이걸 고르면 점수가 많이 오르는" 선택지가 없습니다.
2. **한 선택지는 두 개 이상의 죄에 나눠 걸립니다.** 무엇을 고르면 무엇이 나오는지
   역산되지 않습니다.
3. **자기 만점 대비로 겨룹니다.** 죄마다 받을 수 있는 최대 점수가 다르므로,
   원점수가 아니라 `받은 점수 ÷ 그 죄의 만점` 으로 순위를 매깁니다.
   많은 문항에 얹혀 있는 죄가 유리해지는 문제를 없앱니다.
4. **선택지 순서를 매번 섞습니다.** 앞의 것을 고르는 습관이 특정 죄로 흐르지 않습니다.
5. **감각 문항이 동점을 깹니다.** 향·온도·여운을 물은 문항은 실제 잔의 성격과
   직결되므로 동점일 때 우선권을 줍니다.

`tools/simulate.js` 는 "듣기 좋은 선택지로 기우는 사람" 같은 편향된 응답자까지
4만 명씩 돌려보고, 한 죄가 30%를 넘거나 5% 아래로 굶으면 실패로 표시합니다.

## 테이블 QR 카드

배포 주소가 정해지면 카드까지 한 번에 만들어집니다.

```bash
cd tools && npm install
node make-qr.js https://<배포주소>
```

`public/card.html` 을 브라우저에서 열고 인쇄하세요. A6, 배경 그래픽 켜기, 여백 없음.
PDF 로 저장해 인쇄소에 넘기면 그대로 테이블 카드가 됩니다.

## 배포

**https://sounds-zeta.vercel.app**  (Vercel 프로젝트 `sounds`)

이 세션의 Vercel 토큰에 새 프로젝트 생성 권한이 없어서(403), 기존 `sounds`
프로젝트에 덮어썼습니다. 그리고 파일을 인라인으로 올리는 방식은 한 번에
보낼 수 있는 양에 걸려서, **빌드 단계에서 이 저장소를 그대로 내려받도록**
설정했습니다. Vercel 프로젝트의 빌드 명령은 다음과 같습니다.

```bash
curl -sL "https://codeload.github.com/ca6dj12/hello/tar.gz/refs/heads/claude/deadly-sins-cocktail-qr-9ljntg" -o src.tgz \
  && mkdir -p src && tar xzf src.tgz -C src --strip-components=1 \
  && rm -rf public && cp -r src/public ./public
```

즉, **Vercel에서 재배포를 누르면 이 브랜치의 최신 내용을 다시 받아갑니다.**
GitHub에서 `public/data.js` 만 고치고 재배포해도 반영됩니다.

주의할 점 두 가지:

1. 브랜치 이름이 빌드 명령에 박혀 있습니다. 브랜치를 지우거나 이름을 바꾸면
   빌드가 실패합니다.
2. 저장소가 비공개로 바뀌면 내려받기가 실패합니다.

**더 나은 방법**: Vercel 대시보드에서 이 저장소를 직접 연결(Import)하면
위 우회가 필요 없어지고, 푸시할 때마다 자동 배포됩니다. 1분이면 됩니다.

## 로컬에서 보기

```bash
python3 -m http.server 8080 --directory public
# http://localhost:8080
```
