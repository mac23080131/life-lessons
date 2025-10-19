import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalConcepts,
      totalCategories,
      totalLessons,
      activeUsers,
      conceptsThisMonth,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.concept.count(),
      this.prisma.conceptCategory.count(),
      this.prisma.lesson.count(),
      this.prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.concept.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalConcepts,
      totalCategories,
      totalLessons,
      activeUsers,
      conceptsThisMonth,
    };
  }

  async getUsers(query?: string) {
    const where = query
      ? {
          OR: [
            { email: { contains: query, mode: 'insensitive' as const } },
            { name: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      users: users.map((user) => ({
        ...user,
        lessonsCount: user._count.lessons,
        lastLoginAt: user.updatedAt,
        isActive: true, // TODO: implement proper activity tracking
        _count: undefined,
      })),
    };
  }

  async updateUser(userId: string, data: { isActive?: boolean; role?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: data.role,
        // Store isActive in a separate field if needed
      },
    });
  }
}
