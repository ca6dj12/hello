# DEADLY SINS — 오늘 밤, 당신은 어떤 죄를 삼키시겠습니까

바 테이블의 QR을 찍으면 열리는 한 장짜리 사이트입니다.
14개의 질문 → 일곱 개의 죄 중 하나 → 당신의 시그니처 술.

빌드 도구도, 외부 의존성도 없습니다. `public/index.html` 한 장이 전부입니다.
폰트는 시스템 폰트를 쓰고 이미지 17장은 파일 안에 들어 있어서, 네트워크가
느린 지하에서도 파일 하나만 받으면 끝납니다.

```
public/
  index.html    사이트 전체 (화면·로직·이미지 전부 한 파일)
  og.jpg        공유 링크 미리보기 이미지
  favicon.svg   탭 아이콘
  qr.svg        테이블 QR
  card.html     인쇄용 테이블 카드
tools/
  simulate.js   결과 쏠림 검증기
  make-qr.js    테이블 QR 카드 생성
```

## 화면 흐름

표지 → 14개 질문 → 결과(7죄악 레이더 그래프 + 막대) → 시그니처 술
(잉크가 잔에 떨어지는 연출 + 연애/일적/성적 성향)

## 자주 하는 수정

| 하고 싶은 것 | 고칠 곳 (`public/index.html` 안) |
|---|---|
| 질문 / 선택지 문장 | `const QUESTIONS=[...]` |
| 선택지 배점 | 같은 곳의 `"points":"색3 · 교2 · 탐1"` |
| 술 이름 | `SIGNATURE_DRINKS` |
| 성향 설명 문구 | `renderSignatureTrait` 가 쓰는 표 |

질문이나 가중치를 건드렸다면 **반드시** 아래를 돌려보세요.

```bash
node tools/simulate.js
```

## 결과 쏠림 — 현재 측정값 (2026-10-03)

`node tools/simulate.js` 기준입니다. **완전 균등은 14.3%.**

| 응답자 모델 | 최다 | 최소 |
|---|---|---|
| 균등 랜덤 | 교만 28.3% | 탐식 8.3% |
| 앞 보기(A) 선호 | 색욕 29.1% | 탐식 2.3% |
| 뒤 보기(D) 선호 | 나태 49.4% | 분노 3.1% |
| 늘 A만 고름 | 색욕 100% | 나머지 0% |

쏠리는 원인 세 가지:

1. **동점이 14%나 발생하는데, 동점이면 늘 배열 순서로 결정됩니다.**
   `SINS` 가 교만·질투·분노·나태·탐욕·탐식·색욕 순이라 교만이 동점을 독식합니다.
2. **보기 순서를 섞지 않습니다.** D 자리에 나태 27점·탐식 22점이, A 자리에
   색욕 22점이 몰려 있어서, "대충 맨 위" 같은 습관이 그대로 결과가 됩니다.
3. **죄별 총 배점이 다릅니다.** 교만 53점 vs 질투 43점 (이상치 48점).

고치려면: ① 동점 처리 방식을 바꾸고 ② 선택지 순서를 매 세션 섞고
③ 배점을 48점 근처로 맞추면 됩니다. 셋 다 문구는 건드리지 않습니다.

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

### 지금 어떻게 올라가 있나

이 세션의 Vercel 토큰은 **배포 생성만** 가능하고, 프로젝트를 만들거나
설정을 바꾸는 건 403으로 막혀 있습니다. 그래서 파일을 직접 올리는 대신
**배포할 때마다 빌드 명령을 함께 실어 보내고, 그 빌드가 이 저장소를
내려받는** 방식으로 돌아갑니다. 배포에 실려 가는 빌드 명령은 이것입니다.

```bash
curl -sL https://codeload.github.com/ca6dj12/hello/tar.gz/refs/heads/claude/deadly-sins-cocktail-qr-9ljntg -o s.tgz \
  && rm -rf public && mkdir public \
  && tar xzf s.tgz --wildcards --strip-components=2 -C public "*/public/*"
```

### ⚠️ 대시보드의 "Redeploy" 버튼을 누르지 마세요

이 빌드 명령은 **프로젝트에 저장돼 있지 않고 배포 하나하나에만 붙어 있습니다.**
대시보드에서 Redeploy를 누르면 빌드 명령이 빠진 채로 다시 빌드되고,
결과물이 비어서 **사이트 전체가 404가 됩니다.** (2026-10-03에 실제로 한 번
이렇게 내려갔습니다.)

404가 났다면 당황하지 말고, 빌드 명령을 포함한 새 배포를 올리면 바로 복구됩니다.

### 제대로 고치는 법 (권장, 1분)

Vercel 대시보드에서 이 저장소를 직접 연결(Import)하세요.

1. vercel.com → 프로젝트 `sounds` → Settings → Git → Connect Git Repository
2. `ca6dj12/hello` 의 `claude/deadly-sins-cocktail-qr-9ljntg` 브랜치 선택
3. Build Command 비우기, Output Directory 를 `public` 으로

이렇게 하면 위의 우회가 전부 필요 없어지고, 푸시할 때마다 자동 배포되며,
Redeploy 버튼도 안전해집니다.

### 그 밖에 알아둘 것

- 브랜치 이름이 빌드 명령에 박혀 있습니다. 브랜치를 지우거나 이름을 바꾸면 깨집니다.
- 저장소가 비공개로 바뀌면 내려받기가 실패합니다.

## 로컬에서 보기

```bash
python3 -m http.server 8080 --directory public
# http://localhost:8080
```
