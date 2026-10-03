import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Inertial smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync.
 * In-page anchor links get an eased scroll; everything degrades to native scrolling.
 */
export function initSmoothScroll(motion: boolean): Lenis | null {
  let lenis: Lenis | null = null;

  if (motion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    if (url.pathname !== window.location.pathname || url.origin !== window.location.origin || !url.hash) return;

    const id = decodeURIComponent(url.hash.slice(1));
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(id === 'top' ? 0 : target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      const y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: motion ? 'smooth' : 'auto' });
    }

    if (id !== 'top') {
      history.pushState(null, '', `#${id}`);
      // move keyboard focus to the section without an extra jump
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    } else {
      history.pushState(null, '', window.location.pathname);
    }
  });

  return lenis;
}
