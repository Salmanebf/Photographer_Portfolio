/**
 * Sanity Studio configuration
 *
 * Studio is mounted at /studio. Set NEXT_PUBLIC_SANITY_PROJECT_ID and
 * NEXT_PUBLIC_SANITY_DATASET in .env.local to enable.
 *
 * The site renders fine without Sanity — falls back to /src/lib/site.config.ts
 * and /src/lib/data.ts.
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Alex Rivera — Studio',
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
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Documentary Projects'),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
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
