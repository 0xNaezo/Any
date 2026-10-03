import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Accessible <details> accordion with smooth height animation; one item open at a time. */
export function initFaq(motion: boolean) {
  const items = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-faq-item]'));
  if (!items.length) return;

  let refreshTimer = 0;
  const refresh = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
  };

  const close = (item: HTMLDetailsElement) => {
    const answer = item.querySelector<HTMLElement>('[data-faq-answer]');
    if (!item.open || !answer) return;
    item.classList.remove('is-open');
    gsap.to(answer, {
      height: 0,
      opacity: 0,
      duration: motion ? 0.45 : 0,
      ease: 'power3.inOut',
      onComplete: () => {
        item.open = false;
        gsap.set(answer, { clearProps: 'height,opacity' });
        refresh();
      },
    });
  };

  const open = (item: HTMLDetailsElement) => {
    const answer = item.querySelector<HTMLElement>('[data-faq-answer]');
    if (!answer) return;
    item.open = true;
    item.classList.add('is-open');
    gsap.fromTo(
      answer,
      { height: 0, opacity: 0 },
      {
        height: 'auto',
        opacity: 1,
        duration: motion ? 0.55 : 0,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(answer, { clearProps: 'height,opacity' });
          refresh();
        },
      },
    );
  };

  items.forEach((item) => {
    item.querySelector('summary')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.open) {
        close(item);
      } else {
        items.filter((other) => other !== item).forEach(close);
        open(item);
      }
    });
  });
}
