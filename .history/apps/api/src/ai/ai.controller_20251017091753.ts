import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('lessons/:id/analyze')
  @ApiOperation({ summary: 'Analyze lesson with AI (mock)' })
  async analyzeLesson(@Param('id') id: string) {
    return this.aiService.analyzeLesson(id);
  }
}
