import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * Scroll-triggered entrances:
 *  [data-reveal]          fade + rise
 *  [data-reveal-stagger]  same for each direct child, staggered
 *  [data-split]           headings rise line by line from a mask
 *  [data-scramble]        eyebrow labels decode themselves
 */
export function initReveal(motion: boolean) {
  if (!motion) return;

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    gsap.to(group.children, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 86%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      linesClass: 'split-line',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 112,
          duration: 1.25,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-scramble]').forEach((el) => {
    const text = el.textContent ?? '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          duration: 1.2,
          scrambleText: { text, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/_·', speed: 0.5, revealDelay: 0.25 },
        }),
    });
  });
}
