#!/usr/bin/env python3
"""
Builds the site icon in every format browsers ask for:

    static/favicon.svg         browser tabs (modern browsers)
    static/favicon.ico         16/32/48px fallback
    static/apple-touch-icon.png  180px home-screen icon (iOS rounds the corners itself)

The mark is a saga in the site's diagram language: the happy path runs
clockwise through three completed steps (paper), the fourth fails (the brass
diamond), and the dashed brass rollback returns to the start.

It's drawn on a 64-unit grid, so at 16px each pixel is exactly four units.

    python3 scripts/build-icons.py

Requires: qlmanage (macOS), magick (ImageMagick).
"""

from __future__ import annotations

import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
STATIC = ROOT / "static"

BRAND = "#4b5320"  # army green
PAPER = "#f6f4ec"
BRASS = "#c29a5b"  # the brighter, dark-theme brass: it holds contrast on green


def mark(radius: float) -> str:
    """The icon as SVG. `radius` rounds the tile; 0 gives a full-bleed square."""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="{radius}" fill="{BRAND}"/>
  <!-- Happy path: start, two completed steps, on to the failure -->
  <path d="M16 16H48V48H16" fill="none" stroke="{PAPER}" stroke-width="4.5" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="6.5" fill="{PAPER}"/>
  <circle cx="48" cy="16" r="6.5" fill="{PAPER}"/>
  <circle cx="48" cy="48" r="6.5" fill="{PAPER}"/>
  <!-- Failed step -->
  <path d="M16 41L23 48L16 55L9 48Z" fill="{BRASS}"/>
  <!-- Rollback, back up to the start -->
  <path d="M16 40.5V31" fill="none" stroke="{BRASS}" stroke-width="4.5" stroke-dasharray="3 2.5"/>
  <path d="M10 31.5L16 24L22 31.5Z" fill="{BRASS}"/>
</svg>
"""


def need(binary: str) -> None:
    if shutil.which(binary) is None:
        sys.exit(f"error: `{binary}` not found on PATH")


def render(svg: str, size: int, tmp: pathlib.Path, name: str) -> pathlib.Path:
    """Rasterise through Quick Look (WebKit). Its output is opaque, which is fine
    for a full-bleed source; rounded corners are cut afterwards with a mask."""
    src = tmp / f"{name}.svg"
    src.write_text(svg, encoding="utf-8")
    subprocess.run(
        ["qlmanage", "-t", "-s", str(size), "-o", str(tmp), str(src)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    out = tmp / f"{name}.svg.png"
    if not out.exists():
        sys.exit("error: Quick Look produced no thumbnail")
    return out


def main() -> None:
    for binary in ("qlmanage", "magick"):
        need(binary)

    (STATIC / "favicon.svg").write_text(mark(radius=14), encoding="utf-8")

    with tempfile.TemporaryDirectory() as t:
        tmp = pathlib.Path(t)
        square = render(mark(radius=0), 512, tmp, "square")

        # Home-screen icon: full bleed, no transparency — iOS applies its own mask.
        subprocess.run(
            ["magick", str(square), "-resize", "180x180", "-strip", str(STATIC / "apple-touch-icon.png")],
            check=True,
        )

        # Tab icon: the same rounded tile as the SVG (14/64 of the side), at 16/32/48.
        rounded = tmp / "rounded.png"
        subprocess.run(
            [
                "magick", str(square),
                "(", "-size", "512x512", "xc:none", "-fill", "white",
                "-draw", "roundrectangle 0,0 511,511 112,112", ")",
                "-compose", "DstIn", "-composite", str(rounded),
            ],
            check=True,
        )
        subprocess.run(
            ["magick", str(rounded), "-define", "icon:auto-resize=48,32,16", str(STATIC / "favicon.ico")],
            check=True,
        )

    for name in ("favicon.svg", "favicon.ico", "apple-touch-icon.png"):
        path = STATIC / name
        print(f"wrote static/{name} ({path.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
