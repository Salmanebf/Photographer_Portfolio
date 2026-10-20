import type { PhotoSeriesTranslation } from '../types'

/** French photo-series translations, keyed by slug (draft translation). */
export const photoSeries: Record<string, PhotoSeriesTranslation> = {
  'behind-the-scenes': {
    title: 'Dans les coulisses',
    description: 'Des images du terrain : les moments calmes entre deux prises.',
    location: 'Kyoto, Japon',
    photos: [
      { alt: "Photographie d'exemple", caption: "L'atelier à l'aube" },
      { alt: "Photographie d'exemple", caption: 'Préparation de la caméra' },
      { alt: "Photographie d'exemple" },
    ],
  },
  'arctic-light': {
    title: 'Lumière arctique',
    description: "La lumière, la glace et l'eau à travers le Grand Nord.",
    location: 'Groenland',
    photos: [
      { alt: "Photographie d'exemple", caption: 'La glace sous le soleil de minuit' },
      { alt: "Photographie d'exemple" },
      { alt: "Photographie d'exemple" },
    ],
  },
}
