import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { requireDefaultLanguage } from './locale'

/**
 * A photography series (a set of photos on one theme, e.g. stills from a shoot).
 * This is the content model for the photo gallery; the gallery pages come later.
 */
export const photoSeries = defineType({
  name: 'photoSeries',
  title: 'Photo Series',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: requireDefaultLanguage,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Part of the web address. Built from the English title.',
      type: 'slug',
      options: {
        source: (doc) => (doc as { title?: { en?: string } }).title?.en ?? '',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short introduction',
      description: 'Optional: one or two sentences about the series',
      type: 'localeText',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'The picture that represents the series in lists',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'location', title: 'Location', type: 'localeString' }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'photo',
          title: 'Photo',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Description (for screen readers and search engines)',
              description: 'Say what the photo shows, e.g. "An elderly potter shaping a bowl"',
              type: 'localeString',
              validation: (Rule) =>
                Rule.custom((v: { en?: string } | undefined) => (v?.en?.trim() ? true : 'Please describe the photo')).warning(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption (optional)',
              type: 'localeString',
            }),
          ],
          preview: {
            select: { media: 'image', title: 'alt.en', subtitle: 'caption.en' },
            prepare: ({ media, title, subtitle }) => ({
              media,
              title: title || 'Photo',
              subtitle,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'relatedProject',
      title: 'Related film (optional)',
      description: 'Link this series to the film it was shot alongside',
      type: 'reference',
      to: [{ type: 'project' }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'displayOrder', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Year (newest first)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.en', media: 'coverImage', subtitle: 'year' },
  },
})
