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
# 3. Prune monorepo for server only
# ===========================================
FROM base AS prune
COPY . .
# Turbo v1.0–1.12 does NOT support include-dev flags
# Use prune normally
RUN pnpm dlx turbo prune --scope=server --docker


# ===========================================
# 4. Build Stage (small)
# ===========================================
FROM base AS build

# Copy pruned workspace
COPY --from=prune /app/out/full/ ./

# Copy pnpm store
COPY --from=deps /app/node_modules/.pnpm /app/node_modules/.pnpm

# Install deps (no offline mode → avoids missing tarballs)
RUN pnpm install --prefer-offline --no-frozen-lockfile

# Build server
RUN pnpm --filter server build


# ===========================================
# 5. Production Image (tiny)
# ===========================================
FROM node:24-alpine AS prod
RUN apk add --no-cache gcompat
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
WORKDIR /app

COPY --from=prune /app/out/json/ ./
COPY pnpm-lock.yaml ./

COPY --from=build /app/apps/server/dist ./dist
COPY --from=prune /app/out/full/apps/server ./apps/server
COPY --from=prune /app/out/full/packages ./packages

RUN pnpm install --prod --ignore-scripts

EXPOSE 3001
CMD ["node", "dist/index.js"]
