/**
 * SITE CONFIG — easy edits for non-developers
 *
 * Change the brand color, name, contact info, and copy here. Anything edited
 * in the Sanity Studio (/studio) takes priority over this file at runtime.
 *
 * Logo & images: drop new files into /public/images/ and update the paths below.
 * Brand color: any hex value works — it propagates to all "gold" accents site-wide.
 */

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  /* === BRAND === */
  brand: {
    name: 'Alex Rivera',
    discipline: 'Documentary',
    /** Site-wide accent color — any hex */
    color: '#c9a96e',
    /** Logo monogram shown in nav + footer (2 letters works best) */
    logoMark: 'AR',
    /** Optional logo image (path under /public). When set, replaces the monogram. */
    logoImage: '' as string,
  },

  /* === SEO === */
  seo: {
    title: 'Alex Rivera — Documentary Filmmaker & Visual Storyteller',
    description:
      'Award-winning documentary filmmaker telling stories that illuminate the human condition. Cultural heritage, environmental, and social impact documentaries.',
    keywords: [
      'documentary filmmaker',
      'cinematographer',
      'documentary director',
      'cultural heritage',
      'environmental documentary',
    ],
    /** Used by sitemap + canonical URLs */
    siteUrl: 'https://alexrivera.film',
    ogImage: '/images/hero-doc.png',
  },

  /* === HERO === */
  hero: {
    eyebrow: 'Documentary Filmmaker',
    nameLine1: 'Alex',
    nameLine2: 'Rivera',
    headline: 'Films that speak louder than words',
    tagline:
      'Telling stories that illuminate the human condition. Documenting cultures, uncovering truths, revealing the extraordinary.',
    image: '/images/hero-doc.png',
    /** Optional video URL (mp4/webm). When set, plays muted as hero background. */
    video: '' as string,
  },

  /* === ABOUT === */
  about: {
    quote: {
      first:
        "The documentary is the most honest form of filmmaking — you don't invent the truth,",
      accent: ' you uncover it.',
    },
    image: '/images/about-doc.png',
    yearsBadge: '12+',
    paragraphs: [
      "I'm Alex Rivera, a documentary filmmaker dedicated to telling stories that illuminate the human condition and inspire change.",
      'My work takes me to the farthest corners of the globe — from Arctic ice sheets to Amazonian villages, from bustling urban gardens to quiet artisan workshops. I believe documentary film is the most powerful medium we have for building empathy and understanding across cultures.',
      'Every documentary I create begins with a question, not an answer. I approach each story with humility, letting the subjects guide the narrative. The result is cinema that feels authentic, intimate, and deeply human.',
    ],
    stats: [
      { value: '18+', label: 'Documentaries' },
      { value: '34+', label: 'Awards Won' },
      { value: '25+', label: 'Countries' },
    ],
    tools: [
      'Cinematic Vérité',
      'Observational',
      'Participatory',
      'ARRI Alexa Mini',
      'DaVinci Resolve',
      'DJI Inspire 3',
      'Immersive Sound',
      'Multi-year Projects',
    ],
  },

  /* === CONTACT === */
  contact: {
    email: 'hello@alexrivera.film',
    location: 'Los Angeles, California',
    responseTime: 'Within 24 hours',
    studioHours:
      'Monday – Friday, 9am – 6pm PST. In the field globally — replies may take longer during shoots.',
    isAvailable: true,
    availabilityYear: 2026,
    socials: {
      instagram: '',
      vimeo: '',
      letterboxd: '',
      twitter: '',
    },
  },

  /* === RECOGNITION — the scrolling band of awards/press. Leave the list empty to hide it === */
  recognitions: [
    'Sundance — Grand Jury Prize',
    'Cannes — Climate Prize',
    'Berlin — Best Documentary',
    'Venice — Best Documentary',
    'Tribeca — Special Jury',
    'IDFA — Best Doc',
    'SXSW — Audience Award',
    'Hot Docs — Audience Award',
    'Peabody Nominee',
    'Emmy Nominee',
    'Wildscreen — Golden Panda',
    'Jackson Wild — Grand Teton',
  ],

  /* === PROCESS — the Timeline steps === */
  process: [
    {
      title: 'Discovery',
      description:
        'Deep research and immersion, building trust with communities and identifying the emotional core.',
    },
    {
      title: 'Production',
      description:
        'Extended field shoots with cinematic cameras, capturing authentic moments and intimate interviews.',
    },
    {
      title: 'Crafting',
      description:
        'Meticulous editing, sound design, and color grading that transforms raw footage into a compelling narrative.',
    },
    {
      title: 'Impact',
      description:
        'Festival strategy, distribution, and impact campaigns ensuring your documentary reaches and moves audiences.',
    },
  ],

  /* === FOOTER === */
  footer: {
    tagline:
      'Award-winning documentary filmmaker telling stories that illuminate, inspire, and drive change.',
  },
} as const
