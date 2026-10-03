/**
 * Contact form: inline validation, JSON submission to a configurable endpoint
 * (Formspree / Web3Forms / custom worker), graceful fallback to an email draft.
 */

type Validator = (value: string) => true | string;

const validators: Record<string, Validator> = {
  name: (v) => v.trim().length >= 2 || 'Please tell us your name.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'That email address doesn’t look quite right.',
  message: (v) => v.trim().length >= 20 || 'A couple of sentences helps us prepare — 20 characters or more.',
};

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_INDEX: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

/** "tomorrow" or the name of the next working day in the studio's time zone. */
function nextBusinessDay(timeZone: string, workdays: number[]): string {
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone }).format(new Date());
  let day = DAY_INDEX[weekday] ?? 1;
  for (let offset = 1; offset <= 7; offset++) {
    day = (day % 7) + 1;
    if (workdays.includes(day)) return offset === 1 ? 'tomorrow' : DAY_NAMES[day];
  }
  return 'the next business day';
}

export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const endpoint = form.dataset.endpoint || '';
  const email = form.dataset.email || '';
  const timeZone = form.dataset.timezone || 'UTC';
  const workdays: number[] = JSON.parse(form.dataset.workdays || '[1,2,3,4,5]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const successText = success?.querySelector<HTMLElement>('[data-success-text]');
  const planInput = form.querySelector<HTMLInputElement>('[data-plan-input]');
  const planNote = form.querySelector<HTMLElement>('[data-plan-note]');
  const planName = form.querySelector<HTMLElement>('[data-plan-name]');
  const touched = new Set<string>();

  // ── plan prefill from pricing buttons ────────────────────────────────
  const setPlan = (plan: string) => {
    if (planInput) planInput.value = plan;
    if (planName) planName.textContent = plan;
    if (planNote) planNote.hidden = !plan;
  };
  document.addEventListener('click', (event) => {
    const cta = (event.target as Element).closest<HTMLElement>('[data-plan]');
    if (cta?.dataset.plan) setPlan(cta.dataset.plan);
  });
  form.querySelector('[data-plan-clear]')?.addEventListener('click', () => setPlan(''));

  // ── validation ───────────────────────────────────────────────────────
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
  const validate = (name: string, show = true) => {
    const input = field(name);
    const error = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (!input) return true;
    const result = validators[name](input.value);
    const ok = result === true;
    if (show) {
      input.setAttribute('aria-invalid', String(!ok));
      if (error) error.textContent = ok ? '' : String(result);
    }
    return ok;
  };

  form.addEventListener('focusout', (event) => {
    const name = (event.target as HTMLInputElement).name;
    if (!validators[name]) return;
    if ((event.target as HTMLInputElement).value) touched.add(name);
    if (touched.has(name)) validate(name);
  });
  form.addEventListener('input', (event) => {
    const name = (event.target as HTMLInputElement).name;
    if (validators[name] && touched.has(name)) validate(name);
  });

  // ── submit ───────────────────────────────────────────────────────────
  const setBusy = (busy: boolean) => {
    if (!submit) return;
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    const text = submit.querySelector<HTMLElement>('.btn__text');
    if (text) {
      const label = busy ? 'Sending…' : 'Send request';
      text.textContent = label;
      text.dataset.text = label;
    }
  };

  const showSuccess = () => {
    if (!success) return;
    if (successText) {
      const template = successText.dataset.template || successText.textContent || '';
      successText.textContent = template.replace('{day}', nextBusinessDay(timeZone, workdays));
    }
    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
  };

  success?.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    field('name')?.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) {
      status.textContent = '';
      status.classList.remove('is-info');
    }

    Object.keys(validators).forEach((name) => touched.add(name));
    const invalid = Object.keys(validators).filter((name) => !validate(name));
    if (invalid.length) {
      field(invalid[0])?.focus();
      return;
    }

    const data = new FormData(form);
    // Honeypot filled → silently "succeed" for bots.
    if (String(data.get('_gotcha') || '')) {
      showSuccess();
      return;
    }

    const payload: Record<string, string> = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim(),
      needs: data.getAll('needs').join(', '),
      budget: String(data.get('budget') || ''),
      plan: String(data.get('plan') || ''),
      nda: data.get('nda') ? 'Yes' : 'No',
      message: String(data.get('message') || '').trim(),
      subject: String(data.get('subject') || 'New project request'),
    };
    const accessKey = data.get('access_key');
    if (accessKey) payload.access_key = String(accessKey);

    // No endpoint configured → open a pre-filled email instead.
    if (!endpoint) {
      const details = [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.company && `Company: ${payload.company}`,
        payload.needs && `Needs: ${payload.needs}`,
        payload.budget && `Budget: ${payload.budget}`,
        payload.plan && `Plan: ${payload.plan}`,
        `NDA first: ${payload.nda}`,
      ].filter(Boolean);
      const body = `${details.join('\n')}\n\n${payload.message}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
      if (status) {
        status.classList.add('is-info');
        status.textContent = `Your email app should open with everything filled in. If it doesn’t, write to us at ${email}.`;
      }
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showSuccess();
      form.reset();
      setPlan('');
      touched.clear();
    } catch {
      if (status) status.textContent = `Something went wrong on our side. Please email us at ${email} — we’ll reply just as fast.`;
    } finally {
      setBusy(false);
    }
  });
}
