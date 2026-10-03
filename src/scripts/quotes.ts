import { gsap, reduced } from './app';

const DURATION = 9;

/** Testimonials: one quote at a time, quietly rotating. */
export function initQuotes() {
  const wrap = document.querySelector<HTMLElement>('[data-quotes]');
  if (!wrap) return;
  const slides = Array.from(wrap.querySelectorAll<HTMLElement>('[data-quote]'));
  const live = wrap.querySelector<HTMLElement>('[data-quotes-live]');
  const bar = wrap.querySelector<HTMLElement>('[data-quote-progress]');
  const current = document.querySelector<HTMLElement>('[data-quote-current]');
  if (slides.length < 2) return;

  let index = 0;
  let timer: gsap.core.Tween | null = null;
  let inView = false;
  let hovered = false;

  const go = (next: number, manual = false) => {
    const prev = slides[index];
    index = (next + slides.length) % slides.length;
    const slide = slides[index];
    if (prev === slide) return;
    if (live) live.setAttribute('aria-live', manual ? 'polite' : 'off');
    prev.classList.remove('is-active');
    prev.setAttribute('aria-hidden', 'true');
    slide.classList.add('is-active');
    slide.removeAttribute('aria-hidden');
    if (current) current.textContent = String(index + 1).padStart(2, '0');
    if (!reduced) {
      gsap.fromTo(slide.querySelector('[data-quote-text]'), { y: 22 }, { y: 0, duration: 1.2, ease: 'expo.out' });
      gsap.fromTo(slide.querySelector('.quote__by'), { y: 14 }, { y: 0, duration: 1.2, delay: 0.08, ease: 'expo.out' });
    }
    restart();
  };

  const restart = () => {
    timer?.kill();
    if (!bar) return;
    gsap.set(bar, { scaleX: 0 });
    if (reduced) return;
    timer = gsap.to(bar, { scaleX: 1, duration: DURATION, ease: 'none', onComplete: () => go(index + 1) });
    if (!inView || hovered) timer.pause();
  };

  const sync = () => {
    if (!timer) return;
    if (inView && !hovered) timer.resume();
    else timer.pause();
  };

  wrap.querySelector('[data-quote-prev]')?.addEventListener('click', () => go(index - 1, true));
  wrap.querySelector('[data-quote-next]')?.addEventListener('click', () => go(index + 1, true));
  wrap.addEventListener('pointerenter', () => ((hovered = true), sync()));
  wrap.addEventListener('pointerleave', () => ((hovered = false), sync()));
  wrap.addEventListener('focusin', () => ((hovered = true), sync()));
  wrap.addEventListener('focusout', () => ((hovered = false), sync()));
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(index - 1, true);
    if (e.key === 'ArrowRight') go(index + 1, true);
  });

  new IntersectionObserver(([e]) => ((inView = e.isIntersecting), sync()), { threshold: 0.35 }).observe(wrap);
  restart();
}
