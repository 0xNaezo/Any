import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;
let autoScrollUntil = 0;

/** True while an anchor jump is in flight. The header stays visible meanwhile. */
export const isAutoScrolling = () => performance.now() < autoScrollUntil;

const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 68;

/**
 * Absolute scroll position that puts the *content* of a target (its padding
 * excluded) just below the fixed header. Sections have generous top padding,
 * so aligning their outer edge would leave a large empty gap.
 */
function targetY(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const padding = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const y = rect.top + window.scrollY + padding - headerHeight() - 40;
  return Math.max(0, Math.round(y));
}

/** Smooth scrolling synced with GSAP's ticker. Disabled for reduced motion. */
export function initScroll(reducedMotion: boolean) {
  if (!reducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // In-page anchors: smooth, offset by the fixed header, and keep focus management sane.
  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"], a[data-to-top]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    const hash = link.getAttribute('href') || '';
    const toTop = link.hasAttribute('data-to-top') || hash === '#' || hash === '#top';
    const target = toTop ? null : document.querySelector<HTMLElement>(hash);
    if (!toTop && !target) return;

    event.preventDefault();
    scrollToTarget(toTop ? 0 : target!);
    if (!toTop) history.replaceState(null, '', hash);

    // move focus for keyboard and screen-reader users
    const focusTarget = toTop ? document.getElementById('main') : target;
    if (focusTarget) {
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      window.setTimeout(() => focusTarget.focus({ preventScroll: true }), reducedMotion ? 0 : 700);
    }
  });

  // Respect a hash in the URL on first load.
  if (location.hash.length > 1) {
    const target = document.querySelector<HTMLElement>(location.hash);
    if (target) window.setTimeout(() => scrollToTarget(target, true), 60);
  }
}

export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  const y = typeof target === 'number' ? target : targetY(target);
  autoScrollUntil = performance.now() + (lenis && !immediate ? 1400 : 0) + 300;
  if (lenis) {
    lenis.scrollTo(y, { immediate, duration: 1.4 });
    return;
  }
  window.scrollTo({ top: y, behavior: 'auto' });
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

/** Smooth-scroll velocity in px per frame (0 when smooth scrolling is off). */
export const scrollVelocity = () => lenis?.velocity ?? 0;
