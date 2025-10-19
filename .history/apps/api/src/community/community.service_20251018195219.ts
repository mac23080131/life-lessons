import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Privacy } from '@prisma/client';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async getPublicFeed(limit: number = 20, offset: number = 0) {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        visibility: Privacy.PUBLIC_ANON,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        contentRaw: true,
        contentSummary: true,
        domain: true,
        tags: true,
        mood: true,
        resonance: true,
        aiConcepts: true,
        createdAt: true,
        reactions: {
          select: {
            id: true,
            type: true,
            userId: true,
          },
        },
      },
    });

    const total = await this.prisma.lesson.count({
      where: { visibility: Privacy.PUBLIC_ANON },
    });

    return { lessons, total };
  }

  async reactToLesson(userId: string, lessonId: string, type: string) {
    // Check if already reacted
    const existing = await this.prisma.reaction.findFirst({
      where: { lessonId, userId, type },
    });

    if (existing) {
      // Remove reaction (toggle)
      await this.prisma.reaction.delete({ where: { id: existing.id } });
      return { action: 'removed' };
    }

    // Add reaction
    const reaction = await this.prisma.reaction.create({
      data: {
        lessonId,
        userId,
        type,
      },
    });

    return { action: 'added', reaction };
  }

  async reportLesson(userId: string, lessonId: string, reason?: string) {
    // TODO: Store reports in a Report model
    // For now, just log it
    console.log('Report:', { userId, lessonId, reason });
    return { reported: true };
  }

  async getChallenges() {
    // Predefined challenges
    return [
      {
        id: '7-day',
        name: '7-Day Challenge',
        description: 'Write 1 lesson every day for 7 days',
        duration: 7,
        icon: '🔥',
      },
      {
        id: '21-day',
        name: '21-Day Challenge',
        description: 'Build a habit with the 21-day challenge',
        duration: 21,
        icon: '💪',
      },
      {
        id: '30-day',
        name: '30-Day Challenge',
        description: 'Master the practice with 30 days',
        duration: 30,
        icon: '🏆',
      },
    ];
  }

  async joinChallenge(userId: string, challengeId: string) {
    // TODO: Store in UserChallenge model
    // For now, return mock data
    const now = new Date();
    const duration = challengeId === '7-day' ? 7 : challengeId === '21-day' ? 21 : 30;
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + duration);

    return {
      challengeId,
      userId,
      startDate: now,
      endDate,
      progress: 0,
      target: duration,
      status: 'in_progress',
    };
  }

  async getUserChallenges(userId: string) {
    // TODO: Query from UserChallenge model
    // For now, return empty
    return [];
  }
}
