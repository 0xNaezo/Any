/**
 * ============================================================================
 *  NIGHTLOOM — site content
 * ============================================================================
 *  Every piece of copy on the site lives in this file.
 *  Edit the values below; the layout adapts automatically.
 *
 *  ⚠ PLACEHOLDER CONTENT: names, numbers, clients, case studies and
 *  testimonials below are illustrative. Replace them with real data before
 *  going live — invented reviews or metrics hurt trust (and in many
 *  jurisdictions are illegal in advertising).
 * ============================================================================
 */

import type { GhostEyes } from '@/lib/ghost';
import type { IconName } from '@/lib/icons';
import type { ImageMetadata } from 'astro';

/**
 * Case-study images: drop files into `src/assets/work/` named `<slug>-cover`
 * and `<slug>-detail` (png, jpg, webp or avif). Missing images fall back to a
 * generated pixel placeholder, so the build never breaks.
 */
const workImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/work/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);
function workImage(name: string): ImageMetadata | undefined {
  const hit = Object.entries(workImages).find(([path]) =>
    path.replace(/\.[a-z]+$/, '').endsWith(`/${name}`),
  );
  return hit?.[1].default;
}

/* ---------------------------------------------------------------- brand */
export const brand = {
  name: 'Nightloom',
  suffix: 'Dev Team',
  legalName: 'Nightloom s.r.o.',
  companyId: 'ID 000 00 000', // company registration number
  address: 'Prague, Czech Republic',
  founded: 2019,
  email: 'hello@nightloom.dev',
  telegram: 'nightloom', // without @
  calendar: 'https://cal.com/nightloom/intro', // booking link for the intro call
  github: 'https://github.com/nightloom',
  linkedin: 'https://www.linkedin.com/company/nightloom',
  /** Shown in the hero terminal and the contact block. */
  cities: [
    { name: 'Prague', tz: 'Europe/Prague' },
    { name: 'Kyiv', tz: 'Europe/Kyiv' },
  ],
  workingHours: 'Mon–Fri · 09:00–19:00 CET',
};

/* ------------------------------------------------------------------ seo */
export const seo = {
  title: 'Nightloom — senior dev team for backends, products & automation',
  description:
    'Nightloom is a four-person senior engineering team. We build and run backends, web products, automation and AI features for startups, businesses and agencies — fixed scope, weekly demos, code you own.',
};

/* --------------------------------------------------------- availability */
export const availability = {
  /** Short status used in the nav pill and hero terminal. */
  status: '1 slot open',
  nextSlot: 'Nov 03',
  note: 'We run at most three projects at a time, so every client gets the senior team — not a rotation.',
  /** Capacity calendar in the pricing section. 0 = free … 10 = fully booked. */
  months: [
    { label: 'Oct', booked: 10 },
    { label: 'Nov', booked: 7 },
    { label: 'Dec', booked: 6 },
    { label: 'Jan', booked: 4 },
    { label: 'Feb', booked: 2 },
    { label: 'Mar', booked: 1 },
  ],
};

/* ------------------------------------------------------------------ nav */
export const nav = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Process', href: '/#process' },
  { label: 'Team', href: '/#team' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

/* ----------------------------------------------------------------- hero */
export const hero = {
  label: '00 / Independent dev team',
  meta: 'Prague ⇄ Kyiv · Est. 2019',
  /** Lines of the headline. `hl: true` renders the line as an inverse block. */
  headline: [
    { text: 'Four senior' },
    { text: 'engineers.' },
    { text: 'Zero', hl: true },
    { text: 'surprises.', hl: true },
  ],
  lead:
    'Nightloom is a small, senior team that builds and runs backends, web products, automation and AI features — for companies that need it done right, and agencies that need it done under their name.',
  primaryCta: { label: 'Start a project', href: '#contact' },
  secondaryCta: { label: 'See our work', href: '#work' },
  proof: [
    { value: '5.0', label: 'avg. client rating' },
    { value: '63', label: 'projects in production' },
    { value: 'NDA', label: 'on day one' },
  ],
  terminal: {
    command: 'nightloom --status',
    lines: [
      { key: 'team', value: '4 senior engineers · 0 juniors' },
      { key: 'focus', value: 'backend · infra · automation · ai' },
      { key: 'capacity', value: '1 slot open · starts nov 03', live: true },
      { key: 'local', value: '{clocks}' }, // replaced with live city clocks
      { key: 'reply', value: '< 24h, mon–fri' },
    ],
  },
};

/* -------------------------------------------------------- clients strip */
export const clients = {
  label: 'Shipped for teams at',
  names: [
    'Ledgerly',
    'Parcelpoint',
    'Halden Clinics',
    'Courier',
    'Northwind',
    'Brightfold',
    'Orbitly',
    'Fernhill',
    'Tidewater',
    'Kestrel',
  ],
};

export const stats = [
  { value: 7, suffix: '', label: 'years shipping together' },
  { value: 63, suffix: '', label: 'projects in production' },
  { value: 92, suffix: '%', label: 'of clients come back' },
  { value: 24, prefix: '<', suffix: 'h', label: 'to a real reply' },
];

/* ------------------------------------------------------------- services */
export interface Service {
  icon: IconName;
  title: string;
  text: string;
  points: string[];
  stack: string[];
}

export const services = {
  label: '01 / Services',
  meta: '6 disciplines · 1 team',
  title: 'What we build',
  lead:
    'Hand us a whole product or just the hard part. We plug into your stack, tools and process — or bring battle-tested defaults of our own.',
  items: [
    {
      icon: 'terminal',
      title: 'Backend & APIs',
      text: 'Typed, documented APIs and the business logic behind them — auth, billing, queues, webhooks and integrations.',
      points: ['REST & GraphQL APIs', 'Payments & billing', 'Third-party integrations'],
      stack: ['Node.js', 'Go', 'Python', 'PostgreSQL'],
    },
    {
      icon: 'browser',
      title: 'Web products',
      text: 'SaaS apps, dashboards, client portals and internal tools that feel instant and stay maintainable.',
      points: ['Product & admin dashboards', 'Client portals', 'Design-system builds'],
      stack: ['TypeScript', 'React', 'Next.js', 'Astro'],
    },
    {
      icon: 'servers',
      title: 'Infrastructure',
      text: 'Cloud setups, CI/CD and monitoring that let you sleep. Backups that are restored and tested, not just taken.',
      points: ['AWS · GCP · Hetzner', 'Zero-downtime deploys', 'Monitoring & alerting'],
      stack: ['Docker', 'Kubernetes', 'Terraform', 'Grafana'],
    },
    {
      icon: 'sync',
      title: 'Automation',
      text: 'Workflows between your tools that survive retries, rate limits and crashes — with logs a human can read.',
      points: ['n8n in production', 'CRM, finance & ops syncs', 'Idempotent, monitored jobs'],
      stack: ['n8n', 'Temporal', 'Redis', 'Webhooks'],
    },
    {
      icon: 'sparkle',
      title: 'AI features',
      text: 'LLM steps that earn their place: search over your data, document extraction, support copilots — with evals and guardrails.',
      points: ['RAG search & assistants', 'Document extraction', 'Evals, cost & latency control'],
      stack: ['Claude', 'OpenAI', 'pgvector', 'LangGraph'],
    },
    {
      icon: 'chart',
      title: 'Data & analytics',
      text: 'Pipelines, warehouses and dashboards your team actually trusts. Migrations without the weekend outage.',
      points: ['ETL / ELT pipelines', 'Warehouses & BI', 'Migrations & cleanup'],
      stack: ['dbt', 'BigQuery', 'ClickHouse', 'Metabase'],
    },
  ] satisfies Service[] as Service[],
  also: ['Code & security audits', 'Rescuing stalled projects', 'Performance tuning', 'Legacy takeovers'],
};

/* ----------------------------------------------------------------- work */
export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  title: string;
  summary: string;
  industry: string;
  year: number;
  duration: string;
  team: string;
  services: string[];
  stack: string[];
  cover?: ImageMetadata;
  detail?: ImageMetadata;
  coverAlt: string;
  detailAlt: string;
  metrics: Metric[];
  challenge: string;
  approach: string[];
  outcome: string;
  quote?: { text: string; author: string; role: string };
}

export const work = {
  label: '02 / Selected work',
  meta: '4 of 63 · more under NDA',
  title: 'Proof, not promises',
  lead: 'A few projects we can show in public. Most of our work is under NDA — ask us for a private walkthrough.',
  cases: [
    {
      slug: 'ledgerly',
      name: 'Ledgerly',
      title: 'Receivables platform with automatic bank reconciliation',
      summary:
        'We rebuilt the invoicing core of a B2B fintech and added a matching engine that reconciles bank transactions against invoices on its own.',
      industry: 'Fintech',
      year: 2025,
      duration: '14 weeks',
      team: '3 engineers',
      services: ['Backend & APIs', 'Web product', 'Infrastructure'],
      stack: ['Node.js', 'PostgreSQL', 'React', 'AWS'],
      cover: workImage('ledgerly-cover'),
      detail: workImage('ledgerly-detail'),
      coverAlt: 'Ledgerly receivables dashboard with KPIs, cash-flow chart and invoice table',
      detailAlt: 'Ledgerly bank reconciliation screen with suggested invoice matches',
      metrics: [
        { value: '96%', label: 'transactions matched automatically' },
        { value: '6→1.5', label: 'days to close the month' },
        { value: '99.98%', label: 'uptime since launch' },
      ],
      challenge:
        'Ledgerly’s finance customers were closing the month by hand: exporting bank statements, matching payments to invoices in spreadsheets and chasing the rest by email. The legacy monolith could not take another feature without breaking two.',
      approach: [
        'Mapped the invoicing domain and carved it out of the monolith behind a typed API, with zero downtime for existing customers.',
        'Built a matching engine that scores each bank transaction against open invoices (amount, reference, payer history) and auto-confirms above a tuned threshold.',
        'Shipped a reconciliation UI for the remaining edge cases with keyboard-first bulk actions.',
        'Moved infrastructure to AWS with Terraform, blue-green deploys and per-tenant monitoring.',
      ],
      outcome:
        'Customers now reconcile 96% of transactions without touching them, and month-end close dropped from six days to a day and a half.',
      quote: {
        text: 'They took over a half-finished platform and shipped it in fourteen weeks. Weekly demos, zero drama, and the cleanest codebase we have ever inherited.',
        author: 'J. Novák',
        role: 'CTO, Ledgerly',
      },
    },
    {
      slug: 'parcelpoint',
      name: 'Parcelpoint',
      title: 'Real-time dispatch for a last-mile delivery fleet',
      summary:
        'Live map, route planning and a driver app for a delivery company running 40+ vans across two cities.',
      industry: 'Logistics',
      year: 2026,
      duration: '5 months',
      team: '4 engineers',
      services: ['Backend & APIs', 'Web product', 'Mobile', 'Infrastructure'],
      stack: ['Go', 'PostgreSQL', 'React Native', 'Kubernetes'],
      cover: workImage('parcelpoint-cover'),
      detail: workImage('parcelpoint-detail'),
      coverAlt: 'Parcelpoint live dispatch map with routes, vehicles and route list',
      detailAlt: 'Parcelpoint driver app screens: route list, proof of delivery and day summary',
      metrics: [
        { value: '97.4%', label: 'on-time deliveries (from 89%)' },
        { value: '3.2k', label: 'stops handled per day' },
        { value: '2h→6m', label: 'daily route planning' },
      ],
      challenge:
        'Dispatchers planned routes in spreadsheets every morning and tracked drivers by phone. Late deliveries were discovered when customers called.',
      approach: [
        'Built a Go service that ingests GPS pings from the driver app and streams vehicle positions to the dispatch map in real time.',
        'Added a route optimiser with time windows and van capacity, overridable by dispatchers with drag-and-drop.',
        'Shipped a React Native driver app with offline mode, photo + signature proof of delivery and turn-by-turn hand-off.',
        'Ran everything on a small Kubernetes cluster with alerting on late-running routes, not just on servers.',
      ],
      outcome:
        'On-time deliveries went from 89% to 97.4%, and morning planning shrank from two hours to six minutes.',
    },
    {
      slug: 'halden',
      name: 'Halden Clinics',
      title: 'Online booking and scheduling for a network of clinics',
      summary:
        'Patient booking, doctor schedules and automated reminders for six private clinics — replacing phone-only booking.',
      industry: 'Healthcare',
      year: 2025,
      duration: '10 weeks',
      team: '3 engineers',
      services: ['Web product', 'Automation', 'Data'],
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Twilio'],
      cover: workImage('halden-cover'),
      detail: workImage('halden-detail'),
      coverAlt: 'Halden clinic schedule week view with colour-coded appointments',
      detailAlt: 'Halden patient booking flow and mobile confirmation screen',
      metrics: [
        { value: '64%', label: 'of bookings now online' },
        { value: '−38%', label: 'no-shows with smart reminders' },
        { value: '−45%', label: 'front-desk phone calls' },
      ],
      challenge:
        'Every appointment went through a phone line that was busy half the day. No-shows cost the clinics a fifth of their doctor hours.',
      approach: [
        'Designed a booking flow that shows real availability across clinics, specialists and rooms — accessible and fast on mobile.',
        'Integrated the clinics’ existing practice-management system through a sync layer with conflict detection.',
        'Automated SMS and email reminders with one-tap rescheduling, timed per appointment type.',
        'Gave managers a utilisation dashboard to rebalance schedules weekly.',
      ],
      outcome:
        'Two thirds of patients now book online, no-shows fell by 38%, and the front desk got its afternoons back.',
    },
    {
      slug: 'courier',
      name: 'Courier',
      title: 'AI support copilot for e-commerce support teams',
      summary:
        'An assistant that drafts replies from the help center, order data and past tickets — agents approve, edit or escalate.',
      industry: 'AI · E-commerce',
      year: 2026,
      duration: '8 weeks',
      team: '2 engineers',
      services: ['AI features', 'Backend & APIs', 'Automation'],
      stack: ['Python', 'pgvector', 'Claude API', 'Postgres'],
      cover: workImage('courier-cover'),
      detail: workImage('courier-detail'),
      coverAlt: 'Courier support inbox with an AI-drafted reply and sources',
      detailAlt: 'Courier analytics dashboard with auto-resolution rate and top intents',
      metrics: [
        { value: '61%', label: 'tickets resolved automatically' },
        { value: '4h→38s', label: 'median first response' },
        { value: '1,240h', label: 'agent hours saved per month' },
      ],
      challenge:
        'A growing store’s support team was drowning in “where is my order” tickets, and an off-the-shelf chatbot kept inventing refund policies.',
      approach: [
        'Built retrieval over the help center, order system and resolved tickets, with citations attached to every draft.',
        'Added an evaluation suite of 400 real tickets that runs on every prompt or model change.',
        'Introduced confidence thresholds: high-confidence order-status replies send automatically, everything else waits for an agent.',
        'Tracked cost and latency per ticket so the economics stay visible.',
      ],
      outcome:
        '61% of tickets now resolve without an agent, first response dropped from hours to seconds, and nothing goes out without a source.',
      quote: {
        text: 'They pushed back on features that would not work — which is exactly why we trust them with the ones that do.',
        author: 'S. Lindqvist',
        role: 'Head of CX, Courier',
      },
    },
  ] satisfies CaseStudy[] as CaseStudy[],
  logLabel: 'More projects',
  log: [
    { year: 2026, name: 'Parcelpoint dispatch', type: 'Logistics SaaS', stack: 'Go · Postgres · K8s', status: 'live' },
    { year: 2026, name: 'Courier AI copilot', type: 'AI / Support', stack: 'Python · pgvector', status: 'live' },
    { year: 2025, name: 'Ledgerly reconciliation', type: 'Fintech platform', stack: 'Node.js · React · AWS', status: 'live' },
    { year: 2025, name: 'Halden booking', type: 'Healthcare portal', stack: 'Next.js · NestJS', status: 'live' },
    { year: 2025, name: 'Stripe → Xero sync', type: 'Automation · 1,753 events, 0 dupes', stack: 'n8n · Postgres', status: 'live' },
    { year: 2025, name: 'Production n8n platform', type: 'Infrastructure · 9 alert rules', stack: 'Docker · Redis · Grafana', status: 'supported' },
    { year: 2024, name: 'Orbitly CRM migration', type: 'Data migration · 4.1M rows', stack: 'Postgres · dbt', status: 'done' },
    { year: 2024, name: 'Fernhill analytics', type: 'Data warehouse', stack: 'BigQuery · dbt · Metabase', status: 'supported' },
    { year: 2024, name: 'Tidewater commerce API', type: 'Backend', stack: 'Node.js · GraphQL', status: 'live' },
    { year: 2023, name: 'Kestrel telemetry', type: 'IoT backend', stack: 'Go · TimescaleDB', status: 'live' },
  ] as { year: number; name: string; type: string; stack: string; status: 'live' | 'supported' | 'done' }[],
};

/* -------------------------------------------------------------- process */
export const process = {
  label: '03 / How we work',
  meta: 'Kick-off in ~7 days',
  title: 'Predictable by design',
  lead: 'The same five steps for every engagement — from a two-week integration to a year-long product.',
  steps: [
    {
      when: 'Day 0',
      title: 'Discovery call',
      text: 'Thirty minutes, free. We dig into goals, constraints and what “done” means for you — and tell you honestly if we’re not the right fit.',
      output: 'Call notes and next steps within 24h',
    },
    {
      when: 'Days 1–5',
      title: 'Scope & estimate',
      text: 'We turn the call into a short written spec, split into tasks with estimates. You get a fixed price or a capped monthly budget.',
      output: 'Spec, timeline, fixed quote',
    },
    {
      when: 'Weeks 1–N',
      title: 'Build in sprints',
      text: 'One-week sprints with a live demo every Friday. You see working software on staging, not status reports.',
      output: 'Staging link, demo, changelog',
    },
    {
      when: 'Launch day',
      title: 'Ship it',
      text: 'Zero-downtime release with monitoring, alerting and a rollback plan in place before the first real user arrives.',
      output: 'Production deploy, runbook',
    },
    {
      when: 'After launch',
      title: 'Handover & support',
      text: 'Docs, credentials and a walkthrough for your team. Thirty days of free fixes, then optional support by the hour pool.',
      output: 'Docs, access, 30-day warranty',
    },
  ],
  weeklyLabel: 'Every week you get',
  weekly: ['Friday demo', 'Written changelog', 'Staging link', 'Open task board', 'Shared Slack channel'],
};

/* ----------------------------------------------------------------- team */
export interface Member {
  name: string;
  role: string;
  /**
   * Optional portrait (square, ≥ 384px). Import it at the top of this file:
   *   import artemPhoto from '@/assets/team/artem.jpg';
   * then set `photo: artemPhoto`. Without a photo the pixel ghost is shown.
   */
  photo?: ImageMetadata;
  years: number;
  city: string;
  tz: string;
  bio: string;
  skills: string[];
  eyes: GhostEyes;
  links: { label: string; href: string }[];
}

export const team = {
  label: '04 / The team',
  meta: '4 people · 0 account managers',
  title: 'Every area, covered twice',
  lead:
    'You talk to the engineers who write your code. Roles overlap on purpose, so vacations and sick days never stall your project.',
  members: [
    {
      name: 'Artem',
      role: 'Tech lead · Backend',
      years: 11,
      city: 'Prague',
      tz: 'Europe/Prague',
      bio: 'Architecture, APIs and payments. Ex-fintech, allergic to magic. Your first point of contact.',
      skills: ['Go', 'Node.js', 'PostgreSQL', 'Stripe'],
      eyes: 'bars',
      links: [
        { label: 'GH', href: 'https://github.com/' },
        { label: 'IN', href: 'https://www.linkedin.com/' },
      ],
    },
    {
      name: 'Dmytro',
      role: 'Infrastructure & DevOps',
      years: 9,
      city: 'Kyiv',
      tz: 'Europe/Kyiv',
      bio: 'Clouds, pipelines and observability. Has restored more backups than most people have made.',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'Grafana'],
      eyes: 'plus',
      links: [
        { label: 'GH', href: 'https://github.com/' },
        { label: 'IN', href: 'https://www.linkedin.com/' },
      ],
    },
    {
      name: 'Olena',
      role: 'Data & analytics',
      years: 8,
      city: 'Kyiv',
      tz: 'Europe/Kyiv',
      bio: 'Pipelines, warehouses and migrations. Makes the numbers match across five systems.',
      skills: ['Python', 'dbt', 'BigQuery', 'ClickHouse'],
      eyes: 'dots',
      links: [
        { label: 'GH', href: 'https://github.com/' },
        { label: 'IN', href: 'https://www.linkedin.com/' },
      ],
    },
    {
      name: 'Pavel',
      role: 'Automation & AI',
      years: 7,
      city: 'Prague',
      tz: 'Europe/Prague',
      bio: 'n8n in production and LLM features with evals. Builds things that run unattended at 3 a.m.',
      skills: ['n8n', 'Python', 'Claude API', 'pgvector'],
      eyes: 'happy',
      links: [
        { label: 'GH', href: 'https://github.com/' },
        { label: 'IN', href: 'https://www.linkedin.com/' },
      ],
    },
  ] satisfies Member[] as Member[],
  /** Coverage map: 2 = primary owner, 1 = backup, 0 = not covered. Order matches `members`. */
  coverageLabel: 'Coverage map',
  coverage: [
    { area: 'Architecture', levels: [2, 1, 0, 1] },
    { area: 'Backend & APIs', levels: [2, 0, 1, 1] },
    { area: 'Web frontend', levels: [2, 0, 0, 1] },
    { area: 'Infrastructure', levels: [1, 2, 0, 0] },
    { area: 'Automation', levels: [0, 1, 1, 2] },
    { area: 'AI / LLM', levels: [1, 0, 1, 2] },
    { area: 'Data & BI', levels: [0, 0, 2, 1] },
    { area: 'Security & QA', levels: [1, 2, 0, 1] },
  ],
};

/* ----------------------------------------------------------- guarantees */
export const guarantees = {
  label: '05 / Guarantees',
  meta: 'In the contract, not the pitch',
  title: 'What we put in writing',
  lead: 'Promises are cheap, so these are clauses in our standard contract. We are just as happy to sign yours.',
  file: 'nightloom/contract.md',
  items: [
    { title: 'Your code from commit #1', text: 'Everything lives in your GitHub org and your cloud accounts. IP transfers to you with each payment.' },
    { title: 'Fixed price or hard cap', text: 'You approve the budget before we start. If our estimate was wrong, the overrun is on us.' },
    { title: 'A demo every Friday', text: 'Working software on staging every week. Miss a demo without notice and that week is free.' },
    { title: 'Senior people only', text: 'No juniors learning on your budget. The people on the call are the people writing the code.' },
    { title: '30-day warranty', text: 'Bugs found in the first thirty days after launch are fixed free, no tickets or debates.' },
    { title: 'NDA on day one', text: 'Signed before the first call if you need it. White-label by default for agency partners.' },
    { title: 'Two people per area', text: 'Every part of your system is understood by at least two of us. No single point of failure.' },
    { title: 'Leave any time', text: 'Two weeks’ notice, a full handover and documentation. No lock-in, no hostage code.' },
  ],
};

/* --------------------------------------------------------- testimonials */
export const testimonials = {
  label: '06 / Client notes',
  meta: '5.0 avg · 38 reviews',
  title: 'In their words',
  // PLACEHOLDER testimonials — replace with real, attributable quotes.
  items: [
    {
      text: 'They took over a half-finished platform and shipped it in fourteen weeks. Weekly demos, zero drama, and the cleanest codebase we have ever inherited.',
      author: 'J. Novák',
      role: 'CTO',
      company: 'Ledgerly · Fintech',
    },
    {
      text: 'We white-label their backend work for our clients. They follow our process, write docs in our name and haven’t missed a deadline in two years.',
      author: 'M. Ortega',
      role: 'Founder',
      company: 'Brightfold · Design studio',
    },
    {
      text: 'Our support team went from drowning to 61% auto-resolved. They pushed back on features that would not work — which is exactly why we trust them.',
      author: 'S. Lindqvist',
      role: 'Head of CX',
      company: 'Courier · E-commerce',
    },
  ],
};

/* -------------------------------------------------------------- pricing */
export const pricing = {
  label: '07 / Engagement',
  meta: 'USD · excl. VAT',
  title: 'Clear prices, no hourly guesswork',
  lead: 'Three ways to work with us. Every option includes the whole senior team, weekly demos and code in your repositories.',
  plans: [
    {
      name: 'Project',
      tagline: 'Fixed scope, fixed price',
      price: 'from $8k',
      unit: 'per project',
      for: 'MVPs, new features, integrations, migrations',
      features: ['Written spec & estimate', 'Weekly demos on staging', '30-day warranty', 'Full handover & docs'],
      note: 'Typical: 3–12 weeks',
      cta: 'Get a quote',
      featured: false,
    },
    {
      name: 'Team pool',
      tagline: 'A slice of all four of us',
      price: '$7,200',
      unit: 'per month · 120h',
      for: 'Product teams that need senior capacity every month',
      features: [
        'Hours shared across the team, not per person',
        'Priority queue, reply < 4h',
        'Monthly roadmap & report',
        'Unused hours roll over (20%)',
      ],
      note: 'Min. 3 months · 2 weeks’ notice',
      cta: 'Book a call',
      featured: true,
    },
    {
      name: 'White-label',
      tagline: 'We build, you take the credit',
      price: '$60',
      unit: 'per hour',
      for: 'Design studios & automation agencies',
      features: ['NDA & your branding everywhere', 'Your tools: Jira, Linear, Slack', 'Client-ready docs & demos', 'Invisible to your client'],
      note: 'Billed monthly · no minimums',
      cta: 'Partner with us',
      featured: false,
    },
  ],
  capacityLabel: 'Capacity',
};

/* ------------------------------------------------------------------ faq */
export const faq = {
  label: '08 / FAQ',
  meta: 'Still unsure? Ask us',
  title: 'Questions we get asked',
  lead: 'Didn’t find yours? Write to us — a real engineer answers within one business day.',
  items: [
    {
      q: 'Who owns the code and IP?',
      a: 'You do, from the first commit. We work in your repositories and cloud accounts, and the contract assigns all IP to you as each invoice is paid.',
    },
    {
      q: 'How do you arrive at a fixed price?',
      a: 'After the discovery call we write a short spec and break it into tasks with estimates. You get one price for the agreed scope; anything new is estimated separately before we start it.',
    },
    {
      q: 'What if the scope changes mid-project?',
      a: 'It usually does, and that’s fine. We estimate the change, you approve it, and it goes into the next sprint. No surprise invoices.',
    },
    {
      q: 'Can you work under our agency’s brand?',
      a: 'Yes — white-label is about a third of our work. We sign your NDA, use your tools and stay invisible to your client unless you want us on calls.',
    },
    {
      q: 'Do you take over existing codebases?',
      a: 'Often. We start with a paid one- to two-week audit covering architecture, security and infrastructure, and hand you a prioritised fix list. Then you decide.',
    },
    {
      q: 'Which time zones do you cover?',
      a: 'We are in Prague and Kyiv (CET/EET). That is full overlap with Europe and three to four hours with the US East Coast every working day.',
    },
    {
      q: 'How do payments work?',
      a: 'Projects: 30% upfront, the rest by milestone. Team pool: monthly in advance. We invoice from an EU company in USD or EUR.',
    },
    {
      q: 'What happens after launch?',
      a: 'Thirty days of free fixes, then optional support: monitoring, updates and a monthly pool of hours for improvements.',
    },
  ],
};

/* -------------------------------------------------------------- contact */
export const contact = {
  label: '09 / Contact',
  meta: 'Reply < 24h · Mon–Fri',
  title: [{ text: 'Have a project?' }, { text: 'Let’s talk.', hl: true }],
  lead: 'Two or three sentences are enough. Artem, our tech lead, replies within one business day with questions or a call slot.',
  /**
   * Form submission endpoint (e.g. Formspree / Web3Forms / your own API).
   * Leave empty to fall back to opening the visitor's email client.
   */
  formEndpoint: '',
  needs: ['Backend & APIs', 'Web product', 'Infrastructure', 'Automation', 'AI features', 'Data', 'Audit / rescue'],
  budgets: ['< $10k', '$10–25k', '$25–60k', '$60k+', 'Not sure yet'],
  person: { name: 'Artem', role: 'Tech lead · replies to every inquiry', eyes: 'bars' as GhostEyes },
  channels: [
    { icon: 'mail' as IconName, label: 'Email', value: 'hello@nightloom.dev', href: 'mailto:hello@nightloom.dev', copy: true },
    { icon: 'send' as IconName, label: 'Telegram', value: '@nightloom', href: 'https://t.me/nightloom', copy: false },
    { icon: 'calendar' as IconName, label: 'Intro call', value: 'Book 30 min', href: 'https://cal.com/nightloom/intro', copy: false },
  ],
  note: 'Prefer to start with an NDA? Mention it — we’ll send ours or sign yours.',
};

/* --------------------------------------------------------------- footer */
export const footer = {
  tagline: 'Senior engineering, woven at night and shipped by morning.',
  status: 'All systems operational',
  legal: [
    { label: 'Privacy', href: '/privacy' },
  ],
};

export const site = { brand, seo, availability, nav, hero, clients, stats, services, work, process, team, guarantees, testimonials, pricing, faq, contact, footer };
export default site;
