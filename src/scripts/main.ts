import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

import { initSmoothScroll } from './modules/smooth-scroll';
import { initNav } from './modules/nav';
import { initHero } from './modules/hero';
import { initReveal } from './modules/reveal';
import { initCounters } from './modules/counters';
import { initWork } from './modules/work';
import { initProcess } from './modules/process';
import { initBento } from './modules/bento';
import { initInteractions } from './modules/interactions';
import { initFaq } from './modules/faq';
import { initContactForm } from './modules/contact-form';
import { initFooter } from './modules/footer';

declare global {
  interface Window {
    __nightloom?: boolean;
  }
}

window.__nightloom = true;

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
/** false when the visitor prefers reduced motion (or the boot fallback already revealed everything) */
const motion = root.classList.contains('js-anim');

const run = (name: string, init: () => void) => {
  try {
    init();
  } catch (error) {
    console.error(`[nightloom] ${name} failed to initialise`, error);
    root.classList.remove('js-anim');
  }
};

const lenis = initSmoothScroll(motion);

// Above the fold first, so the hero intro never waits on below-the-fold setup.
run('nav', () => initNav(lenis, motion));
run('hero', () => initHero(motion));

// Everything else is set up once webfonts have settled (headings are split into lines only once,
// with final metrics), one module per task so slower phones keep rendering frames in between.
const deferred: Array<[string, () => void]> = [
  ['reveal', () => initReveal(motion)],
  ['counters', () => initCounters(motion)],
  ['work', () => initWork(motion)],
  ['process', () => initProcess(motion)],
  ['bento', () => initBento(motion)],
  ['interactions', () => initInteractions(motion)],
  ['faq', () => initFaq(motion)],
  ['contact', () => initContactForm(motion)],
  ['footer', () => initFooter(motion)],
];

const initNext = () => {
  const job = deferred.shift();
  if (!job) {
    ScrollTrigger.refresh();
    return;
  }
  run(...job);
  window.setTimeout(initNext, 0);
};

const fontsSettled = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);
fontsSettled.then(() => requestAnimationFrame(() => window.setTimeout(initNext, 0)));

// Re-measure once webfonts and images have settled (line breaks and section heights can change).
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
