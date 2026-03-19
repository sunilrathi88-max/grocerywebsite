import os
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

# Paths
POUCH_PATH = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_V3\RedChilli_500g_V3.png"
BG_PATH = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_Infographics\UPSCALED_image_4_usage_v3_1772048430022.png"
OUT_PATH = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_Infographics\Amazon_Ultimate_Composite.png"

print("Loading background image...")
bg = Image.open(BG_PATH).convert("RGBA")
bg_w, bg_h = bg.size

print("Loading pouch image and removing white background dynamically...")
pouch_img = Image.open(POUCH_PATH).convert("RGBA")
# Remove pure white background (255,255,255)
pouch_data = np.array(pouch_img)
r, g, b, a = pouch_data[:,:,0], pouch_data[:,:,1], pouch_data[:,:,2], pouch_data[:,:,3]
# Find pixels that are nearly white
white_mask = (r > 240) & (g > 240) & (b > 240)
pouch_data[:,:,3][white_mask] = 0  # Make them transparent
pouch_transparent = Image.fromarray(pouch_data)

# Crop out the empty transparent space
bbox = pouch_transparent.getbbox()
if bbox:
    pouch_transparent = pouch_transparent.crop(bbox)

print("Scaling pouch and preparing shadow...")
# Make the pouch large enough to cover the AI-hallucinated pouch on the right (approx 72% of image height)
target_h = int(bg_h * 0.72)
scale = target_h / float(pouch_transparent.height)
target_w = int(float(pouch_transparent.width) * scale)
pouch_resized = pouch_transparent.resize((target_w, target_h), resample=Image.Resampling.LANCZOS)

# Position on the right side of the infographic
x_pos = bg_w - target_w - 200
y_pos = bg_h - target_h - 150

# Generate a soft blur behind the pouch to hide any remaining AI-hallucinated edges
blur_mask = Image.new("L", bg.size, 0)
from PIL import ImageDraw
draw = ImageDraw.Draw(blur_mask)
# Draw an ellipse where the pouch will go
draw.ellipse((x_pos-50, y_pos-50, x_pos+target_w+50, y_pos+target_h+50), fill=255)
# Blur the image heavily inside that region to soften the background
bg_blurred = bg.filter(ImageFilter.GaussianBlur(30))
bg.paste(bg_blurred, (0,0), blur_mask)

# Generate realistic drop shadow for the pouch
shadow = pouch_resized.copy()
shadow_alpha = shadow.getchannel('A')
# Reduce opacity to 60%
shadow_alpha = shadow_alpha.point(lambda p: int(p * 0.6))
shadow.putalpha(shadow_alpha)
shadow_data = np.array(shadow)
# Make shadow black
shadow_data[:,:,0] = 0
shadow_data[:,:,1] = 0
shadow_data[:,:,2] = 0
shadow = Image.fromarray(shadow_data, "RGBA")
shadow = shadow.filter(ImageFilter.GaussianBlur(25))

print("Compositing layers...")
# Paste shadow with slight offset
bg.paste(shadow, (x_pos + 30, y_pos + 40), shadow)

# Paste the crisp, transparent pouch! The 3rd argument is the alpha mask which prevents the white box!
bg.paste(pouch_resized, (x_pos, y_pos), pouch_resized)

# Save final
final = bg.convert("RGB")
final.save(OUT_PATH, quality=100)
print(f"PERFECT Composite saved successfully to: {OUT_PATH}")
