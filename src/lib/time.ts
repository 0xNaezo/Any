/** Minutes that `timeZone` is ahead of UTC at the given instant (DST-aware). */
export function tzOffsetMinutes(timeZone: string, date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUTC = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUTC - date.getTime()) / 60000);
}

export interface Zone {
  city: string;
  tz: string;
  start: number;
  end: number;
  home?: boolean;
}

/** Working-hour segments of every zone expressed in the home zone's clock (0–24, split at midnight). */
export function zoneSegments(zones: Zone[], date = new Date()) {
  const home = zones.find((z) => z.home) ?? zones[0];
  const homeOffset = tzOffsetMinutes(home.tz, date);
  return zones.map((z) => {
    const shift = (tzOffsetMinutes(z.tz, date) - homeOffset) / 60;
    let start = z.start - shift;
    let end = z.end - shift;
    while (start < 0) {
      start += 24;
      end += 24;
    }
    while (start >= 24) {
      start -= 24;
      end -= 24;
    }
    const segments: [number, number][] = end <= 24 ? [[start, end]] : [[start, 24], [0, end - 24]];
    return { ...z, shift, segments };
  });
}

/** Overlap (in hours) between two lists of segments. */
export function overlapHours(a: [number, number][], b: [number, number][]) {
  let total = 0;
  for (const [s1, e1] of a) for (const [s2, e2] of b) total += Math.max(0, Math.min(e1, e2) - Math.max(s1, s2));
  return total;
}

/** Current time of day (fractional hours) in a timezone. */
export function hoursNow(timeZone: string, date = new Date()) {
  const minutes = (date.getUTCHours() * 60 + date.getUTCMinutes() + tzOffsetMinutes(timeZone, date) + 1440) % 1440;
  return minutes / 60;
}

export function formatClock(timeZone: string, date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
}
