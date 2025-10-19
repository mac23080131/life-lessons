import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConceptsService } from '../concepts/concepts.service';
import { Domain } from '@prisma/client';

/**
 * AI Service for analyzing lessons with CKB integration
 * V2: Integrated with Concept Knowledge Base
 * 
 * Features:
 * - Semantic concept matching based on lesson content
 * - Contextual practice suggestions
 * - Domain-specific question generation from CKB
 * - Lesson-concept linking
 * 
 * TODO V2.1: Add pgvector semantic search
 * TODO V2.2: Integrate with LLM for advanced analysis
 */

export interface ConceptSuggestion {
  id: string;
  key: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  relevance: number;
  slug: string;
  difficulty: string;
  practices?: Array<{
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    duration?: number;
  }>;
}

export interface AnalysisResult {
  summary: string;
  concepts: ConceptSuggestion[];
  suggestedQuestions: Array<{
    question: string;
    questionEn: string;
    type: string;
    source: 'ckb' | 'generated';
  }>;
  practices: Array<{
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    duration?: number;
    conceptTitle: string;
  }>;
  relatedConcepts: Array<{
    id: string;
    slug: string;
    title: string;
    titleEn: string;
  }>;
}

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private conceptsService: ConceptsService,
  ) {}

  async analyzeLesson(lessonId: string): Promise<AnalysisResult> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Step 1: Basic analysis (summary, keywords)
    const basicAnalysis = this.mockAnalyze(lesson.contentRaw, lesson.domain);

    // Step 2: Find relevant concepts from CKB
    const conceptSuggestions = await this.findRelevantConcepts(
      lesson.contentRaw,
      lesson.domain,
      lesson.tags,
      basicAnalysis.keywords,
    );

    // Step 3: Get questions from top concepts
    const suggestedQuestions = await this.getConceptQuestions(
      conceptSuggestions.slice(0, 3),
      lesson.domain,
    );

    // Step 4: Get practices from concepts
    const practices = await this.getConceptPractices(
      conceptSuggestions.slice(0, 2),
    );

    // Step 5: Get related concepts
    const relatedConcepts = await this.getRelatedConcepts(
      conceptSuggestions.slice(0, 1),
    );

    // Step 6: Save lesson-concept links
    await this.saveLessonConceptLinks(lessonId, conceptSuggestions);

    // Step 7: Update lesson with AI results
    await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        contentSummary: basicAnalysis.summary,
        aiConcepts: conceptSuggestions.map((c) => c.key),
        aiNextQuestion: suggestedQuestions[0]?.question || basicAnalysis.nextQuestion,
      },
    });

    return {
      summary: basicAnalysis.summary,
      concepts: conceptSuggestions,
      suggestedQuestions,
      practices,
      relatedConcepts,
    };
  }

  /**
   * Find relevant concepts from CKB based on lesson content
   */
  private async findRelevantConcepts(
    content: string,
    domain: Domain,
    tags: string[],
    keywords: string[],
  ): Promise<ConceptSuggestion[]> {
    // Search concepts by keywords
    const searchResults = await Promise.all(
      keywords.map((keyword) =>
        this.conceptsService.searchConcepts({
          q: keyword,
          limit: 5,
        }),
      ),
    );

    // Flatten and deduplicate - fix: use .data instead of .concepts
    const allConcepts = searchResults
      .flatMap((result) => result.data) // Changed from result.concepts
      .reduce((acc, concept) => {
        if (!acc.find((c) => c.id === concept.id)) {
          acc.push(concept);
        }
        return acc;
      }, [] as any[]);

    // Score and rank concepts
    const scoredConcepts = allConcepts.map((concept) => {
      let score = 0.5; // Base relevance

      // Boost if keywords match
      const conceptKeywords = concept.keywords || [];
      keywords.forEach((keyword) => {
        if (conceptKeywords.some((k: string) => k.includes(keyword) || keyword.includes(k))) {
          score += 0.15;
        }
      });

      // Boost if tags match
      const conceptTags = concept.tags || [];
      tags.forEach((tag) => {
        if (conceptTags.some((t: string) => t.toLowerCase().includes(tag.toLowerCase()))) {
          score += 0.1;
        }
      });

      // Boost if content mentions concept title
      const contentLower = content.toLowerCase();
      if (
        contentLower.includes(concept.title.toLowerCase()) ||
        contentLower.includes(concept.titleEn.toLowerCase())
      ) {
        score += 0.2;
      }

      // Boost beginner concepts for accessibility
      if (concept.difficulty === 'BEGINNER') {
        score += 0.05;
      }

      // Map domain to category (rough matching)
      const domainCategoryMap: Record<Domain, string[]> = {
        [Domain.INNER]: ['mindfulness', 'growth_mindset', 'emotional_intelligence'],
        [Domain.HEALTH]: ['mindfulness', 'resilience'],
        [Domain.RELATIONSHIP]: ['emotional_intelligence', 'resilience'],
        [Domain.FINANCE]: ['growth_mindset', 'resilience'],
      };

      if (concept.category?.key && domainCategoryMap[domain]?.includes(concept.category.key)) {
        score += 0.1;
      }

      return {
        ...concept,
        relevance: Math.min(score, 1.0),
      };
    });

    // Sort by relevance and return top 5
    return scoredConcepts
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        key: c.key,
        title: c.title,
        titleEn: c.titleEn,
        summary: c.summary,
        summaryEn: c.summaryEn,
        relevance: c.relevance,
        slug: c.slug,
        difficulty: c.difficulty,
        practices: c.practices?.slice(0, 2),
      }));
  }

  /**
   * Get questions from CKB concepts
   */
  private async getConceptQuestions(
    concepts: ConceptSuggestion[],
    domain: Domain,
  ) {
    const questions: Array<{
      question: string;
      questionEn: string;
      type: string;
      source: 'ckb' | 'generated';
    }> = [];

    // Get questions from top concepts
    for (const concept of concepts) {
      const fullConcept = await this.prisma.concept.findUnique({
        where: { id: concept.id },
        include: { questions: { take: 3, orderBy: { order: 'asc' } } },
      });

      if (fullConcept?.questions) {
        fullConcept.questions.forEach((q) => {
          questions.push({
            question: q.question,
            questionEn: q.questionEn,
            type: q.type,
            source: 'ckb',
          });
        });
      }
    }

    // Add fallback generated question if no CKB questions
    if (questions.length === 0) {
      questions.push({
        question: this.generateNextQuestion(domain, ''),
        questionEn: this.generateNextQuestion(domain, ''),
        type: 'REFLECTIVE',
        source: 'generated',
      });
    }

    // Return diverse question types (max 5)
    const diverseQuestions: typeof questions = [];
    const types = ['REFLECTIVE', 'PROVOCATIVE', 'ACTION_ORIENTED', 'EXPLORATORY'];
    
    types.forEach((type) => {
      const q = questions.find((q) => q.type === type);
      if (q && diverseQuestions.length < 5) {
        diverseQuestions.push(q);
      }
    });

    // Fill remaining slots
    questions.forEach((q) => {
      if (diverseQuestions.length < 5 && !diverseQuestions.includes(q)) {
        diverseQuestions.push(q);
      }
    });

    return diverseQuestions;
  }

  /**
   * Get practices from concepts
   */
  private async getConceptPractices(concepts: ConceptSuggestion[]) {
    const practices: Array<{
      id: string;
      title: string;
      titleEn: string;
      description: string;
      descriptionEn: string;
      duration?: number;
      conceptTitle: string;
    }> = [];

    for (const concept of concepts) {
      const fullConcept = await this.prisma.concept.findUnique({
        where: { id: concept.id },
        include: { 
          practices: { 
            take: 2, 
            orderBy: [{ difficulty: 'asc' }, { order: 'asc' }] 
          } 
        },
      });

      if (fullConcept?.practices) {
        fullConcept.practices.forEach((p) => {
          practices.push({
            id: p.id,
            title: p.title,
            titleEn: p.titleEn,
            description: p.description,
            descriptionEn: p.descriptionEn,
            duration: p.duration,
            conceptTitle: concept.title,
          });
        });
      }
    }

    return practices.slice(0, 3); // Return top 3 practices
  }

  /**
   * Get related concepts
   */
  private async getRelatedConcepts(concepts: ConceptSuggestion[]) {
    if (concepts.length === 0) return [];

    const concept = await this.prisma.concept.findUnique({
      where: { id: concepts[0].id },
      include: {
        relationsA: {
          include: { b: { select: { id: true, slug: true, title: true, titleEn: true } } },
          take: 3,
        },
        relationsB: {
          include: { a: { select: { id: true, slug: true, title: true, titleEn: true } } },
          take: 3,
        },
      },
    });

    if (!concept) return [];

    const related = [
      ...concept.relationsA.map((r) => r.b),
      ...concept.relationsB.map((r) => r.a),
    ];

    return related.slice(0, 5);
  }

  /**
   * Save lesson-concept links
   */
  private async saveLessonConceptLinks(
    lessonId: string,
    concepts: ConceptSuggestion[],
  ) {
    // Delete existing links
    await this.prisma.lessonConcept.deleteMany({
      where: { lessonId },
    });

    // Create new links
    await this.prisma.lessonConcept.createMany({
      data: concepts.map((concept) => ({
        lessonId,
        conceptId: concept.id,
        relevance: concept.relevance,
        source: 'ai',
        accepted: false,
      })),
      skipDuplicates: true,
    });
  }

  // ========== Legacy Methods (kept for backwards compatibility) ==========

  private mockAnalyze(content: string, domain: Domain) {
    // Extract summary: first sentence + last sentence
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const summary =
      sentences.length > 1
        ? `${sentences[0].trim()}. ${sentences[sentences.length - 1].trim()}.`
        : sentences[0]?.trim() || 'No summary available';

    // Extract keywords
    const keywords = this.extractKeywords(content);

    // Generate next question based on domain
    const nextQuestion = this.generateNextQuestion(domain, content);

    return {
      summary,
      keywords,
      nextQuestion,
    };
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction: get 3-5 most frequent words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4); // Words longer than 4 chars

    const wordCount: Record<string, number> = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    return sortedWords.slice(0, 5);
  }

  private generateNextQuestion(domain: Domain, _content: string): string {
    const questions = {
      [Domain.INNER]: [
        'Bài học này ảnh hưởng thế nào đến suy nghĩ của bạn về bản thân?',
        'Bạn có thể áp dụng nhận định này vào tình huống nào khác?',
        'Điều gì khiến bạn cảm thấy sâu sắc nhất trong trải nghiệm này?',
      ],
      [Domain.HEALTH]: [
        'Bạn có thể duy trì thói quen này như thế nào?',
        'Điều gì cản trở bạn thực hiện thường xuyên hơn?',
        'Cơ thể bạn phản ứng ra sao khi bạn làm điều này?',
      ],
      [Domain.RELATIONSHIP]: [
        'Bạn có thể áp dụng bài học này với người khác không?',
        'Điều gì sẽ thay đổi nếu bạn thực hành điều này thường xuyên?',
        'Ai là người bạn muốn chia sẻ điều này?',
      ],
      [Domain.FINANCE]: [
        'Bạn có thể đo lường tác động của điều này như thế nào?',
        'Bước tiếp theo để duy trì momentum này là gì?',
        'Bài học này liên quan đến mục tiêu tài chính dài hạn của bạn ra sao?',
      ],
    };

    const domainQuestions = questions[domain] || questions[Domain.INNER];
    return domainQuestions[Math.floor(Math.random() * domainQuestions.length)];
  }
}
