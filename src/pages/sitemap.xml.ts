import type { APIRoute } from 'astro';
import { site } from '../site.config';
import { defaultLocale, getContent, localePath, locales } from '../i18n';

/** Every indexable page, by slug ('' is the landing page). */
const pages = ['', 'privacy'];

export const GET: APIRoute = () => {
  const url = (locale: (typeof locales)[number], page: string) => new URL(localePath(locale, page), site.url).href;
  const entries = pages.flatMap((page) =>
    locales.map((locale) => {
      const alternates = [
        ...locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${getContent(l).htmlLang}" href="${url(l, page)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(defaultLocale, page)}"/>`,
      ].join('\n');
      return `  <url>\n    <loc>${url(locale, page)}</loc>\n${alternates}\n    <priority>${page ? '0.3' : '1.0'}</priority>\n  </url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
