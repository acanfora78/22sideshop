"""Assets for the 22 SIDE STREET universe: arrival platform, passing train
(transparent, motion-blurred), turntable and vinyl.

Run:  python3 scripts/assets/gen_station.py
"""
from __future__ import annotations

import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from gen_scenes import subway
from lib import Canvas, OUT, blur, fbm, finish, font, glow, hblur, radial, rng, save, to_arr


def train(name: str, w: int = 3200, h: int = 760, seed: int = 7):
    """Side view of a subway car rushing past. RGBA webp, heavy horizontal blur."""
    g = rng(seed)
    c = Canvas(w, h, ss=1)
    body = np.zeros((h, w), np.float32)
    c.rect(0, 40, w, h - 20, 70)
    # ribbed stainless steel
    for x in range(0, w, 14):
        c.rect(x, 60, x + 4, h - 40, 95)
    base = c.arr()
    lights = np.zeros((h, w), np.float32)
    lc = Canvas(w, h, ss=1)
    car = 900
    for cx0 in range(0, w, car):
        for k in range(4):
            x = cx0 + 80 + k * 200
            lc.rect(x, 170, x + 140, 380, 255)  # windows
        # doors
        for dx in (40, 860):
            c.rect(cx0 + dx - 30, 140, cx0 + dx + 30, h - 60, 40)
    lights = lc.arr()
    img = np.maximum(base, lights * 0.95)
    img = hblur(img, 140)
    img = img + blur(lights, 30) * 0.35
    alpha = np.zeros((h, w), np.float32)
    alpha[30:h - 15, :] = 1
    alpha = blur(alpha, 6)
    # fade the leading/trailing edges
    edge = np.clip(np.minimum(np.arange(w), w - np.arange(w)) / 220, 0, 1)[None, :]
    alpha = alpha * edge
    v = (np.clip(img, 0, 1) * 232).astype(np.uint8)
    rgba = np.dstack([v, v, (v * 0.97).astype(np.uint8), (alpha * 255).astype(np.uint8)])
    Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, name), "WEBP", quality=80, method=6)
    print("wrote", name)


def vinyl(name: str, size: int = 1400, seed: int = 9):
    """Record seen from above, RGBA, red 22 label — rotates in THE SOUND chapter."""
    g = rng(seed)
    s = size
    y, x = np.mgrid[0:s, 0:s].astype(np.float32)
    r = np.sqrt((x - s / 2) ** 2 + (y - s / 2) ** 2) / (s / 2)
    grooves = 0.08 + 0.05 * (np.sin(r * 420) * 0.5 + 0.5) + (g.random((s, s)) * 0.02)
    ang = np.arctan2(y - s / 2, x - s / 2)
    sheen = (np.cos(ang * 2 - 0.6) * 0.5 + 0.5) ** 6 * 0.35 * (r > 0.36)
    lum = grooves + sheen
    rgb = np.dstack([lum, lum, lum])
    label = r < 0.33
    rgb[label] = [139 / 255, 23 / 255, 23 / 255]
    rgb[r < 0.025] = [0.03, 0.03, 0.03]
    alpha = (r < 0.995).astype(np.float32)
    img = Image.fromarray((np.dstack([np.clip(rgb, 0, 1), alpha]) * 255).astype(np.uint8), "RGBA")
    d = ImageDraw.Draw(img)
    f = font("Anton.ttf", int(s * 0.07))
    bb = d.textbbox((0, 0), "22SIDE", font=f)
    d.text((s / 2 - (bb[2] - bb[0]) / 2 - bb[0], s / 2 - s * 0.155), "22SIDE", font=f, fill=(232, 229, 223, 255))
    m = font("IBMPlexMono.ttf", int(s * 0.017))
    for i, t in enumerate(["SIDE A — 33⅓ RPM", "LINE 22 SESSIONS"]):
        bb = d.textbbox((0, 0), t, font=m)
        d.text((s / 2 - (bb[2] - bb[0]) / 2, s / 2 + s * 0.06 + i * s * 0.026), t, font=m, fill=(232, 229, 223, 220))
    img.save(os.path.join(OUT, name), "WEBP", quality=82, method=6)
    print("wrote", name)


def turntable(name: str, w: int = 2000, h: int = 1400, seed: int = 10):
    """Top view of a deck on concrete; the platter area is left for the vinyl overlay."""
    g = rng(seed)
    bg = 0.22 + (fbm(w, h, g, 300, 6) - 0.5) * 0.18
    c = Canvas(w, h)
    # plinth
    px0, py0, px1, py1 = w * 0.18, h * 0.1, w * 0.82, h * 0.9
    c.rect(px0, py0, px1, py1, 255)
    plinth = c.arr()
    cc = Canvas(w, h)
    cx, cy, R = w * 0.44, h * 0.5, h * 0.36
    cc.ellipse(cx - R, cy - R, cx + R, cy + R, 255)
    platter = cc.arr()
    ac = Canvas(w, h)
    # tonearm
    ac.ellipse(w * 0.72 - 50, h * 0.2 - 50, w * 0.72 + 50, h * 0.2 + 50, 255)
    ac.line([(w * 0.72, h * 0.2), (w * 0.7, h * 0.62), (w * 0.6, h * 0.72)], 255, 12)
    ac.rect(w * 0.585, h * 0.7, w * 0.62, h * 0.76, 255)
    # pitch slider + buttons
    ac.rect(w * 0.76, h * 0.5, w * 0.775, h * 0.82, 200)
    ac.ellipse(w * 0.22, h * 0.8, w * 0.26, h * 0.86, 230)
    arm = ac.arr()
    img = bg * (1 - plinth) + plinth * (0.1 + fbm(w, h, g, 80, 3) * 0.05)
    shadow = blur(np.roll(np.roll(plinth, 20, 0), 20, 1), 25)
    img = img * (1 - shadow * 0.6 * (1 - plinth)) 
    img = img * (1 - platter) + platter * 0.05
    img = img * (1 - arm) + arm * 0.7
    img = img + radial(w, h, w * 0.3, h * 0.2, w * 0.9) * 0.15
    save(finish(img, g, contrast=1.2, vig=0.6, grain_amt=0.06), name)


if __name__ == "__main__":
    subway("scene-platform-arrival.jpg", 2400, 1500, 22, train=False, cxr=0.5)
    train("train-pass.webp")
    vinyl("vinyl-22.webp")
    turntable("scene-turntable.jpg")
