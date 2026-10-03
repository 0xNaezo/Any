/** Live clock in the team's time zone + a day/night note. */
export function initClock() {
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
  const notes = document.querySelectorAll<HTMLElement>('[data-clock-note]');
  if (!clocks.length) return;

  const tz = clocks[0]!.dataset.tz || 'UTC';
  let fmt: Intl.DateTimeFormat;
  let hourFmt: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    hourFmt = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: tz });
  } catch {
    fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    hourFmt = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false });
  }

  const tick = () => {
    const now = new Date();
    const time = fmt.format(now);
    clocks.forEach((el) => {
      el.textContent = time;
      el.setAttribute('datetime', now.toISOString());
    });
    const hour = Number(hourFmt.format(now)) % 24;
    const night = hour >= 21 || hour < 8;
    notes.forEach((el) => {
      el.textContent = (night ? el.dataset.night : el.dataset.day) ?? '';
    });
  };

  tick();
  window.setInterval(tick, 15_000);
}
