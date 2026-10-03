/**
 * Global, language-independent settings.
 *
 * All visible texts live in `src/i18n/ru.ts` and `src/i18n/en.ts`.
 * Everything here is placeholder data — replace it with your real details.
 */
export const site = {
  name: 'Nightloom',
  /** Production URL (no trailing slash). Used for canonical links, OG tags and the sitemap. */
  url: 'https://nightloom.dev',
  /** Year the team started working together. */
  founded: 2020,

  email: 'hello@nightloom.dev',
  telegram: {
    handle: '@nightloom',
    href: 'https://t.me/nightloom',
  },
  /** Link to book an intro call (Cal.com, Calendly, etc.). Leave empty to hide the button. */
  booking: 'https://cal.com/nightloom/intro',

  /** Team's time zone — drives the live clock in the hero scene and footer. */
  timezone: 'Europe/Moscow',

  socials: [
    { label: 'GitHub', href: 'https://github.com/nightloom' },
    { label: 'Telegram', href: 'https://t.me/nightloom' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nightloom' },
    { label: 'Dribbble', href: 'https://dribbble.com/nightloom' },
  ],

  form: {
    /**
     * Where the contact form POSTs its data as JSON — e.g. a Formspree form
     * (https://formspree.io/f/xxxx) or your own endpoint / serverless function.
     * Leave empty — the form will open the visitor's mail client with a pre-filled letter instead.
     */
    endpoint: '',
  },
} as const;

export type Site = typeof site;
