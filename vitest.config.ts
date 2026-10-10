import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Force the CMS off so data-layer tests always exercise the static fallback.
    env: { NEXT_PUBLIC_SANITY_PROJECT_ID: '' },
  },
})
