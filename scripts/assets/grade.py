"""Grade AI-generated stills to the 22SIDE palette: muted, near-monochrome,
reds preserved as the only accent. Usage: grade.py SRC DST [sat]"""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
sat = float(sys.argv[3]) if len(sys.argv) > 3 else 0.28
img = Image.open(src).convert("RGB")
# trim baked-in pillarbox / letterbox bars
a = np.asarray(img, dtype=np.float32).max(axis=2)
cols = np.where(np.percentile(a, 98, axis=0) > 28)[0]
rows = np.where(np.percentile(a, 98, axis=1) > 28)[0]
if len(cols) and len(rows):
    img = img.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1))
hsv = np.asarray(img.convert("HSV"), dtype=np.float32) / 255.0
h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
red = ((h < 0.045) | (h > 0.94)) & (s > 0.35) & (v > 0.2)
s2 = np.where(red, np.clip(s * 1.0, 0, 1), s * sat)
# gentle S-curve on value
v2 = np.clip(0.5 + (v - 0.5) * 1.12, 0, 1)
out = Image.fromarray((np.dstack([h, s2, v2]) * 255).astype(np.uint8), "HSV").convert("RGB")
out.save(dst, "WEBP", quality=80, method=6)
print(dst, out.size)
