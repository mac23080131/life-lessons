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

  async viewSharedLesson(token: string) {
    const lesson = await this.findByShareToken(token);

    // Return anonymized version
    return {
      id: lesson.id,
      content: lesson.contentRaw,
      summary: lesson.contentSummary,
      domain: lesson.domain,
      tags: lesson.tags,
      mood: lesson.mood,
      resonance: lesson.resonance,
      aiConcepts: lesson.aiConcepts,
      createdAt: lesson.createdAt,
      // Don't expose user info for anonymous shares
      isAnonymous: lesson.visibility === Privacy.PUBLIC_ANON,
    };
  }

  async shareToCommunity(id: string, userId: string) {
    const lesson = await this.findOne(id, userId);

    if (lesson.userId !== userId) {
      throw new ForbiddenException('Cannot share this lesson');
    }

    // Update visibility to PUBLIC_ANON
    const updated = await this.prisma.lesson.update({
      where: { id },
      data: {
        visibility: Privacy.PUBLIC_ANON,
      },
    });

    return {
      success: true,
      message: 'Lesson shared to community feed',
      lesson: updated,
    };
  }

  async shareToGroup(id: string, userId: string, groupId: string) {
    const lesson = await this.findOne(id, userId);

    if (lesson.userId !== userId) {
      throw new ForbiddenException('Cannot share this lesson');
    }

    // Check if user is member of the group
    const membership = await this.prisma.membership.findFirst({
      where: { groupId, userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Create or update group lesson entry
    const groupLesson = await this.prisma.groupLesson.upsert({
      where: {
        groupId_lessonId: {
          groupId,
          lessonId: id,
        },
      },
      create: {
        groupId,
        lessonId: id,
        sharedBy: userId,
      },
      update: {
        sharedBy: userId,
      },
    });

    // Also update lesson visibility if needed
    if (lesson.visibility === Privacy.PRIVATE) {
      await this.prisma.lesson.update({
        where: { id },
        data: { visibility: Privacy.GROUP },
      });
    }

    return {
      success: true,
      message: 'Lesson shared to group',
      groupLesson,
    };
  }

  async getShareUrl(id: string, userId: string) {
    const lesson = await this.findOne(id, userId);

    if (lesson.userId !== userId) {
      throw new ForbiddenException('Cannot access this lesson');
    }

    // Generate share token if not exists
    let { shareToken } = lesson;
    if (!shareToken) {
      shareToken = crypto.randomBytes(32).toString('hex');
      await this.prisma.lesson.update({
        where: { id },
        data: { shareToken },
      });
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return {
      shareUrl: `${baseUrl}/share/${shareToken}`,
      shareToken,
    };
  }
}
