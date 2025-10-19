# 📚 Kế Hoạch Triển Khai: Kho Khái Niệm Nguồn Có Lợi (CKB)
## Concept Knowledge Base Implementation Plan

> **Mục tiêu:** Xây dựng kho tri thức chứa các khái niệm nguồn có lợi để user học tập và AI sử dụng để phân tích bài học, đưa ra gợi ý thực hành, và tạo câu hỏi nghi vấn.

---

## 📋 Tổng Quan Dự Án

### 🎯 Objectives

1. **User Learning Hub:** Nơi user khám phá và học các khái niệm tâm lý học, phát triển bản thân
2. **AI Knowledge Source:** Kho tri thức để AI phân tích bài học và đưa ra gợi ý thông minh
3. **Practical Application:** Gợi ý cách ứng dụng khái niệm vào cuộc sống thực tế
4. **Provocative Thinking:** Tạo câu hỏi nghi vấn giúp user suy ngẫm sâu hơn

### 🎁 Value Proposition

**Cho Users:**
- Học các khái niệm tâm lý học ứng dụng một cách có hệ thống
- Nhận gợi ý cá nhân hóa dựa trên bài học đã viết
- Tracking tiến độ học tập
- Ví dụ thực tế và hướng dẫn thực hành cụ thể

**Cho AI:**
- Context để phân tích bài học chính xác hơn
- Templates để tạo câu hỏi nghi vấn
- Thư viện thực hành để gợi ý
- Semantic search để match concepts với nội dung

---

## 🗂️ Kiến Trúc Hệ Thống

### Database Schema Overview

```
ConceptCategory (Danh mục)
  └── Concept (Khái niệm)
      ├── ConceptPractice (Thực hành)
      ├── ConceptExample (Ví dụ)
      ├── ConceptQuestion (Câu hỏi)
      └── ConceptRelation (Liên kết)

User
  └── UserConceptProgress (Tiến độ học)

Lesson
  └── LessonConcept (AI gợi ý concepts)
```

### Tech Stack

- **Database:** PostgreSQL + Prisma ORM
- **Search:** PostgreSQL Full-Text Search (pg_trgm)
- **AI:** OpenAI API (optional for advanced features)
- **Backend:** NestJS + TypeScript
- **Frontend:** Next.js 14 + React Query + Framer Motion

---

## 📊 Phase 1: Database Foundation (Week 1-2)

### ✅ Checklist

- [ ] **1.1 Create Prisma Schema**
  - [ ] ConceptCategory model
  - [ ] Concept model với i18n (vi/en)
  - [ ] ConceptPractice model
  - [ ] ConceptExample model
  - [ ] ConceptQuestion model
  - [ ] ConceptRelation model
  - [ ] UserConceptProgress model
  - [ ] LessonConcept model (linking)

- [ ] **1.2 Database Migration**
  - [ ] Run `pnpm prisma migrate dev --name add_concept_models`
  - [ ] Add indexes cho performance
  - [ ] Enable pg_trgm extension cho search

- [ ] **1.3 Seed Initial Data**
  - [ ] 5-8 Categories (Mindfulness, Growth Mindset, Emotional Intelligence, etc.)
  - [ ] 30-50 Concepts ban đầu
  - [ ] 3-5 practices mỗi concept
  - [ ] 2-3 examples mỗi concept
  - [ ] 5-10 provocative questions mỗi concept

### 📝 Schema Details

#### ConceptCategory
```prisma
model ConceptCategory {
  id          String    @id @default(uuid())
  key         String    @unique
  name        String
  nameEn      String
  description String?
  icon        String?
  color       String?
  order       Int       @default(0)
  concepts    Concept[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### Concept (Core Model)
```prisma
model Concept {
  id              String          @id @default(uuid())
  key             String          @unique
  
  // Content (bilingual)
  title           String
  titleEn         String
  summary         String
  summaryEn       String
  description     String
  descriptionEn   String
  
  // Classification
  categoryId      String
  category        ConceptCategory @relation(fields: [categoryId], references: [id])
  tags            String[]
  difficulty      String          @default("BEGINNER")
  
  // Relations
  practices       ConceptPractice[]
  examples        ConceptExample[]
  questions       ConceptQuestion[]
  relatedConcepts ConceptRelation[] @relation("fromConcept")
  relatedFrom     ConceptRelation[] @relation("toConcept")
  userProgress    UserConceptProgress[]
  lessonLinks     LessonConcept[]
  
  // Metadata
  source          String?
  sourceUrl       String?
  imageUrl        String?
  views           Int             @default(0)
  
  // AI Context
  aiContext       String
  keywords        String[]
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([categoryId])
  @@index([tags])
  @@index([keywords])
}
```

#### ConceptPractice
```prisma
model ConceptPractice {
  id          String   @id @default(uuid())
  conceptId   String
  concept     Concept  @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  title       String
  titleEn     String
  description String
  descriptionEn String
  duration    String?
  frequency   String?
  difficulty  String   @default("EASY")
  order       Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([conceptId])
}
```

#### ConceptExample
```prisma
model ConceptExample {
  id          String   @id @default(uuid())
  conceptId   String
  concept     Concept  @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  title       String
  content     String
  contentEn   String
  type        String   @default("STORY")
  source      String?
  
  createdAt   DateTime @default(now())
  
  @@index([conceptId])
}
```

#### ConceptQuestion
```prisma
model ConceptQuestion {
  id          String   @id @default(uuid())
  conceptId   String
  concept     Concept  @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  question    String
  questionEn  String
  purpose     String?
  type        String   @default("REFLECTION")
  
  createdAt   DateTime @default(now())
  
  @@index([conceptId])
}
```

#### ConceptRelation
```prisma
model ConceptRelation {
  id            String   @id @default(uuid())
  fromConceptId String
  toConceptId   String
  fromConcept   Concept  @relation("fromConcept", fields: [fromConceptId], references: [id], onDelete: Cascade)
  toConcept     Concept  @relation("toConcept", fields: [toConceptId], references: [id], onDelete: Cascade)
  
  type          String
  description   String?
  
  createdAt     DateTime @default(now())
  
  @@unique([fromConceptId, toConceptId])
  @@index([fromConceptId])
  @@index([toConceptId])
}
```

#### UserConceptProgress
```prisma
model UserConceptProgress {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  conceptId   String
  concept     Concept  @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  status      String   @default("INTERESTED")
  notes       String?
  
  viewCount   Int      @default(1)
  lastViewedAt DateTime @default(now())
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  @@unique([userId, conceptId])
  @@index([userId])
  @@index([conceptId])
}
```

#### LessonConcept (AI Linking)
```prisma
model LessonConcept {
  id          String   @id @default(uuid())
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  conceptId   String
  concept     Concept  @relation(fields: [conceptId], references: [id], onDelete: Cascade)
  
  relevanceScore Float  @default(0.5)
  suggestedBy    String @default("AI")
  aiReason       String?
  
  userAccepted   Boolean?
  userNote       String?
  
  createdAt      DateTime @default(now())
  
  @@unique([lessonId, conceptId])
  @@index([lessonId])
  @@index([conceptId])
}
```

### 🚀 Migration Commands

```bash
# Tạo migration
pnpm prisma migrate dev --name add_concept_knowledge_base

# Generate Prisma Client
pnpm prisma generate

# Seed database
pnpm ts-node scripts/seed-concepts.ts
```

---

## 🔧 Phase 2: Backend API (Week 3-4)

### ✅ Checklist

- [ ] **2.1 ConceptsModule Setup**
  - [ ] Create `apps/api/src/concepts/concepts.module.ts`
  - [ ] Create `concepts.controller.ts`
  - [ ] Create `concepts.service.ts`
  - [ ] Add to AppModule

- [ ] **2.2 Public Endpoints**
  - [ ] `GET /api/concepts/categories` - List all categories
  - [ ] `GET /api/concepts/categories/:key/concepts` - Concepts by category
  - [ ] `GET /api/concepts/search?q=` - Search concepts
  - [ ] `GET /api/concepts/:key` - Concept detail
  - [ ] `GET /api/concepts/:key/related` - Related concepts

- [ ] **2.3 Authenticated Endpoints**
  - [ ] `POST /api/concepts/:id/progress` - Update user progress
  - [ ] `GET /api/concepts/user/my-concepts` - User's learning list
  - [ ] `GET /api/concepts/user/recommendations` - Personalized recommendations

- [ ] **2.4 AI Integration**
  - [ ] Enhance `AiService.analyzeLesson()` để gợi ý concepts
  - [ ] Create `findRelevantConcepts()` method
  - [ ] Create `generateProvocativeQuestions()` method
  - [ ] Create `suggestPracticalApplications()` method
  - [ ] Auto-link concepts to lessons via LessonConcept

### 📦 Service Implementation

#### ConceptsService

```typescript
// apps/api/src/concepts/concepts.service.ts

@Injectable()
export class ConceptsService {
  constructor(private prisma: PrismaService) {}

  // Get all categories
  async getCategories() {
    return this.prisma.conceptCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { concepts: true }
        }
      }
    });
  }

  // Get concepts by category
  async getConceptsByCategory(
    categoryKey: string,
    page = 1,
    limit = 20,
    filters?: { difficulty?: string; tags?: string[] }
  ) {
    const skip = (page - 1) * limit;
    
    const where = {
      category: { key: categoryKey },
      ...(filters?.difficulty && { difficulty: filters.difficulty }),
      ...(filters?.tags && { tags: { hasSome: filters.tags } })
    };
    
    const [concepts, total] = await Promise.all([
      this.prisma.concept.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              practices: true,
              examples: true,
              questions: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.concept.count({ where })
    ]);
    
    return {
      concepts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Search concepts
  async searchConcepts(query: string, limit = 10) {
    // Use PostgreSQL full-text search
    return this.prisma.concept.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { titleEn: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { keywords: { hasSome: query.toLowerCase().split(' ') } }
        ]
      },
      include: {
        category: true,
        _count: {
          select: { practices: true }
        }
      },
      take: limit
    });
  }

  // Get concept detail
  async getConceptDetail(conceptKey: string) {
    const concept = await this.prisma.concept.findUnique({
      where: { key: conceptKey },
      include: {
        category: true,
        practices: {
          orderBy: { order: 'asc' }
        },
        examples: true,
        questions: true,
        relatedConcepts: {
          include: {
            toConcept: {
              select: {
                id: true,
                key: true,
                title: true,
                summary: true,
                category: true
              }
            }
          }
        }
      }
    });
    
    if (!concept) {
      throw new NotFoundException('Concept not found');
    }
    
    // Increment views
    await this.prisma.concept.update({
      where: { key: conceptKey },
      data: { views: { increment: 1 } }
    });
    
    return concept;
  }

  // Get related concepts
  async getRelatedConcepts(conceptKey: string) {
    const concept = await this.prisma.concept.findUnique({
      where: { key: conceptKey },
      select: { id: true }
    });
    
    if (!concept) {
      throw new NotFoundException('Concept not found');
    }
    
    const relations = await this.prisma.conceptRelation.findMany({
      where: { fromConceptId: concept.id },
      include: {
        toConcept: {
          include: {
            category: true,
            _count: {
              select: { practices: true }
            }
          }
        }
      }
    });
    
    return relations.map(r => ({
      ...r.toConcept,
      relationType: r.type,
      relationDescription: r.description
    }));
  }

  // Update user progress
  async updateUserProgress(
    userId: string,
    conceptId: string,
    status: string,
    notes?: string
  ) {
    return this.prisma.userConceptProgress.upsert({
      where: {
        userId_conceptId: { userId, conceptId }
      },
      create: {
        userId,
        conceptId,
        status,
        notes,
        viewCount: 1
      },
      update: {
        status,
        notes,
        lastViewedAt: new Date(),
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    });
  }

  // Get user's concepts
  async getUserConcepts(userId: string, status?: string) {
    return this.prisma.userConceptProgress.findMany({
      where: {
        userId,
        ...(status && { status })
      },
      include: {
        concept: {
          include: {
            category: true,
            _count: {
              select: { practices: true }
            }
          }
        }
      },
      orderBy: { lastViewedAt: 'desc' }
    });
  }

  // Get personalized recommendations
  async getRecommendations(userId: string) {
    // TODO: Implement AI-based recommendations
    // For now, return popular concepts user hasn't seen
    
    const userConceptIds = await this.prisma.userConceptProgress.findMany({
      where: { userId },
      select: { conceptId: true }
    });
    
    const seenIds = userConceptIds.map(uc => uc.conceptId);
    
    return this.prisma.concept.findMany({
      where: {
        id: { notIn: seenIds }
      },
      include: {
        category: true,
        _count: {
          select: { practices: true }
        }
      },
      orderBy: { views: 'desc' },
      take: 10
    });
  }
}
```

#### ConceptsController

```typescript
// apps/api/src/concepts/concepts.controller.ts

@Controller('concepts')
export class ConceptsController {
  constructor(private conceptsService: ConceptsService) {}

  @Get('categories')
  async getCategories() {
    return this.conceptsService.getCategories();
  }

  @Get('categories/:categoryKey/concepts')
  async getConceptsByCategory(
    @Param('categoryKey') categoryKey: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('difficulty') difficulty?: string,
    @Query('tags') tags?: string
  ) {
    return this.conceptsService.getConceptsByCategory(
      categoryKey,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      {
        difficulty,
        tags: tags?.split(',')
      }
    );
  }

  @Get('search')
  async searchConcepts(
    @Query('q') query: string,
    @Query('limit') limit?: string
  ) {
    return this.conceptsService.searchConcepts(
      query,
      limit ? parseInt(limit) : 10
    );
  }

  @Get('user/my-concepts')
  @UseGuards(JwtAuthGuard)
  async getMyConceptProgress(
    @Request() req,
    @Query('status') status?: string
  ) {
    return this.conceptsService.getUserConcepts(req.user.id, status);
  }

  @Get('user/recommendations')
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@Request() req) {
    return this.conceptsService.getRecommendations(req.user.id);
  }

  @Get(':conceptKey/related')
  async getRelatedConcepts(@Param('conceptKey') conceptKey: string) {
    return this.conceptsService.getRelatedConcepts(conceptKey);
  }

  @Get(':conceptKey')
  async getConceptDetail(@Param('conceptKey') conceptKey: string) {
    return this.conceptsService.getConceptDetail(conceptKey);
  }

  @Post(':conceptId/progress')
  @UseGuards(JwtAuthGuard)
  async updateProgress(
    @Request() req,
    @Param('conceptId') conceptId: string,
    @Body() dto: { status: string; notes?: string }
  ) {
    return this.conceptsService.updateUserProgress(
      req.user.id,
      conceptId,
      dto.status,
      dto.notes
    );
  }
}
```

---

## 🤖 Phase 3: AI Integration (Week 5)

### ✅ Checklist

- [ ] **3.1 Enhanced Lesson Analysis**
  - [ ] Modify `POST /api/ai/lessons/:id/analyze` endpoint
  - [ ] Add concept detection logic
  - [ ] Add provocative question generation
  - [ ] Add practical application suggestions

- [ ] **3.2 Concept Matching Algorithm**
  - [ ] Keyword extraction from lesson content
  - [ ] Semantic matching with concept keywords
  - [ ] Relevance scoring (0-1)
  - [ ] Domain/category filtering

- [ ] **3.3 Question Generation**
  - [ ] Template-based questions from ConceptQuestion
  - [ ] Context personalization with lesson content
  - [ ] Optional: OpenAI integration for advanced generation

- [ ] **3.4 Practice Suggestions**
  - [ ] Extract relevant ConceptPractice
  - [ ] Adapt to user's context from lesson
  - [ ] Priority ranking

### 🧠 AI Service Enhancement

```typescript
// apps/api/src/ai/ai.service.ts (Enhanced)

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private conceptsService: ConceptsService
  ) {}

  async analyzeLessonWithConcepts(
    lessonId: string,
    content: string,
    domain: string,
    userId: string
  ) {
    // 1. Basic analysis (existing)
    const basicAnalysis = await this.analyzeLesson(content, domain);
    
    // 2. Find relevant concepts (NEW)
    const relevantConcepts = await this.findRelevantConcepts(
      content,
      domain,
      basicAnalysis.keywords || []
    );
    
    // 3. Generate provocative questions (NEW)
    const provocativeQuestions = await this.generateProvocativeQuestions(
      content,
      relevantConcepts.slice(0, 2)
    );
    
    // 4. Suggest practical applications (NEW)
    const practicalApplications = await this.suggestPracticalApplications(
      content,
      relevantConcepts.slice(0, 3)
    );
    
    // 5. Link concepts to lesson
    await this.linkConceptsToLesson(lessonId, relevantConcepts);
    
    return {
      ...basicAnalysis,
      suggestedConcepts: relevantConcepts.slice(0, 3).map(c => ({
        id: c.id,
        key: c.key,
        title: c.title,
        summary: c.summary,
        category: c.category.name,
        relevanceScore: c.relevanceScore,
        reason: c.reason
      })),
      provocativeQuestions,
      practicalApplications
    };
  }

  private async findRelevantConcepts(
    content: string,
    domain: string,
    keywords: string[]
  ) {
    const contentLower = content.toLowerCase();
    const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
    
    // Get all concepts from same domain category
    const domainMap = {
      INNER: 'mindfulness',
      HEALTH: 'health',
      RELATIONSHIP: 'relationships',
      FINANCE: 'financial-wellness'
    };
    
    const concepts = await this.prisma.concept.findMany({
      where: {
        OR: [
          { category: { key: domainMap[domain] } },
          { keywords: { hasSome: keywords } }
        ]
      },
      include: {
        category: true,
        practices: { take: 3 },
        questions: { take: 2 }
      }
    });
    
    // Calculate relevance score
    const scoredConcepts = concepts.map(concept => {
      let score = 0;
      
      // Keyword overlap
      const conceptKeywords = concept.keywords || [];
      const overlap = conceptKeywords.filter(k => 
        keywordSet.has(k.toLowerCase())
      ).length;
      score += overlap * 0.3;
      
      // Title/summary mention
      if (contentLower.includes(concept.title.toLowerCase())) {
        score += 0.4;
      }
      if (contentLower.includes(concept.summary.toLowerCase())) {
        score += 0.2;
      }
      
      // Domain match
      if (concept.category.key === domainMap[domain]) {
        score += 0.1;
      }
      
      return {
        ...concept,
        relevanceScore: Math.min(score, 1),
        reason: this.generateRelevanceReason(score, overlap, concept)
      };
    });
    
    // Sort by score and return top matches
    return scoredConcepts
      .filter(c => c.relevanceScore > 0.2)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private generateRelevanceReason(
    score: number,
    keywordOverlap: number,
    concept: any
  ): string {
    if (score > 0.7) {
      return `Bài học của bạn có nhiều điểm chung với "${concept.title}"`;
    } else if (keywordOverlap > 0) {
      return `Có ${keywordOverlap} từ khóa liên quan đến "${concept.title}"`;
    } else {
      return `"${concept.title}" có thể hữu ích cho tình huống này`;
    }
  }

  private async generateProvocativeQuestions(
    content: string,
    concepts: any[]
  ): Promise<string[]> {
    const questions: string[] = [];
    
    for (const concept of concepts) {
      if (concept.questions && concept.questions.length > 0) {
        // Get random question from concept
        const randomQ = concept.questions[
          Math.floor(Math.random() * concept.questions.length)
        ];
        
        // Simple personalization (prepend context)
        const personalizedQ = `Liên quan đến "${concept.title}": ${randomQ.question}`;
        questions.push(personalizedQ);
      }
    }
    
    // Add generic reflection question if less than 2
    if (questions.length < 2) {
      questions.push(
        'Bạn có thể áp dụng điều học được hôm nay như thế nào trong tuần tới?'
      );
    }
    
    return questions.slice(0, 2);
  }

  private async suggestPracticalApplications(
    content: string,
    concepts: any[]
  ): Promise<string[]> {
    const applications: string[] = [];
    
    for (const concept of concepts) {
      if (concept.practices && concept.practices.length > 0) {
        // Get first practice as suggestion
        const practice = concept.practices[0];
        applications.push(
          `${practice.title} (${practice.duration || '5-10 phút'})`
        );
      }
    }
    
    return applications.slice(0, 3);
  }

  private async linkConceptsToLesson(
    lessonId: string,
    concepts: any[]
  ) {
    const links = concepts.slice(0, 5).map(concept => ({
      lessonId,
      conceptId: concept.id,
      relevanceScore: concept.relevanceScore,
      aiReason: concept.reason,
      suggestedBy: 'AI'
    }));
    
    await this.prisma.lessonConcept.createMany({
      data: links,
      skipDuplicates: true
    });
  }
}
```

---

## 🎨 Phase 4: Frontend UI (Week 6-7)

### ✅ Checklist

- [ ] **4.1 Concepts Browser Page**
  - [ ] Create `/dashboard/concepts` route
  - [ ] ConceptCategoriesFilter component
  - [ ] ConceptSearchBar component
  - [ ] ConceptsGrid component
  - [ ] ConceptCard component

- [ ] **4.2 Concept Detail Page**
  - [ ] Create `/dashboard/concepts/[key]` route
  - [ ] Tabs: Overview | Practices | Examples | Questions
  - [ ] Related concepts carousel
  - [ ] Save/Bookmark button
  - [ ] Progress tracker

- [ ] **4.3 Enhanced Lesson Analysis UI**
  - [ ] Update AnalysisResult component
  - [ ] Add SuggestedConcepts section
  - [ ] Add ProvocativeQuestions section
  - [ ] Add PracticalApplications section

- [ ] **4.4 My Learning Dashboard**
  - [ ] Create `/dashboard/concepts/my-learning` route
  - [ ] Display concepts by status (Interested, Learning, Completed)
  - [ ] Progress stats
  - [ ] Recommendations section

### 📱 Component Structure

```
apps/web/src/components/concepts/
├── ConceptCategoriesFilter.tsx
├── ConceptSearchBar.tsx
├── ConceptsGrid.tsx
├── ConceptCard.tsx
├── ConceptDetail/
│   ├── ConceptDetailHeader.tsx
│   ├── ConceptOverview.tsx
│   ├── ConceptPracticesList.tsx
│   ├── ConceptExamples.tsx
│   ├── ConceptQuestions.tsx
│   └── RelatedConcepts.tsx
├── EnhancedAIAnalysis/
│   ├── SuggestedConcepts.tsx
│   ├── ProvocativeQuestions.tsx
│   └── PracticalApplications.tsx
└── MyLearning/
    ├── LearningProgress.tsx
    ├── ConceptsByStatus.tsx
    └── RecommendationsCarousel.tsx
```

### 🎨 Key Components

#### ConceptCard

```tsx
// apps/web/src/components/concepts/ConceptCard.tsx

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Eye, Play } from 'lucide-react';

interface ConceptCardProps {
  concept: {
    id: string;
    key: string;
    title: string;
    summary: string;
    category: { name: string; icon: string; color: string };
    difficulty: string;
    tags: string[];
    _count: { practices: number };
    views: number;
  };
  onView: () => void;
  onSave?: () => void;
}

export function ConceptCard({ concept, onView, onSave }: ConceptCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
      className="glass-card p-5 rounded-xl cursor-pointer"
      onClick={onView}
    >
      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{concept.category.icon}</span>
        <span 
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: `${concept.category.color}20`,
            color: concept.category.color 
          }}
        >
          {concept.category.name}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {concept.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {concept.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {concept.tags.slice(0, 3).map(tag => (
          <span 
            key={tag}
            className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {concept.tags.length > 3 && (
          <span className="px-2 py-0.5 text-xs text-muted-foreground">
            +{concept.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          <Badge variant={
            concept.difficulty === 'BEGINNER' ? 'success' :
            concept.difficulty === 'INTERMEDIATE' ? 'warning' : 'error'
          }>
            {concept.difficulty}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Play size={14} />
            {concept._count.practices} thực hành
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye size={14} />
            {concept.views}
          </div>
        </div>

        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            <Bookmark size={16} />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
```

#### SuggestedConcepts (in AI Analysis)

```tsx
// apps/web/src/components/concepts/EnhancedAIAnalysis/SuggestedConcepts.tsx

import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SuggestedConceptsProps {
  concepts: Array<{
    id: string;
    key: string;
    title: string;
    summary: string;
    category: string;
    relevanceScore: number;
    reason: string;
  }>;
}

export function SuggestedConcepts({ concepts }: SuggestedConceptsProps) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="glass-card p-4 sm:p-5 rounded-xl">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Lightbulb className="text-yellow-500" size={20} />
        Khái Niệm Gợi Ý
      </h4>
      
      <p className="text-sm text-muted-foreground mb-4">
        Dựa trên bài học của bạn, chúng tôi nghĩ những khái niệm này có thể hữu ích:
      </p>

      <div className="space-y-3">
        {concepts.map((concept) => (
          <div
            key={concept.id}
            className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h5 className="font-medium mb-1">{concept.title}</h5>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {concept.summary}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 italic">
                  💡 {concept.reason}
                </p>
              </div>
              
              <Link href={`/dashboard/concepts/${concept.key}`}>
                <Button variant="ghost" size="sm">
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### ProvocativeQuestions

```tsx
// apps/web/src/components/concepts/EnhancedAIAnalysis/ProvocativeQuestions.tsx

import { HelpCircle, Sparkles } from 'lucide-react';

interface ProvocativeQuestionsProps {
  questions: string[];
}

export function ProvocativeQuestions({ questions }: ProvocativeQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="glass-card p-4 sm:p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <HelpCircle className="text-purple-500" size={20} />
        Câu Hỏi Để Suy Ngẫm
      </h4>
      
      <p className="text-sm text-muted-foreground mb-4">
        Hãy dành vài phút để suy ngẫm về những câu hỏi này:
      </p>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={index}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-500 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="text-purple-500 mt-1 flex-shrink-0" size={16} />
              <p className="text-sm italic">"{question}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 Phase 5: Data & Content (Week 8)

### ✅ Checklist

- [ ] **5.1 Seed Script**
  - [ ] Create `scripts/seed-concepts.ts`
  - [ ] 8 categories với metadata
  - [ ] 50 concepts ban đầu
  - [ ] Practices, examples, questions cho mỗi concept

- [ ] **5.2 Admin UI**
  - [ ] Create `/admin/concepts` page
  - [ ] CRUD operations
  - [ ] Bulk import CSV/JSON
  - [ ] Preview & test

### 📚 Initial Concept Library

#### Categories (8)

1. **Mindfulness** (Chánh Niệm) - 🧘 Purple
2. **Growth Mindset** (Tư Duy Phát Triển) - 🌱 Green  
3. **Emotional Intelligence** (Trí Tuệ Cảm Xúc) - ❤️ Red
4. **Productivity** (Năng Suất) - ⚡ Blue
5. **Relationships** (Mối Quan Hệ) - 🤝 Pink
6. **Health & Wellness** (Sức Khỏe) - 💪 Orange
7. **Financial Wellness** (Tài Chính) - 💰 Yellow
8. **Purpose & Meaning** (Ý Nghĩa) - ⭐ Indigo

#### Sample Concepts (10 mẫu)

1. **Gratitude Journaling** (Nhật ký biết ơn)
   - Category: Mindfulness
   - Practices: Viết 3 điều biết ơn mỗi tối
   - Questions: Điều gì khiến bạn biết ơn nhất hôm nay?

2. **Growth from Failure** (Học từ thất bại)
   - Category: Growth Mindset
   - Practices: Phân tích 1 thất bại gần đây
   - Questions: Thất bại này dạy bạn điều gì?

3. **Active Listening** (Lắng nghe tích cực)
   - Category: Relationships
   - Practices: Lắng nghe không ngắt lời 5 phút
   - Questions: Khi nào bạn cảm thấy được lắng nghe?

4. **Deep Work** (Làm việc sâu)
   - Category: Productivity
   - Practices: Tắt thông báo, focus 90 phút
   - Questions: Công việc nào cần sự tập trung sâu nhất?

5. **Emotion Labeling** (Đặt tên cảm xúc)
   - Category: Emotional Intelligence
   - Practices: Viết nhật ký cảm xúc
   - Questions: Bạn đang cảm thấy gì ngay bây giờ?

... (+ 45 concepts nữa)

---

## 🚀 Phase 6: Launch & Optimization (Week 9-10)

### ✅ Checklist

- [ ] **6.1 Testing**
  - [ ] Unit tests cho ConceptsService
  - [ ] E2E tests cho concepts flow
  - [ ] AI analysis integration test
  - [ ] Performance testing

- [ ] **6.2 Analytics**
  - [ ] Track concept views
  - [ ] Track AI suggestion acceptance rate
  - [ ] Track user progress completion
  - [ ] Dashboard metrics

- [ ] **6.3 Documentation**
  - [ ] API documentation (Swagger)
  - [ ] User guide: "Cách sử dụng Kho Khái Niệm"
  - [ ] Content curation guide
  - [ ] Admin guide

- [ ] **6.4 Soft Launch**
  - [ ] Beta test với 10-20 users
  - [ ] Gather feedback
  - [ ] Iterate on UI/UX
  - [ ] Fix bugs

- [ ] **6.5 Public Launch**
  - [ ] Announcement
  - [ ] Tutorial video
  - [ ] Onboarding flow
  - [ ] Monitor metrics

---

## 📈 Success Metrics

### Week 1-2 (Foundation)
- [ ] Database schema deployed
- [ ] 30+ concepts seeded
- [ ] Migration successful

### Week 3-4 (Backend)
- [ ] All API endpoints working
- [ ] Swagger docs complete
- [ ] Response time < 200ms

### Week 5 (AI)
- [ ] AI analysis includes concepts
- [ ] Relevance score > 0.7 for top suggestion
- [ ] Questions generated successfully

### Week 6-7 (Frontend)
- [ ] Concepts browser page live
- [ ] Concept detail page complete
- [ ] Enhanced analysis UI integrated

### Week 8 (Content)
- [ ] 50 concepts with full content
- [ ] Admin tools functional
- [ ] Bulk import tested

### Week 9-10 (Launch)
- [ ] 20+ beta users tested
- [ ] 80% positive feedback
- [ ] No critical bugs
- [ ] Public launch complete

---

## 🎯 KPIs (Key Performance Indicators)

### User Engagement
- **Adoption Rate:** 60% users view ≥1 concept trong tuần đầu
- **Learning Depth:** 3 concepts/user trung bình
- **Practice Completion:** 40% practices được thử

### AI Quality
- **Suggestion Accuracy:** 70% AI suggestions được user click
- **Question Relevance:** 4/5 stars rating trung bình
- **Application Success:** 50% users áp dụng ≥1 practice

### Content Quality
- **Concept Coverage:** ≥5 concepts/category
- **Translation:** 100% concepts có VI & EN
- **Example Quality:** 4.5/5 stars rating

### Technical Performance
- **API Response Time:** < 200ms (p95)
- **Search Accuracy:** 80% relevant results
- **Uptime:** 99.9%

---

## 💡 Future Enhancements (v2.0)

### Advanced AI Features
- [ ] OpenAI GPT-4 integration cho câu hỏi dynamic
- [ ] Vector embeddings (pgvector) cho semantic search
- [ ] Personalized learning paths
- [ ] Auto-generate concepts from user lessons

### Gamification
- [ ] Badges: Curious Learner, Master Explorer
- [ ] Streaks: Học concepts X ngày liên tiếp
- [ ] Leaderboards: Top learners
- [ ] Achievements unlock

### Social Features
- [ ] Share concepts với friends
- [ ] Group learning challenges
- [ ] Concept discussions/comments
- [ ] User-contributed concepts

### Content Expansion
- [ ] Video/audio examples
- [ ] Interactive exercises
- [ ] Quizzes/assessments
- [ ] Certificates

---

## 🛠️ Technical Debt & Risks

### Risks
1. **Content Quality:** Concepts cần được viết cẩn thận, review kỹ
2. **AI Accuracy:** Semantic matching có thể không chính xác ban đầu
3. **Performance:** Search có thể chậm với nhiều concepts (solution: caching)
4. **User Adoption:** Users có thể bỏ qua concepts nếu UI không hấp dẫn

### Mitigation
- **Content:** Hire/collaborate với psychology experts
- **AI:** A/B test different algorithms, collect feedback
- **Performance:** Redis caching, database indexes
- **Adoption:** Onboarding tutorial, gamification, notifications

---

## 📝 Next Immediate Actions

### This Week
1. [ ] Review và approve plan này
2. [ ] Create Prisma migration
3. [ ] Seed 10 concepts để test
4. [ ] Create ConceptsModule skeleton

### Next Week
1. [ ] Implement all API endpoints
2. [ ] Write unit tests
3. [ ] Integrate với existing AI service
4. [ ] Start frontend components

---

## ✅ Definition of Done

### Feature Complete When:
- [ ] All 6 phases completed
- [ ] 50+ concepts with full content
- [ ] AI analysis returns concepts/questions/practices
- [ ] Frontend pages functional và responsive
- [ ] Tests pass (unit + e2e)
- [ ] Documentation complete
- [ ] Beta users give positive feedback
- [ ] Public launch successful

---

## 📚 Resources & References

### Inspiration
- **Concepts:** "Atomic Habits", "Mindset", "Emotional Intelligence 2.0"
- **Practices:** Headspace, Calm, BetterHelp
- **UX:** Duolingo (learning path), Medium (reading), Notion (organization)

### Technical
- Prisma Docs: https://www.prisma.io/docs
- NestJS Docs: https://docs.nestjs.com
- Next.js Docs: https://nextjs.org/docs
- OpenAI API: https://platform.openai.com/docs

---

## 👥 Team & Timeline

**Team:** 1 Full-Stack Developer  
**Timeline:** 10 weeks (2.5 months)  
**Start Date:** TBD  
**Target Launch:** TBD

**Weekly Commitment:** 25-30 hours/week  
**Total Effort:** ~250-300 hours

---

**Status:** ✅ **PLAN APPROVED - READY TO START**

**Next Step:** Phase 1 - Database Migration & Seed

Có câu hỏi hoặc cần điều chỉnh gì trong plan không? 🚀
