"""
Rathi Naturals — Amazon Image Compositor
Automatically composites the real product pouch onto AI-generated background plates.

Usage:
    python composite_pouch.py

Requirements:
    pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from pathlib import Path
import sys


# ============================================================
# CONFIGURATION — Edit these paths to match your setup
# ============================================================

BASE_DIR = Path(r"C:\Users\shubh\grocerywebsite\grocerywebsite")
BRAIN_DIR = Path(r"C:\Users\shubh\.gemini\antigravity\brain\e2d2486a-7afe-41c8-a2d2-ff040cf184dd")

# Real pouch image (white background)
POUCH_IMAGE = BRAIN_DIR / "haldi_lifestyle_image4_1772636544528.png"

# Background plates
BG_PLATES = {
    "lifestyle": BRAIN_DIR / "bg_plate_lifestyle_kitchen_1772650061500.png",
    "dark_slate": BRAIN_DIR / "bg_plate_dark_slate_1772650083303.png",
    "heritage": BRAIN_DIR / "bg_plate_heritage_market_1772650119431.png",
}

# Output directory
OUTPUT_DIR = BASE_DIR / "Salem_Turmeric_FINAL"

# Canvas size (Amazon standard)
CANVAS_SIZE = (2000, 2000)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def remove_background(img: Image.Image, threshold=240) -> Image.Image:
    """Remove white background from pouch image using Pillow (no rembg needed).
    
    Works best with product photos on white/light backgrounds.
    Args:
        img: Input image
        threshold: Pixels with R,G,B all above this value are treated as background
    """
    print("  → Removing white background (Pillow threshold method)...")
    img = img.convert("RGBA")
    data = list(img.getdata())
    new_data = []
    
    for pixel in data:
        r, g, b, a = pixel
        # If pixel is close to white (background), make fully transparent
        if r > threshold and g > threshold and b > threshold:
            new_data.append((r, g, b, 0))
        # Soft edge: partially transparent for near-white pixels (anti-aliasing)
        elif r > threshold - 20 and g > threshold - 20 and b > threshold - 20:
            # Calculate how "white" this pixel is
            whiteness = min(r, g, b)
            alpha = max(0, int(255 * (1 - (whiteness - (threshold - 20)) / 20)))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append(pixel)
    
    img.putdata(new_data)
    return img


def resize_pouch(pouch: Image.Image, target_height: int) -> Image.Image:
    """Resize pouch maintaining aspect ratio to fit target height."""
    ratio = target_height / pouch.height
    new_width = int(pouch.width * ratio)
    return pouch.resize((new_width, target_height), Image.Resampling.LANCZOS)


def add_drop_shadow(img: Image.Image, offset=(15, 15), blur=25, opacity=120) -> Image.Image:
    """Add a realistic drop shadow behind the pouch."""
    # Create shadow layer
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    # Use the alpha channel of the pouch as the shadow shape
    shadow_shape = img.split()[3]  # Alpha channel
    shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, opacity))
    shadow_layer.putalpha(shadow_shape)
    
    # Create a canvas big enough for shadow + offset
    canvas_w = img.width + abs(offset[0]) + blur * 2
    canvas_h = img.height + abs(offset[1]) + blur * 2
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    
    # Paste shadow with offset
    sx = blur + max(offset[0], 0)
    sy = blur + max(offset[1], 0)
    canvas.paste(shadow_layer, (sx, sy))
    
    # Blur the shadow
    canvas = canvas.filter(ImageFilter.GaussianBlur(blur))
    
    # Paste original image on top
    ix = blur + max(-offset[0], 0)
    iy = blur + max(-offset[1], 0)
    canvas.paste(img, (ix, iy), img)
    
    return canvas


def add_bottom_banner(canvas: Image.Image, 
                      main_text: str, 
                      sub_text: str = "",
                      banner_color=(164, 120, 100),  # Mocha Mousse
                      text_color=(255, 248, 240),
                      banner_height=200) -> Image.Image:
    """Add a text banner at the bottom of the image."""
    draw = ImageDraw.Draw(canvas)
    w, h = canvas.size
    
    # Draw banner rectangle
    banner_y = h - banner_height
    draw.rectangle([(0, banner_y), (w, h)], fill=(*banner_color, 240))
    
    # Try to load a nice font, fall back to default
    try:
        font_main = ImageFont.truetype("arial.ttf", 56)
        font_sub = ImageFont.truetype("arial.ttf", 32)
    except (OSError, IOError):
        try:
            font_main = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 56)
            font_sub = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 32)
        except (OSError, IOError):
            font_main = ImageFont.load_default()
            font_sub = ImageFont.load_default()
    
    # Draw main text centered
    bbox = draw.textbbox((0, 0), main_text, font=font_main)
    text_w = bbox[2] - bbox[0]
    text_x = (w - text_w) // 2
    text_y = banner_y + 40
    draw.text((text_x, text_y), main_text, fill=text_color, font=font_main)
    
    # Draw subtitle centered
    if sub_text:
        bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
        sub_w = bbox_sub[2] - bbox_sub[0]
        sub_x = (w - sub_w) // 2
        sub_y = text_y + 75
        draw.text((sub_x, sub_y), sub_text, fill=(*text_color[:3], 200), font=font_sub)
    
    return canvas


# ============================================================
# COMPOSITING FUNCTIONS — One per image type
# ============================================================

def composite_lifestyle(pouch_cutout: Image.Image, bg_path: Path) -> Image.Image:
    """Composite pouch onto the Golden Hour lifestyle kitchen background."""
    bg = Image.open(bg_path).convert("RGBA").resize(CANVAS_SIZE, Image.Resampling.LANCZOS)
    
    # Resize pouch to ~65% of canvas height
    pouch = resize_pouch(pouch_cutout, int(CANVAS_SIZE[1] * 0.55))
    pouch_with_shadow = add_drop_shadow(pouch, offset=(12, 18), blur=20, opacity=100)
    
    # Position: right-center of the scene
    x = int(CANVAS_SIZE[0] * 0.52)
    y = int(CANVAS_SIZE[1] * 0.12)
    
    bg.paste(pouch_with_shadow, (x, y), pouch_with_shadow)
    
    # Add banner
    bg = add_bottom_banner(
        bg,
        main_text="Golden Aroma in Every Spoon",
        sub_text="Perfect for Haldi Doodh, Daily Cooking & Immunity Rituals"
    )
    
    return bg


def composite_dark_slate(pouch_cutout: Image.Image, bg_path: Path) -> Image.Image:
    """Composite pouch onto the dark slate macro background."""
    bg = Image.open(bg_path).convert("RGBA").resize(CANVAS_SIZE, Image.Resampling.LANCZOS)
    
    # Resize pouch to ~60% of canvas height
    pouch = resize_pouch(pouch_cutout, int(CANVAS_SIZE[1] * 0.58))
    pouch_with_shadow = add_drop_shadow(pouch, offset=(10, 15), blur=18, opacity=80)
    
    # Position: center-right
    x = int(CANVAS_SIZE[0] * 0.45)
    y = int(CANVAS_SIZE[1] * 0.08)
    
    bg.paste(pouch_with_shadow, (x, y), pouch_with_shadow)
    
    return bg


def composite_heritage(pouch_cutout: Image.Image, bg_path: Path) -> Image.Image:
    """Composite pouch onto the heritage spice market background."""
    bg = Image.open(bg_path).convert("RGBA").resize(CANVAS_SIZE, Image.Resampling.LANCZOS)
    
    # Resize pouch to ~60% of canvas height
    pouch = resize_pouch(pouch_cutout, int(CANVAS_SIZE[1] * 0.55))
    pouch_with_shadow = add_drop_shadow(pouch, offset=(10, 12), blur=15, opacity=90)
    
    # Position: right side (clean Mocha Mousse area)
    x = int(CANVAS_SIZE[0] * 0.55)
    y = int(CANVAS_SIZE[1] * 0.10)
    
    bg.paste(pouch_with_shadow, (x, y), pouch_with_shadow)
    
    # Add banner
    bg = add_bottom_banner(
        bg,
        main_text="60 Years. One Standard.",
        sub_text="Original Masalas Delivered With a Story — From Our Family to Yours."
    )
    
    return bg


def create_white_bg_hero(pouch_cutout: Image.Image) -> Image.Image:
    """Create a pure white background hero image (Amazon Image 1 compliant)."""
    canvas = Image.new("RGBA", CANVAS_SIZE, (255, 255, 255, 255))
    
    # Resize pouch to fill ~85% of frame height
    pouch = resize_pouch(pouch_cutout, int(CANVAS_SIZE[1] * 0.85))
    pouch_with_shadow = add_drop_shadow(pouch, offset=(8, 12), blur=15, opacity=60)
    
    # Center the pouch
    x = (CANVAS_SIZE[0] - pouch_with_shadow.width) // 2
    y = (CANVAS_SIZE[1] - pouch_with_shadow.height) // 2
    
    canvas.paste(pouch_with_shadow, (x, y), pouch_with_shadow)
    
    return canvas


# ============================================================
# MAIN EXECUTION
# ============================================================

def main():
    print("=" * 60)
    print("  Rathi Naturals — Amazon Image Compositor")
    print("  Real Pouch + AI Backgrounds = Production-Ready Images")
    print("=" * 60)
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 Output: {OUTPUT_DIR}")
    
    # Step 1: Load and remove background from pouch
    print(f"\n🔧 Loading pouch: {POUCH_IMAGE.name}")
    if not POUCH_IMAGE.exists():
        print(f"❌ Pouch image not found at: {POUCH_IMAGE}")
        print("   Please update the POUCH_IMAGE path in the script.")
        sys.exit(1)
    
    pouch_raw = Image.open(POUCH_IMAGE).convert("RGBA")
    print(f"  → Original size: {pouch_raw.size}")
    
    pouch_cutout = remove_background(pouch_raw)
    print(f"  → Background removed ✅")
    
    # Save the cutout for reuse
    cutout_path = OUTPUT_DIR / "00_pouch_cutout.png"
    pouch_cutout.save(cutout_path, "PNG")
    print(f"  → Cutout saved: {cutout_path.name}")
    
    # Step 2: Create white background hero (Image 1)
    print("\n🖼️  Generating Image 1: White BG Hero (Amazon Compliant)...")
    hero = create_white_bg_hero(pouch_cutout)
    hero_path = OUTPUT_DIR / "01_Hero_WhiteBG_RealPouch.png"
    hero.convert("RGB").save(hero_path, "PNG", quality=95)
    print(f"  ✅ Saved: {hero_path.name}")
    
    # Step 3: Composite onto each background plate
    composites = {
        "lifestyle": {
            "func": composite_lifestyle,
            "output": "03_Lifestyle_GoldenHour_RealPouch.png",
            "label": "Image 3: Golden Hour Lifestyle"
        },
        "dark_slate": {
            "func": composite_dark_slate,
            "output": "04_DarkSlate_Macro_RealPouch.png",
            "label": "Image 4: Dark Slate Macro"
        },
        "heritage": {
            "func": composite_heritage,
            "output": "07_Heritage_BrandStory_RealPouch.png",
            "label": "Image 7: Heritage Brand Story"
        },
    }
    
    for key, config in composites.items():
        bg_path = BG_PLATES.get(key)
        if bg_path and bg_path.exists():
            print(f"\n🖼️  Generating {config['label']}...")
            result = config["func"](pouch_cutout, bg_path)
            out_path = OUTPUT_DIR / config["output"]
            result.convert("RGB").save(out_path, "PNG", quality=95)
            print(f"  ✅ Saved: {out_path.name}")
        else:
            print(f"\n⚠ Skipping {config['label']} — background plate not found: {bg_path}")
    
    # Summary
    print("\n" + "=" * 60)
    print("  🎉 COMPOSITING COMPLETE!")
    print("=" * 60)
    print(f"\n📁 All images saved to: {OUTPUT_DIR}")
    print("\nGenerated files:")
    for f in sorted(OUTPUT_DIR.glob("*.png")):
        size_kb = f.stat().st_size // 1024
        print(f"  📄 {f.name} ({size_kb} KB)")
    
    print("\n💡 TIP: For Images 2, 5, 6 (infographics with badges/text),")
    print("   use the 00_pouch_cutout.png in Canva — it has a transparent background!")
    print("   Just drag and drop it onto your Bento Box template designs.")


if __name__ == "__main__":
    main()
