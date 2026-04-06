# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the SvelteKit app
# Note: For production Docker, we usually use @sveltejs/adapter-node
RUN pnpm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built app and necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "build"]
