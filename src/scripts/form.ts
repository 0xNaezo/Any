/**
 * Contact form: inline validation, JSON POST to `site.form.endpoint`
 * (Formspree / Web3Forms / your API), or a pre-filled mailto: fallback.
 */
// email | Telegram @username (5–32 chars, starts with a letter) | phone
const CONTACT_RE = /^(?:[^\s@]+@[^\s@]+\.[^\s@]{2,}|@?[a-zA-Z][a-zA-Z0-9_]{4,31}|\+?[\d\s()-]{7,20})$/;

export function initContactForm() {
  document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach(setup);
}

function setup(form: HTMLFormElement) {
  const d = form.dataset;
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-submit]');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const errorBox = form.querySelector<HTMLElement>('[data-form-error]');
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  const successTitle = form.querySelector<HTMLElement>('[data-success-title]');
  const successText = form.querySelector<HTMLElement>('[data-success-text]');
  const successDirect = form.querySelector<HTMLElement>('[data-success-direct]');
  const idleLabel = submitLabel?.textContent ?? '';

  const fields = {
    name: form.elements.namedItem('name') as HTMLInputElement,
    contact: form.elements.namedItem('contact') as HTMLInputElement,
  };

  const setError = (input: HTMLInputElement, message: string) => {
    const err = document.getElementById(`${input.id}-err`);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.textContent = message;
  };

  const validate = (input: HTMLInputElement) => {
    const value = input.value.trim();
    if (!value) {
      setError(input, d.msgRequired ?? '');
      return false;
    }
    if (input === fields.contact && !CONTACT_RE.test(value)) {
      setError(input, d.msgInvalid ?? '');
      return false;
    }
    setError(input, '');
    return true;
  };

  Object.values(fields).forEach((input) => {
    input.addEventListener('blur', () => input.value && validate(input));
    input.addEventListener('input', () => input.getAttribute('aria-invalid') === 'true' && validate(input));
  });

  const collect = () => {
    const data = new FormData(form);
    return {
      name: String(data.get('name') ?? '').trim(),
      contact: String(data.get('contact') ?? '').trim(),
      company: String(data.get('company') ?? '').trim(),
      type: data.getAll('type').map(String),
      budget: String(data.get('budget') ?? ''),
      message: String(data.get('message') ?? '').trim(),
      nda: data.get('nda') === 'yes',
      website: String(data.get('website') ?? ''),
      locale: d.locale,
      page: window.location.href,
    };
  };

  const showSuccess = (fallback?: { title?: string; text?: string }) => {
    if (!success) return;
    if (fallback?.title && successTitle) successTitle.textContent = fallback.title;
    if (fallback?.text && successText) successText.textContent = fallback.text;
    if (successDirect) successDirect.hidden = !fallback;
    success.hidden = false;
    success.focus({ preventScroll: true });
  };

  const setBusy = (busy: boolean) => {
    if (submitBtn) submitBtn.disabled = busy;
    if (submitLabel) submitLabel.textContent = busy ? (d.msgSending ?? idleLabel) : idleLabel;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorBox) errorBox.hidden = true;

    const okName = validate(fields.name);
    const okContact = validate(fields.contact);
    if (!okName || !okContact) {
      (okName ? fields.contact : fields.name).focus();
      return;
    }

    const payload = collect();

    // Bots fill the hidden field — pretend everything went fine.
    if (payload.website) {
      showSuccess();
      return;
    }

    const endpoint = d.endpoint?.trim();
    if (!endpoint) {
      const meta = [
        payload.name,
        payload.contact + (payload.company ? ` · ${payload.company}` : ''),
        payload.type.length ? `Type: ${payload.type.join(', ')}` : '',
        payload.budget ? `Budget: ${payload.budget}` : '',
        payload.nda ? 'NDA: yes' : '',
      ].filter(Boolean);
      const text = payload.message ? `${meta.join('\n')}\n\n${payload.message}` : meta.join('\n');
      const href = `mailto:${d.email}?subject=${encodeURIComponent(d.subject ?? '')}&body=${encodeURIComponent(text)}`;
      window.location.href = href;
      showSuccess({ title: d.msgFallbackTitle, text: d.msgFallback });
      return;
    }

    setBusy(true);
    try {
      const { website: _hp, ...body } = payload;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...body, _subject: d.subject }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      showSuccess();
    } catch (err) {
      console.error(err);
      if (errorBox) errorBox.hidden = false;
    } finally {
      setBusy(false);
    }
  });
}
