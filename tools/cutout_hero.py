"""
Produce the hero illustration for the landing page.

The standalone student render cannot be keyed off its black background: its
glow is brighter than the character's own dark areas (background ring median
luminance 67 vs hoodie 68, cap 70, hair 80), so no threshold separates them,
and the soft 3D edges let a flood fill walk straight into the objects.

So take the figure from the mockup instead, where it already sits on the light
background, and feather the crop edges so it melts into the page instead of
showing a rectangle.

Run:  python tools/cutout_hero.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

SRC = Path.home() / 'Downloads' / 'EduNavigator_ Your Digital Learning Companion.png'
OUT = Path('public/hero-student.webp')
PREVIEW = Path('tools/_preview.png')

# Fractions of the mockup holding the figure, desk, globe and floating icons.
# The left edge starts past the headline text, which costs the small stack of
# books but avoids carrying stray letters into the image.
BOX = (0.497, 0.105, 1.0, 0.735)

FEATHER = 72      # px of alpha falloff at the crop edges
MAX_WIDTH = 1100  # plenty for a hero at 2x without bloating the page


def main():
    im = Image.open(SRC).convert('RGB')
    W, H = im.size
    box = (int(BOX[0] * W), int(BOX[1] * H), int(BOX[2] * W), int(BOX[3] * H))
    crop = im.crop(box)

    if crop.width > MAX_WIDTH:
        scale = MAX_WIDTH / crop.width
        crop = crop.resize((MAX_WIDTH, round(crop.height * scale)), Image.LANCZOS)

    w, h = crop.size

    # Feather all four edges: the image sits inside its own column rather than
    # bleeding off the viewport, so every side is visible and a hard edge reads
    # as a pasted-on rectangle.
    mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rectangle([FEATHER, FEATHER, w - 1 - FEATHER, h - 1 - FEATHER], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(FEATHER / 2.4))

    out = crop.convert('RGBA')
    out.putalpha(mask)

    # WebP keeps the alpha feather at roughly a fifth of the PNG's weight,
    # which matters for students opening this on mobile data.
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, format='WEBP', quality=86, method=6)

    # The page background must match the plate the figure was cut from, or the
    # feathered edge fades into the wrong colour.
    samples = [crop.getpixel(p) for p in
               ((8, h // 2), (w // 2, 8), (w - 8, 8), (8, 8))]
    avg = tuple(sum(c[i] for c in samples) // len(samples) for i in range(3))

    bg = Image.new('RGB', out.size, avg)
    bg.paste(out, (0, 0), out)
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    bg.save(PREVIEW)

    print(f'mockup     {W}x{H}')
    print(f'cropped    {w}x{h}')
    print(f'plate rgb  {avg}  ->  #{avg[0]:02X}{avg[1]:02X}{avg[2]:02X}')
    print(f'written    {OUT}  ({OUT.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
