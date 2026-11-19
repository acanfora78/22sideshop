"""Import the official 22SIDE product photos (shot by the brand) into
public/media/products/real as web-ready 3:4 WebP (1200x1600).
Usage: python3 -I import_photos.py UPLOAD_DIR"""
import os, sys
import numpy as np
from PIL import Image, ImageOps

src = sys.argv[1]
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "media", "products", "real")
os.makedirs(out, exist_ok=True)

# upload file -> output name
MAP = {
    "26ab1d47": "cash-mouth-layered-tee-1",
    "38505142": "chase-light-longsleeve-1",
    "88162143": "heaven-tee-1",
    "ead23868": "heaven-tee-2",
    "06ebfc37": "rise-with-faith-tee-1",
    "8da8cf47": "cash-grill-tee-1",
    "5de273b7": "cash-grill-tee-2",
    "5a65e8b2": "eternity-tee-1",
    "9637be26": "eternity-tee-2",
    "a998b904": "eternity-tee-back",
    "f508778c": "cash-lips-longsleeve-1",
    "46c14418": "baggy-jeans-washed-black-1",
    "4c04c8c1": "wide-sweatpants-black-1",
    "6671a446": "baggy-jeans-vintage-blue-1",
    "b427a1cb": "cargo-jacket-black-1",
    "a602d84a": "cargo-set-black-full",
    "a660bbe2": "cargo-set-black-back",
    "1ab5216d": "cargo-pant-black-1",
    "e7e19482": "faded-set-grey-full",
}

def fit34(im):
    return ImageOps.fit(im, (1200, 1600), Image.LANCZOS, centering=(0.5, 0.45))

for f in os.listdir(src):
    key = f.split("-")[0]
    if key not in MAP:
        continue
    im = ImageOps.exif_transpose(Image.open(os.path.join(src, f))).convert("RGB")
    a = np.asarray(im).astype(np.float32).max(axis=2)
    rows = np.where(np.percentile(a, 95, axis=1) > 20)[0]
    if len(rows):  # trim phone-screenshot black bars
        im = im.crop((0, int(rows[0]), im.width, int(rows[-1]) + 1))
    name = MAP[key]
    if name == "faded-set-grey-full":
        # screenshot: drop the dark status strip left above the photo
        a2 = np.asarray(im).astype(np.float32).mean(axis=(1, 2))
        top = int(np.argmax(a2 > 60))
        im = im.crop((0, top, im.width, im.height))
        w, h = im.size
        cx = 0.47 * w  # the model stands slightly left of centre
        def box(y0, y1):
            hh = (y1 - y0) * h
            ww = hh * 3 / 4
            return (int(cx - ww / 2), int(y0 * h), int(cx + ww / 2), int(y1 * h))
        ImageOps.fit(im.crop(box(0.36, 0.72)), (1200, 1600), Image.LANCZOS).save(os.path.join(out, "faded-zip-hoodie-1.webp"), quality=84)
        ImageOps.fit(im.crop(box(0.55, 1.0)), (1200, 1600), Image.LANCZOS).save(os.path.join(out, "faded-sweatpants-1.webp"), quality=84)
    fit34(im).save(os.path.join(out, name + ".webp"), quality=84)
    print("ok", name)
