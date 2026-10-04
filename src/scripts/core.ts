/**
 * Shared animation core: GSAP + plugins, Lenis smooth scrolling and helpers.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

export { gsap, ScrollTrigger, SplitText };

const root = document.documentElement;

export const reduced = root.classList.contains('reduced');
export const finePointer = window.matchMedia('(pointer: fine)').matches;

/** Characters used for the "decode" scramble effect. */
export const SCRAMBLE_CHARS = '▖▗▘▙▚▛▜▝▞▟░▒#%&/\\<>=+*';

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (reduced) return null;
  lenis = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;
export const getScroll = () => (lenis ? lenis.scroll : window.scrollY);

export function navOffset(): number {
  const v = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h'));
  return (Number.isFinite(v) ? v : 72) + 16;
}

/** Smooth-scroll to an element, a selector or a y position (respects reduced motion). */
export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: typeof el === 'number' ? 0 : -navOffset(), duration: 1.25, immediate });
    return;
  }
  const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY - navOffset();
  window.scrollTo({ top: y, behavior: reduced || immediate ? 'auto' : 'smooth' });
}

export function lockScroll(lock: boolean) {
  if (lenis) lock ? lenis.stop() : lenis.start();
  root.style.overflow = lock ? 'hidden' : '';
}

/** Run `fn` once the element scrolls into view (or immediately with reduced motion). */
export function onEnter(el: Element, fn: () => void, start = 'top 85%') {
  if (reduced) {
    fn();
    return;
  }
  ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
