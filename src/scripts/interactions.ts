import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const finePointer = () => window.matchMedia('(pointer: fine)').matches;
const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(selector)];

let refreshTimer = 0;
const refreshSoon = () => {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
};

/** Buttons lean toward the cursor. */
export function initMagnetic() {
  if (!finePointer()) return;
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.2,
        y: (event.clientY - rect.top - rect.height / 2) * 0.3,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: true,
      });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: true });
    });
  });
}

/** Soft light that follows the cursor inside cards. */
export function initSpotlight() {
  if (!finePointer()) return;
  document.addEventListener(
    'pointermove',
    (event) => {
      const el = (event.target as Element | null)?.closest?.<HTMLElement>('[data-spotlight]');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    },
    { passive: true },
  );
}

/** The "oo" in the footer wordmark keep an eye on you. */
export function initEyes() {
  const eyes = $$('[data-eye]');
  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!eyes.length || !wordmark) return;
  let visible = false;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(wordmark);

  const look = (x: number, y: number) => {
    eyes.forEach((eye) => {
      const pupil = eye.querySelector<HTMLElement>('.wordmark__pupil');
      if (!pupil) return;
      const rect = eye.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height * 0.61);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(dist / 360, 1);
      pupil.style.setProperty('--px', ((dx / dist) * k).toFixed(3));
      pupil.style.setProperty('--py', ((dy / dist) * k).toFixed(3));
    });
  };

  if (finePointer()) {
    window.addEventListener('pointermove', (event) => visible && look(event.clientX, event.clientY), { passive: true });
  } else {
    // touch: glance around now and then
    window.setInterval(() => {
      if (!visible) return;
      look(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.6);
    }, 2200);
  }
}

/** Copy-to-clipboard buttons. */
export function initCopy() {
  document.addEventListener('click', async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-copy]');
    if (!button) return;
    const value = button.dataset.copy || '';
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = Object.assign(document.createElement('textarea'), { value });
      area.style.cssText = 'position:fixed;opacity:0';
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    if (status) status.textContent = 'Email address copied';
    button.classList.add('is-copied');
    window.setTimeout(() => {
      button.classList.remove('is-copied');
      if (status) status.textContent = '';
    }, 1800);
  });
}

/** Live studio time + "online" indicator based on working hours. */
export function initClock() {
  const clocks = $$('[data-clock]');
  if (!clocks.length) return;
  const timeZone = clocks[0].dataset.timezone || 'UTC';
  const online = document.querySelector<HTMLElement>('[data-online]');
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
  const parts = new Intl.DateTimeFormat('en-US', { weekday: 'short', hour: 'numeric', hour12: false, timeZone });
  const days: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

  const tick = () => {
    const now = new Date();
    const time = fmt.format(now);
    clocks.forEach((clock) => (clock.textContent = time));

    if (online) {
      const p = parts.formatToParts(now);
      const day = days[p.find((x) => x.type === 'weekday')?.value ?? 'Mon'];
      const hour = parseInt(p.find((x) => x.type === 'hour')?.value ?? '0', 10) % 24;
      const from = parseInt(online.dataset.from || '10', 10);
      const to = parseInt(online.dataset.to || '19', 10);
      const workdays: number[] = JSON.parse(online.dataset.days || '[1,2,3,4,5]');
      const isOn = workdays.includes(day) && hour >= from && hour < to;
      online.classList.add('is-ready');
      online.querySelector('.dot')?.classList.toggle('is-off', !isOn);
      const label = online.querySelector<HTMLElement>('[data-online-label]');
      if (label) label.textContent = isOn ? 'Online now' : 'After hours';
    }
  };

  tick();
  window.setTimeout(
    () => {
      tick();
      window.setInterval(tick, 60_000);
    },
    (60 - new Date().getSeconds()) * 1000 + 50,
  );
}

/** Accessible <details> accordion with smooth height. */
export function initFaq(reducedMotion: boolean) {
  $$<HTMLDetailsElement>('[data-faq]').forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector<HTMLElement>('.faq__a');
    if (!summary || !content) return;
    let animating = false;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      if (animating) return;
      if (reducedMotion) {
        details.open = !details.open;
        refreshSoon();
        return;
      }
      animating = true;
      if (!details.open) {
        details.open = true;
        gsap.fromTo(
          content,
          { height: 0, opacity: 0 },
          {
            height: 'auto',
            opacity: 1,
            duration: 0.7,
            ease: 'expo.out',
            onComplete: () => {
              gsap.set(content, { clearProps: 'height,opacity' });
              animating = false;
              refreshSoon();
            },
          },
        );
      } else {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'power3.inOut',
          onComplete: () => {
            details.open = false;
            gsap.set(content, { clearProps: 'height,opacity' });
            animating = false;
            refreshSoon();
          },
        });
      }
    });
  });
}

/** A hello for the curious ones who open DevTools. */
export function greet(email = document.querySelector<HTMLElement>('[data-contact-form]')?.dataset.email || 'hello@nightloom.dev') {
  const ghost = [
    '    .-"""-.',
    '   /  o o  \\',
    '  |         |',
    '  |         |   Hey, fellow developer.',
    `   \\/\\/\\/\\/\\/    We read source code too — say hi: ${email}`,
  ].join('\n');
  console.log(`%c${ghost}`, 'color:#a8f0cc;font-family:ui-monospace,monospace;line-height:1.4');
}
