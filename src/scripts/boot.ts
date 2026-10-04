import { gsap, lockScroll, sleep } from './core';

/**
 * Boot sequence (first visit per session): a pixel progress bar and a short
 * log, then the overlay dissolves tile by tile. Resolves when the page
 * underneath should start its intro.
 */
export function runBoot(): Promise<void> {
  const root = document.documentElement;
  const boot = document.querySelector<HTMLElement>('[data-boot]');
  if (!boot || !root.classList.contains('booting')) {
    boot?.remove();
    root.classList.remove('booting');
    return Promise.resolve();
  }

  const cells = gsap.utils.toArray<HTMLElement>(boot.querySelectorAll('[data-boot-bar] span'));
  const pct = boot.querySelector<HTMLElement>('[data-boot-pct]');
  const log = gsap.utils.toArray<HTMLElement>(boot.querySelectorAll('[data-boot-log] li'));
  const tiles = gsap.utils.toArray<HTMLElement>(boot.querySelectorAll('.boot__tile'));
  const center = boot.querySelector<HTMLElement>('[data-boot-center]');

  lockScroll(true);
  const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), sleep(1500)]);

  return new Promise((resolve) => {
    const finish = () => {
      lockScroll(false);
      root.classList.remove('booting');
      try {
        sessionStorage.setItem('nl-booted', '1');
      } catch {
        /* private mode */
      }
      boot.remove();
    };

    const p = { v: 0 };
    const intro = gsap.timeline({ paused: true });
    intro.to(p, {
      v: 1,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        const n = Math.round(p.v * cells.length);
        cells.forEach((c, i) => c.classList.toggle('on', i < n));
        if (pct) pct.textContent = `${String(Math.round(p.v * 100)).padStart(3, '0')}%`;
      },
    });
    intro.to(log, { opacity: 1, duration: 0.01, stagger: 0.2 }, 0.05);

    const outro = gsap.timeline({ paused: true, onComplete: finish });
    outro.to([center, ...log], { autoAlpha: 0, duration: 0.18, ease: 'steps(3)' });
    outro.call(resolve, [], '+=0.02');
    outro.to(tiles, { autoAlpha: 0, duration: 0.01, stagger: { amount: 0.55, from: 'random' } }, '<');

    Promise.all([new Promise<void>((r) => intro.eventCallback('onComplete', () => r()).play()), fonts]).then(() =>
      outro.play(),
    );
  });
}
