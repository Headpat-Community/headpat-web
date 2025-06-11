FROM node:22-alpine AS base

# Add build-time arguments
ARG NEXT_PUBLIC_APPWRITE_DATABASE_ID

# Set them as environment variables for later stages
ENV NEXT_PUBLIC_APPWRITE_DATABASE_ID=db_web

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy all files and build
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy built output and public assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

CMD ["node", "server.js"]