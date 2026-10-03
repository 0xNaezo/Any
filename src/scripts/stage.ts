import { Loom } from './loom';
import { gsap, reduced, ScrollTrigger } from './app';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Where each manifesto chapter starts, as a share of the pinned scroll. */
const CHAPTERS = [0, 0.26, 0.52, 0.8];
/** The cloth is woven between these two points of the pinned scroll. */
const WEAVE_FROM = 0.04;
const WEAVE_TO = 0.76;

export function initStage() {
  const root = document.documentElement;
  const stage = document.querySelector<HTMLElement>('[data-stage]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-loom-canvas]');
  const section = document.querySelector<HTMLElement>('[data-loom]');
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!stage || !canvas || !section || !hero) return;

  // ---------- HUD
  const cardEl = section.querySelector<HTMLElement>('[data-hud-card]');
  const holes = Array.from(section.querySelectorAll<HTMLElement>('.loom__card i'));
  const warpEl = section.querySelector<HTMLElement>('[data-hud-warp]');
  const weftEl = section.querySelector<HTMLElement>('[data-hud-weft]');
  const statusEl = section.querySelector<HTMLElement>('[data-loom-status]');
  const barEl = section.querySelector<HTMLElement>('[data-loom-bar]');
  const percentEl = section.querySelector<HTMLElement>('[data-loom-percent]');
  const pad = (n: number) => String(n).padStart(3, '0');

  let loom: Loom | null = new Loom(canvas, {
    reduced,
    onPick: ({ row, rows, cols, holes: bits, done }) => {
      if (cardEl) cardEl.textContent = done ? `${pad(rows)} / ${pad(rows)}` : `${pad(row + 1)} / ${pad(rows)}`;
      bits.forEach((on, i) => holes[i]?.classList.toggle('on', on));
      if (warpEl) warpEl.textContent = String(cols);
      if (weftEl) weftEl.textContent = String(rows);
      if (statusEl) statusEl.textContent = (done ? statusEl.dataset.woven : statusEl.dataset.weaving) ?? '';
    },
  });

  if (loom.init()) {
    root.classList.add('loom-ready');
  } else {
    // no WebGL: a still woven ghost stands in, the manifesto still scrolls
    loom = null;
    root.classList.add('loom-fallback');
  }

  // ---------- chapters
  const chapters = Array.from(section.querySelectorAll<HTMLElement>('.loom__chapter'));
  let active = -1;
  const showChapter = (i: number, instant = false) => {
    if (i === active) return;
    const prev = chapters[active];
    const next = chapters[i];
    active = i;
    if (prev) {
      gsap.killTweensOf(prev);
      gsap.to(prev, { autoAlpha: 0, y: -18, duration: instant ? 0 : 0.5, ease: 'power2.in' });
    }
    if (next) {
      gsap.killTweensOf(next);
      const parts = next.children;
      gsap.set(next, { autoAlpha: 1, y: 0 });
      gsap.fromTo(
        parts,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: instant ? 0 : 1.1, delay: instant ? 0 : 0.25, stagger: 0.08, ease: 'expo.out' },
      );
    }
  };

  // ---------- reduced motion: no pinning, two still frames
  if (reduced) {
    root.classList.add('loom-static');
    const still = loom;
    if (!still) return;
    still.renderStatic();
    const io = new IntersectionObserver(
      ([e]) => {
        const woven = e.isIntersecting;
        still.set({ progress: woven ? 1 : 0, tension: woven ? 1 : 0, finish: 0 });
        still.renderStatic();
      },
      { threshold: 0.25 },
    );
    io.observe(section);
    return;
  }

  showChapter(0, true);

  // ---------- scroll → loom
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => loom?.set({ tension: self.progress }),
  });

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      const progress = clamp01((p - WEAVE_FROM) / (WEAVE_TO - WEAVE_FROM));
      loom?.set({ progress, tension: 1, finish: clamp01((p - WEAVE_TO) / 0.14) });
      if (barEl) barEl.style.transform = `scaleX(${progress})`;
      if (percentEl) percentEl.textContent = `${Math.round(progress * 100)}%`;
      let c = 0;
      CHAPTERS.forEach((start, i) => p >= start && (c = i));
      showChapter(c);
    },
  });

  const gl = loom;
  if (!gl) return;

  // ---------- run only while visible
  const io = new IntersectionObserver(([e]) => gl.setVisible(e.isIntersecting), { rootMargin: '80px 0px' });
  io.observe(stage);
  document.addEventListener('visibilitychange', () => gl.setVisible(!document.hidden && isInView(stage)));

  // ---------- resize (ignore mobile toolbar jitter)
  let w = window.innerWidth;
  let h = window.innerHeight;
  let timer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      if (nw !== w || Math.abs(nh - h) > 140) {
        w = nw;
        h = nh;
        gl.resize();
      }
    }, 180);
  });
}

function isInView(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}
