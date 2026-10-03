import { finePointer, lockScroll, scrollToTarget } from './app';

/** Case cards: a cursor label on hover and a side panel with the full story. */
export function initWork() {
  // ---------- cursor label
  if (finePointer) {
    document.querySelectorAll<HTMLElement>('.case').forEach((card) => {
      const media = card.querySelector<HTMLElement>('[data-case-media]');
      const label = card.querySelector<HTMLElement>('.case__cursor');
      if (!media || !label) return;
      let raf = 0;
      let x = 0;
      let y = 0;
      card.addEventListener('pointermove', (e) => {
        const r = media.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        card.classList.toggle('is-hover', inside);
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          label.style.left = `${x}px`;
          label.style.top = `${y}px`;
        });
      });
      card.addEventListener('pointerleave', () => card.classList.remove('is-hover'));
    });
  }

  // ---------- case panels
  let opener: HTMLElement | null = null;
  const open = (id: string, trigger: HTMLElement) => {
    const dialog = document.querySelector<HTMLDialogElement>(`[data-case-dialog="${id}"]`);
    if (!dialog || dialog.open) return;
    opener = trigger;
    // reuse the card's illustration instead of shipping it twice
    const art = dialog.querySelector<HTMLElement>(`[data-case-art="${id}"]`);
    const source = document.querySelector<HTMLElement>(`[data-case-source="${id}"] > svg`);
    if (art && !art.firstElementChild && source) art.append(source.cloneNode(true));
    const panel = dialog.querySelector<HTMLElement>('.drawer__panel');
    if (panel) panel.scrollTop = 0;
    dialog.showModal();
    lockScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
    dialog.querySelector<HTMLElement>('[data-case-close]')?.focus({ preventScroll: true });
  };

  const close = (dialog: HTMLDialogElement, after?: () => void) => {
    if (!dialog.open || !dialog.classList.contains('is-open')) return;
    dialog.classList.remove('is-open');
    const done = () => {
      dialog.close();
      lockScroll(false);
      opener?.focus({ preventScroll: true });
      after?.();
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(done, reduce ? 0 : 560);
  };

  document.querySelectorAll<HTMLButtonElement>('[data-case-open]').forEach((btn) =>
    btn.addEventListener('click', () => open(btn.dataset.caseOpen!, btn)),
  );

  document.querySelectorAll<HTMLDialogElement>('[data-case-dialog]').forEach((dialog) => {
    dialog.querySelector('[data-case-close]')?.addEventListener('click', () => close(dialog));
    // Esc
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      close(dialog);
    });
    // click on the dimmed backdrop
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) close(dialog);
    });
    // "discuss a similar project" → close, then glide to the form
    dialog.querySelector('[data-case-cta]')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      close(dialog, () => scrollToTarget('#contact'));
    });
  });
}
