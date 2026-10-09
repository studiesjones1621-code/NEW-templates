#!/usr/bin/env python3
"""Turn generated images into transparent WebP layers for scroll scenes. Needs Pillow + numpy.

Generate the source with gen_images.py first, asking for an isolated subject:
  - soft subjects (clouds, smoke, mist, light): "isolated on a pure solid black background"
  - solid subjects (a plane, car, product, tool):  "on a perfectly flat solid pure green (#00FF00) chroma-key
    background, no shadow" (a black background fails for dark subjects)

Usage:
  python3 -I alpha_tools.py key-green   <in> <out.webp> [--width 1200]
  python3 -I alpha_tools.py soft-black  <in> <out.webp> [--solid-below] [--tint "#FAF6EB"] [--shadow "#9E9185"] [--warm "#FFDB9E"]

key-green  : chroma key + green despill + crop to the subject. Clean edges on dark and light pages.
soft-black : alpha from brightness, re-coloured on a shadow→tint ramp (plus a warm highlight) so the layer
             matches the page palette instead of reading as grey. Edges fade toward the tint, so there are
             no dark outlines over light backgrounds. --solid-below fills holes inside dense masses (a cloud
             bank) so it can fully cover the screen.
Check results composited on BOTH the dark and the light page colour before using them.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter


def hex_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


def arg(name, default):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default


def key_green(src, dst, width):
    a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    alpha = 1 - np.clip((g - np.maximum(r, b) - 0.08) / 0.25, 0, 1)
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255
    g = np.minimum(g, np.maximum(r, b) + 0.02)  # despill
    img = Image.fromarray((np.clip(np.dstack([r, g, b, alpha]), 0, 1) * 255).astype(np.uint8), "RGBA")
    box = img.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    img = img.crop((max(box[0] - 12, 0), max(box[1] - 12, 0), min(box[2] + 12, img.width), min(box[3] + 12, img.height)))
    img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(dst, "WEBP", quality=88, method=6)
    return img.size


def soft_black(src, dst, solid_below, tint, shadow, warm, width=1920):
    im = Image.open(src).convert("RGB")
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    lum, mx = a.mean(axis=2), a.max(axis=2)
    # dense masses key from a low threshold; wispy layers need a higher one and a lighter shadow tone
    alpha = np.clip((mx - 0.05) / 0.30, 0, 1) if solid_below else np.clip((mx - 0.08) / 0.52, 0, 1)
    if not solid_below:
        shadow = shadow * 0.7 + tint * 0.3
    if solid_below:
        top = np.argmax(alpha > 0.6, axis=0)
        ramp = np.clip((np.arange(alpha.shape[0])[:, None] - (top[None, :] + 40)) / 80, 0, 1)
        alpha = np.maximum(alpha, ramp)
    else:
        alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255
    m = alpha > 0.5
    lo, hi = np.percentile(lum[m], 5), np.percentile(lum[m], 98)
    s = np.clip((lum - lo) / (hi - lo + 1e-3), 0, 1)
    if not solid_below:
        s = s * alpha ** 2 + (1 - alpha ** 2)  # thin edges stay light
    s = s[..., None]
    rgb = shadow * (1 - s) + tint * s
    rgb = rgb * (1 - 0.22 * s ** 3) + warm * 0.22 * s ** 3
    Image.fromarray((np.dstack([np.clip(rgb, 0, 1), alpha]) * 255).astype(np.uint8), "RGBA").save(dst, "WEBP", quality=82, method=6)
    return im.size


if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    mode, src, dst = sys.argv[1:4]
    if mode == "key-green":
        print(key_green(src, dst, int(arg("--width", 1200))))
    elif mode == "soft-black":
        print(soft_black(src, dst, "--solid-below" in sys.argv, hex_rgb(arg("--tint", "#FAF6EB")),
                         hex_rgb(arg("--shadow", "#9E9185")), hex_rgb(arg("--warm", "#FFDB9E"))))
    else:
        sys.exit(__doc__)
