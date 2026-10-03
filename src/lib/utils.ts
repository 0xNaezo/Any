const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ESCAPES[char]);

/**
 * Tiny formatter for copy in site.ts:
 *   *word*  → <em>word</em> (rendered in italic serif inside headings)
 *   \n      → <br>
 */
export function rich(value: string): string {
  return escapeHtml(value)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

/** Strips the formatting markers, for meta tags and aria labels. */
export const plain = (value: string) => value.replace(/\*/g, '').replace(/\n/g, ' ');

/** Prefixes a root-relative path with the configured base path (for sub-folder deployments). */
export function withBase(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Turns "Mark Orlov" into "MO". */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
