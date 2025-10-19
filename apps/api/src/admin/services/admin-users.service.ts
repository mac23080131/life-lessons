import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface UserFilters {
  search?: string;
  role?: 'USER' | 'ADMIN';
  createdAfter?: Date;
  createdBefore?: Date;
}

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(page = 1, limit = 20, filters: UserFilters = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.role) where.role = filters.role;

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          locale: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { lessons: true, goals: true, reminders: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        locale: true,
        tz: true,
        privacyDefault: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            lessons: true,
            goals: true,
            reminders: true,
            memberships: true,
            reactions: true,
            conceptProgress: true,
          },
        },
      },
    });

    if (!user) throw new Error('User not found');

    const recentLessons = await this.prisma.lesson.findMany({
      where: { userId: id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, contentRaw: true, domain: true, createdAt: true },
    });

    return { ...user, recentActivity: { lessons: recentLessons } };
  }

  async updateUserRole(id: string, role: 'USER' | 'ADMIN') {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getUserStats() {
    const [totalUsers, adminCount, userCount, newUsersThisWeek, newUsersThisMonth] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { role: 'ADMIN' } }),
        this.prisma.user.count({ where: { role: 'USER' } }),
        this.prisma.user.count({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        }),
        this.prisma.user.count({
          where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        }),
      ]);

    return { totalUsers, adminCount, userCount, newUsersThisWeek, newUsersThisMonth };
  }
}
