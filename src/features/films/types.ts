export type PreviewShape = 'landscape' | 'portrait' | 'square'

export interface DocumentaryProject {
  id: string
  slug: string
  title: string
  subtitle: string
  /** Stable key (e.g. `cultural-heritage`); the visible label comes from messages `categories.<key>` */
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
  /** Optional trailer / video: `bunny:<id>`, YouTube/Vimeo URL, or MP4 URL */
  video?: string
  /** Optional short silent loop for cards/previews: `bunny:<id>` or MP4 URL */
  preview?: string
  /** Shape of the preview clip, so its card is the right shape before the clip has loaded. Unset = detected from the clip. */
  previewShape?: PreviewShape
  /** Optional flag for hero/featured display */
  featured?: boolean
}

/** The translatable fields of a film (everything else is shared by all languages). */
export type ProjectTranslation = Partial<
  Pick<
    DocumentaryProject,
    | 'title'
    | 'subtitle'
    | 'location'
    | 'duration'
    | 'shortDescription'
    | 'fullDescription'
    | 'awards'
    | 'credits'
    | 'tags'
  >
>
