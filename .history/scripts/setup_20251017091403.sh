#!/bin/bash

# Life Lessons App - Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up Life Lessons App..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 20.0.0"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to manually set up PostgreSQL and Redis."
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pnpm install

# Copy environment file
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env created. Please update with your values.${NC}"
fi

# Start Docker services
echo -e "${BLUE}Starting Docker services (PostgreSQL + Redis)...${NC}"
docker-compose up -d

# Wait for PostgreSQL
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Generate Prisma client
echo -e "${BLUE}Generating Prisma client...${NC}"
cd prisma
npx prisma generate
cd ..

# Run migrations
echo -e "${BLUE}Running database migrations...${NC}"
cd prisma
npx prisma migrate dev --name init
cd ..

# Seed database
echo -e "${BLUE}Seeding database with demo data...${NC}"
pnpm seed

echo -e "${GREEN}"
echo "════════════════════════════════════════════════════════"
echo "  ✓ Life Lessons App setup complete!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Demo credentials:"
echo "  Email: demo@lifelessons.app"
echo "  Password: Passw0rd!"
echo ""
echo "Next steps:"
echo "  1. Run 'pnpm dev' to start all services"
echo "  2. Visit http://localhost:3000 (Web UI)"
echo "  3. Visit http://localhost:3001/docs (API Docs)"
echo ""
echo "════════════════════════════════════════════════════════"
echo -e "${NC}"
