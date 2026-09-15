#!/usr/bin/env python3
"""Regenerate public/og.png, the card shown when the site is shared.

    python3 scripts/make-og.py

1200x630 is the size LinkedIn, X and Slack all crop toward. The palette matches
the site so a shared link looks like the page it opens.

The three figures are READ OUT OF public/index.html rather than hardcoded here.
The homepage is the single source of truth for them, so the card cannot quietly
disagree with the page it advertises -- which is exactly what happened the first
time the numbers were refreshed.
"""
import html
import os
import re
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, "..", "public")
HOME = os.path.join(PUBLIC, "index.html")
OUT = os.path.join(PUBLIC, "og.png")

W, H = 1200, 630
BG = (11, 11, 11)
INK = (231, 231, 231)
MUTED = (154, 154, 154)
FONTS = r"C:\Windows\Fonts"


def font(names, size):
    for n in names:
        p = os.path.join(FONTS, n)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def read_stats():
    """Pull the three stat tiles straight out of the homepage."""
    with open(HOME, encoding="utf-8") as fh:
        src = fh.read()

    values = re.findall(
        r'<span class="oss-stat__value"[^>]*>(.*?)</span>', src, re.S
    )
    labels = re.findall(
        r'<span class="oss-stat__label">(.*?)</span>', src, re.S
    )
    if len(values) < 3 or len(labels) < 3:
        sys.exit(
            "could not read three stat tiles from index.html "
            "(found %d values, %d labels) -- has the markup changed?"
            % (len(values), len(labels))
        )

    clean = lambda s: html.unescape(re.sub(r"<[^>]+>", "", s)).strip()
    return [(clean(v), clean(l)) for v, l in zip(values[:3], labels[:3])]


def main():
    stats = read_stats()
    print("figures read from index.html:")
    for v, l in stats:
        print("   %-10s %s" % (v, l))

    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img, "RGBA")

    # The same 60px grid the site paints behind every page.
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 7), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 7), width=1)

    f_name = font(["seguisb.ttf", "segoeuib.ttf", "arialbd.ttf"], 76)
    f_sub = font(["segoeui.ttf", "arial.ttf"], 27)
    f_mono = font(["consola.ttf", "cour.ttf"], 20)
    f_stat = font(["consolab.ttf", "consola.ttf"], 46)
    f_lbl = font(["segoeui.ttf", "arial.ttf"], 19)

    PAD = 74
    d.text((PAD, 86), "ALKINDIX.COM", font=f_mono, fill=(255, 255, 255, 110))
    d.text((PAD, 130), "Mohammed Alkindi", font=f_name, fill=INK)
    d.text((PAD, 232), "I build systems you can audit.", font=f_sub, fill=MUTED)
    d.line([(PAD, 320), (W - PAD, 320)], fill=(255, 255, 255, 34), width=1)

    x = PAD
    col = (W - PAD * 2) // 3
    for value, label in stats:
        d.text((x, 364), value, font=f_stat, fill=INK)
        # Labels are written for the page and can run long for a 3-up card.
        short = label.replace("Combined stars of those projects", "Combined stars")
        d.text((x, 428), short, font=f_lbl, fill=MUTED)
        x += col

    d.line([(PAD, 512), (W - PAD, 512)], fill=(255, 255, 255, 22), width=1)
    d.text(
        (PAD, 542),
        "Incoming CS @ UC San Diego  \u00b7  Founder, ProofX  \u00b7  Thiel Fellowship Semifinalist",
        font=f_mono,
        fill=(255, 255, 255, 140),
    )

    img.save(OUT, "PNG", optimize=True)
    print()
    print("wrote %s  %dx%d  %d bytes" % (OUT, img.width, img.height, os.path.getsize(OUT)))


if __name__ == "__main__":
    main()
