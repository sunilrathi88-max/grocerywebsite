"""
Rathi Naturals - Masala Duo Composite
Creates a professional side-by-side product image of Chai Masala + Garam Masala
on a pure white 2000x2000px background with drop shadows.
"""

from PIL import Image, ImageFilter, ImageDraw
import numpy as np
import os

# ── Paths ───────────────────────────────────────────────────────────────────
BRAIN_DIR = r"C:\Users\shubh\.gemini\antigravity\brain\6ecb290e-970a-485a-a362-0622ef5aff85"
CHAI_PATH   = os.path.join(BRAIN_DIR, "uploaded_media_1772558511375.jpg")   # Chai Masala
GARAM_PATH  = os.path.join(BRAIN_DIR, "media__1772558501654.jpg")           # Garam Masala
OUT_PATH    = os.path.join(BRAIN_DIR, "rathi_naturals_chai_garam_duo.png")

# ── Canvas settings ──────────────────────────────────────────────────────────
CANVAS_SIZE  = 2000           # square canvas (px)
BG_COLOR     = (255, 255, 255)
GAP          = 60             # gap between the two pouches (px)
PADDING      = 60             # outer padding each side (px)
BOTTOM_PAD   = 0              # extra bottom space for shadow

# ── Drop-shadow settings ─────────────────────────────────────────────────────
SHADOW_OFFSET = (0, 18)       # (x, y) offset
SHADOW_BLUR   = 22
SHADOW_ALPHA  = 90            # 0-255 (subtle)


def crop_to_pouch(img: Image.Image, threshold: int = 240) -> Image.Image:
    """Remove white/near-white background and return a tight crop of the pouch."""
    rgba = img.convert("RGBA")
    data = np.array(rgba)
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

    # Pixels that are NOT white background → keep
    mask = ~((r > threshold) & (g > threshold) & (b > threshold))

    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)

    if not rows.any() or not cols.any():
        return img  # nothing to crop

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    # Small margin so we don't clip bag edges
    margin = 6
    rmin = max(0, rmin - margin)
    rmax = min(data.shape[0] - 1, rmax + margin)
    cmin = max(0, cmin - margin)
    cmax = min(data.shape[1] - 1, cmax + margin)

    cropped = rgba.crop((cmin, rmin, cmax + 1, rmax + 1))

    # Build alpha mask: white pixels become transparent
    arr = np.array(cropped)
    white = (arr[:, :, 0] > threshold) & (arr[:, :, 1] > threshold) & (arr[:, :, 2] > threshold)
    arr[:, :, 3] = np.where(white, 0, 255)
    return Image.fromarray(arr, "RGBA")


def make_drop_shadow(img: Image.Image) -> Image.Image:
    """Create a soft drop shadow layer for a transparent-background image."""
    shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    alpha = img.split()[3]

    # Build a solid-coloured silhouette using the alpha
    silhouette = Image.new("RGBA", img.size, (0, 0, 0, SHADOW_ALPHA))
    silhouette.putalpha(alpha)

    shadow_layer.paste(silhouette, (0, 0))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(SHADOW_BLUR))
    return shadow_layer


def composite():
    print("Loading images…")
    chai  = crop_to_pouch(Image.open(CHAI_PATH).convert("RGBA"))
    garam = crop_to_pouch(Image.open(GARAM_PATH).convert("RGBA"))

    # ── Scale both pouches to fit in available height ─────────────────────────
    available_h = CANVAS_SIZE - PADDING * 2 - BOTTOM_PAD
    available_w_each = (CANVAS_SIZE - PADDING * 2 - GAP) // 2

    def fit(img, max_w, max_h):
        w, h = img.size
        scale = min(max_w / w, max_h / h)
        return img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    chai  = fit(chai,  available_w_each, available_h)
    garam = fit(garam, available_w_each, available_h)

    # ── Align both to same height (baseline-bottom) ───────────────────────────
    max_h = max(chai.size[1], garam.size[1])

    # ── Canvas ────────────────────────────────────────────────────────────────
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), BG_COLOR + (255,))

    # Vertical center both pouches in the canvas
    total_used_h = max_h
    v_offset = (CANVAS_SIZE - total_used_h) // 2

    # Left pouch: Chai Masala
    cx = PADDING + (available_w_each - chai.size[0]) // 2
    cy = v_offset + (max_h - chai.size[1])            # baseline-align + centered

    # Right pouch: Garam Masala
    gx = PADDING + available_w_each + GAP + (available_w_each - garam.size[0]) // 2
    gy = v_offset + (max_h - garam.size[1])           # baseline-align + centered

    # Add drop shadows first (under the pouches)
    for img, (px, py) in [(chai, (cx, cy)), (garam, (gx, gy))]:
        shadow = make_drop_shadow(img)
        sx = px + SHADOW_OFFSET[0]
        sy = py + SHADOW_OFFSET[1]
        # Expand canvas temp layer to fit shadow
        temp = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        temp.paste(shadow, (sx, sy), shadow)
        canvas = Image.alpha_composite(canvas, temp)

    # Paste pouches on top
    for img, (px, py) in [(chai, (cx, cy)), (garam, (gx, gy))]:
        temp = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
        temp.paste(img, (px, py), img)
        canvas = Image.alpha_composite(canvas, temp)

    # ── Save ─────────────────────────────────────────────────────────────────
    out = canvas.convert("RGB")
    out.save(OUT_PATH, "PNG", dpi=(300, 300))
    print(f"✅ Saved: {OUT_PATH}")
    print(f"   Canvas: {CANVAS_SIZE}×{CANVAS_SIZE}px")
    print(f"   Chai Masala  → {chai.size[0]}×{chai.size[1]}px  at ({cx},{cy})")
    print(f"   Garam Masala → {garam.size[0]}×{garam.size[1]}px at ({gx},{gy})")


if __name__ == "__main__":
    composite()
