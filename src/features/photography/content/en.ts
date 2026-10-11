import type { PhotoSeries } from '../types'

/**
 * Placeholder photo series (English), built from the placeholder images.
 * French in `fr.ts` (matched by `slug`). With the CMS configured, series come from the Studio.
 */
export const photoSeries: PhotoSeries[] = [
  {
    id: 'ps1',
    slug: 'behind-the-scenes',
    title: 'Behind the Scenes',
    description: 'Stills from the field: the quiet moments between takes.',
    location: 'Kyoto, Japan',
    year: '2024',
    cover: '/images/doc-craftsman.png',
    relatedProject: 'the-last-craftsman',
    featured: true,
    photos: [
      { src: '/images/doc-craftsman.png', alt: 'Placeholder photograph', caption: 'The workshop at dawn' },
      { src: '/images/about-doc.png', alt: 'Placeholder photograph', caption: 'Preparing the camera' },
      { src: '/images/doc-voices.png', alt: 'Placeholder photograph' },
    ],
  },
  {
    id: 'ps2',
    slug: 'arctic-light',
    title: 'Arctic Light',
    description: 'Light, ice and water across the far north.',
    location: 'Greenland',
    year: '2023',
    cover: '/images/doc-ice.png',
    relatedProject: 'beneath-the-ice',
    photos: [
      { src: '/images/doc-ice.png', alt: 'Placeholder photograph', caption: 'Ice at midnight sun' },
      { src: '/images/doc-rivers.png', alt: 'Placeholder photograph' },
      { src: '/images/doc-urban.png', alt: 'Placeholder photograph' },
    ],
  },
]
