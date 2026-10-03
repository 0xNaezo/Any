import { initClock } from './clock';
import { initHeader } from './header';
import { mountGhostScene } from './ghost-scene';
import { initMotion, getLenis } from './motion';
import { initContactForm } from './form';
import { initTransitions } from './transitions';

// Lets the head script's failsafe know the bundle arrived.
(window as Window & { __nl?: boolean }).__nl = true;

// The head script sets .motion unless reduced motion is requested; its failsafe drops
// the class if this bundle took too long — either way, skip entrance animations.
const reducedMotion = !document.documentElement.classList.contains('motion');

initTransitions({ reducedMotion });
initHeader({
  reducedMotion,
  onMenuToggle: (open) => (open ? getLenis()?.stop() : getLenis()?.start()),
});
document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => mountGhostScene(el, { reducedMotion }));
initMotion({ reducedMotion });
initClock();
initContactForm();
