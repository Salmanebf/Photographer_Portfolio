import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Global brand & site configuration. There should only be one of these.',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'brandColor',
      title: 'Brand Color',
      description: 'The accent color used across the site (hex, e.g. #c9a96e)',
      type: 'string',
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, {
          name: 'hex color',
        }),
    }),
    defineField({
      name: 'logoMark',
      title: 'Logo Monogram',
      description: '2-letter monogram shown in nav/footer (e.g. "AR")',
      type: 'string',
    }),
    defineField({
      name: 'logoImage',
      title: 'Logo Image (optional)',
      description: 'When set, replaces the monogram',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'discipline',
      title: 'Discipline',
      description: 'Subtitle under the logo (e.g. "Documentary")',
      type: 'string',
    }),

    // HERO
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroNameLine1',
      title: 'Hero Name — Line 1',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroNameLine2',
      title: 'Hero Name — Line 2',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video URL (optional)',
      description: 'MP4/WebM URL — when set, plays muted as hero background',
      type: 'url',
      group: 'hero',
    }),
    defineField({
      name: 'heroStats',
      title: 'Hero Stats',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'number', validation: (R) => R.required() },
            { name: 'suffix', type: 'string', initialValue: '+' },
            { name: 'label', type: 'string', validation: (R) => R.required() },
          ],
          preview: {
            select: { value: 'value', suffix: 'suffix', label: 'label' },
            prepare: ({ value, suffix, label }) => ({
              title: `${value}${suffix ?? ''} — ${label}`,
            }),
          },
        },
      ],
    }),

    // ABOUT
    defineField({
      name: 'aboutQuote',
      title: 'About Pull Quote',
      type: 'text',
      rows: 2,
      group: 'about',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Portrait',
      type: 'image',
      options: { hotspot: true },
      group: 'about',
    }),
    defineField({
      name: 'aboutYearsBadge',
      title: 'Years Badge',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutParagraphs',
      title: 'About Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      group: 'about',
    }),
    defineField({
      name: 'aboutTools',
      title: 'Tools & Approach',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'about',
    }),
    defineField({
      name: 'aboutStats',
      title: 'About Stats',
      type: 'array',
      group: 'about',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string' },
            { name: 'label', type: 'string' },
          ],
        },
      ],
    }),

    // CONTACT
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactLocation',
      title: 'Location',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactResponseTime',
      title: 'Response Time',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'studioHours',
      title: 'Studio Hours',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'isAvailable',
      title: 'Currently Available',
      type: 'boolean',
      group: 'contact',
    }),
    defineField({
      name: 'availabilityYear',
      title: 'Availability Year',
      type: 'number',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'instagram', type: 'url' },
        { name: 'vimeo', type: 'url' },
        { name: 'letterboxd', type: 'url' },
        { name: 'twitter', type: 'url' },
      ],
    }),

    // FOOTER
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'text',
      rows: 2,
      group: 'footer',
    }),
  ],
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'about', title: 'About' },
    { name: 'contact', title: 'Contact' },
    { name: 'footer', title: 'Footer' },
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
