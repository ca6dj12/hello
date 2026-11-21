# 인쇄용 파일

전부 **https://deadly-sins-mu.vercel.app** 를 가리킵니다. (고정 주소 — 앞으로 사이트를 고쳐도 바뀌지 않습니다)
만든 뒤 카드 이미지 · PDF · QR 이미지에서 QR 을 실제로 해독해 이 주소가 나오는 걸 확인했고,
카드 전체를 폭 166px 까지 줄여도 읽힙니다.

> **예전에 드린 QR 은 전부 폐기하세요.** `sounds-…` 로 시작하는 주소는 모두 옛 주소입니다.
> (`sounds-zeta.vercel.app` 은 yantai 로 열립니다.)

## 메뉴판 전용 카드

`deadly-sins-menu-card.pdf` / `.png`, `menu-qr.svg` / `.png` 는 **https://deadly-sins-mu.vercel.app/#menu** 를 가리킵니다.
찍으면 퀴즈 표지가 아니라 메뉴판이 바로 열립니다 (뒤로가기를 누르면 표지로). QR 해독으로 주소를 확인했습니다.
같은 디자인이라 퀴즈 카드와 나란히 두어도 어울립니다.

```bash
node tools/make-qr.js https://deadly-sins-mu.vercel.app --menu
```

## 퀴즈 카드

| 파일 | 쓸 곳 |
|---|---|
| `deadly-sins-table-card.pdf` | A6(105×148mm) 테이블 카드. 인쇄소에 그대로 넘기면 됩니다 (약 575dpi) |
| `deadly-sins-table-card.png` | 같은 카드 이미지본 |
| `deadly-sins-qr.svg` | QR 원본. 벡터라 아무리 키워도 안 깨집니다. 포스터·스티커용 |
| `deadly-sins-qr.png` | QR 1200×1200. 인스타·카톡·간단한 인쇄용 |
| `card.html` | 카드 원본 |

카드 디자인은 사이트 첫 화면 그림(위 흰색 · 아래 검정 · 흘러내리는 로고)을 그대로 씁니다.
QR 크기는 30mm 입니다. 테이블 위 20~40cm 거리에서 찍는 용도에 맞춘 크기입니다.

인쇄소가 재단 여백(도련 3mm)을 요구하면, 위 3mm 는 흰색 · 나머지 세 변은 검정으로
늘려 달라고 하면 됩니다(카드 가장자리가 순백/순흑이라 그대로 늘어납니다).

주소가 바뀌면 다시 만드세요.

```bash
cd tools && npm install
node make-qr.js https://새주소
```

## 1층 X배너 (확정 2026-11-21)

`deadly-sins-xbanner.pdf` — 600×1800mm, 150dpi. 인쇄소에 이 파일을 그대로 넘기면 됩니다 (X배너 실사출력).
QR 은 **https://deadly-sins-5f.vercel.app/** (1층 배너 홍보 사이트)를 가리키고, 그림에서 실제로 해독해 확인했습니다.
QR 은 서 있는 사람 가슴 높이(바닥에서 약 1.2m)에 옵니다.

세 시안(`xbanner/` 의 a · b · c) 가운데 **a (한 방울)** 로 정했습니다.

- 글자와 QR 이 전부 또렷하게 나옵니다. b 는 배경으로 깐 포스터 벽 사진이 가로 1,175px 뿐이라
  600mm 폭으로 뽑으면 약 50dpi — QR 을 찍으려고 가까이 서는 자리라 흐릿해 보일 수 있습니다.
- 문구("오늘 밤, 어떤 죄를 삼키시겠습니까?")가 QR 을 찍으면 열리는 사이트의 첫 문장과 같아서 그대로 이어집니다.
- b 로 바꾸려면 원본 사진(가로 3,500px 이상)이 있어야 합니다: `photos/room/sin-wall.jpg` 를 바꾼 뒤
  `cd tools && node make-banner.js --only b`.

크기가 다른 거치대라면 (예: 500×1800mm) `cd tools && node make-banner.js --only a --size 500x1800` 로 다시 만듭니다.
