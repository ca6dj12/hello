# 인쇄용 파일

전부 **https://sounds-78ukdhhoo-ca6dj12s-projects.vercel.app** 를 가리킵니다.
(만든 뒤 카드 이미지와 PDF 에서 QR 을 실제로 해독해 확인했고, 카드를 폭 166px 까지 줄여도 읽힙니다.)

> **예전에 드린 QR 은 전부 폐기하세요.**
> `sounds-zeta.vercel.app` (10/03) 은 이제 yantai 로 열리고,
> `sounds-e5486fpmt…` (10/17 오전) 는 예전 14문항 버전입니다.

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
