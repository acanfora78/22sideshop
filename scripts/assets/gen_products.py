"""Generate DEMO product placeholders (flat-lay silhouettes).

These are intentionally *not* photos of real 22SIDE garments. Each image is
stamped "DEMO PRODUCT — PLACEHOLDER" so nobody mistakes them for actual
merchandise. Replace /public/media/products/* with brand photography.

Run:  python3 scripts/assets/gen_products.py
"""
from __future__ import annotations

import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from lib import Canvas, OUT, blur, catmull, fbm, font, rng, to_arr

W, H = 1200, 1500
POUT = os.path.join(OUT, "products")


def shape(kind: str):
    """Returns list of (polygon_points_normalized, smooth) + detail strokes."""
    if kind in ("tee", "longsleeve", "crewneck", "hoodie", "jacket"):
        long = kind != "tee"
        if long:
            sleeve = [(0.70, 0.19), (0.80, 0.25), (0.88, 0.45), (0.92, 0.72), (0.83, 0.74), (0.77, 0.5), (0.72, 0.4)]
        else:
            sleeve = [(0.70, 0.19), (0.83, 0.25), (0.92, 0.38), (0.82, 0.45), (0.72, 0.38)]
        hem = 0.84 if kind != "jacket" else 0.80
        right = [(0.585, 0.16)] + sleeve + [(0.725, 0.6), (0.73, hem)]
        left = [(1 - x, y) for x, y in reversed(right)]
        body = right + [(0.27, hem)][:0] + left
        return body
    if kind in ("cargo", "shorts"):
        b = 0.9 if kind == "cargo" else 0.56
        return [(0.29, 0.1), (0.71, 0.1), (0.735, 0.3), (0.77, b), (0.53, b + 0.005), (0.5, 0.36),
                (0.47, b + 0.005), (0.23, b), (0.265, 0.3)]
    if kind == "cap":
        return [(0.24, 0.55), (0.26, 0.42), (0.33, 0.33), (0.43, 0.29), (0.57, 0.29), (0.67, 0.33),
                (0.74, 0.42), (0.76, 0.55), (0.68, 0.58), (0.5, 0.6), (0.32, 0.58)]
    if kind == "beanie":
        return [(0.3, 0.7), (0.3, 0.45), (0.34, 0.33), (0.42, 0.26), (0.5, 0.245), (0.58, 0.26),
                (0.66, 0.33), (0.7, 0.45), (0.7, 0.7)]
    raise ValueError(kind)


def poly_mask(pts, smooth=True, scale=(W, H)):
    c = Canvas(W, H)
    p = catmull(pts, 6) if smooth else pts
    c.poly([(x * scale[0], y * scale[1]) for x, y in p], 255)
    return c.arr()


def draw_details(kind, view, mask_rgb_draw):
    """Returns a detail canvas (dark strokes=seams, 0..1)."""
    c = Canvas(W, H)
    L = lambda pts, wd=3, v=255: c.line([(x * W, y * H) for x, y in pts], v, wd)
    if kind in ("tee", "longsleeve", "crewneck", "jacket"):
        dip = 0.215 if view == "front" else 0.175
        neck = catmull([(0.415, 0.16), (0.5, dip), (0.585, 0.16)], 10, closed=False)
        L(neck, 14)
        L([(0.41, 0.155), (0.5, 0.135), (0.59, 0.155)], 6, 140)
        L([(0.70, 0.19), (0.725, 0.4)], 2, 160)
        L([(0.30, 0.19), (0.275, 0.4)], 2, 160)
    if kind == "crewneck":
        L([(0.275, 0.82), (0.725, 0.82)], 3, 160)
        L([(0.84, 0.71), (0.91, 0.70)], 3, 160)
        L([(0.16, 0.71), (0.09, 0.70)], 3, 160)
    if kind == "hoodie":
        if view == "front":
            L(catmull([(0.4, 0.16), (0.5, 0.235), (0.6, 0.16)], 10, closed=False), 10)
            L([(0.47, 0.22), (0.465, 0.33)], 4, 200)
            L([(0.53, 0.22), (0.535, 0.33)], 4, 200)
            L([(0.36, 0.78), (0.4, 0.6), (0.6, 0.6), (0.64, 0.78)], 4, 160)
        L([(0.275, 0.79), (0.725, 0.79)], 3, 160)
    if kind == "jacket":
        if view == "front":
            L([(0.5, 0.21), (0.5, 0.8)], 4, 200)
            for y in (0.28, 0.4, 0.52, 0.64, 0.75):
                c.ellipse(0.5 * W - 7, y * H - 7, 0.5 * W + 7, y * H + 7, 255)
            for x0 in (0.33, 0.56):
                L([(x0, 0.3), (x0 + 0.11, 0.3), (x0 + 0.11, 0.42), (x0, 0.42), (x0, 0.3)], 3, 180)
        L([(0.27, 0.77), (0.73, 0.77)], 3, 160)
    if kind in ("cargo", "shorts"):
        L([(0.29, 0.14), (0.71, 0.14)], 4, 180)
        if view == "front":
            L([(0.5, 0.14), (0.5, 0.3)], 3, 180)
        if kind == "cargo":
            for x0 in (0.25, 0.64):
                L([(x0, 0.48), (x0 + 0.115, 0.48), (x0 + 0.115, 0.64), (x0, 0.64), (x0, 0.48)], 3, 180)
                L([(x0, 0.5), (x0 + 0.115, 0.5)], 2, 180)
            L([(0.245, 0.86), (0.47, 0.865)], 2, 140)
            L([(0.53, 0.865), (0.765, 0.86)], 2, 140)
        else:
            L([(0.62, 0.32), (0.7, 0.32)], 3, 180)
    if kind == "cap":
        for x in (0.43, 0.5, 0.57):
            L([(x, 0.3), (x + (x - 0.5) * 0.6, 0.55)], 2, 140)
        c.ellipse(0.5 * W - 12, 0.285 * H - 10, 0.5 * W + 12, 0.285 * H + 10, 255)
    if kind == "beanie":
        L([(0.3, 0.55), (0.7, 0.55)], 4, 160)
        for x in np.arange(0.32, 0.7, 0.02):
            L([(x, 0.56), (x, 0.69)], 1, 90)
    return c.arr()


def brim_mask():
    c = Canvas(W, H)
    p = catmull([(0.24, 0.55), (0.5, 0.6), (0.76, 0.55), (0.82, 0.66), (0.5, 0.74), (0.18, 0.66)], 8)
    c.poly([(x * W, y * H) for x, y in p], 255)
    return c.arr()


def hood_mask():
    c = Canvas(W, H)
    p = catmull([(0.38, 0.17), (0.37, 0.1), (0.43, 0.055), (0.5, 0.045), (0.57, 0.055), (0.63, 0.1), (0.62, 0.17), (0.5, 0.2)], 8)
    c.poly([(x * W, y * H) for x, y in p], 255)
    return c.arr()


def print_layer(text_lines, box, color_val, fnt_name="Anton.ttf"):
    """Render a graphic print into a 0..1 mask inside normalized box."""
    x0, y0, x1, y1 = [int(v) for v in (box[0] * W, box[1] * H, box[2] * W, box[3] * H)]
    bw, bh = x1 - x0, y1 - y0
    layer = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(layer)
    n = len(text_lines)
    lh = bh / n
    for i, t in enumerate(text_lines):
        size = int(lh * 1.1)
        f = font(fnt_name, size)
        bb = d.textbbox((0, 0), t, font=f)
        tw = bb[2] - bb[0]
        if tw > bw:
            size = int(size * bw / tw)
            f = font(fnt_name, size)
            bb = d.textbbox((0, 0), t, font=f)
            tw = bb[2] - bb[0]
        th = bb[3] - bb[1]
        d.text((x0 + (bw - tw) / 2 - bb[0], y0 + i * lh + (lh - th) / 2 - bb[1]), t, font=f, fill=255)
    arr = to_arr(layer)
    return arr


def stamp(img: Image.Image, code: str, view: str):
    d = ImageDraw.Draw(img)
    mono = font("IBMPlexMono.ttf", 26)
    mono_s = font("IBMPlexMono.ttf", 22)
    # top-left label block
    d.rectangle([40, 40, 470, 112], fill=(232, 229, 223))
    d.text((56, 48), "DEMO PRODUCT", font=mono, fill=(8, 8, 8))
    d.text((56, 80), "PLACEHOLDER IMAGE", font=mono_s, fill=(139, 23, 23))
    d.text((40, H - 72), f"22SIDE / {code} / {view.upper()}", font=mono_s, fill=(232, 229, 223))
    d.text((W - 300, H - 72), "NOT FOR SALE", font=mono_s, fill=(119, 119, 119))
    # crop marks
    for (x, y, dx, dy) in ((24, 24, 1, 1), (W - 24, 24, -1, 1), (24, H - 24, 1, -1), (W - 24, H - 24, -1, -1)):
        d.line([(x, y), (x + 40 * dx, y)], fill=(119, 119, 119), width=2)
        d.line([(x, y), (x, y + 40 * dy)], fill=(119, 119, 119), width=2)


def render(code, kind, color, print_spec, seed, view):
    g = rng(seed + (0 if view == "front" else 7))
    # background: concrete-ish
    bg_l = 0.13 + (fbm(W, H, g, 300, 6) - 0.5) * 0.12 + g.normal(0, 0.03, (H, W)).astype(np.float32)
    yy = np.linspace(0, 1, H)[:, None]
    bg_l = bg_l * (1.15 - 0.35 * yy)
    mask = poly_mask(shape(kind))
    if kind == "hoodie":
        mask = np.maximum(mask, hood_mask())
    if kind == "cap":
        mask = np.maximum(mask, brim_mask())
    shadow = blur(np.roll(np.roll(mask, 18, 0), 12, 1), 22) * 0.7
    bg_l = bg_l * (1 - shadow)
    bg = np.stack([bg_l * 1.0, bg_l * 0.985, bg_l * 0.96], -1)

    col = np.array(color, np.float32) / 255.0
    fabric = 0.86 + (fbm(W, H, g, 160, 5) - 0.5) * 0.14
    knit = 1 + g.normal(0, 0.035, (H, W)).astype(np.float32)
    folds = np.zeros((H, W), np.float32)
    fc = Canvas(W, H)
    for _ in range(9):
        x0, y0 = g.uniform(0.3, 0.7) * W, g.uniform(0.25, 0.8) * H
        x1, y1 = x0 + g.uniform(-160, 160), y0 + g.uniform(-200, 200)
        fc.line([(x0, y0), (x1, y1)], g.uniform(120, 255), g.uniform(6, 20))
    folds = blur(fc.arr(), 14)
    light = 1.08 - 0.25 * (np.linspace(0, 1, W)[None, :] * 0.5 + yy * 0.6)
    edge = np.clip(mask - blur(mask, 18), 0, 1)
    shade = fabric * knit * light * (1 - folds * 0.22) * (1 - edge * 0.5)
    garment = col[None, None, :] * shade[..., None]
    if kind == "hoodie":
        hm = hood_mask()
        inner = Canvas(W, H)
        if view == "front":
            p = catmull([(0.41, 0.165), (0.42, 0.11), (0.5, 0.075), (0.58, 0.11), (0.59, 0.165), (0.5, 0.215)], 8)
            inner.poly([(x * W, y * H) for x, y in p], 255)
        garment = garment * (1 - blur(inner.arr(), 4)[..., None] * 0.55)
        garment = garment * (1 - np.clip(hm - blur(hm, 10), 0, 1)[..., None] * 0.4)
    if kind == "cap":
        bm = brim_mask()
        garment = garment * (1 - np.clip(bm - blur(bm, 8), 0, 1)[..., None] * 0.6) * (1 - bm[..., None] * 0.12)

    det = draw_details(kind, view, None)
    garment = garment * (1 - det[..., None] * 0.35)
    # print
    if print_spec:
        spec = print_spec.get(view)
        if spec:
            lines, box, pcol = spec
            pm = print_layer(lines, box, 1) * mask
            # cracked plastisol texture
            crack = (fbm(W, H, g, 14, 3) > 0.38).astype(np.float32)
            pm = pm * (0.75 + crack * 0.25)
            pc = np.array(pcol, np.float32) / 255.0
            garment = garment * (1 - pm[..., None]) + (pc[None, None, :] * (0.92 + (fabric[..., None] - 0.86))) * pm[..., None]
    out = bg * (1 - mask[..., None]) + garment * mask[..., None]
    # global grain + slight vignette
    out = out + g.normal(0, 0.018, (H, W, 1)).astype(np.float32)
    yv, xv = np.mgrid[0:H, 0:W].astype(np.float32)
    vg = 1 - (((xv / W - 0.5) * 2) ** 2 + ((yv / H - 0.5) * 2) ** 2) * 0.18
    out = out * vg[..., None]
    img = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGB")
    stamp(img, code, view)
    return img


def detail_crop(img: Image.Image, box):
    x0, y0, x1, y1 = [int(v) for v in (box[0] * W, box[1] * H, box[2] * W, box[3] * H)]
    crop = img.crop((x0, y0, x1, y1)).resize((W, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60))
    stamp(crop, "DETAIL", "macro")
    return crop


INK_WHITE = (226, 222, 214)
INK_BLACK = (14, 14, 14)
INK_RED = (139, 23, 23)

PRODUCTS = [
    # code, file slug, kind, color, prints, detail-box
    ("D-01", "demo-heavyweight-tee-black", "tee", (30, 30, 30),
     {"front": (["22SIDE"], (0.4, 0.27, 0.6, 0.31), INK_WHITE),
      "back": (["NO RULES.", "JUST ATTITUDE."], (0.33, 0.24, 0.67, 0.42), INK_WHITE)}, (0.3, 0.12, 0.7, 0.62)),
    ("D-02", "demo-oversized-hoodie-washed-black", "hoodie", (54, 52, 50),
     {"front": (["22SIDE"], (0.36, 0.34, 0.64, 0.42), INK_RED),
      "back": (["NOT MADE", "TO FIT IN"], (0.32, 0.25, 0.68, 0.48), INK_WHITE)}, (0.3, 0.2, 0.7, 0.7)),
    ("D-03", "demo-crewneck-heather-grey", "crewneck", (122, 122, 120),
     {"front": (["UNDERGROUND", "22SIDE"], (0.34, 0.27, 0.66, 0.4), INK_BLACK), "back": None}, (0.3, 0.15, 0.7, 0.65)),
    ("D-04", "demo-cargo-pant-asphalt", "cargo", (64, 64, 60), {}, (0.2, 0.35, 0.6, 0.85)),
    ("D-05", "demo-longsleeve-bone", "longsleeve", (222, 216, 204),
     {"front": (["22"], (0.6, 0.26, 0.66, 0.31), INK_BLACK),
      "back": (["22SIDE", "EST. NYC STATE OF MIND"], (0.3, 0.22, 0.7, 0.4), INK_BLACK)}, (0.4, 0.12, 0.8, 0.62)),
    ("D-06", "demo-six-panel-cap-black", "cap", (28, 28, 28),
     {"front": (["22SIDE"], (0.4, 0.42, 0.6, 0.5), INK_WHITE)}, (0.25, 0.25, 0.75, 0.75)),
    ("D-07", "demo-work-jacket-concrete", "jacket", (98, 94, 86),
     {"back": (["22SIDE", "WORKWEAR DIV."], (0.3, 0.22, 0.7, 0.4), INK_BLACK)}, (0.3, 0.2, 0.7, 0.7)),
    ("D-08", "demo-graphic-tee-bone", "tee", (224, 219, 208),
     {"front": (["YOU CREATE IT"], (0.33, 0.27, 0.67, 0.33), INK_RED),
      "back": (["22", "SIDE"], (0.32, 0.22, 0.68, 0.6), INK_BLACK)}, (0.3, 0.15, 0.7, 0.65)),
    ("D-09", "demo-mesh-short-black", "shorts", (26, 26, 26),
     {"front": (["22"], (0.28, 0.44, 0.38, 0.52), INK_WHITE)}, (0.2, 0.1, 0.6, 0.6)),
    ("D-10", "demo-rib-beanie-blood", "beanie", (110, 24, 24),
     {"front": (["22SIDE"], (0.42, 0.58, 0.58, 0.66), INK_WHITE)}, (0.25, 0.3, 0.75, 0.8)),
]


if __name__ == "__main__":
    os.makedirs(POUT, exist_ok=True)
    for i, (code, slug, kind, color, prints, dbox) in enumerate(PRODUCTS):
        front = render(code, kind, color, prints, 100 + i, "front")
        front.save(os.path.join(POUT, f"{slug}-front.jpg"), quality=80, optimize=True, progressive=True)
        back = render(code, kind, color, prints, 100 + i, "back")
        back.save(os.path.join(POUT, f"{slug}-back.jpg"), quality=80, optimize=True, progressive=True)
        det = detail_crop(render(code, kind, color, prints, 100 + i, "front" if prints.get("front") or not prints.get("back") else "back"), dbox)
        det.save(os.path.join(POUT, f"{slug}-detail.jpg"), quality=80, optimize=True, progressive=True)
        print("product", slug)
