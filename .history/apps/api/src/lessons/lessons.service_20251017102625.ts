import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Privacy } from '@prisma/client';
import { CreateLessonDto, UpdateLessonDto, LessonQueryDto } from './dto/lesson.dto';
import * as crypto from 'crypto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        userId,
        contentRaw: dto.contentRaw,
        domain: dto.domain,
        tags: dto.tags || [],
        mood: dto.mood,
        resonance: dto.resonance,
        gratitude: dto.gratitude,
        visibility: dto.visibility || Privacy.PRIVATE,
        language: dto.language || 'vi',
        aiConcepts: [],
      },
    });
  }

  async findAll(userId: string, query: LessonQueryDto) {
    const where: Prisma.LessonWhereInput = {
      userId,
    };

    if (query.domain) {
      where.domain = query.domain;
    }

    if (query.tag) {
      where.tags = { has: query.tag };
    }

    if (query.q) {
      where.OR = [
        { contentRaw: { contains: query.q, mode: 'insensitive' } },
        { contentSummary: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: query.limit || 20,
        skip: query.offset || 0,
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return { lessons, total };
  }

  async findOne(id: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        reactions: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.userId !== userId && lesson.visibility === Privacy.PRIVATE) {
      throw new ForbiddenException('Access denied');
    }

    return lesson;
  }

  async update(id: string, userId: string, dto: UpdateLessonDto) {
    const lesson = await this.findOne(id, userId);

    if (lesson.userId !== userId) {
      throw new ForbiddenException('Cannot update this lesson');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    const lesson = await this.findOne(id, userId);

    if (lesson.userId !== userId) {
      throw new ForbiddenException('Cannot delete this lesson');
    }

    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  async createShareLink(id: string, userId: string) {
    const lesson = await this.findOne(id, userId);

    if (lesson.userId !== userId) {
      throw new ForbiddenException('Cannot share this lesson');
    }

    const shareToken = crypto.randomBytes(32).toString('hex');

    await this.prisma.lesson.update({
      where: { id },
      data: {
        shareToken,
        visibility: Privacy.LINK,
      },
    });

    return { shareToken, shareUrl: `/share/${shareToken}` };
  }

  async findByShareToken(token: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { shareToken: token },
    });

    if (!lesson || (lesson.visibility !== Privacy.LINK && lesson.visibility !== Privacy.PUBLIC_ANON)) {
      throw new NotFoundException('Lesson not found or not shared');
    }

    return lesson;
  }
}
