import { gsap } from 'gsap';

/** Pointer niceties for mouse users: magnetic buttons and cards with a cursor-following glow. */
export function initInteractions(motion: boolean) {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer) return;

  // Spotlight cards — update CSS custom properties consumed by .card / [data-spotlight]
  let spotRaf = 0;
  let lastEvent: PointerEvent | null = null;
  document.addEventListener(
    'pointermove',
    (e) => {
      lastEvent = e;
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(() => {
        spotRaf = 0;
        const ev = lastEvent;
        if (!ev) return;
        const card = (ev.target as Element | null)?.closest<HTMLElement>('[data-spotlight]');
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
        card.style.setProperty('--my', `${ev.clientY - r.top}px`);
      });
    },
    { passive: true },
  );

  if (!motion) return;

  // Magnetic buttons
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('[data-magnetic-inner]');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' }) : null;
    const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' }) : null;
    let rect: DOMRect | null = null;

    el.addEventListener('pointerenter', () => {
      rect = el.getBoundingClientRect();
    });
    el.addEventListener('pointermove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      xTo(dx * 0.22);
      yTo(dy * 0.3);
      ixTo?.(dx * 0.08);
      iyTo?.(dy * 0.12);
    });
    el.addEventListener('pointerleave', () => {
      rect = null;
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)' });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)' });
    });
  });
}
