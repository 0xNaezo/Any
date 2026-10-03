import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** The process timeline: a glowing thread draws down the steps as you scroll, lighting each node. */
export function initProcess(motion: boolean) {
  const wrap = document.querySelector<HTMLElement>('[data-process]');
  if (!wrap) return;
  const fill = wrap.querySelector<HTMLElement>('[data-process-fill]');
  const steps = wrap.querySelectorAll<HTMLElement>('[data-step]');

  if (!motion) {
    steps.forEach((s) => s.classList.add('is-active'));
    return;
  }

  if (fill) {
    gsap.to(fill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 62%', end: 'bottom 62%', scrub: 0.6 },
    });
  }

  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 62%',
      onEnter: () => step.classList.add('is-active'),
      onLeaveBack: () => step.classList.remove('is-active'),
    });
  });
}
