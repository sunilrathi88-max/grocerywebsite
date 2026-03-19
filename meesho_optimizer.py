"""
meesho_optimizer.py
Generates Meesho-compliant listing images from original Rathi Naturals product photos.

What it does:
  1. Opens each original product image
  2. Cleans & pads to pure white 2000x2000 canvas (product fills ~85%)
  3. Applies sharpening + contrast enhancement
  4. Adds a soft realistic drop shadow beneath the pouch
  5. Saves optimised PNGs to Meesho_Images/ with clean names

Requirements: pip install Pillow
"""

import sys
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageChops

# ── Paths ────────────────────────────────────────────────────────────────────
BASE = Path("C:/Users/shubh/grocerywebsite/grocerywebsite")
OUT  = BASE / "Meesho_Images"
OUT.mkdir(exist_ok=True)

# ── Product source images ────────────────────────────────────────────────────
PRODUCTS = [
    {
        "name":  "Turmeric_500g",
        "src":   BASE / "Turmeric_Amazon_Ready_V29.png",
        "slots": {
            "Slot1_Main":       "clean white background, product only",
            "Slot2_Lifestyle":  "warm props background",
        }
    },
    {
        "name": "ChaiMasala_100g",
        "src":  BASE / "Amazon_Final_V3/ChaiMasala_100g_V3.png",
    },
    {
        "name": "GaramMasala_100g",
        "src":  BASE / "Amazon_Final_V3/GaramMasala_100g_V3.png",
    },
]

# ── Config ───────────────────────────────────────────────────────────────────
CANVAS    = 2000          # output canvas size (square)
FILL_PCT  = 0.85          # product fills this fraction of canvas
SHARPNESS = 1.6           # 1.0 = original, >1 = sharper
CONTRAST  = 1.08          # slight contrast boost
SHADOW_BLUR   = 28        # shadow Gaussian blur radius
SHADOW_OFFSET = (0, 32)   # (x, y) shadow offset in pixels
SHADOW_ALPHA  = 130       # 0-255 shadow opacity


def make_white_canvas(size: int) -> Image.Image:
    return Image.new("RGBA", (size, size), (255, 255, 255, 255))


def ensure_white_bg(img: Image.Image) -> Image.Image:
    """Flatten any alpha channel onto white."""
    if img.mode in ("RGBA", "LA"):
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        return bg.convert("RGB")
    return img.convert("RGB")


def fit_product(img: Image.Image, canvas_size: int, fill: float) -> Image.Image:
    """Scale product so its longest dimension = fill * canvas_size, keep ratio."""
    target = int(canvas_size * fill)
    img.thumbnail((target, target), Image.LANCZOS)
    return img


def add_drop_shadow(canvas: Image.Image, product: Image.Image,
                    pos: tuple, offset: tuple, blur: int, alpha: int) -> Image.Image:
    """Draw a soft drop shadow then paste the product on top."""
    # Create shadow mask from product silhouette
    shadow_layer = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
    product_rgba = product.convert("RGBA")

    # Build solid dark silhouette at shadow offset position
    silhouette = Image.new("RGBA", product_rgba.size, (30, 20, 10, alpha))
    mask = product_rgba.split()[-1] if product_rgba.mode == "RGBA" else None

    sx = pos[0] + offset[0]
    sy = pos[1] + offset[1]
    shadow_layer.paste(silhouette, (sx, sy), mask=mask if mask else silhouette)
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(blur))

    # Composite: canvas → shadow → product
    result = Image.alpha_composite(canvas.convert("RGBA"), shadow_layer)
    result.paste(product_rgba, pos, mask=mask if mask else product_rgba)
    return result.convert("RGB")


def enhance(img: Image.Image, sharpness: float, contrast: float) -> Image.Image:
    img = ImageEnhance.Sharpness(img).enhance(sharpness)
    img = ImageEnhance.Contrast(img).enhance(contrast)
    return img


def process(src_path: Path, out_path: Path) -> None:
    if not src_path.exists():
        print(f"  ⚠  MISSING: {src_path.name}")
        return

    img = Image.open(src_path)
    img = ensure_white_bg(img)
    img = enhance(img, SHARPNESS, CONTRAST)
    img = fit_product(img, CANVAS, FILL_PCT)

    # Centre position on canvas
    pad_x = (CANVAS - img.width)  // 2
    pad_y = (CANVAS - img.height) // 2

    canvas = make_white_canvas(CANVAS)
    result = add_drop_shadow(canvas, img, (pad_x, pad_y),
                             SHADOW_OFFSET, SHADOW_BLUR, SHADOW_ALPHA)

    result = result.convert("RGB")
    result.save(out_path, "PNG", optimize=True)
    size_mb = out_path.stat().st_size / 1_048_576
    print(f"  ✅  {out_path.name}  [{result.size[0]}×{result.size[1]}  {size_mb:.1f} MB]")


# ── Main ─────────────────────────────────────────────────────────────────────
print(f"\n{'='*55}")
print("  Meesho Image Optimizer — Rathi Naturals")
print(f"  Output: {OUT}")
print(f"{'='*55}\n")

for p in PRODUCTS:
    name = p["name"]
    src  = p["src"]
    print(f"▸ {name}")

    # Slot 1 — clean product, no decorations
    process(src, OUT / f"{name}_Slot1_Main_Optimised.png")

print(f"\n{'='*55}")
print(f"  Done. Check: {OUT}")
print(f"{'='*55}\n")
