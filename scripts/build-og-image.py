#!/usr/bin/env python3
"""
Builds the Open Graph share card (static/og.png) — the image LinkedIn, Slack,
X and iMessage show when the site is linked.

The card is authored as SVG and rasterised with macOS Quick Look, which renders
through WebKit and so honours @font-face. Quick Look only emits square
thumbnails, so the artwork is drawn into the top 1200x630 of a 1200x1200 canvas
and cropped afterwards; at a square source size the render is exactly 1:1.

The site's three typefaces are fetched from Google Fonts once (cached in
.cache/fonts) and embedded as data URIs, so the render doesn't depend on what
is installed locally.

    python3 scripts/build-og-image.py

Requires: curl, qlmanage (macOS), magick (ImageMagick).
"""

from __future__ import annotations

import base64
import hashlib
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_PNG = ROOT / "static" / "og.png"
OUT_SVG = ROOT / "scripts" / "og-card.svg"
PORTRAIT = ROOT / "src" / "lib" / "assets" / "me.jpg"
FONT_CACHE = ROOT / ".cache" / "fonts"

W, H = 1200, 630

# Content — kept in step with src/lib/data/site.ts by hand.
NAME_FIRST = "Garth Dustin"
NAME_LAST = "Ayang-ang"
ROLE = "Full-Stack Software Engineer"
URL = "garthzx.github.io"
CITY = "Tuguegarao City"
FACTS = [
    ("Currently", "Dentalflo AI"),
    ("Focus", "Backend systems & automation"),
    ("Stack", "TypeScript · Hono · PostgreSQL"),
]

# Design tokens, mirrored from src/routes/layout.css (light theme).
PAPER = "#f6f4ec"
SURFACE = "#fcfbf6"
INK = "#1f2218"
DEEP = "#2c3119"
MUTED = "#5c6152"
BRAND = "#4b5320"
SAGE = "#8a9268"
HAIR = "#d9d7c8"
BRASS = "#a8834a"
BRASS_TEXT = "#7a5c2e"

# Static instances: Newsreader at its display optical size, as the site's headline uses it.
FONTS_CSS = (
    "https://fonts.googleapis.com/css2"
    "?family=Newsreader:ital,opsz,wght@0,72,400;1,72,400"
    "&family=IBM+Plex+Sans:wght@400;500"
    "&family=JetBrains+Mono:wght@500"
)

SERIF = "Newsreader"
SANS = "IBM Plex Sans"
MONO = "JetBrains Mono"


def need(binary: str) -> None:
    if shutil.which(binary) is None:
        sys.exit(f"error: `{binary}` not found on PATH")


def curl(url: str) -> bytes:
    # A plain user agent makes Google Fonts answer with TrueType files.
    return subprocess.run(
        ["curl", "-fsSL", "-A", "Mozilla/5.0", url], check=True, capture_output=True
    ).stdout


def font_faces(embed: bool) -> str:
    """@font-face rules for every face in FONTS_CSS, as data URIs or local() references."""
    css = curl(FONTS_CSS).decode()
    rules = []
    for block in re.findall(r"@font-face\s*{(.*?)}", css, re.S):
        family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        style = re.search(r"font-style:\s*(\w+)", block).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", block).group(1)
        url = re.search(r"url\((\S+?)\)", block).group(1)
        if embed:
            FONT_CACHE.mkdir(parents=True, exist_ok=True)
            cached = FONT_CACHE / (hashlib.sha1(url.encode()).hexdigest()[:16] + ".ttf")
            if not cached.exists():
                cached.write_bytes(curl(url))
            src = f"url(data:font/ttf;base64,{base64.b64encode(cached.read_bytes()).decode()}) format('truetype')"
        else:
            src = f"local('{family}')"
        rules.append(
            f"@font-face {{ font-family:'{family}'; font-style:{style}; font-weight:{weight}; src:{src}; }}"
        )
    return "\n    ".join(rules)


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_svg(faces: str, portrait_b64: str) -> str:
    mono = f"font-family=\"'{MONO}'\" font-weight=\"500\" font-size=\"14\" letter-spacing=\"1.7\""
    mono_sm = f"font-family=\"'{MONO}'\" font-weight=\"500\" font-size=\"12\" letter-spacing=\"1.4\""

    facts = []
    for i, (label, value) in enumerate(FACTS):
        x = 72 + i * 352
        facts.append(
            f'<text x="{x}" y="522" {mono} fill="{BRASS_TEXT}">{esc(label.upper())}</text>'
            f'<text x="{x}" y="558" font-family="\'{SANS}\'" font-size="23" fill="{INK}">{esc(value)}</text>'
        )

    # The provisioning saga in miniature, in the diagram language: three steps
    # done, step 04 failed (brass diamond), step 05 never reached.
    tx, gap, ty = 772, 30, 88
    trace = [
        f'<line x1="{tx}" y1="{ty}" x2="{tx + 3 * gap}" y2="{ty}" stroke="{BRAND}" stroke-width="1.5"/>',
        f'<line x1="{tx + 3 * gap}" y1="{ty}" x2="{tx + 4 * gap}" y2="{ty}" stroke="{SAGE}" stroke-width="1.25" stroke-dasharray="3 3"/>',
    ]
    for k in range(3):
        trace.append(f'<circle cx="{tx + k * gap}" cy="{ty}" r="4" fill="{BRAND}"/>')
    fx = tx + 3 * gap
    trace.append(
        f'<rect x="{fx - 4}" y="{ty - 4}" width="8" height="8" transform="rotate(45 {fx} {ty})" fill="{BRASS}"/>'
    )
    trace.append(
        f'<circle cx="{tx + 4 * gap}" cy="{ty}" r="3.5" fill="{PAPER}" stroke="{MUTED}" stroke-width="1.25"/>'
    )

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <style>
    {faces}
  </style>
  <defs>
    <clipPath id="portrait"><rect x="880" y="140" width="240" height="240"/></clipPath>
  </defs>

  <!-- Quick Look pads to a square; everything below 630 is cropped away. -->
  <rect width="1200" height="1200" fill="#ffffff"/>
  <rect width="{W}" height="{H}" fill="{PAPER}"/>

  <!-- Plate border -->
  <rect x="24.5" y="24.5" width="{W - 49}" height="{H - 49}" fill="none" stroke="{HAIR}"/>

  <!-- Header rule: label, hairline, trace, URL -->
  <text x="72" y="93" {mono} fill="{BRASS_TEXT}">GDA<tspan fill="{MUTED}"> · PORTFOLIO</tspan></text>
  <line x1="262" y1="88" x2="748" y2="88" stroke="{HAIR}"/>
  {"".join(trace)}
  <text x="1128" y="93" text-anchor="end" {mono} fill="{MUTED}">{esc(URL.upper())}</text>

  <!-- Name -->
  <text x="68" y="236" font-family="'{SERIF}'" font-size="118" letter-spacing="-2.9" fill="{DEEP}">{esc(NAME_FIRST)}</text>
  <text x="68" y="346" font-family="'{SERIF}'" font-style="italic" font-size="118" letter-spacing="-2.9" fill="{BRAND}">{esc(NAME_LAST)}</text>

  <!-- Role (the focus is in the facts strip below) -->
  <text x="72" y="420" font-family="'{SERIF}'" font-style="italic" font-size="32" fill="{MUTED}">{esc(ROLE)}</text>

  <!-- Portrait, matted and captioned like the hero figure -->
  <rect x="872.5" y="132.5" width="255" height="255" fill="{SURFACE}" stroke="{HAIR}"/>
  <image href="data:image/jpeg;base64,{portrait_b64}" x="880" y="140" width="240" height="240"
         preserveAspectRatio="xMidYMid slice" clip-path="url(#portrait)"/>
  <text x="872" y="418" {mono_sm} fill="{MUTED}">{esc(CITY.upper())}</text>
  <text x="1128" y="418" text-anchor="end" {mono_sm} fill="{MUTED}">PH</text>

  <!-- Facts -->
  <line x1="72" y1="474" x2="1128" y2="474" stroke="{INK}"/>
  {"".join(facts)}
  <line x1="72" y1="586" x2="1128" y2="586" stroke="{HAIR}"/>
</svg>
"""


def main() -> None:
    for binary in ("curl", "qlmanage", "magick"):
        need(binary)
    if not PORTRAIT.exists():
        sys.exit(f"error: portrait not found at {PORTRAIT}")

    portrait_b64 = base64.b64encode(PORTRAIT.read_bytes()).decode()
    svg = build_svg(font_faces(embed=True), portrait_b64)

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
            ["magick", str(rendered), "-crop", f"{W}x{H}+0+0", "+repage", "-strip", str(OUT_PNG)],
            check=True,
        )

    # An editable copy of the source, without the megabytes of base64.
    OUT_SVG.write_text(build_svg(font_faces(embed=False), ""), encoding="utf-8")

    print(f"wrote {OUT_PNG.relative_to(ROOT)} ({W}x{H}, {OUT_PNG.stat().st_size / 1024:.0f} KB)")
    print(f"wrote {OUT_SVG.relative_to(ROOT)} (editable source; fonts and portrait not embedded)")


if __name__ == "__main__":
    main()
