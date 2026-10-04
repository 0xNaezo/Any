import { gsap, ScrollTrigger, reduced, scrollToTarget, lockScroll } from './core';

/** Smooth in-page anchors, active-section highlight and the mobile menu. */
export function initNav() {
  const onHome = location.pathname === '/' || location.pathname === '/index.html';

  // ---- in-page anchors -------------------------------------------------------
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href') ?? '';
    if (a.hasAttribute('data-to-top')) {
      e.preventDefault();
      scrollToTarget(0);
      return;
    }
    let hash = '';
    if (href.startsWith('#')) hash = href;
    else if (href.startsWith('/#') && onHome) hash = href.slice(1);
    if (!hash || hash === '#') return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target);
    history.replaceState(null, '', hash);
  });

  // arriving on the home page with a hash (e.g. from a case study)
  if (onHome && location.hash.length > 1) {
    const target = document.querySelector<HTMLElement>(location.hash);
    if (target) requestAnimationFrame(() => scrollToTarget(target, true));
  }

  // ---- active section ---------------------------------------------------------
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const setActive = (id: string | null) => {
    links.forEach((l) => {
      const on = l.dataset.navLink === id;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });
  };
  if (onHome) {
    links.forEach((l) => {
      const id = l.dataset.navLink;
      const section = id ? document.getElementById(id) : null;
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setActive(id!);
          else if (l.classList.contains('is-active')) setActive(null);
        },
      });
    });
  } else {
    const section = location.pathname.split('/')[1];
    if (section === 'work') setActive('work');
  }

  // ---- mobile menu -------------------------------------------------------------
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  let open = false;

  function openMenu() {
    if (!menu || !toggle || open) return;
    open = true;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    if (!reduced) {
      const items = menu.querySelectorAll('li, .menu__foot > *');
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.35, ease: 'steps(7)' });
      gsap.fromTo(items, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'steps(4)', stagger: 0.04, delay: 0.12 });
    }
    menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  }

  function closeMenu() {
    if (!menu || !toggle || !open) return;
    open = false;
    toggle.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    const done = () => {
      menu.hidden = true;
    };
    if (reduced) done();
    else gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.25, ease: 'steps(5)', onComplete: done });
  }

  toggle?.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      closeMenu();
      toggle?.focus();
    }
  });
  window.matchMedia('(min-width: 1060px)').addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
}
