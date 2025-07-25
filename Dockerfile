# syntax=docker.io/docker/dockerfile:1
FROM oven/bun:1 AS base

# Add build-time arguments
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_COOKIE_DOMAIN
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APPWRITE_PROJECT_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_URL
ARG SENTRY_PROJECT
ARG SENTRY_ORG
ARG SENTRY_AUTH_TOKEN

# Set them as environment variables for later stages
ENV NEXT_PUBLIC_DOMAIN=https://headpat.place
ENV NEXT_PUBLIC_COOKIE_DOMAIN=headpat.place
ENV NEXT_PUBLIC_API_URL=https://api.headpat.place
ENV NEXT_PUBLIC_APPWRITE_PROJECT_ID=hp-main
ENV NEXT_PUBLIC_GOOGLE_MAPS_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_KEY}
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ENV SENTRY_URL=${SENTRY_URL}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}
ENV SENTRY_ORG=${SENTRY_ORG}

# Install dependencies only when needed
FROM base AS deps
# Install necessary dependencies for Debian-based image
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libc6 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* bun.lock* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f bun.lock ]; then bun i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  elif [ -f bun.lock ]; then bun run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]