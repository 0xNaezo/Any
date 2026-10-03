import en from './en';
import ru from './ru';
import type { Content, Locale } from './types';

export type { Content, Locale };

export const locales: Locale[] = ['en', 'ru'];

/** The language served at "/". The other one lives under "/<locale>/". */
export const defaultLocale: Locale = 'en';

const dictionaries: Record<Locale, Content> = { en, ru };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}

/** Root path of a locale, e.g. "/" or "/ru/". */
export function localeRoot(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

/** Path of a page inside a locale, e.g. localePath('ru', 'privacy') → "/ru/privacy/". */
export function localePath(locale: Locale, page = ''): string {
  const root = localeRoot(locale);
  return page ? `${root}${page.replace(/^\/|\/$/g, '')}/` : root;
}

/** Labels for the language switcher. */
export const localeLabels: Record<Locale, { short: string; name: string }> = {
  en: { short: 'EN', name: 'English' },
  ru: { short: 'RU', name: 'Русский' },
};
