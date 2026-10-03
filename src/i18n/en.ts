import type { Content } from './types';

/**
 * English copy. All of it is placeholder text written to show the tone of voice —
 * replace names, numbers, clients and quotes with your own before publishing.
 */
const en: Content = {
  locale: 'en',
  htmlLang: 'en',
  ogLocale: 'en_US',

  meta: {
    title: 'Nightloom\u00a0— Independent engineering studio',
    description:
      'Nightloom is a four-person engineering studio. We design, build and look after web and mobile products for founders and teams who value craft over noise.',
  },

  a11y: {
    skip: 'Skip to content',
    home: 'Nightloom\u00a0— home',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    language: 'Language',
    canvas: 'A loom weaving the Nightloom ghost, thread by thread',
    close: 'Close',
  },

  nav: {
    links: [
      { href: '#work', label: 'Work' },
      { href: '#services', label: 'Services' },
      { href: '#process', label: 'Process' },
      { href: '#studio', label: 'Studio' },
      { href: '#faq', label: 'FAQ' },
    ],
    cta: 'Start a project',
    availability: 'Booking from November',
  },

  hero: {
    eyebrow: 'Independent engineering studio',
    location: 'Est. 2019 · Remote across Europe',
    title: 'Software,<br><em>woven</em> to last.',
    lede: 'Nightloom is a studio of four senior engineers. We design, build and look after web and mobile products\u00a0— for founders and teams who value craft over noise.',
    primary: 'Start a project',
    secondary: 'Selected work',
    clientsLabel: 'Trusted by teams at',
    scroll: 'Scroll',
  },

  loom: {
    label: 'Manifesto',
    chapters: [
      {
        kicker: 'Lyon, 1804',
        title: 'A loom that reads <em>instructions.</em>',
        text: 'Joseph Marie Jacquard builds a loom driven by punched cards. One hole lifts one thread; a chain of cards can weave any pattern imaginable.',
      },
      {
        kicker: 'The first program',
        title: 'Pattern, <em>as code.</em>',
        text: 'Charles Babbage borrows the cards for his Analytical Engine. Every program written since descends from a strip of perforated card.',
      },
      {
        kicker: 'Two centuries on',
        title: 'We still <em>weave.</em>',
        text: 'Interfaces, systems, infrastructure\u00a0— thread by thread, line by line, until the pattern holds under real load.',
      },
      {
        kicker: 'Nightloom',
        title: 'Quiet work.<br><em>Lasting</em> things.',
        text: 'A small studio for software that is made with care and keeps working long after launch day.',
      },
    ],
    hud: { card: 'Card', weaving: 'Weaving', woven: 'Woven', warp: 'Warp', weft: 'Weft' },
  },

  work: {
    label: 'Selected work',
    aside: '2021\u00a0— 2026',
    title: 'Work we are quietly <em>proud</em> of.',
    intro: 'A few projects from recent years. Much of our work is under NDA\u00a0— we are happy to walk you through more on a call.',
    open: 'Read the case',
    labels: {
      challenge: 'Challenge',
      approach: 'Approach',
      results: 'Results',
      stack: 'Stack',
      duration: 'Duration',
      team: 'Team',
      year: 'Year',
      visit: 'Visit the product',
      discuss: 'Discuss a similar project',
    },
    items: [
      {
        id: 'halcyon',
        client: 'Halcyon',
        title: 'Treasury platform for a European fintech',
        year: '2025',
        tags: ['Fintech', 'Web platform', 'Design system'],
        metric: { value: '5 days → 4 h', label: 'month-end reconciliation' },
        art: 'halcyon',
        summary:
          'Halcyon manages liquidity for 300+ mid-size companies across the EU. We rebuilt their treasury platform from a tangle of spreadsheets and scripts into one calm, auditable product.',
        challenge:
          'Finance teams spent the first week of every month reconciling accounts by hand across 14 banks. Errors were frequent, audits were painful and the legacy code was too fragile to touch.',
        approach:
          'Two weeks of discovery with the finance team, then a strangler-fig migration: a new reconciliation engine in Go, a typed React front end on our own design system, and banking integrations moved over one at a time\u00a0— with zero downtime.',
        results: [
          { value: '5 days → 4 h', label: 'month-end reconciliation' },
          { value: '−92%', label: 'manual corrections' },
          { value: '99.98%', label: 'uptime in the first year' },
        ],
        stack: ['Go', 'PostgreSQL', 'TypeScript', 'React', 'AWS', 'Terraform'],
        duration: '7 months',
        team: '4 people',
      },
      {
        id: 'lumen',
        client: 'Lumen Health',
        title: 'Patient companion app, iOS & Android',
        year: '2024',
        tags: ['Healthtech', 'Mobile', 'GDPR'],
        metric: { value: '4.8 ★', label: 'App Store · 120k monthly users' },
        art: 'lumen',
        summary:
          'A companion app that helps patients with chronic conditions keep up with treatment: medication reminders, symptom journals and a secure line to their care team.',
        challenge:
          'The first version was built by three different agencies. It crashed on older phones, reviews had dropped to 2.9 stars and the clinical partners were losing patience.',
        approach:
          'We audited the codebase, kept what was sound and rebuilt the rest in React Native with a native Swift and Kotlin layer for notifications and health data. Accessibility and offline mode were designed in from day one.',
        results: [
          { value: '2.9 → 4.8', label: 'App Store rating' },
          { value: '99.7%', label: 'crash-free sessions' },
          { value: '+41%', label: 'treatment adherence' },
        ],
        stack: ['React Native', 'Swift', 'Kotlin', 'Node.js', 'PostgreSQL', 'GCP'],
        duration: '5 months',
        team: '3 people',
      },
      {
        id: 'morrow',
        client: 'Morrow',
        title: 'Headless commerce for a furniture brand',
        year: '2024',
        tags: ['E-commerce', 'Performance', 'Headless'],
        metric: { value: '+38%', label: 'conversion after relaunch' },
        art: 'morrow',
        summary:
          'Morrow makes slow furniture in small batches. Their new store had to feel as considered as the pieces themselves\u00a0— and load instantly on a phone in a showroom with bad signal.',
        challenge:
          'A heavy theme-based store with a 6-second load time on mobile, a checkout that dropped one in three customers and a catalogue the team was afraid to edit.',
        approach:
          'A headless storefront on Next.js and Shopify, image pipelines tuned for large product photography, and a content model that lets the team publish collections without a developer.',
        results: [
          { value: '+38%', label: 'conversion rate' },
          { value: '6.1 → 0.8 s', label: 'largest contentful paint' },
          { value: '−27%', label: 'checkout abandonment' },
        ],
        stack: ['Next.js', 'Shopify', 'Sanity', 'Vercel', 'Cloudinary'],
        duration: '3 months',
        team: '3 people',
      },
      {
        id: 'arcwell',
        client: 'Arcwell',
        title: 'Internal developer platform for logistics',
        year: '2023',
        tags: ['DevOps', 'Kubernetes', 'Tooling'],
        metric: { value: '2 h → 9 min', label: 'from merge to production' },
        art: 'arcwell',
        summary:
          'Arcwell moves freight for 2,000 shippers. Their 60-person engineering team needed a paved road from commit to production that nobody had to think about.',
        challenge:
          'Releases were a weekly ritual that took two hours and a senior engineer on call. Environments drifted, costs grew 30% a year and incidents were found by customers first.',
        approach:
          'We designed a small internal platform: GitOps deployments, ephemeral preview environments, golden-path service templates and SLO-based alerting\u00a0— then trained the team and handed it over.',
        results: [
          { value: '2 h → 9 min', label: 'merge to production' },
          { value: '−34%', label: 'cloud spend' },
          { value: '12×', label: 'more deploys per week' },
        ],
        stack: ['Kubernetes', 'Argo CD', 'Terraform', 'GitHub Actions', 'Grafana', 'AWS'],
        duration: '6 months',
        team: '2 people',
      },
    ],
    note: 'Most of our work is under NDA. Ask us for references\u00a0— we will put you in touch with clients directly.',
  },

  services: {
    label: 'Services',
    title: 'What we do, <em>exceptionally</em> well.',
    intro: 'We keep our focus narrow on purpose. Everything below is done by the same four people, from the first sketch to production.',
    prefill: 'Hi! We would like to talk about {item}.',
    items: [
      {
        title: 'Product engineering',
        text: 'Web applications and platforms, from the first commit to scale. Typed end to end, tested and observable.',
        tags: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Go', 'PostgreSQL'],
      },
      {
        title: 'Mobile apps',
        text: 'iOS and Android apps that feel truly native, shipped from one carefully structured codebase.',
        tags: ['React Native', 'Expo', 'Swift', 'Kotlin'],
      },
      {
        title: 'Interface design',
        text: 'Calm, precise interfaces and design systems that engineers enjoy building and users never have to think about.',
        tags: ['Product design', 'Design systems', 'Prototyping', 'Figma'],
      },
      {
        title: 'Infrastructure & DevOps',
        text: 'Cloud architecture, CI/CD, monitoring and cost control\u00a0— so nothing breaks at three in the morning.',
        tags: ['AWS', 'GCP', 'Kubernetes', 'Terraform'],
      },
      {
        title: 'Audit & rescue',
        text: 'We step into struggling projects, find out what is really wrong and fix it\u00a0— without drama or blame.',
        tags: ['Code review', 'Performance', 'Security', 'Refactoring'],
      },
    ],
  },

  process: {
    label: 'Process',
    title: 'A calm, <em>transparent</em> process.',
    intro: 'No black boxes. You see the work every week and can open a live build at any moment.',
    steps: [
      {
        title: 'Discovery',
        duration: '1–2 weeks',
        text: 'We dig into goals, users and constraints. You get a clear scope, an architecture sketch and a fixed estimate.',
        deliverables: ['Scope & roadmap', 'Architecture', 'Fixed estimate'],
      },
      {
        title: 'Design',
        duration: '2–4 weeks',
        text: 'Interfaces designed in short loops with you. Clickable prototypes before a single line of production code.',
        deliverables: ['User flows', 'Interface design', 'Prototype'],
      },
      {
        title: 'Build',
        duration: '6–16 weeks',
        text: 'Two-week sprints, a demo every week and a staging link that is always up to date.',
        deliverables: ['Weekly demos', 'Staging environment', 'Automated tests'],
      },
      {
        title: 'Launch & care',
        duration: 'Ongoing',
        text: 'We ship carefully, watch closely and stay\u00a0— with support plans and steady improvement.',
        deliverables: ['Release plan', 'Monitoring', 'SLA support'],
      },
    ],
  },

  principles: {
    label: 'Why Nightloom',
    title: 'Why teams <em>stay</em> with us.',
    stats: [
      { value: 7, label: 'years working together' },
      { value: 48, label: 'products shipped' },
      { value: 92, suffix: '%', label: 'of clients come back' },
      { value: 4.9, decimals: 1, label: 'average rating on Clutch' },
    ],
    items: [
      {
        title: 'Senior hands only',
        text: 'Every line is written by engineers with eight or more years of experience. Nobody learns on your budget.',
      },
      {
        title: 'A direct line',
        text: 'You talk to the people who build your product. No account managers, no broken telephone.',
      },
      {
        title: 'Honest estimates',
        text: 'We estimate carefully and stand by our numbers. If the scope changes, you see the cost before we start.',
      },
      {
        title: 'Yours from day one',
        text: 'Code, designs, infrastructure and accounts belong to you. Full IP transfer, always.',
      },
      {
        title: 'Proof every week',
        text: 'Every week you see working software\u00a0— not status reports and slides.',
      },
      {
        title: 'We stay',
        text: 'Most clients work with us for years. Support is not an upsell; it is part of the craft.',
      },
    ],
  },

  team: {
    label: 'Studio',
    title: 'Four people. <em>One</em> loom.',
    intro: 'We have worked together since 2019. Small by design\u00a0— so every project gets our full and undivided attention.',
    experience: 'years in the craft',
    weaves: { twill: 'Twill', herringbone: 'Herringbone', diamond: 'Diamond', houndstooth: 'Houndstooth' },
    members: [
      {
        name: 'Mark Orlov',
        role: 'Founder · Engineering lead',
        years: '12',
        bio: 'Architecture, back end and the problems nobody else wants. Previously a staff engineer in fintech.',
        weave: 'twill',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
      {
        name: 'Elena Sorokina',
        role: 'Product designer',
        years: '9',
        bio: 'Interfaces, design systems and the courage to remove features. Formerly lead designer at a SaaS scale-up.',
        weave: 'herringbone',
        links: [
          { label: 'Dribbble', href: 'https://dribbble.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
      {
        name: 'Daniel Kim',
        role: 'Front end & mobile lead',
        years: '10',
        bio: 'React, React Native and the last ten per cent of polish that makes software feel right.',
        weave: 'diamond',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
      {
        name: 'Ivan Petrov',
        role: 'Infrastructure & back end',
        years: '11',
        bio: 'Cloud, databases and calm on-call nights. Has not lost a byte of production data. Yet.',
        weave: 'houndstooth',
        links: [
          { label: 'GitHub', href: 'https://github.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        ],
      },
    ],
    note: 'Need a bigger team? We work with trusted partners for QA, data and content\u00a0— vetted, and managed by us.',
  },

  testimonials: {
    label: 'Clients',
    prev: 'Previous testimonial',
    next: 'Next testimonial',
    items: [
      {
        quote:
          'Nightloom felt less like a contractor and more like the senior team we could never hire. They shipped on the date they promised\u00a0— to the day.',
        name: 'Sophie Laurent',
        role: 'CTO',
        company: 'Halcyon',
      },
      {
        quote:
          'They rebuilt our app in five months without a single critical incident. Calm, precise and refreshingly honest about trade-offs.',
        name: 'Jonas Weber',
        role: 'Head of Product',
        company: 'Lumen Health',
      },
      {
        quote:
          'The rare team that cares about the details nobody sees. Two years later the codebase is still a pleasure to work in.',
        name: 'Anna Kowalska',
        role: 'Founder',
        company: 'Morrow',
      },
    ],
  },

  engagement: {
    label: 'Engagement',
    title: 'Ways to work <em>together</em>.',
    intro: 'Clear terms and predictable costs. Pick a format\u00a0— or we will suggest one after the first call.',
    popular: 'Most chosen',
    prefill: 'Hi! We are interested in the “{item}” format.',
    plans: [
      {
        name: 'Project',
        tagline: 'Fixed scope, fixed price.',
        price: 'from $25k',
        period: '2–4 months',
        text: 'For MVPs, relaunches and well-defined products.',
        features: ['Discovery and a fixed estimate', 'Design and development', 'Weekly demos', '30 days of free support'],
        cta: 'Discuss a project',
      },
      {
        name: 'Dedicated team',
        tagline: 'Our team, your roadmap.',
        price: 'from $18k',
        period: 'per month',
        text: 'For ongoing product development with a stable, senior team.',
        features: ['2–4 engineers and a designer', 'Sprint planning and weekly demos', 'Monthly billing, cancel anytime', 'Priority support'],
        cta: 'Book a team',
        featured: true,
      },
      {
        name: 'Audit & advisory',
        tagline: 'A senior second opinion.',
        price: 'from $4k',
        period: '1–2 weeks',
        text: 'For code, architecture, performance or security reviews.',
        features: ['Written report', 'Prioritised roadmap', 'Walkthrough call', 'Optional follow-up fixes'],
        cta: 'Request an audit',
      },
    ],
    note: 'Every engagement includes an NDA, full IP transfer and repository access from day one.',
  },

  faq: {
    label: 'FAQ',
    title: 'Questions, <em>answered</em>.',
    asideTitle: 'Didn’t find yours?',
    asideText: 'Write to us\u00a0— a real engineer will reply within one business day.',
    asideCta: 'Ask a question',
    items: [
      {
        q: 'What size of projects do you take on?',
        a: 'Typically from $15k and six weeks upwards. Smaller pieces of work\u00a0— audits, consultations, urgent fixes\u00a0— are welcome too, as long as we can genuinely help.',
      },
      {
        q: 'Do you sign NDAs? Who owns the code?',
        a: 'Yes, we sign your NDA before the first detailed conversation. All code, designs and accounts belong to you; intellectual property is transferred in the contract.',
      },
      {
        q: 'How do you estimate, and what if the scope changes?',
        a: 'After discovery we give a fixed estimate for a clearly described scope. Changes are welcome: we estimate each one separately and you decide before any work starts.',
      },
      {
        q: 'Which time zones do you work in?',
        a: 'We are based in Europe (GMT+1 to GMT+4) and keep at least four hours of overlap with clients on the US East Coast and in Asia.',
      },
      {
        q: 'Can you take over an existing codebase?',
        a: 'Yes. We start with a one-week audit, share an honest report and a plan, and only then take responsibility for the product.',
      },
      {
        q: 'What happens after launch?',
        a: 'Every project includes 30 days of free support. After that, most clients choose a monthly support plan with a guaranteed response time.',
      },
      {
        q: 'How quickly can you start?',
        a: 'Usually within two to four weeks. Audits and urgent rescues can often start within a few days.',
      },
      {
        q: 'How do payments work?',
        a: 'Projects are billed by milestones, typically 30 / 40 / 30. Dedicated teams are billed monthly. We invoice from a European company and accept bank transfers and cards.',
      },
    ],
  },

  contact: {
    label: 'Contact',
    title: 'Have something worth <em>building</em>?',
    intro: 'Tell us about your project. We reply within one business day\u00a0— usually much sooner.',
    form: {
      name: 'Your name',
      email: 'Email',
      company: 'Company',
      optional: 'optional',
      budget: 'Budget',
      budgets: ['< $15k', '$15–30k', '$30–60k', '$60k+', 'Not sure yet'],
      message: 'About the project',
      messagePlaceholder: 'What are you building, and where are you stuck?',
      submit: 'Send inquiry',
      sending: 'Sending…',
      privacy: 'We use your details only to reply to you. No newsletters, no third parties.',
      successTitle: 'Thank you.',
      successText: 'Your message is on its way. We will reply within one business day.',
      mailtoTitle: 'Almost there.',
      mailtoText: 'Your email app should have opened with the letter ready to send. If it didn’t, write to us at',
      error: 'Something went wrong on our side. Please write to us directly at',
      again: 'Send another message',
      required: 'Please fill in this field.',
      invalidEmail: 'Please enter a valid email address.',
      tooShort: 'A couple more sentences would help us prepare.',
      subject: 'New project inquiry',
    },
    direct: {
      title: 'Prefer to write directly?',
      email: 'Email',
      telegram: 'Telegram',
      call: 'Book a 30-minute call',
      callText: 'Pick a time that suits you\u00a0— no slides, no pressure.',
      copy: 'Copy',
      copied: 'Copied',
    },
    next: {
      title: 'What happens next',
      steps: [
        'Within 24 hours we reply with first thoughts and a few questions.',
        'A 30-minute call to understand your goals\u00a0— free and without obligation.',
        'Within 3–5 days you receive a proposal with scope, timeline and a fixed price.',
      ],
    },
  },

  footer: {
    tagline: 'Independent engineering studio. Woven at night since 2019.',
    columns: { studio: 'Studio', contact: 'Contact', elsewhere: 'Elsewhere' },
    localTime: 'Local time',
    moon: 'Tonight',
    phases: [
      'New moon',
      'Waxing crescent',
      'First quarter',
      'Waxing gibbous',
      'Full moon',
      'Waning gibbous',
      'Last quarter',
      'Waning crescent',
    ],
    top: 'Back to top',
    rights: 'All rights reserved.',
    privacy: 'Privacy',
  },

  privacy: {
    meta: {
      title: 'Privacy\u00a0— Nightloom',
      description: 'What the Nightloom website does with your data: what we collect, why, for how long, and how to reach us about it.',
    },
    label: 'Privacy policy',
    title: 'Your data, <em>without the fine print.</em>',
    updated: 'Last updated: October 2026',
    intro: 'This site is a business card, not a data funnel. Here is everything it does with your information\u00a0— in plain words.',
    sections: [
      {
        title: 'Who we are',
        text: ['{company}, {address} ({registration}) is responsible for the data described on this page. You can reach us at {email}.'],
      },
      {
        title: 'What we collect',
        text: [
          'Only what you choose to send us: your name, email, company, budget range and the message you write in the contact form or in an email.',
          'We do not use analytics, advertising pixels or tracking cookies. Fonts and scripts are served from our own domain.',
          'Our hosting provider keeps standard server logs (IP address, browser, time of the request) for up to 30 days to keep the site secure.',
        ],
      },
      {
        title: 'Why we use it',
        text: [
          'To answer your request, prepare a proposal and, if we work together, to run the project. The legal basis is your request and our legitimate interest in replying to it.',
        ],
      },
      {
        title: 'Who sees it',
        text: [
          'The four of us. Form submissions pass through our form provider, which processes them on our behalf and keeps them no longer than needed to deliver them. We never sell your data or share it for marketing.',
        ],
      },
      {
        title: 'How long we keep it',
        text: [
          'Enquiries that do not turn into a project are deleted after 12 months. Project correspondence is kept for as long as accounting and contract law require.',
        ],
      },
      {
        title: 'Your browser',
        text: [
          'We store exactly one thing in your browser: the language you picked (the “nl-locale” key in local storage), so the site opens in it next time. You can clear it at any time in your browser settings.',
        ],
      },
      {
        title: 'Your rights',
        text: [
          'You can ask what we hold about you, correct it, delete it or object to its use. Write to {email}\u00a0— we reply within 30 days, usually much sooner. You can also complain to the data protection authority in your country.',
        ],
      },
      {
        title: 'Changes',
        text: ['If anything here changes, we will update this page and the date at the top.'],
      },
    ],
    questions: 'Questions about your data?',
  },

  notFound: {
    title: 'This thread<br>came <em>loose.</em>',
    text: 'The page you are looking for has moved or never existed.',
    back: 'Back to the studio',
  },
};

export default en;
