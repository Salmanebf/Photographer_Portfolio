import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'
import { requireDefaultLanguage } from './locale'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
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
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search Engine Description',
      description: 'The short summary shown under the title in Google results',
      type: 'localeText',
      group: 'seo',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Search Engine Keywords',
      description: 'A few words people might search for (one per line, in each language)',
      type: 'array',
      of: [{ type: 'localeString' }],
      group: 'seo',
    }),
    defineField({
      name: 'seoImage',
      title: 'Social Sharing Image',
      description: 'The picture shown when the site is shared on social networks (1200×630 works best). Defaults to the hero image.',
      type: 'image',
      options: { hotspot: true },
      group: 'seo',
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
        'Type bunny: followed by the video ID, with no spaces and no < > (example: bunny:a746fa4f-d359-4e70-92b3-0c431ce7af60). Or a full https:// MP4/WebM URL. When set, plays muted as the hero background.',
      type: 'string',
      group: 'hero',
      validation: (Rule) =>
        Rule.custom((v) =>
          !v || /^(bunny:[A-Za-z0-9-]{8,64}|https?:\/\/\S+)$/.test(v)
            ? true
            : 'Use bunny:VIDEO-ID (no < > brackets, no spaces) or a full https:// URL'
        ),
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

    // AWARDS & PRESS
    defineField({
      name: 'recognitions',
      title: 'Awards & Press Mentions',
      description:
        'Shown as a scrolling band under the introduction. Add one line per award or mention. Leave the list empty to hide the band.',
      type: 'array',
      of: [{ type: 'localeString' }],
      group: 'recognition',
    }),

    // HOW I WORK
    defineField({
      name: 'processSteps',
      title: 'How I Work — Steps',
      description: 'The phases of a project, in order (shown in the Services section)',
      type: 'array',
      group: 'process',
      of: [
        {
          type: 'object',
          name: 'processStep',
          fields: [
            { name: 'title', title: 'Step title', type: 'localeString', validation: requireDefaultLanguage },
            { name: 'description', title: 'What happens', type: 'localeText' },
          ],
          preview: {
            select: { title: 'title.en', subtitle: 'description.en' },
          },
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
    { name: 'recognition', title: 'Awards & Press' },
    { name: 'process', title: 'How I Work' },
    { name: 'contact', title: 'Contact' },
    { name: 'footer', title: 'Footer' },
    { name: 'seo', title: 'Search & Sharing' },
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
