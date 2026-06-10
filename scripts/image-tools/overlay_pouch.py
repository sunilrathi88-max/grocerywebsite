import os
from PIL import Image, ImageFilter

BG_IMG = r"C:\Users\shubh\.gemini\antigravity\brain\4c469cf6-f97f-4e5b-8545-73ce6cf0c602\image_4_usage_perfect_text_1772083567277.png"
POUCH_IMG = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_V3\RedChilli_500g_V3.png"
OUT_IMG = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_Infographics\Amazon_Ultimate_Image4.png"

# 1. Load Background and upscale to 2000x2000
bg = Image.open(BG_IMG).convert("RGB")
bg = bg.resize((2000, 2000), resample=Image.Resampling.LANCZOS)

# 2. To hide whatever AI-generated pouch is on the right, we will apply a slight 
# shadow/dark gradient behind where our new pouch will go.
# We'll darken the right side of the frame.
gradient = Image.new('L', (2000, 2000), color=0)
for x in range(1000, 2000):
    val = min(int((x - 1000) / 1000.0 * 200), 200) # Fade to dark
    for y in range(2000):
        gradient.putpixel((x, y), val)
shadow_layer = Image.new('RGB', (2000, 2000), color=(30, 20, 10))
bg.paste(shadow_layer, (0, 0), gradient)

# 3. Load Pouch and get bounding box
pouch_full = Image.open(POUCH_IMG).convert("RGBA")
bbox = pouch_full.getbbox()
print("Original Pouch BBox:", bbox) # Should be the centered pouch + shadow

pouch_cropped = pouch_full.crop(bbox)

# The shadow in RedChilli_500g_V3 stretches to the bottom. 
# We'll just resize this cropped pouch to be very large and paste it on the right.
target_h = 1600
target_w = int(pouch_cropped.width * (target_h / pouch_cropped.height))
pouch_resized = pouch_cropped.resize((target_w, target_h), resample=Image.Resampling.LANCZOS)

# Coordinates to paste - place it on the right
x_pos = 2000 - target_w - 50
y_pos = 2000 - target_h - 100 # slight gap at bottom

# 4. Paste Pouch cleanly
bg.paste(pouch_resized, (x_pos, y_pos), pouch_resized)

# Save
bg.save(OUT_IMG, quality=100)
print(f"Absolutely perfect composited image saved to: {OUT_IMG}")
