import { gsap, reduced } from './core';
import { createGhost } from './ghost-canvas';

const BOO = ['boo!', 'shipped.', '0 bugs today', 'tests: green', 'deploying...', 'hi there', 'it works on prod'];

/** Prepare hero elements (hidden states) before the boot sequence ends. */
export function prepareHero() {
  const stage = document.querySelector<HTMLElement>('[data-hero-stage]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-ghost]');
  const bubble = document.querySelector<HTMLElement>('[data-hero-bubble]');
  if (!stage || !canvas) return null;

  let booIndex = 0;
  const ghost = createGhost(canvas, {
    reduced,
    onBoo: () => {
      if (!bubble) return;
      bubble.textContent = BOO[booIndex++ % BOO.length];
      gsap.killTweensOf(bubble);
      gsap.fromTo(
        bubble,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.2, ease: 'steps(3)', overwrite: true },
      );
      gsap.to(bubble, { autoAlpha: 0, duration: 0.2, ease: 'steps(2)', delay: 1.6 });
    },
  });
  if (!ghost) return null;
  stage.classList.add('is-live');
  return ghost;
}

/** Type out the status terminal. */
function terminal(tl: gsap.core.Timeline, at: number) {
  const cmd = document.querySelector<HTMLElement>('[data-term-cmd]');
  const lines = gsap.utils.toArray<HTMLElement>('[data-term-line]');
  const end = document.querySelector<HTMLElement>('[data-term-end]');
  if (!cmd) return;
  const text = cmd.textContent ?? '';
  const proxy = { n: 0 };
  gsap.set([...lines, end], { autoAlpha: 0 });
  gsap.set(cmd, { autoAlpha: 1 });
  cmd.textContent = '';
  tl.to(
    proxy,
    {
      n: text.length,
      duration: text.length * 0.045,
      ease: `steps(${text.length})`,
      onUpdate: () => {
        cmd.textContent = text.slice(0, Math.round(proxy.n));
      },
    },
    at,
  );
  tl.to(lines, { autoAlpha: 1, duration: 0.01, stagger: 0.11 }, '>+0.15');
  tl.to(end, { autoAlpha: 1, duration: 0.01 }, '>+0.1');
}

/** The intro: frame plots, headline wipes in, ghost materialises, terminal types. */
export function playHeroIntro(ghost: ReturnType<typeof createGhost>) {
  const frame = document.querySelector<HTMLElement>('.hero__main');
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
  const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');
  const term = document.querySelector<HTMLElement>('[data-term]');

  if (!frame) return;
  if (reduced) {
    ghost?.setReveal(1);
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'steps(8)' } });

  if (frame) {
    tl.fromTo(frame, { '--draw': 0 }, { '--draw': 1, duration: 0.7, ease: 'steps(14)' }, 0);
    tl.fromTo(frame, { '--corners': 0 }, { '--corners': 1, duration: 0.2, ease: 'steps(2)' }, 0.55);
  }
  tl.fromTo(
    lines,
    { clipPath: 'inset(0 100% 0 -0.2em)' },
    {
      clipPath: 'inset(0 0% 0 -0.2em)',
      duration: 0.55,
      stagger: 0.13,
      // 'none' (not clearProps): the stylesheet keeps lines hidden until the intro runs
      onComplete: () => gsap.set(lines, { clipPath: 'none' }),
    },
    0.15,
  );
  tl.fromTo(
    fades,
    { autoAlpha: 0, y: 16 },
    { autoAlpha: 1, y: 0, duration: 0.45, ease: 'steps(5)', stagger: 0.1 },
    0.6,
  );
  if (ghost) {
    const p = { v: 0 };
    tl.to(
      p,
      {
        v: 1,
        duration: 1.1,
        ease: 'power1.inOut',
        onUpdate: () => ghost.setReveal(p.v),
      },
      0.3,
    );
  }
  if (term) {
    tl.fromTo(term, { '--draw': 0 }, { '--draw': 1, duration: 0.5, ease: 'steps(10)' }, 0.6);
    terminal(tl, 0.9);
  }
}
