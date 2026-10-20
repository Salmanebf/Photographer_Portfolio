export interface Photo {
  src: string
  /** Pixel size when known (lets the page reserve space and avoid layout jumps) */
  width?: number
  height?: number
  /** Describes the photo for screen readers and search engines */
  alt: string
  caption?: string
}

/** A set of photos on one theme (e.g. stills from a shoot). */
export interface PhotoSeries {
  id: string
  /** Same in every language */
  slug: string
  title: string
  description?: string
  location: string
  year: string
  cover: string
  photos: Photo[]
  /** Slug of the film this series was shot alongside, if any */
  relatedProject?: string
  featured?: boolean
}

/** The translatable fields of a series (everything else is shared by all languages). */
export type PhotoSeriesTranslation = Partial<Pick<PhotoSeries, 'title' | 'description' | 'location'>> & {
  /** Same order as the English photos */
  photos?: { alt?: string; caption?: string }[]
}
