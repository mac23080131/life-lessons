import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('goals')
@Controller('goals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal (10,000 lessons)' })
  async create(@Req() req) {
    return this.goalsService.create(req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user goal' })
  async getMyGoal(@Req() req) {
    return this.goalsService.findByUserId(req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update goal settings' })
  async update(
    @Param('id') id: string,
    @Body() data: { target?: number; sprintSize?: number; cadence?: string; status?: string },
  ) {
    return this.goalsService.update(id, data);
  }

  @Get(':id/roadmap')
  @ApiOperation({ summary: 'Get goal roadmap with sprints' })
  async getRoadmap(@Param('id') id: string) {
    return this.goalsService.getRoadmap(id);
  }
}
