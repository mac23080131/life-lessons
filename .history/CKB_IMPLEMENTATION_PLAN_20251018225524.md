# 📚 Concept Knowledge Base (CKB) - Implementation Plan v1.0

> **Mục tiêu:** Xây dựng Kho Khái niệm Nguồn Có Lợi - một thư viện tri thức có cấu trúc để AI tham khảo khi phân tích bài học, đưa ra gợi ý reframe và câu hỏi tiếp theo cho người dùng.

---

## 🎯 VISION & OBJECTIVES

### Vision Statement
*"Một thư viện sống của các khái niệm, nguyên tắc, và thực hành đã được kiểm chứng - giúp người dùng học hỏi, áp dụng và phát triển liên tục qua 10,000 bài học."*

### Key Objectives
1. **Cung cấp context cho AI** - Kho tri thức để AI tham khảo khi phân tích
2. **Gợi ý concepts liên quan** - Đề xuất khái niệm phù hợp với bài học của user
3. **Hướng dẫn thực hành** - Mỗi concept có examples và practices cụ thể
4. **Đa ngôn ngữ** - Hỗ trợ tiếng Việt và tiếng Anh
5. **Semantic search** - Tìm kiếm ngữ nghĩa chính xác
6. **Community-driven** - Cho phép admin và power users đóng góp

---

## 📋 PHASE 1: FOUNDATION (Week 1-2)

### 1.1 Database Schema Design ✅

**Models cần tạo:**

```prisma
// prisma/schema.prisma

// Category cho concepts (Inner, Health, Relationship, Finance, etc.)
model ConceptCategory {
  id        String    @id @default(uuid())
  key       String    @unique  // "inner", "health", etc.
  title     String
  titleVi   String?
  description String?
  icon      String?   // emoji or icon name
  order     Int       @default(0)
  concepts  Concept[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// Main concept entity
model Concept {
  id          String   @id @default(uuid())
  key         String   @unique  // stable identifier "gratitude_refocus"
  slug        String   @unique  // URL-friendly "gratitude-refocus"
  
  // Content fields
  title       String
  titleVi     String?
  summary     String   @db.Text
  summaryVi   String?  @db.Text
  definition  String   @db.Text
  definitionVi String? @db.Text
  
  // Metadata
  language    String   @default("en")
  tags        String[] // searchable tags
  difficulty  Int      @default(1) // 1-5: beginner to advanced
  categoryId  String
  category    ConceptCategory @relation(fields: [categoryId], references: [id])
  
  // Source & versioning
  source      String?  // "psychology", "stoicism", "mindfulness"
  sourceUrl   String?
  author      String?
  version     Int      @default(1)
  status      ConceptStatus @default(DRAFT)
  
  // Relations
  aliases     ConceptAlias[]
  examples    ConceptExample[]
  practices   ConceptPractice[]
  relationsA  ConceptRelation[] @relation("ConceptA")
  relationsB  ConceptRelation[] @relation("ConceptB")
  embeddings  ConceptEmbedding?
  usages      ConceptUsage[]
  
  // Analytics
  viewCount   Int      @default(0)
  usageCount  Int      @default(0)
  rating      Float?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
  
  @@index([categoryId])
  @@index([language])
  @@index([status])
  @@index([slug])
}

enum ConceptStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}

// Aliases for multilingual support
model ConceptAlias {
  id         String  @id @default(uuid())
  conceptId  String
  concept    Concept @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  alias      String  // "biết ơn", "tri ân", "gratitude"
  language   String  @default("vi")
  type       AliasType @default(SYNONYM)
  
  @@index([conceptId])
  @@index([alias])
}

enum AliasType {
  SYNONYM      // từ đồng nghĩa
  TRANSLATION  // bản dịch
  COLLOQUIAL   // cách nói thông dụng
}

// Real-world examples
model ConceptExample {
  id         String  @id @default(uuid())
  conceptId  String
  concept    Concept @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  title      String
  titleVi    String?
  content    String  @db.Text
  contentVi  String? @db.Text
  scenario   String? @db.Text // tình huống cụ thể
  language   String  @default("en")
  order      Int     @default(0)
  
  // Analytics
  helpful    Int     @default(0)
  notHelpful Int     @default(0)
  
  createdAt  DateTime @default(now())
  
  @@index([conceptId])
}

// Actionable practices
model ConceptPractice {
  id          String  @id @default(uuid())
  conceptId   String
  concept     Concept @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  title       String
  titleVi     String?
  description String  @db.Text
  descriptionVi String? @db.Text
  steps       String[] // array of action steps
  stepsVi     String[]
  timeframe   String? // "5 minutes", "daily", "weekly"
  difficulty  Int     @default(1) // 1-5
  order       Int     @default(0)
  
  // Analytics
  completions Int     @default(0)
  
  createdAt   DateTime @default(now())
  
  @@index([conceptId])
}

// Relationships between concepts
model ConceptRelation {
  id      String  @id @default(uuid())
  aId     String
  bId     String
  type    ConceptRelationType
  weight  Float   @default(1.0) // strength of relationship
  
  conceptA Concept @relation("ConceptA", fields: [aId], references: [id], onDelete: Cascade)
  conceptB Concept @relation("ConceptB", fields: [bId], references: [id], onDelete: Cascade)
  
  @@unique([aId, bId, type])
  @@index([aId])
  @@index([bId])
}

enum ConceptRelationType {
  BROADER      // A là khái niệm rộng hơn B
  NARROWER     // A là khái niệm hẹp hơn B
  RELATED      // A liên quan đến B
  ANTONYM      // A trái nghĩa với B
  PREREQUISITE // A là tiên quyết để hiểu B
  BUILDS_ON    // A xây dựng trên nền tảng của B
}

// Vector embeddings for semantic search
model ConceptEmbedding {
  id         String  @id @default(uuid())
  conceptId  String  @unique
  concept    Concept @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  // Embedding data (will use JSON or pgvector extension)
  embedding  Json    // Store as JSON array or use pgvector type
  model      String  @default("text-embedding-3-small") // OpenAI model used
  dimension  Int     @default(1536)
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([conceptId])
}

// Track concept usage in lessons
model ConceptUsage {
  id         String   @id @default(uuid())
  conceptId  String
  concept    Concept  @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  lessonId   String
  lesson     Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  // How concept was used
  context    String?  @db.Text // excerpt from lesson
  confidence Float    @default(0.0) // AI confidence score
  userFeedback Boolean? // did user find it helpful?
  
  createdAt  DateTime @default(now())
  
  @@index([conceptId])
  @@index([lessonId])
}

// Add to existing Lesson model
model Lesson {
  // ... existing fields ...
  concepts   ConceptUsage[]
}
```

**Migration plan:**
```bash
# Create migration
pnpm prisma migrate dev --name add_concept_knowledge_base

# Generate Prisma client
pnpm prisma generate
```

---

### 1.2 Backend API Foundation

**Module structure:**
```
apps/api/src/
├── concepts/
│   ├── concepts.module.ts
│   ├── concepts.controller.ts
│   ├── concepts.service.ts
│   ├── concepts-admin.controller.ts
│   ├── concepts-search.service.ts
│   ├── dto/
│   │   ├── create-concept.dto.ts
│   │   ├── update-concept.dto.ts
│   │   ├── search-concept.dto.ts
│   │   └── import-concepts.dto.ts
│   └── entities/
│       └── concept.entity.ts
├── concept-embeddings/
│   ├── embeddings.module.ts
│   ├── embeddings.service.ts
│   └── openai-embeddings.service.ts
└── concept-import/
    ├── import.module.ts
    ├── import.service.ts
    └── parsers/
        ├── csv-parser.ts
        └── jsonl-parser.ts
```

**Core endpoints:**

```typescript
// Public API
GET    /api/concepts                    // List concepts with filters
GET    /api/concepts/:id                // Get concept detail
GET    /api/concepts/:id/related        // Get related concepts
GET    /api/concepts/:id/examples       // Get examples
GET    /api/concepts/:id/practices      // Get practices
GET    /api/concepts/search?q=...       // Search concepts
GET    /api/concepts/categories         // List categories
GET    /api/concepts/category/:key      // Get concepts by category

// Admin API (protected)
POST   /api/admin/concepts              // Create concept
PATCH  /api/admin/concepts/:id          // Update concept
DELETE /api/admin/concepts/:id          // Delete concept
POST   /api/admin/concepts/:id/publish  // Publish concept
POST   /api/admin/concepts/:id/alias    // Add alias
POST   /api/admin/concepts/:id/example  // Add example
POST   /api/admin/concepts/:id/practice // Add practice
POST   /api/admin/concepts/:id/relation // Create relation
POST   /api/admin/concepts/import       // Bulk import
POST   /api/admin/concepts/:id/embedding // Generate embedding
```

**Service implementation priorities:**

1. **ConceptsService** - CRUD operations
2. **ConceptsSearchService** - Full-text + semantic search
3. **EmbeddingsService** - Generate & store embeddings
4. **ImportService** - CSV/JSONL bulk import

---

## 📋 PHASE 2: ADMIN UI (Week 3)

### 2.1 Admin Dashboard

**Route:** `/dashboard/admin/concepts`

**Features:**
- List all concepts with filters
- Search by title, tags, category
- Bulk actions (publish, archive, delete)
- Analytics dashboard (most used, viewed, rated)

**Components to build:**
```
apps/web/src/app/dashboard/admin/concepts/
├── page.tsx                    // Main list page
├── [id]/
│   ├── page.tsx                // Edit concept page
│   └── analytics/
│       └── page.tsx            // Concept analytics
├── new/
│   └── page.tsx                // Create concept
├── import/
│   └── page.tsx                // Bulk import UI
└── components/
    ├── ConceptList.tsx
    ├── ConceptForm.tsx
    ├── ConceptEditor.tsx       // Rich text editor
    ├── ExamplesManager.tsx
    ├── PracticesManager.tsx
    ├── RelationsGraph.tsx      // Visual relationship graph
    └── ImportWizard.tsx
```

### 2.2 Concept Editor

**Features:**
- **Rich text editor** for definition, summary
- **Markdown support** for examples & practices
- **Multi-language tabs** (EN/VI)
- **Tag input** with autocomplete
- **Category selector**
- **Difficulty slider** (1-5)
- **Relations builder** - drag & drop interface
- **Preview mode** - see how it looks to users
- **Version history** - track changes

### 2.3 Import Wizard

**Steps:**
1. **Upload file** (CSV/JSONL)
2. **Map fields** - preview & validate
3. **Conflict resolution** - handle duplicates
4. **Embedding generation** - optional
5. **Review & confirm**
6. **Import log** - show success/errors

**Sample CSV format:**
```csv
key,slug,title,titleVi,summary,summaryVi,category,tags,difficulty,source
gratitude_refocus,gratitude-refocus,Gratitude Refocus,Tái tập trung vào biết ơn,"Practice of shifting attention to what you have","Thực hành chuyển sự chú ý về những gì mình đã có",inner,"gratitude|mindfulness|reframe",2,positive_psychology
```

---

## 📋 PHASE 3: AI INTEGRATION (Week 4)

### 3.1 Concept Retrieval for AI Analysis

**Flow:**
```
User creates lesson
       ↓
AI analyzes content
       ↓
Search CKB for relevant concepts (semantic + keyword)
       ↓
Rank & filter concepts (relevance, domain, difficulty)
       ↓
Include top 3-5 concepts in AI prompt
       ↓
AI generates summary + suggests concepts + next question
       ↓
Save ConceptUsage records
```

**Implementation:**

```typescript
// apps/api/src/ai/ai.service.ts

async analyzeLessonWithConcepts(
  content: string,
  domain: Domain,
  language: string
): Promise<AnalysisResult> {
  // 1. Search relevant concepts
  const concepts = await this.conceptsSearchService.semanticSearch({
    query: content,
    domain,
    language,
    limit: 5,
    minRelevance: 0.7
  });
  
  // 2. Build AI prompt with concepts context
  const prompt = this.buildPromptWithConcepts(content, concepts, language);
  
  // 3. Call LLM
  const response = await this.openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });
  
  // 4. Parse response
  const analysis = this.parseAnalysisResponse(response);
  
  // 5. Match suggested concepts with CKB
  const matchedConcepts = await this.matchConceptsWithCKB(
    analysis.suggestedConcepts,
    concepts
  );
  
  return {
    ...analysis,
    concepts: matchedConcepts
  };
}

private buildPromptWithConcepts(
  content: string,
  concepts: Concept[],
  language: string
): string {
  const conceptsContext = concepts.map(c => 
    `**${c.title}** (${c.key}): ${c.summary}\n` +
    `Examples: ${c.examples[0]?.content || 'N/A'}`
  ).join('\n\n');
  
  return `
Bạn là AI Coach phân tích bài học của người dùng.

## Khái niệm nguồn có lợi (Concept Knowledge Base):
${conceptsContext}

## Bài học của người dùng:
"${content}"

## Yêu cầu phân tích:
1. Tóm tắt 1-2 câu nội dung bài học
2. Liệt kê 3 "điểm rọi" (key insights)
3. Đề xuất 2-3 khái niệm nguồn từ CKB ở trên (ưu tiên khớp với bài học)
4. Gợi ý 1 câu hỏi tiếp theo giúp người dùng đào sâu hơn

Giữ tone trung tính, không phán xét. Ngôn ngữ: ${language}
`;
}
```

### 3.2 Semantic Search Implementation

**Option A: pgvector (Recommended)**
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector column
ALTER TABLE "ConceptEmbedding" 
ADD COLUMN embedding_vector vector(1536);

-- Create index
CREATE INDEX ON "ConceptEmbedding" 
USING ivfflat (embedding_vector vector_cosine_ops);
```

**Option B: In-memory (fallback)**
```typescript
// Use cosine similarity in Node.js
import { cosineSimilarity } from '@/lib/vector-utils';

async semanticSearchFallback(
  queryEmbedding: number[],
  limit: number
): Promise<Concept[]> {
  const allEmbeddings = await prisma.conceptEmbedding.findMany({
    include: { concept: true }
  });
  
  const scored = allEmbeddings.map(e => ({
    concept: e.concept,
    score: cosineSimilarity(queryEmbedding, e.embedding as number[])
  }));
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.concept);
}
```

### 3.3 Embedding Generation

**Using OpenAI:**
```typescript
async generateEmbedding(text: string): Promise<number[]> {
  const response = await this.openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  });
  
  return response.data[0].embedding;
}

async indexConcept(conceptId: string): Promise<void> {
  const concept = await this.prisma.concept.findUnique({
    where: { id: conceptId },
    include: { aliases: true }
  });
  
  // Combine fields for embedding
  const text = [
    concept.title,
    concept.titleVi,
    concept.summary,
    concept.summaryVi,
    ...concept.aliases.map(a => a.alias)
  ].filter(Boolean).join(' ');
  
  const embedding = await this.generateEmbedding(text);
  
  await this.prisma.conceptEmbedding.upsert({
    where: { conceptId },
    create: {
      conceptId,
      embedding,
      model: 'text-embedding-3-small',
      dimension: 1536
    },
    update: {
      embedding,
      updatedAt: new Date()
    }
  });
}
```

---

## 📋 PHASE 4: USER-FACING UI (Week 5)

### 4.1 Concept Discovery Page

**Route:** `/dashboard/concepts`

**Features:**
- Browse concepts by category
- Search with filters
- Card/List toggle view
- Bookmark favorites
- Track learning progress

**UI wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ Concept Library                              [Grid/List]    │
├─────────────────────────────────────────────────────────────┤
│ Filters:                                                    │
│ [All Categories ▼] [All Difficulties ▼] [Search...]        │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│ │ 🧠 Inner   │ │ 💪 Health  │ │ ❤️ Relations│              │
│ │ 45 concepts│ │ 32 concepts│ │ 28 concepts│              │
│ └────────────┘ └────────────┘ └────────────┘              │
├─────────────────────────────────────────────────────────────┤
│ Featured Concepts                                           │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ ✨ Gratitude Refocus                   [Bookmark] [•••]│   │
│ │ Tái tập trung vào biết ơn                            │   │
│ │ Practice shifting attention to what you have...      │   │
│ │ 🏷️ gratitude mindfulness reframe                     │   │
│ │ ⭐⭐⭐ Beginner • 2,451 uses • 12 examples         │   │
│ └──────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ 🔄 Reframe Negative Thoughts         [Bookmark] [•••]│   │
│ │ ...                                                   │   │
│ └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Concept Detail Page

**Route:** `/dashboard/concepts/[slug]`

**Sections:**
1. **Header** - Title, summary, category, tags
2. **Definition** - Full explanation (collapsible)
3. **Why It Matters** - Benefits & importance
4. **Real Examples** - 3-5 scenarios
5. **How to Practice** - Step-by-step guides
6. **Related Concepts** - Graph visualization
7. **Your Usage** - Lessons where you applied this
8. **Community Insights** - Aggregated anonymous data

**UI wireframe:**
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Library            [Bookmark] [Share] [Practice] │
├─────────────────────────────────────────────────────────────┤
│ 🧠 Inner                                                    │
│ # Gratitude Refocus                                         │
│ Tái tập trung vào biết ơn                                   │
│                                                             │
│ Practice of shifting your attention from what you lack     │
│ to what you already have and are learning.                 │
│                                                             │
│ ⭐⭐⭐ Beginner • 2,451 uses • ❤️ 89% helpful           │
├─────────────────────────────────────────────────────────────┤
│ [Definition] [Examples] [Practice] [Related]                │
│                                                             │
│ ## Definition                                               │
│ Gratitude refocus is a cognitive technique that helps...   │
│                                                             │
│ ## Why It Matters                                           │
│ • Reduces rumination on negative thoughts                   │
│ • Increases positive emotions and well-being                │
│ • Strengthens resilience during challenges                  │
│                                                             │
│ ## Real Examples                                            │
│ ┌────────────────────────────────────────────────────┐     │
│ │ 💼 At Work                                          │     │
│ │ Instead of: "My presentation wasn't perfect"       │     │
│ │ Try: "I prepared well and got valuable feedback"   │     │
│ └────────────────────────────────────────────────────┘     │
│ ┌────────────────────────────────────────────────────┐     │
│ │ ❤️ Relationships                                    │     │
│ │ Instead of: "They forgot my birthday"              │     │
│ │ Try: "They've been there for me many times before" │     │
│ └────────────────────────────────────────────────────┘     │
│                                                             │
│ ## How to Practice                                          │
│ 1. Notice when you're focusing on lack                     │
│ 2. Pause and take 3 deep breaths                           │
│ 3. List 3 things you're grateful for in this situation     │
│ 4. Reflect on what you're learning                         │
│                                                             │
│ ⏱️ Practice time: 5 minutes • 🔁 Daily                     │
│ [Start Practice] [Add to My Routine]                       │
│                                                             │
│ ## Related Concepts                                         │
│ [Visual graph showing connections]                         │
│                                                             │
│ ## Your Journey (5 lessons)                                 │
│ • Mar 15 - "Today I realized..." [View lesson]             │
│ • Mar 12 - "Grateful for..." [View lesson]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 In-Lesson Concept Suggestions

**When AI analyzes lesson:**
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Đã phân tích bài học!                                    │
├─────────────────────────────────────────────────────────────┤
│ ## Tóm tắt                                                  │
│ Bạn đã nhận ra tầm quan trọng của việc tập trung...        │
│                                                             │
│ ## Khái niệm nguồn có lợi                                   │
│ ┌────────────────────────────────────────────────────┐     │
│ │ 🧠 Gratitude Refocus          [Learn More] [Apply] │     │
│ │ Tái tập trung vào biết ơn                          │     │
│ │ 93% match • Beginner                               │     │
│ └────────────────────────────────────────────────────┘     │
│ ┌────────────────────────────────────────────────────┐     │
│ │ 🔄 Reframe Negative Thoughts   [Learn More] [Apply]│     │
│ │ Đổi góc nhìn tiêu cực                              │     │
│ │ 87% match • Beginner                               │     │
│ └────────────────────────────────────────────────────┘     │
│                                                             │
│ ## Câu hỏi tiếp theo                                        │
│ "Trong tuần tới, bạn sẽ thực hành biết ơn như thế nào     │
│ khi gặp khó khăn?"                                          │
│                                                             │
│ [Use as Next Prompt] [Save Analysis]                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 PHASE 5: GAMIFICATION & LEARNING (Week 6)

### 5.1 Learning Paths

**Feature:** Guided journeys through related concepts

**Example path:**
```
🧠 Mindfulness Fundamentals (8 concepts)
├─ 1. Present Moment Awareness ✅
├─ 2. Non-Judgmental Observation ✅
├─ 3. Breath Focus 🔄 (in progress)
├─ 4. Body Scan Meditation 🔒
├─ 5. Mindful Eating 🔒
├─ 6. Walking Meditation 🔒
├─ 7. Loving-Kindness Practice 🔒
└─ 8. Integration into Daily Life 🔒

Progress: 25% • Estimated time: 6 weeks
```

### 5.2 Practice Tracking

**Feature:** Track which practices user has tried

```typescript
model ConceptPracticeLog {
  id          String   @id @default(uuid())
  userId      String
  practiceId  String
  
  completedAt DateTime @default(now())
  reflection  String?  @db.Text
  difficulty  Int?     // 1-5 how hard it was
  helpful     Boolean?
  
  user        User     @relation(fields: [userId], references: [id])
  practice    ConceptPractice @relation(fields: [practiceId], references: [id])
  
  @@index([userId])
  @@index([practiceId])
}
```

### 5.3 Concept Mastery Levels

**Levels:**
- 🌱 **Novice** - Just discovered (0 uses)
- 📖 **Learning** - Trying it out (1-5 uses)
- 💪 **Practicing** - Building habit (6-15 uses)
- ⭐ **Proficient** - Consistent application (16-30 uses)
- 🏆 **Master** - Deep integration (31+ uses)

**UI indicator:**
```
Gratitude Refocus
💪 Practicing • 12 uses • Next level: 4 more uses
━━━━━━━━━━━━░░░░ 75%
```

---

## 📋 PHASE 6: ANALYTICS & INSIGHTS (Week 7)

### 6.1 User Analytics Dashboard

**Route:** `/dashboard/concepts/my-journey`

**Metrics:**
- Total concepts discovered
- Concepts by category
- Mastery distribution
- Most used concepts
- Practice completion rate
- Learning streak

**Visualizations:**
- Radar chart - concept coverage by domain
- Timeline - concept discovery over time
- Network graph - concept connections in user's lessons

### 6.2 Concept Analytics (Admin)

**Metrics:**
- Most viewed concepts
- Most used in lessons
- Highest rated
- Most practiced
- Conversion funnel: View → Save → Practice → Master
- Search queries without results (gaps in CKB)

### 6.3 AI Effectiveness Metrics

**Track:**
- Concept suggestion accuracy
- User acceptance rate
- Concepts vs lesson quality
- Time to mastery
- Retention rate

---

## 📋 PHASE 7: CONTENT CURATION (Ongoing)

### 7.1 Initial Content Set (MVP)

**Categories to cover:**
1. **Inner (🧠)** - 20 concepts
   - Gratitude, Mindfulness, Reframing, Self-compassion, etc.
   
2. **Health (💪)** - 15 concepts
   - Sleep hygiene, Exercise consistency, Nutrition awareness, etc.
   
3. **Relationship (❤️)** - 15 concepts
   - Active listening, Boundaries, Empathy, Communication, etc.
   
4. **Finance (💰)** - 10 concepts
   - Delayed gratification, Compound thinking, Risk assessment, etc.

**Total MVP:** 60 concepts

### 7.2 Content Sources

- **Psychology research** - peer-reviewed findings
- **Philosophy** - Stoicism, Buddhism, etc.
- **Self-help classics** - Atomic Habits, Thinking Fast and Slow
- **Therapy techniques** - CBT, ACT, DBT practices
- **Community suggestions** - user-submitted concepts (moderated)

### 7.3 Content Quality Guidelines

**Each concept must have:**
- ✅ Clear, jargon-free definition
- ✅ At least 3 real-world examples
- ✅ 2+ actionable practices
- ✅ Source citation
- ✅ Bilingual (EN + VI)
- ✅ Tags & relations
- ✅ Difficulty rating

---

## 🚀 TECHNICAL IMPLEMENTATION CHECKLIST

### Phase 1: Foundation
- [ ] Create Prisma schema for CKB models
- [ ] Run migrations
- [ ] Create NestJS modules (ConceptsModule, EmbeddingsModule)
- [ ] Implement CRUD endpoints
- [ ] Add authentication guards
- [ ] Write unit tests

### Phase 2: Admin UI
- [ ] Create admin routes
- [ ] Build ConceptList component
- [ ] Build ConceptForm with rich editor
- [ ] Build ExamplesManager
- [ ] Build PracticesManager
- [ ] Build RelationsGraph
- [ ] Build ImportWizard
- [ ] Test bulk import with CSV

### Phase 3: AI Integration
- [ ] Integrate OpenAI embeddings API
- [ ] Implement semantic search (pgvector or fallback)
- [ ] Update AI analysis to use CKB
- [ ] Create ConceptUsage tracking
- [ ] Add concept suggestions to lesson response
- [ ] Test AI prompt with concept context

### Phase 4: User UI
- [ ] Create concepts browse page
- [ ] Create concept detail page
- [ ] Add concept chips to lesson analysis
- [ ] Add "Learn More" modals
- [ ] Add bookmark functionality
- [ ] Implement search with filters

### Phase 5: Gamification
- [ ] Create learning paths
- [ ] Implement practice tracking
- [ ] Add mastery levels
- [ ] Create progress indicators
- [ ] Add achievement badges

### Phase 6: Analytics
- [ ] Create user journey dashboard
- [ ] Create admin analytics
- [ ] Add telemetry tracking
- [ ] Build reports & exports

### Phase 7: Content
- [ ] Write initial 60 concepts
- [ ] Translate to Vietnamese
- [ ] Generate embeddings
- [ ] Import to database
- [ ] Test search quality

---

## 📊 SUCCESS METRICS

### User Engagement
- **Adoption rate:** 60% of users discover ≥1 concept in first week
- **Retention:** 40% of users return to concepts page weekly
- **Practice rate:** 20% of users try at least 1 practice
- **Mastery rate:** 10% of users reach "Proficient" on ≥3 concepts

### AI Effectiveness
- **Suggestion accuracy:** 70% of suggested concepts rated "helpful"
- **Coverage:** AI suggests relevant concept for 80% of lessons
- **Adoption:** Users click "Learn More" on 30% of suggestions

### Content Quality
- **Rating:** Average 4.0+ stars on concepts
- **Completeness:** 100% of concepts have examples & practices
- **Search satisfaction:** <5% of searches return 0 results

---

## 🔧 TECHNICAL STACK

### Backend
- **Database:** PostgreSQL + Prisma ORM
- **Vector search:** pgvector extension
- **Embeddings:** OpenAI text-embedding-3-small
- **API:** NestJS REST endpoints
- **Cache:** Redis for frequently accessed concepts

### Frontend
- **Framework:** Next.js 15 + React
- **UI:** Tailwind + shadcn/ui components
- **Rich editor:** Tiptap or Lexical
- **Graphs:** D3.js or Recharts for relation visualization
- **State:** React Query for server state

### DevOps
- **Migrations:** Prisma migrations
- **Seed:** TypeScript seed script for initial content
- **Testing:** Jest (unit), Playwright (E2E)
- **CI/CD:** GitHub Actions

---

## 💰 COST ESTIMATION

### OpenAI API Costs (Monthly)
- **Embeddings:** 
  - 60 concepts × 200 tokens = 12,000 tokens
  - Cost: ~$0.001 (one-time)
  - Ongoing: ~$0.01/month for new concepts
  
- **Search queries:**
  - 10,000 searches/month × 50 tokens = 500,000 tokens
  - Cost: ~$0.025/month

**Total API cost:** ~$0.04/month (negligible)

### Storage
- Concepts: ~1MB/100 concepts
- Embeddings: ~6KB/concept × 100 = 600KB
- **Total:** <10MB for MVP

---

## 🎯 MVP DEFINITION (Phases 1-4)

**Minimum Viable Product includes:**
1. ✅ Database schema & migrations
2. ✅ Admin CRUD & bulk import
3. ✅ 60 initial concepts (EN + VI)
4. ✅ AI integration (concept suggestions)
5. ✅ User browse & detail pages
6. ✅ Semantic search
7. ✅ Basic analytics

**Out of scope for MVP:**
- ❌ Learning paths (Phase 5)
- ❌ Practice tracking (Phase 5)
- ❌ Gamification (Phase 5)
- ❌ Advanced analytics (Phase 6)
- ❌ Community submissions

---

## 📅 TIMELINE SUMMARY

| Week | Phase | Deliverables |
|------|-------|-------------|
| 1-2  | Foundation | Schema, API, embeddings |
| 3    | Admin UI | CRUD, import, editor |
| 4    | AI Integration | Search, suggestions, usage tracking |
| 5    | User UI | Browse, detail, bookmarks |
| 6    | Gamification | Paths, tracking, mastery (optional) |
| 7    | Analytics | Dashboards, metrics (optional) |
| 8+   | Content | Writing, translation, refinement |

**MVP Target:** End of Week 5 (with 60 concepts)

---

## 🚀 NEXT STEPS

1. **Review & approve** this plan
2. **Prioritize** phases (MVP = 1-4)
3. **Create tasks** in project board
4. **Assign resources** (1-2 developers)
5. **Start with schema** (Phase 1.1)
6. **Parallel work:**
   - Developer: Schema + API
   - Content writer: Draft concepts
   - Designer: UI mockups

---

## 📚 APPENDIX: SAMPLE CONCEPTS

### Example 1: Gratitude Refocus

```yaml
key: gratitude_refocus
title: Gratitude Refocus
titleVi: Tái tập trung vào biết ơn
category: inner
difficulty: 1
tags: [gratitude, mindfulness, reframe, positive-psychology]

summary: |
  A practice of intentionally shifting your attention from what you 
  lack or what went wrong to what you have and what you're learning.

summaryVi: |
  Thực hành có chủ đích chuyển sự chú ý từ những gì thiếu hoặc sai 
  sang những gì bạn đã có và đang học được.

definition: |
  Gratitude refocus is a cognitive technique rooted in positive 
  psychology that involves consciously redirecting your mental focus...

examples:
  - title: At Work
    content: |
      Instead of: "My presentation wasn't perfect—I forgot a key point."
      Try: "I prepared thoroughly and received valuable feedback for next time."
  
  - title: In Relationships
    content: |
      Instead of: "They forgot my birthday."
      Try: "They've been there for me countless times when I needed support."

practices:
  - title: Daily Gratitude Journal
    steps:
      - Set aside 5 minutes before bed
      - Write down 3 specific things you're grateful for today
      - For each, write why it matters to you
      - Notice how you feel after writing
    timeframe: 5 minutes daily
    difficulty: 1

relations:
  - type: RELATED
    target: reframe_negative_thoughts
  - type: BUILDS_ON
    target: present_moment_awareness
```

---

**Status:** 📋 **PLAN COMPLETE - READY FOR IMPLEMENTATION**

**Next Action:** Review with team → Approve MVP scope → Start Phase 1
