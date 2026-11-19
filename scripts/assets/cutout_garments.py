"""Cut the real garments out of the brand photos (rembg u2net_cloth_seg, runs
locally, original pixels kept) and hang them on a drawn metal hanger for the
virtual store walls. Output: public/media/products/{slug}-hanging.webp
Usage: python cutout_garments.py UPLOAD_DIR   (needs `pip install rembg[cpu]`)"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps
from rembg import new_session
from scipy import ndimage

src = sys.argv[1]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
out = os.path.join(root, "public", "media", "products")
debug = None

# slug -> (source, part, mask index, keep box (y0, y1[, x0, x1]) as fractions of the image)
# source: upload key (8 hex) or a file in public/media/products/real (crops of low-res shots)
# part: 0 upper garment (shirt hanger) · 1 lower garment (clip hanger)
# mask: u2net_cloth_seg output 0 upper · 1 lower · 2 full body
JOBS = {
    "cash-mouth-layered-tee": ("26ab1d47", 0, 0, None),
    "chase-light-longsleeve": ("38505142", 0, 0, None),
    "heaven-tee": ("88162143", 0, 0, None),
    "rise-with-faith-tee": ("06ebfc37", 0, 0, None),
    "cash-grill-tee": ("8da8cf47", 0, 0, None),
    "eternity-tee": ("5a65e8b2", 0, 0, None),
    "cash-lips-longsleeve": ("f508778c", 0, 0, None),
    "baggy-jeans-washed-black": ("46c14418", 1, 1, (0.0, 0.93, 0.0, 1.0)),
    "wide-sweatpants-black": ("ead23868", 1, 0, (0.585, 1.0, 0.0, 1.0)),
    "baggy-jeans-vintage-blue": ("6671a446", 1, 1, None),
    "cargo-jacket-black": ("b427a1cb", 0, 0, None),
    "cargo-pant-black": ("1ab5216d", 1, 1, None),
    "faded-zip-hoodie-grey": ("real:faded-zip-hoodie-1.webp", 0, 0, None),
    "faded-sweatpants-grey": ("real:faded-sweatpants-1.webp", 1, 1, (0.0, 1.0, 0.0, 0.8)),
}
DARK = {"baggy-jeans-washed-black": 125}
files = {f.split("-")[0]: os.path.join(src, f) for f in os.listdir(src)}
session = new_session("u2net_cloth_seg")
cache = {}

only = set(sys.argv[3:]) if len(sys.argv) > 3 else None
for slug, (key, part, mi, rows) in JOBS.items():
    if only and slug not in only:
        continue
    if key not in cache:
        path = os.path.join(root, "public", "media", "products", "real", key[5:]) if key.startswith("real:") else files[key]
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        cache[key] = (im, session.predict(im))
    im, masks = cache[key]
    m = np.asarray(masks[mi].convert("L").resize(im.size)).astype(np.float32) / 255
    if rows:
        h = m.shape[0]
        m[: int(rows[0] * h)] = 0
        m[int(rows[1] * h):] = 0
        if len(rows) == 4:
            w = m.shape[1]
            m[:, : int(rows[2] * w)] = 0
            m[:, int(rows[3] * w):] = 0
    # keep the largest blob only, clean edges
    m = (m > 0.5).astype(np.uint8)
    if slug in DARK:  # dark garment: drop light background caught by the mask (pavement, wall)
        lum = np.asarray(im.convert("L")).astype(np.float32)
        m = m * (lum < DARK[slug]).astype(np.uint8)
        m = ndimage.binary_opening(m, iterations=2).astype(np.uint8)
    lab, n = ndimage.label(m)
    if n > 1:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = (lab == (np.argmax(sizes) + 1)).astype(np.uint8)
    if slug not in DARK:
        m = ndimage.binary_fill_holes(m).astype(np.uint8)
    alpha = Image.fromarray(m * 255).filter(ImageFilter.GaussianBlur(1.2))
    rgba = im.copy()
    rgba.putalpha(alpha)
    bbox = alpha.getbbox()
    g = rgba.crop(bbox)
    gw, gh = g.size
    # canvas with room for the hanger above
    pad_top = int(gw * (0.28 if part == 0 else 0.22))
    W, H = gw + 40, gh + pad_top + 20
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    metal = (34, 34, 36, 255)
    cx = W // 2
    top_y = pad_top
    lw = max(6, gw // 90)
    if part == 0:
        d.line([(cx - gw * 0.36, top_y + gw * 0.07), (cx, top_y - gw * 0.02), (cx + gw * 0.36, top_y + gw * 0.07)], fill=metal, width=lw, joint="curve")
    else:
        d.line([(cx - gw * 0.4, top_y - 4), (cx + gw * 0.4, top_y - 4)], fill=metal, width=lw)
        for x in (cx - gw * 0.3, cx + gw * 0.3):
            d.rectangle([x - lw * 2, top_y - lw * 2, x + lw * 2, top_y + lw * 3], fill=metal)
    hook_base = top_y - (gw * 0.02 if part == 0 else 4)
    d.line([(cx, hook_base), (cx, hook_base - pad_top * 0.35)], fill=metal, width=lw)
    r = pad_top * 0.22
    hy = hook_base - pad_top * 0.35 - r
    d.arc([cx - r, hy - r, cx + r, hy + r], start=0, end=230, fill=metal, width=lw)
    c.alpha_composite(g, (20, pad_top))
    c.thumbnail((700, 900), Image.LANCZOS)
    c.save(os.path.join(out, f"{slug}-hanging.webp"), "WEBP", quality=86, method=6)
    print("ok", slug, c.size)
