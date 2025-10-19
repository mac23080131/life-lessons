import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminStatsService } from '../services/admin-stats.service';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin - Statistics')
@ApiBearerAuth()
@Controller('admin/stats')
@UseGuards(AdminGuard)
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get overview statistics' })
  async getOverviewStats() {
    return this.adminStatsService.getOverviewStats();
  }

  @Get('growth')
  @ApiOperation({ summary: 'Get growth statistics (30 days)' })
  async getGrowthStats() {
    return this.adminStatsService.getGrowthStats(30);
  }

  @Get('engagement')
  @ApiOperation({ summary: 'Get engagement statistics' })
  async getEngagementStats() {
    return this.adminStatsService.getEngagementStats();
  }
}
