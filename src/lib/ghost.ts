/**
 * The Nightloom ghost, drawn on a 32 × 32 grid.
 * It glides to the right; its tail trails behind on the left — the shuttle of the loom.
 */
export const GHOST_BODY =
  'M25.5 15C25.5 9.5 21.3 5 16 5s-9.5 4.5-9.5 10v5.2c0 3.4-1.2 5.7-2.9 7.1-.5.4-.2 1.2.4 1.2 1.9 0 3.4-.5 4.6-1.3 1.1 1 2.4 1.5 3.8 1.4 1.3-.1 2.3-.7 3-1.4.8.8 1.9 1.3 3.2 1.3 1.4 0 2.5-.6 3.2-1.5.6.5 1.4.8 2.3.8.6 0 .9-.6.6-1.1-.8-1.2-1.2-2.7-1.2-4.6Z';

export const GHOST_EYES = [
  { cx: 14.4, cy: 14.6, rx: 1.5, ry: 2.1 },
  { cx: 20.9, cy: 14.6, rx: 1.5, ry: 2.1 },
] as const;

/* ────────────────────────────────────────────────────────────────────────────
   Animated outline for the large hero ghost: same silhouette as the logo, but
   the hem ripples like cloth and the tail sways. Used on the server (t = 0) for
   the initial markup and on the client every frame.
   ──────────────────────────────────────────────────────────────────────────── */

const HEM: ReadonlyArray<readonly [number, number]> = [
  [4.2, 28.5],
  [8.6, 27.2],
  [12.4, 28.6],
  [15.4, 27.2],
  [18.6, 28.5],
  [21.8, 27.0],
  [24.2, 27.8],
];

const f = (n: number) => n.toFixed(2);

export interface GhostShape {
  d: string;
  /** tail tip, in the 32 × 32 viewBox — where the threads leave the body */
  tail: [number, number];
}

export function ghostOutline(t: number): GhostShape {
  const tipX = 3.6 + Math.sin(t * 1.3) * 0.35;
  const tipY = 27.3 + Math.cos(t * 1.1) * 0.3;
  const pts = HEM.map(([x, y], i) => [x, y + Math.sin(t * 2.4 - x * 0.55) * 0.42 * (1 - i / 10)] as const);

  let d = `M25.5 15C25.5 9.5 21.3 5 16 5S6.5 9.5 6.5 15V20.2C6.5 23.6 ${f(5.3 + (tipX - 3.6) * 0.5)} 25.9 ${f(tipX)} ${f(tipY)}`;
  d += `C${f(tipX - 0.5)} ${f(tipY + 0.4)} ${f(pts[0][0] - 0.8)} ${f(pts[0][1])} ${f(pts[0][0])} ${f(pts[0][1])}`;

  // Catmull-Rom → cubic Bézier through the hem points
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? ([pts[i][0] - 3, pts[i][1]] as const);
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? ([p2[0] + 2, p2[1] - 1] as const);
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }

  const last = pts[pts.length - 1];
  d += `C${f(last[0] + 0.7)} ${f(last[1])} ${f(last[0] + 1.3)} ${f(last[1] - 0.5)} 25.2 25.6C25.5 24 25.5 22 25.5 20Z`;

  return { d, tail: [tipX + 2.6, tipY - 1.6] };
}
