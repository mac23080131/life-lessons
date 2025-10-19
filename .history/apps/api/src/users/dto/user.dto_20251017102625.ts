import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Privacy } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'vi' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiProperty({ required: false, example: 'Asia/Bangkok' })
  @IsOptional()
  @IsString()
  tz?: string;

  @ApiProperty({ required: false, enum: Privacy })
  @IsOptional()
  @IsEnum(Privacy)
  privacyDefault?: Privacy;
}
