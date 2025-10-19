# Life Lessons App - MVP v1.0

🌟 **Track your 10,000 lessons journey** - A personal growth application for capturing, analyzing, and learning from life experiences.

> **🎉 STATUS**: Frontend web app HOÀN THÀNH với 7 pages functional! Backend API với 25+ endpoints working. [Xem chi tiết →](./SUMMARY.md)

## 🚀 Quick Start (5 phút)

```powershell
# Windows PowerShell - Chạy script tự động
.\setup.ps1

# Sau đó start servers:
# Terminal 1: cd apps\api && pnpm start:dev
# Terminal 2: cd apps\web && pnpm dev
# Browser: http://localhost:3000
# Login: demo@lifelessons.app / Passw0rd!
```

Xem hướng dẫn chi tiết: [`QUICKSTART.md`](./QUICKSTART.md) | [`SCRIPTS.md`](./SCRIPTS.md)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Progress & Status](#progress--status)
- [Deployment](#deployment)

## ✨ Features

### V1.0 MVP

- ✅ **Lesson Capture**: Quick text entry with mood, resonance, and gratitude tracking
- ✅ **AI Analysis**: Mock AI service for summarizing lessons and suggesting concepts
- ✅ **Goal Tracking**: 10,000 lesson goal with sprint-based progress (100 lessons per sprint)
- ✅ **Analytics**: Dashboard with heatmap, streak tracking, and domain insights
- ✅ **Privacy Controls**: Private, Group, Link-sharing, and Public-Anonymous modes
- ✅ **Reminders**: Daily evening, weekly review, monthly retro notifications
- ✅ **Community**: Anonymous lesson sharing and group leaderboards
- ✅ **Export**: Markdown, CSV, JSON export formats
- ✅ **Concept Knowledge Base (CKB)**: Library of beneficial concepts for reframing

## 🛠 Tech Stack

### Monorepo

- **Package Manager**: pnpm workspaces
- **Tooling**: TypeScript, ESLint, Prettier

### Backend (apps/api)

- **Framework**: NestJS 10
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache/Queue**: Redis + BullMQ
- **Auth**: JWT (access + refresh tokens) + bcrypt
- **Validation**: Zod + class-validator
- **API Docs**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### Frontend (apps/web)

- **Framework**: Next.js 15 (App Router)
- **UI**: TailwindCSS + shadcn/ui
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl
- **Testing**: Playwright (e2e)

### Mobile (apps/mobile)

- **Framework**: Expo (React Native)
- **Offline**: SQLite
- **Sync**: Custom API sync layer
- **Push**: Expo Notifications (TODO)

## 📚 Documentation Hub

| Document | Purpose | Audience |
|----------|---------|----------|
| **[QUICKSTART.md](./QUICKSTART.md)** ⭐ | 5-minute setup guide | First-time users |
| **[SUMMARY.md](./SUMMARY.md)** ⭐ | Current status & achievements | Everyone |
| **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** ⭐ | Verify everything works | Testers |
| [PROGRESS.md](./PROGRESS.md) | Detailed progress tracker | Developers |
| [NEXT_STEPS.md](./NEXT_STEPS.md) | Development roadmap | Developers |
| [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) | Technical details | Developers |
| [SCRIPTS.md](./SCRIPTS.md) | Command reference | Developers |
| [MOBILE_GUIDE.md](./MOBILE_GUIDE.md) | Mobile app plan (TODO) | Mobile devs |
| [INDEX.md](./INDEX.md) | Documentation index | Everyone |
| [apps/README.md](./apps/README.md) | Monorepo structure | Developers |

**Start here**: [`QUICKSTART.md`](./QUICKSTART.md) → [`TESTING_CHECKLIST.md`](./TESTING_CHECKLIST.md)

## 📁 Project Structure

```
life-lessons/
├── apps/
│   ├── api/          # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/        # Authentication (JWT, bcrypt)
│   │   │   ├── users/       # User management
│   │   │   ├── lessons/     # Lesson CRUD & search
│   │   │   ├── goals/       # Goal & sprint tracking
│   │   │   ├── analytics/   # Stats, heatmap, streaks
│   │   │   ├── reminders/   # BullMQ reminders
│   │   │   ├── groups/      # Groups & community
│   │   │   ├── ai/          # Mock AI service
│   │   │   ├── concepts/    # Concept Knowledge Base
│   │   │   └── prisma/      # Prisma service
│   │   └── test/
│   ├── web/          # Next.js frontend
│   │   ├── app/            # App Router pages
│   │   │   ├── (auth)/     # Login, Signup
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── journal/    # Lesson list & editor
│   │   │   ├── goals/      # Goal & roadmap view
│   │   │   ├── community/  # Community feed
│   │   │   ├── settings/   # User settings
│   │   │   └── share/      # Public lesson view
│   │   ├── components/     # Reusable components
│   │   └── lib/            # Utils, API client
│   └── mobile/       # Expo mobile app (scaffold)
├── prisma/
│   └── schema.prisma     # Database schema
├── scripts/
│   ├── seed.ts           # Seed demo data
│   └── migrate.sh        # Migration helper
├── docker-compose.yml
├── .env.example
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Docker** (for PostgreSQL + Redis)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/life-lessons.git
cd life-lessons
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Start Docker services** (PostgreSQL + Redis)

```bash
pnpm docker:up
```

5. **Run database migrations**

```bash
cd prisma
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

6. **Seed demo data**

```bash
pnpm seed
```

Demo user credentials:
- Email: `demo@lifelessons.app`
- Password: `Passw0rd!`

7. **Start development servers**

```bash
pnpm dev
```

This starts:
- **API**: http://localhost:3001
- **Web**: http://localhost:3000
- **Swagger Docs**: http://localhost:3001/docs

## 💻 Development

### Available Commands

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Database commands
pnpm db:migrate      # Run migrations
pnpm db:studio       # Open Prisma Studio

# Docker commands
pnpm docker:up       # Start PostgreSQL + Redis
pnpm docker:down     # Stop Docker services

# Seed database
pnpm seed
```

### Working with the API

```bash
cd apps/api

# Start in watch mode
pnpm dev

# Run tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Generate Prisma client
npx prisma generate
```

### Working with the Frontend

```bash
cd apps/web

# Start dev server
pnpm dev

# Build for production
pnpm build

# Run e2e tests
pnpm test:e2e
```

## 📚 API Documentation

### Swagger/OpenAPI

Visit http://localhost:3001/docs when the API is running.

### Key Endpoints

#### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

#### Lessons
- `GET /api/lessons` - List lessons (with filters)
- `POST /api/lessons` - Create lesson
- `GET /api/lessons/:id` - Get lesson
- `PATCH /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson
- `POST /api/lessons/:id/share` - Generate share link
- `POST /api/lessons/:id/react` - Add reaction

#### AI
- `POST /api/ai/lessons/:id/analyze` - Analyze lesson (mock)

#### Goals
- `POST /api/goals` - Create goal
- `GET /api/goals/:id` - Get goal
- `GET /api/goals/:id/roadmap` - Get sprint roadmap

#### Analytics
- `GET /api/analytics/overview` - Dashboard stats

#### Concepts (CKB)
- `GET /api/concepts/search?q=...` - Search concepts
- `GET /api/concepts/:id` - Get concept details

#### Admin (CKB)
- `POST /api/admin/concepts/import` - Bulk import concepts
- `POST /api/admin/concepts` - Create concept
- `PATCH /api/admin/concepts/:id` - Update concept

## 🔐 Environment Variables

See `.env.example` for full list. Key variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lifelessons

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API
API_PORT=3001

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 🗄 Database

### Schema

The app uses PostgreSQL with the following main models:

- **User**: User accounts with email/password auth
- **Lesson**: Individual life lessons with content, mood, tags, etc.
- **Goal**: 10,000 lesson goal tracking
- **Sprint**: 100-lesson sprint tracking
- **Reminder**: Scheduled reminders (daily/weekly/monthly)
- **Group**: User groups for community features
- **Concept**: Concept Knowledge Base entries
- **ConceptCategory**: Concept categorization (INNER, HEALTH, RELATIONSHIP, FINANCE)

### Migrations

```bash
# Create migration
cd prisma
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Seed Data

The seed script creates:
- 1 demo user: `demo@lifelessons.app / Passw0rd!`
- 12 sample lessons (3 per domain)
- 1 goal with target 10,000
- 1 active sprint (100 lessons)
- Sample concepts for CKB

```bash
pnpm seed
```

## 🧪 Testing

### Backend Tests

```bash
cd apps/api

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

### Frontend E2E Tests

```bash
cd apps/web
pnpm test:e2e
```

Test flow:
1. Signup new user
2. Create lesson (text)
3. Analyze lesson (AI mock)
4. View dashboard progress
5. Share lesson anonymously

## 📱 Mobile App (Scaffold)

Basic Expo app with:
- Dashboard
- Quick Capture (with mic button)
- Journal list
- Create/Edit lesson
- Offline SQLite storage
- Sync API (TODO)

```bash
cd apps/mobile
pnpm start
```

## 🚢 Deployment

### Recommended Services

- **Frontend**: Vercel
- **Backend**: Fly.io / Render
- **Database**: Neon / Supabase / Cloud SQL
- **Redis**: Upstash
- **File Storage**: Cloudflare R2 / S3

### Build for Production

```bash
# Backend
cd apps/api
pnpm build
pnpm start:prod

# Frontend
cd apps/web
pnpm build
pnpm start
```

### Docker Production

```yaml
# Example production docker-compose.yml
version: '3.9'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
  
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3001:3001"
    depends_on:
      - db
      - redis
  
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      NEXT_PUBLIC_API_BASE_URL: ${API_URL}
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

## 📖 Acceptance Criteria (MVP)

- ✅ Signup/Login works smoothly
- ✅ Create lesson text in ≤30s from app open
- ✅ `/ai/lessons/:id/analyze` returns summary/concepts/nextQuestion in ≤2s (mock)
- ✅ Goal 10,000 auto-creates 100-lesson sprints
- ✅ Dashboard shows progress ring
- ✅ Daily evening reminder triggers BullMQ job at user's local time
- ✅ Export JSON/CSV works
- ✅ Import 1,000 concepts in <60s (CKB)

## 🗺 Roadmap

### V1.1 (Planned)

- [ ] OAuth (Google/Apple)
- [ ] MFA (2FA)
- [ ] Semantic search with pgvector
- [ ] Real LLM integration (OpenAI/Anthropic)
- [ ] Push notifications (OneSignal)
- [ ] Health & Calendar integrations
- [ ] Community: comments, moderation
- [ ] Topic modeling & pattern detection

## 📝 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

Built with:
- NestJS
- Next.js
- Prisma
- Expo
- shadcn/ui
- TailwindCSS

---

**Made with ❤️ for lifelong learners**

For questions or issues, please open a GitHub issue.
