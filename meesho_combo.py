from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageFont

BASE = Path("C:/Users/shubh/grocerywebsite/grocerywebsite")
OUT  = BASE / "Meesho_Images"
OUT.mkdir(exist_ok=True)

# Handles the known swapped filenames in the V3 folder
CHAI_SRC  = BASE / "Amazon_Final_V3/GaramMasala_100g_V3.png" 
GARAM_SRC = BASE / "Amazon_Final_V3/SKU_66_V3.png"

CANVAS_W, CANVAS_H = 2000, 2000
BG_COLOR  = (255, 255, 255)
MAROON    = (90, 20, 30)
GOLD      = (180, 140, 60)
CREAM     = (252, 248, 240)

def load_clean(path: Path, target_h: int) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    
    # Autocrop: Remove empty white/transparent space for a tighter fit
    mask = img.convert("L").point(lambda x: 255 if x < 251 else 0, mode='1')
    img.putalpha(mask)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg.convert("RGBA") 
    
    img = ImageEnhance.Sharpness(img).enhance(1.6)
    img = ImageEnhance.Contrast(img).enhance(1.1)
    
    ratio = target_h / img.height
    img = img.resize((int(img.width * ratio), target_h), Image.LANCZOS)
    return img

def add_shadow(canvas: Image.Image, img: Image.Image, x: int, y: int):
    blur, offset_y, offset_x = 28, 40, 18 
    alpha = 100
    mask = img.split()[3]
    shadow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_col = Image.new("RGBA", img.size, (20, 10, 10, alpha))
    shadow_layer.paste(shadow_col, (x + offset_x, y + offset_y), mask=mask)
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(blur))
    
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba = Image.alpha_composite(canvas_rgba, shadow_layer)
    canvas.paste(canvas_rgba.convert("RGB"))

canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG_COLOR)
draw   = ImageDraw.Draw(canvas)

TARGET_H = int(CANVAS_H * 0.78) # Optimized scale for best "fit"
BASE_Y   = int(CANVAS_H * 0.10) # Centered top margin
CENTRE  = CANVAS_W // 2

chai  = load_clean(CHAI_SRC,  TARGET_H)
garam = load_clean(GARAM_SRC, TARGET_H)

# Tight center layout with overlap to eliminate gap
OVERLAP = 180 
chai_x  = CENTRE - chai.width + (OVERLAP // 2)
garam_x = CENTRE - (OVERLAP // 2)

add_shadow(canvas, chai, chai_x, BASE_Y)
canvas.paste(chai, (chai_x, BASE_Y), mask=chai)

add_shadow(canvas, garam, garam_x, BASE_Y)
canvas.paste(garam, (garam_x, BASE_Y), mask=garam)

# Footer Design
BANNER_H = 175
by_y = CANVAS_H - BANNER_H
draw.rectangle([(0, by_y), (CANVAS_W, CANVAS_H)], fill=CREAM)
draw.rectangle([(0, by_y), (CANVAS_W, by_y + 4)], fill=MAROON)

try:
    f_path = "C:/Windows/Fonts/arial.ttf"
    font_b = ImageFont.truetype(f_path, 52)
    font_s = ImageFont.truetype(f_path, 36)
    font_badge = ImageFont.truetype(f_path, 42)
except:
    font_b = font_s = font_badge = ImageFont.load_default()

def draw_txt(y, text, font, color):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    draw.text(((CANVAS_W - w) // 2, y), text, font=font, fill=color)

draw_txt(by_y + 26, "Rathi Naturals — Chai Masala + Garam Masala Combo", font_b, MAROON)
draw_txt(by_y + 100, "60 Years. One Standard. | FSSAI Certified | 100% Pure | No Preservatives", font_s, GOLD)

# Combo Badge
BW, BH = 650, 100
bx, by = (CANVAS_W - BW) // 2, 25
draw.rounded_rectangle([(bx, by), (bx + BW, by + BH)], radius=50, fill=MAROON)
draw_txt(by + 28, "✦  COMBO PACK  ✦  SAVE MORE", font_badge, (255, 255, 255))

out_path = OUT / "ChaiMasala_GaramMasala_Combo_Optimised.png"
canvas.save(out_path, "PNG", optimize=True)
print(f"Polished Combo Saved: {out_path.name}")
