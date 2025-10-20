import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole } from '@prisma/client';

export class ChangeRoleDto {
  @IsUUID()
  userId: string;

  @IsEnum(UserRole)
  newRole: UserRole;

  @IsOptional()
  @IsString()
  reason?: string;
}
