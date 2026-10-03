import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const SCRAMBLE_CHARS = '░▒▓█01<>/\\_-+=*#';
let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Smooth scrolling synced with GSAP's ticker + anchor links that respect the fixed header. */
function initSmoothScroll() {
  lenis = new Lenis({
    lerp: 0.11,
    wheelMultiplier: 1,
    anchors: { offset: -72 },
    stopInertiaOnNavigate: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('[data-scroll-top]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      lenis?.scrollTo(0, { duration: 1.6 });
    }),
  );
}

/** Masked line-by-line headline reveal. */
function splitLines(el: HTMLElement, vars: gsap.TweenVars & { scroll?: boolean } = {}) {
  const { scroll = true, ...tweenVars } = vars;
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    // Keep non-breaking spaces from the typograph (default collapses them).
    reduceWhiteSpace: false,
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      return gsap.from(self.lines, {
        yPercent: 105,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.09,
        ...(scroll ? { scrollTrigger: { trigger: el, start: 'top 88%', once: true } } : {}),
        ...tweenVars,
      });
    },
  });
}

function scramble(el: HTMLElement, delay = 0) {
  const text = el.textContent ?? '';
  return gsap.to(el, {
    duration: Math.min(1.2, 0.35 + text.length * 0.03),
    delay,
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: 0.15 },
    ease: 'none',
  });
}

function countUp(el: HTMLElement, delay = 0) {
  const target = Number(el.dataset.count ?? 0);
  const obj = { v: 0 };
  el.textContent = '0';
  return gsap.to(obj, {
    v: target,
    duration: 1.6,
    delay,
    ease: 'power3.out',
    onUpdate: () => {
      el.textContent = String(Math.round(obj.v));
    },
  });
}

/** Above-the-fold intro: headline lines, supporting items, scene and stats. */
function heroIntro() {
  const title = document.querySelector<HTMLElement>('[data-split="hero"]');
  const items = document.querySelectorAll<HTMLElement>('[data-hero-item]');
  const scene = document.querySelector<HTMLElement>('[data-hero-scene]');
  const stats = document.querySelectorAll<HTMLElement>('[data-hero-stat]');

  if (items.length) gsap.set(items, { opacity: 0, y: 18 });
  if (scene) gsap.set(scene, { opacity: 0 });
  if (stats.length) gsap.set(stats, { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.1 });
  if (title) {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      reduceWhiteSpace: false,
      onSplit(self) {
        gsap.set(title, { visibility: 'visible' });
        return gsap.from(self.lines, { yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: 0.1, delay: 0.15 });
      },
    });
  }
  if (items.length) tl.to(items, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.35);
  if (scene) tl.to(scene, { opacity: 1, duration: 0.6, ease: 'steps(4)' }, 0.2);

  const status = document.querySelector<HTMLElement>('.hero__status span:last-child');
  if (status) tl.add(scramble(status), 0.35);

  const statsBox = document.querySelector('.hero__stats');
  if (statsBox && stats.length) {
    ScrollTrigger.create({
      trigger: statsBox,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(stats, { opacity: 1, duration: 0.6, ease: 'steps(3)', stagger: 0.08 });
        stats.forEach((s, i) => {
          const n = s.querySelector<HTMLElement>('[data-count]');
          if (n) countUp(n, 0.1 + i * 0.08);
        });
      },
    });
  }
}

function sectionMotion() {
  document.querySelectorAll<HTMLElement>('[data-split]:not([data-split="hero"])').forEach((el) => splitLines(el));

  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => scramble(el) });
  });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  document.querySelectorAll<HTMLElement>('[data-count]:not([data-hero-stat] [data-count])').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el) });
  });

  // Footer wordmark: pixels "woven" in column by column.
  const mark = document.querySelector<HTMLElement>('[data-footer-mark]');
  if (mark) {
    const rects = [...mark.querySelectorAll<SVGRectElement>('.footer__word rect')];
    rects.sort((a, b) => Number(a.dataset.x) - Number(b.dataset.x) || Number(a.dataset.y) - Number(b.dataset.y));
    const ghost = mark.querySelector('[data-footer-ghost]');
    gsap.set(rects, { opacity: 0 });
    if (ghost) gsap.set(ghost, { opacity: 0, y: 12 });
    ScrollTrigger.create({
      trigger: mark,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const base = getComputedStyle(mark).color;
        const tl = gsap.timeline();
        tl.to(rects, {
          keyframes: [
            { opacity: 1, fill: accent, duration: 0.01 },
            { fill: base, duration: 0.01, delay: 0.18 },
          ],
          stagger: { each: 0.0045 },
          onComplete: () => gsap.set(rects, { clearProps: 'fill' }),
        });
        if (ghost) tl.to(ghost, { opacity: 1, y: 0, duration: 0.5, ease: 'steps(5)' }, '-=0.2');
      },
    });
  }
}

/** Case cards stack on top of each other; covered cards shrink and dim. */
function caseStack() {
  const cases = gsap.utils.toArray<HTMLElement>('[data-case]');
  if (cases.length < 2) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px)', () => {
    cases.slice(0, -1).forEach((item, i) => {
      const card = item.querySelector<HTMLElement>('.case__card');
      const next = cases[i + 1];
      if (!card || !next) return;
      gsap.fromTo(
        card,
        { scale: 1, '--shade': 0 },
        {
          scale: 0.94,
          '--shade': 0.55,
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 30%', scrub: true },
        },
      );
    });
  });
}

/** Process rail: an accent thread is woven across the steps while scrolling. */
function processRail() {
  const rail = document.querySelector<HTMLElement>('[data-process]');
  if (!rail) return;
  const fill = rail.querySelector<HTMLElement>('[data-process-fill]');
  const shuttle = rail.querySelector<HTMLElement>('[data-process-shuttle]');
  const steps = gsap.utils.toArray<HTMLElement>('[data-step]', rail);
  const vertical = window.matchMedia('(max-width: 1080px)');
  const n = steps.length;

  ScrollTrigger.create({
    trigger: rail,
    start: 'top 70%',
    end: 'bottom 55%',
    scrub: 0.6,
    onUpdate: (self) => {
      const p = Math.round(self.progress * 48) / 48; // quantised = pixel steps
      if (fill) fill.style.transform = vertical.matches ? `scaleY(${p})` : `scaleX(${p})`;
      if (shuttle) shuttle.style.left = `${p * 100}%`;
      steps.forEach((step, i) => step.classList.toggle('is-active', p >= (vertical.matches ? i / n : i / (n - 1)) - 0.001));
    },
  });
}

/** Terminal: the command is typed out, then output lines print one by one. */
function terminal() {
  document.querySelectorAll<HTMLElement>('[data-terminal]').forEach((term) => {
    const cmd = term.querySelector<HTMLElement>('[data-term-cmd]');
    const lines = term.querySelectorAll<HTMLElement>('[data-term-line]');
    const full = cmd?.textContent ?? '';
    if (cmd) cmd.textContent = '';
    gsap.set(lines, { opacity: 0 });
    ScrollTrigger.create({
      trigger: term,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const state = { n: 0 };
        gsap
          .timeline()
          .to(state, {
            n: full.length,
            duration: full.length * 0.045,
            ease: `steps(${full.length})`,
            onUpdate: () => {
              if (cmd) cmd.textContent = full.slice(0, Math.round(state.n));
            },
          })
          .to(lines, { opacity: 1, duration: 0.01, stagger: 0.11 }, '+=0.2');
      },
    });
  });
}

/** Smooth open/close for <details> accordions (one open at a time per group). */
function accordions() {
  const items = document.querySelectorAll<HTMLDetailsElement>('details.qa');
  items.forEach((det) => {
    const summary = det.querySelector('summary');
    const body = det.querySelector<HTMLElement>('.qa__a');
    if (!summary || !body) return;
    const close = (d: HTMLDetailsElement) => {
      const b = d.querySelector<HTMLElement>('.qa__a');
      if (!b) return;
      gsap.to(b, {
        height: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          d.open = false;
          gsap.set(b, { clearProps: 'height' });
          ScrollTrigger.refresh();
        },
      });
    };
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (det.open) {
        close(det);
        return;
      }
      const group = det.getAttribute('name');
      if (group) {
        document.querySelectorAll<HTMLDetailsElement>(`details[name="${group}"][open]`).forEach((o) => o !== det && close(o));
      }
      det.open = true;
      gsap.fromTo(
        body,
        { height: 0 },
        { height: 'auto', duration: 0.45, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() },
      );
    });
  });
}

/** Reveals everything instantly (reduced motion / errors). */
function showAll() {
  document.documentElement.classList.remove('motion');
  document.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => s.classList.add('is-active'));
  document.querySelectorAll<HTMLElement>('[data-process-fill]').forEach((f) => (f.style.transform = 'none'));
}

export function initMotion({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) {
    showAll();
    return;
  }
  try {
    initSmoothScroll();
    heroIntro();
    sectionMotion();
    caseStack();
    processRail();
    terminal();
    accordions();
    // Recalculate trigger positions once fonts have settled.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  } catch (err) {
    console.error(err);
    showAll();
  }
}
