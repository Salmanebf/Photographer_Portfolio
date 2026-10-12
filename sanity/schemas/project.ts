import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'
import { requireDefaultLanguage } from './locale'

export const project = defineType({
  name: 'project',
  title: 'Documentary Project',
  type: 'document',
  icon: PlayIcon,
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
      type: 'slug',
      options: {
        // slugs are shared by all languages: built from the English title
        source: (doc) => (doc as { title?: { en?: string } }).title?.en ?? '',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Tagline',
      type: 'localeString',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'The visible name is translated automatically (EN/FR).',
      options: {
        list: [
          { title: 'Cultural Heritage', value: 'cultural-heritage' },
          { title: 'Cultural Preservation', value: 'cultural-preservation' },
          { title: 'Environmental', value: 'environmental' },
          { title: 'Social Impact', value: 'social-impact' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Trailer / Video',
      description:
        'Bunny video: type bunny: followed by the video ID, no < > (e.g. bunny:a746fa4f-d359-4e70-92b3-0c431ce7af60). Or paste a YouTube / Vimeo / MP4 URL.',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((v) =>
          !v || /^(bunny:[A-Za-z0-9-]{8,64}|https?:\/\/\S+)$/.test(v)
            ? true
            : 'Use bunny:VIDEO-ID (no < > brackets, no spaces) or a full https:// URL'
        ),
    }),
    defineField({
      name: 'preview',
      title: 'Preview loop (short, silent)',
      description:
        'A 5–10 second silent clip shown on the project card. bunny:VIDEO-ID (no < >) or an MP4 URL. Keep it under ~3 MB.',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((v) =>
          !v || /^(bunny:[A-Za-z0-9-]{8,64}|https?:\/\/\S+)$/.test(v)
            ? true
            : 'Use bunny:VIDEO-ID (no < > brackets, no spaces) or a full https:// URL'
        ),
    }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({
      name: 'duration',
      title: 'Duration',
      description: 'e.g. "78 min"',
      type: 'string',
    }),
    defineField({ name: 'location', title: 'Location', type: 'localeString' }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'localeText',
      description: 'One- or two-line summary',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'localeText',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'role', type: 'localeString', validation: requireDefaultLanguage },
            { name: 'name', type: 'string', validation: (R) => R.required() },
          ],
          preview: {
            select: { role: 'role.en', name: 'name' },
            prepare: ({ role, name }) => ({ title: `${role}: ${name}` }),
          },
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Year (newest first)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title.en', media: 'image', subtitle: 'category' },
  },
})
