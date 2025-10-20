import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  /**
   * Create a new report (USER can report content)
   */
  async createReport(
    reporterId: string,
    data: {
      reason: any; // ReportReason enum
      contentType: string;
      contentId: string;
      reportedUserId?: string;
      details?: string;
    },
  ) {
    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: data.reportedUserId,
        contentType: data.contentType,
        contentId: data.contentId,
        reason: data.reason,
        details: data.details,
        status: 'PENDING', // ReportStatus.PENDING
      },
      include: {
        reporter: {
          select: { id: true, email: true, name: true },
        },
        reportedUser: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    // Log the report creation
    await this.auditLog.log({
      userId: reporterId,
      action: 'REPORT_CREATED',
      entityType: 'Report',
      entityId: report.id,
      metadata: {
        contentType: data.contentType,
        contentId: data.contentId,
        reason: data.reason,
      },
    });

    return report;
  }

  /**
   * Get all reports with filters (MODERATOR/ADMIN)
   */
  async getReports(
    page = 1,
    limit = 20,
    filters?: {
      status?: any; // ReportStatus
      contentType?: string;
      reason?: any; // ReportReason
      reporterId?: string;
      reportedUserId?: string;
    },
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.contentType) where.contentType = filters.contentType;
    if (filters?.reason) where.reason = filters.reason;
    if (filters?.reporterId) where.reporterId = filters.reporterId;
    if (filters?.reportedUserId) where.reportedUserId = filters.reportedUserId;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: { id: true, email: true, name: true },
          },
          reportedUser: {
            select: { id: true, email: true, name: true },
          },
          moderator: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data: reports,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: {
          select: { id: true, email: true, name: true, role: true },
        },
        reportedUser: {
          select: { id: true, email: true, name: true, role: true },
        },
        moderator: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  /**
   * Review report (change status) - MODERATOR/ADMIN
   */
  async reviewReport(
    moderatorId: string,
    reportId: string,
    status: any, // ReportStatus
    resolution?: string,
    ipAddress?: string,
  ) {
    const report = await this.getReportById(reportId);

    // Get moderator info
    const moderator = await this.prisma.user.findUnique({
      where: { id: moderatorId },
      select: { email: true, role: true },
    });

    const updatedReport = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        resolution,
        moderatorId,
        reviewedAt: new Date(),
      },
      include: {
        reporter: {
          select: { id: true, email: true, name: true },
        },
        reportedUser: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    // Log action
    await this.auditLog.log({
      userId: moderatorId,
      action: 'REPORT_REVIEWED',
      entityType: 'Report',
      entityId: reportId,
      metadata: {
        oldStatus: report.status,
        newStatus: status,
        resolution,
        contentType: report.contentType,
        contentId: report.contentId,
        moderatorEmail: moderator.email,
      },
      ipAddress,
    });

    return updatedReport;
  }

  /**
   * Get user's own reports
   */
  async getUserReports(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where: { reporterId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          reason: true,
          contentType: true,
          status: true,
          resolution: true,
          createdAt: true,
          reviewedAt: true,
        },
      }),
      this.prisma.report.count({ where: { reporterId: userId } }),
    ]);

    return {
      data: reports,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get report statistics
   */
  async getReportStats() {
    const [total, pending, reviewing, resolved, dismissed] = await Promise.all([
      this.prisma.report.count(),
      this.prisma.report.count({ where: { status: 'PENDING' } }),
      this.prisma.report.count({ where: { status: 'REVIEWING' } }),
      this.prisma.report.count({ where: { status: 'RESOLVED' } }),
      this.prisma.report.count({ where: { status: 'DISMISSED' } }),
    ]);

    return {
      total,
      pending,
      reviewing,
      resolved,
      dismissed,
    };
  }
}
