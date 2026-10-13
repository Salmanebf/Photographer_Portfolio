/**
 * Test documents for the fake Sanity API (`npm run cms:mock`).
 * Everything here is deliberately recognisable ("(CMS)", "Mock …") so it is
 * obvious on the page when content comes from the CMS instead of the placeholders.
 */
const ref = (id) => ({ _type: 'reference', _ref: id })
const image = (assetId) => ({ _type: 'image', asset: ref(assetId) })
const asset = (id, file, width, height) => ({
  _id: id,
  _type: 'sanity.imageAsset',
  url: `/images/${file}`,
  metadata: { dimensions: { width, height } },
})

export const baseDocuments = () => [
  /* ---------- image assets (served from the site's own /public/images) ---------- */
  asset('image-craftsman', 'doc-craftsman.png', 1024, 1024),
  asset('image-ice', 'doc-ice.png', 1024, 1024),
  asset('image-rivers', 'doc-rivers.png', 1024, 1024),
  asset('image-hero', 'hero-doc.png', 1536, 1024),
  asset('image-share', 'doc-ink.png', 1200, 630),

  /* ---------- site settings (the single settings document) ---------- */
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'Alex Rivera (CMS)',
    brandColor: '#3b9d8f',
    discipline: { en: 'Documentary (CMS)', fr: 'Documentaire (CMS)' },
    seoTitle: { en: 'CMS Title — Documentary Filmmaker', fr: 'Titre CMS — Cinéaste documentariste' },
    seoDescription: { en: 'Description written in the CMS.', fr: 'Description écrite dans le CMS.' },
    seoKeywords: [{ en: 'cms keyword', fr: 'mot-clé cms' }, { en: 'second keyword' }],
    seoImage: image('image-share'),
    heroImage: image('image-hero'),
    heroHeadline: { en: 'Stories from the CMS', fr: 'Histoires du CMS' },
    heroTagline: { en: 'A tagline written in the CMS.', fr: 'Une accroche écrite dans le CMS.' },
    aboutQuote: { en: 'CMS quote first part, and the accent.', fr: 'Citation CMS première partie, et l’accent.' },
    aboutParagraphs: [{ en: 'CMS paragraph one.', fr: 'Paragraphe CMS un.' }, { en: 'CMS paragraph two (English only).' }],
    aboutTools: [{ en: 'Mock camera', fr: 'Caméra fictive' }],
    aboutStats: [{ value: '9', label: { en: 'Mock stat', fr: 'Stat fictive' } }],
    recognitions: [
      { en: 'Mock Festival — Jury Prize', fr: 'Festival fictif — Prix du jury' },
      { en: 'Mock Press — Featured' },
      { en: 'Mock Award — Nominee', fr: 'Prix fictif — Nommé' },
    ],
    processSteps: [
      { _key: 'p1', title: { en: 'Listen', fr: 'Écouter' }, description: { en: 'We start by listening.', fr: 'Nous commençons par écouter.' } },
      { _key: 'p2', title: { en: 'Film', fr: 'Filmer' }, description: { en: 'We film on location.' } },
      { _key: 'p3', title: { en: 'Finish' }, description: { en: 'Edit, sound and colour.' } },
    ],
    contactEmail: 'cms@example.com',
    contactLocation: { en: 'Mock City', fr: 'Ville fictive' },
    contactResponseTime: { en: 'Within a mock day', fr: 'Sous un jour fictif' },
    studioHours: { en: 'Mock hours', fr: 'Horaires fictifs' },
    isAvailable: true,
    availabilityYear: 2027,
    footerTagline: { en: 'Footer written in the CMS.', fr: 'Pied de page écrit dans le CMS.' },
  },

  /* ---------- films ---------- */
  {
    _id: 'project-one',
    _type: 'project',
    title: { en: 'Mock Film One', fr: 'Film fictif un' },
    slug: { current: 'mock-film-one' },
    subtitle: { en: 'First mock subtitle', fr: 'Premier sous-titre fictif' },
    category: 'environmental',
    year: '2025',
    duration: '60 min',
    location: { en: 'Mock Place', fr: 'Lieu fictif' },
    shortDescription: { en: 'Short English description.', fr: 'Courte description française.' },
    fullDescription: { en: 'Long English description.', fr: 'Longue description française.' },
    awards: ['Mock Prize 2025'],
    credits: [{ role: { en: 'Director', fr: 'Réalisation' }, name: 'Alex Rivera' }],
    tags: ['mock'],
    image: image('image-craftsman'),
    gallery: [image('image-ice'), image('image-rivers')],
    order: 1,
  },
  {
    _id: 'project-two',
    _type: 'project',
    title: { en: 'Mock Film Two (English only)' },
    slug: { current: 'mock-film-two' },
    category: 'social-impact',
    year: '2024',
    duration: '45 min',
    location: { en: 'Elsewhere' },
    shortDescription: { en: 'Only written in English.' },
    fullDescription: { en: 'Only written in English, in full.' },
    credits: [],
    image: image('image-ice'),
    gallery: [],
    order: 2,
  },

  /* ---------- photography ---------- */
  {
    _id: 'series-one',
    _type: 'photoSeries',
    title: { en: 'Mock Series', fr: 'Série fictive' },
    slug: { current: 'mock-series' },
    description: { en: 'A mock series.' },
    location: { en: 'Mock Coast', fr: 'Côte fictive' },
    year: '2025',
    coverImage: image('image-ice'),
    relatedProject: ref('project-one'),
    photos: [
      { _key: 'a', image: image('image-ice'), alt: { en: 'An icy shore', fr: 'Un rivage glacé' }, caption: { en: 'Cold light' } },
      { _key: 'b', image: image('image-rivers'), alt: {} },
    ],
    order: 1,
  },

  /* ---------- services & testimonials ---------- */
  { _id: 'service-one', _type: 'service', title: { en: 'Mock Service One', fr: 'Service fictif un' }, description: { en: 'First mock service.', fr: 'Premier service fictif.' }, order: 1 },
  { _id: 'service-two', _type: 'service', title: { en: 'Mock Service Two' }, description: { en: 'Second mock service.' }, order: 2 },
  {
    _id: 'testimonial-one',
    _type: 'testimonial',
    name: 'Mock Person',
    role: { en: 'Mock role', fr: 'Rôle fictif' },
    content: { en: 'A kind mock word.', fr: 'Un mot gentil fictif.' },
    project: ref('project-one'),
    order: 1,
  },
]

/** Unpublished changes: shown only in preview (draft) mode. */
export const draftDocuments = () => [
  // an unpublished edit of an existing film…
  {
    _id: 'drafts.project-one',
    _type: 'project',
    title: { en: 'DRAFT TITLE of Film One', fr: 'TITRE BROUILLON du film un' },
    slug: { current: 'mock-film-one' },
    category: 'environmental',
    year: '2025',
    duration: '60 min',
    location: { en: 'Mock Place', fr: 'Lieu fictif' },
    shortDescription: { en: 'Short English description.', fr: 'Courte description française.' },
    fullDescription: { en: 'Long English description.', fr: 'Longue description française.' },
    credits: [],
    image: image('image-craftsman'),
    gallery: [],
    order: 1,
  },
  // …and a film that has never been published.
  {
    _id: 'drafts.project-new',
    _type: 'project',
    title: { en: 'UNPUBLISHED Mock Film', fr: 'Film fictif NON PUBLIÉ' },
    slug: { current: 'mock-film-unpublished' },
    category: 'other',
    year: '2026',
    duration: '10 min',
    location: { en: 'Nowhere' },
    shortDescription: { en: 'Not published yet.' },
    fullDescription: { en: 'Not published yet, in full.' },
    credits: [],
    image: image('image-craftsman'),
    gallery: [],
    order: 3,
  },
]
