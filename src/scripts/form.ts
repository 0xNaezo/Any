/** Contact form: validation, sending (JSON endpoint or e-mail draft) and the "thank you" state. */

interface Messages {
  required: string;
  invalidEmail: string;
  tooShort: string;
  sending: string;
  submit: string;
  subject: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-form]');
  const done = document.querySelector<HTMLElement>('[data-form-done]');
  if (!form || !done) return;

  const msg: Messages = JSON.parse(form.dataset.messages || '{}');
  const endpoint = form.dataset.endpoint?.trim() || '';
  const email = form.dataset.email || '';
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const errorBox = form.querySelector<HTMLElement>('[data-form-error]');
  const message = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]')!;
  let attempted = false;

  // ---------- validation
  const fields = ['name', 'email', 'message'] as const;
  const check = (name: (typeof fields)[number]) => {
    const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
    const value = input.value.trim();
    let error = '';
    if (!value) error = msg.required;
    else if (name === 'email' && !EMAIL.test(value)) error = msg.invalidEmail;
    else if (name === 'message' && value.length < 20) error = msg.tooShort;
    const field = input.closest('.field');
    const out = form.querySelector<HTMLElement>(`#f-${name}-error`);
    field?.classList.toggle('is-invalid', !!error);
    input.setAttribute('aria-invalid', String(!!error));
    if (error) input.setAttribute('aria-describedby', `f-${name}-error`);
    else input.removeAttribute('aria-describedby');
    if (out) out.textContent = error;
    return !error;
  };

  fields.forEach((name) => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    input.addEventListener('input', () => attempted && check(name));
    input.addEventListener('blur', () => attempted && check(name));
  });

  // ---------- prefill from services and plans
  message.addEventListener('input', () => delete message.dataset.prefilled);
  document.querySelectorAll<HTMLElement>('[data-prefill]').forEach((el) =>
    el.addEventListener('click', () => {
      if (message.value.trim() && !message.dataset.prefilled) return;
      message.value = el.dataset.prefill || '';
      message.dataset.prefilled = '1';
    }),
  );

  // ---------- states
  const showDone = (kind: 'success' | 'mailto') => {
    const title = done.querySelector<HTMLElement>('[data-done-title]');
    const text = done.querySelector<HTMLElement>('[data-done-text]');
    const link = done.querySelector<HTMLElement>('[data-done-email]');
    if (title) title.textContent = title.dataset[kind] ?? '';
    if (text) text.textContent = text.dataset[kind] ?? '';
    if (link) link.hidden = kind !== 'mailto';
    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
  };

  done.querySelector('[data-form-again]')?.addEventListener('click', () => {
    form.reset();
    attempted = false;
    done.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  });

  const setBusy = (busy: boolean) => {
    submit.disabled = busy;
    if (submitLabel) submitLabel.textContent = busy ? msg.sending : msg.submit;
  };

  // ---------- submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    if (errorBox) errorBox.hidden = true;
    const results = fields.map((f) => check(f));
    if (results.includes(false)) {
      const first = form.querySelector<HTMLElement>('.field.is-invalid input, .field.is-invalid textarea');
      first?.focus();
      return;
    }

    const data = new FormData(form);
    // spam trap: bots fill every field
    if ((data.get('website') as string)?.trim()) {
      showDone('success');
      return;
    }
    data.delete('website');
    const payload: Record<string, string> = {};
    data.forEach((v, k) => (payload[k] = String(v).trim()));
    payload.page = location.href;
    payload.language = document.documentElement.lang;

    if (!endpoint) {
      const body = [
        `${payload.message}`,
        '',
        '—',
        `${payload.name}${payload.company ? `, ${payload.company}` : ''}`,
        payload.email,
        payload.budget ? `${form.querySelector('legend')?.textContent?.trim() ?? 'Budget'}: ${payload.budget}` : '',
      ].join('\n');
      const href = `mailto:${email}?subject=${encodeURIComponent(`${msg.subject} — ${payload.name}`)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      showDone('mailto');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, _subject: `${msg.subject} — ${payload.name}` }),
      });
      if (!res.ok) throw new Error(String(res.status));
      showDone('success');
      form.reset();
    } catch {
      if (errorBox) errorBox.hidden = false;
    } finally {
      setBusy(false);
    }
  });

  // ---------- copy e-mail
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.querySelector<HTMLElement>('[data-copy-label]');
    const original = label?.textContent ?? '';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || '');
        if (label) label.textContent = btn.dataset.copied || original;
        window.setTimeout(() => label && (label.textContent = original), 1800);
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });
}
