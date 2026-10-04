/**
 * Live local time for every [data-clock="Area/City"] element,
 * plus [data-online="Area/City"] badges that read "online" in working hours.
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

function fmt(tz: string) {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    formatters.set(tz, f);
  }
  return f;
}

function isWorkingHours(tz: string, now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    hour: '2-digit',
    hour12: false,
    timeZone: tz,
  }).formatToParts(now);
  const day = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  return !['Sat', 'Sun'].includes(day) && hour >= 9 && hour < 19;
}

export function initClocks() {
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
  const badges = document.querySelectorAll<HTMLElement>('[data-online]');
  if (!clocks.length && !badges.length) return;

  const update = () => {
    const now = new Date();
    clocks.forEach((el) => {
      try {
        el.textContent = fmt(el.dataset.clock!).format(now);
      } catch {
        /* unknown time zone */
      }
    });
    badges.forEach((el) => {
      const on = isWorkingHours(el.dataset.online!, now);
      el.dataset.state = on ? 'online' : 'offline';
      const label = el.querySelector('[data-online-label]');
      if (label) label.textContent = on ? (el.dataset.onLabel ?? 'online now') : (el.dataset.offLabel ?? 'away · replies next business day');
    });
  };
  update();
  // align to the next minute, then tick every minute
  setTimeout(() => {
    update();
    setInterval(update, 60_000);
  }, 60_000 - (Date.now() % 60_000));
}
