import { gsap, onEnter, reduced } from './core';

/** Count numbers up when they scroll into view: [data-count="63" data-prefix data-suffix]. */
export function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || reduced) return;
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const proxy = { v: 0 };
    el.textContent = `${prefix}0${suffix}`;
    onEnter(el, () => {
      gsap.to(proxy, {
        v: target,
        duration: Math.min(1.6, 0.6 + target / 80),
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(proxy.v)}${suffix}`;
        },
      });
    }, 'top 90%');
  });
}
