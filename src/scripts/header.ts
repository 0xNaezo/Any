import { gsap } from 'gsap';

/** Sticky header: background after scrolling, hide on scroll down, active section link, mobile menu. */
export function initHeader(opts: { reducedMotion: boolean; onMenuToggle?: (open: boolean) => void }) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  /* Scroll state */
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > 480 && !menuOpen) header.classList.add('is-hidden');
    else if (goingUp || y < 480) header.classList.remove('is-hidden');
    if (Math.abs(y - lastY) > 4) lastY = y;
    ticking = false;
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

  /* Active link */
  const links = new Map<string, HTMLElement>();
  header.querySelectorAll<HTMLElement>('[data-nav-link]').forEach((a) => links.set(a.dataset.navLink!, a));
  const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
  if (sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.remove('is-active'));
          links.get(e.target.id)?.classList.add('is-active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }

  /* Mobile menu */
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const label = header.querySelector<HTMLElement>('[data-menu-label]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const pixels = menu?.querySelector<HTMLElement>('[data-menu-pixels]');
  const body = menu?.querySelector<HTMLElement>('[data-menu-body]');
  let menuOpen = false;
  let tl: gsap.core.Timeline | null = null;

  if (!toggle || !menu || !pixels || !body) return;

  const buildPixels = () => {
    const size = 56;
    const cols = Math.ceil(window.innerWidth / size);
    const rows = Math.ceil(window.innerHeight / size);
    pixels.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    pixels.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    pixels.innerHTML = '<i></i>'.repeat(cols * rows);
    return pixels.children;
  };

  const setOpen = (open: boolean) => {
    if (open === menuOpen) return;
    menuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = (open ? label.dataset.close : label.dataset.open) ?? '';
    document.documentElement.classList.toggle('menu-open', open);
    // Keep keyboard and screen-reader focus inside the menu while it covers the page.
    document.querySelectorAll<HTMLElement>('main, footer, .skip-link').forEach((el) => (el.inert = open));
    opts.onMenuToggle?.(open);
    tl?.kill();

    const links = body.querySelectorAll('[data-menu-link], [data-menu-link-extra]');

    if (open) {
      header.classList.remove('is-hidden');
      menu.hidden = false;
      const cells = buildPixels();
      if (opts.reducedMotion) {
        gsap.set(cells, { opacity: 1 });
        return;
      }
      tl = gsap
        .timeline()
        .fromTo(cells, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: { amount: 0.36, from: 'random' } })
        .fromTo(links, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.04 }, '-=0.2');
    } else {
      const cells = pixels.children;
      if (opts.reducedMotion) {
        menu.hidden = true;
        return;
      }
      tl = gsap
        .timeline({ onComplete: () => (menu.hidden = true) })
        .to(links, { opacity: 0, duration: 0.2 })
        .to(cells, { opacity: 0, duration: 0.01, stagger: { amount: 0.28, from: 'random' } }, '<0.05');
    }
  };

  toggle.addEventListener('click', () => setOpen(!menuOpen));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
