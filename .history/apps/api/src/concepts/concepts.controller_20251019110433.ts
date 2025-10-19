import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConceptsService } from './concepts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ConceptDto,
  CreateConceptDto,
  UpdateConceptDto,
  CreatePracticeDto,
  CreateExampleDto,
  CreateQuestionDto,
  CreateRelationDto,
  SearchConceptsDto,
  ConceptCategoryDto,
  CreateCategoryDto,
} from './dto/concept.dto';

@ApiTags('concepts')
@Controller('concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}

  // ========== Public Endpoints ==========

  @Get('categories')
  @ApiOperation({ summary: 'Get all concept categories' })
  @ApiResponse({ status: 200, type: [ConceptCategoryDto] })
  async getCategories() {
    return this.conceptsService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category with concepts' })
  @ApiResponse({ status: 200, type: ConceptCategoryDto })
  async getCategory(@Param('id') id: string) {
    return this.conceptsService.findCategory(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search concepts' })
  @ApiResponse({ status: 200 })
  async searchConcepts(@Query() query: SearchConceptsDto) {
    return this.conceptsService.searchConcepts(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get concept by ID' })
  @ApiResponse({ status: 200, type: ConceptDto })
  async getConcept(@Param('id') id: string) {
    return this.conceptsService.findConcept(id);
  }

  // ========== Admin Endpoints ==========

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create category' })
  @ApiResponse({ status: 201, type: ConceptCategoryDto })
  async createCategory(@Body() data: CreateCategoryDto) {
    return this.conceptsService.createCategory(data);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update category' })
  @ApiResponse({ status: 200, type: ConceptCategoryDto })
  async updateCategory(
    @Param('id') id: string,
    @Body() data: Partial<CreateCategoryDto>,
  ) {
    return this.conceptsService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete category' })
  @ApiResponse({ status: 200 })
  async deleteCategory(@Param('id') id: string) {
    return this.conceptsService.deleteCategory(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create concept' })
  @ApiResponse({ status: 201, type: ConceptDto })
  async createConcept(@Body() data: CreateConceptDto) {
    return this.conceptsService.createConcept(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update concept' })
  @ApiResponse({ status: 200, type: ConceptDto })
  async updateConcept(
    @Param('id') id: string,
    @Body() data: UpdateConceptDto,
  ) {
    return this.conceptsService.updateConcept(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete concept' })
  @ApiResponse({ status: 200 })
  async deleteConcept(@Param('id') id: string) {
    return this.conceptsService.deleteConcept(id);
  }

  // ========== Practices ==========

  @Post(':id/practices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Add practice to concept' })
  @ApiResponse({ status: 201 })
  async addPractice(
    @Param('id') conceptId: string,
    @Body() data: CreatePracticeDto,
  ) {
    return this.conceptsService.addPractice(conceptId, data);
  }

  @Put('practices/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update practice' })
  @ApiResponse({ status: 200 })
  async updatePractice(
    @Param('id') id: string,
    @Body() data: Partial<CreatePracticeDto>,
  ) {
    return this.conceptsService.updatePractice(id, data);
  }

  @Delete('practices/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete practice' })
  @ApiResponse({ status: 200 })
  async deletePractice(@Param('id') id: string) {
    return this.conceptsService.deletePractice(id);
  }

  // ========== Examples ==========

  @Post(':id/examples')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Add example to concept' })
  @ApiResponse({ status: 201 })
  async addExample(
    @Param('id') conceptId: string,
    @Body() data: CreateExampleDto,
  ) {
    return this.conceptsService.addExample(conceptId, data);
  }

  @Put('examples/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update example' })
  @ApiResponse({ status: 200 })
  async updateExample(
    @Param('id') id: string,
    @Body() data: Partial<CreateExampleDto>,
  ) {
    return this.conceptsService.updateExample(id, data);
  }

  @Delete('examples/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete example' })
  @ApiResponse({ status: 200 })
  async deleteExample(@Param('id') id: string) {
    return this.conceptsService.deleteExample(id);
  }

  // ========== Questions ==========

  @Post(':id/questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Add question to concept' })
  @ApiResponse({ status: 201 })
  async addQuestion(
    @Param('id') conceptId: string,
    @Body() data: CreateQuestionDto,
  ) {
    return this.conceptsService.addQuestion(conceptId, data);
  }

  @Put('questions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update question' })
  @ApiResponse({ status: 200 })
  async updateQuestion(
    @Param('id') id: string,
    @Body() data: Partial<CreateQuestionDto>,
  ) {
    return this.conceptsService.updateQuestion(id, data);
  }

  @Delete('questions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete question' })
  @ApiResponse({ status: 200 })
  async deleteQuestion(@Param('id') id: string) {
    return this.conceptsService.deleteQuestion(id);
  }

  // ========== Relations ==========

  @Post(':id/relations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Add relation to concept' })
  @ApiResponse({ status: 201 })
  async addRelation(
    @Param('id') aId: string,
    @Body() data: CreateRelationDto,
  ) {
    return this.conceptsService.addRelation(aId, data);
  }

  @Delete('relations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete relation' })
  @ApiResponse({ status: 200 })
  async deleteRelation(@Param('id') id: string) {
    return this.conceptsService.deleteRelation(id);
  }

  // ========== User Progress ==========

  @Get('progress/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my concept progress' })
  @ApiResponse({ status: 200 })
  async getMyProgress(@Req() req: any) {
    return this.conceptsService.getUserProgress(req.user.userId);
  }

  @Post(':id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update concept progress' })
  @ApiResponse({ status: 200 })
  async updateProgress(
    @Req() req: any,
    @Param('id') conceptId: string,
    @Body() data: {
      status?: string;
      practicesCount?: number;
      rating?: number;
      notes?: string;
    },
  ) {
    return this.conceptsService.updateUserProgress(
      req.user.userId,
      conceptId,
      data,
    );
  }

  // ========== Bulk Import ==========

  @Post('bulk-import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Bulk import concepts' })
  @ApiResponse({ status: 200 })
  async bulkImport(@Body() data: { concepts: CreateConceptDto[] }) {
    return this.conceptsService.bulkImport(data.concepts);
  }
}
