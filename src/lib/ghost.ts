import { cellsToPath } from './pixel';

/**
 * The Nightloom ghost — a 15×16 pixel sprite.
 * The silhouette is drawn by hand; the outline, dither fill and eyes are
 * derived from it so every variant stays consistent.
 */
export const GHOST_W = 15;
export const GHOST_H = 16;

const SILHOUETTE = [
  '.....#####.....',
  '...#########...',
  '..###########..',
  '.#############.',
  '.#############.',
  '###############',
  '###############',
  '###############',
  '###############',
  '###############',
  '###############',
  '###############',
  '###############',
  '###############',
  '####.#####.####',
  '###...###...###',
];

const inside = (x: number, y: number) =>
  y >= 0 && y < GHOST_H && x >= 0 && x < GHOST_W && SILHOUETTE[y][x] === '#';

type Cell = [number, number];

function outlineCells(): Cell[] {
  const out: Cell[] = [];
  for (let y = 0; y < GHOST_H; y++) {
    for (let x = 0; x < GHOST_W; x++) {
      if (!inside(x, y)) continue;
      const edge =
        !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
      if (edge) out.push([x, y]);
    }
  }
  return out;
}

const OUTLINE = outlineCells();
const OUTLINE_SET = new Set(OUTLINE.map(([x, y]) => `${x},${y}`));

export type GhostEyes = 'bars' | 'happy' | 'plus' | 'dots' | 'wink' | 'shades' | 'dead';

/** Eye cells for each expression (top-left of the 15×16 grid is 0,0). */
const EYES: Record<GhostEyes, Cell[]> = {
  bars: [
    [5, 5], [5, 6], [5, 7],
    [9, 5], [9, 6], [9, 7],
  ],
  happy: [
    [4, 7], [5, 6], [6, 7],
    [8, 7], [9, 6], [10, 7],
  ],
  plus: [
    [5, 5], [4, 6], [5, 6], [6, 6], [5, 7],
    [9, 5], [8, 6], [9, 6], [10, 6], [9, 7],
  ],
  dots: [
    [4, 6], [5, 6], [4, 7], [5, 7],
    [9, 6], [10, 6], [9, 7], [10, 7],
  ],
  wink: [
    [5, 5], [5, 6], [5, 7],
    [8, 7], [9, 7], [10, 7],
  ],
  shades: [
    [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6], [11, 6],
    [3, 7], [4, 7], [5, 7], [6, 7], [8, 7], [9, 7], [10, 7], [11, 7],
  ],
  dead: [
    [4, 5], [6, 5], [5, 6], [4, 7], [6, 7],
    [8, 5], [10, 5], [9, 6], [8, 7], [10, 7],
  ],
};

/** Sparse ordered-dither cells inside the body (a quiet texture). */
function ditherCells(): Cell[] {
  const cells: Cell[] = [];
  for (let y = 1; y < GHOST_H; y++) {
    for (let x = 1; x < GHOST_W; x++) {
      if (!inside(x, y) || OUTLINE_SET.has(`${x},${y}`)) continue;
      if ((x + y * 2) % 4 === 0 && y % 2 === 1) cells.push([x, y]);
    }
  }
  return cells;
}

export interface GhostPaths {
  w: number;
  h: number;
  outline: string;
  silhouette: string;
  eyes: string;
  dither: string;
}

export function ghostPaths(eyes: GhostEyes = 'bars'): GhostPaths {
  const silhouette: Cell[] = [];
  for (let y = 0; y < GHOST_H; y++)
    for (let x = 0; x < GHOST_W; x++) if (inside(x, y)) silhouette.push([x, y]);
  const eyeSet = new Set(EYES[eyes].map(([x, y]) => `${x},${y}`));
  const dither = ditherCells().filter(([x, y]) => !eyeSet.has(`${x},${y}`));
  return {
    w: GHOST_W,
    h: GHOST_H,
    outline: cellsToPath(OUTLINE),
    silhouette: cellsToPath(silhouette),
    eyes: cellsToPath(EYES[eyes]),
    dither: cellsToPath(dither),
  };
}
