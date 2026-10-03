"""
Builds the self-hosted font files in src/assets/fonts/.

The site only needs Latin, a handful of typographic symbols and a narrow slice
of each variable font's design space, so we pin/limit the axes and subset the
glyphs. This takes the type payload from ~420 KB (stock Fontsource files) down
to ~150 KB without losing optical sizing on the serif.

Usage (only needed if you change the fonts):
    pip install fonttools brotli
    npm i --no-save @fontsource-variable/newsreader @fontsource-variable/schibsted-grotesk @fontsource/ibm-plex-mono
    python3 scripts/subset-fonts.py
"""
import io
import os
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NM = os.path.join(ROOT, "node_modules")
OUT = os.path.join(ROOT, "src", "assets", "fonts")

UNICODES = (
    list(range(0x20, 0x7F))  # Basic Latin
    + list(range(0xA0, 0x100))  # Latin-1 supplement (punctuation, ©, ×, accented letters)
    + [0x131, 0x152, 0x153, 0x2BC, 0x2C6, 0x2DA, 0x2DC]
    + [0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E]
    + [0x2020, 0x2021, 0x2022, 0x2026, 0x2030, 0x2032, 0x2033, 0x2039, 0x203A, 0x2044]
    + [0x20AC, 0x2116, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2196, 0x2197, 0x2198]
    + [0x2212, 0x2215, 0x2248, 0x2260, 0x2264, 0x2265]
)

FONTS = [
    # (source file, axis limits, output name)
    ("@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2", {"wght": 400, "opsz": (16, 72)}, "newsreader-roman.woff2"),
    ("@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2", {"wght": 400, "opsz": (16, 72)}, "newsreader-italic.woff2"),
    ("@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2", {"wght": (400, 600)}, "schibsted-grotesk.woff2"),
    ("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", None, "ibm-plex-mono-400.woff2"),
    ("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", None, "ibm-plex-mono-500.woff2"),
]


def reload(font: TTFont) -> TTFont:
    buf = io.BytesIO()
    font.flavor = None
    font.save(buf)
    buf.seek(0)
    return TTFont(buf, lazy=False)


def build(src: str, limits, name: str) -> None:
    font = TTFont(os.path.join(NM, src), lazy=False)
    if limits:
        font = reload(instancer.instantiateVariableFont(font, limits))
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)
    font.flavor = "woff2"
    out = os.path.join(OUT, name)
    font.save(out)
    print(f"{name:32} {os.path.getsize(out) / 1024:6.1f} KB")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for args in FONTS:
        build(*args)
