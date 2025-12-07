# ===========================================
# 1. Base
# ===========================================
FROM node:24 AS base
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
WORKDIR /app


# ===========================================
# 2. Root deps
# ===========================================
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
RUN pnpm fetch


# ===========================================
# 3. Prune
# ===========================================
FROM base AS prune
COPY . .
RUN pnpm dlx turbo prune --scope=server --docker


# ===========================================
# 4. Build (FULL workspace)
# ===========================================
FROM base AS build

# Copy full pruned workspace (server+packages)
COPY --from=prune /app/out/full/ ./

# Restore pnpm store
COPY --from=deps /app/node_modules/.pnpm /app/node_modules/.pnpm

# Install ALL deps for server workspace
RUN pnpm install --prefer-offline --no-frozen-lockfile

# Build the server (this generates dist/)
RUN pnpm --filter server build


# ===========================================
# 5. Production Image (stable)
# ===========================================
FROM node:24-alpine AS prod
RUN apk add --no-cache gcompat
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
WORKDIR /app

# Copy workspace metadata
COPY --from=prune /app/out/json/ ./
COPY pnpm-lock.yaml ./

# Copy built server output
COPY --from=build /app/apps/server/dist ./dist

# Copy server package
COPY --from=prune /app/out/full/apps/server/package.json ./package.json

# ---- Install ONLY production deps ----
RUN pnpm install --prod --ignore-scripts

EXPOSE 3001
CMD ["node", "dist/index.js"]
