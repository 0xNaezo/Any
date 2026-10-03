import { gsap } from 'gsap';

/**
 * Case studies stack like cards: each one sticks (CSS) and, as the next card slides
 * over it, recedes slightly. Small screens get a simple entrance instead.
 */
export function initWork(motion: boolean) {
  if (!motion) return;
  const cases = gsap.utils.toArray<HTMLElement>('[data-case]');
  if (!cases.length) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 901px) and (min-height: 700px)', () => {
    cases.forEach((item, i) => {
      const next = cases[i + 1];
      if (!next) return;
      const card = item.querySelector<HTMLElement>('[data-case-card]');
      const shade = item.querySelector<HTMLElement>('[data-case-shade]');
      if (!card || !shade) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: next,
            start: 'top bottom',
            end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .to(card, { scale: 0.92, ease: 'none' }, 0)
        .to(shade, { opacity: 0.6, ease: 'none' }, 0);
    });
  });

  mm.add('(max-width: 900px), (max-height: 699px)', () => {
    cases.forEach((item) => {
      const card = item.querySelector<HTMLElement>('[data-case-card]');
      if (!card) return;
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      });
    });
  });
}
