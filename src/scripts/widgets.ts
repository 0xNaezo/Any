import { gsap, ScrollTrigger, onEnter, reduced } from './core';

/** Process rail: fill + travelling ghost scrubbed by scroll; steps light up. */
export function initProcess() {
  const wrap = document.querySelector<HTMLElement>('[data-steps]');
  if (!wrap) return;
  const steps = [...wrap.querySelectorAll<HTMLElement>('[data-step]')];
  if (reduced) {
    steps.forEach((s) => s.classList.add('is-done'));
    return;
  }
  gsap.set(wrap, { '--p': 0 });
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 60%',
    end: 'bottom 60%',
    scrub: true,
    onUpdate: (self) => {
      // quantise to 2% so the line advances in visible pixel steps
      const p = Math.round(self.progress * 50) / 50;
      wrap.style.setProperty('--p', String(p));
      const railTop = wrap.getBoundingClientRect().top;
      const h = wrap.offsetHeight;
      steps.forEach((s) => {
        const center = s.getBoundingClientRect().top - railTop + 40;
        s.classList.toggle('is-done', center / h <= p + 0.02);
      });
    },
  });
}

/** FAQ: animated <details> (falls back to native toggling). */
export function initFaq() {
  document.querySelectorAll<HTMLDetailsElement>('[data-qa]').forEach((d) => {
    const summary = d.querySelector('summary');
    const body = d.querySelector<HTMLElement>('[data-qa-body]');
    if (!summary || !body || reduced) return;
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open) {
        gsap.to(body, {
          height: 0,
          duration: 0.24,
          ease: 'steps(5)',
          onComplete: () => {
            d.open = false;
            gsap.set(body, { clearProps: 'height' });
            ScrollTrigger.refresh();
          },
        });
      } else {
        d.open = true;
        gsap.fromTo(
          body,
          { height: 0 },
          {
            height: 'auto',
            duration: 0.3,
            ease: 'steps(6)',
            onComplete: () => {
              gsap.set(body, { clearProps: 'height' });
              ScrollTrigger.refresh();
            },
          },
        );
      }
    });
  });
}

/** Copy-to-clipboard buttons: [data-copy="text"]. */
export function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.querySelector<HTMLElement>('[data-copy-label]');
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      btn.classList.add('is-copied');
      if (label) label.textContent = 'Copied';
      window.setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = 'Copy';
      }, 1800);
    });
  });
}

/** Coverage map + capacity cells fill in a quick pixel wave. */
export function initPixelFills() {
  if (reduced) return;
  const groups: [string, string][] = [
    ['[data-coverage]', '[data-cell]'],
    ['[data-capacity]', '[data-cap-cell]'],
  ];
  for (const [wrapSel, cellSel] of groups) {
    document.querySelectorAll<HTMLElement>(wrapSel).forEach((wrap) => {
      const cells = wrap.querySelectorAll<HTMLElement>(cellSel);
      if (!cells.length) return;
      gsap.set(cells, { autoAlpha: 0 });
      onEnter(wrap, () => {
        gsap.to(cells, { autoAlpha: 1, duration: 0.01, stagger: { each: 0.018, from: 'start' } });
      }, 'top 80%');
    });
  }
}
