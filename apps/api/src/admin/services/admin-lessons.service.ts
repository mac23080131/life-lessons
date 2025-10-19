import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface LessonFilters {
  search?: string;
  userId?: string;
  domain?: string;
  visibility?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

@Injectable()
export class AdminLessonsService {
  constructor(private prisma: PrismaService) {}

  async getLessons(page = 1, limit = 20, filters: LessonFilters = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { contentRaw: { contains: filters.search, mode: 'insensitive' } },
        { contentSummary: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search } },
      ];
    }

    if (filters.userId) where.userId = filters.userId;
    if (filters.domain) where.domain = filters.domain;
    if (filters.visibility) where.visibility = filters.visibility;

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, name: true } },
          _count: { select: { reactions: true } },
        },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      data: lessons,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async deleteLesson(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }

  async updateLessonVisibility(id: string, visibility: any) {
    return this.prisma.lesson.update({ where: { id }, data: { visibility } });
  }

  async getLessonStats() {
    const [totalLessons, byDomain, byVisibility, lessonsThisWeek, lessonsThisMonth] =
      await Promise.all([
        this.prisma.lesson.count(),
        this.prisma.lesson.groupBy({ by: ['domain'], _count: true }),
        this.prisma.lesson.groupBy({ by: ['visibility'], _count: true }),
        this.prisma.lesson.count({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        }),
        this.prisma.lesson.count({
          where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        }),
      ]);

    return { totalLessons, byDomain, byVisibility, lessonsThisWeek, lessonsThisMonth };
  }
}
