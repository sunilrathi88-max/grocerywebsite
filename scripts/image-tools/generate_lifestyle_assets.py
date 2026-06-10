import os
from PIL import Image, ImageChops, ImageFilter, ImageEnhance

# Configuration
BG_KITCHEN = r"C:\Users\shubh\.gemini\antigravity\brain\23ddacb9-2c55-42a0-adf2-5c9f11256612\bg_kitchen_lifestyle_16_9_1775485934500px_1775485941356.png"
BG_SLATE = r"C:\Users\shubh\.gemini\antigravity\brain\23ddacb9-2c55-42a0-adf2-5c9f11256612\bg_dark_slate_premium_16_9_1775485942600px_1775485959337.png"
OUTPUT_DIR = r"public/images/lifestyle"

# Mapping: Product Name -> (Source Image Path, Background Plate)
PRODUCTS = {
    # Spices
    "haldi": (r"haldi,mirch ,dhaniya 200g\haldi_200g_front_2G9A2542.JPG", BG_KITCHEN),
    "mirch": (r"haldi,mirch ,dhaniya 200g\mirch_200g_front_2G9A2537.JPG", BG_KITCHEN),
    "dhaniya": (r"haldi,mirch ,dhaniya 200g\dhaniya_200g_front_2G9A2528.JPG", BG_KITCHEN),
    
    # Premium Range
    "almonds": (r"public\images\products\almonds-badam-front.jpg", BG_SLATE),
    "cashew": (r"public\images\products\cashew-kaju-front.png", BG_SLATE),
    "pistachios": (r"public\images\products\pistachios-pista-front.jpg", BG_SLATE),
    "walnuts": (r"public\images\products\walnuts-akhrot-front.jpg", BG_SLATE),
    "saffron": (r"public\images\products\saffron-kesar-front.jpg", BG_SLATE),
}

def remove_background(img):
    """Simple background removal for white background images."""
    img = img.convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    # Threshold for 'white' - we want to be careful not to remove the pouch highlights
    # Pouches are Kraft (brown) or Silver (metals), so white background is usually > 240
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    # Trim empty space
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    return img

def create_lifestyle_shot(product_name, source_path, bg_path):
    print(f"Processing {product_name}...")
    try:
        bg = Image.open(bg_path).convert("RGBA")
        pouch = Image.open(source_path)
        
        # Remove background if not already png with alpha
        if pouch.mode != 'RGBA':
            pouch = remove_background(pouch)
        
        # Target height (roughly 70% of background height)
        target_h = int(bg.height * 0.75)
        w_percent = (target_h / float(pouch.size[1]))
        target_w = int((float(pouch.size[0]) * float(w_percent)))
        pouch = pouch.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Position: Center-Bottom with a bit of padding
        pos_x = (bg.width - pouch.width) // 2
        pos_y = bg.height - pouch.height - int(bg.height * 0.05)
        
        # Create shadow
        shadow = Image.new('RGBA', bg.size, (0, 0, 0, 0))
        # Draw an oval shadow below the pouch
        # For simplicity, we just use a blurred version of the pouch alpha
        pouch_alpha = pouch.getchannel('A')
        shadow_pouch = Image.new('RGBA', pouch.size, (0, 0, 0, 100))
        shadow_pouch.putalpha(pouch_alpha)
        
        # Distort/Blur shadow to make it look like it's on ground
        shadow_pouch = shadow_pouch.resize((int(target_w * 1.2), int(target_h * 0.1)))
        shadow_pouch = shadow_pouch.filter(ImageFilter.GaussianBlur(radius=10))
        
        shadow.paste(shadow_pouch, (pos_x - int(target_w * 0.1), pos_y + target_h - int(target_h * 0.05)), shadow_pouch)
        
        # Composite
        final = Image.alpha_composite(bg, shadow)
        final.paste(pouch, (pos_x, pos_y), pouch)
        
        # Blending adjustment (boost saturation slightly for premium feel)
        enhancer = ImageEnhance.Color(final)
        final = enhancer.enhance(1.1)
        
        final = final.convert("RGB") # Save as JPG for smaller size/web compatibility
        output_path = os.path.join(OUTPUT_DIR, f"{product_name}_lifestyle.jpg")
        final.save(output_path, "JPEG", quality=95)
        print(f"Saved: {output_path}")

    except Exception as e:
        print(f"Error processing {product_name}: {e}")

if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    for name, (src, bg) in PRODUCTS.items():
        create_lifestyle_shot(name, src, bg)
