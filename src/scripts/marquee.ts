import { gsap } from 'gsap';
import { scrollVelocity } from './scroll';

/**
 * Endless logo band. Drifts slowly on its own, speeds up with the scroll and
 * follows its direction, eases to a stop under the pointer. Without JS, or
 * with reduced motion, the logos stay a static, wrapping row.
 */
export function initMarquee(reducedMotion: boolean) {
  const root = document.querySelector<HTMLElement>('[data-marquee]');
  const track = root?.querySelector<HTMLElement>('[data-marquee-track]');
  const list = track?.querySelector<HTMLElement>('[data-marquee-list]');
  if (!root || !track || !list || reducedMotion) return;

  root.classList.add('is-running');

  let width = 0;
  const fill = () => {
    track.querySelectorAll('[data-clone]').forEach((clone) => clone.remove());
    width = list.offsetWidth;
    if (!width) return;
    const copies = Math.ceil(root.offsetWidth / width) + 1;
    for (let i = 0; i < copies; i++) {
      const clone = list.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.clone = '';
      clone.removeAttribute('data-marquee-list');
      clone.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
      track.append(clone);
    }
  };
  fill();
  new ResizeObserver(fill).observe(root);

  let x = 0;
  let direction = 1;
  let hover = 1;
  let hoverTarget = 1;
  let visible = false;
  const base = 38; // px per second

  root.addEventListener('pointerenter', () => (hoverTarget = 0.12));
  root.addEventListener('pointerleave', () => (hoverTarget = 1));
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(root);

  gsap.ticker.add((_time, deltaMs) => {
    if (!visible || !width) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    const v = scrollVelocity();
    if (Math.abs(v) > 0.4) direction = v > 0 ? 1 : -1;
    hover += (hoverTarget - hover) * (1 - Math.exp(-dt * 6));
    const speed = (base + Math.min(Math.abs(v) * 42, 900)) * direction * hover;
    x = (((x + speed * dt) % width) + width) % width;
    track.style.transform = `translate3d(${(-x).toFixed(2)}px, 0, 0)`;
  });
}
