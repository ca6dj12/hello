#!/usr/bin/env python3
"""
메뉴 사진을 한 가지 모양으로 맞추기

    python3 tools/menu-photos.py                 # photos/src 의 사진을 전부 처리
    python3 tools/menu-photos.py lagavulin-16    # 하나만

  photos/src/<메뉴 id>.(jpg|jpeg|png|webp)   원본 사진 (파일 이름 = data.js 의 menu id)
  photos/credits.json                         사진 출처 (자유 이용 허가 사진이면 반드시 적는다)
      { "lagavulin-16": { "author": "홍길동", "license": "CC BY-SA 4.0",
                          "url": "https://commons.wikimedia.org/wiki/File:...",
                          "crop": [0.55, 0, 1, 1] } }
      crop 은 선택: 원본에서 병만 남길 영역 (왼쪽, 위, 오른쪽, 아래 — 0~1 비율). 상자나 다른 병이 같이 찍혔을 때.

  → public/img/menu/<id>.webp   배경을 지운 투명 사진, 800×1000 같은 틀 · 같은 크기 · 같은 바닥선 + 바닥 반사
  → public/data.js 의 details[id].photo / photoCredit 를 채운다

  배경은 사진에 굽지 않는다. 메뉴판의 .ds-photo 가 같은 검은 조명 배경을 깔아서
  어떤 사진이 들어와도 똑같은 무대 위에 서 있는 것처럼 보인다.

  배경 지우기는 IS-Net(general use) 모델. 처음 한 번 GitHub 에서 받아 ~/.cache/deadly-sins 에 둔다 (약 170MB).
  필요: pillow, numpy, onnxruntime
"""
import io
import json
import re
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos" / "src"
CREDITS = ROOT / "photos" / "credits.json"
OUT = ROOT / "public" / "img" / "menu"
DATA = ROOT / "public" / "data.js"
MODEL_URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx"
MODEL = Path.home() / ".cache" / "deadly-sins" / "isnet-general-use.onnx"

W, H = 800, 1000          # 틀
MAX_H, MAX_W = 0.80, 0.62  # 물건이 차지할 최대 높이 · 너비 (틀 대비)
FLOOR = 0.86               # 바닥선 (위에서부터)
REFLECT = 0.10             # 바닥 반사 길이 (틀 높이 대비)


def fail(msg):
    print("실패:", msg, file=sys.stderr)
    sys.exit(1)


def session():
    import onnxruntime as ort
    if not MODEL.exists():
        MODEL.parent.mkdir(parents=True, exist_ok=True)
        print("배경 지우기 모델을 받는 중 (처음 한 번, 약 170MB)…")
        urllib.request.urlretrieve(MODEL_URL, MODEL)
    return ort.InferenceSession(str(MODEL), providers=["CPUExecutionProvider"])


def mask_of(sess, im):
    """IS-Net: 1024×1024, 평균 0.5 · 표준편차 1.0 으로 정규화 → 0~1 전경 확률."""
    x = np.asarray(im.convert("RGB").resize((1024, 1024), Image.LANCZOS), dtype=np.float32)
    x = x / max(x.max(), 1e-6) - 0.5
    x = x.transpose(2, 0, 1)[None]
    y = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    y = (y - y.min()) / max(y.max() - y.min(), 1e-6)
    m = Image.fromarray((y * 255).astype(np.uint8)).resize(im.size, Image.LANCZOS)
    # 흐릿한 잔여물은 지우고 가장자리는 살짝 정돈
    a = np.asarray(m, dtype=np.float32) / 255
    a = np.clip((a - 0.08) / 0.84, 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))


def compose(cut):
    """투명 컷아웃 → 같은 틀, 같은 크기, 같은 바닥선, 바닥 반사."""
    box = cut.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    if not box:
        return None
    cut = cut.crop(box)
    s = min(H * MAX_H / cut.height, W * MAX_W / cut.width)
    cut = cut.resize((max(1, round(cut.width * s)), max(1, round(cut.height * s))), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x = (W - cut.width) // 2
    y = round(H * FLOOR) - cut.height
    # 바닥 반사: 뒤집어서 아래로 갈수록 사라지게
    ref = cut.transpose(Image.FLIP_TOP_BOTTOM)
    n = min(ref.height, round(H * REFLECT))
    ref = ref.crop((0, 0, ref.width, n))
    fade = np.linspace(0.22, 0, n, dtype=np.float32)[:, None]
    ra = np.asarray(ref.getchannel("A"), dtype=np.float32) * fade
    ref.putalpha(Image.fromarray(ra.astype(np.uint8)))
    canvas.alpha_composite(ref, (x, y + cut.height + 2))
    canvas.alpha_composite(cut, (x, y))
    return canvas


def update_data(done, credits):
    """details 안에서 그 항목의 "photo" / "photoCredit" 두 칸만 바꾼다."""
    s = DATA.read_text(encoding="utf-8")
    start = s.find("  details: {")
    if start < 0:
        fail("data.js 에서 details 를 못 찾음")
    entry = re.compile(r'\n    "([a-z0-9:-]+)": \{')
    for mid in done:
        m = re.compile(r'\n    "' + re.escape(mid) + r'": \{').search(s, start)
        if not m:
            print(f"  ! data.js details 에 '{mid}' 가 없어 사진 경로를 못 넣음 (사진 파일은 만들어짐)")
            continue
        nxt = entry.search(s, m.end())
        end = nxt.start() if nxt else s.find("\n  },", m.end())
        part = s[m.start():end]
        c = {k: v for k, v in (credits.get(mid) or {}).items() if k in ("author", "license", "url")} or None
        part = re.sub(r'"photo": (null|"[^"]*")', '"photo": "img/menu/' + mid + '.webp"', part, count=1)
        part = re.sub(r'"photoCredit": (null|\{[^}]*\})', '"photoCredit": ' + (json.dumps(c, ensure_ascii=False) if c else "null"), part, count=1)
        s = s[:m.start()] + part + s[end:]
    DATA.write_text(s, encoding="utf-8")


def main():
    only = set(sys.argv[1:])
    files = sorted(p for p in SRC.glob("*") if p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"))
    if only:
        files = [p for p in files if p.stem in only]
    if not files:
        fail(f"{SRC} 에 처리할 사진이 없음")
    credits = json.loads(CREDITS.read_text(encoding="utf-8")) if CREDITS.exists() else {}
    OUT.mkdir(parents=True, exist_ok=True)
    sess = session()
    done = []
    for p in files:
        im = Image.open(p)
        im.load()
        im = im.convert("RGB")
        box = (credits.get(p.stem) or {}).get("crop")
        if box:
            im = im.crop((round(box[0] * im.width), round(box[1] * im.height),
                          round(box[2] * im.width), round(box[3] * im.height)))
        cut = im.convert("RGBA")
        cut.putalpha(mask_of(sess, im))
        out = compose(cut)
        if out is None:
            print(f"  ! {p.name}: 물건을 못 찾음, 건너뜀")
            continue
        dst = OUT / (p.stem + ".webp")
        out.save(dst, "WEBP", quality=86, alpha_quality=90, method=6)
        done.append(p.stem)
        note = "" if p.stem in credits else "   ← photos/credits.json 에 출처 없음"
        print(f"  {p.name} → {dst.relative_to(ROOT)} ({dst.stat().st_size // 1024}KB){note}")
    update_data(done, credits)
    print(f"완료: {len(done)}장. public/data.js 의 photo 칸을 채웠습니다.")


if __name__ == "__main__":
    main()
