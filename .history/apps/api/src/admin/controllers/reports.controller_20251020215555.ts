import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateReportDto, ReviewReportDto } from '../dto';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a report (any authenticated user)' })
  async createReport(@Req() req: any, @Body() dto: CreateReportDto) {
    const reporterId = req.user.id;
    return this.reportsService.createReport(reporterId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my reports' })
  async getMyReports(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.id;
    return this.reportsService.getUserReports(
      userId,
      parseInt(page || '1'),
      parseInt(limit || '20'),
    );
  }
}

@ApiTags('Admin - Reports')
@ApiBearerAuth()
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get all reports (MODERATOR/ADMIN)' })
  async getReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('contentType') contentType?: string,
    @Query('reason') reason?: string,
    @Query('reporterId') reporterId?: string,
    @Query('reportedUserId') reportedUserId?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (contentType) filters.contentType = contentType;
    if (reason) filters.reason = reason;
    if (reporterId) filters.reporterId = reporterId;
    if (reportedUserId) filters.reportedUserId = reportedUserId;

    return this.reportsService.getReports(
      parseInt(page || '1'),
      parseInt(limit || '20'),
      filters,
    );
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get report statistics' })
  async getReportStats() {
    return this.reportsService.getReportStats();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get report by ID' })
  async getReportById(@Param('id') id: string) {
    return this.reportsService.getReportById(id);
  }

  @Patch(':id/review')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review report (change status)' })
  async reviewReport(
    @Req() req: any,
    @Param('id') reportId: string,
    @Body() dto: ReviewReportDto,
  ) {
    const moderatorId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    return this.reportsService.reviewReport(
      moderatorId,
      reportId,
      dto.status,
      dto.resolution,
      ipAddress,
    );
  }
}
