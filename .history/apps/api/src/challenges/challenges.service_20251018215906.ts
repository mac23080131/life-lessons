import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  // Get predefined community challenges
  async getCommunityChallen ges() {
    return this.prisma.challenge.findMany({
      where: {
        type: 'COMMUNITY',
        isActive: true,
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get user's active challenges
  async getUserChallenges(userId: string) {
    const participants = await this.prisma.challengeParticipant.findMany({
      where: {
        userId,
        status: {
          in: ['ACTIVE', 'COMPLETED'],
        },
      },
      include: {
        challenge: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return participants.map((p) => ({
      ...p.challenge,
      current: p.current,
      streak: p.streak,
      status: p.status,
      joinedAt: p.joinedAt,
      completedAt: p.completedAt,
      daysLeft: this.calculateDaysLeft(p.joinedAt, p.challenge.duration),
    }));
  }

  // Join a challenge
  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (!challenge.isActive) {
      throw new ForbiddenException('Challenge is not active');
    }

    // Check if already joined
    const existing = await this.prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId,
        },
      },
    });

    if (existing) {
      throw new ForbiddenException('Already joined this challenge');
    }

    return this.prisma.challengeParticipant.create({
      data: {
        challengeId,
        userId,
        status: 'ACTIVE',
      },
      include: {
        challenge: true,
      },
    });
  }

  // Create custom challenge
  async createChallenge(data: {
    name: string;
    description: string;
    type: 'COMMUNITY' | 'GROUP' | 'PERSONAL';
    scope: 'LESSON_COUNT' | 'STREAK' | 'DOMAIN_BALANCE' | 'DAILY_PRACTICE';
    target: number;
    duration: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    groupId?: string;
    createdBy: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.challenge.create({
      data,
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Update challenge progress (called when user creates a lesson)
  async updateProgress(userId: string, challengeId: string, increment: number = 1) {
    const participant = await this.prisma.challengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId,
        },
      },
      include: {
        challenge: true,
      },
    });

    if (!participant) {
      return null;
    }

    const newCurrent = participant.current + increment;
    const completed = newCurrent >= participant.challenge.target;

    return this.prisma.challengeParticipant.update({
      where: {
        id: participant.id,
      },
      data: {
        current: newCurrent,
        status: completed ? 'COMPLETED' : 'ACTIVE',
        completedAt: completed ? new Date() : null,
      },
    });
  }

  // Get group challenges
  async getGroupChallenges(groupId: string) {
    return this.prisma.challenge.findMany({
      where: {
        groupId,
        isActive: true,
      },
      include: {
        _count: {
          select: { participants: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Delete challenge (admin only)
  async deleteChallenge(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (challenge.createdBy !== userId) {
      throw new ForbiddenException('Only creator can delete challenge');
    }

    return this.prisma.challenge.delete({
      where: { id: challengeId },
    });
  }

  // Helper methods
  private calculateDaysLeft(joinedAt: Date, duration: number): number {
    const endDate = new Date(joinedAt);
    endDate.setDate(endDate.getDate() + duration);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
