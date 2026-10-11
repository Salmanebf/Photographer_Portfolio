import { defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'
import { requireDefaultLanguage } from './locale'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: requireDefaultLanguage,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      validation: requireDefaultLanguage,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: { select: { title: 'title.en', subtitle: 'description.en' } },
})
