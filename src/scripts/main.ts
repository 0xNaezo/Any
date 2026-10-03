import { ScrollTrigger, lenis } from './app';
import { initNav } from './nav';
import { initStage } from './stage';
import { initMotion } from './motion';
import { initWork } from './work';
import { initQuotes } from './quotes';
import { initFaq } from './faq';
import { initForm } from './form';
import { initFooter } from './footer';

initNav();
initStage();
initWork();
initQuotes();
initFaq();
initForm();
initFooter();

// Split text only once the real fonts are in, so line breaks are final.
const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1800))]);
fontsReady.then(() => {
  initMotion();
  ScrollTrigger.refresh();
});
window.addEventListener('load', () => ScrollTrigger.refresh());

// handy for debugging from the console
Object.assign(window, { __nightloom: { lenis, ScrollTrigger } });
