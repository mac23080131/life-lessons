import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Get public anonymous feed' })
  async getPublicFeed(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.communityService.getPublicFeed(limit, offset);
  }

  @Post('lessons/:id/react')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'React to a public lesson (thank_you)' })
  async reactToLesson(@Req() req, @Param('id') id: string, @Body() data: { type: string }) {
    return this.communityService.reactToLesson(req.user.userId, id, data.type);
  }

  @Post('lessons/:id/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a public lesson' })
  async reportLesson(@Req() req, @Param('id') id: string, @Body() data: { reason?: string }) {
    return this.communityService.reportLesson(req.user.userId, id, data.reason);
  }

  @Get('challenges')
  @ApiOperation({ summary: 'Get available challenges' })
  async getChallenges() {
    return this.communityService.getChallenges();
  }

  @Post('challenges/:id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a challenge' })
  async joinChallenge(@Req() req, @Param('id') id: string) {
    return this.communityService.joinChallenge(req.user.userId, id);
  }

  @Get('my-challenges')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user challenges' })
  async getMyChallenges(@Req() req) {
    return this.communityService.getUserChallenges(req.user.userId);
  }
}
