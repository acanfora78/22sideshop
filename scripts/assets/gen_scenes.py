"""Generate the 22SIDE editorial scene library (B&W, night, NYC-inspired).

Run:  python3 scripts/assets/gen_scenes.py
"""
from __future__ import annotations

import numpy as np
from PIL import Image

from lib import (Canvas, blur, fbm, finish, font, glow, hblur, hooded_figure, lerp,
                 radial, rng, save, to_arr, vblur, value_noise)


# ---------------------------------------------------------------- street night
def street_night(name: str, w: int, h: int, seed: int, figure: bool = False, vpx: float = 0.5):
    g = rng(seed)
    cx, cy = w * vpx, h * 0.5
    f = w * 0.42
    cam_h = 1.7

    def P(X, Y, Z):
        return (cx + f * X / Z, cy - f * (Y - cam_h) / Z)

    c = Canvas(w, h)
    # sky
    yy = np.linspace(0, 1, h)[:, None]
    sky = (0.05 + 0.22 * np.clip(yy / 0.5, 0, 1) ** 3) * np.ones((h, w))
    c.img.paste(Image.fromarray((sky * 255).astype(np.uint8)).resize(c.img.size))
    accent = np.zeros((h, w), np.float32)
    acc_c = Canvas(w, h)

    for side in (-1, 1):
        X = 13.0 * side
        z = 400.0
        segs = []
        while z > 3:
            depth = g.uniform(12, 28)
            segs.append((z - depth, z, g.uniform(14, 48)))
            z -= depth
        for z0, z1, H in segs:  # far → near
            z0 = max(z0, 2.2)
            shade = g.uniform(14, 30)
            c.poly([P(X, 0, z0), P(X, H, z0), P(X, H, z1), P(X, 0, z1)], shade)
            # cornice
            c.poly([P(X, H, z0), P(X, H + 0.6, z0), P(X, H + 0.6, z1), P(X, H, z1)], shade + 18)
            # front face sliver (building end towards the street)
            c.poly([P(X, 0, z0), P(X, H + 0.6, z0), P(X + side * 4, H + 0.6, z0), P(X + side * 4, 0, z0)], shade - 6)
            floors = int(H // 3.2)
            cols = max(1, int((z1 - z0) // 2.6))
            for fl in range(1, floors):
                y0 = fl * 3.2 + 0.9
                for col in range(cols):
                    za = z0 + col * 2.6 + 0.7
                    zb = za + 1.3
                    if zb > z1:
                        continue
                    lit = g.random() < 0.22
                    v = g.uniform(150, 255) if lit else g.uniform(4, 22)
                    c.poly([P(X, y0, za), P(X, y0 + 1.7, za), P(X, y0 + 1.7, zb), P(X, y0, zb)], v)
            # fire escape zigzag on some buildings
            if g.random() < 0.5 and z0 < 120:
                Xf = X - side * 0.9
                for fl in range(1, floors):
                    y = fl * 3.2
                    zm = (z0 + z1) / 2
                    c.line([P(Xf, y, z0 + 2), P(Xf, y, z1 - 2)], 6, 1.4)
                    c.line([P(Xf, y + 1, z0 + 2), P(Xf, y + 1, z1 - 2)], 6, 1)
                    if fl % 2:
                        c.line([P(Xf, y, z0 + 3), P(Xf, y + 3.2, zm)], 6, 1.2)
                    else:
                        c.line([P(Xf, y, z1 - 3), P(Xf, y + 3.2, zm)], 6, 1.2)
    # road & sidewalks
    c.poly([P(-13, 0, 2.2), P(-13, 0, 400), P(13, 0, 400), P(13, 0, 2.2)], 10)
    c.poly([P(-13, 0, 2.2), P(-13, 0, 400), P(-9, 0, 400), P(-9, 0, 2.2)], 20)
    c.poly([P(9, 0, 2.2), P(9, 0, 400), P(13, 0, 400), P(13, 0, 2.2)], 20)
    for z in np.arange(4, 300, 9):
        c.poly([P(-0.12, 0, z), P(-0.12, 0, z + 4), P(0.12, 0, z + 4), P(0.12, 0, z)], 120)
    base = c.arr()

    # lamps (light sources drawn as glow)
    lights = np.zeros((h, w), np.float32)
    lamp_pts = []
    for side in (-1, 1):
        for z in np.arange(8 + (side > 0) * 12, 300, 26):
            x, y = P(8.6 * side, 7.5, z)
            lamp_pts.append((x, y, z))
    lc = Canvas(w, h)
    for x, y, z in lamp_pts:
        r = max(1.5, 120 / z)
        lc.ellipse(x - r, y - r * 0.6, x + r, y + r * 0.6, 255)
        bx, by = P(8.6 * np.sign(x - cx), 0, z)
        lc.line([(x, y), (bx, by)], 30, max(1, 18 / z))
    lights = lc.arr()
    # tail lights (accent) far down the road
    for z, off in ((38, -2.2), (70, 1.8), (140, -1.5)):
        for dx in (-0.7, 0.7):
            x, y = P(off + dx, 0.9, z)
            r = max(1.5, 60 / z)
            acc_c.ellipse(x - r, y - r * 0.6, x + r, y + r * 0.6, 255)
    accent = acc_c.arr()

    img = np.maximum(base, lights)
    # wet asphalt reflection: mirror upper half below horizon, stretched + blurred
    refl = np.zeros_like(img)
    src = np.maximum(img, accent)
    hh = int(h - cy)
    up = src[int(cy) - hh:int(cy), :][::-1] if cy - hh >= 0 else src[:int(cy), :][::-1]
    refl[int(cy):int(cy) + up.shape[0], :] = up[: h - int(cy)]
    refl = vblur(blur(refl, 3), 18)
    road_mask = np.zeros((h, w), np.float32)
    rm = Canvas(w, h)
    rm.poly([P(-13, 0, 2.2), P(-13, 0, 400), P(13, 0, 400), P(13, 0, 2.2)], 255)
    road_mask = rm.arr()
    ripple = value_noise(w, h, 40, g)
    img = img + refl * road_mask * 0.55 * (0.6 + ripple * 0.6)
    acc_refl = np.zeros_like(accent)
    acc_refl[int(cy):int(cy) + up.shape[0], :] = accent[int(cy) - up.shape[0]:int(cy), :][::-1][: h - int(cy)]
    accent = accent + vblur(blur(acc_refl, 2), 24) * road_mask * 0.9

    # atmospheric fog toward vanishing point
    fog = radial(w, h, cx, cy, w * 0.55) * 0.35 + fbm(w, h, g, 600, 4) * 0.06
    img = img + fog

    if figure:
        fc = Canvas(w, h, fill=0)
        hooded_figure(fc, cx, h * 0.93, h * 0.62, 255)
        mask = fc.arr()
        rim = np.clip(blur(mask, 6) - mask, 0, 1) * 0.9
        img = img * (1 - mask) + mask * 0.02 + rim * 0.5
        accent = accent * (1 - mask)

    img = glow(img, 0.55, 10, 0.7)
    accent = glow(accent, 0.3, 8, 1.4)
    save(finish(img, g, contrast=1.3, vig=0.7, grain_amt=0.07, accent=accent), name)


# ---------------------------------------------------------------- subway
def subway(name: str, w: int, h: int, seed: int):
    g = rng(seed)
    cx, cy = w * 0.58, h * 0.47
    f = w * 0.36
    cam_h = 1.6

    def P(X, Y, Z):
        return (cx + f * X / Z, cy - f * (Y - cam_h) / Z)

    c = Canvas(w, h, fill=6)
    # ceiling, platform, walls
    c.poly([P(-6, 4.2, 1.2), P(-6, 4.2, 300), P(6, 4.2, 300), P(6, 4.2, 1.2)], 22)
    c.poly([P(-6, 0, 1.2), P(-6, 0, 300), P(0.2, 0, 300), P(0.2, 0, 1.2)], 34)  # platform left
    c.poly([P(0.2, 0, 1.2), P(0.2, 0, 300), P(0.2, -1.2, 300), P(0.2, -1.2, 1.2)], 8)  # edge drop
    c.poly([P(0.2, -1.2, 1.2), P(0.2, -1.2, 300), P(6, -1.2, 300), P(6, -1.2, 1.2)], 14)  # track bed
    # platform edge stripe
    c.poly([P(-0.5, 0, 1.2), P(-0.5, 0, 300), P(0.2, 0, 300), P(0.2, 0, 1.2)], 64)
    # tiles on left wall
    for z in np.arange(1.5, 200, 0.45):
        c.line([P(-6, 0, z), P(-6, 4.2, z)], 40, max(0.5, 3 / z))
    c.poly([P(-6, 0, 1.2), P(-6, 4.2, 1.2), P(-6, 4.2, 300), P(-6, 0, 300)], 0)
    for z in np.arange(1.5, 200, 0.5):
        c.line([P(-5.99, 0, z), P(-5.99, 3.6, z)], 52 - min(40, z * 0.6), max(0.6, 4 / z))
    # rails
    for X in (2.2, 3.7):
        c.line([P(X, -1.05, 1.2), P(X, -1.05, 300)], 140, 2)
    for z in np.arange(1.5, 150, 0.7):
        c.line([P(1.6, -1.15, z), P(4.3, -1.15, z)], 24, max(0.5, 5 / z))
    # columns (I-beams)
    for z in np.arange(2.0, 220, 4.5):
        x0, y0 = P(1.1, 4.2, z)
        x1, y1 = P(1.4, -1.2, z)
        c.rect(x0, y0, x1, y1, 4)
        x0b, _ = P(1.18, 4.2, z)
        c.rect(x0b, y0, x0b + max(1, 6 / z), y1, 60)
    base = c.arr()
    lc = Canvas(w, h)
    for z in np.arange(2.5, 220, 3.2):
        for X in (-2.5, 2.8):
            a, b = P(X - 0.8, 4.15, z), P(X + 0.8, 4.15, z + 1.2)
            lc.poly([a, (b[0], a[1]), b, (a[0], b[1])], 255)
    lights = lc.arr()
    # signal light + distant headlights
    acc = Canvas(w, h)
    sx, sy = P(4.8, 2.4, 60)
    acc.ellipse(sx - 5, sy - 5, sx + 5, sy + 5, 255)
    accent = acc.arr()
    hc = Canvas(w, h)
    for X in (2.4, 3.5):
        x, y = P(X, 0.6, 190)
        hc.ellipse(x - 3, y - 3, x + 3, y + 3, 255)
    lights = np.maximum(lights, hc.arr())
    img = np.maximum(base, lights)
    # floor reflection of lights on platform
    img = img + vblur(blur(lights[::-1] * 0, 1), 4)
    # passing train motion blur on the right foreground
    tc = Canvas(w, h)
    tc.rect(w * 0.83, 0, w, h, 30)
    for i in range(18):
        y = g.uniform(0.15, 0.6) * h
        tc.rect(w * 0.83, y, w, y + g.uniform(20, 70), g.uniform(120, 240))
    train = hblur(tc.arr(), 60)
    tmask = np.zeros((h, w), np.float32)
    tmask[:, int(w * 0.8):] = np.linspace(0, 1, w - int(w * 0.8))[None, :] ** 0.6
    img = img * (1 - tmask) + train * tmask
    img = img + radial(w, h, cx, cy, w * 0.4) * 0.22
    img = glow(img, 0.6, 9, 0.6)
    accent = glow(accent, 0.3, 10, 1.6)
    save(finish(img, g, contrast=1.25, vig=0.6, grain_amt=0.08, accent=accent), name)


# ---------------------------------------------------------------- skyline + bridge
def skyline(name: str, w: int, h: int, seed: int):
    g = rng(seed)
    hy = h * 0.62
    yy = np.linspace(0, 1, h)[:, None] * np.ones((1, w))
    sky = 0.08 + 0.62 * np.clip(yy / 0.62, 0, 1) ** 2.2
    sky += fbm(w, h, g, 500, 4) * 0.05
    c = Canvas(w, h)
    c.img = Image.fromarray((np.clip(sky, 0, 1) * 255).astype(np.uint8)).resize(c.img.size)
    from PIL import ImageDraw
    c.d = ImageDraw.Draw(c.img)
    # two layers of towers
    for layer, (hmin, hmax, shade, density) in enumerate(((0.05, 0.22, 30, 60), (0.06, 0.42, 12, 34))):
        x = -20.0
        while x < w:
            bw = g.uniform(w / density * 0.6, w / density * 1.8)
            bh = h * g.uniform(hmin, hmax) * (1.3 if 0.35 < x / w < 0.55 else 1)
            top = hy - bh
            c.rect(x, top, x + bw, hy, shade)
            if g.random() < 0.15:
                c.rect(x + bw * 0.45, top - bh * 0.25, x + bw * 0.55, top, shade)
            if g.random() < 0.2:
                c.poly([(x, top), (x + bw / 2, top - bw * 0.6), (x + bw, top)], shade)
            for wy in np.arange(top + 6, hy - 4, 7 + layer * 2):
                for wx in np.arange(x + 3, x + bw - 3, 6 + layer * 2):
                    if g.random() < 0.12 + layer * 0.06:
                        c.rect(wx, wy, wx + 2 + layer, wy + 2 + layer, g.uniform(120, 230))
            x += bw + g.uniform(0, 6)
    # water
    c.rect(0, hy, w, h, 6)
    city = c.arr()
    refl = np.zeros_like(city)
    top_part = city[: int(hy)][::-1]
    n = min(h - int(hy), top_part.shape[0])
    refl[int(hy):int(hy) + n] = top_part[:n]
    # waves: shift rows
    for y in range(int(hy), h):
        sh = int(np.sin(y * 0.35) * 6 + g.normal(0, 3))
        refl[y] = np.roll(refl[y], sh)
    refl = vblur(hblur(refl, 6), 6) * 0.75
    img = city.copy()
    img[int(hy):] = city[int(hy):] + refl[int(hy):]
    # suspension bridge foreground
    bc = Canvas(w, h)
    tx = w * 0.18
    tower_top = h * 0.08
    bc.rect(tx - w * 0.055, tower_top, tx + w * 0.055, h, 255)
    for ax in (-0.03, 0.03):
        bc.rect(tx + w * ax - w * 0.012, h * 0.2, tx + w * ax + w * 0.012, h * 0.4, 0)
        bc.ellipse(tx + w * ax - w * 0.012, h * 0.19, tx + w * ax + w * 0.012, h * 0.23, 0)
    deck_y = h * 0.78
    bc.rect(0, deck_y, w, deck_y + h * 0.05, 255)
    # main cable arc
    xs = np.linspace(tx, w * 1.1, 200)
    t = (xs - tx) / (w * 1.1 - tx)
    ys = tower_top + 20 + (deck_y - tower_top - 40) * (np.sin(t * np.pi) ** 0.9)
    bc.line(list(zip(xs, ys)), 255, 6)
    xs2 = np.linspace(-w * 0.2, tx, 80)
    t2 = (xs2 + w * 0.2) / (tx + w * 0.2)
    ys2 = tower_top + 20 + (deck_y - tower_top - 40) * (np.sin((1 - t2) * np.pi / 2) ** 1.2)
    bc.line(list(zip(xs2, ys2)), 255, 6)
    for x, y in zip(xs[::5], ys[::5]):
        bc.line([(x, y), (x, deck_y)], 255, 1.2)
    # diagonal stays
    for k in range(10):
        bc.line([(tx, tower_top + 40), (tx + w * 0.07 * (k + 1), deck_y)], 255, 1.1)
    bridge = bc.arr()
    img = img * (1 - bridge) + bridge * 0.01
    img = glow(img, 0.5, 6, 0.6)
    save(finish(img, g, contrast=1.25, vig=0.55, grain_amt=0.07), name)


# ---------------------------------------------------------------- fire escape
def fire_escape(name: str, w: int, h: int, seed: int):
    g = rng(seed)
    c = Canvas(w, h, ss=1)
    bw, bh = 54, 18
    for row in range(h // bh + 2):
        off = (row % 2) * bw / 2
        for col in range(-1, w // bw + 2):
            x = col * bw + off
            y = row * bh
            c.rect(x + 2, y + 2, x + bw - 2, y + bh - 2, g.uniform(70, 125))
    wall = c.arr() + (fbm(w, h, g, 260, 5) - 0.5) * 0.25
    # windows
    wc = Canvas(w, h)
    win_cols = [w * 0.12, w * 0.62]
    floor_h = h * 0.3
    for fl in range(-1, 4):
        top = fl * floor_h + h * 0.06
        for x in win_cols:
            wc.rect(x - 10, top - 10, x + w * 0.24 + 10, top + 2, 255)  # lintel
            wc.rect(x, top, x + w * 0.24, top + floor_h * 0.62, 128)
            wc.rect(x - 14, top + floor_h * 0.62, x + w * 0.24 + 14, top + floor_h * 0.62 + 16, 255)
    wins = wc.arr()
    lintel = (wins > 0.9).astype(np.float32)
    glass = ((wins > 0.4) & (wins < 0.6)).astype(np.float32)
    img = wall * (1 - glass) + glass * (0.05 + fbm(w, h, g, 120, 3) * 0.12) + lintel * 0.25
    img = np.where(lintel > 0.5, 0.62 + (fbm(w, h, g, 40, 3) - 0.5) * 0.2, img)
    # one lit window
    lw = np.zeros_like(img)
    x0, y0 = int(win_cols[1]), int(1 * floor_h + h * 0.06)
    lw[y0:y0 + int(floor_h * 0.62), x0:x0 + int(w * 0.24)] = 0.85
    img = np.maximum(img, lw)

    # fire escape geometry
    fe = Canvas(w, h)
    left, right = w * 0.06, w * 0.94
    for fl in range(0, 4):
        y = fl * floor_h + h * 0.06 + floor_h * 0.66
        fe.rect(left, y, right, y + 10, 255)  # platform
        fe.rect(left, y - floor_h * 0.28, right, y - floor_h * 0.28 + 6, 255)  # top rail
        fe.rect(left, y - floor_h * 0.14, right, y - floor_h * 0.14 + 3, 255)
        for x in np.arange(left, right, 26):
            fe.rect(x, y - floor_h * 0.28, x + 3, y, 255)
        # stairs between floors
        sx0, sx1 = (w * 0.38, w * 0.62) if fl % 2 else (w * 0.62, w * 0.38)
        ny = y + floor_h
        fe.line([(sx0, y + 8), (sx1, ny)], 255, 9)
        fe.line([(sx0, y - floor_h * 0.25), (sx1, ny - floor_h * 0.25)], 255, 4)
        steps = 14
        for k in range(steps):
            t = k / steps
            px = lerp(sx0, sx1, t)
            py = lerp(y + 8, ny, t)
            fe.line([(px, py), (px, py - floor_h * 0.25)], 255, 2)
    esc = fe.arr()
    # hard cast shadow from a street lamp below-left
    shadow_img = Image.fromarray((esc * 255).astype(np.uint8)).transform(
        (w, h), Image.AFFINE, (1, 0.35, -60, 0, 1, -40), resample=Image.BILINEAR)
    shadow = blur(to_arr(shadow_img), 2.5)
    light = np.clip(np.linspace(1.2, 0.35, w)[None, :] * np.linspace(0.6, 1.2, h)[:, None], 0, 1.3)
    img = img * light * (1 - shadow * 0.75)
    img = img * (1 - esc) + esc * 0.03
    save(finish(img, g, contrast=1.45, vig=0.5, grain_amt=0.07), name)


# ---------------------------------------------------------------- water towers
def water_towers(name: str, w: int, h: int, seed: int):
    g = rng(seed)
    yy = np.linspace(0, 1, h)[:, None] * np.ones((1, w))
    sky = 0.9 - 0.75 * (1 - yy) ** 1.6 + (fbm(w, h, g, 700, 4) - 0.5) * 0.1
    c = Canvas(w, h)
    roof = h * 0.78
    c.rect(0, roof, w * 0.45, h, 255)
    c.rect(w * 0.45, roof + h * 0.05, w, h, 255)
    c.rect(w * 0.7, roof - h * 0.1, w * 0.78, roof + 10, 255)  # bulkhead

    def tower(x, base, tw, th):
        legs_h = th * 0.45
        tank_top = base - legs_h - th
        for lx in (x + tw * 0.08, x + tw * 0.5 - 4, x + tw * 0.92 - 8):
            c.rect(lx, base - legs_h, lx + 8, base, 255)
        c.line([(x + tw * 0.08, base - legs_h), (x + tw * 0.92, base - 4)], 255, 3)
        c.line([(x + tw * 0.92, base - legs_h), (x + tw * 0.08, base - 4)], 255, 3)
        c.rect(x, tank_top, x + tw, base - legs_h, 255)
        c.poly([(x - tw * 0.04, tank_top + 2), (x + tw * 0.5, tank_top - th * 0.42), (x + tw * 1.04, tank_top + 2)], 255)
        c.rect(x + tw * 0.48, tank_top - th * 0.5, x + tw * 0.52, tank_top - th * 0.4, 255)
        # ladder
        c.line([(x + tw * 0.8, base), (x + tw * 0.8, tank_top)], 255, 2)

    tower(w * 0.12, roof, w * 0.17, h * 0.3)
    tower(w * 0.56, roof + h * 0.05, w * 0.09, h * 0.16)
    # antennas
    for ax in (w * 0.4, w * 0.86):
        c.line([(ax, roof), (ax, roof - h * 0.35)], 255, 3)
        for k in range(4):
            yk = roof - h * 0.3 + k * 18
            c.line([(ax - 30 + k * 5, yk), (ax + 30 - k * 5, yk)], 255, 2)
    # birds
    for _ in range(9):
        bx, by = g.uniform(0.5, 0.95) * w, g.uniform(0.08, 0.35) * h
        s = g.uniform(6, 12)
        c.line([(bx - s, by - s * 0.4), (bx, by), (bx + s, by - s * 0.4)], 255, 2)
    sil = c.arr()
    img = sky * (1 - sil) + sil * 0.02
    save(finish(img, g, contrast=1.35, gamma=1.1, vig=0.45, grain_amt=0.075), name)


# ---------------------------------------------------------------- subway tiles mosaic
def tiles(name: str, w: int, h: int, seed: int, label: str = "22 SIDE ST"):
    g = rng(seed)
    tw, th = 18, 9
    cols, rows = w // tw + 1, h // th + 1
    # mosaic mask for the sign
    sign_h_rows, sign_w_cols = 30, int(cols * 0.74)
    sx0, sy0 = (cols - sign_w_cols) // 2, int(rows * 0.36)
    txt = Image.new("L", (sign_w_cols * 8, (sign_h_rows - 8) * 4), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(txt)
    fnt = font("Anton.ttf", int((sign_h_rows - 8) * 4 * 0.95))
    bbox = d.textbbox((0, 0), label, font=fnt)
    tx = (txt.width - (bbox[2] - bbox[0])) // 2 - bbox[0]
    d.text((tx, -bbox[1] + 0), label, font=fnt, fill=255)
    txt = txt.resize((sign_w_cols, sign_h_rows - 8), Image.BOX)
    tm = np.asarray(txt) > 110
    c = Canvas(w, h, ss=1, fill=60)
    for r in range(rows):
        for col in range(cols):
            x, y = col * tw, r * th
            v = g.uniform(175, 215)
            in_sign = sx0 <= col < sx0 + sign_w_cols and sy0 <= r < sy0 + sign_h_rows
            if in_sign:
                lr, lc = r - sy0, col - sx0
                border = lr < 2 or lr >= sign_h_rows - 2 or lc < 3 or lc >= sign_w_cols - 3
                checker = (lr + lc) % 2 == 0
                if border:
                    v = 40 if checker else 150
                else:
                    tr, tcx = lr - 4, lc
                    v = 225
                    if 0 <= tr < tm.shape[0] and tm[tr, tcx]:
                        v = 18
            c.rect(x + 1.5, y + 1.5, x + tw - 1.5, y + th - 1.5, v)
    img = c.arr()
    grime = fbm(w, h, g, 300, 6)
    drip = vblur(np.clip(value_noise(w, h, 18, g) - 0.55, 0, 1), 30) * 1.4
    img = img * (0.62 + grime * 0.5) - drip * 0.35
    light = radial(w, h, w * 0.3, -h * 0.2, w * 1.2) * 0.6 + 0.45
    img = img * light
    save(finish(img, g, contrast=1.3, vig=0.6, grain_amt=0.06), name)


# ---------------------------------------------------------------- chain link + bokeh
def chainlink(name: str, w: int, h: int, seed: int):
    g = rng(seed)
    bk = Canvas(w, h)
    acc = Canvas(w, h)
    for _ in range(70):
        x, y = g.uniform(0, w), g.uniform(0.1, 0.9) * h
        r = g.uniform(20, 90)
        bk.ellipse(x - r, y - r, x + r, y + r, g.uniform(40, 200))
    for _ in range(4):
        x, y = g.uniform(0.1, 0.9) * w, g.uniform(0.2, 0.8) * h
        r = g.uniform(30, 70)
        acc.ellipse(x - r, y - r, x + r, y + r, 220)
    bok = blur(bk.arr(), 10) * 0.8 + 0.04
    accent = blur(acc.arr(), 10) * 0.85
    fc = Canvas(w, h)
    s = 70
    for k in range(-h // s - 2, w // s + h // s + 4):
        x0 = k * s
        pts = []
        for j in range(0, h // (s // 2) + 3):
            pts.append((x0 + (j % 2) * s * 0.5 - j * 0.0, j * s * 0.5))
        fc.line([(x0, 0), (x0 + h, h)], 255, 4)
        fc.line([(x0, 0), (x0 - h, h)], 255, 4)
    fence = fc.arr()
    img = bok * (1 - fence) + fence * 0.02
    rim = np.clip(blur(fence, 1.5) - fence, 0, 1)
    img += rim * 0.25
    accent = accent * (1 - fence)
    save(finish(img, g, contrast=1.2, vig=0.6, grain_amt=0.07, accent=accent), name)


# ---------------------------------------------------------------- concrete
def concrete(name: str, w: int, h: int, seed: int, base: float = 0.42):
    g = rng(seed)
    n = fbm(w, h, g, 500, 7) * 0.35 + fbm(w, h, g, 60, 4) * 0.4 + value_noise(w, h, 3, g) * 0.25
    pits = (g.random((h, w)) > 0.993).astype(np.float32)
    pits = blur(pits, 1.0) * 5
    img = base + (n - 0.5) * 0.45 - pits * 0.25
    stains = vblur(np.clip(fbm(w, h, g, 200, 4) - 0.55, 0, 1), 20) * 1.2
    img -= stains * 0.4
    # formwork seams
    for x in (w * 0.33, w * 0.71):
        img[:, int(x):int(x) + 3] *= 0.6
    img[int(h * 0.55):int(h * 0.55) + 3, :] *= 0.65
    save(finish(img, g, contrast=1.1, vig=0.4, grain_amt=0.05), name)


if __name__ == "__main__":
    street_night("scene-street-night.jpg", 2400, 1500, 11)
    street_night("scene-street-figure.jpg", 2400, 1500, 12, figure=True)
    street_night("scene-street-portrait.jpg", 1400, 2000, 13, figure=True)
    subway("scene-subway.jpg", 2400, 1500, 21)
    skyline("scene-skyline-bridge.jpg", 2400, 1500, 31)
    fire_escape("scene-fire-escape.jpg", 1400, 1900, 41)
    water_towers("scene-water-towers.jpg", 2000, 1400, 51)
    tiles("scene-tiles-22side.jpg", 2200, 1300, 61)
    chainlink("scene-chainlink.jpg", 2000, 1300, 71)
    concrete("texture-concrete.jpg", 2000, 1300, 81)
    concrete("texture-asphalt.jpg", 1600, 1600, 82, base=0.18)
