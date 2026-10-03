/**
 * Hero scene: a dithered night sky with a crescent moon and a floating ghost,
 * rendered on a pixel grid. The scene is "woven" in row by row on load,
 * the ghost follows the cursor with its eyes and phases out when clicked.
 */
import {
  bayer,
  clamp,
  ghostBounds,
  ghostEyes,
  ghostLocalX,
  ghostTone,
  inGhost,
  makeGhost,
  moonAlpha,
  rng,
  threadPath,
} from '@/lib/ghost-geometry';

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Star {
  x: number;
  y: number;
  base: number;
  speed: number;
  phase: number;
  big: boolean;
}

export interface SceneHandle {
  destroy: () => void;
}

export function mountGhostScene(root: HTMLElement, opts: { reducedMotion: boolean }): SceneHandle | null {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const viewport = canvas?.parentElement;
  const ctx = canvas?.getContext('2d', { alpha: false });
  if (!canvas || !viewport || !ctx) return null;

  const coordsEl = root.querySelector<HTMLElement>('[data-scene-coords]');
  const css = getComputedStyle(root);
  const color = {
    bg: css.getPropertyValue('--scene-bg').trim() || '#0b0b0e',
    fg: css.getPropertyValue('--fg').trim() || '#ecece6',
    shade: '#9a9a94',
    accent: css.getPropertyValue('--accent').trim() || '#b6f36a',
  };

  // Grid geometry in device pixels.
  let dpr = 1;
  let cpx = 8;
  let gap = 1;
  let cols = 0;
  let rows = 0;
  let ox = 0;
  let oy = 0;

  const staticLayer = document.createElement('canvas');
  const sctx = staticLayer.getContext('2d')!;

  let stars: Star[] = [];
  let ghost = makeGhost(10, 0, 0);
  let homeCx = 0;
  let baseTop = 0;

  // Interaction state
  const mouse = { x: -1, y: -1, inside: false, lastMove: -1e9 };
  const look = { x: 0, y: 0, tx: 0, ty: 0, nextWander: 0 };
  let blinkUntil = 0;
  let nextBlink = 2500;
  let phaseState: 'idle' | 'out' | 'in' = 'idle';
  let phaseStart = 0;

  const start = performance.now();
  const weaveDuration = opts.reducedMotion ? 0 : 1900;
  let raf = 0;
  let inView = true;
  let pageVisible = !document.hidden;
  let lastFrame = 0;

  /* ------------------------------------------------------------ */

  function rect(c: CanvasRenderingContext2D, x: number, y: number) {
    c.fillRect(ox + x * cpx, oy + y * cpx, cpx - gap, cpx - gap);
  }

  function resize() {
    const r = viewport!.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    canvas!.width = staticLayer.width = w;
    canvas!.height = staticLayer.height = h;

    const cell = r.width < 440 ? 6 : 8;
    cpx = Math.max(2, Math.round(cell * dpr));
    gap = Math.max(1, Math.round(dpr));
    cols = Math.floor(w / cpx);
    rows = Math.floor(h / cpx);
    ox = Math.floor((w - cols * cpx) / 2) + Math.floor(gap / 2);
    oy = Math.floor((h - rows * cpx) / 2) + Math.floor(gap / 2);

    homeCx = Math.round(cols * 0.47);
    baseTop = Math.round(rows * 0.34);
    ghost = makeGhost(clamp(Math.round(cols * 0.155), 7, 13), homeCx, baseTop);

    buildStatic();
  }

  /** Background: dot lattice, dithered crescent moon, low mist and stars. */
  function buildStatic() {
    sctx.fillStyle = color.bg;
    sctx.fillRect(0, 0, staticLayer.width, staticLayer.height);

    // Dot lattice
    sctx.fillStyle = 'rgba(255,255,255,0.07)';
    const d = Math.max(1, Math.round(dpr));
    for (let y = 1; y < rows; y += 2) {
      for (let x = 1; x < cols; x += 2) {
        sctx.fillRect(ox + x * cpx + (cpx - gap) / 2 - d / 2, oy + y * cpx + (cpx - gap) / 2 - d / 2, d, d);
      }
    }

    // Crescent moon
    const mr = Math.max(5, Math.round(Math.min(cols, rows) * 0.14));
    const mx = Math.round(cols * 0.77);
    const my = Math.round(rows * 0.2);
    for (let y = my - mr * 2; y <= my + mr * 2; y++) {
      for (let x = mx - mr * 2; x <= mx + mr * 2; x++) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const a = moonAlpha(x, y, mx, my, mr);
        if (!a) continue;
        sctx.fillStyle = `rgba(236,236,230,${a})`;
        rect(sctx, x, y);
      }
    }

    // Mist near the bottom
    const mistTop = Math.floor(rows * 0.84);
    sctx.fillStyle = 'rgba(236,236,230,0.05)';
    for (let y = mistTop; y < rows; y++) {
      const k = (y - mistTop + 1) / Math.max(1, rows - mistTop);
      for (let x = 0; x < cols; x++) {
        const n = 0.5 + 0.5 * Math.sin(x * 0.19 + Math.cos(x * 0.05) * 2);
        if (k * 0.5 * (0.6 + 0.4 * n) > bayer(x, y)) rect(sctx, x, y);
      }
    }

    // Stars
    const rand = rng(7);
    const count = Math.round((cols * rows) / 95);
    stars = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(rand() * cols);
      const y = Math.floor(rand() * rows * 0.72);
      const base = 0.18 + rand() * 0.5;
      const speed = 0.6 + rand() * 2.2;
      const phase = rand() * Math.PI * 2;
      const big = rand() > 0.93;
      if (Math.hypot(x - mx, y - my) < mr * 2.1) continue;
      stars.push({ x, y, base, speed, phase, big });
    }
  }

  /* ------------------------------------------------------------ */

  function drawGhost(t: number, revealRow: number, dissolve: number) {
    const eyes = ghostEyes(ghost, look.x, look.y, t < blinkUntil);
    const { x0, x1, y0, y1 } = ghostBounds(ghost);
    const light: number[] = [];
    const shade: number[] = [];
    const aura: number[] = [];

    for (let y = Math.max(0, y0); y <= Math.min(rows - 1, y1); y++) {
      if (y >= revealRow) break;
      for (let x = Math.max(0, x0); x <= Math.min(cols - 1, x1); x++) {
        const tone = ghostTone(ghost, x, y, eyes, dissolve);
        if (tone === 'light') light.push(x, y);
        else if (tone === 'shade') shade.push(x, y);
        else if (tone === 'aura') aura.push(x, y);
      }
    }

    ctx!.fillStyle = color.fg;
    ctx!.globalAlpha = 0.12;
    for (let i = 0; i < aura.length; i += 2) rect(ctx!, aura[i]!, aura[i + 1]!);
    ctx!.globalAlpha = 1;
    for (let i = 0; i < light.length; i += 2) rect(ctx!, light[i]!, light[i + 1]!);
    ctx!.fillStyle = color.shade;
    for (let i = 0; i < shade.length; i += 2) rect(ctx!, shade[i]!, shade[i + 1]!);
  }

  /** A loose thread trailing from the hem — the loom motif. */
  function drawThread(t: number, revealRow: number, dissolve: number) {
    if (dissolve > 0.4) return;
    ctx!.fillStyle = color.accent;
    for (const p of threadPath(ghost, t)) {
      if (p.y >= revealRow || p.y < 0 || p.y >= rows) continue;
      ctx!.globalAlpha = p.a;
      rect(ctx!, p.x, p.y);
    }
    ctx!.globalAlpha = 1;
  }

  function drawStars(t: number, revealRow: number) {
    ctx!.fillStyle = color.fg;
    for (const s of stars) {
      if (s.y >= revealRow) continue;
      const tw = Math.sin(t * 0.001 * s.speed + s.phase);
      const a = tw > 0.55 ? s.base * 0.25 : s.base;
      ctx!.globalAlpha = a;
      rect(ctx!, s.x, s.y);
      if (s.big) {
        ctx!.globalAlpha = a * 0.35;
        rect(ctx!, s.x - 1, s.y);
        rect(ctx!, s.x + 1, s.y);
        rect(ctx!, s.x, s.y - 1);
        rect(ctx!, s.x, s.y + 1);
      }
    }
    ctx!.globalAlpha = 1;
  }

  /** Dithered "flashlight" around the cursor + a pixel cursor cell. */
  function drawCursor() {
    if (!mouse.inside) return;
    const r = 7;
    ctx!.fillStyle = color.fg;
    for (let y = mouse.y - r; y <= mouse.y + r; y++) {
      for (let x = mouse.x - r; x <= mouse.x + r; x++) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const d = Math.hypot(x - mouse.x, y - mouse.y) / r;
        if (d >= 1) continue;
        if ((1 - d) * 0.55 > bayer(x, y)) {
          ctx!.globalAlpha = 0.05 + (1 - d) * 0.08;
          rect(ctx!, x, y);
        }
      }
    }
    ctx!.globalAlpha = 1;
    ctx!.strokeStyle = color.accent;
    ctx!.lineWidth = Math.max(1, Math.round(dpr));
    const half = ctx!.lineWidth / 2;
    ctx!.strokeRect(ox + mouse.x * cpx + half, oy + mouse.y * cpx + half, cpx - gap - half * 2, cpx - gap - half * 2);
  }

  /** The bright "shuttle" row that weaves the scene in on load. */
  function drawShuttle(revealRow: number) {
    const row = Math.floor(revealRow);
    if (row < 0 || row >= rows) return;
    ctx!.fillStyle = color.accent;
    for (let x = 0; x < cols; x++) {
      ctx!.globalAlpha = 0.85 * (Math.random() > 0.12 ? 1 : 0.3);
      rect(ctx!, x, row);
      if (row - 1 >= 0 && Math.random() > 0.55) {
        ctx!.globalAlpha = 0.28;
        rect(ctx!, x, row - 1);
      }
    }
    ctx!.globalAlpha = 1;
  }

  /* ------------------------------------------------------------ */

  function update(t: number) {
    if (!opts.reducedMotion) {
      ghost.phase = Math.floor(t / 160) * 0.55;
      ghost.sway = Math.sin(t * 0.0011) * 1.4;
      ghost.top = Math.round(baseTop + Math.sin(t * 0.0017) * 1.1);
    }

    // Eyes: follow the cursor, otherwise wander now and then.
    if (mouse.inside && t - mouse.lastMove < 4000) {
      const ex = ghost.cx + ghost.R * 0.2;
      const ey = ghost.top + ghost.R * 0.9;
      look.tx = clamp((mouse.x - ex) / 6, -1.4, 1.6);
      look.ty = clamp((mouse.y - ey) / 8, -1, 1.2);
    } else if (t > look.nextWander) {
      const r = Math.random();
      look.tx = r < 0.5 ? 1 : r < 0.75 ? 0 : -1;
      look.ty = Math.random() < 0.7 ? 0 : 1;
      look.nextWander = t + 1800 + Math.random() * 2600;
    }
    look.x += (look.tx - look.x) * 0.35;
    look.y += (look.ty - look.y) * 0.35;

    if (t > nextBlink && !opts.reducedMotion) {
      blinkUntil = t + 130;
      nextBlink = t + 2400 + Math.random() * 3800;
    }
  }

  /** Click easter egg: the ghost dissolves and re-materialises nearby. */
  function phaseProgress(t: number): number {
    if (phaseState === 'idle') return 0;
    const dt = t - phaseStart;
    if (phaseState === 'out') {
      const p = dt / 320;
      if (p < 1) return p;
      const span = Math.max(2, Math.round(cols * 0.18));
      ghost.cx = clamp(homeCx + Math.round((Math.random() * 2 - 1) * span), ghost.R + 3, cols - ghost.R - 3);
      phaseState = 'in';
      phaseStart = t;
      return 1;
    }
    const p = dt / 420;
    if (p >= 1) {
      phaseState = 'idle';
      return 0;
    }
    return 1 - p;
  }

  function render(now: number) {
    const t = now - start;
    const p = weaveDuration ? clamp(t / weaveDuration, 0, 1) : 1;
    const revealRow = p >= 1 ? rows + 10 : easeInOut(p) * (rows + 3);

    update(t);
    const dissolve = phaseProgress(t);

    ctx!.drawImage(staticLayer, 0, 0);
    if (revealRow < rows) {
      ctx!.fillStyle = color.bg;
      const yPx = oy + Math.max(0, Math.floor(revealRow)) * cpx;
      ctx!.fillRect(0, yPx, canvas!.width, canvas!.height - yPx);
    }
    drawStars(t, revealRow);
    drawThread(t, revealRow, dissolve);
    drawGhost(t, revealRow, dissolve);
    drawCursor();
    if (p < 1) drawShuttle(revealRow);
  }

  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    if (!inView || !pageVisible) return;
    if (now - lastFrame < 1000 / 30) return;
    lastFrame = now;
    render(now);
  }

  /* ------------------------------------------------------------ */

  function toCell(e: PointerEvent) {
    const r = canvas!.getBoundingClientRect();
    return {
      x: Math.floor(((e.clientX - r.left) * dpr - ox) / cpx),
      y: Math.floor(((e.clientY - r.top) * dpr - oy) / cpx),
    };
  }

  const overGhost = (x: number, y: number, e: number) => inGhost(ghost, ghostLocalX(ghost, x, y), y + 0.5 - ghost.top, e);

  const onMove = (e: PointerEvent) => {
    const c = toCell(e);
    mouse.x = c.x;
    mouse.y = c.y;
    mouse.inside = c.x >= 0 && c.y >= 0 && c.x < cols && c.y < rows;
    mouse.lastMove = performance.now() - start;
    if (coordsEl) {
      const fmt = (v: number) => String(clamp(v, 0, 999)).padStart(3, '0');
      coordsEl.textContent = `X ${fmt(c.x)} · Y ${fmt(c.y)}`;
    }
    canvas!.style.cursor = overGhost(c.x, c.y, 0.5) ? 'pointer' : 'crosshair';
    if (opts.reducedMotion) render(performance.now());
  };

  const onLeave = () => {
    mouse.inside = false;
    if (coordsEl) coordsEl.textContent = 'X --- · Y ---';
    if (opts.reducedMotion) render(performance.now());
  };

  const onDown = (e: PointerEvent) => {
    if (opts.reducedMotion || phaseState !== 'idle') return;
    const c = toCell(e);
    if (overGhost(c.x, c.y, 0.8)) {
      phaseState = 'out';
      phaseStart = performance.now() - start;
    }
  };

  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);

  const ro = new ResizeObserver(() => {
    resize();
    render(performance.now());
  });
  ro.observe(viewport);

  const io = new IntersectionObserver(([entry]) => {
    inView = !!entry?.isIntersecting;
  });
  io.observe(root);

  const onVisibility = () => {
    pageVisible = !document.hidden;
  };
  document.addEventListener('visibilitychange', onVisibility);

  resize();
  root.classList.add('is-live');
  if (opts.reducedMotion) render(performance.now());
  else raf = requestAnimationFrame(loop);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
    },
  };
}
