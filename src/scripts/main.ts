import 'lenis/dist/lenis.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScroll } from './scroll';
import { initHeader } from './header';
import { heroIntro, initScrollAnimations, initStaticStates } from './animations';
import { greet, initClock, initCopy, initEyes, initFaq, initMagnetic, initSpotlight, initStatus } from './interactions';
import { initForm } from './form';
import { initMarquee } from './marquee';
import { initPortraits } from './portraits';
import { Threads } from './threads';
import { Loom } from './loom';

declare global {
  interface Window {
    __nightloom?: boolean;
  }
}

window.__nightloom = true;

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// If the safety timer in <head> already revealed the page, don't re-hide anything.
const animate = !reducedMotion && root.classList.contains('js');

const revealEverything = () => root.classList.remove('js');

/** Canvas 2D version of the hero for browsers without WebGL2. */
function fallbackThreads(canvas: HTMLCanvasElement, reducedMotion: boolean) {
  // a canvas that already handed out a WebGL context can't give a 2D one
  const fresh = canvas.cloneNode() as HTMLCanvasElement;
  canvas.replaceWith(fresh);
  return new Threads(fresh, { reducedMotion });
}

try {
  initScroll(reducedMotion);
  initHeader(reducedMotion);
  initClock();
  initCopy();
  initFaq(reducedMotion);
  initForm();
  initSpotlight();
  initEyes();
  initMarquee(reducedMotion);
  initStatus();
  initPortraits(reducedMotion);
  if (!reducedMotion) initMagnetic();

  const canvas = document.querySelector<HTMLCanvasElement>('[data-threads]');
  const threads = canvas ? (Loom.create(canvas, { reducedMotion }) ?? fallbackThreads(canvas, reducedMotion)) : null;

  if (animate) {
    const fontsReady = Promise.race([document.fonts?.ready, new Promise((resolve) => setTimeout(resolve, 1500))]);
    fontsReady
      .then(() => {
        heroIntro(() => threads?.start());
        initScrollAnimations();
        ScrollTrigger.refresh();
      })
      .catch((error) => {
        console.error(error);
        revealEverything();
        threads?.start();
      });
  } else {
    threads?.start();
    initStaticStates();
  }

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
} catch (error) {
  console.error(error);
  revealEverything();
}

greet();
