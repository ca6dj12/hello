# 메뉴 사진

`src/` 에 원본 사진을, `credits.json` 에 출처를 넣고

```bash
pip install pillow numpy onnxruntime
python3 tools/menu-photos.py
```

를 돌리면 배경을 지운 사진이 `public/img/menu/` 에 같은 틀(800×1000) · 같은 크기 · 같은 바닥선으로 만들어지고,
`public/data.js` 의 `details[id].photo` · `photoCredit` 가 채워집니다.

- 파일 이름 = 메뉴 id (`public/data.js` 의 `"id"`). 예: `src/lagavulin-16.jpg`
- 병이 정면으로, 잘리지 않게 나온 사진일수록 결과가 좋습니다. 배경은 아무거나 괜찮습니다.
- 인터넷 사진은 **자유 이용 허가(CC0 · CC BY · CC BY-SA 등) 사진만** 쓰고 `credits.json` 에 출처를 적습니다.
  메뉴판 상세 화면에 "사진: 작성자 · 라이선스" 가 자동으로 표시됩니다.
  가게에서 직접 찍은 사진은 출처가 없어도 됩니다.
- CC BY-SA 사진을 고친 결과물(`public/img/menu/*.webp`)도 원본과 같은 라이선스를 따릅니다.
  화면의 출처 옆에 "(배경 제거 · 크기 조정)" 이 자동으로 붙습니다.
- `crop` (선택): 상자나 다른 병이 같이 찍힌 사진에서 병만 남길 영역 `[왼쪽, 위, 오른쪽, 아래]` (0~1 비율).
- `scene: true` (선택): 안주처럼 접시 · 나무 받침까지 한 장면인 사진. 배경을 지우지 않고 `crop` 영역을
  정사각형(900×900)으로 잘라 그대로 쓰고, 메뉴판은 그 사진을 꽉 차게 보여 줍니다.
- `source` 는 기록용(원본 파일 이름)이라 화면에는 나오지 않습니다.

```json
{
  "lagavulin-16": { "author": "작성자", "license": "CC BY-SA 4.0", "url": "https://commons.wikimedia.org/wiki/File:..." }
}
```
