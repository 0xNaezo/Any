/**
 * All copy and studio details for the site live here.
 *
 * Everything below is placeholder content written to show the layout —
 * replace names, numbers, clients and quotes with real ones before launch.
 * (Testimonials, client logos and metrics in particular must be genuine.)
 */

export const studio = {
  name: 'Nightloom',
  legalName: 'Nightloom Studio LLC',
  tagline: 'Software, woven to last.',
  description:
    'Nightloom is an independent studio of four senior engineers. We design, build and run web platforms, mobile apps and the infrastructure beneath them.',
  url: 'https://nightloom.dev',
  founded: 2019,
  email: 'hello@nightloom.dev',
  telegram: { handle: '@nightloom', url: 'https://t.me/nightloom' },
  calendar: 'https://cal.com/nightloom/intro',
  location: 'Remote · Europe',
  /** IANA zone used for the live clock and the "will we reply today?" hint. */
  timeZone: 'Europe/Istanbul',
  timeZoneLabel: 'UTC+3',
  /** Working hours in the studio's time zone (24h). */
  workingHours: { start: 10, end: 19 },
  availability: {
    open: true,
    label: 'Booking Q1 2027',
    detail: 'Two project slots open for Q1 2027',
  },
  /** Where contact-form submissions are POSTed (e.g. a Formspree or Web3Forms endpoint).
   *  Leave empty to fall back to opening the visitor's mail client. */
  formEndpoint: '',
  social: [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { label: 'X / Twitter', url: 'https://x.com/' },
    { label: 'Dribbble', url: 'https://dribbble.com/' },
  ],
  legal: {
    registration: 'Reg. no. 000000000',
    address: 'Street 00, City, Country',
  },
} as const;

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'Team', href: '/#team' },
  { label: 'FAQ', href: '/#faq' },
] as const;

export const hero = {
  eyebrow: 'Independent engineering studio',
  // Rendered as: Software, woven <em>to last.</em>
  title: { lead: 'Software, woven', emphasis: 'to last.' },
  lede: 'We are four senior engineers who design, build and run web platforms, mobile apps and the infrastructure beneath them — for founders and product teams who need it done right the first time.',
  primaryCta: { label: 'Start a project', href: '#contact' },
  secondaryCta: { label: 'See selected work', href: '#work' },
  facts: [
    { label: 'Studio', value: 'Est. 2019 — four people' },
    { label: 'Focus', value: 'Web, mobile, infrastructure' },
    { label: 'Clients', value: 'Startups to enterprise, 14 countries' },
  ],
};

// PLACEHOLDER: fictional clients — swap for real logos (SVG) or remove the strip.
export const clients = ['Ledgerline', 'Harbor Health', 'Fieldnote', 'Orbital', 'Atelier Nord', 'Kestrel Labs'] as const;

export const about = {
  index: '01',
  label: 'Studio',
  statement:
    'We are four people who have shipped software together since 2019. No account managers, no juniors learning on your budget, no hand-offs. You talk directly to the engineers who design, write and maintain your product — and we treat it like our own.',
  principles: [
    {
      title: 'Senior by default',
      text: 'Everyone on your project has seven or more years of production experience. Nobody learns the basics on your budget.',
    },
    {
      title: 'Small on purpose',
      text: 'We take on two or three projects at a time, so yours never waits in a queue behind a bigger client.',
    },
    {
      title: 'Built to be handed over',
      text: 'Readable code, tests and documentation — you are never locked in. Not even to us.',
    },
  ],
  // PLACEHOLDER numbers.
  stats: [
    { value: 7, suffix: '', label: 'years shipping together' },
    { value: 60, suffix: '+', label: 'products launched' },
    { value: 83, suffix: '%', label: 'of clients come back for more' },
    { value: 4.9, suffix: '/5', label: 'average client rating', decimals: 1 },
  ],
};

export const services = {
  index: '02',
  label: 'Services',
  title: { lead: 'End-to-end, or', emphasis: 'exactly the part', tail: 'you need.' },
  lede: 'Bring us an idea, a half-built product or a system that has outgrown itself. We cover the whole path from first sketch to production — or plug into the part where you need senior hands.',
  items: [
    {
      title: 'Product engineering',
      text: 'Web platforms, SaaS and internal tools — from the first commit to production, and everything that keeps it running afterwards.',
      tags: ['Web apps', 'Dashboards', 'APIs', 'Integrations'],
    },
    {
      title: 'Mobile apps',
      text: 'Cross-platform iOS and Android apps that feel native, built from one codebase and released without drama.',
      tags: ['React Native', 'Expo', 'Offline-first', 'Store releases'],
    },
    {
      title: 'Infrastructure & DevOps',
      text: 'Cloud architecture, CI/CD and observability that scale quietly in the background — and cost what they should.',
      tags: ['AWS', 'GCP', 'Kubernetes', 'Terraform'],
    },
    {
      title: 'Product design',
      text: 'Research, UX and interface design by people who also write the code, so what gets designed is what gets shipped.',
      tags: ['UX research', 'Prototypes', 'Design systems'],
    },
    {
      title: 'Audits & rescue',
      text: 'Inherited a codebase that fights back? We audit, stabilise and modernise it — without stopping the business.',
      tags: ['Code review', 'Performance', 'Security', 'Migrations'],
    },
  ],
  toolkit: [
    'TypeScript',
    'React',
    'Next.js',
    'Astro',
    'Node.js',
    'Go',
    'Python',
    'React Native',
    'PostgreSQL',
    'Redis',
    'ClickHouse',
    'Kafka',
    'AWS',
    'GCP',
    'Docker',
    'Kubernetes',
    'Terraform',
    'Figma',
  ],
};

export const work = {
  index: '03',
  label: 'Selected work',
  title: { lead: 'A few projects we’re', emphasis: 'allowed', tail: 'to talk about.' },
  lede: 'Most of what we build sits behind logins and NDAs. Here is a selection we can show — with the numbers our clients agreed to share.',
  // PLACEHOLDER: archive of smaller / NDA-friendly projects.
  archive: [
    { year: 2025, client: 'Kestrel Labs', project: 'Lab inventory & internal tooling', type: 'Web app', stack: 'Next.js · PostgreSQL' },
    { year: 2025, client: 'Atelier Nord', project: 'Headless storefront', type: 'E-commerce', stack: 'Astro · Shopify' },
    { year: 2024, client: 'Monoline', project: 'Design system & component library', type: 'Design', stack: 'Figma · React' },
    { year: 2024, client: 'Parcelpoint', project: 'Courier app for 900 drivers', type: 'Mobile', stack: 'React Native · Go' },
    { year: 2023, client: 'Quill & Co', project: 'CMS migration, 40k pages', type: 'Web', stack: 'Node.js · Sanity' },
    { year: 2023, client: 'Lumen Grid', project: 'Energy monitoring dashboard', type: 'Web / IoT', stack: 'React · TimescaleDB' },
    { year: 2022, client: 'Brightdesk', project: 'Help desk SaaS, v1 to v2', type: 'SaaS', stack: 'TypeScript · AWS' },
    { year: 2021, client: 'Atlas Learning', project: 'Learning platform & apps', type: 'Web / Mobile', stack: 'React · React Native' },
  ],
};

export const process = {
  index: '04',
  label: 'Process',
  title: { lead: 'How a project', emphasis: 'runs.' },
  lede: 'A predictable process with no black boxes. You see working software every week, and you can pause or stop at any milestone.',
  steps: [
    {
      title: 'Discovery',
      duration: '1–2 weeks',
      text: 'We dig into your business, users and constraints, map the risks, and agree on what “done” means.',
      output: 'Scope, architecture outline, fixed estimate',
    },
    {
      title: 'Design',
      duration: '2–4 weeks',
      text: 'Flows, interfaces and a clickable prototype — tested with real users before a line of production code.',
      output: 'Prototype, design system, specs',
    },
    {
      title: 'Build',
      duration: '6–16 weeks',
      text: 'Two-week sprints, a demo every Friday and a staging environment you can click through at any time.',
      output: 'Working software, every week',
    },
    {
      title: 'Launch',
      duration: '~1 week',
      text: 'Load tests, a security review, monitoring and a calm, rehearsed release. No “big bang” Fridays.',
      output: 'Production, dashboards, runbooks',
    },
    {
      title: 'Care',
      duration: 'Ongoing',
      text: 'A 60-day warranty, then optional support with an agreed SLA. We stay reachable long after launch.',
      output: 'Fixes, improvements, monthly reports',
    },
  ],
};

export const commitments = {
  index: '05',
  label: 'Commitments',
  title: { lead: 'What you can', emphasis: 'hold us to.' },
  items: [
    {
      icon: 'seal',
      title: 'NDA before the first call',
      text: 'Your idea stays yours. We sign your NDA — or send ours — before you share a single detail.',
    },
    {
      icon: 'key',
      title: 'You own everything',
      text: 'Code, designs, accounts and IP are yours from day one. Repositories live in your organisation, not ours.',
    },
    {
      icon: 'scale',
      title: 'Estimates that hold',
      text: 'A fixed price for a fixed scope. If something changes, you approve it in writing before it is billed.',
    },
    {
      icon: 'eye',
      title: 'Progress you can see',
      text: 'A live demo every week and a written update every Friday. Working software, not status theatre.',
    },
    {
      icon: 'shield',
      title: '60-day warranty',
      text: 'If something we built breaks after launch, we fix it at no cost. No fine print, no ticket haggling.',
    },
    {
      icon: 'handover',
      title: 'Clean handover',
      text: 'Documentation, runbooks and a recorded walkthrough, so your team can take over at any point.',
    },
  ],
} as const;

export const team = {
  index: '06',
  label: 'Team',
  title: { lead: 'The people you’ll', emphasis: 'actually', tail: 'work with.' },
  lede: 'No bait-and-switch. The four people on this page are the four people on your project — from the first call to the last deploy.',
  // PLACEHOLDER people. Drop photos into /public/team and set `photo: '/team/<file>.jpg'`.
  members: [
    {
      name: 'Lev Arkhipov',
      role: 'Co-founder · Engineering lead',
      years: 12,
      focus: ['Architecture', 'TypeScript', 'Go'],
      bio: 'Former tech lead at a fintech scale-up. Makes the hard technical calls — and keeps them boring.',
      photo: '',
      links: [
        { label: 'GitHub', url: 'https://github.com/' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
      ],
    },
    {
      name: 'Mira Sokol',
      role: 'Co-founder · Product design',
      years: 9,
      focus: ['UX', 'Interfaces', 'Design systems'],
      bio: 'Designs interfaces she can also build. Believes most UX problems are naming problems in disguise.',
      photo: '',
      links: [
        { label: 'Dribbble', url: 'https://dribbble.com/' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
      ],
    },
    {
      name: 'Ilya Varga',
      role: 'Backend & infrastructure',
      years: 11,
      focus: ['Go', 'PostgreSQL', 'Kubernetes'],
      bio: 'Has been paged at 3 a.m. often enough to build systems that never need to page anyone.',
      photo: '',
      links: [
        { label: 'GitHub', url: 'https://github.com/' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
      ],
    },
    {
      name: 'Nika Orlova',
      role: 'Frontend & mobile',
      years: 8,
      focus: ['React', 'React Native', 'Motion'],
      bio: 'Obsessed with the last ten percent: loading states, edge cases and a steady 60 frames per second.',
      photo: '',
      links: [
        { label: 'GitHub', url: 'https://github.com/' },
        { label: 'X / Twitter', url: 'https://x.com/' },
      ],
    },
  ],
};

export const testimonials = {
  index: '07',
  label: 'Testimonials',
  // PLACEHOLDER quotes — publish only real, attributable feedback.
  items: [
    {
      quote:
        'They rebuilt our reconciliation engine without a single minute of downtime — and they were the first vendor who told us what not to build.',
      name: 'Daniel Weiss',
      role: 'CTO',
      company: 'Ledgerline',
    },
    {
      quote:
        'It never felt like working with an agency. It felt like we had hired four senior people who already knew each other. Because we had.',
      name: 'Sara Lindqvist',
      role: 'Head of Product',
      company: 'Harbor Health',
    },
    {
      quote:
        'They challenged our scope in week one and saved us two months. We launched on the exact date they gave us on the first call.',
      name: 'Tomás Ferreira',
      role: 'Founder',
      company: 'Fieldnote',
    },
  ],
};

export const engagement = {
  index: '08',
  label: 'Engagement',
  title: { lead: 'Ways to', emphasis: 'work together.' },
  lede: 'Typical starting points, so you can plan. Every engagement begins with a call; you get a fixed quote after discovery.',
  models: [
    {
      name: 'Fixed-scope project',
      bestFor: 'MVPs and well-defined products',
      price: '$24k',
      priceNote: 'from',
      timeline: '4–12 weeks',
      includes: ['Discovery & fixed estimate', 'Design and development', 'Weekly demos', '60-day warranty'],
      featured: false,
    },
    {
      name: 'Dedicated team',
      bestFor: 'Ongoing product development',
      price: '$16k',
      priceNote: 'from, per month',
      timeline: 'Monthly, 30 days’ notice',
      includes: ['Two to four senior people', 'Your tools and rituals', 'Monthly roadmap planning', 'Priority support'],
      featured: true,
    },
    {
      name: 'Audit & advisory',
      bestFor: 'A second opinion or a rescue plan',
      price: '$4k',
      priceNote: 'from',
      timeline: '1–2 weeks',
      includes: ['Code & architecture review', 'Performance and security check', 'Written report', 'Prioritised roadmap'],
      featured: false,
    },
  ],
};

export const faq = {
  index: '09',
  label: 'FAQ',
  title: { lead: 'Questions, answered', emphasis: 'plainly.' },
  items: [
    {
      q: 'You’re a team of four. Is that enough for our project?',
      a: 'For most products, yes — four senior people move faster than a team of twelve with hand-offs. We cap ourselves at two or three active projects, so you get real attention. If your scope needs more hands, we bring in specialists we have worked with for years, and we tell you upfront.',
    },
    {
      q: 'Who owns the code and the IP?',
      a: 'You do, from the first commit. Repositories, cloud accounts and design files live in your organisation, and the contract assigns all intellectual property to you.',
    },
    {
      q: 'How do you estimate price and timeline?',
      a: 'We start with a short paid discovery, usually one to two weeks. It ends with a scope, an architecture outline and a fixed price. If you decide not to continue, you keep everything we produced.',
    },
    {
      q: 'How will we communicate?',
      a: 'A shared Slack or Telegram channel, a demo every Friday and a written weekly summary. You always talk to the engineers doing the work — there are no account managers in between.',
    },
    {
      q: 'Can you join an existing codebase or team?',
      a: 'Yes — about half of our projects start that way. We begin with a short audit, so we understand the code before we change it.',
    },
    {
      q: 'What happens after launch?',
      a: 'Every project includes a 60-day warranty. After that you can move to a support plan with an agreed SLA, or take it fully in-house with our documentation and a recorded handover.',
    },
    {
      q: 'Which time zones do you work with?',
      a: 'We are based in UTC+3 and overlap comfortably with Europe and the Middle East, and with the US East Coast in the mornings. Most of our clients are in the EU, the UK and the US.',
    },
    {
      q: 'How do payments work?',
      a: 'Fixed-scope projects are split into milestones; dedicated teams are invoiced monthly. We accept bank transfers in USD and EUR.',
    },
  ],
};

export const contact = {
  index: '10',
  label: 'Contact',
  title: { lead: 'Have a project in mind?', emphasis: 'Tell us about it.' },
  lede: 'Share a few details and we will reply within one business day with honest next steps — or book a 30-minute intro call directly.',
  projectTypes: ['Web app', 'Mobile app', 'Infrastructure', 'Product design', 'Audit', 'Not sure yet'],
  budgets: ['< $25k', '$25–50k', '$50–100k', '$100k+', 'Not sure'],
};

export const colophon =
  'Set in Newsreader, Schibsted Grotesk and IBM Plex Mono. Built with Astro and GSAP. No cookies, no trackers.';
