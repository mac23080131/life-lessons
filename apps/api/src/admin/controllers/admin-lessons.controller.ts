import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminLessonsService } from '../services/admin-lessons.service';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin - Lessons')
@ApiBearerAuth()
@Controller('admin/lessons')
@UseGuards(AdminGuard)
export class AdminLessonsController {
  constructor(private readonly adminLessonsService: AdminLessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons with filters' })
  async getLessons(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('userId') userId?: string,
    @Query('domain') domain?: string,
    @Query('visibility') visibility?: string,
    @Query('createdAfter') createdAfter?: string,
    @Query('createdBefore') createdBefore?: string,
  ) {
    const filters: any = {};
    if (search) filters.search = search;
    if (userId) filters.userId = userId;
    if (domain) filters.domain = domain;
    if (visibility) filters.visibility = visibility;
    if (createdAfter) filters.createdAfter = new Date(createdAfter);
    if (createdBefore) filters.createdBefore = new Date(createdBefore);

    return this.adminLessonsService.getLessons(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      filters,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get lesson statistics' })
  async getLessonStats() {
    return this.adminLessonsService.getLessonStats();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lesson' })
  async deleteLesson(@Param('id') id: string) {
    return this.adminLessonsService.deleteLesson(id);
  }

  @Patch(':id/visibility')
  @ApiOperation({ summary: 'Update lesson visibility' })
  async updateLessonVisibility(
    @Param('id') id: string,
    @Body('visibility') visibility: string,
  ) {
    return this.adminLessonsService.updateLessonVisibility(id, visibility);
  }
}
