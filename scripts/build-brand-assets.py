#!/usr/bin/env python3
"""
Build the ALTRA BUILD vector brand kit from the supplied source lockup.

Source artwork: brand/altra-build-source.png — a flat three-colour bitmap
(alabaster paper, signal gold, obsidian ink). Everything below is derived from
that one file so the identity stays pixel-faithful:

  public/brand/altra-mark.svg            standalone rhino emblem (badge)
  public/brand/altra-mark-inverse.svg    emblem for obsidian surfaces
  public/brand/altra-mark-mono-*.svg     single-colour emblem (stamps, print)
  public/brand/altra-wordmark.svg        "altra build" lettering only
  public/brand/altra-logo.svg            full horizontal lockup
  public/brand/altra-logo-inverse.svg    full lockup for dark surfaces
  public/brand/altra-logo-mono-*.svg     single-colour lockup

Raster exports (PNG, favicons, social card) are produced by
scripts/render-brand.mjs using libvips/sharp.

Usage:  python3 scripts/build-brand-assets.py
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import potrace
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "brand" / "altra-build-source.png"
BRAND = ROOT / "public" / "brand"

CREAM = (255, 243, 231)
GOLD = (247, 188, 50)
INK = (28, 28, 38)

PALETTE = {
    "cream": "#FFF3E7",
    "gold": "#F7BC32",
    "ink": "#1C1C26",
    "inkSoft": "#262633",
    "concrete": "#8C8577",
    "hazard": "#E05A1B",
}

UPSCALE = 6  # supersample mask before tracing → smoother béziers

BRAND.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def classify(arr: np.ndarray) -> np.ndarray:
    """0 = paper, 1 = gold, 2 = ink, by nearest palette entry."""
    palette = np.array([CREAM, GOLD, INK], dtype=float)
    d = np.linalg.norm(arr[:, :, None, :] - palette[None, None, :, :], axis=3)
    return np.argmin(d, axis=2)


def trace(mask: np.ndarray, scale: int = UPSCALE, turd: int = 10) -> str:
    """Vectorise a boolean mask into SVG path data in original coordinates."""
    h, w = mask.shape
    img = Image.fromarray((mask * 255).astype(np.uint8), "L")
    img = img.resize((w * scale, h * scale), Image.LANCZOS)
    img = img.filter(ImageFilter.GaussianBlur(radius=scale * 0.4))
    img = img.point(lambda v: 255 if v >= 133 else 0)
    arr = np.array(img) > 127

    # potracer inverts its bitmap internally (True = paper), so feed the complement.
    path = potrace.Bitmap(~arr).trace(
        turdsize=turd * scale,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
        alphamax=1.334,
        opticurve=True,
        opttolerance=0.8,
    )

    out: list[str] = []
    for curve in path:
        s = curve.start_point
        out.append(f"M{s.x / scale:.2f},{s.y / scale:.2f}")
        for seg in curve:
            if seg.is_corner:
                c, e = seg.c, seg.end_point
                out.append(f"L{c.x / scale:.2f},{c.y / scale:.2f}L{e.x / scale:.2f},{e.y / scale:.2f}")
            else:
                c1, c2, e = seg.c1, seg.c2, seg.end_point
                out.append(
                    f"C{c1.x / scale:.2f},{c1.y / scale:.2f} "
                    f"{c2.x / scale:.2f},{c2.y / scale:.2f} "
                    f"{e.x / scale:.2f},{e.y / scale:.2f}"
                )
        out.append("Z")
    return "".join(out)


def path(fill: str, d: str, opacity: float = 1) -> str:
    if not d:
        return ""
    extra = f' opacity="{opacity}"' if opacity < 1 else ""
    return f'  <path fill="{fill}" fill-rule="evenodd"{extra} d="{d}"/>'


def doc(width: float, height: float, title: str, body: list[str]) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.2f} {height:.2f}" '
        f'width="{width:.0f}" height="{height:.0f}" role="img" aria-label="{title}">\n'
        f"  <title>{title}</title>\n"
        + "\n".join(b for b in body if b)
        + "\n</svg>\n"
    )


# --------------------------------------------------------------------------- #
# Analyse the source
# --------------------------------------------------------------------------- #
src = Image.open(SOURCE).convert("RGB")
arr = np.asarray(src).astype(int)
paper = np.array(src.getpixel((2, 2)))
matter = np.abs(arr - paper).sum(axis=2) > 30
ys, xs = np.where(matter)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()

pad = 2
crop = src.crop((x0 - pad, y0 - pad, x1 + pad + 1, y1 + pad + 1))
W, H = crop.size
labels = classify(np.asarray(crop).astype(int))
mask_all = labels != 0
gold = labels == 1
ink = labels == 2

# Split the emblem from the lettering at the widest empty gutter.
cols = np.where(mask_all.any(axis=0))[0]
gaps = [(cols[i], cols[i + 1]) for i in range(len(cols) - 1) if cols[i + 1] - cols[i] > 6]
split = (gaps[0][0] + gaps[0][1]) // 2 if gaps else 80

mark_labels = labels[:, :split]
mark_gold = mark_labels == 1
mark_ink = mark_labels == 2
mark_cream = mark_labels == 0
mark_w = split

word_labels = labels[:, split:]
word_gold = word_labels == 1
word_ink = word_labels == 2
word_w = W - split
word_h = H

# The emblem is a perfect disc: fit a circle to the gold extent for a crisp rim.
gys, gxs = np.where(mark_gold)
cx = (gxs.min() + gxs.max()) / 2
cy = (gys.min() + gys.max()) / 2
r = ((gxs.max() - gxs.min()) + (gys.max() - gys.min())) / 4

yy, xx = np.mgrid[0:H, 0:mark_w]
inside = (yy - cy) ** 2 + (xx - cx) ** 2 <= (r - 0.5) ** 2

mark_d_ink = trace(mark_ink)
mark_d_cream = trace(mark_cream & inside, turd=4)
word_d_ink = trace(word_ink)
word_d_gold = trace(word_gold)

mark_d_solid = trace(mark_gold | mark_ink)


# --------------------------------------------------------------------------- #
# Compose the assets
# --------------------------------------------------------------------------- #
def circle(fill: str) -> str:
    return f'  <circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}"/>'


files: dict[str, str] = {}

# Standalone emblem — true circle rim + traced rhino and ground swoosh.
files["altra-mark.svg"] = doc(
    mark_w, H, "Altra Build emblem",
    [circle(PALETTE["gold"]), path(PALETTE["cream"], mark_d_cream), path(PALETTE["ink"], mark_d_ink)],
)
files["altra-mark-inverse.svg"] = doc(
    mark_w, H, "Altra Build emblem",
    [circle(PALETTE["gold"]), path(PALETTE["inkSoft"], mark_d_cream), path(PALETTE["cream"], mark_d_ink)],
)
files["altra-mark-mono-ink.svg"] = doc(
    mark_w, H, "Altra Build emblem",
    [path(PALETTE["ink"], mark_d_solid)],
)
files["altra-mark-mono-cream.svg"] = doc(
    mark_w, H, "Altra Build emblem",
    [path(PALETTE["cream"], mark_d_solid)],
)

# Lettering.
files["altra-wordmark.svg"] = doc(
    word_w, word_h, "Altra Build wordmark",
    [path(PALETTE["gold"], word_d_gold), path(PALETTE["ink"], word_d_ink)],
)
files["altra-wordmark-inverse.svg"] = doc(
    word_w, word_h, "Altra Build wordmark",
    [path(PALETTE["gold"], word_d_gold), path(PALETTE["cream"], word_d_ink)],
)

# Full horizontal lockups (emblem + lettering, true original proportions).
full_body_light = [
    f'  <g transform="translate(0,0)">{circle(PALETTE["gold"])}'
    f'{path(PALETTE["cream"], mark_d_cream)}{path(PALETTE["ink"], mark_d_ink)}</g>',
    f'  <g transform="translate({mark_w},0)">'
    f'{path(PALETTE["gold"], word_d_gold)}{path(PALETTE["ink"], word_d_ink)}</g>',
]
full_body_dark = [
    f'  <g transform="translate(0,0)">{circle(PALETTE["gold"])}'
    f'{path(PALETTE["inkSoft"], mark_d_cream)}{path(PALETTE["cream"], mark_d_ink)}</g>',
    f'  <g transform="translate({mark_w},0)">'
    f'{path(PALETTE["gold"], word_d_gold)}{path(PALETTE["cream"], word_d_ink)}</g>',
]
full_solid = [
    f'  <g transform="translate(0,0)">{path(PALETTE["ink"], mark_d_solid)}</g>',
    f'  <g transform="translate({mark_w},0)">'
    f'{path(PALETTE["ink"], trace(word_gold | word_ink))}</g>',
]
full_solid_cream = [
    f'  <g transform="translate(0,0)">{path(PALETTE["cream"], mark_d_solid)}</g>',
    f'  <g transform="translate({mark_w},0)">'
    f'{path(PALETTE["cream"], trace(word_gold | word_ink))}</g>',
]

files["altra-logo.svg"] = doc(W, H, "Altra Build", full_body_light)
files["altra-logo-inverse.svg"] = doc(W, H, "Altra Build", full_body_dark)
files["altra-logo-mono-ink.svg"] = doc(W, H, "Altra Build", full_solid)
files["altra-logo-mono-cream.svg"] = doc(W, H, "Altra Build", full_solid_cream)

for name, content in files.items():
    (BRAND / name).write_text(content)
    print(f"saved public/brand/{name:30s} {len(content):>8,} bytes")

(BRAND / "palette.json").write_text(json.dumps(PALETTE, indent=2) + "\n")

meta = {
    "lockup": {"width": int(W), "height": int(H), "ratio": round(W / H, 4)},
    "mark": {"width": int(mark_w), "height": int(H), "circle": {"cx": round(float(cx), 2), "cy": round(float(cy), 2), "r": round(float(r), 2)}},
    "clearspace": "0.5 × emblem diameter",
    "minWidth": {"digital": "28px emblem / 96px lockup", "print": "8mm emblem / 30mm lockup"},
}
(BRAND / "geometry.json").write_text(json.dumps(meta, indent=2) + "\n")
print(json.dumps(meta, indent=2))
