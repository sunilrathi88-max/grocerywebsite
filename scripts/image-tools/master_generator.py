import os
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import sys

class RathiImageGenerator:
    def __init__(self, canvas_size=(2000, 2000)):
        self.canvas_size = canvas_size
        # Premium Background Color (Off-white as per reference)
        self.PREMIUM_BG = (250, 249, 246) # #FAF9F6 
        self.WHITE_BG = (255, 255, 255)
        
    def remove_background(self, img, threshold=240):
        """Advanced background removal using HSV for better spice-pouch isolation."""
        print("    - Extracting product from background...")
        img_hsv = img.convert("HSV")
        h, s, v = img_hsv.split()
        
        # Background is usually the brightest part
        mask = v.point(lambda p: 255 if p < threshold else 0)
        
        # Smooth the mask to avoid jagged edges
        mask = mask.filter(ImageFilter.GaussianBlur(1.5))
        
        result = img.copy()
        result.putalpha(mask)
        return result

    def get_shadow(self, product_img, opacity=50, blur=60, offset=(0, 40)):
        """Create a soft, realistic grounding shadow based on product shape."""
        # Extract alpha as shadow shape
        alpha = product_img.split()[3]
        shadow_layer = Image.new("RGBA", product_img.size, (0, 0, 0, opacity))
        shadow_layer.putalpha(alpha)
        
        # Create a larger canvas for the blur
        padding = blur * 3
        shadow_canvas = Image.new("RGBA", (product_img.width + padding, product_img.height + padding), (0, 0, 0, 0))
        shadow_canvas.paste(shadow_layer, (padding // 2, padding // 2))
        
        # Blur the shadow
        shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(blur))
        
        return shadow_canvas, padding // 2

    def apply_color_grading(self, img, filename):
        """Apply a cleaner, more natural look to avoid the 'yellow' tint."""
        fname = filename.lower()
        is_back = any(x in fname for x in ['back', 'nutrition', 'ingredients'])
        is_coriander = 'dhaniya' in fname or 'coriander' in fname
        is_chilli = 'mirch' in fname or 'chilli' in fname or 'mirchi' in fname
        
        print(f"    - Applying natural grading for {filename}...")
        
        # 1. Subtle Contrast & Brightness (Cleaner background)
        img = ImageEnhance.Contrast(img).enhance(1.08)
        img = ImageEnhance.Brightness(img).enhance(1.02)
        
        # 2. Balanced Warmth (Avoiding the 'Burned/Yellow' look)
        # We only apply a VERY tiny warmth boost for Turmeric, and keep Coriander cool.
        r, g, b, a = img.split()
        if is_coriander:
            # Keep Coriander neutral/cool to preserve green seeds/powder
            b = ImageEnhance.Brightness(b).enhance(1.02) # Slight blue boost to cool it down
        elif not is_chilli:
            # Subtle gold for Turmeric/others
            r = ImageEnhance.Brightness(r).enhance(1.03)
            b = ImageEnhance.Brightness(b).enhance(0.98)
            
        img = Image.merge("RGBA", (r, g, b, a))
        
        # 3. Selective Saturation (Vibrant Spice Window) - Only for Front shots
        if not is_back:
            width, height = img.size
            window_top = int(height * 0.45)
            window_bottom = int(height * 0.75)
            
            from PIL import ImageDraw
            window_mask = Image.new("L", (width, height), 0)
            draw = ImageDraw.Draw(window_mask)
            draw.rectangle([0, window_top, width, window_bottom], fill=255)
            window_mask = window_mask.filter(ImageFilter.GaussianBlur(20))
            
            sat_factor = 1.35 if not is_coriander else 1.20 # Coriander needs less saturation
            converter = ImageEnhance.Color(img)
            saturated_img = converter.enhance(sat_factor)
            img = Image.composite(saturated_img, img, window_mask)
            
        # 4. Final Polish (Crisp but Neutral)
        img = ImageEnhance.Color(img).enhance(1.05) if is_back else ImageEnhance.Color(img).enhance(1.08)
        
        return img

    def process_image(self, input_path, output_path, mode='amazon', use_shadow=False):
        """Process a single product image."""
        bg_color = self.WHITE_BG if mode == 'amazon' else self.PREMIUM_BG
        fill_ratio = 0.85 if mode == 'amazon' else 0.80
        
        print(f"  [Processing] {input_path.name} ({mode} mode)")
        
        try:
            # 1. Load and Remove BG
            img = Image.open(input_path).convert("RGBA")
            pouch = self.remove_background(img, threshold=242)
            
            # 2. Tight Crop
            bbox = pouch.getbbox()
            if bbox:
                pouch = pouch.crop(bbox)
            
            # 3. Apply Premium Aesthetic Enhancements (Matching Reference)
            pouch = self.apply_color_grading(pouch, input_path.name)
            
            # 4. Scale to Canvas (Robust calculation)
            target_h = int(self.canvas_size[1] * fill_ratio)
            ratio = target_h / pouch.height
            target_w = int(pouch.width * ratio)
            
            # Ensure width doesn't overflow
            if target_w > self.canvas_size[0] * 0.9:
                target_w = int(self.canvas_size[0] * 0.9)
                ratio = target_w / pouch.width
                target_h = int(pouch.height * ratio)
            
            pouch_resized = pouch.resize((target_w, target_h), Image.Resampling.LANCZOS)
            pouch_resized = pouch_resized.filter(ImageFilter.SHARPEN)
            
            # 5. Build Final Composition
            canvas = Image.new("RGBA", self.canvas_size, bg_color + (255,))
            
            pos_x = (self.canvas_size[0] - target_w) // 2
            pos_y = (self.canvas_size[1] - target_h) // 2 - (20 if mode == 'amazon' else 40)
            
            if use_shadow:
                shadow_opacity = 70 if mode == 'amazon' else 55
                shadow_blur = 55 if mode == 'amazon' else 75
                shadow_offset = 40 if mode == 'amazon' else 60
                shadow, shadow_pad = self.get_shadow(pouch_resized, opacity=shadow_opacity, blur=shadow_blur)
                shadow_pos = (pos_x - shadow_pad, pos_y - shadow_pad + shadow_offset)
                canvas.paste(shadow, shadow_pos, shadow)
            
            canvas.paste(pouch_resized, (pos_x, pos_y), pouch_resized)
            
            # 6. Save
            canvas.convert("RGB").save(output_path, "JPEG", quality=95, subsampling=0)
            print(f"    Saved to: {output_path.name}")
            return True
            
        except Exception as e:
            print(f"    Error processing {input_path.name}: {e}")
            return False

    def batch_process(self, input_dir, output_dir, mode='amazon', use_shadow=False):
        """Process all images in a directory."""
        input_dir = Path(input_dir)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        supported_exts = ('.jpg', '.jpeg', '.png', '.JPG', '.PNG')
        files = [f for f in input_dir.iterdir() if f.suffix in supported_exts]
        
        if not files:
            print(f"No valid image files found in {input_dir}")
            return
        
        print(f"\nBatch Starting: {len(files)} files in {mode} mode (Shadow: {use_shadow})")
        print("-" * 60)
        
        success_count = 0
        for f in files:
            # Skip already optimized ones to avoid loops
            if "_Optimized" in f.name:
                continue
                
            out_name = f.stem + f"_Optimized_{mode.capitalize()}.jpg"
            out_path = output_dir / out_name
            if self.process_image(f, out_path, mode=mode, use_shadow=use_shadow):
                success_count += 1
                
        print("-" * 60)
        print(f"Completed: {success_count}/{len(files)} optimized.")

def main():
    generator = RathiImageGenerator()
    
    # Target Directory (200g SKU folder)
    RAW_DIR = Path(r"C:\Users\shubh\grocerywebsite\grocerywebsite\haldi,mirch ,dhaniya 200g")
    
    # New "Flat Studio" outputs (Match User Gold Standard)
    flat_studio_amazon = RAW_DIR / "Flat_Studio_Amazon"
    flat_studio_premium = RAW_DIR / "Flat_Studio_Premium"
    
    print("Generating 'Flat Studio' (Gold Standard) Aesthetic...")
    
    # 1. Amazon Mode (Pure White, Shadowless)
    generator.batch_process(RAW_DIR, flat_studio_amazon, mode='amazon', use_shadow=False)
    
    # 2. Premium Mode (Off-White, Shadowless)
    generator.batch_process(RAW_DIR, flat_studio_premium, mode='premium', use_shadow=False)

if __name__ == "__main__":
    main()
