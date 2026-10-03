# 인쇄용 파일

전부 **https://sounds-zeta.vercel.app** 를 가리킵니다.
(실제로 해독해서 확인했고, 카드 폭 139px 까지 줄여도 읽힙니다.)

| 파일 | 쓸 곳 |
|---|---|
| `deadly-sins-qr.svg` | QR 원본. 벡터라 아무리 키워도 안 깨집니다. 포스터·스티커용 |
| `deadly-sins-qr.png` | QR 1200×1200. 인스타·카톡·간단한 인쇄용 |
| `deadly-sins-table-card.pdf` | A6(105×148mm) 테이블 카드. 인쇄소에 그대로 넘기면 됩니다 |
| `deadly-sins-table-card.png` | 같은 카드 이미지본 |

주소가 바뀌면 다시 만드세요.

```bash
cd tools && npm install
node make-qr.js https://새주소
```

`public/qr.svg` 와 `public/card.html` 이 새로 만들어집니다.
카드는 브라우저에서 열고 인쇄(A6, 배경 그래픽 켜기, 여백 없음)하면 됩니다.
