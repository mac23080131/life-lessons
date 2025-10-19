import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Get('community')
  @ApiOperation({ summary: 'Get community challenges' })
  async getCommunityChallenges() {
    return this.challengesService.getCommunityChallenges();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my active challenges' })
  async getMyChallenges(@Req() req) {
    return this.challengesService.getUserChallenges(req.user.userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a challenge' })
  async joinChallenge(@Req() req, @Param('id') id: string) {
    return this.challengesService.joinChallenge(req.user.userId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create custom challenge' })
  async createChallenge(@Req() req, @Body() data: any) {
    return this.challengesService.createChallenge({
      ...data,
      createdBy: req.user.userId,
    });
  }

  @Get('group/:groupId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get group challenges' })
  async getGroupChallenges(@Param('groupId') groupId: string) {
    return this.challengesService.getGroupChallenges(groupId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete challenge' })
  async deleteChallenge(@Req() req, @Param('id') id: string) {
    return this.challengesService.deleteChallenge(id, req.user.userId);
  }
}
