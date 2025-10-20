import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportReason } from '@prisma/client';

export class CreateReportDto {
  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsString()
  contentType: string; // 'Lesson', 'Comment', etc.

  @IsUUID()
  contentId: string;

  @IsOptional()
  @IsUUID()
  reportedUserId?: string; // ID của user bị báo cáo

  @IsOptional()
  @IsString()
  details?: string; // Thông tin bổ sung
}
