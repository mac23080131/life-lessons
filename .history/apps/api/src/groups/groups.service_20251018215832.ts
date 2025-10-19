import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name: string) {
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const group = await this.prisma.group.create({
      data: {
        name,
        ownerId: userId,
        inviteCode,
        members: {
          create: {
            userId,
            role: 'admin',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return group;
  }

  async getUserGroups(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return memberships.map((m) => m.group);
  }

  async getGroup(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async getLeaderboard(groupId: string) {
    const members = await this.prisma.membership.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Calculate streak for each member
    const leaderboard = await Promise.all(
      members.map(async (member) => {
        const streak = await this.calculateStreak(member.userId);
        return {
          userId: member.userId,
          name: member.user.name || 'Anonymous',
          streak,
          role: member.role,
        };
      }),
    );

    // Sort by streak descending
    return leaderboard.sort((a, b) => b.streak - a.streak);
  }

  async joinGroup(userId: string, groupId: string, code: string) {
    // TODO: Validate invite code (store in Group model or separate table)
    const existingMembership = await this.prisma.membership.findFirst({
      where: { userId, groupId },
    });

    if (existingMembership) {
      throw new ForbiddenException('Already a member');
    }

    return this.prisma.membership.create({
      data: {
        userId,
        groupId,
        role: 'member',
      },
    });
  }

  async leaveGroup(userId: string, groupId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, groupId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    // Cannot leave if you're the owner
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (group.ownerId === userId) {
      throw new ForbiddenException('Owner cannot leave group. Delete the group instead.');
    }

    return this.prisma.membership.delete({
      where: { id: membership.id },
    });
  }

  async deleteGroup(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.ownerId !== userId) {
      throw new ForbiddenException('Only owner can delete group');
    }

    // Delete all memberships first
    await this.prisma.membership.deleteMany({
      where: { groupId },
    });

    return this.prisma.group.delete({
      where: { id: groupId },
    });
  }

  private async calculateStreak(userId: string): Promise<number> {
    const lessons = await this.prisma.lesson.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    if (lessons.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const lesson of lessons) {
      const lessonDate = new Date(lesson.createdAt);
      lessonDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - lessonDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        if (diffDays === 1) {
          currentDate = lessonDate;
          streak++;
        } else if (streak === 0) {
          streak = 1;
        }
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  }
}
