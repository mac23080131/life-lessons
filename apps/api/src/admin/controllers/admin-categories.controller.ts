import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin - Categories')
@ApiBearerAuth()
@Controller('admin/categories')
@UseGuards(AdminGuard)
export class AdminCategoriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all concept categories' })
  async getCategories() {
    return this.prisma.conceptCategory.findMany({
      include: {
        _count: { select: { concepts: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  async createCategory(@Body() data: { key: string; name: string; nameEn: string }) {
    return this.prisma.conceptCategory.create({ data });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(
    @Param('id') id: string,
    @Body() data: { name?: string; nameEn?: string },
  ) {
    return this.prisma.conceptCategory.update({ where: { id }, data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id') id: string) {
    return this.prisma.conceptCategory.delete({ where: { id } });
  }
}
