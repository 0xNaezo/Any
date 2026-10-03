import { gsap } from 'gsap';
import { formatClock } from '../../lib/time';

export function initFooter(motion: boolean) {
  // Live studio clock
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
  const tick = () =>
    clocks.forEach((el) => {
      if (el.dataset.clock) el.textContent = formatClock(el.dataset.clock);
    });
  if (clocks.length) {
    tick();
    window.setInterval(tick, 15_000);
  }

  if (!motion) return;

  const word = document.querySelector<HTMLElement>('[data-wordmark]');
  const peek = document.querySelector<HTMLElement>('[data-peek]');
  const footer = word?.closest('footer');
  if (!word || !footer) return;

  // The giant wordmark rises as the footer scrolls into view
  gsap.fromTo(
    word,
    { yPercent: 55, opacity: 0.3 },
    {
      yPercent: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
    },
  );

  if (!peek) return;

  // …and a shy ghost peeks out from behind it
  gsap.set(peek, { yPercent: 110 });
  const showUp = () => gsap.to(peek, { yPercent: 0, duration: 1.1, ease: 'back.out(1.7)', delay: 0.3 });
  gsap.timeline({
    scrollTrigger: { trigger: word, start: 'top 98%', once: true, onEnter: showUp },
  });

  let hiding = false;
  peek.addEventListener('pointerenter', () => {
    if (hiding) return;
    hiding = true;
    gsap
      .timeline({ onComplete: () => void (hiding = false) })
      .to(peek, { yPercent: 85, duration: 0.35, ease: 'power3.in' })
      .to(peek, { yPercent: 0, duration: 1, ease: 'back.out(1.7)', delay: 1.2 });
  });
}
