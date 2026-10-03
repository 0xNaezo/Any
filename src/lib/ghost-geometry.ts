/**
 * Pure geometry for the Nightloom night scene, shared by the hero canvas
 * (src/scripts/ghost-scene.ts) and the generated Open Graph images (src/lib/og.ts).
 * All coordinates are in grid cells.
 */

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** 4×4 ordered-dither threshold for a cell. */
export const bayer = (x: number, y: number) => BAYER[((y & 3) << 2) | (x & 3)]!;

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface GhostShape {
  /** Horizontal centre. */
  cx: number;
  /** Top of the head. */
  top: number;
  /** Head radius (half width). */
  R: number;
  /** Full height. */
  H: number;
  hemAmp: number;
  /** How much lower the trailing (left) side of the hem hangs. */
  trail: number;
  waves: number;
  /** Hem wave phase (animated). */
  phase: number;
  /** Horizontal sway of the lower body (animated). */
  sway: number;
}

export function makeGhost(R: number, cx: number, top: number): GhostShape {
  return { cx, top, R, H: Math.round(R * 2.45), hemAmp: Math.max(2, R * 0.24), trail: R * 0.16, waves: 3, phase: 0, sway: 0 };
}

/** Is a point (relative to cx/top, sway already applied) inside the silhouette grown by `e` cells? */
export function inGhost(g: GhostShape, lx: number, ly: number, e = 0): boolean {
  const R = g.R + e;
  if (ly < g.R) {
    const dy = ly - g.R;
    return lx * lx + dy * dy <= R * R;
  }
  if (Math.abs(lx) > R) return false;
  const u = (lx + g.R) / (2 * g.R);
  const wave = 0.5 + 0.5 * Math.sin(u * Math.PI * 2 * g.waves + g.phase);
  const bottom = g.H - g.hemAmp * wave + (-lx / g.R) * g.trail * 2 + e;
  return ly <= bottom;
}

/** Local x of a cell centre, including the cloth sway of the lower body. */
export function ghostLocalX(g: GhostShape, x: number, y: number): number {
  const ly = y + 0.5 - g.top;
  const k = clamp((ly - g.R) / (g.H - g.R), 0, 1);
  return x + 0.5 - g.cx - g.sway * k * k;
}

export interface Eyes {
  x1: number;
  x2: number;
  y: number;
  w: number;
  h: number;
}

/** Eye rectangles (integer cells) for a given look offset. */
export function ghostEyes(g: GhostShape, lookX = 0, lookY = 0, blink = false): Eyes {
  const w = Math.max(2, Math.round(g.R * 0.2));
  const h = blink ? 1 : Math.round(w * 1.5);
  return {
    x1: g.cx - Math.round(g.R * 0.08) + Math.round(lookX),
    x2: g.cx + Math.round(g.R * 0.5) + Math.round(lookX),
    y: g.top + Math.round(g.R * 0.82) + Math.round(lookY) + (blink ? Math.round(w * 0.6) : 0),
    w,
    h,
  };
}

export type GhostTone = 'light' | 'shade' | 'aura' | null;

/** What to draw in cell (x, y): lit body, dithered shadow, faint aura or nothing. */
export function ghostTone(g: GhostShape, x: number, y: number, eyes: Eyes, dissolve = 0): GhostTone {
  const ly = y + 0.5 - g.top;
  const lx = ghostLocalX(g, x, y);
  const b = bayer(x, y);
  if (inGhost(g, lx, ly, 0)) {
    if (dissolve > 0 && b < dissolve) return null;
    const isEye = ((x >= eyes.x1 && x < eyes.x1 + eyes.w) || (x >= eyes.x2 && x < eyes.x2 + eyes.w)) && y >= eyes.y && y < eyes.y + eyes.h;
    if (isEye) return null;
    const shadow = clamp(0.8 * (-lx / g.R) - 0.28 + 0.3 * (ly / g.H), 0, 0.85);
    return shadow > b ? 'shade' : 'light';
  }
  if (dissolve < 0.6 && b < 0.16 && inGhost(g, lx, ly, 1.6)) return 'aura';
  return null;
}

/** Bounding box (in cells) that fully contains the ghost and its aura. */
export function ghostBounds(g: GhostShape) {
  return {
    x0: Math.floor(g.cx - g.R - 4),
    x1: Math.ceil(g.cx + g.R + 4),
    y0: Math.floor(g.top - 3),
    y1: Math.ceil(g.top + g.H + g.trail * 2 + 4),
  };
}

/**
 * Dithered crescent moon. Returns the cell's opacity (0 = empty).
 * `mx, my` — centre, `mr` — radius.
 */
export function moonAlpha(x: number, y: number, mx: number, my: number, mr: number): number {
  const sx = mx - mr * 0.62;
  const sy = my - mr * 0.42;
  const dist = Math.hypot(x + 0.5 - mx, y + 0.5 - my);
  if (dist <= mr) {
    const ds = Math.hypot(x + 0.5 - sx, y + 0.5 - sy);
    const lit = clamp((ds - mr * 0.9) / (mr * 0.42), 0, 1);
    if (lit > bayer(x, y)) return 0.26 + lit * 0.36;
    return 0.035; // earthshine
  }
  if (dist <= mr * 1.7) {
    const halo = (1 - (dist - mr) / (mr * 0.7)) * 0.16;
    if (halo > bayer(x, y)) return 0.07;
  }
  return 0;
}

/** Tiny seeded PRNG so the sky is identical on every render. */
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Points of the loose thread trailing from the hem, from the tip leftwards to x = 0. */
export function threadPath(g: GhostShape, t = 0): { x: number; y: number; a: number }[] {
  const tipX = Math.round(g.cx - g.R + 1);
  const tipY = g.top + g.H + g.trail * 1.4;
  const pts: { x: number; y: number; a: number }[] = [];
  let prevY: number | null = null;
  for (let x = tipX; x >= 0; x--) {
    const p = (tipX - x) / Math.max(1, tipX);
    const sag = Math.sin(Math.min(1, p * 1.6) * Math.PI * 0.5) * 2.4;
    const wave = Math.sin(x * 0.28 - t * 0.0024) * 1.1 * Math.min(1, p * 2);
    const y = Math.round(tipY + sag + wave);
    const a = 0.95 - p * 0.55;
    const from = prevY === null ? y : Math.min(prevY, y);
    const to = prevY === null ? y : Math.max(prevY, y);
    for (let yy = from; yy <= to; yy++) pts.push({ x, y: yy, a });
    prevY = y;
  }
  return pts;
}
