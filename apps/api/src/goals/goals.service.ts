import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addDays } from 'date-fns';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, target: number = 10000, sprintSize: number = 100) {
    const goal = await this.prisma.goal.create({
      data: {
        userId,
        type: 'lesson_count',
        target,
        sprintSize,
        cadence: 'daily',
        status: 'active',
      },
    });

    // Create first sprint
    await this.createSprint(goal.id, 1);

    return goal;
  }

  async findByUserId(userId: string) {
    return this.prisma.goal.findFirst({
      where: { userId, type: 'lesson_count' },
      include: {
        sprints: {
          orderBy: { index: 'asc' },
        },
      },
    });
  }

  async getRoadmap(goalId: string) {
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
      include: {
        sprints: {
          orderBy: { index: 'asc' },
        },
      },
    });

    const totalSprints = Math.ceil(goal.target / goal.sprintSize);
    const currentSprint = goal.sprints.find((s) => s.done < s.target) || goal.sprints[goal.sprints.length - 1];

    return {
      goal,
      totalSprints,
      currentSprint,
      progress: (goal.current / goal.target) * 100,
    };
  }

  async updateProgress(userId: string) {
    const goal = await this.findByUserId(userId);
    if (!goal) return null;

    const lessonCount = await this.prisma.lesson.count({
      where: { userId },
    });

    await this.prisma.goal.update({
      where: { id: goal.id },
      data: { current: lessonCount },
    });

    // Update current sprint
    const currentSprint = goal.sprints.find((s) => s.done < s.target);
    if (currentSprint) {
      const sprintLessons = await this.prisma.lesson.count({
        where: {
          userId,
          createdAt: {
            gte: currentSprint.startAt,
            lte: currentSprint.endAt,
          },
        },
      });

      await this.prisma.sprint.update({
        where: { id: currentSprint.id },
        data: { done: sprintLessons },
      });

      // Create next sprint if current is complete
      if (sprintLessons >= currentSprint.target) {
        await this.createSprint(goal.id, currentSprint.index + 1);
      }
    }

    return this.findByUserId(userId);
  }

  async update(goalId: string, data: { target?: number; sprintSize?: number; cadence?: string; status?: string }) {
    return this.prisma.goal.update({
      where: { id: goalId },
      data,
    });
  }

  private async createSprint(goalId: string, index: number) {
    const goal = await this.prisma.goal.findUnique({ where: { id: goalId } });
    const now = new Date();

    return this.prisma.sprint.create({
      data: {
        goalId,
        index,
        startAt: now,
        endAt: addDays(now, 30), // 30 days per sprint
        target: goal.sprintSize,
        done: 0,
      },
    });
  }
}
