/**
 * ────────────────────────────────────────────────────────────────────────────
 *  ALL WEBSITE COPY LIVES IN THIS FILE.
 *
 *  Edit text, numbers, links, projects, team members and testimonials here —
 *  the components only render what they find below.
 *
 *  • Strings marked "html" may contain inline HTML. Wrap words in <em>…</em>
 *    to get the serif-italic gradient accent used in headings.
 *  • Images live in `src/assets/…` — drop in your own files (jpg/png/webp/svg)
 *    and update the imports. Astro optimises them at build time.
 *
 *  ⚠️  Everything here is PLACEHOLDER content. Before going live, replace the
 *  client names, stats, case studies, testimonials and prices with real ones —
 *  invented social proof erodes exactly the trust this site is built to earn.
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { ImageMetadata } from 'astro';

import workLedgerly from '../assets/work/ledgerly.webp';
import workPulse from '../assets/work/pulse.webp';
import workAtelier from '../assets/work/atelier.webp';
import workRelay from '../assets/work/relay.webp';

import teamDaniel from '../assets/team/daniel.webp';
import teamMira from '../assets/team/mira.webp';
import teamLeo from '../assets/team/leo.webp';
import teamAva from '../assets/team/ava.webp';

export type IconName =
  | 'web'
  | 'mobile'
  | 'server'
  | 'design'
  | 'ai'
  | 'cloud'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-up'
  | 'check'
  | 'plus'
  | 'mail'
  | 'calendar'
  | 'clock'
  | 'shield'
  | 'lock'
  | 'star'
  | 'github'
  | 'linkedin'
  | 'x'
  | 'dribbble'
  | 'telegram'
  | 'sparkle'
  | 'globe'
  | 'code'
  | 'chat';

export interface Link {
  label: string;
  href: string;
}

export interface SocialLink extends Link {
  icon: IconName;
}

/* ─────────────────────────────── Global ─────────────────────────────── */

export const site = {
  name: 'Nightloom',
  url: 'https://nightloom.dev',
  email: 'hello@nightloom.dev',
  /** Calendly / Cal.com / Google Calendar booking link */
  bookingUrl: 'https://cal.com/',
  location: 'Remote-first · Central Europe',
  /** Used for the live "local time" in the footer and the timezone card */
  timezone: { label: 'CET', iana: 'Europe/Berlin' },
  availability: {
    label: 'Booking projects for Q1 2027',
    short: '2 slots open',
  },
  meta: {
    title: 'Nightloom — Senior product engineering studio',
    description:
      'Nightloom is a four-person senior product studio. We design, build and scale web platforms, mobile apps and AI-powered tools for startups and growing companies.',
    ogImageAlt: 'Nightloom — We weave software that won’t haunt you.',
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'X / Twitter', href: 'https://x.com/', icon: 'x' },
    { label: 'Dribbble', href: 'https://dribbble.com/', icon: 'dribbble' },
  ] satisfies SocialLink[],
};

export const nav: Link[] = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'Team', href: '/#team' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

/* ──────────────────────────────── Hero ──────────────────────────────── */

export const hero = {
  badge: { label: 'Now booking Q1 2027', detail: '2 slots left' },
  /** html */
  title: 'We weave software <em>that won’t haunt&nbsp;you.</em>',
  lead: 'Nightloom is a senior four-person product studio. We design, build and scale web platforms, mobile apps and AI tools — with clean code, clear communication and zero ghosting.',
  primaryCta: { label: 'Start a project', href: '#contact' },
  secondaryCta: { label: 'See our work', href: '#work' },
  proof: {
    rating: '4.9/5',
    text: 'from 30+ client reviews',
  },
  stats: [
    { value: 40, suffix: '+', label: 'Products shipped' },
    { value: 9, suffix: ' yrs', label: 'Average seniority' },
    { value: 14, suffix: '', label: 'Countries served' },
    { value: 96, suffix: '%', label: 'Clients who come back' },
  ],
};

/* ─────────────────────────────── Clients ────────────────────────────── */

export const clients = {
  label: 'Trusted by founders and product teams at',
  /** `mark` picks one of the placeholder logo glyphs in ClientLogo.astro */
  logos: [
    { name: 'Ledgerly', mark: 'ledger' },
    { name: 'Pulse Health', mark: 'pulse' },
    { name: 'atelier', mark: 'atelier' },
    { name: 'Relay', mark: 'relay' },
    { name: 'Northvale', mark: 'peak' },
    { name: 'Orbitly', mark: 'orbit' },
    { name: 'QUANTA', mark: 'quanta' },
    { name: 'Fernwood', mark: 'leaf' },
  ],
};

/* ─────────────────────────────── Services ───────────────────────────── */

export const services = {
  eyebrow: 'Services',
  /** html */
  title: 'Everything you need to go from <em>idea</em> to production.',
  lead: 'One compact, senior team across product design, engineering and infrastructure — so nothing gets lost between hand-offs.',
  items: [
    {
      icon: 'web',
      title: 'Web platforms',
      text: 'SaaS products, dashboards and complex web apps that stay fast and maintainable as you grow.',
      tags: ['React', 'Next.js', 'TypeScript'],
    },
    {
      icon: 'mobile',
      title: 'Mobile apps',
      text: 'iOS and Android apps from a single codebase — native feel, one team, both stores.',
      tags: ['React Native', 'Expo', 'Swift'],
    },
    {
      icon: 'server',
      title: 'Backend & APIs',
      text: 'Robust APIs, integrations and data pipelines designed for ten times the traffic you have today.',
      tags: ['Node.js', 'Go', 'PostgreSQL'],
    },
    {
      icon: 'design',
      title: 'Product & UI design',
      text: 'User research, UX flows, design systems and interfaces people genuinely enjoy using.',
      tags: ['Figma', 'Design systems', 'Prototyping'],
    },
    {
      icon: 'ai',
      title: 'AI integration',
      text: 'LLM features, semantic search, copilots and automations that solve real business problems — not demos.',
      tags: ['LLMs', 'RAG', 'Agents'],
    },
    {
      icon: 'cloud',
      title: 'Cloud & DevOps',
      text: 'CI/CD, infrastructure as code, monitoring — and cloud bills that don’t keep you up at night.',
      tags: ['AWS', 'Docker', 'Terraform'],
    },
  ] satisfies { icon: IconName; title: string; text: string; tags: string[] }[],
};

/* ──────────────────────────────── Stack ─────────────────────────────── */

export const stack = {
  label: 'Our toolbox',
  title: 'Battle-tested tools. Boring where it matters.',
  rows: [
    ['TypeScript', 'React', 'Next.js', 'Astro', 'Vue', 'Tailwind CSS', 'React Native', 'Expo', 'Swift', 'Kotlin', 'Figma'],
    ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Redis', 'GraphQL', 'AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'pgvector'],
  ],
};

/* ──────────────────────────────── Work ──────────────────────────────── */

export interface Project {
  name: string;
  title: string;
  summary: string;
  tags: string[];
  results: { value: string; label: string }[];
  stack: string[];
  image: ImageMetadata;
  imageAlt: string;
  /** Accent colour used for the glow behind the project visual */
  accent: string;
  href: string;
}

export const work = {
  eyebrow: 'Selected work',
  /** html */
  title: 'Products we’ve <em>woven</em> lately.',
  lead: 'A few projects we can talk about publicly. Detailed case studies — and the NDA-only ones — are available on request.',
  cta: { label: 'Request full case studies', href: '#contact' },
  projects: [
    {
      name: 'Ledgerly',
      title: 'Real-time treasury platform for a Series B fintech',
      summary:
        'We rebuilt a legacy reporting tool into a real-time treasury platform that reconciles two million transactions a day — with role-based access, audit trails and sub-second dashboards.',
      tags: ['Fintech', 'Web platform', '16 weeks'],
      results: [
        { value: '−62%', label: 'reconciliation time' },
        { value: '0.4s', label: 'avg. dashboard load' },
        { value: '2M+', label: 'transactions a day' },
      ],
      stack: ['Next.js', 'Go', 'PostgreSQL', 'AWS'],
      image: workLedgerly,
      imageAlt: 'Ledgerly treasury dashboard with cash-flow charts and transaction table',
      accent: '#a798ff',
      href: '#contact',
    },
    {
      name: 'Pulse Health',
      title: 'Remote patient-monitoring app for 30,000 patients',
      summary:
        'A HIPAA-compliant iOS and Android app that connects patients with their care teams — vitals synced from wearables, secure messaging and smart medication reminders.',
      tags: ['Healthtech', 'iOS & Android', '12 weeks'],
      results: [
        { value: '4.8★', label: 'App Store rating' },
        { value: '+41%', label: 'daily engagement' },
        { value: '30k', label: 'active patients' },
      ],
      stack: ['React Native', 'Node.js', 'GraphQL', 'GCP'],
      image: workPulse,
      imageAlt: 'Pulse Health mobile app screens showing vitals and care-team chat',
      accent: '#5ee6c8',
      href: '#contact',
    },
    {
      name: 'Atelier Home',
      title: 'Headless storefront for a DTC furniture brand',
      summary:
        'A blazing-fast headless commerce experience with 3D product previews, an editor-friendly CMS workflow and a checkout that converts on every device.',
      tags: ['E-commerce', 'Headless storefront', '10 weeks'],
      results: [
        { value: '+38%', label: 'conversion rate' },
        { value: '1.1s', label: 'mobile LCP' },
        { value: '3×', label: 'faster content updates' },
      ],
      stack: ['Next.js', 'Shopify', 'Sanity', 'Vercel'],
      image: workAtelier,
      imageAlt: 'Atelier Home storefront with furniture product grid',
      accent: '#f5b971',
      href: '#contact',
    },
    {
      name: 'Relay',
      title: 'AI-assisted dispatch for a European logistics operator',
      summary:
        'An operations platform that forecasts demand, suggests optimal routes and lets dispatchers coordinate 1,200 trucks from a single live map.',
      tags: ['Logistics', 'AI platform', '20 weeks'],
      results: [
        { value: '−23%', label: 'empty miles' },
        { value: '1,200', label: 'trucks orchestrated' },
        { value: '€1.8M', label: 'saved in year one' },
      ],
      stack: ['Python', 'FastAPI', 'React', 'Kafka'],
      image: workRelay,
      imageAlt: 'Relay dispatch console with live route map and fleet list',
      accent: '#7fe3f2',
      href: '#contact',
    },
  ] satisfies Project[],
};

/* ─────────────────────────────── Why us ─────────────────────────────── */

export const why = {
  eyebrow: 'Why Nightloom',
  /** html */
  title: 'The only ghost on our team is the <em>logo.</em>',
  lead: 'Hiring an outside team is a leap of faith. Here’s how we make it a safe one.',
  senior: {
    title: 'Senior engineers only',
    text: 'Every line is written by people with 7+ years of experience. No juniors learning on your budget, no bait-and-switch after the contract is signed.',
    /** years of experience shown as bars — keep in sync with the team below */
    roster: [
      { name: 'Daniel', role: 'Tech lead', years: 11 },
      { name: 'Leo', role: 'Frontend', years: 9 },
      { name: 'Mira', role: 'Design', years: 8 },
      { name: 'Ava', role: 'Mobile & backend', years: 8 },
    ],
  },
  comms: {
    title: 'Zero ghosting',
    text: 'Daily async updates, a weekly live demo and replies within four business hours. You always know where things stand.',
    channel: '#acme-x-nightloom',
    messages: [
      { from: 'Daniel', time: '09:12', text: 'Morning! Billing flow is live on staging — link in the thread 🚀' },
      { from: 'Mira', time: '11:40', text: 'Uploaded the new onboarding screens. Two options for the empty state — thoughts?' },
      { from: 'You', time: '11:52', text: 'Option B, love it. Can we demo it Thursday?', self: true },
      { from: 'Leo', time: '16:05', text: 'Done ✅ Lighthouse is at 98 on mobile. Recording of today’s demo is in Notion.' },
    ],
  },
  ownership: {
    title: 'You own 100% of the code',
    text: 'Everything lives in your repositories from day one. Full IP transfer, documentation and a clean handover.',
    repo: 'your-company/platform',
  },
  budget: {
    title: 'Fixed price, no surprises',
    text: 'Clear scope, milestone-based payments and a budget tracker you can check at any time.',
    milestone: 'Milestone 3 of 5',
    spent: 24300,
    total: 38000,
  },
  quality: {
    title: 'Quality is built in',
    text: 'Code review on every pull request, automated tests, CI/CD and monitoring from the very first sprint.',
    checks: [
      { label: 'Lint & type-check', time: '14s' },
      { label: 'Unit tests · 412 passed', time: '48s' },
      { label: 'E2E tests · 38 passed', time: '2m 06s' },
      { label: 'Deploy to production', time: '31s' },
    ],
  },
  timezone: {
    title: 'Your timezone, our overlap',
    text: 'Based in Central Europe with 4+ hours of daily overlap with the US East Coast, the UK and the Gulf.',
    /** working hours in each city's local time, used to draw the overlap chart */
    zones: [
      { city: 'Nightloom', tz: 'Europe/Berlin', start: 9, end: 19, home: true },
      { city: 'New York', tz: 'America/New_York', start: 9, end: 18 },
      { city: 'London', tz: 'Europe/London', start: 9, end: 18 },
      { city: 'Dubai', tz: 'Asia/Dubai', start: 9, end: 18 },
    ],
  },
};

/* ─────────────────────────────── Process ────────────────────────────── */

export const process = {
  eyebrow: 'How we work',
  /** html */
  title: 'A calm, predictable process. <em>No surprises.</em>',
  lead: 'Clear milestones, weekly demos and one point of contact — from the first call to launch and beyond.',
  steps: [
    {
      title: 'Discovery call',
      meta: 'Free · 30 min',
      text: 'We dig into your goals, users and constraints. If we’re not the right fit, we’ll tell you — and point you to someone who is.',
    },
    {
      title: 'Proposal & estimate',
      meta: '2–3 days',
      text: 'You get a detailed proposal with scope, timeline, milestones and a fixed price. No vague ranges, no small print.',
    },
    {
      title: 'Design & prototype',
      meta: '1–3 weeks',
      text: 'We map the flows, design key screens and validate a clickable prototype with you before writing production code.',
    },
    {
      title: 'Build in sprints',
      meta: '4–16 weeks',
      text: 'Two-week sprints, a live staging link, a shared board and a demo every week. You see progress, not promises.',
    },
    {
      title: 'Launch & care',
      meta: 'Ongoing',
      text: 'We ship, monitor and fix anything that comes up — free for 30 days. After that, optional support that fits your stage.',
    },
  ],
};

/* ──────────────────────────────── Team ──────────────────────────────── */

export interface Member {
  name: string;
  role: string;
  years: number;
  bio: string;
  skills: string[];
  photo: ImageMetadata;
  links: SocialLink[];
}

export const team = {
  eyebrow: 'The team',
  /** html */
  title: 'Four people. One team. <em>Zero hand-offs.</em>',
  lead: 'We’ve shipped products together for over five years. You work directly with us — never with an account manager or a rotating cast of contractors.',
  note: 'Remote-first · Central Europe · Clients across the US, UK, EU and the Middle East',
  members: [
    {
      name: 'Daniel Reyes',
      role: 'Co-founder · Tech lead',
      years: 11,
      bio: 'Architecture, backend and scaling. Previously led platform teams at two fintech scale-ups.',
      skills: ['Go', 'Node.js', 'AWS'],
      photo: teamDaniel,
      links: [
        { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
      ],
    },
    {
      name: 'Mira Kovač',
      role: 'Co-founder · Product designer',
      years: 8,
      bio: 'UX research, design systems and motion. Turns fuzzy ideas into flows people understand instantly.',
      skills: ['Figma', 'Research', 'Motion'],
      photo: teamMira,
      links: [
        { label: 'Dribbble', href: 'https://dribbble.com/', icon: 'dribbble' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
      ],
    },
    {
      name: 'Leo Hartmann',
      role: 'Senior frontend engineer',
      years: 9,
      bio: 'React, performance and accessibility nerd. Has strong opinions about your bundle size.',
      skills: ['React', 'Next.js', 'a11y'],
      photo: teamLeo,
      links: [
        { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
        { label: 'X / Twitter', href: 'https://x.com/', icon: 'x' },
      ],
    },
    {
      name: 'Ava Lindqvist',
      role: 'Senior mobile & backend engineer',
      years: 8,
      bio: 'Ships cross-platform apps and the APIs behind them. Unreasonably calm during production incidents.',
      skills: ['React Native', 'Node.js', 'GCP'],
      photo: teamAva,
      links: [
        { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
      ],
    },
  ] satisfies Member[],
};

/* ──────────────────────────── Testimonials ──────────────────────────── */

export const testimonials = {
  eyebrow: 'Testimonials',
  /** html */
  title: 'Clients who came back for <em>round two.</em>',
  lead: 'Most of our work comes from referrals and repeat clients. Here’s what a few of them say.',
  rating: { score: '4.9', label: 'average rating', count: 'from 30+ reviews on Clutch, Upwork & Google' },
  items: [
    {
      quote:
        'Nightloom took our messy MVP and turned it into a platform our enterprise customers actually trust. They think like owners — they pushed back on scope when it mattered and still shipped two weeks early.',
      name: 'Sarah Whitman',
      role: 'CTO',
      company: 'Ledgerly',
      featured: true,
    },
    {
      quote: 'The most transparent team we’ve ever hired. Weekly demos, honest estimates and not a single surprise invoice.',
      name: 'Marcus Feld',
      role: 'Founder',
      company: 'Atelier Home',
    },
    {
      quote: 'They joined mid-project, untangled our codebase and got the app into both stores in eight weeks.',
      name: 'Priya Raman',
      role: 'Head of Product',
      company: 'Pulse Health',
    },
    {
      quote: 'Senior people who genuinely care. Our dispatch tool paid for itself within the first quarter.',
      name: 'Jonas Becker',
      role: 'COO',
      company: 'Relay',
    },
    {
      quote: 'Communication was outstanding — async updates every single day, even across a seven-hour time difference.',
      name: 'Emily Carter',
      role: 'Product Lead',
      company: 'Northvale',
    },
    {
      quote: 'Clean code, great docs and a painless handover. Our in-house team took over without a single blocker.',
      name: 'Tomás Alvarez',
      role: 'VP Engineering',
      company: 'Orbitly',
    },
  ],
};

/* ─────────────────────────────── Pricing ────────────────────────────── */

export const pricing = {
  eyebrow: 'Engagement models',
  /** html */
  title: 'Transparent pricing. <em>Flexible</em> engagement.',
  lead: 'Every project is different, but this is where most clients start. Every plan includes a shared Slack channel, weekly demos and full code ownership.',
  plans: [
    {
      name: 'Project',
      description: 'For MVPs and well-defined products',
      prefix: 'from',
      price: '$15k',
      unit: 'fixed price',
      features: [
        'Discovery & scoping workshop',
        'UX/UI design & clickable prototype',
        'Development, QA & launch',
        '30-day post-launch warranty',
        'Full source code & IP transfer',
      ],
      cta: { label: 'Get a quote', href: '#contact' },
      featured: false,
    },
    {
      name: 'Dedicated team',
      description: 'For ongoing product development',
      prefix: 'from',
      price: '$14k',
      unit: 'per month',
      badge: 'Most popular',
      features: [
        '2–4 senior engineers + a designer',
        'Sprint planning & weekly demos',
        'Flexible scope, monthly billing',
        'Priority support & on-call',
        'Scale up or down with 2 weeks’ notice',
      ],
      cta: { label: 'Book a call', href: '#contact' },
      featured: true,
    },
    {
      name: 'Advisory',
      description: 'For audits, rescues and tech leadership',
      prefix: '',
      price: '$95',
      unit: 'per hour',
      features: [
        'Code & architecture audits',
        'Rescue of stalled projects',
        'Fractional CTO & tech strategy',
        'Performance & security reviews',
        'Hiring & team setup',
      ],
      cta: { label: 'Talk to us', href: '#contact' },
      featured: false,
    },
  ],
  note: 'Not sure which fits? Book a free 30-minute call — we’ll recommend the leanest option, even if it isn’t us.',
};

/* ───────────────────────────────── FAQ ──────────────────────────────── */

export const faq = {
  eyebrow: 'FAQ',
  /** html */
  title: 'Questions, <em>answered.</em>',
  lead: 'Can’t find what you’re looking for? Drop us a line — a real engineer will answer.',
  items: [
    {
      q: 'How much does a typical project cost?',
      a: 'Most MVPs land between $15k and $60k depending on scope and complexity. After a free discovery call you get a fixed-price proposal with a detailed breakdown — no hourly guesswork.',
    },
    {
      q: 'How quickly can you start?',
      a: 'Usually within one to two weeks of signing. We deliberately take on a limited number of projects at a time, so every client gets our full attention.',
    },
    {
      q: 'Who owns the code and intellectual property?',
      a: 'You do — 100%. The code lives in your repositories from day one, and all IP is transferred to you under our contract. No lock-in, ever.',
    },
    {
      q: 'Do you sign NDAs?',
      a: 'Yes. We’re happy to sign your NDA — or send ours — before the first detailed conversation about your idea.',
    },
    {
      q: 'How do we communicate during the project?',
      a: 'A shared Slack channel, daily async updates, a weekly demo call and a shared project board. You always talk directly to the people doing the work.',
    },
    {
      q: 'Which time zones do you work in?',
      a: 'We’re based in Central Europe (CET) and keep at least four hours of overlap with clients on the US East Coast, in the UK, the EU and the Middle East.',
    },
    {
      q: 'Can you take over an existing project?',
      a: 'Absolutely. We start with a short paid code audit, share an honest assessment and a plan, then either continue development or fix what’s blocking you.',
    },
    {
      q: 'What happens after launch?',
      a: 'Every project includes a 30-day warranty. After that you can continue with a monthly support retainer, or hand the product to your in-house team with full documentation.',
    },
  ],
};

/* ─────────────────────────────── Contact ────────────────────────────── */

export const contact = {
  eyebrow: 'Contact',
  /** html */
  title: 'Let’s build something <em>that lasts.</em>',
  lead: 'Tell us about your project. We reply within one business day — usually much sooner.',
  next: {
    title: 'What happens next',
    steps: [
      'We reply within 24 hours',
      'A 30-minute discovery call',
      'A fixed-price proposal in 3 days',
    ],
  },
  form: {
    services: ['Web app', 'Mobile app', 'UI/UX design', 'AI integration', 'Backend / API', 'Something else'],
    budgets: ['< $15k', '$15k – 30k', '$30k – 60k', '$60k +', 'Not sure yet'],
    submit: 'Send message',
    privacy: 'We only use your details to reply to you. NDA available on request.',
    success: {
      title: 'Message received!',
      text: 'Thanks for reaching out — we’ll get back to you within one business day.',
    },
    error: 'Something went wrong — please try again, or email us directly at',
  },
};

/* ─────────────────────────────── Footer ─────────────────────────────── */

export const footer = {
  tagline: 'Senior product engineering studio. Building software that lasts — mostly after dark.',
  columns: [
    {
      title: 'Studio',
      links: [
        { label: 'Work', href: '/#work' },
        { label: 'Services', href: '/#services' },
        { label: 'Process', href: '/#process' },
        { label: 'Team', href: '/#team' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Pricing', href: '/#pricing' },
        { label: 'FAQ', href: '/#faq' },
        { label: 'Contact', href: '/#contact' },
        { label: 'Privacy policy', href: '/privacy' },
      ],
    },
  ] satisfies { title: string; links: Link[] }[],
  copyright: 'Nightloom. All rights reserved.',
};
