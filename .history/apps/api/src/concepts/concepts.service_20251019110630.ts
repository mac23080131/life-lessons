import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateConceptDto,
  UpdateConceptDto,
  CreatePracticeDto,
  CreateExampleDto,
  CreateQuestionDto,
  CreateRelationDto,
  SearchConceptsDto,
  CreateCategoryDto,
} from './dto/concept.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConceptsService {
  constructor(private prisma: PrismaService) {}

  // ========== Categories ==========
  
  async findAllCategories() {
    return this.prisma.conceptCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { concepts: true },
        },
      },
    });
  }

  async findCategory(id: string) {
    const category = await this.prisma.conceptCategory.findUnique({
      where: { id },
      include: {
        concepts: {
          select: {
            id: true,
            key: true,
            slug: true,
            title: true,
            titleEn: true,
            summary: true,
            summaryEn: true,
            difficulty: true,
            tags: true,
            views: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    return this.prisma.conceptCategory.create({
      data: {
        ...data,
        order: data.order ?? 0,
      },
    });
  }

  async updateCategory(id: string, data: Partial<CreateCategoryDto>) {
    const category = await this.prisma.conceptCategory.findUnique({
      where: { id },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return this.prisma.conceptCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.conceptCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { concepts: true },
        },
      },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    if (category._count.concepts > 0) {
      throw new Error(`Cannot delete category with ${category._count.concepts} concepts. Please reassign or delete the concepts first.`);
    }
    
    return this.prisma.conceptCategory.delete({
      where: { id },
    });
  }

  // ========== Concepts ==========
  
  async searchConcepts(params: SearchConceptsDto) {
    const { q, slug, categoryId, tags, difficulty, language, limit = 10, offset = 0 } = params;
    
    const where: Prisma.ConceptWhereInput = {};
    
    if (slug) {
      where.slug = slug;
    }
    
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { titleEn: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { summaryEn: { contains: q, mode: 'insensitive' } },
        { keywords: { has: q.toLowerCase() } },
      ];
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    const [concepts, total] = await Promise.all([
      this.prisma.concept.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              practices: true,
              examples: true,
              questions: true,
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.concept.count({ where }),
    ]);
    
    return {
      data: concepts,
      total,
      limit,
      offset,
    };
  }

  async findConcept(id: string) {
    const concept = await this.prisma.concept.findUnique({
      where: { id },
      include: {
        category: true,
        practices: {
          orderBy: { order: 'asc' },
        },
        examples: {
          orderBy: { order: 'asc' },
        },
        questions: {
          orderBy: { order: 'asc' },
        },
        aliases: true,
        relationsA: {
          include: {
            b: {
              select: {
                id: true,
                key: true,
                slug: true,
                title: true,
                titleEn: true,
                summary: true,
                summaryEn: true,
              },
            },
          },
        },
      },
    });
    
    if (!concept) {
      throw new NotFoundException('Concept not found');
    }
    
    // Increment view count
    await this.prisma.concept.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    
    return concept;
  }

  async findConceptByKey(key: string) {
    return this.prisma.concept.findUnique({
      where: { key },
      include: {
        category: true,
        practices: {
          orderBy: { order: 'asc' },
        },
        examples: {
          orderBy: { order: 'asc' },
        },
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async createConcept(data: CreateConceptDto) {
    return this.prisma.concept.create({
      data: {
        ...data,
        tags: data.tags ?? [],
        keywords: data.keywords ?? [],
        difficulty: data.difficulty ?? 'BEGINNER',
      },
      include: {
        category: true,
      },
    });
  }

  async updateConcept(id: string, data: UpdateConceptDto) {
    return this.prisma.concept.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async deleteConcept(id: string) {
    return this.prisma.concept.delete({
      where: { id },
    });
  }

  // ========== Practices ==========
  
  async addPractice(conceptId: string, data: CreatePracticeDto) {
    return this.prisma.conceptPractice.create({
      data: {
        ...data,
        conceptId,
        difficulty: data.difficulty ?? 'BEGINNER',
        order: data.order ?? 0,
      },
    });
  }

  async updatePractice(id: string, data: Partial<CreatePracticeDto>) {
    return this.prisma.conceptPractice.update({
      where: { id },
      data,
    });
  }

  async deletePractice(id: string) {
    return this.prisma.conceptPractice.delete({
      where: { id },
    });
  }

  // ========== Examples ==========
  
  async addExample(conceptId: string, data: CreateExampleDto) {
    return this.prisma.conceptExample.create({
      data: {
        ...data,
        conceptId,
        order: data.order ?? 0,
      },
    });
  }

  async updateExample(id: string, data: Partial<CreateExampleDto>) {
    return this.prisma.conceptExample.update({
      where: { id },
      data,
    });
  }

  async deleteExample(id: string) {
    return this.prisma.conceptExample.delete({
      where: { id },
    });
  }

  // ========== Questions ==========
  
  async addQuestion(conceptId: string, data: CreateQuestionDto) {
    return this.prisma.conceptQuestion.create({
      data: {
        question: data.question,
        questionEn: data.questionEn,
        type: data.type as any,
        context: data.context,
        contextEn: data.contextEn,
        order: data.order ?? 0,
        conceptId,
      },
    });
  }

  async updateQuestion(id: string, data: Partial<CreateQuestionDto>) {
    return this.prisma.conceptQuestion.update({
      where: { id },
      data: {
        ...data,
        type: data.type as any,
      },
    });
  }

  async deleteQuestion(id: string) {
    return this.prisma.conceptQuestion.delete({
      where: { id },
    });
  }

  // ========== Relations ==========
  
  async addRelation(aId: string, data: CreateRelationDto) {
    return this.prisma.conceptRelation.create({
      data: {
        aId,
        bId: data.bId,
        type: data.type,
      },
      include: {
        a: {
          select: {
            id: true,
            key: true,
            title: true,
          },
        },
        b: {
          select: {
            id: true,
            key: true,
            title: true,
          },
        },
      },
    });
  }

  async deleteRelation(id: string) {
    return this.prisma.conceptRelation.delete({
      where: { id },
    });
  }

  // ========== User Progress ==========
  
  async getUserProgress(userId: string) {
    return this.prisma.userConceptProgress.findMany({
      where: { userId },
      include: {
        concept: {
          select: {
            id: true,
            key: true,
            slug: true,
            title: true,
            titleEn: true,
            difficulty: true,
            categoryId: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateUserProgress(userId: string, conceptId: string, data: {
    status?: string;
    practicesCount?: number;
    rating?: number;
    notes?: string;
  }) {
    return this.prisma.userConceptProgress.upsert({
      where: {
        userId_conceptId: {
          userId,
          conceptId,
        },
      },
      update: {
        status: data.status as any,
        practicesCount: data.practicesCount,
        rating: data.rating,
        notes: data.notes,
        lastViewedAt: new Date(),
        viewCount: { increment: 1 },
        completedAt: data.status === 'COMPLETED' ? new Date() : undefined,
      },
      create: {
        userId,
        conceptId,
        status: data.status as any,
        practicesCount: data.practicesCount,
        rating: data.rating,
        notes: data.notes,
        lastViewedAt: new Date(),
        viewCount: 1,
      },
    });
  }

  // ========== Bulk Import ==========
  
  async bulkImport(concepts: CreateConceptDto[]) {
    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };
    
    for (const conceptData of concepts) {
      try {
        const existing = await this.prisma.concept.findUnique({
          where: { key: conceptData.key },
        });
        
        if (existing) {
          await this.prisma.concept.update({
            where: { key: conceptData.key },
            data: conceptData,
          });
          results.updated++;
        } else {
          await this.prisma.concept.create({
            data: {
              ...conceptData,
              tags: conceptData.tags ?? [],
              keywords: conceptData.keywords ?? [],
              difficulty: conceptData.difficulty ?? 'BEGINNER',
            },
          });
          results.created++;
        }
      } catch (error: any) {
        results.errors.push(`Failed to import ${conceptData.key}: ${error?.message || error}`);
      }
    }
    
    return results;
  }
}
