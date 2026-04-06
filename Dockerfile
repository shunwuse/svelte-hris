# syntax=docker/dockerfile:1.7

# Stage 1: Base
FROM node:20-alpine AS base

WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

# Stage 2: Deps
FROM base AS deps

# Copy only the manifests needed to resolve dependencies.
COPY package.json pnpm-lock.yaml .npmrc ./

# Fetch all packages from the lockfile into the shared pnpm store.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm fetch --frozen-lockfile

# Stage 3: Builder
FROM deps AS builder

# Install from the cached store without hitting the network.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --frozen-lockfile --offline

# Copy the application source.
COPY . .

# Build the SvelteKit Node adapter output.
RUN pnpm build

# Stage 4: Prod-deps
FROM base AS prod-deps

# Reuse the cached store and skip lifecycle scripts in the runtime dependency tree.
COPY package.json pnpm-lock.yaml .npmrc ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --prod --frozen-lockfile --offline --ignore-scripts

# Stage 5: runtime
FROM node:20-alpine AS runtime

WORKDIR /app

# Set environment variables.
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy the build output, package metadata, and production node_modules.
COPY --chown=node:node --from=builder /app/build ./build
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules

USER node

# Expose the port the app runs on.
EXPOSE 3000

# Start the application.
CMD ["node", "build"]
