export interface DocumentaryProject {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  image: string
  year: string
  duration: string
  location: string
  shortDescription: string
  fullDescription: string
  awards: string[]
  credits: { role: string; name: string }[]
  gallery: string[]
  tags: string[]
  /** Optional trailer / video URL (YouTube/Vimeo/MP4) */
  video?: string
  /** Optional flag for hero/featured display */
  featured?: boolean
}

export const projects: DocumentaryProject[] = [
  {
    id: '1',
    slug: 'the-last-craftsman',
    title: 'The Last Craftsman',
    subtitle: 'A story of tradition, patience, and the hands that shape beauty',
    category: 'Cultural Heritage',
    image: '/images/doc-craftsman.png',
    year: '2024',
    duration: '78 min',
    location: 'Kyoto, Japan',
    shortDescription: 'An intimate portrait of Master Takeshi Yamada, one of Japan\'s last traditional potters, as he confronts the end of a 400-year family legacy.',
    fullDescription: 'In the quiet hills of Kyoto, 82-year-old Master Takeshi Yamada shapes clay the same way his ancestors did four centuries ago. "The Last Craftsman" is an intimate exploration of tradition, identity, and the weight of legacy. Through breathtaking cinematography and deeply personal interviews, the film follows Yamada-san over three years as he confronts a painful reality: none of his children wish to inherit the family kiln. This documentary is not just about pottery — it\'s about the universal human struggle to find meaning in a world that moves faster than our traditions can keep pace. With unprecedented access to Yamada\'s workshop, home, and private reflections, we witness the final chapters of a craft that may soon vanish from the earth.',
    awards: ['Sundance Grand Jury Prize 2024', 'Best Documentary — IDFA', 'Audience Award — Hot Docs'],
    credits: [
      { role: 'Director & Cinematographer', name: 'Alex Rivera' },
      { role: 'Producer', name: 'Yuki Tanaka' },
      { role: 'Editor', name: 'Marcus Chen' },
      { role: 'Sound Design', name: 'Hana Mori' },
      { role: 'Composer', name: 'Kenji Watanabe' },
    ],
    gallery: ['/images/doc-craftsman.png', '/images/about-doc.png', '/images/doc-voices.png'],
    tags: ['Cultural Heritage', 'Japan', 'Craft', 'Tradition', 'Human Story'],
  },
  {
    id: '2',
    slug: 'vanishing-voices',
    title: 'Vanishing Voices',
    subtitle: 'When a language dies, a universe of thought goes with it',
    category: 'Cultural Preservation',
    image: '/images/doc-voices.png',
    year: '2024',
    duration: '92 min',
    location: 'Amazon Basin & Siberia',
    shortDescription: 'A global journey to document the world\'s endangered languages and the last speakers who carry entire universes of human knowledge.',
    fullDescription: 'Every two weeks, a language dies. With it vanishes a unique way of seeing the world, accumulated over millennia. "Vanishing Voices" takes us on an extraordinary journey across three continents to meet the last speakers of endangered languages — from the depths of the Amazon rainforest to the frozen tundra of Siberia. Through their stories, we discover that language is not merely a tool for communication but a living repository of ecological knowledge, cultural memory, and human ingenuity. The film follows linguist Dr. Maria Santos as she races against time to document these vanishing tongues, while also exploring the complex reasons behind language extinction and what it means for the future of human diversity.',
    awards: ['Berlin Film Festival — Best Doc', 'Peabody Award Nominee', 'Emmy Nominee — Outstanding Documentary'],
    credits: [
      { role: 'Director & Cinematographer', name: 'Alex Rivera' },
      { role: 'Producer', name: 'Elena Vasquez' },
      { role: 'Co-Director', name: 'Dr. Maria Santos' },
      { role: 'Editor', name: 'James Okafor' },
      { role: 'Sound Design', name: 'Anika Patel' },
    ],
    gallery: ['/images/doc-voices.png', '/images/doc-ice.png', '/images/doc-rivers.png'],
    tags: ['Language', 'Culture', 'Amazon', 'Siberia', 'Preservation'],
  },
  {
    id: '3',
    slug: 'beneath-the-ice',
    title: 'Beneath the Ice',
    subtitle: 'The Arctic is speaking. Are we listening?',
    category: 'Environmental',
    image: '/images/doc-ice.png',
    year: '2023',
    duration: '105 min',
    location: 'Arctic Circle, Greenland',
    shortDescription: 'Scientists drill into ancient ice to decode Earth\'s climate past, while the Arctic they study melts beneath their feet.',
    fullDescription: 'Two kilometers beneath the Greenland ice sheet lies a record of Earth\'s climate spanning 100,000 years. "Beneath the Ice" follows a team of glaciologists as they drill into this frozen archive, extracting ice cores that reveal our planet\'s climate secrets. But as they work, the ice around them is melting at unprecedented rates. This visually stunning documentary juxtaposes the breathtaking beauty of the Arctic with the urgent reality of climate change. Through intimate footage of life on the ice, cutting-edge scientific discoveries, and the personal stories of researchers who have dedicated their lives to this work, the film creates an emotional and intellectual case for why the Arctic matters to every person on Earth.',
    awards: ['Cannes — Climate Prize', 'National Geographic — Doc of the Year', 'Jackson Wild — Grand Teton Award'],
    credits: [
      { role: 'Director & Cinematographer', name: 'Alex Rivera' },
      { role: 'Producer', name: 'Ingrid Larsen' },
      { role: 'Aerial Cinematography', name: 'Sven Eriksson' },
      { role: 'Editor', name: 'Marcus Chen' },
      { role: 'Composer', name: 'Olaf Johansson' },
    ],
    gallery: ['/images/doc-ice.png', '/images/doc-rivers.png', '/images/doc-craftsman.png'],
    tags: ['Climate', 'Arctic', 'Science', 'Environment', 'Greenland'],
  },
  {
    id: '4',
    slug: 'urban-roots',
    title: 'Urban Roots',
    subtitle: 'From concrete jungles, gardens of hope emerge',
    category: 'Social Impact',
    image: '/images/doc-urban.png',
    year: '2023',
    duration: '85 min',
    location: 'Detroit, USA',
    shortDescription: 'In abandoned lots of Detroit, communities are growing more than food — they\'re growing hope, healing, and a new vision for urban life.',
    fullDescription: 'In the heart of Detroit, where abandoned factories and empty lots tell the story of a city\'s decline, something extraordinary is growing. "Urban Roots" follows five community gardens across Detroit as they transform vacant land into thriving green spaces that feed neighborhoods, heal trauma, and rebuild community bonds. Through the stories of a retired autoworker turned farmer, a single mother finding purpose, and a formerly incarcerated man seeking redemption, we see how the simple act of growing food can catalyze profound social change. This is not just a film about gardening — it\'s a meditation on resilience, community, and the human need to nurture and be nurtured.',
    awards: ['SXSW — Audience Award', 'Tribeca — Special Jury Prize', 'NAACP Image Award Nominee'],
    credits: [
      { role: 'Director & Cinematographer', name: 'Alex Rivera' },
      { role: 'Producer', name: 'Denise Williams' },
      { role: 'Editor', name: 'Amara Johnson' },
      { role: 'Sound Design', name: 'Hana Mori' },
      { role: 'Composer', name: 'Terrence Blake' },
    ],
    gallery: ['/images/doc-urban.png', '/images/doc-ink.png', '/images/doc-voices.png'],
    tags: ['Urban', 'Community', 'Social Impact', 'Detroit', 'Food Justice'],
  },
  {
    id: '5',
    slug: 'silent-rivers',
    title: 'Silent Rivers',
    subtitle: 'What happens when the rivers stop speaking',
    category: 'Environmental',
    image: '/images/doc-rivers.png',
    year: '2022',
    duration: '96 min',
    location: 'Global — 6 Countries',
    shortDescription: 'A global investigation into the dying rivers of the world and the communities fighting to save the veins of our planet.',
    fullDescription: 'Rivers are the arteries of our planet, carrying water, nutrients, and life across continents. But today, many of the world\'s greatest rivers are dying — choked by pollution, drained by overuse, and severed by dams. "Silent Rivers" travels to six countries to document the crisis unfolding along the Ganges, the Colorado, the Danube, the Mekong, the Niger, and the Yangtze. Through breathtaking aerial cinematography, underwater footage, and deeply personal stories of river communities, the film reveals the interconnected nature of our water crisis while highlighting the inspiring efforts of those fighting to restore these vital waterways.',
    awards: ['Wildscreen — Golden Panda', 'EarthX — Best Environmental Film', 'Raindance — Best Documentary'],
    credits: [
      { role: 'Director & Cinematographer', name: 'Alex Rivera' },
      { role: 'Producer', name: 'Li Wei Zhang' },
      { role: 'Underwater Camera', name: 'Raj Patel' },
      { role: 'Editor', name: 'James Okafor' },
      { role: 'Composer', name: 'Anoushka Shankar' },
    ],
    gallery: ['/images/doc-rivers.png', '/images/doc-ice.png', '/images/doc-urban.png'],
    tags: ['Rivers', 'Water', 'Environment', 'Global', 'Pollution'],
  },
  {
    id: '6',
    slug: 'the-ink-keepers',
    title: 'The Ink Keepers',
    subtitle: 'Every mark tells a story. Every story is a rebellion.',
    category: 'Cultural Heritage',
    image: '/images/doc-ink.png',
    year: '2022',
    duration: '88 min',
    location: 'Philippines & New Zealand',
    shortDescription: 'Indigenous tattoo artists across the Pacific are reviving ancient traditions that colonialism tried to erase.',
    fullDescription: 'For centuries, indigenous peoples of the Pacific marked their bodies with intricate tattoos that told stories of identity, status, and spiritual connection. Then colonialism came, and these sacred traditions were suppressed, stigmatized, and nearly lost. "The Ink Keepers" follows three indigenous tattoo artists — a Filipino mambabatok, a Maori ta moko practitioner, and a Samoan tatau master — as they revive these ancient art forms and reclaim their cultural heritage through the very practice that was used to shame their ancestors. With stunning close-up cinematography of the tattooing process, intimate interviews, and archival footage, the film explores how an ancient art form is becoming a powerful tool for cultural resilience.',
    awards: ['Venice — Best Documentary', 'APA — Special Recognition', 'MPI — Best Cultural Doc'],
    credits: [
      { role: 'Director & Cinematographer', name: 'Alex Rivera' },
      { role: 'Producer', name: 'Kiri Aroha' },
      { role: 'Editor', name: 'Amara Johnson' },
      { role: 'Sound Design', name: 'Anika Patel' },
      { role: 'Cultural Advisor', name: 'Chief Tui Malila' },
    ],
    gallery: ['/images/doc-ink.png', '/images/doc-craftsman.png', '/images/doc-voices.png'],
    tags: ['Tattoo', 'Indigenous', 'Culture', 'Pacific', 'Heritage'],
  },
]

export const serviceCategories = [
  {
    title: 'Feature Documentaries',
    description: 'Full-length documentary films that dive deep into stories that matter, from development through final delivery.',
  },
  {
    title: 'Short-Form Docs',
    description: 'Impactful short documentaries for digital platforms, broadcast, and festival circuits.',
  },
  {
    title: 'Docu-Series',
    description: 'Multi-episode documentary series for streaming platforms, with sustained narrative arcs.',
  },
  {
    title: 'Impact Campaigns',
    description: 'Documentary content paired with social impact strategy to drive real-world change.',
  },
]

export const fallbackServices = serviceCategories

export const fallbackTestimonials = [
  {
    id: 't1',
    name: 'Dr. Maria Santos',
    role: 'Linguist, Subject of "Vanishing Voices"',
    content:
      "Alex didn't just document our work — she became part of the journey. The film has brought more attention to language preservation than a thousand academic papers ever could.",
    project: 'Vanishing Voices',
  },
  {
    id: 't2',
    name: 'Ingrid Larsen',
    role: 'Producer, "Beneath the Ice"',
    content:
      "Working with Alex on the Arctic expedition was a masterclass in documentary filmmaking. She endured -40°C temperatures while producing some of the most breathtaking footage I've ever seen.",
    project: 'Beneath the Ice',
  },
  {
    id: 't3',
    name: 'Denise Williams',
    role: 'Community Leader, Detroit',
    content:
      "She earned our trust by showing up — not just with a camera, but with her hands in the soil. 'Urban Roots' tells our story with the dignity and honesty we deserve.",
    project: 'Urban Roots',
  },
  {
    id: 't4',
    name: 'Yuki Tanaka',
    role: 'Co-Producer, "The Last Craftsman"',
    content:
      "Alex spent three years building the relationship that made 'The Last Craftsman' possible. That patience and respect is what sets her apart. A masterpiece of restraint and emotional depth.",
    project: 'The Last Craftsman',
  },
]
