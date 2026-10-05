#!/usr/bin/env python3
"""
SpeedySlate App Icon Generator
Generates high-resolution PNG icons (16, 32, 48, 128, 512) and SVG source.
Design Concept:
- Deep obsidian squircle container with subtle crimson ambient rim
- Stylized Manga Speech Bubble in fiery neon crimson (#FF3B47 -> #E52E3D -> #9B111E)
- Dynamic central speed lightning bolt in pure white with electric glow
- Manga speed accents for ultra-fast anime translation branding
"""
import os
import math
from PIL import Image, ImageDraw, ImageFilter

SVG_CONTENT = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A0D10" />
      <stop offset="50%" stop-color="#0E0A0D" />
      <stop offset="100%" stop-color="#070608" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3B47" stop-opacity="0.4" />
      <stop offset="50%" stop-color="#E52E3D" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#261014" stop-opacity="0.6" />
    </linearGradient>

    <!-- Bubble Fiery Neon Gradient -->
    <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF4D5A" />
      <stop offset="35%" stop-color="#E52E3D" />
      <stop offset="100%" stop-color="#9B0E1B" />
    </linearGradient>

    <!-- Lightning Bolt Gradient -->
    <linearGradient id="boltGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#FFF0F2" />
      <stop offset="100%" stop-color="#FFCCD0" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="boltShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#4D0007" flood-opacity="0.7" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="4" />

  <!-- Ambient Glow Behind Bubble -->
  <circle cx="256" cy="245" r="140" fill="#E52E3D" opacity="0.18" filter="url(#neonGlow)" />

  <!-- Manga Comic Speech Bubble Shadow -->
  <path d="M 125,230 C 125,150 180,95 260,95 C 340,95 395,150 395,230 C 395,310 340,365 260,365 C 220,365 190,355 165,340 L 115,385 C 105,394 95,385 100,372 L 122,315 C 105,290 125,255 125,230 Z"
        fill="#000000" opacity="0.4" transform="translate(0, 10)" filter="url(#neonGlow)" />

  <!-- Manga Comic Speech Bubble Body -->
  <path d="M 125,225 C 125,145 180,90 260,90 C 340,90 395,145 395,225 C 395,305 340,360 260,360 C 220,360 190,350 165,335 L 115,380 C 105,389 95,380 100,367 L 122,310 C 105,285 125,250 125,225 Z"
        fill="url(#bubbleGrad)" stroke="#FF858E" stroke-width="3" stroke-opacity="0.5" />

  <!-- Manga Speed Lightning Bolt -->
  <path d="M 285,130 L 205,245 L 260,245 L 225,340 L 320,215 L 265,215 Z"
        fill="url(#boltGrad)" filter="url(#boltShadow)" stroke="#FFFFFF" stroke-width="2" />

  <!-- Manga Sparkles / Speed Sparks -->
  <circle cx="365" cy="145" r="5" fill="#FFFFFF" opacity="0.85" />
  <circle cx="150" cy="140" r="3.5" fill="#FF858E" opacity="0.75" />
  <circle cx="370" cy="305" r="4" fill="#FFA5AC" opacity="0.8" />
  <polygon points="360,180 366,183 360,186 357,183" fill="#FFFFFF" opacity="0.9" />
</svg>
'''

def render_icon_pil(size: int) -> Image.Image:
    """Renders a pixel-perfect, crisp icon at specified resolution using PIL."""
    scale = 4 if size <= 48 else 2
    render_size = size * scale
    img = Image.new("RGBA", (render_size, render_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = int(render_size * 0.035)
    box_w = render_size - margin * 2
    radius = int(box_w * 0.23)

    # 1. Dark background squircle
    draw.rounded_rectangle(
        [margin, margin, render_size - margin, render_size - margin],
        radius=radius,
        fill=(14, 10, 13, 255),
        outline=(229, 46, 61, 80),
        width=max(1, int(render_size * 0.015))
    )

    # 2. Ambient Crimson Glow
    glow_size = int(render_size * 0.6)
    glow_box = [
        int(render_size * 0.5 - glow_size * 0.5),
        int(render_size * 0.48 - glow_size * 0.5),
        int(render_size * 0.5 + glow_size * 0.5),
        int(render_size * 0.48 + glow_size * 0.5)
    ]
    glow_img = Image.new("RGBA", (render_size, render_size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    glow_draw.ellipse(glow_box, fill=(229, 46, 61, 45))
    glow_img = glow_img.filter(ImageFilter.GaussianBlur(int(render_size * 0.08)))
    img.alpha_composite(glow_img)

    # 3. Manga Speech Bubble
    # Ellipse center (cx, cy) and radii (rx, ry)
    cx, cy = render_size * 0.51, render_size * 0.46
    rx, ry = render_size * 0.31, render_size * 0.27

    bubble_points = []
    num_pts = 64
    for i in range(num_pts):
        angle = 2 * math.pi * i / num_pts
        # Carve out tail at bottom-left (~ 125 - 145 deg)
        deg = math.degrees(angle) % 360
        if 125 <= deg <= 145:
            continue
        x = cx + rx * math.cos(angle)
        y = cy + ry * math.sin(angle)
        bubble_points.append((x, y))

    # Tail points pointing downwards-left
    tail_tip = (render_size * 0.23, render_size * 0.77)
    tail_top = (cx - rx * 0.65, cy + ry * 0.60)
    tail_bot = (cx - rx * 0.25, cy + ry * 0.95)

    full_polygon = [tail_top, tail_tip, tail_bot] + bubble_points

    # Bubble Drop Shadow
    shadow_img = Image.new("RGBA", (render_size, render_size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    s_pts = [(x, y + int(render_size * 0.03)) for x, y in full_polygon]
    s_draw.polygon(s_pts, fill=(0, 0, 0, 160))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(int(render_size * 0.04)))
    img.alpha_composite(shadow_img)

    # Bubble Body with gradient effect
    draw.polygon(full_polygon, fill=(229, 46, 61, 255), outline=(255, 110, 120, 180))

    # Inner highlight on bubble top edge
    inner_rx, inner_ry = rx * 0.85, ry * 0.82
    draw.arc(
        [cx - inner_rx, cy - inner_ry, cx + inner_rx, cy + inner_ry],
        start=190,
        end=350,
        fill=(255, 180, 190, 120),
        width=max(1, int(render_size * 0.018))
    )

    # 4. Lightning Bolt in Center
    bx, by = render_size * 0.50, render_size * 0.45
    bw, bh = render_size * 0.28, render_size * 0.44

    bolt_pts = [
        (bx + bw * 0.20, by - bh * 0.50),  # Top point
        (bx - bw * 0.40, by + bh * 0.02),  # Mid left inner
        (bx - bw * 0.05, by + bh * 0.02),  # Mid plateau
        (bx - bw * 0.30, by + bh * 0.50),  # Bottom point
        (bx + bw * 0.42, by - bh * 0.06),  # Mid right inner
        (bx + bw * 0.08, by - bh * 0.06),  # Mid plateau
    ]

    # Bolt Drop Shadow
    b_shadow = Image.new("RGBA", (render_size, render_size), (0, 0, 0, 0))
    bs_draw = ImageDraw.Draw(b_shadow)
    bs_draw.polygon([(x, y + int(render_size * 0.02)) for x, y in bolt_pts], fill=(100, 10, 20, 200))
    b_shadow = b_shadow.filter(ImageFilter.GaussianBlur(int(render_size * 0.02)))
    img.alpha_composite(b_shadow)

    # Pure White Dynamic Bolt
    draw.polygon(bolt_pts, fill=(255, 255, 255, 255), outline=(255, 235, 240, 220))

    # 5. Speed Sparkles
    sparkle_pos = [
        (render_size * 0.73, render_size * 0.29, render_size * 0.016),
        (render_size * 0.28, render_size * 0.28, render_size * 0.012),
        (render_size * 0.74, render_size * 0.62, render_size * 0.013)
    ]
    for sx, sy, sr in sparkle_pos:
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(255, 255, 255, 230))

    # Resize down with Lanczos resampling for ultra-high sharpness
    return img.resize((size, size), Image.Resampling.LANCZOS)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    icons_dir = os.path.join(base_dir, "public", "icons")
    os.makedirs(icons_dir, exist_ok=True)

    # 1. Write SVG master
    svg_path = os.path.join(icons_dir, "icon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(SVG_CONTENT.strip())
    print(f"✓ Created master vector icon: {svg_path}")

    # 2. Render all required icon sizes
    sizes = [16, 32, 48, 128, 512]
    for size in sizes:
        png_img = render_icon_pil(size)
        out_path = os.path.join(icons_dir, f"icon{size}.png")
        png_img.save(out_path, format="PNG", optimize=True)
        print(f"✓ Generated: {out_path} ({size}x{size})")

if __name__ == "__main__":
    main()
