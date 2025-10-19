# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy api package.json
COPY apps/api/package.json ./apps/api/

# Copy prisma schema
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY tsconfig.json ./

# Generate Prisma Client
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm --filter api exec prisma generate

# Build the application
RUN pnpm --filter api build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm and curl for health checks
RUN npm install -g pnpm && apk add --no-cache curl

# Copy package files
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma Client in production stage (Railway env will be available at runtime)
# Using a placeholder URL for build, real URL comes from Railway env at runtime
RUN DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder" pnpm --filter api exec prisma generate

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start command (regenerate Prisma Client with real DATABASE_URL, run migrations, then start app)
CMD ["sh", "-c", "pnpm --filter api exec prisma generate && cd prisma && npx prisma migrate deploy && cd /app/apps/api && node dist/main.js"]
