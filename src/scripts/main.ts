/**
 * Nightloom — client entry.
 * Every module is optional: each one looks for its own DOM hooks.
 */
import { initSmoothScroll, getScroll, reduced, ScrollTrigger } from './core';
import { initBackdrop } from './backdrop';
import { initNav } from './nav';
import { runBoot } from './boot';
import { initReveals } from './reveal';
import { prepareHero, playHeroIntro } from './hero';
import { initClocks } from './clocks';
import { initCounters } from './counters';
import { initDepixelate } from './depixelate';
import { initProcess, initFaq, initCopy, initPixelFills } from './widgets';
import { initContactForm } from './contact';

declare global {
  interface Window {
    __nightloomReady?: boolean;
  }
}

window.__nightloomReady = true;

// for the curious ones who open devtools
(() => {
  const g = [
    '.....#####.....',
    '...#########...',
    '..###########..',
    '.#############.',
    '.#############.',
    '#####.###.#####',
    '#####.###.#####',
    '#####.###.#####',
    '###############',
    '###############',
    '###############',
    '###############',
    '####.#####.####',
    '###...###...###',
  ];
  const art = g.map((r) => r.replace(/#/g, '██').replace(/\./g, '  ')).join('\n');
  const mail = document.querySelector<HTMLElement>('[data-contact-form]')?.dataset.email ?? 'hello@nightloom.dev';
  console.log(`%c${art}`, 'color:#8fb5ff;font-family:monospace;line-height:1');
  console.log(`%cReading the source? We'd like you on the other side of the call → ${mail}`, 'color:#9fb0d8;font-family:monospace');
})();

initSmoothScroll();

const canvas = document.querySelector<HTMLCanvasElement>('[data-backdrop]');
if (canvas) initBackdrop(canvas, { reduced, getScroll });

initNav();
initClocks();
initFaq();
initCopy();
initContactForm();

const ghost = prepareHero();

runBoot().then(() => {
  playHeroIntro(ghost);
  initReveals();
  initCounters();
  initDepixelate();
  initProcess();
  initPixelFills();
  requestAnimationFrame(() => ScrollTrigger.refresh());
});
