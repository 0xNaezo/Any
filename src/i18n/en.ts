import type { Dictionary } from './types';

/**
 * English version of the site (served at "/en/").
 * Every text, number, case study, review and name below is PLACEHOLDER content —
 * replace it with real data before going live (reviews, clients and numbers must be true).
 */

const en: Dictionary = {
  locale: 'en',
  htmlLang: 'en',
  ogLocale: 'en_US',

  meta: {
    title: 'Nightloom — web, mobile & backend development studio',
    description:
      'A team of four senior engineers. We design, build and maintain web platforms, mobile apps and backends. Fixed estimates, weekly demos, and you own the code.',
  },

  nav: {
    links: [
      { id: 'services', label: 'Services' },
      { id: 'work', label: 'Work' },
      { id: 'process', label: 'Process' },
      { id: 'team', label: 'Team' },
      { id: 'faq', label: 'FAQ' },
    ],
    cta: 'Start a project',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
    skip: 'Skip to content',
    home: 'Nightloom — home',
  },

  status: {
    available: 'Booking projects from November',
    localTime: 'Our local time',
  },

  hero: {
    eyebrow: 'Independent development studio',
    title: ['Software that', 'keeps working', '*while you sleep.*'],
    lead: 'Nightloom is a team of four senior engineers. We design, build and maintain web platforms, mobile apps and backends for startups and established businesses. Fixed estimates, weekly demos, and every line of code is yours.',
    primary: 'Start a project',
    secondary: 'See our work',
    note: 'Reply within 24 hours · NDA on request',
    stats: [
      { value: 40, suffix: '+', label: 'products in production' },
      { value: 6, label: 'years working as one team' },
      { value: 92, suffix: '%', label: 'of clients come back with new work' },
      { value: 24, prefix: '<', suffix: 'h', label: 'response time to new requests' },
    ],
    scene: {
      label: 'NL-01 / GHOST.SYS',
      live: 'Online',
      city: 'Saint Petersburg',
      hint: 'Click the ghost',
    },
  },

  clients: {
    label: 'Trusted by',
    items: ['Finora', 'Cargoline', 'Mellow', 'Kofeyna', 'Northwind Labs', 'Atlas Freight', 'Polaris', 'Brightloop', 'Volna', 'Helix Pay'],
  },

  services: {
    label: 'Services',
    title: 'We build the whole product — or level up your team',
    lead: 'From the first prototype to high-load production. Hire us as a turnkey contractor or as a dedicated team inside your own process.',
    items: [
      {
        icon: 'web',
        title: 'Web applications',
        text: 'SaaS platforms, client portals, CRMs and internal tools. Fast interfaces, thoughtful UX, SEO and accessibility built in.',
        tags: ['TypeScript', 'React', 'Next.js'],
      },
      {
        icon: 'server',
        title: 'Backend & APIs',
        text: 'APIs, payment, CRM and ERP integrations, queues and microservices — designed to scale from day one.',
        tags: ['Node.js', 'Go', 'PostgreSQL'],
      },
      {
        icon: 'mobile',
        title: 'Mobile apps',
        text: 'Cross-platform iOS and Android apps: one codebase, native performance and end-to-end store releases.',
        tags: ['React Native', 'Flutter'],
      },
      {
        icon: 'chat',
        title: 'Telegram Mini Apps',
        text: 'Stores, booking flows and loyalty programs right inside Telegram — with payments, notifications and an admin panel.',
        tags: ['Bot API', 'Mini Apps', 'Payments'],
      },
      {
        icon: 'pen',
        title: 'UI/UX design',
        text: 'Research, prototypes and design systems. Our designer works hand in hand with engineering — designs that actually ship.',
        tags: ['Figma', 'Design systems'],
      },
      {
        icon: 'gear',
        title: 'DevOps & support',
        text: 'CI/CD, cloud infrastructure, 24/7 monitoring and SLAs. We also take over existing products — after an audit.',
        tags: ['Docker', 'Kubernetes', 'AWS'],
      },
    ],
  },

  work: {
    label: 'Work',
    title: 'Selected projects',
    lead: 'A few projects we can talk about publicly. The rest are under NDA — happy to walk you through them on a call.',
    open: 'Read case study',
    nda: '30+ more projects under NDA — ask us on a call',
    labels: {
      client: 'Client',
      year: 'Year',
      services: 'What we did',
      stack: 'Stack',
      duration: 'Timeline',
      industry: 'Industry',
    },
    items: [
      {
        slug: 'finora',
        name: 'Finora',
        kind: 'B2B payments & reconciliation platform',
        client: 'Finora Ltd.',
        industry: 'Fintech',
        year: '2025',
        duration: '7 months',
        services: ['Audit', 'Architecture', 'Web platform', 'API'],
        summary:
          'We moved a monolith to a modular architecture with zero downtime and rebuilt the dashboard used daily by 12,000 companies.',
        metrics: [
          { value: '−63%', label: 'reconciliation time' },
          { value: '99.98%', label: 'uptime over a year' },
          { value: '×3.4', label: 'faster reports' },
        ],
        stack: ['Next.js', 'Go', 'PostgreSQL', 'ClickHouse', 'Kubernetes'],
        mockup: 'dashboard',
        challenge: [
          'Finora outgrew its MVP faster than its architecture. Reports took minutes, releases shipped once a month, and every change to payments broke something next to it.',
          'Downtime was not an option: thousands of client payments go through the platform every day.',
        ],
        solution: [
          'We started with a two-week audit and a risk map, then carved payments, reconciliation and reporting out into Go services step by step — a strangler-fig migration, not a big-bang rewrite.',
          'Analytics moved to ClickHouse, CI/CD got canary releases, and the dashboard was rebuilt in Next.js on a new design system.',
        ],
        results: [
          'Reconciliation time dropped by 63%, reports render 3.4× faster.',
          'Releases ship several times a week instead of monthly, with 99.98% uptime over the year.',
          'The client’s in-house team joined development a month after the documentation handover.',
        ],
        quote: {
          text: 'We were afraid to touch the core of the platform. Nightloom migrated it so smoothly our customers noticed nothing — except that everything got faster.',
          author: 'Alex G.',
          role: 'CTO, Finora',
        },
      },
      {
        slug: 'cargoline',
        name: 'Cargoline',
        kind: 'Dispatch system for logistics',
        client: 'Cargoline',
        industry: 'Logistics',
        year: '2024',
        duration: '12 weeks to launch',
        services: ['Product design', 'Web dashboard', 'Mobile app', 'Backend'],
        summary:
          'A dispatch dashboard and a driver app for 300+ drivers: live routes, e-waybills and automatic order assignment.',
        metrics: [
          { value: '−18%', label: 'fleet mileage' },
          { value: '300+', label: 'drivers on the app' },
          { value: '12 wks', label: 'from kickoff to launch' },
        ],
        stack: ['React', 'React Native', 'Node.js', 'PostGIS', 'Redis'],
        mockup: 'logistics',
        challenge: [
          'Dispatchers assigned orders by hand in spreadsheets and messengers. Drivers lost waybills, and customers learned about delays after the fact.',
        ],
        solution: [
          'We designed one system: a dispatcher dashboard with a live map and auto-assignment, plus an offline-first driver app with electronic waybills.',
          'Routes are optimized on the backend around delivery windows and vehicle load, and customers get status updates automatically.',
        ],
        results: [
          'Fleet mileage went down 18%; assigning an order now takes 40 seconds instead of 15 minutes.',
          'Launched 12 weeks after kickoff; we keep evolving the product under an SLA.',
        ],
      },
      {
        slug: 'mellow',
        name: 'Mellow',
        kind: 'Online therapy app',
        client: 'Mellow Health',
        industry: 'Healthcare',
        year: '2024',
        duration: '5 months',
        services: ['UX research', 'Design', 'iOS & Android', 'Backend'],
        summary:
          'A mobile app for online sessions with therapists: matching, video sessions, scheduling and subscriptions.',
        metrics: [
          { value: '4.8★', label: 'store rating' },
          { value: '120k', label: 'installs in year one' },
          { value: '+35%', label: 'day-30 retention' },
        ],
        stack: ['Flutter', 'NestJS', 'WebRTC', 'PostgreSQL', 'Stripe'],
        mockup: 'mobile',
        challenge: [
          'Users would trust this app with their most personal conversations: it needed airtight data security, gentle UX and stable video even on poor connections.',
        ],
        solution: [
          'We interviewed clients and therapists, then built and tested a prototype before writing production code. WebRTC video with adaptive quality, encrypted data and in-store subscriptions.',
        ],
        results: [
          '4.8 rating on the App Store and Google Play, 120,000 installs in the first year.',
          'Day-30 retention grew 35% after the onboarding redesign.',
        ],
        quote: {
          text: 'They cared about our users more than we did. Every interface decision was backed by data.',
          author: 'Kate M.',
          role: 'Founder, Mellow',
        },
      },
      {
        slug: 'kofeyna',
        name: 'Kofeyna',
        kind: 'Pre-orders & loyalty in Telegram',
        client: 'Kofeyna coffee chain',
        industry: 'Retail & hospitality',
        year: '2025',
        duration: '6-week MVP',
        services: ['Telegram Mini App', 'POS integration', 'Admin panel'],
        summary:
          'A Mini App for a chain of 40 coffee shops: order ahead, pay in two taps and collect points without plastic cards.',
        metrics: [
          { value: '28%', label: 'of orders via the Mini App' },
          { value: '−40 s', label: 'waiting time at the counter' },
          { value: '6 wks', label: 'to MVP launch' },
        ],
        stack: ['Telegram Mini Apps', 'React', 'Go', 'PostgreSQL'],
        mockup: 'telegram',
        challenge: [
          'Peak hours meant long queues, and a paper-card loyalty program gave the chain zero data about its guests.',
        ],
        solution: [
          'We built a Telegram Mini App: a menu with modifiers, order-ahead pickup times, payments and loyalty points — integrated with the POS, plus an admin panel for store managers.',
        ],
        results: [
          '28% of orders now go through the Mini App, and waiting time at the counter dropped by 40 seconds.',
          'The chain now has a base of 60,000 guests with full order history.',
        ],
      },
    ],
  },

  why: {
    label: 'Why us',
    title: 'Reliability is a process, not a promise',
    lead: 'We are a small team, so we are personally accountable for the outcome. These are the rules we follow with every client.',
    items: [
      {
        icon: 'rank',
        title: 'Senior people only',
        text: 'The people you meet on the first call are the people who build your product. No juniors, no hidden subcontractors.',
      },
      {
        icon: 'doc',
        title: 'Fixed estimates',
        text: 'A detailed estimate before we start. If we got the estimate wrong, that is our risk — not your budget.',
      },
      {
        icon: 'key',
        title: 'You own everything',
        text: 'Repositories, accounts and IP belong to you from day one. No vendor lock-in, ever.',
      },
      {
        icon: 'eye',
        title: 'Transparent every week',
        text: 'Friday demos, access to the tracker and repo, and a short report: what is done, what is next, and what the risks are.',
      },
      {
        icon: 'shield',
        title: '3-month warranty',
        text: 'We fix bugs for free for three months after launch. After that — support under a clear SLA.',
      },
      {
        icon: 'lock',
        title: 'Contracts & NDA',
        text: 'A proper contract, an NDA and invoices. You pay in milestones — after each one is accepted.',
      },
    ],
  },

  process: {
    label: 'Process',
    title: 'From the first call to release — no surprises',
    lead: 'Six steps every project goes through. At each one you know exactly what is happening and what it costs.',
    steps: [
      {
        title: 'Intro call',
        time: '30 min · free',
        text: 'We discuss goals and constraints. If we are not the best fit, we will say so honestly and suggest who is.',
      },
      {
        title: 'Estimate & plan',
        time: '2–4 days',
        text: 'Breakdown, architecture, budget and timeline. The document stays with you — take it to any vendor you like.',
      },
      {
        title: 'Design & prototype',
        time: '1–3 weeks',
        text: 'User flows, a clickable prototype and a design system — agreed before the first line of code.',
      },
      {
        title: 'Development',
        time: '2-week sprints',
        text: 'Weekly demos, a staging environment, automated tests and code review. You see progress in real time.',
      },
      {
        title: 'Launch',
        time: '1 week',
        text: 'Load testing, monitoring, a smooth rollout and a full documentation handover to your team.',
      },
      {
        title: 'Support',
        time: 'Under SLA',
        text: 'Three months of warranty, then product growth, maintenance and scaling as you grow.',
      },
    ],
  },

  pricing: {
    label: 'Engagement',
    title: 'Clear terms from day one',
    lead: 'We pick the model that fits the job. You get an exact price after a free estimate — no hidden fees.',
    from: 'from',
    popular: 'Most popular',
    cta: 'Discuss the model',
    note: 'Prices exclude VAT. We work with companies and sole proprietors worldwide.',
    plans: [
      {
        name: 'Fixed-scope project',
        text: 'Fixed scope, timeline and price. Ideal for MVPs and products with clear requirements.',
        price: '$8,000',
        features: ['Estimate & plan up front', 'Milestone payments', 'Weekly demos', '3-month warranty'],
      },
      {
        name: 'Dedicated team',
        text: 'Nightloom works as your product department: flexible scope, priorities can change as you go.',
        price: '$6,000',
        unit: '/ mo',
        features: ['2–4 engineers on your team', 'Your process and tracker', 'Monthly reporting', 'Kick off within a week'],
        featured: true,
      },
      {
        name: 'Support & growth',
        text: 'Ongoing care for live products: monitoring, fixes, improvements and code audits.',
        price: '$1,000',
        unit: '/ mo',
        features: ['SLA with response times', '24/7 monitoring', 'Hours for improvements', 'Audit at kickoff'],
      },
    ],
  },

  team: {
    label: 'Team',
    title: 'Four people. Zero middlemen.',
    lead: 'We have worked together since 2020. You talk directly to the people who design and write the code.',
    experience: (n) => `${n} years in engineering`,
    members: [
      {
        name: 'Artem Volkov',
        role: 'Co-founder · Tech Lead',
        bio: 'Architecture and backends for high-load systems. Makes sure your product survives its own growth.',
        years: 12,
        skills: ['Go', 'PostgreSQL', 'System design'],
        avatar: 'lead',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'Telegram', href: 'https://t.me/' },
        ],
      },
      {
        name: 'Maria Sokolova',
        role: 'Co-founder · Product Designer',
        bio: 'UX research, interfaces and design systems. Makes products people actually enjoy using.',
        years: 9,
        skills: ['Figma', 'UX research', 'Design systems'],
        avatar: 'design',
        links: [
          { label: 'Dribbble', href: 'https://dribbble.com/' },
          { label: 'Telegram', href: 'https://t.me/' },
        ],
      },
      {
        name: 'Ilya Orlov',
        role: 'Frontend Lead',
        bio: 'React, Next.js, motion and performance. Interfaces that open instantly.',
        years: 8,
        skills: ['TypeScript', 'React', 'WebGL'],
        avatar: 'front',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
      {
        name: 'Denis Kim',
        role: 'Mobile & DevOps',
        bio: 'Mobile apps, CI/CD and cloud infrastructure. Keeps everything running 24/7.',
        years: 10,
        skills: ['Flutter', 'Kubernetes', 'AWS'],
        avatar: 'ops',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'Telegram', href: 'https://t.me/' },
        ],
      },
    ],
  },

  testimonials: {
    label: 'Testimonials',
    title: 'What clients say',
    items: [
      {
        text: 'A rare vendor that comes to you with risks and options instead of waiting for a spec. We launched ahead of schedule and within budget.',
        author: 'Alex G.',
        role: 'CTO',
        company: 'Finora',
      },
      {
        text: 'We went through two agencies in three years before finding Nightloom. Transparent weekly reports — and never a single “almost done”.',
        author: 'Irina S.',
        role: 'COO',
        company: 'Cargoline',
      },
      {
        text: 'They cared about our users more than we did. Every interface decision was backed by data.',
        author: 'Kate M.',
        role: 'Founder',
        company: 'Mellow',
      },
    ],
  },

  stack: {
    label: 'Stack',
    title: 'Tools we trust',
    lead: 'We choose mature technologies with large communities — so your product is still easy to evolve five years from now.',
    prompt: 'nightloom@studio:~$',
    command: 'cat stack.yml',
    groups: [
      { name: 'frontend', items: ['TypeScript', 'React', 'Next.js', 'Vue', 'Astro', 'Three.js'] },
      { name: 'backend', items: ['Node.js', 'NestJS', 'Go', 'Python', 'GraphQL', 'gRPC'] },
      { name: 'data', items: ['PostgreSQL', 'Redis', 'ClickHouse', 'Kafka', 'Elasticsearch'] },
      { name: 'mobile', items: ['React Native', 'Flutter', 'Swift', 'Kotlin'] },
      { name: 'infra', items: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'Grafana'] },
      { name: 'design', items: ['Figma', 'Rive', 'Lottie'] },
    ],
  },

  faq: {
    label: 'FAQ',
    title: 'Frequently asked questions',
    lead: 'Didn’t find your answer? Drop us a line — we reply within one business day.',
    items: [
      {
        q: 'How much does a project cost?',
        a: 'It depends on scope and complexity. A focused MVP usually starts at $8,000 and takes 6–10 weeks. After the intro call we prepare a free, milestone-by-milestone estimate — so you know exactly what you are paying for.',
      },
      {
        q: 'Do you sign contracts and NDAs?',
        a: 'Yes. We sign an NDA before discussing details and work under a contract with milestone payments. We work with companies worldwide and provide all the paperwork you need.',
      },
      {
        q: 'Who owns the code?',
        a: 'You do. Repositories and infrastructure live in your accounts, and all rights to the code and design transfer to you under the contract. You can continue in-house at any moment.',
      },
      {
        q: 'Can you join an existing project?',
        a: 'Yes. We start with a code and infrastructure audit (1–2 weeks), then propose a plan: maintain, refactor step by step, or rewrite the critical parts.',
      },
      {
        q: 'What if requirements change mid-project?',
        a: 'That is normal. Changes go into the backlog; we estimate their impact on timeline and budget and agree on it with you before any work starts — no hidden charges.',
      },
      {
        q: 'What happens after launch?',
        a: 'Three months of free bug fixing. After that it is your call: support under an SLA, continued product development, or a full handover to your team with documentation.',
      },
    ],
  },

  contact: {
    label: 'Contact',
    title: 'Got an idea? Let’s weave it.',
    lead: 'Tell us about your project in a couple of sentences — we reply within one business day and suggest a time for a call. The first consultation is free.',
    steps: [
      { title: 'Reply within 24h', text: 'We ask a few clarifying questions and suggest a time to talk.' },
      { title: '30-minute call', text: 'We go through the goals, the risks and the right engagement model.' },
      { title: 'Estimate in 2–4 days', text: 'You get a plan, budget and timeline — free, with no obligations.' },
    ],
    direct: 'Or reach us directly',
    book: 'Book a call',
    hours: 'Mon–Fri, 10:00–20:00 (UTC+3)',
    form: {
      name: 'Name',
      namePh: 'How should we call you',
      contact: 'Email or Telegram',
      contactPh: 'you@company.com or @username',
      company: 'Company',
      companyPh: 'Optional',
      type: 'What do you need',
      types: ['Web app', 'Mobile app', 'Backend / API', 'Telegram Mini App', 'Design', 'Something else'],
      budget: 'Budget',
      budgets: ['< $10k', '$10–25k', '$25–75k', '$75k+', 'Not sure yet'],
      message: 'About the project',
      messagePh: 'Briefly describe the task, the timeline and what already exists',
      nda: 'Sign an NDA first',
      submit: 'Send request',
      sending: 'Sending…',
      consent: 'By submitting, you agree to our',
      consentLink: 'privacy policy',
      success: 'Request sent',
      successText: 'Thank you! We will get back to you within one business day — usually much sooner.',
      error: 'Something went wrong. Please write to us directly:',
      required: 'This field is required',
      invalid: 'Enter an email or a Telegram @username',
      mailSubject: 'New project request — Nightloom',
      mailFallback: 'We’ve opened your email app with a pre-filled message — just hit send.',
    },
  },

  footer: {
    tagline: 'Independent development studio. Weaving reliable software since 2020.',
    nav: 'Navigation',
    contacts: 'Contact',
    social: 'Social',
    legal: 'Nightloom Studio · Reg. No. 000000000',
    privacy: 'Privacy policy',
    rights: 'All rights reserved.',
    top: 'Back to top',
    clock: {
      night: 'it’s night here, but we’re probably still up',
      day: 'it’s business hours here, expect a quick reply',
    },
  },

  caseStudy: {
    back: 'All work',
    challenge: 'Challenge',
    solution: 'Solution',
    results: 'Results',
    stack: 'Stack',
    next: 'Next case',
    cta: 'Want results like these?',
    ctaText: 'Tell us about your project — we will estimate timeline and budget for free.',
  },

  privacy: {
    title: 'Privacy policy',
    updated: 'Last updated October 1, 2026',
    sections: [
      {
        title: '1. Overview',
        text: [
          'This is a privacy policy template. Replace it with a text prepared by a lawyer for your jurisdiction (e.g. GDPR).',
          'The data controller is Nightloom Studio (Reg. No. 000000000), hereinafter “Nightloom”.',
        ],
      },
      {
        title: '2. What we collect',
        text: [
          'Your name, contact details (email or Telegram handle), company name and project description — only what you voluntarily submit through the contact form.',
        ],
      },
      {
        title: '3. Why we use it',
        text: [
          'To respond to your request, prepare a project estimate and get in touch. We never share your data with third parties or send newsletters without your consent.',
        ],
      },
      {
        title: '4. Retention & deletion',
        text: [
          'We keep data no longer than necessary for these purposes. To withdraw consent or delete your data, email hello@nightloom.dev.',
        ],
      },
    ],
  },

  notFound: {
    title: 'This page vanished into the night',
    text: 'Looks like this page doesn’t exist — or the ghost carried it off.',
    back: 'Back to home',
  },
};

export default en;
