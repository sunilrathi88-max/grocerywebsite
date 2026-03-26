from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

def create_comparison(ref_path, gen_path, out_path):
    ref = Image.open(ref_path).convert("RGB")
    gen = Image.open(gen_path).convert("RGB")
    
    # Resize to match heights
    h = 800
    w_ref = int(ref.width * (h / ref.height))
    w_gen = int(gen.width * (h / gen.height))
    
    ref = ref.resize((w_ref, h), Image.Resampling.LANCZOS)
    gen = gen.resize((w_gen, h), Image.Resampling.LANCZOS)
    
    # Create canvas
    margin = 50
    canvas_w = w_ref + w_gen + margin * 3
    canvas_h = h + margin * 2 + 100 # Extra space for labels
    
    canvas = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
    
    # Paste images
    canvas.paste(ref, (margin, margin + 50))
    canvas.paste(gen, (margin * 2 + w_ref, margin + 50))
    
    # Add labels
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
        
    draw.text((margin + (w_ref//4), 20), "YOUR REFERENCE", fill=(100, 100, 100), font=font)
    draw.text((margin * 2 + w_ref + (w_gen//4), 20), "RATHI MASTER GENERATOR", fill=(164, 120, 100), font=font)
    
    canvas.save(out_path)

if __name__ == "__main__":
    # Note: Use the most recent optimized red chilli if possible
    # Reference is Red Chilli 500g
    # My closest is 200g but the aesthetic is what matters
    ref = Path(r"C:\Users\shubh\.gemini\antigravity\brain\e2d2486a-7afe-41c8-a2d2-ff040cf184dd\media__1774423525120.jpg")
    gen = Path(r"C:\Users\shubh\grocerywebsite\grocerywebsite\haldi,mirch ,dhaniya 200g\Final_Premium\2G9A2536_Optimized_Premium.jpg")
    out = Path(r"C:\Users\shubh\.gemini\antigravity\brain\e2d2486a-7afe-41c8-a2d2-ff040cf184dd\comparison_report.jpg")
    
    create_comparison(ref, gen, out)
