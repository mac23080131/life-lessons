import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UnbanUserDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
