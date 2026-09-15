# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Diwa Industries — production image
#
# Multi-stage so the final image carries only the standalone server bundle.
# Requires `output: "standalone"` in next.config.ts (already set).
# ---------------------------------------------------------------------------

ARG NODE_VERSION=24-alpine

# --- deps: install node_modules once, cached on lockfile changes only -------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# --- builder: compile the Next.js app --------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Switches next.config.ts to output:"standalone" for the runtime stage below.
ENV DOCKER_BUILD=1
RUN npm run build

# --- runner: minimal runtime ------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# `standalone` emits a server bundle plus the minimal node_modules it needs.
# static/ and public/ are not included in that bundle and must be copied.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
