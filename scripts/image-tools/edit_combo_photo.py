from PIL import Image, ImageFilter, ImageEnhance, ImageOps
from pathlib import Path

def process_combo_image(input_path, output_path):
    print(f"Opening image: {input_path}")
    img = Image.open(input_path).convert("RGBA")
    
    # 1. Background Removal (Slightly more aggressive threshold to clean up edges)
    print("Removing background...")
    # Convert to HSV to better isolate the brown product from the grey/white background
    img_hsv = img.convert("HSV")
    h, s, v = img_hsv.split()
    
    # Use the Value (brightness) channel for thresholding
    # The background is very bright grey/white
    mask = v.point(lambda p: 255 if p < 240 else 0) # 240 is very bright
    # Smooth the mask
    mask = mask.filter(ImageFilter.GaussianBlur(1))
    
    img.putalpha(mask)
    
    # 2. Crop to content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        print(f"Cropped to: {bbox}")

    # 3. Create 2000x2000 white canvas
    canvas_size = (2000, 2000)
    canvas = Image.new("RGB", canvas_size, (255, 255, 255))
    
    # 4. Scale product to fill 80% of canvas height (allowing more room for shadow)
    target_height = int(canvas_size[1] * 0.80)
    ratio = target_height / img.height
    target_width = int(img.width * ratio)
    
    if target_width > canvas_size[0] * 0.9:
        target_width = int(canvas_size[0] * 0.9)
        ratio = target_width / img.width
        target_height = int(img.height * ratio)
        
    img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # 5. Add Refined Drop Shadow (Softer and larger)
    shadow_offset = (0, 30)
    shadow_blur = 50
    shadow_opacity = 45 # Lower opacity for softer feel
    
    # Extract alpha for shadow mask
    alpha_mask = img_resized.split()[3]
    shadow_layer = Image.new("RGBA", img_resized.size, (0, 0, 0, shadow_opacity))
    shadow_layer.putalpha(alpha_mask)
    
    # Paste shadow onto canvas
    padded_shadow = Image.new("RGBA", (img_resized.width + shadow_blur*4, img_resized.height + shadow_blur*4), (0,0,0,0))
    padded_shadow.paste(shadow_layer, (shadow_blur*2, shadow_blur*2))
    padded_shadow = padded_shadow.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    # Calculate position to center product
    pos_x = (canvas_size[0] - img_resized.width) // 2
    pos_y = (canvas_size[1] - img_resized.height) // 2 - 50 # Move up slightly for bottom shadow
    
    canvas_rgba = canvas.convert("RGBA")
    # Paste shadow
    canvas_rgba.paste(padded_shadow, (pos_x - shadow_blur*2 + shadow_offset[0], pos_y - shadow_blur*2 + shadow_offset[1]), padded_shadow)
    
    # Paste product
    canvas_rgba.paste(img_resized, (pos_x, pos_y), img_resized)
    
    # 6. Color Enhancement
    # Boost saturation and contrast for "appetite appeal"
    enhancer_sat = ImageEnhance.Color(canvas_rgba)
    canvas_rgba = enhancer_sat.enhance(1.2) # 20% boost
    
    enhancer_con = ImageEnhance.Contrast(canvas_rgba)
    canvas_rgba = enhancer_con.enhance(1.1) # 10% boost
    
    # Save final
    canvas_rgba.convert("RGB").save(output_path, "JPEG", quality=95)
    print(f"Saved optimized image to: {output_path}")

if __name__ == "__main__":
    src = Path(r"C:\Users\shubh\grocerywebsite\grocerywebsite\haldi,mirch ,dhaniya 200g\2G9A2543.JPG")
    dst = Path(r"C:\Users\shubh\grocerywebsite\grocerywebsite\haldi,mirch ,dhaniya 200g\Rathi_Combo_Main_Optimized.jpg")
    process_combo_image(src, dst)
