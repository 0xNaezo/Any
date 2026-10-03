import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ghostOutline } from '../../lib/ghost';

/* ──────────────────────────────────────────────────────────────────────────
   Hero: intro choreography + the ghost and its trail of woven threads.
   The ghost glides in place (bobbing, rippling hem, eyes that follow the
   cursor); a silk ribbon of threads streams out of its tail across the hero.
   ────────────────────────────────────────────────────────────────────────── */

interface Thread {
  u: number; // lateral position inside the ribbon (-0.5…0.5)
  ph: number;
  a: number;
  w: number;
  sp: number;
}

interface Pulse {
  th: number;
  s: number;
  v: number;
  size: number;
  burst?: boolean;
}

type Point = [number, number];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const STEPS = 120;
const REPEL_RADIUS = 140;

export function initHero(motion: boolean) {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) {
    root.classList.add('hero-ready');
    return;
  }

  const canvas = hero.querySelector<HTMLCanvasElement>('[data-threads]');
  const ghost = hero.querySelector<HTMLElement>('[data-ghost]');
  const inner = hero.querySelector<HTMLElement>('[data-ghost-inner]');
  const shape = hero.querySelector<SVGPathElement>('[data-ghost-shape]');
  const look = hero.querySelector<SVGGElement>('[data-ghost-look]');
  const eyes = hero.querySelector<SVGGElement>('[data-ghost-eyes]');
  const ctx = canvas?.getContext('2d');

  // shared with the intro timeline
  const state = { reveal: motion ? 0 : 1, alpha: motion ? 0 : 1 };

  playIntro(hero, motion, state);

  if (!canvas || !ctx || !ghost || !inner || !shape || !look || !eyes) return;

  let W = 0;
  let H = 0;
  let box = { x: 0, y: 0, size: 0 };
  let threads: Thread[] = [];
  let pulses: Pulse[] = [];
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, strength: 0, inside: false };
  let lookX = 0;
  let lookY = 0;
  const tmp: Point = [0, 0];

  /* ── Layout ───────────────────────────────────────────── */
  const offsetWithin = (el: HTMLElement, ancestor: HTMLElement) => {
    let x = 0;
    let y = 0;
    let node: HTMLElement | null = el;
    while (node && node !== ancestor) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return { x, y };
  };

  const measure = () => {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, W < 860 ? 1.5 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const o = offsetWithin(ghost, hero);
    box = { x: o.x, y: o.y, size: ghost.offsetWidth };

    const count = W >= 1200 ? 56 : W >= 860 ? 44 : 30;
    if (threads.length !== count) {
      threads = Array.from({ length: count }, (_, i) => ({
        u: i / (count - 1) - 0.5 + rand(-0.01, 0.01),
        ph: rand(0, Math.PI * 2),
        a: rand(0.1, 0.34),
        w: Math.random() < 0.1 ? 1.5 : 0.75,
        sp: rand(0.7, 1.2),
      }));
      pulses = Array.from({ length: W >= 860 ? 9 : 5 }, () => ({
        th: Math.floor(rand(0, count)),
        s: Math.random(),
        v: rand(0.08, 0.16),
        size: rand(7, 11),
      }));
    }
  };

  /* ── Thread geometry ──────────────────────────────────── */
  const controlPoints = (ax: number, ay: number): Point[] => {
    if (W < 860) {
      // stacked layout: the ribbon sweeps left between the social proof and the stats
      return [
        [ax, ay],
        [ax - W * 0.35, ay + 6],
        [W * 0.3, ay + H * 0.05],
        [-W * 0.15, ay + H * 0.035],
      ];
    }
    return [
      [ax, ay],
      [ax - W * 0.2, ay + H * 0.03],
      [W * 0.42, H * 1.04],
      [-W * 0.06, H * 0.84],
    ];
  };

  const threadPoint = (th: Thread, s: number, t: number, P: Point[], ribbon: number, out: Point) => {
    const u = 1 - s;
    const a = u * u * u;
    const b = 3 * u * u * s;
    const c = 3 * u * s * s;
    const d = s * s * s;
    const bx = a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0];
    const by = a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1];
    const dx = 3 * u * u * (P[1][0] - P[0][0]) + 6 * u * s * (P[2][0] - P[1][0]) + 3 * s * s * (P[3][0] - P[2][0]);
    const dy = 3 * u * u * (P[1][1] - P[0][1]) + 6 * u * s * (P[2][1] - P[1][1]) + 3 * s * s * (P[3][1] - P[2][1]);
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const width = 3 + ribbon * Math.pow(s, 0.8);
    const twist = Math.PI * 2 * 1.1 * s - t * 0.35;
    const off = th.u * width * Math.cos(twist + th.u * 0.7) + Math.sin(s * 9 * th.sp + t * 0.8 + th.ph) * 8 * s * s;

    let x = bx + nx * off;
    let y = by + ny * off;

    if (pointer.strength > 0.01) {
      const px = x - pointer.sx;
      const py = y - pointer.sy;
      const d2 = px * px + py * py;
      if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
        const dist = Math.sqrt(d2) || 1;
        const f = 1 - dist / REPEL_RADIUS;
        const push = f * f * 46 * pointer.strength;
        x += (px / dist) * push;
        y += (py / dist) * push;
      }
    }
    out[0] = x;
    out[1] = y;
  };

  const drawThreads = (t: number, dt: number, ax: number, ay: number) => {
    ctx.clearRect(0, 0, W, H);
    if (state.alpha <= 0.001 || state.reveal <= 0.001) return;

    const P = controlPoints(ax, ay);
    const ribbon = W < 860 ? Math.min(90, H * 0.07) : H * 0.25;
    const lastStep = Math.max(1, Math.floor(STEPS * state.reveal));

    ctx.globalCompositeOperation = 'lighter';
    const grad = ctx.createLinearGradient(P[0][0], P[0][1], P[3][0], P[3][1]);
    grad.addColorStop(0, 'rgba(236,232,255,0)');
    grad.addColorStop(0.06, 'rgba(236,232,255,1)');
    grad.addColorStop(0.4, 'rgba(167,152,255,1)');
    grad.addColorStop(0.82, 'rgba(127,227,242,0.9)');
    grad.addColorStop(1, 'rgba(127,227,242,0)');
    ctx.strokeStyle = grad;

    for (const th of threads) {
      ctx.beginPath();
      for (let k = 0; k <= lastStep; k++) {
        threadPoint(th, k / STEPS, t, P, ribbon, tmp);
        if (k === 0) ctx.moveTo(tmp[0], tmp[1]);
        else ctx.lineTo(tmp[0], tmp[1]);
      }
      ctx.globalAlpha = th.a * state.alpha;
      ctx.lineWidth = th.w;
      ctx.stroke();
    }

    // light pulses travelling along the fibres
    ctx.globalAlpha = 1;
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.s += p.v * dt;
      if (p.s > 1) {
        if (p.burst) {
          pulses.splice(i, 1);
          continue;
        }
        p.s = 0;
        p.th = Math.floor(rand(0, threads.length));
      }
      if (p.s > state.reveal) continue;
      threadPoint(threads[p.th], p.s, t, P, ribbon, tmp);
      const a = Math.sin(Math.PI * p.s) * state.alpha;
      const g = ctx.createRadialGradient(tmp[0], tmp[1], 0, tmp[0], tmp[1], p.size);
      g.addColorStop(0, `rgba(255,255,255,${0.9 * a})`);
      g.addColorStop(0.3, `rgba(190,180,255,${0.35 * a})`);
      g.addColorStop(1, 'rgba(167,152,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(tmp[0], tmp[1], p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  /* ── Frame ─────────────────────────────────────────────── */
  const render = (t: number, dt: number) => {
    const { d, tail } = ghostOutline(t);
    shape.setAttribute('d', d);

    const s = box.size;
    const bob = motion ? Math.sin(t * 1.2) * s * 0.03 : 0;
    const tilt = motion ? Math.sin(t * 0.9) * 2 : 0;
    const parallax = motion ? -Math.min(window.scrollY, H) * 0.18 : 0;
    ghost.style.transform = `translate3d(0, ${(bob + parallax).toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;

    // eyes: follow the cursor, or wander lazily when it's away
    let tx: number;
    let ty: number;
    if (pointer.inside) {
      const cx = box.x + s * 0.55;
      const cy = box.y + s * 0.46 + bob + parallax;
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, dist / 260);
      tx = (dx / dist) * 1.15 * k;
      ty = (dy / dist) * 0.95 * k;
    } else {
      tx = motion ? Math.sin(t * 0.7) * 0.8 : -0.6;
      ty = motion ? Math.sin(t * 1.1) * 0.35 : 0.2;
    }
    lookX += (tx - lookX) * (motion ? 0.08 : 1);
    lookY += (ty - lookY) * (motion ? 0.08 : 1);
    look.setAttribute('transform', `translate(${lookX.toFixed(3)} ${lookY.toFixed(3)})`);

    // where the threads leave the tail, in hero coordinates (tilt is around the box centre)
    const lx = (tail[0] / 32) * s - s / 2;
    const ly = (tail[1] / 32) * s - s / 2;
    const rad = (tilt * Math.PI) / 180;
    const ax = box.x + s / 2 + lx * Math.cos(rad) - ly * Math.sin(rad);
    const ay = box.y + s / 2 + lx * Math.sin(rad) + ly * Math.cos(rad) + bob + parallax;

    pointer.sx += (pointer.x - pointer.sx) * 0.15;
    pointer.sy += (pointer.y - pointer.sy) * 0.15;
    pointer.strength += ((pointer.inside ? 1 : 0) - pointer.strength) * 0.06;

    drawThreads(t, dt, ax, ay);
  };

  /* ── Loop & visibility ─────────────────────────────────── */
  let raf = 0;
  let running = false;
  let inView = true;
  let last = performance.now();

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    render(now / 1000, dt);
  };
  const start = () => {
    if (running || !motion) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  measure();
  if (motion) start();
  else render(2.4, 0);

  let resizeRaf = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      measure();
      if (!running) render(motion ? performance.now() / 1000 : 2.4, 0);
    });
  }).observe(hero);

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    },
    { rootMargin: '120px 0px' },
  ).observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (inView) start();
  });

  /* ── Pointer ───────────────────────────────────────────── */
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = hero.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    if (!pointer.inside) {
      pointer.sx = pointer.x;
      pointer.sy = pointer.y;
    }
    pointer.inside = true;
  });
  hero.addEventListener('pointerleave', () => {
    pointer.inside = false;
  });

  if (!motion) return;

  /* ── Personality: blinking + a little hop when poked ───── */
  gsap.set(eyes, { transformOrigin: '50% 50%' });
  const blink = () => {
    gsap.to(eyes, { scaleY: 0.08, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    gsap.delayedCall(rand(2.6, 5.8), blink);
  };
  gsap.delayedCall(3, blink);

  inner.addEventListener('click', () => {
    gsap
      .timeline({ overwrite: true })
      .to(inner, { scaleX: 1.16, scaleY: 0.86, y: 6, duration: 0.14, ease: 'power2.out', transformOrigin: '50% 85%' })
      .to(inner, { scaleX: 0.92, scaleY: 1.1, y: -30, duration: 0.24, ease: 'power2.out' })
      .to(inner, { scaleX: 1, scaleY: 1, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' });
    for (let i = 0; i < 12; i++) {
      pulses.push({ th: Math.floor(rand(0, threads.length)), s: rand(0, 0.04), v: rand(0.28, 0.5), size: rand(8, 14), burst: true });
    }
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   Intro choreography — runs once fonts are ready (capped so it never stalls)
   ────────────────────────────────────────────────────────────────────────── */
function playIntro(hero: HTMLElement, motion: boolean, state: { reveal: number; alpha: number }) {
  const root = document.documentElement;
  const title = hero.querySelector<HTMLElement>('[data-hero-title]');
  const items = hero.querySelectorAll<HTMLElement>('[data-hero-item]');
  const ghostInner = hero.querySelector<HTMLElement>('[data-ghost-inner]');
  const navBar = document.querySelector<HTMLElement>('[data-nav] .nav-bar');
  const counters = Array.from(hero.querySelectorAll<HTMLElement>('[data-counter]'));

  if (!motion) {
    root.classList.add('hero-ready');
    return;
  }

  counters.forEach((el) => (el.textContent = '0'));

  const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 900))]);

  fontsReady.then(() => {
    const tl = gsap.timeline({ delay: 0.05 });

    if (navBar) tl.from(navBar, { y: -24, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0);

    if (title) {
      SplitText.create(title, {
        type: 'lines',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          gsap.set(title, { visibility: 'visible' });
          return gsap.from(self.lines, { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
        },
      });
    }

    tl.from(items, { y: 26, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0.45);

    if (ghostInner) {
      tl.from(
        ghostInner,
        { opacity: 0, scale: 0.7, yPercent: 18, filter: 'blur(14px)', duration: 1.8, ease: 'expo.out', clearProps: 'filter' },
        0.25,
      );
    }

    tl.to(state, { alpha: 1, duration: 1.4, ease: 'power1.out' }, 0.9);
    tl.to(state, { reveal: 1, duration: 2.6, ease: 'power2.inOut' }, 0.9);

    counters.forEach((el) => {
      const to = Number(el.dataset.to ?? 0);
      const obj = { v: 0 };
      tl.to(
        obj,
        {
          v: to,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        },
        1,
      );
    });

    // from-states are applied synchronously above, so this can't flash
    root.classList.add('hero-ready');
  });
}
