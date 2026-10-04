import { gsap, ScrollTrigger, SplitText, reduced, SCRAMBLE_CHARS } from './core';

/**
 * Scroll-driven reveals. Hooks (all optional, all progressive):
 *   [data-frame]            dashed outline plots in, corner handles pop
 *   [data-scramble]         text decodes through block glyphs
 *   [data-reveal]           fade + stepped rise
 *   [data-reveal="wipe"]    stepped left-to-right wipe (headings)
 *   [data-reveal-stagger]   children with [data-reveal-item] cascade
 */
export function initReveals(scope: ParentNode = document) {
  if (reduced) return;

  // frames
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll('[data-frame]:not(.hero__main)')).forEach((frame) => {
    gsap.set(frame, { '--draw': 0, '--corners': 0 });
    ScrollTrigger.create({
      trigger: frame,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(frame, { '--draw': 1, duration: 0.8, ease: 'steps(16)' });
        tl.to(frame, { '--corners': 1, duration: 0.2, ease: 'steps(2)' }, 0.6);
      },
    });
  });

  // scrambled labels
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll('[data-scramble]')).forEach((el) => {
    if (el.closest('.hero')) return;
    const text = el.textContent ?? '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          duration: Math.min(1.1, 0.35 + text.length * 0.025),
          scrambleText: { text, chars: SCRAMBLE_CHARS, revealDelay: 0.15, speed: 0.6 },
          ease: 'none',
        }),
    });
  });

  // headings: stepped wipe per line
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll('[data-reveal="wipe"]')).forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', linesClass: 'wipe-line' });
    gsap.set(el, { opacity: 1 });
    gsap.set(split.lines, { clipPath: 'inset(0 100% 0 0)' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 86%',
      once: true,
      onEnter: () =>
        gsap.to(split.lines, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.5,
          ease: 'steps(8)',
          stagger: 0.12,
          onComplete: () => split.revert(),
        }),
    });
  });

  // simple reveals
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll('[data-reveal]:not([data-reveal="wipe"])')).forEach((el) => {
    gsap.set(el, { autoAlpha: 0, y: 20 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'steps(5)' }),
    });
  });

  // staggered groups
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll('[data-reveal-stagger]')).forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
    if (!items.length) return;
    gsap.set(items, { autoAlpha: 0, y: 24 });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'steps(5)',
          stagger: { each: 0.08, from: 'start' },
        }),
    });
  });
}
