import { initClock } from './clock';
import { initHeader } from './header';
import { mountGhostScene } from './ghost-scene';
import { initMotion, getLenis } from './motion';
import { initContactForm } from './form';
import { initTransitions } from './transitions';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initTransitions({ reducedMotion });
initMotion({ reducedMotion });
initHeader({
  reducedMotion,
  onMenuToggle: (open) => (open ? getLenis()?.stop() : getLenis()?.start()),
});
initClock();
initContactForm();

document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => mountGhostScene(el, { reducedMotion }));
