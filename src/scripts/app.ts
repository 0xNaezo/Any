import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const lenis: Lenis | null = reduced
  ? null
  : new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      anchors: false,
    });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function onScroll(cb: (y: number, direction: number) => void) {
  if (lenis) {
    lenis.on('scroll', (l: Lenis) => cb(l.scroll, l.direction));
  } else {
    let last = window.scrollY;
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        cb(y, Math.sign(y - last));
        last = y;
      },
      { passive: true },
    );
  }
}

export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === 'string' ? (target === '#top' ? 0 : document.querySelector<HTMLElement>(target)) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: immediate ? 0 : 1.6, immediate, force: true });
  } else {
    const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: reduced || immediate ? 'auto' : 'smooth' });
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export { gsap, ScrollTrigger, SplitText };
