import type { APIRoute, GetStaticPaths } from 'astro';
import { getDictionary, locales } from '@/i18n';
import { renderCaseOg, renderHomeOg } from '@/lib/og';
import { site } from '@/config/site';

/** Builds /og/<locale>/index.png and /og/<locale>/<case>.png at build time. */
export const getStaticPaths: GetStaticPaths = () =>
  locales.flatMap((locale) => [
    { params: { locale, slug: 'index' } },
    ...getDictionary(locale).work.items.map((item) => ({ params: { locale, slug: item.slug } })),
  ]);

export const GET: APIRoute = async ({ params }) => {
  const dict = getDictionary(params.locale as (typeof locales)[number]);
  const domain = new URL(site.url).host;
  const index = dict.work.items.findIndex((c) => c.slug === params.slug);
  const png =
    index === -1 ? await renderHomeOg(dict, domain) : await renderCaseOg(dict, dict.work.items[index]!, index, domain);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
