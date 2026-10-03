import type { IconName } from '@/lib/sprites';

export type Locale = 'ru' | 'en';

export interface Stat {
  /** Number that counts up on scroll. */
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface SectionHead {
  /** Short label shown next to the section number. */
  label: string;
  title: string;
  lead?: string;
}

export type MockupKind = 'dashboard' | 'logistics' | 'mobile' | 'telegram';

export interface CaseStudy {
  /** URL part: /work/<slug> */
  slug: string;
  name: string;
  /** One-line positioning, e.g. "B2B payments platform". */
  kind: string;
  client: string;
  industry: string;
  year: string;
  duration: string;
  services: string[];
  summary: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  /** Generated UI illustration used until real screenshots are added. */
  mockup: MockupKind;
  /** Optional real cover image placed in /public (e.g. "/work/finora.jpg"). */
  cover?: string;
  challenge: string[];
  solution: string[];
  results: string[];
  quote?: { text: string; author: string; role: string };
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  years: number;
  skills: string[];
  /** Pixel avatar variant used until a real photo is set. */
  avatar: 'lead' | 'design' | 'front' | 'ops';
  /** Optional photo in /public (e.g. "/team/artem.jpg"). */
  photo?: string;
  links: { label: string; href: string }[];
}

export interface Dictionary {
  locale: Locale;
  /** BCP-47 language tag for <html lang> and OG. */
  htmlLang: string;
  ogLocale: string;

  meta: {
    title: string;
    description: string;
  };

  nav: {
    links: { id: string; label: string }[];
    cta: string;
    menu: string;
    close: string;
    language: string;
    skip: string;
    home: string;
  };

  status: {
    available: string;
    localTime: string;
  };

  hero: {
    eyebrow: string;
    /** Each string is a line; wrap a fragment in *asterisks* to dim it. */
    title: string[];
    lead: string;
    primary: string;
    secondary: string;
    note: string;
    stats: Stat[];
    scene: {
      label: string;
      live: string;
      city: string;
      hint: string;
    };
  };

  clients: {
    label: string;
    items: string[];
  };

  services: SectionHead & {
    items: { icon: IconName; title: string; text: string; tags: string[] }[];
  };

  work: SectionHead & {
    open: string;
    nda: string;
    labels: {
      client: string;
      year: string;
      services: string;
      stack: string;
      duration: string;
      industry: string;
    };
    items: CaseStudy[];
  };

  why: SectionHead & {
    items: { icon: IconName; title: string; text: string }[];
  };

  process: SectionHead & {
    steps: { title: string; time: string; text: string }[];
  };

  pricing: SectionHead & {
    from: string;
    popular: string;
    cta: string;
    note: string;
    plans: {
      name: string;
      text: string;
      price: string;
      unit?: string;
      features: string[];
      featured?: boolean;
    }[];
  };

  team: SectionHead & {
    experience: (years: number) => string;
    members: TeamMember[];
  };

  testimonials: SectionHead & {
    items: { text: string; author: string; role: string; company: string }[];
  };

  stack: SectionHead & {
    prompt: string;
    command: string;
    groups: { name: string; items: string[] }[];
  };

  faq: SectionHead & {
    items: { q: string; a: string }[];
  };

  contact: SectionHead & {
    steps: { title: string; text: string }[];
    direct: string;
    book: string;
    hours: string;
    form: {
      name: string;
      namePh: string;
      contact: string;
      contactPh: string;
      company: string;
      companyPh: string;
      type: string;
      types: string[];
      budget: string;
      budgets: string[];
      message: string;
      messagePh: string;
      nda: string;
      submit: string;
      sending: string;
      consent: string;
      consentLink: string;
      success: string;
      successText: string;
      error: string;
      required: string;
      invalid: string;
      mailSubject: string;
      mailFallback: string;
    };
  };

  footer: {
    tagline: string;
    nav: string;
    contacts: string;
    social: string;
    legal: string;
    privacy: string;
    rights: string;
    top: string;
    clock: { night: string; day: string };
  };

  caseStudy: {
    back: string;
    challenge: string;
    solution: string;
    results: string;
    stack: string;
    next: string;
    cta: string;
    ctaText: string;
  };

  privacy: {
    title: string;
    updated: string;
    sections: { title: string; text: string[] }[];
  };

  notFound: {
    title: string;
    text: string;
    back: string;
  };
}
