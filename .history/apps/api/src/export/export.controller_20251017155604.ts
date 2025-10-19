import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExportService } from './export.service';

@ApiTags('export')
@Controller('export')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get()
  @ApiQuery({ name: 'format', enum: ['json', 'csv', 'markdown'], required: false })
  async exportLessons(
    @Req() req: any,
    @Query('format') format: 'json' | 'csv' | 'markdown' = 'json',
  ) {
    const userId = req.user.sub;
    return this.exportService.exportUserLessons(userId, format);
  }
}
