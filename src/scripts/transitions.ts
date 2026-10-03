import { gsap } from 'gsap';

/**
 * Pixel-grid page transitions: the screen is "woven" shut cell by cell before
 * navigating to another page, then unravels on arrival.
 */
const KEY = 'nl:transition';
const CELL = 72;

function build(root: HTMLElement, accentShare = 0.06) {
  const cols = Math.ceil(window.innerWidth / CELL);
  const rows = Math.ceil(window.innerHeight / CELL);
  root.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  root.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  let html = '';
  for (let i = 0; i < cols * rows; i++) html += Math.random() < accentShare ? '<i class="is-accent"></i>' : '<i></i>';
  root.innerHTML = html;
  return { cells: root.children, cols, rows };
}

export function initTransitions({ reducedMotion }: { reducedMotion: boolean }) {
  const root = document.querySelector<HTMLElement>('[data-pt]');
  if (!root || reducedMotion) {
    sessionStorage.removeItem(KEY);
    return;
  }

  // Arrival: unravel the cover.
  if (sessionStorage.getItem(KEY)) {
    sessionStorage.removeItem(KEY);
    const { cells, cols } = build(root);
    gsap.set(cells, { opacity: 1 });
    gsap.to(cells, {
      opacity: 0,
      duration: 0.01,
      delay: 0.05,
      stagger: { each: 0.0035, from: 'random', grid: [Math.ceil(cells.length / cols), cols] },
      onComplete: () => (root.innerHTML = ''),
    });
  }

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
      stagger: { each: 0.003, from: 'random' },
      onComplete: () => {
        sessionStorage.setItem(KEY, '1');
        window.location.href = url.href;
      },
    });
  });
}
