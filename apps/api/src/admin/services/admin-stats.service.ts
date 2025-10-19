import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminStatsService {
  constructor(private prisma: PrismaService) {}

  async getOverviewStats() {
    const [
      totalUsers,
      totalLessons,
      totalConcepts,
      totalGoals,
      activeUsersThisWeek,
      newLessonsThisWeek,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.lesson.count(),
      this.prisma.concept.count(),
      this.prisma.goal.count(),
      this.prisma.lesson.groupBy({
        by: ['userId'],
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        _count: true,
      }),
      this.prisma.lesson.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
    ]);

    return {
      users: { total: totalUsers, activeThisWeek: activeUsersThisWeek.length },
      lessons: { total: totalLessons, thisWeek: newLessonsThisWeek },
      concepts: { total: totalConcepts },
      goals: { total: totalGoals },
    };
  }

  async getGrowthStats(days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [userGrowth, lessonGrowth] = await Promise.all([
      this.prisma.$queryRaw`
        SELECT 
          DATE("createdAt") as date,
          COUNT(*) as count
        FROM "users"
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      this.prisma.$queryRaw`
        SELECT 
          DATE("createdAt") as date,
          COUNT(*) as count
        FROM "lessons"
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ]);

    return { userGrowth, lessonGrowth };
  }

  async getEngagementStats() {
    const [avgLessonsPerUser, usersWithGoals, conceptProgress] = await Promise.all([
      this.prisma.lesson.groupBy({ by: ['userId'], _count: true }),
      this.prisma.goal.groupBy({ by: ['userId'], _count: true }),
      this.prisma.userConceptProgress.count(),
    ]);

    const totalLessons = avgLessonsPerUser.reduce((acc, u) => acc + u._count, 0);
    const avgPerUser = totalLessons / avgLessonsPerUser.length || 0;

    return {
      averageLessonsPerUser: Math.round(avgPerUser * 10) / 10,
      usersWithGoals: usersWithGoals.length,
      conceptProgressEntries: conceptProgress,
    };
  }
}
