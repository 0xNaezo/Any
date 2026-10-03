import 'lenis/dist/lenis.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScroll } from './scroll';
import { initHeader } from './header';
import { heroIntro, initScrollAnimations, initStaticStates } from './animations';
import { greet, initClock, initCopy, initEyes, initFaq, initMagnetic, initSpotlight } from './interactions';
import { initForm } from './form';
import { Threads } from './threads';

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

try {
  initScroll(reducedMotion);
  initHeader(reducedMotion);
  initClock();
  initCopy();
  initFaq(reducedMotion);
  initForm();
  initSpotlight();
  initEyes();
  if (!reducedMotion) initMagnetic();

  const canvas = document.querySelector<HTMLCanvasElement>('[data-threads]');
  const threads = canvas ? new Threads(canvas, { reducedMotion }) : null;

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
