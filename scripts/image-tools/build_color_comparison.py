import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance

W, H = 2000, 2000
CREAM     = (252, 248, 241)
MAROON    = (92, 10, 22)
GREY_TEXT = (130, 120, 115)
DIVIDER   = (160, 60, 60)

# ── Source paths ──────────────────────────────────────────────────────────────
BOWL_SRC  = r"C:\Users\shubh\.gemini\antigravity\brain\4c469cf6-f97f-4e5b-8545-73ce6cf0c602\media__1772391786716.jpg"
POUCH_SRC = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_V3\RedChilli_500g_V3.png"
OUT_PATH  = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Infographics_FINAL\06_Color_Comparison_FINAL.png"

# ── Canvas ────────────────────────────────────────────────────────────────────
canvas = Image.new("RGB", (W, H), CREAM)
draw   = ImageDraw.Draw(canvas)

# ── Fonts ─────────────────────────────────────────────────────────────────────
def font(size, bold=False):
    candidates = ["segoeuib.ttf" if bold else "segoeuisl.ttf",
                  "arialbd.ttf"  if bold else "arial.ttf",
                  "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"]
    for name in candidates:
        try:
            return ImageFont.truetype(name, size)
        except:
            pass
    return ImageFont.load_default()

# ── Header ─────────────────────────────────────────────────────────────────────
HEADER_Y = 60
header_font = font(80, bold=True)
headline    = "See the Difference Instantly"
bb = draw.textbbox((0,0), headline, font=header_font)
draw.text(((W - bb[2]) // 2, HEADER_Y), headline, fill=MAROON, font=header_font)

sub_font = font(38)
sub = "Rathi Naturals  ·  60 YEARS. ONE STANDARD"
bb2 = draw.textbbox((0,0), sub, font=sub_font)
draw.text(((W - bb2[2]) // 2, HEADER_Y + 100), sub, fill=MAROON, font=sub_font)

# ── Divider line ───────────────────────────────────────────────────────────────
DIV_X = W // 2
COMP_TOP    = 220
COMP_BOTTOM = 1330
draw.line([(DIV_X, COMP_TOP), (DIV_X, COMP_BOTTOM)], fill=DIVIDER, width=4)

# ── Read and isolate BOWL from the source image ───────────────────────────────
raw   = Image.open(BOWL_SRC).convert("RGBA")
rw, rh = raw.size
# Bowl is on the LEFT half of the image; whole chillies on the right
bowl_crop = raw.crop((0, 0, int(rw * 0.46), rh))

# Remove white background from bowl
bd = np.array(bowl_crop)
r2,g2,b2,a2 = bd[:,:,0], bd[:,:,1], bd[:,:,2], bd[:,:,3]
a2[(r2>240)&(g2>240)&(b2>240)] = 0
bd[:,:,3] = a2
bowl_rgba = Image.fromarray(bd)
bbox = bowl_rgba.getbbox()
if bbox:
    bowl_rgba = bowl_rgba.crop(bbox)

# Build the DULL left bowl: desaturate + dim the real bowl to simulate cheap powder
dull_bowl = bowl_rgba.copy()
dull_rgb  = Image.fromarray(np.array(dull_bowl)[:,:,:3])
dull_rgb  = ImageEnhance.Color(dull_rgb).enhance(0.1)        # strip color → near grey
dull_rgb  = ImageEnhance.Brightness(dull_rgb).enhance(0.88)  # slightly darker
dull_rgb  = ImageEnhance.Contrast(dull_rgb).enhance(0.80)    # flatten contrast
# recombine with original alpha
dull_arr  = np.array(dull_rgb)
orig_alpha = np.array(bowl_rgba)[:,:,3:4]
dull_rgba = Image.fromarray(np.concatenate([dull_arr, orig_alpha], axis=2), "RGBA")

# ── Helper: paste image centred in a box ──────────────────────────────────────
def paste_fit(src_rgba, canvas, box, max_frac=0.85):
    bx1, by1, bx2, by2 = box
    bw, bh = bx2-bx1, by2-by1
    sw, sh = src_rgba.size
    scale  = min(bw*max_frac/sw, bh*max_frac/sh)
    nw, nh = int(sw*scale), int(sh*scale)
    resized= src_rgba.resize((nw,nh), Image.Resampling.LANCZOS)
    px = bx1 + (bw-nw)//2
    py = by1 + (bh-nh)//2
    canvas.paste(resized, (px,py), resized)

# Paste vivid real bowl (LEFT - Mathaniya)
paste_fit(bowl_rgba, canvas, (0, COMP_TOP, DIV_X, COMP_BOTTOM))
# Paste dull bowl (RIGHT - Ordinary)
paste_fit(dull_rgba, canvas, (DIV_X, COMP_TOP, W, COMP_BOTTOM))

# ── Column headers ─────────────────────────────────────────────────────────────
col_font = font(50, bold=True)
lbl_y    = COMP_TOP + 10
draw.text((DIV_X//2 - 280, lbl_y), "Mathaniya Red Chilli Powder", fill=MAROON, font=col_font)
draw.text((DIV_X + 120,    lbl_y), "Ordinary Chilli Powder",       fill=GREY_TEXT, font=col_font)

# ── Bullet points ─────────────────────────────────────────────────────────────
blt_font  = font(44, bold=False)
LEFT_TXT  = ["✓  Deep Ruby Red", "✓  Clean Sweet Heat", "✓  Zero Additives"]
RIGHT_TXT = ["✗  Faded Color", "✗  Bitter Aftertaste", "✗  Artificial Fillers"]
blt_y = COMP_BOTTOM - 200
for i, (lt, rt) in enumerate(zip(LEFT_TXT, RIGHT_TXT)):
    draw.text((60, blt_y + i*60),        lt, fill=MAROON,    font=blt_font)
    draw.text((DIV_X+40, blt_y + i*60),  rt, fill=GREY_TEXT, font=blt_font)

# ── Pouch (bottom center) ──────────────────────────────────────────────────────
pouch = Image.open(POUCH_SRC).convert("RGBA")
pd    = np.array(pouch)
pr,pg,pb,pa = pd[:,:,0],pd[:,:,1],pd[:,:,2],pd[:,:,3]
pa[(pr>240)&(pg>240)&(pb>240)] = 0
# Grey shadow only below y=1820
grey = (np.abs(pr.astype(int)-pg.astype(int))<20)&(np.abs(pg.astype(int)-pb.astype(int))<20)&(pr<240)
bot  = np.zeros_like(grey, dtype=bool); bot[1820:,:] = True
pa[grey&bot] = 0
pd[:,:,3] = pa
pouch_clean = Image.fromarray(pd)
bb2 = pouch_clean.getbbox()
if bb2: pouch_clean = pouch_clean.crop(bb2)

ph  = 520
pw  = int(pouch_clean.width * (ph / pouch_clean.height))
pouch_r = pouch_clean.resize((pw, ph), Image.Resampling.LANCZOS)
ppx = (W - pw) // 2
ppy = COMP_BOTTOM + 30
canvas.paste(pouch_r, (ppx, ppy), pouch_r)

# ── Bottom tagline ─────────────────────────────────────────────────────────────
tag_font = font(52, bold=False)
tagline  = "Experience the true taste of tradition"
tb = draw.textbbox((0,0), tagline, font=tag_font)
draw.text(((W-tb[2])//2, ppy + ph + 20), tagline, fill=MAROON, font=tag_font)

# ── Sharpen & Save ─────────────────────────────────────────────────────────────
canvas = canvas.filter(ImageFilter.UnsharpMask(radius=2, percent=160, threshold=2))
canvas.save(OUT_PATH, quality=100)
print(f"Saved: {OUT_PATH}")
