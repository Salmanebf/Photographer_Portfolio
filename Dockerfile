# Self-hosting fallback (VPS, DigitalOcean + Coolify/Dokploy, Fly, Render…).
# Vercel and Netlify do NOT use this file — they build the repo directly.
#
#   docker build -t portfolio \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://example.com \
#     --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx \
#     --build-arg NEXT_PUBLIC_BUNNY_CDN_HOST=vz-xxxx.b-cdn.net .
#   docker run -p 3000:3000 --env-file .env.local portfolio
#
# NEXT_PUBLIC_* values are baked in at build time (build args); server secrets
# (TURSO_*, RESEND_API_KEY, CONTACT_*) are read at runtime (--env-file).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_BUNNY_CDN_HOST
ENV BUILD_STANDALONE=1 NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
