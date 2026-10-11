import { cache } from 'react'
import type { Locale } from '@/i18n/config'
import { cmsFetch } from '@/lib/cms/fetch'
import { staticServices } from './content'
import { normalizeSanityService } from './normalize'
import type { Service } from './types'

const SERVICES_QUERY = `*[_type == "service"] | order(coalesce(order, 0) asc){
  _id,
  title,
  description
}`

export const getServices = cache(async function getServices(locale: Locale): Promise<Service[]> {
  try {
    const data = await cmsFetch<unknown[]>(SERVICES_QUERY)
    if (!data || data.length === 0) return staticServices(locale)
    return data.map((s) => normalizeSanityService(s, locale))
  } catch (error) {
    console.warn('[Sanity] services fetch failed, using fallback:', error)
    return staticServices(locale)
  }
})
