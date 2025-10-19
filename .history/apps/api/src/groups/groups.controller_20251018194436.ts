import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  async create(@Req() req, @Body() data: { name: string }) {
    return this.groupsService.create(req.user.userId, data.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get user groups' })
  async getMyGroups(@Req() req) {
    return this.groupsService.getUserGroups(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group details' })
  async getGroup(@Param('id') id: string) {
    return this.groupsService.getGroup(id);
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Get group leaderboard (streak)' })
  async getLeaderboard(@Param('id') id: string) {
    return this.groupsService.getLeaderboard(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join group by invite code' })
  async joinGroup(@Req() req, @Param('id') id: string, @Body() data: { code: string }) {
    return this.groupsService.joinGroup(req.user.userId, id, data.code);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave group' })
  async leaveGroup(@Req() req, @Param('id') id: string) {
    return this.groupsService.leaveGroup(req.user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group (admin only)' })
  async deleteGroup(@Req() req, @Param('id') id: string) {
    return this.groupsService.deleteGroup(req.user.userId, id);
  }
}
