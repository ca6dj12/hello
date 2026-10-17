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
print/          QR·테이블 카드 (인쇄용, 사이트에는 올라가지 않음)
tools/
  simulate.js   결과 쏠림 검증기
  make-qr.js    테이블 QR 카드 생성 → print/
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

**https://sounds-e5486fpmt-ca6dj12s-projects.vercel.app**

### 지금 구조 (2026-10-17 기준)

- Vercel 프로젝트 `sounds` 의 프로덕션 주소(`sounds-zeta.vercel.app`)는 이제
  **다른 사이트(yantai)** 입니다. Deadly Sins 는 거기 올리면 안 됩니다.
- 그래서 Deadly Sins 는 `sounds` 안에 **프리뷰 배포**로 따로 올라가 있고,
  위 주소는 그 배포의 고유 주소입니다. Vercel 배포는 불변이라 이 주소는
  같은 내용을 계속 서비스합니다.
- 프리뷰라서 yantai(프로덕션)에는 아무 영향이 없습니다. 배포할 때 프로젝트
  설정도 넘기지 않았고, 빌드 설정은 그 배포 안의 `vercel.json` 에만 담았습니다.

### 왜 이름이 이렇게 길고 지저분한가

이 세션의 Vercel 권한은 **배포 생성만** 됩니다. 새 프로젝트 만들기,
`deadly-sins.vercel.app` 같은 주소(alias) 붙이기, 프로젝트 설정 바꾸기는
전부 403 으로 막혀 있습니다. 그래서 깔끔한 이름은 제가 만들 수 없습니다.

### 알아둘 위험

1. `sounds` 프로젝트에서 **옛 배포를 정리(삭제)하면 이 사이트도 사라집니다.**
   목록에서 `sounds-e5486fpmt…` 는 지우지 마세요.
2. Vercel 의 배포 보존(Deployment Retention) 정책에 따라 오래된 프리뷰 배포가
   자동 삭제될 수 있는지는 **확실하지 않습니다.** `sounds` → Settings →
   Deployment Retention 에서 프리뷰 보존 기간을 확인하세요.
3. 프리뷰 주소는 `noindex` 라 검색엔진에는 안 잡힙니다. QR 로 들어오는
   용도에는 상관없습니다.

### 제대로 고치는 법 (권장, 1분)

Deadly Sins 전용 프로젝트를 대시보드에서 직접 만드세요.

1. vercel.com/new → `ca6dj12/hello` Import
2. Project Name: `deadly-sins` (→ `deadly-sins.vercel.app`, 이름이 비어 있으면)
3. Branch 는 `claude/deadly-sins-cocktail-qr-9ljntg`, Output Directory 는
   저장소의 `vercel.json` 이 이미 `public` 으로 잡아 줍니다
4. Deploy

이러면 깔끔한 주소가 생기고, 푸시마다 자동 배포되고, 위 위험이 전부 사라집니다.
**주소가 바뀌면 QR 을 반드시 다시 만드세요**(아래 명령).

## 로컬에서 보기

```bash
python3 -m http.server 8080 --directory public
# http://localhost:8080
```
