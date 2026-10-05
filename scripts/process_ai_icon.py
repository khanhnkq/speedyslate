#!/usr/bin/env python3
"""
Crops the generated SpeedySlate 3D AI App Icon to a transparent squircle
and exports sharp, optimized PNG assets for Chrome & Firefox (16, 32, 48, 128, 512, 1024).
"""
import os
from PIL import Image, ImageDraw

def create_squircle_mask(width: int, height: int, radius: int) -> Image.Image:
    # 4x supersampling for ultra smooth antialiasing
    scale = 4
    mask = Image.new("L", (width * scale, height * scale), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(
        [0, 0, width * scale, height * scale],
        radius=radius * scale,
        fill=255
    )
    return mask.resize((width, height), Image.Resampling.LANCZOS)

def process_icon():
    source_img_path = "/home/khanhnkq/.gemini/antigravity-cli/brain/759fd066-f4ff-4c1b-87e1-697f52aabf5e/speedyslate_app_icon_1791182623253.jpg"
    if not os.path.exists(source_img_path):
        print(f"Error: Source image not found at {source_img_path}")
        return False

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    icons_dir = os.path.join(base_dir, "public", "icons")
    os.makedirs(icons_dir, exist_ok=True)

    img = Image.open(source_img_path).convert("RGBA")

    # Squircle bounding box in the 1024x1024 generated image
    # The squircle is centered at (512, 512) spanning from ~116 to ~908
    crop_box = (116, 116, 908, 908)
    cropped = img.crop(crop_box)
    w, h = cropped.size

    # Apply squircle mask with rounded corners (~22% radius)
    radius = int(w * 0.22)
    mask = create_squircle_mask(w, h, radius)
    cropped.putalpha(mask)

    # Save master high-res icon
    master_path = os.path.join(icons_dir, "icon1024.png")
    cropped.save(master_path, format="PNG", optimize=True)
    print(f"✓ Created master icon: {master_path} ({w}x{h})")

    # Export all extension target sizes
    sizes = [16, 32, 48, 128, 512]
    for s in sizes:
        # Use high-quality Lanczos resampling
        resized = cropped.resize((s, s), Image.Resampling.LANCZOS)
        out_path = os.path.join(icons_dir, f"icon{s}.png")
        resized.save(out_path, format="PNG", optimize=True)
        print(f"✓ Generated: {out_path} ({s}x{s})")

    # Also keep a copy of the raw artwork for store listings
    store_art_path = os.path.join(icons_dir, "store-artwork.jpg")
    img.convert("RGB").save(store_art_path, format="JPEG", quality=95)
    print(f"✓ Saved store artwork: {store_art_path}")

    return True

if __name__ == "__main__":
    process_icon()
