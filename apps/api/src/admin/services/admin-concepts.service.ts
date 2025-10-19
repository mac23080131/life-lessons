import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface ConceptFilters {
  search?: string;
  categoryId?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

@Injectable()
export class AdminConceptsService {
  constructor(private prisma: PrismaService) {}

  async getConcepts(page = 1, limit = 20, filters: ConceptFilters = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { titleEn: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search } },
      ];
    }

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.difficulty) where.difficulty = filters.difficulty;

    const [concepts, total] = await Promise.all([
      this.prisma.concept.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          _count: { select: { practices: true, examples: true, questions: true } },
        },
      }),
      this.prisma.concept.count({ where }),
    ]);

    return {
      data: concepts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createConcept(data: any) {
    return this.prisma.concept.create({
      data: {
        key: data.key,
        slug: data.slug,
        title: data.title,
        titleEn: data.titleEn,
        summary: data.summary,
        summaryEn: data.summaryEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        categoryId: data.categoryId,
        difficulty: data.difficulty || 'BEGINNER',
        tags: data.tags || [],
        source: data.source,
      },
      include: { category: true },
    });
  }

  async updateConcept(id: string, data: any) {
    return this.prisma.concept.update({
      where: { id },
      data: {
        title: data.title,
        titleEn: data.titleEn,
        summary: data.summary,
        summaryEn: data.summaryEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        categoryId: data.categoryId,
        difficulty: data.difficulty,
        tags: data.tags,
        source: data.source,
      },
      include: { category: true },
    });
  }

  async deleteConcept(id: string) {
    await Promise.all([
      this.prisma.conceptPractice.deleteMany({ where: { conceptId: id } }),
      this.prisma.conceptExample.deleteMany({ where: { conceptId: id } }),
      this.prisma.conceptQuestion.deleteMany({ where: { conceptId: id } }),
    ]);
    return this.prisma.concept.delete({ where: { id } });
  }

  async addPractice(conceptId: string, data: any) {
    return this.prisma.conceptPractice.create({
      data: {
        conceptId,
        title: data.title,
        titleEn: data.titleEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        steps: data.steps,
        stepsEn: data.stepsEn,
        duration: data.duration,
      },
    });
  }

  async addExample(conceptId: string, data: any) {
    return this.prisma.conceptExample.create({
      data: {
        conceptId,
        title: data.title,
        titleEn: data.titleEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
      },
    });
  }

  async addQuestion(conceptId: string, data: any) {
    return this.prisma.conceptQuestion.create({
      data: {
        conceptId,
        question: data.question,
        questionEn: data.questionEn,
        type: data.type || 'REFLECTIVE',
      },
    });
  }

  async getConceptStats() {
    const [totalConcepts, byCategory, byDifficulty, totalPractices, totalQuestions] =
      await Promise.all([
        this.prisma.concept.count(),
        this.prisma.concept.groupBy({ by: ['categoryId'], _count: true }),
        this.prisma.concept.groupBy({ by: ['difficulty'], _count: true }),
        this.prisma.conceptPractice.count(),
        this.prisma.conceptQuestion.count(),
      ]);

    return { totalConcepts, byCategory, byDifficulty, totalPractices, totalQuestions };
  }
}
