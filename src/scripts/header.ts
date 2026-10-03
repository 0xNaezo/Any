import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isAutoScrolling, startScroll, stopScroll } from './scroll';

export function initHeader(reducedMotion: boolean) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const root = document.documentElement;
  const progress = header.querySelector<HTMLElement>('[data-progress]');

  // ── scrolled state, auto-hide, progress ───────────────────────────────
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 24);
    const menuOpen = root.classList.contains('menu-open');
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    // anchor jumps keep the header (and the nav that triggered them) in view
    const auto = isAutoScrolling();
    if (!menuOpen && !auto && goingDown && y > window.innerHeight * 0.75) header.classList.add('is-hidden');
    else if (auto || goingUp || y < 120) header.classList.remove('is-hidden');
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    lastY = y;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();

  // keyboard users: never keep a focused header hidden
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  // ── nav hover pill ────────────────────────────────────────────────────
  const nav = header.querySelector<HTMLElement>('.nav');
  const pill = header.querySelector<HTMLElement>('[data-nav-hover]');
  const links = [...header.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  if (nav && pill) {
    links.forEach((link) => {
      link.addEventListener('pointerenter', () => {
        pill.style.width = `${link.offsetWidth}px`;
        pill.style.transform = `translateX(${link.offsetLeft}px)`;
        pill.style.opacity = '1';
      });
    });
    nav.addEventListener('pointerleave', () => (pill.style.opacity = '0'));
  }

  // ── scroll spy ────────────────────────────────────────────────────────
  links.forEach((link) => {
    const id = link.dataset.navLink;
    const section = id ? document.getElementById(id) : null;
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        link.classList.toggle('is-active', self.isActive);
        if (self.isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      },
    });
  });

  initMenu(header, reducedMotion);
}

function initMenu(header: HTMLElement, reducedMotion: boolean) {
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const label = header.querySelector<HTMLElement>('[data-menu-label]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const root = document.documentElement;
  const backdrop = menu.querySelector<HTMLElement>('.menu__backdrop');
  const items = [...menu.querySelectorAll<HTMLElement>('.menu__text, .menu__index')];
  const foot = menu.querySelector<HTMLElement>('[data-menu-foot]');
  let open = false;
  let tl: gsap.core.Timeline | null = null;

  const setOpen = (next: boolean) => {
    if (open === next) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    tl?.kill();

    if (open) {
      root.classList.add('menu-open');
      menu.inert = false;
      header.classList.remove('is-hidden');
      stopScroll();
      tl = gsap.timeline();
      if (reducedMotion) {
        gsap.set([backdrop, items, foot], { clearProps: 'all', opacity: 1 });
      } else {
        tl.fromTo(backdrop, { opacity: 0 }, { opacity: 0.98, duration: 0.4, ease: 'power2.out' })
          .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.04 }, 0.05)
          .fromTo(foot, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.25);
      }
      menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    } else {
      menu.inert = true;
      startScroll();
      const finish = () => root.classList.remove('menu-open');
      if (reducedMotion) {
        finish();
      } else {
        tl = gsap
          .timeline({ onComplete: finish })
          .to([foot, items], { opacity: 0, duration: 0.25, ease: 'power2.in' })
          .to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.1)
          .set([foot, items], { clearProps: 'opacity' });
      }
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', (event) => {
    const target = event.target as Element;
    if (target.closest('[data-menu-link]') || target.closest('[data-menu-close]')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      toggle.focus();
    }
    // simple focus trap while the menu is open
    if (event.key === 'Tab' && open) {
      const focusables = [toggle, ...menu.querySelectorAll<HTMLElement>('a, button')];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
