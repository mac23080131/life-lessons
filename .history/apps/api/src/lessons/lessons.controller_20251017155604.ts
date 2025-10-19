import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLessonDto, UpdateLessonDto, LessonQueryDto } from './dto/lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new lesson' })
  async create(@Req() req, @Body() dto: CreateLessonDto) {
    return this.lessonsService.create(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lessons for current user' })
  async findAll(@Req() req, @Query() query: LessonQueryDto) {
    return this.lessonsService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lesson by ID' })
  async findOne(@Req() req, @Param('id') id: string) {
    return this.lessonsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lesson' })
  async update(@Req() req, @Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lesson' })
  async delete(@Req() req, @Param('id') id: string) {
    return this.lessonsService.delete(id, req.user.userId);
  }

  @Post(':id/share')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create share link for lesson' })
  async createShareLink(@Req() req, @Param('id') id: string) {
    return this.lessonsService.createShareLink(id, req.user.userId);
  }

  @Get('shared/:token')
  @ApiOperation({ summary: 'View public shared lesson (no auth required)' })
  async viewSharedLesson(@Param('token') token: string) {
    return this.lessonsService.viewSharedLesson(token);
  }
}
