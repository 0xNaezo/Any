import ru from './ru';
import en from './en';
import { typograph, typographString } from './typograph';
import type { Dictionary, Locale } from './types';

export type { Dictionary, Locale } from './types';

/**
 * Enabled languages. The first one is the default and lives at the site root.
 * To ship a single-language site, remove the other locale here and delete its
 * folder in `src/pages` (e.g. `src/pages/en`).
 */
export const locales: Locale[] = ['ru', 'en'];
export const defaultLocale: Locale = 'ru';

const raw: Record<Locale, Dictionary> = { ru, en };
const cache = new Map<Locale, Dictionary>();

export function getDictionary(locale: Locale): Dictionary {
  let dict = cache.get(locale);
  if (!dict) {
    dict = typograph(raw[locale]);
    // Functions are kept as-is, so polish their output too.
    const experience = dict.team.experience;
    dict.team.experience = (n) => typographString(experience(n));
    cache.set(locale, dict);
  }
  return dict;
}

/** Language switcher labels. */
export const localeNames: Record<Locale, { short: string; long: string }> = {
  ru: { short: 'RU', long: 'Русский' },
  en: { short: 'EN', long: 'English' },
};

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Builds a site-relative URL for a path in the given locale, honouring `base`. */
export function localeUrl(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const url = `${base}${prefix}${clean}`;
  return url === '' ? '/' : url;
}

/** Same page in another language: strips the current locale prefix and re-applies the target one. */
export function switchLocaleUrl(pathname: string, target: Locale): string {
  let path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  for (const l of locales) {
    if (l === defaultLocale) continue;
    if (path === `/${l}` || path.startsWith(`/${l}/`)) {
      path = path.slice(l.length + 1) || '/';
      break;
    }
  }
  return localeUrl(target, path || '/');
}

/** Asset/public URL honouring `base`. */
export function assetUrl(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
