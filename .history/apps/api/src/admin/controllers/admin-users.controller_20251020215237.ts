import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminUsersService } from '../services/admin-users.service';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ChangeRoleDto, BanUserDto, UnbanUserDto } from '../dto';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get all users with filters' })
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: 'USER' | 'ADMIN',
    @Query('isBanned') isBanned?: string,
    @Query('createdAfter') createdAfter?: string,
    @Query('createdBefore') createdBefore?: string,
  ) {
    const filters: any = {};
    if (search) filters.search = search;
    if (role) filters.role = role;
    if (isBanned !== undefined) filters.isBanned = isBanned === 'true';
    if (createdAfter) filters.createdAfter = new Date(createdAfter);
    if (createdBefore) filters.createdBefore = new Date(createdBefore);

    return this.adminUsersService.getUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      filters,
    );
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats() {
    return this.adminUsersService.getUserStats();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.adminUsersService.getUserById(id);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Change user role (ADMIN only)' })
  async changeUserRole(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body() dto: ChangeRoleDto,
  ) {
    const adminId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.adminUsersService.changeUserRole(
      adminId,
      targetUserId,
      dto.newRole,
      dto.reason,
      ipAddress,
    );
  }

  @Post(':id/ban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ban user' })
  async banUser(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body() dto: BanUserDto,
  ) {
    const adminId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.adminUsersService.banUser(
      adminId,
      targetUserId,
      dto.reason,
      dto.durationDays,
      dto.permanent,
      ipAddress,
    );
  }

  @Delete(':id/ban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unban user' })
  async unbanUser(
    @Req() req: any,
    @Param('id') targetUserId: string,
    @Body() dto: UnbanUserDto,
  ) {
    const adminId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.adminUsersService.unbanUser(
      adminId,
      targetUserId,
      dto.reason,
      ipAddress,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user permanently (ADMIN only)' })
  async deleteUser(@Param('id') id: string) {
    return this.adminUsersService.deleteUser(id);
  }
}
