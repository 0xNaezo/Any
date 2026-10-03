import { ScrollTrigger } from './app';

/** Accordion: one answer open at a time. */
export function initFaq() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-faq]'));
  let refresh = 0;
  const set = (btn: HTMLButtonElement, open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.closest('.qa')?.classList.toggle('is-open', open);
  };
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      buttons.forEach((b) => b !== btn && set(b, false));
      set(btn, open);
      // the page grew or shrank: let scroll-driven animations re-measure
      window.clearTimeout(refresh);
      refresh = window.setTimeout(() => ScrollTrigger.refresh(), 750);
    }),
  );
}
