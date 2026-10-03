import { finePointer, gsap, reduced, ScrollTrigger, SplitText } from './app';

const EASE = 'expo.out';

/** Page-wide motion: the hero entrance, scroll reveals and a few quiet details. */
export function initMotion() {
  const root = document.documentElement;
  if (reduced) {
    root.classList.add('motion-ready');
    return;
  }

  hero();
  headings();
  reveals();
  threads();
  counters();
  process();
  parallax();
  footer();
  root.classList.add('motion-ready');
}

function hero() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');
  const logos = gsap.utils.toArray<HTMLElement>('[data-hero-logo]');
  const line = document.querySelector<HTMLElement>('[data-hero-line]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');

  if (fades.length + logos.length) gsap.set([...fades, ...logos], { autoAlpha: 0, y: 14 });
  if (line) gsap.set(line, { scaleX: 0 });
  if (nav) gsap.set(nav, { autoAlpha: 0, y: -10 });

  const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
  if (title) {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(title, { autoAlpha: 1 });
        return tl.from(self.lines, { yPercent: 108, duration: 1.7, stagger: 0.13 }, 0.1);
      },
    });
  }
  if (nav) tl.to(nav, { autoAlpha: 1, y: 0, duration: 1.4, clearProps: 'transform' }, 0.2);
  if (line) tl.to(line, { scaleX: 1, duration: 1.6, ease: 'power3.inOut' }, 0.35);
  if (fades.length) tl.to(fades, { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.08 }, 0.6);
  if (logos.length) tl.to(logos, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.07 }, 0.95);
}

function headings() {
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { autoAlpha: 1 });
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.5,
          stagger: 0.1,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      },
    });
  });
}

function reveals() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter((el) => !el.closest('[data-hero-title]'));
  if (items.length) gsap.set(items, { autoAlpha: 0, y: 26 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      // A jump (anchor link, restored scroll position) can pass dozens of items at once:
      // settle the ones already above the viewport, stagger only what is on screen.
      const onScreen = batch.filter((el) => el.getBoundingClientRect().bottom > 0);
      const passed = batch.filter((el) => !onScreen.includes(el));
      if (passed.length) gsap.set(passed, { autoAlpha: 1, y: 0, overwrite: true, clearProps: 'transform' });
      if (onScreen.length)
        gsap.to(onScreen, {
          autoAlpha: 1,
          y: 0,
          duration: 1.3,
          stagger: Math.min(0.09, 0.6 / onScreen.length),
          ease: EASE,
          overwrite: true,
          clearProps: 'transform',
        });
    },
  });

  // case cards: frame first, then the caption
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((card) => {
    const media = card.querySelector('[data-case-media]');
    const meta = card.querySelector('.case__meta');
    gsap.set(media, { clipPath: 'inset(12% 0% 0% 0%)', autoAlpha: 0 });
    gsap.set(meta, { autoAlpha: 0, y: 20 });
    gsap
      .timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } })
      .to(media, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: 1.6, ease: EASE })
      .to(meta, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE, clearProps: 'transform' }, 0.35);
  });

  // service rows: a soft light follows the cursor
  if (finePointer) {
    document.querySelectorAll<HTMLElement>('.svc__row').forEach((row) => {
      row.addEventListener('pointermove', (e) => {
        const r = row.getBoundingClientRect();
        row.style.setProperty('--mx', `${e.clientX - r.left}px`);
        row.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }
}

function threads() {
  gsap.utils.toArray<HTMLElement>('[data-line]').forEach((line) => {
    gsap.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.8, ease: 'power3.inOut', scrollTrigger: { trigger: line, start: 'top 92%', once: true } },
    );
  });
}

function counters() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const value = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const fmt = new Intl.NumberFormat(el.dataset.locale || 'en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const obj = { v: 0 };
    el.textContent = fmt.format(0);
    gsap.to(obj, {
      v: value,
      duration: 2.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = fmt.format(obj.v)),
    });
  });
}

function process() {
  const wrap = document.querySelector<HTMLElement>('[data-process]');
  const fill = document.querySelector<HTMLElement>('[data-process-fill]');
  const steps = gsap.utils.toArray<HTMLElement>('[data-process-step]');
  if (!wrap || !fill) return;
  const mm = gsap.matchMedia();
  const light = (p: number) => steps.forEach((s, i) => s.classList.toggle('is-lit', p >= i / steps.length - 0.001));
  mm.add('(min-width: 961px)', () => {
    gsap.fromTo(
      fill,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top 75%', end: 'bottom 60%', scrub: 0.6, onUpdate: (self) => light(self.progress) },
      },
    );
  });
  mm.add('(max-width: 960px)', () => {
    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top 70%', end: 'bottom 60%', scrub: 0.6, onUpdate: (self) => light(self.progress) },
      },
    );
  });
}

function parallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

function footer() {
  const word = document.querySelector<HTMLElement>('.footer__word');
  if (!word) return;
  gsap.fromTo(
    word,
    { yPercent: 38, autoAlpha: 0 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 2,
      ease: EASE,
      scrollTrigger: { trigger: word, start: 'top 98%', once: true },
    },
  );
}
