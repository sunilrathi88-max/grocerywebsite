"""
Rathi Naturals - Enhanced Masala Duo Composite for Meesho
Features:
  - Staggered / depth-layered pouch placement (Chai behind-left, Garam in front-right)
  - "VALUE COMBO PACK" badge (burgundy pill shape)
  - Decorative whole spices drawn at the base
  - Soft multi-point drop shadows
  - 2000x2000px, 300 DPI, pure white background
"""

from PIL import Image, ImageFilter, ImageDraw, ImageFont
import numpy as np
import os, math, random

# ── Paths ────────────────────────────────────────────────────────────────────
BRAIN_DIR  = r"C:\Users\shubh\.gemini\antigravity\brain\6ecb290e-970a-485a-a362-0622ef5aff85"
CHAI_PATH  = os.path.join(BRAIN_DIR, "uploaded_media_1772558511375.jpg")
GARAM_PATH = os.path.join(BRAIN_DIR, "media__1772558501654.jpg")
OUT_PATH   = os.path.join(BRAIN_DIR, "rathi_naturals_combo_enhanced.png")
OUT_MAIN   = r"C:\Users\shubh\grocerywebsite\grocerywebsite\rathi_naturals_combo_enhanced.png"

# ── Canvas ───────────────────────────────────────────────────────────────────
W = H = 2000
BG    = (255, 255, 255)

# ── Colors ───────────────────────────────────────────────────────────────────
BURGUNDY       = (122, 29,  57)
GOLD           = (210, 165,  70)
BADGE_BG       = (122, 29,  57)
BADGE_TEXT     = (255, 248, 220)
SHADOW_COLOR   = (180, 140, 110)

# ── Layout ───────────────────────────────────────────────────────────────────
POUCH_MAX_H    = 1360   # max height for each pouch
POUCH_MAX_W    = 820    # max width for each pouch
OVERLAP        = -20    # negative = slight gap (no overlap)
STAGGER_PX     = 55     # vertical stagger
CENTER_X       = W // 2 - 60   # shift whole composition slightly left
CENTER_Y       = H // 2 - 80

# ── Shadow ───────────────────────────────────────────────────────────────────
SHADOW_BLUR   = 28
SHADOW_ALPHA  = 110


# ─────────────────────────────────────────────────────────────────────────────
# Helper: crop white background → RGBA with transparency
# ─────────────────────────────────────────────────────────────────────────────
def crop_to_pouch(img: Image.Image, threshold: int = 238) -> Image.Image:
    rgba = img.convert("RGBA")
    arr  = np.array(rgba)
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    mask = ~((r > threshold) & (g > threshold) & (b > threshold))

    rows, cols = np.any(mask, axis=1), np.any(mask, axis=0)
    if not rows.any(): return rgba

    rmin, rmax = np.where(rows)[0][[0,-1]]
    cmin, cmax = np.where(cols)[0][[0,-1]]
    m = 8
    rmin, rmax = max(0,rmin-m), min(arr.shape[0]-1, rmax+m)
    cmin, cmax = max(0,cmin-m), min(arr.shape[1]-1, cmax+m)
    cropped = rgba.crop((cmin, rmin, cmax+1, rmax+1))

    a = np.array(cropped)
    white = (a[:,:,0]>threshold)&(a[:,:,1]>threshold)&(a[:,:,2]>threshold)
    a[:,:,3] = np.where(white, 0, 255)
    return Image.fromarray(a, "RGBA")


def fit(img, max_w, max_h):
    w, h = img.size
    s = min(max_w/w, max_h/h)
    return img.resize((int(w*s), int(h*s)), Image.LANCZOS)


# ─────────────────────────────────────────────────────────────────────────────
# Drop shadow
# ─────────────────────────────────────────────────────────────────────────────
def make_shadow(img: Image.Image, blur: int, alpha: int, color=(80,50,30)) -> Image.Image:
    alpha_ch = img.split()[3]
    shadow   = Image.new("RGBA", img.size, (0,0,0,0))
    sil      = Image.new("RGBA", img.size, color+(alpha,))
    sil.putalpha(alpha_ch)
    shadow.paste(sil, (0,0))
    return shadow.filter(ImageFilter.GaussianBlur(blur))


def paste_layer(canvas: Image.Image, layer: Image.Image, x: int, y: int):
    tmp = Image.new("RGBA", canvas.size, (0,0,0,0))
    tmp.paste(layer, (x, y), layer)
    return Image.alpha_composite(canvas, tmp)


# ─────────────────────────────────────────────────────────────────────────────
# Spice props drawn with PIL
# ─────────────────────────────────────────────────────────────────────────────
def draw_star_anise(draw, cx, cy, r, color, angle_offset=0):
    """8-pointed star anise shape."""
    n_arms = 8
    for i in range(n_arms):
        a = math.radians(i * 360/n_arms + angle_offset)
        # arm tip
        tx, ty = cx + r*math.cos(a), cy + r*math.sin(a)
        # side petals
        for side in (-1, 1):
            sa = a + side * math.radians(20)
            sx, sy = cx + (r*0.45)*math.cos(sa), cy + (r*0.45)*math.sin(sa)
            draw.polygon([
                (cx + 3*math.cos(a+math.pi/2), cy + 3*math.sin(a+math.pi/2)),
                (tx, ty),
                (sx, sy),
                (cx, cy)
            ], fill=color)
    # center seed
    draw.ellipse((cx-r*0.18, cy-r*0.18, cx+r*0.18, cy+r*0.18), fill=color)


def draw_cardamom(draw, cx, cy, w, h, angle, color):
    """Oval cardamom pod."""
    box = [cx - w//2, cy - h//2, cx + w//2, cy + h//2]
    # rotate by creating a small image
    pod = Image.new("RGBA", (w+4, h+4), (0,0,0,0))
    d   = ImageDraw.Draw(pod)
    d.ellipse([2,2,w+1,h+1], fill=color)
    # draw vertical lines on pod
    for i in range(1,4):
        xp = 2 + i*(w//4)
        d.line([(xp,4),(xp,h)], fill=(color[0]-20, color[1]-20, color[2]-20, 180), width=1)
    pod = pod.rotate(angle, expand=True)
    draw._image.paste(pod, (cx - pod.width//2, cy - pod.height//2), pod)


def draw_peppercorn(draw, cx, cy, r, color):
    draw.ellipse((cx-r, cy-r, cx+r, cy+r), fill=color)
    draw.ellipse((cx-r//2, cy-r, cx+r//2, cy-r//2), fill=(color[0]+15, color[1]+15, color[2]+15, 200))


def draw_clove(draw, cx, cy, size, color):
    """Simple clove: round head + stick."""
    draw.ellipse((cx-size//2, cy-size, cx+size//2, cy), fill=color)
    draw.rectangle((cx-size//5, cy, cx+size//5, cy+size*2), fill=color)


def add_spice_border(canvas: Image.Image) -> Image.Image:
    """Draw scattered whole spices along the bottom of the canvas."""
    draw   = ImageDraw.Draw(canvas, "RGBA")
    rng    = random.Random(42)  # reproducible

    spice_color_dark   = (110, 60, 20, 220)
    spice_color_red    = (140, 40, 30, 220)
    spice_color_green  = ( 80, 110, 50, 220)
    spice_color_brown  = (100, 65, 25, 220)

    # spices sit just below the pouches (dynamic y)
    y_base  = 1710
    x_zones = [80, 240, 400, 560, 720, 900, 1080, 1260, 1440, 1600, 1760, 1920]

    items = [
        ("anise",      spice_color_dark,  70),
        ("cardamom",   spice_color_green, 52),
        ("pepper",     spice_color_brown, 22),
        ("clove",      spice_color_red,   18),
        ("anise",      spice_color_dark,  58),
        ("pepper",     spice_color_brown, 20),
        ("cardamom",   spice_color_green, 48),
        ("clove",      spice_color_red,   20),
        ("anise",      spice_color_dark,  64),
        ("pepper",     spice_color_brown, 22),
        ("cardamom",   spice_color_green, 50),
        ("clove",      spice_color_red,   18),
    ]

    for (kind, color, size), x in zip(items, x_zones):
        dy = rng.randint(-30, 30)
        y  = y_base + dy
        if kind == "anise":
            draw_star_anise(draw, x, y, size, color, angle_offset=rng.randint(0,45))
        elif kind == "cardamom":
            draw_cardamom(draw, x, y, size, size*2, rng.randint(-30,30), color)
        elif kind == "pepper":
            draw_peppercorn(draw, x, y, size, color)
        elif kind == "clove":
            draw_clove(draw, x, y, size, color)

    return canvas


# ─────────────────────────────────────────────────────────────────────────────
# Badge
# ─────────────────────────────────────────────────────────────────────────────
def draw_badge(canvas: Image.Image) -> Image.Image:
    bw, bh   = 640, 90
    bx       = (W - bw) // 2
    by       = 60
    radius   = bh // 2

    badge = Image.new("RGBA", (bw, bh), (0,0,0,0))
    bd    = ImageDraw.Draw(badge)

    # Pill background
    bd.rounded_rectangle([0, 0, bw-1, bh-1], radius=radius, fill=BADGE_BG)

    # Gold border
    bd.rounded_rectangle([3, 3, bw-4, bh-4], radius=radius-3,
                          outline=GOLD, width=3)

    # Text — try system fonts, fallback to default
    font_size = 38
    font_paths = [
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\calibrib.ttf",
        r"C:\Windows\Fonts\verdanab.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    font = ImageFont.load_default()
    for fp in font_paths:
        if os.path.exists(fp):
            try: font = ImageFont.truetype(fp, font_size); break
            except: pass

    text = "✦  VALUE COMBO PACK  ✦"
    bbox = bd.textbbox((0,0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    tx = (bw - tw) // 2
    ty = (bh - th) // 2 - bbox[1]
    bd.text((tx+2, ty+2), text, font=font, fill=(0,0,0,60))   # shadow
    bd.text((tx,   ty),   text, font=font, fill=BADGE_TEXT)

    # Gold star accents (small diamonds on each side)
    for sx in [18, bw-18]:
        bd.polygon([(sx,bh//2-10), (sx+8,bh//2), (sx,bh//2+10), (sx-8,bh//2)], fill=GOLD)

    # Paste badge
    tmp = Image.new("RGBA", (W, H), (0,0,0,0))
    tmp.paste(badge, (bx, by), badge)
    return Image.alpha_composite(canvas, tmp)


# ─────────────────────────────────────────────────────────────────────────────
# Main composite
# ─────────────────────────────────────────────────────────────────────────────
def composite():
    print("Loading images…")
    chai  = crop_to_pouch(Image.open(CHAI_PATH).convert("RGBA"))
    garam = crop_to_pouch(Image.open(GARAM_PATH).convert("RGBA"))

    # Scale pouches — Chai is 82% size to look "behind"
    chai_bg  = fit(chai,  int(POUCH_MAX_W * 0.82), int(POUCH_MAX_H * 0.82))
    garam_fg = fit(garam, POUCH_MAX_W, POUCH_MAX_H)

    canvas = Image.new("RGBA", (W, H), BG + (255,))

    # ── Staggered positions: spread widely so both labels readable ───────────
    # Garam Masala (front-right)
    gx = CENTER_X + 120
    gy = CENTER_Y - garam_fg.size[1] // 2 + STAGGER_PX

    # Chai Masala (behind-left): positioned so right edge is ~80px left of gx
    cx = gx - chai_bg.size[0] - 80
    cy = CENTER_Y - chai_bg.size[1] // 2 - STAGGER_PX

    # ── Shadows ───────────────────────────────────────────────────────────────
    # Chai shadow first (it's behind)
    s_chai  = make_shadow(chai_bg,  SHADOW_BLUR, 80)
    canvas  = paste_layer(canvas, s_chai,  cx+16, cy+22)

    # Garam shadow
    s_garam = make_shadow(garam_fg, SHADOW_BLUR+6, SHADOW_ALPHA)
    canvas  = paste_layer(canvas, s_garam, gx+20, gy+26)

    # ── Pouches (Chai behind, Garam on top) ───────────────────────────────────
    canvas = paste_layer(canvas, chai_bg,  cx, cy)
    canvas = paste_layer(canvas, garam_fg, gx, gy)

    # ── Spice props ───────────────────────────────────────────────────────────
    canvas = add_spice_border(canvas)

    # ── Combo badge ───────────────────────────────────────────────────────────
    canvas = draw_badge(canvas)

    # ── Save ──────────────────────────────────────────────────────────────────
    out = canvas.convert("RGB")
    out.save(OUT_PATH, "PNG", dpi=(300, 300))
    out.save(OUT_MAIN, "PNG", dpi=(300, 300))
    print(f"✅ Saved:")
    print(f"   {OUT_PATH}")
    print(f"   {OUT_MAIN}")
    print(f"   Canvas: {W}×{H}px")
    print(f"   Chai Masala  → {chai_bg.size[0]}×{chai_bg.size[1]}px  at ({cx},{cy})")
    print(f"   Garam Masala → {garam_fg.size[0]}×{garam_fg.size[1]}px at ({gx},{gy})")


if __name__ == "__main__":
    composite()
