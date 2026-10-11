import { defineField, defineType } from 'sanity'
import { requireDefaultLanguage } from './locale'

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
      name: 'seoTitle',
      title: 'Search Engine Title',
      description: 'Shown in Google results and browser tabs',
      type: 'localeString',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search Engine Description',
      description: 'The short summary shown under the title in Google results',
      type: 'localeText',
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
      type: 'localeString',
    }),

    // HERO
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'localeString',
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
      type: 'localeText',
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
      title: 'Hero Background Video (optional)',
      description:
        'bunny:<video-id> or an MP4/WebM URL — when set, plays muted as the hero background',
      type: 'string',
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
            { name: 'label', type: 'localeString', validation: requireDefaultLanguage },
          ],
          preview: {
            select: { value: 'value', suffix: 'suffix', label: 'label.en' },
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
      type: 'localeText',
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
      of: [{ type: 'localeText' }],
      group: 'about',
    }),
    defineField({
      name: 'aboutTools',
      title: 'Tools & Approach',
      type: 'array',
      of: [{ type: 'localeString' }],
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
            { name: 'label', type: 'localeString' },
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
      type: 'localeString',
      group: 'contact',
    }),
    defineField({
      name: 'contactResponseTime',
      title: 'Response Time',
      type: 'localeString',
      group: 'contact',
    }),
    defineField({
      name: 'studioHours',
      title: 'Studio Hours',
      type: 'localeText',
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
      type: 'localeText',
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
