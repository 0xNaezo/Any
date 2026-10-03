export type Locale = 'en' | 'ru';

/**
 * Strings marked "html" may contain <em>…</em> (rendered in italic serif)
 * and <br>. Everything else is plain text.
 */
type Html = string;

export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  /** One line under the client name. */
  title: string;
  year: string;
  tags: string[];
  /** Headline result shown on the card. */
  metric: Metric;
  /** Built-in illustration. Replace with `image` once you have real screenshots. */
  art: 'halcyon' | 'lumen' | 'morrow' | 'arcwell';
  /** Path inside /public, e.g. "/work/halcyon.jpg" (5:4, at least 1600 px wide). */
  image?: string;
  /** Live product URL, shown in the case panel. */
  url?: string;
  summary: string;
  challenge: string;
  approach: string;
  results: Metric[];
  stack: string[];
  duration: string;
  team: string;
}

export interface Member {
  name: string;
  role: string;
  years: string;
  bio: string;
  /** Each of us is a different weave — used until a photo is set. */
  weave: 'twill' | 'herringbone' | 'diamond' | 'houndstooth';
  /** Path inside /public, e.g. "/team/mark.jpg" (4:5 portrait). */
  photo?: string;
  links: { label: string; href: string }[];
}

export interface Content {
  locale: Locale;
  /** Value for the <html lang> attribute and Open Graph locale. */
  htmlLang: string;
  ogLocale: string;

  meta: { title: string; description: string };
  a11y: {
    skip: string;
    home: string;
    menuOpen: string;
    menuClose: string;
    language: string;
    canvas: string;
    close: string;
  };

  nav: {
    links: { href: string; label: string }[];
    cta: string;
    availability: string;
  };

  hero: {
    eyebrow: string;
    location: string;
    title: Html;
    lede: string;
    primary: string;
    secondary: string;
    clientsLabel: string;
    scroll: string;
  };

  loom: {
    label: string;
    chapters: { kicker: string; title: Html; text: string }[];
    hud: { card: string; weaving: string; woven: string; warp: string; weft: string };
  };

  work: {
    label: string;
    aside: string;
    title: Html;
    intro: string;
    open: string;
    labels: {
      challenge: string;
      approach: string;
      results: string;
      stack: string;
      duration: string;
      team: string;
      year: string;
      visit: string;
      discuss: string;
    };
    items: CaseStudy[];
    note: string;
  };

  services: {
    label: string;
    title: Html;
    intro: string;
    /** Prefilled into the contact form when a service is clicked. {item} is replaced. */
    prefill: string;
    items: { title: string; text: string; tags: string[] }[];
  };

  process: {
    label: string;
    title: Html;
    intro: string;
    steps: { title: string; duration: string; text: string; deliverables: string[] }[];
  };

  principles: {
    label: string;
    title: Html;
    stats: { value: number; decimals?: number; prefix?: string; suffix?: string; label: string }[];
    items: { title: string; text: string }[];
  };

  team: {
    label: string;
    title: Html;
    intro: string;
    experience: string;
    /** Names of the weaves used for the placeholder portraits. */
    weaves: Record<Member['weave'], string>;
    members: Member[];
    note: string;
  };

  testimonials: {
    label: string;
    prev: string;
    next: string;
    items: { quote: string; name: string; role: string; company: string }[];
  };

  engagement: {
    label: string;
    title: Html;
    intro: string;
    popular: string;
    /** Prefilled into the contact form when a plan is chosen. {item} is replaced. */
    prefill: string;
    plans: {
      name: string;
      tagline: string;
      price: string;
      period: string;
      text: string;
      features: string[];
      cta: string;
      featured?: boolean;
    }[];
    note: string;
  };

  faq: {
    label: string;
    title: Html;
    asideTitle: string;
    asideText: string;
    asideCta: string;
    items: { q: string; a: string }[];
  };

  contact: {
    label: string;
    title: Html;
    intro: string;
    form: {
      name: string;
      email: string;
      company: string;
      optional: string;
      budget: string;
      budgets: string[];
      message: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      privacy: string;
      successTitle: string;
      successText: string;
      mailtoTitle: string;
      mailtoText: string;
      error: string;
      again: string;
      required: string;
      invalidEmail: string;
      tooShort: string;
      subject: string;
    };
    direct: {
      title: string;
      email: string;
      telegram: string;
      call: string;
      callText: string;
      copy: string;
      copied: string;
    };
    next: { title: string; steps: string[] };
  };

  footer: {
    tagline: string;
    columns: { studio: string; contact: string; elsewhere: string };
    localTime: string;
    moon: string;
    phases: [string, string, string, string, string, string, string, string];
    top: string;
    rights: string;
    privacy: string;
  };

  /**
   * The privacy page. In paragraphs, {company}, {address}, {registration} and {email}
   * are filled in from site.config.ts ({email} becomes a link).
   */
  privacy: {
    meta: { title: string; description: string };
    label: string;
    title: Html;
    updated: string;
    intro: string;
    sections: { title: string; text: string[] }[];
    questions: string;
  };

  notFound: { title: Html; text: string; back: string };
}
