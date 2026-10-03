import type Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNav(lenis: Lenis | null, motion: boolean) {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');
  const toggle = nav.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  let menuOpen = false;
  let lastY = window.scrollY;

  /* ── Scrolled / hidden state + progress bar ─────────────── */
  const onScroll = (y: number) => {
    nav.classList.toggle('is-scrolled', y > 24);
    const delta = y - lastY;
    if (!menuOpen && Math.abs(delta) > 6) {
      nav.classList.toggle('is-hidden', delta > 0 && y > 480);
      lastY = y;
    }
    if (y < 24) nav.classList.remove('is-hidden');
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  };

  if (lenis) lenis.on('scroll', ({ scroll }: { scroll: number }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  onScroll(window.scrollY);

  // Keyboard users tabbing into the hidden bar should always see it
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  /* ── Active section highlighting ────────────────────────── */
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const setActive = (active: HTMLAnchorElement | null) =>
    links.forEach((l) => {
      const on = l === active;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });

  links.forEach((link) => {
    const id = link.hash.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) setActive(link);
        else if (link.classList.contains('is-active')) setActive(null);
      },
    });
  });

  /* ── Mobile menu ─────────────────────────────────────────── */
  if (!toggle || !menu) return;
  menu.setAttribute('data-lenis-prevent', '');
  const items = menu.querySelectorAll('nav li, [data-menu-footer] > *');

  const open = () => {
    menuOpen = true;
    menu.hidden = false;
    nav.classList.add('is-open');
    nav.classList.remove('is-hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    if (motion) {
      gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.05, delay: 0.05 });
    }
    menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  };

  const close = (restoreFocus = true) => {
    if (!menuOpen) return;
    menuOpen = false;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    lenis?.start();
    document.documentElement.style.overflow = '';
    const hide = () => {
      menu.hidden = true;
    };
    if (motion) gsap.to(menu, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: hide });
    else hide();
    if (restoreFocus) toggle.focus({ preventScroll: true });
  };

  toggle.addEventListener('click', () => (menuOpen ? close() : open()));
  menu.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => close(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  window.matchMedia('(min-width: 921px)').addEventListener('change', (e) => {
    if (e.matches) close(false);
  });
}
