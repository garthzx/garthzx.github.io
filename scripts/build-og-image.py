#!/usr/bin/env python3
"""
Builds the Open Graph share card (static/og.png) from the site's design tokens.

The card is authored as SVG and rasterised with macOS Quick Look, which renders
through WebKit and so honours @font-face, patterns and gradients. Quick Look
only emits square thumbnails, so the artwork is drawn into the top 1200x630 of a
1200x1200 canvas and cropped afterwards — at a square source size the render is
exactly 1:1, with no scaling or offset.

Poppins is embedded as a data URI because it is not installed system-wide;
JetBrains Mono is referenced by family name.

    python3 scripts/build-og-image.py

Requires: curl, qlmanage (macOS), magick (ImageMagick).
"""

from __future__ import annotations

import base64
import pathlib
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_PNG = ROOT / "static" / "og.png"
OUT_SVG = ROOT / "scripts" / "og-card.svg"
AVATAR = ROOT / "src" / "lib" / "assets" / "me.jpg"

W, H = 1200, 630

# Design tokens, mirrored from src/routes/layout.css
CANVAS = "#f8f8ff"
BRAND = "#747fe0"
INK = "#525f7f"
INK_SOFT = "#7a86a3"
INK_FAINT = "#9aa3bb"
MINT = "#92eac0"
HAIRLINE = "#e6e8f0"

POPPINS = {
    600: "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6V1s.ttf",
    400: "https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrFJA.ttf",
}

CHIPS = ["TypeScript", "Node.js", "PostgreSQL", "Inngest", "Stripe", "SvelteKit"]


def need(binary: str) -> None:
    if shutil.which(binary) is None:
        sys.exit(f"error: `{binary}` not found on PATH")


def fetch_font(url: str, cache: pathlib.Path) -> str:
    """Download a font once and return it as a base64 data URI payload."""
    cache.parent.mkdir(parents=True, exist_ok=True)
    if not cache.exists():
        subprocess.run(["curl", "-fsSL", "-o", str(cache), url], check=True)
    return base64.b64encode(cache.read_bytes()).decode()


def chip_width(label: str) -> float:
    """Approximate Poppins 400 @22px advance width, plus horizontal padding."""
    return len(label) * 12.2 + 36


def build_svg(fonts: dict[int, str], avatar_b64: str) -> str:
    chips: list[str] = []
    x = 90.0
    for label in CHIPS:
        w = chip_width(label)
        chips.append(
            f'<rect x="{x:.1f}" y="404" width="{w:.1f}" height="46" rx="10" '
            f'fill="#ffffff" stroke="{MINT}" stroke-width="1.5"/>'
            f'<text x="{x + w / 2:.1f}" y="433" text-anchor="middle" '
            f'font-family="Poppins" font-size="22" fill="{INK_SOFT}">{label}</text>'
        )
        x += w + 12

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <style>
    @font-face {{ font-family:'Poppins'; font-weight:400; src:url(data:font/ttf;base64,{fonts[400]}) format('truetype'); }}
    @font-face {{ font-family:'Poppins'; font-weight:600; src:url(data:font/ttf;base64,{fonts[600]}) format('truetype'); }}
  </style>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="{BRAND}" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="18%" cy="8%" r="62%">
      <stop offset="0%" stop-color="{BRAND}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="{BRAND}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="88%" cy="96%" r="46%">
      <stop offset="0%" stop-color="{MINT}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="{MINT}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="avatar"><circle cx="1012" cy="212" r="92"/></clipPath>
  </defs>

  <!-- Quick Look pads to a square; everything below 630 is cropped away. -->
  <rect width="1200" height="1200" fill="#ffffff"/>

  <rect width="{W}" height="{H}" fill="{CANVAS}"/>
  <rect width="{W}" height="{H}" fill="url(#grid)"/>
  <rect width="{W}" height="{H}" fill="url(#glow)"/>
  <rect width="{W}" height="{H}" fill="url(#glow2)"/>

  <!-- Avatar, ringed the way the site header rings it -->
  <circle cx="1012" cy="212" r="102" fill="{BRAND}" fill-opacity="0.15"/>
  <image href="data:image/jpeg;base64,{avatar_b64}" x="920" y="120" width="184" height="184"
         preserveAspectRatio="xMidYMid slice" clip-path="url(#avatar)"/>
  <circle cx="1012" cy="212" r="92" fill="none" stroke="{BRAND}" stroke-width="2.5"/>

  <!-- Wordmark -->
  <text x="90" y="212" font-family="JetBrains Mono" font-size="72" font-weight="800"
        fill="{BRAND}" letter-spacing="2">&gt; Garth Dustin</text>

  <line x1="90" y1="258" x2="700" y2="258" stroke="{HAIRLINE}" stroke-width="2"/>

  <!-- Role -->
  <text x="90" y="312" font-family="Poppins" font-size="38" font-weight="600" fill="{INK}">
    Full-Stack Software Engineer
  </text>
  <text x="90" y="358" font-family="Poppins" font-size="27" font-weight="400" fill="{INK_SOFT}">
    Backend Systems &amp; Business Automation
  </text>

  <!-- Stack -->
  {"".join(chips)}

  <!-- Footer -->
  <line x1="90" y1="508" x2="1110" y2="508" stroke="{HAIRLINE}" stroke-width="2"/>
  <text x="90" y="556" font-family="Poppins" font-size="25" font-weight="400" fill="{INK_FAINT}">
    Currently at <tspan fill="{BRAND}" font-weight="600">Dentalflo AI</tspan>
    <tspan fill="{INK_FAINT}"> &#183; Mandaluyong City, Philippines</tspan>
  </text>
</svg>
"""


def main() -> None:
    for binary in ("curl", "qlmanage", "magick"):
        need(binary)
    if not AVATAR.exists():
        sys.exit(f"error: avatar not found at {AVATAR}")

    cache_dir = ROOT / ".cache" / "fonts"
    fonts = {w: fetch_font(url, cache_dir / f"poppins-{w}.ttf") for w, url in POPPINS.items()}
    avatar_b64 = base64.b64encode(AVATAR.read_bytes()).decode()

    svg = build_svg(fonts, avatar_b64)
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = pathlib.Path(tmp)
        src = tmp_path / "og.svg"
        src.write_text(svg, encoding="utf-8")

        subprocess.run(
            ["qlmanage", "-t", "-s", "1200", "-o", str(tmp_path), str(src)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        rendered = tmp_path / "og.svg.png"
        if not rendered.exists():
            sys.exit("error: Quick Look produced no thumbnail")

        subprocess.run(
            ["magick", str(rendered), "-crop", f"{W}x{H}+0+0", "+repage",
             "-strip", "-quality", "92", str(OUT_PNG)],
            check=True,
        )

    # Keep an editable copy of the source, without the megabytes of base64.
    OUT_SVG.write_text(
        build_svg({400: "", 600: ""}, "").replace(
            "src:url(data:font/ttf;base64,) format('truetype');",
            "src:local('Poppins');",
        ),
        encoding="utf-8",
    )

    size = OUT_PNG.stat().st_size
    print(f"wrote {OUT_PNG.relative_to(ROOT)} ({W}x{H}, {size / 1024:.0f} KB)")
    print(f"wrote {OUT_SVG.relative_to(ROOT)} (editable source; fonts/avatar not embedded)")


if __name__ == "__main__":
    main()
