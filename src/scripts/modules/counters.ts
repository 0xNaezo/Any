import { gsap } from 'gsap';

/** Numbers count up when they scroll into view. Hero stats are handled by the hero intro. */
export function initCounters(motion: boolean) {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    if (el.closest('[data-hero]')) return;

    const to = Number(el.dataset.to ?? 0);
    const decimals = Number(el.dataset.decimals ?? 0);
    const prefix = el.dataset.prefix ?? '';
    const format = (v: number) =>
      prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

    if (!motion) {
      el.textContent = format(to);
      return;
    }

    const obj = { v: 0 };
    el.textContent = format(0);
    gsap.to(obj, {
      v: to,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = format(obj.v);
      },
    });
  });
}
