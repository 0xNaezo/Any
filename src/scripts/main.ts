import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { createLoom } from './loom';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motion = root.classList.contains('motion');
root.classList.add('motion-ready');

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                      */
/* ------------------------------------------------------------------ */
let lenis: Lenis | null = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
  root.classList.add('has-lenis');
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

window.addEventListener('nl:scroll-lock', (e) => {
  const locked = (e as CustomEvent<boolean>).detail;
  if (!lenis) {
    root.style.overflow = locked ? 'hidden' : '';
    return;
  }
  if (locked) lenis.stop();
  else lenis.start();
});

/* In-page anchors: smooth, offset for the header, and move focus for keyboard/screen-reader users. */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!a) return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  const target = url.hash === '#main' ? document.body : document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  e.preventDefault();
  const focusTarget = url.hash === '#main' ? document.getElementById('main') : target;
  const done = () => {
    if (focusTarget) {
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    }
  };
  if (url.hash === '#main') {
    if (lenis) lenis.scrollTo(0, { duration: 1.6, onComplete: done });
    else {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      done();
    }
    history.replaceState(null, '', location.pathname);
    return;
  }
  const offset = -(document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ?? 72) + 1;
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.4, onComplete: done });
  else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduceMotion ? 'auto' : 'smooth' });
    done();
  }
  history.pushState(null, '', url.hash);
});

/* ------------------------------------------------------------------ */
/* Live clocks (studio local time)                                    */
/* ------------------------------------------------------------------ */
const clocks = [...document.querySelectorAll<HTMLTimeElement>('[data-clock]')];
if (clocks.length) {
  const fmt = new Map<string, Intl.DateTimeFormat>();
  const tick = () => {
    const now = new Date();
    clocks.forEach((el) => {
      const tz = el.dataset.tz || 'UTC';
      if (!fmt.has(tz)) fmt.set(tz, new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }));
      const text = fmt.get(tz)!.format(now);
      if (el.textContent !== text) el.textContent = text;
      el.dateTime = now.toISOString();
    });
  };
  tick();
  window.setInterval(tick, 15_000);
}

/* ------------------------------------------------------------------ */
/* Page intro (home hero, case-study header, 404)                     */
/* ------------------------------------------------------------------ */
const hero = document.querySelector<HTMLElement>('[data-hero]');
const header = document.querySelector<HTMLElement>('[data-header]');
const loomCanvas = document.querySelector<HTMLCanvasElement>('[data-loom]');
const loom = loomCanvas
  ? createLoom(loomCanvas, {
      reducedMotion: reduceMotion,
      align: loomCanvas.dataset.loomAlign === 'center' ? 'center' : 'right',
      ceiling: () => header?.offsetHeight ?? 0,
    })
  : null;

function pageIntro() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  const items = document.querySelectorAll<HTMLElement>('[data-hero-item]');
  // The copy has settled into its web fonts: let the ghost find its spot before anything moves.
  loom?.measure();

  if (!motion) {
    loom?.intro(0);
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (title) {
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.set(title, { opacity: 1 });
    tl.from(split.lines, { yPercent: 108, duration: 1.6, stagger: 0.12 }, 0.15);
  }
  if (items.length) {
    tl.fromTo(
      items,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1.3, stagger: 0.06, clearProps: 'transform' },
      0.55,
    );
  }
  loom?.intro(0);

  if (loom && hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => loom.setScrollProgress(self.progress),
    });
  }
}

/* ------------------------------------------------------------------ */
/* Section reveals                                                    */
/* ------------------------------------------------------------------ */
function initReveals() {
  if (!motion) return;

  // Hairlines draw in from the left, like a thread pulled across the page.
  gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((el) => {
    gsap.to(el, {
      scaleX: 1,
      duration: 1.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  // Headings rise line by line out of their own masks.
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { opacity: 1 });
        return gsap.from(self.lines, {
          yPercent: 112,
          duration: 1.35,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  // Everything else fades up; batching gives siblings a natural stagger.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.075,
        overwrite: true,
        clearProps: 'transform',
      }),
  });

  // The studio statement brightens word by word as it is read.
  const statement = document.querySelector<HTMLElement>('[data-scrub-words]');
  if (statement) {
    SplitText.create(statement, {
      type: 'words',
      wordsClass: 'word',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { color: '#4d4b47' },
          {
            color: '#ece9e3',
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 52%', scrub: 0.4 },
          },
        );
      },
    });
  }

  // Counters
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count ?? 0);
    const decimals = Number(el.dataset.decimals ?? 0);
    const state = { v: 0 };
    el.textContent = (0).toFixed(decimals);
    gsap.to(state, {
      v: target,
      duration: 2.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = state.v.toFixed(decimals);
      },
    });
  });

  // Process: a single thread runs through the steps and lights each node as it passes.
  const proc = document.querySelector<HTMLElement>('[data-process]');
  const fill = proc?.querySelector<HTMLElement>('[data-thread-fill]');
  if (proc && fill) {
    const steps = [...proc.querySelectorAll<HTMLElement>('[data-step]')];
    let marks: number[] = [];
    const measure = () => {
      const box = proc.getBoundingClientRect();
      const vertical = window.matchMedia('(max-width: 1080px)').matches;
      marks = steps.map((s) => {
        const r = s.getBoundingClientRect();
        return vertical ? (r.top - box.top) / box.height : (r.left - box.left) / box.width;
      });
    };
    ScrollTrigger.create({
      trigger: proc,
      start: 'top 78%',
      end: 'bottom 62%',
      scrub: 0.5,
      onRefresh: measure,
      onUpdate: (self) => {
        const p = self.progress;
        fill.style.setProperty('--progress', p.toFixed(4));
        steps.forEach((s, i) => s.classList.toggle('is-lit', p >= (marks[i] ?? 0) - 0.002));
      },
    });
  }

  // Footer: the wordmark rises, and a small ghost peeks over it.
  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');
  if (wordmark) {
    const text = wordmark.querySelector<HTMLElement>('.wm-text');
    if (text) {
      SplitText.create(text, {
        type: 'chars',
        mask: 'chars',
        charsClass: 'split-char',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.chars, {
            yPercent: 105,
            duration: 1.4,
            ease: 'expo.out',
            stagger: 0.035,
            scrollTrigger: { trigger: wordmark, start: 'top 92%', once: true },
          });
        },
      });
    }
    const peek = wordmark.querySelector<SVGElement>('[data-peek]');
    if (peek) {
      gsap.fromTo(
        peek,
        { yPercent: 75, opacity: 0 },
        {
          yPercent: 4,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: wordmark, start: 'top 85%', end: 'bottom bottom', scrub: 0.8 },
        },
      );
      const eyes = peek.querySelectorAll('ellipse');
      const blink = () => {
        gsap.to(eyes, {
          scaleY: 0.1,
          duration: 0.09,
          yoyo: true,
          repeat: 1,
          transformOrigin: '50% 50%',
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.delayedCall(2.5 + Math.random() * 4, blink);
          },
        });
      };
      gsap.delayedCall(2, blink);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Boot                                                               */
/* ------------------------------------------------------------------ */
const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);

fontsReady.then(() => {
  pageIntro();
  initReveals();
  ScrollTrigger.refresh();
});

window.addEventListener('load', () => ScrollTrigger.refresh());

// A short, friendly note for the curious.
if (!reduceMotion) {
  console.log(
    `%c  Nightloom  %c\n\nYou opened the console — you are our kind of people.\nSay hi: ${document.body.dataset.email ?? ''}\n`,
    'font: 600 13px/2 ui-monospace, monospace; background:#ece9e3; color:#0b0b0c; padding: 2px 6px; border-radius: 3px;',
    'font: 12px/1.5 ui-monospace, monospace; color:#a9a59d;',
  );
}
