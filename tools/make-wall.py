#!/usr/bin/env python3
"""홍보 사이트 배경: 어둡고 거친 벽 (바 안의 미장 벽 느낌)

    python3 tools/make-wall.py            → promo/wall.jpg (1024×1024 흑백, 이음매 없이 반복되는 무늬)

글자 · 사진을 해치지 않게 아주 어둡게(밝기 대략 6~30 / 255) 만든다.
무늬는 주파수 공간에서 만든 잡음이라 가장자리가 자연스럽게 이어진다 (타일로 깔아도 경계가 안 보임).
위에서 비추는 조명(벽등)처럼 음영을 넣는다. 아주 어두운 색은 webp 로 줄이면 초록 · 보라 얼룩이 생겨서 흑백 JPEG 로 저장.
타일 하나 크기의 큰 얼룩은 반복될 때 눈에 띄므로 가장 낮은 주파수는 뺀다.
numpy · Pillow 필요.
"""
import os
import numpy as np
from PIL import Image

N = 1024
OUT = os.path.join(os.path.dirname(__file__), '..', 'promo', 'wall.jpg')


def noise(beta, seed, stretch=1.0):
    """반복되는 프랙털 잡음. beta 가 클수록 큰 굴곡, 작을수록 잔 알갱이. stretch>1 이면 가로로 길쭉 (흙손 자국)"""
    r = np.random.default_rng(seed)
    ky = np.fft.fftfreq(N)[:, None]
    kx = np.fft.fftfreq(N)[None, :] * stretch
    k = np.sqrt(kx ** 2 + ky ** 2)
    k[0, 0] = 1
    spec = (r.normal(size=(N, N)) + 1j * r.normal(size=(N, N))) / k ** (beta / 2)
    spec[k < 3.5 / N] = 0   # 타일 크기만 한 얼룩은 빼기 (반복이 티 나지 않게)
    h = np.real(np.fft.ifft2(spec))
    return (h - h.mean()) / h.std()


def main():
    # 높이: 큰 물결 + 흙손 자국 + 거친 알갱이, 위를 눌러 미장 벽처럼 평평한 면과 패인 곳을 만든다
    h = 1.0 * noise(2.8, 1) + 0.6 * noise(2.2, 2, stretch=2.2) + 0.4 * noise(1.2, 3) + 0.16 * noise(0.2, 4)
    h = np.tanh(h * 0.9)
    # 위에서 비추는 빛으로 음영 (가장자리도 이어지게 np.roll 로 기울기)
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 6
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 6
    nz = 1 / np.sqrt(dx ** 2 + dy ** 2 + 1)
    light = np.array([-0.25, -0.75, 0.6])
    light /= np.linalg.norm(light)
    shade = (-dx * nz * light[0] - dy * nz * light[1] + nz * light[2])
    shade = (shade - shade.mean()) / shade.std()
    # 얼룩 (벽의 색 차이)
    albedo = noise(2.4, 5)
    lum = 15 + 5.5 * shade + 1.4 * albedo
    lum = np.clip(lum, 4, 32)
    img = Image.fromarray(np.round(lum).astype(np.uint8), 'L')
    img.save(OUT, 'JPEG', quality=82, optimize=True, progressive=True)
    print(os.path.relpath(OUT), img.size, os.path.getsize(OUT) // 1024, 'KB', 'mean', round(float(lum.mean()), 1), 'max', round(float(lum.max()), 1))


if __name__ == '__main__':
    main()
