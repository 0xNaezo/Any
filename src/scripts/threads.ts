/**
 * Hero "loom": horizontal threads woven across the screen, with the Nightloom
 * ghost rising underneath them like a figure under a sheet.
 *
 * - Threads are drawn line by line, alternating direction like a shuttle.
 * - The ghost is a height field (same geometry as the logo) that lifts and
 *   lights the threads. It floats, its hem flows, it blinks, and its eyes
 *   follow the pointer.
 * - Rendering pauses off-screen; reduced-motion users get a single still frame.
 */

const TAU = Math.PI * 2;
const LEVELS = 10;

const clamp = (v: number, min = 0, max = 1) => (v < min ? min : v > max ? max : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface GhostBox {
  x: number; // centre x
  top: number;
  r: number; // half width
  h: number; // full height
}

export class Threads {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private host: HTMLElement;
  private anchor: HTMLElement | null;
  private reduced: boolean;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private gap = 9;
  private step = 6;
  private ghost: GhostBox = { x: 0, top: 0, r: 0, h: 0 };

  private pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, active: 0, target: 0 };
  private look = { x: 0, y: 0 };
  private time = 0;
  private last = 0;
  private introAt = -1;
  private blinkAt = 2.8;
  private blink = 0;
  private raf = 0;
  private inView = true;
  private pageVisible = true;
  private colors: string[] = [];

  constructor(canvas: HTMLCanvasElement, options: { reducedMotion: boolean }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.host = canvas.parentElement as HTMLElement;
    this.anchor = this.host.querySelector<HTMLElement>('[data-ghost-anchor]');
    this.reduced = options.reducedMotion;

    for (let i = 0; i < LEVELS; i++) {
      const k = i / (LEVELS - 1);
      // white → faint phosphor tint as the threads get lifted
      const r = Math.round(237 + (168 - 237) * k * 0.45);
      const g = Math.round(237 + (240 - 237) * k * 0.45);
      const b = Math.round(240 + (204 - 240) * k * 0.45);
      const a = 0.085 + Math.pow(k, 1.15) * 0.8;
      this.colors.push(`rgba(${r},${g},${b},${a.toFixed(3)})`);
    }

    this.resize();
    this.bind();
  }

  /** Starts the weave + rise intro. */
  start() {
    if (this.reduced) {
      this.introAt = -1e6;
      this.render(99);
      return;
    }
    this.introAt = performance.now();
    this.last = this.introAt;
    this.loop();
  }

  private bind() {
    const ro = new ResizeObserver(() => {
      this.resize();
      if (this.reduced) this.render(99);
    });
    ro.observe(this.host);

    const io = new IntersectionObserver(([entry]) => {
      this.inView = entry.isIntersecting;
      if (this.inView) this.loop();
    });
    io.observe(this.host);

    document.addEventListener('visibilitychange', () => {
      this.pageVisible = document.visibilityState === 'visible';
      if (this.pageVisible) this.loop();
    });

    if (this.reduced || !window.matchMedia('(pointer: fine)').matches) return;

    window.addEventListener(
      'pointermove',
      (event) => {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.tx = event.clientX - rect.left;
        this.pointer.ty = event.clientY - rect.top;
        const inside = this.pointer.ty > 0 && this.pointer.ty < rect.height;
        this.pointer.target = inside ? 1 : 0;
        if (this.pointer.x < -1e3) {
          this.pointer.x = this.pointer.tx;
          this.pointer.y = this.pointer.ty;
        }
      },
      { passive: true },
    );
    document.documentElement.addEventListener('pointerleave', () => (this.pointer.target = 0));
  }

  private resize() {
    const rect = this.host.getBoundingClientRect();
    this.w = Math.max(1, Math.round(rect.width));
    this.h = Math.max(1, Math.round(rect.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const narrow = this.w < 640;
    this.gap = narrow ? 8 : 9;
    this.step = narrow ? 5 : 6;

    if (this.anchor) {
      const a = this.anchor.getBoundingClientRect();
      this.ghost = { x: a.left - rect.left + a.width / 2, top: a.top - rect.top, r: a.width / 2, h: a.height };
    } else {
      const r = Math.min(this.w * 0.11, 180);
      this.ghost = { x: this.w * 0.72, top: this.h * 0.18, r, h: r * 2.4 };
    }
  }

  private loop = () => {
    if (this.reduced || this.raf || !this.inView || !this.pageVisible || this.introAt < 0) return;
    this.raf = requestAnimationFrame(this.frame);
  };

  private frame = (now: number) => {
    this.raf = 0;
    const dt = Math.min((now - this.last) / 1000, 1 / 20);
    this.last = now;
    this.time += dt;

    const p = this.pointer;
    const follow = 1 - Math.exp(-dt * 7);
    p.x += (p.tx - p.x) * follow;
    p.y += (p.ty - p.y) * follow;
    p.active += (p.target - p.active) * (1 - Math.exp(-dt * 3));

    // blink every few seconds
    if (this.time > this.blinkAt) {
      const t = (this.time - this.blinkAt) / 0.22;
      this.blink = t < 0.4 ? t / 0.4 : t < 1 ? 1 - (t - 0.4) / 0.6 : 0;
      if (t >= 1) this.blinkAt = this.time + 2.8 + Math.random() * 3.6;
    }

    this.render((now - this.introAt) / 1000);
    this.loop();
  };

  private render(elapsed: number) {
    const { ctx, w, h, gap, step } = this;
    const reduced = this.reduced;
    const t = reduced ? 0 : this.time;

    ctx.clearRect(0, 0, w, h);

    // ── ghost state ────────────────────────────────────────────────────────
    const g = this.ghost;
    const R = g.r;
    const rise = reduced ? 1 : easeInOutCubic(clamp((elapsed - 0.55) / 1.7));
    const bob = Math.sin(t * 0.9) * R * 0.05;
    const gx = g.x + Math.sin(t * 0.55) * R * 0.025;
    const gTop = g.top + bob;
    const domeY = gTop + R;
    const amp = R * 0.12;
    const hemC = gTop + g.h - amp;
    const lambda = R * 0.8;
    const phase = t * 1.6;
    const soft = Math.max(10, R * 0.17);
    const lift = R * 0.13;

    const bx0 = gx - R - soft * 2;
    const bx1 = gx + R + soft * 2;
    const by0 = gTop - soft * 2;
    const by1 = gTop + g.h + soft * 2;

    // eyes look toward the pointer
    const p = this.pointer;
    const eyeY = gTop + R * 1.024;
    let lx = 0;
    let ly = 0;
    if (p.active > 0.01) {
      const dx = p.x - gx;
      const dy = p.y - eyeY;
      const len = Math.hypot(dx, dy) || 1;
      const k = Math.min(len / 380, 1) * R * 0.075;
      lx = (dx / len) * k * p.active;
      ly = (dy / len) * k * p.active;
    }
    this.look.x += (lx - this.look.x) * 0.1;
    this.look.y += (ly - this.look.y) * 0.1;
    const erx = R * 0.145;
    const ery = R * 0.23 * (1 - this.blink * 0.9) * smoothstep(0.35, 0.8, rise);
    const eyes = [
      [gx - R * 0.36 + this.look.x, eyeY + this.look.y],
      [gx + R * 0.36 + this.look.x, eyeY + this.look.y],
    ];

    const field = (x: number, y: number) => {
      if (rise <= 0 || x < bx0 || x > bx1 || y < by0 || y > by1) return 0;
      let d: number;
      if (y < domeY) {
        const dx = x - gx;
        const dy = y - domeY;
        d = Math.sqrt(dx * dx + dy * dy) - R;
      } else {
        const side = Math.abs(x - gx) - R;
        const bottom = y - (hemC + amp * Math.cos(((x - gx) / lambda) * TAU + phase));
        d = side > 0 && bottom > 0 ? Math.sqrt(side * side + bottom * bottom) : Math.max(side, bottom);
      }
      const edge = 1 - smoothstep(-soft, soft, d);
      if (edge <= 0) return 0;
      return edge * (0.55 + 0.45 * Math.sqrt(clamp(-d / (R * 0.8)))) * rise;
    };

    // Eyes are true holes in the fabric. They live on the lifted surface, so in
    // rest coordinates they sit lower by the local lift.
    const eyeLift = field(eyes[0][0], eyeY) * lift;
    const holeY = eyeY + eyeLift;
    const eyeOpen = rise > 0.35;

    // pointer lens
    const pr = 150;
    const pr2 = pr * pr;
    const sigma2 = (pr * 0.42) ** 2;
    const pActive = reduced ? 0 : p.active;

    // ── threads ────────────────────────────────────────────────────────────
    const paths: Path2D[] = [];
    for (let i = 0; i < LEVELS; i++) paths.push(new Path2D());

    const lines = Math.ceil(h / gap) + 1;
    const offset = (h - (lines - 1) * gap) / 2;
    const shuttles: [number, number, number][] = [];

    for (let i = 0; i < lines; i++) {
      const y0 = offset + i * gap;

      // weave intro: each line is "shot" across, alternating direction
      const lp = reduced ? 1 : easeOutCubic(clamp((elapsed - i * 0.0065) / 0.85));
      if (lp <= 0) continue;
      const dir = i % 2 === 0 ? 1 : -1;
      const xa = dir > 0 ? 0 : w * (1 - lp);
      const xb = dir > 0 ? w * lp : w;

      const wave = reduced ? 0 : 0.7;
      const ph = i * 0.37 + t * 0.6;
      const near = pActive > 0.01 && Math.abs(y0 - p.y) < pr * 1.6;

      // visible spans of this thread = [xa, xb] minus the eye holes
      let spans: number[] = [xa, xb];
      if (eyeOpen && ery > 0.5) {
        for (let e = 0; e < 2; e++) {
          const dy = (y0 - (holeY + this.look.y)) / ery;
          if (dy <= -1 || dy >= 1) continue;
          const hw = erx * Math.sqrt(1 - dy * dy);
          const ha = eyes[e][0] - hw;
          const hb = eyes[e][0] + hw;
          const next: number[] = [];
          for (let k = 0; k < spans.length; k += 2) {
            const s0 = spans[k];
            const s1 = spans[k + 1];
            if (hb <= s0 || ha >= s1) {
              next.push(s0, s1);
              continue;
            }
            if (ha > s0) next.push(s0, ha);
            if (hb < s1) next.push(hb, s1);
          }
          spans = next;
        }
      }

      for (let k = 0; k < spans.length; k += 2) {
        const s0 = spans[k];
        const s1 = spans[k + 1];
        let level = -1;
        let px = 0;
        let py = 0;
        let first = true;

        for (let x = s0; ; x += step) {
          const cx = x > s1 ? s1 : x;
          let v = field(cx, y0);
          let y = y0 - v * lift + Math.sin(cx * 0.0042 + ph) * wave;

          if (near) {
            const dx = cx - p.x;
            const dy = y0 - p.y;
            const dd = dx * dx + dy * dy;
            if (dd < pr2 * 2.6) {
              const k2 = Math.exp(-dd / (2 * sigma2)) * pActive;
              y -= k2 * 9;
              v = Math.min(1, v + k2 * 0.42);
            }
          }

          const lv = Math.min(LEVELS - 1, Math.round(v * (LEVELS - 1)));
          if (first) {
            first = false;
            level = lv;
            paths[level].moveTo(cx, y);
          } else if (lv !== level) {
            level = lv;
            paths[level].moveTo(px, py);
            paths[level].lineTo(cx, y);
          } else {
            paths[level].lineTo(cx, y);
          }
          px = cx;
          py = y;
          if (cx >= s1) break;
        }
      }

      if (lp < 1) shuttles.push([dir > 0 ? xb : xa, y0, lp]);
    }

    ctx.lineWidth = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    for (let i = 0; i < LEVELS; i++) {
      ctx.strokeStyle = this.colors[i];
      ctx.stroke(paths[i]);
    }

    // the shuttle: a small phosphor spark at the head of each thread being woven
    if (shuttles.length) {
      for (const [sx, sy, sp] of shuttles) {
        ctx.fillStyle = `rgba(168,240,204,${(0.9 * (1 - sp)).toFixed(3)})`;
        ctx.fillRect(sx - 1, sy - 1, 2, 2);
      }
    }
  }
}
