/**
 * The hero "loom": a field of vertical warp threads with the Nightloom ghost woven into it.
 *
 * The ghost is never drawn directly. Its silhouette is rasterised into a small, blurred
 * height map; threads passing over it are pushed sideways and lit up, so the figure
 * emerges from the weave like a jacquard pattern. The cursor acts as a lantern that
 * parts and brightens the threads around it.
 *
 * Rendering is plain Canvas 2D. Each frame the threads are split into segments, binned
 * by brightness, and every bin is stroked in a single call — so a full-width field of
 * ~150 threads costs a handful of draw calls.
 */

type LoomOptions = {
  reducedMotion: boolean;
  /** 'right' parks the ghost beside a headline (home hero); 'center' puts it centre stage (404). */
  align?: 'right' | 'center';
  /** Height kept free at the top of the canvas, e.g. under a fixed header. */
  ceiling?: () => number;
};

export type Loom = {
  intro: (delay?: number) => void;
  setScrollProgress: (p: number) => void;
  /** Re-measures the copy the ghost keeps clear of (call once web fonts are in). */
  measure: () => void;
  destroy: () => void;
};

type Box = { l: number; t: number; r: number; b: number };

const BINS = 12;
const BASE_MAX = 0.4; // brightest the plain weave can get (under the lantern)

// Ghost silhouette in the same 48-unit space as the logo mark.
function traceGhost(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(35, 21);
  ctx.arc(24, 21, 11, 0, Math.PI, true);
  ctx.lineTo(13, 38.4);
  // Wavy hem: four soft scallops from left to right.
  const hem = [13, 18.5, 24, 29.5, 35];
  for (let i = 0; i < hem.length - 1; i++) {
    const a = hem[i];
    const b = hem[i + 1];
    const mid = (a + b) / 2;
    ctx.quadraticCurveTo(a + (mid - a) * 0.45, 35.4, mid, 35.5);
    ctx.quadraticCurveTo(mid + (b - mid) * 0.55, 35.6, b, 38.4);
  }
  ctx.lineTo(35, 21);
  ctx.closePath();
}

function boxBlur(src: Float32Array, w: number, h: number, r: number) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const span = r * 2 + 1;
  // Horizontal
  for (let y = 0; y < h; y++) {
    let acc = 0;
    for (let x = -r; x <= r; x++) acc += src[y * w + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = acc / span;
      const add = src[y * w + Math.min(w - 1, x + r + 1)];
      const sub = src[y * w + Math.max(0, x - r)];
      acc += add - sub;
    }
  }
  // Vertical
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / span;
      const add = tmp[Math.min(h - 1, y + r + 1) * w + x];
      const sub = tmp[Math.max(0, y - r) * w + x];
      acc += add - sub;
    }
  }
  return out;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function createLoom(
  canvas: HTMLCanvasElement,
  { reducedMotion, align = 'right', ceiling }: LoomOptions,
): Loom | null {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let spacing = 11;
  let step = 7;

  // Ghost placement (CSS px) and its height map.
  const ghost = { x: 0, y: 0, w: 0, h: 0, scale: 1 };
  let map = new Float32Array(0);
  let mapW = 0;
  let mapH = 0;
  const MAP_RES = 3; // CSS px per height-map cell

  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0, target: 0 };

  let introStart = -1;
  let introDelay = 0;
  let scrollProgress = 0;
  let visible = true;
  let raf = 0;
  let running = false;
  let startTime = performance.now();

  const base: Path2D[] = [];
  const ink: Path2D[] = [];

  function layout() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = width < 768;
    const tablet = !mobile && width <= 1080;
    spacing = mobile ? 9 : width < 1200 ? 10 : 11;
    step = mobile ? 8 : 7;

    // The copy sharing the canvas, and the column it sits in (narrower than the canvas on
    // very wide screens, where the layout stops growing).
    const boxes = obstacles();
    const colL = boxes.length ? Math.min(...boxes.map((o) => o.l)) : 0;
    const colW = boxes.length ? Math.max(...boxes.map((o) => o.r)) - colL : width;

    // Preferred size and centre of the ghost: right of the headline on wide screens, above
    // it on narrow ones. The silhouette spans x 13→35 and y 10→38 in logo units, centred on
    // (24, 24); fit() then nudges it clear of the copy.
    const centered = align === 'center';
    let gh: number;
    let cx: number;
    let cy: number;
    if (centered && (mobile || height > width)) {
      // Phones and portrait tablets: centred, above the headline.
      gh = Math.min(height * 0.5, width * (mobile ? 0.7 : 0.5));
      cx = width * 0.5;
      cy = height * 0.3;
    } else if (centered) {
      gh = Math.min(height * 0.52, colW * 0.36);
      cx = colL + colW * 0.68;
      cy = height * 0.42;
    } else if (mobile) {
      gh = Math.min(height * 0.34, width * 0.62);
      cx = width * 0.68;
      cy = height * 0.26;
    } else if (tablet) {
      gh = Math.min(height * 0.28, width * 0.4);
      cx = width * 0.7;
      cy = height * 0.235;
    } else {
      gh = Math.min(height * 0.47, colW * 0.31);
      cx = colL + colW * 0.79;
      cy = height * 0.385;
    }
    const spot = fit(boxes, cx, cy, gh);
    ghost.scale = spot.gh / 28;
    buildMap(spot.cx, spot.cy);
  }

  /**
   * The copy sharing the canvas, as canvas-local boxes. Elements marked
   * `data-loom-avoid="text"` count only their lines of text, not their (often full-width) box.
   * Boxes are taken where the copy comes to rest, even mid-way through its intro animation.
   */
  function obstacles(): Box[] {
    const host = canvas.parentElement;
    if (!host) return [];
    const origin = canvas.getBoundingClientRect();
    const boxes: Box[] = [];
    const add = (r: DOMRect, from: Element) => {
      if (r.width < 1 || r.height < 1) return;
      // Undo any translation still applied by the intro (hero lines rise into place).
      let dx = origin.left;
      let dy = origin.top;
      for (let el: Element | null = from; el && el !== host; el = el.parentElement) {
        const t = getComputedStyle(el).transform;
        if (t === 'none') continue;
        const m = new DOMMatrixReadOnly(t);
        dx += m.m41;
        dy += m.m42;
      }
      boxes.push({ l: r.left - dx, t: r.top - dy, r: r.right - dx, b: r.bottom - dy });
    };
    const range = document.createRange();
    host.querySelectorAll<HTMLElement>('[data-loom-avoid]').forEach((el) => {
      if (el.dataset.loomAvoid !== 'text') return add(el.getBoundingClientRect(), el);
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.nodeValue?.trim() || !node.parentElement) continue;
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) add(r, node.parentElement);
      }
    });
    return boxes;
  }

  /**
   * Keeps the ghost from hiding behind the copy. When its preferred spot overlaps any text,
   * take the nearest clear spot, shrinking the ghost a step at a time if it has to. Moving
   * is cheaper than shrinking; if nothing fits, the preferred spot stands.
   */
  function fit(boxes: Box[], cx: number, cy: number, gh: number) {
    if (!boxes.length) return { cx, cy, gh };
    const top = ceiling?.() ?? 0;
    const floor = height * 0.9;
    const gap = Math.max(16, gh * 0.045);
    const clear = (x: number, y: number, h: number) => {
      // The silhouette is 22 x 28 logo units; leave room for the bob and a little air.
      const hw = (h * 11) / 28 + gap;
      const hh = h / 2 + 11 + gap;
      const l = x - hw;
      const r = x + hw;
      const t = y - hh;
      const b = y + hh;
      if (l < 0 || r > width || t < top || b > floor) return false;
      return boxes.every((o) => r <= o.l || l >= o.r || b <= o.t || t >= o.b);
    };
    if (clear(cx, cy, gh)) return { cx, cy, gh };

    let best = { cx, cy, gh };
    let bestCost = Infinity;
    for (let step = 0; step <= 8; step++) {
      const k = 1 - step * 0.05;
      const sizeCost = (1 - k) * 2;
      if (sizeCost >= bestCost) break;
      for (let j = -35; j <= 35; j++) {
        for (let i = -30; i <= 30; i++) {
          const cost = sizeCost + Math.hypot(i, j) * 0.03;
          if (cost >= bestCost) continue;
          const x = cx + (i * width) / 100;
          const y = cy + (j * height) / 100;
          if (!clear(x, y, gh * k)) continue;
          best = { cx: x, cy: y, gh: gh * k };
          bestCost = cost;
        }
      }
    }
    return best;
  }

  function buildMap(cx: number, cy: number) {
    const pad = 6; // units of padding around the silhouette, room for the blur falloff
    const unitsW = 22 + pad * 2;
    const unitsH = 28 + pad * 2;
    const s = ghost.scale;
    mapW = Math.max(8, Math.round((unitsW * s) / MAP_RES));
    mapH = Math.max(8, Math.round((unitsH * s) / MAP_RES));
    // Top-left of the padded box, in canvas px.
    ghost.x = cx - (11 + pad) * s;
    ghost.y = cy - (14 + pad) * s;
    ghost.w = unitsW * s;
    ghost.h = unitsH * s;

    const off = document.createElement('canvas');
    off.width = mapW;
    off.height = mapH;
    const octx = off.getContext('2d');
    if (!octx) return;
    const k = s / MAP_RES;
    octx.setTransform(k, 0, 0, k, (pad - 13) * k, (pad - 10) * k);
    octx.fillStyle = '#fff';
    traceGhost(octx);
    octx.fill();
    // Eyes punch holes in the weave.
    octx.globalCompositeOperation = 'destination-out';
    octx.beginPath();
    octx.ellipse(19.3, 21.6, 2.35, 3.4, 0, 0, Math.PI * 2);
    octx.ellipse(28.7, 21.6, 2.35, 3.4, 0, 0, Math.PI * 2);
    octx.fill();

    const data = octx.getImageData(0, 0, mapW, mapH).data;
    const raw = new Float32Array(mapW * mapH);
    for (let i = 0; i < raw.length; i++) raw[i] = data[i * 4 + 3] / 255;
    const r = Math.max(1, Math.round((0.22 * s) / MAP_RES));
    map = boxBlur(boxBlur(raw, mapW, mapH, r), mapW, mapH, r);
  }

  function sample(x: number, y: number) {
    const lx = (x - ghost.x) / MAP_RES;
    const ly = (y - ghost.y) / MAP_RES;
    if (lx < 0 || ly < 0 || lx >= mapW - 1 || ly >= mapH - 1) return 0;
    const x0 = lx | 0;
    const y0 = ly | 0;
    const fx = lx - x0;
    const fy = ly - y0;
    const i = y0 * mapW + x0;
    const a = map[i];
    const b = map[i + 1];
    const c = map[i + mapW];
    const d = map[i + mapW + 1];
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  }

  function draw(now: number) {
    const t = reducedMotion ? 0 : now - startTime;
    ctx!.clearRect(0, 0, width, height);

    // Intro: threads are strung top-to-bottom, left-to-right; then the ghost surfaces.
    let stringT = 1;
    let ghostT = 1;
    if (introStart >= 0 && !reducedMotion) {
      const e = now - introStart - introDelay;
      stringT = clamp01(e / 1700);
      ghostT = easeInOutCubic(clamp01((e - 800) / 1900));
    } else if (introStart < 0) {
      stringT = 0;
      ghostT = 0;
    }

    const fade = 1 - clamp01(scrollProgress * 1.25);
    const amp = ghostT * (1 - clamp01(scrollProgress * 1.6));
    const bob = reducedMotion ? 0 : Math.sin(t * 0.00055) * 7 + Math.sin(t * 0.00021) * 4;

    // Pointer easing (the lantern lags slightly behind the cursor).
    pointer.x += (pointer.tx - pointer.x) * 0.12;
    pointer.y += (pointer.ty - pointer.y) * 0.12;
    pointer.strength += (pointer.target - pointer.strength) * 0.06;
    const lantern = 150;
    const inv2r2 = 1 / (2 * lantern * lantern);

    for (let b = 0; b < BINS; b++) {
      base[b] = new Path2D();
      ink[b] = new Path2D();
    }

    const count = Math.ceil(width / spacing) + 1;
    const offset = (width - (count - 1) * spacing) / 2;
    const shift = 3.5; // max sideways push inside the ghost, px

    for (let i = 0; i < count; i++) {
      const x0 = offset + i * spacing;
      // Each thread drops in with a small stagger.
      const local = clamp01(stringT * 1.35 - (i / count) * 0.35);
      const len = easeOutCubic(local) * height;
      if (len <= 0) continue;

      // Threads near the left edge (behind the headline) stay quieter.
      const xn = x0 / width;
      const zone = 0.5 + 0.5 * clamp01((xn - 0.2) / 0.5);

      let px = 0;
      let py = 0;
      let baseBin = -1;
      let inkBin = -1;

      for (let y = 0; y <= len + step; y += step) {
        const yy = Math.min(y, len);
        const h = amp > 0 ? sample(x0, yy - bob) * amp : 0;
        const sway = reducedMotion ? 0 : Math.sin(yy * 0.006 + t * 0.0005 + i * 0.35) * 0.8;

        let push = 0;
        let glow = 0;
        if (pointer.strength > 0.01) {
          const dx = x0 - pointer.x;
          const dy = yy - pointer.y;
          const f = Math.exp(-(dx * dx + dy * dy) * inv2r2) * pointer.strength;
          push = (dx >= 0 ? 1 : -1) * f * 14 * Math.min(1, Math.abs(dx) / 24);
          glow = f;
        }

        const x = x0 + h * shift + sway + push;

        // Base weave, lifted by the lantern.
        const a = (0.07 * zone + glow * 0.3) * fade;
        const bb = Math.min(BINS - 1, Math.floor((a / BASE_MAX) * BINS));
        // Ink: the ghost itself, drawn heavier and brighter where the height map is high.
        const ib = h > 0.035 ? Math.min(BINS - 1, Math.floor(h * fade * BINS)) : -1;

        if (y === 0) {
          base[bb].moveTo(x, yy);
          baseBin = bb;
          if (ib >= 0) ink[ib].moveTo(x, yy);
          inkBin = ib;
          px = x;
          py = yy;
          continue;
        }

        if (bb !== baseBin) {
          base[bb].moveTo(px, py);
          baseBin = bb;
        }
        base[bb].lineTo(x, yy);

        if (ib >= 0) {
          if (ib !== inkBin) ink[ib].moveTo(px, py);
          ink[ib].lineTo(x, yy);
        }
        inkBin = ib;

        px = x;
        py = yy;
        if (yy >= len) break;
      }
    }

    ctx!.lineCap = 'round';
    ctx!.lineWidth = 1;
    for (let b = 0; b < BINS; b++) {
      const a = ((b + 0.5) / BINS) * BASE_MAX;
      if (a < 0.006) continue;
      ctx!.strokeStyle = `rgba(236, 233, 227, ${a.toFixed(3)})`;
      ctx!.stroke(base[b]);
    }
    for (let b = 0; b < BINS; b++) {
      const k = (b + 0.5) / BINS;
      ctx!.lineWidth = 0.9 + k * 1.1;
      ctx!.strokeStyle = `rgba(236, 233, 227, ${(0.04 + k * 0.62).toFixed(3)})`;
      ctx!.stroke(ink[b]);
    }
  }

  function loop(now: number) {
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onResize = () => {
    layout();
    if (!running) draw(performance.now());
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(canvas);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !document.hidden) start();
    else stop();
  });
  io.observe(canvas);

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (visible) start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const host = canvas.parentElement ?? canvas;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const r = canvas.getBoundingClientRect();
    pointer.tx = e.clientX - r.left;
    pointer.ty = e.clientY - r.top;
    if (pointer.x < -1000) {
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
    }
    pointer.target = 1;
  };
  const onLeave = () => {
    pointer.target = 0;
  };
  if (!reducedMotion) {
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
  }

  layout();

  return {
    intro(delay = 0) {
      introStart = performance.now();
      introDelay = delay;
      startTime = performance.now();
      if (reducedMotion) draw(performance.now());
      else start();
    },
    setScrollProgress(p: number) {
      scrollProgress = p;
      if (reducedMotion) draw(performance.now());
    },
    measure: onResize,
    destroy() {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    },
  };
}
