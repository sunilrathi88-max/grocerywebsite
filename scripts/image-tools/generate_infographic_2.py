import os
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont

# Paths
POUCH_PATH = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_V3\RedChilli_500g_V3.png"
BG_PATH = r"C:\Users\shubh\.gemini\antigravity\brain\4c469cf6-f97f-4e5b-8545-73ce6cf0c602\image_3_usage_ideas_bg_1772181357382.png"
OUT_PATH = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_Infographics\Image_3_Usage_Ideas.png"

# Canvas dimensions
W, H = 2000, 2000

# 1. Load Custom Background
try:
    img = Image.open(BG_PATH).convert("RGBA")
    img = img.resize((W, H), resample=Image.Resampling.LANCZOS)
    # Sharpen the background to make the AI text crisp and legible
    img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
except FileNotFoundError:
    print(f"Error: Could not find '{BG_PATH}'")
    exit(1)

# 2. Process and Paste Pouch
print("Extracting actual high-resolution pouch image...")
pouch_img = Image.open(POUCH_PATH).convert("RGBA")
pouch_data = np.array(pouch_img)
r, g, b, a = pouch_data[:,:,0], pouch_data[:,:,1], pouch_data[:,:,2], pouch_data[:,:,3]

# 1. Remove exactly crisp white background
white_mask = (r > 240) & (g > 240) & (b > 240)
a[white_mask] = 0

# 2. Safely remove JUST the grey shadow at the bottom without eating the red pouch
# Grey is when r,g,b are close. Red pouch has much higher r.
grey_shadow = (np.abs(r.astype(int) - g.astype(int)) < 20) & (np.abs(g.astype(int) - b.astype(int)) < 20) & (r < 240)
bottom_region = np.zeros_like(white_mask, dtype=bool)
bottom_region[1820:, :] = True
a[grey_shadow & bottom_region] = 0

# Erode alpha to remove halos smoothly
from scipy.ndimage import binary_erosion
keep_mask = a > 0
eroded_mask = binary_erosion(keep_mask, iterations=2)
a[~eroded_mask] = 0

pouch_data[:,:,3] = a
pouch_transparent = Image.fromarray(pouch_data)

# Use exact bounding box
bbox = pouch_transparent.getbbox()
if bbox: 
    pouch_transparent = pouch_transparent.crop(bbox)

# Scale pouch
# Increase size so it completely covers the background AI pouch
pouch_h = 1000  
pouch_w = int(pouch_transparent.width * (pouch_h / pouch_transparent.height))
pouch_resized = pouch_transparent.resize((pouch_w, pouch_h), resample=Image.Resampling.LANCZOS)

# Center it inside the circle, lowered slightly to perfectly eclipse the AI pouch
px, py = (W - pouch_w) // 2, 550

# Drop Shadow for pouch to make it look grounded and natural
print("Generating soft, natural ambient shadow...")
shadow = pouch_resized.copy()
# Soft opacity
shadow_alpha = shadow.getchannel('A').point(lambda p: int(p * 0.20))
shadow.putalpha(shadow_alpha)
s_data = np.array(shadow)
s_data[:,:,0], s_data[:,:,1], s_data[:,:,2] = 0, 0, 0
# Huge blur for extreme diffusion
shadow = Image.fromarray(s_data, "RGBA").filter(ImageFilter.GaussianBlur(60))
img.paste(shadow, (px, py + 15), shadow)

# Paste Pouch
img.paste(pouch_resized, (px, py), pouch_resized)

# 3. Explicitly Render Missing Bottom Text Tagline
print("Rendering explicit bottom tagline to ensure no omission...")
draw = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype("segoeuib.ttf", 55)
except:
    font = ImageFont.load_default()

text = "Experience the true taste of tradition"
try:
    bbox = draw.textbbox((0,0), text, font=font)
    tw = bbox[2] - bbox[0]
    # Place text directly below the mandala section perfectly pristine
    draw.text(((W - tw) // 2, 1850), text, fill=(92, 10, 22), font=font)
except:
    pass

# Save final image
final = img.convert("RGB")
final.save(OUT_PATH, quality=100)
print(f"Natural Image successfully composited and saved at: {OUT_PATH}")
