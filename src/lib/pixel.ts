/**
 * Tiny pixel-art toolkit.
 * A bitmap is an array of equal-length strings: '#' = filled pixel, anything else = empty.
 */
export type Bitmap = readonly string[];

export function bitmapSize(rows: Bitmap) {
  return { w: Math.max(0, ...rows.map((r) => r.length)), h: rows.length };
}

/**
 * Converts a bitmap to a compact SVG path (horizontal runs merged into rectangles).
 * `char` selects which symbol is drawn — handy for multi-tone sprites.
 */
export function bitmapToPath(rows: Bitmap, char = '#', ox = 0, oy = 0): string {
  let d = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== char) {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x] === char) x++;
      d += `M${start + ox} ${y + oy}h${x - start}v1h${start - x}z`;
    }
  });
  return d;
}

/** Lists every filled pixel — used when each pixel is rendered/animated separately. */
export function bitmapPixels(rows: Bitmap, char = '#') {
  const out: { x: number; y: number }[] = [];
  rows.forEach((row, y) => [...row].forEach((c, x) => c === char && out.push({ x, y })));
  return out;
}

/** Joins glyph bitmaps horizontally with a fixed gap. */
export function joinGlyphs(glyphs: Bitmap[], gap = 1): string[] {
  const h = Math.max(...glyphs.map((g) => g.length));
  const rows = Array.from({ length: h }, () => '');
  glyphs.forEach((g, i) => {
    const w = bitmapSize(g).w;
    for (let y = 0; y < h; y++) {
      rows[y] += (g[y] ?? '').padEnd(w, '.') + (i < glyphs.length - 1 ? '.'.repeat(gap) : '');
    }
  });
  return rows;
}

/** Mirrors a bitmap horizontally. */
export function flipX(rows: Bitmap): string[] {
  return rows.map((r) => [...r].reverse().join(''));
}
