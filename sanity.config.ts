/**
 * Sanity Studio configuration
 *
 * Studio is mounted at /studio. Set NEXT_PUBLIC_SANITY_PROJECT_ID and
 * NEXT_PUBLIC_SANITY_DATASET in .env.local to enable.
 *
 * The site renders fine without Sanity — falls back to the static content in
 * /src/lib/site.config.ts and /src/features/<feature>/content.
 *
 * The Studio is branded with the colour and monogram from site.config.ts.
 */
import { buildLegacyTheme, defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { CogIcon, CommentIcon, ImagesIcon, PlayIcon, ThListIcon } from '@sanity/icons'
import { schemaTypes } from './sanity/schemas'
import BrandLogo from './sanity/components/brand-logo'
import { siteConfig } from './src/lib/site.config'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const brand = siteConfig.brand.color

/** Dark theme in the site's accent colour. */
const theme = buildLegacyTheme({
  '--black': '#0b0b0c',
  '--white': '#f4efe6',
  '--gray': '#8a8a90',
  '--gray-base': '#8a8a90',
  '--component-bg': '#121214',
  '--component-text-color': '#f4efe6',
  '--brand-primary': brand,
  '--default-button-color': '#8a8a90',
  '--default-button-primary-color': brand,
  '--default-button-success-color': '#3fb68b',
  '--default-button-warning-color': '#d9a441',
  '--default-button-danger-color': '#e5604f',
  '--state-info-color': brand,
  '--state-success-color': '#3fb68b',
  '--state-warning-color': '#d9a441',
  '--state-danger-color': '#e5604f',
  '--main-navigation-color': '#0b0b0c',
  '--main-navigation-color--inverted': '#f4efe6',
  '--focus-color': brand,
})

export default defineConfig({
  name: 'default',
  title: `${siteConfig.brand.name} — Studio`,
  theme,
  studio: { components: { logo: BrandLogo } },
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton: Site Settings
            S.listItem()
              .title('Site Settings')
              .icon(CogIcon)
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Documentary Projects').icon(PlayIcon),
            S.documentTypeListItem('photoSeries').title('Photo Series').icon(ImagesIcon),
            S.divider(),
            S.documentTypeListItem('service').title('Services').icon(ThListIcon),
            S.documentTypeListItem('testimonial').title('Testimonials').icon(CommentIcon),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Hide siteSettings from creation menu (singleton)
    templates: (templates) => templates.filter((t) => t.schemaType !== 'siteSettings'),
  },
  document: {
    actions: (input, context) =>
      context.schemaType === 'siteSettings'
        ? input.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : input,
  },
})
