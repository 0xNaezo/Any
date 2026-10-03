import { gsap } from 'gsap';

/**
 * Pixel-grid page transitions: the screen is "woven" shut cell by cell before
 * navigating to another page, then unravels on arrival.
 */
const KEY = 'nl:transition';
const CELL = 72;

/** Storage can throw (privacy modes, blocked site data) — never let it break the page. */
const store = {
  take() {
    try {
      const v = sessionStorage.getItem(KEY);
      sessionStorage.removeItem(KEY);
      return v !== null;
    } catch {
      return false;
    }
  },
  mark() {
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* the next page simply skips the unravel */
    }
  },
};

function build(root: HTMLElement, accentShare = 0.06) {
  const cols = Math.ceil(window.innerWidth / CELL);
  const rows = Math.ceil(window.innerHeight / CELL);
  root.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  root.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  let html = '';
  for (let i = 0; i < cols * rows; i++) html += Math.random() < accentShare ? '<i class="is-accent"></i>' : '<i></i>';
  root.innerHTML = html;
  return { cells: root.children };
}

export function initTransitions({ reducedMotion }: { reducedMotion: boolean }) {
  const root = document.querySelector<HTMLElement>('[data-pt]');
  const arriving = store.take();
  if (!root || reducedMotion) {
    document.documentElement.classList.remove('pt-arrive');
    return;
  }

  // Arrival: unravel the cover. Until the cells exist, the inline head script
  // keeps the screen covered via `.pt-arrive` so the new page never flashes.
  // On a slow load the CSS failsafe has already uncovered the page — don't re-cover it.
  if (arriving && performance.now() < 1400) {
    const { cells } = build(root);
    gsap.set(cells, { opacity: 1 });
    gsap.to(cells, {
      opacity: 0,
      duration: 0.01,
      delay: 0.05,
      stagger: { amount: 0.5, from: 'random' },
      onComplete: () => (root.innerHTML = ''),
    });
  }
  document.documentElement.classList.remove('pt-arrive');

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) root.innerHTML = '';
  });

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    const samePage = url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
    if (samePage) return; // in-page anchors are handled by smooth scroll
    if (!/^https?:$/.test(url.protocol)) return;

    e.preventDefault();
    const { cells } = build(root);
    gsap.set(cells, { opacity: 0 });
    gsap.to(cells, {
      opacity: 1,
      duration: 0.01,
      stagger: { amount: 0.42, from: 'random' },
      onComplete: () => {
        store.mark();
        window.location.href = url.href;
      },
    });
  });
}
