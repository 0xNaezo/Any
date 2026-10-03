/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  NIGHTLOOM — SITE CONTENT
 *  Every piece of copy on the site lives in this file.
 *
 *  Formatting helpers available in most text fields:
 *    *word*   → set in italic serif (e.g. 'Small team. Serious *software.*')
 *    \n       → line break (headlines only)
 *
 *  Everything below is placeholder copy. Before going live, replace it with
 *  real information — especially testimonials, client logos and numbers.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Visual = 'ledger' | 'freight' | 'store' | 'docs';

export interface CaseStudy {
  client: string;
  title: string;
  summary: string;
  year: string;
  industry: string;
  services: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
  /** Built-in illustrated cover. Used when `image` is not set. */
  visual: Visual;
  /** Optional real screenshot, e.g. '/work/ledgerly.webp' (put the file in /public/work). */
  image?: string;
  /** Optional link to the live product or a full case study. */
  href?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  focus: string;
  city: string;
  /** Optional portrait, e.g. '/team/mark.jpg' (put the file in /public/team). Square or 4:5 works best. */
  photo?: string;
  links: { label: string; href: string }[];
}

export const site = {
  name: 'Nightloom',
  legalName: 'Nightloom Studio LLC',
  tagline: 'Software, woven to last.',
  founded: 2018,
  email: 'hello@nightloom.dev',

  meta: {
    title: 'Nightloom — Independent software studio',
    description:
      'Nightloom is a four-person engineering studio. We design, build and maintain web products for founders and teams who care about the details.',
    /** Social preview image in /public. 1200×630. */
    ogImage: '/og.png',
  },

  location: {
    label: 'Remote · Europe',
    city: 'Belgrade',
    /** IANA time zone for the live clock and the "online" indicator. */
    timezone: 'Europe/Belgrade',
    /** Working hours in local time (24h) and working days (1 = Monday … 7 = Sunday). */
    hours: { from: 10, to: 19, days: [1, 2, 3, 4, 5] },
  },

  availability: {
    /** Set to false when you are fully booked — the green dot turns amber. */
    open: true,
    short: 'Booking from Nov 2026',
    long: 'Two project slots open from November 2026',
  },

  links: {
    telegram: { label: '@nightloom', href: 'https://t.me/nightloom' },
    call: { label: 'Book a 30-min call', href: 'https://cal.com/nightloom/intro' },
  },

  socials: [
    { label: 'GitHub', href: 'https://github.com/nightloom' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nightloom' },
    { label: 'Telegram', href: 'https://t.me/nightloom' },
    { label: 'X / Twitter', href: 'https://x.com/nightloom' },
  ],

  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Team', href: '#team' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],

  hero: {
    eyebrow: 'Independent software studio',
    title: 'Small team.\nSerious *software.*',
    lead: 'Nightloom is four senior engineers who design, build and maintain web products — for founders and teams who would rather do it once, and do it right.',
    primary: { label: 'Start a project', href: '#contact' },
    secondary: { label: 'See our work', href: '#work' },
    facts: [
      { label: 'Response time', value: 'Under 24 hours' },
      { label: 'Next opening', value: 'November 2026' },
      { label: 'Working with', value: 'EU · UK · US' },
    ],
  },

  clients: {
    label: 'Trusted by founders and teams at',
    /** Placeholder wordmarks. Replace with real client logos (SVG in /public/clients) — see README. */
    logos: [
      { name: 'Ledgerly', style: 'sans' },
      { name: 'Atlas Freight', style: 'mono' },
      { name: 'Verso', style: 'serif' },
      { name: 'Quill', style: 'serif-italic' },
      { name: 'Northwind', style: 'sans-bold' },
      { name: 'Halcyon', style: 'sans-light' },
      { name: 'Fieldnote', style: 'serif' },
      { name: 'Meridian', style: 'mono' },
      { name: 'Oakline', style: 'sans-bold' },
      { name: 'Parallel', style: 'sans' },
    ] as { name: string; style: 'sans' | 'sans-bold' | 'sans-light' | 'serif' | 'serif-italic' | 'mono'; logo?: string }[],
    rating: { score: '4.9', count: '32 verified reviews', source: 'Clutch', href: 'https://clutch.co' },
  },

  stats: [
    { value: 8, decimals: 0, suffix: '', label: 'Years shipping\ntogether' },
    { value: 60, decimals: 0, suffix: '+', label: 'Products launched\nto production' },
    { value: 4.9, decimals: 1, suffix: '/5', label: 'Average rating\nfrom clients' },
    { value: 92, decimals: 0, suffix: '%', label: 'Of clients come back\nfor a second project' },
  ],

  work: {
    index: '01',
    label: 'Selected work',
    meta: '2024 — 2026',
    title: 'Selected work, *still in production.*',
    lead: 'A few recent projects we can talk about publicly. Most of our work is under NDA — we’re happy to walk you through more of it on a call.',
    cases: [
      {
        client: 'Ledgerly',
        title: 'Cash-flow forecasting for 4,000 small businesses',
        summary:
          'We took Ledgerly from a spreadsheet prototype to a production SaaS: bank integrations, a forecasting engine and a dashboard owners actually open every morning.',
        year: '2025',
        industry: 'Fintech · SaaS',
        services: ['Product design', 'Web app', 'API', 'Infrastructure'],
        metrics: [
          { value: '11 wks', label: 'Kickoff to launch' },
          { value: '−48%', label: 'Time to close the books' },
          { value: '99.99%', label: 'Uptime since launch' },
        ],
        stack: ['Next.js', 'TypeScript', 'Go', 'PostgreSQL', 'AWS'],
        visual: 'ledger',
      },
      {
        client: 'Atlas Freight',
        title: 'Real-time dispatch for a 300-truck fleet',
        summary:
          'A dispatch console and driver app that replaced phone calls and whiteboards: live positions, smart load matching and automatic ETAs for every customer.',
        year: '2025',
        industry: 'Logistics',
        services: ['Platform', 'Mobile app', 'Data pipeline'],
        metrics: [
          { value: '2.1M', label: 'Events processed daily' },
          { value: '−31%', label: 'Empty miles driven' },
          { value: '<1s', label: 'Live position updates' },
        ],
        stack: ['React', 'React Native', 'Node.js', 'Kafka', 'PostGIS'],
        visual: 'freight',
      },
      {
        client: 'Verso',
        title: 'A headless storefront for a design-led furniture brand',
        summary:
          'A rebuild of Verso’s online store on a headless stack, migrated with zero downtime. Faster pages, a CMS the team enjoys and a checkout that converts.',
        year: '2024',
        industry: 'E-commerce',
        services: ['Design', 'Storefront', 'CMS', 'Migration'],
        metrics: [
          { value: '+38%', label: 'Conversion rate' },
          { value: '0.9s', label: 'Largest contentful paint' },
          { value: '−60%', label: 'Hosting costs' },
        ],
        stack: ['Astro', 'Shopify', 'Sanity', 'Vercel'],
        visual: 'store',
      },
      {
        client: 'Quill',
        title: 'AI contract review for a legal-tech startup',
        summary:
          'An LLM pipeline that reads contracts, flags risky clauses and drafts redlines — with citations, evaluation suites and a cost per document that makes the business work.',
        year: '2026',
        industry: 'AI · Legal tech',
        services: ['AI engineering', 'Web app', 'Evaluation'],
        metrics: [
          { value: '6 wks', label: 'Prototype to paid pilot' },
          { value: '12k', label: 'Documents reviewed daily' },
          { value: '94%', label: 'Clause recall on eval set' },
        ],
        stack: ['Python', 'FastAPI', 'React', 'pgvector', 'LLM APIs'],
        visual: 'docs',
      },
    ] as CaseStudy[],
  },

  testimonials: {
    label: 'In their words',
    /** IMPORTANT: placeholder quotes. Only publish real testimonials, with the client’s permission. */
    featured: {
      quote:
        'Nightloom felt less like an agency and more like the senior team we couldn’t afford to hire yet. They pushed back when we were wrong, shipped every Friday and handed over a codebase our new engineers actually enjoy working in.',
      name: 'Sarah Lindqvist',
      role: 'Co-founder & CEO',
      company: 'Ledgerly',
    },
    items: [
      {
        quote: 'We’ve worked with six agencies over the years. Nightloom is the first one where I never had to chase anyone for an update.',
        name: 'Marcus Hale',
        role: 'COO',
        company: 'Atlas Freight',
      },
      {
        quote: 'They rebuilt our store in eight weeks without a minute of downtime. Conversion is up, the hosting bill is down, and the site finally feels like us.',
        name: 'Ana Ferreira',
        role: 'Head of Digital',
        company: 'Verso',
      },
      {
        quote: 'The rare team that tells you what not to build. Their audit saved us from a rewrite we didn’t need.',
        name: 'Tom Becker',
        role: 'CTO',
        company: 'Fieldnote',
      },
    ],
  },

  services: {
    index: '02',
    label: 'Services',
    meta: 'Design · Engineering · Operations',
    title: 'End to end, or *exactly the part you need.*',
    lead: 'We’re at our best owning a product end to end — from the first sketch to the production pager. We’re just as comfortable plugging into your team.',
    items: [
      {
        title: 'Product engineering',
        text: 'Web apps and SaaS platforms, from first commit to production. We own the architecture and the unglamorous, critical parts: auth, billing, permissions, observability.',
        tags: ['MVPs', 'SaaS platforms', 'Dashboards', 'Internal tools'],
      },
      {
        title: 'Design engineering',
        text: 'Interfaces designed and built by the same people, so nothing gets lost in hand-off. Product UI, design systems and marketing sites that are fast and accessible.',
        tags: ['Product design', 'Design systems', 'Websites', 'Accessibility'],
      },
      {
        title: 'Backend & infrastructure',
        text: 'APIs, integrations and data pipelines that stay up under load. Cloud setup, CI/CD, monitoring and a hosting bill that makes sense.',
        tags: ['APIs', 'Integrations', 'Cloud & DevOps', 'Data'],
      },
      {
        title: 'AI features',
        text: 'Practical LLM features that ship: search, assistants, document processing and automations — with evaluations, guardrails and unit economics in mind.',
        tags: ['LLM apps', 'RAG', 'Agents', 'Automation'],
      },
      {
        title: 'Audits & rescue',
        text: 'Inherited a codebase that scares you? We audit, stabilise and modernise it — or tell you honestly when a rewrite is the cheaper option.',
        tags: ['Code review', 'Performance', 'Security', 'Migrations'],
      },
    ],
    stack: {
      label: 'Toolbox',
      note: 'Boring where it matters, modern where it pays off.',
      groups: [
        { title: 'Frontend', items: ['TypeScript', 'React', 'Next.js', 'Astro', 'React Native', 'Tailwind CSS'] },
        { title: 'Backend', items: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis', 'GraphQL'] },
        { title: 'Infrastructure', items: ['AWS', 'Cloudflare', 'Vercel', 'Docker', 'Kubernetes', 'Terraform'] },
        { title: 'Quality', items: ['Playwright', 'Vitest', 'Sentry', 'OpenTelemetry', 'GitHub Actions', 'Grafana'] },
      ],
    },
  },

  process: {
    index: '03',
    label: 'Process',
    meta: 'Six steps · No black boxes',
    title: 'How a project *runs.*',
    lead: 'The same six steps every time, so you always know what’s happening, what’s next and what it costs.',
    steps: [
      {
        title: 'Intro call',
        text: 'Thirty minutes, free. We listen, ask the awkward questions and tell you honestly whether we’re the right fit — or who would be.',
        duration: 'Day 1',
        output: 'Honest first take',
      },
      {
        title: 'Scope & proposal',
        text: 'A written proposal with scope, milestones, timeline and a fixed price. No “it depends”, no hourly meter running in the background.',
        duration: '3–5 days',
        output: 'Fixed quote',
      },
      {
        title: 'Design',
        text: 'Wireframes first, then high-fidelity screens and a clickable prototype you can put in front of real users before we write production code.',
        duration: '1–3 weeks',
        output: 'Clickable prototype',
      },
      {
        title: 'Build',
        text: 'Weekly sprints with a live staging link from week one, a demo every Friday and a short written update every Monday.',
        duration: '4–12 weeks',
        output: 'Weekly demos',
      },
      {
        title: 'Launch',
        text: 'Load-tested, monitored and documented. We run the release ourselves and stay on call through launch week.',
        duration: '1 week',
        output: 'Production release',
      },
      {
        title: 'Support',
        text: 'Every project comes with a 30-day warranty. After that: an optional retainer, or a clean handover to your own team.',
        duration: 'Ongoing',
        output: 'Docs & handover',
      },
    ],
  },

  principles: {
    index: '04',
    label: 'Commitments',
    meta: 'Written into every contract',
    title: 'We don’t ghost.',
    aside: 'The only ghost on this team is the one in our logo. Here’s what you can count on instead.',
    items: [
      {
        icon: 'reply',
        title: 'Replies within one business day',
        text: 'Usually within hours. You get a direct line to the engineers doing the work — never an account manager.',
      },
      {
        icon: 'key',
        title: 'You own everything',
        text: 'Code, designs, infrastructure and accounts are yours from day one. Your repositories, your cloud, your keys.',
      },
      {
        icon: 'price',
        title: 'Fixed prices, honest estimates',
        text: 'Fixed scope means a fixed price. If something changes, you get a written estimate before any work starts.',
      },
      {
        icon: 'people',
        title: 'Senior engineers only',
        text: 'The people on the call are the people writing the code. We never subcontract or quietly hand work to juniors.',
      },
      {
        icon: 'handover',
        title: 'Built to be handed over',
        text: 'Tests, documentation, CI/CD and readable code. Any competent team can pick it up — including yours.',
      },
      {
        icon: 'shield',
        title: '30-day warranty',
        text: 'Find a bug in our work after launch and we fix it, free of charge. No fine print, no “that’s a new feature”.',
      },
    ] as { icon: 'reply' | 'key' | 'price' | 'people' | 'handover' | 'shield'; title: string; text: string }[],
  },

  team: {
    index: '05',
    label: 'Team',
    meta: '4 people · 0 middlemen',
    title: 'Four people. *No middlemen.*',
    lead: 'We’ve worked together since 2018 across fintech, logistics, e-commerce and AI. Everyone is senior, everyone ships, and you talk to all of us directly.',
    members: [
      {
        name: 'Mark Orlov',
        role: 'Founder · Lead engineer',
        experience: '12 years',
        focus: 'Architecture, backend, the hard conversations',
        city: 'Belgrade',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
      {
        name: 'Elena Novak',
        role: 'Design engineer',
        experience: '9 years',
        focus: 'Interfaces, design systems, motion',
        city: 'Lisbon',
        links: [
          { label: 'Dribbble', href: 'https://dribbble.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
      {
        name: 'Daniel Reis',
        role: 'Infrastructure engineer',
        experience: '11 years',
        focus: 'Cloud, databases, reliability, cost',
        city: 'Warsaw',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
      {
        name: 'Ivan Sorokin',
        role: 'Full-stack engineer',
        experience: '8 years',
        focus: 'Product features, AI integrations',
        city: 'Tbilisi',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
    ] as TeamMember[],
    facts: [
      { value: '40 yrs', label: 'Combined experience' },
      { value: '4 / 4', label: 'Engineers who write code daily' },
      { value: '2', label: 'Projects at a time, max' },
      { value: '0', label: 'Account managers' },
    ],
  },

  pricing: {
    index: '06',
    label: 'Engagement',
    meta: 'Prices in USD',
    title: 'Clear pricing. *No surprises.*',
    lead: 'Three ways to work with us. Every engagement starts with a free intro call and a written, fixed quote.',
    plans: [
      {
        name: 'Project',
        price: '$18k',
        period: 'from',
        description: 'For new products, MVPs and redesigns with a clear goal.',
        duration: '6–14 weeks',
        features: ['Discovery & written spec', 'Design & clickable prototype', 'Development, QA & launch', '30-day warranty'],
        cta: 'Plan a project',
        featured: false,
      },
      {
        name: 'Dedicated team',
        price: '$14k',
        period: 'from / month',
        description: 'For ongoing product work. A senior team that plugs into your roadmap.',
        duration: 'Monthly, rolling',
        features: ['2–4 engineers, part- or full-time', 'Weekly planning & demos', 'Shared Slack and tracker', 'Cancel with 30 days’ notice'],
        cta: 'Talk about a team',
        featured: true,
      },
      {
        name: 'Audit sprint',
        price: '$3.5k',
        period: 'fixed',
        description: 'For existing products that need a second opinion or a rescue plan.',
        duration: '1–2 weeks',
        features: ['Code & architecture review', 'Performance & security audit', 'Prioritised action plan', '90-minute walkthrough call'],
        cta: 'Book an audit',
        featured: false,
      },
    ],
    featuredLabel: 'Most chosen',
    note: 'Prices exclude VAT. Projects are invoiced in three milestones (30 / 40 / 30); retainers monthly in advance.',
  },

  faq: {
    index: '07',
    label: 'FAQ',
    meta: 'Straight answers',
    title: 'Questions, *answered.*',
    lead: 'Didn’t find yours? Ask us directly — a real person replies within a day.',
    items: [
      {
        q: 'How much does a typical project cost?',
        a: 'Most of our projects land between $20k and $80k. Small, well-defined scopes can start lower, and long-term work is billed monthly. You get a fixed quote after a free intro call — before you commit to anything.',
      },
      {
        q: 'How soon can you start?',
        a: 'We take on at most two projects at a time, so each one gets our full attention. Our next opening is in November 2026. Audit sprints can usually start within a week.',
      },
      {
        q: 'Who owns the code and the IP?',
        a: 'You do — fully, and from day one. Everything lives in your repositories and your cloud accounts, and an IP assignment clause is part of every contract.',
      },
      {
        q: 'Will you sign an NDA?',
        a: 'Of course. Send yours before the first call, or we can use our standard mutual NDA.',
      },
      {
        q: 'What if the scope changes along the way?',
        a: 'It usually does, and that’s fine. We estimate every change in writing before doing the work, so you decide what’s worth it. No surprise invoices.',
      },
      {
        q: 'How do we communicate day to day?',
        a: 'A shared Slack or Telegram channel, a demo call every Friday and a written update every Monday. You can message any of us directly — there are no account managers in between.',
      },
      {
        q: 'What happens after launch?',
        a: 'Every project includes a 30-day warranty. After that you can keep us on a monthly retainer, or we hand over documentation, credentials and a recorded walkthrough to your team.',
      },
      {
        q: 'Can you take over an existing codebase?',
        a: 'Yes, and we do it often. We start with a paid audit sprint, so you get an honest picture of the code before committing to anything bigger.',
      },
      {
        q: 'Which time zones do you work in?',
        a: 'We’re spread across Central and Eastern Europe (UTC+1 to UTC+4), which overlaps comfortably with the UK, the EU and the US East Coast.',
      },
      {
        q: 'Do you work with agencies?',
        a: 'Yes, as a white-label engineering partner. We’re happy to stay invisible — we are ghosts, after all.',
      },
    ],
  },

  contact: {
    index: '08',
    label: 'Contact',
    meta: 'Reply within 1 business day',
    title: 'Have a project *in mind?*',
    lead: 'Tell us a little about it. One of us — not a sales rep — will reply within one business day, usually much sooner.',
    form: {
      /**
       * Where the form is sent. Works with Formspree ('https://formspree.io/f/xxxx'),
       * Web3Forms ('https://api.web3forms.com/submit' + accessKey) or your own endpoint
       * (see integrations/telegram-worker.js). Leave empty to fall back to an email draft.
       */
      endpoint: '',
      /** Web3Forms access key (only if you use Web3Forms). */
      accessKey: '',
      needs: ['New product', 'Existing product', 'Website', 'AI features', 'Audit', 'Something else'],
      budgets: ['Under $20k', '$20–50k', '$50–100k', '$100k+', 'Not sure yet'],
      success: {
        title: 'Thank you — it’s with us.',
        text: 'A real person will read it and reply by {day}. Keep an eye on your inbox.',
      },
    },
    next: {
      label: 'What happens next',
      steps: [
        'We read your message and reply within one business day.',
        'A 30-minute intro call to understand the problem.',
        'A written proposal with a fixed price, within a week.',
      ],
    },
  },

  footer: {
    colophon: 'Set in Geist & Instrument Serif. Built with Astro and GSAP. No cookies, no trackers.',
    legal: 'Reg. No. 00000000 · VAT 000000000',
  },

  notFound: {
    title: 'This page *ghosted you.*',
    text: 'We never would. The page you’re looking for doesn’t exist or has moved.',
    cta: 'Back to the homepage',
  },
};

export type Site = typeof site;
