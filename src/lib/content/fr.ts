import type { LocaleContent } from './types'

/**
 * French content (placeholder text, like the English). Draft translation —
 * to be reviewed by a native speaker before launch. Anything missing here
 * falls back to English.
 */
export const fr: LocaleContent = {
  site: {
    brand: { discipline: 'Documentaire' },
    seo: {
      title: 'Alex Rivera — Cinéaste documentariste et conteur visuel',
      description:
        "Cinéma documentaire primé, au service d'histoires qui éclairent la condition humaine. Documentaires sur le patrimoine culturel, l'environnement et l'impact social.",
      keywords: [
        'cinéaste documentariste',
        'réalisation de documentaires',
        'directeur de la photographie',
        'patrimoine culturel',
        'documentaire environnemental',
      ],
    },
    hero: {
      eyebrow: 'Cinéaste documentariste',
      tagline:
        "Raconter des histoires qui éclairent la condition humaine. Documenter les cultures, révéler les vérités, dévoiler l'extraordinaire.",
      stats: [
        { value: 18, suffix: '+', label: 'Films' },
        { value: 12, suffix: '', label: 'Années' },
        { value: 34, suffix: '+', label: 'Récompenses' },
      ],
    },
    about: {
      quote: {
        first:
          "Le documentaire est la forme la plus honnête du cinéma — on n'invente pas la vérité,",
        accent: ' on la dévoile.',
      },
      paragraphs: [
        "Je suis Alex Rivera, cinéaste documentariste, et je consacre mon travail à des histoires qui éclairent la condition humaine et donnent envie de changer les choses.",
        "Mon travail m'emmène aux quatre coins du monde — des banquises de l'Arctique aux villages d'Amazonie, des jardins urbains animés aux ateliers d'artisans silencieux. Je crois que le film documentaire est le médium le plus puissant dont nous disposons pour construire l'empathie et la compréhension entre les cultures.",
        "Chacun de mes documentaires commence par une question, pas par une réponse. J'aborde chaque histoire avec humilité, en laissant les personnes filmées guider le récit. Le résultat est un cinéma authentique, intime et profondément humain.",
      ],
      stats: [
        { value: '18+', label: 'Documentaires' },
        { value: '34+', label: 'Récompenses' },
        { value: '25+', label: 'Pays' },
      ],
      tools: [
        'Cinéma vérité',
        'Observationnel',
        'Participatif',
        'ARRI Alexa Mini',
        'DaVinci Resolve',
        'DJI Inspire 3',
        'Son immersif',
        'Projets pluriannuels',
      ],
    },
    contact: {
      location: 'Los Angeles, Californie',
      responseTime: 'Sous 24 heures',
      studioHours:
        "Du lundi au vendredi, de 9 h à 18 h (heure du Pacifique). Sur le terrain dans le monde entier — les réponses peuvent prendre plus de temps pendant les tournages.",
    },
    footer: {
      tagline:
        "Un cinéma documentaire primé, pour des histoires qui éclairent, inspirent et font bouger les choses.",
    },
  },

  projects: {
    'the-last-craftsman': {
      title: 'Le Dernier Artisan',
      subtitle: "Une histoire de tradition, de patience et des mains qui façonnent la beauté",
      location: 'Kyoto, Japon',
      shortDescription:
        "Le portrait intime du maître Takeshi Yamada, l'un des derniers potiers traditionnels du Japon, face à la fin d'un héritage familial vieux de 400 ans.",
      fullDescription:
        "Dans les collines silencieuses de Kyoto, le maître Takeshi Yamada, 82 ans, façonne l'argile comme ses ancêtres le faisaient il y a quatre siècles. « Le Dernier Artisan » est une exploration intime de la tradition, de l'identité et du poids de l'héritage. À travers une photographie saisissante et des entretiens très personnels, le film suit Yamada-san pendant trois ans alors qu'il affronte une réalité douloureuse : aucun de ses enfants ne souhaite hériter du four familial. Ce documentaire ne parle pas seulement de poterie — il parle de la lutte universelle pour trouver du sens dans un monde qui va plus vite que nos traditions. Avec un accès sans précédent à l'atelier, au foyer et aux réflexions intimes de Yamada, nous assistons aux derniers chapitres d'un savoir-faire qui pourrait bientôt disparaître de la terre.",
      awards: [
        'Grand prix du jury, Sundance 2024',
        'Meilleur documentaire — IDFA',
        'Prix du public — Hot Docs',
      ],
      credits: [
        { role: 'Réalisation et image', name: 'Alex Rivera' },
        { role: 'Production', name: 'Yuki Tanaka' },
        { role: 'Montage', name: 'Marcus Chen' },
        { role: 'Conception sonore', name: 'Hana Mori' },
        { role: 'Musique', name: 'Kenji Watanabe' },
      ],
      tags: ['Patrimoine culturel', 'Japon', 'Artisanat', 'Tradition', 'Histoire humaine'],
    },
    'vanishing-voices': {
      title: 'Voix en voie de disparition',
      subtitle: "Quand une langue meurt, tout un univers de pensée disparaît avec elle",
      location: 'Bassin amazonien et Sibérie',
      shortDescription:
        "Un voyage à travers le monde pour documenter les langues menacées et les derniers locuteurs qui portent en eux des univers entiers de savoir humain.",
      fullDescription:
        "Toutes les deux semaines, une langue meurt. Avec elle disparaît une façon unique de voir le monde, accumulée au fil des millénaires. « Voix en voie de disparition » nous emmène dans un voyage extraordinaire à travers trois continents, à la rencontre des derniers locuteurs de langues menacées — des profondeurs de la forêt amazonienne à la toundra gelée de Sibérie. Par leurs histoires, nous découvrons que la langue n'est pas seulement un outil de communication, mais un dépôt vivant de savoirs écologiques, de mémoire culturelle et d'ingéniosité humaine. Le film suit la linguiste Maria Santos dans sa course contre la montre pour documenter ces langues qui s'éteignent, tout en explorant les raisons complexes de leur disparition et ce que cela signifie pour l'avenir de la diversité humaine.",
      awards: [
        'Festival de Berlin — Meilleur documentaire',
        'Nominé au prix Peabody',
        'Nominé aux Emmy — Documentaire remarquable',
      ],
      credits: [
        { role: 'Réalisation et image', name: 'Alex Rivera' },
        { role: 'Production', name: 'Elena Vasquez' },
        { role: 'Co-réalisation', name: 'Dr. Maria Santos' },
        { role: 'Montage', name: 'James Okafor' },
        { role: 'Conception sonore', name: 'Anika Patel' },
      ],
      tags: ['Langue', 'Culture', 'Amazonie', 'Sibérie', 'Préservation'],
    },
    'beneath-the-ice': {
      title: 'Sous la glace',
      subtitle: "L'Arctique parle. L'écoutons-nous ?",
      location: 'Cercle arctique, Groenland',
      shortDescription:
        "Des scientifiques forent une glace ancestrale pour déchiffrer le passé climatique de la Terre, tandis que l'Arctique qu'ils étudient fond sous leurs pieds.",
      fullDescription:
        "À deux kilomètres sous la calotte glaciaire du Groenland repose un registre du climat terrestre qui s'étend sur 100 000 ans. « Sous la glace » suit une équipe de glaciologues qui forent cette archive gelée pour en extraire des carottes de glace révélant les secrets climatiques de notre planète. Mais pendant qu'ils travaillent, la glace autour d'eux fond à un rythme sans précédent. Ce documentaire visuellement époustouflant met en regard la beauté saisissante de l'Arctique et l'urgence du dérèglement climatique. À travers des images intimes de la vie sur la glace, des découvertes scientifiques de pointe et les histoires personnelles de chercheurs qui ont consacré leur vie à ce travail, le film défend, avec émotion et rigueur, l'idée que l'Arctique concerne chaque personne sur Terre.",
      awards: [
        'Cannes — Prix du climat',
        'National Geographic — Documentaire de l\'année',
        'Jackson Wild — Prix Grand Teton',
      ],
      credits: [
        { role: 'Réalisation et image', name: 'Alex Rivera' },
        { role: 'Production', name: 'Ingrid Larsen' },
        { role: 'Prises de vues aériennes', name: 'Sven Eriksson' },
        { role: 'Montage', name: 'Marcus Chen' },
        { role: 'Musique', name: 'Olaf Johansson' },
      ],
      tags: ['Climat', 'Arctique', 'Science', 'Environnement', 'Groenland'],
    },
    'urban-roots': {
      title: 'Racines urbaines',
      subtitle: "Du béton naissent des jardins d'espoir",
      location: 'Détroit, États-Unis',
      shortDescription:
        "Dans les terrains abandonnés de Détroit, des communautés font pousser bien plus que des légumes : de l'espoir, de la guérison et une nouvelle vision de la vie urbaine.",
      fullDescription:
        "Au cœur de Détroit, où les usines abandonnées et les terrains vagues racontent le déclin d'une ville, quelque chose d'extraordinaire pousse. « Racines urbaines » suit cinq jardins communautaires de Détroit qui transforment des terres vacantes en espaces verts florissants, qui nourrissent les quartiers, soignent les traumatismes et retissent les liens entre habitants. À travers les histoires d'un ancien ouvrier de l'automobile devenu agriculteur, d'une mère célibataire qui retrouve un sens à sa vie et d'un ancien détenu en quête de rédemption, nous voyons comment le simple fait de cultiver peut déclencher de profonds changements sociaux. Ce n'est pas seulement un film sur le jardinage — c'est une méditation sur la résilience, la communauté et le besoin humain de prendre soin et d'être entouré de soin.",
      awards: [
        'SXSW — Prix du public',
        'Tribeca — Prix spécial du jury',
        'Nominé aux NAACP Image Awards',
      ],
      credits: [
        { role: 'Réalisation et image', name: 'Alex Rivera' },
        { role: 'Production', name: 'Denise Williams' },
        { role: 'Montage', name: 'Amara Johnson' },
        { role: 'Conception sonore', name: 'Hana Mori' },
        { role: 'Musique', name: 'Terrence Blake' },
      ],
      tags: ['Urbain', 'Communauté', 'Impact social', 'Détroit', 'Justice alimentaire'],
    },
    'silent-rivers': {
      title: 'Rivières silencieuses',
      subtitle: "Que se passe-t-il quand les rivières cessent de parler",
      location: 'Monde entier — 6 pays',
      shortDescription:
        "Une enquête mondiale sur les fleuves qui meurent et les communautés qui se battent pour sauver les veines de notre planète.",
      fullDescription:
        "Les fleuves sont les artères de notre planète : ils transportent l'eau, les nutriments et la vie à travers les continents. Mais aujourd'hui, nombre des plus grands cours d'eau du monde se meurent — étouffés par la pollution, asséchés par la surexploitation, coupés par les barrages. « Rivières silencieuses » parcourt six pays pour documenter la crise qui se joue le long du Gange, du Colorado, du Danube, du Mékong, du Niger et du Yangtsé. Grâce à des images aériennes saisissantes, des prises de vues sous-marines et des récits très personnels de communautés riveraines, le film révèle l'interdépendance de notre crise de l'eau tout en mettant en lumière les efforts inspirants de celles et ceux qui se battent pour restaurer ces voies d'eau vitales.",
      awards: [
        'Wildscreen — Panda d\'or',
        'EarthX — Meilleur film environnemental',
        'Raindance — Meilleur documentaire',
      ],
      credits: [
        { role: 'Réalisation et image', name: 'Alex Rivera' },
        { role: 'Production', name: 'Li Wei Zhang' },
        { role: 'Image sous-marine', name: 'Raj Patel' },
        { role: 'Montage', name: 'James Okafor' },
        { role: 'Musique', name: 'Anoushka Shankar' },
      ],
      tags: ['Rivières', 'Eau', 'Environnement', 'Monde', 'Pollution'],
    },
    'the-ink-keepers': {
      title: "Les Gardiens de l'encre",
      subtitle: "Chaque marque raconte une histoire. Chaque histoire est une rébellion.",
      location: 'Philippines et Nouvelle-Zélande',
      shortDescription:
        "Des tatoueurs autochtones à travers le Pacifique font revivre des traditions ancestrales que la colonisation a tenté d'effacer.",
      fullDescription:
        "Pendant des siècles, les peuples autochtones du Pacifique ont orné leur corps de tatouages complexes qui racontaient l'identité, le rang et le lien spirituel. Puis la colonisation est arrivée, et ces traditions sacrées ont été réprimées, stigmatisées et presque perdues. « Les Gardiens de l'encre » suit trois tatoueurs autochtones — un mambabatok philippin, un praticien maori du ta moko et un maître samoan du tatau — qui font revivre ces formes d'art ancestrales et se réapproprient leur héritage culturel par la pratique même qui servait à humilier leurs ancêtres. Avec des gros plans saisissants du tatouage, des entretiens intimes et des images d'archives, le film montre comment un art ancien devient un puissant outil de résilience culturelle.",
      awards: [
        'Venise — Meilleur documentaire',
        'APA — Mention spéciale',
        'MPI — Meilleur documentaire culturel',
      ],
      credits: [
        { role: 'Réalisation et image', name: 'Alex Rivera' },
        { role: 'Production', name: 'Kiri Aroha' },
        { role: 'Montage', name: 'Amara Johnson' },
        { role: 'Conception sonore', name: 'Anika Patel' },
        { role: 'Conseiller culturel', name: 'Chief Tui Malila' },
      ],
      tags: ['Tatouage', 'Autochtone', 'Culture', 'Pacifique', 'Patrimoine'],
    },
  },

  services: [
    {
      title: 'Documentaires de long métrage',
      description:
        "Des films documentaires de long métrage qui plongent au cœur d'histoires qui comptent, du développement jusqu'à la livraison finale.",
    },
    {
      title: 'Documentaires courts',
      description:
        'Des courts documentaires percutants pour les plateformes numériques, la télévision et les festivals.',
    },
    {
      title: 'Séries documentaires',
      description:
        'Des séries documentaires à plusieurs épisodes pour les plateformes de streaming, avec de longs arcs narratifs.',
    },
    {
      title: "Campagnes d'impact",
      description:
        "Des contenus documentaires associés à une stratégie d'impact social pour produire un changement concret.",
    },
  ],

  testimonials: {
    t1: {
      role: 'Linguiste, sujet de « Voix en voie de disparition »',
      content:
        "Alex n'a pas seulement documenté notre travail — elle a fait partie du voyage. Le film a attiré plus d'attention sur la préservation des langues que mille articles universitaires n'auraient pu le faire.",
    },
    t2: {
      role: 'Productrice, « Sous la glace »',
      content:
        "Travailler avec Alex pendant l'expédition arctique a été une leçon de cinéma documentaire. Elle a supporté des températures de -40 °C tout en réalisant certaines des images les plus saisissantes que j'aie jamais vues.",
    },
    t3: {
      role: 'Responsable communautaire, Détroit',
      content:
        "Elle a gagné notre confiance en étant présente — pas seulement avec une caméra, mais les mains dans la terre. « Racines urbaines » raconte notre histoire avec la dignité et l'honnêteté que nous méritons.",
    },
    t4: {
      role: 'Coproductrice, « Le Dernier Artisan »',
      content:
        "Alex a passé trois ans à construire la relation qui a rendu « Le Dernier Artisan » possible. Cette patience et ce respect la distinguent. Un chef-d'œuvre de retenue et de profondeur émotionnelle.",
    },
  },
}
