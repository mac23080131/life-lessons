import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Domain } from '@prisma/client';
import { startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [totalLessons, domainStats, streak, heatmap] = await Promise.all([
      this.getTotalLessons(userId),
      this.getDomainStats(userId),
      this.calculateStreak(userId),
      this.getHeatmap(userId),
    ]);

    return {
      totalLessons,
      domainStats,
      streak,
      heatmap,
    };
  }

  private async getTotalLessons(userId: string) {
    return this.prisma.lesson.count({ where: { userId } });
  }

  private async getDomainStats(userId: string) {
    const lessons = await this.prisma.lesson.groupBy({
      by: ['domain'],
      where: { userId },
      _count: true,
    });

    return Object.values(Domain).map((domain) => ({
      domain,
      count: lessons.find((l) => l.domain === domain)?._count || 0,
    }));
  }

  private async calculateStreak(userId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    if (lessons.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < lessons.length - 1; i++) {
      const current = new Date(lessons[i].createdAt);
      const next = new Date(lessons[i + 1].createdAt);
      current.setHours(0, 0, 0, 0);
      next.setHours(0, 0, 0, 0);

      const daysDiff = differenceInDays(current, next);

      if (daysDiff === 1) {
        streak++;
      } else if (daysDiff > 1) {
        break;
      }
    }

    // Check if streak is current (has lesson today or yesterday)
    const mostRecent = new Date(lessons[0].createdAt);
    mostRecent.setHours(0, 0, 0, 0);
    const daysSinceLastLesson = differenceInDays(today, mostRecent);

    if (daysSinceLastLesson > 1) {
      return 0; // Streak broken
    }

    return streak;
  }

  private async getHeatmap(userId: string) {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const lessons = await this.prisma.lesson.findMany({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: { createdAt: true },
    });

    // Group by date
    const heatmapData: Record<string, number> = {};
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    allDays.forEach((day) => {
      const dateKey = day.toISOString().split('T')[0];
      heatmapData[dateKey] = 0;
    });

    lessons.forEach((lesson) => {
      const dateKey = lesson.createdAt.toISOString().split('T')[0];
      heatmapData[dateKey] = (heatmapData[dateKey] || 0) + 1;
    });

    return Object.entries(heatmapData).map(([date, count]) => ({
      date,
      count,
    }));
  }
}
