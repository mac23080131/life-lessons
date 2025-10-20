import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class BanUserDto {
  @IsUUID()
  userId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number; // Số ngày ban (null = permanent)

  @IsOptional()
  @IsBoolean()
  permanent?: boolean;
}
