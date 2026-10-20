import type { DeepPartial } from '../merge'
import type { SiteSettings } from '@/shared/content/types'

/**
 * French site copy (placeholder text), laid over the English `site.config.ts`.
 * Draft translation — to be reviewed by a native speaker. Missing fields fall back to English.
 */
export const site: DeepPartial<SiteSettings> = {
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
    tagline:
      "Raconter des histoires qui éclairent la condition humaine. Documenter les cultures, révéler les vérités, dévoiler l'extraordinaire.",
    headline: 'Des films qui parlent plus fort que les mots',
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
  recognitions: [
    'Sundance — Grand prix du jury',
    'Cannes — Prix du climat',
    'Berlin — Meilleur documentaire',
    'Venise — Meilleur documentaire',
    'Tribeca — Mention spéciale du jury',
    'IDFA — Meilleur documentaire',
    'SXSW — Prix du public',
    'Hot Docs — Prix du public',
    'Nominé aux Peabody',
    'Nominé aux Emmy',
    'Wildscreen — Panda d\'or',
    'Jackson Wild — Grand Teton',
  ],
  process: [
    {
      title: 'Découverte',
      description:
        'Recherche approfondie et immersion, création d\'un lien de confiance avec les communautés et identification du cœur émotionnel.',
    },
    {
      title: 'Production',
      description:
        'Longs tournages sur le terrain avec des caméras de cinéma, pour capter des moments authentiques et des entretiens intimes.',
    },
    {
      title: 'Création',
      description:
        'Montage minutieux, conception sonore et étalonnage qui transforment les rushes en un récit captivant.',
    },
    {
      title: 'Impact',
      description:
        'Stratégie de festivals, distribution et campagnes d\'impact pour que votre documentaire touche et émeuve le public.',
    },
  ],
}
