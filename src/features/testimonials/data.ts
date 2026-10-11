import { cache } from 'react'
import type { Locale } from '@/i18n/config'
import { cmsFetch } from '@/lib/cms/fetch'
import { staticTestimonials } from './content'
import { normalizeSanityTestimonial } from './normalize'
import type { Testimonial } from './types'

const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(coalesce(order, 0) asc){
  _id,
  name,
  role,
  content,
  "project": project->title
}`

export const getTestimonials = cache(async function getTestimonials(
  locale: Locale
): Promise<Testimonial[]> {
  try {
    const data = await cmsFetch<unknown[]>(TESTIMONIALS_QUERY)
    if (!data || data.length === 0) return staticTestimonials(locale)
    return data.map((t) => normalizeSanityTestimonial(t, locale))
  } catch (error) {
    console.warn('[Sanity] testimonials fetch failed, using fallback:', error)
    return staticTestimonials(locale)
  }
})
