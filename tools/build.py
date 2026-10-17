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

OG_IMAGE = ("https://raw.githubusercontent.com/ca6dj12/hello/"
            "claude/deadly-sins-cocktail-qr-9ljntg/public/og.jpg")

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
    for old in IMG.glob("*.webp"):
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
<script src="data.js"></script>
<script src="i18n.js"></script>
<script src="enhance.js"></script>
</body>"""


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
                        "</title>" + HEAD_INJECT.format(og=OG_IMAGE, cover=cover.group(1)),
                        "head 주입")
    html = replace_once(html, "</body>", BODY_INJECT.strip("\n"), "body 주입")

    (OUT / "index.html").write_text(html, encoding="utf-8")
    img_kb = sum(p.stat().st_size for p in IMG.glob("*.webp")) / 1024
    out_kb = len(html.encode()) / 1024
    print(f"원본 {src_kb:.0f}KB → index.html {out_kb:.0f}KB + 이미지 {n_img}장 {img_kb:.0f}KB"
          f" (합계 {out_kb + img_kb:.0f}KB) | 배점 조정 {n_changed}곳")


if __name__ == "__main__":
    main()
