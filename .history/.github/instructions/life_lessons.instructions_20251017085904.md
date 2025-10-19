---
applyTo: '**'
---
# Claude Code – Instruction Plan cho “Life Lessons App” (v1.0)

> Mục tiêu: Đây là **instruction đầu vào** để Claude Code sinh code **MVP web + backend** (kèm scaffold mobile) cho ứng dụng ghi chép – phân tích – lộ trình 10.000 bài học. Văn bản này đã tối ưu để Claude **hiểu rõ yêu cầu, tạo cấu trúc repo, file, API, DB, test** và script chạy nhanh.

---

## 0) Nguyên tắc thực thi cho Claude

* Luôn sinh code **chạy được ngay** (minimal viable, loại bỏ phần “…” placeholder trừ khi ghi chú rõ TODO).
* Ưu tiên **TypeScript**, **Postgres**, **Next.js 15 (App Router)**, **NestJS** (hoặc FastAPI nếu chọn Python—mặc định NestJS).
* Tách **frontend** và **backend** trong cùng monorepo (pnpm workspace) + mobile scaffold (Expo) để sẵn sàng mở rộng.
* Viết **README** chi tiết kèm lệnh chạy, biến môi trường, seed data, hướng dẫn migrate.
* Tạo **OpenAPI/Swagger** tự động từ backend; thêm **Prisma** cho ORM (hoặc TypeORM; mặc định Prisma).
* Bao gồm **vitest/jest** (backend), **playwright** (e2e web) và **eslint+prettier**.
* Đảm bảo **Auth** bằng email/password + JWT (MFA optional, để TODO), rate-limit cơ bản.
* Tạo **seed**: 1 user demo, 12 bài học mẫu.

---

## 1) Kiến trúc & Tech Stack

* **Monorepo**: pnpm workspaces.
* **Frontend Web**: Next.js 15 + React, App Router, TailwindCSS, shadcn/ui, React Query, i18n, dark mode.
* **Backend**: NestJS + Prisma + Postgres, BullMQ (Redis) cho nhắc nhở/báo cáo, Zod cho DTO validate, Swagger.
* **Mobile scaffold**: React Native (Expo), SQLite offline, sync API, push (OneSignal/Expo Notifications – TODO wire later).
* **Search**: Postgres `pg_trgm` (v1), optional pgvector (TODO v1.1).
* **Auth**: JWT (access + refresh), bcrypt password. (OAuth – TODO v1.1)
* **Infra Dev**: Docker Compose (postgres + redis + backend + frontend).
* **Analytics**: PostHog (env flag), Feature flags – TODO.

---

## 2) Cấu trúc thư mục (tạo đủ file rỗng cần thiết)

```
life-lessons/
  README.md
  .env.example
  docker-compose.yml
  package.json
  pnpm-workspace.yaml
  apps/
    web/ (Next.js)
    api/ (NestJS)
    mobile/ (Expo scaffold)
  packages/
    ui/ (shared UI nếu cần)
    config/ (eslint, tsconfig, prettier)
  prisma/
    schema.prisma
  scripts/
    seed.ts
    migrate.sh
```

---

## 3) Biến môi trường (.env.example)

```
# Common
NODE_ENV=development
TZ=Asia/Bangkok

# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/lifelessons

# Redis
REDIS_URL=redis://redis:6379

# Auth
JWT_SECRET=change_me
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Web
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Optional
POSTHOG_KEY=
```

---

## 4) Mô hình dữ liệu (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String   @id @default(uuid())
  email            String   @unique
  passwordHash     String
  name             String?
  locale           String?  @default("vi")
  tz               String?  @default("Asia/Bangkok")
  privacyDefault   Privacy  @default(PRIVATE)
  lessons          Lesson[]
  goals            Goal[]
  reminders        Reminder[]
  groups           Membership[]
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

enum Privacy {
  PRIVATE
  GROUP
  LINK
  PUBLIC_ANON
}

enum Domain {
  INNER
  HEALTH
  RELATIONSHIP
  FINANCE
}

enum ReminderType {
  DAILY_EVENING
  WEEKLY_REVIEW
  MONTHLY_RETRO
}

model Lesson {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  contentRaw      String
  contentSummary  String?
  domain          Domain
  tags            String[]
  mood            Int      // -2..+2
  resonance       Int      // 0..3
  gratitude       String?
  attachments     String[]
  visibility      Privacy   @default(PRIVATE)
  language        String?   // auto-detect
  aiConcepts      String[]
  aiNextQuestion  String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  reactions       Reaction[]
}

model Goal {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  type       String   // "lesson_count"
  target     Int      // default 10000
  current    Int      @default(0)
  sprintSize Int      @default(100)
  cadence    String   // daily|5x_week|custom
  status     String   @default("active") // active|paused|done
  sprints    Sprint[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Sprint {
  id        String   @id @default(uuid())
  goalId    String
  goal      Goal     @relation(fields: [goalId], references: [id])
  index     Int
  startAt   DateTime
  endAt     DateTime
  target    Int
  done      Int      @default(0)
}

model Reminder {
  id       String       @id @default(uuid())
  userId   String
  user     User         @relation(fields: [userId], references: [id])
  type     ReminderType
  hour     Int          // local hour
  channel  String       // push|email
}

model Group {
  id        String       @id @default(uuid())
  name      String
  ownerId   String
  members   Membership[]
}

model Membership {
  id      String  @id @default(uuid())
  groupId String
  userId  String
  role    String  // admin|member
}

model Reaction {
  id       String  @id @default(uuid())
  lessonId String
  userId   String
  type     String  // "thank_you"
}
```

---

## 5) Backend (NestJS) – Modules & Endpoints

**Modules**: `AuthModule`, `UsersModule`, `LessonsModule`, `GoalsModule`, `SprintsModule`, `AnalyticsModule`, `RemindersModule`, `GroupsModule`, `ReactionsModule`, `AiModule`, `SearchModule`.

**Routes (REST)**

```
POST   /auth/signup
POST   /auth/login
POST   /auth/refresh

GET    /me

POST   /lessons
GET    /lessons
GET    /lessons/:id
PATCH  /lessons/:id
DELETE /lessons/:id
POST   /lessons/:id/share  // tạo link ẩn danh (signed token)
POST   /lessons/:id/react  // {type:"thank_you"}

POST   /ai/lessons/:id/analyze  // trả {summary, concepts[], nextQuestion}
GET    /analytics/overview      // tổng, theo domain, streak, heatmap (server computes)

POST   /goals
GET    /goals/:id
GET    /goals/:id/roadmap

POST   /reminders
GET    /reminders

POST   /groups
POST   /groups/:id/invite
GET    /groups/:id/leaderboard // streak nhóm

GET    /export?format=markdown|csv|json
```

**Yêu cầu kỹ thuật**

* DTO validate bằng Zod/Pipe; guard JWT; rate limit (e.g. 100 req/15m/IP).
* Swagger tự động (`/docs`).
* Service AI mock (v1): tạo summary/concepts/nextQuestion bằng rule-based + TODO hook LLM.
* Search: `/lessons?q=...&domain=&tag=&from=&to=` dùng `ILIKE` + `pg_trgm` nếu có.

---

## 6) Frontend Web (Next.js) – Trang & Thành phần

**Pages (App Router)**

* `/` Dashboard: Quick Capture (text/voice), Progress ring, Heatmap, AI suggestions.
* `/journal` danh sách, filter (domain/tag/mood), create/edit Lesson.
* `/goals` xem tiến độ 10,000 + sprint chart.
* `/community` feed ẩn danh (read-only v1), nhóm (leaderboard), reactions.
* `/settings` tài khoản, reminders, privacy, export.
* `/share/[token]` xem bài học công khai ẩn danh.

**Components**

* `QuickCaptureCard`, `LessonForm`, `ProgressRing`, `Heatmap`, `SprintBar`, `GratitudeChip`, `StatsCards`, `ShareButton`, `ReactionButton`.

**State**: React Query; auth via http-only cookie or Authorization header (bearer).

**UI**: Tailwind + shadcn/ui; dark mode theo hệ thống.

---

## 7) Mobile (Expo) – Scaffold tối thiểu

* Màn hình: Dashboard, Quick Capture (mic), Journal list, Create Lesson.
* Lưu offline (SQLite) → sync khi online.
* Phần push notification: thêm dependency + stub (TODO wiring backend later).

---

## 8) AI/ML – Spec cho Claude cài đặt Mock + Hook

**V1 (Mock & Adapter):**

* Tạo `AiService` với 2 triển khai: `MockAiService` (mặc định) và `LlmAiService` (TODO).
* Phương thức:

  * `analyzeLesson(contentRaw: string, lang?: string)` → `{ summary, concepts: string[], nextQuestion: string }`
* Quy tắc mock:

  * Summary: rút 1–2 câu từ câu dài nhất + câu kết.
  * Concepts: trích 3–5 noun phrase/top keywords.
  * Next question: theo domain mapping (INNER/HEALTH/RELATIONSHIP/FINANCE).

**Prompt (ghi trong comment cho LLM sau này):**

```
Tóm tắt 1–2 câu, liệt kê 3 “điểm rọi”, đề xuất 1 “khái niệm nguồn có lợi” (<=15 từ), và 1 câu hỏi tiếp theo.
Ngôn ngữ: theo đầu vào; văn phong trung tính, không phán xét.
```

---

## 9) Nhắc nhở & Lịch (BullMQ)

* Queue: `reminders`.
* Job producer: cron mỗi 5 phút, đọc `Reminder` theo múi giờ người dùng và giờ hiện tại.
* Job consumer: gửi email (adapter SMTP mock), ghi log; push – TODO.

---

## 10) Bảo mật

* JWT access + refresh, rotate refresh, revoke list (Redis set expiring).
* Helmet, CORS allowlist (WEB origin), CSRF không cần nếu Bearer, nếu cookie → bật CSRF.
* Input validation & output filtering; limit size body 1MB.
* Content safety: khi public, ẩn thông tin cá nhân nếu phát hiện pattern email/sdt (regex basic v1).

---

## 11) Testing & QA

* **Backend**: Jest/Vitest unit cho services/controllers; supertest e2e cho auth, lessons, goals.
* **Frontend**: Playwright e2e flow: signup → create lesson (text) → analyze → view dashboard.
* Coverage mục tiêu: 70% core.

---

## 12) CI/CD (gợi ý)

* GitHub Actions:

  * job `lint+typecheck+test` mỗi PR,
  * job build Docker images.
* Deploy preview: Vercel (web), Fly/Render (api), Neon/Cloud SQL (Postgres), Upstash (Redis).

---

## 13) Seed & Demo

* `scripts/seed.ts`: tạo 1 user `demo@lifelessons.app / Passw0rd!`, 12 lessons (3 mỗi domain), 1 goal 10,000 (sprintSize 100) với sprint đầu.
* Gắn tag, mood ngẫu nhiên; set vài bài `PUBLIC_ANON` để thử `/share`.

---

## 14) Acceptance Criteria (MVP)

* Đăng ký/đăng nhập hoạt động; tạo bài học text ≤ 30s từ mở app (flow web).
* Gọi `/ai/lessons/:id/analyze` trả summary/concepts/nextQuestion trong ≤ 2s (mock).
* Tạo Goal 10,000 → auto chia sprint 100; dashboard hiển thị progress.
* Nhắc nhở DAILY_EVENING phát sinh job đúng giờ người dùng (log mock send).
* Export JSON/CSV hoạt động.

---

## 15) Lệnh scaffold & chạy (Claude hãy tự chèn vào README)

```bash
# Monorepo
pnpm init -y
pnpm dlx create-turbo@latest life-lessons --no-install # hoặc tự init; nếu không, tự tạo cấu trúc như trên

# Backend
pnpm create @nestjs/cli apps/api
cd apps/api && pnpm add @nestjs/config @nestjs/swagger swagger-ui-express @nestjs/jwt bcrypt zod @anatine/zod-nestjs prisma @prisma/client @nestjs/throttler bullmq ioredis && cd -

# Frontend
pnpm create next-app@latest apps/web --ts --eslint --tailwind --app --src-dir --no-import-alias
cd apps/web && pnpm add @tanstack/react-query axios zustand zod date-fns && cd -

# Mobile scaffold
pnpm dlx create-expo-app apps/mobile -t

# Root deps
pnpm add -D typescript ts-node nodemon eslint prettier turbo concurrently

# Prisma
pnpm dlx prisma init --datasource-provider postgresql
pnpm dlx prisma generate
pnpm dlx prisma migrate dev --name init

# Docker dev
docker-compose up -d
```

**docker-compose.yml (tối giản)**

```yaml
version: '3.9'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: lifelessons
    ports: ["5432:5432"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
  api:
    build: ./apps/api
    env_file: .env
    depends_on: [db, redis]
    ports: ["3001:3001"]
  web:
    build: ./apps/web
    env_file: .env
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:3001
    depends_on: [api]
    ports: ["3000:3000"]
```

---

## 16) OpenAPI (rút gọn – để Swagger tự generate)

```yaml
openapi: 3.0.3
info:
  title: Life Lessons API
  version: 1.0.0
paths:
  /auth/signup:
    post:
      summary: Signup
  /auth/login:
    post:
      summary: Login
  /lessons:
    get:
      summary: List lessons
    post:
      summary: Create lesson
  /lessons/{id}:
    get:
      summary: Get lesson
    patch:
      summary: Update lesson
    delete:
      summary: Delete lesson
  /ai/lessons/{id}/analyze:
    post:
      summary: Analyze lesson
```

---

## 17) Frontend – UX flow chi tiết cho Playwright e2e

1. `/signup` → tạo user.
2. `/journal/new` → nhập nội dung, chọn domain, tag, mood → Save.
3. Bấm “Analyze” → hiển thị summary/concepts/nextQuestion.
4. Mở `/` → thấy Progress ring tăng.
5. `/share` → copy link ẩn danh, mở tab mới xác nhận hiển thị public-anon.

---

## 18) Backlog (sau MVP)

* OAuth Google/Apple; MFA.
* Semantic search (pgvector), topic modeling, pattern weekly/monthly.
* Community: comment, report, moderation queue.
* Push notification real (OneSignal/FCM/APNs).
* Health & Calendar integrations.

---

## 19) Yêu cầu Claude xuất ra

* Repository đầy đủ theo cấu trúc mục 2, có **README** hướng dẫn run local.
* API chạy được tại `http://localhost:3001`, Web tại `http://localhost:3000`.
* Seed script chạy `pnpm ts-node scripts/seed.ts`.
* Swagger docs tại `/docs`.

---

## 20) Ghi chú phong cách code

* Tuân thủ eslint/prettier, strict TS.
* Tên hàm rõ nghĩa, comment ở layer service quan trọng.
* Controller mỏng, business ở service.
* Error chuẩn RFC7807 (problem+json) – optional v1.

---

**Kết thúc instruction.** Khi chạy xong MVP, đảm bảo 5 tiêu chí ở mục 14 đều đạt. Nếu thiếu dependency, Claude hãy tự thêm vào `package.json` và cập nhật README. Đừng quên tạo seed, route share ẩn danh, và mock AI.

---

## 21) Concept Knowledge Base (CKB) – “Thư viện Khái niệm nguồn có lợi”

> Mục tiêu: nạp, quản trị và khai thác thư viện **khái niệm nguồn có lợi** để AI dùng khi phân tích bài học và gợi ý reframe/câu hỏi tiếp theo.

### 21.1 Kiến trúc & Lựa chọn

* **Lưu trữ cấu trúc:** Postgres (bản ghi khái niệm, phân loại, quan hệ, alias, ví dụ minh hoạ, ngôn ngữ).
* **Tìm kiếm ngữ nghĩa:** `pgvector` (v0) hoặc fallback tf‑idf nếu chưa cài pgvector.
* **Chuẩn dữ liệu:** i18n‑ready (trường `language` + alias/translation), versioning nhẹ.

### 21.2 Prisma Schema (bổ sung)

```prisma
model ConceptCategory {
  id        String   @id @default(uuid())
  key       String   @unique  // e.g., "inner", "health", "relationship", "finance"
  title     String
  createdAt DateTime @default(now())
}

model Concept {
  id          String   @id @default(uuid())
  key         String   @unique     // stable key, e.g., "gratitude_refocus"
  slug        String   @unique
  title       String
  summary     String
  definition  String
  language    String   @default("vi")
  tags        String[]
  categoryId  String
  category    ConceptCategory @relation(fields: [categoryId], references: [id])
  source      String?
  version     Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  aliases     ConceptAlias[]
  relationsA  ConceptRelation[] @relation("A")
  relationsB  ConceptRelation[] @relation("B")
  examples    ConceptExample[]
}

model ConceptAlias {
  id         String  @id @default(uuid())
  conceptId  String
  alias      String
  language   String   @default("vi")
  concept    Concept @relation(fields: [conceptId], references: [id])
}

enum ConceptRelType { BROADER NARROWER RELATED ANTONYM }

model ConceptRelation {
  id      String @id @default(uuid())
  aId     String
  bId     String
  type    ConceptRelType
  A       Concept @relation("A", fields: [aId], references: [id])
  B       Concept @relation("B", fields: [bId], references: [id])
}

model ConceptExample {
  id         String  @id @default(uuid())
  conceptId  String
  text       String
  language   String   @default("vi")
  concept    Concept @relation(fields: [conceptId], references: [id])
}

// Nếu dùng pgvector, tạo bảng embedding riêng
model ConceptEmbedding {
  id         String  @id @default(uuid())
  conceptId  String  @unique
  // Lưu chiều 1024 (tuỳ model); Prisma chưa có vector type → dùng Bytes hoặc extension raw SQL
  // Gợi ý: tạo migration SQL thủ công: ALTER TABLE "ConceptEmbedding" ADD COLUMN "embedding" vector(1024);
  concept    Concept @relation(fields: [conceptId], references: [id])
}
```

> Ghi chú migration: thêm extension `vector` trong Postgres migration: `CREATE EXTENSION IF NOT EXISTS vector;`

### 21.3 API – Endpoints quản trị & khai thác

```
// Admin (bảo vệ bằng role)
POST   /admin/concepts/import            // CSV/JSONL upload → bulk upsert
POST   /admin/concepts                   // create
PATCH  /admin/concepts/:id               // update
GET    /admin/concepts                   // list + filter
GET    /admin/concepts/:id               // detail
POST   /admin/concepts/:id/aliases       // add alias
POST   /admin/concepts/:id/examples      // add example
POST   /admin/concepts/:id/relations     // add relation

// Public (để AI và UI tra cứu)
GET    /concepts/search?q=...&lang=vi&domain=inner&k=8
GET    /concepts/:id
```

**Tiêu chí:**

* Import ≥ 5.000 mục trong < 3 phút (local), idempotent (upsert theo `key`).
* Tìm kiếm trả kết quả < 300ms cho `k ≤ 10`.

### 21.4 Định dạng Import

**CSV (UTF‑8, header):**

```
key,slug,title,category,tags,language,summary,definition,aliases,examples,antonyms,related,source,version
```

* `tags`: chuỗi phân tách `|`. `aliases`, `examples`, `antonyms`, `related`: phân tách `|`.

**JSONL (khuyến nghị):**

```json
{"key":"gratitude_refocus","slug":"gratitude-refocus","title":"Tái tập trung vào biết ơn","category":"inner","tags":["gratitude","mindset"],"language":"vi","summary":"Nhìn lại điều mình đã có.","definition":"Thực hành chuyển sự chú ý về những gì đang có và đang học.","aliases":["biết ơn","tri ân"],"examples":["Viết 3 điều biết ơn trước khi ngủ"],"antonyms":["so sánh tiêu cực"],"related":["reframe_negative_thoughts"],"source":"library_v1","version":1}
```

### 21.5 Ingestion Pipeline

1. **Upload** file → lưu tạm S3/local.
2. **Parse** (CSV/JSONL) → chuẩn hoá trường, map `category` → `ConceptCategory`.
3. **Upsert** `Concept` theo `key`; tạo `Alias`, `Example`, `Relation`.
4. **Embedding (nếu bật pgvector):** generate embedding cho `title + summary + definition + aliases` → upsert `ConceptEmbedding`.
5. **Rebuild index** (nếu tf‑idf fallback).
6. **Report**: số record tạo/cập nhật/lỗi; ghi log.

**Script mẫu:** `scripts/import_concepts.ts --file=path --lang=vi --embeddings=on`

### 21.6 Tích hợp vào AI/Analyze flow

* Khi `POST /ai/lessons/:id/analyze`:

  1. Ghép `contentRaw` + (nếu có) `contentSummary` tạm.
  2. **Retrieve**: semantic search top‑k (k=8) trong `ConceptEmbedding` (hoặc tf‑idf) + **filter theo domain** (qua `category`).
  3. **Rerank**: +2 điểm nếu khớp `tags`; +1 nếu trùng ngôn ngữ; +1 nếu concept từng được người dùng chọn trước đây.
  4. **Compose** prompt: chèn **top 3–5** concept (title + summary + definition + examples ngắn) làm “kiến thức bối cảnh”.
  5. Sinh `summary`, `concepts[]` (ưu tiên từ CKB) và `nextQuestion`.

**Prompt snippet (chèn vào comment trong code):**

```
Bạn là AI Coach. Dưới đây là một số khái niệm nguồn có lợi (CKB) liên quan:
{{concepts_context}}
- Tóm tắt 1–2 câu nội dung bài học.
- Liệt kê tối đa 3 “điểm rọi”.
- Đề xuất tối đa 2 khái niệm nguồn (ưu tiên trong CKB, ghi key + title ngắn).
- Gợi ý 1 câu hỏi tiếp theo mang tính hành động.
Giữ trung tính, không phán xét; ngôn ngữ theo đầu vào.
```

### 21.7 UX cho người dùng & admin

* **User:** Khi xem phân tích, hiển thị “Khái niệm gợi ý” (chip + tooltip định nghĩa) + nút “Lưu vào Bách khoa cá nhân”.
* **Admin:** Trang **CKB Studio**: import file, duyệt record, sửa nhanh title/definition/tags, xem đồ thị quan hệ (related/broader/antonym), theo dõi version.

### 21.8 Đa ngôn ngữ

* Trường `language` cho mỗi concept; alias đa ngôn ngữ.
* Cho phép bản dịch: cùng `key`, khác `language` (đồng bộ `version`).
* Fallback: nếu thiếu ngôn ngữ người dùng → hiển thị bản gần nhất + nhãn “(dịch)” (TODO auto‑translate v1.1).

### 21.9 Đánh giá chất lượng & Telemetry

* **Metrics:** CTR vào concept chip; % người lưu concept; tỉ lệ concept được dùng trong phản hồi AI; user feedback 👍/👎 cho gợi ý.
* **AB test:** hai chiến lược rerank khác nhau.
* **Guardrails:** danh sách từ khoá nhạy cảm; kiểm duyệt khi public.

### 21.10 Acceptance Criteria (CKB)

* Import 1.000 concepts JSONL thành công, không trùng `key`, thời gian < 60s local.
* Search semantic top‑5 liên quan hợp lý cho 90% truy vấn thử nghiệm.
* Analyze flow sử dụng CKB (có log concept ids được dùng trong mỗi phân tích).
* Admin có thể sửa 1 concept và thấy thay đổi phản ánh vào gợi ý AI lần sau.

### 21.11 Hướng dẫn vận hành

* `pnpm ts-node scripts/import_concepts.ts --file=./data/ckb_v1.jsonl --embeddings=on`
* Với pgvector: bật extension + migration; nếu không, bật `USE_TFIDF=true` trong `.env`.
# Life Lessons App – Text Wireframes (v1.0)

> Wireframe bằng chữ cho Web (Desktop/Tablet) & Mobile (App). Tập trung vào bố cục, luồng tương tác, trạng thái chính – đủ để dev UI dựng nhanh bằng Next.js/React & RN/Expo.

---

## Ký hiệu chung

* `[BTN]` nút bấm • `(icon)` biểu tượng • `[Toggle]` bật/tắt • `[Input]` trường nhập • `[Select]` chọn • `[Chip]` nhãn nhỏ
* `→` điều hướng • `…` nội dung rút gọn • `⟲` refresh • `★` nổi bật • `?` tooltip • `[ ]` checkbox
* `|` cột dọc • `—` thanh ngang • `┌ ┐ └ ┘` khung • `[…]` thành phần con

---

## 1) Web – Dashboard `/`

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                       │
│ [Logo] LifeLessons | [Search q…]  | (Bell) | (User Avatar ▼)                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ Grid (2 cols)                                                                │
│ ┌────────────────────────────┐  ┌───────────────────────────────────────────┐ │
│ │ Quick Capture              │  │ Progress                                 │ │
│ │ ─────────────────────────  │  │ ──────────────────────────────────────── │ │
│ │ [Textarea: "Hôm nay mình…"]│  │ [ProgressRing 10,000] [SprintBar 63/100] │ │
│ │ Domain: [Select]           │  │ [Heatmap tháng][StatsCards: total,streak] │ │
│ │ Tags: [Input + Chips]      │  │ [AI Tip Box: gợi ý hôm nay]               │ │
│ │ Mood: (-2 -1 0 +1 +2)      │  │                                           │ │
│ │ Resonance: (0 1 2 3)       │  │                                           │ │
│ │ [ ] Gratitude  [Input…]    │  │                                           │ │
│ │ [BTN Save] [BTN Mic] [BTN Analyze] [Share ▼]                               │ │
│ └────────────────────────────┘  └───────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ AI Suggestions (carousel)                                                │ │
│ │  [Card] “Câu hỏi tiếp theo”  [Card] “Ritual gợi ý”  [Card] “Thiếu Health”│ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
Footer: © … | Terms | Privacy
```

**Hành động chính:** Save → tạo Lesson nháp → Analyze → hiển thị summary/concepts/nextQ (toast + side panel). Share tạo link ẩn danh.

---

## 2) Web – Journal List `/journal`

```
┌───────────────────────── Filter Bar ────────────────────────────────────────┐
│ Domain [All▼] | Tags [#work #sleep …] | Mood [–2..+2] | Date [This month]   │
│ [Search q…] [BTN New Lesson] (⟲)                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ List (virtualized)                                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [Card]                                                                    │ │
│ │  Title (1st line of content)      [Chip Domain] [Mood] [Resonance]        │ │
│ │  Snippet…                                                                │ │
│ │  [BTN Analyze] [BTN Edit] [Share] (⋯ more)                               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ (repeat…)                                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
Side Panel (on select): Summary, Concepts (chips), Next Question, History.
```

**Empty state:** “Chưa có bài học. [BTN Ghi bài đầu tiên]” + micro‑prompt gợi ý.

---

## 3) Web – Lesson Create/Edit `/journal/new` & `/journal/:id`

```
┌─────────────── Left (Editor) ───────────────┐┌────────────── Right (AI Panel) ─┐
│ [Textarea multiline]                        ││ [Analyze now]                    │
│ Domain [Select]  Tags [Input]               ││ Summary: …                       │
│ Mood [–2..+2]  Resonance [0..3]             ││ Points: • … • … • …              │
│ [ ] Gratitude  [Input…]                     ││ Concepts (chips): [C1][C2][C3]   │
│ Visibility [Private|Group|Link|PublicAnon]  ││ Next Q: “…” [Use as prompt]      │
│ Attachments [Dropzone]                      ││ Related lessons: [L1][L2]         │
│ [BTN Save] [BTN Analyze] [BTN Delete]       ││                                   │
└─────────────────────────────────────────────┘└──────────────────────────────────┘
```

**Lỗi/Validation:** hiển thị inline dưới trường nhập. **Autosave** mỗi 5s.

---

## 4) Web – Goals & Roadmap `/goals`

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header: Mục tiêu 10,000 bài học                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ [ProgressRing lớn]   [Stats: total, %complete, streak]   [BTN Edit Goal]     │
│ Sprint Plan: [Select: Sprint 1/100]  [DateRange]                              │
│ ┌──────────── Sprint Chart (bars 0..100) ────────────┐  ┌──── Ritual panel ─┐ │
│ │ ████░░░…                                            │  │ Weekly Review     │ │
│ │ Markers: today, target                              │  │ • 3 câu hỏi …      │ │
│ └─────────────────────────────────────────────────────┘  │ [BTN Start]       │ │
│ Recommendations: “Thiếu Health tuần này”  [BTN Add Plan tuần tới]             │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Edit Goal Modal:** target, sprintSize, cadence, startDate.

---

## 5) Web – Community `/community`

```
Tabs: [Feed ẩn danh] [Nhóm của tôi] [Thử thách]

[Feed ẩn danh]
┌──────────────────────────────────────────────────────────────────────────────┐
│ Card PublicAnon                                                               │
│  Content (ẩn thông tin cá nhân)                                              │
│  Chips: [Concept1][Concept2]   [BTN Thank you]  [Report]                      │
└──────────────────────────────────────────────────────────────────────────────┘

[Nhóm của tôi]
┌──────── Group Header ────────┐  Leaderboard (Streak) [User A 21d][…]         │
│ [Group Name]  [Invite Link]  │  Feed nhóm (private)                          │
└──────────────────────────────┘

[Thử thách]
- Cards 7/21/30 ngày → [BTN Tham gia] → modal đặt nhịp & thời gian nhắc.
```

---

## 6) Web – Share Public View `/share/[token]`

```
┌ Public header: “Bài học ẩn danh”  [Logo]                                     │
│ Content (read‑only)  | Concepts (chips) | Date                                │
│ [BTN Try the app]                                                               │
```

---

## 7) Web – Settings `/settings`

```
Sidebar: [Account][Privacy][Reminders][Export][CKB Studio (admin)]

[Account]
Email [read‑only]  Name [Input]  Locale [vi|en]  TZ [Select]  [BTN Save]

[Privacy]
Default visibility [Private|Group|Link|PublicAnon]  [✱ Warning copy]

[Reminders]
List: DAILY_EVENING 21:00 push|email  [Edit] [Delete]   [BTN Add reminder]

[Export]
[BTN Export Markdown] [BTN Export CSV] [BTN Export JSON] (tooltip hướng dẫn)
```

---

## 8) Web – Admin: CKB Studio `/settings/ckb`

```
Tabs: [Import] [Browse] [Relations] [Analytics]

[Import]
┌ Dropzone CSV/JSONL ─────────────────────────────────────────────────────────┐
│ [Mapping Preview Table]                                                     │
│ [Select Category] [Lang] [ ] Generate embeddings (pgvector)                 │
│ [BTN Import] → Progress bar + Log                                           │
└─────────────────────────────────────────────────────────────────────────────┘

[Browse]
Filter: q, category, lang | Table: key | title | tags | updatedAt | (Edit)
Row click → Drawer: title, summary, definition, aliases, examples, relations.

[Relations]
Graph mini‑map (list dạng text):
- gratitude_refocus → related: reframe_negative_thoughts, …

[Analytics]
Cards: total concepts, by category, top searched, CTR concept chip.
```

---

## 9) Web – Auth & Onboarding

```
[Signup]
Email [ ]  Password [ ]  Confirm [ ]  [BTN Create]  ↗ [Login]

[Login]
Email [ ]  Password [ ]  [BTN Login]  ↗ [Forgot]

[Onboarding Wizard]
Step 1: Chọn mục tiêu (10,000 mặc định) [Edit]
Step 2: Cài nhịp (daily/5x week) + giờ vàng [Select]
Step 3: Tạo reminder DAILY_EVENING 21:00 [BTN Confirm]
```

---

## 10) Web – Notifications (Toast/Inline)

* `Saved.` • `Analyzing…` → `AI summary ready.` • `Link copied.` • Error inline dưới field.

---

## 11) Mobile – Dashboard

```
┌ App Bar: [≡] LifeLessons           (Bell)                                     │
│ [QuickCapture Card]                                                         │
│  [Mic round BTN]  [Textarea 2 lines placeholder]  [Save] [Analyze]          │
│  Domain [Pill Select]  Tags [Inline chips]  Mood/Resonance (small pills)    │
│ ─────────────────────────────────────────────────────────────────────────── │
│ [Progress compact ring]  [Streak counter]  [Heatmap mini]                   │
│ [AI Tip small card]                                                         │
└ Bottom Tabs: [Home][Journal][Goals][Community][Settings]                     │
```

---

## 12) Mobile – Journal List & Detail

```
[List]
- Card: 1 dòng tiêu đề + 1 dòng snippet + chips (domain, mood) + (⋯)
- Pull‑to‑refresh • Infinite scroll • [FAB +] tạo Lesson

[Detail]
┌ Content read/edit toggle                                                    │
│ [Textarea]                                                                  │
│ Domain/Tags/Mood/Resonance                                                  │
│ Gratitude [Input]  Visibility [Select]  Attachments [Add]                   │
│ [Save] [Analyze] [Share]                                                    │
│ AI Panel (accordion): Summary | Concepts chips | Next Q                     │
```

---

## 13) Mobile – Goals & Roadmap

```
[Header] Goals
[Progress ring large]
[Sprint bar horizontal]
[Weekly Review CTA] [Set cadence]
[Recommendations list]
```

---

## 14) Mobile – Community

```
Tabs: Feed | Groups | Challenges
Feed: card ẩn danh + [Thank you] + [Report]
Groups: danh sách nhóm, streak board nhỏ
Challenges: tham gia 7/21/30 ngày
```

---

## 15) Empty States & Loading

* Dashboard: “Chào mừng! Hãy ghi bài học đầu tiên – gợi ý: *Hôm nay mình nhận ra…*”
* Journal: “Chưa có bài học. [Ghi ngay]”
* Goals: “Chưa đặt mục tiêu. [Tạo mục tiêu 10,000]”
* Community: “Chưa tham gia nhóm. [Tạo nhóm/Tham gia bằng mã]”
* Loading: skeleton cho cards; shimmer heatmap.

---

## 16) Accessiblity & Responsive

* Focus ring rõ, keyboard nav, aria‑label cho tất cả icon.
* Breakpoints: Desktop (≥1280), Tablet (768–1279), Mobile (≤767). Grid tự động dồn 1 cột.

---

## 17) States & Edge Cases

* Analyze thất bại → hiển thị retry + lưu log.
* Share token hết hạn (nếu có TTL) → trang thông báo + CTA đăng ký.
* Nhắc nhở bị trùng giờ → gợi ý hợp nhất.

---

## 18) Hướng dẫn dev dựng UI từ wireframe

* Ưu tiên tạo **layout & container** trước: Header, Sidebar/Tab, Content.
* Tạo **components tái sử dụng**: QuickCapture, ProgressRing, Heatmap, SprintBar.
* mock data bằng fixtures → nối API khi sẵn.
* Kiểm tra **empty/loading/error states** trước khi ghép logic.

---

## 19) Checklist review thiết kế

* [ ] Mọi action chính ≤ 3 click từ Dashboard.
* [ ] Form Create/Edit có autosave + validation rõ.
* [ ] AI Panel không che nội dung chính trên mobile (dùng accordion).
* [ ] Trạng thái private‑first, share ẩn danh có cảnh báo.
* [ ] Mọi text có độ tương phản ≥ 4.5:1.

---

**Kết:** Bộ wireframe chữ này đủ để dev dựng UI và product review nhanh trước khi qua high‑fidelity. Nếu cần, mình sẽ chuyển các khối này thành **component map** cho shadcn/ui + Tailwind class gợi ý.
