#!/usr/bin/env python3
"""
DEADLY SINS 빌드

    python3 tools/build.py

source/deadly_sins.html (디자이너 원본, 손대지 않음) 을 읽어 public/ 을 만든다.

  1. 원본에 박힌 base64 PNG 를 무손실 WebP 파일(public/img/)로 분리한다.
     무손실이어야 하는 이유: 시그니처 애니메이션이 술잔 이미지의 픽셀을 직접 읽어
     물방울 윤곽을 계산한다. 손실 압축은 그 픽셀을 바꾼다.
  2. 원본의 버그를 고친다 (없는 #restart 요소에 이벤트를 걸다 예외가 나던 것).
  3. 선택지 배점을 조정한다 (REBALANCE 표). 문구는 절대 바꾸지 않는다.
  4. 공유 메타와 개선 레이어(enhance.css / data.js / i18n.js / enhance.js)를 끼워 넣는다.
  5. 시그니처 일곱 잔 그림 윗부분의 죄 상징(마름모 · 별 · 원 …)만 잘라 메뉴판 아이콘을 만든다.

새 원본을 받으면 source/deadly_sins.html 만 교체하고 다시 실행하면 된다.
어딘가 끼워 넣을 자리를 못 찾으면 조용히 넘어가지 않고 멈춘다.
필요: Pillow (WebP 지원)
"""
import base64
import hashlib
import io
import json
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source" / "deadly_sins.html"
OUT = ROOT / "public"
IMG = OUT / "img"

# 링크 미리보기 이미지는 절대 주소여야 한다. Vercel 프로젝트 deadly-sins 의 고정 주소.
SITE = "https://deadly-sins-mu.vercel.app"
OG_IMAGE = SITE + "/og.jpg"
SYMBOL_VERSION = 3

# ---------------------------------------------------------------------------
# 배점 조정표.  (문항 번호 1~7, 선택지 원문) → 새 배점
# 원문이 바뀌면 빌드가 멈춘다. 그때는 tools/simulate.js 로 다시 측정하고 표를 고칠 것.
# 근거는 README 의 "결과 쏠림" 항목.
# ---------------------------------------------------------------------------
REBALANCE: dict = {}


def fail(msg: str) -> None:
    print("빌드 실패:", msg, file=sys.stderr)
    sys.exit(1)


def replace_once(html: str, old: str, new: str, what: str) -> str:
    n = html.count(old)
    if n != 1:
        fail(f"{what}: 기준 문자열이 {n}번 나옴 (정확히 1번이어야 함)")
    return html.replace(old, new)


def extract_images(html: str) -> str:
    IMG.mkdir(parents=True, exist_ok=True)
    for old in IMG.glob("*.webp"):      # 메뉴 사진(img/menu/)은 하위 폴더라 지우지 않는다
        old.unlink()
    made = {}

    def to_file(m: re.Match) -> str:
        b64 = m.group(1)
        if b64 not in made:
            raw = base64.b64decode(b64)
            name = hashlib.sha1(raw).hexdigest()[:10] + ".webp"
            im = Image.open(io.BytesIO(raw))
            im.save(IMG / name, "WEBP", lossless=True, quality=100, method=6)
            made[b64] = name
        return "img/" + made[b64]

    html = re.sub(r"data:image/png;base64,([A-Za-z0-9+/=]+)", to_file, html)
    if not made:
        fail("원본에서 이미지를 하나도 못 찾음")
    return html, len(made)


def apply_rebalance(html: str) -> str:
    m = re.search(r"const QUESTIONS=(\[.*?\]);\n", html, re.S)
    if not m:
        fail("QUESTIONS 를 못 찾음")
    questions = json.loads(m.group(1))
    changed = 0
    for (qno, text), points in REBALANCE.items():
        opts = [o for o in questions[qno - 1]["a"] if o["text"] == text]
        if len(opts) != 1:
            fail(f"배점 조정: Q{qno} 선택지 '{text[:20]}…' 를 못 찾음 (원문이 바뀜?)")
        if opts[0]["points"] != points:
            opts[0]["points"] = points
            changed += 1
    new = "const QUESTIONS=" + json.dumps(questions, ensure_ascii=False, separators=(",", ":")) + ";\n"
    return html[: m.start()] + new + html[m.end():], changed


HEAD_INJECT = """
<meta name="description" content="일곱 개의 질문이 끝나면, 일곱 개의 잔 중 하나가 당신을 고릅니다. DEADLY SINS.">
<meta property="og:type" content="website">
<meta property="og:url" content="{site}/">
<meta property="og:title" content="오늘 밤, 당신은 어떤 죄를 삼키시겠습니까?">
<meta property="og:description" content="일곱 개의 질문이 끝나면, 일곱 개의 잔 중 하나가 당신을 고릅니다.">
<meta property="og:image" content="{og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="{cover}">
<link rel="stylesheet" href="enhance.css">"""

BODY_INJECT = """
<script>window.DS_SYMBOLS={symbols};</script>
<script src="data.js"></script>
<script src="i18n.js"></script>
<script src="enhance.js"></script>
</body>"""


def make_symbols(html: str) -> dict:
    """시그니처 그림(흰 바탕 · 검은 잉크, 위에 상징 · 아래에 잔)에서 상징만 잘라
    흰 잉크 + 투명 바탕 아이콘으로 만든다. 파일 이름은 픽셀 내용의 해시라 같은 그림이면 같은 이름."""
    m = re.search(r"const SIGNATURE_DRINKS=(\{.*?\});", html, re.S)
    if not m:
        fail("SIGNATURE_DRINKS 를 못 찾음")
    drinks = json.loads(m.group(1))
    out = {}
    for k, d in drinks.items():
        im = Image.open(OUT / d["image"]).convert("L")
        # 상징(흘러내림 포함)과 잔 사이에는 잉크 없는 줄이 이어진다. 위에서부터 내려가다
        # 빈 줄이 10줄 넘게 이어지는 곳에서 끊는다. 못 찾으면 위쪽 47% 를 쓴다.
        full = im.point(lambda v: 255 if v < 140 else 0).load()
        counts = [sum(1 for x in range(im.width) if full[x, y]) for y in range(im.height)]
        first = next((y for y, c in enumerate(counts) if c > 8), 0)       # 튄 점 말고 상징 본체가 시작하는 줄
        cut, empty = round(im.height * 0.47), 0
        for y in range(first + round(im.height * 0.12), round(im.height * 0.6)):
            empty = empty + 1 if counts[y] <= 2 else 0
            if empty >= 10:
                cut = y - empty + 1
                break
        top = im.crop((0, 0, im.width, cut))
        ink = top.point(lambda v: 255 if v < 140 else 0)
        # 튄 잉크 몇 점 때문에 틀이 커지지 않게, 잉크가 3픽셀 넘게 있는 줄 · 칸만 센다
        px = ink.load()
        rows = [y for y in range(ink.height) if sum(1 for x in range(ink.width) if px[x, y]) > 3]
        cols = [x for x in range(ink.width) if sum(1 for y in range(ink.height) if px[x, y]) > 3]
        if not rows or not cols:
            fail(f"{k} 상징을 못 찾음")
        x0, x1, y0, y1 = min(cols), max(cols) + 1, min(rows), max(rows) + 1
        side = round(max(x1 - x0, y1 - y0) * 1.08)
        cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
        box = (cx - side // 2, cy - side // 2, cx - side // 2 + side, cy - side // 2 + side)
        # 정사각형 틀이 그림 밖으로 나가면 PIL 은 검은색(=잉크)으로 채우므로, 흰 여백을 둘러 놓고 자른다
        pad = side
        canvas = Image.new("L", (top.width + 2 * pad, top.height + 2 * pad), 255)
        canvas.paste(top, (pad, pad))
        sym = canvas.crop(tuple(v + pad for v in box)).resize((96, 96), Image.LANCZOS)
        alpha = sym.point(lambda v: 255 - v)                               # 검은 잉크 → 불투명
        icon = Image.new("RGBA", sym.size, (247, 245, 243, 0))
        icon.putalpha(alpha)
        # 이름은 원본 그림 이름 + 자르는 방식의 판 번호로 정한다 (Pillow 판이 달라도 같은 이름 → CI 의 빌드 비교가 안 흔들림).
        # 자르는 방식을 바꾸면 SYMBOL_VERSION 을 올릴 것 — 이 파일들은 1년 캐시라 이름이 바뀌어야 새로 받아 간다.
        name = hashlib.sha1(f"sym-{SYMBOL_VERSION}:{d['image']}".encode()).hexdigest()[:10] + ".webp"
        icon.save(IMG / name, "WEBP", lossless=True, quality=100, method=6)
        out[k] = "img/" + name
    return out


def main() -> None:
    if not SRC.exists():
        fail(f"{SRC} 가 없음")
    html = SRC.read_text(encoding="utf-8")
    src_kb = len(html.encode()) / 1024

    # 1) 이미지 분리
    html, n_img = extract_images(html)
    cover = re.search(r'<img class="cover-art" src="(img/[0-9a-f]+\.webp)"', html)
    if not cover:
        fail("표지 이미지(.cover-art)를 못 찾음")

    # 2) 원본 버그: HTML 에 없는 #restart 에 이벤트를 걸어 예외 → 다음 줄 renderQuestion() 미실행
    html = replace_once(
        html,
        "$('restart').addEventListener('click',",
        "$('restart')&&$('restart').addEventListener('click',",
        "restart 가드",
    )

    # 3) 배점 조정
    html, n_changed = apply_rebalance(html)

    # 4) 메타 + 개선 레이어
    html = replace_once(html, "</title>",
                        "</title>" + HEAD_INJECT.format(og=OG_IMAGE, site=SITE, cover=cover.group(1)),
                        "head 주입")
    symbols = make_symbols(html)
    html = replace_once(html, "</body>",
                        BODY_INJECT.strip("\n").replace("{symbols}", json.dumps(symbols, ensure_ascii=False)),
                        "body 주입")

    (OUT / "index.html").write_text(html, encoding="utf-8")

    # 5) 1층 소개 페이지(lobby.html) 등 다른 페이지가 쓰는 브랜드 그림 목록
    #    (그림 파일 이름이 내용 해시라 원본이 바뀌면 이름도 바뀐다 → 손으로 적지 않고 여기서 만든다)
    drinks = re.search(r"SIGNATURE_DRINKS=(\{.*?\}\});", html)
    wordmark = re.search(r'<img class="wordmark-img" src="(img/[0-9a-f]+\.webp)"', html)
    if not drinks or not wordmark:
        fail("SIGNATURE_DRINKS 나 워드마크(.wordmark-img)를 못 찾음")
    brand = {"cover": cover.group(1), "wordmark": wordmark.group(1),
             "drinks": json.loads(drinks.group(1)), "symbols": symbols}
    (OUT / "brand.js").write_text(
        "/* tools/build.py 가 만든 파일 — 고치지 말 것. 표지 · 워드마크 · 일곱 잔 그림 경로 */\n"
        "window.DS_BRAND = " + json.dumps(brand, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    img_kb = sum(p.stat().st_size for p in IMG.glob("*.webp")) / 1024
    out_kb = len(html.encode()) / 1024
    print(f"원본 {src_kb:.0f}KB → index.html {out_kb:.0f}KB + 이미지 {n_img}장 {img_kb:.0f}KB"
          f" (합계 {out_kb + img_kb:.0f}KB) | 배점 조정 {n_changed}곳")


if __name__ == "__main__":
    main()
