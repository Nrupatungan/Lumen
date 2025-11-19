# ===========================================
# 1. Base image
# ===========================================
FROM node:24 AS base
RUN apt-get update && apt-get install -y links2 git && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
WORKDIR /app


# ===========================================
# 2. Fetch root dependencies into pnpm store
# ===========================================
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
RUN pnpm fetch


# ===========================================
# 3. Prune monorepo for web only
# ===========================================
FROM base AS prune
COPY . .
RUN pnpm dlx turbo prune --scope=web --docker


# ===========================================
# 4. Build Stage
# ===========================================
FROM base AS build

# Copy pruned workspace
COPY --from=prune /app/out/full/ ./

# Copy pnpm store for fast install
COPY --from=deps /app/node_modules/.pnpm /app/node_modules/.pnpm

# Install deps (NOT offline)
RUN pnpm install --prefer-offline --no-frozen-lockfile

# Build web app
RUN pnpm --filter web build


# ===========================================
# 5. Production Image (tiny)
# ===========================================
FROM node:24-alpine AS prod
RUN apk add --no-cache gcompat
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
WORKDIR /app

# Copy workspace metadata
COPY --from=prune /app/out/json/ ./
COPY pnpm-lock.yaml ./

# Copy built Next.js output
COPY --from=build /app/apps/web/.next ./.next

# Copy web package
COPY --from=prune /app/out/full/apps/web/package.json ./package.json

# Copy public assets
COPY --from=prune /app/out/full/apps/web/public ./public

# Install only production deps
RUN pnpm install --prod --ignore-scripts

EXPOSE 3000

CMD ["pnpm", "start"]
