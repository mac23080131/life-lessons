import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { UserRole } from '@prisma/client';

interface UserFilters {
  search?: string;
  role?: UserRole;
  createdAfter?: Date;
  createdBefore?: Date;
  isBanned?: boolean;
}

@Injectable()
export class AdminUsersService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

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

    if (filters.isBanned !== undefined) where.isBanned = filters.isBanned;

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
          isBanned: true,
          banReason: true,
          banUntil: true,
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

  /**
   * Change user role with audit logging and validation
   */
  async changeUserRole(
    adminId: string,
    targetUserId: string,
    newRole: UserRole,
    reason?: string,
    ipAddress?: string,
  ) {
    // Prevent admin from changing their own role
    if (adminId === targetUserId) {
      throw new BadRequestException('Cannot change your own role');
    }

    // Get target user
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Get admin user
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true, email: true },
    });

    // Only ADMIN can change roles
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can change user roles');
    }

    const oldRole = targetUser.role;

    // Update role
    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { id: true, email: true, name: true, role: true },
    });

    // Log action
    await this.auditLog.log({
      userId: adminId,
      action: 'USER_ROLE_CHANGED',
      entityType: 'User',
      entityId: targetUserId,
      metadata: {
        oldRole,
        newRole,
        reason: reason || 'No reason provided',
        targetEmail: targetUser.email,
        adminEmail: admin.email,
      },
      ipAddress,
    });

    return updatedUser;
  }

  /**
   * Ban user with reason and optional duration
   */
  async banUser(
    adminId: string,
    targetUserId: string,
    reason: string,
    durationDays?: number,
    permanent = false,
    ipAddress?: string,
  ) {
    // Prevent banning yourself
    if (adminId === targetUserId) {
      throw new BadRequestException('Cannot ban yourself');
    }

    // Get target user
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true, role: true, isBanned: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Get admin user
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true, email: true },
    });

    // Moderators cannot ban admins
    if (targetUser.role === UserRole.ADMIN && admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Moderators cannot ban administrators');
    }

    // Calculate ban expiry
    let banUntil: Date | null = null;
    if (!permanent && durationDays) {
      banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + durationDays);
    }

    // Ban user
    const bannedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        isBanned: true,
        banReason: reason,
        banUntil,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isBanned: true,
        banReason: true,
        banUntil: true,
      },
    });

    // Log action
    await this.auditLog.log({
      userId: adminId,
      action: 'USER_BANNED',
      entityType: 'User',
      entityId: targetUserId,
      metadata: {
        reason,
        durationDays: durationDays || null,
        permanent,
        banUntil: banUntil?.toISOString() || null,
        targetEmail: targetUser.email,
        targetRole: targetUser.role,
        adminEmail: admin.email,
        adminRole: admin.role,
      },
      ipAddress,
    });

    return bannedUser;
  }

  /**
   * Unban user
   */
  async unbanUser(adminId: string, targetUserId: string, reason?: string, ipAddress?: string) {
    // Get target user
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true, isBanned: true, banReason: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    if (!targetUser.isBanned) {
      throw new BadRequestException('User is not banned');
    }

    // Get admin user
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { email: true },
    });

    // Unban user
    const unbannedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        isBanned: false,
        banReason: null,
        banUntil: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isBanned: true,
      },
    });

    // Log action
    await this.auditLog.log({
      userId: adminId,
      action: 'USER_UNBANNED',
      entityType: 'User',
      entityId: targetUserId,
      metadata: {
        reason: reason || 'No reason provided',
        previousBanReason: targetUser.banReason,
        targetEmail: targetUser.email,
        adminEmail: admin.email,
      },
      ipAddress,
    });

    return unbannedUser;
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
