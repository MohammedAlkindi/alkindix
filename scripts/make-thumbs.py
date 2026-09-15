#!/usr/bin/env python3
"""Regenerate the responsive WebP thumbnails for the photography grid.

Run this after adding or removing anything in public/images/photography/:

    python3 scripts/make-thumbs.py

Why two widths. The grid is 4 columns inside a min(1100px, 92%) container, so
a desktop cell is about 275 CSS px, or 550 device px on a 2x screen. Shipping
the 1500x2000 original into that cell sends roughly 30x the pixels the browser
can use.

    480w  desktop retina (275px cell at 2x) and the 2-column tablet layout
    960w  the 1-column phone layout at 2x, and tablet retina

The original JPEG stays as the widest srcset candidate and remains the lightbox
source, so full resolution is always one click away.

Existing thumbnails are overwritten; thumbnails whose source is gone are
removed, so the directory never drifts from the source set.
"""
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "public", "images", "photography")
OUT = os.path.join(SRC, "thumbs")
WIDTHS = (480, 960)
QUALITY = 80


def main():
    if not os.path.isdir(SRC):
        sys.exit("source directory not found: %s" % SRC)
    os.makedirs(OUT, exist_ok=True)

    sources = sorted(
        f for f in os.listdir(SRC) if f.lower().endswith((".jpg", ".jpeg", ".png"))
    )
    if not sources:
        sys.exit("no source images found in %s" % SRC)

    expected = set()
    written = 0
    src_bytes = 0
    out_bytes = 0

    for name in sources:
        path = os.path.join(SRC, name)
        src_bytes += os.path.getsize(path)
        stem = os.path.splitext(name)[0]

        with Image.open(path) as im:
            im = im.convert("RGB")
            for width in WIDTHS:
                # Never upscale: a source narrower than the target keeps its own size.
                if im.width <= width:
                    continue
                target = "%s-%dw.webp" % (stem, width)
                expected.add(target)
                height = round(im.height * width / im.width)
                dest = os.path.join(OUT, target)
                im.resize((width, height), Image.LANCZOS).save(
                    dest, "WEBP", quality=QUALITY, method=6
                )
                out_bytes += os.path.getsize(dest)
                written += 1

    # Drop thumbnails whose source no longer exists.
    removed = 0
    for stale in os.listdir(OUT):
        if stale.endswith(".webp") and stale not in expected:
            os.remove(os.path.join(OUT, stale))
            removed += 1

    print("sources      : %d" % len(sources))
    print("thumbnails   : %d written, %d stale removed" % (written, removed))
    print("originals    : %.1f MB" % (src_bytes / 1048576))
    print("thumbnails   : %.1f MB" % (out_bytes / 1048576))
    print()
    print("If you added or removed photographs, the gallery markup in")
    print("public/creative/photography/index.html also needs its srcset,")
    print("numbering and counts updated to match.")


if __name__ == "__main__":
    main()
