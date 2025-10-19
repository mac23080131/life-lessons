import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminConceptsService } from '../services/admin-concepts.service';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin - Concepts')
@ApiBearerAuth()
@Controller('admin/concepts')
@UseGuards(AdminGuard)
export class AdminConceptsController {
  constructor(private readonly adminConceptsService: AdminConceptsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all concepts with filters' })
  async getConcepts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('difficulty') difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
  ) {
    const filters: any = {};
    if (search) filters.search = search;
    if (categoryId) filters.categoryId = categoryId;
    if (difficulty) filters.difficulty = difficulty;

    return this.adminConceptsService.getConcepts(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      filters,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get concept statistics' })
  async getConceptStats() {
    return this.adminConceptsService.getConceptStats();
  }

  @Post()
  @ApiOperation({ summary: 'Create new concept' })
  async createConcept(@Body() data: any) {
    return this.adminConceptsService.createConcept(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update concept' })
  async updateConcept(@Param('id') id: string, @Body() data: any) {
    return this.adminConceptsService.updateConcept(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete concept' })
  async deleteConcept(@Param('id') id: string) {
    return this.adminConceptsService.deleteConcept(id);
  }

  @Post(':id/practices')
  @ApiOperation({ summary: 'Add practice to concept' })
  async addPractice(@Param('id') id: string, @Body() data: any) {
    return this.adminConceptsService.addPractice(id, data);
  }

  @Post(':id/examples')
  @ApiOperation({ summary: 'Add example to concept' })
  async addExample(@Param('id') id: string, @Body() data: any) {
    return this.adminConceptsService.addExample(id, data);
  }

  @Post(':id/questions')
  @ApiOperation({ summary: 'Add question to concept' })
  async addQuestion(@Param('id') id: string, @Body() data: any) {
    return this.adminConceptsService.addQuestion(id, data);
  }
}
