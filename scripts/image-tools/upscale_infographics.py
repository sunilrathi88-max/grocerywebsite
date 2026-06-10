import os
import cv2
import glob
from PIL import Image

# Directories
INPUT_DIR = r"C:\Users\shubh\.gemini\antigravity\brain\4c469cf6-f97f-4e5b-8545-73ce6cf0c602"
OUTPUT_DIR = r"C:\Users\shubh\grocerywebsite\grocerywebsite\Amazon_Final_Infographics"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Find all generated concept images
images = glob.glob(os.path.join(INPUT_DIR, "image_*_v3_*.png"))

if not images:
    print("No v3 images found to upscale.")
    exit()

print(f"Found {len(images)} images to upscale.")

# Target resolution for Amazon
TARGET_SIZE = (2000, 2000)

for img_path in images:
    filename = os.path.basename(img_path)
    out_path = os.path.join(OUTPUT_DIR, f"UPSCALED_{filename}")
    
    print(f"Processing: {filename}")
    
    # We will use PIL with LANCZOS resampling which is the highest quality 
    # traditional upscaling built into Python's standard imaging library.
    # Note: For TRUE AI Super-Resolution, you need large pre-trained models
    # like EDSR, FSRCNN, or Real-ESRGAN which require downloading hundreds 
    # of megabytes of model weights. Lanczos gives the best structural 
    # enlargement without needing external AI weights.
    
    try:
        with Image.open(img_path) as img:
            # Convert to RGB if it's not (though PNGs usually are)
            if img.mode != 'RGB':
                img = img.convert('RGB')
                
            # Upscale using high-quality Lanczos filter
            upscaled = img.resize(TARGET_SIZE, resample=Image.Resampling.LANCZOS)
            
            # Save at maximum quality
            upscaled.save(out_path, quality=100)
            print(f"  -> Saved high-res to: {out_path}")
            
    except Exception as e:
        print(f"  -> Error processing {filename}: {e}")

print("\nUpscaling complete! Check the Amazon_Final_Infographics folder.")
