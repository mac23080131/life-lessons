import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin - Audit Logs')
@ApiBearerAuth()
@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all audit logs with filters (ADMIN only)' })
  async getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (entityType) filters.entityType = entityType;
    if (entityId) filters.entityId = entityId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.auditLogService.getAuditLogs(
      parseInt(page || '1'),
      parseInt(limit || '50'),
      filters,
    );
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get audit logs for specific user' })
  async getUserAuditLogs(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.getUserAuditLogs(
      userId,
      parseInt(page || '1'),
      parseInt(limit || '50'),
    );
  }

  @Get('actions')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get list of all action types' })
  async getActionTypes() {
    // Return common action types
    return {
      actions: [
        'USER_ROLE_CHANGED',
        'USER_BANNED',
        'USER_UNBANNED',
        'USER_DELETED',
        'LESSON_DELETED',
        'LESSON_VISIBILITY_CHANGED',
        'CONCEPT_CREATED',
        'CONCEPT_UPDATED',
        'CONCEPT_DELETED',
        'REPORT_REVIEWED',
        'REPORT_RESOLVED',
      ],
    };
  }
}
