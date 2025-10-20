# Build stage
# Temporary: Using Docker Hub via Railway's cache/mirror to avoid 503
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy api package.json
COPY apps/api/package.json ./apps/api/

# Copy prisma schema AND migrations
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY tsconfig.json ./

# Generate Prisma Client with dummy URL (just for build)
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm --filter api exec prisma generate

# Build the application
RUN pnpm --filter api build

# Production stage
# Temporary: Using Docker Hub via Railway's cache/mirror to avoid 503
FROM node:20-alpine

WORKDIR /app

# Install pnpm and curl for health checks
RUN npm install -g pnpm && apk add --no-cache curl

# Copy package files
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/

# Copy prisma schema AND migrations directly from source (not from builder)
# This ensures migrations are available for `prisma migrate deploy`
COPY prisma ./prisma

# Install production dependencies only (includes @prisma/client)
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Generate Prisma Client for production (will use Railway's DATABASE_URL at build time via ARG)
ARG DATABASE_URL
RUN if [ -n "$DATABASE_URL" ]; then \
      echo "Generating Prisma Client with Railway DATABASE_URL"; \
      pnpm --filter api exec prisma generate; \
    else \
      echo "Generating Prisma Client with placeholder"; \
      DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm --filter api exec prisma generate; \
    fi

# Set working directory for app
WORKDIR /app/apps/api

# Expose port (Railway will override with $PORT)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start command - run migrations then start app
# Railway will use this CMD (not package.json start script) with railway.json config
CMD ["sh", "-c", "npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
