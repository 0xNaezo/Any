/**
 * The hero ghost — a procedural pixel sprite drawn on a canvas.
 *
 * - 46×52 cell body: a dome + straight sides + a notched skirt
 * - 2-cell outline, ordered-dither interior, bar eyes
 * - bobs on a stepped sine, wiggles its skirt like an arcade ghost,
 *   blinks, follows the cursor with its eyes and reacts to clicks
 * Everything is snapped to whole device pixels, so it stays crisp.
 */

const W = 46;
const H = 52;
const R = W / 2;
const PAD_TOP = 4;
const PAD_BOTTOM = 12;
const GRID_H = PAD_TOP + H + PAD_BOTTOM;

type Eyes = 'bars' | 'happy' | 'wide';
type Cell = [number, number];

interface Shape {
  outline: Cell[];
  interior: Cell[];
  interiorSet: Set<string>;
}

const key = (x: number, y: number) => `${x},${y}`;

function bottomEdge(px: number, skirt: number): number {
  const notches = skirt === 0 ? [0.3 * W, 0.7 * W] : [0.36 * W, 0.64 * W];
  const half = 0.135 * W;
  const amp = 6.5;
  let depth = 0;
  for (const n of notches) depth = Math.max(depth, amp * (1 - Math.abs(px - n) / half));
  // round the two outer feet a little
  const edge = Math.min(px, W - px);
  if (edge < 2.2) depth = Math.max(depth, 2.2 - edge);
  return H - depth;
}

function makeShape(skirt: number): Shape {
  const inside = (x: number, y: number) => {
    const px = x + 0.5;
    const py = y + 0.5;
    if (px < 0 || px > W || py < 0) return false;
    if (py < R) return (px - R) ** 2 + (py - R) ** 2 <= R * R;
    return py <= bottomEdge(px, skirt);
  };
  const outline: Cell[] = [];
  const interior: Cell[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!inside(x, y)) continue;
      let deep = true;
      for (const [dx, dy] of [
        [1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [0, 2], [0, -2],
        [1, 1], [-1, 1], [1, -1], [-1, -1],
      ]) {
        if (!inside(x + dx, y + dy)) {
          deep = false;
          break;
        }
      }
      (deep ? interior : outline).push([x, y]);
    }
  }
  return { outline, interior, interiorSet: new Set(interior.map(([x, y]) => key(x, y))) };
}

function eyeCells(type: Eyes, blink: boolean, lx: number, ly: number): Cell[] {
  const cells: Cell[] = [];
  const centers = [R - 8.5, R + 7.5]; // left edges of each 2-wide eye
  const top = 18 + ly;
  for (const c of centers) {
    const x0 = Math.round(c) + lx;
    if (blink) {
      for (let x = x0 - 1; x < x0 + 3; x++) for (let y = top + 4; y < top + 6; y++) cells.push([x, y]);
      continue;
    }
    if (type === 'bars' || type === 'wide') {
      const h = type === 'wide' ? 9 : 8;
      const w = type === 'wide' ? 3 : 2;
      for (let x = x0; x < x0 + w; x++) for (let y = top; y < top + h; y++) cells.push([x, y]);
    } else {
      // happy "^" eyes, 2-cell strokes
      const pts: Cell[] = [
        [-2, 5], [-1, 4], [0, 3], [1, 2], [2, 3], [3, 4], [4, 5],
      ];
      for (const [dx, dy] of pts) {
        cells.push([x0 + dx - 1, top + dy], [x0 + dx - 1, top + dy + 1]);
      }
    }
  }
  return cells;
}

// 4×4 Bayer matrix, normalised to 0..1
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];

export interface GhostOptions {
  reduced: boolean;
  colors?: { line: string; dot: string; eye: string; shadow: string };
  onBoo?: () => void;
}

export function createGhost(canvas: HTMLCanvasElement, opts: GhostOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const css = getComputedStyle(document.documentElement);
  const colors = opts.colors ?? {
    line: css.getPropertyValue('--accent').trim() || '#8fb5ff',
    dot: css.getPropertyValue('--accent').trim() || '#8fb5ff',
    eye: css.getPropertyValue('--accent-hi').trim() || '#c4d7ff',
    shadow: css.getPropertyValue('--accent-mid').trim() || '#5b86ff',
  };

  const shapes = [makeShape(0), makeShape(1)];
  // a stable random order for the "materialise" intro
  const seed = new Map<string, number>();
  const rnd = (x: number, y: number) => {
    const k = key(x, y);
    let v = seed.get(k);
    if (v === undefined) {
      v = Math.random() * 0.75 + (y / H) * 0.25;
      seed.set(k, v);
    }
    return v;
  };

  const state = {
    reveal: opts.reduced ? 1 : 0,
    bob: 0,
    lookX: 0,
    lookY: 0,
    eyes: 'bars' as Eyes,
    blink: false,
    skirt: 0,
    shuttle: -10,
    shake: 0,
    hover: false,
  };

  let cs = 8; // cell size in device px
  let ox = 0;
  let oy = 0;
  let dpr = 1;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    // 8 CSS px per cell at most: a ~370px ghost on desktop
    cs = Math.max(2, Math.min(Math.round(8 * dpr), Math.floor(Math.min(canvas.width / (W + 4), canvas.height / GRID_H))));
    ox = Math.floor((canvas.width - W * cs) / 2);
    oy = Math.floor((canvas.height - GRID_H * cs) / 2);
    last = '';
  };

  let last = '';
  const draw = () => {
    const sig = `${state.reveal.toFixed(2)}|${state.bob}|${state.lookX}|${state.lookY}|${state.eyes}|${state.blink}|${state.skirt}|${state.shuttle}|${state.shake}|${cs}`;
    if (sig === last) return;
    last = sig;

    const shape = shapes[state.skirt];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const by = PAD_TOP + state.bob;
    const bx = state.shake;
    const px = (x: number) => ox + (x + bx) * cs;
    const py = (y: number) => oy + (y + by) * cs;
    const vis = (x: number, y: number) => state.reveal >= 1 || rnd(x, y) < state.reveal;

    // shadow: a dithered ellipse that shrinks as the ghost rises
    ctx.fillStyle = colors.shadow;
    const sy = PAD_TOP + H + 6;
    const rx = W * 0.36 - state.bob * 1.2;
    const ry = 2.6;
    for (let y = Math.floor(sy - ry); y <= Math.ceil(sy + ry); y++) {
      for (let x = Math.floor(R - rx); x <= Math.ceil(R + rx); x++) {
        const d = ((x + 0.5 - R) / rx) ** 2 + ((y + 0.5 - sy) / ry) ** 2;
        if (d > 1) continue;
        if ((x + y) % 2 !== 0) continue;
        if (bayer(x, y) > (1 - d) * 0.9 * state.reveal) continue;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(ox + x * cs, oy + y * cs, cs, cs);
      }
    }

    // interior dither: a sparse dot lattice, denser on the "shuttle" row
    ctx.fillStyle = colors.dot;
    const dot = Math.max(1, Math.round(cs * 0.5));
    const inset = Math.floor((cs - dot) / 2);
    for (const [x, y] of shape.interior) {
      if (!vis(x, y)) continue;
      const near = Math.abs(y - state.shuttle);
      if (near <= 1) {
        if ((x + y) % 2 !== 0) continue;
        ctx.globalAlpha = 0.9;
      } else {
        if (x % 2 !== 0 || y % 2 !== 0) continue;
        const shade = 0.36 + 0.4 * (1 - y / H);
        if (bayer(x >> 1, y >> 1) > shade + 0.25) continue;
        ctx.globalAlpha = 0.5;
      }
      ctx.fillRect(px(x) + inset, py(y) + inset, dot, dot);
    }

    // outline
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.line;
    for (const [x, y] of shape.outline) {
      if (!vis(x, y)) continue;
      ctx.fillRect(px(x), py(y), cs, cs);
    }

    // eyes
    if (state.reveal > 0.6) {
      ctx.fillStyle = colors.eye;
      for (const [x, y] of eyeCells(state.eyes, state.blink, state.lookX, state.lookY)) {
        ctx.fillRect(px(x), py(y), cs, cs);
      }
    }
    ctx.globalAlpha = 1;
  };

  /* ---------- behaviour ---------- */
  let running = false;
  let raf = 0;
  let t0 = performance.now();
  let nextBlink = t0 + 2400;
  let blinkUntil = 0;
  let shakeUntil = 0;
  const pointer = { x: 0, y: 0, active: false };

  const tick = (now: number) => {
    const t = (now - t0) / 1000;
    if (!opts.reduced) {
      state.bob = Math.round(Math.sin(t * 1.7) * 1.5);
      state.skirt = Math.floor(t / 0.28) % 2;
      const cycle = t % 4.6;
      state.shuttle = cycle < 2.6 ? Math.floor((cycle / 2.6) * (H + 4)) - 2 : -10;
      if (now > nextBlink) {
        blinkUntil = now + 130;
        nextBlink = now + 2200 + Math.random() * 3800;
      }
      state.blink = now < blinkUntil;
      state.shake = now < shakeUntil ? (Math.floor(now / 50) % 2 === 0 ? 1 : -1) : 0;
    }
    if (pointer.active) {
      const rect = canvas.getBoundingClientRect();
      const ex = rect.left + rect.width / 2;
      const ey = rect.top + (oy / dpr) + ((PAD_TOP + 22) * cs) / dpr;
      state.lookX = Math.max(-3, Math.min(3, Math.round((pointer.x - ex) / 110)));
      state.lookY = Math.max(-2, Math.min(2, Math.round((pointer.y - ey) / 150)));
    }
    state.eyes = state.hover ? 'happy' : 'bars';
    draw();
    if (running) raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || opts.reduced) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      const rect = canvas.getBoundingClientRect();
      const gx = rect.left + ox / dpr;
      const gy = rect.top + (oy + (PAD_TOP + state.bob) * cs) / dpr;
      const gw = (W * cs) / dpr;
      const gh = (H * cs) / dpr;
      state.hover = e.clientX > gx && e.clientX < gx + gw && e.clientY > gy && e.clientY < gy + gh;
      if (opts.reduced) tick(performance.now());
    },
    { passive: true },
  );

  canvas.addEventListener('click', () => {
    shakeUntil = performance.now() + 360;
    opts.onBoo?.();
  });

  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
  io.observe(canvas);

  const ro = new ResizeObserver(() => {
    resize();
    draw();
  });
  ro.observe(canvas);
  resize();
  draw();

  return {
    /** Materialise the sprite (0 → 1). */
    setReveal(v: number) {
      state.reveal = v;
      draw();
    },
    get reveal() {
      return state.reveal;
    },
    start,
    stop,
  };
}
