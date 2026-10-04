/**
 * Tiny pixel-art toolkit.
 *
 * Sprites are written as ASCII grids (one string per row) so they stay
 * readable and easy to edit:
 *   '#' → solid pixel (currentColor)
 *   '+' → tone pixel  (currentColor at reduced opacity)
 *   any other char → empty
 *
 * Each grid is converted into compact SVG path data — one sub-path per
 * horizontal run of pixels — and rendered with `shape-rendering: crispEdges`.
 */

export type Grid = readonly string[];

export interface GridPaths {
  w: number;
  h: number;
  solid: string;
  tone: string;
}

/** Path data for every horizontal run of cells matching `test`. */
export function runsToPath(grid: Grid, test: (ch: string) => boolean): string {
  let d = '';
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    let x = 0;
    while (x < row.length) {
      if (test(row[x])) {
        const start = x;
        while (x < row.length && test(row[x])) x++;
        d += `M${start} ${y}h${x - start}v1h${start - x}z`;
      } else {
        x++;
      }
    }
  }
  return d;
}

export function gridSize(grid: Grid): { w: number; h: number } {
  return { w: Math.max(...grid.map((r) => r.length)), h: grid.length };
}

export function gridToPaths(grid: Grid): GridPaths {
  const { w, h } = gridSize(grid);
  return {
    w,
    h,
    solid: runsToPath(grid, (c) => c === '#'),
    tone: runsToPath(grid, (c) => c === '+'),
  };
}

/** Path data from a list of [x, y] cells. */
export function cellsToPath(cells: Iterable<readonly [number, number]>): string {
  const rows = new Map<number, number[]>();
  for (const [x, y] of cells) {
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y)!.push(x);
  }
  let d = '';
  for (const [y, xs] of [...rows.entries()].sort((a, b) => a[0] - b[0])) {
    xs.sort((a, b) => a - b);
    let i = 0;
    while (i < xs.length) {
      const start = xs[i];
      let end = start;
      while (i + 1 < xs.length && xs[i + 1] === end + 1) {
        i++;
        end++;
      }
      d += `M${start} ${y}h${end - start + 1}v1h${start - end - 1}z`;
      i++;
    }
  }
  return d;
}
