/**
 * Woven placeholder portraits: the same threads as the hero, lifted over a
 * bust. Each member gets their own silhouette (hair, beard, glasses) from
 * `bust` in site.ts. Drawn once when scrolled into view; on hover the
 * threads shimmer and the figure leans toward you.
 * Shown only until a real photo is set for that member.
 */

export interface Bust {
  hair?: 'short' | 'long' | 'curly' | 'bun' | 'buzz';
  beard?: boolean;
  glasses?: boolean;
  /** head size, 1 = default */
  head?: number;
  /** shoulder width, 1 = default */
  shoulders?: number;
}

type Field = (u: number, v: number) => number;

const LEVELS = 9;
const clamp = (v: number, min = 0, max = 1) => (v < min ? min : v > max ? max : v);
const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
/** Dome over an ellipse: 1 in the middle, 0 at the rim. */
const dome = (u: number, v: number, cx: number, cy: number, rx: number, ry: number) => {
  const q = 1 - ((u - cx) / rx) ** 2 - ((v - cy) / ry) ** 2;
  return q > 0 ? Math.sqrt(q) : 0;
};
/** Smooth union of two height fields. */
const smax = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + h * h * k * 0.25;
};

/** Height field of a bust in a 1 × 1.25 box: u ∈ [-0.5, 0.5], v ∈ [0, 1.25]. */
function bustField(b: Bust): Field {
  const hs = b.head ?? 1;
  const sw = 0.42 * (b.shoulders ?? 1);
  const cy = 0.46;
  const rx = 0.158 * hs;
  const ry = 0.198 * hs;
  const hair = b.hair ?? 'short';

  return (u, v) => {
    let h = dome(u, v, 0, cy, rx, ry);
    const top = 1 - smooth((v - (cy - 0.02)) / 0.06); // upper half of the head

    if (hair === 'long') {
      h = smax(h, 0.82 * dome(u, v, 0, cy + 0.1, rx * 1.32, ry * 1.5), 0.22);
    } else if (hair === 'curly') {
      const a = Math.atan2(v - cy, u);
      const wob = 1 + 0.05 * Math.sin(a * 11);
      const frame = 1 - smooth((v - cy - 0.01) / 0.1); // frames the face down to the ears
      h = smax(h, 0.94 * dome(u, v, 0, cy - 0.035, rx * 1.18 * wob, ry * 1.04 * wob) * frame, 0.14);
    } else if (hair === 'bun') {
      h = smax(h, 0.97 * dome(u, v, 0, cy - 0.035, rx * 1.06, ry * 0.95) * top, 0.12);
      h = smax(h, 0.8 * dome(u, v, 0.01, cy - ry - 0.035, 0.062, 0.056), 0.1);
    } else if (hair === 'short') {
      h = smax(h, 0.98 * dome(u, v, 0, cy - 0.05, rx * 1.09, ry * 0.9) * top, 0.14);
    }

    if (b.beard) h = smax(h, 0.92 * dome(u, v, 0, cy + 0.125, rx * 0.8, ry * 0.5), 0.12);

    if (b.glasses) {
      for (const side of [-1, 1]) {
        const d = Math.hypot(u - side * 0.066, (v - cy - 0.012) * 1.15);
        h += Math.exp(-(((d - 0.042) / 0.007) ** 2)) * 0.045 * (h > 0 ? 1 : 0);
      }
    }

    // neck, fading into the chest
    if (v > cy && v < 0.9) {
      const q = 1 - (u / 0.07) ** 2;
      if (q > 0) h = smax(h, Math.sqrt(q) * 0.66 * (1 - smooth((v - 0.74) / 0.12)), 0.12);
    }
    // shoulders: a bell that widens from the neck
    if (v > 0.74) {
      const t = clamp((v - 0.74) / 0.24);
      const w = 0.09 + (sw - 0.09) * (1 - (1 - t) ** 3);
      const q = 1 - (u / w) ** 2;
      if (q > 0) h = smax(h, Math.sqrt(q) * (0.5 + 0.3 * t), 0.16);
    }
    return h;
  };
}

class Portrait {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private field: Field;
  private hover = 0;
  private target = 0;
  private time = 0;
  private last = 0;
  private raf = 0;
  private colors: string[] = [];

  constructor(canvas: HTMLCanvasElement, bust: Bust, reduced: boolean) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.field = bustField(bust);
    for (let i = 0; i < LEVELS; i++) {
      const k = i / (LEVELS - 1);
      const tint = Math.max(0, k - 0.6) / 0.4; // the brightest threads pick up the mint
      const r = Math.round(237 - 69 * tint * 0.5);
      const g = Math.round(237 + 3 * tint * 0.5);
      const b = Math.round(240 - 36 * tint * 0.5);
      this.colors.push(`rgba(${r},${g},${b},${(0.06 + Math.pow(k, 1.2) * 0.86).toFixed(3)})`);
    }

    const host = canvas.parentElement as HTMLElement;
    if (!reduced) {
      host.addEventListener('pointerenter', () => this.animateTo(1));
      host.addEventListener('pointerleave', () => this.animateTo(0));
    }
    new ResizeObserver(() => this.draw()).observe(canvas);
  }

  private animateTo(value: number) {
    this.target = value;
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  private tick = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    this.time += dt;
    this.hover += (this.target - this.hover) * (1 - Math.exp(-dt * 5));
    this.draw();
    const settled = Math.abs(this.target - this.hover) < 0.002 && this.target === 0;
    this.raf = settled ? 0 : requestAnimationFrame(this.tick);
    if (settled) {
      this.hover = 0;
      this.draw();
    }
  };

  draw() {
    const { canvas, ctx, field } = this;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (!W || !H) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const hover = this.hover;
    const t = this.time;
    // the bust lives in a 1 × 1.25 box; wide crops scale it to the height instead
    const unit = Math.min(W, H / 0.95);
    const shiftV = Math.max(0, 1.25 - H / unit) * 0.45;
    const gap = W < 260 ? 5.5 : 6.5;
    const step = 3;
    const lines = Math.floor(H / gap);
    const offset = (H - (lines - 1) * gap) / 2;
    const lift = unit * (0.07 + hover * 0.025);
    const e = 0.004;
    const k = 4.2 * (1 + hover * 0.3);
    const L = [-0.52, -0.72, 0.6];
    const ln = Math.hypot(L[0], L[1], L[2]);
    const lx = L[0] / ln;
    const ly = L[1] / ln;
    const lz = L[2] / ln;

    const paths = Array.from({ length: LEVELS }, () => new Path2D());
    for (let i = 0; i < lines; i++) {
      const y0 = offset + i * gap;
      const v = y0 / unit + shiftV;
      let level = -1;
      let px = 0;
      let py = 0;
      for (let x = 0; x <= W + 0.01; x += step) {
        const u = (x - W / 2) / unit;
        const h = field(u, v);
        let a = 0.07;
        if (h > 0) {
          const gx = (field(u + e, v) - field(u - e, v)) / (2 * e);
          const gy = (field(u, v + e) - field(u, v - e)) / (2 * e);
          const nx = -gx * k * 0.06;
          const ny = -gy * k * 0.06;
          const nl = Math.hypot(nx, ny, 1);
          const diffuse = Math.max((nx * lx + ny * ly + lz) / nl, 0) / lz;
          const mask = Math.min(1, h * 5);
          a += mask * (0.12 + (0.42 + hover * 0.14) * Math.pow(diffuse, 2.3));
        }
        const shimmer = hover > 0.001 ? Math.sin(x * 0.045 + y0 * 0.21 - t * 4.2) * 0.9 * hover : 0;
        const y = y0 - h * lift + shimmer;
        const lv = Math.min(LEVELS - 1, Math.round(clamp(a) * (LEVELS - 1)));
        if (level < 0) {
          level = lv;
          paths[lv].moveTo(x, y);
        } else if (lv !== level) {
          level = lv;
          paths[lv].moveTo(px, py);
          paths[lv].lineTo(x, y);
        } else {
          paths[lv].lineTo(x, y);
        }
        px = x;
        py = y;
      }
    }

    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    for (let i = 0; i < LEVELS; i++) {
      ctx.strokeStyle = this.colors[i];
      ctx.stroke(paths[i]);
    }
    canvas.classList.add('is-drawn');
  }
}

export function initPortraits(reducedMotion: boolean) {
  const canvases = [...document.querySelectorAll<HTMLCanvasElement>('[data-portrait]')];
  if (!canvases.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        const canvas = entry.target as HTMLCanvasElement;
        let bust: Bust = {};
        try {
          bust = JSON.parse(canvas.dataset.portrait || '{}');
        } catch {
          /* keep the default bust */
        }
        new Portrait(canvas, bust, reducedMotion).draw();
      }
    },
    { rootMargin: '300px 0px' },
  );
  canvases.forEach((canvas) => io.observe(canvas));
}
