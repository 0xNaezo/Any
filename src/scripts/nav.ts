import { lockScroll, onScroll, scrollToTarget } from './app';

/** Header state, mobile menu, in-page anchors and the language preference. */
export function initNav() {
  const root = document.documentElement;
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const toggleLabel = toggle?.querySelector<HTMLElement>('[data-menu-label]');
  let menuOpen = false;

  // ---------- header: solid after the first scroll, hides while reading downwards
  let lastY = window.scrollY;
  const update = (y: number) => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', y > 24);
    const down = y > lastY + 2;
    const up = y < lastY - 2;
    if (!menuOpen) {
      if (down && y > window.innerHeight * 0.9) nav.classList.add('is-hidden');
      else if (up || y < window.innerHeight * 0.5) nav.classList.remove('is-hidden');
    }
    lastY = y;
  };
  update(window.scrollY);
  onScroll((y) => update(y));

  // keyboard users always get the header back
  nav?.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  // ---------- active section in the header
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const sections = links
    .map((l) => document.querySelector<HTMLElement>(l.dataset.navLink!))
    .filter((s): s is HTMLElement => !!s);
  if (sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = `#${e.target.id}`;
          links.forEach((l) => l.classList.toggle('is-active', l.dataset.navLink === id));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    // nothing highlighted above the first section
    const first = sections[0];
    onScroll((y) => {
      if (y + window.innerHeight * 0.5 < first.offsetTop) links.forEach((l) => l.classList.remove('is-active'));
    });
  }

  // ---------- mobile menu
  const setMenu = (open: boolean) => {
    if (!menu || !toggle) return;
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = (open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? '';
    menu.setAttribute('aria-hidden', String(!open));
    menu.toggleAttribute('inert', !open);
    lockScroll(open);
    if (open) {
      nav?.classList.remove('is-hidden');
      menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    }
  };
  toggle?.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      setMenu(false);
      toggle?.focus();
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => e.matches && menuOpen && setMenu(false));

  // ---------- in-page anchors (smooth, through Lenis)
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = url.hash === '#top' ? '#top' : document.querySelector(url.hash) ? url.hash : null;
    if (!target) return;
    e.preventDefault();
    const fromMenu = menuOpen;
    if (fromMenu) setMenu(false);
    // the dialog closes itself first when a link inside it is used
    window.setTimeout(() => scrollToTarget(target), fromMenu ? 350 : 0);
    if (history.replaceState) history.replaceState(null, '', url.hash === '#top' ? location.pathname : url.hash);
  });

  // arriving with a hash: jump after layout settles
  if (location.hash && location.hash.length > 1) {
    const hash = location.hash;
    window.addEventListener('load', () => {
      if (document.querySelector(hash)) setTimeout(() => scrollToTarget(hash, true), 60);
    });
  }

  // ---------- language preference
  document.querySelectorAll<HTMLAnchorElement>('[data-locale]').forEach((a) =>
    a.addEventListener('click', () => {
      try {
        localStorage.setItem('nl-locale', a.dataset.locale!);
      } catch {
        /* private mode */
      }
    }),
  );
}
