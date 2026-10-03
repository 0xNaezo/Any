/**
 * Everything that is not translated lives here: contacts, links, legal details.
 * Texts for each language live in `src/i18n/en.ts` and `src/i18n/ru.ts`.
 */
export const site = {
  name: 'Nightloom',
  /** Production URL, no trailing slash. Keep in sync with `site` in astro.config.mjs. */
  url: 'https://nightloom.dev',
  founded: 2019,

  email: 'hello@nightloom.dev',
  /** Telegram username without "@". */
  telegram: 'nightloom',
  /** Link for the "book a call" button (Cal.com, Calendly, Google Calendar…). */
  calendar: 'https://cal.com/nightloom/intro',

  /**
   * Where the contact form sends its data (JSON POST).
   * Works out of the box with Formspree (https://formspree.io/f/xxxxxxx), Web3Forms, Getform
   * or your own endpoint. Leave empty to open the visitor's email app with a prefilled letter.
   */
  formEndpoint: '',

  /** Studio time zone: drives the live clock in the footer. */
  timezone: 'Europe/Belgrade',

  /** Shown in the header and the hero. Set `open: false` to hide the badge. */
  availability: { open: true },

  socials: [
    { label: 'GitHub', href: 'https://github.com/nightloom' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nightloom' },
    { label: 'Dribbble', href: 'https://dribbble.com/nightloom' },
    { label: 'Clutch', href: 'https://clutch.co/profile/nightloom' },
  ],

  legal: {
    company: 'Nightloom Studio d.o.o.',
    registration: 'Reg. No. 21900000',
    address: 'Belgrade, Serbia',
  },
} as const;

export type Site = typeof site;
